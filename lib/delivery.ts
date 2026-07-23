export type DeliveryType = "domicile" | "stopdesk";

export const DELIVERY_PRICES: Record<string, { domicile: number; stopdesk: number }> = {
  // Zone 0
  "Alger":              { domicile: 540,  stopdesk: 400  },
  // Zone 1
  "Blida":              { domicile: 650,  stopdesk: 500  },
  "Boumerdès":          { domicile: 650,  stopdesk: 500  },
  "Tipaza":             { domicile: 650,  stopdesk: 500  },
  // Zone 2
  "Chlef":              { domicile: 850,  stopdesk: 600  },
  "Oum El Bouaghi":     { domicile: 850,  stopdesk: 600  },
  "Batna":              { domicile: 850,  stopdesk: 600  },
  "Béjaïa":             { domicile: 850,  stopdesk: 600  },
  "Bouira":             { domicile: 850,  stopdesk: 600  },
  "Tlemcen":            { domicile: 850,  stopdesk: 600  },
  "Tiaret":             { domicile: 850,  stopdesk: 600  },
  "Tizi Ouzou":         { domicile: 850,  stopdesk: 600  },
  "Jijel":              { domicile: 850,  stopdesk: 600  },
  "Sétif":              { domicile: 850,  stopdesk: 600  },
  "Saïda":              { domicile: 850,  stopdesk: 600  },
  "Skikda":             { domicile: 850,  stopdesk: 600  },
  "Sidi Bel Abbès":     { domicile: 850,  stopdesk: 600  },
  "Annaba":             { domicile: 850,  stopdesk: 600  },
  "Guelma":             { domicile: 850,  stopdesk: 600  },
  "Constantine":        { domicile: 850,  stopdesk: 600  },
  "Médéa":              { domicile: 850,  stopdesk: 600  },
  "Mostaganem":         { domicile: 850,  stopdesk: 600  },
  "M'Sila":             { domicile: 850,  stopdesk: 600  },
  "Mascara":            { domicile: 850,  stopdesk: 600  },
  "Oran":               { domicile: 850,  stopdesk: 600  },
  "Bordj Bou Arréridj": { domicile: 850,  stopdesk: 600  },
  "El Tarf":            { domicile: 850,  stopdesk: 600  },
  "Tissemsilt":         { domicile: 850,  stopdesk: 600  },
  "Khenchela":          { domicile: 850,  stopdesk: 600  },
  "Souk Ahras":         { domicile: 850,  stopdesk: 600  },
  "Mila":               { domicile: 850,  stopdesk: 600  },
  "Aïn Defla":          { domicile: 850,  stopdesk: 600  },
  "Aïn Témouchent":     { domicile: 850,  stopdesk: 600  },
  "Relizane":           { domicile: 850,  stopdesk: 600  },
  // Zone 3
  "Laghouat":           { domicile: 900,  stopdesk: 700  },
  "Biskra":             { domicile: 900,  stopdesk: 700  },
  "Tébessa":            { domicile: 900,  stopdesk: 700  },
  "Djelfa":             { domicile: 900,  stopdesk: 700  },
  "Ouargla":            { domicile: 900,  stopdesk: 700  },
  "El Oued":            { domicile: 900,  stopdesk: 700  },
  "Ghardaïa":           { domicile: 900,  stopdesk: 700  },
  "Ouled Djellal":      { domicile: 900,  stopdesk: 700  },
  "Touggourt":          { domicile: 900,  stopdesk: 700  },
  "El M'Ghair":         { domicile: 900,  stopdesk: 700  },
  "El Meniaa":          { domicile: 900,  stopdesk: 700  },
  // Zone 4
  "Adrar":              { domicile: 1000, stopdesk: 800  },
  "Béchar":             { domicile: 1000, stopdesk: 800  },
  "El Bayadh":          { domicile: 1000, stopdesk: 800  },
  "Naâma":              { domicile: 1000, stopdesk: 800  },
  "Timimoun":           { domicile: 1000, stopdesk: 800  },
  "Bordj Badji Mokhtar":{ domicile: 1000, stopdesk: 800  },
  "Béni Abbès":         { domicile: 1000, stopdesk: 800  },
  // Zone 5
  "Tamanrasset":        { domicile: 1550, stopdesk: 1350 },
  "Illizi":             { domicile: 1550, stopdesk: 1350 },
  "Tindouf":            { domicile: 1550, stopdesk: 1350 },
  "In Salah":           { domicile: 1550, stopdesk: 1350 },
  "In Guezzam":         { domicile: 1550, stopdesk: 1350 },
  "Djanet":             { domicile: 1550, stopdesk: 1350 },
};

export function getDeliveryFee(wilaya: string, type: DeliveryType): number {
  return DELIVERY_PRICES[wilaya]?.[type] ?? 0;
}
