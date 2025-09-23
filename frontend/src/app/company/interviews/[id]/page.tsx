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
  const [evalStatus, setEvalStatus] = useState<'ready' | 'ing' | 'done' | 'finish'>('ready')
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

        // 공고 제목 및 평가 상태 조회
        try {
          const detailResp = await api.company.getJobPosting(routeId)
          const detail = (detailResp as any)?.data ?? detailResp
          if (detail?.title) setJobTitle(detail.title)
          if (detail?.eval_status) setEvalStatus(detail.eval_status)
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

    // eval_status가 'ing'인 동안 폴링하여 진행상태/목록 자동 갱신
    let interval: any
    const startPolling = () => {
      if (interval) return
      interval = setInterval(async () => {
        try {
          const resp = await api.company.getInterviewStatus(routeId)
          const normalized = resp?.data ?? resp
          setData(normalized)
          const latestEval = (normalized?.job_posting?.eval_status) || (normalized?.eval_status)
          if (latestEval) {
            setEvalStatus(latestEval)
          }
          // 완료되면 폴링 중단
          if (latestEval === 'finish' || latestEval === 'done') {
            clearInterval(interval)
            interval = null
          }
        } catch (_) {}
      }, 5000)
    }

    if (evalStatus === 'ing') {
      startPolling()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [routeId, router, evalStatus])

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

        {/* 지원자 순위 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">지원자 목록</h2>
            {evalStatus === 'ready' ? (
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                onClick={async () => {
                  const confirmed = window.confirm('평가를 시작하시겠습니까?')
                  if (confirmed) {
                    try {
                      console.log('AI 평가 시작 요청:', routeId)
                      // 낙관적 업데이트: 즉시 상태 전환 및 알림
                      setEvalStatus('ing')
                      alert('평가를 시작했습니다.')
                      // 비동기 요청은 백그라운드로 진행
                      const response = await api.company.startEvaluation(routeId)
                      console.log('AI 평가 시작 응답:', response)
                      // 응답에 상태가 포함되면 반영 (finish/done 등)
                      if (response?.eval_status) {
                        setEvalStatus(response.eval_status)
                      }
                    } catch (error) {
                      console.error('평가 시작 실패:', error)
                      alert('평가 시작에 실패했습니다.')
                    }
                  }
                }}
              >
                평가시작
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm text-gray-600">정렬:</label>
                <select
                  id="sort-select"
                  value={`${sortKey}-${sortDir}`}
                  onChange={(e) => {
                    const [key, dir] = e.target.value.split('-')
                    setSortKey(key as 'total_score' | 'hard_score' | 'soft_score' | 'applied_at')
                    setSortDir(dir as 'asc' | 'desc')
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="total_score-desc">총점 높은순</option>
                  <option value="hard_score-desc">하드스킬 점수 높은순</option>
                  <option value="soft_score-desc">소프트스킬 점수 높은순</option>
                  <option value="applied_at-desc">지원일 최신순</option>
                  <option value="applied_at-asc">지원일 오래된순</option>
                </select>
              </div>
            )}
          </div>

          {sortedApps.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-600">지원 내역이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0" style={{ borderCollapse: 'separate' }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16 border-r border-dashed border-gray-300">No.</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-r border-dashed border-gray-300">지원자</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-dashed border-gray-300">경력</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-r border-dashed border-gray-300" onClick={() => handleSort('hard_score')}>하드스킬</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-r border-dashed border-gray-300" onClick={() => handleSort('soft_score')}>소프트스킬</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-r border-dashed border-gray-300" onClick={() => handleSort('total_score')}>총점</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-80 border-r border-dashed border-gray-300">AI총평</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">개별 리포트</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedApps.map((app: any, index: number) => {
                    const hard = app.hard_score ?? app.hard ?? null
                    const soft = app.soft_score ?? app.soft ?? null
                    const total = app.total_score ?? app.total ?? (typeof hard === 'number' && typeof soft === 'number' ? (hard + soft) / 2 : null)
                    const rank = index + 1
                    const getRankBadge = (rank: number) => {
                      if (evalStatus === 'ready') {
                        return <span className="text-sm text-gray-900">{rank}</span>
                      }
                      
                      if (rank === 1) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">🥇 {rank}</span>
                      if (rank === 2) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">🥈 {rank}</span>
                      if (rank === 3) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">🥉 {rank}</span>
                      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{rank}</span>
                    }
                    return (
                      <tr key={app.applications_id || app.id} className={rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""}>
                        <td className="px-3 py-4 whitespace-nowrap text-center border-r border-dashed border-gray-300">
                          {getRankBadge(rank)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center border-r border-dashed border-gray-300">
                           <div className="text-sm font-medium text-gray-900">{app.candidate_name || app.user_name || app.user_id}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-dashed border-gray-300">
                          {app.experience_years ? `${app.experience_years}년` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-dashed border-gray-300">{hard ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center border-r border-dashed border-gray-300">{soft ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-center border-r border-dashed border-gray-300">{total ?? '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-left border-r border-dashed border-gray-300">
                          <div className="break-words" title={app.ai_summary || app.summary || ''}>
                            {app.ai_summary || app.summary || '-'}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                          {app.evaluated_at ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                평가 완료
                              </span>
                              <Link href={`/company/interviews/report/${app.applications_id}`} className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700">개별 리포트</Link>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${evalStatus === 'ing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {evalStatus === 'ing' ? '평가 중' : '평가 대기'}
                            </span>
                          )}
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


