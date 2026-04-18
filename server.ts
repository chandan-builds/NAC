import express from "express";
import { createServer as createViteServer } from "vite";
import puppeteer from "puppeteer";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Cache token in memory to avoid spinning up Puppeteer on every single form submission
  let cachedToken: string | null = null;
  let tokenExpiry: number | null = null;

  // In-memory cache for pincode validation to minimize external API hits
  const pincodeCache = new Map<string, any>();

  // Proxy endpoint for Pincode validation
  app.post("/api/pincode-check", async (req, res) => {
    const { desPincode } = req.body;
    if (!desPincode) return res.status(400).json({ error: "Missing desPincode" });

    if (pincodeCache.has(desPincode)) {
      return res.json(pincodeCache.get(desPincode));
    }

    try {
      const response = await fetch("http://smarttrack.ctbsplus.dtdc.com/ratecalapi/PincodeApiCall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgPincode: "160020", desPincode })
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data) {
        pincodeCache.set(desPincode, data);
      }
      res.status(response.status).json(data);
    } catch (err: any) {
      console.error("Pincode API Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Endpoint to scrape and return the DTDC auth token
  app.get("/api/token", async (req, res) => {
    // If the token is still valid within our cache (15 minutes), reuse it
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return res.json({ token: cachedToken });
    }

    let browser;
    try {
      console.log("Launching Puppeteer to fetch auth token...");
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage"
        ]
      });
      const page = await browser.newPage();
      
      let interceptToken: string | null = null;
      
      // Monitor network requests for the hidden Access-Token header
      page.on("request", (request) => {
        const headers = request.headers();
        if (headers["access-token"]) {
          interceptToken = headers["access-token"];
        }
      });

      console.log("Navigating to DTDC login...");
      await page.goto("https://customer.dtdc.in", { waitUntil: "networkidle2" });
      
      console.log("Typing credentials...");
      await page.waitForSelector("#email");
      await page.waitForSelector("#password");
      
      await page.type("#email", "jo2280");
      await page.type("#password", "Jo2280@123");
      
      console.log("Clicking sign in...");
      await page.click("button.ant-btn-primary");
      
      // Wait for exactly 6 seconds to let the dashboard APIs fire and capture the token
      await new Promise(r => setTimeout(r, 6000));
      
      // Secondary fallback: Try to grab from localStorage if headers didn't catch it
      const lsToken = await page.evaluate(() => {
        return localStorage.getItem("token") || 
               localStorage.getItem("authToken") || 
               localStorage.getItem("access_token");
      });

      const finalToken = interceptToken || lsToken;

      if (finalToken) {
        console.log("Successfully extracted token:", finalToken.substring(0, 10) + "...");
        cachedToken = finalToken;
        tokenExpiry = Date.now() + 2 * 60 * 60 * 1000; // Cache for 2 hours (complete session)
        res.json({ token: finalToken });
      } else {
        throw new Error("Token not found in either network headers or localStorage after login.");
      }
    } catch (error: any) {
      console.error("Puppeteer Script Error:", error);
      res.status(500).json({ error: error.message });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // Proxy the actual DTDC save endpoint to avoid CORS issues from the browser
  app.post("/api/dtdc/save", async (req, res) => {
    try {
      const authHeader = req.headers["access-token"];
      if (!authHeader) {
        return res.status(401).json({ error: "Missing access-token header" });
      }

      console.log("Proxying request to DTDC API...");
      const dtdcResponse = await fetch("https://obbv2prod.dtdc.in/consignment/business/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*",
          "Access-Token": authHeader as string,
          "Application-Type": "customer-portal",
          "Customer-User-Id": "1964505159350355637",
          "Organisation-Id": "1",
          "User-Id": "1964505159350355637"
        },
        body: JSON.stringify(req.body)
      });

      const data = await dtdcResponse.json().catch(() => null);
      if (!dtdcResponse.ok) {
        return res.status(dtdcResponse.status).json(data || { error: "Failed from DTDC API" });
      }

      res.status(dtdcResponse.status).json(data);
    } catch (err: any) {
      console.error("Proxy Error:", err);
      res.status(500).json({ error: err.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support Express v4 syntax
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
