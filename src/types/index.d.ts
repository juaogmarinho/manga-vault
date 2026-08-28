export type Manga = {
  id: number;
  title: string;
  filePath: string;
  coverPath?: string | null;
  totalPages: number;
  createdAt: string;
};

export type ReadingProgress = {
  id: number;
  mangaId: number;
  currentPage: number;
  percentage: number;
  updatedAt: string;
};
