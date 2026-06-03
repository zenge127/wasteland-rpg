// 废土末日 - 打包为 exe 构建脚本
// 用法: node build-exe.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = __dirname;
const DIST_DIR = path.resolve(__dirname, '..', 'wasteland-rpg-dist');

console.log('🔨 废土末日 EXE 构建\n');
console.log(`  项目目录: ${PROJECT_DIR}`);
console.log(`  输出目录: ${DIST_DIR}\n`);

// 1. 重新拼接 bundle.js
console.log('[1/3] 拼接 JS 源文件...');
const jsDir = path.join(PROJECT_DIR, 'js');
const bundleOrder = [
  'worldgen.js',
  'data/cities.js', 'data/skills.js', 'data/enemies.js', 'data/items.js', 'data/quests.js',
  'player.js', 'combat.js', 'dungeon.js', 'hexmap.js', 'map.js', 'ui.js', 'game.js', 'main.js'
];

let bundle = '';
for (const file of bundleOrder) {
  const filePath = path.join(jsDir, file);
  if (fs.existsSync(filePath)) {
    bundle += fs.readFileSync(filePath, 'utf-8') + '\n';
  } else {
    console.error(`  ❌ 缺失: ${file}`);
    process.exit(1);
  }
}
fs.writeFileSync(path.join(jsDir, 'bundle.js'), bundle);
console.log(`  ✅ bundle.js (${(bundle.length / 1024).toFixed(0)} KB)`);

// 2. 清理旧构建
console.log('[2/3] 清理旧构建...');
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}

// 3. 用 nw-builder 构建
console.log('[3/3] NW.js 构建中...');
try {
  execSync(
    `npx nwbuild --platform win --arch x64 --outDir "${DIST_DIR}" --mode build --glob false "./"`,
    { cwd: PROJECT_DIR, stdio: 'inherit', timeout: 300000 }
  );
} catch (err) {
  console.error('  ❌ NW.js 构建失败:', err.message);
  process.exit(1);
}

// 4. 精简输出（移除 node_modules）
const packageNw = path.join(DIST_DIR, 'package.nw');
if (fs.existsSync(packageNw)) {
  const toRemove = ['node_modules', 'cache', 'scripts', 'package-lock.json'];
  for (const item of toRemove) {
    const itemPath = path.join(packageNw, item);
    if (fs.existsSync(itemPath)) {
      fs.rmSync(itemPath, { recursive: true, force: true });
    }
  }
}

// 显示结果
const exePath = path.join(DIST_DIR, 'wasteland-rpg.exe');
console.log(`\n✅ 构建完成!`);
console.log(`  📁 ${DIST_DIR}`);
console.log(`  🎮 ${exePath}`);
