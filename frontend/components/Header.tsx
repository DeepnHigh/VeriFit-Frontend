"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'

interface HeaderProps {
  rightVariant?: 'company' | 'applicant'
  displayName?: string
  onLogout?: () => void
}

export default function Header({ rightVariant = 'applicant', displayName = '', onLogout }: HeaderProps) {
  const [derivedName, setDerivedName] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [profileLink, setProfileLink] = useState<string>('')

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
      const userType = localStorage.getItem('userType') || ''
      const isCompany = userType === 'company'
      const companyName = localStorage.getItem('companyName') || ''
      const userId = localStorage.getItem('userId') || ''
      // 회사 사용자라면 회사명을 우선 사용, 없으면 userId
      if (isCompany) {
        setDerivedName(companyName || userId)
      } else {
        // 지원자: 이름 우선, 없으면 userId
        // 사용자별로 캐시 키를 분리하여 계정 전환 시 잘못된 이름이 표시되지 않도록 처리
        const cacheKey = userId ? `applicantName:${userId}` : 'applicantName'
        const cachedName = localStorage.getItem(cacheKey) || ''
        if (cachedName) {
          setDerivedName(cachedName)
        } else if (userId) {
          // 프로필에서 이름 조회 후 캐시
          api.applicant.getProfile(userId)
            .then((profile: any) => {
              const name = profile?.name || profile?.full_name || ''
              if (name) {
                try {
                  // 기존 전역 키는 제거하여 혼선 방지
                  try { localStorage.removeItem('applicantName') } catch (_) {}
                  localStorage.setItem(cacheKey, name)
                } catch (_) {}
                setDerivedName(name)
              } else {
                setDerivedName(userId)
              }
            })
            .catch(() => setDerivedName(userId))
        } else {
          setDerivedName('')
        }
      }
      setProfileLink(isCompany ? '/company/dashboard' : '/applicant/dashboard')
    } catch (_) {
      setDerivedName('')
      setIsAuthenticated(false)
      setProfileLink('')
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
          <Link href="/job-board" className="flex items-center">
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
            {isAuthenticated && (
              profileLink ? (
                <Link href={profileLink} className="text-gray-700 hover:text-blue-600 underline-offset-2 hover:underline">
                  {rightLabel}
                </Link>
              ) : (
                <span className="text-gray-700">{rightLabel}</span>
              )
            )}
            {isAuthenticated && onLogout && (
              <button onClick={onLogout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                로그아웃
              </button>
            )}
            {!isAuthenticated && (
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
