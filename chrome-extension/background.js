let logs = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.log) {
    logs.push(message.log);
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "debug-panel") {
    port.onMessage.addListener((msg) => {
      if (msg.request === "getLogs") {
        port.postMessage({ logs: logs });
      }
    });
  }
});