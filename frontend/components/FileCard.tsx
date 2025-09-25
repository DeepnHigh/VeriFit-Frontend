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
  onUploadSuccess: (documentType?: FileType) => void
  readOnly?: boolean // 읽기 전용 모드 추가
  aiUpdateStatus?: 'idle' | 'loading' | 'success' | 'error'
}

export default function FileCard({
  fileType,
  files,
  userId,
  onFileDownload,
  onFileDelete,
  onUploadSuccess,
  readOnly = false,
  aiUpdateStatus = 'idle'
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
        {fileType === 'github' && aiUpdateStatus !== 'idle' && (
          <div className="text-xs ml-2">
            {aiUpdateStatus === 'loading' && (
              <span className="inline-flex items-center gap-1 text-blue-600"><span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" aria-hidden="true"></span>분석 중</span>
            )}
            {aiUpdateStatus === 'success' && (
              <span className="inline-flex items-center gap-1 text-green-600">✅ 완료</span>
            )}
            {aiUpdateStatus === 'error' && (
              <span className="inline-flex items-center gap-1 text-red-600">⚠️ 실패</span>
            )}
          </div>
        )}
      </div>
      
      {config.description && !readOnly && (
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
                {!readOnly && (
                  <button
                    onClick={() => onFileDelete(fileType, file.name)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                    title="파일 삭제"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            {emptyMessage}
          </div>
        )}
      </div>
      
      {!readOnly && (
      <FileUploadButton
          userId={userId}
          documentType={config.documentType as FileType}
        onUploadSuccess={onUploadSuccess}
          buttonText={config.buttonText}
        />
      )}

      {/* GitHub CSV 형식 안내 모달 */}
      {fileType === 'github' && showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInfoModal(false)} />
          <div className="relative bg-white w-full max-w-lg max-h-[80vh] rounded-lg shadow-lg border mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h4 className="text-base font-semibold text-black">GitHub CSV 업로드 안내</h4>
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setShowInfoModal(false)}
              >
                닫기
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <p className="text-sm text-gray-700 mb-3">CSV에는 각 레포지토리의 URL과 GitHub 사용자명이 포함되어야 합니다.</p>
              <div className="bg-gray-50 p-3 rounded border text-xs text-black mb-3">
                repository_url,github_username
                <br />
                https://github.com/owner/repo1,octocat
                <br />
                https://github.com/owner/repo2,octocat
              </div>
              <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                <li>파일 확장자: .csv</li>
                <li>헤더 행 포함 권장: repository_url, github_username</li>
                <li>URL은 공개 저장소만 가능</li>
                <li>업로드에는 시간이 소요될 수 있습니다. 완료시까지 페이지를 이동하지 마세요.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
