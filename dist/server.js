"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const maintenance_1 = __importDefault(require("./src/routes/maintenance"));
const user_1 = __importDefault(require("./src/routes/user"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const cors_1 = __importDefault(require("cors"));
const services_1 = require("./src/dto/services");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.get('/', (req, res) => res.redirect('/api-docs'));
app.get('/health', (req, res) => res.sendStatus(200));
app.use("/user", user_1.default);
app.use("/maintenance", maintenance_1.default);
app.listen(process.env.PORT || 3000, () => {
    // tslint:disable-next-line:no-console
    console.log(`Express is listening at http://localhost:${port}`);
    (0, services_1.loadData)();
});
