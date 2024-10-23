document.addEventListener('DOMContentLoaded', function () {
  const elements = {
    extractBtn: document.getElementById('extractBtn'),
    copyBtn: document.getElementById('copyBtn'),
    luaCopyBtn: document.getElementById('luaCopyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    idLinksDiv: document.getElementById('idLinks'),
    messageDiv: document.getElementById('message'),
    regexInput: document.getElementById('regexInput'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    body: document.body
  };

  const defaultRegex = /\/(\d+)(?=[\/?]|$)/;

  const applyTheme = (theme) => {
    elements.body.classList.remove('light', 'dark');
    elements.body.classList.add(theme);
    elements.themeToggleBtn.innerHTML = theme === 'light'
      ? '<i class="material-icons">brightness_6</i>'
      : '<i class="material-icons">brightness_2</i>';
  };

  const detectSystemTheme = () => window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  const savedTheme = localStorage.getItem('theme') || detectSystemTheme();
  applyTheme(savedTheme);

  elements.themeToggleBtn.addEventListener('click', () => {
    const newTheme = elements.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  const copyToClipboard = (content, successMessage) => {
    navigator.clipboard.writeText(content)
      .then(() => showMessage(successMessage))
      .catch(() => showMessage('Failed to copy'));
  };

  const showMessage = (message) => {
    elements.messageDiv.innerText = message;
    setTimeout(() => { elements.messageDiv.innerText = ''; }, 2000);
  };

  const getIdLinks = () => Array.from(elements.idLinksDiv.querySelectorAll('a')).map(link => link.textContent);

  const extractIds = () => {
    let userRegex;
    try {
      userRegex = elements.regexInput.value ? new RegExp(elements.regexInput.value) : defaultRegex;
    } catch {
      return showMessage('Invalid regular expression!');
    }

    chrome.tabs.query({}, (tabs) => {
      const idUrlPairs = tabs.reduce((acc, tab) => {
        const match = tab.url.match(userRegex);
        if (match && match[1]) acc.push({ id: match[1], url: tab.url });
        return acc;
      }, []);

      if (idUrlPairs.length) {
        elements.idLinksDiv.innerHTML = idUrlPairs.map(pair => `<a href="${pair.url}" target="_blank">${pair.id}</a>`).join('');
        [elements.copyBtn, elements.luaCopyBtn, elements.downloadBtn].forEach(btn => btn.disabled = false);
      } else {
        elements.idLinksDiv.innerHTML = '';
        showMessage('No IDs found.');
      }
    });
  };

  elements.extractBtn.addEventListener('click', extractIds);

  elements.copyBtn.addEventListener('click', () => {
    copyToClipboard(getIdLinks().join('\n'), 'Copied to clipboard!');
  });

  elements.luaCopyBtn.addEventListener('click', () => {
    copyToClipboard(`local ids = {${getIdLinks().join(', ')}}`, 'Lua table copied to clipboard!');
  });

  elements.downloadBtn.addEventListener('click', () => {
    const idsText = getIdLinks().join('\n');
    if (idsText) {
      chrome.downloads.download({
        url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(idsText),
        filename: 'ids.csv',
        saveAs: true
      }, () => showMessage('Download started.'));
    } else {
      showMessage('No data to download.');
    }
  });
});
