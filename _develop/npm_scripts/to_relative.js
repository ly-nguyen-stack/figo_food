const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const url = require('url');
const colors = require('./colors');

const dir = process.cwd();
const dest = path.join(dir, process.env.npm_package_config_dest + process.env.npm_package_config_subDirectory);

function printAllFiles(dir) {
  const filenames = fs.readdirSync(dir);
  filenames.forEach((filename) => {
    const fullPath = path.join(dir, filename);
    const stats = fs.statSync(fullPath);
    if (stats.isFile()) {
      if (fullPath.includes('.html')) {
        const html = fs.readFileSync(fullPath, { encoding: 'utf-8' });
        const $ = cheerio.load(html);

        $('script[src^="/"]').each((i, elem) => {
          const src = $(elem).attr('src');
          $(elem).attr('src', getRelativePath(fullPath, src));
        });

        $('img[src^="/"]').each((i, elem) => {
          const src = $(elem).attr('src');
          $(elem).attr('src', getRelativePath(fullPath, src));
        });

        $('img[srcset^="/"]').each((i, elem) => {
          const src = $(elem).attr('srcset');
          $(elem).attr('srcset', getRelativePath(fullPath, src));
        });

        $('a[href^="/"]').each((i, elem) => {
          const src = $(elem).attr('href');
          $(elem).attr('href', getRelativePath(fullPath, src));
        });

        $('link[href^="/"]').each((i, elem) => {
          const src = $(elem).attr('href');
          $(elem).attr('href', getRelativePath(fullPath, src));
        });

        $('source[srcset^="/"]').each((i, elem) => {
          const src = $(elem).attr('srcset');
          $(elem).attr('srcset', getRelativePath(fullPath, src));
        });

        const output = $.html({ decodeEntities: false });
        fs.writeFileSync(fullPath, output);
        console.log(
          `${colors.blueBg}${colors.black} change ${colors.reset} : ${fullPath} ${colors.greenBg}${colors.black} DONE. ${colors.reset}`
        );
      }
    } else if (stats.isDirectory()) {
      printAllFiles(fullPath);
    }
  });
}

console.log(`${colors.redBg}${colors.black} ====== 相対パス化 ====== ${colors.reset}\n\n`);
function getRelativePath(from, target) {
  const targetPath = path.join(dest, target);
  const name = path.extname(targetPath);
  if (name) {
    return path.relative(path.dirname(from), targetPath);
  } else {
    return path.relative(path.dirname(from), targetPath) + '/';
  }
}

printAllFiles(dest);
