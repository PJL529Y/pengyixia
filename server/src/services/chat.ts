import { ChatRoom, ChatMessage, MeetInvite, MeetSpot } from '../types';
import { getUser, rateMeet } from './auth';

// 活跃聊天室
const chatRooms: Map<string, ChatRoom> = new Map();
// 聊天消息存储
const messages: Map<string, ChatMessage[]> = new Map();

// ============ 聊天室管理 ============

// 创建聊天室（15分钟限时）
export function createChatRoom(user1Id: string, user2Id: string): ChatRoom {
  const room: ChatRoom = {
    id: `room_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    user1: user1Id,
    user2: user2Id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000, // 15分钟后过期
    extended: false,
  };

  chatRooms.set(room.id, room);
  messages.set(room.id, []);

  // 添加系统消息
  addSystemMessage(room.id, '🎉 匹配成功！聊天将在15分钟后自动结束。');
  addSystemMessage(room.id, '💡 感觉不错的话，可以邀请对方见面哦！');

  return room;
}

// 获取聊天室
export function getChatRoom(roomId: string): ChatRoom | undefined {
  return chatRooms.get(roomId);
}

// 获取用户所在的聊天室
export function getUserRoom(userId: string): ChatRoom | undefined {
  for (const room of chatRooms.values()) {
    if (room.user1 === userId || room.user2 === userId) {
      return room;
    }
  }
  return undefined;
}

// 获取聊天室另一方ID
export function getPartnerId(room: ChatRoom, userId: string): string {
  return room.user1 === userId ? room.user2 : room.user1;
}

// 延长聊天
export function extendChat(roomId: string): ChatRoom | undefined {
  const room = chatRooms.get(roomId);
  if (!room) return undefined;
  room.extended = true;
  room.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 延长24小时
  addSystemMessage(roomId, '💚 双方都选择继续聊天！你们可以慢慢了解对方了~');
  return room;
}

// 结束聊天
export function endChat(roomId: string): void {
  const room = chatRooms.get(roomId);
  if (!room) return;
  chatRooms.delete(roomId);
  messages.delete(roomId);
}

// 清理过期聊天室
export function cleanExpiredRooms(): string[] {
  const now = Date.now();
  const expired: string[] = [];
  for (const [id, room] of chatRooms) {
    if (now > room.expiresAt && !room.extended) {
      expired.push(id);
      chatRooms.delete(id);
      messages.delete(id);
    }
  }
  return expired;
}

// ============ 消息管理 ============

// 添加文本消息
export function addMessage(roomId: string, senderId: string, content: string): ChatMessage {
  const msg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 4)}`,
    senderId,
    content,
    timestamp: Date.now(),
    type: 'text',
  };
  const roomMessages = messages.get(roomId);
  if (roomMessages) {
    roomMessages.push(msg);
  }
  return msg;
}

// 添加系统消息
export function addSystemMessage(roomId: string, content: string): ChatMessage {
  const msg: ChatMessage = {
    id: `sys_${Date.now()}_${Math.random().toString(36).slice(2, 4)}`,
    senderId: 'system',
    content,
    timestamp: Date.now(),
    type: 'system',
  };
  const roomMessages = messages.get(roomId);
  if (roomMessages) {
    roomMessages.push(msg);
  }
  return msg;
}

// 获取历史消息
export function getMessages(roomId: string): ChatMessage[] {
  return messages.get(roomId) || [];
}

// ============ 见面邀请 ============

// 发送见面邀请
export function sendMeetInvite(roomId: string, fromUserId: string, spot: MeetSpot, time: 'now' | '15min' | '30min'): MeetInvite | null {
  const room = chatRooms.get(roomId);
  if (!room) return null;

  const invite: MeetInvite = {
    from: fromUserId,
    spot,
    time,
    status: 'pending',
    createdAt: Date.now(),
  };

  room.meetInvite = invite;

  // 生成消息
  const timeLabel = time === 'now' ? '现在' : time === '15min' ? '15分钟后' : '30分钟后';
  addSystemMessage(roomId, `☕ 见面邀请：${spot.name}（${spot.type}），${timeLabel}见面`);
  addMessage(roomId, fromUserId, `[见面邀请] 我想和你在 ${spot.name} 见面，${timeLabel}~`);

  return invite;
}

// 响应见面邀请
export function respondMeetInvite(roomId: string, userId: string, action: 'accepted' | 'rejected' | 'changed'): MeetInvite | null {
  const room = chatRooms.get(roomId);
  if (!room || !room.meetInvite) return null;

  room.meetInvite.status = action;

  if (action === 'accepted') {
    addSystemMessage(roomId, '✅ 见面邀请已接受！祝你们见面愉快 🎉');
    addSystemMessage(roomId, '🔒 提醒：请在公共场合见面，注意安全！');
  } else if (action === 'changed') {
    addSystemMessage(roomId, '💬 见面地点被更改，等待新的邀请...');
  } else {
    addSystemMessage(roomId, '❌ 见面邀请被拒绝');
  }

  return room.meetInvite;
}

// 评价见面
export function evaluateMeet(userId: string, targetUserId: string, rating: 'good' | 'ok' | 'bad'): void {
  rateMeet(targetUserId, rating);
}
