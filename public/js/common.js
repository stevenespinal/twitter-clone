$("#postTextarea, #replyTextarea").keyup((e) => {
  let textbox = $(e.target);
  let value = textbox.val().trim();

  let isModal = textbox.parents(".modal").length === 1;

  let submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

  if (submitButton.length == 0) {
    return alert("No submit button found");
  }

  if (value === "") {
    submitButton.prop("disabled", true);
    return;
  }
  submitButton.prop("disabled", false);
});

$("#submitPostButton").click((e) => {
  console.log("clicked");
  let button = $(e.target);
  let textbox = $("#postTextarea");

  const data = {
    content: textbox.val(),
  };

  $.post(`/api/posts`, data, (postData) => {
    console.log(postData);
    let html = createPostHtml(postData);

    $(".postContainer").prepend(html);
    textbox.val("");
    button.prop("disabled", true);
  });
});

$(document).on("click", ".likeButton", (e) => {
  let button = $(e.target);
  let postId = getPostIdFromElement(button);
  console.log(postId);

  if (postId === undefined) return;
  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (postData) => {
      button.find("span").text(postData.likes.length || "");

      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});

$(document).on("click", ".retweetButton", (e) => {
  let button = $(e.target);
  let postId = getPostIdFromElement(button);
  console.log(postId);

  if (postId === undefined) return;
  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (postData) => {
      // console.log(postData);
      button.find("span").text(postData.retweetUsers.length || "");

      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});

const getPostIdFromElement = (element) => {
  let isRoot = element.hasClass("post");
  let rootElement = isRoot ? element : element.closest(".post");
  let postId = rootElement.data().id;

  if (postId === undefined) return alert("Post Id does not exist");
  return postId;
};

const createPostHtml = (postData) => {
  if (postData === null) return alert("Post object is null");

  const { createdAt, retweetData } = postData;

  var postedBy = postData.postedBy;

  const timestamp = timeDifference(new Date(), new Date(createdAt));

  let isRetweet = retweetData !== undefined;
  let retweetedBy = isRetweet ? postData.postedBy.username : null;

  postData = isRetweet ? postData.retweetData : postData;

  if (postedBy._id === undefined) {
    return console.log("User object not populated");
  }

  let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? "active"
    : "";

  let retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedIn._id
  )
    ? "active"
    : "";

  let retweetText = "";

  if (isRetweet) {
    retweetText = `<span> <i class="fas fa-retweet"></i> Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a></span>`;
  }
  return `
  <div class="post" data-id='${postData._id}'>
    <div class="postActionContainer">
    ${retweetText}
    </div>
    <div class="mainContentContainer">
        <div class="userImageContainer">
            <img src=${postedBy.profilePic} alt="Profile pic">
        </div>  
        <div class="postContentContainer">
            <div class="header">
                <a class="displayName" href="/profile/${postedBy.username}">${
    postedBy.firstName
  } ${postedBy.lastName}</a>
                <span class="username">@${postedBy.username}</span>
                <span class="date">${timestamp}</span>
            </div>  
            <div class="postBody">
                <span>${postData.content}</span>
            </div>  
            <div class="postFooter">
                <div class="postButtonContainer">
                    <button data-toggle='modal' data-target='#replyModal'>
                        <i class="far fa-comment"></i>
                    </button>
                </div>  
                <div class="postButtonContainer green">
                    <button class="retweetButton ${retweetButtonActiveClass}">
                        <i class="fas fa-retweet"></i>
                        <span>${postData.retweetUsers.length || ""}</span>

                    </button>
                </div>  
                <div class="postButtonContainer red">
                    <button class="likeButton ${likeButtonActiveClass}">
                        <i class="far fa-heart"></i>
                        <span>${postData.likes.length || ""}</span>
                    </button>
                </div>  
            </div>  
        </div>  
    </div>  
  </div>  
  `;
};

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Just now";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}
