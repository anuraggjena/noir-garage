import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface CacheEntry {
  url: string;
  expiresAt: number;
}

const urlCache = new Map<string, CacheEntry>();

async function getStreamUrl(fileId: string): Promise<string> {
  const cache = urlCache.get(fileId);
  if (cache && cache.expiresAt > Date.now()) {
    return cache.url;
  }

  // Probe the download link without auto-following redirects in order to find any confirm query params
  const rawUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
  
  try {
    let targetUrl = rawUrl;
    
    // Probe initial response using follow redirects: false first
    const res = await fetch(rawUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (res.status === 302 || res.status === 301) {
      const location = res.headers.get("location");
      if (location) {
        if (location.includes("confirm=")) {
          targetUrl = location;
        } else {
          // Go look at the redirect destination
          const followRes = await fetch(location, { method: "GET", redirect: "manual" });
          const nestLoc = followRes.headers.get("location");
          if (nestLoc) {
            targetUrl = nestLoc;
          } else {
            targetUrl = location;
          }
        }
      }
    } else if (res.status === 200) {
      const htmlText = await res.text();
      const confirmMatch = htmlText.match(/confirm=([a-zA-Z0-9_\-]+)/);
      if (confirmMatch) {
        targetUrl = `https://docs.google.com/uc?export=download&confirm=${confirmMatch[1]}&id=${fileId}`;
      }
    }

    // Now issue a final HEAD request with follow redirects to fetch the direct storage link
    const finalRes = await fetch(targetUrl, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    
    const finalUrl = finalRes.url;

    // Cache the resolved storage URL for 30 minutes
    urlCache.set(fileId, {
      url: finalUrl,
      expiresAt: Date.now() + 30 * 60 * 1000,
    });

    console.log(`Successfully mapped Google Drive video ${fileId} to stream: ${finalUrl.split('?')[0]}...`);
    return finalUrl;
  } catch (error) {
    console.error("Error securing direct stream URL:", error);
    // Fallback to original URL if resolution fails
    return rawUrl;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy Endpoint for streaming Google Drive Videos with native range request forwarding
  app.get("/api/video/:mode", async (req, res) => {
    const { mode } = req.params;
    
    // Day vs Night Mode File IDs from Google Drive
    const fileId = mode === "day" 
      ? "1C2UawKA22BOUnDy1axpK51QYyskE3RsR" 
      : "1ZkgdsQTf2Z8NvV1jt5kM4HFSADVElmHs";

    try {
      const streamUrl = await getStreamUrl(fileId);
      
      const forwardHeaders: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      };

      if (req.headers.range) {
        forwardHeaders["range"] = req.headers.range;
      }

      const streamRes = await fetch(streamUrl, {
        headers: forwardHeaders
      });

      // Transfer essential response status and headers
      res.status(streamRes.status);

      const contentRange = streamRes.headers.get("content-range");
      const contentLength = streamRes.headers.get("content-length");
      const contentType = streamRes.headers.get("content-type");
      const acceptRanges = streamRes.headers.get("accept-ranges");

      // Add high-performance client-side caching headers for flawless media looping
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      if (contentRange) res.setHeader("Content-Range", contentRange);
      if (contentLength) res.setHeader("Content-Length", contentLength);
      res.setHeader("Content-Type", contentType || "video/mp4");
      if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);

      if (streamRes.body) {
        const reader = streamRes.body.getReader();

        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(Buffer.from(value));
          pump();
        };

        pump().catch((e) => {
          console.error("Streaming pump err:", e);
          res.end();
        });

        // Cancel reader if request is terminated prematurely
        req.on("close", () => {
          reader.cancel().catch(() => {});
        });
      } else {
        res.end();
      }
    } catch (err: any) {
      console.error("Proxy video streaming exception:", err);
      res.status(500).send("Video Streaming Proxy failure: " + err.message);
    }
  });

  // Proxy Endpoint for streaming any Google Drive Video by customizable File ID with native range request forwarding
  app.get("/api/video-by-id/:fileId", async (req, res) => {
    const { fileId } = req.params;

    try {
      const streamUrl = await getStreamUrl(fileId);
      
      const forwardHeaders: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      };

      if (req.headers.range) {
        forwardHeaders["range"] = req.headers.range;
      }

      const streamRes = await fetch(streamUrl, {
        headers: forwardHeaders
      });

      // Transfer essential response status and headers
      res.status(streamRes.status);

      const contentRange = streamRes.headers.get("content-range");
      const contentLength = streamRes.headers.get("content-length");
      const contentType = streamRes.headers.get("content-type");
      const acceptRanges = streamRes.headers.get("accept-ranges");

      // Add high-performance client-side caching headers for flawless media looping
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      if (contentRange) res.setHeader("Content-Range", contentRange);
      if (contentLength) res.setHeader("Content-Length", contentLength);
      res.setHeader("Content-Type", contentType || "video/mp4");
      if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);

      if (streamRes.body) {
        const reader = streamRes.body.getReader();

        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(Buffer.from(value));
          pump();
        };

        pump().catch((e) => {
          console.error("Streaming pump err:", e);
          res.end();
        });

        req.on("close", () => {
          reader.cancel().catch(() => {});
        });
      } else {
        res.end();
      }
    } catch (err: any) {
      console.error("Proxy video-by-id streaming exception:", err);
      res.status(500).send("Video-by-id Streaming Proxy failure: " + err.message);
    }
  });

  // Proxy Endpoint for streaming any Google Drive Audio by File ID with range request forwarding
  app.get("/api/audio-by-id/:fileId", async (req, res) => {
    const { fileId } = req.params;

    try {
      const streamUrl = await getStreamUrl(fileId);
      
      const forwardHeaders: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      };

      if (req.headers.range) {
        forwardHeaders["range"] = req.headers.range;
      }

      const streamRes = await fetch(streamUrl, {
        headers: forwardHeaders
      });

      res.status(streamRes.status);

      const contentRange = streamRes.headers.get("content-range");
      const contentLength = streamRes.headers.get("content-length");
      const contentType = streamRes.headers.get("content-type");
      const acceptRanges = streamRes.headers.get("accept-ranges");

      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      if (contentRange) res.setHeader("Content-Range", contentRange);
      if (contentLength) res.setHeader("Content-Length", contentLength);
      res.setHeader("Content-Type", contentType || "audio/mpeg");
      if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);

      if (streamRes.body) {
        const reader = streamRes.body.getReader();

        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(Buffer.from(value));
          pump();
        };

        pump().catch((e) => {
          console.error("Audio streaming pump err:", e);
          res.end();
        });

        req.on("close", () => {
          reader.cancel().catch(() => {});
        });
      } else {
        res.end();
      }
    } catch (err: any) {
      console.error("Proxy audio-by-id streaming exception:", err);
      res.status(500).send("Audio-by-id Streaming Proxy failure: " + err.message);
    }
  });

  // Proxy Endpoint for streaming the custom Car Loader Icon from Google Drive
  app.get("/api/loader-icon", async (req, res) => {
    const fileId = "1xB3GP1WqRmlo7xVKWAxtzAOLycgtJzc2";
    try {
      const targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const streamRes = await fetch(targetUrl, {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      
      const contentLength = streamRes.headers.get("content-length");
      const contentType = streamRes.headers.get("content-type") || "image/png";

      res.status(streamRes.status);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      res.setHeader("Content-Type", contentType);

      if (streamRes.body) {
        const reader = streamRes.body.getReader();
        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(Buffer.from(value));
          pump();
        };
        pump().catch((e) => {
          console.error("Loader icon streaming pump err:", e);
          res.end();
        });
        req.on("close", () => {
          reader.cancel().catch(() => {});
        });
      } else {
        res.end();
      }
    } catch (err: any) {
      console.error("Proxy loader icon exception:", err);
      res.status(500).send("Car Loader Icon Proxy failure: " + err.message);
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on http://0.0.0.0:${PORT}`);
  });
}

startServer();
