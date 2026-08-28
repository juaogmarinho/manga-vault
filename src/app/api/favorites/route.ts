import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const POST = async (req: Request) => {
  try {
    const { mangaId } = await req.json();
    if (!mangaId) return NextResponse.json({ ok: false, error: 'mangaId required' }, { status: 400 });
    const existing = await prisma.favorite.findFirst({ where: { mangaId } });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ ok: true, favorite: false });
    }
    await prisma.favorite.create({ data: { mangaId } });
    return NextResponse.json({ ok: true, favorite: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    const list = await prisma.favorite.findMany({ include: { manga: true } });
    return NextResponse.json({ ok: true, list });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
};
