'use client'

import Link from 'next/link'
import Big5Result from './Big5Result'
import { Big5DataItem, Big5ChartDataItem } from '../data/big5Data'

interface Big5SectionProps {
  big5Data: Big5DataItem[]
  big5ChartData: Big5ChartDataItem[]
  hasCompletedTest: boolean
  showTestButton?: boolean
  testButtonText?: {
    start: string
    retake: string
  }
  testButtonHref?: string
  className?: string
}

export default function Big5Section({
  big5Data,
  big5ChartData,
  hasCompletedTest,
  showTestButton = true,
  testButtonText = {
    start: '🧠 성격검사 시작하기',
    retake: '🔄 성격검사 다시하기'
  },
  testButtonHref = '/applicant/big5-test',
  className = ''
}: Big5SectionProps) {
  return (
    <section className={`rounded-xl p-6 border mb-8 bg-white ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-black font-semibold">🧠 Big5 성격검사 결과 분석</h3>
        {showTestButton && (
          <Link 
            href={testButtonHref} 
            className="px-3 py-2 rounded-md text-sm text-white bg-green-600 cursor-pointer hover:bg-green-700 transition-colors"
          >
            {hasCompletedTest ? testButtonText.retake : testButtonText.start}
          </Link>
        )}
      </div>

      {hasCompletedTest ? (
        <Big5Result
          big5Data={big5Data}
          big5ChartData={big5ChartData}
          showInterpretation={true}
        />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧠</div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">성격검사를 시작해보세요!</h4>
          <p className="text-gray-500 mb-6">
            Big5 성격검사를 통해 당신의 성격을 분석하고<br/>
            더 정확한 AI 프로필을 만들어보세요.
          </p>
          {showTestButton && (
            <Link 
              href={testButtonHref} 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🚀 성격검사 시작하기
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
