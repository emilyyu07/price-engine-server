import prisma from "../config/prisma.js";

export const checkAlerts = async (productId: string, currentPrice: number) => {
  //find all active alerts for specified product where targetPrice is >= current (targetPrice is met)
  const alerts = await prisma.priceAlert.findMany({
    where: {
      productId: productId,
      //check if target is greater than or equal to curent
      targetPrice: { gte: currentPrice },
      isActive: true,
    },
    include: {
      user: true,
    },
  });

  for (const alert of alerts) {
    //REPLACE LOG WITH ACTUAL EMAIL SENDING SERVICE LATER
    console.log(
      `ALERT: Sending email to ${alert.user.email} for product ${productId}.`
    );

    //create notification record in database
    await prisma.notification.create({
      data: {
        userId: alert.userId,
        alertId: alert.id,
        type: "PRICE_DROP",
        title: "Price Drop Detected!",
        message: `Great news! A product you're watching has dropped to $${currentPrice}.`,
      },
    });
  }
};

/*
01/04 - important note: remember to replace the console log with an actual email or text
alerting service later on (console.log() is for testing purposes)
*/
