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
                   placeholder="Your name"
                   type="text"}}
```

You can also pass in an extra CSS class if required, and of course specify the tag.

```javascript
{{content-editable value=name
                   placeholder="Your name"
                   class="name-field"
                   tagName="h3"}}
```

### Options

Option Name          | Description                                    | Default
---------------------|------------------------------------------------|---------
value                | The value to be edited                         | `""`
placeholder          | Placeholder displayed when value is blank      | `""`
stringInterpolator   | Function which processes / intercepts any updated value. Takes a string and returns the string to be used instead.           | none
class                | String with any extra css class               | none
type                 | `number`, `text`, or `html`                    | `html`
spellcheck           | Uses browsers spellcheck, same as with `<input>` | none
readonly             | If true, element can't be edited but is focusable | false
disabled             | If true, element can't be edited, focused or tabbed to | false

##### isText Deprecation
isText has been deprecated. You should replace `isText=true` with `type="text"`, and `isText=false` with `type="html"`.

##### editable Deprecation
`editable` has been deprecated in favour of `disabled` to be more consistent with
standard input tags.

### Events
You can provide actions to handle the following list of events. Arguments passed to your action are consistent with Ember implementations in places like the `{{input}}` helper. `value` is the current value of the content-editable field, `component` is the component instance itself, and `event` is the corresponding raw event object.

| Event Name     | Arguments
|----------------|----------------
| key-up         | value, event
| key-down       | value, event
| key-press      | component, event
| escape-press   | component, event
| enter          | component, event
| insert-newline | component, event
| focus-in       | component, event
| focus-out      | component, event
| mouse-enter    | component, event
| mouse-leave    | component, event

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

### Filtering Input
If you want to filter the input, you can achieve this using the `key-press` event.

The following example filters the input to only allow numerical values.

```
{{content-editable value=age key-press=filter}}
```

```
  filter(currentValue, event) {
    const keyCode = event.which;
    if (keyCode <= 48 || keyCode >= 58) {
      event.preventDefault();
    }
  },
```

### Extra Tags
Some browsers have a bug where extra tags including `<div>`s get inserted into contenteditable fields, usually when newlines are entered.

1) If you don't care about any tags, use `type="text"` to strip all of them.
2) If you do care about tags, either use `display: inline-block` on the content-editable component (simplest solution) or pass a function as `stringInterpolator=myInterpolator` to remove extra text.

```
myInterpolator(inputString) {
  /* Remove extra tags */
  return stringWithNoDivs;
}
```

### Tab Index
The `tabindex` attribute is bound to the element in the DOM, but only [certain tags support it](http://www.w3.org/TR/html4/interact/forms.html#adef-tabindex).

>The following elements support the tabindex attribute: A, AREA, BUTTON, INPUT, OBJECT, SELECT, and TEXTAREA.

So to use `tabindex`, you'll also need to set `tagName` to one of those.

## License

The MIT License (MIT)

Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
