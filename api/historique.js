const URL  = process.env.SUPABASE_URL;
const KEY  = process.env.SUPABASE_SERVICE_KEY;

const headers = () => ({
  'apikey': KEY,
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const r = await fetch(`${URL}/rest/v1/historique?order=analysed_at.desc&limit=100`, { headers: headers() });
    return res.json(await r.json());
  }

  if (req.method === 'POST') {
    const r = await fetch(`${URL}/rest/v1/historique`, {
      method: 'POST', headers: headers(), body: JSON.stringify(req.body)
    });
    return res.status(201).json(await r.json());
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (id === 'all') {
      await fetch(`${URL}/rest/v1/historique?id=neq.null`, {
        method: 'DELETE', headers: headers()
      });
    } else {
      await fetch(`${URL}/rest/v1/historique?id=eq.${id}`, {
        method: 'DELETE', headers: headers()
      });
    }
    return res.status(204).end();
  }

  res.status(405).end();
}
