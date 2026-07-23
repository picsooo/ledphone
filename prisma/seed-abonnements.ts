import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: "abonnements" },
    update: {},
    create: {
      name: "Abonnements & Services",
      slug: "abonnements",
      icon: "🎬",
      comingSoon: false,
    },
  });

  console.log(`✅ Catégorie créée/trouvée : ${cat.name} (id: ${cat.id})`);

  const abonnements = [
    {
      name: "Netflix Premium 4K",
      slug: "netflix-premium-4k",
      description: "Abonnement Netflix Premium 4K Ultra HD. 4 écrans simultanés. Qualité maximale. Livré par email en moins de 2h.",
      buyPrice: 1800,
      sellPrice: 2800,
      image: "https://cdn.simpleicons.org/netflix/E50914",
      compatible: "Smart TV, PC, Mobile, Tablette",
      stock: 999,
      featured: true,
    },
    {
      name: "Netflix Standard HD",
      slug: "netflix-standard-hd",
      description: "Abonnement Netflix Standard Full HD. 2 écrans simultanés. Qualité HD. Livré par email en moins de 2h.",
      buyPrice: 1200,
      sellPrice: 2000,
      image: "https://cdn.simpleicons.org/netflix/E50914",
      compatible: "Smart TV, PC, Mobile, Tablette",
      stock: 999,
      featured: false,
    },
    {
      name: "Snapchat+ (1 mois)",
      slug: "snapchat-plus-1-mois",
      description: "Abonnement Snapchat Plus. Fonctionnalités exclusives, badge ✦, stories personnalisées et plus encore.",
      buyPrice: 450,
      sellPrice: 900,
      image: "https://cdn.simpleicons.org/snapchat/FFFC00",
      compatible: "iOS & Android",
      stock: 999,
      featured: true,
    },
    {
      name: "Tinder Gold (1 mois)",
      slug: "tinder-gold-1-mois",
      description: "Abonnement Tinder Gold. Voir qui vous a liké, likes illimités, rewinds, boosts mensuels. Livré par email.",
      buyPrice: 1400,
      sellPrice: 2200,
      image: "https://cdn.simpleicons.org/tinder/FF6B6B",
      compatible: "iOS & Android",
      stock: 999,
      featured: false,
    },
    {
      name: "Tinder Plus (1 mois)",
      slug: "tinder-plus-1-mois",
      description: "Abonnement Tinder Plus. Likes illimités, passeport Tinder, rewinds illimités. Livré par email rapidement.",
      buyPrice: 800,
      sellPrice: 1400,
      image: "https://cdn.simpleicons.org/tinder/FF6B6B",
      compatible: "iOS & Android",
      stock: 999,
      featured: false,
    },
    {
      name: "Shahid VIP (1 mois)",
      slug: "shahid-vip-1-mois",
      description: "Abonnement Shahid VIP. Séries arabes, films, émissions en HD sans publicité. Contenu exclusif premium.",
      buyPrice: 900,
      sellPrice: 1600,
      image: "https://cdn.simpleicons.org/shahid/00AEEF",
      compatible: "Smart TV, PC, Mobile",
      stock: 999,
      featured: true,
    },
    {
      name: "Disney+ (1 mois)",
      slug: "disney-plus-1-mois",
      description: "Abonnement Disney+. Marvel, Star Wars, Pixar, Disney, National Geographic. Streaming HD & 4K.",
      buyPrice: 1100,
      sellPrice: 1900,
      image: "https://cdn.simpleicons.org/disneyplus/0063E5",
      compatible: "Smart TV, PC, Mobile, Tablette",
      stock: 999,
      featured: false,
    },
    {
      name: "YouTube Premium (1 mois)",
      slug: "youtube-premium-1-mois",
      description: "Abonnement YouTube Premium. Sans publicité, téléchargement offline, YouTube Music inclus. Livré par email.",
      buyPrice: 700,
      sellPrice: 1300,
      image: "https://cdn.simpleicons.org/youtube/FF0000",
      compatible: "iOS, Android, PC, Smart TV",
      stock: 999,
      featured: false,
    },
    {
      name: "Spotify Premium (1 mois)",
      slug: "spotify-premium-1-mois",
      description: "Abonnement Spotify Premium. Musique sans pub, mode hors-ligne, qualité audio maximale. Livré par email.",
      buyPrice: 450,
      sellPrice: 900,
      image: "https://cdn.simpleicons.org/spotify/1ED760",
      compatible: "iOS, Android, PC, Smart TV",
      stock: 999,
      featured: false,
    },
    {
      name: "Apple TV+ (1 mois)",
      slug: "apple-tv-plus-1-mois",
      description: "Abonnement Apple TV+. Séries et films originaux Apple en 4K HDR. Contenu exclusif haut de gamme.",
      buyPrice: 900,
      sellPrice: 1600,
      image: "https://cdn.simpleicons.org/appletv/000000",
      compatible: "Apple TV, iPhone, iPad, Mac, Smart TV",
      stock: 999,
      featured: false,
    },
    {
      name: "BeIN Sports (1 mois)",
      slug: "bein-sports-1-mois",
      description: "Abonnement BeIN Sports. Foot, tennis, NBA, F1 et tous les sports en direct et en replay.",
      buyPrice: 1800,
      sellPrice: 2800,
      image: "https://cdn.simpleicons.org/beinsports/CC0000",
      compatible: "Smart TV, PC, Mobile, Tablette",
      stock: 999,
      featured: true,
    },
    {
      name: "Amazon Prime Video (1 mois)",
      slug: "amazon-prime-video-1-mois",
      description: "Abonnement Amazon Prime Video. Séries et films exclusifs Amazon Original en 4K. Livré par email.",
      buyPrice: 900,
      sellPrice: 1600,
      image: "https://cdn.simpleicons.org/primevideo/00A8E0",
      compatible: "Smart TV, PC, Mobile, Tablette",
      stock: 999,
      featured: false,
    },
  ];

  let updated = 0;
  for (const abo of abonnements) {
    await prisma.product.upsert({
      where: { slug: abo.slug },
      update: { image: abo.image },
      create: { ...abo, categoryId: cat.id },
    });
    updated++;
  }

  console.log(`✅ ${updated} abonnements créés/mis à jour`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
