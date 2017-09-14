/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Hapiness, HapinessModule, Lib } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

// element to test
import { HttpModule, HttpService } from '../../src';

@suite('- Integration HttpModuleTest method HttpService#head')
export class HttpModuleTest {
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
     * Test if injected `HttpService` has a `head` function
     */
    @test('- Injected `HttpService` must have `head` function')
    testInjectableHttpServiceHead(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.head)
                    .when(_ => done());
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

        Hapiness.bootstrap(HMTest, []);
    }

    /**
     * Test if injected `HttpService.head()` function returns an Observable
     */
    @test('- Injected `HttpService.head()` function must return an Observable')
    testInjectableHttpServiceHeadObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);

                rxHRMock
                    .expects('head')
                    .returns(Observable.create(observer => {
                        observer.next('Head Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.head('uri'))
                    .isInstanceOf(Observable)
                    .when(_ => {
                        rxHRMock.verify();
                        rxHRMock.restore();
                        done();
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

        Hapiness.bootstrap(HMTest, []);
    }

    /**
     * Test if injected `HttpService.head()` Observable returns 'Head Value'
     */
    @test('- Injected `HttpService.head()` Observable function must return a string with `Head Value` value')
    testInjectableHttpServiceHeadObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);
                rxHRMock
                    .expects('head')
                    .returns(Observable.create(observer => {
                        observer.next('Head Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .head('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Head Value')
                            .when(_ => {
                                rxHRMock.verify();
                                rxHRMock.restore();

                                done();
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

        Hapiness.bootstrap(HMTest, []);
    }
}
