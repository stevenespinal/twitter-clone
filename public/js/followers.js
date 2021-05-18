$(document).ready(() => {
  //   loadPosts();
  if (selectedTab === "followers") {
    loadFollowers();
  } else {
    loadFollowing();
  }
});

const loadFollowers = () => {
  $.get(`/api/users/${profileUserId}/followers`, (results) => {
    outputUsers(results.followers, $(".resultsContainer"));
  });
};

const loadFollowing = () => {
  $.get(`/api/users/${profileUserId}/following`, (results) => {
    outputUsers(results.following, $(".resultsContainer"));
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