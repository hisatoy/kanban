const fs = require('fs');
const path = require('path');

function createJsonFile() {
    const data = { message: "Hello" };
    const jsonFilePath = path.join(__dirname, 'data', 'hello.json');

    fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('JSON file has been saved.');
        }
    });
}

createJsonFile();
