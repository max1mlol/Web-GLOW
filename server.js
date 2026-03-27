const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Serve your existing front-end files from this folder.
// Force UTF-8 so Mongolian/Cyrillic text doesn't get garbled.
app.use(
  express.static(__dirname, {
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".html") res.setHeader("Content-Type", "text/html; charset=utf-8");
      if (ext === ".js") res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      if (ext === ".css") res.setHeader("Content-Type", "text/css; charset=utf-8");
      if (ext === ".json") res.setHeader("Content-Type", "application/json; charset=utf-8");
    },
  })
);

// DummyJSON -> our API (HTTP).
app.get("/api/products", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || "20"), 50);

  try {
    const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
    if (!response.ok) {
      return res.status(502).json({ error: "DummyJSON request failed" });
    }

    const data = await response.json();
    const mapped = (data.products || []).map((p) => {
      const discount = Number(p.discountPercentage || 0);
      const hasDiscount = discount > 0;
      const oldPrice = hasDiscount ? Math.round((p.price * 100) / (100 - discount)) : null;

      return {
        id: p.id,
        name: p.title,
        price: p.price,
        oldPrice: oldPrice,
        badge: hasDiscount ? String(discount.toFixed(0)) + "% off" : "",
        description: p.description,
        category: p.category,
        brand: p.brand,
        image: p.thumbnail,
        rating: p.rating,
        ratingCount: Array.isArray(p.reviews) ? p.reviews.length : 0,
        skinType: "",
      };
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});