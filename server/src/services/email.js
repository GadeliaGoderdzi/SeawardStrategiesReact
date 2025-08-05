const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (process.env.NODE_ENV === 'production') {
      this.transporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } else {
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
    }
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: options.from || process.env.EMAIL_FROM || 'noreply@fullstackapp.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const result = await this.transporter.sendMail(mailOptions);

      if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
      }

      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Full Stack App!</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for registering with us. We're excited to have you on board!</p>
        <p>You can now access all the features of our platform.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Get Started
          </a>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Full Stack App Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Welcome to Full Stack App!',
      html
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset for your Full Stack App account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Full Stack App Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html
    });
  }

  async sendContactFormEmail(contactData) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Contact Form Submission</h1>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: white; padding: 15px; border-radius: 4px;">${contactData.message}</p>
        </div>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      </div>
    `;

    return await this.sendEmail({
      to: process.env.CONTACT_EMAIL || 'admin@fullstackapp.com',
      subject: `Contact Form: ${contactData.subject}`,
      html,
      replyTo: contactData.email
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service is ready' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
