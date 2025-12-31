const fs = require('fs');
const path = require('path');

function fixPathsInDirectory(dir, basePath) {
  console.log(`\n🔧 Виправляю шляхи в ${dir} з base path: ${basePath}\n`);

  // 1. Виправляємо HTML
  const htmlPath = path.join(dir, 'index.html');
  if (fs.existsSync(htmlPath)) {
    console.log('📄 Виправляю index.html');
    let html = fs.readFileSync(htmlPath, 'utf-8');
    html = html.replace(/<base href="[^"]*"/, `<base href="${basePath}">`);
    html = html.replace(/href="\/assets\//g, 'href="./assets/');
    html = html.replace(/src="\/assets\//g, 'src="./assets/');
    fs.writeFileSync(htmlPath, html);
    console.log('  ✓ HTML виправлено');
  }

  // 2. Виправляємо всі JS файли в assets
  const assetsDir = path.join(dir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.log('⚠️  Папка assets не знайдена!');
    return;
  }

  const files = fs.readdirSync(assetsDir);
  
  // Знаходимо головний JS файл
  const mainJsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
  
  if (mainJsFile) {
    console.log('📦 Виправляю головний JS:', mainJsFile);
    const jsPath = path.join(assetsDir, mainJsFile);
    let jsContent = fs.readFileSync(jsPath, 'utf-8');
    
    // Виправляємо history base path
    jsContent = jsContent.replace(/history:ku\("\/[^"]*"\)/g, `history:ku("${basePath}")`);
    jsContent = jsContent.replace(/"\/assets\//g, '"./assets/');
    jsContent = jsContent.replace(/'\/assets\//g, "'./assets/");
    
    fs.writeFileSync(jsPath, jsContent);
    console.log('  ✓ Головний JS виправлено');
  }

  // 3. Виправляємо всі інші JS та CSS файли
  console.log('📦 Виправляю інші assets файли');
  let fixed = 0;
  
  files.filter(f => f.endsWith('.js') || f.endsWith('.css')).forEach(file => {
    if (file === mainJsFile) return; // Вже виправили
    
    const filePath = path.join(assetsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    const original = content;
    content = content.replace(/"\/assets\//g, '"./assets/');
    content = content.replace(/'\/assets\//g, "'./assets/");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      fixed++;
    }
  });
  
  console.log(`  ✓ Виправлено ${fixed} файлів`);
}

// Виправляємо кореневу папку
console.log('=' .repeat(60));
console.log('ВИПРАВЛЕННЯ КОРЕНЕВОЇ ПАПКИ');
console.log('=' .repeat(60));
fixPathsInDirectory('.', '/2026/');

// Виправляємо папку new-year-2026
console.log('\n' + '='.repeat(60));
console.log('ВИПРАВЛЕННЯ ПАПКИ new-year-2026');
console.log('=' .repeat(60));
fixPathsInDirectory('./new-year-2026', '/2026/new-year-2026/');

console.log('\n\n🎉 ВСЕ ВИПРАВЛЕНО!');
console.log('\nТепер працюватимуть обидві адреси:');
console.log('  • https://namenick2014.github.io/2026/');
console.log('  • https://namenick2014.github.io/2026/new-year-2026/');