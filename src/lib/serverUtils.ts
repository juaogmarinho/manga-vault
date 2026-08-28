import fs from 'fs';
import path from 'path';

export function saveFile(buffer: Buffer, filename: string) {
  const dest = path.join(process.cwd(), 'public', 'uploads', filename);
  fs.writeFileSync(dest, buffer);
  return `/uploads/${filename}`;
}
