import React, { useState } from 'react';
import { User, Lock, Mail, Star, ArrowLeft, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !password || !confirmPassword || !email) {
            alert('모든 정보를 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    password: password,
                    email: email,
                    userName: name
                }),
            });

            const result = await response.text();
            if (result === "success") {
                alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
                navigate('/login'); // 로그인 페이지로 이동
            } else if (result === "duplicate") {
                alert('이미 사용 중인 아이디입니다.');
            } else {
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert('서버 연결에 실패했습니다. 백엔드 상태를 확인하세요.');
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
                    <h1 className="text-2xl font-bold text-kb-navy">회원가입</h1>
                    <p className="text-kb-gray mt-2">Smart Star AI의 새로운 가족이 되어주세요</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
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
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-kb-navy mb-1">이름</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <IdCard size={18} />
                                </span>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kb-yellow focus:border-transparent transition-all"
                                    placeholder="이름을 입력하세요"
                                    autoComplete="off"
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
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-kb-navy mb-1">비밀번호 확인</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-3 border hover:border-kb-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-kb-yellow focus:border-transparent transition-all ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                                        }`}
                                    placeholder="비밀번호를 다시 입력하세요"
                                    autoComplete="new-password"
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-500 text-xs mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-kb-navy mb-1">이메일</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kb-yellow focus:border-transparent transition-all"
                                    placeholder="이메일을 입력하세요"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full mt-2 ${isLoading ? 'bg-gray-400' : 'bg-kb-yellow hover:bg-[#e6a900]'} text-kb-navy font-bold py-3.5 rounded-lg shadow-md transition-colors duration-200 text-lg`}
                        >
                            {isLoading ? '가입 처리 중...' : '회원가입'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-kb-gray">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full flex items-center justify-center gap-2 text-kb-gray hover:text-kb-navy transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span>로그인으로 돌아가기</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
