import { ObjectId } from "bson";

//def
export interface User {
  _id?: ObjectId;
  userName: string;
  password: string;
}
