import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env.local');
}

export function generateToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    // Если пароль не задан в .env, используем дефолтный
    return password === 'admin123';
  }

  // Если пароль начинается с $2b$, то это уже хеш bcrypt
  if (ADMIN_PASSWORD.startsWith('$2b$')) {
    return await bcrypt.compare(password, ADMIN_PASSWORD);
  } else {
    // Иначе это обычный текстовый пароль
    return password === ADMIN_PASSWORD;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}