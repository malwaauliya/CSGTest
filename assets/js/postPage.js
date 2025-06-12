import { fetchPosts, fetchComments } from './api.js';
import { renderPostRow, renderCommentRow, escapeHTML } from './utils.js';

const searchInput = document.getElementById('searchInput');
const postTableBody = document.getElementById('postTableBody');
const pagination = document.getElementById('pagination');

let posts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 10;

function displayPosts() {
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pageData = filteredPosts.slice(start, end);

  postTableBody.innerHTML = '';
  pageData.forEach(post => {
    const row = renderPostRow(post, onCommentsClick);
    const commentRow = renderCommentRow(post);
    postTableBody.appendChild(row);
    postTableBody.appendChild(commentRow);
  });
}

function renderPagination() {
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);
  pagination.innerHTML = '';

  const createButton = (text, page) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = `px-4 py-2 border rounded ${page === currentPage ? 'border-blueme-400 bg-blueme-400 text-white' : 'bg-white text-black hover:bg-gray-100'}`;
    btn.onclick = () => {
      currentPage = page;
      displayPosts();
      renderPagination();
    };
    return btn;
  };

  if (currentPage > 1) {
    pagination.appendChild(createButton('Previous', currentPage - 1));
  }

  for (let i = 1; i <= pageCount; i++) {
    pagination.appendChild(createButton(i, i));
  }

  if (currentPage < pageCount) {
    pagination.appendChild(createButton('Next', currentPage + 1));
  }
}

async function onCommentsClick(postId) {
  const commentButton = document.getElementById(`show-comment-${postId}`);
  const commentLabel = commentButton.querySelector(".comment-label");

  if (commentLabel.textContent === 'View Comments') {
    showComments(postId);
    commentLabel.textContent = 'Hide Comments';
  } else {
    hideComments(postId);
    commentLabel.textContent = 'View Comments';
  }
}

async function hideComments(postId) {
  const commentSection = document.getElementById(`comment-section-${postId}`);
  const commentsList = commentSection.querySelector("td");
  commentSection.classList.add('collapse');
  commentsList.innerHTML = '';
}
async function showComments(postId) {
  const commentSection = document.getElementById(`comment-section-${postId}`);
  const commentsList = commentSection.querySelector("td");
  commentSection.classList.remove('collapse');
  commentsList.innerHTML = `
    <div>
      <h2 class="text-xl font-semibold mb-3">Comments</h2>
      <div class="box-list-comments pl-4 border-l-4 border-greenme space-y-2">
        <div class="bg-white p-3 rounded shadow-sm">Loading comments...</div>
      </div>
    </div>
  `

  try {
    const comments = await fetchComments(postId);
    const boxListComment = commentsList.querySelector('.box-list-comments');
    boxListComment.innerHTML = '';
    comments.forEach(comment => {
      const newComment = document.createElement('div');
      newComment.innerHTML = `
        <div class="bg-white p-3 rounded shadow-sm">
          <p class="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <span class="material-icons text-greenme text-base">person</span>
            ${escapeHTML(comment.name)}
          </p>
          <p class="text-xs text-gray-500 mb-2">${escapeHTML(comment.email)}</p>
          <p class="text-sm text-gray-700 leading-relaxed">${escapeHTML(comment.body)}</p>
        </div>
      `
      boxListComment.appendChild(newComment);
    });
  } catch (err) {
    boxListComment.innerHTML = '<div class="bg-white p-3 rounded shadow-sm">Failed to load comments.</div>';
  }
}

function handleSearchInput() {
  const keyword = searchInput.value.toLowerCase();
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(keyword) || p.body.toLowerCase().includes(keyword)
  );
  filteredPosts = [...filtered];
  displayPosts();
  renderPagination();
}

async function init() {
  try {
    posts = await fetchPosts();
    filteredPosts = [...posts];
    displayPosts();
    renderPagination();
  } catch (err) {
    postTableBody.innerHTML = '<tr class="bg-white"><td colspan="4" class="text-red-600 p-4 !text-center">Failed to load posts.</td></tr>';
  }
}

searchInput.addEventListener('input', handleSearchInput);

init();
