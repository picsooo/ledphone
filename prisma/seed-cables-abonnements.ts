import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ══════════════════════════════════════════════════════
  // 1. NOUVEAUX ABONNEMENTS (prix extraits des captures)
  // ══════════════════════════════════════════════════════
  const catAbo = await prisma.category.findUniqueOrThrow({ where: { slug: "abonnements" } });

  const newAbos = [
    // ── ChatGPT Plus
    {
      name: "ChatGPT Plus Business (1 mois)",
      slug: "chatgpt-plus-business-1mois",
      description: "ChatGPT Plus — compte business partagé 4 membres. Accès GPT-4o, DALL·E, plugins. Livré par email.",
      buyPrice: 2500, sellPrice: 3500,
      image: "https://cdn.simpleicons.org/openai/10a37f",
      compatible: "Web, iOS, Android",
      stock: 999, featured: true,
    },
    {
      name: "ChatGPT Plus Business Renouvellement",
      slug: "chatgpt-plus-business-renouvellement",
      description: "Renouvellement ChatGPT Plus compte business partagé 4 membres. Accès GPT-4o, DALL·E, plugins.",
      buyPrice: 4500, sellPrice: 6000,
      image: "https://cdn.simpleicons.org/openai/10a37f",
      compatible: "Web, iOS, Android",
      stock: 999, featured: false,
    },
    {
      name: "ChatGPT Plus Nouveau Compte (1 mois)",
      slug: "chatgpt-plus-nouveau-compte-1mois",
      description: "ChatGPT Plus — nouveau compte personnel. Accès GPT-4o, DALL·E, plugins illimités. Livré par email.",
      buyPrice: 1500, sellPrice: 2500,
      image: "https://cdn.simpleicons.org/openai/10a37f",
      compatible: "Web, iOS, Android",
      stock: 999, featured: false,
    },
    {
      name: "ChatGPT Pro Business (1 mois)",
      slug: "chatgpt-pro-business-1mois",
      description: "ChatGPT Pro — compte business 4 membres. Accès o1 Pro, capacités avancées illimitées. Livré par email.",
      buyPrice: 60000, sellPrice: 70000,
      image: "https://cdn.simpleicons.org/openai/10a37f",
      compatible: "Web, iOS, Android",
      stock: 999, featured: false,
    },
    {
      name: "ChatGPT Pro Business Renouvellement",
      slug: "chatgpt-pro-business-renouvellement",
      description: "Renouvellement ChatGPT Pro — compte business 4 membres. o1 Pro, capacités avancées illimitées.",
      buyPrice: 59000, sellPrice: 70000,
      image: "https://cdn.simpleicons.org/openai/10a37f",
      compatible: "Web, iOS, Android",
      stock: 999, featured: false,
    },

    // ── Netflix multi-mois
    {
      name: "Netflix 4 Écrans Officiel (3 mois)",
      slug: "netflix-4-ecrans-officiel-3mois",
      description: "Netflix Premium 4K officiel 4 écrans — livré avec email du client. 3 mois. Qualité maximale garantie.",
      buyPrice: 10500, sellPrice: 12500,
      image: "https://cdn.simpleicons.org/netflix/E50914",
      compatible: "Smart TV, PC, Mobile, Tablette",
      stock: 999, featured: false,
    },

    // ── Snapchat+ multi-mois
    {
      name: "Snapchat+ (3 mois)",
      slug: "snapchat-plus-3mois",
      description: "Abonnement Snapchat Plus 3 mois. Badge exclusif, stories personnalisées, fonctionnalités premium.",
      buyPrice: 2000, sellPrice: 2500,
      image: "https://cdn.simpleicons.org/snapchat/FFFC00",
      compatible: "iOS & Android",
      stock: 999, featured: false,
    },
    {
      name: "Snapchat+ (6 mois)",
      slug: "snapchat-plus-6mois",
      description: "Abonnement Snapchat Plus 6 mois. Badge exclusif, stories personnalisées, fonctionnalités premium.",
      buyPrice: 3000, sellPrice: 4500,
      image: "https://cdn.simpleicons.org/snapchat/FFFC00",
      compatible: "iOS & Android",
      stock: 999, featured: false,
    },
    {
      name: "Snapchat+ (12 mois)",
      slug: "snapchat-plus-12mois",
      description: "Abonnement Snapchat Plus 12 mois. Badge exclusif, stories personnalisées, fonctionnalités premium.",
      buyPrice: 7000, sellPrice: 8500,
      image: "https://cdn.simpleicons.org/snapchat/FFFC00",
      compatible: "iOS & Android",
      stock: 999, featured: false,
    },

    // ── Shahid multi-mois
    {
      name: "Shahid VIP 4 Écrans (3 mois)",
      slug: "shahid-vip-4-ecrans-3mois",
      description: "Shahid VIP 4 écrans — 3 mois. Séries arabes, films et émissions en HD sans publicité.",
      buyPrice: 3500, sellPrice: 5000,
      image: "https://cdn.simpleicons.org/shahid/00AEEF",
      compatible: "Smart TV, PC, Mobile",
      stock: 999, featured: false,
    },
    {
      name: "Shahid VIP 4 Écrans (12 mois)",
      slug: "shahid-vip-4-ecrans-12mois",
      description: "Shahid VIP 4 écrans — 12 mois. Séries arabes, films et émissions en HD sans publicité.",
      buyPrice: 10500, sellPrice: 16000,
      image: "https://cdn.simpleicons.org/shahid/00AEEF",
      compatible: "Smart TV, PC, Mobile",
      stock: 999, featured: false,
    },

    // ── Spotify 12 mois
    {
      name: "Spotify Premium (12 mois)",
      slug: "spotify-premium-12mois",
      description: "Spotify Premium 12 mois. Musique sans pub, mode hors-ligne, qualité audio maximale.",
      buyPrice: 12500, sellPrice: 17500,
      image: "https://cdn.simpleicons.org/spotify/1ED760",
      compatible: "iOS, Android, PC, Smart TV",
      stock: 999, featured: false,
    },

    // ── CrunchyRoll
    {
      name: "CrunchyRoll Mega Fan (12 mois)",
      slug: "crunchyroll-mega-fan-12mois",
      description: "CrunchyRoll Mega Fan 12 mois. Anime en HD, streaming sans pub, accès simultané. Livré par email.",
      buyPrice: 6000, sellPrice: 10000,
      image: "https://cdn.simpleicons.org/crunchyroll/F47521",
      compatible: "Smart TV, PC, Mobile, Tablette",
      stock: 999, featured: false,
    },

    // ── CapCut Pro
    {
      name: "CapCut Pro (1 mois)",
      slug: "capcut-pro-1mois",
      description: "CapCut Pro 1 mois. Templates premium, effets exclusifs, export sans filigrane. Livré par email.",
      buyPrice: 1500, sellPrice: 2000,
      image: "https://cdn.simpleicons.org/capcut/000000",
      compatible: "iOS & Android",
      stock: 999, featured: false,
    },

    // ── Duolingo Super
    {
      name: "Duolingo Super Family (12 mois)",
      slug: "duolingo-super-family-12mois",
      description: "Duolingo Super Family panel 5 membres — 12 mois. Sans publicité, vies illimitées, mode légendaire.",
      buyPrice: 11500, sellPrice: 15000,
      image: "https://cdn.simpleicons.org/duolingo/58CC02",
      compatible: "iOS, Android, Web",
      stock: 999, featured: false,
    },

    // ── Zoom One Pro
    {
      name: "Zoom One Pro (1 mois)",
      slug: "zoom-one-pro-1mois",
      description: "Zoom One Pro invite — 1 mois. Réunions illimitées, 100 participants, enregistrement cloud.",
      buyPrice: 2500, sellPrice: 3000,
      image: "https://cdn.simpleicons.org/zoom/2D8CFF",
      compatible: "Windows, Mac, iOS, Android",
      stock: 999, featured: false,
    },

    // ── Watch it
    {
      name: "Watch it Premium (12 mois)",
      slug: "watch-it-premium-12mois",
      description: "Watch it Premium sans pub — 12 mois. Films, séries et contenus arabes en HD.",
      buyPrice: 8500, sellPrice: 11000,
      image: "https://cdn.simpleicons.org/appletv/8B0000",
      compatible: "Smart TV, PC, Mobile",
      stock: 999, featured: false,
    },
    {
      name: "Watch it avec Pub (12 mois)",
      slug: "watch-it-avec-pub-12mois",
      description: "Watch it avec publicité — 12 mois. Accès aux films et séries arabes.",
      buyPrice: 3000, sellPrice: 4500,
      image: "https://cdn.simpleicons.org/appletv/8B0000",
      compatible: "Smart TV, PC, Mobile",
      stock: 999, featured: false,
    },
  ];

  let aboCount = 0;
  for (const abo of newAbos) {
    await prisma.product.upsert({
      where: { slug: abo.slug },
      update: { buyPrice: abo.buyPrice, sellPrice: abo.sellPrice, image: abo.image },
      create: { ...abo, categoryId: catAbo.id },
    });
    aboCount++;
  }
  console.log(`✅ ${aboCount} abonnements ajoutés/mis à jour`);

  // ══════════════════════════════════════════════════════
  // 2. CÂBLES & CHARGEURS (activer la catégorie + produits)
  // ══════════════════════════════════════════════════════
  const catCables = await prisma.category.upsert({
    where: { slug: "cables" },
    update: { comingSoon: false },
    create: { name: "Câbles & Chargeurs", slug: "cables", icon: "⚡", comingSoon: false },
  });
  console.log(`✅ Catégorie Câbles & Chargeurs activée (id: ${catCables.id})`);

  const chargers = [
    // ── Câbles Anker
    {
      name: "Câble Anker Series 3 USB-C 100W (1.8m)",
      slug: "cable-anker-series3-usbc-100w",
      description: "Câble USB-C vers USB-C Anker Series 3, 100W, 1.8m. Charge rapide MacBook, iPad, Android. Tresse premium.",
      buyPrice: 1500, sellPrice: 2500,
      image: "/images/00000237-PHOTO-2026-04-28-23-31-26.jpg",
      compatible: "iPhone 15+, Samsung, MacBook, iPad",
      stock: 20, featured: false,
    },
    {
      name: "Câble Anker 310 USB-C vers Lightning (1.8m)",
      slug: "cable-anker-310-usbc-lightning-18m",
      description: "Câble Anker 310 USB-C vers Lightning 1.8m. Charge rapide iPhone jusqu'à 20W. Certifié MFi Apple.",
      buyPrice: 1000, sellPrice: 1800,
      image: "/images/00000239-PHOTO-2026-04-28-23-34-34.jpg",
      compatible: "iPhone 14 et antérieurs, iPad, AirPods",
      stock: 20, featured: false,
    },
    {
      name: "Câble Anker Zolo USB-C 240W Tressé (1.5m)",
      slug: "cable-anker-zolo-usbc-240w-tresse",
      description: "Câble USB-C vers USB-C Anker Zolo 240W, 1.5m, tressé nylon. PD 3.1, ultra rapide et durable.",
      buyPrice: 800, sellPrice: 1500,
      image: "/images/00000268-PHOTO-2026-04-29-00-15-45.jpg",
      compatible: "iPhone 15+, Samsung, MacBook, iPad, Laptop",
      stock: 25, featured: false,
    },

    // ── Chargeurs Anker (tête seule)
    {
      name: "Chargeur Anker Nano 20W USB-C",
      slug: "chargeur-anker-nano-20w",
      description: "Chargeur Anker Nano 20W USB-C. PowerIQ 3.0, charge iPhone 3× plus vite. Compact et pliable.",
      buyPrice: 1000, sellPrice: 1800,
      image: "/images/00000259-PHOTO-2026-04-29-00-10-31.jpg",
      compatible: "iPhone, Samsung, iPad, Android",
      stock: 15, featured: true,
    },
    {
      name: "Chargeur Anker 313 30W GaN USB-C",
      slug: "chargeur-anker-313-30w-gan",
      description: "Chargeur Anker 313 30W GaN USB-C. Technologie GaN, PowerIQ 3.0, compatible Apple & Samsung.",
      buyPrice: 1200, sellPrice: 2200,
      image: "/images/00000266-PHOTO-2026-04-29-00-14-14.jpg",
      compatible: "iPhone, Samsung, iPad, MacBook",
      stock: 15, featured: false,
    },
    {
      name: "Chargeur Anker 45W avec Afficheur",
      slug: "chargeur-anker-zolo-45w-afficheur",
      description: "Chargeur Anker Zolo 45W avec écran d'affichage de puissance. GaN compact, charge ultra rapide.",
      buyPrice: 2000, sellPrice: 3500,
      image: "/images/00000271-PHOTO-2026-04-29-00-18-04.jpg",
      compatible: "iPhone, Samsung, MacBook, iPad, Laptop",
      stock: 10, featured: true,
    },

    // ── Pack Anker (chargeur + câble)
    {
      name: "Pack Anker 20W + Câble USB-C",
      slug: "pack-anker-20w-cable-usbc",
      description: "Pack complet Anker : chargeur 20W USB-C + câble USB-C. Charge ultra rapide pour iPhone & Android.",
      buyPrice: 1500, sellPrice: 2800,
      image: "/images/00000262-PHOTO-2026-04-29-00-12-58.jpg",
      compatible: "iPhone 15+, Samsung, iPad, Android",
      stock: 12, featured: true,
    },

    // ── Chargeurs voiture Anker
    {
      name: "Car Chargeur Anker 20W USB-C",
      slug: "car-chargeur-anker-20w",
      description: "Chargeur allume-cigare Anker 20W USB-C. Charge rapide en voiture, design compact et discret.",
      buyPrice: 900, sellPrice: 1600,
      image: "/images/00000294-PHOTO-2026-04-29-00-24-16.jpg",
      compatible: "iPhone, Samsung, iPad, Android",
      stock: 15, featured: false,
    },
    {
      name: "Car Chargeur Anker 30W USB-C + USB",
      slug: "car-chargeur-anker-30w-usbc-usb",
      description: "Chargeur voiture Anker 30W double port USB-C + USB-A. Charge 2 appareils simultanément en voiture.",
      buyPrice: 1200, sellPrice: 2000,
      image: "/images/00000296-PHOTO-2026-04-29-00-24-37.jpg",
      compatible: "iPhone, Samsung, iPad, Android",
      stock: 12, featured: false,
    },

    // ── Chargeurs Samsung
    {
      name: "Chargeur Samsung 25W (tête seule)",
      slug: "chargeur-samsung-25w-tete",
      description: "Adaptateur Samsung 25W PD USB-C. Charge rapide officielle Samsung & Apple. Sans câble.",
      buyPrice: 800, sellPrice: 1500,
      image: "/images/00000298-PHOTO-2026-04-29-00-26-41.jpg",
      compatible: "Samsung Galaxy, iPhone 15+, iPad",
      stock: 15, featured: false,
    },
    {
      name: "Pack Samsung 25W + Câble USB-C",
      slug: "pack-samsung-25w-cable-usbc",
      description: "Pack complet Samsung 25W : adaptateur PD + câble USB-C inclus. Charge rapide officielle Samsung.",
      buyPrice: 1200, sellPrice: 2200,
      image: "/images/00000304-PHOTO-2026-04-29-00-42-51.jpg",
      compatible: "Samsung Galaxy, iPhone 15+, iPad, Android",
      stock: 12, featured: false,
    },
    {
      name: "Pack Samsung 45W + Câble USB-C (1.8m)",
      slug: "pack-samsung-45w-cable-usbc",
      description: "Pack Samsung 45W PD Power Adapter + câble USB-C 5A 1.8m. Super Fast Charging 2.0 officiel.",
      buyPrice: 1800, sellPrice: 3200,
      image: "/images/00000300-PHOTO-2026-04-29-00-26-55.jpg",
      compatible: "Samsung Galaxy S/Note, iPhone 15+, MacBook",
      stock: 10, featured: true,
    },

    // ── Câbles Joyroom
    {
      name: "Câble Joyroom USB-C vers Lightning 30W (1m)",
      slug: "cable-joyroom-usbc-lightning-30w",
      description: "Câble Joyroom tressé USB-C vers Lightning 30W 1m. Charge rapide iPhone, certifié MFi, ultra durable.",
      buyPrice: 400, sellPrice: 800,
      image: "/images/00000316-PHOTO-2026-04-29-00-42-54.jpg",
      compatible: "iPhone 14 et antérieurs, iPad, AirPods",
      stock: 30, featured: false,
    },
    {
      name: "Câble Joyroom USB-C vers USB-C 60W (1.2m)",
      slug: "cable-joyroom-usbc-usbc-60w-12m",
      description: "Câble Joyroom Fast Charging USB-C vers USB-C 60W PD, 1.2m. Compatible iPhone 15+, Samsung, laptop.",
      buyPrice: 400, sellPrice: 800,
      image: "/images/00000328-PHOTO-2026-04-29-00-42-56.jpg",
      compatible: "iPhone 15+, Samsung, MacBook, iPad",
      stock: 30, featured: false,
    },
    {
      name: "Câble Joyroom USB-C vers USB-C 60W (1m)",
      slug: "cable-joyroom-usbc-usbc-60w-1m",
      description: "Câble Joyroom Fast Charging USB-C vers USB-C 60W PD, 1m. Compact, iPhone 15+, Samsung, laptop.",
      buyPrice: 400, sellPrice: 800,
      image: "/images/00000333-PHOTO-2026-04-29-00-42-58.jpg",
      compatible: "iPhone 15+, Samsung, MacBook, iPad",
      stock: 30, featured: false,
    },

    // ── Chargeur Joyroom
    {
      name: "Chargeur Joyroom GaN 20W Mini + Câble",
      slug: "chargeur-joyroom-gan-20w-mini-kit",
      description: "Kit Joyroom GaN 20W Mini Charger + câble USB-C vers Lightning. 35% plus compact. Charge rapide iPhone.",
      buyPrice: 800, sellPrice: 1500,
      image: "/images/00000320-PHOTO-2026-04-29-00-42-54.jpg",
      compatible: "iPhone, iPad, AirPods, Samsung",
      stock: 15, featured: false,
    },
  ];

  let chargerCount = 0;
  for (const charger of chargers) {
    await prisma.product.upsert({
      where: { slug: charger.slug },
      update: { buyPrice: charger.buyPrice, sellPrice: charger.sellPrice, image: charger.image },
      create: { ...charger, categoryId: catCables.id },
    });
    chargerCount++;
  }
  console.log(`✅ ${chargerCount} câbles & chargeurs ajoutés/mis à jour`);

  console.log("\n✅ Mise à jour complète terminée");
  console.log("⚠️  IMPORTANT: Les prix des chargeurs sont des estimations — vérifiez dans le panel admin.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
