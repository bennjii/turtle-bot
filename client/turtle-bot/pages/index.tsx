
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";

import ip from '../public/ip.json'

export const isBrowser = typeof window !== "undefined";

export default function Home() {
	const [ fleets, setFleets ] = useState(null);
	const wsInstance = useMemo(() => isBrowser ? io(ip.url) : null, []);

	useEffect(() => {
		if(!process.browser) return;

		wsInstance.send({
			type: "request",
			data: {
				fleet: "*",
			}
		})

		wsInstance.on('message', (data: any) => {
			// const parsed = JSON.parse(data);

			console.log(data);
			
			switch(data.type) {
				case "response":
					setFleets(data.data)
					break;
				default:
					break;
			}
		})
	}, [wsInstance])

	return (
		<div className={styles.container}>
			<div>
				<h1>Fleet Manager</h1>

				{
					fleets?.length ?
						fleets?.map((e: any) => {
							return (
								<div key={`FLEET-${e.name}`}>
									{ e?.name }
								</div>
							)
						})
					:
						null
				}
			</div>
		</div>
	)
}
