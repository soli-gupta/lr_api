import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.PORT ? process.env.PORT : 8080;
const DB_USERNAME = process.env.MONGODB_USER;
const DB_USER_PASSWORD = process.env.MONGODB_USER_PASSWORD;
const DB = `mongodb+srv://${DB_USERNAME}:${DB_USER_PASSWORD}@lrexpress.tpia7rk.mongodb.net/`;
// const DB = `mongodb+srv://${DB_USERNAME}:${DB_USER_PASSWORD}@cluster0.nywwux0.mongodb.net/`
const JWT_SECRET = process.env.JWT_SECRET;
const SALES_FORCE = process.env.SALES_FORCE_URL;
const AWS_S3_ACCESS_ID = process.env.AWS_S3_ACCESS_ID;
const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;
const AWS_REGION_NAME = process.env.AWS_REGION_NAME;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_ACL = process.env.AWS_ACL;
const CAR_TRADE_URL = process.env.CAR_TRADE_URL;
const LSQ_URL = process.env.LSQ_URL;
const LSQ_ACCESS_KEY = process.env.LSQ_ACCESS_KEY;
const LSQ_SECRET_KEY = process.env.LSQ_SECRET_KEY;
//  const PORT =
// export const config = {
//     port: {
//         port: SERVER_PORT
//     }
// }

export { SERVER_PORT, DB, JWT_SECRET, SALES_FORCE, AWS_S3_ACCESS_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_REGION_NAME, AWS_BUCKET_NAME, AWS_ACL, CAR_TRADE_URL, LSQ_URL, LSQ_ACCESS_KEY, LSQ_SECRET_KEY }