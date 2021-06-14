import Router from "express-promise-router";
import {authViaAuthToken, bodyParser} from "src";
import folderSchemas from "../../../src/mongoDB/models/folderSchemas";

const router = Router();
export default router;

/**
 * @api {post} /folder Создать новый элемент классификации
 * @apiVersion 2.0.0
 * @apiName CreateFolder
 * @apiGroup Folders
 * @apiPermission Модератор
 *
 * @apiParam {boolean} isMain Флаг корневого элемента
 * @apiParam {ArrayObject} malgorithm Список идентификаторов алгоритмов, содержащихся в папке
 * @apiParam {Object} name Название элемента классификации
 * @apiParam {ArrayObject} subFolders Список идентификаторов подпапок, содержащихся в папке
 *
 * @apiSuccess (Created 201) {Object} name Название элемента классификации
 * @apiSuccess (Created 201) {ArrayObject} subFolders Список идентификаторов подпапок, содержащихся в папке
 *
 * @apiUse v200CommonErrors
 * @apiUse v200AuthViaAuthToken
 */

router.use(authViaAuthToken, bodyParser(), async (req, res) => {
  try {
    const folder = await folderSchemas.create({
      isMain: req.body.isMain,
      malgorithm: req.body.malgorithm,
      name: req.body.name,
      subFolders: req.body.subFolders,
    });

    res.status(201).json({
      name: folder.name,
      subFolders: folder.subFolders,
    });
  } catch (e) {
    res.status(400).json({message: "error"});
  }
});
