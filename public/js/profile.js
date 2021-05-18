$(document).ready(() => {
  loadPosts();
});

const loadPosts = () => {
  $.get(
    `/api/posts`,
    { postedBy: profileUserId, isReply: selectedTab === "replies" },
    (results) => {
      outputPosts(results, $(".postContainer"));
    }
  );
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
