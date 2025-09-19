'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { logout } from '@/lib/auth'
import Link from 'next/link'
import { api, getApiBaseUrl } from '@/lib/api'

export default function InterviewStatusPage() {
  const params = useParams()
  const router = useRouter()
  const routeId = (params?.id as string) || ''

  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortKey, setSortKey] = useState<'total_score' | 'hard_score' | 'soft_score' | 'applied_at'>('total_score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [jobTitle, setJobTitle] = useState<string>('')
  const handleLogout = () => logout('/')

  useEffect(() => {
    const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null
    if (userType !== 'company') {
      router.push('/login')
      return
    }
    if (!routeId) return

    const fetchStatus = async () => {
      try {
        setLoading(true)
        setError('')
        const baseUrl = getApiBaseUrl()
        const tokenExists = !!localStorage.getItem('token')

        // 공고 제목 조회 (표시용)
        try {
          const detailResp = await api.company.getJobPosting(routeId)
          const detail = (detailResp as any)?.data ?? detailResp
          if (detail?.title) setJobTitle(detail.title)
        } catch (_) {}

        // UUID 라우트 파라미터를 그대로 사용
        const requestUrl = `${baseUrl}/interviews/${routeId}`
        console.log('📡 채용현황 요청', {
          method: 'GET',
          url: requestUrl,
          headers: {
            Authorization: tokenExists ? 'Bearer <redacted>' : '없음',
            'Content-Type': 'application/json',
          },
        })

        const resp = await api.company.getInterviewStatus(routeId)
        const normalized = resp?.data ?? resp
        console.log('✅ 채용현황 응답', {
          ok: true,
          url: requestUrl,
          payloadPreview: (() => {
            try { return JSON.parse(JSON.stringify(normalized)) } catch { return normalized }
          })(),
        })
        setData(normalized)
      } catch (e: any) {
        const status = e?.response?.status
        const respData = e?.response?.data
        const baseUrl = getApiBaseUrl()
        const requestUrl = '(동적 계산됨)'
        console.error('❌ 채용현황 요청 실패', {
          url: requestUrl,
          status,
          response: respData,
          message: e?.message,
        })
        setError(e?.response?.data?.message || `채용현황을 불러오지 못했습니다. (status: ${status ?? 'unknown'})`)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [routeId, router])

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
      <div className="min-h-screen bg-gray-50">
        <Header rightVariant="company" onLogout={handleLogout} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900">채용현황</h1>
            <p className="mt-2 text-red-600">{error}</p>
            <div className="mt-6 flex gap-3">
              <Link href="/company/dashboard" className="px-4 py-2 rounded bg-gray-200 text-gray-900 hover:bg-gray-300">← 대시보드로</Link>
              <button onClick={() => router.refresh()} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">다시 시도</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const applications: any[] = Array.isArray((data as any)?.applications)
    ? (data as any).applications
    : Array.isArray(data)
      ? (data as any)
      : []

  const overall = (data as any)?.ai_overall_report || (data as any)?.overall || null
  const jobPosting = (data as any)?.job_posting || null
  const hardSkills: any[] = Array.isArray(jobPosting?.hard_skills) ? jobPosting.hard_skills : []
  const softSkills: any[] = Array.isArray(jobPosting?.soft_skills) ? jobPosting.soft_skills : []
  const overallReview: string = (overall?.overall_review ?? '') as string

  const sortedApps = [...applications].sort((a, b) => {
    const getNum = (v: any, key: string) => {
      const raw = v?.[key]
      if (raw === null || raw === undefined) return Number.NaN
      const n = typeof raw === 'number' ? raw : parseFloat(String(raw))
      return Number.isNaN(n) ? Number.NaN : n
    }
    const getTime = (v: any) => (v?.applied_at ? new Date(v.applied_at).getTime() : 0)
    let av = 0, bv = 0
    if (sortKey === 'applied_at') {
      av = getTime(a)
      bv = getTime(b)
    } else {
      av = getNum(a, sortKey)
      bv = getNum(b, sortKey)
    }
    if (Number.isNaN(av) && Number.isNaN(bv)) return 0
    if (Number.isNaN(av)) return 1
    if (Number.isNaN(bv)) return -1
    return sortDir === 'asc' ? av - bv : bv - av
  })

  const handleSort = (key: 'total_score' | 'hard_score' | 'soft_score' | 'applied_at') => {
    setSortKey((prev) => (prev === key ? prev : key))
    setSortDir((prev) => (sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header rightVariant="company" onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">채용현황</h1>
            <p className="text-gray-600 mt-1">공고: {jobTitle || '제목 불러오는 중...'}</p>
          </div>
          <Link href="/company/dashboard" className="px-4 py-2 rounded bg-gray-200 text-gray-900 hover:bg-gray-300">← 대시보드</Link>
        </div>

        {overall && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">총 지원자 수</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{overall.total_applications ?? '-'}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">AI 평가 완료</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{overall.ai_evaluated_count ?? '-'}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">AI 추천 수</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{overall.ai_recommended_count ?? '-'}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">지원자 목록</h2>
          </div>

          {sortedApps.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-600">지원 내역이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원자</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('hard_score')}>하드점수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('soft_score')}>소프트점수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('total_score')}>총점</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('applied_at')}>지원일</th>
                    <th className="px-6 py-3"/>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedApps.map((app: any) => {
                    const hard = app.hard_score ?? app.hard ?? null
                    const soft = app.soft_score ?? app.soft ?? null
                    const total = app.total_score ?? app.total ?? (typeof hard === 'number' && typeof soft === 'number' ? (hard + soft) / 2 : null)
                    return (
                      <tr key={app.applications_id || app.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{app.candidate_name || app.user_name || app.user_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hard ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{soft ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{total ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applied_at ? new Date(app.applied_at).toLocaleString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center gap-2 justify-end">
                            <Link href={`/company/interviews/${app.applications_id || app.id}/report`} className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">개별 리포트</Link>
                            <Link href={`/company/interviews/conversations/${app.applications_id || app.id}`} className="px-3 py-2 rounded bg-gray-200 text-gray-900 text-sm hover:bg-gray-300">대화 보기</Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {(hardSkills.length > 0 || softSkills.length > 0) && (
          <div className="mt-8 space-y-8">
            {hardSkills.length > 0 && (
              <div className="evaluation-section hard">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💻 하드 스킬 평가 항목</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hardSkills.map((item: any, idx: number) => (
                    <div key={`hard-${idx}`} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
                      <div className="text-blue-700 font-semibold mb-1">{item?.title || item?.name || String(item)}</div>
                      {item?.description && (
                        <p className="text-gray-700 text-sm" style={{ textAlign: 'left', wordBreak: 'keep-all', whiteSpace: 'normal' }}>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {softSkills.length > 0 && (
              <div className="evaluation-section soft">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎭 소프트 스킬 평가 항목</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {softSkills.map((item: any, idx: number) => (
                    <div key={`soft-${idx}`} className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                      <div className="text-orange-700 font-semibold mb-1">{item?.title || item?.name || String(item)}</div>
                      {item?.description && (
                        <p className="text-gray-700 text-sm" style={{ textAlign: 'left', wordBreak: 'keep-all', whiteSpace: 'normal' }}>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-10">
          <div className="ai-overview-section bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">🤖 AI면접관 총평</h3>
            <p className="text-gray-800 leading-7" style={{ textAlign: 'left', wordBreak: 'keep-all', whiteSpace: 'normal' }}>
              {overallReview && overallReview.trim().length > 0 ? overallReview : '아직 평가 전입니다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


