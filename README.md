[![npm version](https://badge.fury.io/js/ember-content-editable.svg)](http://badge.fury.io/js/ember-content-editable)

# ember-content-editable

Ember cli content-editable component, with placeholder and value binding. Use it just like an `input` or `textarea`, but it will autoresize for you. It also works in [almost all browsers](http://caniuse.com/contenteditable).

## Installation

`ember install ember-content-editable`

## Usage

Use it just like `input` or `textarea`.

```javascript
{{content-editable value=name
                   placeholder="Your name"}}
```

You can also pass in an extra CSS class if required, and of course specify the tag.

```javascript
{{content-editable value=name
                   placeholder="Your name"
                   extraClass="name-field"
                   tagName="h3"}}
```

### Options

Option Name          | Description                                    | Default
---------------------|------------------------------------------------|---------
value                | The value to be edited                         | `""`
placeholder          | Placeholder displayed when value is blank      | `""`
isText               | Is the value HTML or plaintext?                | `true`
stringInterpolator   | Function which processes / intercepts any updated value. Takes a string and returns the  string to be used instead.           | none
extraClass           | String with any extra css class.               | `null`

### Events
You can also provide actions to handle the following events

| Event Name     |
|----------------|
| key-up         |
| key-down       |
| key-press      |
| escape-press   |
| enter          |
| insert-newline |
| focus-in       |
| focus-out      |
| mouse-enter    |
| mouse-leave    |

For example:
```javascript
{{content-editable value=name
                   placeholder="Your name"
                   enter="save"}}
```

## License

The MIT License (MIT)

Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
