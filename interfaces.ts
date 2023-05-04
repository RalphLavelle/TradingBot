export interface IBot {
	commandTopic?: string;
	exchange: string;
	id: string;
	name: string;
	status: string;
	timeStarted: Date | string;
	token: string;
	type: string;
}