/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Hapiness, HapinessModule, Lib } from '@hapiness/core';
import { HttpServerExt } from '@hapiness/core/extensions/http-server';

// element to test
import { HttpModule, HttpService } from '../../src';

@suite('- Integration HttpModuleTest method HttpService#request')
class HttpModuleTest {
    /**
     * Function executed before the suite
     */
    static before() {}

    /**
     * Function executed after the suite
     */
    static after() {}

    /**
     * Class constructor
     * New lifecycle
     */
    constructor() {}

    /**
     * Function executed before each test
     */
    before() {}

    /**
     * Function executed after each test
     */
    after() {}

    /**
     * Test if injected `HttpService` has a `request` function
     */
    @test('- Injected `HttpService` must have `request` function')
    testInjectableHttpServicePut(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.request)
                    .when(_ => Hapiness['extensions'].pop().value.stop().then(__ => done()));
            }
        }

        @HapinessModule({
            version: '1.0.0',
            imports: [
                HttpModule
            ],
            declarations: [
                HttpLib
            ]
        })
        class HttpModuleTest {}

        Hapiness.bootstrap(HttpModuleTest, [HttpServerExt.setConfig({
                host: '0.0.0.0',
                port: 4443
        })]);
    }
}
