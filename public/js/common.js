var cropper;
let timer;
let selectedUsers = [];

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

$("#submitPostButton, #submitReplyButton").click((e) => {
  // console.log("clicked");
  let button = $(e.target);
  let isModal = button.parents(".modal").length === 1;
  let textbox = isModal ? $("#replyTextarea") : $("#postTextarea");

  let data = {
    content: textbox.val(),
  };

  if (isModal) {
    let id = button.data().id;
    data.replyTo = id;
  }

  $.post(`/api/posts`, data, (postData) => {
    if (data.replyTo) {
      location.reload();
    } else {
      // console.log(postData);
      let html = createPostHtml(postData);

      $(".postContainer").prepend(html);
      textbox.val("");
      button.prop("disabled", true);
    }
  });
});

$("#replyModal").on("show.bs.modal", (e) => {
  let button = $(e.relatedTarget);
  let postId = getPostIdFromElement(button);

  $("#submitReplyButton").data("id", postId);

  $.get(`/api/posts/${postId}`, (results) => {
    console.log(results);
    outputPosts(results.postData, $("#originalPostContainer"));
  });
});

$("#replyModal").on("hidden.bs.modal", () =>
  $("#originalPostContainer").html("")
);

$("#deletePostModal").on("show.bs.modal", (e) => {
  let button = $(e.relatedTarget);
  let postId = getPostIdFromElement(button);

  $("#deletePostButton").data("id", postId);
  console.log($("#deletePostButton").data());
});

$("#deletePostButton").click((e) => {
  let id = $(e.target).data("id");
  $.ajax({
    url: `/api/posts/${id}`,
    type: "DELETE",
    success: () => {
      location.href = "/";
    },
  });
});

$("#confirmPinPostModal").on("show.bs.modal", (e) => {
  let button = $(e.relatedTarget);
  let postId = getPostIdFromElement(button);

  $("#pinPostButton").data("id", postId);
  // console.log($("#deletePostButton").data());
});

$("#pinPostButton").click((e) => {
  let id = $(e.target).data("id");
  $.ajax({
    url: `/api/posts/${id}`,
    type: "PUT",
    data: { pinned: true },
    success: () => {
      location.href = "/";
    },
  });
});

$("#unpinModal").on("show.bs.modal", (e) => {
  let button = $(e.relatedTarget);
  let postId = getPostIdFromElement(button);

  $("#unpinPostButton").data("id", postId);
  // console.log($("#deletePostButton").data());
});

$("#unpinPostButton").click((e) => {
  let id = $(e.target).data("id");
  $.ajax({
    url: `/api/posts/${id}`,
    type: "PUT",
    data: { pinned: false },
    success: () => {
      location.href = "/";
    },
  });
});

$("#filePhoto").change(function () {
  // let input = $(event.target);
  // console.log(input);
  if (this.files && this.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log("loaded");
      // console.log(input[0].files, input[0].files[0]);
      let image = document.getElementById("imagePreview");
      image.src = e.target.result;
      // $("#imagePreview").attr("src", e.target.result);

      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(image, { aspectRatio: 1 / 1, background: false });
    };

    reader.readAsDataURL(this.files[0]);
  }
});

$("#coverPhoto").change(function () {
  // let input = $(event.target);
  // console.log(input);
  if (this.files && this.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log("loaded");
      // console.log(input[0].files, input[0].files[0]);
      let image = document.getElementById("coverPhotoPreview");
      image.src = e.target.result;
      // $("#imagePreview").attr("src", e.target.result);

      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(image, { aspectRatio: 16 / 9, background: false });
    };

    reader.readAsDataURL(this.files[0]);
  }
});

$("#imageUploadButton").click(() => {
  let canvas = cropper.getCroppedCanvas();
  // console.log(canvas);
  if (!canvas) {
    alert("Could not upload image, make sure it is an image file");
    return;
  }
  canvas.toBlob((blob) => {
    let formData = new FormData();
    formData.append("croppedImage", blob);

    $.ajax({
      url: `/api/users/profilePicture`,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: () => location.reload(),
    });
  });
});

$("#coverPhotoUploadButton").click(() => {
  let canvas = cropper.getCroppedCanvas();
  // console.log(canvas);
  if (!canvas) {
    alert("Could not upload image, make sure it is an image file");
    return;
  }
  canvas.toBlob((blob) => {
    let formData = new FormData();
    formData.append("croppedImage", blob);

    $.ajax({
      url: `/api/users/coverPhoto`,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: () => location.reload(),
    });
  });
});

$("#createChatButton").click(() => {
  let data = JSON.stringify(selectedUsers);
  $.post(`/api/chats`, { users: data }, (chat) => {
    if (!chat || !chat._id) {
      return alert("Invalid response");
    }
    window.location.href = `/messages/${chat._id}`;
  });
});

$("#userSearchTextBox").keydown((event) => {
  clearTimeout(timer);
  let textbox = $(event.target);
  let value = textbox.val();

  if (value == "" && (event.which === 8 || event.keyCode === 8)) {
    selectedUsers.pop();
    updateSelectedUsersHtml();
    $(".resultsContainer").html("");
    if (selectedUsers.length === 0) {
      $("#createChatButton").prop("disabled", true);
    }
    // return;
  }

  timer = setTimeout(() => {
    value = textbox.val().trim();
    if (value === "") {
      $(".resultsContainer").html("");
    } else {
      searchUsers(value);
    }
  }, 1000);
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
  // console.log(postId);

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

$(document).on("click", ".post", (e) => {
  let elem = $(e.target);
  let postId = getPostIdFromElement(elem);
  // console.log(postId);

  if (postId !== undefined && !elem.is("button")) {
    window.location.href = `/post/${postId}`;
  }
});

$(document).on("click", ".followButton", (e) => {
  let button = $(e.target);
  let userId = button.data().user;
  $.ajax({
    url: `/api/users/${userId}/follow`,
    type: "PUT",
    success: (data, status, xhr) => {
      if (xhr.status === 404) {
        return;
      }

      let difference = 1;
      if (data.following && data.following.includes(userId)) {
        button.addClass("following");
        button.text("Following");
      } else {
        button.removeClass("following");
        button.text("Follow");
        difference = -1;
      }

      let followersLabel = $("#followersValue");

      if (followersLabel.length !== 0) {
        let followersText = followersLabel.text();
        followersLabel.text(parseInt(followersText) + difference);
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

const createPostHtml = (postData, largeFont = false) => {
  if (postData === null) return alert("Post object is null");

  var postedBy = postData.postedBy;

  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  let isRetweet = postData.retweetData !== undefined;
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

  let largeFontClass = largeFont ? "largeFont" : "";
  let retweetText = "";

  if (isRetweet) {
    retweetText = `<span> <i class="fas fa-retweet"></i> Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a></span>`;
  }

  let replyFlag = "";

  if (postData.replyTo && postData.replyTo._id) {
    if (!postData.replyTo._id) return alert("ReplyTo has not been populated");
    if (!postData.replyTo.postedBy._id)
      return alert("PostedBy has not been populated");
    let { username } = postData.replyTo.postedBy;
    replyFlag = `<div class="replyFlag">
      Replying to <a href='/profile/${username}'>@${username}</a>
    </div>`;
  }

  let buttons = "";
  let pinnedPostText = "";

  if (postData.postedBy._id === userLoggedIn._id) {
    let pinnedClass = "";

    let dataTarget = "#confirmPinPostModal";
    if (postData.pinned) {
      pinnedClass = "active";
      dataTarget = "#unpinModal";
      pinnedPostText = `<i class="fas fa-thumbtack"></i> <span>Pinned Post</span>`;
    }
    buttons = `
    <button class='pinButton ${pinnedClass}' data-id="${postData._id}" data-toggle="modal" data-target="${dataTarget}"><i class="fas fa-thumbtack"></i></button>
    <button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>`;
  }

  return `
  <div class="post ${largeFontClass}" data-id='${postData._id}'>
    <div class="postActionContainer">
    ${retweetText}
    </div>
    <div class="mainContentContainer">
        <div class="userImageContainer">
            <img src=${postedBy.profilePic} alt="Profile pic">
        </div>  
        <div class="postContentContainer">
            <div class='pinnedPostText'>${pinnedPostText}</div>
            <div class="header">
                <a class="displayName" href="/profile/${postedBy.username}">${
    postedBy.firstName
  } ${postedBy.lastName}</a>
                <span class="username">@${postedBy.username}</span>
                <span class="date">${timestamp}</span>
                ${buttons}
            </div>  
            ${replyFlag}
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

const outputPosts = (results, container) => {
  container.html("");

  if (!Array.isArray(results)) {
    results = [results];
  }

  results.forEach((result) => {
    let html = createPostHtml(result);
    container.append(html);
  });

  if (results.length === 0) {
    container.append("<span class='noResults'>Nothing to show.</span>");
  }
};

const outputPostsWithReplies = (results, container) => {
  container.html("");

  if (results.replyTo !== undefined && results.replyTo._id !== undefined) {
    let html = createPostHtml(results.replyTo);
    container.append(html);
  }

  let mainPostHtml = createPostHtml(results.postData, true);
  container.append(mainPostHtml);

  results.replies.forEach((result) => {
    let html = createPostHtml(result);
    container.append(html);
  });
};

const outputUsers = (results, container) => {
  container.html("");
  results.forEach((res) => {
    // console.log(res.firstName);
    let html = createUserHtml(res, true);
    container.append(html);
  });

  if (results.length === 0) {
    container.append(`<span class='noResults'>No results found</span>`);
  }
};

const outputSelectableUsers = (results, container) => {
  container.html("");
  results.forEach((res) => {
    if (
      res._id === userLoggedIn._id ||
      selectedUsers.some((user) => user._id === res._id)
    ) {
      return;
    }
    let html = createUserHtml(res, false);
    let elem = $(html);
    elem.click(() => userSelected(res));
    container.append(elem);
  });

  if (results.length === 0) {
    container.append(`<span class='noResults'>No results found</span>`);
  }
};

const createUserHtml = (userData, showFollowButton) => {
  let followButton = "";
  let isFollowing =
    userLoggedIn.following && userLoggedIn.following.includes(userData._id);
  let text = isFollowing ? "Following" : "Follow";
  let buttonClass = isFollowing ? "followButton following" : "followButton";
  if (showFollowButton && userLoggedIn._id != userData._id) {
    followButton = `<div class='followButtonContainer'>
        <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
      </div>`;
  }

  return `
        <div class='user'>
            <div class='userImageContainer'>
                <img src='${userData.profilePic}'>
            </div>
            <div class='userDetailsContainer'>
                <div class='header'>
                    <a href='/profile/${userData.username}'>${userData.firstName} ${userData.lastName}</a>
                    <span class='username'>@${userData.username}</span>
                </div>
            </div>
            ${followButton}
        </div>
    `;
};

const searchUsers = (search) => {
  $.get(`/api/users`, { search }, (results) => {
    outputSelectableUsers(results, $(".resultsContainer"));
  });
};

const userSelected = (res) => {
  selectedUsers.push(res);
  updateSelectedUsersHtml();
  $("#userSearchTextBox").val("").focus();
  $(".resultsContainer").html("");
  $("#createChatButton").prop("disabled", false);
};

const updateSelectedUsersHtml = () => {
  let elems = [];
  selectedUsers.forEach((user) => {
    let name = `${user.firstName} ${user.lastName}`;
    let userElem = $(`<span class="selectedUser">${name}</span>`);
    elems.push(userElem);
  });
  $(".selectedUser").remove();
  $("#selectedUsers").prepend(elems);
};
