import Controller from '@ember/controller';

export default Controller.extend({
  something: "<div>this field should be focused</div>",

  displayLengthAlert() {
    alert('content too long! this is just a field, not an entire book...');
  }
});
