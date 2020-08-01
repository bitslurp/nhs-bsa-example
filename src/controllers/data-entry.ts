import { Request, Response } from "express";
import { postRedirectGet } from "../utils";

export enum DataEntryInputName {
  inputA = "inputA",
}

/**
 *
 */
export default {
  /**
   * Render the data entry form with current form data or errors
   */
  getDataEntryView(req: Request, res: Response) {
    res.render("data-entry.njk", {
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
  postDataEntry: postRedirectGet({
    schema: {
      [DataEntryInputName.inputA]: {
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
   *
   */
  getSuccessView(req: Request, res: Response) {
    // TODO: Scenario should be handled so that view is not accessible
    // when data entry has not been completed with an error notification or redirect.
    res.render("success.njk", {
      inputValue: req.session.formData[DataEntryInputName.inputA],
    });
  },
};
