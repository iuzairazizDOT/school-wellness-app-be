const nodemailer = require("nodemailer");
const Email = require("email-templates");
let cron = require("node-cron");
var config = require("config");
// var Logo = require("../public/images/logo.png");
const { User } = require("../model/user");
const { emailSetting } = require("../model/emailSettings");
const moment = require("moment");

const emailSend = function () {
  // let date_ob = new Date();
  // let Date = year + "-" + month + "-" + date;
  var transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    auth: {
      user: config.get("email"),
      pass: config.get("password"),
    },
  });

  cron.schedule("00 00 * * *", async () => {
    let user = await User.find();
    let emailsetting = await emailSetting.find();
    let date = new Date();
    let LDate = moment(date, "hh").format("YYYY-MM-DD LT");
    let FDate = moment(date).format("YYYY MM DD");
    let FDDate = moment(date).format("dddd");
    let family = [];
    // console.log("type", typeof emailsetting);
    // console.log("type arr", typeof [1, 2, 3]);
    // console.log(FDate);
    console.log(FDDate);
    // console.log(emailsetting[0].Date.includes(FDate));
    if (emailsetting.length !== 0) {
      if (emailsetting[0].Date.includes(FDate)) {
        console.log("no need");
      } else {
        if (FDDate !== "Saturday" || FDDate !== "Sunday") {
          console.log("Yes needddd");
          user
            .filter((item) => item.recieveEmail == "Yes")
            .map((item) => {
              item.familyMembers.map((item) => {
                family.push(item.familyDetails);
              });
              const email = new Email({
                transport: transporter,
                send: true,
                preview: false,
              });
              email
                .send({
                  template: `defaultEmail`,
                  message: {
                    from: "VCS - Vista Christian School <no-reply@blog.com>",
                    to: `${item.email}`,
                  },
                  locals: {
                    ID: `${item._id}`,
                    FDATE: `${LDate}`,
                    USERNAME: `${item.lastName} ${item.firstName}`,
                    FAMILYMEMBER: family,
                  },
                })
                .then(() => console.log(`email has been sent! ${item.email}`));
            });
        } else {
          console.log("No needdd");
        }
      }
    } else {
      if (FDDate !== "Saturday" || FDDate !== "Sunday") {
        console.log("Yes Need");
        user
          .filter((item) => item.recieveEmail == "Yes")
          .map((item) => {
            item.familyMembers.map((item) => {
              family.push(item.familyDetails);
            });
            const email = new Email({
              transport: transporter,
              send: true,
              preview: false,
            });
            email
              .send({
                template: `defaultEmail`,
                message: {
                  from: "VCS - Vista Christian School <no-reply@blog.com>",
                  to: `${item.email}`,
                },
                locals: {
                  ID: `${item._id}`,
                  FDATE: `${LDate}`,
                  USERNAME: `${item.lastName} ${item.firstName}`,
                  FAMILYMEMBER: family,
                },
              })
              .then(() => console.log(`email has been sent! ${item.email}`));
          });

        // if (item.familyMembers[0].familyDetails != "") {
        //   item.familyMembers.map((familyMember) => {
        //     const email = new Email({
        //       transport: transporter,
        //       send: true,
        //       preview: false,
        //     });
        //     email
        //       .send({
        //         template: `defaultEmail`,
        //         message: {
        //           from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
        //           to: `${item.email}`,
        //         },
        //         locals: {
        //           ID: `${item._id}`,
        //           FDATE: `${FDate}`,
        //           FAMILYMEMBER: `${familyMember.familyDetails}`,
        //           USERNAME: `${item.firstName} ${item.lastName}`,
        //         },
        //       })
        //       .then(() =>
        //         console.log(
        //           `email has been sent! ${familyMember.familyDetails}`
        //         )
        //       );
        //   });
        // }
        // });
      } else {
        console.log("No need");
      }
    }
  });
};
module.exports.emailSend = emailSend;
