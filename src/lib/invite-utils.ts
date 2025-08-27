export function generateInviteToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getInviteExpiration(): string {
  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + 7) // 7 days from now
  return expireDate.toISOString()
}

export function createInviteLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/invite/${token}`
}