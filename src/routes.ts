/**
 * Create all route -> controller mappings in this file.
 */

import { Router } from "express";
import homeController from "./controllers/home";

const router = Router();

router
  .route("/")
  .get(homeController.getHomeForm)
  .post(...homeController.handleFormSubmission);

router.route("/success").get(homeController.getSuccessHandler);

export default router;
