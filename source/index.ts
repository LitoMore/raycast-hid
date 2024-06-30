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
	const nodeNapiV3Path = 'node-napi-v3.node';
	const prebuildsStatuses = await Promise.all(
		macOsBuildPaths.map(async (buildPath) =>
			fs
				.access(
					path.join(destination, buildPath, nodeNapiV3Path),
					// eslint-disable-next-line no-bitwise
					constants.R_OK | constants.W_OK,
				)
				.then(() => true)
				.catch(() => false),
		),
	);

	if (prebuildsStatuses.every(Boolean)) return;
	await fs.rm(destination, {force: true, recursive: true});
	await Promise.all(
		macOsBuildPaths.map(async (buildPath) =>
			fs.cp(
				path.join(source, buildPath, nodeNapiV3Path),
				path.join(destination, buildPath, nodeNapiV3Path),
				{
					force: true,
					recursive: true,
				},
			),
		),
	);
};
