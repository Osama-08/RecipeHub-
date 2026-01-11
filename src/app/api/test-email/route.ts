import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";

/**
 * Test endpoint to verify email configuration
 * Usage: GET /api/test-email?email=your-email@example.com
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { 
          error: "Email parameter required",
          usage: "GET /api/test-email?email=your-email@example.com"
        }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log('🧪 Testing email sending to:', email);

    const result = await sendVerificationEmail({
      email,
      token: "test-token-" + Date.now(),
      name: "Test User",
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully!",
        details: result.data,
        note: "Check your inbox (and spam folder) for the verification email.",
      });
    } else {
      const errorMessage = result.error instanceof Error ? result.error.message : String(result.error);
      const requiresDomain = (result as any).requiresDomainVerification;
      
      return NextResponse.json({
        success: false,
        error: "Failed to send test email",
        details: errorMessage,
        message: requiresDomain 
          ? "Domain verification required. See RESEND_DOMAIN_SETUP.md for instructions."
          : "Check your RESEND_API_KEY and EMAIL_FROM configuration.",
        requiresDomainVerification: requiresDomain,
        help: requiresDomain 
          ? "To send emails to any recipient, verify a domain at https://resend.com/domains"
          : undefined
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error occurred",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

