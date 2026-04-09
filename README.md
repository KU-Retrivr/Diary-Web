# Diary Web

Spring Boot 일기 API와 연결되는 React + Vite 프론트엔드입니다.

기본 백엔드 주소:
- `http://52.79.227.135:8080`

연결된 API:
- `GET /diaries`
- `PUT /diaries/{date}`
- `DELETE /diaries/{date}`

## 실행 방법

```bash
npm install
npm run dev
```

## API 구조

- 공통 API 클라이언트: `src/utils/api.js`
- 일기 API 서비스: `src/services/diaryService.js`
- 화면 연동: `src/App.jsx`
