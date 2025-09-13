'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/Header'
import Button from '../../../../components/Button'
import { useBig5Questions, Big5Result } from '../../../../hooks/useBig5Questions'
import api, { Big5TestResult } from '../../../../lib/api'

export default function Big5TestPage() {
  const router = useRouter()
  const {
    currentQuestion,
    currentQuestionIndex,
    progress,
    isCompleted,
    result,
    answerQuestion,
    resetTest,
    totalQuestions
  } = useBig5Questions()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = (score: number) => {
    answerQuestion(score)
  }

  const handleComplete = async () => {
    if (!result) return
    
    setIsSubmitting(true)
    
    try {
      // Big5 결과를 API 형식으로 변환
      const testResult: Big5TestResult = {
        job_seeker_id: 'current-user-id', // 실제로는 로그인한 사용자 ID 사용
        test_duration_minutes: Math.round((Date.now() - Date.now()) / 60000), // 실제로는 시작 시간 기록 필요
        openness_score: result.openness,
        conscientiousness_score: result.conscientiousness,
        extraversion_score: result.extraversion,
        agreeableness_score: result.agreeableness,
        neuroticism_score: result.neuroticism,
        openness_level: result.rawScores?.O?.result || 'neutral',
        conscientiousness_level: result.rawScores?.C?.result || 'neutral',
        extraversion_level: result.rawScores?.E?.result || 'neutral',
        agreeableness_level: result.rawScores?.A?.result || 'neutral',
        neuroticism_level: result.rawScores?.N?.result || 'neutral',
        openness_facets: result.rawScores?.O?.facet || {},
        conscientiousness_facets: result.rawScores?.C?.facet || {},
        extraversion_facets: result.rawScores?.E?.facet || {},
        agreeableness_facets: result.rawScores?.A?.facet || {},
        neuroticism_facets: result.rawScores?.N?.facet || {},
        interpretations: result.interpretations,
        raw_scores: result.rawScores,
        overall_analysis: 'Big5 성격검사 완료',
        strengths: '강점 분석 결과',
        weaknesses: '약점 분석 결과',
        recommendations: '추천사항'
      }

      // API 호출로 결과 저장
      await api.big5.saveTestResult(testResult)
      
      // 로컬 스토리지에도 백업 저장
      localStorage.setItem('big5Result', JSON.stringify(result))
      
      // 대시보드로 이동
      router.push('/applicant/dashboard')
      
    } catch (error) {
      console.error('Big5 결과 저장 중 오류:', error)
      // 오류가 발생해도 로컬 스토리지에 저장하고 대시보드로 이동
      localStorage.setItem('big5Result', JSON.stringify(result))
      router.push('/applicant/dashboard')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToDashboard = () => {
    router.push('/applicant/dashboard')
  }

  if (isCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl p-8 border shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 Big5 성격검사 완료!</h1>
              <p className="text-gray-600">당신의 성격 분석 결과입니다.</p>
            </div>

            {/* 결과 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-green-800 mb-1">개방성</div>
                <div className="text-2xl font-bold text-green-900">{result.openness}점</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-blue-800 mb-1">성실성</div>
                <div className="text-2xl font-bold text-blue-900">{result.conscientiousness}점</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-orange-800 mb-1">외향성</div>
                <div className="text-2xl font-bold text-orange-900">{result.extraversion}점</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-purple-800 mb-1">우호성</div>
                <div className="text-2xl font-bold text-purple-900">{result.agreeableness}점</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-red-800 mb-1">신경성</div>
                <div className="text-2xl font-bold text-red-900">{result.neuroticism}점</div>
              </div>
            </div>

            {/* 전문적인 해석 */}
            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900">📊 전문적인 성격 분석 해석</h3>
              
              {result.interpretations && result.interpretations.map((interpretation, index) => {
                const colors = {
                  'O': 'green',
                  'C': 'blue', 
                  'E': 'orange',
                  'A': 'purple',
                  'N': 'red'
                }
                const color = colors[interpretation.domain as keyof typeof colors] || 'gray'
                
                return (
                  <div key={index} className={`p-6 bg-${color}-50 rounded-lg border`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`text-lg font-semibold text-${color}-800`}>
                        {interpretation.title} ({result[interpretation.domain.toLowerCase() as keyof typeof result]}점)
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${color}-200 text-${color}-800`}>
                        {interpretation.scoreText === 'high' ? '높음' : 
                         interpretation.scoreText === 'neutral' ? '보통' : 
                         interpretation.scoreText === 'low' ? '낮음' : interpretation.scoreText}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className={`text-sm text-${color}-700 mb-3`} dangerouslySetInnerHTML={{ __html: interpretation.shortDescription }} />
                      <p className={`text-sm text-${color}-600`} dangerouslySetInnerHTML={{ __html: interpretation.text }} />
                    </div>
                    
                    {/* 세부 특성 (Facets) */}
                    {interpretation.facets && interpretation.facets.length > 0 && (
                      <div className="mt-4">
                        <h5 className={`font-semibold text-${color}-800 mb-3`}>세부 특성 분석</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {interpretation.facets.map((facet, facetIndex) => (
                            <div key={facetIndex} className={`p-3 bg-white rounded border border-${color}-200`}>
                              <div className="flex items-center justify-between mb-2">
                                <h6 className={`font-medium text-${color}-800 text-sm`}>{facet.title}</h6>
                                <span className={`text-xs px-2 py-1 rounded bg-${color}-100 text-${color}-700`}>
                                  {facet.scoreText === 'high' ? '높음' : 
                                   facet.scoreText === 'neutral' ? '보통' : 
                                   facet.scoreText === 'low' ? '낮음' : facet.scoreText}
                                </span>
                              </div>
                              <p className={`text-xs text-${color}-600`} dangerouslySetInnerHTML={{ __html: facet.text }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleComplete} 
                variant="success" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '💾 결과 저장하고 대시보드로'}
              </Button>
              <Button 
                onClick={resetTest} 
                variant="secondary" 
                size="lg"
              >
                🔄 다시 검사하기
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-8 border shadow-sm">
          {/* 진행률 표시 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900">🧠 Big5 성격검사</h1>
              <span className="text-sm text-gray-600">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 질문 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion?.text}
            </h2>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">다음 중 어느 것이 가장 적절한지 선택해주세요:</p>
              
              {currentQuestion?.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(choice.score)}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 뒤로가기 버튼 */}
          <div className="flex justify-center">
            <Button 
              onClick={handleBackToDashboard} 
              variant="secondary" 
              size="md"
            >
              ← 대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
