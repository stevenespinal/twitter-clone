$(document).ready(() => {
  $.get(`/api/chats`, (data, status, xhr) => {
    if (xhr.status === 400) {
      alert("Could not retrieve chat list.");
    } else {
      outputChatList(data, $(".resultsContainer"));
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
  let image = "";
  let latestMessage = "Testing";

  return `<a href="/messages/${chat._id}" class="resultListItem">
    <div class="resultDetailsContainer">
        <span class="heading">${chatName}</span>
        <span class="subText">${latestMessage}</span>
    </div>
  </a>`;
};

const getChatName = (chat) => {
  let chatName = chat.chatName;
  if (!chatName) {
    let otherChatUsers = getOtherChatUsers(chat.users);
    let namesArray = otherChatUsers.map(
      (user) => `${user.firstName} ${user.lastName}`
    );
    chatName = namesArray.join(", ");
  }
  return chatName;
};

const getOtherChatUsers = (users) => {
  if (users.length === 1) {
    return users;
  }
  return users.filter((user) => user._id !== userLoggedIn._id);
};
