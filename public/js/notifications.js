$(document).ready(() => {
  $.get(`/api/notifications`, (data) => {
    console.log(data);
    outputNotificationList(data, $(".resultsContainer"));
  });
});

$("#markNotificationsAsRead").click(() => markNotificationsAsRead());

const outputNotificationList = (notifications, container) => {
  notifications.forEach((notification) => {
    let html = createNotificationHtml(notification);
    container.append(html);
  });

  if (notifications.length == 0) {
    container.append(`<span class='noResults'>Nothing to show</span>`);
  }
};

const createNotificationHtml = (notification) => {
  let userFrom = notification.userFrom;
  let className = notification.opened ? "" : "active";
  return `<a href=${getNotificationUrl(
    notification
  )} class="resultListItem notification ${className}" data-id=${
    notification._id
  }>
    <div class="resultsImageContainer">
        <img src='${userFrom.profilePic}'>
    </div>
    <div class='resultsDetailsContainer ellipsis'>
        <span class="ellipsis">${getNotificationText(notification)}</span>
    </div>
  </a>`;
};

const getNotificationText = (notification) => {
  let userFrom = notification.userFrom;

  if (!userFrom.firstName || !userFrom.lastName) {
    return alert("User from data is not populated");
  }

  let userFromName = `${userFrom.firstName} ${userFrom.lastName}`;
  let text;
  if (notification.notificationType == "retweet") {
    text = `${userFromName} retweeted one of your posts`;
  } else if (notification.notificationType == "postLike") {
    text = `${userFromName} liked one of your posts`;
  } else if (notification.notificationType == "reply") {
    text = `${userFromName} replied one of your posts`;
  } else if (notification.notificationType == "follow") {
    text = `${userFromName} followed you`;
  }

  return `<span class="ellipsis">${text}</span>`;
};

const getNotificationUrl = (notification) => {
  let url;

  if (
    notification.notificationType == "retweet" ||
    notification.notificationType == "postLike" ||
    notification.notificationType == "reply"
  ) {
    url = `/post/${notification.entityId}`;
  } else if (notification.notificationType == "follow") {
    url = `/profile/${notification.entityId}`;
  }

  return url;
};
