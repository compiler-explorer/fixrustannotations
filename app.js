
const fs = require('fs');
const path = require('path');

//const conandatapath = '/home/ce/.conan_server/data';
const conandatapath = './data';

const treshhold = Date("2022-06-10");

function recurse(root) {
    const dir = fs.opendirSync(root);
    while (true) {
        const dirent = dir.readSync();
        if (!dirent) break;

        fullpath = path.join(root, direct.name);
        if (dirent.isDirectory()) {
            recurse(fullpath);
        } else {
            const stats = fs.statSync(fullpath);
            if (stats.mtime.)
            const fd = fs.openSync(fullpath, "rw");
            if (fd) {
                console.log(JSON.stringify(dirent));
            }
        }
    }
    dir.closeSync();
}

recurse(conandatapath);
