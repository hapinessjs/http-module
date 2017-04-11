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

@suite('- Integration HttpModuleTest file')
class HttpdModuleTest {
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
     * Test if injected service is an instance of HttpService
     */
    @test('- Injected service must be an instance of `HttpService`')
    testInjectableHttpService(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit.object(this._httpService).isInstanceOf(HttpService)
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

    /**
     * Test if injected `HttpService` as a `sayHello` function
     */
    @test('- Injected `HttpService` must have `sayHello` function')
    testInjectableHttpServiceSayHello(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit.function(this._httpService.sayHello)
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

    /**
     * Test if injected `HttpService.sayHello()` function returns an Observable
     */
    @test('- Injected `HttpService.sayHello()` function must return an Observable')
    testInjectableHttpServiceSayHelloObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit.object(this._httpService.sayHello()).isInstanceOf(Observable)
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

    /**
     * Test if injected `HttpService.sayHello()` Observable returns 'Hello World'
     */
    @test('- Injected `HttpService.sayHello()` Observable function must return a string with `Hello World` value')
    testInjectableHttpServiceSayHelloObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                this._httpService.sayHello().subscribe(m => unit.string(m).is('Hello World')
                        .when(_ => Hapiness.kill().subscribe(__ => done())));
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
