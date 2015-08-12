[![npm version](https://badge.fury.io/js/ember-content-editable.svg)](http://badge.fury.io/js/ember-content-editable)
[![build status](https://travis-ci.org/AddJam/ember-content-editable.svg)](https://travis-ci.org/AddJam/ember-content-editable)

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
isText               | Is the value HTML or plaintext?                | `false`
stringInterpolator   | Function which processes / intercepts any updated value. Takes a string and returns the  string to be used instead.           | none
extraClass           | String with any extra css class.               | `null`
editable             | Is the element editable?                       | `true`

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

### Customizing Placeholder Color
```
.ember-content-editable:empty {
  color: rgba(0,0,0,0.6);
}
```

## Common Problems

### Extra Tags
Some browsers have a bug where extra tags including `<div>`s get inserted into contenteditable fields, usually when newlines are entered.

1) If you don't care about any tags, use `isText=true` to strip all of them.  
2) If you do care about tags, either use `display: inline-block` on the content-editable component (simplest solution) or pass a function as `stringInterpolator=myInterpolator` to remove extra text.

```
myInterpolator(inputString) {
  /* Remove extra tags */
  return stringWithNoDivs;
}
```

## License

The MIT License (MIT)

Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
