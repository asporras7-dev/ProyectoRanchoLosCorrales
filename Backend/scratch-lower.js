const fs = require('fs');
const path = require('path');
const dir = './models';
fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.js')) return;
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/tableName:\s*['"]([^'"]+)['"]/g, (match, tableName) => {
        return 'tableName: \'' + tableName.toLowerCase() + '\'';
    });
    fs.writeFileSync(p, content);
    console.log('Updated ' + file);
});
