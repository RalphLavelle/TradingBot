import { useEffect, useState } from "react";
import { IBot } from '../interfaces';
import styles from './layout.module.scss';

function Controllers({bot}) {

	//const [Bot, setBot] = useState([]);
	//const [loading, setLoading] = useState(false);

	useEffect(() => {
		//loadBots();
		// setBot(bot);
	}, []);

	return (
		<div className={styles.controllers}>
			<h2>Controllers for {bot.name}</h2>
			<div>
				Controllers form...
			</div>
		</div>
	)
}

export default Controllers;