import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const morganFormat = ':method :url :status :response-time ms';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(' ')[0],
            url: message.split(' ')[1],
            status: message.split(' ')[2],
            responseTime: message.split(' ')[3],
          };
          logger.debug(JSON.stringify(logObject));
        },
      },
    }),
  );
  app.enableCors();
  const port: number = 5002;
  await app.listen(port);
  logger.localInstance.debug(`App listening on port: ${port} 🚀`);
}
bootstrap();
