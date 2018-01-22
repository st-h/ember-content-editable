import $ from 'jquery';
import { triggerEvent, click } from '@ember/test-helpers';

export async function fillContentEditable(selector, content) {
  click(selector);
  $(selector).html(content);
  triggerEvent(selector, 'keyup', 13);
  triggerEvent(selector, 'blur');
}
