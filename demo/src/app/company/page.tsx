import React from 'react';
import Link from 'next/link';

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center text-gray-800 mb-12">
          <h1 className="text-5xl font-bold mb-4">🏢 기업 시작하기</h1>
          <p className="text-xl opacity-90">AI 기반 채용 플랫폼으로 효율적이고 공정한 채용을 경험해보세요</p>
        </div>

        {/* 기업 기능 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 채용 관리 */}
          <div className="bg-white rounded-2xl shadow-2xl hover:transform hover:scale-105 transition-transform duration-300 relative">
            {/* main화면 스티커 */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg font-bold text-sm shadow-lg transform rotate-12 border-2 border-yellow-500">
                main화면
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full opacity-60"></div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold mb-2">🏢 기업 채용 관리</h2>
              <p className="opacity-90">채용공고 작성 및 AI 면접관 설정</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-left whitespace-normal" style={{ wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                콜린웨이브의 채용공고와 AI 면접관 평가 기준을 설정하는 페이지입니다.
              </p>
              <Link 
                href="/company_recruitment_management.html" 
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                target="_blank"
              >
                바로가기 →
              </Link>
            </div>
          </div>

          {/* 전체 지원자 관리 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">📊 전체 지원자 관리</h2>
              <p className="opacity-90">지원자 순위 및 평가 결과</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-left whitespace-normal" style={{ wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                콜린웨이브의 채용공고 중 &apos;커머스플랫폼 프론트엔드 개발자&apos; 채용공고에 대한 모든 지원자의 AI 평가 결과와 순위를 확인하는 페이지입니다.
              </p>
              <Link 
                href="/all_candidates_page.html" 
                className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                target="_blank"
              >
                바로가기 →
              </Link>
            </div>
          </div>

        </div>

        {/* 기업 혜택 */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-100 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">✨ 기업 혜택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">시간 절약</h3>
              <p className="text-gray-600">이제 채용 공고만 등록하세요. 24시간 일하는 AI 면접관이 모든 지원자를 대상으로 서류 분석은 물론, Hard Skill과 Soft Skill을 아우르는 깊이 있는 면접을 진행합니다.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">비용 절감</h3>
              <p className="text-gray-600">면접관AI가 대신 면접을 진행함으로써 기존 면접관에 투여된 인건비 절약이 가능합니다.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">객관적 평가</h3>
              <p className="text-gray-600">AI가 감정이나 편견 없이 일관된 기준으로 모든 지원자를 평가합니다.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">맞춤형 질문</h3>
              <p className="text-gray-600">기업이 원하는 평가 기준과 질문을 설정하여 최적의 인재를 찾을 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-8">📈 플랫폼 사용 성과 사례</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600 font-medium">시간 절약</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">93.8%</div>
              <div className="text-gray-600 font-medium">비용 절감</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">156</div>
              <div className="text-gray-600 font-medium">평가된 지원자</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">12</div>
              <div className="text-gray-600 font-medium">AI면접 1차 통과자</div>
            </div>
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-600 transition-colors"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
