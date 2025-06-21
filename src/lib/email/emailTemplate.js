export const emailTemplates = {
  ORDER_PLACED: ({ orderId }) => ({
    subject: `📝 Your order #${orderId} has been placed!`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2 style="color:#007bff;">Order Received!</h2>
        <p>Hi,</p>
        <p>Your order <strong>#${orderId}</strong> has been received and is awaiting payment.</p>
        <p>Please proceed to payment to confirm your order.</p>
        <p>Thank you!</p>
        <p><strong>${process.env.FROM_NAME || 'BookBazaar Team'}</strong></p>
      </div>
    `,
  }),

  ORDER_CONFIRMED: ({ orderId }) => ({
    subject: `🎉 Payment Successful - Order #${orderId} Confirmed!`,
    html: `
      <div style="font-family:'Segoe UI', Tahoma, sans-serif;padding:20px;">
        <h2 style="color:#28a745;">Payment Confirmed!</h2>
        <p>Hi,</p>
        <p>Your payment for order <strong>#${orderId}</strong> has been successfully received.</p>
        <p>We're now processing your order and you'll receive a shipping update soon.</p>
        <p>Thanks for shopping with us!</p>
        <p><strong>${process.env.FROM_NAME || 'BookBazaar Team'}</strong></p>
      </div>
    `,
  }),
};
