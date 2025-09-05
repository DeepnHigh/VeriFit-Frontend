// AI 기반 채용 플랫폼 데이터베이스 스키마
// 적성검사와 행동 시뮬레이션을 제외한 핵심 기능들

// ==============================================
// 사용자 관리
// ==============================================

Table users {
  id uuid [primary key, default: `uuid_generate_v4()`]
  password varchar(255) // OAuth 사용자는 NULL 가능
  provider enum('local', 'google', 'github', 'linkedin', 'kakao', 'naver') [default: 'local']
  provider_id varchar(255) // OAuth 제공자의 사용자 ID
  user_type enum('company', 'candidate') [not null]
  is_active boolean [default: true]
  last_login_at timestamp // 마지막 로그인 시간
  created_at timestamp [default: `now()`]
  
  indexes {
    provider
    provider_id
    user_type
    is_active
  }
}

Table job_seekers {
  id uuid [primary key, default: `uuid_generate_v4()`]
  user_id uuid [ref: > users.id, not null]
  full_name varchar(100) [not null]
  phone varchar(20)
  email varchar(255)
  profile_picture varchar(500)
  bio text // 자기소개/프로필 소개
  total_experience_years integer // 총 경력 년수
  company_name varchar(200) // 최근 직장
  education_level enum('high_school', 'associate', 'bachelor', 'master', 'phd')
  university varchar(200) // 대학교명
  major varchar(100) // 전공
  graduation_year integer // 졸업년도
  github_repositories jsonb // GitHub 레포지토리 URL 리스트
  portfolios jsonb // 포트폴리오
  resumes jsonb // 이력서
  awards jsonb // 수상경력 리스트
  certificates jsonb // 증명서 리스트
  qualifications jsonb // 자격증 리스트
  papers jsonb // 논문 리스트
  cover_letters jsonb // 자기소개서 리스트
  other_documents jsonb // 기타 자료 리스트
  location varchar(200) // 거주지/위치
  profile_completion_percentage decimal(5,2) [default: 0.00] // 프로필 완성도
  last_profile_update timestamp // 마지막 프로필 업데이트
  is_profile_public boolean [default: true] // 프로필 공개 여부
  
  indexes {
    user_id
    total_experience_years
    education_level
    location
    is_profile_public
  }
}

Table job_seeker_documents {
  id uuid [primary key, default: `uuid_generate_v4()`]
  job_seeker_id uuid [ref: > job_seekers.id, not null]
  document_type enum('portfolio', 'resume', 'award', 'certificate', 'qualification', 'paper', 'cover_letter', 'other') [not null]
  file_name varchar(255) [not null]
  file_url varchar(500) [not null]
  file_size integer // bytes
  mime_type varchar(100) // 타입 (application/pdf)
  uploaded_at timestamp [default: `now()`]
  
  indexes {
    job_seeker_id
    document_type
    uploaded_at
  }
}

// AI 에이전트 관리 테이블
Table job_seeker_ai_agents {
  id uuid [primary key, default: `uuid_generate_v4()`]
  job_seeker_id uuid [ref: > job_seekers.id, not null]
  ai_agent_status enum('training', 'ready', 'error') [default: 'training'] // AI 에이전트 상태
  ai_agent_completion_percentage decimal(5,2) [default: 0.00] // AI 에이전트 완성도
  last_ai_trained timestamp // 마지막 AI 학습 시간
  total_ai_interviews integer [default: 0] // 총 AI 면접 횟수
  average_ai_score decimal(5,2) // 평균 AI 평가 점수
  
  indexes {
    job_seeker_id
    ai_agent_status
    average_ai_score
  }
}

// 적성검사 결과 테이블
Table aptitude_test_results {
  id uuid [primary key, default: `uuid_generate_v4()`]
  job_seeker_id uuid [ref: > job_seekers.id, not null]
  test_date timestamp [default: `now()`]
  test_duration_minutes integer // 검사 소요 시간(분)
  realistic_score decimal(5,2) [not null] // 현실형 점수
  investigative_score decimal(5,2) [not null] // 탐구형 점수
  artistic_score decimal(5,2) [not null] // 예술형 점수
  social_score decimal(5,2) [not null] // 사회형 점수
  enterprising_score decimal(5,2) [not null] // 진취형 점수
  conventional_score decimal(5,2) [not null] // 관습형 점수
  overall_analysis text // 종합 분석 결과
  strengths text // 강점 분석
  weaknesses text // 약점 분석
  recommendations text // 추천사항
  
  indexes {
    job_seeker_id
    test_date
  }
}

// 행동검사 결과 테이블도 추가해야함

// AI 학습용 질문 템플릿 테이블
Table ai_learning_questions {
  id uuid [primary key, default: `uuid_generate_v4()`]
  question_category varchar(100) [not null] // 질문 카테고리
  question_text text [not null] // 질문 내용
  display_order integer [default: 0] // 표시 순서
  
  indexes {
    question_category
    display_order
  }
}

// 구직자별 AI 학습 질문 답변 테이블
Table job_seeker_ai_learning_responses {
  id uuid [primary key, default: `uuid_generate_v4()`]
  job_seeker_id uuid [ref: > job_seekers.id, not null]
  question_id uuid [ref: > ai_learning_questions.id, not null]
  answer_text text [not null] // 답변 내용
  response_date timestamp [default: `now()`]
  
  indexes {
    job_seeker_id
    question_id
    response_date
  }
}

// Table job_seeker_work_experience {
//   id uuid [primary key, default: `uuid_generate_v4()`]
//   job_seeker_id uuid [ref: > job_seekers.id, not null]
//   company_name varchar(200) [not null]
//   position varchar(100) [not null]
//   start_date date [not null]
//   end_date date
//   is_current boolean [default: false]
//   description text
//   achievements text
//   created_at timestamp [default: `now()`]
  
//   indexes {
//     job_seeker_id
//     start_date
//     is_current
//   }
// }

// ==============================================
// 기업 관련
// ==============================================

Table companies {
  id uuid [primary key, default: `uuid_generate_v4()`]
  user_id uuid [ref: > users.id, not null]
  company_name varchar(200) [not null]
  industry varchar(100)
  company_size enum('startup', 'small', 'medium', 'large', 'enterprise')
  website varchar(255)
  description text
  logo_url varchar(500)
  founded_year integer // 설립년도
  employee_count integer // 직원 수
  headquarters_location varchar(200) // 본사 위치
  business_registration_number varchar(50) // 사업자등록번호
  company_status enum('active', 'inactive', 'suspended') [default: 'active']
  
  indexes {
    user_id
    company_name
    industry
    company_status
  }
}

Table job_postings {
  id uuid [primary key, default: `uuid_generate_v4()`]
  company_id uuid [ref: > companies.id, not null]
  title varchar(200) [not null]
  position_level enum('intern', 'junior', 'mid', 'senior', 'lead', 'manager')
  employment_type enum('full_time', 'part_time', 'contract', 'internship')
  location varchar(200)
  salary_min integer
  salary_max integer
  main_tasks text [not null]
  requirements text
  preferred text
  application_deadline date
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    company_id
    title
    position_level
    employment_type
    is_active
    application_deadline
  }
}

Table evaluation_criteria {
  id uuid [primary key, default: `uuid_generate_v4()`]
  job_posting_id uuid [ref: > job_postings.id, not null]
  skill_type enum('hard_skill', 'soft_skill') [not null]
  skill_name varchar(100) [not null]
  skill_description text
  percentage decimal(5,2) [default: 0.00] // 비중 (0.00 ~ 100.00)
  
  indexes {
    job_posting_id
    skill_type
  }
}

// ==============================================
// 지원 및 평가
// ==============================================

Table applications {
  id uuid [primary key, default: `uuid_generate_v4()`]
  job_posting_id uuid [ref: > job_postings.id, not null]
  job_seeker_id uuid [ref: > job_seekers.id, not null]
  application_status enum('submitted', 'under_review', 'ai_evaluated', 'shortlisted', 'rejected', 'hired') [default: 'submitted']
  applied_at timestamp [default: `now()`]
  evaluated_at timestamp
  notes text
  
  indexes {
    job_posting_id
    job_seeker_id
    application_status
    applied_at
  }
}

Table ai_evaluations {
  id uuid [primary key, default: `uuid_generate_v4()`]
  application_id uuid [ref: > applications.id, not null]
  evaluation_type enum('hard_skill', 'soft_skill', 'overall') [not null]
  skill_name varchar(100) [not null]
  score decimal(5,2) [not null] // 0.00 ~ 100.00
  max_score decimal(5,2) [default: 100.00]
  confidence_level decimal(5,2) [default: 0.00] // AI 신뢰도 0.00 ~ 100.00
  evaluation_reasoning text
  created_at timestamp [default: `now()`]
  
  indexes {
    application_id
    evaluation_type
    skill_name
    score
  }
}

// AI 면접 질문-답변 테이블 (지원별)
Table ai_interview_qa {
  id uuid [primary key, default: `uuid_generate_v4()`]
  application_id uuid [ref: > applications.id, not null]
  question_text text [not null]
  answer_text text [not null]
  question_category varchar(100)
  question_type enum('technical', 'behavioral', 'situational', 'general') [default: 'general']
  ai_generated boolean [default: false] // AI가 생성한 질문인지 여부
  created_at timestamp [default: `now()`]
  
  indexes {
    application_id
    question_category
    question_type
    created_at
  }
}

Table ai_overall_reports {
  id uuid [primary key, default: `uuid_generate_v4()`]
  application_id uuid [ref: > applications.id, not null]
  overall_score decimal(5,2) [not null]
  hard_skill_score decimal(5,2) [not null]
  soft_skill_score decimal(5,2) [not null]
  ai_summary text [not null]
  strengths text
  weaknesses text
  recommendations text
  generated_at timestamp [default: `now()`]
  
  indexes {
    application_id
    overall_score
    generated_at
  }
}

// ==============================================
// 시스템 관리
// ==============================================

Table system_settings {
  id uuid [primary key, default: `uuid_generate_v4()`]
  setting_key varchar(100) [unique, not null]
  setting_value text [not null]
  setting_type enum('string', 'number', 'boolean', 'json') [default: 'string']
  description text
  updated_at timestamp [default: `now()`]
  
  indexes {
    setting_key
  }
}

// 보안용
Table audit_logs {
  id uuid [primary key, default: `uuid_generate_v4()`]
  user_id uuid [ref: > users.id]
  action varchar(100) [not null]
  resource_type varchar(50) [not null]
  resource_id uuid
  old_values jsonb
  new_values jsonb
  ip_address inet
  user_agent text
  created_at timestamp [default: `now()`]
  
  indexes {
    user_id
    action
    resource_type
    resource_id
    created_at
  }
}

// ==============================================
// 관계 설정 (컬럼 정의의 [ref: > ...]로 모두 지정됨)
// ==============================================