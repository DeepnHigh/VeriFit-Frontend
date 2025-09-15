export const dynamic = 'force-static'

export default function Page() {
  if (typeof window !== 'undefined') {
    window.location.replace('/company/dashboard')
  }
  return null
}
