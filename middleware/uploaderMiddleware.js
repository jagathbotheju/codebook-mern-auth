import multer from "multer";

const filename = (req, file, next) => {
  const lastindexof = file.originalname.lastIndexOf(".");
  const ext = file.originalname.substring(lastindexof);
  next(null, `img-${Date.now()}${ext}`);
};

const destination = (req, file, next) => {
  next(null, `${__dirname}/../uploads`);
};

const uploader = multer({
  storage: multer.diskStorage({
    destination,
    filename,
  }),
});

export default uploader;
