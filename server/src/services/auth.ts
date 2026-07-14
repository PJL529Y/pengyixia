import { User, UserStatus, BirthInfo } from '../types';
import { findUniversity } from '../data/universities';

// 内存用户存储（MVP阶段，后续换数据库）
const users: Map<string, User> = new Map();
const emailCodes: Map<string, { code: string; expires: number }> = new Map();

// 生成昵称
const adjectives = [
  '开心的', '安静的', '好奇的', '温柔的', '勇敢的', '慵懒的', '忙碌的', '自由的',
  '神秘的', '可爱的', '沉默的', '热情的', '成熟的', '调皮', '忧郁的', '阳光的',
];
const nouns = [
  '熊猫', '兔子', '小猫', '柴犬', '海豚', '考拉', '企鹅', '狐狸',
  '小熊', '鹿', '仓鼠', '鲸鱼', '松鼠', '刺猬', '布偶', '金毛',
];

function randomNickname(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${adj}${noun}#${num}`;
}

// ============ 邮箱认证 ============

// 发送验证码（模拟）
export function sendVerificationCode(email: string): { success: boolean; message: string; devCode?: string } {
  // 验证是否为 .edu.cn 邮箱
  if (!email.endsWith('.edu.cn')) {
    return { success: false, message: '请使用 .edu.cn 结尾的学校邮箱' };
  }

  // 生成6位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  emailCodes.set(email, {
    code,
    expires: Date.now() + 10 * 60 * 1000, // 10分钟有效
  });

  console.log(`\n📧 [模拟邮件] 验证码已发送到 ${email}: ${code}\n`);
  return {
    success: true,
    message: '验证码已发送',
    // 开发模式：直接返回验证码给前端显示
    devCode: process.env.NODE_ENV !== 'production' ? code : undefined,
  };
}

// 验证邮箱
export function verifyEmail(email: string, code: string): { success: boolean; message: string; universityId?: number } {
  const record = emailCodes.get(email);

  if (!record) {
    return { success: false, message: '请先获取验证码' };
  }
  if (Date.now() > record.expires) {
    emailCodes.delete(email);
    return { success: false, message: '验证码已过期，请重新获取' };
  }
  if (record.code !== code) {
    return { success: false, message: '验证码错误' };
  }

  // 验证成功，匹配学校
  const domain = email.split('@')[1];
  const universities = require('../data/universities').universities;
  const uni = universities.find((u: any) => u.eduDomain === domain);

  if (!uni) {
    return { success: false, message: '未找到对应学校，请确认邮箱域名正确' };
  }

  emailCodes.delete(email);
  return { success: true, message: '验证成功', universityId: uni.id };
}

// ============ 用户管理 ============

// 创建用户
export function createUser(universityId: number, gender: 'male' | 'female', campusName?: string): User {
  const uni = findUniversity(universityId);
  if (!uni) throw new Error('学校不存在');

  const defaultCampus = campusName || uni.campuses[0]?.name || '主校区';

  const user: User = {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    nickname: randomNickname(),
    gender,
    universityId,
    universityName: uni.shortName,
    campusName: defaultCampus,
    status: 'available',
    lat: uni.campuses[0]?.lat,
    lng: uni.campuses[0]?.lng,
    createdAt: Date.now(),
    meetScore: 100, // 初始信誉分
    meetCount: 0,
    reportCount: 0,
    banned: false,
  };

  users.set(user.id, user);
  return user;
}

// 获取用户
export function getUser(userId: string): User | undefined {
  return users.get(userId);
}

// 更新用户状态
export function updateUserStatus(userId: string, status: UserStatus): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.status = status;
  return user;
}

// 更新用户位置
export function updateUserLocation(userId: string, lat: number, lng: number): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.lat = lat;
  user.lng = lng;
  return user;
}

// 更新用户校区
export function updateUserCampus(userId: string, campusName: string): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  const uni = findUniversity(user.universityId);
  if (!uni) return undefined;
  const campus = uni.campuses.find(c => c.name === campusName);
  if (!campus) return undefined;
  user.campusName = campusName;
  user.lat = campus.lat;
  user.lng = campus.lng;
  return user;
}

// 保存出生信息
export function saveUserBirth(userId: string, birthInfo: BirthInfo): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.birthInfo = birthInfo;
  return user;
}

// 禁言/封禁用户
export function banUser(userId: string): void {
  const user = users.get(userId);
  if (user) {
    user.banned = true;
    user.status = 'invisible';
  }
}

// 举报用户
export function reportUser(userId: string): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.reportCount++;
  user.meetScore = Math.max(0, user.meetScore - 20);
  if (user.reportCount >= 3) {
    banUser(userId);
  }
  return user;
}

// 见面评价
export function rateMeet(userId: string, rating: 'good' | 'ok' | 'bad'): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.meetCount++;
  if (rating === 'good') user.meetScore += 10;
  else if (rating === 'bad') user.meetScore = Math.max(0, user.meetScore - 30);
  return user;
}

// 获取所有在线用户数
export function getOnlineCount(): number {
  return users.size;
}
