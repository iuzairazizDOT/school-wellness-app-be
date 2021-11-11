var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
const moment = require("moment");
var router = express.Router();
const { Answer } = require("../../model/answer");
const { Question } = require("../../model/question");
const { User } = require("../../model/user");
const auth = require("../../middlewares/auth");
const adminEmail = require("../../email/adminEmail");

/* Get All Designations And Users */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let requestObject = {};
  let startMonth = req.query.startMonth ? req.query.startMonth : "";
  var startDate = moment(2021 + "-" + startMonth + "-" + 02 + " 00:00:00");
  var endDate = startDate.clone().endOf("month");
  if (startMonth != "") {
    //     console.log("else", startMonth);
    let monthDATE = {};
    monthDATE.$gte = startDate;
    monthDATE.$lte = endDate;
    requestObject.createdAt = monthDATE;
  }

  let answer = await Answer.find(requestObject)
    .populate("user")
    .populate("question")
    .sort({
      createdAt: -1,
    });
  return res.send(answer);
});

/*Add New Answers*/
router.post("/", async (req, res) => {
  try {
    var currentTime = new Date();
    var today = moment(currentTime).format("HH");
    // let answer = await Answer.find({
    //   user: req.body.user,
    //   createdAt: {
    //     $gte: moment(currentTime).startOf("day").toDate(),
    //   },
    // });
    // console.log(answer);
    // console.log("CT", currentTime);
    // console.log("Today", today);
    // if (today > 00 && today < 15) {
    // if (user && answer.length === 0) {
    let question = new Question();
    question.QuestionOne = req.body.QuestionOne;
    question.QuestionTwo = req.body.QuestionTwo;
    question.QuestionThree = req.body.QuestionThree;
    question.QuestionFour = req.body.QuestionFour;
    question.userName = req.body.userName;
    question
      .save()
      .then((resp) => {
        answer = new Answer();
        answer.user = req.body.user;
        answer.familyMember = req.body.familyMember;
        answer.question = resp._id;
        answer.AnswerOne = req.body.AnswerOne;
        answer.AnswerTwo = req.body.AnswerTwo;
        answer.AnswerThree = req.body.AnswerThree;
        answer.AnswerFour = req.body.AnswerFour;
        answer.LastName = req.body.LastName;
        // answer.FirstName = req.body.FirstName;
        answer.Grade = req.body.Grade;
        // answer.Name = req.body.Name;
        answer.Phone = req.body.Phone;
        answer.PersonComp = req.body.PersonComp;
        answer.Purpose = req.body.Purpose;

        if (
          req.body.AnswerOne === "No" ||
          req.body.AnswerTwo === "Yes" ||
          req.body.AnswerThree === "Yes" ||
          req.body.AnswerFour === "Yes"
        ) {
          adminEmail(
            "Covid Symptoms Alert",
            `<h3 style="color : red">User Details</h3><br>
               Name: ${req.body.LastName}<br>
               Name Person Completeing Screening: ${req.body.PersonComp}<br>
               Phone: ${req.body.Phone}<br>
               Purpose: ${req.body.Purpose}<br>
               Grade: ${req.body.Grade}<br>
               

              Question 1: ${req.body.AnswerOne} <br> Question 2: ${req.body.AnswerTwo} <br> Question 3: ${req.body.AnswerThree} <br> Question 4: ${req.body.AnswerFour}`
          );
        }
        answer
          .save()
          .then((resp) => {
            return res.send(resp);
            console.log("Last Name", req.body.LastName);
          })
          .catch((err) => {
            return res.status(500).send({ error: err });
          });
      })

      .catch((err) => {
        return res.status(500).send({ error: err });
      });
    // }
    // } else {
    //   return res.status(400).send("Expired Link Or Already Submitted Today ");
    // }
  } catch {
    return res.status(400).send("Expired Link Or Already Submitted Today"); // when id is inavlid
  }
});

// Update Answers
router.put("/:id", auth, async (req, res) => {
  try {
    let answer = await Answer.findById(req.params.id);
    console.log(answer);
    if (!answer)
      return res.status(400).send("Answer with given id is not present");
    answer = extend(answer, req.body);
    await answer.save();
    return res.send(answer);
  } catch {
    return res.status(400).send("Invalid Answer Id"); // when id is inavlid
  }
});

// Delete Monthly Answers
router.delete("/monthly", auth, async (req, res) => {
  let newDate = new Date();
  var first_date = new Date(newDate.getFullYear(), newDate.getMonth() - 1, 2);
  var last_date = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  // console.log("mnth", last_date);
  // console.log("mnth1", first_date);

  try {
    let answer1 = await Answer.deleteMany({
      createdAt: {
        $lte: last_date,
        $gte: first_date,
      },
    });
    if (!answer1) {
      return res.status(400).send("No Records To Delete In Previous Month"); // when there is no id in db
    }
    return res.send(answer1); // when everything is okay
  } catch (err) {
    console.log("error", err);
    return res.status(400).send("Error"); // when id is inavlid
  }
});

module.exports = router;
