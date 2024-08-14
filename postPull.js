const fs = require('fs');
const path = require('path');

// Path to the index.html file
const filePath = path.join(__dirname, 'index.html');

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Replace the specified string
    const result = data.replace(
        'import * as opentype from "/txtonjpg/opentype.module.js";',
        'import * as opentype from "/opentype.module.js";'
    );

    // Write the updated content back to the file
    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File has been updated successfully.');
    });
});
