# Calendar Integration Setup Guide

This guide will help you set up calendar integrations for Google Calendar, Microsoft Outlook/365, and Apple Calendar in your Focus Flow app.

## Prerequisites

- Node.js 18+ installed
- A Google Cloud Console account (for Google Calendar)
- A Microsoft Azure account (for Outlook/Microsoft 365)
- An Apple Developer account (for Apple Calendar - optional)

## 1. Google Calendar Setup (Easiest)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

### Step 3: Add Environment Variables
Create a `.env.local` file in your project root:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key
```

## 2. Microsoft Outlook/365 Setup

### Step 1: Register Application in Azure
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Fill in the details:
   - Name: "Focus Flow Calendar"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: Web > `http://localhost:3000/api/auth/callback/microsoft`
5. Click "Register"

### Step 2: Configure Permissions
1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph" > "Delegated permissions"
4. Add these permissions:
   - `Calendars.Read`
   - `Calendars.ReadWrite`
   - `User.Read`
5. Click "Grant admin consent"

### Step 3: Get Client Credentials
1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Copy the secret value
4. Go to "Overview" and copy the Application (client) ID

### Step 4: Add Environment Variables
Add to your `.env.local`:
```env
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

## 3. Apple Calendar Setup (Advanced)

Apple Calendar integration requires CalDAV protocol and is more complex. For now, we've marked it as "Coming Soon" in the UI.

### Alternative: Use iCloud Web Calendars
You can access Apple Calendar through iCloud's web interface and manually sync events.

## 4. Environment Variables for Production

When deploying to Vercel, add these environment variables in your Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to "Settings" > "Environment Variables"
3. Add all the variables from your `.env.local` file
4. Update `NEXTAUTH_URL` to your production domain

## 5. Testing the Integration

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your app and go to Settings
4. Click "Connect" for Google Calendar or Microsoft Calendar
5. Complete the OAuth flow
6. Your calendar events should now appear in the app

## 6. Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in your OAuth app matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Access denied" error**
   - Ensure you've granted the necessary permissions
   - Check if your app is in "Testing" mode (Google) or needs admin consent (Microsoft)

3. **Events not loading**
   - Check the browser console for API errors
   - Verify your access tokens are valid
   - Ensure the calendar API is enabled

### Debug Mode:
Add this to your `.env.local` for detailed logging:
```env
DEBUG=next-auth:*
```

## 7. Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use strong, random NEXTAUTH_SECRET**
3. **Limit OAuth scopes to only what you need**
4. **Regularly rotate client secrets**
5. **Use HTTPS in production**

## 8. Next Steps

Once basic integration is working, you can enhance it with:

- Event creation and editing
- Multiple calendar support
- Recurring event handling
- Calendar sync scheduling
- Event notifications
- Calendar sharing features

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your OAuth configuration
3. Test with a simple calendar event first
4. Check the NextAuth.js documentation for advanced configuration
