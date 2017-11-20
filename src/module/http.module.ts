import { HapinessModule } from '@hapiness/core';
import { HttpService } from './services';

@HapinessModule({
    version: '1.1.0',
    providers: [
        HttpService
    ],
    exports: [
        HttpService
    ]
})
export class HttpModule {}
