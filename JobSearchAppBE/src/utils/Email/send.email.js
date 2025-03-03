import nodemailer from 'nodemailer';

export const sendEmail = async (
    { to = [], cc = [], bcc = [], text = '', attachments = [], html = '', subject = 'Confirm Email' } = {}
) => {

    const transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments
    });
}
