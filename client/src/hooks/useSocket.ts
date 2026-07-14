import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { UserInfo, MatchResult, ChatMessage, MeetInvite, BaZiResult } from '../types';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  // 匹配相关
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchStatus, setMatchStatus] = useState<any>(null);
  const [matchError, setMatchError] = useState<string | null>(null);

  // 聊天相关
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [meetInvite, setMeetInvite] = useState<MeetInvite | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [chatExtended, setChatExtended] = useState(false);

  // 八字合婚相关
  const [baziResult, setBaziResult] = useState<BaZiResult | null>(null);
  const [baziLoading, setBaziLoading] = useState(false);
  const [birthSaved, setBirthSaved] = useState(false);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 已连接到服务器');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 与服务器断开连接');
      setConnected(false);
    });

    // ---- 注册回调 ----
    socket.on('registered', (data: { success: boolean; user?: UserInfo; message?: string }) => {
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    });

    // ---- 匹配回调 ----
    socket.on('match_started', (status) => {
      setIsMatching(true);
      setMatchStatus(status);
      setMatchError(null);
    });

    socket.on('match_status', (status) => {
      setMatchStatus(status);
    });

    socket.on('match_success', (result: MatchResult) => {
      setIsMatching(false);
      setMatchResult(result);
      setChatEnded(false);
      setChatExtended(false);
      setMeetInvite(null);
      setMessages([]);
    });

    socket.on('match_stopped', () => {
      setIsMatching(false);
      setMatchStatus(null);
    });

    socket.on('match_error', (data: { message: string }) => {
      setMatchError(data.message);
      setIsMatching(false);
    });

    // ---- 消息回调 ----
    socket.on('new_message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    // ---- 见面邀请回调 ----
    socket.on('meet_invite_update', (invite: MeetInvite) => {
      setMeetInvite(invite);
    });

    // ---- 聊天结束回调 ----
    socket.on('chat_ended', () => {
      setChatEnded(true);
    });

    socket.on('chat_expired', () => {
      setChatEnded(true);
    });

    socket.on('chat_extended', (data: { expiresAt: number }) => {
      setChatExtended(true);
    });

    socket.on('partner_disconnected', () => {
      setChatEnded(true);
    });

    // ---- 八字合婚回调 ----
    socket.on('bazi_result', (result: BaZiResult) => {
      setBaziLoading(false);
      setBaziResult(result);
    });

    socket.on('birth_saved', (data: { success: boolean; message: string }) => {
      setBirthSaved(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ---- 操作方法 ----

  const register = useCallback((universityId: number, gender: 'male' | 'female', campusName?: string) => {
    socketRef.current?.emit('register', { universityId, gender, campusName });
  }, []);

  const startMatch = useCallback((preferNearby = true) => {
    setMatchResult(null);
    setChatEnded(false);
    socketRef.current?.emit('start_match', { preferNearby });
  }, []);

  const stopMatch = useCallback(() => {
    socketRef.current?.emit('stop_match');
  }, []);

  const sendMessage = useCallback((roomId: string, content: string) => {
    socketRef.current?.emit('send_message', { roomId, content });
  }, []);

  const meetInviteSend = useCallback((roomId: string, spot: any, time: 'now' | '15min' | '30min') => {
    socketRef.current?.emit('meet_invite', { roomId, spot, time });
  }, []);

  const meetInviteRespond = useCallback((roomId: string, action: 'accepted' | 'rejected' | 'changed') => {
    socketRef.current?.emit('meet_respond', { roomId, action });
  }, []);

  const extendChat = useCallback((roomId: string) => {
    socketRef.current?.emit('extend_chat', { roomId });
  }, []);

  const endChat = useCallback((roomId: string) => {
    socketRef.current?.emit('end_chat', { roomId });
    setMatchResult(null);
    setMessages([]);
    setMeetInvite(null);
    setChatEnded(false);
  }, []);

  const updateStatus = useCallback((status: 'available' | 'busy' | 'studying' | 'invisible') => {
    socketRef.current?.emit('update_status', { status });
    setUser(prev => prev ? { ...prev, status } : null);
  }, []);

  const reportUser = useCallback((targetUserId: string) => {
    socketRef.current?.emit('report_user', { targetUserId });
  }, []);

  // 八字合婚
  const checkBazi = useCallback((roomId: string) => {
    setBaziLoading(true);
    setBaziResult(null);
    socketRef.current?.emit('bazi_check', { roomId });
  }, []);

  const saveBirth = useCallback((year: number, month: number, day: number, hour: number) => {
    socketRef.current?.emit('save_birth', { year, month, day, hour });
  }, []);

  const clearBaziResult = useCallback(() => {
    setBaziResult(null);
  }, []);

  return {
    socket: socketRef.current,
    connected,
    user,
    setUser,
    register,
    // 匹配
    startMatch,
    stopMatch,
    isMatching,
    matchStatus,
    matchResult,
    matchError,
    setMatchResult,
    // 聊天
    messages,
    meetInvite,
    chatEnded,
    chatExtended,
    sendMessage,
    meetInviteSend,
    meetInviteRespond,
    extendChat,
    endChat,
    // 其他
    updateStatus,
    reportUser,
    // 八字
    baziResult,
    baziLoading,
    birthSaved,
    checkBazi,
    saveBirth,
    clearBaziResult,
  };
}
