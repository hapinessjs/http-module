/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Hapiness, HapinessModule, HttpServer, Lib, OnStart } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

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
                    .when(_ => Hapiness.kill().subscribe(__ => done()));
            }
        }

        @HapinessModule({
            version: '1.0.0',
            options: {
                host: '0.0.0.0',
                port: 4443
            },
            imports: [
                HttpModule
            ],
            declarations: [
                HttpLib
            ]
        })
        class HttpModuleTest {}

        Hapiness.bootstrap(HttpModuleTest);
    }
}
