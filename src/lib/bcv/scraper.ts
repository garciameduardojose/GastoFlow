export interface BCVRates {
  usd: number;
  eur: number;
  date: string;
}

export async function fetchBCVRate(): Promise<BCVRates> {
  const response = await fetch("https://www.bcv.org.ve/", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "es-VE,es;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();

  const usdMatch = html.match(
    /id="dolar"[^>]*>[\s\S]*?<strong>\s*([\d,.]+)\s*<\/strong>/
  );
  if (!usdMatch) {
    throw new Error("Could not find USD rate in BCV page");
  }

  const eurMatch = html.match(
    /id="euro"[^>]*>[\s\S]*?<strong>\s*([\d,.]+)\s*<\/strong>/
  );
  if (!eurMatch) {
    throw new Error("Could not find EUR rate in BCV page");
  }

  const parseRate = (str: string): number => {
    return parseFloat(str.replace(/\./g, "").replace(",", "."));
  };

  const usd = parseRate(usdMatch[1]);
  const eur = parseRate(eurMatch[1]);

  if (isNaN(usd) || isNaN(eur)) {
    throw new Error(
      `Invalid rate values: USD=${usdMatch[1]}, EUR=${eurMatch[1]}`
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return { usd, eur, date: today };
}
