import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerEvent, triggerKeyEvent, focus, blur } from '@ember/test-helpers';
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

    assert.dom('.ember-content-editable').hasText('');
    assert.dom('.ember-content-editable').exists({ count: 1 });
  });

  test('positional argument should work as expected', async function(assert) {
    assert.expect(1);

    await render(hbs`{{content-editable 'positonal argument text'}}`);

    assert.dom('.ember-content-editable').hasText('positonal argument text');
  });

  test('placeholder renders and stays on focus until the element has content', async function(assert) {
    assert.expect(5);
    this.set("value", "");
    await render(hbs`{{content-editable value=value placeholder="bananas"}}`);

    assert.dom('.ember-content-editable').hasAttribute('placeholder', 'bananas')

    const editable = this.element.getElementsByClassName('ember-content-editable')[0];
    assert.equal(getPlaceholderContent(editable), 'bananas', "CSS before:content matches placeholder");

    await focus('.ember-content-editable');

    assert.dom('.ember-content-editable').hasAttribute('placeholder', 'bananas')
    assert.equal(getPlaceholderContent(editable), 'bananas', "CSS before:content matches placeholder");

    // Check placeholder hidden when value is present
    this.set("value", "zebra");

    assert.equal(getPlaceholderContent(editable), '', "Placeholder not shown when content present");
  });

  test('`clearPlaceholderOnFocus` option removes placeholder on intial focus', async function(assert) {
    assert.expect(2);
    this.set("value", "");
    await render(
      hbs`{{content-editable tabindex="0" value=value placeholder="bananas" clearPlaceholderOnFocus="true"}}`
    );

    const editable = this.element.getElementsByClassName('ember-content-editable')[0];

    assert.equal(getPlaceholderContent(editable), 'bananas', "CSS before:content matches placeholder");

    await focus(editable);

    assert.equal(getPlaceholderContent(editable), "", "CSS before: placeholder content removed when `clearPlaceholderOnFocus` is used");
  });

  test('value updated when input changes', async function(assert) {
    assert.expect(2);
    this.set("value", "");
    await render(hbs`{{content-editable value=value placeholder="bananas"}}`);

    assert.equal(this.get("value"), "", "Initial value is correct");

    await fillIn('.ember-content-editable', "gif not jif");

    assert.equal(this.get("value"), "gif not jif", "Value updated when input changed");
  });

  test('input updated when value changes', async function(assert) {
    assert.expect(2);
    this.set("value", "");
    await render(hbs`{{content-editable value=value placeholder="bananas"}}`);

    assert.dom('.ember-content-editable').hasText('');

    this.set("value", "cheese");

    assert.dom('.ember-content-editable').hasText('cheese');
  });

  test('extraClass added to DOM', async function(assert) {
    assert.expect(1);
    await render(hbs`{{content-editable class="dinosaurs"}}`);
    assert.dom('.ember-content-editable').hasClass('dinosaurs');
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

    await triggerEvent('.ember-content-editable', 'keydown');
    await triggerEvent('.ember-content-editable', 'keypress');
    await triggerEvent('.ember-content-editable', 'keyup');
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

    await triggerKeyEvent('.ember-content-editable', 'keydown', 27);
    await triggerKeyEvent('.ember-content-editable', 'keydown', 13);
  });

  test('focus events are triggered', async function(assert) {
    assert.expect(2);

    this.set('focusOut', function() {
      assert.ok(true, "focus-out triggered");
    });
    this.set('focusIn', function() {
      assert.ok(true, "focus-in triggered");
    });

    await render(hbs`
        {{content-editable value="test" placeholder="bananas"
         focusOut=(action focusOut) focusIn=(action focusIn)}}
    `);

    await focus('.ember-content-editable');
    await blur('.ember-content-editable');
  });

  test('mouse events are triggered', async function(assert) {
    assert.expect(2);

    this.set('mouse-leave', function() {
      assert.ok(true, "mouse-leave triggered");
    });
    this.set('mouse-enter', function() {
      assert.ok(true, "mouse-enter triggered");
    });

    await render(hbs`
        {{content-editable value="test" placeholder="bananas"
         mouseLeave=(action mouse-leave) mouseEnter=(action mouse-enter)}}
    `);

    await triggerEvent('.ember-content-editable', 'mouseover');
    await triggerEvent('.ember-content-editable', 'mouseout');
  });

  test('disabled attribute works', async function(assert) {
    assert.expect(1);
    await render(hbs`{{content-editable disabled=true}}`);

    assert.dom('.ember-content-editable').doesNotHaveAttribute('contenteditable', 'false');
  });

  test('allowNewlines=true works', async function(assert) {
    assert.expect(2);
    this.set('value', "");
    this.set('keyDown', function(event) {
      assert.ok(!event.defaultPrevented);
    });

    await render(hbs`{{content-editable allowNewlines=true value=value key-down=keyDown}}`);

    triggerKeyEvent('.ember-content-editable', 'keydown', 13); //enter
    triggerKeyEvent('.ember-content-editable', 'keydown', 65); //non-enter
  });

  test('allowNewlines=false works', async function(assert) {
    assert.expect(1);
    this.set('value', "");
    this.set('keyDown', function(event) {
      assert.ok(!event.defaultPrevented);
    });

    await render(hbs`{{content-editable allowNewlines=false value=value key-down=keyDown}}`);

    triggerKeyEvent('.ember-content-editable', 'keydown', 13); //enter
    triggerKeyEvent('.ember-content-editable', 'keydown', 65); //non-enter
  });

  test('pasting works for text', async function(assert) {
    assert.expect(1);
    this.set('value', "");

    await render(hbs`{{content-editable value=value maxlength='2000'}}`);

    const editable = this.element.getElementsByClassName('ember-content-editable')[0];
    await focus('.ember-content-editable');
    await editable.dispatchEvent(pasteEvent); // paste fake event

    assert.equal(this.get('value'), 'Pasted text', 'Pasted value is correct');
  });

  test('pasting works for html with no maxlength', async function(assert) {
    assert.expect(1);
    this.set('value', "");

    await render(hbs`{{content-editable value=value type='html'}}`);

    const editable = this.element.getElementsByClassName('ember-content-editable')[0];
    await focus('.ember-content-editable');
    await editable.dispatchEvent(pasteEvent); // paste fake event

    assert.equal(this.get('value'), 'Pasted text', 'Pasted value is correct');
  });

  test('paste event is triggered', async function(assert) {
    assert.expect(1);
    this.set('value', "");
    this.set('paste', function(text) {
      assert.equal(text, 'Pasted text');
    });

    await render(hbs`{{content-editable value=value paste=paste}}`);

    const editable = this.element.getElementsByClassName('ember-content-editable')[0];
    await focus('.ember-content-editable');
    await editable.dispatchEvent(pasteEvent); // paste fake event
  });

  test('exceeding maxlength aborts paste', async function(assert) {
    assert.expect(1);
    this.set('value', "");
    this.set('paste', function() {
      assert.ok(false, 'paste event should not be triggered when maxlength is exceeded');
    });

    await render(hbs`{{content-editable value=value maxlength='2'}}`);

    const editable = this.element.getElementsByClassName('ember-content-editable')[0];
    await focus('.ember-content-editable');
    await editable.dispatchEvent(pasteEvent); // paste fake event

    assert.equal(this.get('value'), '');
  });
});
