"use client";
import type { Candidate } from "@/lib/candidates";

export default function ProfileCard({ candidate }: { candidate: Candidate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, marginBottom: 28 }}>
      <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20, border: "2px solid #e0e0e0" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, margin: "0 auto 16px" }}>
          {candidate.avatarInitial}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{candidate.name}</div>
        <div style={{ color: "#666", textAlign: "center", marginBottom: 12 }}>{candidate.title} • {candidate.years}년 경력</div>

        <div style={{ background: "linear-gradient(135deg, #eef2ff, #e7f3ff)", borderRadius: 8, padding: 12, marginBottom: 12, color: "#333", lineHeight: 1.5 }}>
          {candidate.intro}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#4CAF50" }}>{candidate.stats.applications}</div>
            <div style={{ fontSize: 12, color: "#666" }}>지원 공고</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#4CAF50" }}>{candidate.stats.aiInterviews}</div>
            <div style={{ fontSize: 12, color: "#666" }}>AI 면접</div>
          </div>
        </div>
      </div>
    </div>
  );
}


