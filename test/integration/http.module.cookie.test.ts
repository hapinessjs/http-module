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

@suite('- Integration HttpModuleTest method HttpService#cookie')
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
     * Test if injected `HttpService` has a `cookie` function
     */
    @test('- Injected `HttpService` must have `cookie` function')
    testInjectableHttpServiceCookie(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.cookie)
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
     * Test if injected `HttpService.cookie()` function returns an Observable
     */
    @test('- Injected `HttpService.cookie()` function must return an Observable')
    testInjectableHttpServiceCookieObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const _rxHRMock = unit.mock(this._httpService['_rxHR']);

                _rxHRMock
                    .expects('cookie')
                    .returns(Observable.create(observer => {
                        observer.next('Cookie Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.cookie('uri'))
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
     * Test if injected `HttpService.cookie()` Observable returns 'Cookie Value'
     */
    @test('- Injected `HttpService.cookie()` Observable function must return a string with `Cookie Value` value')
    testInjectableHttpServiceCookieObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const _rxHRMock = unit.mock(this._httpService['_rxHR']);
                _rxHRMock
                    .expects('cookie')
                    .returns(Observable.create(observer => {
                        observer.next('Cookie Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .cookie('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Cookie Value')
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
