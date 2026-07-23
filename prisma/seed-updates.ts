import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── 1. Corriger l'image BMW (00000110 = Lacoste Gris, pas BMW)
  await prisma.product.update({
    where: { slug: "antichoc-bmw-magsafe" },
    data: { image: "/images/00000126-PHOTO-2026-04-26-17-18-19.jpg" },
  });
  console.log("✅ Image BMW corrigée → 00000126");

  // ── 2. Récupérer les catégories existantes
  const premium = await prisma.category.findUniqueOrThrow({ where: { slug: "premium" } });
  const antichoc = await prisma.category.findUniqueOrThrow({ where: { slug: "antichoc" } });

  // ── 3. Ajouter Lacoste Cuir Gris (00000110 = 2ème couleur Lacoste)
  await prisma.product.upsert({
    where: { slug: "antichoc-lacoste-cuir-gris" },
    update: { image: "/images/00000110-PHOTO-2026-04-26-17-16-05.jpg" },
    create: {
      name: "Antichoc Lacoste Cuir Gris",
      slug: "antichoc-lacoste-cuir-gris",
      description:
        "Coque Lacoste authentique en cuir grainé gris avec badge crocodile argent et contour doré. Finition luxe premium.",
      buyPrice: 7800,
      sellPrice: 9900,
      image: "/images/00000110-PHOTO-2026-04-26-17-16-05.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 5,
      featured: false,
      categoryId: premium.id,
    },
  });
  console.log("✅ Antichoc Lacoste Cuir Gris ajouté");

  // ── 4. Coque Antichoc Texturée Blanc (00000133)
  await prisma.product.upsert({
    where: { slug: "coque-antichoc-texturee-blanc" },
    update: { image: "/images/00000133-PHOTO-2026-04-26-17-19-16.jpg" },
    create: {
      name: "Coque Antichoc Texturée Blanc",
      slug: "coque-antichoc-texturee-blanc",
      description:
        "Coque antichoc blanc avec texture motifs triangles et anneau caméra chromé. Protection renforcée avec finition premium.",
      buyPrice: 3800,
      sellPrice: 4800,
      image: "/images/00000133-PHOTO-2026-04-26-17-19-16.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 10,
      featured: false,
      categoryId: antichoc.id,
    },
  });
  console.log("✅ Coque Antichoc Texturée Blanc ajoutée");

  // ── 5. Coque Premium Bicolore (00000140)
  await prisma.product.upsert({
    where: { slug: "coque-premium-bicolore" },
    update: { image: "/images/00000140-PHOTO-2026-04-26-17-20-07.jpg" },
    create: {
      name: "Coque Premium Bicolore",
      slug: "coque-premium-bicolore",
      description:
        "Coque premium bicolore blanc/gris avec tissu croisé et anneau caméra chromé. Design élégant et protection totale.",
      buyPrice: 4500,
      sellPrice: 5800,
      image: "/images/00000140-PHOTO-2026-04-26-17-20-07.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 8,
      featured: false,
      categoryId: premium.id,
    },
  });
  console.log("✅ Coque Premium Bicolore ajoutée");

  // ── 6. Coque Antichoc Level avec Béquille (00000146)
  await prisma.product.upsert({
    where: { slug: "coque-antichoc-level-bequille" },
    update: { image: "/images/00000146-PHOTO-2026-04-26-17-20-44.jpg" },
    create: {
      name: "Coque Antichoc Level avec Béquille",
      slug: "coque-antichoc-level-bequille",
      description:
        "Coque antichoc noire avec béquille intégrée style LEVEL. Support multi-angle pratique, protection militaire renforcée.",
      buyPrice: 4500,
      sellPrice: 5800,
      image: "/images/00000146-PHOTO-2026-04-26-17-20-44.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 8,
      featured: false,
      categoryId: antichoc.id,
    },
  });
  console.log("✅ Coque Antichoc Level avec Béquille ajoutée");

  console.log("\n✅ Mise à jour terminée avec succès");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
