const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
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
            from: `"Apex Bank" <${process.env.EMAIL_USER}>`,
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
    const subject = 'Your Apex Bank Account is Ready';
    const text = `Dear ${name},\n\nWelcome to Apex Bank. Your digital account has been created successfully.\n\nBest regards,\nApex Banking Team`;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Apex Bank</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
      
      <!-- Outer Wrapper with Real Architectural / Financial Background -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0f172a url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80') center center / cover no-repeat; padding: 48px 16px;">
        <tr>
          <td align="center" valign="top">
            
            <!-- Main Content Container Card -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.4); border: 1px solid #e2e8f0;">
              
              <!-- Brand Top Bar -->
              <tr>
                <td style="background-color: #0f172a; padding: 24px 32px; border-bottom: 3px solid #2563eb;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="left">
                        <span style="font-size: 20px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff;">
                          APEX<span style="color: #3b82f6;">BANK</span>
                        </span>
                      </td>
                      <td align="right">
                        <span style="display: inline-block; background-color: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; border: 1px solid #334155;">
                          Official Notice
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Hero Banner Header -->
              <tr>
                <td style="padding: 36px 36px 20px 36px;">
                  <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: -0.5px;">
                    Welcome to Apex Bank, ${name}
                  </h1>
                  <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0;">
                    Your digital banking account is officially active. You now have access to enterprise-grade security, instant transactions, and personalized financial insights.
                  </p>
                </td>
              </tr>

              <!-- Account Summary Box -->
              <tr>
                <td style="padding: 0 36px 24px 36px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px;">
                    <tr>
                      <td>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding-bottom: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">
                              Account Details
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; font-size: 14px; color: #334155; border-top: 1px solid #edf2f7;">
                              <strong>Registered Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; font-size: 14px; color: #334155; border-top: 1px solid #edf2f7;">
                              <strong>Registered Email:</strong> ${userEmail}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; font-size: 14px; color: #334155; border-top: 1px solid #edf2f7;">
                              <strong>Account Status:</strong> <span style="color: #16a34a; font-weight: 600;">● Active</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Security Information Note -->
              <tr>
                <td style="padding: 0 36px 28px 36px;">
                  <div style="border-left: 4px solid #2563eb; background-color: #eff6ff; padding: 14px 18px; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.5;">
                      <strong>Security Tip:</strong> Apex Bank will never ask for your password, PIN, or OTP over email or phone. Always verify URLs before logging in.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Call to Action -->
              <tr>
                <td align="center" style="padding: 0 36px 36px 36px;">
                  <a href="#" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block; letter-spacing: 0.3px;">
                    Log In to Your Account
                  </a>
                </td>
              </tr>

              <!-- Corporate Footer -->
              <tr>
                <td style="background-color: #0f172a; padding: 28px 36px; text-align: center; border-top: 1px solid #1e293b;">
                  <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0 0 10px 0;">
                    This is an automated notification from Apex Bank. Please do not reply directly to this email.
                  </p>
                  <p style="color: #64748b; font-size: 11px; margin: 0;">
                    &copy; ${new Date().getFullYear()} Apex Bank Corporation. Member FDIC. Equal Housing Lender.
                  </p>
                </td>
              </tr>

            </table>

            <!-- Unsubscribe / Security Help Footer outside container -->
            <p style="color: #cbd5e1; font-size: 12px; margin: 20px 0 0 0; text-shadow: 0 1px 2px rgba(0,0,0,0.6);">
              Need help? Contact 24/7 Security & Support Team
            </p>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

    return await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendEmail, sendRegistrationEmail };