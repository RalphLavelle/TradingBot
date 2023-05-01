import { IBot } from '../interfaces'; 

export class TestDB {

	getBots = async(): Promise<Array<IBot>> => {
		const bots = [
			{
				exchange: "Binance",
				name: "TestBot1",
				status: "active",
				timeStarted: new Date(),
				token: "1234567890",
				type: "MMFV"
			},
			{
				exchange: "Uniswap",
				name: "TestBot2",
				status: "stopped",
				timeStarted: new Date(),
				token: "1234567890",
				type: "Volume"
			},
			{
				exchange: "Crypto Exchange",
				name: "TestBot3",
				status: "active",
				timeStarted: new Date(),
				token: "1234567890",
				type: "OBS"
			}
		];
		return await bots;
	}
} 