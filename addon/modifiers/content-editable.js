import Modifier from 'ember-modifier';
import { action } from '@ember/object';

export default class ContentEditableModifier extends Modifier {

  value = undefined;

  didInstall() {
    this.element.setAttribute('contenteditable', 'true');

    if (this.args.named.placeholder) {
      this.element.setAttribute('placeholder', this.args.named.placeholder);
    }

    this.element.classList.add('ember-content-editable');
    this.addEventListener();

    if (this.args.named.autofocus) {
      this.element.focus();
    }
  }

  didReceiveArguments() {
    if (this.value != this.args.named.value) {
      this.value = this.args.named.value;
      this.element.innerText = this.value;
    }
  }

  willDestroy() {
    this.removeEventListener();
  }

  @action
  domUpdated() {
    this.value = this.element.innerText;

    if (this.args.named.onChange) {
      this.args.named.onChange(this.value);
    }
  }

  addEventListener() {
    this.element.addEventListener('input', this.domUpdated);
  }

  removeEventListener() {
    this.element.removeEventListener('input', this.domUpdated);
  }
}
