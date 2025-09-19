"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import Header from "@/components/Header"
import { logout } from "@/lib/auth"
import Big5Result from "@/components/Big5Result"
import { 
  createBig5DataFromApi, 
  createBig5ChartDataFromApi, 
} from "../../../../../../data/big5Data"

type ApplicantProfile = any

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const applicationsId = String(params?.id || "")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [profile, setProfile] = useState<ApplicantProfile | null>(null)

  const handleLogout = () => logout('/')

  useEffect(() => {
    let cancelled = false
    const fetchProfile = async () => {
      if (!applicationsId) return
      try {
        setLoading(true)
        setError("")

        const profileRes = await api.company.getApplicantProfile(applicationsId)
        if (cancelled) return
        if (profileRes) {
          const normalized = (profileRes as any)?.data ?? profileRes
          console.log('🔍 상세 프로필 백엔드 응답:', JSON.stringify(normalized, null, 2))
          setProfile(normalized)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "프로필을 불러오지 못했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [applicationsId])

  const candidateName = profile?.full_name || profile?.applicant_info?.full_name || profile?.name || profile?.user_name || profile?.applicant_name || "지원자"

  // 최종학력 표기 변환 맵
  const EDUCATION_LABELS: Record<string, string> = {
    high_school: '고졸',
    associate: '전문학사',
    bachelor: '학사',
    master: '석사',
    phd: '박사',
  }

  const getEducationLabel = (value?: string | null) => {
    if (!value) return '-'
    return EDUCATION_LABELS[value] || value
  }

  // Big5 데이터 처리
  const { big5Data, big5ChartData, hasBig5Data } = useMemo(() => {
    const big5Results = profile?.big5_test_results
    
    if (!big5Results || Object.keys(big5Results).length === 0) {
      return {
        big5Data: [],
        big5ChartData: [],
        hasBig5Data: false
      }
    }

    // API 데이터로 Big5 결과 생성 (임시 직접 처리)
    const scores = big5Results.scores || {}
    const processedBig5Data = [
      {
        label: '개방성',
        score: scores.openness || 0,
        color: '#4CAF50',
        description: '당신의 경험에 대한 개방성 점수는 평균입니다. 이는 당신이 전통을 즐기지만 새로운 것들을 시도할 의향이 있다는 것을 나타냅니다. 당신의 사고는 단순하지도 복잡하지도 않습니다. 다른 사람들에게는 잘 교육받은 사람으로 보이지만 지식인은 아닙니다.'
      },
      {
        label: '성실성', 
        score: scores.conscientiousness || 0,
        color: '#2196F3',
        description: '당신의 성실성 점수는 평균입니다. 이는 당신이 합리적으로 신뢰할 수 있고, 체계적이며, 자기 통제력이 있다는 것을 의미합니다.'
      },
      {
        label: '외향성',
        score: scores.extraversion || 0,
        color: '#FF9800', 
        description: '당신의 외향성 점수는 평균입니다. 이는 당신이 억제된 고독한 사람도 활발한 수다쟁이도 아니라는 것을 나타냅니다. 당신은 다른 사람들과 함께 있는 시간도 즐기지만 혼자 있는 시간도 즐깁니다.'
      },
      {
        label: '우호성',
        score: scores.agreeableness || 0,
        color: '#9C27B0',
        description: '당신의 우호성 수준은 평균입니다. 이는 다른 사람들의 필요에 대한 어느 정도의 관심을 나타내지만, 일반적으로 다른 사람들을 위해 자신을 희생하려고 하지 않는다는 것을 의미합니다.'
      },
      {
        label: '신경성',
        score: scores.neuroticism || 0,
        color: '#F44336',
        description: '당신의 신경증 점수는 평균입니다. 이는 당신의 감정적 반응 수준이 일반 인구의 전형적인 수준임을 의미합니다. 당신은 때때로 스트레스나 좌절감을 느끼고, 이러한 상황들이 어느 정도 불쾌하지만, 일반적으로 이러한 감정을 극복하고 이러한 상황에 대처할 수 있습니다.'
      }
    ]
    
    const processedBig5ChartData = processedBig5Data.map(item => ({
      label: item.label,
      score: item.score,
      color: item.color,
      description: item.description
    }))
    
    return {
      big5Data: processedBig5Data,
      big5ChartData: processedBig5ChartData,
      hasBig5Data: true
    }
  }, [profile])

  // AI 학습 질문 데이터 처리
  const { questions, completedCount, totalCount } = useMemo(() => {
    const ownQnas = profile?.own_qnas || []
    const processedQuestions = ownQnas.map((qna: any, index: number) => ({
      id: qna.answer_id || qna.question_id || `qna-${index}`, // answer_id 우선, 없으면 question_id, 둘 다 없으면 index
      text: qna.question_text,
      status: 'completed' as const,
      answer: qna.answer_text
    }))
    
    return {
      questions: processedQuestions,
      completedCount: processedQuestions.length,
      totalCount: processedQuestions.length
    }
  }, [profile])

  return (
    <div className="min-h-screen bg-white">
      <Header rightVariant="company" onLogout={handleLogout} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">👤 상세 프로필</h1>
            <p className="text-black text-sm">{candidateName}의 상세 프로필 정보</p>
          </div>
          <Link 
            href={`/company/interviews/report/${applicationsId}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            개별 리포트로 돌아가기
          </Link>
        </div>

        {loading && (
          <div className="p-6 bg-white rounded-lg border text-black">불러오는 중...</div>
        )}

        {!loading && error && (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>
        )}

        {!loading && !error && profile && (
          <section>
            {/* 상단 프로필 카드 + 상세 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1 bg-gray-50 rounded-xl p-6 border">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                  {candidateName ? candidateName.charAt(0) : '지'}
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-black mb-1">
                    {candidateName || '지원자'}
                  </div>
                  <div className="text-black mb-4">
                    {profile?.applicant_info?.total_experience_year ? `${profile.applicant_info.total_experience_year}년 경력` : '신입'}
                  </div>
                </div>
                
                {/* 자기소개 (bio) 섹션 */}
                <div className="mt-4 rounded-lg p-4">
                  {profile?.applicant_info?.bio ? (
                    <div className="text-sm text-black leading-relaxed" style={{ wordBreak: 'keep-all', whiteSpace: 'pre-wrap' }}>
                      {profile.applicant_info.bio}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">자기소개가 등록되지 않았습니다.</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 border">
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">📞 연락처</h3>
                  <div className="divide-y text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">이메일</span>
                      <span className="text-black">{profile?.applicant_info?.email || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">전화번호</span>
                      <span className="text-black">{profile?.applicant_info?.phone || '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">🎓 학력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">최종학력</span>
                      <span className="text-black">{getEducationLabel(profile?.applicant_info?.education_level)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">대학교</span>
                      <span className="text-black">{profile?.applicant_info?.university || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">전공</span>
                      <span className="text-black">{profile?.applicant_info?.major || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">졸업년도</span>
                      <span className="text-black">{profile?.applicant_info?.graduation_year || '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-semibold text-black mb-2">💼 경력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">총 경력</span>
                      <span className="text-black">{profile?.applicant_info?.total_experience_year ? `${profile.applicant_info.total_experience_year}년` : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">최근 직장</span>
                      <span className="text-black">{profile?.applicant_info?.company_name || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 포트폴리오 및 자료 섹션 (읽기 전용) */}
            <div className="rounded-xl p-6 border mb-8 bg-white">
              <h3 className="text-black font-semibold mb-4">📁 포트폴리오 및 자료</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">포트폴리오 정보</h4>
                <p className="text-gray-500 mb-6">지원자가 업로드한 포트폴리오와 관련 자료를 확인할 수 있습니다.</p>
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <div className="text-gray-500 text-lg font-medium">포트폴리오 데이터가 없습니다</div>
                  <div className="text-gray-400 text-sm mt-2">백엔드에서 포트폴리오 정보를 제공하면 여기에 표시됩니다.</div>
                </div>
              </div>
            </div>

            {/* Big5 성격검사 결과 (읽기 전용) */}
            <div className="rounded-xl p-6 border mb-8 bg-white">
              <h3 className="text-black font-semibold mb-4">🧠 Big5 성격검사 결과</h3>
              {hasBig5Data ? (
                <Big5Result 
                  big5Data={big5Data}
                  big5ChartData={big5ChartData}
                  showInterpretation={true}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧠</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">성격검사 결과</h4>
                  <p className="text-gray-500 mb-6">지원자의 Big5 성격검사 결과를 확인할 수 있습니다.</p>
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                    <div className="text-gray-500 text-lg font-medium">성격검사 결과가 없습니다</div>
                    <div className="text-gray-400 text-sm mt-2">백엔드에서 성격검사 데이터를 제공하면 여기에 표시됩니다.</div>
                  </div>
                </div>
              )}
            </div>

            {/* 행동평가 결과 분석 섹션 (읽기 전용) */}
            <div className="rounded-xl p-6 border mb-8 bg-white">
              <h3 className="text-black font-semibold mb-4">🎯 행동평가 결과 분석</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">행동평가 결과</h4>
                <p className="text-gray-500 mb-6">지원자의 행동평가 결과를 확인할 수 있습니다.</p>
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <div className="text-gray-500 text-lg font-medium">행동평가 결과가 없습니다</div>
                  <div className="text-gray-400 text-sm mt-2">백엔드에서 행동평가 데이터를 제공하면 여기에 표시됩니다.</div>
                </div>
              </div>
            </div>

            {/* AI 학습 질문 섹션 (읽기 전용) */}
            <div className="rounded-xl p-6 border mb-8 bg-white">
              <h3 className="text-black font-semibold mb-4">❓ AI 학습 질문 답변</h3>
              {questions.length > 0 ? (
                <div className="space-y-4">
                  <ul className="space-y-4 text-sm">
                    {questions.map((question: any, index: number) => (
                      <li key={question.id} className="bg-white border rounded-lg p-4">
                        <div className="mb-3">
                          <div className="font-semibold text-black">Q{index + 1}. {question.text}</div>
                        </div>
                        <div className="text-xs text-gray-600 bg-gray-50 rounded p-3">
                          <div className="flex-1 whitespace-pre-wrap break-words">
                            <strong>답변:</strong> {question.answer || '-'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">❓</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">AI 학습 질문 답변</h4>
                  <p className="text-gray-500 mb-6">지원자가 작성한 AI 학습 질문 답변을 확인할 수 있습니다.</p>
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                    <div className="text-gray-500 text-lg font-medium">AI 학습 질문 답변이 없습니다</div>
                    <div className="text-gray-400 text-sm mt-2">백엔드에서 AI 학습 질문 데이터를 제공하면 여기에 표시됩니다.</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {!loading && !error && !profile && (
          <div className="p-6 bg-gray-50 text-gray-600 rounded-lg border">
            프로필 정보를 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
