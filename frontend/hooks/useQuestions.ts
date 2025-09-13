import { useState, useEffect } from 'react'
import { api, AILearningQuestion, AILearningResponse } from '../lib/api'

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
          api.applicant.getAILearningResponses(userId)
        ])

        // 질문과 답변을 매핑하여 상태 설정
        const questionsWithStatus: QuestionWithStatus[] = questionsResponse.map((question: AILearningQuestion) => {
          const response = responsesResponse.find((resp: AILearningResponse) => resp.question_id === question.id)
          return {
            id: question.id,
            text: question.question_text,
            status: response ? 'completed' : 'pending',
            answer: response?.answer_text
          }
        })

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

  return { 
    questions, 
    completedCount, 
    totalCount, 
    loading, 
    error 
  }
}
