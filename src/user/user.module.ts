import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
// import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, CloudinaryService],
  exports: [UserService],
})
export class UserModule {}
