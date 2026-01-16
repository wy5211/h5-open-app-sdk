#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building XMInstallSDK...');

try {
  // 检查是否安装了依赖
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // 清除之前的构建产物
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    const { rmdirSync } = require('fs');
    const rimraf = require('rimraf');
    rimraf.sync(distPath);
    console.log('Cleared dist directory');
  }

  // 执行构建
  console.log('Running rollup build...');
  execSync('npx rollup -c', { stdio: 'inherit' });

  console.log('Build completed successfully!');
  console.log('Files created:');
  const files = fs.readdirSync(path.join(__dirname, 'dist'));
  files.forEach((file) => {
    console.log(`  - ${file}`);
  });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
