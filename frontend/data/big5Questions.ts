export interface Big5Question {
  id: string
  text: string
  keyed: 'plus' | 'minus' // plus: 정방향, minus: 역방향
  domain: 'O' | 'C' | 'E' | 'A' | 'N' // O: 개방성, C: 성실성, E: 외향성, A: 우호성, N: 신경성
  facet: number
  num: number
  choices: Array<{
    text: string
    score: number
    color: number
  }>
}

// 공통 선택지
const COMMON_CHOICES = [
  { text: '전혀 그렇지 않다', score: 1, color: 1 },
  { text: '그렇지 않다', score: 2, color: 2 },
  { text: '보통이다', score: 3, color: 3 },
  { text: '그렇다', score: 4, color: 4 },
  { text: '매우 그렇다', score: 5, color: 5 }
]

// 개방성 (Openness) - 24개 질문 (각 facet당 4개씩)
const OPENNESS_QUESTIONS: Big5Question[] = [
  // Facet 1: 상상력 (Imagination)
  { id: 'o1', text: '상상력이 풍부합니다', keyed: 'plus', domain: 'O', facet: 1, num: 1, choices: COMMON_CHOICES },
  { id: 'o2', text: '환상적인 이야기를 좋아합니다', keyed: 'plus', domain: 'O', facet: 1, num: 2, choices: COMMON_CHOICES },
  { id: 'o3', text: '꿈을 자주 꿉니다', keyed: 'plus', domain: 'O', facet: 1, num: 3, choices: COMMON_CHOICES },
  { id: 'o4', text: '창의적인 활동을 즐깁니다', keyed: 'plus', domain: 'O', facet: 1, num: 4, choices: COMMON_CHOICES },

  // Facet 2: 예술적 관심 (Artistic Interests)
  { id: 'o5', text: '예술 작품을 감상하는 것을 좋아합니다', keyed: 'plus', domain: 'O', facet: 2, num: 5, choices: COMMON_CHOICES },
  { id: 'o6', text: '음악을 자주 듣습니다', keyed: 'plus', domain: 'O', facet: 2, num: 6, choices: COMMON_CHOICES },
  { id: 'o7', text: '시나 소설을 읽는 것을 좋아합니다', keyed: 'plus', domain: 'O', facet: 2, num: 7, choices: COMMON_CHOICES },
  { id: 'o8', text: '미술관이나 박물관을 자주 방문합니다', keyed: 'plus', domain: 'O', facet: 2, num: 8, choices: COMMON_CHOICES },

  // Facet 3: 감정성 (Emotionality)
  { id: 'o9', text: '감정을 깊이 느낍니다', keyed: 'plus', domain: 'O', facet: 3, num: 9, choices: COMMON_CHOICES },
  { id: 'o10', text: '예술 작품에 감동받습니다', keyed: 'plus', domain: 'O', facet: 3, num: 10, choices: COMMON_CHOICES },
  { id: 'o11', text: '자연의 아름다움에 감탄합니다', keyed: 'plus', domain: 'O', facet: 3, num: 11, choices: COMMON_CHOICES },
  { id: 'o12', text: '감정적인 경험을 중요하게 생각합니다', keyed: 'plus', domain: 'O', facet: 3, num: 12, choices: COMMON_CHOICES },

  // Facet 4: 모험성 (Adventurousness)
  { id: 'o13', text: '새로운 경험을 시도하는 것을 좋아합니다', keyed: 'plus', domain: 'O', facet: 4, num: 13, choices: COMMON_CHOICES },
  { id: 'o14', text: '여행을 자주 다닙니다', keyed: 'plus', domain: 'O', facet: 4, num: 14, choices: COMMON_CHOICES },
  { id: 'o15', text: '새로운 음식을 시도하는 것을 좋아합니다', keyed: 'plus', domain: 'O', facet: 4, num: 15, choices: COMMON_CHOICES },
  { id: 'o16', text: '변화를 두려워하지 않습니다', keyed: 'plus', domain: 'O', facet: 4, num: 16, choices: COMMON_CHOICES },

  // Facet 5: 지성 (Intellect)
  { id: 'o17', text: '추상적인 개념에 대해 생각하는 것을 좋아합니다', keyed: 'plus', domain: 'O', facet: 5, num: 17, choices: COMMON_CHOICES },
  { id: 'o18', text: '철학적인 주제에 관심이 많습니다', keyed: 'plus', domain: 'O', facet: 5, num: 18, choices: COMMON_CHOICES },
  { id: 'o19', text: '복잡한 문제를 해결하는 것을 즐깁니다', keyed: 'plus', domain: 'O', facet: 5, num: 19, choices: COMMON_CHOICES },
  { id: 'o20', text: '지적 대화를 좋아합니다', keyed: 'plus', domain: 'O', facet: 5, num: 20, choices: COMMON_CHOICES },

  // Facet 6: 자유주의 (Liberalism)
  { id: 'o21', text: '전통적인 방식보다는 새로운 방식을 선호합니다', keyed: 'plus', domain: 'O', facet: 6, num: 21, choices: COMMON_CHOICES },
  { id: 'o22', text: '권위에 의문을 제기합니다', keyed: 'plus', domain: 'O', facet: 6, num: 22, choices: COMMON_CHOICES },
  { id: 'o23', text: '사회적 변화를 지지합니다', keyed: 'plus', domain: 'O', facet: 6, num: 23, choices: COMMON_CHOICES },
  { id: 'o24', text: '다양한 관점을 수용합니다', keyed: 'plus', domain: 'O', facet: 6, num: 24, choices: COMMON_CHOICES }
]

// 성실성 (Conscientiousness) - 24개 질문
const CONSCIENTIOUSNESS_QUESTIONS: Big5Question[] = [
  // Facet 1: 자기효능감 (Self-Efficacy)
  { id: 'c1', text: '자신의 능력을 믿습니다', keyed: 'plus', domain: 'C', facet: 1, num: 25, choices: COMMON_CHOICES },
  { id: 'c2', text: '어려운 일도 해낼 수 있다고 생각합니다', keyed: 'plus', domain: 'C', facet: 1, num: 26, choices: COMMON_CHOICES },
  { id: 'c3', text: '목표를 달성할 수 있다고 확신합니다', keyed: 'plus', domain: 'C', facet: 1, num: 27, choices: COMMON_CHOICES },
  { id: 'c4', text: '도전적인 과제를 좋아합니다', keyed: 'plus', domain: 'C', facet: 1, num: 28, choices: COMMON_CHOICES },

  // Facet 2: 체계성 (Orderliness)
  { id: 'c5', text: '일을 체계적으로 처리합니다', keyed: 'plus', domain: 'C', facet: 2, num: 29, choices: COMMON_CHOICES },
  { id: 'c6', text: '물건을 정리정돈하는 것을 좋아합니다', keyed: 'plus', domain: 'C', facet: 2, num: 30, choices: COMMON_CHOICES },
  { id: 'c7', text: '계획을 세우는 것을 좋아합니다', keyed: 'plus', domain: 'C', facet: 2, num: 31, choices: COMMON_CHOICES },
  { id: 'c8', text: '일정을 잘 지킵니다', keyed: 'plus', domain: 'C', facet: 2, num: 32, choices: COMMON_CHOICES },

  // Facet 3: 의무감 (Dutifulness)
  { id: 'c9', text: '약속을 잘 지킵니다', keyed: 'plus', domain: 'C', facet: 3, num: 33, choices: COMMON_CHOICES },
  { id: 'c10', text: '책임감이 강합니다', keyed: 'plus', domain: 'C', facet: 3, num: 34, choices: COMMON_CHOICES },
  { id: 'c11', text: '규칙을 잘 따릅니다', keyed: 'plus', domain: 'C', facet: 3, num: 35, choices: COMMON_CHOICES },
  { id: 'c12', text: '의무를 소홀히 하지 않습니다', keyed: 'plus', domain: 'C', facet: 3, num: 36, choices: COMMON_CHOICES },

  // Facet 4: 성취추구 (Achievement Striving)
  { id: 'c13', text: '목표를 달성하기 위해 노력합니다', keyed: 'plus', domain: 'C', facet: 4, num: 37, choices: COMMON_CHOICES },
  { id: 'c14', text: '성취욕이 강합니다', keyed: 'plus', domain: 'C', facet: 4, num: 38, choices: COMMON_CHOICES },
  { id: 'c15', text: '완벽을 추구합니다', keyed: 'plus', domain: 'C', facet: 4, num: 39, choices: COMMON_CHOICES },
  { id: 'c16', text: '성공을 위해 열심히 일합니다', keyed: 'plus', domain: 'C', facet: 4, num: 40, choices: COMMON_CHOICES },

  // Facet 5: 자기통제 (Self-Discipline)
  { id: 'c17', text: '자기 통제력이 좋습니다', keyed: 'plus', domain: 'C', facet: 5, num: 41, choices: COMMON_CHOICES },
  { id: 'c18', text: '유혹에 잘 빠지지 않습니다', keyed: 'plus', domain: 'C', facet: 5, num: 42, choices: COMMON_CHOICES },
  { id: 'c19', text: '집중력이 좋습니다', keyed: 'plus', domain: 'C', facet: 5, num: 43, choices: COMMON_CHOICES },
  { id: 'c20', text: '인내심이 강합니다', keyed: 'plus', domain: 'C', facet: 5, num: 44, choices: COMMON_CHOICES },

  // Facet 6: 신중함 (Cautiousness)
  { id: 'c21', text: '신중하게 결정을 내립니다', keyed: 'plus', domain: 'C', facet: 6, num: 45, choices: COMMON_CHOICES },
  { id: 'c22', text: '충동적으로 행동하지 않습니다', keyed: 'plus', domain: 'C', facet: 6, num: 46, choices: COMMON_CHOICES },
  { id: 'c23', text: '위험을 피하려고 합니다', keyed: 'plus', domain: 'C', facet: 6, num: 47, choices: COMMON_CHOICES },
  { id: 'c24', text: '신중하게 계획을 세웁니다', keyed: 'plus', domain: 'C', facet: 6, num: 48, choices: COMMON_CHOICES }
]

// 외향성 (Extraversion) - 24개 질문
const EXTRAVERSION_QUESTIONS: Big5Question[] = [
  // Facet 1: 친화성 (Friendliness)
  { id: 'e1', text: '사람들과 어울리는 것을 좋아합니다', keyed: 'plus', domain: 'E', facet: 1, num: 49, choices: COMMON_CHOICES },
  { id: 'e2', text: '새로운 사람을 만나는 것을 좋아합니다', keyed: 'plus', domain: 'E', facet: 1, num: 50, choices: COMMON_CHOICES },
  { id: 'e3', text: '사교적인 성격입니다', keyed: 'plus', domain: 'E', facet: 1, num: 51, choices: COMMON_CHOICES },
  { id: 'e4', text: '친구가 많습니다', keyed: 'plus', domain: 'E', facet: 1, num: 52, choices: COMMON_CHOICES },

  // Facet 2: 사교성 (Gregariousness)
  { id: 'e5', text: '파티나 모임에서 활발합니다', keyed: 'plus', domain: 'E', facet: 2, num: 53, choices: COMMON_CHOICES },
  { id: 'e6', text: '그룹 활동을 좋아합니다', keyed: 'plus', domain: 'E', facet: 2, num: 54, choices: COMMON_CHOICES },
  { id: 'e7', text: '많은 사람들과 함께 있는 것을 좋아합니다', keyed: 'plus', domain: 'E', facet: 2, num: 55, choices: COMMON_CHOICES },
  { id: 'e8', text: '사회적 모임에 자주 참석합니다', keyed: 'plus', domain: 'E', facet: 2, num: 56, choices: COMMON_CHOICES },

  // Facet 3: 주장성 (Assertiveness)
  { id: 'e9', text: '리더십을 발휘하는 것을 좋아합니다', keyed: 'plus', domain: 'E', facet: 3, num: 57, choices: COMMON_CHOICES },
  { id: 'e10', text: '의견을 적극적으로 표현합니다', keyed: 'plus', domain: 'E', facet: 3, num: 58, choices: COMMON_CHOICES },
  { id: 'e11', text: '다른 사람을 설득하는 것을 좋아합니다', keyed: 'plus', domain: 'E', facet: 3, num: 59, choices: COMMON_CHOICES },
  { id: 'e12', text: '주도적으로 행동합니다', keyed: 'plus', domain: 'E', facet: 3, num: 60, choices: COMMON_CHOICES },

  // Facet 4: 활동성 (Activity Level)
  { id: 'e13', text: '활동적이고 에너지가 넘칩니다', keyed: 'plus', domain: 'E', facet: 4, num: 61, choices: COMMON_CHOICES },
  { id: 'e14', text: '빠른 속도로 일합니다', keyed: 'plus', domain: 'E', facet: 4, num: 62, choices: COMMON_CHOICES },
  { id: 'e15', text: '운동을 자주 합니다', keyed: 'plus', domain: 'E', facet: 4, num: 63, choices: COMMON_CHOICES },
  { id: 'e16', text: '바쁘게 지내는 것을 좋아합니다', keyed: 'plus', domain: 'E', facet: 4, num: 64, choices: COMMON_CHOICES },

  // Facet 5: 자극추구 (Excitement Seeking)
  { id: 'e17', text: '자극을 추구합니다', keyed: 'plus', domain: 'E', facet: 5, num: 65, choices: COMMON_CHOICES },
  { id: 'e18', text: '모험적인 활동을 좋아합니다', keyed: 'plus', domain: 'E', facet: 5, num: 66, choices: COMMON_CHOICES },
  { id: 'e19', text: '스릴을 즐깁니다', keyed: 'plus', domain: 'E', facet: 5, num: 67, choices: COMMON_CHOICES },
  { id: 'e20', text: '새로운 경험을 추구합니다', keyed: 'plus', domain: 'E', facet: 5, num: 68, choices: COMMON_CHOICES },

  // Facet 6: 쾌활함 (Cheerfulness)
  { id: 'e21', text: '쾌활하고 긍정적입니다', keyed: 'plus', domain: 'E', facet: 6, num: 69, choices: COMMON_CHOICES },
  { id: 'e22', text: '웃음을 자주 잃지 않습니다', keyed: 'plus', domain: 'E', facet: 6, num: 70, choices: COMMON_CHOICES },
  { id: 'e23', text: '낙천적인 성격입니다', keyed: 'plus', domain: 'E', facet: 6, num: 71, choices: COMMON_CHOICES },
  { id: 'e24', text: '기분이 좋은 편입니다', keyed: 'plus', domain: 'E', facet: 6, num: 72, choices: COMMON_CHOICES }
]

// 우호성 (Agreeableness) - 24개 질문
const AGREEABLENESS_QUESTIONS: Big5Question[] = [
  // Facet 1: 신뢰 (Trust)
  { id: 'a1', text: '다른 사람을 신뢰합니다', keyed: 'plus', domain: 'A', facet: 1, num: 73, choices: COMMON_CHOICES },
  { id: 'a2', text: '사람들의 동기를 의심하지 않습니다', keyed: 'plus', domain: 'A', facet: 1, num: 74, choices: COMMON_CHOICES },
  { id: 'a3', text: '다른 사람이 선의를 가지고 있다고 믿습니다', keyed: 'plus', domain: 'A', facet: 1, num: 75, choices: COMMON_CHOICES },
  { id: 'a4', text: '사람들을 긍정적으로 봅니다', keyed: 'plus', domain: 'A', facet: 1, num: 76, choices: COMMON_CHOICES },

  // Facet 2: 도덕성 (Morality)
  { id: 'a5', text: '도덕적 가치를 중요하게 생각합니다', keyed: 'plus', domain: 'A', facet: 2, num: 77, choices: COMMON_CHOICES },
  { id: 'a6', text: '정직한 사람입니다', keyed: 'plus', domain: 'A', facet: 2, num: 78, choices: COMMON_CHOICES },
  { id: 'a7', text: '윤리적인 행동을 합니다', keyed: 'plus', domain: 'A', facet: 2, num: 79, choices: COMMON_CHOICES },
  { id: 'a8', text: '올바른 일을 하려고 노력합니다', keyed: 'plus', domain: 'A', facet: 2, num: 80, choices: COMMON_CHOICES },

  // Facet 3: 이타성 (Altruism)
  { id: 'a9', text: '다른 사람을 도와주는 것을 좋아합니다', keyed: 'plus', domain: 'A', facet: 3, num: 81, choices: COMMON_CHOICES },
  { id: 'a10', text: '자원봉사 활동에 참여합니다', keyed: 'plus', domain: 'A', facet: 3, num: 82, choices: COMMON_CHOICES },
  { id: 'a11', text: '다른 사람의 고통을 덜어주려고 합니다', keyed: 'plus', domain: 'A', facet: 3, num: 83, choices: COMMON_CHOICES },
  { id: 'a12', text: '이타적인 행동을 합니다', keyed: 'plus', domain: 'A', facet: 3, num: 84, choices: COMMON_CHOICES },

  // Facet 4: 협력 (Cooperation)
  { id: 'a13', text: '협력적인 태도를 보입니다', keyed: 'plus', domain: 'A', facet: 4, num: 85, choices: COMMON_CHOICES },
  { id: 'a14', text: '갈등을 피하려고 합니다', keyed: 'plus', domain: 'A', facet: 4, num: 86, choices: COMMON_CHOICES },
  { id: 'a15', text: '다른 사람과 잘 협력합니다', keyed: 'plus', domain: 'A', facet: 4, num: 87, choices: COMMON_CHOICES },
  { id: 'a16', text: '팀워크를 중시합니다', keyed: 'plus', domain: 'A', facet: 4, num: 88, choices: COMMON_CHOICES },

  // Facet 5: 겸손 (Modesty)
  { id: 'a17', text: '겸손한 성격입니다', keyed: 'plus', domain: 'A', facet: 5, num: 89, choices: COMMON_CHOICES },
  { id: 'a18', text: '자랑하는 것을 좋아하지 않습니다', keyed: 'plus', domain: 'A', facet: 5, num: 90, choices: COMMON_CHOICES },
  { id: 'a19', text: '자신을 낮게 평가합니다', keyed: 'plus', domain: 'A', facet: 5, num: 91, choices: COMMON_CHOICES },
  { id: 'a20', text: '겸손하게 행동합니다', keyed: 'plus', domain: 'A', facet: 5, num: 92, choices: COMMON_CHOICES },

  // Facet 6: 공감 (Sympathy)
  { id: 'a21', text: '다른 사람의 감정을 잘 이해합니다', keyed: 'plus', domain: 'A', facet: 6, num: 93, choices: COMMON_CHOICES },
  { id: 'a22', text: '다른 사람의 입장에서 생각합니다', keyed: 'plus', domain: 'A', facet: 6, num: 94, choices: COMMON_CHOICES },
  { id: 'a23', text: '공감능력이 뛰어납니다', keyed: 'plus', domain: 'A', facet: 6, num: 95, choices: COMMON_CHOICES },
  { id: 'a24', text: '다른 사람의 감정에 민감합니다', keyed: 'plus', domain: 'A', facet: 6, num: 96, choices: COMMON_CHOICES }
]

// 신경성 (Neuroticism) - 24개 질문
const NEUROTICISM_QUESTIONS: Big5Question[] = [
  // Facet 1: 불안 (Anxiety)
  { id: 'n1', text: '걱정이 많습니다', keyed: 'plus', domain: 'N', facet: 1, num: 97, choices: COMMON_CHOICES },
  { id: 'n2', text: '불안한 기분이 자주 듭니다', keyed: 'plus', domain: 'N', facet: 1, num: 98, choices: COMMON_CHOICES },
  { id: 'n3', text: '스트레스를 많이 받습니다', keyed: 'plus', domain: 'N', facet: 1, num: 99, choices: COMMON_CHOICES },
  { id: 'n4', text: '걱정이 많아 잠을 못 이룹니다', keyed: 'plus', domain: 'N', facet: 1, num: 100, choices: COMMON_CHOICES },

  // Facet 2: 분노 (Anger)
  { id: 'n5', text: '쉽게 화를 냅니다', keyed: 'plus', domain: 'N', facet: 2, num: 101, choices: COMMON_CHOICES },
  { id: 'n6', text: '짜증을 자주 냅니다', keyed: 'plus', domain: 'N', facet: 2, num: 102, choices: COMMON_CHOICES },
  { id: 'n7', text: '분노를 조절하기 어렵습니다', keyed: 'plus', domain: 'N', facet: 2, num: 103, choices: COMMON_CHOICES },
  { id: 'n8', text: '화가 나면 오래 지속됩니다', keyed: 'plus', domain: 'N', facet: 2, num: 104, choices: COMMON_CHOICES },

  // Facet 3: 우울 (Depression)
  { id: 'n9', text: '우울한 기분이 자주 듭니다', keyed: 'plus', domain: 'N', facet: 3, num: 105, choices: COMMON_CHOICES },
  { id: 'n10', text: '의기소침해집니다', keyed: 'plus', domain: 'N', facet: 3, num: 106, choices: COMMON_CHOICES },
  { id: 'n11', text: '슬픈 감정이 자주 듭니다', keyed: 'plus', domain: 'N', facet: 3, num: 107, choices: COMMON_CHOICES },
  { id: 'n12', text: '절망적인 기분이 듭니다', keyed: 'plus', domain: 'N', facet: 3, num: 108, choices: COMMON_CHOICES },

  // Facet 4: 자의식 (Self-Consciousness)
  { id: 'n13', text: '자신에 대해 자주 의식합니다', keyed: 'plus', domain: 'N', facet: 4, num: 109, choices: COMMON_CHOICES },
  { id: 'n14', text: '다른 사람이 자신을 어떻게 생각하는지 걱정합니다', keyed: 'plus', domain: 'N', facet: 4, num: 110, choices: COMMON_CHOICES },
  { id: 'n15', text: '부끄러움을 자주 느낍니다', keyed: 'plus', domain: 'N', facet: 4, num: 111, choices: COMMON_CHOICES },
  { id: 'n16', text: '자신감이 부족합니다', keyed: 'plus', domain: 'N', facet: 4, num: 112, choices: COMMON_CHOICES },

  // Facet 5: 무절제 (Immoderation)
  { id: 'n17', text: '충동적으로 행동하는 경우가 많습니다', keyed: 'plus', domain: 'N', facet: 5, num: 113, choices: COMMON_CHOICES },
  { id: 'n18', text: '자제력이 부족합니다', keyed: 'plus', domain: 'N', facet: 5, num: 114, choices: COMMON_CHOICES },
  { id: 'n19', text: '욕구를 조절하기 어렵습니다', keyed: 'plus', domain: 'N', facet: 5, num: 115, choices: COMMON_CHOICES },
  { id: 'n20', text: '즉흥적으로 행동합니다', keyed: 'plus', domain: 'N', facet: 5, num: 116, choices: COMMON_CHOICES },

  // Facet 6: 취약성 (Vulnerability)
  { id: 'n21', text: '스트레스에 취약합니다', keyed: 'plus', domain: 'N', facet: 6, num: 117, choices: COMMON_CHOICES },
  { id: 'n22', text: '어려운 상황에서 무력감을 느낍니다', keyed: 'plus', domain: 'N', facet: 6, num: 118, choices: COMMON_CHOICES },
  { id: 'n23', text: '압박감을 잘 견디지 못합니다', keyed: 'plus', domain: 'N', facet: 6, num: 119, choices: COMMON_CHOICES },
  { id: 'n24', text: '위기 상황에서 당황합니다', keyed: 'plus', domain: 'N', facet: 6, num: 120, choices: COMMON_CHOICES }
]

// 모든 질문을 합쳐서 120개 질문 생성
export const BIG5_QUESTIONS: Big5Question[] = [
  ...OPENNESS_QUESTIONS,
  ...CONSCIENTIOUSNESS_QUESTIONS,
  ...EXTRAVERSION_QUESTIONS,
  ...AGREEABLENESS_QUESTIONS,
  ...NEUROTICISM_QUESTIONS
]
