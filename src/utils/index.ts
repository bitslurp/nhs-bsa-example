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
 *
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
        res.status(303).location(successPath).send();
      } else {
        // Adds dictionary of form errors to session for home view to feedback errors to users
        req.session.formErrors = errors.mapped();
        res.status(303).location(errorPath).send();
      }
    },
  ];
};
