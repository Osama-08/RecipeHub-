# Email Troubleshooting Guide - Resend

## Why Am I Not Receiving Emails?

This guide will help you diagnose and fix email delivery issues with Resend.

---

## Step 1: Check Your Environment Variables

### Verify RESEND_API_KEY is Set

1. **Check your `.env.local` file** (for local development)
2. **Check Vercel Environment Variables** (for production)

The key should:
- ✅ Start with `re_` (e.g., `re_1234567890abcdef...`)
- ✅ Be the full key (not truncated)
- ✅ Have no extra spaces or quotes

**Common Mistakes:**
- ❌ `RESEND_API_KEY="re_xxx"` (extra quotes - remove them)
- ❌ `RESEND_API_KEY= re_xxx` (extra space after =)
- ❌ Missing the key entirely

**Correct Format:**
```env
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
```

### Verify EMAIL_FROM Format

The `EMAIL_FROM` should be in one of these formats:

**Option 1: Using Resend's default domain (for testing)**
```env
EMAIL_FROM="RecipeHub <onboarding@resend.dev>"
```

**Option 2: Using your custom domain (for production)**
```env
EMAIL_FROM="RecipeHub <noreply@yourdomain.com>"
```

**Important Notes:**
- ✅ Must include angle brackets: `<email@domain.com>`
- ✅ Can include a display name before the brackets
- ✅ For custom domain, you must verify it in Resend first

---

## Step 2: Check Resend Dashboard

### 1. Verify Your API Key is Active

1. Go to: https://resend.com/api-keys
2. Check if your API key is listed
3. Make sure it's **not revoked** or **expired**
4. If needed, create a new API key and update your `.env.local`

### 2. Check Email Logs

1. Go to: https://resend.com/emails
2. Look for your sent emails
3. Check the status:
   - ✅ **Delivered** - Email was sent successfully
   - ⚠️ **Bounced** - Email address is invalid
   - ⚠️ **Failed** - Check error message
   - ⚠️ **Pending** - Still being processed

### 3. Check Your Account Status

1. Go to: https://resend.com/dashboard
2. Verify your account is **active**
3. Check if you've exceeded your **rate limits**
   - Free tier: 3,000 emails/month
   - Pro tier: 50,000 emails/month

---

## Step 3: Check Server Logs

### For Local Development

When you run `npm run dev`, check your terminal/console for:

```
🔍 Email Configuration Check:
- RESEND_API_KEY exists: true/false
- RESEND_API_KEY starts with "re_": true/false
- EMAIL_FROM: RecipeHub <onboarding@resend.dev>
- NEXTAUTH_URL: http://localhost:3000
- Sending to: user@example.com
```

**If you see errors:**
- ❌ `RESEND_API_KEY exists: false` → Key not set in `.env.local`
- ❌ `RESEND_API_KEY starts with "re_": false` → Wrong key format
- ❌ `Error sending verification email` → Check error details below

### For Production (Vercel)

1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Deployments** → Click on latest deployment
4. Click **Functions** → Find your API route
5. Check the **Logs** tab for error messages

---

## Step 4: Common Error Messages & Solutions

### Error: "RESEND_API_KEY is not set"

**Problem:** The environment variable is missing.

**Solution:**
1. Add `RESEND_API_KEY=re_xxx` to your `.env.local` file
2. Restart your development server
3. For Vercel: Add it in Project Settings → Environment Variables

---

### Error: "RESEND_API_KEY format is incorrect"

**Problem:** The API key doesn't start with `re_`.

**Solution:**
1. Go to https://resend.com/api-keys
2. Create a new API key
3. Copy the **full key** (starts with `re_`)
4. Update your `.env.local` file
5. Restart your server

---

### Error: "Invalid API key" or "Unauthorized"

**Problem:** The API key is invalid, expired, or revoked.

**Solution:**
1. Go to https://resend.com/api-keys
2. Check if the key is still active
3. If revoked, create a new key
4. Update your environment variables
5. Redeploy (if on Vercel)

---

### Error: "Domain not verified"

**Problem:** You're trying to send from a custom domain that isn't verified.

**Solution:**
1. Use the default domain for testing:
   ```env
   EMAIL_FROM="RecipeHub <onboarding@resend.dev>"
   ```
2. Or verify your domain:
   - Go to https://resend.com/domains
   - Add your domain
   - Add the DNS records shown
   - Wait for verification (can take 24-48 hours)

---

### Error: "Rate limit exceeded"

**Problem:** You've exceeded your monthly email limit.

**Solution:**
1. Check your usage: https://resend.com/dashboard
2. Wait until next month, OR
3. Upgrade to Pro plan: https://resend.com/pricing

---

### Error: "Invalid 'from' email address"

**Problem:** The `EMAIL_FROM` format is incorrect.

**Solution:**
Use one of these formats:
```env
# Correct formats:
EMAIL_FROM="RecipeHub <onboarding@resend.dev>"
EMAIL_FROM="noreply@yourdomain.com"  # If domain verified
EMAIL_FROM="RecipeHub <noreply@yourdomain.com>"

# Wrong formats:
EMAIL_FROM="onboarding@resend.dev"  # Missing brackets
EMAIL_FROM=RecipeHub onboarding@resend.dev  # Missing brackets
```

---

## Step 5: Test Email Sending

### Test Locally

1. **Start your server:**
   ```bash
   npm run dev
   ```

2. **Try to sign up** with a test email

3. **Check the console** for:
   ```
   ✅ Email sent successfully: { id: "xxx", ... }
   ```

4. **Check your email inbox** (and spam folder)

5. **Check Resend dashboard:** https://resend.com/emails

### Test on Production

1. **Deploy to Vercel**

2. **Try to sign up** on your live site

3. **Check Vercel logs:**
   - Go to Vercel Dashboard
   - Your Project → Deployments → Latest
   - Functions → Logs

4. **Check Resend dashboard** for sent emails

---

## Step 6: Check Email Delivery

### Emails Might Be in Spam

1. **Check your spam/junk folder**
2. **Mark as "Not Spam"** if found
3. **Add to contacts** to improve deliverability

### Verify Email Address

1. Make sure the email address you're using is **valid**
2. Try a different email address (Gmail, Outlook, etc.)
3. Check for typos in the email address

### Check Resend Delivery Status

1. Go to: https://resend.com/emails
2. Find your email
3. Check the **Status**:
   - **Delivered** ✅ - Email was sent (check spam folder)
   - **Bounced** ❌ - Email address is invalid
   - **Failed** ❌ - Check error message
   - **Pending** ⏳ - Still processing

---

## Step 7: Quick Checklist

Use this checklist to verify everything is set up correctly:

- [ ] `RESEND_API_KEY` is set in `.env.local` (local) or Vercel (production)
- [ ] API key starts with `re_`
- [ ] API key is active in Resend dashboard
- [ ] `EMAIL_FROM` is in correct format: `"Name <email@domain.com>"`
- [ ] If using custom domain, it's verified in Resend
- [ ] Account hasn't exceeded rate limits
- [ ] Server logs show "Email sent successfully"
- [ ] Resend dashboard shows the email was sent
- [ ] Checked spam folder
- [ ] Email address is valid and correct

---

## Step 8: Still Not Working?

### Enable More Detailed Logging

The code already includes detailed logging. Check your console/terminal for:

```
🔍 Email Configuration Check:
- RESEND_API_KEY exists: true
- RESEND_API_KEY starts with "re_": true
- EMAIL_FROM: RecipeHub <onboarding@resend.dev>
- NEXTAUTH_URL: http://localhost:3000
- Sending to: user@example.com
- Verification URL: http://localhost:3000/verify-email?token=xxx
📧 Attempting to send email with from: RecipeHub <onboarding@resend.dev>
✅ Email sent successfully: { id: "xxx", ... }
```

### Contact Resend Support

If everything looks correct but emails still aren't sending:

1. **Check Resend Status:** https://status.resend.com/
2. **Contact Support:** https://resend.com/support
3. **Check Documentation:** https://resend.com/docs

### Common Issues Summary

| Issue | Solution |
|-------|----------|
| API key not set | Add `RESEND_API_KEY` to `.env.local` |
| Wrong key format | Get new key from Resend dashboard |
| Domain not verified | Use `onboarding@resend.dev` or verify domain |
| Rate limit exceeded | Wait or upgrade plan |
| Email in spam | Check spam folder, mark as not spam |
| Invalid email address | Verify the email address is correct |

---

## Testing Email Without Signing Up

You can test the email function directly by creating a test API route:

**Create:** `src/app/api/test-email/route.ts`

```typescript
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
  }

  const result = await sendVerificationEmail({
    email,
    token: "test-token-123",
    name: "Test User",
  });

  return NextResponse.json(result);
}
```

Then visit: `http://localhost:3000/api/test-email?email=your-email@example.com`

---

## Need More Help?

1. **Check the code logs** - Look for error messages in console
2. **Check Resend dashboard** - See if emails are being sent
3. **Verify environment variables** - Make sure all keys are set
4. **Test with default sender** - Use `onboarding@resend.dev`
5. **Contact support** - If nothing works

Good luck! 🍀

