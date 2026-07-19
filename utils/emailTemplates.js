const welcomeEmailTemplate = (name, url) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Our Platform</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #4CAF50; padding: 30px; text-align: center; color: white; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .content h1 { margin-top: 0; color: #333333; font-size: 24px; }
        .btn { display: inline-block; padding: 12px 25px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        .footer { background-color: #f1f1f1; padding: 20px; text-align: center; color: #777777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome Aboard!</h2>
        </div>
        <div class="content">
          <h1>Hello ${name},</h1>
          <p>We are thrilled to have you join us. Our platform is designed to provide you with the best experience possible.</p>
          <p>To get started, simply click the button below to explore your new dashboard and set up your profile.</p>
          <div style="text-align: center;">
            <a href=${url} class="btn" style="color: white;">Get Started</a>
          </div>
          <p style="margin-top: 30px;">If you have any questions, our support team is always here to help!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const resetPasswordTemplate = (resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #f44336; padding: 30px; text-align: center; color: white; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .content h1 { margin-top: 0; color: #333333; font-size: 24px; }
        .btn { display: inline-block; padding: 12px 25px; background-color: #f44336; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        .footer { background-color: #f1f1f1; padding: 20px; text-align: center; color: #777777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Reset Request</h2>
        </div>
        <div class="content">
          <h1>Hello,</h1>
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          <p>Click the button below to reset your password. This link is only valid for 10 minutes.</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn" style="color: white;">Reset Your Password</a>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #555;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #f44336; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const emailVerificationTemplate = (firstName, verifyUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 30px; text-align: center; color: white; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .content h1 { margin-top: 0; color: #333333; font-size: 24px; }
        .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; font-size: 16px; }
        .expiry { margin-top: 24px; padding: 12px; background: #fff8e1; border-left: 4px solid #ffc107; border-radius: 4px; font-size: 13px; color: #666; }
        .footer { background-color: #f1f1f1; padding: 20px; text-align: center; color: #777777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✉️ Verify Your Email</h2>
        </div>
        <div class="content">
          <h1>Hi ${firstName}!</h1>
          <p>Thanks for signing up for <strong>Pluse</strong>. You're almost ready to start connecting with people!</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="btn" style="color: white;">Verify My Email</a>
          </div>
          <div class="expiry">
            ⏰ This link will expire in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
          </div>
          <p style="margin-top: 20px; font-size: 13px; color: #555;">
            Or copy and paste this link into your browser:<br>
            <a href="${verifyUrl}" style="color: #06b6d4; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Pluse. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
module.exports = {
  welcomeEmailTemplate,
  resetPasswordTemplate,
  emailVerificationTemplate,
};
