import './content-editable.css';

import Component from '@glimmer/component';
import { action } from '@ember/object';

const alwaysAllowedKeys = [
  8, // backspace
  9, // tab
  12, // clear
  16, // shift
  17, // control
  18, // option
  20, // caps
  27, // escape
  35, // end
  36, // home
  37, // left arrow
  38, // up arrow
  39, // right arrow
  40, // down arrow
  46, // delete
  91, // meta left
  93, // meta right
];

export default class ContentEditableComponent extends Component {

  @action
  onKeyDown(event) {
    const isEnter = event.keyCode === 13;
    const isEscape = event.keyCode === 27;

    if (isEnter && this.args.onEnter) {
      this.args.onEnter(event);
    }
    if (isEscape && this.args.onEscape) {
      this.args.onEscape(event);
    }

    if (this.args.maxlength &&
        this.args.maxlength <= this.args.value?.length &&
        !alwaysAllowedKeys.includes(event.keyCode)
    ) {
      event.preventDefault();
      if (this.args.onLengthExceeded) {
        this.args.onLengthExceeded(this.args.value?.length);
      }
      return;
    }

    if (!this.args.allowNewlines && isEnter) {
      event.preventDefault();
      return;
    }

    if (this.args.onKey) {
      this.args.onKey(event);
    }
  }

  getSelectionLength() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return range.endOffset - range.startOffset;
    }
    return 0;
  }

  @action
  onPaste(event) {
    event.preventDefault();
    // replace any html formatted text with its plain text equivalent
    let text = '';
    if (event.clipboardData) {
      text = event.clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
      text = window.clipboardData.getData('Text');
    }

    // check max length
    if (this.args.maxlength) {
      // a selection will be replaced. substract the length of the selection from the total length
      const selectionLength = this.getSelectionLength();
      const afterPasteLength = text.length + this.args.value.length - selectionLength;
      if (afterPasteLength > this.args.maxlength) {
        if (this.args.onLengthExceeded) {
          this.args.onLengthExceeded(afterPasteLength);
        }
        return false;
      }
    }

    crossSupportInsertText(text);
    if (this.args.onPaste) {
      this.args.onPaste(text);
    }
  }
}

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
