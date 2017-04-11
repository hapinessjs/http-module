import { HapinessModule } from '@hapiness/core';
import { GetHelloWorldRoute } from './routes';
import {HelloWorldService } from './services';

@HapinessModule({
    version: '1.0.0',
    declarations: [
        GetHelloWorldRoute
    ],
    providers: [
        HelloWorldService
    ],
    exports: [
        HelloWorldService
    ]
})
export class HelloWorldModule {}
