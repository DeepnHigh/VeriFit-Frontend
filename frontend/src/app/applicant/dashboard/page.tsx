'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function ApplicantDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')
    
    if (!userId || userType !== 'job_seeker') {
      router.push('/login')
      return
    }

    fetchUserProfile(userId)
  }, [router])

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await api.applicant.getProfile(userId)
      setUser(profile)
    } catch (err: any) {
      setError('프로필을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('userId')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                VeriFit
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">안녕하세요, {user?.name || '지원자'}님</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">지원자 대시보드</h1>
          <p className="mt-2 text-gray-600">프로필을 관리하고 지원 과정을 진행하세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 프로필 정보 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
            <div className="space-y-2">
              <p><span className="font-medium">이름:</span> {user?.name || '미입력'}</p>
              <p><span className="font-medium">이메일:</span> {user?.email || '미입력'}</p>
              <p><span className="font-medium">전화번호:</span> {user?.phone || '미입력'}</p>
              <p><span className="font-medium">가입일:</span> {user?.created_at ? formatDate(user.created_at) : '미입력'}</p>
            </div>
            <Link
              href="/applicant/profile"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              프로필 수정
            </Link>
          </div>

          {/* 짧은소개 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">짧은소개</h2>
            <p className="text-gray-600 mb-4">
              {user?.bio || '아직 작성된 짧은소개가 없습니다.'}
            </p>
            <Link
              href="/applicant/bio"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {user?.bio ? '수정하기' : '작성하기'}
            </Link>
          </div>

          {/* 업로드된 파일 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">업로드된 파일</h2>
            <p className="text-gray-600 mb-4">
              {user?.documents?.length || 0}개의 파일이 업로드되었습니다.
            </p>
            <Link
              href="/applicant/documents"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              파일 관리
            </Link>
          </div>

          {/* 적성검사 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">적성검사</h2>
            <p className="text-gray-600 mb-4">
              {user?.aptitude_test ? '완료됨' : '미완료'}
            </p>
            <Link
              href="/applicant/aptitude"
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              {user?.aptitude_test ? '결과 보기' : '검사 시작'}
            </Link>
          </div>

          {/* 행동검사 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">행동검사</h2>
            <p className="text-gray-600 mb-4">
              {user?.behavior_test ? '완료됨' : '미완료'}
            </p>
            <Link
              href="/applicant/behavior"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              {user?.behavior_test ? '결과 보기' : '검사 시작'}
            </Link>
          </div>

          {/* AI Q&A */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Q&A</h2>
            <p className="text-gray-600 mb-4">
              {user?.own_qnas?.length || 0}개의 질문에 답변했습니다.
            </p>
            <Link
              href="/applicant/qna"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Q&A 관리
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
