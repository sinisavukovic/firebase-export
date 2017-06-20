#!/usr/bin/env node
const fs = require('fs'),
	dot = require('dot-wild'),
	request = require('request'),
	JSONStream = require('JSONStream');

const argv = require('optimist')
  .usage('Usage: $0')

  .demand('database_url')
  .describe('database_url', 'Firebase database URL (e.g. https://databaseName.firebaseio.com).')
  .alias('d', 'database_url')

  .demand('firebase_secret')
  .describe('firebase_secret', 'Firebase secret.')
  .alias('d', 'database_url')

  .describe('exclude', 'Paths to exclude. (e.g. settings/*, users/*/settings)')
  .alias('e', 'exclude')
  .argv;

const URL = argv.database_url + '/.json?format=export&auth=' + argv.firebase_secret;

function formatPath(path) {
	return path.split('/').join('.');
}

function list(val) {
  return val.split(',').map((item) => item.trim());
}

function excludeData(data, exclude) {
	var excludedData = data;
	exclude.forEach((excludePath) => {
		let path = formatPath(excludePath);
    	excludedData = dot.remove(excludedData, path);
	});
	return excludedData;
}

function main(){
	let json = {};
	request({url: URL})
	.pipe(JSONStream.parse("$*"))
	.on('data', (r) => {
		json[r.key] = r.value;
	})
	.on('error', (e) => {
		console.log(`[ERROR] ${new Date()} problem with request: ${e.message}`);
	})
	.on('close', () => {
		exportData(json);
	});
}

function exportData(data) {
	const exclude = list(argv.exclude);
	const fileName = getFileName();
	const json = excludeData(data, exclude);
	writeToFile(fileName, json);
}

function getFileName(){
	const now = new Date();
	return `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()}-${now.getTime()}.json`;
}

function writeToFile(filename, data) {
    fs.writeFile(filename, JSON.stringify(data), (err) => {
		if(err) {
			console.log(err);
		} else {
			console.log(`[SUCCESS] ${new Date()} JSON saved to ${filename}`);
		}
	});
}

main();
