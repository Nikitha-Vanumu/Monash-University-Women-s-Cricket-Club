const BASE_URL = 'https://api.playhq.com';
const TENANT   = 'cricket-australia';
const API_KEY  = '22ec03c8-5168-49e7-9a7a-cfb2d4bac383';

// Current-season team IDs for MUWCC women's sides
const WOMEN_TEAMS = [
  { id: 'b5ef3909', label: "CV Women's Community Cricket" },
  { id: 'feab48ee', label: "Cricket Southern Bayside Women's" },
];

const HEADERS = { 'x-phq-tenant': TENANT, 'x-api-key': API_KEY };

exports.handler = async function () {
  const allResults = [];
  const debug = [];

  for (const { id: teamId, label } of WOMEN_TEAMS) {
    try {
      // Step 1 — get team info to discover the competition ID
      const teamRes  = await fetch(`${BASE_URL}/v1/teams/${teamId}`, { headers: HEADERS });
      const teamText = await teamRes.text();

      if (!teamRes.ok) {
        debug.push({ teamId, step: 'team', status: teamRes.status, body: teamText.slice(0, 200) });
        continue;
      }

      const teamData = JSON.parse(teamText);
      const d = teamData.data || {};
      debug.push({ teamId, step: 'team', topKeys: Object.keys(d) });

      // Try multiple paths where the competition ID might live
      const competitionId =
        d.competition?.id ||
        d.grade?.competition?.id ||
        d.season?.competition?.id ||
        d.competitionId;

      if (!competitionId) {
        debug.push({ teamId, error: 'competitionId not found', data: d });
        continue;
      }

      // Step 2 — fetch all results for that competition
      const resultsRes  = await fetch(`${BASE_URL}/v1/competitions/${competitionId}/results`, { headers: HEADERS });
      const resultsText = await resultsRes.text();

      if (!resultsRes.ok) {
        debug.push({ teamId, competitionId, step: 'results', status: resultsRes.status, body: resultsText.slice(0, 300) });
        continue;
      }

      const resultsData = JSON.parse(resultsText);
      const fixtures    = resultsData.data || [];
      debug.push({ teamId, competitionId, step: 'results', total: fixtures.length });

      // Filter to only MUWCC games
      const myGames = fixtures.filter(f =>
        f.homeTeam?.id === teamId || f.awayTeam?.id === teamId
      );

      allResults.push(...myGames.map(f => ({ ...f, _teamId: teamId, _label: label })));
    } catch (err) {
      debug.push({ teamId, error: err.message });
    }
  }

  // Most recent first
  allResults.sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
    body: JSON.stringify({ data: allResults, debug }),
  };
};
