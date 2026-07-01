const fs = require('fs');
const path = require('path');

const serviceFiles = [
    'services.js',
    'servicesReservas.js',
    'servicesReservasADomicilio.js'
].map(f => path.join(__dirname, '..', 'src/services', f));

serviceFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix mistaken catch replacements if any
    content = content.replace(/catch\s*\(\s*error\s*,\s*\{\s*credentials:\s*'include'\s*\}\s*\)/g, 'catch (error)');

    // Also fix fetch calls that missed the credentials
    // Some might look like: fetch(`${API_URL}/categorias`)
    // If they don't have credentials yet, let's add them.
    content = content.replace(/fetch\((`[^`]+`|'[^']+'|"[^"]+")\)/g, 'fetch($1, { credentials: \'include\' })');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Fixed files");
