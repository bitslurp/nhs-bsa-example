import { Request, Response } from "express";
import { validationResult, body } from "express-validator";
import { postRedirectGet } from "../utils";

enum InputName {
  inputA = "input-a",
}

export default {
  /**
   * Render the home page form with current form data or errors
   */
  getHomeForm(req: Request, res: Response) {
    res.render("home.njk", {
      formErrors: req.session.formErrors,
      formData: req.session.formData,
    });

    // Prevent errors from rendering on subsequent invocations
    delete req.session.formErrors;
  },

  /**
   * Applies form validation then redirects to success page or back to previous step depending
   * upon result.
   */
  handleFormSubmission: postRedirectGet({
    schema: {
      [InputName.inputA]: {
        isLength: {
          errorMessage:
            "Value is required and must be no more than 10 characters",

          options: {
            min: 1,
            max: 10,
          },
        },
      },
    },
    successPath: "/success",
    errorPath: "/",
  }),

  /**
   * Render a success page witht the users form data
   */
  getSuccessHandler(req: Request, res: Response) {
    res.render("success.njk", {
      inputValue: req.session.formData[InputName.inputA],
    });
  },
};
