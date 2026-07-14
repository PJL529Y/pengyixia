import { useState, useEffect, useCallback } from 'react';
import type { University } from '../types';

interface Props {
  onRegister: (universityId: number, gender: 'male' | 'female', campusName?: string) => void;
}

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function AuthPage({ onRegister }: Props) {
  const [step, setStep] = useState<'gender' | 'school' | 'email' | 'ready'>('gender');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<University[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<University | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [devCode, setDevCode] = useState(''); // 开发模式显示验证码
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

  const sendCode = async () => {
    if (!email || !selectedSchool) return;
    setLoading(true);
    setError('');
    try {
      const fullEmail = `${email}@${selectedSchool.eduDomain}`;
      const res = await fetch(`${API_BASE}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fullEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        // 开发模式：从API返回中提取验证码（如果在响应里）
        if (data.devCode) setDevCode(data.devCode);
      } else {
        setError(data.message);
      }
    } catch {
      setError('网络错误，请重试');
    }
    setLoading(false);
  };

  const verifyAndRegister = async () => {
    if (!selectedSchool || !email || !code || !gender) return;
    setLoading(true);
    setError('');
    try {
      const fullEmail = `${email}@${selectedSchool.eduDomain}`;
      const res = await fetch(`${API_BASE}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fullEmail, code }),
      });
      const data = await res.json();
      if (data.success) {
        onRegister(selectedSchool.id, gender, selectedSchool.campuses[0]?.name);
        setStep('ready');
      } else {
        setError(data.message);
      }
    } catch {
      setError('网络错误，请重试');
    }
    setLoading(false);
  };

  const skipEmailVerify = () => {
    if (!selectedSchool || !gender) return;
    onRegister(selectedSchool.id, gender, selectedSchool.campuses[0]?.name);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 星球光晕 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 blur-3xl animate-soul-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400/8 to-blue-600/8 blur-3xl animate-soul-pulse" />
        {/* 星星 */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              opacity: 0.2 + Math.random() * 0.5,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      {/* 内容区 */}
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
            <p className="text-center text-white/50 text-sm mb-8">选择你的性别，开始认识附近的人</p>
            <div className="flex gap-4">
              <button
                onClick={() => { setGender('male'); setStep('school'); }}
                className="flex-1 py-10 glass-card hover:border-pink-400/30 transition-all duration-500 group"
              >
                <div className="soul-avatar w-16 h-16 mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #45d9d9, #3b82f6)' }}>
                  ♂
                </div>
                <div className="text-white/80 font-medium">男生</div>
              </button>
              <button
                onClick={() => { setGender('female'); setStep('school'); }}
                className="flex-1 py-10 glass-card hover:border-pink-400/30 transition-all duration-500 group"
              >
                <div className="soul-avatar w-16 h-16 mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #ff6b9d, #a78bfa)' }}>
                  ♀
                </div>
                <div className="text-white/80 font-medium">女生</div>
              </button>
            </div>
          </div>
        )}

        {/* 步骤2：学校 */}
        {step === 'school' && (
          <div className="w-full max-w-xs animate-soul-slide-up">
            <p className="text-center text-white/50 text-sm mb-2">选择你的学校</p>
            <p className="text-center text-white/20 text-xs mb-6">仅限本科学历及以上 · 你的校友在等你</p>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索学校名称..."
                className="soul-input"
                autoFocus
              />
            </div>

            {schools.length === 0 && !searchQuery && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {['清华大学', '北京大学', '浙江大学', '复旦大学', '武汉大学', '中山大学', '南京大学', '上交'].map(name => (
                  <button key={name} onClick={() => setSearchQuery(name)}
                    className="text-left px-3 py-2.5 glass-card text-sm text-white/50 hover:text-white/80 hover:border-white/20 transition-all">
                    {name}
                  </button>
                ))}
              </div>
            )}

            {schools.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {schools.map(school => (
                  <button key={school.id} onClick={() => {
                    setSelectedSchool(school); setStep('email'); setEmail(''); setCode(''); setCodeSent(false); setError('');
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

        {/* 步骤3：邮箱验证 */}
        {step === 'email' && selectedSchool && (
          <div className="w-full max-w-xs animate-soul-slide-up">
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-white/80">{selectedSchool.name}</div>
              <div className="text-sm text-white/30">验证学生身份</div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-white/30 mb-2">学校邮箱（.edu.cn）</label>
              <div className="flex items-center glass-card overflow-hidden focus-within:border-pink-400/30 transition-colors">
                <input
                  type="text" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="学号"
                  className="flex-1 px-4 py-3 bg-transparent text-white/80 placeholder-white/15 focus:outline-none text-sm"
                />
                <span className="text-white/20 pr-3 text-xs">@{selectedSchool.eduDomain}</span>
              </div>
            </div>

            {!codeSent ? (
              <button onClick={sendCode} disabled={loading || !email}
                className="soul-btn w-full disabled:opacity-40">
                {loading ? '发送中...' : '发送验证码'}
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text" value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="输入6位验证码" maxLength={6}
                  className="soul-input text-center text-xl tracking-[0.3em]"
                  autoFocus
                />

                {/* 开发模式：显示验证码 */}
                {devCode && (
                  <div className="text-center py-2 px-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                    <p className="text-xs text-pink-400/60 mb-1">🔧 开发模式</p>
                    <p className="text-lg font-bold text-pink-400 tracking-widest">{devCode}</p>
                  </div>
                )}

                <button onClick={verifyAndRegister} disabled={loading || code.length !== 6}
                  className="soul-btn w-full disabled:opacity-40">
                  {loading ? '验证中...' : '完成验证'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">{error}</div>
            )}

            <button onClick={skipEmailVerify}
              className="w-full mt-3 py-2 text-white/15 text-xs hover:text-white/30 transition-colors">
              [开发模式] 跳过邮箱验证
            </button>

            <button onClick={() => setStep('school')}
              className="w-full mt-2 text-sm text-white/20 hover:text-white/40 transition-colors">
              ← 重新选择学校
            </button>
          </div>
        )}

        {/* 完成 */}
        {step === 'ready' && (
          <div className="text-center animate-soul-slide-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-4xl animate-soul-glow">✨</div>
            <p className="text-white/60 text-lg">认证完成</p>
            <p className="text-white/20 text-sm mt-2">正在进入校园面基...</p>
          </div>
        )}
      </div>

      {/* 底部署名 */}
      <div className="pb-8 text-center relative z-10">
        <p className="text-xs text-white/10">本科学历及以上 · 数据安全有保障</p>
      </div>
    </div>
  );
}
