import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as mongoose from "mongoose";
import {Algorithm, authViaAuthToken, bodyParser, Joi} from "src";
import folderSchemas from "../../../../src/mongoDB/models/folderSchemas";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {patch} /folder/:folderId Изменить название папки или редактирование списка алгоритмов папки
 * @apiVersion 2.0.0
 * @apiName ChangeFolder
 * @apiGroup Folders
 * @apiPermission Модератор
 *
 * @apiParam {ObjectId} :folderId ID папки или подпапки
 * @apiParam {string} [name] Имя алгоритма
 * @apiParam {string} [description] Описание алгоритма
 *
 * @apiUse v200CommonErrors
 * @apiUse v200AuthViaAuthToken
 */
router.use(authViaAuthToken, bodyParser(), async (req, res) => {
  const folder = await folderSchemas.findById(req.params.folderId);
  if (folder != null) {
    if (req.headers.type === "deleteAlgorithm") {
      folder.malgorithm.splice(folder.malgorithm.indexOf(req.body.id), 1);
      folder.save();
      res.status(204).send();
    }
    if (req.headers.type === "editFolder") {
      folder.isMain = req.body.isMain ? req.body.isMain : folder.isMain;
      folder.malgorithm = req.body.malgorithm
        ? req.body.malgorithm
        : folder.malgorithm;
      folder.name = req.body.name ? req.body.name : folder.name;
      folder.subFolders = req.body.subFolders
        ? req.body.subFolders
        : folder.subFolders;
      folder.save();
      res.status(204).send();
    }
  }

  res.status(404).send();
});
