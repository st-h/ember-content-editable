import Ember from 'ember';

export default function(app, selector, content) {
  return andThen(() => {
    return app.testHelpers.click(selector);
  }).then(() => {
    $(selector).html(content);
    return app.testHelpers.keyEvent(selector, 'keyup', 13);
  }).then(() => {
    return app.testHelpers.triggerEvent(selector, 'blur');
  });
}
