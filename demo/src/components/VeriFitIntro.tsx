import React from 'react';

const VeriFitIntro: React.FC = () => {
  return (
    <div className="mt-8">
      {/* 플랫폼 소개 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🎯 어떻게 작동하나요?</h2>
        <div className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          지원자는 자신의 프로필과 포트폴리오를 한 번만 설정하면, 지원자AI가 모든 기업의 면접에 자동으로 응답합니다.
          기업은 면접관AI를 설정하여 원하는 질문과 평가 기준을 정하면, AI가 지원자들을 자동으로 평가하고 랭킹합니다.
          결과적으로 서류 검토와 1차 면접을 대체하여 시간과 비용을 크게 절약할 수 있습니다.
        </div>
      </div>

      {/* AI 대화 시뮬레이션 */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-200 rounded-2xl p-8 mb-12 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">💬 AI 면접 시뮬레이션</h3>
          <p className="text-gray-600">실제로는 이런 대화가 AI끼리 이루어집니다</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                🤖
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">면접관AI</h4>
                <p className="text-sm text-gray-600">기업 요구사항 기반</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 text-blue-800 rounded-xl p-4">
                &ldquo;React의 주요 특징과 장점에 대해 설명해주세요.&rdquo;
              </div>
              <div className="bg-blue-50 text-blue-800 rounded-xl p-4">
                &ldquo;팀 프로젝트에서 의견 충돌이 발생했을 때 어떻게 해결하시나요?&rdquo;
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                👤
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">지원자AI</h4>
                <p className="text-sm text-gray-600">김지원님 프로필 기반</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-orange-50 text-orange-800 rounded-xl p-4">
                &ldquo;React는 컴포넌트 기반 라이브러리로, 재사용성과 유지보수성이 뛰어납니다. Virtual DOM을 통해 성능도 최적화되어 있습니다.&rdquo;
              </div>
              <div className="bg-orange-50 text-orange-800 rounded-xl p-4">
                &ldquo;먼저 상대방의 관점을 이해하려 노력하고, 객관적 데이터를 바탕으로 논의를 진행합니다.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 기능 소개 */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">✨ 주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">원스톱 프로필 관리</h3>
            <p className="text-gray-600 leading-relaxed">자기소개서, 포트폴리오, GitHub 링크 등을 한 번만 업로드하면 모든 기업 지원에 활용됩니다.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">AI 면접 자동화</h3>
            <p className="text-gray-600 leading-relaxed">지원자AI가 기업의 모든 질문에 자동으로 응답하고, 면접관AI가 객관적으로 평가합니다.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">시간 절약</h3>
            <p className="text-gray-600 leading-relaxed">기존 40시간의 면접 시간을 2시간으로 단축하고, 95%의 시간을 절약할 수 있습니다.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">비용 절감</h3>
            <p className="text-gray-600 leading-relaxed">면접관 인건비 800만원을 AI 평가 비용 50만원으로 줄여 93.8%의 비용을 절감합니다.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">객관적 평가</h3>
            <p className="text-gray-600 leading-relaxed">AI가 감정이나 편견 없이 일관된 기준으로 모든 지원자를 평가합니다.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">맞춤형 질문</h3>
            <p className="text-gray-600 leading-relaxed">기업이 원하는 평가 기준과 질문을 설정하여 최적의 인재를 찾을 수 있습니다.</p>
          </div>
        </div>
      </div>

      {/* 통계 */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-12">📈 플랫폼 사용 성과 사례</h2>
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
            <div className="text-4xl font-bold text-green-600 mb-2">23</div>
            <div className="text-gray-600 font-medium">1차 통과자</div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 지금 시작하세요</h2>
        <p className="text-lg text-gray-600 mb-8">AI 기반 채용 플랫폼으로 더 효율적이고 공정한 채용을 경험해보세요</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/candidate_profile_management.html" 
            className="inline-block bg-white text-gray-800 border-2 border-gray-400 px-8 py-4 rounded-xl font-semibold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            지원자로 시작하기
          </a>
          <a 
            href="/company_recruitment_management.html" 
            className="inline-block bg-gray-200 text-gray-800 border-2 border-gray-400 px-8 py-4 rounded-xl font-semibold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            기업으로 시작하기
          </a>
        </div>
      </div>
    </div>
  );
};

export default VeriFitIntro;
