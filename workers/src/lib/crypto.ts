// Password hashing utilities for Cloudflare Workers

export async function hashPassword(password: string, salt?: string): Promise<string> {
  // Generate salt if not provided
  if (!salt) {
    const saltArray = new Uint8Array(16);
    crypto.getRandomValues(saltArray);
    salt = Array.from(saltArray, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Create password hash
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return salt + hash combined
  return salt + ':' + hashHex;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [salt, hash] = hashedPassword.split(':');
    if (!salt || !hash) {
      throw new Error('Invalid hash format');
    }
    
    const newHash = await hashPassword(password, salt);
    const [, newHashValue] = newHash.split(':');
    
    return newHashValue === hash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

export function generateRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}