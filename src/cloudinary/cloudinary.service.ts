import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(path, file) {
    try {
      const fileName = file.filename.split('.')[0];
      const folderCloud = `booking-api-cvn/${fileName}`;
      const uploader = await v2.uploader.upload(path, {
        public_id: folderCloud,
      });
      console.log({ uploader });
      return uploader.url;
    } catch (err) {
      console.log(err);
    }
  }
}
