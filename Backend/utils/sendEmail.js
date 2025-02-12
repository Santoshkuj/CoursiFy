import nodemailer from "nodemailer";

const sendEmail = async function(email,subject,message) {
    //create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    await transporter.sendEmail({
        from: process.env.SMTP_FROM_EMAIL,
        to: email,
        subject: subject,
        html: message
    })
}
export default sendEmail;