import { ungzip } from "/static/js/pako/pako.min.mjs";


async function unpackTgs(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    const decompressed = ungzip(new Uint8Array(arrayBuffer));

    return JSON.parse(new TextDecoder().decode(decompressed));
  } catch (error) {
    console.error("Ошибка при распаковке .tgs:", error);
  }
}

function downloadBlob(blob, file_name) {
  let link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([blob.buffer], {type: "video/mp4"}));
  link.download = file_name;
  link.target = "_blank"
  document.body.appendChild(link);
  link.click();
}

export {unpackTgs, downloadBlob};
