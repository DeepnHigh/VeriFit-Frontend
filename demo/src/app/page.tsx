import VeriFitIntro from "../components/VeriFitIntro";
import Link from "next/link";
import Image from "next/image";
import companyPic from "../../company.jpg";
import applicantPic from "../../applicant.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center text-gray-800 mb-12">
          <h1 className="text-5xl font-bold mb-4">🤖 AI 기반 채용 플랫폼</h1>
          <p className="text-xl opacity-90">콜린웨이브 커머스플랫폼 프론트엔드 개발자 채용 데모</p>
        </div>

        {/* 헤더 하단 CTA 버튼 (정사각형 컨테이너) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="relative">
            <div className="relative w-full pt-[100%] rounded-2xl shadow-lg overflow-hidden">
              <Image src={applicantPic} alt="applicant" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-white/40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <Link
                href="/candidate"
                className="cta-button cta-button--candidate pulse-button w-96 h-[180px] flex items-center justify-center text-7xl leading-none pt-14"
              >
                👤 지원자
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full pt-[100%] rounded-2xl shadow-lg overflow-hidden">
              <Image src={companyPic} alt="company" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-white/40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <Link
                href="/company"
                className="cta-button cta-button--company pulse-button w-96 h-[180px] flex items-center justify-center text-7xl leading-none pt-14"
              >
                🏢 기업
              </Link>
            </div>
          </div>
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
