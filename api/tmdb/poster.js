export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ error: 'Missing server token' });

  const title = (req.query.title || '').toString().trim();
  const year = (req.query.year || '').toString().trim();
  if (!title) return res.status(400).json({ error: 'Missing title' });

  const params = new URLSearchParams({ query: title, include_adult: 'false', language: 'en-US', page: '1' });
  if (year) params.set('year', year);

  const r = await fetch(`https://api.themoviedb.org/3/search/multi?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
  });
  if (!r.ok) return res.status(r.status).json({ error: 'TMDB request failed' });
  const data = await r.json();
  const best = (data.results || []).find(i => i.poster_path && (i.media_type === 'movie' || i.media_type === 'tv'));
  if (!best?.poster_path) return res.status(404).json({ poster: null });

  return res.status(200).json({
    poster: `https://image.tmdb.org/t/p/w500${best.poster_path}`,
    backdrop: best.backdrop_path ? `https://image.tmdb.org/t/p/w780${best.backdrop_path}` : null,
    source: 'tmdb',
  });
}
