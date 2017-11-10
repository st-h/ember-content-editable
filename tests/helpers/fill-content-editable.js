import { registerAsyncHelper } from '@ember/test';
import $ from 'jquery';

export default registerAsyncHelper('fillContentEditable', function(app, selector, content) {
  click(selector);
  $(selector).html(content);
  keyEvent(selector, 'keyup', 13);
  triggerEvent(selector, 'blur');
});
