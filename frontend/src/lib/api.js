const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || '';

export async function getMetadata() {
  const r = await fetch(`${API_BASE}/api/metadata`);
  if (!r.ok) throw new Error(`Metadata failed: ${r.status}`);
  return r.json();
}

export async function postSimulate(body) {
  const r = await fetch(`${API_BASE}/api/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(text || `Simulate failed: ${r.status}`);
  }
  return r.json();
}
