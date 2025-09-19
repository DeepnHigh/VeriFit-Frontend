'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { logout } from '@/lib/auth'
import Button from '@/components/Button'
import { useBig5Questions, Big5Result } from '../../../../hooks/useBig5Questions'
import apiClient, { Big5TestResult, api as apiMethods, getApiBaseUrl } from '@/lib/api'

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
        // TODO: job_seeker_id 수정 필요
        job_seeker_id: typeof window !== 'undefined' ? (localStorage.getItem('userId') || '') : '',
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
      }

      // API 호출로 결과 저장
      if (!testResult.job_seeker_id) {
        console.warn('로그인 사용자 ID를 찾을 수 없어 로컬 저장만 수행합니다.')
      } else {
        try {
          console.log('🛰️ Big5 저장 요청 준비')
          console.log('  - API Base URL:', getApiBaseUrl())
          console.log('  - 요청 경로: /big5-test')
          console.log('  - 토큰 존재:', !!localStorage.getItem('token'))
          console.log('  - 요청 페이로드:', JSON.parse(JSON.stringify(testResult)))
          await apiMethods.big5.saveTestResult(testResult)
          console.log('✅ Big5 저장 요청 성공')
        } catch (e) {
          const err: any = e
          console.error('❌ Big5 저장 요청 실패')
          console.error('  - message:', err?.message)
          console.error('  - response.status:', err?.response?.status)
          console.error('  - response.data:', err?.response?.data)
          console.error('  - request.url:', err?.config?.baseURL + (err?.config?.url || ''))
          console.error('  - request.headers:', err?.config?.headers)
          console.error('  - request.data:', err?.config?.data)
          console.warn('백엔드 저장 실패, 로컬 백업만 진행합니다.')
        }
      }
      
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
        <Header rightVariant="applicant" onLogout={() => logout('/')} />
        
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

            {/* 전문적인 해석 섹션은 대시보드에서만 표시합니다 */}

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
      <Header rightVariant="applicant" onLogout={() => logout('/')} />
      
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
                  className="w-full p-4 text-left border rounded-lg hover:bg-blue-100 transition-colors text-black"
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
