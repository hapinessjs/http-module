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

    // private property to store mock instance of RxHR
    private _rxHRMock: any;

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
        this._rxHRMock = unit.mock(this._httpService['_rxHR']);
    }

    /**
     * Function executed after each test
     */
    after() {
        this._httpService = undefined;
        this._rxHRMock = undefined;
    }

    /**
     * Test if `HttpService` as a `get` function
     */
    @test('- `HttpService` must have `get` function')
    testHttpServiceGet() {
        unit.function(this._httpService.get);
    }

    /**
     * Test if `HttpService.get()` function returns an Observable
     */
    @test('- `HttpService.get()` function must return an Observable')
    testHttpServiceGetObservable() {
        this
            ._rxHRMock
            .expects('get')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.get('uri')).isInstanceOf(Observable);
    }
}
