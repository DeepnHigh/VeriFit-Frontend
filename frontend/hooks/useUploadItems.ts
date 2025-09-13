export function useUploadItems() {
  const uploadItems = [
    { title: '자기소개서', icon: '📄', cta: '파일 선택' },
    { title: '포트폴리오', icon: '💼', cta: '파일 선택' },
    { title: 'GitHub 링크', icon: '🔗', cta: '링크 추가' },
    { title: '이력서', icon: '📋', cta: '파일 선택' },
    { title: '수상 경력', icon: '🏆', cta: '파일 선택' },
    { title: '증명서', icon: '📜', cta: '파일 선택' },
    { title: '자격증', icon: '🎖️', cta: '파일 선택' },
    { title: '논문', icon: '📖', cta: '파일 선택' },
    { title: '기타 자료', icon: '📚', cta: '파일 선택' },
  ]

  return { uploadItems }
}
