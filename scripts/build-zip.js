const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

// 构建压缩包路径
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip')
// 构建包路径
const DEST_DIR = path.join(__dirname, '../dist')

main()

function main() {
  // 获取名称、版本号
  const {name, version} = extractExtensionData()
  // 设置压缩包文件名
  const zipFilename = `${name}-v${version}.zip`

  // 创建压缩包文件夹
  makeDestZipDirIfNotExists()

  // 创建压缩包
  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
    .then(() => console.info('OK'))
    .catch(console.err);
}

/**
 * 设置名称、版本号
 * @returns {{name: string, version: string}}
 */
function extractExtensionData() {
  const extPackageJson = require('../package')

  return {
    name: extPackageJson.name,
    version: extPackageJson.version
  }
}

/**
 * 检测压缩目录
 */
function makeDestZipDirIfNotExists() {
  // 以同步的方法检测压缩目录是否存在
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    // 如果不存在就同步创建一个压缩目录
    fs.mkdirSync(DEST_ZIP_DIR)
  }
}

/**
 * 压缩文件
 * @param src
 * @param dist
 * @param zipFilename
 * @returns {Promise<unknown>}
 */
function buildZip(src, dist, zipFilename) {
  console.info(`Building ${zipFilename}...`);

  const archive = archiver('zip', {zlib: {level: 9}});
  const stream = fs.createWriteStream(path.join(dist, zipFilename))

  return new Promise((res, rej) => {
    archive
      // append files from a src and false naming it within the archive
      .directory(src, false)
      .on('error', err => rej(err))
      // pipe archive data to the file
      .pipe(stream)

    stream.on('close', () => res())
    // 完成
    archive.finalize();
  })
}