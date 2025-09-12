export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    userType: 'job_seeker' | 'company'
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  userType: 'job_seeker' | 'company'
  companyName?: string
}

export interface ProfileUpdateRequest {
  name?: string
  email?: string
  phone?: string
  bio?: string
}
