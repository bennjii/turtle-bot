
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";

import ip from '../../public/ip.json'
import Drone from '@components/drone_component';
import { Drone as DroneType } from '@components/drone';
import { DroneContext, FleetContext } from '@components/context';
import { useRouter } from 'next/router';

export const isBrowser = typeof window !== "undefined";

export default function Home() {
    const router = useRouter()
    const { queryFleet, queryDrone } = router.query

	const [ drone, setDrone ] = useState(null);
	const wsInstance = useMemo(() => isBrowser ? io(ip.url) : null, []);

	useEffect(() => {
		if(!process.browser) return;

		wsInstance.send({
			type: "request",
			data: {
                fleet: queryFleet,
				drone: queryDrone,
			}
		})

		wsInstance.on('message', (data: any) => {
			console.log(data);
			
			switch(data.type) {
				case "response":
					setDrone(data.data)
					break;
				case "update":
					setDrone(data.data)
					break;
				default:
					break;
			}
		})
	}, [wsInstance, queryFleet, queryDrone])

	return (
		<DroneContext.Provider value={{ wsInstance, drone: drone }}>
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
						<h1>Drone</h1>
					</div>
					
					<div className={styles.content}>
						<div className={styles.droneList}>
							<div>
								<h2>{ drone?.drone_name }</h2>
								<p>Manage drone, { drone?.drone_name }</p>
							</div>

							<div>
                                {/* ... */}
                            </div>
						</div>
					</div>
				</div>
			</div>
		</DroneContext.Provider>
	)
}
