// ============ 前端类型定义 ============

export interface University {
  id: number;
  name: string;
  shortName: string;
  eduDomain: string;
  province: string;
  city: string;
  level: string;
  campuses: Campus[];
  meetSpots?: MeetSpot[];
}

export interface Campus {
  name: string;
  lat: number;
  lng: number;
}

export interface MeetSpot {
  name: string;
  type: string;
  lat: number;
  lng: number;
}

export interface UserInfo {
  id: string;
  nickname: string;
  gender: 'male' | 'female';
  universityName: string;
  campusName: string;
  status: 'available' | 'busy' | 'studying' | 'invisible';
  meetScore: number;
  meetCount: number;
}

export interface MatchPartner {
  id: string;
  nickname: string;
  universityName: string;
  campusName: string;
  distance: string;
}

export interface MatchResult {
  roomId: string;
  partner: MatchPartner;
  iceBreaker: string;
  recommendSpots: MeetSpot[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'meet_invite' | 'meet_response' | 'system';
}

export interface MeetInvite {
  from: string;
  spot: MeetSpot;
  time: 'now' | '15min' | '30min';
  status: 'pending' | 'accepted' | 'rejected' | 'changed';
  createdAt: number;
}

export type PageName = 'auth' | 'match' | 'chat' | 'profile' | 'baziFortune';

// ============ 八字相关类型 ============

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface BaZiPillar {
  stem: string;
  branch: string;
  fullName: string;
  nayin: string;
}

export interface BaZiChart {
  year: BaZiPillar;
  month: BaZiPillar;
  day: BaZiPillar;
  hour: BaZiPillar;
  dayMaster: string;
  dayMasterElement: string;
  elementCount: Record<string, number>;
  birthInfo: BirthInfo & { gender: string };
}

export interface BaZiCompatibility {
  overallScore: number;
  relationshipType: string;
  analysis: {
    dayMaster: string;
    stems: string;
    branches: string;
    elements: string;
    overall: string;
  };
  elementReading: string;
  warnings: string[];
  suggestions: string[];
}

export interface BaZiResult {
  success: boolean;
  needBirthInfo?: boolean;
  message?: string;
  missingUserIds?: string[];
  data?: {
    user1: { id: string; nickname: string; chart: BaZiChart };
    user2: { id: string; nickname: string; chart: BaZiChart };
    compatibility: BaZiCompatibility;
  };
}
