import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: (Number(process.env.SMTP_PORT) || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

type OrderEmailData = {
  orderId: number;
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  note: string;
  deliveryType: string;
  deliveryFee: number;
  total: number;
  items: { name: string; quantity: number; price: number }[];
};

export async function sendOrderEmail(order: OrderEmailData) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:14px;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:14px;text-align:center;">×${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#0ea5e9;font-weight:700;font-size:14px;text-align:right;">${(item.price * item.quantity).toLocaleString("fr-DZ")} DA</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
        🛍️ LED Phone
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Accessoires iPhone haut de gamme — El Achour, Alger</p>
    </div>

    <!-- Success banner -->
    <div style="background:#f0fdf4;border-bottom:2px solid #bbf7d0;padding:20px 40px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:32px;">✅</span>
      <div>
        <div style="font-weight:800;color:#15803d;font-size:16px;">Nouvelle commande reçue !</div>
        <div style="color:#16a34a;font-size:13px;">Commande <strong>#${String(order.orderId).padStart(5, "0")}</strong> — À traiter rapidement</div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">

      <!-- Client info -->
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">👤 Informations client</h2>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden;margin-bottom:28px;">
        <tr>
          <td style="padding:10px 16px;color:#64748b;font-size:13px;font-weight:600;width:35%;">Nom</td>
          <td style="padding:10px 16px;color:#0f172a;font-size:14px;font-weight:700;">${order.name}</td>
        </tr>
        <tr style="background:#ffffff;">
          <td style="padding:10px 16px;color:#64748b;font-size:13px;font-weight:600;">Téléphone</td>
          <td style="padding:10px 16px;color:#0ea5e9;font-size:14px;font-weight:700;">${order.phone}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;color:#64748b;font-size:13px;font-weight:600;">Wilaya</td>
          <td style="padding:10px 16px;color:#0f172a;font-size:14px;">${order.wilaya}</td>
        </tr>
        <tr style="background:#ffffff;">
          <td style="padding:10px 16px;color:#64748b;font-size:13px;font-weight:600;">Commune</td>
          <td style="padding:10px 16px;color:#0f172a;font-size:14px;">${order.commune}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;color:#64748b;font-size:13px;font-weight:600;">Adresse</td>
          <td style="padding:10px 16px;color:#0f172a;font-size:14px;">${order.address}</td>
        </tr>
        <tr style="background:#ffffff;"><td style="padding:10px 16px;color:#64748b;font-size:13px;font-weight:600;">Livraison</td><td style="padding:10px 16px;color:#0f172a;font-size:14px;font-weight:700;">${order.deliveryType === "stopdesk" ? "🏪 Stop desk" : "🏠 À domicile"} — ${order.deliveryFee.toLocaleString("fr-DZ")} DA</td></tr>
        ${order.note ? `<tr><td style="padding:10px 16px;color:#64748b;font-size:13px;font-weight:600;">Note</td><td style="padding:10px 16px;color:#0f172a;font-size:14px;font-style:italic;">${order.note}</td></tr>` : ""}
      </table>

      <!-- Products -->
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">📦 Articles commandés</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:10px 12px;text-align:left;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;">Produit</th>
            <th style="padding:10px 12px;text-align:center;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;">Qté</th>
            <th style="padding:10px 12px;text-align:right;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Total -->
      <div style="background:linear-gradient(135deg,#eff6ff,#f0f9ff);border:2px solid #bae6fd;border-radius:16px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
        <div>
          <div style="color:#0369a1;font-size:13px;font-weight:600;margin-bottom:2px;">💵 Paiement à la livraison</div>
          <div style="color:#0ea5e9;font-weight:900;font-size:26px;">${order.total.toLocaleString("fr-DZ")} DA</div>
        </div>
        <div style="background:#0ea5e9;color:white;font-weight:800;font-size:13px;padding:8px 16px;border-radius:100px;">
          À encaisser
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;padding:16px;background:#fff7ed;border-radius:12px;border:1px solid #fed7aa;">
        <p style="margin:0;color:#c2410c;font-size:14px;font-weight:600;">
          📞 Appelez le client sous 24h pour confirmer la livraison
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0f172a;padding:20px 40px;text-align:center;">
      <p style="margin:0;color:#64748b;font-size:12px;">LED Phone · Oued Romane, El Achour, Alger · 0542 61 22 65</p>
      <p style="margin:6px 0 0;color:#475569;font-size:11px;">Ce message est envoyé automatiquement depuis votre boutique en ligne.</p>
    </div>
  </div>
</body>
</html>`;

  if (!process.env.SMTP_PASS || process.env.SMTP_PASS === "TON_MOT_DE_PASSE_EMAIL") {
    console.warn("⚠️  Email non envoyé : SMTP_PASS non configuré dans .env.local");
    return;
  }

  const info = await transporter.sendMail({
    from: `"LED Phone 🛍️" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || "wsaoudi@webminds.dz",
    subject: `🛍️ Nouvelle commande #${String(order.orderId).padStart(5, "0")} — ${order.name} (${order.wilaya})`,
    html,
  });

  console.log(`✅ Email commande envoyé → ${process.env.ADMIN_EMAIL} (${info.messageId})`);
}
