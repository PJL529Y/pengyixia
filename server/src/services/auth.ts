import { User, UserStatus, BirthInfo } from '../types';
import { findUniversity } from '../data/universities';

// 内存用户存储
const users: Map<string, User> = new Map();

// 学号格式缓存（已验证通过的学号，防止重复注册）
const verifiedStudentIds: Set<string> = new Set();

// 生成昵称
const adjectives = [
  '开心的', '安静的', '好奇的', '温柔的', '勇敢的', '慵懒的', '忙碌的', '自由的',
  '神秘的', '可爱的', '沉默的', '热情的', '成熟的', '调皮的', '忧郁的', '阳光的',
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

// ============ 学号+姓名认证 ============

/**
 * 验证学号格式
 * 不同学校的学号规则不同：
 * - 大部分是8-12位数字
 * - 少数包含字母
 */
function validateStudentId(studentId: string, universityId: number): { valid: boolean; message: string } {
  if (!studentId || studentId.trim().length === 0) {
    return { valid: false, message: '请输入学号' };
  }

  const id = studentId.trim();

  // 基础格式：6-15位，字母或数字
  if (id.length < 6) {
    return { valid: false, message: '学号格式不正确，请检查' };
  }
  if (id.length > 15) {
    return { valid: false, message: '学号格式不正确，请检查' };
  }
  if (!/^[a-zA-Z0-9]+$/.test(id)) {
    return { valid: false, message: '学号只能包含字母和数字' };
  }

  // 特定学校格式校验（常见的）
  const uni = findUniversity(universityId);
  if (uni) {
    // 大部分中国大学学号是纯数字，8-12位
    if (/^\d+$/.test(id)) {
      if (id.length >= 8 && id.length <= 12) {
        return { valid: true, message: '验证通过' };
      }
      // 长度不够也可能，比如一些学校学号较短
      return { valid: true, message: '验证通过' };
    }
  }

  return { valid: true, message: '验证通过' };
}

function validateName(name: string): { valid: boolean; message: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: '请输入姓名' };
  }

  const n = name.trim();

  // 中文姓名2-10个字符
  if (n.length < 2) {
    return { valid: false, message: '请输入完整姓名' };
  }
  if (n.length > 10) {
    return { valid: false, message: '姓名过长，请检查' };
  }

  // 允许中文、·（少数民族）、字母（英文名）
  if (!/^[一-鿿\w·]+$/.test(n)) {
    return { valid: false, message: '姓名格式不正确' };
  }

  return { valid: true, message: '验证通过' };
}

export function verifyStudentIdentity(universityId: number, studentId: string, name: string): {
  success: boolean;
  message: string;
  universityId?: number;
} {
  // 校验学校
  const uni = findUniversity(universityId);
  if (!uni) {
    return { success: false, message: '学校不存在' };
  }

  // 校验学号
  const idResult = validateStudentId(studentId, universityId);
  if (!idResult.valid) {
    return { success: false, message: idResult.message };
  }

  // 校验姓名
  const nameResult = validateName(name);
  if (!nameResult.valid) {
    return { success: false, message: nameResult.message };
  }

  // 检查是否已注册（同一学号只能注册一次）
  const key = `${universityId}_${studentId.trim()}`;
  if (verifiedStudentIds.has(key)) {
    return { success: false, message: '该学号已被注册，如果这是你的学号请联系我们' };
  }

  // 验证通过
  verifiedStudentIds.add(key);
  return { success: true, message: '认证通过', universityId };
}

// ============ 用户管理 ============

export function createUser(
  universityId: number,
  gender: 'male' | 'female',
  campusName?: string,
): User {
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
    meetScore: 100,
    meetCount: 0,
    reportCount: 0,
    banned: false,
  };

  users.set(user.id, user);
  return user;
}

export function getUser(userId: string): User | undefined {
  return users.get(userId);
}

export function updateUserStatus(userId: string, status: UserStatus): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.status = status;
  return user;
}

export function updateUserLocation(userId: string, lat: number, lng: number): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.lat = lat;
  user.lng = lng;
  return user;
}

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

export function saveUserBirth(userId: string, birthInfo: BirthInfo): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.birthInfo = birthInfo;
  return user;
}

export function banUser(userId: string): void {
  const user = users.get(userId);
  if (user) {
    user.banned = true;
    user.status = 'invisible';
  }
}

export function reportUser(userId: string): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.reportCount++;
  user.meetScore = Math.max(0, user.meetScore - 20);
  if (user.reportCount >= 3) banUser(userId);
  return user;
}

export function rateMeet(userId: string, rating: 'good' | 'ok' | 'bad'): User | undefined {
  const user = users.get(userId);
  if (!user) return undefined;
  user.meetCount++;
  if (rating === 'good') user.meetScore += 10;
  else if (rating === 'bad') user.meetScore = Math.max(0, user.meetScore - 30);
  return user;
}

export function getOnlineCount(): number {
  return users.size;
}
