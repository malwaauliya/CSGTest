// assets/js/api.js
const API_BASE = 'https://jsonplaceholder.typicode.com';

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return await res.json();
}

export async function fetchComments(postId) {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
  return await res.json();
}
