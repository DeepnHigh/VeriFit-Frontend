import VeriFitIntro from "../components/VeriFitIntro";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center text-gray-800 mb-12">
          <h1 className="text-5xl font-bold mb-4">🤖 AI 기반 채용 플랫폼</h1>
          <p className="text-xl opacity-90">콜린웨이브 커머스플랫폼 프론트엔드 개발자 채용 데모</p>
        </div>

        {/* 푸터 */}
        <div className="text-center text-gray-800 mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">🚀 AI 기반 채용 플랫폼, &apos;VeriFit&apos;을 소개합니다!</h3>
            <VeriFitIntro />
          </div>
        </div>
      </div>
    </div>
  );
}
