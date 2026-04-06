export interface BCVRates {
    usd: number;
    eur: number;
    date: string;
}

export async function fetchBCVRate(): Promise<BCVRates> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
        const response = await fetch("https://www.bcv.org.ve/", {
                signal: controller.signal,
                headers: {
                          "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                          Accept:
                                      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                          "Accept-Language": "es-VE,es;q=0.9,en;q=0.8",
                          "Cache-Control": "no-cache",
                          Pragma: "no-cache",
                },
        });

      clearTimeout(timeoutId);

      if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Multiple regex patterns to handle BCV site structure changes
      const usdPatterns = [
              /id="dolar"[^>]*>[\s\S]*?<strong[^>]*>\s*([\d,.]+)\s*<\/strong>/i,
              /dolar[\s\S]{0,200}?<strong[^>]*>\s*([\d,.]+)\s*<\/strong>/i,
              /<div[^>]*id="dolar"[^>]*>[\s\S]*?(\d+[,.]?\d+[,.]\d+)/i,
            ];

      const eurPatterns = [
              /id="euro"[^>]*>[\s\S]*?<strong[^>]*>\s*([\d,.]+)\s*<\/strong>/i,
              /euro[\s\S]{0,200}?<strong[^>]*>\s*([\d,.]+)\s*<\/strong>/i,
              /<div[^>]*id="euro"[^>]*>[\s\S]*?(\d+[,.]?\d+[,.]\d+)/i,
            ];

      const parseRate = (str: string): number =>
              parseFloat(str.replace(/\./g, "").replace(",", "."));

      let usd: number | null = null;
        for (const pattern of usdPatterns) {
                const match = html.match(pattern);
                if (match && match[1]) {
                          const val = parseRate(match[1]);
                          if (!isNaN(val) && val > 0) {
                                      usd = val;
                                      break;
                          }
                }
        }

      let eur: number | null = null;
        for (const pattern of eurPatterns) {
                const match = html.match(pattern);
                if (match && match[1]) {
                          const val = parseRate(match[1]);
                          if (!isNaN(val) && val > 0) {
                                      eur = val;
                                      break;
                          }
                }
        }

      if (usd === null) {
              throw new Error("Could not find USD rate in BCV page");
      }

      if (eur === null) {
              throw new Error("Could not find EUR rate in BCV page");
      }

      const today = new Date().toISOString().split("T")[0];

      return { usd, eur, date: today };
  } catch (err) {
        clearTimeout(timeoutId);
        throw err;
  }
}
