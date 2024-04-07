const fs = require('fs');

/* Moddify CapacitorQueryRunner.js */
let filePath = './node_modules/typeorm/driver/capacitor/CapacitorQueryRunner.js';
const correctBugInCapacitorQueryRunner = (file) => {
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.error(err);
        }

        const index = `"DROP",`
        if (index === -1) {
            console.warn('Line not found. Package probably fixed.');
            return;
        }

        var result = data.replace(
          `    "DROP",`,
          `    "DROP",
               "PRAGMA"`

        );
        result = result.replace(
            'else if (["INSERT", "UPDATE", "DELETE", "PRAGMA"].indexOf(command) !== -1) {',
            'else if (["INSERT", "UPDATE", "DELETE"].indexOf(command) !== -1) {'
        );

        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.error(err);
        });
    });
  } else {
      utils.warn(`Couldn't find file ${file}`);
  }

}
/* Moddify CapacitorDriver.js */
const correctBugInCapacitorDriver = (file) => {
  if (fs.existsSync(file)) {
      fs.readFile(file, 'utf8', function (err, data) {
          if (err) {
              return console.error(err);
          }

          const index = data.indexOf('await connection.run(`PRAGMA foreign_keys = ON`);');
          if (index === -1) {
              console.warn('Line not found. Package probably fixed.');
              return;
          }

          var result = data.replace(
              'await connection.run(`PRAGMA foreign_keys = ON`);',
              'await connection.execute(`PRAGMA foreign_keys = ON`, false);'
          );
          result = result.replace(
              'await connection.run(`PRAGMA journal_mode = ${this.options.journalMode}`);',
              'await connection.execute(`PRAGMA journal_mode = ${this.options.journalMode}`, false);'
          );

          fs.writeFile(file, result, 'utf8', function (err) {
              if (err) return console.error(err);
          });
      });
  } else {
      utils.warn(`Couldn't find file ${file}`);
  }
}
correctBugInCapacitorQueryRunner('./node_modules/typeorm/driver/capacitor/CapacitorQueryRunner.js');
correctBugInCapacitorQueryRunner('./node_modules/typeorm/browser/driver/capacitor/CapacitorQueryRunner.js');
correctBugInCapacitorDriver('./node_modules/typeorm/driver/capacitor/CapacitorDriver.js');
correctBugInCapacitorDriver('./node_modules/typeorm/browser/driver/capacitor/CapacitorDriver.js');


/*
const modTypeOrmCapacitor = (filePath, lineToModify, replacementText) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
  
    // Split data by line
    const lines = data.split('\n');
  
    // Modify the specific line
    if (lines.length >= lineToModify) {
      lines[lineToModify - 1] = replacementText; // Line numbers are 1-based
    } else {
      console.error('Line number to modify is out of range.');
      return;
    }
  
    // Join lines back together
    const modifiedData = lines.join('\n');
  
    // Write the modified data back to the file
    fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
     
      console.log('File modified successfully.');
    });
  });
}

let filePath = './node_modules/typeorm/driver/capacitor/CapacitorQueryRunner.js';
let lineToModify = 61;
let replacementText = '    else if (["INSERT", "UPDATE", "DELETE"].indexOf(command) !== -1) {';
*/
