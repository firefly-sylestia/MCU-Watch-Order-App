export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.OMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'OMDB API key is not configured' });

  const title = (req.query.title || '').toString().trim();
  const year = (req.query.year || '').toString().trim();
  if (!title) return res.status(400).json({ error: 'Missing title' });

  const params = new URLSearchParams({ apikey: key, t: title });
  if (year) params.set('y', year);

  const r = await fetch(`https://www.omdbapi.com/?${params.toString()}`);
  if (!r.ok) return res.status(r.status).json({ error: 'OMDB request failed' });

  const data = await r.json();
  if (data?.Response === 'False') {
    const error = data?.Error || 'OMDB request failed';
    const isRateLimited = /limit/i.test(error);
    return res.status(isRateLimited ? 429 : 502).json({ error });
  }

  return res.status(200).json({
    rating: data?.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : '',
    released: data?.Released && data.Released !== 'N/A' ? data.Released : '',
    source: 'omdb',
  });
}
