export function useSimulateRequest() {
  const simulateRequest = (actionLabel: string) => {
    console.log(`[simulate] ${actionLabel} 버튼 클릭 - 빈 URL 요청 시도`)
    // 실제 요청 예시 (주석 처리)
    // fetch('')
    //   .then(() => console.log('요청 완료'))
    //   .catch(() => console.log('요청 실패'))
  }

  return { simulateRequest }
}
