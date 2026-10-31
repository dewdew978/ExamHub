import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function auditQuestions(questions) {
  const result = {
    total: 0,
    answerCounts: [0, 0, 0, 0],
    correctIsLongest: 0,
    correctIsUniqueLongest: 0,
  };

  if (!Array.isArray(questions)) return result;

  for (const question of questions) {
    const choices = question?.choices;
    const answer = question?.answer;
    if (!Array.isArray(choices) || choices.length === 0 ||
        !Number.isInteger(answer) || answer < 0 || answer >= choices.length) {
      continue;
    }

    result.total += 1;
    if (answer < result.answerCounts.length) result.answerCounts[answer] += 1;

    const lengths = choices.map(choice => String(choice).length);
    const longest = Math.max(...lengths);
    if (lengths[answer] === longest) {
      result.correctIsLongest += 1;
      if (lengths.filter(length => length === longest).length === 1) {
        result.correctIsUniqueLongest += 1;
      }
    }
  }

  return result;
}

const percent = (count, total) => total === 0 ? '0.0%' : `${(count * 100 / total).toFixed(1)}%`;

async function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const dataDir = path.join(repoRoot, 'src', 'data');
  const names = (await readdir(dataDir))
    .filter(name => name.endsWith('.json'))
    .sort();
  const aggregate = auditQuestions([]);

  console.log('Exam choice source-data audit');
  console.log('Dataset                             Total    A    B    C    D   Correct longest   Unique longest');

  for (const name of names) {
    const data = JSON.parse(await readFile(path.join(dataDir, name), 'utf8'));
    const questions = Array.isArray(data) ? [] : (data.questions ?? data.items);
    if (!Array.isArray(questions)) continue;

    const report = auditQuestions(questions);
    if (report.total === 0) continue;
    aggregate.total += report.total;
    report.answerCounts.forEach((count, index) => { aggregate.answerCounts[index] += count; });
    aggregate.correctIsLongest += report.correctIsLongest;
    aggregate.correctIsUniqueLongest += report.correctIsUniqueLongest;

    const counts = report.answerCounts.map(count => String(count).padStart(4)).join(' ');
    console.log(`${name.padEnd(35)} ${String(report.total).padStart(5)} ${counts}   ${percent(report.correctIsLongest, report.total).padStart(15)}   ${percent(report.correctIsUniqueLongest, report.total).padStart(14)}`);
  }

  const counts = aggregate.answerCounts.map(count => String(count).padStart(4)).join(' ');
  console.log(`${'TOTAL'.padEnd(35)} ${String(aggregate.total).padStart(5)} ${counts}   ${percent(aggregate.correctIsLongest, aggregate.total).padStart(15)}   ${percent(aggregate.correctIsUniqueLongest, aggregate.total).padStart(14)}`);
  console.log('\nRuntime choice balancing redistributes displayed correct answers evenly; this report keeps source-content bias visible for editorial review.');
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
