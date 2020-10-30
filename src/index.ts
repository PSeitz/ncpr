#!/usr/bin/env node
import * as yargs from 'yargs'
import glob from 'glob'
import fs from 'fs'
import path from 'path'

const argv = yargs
    .options({
        from: {
            type: 'string',
            describe: 'uses globs to get all from input e.g. "test_project/src/**/*.json", ** is required currently, don\'t forget to quote it',
        },
        to: { type: 'string', describe: 'the target path, e.g. test_project/dist/' },
        filter: { type: 'string', describe: 'a regex to filter files' },
    })
    .demandOption(['from', 'to'], 'Please provide start argument to work with this tool').argv

let files = glob.sync(argv.from)
// console.log(files)
if (argv.filter) {
    let regex = new RegExp(argv.filter)
    files = files.filter(regex.test)
}

let glob_star_root = argv.from.split("**");

if(glob_star_root.length > 1){
    let copy = files.map(file => 
        ({from: file, to: file.replace(glob_star_root[0], argv.to)})
    )

    for (const blub of copy) {
        var dirname = path.dirname(blub.to);
        fs.mkdirSync(dirname, { recursive: true });
        fs.copyFileSync(blub.from, blub.to)
    }
}


