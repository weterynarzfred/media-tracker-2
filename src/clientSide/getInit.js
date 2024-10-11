export default async function getInit() {
  // get initial entries from the api
  const entriesResponse = await fetch('/api/entries', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error('error while fetching entries');
  });

  const optionHintsResponse = await fetch('/api/optionHints', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error('error while fetching option hints');
  });

  return {
    entries: entriesResponse.entries,
    optionHints: optionHintsResponse,
  };
}
