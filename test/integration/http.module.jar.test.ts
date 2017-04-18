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

@suite('- Integration HttpModuleTest method HttpService#jar')
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
     * Test if injected `HttpService` has a `jar` function
     */
    @test('- Injected `HttpService` must have `jar` function')
    testInjectableHttpServiceJar(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                unit
                    .function(this._httpService.jar)
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
     * Test if injected `HttpService.jar()` function returns an Observable
     */
    @test('- Injected `HttpService.jar()` function must return an Observable')
    testInjectableHttpServiceJarObservable(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);

                rxHRMock
                    .expects('jar')
                    .returns(Observable.create(observer => {
                        observer.next('Jar Value');
                        observer.complete();
                    }));

                unit
                    .object(this._httpService.jar())
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
     * Test if injected `HttpService.jar()` Observable returns 'Jar Value'
     */
    @test('- Injected `HttpService.jar()` Observable function must return a string with `Jar Value` value')
    testInjectableHttpServiceJarObservableReturnString(done) {
        @Lib()
        class HttpLib {
            constructor(private _httpService: HttpService) {
                const rxHRMock = unit.mock(this._httpService['_rxHR']);
                rxHRMock
                    .expects('jar')
                    .returns(Observable.create(observer => {
                        observer.next('Jar Value');
                        observer.complete();
                    }));

                this
                    ._httpService
                    .jar()
                    .subscribe(res => {
                        unit
                            .string(res)
                            .is('Jar Value')
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
