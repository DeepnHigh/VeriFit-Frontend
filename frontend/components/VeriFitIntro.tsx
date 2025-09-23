import React from 'react';
import Link from 'next/link';

const VeriFitIntro: React.FC = () => {
  return (
    <div className="mt-16">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">🚀 AI 기반 채용 플랫폼, 'VeriFit'을 소개합니다!</h3>
        {/* 소개 본문 (demo 컴포넌트의 핵심 섹션을 발췌) */}
        <div className="mt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🎯 어떻게 작동하나요?</h2>
            <div className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{ wordBreak: 'keep-all', wordWrap: 'break-word' }}>
              지원자는 자신의 프로필과 포트폴리오를 한 번만 설정하면, 지원자AI가 모든 기업의 면접에 자동으로 응답합니다.
              <br /> 기업은 면접관AI를 설정하여 원하는 질문과 평가 기준을 정하면, AI가 지원자들을 자동으로 평가하고 랭킹합니다.
              <br /> 결과적으로 서류 검토와 1차 면접을 대체하여 시간과 비용을 크게 절약할 수 있습니다.
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-100 rounded-2xl p-8 mb-12 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">🔄 전체 플랫폼 흐름도</h3>
              <p className="text-gray-600">AI 기반 채용의 완벽한 자동화 과정</p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                  <h4 className="font-semibold text-gray-800 mb-3">지원자 등록 & AI 학습</h4>
                  <div className="text-sm text-gray-600 space-y-2 text-left">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span><span>프로필 정보 입력</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span><span>이력서/포트폴리오 업로드</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span><span>AI 질문 답변 학습</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span><span>적성검사 & 행동시뮬레이션</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                  <h4 className="font-semibold text-gray-800 mb-3">AI 면접 진행</h4>
                  <div className="text-sm text-gray-600 space-y-2 text-left">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span><span>면접관AI 질문 생성</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span><span>지원자AI 자동 응답</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span><span>실시간 대화 시뮬레이션</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span><span>24시간 연속 면접 가능</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                  <h4 className="font-semibold text-gray-800 mb-3">AI 평가 & 매칭</h4>
                  <div className="text-sm text-gray-600 space-y-2 text-left">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span><span>Hard/Soft Skill 평가</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span><span>기업 요구사항 매칭</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span><span>종합 점수 산출</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span><span>지원자 순위 결정</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-200 rounded-2xl p-8 mb-12 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">💬 면접관AI vs 지원자AI 면접</h3>
              <p className="text-gray-600">실제로는 이런 대화가 AI끼리 이루어집니다</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">🤖</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-left">면접관AI</h4>
                    <p className="text-sm text-gray-600">기업 요구사항 기반</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 text-blue-800 rounded-xl p-4 text-left">“React의 주요 특징과 장점에 대해 설명해주세요.”</div>
                  <div className="bg-blue-50 text-blue-800 rounded-xl p-4 text-left">“팀 프로젝트에서 의견 충돌이 발생했을 때 어떻게 해결하시나요?”</div>
                  <div className="bg-blue-50 text-blue-800 rounded-xl p-4 text-left">“성능 최적화 경험이 있다면 구체적인 사례를 들어주세요.”</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-r-4 border-orange-500">
                <div className="flex items-center justify-end gap-4 mb-6 pb-4 border-b-2 border-gray-100">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-right">지원자AI</h4>
                    <p className="text-sm text-gray-600">지원자의 프로필과 적성/행동검사 기반</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">👤</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-orange-50 text-orange-800 rounded-xl p-4 text-left">“React는 컴포넌트 기반 라이브러리로, 재사용성과 유지보수성이 뛰어납니다. Virtual DOM을 통해 성능도 최적화되어 있습니다.”</div>
                  <div className="bg-orange-50 text-orange-800 rounded-xl p-4 text-left">“먼저 상대방의 관점을 이해하려 노력하고, 객관적 데이터를 바탕으로 논의를 진행합니다.”</div>
                  <div className="bg-orange-50 text-orange-800 rounded-xl p-4 text-left">“React.memo와 useMemo를 활용하여 불필요한 리렌더링을 방지한 경험이 있습니다.”</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">✨ 주요 기능</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">원스톱 프로필 관리</h3>
                <p className="text-gray-600 leading-relaxed">자기소개서, 이력서, 포트폴리오, GitHub 링크 등을 업로드하면 나만의 AI 아바타가 생성됩니다.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">AI 면접 자동화</h3>
                <p className="text-gray-600 leading-relaxed">지원자AI가 기업의 모든 질문에 자동으로 응답하고, 면접관AI가 객관적으로 평가합니다.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">시간 절약</h3>
                <p className="text-gray-600 leading-relaxed">24시간 일하는 AI 면접관이 모든 지원자를 대상으로 서류 분석은 물론, Hard Skill과 Soft Skill을 아우르는 깊이 있는 면접을 진행합니다.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">비용 절감</h3>
                <p className="text-gray-600 leading-relaxed">면접관AI가 대신 면접을 진행함으로써 기존 면접관에 투여된 인건비 절약이 가능합니다.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">객관적 평가</h3>
                <p className="text-gray-600 leading-relaxed">AI가 감정이나 편견 없이 일관된 기준으로 모든 지원자를 평가합니다.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">맞춤형 질문</h3>
                <p className="text-gray-600 leading-relaxed">기업이 원하는 평가 기준과 질문을 설정하여 최적의 인재를 찾을 수 있습니다.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 지금 시작하세요</h2>
            <p className="text-lg text-gray-600 mb-8">AI Agent 기반 채용 플랫폼으로 더 효율적이고 공정한 채용을 경험해보세요</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup/applicant"
                className="inline-block bg-white text-gray-800 border-2 border-gray-400 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                지원자로 시작하기
              </Link>
              <Link 
                href="/signup/company"
                className="inline-block bg-gray-200 text-gray-800 border-2 border-gray-400 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                기업으로 시작하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeriFitIntro;
