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
export function validateResponse<T>(schema: Joi.Schema, ignoreStatusCodes: number[] = []): Observable<T> {
    return this.lift(new ValidateResponseOperator(this, schema, ignoreStatusCodes));
}

/**
 * Operator class definition
 */
class ValidateResponseOperator<T> implements Operator<T, T> {
    /**
     * Class constructor
     *
     * @param _source subscriber source
     * @param _schema {Joi.Schema}
     * @param _ignoreStatusCodes {number[]}
     */
    constructor(private _source: Observable<T>, private _schema: Joi.Schema, private _ignoreStatusCodes: number[]) {
    }

    /**
     * Function calls when operator is executing
     *
     * @param subscriber current subscriber
     * @param source subscriber source
     *
     * @return {AnonymousSubscription|Subscription|Promise<PushSubscription>|TeardownLogic}
     */
    call(subscriber: Subscriber<T>, source: any): any {
        return source.subscribe(new ValidateResponseSubscriber(subscriber, this._source, this._schema, this._ignoreStatusCodes));
    }
}

/**
 * Operator subscriber class definition
 */
class ValidateResponseSubscriber<T> extends Subscriber<T> {
    /**
     * Class constructor
     *
     * @param destination subscriber destination
     * @param _source subscriber source
     * @param _schema {Joi.Schema}
     * @param _ignoreStatusCodes {number[]}
     */
    constructor(destination: Subscriber<T>, private _source: Observable<T>,
                private _schema: Joi.Schema, private _ignoreStatusCodes: number[]) {
        super(destination);
    }

    /**
     * Function to send result to next subscriber
     *
     * @param value result for next subscriber
     *
     * @private
     */
    protected _next(value: T): void {
        this._source.subscribe((data: any) => {
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
        });
    }
}