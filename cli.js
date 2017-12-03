#!/usr/bin/env node

'use strict';

const dns = require('dns');
const isUrl = require('is-url');
const got = require('got');
const ora = require('ora');
const jsonFile = require('jsonfile');
const chalk = require('chalk');
const cheerio = require('cheerio');
const logUpdate = require('log-update');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const spinner = ora();
const arg = process.argv[2];
const inf = process.argv[3];
const val = process.argv[4];

const setName = `${Math.random().toString(16).substr(10)}.json`;

let rad = `${process.argv[5]}.json` || setName;

if (rad === 'undefined.json') {
	rad = setName;
}

const log = console.log;
const end = process.exit;
const url = 'https://youtube.com/watch?v=';

const checkConnection = () => {
	dns.lookup('youtube.com', err => {
		if (err) {
			logUpdate(`\n${chalk.red('  ✖ ')} ${chalk.dim('Please check your internet connection!')}\n`);
			end(1);
		} else {
			logUpdate();
			spinner.text = 'Puffing...';
			spinner.start();
		}
	});
};

if (!arg || arg === '-h' || arg === '--help') {
	log(`
	        ${chalk.keyword('orange')('⚡⚡')} ${chalk.blue('Youtube Playlist Link Fetcher')} ${chalk.keyword('orange')('⚡⚡')}

 Usage: puf <commands> [url]
        puf <commands> [url] ${chalk.dim('<command>')}

 Commands:
   -f, ${chalk.dim('--fetch')}             Fetch url of items in the playlist
   -e, ${chalk.dim('--export')}            Export urls into json

 Extra:
   ${chalk.dim('-f')} url --name           Show links along with the title
   ${chalk.dim('-e')} url --name <name>    Set desired name of the exported playlist

 Help:
   $ puf -f ${chalk.dim('https://goo.gl/QcSugM')} --name
   $ puf -e ${chalk.dim('https://goo.gl/QcSugM')} --name course
		`);
	end(1);
}

if (!inf || isUrl(inf) === false) {
	log(`\n ${chalk.red('✖')} Things don't work this way. Provide a valid url\n\n ${chalk.blue('✔')} ${chalk.dim('Type')} ${chalk.cyan('$ puf --help')} ${chalk.dim('for more help')}\n`);
	end(1);
}

if (arg === '-f' || arg === '--fetch') {
	checkConnection();
	got(inf).then(res => {
		const $ = cheerio.load(res.body);
		const thumb = $('tr');

		logUpdate();

		if ((arg === '-f' || arg === '--fetch') && val === '--name') {
			$(thumb).each((i, links) => {
				const sources = `${url}${$(links).attr('data-video-id')}`;
				const names = $(links).attr('data-title');

				log(` ${chalk.bold.blue('⚡⚡')} ${chalk.green(names)}`);
				log(` ${chalk.yellow('⏩ ')} ${sources}   \n`);
				spinner.stop();
			});
		} else {
			$(thumb).each((i, links) => {
				const sources = `${url}${$(links).attr('data-video-id')}`;
				log(` ${chalk.yellow('⏩ ')} ${sources}   \n`);
				spinner.stop();
			});
		}
	}).catch(err => {
		logUpdate(`\n${err}\n`);
		end(1);
	});
}

if (arg === '-e' || arg === '--export') {
	checkConnection();

	got(inf).then(res => {
		const $ = cheerio.load(res.body);
		const tr = $('tr');

		logUpdate(`\n ${chalk.blue('🍁')}  Done! Playlist exported as : \n\n ${chalk.green('🌴')}  ${chalk.yellow(rad)} into ${chalk.blue(process.cwd())}\n`);

		for (let i = 0; i < tr.length; i++) {
			const obj = {
				playlist: []
			};

			for (let j = 0; j <= i; j++) {
				obj.playlist.push({
					id: tr.eq(j).attr('data-video-id'),
					url: url + tr.eq(j).attr('data-video-id'),
					name: tr.eq(j).attr('data-title')
				});
			}

			jsonFile.writeFile(rad, obj, {spaces: 2}, err => {
				end(1);
				log(err);
			});
		}
		spinner.stop();
	}).catch(err => {
		if (err) {
			logUpdate(`${err}`);
			end(1);
		}
	});
}
