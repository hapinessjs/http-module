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

@suite('- Integration HttpModuleTest method HttpService#patch')
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
     * Test if injected `HttpService` has a `patch` function
     */
    @test('- Injected `HttpService` must have `patch` function')
    testInjectableHttpServicePatch(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.patch)
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
     * Test if injected `HttpService.patch()` function returns an Observable
     */
    @test('- Injected `HttpService.patch()` function must return an Observable')
    testInjectableHttpServicePatchObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);

                rxHRMock
                    .expects('patch')
                    .returns(Observable.create(observer => {
                        observer.next('Patch Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.patch('uri'))
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
     * Test if injected `HttpService.patch()` Observable returns 'Patch Value'
     */
    @test('- Injected `HttpService.patch()` Observable function must return a string with `Patch Value` value')
    testInjectableHttpServicePatchObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);
                rxHRMock
                    .expects('patch')
                    .returns(Observable.create(observer => {
                        observer.next('Patch Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .patch('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Patch Value')
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
