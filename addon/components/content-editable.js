import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ember-content-editable'],
  classNameBindings: ['extraClass'],
  attributeBindings: ['contenteditable', 'placeholder'],
  contenteditable: true,
  editable: Ember.computed.alias('contenteditable'),
  isText: false,

  setup: Ember.on('didInsertElement', function() {
    this.setValue();
    this._processInput();
  }),

  _observeValue: true,
  valueChanged: Ember.observer('value', function() {
    if (this.get('_observeValue')) {
      this.setValue();
    }
  }),

  setValue() {
    if (this.element) {
      this.$().html(this.get('value'));
    }
  },

  stringInterpolator(s) { return s; },

  _processInput() {
    this.set('_observeValue', false);

    let val;
    if (this.get('isText')) {
      val = this.element.innerText || this.element.textContent;
    } else {
      val = this.$().html();
    }

    val = this.stringInterpolator(val);

    if (!this.get('isText')) {
      val = Ember.String.htmlSafe(val);
    }

    this.set('value', val);
    this.set('_observeValue', true);
  },

  updateValue: Ember.on('keyUp', function(event) {
    this._processInput();
    this.handleKeyUp(event);
  }),

  handleKeyUp(event) {
    this.sendAction('key-up', this.get('value'), event);

    if (event.keyCode === 27) {
      // Escape
      this.sendAction('escape-press', this, event);
    } else if (event.keyCode === 13) {
      // Enter
      this.sendAction('enter', this, event);
      this.sendAction('insert-newline', this, event);
    }
  },

  /* Events */
  keyDown(event) {
    this.sendAction('key-down', this.get('value'), event);
  },

  keyPress(event) {
    this.sendAction('key-press', this, event);
  },

  focusIn(event) {
    this.sendAction('focus-in', this, event);
  },

  focusOut(event) {
    this.sendAction('focus-out', this, event);
  },

  mouseEnter(event) {
    this.sendAction('mouse-enter', this, event);
  },

  mouseLeave(event) {
    this.sendAction('mouse-leave', this, event);
  },
});
