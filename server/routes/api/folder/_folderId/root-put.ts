import * as Console from "console";
import Router from "express-promise-router";
import {ObjectID} from "mongodb";
import mongodb = require("mongodb");
import {authViaAuthToken, bodyParser} from "src";
import {log} from "util";
import folderSchemas from "../../../../src/mongoDB/models/folderSchemas";
import malgorithmSchemas from "../../../../src/mongoDB/models/malgorithmSchemas";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {put} /folder/:folderId Добавить подпапку или алгоритм в соответствующую папку
 * @apiVersion 2.0.0
 * @apiName AddFolder
 * @apiGroup Folders
 * @apiPermission Модератор
 *
 * @apiParam {ObjectId} :folderId ID папки или подпапки
 *
 * @apiUse v200CommonErrors
 * @apiUse v200AuthViaAuthToken
 */

router.use(authViaAuthToken, bodyParser(), async (req, res) => {
  const folder = await folderSchemas.findById(req.params.folderId);

  if (folder != null) {
    if (req.headers.type === "malgorithm") {
      const malgorithm = await malgorithmSchemas.find({
        index: Number(req.body.index),
      });
      folder.malgorithm.push(malgorithm[0]._id);
    }
    if (req.headers.type === "subFolders") {
      const subFolder = await folderSchemas.create({
        isMain: false,
        malgorithm: req.body.malgorithm,
        name: req.body.name,
        subFolders: req.body.subFolders,
      });
      folder.subFolders.push(subFolder._id);
    }
    folder.save();
    return res.status(204).send(folder);
  }

  res.status(404).send();
});
