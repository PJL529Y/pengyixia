import { useState, useEffect, useCallback } from 'react';
import type { University } from '../types';

interface Props {
  onRegister: (universityId: number, gender: 'male' | 'female', campusName?: string) => void;
}

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function AuthPage({ onRegister }: Props) {
  const [step, setStep] = useState<'gender' | 'school' | 'verify'>('gender');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<University[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<University | null>(null);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchSchools = useCallback(async (query: string) => {
    if (query.length < 1) { setSchools([]); return; }
    try {
      const res = await fetch(`${API_BASE}/universities/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) setSchools(data.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchSchools(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchSchools]);

  const handleVerify = async () => {
    if (!selectedSchool || !studentId || !name || !gender) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId: selectedSchool.id,
          studentId: studentId.trim(),
          name: name.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRegister(selectedSchool.id, gender, selectedSchool.campuses[0]?.name);
      } else {
        setError(data.message);
      }
    } catch {
      setError('网络错误，请重试');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 blur-3xl animate-soul-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400/8 to-blue-600/8 blur-3xl animate-soul-pulse" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`, opacity: 0.15 + Math.random() * 0.3,
          }} />
        ))}
      </div>

      {/* 内容 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 relative z-10">
        {/* Logo */}
        <div className="mb-8 text-center animate-soul-slide-up">
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 p-[3px] shadow-2xl shadow-purple-500/20">
            <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center">
              <span className="text-5xl animate-soul-float">🌙</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wider">碰一下</h1>
          <p className="text-sm text-white/30">最近的本科大学生，此刻就见到面</p>
        </div>

        {/* 步骤1：性别 */}
        {step === 'gender' && (
          <div className="w-full max-w-xs animate-soul-slide-up">
            <p className="text-center text-white/50 text-sm mb-8">选择你的性别</p>
            <div className="flex gap-4">
              <button onClick={() => { setGender('male'); setStep('school'); }}
                className="flex-1 py-10 glass-card hover:border-pink-400/30 transition-all duration-500 group">
                <div className="soul-avatar w-16 h-16 mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #45d9d9, #3b82f6)' }}>♂</div>
                <div className="text-white/80 font-medium">男生</div>
              </button>
              <button onClick={() => { setGender('female'); setStep('school'); }}
                className="flex-1 py-10 glass-card hover:border-pink-400/30 transition-all duration-500 group">
                <div className="soul-avatar w-16 h-16 mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #ff6b9d, #a78bfa)' }}>♀</div>
                <div className="text-white/80 font-medium">女生</div>
              </button>
            </div>
          </div>
        )}

        {/* 步骤2：学校 */}
        {step === 'school' && (
          <div className="w-full max-w-xs animate-soul-slide-up">
            <p className="text-center text-white/50 text-sm mb-2">选择你的学校</p>
            <p className="text-center text-white/20 text-xs mb-6">仅限本科及以上学历</p>

            <div className="relative mb-4">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索学校名称..." className="soul-input" autoFocus />
            </div>

            {schools.length === 0 && !searchQuery && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {['清华大学', '北京大学', '浙江大学', '复旦大学', '武汉大学', '中山大学', '南京大学', '上交'].map(name => (
                  <button key={name} onClick={() => setSearchQuery(name)}
                    className="text-left px-3 py-2.5 glass-card text-sm text-white/50 hover:text-white/80 transition-all">
                    {name}
                  </button>
                ))}
              </div>
            )}

            {schools.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {schools.map(school => (
                  <button key={school.id} onClick={() => {
                    setSelectedSchool(school); setStep('verify'); setStudentId(''); setName(''); setError('');
                  }} className="w-full text-left px-4 py-3 glass-card hover:border-pink-400/30 transition-all">
                    <div className="text-white/80 text-sm font-medium">{school.name}</div>
                    <div className="text-white/25 text-xs">{school.city} · {school.level}</div>
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setStep('gender')} className="mt-6 w-full text-sm text-white/20 hover:text-white/40 transition-colors">
              ← 重新选择
            </button>
          </div>
        )}

        {/* 步骤3：学号+姓名 */}
        {step === 'verify' && selectedSchool && (
          <div className="w-full max-w-xs animate-soul-slide-up">
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-white/80">{selectedSchool.name}</div>
              <div className="text-sm text-white/30 mt-1">验证你的学生身份</div>
            </div>

            <div className="glass-card-strong p-5 space-y-4 border-cyan-500/10">
              {/* 学号 */}
              <div>
                <label className="block text-xs text-white/40 mb-2">学号</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  placeholder="输入你的学号"
                  className="soul-input text-sm"
                  autoFocus
                />
                <p className="text-white/15 text-[10px] mt-1">学校系统里的学号，6-15位数字或字母</p>
              </div>

              {/* 姓名 */}
              <div>
                <label className="block text-xs text-white/40 mb-2">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="输入你的真实姓名"
                  className="soul-input text-sm"
                />
                <p className="text-white/15 text-[10px] mt-1">仅用于身份验证，不会公开显示</p>
              </div>

              {/* 提示 */}
              <div className="glass-card p-3 border-cyan-500/15">
                <p className="text-white/30 text-xs leading-relaxed">
                  🔒 你的学号和姓名仅用于验证学生身份，不会被其他用户看到。你的昵称是系统随机生成的。
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || !studentId.trim() || !name.trim()}
              className="soul-btn w-full mt-4 disabled:opacity-40 text-sm"
            >
              {loading ? '验证中...' : '完成认证'}
            </button>

            <p className="text-center text-white/15 text-[10px] mt-3">
              同一学号仅限注册一次 · 发现冒用将永久封禁
            </p>

            <button onClick={() => setStep('school')}
              className="w-full mt-4 text-sm text-white/20 hover:text-white/40 transition-colors">
              ← 重新选择学校
            </button>
          </div>
        )}
      </div>

      <div className="pb-8 text-center relative z-10">
        <p className="text-xs text-white/10">仅限本科学历 · 学号认证安全可靠</p>
      </div>
    </div>
  );
}
