
const fs = require('fs');
const path = require('path');

const conandatapath = '/home/ce/.conan_server/data';

const treshhold = new Date("2022-06-09 16:35:00");

function recurse(root) {
    const dir = fs.opendirSync(root);
    while (true) {
        const dirent = dir.readSync();
        if (!dirent) break;

        const fullpath = path.join(root, dirent.name);
        if (dirent.isDirectory()) {
            recurse(fullpath);
        } else if (dirent.isFile() && (dirent.name === 'annotations.json')) {
            const stats = fs.statSync(fullpath);
            const allfeatures = (stats.mtime.getTime() > treshhold.getTime());

            let isRust = false;

            const conaninfopath = path.join(root, '0/conaninfo.txt');
            const conaninfo = fs.readFileSync(conaninfopath);
            if (conaninfo) {
                isRust = conaninfo.toString('utf8').includes('compiler=rust');
            }

            if (!isRust) continue;

            const buffer = fs.readFileSync(fullpath);
            if (buffer) {
                const content = buffer.toString('utf8');
                const json = JSON.parse(content);
                if (Object.keys(json).length === 1 && json.commithash) {
                    json.linker = '/opt/compiler-explorer/gcc-11.1.0';
                    if (allfeatures) {
                        json.build_method = '--all-features';
                    } else {
                        json.build_method = '';
                    }
                    console.log('writing to ' + fullpath + '(' + json.build_method + ')');
                    fs.writeFileSync(fullpath, JSON.stringify(json));
                } else {
                    //console.log('skipping ' + fullpath);
                }
            }
        }
    }
    dir.closeSync();
}

recurse(conandatapath);
