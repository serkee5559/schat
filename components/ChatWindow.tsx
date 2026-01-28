
import React, { useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  input: string;
  setInput: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  input,
  setInput
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-kb-yellow rounded-xl flex items-center justify-center shadow-sm">
            <Bot size={24} className="text-kb-navy" />
          </div>
          <div>
            <h2 className="font-bold text-kb-navy leading-none">Smart Star AI</h2>
            <p className="text-[10px] text-green-500 font-medium mt-1">● 실시간 지원 중</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/50"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Bot size={32} className="text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-kb-navy">안녕하세요! Smart Star AI 입니다.</p>
              <p className="text-sm text-kb-gray">자산 관리부터 일상적인 대화까지 무엇이든 물어보세요.</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-kb-yellow flex items-center justify-center flex-shrink-0 mb-1">
                <Bot size={18} className="text-kb-navy" />
              </div>
            )}

            <div className={`flex flex-col gap-2 max-w-[75%] md:max-w-[60%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed w-full ${msg.role === 'user'
                  ? 'bg-kb-navy text-white rounded-br-none'
                  : 'bg-white border border-gray-200 text-kb-navy rounded-bl-none border-l-4 border-l-kb-yellow'
                }`}>
                {msg.content}
                <div className={`text-[10px] mt-1.5 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Suggestion Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(suggestion)}
                      className="bg-white border border-blue-100 text-kb-navy text-xs px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mb-1">
                <User size={18} className="text-gray-500" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-kb-yellow flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-kb-navy" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-kb-yellow" />
              <span className="text-xs text-kb-gray italic">분석 중...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Input */}
      <div className="p-4 md:p-6 bg-white border-t border-gray-100">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-center gap-3 bg-kb-bg rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-kb-yellow focus-within:ring-1 focus-within:ring-kb-yellow transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금하신 내용을 입력해 주세요..."
            className="flex-1 bg-transparent py-2.5 focus:outline-none text-kb-navy placeholder-gray-400 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-xl transition-all ${input.trim() && !isLoading
                ? 'bg-kb-yellow text-kb-navy shadow-md hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-center text-kb-gray mt-3">
          본 서비스는 인공지능에 의해 제공되며, 복잡한 금융 거래 상담은 전문 상담원을 통해 재확인하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};
