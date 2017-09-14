import { HapinessModule } from '@hapiness/core';
import { HttpService } from './services';

@HapinessModule({
    version: '1.0.0-rc.7',
    providers: [
        HttpService
    ],
    exports: [
        HttpService
    ]
})
export class HttpModule {}
