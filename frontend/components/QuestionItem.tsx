'use client'

import { useState } from 'react'

// 질문 타입 정의
interface Question {
  id: string
  text: string
  status: 'pending' | 'completed'
  answer?: string
}

interface QuestionItemProps {
  question: Question
  index: number
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
}

export default function QuestionItem({
  question,
  index,
  answers,
  editingAnswers,
  editedAnswers,
  savingAnswers,
  onAnswerChange,
  onStartEditAnswer,
  onCancelEditAnswer,
  onUpdateAnswer,
  onSaveAnswer,
  onClearAnswer
}: QuestionItemProps) {
  return (
    <li className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-black">Q{index + 1}. {question.text}</div>
        <span className={`text-xs px-2 py-1 rounded ${
          question.status === 'completed' 
            ? 'bg-green-600 text-white' 
            : 'bg-orange-500 text-white'
        }`}>
          {question.status === 'completed' ? '완료' : '미완료'}
        </span>
      </div>
      
      {/* 완료된 질문의 답변 - 편집 컨트롤 */}
      {question.status === 'completed' && (
        <div className="mb-3">
          {!editingAnswers[question.id] ? (
            <div className="text-xs text-gray-600 bg-gray-50 rounded p-3 flex items-start justify-between gap-3">
              <div className="flex-1 whitespace-pre-wrap break-words">
                <strong>답변:</strong> {question.answer || '-'}
              </div>
              <div className="shrink-0 flex gap-2">
                <button
                  onClick={() => onStartEditAnswer(question.id, question.answer || '')}
                  className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                >
                  수정
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded p-3">
              <textarea
                value={editedAnswers[question.id] || ''}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                placeholder="답변을 입력해주세요..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onCancelEditAnswer(question.id)}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={() => onUpdateAnswer(question.id)}
                  disabled={savingAnswers[question.id] || !(editedAnswers[question.id] && editedAnswers[question.id].trim())}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    savingAnswers[question.id] || !(editedAnswers[question.id] && editedAnswers[question.id].trim()) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {savingAnswers[question.id] ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 답변 입력 필드 (미완료 상태일 때만 표시) */}
      {question.status === 'pending' && (
        <div className="space-y-2">
          <textarea
            value={typeof answers[question.id] === 'string' ? answers[question.id] : ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder="이 질문에 대한 답변을 입력해주세요..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onClearAnswer(question.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={() => onSaveAnswer(question.id)}
              disabled={savingAnswers[question.id] || !(typeof answers[question.id] === 'string' && answers[question.id].trim())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                savingAnswers[question.id] || !(typeof answers[question.id] === 'string' && answers[question.id].trim())
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {savingAnswers[question.id] ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
