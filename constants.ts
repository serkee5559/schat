// 배포 환경이면 실제 서버 주소를, 로컬이면 .env에 설정된 주소를 사용합니다.
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";