
 // ชั้นกลางสำหรับคุยกับ Backend
const BASE = process.env.REACT_APP_API_URL || 'https://week6-lab-xzfk.onrender.com';

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json()
    .catch(() => ({ error: 'server ไม่ได้ตอบเป็น JSON' }));

  if (!res.ok) {
    const err = new Error(
      data.error?.message ?? data.error ?? `server ตอบกลับ ${res.status}`
    );
    err.status = res.status;
    throw err;
  }

  return data;
}

// ---------- สมาชิก ----------
export function register(email, password, displayName) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, password, displayName },
  });
}

export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getMe(token) {
  return apiFetch('/api/me', { token });
}

// ---------- รีวิว ----------
export function getReviews(movieId) {
  return apiFetch(`/api/movies/${movieId}/reviews`);
}

export function postReview(movieId, text, token) {
  return apiFetch(`/api/movies/${movieId}/reviews`, {
    method: 'POST',
    body: { text },
    token,
  });
}

// ---------- คะแนน ----------
export function putVote(movieId, score, token) {
  return apiFetch(`/api/movies/${movieId}/vote`, {
    method: 'PUT',
    body: { score },
    token,
  });
}

// ---------- Wishlist ----------
export function getWishlist(token) {
  return apiFetch('/api/me/wishlist', { token });
}

export function addToWishlist(movieId, token) {
  return apiFetch(`/api/me/wishlist/${movieId}`, {
    method: 'PUT',
    token,
  });
}

export function removeFromWishlist(movieId, token) {
  return apiFetch(`/api/me/wishlist/${movieId}`, {
    method: 'DELETE',
    token,
  });
}

// ---------- หนัง ----------
export async function getMovies() {
  const data = await apiFetch('/api/movies');
  return data.items;
}

export async function getMovie(movieId) {
  const items = await getMovies();
  const movie = items.find(m => String(m.id) === String(movieId));

  if (!movie) {
    const err = new Error('ไม่พบหนังเรื่องนี้');
    err.status = 404;
    throw err;
  }

  return movie;
}

// ---------- แนวหนัง ----------
export async function getGenres() {
  const data = await apiFetch('/api/genres');
  return data.items;
}

// ---------- หลังบ้าน ----------
export function getAdminStats(token) {
  return apiFetch('/api/admin/stats', { token });
}

export async function getAdminMembers(token) {
  const data = await apiFetch('/api/admin/members', { token });
  return data.items;
}

export function setMemberRole(memberId, role, token) {
  return apiFetch(`/api/admin/members/${memberId}/role`, {
    method: 'PUT',
    body: { role },
    token,
  });
}

export function getAdminMovie(movieId, token) {
  return apiFetch(`/api/admin/movies/${movieId}`, { token });
}

export function createMovie(fields, token) {
  return apiFetch('/api/admin/movies', {
    method: 'POST',
    body: fields,
    token,
  });
}

export function updateMovie(movieId, fields, token) {
  return apiFetch(`/api/admin/movies/${movieId}`, {
    method: 'PUT',
    body: fields,
    token,
  });
}

export function deleteMovie(movieId, token) {
  return apiFetch(`/api/admin/movies/${movieId}`, {
    method: 'DELETE',
    token,
  });
}
