import { useState, useEffect, useCallback } from 'react';
import type { University } from '../types';

interface Props {
  onRegister: (universityId: number, gender: 'male' | 'female', campusName?: string) => void;
}

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

type VerifyMethod = 'email' | 'studentId';

export default function AuthPage({ onRegister }: Props) {
  const [step, setStep] = useState<'gender' | 'school' | 'verify' | 'studentId'>('gender');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<University[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<University | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod>('email');

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

  // 邮箱验证流程
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
        if (data.devCode) setDevCode(data.devCode);
      } else {
        setError(data.message);
      }
    } catch {
      setError('网络错误');
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
      } else {
        setError(data.message);
      }
    } catch {
      setError('网络错误');
    }
    setLoading(false);
  };

  // 学生证兜底
  const handleStudentIdVerify = () => {
    if (!selectedSchool || !gender) return;
    // 跳过上传步骤，直接用学生证模式注册
    onRegister(selectedSchool.id, gender, selectedSchool.campuses[0]?.name);
  };

  const skipEmailVerify = () => {
    if (!selectedSchool || !gender) return;
    onRegister(selectedSchool.id, gender, selectedSchool.campuses[0]?.name);
  };

  // 学校邮箱入口识别
  const getEmailPortalHint = (domain: string): { label: string; url: string } | null => {
    // 常见高校邮箱系统
    if (['mails.tsinghua.edu.cn', 'pku.edu.cn', 'fudan.edu.cn', 'sjtu.edu.cn', 'zju.edu.cn',
      'whu.edu.cn', 'hust.edu.cn', 'nju.edu.cn', 'scu.edu.cn', 'xjtu.edu.cn',
      'mail.sysu.edu.cn'].includes(domain)) {
      return { label: '打开学校邮箱', url: `https://mail.${domain}` };
    }
    // 腾讯企业邮
    if (['scut.edu.cn', 'gdut.edu.cn', 'szu.edu.cn', 'gzhu.edu.cn'].includes(domain)) {
      return { label: '打开腾讯企业邮', url: 'https://exmail.qq.com/login' };
    }
    // 默认：尝试mail子域名
    return { label: '打开学校邮箱', url: `https://mail.${domain}` };
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
            <p className="text-center text-white/20 text-xs mb-6">仅限本科学历及以上</p>

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
                  <button key={school.id} onClick={() => { setSelectedSchool(school); setStep('verify'); setEmail(''); setCode(''); setCodeSent(false); setError(''); setVerifyMethod('email'); }}
                    className="w-full text-left px-4 py-3 glass-card hover:border-pink-400/30 transition-all">
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

        {/* 步骤3：验证方式选择 */}
        {step === 'verify' && selectedSchool && (
          <div className="w-full max-w-xs animate-soul-slide-up">
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-white/80">{selectedSchool.name}</div>
              <div className="text-sm text-white/30">验证你的学生身份</div>
            </div>

            {/* 方式1：邮箱验证 */}
            {verifyMethod === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/30 mb-2">学校邮箱（.edu.cn）</label>
                  <div className="flex items-center glass-card overflow-hidden focus-within:border-pink-400/30 transition-colors">
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="学号或姓名拼音" autoFocus
                      className="flex-1 px-4 py-3 bg-transparent text-white/80 placeholder-white/15 focus:outline-none text-sm" />
                    <span className="text-white/20 pr-3 text-xs">@{selectedSchool.eduDomain}</span>
                  </div>
                </div>

                {!codeSent ? (
                  <button onClick={sendCode} disabled={loading || !email}
                    className="soul-btn w-full disabled:opacity-40 text-sm">
                    {loading ? '发送中...' : '发送验证码'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="输入6位验证码" maxLength={6}
                      className="soul-input text-center text-xl tracking-[0.3em]" autoFocus />

                    {/* 开发模式验证码显示 */}
                    {devCode && (
                      <div className="text-center py-2 px-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                        <p className="text-xs text-pink-400/60 mb-1">🔧 开发模式</p>
                        <p className="text-lg font-bold text-pink-400 tracking-widest">{devCode}</p>
                      </div>
                    )}

                    <button onClick={verifyAndRegister} disabled={loading || code.length !== 6}
                      className="soul-btn w-full disabled:opacity-40 text-sm">
                      {loading ? '验证中...' : '完成验证'}
                    </button>
                  </div>
                )}

                {/* 邮箱入口引导 */}
                {codeSent && (
                  <div className="glass-card p-3 text-center">
                    <p className="text-white/40 text-xs mb-2">📧 验证码已发送，去邮箱查收</p>
                    {(() => {
                      const hint = getEmailPortalHint(selectedSchool.eduDomain);
                      return hint ? (
                        <a href={hint.url} target="_blank" rel="noreferrer"
                          className="inline-block px-4 py-1.5 bg-white/5 rounded-full text-cyan-400 text-xs hover:bg-white/10 transition-colors">
                          {hint.label} →
                        </a>
                      ) : (
                        <p className="text-white/20 text-xs">请登录学校邮箱查看验证码</p>
                      );
                    })()}
                    <p className="text-white/15 text-[10px] mt-2">没收到？检查垃圾邮件或重新发送</p>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">{error}</div>
                )}

                {/* 切换为学生证 */}
                <div className="text-center pt-2">
                  <button onClick={() => { setVerifyMethod('studentId'); setError(''); }}
                    className="text-white/20 text-xs hover:text-white/40 transition-colors">
                    找不到学校邮箱？用学生证认证 →
                  </button>
                </div>
              </div>
            )}

            {/* 方式2：学生证认证 */}
            {verifyMethod === 'studentId' && (
              <div className="space-y-4 animate-soul-fade-in">
                <div className="glass-card-strong p-4 text-center border-cyan-500/20">
                  <p className="text-4xl mb-3">📸</p>
                  <p className="text-white/60 text-sm mb-2">学生证拍照认证</p>
                  <p className="text-white/25 text-xs leading-relaxed mb-4">
                    拍摄学生证正面（含学校名称、姓名、照片）<br />
                    审核通过后即可使用全部功能
                  </p>

                  {/* 拍照按钮（模拟） */}
                  <div className="glass-card p-6 mb-4 border-dashed border-white/10 cursor-pointer hover:border-cyan-400/30 transition-all">
                    <p className="text-3xl mb-2">📷</p>
                    <p className="text-white/30 text-xs">点击拍照或选择照片</p>
                  </div>

                  <button onClick={handleStudentIdVerify}
                    className="soul-btn w-full text-sm">
                    提交认证（MVP跳过审核）
                  </button>

                  <p className="text-white/15 text-[10px] mt-3">
                    你的学生证仅用于身份验证，不会被保存或公开
                  </p>
                </div>

                <div className="text-center">
                  <button onClick={() => { setVerifyMethod('email'); setError(''); }}
                    className="text-white/20 text-xs hover:text-white/40 transition-colors">
                    ← 改用邮箱验证
                  </button>
                </div>
              </div>
            )}

            {/* 开发模式跳过 */}
            <button onClick={skipEmailVerify}
              className="w-full mt-4 py-2 text-white/10 text-xs hover:text-white/20 transition-colors">
              [开发模式] 跳过验证
            </button>

            <button onClick={() => setStep('school')}
              className="w-full mt-2 text-sm text-white/20 hover:text-white/40 transition-colors">
              ← 重新选择学校
            </button>
          </div>
        )}
      </div>

      <div className="pb-8 text-center relative z-10">
        <p className="text-xs text-white/10">仅限本科学历 · 学生身份安全可靠</p>
      </div>
    </div>
  );
}
