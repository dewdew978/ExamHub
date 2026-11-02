// Authorization is checked on the server before any private content is returned.
export function createAdminPracticeHandler(getVerifiedUser, loadExam) {
  return async request => {
    const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };
    const reply = (status, body) => ({ status, headers, body });
    if (request.method !== 'GET') return { ...reply(405, { error: 'Method not allowed' }), headers: { ...headers, Allow: 'GET' } };
    const token = request.headers.authorization?.match(/^Bearer (\S+)$/i)?.[1];
    if (!token) return reply(401, { error: 'Authentication required' });
    let user;
    try { user = await getVerifiedUser(token); } catch { return reply(401, { error: 'Invalid session' }); }
    if (!user) return reply(401, { error: 'Invalid session' });
    if (user.app_metadata?.role !== 'admin') return reply(403, { error: 'Admin access required' });
    const id = request.query?.id;
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) return reply(404, { error: 'Exam not found' });
    try {
      const exam = await loadExam(id, token);
      return exam ? reply(200, exam) : reply(404, { error: 'Exam not found' });
    } catch {
      return reply(503, { error: 'Exam database is unavailable' });
    }
  };
}
