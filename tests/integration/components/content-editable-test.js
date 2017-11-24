import $ from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

function getPlaceholderContent(element) {
  let placeholderContent = window.getComputedStyle(element, '::before').content;
  return placeholderContent.replace(/"/g, ""); // presence of quotes varies in phantomjs vs chrome
}

moduleForComponent('content-editable', 'Integration | Component | content editable', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(3);

  this.render(hbs`{{content-editable}}`);

  assert.equal(this.$().text(), '');
  assert.equal(this.$('.ember-content-editable').length, 1);

  // Template block usage:
  this.render(hbs`
    {{#content-editable}}
      template block text
    {{/content-editable}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('placeholder renders and stays on focus until the element has content', function(assert) {
  assert.expect(5);
  this.set("value", "");
  this.render(hbs`{{content-editable value=value placeholder="bananas"}}`);
  const $element = this.$('.ember-content-editable');
  const element = $element[0];

  // Check element attr
  assert.equal($element.attr('placeholder'), "bananas", "DOM attr has correct placeholder");

  // Check CSS output
  assert.equal(getPlaceholderContent(element), 'bananas', "CSS before:content matches placeholder");

  element.focus();

  assert.equal($element.attr('placeholder'), "bananas", "DOM attr has correct placeholder");
  assert.equal(getPlaceholderContent(element), 'bananas', "CSS before:content matches placeholder");

  // Check placeholder hidden when value is present
  this.set("value", "zebra");

  assert.equal(getPlaceholderContent(element), "", "Placeholder not shown when content present");
});

test('`clearPlaceholderOnFocus` option removes placeholder on intial focus', function (assert) {
  assert.expect(2);
  this.set("value", "");
  this.render(hbs`{{content-editable tabindex="0" value=value placeholder="bananas" clearPlaceholderOnFocus="true"}}`);
  const $element = this.$('.ember-content-editable');
  const element = $element[0];

  // Check CSS output
  assert.equal(getPlaceholderContent(element), 'bananas', "CSS before:content matches placeholder");

  element.focus();

  assert.equal(getPlaceholderContent(element), "", "CSS before: placeholder content removed when `clearPlaceholderOnFocus` is used");
});

test('Value updated when input changes', function(assert) {
  assert.expect(2);
  this.set("value", "");
  this.render(hbs`{{content-editable value=value placeholder="bananas"}}`);
  const $element = this.$('.ember-content-editable');

  assert.equal(this.get("value"), "", "Initial value is correct");
  $element.text("gif not jif");
  const event = $.Event("keyup");
  $element.trigger(event);
  assert.equal(this.get("value"), "gif not jif", "Value updated when input changed");
});

test('Input updated when value changes', function(assert) {
  assert.expect(2);
  this.set("value", "");
  this.render(hbs`{{content-editable value=value placeholder="bananas"}}`);
  const $element = this.$('.ember-content-editable');

  assert.equal($element.text(), "", "Initial output is correct");
  this.set("value", "cheese");
  assert.equal($element.text(), "cheese", "Output changes when bound value changes");
});

test('String interpolator is called', function(assert) {
  assert.expect(1);
  this.set("value", "");
  this.set('myInterpolator', function(text) {
    return text + " gifs rock";
  });
  this.render(hbs`{{content-editable value=value placeholder="bananas" stringInterpolator=myInterpolator}}`);
  const $element = this.$('.ember-content-editable');

  $element.text("gif not jif");
  const event = $.Event("keyup");
  $element.trigger(event);
  assert.equal(this.get("value"), "gif not jif gifs rock");
});

test('type=html preserves html', function(assert) {
  assert.expect(1);
  this.set("value", "<b>baller</b>");
  this.render(hbs`{{content-editable value=value placeholder="bananas" type="html"}}`);

  assert.equal(this.get("value"), "<b>baller</b>", "html not stripped from value");
});

test('isText=false preserves html', function(assert) {
  assert.expect(1);
  this.set("value", "<b>baller</b>");
  this.render(hbs`{{content-editable value=value placeholder="bananas" isText=false}}`);

  assert.equal(this.get("value"), "<b>baller</b>", "html not stripped from value");
});

test('extraClass added to DOM', function(assert) {
  assert.expect(1);
  this.render(hbs`{{content-editable extraClass="dinosaurs"}}`);
  const $element = this.$('.ember-content-editable');
  assert.ok($element.hasClass("dinosaurs"));
});

test('basic key events triggered', function(assert) {
  assert.expect(3);

  this.on('key-up', function() {
    assert.ok(true, "key-up triggered");
  });
  this.on('key-down', function() {
    assert.ok(true, "key-down triggered");
  });
  this.on('key-press', function() {
    assert.ok(true, "key-press triggered");
  });

  this.render(hbs`
      {{content-editable value="test" placeholder="bananas"
       key-up="key-up" key-down="key-down" key-press="key-press"}}
  `);
  const $element = this.$('.ember-content-editable');

  const keyDown = $.Event("keydown");
  $element.trigger(keyDown);

  const keyPress = $.Event("keypress");
  $element.trigger(keyPress);

  const keyUp = $.Event("keyup");
  $element.trigger(keyUp);
});

test('specific key events triggered', function(assert) {
  assert.expect(3);

  this.on('escape-press', function() {
    assert.ok(true, "escape-press triggered");
  });
  this.on('enter', function() {
    assert.ok(true, "enter triggered");
  });
  this.on('insert-newline', function() {
    assert.ok(true, "insert-newline triggered");
  });

  this.render(hbs`
      {{content-editable value="test" placeholder="bananas"
       escape-press="escape-press" insert-newline="insert-newline"
       enter="enter"}}
  `);
  const $element = this.$('.ember-content-editable');

  const escapePress = $.Event("keydown", {keyCode: 27});
  $element.trigger(escapePress);

  // Both enter and insert-newline
  const enterNewlinePress = $.Event("keydown", {keyCode: 13});
  $element.trigger(enterNewlinePress);
});

test('focus events are triggered', function(assert) {
  assert.expect(2);

  this.on('focus-out', function() {
    assert.ok(true, "focus-out triggered");
  });
  this.on('focus-in', function() {
    assert.ok(true, "focus-in triggered");
  });

  this.render(hbs`
      {{content-editable value="test" placeholder="bananas"
       focus-out="focus-out" focus-in="focus-in"}}
  `);
  const $element = this.$('.ember-content-editable');

  $element.focus();
  $element.blur();
});

test('mouse events are triggered', function(assert) {
  assert.expect(2);

  this.on('mouse-leave', function() {
    assert.ok(true, "mouse-leave triggered");
  });
  this.on('mouse-enter', function() {
    assert.ok(true, "mouse-enter triggered");
  });

  this.render(hbs`
      {{content-editable value="test" placeholder="bananas"
       mouse-leave="mouse-leave" mouse-enter="mouse-enter"}}
  `);
  const $element = this.$('.ember-content-editable');

  $element.mouseenter();
  $element.mouseleave();
});

test('editable property is alias for contenteditable', function(assert) {
  assert.expect(1);
  this.render(hbs`{{content-editable editable=true}}`);
  const $element = this.$('.ember-content-editable');
  assert.ok($element.prop('contenteditable') === "true");
});

test('value binding for editable works', function(assert) {
  assert.expect(2);
  this.set('editable', false);
  this.render(hbs`{{content-editable editable=editable}}`);
  const $element = this.$('.ember-content-editable');
  assert.ok($element.prop('contenteditable') === "inherit" || $element.prop('contenteditable') === "false");

  this.set('editable', true);
  assert.ok($element.prop('contenteditable') === "true");
});

test('disabled attribute works', function(assert) {
  assert.expect(1);
  this.render(hbs`{{content-editable disabled=true}}`);
  const $element = this.$('.ember-content-editable');

  assert.ok($element.prop('contenteditable') === "inherit" || $element.prop('contenteditable') === "false");
});

test('readonly attribute works', function(assert) {
  assert.expect(1);
  this.set('keyPress', function() {
    // Should never be called
    assert.ok(false);
  });
  this.render(hbs`{{content-editable readonly=true key-press=keyPress}}`);
  const $element = this.$('.ember-content-editable');

  assert.equal($element.prop('contenteditable'), "true");
  $element.trigger($.Event("keypress", { keyCode: 65 }));
});

test('type=number works', function(assert) {
  assert.expect(1);
  this.set('value', "");
  this.set('keyPress', function(event) {
    assert.ok(!event.defaultPrevented);
  });

  this.render(hbs`{{content-editable type="number" value=value key-press=keyPress}}`);
  const $element = this.$('.ember-content-editable');

  $element.trigger($.Event("keypress", { keyCode: 49})); // Number
  $element.trigger($.Event("keypress", { keyCode: 65 })); // Not number
});

test('allowNewlines=true works', function(assert) {
  assert.expect(2);
  this.set('value', "");
  this.set('keyDown', function(event) {
    assert.ok(!event.defaultPrevented);
  });

  this.render(hbs`{{content-editable allowNewlines=true value=value key-down=keyDown}}`);
  const $element = this.$('.ember-content-editable');

  $element.trigger($.Event("keydown", { keyCode: 13})); // Enter
  $element.trigger($.Event("keydown", { keyCode: 65 })); // Not enter
});

test('allowNewlines=false works', function(assert) {
  assert.expect(1);
  this.set('value', "");
  this.set('keyDown', function(event) {
    assert.ok(!event.defaultPrevented);
  });

  this.render(hbs`{{content-editable allowNewlines=false value=value key-down=keyDown}}`);
  const $element = this.$('.ember-content-editable');

  $element.trigger($.Event("keydown", { keyCode: 13})); // Enter
  $element.trigger($.Event("keydown", { keyCode: 65 })); // Not enter
});

test('Pasting works', function(assert) {
  assert.expect(1);
  this.set('value', "");

  //Make mock event
  let event = document.createEvent("CustomEvent");
  event.initCustomEvent('paste', true, true, null);
  event.originalEvent = {
    clipboardData: {
      getData() {
        return 'Pasted text';
      }
    }
  };
  event.preventDefault = function() {
      //do nothing
  };

  this.render(hbs`{{content-editable value=value maxlength='2000' class='jsTest-contentEditable'}}`);
  const $element = this.$('.ember-content-editable');
  this.$('.jsTest-contentEditable').focus();
  $element.trigger($.Event('paste', event)); // paste fake event
  assert.equal(this.get('value'), 'Pasted text', 'Pasted value is correct');


});
