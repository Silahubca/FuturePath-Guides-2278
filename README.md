# FuturePath Guides - Digital Product Platform

A complete e-commerce platform for selling digital products with user authentication, Stripe payments, and secure download access.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the project root:
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Configure Stripe (Required for Payments)
1. Create a free [Stripe account](https://stripe.com)
2. Get your publishable key from Stripe Dashboard > Developers > API keys
3. Create products in Stripe Dashboard and get their Price IDs
4. Update `src/lib/stripe.js` with your actual Price IDs

**⚠️ Important:** Without proper Stripe configuration, you'll see "Payment system not properly configured" errors.

See `STRIPE_SETUP_GUIDE.md` for detailed setup instructions.

### 4. Run Development Server
```bash
npm run dev
```

## 🔧 Features

### 🔐 User Authentication
- **Supabase Auth Integration** - Secure user registration and login
- **User Dashboard** - Personal area for managing purchases  
- **Profile Management** - User account settings

### 💳 Payment Processing  
- **Stripe Integration** - Secure payment processing
- **Multiple Products** - Individual blueprints and bundle offers
- **Automatic Order Processing** - Seamless purchase flow

### 📱 User Experience
- **Responsive Design** - Works on all devices
- **Modern UI/UX** - Clean, professional interface
- **Real-time Updates** - Instant access after purchase

### 🛡️ Security & Legal
- **Row Level Security** - Database-level access control
- **Legal Pages** - Terms, Privacy Policy, Contact
- **Download Protection** - Secure file access

## 🗄️ Database Schema

The project uses Supabase with these main tables:
- `purchases` - User purchase records
- `user_profiles` - Extended user information  
- `download_logs` - Track file downloads
- `reviews` - Product reviews
- `wishlist` - User wishlists

## 🎯 Product Configuration

Products are configured in `src/lib/stripe.js`:

```javascript
export const PRODUCTS = {
  'product-id': {
    name: 'Product Name',
    price: 9.99,
    stripePriceId: 'price_stripe_id', // From Stripe Dashboard
    downloadFiles: ['file1.pdf', 'file2.xlsx']
  }
}
```

## 📱 Pages & Routes

- `/` - Landing page with products
- `/ai-job-search` - AI Job Search Blueprint
- `/ai-entrepreneur` - AI Entrepreneur Blueprint  
- `/financial-freedom` - Financial Freedom Blueprint
- `/complete-collection` - Bundle offer
- `/dashboard` - User dashboard (protected)
- `/get-started` - Onboarding guide
- `/library` - Digital library with reading platform
- `/success` - Purchase confirmation
- `/contact` - Support contact

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting
3. Set environment variables in your hosting platform

### Backend API (Required for Production)
Deploy the API files in the `api/` folder to handle:
- Stripe checkout session creation
- Webhook processing  
- Secure file downloads

**Recommended:** Deploy to Vercel for seamless integration.

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── checkout/       # Payment components
│   ├── pages/          # Page components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # External service configurations
├── utils/              # Utility functions
└── data/               # Static data and content
```

### Key Technologies
- **React** - Frontend framework
- **Supabase** - Backend as a service
- **Stripe** - Payment processing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation

## 🔒 Security Features

- **Row Level Security** - Users can only access their own data
- **Secure Authentication** - Supabase handles auth complexity  
- **Payment Security** - Stripe handles payment processing
- **Download Protection** - Files only accessible to purchasers

## 📞 Support

### Common Issues

**"Payment system not properly configured"**
- Check that `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Verify Stripe Price IDs are updated in `src/lib/stripe.js`
- See `STRIPE_SETUP_GUIDE.md` for detailed setup

**"Supabase not configured"**
- Add Supabase URL and anon key to `.env`
- Run database migrations from `supabase/migrations/`

**Build errors**
- Ensure all environment variables are set
- Run `npm install` to install dependencies
- Check for TypeScript/JavaScript syntax errors

For additional support: support@futurepathguides.com

---

Built with ❤️ using React, Supabase, and Stripe