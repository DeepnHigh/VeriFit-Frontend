# VeriFit - AI 기반 채용 플랫폼 프론트엔드

VeriFit은 AI 면접과 적성검사를 통한 스마트한 채용 솔루션을 제공하는 플랫폼입니다.

## 주요 기능

### 지원자 기능
- 프로필 관리 (기본정보, 짧은소개)
- 문서 업로드 및 관리
- 적성검사 및 행동검사
- AI Q&A 작성
- 지원 현황 확인

### 기업 기능
- 채용공고 작성 및 관리
- 지원자 평가 및 리포트 확인
- AI 면접 진행
- 채용 현황 대시보드

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Lucide React

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── applicant/         # 지원자 관련 페이지
│   ├── company/           # 기업 관련 페이지
│   ├── login/             # 로그인 페이지
│   └── layout.tsx         # 루트 레이아웃
├── lib/                   # 유틸리티 및 설정
│   ├── api.ts            # API 클라이언트
│   ├── providers.tsx     # React Query Provider
│   └── utils.ts          # 유틸리티 함수
└── components/           # 재사용 가능한 컴포넌트
```

## API 연동

백엔드 API와의 통신을 위해 `src/lib/api.ts`에 정의된 API 클라이언트를 사용합니다.

### 주요 API 엔드포인트

- **지원자 API**: `/applicants/*`
- **기업 API**: `/job-postings/*`, `/interviews/*`
- **문서 API**: `/docs/*`
- **인증 API**: `/login`

## 개발 가이드

### 새로운 페이지 추가

1. `src/app/` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 생성
3. 필요시 레이아웃 파일 추가

### API 호출

```typescript
import { api } from '@/lib/api'

// 지원자 프로필 조회
const profile = await api.applicant.getProfile(userId)

// 채용공고 목록 조회
const jobPostings = await api.company.getJobPostings()
```

### 스타일링

Tailwind CSS를 사용하여 스타일링합니다. 유틸리티 클래스를 조합하여 사용하세요.

```tsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">제목</h2>
</div>
```

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
