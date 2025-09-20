import { NextRequest, NextResponse } from 'next/server'

// 지원자AI 업데이트 람다 함수 프록시 라우트
// 람다 함수 URL: https://mcetpzkugzx5tdmcrc53imsxri0wbhdh.lambda-url.us-west-1.on.aws/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { repositories } = body

    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json(
        { error: 'repositories 배열이 필요합니다.' },
        { status: 400 }
      )
    }

    // 람다 함수에 보낼 데이터 형식
    const lambdaPayload = {
      repositories: repositories
    }

    // 람다 함수 호출
    const lambdaResponse = await fetch('https://mcetpzkugzx5tdmcrc53imsxri0wbhdh.lambda-url.us-west-1.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lambdaPayload)
    })

    if (!lambdaResponse.ok) {
      const errorText = await lambdaResponse.text()
      throw new Error(`람다 함수 호출 실패: ${lambdaResponse.status} - ${errorText}`)
    }

    const lambdaResult = await lambdaResponse.json()

    // 람다 함수 응답의 body 부분을 파싱
    const hardSkillData = lambdaResult.body ? JSON.parse(lambdaResult.body) : lambdaResult

    return NextResponse.json({
      success: true,
      data: hardSkillData,
      message: '지원자AI 업데이트가 완료되었습니다.'
    })

  } catch (error) {
    console.error('지원자AI 업데이트 오류:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        success: false,
        error: '지원자AI 업데이트 실패', 
        debug: message 
      }, 
      { status: 500 }
    )
  }
}
