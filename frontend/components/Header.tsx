import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export default function Header({ title = "지원자 프로필 관리", subtitle = "데모 레이아웃" }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt={title}
              width={400}
              height={100}
              className="h-18 w-auto"
            />
          </Link>
          <div className="text-sm text-black">{subtitle}</div>
        </div>
      </div>
    </header>
  )
}
