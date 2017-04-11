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
import { HelloWorldModule, HelloWorldService } from '../../src';

@suite('- Integration HelloWorldModuleTest file')
class HelloWorldModuleTest {
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
     * Test if sayHello GET route returns `Hello World`
     */
    @test('- check if `sayHello` GET route returns `Hello World`')
    testSayHelloGetRoute(done) {
        @HapinessModule({
            version: '1.0.0',
            options: {
                host: '0.0.0.0',
                port: 4443
            },
            imports: [
                HelloWorldModule
            ]
        })
        class HelloWorldModuleTest implements OnStart {
            constructor(private _httpServer: HttpServer) {}

            onStart(): void {
                this._httpServer.instance.inject('/sayHello', reply => unit.string(reply.result).is('Hello World')
                        .when(_ => Hapiness.kill().subscribe(__ => done())));
            }
        }

        Hapiness.bootstrap(HelloWorldModuleTest);
    }

    /**
     * Test if injected service is an instance of HelloWorldService
     */
    @test('- Injected service must be an instance of `HelloWorldService`')
    testInjectableHelloWorldService(done) {
        @Lib()
        class HelloWorldLib {
            constructor(private _helloWorldService: HelloWorldService) {
                unit.object(this._helloWorldService).isInstanceOf(HelloWorldService)
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
                HelloWorldModule
            ],
            declarations: [
                HelloWorldLib
            ]
        })
        class HelloWorldModuleTest {}

        Hapiness.bootstrap(HelloWorldModuleTest);
    }

    /**
     * Test if injected `HelloWorldService` as a `sayHello` function
     */
    @test('- Injected `HelloWorldService` must have `sayHello` function')
    testInjectableHelloWorldServiceSayHello(done) {
        @Lib()
        class HelloWorldLib {
            constructor(private _helloWorldService: HelloWorldService) {
                unit.function(this._helloWorldService.sayHello)
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
                HelloWorldModule
            ],
            declarations: [
                HelloWorldLib
            ]
        })
        class HelloWorldModuleTest {}

        Hapiness.bootstrap(HelloWorldModuleTest);
    }

    /**
     * Test if injected `HelloWorldService.sayHello()` function returns an Observable
     */
    @test('- Injected `HelloWorldService.sayHello()` function must return an Observable')
    testInjectableHelloWorldServiceSayHelloObservable(done) {
        @Lib()
        class HelloWorldLib {
            constructor(private _helloWorldService: HelloWorldService) {
                unit.object(this._helloWorldService.sayHello()).isInstanceOf(Observable)
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
                HelloWorldModule
            ],
            declarations: [
                HelloWorldLib
            ]
        })
        class HelloWorldModuleTest {}

        Hapiness.bootstrap(HelloWorldModuleTest);
    }

    /**
     * Test if injected `HelloWorldService.sayHello()` Observable returns 'Hello World'
     */
    @test('- Injected `HelloWorldService.sayHello()` Observable function must return a string with `Hello World` value')
    testInjectableHelloWorldServiceSayHelloObservableReturnString(done) {
        @Lib()
        class HelloWorldLib {
            constructor(private _helloWorldService: HelloWorldService) {
                this._helloWorldService.sayHello().subscribe(m => unit.string(m).is('Hello World')
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
                HelloWorldModule
            ],
            declarations: [
                HelloWorldLib
            ]
        })
        class HelloWorldModuleTest {}

        Hapiness.bootstrap(HelloWorldModuleTest);
    }
}
