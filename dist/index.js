"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const logic = __importStar(require("./services/logics"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtMiddleware = (req, res, next) => {
    var _a;
    console.log("Inside jwt middleware - Router-level-middleware");
    // Get the token from the user request
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    console.log(token);
    try {
        // Token verification 
        const tokenVerification = jsonwebtoken_1.default.verify(token || '', 'superkey2024');
        console.log(tokenVerification);
        req.payload = tokenVerification.userId;
        next();
    }
    catch (err) {
        res.status(401).json("Authorization failed....please login again...");
    }
};
exports.jwtMiddleware = jwtMiddleware;
// ************************************************
// Create Express server
const server = (0, express_1.default)();
// Use CORS middleware
server.use((0, cors_1.default)({
    origin: 'http://localhost:3000'
}));
// JSON parsing middleware
server.use(express_1.default.json());
// Define backend port
const PORT = 8000;
// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/Movie'; // Replace 'yourDatabaseName' with your actual database name
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});
// Define API routes
server.get('/get-all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield logic.getAllData();
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// add an movie
server.post('/add-movie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const { id, title, director, release_date, rating } = req.body;
        if (!id || !title || !director || !release_date || !rating) {
            res.status(400).json({ error: 'All fields (id, title, director, release_date, rating) are required' });
            return;
        }
        const response = yield logic.addMovie(id, title, director, release_date, rating);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
server.get('/get-an-item/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield logic.getAData(req.params.id);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
server.delete('/delete-an-item/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield logic.deleteAData(req.params.id);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
server.post('/update-movie/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, director, release_date, rating } = req.body;
        const response = yield logic.updateAMovie(req.params.id, title, director, release_date, rating);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Authentication services
// registeration
server.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        console.log(`${username} ${email} ${password}`);
        const response = yield logic.registerUser(username, email, password);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// login
server.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const response = yield logic.loginUser(email, password);
        res.status(response.statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
