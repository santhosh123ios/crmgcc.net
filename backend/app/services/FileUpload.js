// File: ./app/services/FileUpload.js
import multer from 'multer';
import path from 'path';

class FileUpload {
  constructor() {
    this.storage = multer.diskStorage({
      destination: './uploads/',
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

    this.upload = multer({ storage: this.storage });
  }

  single(fieldName) {
    return this.upload.single(fieldName);
  }

  // Optional: multiple(fieldName, count) { return this.upload.array(fieldName, count); }
}

const fileUploadInstance = new FileUpload();
export default fileUploadInstance;