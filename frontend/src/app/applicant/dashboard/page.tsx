'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { logout } from '@/lib/auth'
import Button from '@/components/Button'
import PortfolioSection from '@/components/PortfolioSection'
import Big5Section from '@/components/Big5Section'
import QuestionsSection from '@/components/QuestionsSection'
import BehaviorTestResultSection from '@/components/BehaviorTestResultSection'
import { api, getApiBaseUrl } from '@/lib/api'
import { useSimulateRequest } from '../../../../hooks/useSimulateRequest'
import { useAptitudeData } from '../../../../hooks/useAptitudeData'
import { useQuestions } from '../../../../hooks/useQuestions'
import { 
  createBig5DataFromApi, 
  createBig5ChartDataFromApi, 
} from '../../../../data/big5Data'

// 사용자 프로필 데이터 타입 정의
interface UserProfile {
  full_name: string
  email: string
  phone: string
  bio: string
  total_experience_years: number
  company_name: string
  education_level: string
  university: string
  major: string
  graduation_year: number
  location: string
  profile_completion_percentage: number
  last_profile_update: string
}

// S3 파일 정보 타입 정의
interface S3File {
  name: string
  size: number
  lastModified: string
  downloadUrl: string
}

interface UserFiles {
  award: S3File[]
  certificate: S3File[]
  cover_letter: S3File[]
  other: S3File[]
  paper: S3File[]
  portfolio: S3File[]
  qualification: S3File[]
  resume: S3File[]
  github: S3File[] // GitHub 파일 배열
}

// 업데이트 페이로드 타입 (백엔드 스펙과 동일)
type JobSeekerUpdatePayload = {
  full_name?: string | null
  phone?: string | null
  email?: string | null
  bio?: string | null
  total_experience_years?: number | null
  company_name?: string | null
  education_level?: string | null
  university?: string | null
  major?: string | null
  graduation_year?: number | null
  location?: string | null
  is_profile_public?: boolean | null
}


export default function ApplicantDashboard() {

const { big5Data: localStorageBig5Data, hasCompletedTest: localStorageHasCompletedTest } = useAptitudeData()
const { questions, completedCount, totalCount, loading: questionsLoading, error: questionsError, saveAnswer } = useQuestions()
const { simulateRequest } = useSimulateRequest()
const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  // Big5 데이터 (API 기반)
  const { big5Data, big5ChartData, hasCompletedTest } = useMemo(() => {
    const apiResult = (userProfile as any)?.big5_test_results?.[0]
    if (!apiResult) {
      // API 데이터가 없으면 localStorage 데이터 사용
      return {
        big5Data: localStorageBig5Data,
        big5ChartData: [],
        hasCompletedTest: localStorageHasCompletedTest
      }
    }

    // API 데이터로 Big5 결과 생성
    return {
      big5Data: createBig5DataFromApi(apiResult),
      big5ChartData: createBig5ChartDataFromApi(apiResult),
      hasCompletedTest: true
    }
  }, [userProfile, localStorageBig5Data, localStorageHasCompletedTest])
const [userFiles, setUserFiles] = useState<UserFiles>({
  award: [],
  certificate: [],
  cover_letter: [],
  other: [],
  paper: [],
  portfolio: [],
  qualification: [],
  resume: [],
  github: []
})
const [loading, setLoading] = useState(true)
const [filesLoading, setFilesLoading] = useState(false)
const [error, setError] = useState('')
const [answers, setAnswers] = useState<Record<string, string>>({})
const [savingAnswers, setSavingAnswers] = useState<Record<string, boolean>>({})
const [editingAnswers, setEditingAnswers] = useState<Record<string, boolean>>({})
const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>({})
const [extracting, setExtracting] = useState(false)
const [extractStatus, setExtractStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
const [isEditing, setIsEditing] = useState(false)
const [editForm, setEditForm] = useState<JobSeekerUpdatePayload>({})
const [aiUpdating, setAiUpdating] = useState(false)
const [aiUpdateStatus, setAiUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
const [behaviorTestResult, setBehaviorTestResult] = useState<any>(null)

// 최종학력 표기 변환 맵
const EDUCATION_LABELS: Record<string, string> = {
  high_school: '고졸',
  associate: '전문학사',
  bachelor: '학사',
  master: '석사',
  phd: '박사',
}

const getEducationLabel = (value?: string | null) => {
  if (!value) return '-'
  return EDUCATION_LABELS[value] || value
}


const startEditProfile = () => {
  if (!userProfile) return
  setEditForm({
    full_name: userProfile.full_name || '',
    phone: userProfile.phone || '',
    email: userProfile.email || '',
    bio: userProfile.bio || '',
    total_experience_years: userProfile.total_experience_years ?? null,
    company_name: userProfile.company_name || '',
    education_level: userProfile.education_level || '',
    university: userProfile.university || '',
    major: userProfile.major || '',
    graduation_year: userProfile.graduation_year ?? null,
    location: userProfile.location || '',
  })
  setIsEditing(true)
}

const handleEditChange = (field: keyof JobSeekerUpdatePayload, value: string) => {
  setEditForm(prev => ({ ...prev, [field]: value }))
}

const handleEditNumberChange = (field: keyof JobSeekerUpdatePayload, value: string) => {
  const parsed = value === '' ? null : Number.isNaN(Number(value)) ? null : parseInt(value, 10)
  setEditForm(prev => ({ ...prev, [field]: parsed }))
}

const saveEditedProfile = async () => {
  if (!userProfile) return
  try {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다.')
      return
    }

    const payload: JobSeekerUpdatePayload = {
      full_name: (editForm.full_name ?? '').toString(),
      phone: (editForm.phone ?? '').toString(),
      email: (editForm.email ?? '').toString(),
      bio: (editForm.bio ?? '').toString(),
      total_experience_years: editForm.total_experience_years ?? null,
      company_name: (editForm.company_name ?? '').toString(),
      education_level: (editForm.education_level ?? '').toString(),
      university: (editForm.university ?? '').toString(),
      major: (editForm.major ?? '').toString(),
      graduation_year: editForm.graduation_year ?? null,
      location: (editForm.location ?? '').toString(),
    }

    // 빈 문자열은 null로 변환하여 불필요한 덮어쓰기를 방지
    Object.keys(payload).forEach((k) => {
      const key = k as keyof JobSeekerUpdatePayload
      if (typeof payload[key] === 'string' && (payload[key] as unknown as string).trim() === '') {
        payload[key] = null
      }
    })

    // 업데이트 API 호출 (PUT)
    await api.applicant.updateInfo(userId, payload as any)

    // 화면 상태 업데이트
    setUserProfile({
      ...userProfile,
      full_name: payload.full_name ?? userProfile.full_name,
      phone: payload.phone ?? userProfile.phone,
      email: payload.email ?? userProfile.email,
      bio: payload.bio ?? userProfile.bio,
      total_experience_years: payload.total_experience_years ?? userProfile.total_experience_years,
      company_name: payload.company_name ?? userProfile.company_name,
      education_level: payload.education_level ?? userProfile.education_level,
      university: payload.university ?? userProfile.university,
      major: payload.major ?? userProfile.major,
      graduation_year: payload.graduation_year ?? userProfile.graduation_year,
      location: payload.location ?? userProfile.location,
    })

    setIsEditing(false)
    alert('프로필이 저장되었습니다.')
  } catch (err) {
    console.error('프로필 저장 실패:', err)
    alert('프로필 저장에 실패했습니다. 다시 시도해주세요.')
  }
}

const cancelEditProfile = () => {
  setIsEditing(false)
  setEditForm({})
}

// 사용자 프로필 데이터 가져오기
const fetchUserProfile = async () => {
    console.log('🚀 === API 호출 시작 ===')
    console.log('현재 시간:', new Date().toLocaleString())
    
    try {
      setLoading(true)
      setError('')
      
      // localStorage 전체 내용 출력
      console.log('📦 localStorage 전체 내용:')
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = localStorage.getItem(key!)
        console.log(`  ${key}: ${value}`)
      }
      
      // userId 가져오기
      const userId = localStorage.getItem('userId')
      console.log('🔑 추출된 userId:', userId)
      
      if (!userId) {
        console.log('❌ userId가 없습니다!')
        setError('사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.')
        return
      }

      console.log('📡 API 호출 준비:')
      console.log('  - API URL:', getApiBaseUrl())
      console.log('  - 요청 URL:', '/applicants/${userId}')
      console.log('  - 토큰:', localStorage.getItem('token') ? '있음' : '없음')
      
      // API 호출하여 사용자 프로필 가져오기
      console.log('⏳ API 호출 중...')
      const profileData = await api.applicant.getProfile(userId) 
      
      console.log('✅ === API 응답 성공 ===')
      console.log('📄 받아온 프로필 데이터 (전체):')
      console.log(JSON.stringify(profileData, null, 2))
      
      console.log('📋 프로필 데이터 상세:')
      console.log('  - 이름:', profileData.full_name)
      console.log('  - 이메일:', profileData.email)
      console.log('  - 전화번호:', profileData.phone)
      console.log('  - 자기소개:', profileData.bio)
      console.log('  - 경력:', profileData.total_experience_years, '년')
      console.log('  - 회사:', profileData.company_name)
      console.log('  - 학력:', profileData.education_level)
      console.log('  - 대학교:', profileData.university)
      console.log('  - 전공:', profileData.major)
      console.log('  - 졸업년도:', profileData.graduation_year)
      console.log('  - 위치:', profileData.location)
      console.log('  - 완성도:', profileData.profile_completion_percentage, '%')
      console.log('  - 마지막 업데이트:', profileData.last_profile_update)
      
      setUserProfile(profileData)
      
      // 행동평가 결과 설정
      if ((profileData as any)?.behavior_text) {
        setBehaviorTestResult((profileData as any).behavior_text)
        console.log('✅ 행동평가 결과 설정 완료')
      } else {
        setBehaviorTestResult(null)
        console.log('ℹ️ 행동평가 결과 없음')
      }
      
      console.log('✅ 상태 업데이트 완료')
      
    } catch (err: unknown) {
      console.log('❌ === API 호출 실패 ===')
      console.error('에러 객체 전체:', err)
      console.error('에러 메시지:', (err as Error)?.message)
      console.error('응답 상태:', (err as any)?.response?.status)
      console.error('응답 데이터:', (err as any)?.response?.data)
      console.error('요청 URL:', (err as any)?.config?.url)
      console.error('요청 헤더:', (err as any)?.config?.headers)
      
      setError((err as any)?.response?.data?.message || '프로필을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
      console.log('🏁 === API 호출 종료 ===')
    }
  }

// 사용자 파일 목록 가져오기
const fetchUserFiles = async () => {
    console.log('📁 === 파일 목록 조회 시작 ===')
    
    try {
      setFilesLoading(true)
      
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.log('❌ userId가 없어서 파일 목록을 가져올 수 없습니다.')
        return
      }

      console.log('📡 파일 목록 API 호출 중...')
      const filesData = await api.s3.getUserFiles(userId)
      console.log('✅ 파일 목록 조회 성공:', filesData)
      
      setUserFiles(filesData)
      
    } catch (err: unknown) {
      console.error('❌ 파일 목록 조회 실패:', err)
      // 파일 목록 조회 실패는 에러로 표시하지 않음 (선택적 기능)
      console.log('백엔드 API가 아직 구현되지 않았습니다. 임시로 빈 파일 목록을 설정합니다.')
      setUserFiles({
        award: [],
        certificate: [],
        cover_letter: [],
        other: [],
        paper: [],
        portfolio: [],
        qualification: [],
        resume: [],
        github: []
      })
    } finally {
      setFilesLoading(false)
    }
  }

// 파일 다운로드 함수
const handleFileDownload = async (fileType: string, fileName: string) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      console.log(`📥 파일 다운로드: ${fileType}/${fileName}`)
      const downloadData = await api.s3.getDownloadUrl(userId, fileType, fileName)
      
      // 새 창에서 다운로드 URL 열기
      window.open(downloadData.downloadUrl, '_blank')
      
    } catch (err: unknown) {
      console.error('❌ 파일 다운로드 실패:', err)
      alert('파일 다운로드에 실패했습니다.')
    }
  }

// 파일 삭제 함수
const handleFileDelete = async (fileType: string, fileName: string) => {
    if (!confirm(`"${fileName}" 파일을 삭제하시겠습니까?`)) {
      return
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      console.log(`🗑️ 파일 삭제: ${fileType}/${fileName}`)
      const deleteData = await api.s3.deleteFile(userId, fileType, fileName)
      
      if (deleteData.success) {
        console.log('✅ 파일 삭제 성공')
        // 파일 목록 새로고침
        fetchUserFiles()
      } else {
        alert('파일 삭제에 실패했습니다.')
      }
      
    } catch (err: unknown) {
      console.error('❌ 파일 삭제 실패:', err)
      alert('파일 삭제에 실패했습니다.')
    }
  }

// 파일 업로드 성공 후 파일 목록 새로고침 + GitHub 업로드면 AI 업데이트 자동 실행
const handleUploadSuccess = async (documentType?: 'award' | 'certificate' | 'cover_letter' | 'other' | 'paper' | 'portfolio' | 'qualification' | 'resume' | 'github') => {
    console.log('🔄 파일 업로드 성공 - 파일 목록 새로고침', documentType)
    await fetchUserFiles()
    if (documentType === 'github') {
      try {
        await updateApplicantAI()
      } catch (e) {
        console.error('업로드 후 AI 업데이트 자동 실행 실패:', e)
      }
    }
  }

// 개인정보 추출 함수
const extractPersonalInfo = async () => {
  try {
    setExtracting(true)
    setExtractStatus('loading')
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다.')
      setExtractStatus('error')
      setExtracting(false)
      return
    }

    const response = await api.applicant.createParse(userId)

    // 응답에서 personal_info 추출
    const personalInfo = response.personal_info
    
    // 추출된 정보로 프로필 업데이트
    if (userProfile && response.success) {
      const updatedProfile = {
        ...userProfile,
        email: personalInfo.email || userProfile.email,
        phone: personalInfo.phone || userProfile.phone,
        education_level: personalInfo.education_level || userProfile.education_level,
        university: personalInfo.university || userProfile.university,
        major: personalInfo.major || userProfile.major,
        graduation_year: (typeof personalInfo.graduation_year === 'string'
          ? (parseInt(personalInfo.graduation_year, 10) || userProfile.graduation_year)
          : (personalInfo.graduation_year ?? userProfile.graduation_year)),
        total_experience_years: personalInfo.total_experience_years || userProfile.total_experience_years,
        company_name: personalInfo.company_name || userProfile.company_name,
      }
      
      setUserProfile(updatedProfile)
      alert(`개인정보가 성공적으로 추출되었습니다!\n처리된 파일: ${response.processed_files.length}개`)
      setExtractStatus('success')
    } else {
      alert(`개인정보 추출 실패: ${response.message}`)
      setExtractStatus('error')
    }

  } catch (err: unknown) {
    // 404 에러인 경우 백엔드 API 미구현으로 간주
    if ((err as any)?.response?.status === 404) {
      alert('개인정보 추출 기능이 아직 구현되지 않았습니다.\n백엔드 개발자에게 문의해주세요.')
    } else {
      alert('개인정보 추출에 실패했습니다. 다시 시도해주세요.')
    }
    setExtractStatus('error')
  } finally {
    setExtracting(false)
  }
}

// 지원자AI 업데이트 함수
const updateApplicantAI = async () => {
  try {
    setAiUpdating(true)
    setAiUpdateStatus('loading')
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다.')
      setAiUpdateStatus('error')
      setAiUpdating(false)
      return
    }

    // 1. 먼저 userProfile에서 github_repositories 데이터 확인
    let githubData = null
    if (userProfile) {
      githubData = (userProfile as any)?.github_repositories
    }
    
    // 2. userProfile에 GitHub 데이터가 없으면 업로드된 GitHub CSV 파일에서 처리
    if (!githubData || !githubData.repository || githubData.repository.length === 0) {
      console.log('📁 userProfile에 GitHub 데이터가 없음. 업로드된 GitHub CSV 파일 확인 중...')
      
      // 업로드된 GitHub 파일이 있는지 확인
      if (!userFiles.github || userFiles.github.length === 0) {
        alert('GitHub 레포지토리 정보가 없습니다. GitHub CSV 파일을 업로드하거나 프로필에 GitHub 레포지토리를 추가해주세요.')
        setAiUpdateStatus('error')
        setAiUpdating(false)
        return
      }
      
      console.log('✅ 업로드된 GitHub CSV 파일 발견:', userFiles.github)
      // GitHub CSV 파일이 업로드되어 있으면 백엔드에서 자동으로 처리하도록 빈 배열로 호출
      // 백엔드에서 업로드된 CSV 파일을 자동으로 읽어서 처리할 것으로 예상
      const response = await api.applicant.updateApplicantAI(userId, [])
      console.log('📡 백엔드 API 응답 (CSV 파일 자동 처리):', JSON.stringify(response, null, 2))
      
      if (response.success) {
        console.log('✅ GitHub CSV 파일 기반 AI 업데이트 성공!')
        alert('GitHub CSV 파일을 기반으로 지원자AI가 성공적으로 업데이트되었습니다!')
        setAiUpdateStatus('success')
      } else {
        console.log('❌ GitHub CSV 파일 기반 AI 업데이트 실패:', response.message)
        throw new Error(response.message || 'GitHub CSV 파일 기반 지원자AI 업데이트 실패')
      }
      return
    }

    // 3. userProfile에 GitHub 데이터가 있는 경우 기존 로직 사용
    console.log('📊 userProfile의 GitHub 데이터 사용:', githubData)
    const repositories = githubData.repository.map((repoUrl: string, index: number) => ({
      repository_url: repoUrl,
      github_username: githubData.username && githubData.username.length > 0 ? githubData.username[0] : 'unknown'
    }))

    // 4. 백엔드 API 호출
    const response = await api.applicant.updateApplicantAI(userId, repositories)
    console.log('📡 백엔드 API 응답 전체 (JSON 형태):', JSON.stringify(response, null, 2))

    // 5. 백엔드 응답 처리
    if (response.success) {
      console.log('✅ 백엔드 API 호출 성공!')
      console.log('📊 백엔드가 보내준 전체 데이터:', JSON.stringify(response, null, 2))
      alert('지원자AI가 성공적으로 업데이트되었습니다!')
      setAiUpdateStatus('success')
    } else {
      console.log('❌ 백엔드 API 호출 실패:', response.message)
      throw new Error(response.message || '지원자AI 업데이트 실패')
    }

  } catch (err: unknown) {
    console.error('지원자AI 업데이트 실패:', err)
    alert('지원자AI 업데이트에 실패했습니다. 다시 시도해주세요.')
    setAiUpdateStatus('error')
  } finally {
    setAiUpdating(false)
  }
}

// 답변 저장 핸들러
const handleSaveAnswer = async (questionId: string) => {
    const answer = answers[questionId]
    if (!answer || answer.trim() === '') {
      alert('답변을 입력해주세요.')
      return
    }

    setSavingAnswers(prev => ({ ...prev, [questionId]: true }))
    
    try {
      const result = await saveAnswer(questionId, answer.trim())
      if (result.success) {
        // 답변 저장 성공 시 로컬 상태에서 해당 답변 제거
        setAnswers(prev => {
          const newAnswers = { ...prev }
          delete newAnswers[questionId]
          return newAnswers
        })
      } else {
        alert(result.error || '답변 저장에 실패했습니다.')
      }
    } catch (err) {
      console.error('답변 저장 중 오류:', err)
      alert('답변 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingAnswers(prev => ({ ...prev, [questionId]: false }))
    }
  }

  // 완료된 답변 수정 시작
  const handleStartEditAnswer = (questionId: string, currentAnswer: string) => {
    setEditingAnswers(prev => ({ ...prev, [questionId]: true }))
    setEditedAnswers(prev => ({ ...prev, [questionId]: currentAnswer || '' }))
  }

  // 완료된 답변 수정 취소
  const handleCancelEditAnswer = (questionId: string) => {
    setEditingAnswers(prev => ({ ...prev, [questionId]: false }))
    setEditedAnswers(prev => {
      const next = { ...prev }
      delete next[questionId]
      return next
    })
  }

  // 완료된 답변 수정 저장
  const handleUpdateAnswer = async (questionId: string) => {
    const newAnswer = editedAnswers[questionId]
    if (!newAnswer || newAnswer.trim() === '') {
      alert('답변을 입력해주세요.')
      return
    }

    setSavingAnswers(prev => ({ ...prev, [questionId]: true }))

    try {
      const result = await saveAnswer(questionId, newAnswer.trim())
      if (result.success) {
        setEditingAnswers(prev => ({ ...prev, [questionId]: false }))
        setEditedAnswers(prev => {
          const next = { ...prev }
          delete next[questionId]
          return next
        })
      } else {
        alert(result.error || '답변 저장에 실패했습니다.')
      }
    } catch (err) {
      console.error('답변 수정 중 오류:', err)
      alert('답변 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingAnswers(prev => ({ ...prev, [questionId]: false }))
    }
  }

  useEffect(() => {
    console.log('🎯 === 컴포넌트 마운트 ===')
    console.log('ApplicantDashboard 컴포넌트가 마운트되었습니다!')
    
    // 컴포넌트 마운트 시 사용자 프로필 데이터와 파일 목록 가져오기
    fetchUserProfile()
    fetchUserFiles()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header rightVariant="applicant" displayName={userProfile?.full_name || '사용자'} onLogout={() => logout('/')} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-black">나를 대변하는 AI를 위한 프로필 설정</p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-12 gap-3">
            <span className="inline-block w-12 h-12 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin" aria-hidden="true"></span>
            <div className="text-lg text-gray-600">프로필 정보를 불러오는 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
            <button 
              onClick={fetchUserProfile}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 사용자 프로필 데이터 */}
        {!loading && !error && userProfile && (

        <section>
            {/* 상단 프로필 카드 + 상세 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1 bg-gray-50 rounded-xl p-6 border">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                  {userProfile.full_name ? userProfile.full_name.charAt(0) : '사'}
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-black mb-1">
                    {!isEditing ? (
                      userProfile.full_name || '사용자'
                    ) : (
                      <input
                        value={typeof editForm.full_name === 'string' ? editForm.full_name : ''}
                        onChange={(e) => handleEditChange('full_name', e.target.value)}
                        className="px-3 py-2 border rounded w-full text-black"
                        placeholder="이름"
                      />
                    )}
                  </div>
                  <div className="text-black mb-4">
                    {!isEditing ? (
                      userProfile.total_experience_years ? `${userProfile.total_experience_years}년 경력` : '경력 정보'
                    ) : (
                      <input
                        type="number"
                        value={typeof editForm.total_experience_years === 'number' ? editForm.total_experience_years : (editForm.total_experience_years ?? '')}
                        onChange={(e) => handleEditNumberChange('total_experience_years', e.target.value)}
                        className="px-3 py-2 border rounded w-full text-black"
                        placeholder="총 경력(년)"
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border">
                    <a href="/applicant/applications" className="block">
                      <div className="text-black font-bold text-lg text-center underline underline-offset-4 hover:text-blue-600">
                        {(userProfile as any)?.application_count ?? ((userProfile as any)?.application_ids?.length ?? 0)}
                      </div>
                    </a>
                    <div className="text-xs text-black text-center">지원 공고</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-black font-bold text-lg text-center">{(userProfile as any)?.ai_interview_count ?? ((userProfile as any)?.ai_interview_ids?.length ?? 0)}</div>
                    <div className="text-xs text-black text-center">AI 면접</div>
                  </div>
                </div>
                
                {/* 자기소개 (bio) 섹션 추가 */}
                <div className="mt-4 rounded-lg p-4">
                  {!isEditing ? (
                    userProfile.bio ? (
                      <div className="text-sm text-black leading-relaxed" style={{ wordBreak: 'keep-all', whiteSpace: 'pre-wrap' }}>
                        {userProfile.bio}
                      </div>
                    ) : null
                  ) : (
                    <textarea
                      value={typeof editForm.bio === 'string' ? editForm.bio : ''}
                      onChange={(e) => handleEditChange('bio', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="자기소개"
                    />
                  )}
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 border relative pb-20">
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">📞 연락처</h3>
                  <div className="divide-y text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">이메일</span>
                      {!isEditing ? (
                        <span className="text-black">{userProfile.email || '-'}</span>
                      ) : (
                        <input
                          value={typeof editForm.email === 'string' ? editForm.email : ''}
                          onChange={(e) => handleEditChange('email', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black"
                          placeholder="이메일"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">전화번호</span>
                      {!isEditing ? (
                        <span className="text-black">{userProfile.phone || '-'}</span>
                      ) : (
                        <input
                          value={typeof editForm.phone === 'string' ? editForm.phone : ''}
                          onChange={(e) => handleEditChange('phone', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black"
                          placeholder="전화번호"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">🎓 학력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">최종학력</span>
                      {!isEditing ? (
                        <span className="text-black">{getEducationLabel(userProfile.education_level)}</span>
                      ) : (
                        <select
                          value={typeof editForm.education_level === 'string' ? editForm.education_level : ''}
                          onChange={(e) => handleEditChange('education_level', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black bg-white"
                        >
                          <option value="">선택</option>
                          <option value="high_school">고졸</option>
                          <option value="associate">전문학사</option>
                          <option value="bachelor">학사</option>
                          <option value="master">석사</option>
                          <option value="phd">박사</option>
                        </select>
                      )}
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">대학교</span>
                      {!isEditing ? (
                        <span className="text-black">{userProfile.university || '-'}</span>
                      ) : (
                        <input
                          value={typeof editForm.university === 'string' ? editForm.university : ''}
                          onChange={(e) => handleEditChange('university', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black"
                          placeholder="대학교"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">전공</span>
                      {!isEditing ? (
                        <span className="text-black">{userProfile.major || '-'}</span>
                      ) : (
                        <input
                          value={typeof editForm.major === 'string' ? editForm.major : ''}
                          onChange={(e) => handleEditChange('major', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black"
                          placeholder="전공"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">졸업년도</span>
                      {!isEditing ? (
                        <span className="text-black">{userProfile.graduation_year || '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={typeof editForm.graduation_year === 'number' ? editForm.graduation_year : (editForm.graduation_year ?? '')}
                          onChange={(e) => handleEditNumberChange('graduation_year', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black"
                          placeholder="졸업년도"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-semibold text-black mb-2">💼 경력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">총 경력</span>
                      {!isEditing ? (
                        <span className="text-black">{userProfile.total_experience_years ? `${userProfile.total_experience_years}년` : '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={typeof editForm.total_experience_years === 'number' ? editForm.total_experience_years : (editForm.total_experience_years ?? '')}
                          onChange={(e) => handleEditNumberChange('total_experience_years', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black"
                          placeholder="총 경력(년)"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-medium text-black">최근 직장</span>
                      {!isEditing ? (
                        <span className="text-black">{userProfile.company_name || '-'}</span>
                      ) : (
                        <input
                          value={typeof editForm.company_name === 'string' ? editForm.company_name : ''}
                          onChange={(e) => handleEditChange('company_name', e.target.value)}
                          className="px-3 py-1.5 border rounded w-60 text-black"
                          placeholder="회사명"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 absolute right-5 bottom-8">
                  <div className="flex items-center gap-3">
                    <Button onClick={extractPersonalInfo} variant="secondary" size="sm" disabled={extracting}>
                      {extracting ? '추출 중...' : '업로드한 문서로 개인정보 채우기'}
                    </Button>
                    {(extractStatus === 'loading' || extractStatus === 'error') && (
                      <div className="flex items-center gap-2">
                        {extractStatus === 'loading' && (
                          <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" aria-hidden="true"></span>
                        )}
                        <span className={`${extractStatus === 'loading' ? 'text-red-600' : 'text-red-600'} text-sm font-medium`}>
                          {extractStatus === 'loading' && '페이지를 이동하거나 끄지 마세요!'}
                          {extractStatus === 'error' && '실패했습니다. 다시 시도해 주세요.'}
                        </span>
                      </div>
                    )}
                    {!isEditing ? (
                      <Button onClick={startEditProfile} variant="primary" size="sm">수정</Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button onClick={saveEditedProfile} variant="success" size="sm">저장</Button>
                        <Button onClick={cancelEditProfile} variant="secondary" size="sm">취소</Button>
                      </div>
                    )}
                  </div>
                  {extractStatus === 'success' && (
                    <div className="text-green-600 text-sm font-medium">완료되었습니다</div>
                  )}
                </div>
              </div>
            </div>

            {/* 포트폴리오 및 자료 섹션 */}
            <PortfolioSection
              userFiles={userFiles}
              filesLoading={filesLoading}
              userId={localStorage.getItem('userId') || ''}
              onFileDownload={handleFileDownload}
              onFileDelete={handleFileDelete}
              onUploadSuccess={handleUploadSuccess}
              aiUpdateStatus={aiUpdateStatus}
            />

            {/* Big5 성격검사 결과 */}
            <Big5Section
              big5Data={big5Data}
              big5ChartData={big5ChartData}
              hasCompletedTest={hasCompletedTest}
            />

            {/* 행동평가 결과 분석 섹션 */}
            <BehaviorTestResultSection behaviorTestResult={behaviorTestResult} />

            {/* AI 학습 질문 섹션 요약 */}
            <QuestionsSection
              questions={questions}
              completedCount={completedCount}
              totalCount={totalCount}
              questionsLoading={questionsLoading}
              questionsError={questionsError}
              answers={answers}
              editingAnswers={editingAnswers}
              editedAnswers={editedAnswers}
              savingAnswers={savingAnswers}
              onAnswerChange={(questionId, answer) => setAnswers(prev => ({ ...prev, [questionId]: answer }))}
              onStartEditAnswer={handleStartEditAnswer}
              onCancelEditAnswer={handleCancelEditAnswer}
              onUpdateAnswer={handleUpdateAnswer}
              onSaveAnswer={handleSaveAnswer}
              onClearAnswer={(questionId) => setAnswers(prev => ({ ...prev, [questionId]: '' }))}
              onSimulateRequest={simulateRequest}
            />

            {/* 지원자AI 수동 업데이트 버튼 제거됨 (업로드 완료 시 자동 실행) */}
        </section>
        )}
      </main>
    </div>
  )
}
