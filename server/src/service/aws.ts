import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

// AWS S3 Client setup
const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
});

// Set up multer storage for S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: process.env.AWS_BUCKET as string, // Your bucket name
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileName = `${Date.now()}_${file.originalname}`; // Unique filename with timestamp
            cb(null, fileName);
        },
    }),
});

// Exporting the middleware for handling single file uploads
export const uploadSingle = upload.single("imageUrl"); // 'imageUrl' is the field name for file uploads
