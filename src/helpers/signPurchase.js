import "dotenv/config";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export default function generarLinkDeDescarga(userId) {
    const token = jwt.sign({ userId }, SECRET_KEY, {
        expiresIn: "1d",
    })
    return `https://sano-simple-back.vercel.app/download/token=${token}`
}
