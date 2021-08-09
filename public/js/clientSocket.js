let connected = false;

let socket = io(`http://localhost:3001`);

socket.emit("setup", userLoggedIn);

socket.on("connected", () => (connected = true));
socket.on("message received", (newMessage) => messageReceieved(newMessage));
socket.on("notification received", (newNotification) =>
  //   console.log(newNo÷tification)
  $.get("/api/notifications/latest", (notificationData) => {
    refreshNotificationsBadge();
  })
);

const emitNotification = (userId) => {
  if (userId === userLoggedIn._id) return;
  socket.emit("notification received", userId);
};
