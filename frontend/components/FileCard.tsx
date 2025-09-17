'use client'

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
    icon: '🔗',
    title: 'GitHub 링크',
    description: 'GitHub 저장소 링크가 포함된 텍스트 파일을 업로드하세요',
    documentType: 'github',
    buttonText: 'GitHub 링크 파일 업로드'
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

  const hasFiles = files && files.length > 0
  const emptyMessage = fileType === 'github' 
    ? '업로드된 GitHub 링크 파일이 없습니다'
    : '업로드된 파일이 없습니다'

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="text-2xl mb-2">{config.icon}</div>
      <div className="font-semibold text-black mb-1">{config.title}</div>
      
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
    </div>
  )
}
