'use client'

import { useRef, useMemo } from 'react'
import { usePentagonChart } from '../hooks/useHexagonChart'
import { Big5DataItem, Big5ChartDataItem, BIG5_GENERAL_INTERPRETATIONS } from '../data/big5Data'

interface Big5ResultProps {
  big5Data: Big5DataItem[]
  big5ChartData: Big5ChartDataItem[]
  showInterpretation?: boolean
  className?: string
}

export default function Big5Result({
  big5Data,
  big5ChartData,
  showInterpretation = true,
  className = ''
}: Big5ResultProps) {
  const big5CanvasRef = usePentagonChart(big5ChartData as any)

  return (
    <div className={className}>
      {/* Big5 차트 */}
      {big5ChartData.length === 5 ? (
        <div className="flex justify-center">
          <canvas ref={big5CanvasRef} width={400} height={400} className="max-w-full" />
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500">Big5 결과가 아직 없습니다.</div>
      )}

      {/* Big5 점수 표 */}
      <div className="mt-6 overflow-x-auto border-1 border-black rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-600 text-black">
              <th className="text-left p-3 text-black w-24 min-w-24 border-r border-black border-dashed">성격 차원</th>
              <th className="text-left p-3 text-black w-16 min-w-16 border-r border-black border-dashed">점수</th>
              <th className="text-left p-3 text-black">설명</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {big5Data.map((p) => (
              <tr key={p.label}>
                <td className="p-3 text-black w-24 min-w-24 border-r border-black border-dashed"><b>{p.label}</b></td>
                <td className="p-3 text-black w-16 min-w-16 border-r border-black border-dashed">{p.score}점</td>
                <td className="p-3 text-black text-xs">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Big5 해석 섹션 */}
      {showInterpretation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-black mb-2">📋 성격 분석 해석</h4>
          <div className="text-sm text-black space-y-1">
            <p><strong>{BIG5_GENERAL_INTERPRETATIONS.openness}</strong></p>
            <p><strong>{BIG5_GENERAL_INTERPRETATIONS.conscientiousness}</strong></p>
            <p><strong>{BIG5_GENERAL_INTERPRETATIONS.extraversion}</strong></p>
            <p><strong>{BIG5_GENERAL_INTERPRETATIONS.agreeableness}</strong></p>
            <p><strong>{BIG5_GENERAL_INTERPRETATIONS.neuroticism}</strong></p>
          </div>
        </div>
      )}
    </div>
  )
}
