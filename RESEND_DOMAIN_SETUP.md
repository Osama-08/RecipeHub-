# How to Verify a Domain in Resend

## Problem

You're getting this error:
```
You can only send testing emails to your own email address. 
To send emails to other recipients, please verify a domain at resend.com/domains
```

This happens because Resend's default domain (`onboarding@resend.dev`) only allows sending to the account owner's email for testing purposes.

## Solution: Verify Your Domain

To send emails to any recipient, you need to verify a domain you own (like `yourdomain.com`).

---

## Step-by-Step Guide

### Step 1: Get a Domain (If You Don't Have One)

If you already have a domain, skip to Step 2.

**Where to Buy a Domain:**
- **Namecheap**: https://www.namecheap.com/ ($10-15/year)
- **Google Domains**: https://domains.google/ ($12/year)
- **GoDaddy**: https://www.godaddy.com/ ($12-15/year)

**Recommended:** Namecheap (easy to use, good prices)

---

### Step 2: Add Domain to Resend

1. **Go to Resend Dashboard:**
   - Visit: https://resend.com/domains
   - Log in to your Resend account

2. **Click "Add Domain"** (or "Add New Domain")

3. **Enter Your Domain:**
   - Type your domain (e.g., `recipehub.com`)
   - **Don't include** `www` or `http://`
   - Just the domain: `recipehub.com`

4. **Click "Add Domain"**

---

### Step 3: Add DNS Records

Resend will show you DNS records to add. You need to add these to your domain registrar.

#### DNS Records You Need to Add:

**1. SPF Record (TXT)**
```
Type: TXT
Name: @ (or leave blank, or your domain name)
Value: v=spf1 include:resend.com ~all
TTL: 3600 (or Auto)
```

**2. DKIM Record (TXT)**
```
Type: TXT
Name: resend._domainkey (or resend._domainkey.yourdomain.com)
Value: [Resend will provide this - it's a long string]
TTL: 3600 (or Auto)
```

**3. DMARC Record (TXT) - Optional but Recommended**
```
Type: TXT
Name: _dmarc (or _dmarc.yourdomain.com)
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
TTL: 3600 (or Auto)
```

---

### Step 4: Add DNS Records at Your Domain Registrar

**Example: Namecheap**

1. **Log in** to Namecheap
2. **Go to "Domain List"**
3. **Click "Manage"** next to your domain
4. **Go to "Advanced DNS"** tab
5. **Add the records:**
   - Click "Add New Record"
   - Select **TXT** type
   - Enter the **Host** (Name)
   - Enter the **Value**
   - TTL: Automatic
   - Click the checkmark to save
6. **Repeat** for all records

**Example: GoDaddy**

1. **Log in** to GoDaddy
2. **Go to "My Products"** → **"Domains"**
3. **Click on your domain**
4. **Click "DNS"** or "Manage DNS"
5. **Add the records** (same as above)

**Example: Google Domains**

1. **Log in** to Google Domains
2. **Click on your domain**
3. **Go to "DNS"** tab
4. **Add the records** (same as above)

---

### Step 5: Wait for DNS Propagation

**Important:** DNS changes can take **5 minutes to 48 hours** to propagate.

**How to Check:**

1. **Go back to Resend:** https://resend.com/domains
2. **Check your domain status:**
   - ⏳ **Pending** - Still waiting for DNS
   - ✅ **Verified** - Ready to use!
   - ❌ **Failed** - Check DNS records

**Quick DNS Check Tools:**
- https://dnschecker.org/
- https://mxtoolbox.com/

---

### Step 6: Update Your Environment Variables

Once your domain is verified:

1. **Update `.env.local`** (for local development):
   ```env
   EMAIL_FROM="RecipeHub <noreply@yourdomain.com>"
   ```
   Or with a display name:
   ```env
   EMAIL_FROM="RecipeHub <noreply@yourdomain.com>"
   ```

2. **Update Vercel Environment Variables** (for production):
   - Go to Vercel Dashboard
   - Your Project → Settings → Environment Variables
   - Update `EMAIL_FROM` to use your verified domain

3. **Restart your server** (if running locally)

---

### Step 7: Test Again

1. **Test the email endpoint:**
   ```
   http://localhost:3000/api/test-email?email=any-email@example.com
   ```

2. **Or try signing up** with any email address

3. **Check Resend dashboard:** https://resend.com/emails
   - You should see emails being sent successfully!

---

## Quick Reference: DNS Records Format

### For Namecheap:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| TXT | @ | `v=spf1 include:resend.com ~all` | Automatic |
| TXT | `resend._domainkey` | `[Resend provides this]` | Automatic |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | Automatic |

### For GoDaddy:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | `v=spf1 include:resend.com ~all` | 1 Hour |
| TXT | `resend._domainkey` | `[Resend provides this]` | 1 Hour |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | 1 Hour |

---

## Common Issues

### Issue: "Domain verification failed"

**Solutions:**
1. **Wait longer** - DNS can take up to 48 hours
2. **Check DNS records** - Make sure they're exactly as Resend shows
3. **Check for typos** - Double-check the values
4. **Remove old records** - Delete any conflicting DNS records
5. **Use DNS checker** - Verify records are propagated: https://dnschecker.org/

### Issue: "DNS records not found"

**Solutions:**
1. **Wait 5-10 minutes** after adding records
2. **Check record format** - Make sure Host/Name is correct
3. **Check TTL** - Lower TTL (300-600) for faster propagation
4. **Clear DNS cache** - On your computer: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### Issue: "Can't send from verified domain"

**Solutions:**
1. **Check EMAIL_FROM format:**
   ```env
   # Correct:
   EMAIL_FROM="RecipeHub <noreply@yourdomain.com>"
   
   # Wrong:
   EMAIL_FROM="noreply@yourdomain.com"  # Missing brackets
   ```
2. **Make sure domain is verified** in Resend dashboard
3. **Restart your server** after changing environment variables

---

## Alternative: Use Subdomain for Email

You can use a subdomain for email (recommended):

**Example:**
- Main domain: `recipehub.com` (for website)
- Email subdomain: `mail.recipehub.com` or `email.recipehub.com`

**Benefits:**
- Keeps email separate from website
- Easier to manage
- Can use different DNS providers

**Setup:**
1. Add subdomain in your domain registrar
2. Add DNS records for the subdomain (same process)
3. Use: `EMAIL_FROM="RecipeHub <noreply@mail.recipehub.com>"`

---

## Testing Without Domain (Temporary Workaround)

**For development/testing only:**

You can temporarily send emails to your own email address (the one you signed up with Resend):

1. **Use your Resend account email** for testing
2. **Update EMAIL_FROM** to use `onboarding@resend.dev`
3. **Send test emails** to your own email only

**Note:** This is only for testing. For production, you **must** verify a domain.

---

## Cost

**Domain Verification is FREE!** ✅

- Resend doesn't charge for domain verification
- You only pay for:
  - Domain registration ($10-15/year)
  - Email sending (if you exceed free tier)

---

## Need Help?

1. **Resend Documentation:** https://resend.com/docs
2. **Resend Support:** https://resend.com/support
3. **Check DNS:** https://dnschecker.org/
4. **Resend Status:** https://status.resend.com/

---

## Summary Checklist

- [ ] Purchased a domain (if needed)
- [ ] Added domain to Resend dashboard
- [ ] Added SPF record (TXT)
- [ ] Added DKIM record (TXT)
- [ ] Added DMARC record (TXT) - optional
- [ ] Waited for DNS propagation (5 min - 48 hours)
- [ ] Domain shows as "Verified" in Resend
- [ ] Updated `EMAIL_FROM` in `.env.local`
- [ ] Updated `EMAIL_FROM` in Vercel (for production)
- [ ] Tested sending email to any address
- [ ] Emails are being delivered successfully!

---

**Once your domain is verified, you can send emails to any recipient!** 🎉

Good luck! 🍀

