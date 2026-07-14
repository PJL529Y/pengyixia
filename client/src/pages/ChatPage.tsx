import { useState, useRef, useEffect } from 'react';
import type { MatchResult, ChatMessage, MeetInvite, MeetSpot, BaZiResult } from '../types';
import type { UserInfo } from '../types';

interface Props {
  socket: {
    user: UserInfo | null;
    matchResult: MatchResult | null;
    messages: ChatMessage[];
    meetInvite: MeetInvite | null;
    chatEnded: boolean;
    chatExtended: boolean;
    sendMessage: (roomId: string, content: string) => void;
    meetInviteSend: (roomId: string, spot: MeetSpot, time: 'now' | '15min' | '30min') => void;
    meetInviteRespond: (roomId: string, action: 'accepted' | 'rejected' | 'changed') => void;
    extendChat: (roomId: string) => void;
    endChat: (roomId: string) => void;
    reportUser: (targetUserId: string) => void;
    baziResult: BaZiResult | null;
    baziLoading: boolean;
    checkBazi: (roomId: string) => void;
    clearBaziResult: () => void;
  };
  onBack: () => void;
}

export default function ChatPage({ socket, onBack }: Props) {
  const {
    user, matchResult, messages, meetInvite, chatEnded, chatExtended,
    sendMessage, meetInviteSend, meetInviteRespond, extendChat, endChat, reportUser,
    baziResult, baziLoading, checkBazi, clearBaziResult,
  } = socket;

  const [input, setInput] = useState('');
  const [showMeetPanel, setShowMeetPanel] = useState(false);
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<MeetSpot | null>(null);
  const [showBaziPanel, setShowBaziPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, baziResult]);
  useEffect(() => { if (chatEnded) { const t = setTimeout(onBack, 5000); return () => clearTimeout(t); } }, [chatEnded, onBack]);
  useEffect(() => { if (baziResult) setShowBaziPanel(true); }, [baziResult]);

  const handleSend = () => {
    if (!input.trim() || !matchResult) return;
    sendMessage(matchResult.roomId, input.trim());
    setInput(''); inputRef.current?.focus();
  };

  const handleCheckBazi = () => {
    if (!matchResult) return;
    clearBaziResult(); setShowBaziPanel(true); checkBazi(matchResult.roomId);
  };

  if (!matchResult) return null;

  const isExpired = chatEnded;
  const canExtend = chatEnded && !chatExtended;

  return (
    <div className="flex flex-col h-[calc(100vh-0rem)] bg-[#0a0a1a]">
      {/* 顶部栏 */}
      <div className="px-4 py-3 flex items-center gap-2 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => { if (matchResult) endChat(matchResult.roomId); onBack(); }}
          className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60">
          ‹
        </button>
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
            {matchResult.partner.nickname.charAt(0)}
          </div>
          <div>
            <div className="text-white/80 text-sm font-medium">{matchResult.partner.nickname}</div>
            <div className="text-white/20 text-xs">{matchResult.partner.universityName} · {matchResult.partner.distance}</div>
          </div>
        </div>
        <button onClick={handleCheckBazi} disabled={baziLoading}
          className="px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs hover:bg-pink-500/20 transition-all flex items-center gap-1 disabled:opacity-50">
          {baziLoading ? <span className="animate-spin">⏳</span> : <span>☯</span>}缘分
        </button>
        <button onClick={() => setShowMeetPanel(!showMeetPanel)}
          className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-all">
          ☕ 见面
        </button>
      </div>

      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        {/* 破冰话题 */}
        <div className="text-center mb-2">
          <div className="inline-block glass-card px-4 py-3">
            <p className="text-pink-400/60 text-xs mb-1">💬 破冰话题</p>
            <p className="text-white/60 text-sm">{matchResult.iceBreaker}</p>
          </div>
        </div>

        {/* 见面邀请卡片 */}
        {meetInvite && <MeetInviteBubble invite={meetInvite} myId={user?.id || ''} roomId={matchResult.roomId} onRespond={meetInviteRespond} />}

        {/* 八字合婚结果 */}
        {showBaziPanel && (
          <div className="text-center animate-soul-slide-up">
            {baziLoading ? (
              <div className="inline-block glass-card px-6 py-4">
                <p className="text-pink-400/80 text-sm flex items-center gap-2"><span className="animate-spin">☯</span>八字合婚推算中...</p>
                <p className="text-white/15 text-xs mt-2">五行阴阳学说是朴素唯物主义和经验主义的结晶</p>
              </div>
            ) : baziResult ? (
              baziResult.success && baziResult.data ? (
                <SoulBaziCard result={baziResult} myId={user?.id || ''} onClose={() => setShowBaziPanel(false)} />
              ) : baziResult.needBirthInfo ? (
                <div className="inline-block glass-card-strong px-5 py-4 max-w-[90%] border-pink-500/20">
                  <p className="text-3xl mb-2">☯</p>
                  <p className="text-white/60 text-sm mb-2">需要双方出生信息</p>
                  <p className="text-white/30 text-xs mb-3">{baziResult.message}</p>
                  {baziResult.missingUserIds?.includes(user?.id || '') && (
                    <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 mb-3">
                      <p className="text-pink-400 text-xs">⚠️ 你还没填写出生时间，去「我的」页面填写</p>
                    </div>
                  )}
                  <button onClick={() => setShowBaziPanel(false)} className="text-white/20 text-xs hover:text-white/40">关闭</button>
                </div>
              ) : (
                <div className="inline-block glass-card px-4 py-3">
                  <p className="text-red-400 text-sm">{baziResult.message}</p>
                  <button onClick={() => setShowBaziPanel(false)} className="mt-2 text-white/20 text-xs">关闭</button>
                </div>
              )
            ) : null}
          </div>
        )}

        {/* 消息列表 */}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'system' ? 'justify-center' : msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'system' ? (
              <div className="text-white/20 text-xs bg-white/3 px-3 py-1.5 rounded-full max-w-[80%] text-center">
                {msg.content}
              </div>
            ) : (
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.senderId === user?.id
                  ? 'bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white rounded-br-md'
                  : 'glass-card text-white/70 rounded-bl-md'
              }`}>
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-white/40' : 'text-white/15'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 见面邀请面板 */}
      {showMeetPanel && (
        <div className="border-t border-white/5 bg-[#0a0a1a]/95 backdrop-blur-xl p-4 animate-soul-slide-up">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60 text-sm font-medium">推荐见面地点</p>
            <button onClick={() => { setShowMeetPanel(false); setShowTimeSelect(false); }} className="text-white/20 hover:text-white/40">✕</button>
          </div>
          {!showTimeSelect ? (
            <div className="space-y-2">
              {matchResult.recommendSpots.map((spot, i) => (
                <button key={i} onClick={() => { setSelectedSpot(spot); setShowTimeSelect(true); }}
                  className="w-full text-left px-4 py-3 glass-card hover:border-cyan-400/30 transition-all flex items-center gap-3">
                  <span className="text-xl">{spot.type === '咖啡' ? '☕' : spot.type === '自习' ? '📚' : spot.type === '食堂' ? '🍜' : '🌳'}</span>
                  <div><p className="text-white/70 text-sm">{spot.name}</p><p className="text-white/20 text-xs">{spot.type}</p></div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-white/30 text-xs mb-2">{selectedSpot?.name}</p>
              {[
                { value: 'now' as const, label: '⚡ 现在', desc: '立刻出发' },
                { value: '15min' as const, label: '⏰ 15分钟后', desc: '给对方一点时间' },
                { value: '30min' as const, label: '🕐 30分钟后', desc: '从容准备' },
              ].map(o => (
                <button key={o.value} onClick={() => { meetInviteSend(matchResult.roomId, selectedSpot!, o.value); setShowTimeSelect(false); setShowMeetPanel(false); }}
                  className="w-full text-left px-4 py-3 glass-card hover:border-cyan-400/30 transition-all">
                  <p className="text-white/70 text-sm">{o.label}</p><p className="text-white/20 text-xs">{o.desc}</p>
                </button>
              ))}
              <button onClick={() => setShowTimeSelect(false)} className="w-full py-2 text-white/15 text-xs">← 重新选地点</button>
            </div>
          )}
        </div>
      )}

      {/* 聊天结束 */}
      {isExpired && (
        <div className="border-t border-white/5 bg-[#0a0a1a]/95 backdrop-blur-xl p-4 animate-soul-slide-up">
          {canExtend ? (
            <div className="text-center">
              <p className="text-white/40 text-sm mb-3">⏰ 聊天时间到了</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => extendChat(matchResult.roomId)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                  💚 继续聊聊
                </button>
                <button onClick={() => { endChat(matchResult.roomId); onBack(); }}
                  className="px-6 py-2.5 rounded-full glass-card text-white/40 text-sm hover:text-white/60 hover:border-white/20 transition-all">
                  友好告别
                </button>
              </div>
            </div>
          ) : chatExtended ? (
            <div className="text-center"><p className="text-pink-400 text-sm">💚 聊天已延期</p></div>
          ) : (
            <div className="text-center">
              <p className="text-white/40 text-sm mb-2">聊天已结束</p>
              <button onClick={() => { endChat(matchResult.roomId); onBack(); }}
                className="px-4 py-2 glass-card text-white/30 text-sm">立即返回</button>
            </div>
          )}
          <div className="mt-3 text-center">
            <button onClick={() => reportUser(matchResult.partner.id)}
              className="text-red-400/30 text-xs hover:text-red-400/60">⚠️ 举报</button>
          </div>
        </div>
      )}

      {/* 输入框 */}
      {!isExpired && (
        <div className="px-4 py-3 flex items-center gap-3 bg-[#0a0a1a]/95 backdrop-blur-xl border-t border-white/5">
          <input ref={inputRef} type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="输入消息..." className="soul-input text-sm" />
          <button onClick={handleSend} disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-pink-500/20 flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ---- 见面邀请气泡 ----
function MeetInviteBubble({ invite, myId, roomId, onRespond }: {
  invite: MeetInvite; myId: string; roomId: string;
  onRespond: (roomId: string, action: 'accepted' | 'rejected' | 'changed') => void;
}) {
  const colorMap = { accepted: 'border-cyan-500/30 bg-cyan-500/5', rejected: 'border-red-500/20 bg-red-500/5', changed: 'border-yellow-500/20 bg-yellow-500/5', pending: 'border-pink-500/30 bg-pink-500/5' };
  return (
    <div className="text-center">
      <div className={`inline-block glass-card-strong px-4 py-3 max-w-[90%] ${colorMap[invite.status]}`}>
        <p className="text-sm font-medium text-white/70">
          {invite.status === 'pending' && '☕ 收到见面邀请'}
          {invite.status === 'accepted' && '✅ 见面邀请已接受！'}
          {invite.status === 'rejected' && '❌ 被拒绝'}
          {invite.status === 'changed' && '💬 见面地点待定'}
        </p>
        <p className="text-white/30 text-xs mt-1">{invite.spot.name} · {invite.time === 'now' ? '现在' : invite.time === '15min' ? '15分钟后' : '30分钟后'}</p>
        {invite.status === 'pending' && invite.from !== myId && (
          <div className="flex gap-2 mt-2 justify-center">
            <button onClick={() => onRespond(roomId, 'accepted')} className="px-4 py-1.5 rounded-full bg-cyan-500/80 text-white text-xs">接受</button>
            <button onClick={() => onRespond(roomId, 'changed')} className="px-4 py-1.5 rounded-full bg-yellow-500/80 text-white text-xs">换地点</button>
            <button onClick={() => onRespond(roomId, 'rejected')} className="px-4 py-1.5 rounded-full glass-card text-white/40 text-xs">拒绝</button>
          </div>
        )}
        {invite.status === 'accepted' && <p className="text-cyan-400/80 text-xs mt-2">🔒 请在公共场合见面，注意安全！</p>}
      </div>
    </div>
  );
}

// ---- Soul 八字合婚卡片 ----
function SoulBaziCard({ result, myId, onClose }: { result: BaZiResult; myId: string; onClose: () => void }) {
  if (!result.data) return null;
  const { user1, user2, compatibility } = result.data;
  const myChart = user1.id === myId ? user1.chart : user2.chart;
  const partnerChart = user1.id === myId ? user2.chart : user1.chart;

  const scoreColor = (s: number) => s >= 85 ? 'text-pink-400' : s >= 70 ? 'text-cyan-400' : s >= 55 ? 'text-purple-400' : s >= 40 ? 'text-yellow-400' : 'text-white/30';

  return (
    <div className="inline-block glass-card-strong border-pink-500/20 max-w-[95%] text-left overflow-hidden">
      {/* 分数头部 */}
      <div className="bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 px-5 py-5 text-center">
        <div className="flex justify-between items-start mb-2">
          <span className="text-white/30 text-xs">☯ 缘分参考</span>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 text-sm">✕</button>
        </div>
        <p className="text-6xl font-bold text-white mb-1">{compatibility.overallScore}</p>
        <p className="text-white/50 text-xs">综合适配分</p>
        <p className="text-white/70 text-sm mt-3 font-medium">{compatibility.relationshipType}</p>
      </div>

      {/* 八字排盘 */}
      <div className="px-5 py-4 border-b border-white/5">
        <p className="text-white/30 text-xs mb-3">📋 八字排盘</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="glass-card p-3">
            <p className="text-white/30 mb-2">{user1.nickname}</p>
            {(['year','month','day','hour'] as const).map(k => (
              <div key={k} className="flex justify-between py-0.5">
                <span className="text-white/20">{k === 'year' ? '年' : k === 'month' ? '月' : k === 'day' ? '日' : '时'}</span>
                <span className="text-white/60">{myChart[k].fullName}</span>
                <span className="text-white/15">{myChart[k].nayin}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
              <span className="text-white/20">日主</span>
              <span className="text-pink-400 font-bold">{myChart.dayMaster}（{myChart.dayMasterElement}命）</span>
            </div>
          </div>
          <div className="glass-card p-3">
            <p className="text-white/30 mb-2">{user2.nickname}</p>
            {(['year','month','day','hour'] as const).map(k => (
              <div key={k} className="flex justify-between py-0.5">
                <span className="text-white/20">{k === 'year' ? '年' : k === 'month' ? '月' : k === 'day' ? '日' : '时'}</span>
                <span className="text-white/60">{partnerChart[k].fullName}</span>
                <span className="text-white/15">{partnerChart[k].nayin}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
              <span className="text-white/20">日主</span>
              <span className="text-cyan-400 font-bold">{partnerChart.dayMaster}（{partnerChart.dayMasterElement}命）</span>
            </div>
          </div>
        </div>
      </div>

      {/* 合婚详解 */}
      <div className="px-5 py-4 space-y-3 border-b border-white/5">
        <p className="text-white/30 text-xs">🔍 合婚详解</p>
        {[
          ['日主分析', compatibility.analysis.dayMaster],
          ['天干关系', compatibility.analysis.stems],
          ['地支关系', compatibility.analysis.branches],
          ['五行互补', compatibility.analysis.elements],
        ].map(([title, content]) => (
          <div key={title}>
            <p className="text-white/20 text-xs mb-1">{title}</p>
            <p className="text-white/50 text-xs leading-relaxed">{content}</p>
          </div>
        ))}
        <div className="glass-card p-3">
          <p className="text-white/50 text-xs leading-relaxed">{compatibility.analysis.overall}</p>
        </div>
      </div>

      {/* 警告和建议 */}
      {compatibility.warnings.length > 0 && (
        <div className="px-5 py-3 bg-yellow-500/5 border-b border-yellow-500/10">
          <p className="text-yellow-400/80 text-xs mb-2">⚠️ 注意事项</p>
          {compatibility.warnings.map((w, i) => <p key={i} className="text-yellow-400/50 text-xs mb-1">• {w}</p>)}
        </div>
      )}
      <div className="px-5 py-3 bg-cyan-500/5 border-b border-cyan-500/10">
        <p className="text-cyan-400/80 text-xs mb-2">💡 相处建议</p>
        {compatibility.suggestions.map((s, i) => <p key={i} className="text-cyan-400/50 text-xs mb-1">• {s}</p>)}
      </div>

      {/* 底部声明 */}
      <div className="px-5 py-3 text-center">
        <p className="text-white/10 text-xs">五行阴阳学说是朴素唯物主义和经验主义的结晶，仅供参考。真正的关系建立在真诚的沟通和相互理解之上。</p>
      </div>
    </div>
  );
}
