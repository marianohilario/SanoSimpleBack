import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import router from "./src/routes/index.js";

const PORT = process.env.PORT | 3000;

const app = express();
app.use(cors());
app.use(json());
app.use("/public/ebooks", express.static("public/ebooks"));
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
