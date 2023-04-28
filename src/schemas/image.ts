import { ObjectId } from "bson";

//def
export interface ImageSchema {
  _id?: ObjectId;
  owner?: ObjectId;
  actualUrl: string;
  shortenUrl?: string;
}
