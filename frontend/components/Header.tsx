"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  rightVariant?: 'company' | 'applicant'
  displayName?: string
  onLogout?: () => void
}

export default function Header({ rightVariant = 'applicant', displayName = '', onLogout }: HeaderProps) {
  const [derivedName, setDerivedName] = useState<string>('')

  useEffect(() => {
    try {
      const isCompany = (localStorage.getItem('userType') || '') === 'company'
      const companyName = localStorage.getItem('companyName') || ''
      const userId = localStorage.getItem('userId') || ''
      // 회사 사용자라면 회사명을 우선 사용, 없으면 userId
      setDerivedName(isCompany ? (companyName || userId) : userId)
    } catch (_) {
      setDerivedName('')
    }
  }, [])

  const nameToShow = displayName || derivedName
  const rightLabel = nameToShow
    ? `${nameToShow}님`
    : rightVariant === 'company'
      ? '기업 관리자님'
      : '사용자님'
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="VeriFit"
              width={400}
              height={100}
              className="h-18 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{rightLabel}</span>
            {onLogout && (
              <button onClick={onLogout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
