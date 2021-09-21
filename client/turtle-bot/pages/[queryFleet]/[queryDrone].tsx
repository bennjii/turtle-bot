
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
import ActionMenu from '@components/action_menu';
import World from '@components/world';

export const isBrowser = typeof window !== "undefined";

export default function Home() {
    const router = useRouter()
    const { queryFleet, queryDrone } = router.query

	const [ fleet, setFleet ] = useState(null);
	const [ drone, setDrone ] = useState<DroneType>(null);

	const wsInstance = useMemo(() => isBrowser ? io(ip.url) : null, []);

	useEffect(() => {
		console.log(drone);
	}, [drone])

	useEffect(() => {
		if(!process.browser) return;

		if(!queryFleet || !queryDrone) return;

		wsInstance.send({
			type: "request",
			data: {
                fleet: queryFleet,
				drone: queryDrone,
			}
		})

		wsInstance.send({
			type: "request",
			data: {
				fleet: queryFleet,
			}
		})

		wsInstance.on('message', (data: any) => {
			console.log(data);
			
			switch(data.type) {
				case "response":
					if(data.data.drones) setFleet(data.data)
					else setDrone(data.data)
					break;
				case "update":
					if(data.data.drones) setFleet(data.data)
					else setDrone(data.data)
					break;
				default:
					break;
			}
		})

		return () => {
			wsInstance.close()
		}
	}, [wsInstance, queryFleet, queryDrone])

	const input_ref = useRef<HTMLInputElement>(null);
	const event_input = useRef(null);

	useEffect(() => {
		if(event_input.current) event_input.current.focus()
	}, [event_input])

	return (
		<DroneContext.Provider value={{ wsInstance, drone: drone, fleet: fleet }}>
			<div className={styles.container}>
				<input 
					type="text" 
					autoFocus 
					ref={event_input} 
					onBlur={() => { 
						event_input.current.focus() 
					}} 
					onKeyDown={(e) => {
						console.log(e.key);
						
						switch(e.key) {
							case "w":
								wsInstance.send({
									type: "action",
									data: {
										fleet: queryFleet,
										drone: queryDrone,
										query: `move`,
										args: ['forward']
									}
								})
								break;
							case "s":
								wsInstance.send({
									type: "action",
									data: {
										fleet: queryFleet,
										drone: queryDrone,
										query: `move`,
										args: ['back']
									}
								})
								break;
							case " ":
								wsInstance.send({
									type: "action",
									data: {
										fleet: queryFleet,
										drone: queryDrone,
										query: `move`,
										args: ['up']
									}
								})
								break;
							case "Control":
								wsInstance.send({
									type: "action",
									data: {
										fleet: queryFleet,
										drone: queryDrone,
										query: `move`,
										args: ['down']
									}
								})
								break;
							default:
								break;
						}
					}}
					className={styles.begone}
					/>

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
								<div className={styles.droneHeader}>
									<h2>{ drone?.drone_name }  <p>(#{ drone?.drone_id })</p></h2>
									<div className={drone?.online  ? styles.statusPositive : styles.statusNeutral}>
										{
											drone?.online ? "Online" : "Offline"
										}
									</div>
								</div>
								
								{/* <p>Manage drone, { drone?.drone_name } (#{ drone?.drone_id })</p> */}
							</div>

							<div className={styles.droneContent}>
								<div className={styles.droneToolbar}>
									<div>
										<ActionMenu name={"DIG"} action={"dig"} />

										<ActionMenu name={"PLACE"} action={"place"} />

										<ActionMenu name={"SUCK"} action={"suck"} />

										<ActionMenu name={"DROP"} action={"drop"} />
									</div>

									<div>
										<div className={styles.takeControl} onClick={() => {
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `mineTunnel`,
													args: ['3', '5', '17']
												}
											})
										}}> 
											Mine Tunnel
										</div> 

										<div className={styles.takeControl} onClick={() => {
											wsInstance.send({
												type: "action",
												data: {
													fleet: queryFleet,
													drone: queryDrone,
													query: `refuel`,
													args: ['']
												}
											})
										}}> 
											Refuel
										</div>
									</div>
									 
									<div>
										<p>{drone?.fuel} / {drone?.max_fuel}</p>
									</div>
								</div>

								<div className={styles.botWorld}>
									{
										drone ? 
										<World />
										:
										<></>
									}
									

									<div className={styles.inventory}>
										{
											drone?.inventory?.map((e: Slot, i: number) => {
												return e ? (
													<div 
														key={`${queryDrone}.INV.${i}`} 
														className={(i+1) == drone.selected_slot ? styles.selectedSlot : styles.inactiveItem}
														onClick={() => {
															wsInstance.send({
																type: "action",
																data: {
																	fleet: queryFleet,
																	drone: queryDrone,
																	query: `select`,
																	args: [i+1]
																}
															})
														}}
													>
														{ e.count }
													</div>
												) : <div className={(i+1) == drone.selected_slot ? styles.selectedSlot : styles.inactiveItem}></div>
											})
										}
									</div>

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
