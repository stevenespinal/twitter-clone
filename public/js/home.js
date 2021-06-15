$(document).ready(() => {
  $.get(`/api/posts`, { followingOnly: true }, (results) => {
    outputPosts(results, $(".postContainer"));
    $(".loadingSpinnerContainer").remove();
    $(".postContainer").css("visibility", "visible");
  });
});
