'use client'

import React from 'react'
import { formatDate } from '@/lib/utils'

interface JobPostingDetailProps {
  posting: any
}

function mapEmploymentType(value?: string | null) {
  if (!value) return '-'
  switch (value) {
    case 'full_time': return '정규직'
    case 'part_time': return '파트타임'
    case 'contract': return '계약직'
    case 'internship': return '인턴'
    default: return value
  }
}

function mapPositionLevel(value?: string | null) {
  if (!value) return '-'
  const map: Record<string, string> = {
    intern: '인턴',
    junior: '신입/주니어',
    mid: '중급',
    senior: '시니어',
    lead: '리드',
    manager: '매니저',
  }
  return map[value] || value
}

function formatSalaryRange(min?: number | null, max?: number | null) {
  if (!min && !max) return '-'
  if (!min) return `${max?.toLocaleString()}만원 이하`
  if (!max) return `${min?.toLocaleString()}만원 이상`
  return `${min?.toLocaleString()}만원 ~ ${max?.toLocaleString()}만원`
}

export default function JobPostingDetail({ posting }: JobPostingDetailProps) {
  const criteria = (posting?.ai_criteria || posting?.evaluation_criteria) || []

  let hardSkills: any[] = []
  let softSkills: any[] = []

  if (Array.isArray(criteria)) {
    hardSkills = criteria.filter((c: any) => c?.skill_type === 'hard_skill')
    softSkills = criteria.filter((c: any) => c?.skill_type === 'soft_skill')
  } else if (criteria) {
    if (Array.isArray(criteria.hard_skills)) {
      hardSkills = criteria.hard_skills.map((name: string) => ({ skill_name: name }))
    }
    if (Array.isArray(criteria.soft_skills)) {
      softSkills = criteria.soft_skills.map((name: string) => ({ skill_name: name }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">회사명</h3>
          <p className="text-gray-700">
            {posting?.company_name || posting?.company?.company_name || '-'}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">직급</h3>
          <p className="text-gray-700">{mapPositionLevel(posting?.position_level)}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">고용형태</h3>
          <p className="text-gray-700">{mapEmploymentType(posting?.employment_type)}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">근무지</h3>
          <p className="text-gray-700">{posting?.location || '-'}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">연봉</h3>
          <p className="text-gray-700">{formatSalaryRange(posting?.salary_min, posting?.salary_max)}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">마감일</h3>
          <p className="text-gray-700">
            {posting?.application_deadline ? formatDate(posting.application_deadline) : '상시채용'}
          </p>
        </div>
      </div>

      {posting?.main_tasks && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">주요 업무</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{posting.main_tasks}</div>
        </div>
      )}

      {posting?.requirements && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">자격 요건</h3>
          <div className="text-gray-700 whitespace-pre-wrap">
            {Array.isArray(posting.requirements) ? posting.requirements.join('\n') : posting.requirements}
          </div>
        </div>
      )}

      {posting?.preferred && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">우대 사항</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{posting.preferred}</div>
        </div>
      )}

      {(hardSkills.length > 0 || softSkills.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">하드스킬</h3>
            {hardSkills.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 하드스킬 기준이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {hardSkills.map((s: any, idx: number) => (
                  <li key={`hard-${idx}`} className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{s.skill_name || '-'}</span>
                      {typeof s.percentage !== 'undefined' && (
                        <span className="text-xs text-gray-600">{Number(s.percentage).toFixed(0)}%</span>
                      )}
                    </div>
                    {s.skill_description && (
                      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{s.skill_description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">소프트스킬</h3>
            {softSkills.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 소프트스킬 기준이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {softSkills.map((s: any, idx: number) => (
                  <li key={`soft-${idx}`} className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{s.skill_name || '-'}</span>
                      {typeof s.percentage !== 'undefined' && (
                        <span className="text-xs text-gray-600">{Number(s.percentage).toFixed(0)}%</span>
                      )}
                    </div>
                    {s.skill_description && (
                      <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{s.skill_description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


