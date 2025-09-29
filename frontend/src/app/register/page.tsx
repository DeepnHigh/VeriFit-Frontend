'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState<'job_seeker' | 'company' | null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            어떤 유형으로 가입하시겠습니까?
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {/* 구직자 회원가입 */}
          <Link
            href="/signup/applicant"
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">👤</div>
              <div className="text-left">
                <div className="font-semibold">구직자로 가입</div>
                <div className="text-xs text-blue-100">개인 프로필을 만들고 채용공고에 지원하세요</div>
              </div>
            </div>
          </Link>

          {/* 기업 회원가입 */}
          <Link
            href="/signup/company"
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏢</div>
              <div className="text-left">
                <div className="font-semibold">기업으로 가입</div>
                <div className="text-xs text-green-100">채용공고를 등록하고 인재를 찾으세요</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">이미 계정이 있으신가요?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
