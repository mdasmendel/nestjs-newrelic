import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { APP_INTERCEPTOR } from '@nestjs/core';

import {ApmHttpInterceptor} from "./apm-http.interceptor";
import {ApmService} from "./apm.service";
import {ApmModule} from "../apm.module";

@Controller()
class TestController {
  @Get('/')
  public get() {
    return {
      test: 1,
    };
  }
}

describe('ApmHttpInterceptor', () => {
  let app: INestApplication;
  let apmService: ApmService;
  let spiedSetUserContext: any;

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('intercept', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [
          ApmModule.forRootAsync({
            useFactory: () => {
              return {
                httpUserMapFunction: () => {
                  return {
                    id: 1,
                    username: 'test',
                    email: 'test',
                  };
                },
              };
            },
          }),
        ],
        controllers: [TestController],
        providers: [
          {
            provide: APP_INTERCEPTOR,
            useExisting: ApmHttpInterceptor,
          },
        ],
      }).compile();

      apmService = module.get(ApmService);
      app = module.createNestApplication();
      await app.init();
    });

    it('Test if user context was applied', () => {
      spiedSetUserContext = jest.spyOn(apmService, 'setUserContext');
      return request(app.getHttpServer())
        .get('/')
        .expect(() => {
          expect(spiedSetUserContext).toBeCalledTimes(1);
          expect(spiedSetUserContext).toBeCalledWith(1, 'test', 'test');
        });
    });
  });
});
