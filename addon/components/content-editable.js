import Component from '@ember/component';
import { run } from "@ember/runloop";

export default Component.extend({
  classNames: ['ember-content-editable'],
  classNameBindings: ['clearPlaceholderOnFocus:clear-on-focus'],
  attributeBindings: [
    'contenteditable',
    'placeholder',
    'spellcheck',
    'tabindex',
    'disabled'
  ],

  disabled: false,
  spellcheck: null,
  allowNewlines: true,
  autofocus: false,
  clearPlaceholderOnFocus: false,

  init() {
    this._super(...arguments);

    this.set('keyWhitelist', [
      8,  // backspace
      27, // escape
      37, // left arrow
      38, // up arrow
      39, // right arrow
      40  // down arrow
    ]);
    this._pasteHandler = run.bind(this, this.pasteHandler);
  },

  didInsertElement() {
    this._super(...arguments);

    this.updateDom();
    this._mutationObserver = new MutationObserver(run.bind(this, this.domChanged));
    this._mutationObserver.observe(this.element, {attributes: false, childList: true, characterData: true, subtree: true});

    if (this.autofocus) {
      this.element.focus();
    }

    this.element.addEventListener('paste', this._pasteHandler);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.element.removeEventListener('paste', this._pasteHandler);
    this._mutationObserver.disconnect();
  },

  domChanged() {
    const text = this.element.innerText;
    this.set('value', text);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('contenteditable', !this.disabled);
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.updateDom();
  },

  updateDom() {
    const value = this.value;
    if (value === undefined || value === null) {
      this.element.innerText = '';
    } else if (this.element.innerText != value) {
      this.element.innerText = value;
    }
  },

  keyUp(event) {
    this['key-up'](event);
  },

  keyPress(event) {
    // Firefox seems to call this method on backspace and cursor keyboard events, whereas chrome does not.
    // Therefore we keep a whitelist of keyCodes that we allow in case it is necessary.
    const newLength = this.element.innerText.length - this.getSelectionLength();
    if (this.maxlength && newLength >= this.maxlength && !this.keyWhitelist.includes(event.keyCode)) {
      event.preventDefault();
      this['length-exceeded'](this.element.innerText.length + 1);
      return false;
    }
    this['key-press'](event);
  },

  keyDown(event) {
    if (event.keyCode === 27) {
      this['escape-press'](event);
    } else if (event.keyCode === 13) {
      this.enter(event);
      if (this.allowNewlines) {
          this['insert-newline'](event);
      } else {
        event.preventDefault();
        return false;
      }
    }
    this['key-down'](event);
  },

  getSelectionLength() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return range.endOffset - range.startOffset;
    }
    return 0;
  },

  pasteHandler(event) {
    event.preventDefault();
    // replace any html formatted text with its plain text equivalent
    let text = '';
    if (event.clipboardData) {
      text = event.clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
      text = window.clipboardData.getData('Text');
    }

    // check max length
    if (this.maxlength) {
      // a selection will be replaced. substract the length of the selection from the total length
      const selectionLength = this.getSelectionLength();
      const afterPasteLength = text.length + this.element.innerText.length - selectionLength;
      if (afterPasteLength > this.maxlength) {
        this['length-exceeded'](afterPasteLength);
        return false;
      }
    }

    crossSupportInsertText(text);
    this.paste(text);
  },

  enter() { },

  'escape-press'() { },

  'key-up'() { },

  'key-press'() { },

  'key-down'() { },

  'length-exceeded'() { },

  'insert-newline'() { },

  paste() { }

}).reopenClass({
  positionalParams: ['value']
});

function crossSupportInsertText(text) {
  if (document.queryCommandSupported('insertText')) {
    document.execCommand('insertText', false, text);
  } else {
    const range = document.getSelection().getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.selectNodeContents(textNode);
    range.collapse(false);

    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
