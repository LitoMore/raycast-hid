import fs, {constants} from 'node:fs/promises';
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
	const macOsBuildPaths = ['HID-darwin-arm64', 'HID-darwin-x64'];
	const prebuildsStatuses = await Promise.all(
		macOsBuildPaths.map(async (buildPath) =>
			fs
				.access(
					path.join(destination, buildPath, 'node-napi-v3.node'),
					// eslint-disable-next-line no-bitwise
					constants.R_OK | constants.W_OK,
				)
				.then(() => true)
				.catch(() => false),
		),
	);

	if (prebuildsStatuses.every(Boolean)) return;
	await fs.cp(source, destination, {force: true, recursive: true});
};
