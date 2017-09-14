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

export function validateResponse<T>(this: Observable<T>, schema: Joi.Schema, ignoreStatusCodes: number[] = []): Observable<T> {
    return higherOrder<T>(schema, ignoreStatusCodes)(this);
  }

function higherOrder<T>(schema: Joi.Schema, ignoreStatusCodes: number[]): (source: Observable<T>) => Observable<any> {
    return (source: Observable<T>) => source.lift(new ValidateResponseOperator(schema, ignoreStatusCodes));
}

/**
 * Operator class definition
 */
class ValidateResponseOperator<T, R> implements Operator<T, R> {
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
    call(subscriber: Subscriber<T | R>, source: any): any {
        return source.subscribe(new ValidateResponseSubscriber(subscriber, this._schema, this._ignoreStatusCodes));
    }
}

/**
 * Operator subscriber class definition
 */
class ValidateResponseSubscriber<T, R> extends Subscriber<T> {
    /**
     * Class constructor
     *
     * @param destination subscriber destination
     * @param _source subscriber source
     * @param _schema {Joi.Schema}
     * @param _ignoreStatusCodes {number[]}
     */
    constructor(destination: Subscriber<T>,
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

                    this.destination.error(Biim.create(data.response.statusCode, data.body.message, data.body));
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
