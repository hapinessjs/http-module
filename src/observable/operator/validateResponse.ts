import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { Biim } from '@hapiness/biim';
import * as Joi from 'joi';

/**
 * New observable operator
 *
 * @param schema {Joi.Schema} - Joi Schema to validate the body response
 * @param ignoreStatusCodes - statusCodes to ignore while creating Biim error
 *
 * @return {Observable<T>|WebSocketSubject<T>}
 */

export function validateResponse<R>(
        this: Observable<any>,
        schema: Joi.Schema = Joi.any(),
        ignoreStatusCodes: number[] = []): Observable<R> {

    return higherOrder<R>(schema, ignoreStatusCodes)(this);
  }

function higherOrder<R>(schema: Joi.Schema, ignoreStatusCodes: number[]): (source: Observable<any>) => Observable<R> {
    return (source: Observable<any>) => <Observable<R>>source.lift(new ValidateResponseOperator(schema, ignoreStatusCodes));
}

/**
 * Operator class definition
 */
class ValidateResponseOperator<R> implements Operator<any, R> {
    /**
     * Class constructor
     *
     * @param _schema {Joi.Schema}
     * @param _ignoreStatusCodes {number[]}
     */
    constructor(private _schema: Joi.Schema, private _ignoreStatusCodes: number[]) {}

    /**
     * Function calls when operator is executing
     *
     * @param subscriber current subscriber
     * @param source subscriber source
     *
     * @return {AnonymousSubscription|Subscription|Promise<PushSubscription>|TeardownLogic}
     */
    call(subscriber: Subscriber<any>, source: any): any {
        return source.subscribe(new ValidateResponseSubscriber(subscriber, this._schema, this._ignoreStatusCodes));
    }
}

/**
 * Operator subscriber class definition
 */
class ValidateResponseSubscriber<R> extends Subscriber<any> {
    /**
     * Class constructor
     *
     * @param destination subscriber destination
     * @param _source subscriber source
     * @param _schema {Joi.Schema}
     * @param _ignoreStatusCodes {number[]}
     */
    constructor(destination: Subscriber<R>,
                private _schema: Joi.Schema, private _ignoreStatusCodes: number[]) {
        super(destination);
    }

    /**
     * Function to send result to next subscriber
     *
     * @param data result for next subscriber
     *
     * @private
     */
    protected _next(data: any): void {

        if (!!data.response) {
            if (data.response.statusCode >= 400 &&
                this._ignoreStatusCodes.indexOf(data.response.statusCode) < 0) {
                    if (typeof data.body === 'string') {
                        data.body = { message: data.body };
                    }
                    this.destination.error(Biim.create(data.response.statusCode, data.body.message, data.body, data.body));
            } else {
                const res = Joi.validate(data.body, this._schema, {
                    stripUnknown: {
                        arrays: false,
                        objects: true,
                    }
                });
                if (!!res.error) {
                    this.destination.error(Biim.wrap(res.error));
                } else {
                    this.destination.next(res.value);
                    this.destination.complete();
                }
            }
        }
    }
}
