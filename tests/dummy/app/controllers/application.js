import Ember from 'ember';

export default Ember.Controller.extend({
  name: "Stage 1 delivery of 3Com Reseller Locator to\r\nFoundation Network LTD",

  filter(currentValue, event) {
    var k = event.which;
    if (k <= 48 || k >= 58) {
      event.preventDefault();
    }
  },

  processor(s) {
    if (s.indexOf('X') > -1) {
      return s.substring(0, s.indexOf('X'));
    } else {
      return s;
    }
  }
});
