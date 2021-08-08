const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
  {
    userTo: { type: Schema.Types.ObjectId, ref: "User" },
    userFrom: { type: Schema.Types.ObjectId, ref: "User" },
    notificationType: String,
    opened: {
      type: Boolean,
      default: false,
    },
    entityId: Schema.Types.ObjectId,
  },
  { timestamps: true }
);

// declares a function on the schema itself and we can call this function on any other page.
NotificationSchema.statics.insertNotification = async (
  userTo,
  userFrom,
  notificationType,
  entityId
) => {
  let data = { userTo, userFrom, notificationType, entityId };
  await Notification.deleteOne(data).catch((error) => console.error(error));
  return Notification.create(data).catch((error) => console.error(error));
};

const Notification = model("Notification", NotificationSchema);

module.exports = Notification;
