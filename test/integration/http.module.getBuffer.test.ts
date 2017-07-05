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
import { Observable } from 'rxjs/Observable';

// element to test
import { HttpModule, HttpService } from '../../src';

@suite('- Integration HttpModuleTest method HttpService#getBuffer')
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
     * Test if injected `HttpService` has a `get` function
     */
    @test('- Injected `HttpService` must have `getBuffer` function')
    testInjectableHttpServiceGetBuffer(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.getBuffer)
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

    /**
     * Test if injected `HttpService.getBuffer()` function returns an Observable
     */
    @test('- Injected `HttpService.getBuffer()` function must return an Observable')
    testInjectableHttpServiceGetBufferObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);

                rxHRMock
                    .expects('getBuffer')
                    .returns(Observable.create(observer => {
                        observer.next('GetBuffer Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.getBuffer('uri'))
                    .isInstanceOf(Observable)
                    .when(_ => {
                        rxHRMock.verify();
                        rxHRMock.restore();
                        Hapiness['extensions'].pop().value.stop().then(__ => done());
                    });
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

    /**
     * Test if injected `HttpService.getBuffer()` Observable returns 'GetBuffer Value'
     */
    @test('- Injected `HttpService.getBuffer()` Observable function must return a string with `GetBuffer Value` value')
    testInjectableHttpServiceGetBufferObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);
                rxHRMock
                    .expects('getBuffer')
                    .returns(Observable.create(observer => {
                        observer.next('GetBuffer Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .getBuffer('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('GetBuffer Value')
                            .when(_ => {
                                rxHRMock.verify();
                                rxHRMock.restore();

                                Hapiness['extensions'].pop().value.stop().then(__ => done());
                            });
                    });
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
