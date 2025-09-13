import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'; // Updated to 8001

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use((config) => {
  const isLoginRequest = (config.url || '').startsWith('/login')
  const token = localStorage.getItem('token');
  if (token && !isLoginRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 401 에러 시 자동 로그아웃
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
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_type: string;
  user_id: string;
}

export interface ApplicantInfo {
  full_name: string;
  phone: string;
  email: string;
  bio: string;
  total_experience_years: number;
  company_name: string;
  education_level: string;
  university: string;
  major: string;
  graduation_year: number;
  location: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary_min: number;
  salary_max: number;
  description: string;
  requirements: string;
  benefits: string;
  deadline: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_postings_id: string;
  job_seeker_id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  applied_at: string;
  job_posting: JobPosting;
}

export interface Interview {
  id: string;
  applications_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  interview_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Report {
  id: string;
  interview_id: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  created_at: string;
}

// AI 학습 질문 관련 타입
export interface AILearningQuestion {
  id: string;
  question_category: string;
  question_text: string;
  display_order: number;
}

export interface AILearningResponse {
  id: string;
  job_seeker_id: string;
  question_id: string;
  answer_text: string;
  response_date: string;
}

// 파일 업로드 관련 타입
export interface FileUploadResponse {
  success: boolean;
  message: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
}

// 파일 삭제 관련 타입
export interface FileDeleteResponse {
  success: boolean;
  message: string;
}

export const api = {
  // 인증 관련 API
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/login', data);
    const backendResponse = response.data;
    return {
      token: backendResponse.access_token,
      user_type: backendResponse.user.user_type,
      user_id: backendResponse.user.id,
    };
  },

  // 지원자 관련 API
  applicant: {
    // 지원자 프로필 조회
    getProfile: async (user_id: string) => {
      const response = await apiClient.get(`/applicants/${user_id}`);
      return response.data;
    },

    // 지원자 짧은소개 등록
    createBio: async (user_id: string, bio: string) => {
      const response = await apiClient.post(`/applicants/bio/${user_id}`, { bio });
      return response.data;
    },

    // 지원자 짧은소개 수정
    updateBio: async (user_id: string, bio: string) => {
      const response = await apiClient.put(`/applicants/bio/${user_id}`, { bio });
      return response.data;
    },

    // 지원자 기본정보 등록
    createInfo: async (user_id: string, info: ApplicantInfo) => {
      const response = await apiClient.post(`/applicants/info/${user_id}`, info);
      return response.data;
    },

    // 지원자 기본정보 수정
    updateInfo: async (user_id: string, info: ApplicantInfo) => {
      const response = await apiClient.put(`/applicants/info/${user_id}`, info);
      return response.data;
    },

    // 지원자 파싱 생성
    createParse: async (user_id: string) => {
      const response = await apiClient.get(`/applicants/parses/${user_id}`);
      return response.data;
    },

    // 지원자 파싱 컨펌 및 저장
    confirmParse: async (user_id: string, data: unknown) => {
      const response = await apiClient.put(`/applicants/parses/${user_id}`, data);
      return response.data;
    },

    // 지원자 적성검사 제출
    submitAptitudeTest: async (user_id: string, testData: FormData) => {
      const response = await apiClient.post(`/aptitudes/${user_id}`, testData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 지원자 행동검사 제출
    submitBehaviorTest: async (user_id: string, testData: FormData) => {
      const response = await apiClient.post(`/behaviors/${user_id}`, testData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 지원자 질문답변 생성
    createOwnQnA: async (user_id: string, question_id: string, data: { question: string; answer: string }) => {
      const response = await apiClient.post(`/own-qnas/${user_id}/${question_id}`, data);
      return response.data;
    },

    // 지원자 질문답변 수정
    updateOwnQnA: async (user_id: string, data: { question: string; answer: string }) => {
      const response = await apiClient.put(`/own-qnas/${user_id}`, data);
      return response.data;
    },

    // AI 학습 질문 목록 조회
    getAILearningQuestions: async () => {
      const response = await apiClient.get('/own-qnas/questions');
      return response.data;
    },

    // 사용자별 AI 학습 질문 답변 조회 (own-qnas API 활용)
    getAILearningResponses: async (user_id: string) => {
      const response = await apiClient.get(`/own-qnas/${user_id}`);
      return response.data;
    },

    // AI 학습 질문 답변 저장/수정
    saveAILearningResponse: async (user_id: string, question_id: string, answer: string) => {
      const response = await apiClient.post(`/ai-learning-responses/${user_id}/${question_id}`, { answer });
      return response.data;
    },
  },

  // 지원자 문서 관련 API
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

    // 파일 목록 조회
    getFiles: async (user_id: string) => {
      const response = await apiClient.get(`/docs/${user_id}`);
      return response.data;
    },

    // 파일 삭제
    deleteFile: async (user_id: string, file_id: string) => {
      const response = await apiClient.delete(`/docs/${user_id}/${file_id}`);
      return response.data;
    },
  },

  // 기업 관련 API
  company: {
    // 기업 채용관리 페이지
    getJobPostings: async () => {
      const response = await apiClient.get('/job-postings');
      return response.data;
    },

    // 기업 구인공고 생성
    createJobPosting: async (data: Partial<JobPosting>) => {
      const response = await apiClient.post('/job-postings', data);
      return response.data;
    },

    // 기업 구인공고 조회
    getJobPosting: async (job_postings_id: string) => {
      const response = await apiClient.get(`/job-postings/${job_postings_id}`);
      return response.data;
    },

    // 기업 공고마감
    closeJobPosting: async (job_postings_id: string) => {
      const response = await apiClient.put(`/job-postings/${job_postings_id}`, { status: 'closed' });
      return response.data;
    },

    // 기업 질의응답 및 리포트 생성
    createInterview: async (job_postings_id: string) => {
      const response = await apiClient.post(`/interviews/${job_postings_id}`);
      return response.data;
    },

    // 기업 채용현황 페이지
    getInterviewStatus: async (job_postings_id: string) => {
      const response = await apiClient.get(`/interviews/${job_postings_id}`);
      return response.data;
    },

    // 기업 개별리포트 조회
    getIndividualReport: async (applications_id: string) => {
      const response = await apiClient.get(`/interviews/${applications_id}`);
      return response.data;
    },

    // 기업 AI 면접 대화 전체 조회
    getConversation: async (applications_id: string) => {
      const response = await apiClient.get(`/interviews/conversations/${applications_id}`);
      return response.data;
    },

    // 기업 지원자 프로필 조회
    getApplicantProfile: async (applications_id: string) => {
      const response = await apiClient.get(`/interviews/profiles/${applications_id}`);
      return response.data;
    },
  },

  // S3 파일 관리
  s3: {
    // 사용자별 파일 목록 조회
    getUserFiles: async (user_id: string) => {
      const response = await apiClient.get(`/s3/files/${user_id}`);
      return response.data;
    },

    // 파일 다운로드 URL 생성
    getDownloadUrl: async (user_id: string, file_type: string, file_name: string) => {
      const response = await apiClient.get(`/s3/download/${user_id}/${file_type}/${file_name}`);
      return response.data;
    },

    // GitHub 링크 파일 내용 조회
    getGithubLinks: async (user_id: string) => {
      const response = await apiClient.get(`/s3/github/${user_id}`);
      return response.data;
    },

    // 파일 삭제
    deleteFile: async (user_id: string, file_type: string, file_name: string): Promise<FileDeleteResponse> => {
      const response = await apiClient.delete(`/s3/delete/${user_id}/${file_type}/${file_name}`);
      return response.data;
    },

    // 자기소개서 파일 업로드
    uploadCoverLetter: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'cover_letter');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/cover_letter`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 포트폴리오 파일 업로드
    uploadPortfolio: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'portfolio');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/portfolio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 이력서 파일 업로드
    uploadResume: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'resume');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 수상 경력 파일 업로드
    uploadAward: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'award');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/award`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 증명서 파일 업로드
    uploadCertificate: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'certificate');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/certificate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 자격증 파일 업로드
    uploadQualification: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'qualification');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/qualification`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 논문 파일 업로드
    uploadPaper: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'paper');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/paper`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // 기타 자료 파일 업로드
    uploadOther: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'other');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/other`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // GitHub 링크 파일 업로드
    uploadGithub: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'github');
      
      const response = await apiClient.post(`/s3/upload/${user_id}/github`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  },
};

export default apiClient;