# 🚀 Stripe Payment Setup Guide

## Quick Fix for "Payment system not properly configured" Error

### Step 1: Create .env file
Create a `.env` file in your project root with your Stripe keys:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Get Stripe Keys
1. Go to [stripe.com](https://stripe.com) and create a free account
2. In the Stripe Dashboard, go to **Developers > API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Add it to your `.env` file

### Step 3: Create Products in Stripe
1. Go to **Products** in Stripe Dashboard
2. Create these 4 products:

**Product 1: AI Job Search Blueprint**
- Name: "AI-Powered Job Search Blueprint"
- Price: $9.99 USD (one-time)
- Copy the Price ID (starts with `price_`)

**Product 2: AI Entrepreneur Blueprint**
- Name: "The AI Entrepreneur Blueprint" 
- Price: $9.99 USD (one-time)
- Copy the Price ID

**Product 3: Financial Freedom Blueprint**
- Name: "Financial Freedom Blueprint"
- Price: $9.99 USD (one-time)
- Copy the Price ID

**Product 4: Complete Collection**
- Name: "Complete Life Mastery Collection"
- Price: $26.97 USD (one-time)
- Copy the Price ID

### Step 4: Update Price IDs
Edit `src/lib/stripe.js` and replace the placeholder Price IDs:

```javascript
export const PRODUCTS = {
  'ai-job-search': {
    // ... other properties
    stripePriceId: 'price_YOUR_ACTUAL_PRICE_ID_1', // Replace this
  },
  'ai-entrepreneur': {
    // ... other properties  
    stripePriceId: 'price_YOUR_ACTUAL_PRICE_ID_2', // Replace this
  },
  // ... etc
}
```

### Step 5: Test with Test Cards
Use Stripe's test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVV
- Any ZIP code

## For Production

### Deploy Backend API
You'll need to deploy the API files in the `api/` folder to handle:
- Creating checkout sessions
- Processing webhooks
- Secure downloads

**Recommended platforms:**
- Vercel (easiest)
- Netlify Functions  
- Your own Node.js server

### Set up Webhooks
1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Add endpoint: `https://your-api-url.com/api/webhook/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to your API environment variables

## Need Help?

If you're still getting errors:

1. **Check browser console** for detailed error messages
2. **Verify .env file** is in project root and has correct format
3. **Restart development server** after adding .env file
4. **Check Stripe Dashboard** to ensure products are created correctly

## Contact Support
If you need help with the setup, contact: support@futurepathguides.com