import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  value = "<div>this field should be focused</div>";
  nullValue = null;
  undefinedValue = undefined;

  @tracked enterCount = 0;
  @tracked escapeCount = 0;
  @tracked mouseInside = false;

  @action
  displayLengthAlert(charCount) {
    alert('you tried to enter ' + charCount + ' characters, which just seems to be enough for now. The limit is 40!');
  }

  @action
  incrementProperty(prop, val) {
    this[prop] += val;
  }
}
