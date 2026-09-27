require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Banking App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`Email successfully sent to ${to}. MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Modern Banking App!';
    const text = `Dear ${name},\n\nThank you for opening an account with us. Your registration was successful.\n\nBest regards,\nBanking Team`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #2563eb; margin: 0;">Modern Banking</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Secure & Intelligent Digital Banking</p>
      </div>
      <div style="padding: 16px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
        <h3 style="color: #1e293b;">Welcome aboard, ${name}!</h3>
        <p style="color: #475569; line-height: 1.6;">
          Thank you for registering with us. Your account has been created successfully. You can now access your account dashboard, manage your finances, and conduct secure transactions.
        </p>
      </div>
      <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p>If you did not create this account, please ignore this email or contact support.</p>
        <p>&copy; ${new Date().getFullYear()} Banking App. All rights reserved.</p>
      </div>
    </div>
  `;

    return await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendEmail, sendRegistrationEmail };