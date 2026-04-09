# Diary Web

Spring Boot 일기 API와 연결되는 React + Vite 프론트엔드입니다.

최신 백엔드 명세 기준:
- `GET /diaries`
- `POST /diaries` with `{ "content": "...", "date": "YYYY-MM-DD" }`
- `DELETE /diaries/{id}`

## 실행 방법

```bash
npm install
npm run dev
```

## 환경변수

루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```bash
VITE_API_BASE_URL=http://localhost:8080
```
