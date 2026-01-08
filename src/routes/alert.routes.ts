import { Router } from "express";
import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

const router = Router();

//get alerts for specific user
router.get("/:email", async (req, res, next) => {
  const { email } = req.params;
  try {
    const alerts = await prisma.priceAlert.findMany({
      where: { user: { email: email } },
      include: { product: true },
    });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

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
        targetPrice: new Prisma.Decimal(targetPrice),
        isActive: true,
      },
    });

    res.status(201).json({ success: true, message: "Alert set!", alert });
  } catch (error) {
    res.status(500).json({ error: "Failed to set alert", details: error });
  }
});

export default router;
