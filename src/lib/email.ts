import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev (default)');
  console.log('- Base URL used:', baseUrl);
  console.log('- Sending to:', email);
  console.log('- Verification URL:', verifyUrl);

  // Check if API key is missing
  if (!process.env.RESEND_API_KEY) {
    const error = 'RESEND_API_KEY is not set in environment variables';
    console.error('❌', error);
    return { success: false, error: new Error(error) };
  }

  // Check if API key format is correct
  if (!process.env.RESEND_API_KEY.startsWith('re_')) {
    const error = 'RESEND_API_KEY format is incorrect. It should start with "re_"';
    console.error('❌', error);
    return { success: false, error: new Error(error) };
  }

  try {
    const emailFrom = process.env.EMAIL_FROM || 'CaribbeanRecipe <onboarding@resend.dev>';
    console.log('📧 Attempting to send email with from:', emailFrom);

    const data = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Verify your CaribbeanRecipe account',
      html: getVerificationEmailTemplate(verifyUrl, name),
    });

    // Check if Resend returned an error in the response
    if (data?.error) {
      const errorMessage = data.error.message || 'Unknown error from Resend';
      console.error('❌ Resend API Error:', errorMessage);

      // Check for domain verification error
      if (errorMessage.includes('only send testing emails to your own email') ||
        errorMessage.includes('verify a domain')) {
        console.error('⚠️ Domain verification required!');
        console.error('📖 Solution: Verify a domain at https://resend.com/domains');
        console.error('📖 Then update EMAIL_FROM to use your verified domain');

        return {
          success: false,
          error: new Error(errorMessage),
          errorMessage,
          requiresDomainVerification: true
        };
      }

      return {
        success: false,
        error: new Error(errorMessage),
        errorMessage
      };
    }

    console.log('✅ Email sent successfully:', JSON.stringify(data, null, 2));
    return { success: true, data };
  } catch (error: any) {
    // Enhanced error logging
    console.error('❌ Error sending verification email:');
    console.error('- Error type:', error?.constructor?.name);
    console.error('- Error message:', error?.message);
    console.error('- Error details:', JSON.stringify(error, null, 2));

    // Check for specific Resend errors
    if (error?.response) {
      console.error('- API Response:', JSON.stringify(error.response, null, 2));
    }

    // Check for domain verification error in catch block too
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('only send testing emails to your own email') ||
      errorMessage.includes('verify a domain')) {
      console.error('⚠️ Domain verification required!');
      console.error('📖 Solution: Verify a domain at https://resend.com/domains');

      return {
        success: false,
        error: error instanceof Error ? error : new Error(errorMessage),
        errorMessage,
        requiresDomainVerification: true
      };
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

  // Check if API key is missing
  if (!process.env.RESEND_API_KEY) {
    const error = 'RESEND_API_KEY is not set in environment variables';
    console.error('❌', error);
    return { success: false, error: new Error(error) };
  }

  try {
    const emailFrom = process.env.EMAIL_FROM || 'CaribbeanRecipe <onboarding@resend.dev>';
    const data = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: 'Reset your CaribbeanRecipe password',
      html: getResetPasswordEmailTemplate(resetUrl, name),
    });

    // Check if Resend returned an error in the response
    if (data?.error) {
      const errorMessage = data.error.message || 'Unknown error from Resend';
      console.error('❌ Resend API Error:', errorMessage);

      if (errorMessage.includes('only send testing emails to your own email') ||
        errorMessage.includes('verify a domain')) {
        console.error('⚠️ Domain verification required!');
        return {
          success: false,
          error: new Error(errorMessage),
          errorMessage,
          requiresDomainVerification: true
        };
      }

      return {
        success: false,
        error: new Error(errorMessage),
        errorMessage
      };
    }

    console.log('✅ Password reset email sent successfully:', JSON.stringify(data, null, 2));
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Error sending reset password email:');
    console.error('- Error message:', error?.message);
    console.error('- Error details:', JSON.stringify(error, null, 2));

    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('only send testing emails to your own email') ||
      errorMessage.includes('verify a domain')) {
      console.error('⚠️ Domain verification required!');
      return {
        success: false,
        error: error instanceof Error ? error : new Error(errorMessage),
        errorMessage,
        requiresDomainVerification: true
      };
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
    <p>© 2026 CaribbeanRecipe. All rights reserved.</p>
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
