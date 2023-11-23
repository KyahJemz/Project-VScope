import nodemailer from 'nodemailer';

async function sendMail(to, subject, text) {

  const transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com', 
    port: 2525,
    secure: false, 
    auth: {
      user: 'burhacker404@gmail.com', 
      pass: '540FC0E1167D624E378839B4431E277B96A8', 
    },
  });

  const info = await transporter.sendMail({
    from: 'VScope Mail <burhacker404@gmail.com>', 
    to,
    subject,
    text,
  });

  console.log('Message sent: %s', info.messageId);
}

export default sendMail;