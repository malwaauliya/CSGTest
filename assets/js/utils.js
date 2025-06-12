// Fungsi untuk menyorot baris jika mengandung kata 'rerum'
export function containsRerum(text) {
  return text.toLowerCase().includes('rerum');
}

// Escape HTML untuk mencegah XSS
export function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return escape[match];
  });
}

// Fungsi render satu baris post ke dalam tabel
export function renderPostRow(post, onCommentClick) {
  const highlightClass = containsRerum(post.body) ? 'bg-orange-100' : '';
  const tr = document.createElement('tr');
  tr.className = highlightClass || 'bg-white';

  tr.innerHTML = `
    <td>${escapeHTML(post.id.toString())}</td>
    <td>${escapeHTML(post.title)}</td>
    <td>${escapeHTML(post.body)}</td>
    <td>
      <button id="show-comment-${post.id}" class="py-1 px-2 leading-4 text-sm bg-blueme-200 rounded comment-btn" data-id="${post.id}">
        <span class="material-icons text-sm align-middle">comment</span> 
        <span class="comment-label">View Comments</span>
      </button>
    </td>
  `;

  const btn = tr.querySelector('.comment-btn');
  btn.addEventListener('click', () => onCommentClick(post.id));

  return tr;
}

// Fungsi render satu baris tambahan untuk view comment post ke dalam tabel
export function renderCommentRow(post,) {
  const tr = document.createElement('tr');
  tr.className = `!border-0 bg-gray-50 collapse`;
  tr.innerHTML = `<td colspan="4" class="p-4 border-t border-gray-200 text-sm text-gray-700"></td>`;
  tr.setAttribute("id", `comment-section-${post.id}`);

  return tr;
}
