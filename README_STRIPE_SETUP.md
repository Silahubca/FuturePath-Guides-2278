# Stripe Payment Integration Setup Guide

## Overview
This guide will help you set up Stripe payment processing for your FuturePath Guides platform.

## 🔧 Prerequisites
- Stripe account (free to create at stripe.com)
- Supabase project set up
- Vercel account for deploying API endpoints

## 📝 Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Navigate to the Dashboard

### 1.2 Get API Keys
1. In Stripe Dashboard, go to **Developers > API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 1.3 Create Products and Prices
1. Go to **Products** in Stripe Dashboard
2. Create products for each blueprint:

**Product 1: AI-Powered Job Search Blueprint**
- Name: "AI-Powered Job Search Blueprint"
- Description: "Master the AI-driven job market and land your dream job faster"
- Price: $9.99 USD (one-time payment)

**Product 2: The AI Entrepreneur Blueprint**
- Name: "The AI Entrepreneur Blueprint" 
- Description: "Launch your lean digital business with AI-powered strategies"
- Price: $9.99 USD (one-time payment)

**Product 3: Financial Freedom Blueprint**
- Name: "Financial Freedom Blueprint"
- Description: "Master your money and build lasting wealth"
- Price: $9.99 USD (one-time payment)

**Product 4: Complete Life Mastery Collection**
- Name: "Complete Life Mastery Collection"
- Description: "All 3 blueprints + 12 bonus resources"
- Price: $26.97 USD (one-time payment)

3. Copy the **Price ID** for each product (starts with `price_`)

## 🔧 Step 2: Environment Variables

### 2.1 Frontend Environment Variables
Create/update `.env` file in your project root:

```env
# Stripe (Frontend)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here

# Supabase (Frontend)
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2.2 Backend Environment Variables (Vercel)
You'll need these for your Vercel deployment:

```env
# Stripe (Backend)
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase (Backend)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

## 🔧 Step 3: Update Product Configuration

### 3.1 Update Stripe Price IDs
Edit `src/lib/stripe.js` and replace the placeholder Price IDs:

```javascript
export const PRODUCTS = {
  'ai-job-search': {
    id: 'ai-job-search',
    name: 'AI-Powered Job Search Blueprint',
    price: 9.99,
    stripePriceId: 'price_YOUR_ACTUAL_PRICE_ID_1', // Replace this
    // ...
  },
  'ai-entrepreneur': {
    id: 'ai-entrepreneur',
    name: 'The AI Entrepreneur Blueprint',
    price: 9.99,
    stripePriceId: 'price_YOUR_ACTUAL_PRICE_ID_2', // Replace this
    // ...
  },
  // ... etc
}
```

## 🚀 Step 4: Deploy API Endpoints

### 4.1 Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the setup prompts
4. Add environment variables in Vercel dashboard:
   - Go to your project in Vercel
   - Navigate to Settings > Environment Variables
   - Add all the backend environment variables

### 4.2 Alternative: Deploy to Your Preferred Platform
If not using Vercel, you can deploy the API endpoints to:
- Netlify Functions
- AWS Lambda
- Your own Node.js server

## 🔧 Step 5: Webhook Setup

### 5.1 Create Webhook Endpoint
1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Use your deployed API URL: `https://your-app.vercel.app/api/webhook/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

### 5.2 Add Webhook Secret to Environment
Add the webhook secret to your Vercel environment variables:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

## 🧪 Step 6: Test the Integration

### 6.1 Test Mode
- Use Stripe test cards: `4242 4242 4242 4242`
- Any future expiry date
- Any CVV
- Any ZIP code

### 6.2 Test Flow
1. Add a product to cart
2. Go through checkout
3. Use test card details
4. Verify purchase appears in your Supabase database
5. Check that user receives access to digital content

## 🔧 Step 7: Production Deployment

### 7.1 Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live mode**
2. Get new live API keys (start with `pk_live_` and `sk_live_`)
3. Update environment variables with live keys
4. Create new webhook endpoint for production URL
5. Update webhook secret

### 7.2 Security Checklist
- ✅ Environment variables are secure
- ✅ Webhook signatures are verified
- ✅ User authentication is required for purchases
- ✅ Database has Row Level Security enabled
- ✅ API endpoints validate user permissions

## 🛟 Troubleshooting

### Common Issues:

**"Stripe not configured" error:**
- Check that `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set correctly
- Verify the key starts with `pk_test_` or `pk_live_`

**Webhook not working:**
- Verify webhook URL is correct and publicly accessible
- Check that webhook secret matches in environment variables
- Ensure selected events include `checkout.session.completed`

**Purchase not showing in database:**
- Check webhook is receiving events in Stripe Dashboard
- Verify Supabase service key has correct permissions
- Check API logs for errors

**Payment succeeds but user doesn't get access:**
- Verify user email in Stripe matches Supabase auth email
- Check that purchase record is created in `purchases` table
- Ensure RLS policies allow user to read their own purchases

## 📞 Support
If you need help with the integration, contact support@futurepathguides.com

## 📚 Additional Resources
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)