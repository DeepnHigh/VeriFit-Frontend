'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, getApiBaseUrl } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('로그인 시도:', { email, password })
      console.log('API URL:', getApiBaseUrl())
      const response = await api.login({ email, password })
      localStorage.setItem('token', response.token) 
      localStorage.setItem('userType', response.user_type)
      localStorage.setItem('userId', response.user_id)
      if (response.company_name) {
        localStorage.setItem('companyName', response.company_name)
      } else {
        localStorage.removeItem('companyName')
      }
      // 지원자 이름 캐시 초기화 (백엔드에서 제공되면 저장)
      try {
        if (response.user_type === 'job_seeker') {
          const userName = (response as any)?.user_name || (response as any)?.user?.name
          if (userName) {
            localStorage.setItem('applicantName', userName)
          }
        }
      } catch (_) {}
      
      // 사용자 타입에 따라 리다이렉트
      if (response.user_type === 'job_seeker') {
        router.push('/applicant/dashboard')
      } else if (response.user_type === 'company') {
        router.push('/company/dashboard')
      } else {
        // 기본적으로 지원자 페이지로 이동
        router.push('/applicant/dashboard')
      }
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            VeriFit 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link href="/register" prefetch={false} onClick={(e) => { e.preventDefault(); alert('회원가입 페이지가 아직 준비되지 않았습니다.'); }} className="font-medium text-blue-600 hover:text-blue-500">
              회원가입
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일 주소
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '지원자 로그인'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
