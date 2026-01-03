import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();

//ingest products from Fake Store API

export const ingestFakeStoreProducts = async () => {
  try {
    //Set up retailer record for Fake Store API
    const retailer = await prisma.retailer.upsert({
      where: {
        name: "Fake Store API",
      },
      update: {},
      create: {
        name: "Fake Store API",
        apiUrl: "https://fakestoreapi.com",
      },
    });

    //Network request to fetch products
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;

    for (const item of products) {
      //create or update product record
      const product = await prisma.product.upsert({
        where: {
          externalId: item.id.toString(),
        },
        update: {
          title: item.title,
          imageUrl: item.image,
          category: item.category,
        },
        create: {
          externalId: item.id.toString(),
          title: item.title,
          imageUrl: item.image,
          category: item.category,
        },
      });

      //find current listing and check price
      const currentListing = await prisma.productListing.findUnique({
        where: {
          productId_retailerId: {
            productId: products.id,
            retailerId: retailer.id,
          },
        },
      });

      //update listing and add history only if price changed
      const newPrice = item.price;

      if (
        !currentListing ||
        currentListing.currentPrice.toNumber() !== newPrice
      ) {
        await prisma.productListing.upsert({
          where: {
            productId_retailerId: {
              productId: products.id,
              retailerId: retailer.id,
            },
          },
          update: {
            currentPrice: newPrice,
          },
          create: {
            productId: products.id,
            retailerId: retailer.id,
            currentPrice: newPrice,
            priceHistory: {
              create: { price: newPrice },
            },
          },
        });
        console.log(`Updated price for ${item.price}`);
      }
    }

    console.log(`Ingestion successful: ${products.length} itmes processed.`);
  } catch (error) {
    console.error("Ingestion failed:");

    if (axios.isAxiosError(error)) {
      console.error("API error:", error.message);
    } else {
      console.error("System/database error:", error);
    }

    throw error;
  }
};

/*
01/03 - data ingestion code created to fetch prodcuts from Fake Store API and alter database


*/
