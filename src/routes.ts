/**
 * Create all route -> controller mappings in this file.
 */

import { Router } from "express";
import dataEntryController from "./controllers/data-entry";

const router = Router();

router
  .route("/")
  .get(dataEntryController.getDataEntryView)
  .post(...dataEntryController.postDataEntry);

router.route("/success").get(dataEntryController.getSuccessView);

export default router;
