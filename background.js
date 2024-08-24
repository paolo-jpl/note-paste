import { annotateImage } from './imghandler.js'

browser.contextMenus.create({
  id: "note",
  title: "Copy with note",
  contexts: ["image"]
});

browser.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId == "note") {
    annotateImage(info.srcUrl);
  }
});

export function notif(msg) {
  browser.notifications.create({
      type : 'basic',
      message : msg,
      title : 'NotePaste'
  });
}
