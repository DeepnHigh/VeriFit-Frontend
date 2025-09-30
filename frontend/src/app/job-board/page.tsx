'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { logout } from '@/lib/auth'
import JobPostingDetail from '@/components/JobPostingDetail'

export default function JobBoardPage() {
  const [jobPostings, setJobPostings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [includeClosed, setIncludeClosed] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<any | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [isJobSeeker, setIsJobSeeker] = useState(false)
  const [jobSeekerId, setJobSeekerId] = useState<string>('')
  const [appliedPostingIds, setAppliedPostingIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    fetchJobPostings()
  }, [includeClosed])

  // 모달 열림 시 바디 스크롤 방지 (기업 대시보드와 동일 동작)
  useEffect(() => {
    if (isDetailOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isDetailOpen])

  // 사용자 유형 확인 (지원자 여부)
  useEffect(() => {
    try {
      const userType = localStorage.getItem('userType') || ''
      setIsJobSeeker(userType === 'job_seeker')
      // 지원자라면 프로필을 불러와 job_seekers.id 확보
      if (userType === 'job_seeker') {
        const userId = localStorage.getItem('userId') || ''
        if (userId) {
          api.applicant.getProfile(userId)
            .then((profile: any) => {
              // 프로필의 id를 job_seekers.id로 사용
              if (profile?.id) setJobSeekerId(profile.id)
            })
            .catch(() => {})
        }
      }
    } catch (_) {
      setIsJobSeeker(false)
    }
  }, [])

  // 현재 구직자의 지원 목록을 불러와 공고별 지원여부를 저장
  useEffect(() => {
    if (!jobSeekerId) return
    ;(async () => {
      try {
        const resp = await api.applications.listByJobSeeker(jobSeekerId)
        const list = Array.isArray(resp)
          ? resp
          : Array.isArray((resp as any)?.data)
            ? (resp as any).data
            : Array.isArray((resp as any)?.applications)
              ? (resp as any).applications
              : []
        const ids = (list as any[])
          .map((a: any) => a?.job_posting_id || a?.job_postings_id || a?.jobPostingId || a?.job_posting?.id)
          .filter(Boolean)
          .map((v: any) => String(v))
        setAppliedPostingIds(new Set(ids))
      } catch (_) {
        setAppliedPostingIds(new Set())
      }
    })()
  }, [jobSeekerId])

  const fetchJobPostings = async () => {
    try {
      setLoading(true)
      const postings = await api.public.getAllJobPostings(includeClosed)
      try {
        console.log('🛰️ GET /public/job-postings 응답 원본:', JSON.parse(JSON.stringify(postings)))
      } catch (_) {}
      
      const normalized = Array.isArray(postings)
        ? postings
        : Array.isArray((postings as any)?.data)
          ? (postings as any).data
          : Array.isArray((postings as any)?.job_postings)
            ? (postings as any).job_postings
            : []
      
      setJobPostings(normalized)
    } catch (err: unknown) {
      setError('채용공고를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const openDetail = async (posting: any) => {
    setSelectedPosting(posting)
    setIsDetailOpen(true)
    setDetailError('')
    setDetailLoading(true)
    try {
      const resp = await api.company.getJobPosting(posting.id)
      const data = (resp as any)?.data ?? resp
      const aiCriteria = (data as any)?.ai_criteria || (data as any)?.evaluation_criteria || null
      try {
        console.log('🛰️ GET /job-postings/{id} 응답 원본:', JSON.parse(JSON.stringify(resp)))
        console.log('🧰 상세 정규화 데이터:', JSON.parse(JSON.stringify(data)))
        console.log('🔎 평가 기준 필드:', JSON.parse(JSON.stringify(aiCriteria)))
      } catch (_) {}
      setSelectedPosting({ ...posting, ...data, ai_criteria: aiCriteria })
    } catch (e) {
      setDetailError('상세 정보를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setSelectedPosting(null)
    setDetailError('')
    setDetailLoading(false)
  }

  const handleLogout = () => logout('/')

  const mapEmploymentType = (value?: string | null) => {
    if (!value) return '-'
    switch (value) {
      case 'full_time': return '정규직'
      case 'part_time': return '파트타임'
      case 'contract': return '계약직'
      case 'internship': return '인턴'
      default: return value
    }
  }

  const mapPositionLevel = (value?: string | null) => {
    if (!value) return '-'
    const map: Record<string, string> = {
      intern: '인턴',
      junior: '신입/주니어',
      mid: '중급',
      senior: '시니어',
      lead: '리드',
      manager: '매니저',
    }
    return map[value] || value
  }

  const formatSalaryRange = (min?: number | null, max?: number | null) => {
    if (!min && !max) return '-'
    if (!min) return `${max?.toLocaleString()}만원 이하`
    if (!max) return `${min?.toLocaleString()}만원 이상`
    return `${min?.toLocaleString()}만원 ~ ${max?.toLocaleString()}만원`
  }

  const getStatusBadge = (posting: any) => {
    const isActive = posting.is_active !== false
    const deadline = posting.application_deadline
    const now = new Date()
    const deadlineDate = deadline ? new Date(deadline) : null
    
    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">마감</span>
    }
    
    if (deadlineDate && deadlineDate < now) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">마감</span>
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">진행중</span>
  }

  const isPostingActive = (posting: any) => {
    const active = posting.is_active !== false
    const deadline = posting.application_deadline
    const now = new Date()
    const deadlineDate = deadline ? new Date(deadline) : null
    if (!active) return false
    if (deadlineDate && deadlineDate < now) return false
    return true
  }

  const hasApplied = (posting: any) => {
    const id = posting?.id || posting?.job_postings_id
    if (!id) return false
    return appliedPostingIds.has(String(id))
  }

  const handleApply = (posting: any) => {
    if (!isJobSeeker) return
    const confirmed = window.confirm('해당 공고에 지원하시겠습니까? Verifit 이력서로 지원 및 서류/1차면접이 이루어집니다.')
    if (!confirmed) return
    const jobPostingId = posting.id || posting.job_postings_id
    const applicantId = jobSeekerId || ''
    if (!jobPostingId || !applicantId) {
      alert('필수 정보가 부족합니다. 다시 시도해주세요.')
      return
    }
    ;(async () => {
      try {
        const resp = await api.applications.create(jobPostingId, applicantId)
        try {
          console.log('🛰️ POST /applications 응답 원본:', JSON.parse(JSON.stringify(resp)))
        } catch (_) {}
        // 200 OK 가정
        alert('지원이 완료되었습니다.')
        setAppliedPostingIds((prev) => {
          const next = new Set(prev)
          next.add(String(jobPostingId))
          return next
        })
        // 선택: 대시보드로 이동하거나 현재 페이지 유지
        // router.push('/applicant/dashboard')
      } catch (e) {
        try {
          console.error('❌ 지원 생성 실패:', e)
        } catch(_) {}
        alert('지원 처리 중 오류가 발생했습니다.')
      }
    })()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">채용공고를 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">전체 채용공고</h1>
          <p className="text-gray-600">모든 회사의 채용공고를 확인하세요</p>
        </div>

        {/* 필터 옵션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium text-gray-900">필터 옵션</h2>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeClosed"
                checked={includeClosed}
                onChange={(e) => setIncludeClosed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeClosed" className="text-sm font-medium text-gray-700">
                마감된 공고 포함
              </label>
            </div>
          </div>
        </div>

        {/* 공고 목록 */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              채용공고 목록 ({jobPostings.length}개)
            </h3>
          </div>
          
          {jobPostings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500 text-lg">등록된 채용공고가 없습니다.</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobPostings.map((posting) => (
                <div key={posting.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {posting.title}
                        </h4>
                        {getStatusBadge(posting)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="font-medium text-blue-600">
                          {posting.company_name || posting.company?.company_name || '회사명 없음'}
                        </span>
                        <span>•</span>
                        <span>{mapPositionLevel(posting.position_level)}</span>
                        <span>•</span>
                        <span>{mapEmploymentType(posting.employment_type)}</span>
                        <span>•</span>
                        <span>{posting.location || '근무지 미정'}</span>
                        <span>•</span>
                        <span>{formatSalaryRange(posting.salary_min, posting.salary_max)}</span>
                      </div>
                      
                      {posting.main_tasks && (
                        <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                          {posting.main_tasks}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>등록일: {formatDate(posting.created_at)}</span>
                        {posting.application_deadline && (
                          <span>마감일: {formatDate(posting.application_deadline)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button
                        onClick={() => openDetail(posting)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        상세보기
                      </button>
                    {isJobSeeker && isPostingActive(posting) && (
                      hasApplied(posting) ? (
                        <button
                          disabled
                          className="ml-2 px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded-md cursor-not-allowed"
                        >
                          지원완료
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(posting)}
                          className="ml-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                          지원하기
                        </button>
                      )
                    )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 상세보기 모달 */}
      {isDetailOpen && selectedPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeDetail}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
              <h2 className="text-xl font-bold text-black">📋 {selectedPosting.title}</h2>
              <button onClick={closeDetail} className="text-gray-600 hover:text-black text-2xl leading-none">×</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 rounded-b-xl">
              
              {detailLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">상세 정보를 불러오는 중...</div>
                </div>
              ) : detailError ? (
                <div className="mb-4 text-sm text-red-600">{detailError}</div>
              ) : (
                <JobPostingDetail posting={selectedPosting} />
              )}
              {!detailLoading && !detailError && isJobSeeker && selectedPosting && isPostingActive(selectedPosting) && (
                <div className="mt-4 flex justify-end">
                  {hasApplied(selectedPosting) ? (
                    <button
                      disabled
                      className="px-5 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded-md cursor-not-allowed"
                    >
                      지원완료
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(selectedPosting)}
                      className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      지원하기
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
