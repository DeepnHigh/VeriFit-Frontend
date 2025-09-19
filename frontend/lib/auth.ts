// 클라이언트 공통 인증 유틸

export function logout(redirectPath: string = '/') {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('userId')
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


