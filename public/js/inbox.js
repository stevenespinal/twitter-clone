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
