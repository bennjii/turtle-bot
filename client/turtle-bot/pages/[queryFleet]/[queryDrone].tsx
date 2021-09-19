
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from "socket.io-client";

import ip from '../../public/ip.json'
import Drone from '@components/drone_component';
import { Drone as DroneType, Slot } from '@components/drone';
import { DroneContext, FleetContext } from '@components/context';
import { useRouter } from 'next/router';
import { ArrowDown, ArrowRight, ArrowUp } from 'react-feather';

export const isBrowser = typeof window !== "undefined";

export default function Home() {
    const router = useRouter()
    const { queryFleet, queryDrone } = router.query

	const [ drone, setDrone ] = useState<DroneType>(null);
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

	const input_ref = useRef<HTMLInputElement>(null);

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
								<p>Manage drone, { drone?.drone_name } (#{ drone?.drone_id })</p>
							</div>

							<div className={styles.droneContent}>
								<div className={styles.droneToolbar}>
									<div className={styles.droneAction}>
										<ArrowUp onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `dig`,
													args: ['up']
												}
											})
										}/>

										<div onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `dig`,
													args: ['forward']
												}
											})
										}>Dig</div>

										<ArrowDown onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `dig`,
													args: ['down']
												}
											})
										}/>
									</div>

									<div className={styles.droneAction}>
										<ArrowUp onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `place`,
													args: ['up']
												}
											})
										}/>

										<div onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `place`,
													args: ['forward']
												}
											})
										}>Place</div>

										<ArrowDown onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `place`,
													args: ['down']
												}
											})
										}/>
									</div>

									<div className={styles.droneAction}>
										<ArrowUp onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `suck`,
													args: ['up']
												}
											})
										}/>

										<div onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `suck`,
													args: ['forward']
												}
											})
										}>Suck</div>

										<ArrowDown onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `suck`,
													args: ['down']
												}
											})
										}/>
									</div>

									<div className={styles.droneAction}>
										<ArrowUp onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `drop`,
													args: ['up']
												}
											})
										}/>

										<div onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `drop`,
													args: ['forward']
												}
											})
										}>Drop</div>

										<ArrowDown onClick={() => 
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `drop`,
													args: ['down']
												}
											})
										}/>
									</div>

									<div>
										<p>{drone?.fuel} / {drone?.max_fuel}</p>
									</div>
								</div>

								<div>
									<div className={styles.inventory}>
										{
											drone?.inventory?.map((e: Slot, i: number) => {
												return (
													<div key={`${queryDrone}.INV.${i}`} className={(i+1) == drone.selected_slot ? styles.selectedSlot : styles.inactiveItem}>
														{ e.count }
													</div>
												)
											})
										}
									</div>

									{/* <div className={styles.takeControl} onClick={() => {
										wsInstance.send({
											type: "action",
											data: {
												fleet: queryFleet,
												drone: queryDrone,
												query: `refuel`,
												args: ['1']
											}
										})
									}}> 
										Refuel
									</div>  */}

									{/* <div>
										<input type="text" ref={input_ref} />

										<button onClick={() => {
											wsInstance.send({
												type: "exec",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: input_ref.current.value
												}
											})
										}}>Execute</button>
									</div> */}
								</div>
                            </div>
						</div>
					</div>
				</div>
			</div>
		</DroneContext.Provider>
	)
}
