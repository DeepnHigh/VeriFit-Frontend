import React from 'react';
import Link from 'next/link';

export default function CandidatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center text-gray-800 mb-12">
          <h1 className="text-5xl font-bold mb-4">👤 지원자 시작하기 (테스트 중)</h1>
          <p className="text-xl opacity-90">AI 기반 채용 플랫폼에서 나만의 프로필을 만들어보세요</p>
        </div>

        {/* 지원자 기능 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* 프로필 관리 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">👤 프로필 관리</h2>
              <p className="opacity-90">이력서 업로드 및 AI 성격 설정</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-left whitespace-normal" style={{ wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                지원자 프로필과 적성검사 결과를 관리하는 페이지입니다.
              </p>
              <Link 
                href="/candidate_profile_management.html" 
                className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                target="_blank"
              >
                바로가기 →
              </Link>
            </div>
          </div>

          {/* 적성 검사 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🧠 적성 검사</h2>
              <p className="opacity-90">AI 기반 행동 패턴 및 적성 분석</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-left whitespace-normal" style={{ wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                지원자의 행동 패턴과 적성을 분석하여 객관적인 평가 결과를 제공합니다.
              </p>
              <Link 
                href="/aptitude_test.html" 
                className="inline-block bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
                target="_blank"
              >
                시작하기 →
              </Link>
            </div>
          </div>

          {/* 행동 시뮬레이션 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🎭 행동 시뮬레이션</h2>
              <p className="opacity-90">실제 업무 상황 시뮬레이션</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-left whitespace-normal" style={{ wordBreak: 'keep-all', wordWrap: 'break-word' }}>
                실제 업무 상황을 시뮬레이션하여 행동 패턴을 분석합니다.
              </p>
              <Link 
                href="/simulation_test.html" 
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                target="_blank"
              >
                시작하기 →
              </Link>
            </div>
          </div>
        </div>

        {/* 지원자 혜택 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">✨ 지원자 혜택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">원스톱 프로필 관리</h3>
              <p className="text-gray-600 text-left whitespace-normal break-words" style={{ wordBreak: 'keep-all' }}>자기소개서, 이력서, 포트폴리오, GitHub 링크 등을 업로드하면 나만의 AI 아바타가 생성됩니다.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">AI 면접 자동화</h3>
              <p className="text-gray-600 text-left whitespace-normal break-words" style={{ wordBreak: 'keep-all' }}>지원자AI가 기업의 모든 질문에 자동으로 응답하여 면접 준비 시간을 절약합니다.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">객관적 평가</h3>
              <p className="text-gray-600 text-left whitespace-normal break-words" style={{ wordBreak: 'keep-all' }}>AI가 감정이나 편견 없이 일관된 기준으로 평가하여 공정한 기회를 제공합니다.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">AI 기반 심층 분석</h3>
              <p className="text-gray-600 text-left whitespace-normal break-words" style={{ wordBreak: 'keep-all' }}>행동 시뮬레이션과 적성검사를 통해 지원자의 특성과 잠재력 및 업무 적합성을 정확하게 파악합니다.</p>
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
