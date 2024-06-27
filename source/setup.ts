#!/usr/bin/env node
import fs, {constants} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {sync as readPackageUpSync} from 'read-pkg-up';

const packageUp = readPackageUpSync({normalize: false});

if (!packageUp?.path) {
	console.error('Cannnot find package.json');
	process.exit(1);
}

const projectRoot = path.dirname(packageUp.path);

const getPrebuildPath = async () => {
	try {
		const nodeHidPrebuildPath = path.join(
			projectRoot,
			'node_modules',
			'node-hid',
			'prebuilds',
		);
		// eslint-disable-next-line no-bitwise
		await fs.access(nodeHidPrebuildPath, constants.R_OK | constants.W_OK);
		return nodeHidPrebuildPath;
	} catch {
		return path.join(
			projectRoot,
			'node_modules',
			'raycast-hid',
			'node_modules',
			'node-hid',
			'prebuilds',
		);
	}
};

const setup = async () => {
	const macOsBuildPaths = ['HID-darwin-arm64', 'HID-darwin-x64'];
	const prebuidlPath = await getPrebuildPath();
	await Promise.all(
		macOsBuildPaths.map(async (buildPath) => {
			const source = path.join(prebuidlPath, buildPath);
			const destination = path.join(
				projectRoot,
				'assets',
				'prebuilds',
				buildPath,
			);
			return fs.cp(source, destination, {force: true, recursive: true});
		}),
	);
	console.log('[Success]', 'Prebuilds copied to assets/prebuilds.');
};

void setup();
