import {DynamicModule, FactoryProvider, Global, Module, Provider} from '@nestjs/common';
import {ApmService} from './service';
import {
    APM_OPTIONS, defaultApmOptions,
} from './constants';
import {ApmAsyncOptions, ApmOptions} from './interface';
import {ApmHttpInterceptor} from './service';
import {ApmErrorInterceptor} from './service';

const providers: Provider[] = [
    ApmService,
    ApmErrorInterceptor,
    {
        provide: ApmHttpInterceptor,
        useFactory: (apmService: ApmService, apmOptions: ApmOptions) => {
            return new ApmHttpInterceptor(
                apmService,
                apmOptions.httpUserMapFunction,
            );
        },
        inject: [ApmService, APM_OPTIONS],
    },
];

@Global()
@Module({})
export class ApmModule {
    public static forRootAsync(options: ApmAsyncOptions = {}): DynamicModule {
        const asyncProviders: FactoryProvider = {
            provide: APM_OPTIONS,
            useFactory:
                options.useFactory ||
                (() => {
                    return defaultApmOptions;
                }),
            inject: options.inject,
        };

        return {
            exports: [
                ApmService,
                APM_OPTIONS,
            ],
            module: ApmModule,
            providers: [asyncProviders, ...providers],
        };
    }
}
