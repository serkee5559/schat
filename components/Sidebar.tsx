
import React from 'react';
import { MessageSquare, Plus, Clock, LogOut, X, Star, Trash2 } from 'lucide-react';
import { ChatHistory } from '../types';

interface SidebarProps {
  history: ChatHistory[];
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName: string;
  onNewChat: () => void;
  onSelectHistory: (history: ChatHistory) => void;
  onDeleteHistory: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  history,
  isOpen,
  onClose,
  onLogout,
  userName,
  onNewChat,
  onSelectHistory,
  onDeleteHistory
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 bg-kb-navy text-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-kb-yellow rounded-lg flex items-center justify-center">
                <Star size={18} className="text-kb-navy fill-kb-navy" />
              </div>
              <span className="font-bold tracking-tight text-lg">Smart Star AI</span>
            </div>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Action Button */}
          <div className="p-4">
            <button
              onClick={() => {
                onNewChat(); // 새로운 채팅 상태로 초기화
                onClose();   // 사이드바 닫기 (특히 모바일에서 중요)
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors border border-slate-700">
              <Plus size={18} />
              새로운 상담 시작
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            <div className="px-4 py-2 mt-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} />
                최근 상담 기록
              </p>
            </div>
            {history.map((item) => (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => onSelectHistory(item)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-800 transition-colors text-left pr-10"
                >
                  <MessageSquare size={18} className="mt-1 text-slate-500 group-hover:text-kb-yellow" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-kb-yellow transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.lastMessage}</p>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('이 채팅 내역을 삭제하시겠습니까?')) {
                      onDeleteHistory(item.id);
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-400/10"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <span className="text-sm font-bold">{userName.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{userName} 회원님</p>
                <p className="text-[10px] text-slate-400 truncate">Premium Member</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
