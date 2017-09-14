import { Observable } from 'rxjs/Observable';
import { validateResponse } from '../operator/validateResponse';

Observable.prototype.validateResponse = validateResponse;

declare module 'rxjs/Observable' {
    interface Observable<T> {
        validateResponse: typeof validateResponse;
    }
}
