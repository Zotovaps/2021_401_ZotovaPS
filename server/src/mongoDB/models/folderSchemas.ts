import {ObjectID} from "mongodb";
import * as mongoose from "mongoose";
import {Schema, Types} from "mongoose";
import malgorithmSchemas, {IAlgorithm} from "./malgorithmSchemas";

const folderSchemas: mongoose.Schema = new mongoose.Schema();
folderSchemas.add({
  isMain: {
    required: true,
    type: Boolean,
  },
  malgorithm: [
    {
      ref: "Algorithm",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  name: {
    required: true,
    type: {
      ru: String,
      en: String,
    },
  },
  subFolders: [
    {
      ref: "Folder",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

export interface IFolder extends mongoose.Document {
  isMain: boolean;
  subFolders: [ObjectID | IFolder];
  name: {
    ru: string;
    en: string;
  };
  malgorithm: [ObjectID | IAlgorithm];
}

export default mongoose.model<IFolder>("Folder", folderSchemas);
