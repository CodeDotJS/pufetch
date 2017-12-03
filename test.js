import childProcess from 'child_process';
import test from 'ava';

test.cb('default', t => {
	const cp = childProcess.spawn('./cli.js', {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 1);
		t.end();
	});
});

test.cb('listUrl', t => {
	const cp = childProcess.spawn('./cli.js', ['-f', 'https://goo.gl/QcSugM'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('listNameWithLink', t => {
	const cp = childProcess.spawn('./cli.js', ['-f', 'https://www.youtube.com/playlist?list=PLc96kFUJVrtPhEfjgA1mWH1PcXk33Yr-c', '--name'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('randomExport', t => {
	const cp = childProcess.spawn('./cli.js', ['-e', 'https://goo.gl/QcSugM'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 1);
		t.end();
	});
});

test.cb('exportWithName', t => {
	const cp = childProcess.spawn('./cli.js', ['-e', 'https://goo.gl/QcSugM', '--name', 'course'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 1);
		t.end();
	});
});
