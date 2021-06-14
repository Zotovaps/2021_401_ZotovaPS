import Router from "express-promise-router";

import _folderId from "./_folderId";
import $getRoot from "./root-get";
import $postRoot from "./root-post";

const router = Router();
export default router;

router.use("/:folderId", _folderId);
router.get("/", $getRoot);
router.post("/", $postRoot);
