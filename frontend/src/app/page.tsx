import Link from "next/link";
import Header from "@/components/Header";
import VeriFitIntro from "@/components/VeriFitIntro";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
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
              href="/signup/applicant"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
            >
              지원자로 시작하기
            </Link>
            <Link
              href="/signup/company"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors duration-200 shadow-lg"
            >
              기업으로 시작하기
            </Link>
          </div>
        </div>

        <VeriFitIntro />
      </div>
    </div>
  );
}
