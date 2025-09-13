import axios from 'axios';

// API 기본 설정
const API_BASE_URL = (typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL) || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use((config) => {
  // 로그인 요청에는 토큰을 붙이지 않음
  const isLoginRequest = (config.url || '').startsWith('/login')
  const token = localStorage.getItem('token');
  if (token && !isLoginRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 타입 정의
export interface Applicant {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Big5TestResult {
  id?: string;
  job_seeker_id: string;
  test_date?: string;
  test_duration_minutes: number;
  openness_score: number;
  conscientiousness_score: number;
  extraversion_score: number;
  agreeableness_score: number;
  neuroticism_score: number;
  openness_level: string;
  conscientiousness_level: string;
  extraversion_level: string;
  agreeableness_level: string;
  neuroticism_level: string;
  openness_facets: any;
  conscientiousness_facets: any;
  extraversion_facets: any;
  agreeableness_facets: any;
  neuroticism_facets: any;
  interpretations: any;
  raw_scores: any;
  overall_analysis?: string;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
}

export interface ApplicantInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  education?: string;
  experience?: string;
}

export interface Document {
  document_id: string;
  user_id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_date: string;
}

export interface AptitudeTest {
  user_id: string;
  test_type: string;
  scores: Record<string, number>;
  interpretation: string;
  submitted_at: string;
}

export interface BehaviorTest {
  user_id: string;
  test_results: Record<string, any>;
  submitted_at: string;
}

export interface OwnQnA {
  question_id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  job_postings_id: string;
  title: string;
  description: string;
  requirements: string[];
  ai_criteria: Record<string, any>;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Interview {
  applications_id: string;
  job_postings_id: string;
  user_id: string;
  overall_report: any;
  ai_evaluations: any;
  conversation_highlights: any[];
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_type: 'job_seeker' | 'company';
  user_id: string;
}

// API 함수들
export const api = {
  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/login', data);
    
    // 백엔드 응답 형식에 맞춰 변환
    const backendResponse = response.data;
    return {
      token: backendResponse.access_token,
      user_type: backendResponse.user.user_type,
      user_id: backendResponse.user.id,
    };
  },

  // 지원자 관련 API
  applicant: {
    // 지원자 마이페이지
    getProfile: async (user_id: string) => {
      const response = await apiClient.get(`/applicants/${user_id}`);
      return response.data;
    },

    // 짧은소개 등록
    createBio: async (user_id: string, bio: string) => {
      const response = await apiClient.post(`/applicants/bio/${user_id}`, { bio });
      return response.data;
    },

    // 짧은소개 수정
    updateBio: async (user_id: string, bio: string) => {
      const response = await apiClient.put(`/applicants/bio/${user_id}`, { bio });
      return response.data;
    },

    // 기본정보 등록
    createInfo: async (user_id: string, info: ApplicantInfo) => {
      const response = await apiClient.post(`/applicants/info/${user_id}`, info);
      return response.data;
    },

    // 기본정보 수정
    updateInfo: async (user_id: string, info: ApplicantInfo) => {
      const response = await apiClient.put(`/applicants/info/${user_id}`, info);
      return response.data;
    },

    // 파싱 생성
    createParse: async (user_id: string) => {
      const response = await apiClient.get(`/applicants/parses/${user_id}`);
      return response.data;
    },

    // 파싱 컨펌 및 저장
    confirmParse: async (user_id: string, data: any) => {
      const response = await apiClient.put(`/applicants/parses/${user_id}`, data);
      return response.data;
    },

    // 적성검사 제출
    submitAptitudeTest: async (user_id: string, testData: FormData) => {
      const response = await apiClient.post(`/aptitudes/${user_id}`, testData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 행동검사 제출
    submitBehaviorTest: async (user_id: string, testData: FormData) => {
      const response = await apiClient.post(`/behaviors/${user_id}`, testData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 질문답변 생성
    createOwnQnA: async (user_id: string, question_id: string, data: { question: string; answer: string }) => {
      const response = await apiClient.post(`/own-qnas/${user_id}/${question_id}`, data);
      return response.data;
    },

    // 질문답변 수정
    updateOwnQnA: async (user_id: string, data: { question: string; answer: string }) => {
      const response = await apiClient.put(`/own-qnas/${user_id}`, data);
      return response.data;
    },
  },

  // 문서 관련 API
  documents: {
    // 파일 업로드
    upload: async (user_id: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post(`/docs/${user_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 파일 개별 조회
    get: async (document_id: string) => {
      const response = await apiClient.get(`/docs/${document_id}`);
      return response.data;
    },

    // 파일 개별 삭제
    delete: async (document_id: string) => {
      const response = await apiClient.delete(`/docs/${document_id}`);
      return response.data;
    },
  },

  // 기업 관련 API
  company: {
    // 채용관리 페이지
    getJobPostings: async () => {
      const response = await apiClient.get('/job-postings');
      return response.data;
    },

    // 구인공고 생성
    createJobPosting: async (data: Partial<JobPosting>) => {
      const response = await apiClient.post('/job-postings', data);
      return response.data;
    },

    // 구인공고 조회
    getJobPosting: async (job_postings_id: string) => {
      const response = await apiClient.get(`/job-postings/${job_postings_id}`);
      return response.data;
    },

    // 공고마감
    closeJobPosting: async (job_postings_id: string) => {
      const response = await apiClient.put(`/job-postings/${job_postings_id}`, { status: 'closed' });
      return response.data;
    },

    // 질의응답 및 리포트 생성
    createInterview: async (job_postings_id: string) => {
      const response = await apiClient.post(`/interviews/${job_postings_id}`);
      return response.data;
    },

    // 채용현황 페이지
    getInterviewStatus: async (job_postings_id: string) => {
      const response = await apiClient.get(`/interviews/${job_postings_id}`);
      return response.data;
    },

    // 개별리포트 조회
    getIndividualReport: async (applications_id: string) => {
      const response = await apiClient.get(`/interviews/${applications_id}`);
      return response.data;
    },

    // AI 면접 대화 전체 조회
    getConversation: async (applications_id: string) => {
      const response = await apiClient.get(`/interviews/conversations/${applications_id}`);
      return response.data;
    },

    // 지원자 프로필 조회
    getApplicantProfile: async (applications_id: string) => {
      const response = await apiClient.get(`/interviews/profiles/${applications_id}`);
      return response.data;
    },
  },

  // Big5 성격검사 관련 API
  big5: {
    // Big5 검사 결과 저장
    saveTestResult: async (result: Big5TestResult) => {
      const response = await apiClient.post('/big5-test-results', result);
      return response.data;
    },

    // Big5 검사 결과 조회
    getTestResult: async (job_seeker_id: string) => {
      const response = await apiClient.get(`/big5-test-results/${job_seeker_id}`);
      return response.data;
    },

    // Big5 검사 결과 업데이트
    updateTestResult: async (id: string, result: Partial<Big5TestResult>) => {
      const response = await apiClient.put(`/big5-test-results/${id}`, result);
      return response.data;
    },

    // Big5 검사 결과 삭제
    deleteTestResult: async (id: string) => {
      const response = await apiClient.delete(`/big5-test-results/${id}`);
      return response.data;
    },
  },
};

export default apiClient;