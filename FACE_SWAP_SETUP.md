# Face Swap Feature Setup Instructions

## 🎯 Overview
The face swap feature uses Replicate's AI models to swap faces from your uploaded photos into AI-generated scenes.

## 📋 Prerequisites
You need a **Replicate API Token** to use this feature.

## 🚀 Setup Steps

### 1. Get Your Replicate API Token

1. Go to [Replicate.com](https://replicate.com/)
2. Sign up for a free account (no credit card required for initial credits)
3. Navigate to [API Tokens](https://replicate.com/account/api-tokens)
4. Click "Create token" or copy your default token
5. Copy the token (it starts with `r8_...`)

### 2. Add Token to Environment Variables

1. Open the `.env.local` file in the project root
2. Find the line: `REPLICATE_API_TOKEN=your_replicate_token_here`
3. Replace `your_replicate_token_here` with your actual token:
   ```
   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Save the file

### 3. Restart Development Server

If your Next.js dev server is running, restart it:
```bash
# Press Ctrl+C to stop the server
# Then start it again:
npm run dev
```

## 💰 Pricing

Replicate offers:
- **Free Credits**: New accounts get free credits to start
- **Pay-as-you-go**: ~$0.002-0.01 per face swap (very affordable)
- Each generation uses the API twice (one swap per face)

## 🎨 How to Use

1. Navigate to `/en/face-image` or click "👥 Face AI" from home
2. Upload Photo 1 (e.g., your photo)
3. Upload Photo 2 (e.g., your wife's photo)
4. Describe the scene: *"A couple having dinner at a fancy restaurant"*
5. Click "Generate"
6. Wait 20-40 seconds for AI processing
7. Download your personalized image!

## 🔍 Tips for Best Results

### Photo Quality
- Use **clear, front-facing photos**
- Good lighting is essential
- Avoid sunglasses or obstructions
- Higher resolution = better results

### Prompts
- Be specific about the scene
- Include lighting details: "cinematic lighting", "golden hour"
- Describe poses: "holding hands", "looking at camera"
- Add style: "professional photography", "romantic atmosphere"

### Example Prompts
```
- A couple having a romantic dinner at a fancy restaurant with candles and wine, cinematic lighting, professional photography
- Two people hiking in mountains at sunset, adventure photography, beautiful landscape, golden hour
- A couple at the beach during sunset, holding hands, waves in background, romantic atmosphere
- Two people laughing together in a cozy cafe, warm lighting, candid moment
- A couple dressed elegantly at a wedding, formal photography, beautiful venue
```

## 🛠️ Technical Details

### Processing Steps:
1. **Scene Generation**: AI creates base image from your prompt (5-10s)
2. **First Face Swap**: Replicate swaps first face into scene (10-15s)
3. **Second Face Swap**: Replicate swaps second face into scene (10-15s)
4. **Total Time**: 20-40 seconds

### Models Used:
- **Scene Generation**: Pollinations AI (Flux model)
- **Face Swapping**: Replicate's `omniedgeio/face-swap` model

## ❓ Troubleshooting

### "REPLICATE_API_TOKEN is not configured"
- Make sure you added the token to `.env.local`
- Restart the dev server after adding the token
- Check there are no extra spaces around the token

### Slow Processing
- First request may take longer (model loading)
- Typical processing: 20-40 seconds
- Don't refresh the page while processing

### Poor Face Swap Quality
- Use clearer, front-facing photos
- Ensure good lighting in uploaded photos
- Try different photos if results aren't good
- Make sure faces are clearly visible

## 📚 Resources

- [Replicate Documentation](https://replicate.com/docs)
- [Face Swap Model](https://replicate.com/omniedgeio/face-swap)
- [Replicate Pricing](https://replicate.com/pricing)

## 🎉 Ready to Go!

Once you've set up your API token, visit:
```
http://localhost:3002/en/face-image
```

Enjoy creating personalized AI images! 🎨✨
