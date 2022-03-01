import { UserService } from 'src/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    CloudinaryProvider,
    { provide: 'CLOUD_SERVICE', useClass: CloudinaryService },
  ],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
