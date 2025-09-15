import { useState, useEffect } from 'react'
import { api } from '../lib/api'

// 로컬 타입 정의: 백엔드 응답 형태(두 가지 케이스)를 모두 수용
type AILearningQuestion = {
  id: string
  question_text: string
  display_order?: number
}

type AILearningAnswer = {
  id: string
  answer_text: string
  response_date?: string
  // 케이스 1: question_id가 루트에 존재
  question_id?: string
  // 케이스 2: question 객체가 중첩되어 존재
  question?: { id: string; question_text?: string; display_order?: number }
}

interface QuestionWithStatus {
  id: string
  text: string
  status: 'completed' | 'pending'
  answer?: string
}

export function useQuestions() {
  const [questions, setQuestions] = useState<QuestionWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        // 사용자 ID 가져오기
        const userId = localStorage.getItem('userId')
        if (!userId) {
          setError('사용자 ID를 찾을 수 없습니다.')
          return
        }

        // AI 학습 질문 목록과 사용자 답변을 병렬로 가져오기
        const [questionsResponse, responsesResponse] = await Promise.all([
          api.applicant.getAILearningQuestions(),
          api.applicant.getAILearningAnswers(userId)
        ])

        // 백엔드 응답이 배열 혹은 객체 래퍼 형태( ai_learning_answers | ai_learning_responses ) 모두 수용
        let responsesArray: AILearningAnswer[] = Array.isArray(responsesResponse)
          ? responsesResponse
          : (responsesResponse?.ai_learning_answers || [])

        // 보조 경로: 위 응답이 비어있으면 프로필 API에서 가져오기
        if (!responsesArray || responsesArray.length === 0) {
          try {
            const profile = await api.applicant.getProfile(userId)
            const fromProfile: AILearningAnswer[] = profile?.ai_learning_answers || []
            if (Array.isArray(fromProfile) && fromProfile.length > 0) {
              responsesArray = fromProfile
            }
          } catch (_) {
            // ignore fallback errors
          }
        }

        // 질문과 답변을 매핑하여 상태 설정
        const questionsWithStatus: QuestionWithStatus[] = questionsResponse.map((question: AILearningQuestion) => {
          const response = responsesArray.find((resp: AILearningAnswer) => {
            const respQuestionId = resp.question_id || resp.question?.id
            return respQuestionId === question.id
          })
          return {
            id: question.id,
            text: question.question_text,
            status: response ? 'completed' : 'pending',
            answer: (response as any)?.answer_text || (response as any)?.answer || ''
          }
        })

        // 디버그 로그
        try {
          console.log('[AI QA] responsesArray size:', Array.isArray(responsesArray) ? responsesArray.length : 'N/A')
          const debugSample = responsesArray.slice(0, 2).map(r => ({ id: r.id, hasAnswerText: !!(r as any).answer_text, hasAnswer: !!(r as any).answer }))
          console.log('[AI QA] responses sample keys:', debugSample)
          console.log('[AI QA] mapped questions:', questionsWithStatus.map(q => ({ id: q.id, status: q.status, hasAnswer: !!q.answer, answerPreview: q.answer ? q.answer.slice(0, 40) : '' })))
        } catch (_) {}

        // display_order로 정렬
        questionsWithStatus.sort((a, b) => {
          const aOrder = questionsResponse.find((q: AILearningQuestion) => q.id === a.id)?.display_order || 0
          const bOrder = questionsResponse.find((q: AILearningQuestion) => q.id === b.id)?.display_order || 0
          return aOrder - bOrder
        })

        setQuestions(questionsWithStatus)
      } catch (err: unknown) {
        console.error('질문 목록 조회 실패:', err)
        setError('질문을 가져오는 데 실패했습니다.')
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const completedCount = questions.filter(q => q.status === 'completed').length
  const totalCount = questions.length

  // 답변 저장 함수
  const saveAnswer = async (questionId: string, answer: string) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.')
      }

      // API 호출하여 답변 저장
      await api.applicant.saveAILearningAnswer(userId, questionId, answer)
      
      // 로컬 상태 업데이트
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId 
            ? { ...q, status: 'completed' as const, answer }
            : q
        )
      )
      
      return { success: true }
    } catch (err: unknown) {
      console.error('답변 저장 실패:', err)
      return { 
        success: false, 
        error: '답변 저장에 실패했습니다.' 
      }
    }
  }

  return { 
    questions, 
    completedCount, 
    totalCount, 
    loading, 
    error,
    saveAnswer
  }
}
