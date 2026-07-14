import { useState } from 'react';
import type { UserInfo } from '../types';

interface Props {
  user: UserInfo;
  onBack: () => void;
  updateStatus: (status: 'available' | 'busy' | 'studying' | 'invisible') => void;
  saveBirth?: (year: number, month: number, day: number, hour: number) => void;
  birthSaved?: boolean;
  onGoBaziFortune?: () => void;
}

const statusConfig = [
  { value: 'available' as const, label: '有空', desc: '可以见面聊聊', emoji: '🟢', border: 'border-green-400/30' },
  { value: 'busy' as const, label: '在忙', desc: '先聊天，有空再说', emoji: '🟡', border: 'border-yellow-400/30' },
  { value: 'studying' as const, label: '在自习', desc: '可以一起学习', emoji: '🔵', border: 'border-blue-400/30' },
  { value: 'invisible' as const, label: '隐身', desc: '不参与匹配', emoji: '⚪', border: 'border-white/10' },
];

export default function ProfilePage({ user, onBack, updateStatus, saveBirth, birthSaved, onGoBaziFortune }: Props) {
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showBirthForm, setShowBirthForm] = useState(false);
  const [birthYear, setBirthYear] = useState(2002);
  const [birthMonth, setBirthMonth] = useState(6);
  const [birthDay, setBirthDay] = useState(15);
  const [birthHour, setBirthHour] = useState(12);

  const currentStatus = statusConfig.find(s => s.value === user.status) || statusConfig[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0a1a] relative">
      {/* 背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/5 to-purple-600/5 blur-3xl" />
      </div>

      {/* 顶部栏 */}
      <div className="px-4 py-4 flex items-center gap-3 relative z-10">
        <button onClick={onBack} className="text-white/30 hover:text-white/60 text-lg">‹</button>
        <h1 className="text-white/70 font-medium text-sm">我的</h1>
      </div>

      <div className="px-4 py-4 space-y-4 relative z-10">
        {/* 用户卡片 */}
        <div className="glass-card-strong p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center text-white text-xl font-bold">
                {user.nickname.charAt(0)}
              </div>
            </div>
            <div>
              <p className="text-white/80 font-semibold">{user.nickname}</p>
              <p className="text-white/25 text-sm">{user.universityName} · {user.campusName}</p>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div className="flex-1"><p className="text-pink-400 text-xl font-bold">{user.meetScore}</p><p className="text-white/20 text-xs">信誉分</p></div>
            <div className="flex-1"><p className="text-white/60 text-xl font-bold">{user.meetCount}</p><p className="text-white/20 text-xs">见面</p></div>
            <div className="flex-1"><p className="text-white/60 text-xl font-bold">0</p><p className="text-white/20 text-xs">互关</p></div>
          </div>
        </div>

        {/* 状态设置 */}
        <div className="glass-card overflow-hidden">
          <button onClick={() => setShowStatusPicker(!showStatusPicker)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">{currentStatus.emoji}</span>
              <div className="text-left"><p className="text-white/60 text-sm">{currentStatus.label}</p><p className="text-white/20 text-xs">{currentStatus.desc}</p></div>
            </div>
            <span className={`text-white/20 transition-transform ${showStatusPicker ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showStatusPicker && (
            <div className="border-t border-white/5 px-4 py-3 space-y-2 animate-soul-slide-up">
              {statusConfig.map(s => (
                <button key={s.value} onClick={() => { updateStatus(s.value); setShowStatusPicker(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${user.status === s.value ? s.border + ' bg-white/5' : 'border-transparent hover:bg-white/3'}`}>
                  <span className="text-lg">{s.emoji}</span>
                  <div className="text-left"><p className="text-white/60 text-sm">{s.label}</p><p className="text-white/20 text-xs">{s.desc}</p></div>
                  {user.status === s.value && <span className="ml-auto text-pink-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 出生时间 */}
        <div className="glass-card overflow-hidden">
          <button onClick={() => setShowBirthForm(!showBirthForm)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">☯</span>
              <div className="text-left">
                <p className="text-white/60 text-sm">出生时间（八字合婚）</p>
                <p className="text-white/20 text-xs">{birthSaved ? '✅ 已填写' : '用于八字合婚分析'}</p>
              </div>
            </div>
            <span className={`text-white/20 transition-transform ${showBirthForm ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {showBirthForm && (
            <div className="border-t border-white/5 px-4 py-4 animate-soul-slide-up">
              <p className="text-white/25 text-xs mb-4 leading-relaxed">☯ 八字命理基于五行阴阳学说，是朴素唯物主义和经验主义的结晶。填写出生时间后可在聊天中进行合婚分析。</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/25 text-xs mb-1.5">出生年份</label>
                  <select value={birthYear} onChange={e => setBirthYear(+e.target.value)}
                    className="soul-input text-sm">
                    {Array.from({ length: 12 }, (_, i) => 2000 + i).map(y => <option key={y} value={y}>{y}年</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/25 text-xs mb-1.5">出生月份</label>
                  <select value={birthMonth} onChange={e => setBirthMonth(+e.target.value)}
                    className="soul-input text-sm">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}月</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/25 text-xs mb-1.5">出生日期</label>
                  <select value={birthDay} onChange={e => setBirthDay(+e.target.value)}
                    className="soul-input text-sm">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}日</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/25 text-xs mb-1.5">出生时辰</label>
                  <select value={birthHour} onChange={e => setBirthHour(+e.target.value)}
                    className="soul-input text-sm">
                    {[
                      { v: 0, label: '子时 (23-1点)' }, { v: 2, label: '丑时 (1-3点)' },
                      { v: 4, label: '寅时 (3-5点)' }, { v: 6, label: '卯时 (5-7点)' },
                      { v: 8, label: '辰时 (7-9点)' }, { v: 10, label: '巳时 (9-11点)' },
                      { v: 12, label: '午时 (11-13点)' }, { v: 14, label: '未时 (13-15点)' },
                      { v: 16, label: '申时 (15-17点)' }, { v: 18, label: '酉时 (17-19点)' },
                      { v: 20, label: '戌时 (19-21点)' }, { v: 22, label: '亥时 (21-23点)' },
                    ].map(h => <option key={h.v} value={h.v}>{h.label}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => { saveBirth?.(birthYear, birthMonth, birthDay, birthHour); setShowBirthForm(false); }}
                className="soul-btn w-full mt-4 text-sm">
                ☯ 保存出生时间
              </button>
              {birthSaved && <p className="text-pink-400/80 text-xs mt-2 text-center">✅ 已保存</p>}
            </div>
          )}
        </div>

        {/* 八字命理入口 */}
        {onGoBaziFortune && (
          <button onClick={onGoBaziFortune}
            className="w-full glass-card px-5 py-4 flex items-center justify-between hover:border-pink-400/20 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-500/20 flex items-center justify-center text-lg">☯</div>
              <div className="text-left">
                <p className="text-white/60 text-sm">八字命理</p>
                <p className="text-white/20 text-xs">查看你的命盘，了解自己的五行能量</p>
              </div>
            </div>
            <span className="text-white/10 group-hover:text-white/30 transition-colors">›</span>
          </button>
        )}

        {/* 功能列表 */}
        <div className="glass-card overflow-hidden">
          {[
            { icon: '🏫', label: '修改学校/校区' },
            { icon: '🛡️', label: '安全中心', soon: true },
            { icon: '📝', label: '意见反馈' },
          ].map((item, i) => (
            <button key={i} disabled={item.soon}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 disabled:opacity-30">
              <span className="text-lg">{item.icon}</span>
              <span className="text-white/50 text-sm flex-1 text-left">{item.label}</span>
              {item.soon && <span className="text-white/10 text-xs">即将开放</span>}
              <span className="text-white/10">›</span>
            </button>
          ))}
        </div>

        <button onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
          className="w-full py-3 text-white/15 text-sm hover:text-red-400/60 transition-colors">
          退出登录
        </button>
        <p className="text-center text-white/8 text-xs">碰一下 v1.0 · Soul of Campus</p>
      </div>
    </div>
  );
}
