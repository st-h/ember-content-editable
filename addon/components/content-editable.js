import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ember-content-editable'],
  classNameBindings: ['extraClass'],
  attributeBindings: ['contenteditable', 'placeholder'],
  contenteditable: true,

  setup: Ember.on('didInsertElement', function() {
    this.$().html(this.get('value'));
  }),

  stringInterpolator(s) { return s; },

  updateValue: Ember.on('keyUp', function(event) {
    this.handleKeyUp(event);
    this.set('value', this.stringInterpolator(this.$().text()));
  }),

  handleKeyUp(event) {
    this.sendAction('keyUp', event);

    if (event.keyCode === 27) {
      // Escape
      this.sendAction('escape-press', event);
    } else if (event.keyCode === 13) {
      // Enter
      this.sendAction('enter', event);
    }
  },

  /* Events */
  keyDown(event) {
    this.sendAction('key-down', event);
  },

  focusIn(event) {
    this.sendAction('focus-in', event);
  },

  focusOut(event) {
    this.sendAction('focus-out', event);
  },

  mouseEnter(event) {
    this.sendAction('mouse-enter', event);
  },

  mouseLeave(event) {
    this.sendAction('mouse-leave', event);
  },
});
