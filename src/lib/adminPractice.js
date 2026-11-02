import { loadExam } from './examRepository.js';

// Preserve protection for legacy IDs even if an older database row lacks its flag.
export const isAdminPractice = (id, subject) => Boolean(subject?.adminOnly) || (typeof id === 'string' &&
  (id.startsWith('aws_practice_module_') || id === 'aws_aca_modules_50q' || id === 'aws_acf_modules_71q'));

export function getVisibleSubjects(subjects, user) {
  const isAdmin = user?.app_metadata?.role === 'admin';
  return subjects
    .filter(subject => isAdmin || !isAdminPractice(subject.id, subject))
    .map(subject => isAdminPractice(subject.id, subject) ? { ...subject, adminOnly: true } : subject);
}

export async function loadAdminPractice(id, client) {
  const { data: { session } } = await client.auth.getSession();
  if (!session?.access_token || session.user?.app_metadata?.role !== 'admin') {
    throw new Error('ข้อสอบชุดนี้เปิดให้เฉพาะผู้ดูแลระบบ');
  }
  return loadExam(client, id);
}
