// 클라이언트 공통 인증 유틸

export function logout(redirectPath: string = '/') {
  try {
    // 모든 로컬 스토리지 항목 삭제 (계정 전환 시 데이터 혼동 방지)
    localStorage.clear()
  } catch (_) {
    // noop
  }
  if (typeof window !== 'undefined') {
    window.location.href = redirectPath
  }
}

export function getUserType(): string | null {
  try {
    return localStorage.getItem('userType')
  } catch (_) {
    return null
  }
}


