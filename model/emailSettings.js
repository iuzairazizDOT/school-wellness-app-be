const mongoose = require("mongoose");

const emailSettingsSchema = mongoose.Schema(
  {
    Date: [{ type: String }],
  },
  { timestamps: true }
);

const emailSetting = mongoose.model("emailSetting", emailSettingsSchema);
module.exports.emailSetting = emailSetting;
