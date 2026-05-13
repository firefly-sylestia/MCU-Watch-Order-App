export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.TMDB_READ_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NWVkYTQ4Y2Y1ODAzZjIyMzA0ZmQyMWY0ZjA2YTM1ZSIsIm5iZiI6MTc3ODY4NTg2My42ODcsInN1YiI6IjZhMDQ5N2E3N2IyZDk3NzQ2MDM3N2E1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XTD8e-B7awrTVIJd5WtD3vZ5FnWjE8sWkSjgYIeauAA';

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

  const details = req.query.details === '1' ? {
    Plot: best.overview || 'N/A',
    Year: (best.release_date || best.first_air_date || '').slice(0,4) || 'N/A',
    imdbRating: best.vote_average ? Number(best.vote_average).toFixed(1) : 'N/A',
    Actors: 'TMDB cast lookup not enabled',
  } : null;

  return res.status(200).json({
    poster: `https://image.tmdb.org/t/p/w500${best.poster_path}`,
    backdrop: best.backdrop_path ? `https://image.tmdb.org/t/p/w780${best.backdrop_path}` : null,
    source: 'tmdb',
    details,
  });
}
