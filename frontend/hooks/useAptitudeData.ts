import { useState, useEffect } from 'react'
import { Big5Result } from './useBig5Questions'

type Big5Point = { score: number; label: string; color: string; description: string }

export function useAptitudeData() {
  const [big5Data, setBig5Data] = useState<Big5Point[]>([
    { 
      score: 0, 
      label: '개방성', 
      color: '#4CAF50',
      description: '검사를 완료하면 결과가 표시됩니다.'
    },
    { 
      score: 0, 
      label: '성실성', 
      color: '#2196F3',
      description: '검사를 완료하면 결과가 표시됩니다.'
    },
    { 
      score: 0, 
      label: '외향성', 
      color: '#FF9800',
      description: '검사를 완료하면 결과가 표시됩니다.'
    },
    { 
      score: 0, 
      label: '우호성', 
      color: '#9C27B0',
      description: '검사를 완료하면 결과가 표시됩니다.'
    },
    { 
      score: 0, 
      label: '신경성', 
      color: '#f44336',
      description: '검사를 완료하면 결과가 표시됩니다.'
    }
  ])

  const [hasCompletedTest, setHasCompletedTest] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 검사 결과 불러오기
    const savedResult = localStorage.getItem('big5Result')
    if (savedResult) {
      try {
        const result: Big5Result = JSON.parse(savedResult)
        updateBig5Data(result)
        setHasCompletedTest(true)
      } catch (error) {
        console.error('검사 결과를 불러오는 중 오류가 발생했습니다:', error)
      }
    }
  }, [])

  const updateBig5Data = (result: Big5Result) => {
    // 전문적인 해석이 있으면 사용, 없으면 기본 해석 사용
    const getDescription = (domain: string, score: number) => {
      if (result.interpretations && result.interpretations.length > 0) {
        const interpretation = result.interpretations.find((i: any) => i.domain === domain)
        if (interpretation) {
          return interpretation.text.replace(/<[^>]*>/g, '') // HTML 태그 제거
        }
      }
      
      // 기본 해석 사용 (scoreText 기반)
      if (result.rawScores && result.rawScores[domain]) {
        const scoreText = result.rawScores[domain].result
        switch (domain) {
          case 'O': return getOpennessDescription(scoreText)
          case 'C': return getConscientiousnessDescription(scoreText)
          case 'E': return getExtraversionDescription(scoreText)
          case 'A': return getAgreeablenessDescription(scoreText)
          case 'N': return getNeuroticismDescription(scoreText)
          default: return '검사를 완료하면 결과가 표시됩니다.'
        }
      }
      
      return '검사를 완료하면 결과가 표시됩니다.'
    }

    const domainLabels = {
      'O': '개방성',
      'C': '성실성',
      'E': '외향성', 
      'A': '우호성',
      'N': '신경성'
    }

    const domainColors = {
      'O': '#4CAF50',
      'C': '#2196F3',
      'E': '#FF9800',
      'A': '#9C27B0', 
      'N': '#f44336'
    }

    setBig5Data([
      { 
        score: result.openness, 
        label: domainLabels.O, 
        color: domainColors.O,
        description: getDescription('O', result.openness)
      },
      { 
        score: result.conscientiousness, 
        label: domainLabels.C, 
        color: domainColors.C,
        description: getDescription('C', result.conscientiousness)
      },
      { 
        score: result.extraversion, 
        label: domainLabels.E, 
        color: domainColors.E,
        description: getDescription('E', result.extraversion)
      },
      { 
        score: result.agreeableness, 
        label: domainLabels.A, 
        color: domainColors.A,
        description: getDescription('A', result.agreeableness)
      },
      { 
        score: result.neuroticism, 
        label: domainLabels.N, 
        color: domainColors.N,
        description: getDescription('N', result.neuroticism)
      }
    ])
  }

  // Big5 표준 해석 (high, neutral, low 3단계)
  const getOpennessDescription = (scoreText: string): string => {
    const descriptions = {
      low: '당신의 경험에 대한 개방성 점수는 낮습니다. 이는 당신이 명확하고 단순한 방식으로 생각하는 것을 선호한다는 것을 나타냅니다. 다른 사람들은 당신을 현실적이고 실용적이며 보수적인 사람으로 묘사합니다.',
      neutral: '당신의 경험에 대한 개방성 점수는 평균입니다. 이는 당신이 전통을 즐기지만 새로운 것들을 시도할 의향이 있다는 것을 나타냅니다. 당신의 사고는 단순하지도 복잡하지도 않습니다. 다른 사람들에게는 잘 교육받은 사람으로 보이지만 지식인은 아닙니다.',
      high: '당신의 경험에 대한 개방성 점수는 높습니다. 이는 당신이 새로움, 다양성, 변화를 즐긴다는 것을 나타냅니다. 당신은 호기심이 많고, 상상력이 풍부하며 창의적입니다.'
    }
    return descriptions[scoreText as keyof typeof descriptions] || descriptions.neutral
  }

  const getConscientiousnessDescription = (scoreText: string): string => {
    const descriptions = {
      low: '당신의 성실성 점수는 낮습니다. 이는 당신이 현재 순간을 위해 살고 지금 좋은 느낌이 드는 것을 하는 것을 선호한다는 것을 나타냅니다. 당신의 일은 부주의하고 체계적이지 않은 경향이 있습니다.',
      neutral: '당신의 성실성 점수는 평균입니다. 이는 당신이 합리적으로 신뢰할 수 있고, 체계적이며, 자기 통제력이 있다는 것을 의미합니다.',
      high: '당신의 성실성 점수는 높습니다. 이는 당신이 명확한 목표를 설정하고 결단력 있게 추구한다는 것을 의미합니다. 사람들은 당신을 신뢰할 수 있고 성실한 사람으로 간주합니다.'
    }
    return descriptions[scoreText as keyof typeof descriptions] || descriptions.neutral
  }

  const getExtraversionDescription = (scoreText: string): string => {
    const descriptions = {
      low: '당신의 외향성 점수는 낮습니다. 이는 당신이 내성적이고, 조용하며, 말이 적다는 것을 나타냅니다. 당신은 혼자 있는 시간과 혼자 하는 활동을 즐깁니다. 당신의 사회화는 몇 명의 가까운 친구들로 제한되는 경향이 있습니다.',
      neutral: '당신의 외향성 점수는 평균입니다. 이는 당신이 억제된 고독한 사람도 활발한 수다쟁이도 아니라는 것을 나타냅니다. 당신은 다른 사람들과 함께 있는 시간도 즐기지만 혼자 있는 시간도 즐깁니다.',
      high: '당신의 외향성 점수는 높습니다. 이는 당신이 사교적이고, 외향적이며, 에너지가 넘치고, 활기찬 사람임을 나타냅니다. 당신은 대부분의 시간을 사람들과 함께 있는 것을 선호합니다.'
    }
    return descriptions[scoreText as keyof typeof descriptions] || descriptions.neutral
  }

  const getAgreeablenessDescription = (scoreText: string): string => {
    const descriptions = {
      low: '당신의 우호성 점수는 낮습니다. 이는 당신이 다른 사람들의 필요보다는 자신의 필요에 더 관심이 있다는 것을 나타냅니다. 사람들은 당신을 강인하고, 비판적이며, 타협하지 않는 사람으로 봅니다.',
      neutral: '당신의 우호성 수준은 평균입니다. 이는 다른 사람들의 필요에 대한 어느 정도의 관심을 나타내지만, 일반적으로 다른 사람들을 위해 자신을 희생하려고 하지 않는다는 것을 의미합니다.',
      high: '당신의 높은 우호성 수준은 다른 사람들의 필요와 복지에 대한 강한 관심을 나타냅니다. 당신은 상냥하고, 동정적이며, 협조적입니다.'
    }
    return descriptions[scoreText as keyof typeof descriptions] || descriptions.neutral
  }

  const getNeuroticismDescription = (scoreText: string): string => {
    const descriptions = {
      low: '당신의 신경증 점수는 낮습니다. 이는 당신이 예외적으로 침착하고 차분하며 동요하지 않는 사람임을 나타냅니다. 당신은 대부분의 사람들이 스트레스가 있다고 묘사하는 상황에서도 강렬한 감정으로 반응하지 않습니다.',
      neutral: '당신의 신경증 점수는 평균입니다. 이는 당신의 감정적 반응 수준이 일반 인구의 전형적인 수준이라는 것을 나타냅니다. 스트레스가 많고 좌절스러운 상황은 당신에게 어느 정도 불쾌하지만, 일반적으로 이러한 감정을 극복하고 이러한 상황에 대처할 수 있습니다.',
      high: '당신의 신경증 점수는 높습니다. 이는 당신이 대부분의 사람들이 살아가는 정상적인 요구로 간주하는 것에도 쉽게 화가 난다는 것을 나타냅니다. 사람들은 당신을 민감하고 감정적인 사람으로 간주합니다.'
    }
    return descriptions[scoreText as keyof typeof descriptions] || descriptions.neutral
  }

  return { 
    big5Data, 
    hasCompletedTest,
    updateBig5Data 
  }
}
