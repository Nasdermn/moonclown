import multer from 'multer';
import { Request } from 'express';
import generateFileName from '../utils/fileNameGenerator';
import usersService from '../services/users.service';

function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts[parts.length - 1];
}

const storage = multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, callback: Function) {
    callback(null, 'images/');
  },
  filename: async function (
    req: Request,
    file: Express.Multer.File,
    callback: Function,
  ) {
    const id = (req as any).user._id;
    const user = await usersService.getUserById(id);
    const email = user.email;
    const extension = getFileExtension(file.originalname);
    const fileName = generateFileName(email, extension);
    callback(null, fileName);
  },
});

const types = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (types.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
