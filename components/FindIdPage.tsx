import React, { useState } from 'react';
import { User, Mail, ArrowLeft, Star, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants';

export const FindIdPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/find-id`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: name, email: email }),
            });

            const result = await response.text();
            console.log("서버 응답:", result); // 여기서 실제 어떤 값이 오는지 확인해보세요!

            if (response.ok && result !== "not_found" && result !== "") {
                // result에 "serkee" 같은 아이디가 들어있으므로 성공 처리
                alert(`찾으시는 아이디는 [ ${result} ] 입니다.`);
                navigate('/login');
            } else {
                // 404 에러거나 결과가 "not_found"인 경우
                alert('정보가 일치하지 않습니다.');
            }
        } catch (error) {
            alert('서버 연결 오류가 발생했습니다.');
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
                    <h1 className="text-2xl font-bold text-kb-navy">아이디 찾기</h1>
                    <p className="text-kb-gray mt-2">등록된 정보로 아이디를 찾습니다</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-kb-navy mb-1">이름</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kb-yellow focus:border-transparent transition-all"
                                    placeholder="이름을 입력하세요"
                                />
                            </div>
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
                                    placeholder="등록된 이메일을 입력하세요"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-kb-yellow hover:bg-[#e6a900]'} text-kb-navy font-bold py-3.5 rounded-lg shadow-md transition-colors duration-200 text-lg`}
                        >
                            {isLoading ? '확인 중...' : '아이디 찾기'}
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
