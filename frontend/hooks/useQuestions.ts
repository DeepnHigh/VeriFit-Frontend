export function useQuestions() {
  const questions = [
    {
      id: 1,
      text: '자신의 가장 큰 강점과 약점은 무엇인가요?',
      status: 'completed' as const
    },
    {
      id: 2,
      text: '이직을 고려하는 이유는 무엇인가요?',
      status: 'completed' as const
    },
    {
      id: 3,
      text: '팀워크에서 본인의 역할은 무엇인가요?',
      status: 'pending' as const
    }
  ]

  const completedCount = questions.filter(q => q.status === 'completed').length
  const totalCount = questions.length

  return { questions, completedCount, totalCount }
}
