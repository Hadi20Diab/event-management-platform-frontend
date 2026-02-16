/**
 * Hash a plaintext password using SHA256
 * @param {string} password - The plaintext password
 * @returns {Promise<string>} - SHA256 hash as hex string
 */
export async function hashPassword(password) {
  // Use Web Crypto API for SHA256 hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
