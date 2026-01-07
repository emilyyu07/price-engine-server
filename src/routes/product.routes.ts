import { Router } from "express";

const router = Router();
import prisma from "../config/prisma.js";

// get all products (browsing page)
router.get("/", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        listings: {
          select: {
            currentPrice: true,
            retailer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products", details: error });
  }
});

//get a single product with price history (chart page)
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        listings: {
          include: {
            priceHistory: {
              orderBy: {
                timestamp: "asc",
              },
            },
          },
        },
      },
    });

    //check if product exists, return error if not
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    //if valid, return product data
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch product details", details: error });
  }
});

export default router;
