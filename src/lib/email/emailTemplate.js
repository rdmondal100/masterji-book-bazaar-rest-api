export const emailTemplates = {
  ORDER_CONFIRMATION: ({ orderId }) => ({
    subject: `🎉 Order Confirmation - Order #${orderId}`,
    html: `
      <div style="font-family:Arial, sans-serif; padding:20px; color:#333;">
        <h2 style="color:#4CAF50;">Thank you for your order!</h2>
        <p>Hello,</p>
        <p>We're excited to let you know that your order <strong>#${orderId}</strong> has been successfully placed.</p>
        <div style="background-color:#f2f2f2; padding:15px; border-radius:8px; margin:20px 0;">
          <h3 style="margin:0; color:#333;">Order Details</h3>
          <p style="margin:5px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin:5px 0;">You will receive another email once your order has been shipped.</p>
        </div>
        <p>If you have any questions, just reply to this email — we're always happy to help.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>${process.env.FROM_NAME}</strong></p>
      </div>
    `,
  }),
  

 };
