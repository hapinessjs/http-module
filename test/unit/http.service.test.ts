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
     * Test if `HttpService` has a `get` function
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

    /**
     * Test if `HttpService` has a `post` function
     */
    @test('- `HttpService` must have `post` function')
    testHttpServicePost() {
        unit.function(this._httpService.post);
    }

    /**
     * Test if `HttpService.post()` function returns an Observable
     */
    @test('- `HttpService.post()` function must return an Observable')
    testHttpServicePostObservable() {
        this
            ._rxHRMock
            .expects('post')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.post('uri')).isInstanceOf(Observable);
    }

    /**
     * Test if `HttpService` has a `put` function
     */
    @test('- `HttpService` must have `put` function')
    testHttpServicePut() {
        unit.function(this._httpService.put);
    }

    /**
     * Test if `HttpService.put()` function returns an Observable
     */
    @test('- `HttpService.put()` function must return an Observable')
    testHttpServicePutObservable() {
        this
            ._rxHRMock
            .expects('put')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.put('uri')).isInstanceOf(Observable);
    }

    /**
     * Test if `HttpService` has a `patch` function
     */
    @test('- `HttpService` must have `patch` function')
    testHttpServicePatch() {
        unit.function(this._httpService.patch);
    }

    /**
     * Test if `HttpService.patch()` function returns an Observable
     */
    @test('- `HttpService.patch()` function must return an Observable')
    testHttpServicePatchObservable() {
        this
            ._rxHRMock
            .expects('patch')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.patch('uri')).isInstanceOf(Observable);
    }

    /**
     * Test if `HttpService` has a `delete` function
     */
    @test('- `HttpService` must have `delete` function')
    testHttpServiceDelete() {
        unit.function(this._httpService.delete);
    }

    /**
     * Test if `HttpService.delete()` function returns an Observable
     */
    @test('- `HttpService.delete()` function must return an Observable')
    testHttpServiceDeleteObservable() {
        this
            ._rxHRMock
            .expects('delete')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.delete('uri')).isInstanceOf(Observable);
    }

    /**
     * Test if `HttpService` has a `head` function
     */
    @test('- `HttpService` must have `head` function')
    testHttpServiceHead() {
        unit.function(this._httpService.head);
    }

    /**
     * Test if `HttpService.head()` function returns an Observable
     */
    @test('- `HttpService.head()` function must return an Observable')
    testHttpServiceHeadObservable() {
        this
            ._rxHRMock
            .expects('head')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.head('uri')).isInstanceOf(Observable);
    }

    /**
     * Test if `HttpService` has a `jar` function
     */
    @test('- `HttpService` must have `jar` function')
    testHttpServiceJar() {
        unit.function(this._httpService.jar);
    }

    /**
     * Test if `HttpService.jar()` function returns an Observable
     */
    @test('- `HttpService.jar()` function must return an Observable')
    testHttpServiceJarObservable() {
        this
            ._rxHRMock
            .expects('jar')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.jar()).isInstanceOf(Observable);
    }

    /**
     * Test if `HttpService` has a `cookie` function
     */
    @test('- `HttpService` must have `cookie` function')
    testHttpServiceCookie() {
        unit.function(this._httpService.cookie);
    }

    /**
     * Test if `HttpService.cookie()` function returns an Observable
     */
    @test('- `HttpService.cookie()` function must return an Observable')
    testHttpServiceCookieObservable() {
        this
            ._rxHRMock
            .expects('cookie')
            .returns(Observable.create(observer => {
                observer.next();
                observer.complete();
            }));

        unit.object(this._httpService.cookie('str')).isInstanceOf(Observable);
    }
}
