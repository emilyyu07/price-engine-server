import { PrismaClient } from "@prisma/client";

//IMPORTANt: ensure only one instance of PrismaCLient is used throughout the app
const prisma = new PrismaClient();

//export client for use in other files
export default prisma;
