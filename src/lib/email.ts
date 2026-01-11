import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendVerificationEmailParams {
  email: string;
  token: string;
  name?: string;
}

export async function sendVerificationEmail({ email, token, name }: SendVerificationEmailParams) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  // Debug logging
  console.log('🔍 Email Configuration Check:');
  console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('- RESEND_API_KEY starts with "re_":', process.env.RESEND_API_KEY?.startsWith('re_'));
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev (default)');
  console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('- Sending to:', email);
  console.log('- Verification URL:', verifyUrl);

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'RecipeHub <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your RecipeHub account',
      html: getVerificationEmailTemplate(verifyUrl, name),
    });

    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error };
  }
}

export interface SendResetPasswordEmailParams {
  email: string;
  token: string;
  name?: string;
}

export async function sendResetPasswordEmail({ email, token, name }: SendResetPasswordEmailParams) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'RecipeHub <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your RecipeHub password',
      html: getResetPasswordEmailTemplate(resetUrl, name),
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return { success: false, error };
  }
}

// Email Templates

function getVerificationEmailTemplate(verifyUrl: string, name?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🍳 RecipeHub</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #1a1a1a; margin-top: 0;">Hi${name ? ` ${name}` : ''}! 👋</h2>
    
    <p style="font-size: 16px; color: #4a5568;">
      Welcome to RecipeHub! We're excited to have you join our community of food lovers.
    </p>
    
    <p style="font-size: 16px; color: #4a5568;">
      Please verify your email address to get started and unlock all features:
    </p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${verifyUrl}" style="background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);">
        Verify Email Address
      </a>
    </div>
    
    <p style="font-size: 14px; color: #718096; margin-top: 30px;">
      Or copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #f97316; word-break: break-all;">${verifyUrl}</a>
    </p>
    
    <p style="font-size: 14px; color: #718096; margin-top: 30px;">
      <strong>This link will expire in 24 hours.</strong>
    </p>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #718096; margin-bottom: 0;">
      If you didn't create an account with RecipeHub, you can safely ignore this email.
    </p>
    
    <p style="font-size: 14px; color: #718096; margin-top: 20px;">
      Happy cooking!<br>
      <strong>The RecipeHub Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #718096; font-size: 12px;">
    <p>© 2026 RecipeHub. All rights reserved.</p>
  </div>
</body>
</html>
  `;
}

function getResetPasswordEmailTemplate(resetUrl: string, name?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🍳 RecipeHub</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #1a1a1a; margin-top: 0;">Reset Your Password</h2>
    
    <p style="font-size: 16px; color: #4a5568;">
      Hi${name ? ` ${name}` : ''},
    </p>
    
    <p style="font-size: 16px; color: #4a5568;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${resetUrl}" style="background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);">
        Reset Password
      </a>
    </div>
    
    <p style="font-size: 14px; color: #718096; margin-top: 30px;">
      Or copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #f97316; word-break: break-all;">${resetUrl}</a>
    </p>
    
    <p style="font-size: 14px; color: #718096; margin-top: 30px;">
      <strong>This link will expire in 1 hour.</strong>
    </p>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #718096; margin-bottom: 0;">
      If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #718096; font-size: 12px;">
    <p>© 2026 RecipeHub. All rights reserved.</p>
  </div>
</body>
</html>
  `;
}
