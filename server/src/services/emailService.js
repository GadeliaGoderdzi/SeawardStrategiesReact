const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // For development - use Mailtrap or similar service
    if (process.env.NODE_ENV === 'development') {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
        port: process.env.MAILTRAP_PORT || 2525,
        auth: {
          user: process.env.MAILTRAP_USER || 'your-mailtrap-user',
          pass: process.env.MAILTRAP_PASS || 'your-mailtrap-pass'
        }
      });
      
      // Mock transporter for development without Mailtrap
      if (!process.env.MAILTRAP_USER) {
        this.transporter = {
          sendMail: (mailOptions) => {
            console.log('\n=== EMAIL VERIFICATION ===');
            console.log('To:', mailOptions.to);
            console.log('Subject:', mailOptions.subject);
            console.log('Verification Link:', this.extractVerificationLink(mailOptions.html));
            console.log('========================\n');
            return Promise.resolve({ messageId: 'mock-message-id' });
          }
        };
      }
    } else {
      // Production email service (e.g., SendGrid, AWS SES)
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // or your preferred service
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }

  extractVerificationLink(htmlContent) {
    const linkMatch = htmlContent.match(/href="([^"]*verify-email[^"]*)"/);
    return linkMatch ? linkMatch[1] : 'Link not found';
  }

  generateVerificationToken(userId) {
    return jwt.sign(
      { userId, type: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const htmlTemplate = this.getVerificationEmailTemplate(user.name, verificationUrl);
    
    const mailOptions = {
      from: {
        name: 'Naval Maritime Systems',
        address: process.env.FROM_EMAIL || 'noreply@naval-systems.com'
      },
      to: user.email,
      subject: 'Verify Your Naval Account - Action Required',
      html: htmlTemplate,
      text: `Welcome to Naval Maritime Systems! Please verify your email by clicking this link: ${verificationUrl}`
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const htmlTemplate = this.getPasswordResetEmailTemplate(user.name, resetUrl);
    
    const mailOptions = {
      from: {
        name: 'Naval Maritime Systems',
        address: process.env.FROM_EMAIL || 'noreply@naval-systems.com'
      },
      to: user.email,
      subject: 'Reset Your Naval Account Password',
      html: htmlTemplate,
      text: `Reset your password by clicking this link: ${resetUrl}`
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  getVerificationEmailTemplate(userName, verificationUrl) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Naval Account</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600;
        }
        .anchor-icon {
            font-size: 48px;
            margin-bottom: 20px;
            display: block;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
            color: #1a365d;
        }
        .message { 
            margin-bottom: 30px; 
            font-size: 16px;
            line-height: 1.8;
        }
        .verify-button { 
            display: inline-block; 
            background: linear-gradient(45deg, #fbbf24, #f59e0b); 
            color: #1a365d; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
            transition: all 0.3s ease;
        }
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
        }
        .expiry-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
        }
        .footer { 
            background: #f8f9fa; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px; 
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #6c757d;
            text-decoration: none;
        }
        @media (max-width: 600px) {
            .container { margin: 10px; }
            .header, .content, .footer { padding: 20px; }
            .verify-button { display: block; text-align: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="anchor-icon">⚓</div>
            <h1>Naval Maritime Systems</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Oceanum Vigilate</p>
        </div>
        
        <div class="content">
            <div class="greeting">Ahoy, ${userName}!</div>
            
            <div class="message">
                Welcome aboard Naval Maritime Systems! We're excited to have you join our fleet of maritime professionals.
            </div>
            
            <div class="message">
                To complete your registration and gain full access to our navigation systems, please verify your email address by clicking the button below:
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="verify-button">
                    🔐 Verify My Account
                </a>
            </div>
            
            <div class="expiry-notice">
                <strong>⏰ Important:</strong> This verification link expires in 24 hours. If you don't verify within this timeframe, you'll need to request a new verification email.
            </div>
            
            <div class="message">
                If you didn't create an account with us, please ignore this email or contact our support team.
            </div>
            
            <div class="message" style="font-size: 14px; color: #6c757d; border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
                <strong>Trouble clicking the button?</strong> Copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="#">📧 Support</a>
                <a href="#">🌐 Website</a>
                <a href="#">📱 Mobile App</a>
            </div>
            
            <p>
                © ${new Date().getFullYear()} Naval Maritime Systems. All rights reserved.<br>
                This email was sent to ${user.email || '[Email]'} because you created an account with us.
            </p>
            
            <p style="font-size: 12px; margin-top: 20px; color: #adb5bd;">
                Naval Maritime Systems | Fleet Management Division<br>
                Maritime Security & Navigation Solutions
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  getPasswordResetEmailTemplate(userName, resetUrl) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Naval Account Password</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600;
        }
        .content { 
            padding: 40px 30px; 
        }
        .reset-button { 
            display: inline-block; 
            background: linear-gradient(45deg, #dc3545, #c82333); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
        }
        .footer { 
            background: #f8f9fa; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px; 
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <p>Hello ${userName},</p>
            
            <p>We received a request to reset your Naval Maritime Systems password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="reset-button">
                    Reset My Password
                </a>
            </div>
            
            <p><strong>This link expires in 1 hour</strong> for security reasons.</p>
            
            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Naval Maritime Systems. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('EXPIRED_TOKEN');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('INVALID_TOKEN');
      }
      throw error;
    }
  }
}

module.exports = new EmailService();