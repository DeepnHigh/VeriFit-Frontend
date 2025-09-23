'use client'

import React from 'react'
import Link from 'next/link'

// 행동평가 결과 타입 정의
interface BehaviorTestResult {
  situation: string
  choice: string
  action: string
  evaluation: {
    communication: string
    attitude: string
    problemSolving: string
    teamwork: string
    stressManagement: string
    adaptability: string
  }
}

interface BehaviorTestResultSectionProps {
  behaviorTestResult: string | null
  readOnly?: boolean
}

// 행동평가 결과 파싱 함수
const parseBehaviorTestResult = (behaviorText: string): BehaviorTestResult | null => {
  try {
    // 행동평가 결과 텍스트를 파싱 (개행 보존)
    const lines = behaviorText.split('\n')
    
    let situation = ''
    let choice = ''
    let action = ''
    let evaluationText = ''
    
    let currentSection = ''
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.includes('<상황>')) {
        currentSection = 'situation'
        continue
      } else if (trimmed.includes('<선택>')) {
        currentSection = 'choice'
        continue
      } else if (trimmed.includes('<행동>')) {
        currentSection = 'action'
        continue
      } else if (trimmed.includes('<평가>')) {
        currentSection = 'evaluation'
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
        case 'evaluation':
          evaluationText += line + '\n'
          break
      }
    }
    
    // 평가 텍스트에서 각 항목 추출
    const evaluation: BehaviorTestResult['evaluation'] = {
      communication: '',
      attitude: '',
      problemSolving: '',
      teamwork: '',
      stressManagement: '',
      adaptability: ''
    }
    
    // 평가 텍스트를 ':' 기준으로 split하여 각 항목 추출
    const evaluationParts = evaluationText.split(':')
    
    for (let i = 0; i < evaluationParts.length - 1; i++) {
      const currentPart = evaluationParts[i].trim()
      const nextPart = evaluationParts[i + 1].trim()
      
      // 각 평가 항목을 정확히 매칭
      if (currentPart.includes('의사소통 능력')) {
        evaluation.communication = nextPart.split(/태도|문제 해결력|팀워크|스트레스 관리|적응력/)[0].trim()
      } else if (currentPart.includes('태도')) {
        evaluation.attitude = nextPart.split(/문제 해결력|팀워크|스트레스 관리|적응력/)[0].trim()
      } else if (currentPart.includes('문제 해결력')) {
        evaluation.problemSolving = nextPart.split(/팀워크|스트레스 관리|적응력/)[0].trim()
      } else if (currentPart.includes('팀워크')) {
        evaluation.teamwork = nextPart.split(/스트레스 관리|적응력/)[0].trim()
      } else if (currentPart.includes('스트레스 관리')) {
        evaluation.stressManagement = nextPart.split(/적응력/)[0].trim()
      } else if (currentPart.includes('적응력')) {
        evaluation.adaptability = nextPart.trim()
      }
    }
    
    return {
      situation: situation.trim(),
      choice: choice.trim(),
      action: action.trim(),
      evaluation
    }
  } catch (error) {
    console.error('행동평가 결과 파싱 실패:', error)
    return null
  }
}

// 행동평가 결과 표시 컴포넌트
const BehaviorTestResultDisplay = ({ result }: { result: BehaviorTestResult }) => {
  // 시나리오 본문에서 A/B/C 선택지 설명 줄 제거
  const cleanedSituation = result.situation
    .split('\n')
    .filter(line => !/^[\ \t]*[ABC]:/.test(line))
    .join('\n')

  const evaluationItems = [
    { key: 'communication', label: '의사소통 능력', icon: '💬', color: 'blue' },
    { key: 'attitude', label: '태도', icon: '😊', color: 'green' },
    { key: 'problemSolving', label: '문제 해결력', icon: '🧩', color: 'purple' },
    { key: 'teamwork', label: '팀워크', icon: '🤝', color: 'orange' },
    { key: 'stressManagement', label: '스트레스 관리', icon: '🧘', color: 'red' },
    { key: 'adaptability', label: '적응력', icon: '🔄', color: 'indigo' }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

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

      {/* 행동 */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🎭</div>
          <h4 className="text-lg font-semibold text-gray-800">행동</h4>
        </div>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {result.action}
        </div>
      </div>

      {/* 평가 결과 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">📊</div>
          <h4 className="text-lg font-semibold text-gray-800">평가 결과</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evaluationItems.map((item) => {
            const value = result.evaluation[item.key as keyof typeof result.evaluation]
            return (
              <div key={item.key} className={`rounded-lg p-4 border ${getColorClasses(item.color)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <div className="text-sm leading-relaxed">
                  {value || '평가할 수 없습니다.'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
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
