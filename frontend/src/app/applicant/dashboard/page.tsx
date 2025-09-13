'use client'

import Link from 'next/link'
import Header from '../../../../components/Header'
import Button from '../../../../components/Button'
import { usePentagonChart } from '../../../../hooks/useHexagonChart'
import { useSimulateRequest } from '../../../../hooks/useSimulateRequest'
import { useUploadItems } from '../../../../hooks/useUploadItems'
import { useAptitudeData } from '../../../../hooks/useAptitudeData'
import { useQuestions } from '../../../../hooks/useQuestions'

export default function ApplicantDashboard() {
  const { big5Data, hasCompletedTest } = useAptitudeData()
  const { uploadItems } = useUploadItems()
  const { questions, completedCount, totalCount } = useQuestions()
  const { simulateRequest } = useSimulateRequest()
  const canvasRef = usePentagonChart(big5Data)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-black">나를 대변하는 AI를 위한 프로필 설정</p>
        </div>

        {/* 단일 사용자 보기 (로그인 사용자 데이터로 대체 예정) */}

        <section>
            {/* 상단 프로필 카드 + 상세 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1 bg-gray-50 rounded-xl p-6 border">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-black flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                  사
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-black mb-1">사용자</div>
                  <div className="text-black mb-4">경력 정보</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-black font-bold text-lg">-</div>
                    <div className="text-xs text-black">지원 공고</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-black font-bold text-lg">-</div>
                    <div className="text-xs text-black">AI 면접</div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg p-4 bg-green-50">
                  <div className="font-semibold text-black mb-1">🤖 지원자AI 상태</div>
                  <div className="text-sm text-black">프로필 완성도: <b>-</b></div>
                  <div className="text-xs text-black mt-1">마지막 업데이트: -</div>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 border relative pb-20">
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">📞 연락처</h3>
                  <div className="divide-y text-sm">
                    <div className="flex justify-between py-2"><span className="font-medium text-black">이메일</span><span className="text-black">-</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">전화번호</span><span className="text-black">-</span></div>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">🎓 학력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex justify-between py-2"><span className="font-medium text-black">최종학력</span><span className="text-black">-</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">졸업년도</span><span className="text-black">-</span></div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-semibold text-black mb-2">💼 경력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex justify-between py-2"><span className="font-medium text-black">총 경력</span><span className="text-black">-</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">최근 직장</span><span className="text-black">-</span></div>
                  </div>
                </div>
                <div className="flex gap-2 absolute right-5 bottom-5">
                  <Button onClick={() => simulateRequest('개인정보 채우기')} variant="secondary" size="sm">업로드한 문서로 개인정보 채우기</Button>
                  <Button onClick={() => simulateRequest('개인정보 수정')} variant="primary" size="sm">수정</Button>
                </div>
              </div>
            </div>

            {/* 업로드 섹션 (샘플 카드 세트) */}
            <section className="bg-gray-50 rounded-xl p-6 border mb-8">
              <h3 className="text-black font-semibold mb-4">📁 포트폴리오 및 자료 업로드</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {uploadItems.map((item) => (
                  <div key={item.title} className="bg-white rounded-lg p-4 border">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-black mb-1">{item.title}</div>
                    <div className="text-sm text-black mb-3">{item.title==='GitHub 링크' ? 'GitHub 프로필 및 주요 저장소' : '관련 파일을 업로드하세요'}</div>
                    <button onClick={() => simulateRequest(`${item.title} 업로드/추가`)} className="px-3 py-2 rounded-md text-sm text-white bg-green-600 cursor-pointer">
                      {item.cta}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Big5 성격검사 결과 */}
            <section className="rounded-xl p-6 border mb-8 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-black font-semibold">🧠 Big5 성격검사 결과 분석</h3>
                <Link href="/applicant/big5-test" className="px-3 py-2 rounded-md text-sm text-white bg-green-600 cursor-pointer hover:bg-green-700 transition-colors">
                  {hasCompletedTest ? '🔄 성격검사 다시하기' : '🧠 성격검사 시작하기'}
                </Link>
              </div>
              {hasCompletedTest ? (
                <>
                  <div className="flex justify-center">
                    <canvas ref={canvasRef} width={400} height={400} className="max-w-full" />
                  </div>
                  {/* Big5 점수 표 */}
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-green-600 text-black">
                          <th className="text-left p-3 text-black">성격 차원</th>
                          <th className="text-left p-3 text-black">점수</th>
                          <th className="text-left p-3 text-black">설명</th>
                        </tr>
                      </thead>
                      <tbody>
                        {big5Data.map((p) => (
                          <tr key={p.label}>
                            <td className="p-3 text-black"><b>{p.label}</b></td>
                            <td className="p-3 text-black">{p.score}점</td>
                            <td className="p-3 text-black text-xs">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧠</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">성격검사를 시작해보세요!</h4>
                  <p className="text-gray-500 mb-6">Big5 성격검사를 통해 당신의 성격을 분석하고<br/>더 정확한 AI 프로필을 만들어보세요.</p>
                  <Link href="/applicant/big5-test" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    🚀 성격검사 시작하기
                  </Link>
                </div>
              )}
              {/* Big5 해석 섹션 - 검사 완료 후에만 표시 */}
              {hasCompletedTest && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-black mb-2">📋 성격 분석 해석</h4>
                  <div className="text-sm text-black space-y-1">
                    <p><strong>개방성:</strong> 경험에 대한 개방성은 상상력이 풍부하고 창의적인 사람들과 현실적이고 전통적인 사람들을 구별하는 인지 스타일의 차원을 설명합니다.</p>
                    <p><strong>성실성:</strong> 성실성은 우리가 충동을 어떻게 통제하고, 조절하며, 지시하는지를 다룹니다.</p>
                    <p><strong>외향성:</strong> 외향성은 외부 세계와의 두드러진 관여로 표시됩니다.</p>
                    <p><strong>우호성:</strong> 우호성은 협력과 사회적 조화에 대한 관심의 개인 차이를 반영합니다. 우호적인 개인은 다른 사람들과 잘 지내는 것을 중요하게 생각합니다</p>
                    <p><strong>신경성:</strong> 신경증은 부정적인 감정을 경험하는 경향을 나타냅니다.(낮을수록 안정적)</p>
                  </div>
                </div>
              )}
            </section>

            {/* AI 학습 질문 섹션 요약 */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-black font-semibold">🤖 AI 학습을 위한 질문 답변</h3>
                <div className="text-sm text-black text-right">
                  <b>{completedCount}/{totalCount}</b>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                {questions.map((question) => (
                  <li key={question.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-black">Q{question.id}. {question.text}</div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        question.status === 'completed' 
                          ? 'bg-green-600 text-black' 
                          : 'bg-orange-500 text-black'
                      }`}>
                        {question.status === 'completed' ? '완료' : '미완료'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center gap-3 mt-6">
                <Button onClick={() => simulateRequest('프로필 저장')} variant="success" size="md">💾 프로필 저장</Button>
                <Link href="/applicant/qna" onClick={(e) => { e.preventDefault(); simulateRequest('Q&A 관리') }} className="px-4 py-2 rounded-lg bg-indigo-600 text-white cursor-pointer">Q&A 관리</Link>
              </div>
            </section>
        </section>
      </main>
    </div>
  )
}
