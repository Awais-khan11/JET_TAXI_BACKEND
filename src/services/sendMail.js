const nodemailer = require('nodemailer');
const transporter = require('../config/Transporter');
verificationTemplate = (code) => `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
  
  <div style="max-width: 500px; background: #ffffff; margin: auto; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <h2 style="margin-bottom: 10px;">🔐 Email Verification</h2>
    
    <p style="color: #555; font-size: 14px;">
      Use the verification code below to complete your action.
    </p>

    <div style="margin: 30px 0;">
      <span style="
        display: inline-block;
        background: #f1f3f5;
        padding: 15px 25px;
        font-size: 28px;
        letter-spacing: 5px;
        font-weight: bold;
        border-radius: 8px;
        color: #333;
      ">
        ${code}
      </span>
    </div>

    <p style="font-size: 13px; color: #888;">
      This code will expire in <strong>5 minutes</strong>.
    </p>

    <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

    <p style="font-size: 12px; color: #aaa;">
      If you didn’t request this, you can safely ignore this email.
    </p>

  </div>

</div>
`;
const bookingTemplate = (data) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      
      <!-- HEADER -->
      <div style="background:#002B5B; padding:20px; text-align:center;">
        <h1 style="color:#fff; margin:0; font-size:22px;">🚖 New Taxi Booking Request</h1>
      </div>

      <!-- BODY -->
      <div style="padding:20px;">

        <p style="font-size:14px; color:#333;">
          You have received a new booking request. Here are the details:
        </p>

        <!-- CUSTOMER INFO -->
        <h3 style="color:#002B5B; border-bottom:1px solid #eee; padding-bottom:5px;">
          👤 Customer Details
        </h3>

        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>

        <!-- TRIP INFO -->
        <h3 style="color:#002B5B; border-bottom:1px solid #eee; padding-bottom:5px; margin-top:20px;">
          🛣 Trip Details
        </h3>

        <p><b>Route:</b> ${data.route}</p>
        <p><b>Date:</b> ${data.date}</p>
        <p><b>Time:</b> ${data.time}</p>
        <p><b>Passengers:</b> ${data.passengers}</p>

        <!-- PAYMENT -->
        <h3 style="color:#002B5B; border-bottom:1px solid #eee; padding-bottom:5px; margin-top:20px;">
          💳 Payment Method
        </h3>

        <p>${data.paymentMethod}</p>

        <!-- FOOTER -->
        <div style="margin-top:25px; padding:15px; background:#f1f3f5; border-radius:8px;">
          <p style="margin:0; font-size:13px; color:#555;">
            ⚠ Please verify the booking by checking admin panel or contacting customer.
          </p>
        </div>

      </div>

      <!-- FOOTER BAR -->
      <div style="background:#002B5B; text-align:center; padding:10px;">
        <p style="color:white; font-size:12px; margin:0;">
          Taxi Booking System © ${new Date().getFullYear()}
        </p>
      </div>

    </div>
  </div>
  `;
};

module.exports = bookingTemplate;
async function sendCode(email, code) {
      try {
            const info = await transporter.sendMail({
                  from: "standrews479@gmail.com",
                  to: email,
                  subject: "Your Verification Code",
                  text: `Your verification code is: ${code}`,
                  html: verificationTemplate(code),
            });
            console.log("Verification email sent:", info.messageId);
      } catch (err) {
            console.error("Error sending verification code:", err);

      }
}



async function sendMail(email,data) {
      try {
            const info = await transporter.sendMail({
                  from: email,
                  to:"standrews479@gmail.com", 
                  subject: "Booking Confirmation",
                  text: `Your booking is confirmed!`,
                  html: bookingTemplate(data),
            });
            console.log("Booking confirmation email sent:", info.messageId);
      } catch (err) {
            console.error("Error sending booking confirmation email:", err);
      }
}

module.exports = {
      sendCode,
      sendMail
};