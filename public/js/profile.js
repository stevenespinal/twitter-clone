$(document).ready(() => {
  loadPosts();
});

const loadPosts = () => {
  $.get(
    `/api/posts`,
    { postedBy: profileUserId, isReply: selectedTab === "replies" },
    (results) => {
      outputPosts(results, $(".postContainer"));
      $(".loadingSpinnerContainer").remove();
      $(".profileHeaderContainer").css("visibility", "visible");
      $(".tabsContainer").css("visibility", "visible");
      $(".pinnedPostContainer").css("visibility", "visible");
      $(".postContainer").css("visibility", "visible");
    }
  );
  $.get(`/api/posts`, { postedBy: profileUserId, pinned: true }, (results) => {
    outputPinnedPost(results, $(".pinnedPostContainer"));
    $(".loadingSpinnerContainer").remove();
    $(".profileHeaderContainer").css("visibility", "visible");
    $(".tabsContainer").css("visibility", "visible");
    $(".pinnedPostContainer").css("visibility", "visible");
    $(".postContainer").css("visibility", "visible");
  });
};

const outputPinnedPost = (results, container) => {
  if (results.length === 0) {
    container.hide();
    return;
  }

  container.html("");

  results.forEach((result) => {
    let html = createPostHtml(result);
    container.append(html);
  });
};

// const loadReplies = () => {
//   $.get(
//     `/api/posts`,
//     { postedBy: profileUserId, isReply: true },
//     (results) => {
//       outputPosts(results, $(".postContainer"));
//     }
//   );
// };
