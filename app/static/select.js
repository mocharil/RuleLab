// Enhance existing selects without changing their value/event contract.
import {REGULATION_NAMES} from '/static/draft-builder.js';
import {icon} from '/static/design.js';
let openControl;
const controls = new Map();
let sequence = 0;
const regulationNames=REGULATION_NAMES;

function enhance(select) {
  const host = document.createElement('div');
  host.className = 'rl-select ' + select.className;
  host.dataset.selectId = select.id;
  select.before(host);
  host.append(select);
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'rl-select-trigger';
  trigger.id = (select.id || 'select-' + ++sequence) + '-trigger';
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  const value = document.createElement('span');
  value.className = 'rl-select-value';
  trigger.append(value);
  trigger.insertAdjacentHTML('beforeend', icon('down'));
  host.append(trigger);
  select.classList.add('rl-select-native');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const popup = document.createElement('div');
  popup.className = 'rl-select-popup';
  popup.setAttribute('popover', 'manual');
  const search = document.createElement('input');
  search.type = 'search';
  search.className = 'rl-select-search';
  search.placeholder = 'Search options…';
  search.setAttribute('aria-label', 'Search options');
  search.setAttribute('role', 'combobox');
  search.setAttribute('aria-autocomplete', 'list');
  search.setAttribute('aria-expanded', 'true');
  const list = document.createElement('div');
  list.className = 'rl-select-options';
  list.id = trigger.id + '-options';
  list.setAttribute('role', 'listbox');
  trigger.setAttribute('aria-controls', list.id);
  search.setAttribute('aria-controls', list.id);
  popup.append(search, list);
  let expanded = false, items = [], highlighted = -1;

  function highlight(index) {
    highlighted = index;
    [...list.querySelectorAll('[role=option]')].forEach((item, i) => item.classList.toggle('highlighted', i === index));
    const item = list.querySelectorAll('[role=option]')[index];
    for (const field of [search, trigger]) {
      if (item) field.setAttribute('aria-activedescendant', item.id);
      else field.removeAttribute('aria-activedescendant');
    }
    if (item) {
      const top = item.offsetTop - list.offsetTop;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (top + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + item.offsetHeight - list.clientHeight;
    }
  }
  function paint() {
    items = [...select.options].filter(o => !o.disabled && !o.hidden && (o.text+' '+(regulationNames[o.value]||'')).toLocaleLowerCase().includes(search.value.toLocaleLowerCase()));
    list.replaceChildren();
    items.forEach((option, i) => {
      const item = document.createElement('div');
      item.id = list.id + '-' + i;
      item.className = 'rl-select-option';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(option.selected));
      item.setAttribute('aria-label', option.text);
      const text = document.createElement('span');
      text.textContent = option.text;
      if (['reg-type','new-type','generate-type'].includes(select.id) && regulationNames[option.value]) {
        const description = document.createElement('small');
        description.textContent = regulationNames[option.value];
        text.append(description);
      }
      item.append(text);
      if (option.selected) item.insertAdjacentHTML('beforeend', icon('check'));
      item.addEventListener('pointermove', () => highlight(i));
      item.addEventListener('click', () => choose(i));
      list.append(item);
    });
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'rl-select-empty';
      empty.textContent = 'No matching options.';
      empty.setAttribute('role', 'status');
      list.append(empty);
    }
    highlight(Math.max(0, items.findIndex(o => o.selected)));
  }
  function position() {
    const rect = trigger.getBoundingClientRect(), viewport = window.visualViewport;
    const width = viewport?.width || innerWidth, height = viewport?.height || innerHeight;
    const offsetX = viewport?.offsetLeft || 0, offsetY = viewport?.offsetTop || 0;
    const menuWidth = Math.min(Math.max(rect.width, 260), width - 24);
    const below = height + offsetY - rect.bottom - 12, above = rect.top - offsetY - 12;
    const placeBelow = below >= 240 || below >= above;
    const menuHeight = Math.max(80, Math.min(340, placeBelow ? below : above));
    Object.assign(popup.style, {width: menuWidth + 'px', maxHeight: menuHeight + 'px', left: Math.max(offsetX + 12, Math.min(rect.left, offsetX + width - menuWidth - 12)) + 'px', top: (placeBelow ? rect.bottom + 6 : Math.max(offsetY + 12, rect.top - menuHeight - 6)) + 'px'});
  }
  function close(restore = false) {
    if (!expanded) return;
    expanded = false;
    popup.hidePopover();
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    if (openControl === control) openControl = undefined;
    if (restore && trigger.isConnected) trigger.focus({preventScroll: true});
  }
  function choose(index) {
    const option = items[index];
    if (!option) return;
    const changed = select.value !== option.value;
    select.value = option.value;
    close(true);
    sync();
    if (changed) {
      select.dispatchEvent(new Event('input', {bubbles: true}));
      select.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }
  function open() {
    if (select.disabled || document.querySelector('#main')?.inert) return;
    openControl?.close();
    (select.closest('dialog') || document.body).append(popup);
    expanded = true;
    openControl = control;
    search.value = '';
    search.hidden = select.options.length < 8;
    position();
    popup.showPopover();
    trigger.setAttribute('aria-expanded', 'true');
    paint();
    if (!search.hidden) search.focus({preventScroll: true});
  }
  function keydown(event) {
    if (event.key === 'Escape') {event.preventDefault();event.stopPropagation();close(true);return;}
    if (event.key === 'Tab') {close(true);return;}
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && (event.target !== search || !['Home', 'End'].includes(event.key))) {
      event.preventDefault();
      if (!expanded) {open();return;}
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (highlighted + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      highlight(next);
    }
    if (event.key === 'Enter' || (event.key === ' ' && event.target !== search)) {
      event.preventDefault();
      if (expanded) choose(highlighted); else open();
    }
  }
  function sync() {
    const option=select.selectedOptions[0];
    value.textContent = ['reg-type','new-type','generate-type'].includes(select.id) && regulationNames[option?.value] ? regulationNames[option.value] : option?.text || 'Choose…';
    trigger.title = value.textContent;
    trigger.disabled = select.disabled || !select.options.length;
    const label = select.getAttribute('aria-label') || [...select.labels].map(l => l.textContent.trim()).join(' ') || 'Choose an option';
    trigger.setAttribute('aria-label', label);
    list.setAttribute('aria-label', label);
    for (const name of ['aria-invalid', 'aria-describedby']) {
      if (select.hasAttribute(name)) trigger.setAttribute(name, select.getAttribute(name)); else trigger.removeAttribute(name);
    }
    if (expanded) paint();
  }
  const control = {close, position, dispose() {close();observer.disconnect();popup.remove();controls.delete(select);}};
  const observer = new MutationObserver(sync);
  observer.observe(select, {childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'selected', 'aria-invalid', 'aria-describedby']});
  select.addEventListener('change', sync);
  select.addEventListener('rulelab:sync', sync);
  select.addEventListener('focus', () => trigger.focus());
  trigger.addEventListener('click', () => expanded ? close() : open());
  trigger.addEventListener('keydown', keydown);
  popup.addEventListener('keydown', keydown);
  search.addEventListener('input', paint);
  controls.set(select, control);
  sync();
}

export function initializeSelects() {
  // Native controls remain available in browsers without top-layer popovers.
  if (!('showPopover' in HTMLElement.prototype)) return;
  function scan() {
    for (const [select, control] of controls) if (!select.isConnected) control.dispose();
    document.querySelectorAll('#main select,#modal select').forEach(select => {if (!controls.has(select) && !select.multiple) enhance(select);});
  }
  new MutationObserver(scan).observe(document.querySelector('.shell').parentElement, {childList: true, subtree: true});
  document.addEventListener('pointerdown', event => {
    if (openControl && !event.target.closest('.rl-select,.rl-select-popup')) openControl.close();
  }, true);
  document.addEventListener('click', event => {
    const label = event.target.closest('label[for]');
    if (label) document.getElementById(label.htmlFor + '-trigger')?.focus();
  });
  document.querySelector('#modal').addEventListener('close', () => openControl?.close());
  window.addEventListener('resize', () => openControl?.close());
  document.addEventListener('scroll', event => {if (!event.target.closest?.('.rl-select-popup')) openControl?.position();}, true);
  scan();
}
