import axios from 'axios';

// 타입 정의
interface FileUploadResponse {
  success: boolean;
  message: string;
  file_url?: string;
  file_name?: string;
}

interface S3File {
  name: string;
  size: number;
  lastModified: string;
  downloadUrl: string;
}

interface UserFiles {
  cover_letter?: S3File[];
  portfolio?: S3File[];
  resume?: S3File[];
  award?: S3File[];
  certificate?: S3File[];
  qualification?: S3File[];
  paper?: S3File[];
  other?: S3File[];
  github?: S3File[]; // GitHub도 파일 객체로 처리
}

// 개인정보 추출 결과 타입
interface PersonalInfo {
  email?: string;
  phone?: string;
  education_level?: string;
  university?: string;
  major?: string;
  graduation_year?: string;
  total_experience_years?: number;
  company_name?: string;
}

// 백엔드 응답 형식
interface PersonalInfoResponse {
  success: boolean;
  personal_info: PersonalInfo;
  extracted_text_length: number;
  processed_files: string[];
  message: string;
}


// API URL 설정
const STORAGE_KEY = 'verifit_api_url';

// 환경변수에서 API URL 목록 가져오기
const getApiUrlList = (): string[] => {
  const urls: string[] = [];
  
  // 환경변수에서 API URL들을 순서대로 가져오기
  let i = 1;
  while (process.env[`NEXT_PUBLIC_API_URL_${i}`]) {
    urls.push(process.env[`NEXT_PUBLIC_API_URL_${i}`]!);
    i++;
  }
  
  // 환경변수가 없으면 기본값들 사용
  if (urls.length === 0) {
    urls.push('http://192.168.0.21:8000');
    urls.push('http://14.39.95.228:8000');
  }
  
  return urls;
};

// API URL 동적 선택 함수
export const getApiBaseUrl = (): string => {
  // 1) 브라우저에서 저장된 성공한 API URL 우선 사용
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(STORAGE_KEY);
    if (savedUrl) {
      console.log('[API] localStorage에서 저장된 API URL 사용:', savedUrl);
      return savedUrl;
    }
  }

  // 2) 환경변수에서 첫 번째 URL 사용
  const urlList = getApiUrlList();
  const firstUrl = urlList[0];
  console.log('[API] 첫 번째 API URL 사용:', firstUrl);
  return firstUrl;
};

// 성공한 API URL을 저장하는 함수
export const saveSuccessfulApiUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, url);
    console.log('[API] 성공한 API URL 저장:', url);
  }
};

// 저장된 API URL을 초기화하는 함수 (필요시 사용)
export const clearSavedApiUrl = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[API] 저장된 API URL 초기화');
  }
};

// API URL 강제 재설정 함수 (디버깅용)
export const resetApiUrl = () => {
  if (typeof window !== 'undefined') {
    clearSavedApiUrl();
    console.log('[API] API URL 재설정 완료. 다음 요청부터 새로운 URL 사용');
  }
};

// API 기본 설정
const API_BASE_URL = getApiBaseUrl();
const API_URL_LIST = getApiUrlList();

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

// 응답 인터셉터 - 에러 처리 및 폴백 재시도
apiClient.interceptors.response.use(
  (response) => {
    // 성공한 요청의 API URL을 저장
    const baseURL = response.config.baseURL;
    if (baseURL && typeof window !== 'undefined') {
      saveSuccessfulApiUrl(baseURL);
    }
    return response;
  },
  async (error) => {
    const originalConfig = error?.config || {};

    // 인증 만료 처리
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 네트워크/CORS류 오류로 응답이 없는 경우, 다른 API URL로 재시도
    const isNetworkOrCorsError = !error?.response;
    const alreadyRetried = (originalConfig as any)._retriedWithFallback === true;

    if (isNetworkOrCorsError && !alreadyRetried) {
      const currentBaseURL = originalConfig.baseURL || API_BASE_URL;
      const currentIndex = API_URL_LIST.findIndex(url => url === currentBaseURL);
      
      // 다음 API URL 찾기
      const nextIndex = currentIndex + 1;
      if (nextIndex < API_URL_LIST.length) {
        const nextApiUrl = API_URL_LIST[nextIndex];
        
        try {
          (originalConfig as any)._retriedWithFallback = true;
          console.warn(`[API] ${currentBaseURL} 실패, 다음 URL로 재시도: ${nextApiUrl}`);
          
          // 요청 경로 추출
          const rawUrl = (originalConfig.url || '') as string;
          const hasAbsoluteUrl = /^https?:\/\//.test(rawUrl);
          let pathOnly = rawUrl;
          if (hasAbsoluteUrl) {
            try {
              const u = new URL(rawUrl);
              pathOnly = `${u.pathname}${u.search || ''}`;
            } catch {}
          }
          
          const retryUrl = `${nextApiUrl}${pathOnly.startsWith('/') ? '' : '/'}${pathOnly}`;
          const method = (originalConfig.method || 'get').toLowerCase();
          const headers = originalConfig.headers || {};
          const data = originalConfig.data;

          const retryResponse = await axios({
            url: retryUrl,
            method,
            headers,
            data,
            withCredentials: originalConfig.withCredentials,
            timeout: originalConfig.timeout,
          });
          
          // 재시도 성공 시 해당 URL을 저장
          if (typeof window !== 'undefined') {
            saveSuccessfulApiUrl(nextApiUrl);
            console.log(`[API] 재시도 성공, URL 저장: ${nextApiUrl}`);
          }
          return retryResponse;
        } catch (retryError) {
          console.error(`[API] ${nextApiUrl} 재시도도 실패:`, retryError);
          return Promise.reject(retryError);
        }
      }
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
  openness_score: number;
  conscientiousness_score: number;
  extraversion_score: number;
  agreeableness_score: number;
  neuroticism_score: number;
  openness_level: 'high' | 'neutral' | 'low';
  conscientiousness_level: 'high' | 'neutral' | 'low';
  extraversion_level: 'high' | 'neutral' | 'low';
  agreeableness_level: 'high' | 'neutral' | 'low';
  neuroticism_level: 'high' | 'neutral' | 'low';
  openness_facets?: Record<string, any>;
  conscientiousness_facets?: Record<string, any>;
  extraversion_facets?: Record<string, any>;
  agreeableness_facets?: Record<string, any>;
  neuroticism_facets?: Record<string, any>;
  interpretations?: Record<string, any>;
  raw_scores?: Record<string, any>;
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
  company_name?: string;
  user_name?: string;
}

// API 함수들
export const api = {
  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // API URL 목록을 순차적으로 시도
    for (let i = 0; i < API_URL_LIST.length; i++) {
      const apiUrl = API_URL_LIST[i];
      try {
        console.log(`[API] 로그인 시도 ${i + 1}/${API_URL_LIST.length}: ${apiUrl}`);
        const response = await axios.post(`${apiUrl}/login`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        const backendResponse = response.data;
        
        // 성공한 API URL 저장
        if (typeof window !== 'undefined') {
          saveSuccessfulApiUrl(apiUrl);
          console.log(`[API] 로그인 성공, URL 저장: ${apiUrl}`);
        }
        
        return {
          token: backendResponse.access_token,
          user_type: backendResponse.user.user_type,
          user_id: backendResponse.user.id,
          company_name: backendResponse.user.company_name,
          user_name: backendResponse.user.name,
        };
      } catch (error: any) {
        console.warn(`[API] ${apiUrl} 로그인 실패:`, error.message);
        
        // 마지막 URL까지 실패한 경우
        if (i === API_URL_LIST.length - 1) {
          console.error('[API] 모든 API URL 로그인 실패');
          throw error;
        }
      }
    }
    
    throw new Error('로그인 실패: 사용 가능한 API 서버가 없습니다.');
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
    createParse: async (user_id: string): Promise<PersonalInfoResponse> => {
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

    // AI 학습 질문 목록 조회
    getAILearningQuestions: async () => {
      const response = await apiClient.get('/own-qnas/questions');
      return response.data;
    },

    // 사용자별 AI 학습 질문 답변 조회
    getAILearningAnswers: async (user_id: string) => {
      const response = await apiClient.get(`/own-qnas/${user_id}`);
      return response.data;
    },

    // AI 학습 질문 답변 저장/수정
    saveAILearningAnswer: async (user_id: string, question_id: string, answer: string) => {
      const response = await apiClient.post(`/own-qnas/${user_id}/${question_id}`, { answer });
      return response.data;
    },

    // 행동평가 결과 텍스트 저장
    saveBehaviorText: async (user_id: string, behavior_text: string) => {
      const response = await apiClient.post(`/behavior/save/${user_id}`, { behavior_text });
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
      // 백엔드 응답 형식: { message, data: { id, ... } }
      return response.data?.data ?? response.data;
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

    // 개별리포트 조회 (applications_id)
    getIndividualReport: async (applications_id: string) => {
      const response = await apiClient.get(`/company/interviews/report/${applications_id}`);
      return response.data;
    },

    // AI 면접 대화 전체 조회 (applications_id)
    getConversation: async (applications_id: string) => {
      const response = await apiClient.get(`/company/interviews/conversations/${applications_id}`);
      return response.data;
    },

    // 지원자 프로필 조회 (applications_id)
    getApplicantProfile: async (applications_id: string) => {
      const response = await apiClient.get(`/company/interviews/profiles/${applications_id}`);
      return response.data;
    },
  },

  // 지원(Applications) 관련 API
  applications: {
    // 지원 생성
    create: async (job_posting_id: string, job_seeker_id: string) => {
      const response = await apiClient.post('/applications', {
        job_posting_id,
        job_seeker_id,
      })
      return response.data
    },

    // (선택) 내 지원 목록 조회
    listByJobSeeker: async (job_seeker_id: string) => {
      const response = await apiClient.get(`/applications?job_seeker_id=${job_seeker_id}`)
      return response.data
    },
  },

  // 공개 공고 관련 API
  public: {
    // 모든 회사의 모든 공고 조회 (공개)
    getAllJobPostings: async (includeClosed: boolean = false) => {
      const response = await apiClient.get(`/public/job-postings?include_closed=${includeClosed}`);
      return response.data;
    },
  },

  // Big5 성격검사 관련 API
  big5: {
    // Big5 검사 결과 저장
    saveTestResult: async (result: Big5TestResult) => {
      const response = await apiClient.post('/big5-test', result);
      return response.data;
    },

    // Big5 검사 결과 조회
    getTestResult: async (job_seeker_id: string) => {
      const response = await apiClient.get(`/big5-test/${job_seeker_id}`);
      return response.data;
    },

    // Big5 검사 결과 업데이트
    updateTestResult: async (id: string, result: Partial<Big5TestResult>) => {
      const response = await apiClient.put(`/big5-test/${id}`, result);
      return response.data;
    },

    // Big5 검사 결과 삭제
    deleteTestResult: async (id: string) => {
      const response = await apiClient.delete(`/big5-test/${id}`);
      return response.data;
    },
  },

  // 파일 관리 (백엔드 API와 매칭)
  files: {
    // 사용자별 파일 목록 조회 (백엔드: /s3/files/{user_id})
    getUserFiles: async (user_id: string) => {
      const response = await apiClient.get(`/s3/files/${user_id}`);
      return response.data;
    },

    // 파일 다운로드 URL 생성
    getDownloadUrl: async (user_id: string, file_type: string, file_name: string) => {
      const response = await apiClient.get(`/s3/download/${user_id}/${file_type}/${file_name}`);
      return response.data;
    },

    // 파일 삭제
    deleteFile: async (user_id: string, file_type: string, file_name: string): Promise<{ success: boolean; message: string }> => {
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

  // 호환성을 위한 s3 별칭 (기존 코드에서 api.s3.* 사용 중)
  s3: {
    getUserFiles: async (user_id: string) => {
      const response = await apiClient.get(`/s3/files/${user_id}`);
      return response.data;
    },
    getDownloadUrl: async (user_id: string, file_type: string, file_name: string) => {
      const response = await apiClient.get(`/s3/download/${user_id}/${file_type}/${file_name}`);
      return response.data;
    },
    deleteFile: async (user_id: string, file_type: string, file_name: string): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.delete(`/s3/delete/${user_id}/${file_type}/${file_name}`);
      return response.data;
    },
    uploadCoverLetter: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'cover_letter');
      const response = await apiClient.post(`/s3/upload/${user_id}/cover_letter`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadPortfolio: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'portfolio');
      const response = await apiClient.post(`/s3/upload/${user_id}/portfolio`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadResume: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'resume');
      const response = await apiClient.post(`/s3/upload/${user_id}/resume`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadAward: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'award');
      const response = await apiClient.post(`/s3/upload/${user_id}/award`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadCertificate: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'certificate');
      const response = await apiClient.post(`/s3/upload/${user_id}/certificate`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadQualification: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'qualification');
      const response = await apiClient.post(`/s3/upload/${user_id}/qualification`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadPaper: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'paper');
      const response = await apiClient.post(`/s3/upload/${user_id}/paper`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadOther: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'other');
      const response = await apiClient.post(`/s3/upload/${user_id}/other`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    uploadGithub: async (user_id: string, file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'github');
      const response = await apiClient.post(`/s3/upload/${user_id}/github`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
  },
};

export default apiClient;