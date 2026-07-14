import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { searchUniversities, findUniversity } from './data/universities';
import {
  verifyStudentIdentity,
  createUser,
  getUser,
  updateUserStatus,
  updateUserLocation,
  updateUserCampus,
  reportUser,
  rateMeet,
  getOnlineCount,
  saveUserBirth,
} from './services/auth';
import {
  joinQueue,
  leaveQueue,
  tryMatch,
  getQueueStatus,
} from './services/matching';
import {
  createChatRoom,
  getChatRoom,
  getUserRoom,
  getPartnerId,
  extendChat,
  endChat,
  addMessage,
  sendMeetInvite,
  respondMeetInvite,
  cleanExpiredRooms,
} from './services/chat';
import { calculateBaZi, analyzeCompatibility, formatBaZi, analyzePersonalBaZi } from './services/bazi';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'https://pengyixia.vercel.app',
      'https://meetu.live',
      'https://www.meetu.live',
      'https://pengyixia-api-production.up.railway.app',
    ],
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// ============ HTTP REST API ============

// 搜索学校
app.get('/api/universities/search', (req, res) => {
  const query = (req.query.q as string) || '';
  const results = searchUniversities(query);
  res.json({ success: true, data: results });
});

// 获取学校详情
app.get('/api/universities/:id', (req, res) => {
  const uni = findUniversity(parseInt(req.params.id));
  if (!uni) return res.status(404).json({ success: false, message: '学校不存在' });
  res.json({ success: true, data: uni });
});

// 学号+姓名认证
app.post('/api/auth/verify', (req, res) => {
  const { universityId, studentId, name } = req.body;
  if (!universityId || !studentId || !name) {
    return res.status(400).json({ success: false, message: '请填写学号和姓名' });
  }
  const result = verifyStudentIdentity(universityId, studentId, name);
  res.json(result);
});

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    online: getOnlineCount(),
    uptime: process.uptime(),
  });
});

// ---- 八字相关 API ----

// 计算个人八字
app.post('/api/bazi/calculate', (req, res) => {
  const { year, month, day, hour, gender } = req.body;
  if (!year || !month || !day || hour === undefined) {
    return res.status(400).json({ success: false, message: '请提供完整的出生年月日时' });
  }
  try {
    const chart = calculateBaZi(year, month, day, hour, gender || 'male');
    res.json({
      success: true,
      data: {
        chart,
        formatted: formatBaZi(chart),
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 八字合婚
app.post('/api/bazi/compatibility', (req, res) => {
  const { user1Birth, user2Birth } = req.body;
  if (!user1Birth || !user2Birth) {
    return res.status(400).json({ success: false, message: '请提供双方的出生信息' });
  }
  try {
    const chart1 = calculateBaZi(
      user1Birth.year, user1Birth.month, user1Birth.day,
      user1Birth.hour, user1Birth.gender || 'male'
    );
    const chart2 = calculateBaZi(
      user2Birth.year, user2Birth.month, user2Birth.day,
      user2Birth.hour, user2Birth.gender || 'female'
    );
    const compatibility = analyzeCompatibility(chart1, chart2);

    res.json({
      success: true,
      data: {
        chart1,
        chart2,
        compatibility,
        summary: {
          score: compatibility.overallScore,
          type: compatibility.relationshipType,
          warnings: compatibility.warnings,
        },
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 保存出生信息
app.post('/api/bazi/save-birth', (req, res) => {
  const { userId, year, month, day, hour, gender } = req.body;
  if (!userId || !year || !month || !day || hour === undefined) {
    return res.status(400).json({ success: false, message: '请提供完整信息' });
  }
  const user = saveUserBirth(userId, { year, month, day, hour });
  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  res.json({ success: true, message: '出生信息已保存' });
});

// 个人八字命理分析
app.post('/api/bazi/personal', (req, res) => {
  const { year, month, day, hour, gender } = req.body;
  if (!year || !month || !day || hour === undefined) {
    return res.status(400).json({ success: false, message: '请提供完整的出生信息' });
  }
  try {
    const chart = calculateBaZi(year, month, day, hour, gender || 'male');
    const reading = analyzePersonalBaZi(chart);
    res.json({
      success: true,
      data: {
        chart,
        formatted: formatBaZi(chart),
        reading,
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ============ 辅助函数 ============

function findSocketByUserId(userId: string) {
  const sockets = io.sockets.sockets;
  for (const [_, socket] of sockets) {
    if (socket.data.userId === userId) return socket;
  }
  return undefined;
}

// ============ Socket.IO 事件处理 ============

io.on('connection', (socket) => {
  console.log(`🔌 用户连接: ${socket.id}`);

  let currentUserId: string | null = null;

  // ---- 注册/登录 ----
  socket.on('register', (data: { universityId: number; gender: 'male' | 'female'; campusName?: string }) => {
    try {
      const user = createUser(data.universityId, data.gender, data.campusName);
      user.socketId = socket.id;
      currentUserId = user.id;
      socket.data.userId = user.id;

      socket.emit('registered', {
        success: true,
        user: {
          id: user.id,
          nickname: user.nickname,
          gender: user.gender,
          universityName: user.universityName,
          campusName: user.campusName,
          status: user.status,
          meetScore: user.meetScore,
          meetCount: user.meetCount,
        },
      });

      console.log(`✅ 用户注册: ${user.nickname} (${user.universityName})`);
    } catch (err: any) {
      socket.emit('registered', { success: false, message: err.message });
    }
  });

  // ---- 更新状态 ----
  socket.on('update_status', (data: { status: 'available' | 'busy' | 'studying' | 'invisible' }) => {
    if (!currentUserId) return;
    const user = updateUserStatus(currentUserId, data.status);
    if (user) {
      socket.emit('status_updated', { status: user.status });
    }
  });

  // ---- 更新位置 ----
  socket.on('update_location', (data: { lat: number; lng: number }) => {
    if (!currentUserId) return;
    updateUserLocation(currentUserId, data.lat, data.lng);
  });

  // ---- 更新校区 ----
  socket.on('update_campus', (data: { campusName: string }) => {
    if (!currentUserId) return;
    const user = updateUserCampus(currentUserId, data.campusName);
    if (user) {
      socket.emit('campus_updated', { campusName: user.campusName, lat: user.lat, lng: user.lng });
    }
  });

  // ---- 开始匹配 ----
  socket.on('start_match', (data: { preferNearby?: boolean }) => {
    if (!currentUserId) return;
    const user = getUser(currentUserId);
    if (!user) return;
    if (user.banned) {
      socket.emit('match_error', { message: '您的账号已被限制使用' });
      return;
    }

    const existingRoom = getUserRoom(currentUserId);
    if (existingRoom) {
      socket.emit('match_error', { message: '您正在聊天中，请先结束当前聊天' });
      return;
    }

    joinQueue(user, data.preferNearby ?? true);
    socket.emit('match_started', getQueueStatus(currentUserId));

    // 每3秒尝试匹配
    const matchInterval = setInterval(() => {
      const result = tryMatch(currentUserId!);
      if (result) {
        clearInterval(matchInterval);

        const room = createChatRoom(currentUserId!, result.partner.id);

        const partner = getUser(result.partner.id);
        result.partner.nickname = partner?.nickname || '未知';
        result.roomId = room.id;

        socket.emit('match_success', result);

        // 通知对方
        const partnerSocket = findSocketByUserId(result.partner.id);
        if (partnerSocket) {
          const me = getUser(currentUserId!);
          const reverseResult = {
            roomId: room.id,
            partner: {
              id: currentUserId!,
              nickname: me?.nickname || '未知',
              universityName: me?.universityName || '未知',
              campusName: me?.campusName || '未知',
              distance: result.partner.distance,
            },
            iceBreaker: result.iceBreaker,
            recommendSpots: result.recommendSpots,
          };
          partnerSocket.emit('match_success', reverseResult);
          partnerSocket.join(room.id);
        }

        socket.join(room.id);
      }
    }, 3000);

    socket.data.matchInterval = matchInterval;
  });

  // ---- 停止匹配 ----
  socket.on('stop_match', () => {
    if (!currentUserId) return;
    leaveQueue(currentUserId);
    if (socket.data.matchInterval) {
      clearInterval(socket.data.matchInterval);
    }
    socket.emit('match_stopped');
  });

  // ---- 获取匹配状态 ----
  socket.on('match_status', () => {
    if (!currentUserId) return;
    const status = getQueueStatus(currentUserId);
    socket.emit('match_status', status);
  });

  // ---- 发送消息 ----
  socket.on('send_message', (data: { roomId: string; content: string }) => {
    if (!currentUserId) return;
    const room = getChatRoom(data.roomId);
    if (!room) return;
    if (room.user1 !== currentUserId && room.user2 !== currentUserId) return;

    const msg = addMessage(data.roomId, currentUserId, data.content);
    io.to(data.roomId).emit('new_message', msg);
  });

  // ---- 见面邀请 ----
  socket.on('meet_invite', (data: { roomId: string; spot: any; time: 'now' | '15min' | '30min' }) => {
    if (!currentUserId) return;
    const invite = sendMeetInvite(data.roomId, currentUserId, data.spot, data.time);
    if (invite) {
      io.to(data.roomId).emit('meet_invite_update', invite);
    }
  });

  // ---- 见面邀请响应 ----
  socket.on('meet_respond', (data: { roomId: string; action: 'accepted' | 'rejected' | 'changed' }) => {
    if (!currentUserId) return;
    const invite = respondMeetInvite(data.roomId, currentUserId, data.action);
    if (invite) {
      io.to(data.roomId).emit('meet_invite_update', invite);
    }
  });

  // ---- 八字合婚 ----
  socket.on('bazi_check', (data: { roomId: string }) => {
    if (!currentUserId) return;
    const room = getChatRoom(data.roomId);
    if (!room) return;

    const user1 = getUser(room.user1);
    const user2 = getUser(room.user2);
    if (!user1 || !user2) {
      socket.emit('bazi_result', { success: false, message: '用户信息不完整' });
      return;
    }

    if (!user1.birthInfo || !user2.birthInfo) {
      // 通知双方谁还没有填写出生信息
      const missing: string[] = [];
      if (!user1.birthInfo) missing.push(user1.nickname);
      if (!user2.birthInfo) missing.push(user2.nickname);

      io.to(data.roomId).emit('bazi_result', {
        success: false,
        needBirthInfo: true,
        message: `${missing.join('、')} 还未填写出生时间，请先在个人页面完成填写`,
        missingUserIds: [!user1.birthInfo ? user1.id : null, !user2.birthInfo ? user2.id : null].filter(Boolean),
      });
      return;
    }

    try {
      const chart1 = calculateBaZi(user1.birthInfo.year, user1.birthInfo.month, user1.birthInfo.day, user1.birthInfo.hour, user1.gender);
      const chart2 = calculateBaZi(user2.birthInfo.year, user2.birthInfo.month, user2.birthInfo.day, user2.birthInfo.hour, user2.gender);
      const compatibility = analyzeCompatibility(chart1, chart2);

      io.to(data.roomId).emit('bazi_result', {
        success: true,
        data: {
          user1: { id: user1.id, nickname: user1.nickname, chart: chart1 },
          user2: { id: user2.id, nickname: user2.nickname, chart: chart2 },
          compatibility,
        },
      });
    } catch (err: any) {
      socket.emit('bazi_result', { success: false, message: err.message });
    }
  });

  // ---- 保存出生信息（Socket版） ----
  socket.on('save_birth', (data: { year: number; month: number; day: number; hour: number }) => {
    if (!currentUserId) return;
    const user = saveUserBirth(currentUserId, data);
    if (user) {
      socket.emit('birth_saved', { success: true, message: '出生信息已保存，可以进行八字合婚了' });
    }
  });

  // ---- 延长聊天 ----
  socket.on('extend_chat', (data: { roomId: string }) => {
    if (!currentUserId) return;
    const room = extendChat(data.roomId);
    if (room) {
      io.to(data.roomId).emit('chat_extended', { expiresAt: room.expiresAt });
    }
  });

  // ---- 结束聊天 ----
  socket.on('end_chat', (data: { roomId: string }) => {
    if (!currentUserId) return;
    const room = getChatRoom(data.roomId);
    if (!room) return;

    // 通知房间内所有人
    io.to(data.roomId).emit('chat_ended', { by: currentUserId });
    endChat(data.roomId);
  });

  // ---- 评价见面 ----
  socket.on('rate_meet', (data: { targetUserId: string; rating: 'good' | 'ok' | 'bad' }) => {
    if (!currentUserId) return;
    rateMeet(data.targetUserId, data.rating);
    socket.emit('rate_success');
  });

  // ---- 举报 ----
  socket.on('report_user', (data: { targetUserId: string }) => {
    if (!currentUserId) return;
    reportUser(data.targetUserId);
    socket.emit('report_success', { message: '举报已提交，我们会尽快处理' });
  });

  // ---- 断开连接 ----
  socket.on('disconnect', () => {
    console.log(`🔌 用户断开: ${socket.id}`);
    if (currentUserId) {
      leaveQueue(currentUserId);
      if (socket.data.matchInterval) {
        clearInterval(socket.data.matchInterval);
      }
      const room = getUserRoom(currentUserId);
      if (room) {
        const partnerId = getPartnerId(room, currentUserId);
        const partnerSocket = findSocketByUserId(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('partner_disconnected');
        }
      }
    }
  });
});

// ============ 定时清理过期聊天室 ============
setInterval(() => {
  const expired = cleanExpiredRooms();
  for (const roomId of expired) {
    io.to(roomId).emit('chat_expired');
  }
}, 30000);

// ============ 启动服务 ============
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     🎓 校园面基 - 后端服务启动            ║
║     端口: ${PORT}                          ║
║     环境: ${process.env.NODE_ENV || 'development'}                          ║
╚══════════════════════════════════════════╝
  `);
});
