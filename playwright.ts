export async function captureTradingViewChart(
  url: string
): Promise<{ success: true; base64: string } | { success: false; error: string }> {
  try {
    // Dynamic import to avoid build issues
    const { chromium } = await import("playwright");

    const browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
    });

    const page = await browser.newPage({
      viewport: { width: 1600, height: 900 },
      deviceScaleFactor: 2,
    });

    // TradingView often needs time + cookies acceptance
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 45000,
    });

    // Wait for chart canvas / main chart area
    await page.waitForTimeout(4000);

    // Try to dismiss cookie banners if present
    try {
      const acceptBtn = page.locator(
        'button:has-text("Accept"), button:has-text("I agree"), button:has-text("Accept all")'
      );
      if (await acceptBtn.count()) {
        await acceptBtn.first().click({ timeout: 2000 });
        await page.waitForTimeout(1000);
      }
    } catch {
      // ignore
    }

    // Focus on the chart area – common TradingView selectors
    let screenshotBuffer: Buffer;

    const chartSelectors = [
      ".chart-container",
      "[data-name='legend-source-item']",
      "#tv_chart_container",
      ".layout__area--center",
      "canvas",
    ];

    let found = false;
    for (const sel of chartSelectors) {
      const el = page.locator(sel).first();
      if ((await el.count()) > 0) {
        try {
          screenshotBuffer = await el.screenshot({ type: "png" });
          found = true;
          break;
        } catch {
          // continue
        }
      }
    }

    if (!found) {
      // Full page fallback
      screenshotBuffer = await page.screenshot({
        type: "png",
        fullPage: false,
      });
    }

    await browser.close();

    const base64 = screenshotBuffer!.toString("base64");
    return { success: true, base64 };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown capture error";
    console.error("Playwright capture failed:", message);
    return {
      success: false,
      error:
        "Could not capture the TradingView chart automatically. Please upload a screenshot of the chart instead.",
    };
  }
}
