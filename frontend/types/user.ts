export interface User {
  id: string
  name: string
  email: string
  phone?: string
  userType: 'job_seeker' | 'company'
  created_at: string
  updated_at?: string
}

export interface JobSeeker extends User {
  userType: 'job_seeker'
  bio?: string
  documents?: Document[]
  aptitude_test?: AptitudeTest
  behavior_test?: BehaviorTest
  own_qnas?: QnA[]
}

export interface Company extends User {
  userType: 'company'
  companyName: string
  industry?: string
  size?: string
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploaded_at: string
}

export interface AptitudeTest {
  id: string
  scores: {
    realistic: number
    investigative: number
    artistic: number
    social: number
    enterprising: number
    conventional: number
  }
  completed_at: string
}

export interface BehaviorTest {
  id: string
  results: any
  completed_at: string
}

export interface QnA {
  id: string
  question: string
  answer: string
  created_at: string
}
