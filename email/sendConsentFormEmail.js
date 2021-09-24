const nodemailer = require("nodemailer");
const Email = require("email-templates");
var config = require("config");
const { Admin } = require("../model/admin");
const moment = require("moment");

const sendConsentFormEmail = async (userEmail, subject, text) => {
  let date = new Date();
  let FDate = moment(date, "hh").format("MM-DD-YYYY LT");
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: config.get("email"),
      pass: config.get("password"),
    },
  });

  const email = new Email({
    transport: transporter,
    send: true,
    preview: false,
  });

  email
    .send({
      template: `consentFormTemplate`,
      message: {
        from: "wellness@vistachristain.org ",
        to: `${userEmail}`,
      },
      locals: {
        FDATE: `${FDate}`,
        TEXT: `${text}`,
      },
    })
    .then(() => console.log("email has been sent! consent form"));
};
module.exports = sendConsentFormEmail;
