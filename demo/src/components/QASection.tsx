"use client";
import type { QAItem } from "@/lib/candidates";
import { useState } from "react";

export default function QASection({ items }: { items: QAItem[] }) {
  const [answers, setAnswers] = useState(items);
  const completed = answers.filter((a) => a.answer && a.answer.trim().length > 0).length;

  return (
    <div style={{ background: "linear-gradient(135deg, #e8f5e8, #c8e6c9)", borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3>🤖 AI 학습을 위한 질문 답변</h3>
        <div style={{ fontSize: 14, color: "#333", textAlign: "right" }}>
          <strong>완료도: {completed}/{answers.length}</strong>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {answers.map((q, idx) => (
          <div key={idx} style={{ background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ background: "#4CAF50", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>Q{idx + 1}</span>
              <span style={{ background: q.answer ? "#4CAF50" : "#ff9800", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{q.answer ? "✓ 완료" : "미완료"}</span>
            </div>
            {q.answer ? (
              <div>
                <div style={{ marginBottom: 8 }}><strong>답변:</strong> {q.answer}</div>
                <button onClick={() => setAnswers((prev) => prev.map((p, i) => (i === idx ? { ...p, answer: "" } : p)))} style={{ padding: "6px 10px", background: "#2196F3", color: "#fff", border: 0, borderRadius: 6 }}>수정</button>
              </div>
            ) : (
              <div>
                <textarea rows={3} placeholder="이 질문에 대한 답변을 입력해주세요..." style={{ width: "100%", border: "2px solid #e0e0e0", borderRadius: 8, padding: 8 }} />
                <button
                  onClick={(e) => {
                    const textarea = (e.currentTarget.previousSibling as HTMLTextAreaElement)!
                    const value = textarea.value.trim();
                    if (!value) return;
                    setAnswers((prev) => prev.map((p, i) => (i === idx ? { ...p, answer: value } : p)));
                  }}
                  style={{ marginTop: 8, padding: "6px 10px", background: "#4CAF50", color: "#fff", border: 0, borderRadius: 6 }}
                >
                  저장
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


