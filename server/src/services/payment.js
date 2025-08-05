const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true
        }
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        status: paymentIntent.status,
        paymentIntent
      };
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createCustomer(customerData) {
    try {
      const customer = await this.stripe.customers.create({
        name: customerData.name,
        email: customerData.email,
        metadata: customerData.metadata || {}
      });

      return {
        success: true,
        customer
      };
    } catch (error) {
      console.error('Customer creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        success: true,
        refund
      };
    } catch (error) {
      console.error('Refund creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleWebhook(rawBody, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return {
        success: true,
        event
      };
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processWebhookEvent(event) {
    try {
      switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('PaymentIntent was successful!');
        // Handle successful payment
        break;

      case 'payment_intent.payment_failed':
        console.log('PaymentIntent failed.');
        // Handle failed payment
        break;

      case 'customer.created':
        console.log('Customer was created.');
        // Handle new customer
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook event processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data
      };
    } catch (error) {
      console.error('Failed to retrieve payment methods:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  formatAmount(amount) {
    return (amount / 100).toFixed(2);
  }

  validateWebhookSignature(rawBody, signature) {
    try {
      this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new PaymentService();
