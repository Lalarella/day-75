const loadCommentsBtnelement = document.getElementById('load-comments-btn');

async function fetchCommentsForPost() {
    const postId = loadCommentsBtnelement.dataset.postid;
    console.log("fetch",postId)
    const response = await fetch(`/comment/${postId}/comments`);
    response.json
    const responseData = await response.json();
}
loadCommentsBtnelement.addEventListener('click', fetchCommentsForPost);