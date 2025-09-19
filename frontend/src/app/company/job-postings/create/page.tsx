'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { api } from '@/lib/api'
import { logout } from '@/lib/auth'

type EmploymentType = '정규직' | '계약직' | '인턴' | '프리랜서'

export default function CreateJobPostingPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [experience, setExperience] = useState('신입')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('정규직')
  const [salaryMin, setSalaryMin] = useState<string>('')
  const [salaryMax, setSalaryMax] = useState<string>('')
  const [responsibilities, setResponsibilities] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [preferences, setPreferences] = useState('')
  const [applicationDeadline, setApplicationDeadline] = useState<string>('')
  const [location, setLocation] = useState<string>('')

  const hardSkillOptions = [
    'JavaScript/TypeScript',
    'React/Vue.js',
    'CSS/SCSS',
    'Git/GitHub',
    'API 설계',
    '성능 최적화',
    '보안/인증',
    '테스트/QA',
    'CI/CD',
  ]
  const softSkillOptions = [
    '의사소통 능력',
    '문제 해결력',
    '팀워크',
    '스트레스 관리',
    '적응력',
    '태도',
    '리더십',
    '자기 주도성',
  ]

  const [selectedHardSkills, setSelectedHardSkills] = useState<string[]>([])
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([])
  const [applyingAI, setApplyingAI] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const toggleTag = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const handleApplyAIConfig = async () => {
    setApplyingAI(true)
    // 데모와 동일하게 동작 알림만 유지
    setTimeout(() => {
      alert('면접관AI 설정이 적용되었습니다.')
      setApplyingAI(false)
    }, 500)
  }

  const buildDescription = () => {
    const lines: string[] = []
    if (responsibilities.trim()) {
      lines.push('주요 업무:\n' + responsibilities.trim())
    }
    if (preferences.trim()) {
      lines.push('\n우대사항:\n' + preferences.trim())
    }
    const minVal = salaryMin.trim()
    const maxVal = salaryMax.trim()
    if (minVal || maxVal) {
      const display = `${minVal ? minVal : '-'}${minVal || maxVal ? ' ~ ' : ''}${maxVal ? maxVal : '-'}`
      lines.push(`\n급여 범위: ${display}`)
    }
    lines.push(`\n경력 요구사항: ${experience}`)
    lines.push(`근무 형태: ${employmentType}`)
    if (applicationDeadline.trim()) {
      lines.push(`마감일: ${applicationDeadline.trim()}`)
    }
    return lines.join('\n')
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('포지션명을 입력해주세요.')
      return
    }
    // 연봉 유효성 검사
    const hasMin = salaryMin.trim() !== ''
    const hasMax = salaryMax.trim() !== ''
    if (hasMin && hasMax) {
      const minVal = parseInt(salaryMin, 10)
      const maxVal = parseInt(salaryMax, 10)
      if (Number.isNaN(minVal) || Number.isNaN(maxVal)) {
        alert('연봉은 숫자로 입력해주세요.')
        return
      }
      if (minVal > maxVal) {
        alert('최소 연봉은 최대 연봉보다 클 수 없습니다.')
        return
      }
      if (minVal < 0 || maxVal < 0) {
        alert('연봉은 0 이상이어야 합니다.')
        return
      }
    }
    setPublishing(true)
    try {
      // 사전 점검: 토큰 확인
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        alert('로그인 토큰이 없습니다. 다시 로그인해주세요.')
        return
      }
      const aiCriteria = {
        hard_skills: selectedHardSkills,
        soft_skills: selectedSoftSkills,
      }
      const requirementsArray = qualifications
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      // 고용형태 매핑 (백엔드 enum)
      const employmentTypeMap: Record<string, 'full_time' | 'part_time' | 'contract' | 'internship'> = {
        '정규직': 'full_time',
        '계약직': 'contract',
        '인턴': 'internship',
        '프리랜서': 'contract',
      }

      // 경력 요구사항을 position_level로 매핑 (백엔드 enum)
      const positionLevelMap: Record<string, 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager'> = {
        '신입': 'junior',
        '1-3년': 'mid',
        '3-5년': 'senior',
        '5년 이상': 'lead',
      }

      const payload: any = {
        title: title.trim(),
        main_tasks: responsibilities.trim() ? responsibilities.trim() : '',
        requirements: requirementsArray,
        preferred: preferences.trim() ? preferences.trim() : '',
        ai_criteria: aiCriteria,
        status: 'active',
      }

      // optional fields
      const mappedEmployment = employmentTypeMap[employmentType]
      if (mappedEmployment) payload.employment_type = mappedEmployment

      const mappedPositionLevel = positionLevelMap[experience]
      if (mappedPositionLevel) payload.position_level = mappedPositionLevel

      if (salaryMin.trim() !== '') payload.salary_min = parseInt(salaryMin, 10)
      if (salaryMax.trim() !== '') payload.salary_max = parseInt(salaryMax, 10)
      if (applicationDeadline.trim() !== '') payload.application_deadline = applicationDeadline.trim()
      if (location.trim() !== '') payload.location = location.trim()
      if (preferences.trim() !== '') payload.preferred = preferences.trim()

      // 디버그 로그
      try {
        console.log('🛰️ JobPosting 생성 요청')
        console.log('  - API Base URL:', (window as any)?.location?.hostname ? `http://${window.location.hostname}:8001` : 'unknown')
        console.log('  - Endpoint: /job-postings')
        console.log('  - Authorization:', token ? 'Bearer <token>' : '없음')
        console.log('  - Payload:', JSON.parse(JSON.stringify(payload)))
      } catch (_) {}

      const resp = await api.company.createJobPosting(payload)

      // 응답 검증: 생성된 식별자(id) 존재 여부 확인
      const createdId = (resp && (resp.id || resp.job_postings_id))
      if (!createdId) {
        console.warn('⚠️ 생성 응답에 id가 없습니다. 응답:', resp)
        throw new Error('생성 응답이 올바르지 않습니다')
      }

      alert('공고가 등록되었습니다.')
      router.push('/company/dashboard')
    } catch (err) {
      console.error('❌ 공고 등록 실패:', err)
      alert('공고 등록에 실패했습니다. 콘솔 로그를 확인해주세요.')
    } finally {
      setPublishing(false)
    }
  }

  const handleLogout = () => logout('/')

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* 헤더 */}
      <Header rightVariant="company" onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 제목/설명 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">📝 새 공고 작성</h2>
          <p className="text-black">새로운 채용 공고를 작성하고 면접관AI 평가 기준을 설정하세요.</p>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-black mb-1">포지션명</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 백엔드 개발자" className="border rounded px-3 py-2 text-black placeholder-gray-500" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-black mb-1">경력 요구사항</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="border rounded px-3 py-2 bg-white text-black">
                <option>신입</option>
                <option>1-3년</option>
                <option>3-5년</option>
                <option>5년 이상</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-black mb-1">근무 형태</label>
              <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType)} className="border rounded px-3 py-2 bg-white text-black">
                <option>정규직</option>
                <option>계약직</option>
                <option>인턴</option>
                <option>프리랜서</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-black mb-1">연봉(최소/최대)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={0}
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="최소 (만원)"
                  className="border rounded px-3 py-2 text-black placeholder-gray-500"
                />
                <input
                  type="number"
                  min={0}
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="최대 (만원)"
                  className="border rounded px-3 py-2 text-black placeholder-gray-500"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-black mb-1">공고 마감일</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="border rounded px-3 py-2 text-black"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-black mb-1">근무지</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 서울시 강남구 / 재택"
                className="border rounded px-3 py-2 text-black placeholder-gray-500"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-black mb-1">주요 업무</label>
              <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder="주요 업무 내용을 입력하세요" className="border rounded px-3 py-2 min-h-28 text-black placeholder-gray-500" />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-black mb-1">자격 요건</label>
              <textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} placeholder="자격 요건을 입력하세요" className="border rounded px-3 py-2 min-h-28 text-black placeholder-gray-500" />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-black mb-1">우대사항</label>
              <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="우대사항을 입력하세요" className="border rounded px-3 py-2 min-h-28 text-black placeholder-gray-500" />
            </div>
          </div>
        </div>

        {/* 면접관AI 설정 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">🤖 면접관AI 평가 기준 설정</h3>

          {/* 하드 스킬 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">💻 하드 스킬</h4>
              <div className="flex items-center gap-2 text-black text-sm">
                <input placeholder="기술 검색" className="border rounded px-2 py-1 text-black placeholder-gray-500" />
                <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-black" onClick={() => alert('검색 기능은 데모에서 미반영입니다.')}>🔍</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {hardSkillOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleTag(opt, selectedHardSkills, setSelectedHardSkills)}
                  className={`px-3 py-1 rounded-full border text-sm ${selectedHardSkills.includes(opt) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-black border-gray-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 소프트 스킬 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">🎭 소프트 스킬</h4>
              <div className="flex items-center gap-2 text-black text-sm">
                <input placeholder="역량 검색" className="border rounded px-2 py-1 text-black placeholder-gray-500" />
                <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-black" onClick={() => alert('검색 기능은 데모에서 미반영입니다.')}>🔍</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {softSkillOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleTag(opt, selectedSoftSkills, setSelectedSoftSkills)}
                  className={`px-3 py-1 rounded-full border text-sm ${selectedSoftSkills.includes(opt) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-black border-gray-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 액션: 취소(좌) / 공고 올리기(우) */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/company/dashboard')} className="px-6 py-3 rounded border border-gray-300 text-black hover:bg-gray-100">
            취소
          </button>
          <button onClick={handlePublish} disabled={publishing} className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {publishing ? '등록 중...' : '📢 공고 올리기'}
          </button>
        </div>
      </div>
    </div>
  )
}


