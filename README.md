# raycast-hid

Access USB HID devices from Raycast

## Background

Due to the problem of Raycast building extension, you need to manually copy HID prebuilds to your extension folder. Also, Raycast only allows attachments to be placed in the `assets` directory.
However, `node-hid` can only find driver files in its own directory. This package prepares a set of methods to facilitate your HID-related development in Raycast.

## Install

```shell
npm i raycast-hid
```

## Usage

### 1. Setup prebuilds to your extension

Run `npx raycast-hid-setup` under your extension project directory to setup HID prebuilds to the `assets` folder.

### 2. Prepare prebuilds before running your extension

Remember to run `preparePrebuilds()` before you use any function from the HID.

```tsx
import { useEffect, useState } from "react";
import { List } from "@raycast/api";
import { HID, preparePrebuilds } from "raycast-hid";

export default function Command() {
	const [isLoading, setIsLoading] = useState(true);

	const loadPrebuilds = async () => {
		await preparePrebuilds();
		setIsLoading(false);
		console.log(HID.devices());
	};

	useEffect(() => {
		loadPrebuilds();
	}, []);

	return <List isLoading={isLoading} />;
}
```

## API

### preparePrebuilds()

This function programmatically copies the prebuilds files from `assets/prebuilds` to the correct directory for `node-hid`.

### HID

This exposes all `node-hid` functions. For example:

```typescript
import { HID } from "raycast-hid";

console.log(HID.devices());
```

## Related

- [node-hid](https://github.com/node-hid/node-hid) - Access USB & Bluetooth HID devices through Node.js

## License

MIT
