import { Module } from '@nestjs/common'
import { CloudinaryProvider } from './cloudinary.provider'
import { CloudinaryService } from './cloudinary.service'
@Module({
  providers: [
    CloudinaryService,
    CloudinaryProvider,
    CloudinaryService,
    { provide: 'CLOUD_SERVICE', useClass: CloudinaryService },
  ],
  exports: [CloudinaryService, 'Cloudinary'],
})
export class CloudinaryModule {}