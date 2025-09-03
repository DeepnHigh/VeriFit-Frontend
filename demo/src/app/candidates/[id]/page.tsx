import { getAllCandidateIds, getCandidateById } from "../../../lib/candidates";
import ProfileCard from "../../../components/ProfileCard";
import UploadSection from "../../../components/UploadSection";
import AptitudeSection from "../../../components/AptitudeSection";
import QASection from "../../../components/QASection";

export async function generateStaticParams() {
  const ids = getAllCandidateIds();
  return ids.map((id) => ({ id }));
}

export default function CandidatePage({ params }: { params: { id: string } }) {
  const candidate = getCandidateById(params.id);
  if (!candidate) {
    return <div style={{ padding: 24 }}>존재하지 않는 지원자입니다.</div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>지원자 프로필: {candidate.name}</h1>
      <ProfileCard candidate={candidate} />
      <UploadSection uploads={candidate.uploads} />
      <AptitudeSection scores={candidate.aptitude} />
      <QASection items={candidate.qa} />
    </div>
  );
}


