const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS  // Use App Password for Gmail
        }
    });
};

// Generate 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code email
const sendVerificationCode = async (email, code, userName) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Lâl Jewelry" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Change Verification Code - Lâl',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%); padding: 40px; text-align: center;">
                                        <h1 style="color: #D4AF37; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 4px;">LÂL</h1>
                                        <p style="color: #888888; margin: 10px 0 0 0; font-size: 12px; letter-spacing: 2px;">LUXURY JEWELRY</p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px; font-weight: 500;">Password Change Request</h2>
                                        
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                            Hello ${userName || 'Valued Customer'},
                                        </p>
                                        
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                            We received a request to change your password. Please use the verification code below to confirm this change:
                                        </p>
                                        
                                        <!-- Verification Code Box -->
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 30px 0;">
                                                    <div style="background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%); border: 2px solid #D4AF37; border-radius: 8px; padding: 25px 50px; display: inline-block;">
                                                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">${code}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                                            This code will expire in <strong>10 minutes</strong>.
                                        </p>
                                        
                                        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                            If you didn't request this password change, please ignore this email or contact our support team immediately.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #fafafa; padding: 30px 40px; border-top: 1px solid #eeeeee;">
                                        <p style="color: #999999; font-size: 12px; margin: 0; text-align: center;">
                                            © ${new Date().getFullYear()} Lâl Jewelry. All rights reserved.
                                        </p>
                                        <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0; text-align: center;">
                                            This is an automated email, please do not reply.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

// Send password changed confirmation email
const sendPasswordChangedConfirmation = async (email, userName) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Lâl Jewelry" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Changed Successfully - Lâl',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%); padding: 40px; text-align: center;">
                                        <h1 style="color: #D4AF37; margin: 0; font-size: 32px; letter-spacing: 4px;">LÂL</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="color: #1a1a1a; margin: 0 0 20px 0;">Password Changed Successfully</h2>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                            Hello ${userName || 'Valued Customer'},
                                        </p>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                            Your password has been changed successfully. If you did not make this change, please contact our support team immediately.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                        <p style="color: #999999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Lâl Jewelry</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateVerificationCode,
    sendVerificationCode,
    sendPasswordChangedConfirmation
};
