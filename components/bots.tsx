import { useEffect, useState } from "react";
import { IBot } from '../interfaces';
import styles from './layout.module.scss';

function Bots() {

	const [selectedBot, setSelectedBot] = useState(null);
	const [bots, setBots] = useState([]);
	const [loading, setLoading] = useState(false);
	const [environment, setEnvironment] = useState(null);
	const [config, setConfig] = useState(null);
	const [activityAlert, setActivityAlert] = useState(null);

	useEffect(() => {
		loadBots();
		setEnvironment("DEV");
		setConfig("TEST");
	}, []);

	const loadBots = async () => {
		setLoading(true);
		const getBots = async () => {
			const response: any = await fetch(`/api/bots`, {
				method: 'GET'
			});
			const results = await response.json();
			return results;
		};
		let results: Array<IBot> = await getBots();
		results = results.map(r => {
			return {
				...r,
				// timeStarted: "12 Jan 2023, 5:24pm"
			}
		})
		setBots(results);
		setLoading(false);
	}

	const chooseBot = (e) => {
		const bot = e.target.value;
		setSelectedBot(bots.find(b => b.name === bot));
	}

	const changeState = (action) => {
		if(selectedBot.status != action) {
			setTimeout(() => {
				setActivityAlert(null);
			}, 1000);
			selectedBot.status = action == "active" ? "active" : "stopped";
		}
	}

	const start = async () => {
		setActivityAlert("Starting...");

		const endpoint = `/api/bots/${selectedBot.id}`;
		const response = await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify({
				bot: selectedBot,
				command: "start"
			})
		});
		debugger;
		const results = await response.json();
		if(results.success) {
			changeState("active");
		} else {
			setActivityAlert("Error!");
		}
	}

	const stop = async () => {
		setActivityAlert("Stopping...");

		const endpoint = `/api/bots/${selectedBot.id}`;
		const response = await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify({
				bot: selectedBot,
				command: "stop"
			})
		});
		debugger;
		const results = await response.json();
		if(results.success) {
			changeState("stopped");
		} else {
			setActivityAlert("Error!");
		}
	}

	return (
		<>
			<div className={styles.bots}>
				<h2>Running bots {loading ? <img src="/images/spinner2.svg" alt="Loading..." width="40" height="40" /> : `(${bots.length} found)`}</h2>
				{ loading ? "" : 
				<div className={styles.bot}>
					<label>Environment:</label>
					<span>{ environment }</span>
					<label>Config:</label>
					<span>{ config }</span>
					<label>Select bot:</label>
					<form className={styles.form}>
						<select onChange={(e) => chooseBot(e)}>
							<option>----</option>
							{ bots.map(bot => (
								<option key={bot.name}>{ bot.name }</option>
							))}
						</select>
					</form>
					{ selectedBot ? <>
						<label>Status:</label>
						<span>{ selectedBot.status }</span>
						<label>Token:</label>
						<span>{ selectedBot.token }</span>
						<label>Exchange:</label>
						<span>{ selectedBot.exchange }</span>
						<label>Bot type:</label>
						<span>{ selectedBot.type }</span>
						<label>Command topic:</label>
						<span>{ selectedBot.commandTopic }</span>
						<label>Controls:</label>
						<div className={styles.controls}>
							<button className={ selectedBot.status != 'active' ? styles.start : styles.alreadyStarted } onClick={start}>START</button>
							<button className={ selectedBot.status == 'active' ? styles.stop : styles.alreadyStopped } onClick={stop}>STOP</button>
							{ activityAlert ? <i className={styles.activityAlert}>{ activityAlert }</i> : null }
						</div>
					</> : null }
				</div>
					// <table cellPadding="0" cellSpacing="0">
					// 	<thead>
					// 		<th>Name</th>
					// 		<th>Status</th>
					// 		<th>Token</th>
					// 		<th>Exchange</th>
					// 		<th>Bot type</th>
					// 		<th>Time started</th>
					// 	</thead>
					// 	{ bots.map(bot => (
					// 		<tr>
					// 			<td>
					// 				<button onClick={() => showControllers(bot)}>{bot.name}</button></td>
					// 			<td>{bot.status}</td>
					// 			<td>{bot.token}</td>
					// 			<td>{bot.exchange}</td>
					// 			<td>{bot.type}</td>
					// 			<td><time>{bot.timeStarted}</time></td>
					// 		</tr>
					// 	))}
					// </table>
				}
			</div>
			{/* { selectedBot ? <Controllers bot={selectedBot}></Controllers> : null } */}
		</>
	)
}

export default Bots;