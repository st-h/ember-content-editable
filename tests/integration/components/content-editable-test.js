import $ from 'jquery';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

function getPlaceholderContent(element) {
  let placeholderContent = window.getComputedStyle(element, '::before').content;
  return placeholderContent.replace(/"/g, ""); // presence of quotes varies in phantomjs vs chrome
}

//Make mock event
const pasteEvent = document.createEvent("CustomEvent");
pasteEvent.initCustomEvent('paste', true, true, null);
pasteEvent.clipboardData = {
  getData() {
    return 'Pasted text';
  }
};
pasteEvent.preventDefault = function() {
    //do nothing
};

module('Integration | Component | content editable', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it renders', async function(assert) {
    assert.expect(2);

    await render(hbs`{{content-editable}}`);

    assert.equal(this.$().text(), '');
    assert.equal(this.$('.ember-content-editable').length, 1);
  });

  test('placeholder renders and stays on focus until the element has content', async function(assert) {
    assert.expect(5);
    this.set("value", "");
    await render(hbs`{{content-editable value=value placeholder="bananas"}}`);
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

  test('`clearPlaceholderOnFocus` option removes placeholder on intial focus', async function(assert) {
    assert.expect(2);
    this.set("value", "");
    await render(
      hbs`{{content-editable tabindex="0" value=value placeholder="bananas" clearPlaceholderOnFocus="true"}}`
    );
    const $element = this.$('.ember-content-editable');
    const element = $element[0];

    // Check CSS output
    assert.equal(getPlaceholderContent(element), 'bananas', "CSS before:content matches placeholder");

    element.focus();

    return settled().then(() => {
      assert.equal(getPlaceholderContent(element), "", "CSS before: placeholder content removed when `clearPlaceholderOnFocus` is used");
    })
  });

  test('Value updated when input changes', async function(assert) {
    assert.expect(2);
    this.set("value", "");
    await render(hbs`{{content-editable value=value placeholder="bananas"}}`);
    const $element = this.$('.ember-content-editable');

    assert.equal(this.get("value"), "", "Initial value is correct");
    $element.text("gif not jif");
    const event = $.Event("keyup");
    $element.trigger(event);
    return settled().then(() => {
      assert.equal(this.get("value"), "gif not jif", "Value updated when input changed");
    });
  });

  test('Input updated when value changes', async function(assert) {
    assert.expect(2);
    this.set("value", "");
    await render(hbs`{{content-editable value=value placeholder="bananas"}}`);
    const $element = this.$('.ember-content-editable');

    assert.equal($element.text(), "", "Initial output is correct");
    this.set("value", "cheese");
    assert.equal($element.text(), "cheese", "Output changes when bound value changes");
  });

  test('extraClass added to DOM', async function(assert) {
    assert.expect(1);
    await render(hbs`{{content-editable class="dinosaurs"}}`);
    const $element = this.$('.ember-content-editable');
    assert.ok($element.hasClass("dinosaurs"));
  });

  test('basic key events triggered', async function(assert) {
    assert.expect(3);

    this.set('key-up', function() {
      assert.ok(true, "key-up triggered");
    });
    this.set('key-down', function() {
      assert.ok(true, "key-down triggered");
    });
    this.set('key-press', function() {
      assert.ok(true, "key-press triggered");
    });

    await render(hbs`
        {{content-editable value="test" placeholder="bananas"
         key-up=(action key-up) key-down=(action key-down) key-press=(action key-press)}}
    `);
    const $element = this.$('.ember-content-editable');

    const keyDown = $.Event("keydown");
    $element.trigger(keyDown);

    const keyPress = $.Event("keypress");
    $element.trigger(keyPress);

    const keyUp = $.Event("keyup");
    $element.trigger(keyUp);
  });

  test('specific key events triggered', async function(assert) {
    assert.expect(3);

    this.set('escape-press', function() {
      assert.ok(true, "escape-press triggered");
    });
    this.set('enter', function() {
      assert.ok(true, "enter triggered");
    });
    this.set('insert-newline', function() {
      assert.ok(true, "insert-newline triggered");
    });

    await render(hbs`
        {{content-editable value="test" placeholder="bananas"
         escape-press=(action escape-press) insert-newline=(action insert-newline)
         enter=(action enter)}}
    `);
    const $element = this.$('.ember-content-editable');

    const escapePress = $.Event("keydown", {keyCode: 27});
    $element.trigger(escapePress);

    // Both enter and insert-newline
    const enterNewlinePress = $.Event("keydown", {keyCode: 13});
    $element.trigger(enterNewlinePress);
  });

  test('focus events are triggered', async function(assert) {
    assert.expect(2);

    this.actions.focusOut = function() {
      assert.ok(true, "focus-out triggered");
    };
    this.actions.focusIn = function() {
      assert.ok(true, "focus-in triggered");
    };

    await render(hbs`
        {{content-editable value="test" placeholder="bananas"
         focusOut=(action 'focusOut') focusIn=(action 'focusIn')}}
    `);
    const $element = this.$('.ember-content-editable');

    $element.focus();
    $element.blur();
  });

  test('mouse events are triggered', async function(assert) {
    assert.expect(2);

    this.actions['mouse-leave'] = function() {
      assert.ok(true, "mouse-leave triggered");
    };
    this.actions['mouse-enter'] = function() {
      assert.ok(true, "mouse-enter triggered");
    };

    await render(hbs`
        {{content-editable value="test" placeholder="bananas"
         mouseLeave=(action 'mouse-leave') mouseEnter=(action 'mouse-enter')}}
    `);
    const $element = this.$('.ember-content-editable');

    $element.mouseenter();
    $element.mouseleave();
  });

  test('disabled attribute works', async function(assert) {
    assert.expect(1);
    await render(hbs`{{content-editable disabled=true}}`);
    const $element = this.$('.ember-content-editable');

    assert.ok($element.prop('contenteditable') === "inherit" || $element.prop('contenteditable') === "false");
  });

  test('allowNewlines=true works', async function(assert) {
    assert.expect(2);
    this.set('value', "");
    this.set('keyDown', function(event) {
      assert.ok(!event.defaultPrevented);
    });

    await render(hbs`{{content-editable allowNewlines=true value=value key-down=keyDown}}`);
    const $element = this.$('.ember-content-editable');

    $element.trigger($.Event("keydown", { keyCode: 13})); // Enter
    $element.trigger($.Event("keydown", { keyCode: 65 })); // Not enter
  });

  test('allowNewlines=false works', async function(assert) {
    assert.expect(1);
    this.set('value', "");
    this.set('keyDown', function(event) {
      assert.ok(!event.defaultPrevented);
    });

    await render(hbs`{{content-editable allowNewlines=false value=value key-down=keyDown}}`);
    const $element = this.$('.ember-content-editable');

    $element.trigger($.Event("keydown", { keyCode: 13})); // Enter
    $element.trigger($.Event("keydown", { keyCode: 65 })); // Not enter
  });

  test('Pasting works for text', async function(assert) {
    assert.expect(1);
    this.set('value', "");


    await render(hbs`{{content-editable value=value maxlength='2000' class='jsTest-contentEditable'}}`);
    const $element = this.$('.ember-content-editable');
    this.$('.jsTest-contentEditable').focus();
    $element[0].dispatchEvent(pasteEvent); // paste fake event

    return settled().then(() => {
      assert.equal(this.get('value'), 'Pasted text', 'Pasted value is correct');
    });
  });

  test('Pasting works for html with no maxlength', async function(assert) {
    assert.expect(1);
    this.set('value', "");

    await render(hbs`{{content-editable value=value type='html' class='jsTest-contentEditable '}}`);
    const $element = this.$('.ember-content-editable');
    this.$('.jsTest-contentEditable').focus();
    $element[0].dispatchEvent(pasteEvent); // paste fake event

    return settled().then(() => {
      assert.equal(this.get('value'), 'Pasted text', 'Pasted value is correct');
    });
  });
});
