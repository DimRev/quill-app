import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest } from 'next/server'

export function GET(request: NextRequest, { params }: any): any {
  const endpoint = params.kindeAuth
  return handleAuth(request, endpoint)
}
