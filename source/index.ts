import fs from 'node:fs/promises';
import path from 'node:path';
import {sync as readPackageUpSync} from 'read-pkg-up';

export * as HID from 'node-hid';

export const preparePrebuilds = async () => {
	// eslint-disable-next-line unicorn/prefer-module
	const packageUp = readPackageUpSync({cwd: __dirname, normalize: false});
	if (!packageUp?.path) {
		throw new Error('Cannnot find package.json');
	}

	const extensionRoot = path.dirname(packageUp.path);
	const source = path.join(extensionRoot, 'assets', 'prebuilds');
	const destination = path.join(extensionRoot, 'prebuilds');
	const hasPrebuilds = await fs
		.access(destination)
		.then(() => true)
		.catch(() => false);

	if (hasPrebuilds) return;
	await fs.cp(source, destination, {force: true, recursive: true});
};
