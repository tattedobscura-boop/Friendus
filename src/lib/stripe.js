import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Lazily-loaded Stripe instance (cached after first call)
let stripePromise = null;

export function getStripe() {
  if (!stripePromise && publishableKey && !publishableKey.includes('your-stripe')) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

export const PAYMENT_LINK    = import.meta.env.VITE_STRIPE_PAYMENT_LINK    || '';
export const PREMIUM_PRICE_ID = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || '';

/**
 * Open the Stripe Payment Link for the premium plan.
 * Pass the user's email so Stripe pre-fills the checkout form.
 * The success URL should include ?upgraded=1 so we can detect the return.
 */
export function openCheckout(email = '') {
  const base = PAYMENT_LINK;
  if (!base || base.includes('your-payment-link')) {
    alert('Stripe is not configured yet. Add VITE_STRIPE_PAYMENT_LINK to your .env file.');
    return;
  }
  const params = new URLSearchParams();
  if (email) params.set('prefilled_email', email);
  const url = `${base}?${params.toString()}`;
  window.open(url, '_blank', 'noopener');
}
