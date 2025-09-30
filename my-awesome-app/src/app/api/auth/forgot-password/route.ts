import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { resetPasswordSchema } from '@/lib/auth'
import { Resend } from 'resend'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resetPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we sent a password reset link.' },
        { status: 200 }
      )
    }

    // Generate reset token (in a real app, you'd use a proper token system)
    const resetToken = crypto.randomUUID()
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Store reset token in database
    await prisma.verificationToken.create({
      data: {
        identifier: validatedData.email,
        token: resetToken,
        expires,
      },
    })

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: validatedData.email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>You requested a password reset for your account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json(
      { message: 'If an account with that email exists, we sent a password reset link.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid email address' },
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
