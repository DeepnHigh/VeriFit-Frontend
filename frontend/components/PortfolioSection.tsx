'use client'

import FileCard from './FileCard'

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
  github: S3File[]
}

interface PortfolioSectionProps {
  userFiles: UserFiles
  filesLoading: boolean
  userId: string
  onFileDownload: (documentType: string, fileName: string) => void
  onFileDelete: (documentType: string, fileName: string) => void
  onUploadSuccess: () => void
  aiUpdateStatus?: 'idle' | 'loading' | 'success' | 'error'
}

type FileType = 'award' | 'certificate' | 'cover_letter' | 'other' | 'paper' | 'portfolio' | 'qualification' | 'resume' | 'github'

// 파일 타입 순서 정의
const FILE_TYPES: FileType[] = [
  'cover_letter',
  'portfolio', 
  'github',
  'resume',
  'award',
  'certificate',
  'qualification',
  'paper',
  'other'
]

export default function PortfolioSection({
  userFiles,
  filesLoading,
  userId,
  onFileDownload,
  onFileDelete,
  onUploadSuccess,
  aiUpdateStatus = 'idle'
}: PortfolioSectionProps) {
  return (
    <section className="bg-gray-50 rounded-xl p-6 border mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-black font-semibold">📁 포트폴리오 및 자료</h3>
        {filesLoading && (
          <div className="text-sm text-gray-600">파일 목록을 불러오는 중...</div>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {FILE_TYPES.map((fileType) => (
          <FileCard
            key={fileType}
            fileType={fileType}
            files={userFiles[fileType]}
            userId={userId}
            onFileDownload={onFileDownload}
            onFileDelete={onFileDelete}
            onUploadSuccess={onUploadSuccess}
            aiUpdateStatus={aiUpdateStatus}
          />
        ))}
      </div>
    </section>
  )
}
