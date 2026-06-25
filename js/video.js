// ════════════════════════════════════════════════════════════════════════════
// VIDEO — YouTube preview thumbnails + in-app player modal.
// No API key needed; uses youtube-nocookie embed. Falls back to a YouTube
// search link when no/invalid video id is set.
// ════════════════════════════════════════════════════════════════════════════

// Accepts a raw YouTube id OR a full URL and returns the 11-char video id.
export function parseYouTubeId(input) {
  if (!input) return '';
  const s = String(input).trim();
  // Already an id
  if (/^[\w-]{11}$/.test(s)) return s;
  // Try to extract from common URL formats
  const m = s.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/shorts\/)([\w-]{11})/);
  return m ? m[1] : '';
}

export function thumbUrl(videoId) {
  const id = parseYouTubeId(videoId);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

export function searchUrl(name) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent('come fare ' + name + ' esercizio')}`;
}

let onCloseCb = null;

// Open the player modal. If the id is missing/invalid, offer a search link.
export function openVideo(videoId, name, onClose) {
  onCloseCb = onClose || null;
  const id = parseYouTubeId(videoId);
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  const title = document.getElementById('videoTitle');
  const fallback = document.getElementById('videoFallback');
  title.textContent = name || 'Esempio esercizio';

  if (id) {
    frame.style.display = '';
    fallback.style.display = 'none';
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
  } else {
    frame.style.display = 'none';
    fallback.style.display = '';
    fallback.querySelector('a').href = searchUrl(name || '');
  }
  modal.classList.add('open');
}

export function closeVideo() {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  frame.src = '';                 // stop playback
  modal.classList.remove('open');
  if (onCloseCb) { const cb = onCloseCb; onCloseCb = null; cb(); }
}

// A reusable thumbnail element (button) that opens the player when tapped.
export function thumbnailButton(videoId, name, { small = false } = {}) {
  const id = parseYouTubeId(videoId);
  const cls = small ? 'vthumb vthumb-sm' : 'vthumb';
  if (id) {
    return `<button class="${cls}" data-video="${id}" data-name="${escapeAttr(name)}" type="button">
      <img src="${thumbUrl(id)}" alt="" loading="lazy" onerror="this.style.display='none';this.parentNode.classList.add('vthumb-noimg')">
      <span class="vthumb-play">▶</span>
    </button>`;
  }
  return `<button class="${cls} vthumb-noimg" data-video="" data-name="${escapeAttr(name)}" type="button">
    <span class="vthumb-play">▶</span>
  </button>`;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// Delegate clicks on any .vthumb to open the player.
export function initVideoDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.vthumb');
    if (!btn) return;
    e.preventDefault();
    openVideo(btn.dataset.video, btn.dataset.name);
  });
  document.getElementById('videoClose').addEventListener('click', closeVideo);
  document.getElementById('videoModal').addEventListener('click', (e) => {
    if (e.target.id === 'videoModal') closeVideo();
  });
}
