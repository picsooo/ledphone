import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Supprimer les données existantes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Créer les catégories — actives
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Coques Silicone", slug: "silicone", icon: "🧊", comingSoon: false } }),
    prisma.category.create({ data: { name: "Coques Antichoc", slug: "antichoc", icon: "🛡️", comingSoon: false } }),
    prisma.category.create({ data: { name: "Coques MagSafe", slug: "magsafe", icon: "🔮", comingSoon: false } }),
    prisma.category.create({ data: { name: "Coques Premium", slug: "premium", icon: "👑", comingSoon: false } }),
    prisma.category.create({ data: { name: "Coques Fashion", slug: "fashion", icon: "✨", comingSoon: false } }),
    prisma.category.create({ data: { name: "Coques Métal", slug: "metal", icon: "⚙️", comingSoon: false } }),
  ]);

  // Créer les catégories — Coming Soon
  await Promise.all([
    prisma.category.create({ data: { name: "Écrans LCD & OLED", slug: "ecrans", icon: "🖥️", comingSoon: true } }),
    prisma.category.create({ data: { name: "Batteries iPhone", slug: "batteries", icon: "🔋", comingSoon: true } }),
    prisma.category.create({ data: { name: "AirPods & Écouteurs", slug: "airpods", icon: "🎧", comingSoon: true } }),
    prisma.category.create({ data: { name: "Câbles & Chargeurs", slug: "cables", icon: "⚡", comingSoon: true } }),
    prisma.category.create({ data: { name: "Apple Watch", slug: "watch", icon: "⌚", comingSoon: true } }),
    prisma.category.create({ data: { name: "Gaming & Tech", slug: "gaming", icon: "🎮", comingSoon: true } }),
  ]);

  const [silicone, antichoc, magsafe, premium, fashion, metal] = categories;

  // Créer les produits
  const products = [
    // ── Coques Silicone ──
    {
      name: "Coque Silicone Apple Originale",
      slug: "coque-silicone-apple-originale",
      description:
        "Coque silicone originale style Apple avec protection lens caméra intégrée. Toucher velours, tenue parfaite.",
      buyPrice: 1500,
      sellPrice: 2800,
      image: "/images/00000046-PHOTO-2026-04-26-17-08-09.jpg",
      compatible: "iPhone 11 → 17 Pro Max",
      stock: 20,
      featured: true,
      categoryId: silicone.id,
    },
    {
      name: "Coque Silicone Rose Apple",
      slug: "coque-silicone-rose-apple",
      description:
        "Coque silicone douce couleur rose poudré avec logo Apple. Finition mate premium, confort optimal.",
      buyPrice: 2800,
      sellPrice: 3800,
      image: "/images/00000167-PHOTO-2026-04-26-17-22-54.jpg",
      compatible: "iPhone 13 → 17 Pro Max",
      stock: 15,
      featured: false,
      categoryId: silicone.id,
    },

    // ── Coques Antichoc ──
    {
      name: "Antichoc Lions Original",
      slug: "antichoc-lions-original",
      description:
        "Coque antichoc Lions original — protection militaire renforcée avec finition mate texturée.",
      buyPrice: 3800,
      sellPrice: 4800,
      image: "/images/00000060-PHOTO-2026-04-26-17-10-10.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 8,
      featured: true,
      categoryId: antichoc.id,
    },
    {
      name: "Antichoc Cuir Becation MagSafe",
      slug: "antichoc-cuir-becation-magsafe",
      description:
        "Coque antichoc en cuir véritable avec anneau MagSafe magnétique. Protection robuste et look sportif.",
      buyPrice: 2500,
      sellPrice: 3500,
      image: "/images/00000149-PHOTO-2026-04-26-17-21-01.jpg",
      compatible: "iPhone 11 → 17 Pro Max",
      stock: 12,
      featured: true,
      categoryId: antichoc.id,
    },
    {
      name: "Antichoc Transparent MagSafe Original",
      slug: "antichoc-transparent-magsafe-original",
      description:
        "Coque antichoc transparente ultra-résistante avec anneau MagSafe intégré. Ne jaunit pas.",
      buyPrice: 4500,
      sellPrice: 5800,
      image: "/images/00000097-PHOTO-2026-04-26-17-14-36.jpg",
      compatible: "iPhone 13 Pro Max → 17 Pro Max",
      stock: 10,
      featured: false,
      categoryId: antichoc.id,
    },

    // ── Coques MagSafe ──
    {
      name: "Coque MagSafe Givré Blanc",
      slug: "coque-magsafe-givre-blanc",
      description:
        "Coque givré mat blanc avec ring MagSafe. Dos dépoli élégant, compatibilité charge sans fil.",
      buyPrice: 1800,
      sellPrice: 3200,
      image: "/images/00000039-PHOTO-2026-04-26-17-06-34.jpg",
      compatible: "iPhone 11 → 16 Pro Max",
      stock: 18,
      featured: true,
      categoryId: magsafe.id,
    },
    {
      name: "Coque MagSafe Transparente Fine",
      slug: "coque-magsafe-transparente-fine",
      description:
        "Coque transparente ultra-fine avec anneau MagSafe blanc. Montre la beauté de votre iPhone.",
      buyPrice: 2200,
      sellPrice: 3500,
      image: "/images/00000054-PHOTO-2026-04-26-17-09-29.jpg",
      compatible: "iPhone 15 → 17 Pro Max",
      stock: 14,
      featured: false,
      categoryId: magsafe.id,
    },
    {
      name: "Coque MagSafe Antichoc For iP17",
      slug: "coque-magsafe-antichoc-ip17",
      description:
        "Protection antichoc renforcée avec MagSafe, protection caméra saillante. Conçue pour l'iPhone 17.",
      buyPrice: 2200,
      sellPrice: 3500,
      image: "/images/00000067-PHOTO-2026-04-26-17-11-19.jpg",
      compatible: "iPhone 16 → 17 Pro Max",
      stock: 10,
      featured: false,
      categoryId: magsafe.id,
    },
    {
      name: "Coque MagSafe Premium 17 Pro Max",
      slug: "coque-magsafe-premium-17-pro-max",
      description:
        "Coque MagSafe premium avec contour renforcé et dos semi-transparent. Look luxe & protection max.",
      buyPrice: 2800,
      sellPrice: 3800,
      image: "/images/00000073-PHOTO-2026-04-26-17-11-59.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 9,
      featured: false,
      categoryId: magsafe.id,
    },
    {
      name: "Coque Transparente Ultra MagSafe",
      slug: "coque-transparente-ultra-magsafe",
      description:
        "Coque transparente ultra-claire avec MagSafe. Anti-jaunissement, bords protecteurs surélevés.",
      buyPrice: 2800,
      sellPrice: 4500,
      image: "/images/00000079-PHOTO-2026-04-26-17-12-28.jpg",
      compatible: "iPhone 13 Pro Max → 17 Pro Max",
      stock: 12,
      featured: false,
      categoryId: magsafe.id,
    },
    {
      name: "Coque Transparente Anti-Jaune Original",
      slug: "coque-transparente-anti-jaune",
      description:
        "Coque transparente originale ne jaunissant pas. Matériau haute qualité, bords surélevés.",
      buyPrice: 2800,
      sellPrice: 3800,
      image: "/images/00000179-PHOTO-2026-04-26-17-24-01.jpg",
      compatible: "iPhone 13 Pro Max → 17 Pro Max",
      stock: 15,
      featured: false,
      categoryId: magsafe.id,
    },

    // ── Coques Premium ──
    {
      name: "Antichoc Lacoste MagSafe Original",
      slug: "antichoc-lacoste-magsafe",
      description:
        "Coque antichoc Lacoste authentique avec logo brodé et anneau MagSafe. Edition limitée premium.",
      buyPrice: 7800,
      sellPrice: 9900,
      image: "/images/00000103-PHOTO-2026-04-26-17-15-23.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 5,
      featured: true,
      categoryId: premium.id,
    },
    {
      name: "Antichoc BMW MagSafe",
      slug: "antichoc-bmw-magsafe",
      description:
        "Coque officielle BMW avec ring MagSafe. Design sport automobile haut de gamme.",
      buyPrice: 3800,
      sellPrice: 4500,
      image: "/images/00000110-PHOTO-2026-04-26-17-16-05.jpg",
      compatible: "iPhone 13 Pro Max → 17 Pro Max",
      stock: 7,
      featured: true,
      categoryId: premium.id,
    },
    {
      name: "Coque Premium 17 Pro Max",
      slug: "coque-premium-17-pro-max",
      description:
        "Coque premium avec contour metallisé et finition mate luxueuse. Elégante et résistante.",
      buyPrice: 3200,
      sellPrice: 4500,
      image: "/images/00000120-PHOTO-2026-04-26-17-17-41.jpg",
      compatible: "iPhone 17 → 17 Pro Max",
      stock: 8,
      featured: false,
      categoryId: premium.id,
    },

    // ── Coques Fashion ──
    {
      name: "Coque Fleurs MagSafe BIGC",
      slug: "coque-fleurs-magsafe-bigc",
      description:
        "Coque transparente avec imprimé fleurs tendance et anneau MagSafe. Style printanier unique.",
      buyPrice: 3800,
      sellPrice: 4800,
      image: "/images/00000025-PHOTO-2026-04-26-17-03-46.jpg",
      compatible: "iPhone 16 Pro Max",
      stock: 10,
      featured: true,
      categoryId: fashion.id,
    },
    {
      name: "Coque Transparente Paillettes",
      slug: "coque-transparente-paillettes",
      description:
        "Coque transparente avec effet paillettes scintillantes. Glamour et protection en un.",
      buyPrice: 3800,
      sellPrice: 4800,
      image: "/images/00000029-PHOTO-2026-04-26-17-04-36.jpg",
      compatible: "iPhone 16 Pro",
      stock: 10,
      featured: false,
      categoryId: fashion.id,
    },
    {
      name: "Coque Nœuds Papillons Rose",
      slug: "coque-noeuds-papillons-rose",
      description:
        "Coque rose avec nœuds papillons 3D holographiques et étoiles pailletées. Coque la plus tendance!",
      buyPrice: 900,
      sellPrice: 1800,
      image: "/images/00000223-PHOTO-2026-04-26-17-27-06.jpg",
      compatible: "iPhone 13 Pro Max, 14 Pro Max, 15 Pro Max",
      stock: 20,
      featured: true,
      categoryId: fashion.id,
    },
    {
      name: "Coque Fashion Colorée",
      slug: "coque-fashion-coloree",
      description:
        "Coque fashion aux couleurs vives avec design exclusif. Pour celles qui aiment se démarquer.",
      buyPrice: 2800,
      sellPrice: 3500,
      image: "/images/00000191-PHOTO-2026-04-26-17-24-50.jpg",
      compatible: "iPhone 13 Pro Max → 17 Pro Max",
      stock: 12,
      featured: false,
      categoryId: fashion.id,
    },
    {
      name: "Coque Fashion Multi-Design",
      slug: "coque-fashion-multi-design",
      description:
        "Collection fashion avec motifs variés tendance. Design exclusif disponible en plusieurs coloris.",
      buyPrice: 2800,
      sellPrice: 3800,
      image: "/images/00000199-PHOTO-2026-04-26-17-25-26.jpg",
      compatible: "iPhone 13 Pro Max → 17 Pro Max",
      stock: 15,
      featured: false,
      categoryId: fashion.id,
    },

    // ── Coques Métal ──
    {
      name: "Coque Bois Premium avec Bouton",
      slug: "coque-bois-premium",
      description:
        "Coque bois naturel avec contour aluminium et bouton intégré. Alliance bois & technologie.",
      buyPrice: 5200,
      sellPrice: 6800,
      image: "/images/00000014-PHOTO-2026-04-26-17-00-59.jpg",
      compatible: "iPhone 16 Pro Max",
      stock: 6,
      featured: true,
      categoryId: metal.id,
    },
    {
      name: "Coque Metal Rotating MagSafe 360°",
      slug: "coque-metal-rotating-magsafe",
      description:
        "Coque métallique avec support rotatif 360° MagSafe intégré. Parfaite pour regarder des vidéos.",
      buyPrice: 5200,
      sellPrice: 6800,
      image: "/images/00000018-PHOTO-2026-04-26-17-02-50.jpg",
      compatible: "iPhone 16 Pro Max",
      stock: 6,
      featured: false,
      categoryId: metal.id,
    },
    {
      name: "Coque Titane Ajourée",
      slug: "coque-titane-ajouree",
      description:
        "Coque en alliage de titane avec découpe artistique ajourée. Ultra-légère, ultra-résistante.",
      buyPrice: 5800,
      sellPrice: 6800,
      image: "/images/00000033-PHOTO-2026-04-26-17-05-02.jpg",
      compatible: "iPhone 16 Pro Max",
      stock: 5,
      featured: true,
      categoryId: metal.id,
    },
    {
      name: "Coque Metal 17 Pro Max Premium",
      slug: "coque-metal-17-pro-max",
      description:
        "Coque métallique premium avec bord protecteur surélevé et finition brushed. Protection ultime.",
      buyPrice: 2800,
      sellPrice: 4500,
      image: "/images/00000113-PHOTO-2026-04-26-17-16-15.jpg",
      compatible: "iPhone 17 Pro Max",
      stock: 8,
      featured: false,
      categoryId: metal.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ ${categories.length} catégories créées`);
  console.log(`✅ ${products.length} produits créés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
