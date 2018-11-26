import { Injectable, EventManager, Optional } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import * as cloneDeep from 'lodash.clonedeep';
import * as originalRequest from 'request';
import {
    RxCookieJar, RxHttpRequest, RxHttpRequestResponse, Cookie, CoreOptions, Request, RequestAPI, RequiredUriUrl, RxHR
}
    from '@akanass/rx-http-request';

export { RxCookieJar, Cookie, RequestAPI, Request, CoreOptions, RequiredUriUrl, RxHttpRequestResponse };

@Injectable()
export class HttpService {
    // private property to store RxHttpRequest instance
    private _rxHR: RxHttpRequest;

    /**
     * Service constructor
     */
    constructor(@Optional() _eventManager?: EventManager) {
        if (_eventManager) {
            const clonedRequest = cloneDeep(originalRequest);
            const originalStart = clonedRequest.Request.start;
            clonedRequest.Request.prototype.start = function() {
                this.once('request', _req => {
                    _eventManager.emit('hapiness:http:begin', { req: _req });
                });
                this.once('end', _res => {
                    _eventManager.emit('hapiness:http:end', { res: _res });
                });
                Reflect.apply(originalStart, this, []);
            }
            this._rxHR = new RxHttpRequest(clonedRequest);
        } else {
            this._rxHR = RxHR;
        }
    }

    /**
     * Function to get the HTTP request object
     *
     * @return {RequestAPI<Request, CoreOptions, RequiredUriUrl>}
     */
    get request(): RequestAPI<Request, CoreOptions, RequiredUriUrl> {
        return this._rxHR.request;
    }

    /**
     * Function to do a GET HTTP request and to return a buffer
     *
     * @param uri
     * @param options
     *
     * @return {Observable<RxHttpRequestResponse>}
     */
    getBuffer(uri: string, options?: CoreOptions): Observable<RxHttpRequestResponse> {
        return this._rxHR.getBuffer(uri, options);
    }

    /**
     * Function to do a GET HTTP request
     *
     * @param uri {string}
     * @param options {CoreOptions}
     *
     * @return {Observable<RxHttpRequestResponse>}
     */
    get(uri: string, options?: CoreOptions): Observable<RxHttpRequestResponse> {
        return this._rxHR.get(uri, options);
    }

    /**
     * Function to do a POST HTTP request
     *
     * @param uri {string}
     * @param options {CoreOptions}
     *
     * @return {Observable<RxHttpRequestResponse>}
     */
    post(uri: string, options?: CoreOptions): Observable<RxHttpRequestResponse> {
        return this._rxHR.post(uri, options);
    }

    /**
     * Function to do a PUT HTTP request
     *
     * @param uri {string}
     * @param options {CoreOptions}
     *
     * @return {Observable<RxHttpRequestResponse>}
     */
    put(uri: string, options?: CoreOptions): Observable<RxHttpRequestResponse> {
        return this._rxHR.put(uri, options);
    }

    /**
     * Function to do a PATCH HTTP request
     *
     * @param uri {string}
     * @param options {CoreOptions}
     *
     * @return {Observable<RxHttpRequestResponse>}
     */
    patch(uri: string, options?: CoreOptions): Observable<RxHttpRequestResponse> {
        return this._rxHR.patch(uri, options);
    }

    /**
     * Function to do a DELETE HTTP request
     *
     * @param uri {string}
     * @param options {CoreOptions}
     *
     * @return {Observable<RxHttpRequestResponse>}
     */
    delete(uri: string, options?: CoreOptions): Observable<RxHttpRequestResponse> {
        return this._rxHR.delete(uri, options);
    }

    /**
     * Function to do a HEAD HTTP request
     *
     * @param uri {string}
     * @param options {CoreOptions}
     *
     * @return {Observable<RxHttpRequestResponse>}
     */
    head(uri: string, options?: CoreOptions): Observable<RxHttpRequestResponse> {
        return this._rxHR.head(uri, options);
    }

    /**
     * Function that creates a new rx cookie jar
     *
     * @return {Observable<RxCookieJar>}
     */
    jar(): Observable<RxCookieJar> {
        return this._rxHR.jar();
    }

    /**
     * Function that creates a new cookie
     *
     * @param str {string}
     *
     * @return {Observable<Cookie>}
     */
    cookie(str: string): Observable<Cookie> {
        return this._rxHR.cookie(str);
    }
}
