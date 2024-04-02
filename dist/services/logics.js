"use strict";
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
exports.loginUser = exports.registerUser = exports.updateAMovie = exports.deleteAData = exports.getAData = exports.addMovie = exports.getAllData = void 0;
const db_1 = __importDefault(require("./db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Getting all data from MongoDB
const getAllData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.posts.find();
        if (result) {
            return {
                statusCode: 200,
                datafrmdb: result
            };
        }
        else {
            return {
                statusCode: 404,
                message: "Cannot find data"
            };
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            message: "Internal Server Error"
        };
    }
});
exports.getAllData = getAllData;
// add a data to the mongodb
const addMovie = (id, title, director, release_date, rating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingMovie = yield db_1.default.posts.findOne({ id });
        if (existingMovie) {
            return {
                statusCode: 404,
                message: 'Movie already exists'
            };
        }
        else {
            const newMovie = new db_1.default.posts({ id, title, director, release_date, rating });
            yield newMovie.save();
            return {
                statusCode: 200,
                message: 'Movie added successfully!'
            };
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            message: 'Internal Server Error'
        };
    }
});
exports.addMovie = addMovie;
// Get a single data from MongoDB based on id
const getAData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.posts.findOne({ id });
        if (result) {
            return {
                statusCode: 200,
                datafrmdb: result
            };
        }
        else {
            return {
                statusCode: 404,
                message: "Cannot find the data"
            };
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            message: "Internal Server Error"
        };
    }
});
exports.getAData = getAData;
// Delete a single data from MongoDB based on id
const deleteAData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.posts.deleteOne({ id });
        if (result) {
            return {
                statusCode: 200,
                message: "Item deleted Successfully !"
            };
        }
        else {
            return {
                statusCode: 404,
                message: "Cannot find the data"
            };
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            message: "Internal Server Error"
        };
    }
});
exports.deleteAData = deleteAData;
// update a movie details
const updateAMovie = (id, title, director, release_date, rating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = yield db_1.default.posts.findOne({ id });
        if (!movie) {
            return {
                statusCode: 404,
                message: 'Cannot find the Movie'
            };
        }
        // Update the employee details
        movie.id = id;
        movie.title = title;
        movie.director = director;
        movie.release_date = release_date;
        movie.rating = rating;
        // Save the updated data into the database
        yield movie.save();
        return {
            statusCode: 200,
            message: 'Movie updated successfully'
        };
    }
    catch (error) {
        console.error('Error updating Movie:', error);
        return {
            statusCode: 500,
            message: 'Internal Server Error'
        };
    }
});
exports.updateAMovie = updateAMovie;
// register
const registerUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield db_1.default.users.findOne({ email });
        if (existingUser) {
            return {
                statusCode: 404,
                message: 'User already Exists'
            };
        }
        else {
            const newUser = new db_1.default.users({
                username, email, password
            });
            yield newUser.save(); //data saved in mongodb
            return {
                statusCode: 200,
                message: 'User created successfully'
            };
        }
    }
    catch (err) {
        console.error('Error updating User:', err);
        return {
            statusCode: 500,
            message: 'Internal Server Error'
        };
    }
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.default.users.findOne({ email, password });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, "superkey2024");
            console.log(token);
            return {
                statusCode: 200,
                result: user, token
            };
        }
        else {
            return {
                statusCode: 404,
                message: 'User doesnot Exists'
            };
        }
    }
    catch (err) {
        console.error('Error Logging User:', err);
        return {
            statusCode: 500,
            message: 'Internal Server Error'
        };
    }
});
exports.loginUser = loginUser;
// Export functions for use in other files
exports.default = {
    getAllData: exports.getAllData,
    getAData: exports.getAData,
    deleteAData: exports.deleteAData,
    updateAMovie: exports.updateAMovie
};
