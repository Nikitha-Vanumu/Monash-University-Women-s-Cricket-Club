const BASE_URL  = 'https://api.playhq.com';
const TENANT    = 'cricket-australia';
const API_KEY   = '22ec03c8-5168-49e7-9a7a-cfb2d4bac383';

// Women's team IDs — add newer seasons at the top
const WOMEN_TEAMS = [
  'b5ef3909', // CV Women's Community Cricket Competition Summer 2025/26
  'feab48ee', // Cricket Southern Bayside Women's Summer 2025/26
  'c716f06c', // CV Women's Community Cricket 2024/25
  'c40b778a', // CV Women's Community Cricket 2023/24
];

exports.handler = async function () {
  const errors = [];

  for (const teamId of WOMEN_TEAMS) {
    try {
      const res = await fetch(`${BASE_URL}/v1/teams/${teamId}/fixture`, {
        headers: {
          'x-phq-tenant': TENANT,
          'x-api-key': API_KEY,
        },
      });
      const text = await res.text();
      if (!res.ok) {
        errors.push({ teamId, status: res.status, body: text.slice(0, 300) });
        continue;
      }
      const data = JSON.parse(text);
      if (data.data?.length) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(data),
        };
      }
      errors.push({ teamId, status: res.status, body: 'empty data array' });
    } catch (e) {
      errors.push({ teamId, error: e.message });
    }
  }

  return {
    statusCode: 502,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'No fixtures found', details: errors }),
  };
};
