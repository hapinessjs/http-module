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

@suite('- Integration HttpModuleTest method HttpService#get')
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
                unit
                    .object(this._httpService)
                    .isInstanceOf(HttpService)
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
     * Test if injected `HttpService` as a `get` function
     */
    @test('- Injected `HttpService` must have `get` function')
    testInjectableHttpServiceGet(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.get)
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
     * Test if injected `HttpService.get()` function returns an Observable
     */
    @test('- Injected `HttpService.get()` function must return an Observable')
    testInjectableHttpServiceGetObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const _rxHRMock = unit.mock(this._httpService['_rxHR']);

                _rxHRMock
                    .expects('get')
                    .returns(Observable.create(observer => {
                        observer.next('Get Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.get('uri'))
                    .isInstanceOf(Observable)
                    .when(_ => {
                        _rxHRMock.verify();
                        _rxHRMock.restore();
                        Hapiness.kill().subscribe(__ => done());
                    });
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
     * Test if injected `HttpService.get()` Observable returns 'Get Value'
     */
    @test('- Injected `HttpService.get()` Observable function must return a string with `Get Value` value')
    testInjectableHttpServiceGetObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const _rxHRMock = unit.mock(this._httpService['_rxHR']);
                _rxHRMock
                    .expects('get')
                    .returns(Observable.create(observer => {
                        observer.next('Get Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .get('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Get Value')
                            .when(_ => {
                                _rxHRMock.verify();
                                _rxHRMock.restore();

                                Hapiness.kill().subscribe(__ => done());
                            });
                    });
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
