import express from "express";
import bodyParser from "body-parser";import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import session from 'express-session'
import MongoStore from 'connect-mongo'
import path from "path";
import { fileURLToPath } from "url";
import { usePassport } from "./config/passport.config.js"
import { connectDB } from "./config/db.config.js";
import appRoutes from "./routes/index.js";
import {errorHandler} from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
// const dbConnection = connectDB
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//-| session store |-//
// const mongoStore = new MongoStore(session);

app.use(session({
  secret:process.env.SESSION_KEY || "HELLO WORLD",
  resave:false,
  saveUninitialized:false,
  store: MongoStore.create({mongoUrl:process.env.DB_URI}),
  cookie:{
    maxAge:2 * 24 * 60 * 60 * 1000
  }
}))
//-| passport |-//
usePassport()
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"))


//-| mount routes |-//
app.use('/api/v1', appRoutes)

//-| error handling |-//
app.use(errorHandler)


app.listen(port,  () => {
  console.log(`app listining on port ${port}`);
   connectDB(process.env.DB_URI);
});
