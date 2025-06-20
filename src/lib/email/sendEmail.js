
import nodemailer from 'nodemailer'
import { emailTemplates } from './emailTemplate.js';
import {ApiError} from '../apiError.js'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,  
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (type,to, payload={})=>{
    const template = emailTemplates[type]
    
    console.log(type)
    console.log(to)
    console.log(payload)
    console.log(template)

    if(!template){
        throw new ApiError(400,`Failed to get email template ${type}`)
    }

    const {subject, html} = template(payload)

    const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to ,
    subject,
    html
}

await transporter.sendMail(mailOptions)

}