import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import AuthPage from './pages/AuthPage';
import MatchPage from './pages/MatchPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import BaZiFortunePage from './pages/BaZiFortunePage';
import type { PageName, UserInfo } from './types';

export default function App() {
  const socket = useSocket();
  const [page, setPage] = useState<PageName>('auth');
  const [prevPage, setPrevPage] = useState<PageName>('match');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const user = JSON.parse(saved) as UserInfo;
        socket.setUser(user);
        setPage('match');
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => { if (socket.user) setPage('match'); }, [socket.user]);
  useEffect(() => { if (socket.matchResult) setPage('chat'); }, [socket.matchResult]);

  const handleRegister = useCallback((universityId: number, gender: 'male' | 'female', campusName?: string) => {
    socket.register(universityId, gender, campusName);
  }, [socket.register]);

  const handleBackToMatch = useCallback(() => { socket.setMatchResult(null); setPage('match'); }, [socket]);

  const handleGoBaziFortune = useCallback(() => { setPage('baziFortune'); }, []);
  const handleBackFromBazi = useCallback(() => setPage('profile'), []);

  const showNav = page === 'match' || page === 'profile';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#0a0a1a] shadow-2xl shadow-purple-900/20 relative overflow-hidden border-x border-white/[0.02]">
      {/* 页面 */}
      <div className="min-h-[calc(100vh-4rem)]">
        {page === 'auth' && <AuthPage onRegister={handleRegister} />}
        {page === 'match' && <MatchPage socket={socket} onGoProfile={() => setPage('profile')} />}
        {page === 'chat' && socket.matchResult && <ChatPage socket={socket} onBack={handleBackToMatch} />}
        {page === 'profile' && socket.user && (
          <ProfilePage user={socket.user} onBack={() => setPage('match')}
            updateStatus={socket.updateStatus} saveBirth={socket.saveBirth} birthSaved={socket.birthSaved}
            onGoBaziFortune={handleGoBaziFortune} />
        )}

        {page === 'baziFortune' && socket.user && (
          <BaZiFortunePage userId={socket.user.id} onBack={handleBackFromBazi} />
        )}
      </div>

      {/* 底部导航 */}
      {showNav && (
        <nav className="h-16 border-t border-white/[0.04] bg-[#0a0a1a]/95 backdrop-blur-xl flex items-center justify-around px-8">
          <button onClick={() => setPage('match')}
            className={`flex flex-col items-center gap-1 transition-all ${page === 'match' ? 'text-pink-400' : 'text-white/20'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-medium">碰一下</span>
          </button>
          <button onClick={() => setPage('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${page === 'profile' ? 'text-pink-400' : 'text-white/20'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">我的</span>
          </button>
        </nav>
      )}

      {/* 连接指示器 */}
      <div className={`fixed top-3 right-3 w-2 h-2 rounded-full z-50 transition-colors ${socket.connected ? 'bg-pink-400 shadow-lg shadow-pink-400/50' : 'bg-red-400'}`} />
    </div>
  );
}
