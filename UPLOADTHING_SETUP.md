# UploadThing Setup Guide

## Step 1: Create UploadThing Account

1. **Go to UploadThing**: https://uploadthing.com/
2. **Sign up** with your GitHub account (easiest) or email
3. **Create a new app** - Name it "RecipeWebsite" or similar

## Step 2: Get Your API Keys

1. After creating your app, go to the **Dashboard**
2. Click on **API Keys** in the left sidebar
3. You'll see two keys:
   - **App ID** (starts with `app_`)
   - **Secret Key** (starts with `sk_`)

## Step 3: Add to .env File

Add these lines to your `.env` file:

```env
# UploadThing
UPLOADTHING_SECRET=sk_live_your_secret_key_here
UPLOADTHING_APP_ID=app_your_app_id_here
```

## Step 4: Configure Upload Settings (Optional)

In the UploadThing dashboard:
1. Go to **Settings**
2. Set **Max File Size**: 4MB (recommended for images)
3. **Allowed File Types**: image/jpeg, image/png, image/gif, image/webp
4. **Enable**: Auto-delete after 30 days (optional)

## Important Notes

- ✅ **Free Tier**: 2GB storage, 2GB bandwidth/month
- ✅ **No credit card required** for free tier
- ✅ **Automatic image optimization** included
- ⚠️ Keep your `UPLOADTHING_SECRET` private!

## Testing

Once you've added the keys to `.env`:
1. Restart your dev server
2. The upload functionality will work automatically
3. Test by creating a post with an image

## Troubleshooting

**If uploads fail**:
- Check that both keys are in `.env`
- Verify no extra spaces in the keys
- Restart the dev server
- Check the UploadThing dashboard for usage/errors
