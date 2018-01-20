# ember-content-editable

[![Greenkeeper badge](https://badges.greenkeeper.io/st-h/ember-content-editable.svg)](https://greenkeeper.io/)
[![Latest NPM release][npm-badge]][npm-badge-url]
[![TravisCI Build Status][travis-badge]][travis-badge-url]
[![Code Climate][codeclimate-badge]][codeclimate-badge-url]
[![Ember Observer Score][ember-observer-badge]][ember-observer-badge-url]
[![Dependencies][dependencies-badge]][dependencies-badge-url]
[![Dev Dependencies][devDependencies-badge]][devDependencies-badge-url]

Ember cli contenteditable component, with placeholder and value binding. Use it just like an `input` or `textarea`, but it will autoresize for you.

## Installation

`ember install ember-content-editable`

### Versions

**0.11.1** is the last stable version making use of the codebase implemented by [AddJAm](https://github.com/AddJAm) which should be compatible with older ember and IE releases.

**1.0.0-alpha.4** is a prerelease of a complete rewrite with the following changes:
- removes jquery dependencies
- removes IE9 and IE10 support
- no observers and computed properties were harmed
- only supports type `text` and therefore removes the `type` property completely
- removes `stringInterpolator` functionality

This enables us to significantly reduce the complexity of this addon as we now are able to rely on the browser to handle the modification of the dom and we only need to make sure to keep the binding of the provided property in sync. This should eliminate any potential bugs resulting from earlier custom implementations of key and copy-paste handlers as well as modifying the caret position.
Please add any concerns or missing functionality to this [issue](https://github.com/st-h/ember-content-editable/issues/36) or contribute your ideas to the [1.0.0-rewrite](https://github.com/st-h/ember-content-editable/tree/1.0.0-rewrite) branch.

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
                   class="name-field"
                   tagName="h3"}}
```

### Options

Option Name          | Description                                    | Default
---------------------|------------------------------------------------|---------
value                | The value to be edited                         | `""`
placeholder          | Placeholder displayed when value is blank      | `""`
class                | String with any extra css class               | none
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
**insert-newline** | if `allowNewlines` is set to `true`, this event is triggered whenever a new line is inserted | event
**length-exceeded** | if `maxlength` is set, every action that exceeds the limit triggers this event | total numbers of character entered
**enter** | triggers when the enter key is pressed | event
**escape-press** | triggers when the escape key is pressed | event
**key-up** | `keyUp` replacement | event
**key-press** | `keyPress` replacement | event
**key-down** | `keyDown` replacement | event

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

[AddJAm](https://github.com/AddJAm) has done a great job writing and maintaining this addon for a long time. Thanks guys.

## Contributions

If you want to report a bug, please open a new issue. Any bugs that are not totally obvious should include a way to reproduce the issue (like ember-twiddle) or a failing test. Or even better, provide a PR which tests and fixes the issue.

In case you find there is a feature missing, please provide a PR with corresponding test coverage. Please keep in mind to keep addons lightweight. If in doubt, open an issue first and see what others think about it.

[npm-badge]: https://img.shields.io/npm/v/ember-content-editable.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-content-editable
[travis-badge]: https://img.shields.io/travis/st-h/ember-content-editable/master.svg?label=TravisCI
[travis-badge-url]: https://travis-ci.org/st-h/ember-content-editable
[codeclimate-badge]: https://api.codeclimate.com/v1/badges/8688ab1cea89cb7cb918/maintainability
[codeclimate-badge-url]: https://codeclimate.com/github/st-h/ember-content-editable/maintainability
[ember-observer-badge]: http://emberobserver.com/badges/ember-content-editable.svg
[ember-observer-badge-url]: http://emberobserver.com/addons/ember-content-editable
[dependencies-badge]: https://img.shields.io/david/st-h/ember-content-editable.svg
[dependencies-badge-url]: https://david-dm.org/st-h/ember-content-editable
[devDependencies-badge]: https://img.shields.io/david/dev/st-h/ember-content-editable.svg
[devDependencies-badge-url]: https://david-dm.org/st-h/ember-content-editable#info=devDependencies
