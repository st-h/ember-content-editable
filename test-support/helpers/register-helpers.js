import { registerAsyncHelper } from '@ember/test';
import fillContentEditable from './fill-content-editable';

export default function() {
  registerAsyncHelper('fillContentEditable', fillContentEditable);
}
