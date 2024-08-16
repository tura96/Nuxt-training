import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, 
    secure: false,
    auth: {
        user: 'oangledesign@gmail.com', 
        pass: 'mwjndafmuefxafsk' 
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default async (to, subject, html, event, attachments = []) => {
    console.info(`Sent Mail: ${to} - ${subject}`);
    const mailOptions = {
        from: 'oangledesign@gmail.com', 
        to,
        subject,
        html,
        attachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return {
            status: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            status: false,
            error
        };
    }
};
