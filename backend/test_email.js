require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        console.log("Sending email...");
        const info = await transporter.sendMail({
            from: '"Porchelvan Builders" <no-reply@porchelvanbuilders.com>',
            to: 'ragulkavai@gmail.com',
            subject: 'Test Email from Script',
            text: 'This is a test email.'
        });
        console.log("Email sent! Message ID:", info.messageId);
    } catch (err) {
        console.error("Error sending email:", err);
    }
}

testEmail();
