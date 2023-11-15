import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program 
       .option('-d', 'Variable for debug', false)
       .option('-p <port>', 'Server port', 9090)
       .option('--mode <mode>', 'Option mode', 'development')
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
       path:
         environment === "production"
           ? "./config/.env.production"
           : "./config/.env.development",
     });

export const PORT = 8080;
export const MONGODB_CNX_STR = process.env.MONGODB_CNX_STR;
export const SECRET_KEY_SESSION = process.env.SECRET_KEY_SESSION;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB
export const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const SECRET_SESSIONS = process.env.SECRET_SESSIONS
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const PERSISTENCE = process.env.PERSISTENCE;
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_PASS = process.env.GMAIL_PASS;
export const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const PREMIUM_EMAIL = process.env.PREMIUM_EMAIL;
export const PREMIUM_PASSWORD = process.env.PREMIUM_PASSWORD;

export default{
       environment: environment
}