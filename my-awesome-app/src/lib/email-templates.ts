export const emailTemplates = {
  verification: (url: string, email: string) => ({
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background-color: #3B82F6; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">MA</span>
          </div>
          <h1 style="color: #1F2937; margin: 0; font-size: 28px;">Verify Your Email</h1>
        </div>
        
        <div style="background-color: #F9FAFB; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hi there! 👋
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for signing up for My Awesome App! To complete your registration, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
            If the button doesn't work, you can also copy and paste this link into your browser:
          </p>
          <p style="color: #3B82F6; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
            ${url}
          </p>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">This link will expire in 24 hours.</p>
          <p style="margin: 0;">If you didn't create an account, please ignore this email.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (url: string, email: string) => ({
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background-color: #EF4444; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px;">🔒</span>
          </div>
          <h1 style="color: #1F2937; margin: 0; font-size: 28px;">Reset Your Password</h1>
        </div>
        
        <div style="background-color: #FEF2F2; padding: 30px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #EF4444;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hi there! 👋
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            We received a request to reset your password for your My Awesome App account. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="display: inline-block; background-color: #EF4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
            If the button doesn't work, you can also copy and paste this link into your browser:
          </p>
          <p style="color: #EF4444; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
            ${url}
          </p>
        </div>
        
        <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 600;">⚠️ Security Notice</p>
          <p style="color: #92400E; font-size: 14px; margin: 10px 0 0 0;">
            This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p style="margin: 0;">If you're having trouble, contact our support team.</p>
        </div>
      </div>
    `,
  }),

  welcome: (name: string) => ({
    subject: 'Welcome to My Awesome App! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 32px;">🎉</span>
          </div>
          <h1 style="color: #1F2937; margin: 0; font-size: 32px;">Welcome to My Awesome App!</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #F0F9FF, #E0E7FF); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
            Hi ${name}! 👋
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Welcome to your new notes application! We're excited to have you on board. Your account is now ready to use.
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px;">What you can do:</h3>
            <ul style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">📝 Create and organize your notes</li>
              <li style="margin-bottom: 8px;">🏷️ Use categories and tags to stay organized</li>
              <li style="margin-bottom: 8px;">🔍 Search and filter your content</li>
              <li style="margin-bottom: 8px;">🔒 Keep your data secure with our authentication</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}" style="display: inline-block; background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Get Started
            </a>
          </div>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">Need help? Check out our documentation or contact support.</p>
          <p style="margin: 0;">Happy note-taking! 📚</p>
        </div>
      </div>
    `,
  }),
}
