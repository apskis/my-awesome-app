import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { newPasswordSchema, hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, ...passwordData } = body
    const validatedData = newPasswordSchema.parse(passwordData)

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }

    // Find and validate reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: resetToken.identifier },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.password)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Delete used reset token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid password data', details: error.message },
        { status: 400 }
      )
    }

    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
