var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { emailSetting } = require("../../model/emailSettings");
const auth = require("../../middlewares/auth");

/* Get All Current Question  */
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let emailsetting = await emailSetting.find().sort({
    createdAt: -1,
  });

  return res.send(emailsetting);
});

/*Add New Email Settings*/
router.post("/", async (req, res) => {
  let emailsetting = await emailSetting.find();
  await emailSetting.deleteMany({});
  emailsetting = new emailSetting(req.body);
  await emailsetting
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Email Settings
router.put("/:id", async (req, res) => {
  try {
    let emailsetting = await emailSetting.findById(req.params.id);
    console.log(emailsetting);
    if (!emailsetting)
      return res.status(400).send("Question with given id is not present");
    emailsetting = extend(emailsetting, req.body);
    await emailsetting.save();
    return res.send(emailsetting);
  } catch {
    return res.status(400).send("Invalid Question Id"); // when id is inavlid
  }
});

// Delete Email Settings
router.delete("/:id", async (req, res) => {
  try {
    let emailsetting = await emailSetting.findByIdAndDelete(req.params.id);
    if (!emailsetting) {
      return res.status(400).send("Question with given id is not present"); // when there is no id in db
    }
    return res.send(emailsetting); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Question Id"); // when id is inavlid
  }
});

module.exports = router;
