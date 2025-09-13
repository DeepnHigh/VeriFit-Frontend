import { useEffect, useRef } from 'react'

type Big5Point = { score: number; label: string; color: string; description: string }

function drawPentagonChart(canvas: HTMLCanvasElement, data: Big5Point[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 150

  // 등고선 (5개 레벨)
  for (let level = 1; level <= 5; level++) {
    const currentRadius = (radius * level) / 5
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const x = centerX + currentRadius * Math.cos(angle)
      const y = centerY + currentRadius * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // 외곽 (5각형)
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 2
  ctx.stroke()

  // 데이터 영역 (5각형)
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const scoreRadius = (radius * data[i].score) / 100
    const x = centerX + scoreRadius * Math.cos(angle)
    const y = centerY + scoreRadius * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(76, 175, 80, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#4CAF50'
  ctx.lineWidth = 3
  ctx.stroke()

  // 중심점
  ctx.beginPath()
  ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI)
  ctx.fillStyle = '#4CAF50'
  ctx.fill()
  ctx.strokeStyle = '#2E7D32'
  ctx.lineWidth = 2
  ctx.stroke()

  // 라벨 그리기
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const labelRadius = radius + 30
    const x = centerX + labelRadius * Math.cos(angle)
    const y = centerY + labelRadius * Math.sin(angle)
    
    ctx.fillStyle = data[i].color
    ctx.fillText(data[i].label, x, y)
  }
}

export function usePentagonChart(data: Big5Point[]) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      drawPentagonChart(canvasRef.current, data)
    }
  }, [data])

  return canvasRef
}
