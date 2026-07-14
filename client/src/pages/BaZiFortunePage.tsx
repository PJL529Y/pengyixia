import { useState, useEffect } from 'react';
import type { BaZiChart } from '../types';

interface PersonalReading {
  personality: string;
  elementAnalysis: string;
  partnerAdvice: {
    bestElements: string[];
    description: string;
    keywords: string[];
  };
  friendAdvice: {
    goodElements: string[];
    description: string;
  };
  lifeTips: string[];
}

interface Props {
  userId: string;
  onBack: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function BaZiFortunePage({ userId, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState<BaZiChart | null>(null);
  const [reading, setReading] = useState<PersonalReading | null>(null);
  const [error, setError] = useState('');
  // 编辑模式
  const [editYear, setEditYear] = useState(2002);
  const [editMonth, setEditMonth] = useState(6);
  const [editDay, setEditDay] = useState(15);
  const [editHour, setEditHour] = useState(12);
  const [hasBirthInfo, setHasBirthInfo] = useState(false);

  useEffect(() => {
    loadBirthAndAnalyze();
  }, []);

  const loadBirthAndAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      // 先获取用户信息
      const saved = localStorage.getItem('user');
      if (saved) {
        const user = JSON.parse(saved);
        // 先尝试分析——如果服务端没有存储出生信息，让用户手动输入
        // 用默认值先展示
      }

      // 从localStorage读取出生信息
      const birthStr = localStorage.getItem('birthInfo');
      if (birthStr) {
        const birth = JSON.parse(birthStr);
        setEditYear(birth.year); setEditMonth(birth.month);
        setEditDay(birth.day); setEditHour(birth.hour);
        setHasBirthInfo(true);
        await fetchAnalysis(birth.year, birth.month, birth.day, birth.hour);
      } else {
        setHasBirthInfo(false);
        setLoading(false);
      }
    } catch {
      setError('加载失败');
      setLoading(false);
    }
  };

  const fetchAnalysis = async (year: number, month: number, day: number, hour: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/bazi/personal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, day, hour }),
      });
      const data = await res.json();
      if (data.success) {
        setChart(data.data.chart);
        setReading(data.data.reading);
        // 保存到localStorage
        localStorage.setItem('birthInfo', JSON.stringify({ year, month, day, hour }));
        setHasBirthInfo(true);
      } else {
        setError(data.message);
      }
    } catch {
      setError('网络错误');
    }
    setLoading(false);
  };

  const handleAnalyze = () => {
    fetchAnalysis(editYear, editMonth, editDay, editHour);
  };

  const elementNames: Record<string, string> = { '木': '🌳 木', '火': '🔥 火', '土': '⛰️ 土', '金': '💎 金', '水': '💧 水' };
  const elementColors: Record<string, string> = {
    '木': 'border-green-400/30 bg-green-500/5', '火': 'border-red-400/30 bg-red-500/5',
    '土': 'border-yellow-400/30 bg-yellow-500/5', '金': 'border-amber-400/30 bg-amber-500/5',
    '水': 'border-blue-400/30 bg-blue-500/5',
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {/* 背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-pink-500/8 to-purple-600/8 blur-3xl" />
      </div>

      {/* 顶部 */}
      <div className="px-4 py-4 flex items-center gap-3 relative z-10 border-b border-white/5">
        <button onClick={onBack} className="text-white/30 hover:text-white/60 text-lg">‹</button>
        <h1 className="text-white/70 font-medium text-sm">☯ 八字命理</h1>
      </div>

      <div className="px-4 py-6 space-y-5 relative z-10">
        {/* 输入区 */}
        {!hasBirthInfo && (
          <div className="glass-card-strong p-5 animate-soul-fade-in">
            <p className="text-white/50 text-sm text-center mb-4">
              输入你的出生时间，看看你的八字命盘
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div><label className="block text-white/25 text-xs mb-1.5">出生年份</label>
                <select value={editYear} onChange={e => setEditYear(+e.target.value)} className="soul-input text-sm">
                  {Array.from({length:12},(_,i)=>2000+i).map(y=><option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
              <div><label className="block text-white/25 text-xs mb-1.5">出生月份</label>
                <select value={editMonth} onChange={e => setEditMonth(+e.target.value)} className="soul-input text-sm">
                  {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}月</option>)}
                </select>
              </div>
              <div><label className="block text-white/25 text-xs mb-1.5">出生日期</label>
                <select value={editDay} onChange={e => setEditDay(+e.target.value)} className="soul-input text-sm">
                  {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
              <div><label className="block text-white/25 text-xs mb-1.5">出生时辰</label>
                <select value={editHour} onChange={e => setEditHour(+e.target.value)} className="soul-input text-sm">
                  {[
                    {v:0,l:'子时 23-1点'},{v:2,l:'丑时 1-3点'},{v:4,l:'寅时 3-5点'},{v:6,l:'卯时 5-7点'},
                    {v:8,l:'辰时 7-9点'},{v:10,l:'巳时 9-11点'},{v:12,l:'午时 11-13点'},{v:14,l:'未时 13-15点'},
                    {v:16,l:'申时 15-17点'},{v:18,l:'酉时 17-19点'},{v:20,l:'戌时 19-21点'},{v:22,l:'亥时 21-23点'},
                  ].map(h=><option key={h.v} value={h.v}>{h.l}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleAnalyze} className="soul-btn w-full text-sm">查看我的八字</button>
          </div>
        )}

        {/* 加载中 */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center animate-soul-glow">
              <span className="text-2xl animate-spin">☯</span>
            </div>
            <p className="text-white/30 text-sm mt-4">排盘中...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">{error}</div>
        )}

        {/* 结果 */}
        {!loading && reading && chart && (
          <div className="animate-soul-slide-up space-y-5">
            {/* 八字排盘卡片 */}
            <div className="glass-card-strong p-5">
              <div className="text-center mb-4">
                <p className="text-white/30 text-xs mb-1">命盘</p>
                <p className="text-2xl font-bold">
                  <span className="text-pink-400">{chart.dayMaster}</span>
                  <span className="text-white/50 text-lg"> · </span>
                  <span className="text-white/70">{chart.dayMasterElement}命</span>
                </p>
              </div>

              {/* 四柱 */}
              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                {(['year','month','day','hour'] as const).map(k => (
                  <div key={k} className="glass-card p-2.5">
                    <p className="text-white/15 text-[10px] mb-1">
                      {k === 'year' ? '年柱' : k === 'month' ? '月柱' : k === 'day' ? '日柱' : '时柱'}
                    </p>
                    <p className="text-white/70 text-sm font-medium">{chart[k].fullName}</p>
                    <p className="text-white/15 text-[10px] mt-0.5">{chart[k].nayin}</p>
                  </div>
                ))}
              </div>

              {/* 五行统计 */}
              <div>
                <p className="text-white/20 text-xs mb-2">五行分布</p>
                <div className="space-y-1.5">
                  {(['木','火','土','金','水'] as const).map(el => (
                    <div key={el} className="flex items-center gap-2">
                      <span className="text-white/40 text-xs w-8">{elementNames[el]}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          el === '木' ? 'bg-green-400' : el === '火' ? 'bg-red-400' : el === '土' ? 'bg-yellow-400' : el === '金' ? 'bg-amber-300' : 'bg-blue-400'
                        }`} style={{width:`${Math.min(100,(chart.elementCount[el]||0)*25)}%`}} />
                      </div>
                      <span className="text-white/20 text-xs w-3">{chart.elementCount[el]||0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 日主性格 */}
            <div className="glass-card p-5">
              <p className="text-white/30 text-xs mb-3">
                🌟 你的日主 — <span className="text-pink-400">{chart.dayMaster}</span>（{chart.dayMasterElement}命）
              </p>
              <p className="text-white/60 text-sm leading-relaxed">{reading.personality}</p>
            </div>

            {/* 五行解读 */}
            <div className="glass-card p-5">
              <p className="text-white/30 text-xs mb-3">⚖️ 五行能量</p>
              <div className="text-white/50 text-xs leading-relaxed space-y-1.5">
                {reading.elementAnalysis.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* 伴侣适配参考 */}
            <div className="glass-card-strong p-5 border-pink-500/20">
              <p className="text-pink-400/80 text-xs mb-1">💝 参考：适合的伴侣类型</p>
              <p className="text-white/20 text-[10px] mb-3">以下仅为五行参考，真正的关系建立在真诚之上</p>
              <div className="flex gap-2 mb-3">
                {reading.partnerAdvice.bestElements.map(el => (
                  <span key={el} className={`px-3 py-1 rounded-full text-xs border ${elementColors[el]} text-white/60`}>
                    {elementNames[el]}
                  </span>
                ))}
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-3">{reading.partnerAdvice.description}</p>
              <div className="flex gap-2 flex-wrap">
                {reading.partnerAdvice.keywords.map(kw => (
                  <span key={kw} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-xs">#{kw}</span>
                ))}
              </div>
            </div>

            {/* 朋友适配参考 */}
            <div className="glass-card p-5">
              <p className="text-white/30 text-xs mb-1">🤝 参考：聊得来的朋友类型</p>
              <p className="text-white/15 text-[10px] mb-3">以下仅为五行参考，朋友不分五行</p>
              <div className="flex gap-2 mb-3">
                {reading.friendAdvice.goodElements.map(el => (
                  <span key={el} className={`px-3 py-1 rounded-full text-xs border ${elementColors[el]} text-white/60`}>
                    {elementNames[el]}
                  </span>
                ))}
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{reading.friendAdvice.description}</p>
            </div>

            {/* 小提示 */}
            <div className="glass-card p-5">
              <p className="text-white/30 text-xs mb-3">💡 给你的小提示</p>
              <div className="space-y-2">
                {reading.lifeTips.map((tip, i) => (
                  <p key={i} className="text-white/50 text-xs leading-relaxed">• {tip}</p>
                ))}
              </div>
            </div>

            {/* 重新输入 */}
            <button
              onClick={() => { setHasBirthInfo(false); setChart(null); setReading(null); }}
              className="w-full py-3 text-white/15 text-sm hover:text-white/30 transition-colors"
            >
              重新输入出生时间
            </button>

            {/* 底部声明 */}
            <p className="text-center text-white/8 text-xs pb-8">
              五行阴阳学说是朴素唯物主义和经验主义的结晶，仅供娱乐参考。
              真正的关系建立在真诚、尊重和理解之上。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
