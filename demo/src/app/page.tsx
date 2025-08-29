import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center text-gray-800 mb-12">
          <h1 className="text-5xl font-bold mb-4">🤖 AI 기반 채용 플랫폼</h1>
          <p className="text-xl opacity-90">콜린웨이브 커머스플랫폼 프론트엔드 개발자 채용 데모</p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 메인 랜딩 페이지 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🏠 메인 랜딩 페이지</h2>
              <p className="opacity-90">플랫폼 소개 및 전체 개요</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                AI 기반 채용 플랫폼의 핵심 기능과 이점을 소개하는 메인 페이지입니다.
              </p>
              <a 
                href="/index.html" 
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 →
              </a>
            </div>
          </div>

          {/* 기업 채용 관리 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🏢 기업 채용 관리</h2>
              <p className="opacity-90">채용공고 작성 및 AI 면접관 설정</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                콜린웨이브의 채용공고와 AI 면접관 평가 기준을 설정하는 페이지입니다.
              </p>
              <a 
                href="/company_recruitment_management.html" 
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 →
              </a>
            </div>
          </div>

          {/* 지원자 프로필 관리 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">👤 지원자 프로필 관리</h2>
              <p className="opacity-90">이력서 업로드 및 AI 성격 설정</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                이지은 지원자의 프로필과 적성검사 결과를 관리하는 페이지입니다.
              </p>
              <a 
                href="/candidate_profile_management.html" 
                className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 →
              </a>
            </div>
          </div>
        
          {/* 전체 지원자 관리 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📊 전체 지원자 관리</h2>
              <p className="opacity-90">지원자 순위 및 평가 결과</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                모든 지원자의 AI 평가 결과와 순위를 확인하는 페이지입니다.
              </p>
              <a 
                href="/all_candidates_page.html" 
                className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 →
              </a>
            </div>
          </div>

          {/* 개별 지원자 리포트 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📋 개별 지원자 리포트</h2>
              <p className="opacity-90">이지은 지원자 상세 평가 결과</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                이지은 지원자의 상세한 AI 평가 결과와 추천사항을 확인하는 페이지입니다.
              </p>
              <a 
                href="/ai_individual_report.html" 
                className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 →
              </a>
            </div>
          </div>

          {/* AI 면접 시뮬레이션 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🤖 AI 면접 시뮬레이션</h2>
              <p className="opacity-90">실시간 면접관AI vs 이지은 지원자AI 대화</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                AI 면접관과 지원자 AI 간의 실시간 대화를 시연하는 페이지입니다.
              </p>
              <a 
                href="/ai_interview_simulation.html" 
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기 →
              </a>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center text-gray-800 mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">🚀 AI 기반 채용 플랫폼의 핵심 가치</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="text-lg font-semibold mb-2">⏱️ 시간 절약</h4>
                <p className="opacity-90">기존 40시간 → AI 평가 2시간 (95% 절약)</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">💰 비용 절감</h4>
                <p className="opacity-90">면접관 인건비 800만원 → AI 평가 50만원 (93.8% 절감)</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">🎯 객관적 평가</h4>
                <p className="opacity-90">적성검사 결과와 AI 면접을 통한 종합적 평가</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
