'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '../../../../components/Header'
import Button from '../../../../components/Button'
import FileUploadButton from '@/components/FileUploadButton'
import { api } from '../../../../lib/api'
import { usePentagonChart } from '../../../../hooks/useHexagonChart'
import { useSimulateRequest } from '../../../../hooks/useSimulateRequest'
import { useUploadItems } from '../../../../hooks/useUploadItems'
import { useAptitudeData } from '../../../../hooks/useAptitudeData'
import { useQuestions } from '../../../../hooks/useQuestions'

type HexPoint = { score: number; label: string; color: string }

const HEX_DATA: HexPoint[] = [
  { score: 67, label: '현실형', color: '#4CAF50' },
  { score: 45, label: '탐구형', color: '#2196F3' },
  { score: 21, label: '관습형', color: '#f44336' },
  { score: 33, label: '사회형', color: '#9C27B0' },
  { score: 59, label: '진취형', color: '#607D8B' },
  { score: 96, label: '예술형', color: '#FF9800' }
]

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
  github: string[] // GitHub 링크 배열
}

export default function ApplicantDashboard() {

const { big5Data, hasCompletedTest } = useAptitudeData()
const { uploadItems } = useUploadItems()
const { questions, completedCount, totalCount, loading: questionsLoading, error: questionsError, saveAnswer } = useQuestions()
const { simulateRequest } = useSimulateRequest()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
const [userFiles, setUserFiles] = useState<UserFiles | null>(null)
const [loading, setLoading] = useState(true)
const [filesLoading, setFilesLoading] = useState(false)
const [error, setError] = useState('')
const [answers, setAnswers] = useState<Record<string, string>>({})
const [savingAnswers, setSavingAnswers] = useState<Record<string, boolean>>({})

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
      console.log('  - API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
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

// 파일 업로드 성공 후 파일 목록 새로고침
const handleUploadSuccess = () => {
    console.log('🔄 파일 업로드 성공 - 파일 목록 새로고침')
    fetchUserFiles()
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

  useEffect(() => {
    console.log('🎯 === 컴포넌트 마운트 ===')
    console.log('ApplicantDashboard 컴포넌트가 마운트되었습니다!')
    
    // 컴포넌트 마운트 시 사용자 프로필 데이터와 파일 목록 가져오기
    fetchUserProfile()
    fetchUserFiles()
    
    // 육각형 차트 그리기
    if (canvasRef.current) {
      drawHexagonChart(canvasRef.current, HEX_DATA)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-black">나를 대변하는 AI를 위한 프로필 설정</p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
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
                  <div className="text-xl font-bold text-black mb-1">{userProfile.full_name || '사용자'}</div>
                  <div className="text-black mb-4">{userProfile.total_experience_years ? `${userProfile.total_experience_years}년 경력` : '경력 정보'}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-black font-bold text-lg">-</div>
                    <div className="text-xs text-black">지원 공고</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-black font-bold text-lg">-</div>
                    <div className="text-xs text-black">AI 면접</div>
                  </div>
                </div>
                
                {/* 자기소개 (bio) 섹션 추가 */}
                {userProfile.bio && (
                  <div className="mt-4 rounded-lg p-4">
                    <div className="text-sm text-black leading-relaxed" style={{ wordBreak: 'keep-all', whiteSpace: 'pre-wrap' }}>
                      {userProfile.bio}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 rounded-lg p-4 bg-green-50">
                  <div className="font-semibold text-black mb-1">🤖 지원자AI 상태</div>
                  <div className="text-sm text-black">프로필 완성도: <b>{userProfile.profile_completion_percentage || 0}%</b></div>
                  <div className="text-xs text-black mt-1">마지막 업데이트: {userProfile.last_profile_update ? new Date(userProfile.last_profile_update).toLocaleDateString() : '-'}</div>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 border relative pb-20">
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">📞 연락처</h3>
                  <div className="divide-y text-sm">
                    <div className="flex justify-between py-2"><span className="font-medium text-black">이메일</span><span className="text-black">{userProfile.email || '-'}</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">전화번호</span><span className="text-black">{userProfile.phone || '-'}</span></div>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2">🎓 학력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex justify-between py-2"><span className="font-medium text-black">최종학력</span><span className="text-black">{userProfile.education_level || '-'}</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">대학교</span><span className="text-black">{userProfile.university || '-'}</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">전공</span><span className="text-black">{userProfile.major || '-'}</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">졸업년도</span><span className="text-black">{userProfile.graduation_year || '-'}</span></div>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="font-semibold text-black mb-2">💼 경력</h3>
                  <div className="divide-y text-sm">
                    <div className="flex justify-between py-2"><span className="font-medium text-black">총 경력</span><span className="text-black">{userProfile.total_experience_years ? `${userProfile.total_experience_years}년` : '-'}</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">최근 직장</span><span className="text-black">{userProfile.company_name || '-'}</span></div>
                    <div className="flex justify-between py-2"><span className="font-medium text-black">위치</span><span className="text-black">{userProfile.location || '-'}</span></div>
                  </div>
                </div>
                <div className="flex gap-2 absolute right-5 bottom-5">
                  <Button onClick={() => simulateRequest('개인정보 채우기')} variant="secondary" size="sm">업로드한 문서로 개인정보 채우기</Button>
                  <Button onClick={() => simulateRequest('개인정보 수정')} variant="primary" size="sm">수정</Button>
                </div>
              </div>
            </div>

            {/* 포트폴리오 및 자료 섹션 */}
            <section className="bg-gray-50 rounded-xl p-6 border mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-black font-semibold">📁 포트폴리오 및 자료</h3>
                {filesLoading && (
                  <div className="text-sm text-gray-600">파일 목록을 불러오는 중...</div>
                )}
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* 자기소개서 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-semibold text-black mb-1">자기소개서</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.cover_letter && userFiles.cover_letter.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.cover_letter.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('cover_letter', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('cover_letter', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="cover_letter"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>

                {/* 포트폴리오 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-semibold text-black mb-1">포트폴리오</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.portfolio && userFiles.portfolio.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.portfolio.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('portfolio', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('portfolio', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="portfolio"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>

                {/* GitHub 링크 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="font-semibold text-black mb-1">GitHub 링크</div>
                  <div className="text-sm text-gray-600 mb-3">GitHub 저장소 링크가 포함된 텍스트 파일을 업로드하세요</div>
                  
                  {/* GitHub 링크 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.github && userFiles.github.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.github.map((link, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block"
                                title={link}
                              >
                                {link}
                              </a>
                            </div>
                            <button
                              onClick={() => handleFileDelete('github', 'github.txt')}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="링크 파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 GitHub 링크가 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="github"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="GitHub 링크 파일 업로드"
                  />
                </div>

                {/* 이력서 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-semibold text-black mb-1">이력서</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.resume && userFiles.resume.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.resume.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('resume', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('resume', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="resume"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>

                {/* 수상 경력 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-semibold text-black mb-1">수상 경력</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.award && userFiles.award.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.award.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('award', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('award', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="award"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>

                {/* 증명서 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">📜</div>
                  <div className="font-semibold text-black mb-1">증명서</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.certificate && userFiles.certificate.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.certificate.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('certificate', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('certificate', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="certificate"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>

                {/* 자격증 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">🎖️</div>
                  <div className="font-semibold text-black mb-1">자격증</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.qualification && userFiles.qualification.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.qualification.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('qualification', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('qualification', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="qualification"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>

                {/* 논문 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">📖</div>
                  <div className="font-semibold text-black mb-1">논문</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.paper && userFiles.paper.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.paper.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('paper', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('paper', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                    </button>
                  </div>
                ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="paper"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>

                {/* 기타 자료 */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-semibold text-black mb-1">기타 자료</div>
                  
                  {/* 파일 목록 표시 */}
                  <div className="mb-3">
                    {userFiles?.other && userFiles.other.length > 0 ? (
                      <div className="space-y-2">
                        {userFiles.other.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleFileDownload('other', file.name)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs truncate block w-full text-left"
                                title={file.name}
                              >
                                {file.name}
                              </button>
                              <div className="text-gray-500 text-xs">
                                {(file.size / 1024).toFixed(1)}KB
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileDelete('other', file.name)}
                              className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="파일 삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        업로드된 파일이 없습니다
                      </div>
                    )}
                  </div>
                  
                  <FileUploadButton
                    userId={localStorage.getItem('userId') || ''}
                    documentType="other"
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="파일 선택"
                  />
                </div>
              </div>
            </section>

            {/* Big5 성격검사 결과 */}
            <section className="rounded-xl p-6 border mb-8 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-black font-semibold">🧠 Big5 성격검사 결과 분석</h3>
                <Link href="/applicant/big5-test" className="px-3 py-2 rounded-md text-sm text-white bg-green-600 cursor-pointer hover:bg-green-700 transition-colors">
                  {hasCompletedTest ? '🔄 성격검사 다시하기' : '🧠 성격검사 시작하기'}
                </Link>
              </div>
              {hasCompletedTest ? (
                <>
              <div className="flex justify-center">
                <canvas ref={canvasRef} width={400} height={400} className="max-w-full" />
              </div>
                  {/* Big5 점수 표 */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-green-600 text-black">
                          <th className="text-left p-3 text-black">성격 차원</th>
                      <th className="text-left p-3 text-black">점수</th>
                          <th className="text-left p-3 text-black">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                        {big5Data.map((p) => (
                      <tr key={p.label}>
                        <td className="p-3 text-black"><b>{p.label}</b></td>
                        <td className="p-3 text-black">{p.score}점</td>
                            <td className="p-3 text-black text-xs">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧠</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">성격검사를 시작해보세요!</h4>
                  <p className="text-gray-500 mb-6">Big5 성격검사를 통해 당신의 성격을 분석하고<br/>더 정확한 AI 프로필을 만들어보세요.</p>
                  <Link href="/applicant/big5-test" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    🚀 성격검사 시작하기
                  </Link>
                </div>
              )}
              {/* Big5 해석 섹션 - 검사 완료 후에만 표시 */}
              {hasCompletedTest && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-black mb-2">📋 성격 분석 해석</h4>
                  <div className="text-sm text-black space-y-1">
                    <p><strong>개방성:</strong> 경험에 대한 개방성은 상상력이 풍부하고 창의적인 사람들과 현실적이고 전통적인 사람들을 구별하는 인지 스타일의 차원을 설명합니다.</p>
                    <p><strong>성실성:</strong> 성실성은 우리가 충동을 어떻게 통제하고, 조절하며, 지시하는지를 다룹니다.</p>
                    <p><strong>외향성:</strong> 외향성은 외부 세계와의 두드러진 관여로 표시됩니다.</p>
                    <p><strong>우호성:</strong> 우호성은 협력과 사회적 조화에 대한 관심의 개인 차이를 반영합니다. 우호적인 개인은 다른 사람들과 잘 지내는 것을 중요하게 생각합니다</p>
                    <p><strong>신경성:</strong> 신경증은 부정적인 감정을 경험하는 경향을 나타냅니다.(낮을수록 안정적)</p>
                  </div>
                </div>
              )}
            </section>

            {/* AI 학습 질문 섹션 요약 */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-black font-semibold">🤖 AI 학습을 위한 질문 답변</h3>
                <div className="text-sm text-black text-right">
                  <b>{completedCount}/{totalCount}</b>
                </div>
              </div>
              
              {/* 질문 로딩 상태 */}
              {questionsLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-600">질문 목록을 불러오는 중...</div>
                </div>
              )}
              
              {/* 질문 에러 상태 */}
              {questionsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="text-red-800 text-sm">{questionsError}</div>
                </div>
              )}
              
              {/* AI 에이전트 학습 안내 */}
              {!questionsLoading && !questionsError && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5 mb-6">
                  <h4 className="text-green-800 font-semibold mb-3 flex items-center">
                    💡 AI 에이전트 학습 안내
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm" style={{ wordBreak: 'keep-all', whiteSpace: 'normal' }}>
                    아래 질문들에 자세히 답변해주시면, 지원자AI가 더욱 정확하게 본인을 대변할 수 있습니다. 
                    답변이 많을수록 AI가 본인의 성향, 경험, 가치관을 더 정확하게 파악하여 면접에서 더 자연스럽고 일관된 답변을 생성할 수 있습니다.
                  </p>
                </div>
              )}
              
              {/* 질문 목록 */}
              {!questionsLoading && !questionsError && (
                <ul className="space-y-4 text-sm">
                  {questions.map((question, index) => (
                    <li key={question.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-black">Q{index + 1}. {question.text}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          question.status === 'completed' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {question.status === 'completed' ? '완료' : '미완료'}
                        </span>
                      </div>
                      
                      {/* 완료된 질문의 답변 미리보기 */}
                      {question.status === 'completed' && question.answer && (
                        <div className="mb-3 text-xs text-gray-600 bg-gray-50 rounded p-3">
                          <strong>답변:</strong> {question.answer.length > 100 ? `${question.answer.substring(0, 100)}...` : question.answer}
                        </div>
                      )}
                      
                      {/* 답변 입력 필드 (미완료 상태일 때만 표시) */}
                      {question.status === 'pending' && (
                        <div className="space-y-2">
                          <textarea
                            value={answers[question.id] || ''}
                            onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                            placeholder="이 질문에 대한 답변을 입력해주세요..."
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSaveAnswer(question.id)}
                              disabled={savingAnswers[question.id] || !answers[question.id]?.trim()}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                savingAnswers[question.id] || !answers[question.id]?.trim()
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {savingAnswers[question.id] ? '저장 중...' : '저장'}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              
              <div className="flex justify-center gap-3 mt-6">
                <Button onClick={() => simulateRequest('프로필 저장')} variant="success" size="md">💾 프로필 저장</Button>
                <Link href="/applicant/qna" onClick={(e) => { e.preventDefault(); simulateRequest('Q&A 관리') }} className="px-4 py-2 rounded-lg bg-indigo-600 text-white cursor-pointer">Q&A 관리</Link>
              </div>
            </section>
        </section>
        )}
      </main>
    </div>
  )
}

function drawHexagonChart(canvas: HTMLCanvasElement, data: HexPoint[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 150

  // 등고선
  for (let level = 1; level <= 5; level++) {
    const currentRadius = (radius * level) / 5
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2
      const x = centerX + currentRadius * Math.cos(angle)
      const y = centerY + currentRadius * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // 외곽
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 2
  ctx.stroke()

  // 데이터 영역
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2
    const scoreRadius = (radius * data[i].score) / 100
    const x = centerX + scoreRadius * Math.cos(angle)
    const y = centerY + scoreRadius * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(76, 175, 80, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#4CAF50'
  ctx.lineWidth = 3
  ctx.stroke()

  // 중심점
  ctx.beginPath()
  ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI)
  ctx.fillStyle = '#4CAF50'
  ctx.fill()
  ctx.strokeStyle = '#2E7D32'
  ctx.lineWidth = 2
  ctx.stroke()
}
