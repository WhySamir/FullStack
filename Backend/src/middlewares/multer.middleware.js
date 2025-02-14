import multer from "multer";
//multer used for storing files temporary before storing into cloud
//advantage:validation file type,errorhandling,Security
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
