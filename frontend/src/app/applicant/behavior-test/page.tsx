'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import Header from '@/components/Header'

interface Character {
  name: string
  role: string
  personality: string
  speech: string
  gender: string
  characteristics: string
}

interface Message {
  id: string
  character: string
  content: string
  timestamp: string
  isUser?: boolean
}

const CHARACTERS: Character[] = [
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
]

const INITIAL_MESSAGES: Message[] = []

export default function BehaviorTestPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [currentMessage, setCurrentMessage] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState<string>('김선희')
  // 평가 결과 화면은 사용하지 않으므로 관련 상태 제거
  const [conversationStarted, setConversationStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<any>(null)
  const [evaluationDone, setEvaluationDone] = useState(false)

  // 메시지 목록 컨테이너 참조 및 자동 스크롤
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const callLambdaAPI = async (conversationHistory: Message[]) => {
    try {
      setIsLoading(true)
      
      // 람다 함수 API 호출
      const response = await fetch('/applicant/behavior-test/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: selectedCharacter,
          conversationHistory: conversationHistory
        })
      })

      if (!response.ok) {
        throw new Error('API 호출 실패')
      }

      const data = await response.json()
      console.log('[Lambda Chat Response]', data)
      return data.response
    } catch (error) {
      console.error('Lambda API 호출 오류:', error)
      return '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.'
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      character: selectedCharacter,
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      isUser: true
    }

    // 사용자 메시지를 먼저 추가
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setCurrentMessage('')
    setConversationStarted(true)

    // 람다 API 호출
    const aiResponse = await callLambdaAPI(updatedMessages)
    
    // AI 응답 메시지 추가
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      character: selectedCharacter,
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      isUser: false
    }

    setMessages(prev => [...prev, aiMessage])
  }

  const handleCompleteTest = async () => {
    // 결과 제출 시 행동 평가 요청 실행
    await requestBehaviorEvaluation()
  }

  const getCharacterInfo = (characterName: string) => {
    return CHARACTERS.find(char => char.name === characterName)
  }

  // 현재 선택된 캐릭터를 A/B/C 문자로 변환
  const getSelectedChoiceLetter = () => {
    const idx = CHARACTERS.findIndex(c => c.name === selectedCharacter)
    return idx >= 0 ? String.fromCharCode(65 + idx) : ''
  }

  // 행동 평가 요청
  const requestBehaviorEvaluation = async () => {
    try {
      setIsEvaluating(true)

      const situationText = `당신은 팀장이며, 'NEX-T' 서비스의 프로젝트 매니저(PM)입니다. NEX-T 서비스는 특정 사람의 정보들을 입력해 놓으면 그 사람을 대신해 다른 사람들과 대화할 수 있는 서비스입니다. 이러한 서비스들은 현재 경쟁이 치열하며, 대표적인 경쟁사로는 '넷워치(NetWatch)' 가 있습니다.\n
지난 3개월간 당신은 팀원들과 함께 '알파' 프로젝트에 매진해 왔습니다. 이 프로젝트는 AI Agent 기술을 이용해서 더욱 심도있게 대화를 끌어나갈 수 있도록 하는 NEX-T의 개선 프로젝트입니다. 팀원들과 야심차게 준비해 와서 내부적으로 기대가 큰 '알파' 프로젝트의 출시가 이제 바로 다음 주로 예정되어 있습니다.\n그런데 오늘 아침, 해외 출장에서 복귀한 CEO로부터 메시지가 도착했습니다. CEO는 시장 변화에 대한 인사이트를 바탕으로 '알파' 기능 출시를 무기한 보류하고, 대신 신규 프로젝트인 '제타'를 1개월 내에 프로토타입으로 완성하라고 지시했습니다.\n팀은 이 메시지로 인해 3개월간의 노력이 물거품이 될 위기이며, 특히 핵심 개발자인 박민준 님은 다음 주부터 2주간의 장기 휴가가 예정되어 있었습니다.\n이 갑작스럽고 스트레스가 극심한 상황에서, 당신은 PM으로서 누구와 가장 먼저 대화하시겠습니까?\n
      A: 김선희, 부팀장이며, 조직적, 팀워크 중시, 친근함, 존댓말, 여성, 팀 안정성 우선
      B: 김대현, 이 지시를 내린 CEO이며, 전략적 사고, 결단력, 공식적, 간결, 남성, 회사 전략 수립에 관심
      C: 박민준, 알파프로젝트를 주도한 핵심 개발자이며, 기술적 전문성, 현실적, 직설적, 솔직함, 남성, 휴가 예정, 기술 리더
      `

      // 프론트 대화 포맷 -> 평가 포맷으로 변환
      const formattedHistory = messages.map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.content,
        timestamp: m.timestamp
      }))

      const res = await fetch('/applicant/behavior-test/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: { context: situationText },
          conversation_history: formattedHistory,
          selected: getSelectedChoiceLetter()
        })
      })

      const data = await res.json()
      setEvaluationResult(data)
      console.log('[Behavior Evaluation Result]', data)

      // 평가 결과 저장 텍스트 구성
      const situation = situationText
      const selected = getSelectedChoiceLetter()
      const action = (data && (data.action || data.result?.action || data.summary?.action)) || ''
      const evaluation = (data && (data.evaluation || data.result?.evaluation || data.summary?.evaluation || data.content)) || ''

      const behaviorText = [
        '[행동평가 결과]',
        '<상황>',
        situation,
        '<선택>',
        selected,
        '<행동>',
        action || '-',
        '<평가>',
        evaluation || '-'
      ].join('\n')

      // 사용자 ID 조회 및 저장 API 호출
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (userId) {
        try {
          await api.applicant.saveBehaviorText(userId, behaviorText)
        } catch (saveErr) {
          console.error('행동평가 결과 저장 중 오류', saveErr)
        }
      } else {
        console.warn('userId가 없어 행동평가 결과를 저장하지 못했습니다.')
      }

      setEvaluationDone(true)
    } catch (e) {
      console.error('행동 평가 요청 실패', e)
      alert('행동 평가 요청에 실패했습니다. 나중에 다시 시도해주세요.')
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/applicant/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 대시보드로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎭 시뮬레이션 검사</h1>
          <p className="text-gray-600">실제 업무 상황에서의 소프트 스킬과 사회성을 평가합니다</p>
        </div>

        {/* 시나리오 섹션 */}
        <div className="bg-white rounded-xl p-6 border mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 시나리오: NEX-T 서비스 프로젝트 위기</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              당신은 팀장이며, 'NEX-T' 서비스의 프로젝트 매니저(PM)입니다. NEX-T 서비스는 특정 사람의 정보들을 입력해 놓으면 그 사람을 대신해 다른 사람들과 대화할 수 있는 서비스입니다. 이러한 서비스들은 현재 경쟁이 치열하며, 대표적인 경쟁사로는 '넷워치(NetWatch)'가 있습니다.
            </p>
            <p className="text-gray-700 mb-4">
              지난 3개월간 당신은 팀원들과 함께 '알파' 프로젝트에 매진해 왔습니다. 이 프로젝트는 AI Agent 기술을 이용해서 더욱 심도있게 대화를 끌어나갈 수 있도록 하는 NEX-T의 개선 프로젝트입니다. 팀원들과 야심차게 준비해 와서 내부적으로 기대가 큰 '알파' 프로젝트의 출시가 이제 바로 다음 주로 예정되어 있습니다.
            </p>
            <p className="text-gray-700 mb-4">
              그런데 오늘 아침, 해외 출장에서 복귀한 CEO로부터 메시지가 도착했습니다. CEO는 시장 변화에 대한 인사이트를 바탕으로 '알파' 기능 출시를 무기한 보류하고, 대신 신규 프로젝트인 '제타'를 1개월 내에 프로토타입으로 완성하라고 지시했습니다.
            </p>
            <p className="text-gray-700 mb-4">
              팀은 이 메시지로 인해 3개월간의 노력이 물거품이 될 위기이며, 특히 핵심 개발자인 박민준 님은 다음 주부터 2주간의 장기 휴가가 예정되어 있었습니다.
            </p>
            <p className="text-gray-700 font-medium">
              이 갑작스럽고 스트레스가 극심한 상황에서, 당신은 PM으로서 누구와 가장 먼저 대화하시겠습니까?
            </p>
            <p className="text-gray-700 font-medium">
              (A, B, C 중 하나를 선택하여 대화하세요. 대화 시작 후에는 대화 상대를 변경할 수 없습니다.)
            </p>
          </div>
        </div>

        {/* 캐릭터 정보 */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {CHARACTERS.map((character, index) => (
            <button
              key={character.name}
              onClick={() => {
                if (!conversationStarted) {
                  setSelectedCharacter(character.name)
                }
              }}
              disabled={conversationStarted}
              className={`bg-white rounded-lg p-4 border-2 transition-all duration-200 hover:shadow-lg ${
                selectedCharacter === character.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              } ${conversationStarted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                  selectedCharacter === character.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
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
                  selectedCharacter === character.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedCharacter === character.name 
                    ? (conversationStarted ? '대화 중' : '선택됨')
                    : (conversationStarted ? '선택 불가' : '대화하기')
                  }
                </span>
              </div>
            </button>
          ))}
        </div>


        {/* 메신저 섹션 */}
        <div className="bg-white rounded-xl border mb-6">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">💬 메신저로 상황 해결하기</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                현재 대화 중: <span className="font-semibold text-blue-600">{selectedCharacter}</span>
              </p>
            </div>
          </div>

          {/* 메시지 목록 */}
          <div ref={messagesContainerRef} className="p-4 h-96 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm">아직 메시지가 없습니다.</p>
                  <p className="text-xs mt-1">아래에서 메시지를 입력해보세요.</p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const characterInfo = getCharacterInfo(message.character)
                return (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {!message.isUser && (
                        <div className="font-semibold text-sm mb-1">
                          {message.character} {characterInfo?.role}
                        </div>
                      )}
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* 메시지 입력 */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder={`${selectedCharacter}에게 메시지 보내기...`}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '전송 중...' : '전송'}
              </button>
            </div>
            {isLoading && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  AI가 응답을 생성하고 있습니다...
                </div>
              </div>
            )}
            {isEvaluating && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  평가 생성 중입니다...
                </div>
              </div>
            )}
            {evaluationDone && (
              <div className="mt-2 text-center text-green-600 text-sm font-medium">
                결과 제출 및 평가가 완료되었습니다.
              </div>
            )}
          </div>
        </div>


        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleCompleteTest}
              disabled={isEvaluating || evaluationDone || messages.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEvaluating ? '평가 생성 중...' : (evaluationDone ? '제출 완료' : '결과 제출')}
            </button>
            <Link
              href="/applicant/dashboard"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
            >
              지원 페이지로 돌아가기
            </Link>
          </div>
          {evaluationDone && (
            <div className="mt-3 text-green-600 text-sm font-medium">결과 제출 및 평가가 완료되었습니다.</div>
          )}
        </div>
      </main>
    </div>
  )
}
