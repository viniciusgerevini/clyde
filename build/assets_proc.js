import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import cssnano from 'cssnano';


export default async function processAsset(content, assetType, _filePath) {
  if (assetType === "style") {
    return postcss([autoprefixer, cssnano])
      .process(content)
      .then(result =>  result.css);
  }
  return false; // skip processing for files other than styles
}
