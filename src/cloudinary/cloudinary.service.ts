import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(path) {
    try {
      const uploader = await v2.uploader.upload(path);
      console.log({ uploader });
      return uploader.url;
    } catch (err) {
      console.log(err);
    }
  }
}
