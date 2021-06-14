import Router from "express-promise-router";
import folderSchemas from "../../../../src/mongoDB/models/folderSchemas";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {delete} /folder/:folderId Удалить папку или подпапку классификации
 * @apiVersion 2.0.0
 * @apiName DeleteFolder
 * @apiGroup Folders
 * @apiPermission Модератор
 *
 *
 * @apiParam {ObjectId} :folderId ID папки или подпапки
 *
 * @apiUse v200CommonErrors
 * @apiUse v200AuthViaAuthToken
 */
router.use(async (req, res) => {
  await folderSchemas.findByIdAndDelete(req.params.folderId);

  res.status(201).send();
});
