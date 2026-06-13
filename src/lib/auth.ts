import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function verifyAuth(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret === 'secret' || jwtSecret.length < 32) {
    throw new Error('Invalid JWT configuration');
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
