document.addEventListener('DOMContentLoaded', function () {
  (function () {
    const screen = document.querySelector('.screen');
    const inputButtons = document.querySelectorAll('.btn[data-num]');
    const clear = document.querySelector('.btn-clear');
    const equal = document.querySelector('.btn-equal');

    if (!screen) return;

    function isOperator(ch) {
      return ch === '+' || ch === '-' || ch === '*' || ch === '/';
    }

    function appendValue(value) {
      const current = screen.value || '';
      const lastChar = current[current.length - 1] || '';

      if (value === '.') {
        // Prevent multiple dots in the current number segment
        let i = current.length - 1;
        while (i >= 0 && !isOperator(current[i])) i--;
        const segment = current.slice(i + 1);
        if (segment.includes('.')) return;
        if (segment === '') {
          screen.value = current + '0.';
          return;
        }
      }

      if (isOperator(value)) {
        if (current === '') {
          if (value === '-') screen.value = '-';
          return;
        }
        if (isOperator(lastChar) || lastChar === '.') {
          screen.value = current.slice(0, -1) + value;
          return;
        }
      }

      screen.value = current + value;
    }

    function sanitizeExpression(expr) {
      let cleaned = String(expr ?? '').replace(/\s+/g, '');
      // Allow only safe calculator characters
      if (!/^[0-9+\-*/.()]*$/.test(cleaned)) return null;

      // Trim trailing operators/dots
      while (cleaned.length && (isOperator(cleaned[cleaned.length - 1]) || cleaned[cleaned.length - 1] === '.')) {
        cleaned = cleaned.slice(0, -1);
      }
      return cleaned;
    }

    function evaluate() {
      const cleaned = sanitizeExpression(screen.value);
      if (!cleaned) {
        screen.value = '';
        return;
      }
      try {
        const result = Function('"use strict"; return (' + cleaned + ')')();
        if (typeof result !== 'number' || !Number.isFinite(result)) {
          screen.value = 'Err';
          return;
        }
        // Avoid showing 0.30000000000000004 style floats
        const rounded = Math.round((result + Number.EPSILON) * 1e12) / 1e12;
        screen.value = String(rounded);
      } catch (err) {
        screen.value = 'Err';
      }
    }

    inputButtons.forEach(function (button) {
      button.addEventListener('click', function (e) {
        const value = e.target.dataset.num;
        if (value === undefined) return;
        appendValue(value);
      });
    });

    if (equal) {
      equal.addEventListener('click', function () {
        evaluate();
      });
    }

    if (clear) {
      clear.addEventListener('click', function () {
        screen.value = '';
      });
    }

    document.addEventListener('keydown', function (e) {
      const key = e.key;

      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        evaluate();
        return;
      }
      if (key === 'Escape') {
        e.preventDefault();
        screen.value = '';
        return;
      }
      if (key === 'Backspace') {
        // Only intercept if user isn't typing into another input
        const active = document.activeElement;
        const isEditable = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (!isEditable) {
          e.preventDefault();
          screen.value = (screen.value || '').slice(0, -1);
        }
        return;
      }

      if (/^[0-9]$/.test(key) || key === '.' || isOperator(key)) {
        e.preventDefault();
        appendValue(key);
      }
    });
  })();
});
