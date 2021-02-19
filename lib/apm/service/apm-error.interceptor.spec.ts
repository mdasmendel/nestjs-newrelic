import {Controller, Get, INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {APP_INTERCEPTOR} from '@nestjs/core';

import {ApmService} from "./apm.service";
import {ApmModule} from "../apm.module";
import {ApmErrorInterceptor} from "./apm-error.interceptor";

jest.createMockFromModule('newrelic');

@Controller()
class TestController {
    @Get('/')
    public get() {
        throw new Error('test error');
    }
}

describe('ApmErrorInterceptor', () => {
    let app: INestApplication;
    let apmService = new ApmService();

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [ApmModule.forRootAsync()],
            controllers: [TestController],
            providers: [
                {
                    provide: APP_INTERCEPTOR,
                    useValue: new ApmErrorInterceptor(apmService),
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Test if captureError was called', () => {
        const captureErrMock = spyOn(apmService, 'captureError')
        return request(app.getHttpServer())
            .get('/')
            .expect(() => {
                expect(captureErrMock).toHaveBeenCalledTimes(1);
                expect(captureErrMock).toHaveBeenCalledWith(new Error('test error'));
            });
    });
});
