import gm from 'gm';
import fs from 'fs';

const THUMB_SIZE = 512 * 512;

/**
 * resizes and saves cover images
 */
export default function saveImage(sourcePath, outPath) {
  return new Promise(resolve => {
    if (!fs.existsSync('./media')) { fs.mkdirSync('./media'); }

    const gmImage = gm(sourcePath);

    gmImage.size((_err, size) => {
      const aspectRatio = size.width / size.height;

      gmImage.resize(
        Math.ceil(Math.sqrt(THUMB_SIZE * aspectRatio)),
        Math.ceil(Math.sqrt(THUMB_SIZE / aspectRatio)),
        '>'
      )
        .quality(80)
        .write(outPath, _err => {
          resolve();
        });
    });
  });
}
