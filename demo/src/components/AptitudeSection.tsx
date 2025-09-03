"use client";
import type { AptitudeScores } from "@/lib/candidates";
import { useEffect, useRef } from "react";

export default function AptitudeSection({ scores }: { scores: AptitudeScores }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const data = [
      scores.realistic,
      scores.investigative,
      scores.artistic,
      scores.social,
      scores.enterprising,
      scores.conventional,
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      const scoreRadius = (radius * data[i]) / 100;
      const x = centerX + scoreRadius * Math.cos(angle);
      const y = centerY + scoreRadius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(76, 175, 80, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "#4CAF50";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [scores]);

  return (
    <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12 }}>📊 적성검사 결과 분석</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <canvas ref={canvasRef} width={400} height={400} />
      </div>
    </div>
  );
}


