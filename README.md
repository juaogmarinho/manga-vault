# MangaVault

MangaVault é uma aplicação para enviar, organizar e ler mangás em PDF.

Tecnologias:
- Next.js 15 (app dir)
- React + TypeScript (strict)
- Tailwind CSS
- Prisma + SQLite
- react-pdf para visualização
- Armazenamento local dos PDFs em public/uploads
- Geração de capas em public/covers (usa sharp quando disponível)

Instalação rápida
1. Clone / copie o projeto
2. Instale dependências:

   npm install

3. Gerar cliente Prisma e migrar DB:

   npx prisma generate
   npx prisma migrate dev --name init

4. Rodar em modo dev:

   npm run dev

EndPoints implementados
- POST /api/upload — recebe uploads multipart (campo "files"), salva em public/uploads, tenta gerar cover em public/covers, cria registros no SQLite.
- GET /api/mangas?q= — lista mangás (filtro por título)
- GET/POST /api/reading — gerencia progresso de leitura

Estrutura relevante
```
src/
 ├─ app/ (pages e rotas API)
 ├─ components/ (UI)
 ├─ lib/ (prisma client)
 prisma/
 public/uploads/ (onde os PDFs são salvos)
 public/covers/ (capa gerada)
```

Notas e considerações
- A geração de capa usa `sharp` para rasterizar a primeira página do PDF. Dependências nativas podem ser necessárias (libvips/poppler). Se a geração falhar, uma miniatura será criada no cliente sob demanda.
- O visualizador usa `react-pdf` e lida com modos simples: página única, dupla e scroll contínuo. Recursos extras (atalhos, salvar última página localmente, zoom fino, cache) estão preparados para serem estendidos.

Bom desenvolvimento! Modificações e ajustes podem ser aplicados conforme o ambiente em que a aplicação for executada (ex.: Windows com suporte a libs nativas para sharp).