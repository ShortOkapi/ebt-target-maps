const fs = require('fs');

// 1. Read the newly published master map
const data = JSON.parse(fs.readFileSync('euro-use-master-map.json', 'utf8'));

// 2. Filter and sort only the eligible cells
const eligible = data.cells.filter(c => c.classification === 'eligible');
eligible.sort((a, b) => a.i - b.i || a.j - b.j);

// 3. Group them into continuous ranges
const ranges = [];
for (const c of eligible) {
  const last = ranges[ranges.length - 1];
  if (last && last[0] === c.i && last[2] + 1 === c.j) {
    last[2] = c.j; // Extend the current range
  } else {
    ranges.push([c.i, c.j, c.j]); // Start a new range
  }
}

// 4. Format the final output for Dot Safari
const out = {
  format: 'ebt-target-ranges',
  formatVersion: 1,
  grid: data.grid,
  model: 'euro-use',
  datasetId: data.datasetId,
  revision: data.revision,
  eligibleCount: eligible.length,
  ranges: ranges
};

// 5. Save it as the new compact file
fs.writeFileSync('euro-use-eligibility.json', JSON.stringify(out));
console.log(`Successfully compacted ${eligible.length} dots into ${ranges.length} ranges.`);