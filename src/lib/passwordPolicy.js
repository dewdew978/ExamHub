// Mirrors the Supabase Auth password settings (min length 8, lowercase + uppercase + digit).
export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_HINT = 'อย่างน้อย 8 ตัวอักษร มีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข';

// Returns a Thai error message, or '' when the password meets the policy.
export function validatePassword(password) {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return `รหัสผ่านต้องมีความยาวอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`;
  }
  if (!/[a-z]/.test(password)) return 'รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว';
  if (!/[A-Z]/.test(password)) return 'รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว';
  if (!/[0-9]/.test(password)) return 'รหัสผ่านต้องมีตัวเลข (0-9) อย่างน้อย 1 ตัว';
  return '';
}
