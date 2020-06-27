var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});

const welcomeEmail = (email, username, URL) => {
    var mailOptions = {
        from: 'safieddinemhd@gmail.com',
        to: email,
        subject: 'Welcome to Task Manager',
        text: `Hello ${username.toUpperCase()}. Welcome to Task Manager Application. We hope that you have an excellent experience using our platform! Please take a few minutes to verify your account: jotdown.herokuapp.com/users/verify/${URL} `
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });   
};

const goodbyeEmail = (email, username) => {
    var mailOptions = {
        from: 'safieddinemhd@gmail.com',
        to: email,
        subject: 'De-activating Your Account',
        text: `Hello ${username.toUpperCase()}, hope that you are doing well!

    If you may, please send us some feedback on why you decided to de-activate your account, and what are the things we could have done better to keep you as a customer.

    Thank you and good luck!`
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });   
};

const changePassword = (email, username, URL) => {
  var mailOptions = {
    from: 'safieddinemhd@gmail.com',
    to: email,
    subject: 'Change Password Request',
    text: `Hello ${username.toUpperCase()}. 
    You recently requested to change your password, and here is the link: jotdown.herokuapp.com/users/changepassword/${URL}
    Note that this link is limited for a single use (you can access it once ONLY) and valid for 15 minutes.`
};
  
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
  });
}

const forgotPassword = (email, username, URL) => {
  var mailOptions = {
      from: 'safieddinemhd@gmail.com',
      to: email,
      subject: 'Password reset',
      text: `Hello ${username.toUpperCase()},

You recently requested to reset your password, and here is the link: jotdown.herokuapp.com/users/forgotpassword/${URL} . Note that this link is limited for a single use (you can access it once ONLY) and valid for 15 minutes.`
  };
    
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
  });   
};

const support = (email, name, message) => {
  var mailOptions = {
      from: 'safieddinemhd@gmail.com',
      to: 'safieddinemhd@gmail.com',
      subject: 'Customer Support',
      text: `Name: ${name}
email: ${email}
message: ${message}`
  };
    
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
  });   
};

module.exports = {
    welcomeEmail: welcomeEmail,
    goodbyeEmail: goodbyeEmail,
    changePassword: changePassword,
    forgotPassword: forgotPassword,
    support: support
}