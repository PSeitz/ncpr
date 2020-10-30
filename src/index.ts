#!/usr/bin/env node
import * as yargs from 'yargs'
import glob from 'glob'
import fs from 'fs'
import path from 'path'
const { sep } = require('path')
const argv = yargs
    .options({
        from: {
            type: 'string',
            describe: 'uses globs to get all from input e.g. "test_project/src/**/*.json", ** is required currently, don\'t forget to quote it',
        },
        to: { type: 'string', describe: 'the target path, e.g. test_project/dist/' },
        filter: { type: 'string', describe: 'a regex to filter files' },
        debug: { type: 'boolean', describe: 'print debug information' },
    })
    .demandOption(['from', 'to'], 'Please provide start argument to work with this tool').argv

let files = glob.sync(argv.from)
if( argv.debug){
    console.log("Glob Files")
    console.log(files)
}
if (argv.filter) {
    let regex = new RegExp(argv.filter)
    files = files.filter(regex.test)

    if( argv.debug){
        console.log("Filtered Files")
        console.log(files)
    }
}

let glob_star_root = argv.from.split("**");

if(glob_star_root.length > 1){
    let to_folder = argv.to.endsWith(sep) ? argv.to : argv.to + sep;
    let copy = files.map(file => 
        ({from: file, to: file.replace(glob_star_root[0], to_folder)})
    )

    for (const blub of copy) {
        var dirname = path.dirname(blub.to);
        fs.mkdirSync(dirname, { recursive: true });
        fs.copyFileSync(blub.from, blub.to)
    }
}


