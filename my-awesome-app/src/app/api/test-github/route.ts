import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const githubId = process.env.GITHUB_CLIENT_ID
  const githubSecret = process.env.GITHUB_CLIENT_SECRET
  
  return NextResponse.json({
    hasGithubId: !!githubId,
    hasGithubSecret: !!githubSecret,
    githubIdLength: githubId?.length || 0,
    githubSecretLength: githubSecret?.length || 0,
    githubIdPrefix: githubId?.substring(0, 4) || 'N/A',
    nextAuthUrl: process.env.NEXTAUTH_URL,
    allEnvVars: {
      GITHUB_CLIENT_ID: !!process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    }
  })
}
