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

// 신경성 (Neuroticism) - 24개 질문 (사용자 제공 문구로 교체)
const NEUROTICISM_QUESTIONS: Big5Question[] = [
  // Facet 1: 불안 (Anxiety)
  { id: 'n1', text: '나는 걱정이 많은 편이다.', keyed: 'plus', domain: 'N', facet: 1, num: 1, choices: COMMON_CHOICES },
  { id: 'n2', text: '나는 안 좋은 일에 대해 두려워하는 편이다.', keyed: 'plus', domain: 'N', facet: 1, num: 31, choices: COMMON_CHOICES },
  { id: 'n3', text: '나는 많은 것들을 두려워하는 편이다.', keyed: 'plus', domain: 'N', facet: 1, num: 61, choices: COMMON_CHOICES },
  { id: 'n4', text: '나는 쉽게 스트레스를 받는 편이다.', keyed: 'plus', domain: 'N', facet: 1, num: 91, choices: COMMON_CHOICES },

  // Facet 2: 분노 (Anger)
  { id: 'n5', text: '나는 쉽게 화를 내는 편이다.', keyed: 'plus', domain: 'N', facet: 2, num: 6, choices: COMMON_CHOICES },
  { id: 'n6', text: '나는 쉽게 짜증을 내는 편이다.', keyed: 'plus', domain: 'N', facet: 2, num: 36, choices: COMMON_CHOICES },
  { id: 'n7', text: '나는 화가날 때 평정을 유지하기 어려운 편이다.', keyed: 'plus', domain: 'N', facet: 2, num: 66, choices: COMMON_CHOICES },
  { id: 'n8', text: '나는 쉽게 짜증 내지 않는 편이다.', keyed: 'minus', domain: 'N', facet: 2, num: 96, choices: COMMON_CHOICES },

  // Facet 3: 우울 (Depression)
  { id: 'n9', text: '나는 종종 우울함을 느끼는 편이다.', keyed: 'plus', domain: 'N', facet: 3, num: 11, choices: COMMON_CHOICES },
  { id: 'n10', text: '나는 내 자신을 싫어하는 편이다.', keyed: 'plus', domain: 'N', facet: 3, num: 41, choices: COMMON_CHOICES },
  { id: 'n11', text: '나는 자주 의기소침하는 편이다.', keyed: 'plus', domain: 'N', facet: 3, num: 71, choices: COMMON_CHOICES },
  { id: 'n12', text: '나는 내 자신에 대해 편안함을 느끼는 편이다.', keyed: 'minus', domain: 'N', facet: 3, num: 101, choices: COMMON_CHOICES },

  // Facet 4: 자의식 (Self-Consciousness)
  { id: 'n13', text: '나는 다른 사람에게 다가가는 것을 어려워하는 편이다.', keyed: 'plus', domain: 'N', facet: 4, num: 16, choices: COMMON_CHOICES },
  { id: 'n14', text: '나는 나에 대해 관심을 가지는 것을 두려워하는 편이다.', keyed: 'plus', domain: 'N', facet: 4, num: 46, choices: COMMON_CHOICES },
  { id: 'n16', text: '나는 친구들과 함께 있을 때 편안함을 느끼는 편이다.', keyed: 'plus', domain: 'N', facet: 4, num: 76, choices: COMMON_CHOICES },
  { id: 'n15', text: '나는 어려운 사회 상황에 개의치 않는 편이다.', keyed: 'minus', domain: 'N', facet: 4, num: 106, choices: COMMON_CHOICES },

  // Facet 5: 무절제 (Immoderation)
  { id: 'n17', text: '나는 폭식을 하는 편이다.', keyed: 'plus', domain: 'N', facet: 5, num: 21, choices: COMMON_CHOICES },
  { id: 'n18', text: '나는 과식을 하지 않는 편이다.', keyed: 'minus', domain: 'N', facet: 5, num: 51, choices: COMMON_CHOICES },
  { id: 'n19', text: '나는 유혹에 잘 빠져들지 않는 편이다.', keyed: 'minus', domain: 'N', facet: 5, num: 81, choices: COMMON_CHOICES },
  { id: 'n20', text: '나는 내 갈망을 조절 할 수 있는 편이다.', keyed: 'minus', domain: 'N', facet: 5, num: 111, choices: COMMON_CHOICES },

  // Facet 6: 취약성 (Vulnerability)
  { id: 'n21', text: '나는 공황 상태에 쉽게 빠지는 편이다.', keyed: 'plus', domain: 'N', facet: 6, num: 26, choices: COMMON_CHOICES },
  { id: 'n22', text: '나는 어떤 일 때문에 어쩔 줄 모르게 되는 편이다.', keyed: 'plus', domain: 'N', facet: 6, num: 56, choices: COMMON_CHOICES },
  { id: 'n24', text: '나는 내가 일을 감당할 수 없다고 느끼는 편이다.', keyed: 'plus', domain: 'N', facet: 6, num: 86, choices: COMMON_CHOICES },
  { id: 'n23', text: '나는 중압감 속에서 침착함을 유지하는 편이다.', keyed: 'minus', domain: 'N', facet: 6, num: 116, choices: COMMON_CHOICES }
]

// 외향성 (Extraversion) - 24개 질문 (사용자 제공 문구로 교체)
const EXTRAVERSION_QUESTIONS: Big5Question[] = [
  // Facet 1: 친화성 (Friendliness)
  { id: 'e1', text: '나는 쉽게 친구를 사귀는 편이다.', keyed: 'plus', domain: 'E', facet: 1, num: 2, choices: COMMON_CHOICES },
  { id: 'e2', text: '나는 다른 사람들 주변에 있을 때, 편안함을 느끼는 편이다.', keyed: 'plus', domain: 'E', facet: 1, num: 32, choices: COMMON_CHOICES },
  { id: 'e4', text: '나는 다른 사람들과 접촉을 피하는 편이다.', keyed: 'minus', domain: 'E', facet: 1, num: 62, choices: COMMON_CHOICES },
  { id: 'e3', text: '나는 남과 거리를 두는 편이다.', keyed: 'minus', domain: 'E', facet: 1, num: 92, choices: COMMON_CHOICES },

  // Facet 2: 사교성 (Gregariousness)
  { id: 'e5', text: '나는 다른 사람들이 많은 파티를 좋아하는 편이다.', keyed: 'plus', domain: 'E', facet: 2, num: 7, choices: COMMON_CHOICES },
  { id: 'e6', text: '나는 파티에서 많은 다른 사람들과 이야기를 하는 편이다.', keyed: 'plus', domain: 'E', facet: 2, num: 37, choices: COMMON_CHOICES },
  { id: 'e8', text: '나는 혼자 있는게 더 좋은 편이다.', keyed: 'minus', domain: 'E', facet: 2, num: 67, choices: COMMON_CHOICES },
  { id: 'e7', text: '나는 다른 사람들이 많은 곳을 피하는 편이다.', keyed: 'minus', domain: 'E', facet: 2, num: 97, choices: COMMON_CHOICES },

  // Facet 3: 주장성 (Assertiveness)
  { id: 'e9', text: '나는 리더로서 자질을 가졌다고 생각하는 편이다.', keyed: 'plus', domain: 'E', facet: 3, num: 12, choices: COMMON_CHOICES },
  { id: 'e10', text: '나는 다른 사람들을 이끄려고 노력하는 편이다.', keyed: 'plus', domain: 'E', facet: 3, num: 42, choices: COMMON_CHOICES },
  { id: 'e12', text: '나는 일을 내가 원하는대로 추진하려고 하는 편이다.', keyed: 'plus', domain: 'E', facet: 3, num: 72, choices: COMMON_CHOICES },
  { id: 'e11', text: '나는 남들이 앞서길 기다리는 편이다.', keyed: 'minus', domain: 'E', facet: 3, num: 102, choices: COMMON_CHOICES },

  // Facet 4: 활동성 (Activity Level)
  { id: 'e13', text: '나는 항상 바쁜 편이다.', keyed: 'plus', domain: 'E', facet: 4, num: 17, choices: COMMON_CHOICES },
  { id: 'e16', text: '나는 언제나 바쁘게 움직이는 편이다.', keyed: 'plus', domain: 'E', facet: 4, num: 47, choices: COMMON_CHOICES },
  { id: 'e14', text: '나는 여가 시간에 많은 것을 하는 편이다.', keyed: 'plus', domain: 'E', facet: 4, num: 77, choices: COMMON_CHOICES },
  { id: 'e15', text: '나는 느긋하게 지내는 것을 좋아하는 편이다.', keyed: 'minus', domain: 'E', facet: 4, num: 107, choices: COMMON_CHOICES },

  // Facet 5: 자극추구 (Excitement Seeking)
  { id: 'e17', text: '나는 신나는 걸 좋아하는 편이다.', keyed: 'plus', domain: 'E', facet: 5, num: 22, choices: COMMON_CHOICES },
  { id: 'e18', text: '나는 무언가 색다른 일을 찾아 다니는 편이다.', keyed: 'plus', domain: 'E', facet: 5, num: 52, choices: COMMON_CHOICES },
  { id: 'e20', text: '나는 앞 뒤 재지 않고 행동하는 편이다.', keyed: 'plus', domain: 'E', facet: 5, num: 82, choices: COMMON_CHOICES },
  { id: 'e19', text: '나는 미친 듯이 행동하는 편이다.', keyed: 'plus', domain: 'E', facet: 5, num: 112, choices: COMMON_CHOICES },

  // Facet 6: 쾌활함 (Cheerfulness)
  { id: 'e21', text: '나는 기쁠 때, 티내는 편이다.', keyed: 'plus', domain: 'E', facet: 6, num: 27, choices: COMMON_CHOICES },
  { id: 'e22', text: '나는 재미있는 사람인 편이다.', keyed: 'plus', domain: 'E', facet: 6, num: 57, choices: COMMON_CHOICES },
  { id: 'e24', text: '나는 살아있는게 좋은 편이다.', keyed: 'plus', domain: 'E', facet: 6, num: 87, choices: COMMON_CHOICES },
  { id: 'e23', text: '나는 인생을 긍정적으로 바라보는 편이다.', keyed: 'plus', domain: 'E', facet: 6, num: 117, choices: COMMON_CHOICES }
]

// 개방성 (Openness) - 24개 질문 (사용자 제공 문구로 교체)
const OPENNESS_QUESTIONS: Big5Question[] = [
  // Facet 1: 상상력 (Imagination)
  { id: 'o1', text: '나는 상상력이 풍부한 편이다.', keyed: 'plus', domain: 'O', facet: 1, num: 3, choices: COMMON_CHOICES },
  { id: 'o2', text: '나는 공상의 나래를 즐기는 편이다.', keyed: 'plus', domain: 'O', facet: 1, num: 33, choices: COMMON_CHOICES },
  { id: 'o3', text: '나는 몽상을 좋아하는 편이다.', keyed: 'plus', domain: 'O', facet: 1, num: 63, choices: COMMON_CHOICES },
  { id: 'o4', text: '나는 사색에 잠기는 것을 즐기는 편이다.', keyed: 'plus', domain: 'O', facet: 1, num: 93, choices: COMMON_CHOICES },

  // Facet 2: 예술적 관심 (Artistic Interests)
  { id: 'o5', text: '나는 예술이 중요하다고 믿는 편이다.', keyed: 'plus', domain: 'O', facet: 2, num: 8, choices: COMMON_CHOICES },
  { id: 'o6', text: '나는 다른 사람들이 알아차리지 못하는 것에서 아름다움을 보는 편이다.', keyed: 'plus', domain: 'O', facet: 2, num: 38, choices: COMMON_CHOICES },
  { id: 'o7', text: '나는 시를 좋아하지 않는 편이다.', keyed: 'minus', domain: 'O', facet: 2, num: 68, choices: COMMON_CHOICES },
  { id: 'o8', text: '나는 미술관에 가는 것을 좋아하지 않는 편이다.', keyed: 'minus', domain: 'O', facet: 2, num: 98, choices: COMMON_CHOICES },

  // Facet 3: 감정성 (Emotionality)
  { id: 'o9', text: '나는 종종 감정에 지배당하는 편이다.', keyed: 'plus', domain: 'O', facet: 3, num: 13, choices: COMMON_CHOICES },
  { id: 'o12', text: '나는 다른 사람들의 감정에 공감하는 편이다.', keyed: 'plus', domain: 'O', facet: 3, num: 43, choices: COMMON_CHOICES },
  { id: 'o10', text: '나는 내 감정에 대해 둔한 편이다.', keyed: 'minus', domain: 'O', facet: 3, num: 73, choices: COMMON_CHOICES },
  { id: 'o11', text: '나는 감정적인 사람들이 이해 못 하는 편이다.', keyed: 'minus', domain: 'O', facet: 3, num: 103, choices: COMMON_CHOICES },

  // Facet 4: 모험성 (Adventurousness)
  { id: 'o13', text: '나는 틀에 박히지 않은 것을 좋아하는 편이다.', keyed: 'plus', domain: 'O', facet: 4, num: 18, choices: COMMON_CHOICES },
  { id: 'o14', text: '나는 내가 아는 것에 생각하는 것을 선호하는 편이다.', keyed: 'minus', domain: 'O', facet: 4, num: 48, choices: COMMON_CHOICES },
  { id: 'o15', text: '나는 변화가 싫은 편이다.', keyed: 'minus', domain: 'O', facet: 4, num: 78, choices: COMMON_CHOICES },
  { id: 'o16', text: '나는 전통적인 방식에 대해 애착을 가지고 있는 편이다.', keyed: 'minus', domain: 'O', facet: 4, num: 108, choices: COMMON_CHOICES },

  // Facet 5: 지성 (Intellect)
  { id: 'o17', text: '나는 도전적인 자료를 읽는 것을 좋아하는 편이다.', keyed: 'plus', domain: 'O', facet: 5, num: 23, choices: COMMON_CHOICES },
  { id: 'o18', text: '나는 철학적인 논쟁을 피하는 편이다.', keyed: 'minus', domain: 'O', facet: 5, num: 53, choices: COMMON_CHOICES },
  { id: 'o19', text: '나는 추상적인 개념을 이해하는 것이 어려운 편이다.', keyed: 'minus', domain: 'O', facet: 5, num: 83, choices: COMMON_CHOICES },
  { id: 'o20', text: '나는 이론적인 토론에 대해 관심이 없는 편이다.', keyed: 'minus', domain: 'O', facet: 5, num: 113, choices: COMMON_CHOICES },

  // Facet 6: 자유주의 (Liberalism)
  { id: 'o21', text: '나는 진보적인 정치가에게 투표하는 경향이 있는 편이다.', keyed: 'plus', domain: 'O', facet: 6, num: 28, choices: COMMON_CHOICES },
  { id: 'o22', text: '나는 절대적으로 옮고 그름은 없다고 믿는 편이다.', keyed: 'plus', domain: 'O', facet: 6, num: 58, choices: COMMON_CHOICES },
  { id: 'o23', text: '나는 보수적인 정치인에게 투표하는 경향이 있는 편이다.', keyed: 'minus', domain: 'O', facet: 6, num: 88, choices: COMMON_CHOICES },
  { id: 'o24', text: '나는 우리가 범죄에 엄격해야한다고 믿는 편이다.', keyed: 'minus', domain: 'O', facet: 6, num: 118, choices: COMMON_CHOICES }
]

// 우호성 (Agreeableness) - 24개 질문 (사용자 제공 문구로 교체)
const AGREEABLENESS_QUESTIONS: Big5Question[] = [
  // Facet 1: 신뢰 (Trust)
  { id: 'a1', text: '나는 다른 사람들을 신뢰하는 편이다.', keyed: 'plus', domain: 'A', facet: 1, num: 4, choices: COMMON_CHOICES },
  { id: 'a2', text: '나는 다른 사람들이 좋은 의도를 가지고 있다고 믿는 편이다.', keyed: 'plus', domain: 'A', facet: 1, num: 34, choices: COMMON_CHOICES },
  { id: 'a4', text: '나는 다른 사람들이 말하는 것을 믿는 편이다.', keyed: 'plus', domain: 'A', facet: 1, num: 64, choices: COMMON_CHOICES },
  { id: 'a3', text: '나는 다른 사람들을 잘 믿지 않는 편이다.', keyed: 'minus', domain: 'A', facet: 1, num: 94, choices: COMMON_CHOICES },

  // Facet 2: 도덕성 (Morality)
  { id: 'a5', text: '나는 내 목적을 위해 다른 사람들을 이용하는 편이다.', keyed: 'minus', domain: 'A', facet: 2, num: 9, choices: COMMON_CHOICES },
  { id: 'a6', text: '나는 원하는 것을 얻기 위해 부정 행위를 하는 편이다.', keyed: 'minus', domain: 'A', facet: 2, num: 39, choices: COMMON_CHOICES },
  { id: 'a7', text: '나는 다른 사람들을 이용하는 편이다.', keyed: 'minus', domain: 'A', facet: 2, num: 69, choices: COMMON_CHOICES },
  { id: 'a8', text: '나는 다른 사람들의 계획을 방해하는 편이다.', keyed: 'minus', domain: 'A', facet: 2, num: 99, choices: COMMON_CHOICES }, //나는 규칙을 어기는 편이다.

  // Facet 3: 이타성 (Altruism)
  { id: 'a9', text: '나는 남을 돕는 것을 좋아하는 편이다.', keyed: 'plus', domain: 'A', facet: 3, num: 14, choices: COMMON_CHOICES },
  { id: 'a10', text: '나는 다른 사람들을 걱정하는 편이다.', keyed: 'plus', domain: 'A', facet: 3, num: 44, choices: COMMON_CHOICES },
  { id: 'a11', text: '나는 다른 사람들의 감정에 대해 무관심한 편이다.', keyed: 'minus', domain: 'A', facet: 3, num: 74, choices: COMMON_CHOICES }, //
  { id: 'a12', text: '나는 남을 위해 시간을 들이지 않는 편이다.', keyed: 'minus', domain: 'A', facet: 3, num: 104, choices: COMMON_CHOICES }, //나는 남들의 문제에 관심이 없는 편이다.

  // Facet 4: 협력 (Cooperation)
  { id: 'a13', text: '나는 건강한 논쟁을 즐기는 편이다.', keyed: 'minus', domain: 'A', facet: 4, num: 19, choices: COMMON_CHOICES },
  { id: 'a14', text: '나는 다른 사람들에게 호통치는 편이다.', keyed: 'minus', domain: 'A', facet: 4, num: 49, choices: COMMON_CHOICES },
  { id: 'a15', text: '나는 다른 사람들을 욕하는 편이다.', keyed: 'minus', domain: 'A', facet: 4, num: 79, choices: COMMON_CHOICES },
  { id: 'a16', text: '나는 당한 것에 대해 남들에게 (앙)갚는 편이다.', keyed: 'minus', domain: 'A', facet: 4, num: 109, choices: COMMON_CHOICES }, //나는 협력보다는 경쟁을 선호하는 편이다.

  // Facet 5: 겸손 (Modesty)
  { id: 'a17', text: '나는 내가 다른 사람보다 낫다고 믿는 편이다.', keyed: 'minus', domain: 'A', facet: 5, num: 24, choices: COMMON_CHOICES },
  { id: 'a18', text: '나는 내 자신을 높게 평가하는 편이다.', keyed: 'minus', domain: 'A', facet: 5, num: 54, choices: COMMON_CHOICES },
  { id: 'a19', text: '나는 나 자신이 괜찮은 사람이라 생각하는 편이다.', keyed: 'minus', domain: 'A', facet: 5, num: 84, choices: COMMON_CHOICES },
  { id: 'a20', text: '나는 내 선행에 대해 자랑하는 편이다.', keyed: 'minus', domain: 'A', facet: 5, num: 114, choices: COMMON_CHOICES },

  // Facet 6: 공감 (Sympathy)
  { id: 'a21', text: '나는 노숙자들에게 동정을 느끼는 편이다.', keyed: 'plus', domain: 'A', facet: 6, num: 29, choices: COMMON_CHOICES },
  { id: 'a22', text: '나는 나보다 가난한 사람에게 동정을 느끼는 편이다.', keyed: 'plus', domain: 'A', facet: 6, num: 59, choices: COMMON_CHOICES },
  { id: 'a23', text: '나는 남들의 문제에 관심이 없는 편이다.', keyed: 'minus', domain: 'A', facet: 6, num: 89, choices: COMMON_CHOICES },
  { id: 'a24', text: '나는 가난한 사람에 대해 별로 생각하고 싶지 않아하는 편이다.', keyed: 'minus', domain: 'A', facet: 6, num: 119, choices: COMMON_CHOICES }
]

// 성실성 (Conscientiousness) - 24개 질문 (사용자 제공 문구로 교체)
const CONSCIENTIOUSNESS_QUESTIONS: Big5Question[] = [
  // Facet 1: 자기효능감 (Self-Efficacy)
  { id: 'c1', text: '나는 일을 제대로 끝 마치는 편이다.', keyed: 'plus', domain: 'C', facet: 1, num: 5, choices: COMMON_CHOICES },
  { id: 'c3', text: '나는 내가 하는 일에 대해 남들보다 뛰어난 편이다.', keyed: 'plus', domain: 'C', facet: 1, num: 35, choices: COMMON_CHOICES },
  { id: 'c2', text: '나는 일을 매끄럽게 처리하는 편이다.', keyed: 'plus', domain: 'C', facet: 1, num: 65, choices: COMMON_CHOICES },
  { id: 'c4', text: '나는 일을 어떻게 해나가야하는지 잘 아는 편이다.', keyed: 'plus', domain: 'C', facet: 1, num: 95, choices: COMMON_CHOICES },

  // Facet 2: 체계성 (Orderliness)
  { id: 'c5', text: '나는 정리하는 것을 좋아하는 편이다.', keyed: 'plus', domain: 'C', facet: 2, num: 10, choices: COMMON_CHOICES },
  { id: 'c6', text: '나는 물건을 제자리에 놓는 것을 종종 잊어버리는 편이다.', keyed: 'minus', domain: 'C', facet: 2, num: 40, choices: COMMON_CHOICES },
  { id: 'c7', text: '나는 내 방을 어지르는 편이다.', keyed: 'minus', domain: 'C', facet: 2, num: 70, choices: COMMON_CHOICES },
  { id: 'c8', text: '나는 내 물건을 잘 잃어버리는 편이다.', keyed: 'minus', domain: 'C', facet: 2, num: 100, choices: COMMON_CHOICES },

  // Facet 3: 의무감 (Dutifulness)
  { id: 'c9', text: '나는 약속을 잘 지키는 편이다.', keyed: 'plus', domain: 'C', facet: 3, num: 15, choices: COMMON_CHOICES },
  { id: 'c10', text: '나는 진실대로 말하는 편이다.', keyed: 'plus', domain: 'C', facet: 3, num: 45, choices: COMMON_CHOICES },
  { id: 'c12', text: '나는 규칙을 어기는 편이다.', keyed: 'minus', domain: 'C', facet: 3, num: 75, choices: COMMON_CHOICES },
  { id: 'c11', text: '나는 약속을 어기는 편이다.', keyed: 'minus', domain: 'C', facet: 3, num: 105, choices: COMMON_CHOICES },

  // Facet 4: 성취추구 (Achievement Striving)
  { id: 'c13', text: '나는 열심히 일하는 편이다.', keyed: 'plus', domain: 'C', facet: 4, num: 20, choices: COMMON_CHOICES },
  { id: 'c14', text: '나는 내게 기대했던 것 보다 더 많은 일을 하는 편이다.', keyed: 'plus', domain: 'C', facet: 4, num: 50, choices: COMMON_CHOICES },
  { id: 'c15', text: '나는 그럭 저럭 살아갈 만큼 일하는 편이다.', keyed: 'minus', domain: 'C', facet: 4, num: 80, choices: COMMON_CHOICES },
  { id: 'c16', text: '나는 내 일에 시간과 노력을 들이지 않는 편이다.', keyed: 'minus', domain: 'C', facet: 4, num: 110, choices: COMMON_CHOICES },//나는 내 계획들을 잘 실행하는 편이다.

  // Facet 5: 자기통제 (Self-Discipline)
  { id: 'c17', text: '나는 항상 준비되어있는 편이다.', keyed: 'plus', domain: 'C', facet: 5, num: 25, choices: COMMON_CHOICES },
  { id: 'c20', text: '나는 내 계획들을 잘 실행하는 편이다.', keyed: 'plus', domain: 'C', facet: 5, num: 55, choices: COMMON_CHOICES },
  { id: 'c18', text: '나는 내 시간을 낭비하는 편이다.', keyed: 'minus', domain: 'C', facet: 5, num: 85, choices: COMMON_CHOICES },
  { id: 'c19', text: '나는 작업을 시작하는데 어려움이 있는 편이다.', keyed: 'minus', domain: 'C', facet: 5, num: 115, choices: COMMON_CHOICES },

  // Facet 6: 신중함 (Cautiousness)
  { id: 'c21', text: '나는 앞뒤 생각 없이 뛰어드는 경향이 있는 편이다.', keyed: 'minus', domain: 'C', facet: 6, num: 30, choices: COMMON_CHOICES },
  { id: 'c22', text: '나는 성급하게 결정을 내리는 편이다.', keyed: 'minus', domain: 'C', facet: 6, num: 60, choices: COMMON_CHOICES },
  { id: 'c24', text: '나는 서둘러 일을 처리하는 편이다.', keyed: 'minus', domain: 'C', facet: 6, num: 90, choices: COMMON_CHOICES },
  { id: 'c23', text: '나는 별 생각 없이 행동하는 편이다.', keyed: 'minus', domain: 'C', facet: 6, num: 120, choices: COMMON_CHOICES }
]

// 모든 질문을 합쳐서 120개 질문 생성
export const BIG5_QUESTIONS: Big5Question[] = [
  ...OPENNESS_QUESTIONS,
  ...CONSCIENTIOUSNESS_QUESTIONS,
  ...EXTRAVERSION_QUESTIONS,
  ...AGREEABLENESS_QUESTIONS,
  ...NEUROTICISM_QUESTIONS
]
