import { readFile, writeFile, mkdir } from 'node:fs/promises';

// Import document text as data only. Never execute content from the source file.
const source = await readFile(process.argv[2], 'utf8');
const translations = Object.assign({}, ...await Promise.all([
  '../server/data/aws-practice-choice-translations-1-6.json',
  '../server/data/aws-practice-choice-translations-7-12.json',
].map(async file => JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8')))));
const clean = text => text.replace(/\*\*/g, '').replace(/^\s*\*\s*/gm, '').trim();
const modules = [...source.matchAll(/^## Module (\d+): (.+)\r?$/gm)];
const exams = modules.map((module, index) => {
  const block = source.slice(module.index + module[0].length, modules[index + 1]?.index ?? source.length);
  const headings = [...block.matchAll(/^### ข้อ (\d+): (.+)\r?$/gm)];
  const questions = headings.map((heading, questionIndex) => {
    const text = block.slice(heading.index + heading[0].length, headings[questionIndex + 1]?.index ?? block.length);
    const question = text.match(/\* \*\*คำถาม:\*\*\s*([\s\S]*?)\* \*\*ตัวเลือก:\*\*/)?.[1];
    const choicesText = text.split('* **ตัวเลือก:**')[1]?.split('* **คำตอบที่ถูกต้อง:**')[0];
    const answerText = text.split('* **คำตอบที่ถูกต้อง:**')[1]?.split('* **คำอธิบาย:**')[0];
    const explanation = text.split('* **คำอธิบาย:**')[1]?.replace(/\s*---\s*$/, '');
    const choices = [...(choicesText || '').matchAll(/^\s*\*\s*\(([A-Z])\)\s*(.+)\r?$/gm)].map(match => clean(match[2]));
    const answers = [...(answerText || '').matchAll(/\(([A-Z])\)/g)].map(match => match[1].charCodeAt(0) - 65);
    const uniqueAnswers = [...new Set(answers)];
    if (!question || !explanation || choices.length < 2 || !uniqueAnswers.length || uniqueAnswers.some(i => i >= choices.length)) {
      throw new Error(`Cannot parse source question ${heading[1]}`);
    }
    return { sourceNumber: Number(heading[1]), q: clean(question), choices: choices.map(choice => translations[choice] || choice),
      answer: uniqueAnswers.length === 1 ? uniqueAnswers[0] : uniqueAnswers,
      explain: clean(explanation) };
  });
  return {
    id: `aws_practice_module_${module[1].padStart(2, '0')}`,
    category: 'Cloud Technology Infrastructure',
    name: `AWS Practice — Module ${module[1]}: ${module[2].trim()}`,
    icon: '', color: '#FF9900', iconBg: 'rgba(255,153,0,0.15)',
    desc: `${module[2].trim()} · เฉพาะแอดมิน`,
    questionCount: questions.length, year: 3, type: 'Final', adminOnly: true,
    primarySource: 'aws_practice_exam_collection (1).md', questions,
  };
});
const numbers = exams.flatMap(exam => exam.questions.map(q => q.sourceNumber));
if (exams.length !== 12 || numbers.length !== 129 || numbers.some((n, i) => n !== i + 1)) throw new Error('Expected 12 modules with all 129 questions in source order');
await mkdir(new URL('../server/data/', import.meta.url), { recursive: true });
await mkdir(new URL('../src/data/catalogs/', import.meta.url), { recursive: true });
await writeFile(new URL('../server/data/aws-practice.json', import.meta.url), JSON.stringify(exams, null, 2) + '\n');
await writeFile(new URL('../src/data/catalogs/admin-practice.json', import.meta.url), JSON.stringify(exams.map(({ questions: _questions, ...metadata }) => metadata), null, 2) + '\n');
console.log(JSON.stringify(exams.map(({ name, questionCount }) => ({ name, questionCount })), null, 2));
