import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use host/port for other services
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendWelcomeEmail = async (email, couponCode) => {
    const mailOptions = {
        from: `"Awais Mart Elite Club" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to the Elite Club - Your Exclusive Access",
        html: `
            <div style="font-family: sans-serif; color: #1e1b4b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #1e1b4b; padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 4px; font-size: 24px;">Elite Club Membership</h1>
                </div>
                <div style="padding: 40px; background-color: #ffffff;">
                    <p style="font-weight: bold; font-size: 18px; margin-bottom: 20px;">Welcome to the Inner Circle.</p>
                    <p style="line-height: 1.6; color: #475569;">Your authorization for the Elite Club has been granted. As a high-tier member, you now have access to exclusive drops and curated masterpieces.</p>
                    <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border: 1px dashed #4f46e5; text-align: center;">
                        <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #64748b;">Your Exclusive Coupon</p>
                        <h2 style="margin: 10px 0; font-size: 32px; color: #4f46e5; letter-spacing: 5px;">${couponCode}</h2>
                    </div>
                    <p style="line-height: 1.6; color: #475569;">Apply this code at checkout to claim your inaugural membership benefit.</p>
                </div>
            </div>
        `
    };
    return transporter.sendMail(mailOptions);
};

export const sendCampaignEmail = async (emails, subject, htmlContent) => {
    const mailOptions = {
        from: `"Awais Mart Elite" <${process.env.EMAIL_USER}>`,
        to: emails.join(','),
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(mailOptions);
};

export const sendAutoReply = async (email, name) => {
    const mailOptions = {
        from: `"Awais Mart Concierge" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Transmission Received: Your Inquiry with Awais Mart",
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e1b4b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #1e1b4b; padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 4px; font-size: 24px;">Elite Club Support</h1>
                </div>
                <div style="padding: 40px; background-color: #ffffff;">
                    <p style="font-weight: bold; font-size: 18px; margin-bottom: 20px;">Salutations, ${name}.</p>
                    <p style="line-height: 1.6; color: #475569;">We have successfully authorized your inquiry transmission. Our team of luxury specialists has assigned this to a high-priority queue.</p>
                    <p style="line-height: 1.6; color: #475569;">You can expect a professional consultation via this secure line within 24 standard business hours.</p>
                    <div style="margin: 40px 0; padding: 20px; border-left: 4px solid #4f46e5; background-color: #f8fafc;">
                        <p style="margin: 0; font-size: 14px; font-style: italic; color: #64748b;">"Excellence is not an act, but a habit."</p>
                    </div>
                    <p style="font-size: 14px; color: #94a3b8; border-top: 1px solid #f1f5f9; pt: 20px; margin-top: 40px;">Professional Boutique Management System v.ALPHA</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        if (error.code === 'EAUTH') {
            console.log("--------------------------------------------------");
            console.log("EMAILING FALLBACK (BAD CREDENTIALS):");
            console.log("TO:", mailOptions.to);
            console.log("SUBJECT:", mailOptions.subject);
            console.log("CONTENT:", mailOptions.html.substring(0, 200) + "...");
            console.log("ACTION: Please update EMAIL_USER and EMAIL_PASS in .env with a valid App Password.");
            console.log("--------------------------------------------------");
        } else {
            console.error("Email Error:", error);
        }
    }
};

export const sendAdminNotification = async (inquiry) => {
    const mailOptions = {
        from: `"Awais Mart System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "High-Priority Action Required: New Inquiry Received",
        html: `
            <div style="padding: 20px; background-color: #fff7ed; border: 2px solid #ea580c; border-radius: 12px; font-family: sans-serif;">
                <h2 style="color: #ea580c; margin-top: 0;">New Customer Inquiry</h2>
                <p><strong>From:</strong> ${inquiry.name} (${inquiry.email})</p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #fed7aa;">
                    <p style="margin: 0; color: #431407;">${inquiry.message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px;">Authorize and respond via Admin Control Panel.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        if (error.code === 'EAUTH') {
            console.log("--------------------------------------------------");
            console.log("ADMIN NOTIFICATION FALLBACK (BAD CREDENTIALS):");
            console.log("FROM:", inquiry.email);
            console.log("MESSAGE:", inquiry.message.substring(0, 100) + "...");
            console.log("--------------------------------------------------");
        } else {
            console.error("Admin Email Error:", error);
        }
    }
};

export const sendInquiryResponse = async (email, name, originalMessage, replyMessage) => {
    const mailOptions = {
        from: `"Awais Mart Concierge" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "RE: Your Inquiry with Awais Mart",
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e1b4b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #1e1b4b; padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 4px; font-size: 24px;">Customer Care</h1>
                </div>
                <div style="padding: 40px; background-color: #ffffff;">
                    <p style="font-weight: bold; font-size: 18px; margin-bottom: 20px;">Greetings, ${name}.</p>
                    <div style="line-height: 1.6; color: #1e1b4b; font-size: 16px; margin-bottom: 40px;">
                        ${replyMessage.replace(/\n/g, '<br>')}
                    </div>
                    
                    <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #f1f5f9;">
                        <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 2px; color: #94a3b8; margin-bottom: 15px;">Previous Communication</p>
                        <div style="padding: 20px; border-left: 3px solid #e2e8f0; background-color: #f8fafc; color: #64748b; font-size: 14px; line-height: 1.5;">
                            "${originalMessage}"
                        </div>
                    </div>
                    
                    <p style="font-size: 12px; color: #94a3b8; margin-top: 40px; text-align: center;">Authorized by Awais Mart Executive Support Team</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        if (error.code === 'EAUTH') {
            console.log("--------------------------------------------------");
            console.log("RESPONSE DISPATCH FALLBACK (BAD CREDENTIALS):");
            console.log("TO:", email);
            console.log("CUSTOMER:", name);
            console.log("REPLY:", replyMessage);
            console.log("--------------------------------------------------");
        } else {
            throw error;
        }
    }
};
