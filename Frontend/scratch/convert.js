const fs = require('fs');
const path = require('path');

const serviceFiles = [
    'services.js',
    'servicesReservas.js',
    'servicesReservasADomicilio.js'
].map(f => path.join(__dirname, '..', 'src/services', f));

serviceFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Remove Authorization headers
    content = content.replace(/\s*'Authorization':\s*`Bearer \${localStorage\.getItem\('token'\)}`,?/g, '');
    
    // Add credentials: 'include' to all fetch calls
    // It's a bit tricky to parse perfectly, but most fetch calls have an options object
    // fetch(`${API_URL}...`, { ... })
    // If a fetch has no options object: fetch(`${API_URL}...`);
    // We replace `fetch(url)` with `fetch(url, { credentials: 'include' })`
    // We replace `fetch(url, {` with `fetch(url, { credentials: 'include', `
    
    // Replace fetch with options
    content = content.replace(/fetch\(([^,]+),\s*\{/g, 'fetch($1, { credentials: \'include\',');
    
    // Replace fetch without options (ends with ) or ;)
    content = content.replace(/fetch\(([^,]+)\)/g, 'fetch($1, { credentials: \'include\' })');
    
    // Fix double credentials if we ran it multiple times
    content = content.replace(/credentials:\s*'include',\s*credentials:\s*'include',/g, 'credentials: \'include\',');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Services updated");
