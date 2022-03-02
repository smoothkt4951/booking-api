import { UserService } from 'src/user/user.service';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [
    CloudinaryProvider,
    { provide: 'CLOUD_SERVICE', useClass: CloudinaryService },
  ],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
