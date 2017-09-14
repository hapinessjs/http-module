/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';
import * as Joi from 'joi';
import { Observable } from 'rxjs';
import '../../src/observable/add/validateResponse';

@suite('- Unit HttpServiceTest file')
export class ValidateResponseTest {

    @test('- `validateResponse` validate OK')
    test1() {
        Observable
            .of({ body: 123, response: { statusCode: 200 } })
            .validateResponse(Joi.number())
            .subscribe(
                _ => unit.number(_).is(123)
            );
    }

    @test('- `validateResponse` validate NOK')
    test2() {
        Observable
            .of({ body: 123, response: { statusCode: 200 } })
            .validateResponse(Joi.string())
            .subscribe(
                null,
                _ => unit.object(_).isInstanceOf(Error)
            );
    }

    @test('- `validateResponse` wrong statusCode')
    test3() {
        Observable
            .of({ body: 123, response: { statusCode: 400 } })
            .validateResponse(Joi.number())
            .subscribe(
                null,
                _ => unit.object(_).isInstanceOf(Error)
            );
    }

    @test('- `validateResponse` wrong statusCode but ignored')
    test4() {
        Observable
            .of({ body: 123, response: { statusCode: 400 } })
            .validateResponse(Joi.number(), [ 400 ])
            .subscribe(
                _ => unit.number(_).is(123)
            );
    }

    @test('- `validateResponse` clean object returned')
    test5() {
        Observable
            .of({ body: { data: true, __v: 1 }, response: { statusCode: 200 } })
            .validateResponse(Joi.object().keys({ data: Joi.boolean().required() }))
            .subscribe(
                _ => unit.object(_).is({ data: true })
            );
    }

    @test('- `validateResponse` wrong income data')
    test6() {
        Observable
            .of({})
            .validateResponse(Joi.object().keys({ data: Joi.boolean().required() }))
            .subscribe();
    }

    @test('- `validateResponse` schema any')
    test7() {
        Observable
            .of({ body: { data: true, __v: 1 }, response: { statusCode: 200 } })
            .validateResponse(Joi.any())
            .subscribe(
                _ => unit.object(_).is({ data: true, __v: 1 })
            );
    }

}
