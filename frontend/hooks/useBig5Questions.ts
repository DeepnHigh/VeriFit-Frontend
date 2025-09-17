import { useState, useEffect } from 'react'
import { BIG5_QUESTIONS, Big5Question } from '../data/big5Questions'

export interface Big5Answer {
  questionId: string
  score: number
}

export interface Big5Result {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  interpretations?: any[]
  rawScores?: any
}


export function useBig5Questions() {
  const [questions] = useState<Big5Question[]>([...BIG5_QUESTIONS].sort((a, b) => a.num - b.num))
  const [answers, setAnswers] = useState<Big5Answer[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<Big5Result | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const answerQuestion = (score: number) => {
    const newAnswer: Big5Answer = {
      questionId: currentQuestion.id,
      score
    }

    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id)
    updatedAnswers.push(newAnswer)
    setAnswers(updatedAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsCompleted(true)
      calculateResult(updatedAnswers)
    }
  }

  // Big5 표준 계산 함수 (avgScore > 3.5: high, < 2.5: low, else: neutral)
  const calculateBig5Result = (score: number, count: number): string => {
    const avgScore = score / count
    if (avgScore > 3.5) {
      return 'high'
    } else if (avgScore < 2.5) {
      return 'low'
    }
    return 'neutral'
  }

  const calculateResult = (allAnswers: Big5Answer[]) => {
    // 각 차원별 점수 계산
    const domainScores = {
      O: { total: 0, count: 0 },
      C: { total: 0, count: 0 },
      E: { total: 0, count: 0 },
      A: { total: 0, count: 0 },
      N: { total: 0, count: 0 }
    }

    // 각 차원별 세부 특성(1~6 facet) 점수 집계
    const initFacet = () => ({ total: 0, count: 0 })
    const domainFacetScores: Record<'O'|'C'|'E'|'A'|'N', Record<number, { total: number; count: number }>> = {
      O: { 1: initFacet(), 2: initFacet(), 3: initFacet(), 4: initFacet(), 5: initFacet(), 6: initFacet() },
      C: { 1: initFacet(), 2: initFacet(), 3: initFacet(), 4: initFacet(), 5: initFacet(), 6: initFacet() },
      E: { 1: initFacet(), 2: initFacet(), 3: initFacet(), 4: initFacet(), 5: initFacet(), 6: initFacet() },
      A: { 1: initFacet(), 2: initFacet(), 3: initFacet(), 4: initFacet(), 5: initFacet(), 6: initFacet() },
      N: { 1: initFacet(), 2: initFacet(), 3: initFacet(), 4: initFacet(), 5: initFacet(), 6: initFacet() },
    }

    // 답변을 차원별로 집계
    allAnswers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      if (question) {
        const domain = question.domain
        domainScores[domain].total += answer.score
        domainScores[domain].count += 1

        // 세부 특성 집계
        const facetIndex = Number(question.facet) as 1|2|3|4|5|6
        if (facetIndex >= 1 && facetIndex <= 6) {
          domainFacetScores[domain][facetIndex].total += answer.score
          domainFacetScores[domain][facetIndex].count += 1
        }
      }
    })

    // 0-100 스케일로 변환 (평균 * 20)
    const openness = Math.round((domainScores.O.total / domainScores.O.count) * 20) || 0
    const conscientiousness = Math.round((domainScores.C.total / domainScores.C.count) * 20) || 0
    const extraversion = Math.round((domainScores.E.total / domainScores.E.count) * 20) || 0
    const agreeableness = Math.round((domainScores.A.total / domainScores.A.count) * 20) || 0
    const neuroticism = Math.round((domainScores.N.total / domainScores.N.count) * 20) || 0

    // rawScores 생성 (high/neutral/low 포함 + facet 세부 점수 0-100 스케일)
    const rawScores = {
      O: {
        score: domainScores.O.total,
        count: domainScores.O.count,
        result: calculateBig5Result(domainScores.O.total, domainScores.O.count),
        facet: Object.fromEntries(
          Object.entries(domainFacetScores.O).map(([k, v]) => [k, Math.round(((v.total / (v.count || 1)) || 0) * 20)])
        )
      },
      C: {
        score: domainScores.C.total,
        count: domainScores.C.count,
        result: calculateBig5Result(domainScores.C.total, domainScores.C.count),
        facet: Object.fromEntries(
          Object.entries(domainFacetScores.C).map(([k, v]) => [k, Math.round(((v.total / (v.count || 1)) || 0) * 20)])
        )
      },
      E: {
        score: domainScores.E.total,
        count: domainScores.E.count,
        result: calculateBig5Result(domainScores.E.total, domainScores.E.count),
        facet: Object.fromEntries(
          Object.entries(domainFacetScores.E).map(([k, v]) => [k, Math.round(((v.total / (v.count || 1)) || 0) * 20)])
        )
      },
      A: {
        score: domainScores.A.total,
        count: domainScores.A.count,
        result: calculateBig5Result(domainScores.A.total, domainScores.A.count),
        facet: Object.fromEntries(
          Object.entries(domainFacetScores.A).map(([k, v]) => [k, Math.round(((v.total / (v.count || 1)) || 0) * 20)])
        )
      },
      N: {
        score: domainScores.N.total,
        count: domainScores.N.count,
        result: calculateBig5Result(domainScores.N.total, domainScores.N.count),
        facet: Object.fromEntries(
          Object.entries(domainFacetScores.N).map(([k, v]) => [k, Math.round(((v.total / (v.count || 1)) || 0) * 20)])
        )
      }
    }

    const finalResult: Big5Result = {
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism,
      rawScores
    }

    setResult(finalResult)
  }

  const resetTest = () => {
    setAnswers([])
    setCurrentQuestionIndex(0)
    setIsCompleted(false)
    setResult(null)
  }

  const getAnswerForQuestion = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.score || null
  }

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    progress,
    isCompleted,
    result,
    answerQuestion,
    resetTest,
    getAnswerForQuestion,
    totalQuestions: questions.length
  }
}