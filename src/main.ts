import { TimeoutExceptionInterceptor } from './common/interceptors/timeout-exception.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  // app.useGlobalFilters(new HttpExceptionFilter())
  // app.useGlobalInterceptors(new TimeoutExceptionInterceptor())
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.enableCors()

  const options = new DocumentBuilder()
    .setTitle('BookingAPI')
    .setDescription('Contemi Intern Web Dev')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
