"use client";
import type { UploadItem } from "@/lib/candidates";

export default function UploadSection({ uploads }: { uploads: UploadItem[] }) {
  return (
    <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12 }}>📁 포트폴리오 및 자료 업로드</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {uploads.map((u) => (
          <div key={u.category} style={{ background: "#fff", borderRadius: 10, padding: 16, border: "2px dashed #ddd" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{u.category}</div>
            {u.items?.map((it) => (
              <div key={it.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #f0f0f0", marginTop: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{it.meta}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ padding: "2px 6px", background: "#2196F3", color: "#fff", border: 0, borderRadius: 4 }}>보기</button>
                  <button style={{ padding: "2px 6px", background: "#f44336", color: "#fff", border: 0, borderRadius: 4 }}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


