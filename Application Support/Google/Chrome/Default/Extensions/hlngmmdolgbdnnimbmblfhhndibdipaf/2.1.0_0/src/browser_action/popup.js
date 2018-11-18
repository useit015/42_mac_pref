/* global chrome */
function getCurrentTabUrl (callback) {
  let queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    let tab = tabs[0];
    let url = tab.url;
    callback(url);
  });
}

function getHost (url) {
  let a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function getWoorankLanguage () {
  const language = window.navigator.userLanguage || window.navigator.language;
  if (language.indexOf('es') !== -1) {
    return 'es';
  } else if (language.indexOf('fr') !== -1) {
    return 'fr';
  } else if (language.indexOf('de') !== -1) {
    return 'de';
  } else if (language.indexOf('pt') !== -1) {
    return 'pt';
  } else if (language.indexOf('nl') !== -1) {
    return 'nl';
  } else if (language.indexOf('zh-Hans') !== -1) {
    return 'cn';
  } else if (language.indexOf('zh-Hant') !== -1) {
    return 'tw';
  }
  return 'en';
}

function getReviewUrl (url) {
  const domain = getHost(url).replace('www.', '');
  const lang = getWoorankLanguage();
  return 'https://www.woorank.com/' + lang + '/extensionv2/?url=' + domain;
}

function showIframe (e) {
  document.getElementById('mainPopup')
    .setAttribute('class', 'review-loaded');

  const loaderClass = 'loader';
  document.getElementsByClassName(loaderClass)[0]
    .setAttribute('class', `${loaderClass} hidden`);
  e.target.setAttribute('class', 'woorank-review');
}

function insertIframe (url) {
  let iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.setAttribute('class', 'woorank-review hidden');
  iframe.onload = showIframe;
  document.getElementsByClassName('woo-js-popup')[0].appendChild(iframe);
}

document.addEventListener('DOMContentLoaded', function () {
  getCurrentTabUrl(url => {
    url = url || '';
    const protocol = (url).split(':')[0] || '';
    const supportedProtocol = protocol.indexOf('http') === 0;
    if (supportedProtocol && url.length > 0) {
      insertIframe(getReviewUrl(url));
    } else {
      window.close();
    }
  });
});
