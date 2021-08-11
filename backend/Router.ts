import dotenv from "dotenv";
import { Router as ExpressRouter } from "express";
import Router from "express-promise-router";

export const router: ExpressRouter = Router();

dotenv.config();
