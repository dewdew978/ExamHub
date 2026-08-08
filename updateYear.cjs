const fs = require('fs');
const path = './src/data/index.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

data = data.map(sub => {
  if (sub.id === 'isd_midterm_01') {
    return { ...sub, year: 3 };
  } else {
    return { ...sub, year: 2 };
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated index.json with year property');
