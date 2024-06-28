"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static('dist/public'));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../src/index.html'));
});
app.post('/create-json', (req, res) => {
    res.json({ message: 'Hello, world!' });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
