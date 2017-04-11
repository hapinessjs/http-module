/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Observable } from 'rxjs/Observable';

// element to test
import { HttpService } from '../../src';

@suite('- Unit HttpServiceTest file')
class HttpServiceTest {
    // private property to store service instance
    private _httpService: HttpService;

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
    before() {
        this._httpService = new HttpService();
    }

    /**
     * Function executed after each test
     */
    after() {
        this._httpService = undefined;
    }

    /**
     * Test if `HttpService` as a `sayHello` function
     */
    @test('- `HttpService` must have `sayHello` function')
    testHttpServiceSayHello() {
        unit.function(this._httpService.sayHello);
    }

    /**
     * Test if `HttpService.sayHello()` function returns an Observable
     */
    @test('- `HttpService.sayHello()` function must return an Observable')
    testHttpServiceSayHelloObservable() {
        unit.object(this._httpService.sayHello()).isInstanceOf(Observable);
    }
    /**
     * Test if `HttpService.sayHello()` Observable returns 'Hello World'
     */
    @test('- `HttpService.sayHello()` Observable function must return a string with `Hello World` value')
    testHttpServiceSayHelloObservableReturnString(done) {
        this._httpService.sayHello().subscribe(m => unit.string(m).is('Hello World').when(_ => done()));
    }
}
