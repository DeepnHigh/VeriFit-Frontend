import { NextRequest, NextResponse } from 'next/server'

interface Message {
  id: string
  character: string
  content: string
  timestamp: string
  isUser?: boolean
}

interface RequestBody {
  character: string
  conversationHistory: Message[]
}

// 각 Choice별 람다 함수 엔드포인트
const LAMBDA_ENDPOINTS = {
  '김선희': process.env.LAMBDA_ENDPOINT_CHOICE_A || 'https://your-lambda-endpoint-for-choice-a.com',
  '김대현': process.env.LAMBDA_ENDPOINT_CHOICE_B || 'https://your-lambda-endpoint-for-choice-b.com',
  '박민준': process.env.LAMBDA_ENDPOINT_CHOICE_C || 'https://your-lambda-endpoint-for-choice-c.com'
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { character, conversationHistory } = body

    // Choice별 람다 엔드포인트 확인
    const lambdaEndpoint = LAMBDA_ENDPOINTS[character as keyof typeof LAMBDA_ENDPOINTS]
    
    if (!lambdaEndpoint) {
      return NextResponse.json(
        { error: '지원하지 않는 Choice입니다.' },
        { status: 400 }
      )
    }

    // 대화 히스토리를 람다 함수에 전송할 형태로 변환
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content,
      timestamp: msg.timestamp
    }))

    // 람다 함수 호출 (시스템 프롬프트와 대화 내역만 전송)
    const lambdaResponse = await fetch(lambdaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 필요시 인증 헤더 추가
        // 'Authorization': `Bearer ${process.env.LAMBDA_API_KEY}`
      },
      body: JSON.stringify({
        conversationHistory: formattedHistory
      })
    })

    if (!lambdaResponse.ok) {
      throw new Error(`Lambda 함수 호출 실패: ${lambdaResponse.status}`)
    }

    // 람다 응답은 환경에 따라 형태가 다를 수 있음
    // 1) 직접 JSON: { content: "...", timestamp: "..." }
    // 2) API Gateway 래핑: { statusCode: 200, headers: {...}, body: "{\"content\":\"...\"}" }
    // 두 경우 모두 안전하게 파싱
    const rawText = await lambdaResponse.text()
    let parsed: any
    try {
      parsed = JSON.parse(rawText)
    } catch {
      // JSON이 아니면 그대로 에러 처리
      throw new Error('Lambda 응답 파싱 실패(비JSON)')
    }

    // body가 문자열 JSON이면 한 번 더 파싱
    if (parsed && typeof parsed.body === 'string') {
      try {
        parsed = JSON.parse(parsed.body)
      } catch {
        // body가 JSON 문자열이 아니면 그대로 둠
      }
    }

    // 람다 함수 응답에서 메시지 추출 (람다 함수의 응답 형식에 맞춤)
    const response = parsed?.content || parsed?.response || parsed?.message || '응답을 받을 수 없습니다.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('행동검사 API 오류:', error)
    
    // 오류 발생 시 기본 응답 반환
    return NextResponse.json({ 
      response: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.' 
    })
  }
}
