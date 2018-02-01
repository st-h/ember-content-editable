import Controller from '@ember/controller';

export default Controller.extend({
  value: "<div>this field should be focused</div>",
  nullValue: null,
  undefinedValue: undefined,

  enterCount: 0,
  escapeCount: 0,
  mouseInside: false,

  displayLengthAlert(charCount) {
    alert('you tried to enter ' + charCount + ' characters, which just seems to be enough for now. The limit is 40!');
  }
});
