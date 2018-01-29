<img src="http://bit.ly/2mxmKKI" width="500" alt="Hapiness" />

<div style="margin-bottom:20px;">
<div style="line-height:60px">
    <a href="https://travis-ci.org/hapinessjs/http-module.svg?branch=master">
        <img src="https://travis-ci.org/hapinessjs/http-module.svg?branch=master" alt="build" />
    </a>
    <a href="https://coveralls.io/github/hapinessjs/http-module?branch=master">
        <img src="https://coveralls.io/repos/github/hapinessjs/http-module/badge.svg?branch=master" alt="coveralls" />
    </a>
    <a href="https://david-dm.org/hapinessjs/http-module">
        <img src="https://david-dm.org/hapinessjs/http-module.svg" alt="dependencies" />
    </a>
    <a href="https://david-dm.org/hapinessjs/http-module?type=dev">
        <img src="https://david-dm.org/hapinessjs/http-module/dev-status.svg" alt="devDependencies" />
    </a>
</div>
<div>
    <a href="https://www.typescriptlang.org/docs/tutorial.html">
        <img src="https://cdn-images-1.medium.com/max/800/1*8lKzkDJVWuVbqumysxMRYw.png"
             align="right" alt="Typescript logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="http://reactivex.io/rxjs">
        <img src="http://reactivex.io/assets/Rx_Logo_S.png"
             align="right" alt="ReactiveX logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="http://hapijs.com">
        <img src="http://bit.ly/2lYPYPw"
             align="right" alt="Hapijs logo" width="75" style="border:none;" />
    </a>
</div>
</div>

# Http Module

`Http` Module for the [Hapiness](https://github.com/hapinessjs/hapiness) framework, allowing user to deal with `http` request.

## Table of contents

* [Using http module inside Hapiness application](#using-http-module-inside-hapiness-application)
    * [Yarn or NPM it in your package.json](#yarn-or-npm-it-in-your-packagejson)
    * [Import HttpModule](#import-httpmodule)
    * [Use it anywhere](#use-it-anywhere)
* [Validate Response](#validateResponse-operator)
* [API in Detail](#api-in-detail)
* [Contributing](#contributing)
* [Change History](#change-history)
* [Maintainers](#maintainers)
* [License](#license)
    
## Using http module inside Hapiness application

### `yarn` or `npm` it in your `package.json`

```bash
$ npm install --save @hapiness/http @hapiness/biim @hapiness/core rxjs

or

$ yarn add @hapiness/http @hapiness/biim @hapiness/core rxjs
```

```javascript
"dependencies": {
    "@hapiness/biim": "^1.4.0",
    "@hapiness/core": "^1.3.0",
    "@hapiness/http": "^1.1.2",
    "rxjs": "^5.5.6",
    //...
}
//...
```

### import `HttpModule`

```javascript
import { HapinessModule } from '@hapiness/core';
import { HttpModule } from '@hapiness/http';

@HapinessModule({
    version: '1.0.0',
    declarations: [
        LibWithHttpCalls
    ],
    imports: [
        HttpModule
    ]
})
class HapinessModuleNeedsHttpModule {}
```

### use it anywhere

You can use `HttpService` anywhere in your module with **dependency injection**.

```javascript
import { Lib } from '@hapiness/core';
import { HttpService } from '@hapiness/http';

@Lib()
class LibWithHttpCalls {
    constructor(private _http: HttpService){}
    
    crawlWebPage(): void {
        this._http.get('http://www.google.fr').subscribe(
            (data) => {
        
                if (data.response.statusCode === 200) {
                    console.log(data.body); // Show the HTML for the Google homepage.
                }
            },
            (err) => console.error(err) // Show error in console
        );
    }
}
```

[Back to top](#table-of-contents)

## validateResponse operator

Format your data with the Joi Schema validation and throw an error in the Observable if statusCode >= 400

`validateResponse(<Joi.Schema>, [ignoredStatusCodes?])`

```javascript
import { Lib } from '@hapiness/core';
import { HttpService } from '@hapiness/http';
import '@hapiness/http/observable/add/validateResponse';

@Lib()
class LibWithHttpCalls {
    constructor(private _http: HttpService){}
    
    crawlWebPage(): void {
        this._http.get('http://my-api/data')
            .validateResponse(MySchema)
            .subscribe(
                (data) => console.log(data),
                (err) => console.error(err) // Show error in console
            );
    }
}
```

## API in Detail

This module is an **encapsulation** of [Rx-Http-Request](https://github.com/njl07/rx-http-request) library to allow their features inside [Hapiness](https://github.com/hapinessjs/hapiness) framework.

Methods implemented are:

* `.request`
* `.get(uri[, options])`
* `.getBuffer(uri[, options])`
* `.post(uri[, options])`
* `.put(uri[, options])`
* `.patch(uri[, options])`
* `.delete(uri[, options])`
* `.head(uri[, options])`
* `.jar()`
* `.cookie(str)`

If you want to have all **details** for these methods, see [Rx-Http-Request's API details](https://github.com/njl07/rx-http-request#api-in-detail).

[Back to top](#table-of-contents)

## Contributing

To set up your development environment:

1. clone the repo to your workspace,
2. in the shell `cd` to the main folder,
3. hit `npm or yarn install`,
4. run `npm or yarn run test`.
    * It will lint the code and execute all tests. 
    * The test coverage report can be viewed from `./coverage/lcov-report/index.html`.

[Back to top](#table-of-contents)

## Change History
* v1.1.2 (2018-01-29)
    * Latest packages' versions.
    * Documentation.
    * Fix error message on body.
* v1.1.1 (2017-11-20)
    * Latest packages' versions.
    * Documentation.
    * Change packaging process.
* v1.0.0 (2017-10-12)
    * First stable version
    * Implementation of all features.
    * Version related to `core` version
    
[Back to top](#table-of-contents)

## Maintainers

<table>
    <tr>
        <td colspan="4" align="center"><a href="https://www.tadaweb.com"><img src="http://bit.ly/2xHQkTi" width="117" alt="tadaweb" /></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil"><img src="https://avatars3.githubusercontent.com/u/6546204?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/antoinegomez"><img src="https://avatars3.githubusercontent.com/u/997028?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/reptilbud"><img src="https://avatars3.githubusercontent.com/u/6841511?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/njl07"><img src="https://avatars3.githubusercontent.com/u/1673977?v=3&s=117" width="117"/></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil">Julien Fauville</a></td>
        <td align="center"><a href="https://github.com/antoinegomez">Antoine Gomez</a></td>
        <td align="center"><a href="https://github.com/reptilbud">Sébastien Ritz</a></td>
        <td align="center"><a href="https://github.com/njl07">Nicolas Jessel</a></td>
    </tr>
</table>

[Back to top](#table-of-contents)

## License

Copyright (c) 2017 **Hapiness** Licensed under the [MIT license](https://github.com/hapinessjs/http-module/blob/master/LICENSE.md).

[Back to top](#table-of-contents)
