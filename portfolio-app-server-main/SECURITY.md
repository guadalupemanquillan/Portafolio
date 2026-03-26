# 🔒 Security Configuration

## ⚠️ IMPORTANT SECURITY NOTICE

This repository previously contained hardcoded credentials that were detected by GitGuardian. All credentials have been removed and must now be provided via environment variables.

## 🔑 Required Environment Variables

### Production (Render)
Set these in your Render dashboard:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/DatabaseName?retryWrites=true&w=majority
APP_BASE_URL=https://your-app.onrender.com
RESEND_API_KEY=re_your_new_api_key_here
RESEND_FROM_EMAIL=Your Name <your-email@domain.com>
RESEND_TO_EMAIL=destination@email.com
```

### Local Development
Create a `.env` file (NOT committed to git):

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/DatabaseName?retryWrites=true&w=majority
APP_BASE_URL=http://localhost:9090
RESEND_API_KEY=re_your_new_api_key_here
RESEND_FROM_EMAIL=Your Name <your-email@domain.com>
RESEND_TO_EMAIL=destination@email.com
```

## 🛡️ Security Actions Taken

1. ✅ Removed hardcoded MongoDB credentials
2. ✅ Removed hardcoded Resend API key
3. ✅ Updated application.properties to use environment variables only
4. ⚠️ **REQUIRED**: Change MongoDB password in Atlas
5. ⚠️ **REQUIRED**: Regenerate Resend API key

## 🚨 Immediate Actions Required

### 1. MongoDB Atlas
- Go to Database Access → Edit User → Change Password
- Update the new password in your environment variables

### 2. Resend
- Go to API Keys → Regenerate key
- Update the new API key in your environment variables

### 3. Render Deployment
- Update environment variables in Render dashboard
- Redeploy the application

## 📝 Best Practices

- ✅ Never commit credentials to git
- ✅ Use environment variables for all secrets
- ✅ Use `.env.example` for documentation
- ✅ Add `.env` to `.gitignore`
- ✅ Rotate credentials regularly
