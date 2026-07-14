// ============ 核心类型定义 ============

export interface Campus {
  name: string;
  lat: number;
  lng: number;
}

export interface MeetSpot {
  name: string;
  type: '咖啡' | '自习' | '食堂' | '户外' | '其他';
  lat: number;
  lng: number;
}

export interface University {
  id: number;
  name: string;
  shortName: string;
  eduDomain: string;
  province: string;
  city: string;
  level: '985' | '211' | '双一流' | '普通本科';
  campuses: Campus[];
  meetSpots?: MeetSpot[];
}

export type UserStatus = 'available' | 'busy' | 'studying' | 'invisible';

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface User {
  id: string;
  nickname: string;
  gender: 'male' | 'female';
  universityId: number;
  universityName: string;
  campusName: string;
  status: UserStatus;
  lat?: number;
  lng?: number;
  socketId?: string;
  matchedWith?: string;
  chatRoom?: string;
  createdAt: number;
  meetScore: number; // 见面评价累计分
  meetCount: number; // 见面次数
  reportCount: number; // 被举报次数
  banned: boolean;
  birthInfo?: BirthInfo; // 出生时间（用于八字合婚）
}

export interface MatchQueueItem {
  userId: string;
  gender: 'male' | 'female';
  universityId: number;
  campusName: string;
  lat: number;
  lng: number;
  status: UserStatus;
  joinedAt: number;
  preferNearby: boolean; // 是否愿意等待更近的
}

export interface ChatRoom {
  id: string;
  user1: string;
  user2: string;
  createdAt: number;
  expiresAt: number; // 限时聊天到期时间（15分钟）
  extended: boolean; // 是否已延期
  meetInvite?: MeetInvite;
}

export interface MeetInvite {
  from: string;
  spot: MeetSpot;
  time: 'now' | '15min' | '30min';
  status: 'pending' | 'accepted' | 'rejected' | 'changed';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'meet_invite' | 'meet_response' | 'system';
}

// 匹配事件
export interface MatchResult {
  roomId: string;
  partner: {
    id: string;
    nickname: string;
    universityName: string;
    campusName: string;
    distance: string; // 模糊距离描述
  };
  iceBreaker: string; // 破冰话题
  recommendSpots: MeetSpot[]; // 推荐见面地点
}

// 距离等级
export type DistanceLevel = 'same_building' | 'same_campus' | 'nearby_campus' | 'same_city';

export interface DistanceInfo {
  level: DistanceLevel;
  label: string;
  meters: number;
}
