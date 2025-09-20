'use client'

import { useState } from 'react'
import FileUploadButton from './FileUploadButton'

// S3 파일 정보 타입 정의
interface S3File {
  name: string
  size: number
  lastModified: string
  downloadUrl: string
}

// 파일 타입별 메타데이터
interface FileTypeConfig {
  icon: string
  title: string
  description?: string
  documentType: string
  buttonText: string
}

// 파일 타입별 설정
const FILE_TYPE_CONFIGS: Record<FileType, FileTypeConfig> = {
  cover_letter: {
    icon: '📄',
    title: '자기소개서',
    documentType: 'cover_letter',
    buttonText: '파일 선택'
  },
  portfolio: {
    icon: '💼',
    title: '포트폴리오',
    documentType: 'portfolio',
    buttonText: '파일 선택'
  },
  github: {
    icon: '📊',
    title: 'GitHub 링크',
    description: 'GitHub 저장소 링크가 포함된 CSV 파일을 업로드하세요',
    documentType: 'github',
    buttonText: 'CSV 파일 업로드'
  },
  resume: {
    icon: '📋',
    title: '이력서',
    documentType: 'resume',
    buttonText: '파일 선택'
  },
  award: {
    icon: '🏆',
    title: '수상 경력',
    documentType: 'award',
    buttonText: '파일 선택'
  },
  certificate: {
    icon: '📜',
    title: '증명서',
    documentType: 'certificate',
    buttonText: '파일 선택'
  },
  qualification: {
    icon: '🎖️',
    title: '자격증',
    documentType: 'qualification',
    buttonText: '파일 선택'
  },
  paper: {
    icon: '📖',
    title: '논문',
    documentType: 'paper',
    buttonText: '파일 선택'
  },
  other: {
    icon: '📚',
    title: '기타 자료',
    documentType: 'other',
    buttonText: '파일 선택'
  }
}

type FileType = 'award' | 'certificate' | 'cover_letter' | 'other' | 'paper' | 'portfolio' | 'qualification' | 'resume' | 'github'

interface FileCardProps {
  fileType: FileType
  files: S3File[]
  userId: string
  onFileDownload: (documentType: string, fileName: string) => void
  onFileDelete: (documentType: string, fileName: string) => void
  onUploadSuccess: () => void
}

export default function FileCard({
  fileType,
  files,
  userId,
  onFileDownload,
  onFileDelete,
  onUploadSuccess
}: FileCardProps) {
  const config = FILE_TYPE_CONFIGS[fileType]
  const [showInfoModal, setShowInfoModal] = useState(false)

  const hasFiles = files && files.length > 0
  const emptyMessage = fileType === 'github' 
    ? '업로드된 CSV 파일이 없습니다'
    : '업로드된 파일이 없습니다'

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="text-2xl mb-2">{config.icon}</div>
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold text-black">{config.title}</div>
        {fileType === 'github' && (
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-blue-500 hover:text-blue-700 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
            title="CSV 파일 형식 안내"
          >
            ℹ️ 정보
          </button>
        )}
      </div>
      
      {config.description && (
        <div className="text-sm text-gray-600 mb-3">{config.description}</div>
      )}
      
      {/* 파일 목록 표시 */}
      <div className="mb-3">
        {hasFiles ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onFileDownload(fileType, file.name)}
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
                  onClick={() => onFileDelete(fileType, file.name)}
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
            {emptyMessage}
          </div>
        )}
      </div>
      
      <FileUploadButton
        userId={userId}
        documentType={config.documentType as FileType}
        onUploadSuccess={onUploadSuccess}
        buttonText={config.buttonText}
      />

      {/* GitHub 정보 모달 */}
      {fileType === 'github' && showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📊 CSV 파일 형식 안내</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-700">
              <p className="font-medium">
                repository 주소와 github username이 담긴 csv 파일을 업로드해 주세요.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="mb-2"><strong>1열:</strong> 해당 repository에서 사용한 username</p>
                <p className="text-gray-600 mb-2">예시: kji123</p>
                
                <p className="mb-2"><strong>2열:</strong> repository의 주소</p>
                <p className="text-gray-600">예시: https://github.com/kji123/testproject</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  ⚠️ repository는 지원자 AI가 접근할 수 있도록 public이어야 합니다!
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
