$(document).ready(() => {
  $.get(`/api/posts`, (results) => {
    outputPosts(results, $(".postContainer"));
  });

  const outputPosts = (results, container) => {
    container.html = "";

    results.forEach((result) => {
      let html = createPostHtml(result);
      container.append(html);
    });

    if (!results) {
      container.append("<span class='noResults'>Nothing to show.</span>");
    }
  };
});
