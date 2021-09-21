
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";

import ip from '../public/ip.json'
import Drone from '@components/drone_component';
import { Drone as DroneType } from '@components/drone';
import { FleetContext } from '@components/context';
import Fleet from '@components/fleet_component';

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
				case "update":
					setFleets([
						...fleets.filter(e => e.fleet_id !== data.data.fleet_id),
						data.data
					]);
					break;
				default:
					break;
			}
		});

		return () => {
			wsInstance.close()
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wsInstance])

	return (
		<FleetContext.Provider value={{ wsInstance, fleet: fleets }}>
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
						<h1>Fleet List</h1>
					</div>
					
					<div className={styles.content}>
						<div className={styles.droneList}>
							<div>
								<h2>Fleet List</h2>
								<p>Manage all fleets</p>
							</div>

							<div className={styles.fleetTable}>
								<div className={styles.tableHeader}>
									<p>Name</p>
									<p>Drones</p>
									<p>Identifier</p>
									<p>View</p>
								</div>

								{
									fleets?.map((e: any) => {
										return (
											<Fleet fleet_id={e.fleet_id} key={`FLEET-${e.fleet_id}`} />
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
