import {
  checkSchema,
  Schema,
  validationResult,
  ValidationChain,
} from "express-validator";
import { Request, Response } from "express";

export interface PostRedirectGetConfig {
  /** Express Validator schema to validate post body
   * https://express-validator.github.io/docs/schema-validation.html
   */
  schema: Schema;
  /**  Path to redirect get request to when there are no validadtion issues */
  successPath: string;
  /**  Path to redirect get request to when there are validadtion errors */
  errorPath: string;
}

/**
 * Generate an Express validaion chain array and a request handler for POST-redirect-GET
 *
 * Could be more configurable.
 * @param config Configuration options for generated validator and request handler
 */
export const postRedirectGet = ({
  schema,
  successPath,
  errorPath,
}: PostRedirectGetConfig): [
  ValidationChain[],
  (req: Request, res: Response) => void
] => {
  return [
    checkSchema(schema),
    (req: Request, res: Response) => {
      const errors = validationResult(req);

      req.session.formData = req.body;

      if (errors.isEmpty()) {
        delete req.session.formErrors;
        seeOther(res, successPath);
      } else {
        // Adds dictionary of form errors to session for home view to feedback errors to users
        req.session.formErrors = errors.mapped();
        seeOther(res, errorPath);
      }
    },
  ];
};

const seeOther = (res: Response, path: string) =>
  res.status(303).location(path).send();
