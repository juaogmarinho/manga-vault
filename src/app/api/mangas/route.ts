import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('q') || '';

    const mangas = await prisma.manga.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ ok: true, mangas });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
};
