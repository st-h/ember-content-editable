import Ember from 'ember';
import fillContentEditable from './fill-content-editable';

const { Test: { registerAsyncHelper }} = Ember;

export default function() {
  registerAsyncHelper('fillContentEditable', fillContentEditable);
}
