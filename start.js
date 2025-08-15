const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Check if we're in the right directory
const serverPath = fs.existsSync('./server') ? './server' : '.';
const indexPath = path.join(serverPath, 'index.js');

if (!fs.existsSync(indexPath)) {
    console.error('Error: Cannot find index.js in server directory');
    console.log('Current directory contents:');
    console.log(fs.readdirSync('.'));
    process.exit(1);
}

console.log(`Starting server from: ${serverPath}`);

// Start the server
const serverProcess = spawn('node', ['index.js'], {
    cwd: serverPath,
    stdio: 'inherit'
});

serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
});
