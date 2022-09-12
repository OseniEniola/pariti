import express from "express";
import maintenance from "./src/routes/maintenance";
import user from "./src/routes/user";
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import  swaggerDocument from './swagger.json';
import cors from 'cors'
import {loadData} from "./src/dto/services";

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.redirect('/api-docs'));
 app.get('/health', (req, res) => res.sendStatus(200));


app.use("/user", user);
app.use("/maintenance", maintenance);
app.listen(process.env.PORT || 3000, () => {
  // tslint:disable-next-line:no-console
  console.log(`Express is listening at http://localhost:${port}`);
  loadData();
});
