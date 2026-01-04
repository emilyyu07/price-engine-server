import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

//create endpoint to set a price alert
router.post("/", async (req, res) => {
  try {
    const { email, productId, targetPrice } = req.body;

    //find or create the user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: email.split("@")[0] },
    });

    //create the price alert
    const alert = await prisma.priceAlert.create({
      data: {
        userId: user.id,
        productId: productId,
        targetPrice: targetPrice,
      },
    });

    res.status(201).json({ success: true, message: "Alert set!", alert });
  } catch (error) {
    res.status(500).json({ error: "Failed to set alert", details: error });
  }
});
