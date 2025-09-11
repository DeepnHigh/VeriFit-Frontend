'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

type HexPoint = { score: number; label: string; color: string }

const HEX_DATA: HexPoint[] = [
  { score: 67, label: '현실형', color: '#4CAF50' },
  { score: 45, label: '탐구형', color: '#2196F3' },
  { score: 21, label: '관습형', color: '#f44336' },
  { score: 33, label: '사회형', color: '#9C27B0' },
  { score: 59, label: '진취형', color: '#607D8B' },
  { score: 96, label: '예술형', color: '#FF9800' }
]

export default function ApplicantDashboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      drawHexagonChart(canvasRef.current, HEX_DATA)
    }
  }, [])

  const simulateRequest = (actionLabel: string) => {
    console.log(`[simulate] ${actionLabel} 버튼 클릭 - 빈 URL 요청 시도`)
    // 실제 요청 예시 (주석 처리)
    // fetch('')
    //   .then(() => console.log('요청 완료'))
    //   .catch(() => console.log('요청 실패'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-black">지원자 프로필 관리</Link>
            <div className="text-sm text-black">데모 레이아웃</div>
          </div>
        </div>
      </header>

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
                  <button onClick={() => simulateRequest('개인정보 채우기')} className="px-3 py-2 rounded-md text-sm bg-gray-100 text-black cursor-pointer">업로드한 문서로 개인정보 채우기</button>
                  <button onClick={() => simulateRequest('개인정보 수정')} className="px-3 py-2 rounded-md text-sm text-white bg-violet-600 cursor-pointer">수정</button>
                </div>
              </div>
            </div>

            {/* 업로드 섹션 (샘플 카드 세트) */}
            <section className="bg-gray-50 rounded-xl p-6 border mb-8">
              <h3 className="text-black font-semibold mb-4">📁 포트폴리오 및 자료 업로드</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: '자기소개서', icon: '📄', cta: '파일 선택' },
                  { title: '포트폴리오', icon: '💼', cta: '파일 선택' },
                  { title: 'GitHub 링크', icon: '🔗', cta: '링크 추가' },
                  { title: '이력서', icon: '📋', cta: '파일 선택' },
                  { title: '수상 경력', icon: '🏆', cta: '파일 선택' },
                  { title: '증명서', icon: '📜', cta: '파일 선택' },
                  { title: '자격증', icon: '🎖️', cta: '파일 선택' },
                  { title: '논문', icon: '📖', cta: '파일 선택' },
                  { title: '기타 자료', icon: '📚', cta: '파일 선택' },
                ].map((item) => (
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

            {/* 적성검사 결과 */}
            <section className="rounded-xl p-6 border mb-8 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-black font-semibold">📊 적성검사 결과 분석</h3>
                <button onClick={() => simulateRequest('적성검사 다시하기')} className="px-3 py-2 rounded-md text-sm text-white bg-green-600 cursor-pointer">🔄 적성검사 다시하기</button>
              </div>
              <div className="flex justify-center">
                <canvas ref={canvasRef} width={400} height={400} className="max-w-full" />
              </div>
              {/* 간단 점수 표 */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-green-600 text-black">
                      <th className="text-left p-3 text-black">적성 유형</th>
                      <th className="text-left p-3 text-black">점수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEX_DATA.map((p) => (
                      <tr key={p.label}>
                        <td className="p-3 text-black"><b>{p.label}</b></td>
                        <td className="p-3 text-black">{p.score}점</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* AI 학습 질문 섹션 요약 */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-black font-semibold">🤖 AI 학습을 위한 질문 답변</h3>
                <div className="text-sm text-black text-right">
                  <b>0/10</b>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-black">Q1. 자신의 가장 큰 강점과 약점은 무엇인가요?</div>
                    <span className="text-xs px-2 py-1 rounded bg-green-600 text-black">완료</span>
                  </div>
                </li>
                <li className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-black">Q2. 이직을 고려하는 이유는 무엇인가요?</div>
                    <span className="text-xs px-2 py-1 rounded bg-green-600 text-black">완료</span>
                  </div>
                </li>
                <li className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-black">Q3. 팀워크에서 본인의 역할은 무엇인가요?</div>
                    <span className="text-xs px-2 py-1 rounded bg-orange-500 text-black">미완료</span>
                  </div>
                </li>
              </ul>
              <div className="flex justify-center gap-3 mt-6">
                <button onClick={() => simulateRequest('프로필 저장')} className="px-4 py-2 rounded-lg bg-green-600 text-black cursor-pointer">💾 프로필 저장</button>
                <Link href="/applicant/qna" onClick={(e) => { e.preventDefault(); simulateRequest('Q&A 관리') }} className="px-4 py-2 rounded-lg bg-indigo-600 text-black cursor-pointer">Q&A 관리</Link>
              </div>
            </section>
        </section>
      </main>
    </div>
  )
}

function drawHexagonChart(canvas: HTMLCanvasElement, data: HexPoint[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 150

  // 등고선
  for (let level = 1; level <= 5; level++) {
    const currentRadius = (radius * level) / 5
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2
      const x = centerX + currentRadius * Math.cos(angle)
      const y = centerY + currentRadius * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // 외곽
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 2
  ctx.stroke()

  // 데이터 영역
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2
    const scoreRadius = (radius * data[i].score) / 100
    const x = centerX + scoreRadius * Math.cos(angle)
    const y = centerY + scoreRadius * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(76, 175, 80, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#4CAF50'
  ctx.lineWidth = 3
  ctx.stroke()

  // 중심점
  ctx.beginPath()
  ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI)
  ctx.fillStyle = '#4CAF50'
  ctx.fill()
  ctx.strokeStyle = '#2E7D32'
  ctx.lineWidth = 2
  ctx.stroke()
}
