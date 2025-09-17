'use client'

import Link from 'next/link'
import Button from './Button'
import QuestionItem from './QuestionItem'

// 질문 타입 정의
interface Question {
  id: string
  text: string
  status: 'pending' | 'completed'
  answer?: string
}

interface QuestionsSectionProps {
  questions: Question[]
  completedCount: number
  totalCount: number
  questionsLoading: boolean
  questionsError: string | null
  answers: Record<string, string>
  editingAnswers: Record<string, boolean>
  editedAnswers: Record<string, string>
  savingAnswers: Record<string, boolean>
  onAnswerChange: (questionId: string, answer: string) => void
  onStartEditAnswer: (questionId: string, currentAnswer: string) => void
  onCancelEditAnswer: (questionId: string) => void
  onUpdateAnswer: (questionId: string) => void
  onSaveAnswer: (questionId: string) => void
  onClearAnswer: (questionId: string) => void
  onSimulateRequest: (action: string) => void
  className?: string
}

export default function QuestionsSection({
  questions,
  completedCount,
  totalCount,
  questionsLoading,
  questionsError,
  answers,
  editingAnswers,
  editedAnswers,
  savingAnswers,
  onAnswerChange,
  onStartEditAnswer,
  onCancelEditAnswer,
  onUpdateAnswer,
  onSaveAnswer,
  onClearAnswer,
  onSimulateRequest,
  className = ''
}: QuestionsSectionProps) {
  return (
    <section className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-black font-semibold">🤖 AI 학습을 위한 질문 답변</h3>
        <div className="text-sm text-black text-right">
          <b>{completedCount}/{totalCount}</b>
        </div>
      </div>
      
      {/* 질문 로딩 상태 */}
      {questionsLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">질문 목록을 불러오는 중...</div>
        </div>
      )}
      
      {/* 질문 에러 상태 */}
      {questionsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="text-red-800 text-sm">{questionsError}</div>
        </div>
      )}
      
      {/* AI 에이전트 학습 안내 */}
      {!questionsLoading && !questionsError && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5 mb-6">
          <h4 className="text-green-800 font-semibold mb-3 flex items-center">
            💡 AI 에이전트 학습 안내
          </h4>
          <p className="text-gray-700 leading-relaxed text-sm" style={{ wordBreak: 'keep-all', whiteSpace: 'normal' }}>
            아래 질문들에 자세히 답변해주시면, 지원자AI가 더욱 정확하게 본인을 대변할 수 있습니다. 
            답변이 많을수록 AI가 본인의 성향, 경험, 가치관을 더 정확하게 파악하여 면접에서 더 자연스럽고 일관된 답변을 생성할 수 있습니다.
          </p>
        </div>
      )}
      
      {/* 질문 목록 */}
      {!questionsLoading && !questionsError && (
        <ul className="space-y-4 text-sm">
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              answers={answers}
              editingAnswers={editingAnswers}
              editedAnswers={editedAnswers}
              savingAnswers={savingAnswers}
              onAnswerChange={onAnswerChange}
              onStartEditAnswer={onStartEditAnswer}
              onCancelEditAnswer={onCancelEditAnswer}
              onUpdateAnswer={onUpdateAnswer}
              onSaveAnswer={onSaveAnswer}
              onClearAnswer={onClearAnswer}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
