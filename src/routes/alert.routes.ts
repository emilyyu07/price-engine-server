import { Router } from "express";
import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

const router = Router();

// GET alerts for all users
router.get("/", async (_req, res, next) => {
  try {
    const allAlerts = await prisma.priceAlert.findMany();
    res.json(allAlerts);
  } catch (error) {
    next(error);
  }
});

// GET alerts for SPECIFIC user
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

// CREATE alerts for user
router.post("/", async (req, res, next) => {
  try {
    const { email, productId, targetPrice } = req.body;

    //find or create the user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: email.split("@")[0] },
    });

    //define the price alert
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
    next(error);
  }
});

export default router;
