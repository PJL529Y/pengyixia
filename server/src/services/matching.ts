import { MatchQueueItem, User, MatchResult, MeetSpot, DistanceLevel, DistanceInfo } from '../types';
import { findUniversity, universityClusters } from '../data/universities';

// 匹配队列
const matchQueue: MatchQueueItem[] = [];

// ============ 距离计算 ============

// 计算两点间距离（Haversine公式，返回米）
function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 判断距离等级
function getDistanceLevel(meters: number, sameCampus: boolean, sameCluster: boolean): DistanceInfo {
  if (meters < 200) {
    return { level: 'same_building', label: '同一栋楼 🏫', meters: Math.round(meters) };
  } else if (sameCampus && meters < 2000) {
    return { level: 'same_campus', label: '同一校区 🎓', meters: Math.round(meters) };
  } else if (sameCluster && meters < 8000) {
    return { level: 'nearby_campus', label: '大学城内 🚲', meters: Math.round(meters) };
  } else if (meters < 30000) {
    return { level: 'same_city', label: '同城 📍', meters: Math.round(meters) };
  } else {
    return { level: 'same_city', label: '同城（较远）📍', meters: Math.round(meters) };
  }
}

// 判断是否同校区
function isSameCampus(item1: MatchQueueItem, item2: MatchQueueItem): boolean {
  return item1.universityId === item2.universityId &&
    item1.campusName === item2.campusName;
}

// 判断是否在同一大学城
function isSameCluster(item1: MatchQueueItem, item2: MatchQueueItem): boolean {
  for (const cluster of universityClusters) {
    const has1 = cluster.universityIds.includes(item1.universityId);
    const has2 = cluster.universityIds.includes(item2.universityId);
    if (has1 && has2) return true;
  }
  return false;
}

// ============ 匹配引擎 ============

// 破冰话题库
const iceBreakers = [
  '如果明天学校停课一天，你会去做什么？',
  '你最近单曲循环的一首歌是什么？',
  '食堂里你最爱的一道菜是什么？',
  '在校园里你最喜欢待的地方是哪里？',
  '你选过最离谱的一门课是什么？',
  '如果可以在学校里任意一个地方睡觉，你选哪？',
  '你的专业最让你崩溃的瞬间是什么？',
  '最近一次熬夜是为了什么？',
  '如果可以和一位老师互换身份一天，你选谁？',
  '学校周边最好吃的店是哪家？',
  '你这学期最早的课是几点的？',
  '有什么爱好是你想尝试但一直没开始的？',
  '你对你们学校的什么传闻最好奇？',
  '现在你房间里最乱的地方是哪里？',
  '用一种食物形容你的专业，会是什么？',
];

function randomIceBreaker(): string {
  return iceBreakers[Math.floor(Math.random() * iceBreakers.length)];
}

// 推荐见面地点
function getRecommendSpots(universityId: number): MeetSpot[] {
  const uni = findUniversity(universityId);
  if (uni?.meetSpots && uni.meetSpots.length > 0) {
    return uni.meetSpots.slice(0, 3);
  }
  // 默认推荐
  return [
    { name: '图书馆', type: '自习', lat: 0, lng: 0 },
    { name: '校内咖啡店', type: '咖啡', lat: 0, lng: 0 },
    { name: '操场/湖边', type: '户外', lat: 0, lng: 0 },
  ];
}

// 加入匹配队列
export function joinQueue(user: User, preferNearby: boolean = true): void {
  // 先移除已有的
  leaveQueue(user.id);

  const item: MatchQueueItem = {
    userId: user.id,
    gender: user.gender,
    universityId: user.universityId,
    campusName: user.campusName,
    lat: user.lat || 0,
    lng: user.lng || 0,
    status: user.status,
    joinedAt: Date.now(),
    preferNearby,
  };
  matchQueue.push(item);
}

// 离开匹配队列
export function leaveQueue(userId: string): void {
  const idx = matchQueue.findIndex(q => q.userId === userId);
  if (idx !== -1) matchQueue.splice(idx, 1);
}

// 尝试匹配 - 位置优先算法
export function tryMatch(userId: string): MatchResult | null {
  const user = matchQueue.find(q => q.userId === userId);
  if (!user) return null;

  const now = Date.now();
  const waited = now - user.joinedAt;

  // 寻找最佳匹配：异性 + 位置优先
  const candidates = matchQueue
    .filter(q => {
      if (q.userId === userId) return false;
      // 必须异性
      if (q.gender === user.gender) return false;
      // 必须可用状态
      if (q.status === 'invisible') return false;
      return true;
    })
    .map(q => {
      const distance = calcDistance(user.lat, user.lng, q.lat, q.lng);
      const sameCampus = isSameCampus(user, q);
      const sameCluster = isSameCluster(user, q);
      const distInfo = getDistanceLevel(distance, sameCampus, sameCluster);

      // 距离得分：越近分越高
      let distScore = 0;
      if (distInfo.level === 'same_building') distScore = 100;
      else if (distInfo.level === 'same_campus') distScore = 80;
      else if (distInfo.level === 'nearby_campus') distScore = 50;
      else distScore = Math.max(0, 30 - distance / 1000);

      // 等待时间权重：等待越久，距离要求越低
      const waitBonus = Math.min(waited / 1000 * 2, 40); // 最高+40分等待加成

      return {
        queueItem: q,
        distance,
        distInfo,
        distScore,
        totalScore: distScore + waitBonus,
        isAvailable: q.status === 'available', // 有空状态加分
      };
    })
    .filter(c => {
      // 分级匹配逻辑
      if (waited < 10000) {
        // 前10秒：只匹配同校区或大学城
        return c.distInfo.level === 'same_building' || c.distInfo.level === 'same_campus' || c.distInfo.level === 'nearby_campus';
      } else if (waited < 30000) {
        // 10-30秒：允许同城
        return c.distance < 30000;
      }
      // 30秒后：不限距离
      return true;
    })
    .sort((a, b) => {
      // 有空状态的优先
      if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
      // 总分排序
      return b.totalScore - a.totalScore;
    });

  if (candidates.length === 0) return null;

  const best = candidates[0];
  const partnerQueue = best.queueItem;

  // 从队列中移除双方
  leaveQueue(userId);
  leaveQueue(partnerQueue.userId);

  // 查找对方用户信息
  const partnerUni = findUniversity(partnerQueue.universityId);

  return {
    roomId: `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    partner: {
      id: partnerQueue.userId,
      nickname: '', // 由调用方填充
      universityName: partnerUni?.shortName || '未知',
      campusName: partnerQueue.campusName,
      distance: best.distInfo.label,
    },
    iceBreaker: randomIceBreaker(),
    recommendSpots: getRecommendSpots(partnerQueue.universityId),
  };
}

// 获取队列状态
export function getQueueStatus(userId: string) {
  const user = matchQueue.find(q => q.userId === userId);
  if (!user) return null;
  const waited = ((Date.now() - user.joinedAt) / 1000).toFixed(0);
  const oppositeCount = matchQueue.filter(q => q.gender !== user.gender && q.userId !== userId).length;
  return {
    inQueue: true,
    waitedSeconds: parseInt(waited),
    availableCount: oppositeCount,
    currentLevel: waited < '10' ? '同校优先' : waited < '30' ? '同城优先' : '全国匹配',
  };
}
