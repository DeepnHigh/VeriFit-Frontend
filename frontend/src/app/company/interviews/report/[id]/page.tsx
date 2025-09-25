"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import Header from "@/components/Header"
import { logout } from "@/lib/auth"

type ApplicantProfile = any
type IndividualReport = any

export default function IndividualReportPage() {
  const params = useParams()
  const router = useRouter()
  const applicationsId = String(params?.id || "")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const [profile, setProfile] = useState<ApplicantProfile | null>(null)
  const [report, setReport] = useState<IndividualReport | null>(null)
  const [showHighlightsModal, setShowHighlightsModal] = useState<boolean>(false)

  const handleLogout = () => logout('/')

  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      if (!applicationsId) return
      try {
        setLoading(true)
        setError("")

        const reportRes = await api.company.getIndividualReport(applicationsId)
        if (cancelled) return
        if (reportRes) {
          const normalized = (reportRes as any)?.data ?? reportRes
          console.log('🔍 개별 리포트 백엔드 응답:', JSON.stringify(normalized, null, 2))
          setReport(normalized)
          const inferredProfile =
            (normalized as any)?.profile ||
            (normalized as any)?.applicant_profile ||
            (normalized as any)?.applicant ||
            (normalized as any)?.user ||
            // 최소 응답일 때 full_name만 있어도 profile처럼 사용
            (('full_name' in (normalized as any) || 'name' in (normalized as any)) ? normalized : null)
          if (inferredProfile) setProfile(inferredProfile)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "데이터를 불러오지 못했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => {
      cancelled = true
    }
  }, [applicationsId])

  const hard = useMemo(() => {
    const r: any = report
    return r?.hard_score ?? r?.ai_evaluation?.hard_score ?? r?.hard ?? null
  }, [report])

  const soft = useMemo(() => {
    const r: any = report
    return r?.soft_score ?? r?.ai_evaluation?.soft_score ?? r?.soft ?? null
  }, [report])

  const total = useMemo(() => {
    const r: any = report
    return r?.ai_overall_report?.total_score ?? r?.total_score ?? r?.ai_evaluation?.total_score ?? r?.total ?? (typeof hard === 'number' && typeof soft === 'number' ? (hard + soft) / 2 : null)
  }, [report, hard, soft])

  const candidateName = useMemo(() => {
    const p: any = profile
    const fromReport = (report as any)?.candidate_name || (report as any)?.user_name || (report as any)?.full_name || (report as any)?.name
    return fromReport || p?.full_name || p?.name || p?.user_name || p?.applicant_name || "지원자"
  }, [profile, report])

  const aiSummary = useMemo(() => {
    const r: any = report
    return r?.ai_summary ?? r?.ai_evaluation?.ai_summary ?? ''
  }, [report])

  const interviewHighlights = useMemo(() => {
    const r: any = report
    // backend may return highlight text in several places
    const h = r?.interview_highlights ?? r?.ai_evaluation?.highlight ?? r?.highlight ?? null
    if (!h) return null
    // normalize arrays -> string
    if (Array.isArray(h)) return h.join('\n---\n')
    return String(h)
  }, [report])

  const highlightReason = useMemo(() => {
    const r: any = report
    return r?.ai_evaluation?.highlight_reason ?? r?.highlight_reason ?? null
  }, [report])

  const jobPostingsId = useMemo(() => {
    const r: any = report
    return (
      r?.job_posting?.id ||
      r?.job_posting?.job_postings_id ||
      r?.job_postings_id ||
      r?.job_posting_id ||
      null
    )
  }, [report])

  const isLongHighlights = useMemo(() => {
    if (!interviewHighlights) return false
    // 길이 기준 또는 줄 수 기준으로 긴 텍스트 판별
    const lengthLong = interviewHighlights.length > 300
    const lineLong = interviewHighlights.split('\n').length > 8
    return lengthLong || lineLong
  }, [interviewHighlights])

  return (
    <div className="min-h-screen bg-white">
      <Header rightVariant="company" onLogout={handleLogout} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">🤖 개별 지원자 평가 리포트</h1>
            <p className="text-black text-sm">{candidateName}의 상세 평가 결과</p>
          </div>
          <Link 
            href={jobPostingsId ? `/company/interviews/${jobPostingsId}` : '/company/dashboard'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            ← 채용현황
          </Link>
        </div>

        {loading && (
          <div className="p-6 bg-white rounded-lg border text-black">불러오는 중...</div>
        )}

        {!loading && error && (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* 헤더: 지원자 기본 정보 + 점수 배지 */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg font-bold">
                    {String(candidateName).charAt(0) || ""}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">{candidateName}</h3>
                    <p className="text-sm text-black">지원자 프로필</p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold">
                  종합 점수: {typeof total === 'number' ? total.toFixed(1) : '-'}
                </div>
              </div>

              {/* 핵심 점수 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border p-4 bg-blue-50">
                  <h4 className="font-semibold mb-1 text-black">💻 하드 스킬</h4>
                  <div className="text-2xl font-bold text-blue-700">{typeof hard === 'number' ? hard.toFixed(1) : '-'}</div>
                  <div className="text-xs text-blue-700/80">기술 역량 평가</div>
                </div>
                <div className="rounded-xl border p-4 bg-amber-50">
                  <h4 className="font-semibold mb-1 text-black">🎭 소프트 스킬</h4>
                  <div className="text-2xl font-bold text-amber-700">{typeof soft === 'number' ? soft.toFixed(1) : '-'}</div>
                  <div className="text-xs text-amber-700/80">시뮬레이션 평가</div>
                </div>
                <div className="rounded-xl border p-4 bg-purple-50">
                  <h4 className="font-semibold mb-1 text-black">🏆 종합 평가</h4>
                  <div className="text-2xl font-bold text-purple-700">{typeof total === 'number' ? total.toFixed(1) : '-'}</div>
                  <div className="text-xs text-purple-700/80">AI 종합 점수</div>
                </div>
              </div>

              {/* 상세 분석 영역 (동일 컨테이너 내부) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* 하드 스킬 상세 분석 */}
                <div className="rounded-lg border p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4 text-black">💻 하드 스킬 상세 분석</h3>
                  {renderSkillsTable(
                    (report as any)?.hard_skills,
                    (report as any)?.ai_evaluation?.hard_detail_scores ?? (report as any)?.hard_detail_scores
                  )}
                </div>

                {/* 소프트 스킬 상세 분석 */}
                <div className="rounded-lg border p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4 text-black">🎭 소프트 스킬 상세 분석</h3>
                  {renderSkillsTable(
                    (report as any)?.soft_skills,
                    (report as any)?.ai_evaluation?.soft_detail_scores ?? (report as any)?.soft_detail_scores
                  )}
                </div>
              </div>

              {/* AI 요약 */}
              {aiSummary && (
                <div className="mt-6 rounded-lg border p-4 bg-green-50">
                  <h4 className="font-semibold mb-2 text-green-700">📝 AI 요약</h4>
                  <p className="text-black text-sm whitespace-pre-wrap break-words">{aiSummary}</p>
                </div>
              )}
            </div>


            {/* AI 면접 대화 하이라이트 */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2 text-black">🤖 AI 면접 대화 하이라이트</h3>
              {interviewHighlights ? (
                <div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-700 font-medium mb-1">하이라이트</div>
                    <div className={`whitespace-pre-wrap break-words bg-gray-50 p-3 rounded text-black text-sm ${isLongHighlights ? 'max-h-48 overflow-hidden' : ''}`}>
                      {interviewHighlights}
                    </div>
                    {isLongHighlights && (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
                          onClick={() => setShowHighlightsModal(true)}
                        >
                          전체보기
                        </button>
                      </div>
                    )}
                  </div>
                  {highlightReason && (
                    <p className="text-sm text-gray-500 mt-3">선정 이유: {highlightReason}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">백엔드 데이터 준비 중입니다. 하이라이트가 등록되면 자동으로 표시됩니다.</p>
              )}
            </div>

            {/* 하이라이트 전체보기 모달 */}
            {showHighlightsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowHighlightsModal(false)} />
                <div className="relative bg-white w-full max-w-3xl max-h-[80vh] rounded-lg shadow-lg border mx-4">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h4 className="text-base font-semibold text-black">🤖 AI 면접 대화 하이라이트</h4>
                    <button
                      type="button"
                      className="text-sm text-gray-600 hover:text-gray-800"
                      onClick={() => setShowHighlightsModal(false)}
                    >
                      닫기
                    </button>
                  </div>
                  <div className="p-4 overflow-auto">
                    <div className="text-sm text-gray-700 font-medium mb-2">하이라이트</div>
                    <div className="whitespace-pre-wrap break-words bg-gray-50 p-3 rounded text-black text-sm">
                      {interviewHighlights}
                    </div>
                    {highlightReason && (
                      <p className="text-sm text-gray-500 mt-3">선정 이유: {highlightReason}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 종합 리포트 (틀만 구성) */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-black">📊 종합 리포트</h3>
              {renderSummaryTable(report)}

              {/* AI면접관 최종 의견 */}
              <div className="mt-6 rounded-lg border p-4 bg-purple-50">
                <h4 className="font-semibold mb-2 text-purple-700">🤖 AI면접관 최종 의견</h4>
                <p className="text-black text-sm whitespace-pre-wrap break-words">{(report as any)?.final_opinion || (report as any)?.ai_evaluation?.final_opinion || '최종 의견 데이터가 준비되면 여기에 표시됩니다.'}</p>
              </div>
            </div>

            {/* 하단 액션 버튼 */}
            <div className="pt-2">
              <div className="flex items-center justify-center">
                <Link
                  href={`/company/interviews/profile/${applicationsId}`}
                  className="px-5 py-3 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
                >
                  상세 프로필
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function renderDetailScores(detail: any) {
  if (!detail || typeof detail !== 'object') {
    return <div className="text-sm text-gray-500">상세 점수 데이터가 없습니다.</div>
  }
  const entries = Array.isArray(detail)
    ? detail
    : Object.entries(detail).map(([k, v]) => ({ label: k, value: v }))
  if (!entries || entries.length === 0) {
    return <div className="text-sm text-gray-500">상세 점수 데이터가 없습니다.</div>
  }
  return (
    <div className="divide-y">
      {entries.map((item: any, idx: number) => {
        const label = item?.label ?? item?.name ?? item?.key ?? ''
        const rawValue = item?.value ?? item?.score ?? item?.val
        const value = typeof rawValue === 'number' ? `${rawValue}점` : String(rawValue ?? '')
        return (
          <div key={idx} className="py-2 flex items-center justify-between">
            <span className="text-black font-medium">{label}</span>
            <span className="text-green-700 font-semibold">{value}</span>
          </div>
        )
      })}
    </div>
  )
}

function hasDetailScores(detail: any) {
  if (!detail) return false
  if (Array.isArray(detail)) return detail.length > 0
  if (typeof detail === 'object') return Object.keys(detail).length > 0
  return false
}

function renderSkillsTable(skills: string[], detailScores?: any) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return <div className="text-sm text-gray-500">스킬 데이터가 없습니다.</div>
  }
  // normalize detailScores into a key->value map with lowercased keys
  const map: Record<string, any> = {}
  if (detailScores) {
    if (Array.isArray(detailScores)) {
      // array of {label, value} or {name, score}
      detailScores.forEach((it: any) => {
        const k = (it?.label ?? it?.name ?? it?.key ?? '').toString().trim().toLowerCase()
        if (k) map[k] = it?.value ?? it?.score ?? it?.val ?? it?.score_value ?? null
      })
    } else if (typeof detailScores === 'object') {
      Object.entries(detailScores).forEach(([k, v]) => {
        map[k.toString().trim().toLowerCase()] = v
      })
    }
  }

  const formatValue = (raw: any) => {
    if (raw === null || raw === undefined || raw === '') return '-'
    if (typeof raw === 'number') return `${raw}점`
    // sometimes numeric strings
    const num = Number(String(raw).replace(/[^0-9\.\-]/g, ''))
    if (!isNaN(num)) return `${num}점`
    return String(raw)
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="min-w-full divide-y">
        <tbody className="divide-y">
          {skills.map((skill, idx) => {
            const key = skill.toString().trim().toLowerCase()
            const raw = map[key] ?? map[skill] ?? map[skill.toLowerCase()] ?? null
            const scoreText = formatValue(raw)
            return (
              <tr key={idx}>
                <td className="px-4 py-2 text-black text-sm">{skill}</td>
                <td className="px-4 py-2 text-black text-sm">{scoreText}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function renderSummaryTable(report: any) {
  const rows = [
    {
      key: 'strengths',
      label: '강점',
      content: report?.strengths_content ?? report?.ai_evaluation?.strengths_content,
      opinion: report?.strengths_opinion ?? report?.ai_evaluation?.strengths_opinion,
      evidence: report?.strengths_evidence ?? report?.ai_evaluation?.strengths_evidence,
    },
    {
      key: 'concerns',
      label: '우려사항',
      content: report?.concerns_content ?? report?.ai_evaluation?.concerns_content,
      opinion: report?.concerns_opinion ?? report?.ai_evaluation?.concerns_opinion,
      evidence: report?.concerns_evidence ?? report?.ai_evaluation?.concerns_evidence,
    },
    {
      key: 'followup',
      label: '후속검증 제안',
      content: report?.followup_content ?? report?.ai_evaluation?.followup_content,
      opinion: report?.followup_opinion ?? report?.ai_evaluation?.followup_opinion,
      evidence: report?.followup_evidence ?? report?.ai_evaluation?.followup_evidence,
    },
  ]

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="min-w-full">
        <thead className="bg-indigo-700">
          <tr>
            <th className="px-4 py-3 text-left text-white text-sm font-semibold">분석 항목</th>
            <th className="px-4 py-3 text-left text-white text-sm font-semibold">내용</th>
            <th className="px-4 py-3 text-left text-white text-sm font-semibold">AI면접관 의견</th>
            <th className="px-4 py-3 text-left text-white text-sm font-semibold">근거</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => (
            <tr key={r.key} className="bg-white">
              <td className="px-4 py-3 align-top text-black text-sm font-medium">{r.label}</td>
              <td className="px-4 py-3 align-top text-black text-sm whitespace-pre-wrap break-words">{r.content || '데이터 준비 중'}</td>
              <td className="px-4 py-3 align-top text-black text-sm whitespace-pre-wrap break-words">{r.opinion || '데이터 준비 중'}</td>
              <td className="px-4 py-3 align-top text-black text-sm whitespace-pre-wrap break-words">{r.evidence || '데이터 준비 중'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 적성/행동 요약은 현재 페이지에서 제외됨


