import axios from "axios";
import prisma from "../config/prisma.js";
import { checkAlerts } from "./alertChecker.js";

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
      //create or update the record of the general product info
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
            productId: product.id,
            retailerId: retailer.id,
          },
        },
      });

      //update listing and add history only if price changed/listing is new
      const newPrice = item.price;
      const hasPriceChanged =
        !currentListing || currentListing.currentPrice.toNumber() !== newPrice;

      if (hasPriceChanged) {
        //database upsert for product listing
        await prisma.productListing.upsert({
          where: {
            productId_retailerId: {
              productId: product.id,
              retailerId: retailer.id,
            },
          },
          update: {
            currentPrice: newPrice,

            //add a new point to the price timeline
            priceHistory: {
              create: {
                price: newPrice,
              },
            },
          },
          create: {
            productId: product.id,
            retailerId: retailer.id,
            currentPrice: newPrice,
            url: `https://fakestoreapi.com/products/${item.id}`,

            //add first point in the price timeline
            priceHistory: {
              create: { price: newPrice },
            },
          },
        });

        //trigger price alert check and notify (after db is upserted)
        await checkAlerts(product.id, newPrice);

        console.log(`Updated price: ${item.title} is now ${item.price}`);
      }
    }

    console.log(`Ingestion successful: ${products.length} itmes processed.`);
  } catch (error) {
    console.error("Ingestion failed.");

    if (axios.isAxiosError(error)) {
      console.error("API error:", error.message);
    } else {
      console.error("System/database error:", error);
    }

    throw error;
  }
};

/*
01/03 - data ingestion code created to fetch products from Fake Store API
         and alter database records accordingly
*/
