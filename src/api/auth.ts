import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Data } from "../config";
import sanitizeHtml from "sanitize-html";
export const authMiddleware = (req: Request, res: Response, next: any) => {
  try {
    const bearerHeader = req.headers.authorization;
    // console.log(bearerHeader);
    req.body.input = sanitizeHtml(req.body.input);
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");

      const bearerToken = bearer[1];

      const decoded = jwt.verify(bearerToken, Data.JWT_SECRET_TOKEN);
      res.locals.user = decoded;
      next();
    } else {
      // console.log('hii');
      res.status(403).send({ message: "forbidden" });
    }
  } catch (err) {
    console.log(err);
    res.status(403).send({ message: "forbidden" });
  }
};
