'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { api } from '@/lib/api'
import { logout } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

export default function CompanyDashboard() {
  const [jobPostings, setJobPostings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<any | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  useEffect(() => {
    const userType = localStorage.getItem('userType')
    
    if (userType !== 'company') {
      router.push('/login')
      return
    }

    fetchJobPostings()
  }, [router])

  const fetchJobPostings = async () => {
    try {
      const postings = await api.company.getJobPostings()
      try {
        console.log('🛰️ GET /job-postings 응답 원본:', JSON.parse(JSON.stringify(postings)))
      } catch (_) {}
      const normalized = Array.isArray(postings)
        ? postings
        : Array.isArray((postings as any)?.data)
          ? (postings as any).data
          : Array.isArray((postings as any)?.job_postings)
            ? (postings as any).job_postings
            : []
      try {
        console.log('🧰 정규화된 목록:', JSON.parse(JSON.stringify(normalized)))
      } catch (_) {}
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
      try {
        console.log('🛰️ GET /job-postings/{id} 응답 원본:', JSON.parse(JSON.stringify(resp)))
      } catch (_) {}
      const data = (resp as any)?.data ?? resp
      try {
        console.log('🧰 상세 정규화 데이터:', JSON.parse(JSON.stringify(data)))
      } catch (_) {}
      // 평가 기준 정규화: ai_criteria 또는 evaluation_criteria 사용
      const aiCriteria = (data as any)?.ai_criteria || (data as any)?.evaluation_criteria || null
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
    const hasMin = typeof min === 'number'
    const hasMax = typeof max === 'number'
    if (!hasMin && !hasMax) return '-'
    const fmt = (n: number) => `${n.toLocaleString()}만원`
    if (hasMin && hasMax) return `${fmt(min as number)} ~ ${fmt(max as number)}`
    if (hasMin) return `${fmt(min as number)} ~ -`
    return `- ~ ${fmt(max as number)}`
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
      <Header rightVariant="company" onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">채용 관리</h1>
              <p className="mt-2 text-gray-600">채용공고를 관리하고 지원자를 평가하세요.</p>
            </div>
            <Link
              href="/company/job-postings/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              새 채용공고 작성
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 공고</p>
                <p className="text-2xl font-semibold text-gray-900">{jobPostings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">진행중 공고</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobPostings.filter(p => p.is_active === true).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">마감된 공고</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobPostings.filter(p => p.is_active === false).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 채용공고 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">채용공고 목록</h2>
          </div>
          
          {jobPostings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">채용공고가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">새로운 채용공고를 작성해보세요.</p>
              <div className="mt-6">
                <Link
                  href="/company/job-postings/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  채용공고 작성
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobPostings.map((posting) => (
                <div key={posting.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{posting.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
                        <span className="inline-flex items-center">
                          <span className="text-gray-500 mr-1">고용형태</span>
                          <span className="font-medium">{mapEmploymentType(posting.employment_type)}</span>
                        </span>
                        <span className="inline-flex items-center">
                          <span className="text-gray-500 mr-1">경력</span>
                          <span className="font-medium">{mapPositionLevel(posting.position_level)}</span>
                        </span>
                        <span className="inline-flex items-center">
                          <span className="text-gray-500 mr-1">급여</span>
                          <span className="font-medium">{formatSalaryRange(posting.salary_min, posting.salary_max)}</span>
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          posting.is_active === true 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {posting.is_active === true ? '진행중' : '마감'}
                        </span>
                      </div>
                      {/* main_tasks 요약은 목록에서 비표시 */}
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>작성일: {formatDate(posting.created_at)}</span>
                        {posting.application_deadline && (
                          <span>마감일: {formatDate(posting.application_deadline)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openDetail(posting)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        상세보기
                      </button>
                      <Link
                        href={`/company/interviews/${posting.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        채용현황
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 상세 모달 */}
      {isDetailOpen && selectedPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeDetail}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-black">📋 {selectedPosting.title}</h2>
              <button onClick={closeDetail} className="text-gray-600 hover:text-black text-2xl leading-none">×</button>
            </div>
            <div className="p-6">
              {detailLoading && (
                <div className="mb-4 text-sm text-gray-600">상세 정보를 불러오는 중...</div>
              )}
              {detailError && (
                <div className="mb-4 text-sm text-red-600">{detailError}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">포지션명</label>
                  <input readOnly className="border rounded px-3 py-2 text-black bg-gray-50" value={selectedPosting.title || ''} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">근무 형태</label>
                  <input readOnly className="border rounded px-3 py-2 text-black bg-gray-50" value={(selectedPosting.employment_type === 'full_time' ? '정규직' : selectedPosting.employment_type === 'part_time' ? '파트타임' : selectedPosting.employment_type === 'contract' ? '계약직' : selectedPosting.employment_type === 'internship' ? '인턴' : (selectedPosting.employment_type || '-'))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">연봉(최소)</label>
                  <input readOnly className="border rounded px-3 py-2 text-black bg-gray-50" value={typeof selectedPosting.salary_min === 'number' ? selectedPosting.salary_min : (selectedPosting.salary_min || '-') } />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">연봉(최대)</label>
                  <input readOnly className="border rounded px-3 py-2 text-black bg-gray-50" value={typeof selectedPosting.salary_max === 'number' ? selectedPosting.salary_max : (selectedPosting.salary_max || '-') } />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">공고 마감일</label>
                  <input readOnly className="border rounded px-3 py-2 text-black bg-gray-50" value={selectedPosting.application_deadline ? new Date(selectedPosting.application_deadline).toLocaleDateString() : '-'} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">근무지</label>
                  <input readOnly className="border rounded px-3 py-2 text-black bg-gray-50" value={selectedPosting.location || '-'} />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-1">주요 업무</label>
                  <textarea readOnly className="border rounded px-3 py-2 min-h-32 text-black bg-gray-50" value={selectedPosting.main_tasks || ''} />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-1">자격 요건</label>
                  <textarea readOnly className="border rounded px-3 py-2 min-h-32 text-black bg-gray-50" value={(Array.isArray(selectedPosting.requirements) ? selectedPosting.requirements.join('\n') : (selectedPosting.requirements || ''))} />
                </div>
                {selectedPosting.preferred && (
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-medium text-gray-600 mb-1">우대사항</label>
                    <textarea readOnly className="border rounded px-3 py-2 min-h-24 text-black bg-gray-50" value={selectedPosting.preferred || ''} />
                  </div>
                )}
                {((selectedPosting.ai_criteria && (selectedPosting.ai_criteria.hard_skills || selectedPosting.ai_criteria.soft_skills)) || selectedPosting.evaluation_criteria) && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-black mb-2">🤖 면접관AI 평가 기준</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">💻 하드 스킬</div>
                        <div className="text-black text-sm">
                          {(
                            (selectedPosting.ai_criteria?.hard_skills) ||
                            (selectedPosting.evaluation_criteria?.hard_skills) ||
                            []
                          ).join(', ')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">🎭 소프트 스킬</div>
                        <div className="text-black text-sm">
                          {(
                            (selectedPosting.ai_criteria?.soft_skills) ||
                            (selectedPosting.evaluation_criteria?.soft_skills) ||
                            []
                          ).join(', ')}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">설정값은 공고 등록 시 확정되며, 이 화면에서는 변경할 수 없습니다.</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={closeDetail} className="px-5 py-2 rounded bg-gray-200 text-black hover:bg-gray-300">닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
