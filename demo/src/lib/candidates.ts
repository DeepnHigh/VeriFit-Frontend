export type UploadItem = {
  category: string;
  items: Array<{ title: string; meta: string }>;
};

export type AptitudeScores = {
  realistic: number; // 현실형
  investigative: number; // 탐구형
  artistic: number; // 예술형
  social: number; // 사회형
  enterprising: number; // 진취형
  conventional: number; // 관습형
};

export type QAItem = {
  question: string;
  answer?: string;
};

export type Candidate = {
  id: string;
  name: string;
  avatarInitial: string;
  title: string;
  years: number;
  intro: string;
  stats: { applications: number; aiInterviews: number };
  uploads: UploadItem[];
  aptitude: AptitudeScores;
  qa: QAItem[];
};

const candidates: Candidate[] = [
  {
    id: "lee-jiyeon",
    name: "이지은 (Lee Jiyeon)",
    avatarInitial: "이",
    title: "Frontend Developer",
    years: 5,
    intro:
      "React, TypeScript, Next.js를 주력으로 하는 프론트엔드 개발자입니다. 사용자 경험을 중시하며, 깔끔하고 효율적인 코드 작성을 지향합니다. 팀 협업과 지속적인 학습을 통해 성장하는 개발자입니다.",
    stats: { applications: 5, aiInterviews: 2 },
    uploads: [
      {
        category: "자기소개서",
        items: [{ title: "자기소개서_콜린웨이브.pdf", meta: "2025.08.15 업로드 • 2.3MB" }],
      },
      {
        category: "포트폴리오",
        items: [{ title: "포트폴리오_아뜰리에.pdf", meta: "2025.08.20 업로드 • 15.7MB" }],
      },
      {
        category: "GitHub 링크",
        items: [{ title: "github.com/leejieun", meta: "2025.08.10 연결 • 15개 저장소" }],
      },
    ],
    aptitude: {
      realistic: 67,
      investigative: 45,
      artistic: 96,
      social: 33,
      enterprising: 59,
      conventional: 21,
    },
    qa: [
      { question: "자신의 가장 큰 강점과 약점은 무엇인가요?", answer: "창의적인 문제 해결, 절차 준수에 주의" },
      { question: "이직을 고려하는 이유는 무엇인가요?", answer: "대규모 서비스 경험과 UX 개선" },
      { question: "팀워크에서 본인의 역할은 무엇인가요?", answer: "창의적 해결책 제안자" },
      { question: "실패했던 프로젝트 경험이 있다면 어떻게 극복했나요?" },
      { question: "앞으로 5년 후 본인의 모습은 어떨 것 같나요?" },
      { question: "업무 외 관심 기술/분야는?" },
      { question: "스트레스 상황에서 어떻게 대처하시나요?" },
      { question: "리더십 경험이 있다면?" },
      { question: "업무와 개인생활의 균형은?" },
      { question: "이 회사에 지원한 가장 큰 이유는?" },
    ],
  },
  {
    id: "park-sangyoung",
    name: "박상영 (Park Developer)",
    avatarInitial: "박",
    title: "Frontend Developer",
    years: 5,
    intro:
      "React와 TypeScript 기반의 웹 애플리케이션 개발에 강점이 있는 프론트엔드 개발자입니다. 성능 최적화와 컴포넌트 아키텍처 설계에 관심이 많으며, 원활한 커뮤니케이션으로 팀 생산성을 높이는 데 기여합니다.",
    stats: { applications: 6, aiInterviews: 3 },
    uploads: [
      {
        category: "자기소개서",
        items: [{ title: "자기소개서_프레스토.pdf", meta: "2025.07.22 업로드 • 2.0MB" }],
      },
      {
        category: "포트폴리오",
        items: [{ title: "포트폴리오_커머스리뉴얼.pdf", meta: "2025.08.01 업로드 • 12.4MB" }],
      },
      {
        category: "GitHub 링크",
        items: [{ title: "github.com/parksangyoung", meta: "2025.06.30 연결 • 28개 저장소" }],
      },
      {
        category: "이력서",
        items: [{ title: "이력서_박상영.pdf", meta: "2025.08.18 업로드 • 1.8MB" }],
      },
    ],
    aptitude: {
      realistic: 72,
      investigative: 58,
      artistic: 49,
      social: 62,
      enterprising: 81,
      conventional: 35,
    },
    qa: [
      { question: "자신의 가장 큰 강점과 약점은 무엇인가요?", answer: "구조화, 커뮤니케이션 / 완벽주의" },
      { question: "이직을 고려하는 이유는 무엇인가요?", answer: "대규모 성능 최적화 주도" },
      { question: "팀워크에서 본인의 역할은 무엇인가요?" },
      { question: "실패했던 프로젝트 경험이 있다면 어떻게 극복했나요?" },
      { question: "앞으로 5년 후 본인의 모습은 어떨 것 같나요?" },
      { question: "업무 외 관심 기술/분야는?" },
      { question: "스트레스 상황에서 어떻게 대처하시나요?" },
      { question: "리더십 경험이 있다면?" },
      { question: "업무와 개인생활의 균형은?" },
      { question: "이 회사에 지원한 가장 큰 이유는?" },
    ],
  },
  {
    id: "kim-jiwon",
    name: "김지원 (Kim Developer)",
    avatarInitial: "김",
    title: "Frontend Developer",
    years: 3,
    intro:
      "React/TypeScript 중심으로 빠르게 성장 중인 프론트엔드 개발자입니다. 학습 곡선이 빠르고, 사용자 문제를 데이터 기반으로 해결하는 데 관심이 많습니다.",
    stats: { applications: 4, aiInterviews: 1 },
    uploads: [
      {
        category: "자기소개서",
        items: [{ title: "자기소개서_커머스플랫폼.pdf", meta: "2025.08.05 업로드 • 1.9MB" }],
      },
      {
        category: "포트폴리오",
        items: [{ title: "포트폴리오_사이드프로젝트.pdf", meta: "2025.08.12 업로드 • 10.1MB" }],
      },
      {
        category: "GitHub 링크",
        items: [{ title: "github.com/kimjiwon-dev", meta: "2025.07.10 연결 • 20개 저장소" }],
      },
    ],
    aptitude: {
      realistic: 63,
      investigative: 52,
      artistic: 70,
      social: 48,
      enterprising: 61,
      conventional: 29,
    },
    qa: [
      { question: "자신의 가장 큰 강점과 약점은 무엇인가요?", answer: "빠른 학습, 꼼꼼함 / 경험 부족 보완 중" },
      { question: "이직을 고려하는 이유는 무엇인가요?", answer: "성장 환경과 멘토링 문화" },
      { question: "팀워크에서 본인의 역할은 무엇인가요?" },
      { question: "실패했던 프로젝트 경험이 있다면 어떻게 극복했나요?" },
      { question: "앞으로 5년 후 본인의 모습은 어떨 것 같나요?" },
      { question: "업무 외 관심 기술/분야는?" },
      { question: "스트레스 상황에서 어떻게 대처하시나요?" },
      { question: "리더십 경험이 있다면?" },
      { question: "업무와 개인생활의 균형은?" },
      { question: "이 회사에 지원한 가장 큰 이유는?" },
    ],
  },
];

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}

export function getAllCandidateIds(): string[] {
  return candidates.map((c) => c.id);
}


