import { Observable } from 'rxjs';
import { Injectable } from '@hapiness/core';

@Injectable()
export class HttpService {
    /**
     * Function to say Hello World
     * @return {Observable<string>}
     */
    sayHello(): Observable<string> {
        return Observable.create(observer => {
            observer.next('Hello World');
            observer.complete();
        });
    }
}
