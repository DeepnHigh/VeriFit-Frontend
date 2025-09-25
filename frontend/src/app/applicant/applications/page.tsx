"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import JobPostingDetail from '@/components/JobPostingDetail'
import { logout } from '@/lib/auth'
import { api } from '@/lib/api'

interface ApplicationItem {
  applications_id: string
  job_posting_id: string
  job_title: string
  company_name?: string
  applied_at?: string
  status?: string
}

interface JobPostingDetailData {
  id?: string
  title?: string
  company_name?: string
  location?: string
  employment_type?: string
  position_level?: string
  salary_min?: number
  salary_max?: number
  main_tasks?: string
  requirements?: string
  preferred_qualifications?: string
  description?: string
  created_at?: string
  application_deadline?: string | null
}

export default function ApplicantApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState<ApplicationItem[]>([])
  const handleLogout = () => logout('/')

  // 상세보기 모달 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<JobPostingDetailData | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const openDetail = async (job_posting_id: string) => {
    if (!job_posting_id) return
    try {
      setIsDetailOpen(true)
      setDetailLoading(true)
      setDetailError('')
      setSelectedPosting(null)
      const resp = await api.company.getJobPosting(job_posting_id)
      const data = (resp as any)?.data ?? resp
      try {
        console.log('🛰️ GET /job-postings/{id} 응답 원본:', JSON.parse(JSON.stringify(resp)))
        console.log('🧰 상세 정규화 데이터:', JSON.parse(JSON.stringify(data)))
      } catch (_) {}
      const aiCriteria = (data as any)?.ai_criteria || (data as any)?.evaluation_criteria || null
      try {
        console.log('🔎 평가 기준 필드:', JSON.parse(JSON.stringify(aiCriteria)))
      } catch (_) {}
      setSelectedPosting({ ...(data as any), ai_criteria: aiCriteria })
    } catch (e: any) {
      setDetailError(e?.response?.data?.message || '상세 정보를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setSelectedPosting(null)
    setDetailError('')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        if (!userId) {
          setError('로그인이 필요합니다.')
          return
        }

        // 백엔드에서 응답 형식은 이후 맞춰질 예정
        // 임시로 company.public.getAllJobPostings 와 applications.listByJobSeeker 등을 혼합하거나
        // 향후 전용 API에 맞춰 수정 예정
        const resp = await api.applications.listByJobSeeker(userId)
        const list = (resp?.data ?? resp) || []
        const normalized: ApplicationItem[] = list.map((it: any) => ({
          applications_id: it.applications_id || it.id || '',
          job_posting_id: it.job_posting_id || it.job_postings_id || '',
          job_title: it.job_title || it.title || '제목 미상',
          company_name: it.company_name || it.company || undefined,
          applied_at: it.applied_at || it.created_at || it.appliedAt,
          status: it.status || it.application_status || undefined,
        }))
        setItems(normalized)
      } catch (e: any) {
        setError(e?.response?.data?.message || '신청한 공고 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header rightVariant="applicant" onLogout={handleLogout} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">📋 내가 지원한 공고</h1>
            <p className="text-sm text-black">지원 이력을 확인할 수 있습니다.</p>
          </div>
          <Link href="/applicant/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">← 대시보드</Link>
        </div>

        {loading && (
          <div className="p-6 bg-white rounded-lg border text-black">불러오는 중...</div>
        )}

        {!loading && error && (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl border">
            {items.length === 0 ? (
              <div className="p-8 text-center text-gray-600">지원한 공고가 없습니다.</div>
            ) : (
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">공고명</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">회사</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">지원일</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">AI 평가</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">공고</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((it) => {
                    const status = (it.status || '').toString().toLowerCase()
                    let badgeText = '평가 대기'
                    let badgeClass = 'bg-yellow-100 text-yellow-800'
                    if (status === 'ai_evaluated') {
                      badgeText = '평가 완료'
                      badgeClass = 'bg-green-100 text-green-800'
                    } else if (status === 'ing' || status === 'evaluating' || status === 'in_progress') {
                      badgeText = '평가 중'
                      badgeClass = 'bg-blue-100 text-blue-800'
                    }
                    return (
                      <tr key={it.applications_id || it.job_posting_id}>
                        <td className="px-4 py-3 text-center text-sm text-black">{it.job_title}</td>
                        <td className="px-4 py-3 text-center text-sm text-black">{it.company_name || '-'}</td>
                        <td className="px-4 py-3 text-center text-sm text-black">{it.applied_at ? new Date(it.applied_at).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3 text-center text-sm text-black">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>{badgeText}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <button
                            onClick={() => openDetail(it.job_posting_id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                          >
                            공고보기
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
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
                {detailLoading && (
                  <div className="mb-4 text-sm text-gray-600">상세 정보를 불러오는 중...</div>
                )}
                {detailError && (
                  <div className="mb-4 text-sm text-red-600">{detailError}</div>
                )}
                <JobPostingDetail posting={selectedPosting as any} />
                <div className="mt-6 flex justify-end flex-shrink-0">
                  <button onClick={closeDetail} className="px-5 py-2 rounded bg-gray-200 text-black hover:bg-gray-300">닫기</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


