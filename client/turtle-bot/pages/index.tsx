
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";

import ip from '../public/ip.json'
import Drone from '@components/drone_component';
import { Drone as DroneType } from '@components/drone';

export const isBrowser = typeof window !== "undefined";

export default function Home() {
	const [ fleet, setFleet ] = useState(null);
	const wsInstance = useMemo(() => isBrowser ? io(ip.url) : null, []);

	useEffect(() => {
		if(!process.browser) return;

		wsInstance.send({
			type: "request",
			data: {
				fleet: "default",
			}
		})

		wsInstance.on('message', (data: any) => {
			// const parsed = JSON.parse(data);

			console.log(data);
			
			switch(data.type) {
				case "response":
					setFleet(data.data)
					break;
				default:
					break;
			}
		})
	}, [wsInstance])

	return (
		<div className={styles.container}>
			<div>

			</div>

			<div>
				{
					fleet?.drones?.map((e: DroneType) => {
						return (
							<Drone data={e} key={e.drone_id} />
						)
					})
				}
			</div>
		</div>
	)
}
