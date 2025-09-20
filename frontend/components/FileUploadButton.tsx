'use client'

import { useState, useRef } from 'react'
import { api, FileUploadResponse } from '@/lib/api'

interface FileUploadButtonProps {
  userId: string
  documentType: 'cover_letter' | 'portfolio' | 'resume' | 'award' | 'certificate' | 'qualification' | 'paper' | 'other' | 'github'
  onUploadSuccess: () => void
  buttonText?: string
  className?: string
}

export default function FileUploadButton({ 
  userId, 
  documentType, 
  onUploadSuccess, 
  buttonText = '파일 선택',
  className = 'px-3 py-2 rounded-md text-sm text-white bg-green-600 cursor-pointer'
}: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError('파일 크기는 10MB를 초과할 수 없습니다.')
      return
    }

    // 파일 타입 검증
    let allowedTypes: string[]
    let errorMessage: string

    if (documentType === 'github') {
      // GitHub 링크는 CSV 파일만 허용
      allowedTypes = [
        'text/csv',
        'application/csv',
        'text/plain' // 일부 시스템에서 CSV를 text/plain으로 인식
      ]
      errorMessage = 'CSV 파일만 업로드 가능합니다.'
    } else {
      // 다른 파일 타입들은 기존 허용 형식
      allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]
      errorMessage = '지원하지 않는 파일 형식입니다. (PDF, DOC, DOCX, TXT, JPG, PNG, GIF만 허용)'
    }

    // 파일 확장자도 확인 (MIME 타입이 정확하지 않을 수 있음)
    const fileExtension = file.name.toLowerCase().split('.').pop()
    const isCsvFile = fileExtension === 'csv'
    
    if (documentType === 'github' && !isCsvFile) {
      setUploadError('CSV 파일만 업로드 가능합니다.')
      return
    }

    if (!allowedTypes.includes(file.type) && !(documentType === 'github' && isCsvFile)) {
      setUploadError(errorMessage)
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      console.log(`📤 파일 업로드 시작: ${documentType}/${file.name}`)
      
      let uploadResponse: FileUploadResponse
      
      // 문서 타입에 따라 적절한 API 함수 호출
      switch (documentType) {
        case 'cover_letter':
          uploadResponse = await api.s3.uploadCoverLetter(userId, file)
          break
        case 'portfolio':
          uploadResponse = await api.s3.uploadPortfolio(userId, file)
          break
        case 'resume':
          uploadResponse = await api.s3.uploadResume(userId, file)
          break
        case 'award':
          uploadResponse = await api.s3.uploadAward(userId, file)
          break
        case 'certificate':
          uploadResponse = await api.s3.uploadCertificate(userId, file)
          break
        case 'qualification':
          uploadResponse = await api.s3.uploadQualification(userId, file)
          break
        case 'paper':
          uploadResponse = await api.s3.uploadPaper(userId, file)
          break
        case 'other':
          uploadResponse = await api.s3.uploadOther(userId, file)
          break
        case 'github':
          uploadResponse = await api.s3.uploadGithub(userId, file)
          break
        default:
          throw new Error('지원하지 않는 문서 타입입니다.')
      }

      console.log('✅ 파일 업로드 성공:', uploadResponse)
      
      // 성공 시 파일 목록 새로고침
      onUploadSuccess()
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error: unknown) {
      console.error('❌ 파일 업로드 실패:', error)
      setUploadError((error as any)?.response?.data?.message || '파일 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={documentType === 'github' ? '.csv' : '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif'}
        className="hidden"
      />
      
      <button
        onClick={handleButtonClick}
        disabled={uploading}
        className={`${className} ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
      >
        {uploading ? '업로드 중...' : buttonText}
      </button>
      
      {uploadError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          {uploadError}
        </div>
      )}
    </div>
  )
}