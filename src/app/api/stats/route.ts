import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const GET = async () => {
  try {
    const totalMangas = await prisma.manga.count();
    const totalPagesAgg = await prisma.manga.aggregate({ _sum: { totalPages: true } });
    const finished = await prisma.readingProgress.count({ where: { percentage: 100 } });

    return NextResponse.json({ ok: true, stats: { totalMangas, totalPages: totalPagesAgg._sum.totalPages || 0, finished } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
};
