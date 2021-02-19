# nestjs-elastic
[NestJS](https://github.com/nestjs/nest) Newrelic APM library.

## Installation
```shell script
npm i nestjs-elastic --save
```
or
```shell script
yarn add nestjs-elastic
```

## Usage
```typescript
import { ApmErrorInterceptor, ApmHttpInterceptor } from 'nestjs-newrelic';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(app.get(ApmErrorInterceptor), app.get(ApmHttpInterceptor));

  await app.listen(3000);
}
bootstrap();
```

As NestJS is not allowing you to use some sort of `ConfigService` there you need to add to your repository [dotenv](https://www.npmjs.com/package/dotenv) package or something similar to pass configuration.

## Adding ApmModule

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApmModule } from 'elastic-apm-nest';

@Module({
  imports: [
    ApmModule.forRootAsync({
      useFactory: async () => {
        return {
          httpUserMapFunction: (req: any) => {
            return {
              id: req.user?.id,
              username: req.user?.username,
              email: req.user?.email,
            };
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Default ApmHttpInterceptor behavior
It won't set UserContext in transaction if `httpUserMapFunction` is not provided
This method is starting the web transaction and ends it once response is being send.

### ToDo
- [] Inject current transaction via decorator
- [] Add tests

