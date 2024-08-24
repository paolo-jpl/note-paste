browser.contextMenus.create({
  id: "note",
  title: "Copy with note",
  contexts: ["image"]
});

browser.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId == "note") {
    copyImgToClipboard(info.srcUrl);
  }
});

function notif(msg) {
  browser.notifications.create({
      type : 'basic',
      message : msg,
      title : 'NotePaste'
  });
}

async function copyImgToClipboard(imgUrl) {
  try {
    const data = await fetch(imgUrl, {mode: "cors"});
    const blob = await data.blob();
    await convertToPng(blob)
    notif("Copied!");
    console.log("copied")
  } catch (err) {
    console.log("error:")
    console.log(err);
  }
}

async function copyToClipboard(pngBlob) {
  try{
    await navigator.clipboard.write([
      new ClipboardItem({
          [pngBlob.type]: pngBlob
      })
    ]);
  } catch (err) {
    console.log(err.message);
  }
}

function createImage(options) {
  options = options || {};
  const img = (Image) ? new Image() : document.createElement("img");
  if (options.src) {
  	img.src = options.src;
  }
  return img;
}

function convertToPng(imgBlob) {
  const imageUrl = window.URL.createObjectURL(imgBlob);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageEl = createImage({ src: imageUrl });
  imageEl.onload = (e) => {
    canvas.width = e.target.width;
    canvas.height = e.target.height;
    ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
    canvas.toBlob(copyToClipboard, "image/png", 1);
  };      
}

