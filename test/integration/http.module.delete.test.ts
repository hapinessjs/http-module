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

@suite('- Integration HttpModuleTest method HttpService#delete')
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
     * Test if injected `HttpService` has a `delete` function
     */
    @test('- Injected `HttpService` must have `delete` function')
    testInjectableHttpServiceDelete(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.delete)
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
     * Test if injected `HttpService.delete()` function returns an Observable
     */
    @test('- Injected `HttpService.delete()` function must return an Observable')
    testInjectableHttpServiceDeleteObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);

                rxHRMock
                    .expects('delete')
                    .returns(Observable.create(observer => {
                        observer.next('Delete Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.delete('uri'))
                    .isInstanceOf(Observable)
                    .when(_ => {
                        rxHRMock.verify();
                        rxHRMock.restore();
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
     * Test if injected `HttpService.delete()` Observable returns 'Delete Value'
     */
    @test('- Injected `HttpService.delete()` Observable function must return a string with `Delete Value` value')
    testInjectableHttpServiceDeleteObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);
                rxHRMock
                    .expects('delete')
                    .returns(Observable.create(observer => {
                        observer.next('Delete Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .delete('uri')
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Delete Value')
                            .when(_ => {
                                rxHRMock.verify();
                                rxHRMock.restore();

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
