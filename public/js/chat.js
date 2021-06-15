$(document).ready(() => {
  $.get(`/api/chats/${chatId}`, (result) =>
    $("#chatName").text(getChatName(result))
  );
  $.get(`/api/chats/${chatId}/messages`, (result) => {
    let messages = [];
    let lastSenderId = "";
    result.forEach((msg, index) => {
      let html = createMessageHtml(msg, result[index + 1], lastSenderId);
      messages.push(html);
      lastSenderId = msg.sender._id;
    });
    let messagesHtml = messages.join("");
    addMessagesHtmlToPage(messagesHtml);
    scrollToBottom(false);
    $(".loadingSpinnerContainer").remove();
    $(".chatContainer").css("visibility", "visible");
  });
});

$("#chatNameButton").click((e) => {
  let name = $("#chatNameTextbox").val().trim();
  //   console.log(name);
  $.ajax({
    url: `/api/chats/${chatId}`,
    type: "PUT",
    data: { chatName: name },
    success: (data, status, xhr) => {
      if (xhr.status != 204) {
        alert("could not update chat name");
      } else {
        location.reload();
      }
    },
  });
});

$(".sendMessageButton").click(() => {
  messageSubmitted();
});

$(".inputTextbox").keydown((e) => {
  if (e.which === 13 && !e.shiftKey) {
    messageSubmitted();
    return false;
  }
});

const messageSubmitted = () => {
  //   console.log("Submitted.");
  let content = $(".inputTextbox").val().trim();

  if (content != "") {
    sendMessage(content);
    $(".inputTextbox").val("");
  }
};

const sendMessage = (content) => {
  $.post("/api/messages", { content, chatId }, (data, status, xhr) => {
    if (xhr.status !== 201) {
      alert("Could not send message. Please try again");
      $(".inputTextbox").val(content);
      return;
    }

    addChatMessageHtml(data);
  });
};

const addChatMessageHtml = (msg) => {
  if (!msg || !msg._id) {
    alert("Message is not valid");
  }
  let msgDiv = createMessageHtml(msg, null, "");
  addMessagesHtmlToPage(msgDiv);
  scrollToBottom(true);
};

const addMessagesHtmlToPage = (html) => {
  $(".chatMessages").append(html);
};

const createMessageHtml = (msg, nextMsg, lastSenderId) => {
  let sender = msg.sender;
  let senderName = `${sender.firstName} ${sender.lastName}`;

  let currentSenderId = sender._id;
  let nextSenderId = nextMsg != null ? nextMsg.sender._id : "";

  let isFirst = lastSenderId != currentSenderId;
  let isLast = nextSenderId != currentSenderId;

  let isMessageMine = msg.sender._id == userLoggedIn._id;
  let liClassName = isMessageMine ? "mine" : "theirs";

  let nameElem = "";
  let imageContainer = "";

  if (isFirst) {
    liClassName += " first";
    if (!isMessageMine) {
      nameElem = `<span class=senderName>${senderName}</span>`;
    }
  }

  let profileImage = "";
  if (isLast) {
    liClassName += " last";
    profileImage = `<img src=${sender.profilePic} alt="User's profile picture">`;
  }

  if (!isMessageMine) {
    imageContainer = `<div class="imageContainer">
    ${profileImage}
    </div>`;
  }

  return `<li class="message ${liClassName}">
    ${imageContainer}
    <div class="messageContainer">
        ${nameElem}
        <span class="messageBody">${msg.content}</span>
    </div>
  </li>`;
};

const scrollToBottom = (animated) => {
  let container = $(".chatMessages");
  let scrollHeight = container[0].scrollHeight;
  if (animated) {
    container.animate({ scrollTop: scrollHeight }, "slow");
  } else {
    container.scrollTop(scrollHeight);
  }
};
