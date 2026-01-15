# ✅ Pre-Deployment Checklist

**Print this page and check off items as you complete them!**

---

## 📋 Before You Start

### What You Have
- [ ] Received the CaribbeanRecipe ZIP file
- [ ] Extracted the ZIP file to a safe location
- [ ] Can see folders: `src`, `public`, `prisma`
- [ ] Can see files: `DEPLOYMENT_GUIDE.md`, `package.json`, `.env.example`

### Computer Requirements
- [ ] Computer with internet access
- [ ] Windows, Mac, or Linux operating system
- [ ] At least 2GB free disk space
- [ ] Administrator/admin privileges (to install software)

### Time & Mindset
- [ ] Have 2-3 hours free to work uninterrupted
- [ ] Patient and ready to learn
- [ ] Willing to follow instructions carefully
- [ ] Not afraid to ask for help if stuck

---

## 🛠️ Software Installation

### Node.js (Required)
- [ ] Downloaded Node.js from [nodejs.org](https://nodejs.org/)
- [ ] Installed LTS version (recommended)
- [ ] Verified installation: `node --version` shows v18 or higher
- [ ] Verified npm: `npm --version` shows a version number

### Text Editor (Recommended)
- [ ] Downloaded VS Code from [code.visualstudio.com](https://code.visualstudio.com/)
- [ ] Installed successfully
- [ ] Can open the website folder in VS Code

### Git (Optional but Helpful)
- [ ] Downloaded Git from [git-scm.com](https://git-scm.com/)
- [ ] Installed with default settings
- [ ] Verified: `git --version` shows a version number

---

## 📧 Email Addresses Needed

You'll need valid email addresses for signups:

- [ ] Primary email (for main accounts)
- [ ] Secondary email (for testing, can be same)
- [ ] Have access to email inbox (for verification)

---

## 🔑 Account Signups (Do These First!)

### Essential Services (All FREE)

#### 1. Vercel (Hosting)
- [ ] Signed up at [vercel.com](https://vercel.com/)
- [ ] Verified email
- [ ] Logged in and can see dashboard
- [ ] Chose "Hobby" (Free) plan

#### 2. Supabase (Database)
- [ ] Signed up at [supabase.com](https://supabase.com/)
- [ ] Verified email
- [ ] Created a new project named "CaribbeanRecipe"
- [ ] Project is ready (green indicator)
- [ ] Have database password saved

#### 3. Google Cloud (OAuth & YouTube API)
- [ ] Signed up at [console.cloud.google.com](https://console.cloud.google.com/)
- [ ] Created new project "CaribbeanRecipe"
- [ ] Project is selected in top dropdown
- [ ] Can see project dashboard

#### 4. Resend (Email Service)
- [ ] Signed up at [resend.com](https://resend.com/)
- [ ] Verified email
- [ ] Can see API keys section
- [ ] Logged in successfully

#### 5. UploadThing (File Uploads)
- [ ] Signed up at [uploadthing.com](https://uploadthing.com/)
- [ ] Signed in with GitHub or Google
- [ ] Created new app "CaribbeanRecipe"
- [ ] Can see API keys

#### 6. Spoonacular (Recipe Data)
- [ ] Signed up at [spoonacular.com/food-api](https://spoonacular.com/food-api)
- [ ] Chose FREE plan (150 requests/day)
- [ ] Can see API key in console/profile
- [ ] Logged in successfully

### Optional Services

#### 7. OpenAI (AI Features) - PAID
- [ ] Signed up at [platform.openai.com](https://platform.openai.com/)
- [ ] Added billing information (credit card)
- [ ] Set usage limit ($20/month recommended)
- [ ] Can create API keys
- [ ] **OR** Decided to skip AI features for now

#### 8. ElevenLabs (Text-to-Speech) - OPTIONAL
- [ ] Signed up at [elevenlabs.io](https://elevenlabs.io/)
- [ ] Can see API key in settings
- [ ] **OR** Decided to skip voice features

---

## 🎯 API Keys Collection

**IMPORTANT:** Keep these safe! Don't share them with anyone!

### Got All Required Keys
- [ ] Supabase DATABASE_URL (connection string)
- [ ] Google GOOGLE_CLIENT_ID
- [ ] Google GOOGLE_CLIENT_SECRET
- [ ] Google YOUTUBE_API_KEY
- [ ] Resend RESEND_API_KEY
- [ ] UploadThing UPLOADTHING_APP_ID
- [ ] UploadThing UPLOADTHING_SECRET
- [ ] Spoonacular SPOONACULAR_API_KEY

### Generated Keys
- [ ] Created NEXTAUTH_SECRET (using generator or command)

### Optional Keys (if using)
- [ ] OpenAI OPENAI_API_KEY (if using AI features)
- [ ] ElevenLabs ELEVENLABS_API_KEY (if using voice)

### Organized Keys
- [ ] All keys saved in a safe text file
- [ ] Text file is NOT in the project folder
- [ ] Text file is backed up safely
- [ ] Ready to copy/paste into .env file

---

## 💻 Local Setup Complete

### Dependencies Installed
- [ ] Opened terminal/command prompt
- [ ] Navigated to project folder (`cd path/to/project`)
- [ ] Ran `npm install` successfully
- [ ] No error messages
- [ ] `node_modules` folder was created

### Environment Configured
- [ ] Copied `.env.example` to `.env`
- [ ] Opened `.env` file
- [ ] Pasted all API keys
- [ ] Saved the file
- [ ] Double-checked all keys are correct

### Database Setup
- [ ] Ran `npx prisma generate` successfully
- [ ] Ran `npx prisma db push` successfully
- [ ] Saw success messages
- [ ] No errors

---

## 🧪 Local Testing Passed

### Development Server
- [ ] Ran `npm run dev`
- [ ] Server started without errors
- [ ] Can see "Local: http://localhost:3000"

### Website Functions
- [ ] Opened http://localhost:3000 in browser
- [ ] Homepage loads completely
- [ ] No console errors (press F12 to check)
- [ ] Images load properly
- [ ] Navigation works

### Features Work
- [ ] Can click on recipes
- [ ] Recipe detail page loads
- [ ] Can sign up with email
- [ ] Received verification email
- [ ] Can log in
- [ ] Google login button appears
- [ ] Profile page loads
- [ ] Can save recipes
- [ ] Admin panel accessible (if admin email set)

### Tests Complete
- [ ] Stopped dev server (Ctrl + C)
- [ ] Ready to deploy!

---

## 🚀 Deployment Ready

### GitHub Setup (If Using GitHub)
- [ ] Have GitHub account
- [ ] Created new repository
- [ ] Pushed code to GitHub
- [ ] Repository is private
- [ ] Can see code on GitHub

### Vercel Preparation
- [ ] Logged into Vercel
- [ ] Know where "Add New Project" button is
- [ ] Have environment variables ready to paste
- [ ] Ready to import repository

---

## 📝 Documentation Review

### Read the Guides
- [ ] Read START_HERE.md (overview)
- [ ] Read DEPLOYMENT_ROADMAP.md (visual guide)
- [ ] Started reading DEPLOYMENT_GUIDE.md (main guide)
- [ ] Know where Troubleshooting section is
- [ ] Bookmarked important pages

### Understand the Process
- [ ] Know what Vercel does (hosting)
- [ ] Know what Supabase does (database)
- [ ] Know what API keys are for
- [ ] Understand the deployment steps
- [ ] Feel ready to proceed

---

## 💰 Budget Confirmed

### Free Tier Limits Understood
- [ ] Vercel: FREE hosting (no limits for personal use)
- [ ] Supabase: FREE up to 500MB database
- [ ] Resend: FREE 100 emails/day
- [ ] UploadThing: FREE 2GB storage
- [ ] Spoonacular: FREE 150 requests/day
- [ ] YouTube API: FREE with quota

### Paid Services (Optional)
- [ ] Understand OpenAI costs ($5-20/month)
- [ ] Set usage limits to control costs
- [ ] **OR** Decided to start without AI
- [ ] Know domain costs ~$10/year
- [ ] **OR** Will use free Vercel domain

### Budget Decided
- [ ] Comfortable with selected services
- [ ] Know monthly estimated cost
- [ ] Ready to proceed

---

## 🎓 Support Resources Ready

### Help Available
- [ ] Know where to find Troubleshooting section
- [ ] Bookmarked Stack Overflow
- [ ] Know about Vercel Discord
- [ ] Have documentation links saved

### Backup Plan
- [ ] Can ask for help if stuck
- [ ] Won't give up if something fails
- [ ] Will read error messages carefully
- [ ] Will search for solutions

---

## ✅ Final Checks

### Ready to Deploy
- [ ] Completed ALL items above
- [ ] Have 1-2 hours free right now
- [ ] Computer is plugged in (not on battery)
- [ ] Internet connection is stable
- [ ] Focused and ready to learn
- [ ] Feeling confident!

### Emergency Contacts
- [ ] Have the developer's contact (if available)
- [ ] Know where to ask questions
- [ ] Have this checklist handy

---

## 🎯 If ALL Boxes Are Checked Above...

**YOU'RE READY TO DEPLOY!** 🚀

### Next Steps:
1. ✅ Open **DEPLOYMENT_GUIDE.md**
2. ✅ Start from Step 8 (you've done Steps 1-7!)
3. ✅ Follow carefully
4. ✅ Your website will be live soon!

---

## ⚠️ If You're Missing Checks...

**DON'T START DEPLOYMENT YET!**

Go back and complete the missing items. The deployment will go much smoother if you have everything ready.

### Common Missing Items:
- ❌ Didn't install Node.js → Install it first!
- ❌ Don't have all API keys → Get them before deploying
- ❌ Local testing failed → Fix errors before deploying
- ❌ Don't understand the process → Read the guides first

---

## 🎉 Success Metrics

After deployment, you should have:

- [ ] Live website URL (e.g., https://your-site.vercel.app)
- [ ] Website loads without errors
- [ ] Can sign up and log in on live site
- [ ] Google login works
- [ ] Recipes display correctly
- [ ] All features functional
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enabled (secure)

---

## 📊 Time Tracking

Track your progress:

| Task | Estimated | Actual | Status |
|------|-----------|--------|--------|
| Software installation | 15 min | _____ | ⚪ |
| Account signups | 30 min | _____ | ⚪ |
| Getting API keys | 30 min | _____ | ⚪ |
| Local setup | 20 min | _____ | ⚪ |
| Testing | 15 min | _____ | ⚪ |
| Deployment | 20 min | _____ | ⚪ |
| Post-deployment | 15 min | _____ | ⚪ |
| **TOTAL** | **~2-3 hours** | _____ | ⚪ |

**Legend:**
- ⚪ Not started
- 🔵 In progress  
- 🟢 Complete
- 🔴 Issue

---

## 💡 Pro Tips

- ✅ **Take breaks** - Don't rush, this is a learning process
- ✅ **Read errors carefully** - They usually tell you what's wrong
- ✅ **Save often** - Save all config files as you go
- ✅ **Test locally first** - Fix all issues before deploying
- ✅ **Keep API keys safe** - Never share or commit to Git
- ✅ **Ask for help** - It's okay to ask questions!

---

## 🆘 Emergency Stop

If at any point you feel:
- ❌ Completely lost
- ❌ Made a critical error
- ❌ Unsure how to proceed

**STOP and:**
1. Take a 10-minute break
2. Re-read the relevant guide section
3. Search for the specific error
4. Ask in a community forum
5. Contact support/developer if available

**Don't panic!** Most issues are easily fixable.

---

## 🎊 You're Ready!

If you've checked all the boxes above, you have everything you need to successfully deploy your website!

**Remember:**
- Take your time
- Follow the guides
- Don't skip steps
- Test thoroughly
- Ask for help when needed

**You've got this! 💪**

---

**Good luck with your deployment! 🚀**

*Print this checklist and keep it handy throughout the deployment process.*

**Last Updated:** January 2026
