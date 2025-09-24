# Keystone Kaizen Training Generator

An AI-powered web application that automatically generates customized lean training materials including professional slide decks and comprehensive instructor's guides.

## Features

- **AI-Powered Content Generation**: Uses Google's Gemini API to create customized training content
- **Professional Design**: Leverages Gamma.app API to generate beautifully designed presentations and documents
- **Freemium Model**: 3 free generations per user, with upgrade path for unlimited access
- **Email Delivery**: Automatically sends generated materials via email
- **Iframe Embeddable**: Optimized for embedding in Wix sites
- **Usage Tracking**: Tracks user generations with database persistence

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Vercel Functions (serverless)
- **Database**: Supabase (PostgreSQL)
- **APIs**: Gemini API (content), Gamma.app API (design), Resend (email)
- **Deployment**: Vercel

## Prerequisites

Before running this application, you need:

1. **Gamma.app Pro Account** (required for API access)
2. **Google AI API Key** (Gemini API access)
3. **Supabase Project** (database and authentication)
4. **Resend Account** (email delivery)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
GAMMA_API_KEY=sk-gamma-xxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_FREE_GENERATIONS=3
```

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd keystone-training-generator
npm install
```

### 2. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema:
   ```bash
   # Copy the contents of database/schema.sql
   # Paste and execute in your Supabase SQL editor
   ```
3. Get your project URL and keys from Supabase dashboard

### 3. Configure API Keys

1. **Gemini API**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Gamma API**: 
   - Upgrade to Gamma Pro account ($10/month minimum)
   - Generate API key in Settings > API
3. **Resend API**: Get your API key from [resend.com](https://resend.com)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### POST `/api/generate`

Generates a complete training kit (slides + instructor guide).

**Request Body:**
```json
{
  "formData": {
    "topic": "5s",
    "level": "beginner",
    "duration": 60,
    "industry": "manufacturing",
    "email": "user@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "slideDeckUrl": "https://gamma.app/docs/...",
  "instructorGuideUrl": "https://gamma.app/docs/...",
  "generationId": "uuid",
  "message": "Training kit generated successfully!"
}
```

### GET `/api/usage?email=user@example.com`

Checks user's remaining free generations.

**Response:**
```json
{
  "generationsUsed": 1,
  "maxGenerations": 3,
  "remainingGenerations": 2,
  "hasExceededLimit": false
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Embed in Wix

1. Add an HTML Embed element to your Wix page
2. Set the iframe source to your deployed URL:
   ```html
   <iframe 
     src="https://your-app.vercel.app" 
     width="100%" 
     height="800px" 
     frameborder="0">
   </iframe>
   ```

## Troubleshooting

### Common Issues

1. **"Gamma API key not configured"**
   - Ensure you have a Gamma Pro account
   - Verify your API key format: `sk-gamma-xxxxxxxxxx`

2. **"Generation failed"**
   - Check all API keys are correctly configured
   - Verify Supabase connection
   - Check Vercel function logs

3. **Database connection errors**
   - Verify Supabase URL and keys
   - Check RLS policies are correctly configured
   - Ensure service key has proper permissions

## Rate Limits

- **Gamma API**: 50 generations per day (Pro account)
- **Gemini API**: Standard rate limits apply
- **Application**: 3 free generations per user

## Support

For technical support, contact: support@keystonekaizen.com
