import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

//create new connection pool using URL from .env
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

//wrap pool in Prisma Adapter
const adapter = new PrismaPg(pool);

//pass adapter to PrismaClient

//IMPORTANt: ensure only one instance of PrismaCLient is used throughout the app
const prisma = new PrismaClient({ adapter });

//export client for use in other files
export default prisma;
