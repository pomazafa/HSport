module.exports = class RatingUpdateSubscribers {
	constructor() {
		this.clientList = {};
		this.addClient = this.addClient.bind(this);
	}

	addClient(productId, client) {
		const subscribers = this.clientList[productId];
		if(subscribers) {
			if(!subscribers.includes(client)) {
				subscribers.push(client);
			}
			else
			{
				this.clientList[productId] = [client];
			}
		}
	}

	removeClient(productId, client) {
		if(!this.clientList[productId]) {
			return;
		}
		this.clientList[productId] = this.clientList[productId].filter(c => c !== client);
	}
}