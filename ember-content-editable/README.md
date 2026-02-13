# ember-content-editable

[![Latest NPM release][npm-badge]][npm-badge-url]
[![Coverage Status](https://coveralls.io/repos/github/st-h/ember-content-editable/badge.svg?branch=master)](https://coveralls.io/github/st-h/ember-content-editable?branch=master)
[![Ember Observer Score][ember-observer-badge]][ember-observer-badge-url]

Ember cli contenteditable component, with placeholder and value binding. Use it just like an `input` or `textarea`, but it will autoresize for you.

## Compatibility

* Ember.js v5.8 or above
* Ember CLI v5.8 or above
* Node.js v18 or above

## Demo

Our demo page can be found [here](http://st-h.github.io/ember-content-editable/)

## Installation

`ember install ember-content-editable`

## Usage

Use it just like `input` or `textarea`:

```
<ContentEditable @value={{this.value}} @onChange={{fn (mut this.value)}} @placeholder="Your name"/>
```

### Options

Option Name          | Description                                    | Default
---------------------|------------------------------------------------|---------
value                | The value to be edited                         | `""`
placeholder          | Placeholder displayed when value is blank      | `""`
spellcheck           | Uses browsers spellcheck, same as with `<input>` | none
disabled             | If true, element can't be edited, focused or tabbed to | false
maxlength            | Maximum length of the input, in characters     | none
allowNewlines        | If false, linebreaks can't be entered          | true
autofocus            | If true, the element will be focused once inserted into the document | false
clearPlaceholderOnFocus | If true, the placeholder will be cleared as soon as the element gains focus (even if no content is present yet) | false


### Events

This addon supports events supported by the ember component model (except for keyboard events). See the ember documentation for details or the dummy app within the test folder for an example. As this addon uses keyboard events slightly renamed hooks are available as making use of the default hooks would override the addons implementation.

event | description | argument
-- | -- | --
**onLengthExceeded** | if `maxlength` is set, every action that exceeds the limit triggers this event | total numbers of character entered (number)
**onEnter** | triggers when the enter key is pressed | event
**onEscape** | triggers when the escape key is pressed | event
**onKey** | keydown event propagation | event
**onPaste** | triggers when content is pasted successfully (does not fire when maxlength is exceeded) | pasted text content (string)

### Customizing Placeholder Color

```
.ember-content-editable:empty {
  color: rgba(0,0,0,0.6);
}
```

## Common Problems

These are some solutions to common problems browsers have with contenteditable elements.

### Tab Index

The `tabindex` attribute is bound to the element in the DOM, but only [certain tags support it](http://www.w3.org/TR/html4/interact/forms.html#adef-tabindex).

>The following elements support the tabindex attribute: A, AREA, BUTTON, INPUT, OBJECT, SELECT, and TEXTAREA.

So to use `tabindex`, you'll also need to set `tagName` to one of those.

### Newlines aren't showing

Try using `whitespace: pre-line;` or `whitespace: pre-wrap;` in your CSS.

### I can't blur the element

A solution to this is to call `window.getSelection().removeAllRanges()` after you call `blur()` on the element.

For example, if you have `enter='endEditing'` on your content-editable, the following action would prevent the newline and blur the element.

```
endEditing(contentEditable, event) {
  event.preventDefault();
  contentEditable.element.blur();
  window.getSelection().removeAllRanges();
}
```

### Cursor appears too big when element is empty

Setting `display: block;` in CSS seems to solve this.

## Acknowledements

[AddJAm](https://github.com/AddJAm) has done a great job writing and maintaining this addon for a long time in the past. Thanks guys.

## Contributions

If you want to report a bug, please open a new issue. Any bugs that are not totally obvious should include a way to reproduce the issue (like ember-twiddle) or a failing test. Or even better, provide a PR which tests and fixes the issue.

In case you find there is a feature missing, please provide a PR with corresponding test coverage. Please keep in mind to keep addons lightweight. If in doubt, open an issue first and see what others think about it.

[npm-badge]: https://img.shields.io/npm/v/ember-content-editable.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-content-editable
[ember-observer-badge]: http://emberobserver.com/badges/ember-content-editable.svg
[ember-observer-badge-url]: http://emberobserver.com/addons/ember-content-editable