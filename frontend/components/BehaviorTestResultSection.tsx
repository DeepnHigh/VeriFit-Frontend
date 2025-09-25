'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// 행동검사 결과 타입 정의 (평가 제거)
interface BehaviorTestResult {
  situation: string
  choice: string
  action: string
}

interface BehaviorTestResultSectionProps {
  behaviorTestResult: string | null
  readOnly?: boolean
}

// 행동검사 결과 파싱 함수 (평가 제거)
const parseBehaviorTestResult = (behaviorText: string): BehaviorTestResult | null => {
  try {
    // 행동평가 결과 텍스트를 파싱 (개행 보존)
    const lines = behaviorText.split('\n')
    
    let situation = ''
    let choice = ''
    let action = ''
    
    let currentSection = ''
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.includes('<상황>')) {
        currentSection = 'situation'
        // 같은 줄에 내용이 포함된 경우 처리: "<상황> : ..."
        const inlineSituation = trimmed.replace(/.*<상황>\s*:?\s*/,'')
        if (inlineSituation && inlineSituation !== trimmed) {
          situation += inlineSituation + '\n'
        }
        continue
      } else if (trimmed.includes('<선택>')) {
        currentSection = 'choice'
        // 같은 줄에 값이 있는 경우 처리: "<선택> : A"
        const m = trimmed.match(/<선택>\s*:?\s*([ABC])/)
        if (m && m[1]) {
          choice = m[1]
        }
        continue
      } else if (trimmed.includes('<행동>') || trimmed.includes('<대화>')) {
        currentSection = 'action'
        // 같은 줄에 내용이 포함된 경우 처리: "<행동> : ..." 또는 "<대화> : ..."
        const inlineAction = trimmed.replace(/.*<(행동|대화)>\s*:?\s*/,'')
        if (inlineAction && inlineAction !== trimmed) {
          action += inlineAction + '\n'
        }
        continue
      }
      
      switch (currentSection) {
        case 'situation':
          // 헤더([행동평가 결과]) 라인은 제외하고 개행 포함 그대로 보존
          if (trimmed !== '' || situation.endsWith('\n')) {
            if (!trimmed.includes('[') && !trimmed.includes(']')) {
              situation += line + '\n'
            }
          }
          break
        case 'choice':
          if (trimmed && trimmed.length === 1) {
            choice = trimmed
          }
          break
        case 'action':
          // 행동 텍스트도 개행 보존
          action += line + '\n'
          break
      }
    }
    
    return {
      situation: situation.trim(),
      choice: choice.trim(),
      action: action.trim()
    }
  } catch (error) {
    console.error('행동평가 결과 파싱 실패:', error)
    return null
  }
}

// 행동검사 결과 표시 컴포넌트 (평가 제거)
const BehaviorTestResultDisplay = ({ result }: { result: BehaviorTestResult }) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)

  // 시나리오 본문에서 A/B/C 선택지 설명 줄 제거
  const cleanedSituation = result.situation
    .split('\n')
    .filter(line => !/^[\ \t]*[ABC]:/.test(line))
    .join('\n')

  // 행동 텍스트에서 시간 스탬프([오전/오후 HH:MM]) 앞에 공백 줄 추가
  const formattedAction = React.useMemo(() => {
    let text = result.action || ''
    // 줄바꿈 직후 시간 스탬프가 오는 경우, 점선 구분선을 삽입
    // 예) "\n[오전 9:05]" → "\n································\n[오전 9:05]"
    text = text.replace(/\n(?=\[(오전|오후)\s*\d{1,2}:\d{2}\])/g, '\n\n································································\n\n')
    return text
  }, [result.action])

  return (
    <div className="space-y-6">
      {/* 상황 설명 */}
      <div className="bg-gray-50 rounded-xl p-6 border mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 시나리오</h2>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {cleanedSituation}
        </div>
      </div>

      {/* 캐릭터 정보 */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          {
            name: '김선희',
            role: '부팀장',
            personality: '조직적, 팀워크 중시',
            speech: '친근함, 존댓말',
            gender: '여성',
            characteristics: '팀 안정성 우선'
          },
          {
            name: '김대현',
            role: 'CEO',
            personality: '전략적 사고, 결단력',
            speech: '공식적, 간결',
            gender: '남성',
            characteristics: '회사 전략 수립'
          },
          {
            name: '박민준',
            role: '핵심개발자',
            personality: '기술적 전문성, 현실적',
            speech: '직설적, 솔직함',
            gender: '남성',
            characteristics: '휴가 예정, 기술 리더'
          }
        ].map((character, index) => (
          <div
            key={character.name}
            className={`bg-white rounded-lg p-4 border-2 transition-all duration-200 ${
              result.choice === String.fromCharCode(65 + index)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                result.choice === String.fromCharCode(65 + index)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{character.name}</h3>
                <p className="text-sm text-gray-600">{character.role}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1 text-left">
              <p><strong>성격:</strong> {character.personality}</p>
              <p><strong>말투:</strong> {character.speech}</p>
              <p><strong>성별:</strong> {character.gender}</p>
              <p><strong>특징:</strong> {character.characteristics}</p>
            </div>
            <div className="mt-3 text-left">
              <span className={`text-xs px-2 py-1 rounded-full ${
                result.choice === String.fromCharCode(65 + index)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {result.choice === String.fromCharCode(65 + index) ? '선택됨' : '미선택'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 행동 (고정 높이 + 전체보기 모달) */}
      <div className="relative bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🎭</div>
          <h4 className="text-lg font-semibold text-gray-800">행동</h4>
        </div>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line h-48 overflow-hidden">
          {formattedAction}
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setIsActionModalOpen(true)}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-800 text-white hover:bg-gray-900"
          >
            전체보기
          </button>
        </div>
      </div>

      {/* 모달 */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsActionModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden border">
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎭</span>
                <h4 className="text-base font-semibold text-gray-900">행동 전체보기</h4>
              </div>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="px-2 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                닫기
              </button>
            </div>
            <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 56px)' }}>
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {formattedAction}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BehaviorTestResultSection({ behaviorTestResult, readOnly = false }: BehaviorTestResultSectionProps) {
  // 행동평가 결과 파싱
  const parsedResult = behaviorTestResult ? parseBehaviorTestResult(behaviorTestResult) : null

  return (
    <section className="rounded-xl p-6 border mb-8 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-black font-semibold">🎯 행동평가 결과 분석</h3>
        {!readOnly && (
          <Link href="/applicant/behavior-test" className="px-3 py-2 rounded-md text-sm text-white bg-green-600 cursor-pointer hover:bg-green-700 transition-colors">
            {parsedResult ? '행동검사 다시하기' : '행동검사 진행하기'}
          </Link>
        )}
      </div>
      
      {parsedResult ? (
        <BehaviorTestResultDisplay result={parsedResult} />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">행동검사를 시작해보세요!</h4>
          <p className="text-gray-500 mb-6">행동평가를 통해 당신의 업무 스타일과 행동 패턴을 분석하고<br/>더 정확한 AI 프로필을 만들어보세요.</p>
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <div className="text-gray-500 text-lg font-medium">행동검사 결과가 없습니다</div>
          </div>
        </div>
      )}
    </section>
  )
}
