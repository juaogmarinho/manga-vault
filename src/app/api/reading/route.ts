import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { mangaId, currentPage, percentage } = body;
    if (!mangaId) return NextResponse.json({ ok: false, error: 'mangaId required' }, { status: 400 });

    const existing = await prisma.readingProgress.findFirst({ where: { mangaId } });
    if (existing) {
      const updated = await prisma.readingProgress.update({
        where: { id: existing.id },
        data: { currentPage, percentage }
      });
      return NextResponse.json({ ok: true, progress: updated });
    }

    const created = await prisma.readingProgress.create({
      data: { mangaId, currentPage, percentage }
    });
    return NextResponse.json({ ok: true, progress: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mangaId = url.searchParams.get('mangaId');
    if (!mangaId) {
      const list = await prisma.readingProgress.findMany({ include: { manga: true }, orderBy: { updatedAt: 'desc' } });
      return NextResponse.json({ ok: true, list });
    }
    const progress = await prisma.readingProgress.findFirst({ where: { mangaId: Number(mangaId) } });
    return NextResponse.json({ ok: true, progress });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
};
