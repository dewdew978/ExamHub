// Keep catalog requests small; questions are fetched only when opening an exam.
export const EXAM_CATALOG_COLUMNS = [
  'id', 'name', 'category', 'icon', 'color', 'iconBg', 'desc', 'questionCount',
  'year', 'type', 'primarySource', 'organization', 'curatedBy', 'references',
  'adminOnly', 'requiresAuth', 'updated_at',
].join(',');

function databaseError(error) {
  return new Error(error?.message || 'ไม่สามารถเชื่อมต่อฐานข้อมูลข้อสอบได้');
}

export async function loadExamCatalog(client) {
  const { data, error } = await client.from('exams').select(EXAM_CATALOG_COLUMNS).order('id');
  if (error) throw databaseError(error);
  return data || [];
}

export async function loadExam(client, id, { requireQuestions = false } = {}) {
  if (typeof id !== 'string' || !id.trim()) throw new Error('กรุณาระบุรหัสชุดข้อสอบ');
  const { data, error } = await client.from('exams').select('*').eq('id', id).single();
  if (error) throw databaseError(error);
  if (!data || !Array.isArray(data.questions)) throw new Error('ข้อมูลข้อสอบไม่สมบูรณ์');
  if (requireQuestions && data.questions.length === 0) throw new Error('ข้อสอบชุดนี้ยังไม่มีคำถาม กรุณาเลือกชุดอื่น');
  return data;
}

export function toExamRow(exam) {
  if (typeof exam?.id !== 'string' || !exam.id.trim() || typeof exam.name !== 'string' || !exam.name.trim()) {
    throw new Error('กรุณาระบุรหัสและชื่อชุดข้อสอบ');
  }
  if (!Array.isArray(exam.questions)) throw new Error('questions ต้องเป็นรายการคำถาม');
  for (const [index, question] of exam.questions.entries()) {
    if (typeof question?.q !== 'string' || !question.q.trim()) throw new Error(`ข้อ ${index + 1}: กรุณาระบุคำถาม`);
    if (!Array.isArray(question.choices) || question.choices.length < 2 || question.choices.some(choice => typeof choice !== 'string' || !choice.trim())) {
      throw new Error(`ข้อ ${index + 1}: กรุณาระบุตัวเลือกอย่างน้อย 2 ข้อ`);
    }
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    if (!answers.length || new Set(answers).size !== answers.length || answers.some(answer => !Number.isInteger(answer) || answer < 0 || answer >= question.choices.length)) {
      throw new Error(`ข้อ ${index + 1}: คำตอบไม่ตรงกับตัวเลือก`);
    }
  }
  const row = {};
  const metadata = [
    'id', 'name', 'category', 'icon', 'color', 'iconBg', 'desc', 'year', 'type',
    'primarySource', 'organization', 'curatedBy', 'references',
  ];
  for (const key of metadata) if (exam[key] !== undefined) row[key] = exam[key];
  return {
    ...row,
    questions: exam.questions,
    questionCount: exam.questions.length,
    adminOnly: exam.adminOnly === true,
    requiresAuth: exam.requiresAuth === true,
  };
}

export async function saveExam(client, exam) {
  const row = toExamRow(exam);
  const table = client.from('exams');
  const query = exam.updated_at
    ? table.update(row).eq('id', row.id).eq('updated_at', exam.updated_at)
    : table.insert(row);
  const { data, error } = await query.select('*').single();
  if (error?.code === 'PGRST116') throw new Error('ข้อสอบถูกแก้ไขหรือสิทธิ์เปลี่ยนไป กรุณาโหลดข้อมูลล่าสุดก่อนบันทึกอีกครั้ง');
  if (error) throw databaseError(error);
  if (!data) throw new Error('ยังยืนยันการบันทึกไม่ได้ กรุณาโหลดข้อมูลล่าสุด');
  return data;
}
