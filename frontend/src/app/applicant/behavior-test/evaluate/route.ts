import { NextRequest, NextResponse } from 'next/server'

// 행동 평가 LLM 프록시 라우트
// 환경변수: LAMBDA_ENDPOINT_BEHAVIER_EVALUATION

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const endpoint = process.env.LAMBDA_ENDPOINT_BEHAVIER_EVALUATION
    if (!endpoint) {
      return NextResponse.json(
        { error: 'LAMBDA_ENDPOINT_BEHAVIER_EVALUATION 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 그대로 전달 (situation/context, conversation_history)
    const lambdaRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const text = await lambdaRes.text()
    let parsed: any
    try {
      parsed = JSON.parse(text)
    } catch {
      // 비JSON 응답
      return NextResponse.json({ error: 'Invalid JSON from evaluation lambda', raw: text }, { status: 502 })
    }

    // API Gateway 래핑(body) 처리
    if (parsed && typeof parsed.body === 'string') {
      try {
        parsed = JSON.parse(parsed.body)
      } catch {
        // 그대로 노출
      }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: '평가 요청 처리 실패', debug: message }, { status: 500 })
  }
}


