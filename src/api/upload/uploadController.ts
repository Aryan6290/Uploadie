import { shortenUrl } from "./../../utils/urlshortner";
import { ObjectId } from "bson";
import { Data } from "./../../config";
import * as fs from "fs";
import { Request, Response } from "express";
import * as uuid from "uuid";
import AWS from "aws-sdk";
import { deleteImagefromDb, uploads3 } from "../../utils/s3uploader";
import { getDatabase } from "../../database";
import { ImageSchema } from "../../schemas/image";
import { User } from "../../schemas/user";
import Agenda from "agenda";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { image, userId } = req.body;
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const s3 = new AWS.S3({
      accessKeyId: Data.AWS_ACCESS_KEY,
      secretAccessKey: Data.AWS_SECRET_KEY,
    });

    const extension = image.split(";")[0].split("/")[1];
    const key = `${uuid.v4()}.${extension}`;
    const params = {
      // ACL: 'public-read',
      Bucket: "farmart-assignment",
      Body: buffer,
      Key: `${key}`,
    };
    const uploadedImage = await s3.upload(params).promise();

    const imageObject = await db.collection<ImageSchema>("images").insertOne({
      owner: new ObjectId(userId),
      actualUrl: uploadedImage.Location,
      shortenUrl: shortenUrl(uploadedImage.Location),
    });

    const agenda = new Agenda({ db: { address: Data.AGENDA_DATABASE } });
    await agenda.start();
    agenda.define("delete image", async (job: any) => {
      const id = job.attrs.data;
      deleteImagefromDb(id);
      // some code that aggregates the database and send monthly billing report.
    });
    await agenda.schedule("1 month", "delete imaget", {
      id: imageObject.insertedId,
    });
    return res
      .status(200)
      .send({ message: "Image added", data: uploadedImage.Location });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "server error" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { imageId, userId } = req.body;

    const getUser = await db
      .collection<User>("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!getUser) {
      return res.status(404).send({ message: "User not found" });
    }
    const fileDeleted = deleteImagefromDb(imageId);

    if (fileDeleted) {
      return res.status(200).send({ message: "File deleted" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
};

export const getAllImages = async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "Sufficient data not provided" });
    }

    const images = await db
      .collection<User>("users")
      .find({ owner: new ObjectId(userId) });

    return res.status(200).send({ message: "Successful", data: images });
  } catch (e) {
    return res.status(500).send({ message: "Server error" });
  }
};
