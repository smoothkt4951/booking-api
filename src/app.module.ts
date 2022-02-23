import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { RedisMiddleware } from './auth/redis.middleware';
import { RolesGuard } from './auth/roles.guard';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            // isGlobal property to true so this module is loaded on every other module (if you don’t set this, you’ll have to add the ConfigModule to the imports of every module where you have to use the .env information).
        }),
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
            synchronize: true,
        }),
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
            }),
            inject: [ConfigService],
        }),
        // RedisModule.forRootAsync({
        //     imports: [ConfigModule],
        //     useFactory: (configService: ConfigService) =>
        //         configService.get('redis'), // or use async method
        //     //useFactory: async (configService: ConfigService) => configService.get('redis'),
        //     inject: [ConfigService],
        // }),
        RedisModule.forRoot({
            readyLog: true,
            config: {
                host: 'localhost',
                port: 6379,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('users');
        consumer
            .apply(RedisMiddleware)
            .exclude(
                {
                    path: 'auth/login',
                    method: RequestMethod.POST,
                },
                {
                    path: 'auth/register',
                    method: RequestMethod.POST,
                },
                {
                    path: 'auth/logout',
                    method: RequestMethod.POST,
                },
            )
            .forRoutes('*');
    }
}
