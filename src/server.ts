require("dotenv").config();

// external dependencies
import express from "express";
import nunjucks from "nunjucks";
import basicAuth from "express-basic-auth";
import session from "express-session";
import bodyParser from "body-parser";
import helmet from "helmet";

// local dependencies
import routes from "./routes";

const app = express();

nunjucks.configure(
  ["src/views", "node_modules/nhsuk-frontend/packages/components"],
  {
    autoescape: true,
    express: app,
    watch: process.env.NODE_ENV === "development",
  }
);

app.use(helmet());

// Add basic auth for demo deployment purposes
app.use(
  basicAuth({
    users: { [process.env.APP_USERNAME]: process.env.APP_PASSWORD },
    challenge: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: +process.env.SESSION_DURATION },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to serve static NHS assets
app.use(express.static("public"));
app.use(
  "/nhsuk-frontend",
  express.static("node_modules/nhsuk-frontend/packages")
);
app.use("/nhsuk-frontend", express.static("node_modules/nhsuk-frontend/dist"));

// Application routes
app.use("/", routes);

export default app;
