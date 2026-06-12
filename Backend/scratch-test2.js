const fs = require('fs');
const lines = fs.readFileSync('logs/combined-2026-06-13.log', 'utf8').split('\n').filter(Boolean);
const target = lines.reverse().find(l => l.includes('GET /api/bookings'));
if (target) {
  const parsed = JSON.parse(target);
  console.log(parsed.error ? parsed.error : parsed);
}
