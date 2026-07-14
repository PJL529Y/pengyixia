// ========================================
// 八字命理引擎 — 产品灵魂
// 基于朴素唯物主义和经验主义的五行阴阳学说
// ========================================

// ---- 基础定义 ----

/** 十天干 */
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export type Stem = typeof STEMS[number];

/** 十二地支 */
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export type Branch = typeof BRANCHES[number];

/** 五行 */
export const ELEMENTS = ['木', '火', '土', '金', '水'] as const;
export type Element = typeof ELEMENTS[number];

/** 阴阳 */
export type YinYang = '阳' | '阴';

// 天干 → 五行 + 阴阳
export const STEM_ELEMENT: Record<Stem, { element: Element; yinYang: YinYang }> = {
  '甲': { element: '木', yinYang: '阳' },
  '乙': { element: '木', yinYang: '阴' },
  '丙': { element: '火', yinYang: '阳' },
  '丁': { element: '火', yinYang: '阴' },
  '戊': { element: '土', yinYang: '阳' },
  '己': { element: '土', yinYang: '阴' },
  '庚': { element: '金', yinYang: '阳' },
  '辛': { element: '金', yinYang: '阴' },
  '壬': { element: '水', yinYang: '阳' },
  '癸': { element: '水', yinYang: '阴' },
};

// 地支 → 五行 + 藏干（本气）
export const BRANCH_ELEMENT: Record<Branch, { element: Element; hiddenStems: Stem[] }> = {
  '子': { element: '水', hiddenStems: ['癸'] },
  '丑': { element: '土', hiddenStems: ['己', '癸', '辛'] },
  '寅': { element: '木', hiddenStems: ['甲', '丙', '戊'] },
  '卯': { element: '木', hiddenStems: ['乙'] },
  '辰': { element: '土', hiddenStems: ['戊', '乙', '癸'] },
  '巳': { element: '火', hiddenStems: ['丙', '庚', '戊'] },
  '午': { element: '火', hiddenStems: ['丁', '己'] },
  '未': { element: '土', hiddenStems: ['己', '丁', '乙'] },
  '申': { element: '金', hiddenStems: ['庚', '壬', '戊'] },
  '酉': { element: '金', hiddenStems: ['辛'] },
  '戌': { element: '土', hiddenStems: ['戊', '辛', '丁'] },
  '亥': { element: '水', hiddenStems: ['壬', '甲'] },
};

// 地支 → 生肖
export const BRANCH_ZODIAC: Record<Branch, string> = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
  '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
};

// 月份地支映射（按节气近似，每月界限为节气日）
const MONTH_BRANCH: Branch[] = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
// 节气大致日期（用于确定月份地支切换日）
const SOLAR_TERM_DAY: number[] = [4, 6, 5, 6, 6, 7, 8, 8, 8, 8, 7, 7]; // 对应的2月-1月

// 年上起月表：年天干 → 月天干起始索引
const YEAR_STEM_MONTH_START: Record<Stem, number> = {
  '甲': 2, '己': 2,
  '乙': 4, '庚': 4,
  '丙': 6, '辛': 6,
  '丁': 8, '壬': 8,
  '戊': 0, '癸': 0,
};

// 日上起时表：日天干 → 时天干起始索引
const DAY_STEM_HOUR_START: Record<Stem, number> = {
  '甲': 0, '己': 0,
  '乙': 2, '庚': 2,
  '丙': 4, '辛': 4,
  '丁': 6, '壬': 6,
  '戊': 8, '癸': 8,
};

// 时辰地支映射
const HOUR_BRANCHES: Branch[] = ['子', '丑', '丑', '寅', '寅', '卯', '卯', '辰', '辰', '巳', '巳', '午', '午', '未', '未', '申', '申', '酉', '酉', '戌', '戌', '亥', '亥', '子'];

// ---- 数据结构 ----

export interface Pillar {
  stem: Stem;
  branch: Branch;
  /** 完整表示，如 "甲子" */
  fullName: string;
  /** 纳音五行 */
  nayin: string;
}

export interface BaZiChart {
  /** 年柱 */
  year: Pillar;
  /** 月柱 */
  month: Pillar;
  /** 日柱 */
  day: Pillar;
  /** 时柱 */
  hour: Pillar;
  /** 日主（日干） */
  dayMaster: Stem;
  /** 日主五行 */
  dayMasterElement: Element;
  /** 五行统计 */
  elementCount: Record<Element, number>;
  /** 出生信息 */
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: 'male' | 'female';
  };
}

export interface BaZiCompatibility {
  /** 综合评分 0-100 */
  overallScore: number;
  /** 适合发展的关系类型 */
  relationshipType: string;
  /** 关系详细分析 */
  analysis: CompatibilityAnalysis;
  /** 五行合盘解读 */
  elementReading: string;
  /** 注意事项 */
  warnings: string[];
  /** 吉位建议 */
  suggestions: string[];
}

interface CompatibilityAnalysis {
  dayMaster: string;      // 日主分析
  stems: string;           // 天干关系
  branches: string;        // 地支关系
  elements: string;        // 五行互补
  overall: string;         // 综合评语
}

// ---- 计算函数 ----

/** 计算某个日期距离1900-01-01的天数 */
function daysSince1900(year: number, month: number, day: number): number {
  const d = new Date(year, month - 1, day);
  const ref = new Date(1900, 0, 1);
  return Math.floor((d.getTime() - ref.getTime()) / (24 * 60 * 60 * 1000));
}

/** 计算年柱 */
function calcYearPillar(year: number): Pillar {
  // 以立春为界，但简化为公历2月4日前后
  const stemIdx = (year - 4) % 10;
  const branchIdx = (year - 4) % 12;
  const stem = STEMS[stemIdx >= 0 ? stemIdx : stemIdx + 10];
  const branch = BRANCHES[branchIdx >= 0 ? branchIdx : branchIdx + 12];
  return makePillar(stem, branch);
}

/** 计算月柱 */
function calcMonthPillar(year: number, month: number, day: number): Pillar {
  // 检查是否在节气之前
  let lunarMonth = month; // 1-12
  const termDay = SOLAR_TERM_DAY[month - 1]; // 本月节气日

  // 在节气日之前，月份属上一个地支月
  if (day < termDay) {
    lunarMonth = month - 1;
    if (lunarMonth < 1) lunarMonth = 12;
  }

  const monthBranchIdx = lunarMonth - 1; // 0-11
  // 实际上地支月: 寅=正月(农历), 对应公历约2月
  // 调整映射: 公历lunarMonth=1(约1月)→丑, 2→寅, 3→卯...
  const branchIdx = (lunarMonth + 1) % 12; // 1月→丑(1), 2月→寅(2), ...
  const branch = BRANCHES[branchIdx];

  // 月干根据年干确定
  const yearStemIdx = (year - 4) % 10;
  const yearStem = STEMS[yearStemIdx >= 0 ? yearStemIdx : yearStemIdx + 10];

  const monthStart = YEAR_STEM_MONTH_START[yearStem] || 0;
  const stemIdx = (monthStart + (lunarMonth - 1)) % 10;
  const stem = STEMS[stemIdx];

  return makePillar(stem, branch);
}

/** 计算日柱 */
function calcDayPillar(year: number, month: number, day: number): Pillar {
  const days = daysSince1900(year, month, day);
  // 1900-01-01 = 甲戌日，甲=0, 戌=10, 在60循环中排位 = 0*12+10?
  // 实际: 甲子=0, 甲戌=10 (甲为天干排0, 地支戌排10, 0*12+10=10不对)
  // 60甲子: 甲子=0, 乙丑=1, ..., 甲戌=10
  const refCycleIndex = 10; // 1900-01-01 = 甲戌 = index 10 in 60-cycle
  const cycleIndex = ((days % 60) + refCycleIndex + 60) % 60;
  const stemIdx = cycleIndex % 10;
  const branchIdx = cycleIndex % 12;
  return makePillar(STEMS[stemIdx], BRANCHES[branchIdx]);
}

/** 计算时柱 */
function calcHourPillar(dayStem: Stem, hour: number): Pillar {
  // 时地支: 23-1→子(0), 1-3→丑(1), 3-5→寅(2)...
  const branchIdx = Math.floor(((hour + 1) % 24) / 2);
  const branch = BRANCHES[branchIdx];

  // 时天干根据日干确定
  const startIdx = DAY_STEM_HOUR_START[dayStem] || 0;
  const stemIdx = (startIdx + branchIdx) % 10;
  const stem = STEMS[stemIdx];

  return makePillar(stem, branch);
}

/** 构造一个柱 */
function makePillar(stem: Stem, branch: Branch): Pillar {
  return {
    stem,
    branch,
    fullName: `${stem}${branch}`,
    nayin: calcNayin(stem, branch),
  };
}

/** 计算纳音五行 */
function calcNayin(stem: Stem, branch: Branch): string {
  // 六十甲子纳音表（简化为30组，每组两个连续甲子）
  const nayinTable: Record<string, string> = {
    '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
    '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
    '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
    '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
    '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
    '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗环金', '辛亥': '钗环金',
    '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水',
  };
  return nayinTable[`${stem}${branch}`] || '未知';
}

/** 统计八字五行数量 */
function countElements(chart: Omit<BaZiChart, 'elementCount'>): Record<Element, number> {
  const count: Record<Element, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  for (const pillar of [chart.year, chart.month, chart.day, chart.hour]) {
    // 天干五行
    count[STEM_ELEMENT[pillar.stem].element]++;
    // 地支本气五行
    count[BRANCH_ELEMENT[pillar.branch].element]++;
  }

  return count;
}

// ---- 公共 API ----

/** 计算完整八字 */
export function calculateBaZi(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female' = 'male'
): BaZiChart {
  const yearPillar = calcYearPillar(year);
  const monthPillar = calcMonthPillar(year, month, day);
  const dayPillar = calcDayPillar(year, month, day);
  const hourPillar = calcHourPillar(dayPillar.stem, hour);

  const partial = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster: dayPillar.stem,
    dayMasterElement: STEM_ELEMENT[dayPillar.stem].element,
    birthInfo: { year, month, day, hour, gender },
  };

  return {
    ...partial,
    elementCount: countElements(partial),
  };
}

/** 把八字格式化为可读字符串 */
export function formatBaZi(chart: BaZiChart): string {
  return [
    `年柱 ${chart.year.fullName}（${chart.year.nayin}）`,
    `月柱 ${chart.month.fullName}（${chart.month.nayin}）`,
    `日柱 ${chart.day.fullName}（${chart.day.nayin}）`,
    `时柱 ${chart.hour.fullName}（${chart.hour.nayin}）`,
    `日主 ${chart.dayMaster}（${chart.dayMasterElement}）`,
  ].join('\n');
}

// ========================================
//  八字合婚分析
// ========================================

/** 天干五合 */
const STEM_COMBINATIONS: Record<string, { partner: Stem; result: Element; desc: string }> = {
  '甲': { partner: '己', result: '土', desc: '甲己合土 — 中正之合，互相尊重，稳定长久' },
  '己': { partner: '甲', result: '土', desc: '甲己合土 — 中正之合，互相尊重，稳定长久' },
  '乙': { partner: '庚', result: '金', desc: '乙庚合金 — 仁义之合，刚柔并济，互补性强' },
  '庚': { partner: '乙', result: '金', desc: '乙庚合金 — 仁义之合，刚柔并济，互补性强' },
  '丙': { partner: '辛', result: '水', desc: '丙辛合水 — 威制之合，激情浪漫，但需互相包容' },
  '辛': { partner: '丙', result: '水', desc: '丙辛合水 — 威制之合，激情浪漫，但需互相包容' },
  '丁': { partner: '壬', result: '木', desc: '丁壬合木 — 淫匿之合，情深意重，灵魂共鸣' },
  '壬': { partner: '丁', result: '木', desc: '丁壬合木 — 淫匿之合，情深意重，灵魂共鸣' },
  '戊': { partner: '癸', result: '火', desc: '戊癸合火 — 无情之合，老少配，需要时间磨合' },
  '癸': { partner: '戊', result: '火', desc: '戊癸合火 — 无情之合，老少配，需要时间磨合' },
};

/** 地支六合 */
const BRANCH_SIX_COMBINATIONS: Record<string, { partner: Branch; result: Element; desc: string }> = {
  '子': { partner: '丑', result: '土', desc: '子丑合土 — 水土相融，互相滋养' },
  '丑': { partner: '子', result: '土', desc: '子丑合土 — 水土相融，互相滋养' },
  '寅': { partner: '亥', result: '木', desc: '寅亥合木 — 木水相生，共同成长' },
  '亥': { partner: '寅', result: '木', desc: '寅亥合木 — 木水相生，共同成长' },
  '卯': { partner: '戌', result: '火', desc: '卯戌合火 — 木生火旺，热情似火' },
  '戌': { partner: '卯', result: '火', desc: '卯戌合火 — 木生火旺，热情似火' },
  '辰': { partner: '酉', result: '金', desc: '辰酉合金 — 土生金坚，稳定可靠' },
  '酉': { partner: '辰', result: '金', desc: '辰酉合金 — 土生金坚，稳定可靠' },
  '巳': { partner: '申', result: '水', desc: '巳申合水 — 火金化水，灵活适应' },
  '申': { partner: '巳', result: '水', desc: '巳申合水 — 火金化水，灵活适应' },
  '午': { partner: '未', result: '土', desc: '午未合土 — 火土相生，脚踏实地' },
  '未': { partner: '午', result: '土', desc: '午未合土 — 火土相生，脚踏实地' },
};

/** 地支六冲 */
const BRANCH_CLASHES: Record<Branch, Branch> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

/** 五行相生相克 */
const ELEMENT_GENERATES: Record<Element, Element> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};
const ELEMENT_CONTROLS: Record<Element, Element> = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木',
};
const ELEMENT_GENERATED_BY: Record<Element, Element> = {
  '木': '水', '火': '木', '土': '火', '金': '土', '水': '金',
};

/** 日主五行适配度 */
const DAY_MASTER_COMPATIBILITY: Record<Element, Record<Element, { score: number; desc: string }>> = {
  '木': {
    '木': { score: 70, desc: '同类相扶，志同道合，但竞争意识需调和' },
    '火': { score: 85, desc: '木生火 — 你滋养对方，付出带来温暖的关系' },
    '土': { score: 50, desc: '木克土 — 你需要主导，对方需要包容' },
    '金': { score: 40, desc: '金克木 — 对方强势，你需要学会退让' },
    '水': { score: 90, desc: '水生木 — 对方滋养你，被理解被支持的感觉' },
  },
  '火': {
    '木': { score: 85, desc: '木生火 — 对方让你发光发热，自信绽放' },
    '火': { score: 70, desc: '同类相助，热情似火，但需要各自空间' },
    '土': { score: 90, desc: '火生土 — 你的热情成就对方的稳定' },
    '金': { score: 45, desc: '火克金 — 你主导对方，但易让对方感到压力' },
    '水': { score: 35, desc: '水克火 — 对方可能让你感到被浇冷水' },
  },
  '土': {
    '木': { score: 50, desc: '木克土 — 对方主导，你需要更强的包容心' },
    '火': { score: 90, desc: '火生土 — 对方温暖你，让你感到踏实安心' },
    '土': { score: 75, desc: '同类相伴，踏实稳定，默契十足' },
    '金': { score: 85, desc: '土生金 — 你支持对方，一起追求卓越' },
    '水': { score: 60, desc: '土克水 — 你能给对方安全感，但需注意控制欲' },
  },
  '金': {
    '木': { score: 60, desc: '金克木 — 你为主导方，需要温柔对待对方' },
    '火': { score: 45, desc: '火克金 — 对方热情但让你有压力' },
    '土': { score: 90, desc: '土生金 — 对方让你更加闪耀，被呵护的感觉' },
    '金': { score: 70, desc: '同类相惜，锋芒相当，互相欣赏' },
    '水': { score: 85, desc: '金生水 — 你的坚定给予对方安全感' },
  },
  '水': {
    '木': { score: 90, desc: '水生木 — 你支持对方成长，关系充满活力' },
    '火': { score: 60, desc: '水克火 — 你冷静对方热烈，需要相互理解' },
    '土': { score: 35, desc: '土克水 — 对方可能让你感到受限' },
    '金': { score: 85, desc: '金生水 — 对方给你力量和方向感' },
    '水': { score: 75, desc: '同类相知，心有灵犀，但同质化需注意' },
  },
};

/** 分析两个八字的合婚情况 */
export function analyzeCompatibility(chart1: BaZiChart, chart2: BaZiChart): BaZiCompatibility {
  let score = 50; // 基础分
  const details: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // ---- 1. 日主五行适配 (权重40%) ----
  const dmElem1 = chart1.dayMasterElement;
  const dmElem2 = chart2.dayMasterElement;
  const dmComp = DAY_MASTER_COMPATIBILITY[dmElem1][dmElem2];
  const dmScore = dmComp.score;
  score += (dmScore - 50) * 0.4;
  const dayMasterAnalysis = `【日主】${chart1.dayMaster}${dmElem1} — ${chart2.dayMaster}${dmElem2}\n${dmComp.desc}`;

  // ---- 2. 天干五合 (权重25%) ----
  let stemBonus = 0;
  const stemAnalysisParts: string[] = [];

  const comb = STEM_COMBINATIONS[chart1.dayMaster];
  if (comb && comb.partner === chart2.dayMaster) {
    stemBonus = 25;
    stemAnalysisParts.push(`🌟 日主天干五合！${comb.desc}`);
    suggestions.push('你们是天干五合的缘分，建议多创造两人独处的机会');
  }

  // 检视年干
  const yearComb = STEM_COMBINATIONS[chart1.year.stem];
  if (yearComb && yearComb.partner === chart2.year.stem) {
    stemBonus += 10;
    stemAnalysisParts.push(`年干${chart1.year.stem}${chart2.year.stem}相合 — 家庭背景和谐`);
  }

  if (stemAnalysisParts.length === 0) {
    stemAnalysisParts.push(`日主天干${chart1.dayMaster}与${chart2.dayMaster}无合 — 需更多日常沟通培养默契`);
  }
  score += stemBonus;

  // ---- 3. 地支关系 (权重20%) ----
  let branchScore = 0;
  const branchAnalysisParts: string[] = [];

  // 六合
  const branchComb = BRANCH_SIX_COMBINATIONS[chart1.day.branch];
  if (branchComb && branchComb.partner === chart2.day.branch) {
    branchScore += 20;
    branchAnalysisParts.push(`🌟 日支六合！${branchComb.desc}`);
    suggestions.push('地支六合的缘分，彼此是对方的贵人');
  }

  // 三合（简化检查：寅午戌/申子辰/亥卯未/巳酉丑）
  const triCombGroups = [
    { branches: ['寅', '午', '戌'] as Branch[], element: '火' as Element, name: '寅午戌三合火' },
    { branches: ['申', '子', '辰'] as Branch[], element: '水' as Element, name: '申子辰三合水' },
    { branches: ['亥', '卯', '未'] as Branch[], element: '木' as Element, name: '亥卯未三合木' },
    { branches: ['巳', '酉', '丑'] as Branch[], element: '金' as Element, name: '巳酉丑三合金' },
  ];

  for (const group of triCombGroups) {
    const b1 = group.branches.includes(chart1.day.branch);
    const b2 = group.branches.includes(chart2.day.branch);
    if (b1 && b2 && chart1.day.branch !== chart2.day.branch) {
      branchScore += 15;
      branchAnalysisParts.push(`🌟 日支${group.name}局 — ${group.element}行共振，互补性强`);
      break;
    }
  }

  // 六冲
  if (BRANCH_CLASHES[chart1.day.branch] === chart2.day.branch) {
    branchScore -= 25;
    branchAnalysisParts.push(`⚠️ 日支六冲（${chart1.day.branch}冲${chart2.day.branch}）— 性格差异大，需更多包容`);
    warnings.push('日支相冲，初期吸引力强但长期冲突多，建议慢慢了解不急于确定关系');
  }

  // 三刑（简化）
  if (chart1.day.branch === chart2.day.branch &&
    ['辰', '午', '酉', '亥'].includes(chart1.day.branch)) {
    branchScore -= 10;
    branchAnalysisParts.push(`⚠️ 日支自刑 — 同质化矛盾，需保持个人空间`);
  }

  if (branchAnalysisParts.length === 0) {
    branchAnalysisParts.push(`日支${chart1.day.branch}与${chart2.day.branch}无冲合 — 相处平和自然`);
  }
  score += branchScore;

  // ---- 4. 五行互补 (权重15%) ----
  let elementBonus = 0;
  const count1 = chart1.elementCount;
  const count2 = chart2.elementCount;

  // 检查是否能互补对方的不足
  const weakElements1: Element[] = [];
  const weakElements2: Element[] = [];
  for (const el of ELEMENTS) {
    if (count1[el] <= 1) weakElements1.push(el);
    if (count2[el] <= 1) weakElements2.push(el);
  }

  const complementaryElements: string[] = [];
  for (const el of ELEMENTS) {
    if (count1[el] <= 1 && count2[el] >= 3) {
      elementBonus += 8;
      complementaryElements.push(`${el}（你缺→对方补）`);
    }
    if (count2[el] <= 1 && count1[el] >= 3) {
      elementBonus += 8;
      complementaryElements.push(`${el}（对方缺→你补）`);
    }
  }

  let elementAnalysis: string;
  if (complementaryElements.length > 0) {
    elementAnalysis = `🌟 五行高度互补：${complementaryElements.join('、')}\n你们在五行上天然互补，在一起能平衡彼此的不足。`;
  } else {
    // 检查是否同五行偏多导致失衡
    const sameStrong: string[] = [];
    for (const el of ELEMENTS) {
      if (count1[el] >= 3 && count2[el] >= 3) {
        sameStrong.push(el);
        elementBonus -= 5;
      }
    }
    if (sameStrong.length > 0) {
      elementAnalysis = `你们都在${sameStrong.join('、')}行上偏旺 — 相似性强但需引入新的共同活动来平衡。`;
    } else {
      elementAnalysis = '五行配置各有特色，虽无明显互补但也不会冲突。';
    }
  }
  score += elementBonus;

  // ---- 综合评分 ----
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ---- 缘分参考 ----
  let relationshipType: string;
  if (score >= 85) {
    relationshipType = '💫 很合拍 — 五行气场很契合，相处起来会特别舒服';
  } else if (score >= 70) {
    relationshipType = '🌿 挺不错 — 有默契基础，慢慢了解会发现更多惊喜';
  } else if (score >= 55) {
    relationshipType = '🍃 可以试试 — 有些差异但也是互相了解的机会';
  } else if (score >= 40) {
    relationshipType = '🌱 随缘就好 — 不那么合拍也没关系，真诚最重要';
  } else {
    relationshipType = '🌸 顺其自然 — 每个人的相遇都有它的意义';
  }

  if ((stemBonus >= 25 || branchScore >= 20) && score < 70) {
    relationshipType = '✨ 有特别的缘分 — 某些方面莫名地契合，值得留意一下';
  }

  return {
    overallScore: score,
    relationshipType,
    analysis: {
      dayMaster: dayMasterAnalysis,
      stems: `【天干】${stemAnalysisParts.join('；')}`,
      branches: `【地支】${branchAnalysisParts.join('；')}`,
      elements: `【五行】${elementAnalysis}`,
      overall: generateOverallVerdict(score, chart1, chart2),
    },
    elementReading: generateElementReading(chart1, chart2),
    warnings,
    suggestions: suggestions.length > 0 ? suggestions : ['多了解对方的兴趣爱好，找到共同的兴趣点'],
  };
}

function generateOverallVerdict(score: number, chart1: BaZiChart, chart2: BaZiChart): string {
  const z1 = BRANCH_ZODIAC[chart1.year.branch];
  const z2 = BRANCH_ZODIAC[chart2.year.branch];

  if (score >= 85) {
    return `从五行来看，${chart1.dayMaster}${chart1.dayMasterElement}命和${chart2.dayMaster}${chart2.dayMasterElement}命的气场很自然地契合，生肖${z1}与${z2}的组合也挺和谐的。这种默契不是每个人都能遇到的，如果觉得聊得来，不妨多一些了解。`;
  } else if (score >= 70) {
    return `你们的五行组合整体是舒服的，虽然有些小差异需要时间磨合，但${z1}和${z2}有一定的默契基础。放轻松去相处就行，不需要刻意追求什么结果。`;
  } else if (score >= 55) {
    return `五行上有些不同之处，但这未必是坏事——有时候差异反而让人更想去了解对方。从日常聊天开始，不着急，日久见人心。`;
  } else if (score >= 40) {
    return `你们的气场风格差异挺大的，可能一开始不太容易有火花。但这世界上很多美好的关系最初看起来都不那么合拍。真诚的相处比所谓的「配不配」重要得多。`;
  } else {
    return `从五行上看你们确实比较不同，相处可能需要更多的耐心和包容。但任何人之间的相遇都有它的意义，哪怕最终只是一段普通的聊天，也是好的。`;
  }
}

function generateElementReading(chart1: BaZiChart, chart2: BaZiChart): string {
  const parts: string[] = [];
  parts.push(`年命纳音：${chart1.year.nayin} — ${chart2.year.nayin}`);
  const e1 = chart1.dayMasterElement;
  const e2 = chart2.dayMasterElement;
  parts.push(`日主：${e1}命 — ${e2}命`);
  if (ELEMENT_GENERATES[e1] === e2) {
    parts.push(`${e1}生${e2}：你天然地愿意为对方付出`);
  } else if (ELEMENT_GENERATES[e2] === e1) {
    parts.push(`${e2}生${e1}：对方会给予你很多滋养和支持`);
  } else if (ELEMENT_CONTROLS[e1] === e2) {
    parts.push(`${e1}克${e2}：你更有主导权，注意温柔对待对方`);
  } else if (ELEMENT_CONTROLS[e2] === e1) {
    parts.push(`${e2}克${e1}：对方更有主导力，这是成长的契机`);
  }
  parts.push('五行阴阳学说是朴素唯物主义和经验主义的结晶，仅供参考。');
  return parts.join('；');
}

// ========================================
//  个人八字命理分析
// ========================================

interface PersonalBaZiReading {
  /** 日主性格描述 */
  personality: string;
  /** 五行强弱分析 */
  elementAnalysis: string;
  /** 适合的伴侣类型 */
  partnerAdvice: PartnerAdvice;
  /** 适合的朋友类型 */
  friendAdvice: FriendAdvice;
  /** 学业/发展方向提示 */
  lifeTips: string[];
}

interface PartnerAdvice {
  /** 最适合的日主五行 */
  bestElements: string[];
  /** 互补说明 */
  description: string;
  /** 相处关键词 */
  keywords: string[];
}

interface FriendAdvice {
  /** 有益的朋友五行 */
  goodElements: string[];
  /** 朋友相处建议 */
  description: string;
}

/** 日主性格描述 */
const DAY_MASTER_PERSONALITY: Record<Stem, string> = {
  '甲': '甲木为参天大树，正直坚强，有领导力。像一棵挺拔的松树，目标明确，不轻易动摇。在人群中往往是那个有主见、能扛事的人。偶尔会显得固执，但那份坚定也是你的魅力所在。',
  '乙': '乙木为藤萝花草，温柔灵活，适应力强。你不喜欢正面冲突，善于在复杂环境中找到自己的生存空间。有艺术气质，心思细腻，是那种润物细无声的存在。',
  '丙': '丙火为太阳之火，热情开朗，光明磊落。你像一个小太阳，走到哪里都能带来温暖和能量。天生的感染力让你容易成为人群的焦点。只是要注意，太阳也需要偶尔休息。',
  '丁': '丁火为灯烛之火，内敛而有温度。你不是最耀眼的那一个，但能在黑暗中给人方向。心思敏锐，洞察力强，擅长在细节中发现别人忽略的东西。',
  '戊': '戊土为城墙之土，厚重可靠，脚踏实地。你是那种让人安心的存在，答应的事一定会做到。不善表达感情，但行动就是你的语言。靠谱是最高级的社交货币。',
  '己': '己土为田园之土，温和包容，滋养万物。你擅长倾听，是朋友们心中那个可以说心里话的人。有耐心，有同理心，像一片柔软的土壤，承载着周围的人和事。',
  '庚': '庚金为刀剑之金，果决锋利，追求卓越。你有很强的原则性和执行力，不拖泥带水。在人群中是那种效率至上、说到做到的人。锋芒需要适当收敛，但不必磨平。',
  '辛': '辛金为珠玉之金，精致细腻，品味出众。你对美有很高的敏感度，追求生活品质。不张扬但有格调，是那种越品越有味道的人。',
  '壬': '壬水为大江大河，豁达开朗，智慧灵动。你心胸开阔，不拘小节，适应能力强。天生有一种通达的智慧，能看到事物的本质。像水一样，看似柔软，却能穿石。',
  '癸': '癸水为雨露之水，细腻敏感，洞察人心。你有一种天生的灵气，直觉很准。不爱喧闹但内心世界丰富，是很深的灵魂。' ,
};

/** 五行强弱解读 */
function analyzeFiveElements(chart: BaZiChart): string {
  const counts = chart.elementCount;
  const parts: string[] = [];
  const elementNames: Record<string, string> = {
    '木': '🌳 木', '火': '🔥 火', '土': '⛰️ 土', '金': '💎 金', '水': '💧 水',
  };

  for (const el of ELEMENTS) {
    const count = counts[el] || 0;
    if (count >= 4) {
      parts.push(`${elementNames[el]}偏旺（${count}个），需要注意避免${el === '木' ? '固执己见' : el === '火' ? '急躁冲动' : el === '土' ? '过于保守' : el === '金' ? '锋芒太露' : '情绪波动'}。`);
    } else if (count <= 1) {
      parts.push(`${elementNames[el]}偏弱（${count}个），可以在日常生活中多补充${el}行的能量。`);
    } else {
      parts.push(`${elementNames[el]}适中（${count}个），平衡良好。`);
    }
  }
  return parts.join('\n');
}

/** 分析适合的伴侣类型 */
function analyzePartnerAdvice(chart: BaZiChart): PartnerAdvice {
  const dmElement = chart.dayMasterElement;
  // 日主五行对应的最佳伴侣五行
  const idealPartnerElements: Record<Element, { best: Element[]; desc: string; keywords: string[] }> = {
    '木': {
      best: ['水', '木'],
      desc: '你适合找一个能滋养你的人。水命的伴侣能懂你的内心，在你需要的时候给你支持和理解。同样是木命的人则能和你并肩前行，志同道合。和水命的人在一起，你感到被温柔以待；和木命的人在一起，像两棵并肩的树，一起成长。',
      keywords: ['理解', '支持', '共同成长'],
    },
    '火': {
      best: ['木', '土'],
      desc: '你热情似火，需要一个能给你持续燃料的人。木命的伴侣能让你更加闪耀，对方欣赏你的光芒并为你提供舞台。土命的伴侣则能将你的热情转化为踏实的幸福，让你在奔放中也有依靠。',
      keywords: ['欣赏', '踏实', '双向奔赴'],
    },
    '土': {
      best: ['火', '金'],
      desc: '你稳重可靠，最适合你的是能给你温暖的人。火命的伴侣用热情融化你的内敛，给你表达爱的勇气。金命的伴侣则和你有天然的默契，对方的目标感和你对生活的认真态度相得益彰。',
      keywords: ['温暖', '默契', '相互成就'],
    },
    '金': {
      best: ['土', '水'],
      desc: '你做事有原则，追求完美。土命的伴侣给你踏实的安全感，用包容承载你的锐利。水命的伴侣则用智慧和柔韧让你看到世界的另一面，让你明白有时候松弛也是一种力量。',
      keywords: ['包容', '松弛', '互相打磨'],
    },
    '水': {
      best: ['金', '木'],
      desc: '你聪明灵动，最好的伴侣是能给你方向感的人。金命的伴侣为你提供清晰的框架和力量，让你在自由中有归处。木命的伴侣能被你滋养，同时也用生长的力量感染你，一起去看更大的世界。',
      keywords: ['方向感', '自由', '一起探索'],
    },
  };

  const advice = idealPartnerElements[dmElement];
  return {
    bestElements: advice.best,
    description: advice.desc,
    keywords: advice.keywords,
  };
}

/** 分析适合的朋友类型 */
function analyzeFriendAdvice(chart: BaZiChart): FriendAdvice {
  const dmElement = chart.dayMasterElement;
  // 对每种日主，最适合做朋友的五行
  const idealFriendElements: Record<Element, { good: Element[]; desc: string }> = {
    '木': {
      good: ['火', '土'],
      desc: '火命的朋友能让你的想法被看见，你们的交流充满激情和创造力。土命的朋友则能帮你把想法落地，是那种可以在你天马行空时提醒你「别忘了交作业」的实在人。',
    },
    '火': {
      good: ['土', '金'],
      desc: '土命的朋友能让你在燃烧时有一个安稳的着陆点。金命的朋友则能和你碰撞出思想的火花，一起探讨一些深入的话题。',
    },
    '土': {
      good: ['金', '水'],
      desc: '金命的朋友和你在价值观上天然契合，很多事不需要解释就能懂。水命的朋友则能为你的生活带来新鲜感和不同的视角，让你偶尔走出舒适圈。',
    },
    '金': {
      good: ['水', '木'],
      desc: '水命的朋友能让你放松下来，看到你柔软的一面。木命的朋友则能欣赏你的能力和坚持，你们之间有一种相互尊重的关系。',
    },
    '水': {
      good: ['木', '火'],
      desc: '木命的朋友能被你滋养，你们在一起时彼此都能变得更好。火命的朋友能激发你的热情，让你看到自己更明亮的一面。',
    },
  };

  const advice = idealFriendElements[dmElement];
  return {
    goodElements: advice.good,
    description: advice.desc,
  };
}

/** 全面分析个人八字 */
export function analyzePersonalBaZi(chart: BaZiChart): PersonalBaZiReading {
  const lifeTips: string[] = [];

  // 学业/发展提示
  const dm = chart.dayMasterElement;
  if (dm === '木') {
    lifeTips.push('适合需要创造力和领导力的方向，如创业、管理、设计。');
    lifeTips.push('学习中注意不要固执己见，多吸收不同观点。');
  } else if (dm === '火') {
    lifeTips.push('你的表达能力和感染力是天生的优势，适合传媒、教育、艺术方向。');
    lifeTips.push('做事前多思三分，火命容易一时冲动做了后悔的决定。');
  } else if (dm === '土') {
    lifeTips.push('踏实稳重的你适合需要耐心和细节的工作，如科研、工程、金融。');
    lifeTips.push('记得偶尔走出舒适圈，尝试一些新鲜事物，土命容易安于现状。');
  } else if (dm === '金') {
    lifeTips.push('你的执行力和原则性让你在法律、管理、技术方向有天然优势。');
    lifeTips.push('学会放松，不是所有事情都需要做到完美。');
  } else if (dm === '水') {
    lifeTips.push('你的智慧和灵活性适合学术研究、写作、咨询等需要深度思考的方向。');
    lifeTips.push('设定一些具体的目标，水命容易随波逐流缺乏方向感。');
  }

  // 五行缺失补充建议
  for (const el of ELEMENTS) {
    if ((chart.elementCount[el] || 0) <= 1) {
      const tips: Record<string, string> = {
        '木': '多去公园或树林散步，养一些绿色植物在宿舍，有助于补充木行能量。',
        '火': '多晒太阳，穿一些暖色调的衣服，参加一些让自己开心的社交活动。',
        '土': '多接触大自然，养一些多肉植物，保持规律的作息时间。',
        '金': '听一些金属质感的音乐，学习一门乐器，整理好自己的生活空间。',
        '水': '多喝水，靠近有水的环境（湖边、河边），给自己留一些独处的时间。',
      };
      if (tips[el]) lifeTips.push(tips[el]);
    }
  }

  return {
    personality: DAY_MASTER_PERSONALITY[chart.dayMaster],
    elementAnalysis: analyzeFiveElements(chart),
    partnerAdvice: analyzePartnerAdvice(chart),
    friendAdvice: analyzeFriendAdvice(chart),
    lifeTips,
  };
}
