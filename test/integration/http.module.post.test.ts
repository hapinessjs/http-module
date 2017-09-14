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

@suite('- Integration HttpModuleTest method HttpService#post')
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
     * Test if injected `HttpService` has a `post` function
     */
    @test('- Injected `HttpService` must have `post` function')
    testInjectableHttpServicePost(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.post)
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
     * Test if injected `HttpService.post()` function returns an Observable
     */
    @test('- Injected `HttpService.post()` function must return an Observable')
    testInjectableHttpServicePostObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);

                rxHRMock
                    .expects('post')
                    .returns(Observable.create(observer => {
                        observer.next('Post Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.post('uri'))
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
     * Test if injected `HttpService.post()` Observable returns 'Post Value'
     */
    @test('- Injected `HttpService.post()` Observable function must return a string with `Post Value` value')
    testInjectableHttpServicePostObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);
                rxHRMock
                    .expects('post')
                    .returns(Observable.create(observer => {
                        observer.next('Post Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .post('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Post Value')
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
