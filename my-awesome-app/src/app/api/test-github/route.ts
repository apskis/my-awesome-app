import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const githubId = process.env.GITHUB_ID
  const githubSecret = process.env.GITHUB_SECRET
  
  return NextResponse.json({
    hasGithubId: !!githubId,
    hasGithubSecret: !!githubSecret,
    githubIdLength: githubId?.length || 0,
    githubSecretLength: githubSecret?.length || 0,
    githubIdPrefix: githubId?.substring(0, 4) || 'N/A',
    nextAuthUrl: process.env.NEXTAUTH_URL,
  })
}
