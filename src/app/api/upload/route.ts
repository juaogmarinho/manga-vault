import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import sharp from 'sharp';
import { prisma } from '../../../lib/prisma';

export const POST = async (req: NextRequest) => {
  try {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    form.keepExtensions = true;

    const parsed: { files?: any; fields?: any } = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const files = parsed.files?.files ? (Array.isArray(parsed.files.files) ? parsed.files.files : [parsed.files.files]) : [];
    const results: any[] = [];

    for (const file of files) {
      const tempPath = file.path;
      const originalName = file.name || file.originalFilename || path.basename(tempPath);
      const destFileName = `${Date.now()}-${originalName}`;
      const destPath = path.join(process.cwd(), 'public', 'uploads', destFileName);
      fs.renameSync(tempPath, destPath);

      // read pdf to get number of pages
      const dataBuffer = fs.readFileSync(destPath);
      let totalPages = 0;
      try {
        const parsedPdf = await pdf(dataBuffer);
        totalPages = parsedPdf.numpages || 0;
      } catch (e) {
        console.error('Failed to parse PDF for pages', e);
      }

      // try to generate cover (first page) using sharp (may require libvips with pdf support)
      let coverPath: string | null = null;
      try {
        const coverFileName = `${Date.now()}-${originalName}.png`;
        const coverFullPath = path.join(process.cwd(), 'public', 'covers', coverFileName);
        await sharp(destPath, { page: 0 }).resize(600).png().toFile(coverFullPath);
        coverPath = `/covers/${coverFileName}`;
      } catch (e) {
        console.warn('Cover generation failed (sharp). Cover will be generated client-side on demand.', e);
      }

      // create DB record
      const manga = await prisma.manga.create({
        data: {
          title: originalName.replace(/\.pdf$/i, ''),
          filePath: `/uploads/${destFileName}`,
          coverPath: coverPath,
          totalPages: totalPages
        }
      });

      results.push(manga);
    }

    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
};
