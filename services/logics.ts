// Importing db module
import { response } from 'express';
import db from './db';
import jwt from 'jsonwebtoken';


// Define interface for MongoDB document
interface posts {
    id: string;
    // Other properties as per your document structure
}

// Define interface for response object
interface ApiResponse {
    statusCode: number;
    message?: string;
    datafrmdb?: any;
}

// Getting all data from MongoDB
export const getAllData = async (): Promise<ApiResponse> => {
    try {
        const result = await db.posts.find();
        if (result) {
            return {
                statusCode: 200,
                datafrmdb: result
            };
        } else {
            return {
                statusCode: 404,
                message: "Cannot find data"
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal Server Error"
        };
    }
};

// add a data to the mongodb
export const addMovie = async (id: string, title: string, director: string, release_date: string, rating: string): Promise<{ statusCode: number; message: string }> => {

    try {
        const existingMovie = await db.posts.findOne({ id });
        if (existingMovie) {
            return {
                statusCode: 404,
                message: 'Movie already exists'
            };
        } else {
            const newMovie = new db.posts({ id, title, director, release_date, rating });
            await newMovie.save();
            return {
                statusCode: 200,
                message: 'Movie added successfully!'
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: 'Internal Server Error'
        };
    }
};

// Get a single data from MongoDB based on id
export const getAData = async (id: string): Promise<ApiResponse> => {
    try {
        const result = await db.posts.findOne({ id });
        if (result) {
            return {
                statusCode: 200,
                datafrmdb: result
            };
        } else {
            return {
                statusCode: 404,
                message: "Cannot find the data"
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal Server Error"
        };
    }
};

// Delete a single data from MongoDB based on id
export const deleteAData = async (id: string): Promise<ApiResponse> => {
    try {
        const result = await db.posts.deleteOne({ id });
        if (result) {
            return {
                statusCode: 200,
                message: "Item deleted Successfully !"
            };
        } else {
            return {
                statusCode: 404,
                message: "Cannot find the data"
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal Server Error"
        };
    }
};

// update a movie details
export const updateAMovie = async (id: string, title: string, director: string, release_date: string, rating: string) => {
    try {
        const movie = await db.posts.findOne({ id });
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
        await movie.save();

        return {
            statusCode: 200,
            message: 'Movie updated successfully'
        };
    } catch (error) {
        console.error('Error updating Movie:', error);
        return {
            statusCode: 500,
            message: 'Internal Server Error'
        };
    }
};

// register
export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const existingUser = await db.users.findOne({ email })
        if (existingUser) {
            return {
                statusCode: 404,
                message: 'User already Exists'
            };
        }
        else {
            const newUser = new db.users({
                username, email, password
            })
            await newUser.save()//data saved in mongodb
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
}

export const loginUser = async (email: string, password: string) => {
    try {
        const user = await db.users.findOne({ email, password });
        if (user) {
            const token = jwt.sign({ userId: user._id }, "superkey2024");
            console.log(token);
            return {
                statusCode: 200,
                result: user, token
            }
        } else {
            return {
                statusCode: 404,
                message: 'User doesnot Exists'
            };
        }
    } catch (err) {
        console.error('Error Logging User:', err);
        return {
            statusCode: 500,
            message: 'Internal Server Error'
        };
    }
}


// Export functions for use in other files
export default {
    getAllData,
    getAData,
    deleteAData,
    updateAMovie
};
