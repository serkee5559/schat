import React, { useState, useCallback, useEffect } from 'react';
import { Menu, Star } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { Message, ChatHistory } from '../types';
import { generateAIResponse } from '../services/geminiService';
import { API_BASE_URL } from '../constants';

interface MainPageProps {
    onLogout: () => void;
    userName: string;
}

export const MainPage: React.FC<MainPageProps> = ({ onLogout, userName }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // ✅ 로그인한 사용자의 정보를 실시간으로 참조합니다.
    const storedUserId = localStorage.getItem('userId') || 'guest';
    const storedName = localStorage.getItem('userName') || userName || '회원';

    // 1. [DB 로드] 해당 유저의 히스토리 가져오기
    const fetchHistory = useCallback(async () => {
        // userId가 guest가 아닌 실제 ID(serkee 등)인지 확인하기 위해 로그를 찍어볼 수 있습니다.
        console.log("현재 채팅을 불러오는 유저 ID:", storedUserId);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/history/${storedUserId}`);
            if (response.ok) {
                const data = await response.json();
                setChatHistory(data);
            }
        } catch (error) {
            console.error("히스토리 목록 로드 실패:", error);
        }
    }, [storedUserId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // 2. [대화 로드] 히스토리 클릭 시
    const handleSelectHistory = async (history: ChatHistory) => {
        try {
            setIsSidebarOpen(false);
            setCurrentSessionId(history.id);
            setIsLoading(true);

            console.log(`불러오는 세션 ID: ${history.id}`);
            const response = await fetch(`${API_BASE_URL}/api/chat/messages/${history.id}`);

            if (response.ok) {
                const data = await response.json();
                console.log("받은 메시지 데이터:", data);

                // 서버 데이터의 필드명 불일치(대소문자, 언더바 등)를 대비한 로직
                const formattedMessages = data.map((msg: any) => ({
                    id: msg.id || Math.random().toString(),
                    role: msg.role?.toLowerCase() === 'user' ? 'user' : 'assistant',
                    content: msg.content || '',
                    timestamp: new Date(msg.createdAt || msg.created_at || Date.now()),
                    // AI 응답일 경우 suggestions 파싱 시도 (선택 사항)
                    suggestions: msg.role?.toLowerCase() === 'assistant' ? parseSuggestions(msg.content) : undefined
                }));

                setMessages(formattedMessages);
            } else {
                console.error("서버 데이터 로드 실패:", response.status);
            }
        } catch (error) {
            console.error("대화 내용 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 간단한 suggestions 파싱 함수 추가
    const parseSuggestions = (content: string) => {
        const menuPattern = /(\d+\.\s+[^.\n\d]+)/g;
        const matches = content.match(menuPattern);
        return matches ? matches.map(m => m.replace(/^\d+\.\s+/, '').trim()) : undefined;
    };

    // 3. [초기화] 새로운 상담 시작
    const handleNewChat = () => {
        setMessages([]);
        setCurrentSessionId(null);
        setIsSidebarOpen(false);
    };

    // 4. [메시지 전송 및 DB 저장]
    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            let rawResponse = await generateAIResponse(text, messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: m.content
            })));

            let suggestions: string[] = [];
            const menuPattern = /(\d+\.\s+[^.\n\d]+)/g;
            const matches = rawResponse.match(menuPattern);
            if (matches) {
                suggestions = matches.map(m => m.replace(/^\d+\.\s+/, '').trim());
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: rawResponse,
                suggestions: suggestions.length > 0 ? suggestions : undefined,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMsg]);

            // --- [DB 저장 시 serkee 계정 반영] ---
            let hId = currentSessionId;

            if (!hId) {
                const histRes = await fetch(`${API_BASE_URL}/api/chat/save`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: storedUserId, // ✅ 'serkee'가 정확히 전달됩니다.
                        title: text.substring(0, 15) + (text.length > 15 ? "..." : ""),
                        lastMessage: rawResponse
                    })
                });
                const savedHist = await histRes.json();
                hId = savedHist.id;
                setCurrentSessionId(hId);
                fetchHistory();
            }

            // 개별 메시지 저장
            await fetch(`${API_BASE_URL}/api/chat/message/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ historyId: hId, role: 'user', content: text })
            });

            await fetch(`${API_BASE_URL}/api/chat/message/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ historyId: hId, role: 'assistant', content: rawResponse })
            });

        } catch (error) {
            console.error("채팅 처리 중 오류:", error);
        } finally {
            setIsLoading(false);
        }
    }, [messages, currentSessionId, storedUserId, fetchHistory]);

    // 5. [삭제] 채팅 히스토리 삭제
    const handleDeleteHistory = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/history/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // 현재 열려있는 채팅방을 삭제한 경우 화면 초기화
                if (currentSessionId === id) {
                    handleNewChat();
                }
                // 목록 새로고침
                fetchHistory();
            } else {
                console.error("삭제 실패:", response.status);
                alert("삭제 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("삭제 요청 오류:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-kb-bg">
            <Sidebar
                history={chatHistory}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={onLogout}
                userName={storedName}
                onNewChat={handleNewChat}
                onSelectHistory={handleSelectHistory}
                onDeleteHistory={handleDeleteHistory}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <div className="md:hidden bg-kb-navy p-3 flex items-center justify-between text-white border-b border-slate-800">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-kb-yellow rounded flex items-center justify-center">
                            <Star size={14} className="text-kb-navy fill-kb-navy" />
                        </div>
                        <span className="text-sm font-bold">Smart Star AI</span>
                    </div>
                    <div className="w-10"></div>
                </div>

                <main className="flex-1 flex flex-col h-full bg-white md:m-4 md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleSendMessage}
                        input={input}
                        setInput={setInput}
                    />
                </main>
            </div>
        </div>
    );
};    