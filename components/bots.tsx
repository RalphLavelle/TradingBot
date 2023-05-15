import { useEffect, useState } from "react";
import { IBot } from '../interfaces';
import styles from './layout.module.scss';

function Bots() {

	const [selectedBot, setSelectedBot] = useState(null);
	const [bots, setBots] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [environment, setEnvironment] = useState(null);
	const [config, setConfig] = useState(null);
	const [activityAlert, setActivityAlert] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [types, setTypes] = useState([]);
	const newBot = { type: '', exchange: '', token: '', commandTopic: '' };
	const [formData, setFormData] = useState(newBot);

	useEffect(() => {
		loadBots();
		setEnvironment("DEV");
		setConfig("TEST");
		setTypes([ "MMFV", "OBS", "Volume" ]);
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
		let results: Array<IBot>;
		const storedBots = sessionStorage.getItem("bots");
		if(storedBots) {
			results = JSON.parse(storedBots);
		} else{
			results = await getBots();
			results = results.map(r => {
				return {
					...r,
					// timeStarted: "12 Jan 2023, 5:24pm"
				}
			});
			sessionStorage.setItem("bots", JSON.stringify(results));
		}
		
		setBots(results.sort((a: IBot, b: IBot) => { return a.name <= b.name ? 1 : -1; }));
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
		const results = await response.json();
		if(results.success) {
			changeState("stopped");
		} else {
			setActivityAlert("Error!");
		}
	}

	const add = () => {
		setSelectedBot(null);
		setEditMode(true);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
	};

	const save = async (e) => {
		e.preventDefault();
		setSaving(true);
		const bot = {
			type: formData.type,
			exchange: formData.exchange,
			token: formData.token,
			commandTopic: formData.commandTopic
		};
		const response: any = await fetch(`/api/bots`, {
			method: 'POST',
			body:  JSON.stringify(bot)
		});
		const results = await response.json();
		setSelectedBot(false);
		setSaved(true);
		setTimeout(() => {
			setSaved(false);	
		}, 1000);
		setEditMode(false);

		// clear cache and reload the bots
		sessionStorage.removeItem("bots");
		loadBots();
	}

	return (
		<>
			<div className={styles.bots}>
				<div className={styles.header}>
					<h2>Running bots {loading ? <img src="/images/spinner2.svg" alt="Loading..." width="40" height="40" /> : `(${bots.length} found)`}</h2>
					<button onClick={add}>+</button>
				</div>
				{ loading ? "" : 
				<form className={styles.bot} onSubmit={save} >
					<label>Environment:</label>
					<span>{ environment }</span>
					<label>Config:</label>
					<span>{ config }</span>
					
					{ editMode ? <>
						<label>Bot type:</label>
						<select id="type" name="type" required onChange={handleInputChange}>
							<option></option>
							{ types.map(type => (
								<option key={type}>{ type }</option>
							))}
						</select>
						<label>Exchange:</label>
						<input id="exchange" name="exchange" type="text" placeholder="Exchange" required onChange={handleInputChange} />
						<label>Token:</label>
						<input id="token" name="token" type="text" placeholder="Token" required onChange={handleInputChange} />
						<label>Command topic:</label>
						<textarea id="commandTopic" name="commandTopic" onChange={handleInputChange}></textarea>
						<label></label>
						<div className={styles.controls}>
							<button type="submit">SAVE</button>
							<img src="/images/spinner2.svg" alt="Saving..." width="40" height="40" />
							{ saved ? <span>Succesfully saved bot.</span> : null }
						</div>
					</> : <>
						<label>Select bot:</label>
						<select onChange={(e) => chooseBot(e)}>
							<option>----</option>
							{ bots.map(bot => (
								<option key={bot.id}>{ bot.name }</option>
							))}
						</select>
					</> }	
					{ selectedBot ? <>
						<label>Bot type:</label>
						<span>{ selectedBot.type }</span>
						<label>Status:</label>
						<span>{ selectedBot.status }</span>
						<label>Token:</label>
						<span>{ selectedBot.token }</span>
						<label>Exchange:</label>
						<span>{ selectedBot.exchange }</span>
						<label>Command topic:</label>
						<span>{ selectedBot.commandTopic }</span>
						<label>Controls:</label>
						<div className={styles.controls}>
							<button className={ selectedBot.status != 'active' ? styles.start : styles.alreadyStarted } onClick={start}>START</button>
							<button className={ selectedBot.status == 'active' ? styles.stop : styles.alreadyStopped } onClick={stop}>STOP</button>
							{ activityAlert ? <i className={styles.activityAlert}>{ activityAlert }</i> : null }
						</div>
					</> : null }
				</form>
				}
			</div>
			{/* { selectedBot ? <Controllers bot={selectedBot}></Controllers> : null } */}
		</>
	)
}

export default Bots;