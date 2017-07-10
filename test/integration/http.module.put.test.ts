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

@suite('- Integration HttpModuleTest method HttpService#put')
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
     * Test if injected `HttpService` has a `put` function
     */
    @test('- Injected `HttpService` must have `put` function')
    testInjectableHttpServicePut(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.put)
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
        class HMTest {}

        Hapiness.bootstrap(HMTest, [HttpServerExt.setConfig({
                host: '0.0.0.0',
                port: 4443
        })]);
    }

    /**
     * Test if injected `HttpService.put()` function returns an Observable
     */
    @test('- Injected `HttpService.put()` function must return an Observable')
    testInjectableHttpServicePutObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);

                rxHRMock
                    .expects('put')
                    .returns(Observable.create(observer => {
                        observer.next('Put Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.put('uri'))
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
        class HMTest {}

        Hapiness.bootstrap(HMTest, [HttpServerExt.setConfig({
                host: '0.0.0.0',
                port: 4443
        })]);
    }

    /**
     * Test if injected `HttpService.put()` Observable returns 'Put Value'
     */
    @test('- Injected `HttpService.put()` Observable function must return a string with `Put Value` value')
    testInjectableHttpServicePutObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);
                rxHRMock
                    .expects('put')
                    .returns(Observable.create(observer => {
                        observer.next('Put Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .put('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Put Value')
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
        class HMTest {}

        Hapiness.bootstrap(HMTest, [HttpServerExt.setConfig({
                host: '0.0.0.0',
                port: 4443
        })]);
    }
}
