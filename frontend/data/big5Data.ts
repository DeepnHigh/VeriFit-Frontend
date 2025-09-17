// Big5 성격검사 관련 데이터와 설명

export interface Big5DataItem {
  label: string
  score: number
  color: string
  description: string
}

export interface Big5ChartDataItem {
  label: string
  score: number
  color: string
  description: string
}

// Big5 색상 팔레트
export const BIG5_PALETTE = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'] as const

// Big5 항목 정의
export const BIG5_ITEMS = [
  { label: '개방성', key: 'openness_score', level: 'openness_level' },
  { label: '성실성', key: 'conscientiousness_score', level: 'conscientiousness_level' },
  { label: '외향성', key: 'extraversion_score', level: 'extraversion_level' },
  { label: '우호성', key: 'agreeableness_score', level: 'agreeableness_level' },
  { label: '신경성', key: 'neuroticism_score', level: 'neuroticism_level' },
] as const

// Big5 성격 분석 설명
export const BIG5_DESCRIPTIONS: Record<string, Record<string, string>> = {
  '개방성': {
    low: '당신의 경험에 대한 개방성 점수는 낮습니다. 이는 당신이 명확하고 단순한 방식으로 생각하는 것을 선호한다는 것을 나타냅니다. 다른 사람들은 당신을 현실적이고 실용적이며 보수적인 사람으로 묘사합니다.',
    neutral: '당신의 경험에 대한 개방성 점수는 평균입니다. 이는 당신이 전통을 즐기지만 새로운 것들을 시도할 의향이 있다는 것을 나타냅니다. 당신의 사고는 단순하지도 복잡하지도 않습니다. 다른 사람들에게는 잘 교육받은 사람으로 보이지만 지식인은 아닙니다.',
    high: '당신의 경험에 대한 개방성 점수는 높습니다. 이는 당신이 새로움, 다양성, 변화를 즐긴다는 것을 나타냅니다. 당신은 호기심이 많고, 상상력이 풍부하며 창의적입니다.'
  },
  '성실성': {
    low: '당신의 성실성 점수는 낮습니다. 이는 당신이 현재 순간을 위해 살고 지금 좋은 느낌이 드는 것을 하는 것을 선호한다는 것을 나타냅니다. 당신의 일은 부주의하고 체계적이지 않은 경향이 있습니다.',
    neutral: '당신의 성실성 점수는 평균입니다. 이는 당신이 합리적으로 신뢰할 수 있고, 체계적이며, 자기 통제력이 있다는 것을 의미합니다.',
    high: '당신의 성실성 점수는 높습니다. 이는 당신이 명확한 목표를 설정하고 결단력 있게 추구한다는 것을 의미합니다. 사람들은 당신을 신뢰할 수 있고 성실한 사람으로 간주합니다.'
  },
  '외향성': {
    low: '당신의 외향성 점수는 낮습니다. 이는 당신이 내성적이고, 조용하며, 말이 적다는 것을 나타냅니다. 당신은 혼자 있는 시간과 혼자 하는 활동을 즐깁니다. 당신의 사회화는 몇 명의 가까운 친구들로 제한되는 경향이 있습니다.',
    neutral: '당신의 외향성 점수는 평균입니다. 이는 당신이 억제된 고독한 사람도 활발한 수다쟁이도 아니라는 것을 나타냅니다. 당신은 다른 사람들과 함께 있는 시간도 즐기지만 혼자 있는 시간도 즐깁니다.',
    high: '당신의 외향성 점수는 높습니다. 이는 당신이 사교적이고, 외향적이며, 에너지가 넘치고, 활기찬 사람임을 나타냅니다. 당신은 대부분의 시간을 사람들과 함께 있는 것을 선호합니다.'
  },
  '우호성': {
    low: '당신의 우호성 점수는 낮습니다. 이는 당신이 다른 사람들의 필요보다는 자신의 필요에 더 관심이 있다는 것을 나타냅니다. 사람들은 당신을 강인하고, 비판적이며, 타협하지 않는 사람으로 봅니다.',
    neutral: '당신의 우호성 수준은 평균입니다. 이는 다른 사람들의 필요에 대한 어느 정도의 관심을 나타내지만, 일반적으로 다른 사람들을 위해 자신을 희생하려고 하지 않는다는 것을 의미합니다.',
    high: '당신의 높은 우호성 수준은 다른 사람들의 필요와 복지에 대한 강한 관심을 나타냅니다. 당신은 상냥하고, 동정적이며, 협조적입니다.'
  },
  '신경성': {
    low: '당신의 신경증 점수는 낮습니다. 이는 당신이 예외적으로 침착하고 차분하며 동요하지 않는 사람임을 나타냅니다. 당신은 대부분의 사람들이 스트레스가 있다고 묘사하는 상황에서도 강렬한 감정으로 반응하지 않습니다.',
    neutral: '당신의 신경증 점수는 평균입니다. 이는 당신의 감정적 반응 수준이 일반 인구의 전형적인 수준이라는 것을 나타냅니다. 스트레스가 많고 좌절스러운 상황은 당신에게 어느 정도 불쾌하지만, 일반적으로 이러한 감정을 극복하고 이러한 상황에 대처할 수 있습니다.',
    high: '당신의 신경증 점수는 높습니다. 이는 당신이 대부분의 사람들이 살아가는 정상적인 요구로 간주하는 것에도 쉽게 화가 난다는 것을 나타냅니다. 사람들은 당신을 민감하고 감정적인 사람으로 간주합니다.'
  }
}

// Big5 해석 섹션의 일반적인 설명
export const BIG5_GENERAL_INTERPRETATIONS = {
  openness: '개방성: 경험에 대한 개방성은 상상력이 풍부하고 창의적인 사람들과 현실적이고 전통적인 사람들을 구별하는 인지 스타일의 차원을 설명합니다.',
  conscientiousness: '성실성: 성실성은 우리가 충동을 어떻게 통제하고, 조절하며, 지시하는지를 다룹니다.',
  extraversion: '외향성: 외향성은 외부 세계와의 두드러진 관여로 표시됩니다.',
  agreeableness: '우호성: 우호성은 협력과 사회적 조화에 대한 관심의 개인 차이를 반영합니다. 우호적인 개인은 다른 사람들과 잘 지내는 것을 중요하게 생각합니다',
  neuroticism: '신경성: 신경증은 부정적인 감정을 경험하는 경향을 나타냅니다.(낮을수록 안정적)'
}

// Big5 데이터 생성 유틸리티 함수들
export const createBig5Description = (label: string, level: string): string => {
  return BIG5_DESCRIPTIONS[label]?.[level] || '검사를 완료하면 결과가 표시됩니다.'
}

export const createBig5DataFromApi = (apiResult: any): Big5DataItem[] => {
  return BIG5_ITEMS.map((item, idx) => {
    const score = Number(apiResult[item.key] ?? 0)
    const level = apiResult[item.level] || 'neutral'
    
    return {
      label: item.label,
      score,
      color: BIG5_PALETTE[idx % BIG5_PALETTE.length],
      description: createBig5Description(item.label, level)
    }
  })
}

export const createBig5ChartDataFromApi = (apiResult: any): Big5ChartDataItem[] => {
  return BIG5_ITEMS.map((item, idx) => ({
    label: item.label,
    score: Number(apiResult[item.key] ?? 0),
    color: BIG5_PALETTE[idx % BIG5_PALETTE.length],
    description: ''
  }))
}
