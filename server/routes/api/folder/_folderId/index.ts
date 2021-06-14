import Router from "express-promise-router";
import $deleteRoot from "./root-delete";
import $getRoot from "./root-get";
import $patchRoot from "./root-patch";
import $putRoot from "./root-put";

const router = Router({
  mergeParams: true,
});
export default router;

router.delete("/", $deleteRoot);
router.put("/", $putRoot);
router.patch("/", $patchRoot);
router.get("/", $getRoot);
