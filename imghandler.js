import { notif } from "./background.js";

export async function annotateImage(imgUrl) {
  try {
    const data = await fetch(imgUrl);
    const blob = await data.blob();
    await createImage(blob)
    notif("Copied!");
  } catch (err) {
    console.log(err);
  }
}

function createImage(imgBlob) {
  const imageUrl = window.URL.createObjectURL(imgBlob);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const imageEl = initImage({ src: imageUrl });
  
  imageEl.onload = (e) => {
    canvas.width = e.target.width;
    canvas.height = e.target.height;
    context.drawImage(e.target, 0, 0, e.target.width, e.target.height);
    writeText(context, null, null);
    canvas.toBlob(copyToClipboard, "image/png", 1);
  };
}

function openPopup(){
  const popupURL = browser.extension.getURL("views/inputs.html");

  browser.windows.create({
    url: popupURL,
    left: 1500, //TODO: make left and top dynamic
    top: 100,
    width: 400,
    height: 600,
    type: 'popup'
  })
}

function writeText(context, options, text){
  context.lineWidth = 1;
  context.fillStyle = "#CC00FF";
  context.lineStyle = "#ffff00";
  context.font = "18px sans-serif";
  context.fillText("@lkdgjhldghi", 30, 30);
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

function initImage(options) {
  options = options || {};
  const img = (Image) ? new Image() : document.createElement("img");
  if (options.src) {
  	img.src = options.src;
  }
  return img;
}