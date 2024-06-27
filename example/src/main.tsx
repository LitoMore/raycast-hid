import {useEffect, useState} from 'react';
import {Color, List} from '@raycast/api';
import {HID, preparePrebuilds} from 'raycast-hid';

export default function Main() {
	const [isLoading, setIsLoading] = useState(true);
	const [devices, setDevices] = useState<HID.Device[]>([]);

	const loadDevices = async () => {
		await preparePrebuilds();
		const devices = HID.devices();
		setDevices(devices);
		setIsLoading(false);
	};

	useEffect(() => {
		void loadDevices();
	}, []);

	return (
		<List isLoading={isLoading}>
			{devices.map((device, index) => {
				const accessories = ['vendorId', 'productId']
					.map((k) => {
						const value = device[k as keyof HID.Device];
						return {
							tag: value ? String(value) : '',
						};
					})
					.filter((x) => Boolean(x.tag)) as Array<{tag: string}>;

				return (
					<List.Item
						key={`device-${index}`}
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						title={device.product || 'N/A'}
						subtitle={device.serialNumber}
						accessories={accessories}
					/>
				);
			})}
		</List>
	);
}
