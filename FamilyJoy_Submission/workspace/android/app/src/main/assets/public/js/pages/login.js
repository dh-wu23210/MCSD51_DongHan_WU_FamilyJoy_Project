/** Module: login. Handles login behavior. */

document.addEventListener('DOMContentLoaded', function () {
  var STORAGE_KEY = 'fj_login_username_history';
  var MAX_ITEMS = 8;

  var form = document.getElementById('loginForm');
  var usernameInput = document.getElementById('loginUsername');
  var historyPanel = document.getElementById('loginUsernameHistoryPanel');
  if (!form || !usernameInput || !historyPanel) return;

  /**
   * readHistory: executes this module action.
   */
  function readHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (item) {
        return typeof item === 'string' && item.trim().length > 0;
      });
    } catch (err) {
      return [];
    }
  }

  /**
   * writeHistory: executes this module action.
   */
  function writeHistory(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
    } catch (err) {
      // Ignore storage write failures.
    }
  }

  /**
   * filterHistory: executes this module action.
   */
  function filterHistory(list, keyword) {
    var query = String(keyword || '').trim().toLowerCase();
    if (!query) return list;
    return list.filter(function (item) {
      return item.toLowerCase().indexOf(query) !== -1;
    });
  }

  /**
   * hidePanel: executes this module action.
   */
  function hidePanel() {
    historyPanel.classList.add('d-none');
  }

  /**
   * showPanel: executes this module action.
   */
  function showPanel() {
    historyPanel.classList.remove('d-none');
  }

  /**
   * renderHistory: executes this module action.
   */
  function renderHistory(list) {
    historyPanel.innerHTML = '';
    if (!list.length) {
      hidePanel();
      return;
    }

    list.forEach(function (username) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'list-group-item list-group-item-action text-start font-monospace py-2';
      button.setAttribute('role', 'option');
      button.textContent = username;
      button.addEventListener('click', function () {
        usernameInput.value = username;
        hidePanel();
        usernameInput.focus();
      });
      historyPanel.appendChild(button);
    });

    showPanel();
  }

  form.addEventListener('submit', function () {
    var value = usernameInput.value.trim();
    if (!value) return;

    var current = readHistory();
    var normalized = value.toLowerCase();
    var deduped = current.filter(function (item) {
      return item.toLowerCase() !== normalized;
    });
    deduped.unshift(value);
    writeHistory(deduped);
  });

  usernameInput.addEventListener('focus', function () {
    renderHistory(readHistory());
  });

  usernameInput.addEventListener('input', function () {
    var history = readHistory();
    var filtered = filterHistory(history, usernameInput.value);
    renderHistory(filtered);
  });

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (target === usernameInput || historyPanel.contains(target)) return;
    hidePanel();
  });

  hidePanel();
});
