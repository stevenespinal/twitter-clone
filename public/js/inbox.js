$(document).ready(() => {
  $.get(`/api/chats`, (data, status, xhr) => {
    if (xhr.status === 400) {
      alert("Could not retrieve chat list.");
    } else {
      outputChatList(data, $(".resultsContainer"));
      $(".loadingSpinnerContainer").remove();
      $(".resultsContainer").css("visibility", "visible");
    }
  });
});

const outputChatList = (chatList, container) => {
  console.log(chatList);
  chatList.forEach((chatItem) => {
    let html = createChatHtml(chatItem);
    container.append(html);
  });

  if (chatList.length === 0) {
    container.append(`<span class='noResults'>Nothing to show</span>`);
  }
};

const createChatHtml = (chat) => {
  let chatName = getChatName(chat);
  let image = getChatImageElements(chat);
  let latestMessage = getLatestMessage(chat.latestMessage);

  return `<a href="/messages/${chat._id}" class="resultListItem">
  ${image}
    <div class="resultDetailsContainer ellipsis">
        <span class="heading ellipsis">${chatName}</span>
        <span class="subText ellipsis">${latestMessage}</span>
    </div>
  </a>`;
};

// const getChatName = (chat) => {
//   let chatName = chat.chatName;
//   if (!chatName) {
//     let otherChatUsers = getOtherChatUsers(chat.users);
//     let namesArray = otherChatUsers.map(
//       (user) => `${user.firstName} ${user.lastName}`
//     );
//     chatName = namesArray.join(", ");
//   }
//   return chatName;
// };

// const getOtherChatUsers = (users) => {
//   if (users.length === 1) {
//     return users;
//   }
//   return users.filter((user) => user._id !== userLoggedIn._id);
// };

const getChatImageElements = (chat) => {
  let otherChatUsers = getOtherChatUsers(chat.users);
  let groupChatClass = "";

  let chatImage = getUserChatImageElement(otherChatUsers[0]);
  if (otherChatUsers.length > 1) {
    groupChatClass = "groupChatImage";
    chatImage += getUserChatImageElement(otherChatUsers[1]);
  }
  return `<div class="resultsImageContainer ${groupChatClass}">
    ${chatImage}
</div>`;
};

const getUserChatImageElement = (user) => {
  if (!user || !user.profilePic) {
    return alert("User is not valid");
  }
  return `<img src=${user.profilePic} alt="User's image">`;
};

const getLatestMessage = (latestMessage) => {
  if (latestMessage != null) {
    let sender = latestMessage.sender;
    return `${sender.firstName} ${sender.lastName}: ${latestMessage.content}`;
  }
  return "New Chat";
};
