import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as logic from './services/logics';
import jwt from 'jsonwebtoken';


// JWT

interface AuthRequest extends Request {
    payload?: { userId: string };
}

export const jwtMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log("Inside jwt middleware - Router-level-middleware");

    // Get the token from the user request
    const token: string | undefined = req.headers['authorization']?.split(' ')[1];
    console.log(token);
    try {
        // Token verification 
        const tokenVerification: any = jwt.verify(token || '', 'superkey2024');
        console.log(tokenVerification);
        req.payload = tokenVerification.userId;
        next();
    } catch (err) {
        res.status(401).json("Authorization failed....please login again...");
    }
};


// ************************************************


// Create Express server
const server = express();

// Use CORS middleware
server.use(cors({
    origin: 'http://localhost:3000'
}));

// JSON parsing middleware
server.use(express.json());

// Define backend port
const PORT = 8000;

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/Movie'; // Replace 'yourDatabaseName' with your actual database name

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});


// Define API routes
server.get('/get-all-data', async (req: Request, res: Response) => {

    try {
        const response = await logic.getAllData();
        res.status(response.statusCode).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// add an movie
server.post('/add-movie', async (req: Request, res: Response) => {
    const userId = (req as any).payload?.userId;
    try {
        const { id, title, director, release_date, rating } = req.body;
        if (!id || !title || !director || !release_date || !rating) {
            res.status(400).json({ error: 'All fields (id, title, director, release_date, rating) are required' });
            return;
        }
        const response = await logic.addMovie(id, title, director, release_date, rating );
        res.status(response.statusCode).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.get('/get-an-item/:id', async (req: Request, res: Response) => {
    try {
        const response = await logic.getAData(req.params.id);
        res.status(response.statusCode).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.delete('/delete-an-item/:id', async (req: Request, res: Response) => {
    try {
        const response = await logic.deleteAData(req.params.id);
        res.status(response.statusCode).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.post('/update-movie/:id', async (req: Request, res: Response) => {
    try {
        const { title, director, release_date, rating } = req.body;
        const response = await logic.updateAMovie(req.params.id, title, director, release_date, rating);
        res.status(response.statusCode).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Authentication services
// registeration
server.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body
        console.log(`${username} ${email} ${password}`);
        const response = await logic.registerUser(username, email, password);
        res.status(response.statusCode).json(response)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// login
server.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const response = await logic.loginUser(email, password);
        res.status(response.statusCode).json(response)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})




// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
