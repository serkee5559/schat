// AS-IS (기존)
// export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// TO-BE (수정 후)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";