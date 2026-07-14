import { useState } from 'react';
import type { UserInfo } from '../types';

interface Props {
  socket: {
    user: UserInfo | null;
    isMatching: boolean;
    matchStatus: { inQueue: boolean; waitedSeconds: number; availableCount: number; currentLevel: string } | null;
    matchError: string | null;
    startMatch: (preferNearby?: boolean) => void;
    stopMatch: () => void;
    connected: boolean;
  };
  onGoProfile: () => void;
}

export default function MatchPage({ socket, onGoProfile }: Props) {
  const { user, isMatching, matchStatus, matchError, startMatch, stopMatch, connected } = socket;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 blur-3xl animate-soul-glow" />
        {isMatching && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 blur-3xl animate-soul-pulse" />
        )}
        {/* 星星 */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="star" style={{
            left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: 0.15 + Math.random() * 0.3,
          }} />
        ))}
      </div>

      {/* 顶部 */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-xl font-bold text-white/90 tracking-wide">
            {user ? `Hi, ${user.nickname.split('#')[0]}` : '碰一下'}
          </h1>
          <p className="text-sm text-white/25 mt-0.5">{user?.universityName} · {user?.campusName}</p>
        </div>
        <button onClick={onGoProfile}
          className="w-10 h-10 glass-card flex items-center justify-center hover:border-white/20 transition-all">
          <span className="text-white/50 text-lg">👤</span>
        </button>
      </div>

      {/* 匹配区域 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {isMatching ? (
          /* 匹配中 */
          <div className="text-center animate-soul-fade-in">
            {/* 旋转星球 */}
            <div className="relative w-52 h-52 mx-auto mb-10">
              {/* 外圈涟漪 */}
              <div className="absolute inset-0 rounded-full border border-pink-400/20 animate-soul-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-purple-400/15 animate-soul-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
              <div className="absolute inset-8 rounded-full border border-cyan-400/10 animate-soul-spin-slow" style={{ animationDuration: '25s' }} />

              {/* 涟漪动画 */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="absolute inset-0 rounded-full border border-pink-400/10"
                  style={{ animation: `soul-ripple 2s ease-out ${i * 0.6}s infinite` }} />
              ))}

              {/* 中心球体 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 p-[2px] shadow-2xl shadow-purple-500/30">
                  <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center">
                    <span className="text-3xl animate-soul-pulse">🌙</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-white/60 text-base mb-1">正在寻找附近的人...</p>
            <p className="text-white/20 text-sm mb-6">已等待 {matchStatus?.waitedSeconds || 0}s</p>

            <div className="inline-block px-5 py-2 rounded-full glass-card">
              <span className="text-pink-400/80 text-xs">{matchStatus?.currentLevel || '匹配中'}</span>
            </div>

            <div className="mt-10">
              <button onClick={stopMatch}
                className="px-8 py-3 glass-card text-white/40 text-sm hover:text-white/60 hover:border-white/20 transition-all">
                取消
              </button>
            </div>
          </div>
        ) : (
          /* 待匹配 */
          <div className="text-center animate-soul-fade-in">
            {/* 中心按钮星球 */}
            <div className="relative w-56 h-56 mx-auto mb-10">
              {/* 装饰轨道 */}
              <div className="absolute inset-0 rounded-full border border-white/5 animate-soul-spin-slow" />
              <div className="absolute inset-3 rounded-full border border-pink-400/10 animate-soul-spin-slow"
                style={{ animationDirection: 'reverse', animationDuration: '12s' }} />

              {/* 主按钮 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={() => startMatch(true)} disabled={!connected}
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 p-[3px] animate-soul-glow
                    hover:scale-105 active:scale-95 transition-all duration-500
                    disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed
                    shadow-2xl shadow-purple-500/20">
                  <div className="w-full h-full rounded-full bg-[#0a0a1a] flex flex-col items-center justify-center">
                    <span className="text-4xl mb-1">🌙</span>
                    <span className="text-white/80 font-semibold text-sm tracking-wider">碰一下</span>
                    <span className="text-white/20 text-xs mt-0.5">开始匹配</span>
                  </div>
                </button>
              </div>
            </div>

            <p className="text-white/50 text-sm mb-1">离你最近的本科大学生</p>
            <p className="text-white/20 text-xs mb-8">匹配异性 · 位置优先 · 安全奔现</p>

            {matchError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs">{matchError}</div>
            )}

            {!connected && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-400 text-xs">正在连接服务器...</div>
            )}

            {/* 在线人数 */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-soul-pulse" />
              当前 {matchStatus?.availableCount ?? '...'} 位异性在线
            </div>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-6 pb-6 relative z-10">
        <div className="glass-card p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-white/50 text-xs font-medium">小提示</p>
              <p className="text-white/20 text-xs mt-1 leading-relaxed">
                匹配后先聊几句，可以用八字合婚看看缘分配适度，觉得合适就约在公共场合见面。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
