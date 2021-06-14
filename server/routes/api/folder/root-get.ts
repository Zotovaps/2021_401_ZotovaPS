import Router from "express-promise-router";
import folderSchemas, {
  IFolder,
} from "../../../src/mongoDB/models/folderSchemas";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {get} /folder Получить все папки классификации
 * @apiVersion 2.0.0
 * @apiName ListFolders
 * @apiGroup Folders
 * @apiPermission Пользователь
 *
 * @apiSuccess {object[]} folder Данные
 *
 * @apiUse v200CommonErrors
 */

const recursionNumeration: any = (folder: any, index: any) => {
  try {
    folder.subFolders.map((subFolder: any, subIndex: any) => {
      const num = index + (subIndex + 1) + ".";
      // @ts-ignore
      subFolder.name.ru = num + " " + subFolder.name.ru;
      // @ts-ignore
      subFolder.name.en = num + " " + subFolder.name.en;

      if (subFolder.subFolders.length > 0) {
        subFolder = recursionNumeration(subFolder, num);
      } else {
        return subFolder;
      }
    });

    return folder;
  } catch (e) {
    return folder;
  }
};

router.use(async (req, res) => {
  const folders = await folderSchemas
    .find({
      isMain: true,
    })
    .populate({
      path: "subFolders malgorithm",
      select: "index name description determinantsCount",
      populate: {
        path: "malgorithm subFolders",
        select: "index name description determinantsCount",
        populate: {
          path: "malgorithm subFolders",
          select: "index name description determinantsCount",
          populate: {
            path: "malgorithm subFolders",
            select: "index name description determinantsCount",
            populate: {
              path: "malgorithm subFolders",
              select: "index name description determinantsCount",
              populate: {
                path: "malgorithm subFolders",
                select: "index name description determinantsCount",
                populate: {
                  path: "malgorithm subFolders",
                  select: "index name description determinantsCount",
                  populate: {
                    path: "malgorithm subFolders",
                    select: "index name description determinantsCount",
                  },
                },
              },
            },
          },
        },
      },
    });

  folders.map((folder, index) => {
    const num = index + 1 + ".";
    folder.name.ru = num + " " + folder.name.ru;
    folder.name.en = num + " " + folder.name.en;

    if (folder.subFolders.length > 0) {
      folder = recursionNumeration(folder, num);
    }
  });

  res.status(200).send(folders);
});
