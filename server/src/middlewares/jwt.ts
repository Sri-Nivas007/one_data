import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secretKey = process.env.SECRET_KEY as string; // Ensuring secretKey is a string

// Function to generate a token
const generateToken = async (id: string): Promise<string> => {
    // The token will include the username, email, and password (if needed, although storing passwords in JWT is not recommended)
    const token = await jwt.sign({ id }, secretKey);
    console.log("Generated Token:", token);
    return token;
};

// Middleware to verify the token
const verifyToken = (req: any, res: any, next: () => void): void => {
    const authHeader = req.headers.authorization;

    // If the token is not provided
    if (!authHeader) {
        return res.status(400).send("Unauthorized");
    }

    // Assuming the token is passed as 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    console.log("token", token);

    // Verify the token
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            return res.status(400).send("Invalid token");
        }

        // Assuming the decoded token contains a user_id, attach it to req.body
        if (decoded) {
            console.log("decoded", decoded);
            req.userId = decoded.id; // Attach user_id to request body
        } else {
            return res.status(400).send("Token does not contain user_id");
        }

        // Proceed to the next middleware or route handler
        next(); // Proceed to the next middleware or route handler
    });
};

export { generateToken, verifyToken };
