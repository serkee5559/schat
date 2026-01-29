// src/constants.ts

// 1. Vercel 환경 변수에서 주소를 읽어옵니다.
const VITE_API_URL = import.meta.env.VITE_API_URL;

// 2. 다른 파일에서 쓸 수 있도록 'API_BASE_URL'이라는 이름으로 내보냅니다.
// 주소가 없으면 로컬 주소를 기본값으로 사용합니다.
export const API_BASE_URL = VITE_API_URL || "http://localhost:8080";

// 확인용 로그 (브라우저 콘솔에서 확인 가능)
console.log("Current API URL:", API_BASE_URL);