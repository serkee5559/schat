import React, { useState } from 'react';
import { Lock, User, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      if (!response.ok) {
        throw new Error('서버 연결 실패');
      }

      // 서버에서 "강석희" 또는 "fail" 문자열이 옵니다.
      const result = await response.text();

      if (result !== "fail" && result !== "error") {
        // ✅ [중요] localStorage에 이름과 아이디를 모두 저장합니다.
        localStorage.setItem('userName', result);
        localStorage.setItem('userId', userId); // 유저가 입력한 'serkee' 저장

        onLogin(result);
        alert(`${result}님, 환영합니다!`);
        navigate('/');
      } else {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true); // 로딩 표시 시작

    const guestId = 'guest'; // DB에 저장된 게스트용 아이디
    const guestPw = '1234';  // DB에 저장된 게스트용 비밀번호

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: guestId, password: guestPw }),
      });

      if (!response.ok) {
        throw new Error('서버 연결 실패');
      }

      const result = await response.text();

      if (result !== "fail" && result !== "error") {
        // ✅ 게스트 정보도 똑같이 localStorage에 저장합니다.
        localStorage.setItem('userName', result); // 서버에서 '방문자' 등의 이름을 리턴함
        localStorage.setItem('userId', guestId);

        onLogin(result);
        alert(`${result}님, 환영합니다!`);
        navigate('/');
      } else {
        alert('게스트 계정 정보가 일치하지 않습니다. 관리자에게 문의하세요.');
      }
    } catch (error) {
      console.error("Guest Login Error:", error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kb-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-kb-yellow rounded-full mb-4 shadow-sm">
            <Star size={32} className="text-kb-navy fill-kb-navy" />
          </div>
          <h1 className="text-2xl font-bold text-kb-navy">Smart Star AI v0.1</h1>
          <p className="text-kb-gray mt-2">당신을 위한 지능형 금융 파트너</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-kb-navy mb-1">사용자 아이디</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kb-yellow focus:border-transparent transition-all"
                  placeholder="아이디를 입력하세요"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-kb-navy mb-1">비밀번호</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kb-yellow focus:border-transparent transition-all"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-kb-yellow hover:bg-[#e6a900]'} text-kb-navy font-bold py-3.5 rounded-lg shadow-md transition-colors duration-200 text-lg`}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-semibold py-3.5 rounded-lg shadow-sm transition-colors duration-200 text-lg"
              >
                Guest로 로그인하기
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center text-sm text-kb-gray gap-8">
            <button type="button" onClick={() => navigate('/find-id')} className="hover:text-kb-navy transition-colors">
              아이디 찾기
            </button>
            <button type="button" onClick={() => navigate('/signup')} className="hover:text-kb-navy transition-colors">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};