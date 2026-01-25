import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export interface SendVerificationEmailParams {
  email: string;
  token: string;
  name?: string;
}

export async function sendVerificationEmail({ email, token, name }: SendVerificationEmailParams) {
  // Ensure we have a valid base URL for the verification link
  let baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // Strip trailing slash and /api/auth if present
  baseUrl = baseUrl.replace(/\/$/, '').replace(/\/api\/auth$/, '');

  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

  // Debug logging
  console.log('🔍 Email Configuration Check:');
  console.log('- GMAIL_USER exists:', !!process.env.GMAIL_USER);
  console.log('- GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'RecipeHub <noreply@gmail.com> (default)');
  console.log('- Base URL used:', baseUrl);
  console.log('- Sending to:', email);
  console.log('- Verification URL:', verifyUrl);

  // Check if credentials are missing
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    const error = 'Gmail credentials (GMAIL_USER or GMAIL_APP_PASSWORD) are not set in environment variables';
    console.error('❌', error);
    return { success: false, error: new Error(error) };
  }

  try {
    const transporter = createTransporter();
    const emailFrom = process.env.EMAIL_FROM || 'RecipeHub <noreply@gmail.com>';

    console.log('📧 Attempting to send email with from:', emailFrom);

    const mailOptions = {
      from: emailFrom,
      to: email,
      subject: 'Verify your RecipeHub account',
      html: getVerificationEmailTemplate(verifyUrl, name),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', JSON.stringify(info, null, 2));
    return { success: true, data: info };
  } catch (error: any) {
    // Enhanced error logging
    console.error('❌ Error sending verification email:');
    console.error('- Error type:', error?.constructor?.name);
    console.error('- Error message:', error?.message);
    console.error('- Error details:', JSON.stringify(error, null, 2));

    // Check for specific Gmail errors
    if (error?.response) {
      console.error('- SMTP Response:', error.response);
    }

    const errorMessage = error?.message || String(error);

    // Provide helpful error messages for common issues
    if (errorMessage.includes('Invalid login') || errorMessage.includes('Username and Password not accepted')) {
      console.error('⚠️ Invalid Gmail credentials!');
      console.error('📖 Solution: Check that GMAIL_USER and GMAIL_APP_PASSWORD are correct');
      console.error('📖 Make sure you are using an App Password, not your regular Gmail password');
    }

    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      errorMessage: errorMessage
    };
  }
}

export interface SendResetPasswordEmailParams {
  email: string;
  token: string;
  name?: string;
}

export async function sendResetPasswordEmail({ email, token, name }: SendResetPasswordEmailParams) {
  // Ensure we have a valid base URL
  let baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  baseUrl = baseUrl.replace(/\/$/, '').replace(/\/api\/auth$/, '');

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // Check if credentials are missing
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    const error = 'Gmail credentials (GMAIL_USER or GMAIL_APP_PASSWORD) are not set in environment variables';
    console.error('❌', error);
    return { success: false, error: new Error(error) };
  }

  try {
    const transporter = createTransporter();
    const emailFrom = process.env.EMAIL_FROM || 'RecipeHub <noreply@gmail.com>';

    const mailOptions = {
      from: emailFrom,
      to: email,
      subject: 'Reset your RecipeHub password',
      html: getResetPasswordEmailTemplate(resetUrl, name),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Password reset email sent successfully:', JSON.stringify(info, null, 2));
    return { success: true, data: info };
  } catch (error: any) {
    console.error('❌ Error sending reset password email:');
    console.error('- Error message:', error?.message);
    console.error('- Error details:', JSON.stringify(error, null, 2));

    const errorMessage = error?.message || String(error);

    if (errorMessage.includes('Invalid login') || errorMessage.includes('Username and Password not accepted')) {
      console.error('⚠️ Invalid Gmail credentials!');
      console.error('📖 Solution: Check that GMAIL_USER and GMAIL_APP_PASSWORD are correct');
    }

    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      errorMessage: errorMessage
    };
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
    <h1 style="color: white; margin: 0; font-size: 32px;">🍳 CaribbeanRecipe</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #1a1a1a; margin-top: 0;">Hi${name ? ` ${name}` : ''}! 👋</h2>
    
    <p style="font-size: 16px; color: #4a5568;">
      Welcome to CaribbeanRecipe! We're excited to have you join our community of food lovers.
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
      If you didn't create an account with CaribbeanRecipe, you can safely ignore this email.
    </p>
    
    <p style="font-size: 14px; color: #718096; margin-top: 20px;">
      Happy cooking!<br>
      <strong>The CaribbeanRecipe Team</strong>
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
    <h1 style="color: white; margin: 0; font-size: 32px;">🍳 CaribbeanRecipe</h1>
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
