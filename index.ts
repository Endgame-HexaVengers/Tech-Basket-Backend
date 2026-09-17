import type { Request, Response } from "express";
import app from "./src/app.js";
import { connectToDatabase } from "./src/config/database.js";

const handler = async (req: Request, res: Response) => {
	await connectToDatabase();
	app(req, res);
};

export default handler;
