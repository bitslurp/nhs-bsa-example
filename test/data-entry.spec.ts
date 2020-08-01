import { expect } from "chai";
import supertest from "supertest";
import { JSDOM } from "jsdom";

import server from "../src/server";
import { DataEntryInputName } from "../src/controllers/data-entry";

const { APP_USERNAME, APP_PASSWORD } = process.env;
const { inputA } = DataEntryInputName;
describe("GET data entry form", () => {
  it("should return a 200 status and the form view within the response body", (done) => {
    supertest(server)
      .get("/")
      .auth(APP_USERNAME, APP_PASSWORD)
      .expect("Content-type", /html/)
      .expect(200)
      .end((err, response) => {
        // Use JSDOM to make response testing more idiomatic
        const dom = new JSDOM(response.text);
        const inputElement = dom.window.document.getElementById(
          inputA
        ) as HTMLInputElement;
        expect(inputElement).to.exist;
        expect(inputElement.value).to.be.eq("");

        done();
      });
  });
});

describe("POST entry data with invalid input", () => {
  let request: supertest.SuperTest<supertest.Test>;
  before(() => {
    request = supertest.agent(server);
  });

  it("should return a redirect response to data entry page because of invalid form input", (done) => {
    request
      .post("/")
      .send({ inputA: "0123456789A" })
      .auth(APP_USERNAME, APP_PASSWORD)

      .expect(303)
      .expect("location", "/", done);
  });

  it("should display the form view with an error message", () => {
    return request
      .get("/")
      .auth(APP_USERNAME, APP_PASSWORD)
      .expect("Content-type", /html/)
      .expect(200)
      .then((response) => {
        const dom = new JSDOM(response.text);
        const { document } = dom.window;
        const inputElement = document.getElementById(
          inputA
        ) as HTMLInputElement;
        expect(inputElement).to.exist;
        expect(inputElement.value).to.be.eq("0123456789A");

        const inputErrorElement = document.getElementById("inputA-error");
        expect(inputErrorElement.textContent).to.include(
          "be no more than 10 characters"
        );
      });
  });

  it("should not display error when reloading the form", () => {
    return request
      .get("/")
      .auth(APP_USERNAME, APP_PASSWORD)
      .expect("Content-type", /html/)
      .expect(200)
      .then((response) => {
        const dom = new JSDOM(response.text);
        const { document } = dom.window;
        const inputElement = document.getElementById(
          inputA
        ) as HTMLInputElement;
        expect(inputElement).to.exist;
        expect(inputElement.value).to.be.eq("0123456789A");

        const inputErrorElement = document.getElementById(`${inputA}-error`);
        expect(inputErrorElement).not.to.exist;
      });
  });
});

describe("POST entry data with valid input", () => {
  const validInputValue = "0123456789";
  let request: supertest.SuperTest<supertest.Test>;
  before(() => {
    request = supertest.agent(server);
  });

  it("should return a redirect response to success page", (done) => {
    request
      .post("/")
      .send({ inputA: validInputValue })
      .auth(APP_USERNAME, APP_PASSWORD)

      .expect(303)
      .expect("location", "/success", done);
  });

  it("should display the input value on success page", () => {
    return request
      .get("/success")
      .auth(APP_USERNAME, APP_PASSWORD)
      .expect("Content-type", /html/)
      .expect(200)
      .then((response) => {
        expect(response.text).includes(validInputValue);
      });
  });
});
