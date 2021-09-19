
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";

import ip from '../public/ip.json'
import Drone from '@components/drone_component';
import { Drone as DroneType } from '@components/drone';
import { FleetContext } from '@components/context';

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
		<FleetContext.Provider value={{ wsInstance, fleet: fleet }}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div>
						<h1>Fleet Manager</h1>
					</div>

					<div className={styles.headerDiv}>
						<a href="">Fleet</a>
						<a href="">Data</a>
					</div>
				</div>
				
				<div className={styles.contentDiv}>
					<div>
						<h1>Fleet</h1>
					</div>
					
					<div className={styles.content}>
						<div className={styles.droneList}>
							<div>
								<h2>{ fleet?.fleet_name }</h2>
								<p>Manage fleet { fleet?.fleet_name }</p>
							</div>

							<div className={styles.droneTable}>
								<div className={styles.tableHeader}>
									<p>Name</p>
									<p>Status</p>
									<p>Identifier</p>
									<p>Fuel level</p>
									<p>Execute</p>
								</div>

								{
									fleet?.drones?.map((e: DroneType) => {
										return (
											<Drone data={e} key={e.drone_id} />
										)
									})
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</FleetContext.Provider>
	)
}
