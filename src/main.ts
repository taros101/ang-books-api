import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json({limit: '50mb'})); // I added
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // I added
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
