import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            VeriFit
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            AI 기반 스마트 채용 플랫폼으로 최적의 인재를 찾고, 
            당신의 역량을 증명하세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
            >
              로그인
            </Link>
            <Link
              href="/applicant"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors duration-200 shadow-lg"
            >
              지원자로 시작하기
            </Link>
            <Link
              href="/company"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors duration-200 shadow-lg"
            >
              기업으로 시작하기
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI 면접</h3>
            <p className="text-gray-600">
              AI 면접관과의 실시간 대화를 통해 지원자의 역량을 종합적으로 평가합니다.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">적성검사</h3>
            <p className="text-gray-600">
              과학적 검증된 적성검사를 통해 지원자의 잠재력을 객관적으로 측정합니다.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">종합 리포트</h3>
            <p className="text-gray-600">
              AI 분석을 통한 상세한 평가 리포트로 최적의 인재 선별을 지원합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
