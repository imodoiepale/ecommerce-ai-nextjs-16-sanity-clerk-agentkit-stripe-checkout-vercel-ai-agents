# Stripe Webhook Setup Guide

## Why Orders Aren't Showing After Checkout

Your orders are **NOT being saved** because the `STRIPE_WEBHOOK_SECRET` in `.env.local` is set to `"Your_value_goes_here"`.

The webhook at `/api/webhooks/stripe` receives payment confirmations from Stripe and creates orders in Sanity. Without a valid webhook secret, Stripe events are rejected and orders never get created.

## Database Information

- **Database**: Sanity CMS (https://sanity.io)
- **Project ID**: 8fbvheae
- **Dataset**: production
- **Orders Location**: Sanity Studio → Orders document type

## Setup Instructions

### Option 1: Local Development (Using Stripe CLI)

1. **Install Stripe CLI** (if not already installed):

   ```bash
   # Windows (using Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```
2. **Login to Stripe CLI**:

   ```bash
   stripe login
   ```
3. **Start webhook forwarding** (in a separate terminal):

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. **Copy the webhook signing secret** from the output (starts with `whsec_`):

   ```
   > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```
5. **Update `.env.local`**:

   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```
6. **Restart your dev server** (Ctrl+C and `pnpm dev` again)
7. **Test a checkout** - orders should now appear in:

   - Sanity Studio: http://localhost:3000/admin/orders
   - User orders page: http://localhost:3000/orders

### Option 2: Production/Deployed (Using Stripe Dashboard)

1. **Deploy your app** to Vercel/production
2. **Go to Stripe Dashboard**:

   - Visit: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
3. **Configure webhook**:

   - **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
   - **Events to send**: Select `checkout.session.completed`
   - Click "Add endpoint"
4. **Get signing secret**:

   - Click on your newly created endpoint
   - Click "Reveal" under "Signing secret"
   - Copy the secret (starts with `whsec_`)
5. **Add to environment variables**:

   - In Vercel: Settings → Environment Variables
   - Add `STRIPE_WEBHOOK_SECRET` with the value
   - Redeploy your app

## Verifying Orders Are WorkingCheck orders in:

1. - **Admin panel**: http://localhost:3000/admin/orders
   - **User orders**: http://localhost:3000/orders
   - **Sanity Studio**: Check the "Order" document type

## Troubleshooting

### Orders still not appearing?

1. **Check webhook is running**:

   ```bash
   # Should show webhook events
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. **Check server logs** for webhook errors:

   ```
   Failed to generate insights: Error [GatewayInternalServerError]...
   ```
3. **Verify webhook secret** in `.env.local`:

   - Must start with `whsec_`
   - No quotes or extra spaces
   - Restart dev server after changing
4. **Check Stripe Dashboard**:

   - Go to: https://dashboard.stripe.com/test/events
   - Look for `checkout.session.completed` events
   - Check if webhook delivery succeeded or failed

### Common Issues

- ❌ **"Webhook signature verification failed"**: Wrong webhook secret
- ❌ **No webhook events**: Stripe CLI not running or wrong URL
- ❌ **Orders created but stock not updated**: Check Sanity write token permissions

## Currency Change

✅ **Currency has been changed from GBP (£) to KES (Kenyan Shillings)**

All prices throughout the app now display in KES format:

- Checkout: Uses KES currency
- Product prices: KES X,XXX.XX
- Order totals: KES X,XXX.XX
- AI insights: Uses KES

Kenya (KE) has been added to the allowed shipping countries.

## Next Steps

1. Set up the webhook using Option 1 above
2. Test a complete checkout flow
3. Verify orders appear in Sanity and the orders page
4. For production, use Option 2 to set up permanent webhooks
