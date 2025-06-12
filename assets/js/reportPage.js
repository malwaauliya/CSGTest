import { fetchPosts } from './api.js';
import { containsRerum } from './utils.js';

const rerumCountElement = document.getElementById('rerumCount');
const userPostTableBody = document.getElementById('userPostTableBody');

async function init() {
  try {
    const posts = await fetchPosts();

    // Hitung post dengan kata 'rerum'
    const rerumCount = posts.filter(post => containsRerum(post.body)).length;
    rerumCountElement.textContent = rerumCount;

    // Hitung jumlah post per user
    const userCounts = {};
    posts.forEach(post => {
      userCounts[post.userId] = (userCounts[post.userId] || 0) + 1;
    });

    userPostTableBody.innerHTML = '';
    Object.entries(userCounts).forEach(([userId, count]) => {
      const tr = document.createElement('tr');
      tr.className = 'bg-white';
      tr.innerHTML = `
        <td>${userId}</td>
        <td>${count}</td>
      `;
      userPostTableBody.appendChild(tr);
    });
  } catch (err) {
    rerumCountElement.textContent = 'Failed to load data.';
    userPostTableBody.innerHTML = '<tr><td colspan="2" class="text-red-600 p-4">Failed to load user posts.</td></tr>';
  }
}

init();
