import Router from "express-promise-router";

const router = Router();
export default router;

import algorithms from "./algorithms";
import malgorithms from "./malgorithms";
import folder from "./folder";
import signin from "./signin";
import user from "./user";

router.use("/algorithms", algorithms);
router.use("/malgorithms", malgorithms);
router.use("/signin", signin);
router.use("/user", user);
router.use("/folder", folder);

/**
 * @apiDefine v200CommonErrors
 *
 * @apiError (Bad Request 400) {string="BAD_REQUEST"} code Код ошибки
 * @apiError (Bad Request 400) {string} message Подробное описание ошибки
 *
 * @apiError (Payload Too Large 413) {string="PAYLOAD_TOO_LARGE"} code Код ошибки
 * @apiError (Payload Too Large 413) {string} message Подробное описание ошибки
 *
 * @apiError (Internal Server Error 500) {string="INTERNAL_SERVER_ERROR"} code Код ошибки
 * @apiError (Internal Server Error 500) {string} message Подробное описание ошибки
 */
