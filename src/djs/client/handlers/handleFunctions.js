const fs = require('fs');



module.exports = function handleFunctions(functionFolders, path) {
        functionsArray = [];
        for (folder of functionFolders) {
            
            const functionFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of functionFiles) {
                console.log(`Folder: ${folder}`)
            console.log(`Function Files: ${functionFiles}`)

                console.log(`requiring`)
                console.log(`../../functions/${folder}/${file}`)

                const functionFile = require(`../../functions/${folder}/${file}`);
                functionsArray.push(functionFile.toString());

            }

        }
        console.log(`Handle Functions: ✅`)
        return functionsArray;
};