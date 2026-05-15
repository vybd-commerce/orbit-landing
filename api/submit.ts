import type { VercelRequest, VercelResponse } from "@vercel/node";

// Label maps — kept here so the serverless function has no frontend deps.
// Values match the stable `value` keys in the locale option arrays.
const PROVINCE_LABELS: Record<string, string> = {
  guangdong: "Guangdong", zhejiang: "Zhejiang", jiangsu: "Jiangsu",
  fujian: "Fujian", shanghai: "Shanghai", beijing: "Beijing",
  shandong: "Shandong", hubei: "Hubei", sichuan: "Sichuan", other: "Other",
};
const INDUSTRY_LABELS: Record<string, string> = {
  electronics: "Consumer Electronics", apparel: "Apparel & Fashion",
  beauty: "Beauty & Personal Care", food: "Food & Beverage",
  home: "Home & Furniture", sports: "Sports & Outdoors",
  baby: "Baby & Kids", pets: "Pet Supplies", other: "Other",
};
const VOLUME_LABELS: Record<string, string> = {
  "lt10k": "< $10,000", "10k-50k": "$10,000 – $50,000",
  "50k-200k": "$50,000 – $200,000", "gt200k": "> $200,000",
};
const CHANNEL_LABELS: Record<string, string> = {
  amazon: "Amazon", shopify: "Shopify Store", tiktok: "TikTok Shop",
  walmart: "Walmart", temu: "Temu", other: "Other",
};
const TIMELINE_LABELS: Record<string, string> = {
  "1m": "Within 1 month", "3m": "1–3 months",
  "6m": "3–6 months", "6m+": "6+ months",
};
const CHALLENGE_LABELS: Record<string, string> = {
  compliance: "Compliance & Customs", logistics: "Logistics",
  warehousing: "Warehousing", entity: "US Entity Setup",
  payments: "Payments", channels: "Sales Channels",
  positioning: "Market Positioning", marketing: "Marketing",
};
const CONTACT_LABELS: Record<string, string> = {
  wechat: "WeChat", email: "Email", any: "Either",
};

const label = (map: Record<string, string>, val: string) => map[val] ?? val;
const labels = (map: Record<string, string>, vals: string[]) =>
  vals.map((v) => label(map, v)).join(", ");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey  = process.env.AIRTABLE_API_KEY;
  const baseId  = process.env.AIRTABLE_BASE_ID;
  const table   = process.env.AIRTABLE_TABLE_NAME ?? "Leads";

  if (!apiKey || !baseId) {
    console.error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const {
    companyName, brandName, website, province, industry,
    categories, monthlyVolume, hasHsCodes, sellingInUS,
    targetChannels, launchTimeline, challenges,
    contactName, email, wechatId, preferredContact,
    language,
  } = req.body as Record<string, string | string[]>;

  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Company Name":       companyName,
            "Brand Name":         brandName,
            "Website":            website || "",
            "Province":           label(PROVINCE_LABELS,  province as string),
            "Industry":           label(INDUSTRY_LABELS,  industry as string),
            "Product Categories": labels(INDUSTRY_LABELS, categories as string[]),
            "Monthly Volume":     label(VOLUME_LABELS,    monthlyVolume as string),
            "Has HS Codes":       hasHsCodes === "yes" ? "Yes" : "No",
            "Selling in US":      sellingInUS === "yes" ? "Yes" : "No",
            "Target Channels":    labels(CHANNEL_LABELS,   targetChannels as string[]),
            "Launch Timeline":    label(TIMELINE_LABELS,   launchTimeline as string),
            "Challenges":         labels(CHALLENGE_LABELS, challenges as string[]),
            "Contact Name":       contactName,
            "Email":              email,
            "WeChat ID":          wechatId || "",
            "Preferred Contact":  label(CONTACT_LABELS, preferredContact as string),
            "Language":           language === "zh" ? "Chinese" : "English",
            "Submitted At":       new Date().toISOString(),
          },
        }),
      }
    );

    if (!airtableRes.ok) {
      const err = await airtableRes.json();
      console.error("Airtable error:", err);
      return res.status(502).json({ error: "Failed to save" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Submission error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
