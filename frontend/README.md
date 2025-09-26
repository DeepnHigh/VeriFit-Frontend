## VeriFit Frontend (간략판)

AI 기반 채용/평가 플랫폼의 프론트엔드 애플리케이션입니다 (Next.js + TypeScript).

### 주요 기능
- 지원자: 프로필 / 문서 업로드 / 적성·행동검사 / AI Q&A / 지원현황
- 기업: 채용공고 관리 / 지원자 목록 & 정렬 / 면접 진행 상태 / 평가 & 리포트

### 기술 스택
Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query, Axios

### 빠른 시작
```bash
npm install
cp .env.example .env.local   # 없으면 직접 생성
npm run dev
```
브라우저: http://localhost:3000

필수 환경변수 (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### NPM 스크립트
```bash
npm run dev     # 개발
npm run build   # 프로덕션 빌드
npm start       # 빌드 결과 실행
```

### 구조 (요약)
```
frontend/
├─ src/app        # App Router 페이지
├─ components     # 공용 UI
├─ lib            # api, util, provider
├─ hooks          # 커스텀 훅
├─ types          # TS 타입
└─ styles / public
```

### API 사용 예시
```ts
import { api } from '@/lib/api'
const jobs = await api.company.getJobPostings()
```

### 배포
```bash
npm run build
npm start
```

### 기타
- 상태 폴링: 면접 진행 중(eval_status = ing) 5초 간격 갱신
- 정렬: 지원자 테이블 다중 정렬 키 (총점/하드/소프트/지원일)

문의/개선: 내부 이슈 트래커 사용

MIT License
