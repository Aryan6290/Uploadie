import aws from "aws-sdk";
import { ObjectID, ObjectId } from "bson";
import * as fs from "fs";
import { getDatabase } from "../../src/database";
import { Data } from "./../config";
import { ImageSchema } from "../schemas/image";
import AWS from "aws-sdk";
export const uploads3 = async (params: aws.S3.PutObjectRequest) => {
  const s3 = new aws.S3({});
  return new Promise((resolve: any) => {
    s3.upload(params, (err: any, data: any) => {
      if (err) throw new Error("error");
      else {
        resolve(data.Location);
      }
    });
  });
};

export const uploadImage = async (imageSource?: string): Promise<string> => {
  try {
    let imageUrl: string;
    if (!imageSource || imageSource === "") return undefined;
    if (!imageSource.startsWith("https://")) {
      let temp = "jpeg";
      if (imageSource.charAt(0) === "/") {
        temp = "jpg";
      } else if (imageSource.charAt(0) === "i") {
        temp = "png";
      }
      const localFileName = `image-${new Date().getTime()}-${Math.floor(
        100000 + Math.random() * 900000
      )}.${temp}`;
      fs.writeFileSync(`data/${localFileName}`, imageSource, {
        encoding: "base64",
      });

      // const file = fs.readdirSync('data');
      // const file = fs.readFileSync(localFileName);
      const signedUrl = `https://assets-cdn.dinefyne.com/${localFileName}`;

      imageUrl = signedUrl;

      const params = {
        // ACL: 'public-read',
        Bucket: "dinefyne-user-assets",
        Body: fs.createReadStream(`data/${localFileName}`),
        Key: `${localFileName}`,
      };

      await uploads3(params);

      fs.unlinkSync(`data/${localFileName}`);
    } else {
      imageUrl = imageSource;
    }
    return imageUrl;
  } catch (err) {
    throw new Error("Failed to upload image");
  }
};

export const deleteImagefromDb = async (id: ObjectID) => {
  const db = getDatabase();
  const image = await db
    .collection<ImageSchema>("images")
    .findOne({ _id: new ObjectId(id) });

  const s3 = new AWS.S3({
    accessKeyId: Data.AWS_ACCESS_KEY,
    secretAccessKey: Data.AWS_SECRET_KEY,
  });

  const key = image.actualUrl.split("/").pop();
  const fileDeleted = await s3.deleteObject({
    Bucket: "farmart-assignment",
    Key: key,
  });
  if (!fileDeleted) {
    return false;
  }
  const imageDeleted = await db
    .collection<ImageSchema>("users")
    .findOneAndDelete({ owner: new ObjectId(id) });

  if (!imageDeleted.ok) {
    return false;
  }

  return true;
};
