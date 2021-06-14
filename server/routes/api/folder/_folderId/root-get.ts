import Router from "express-promise-router";
import {authViaAuthToken, bodyParser} from "src";
import {log} from "util";
import folderSchemas from "../../../../src/mongoDB/models/folderSchemas";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {patch} /algorithms/:algorithmId Изменить алгоритм
 * @apiVersion 2.0.0
 * @apiName ChangeAlgorithm
 * @apiGroup Algorithms
 * @apiPermission Пользователь
 *
 * @apiParam {string="1..9223372036854775807"} :algorithmId ID алгоритма
 * @apiParam {string} [name] Имя алгоритма
 * @apiParam {string} [description] Описание алгоритма
 *
 * @apiUse v200CommonErrors
 * @apiUse v200AuthViaAuthToken
 */
router.use(async (req, res) => {
  const folders = await folderSchemas.find();
  folders.map((folder) => {
    findRecurs(folder, req.params.folderId, res);
  });

  res.status(404).send();
});

const findRecurs = (folder: any, folderId: string, res: any) => {
  if (folder._id.toString() === folderId) {
    res.status(200).send(folder);
  } else if (folder.subFolders.isEmpty) {
    return null;
  } else {
    folder.subFolders.map((subFolder: any) => {
      findRecurs(subFolder, folderId, res);
    });
    return null;
  }
};
