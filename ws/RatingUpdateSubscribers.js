module.exports = class RatingUpdateSubscribers {
	constructor() {
		this.clientList = {};
		this.addClient = this.addClient.bind(this);
	}

	addClient(products, client) {
		products.forEach((productName) => {
			const subscribers = this.clientList[productName];
			if (subscribers) {
				if (!subscribers.includes(client)) {
					subscribers.push(client);
				} 
			}
			else {
				this.clientList[productName] = [client];
			}
		})
	}

	removeClient(products, client) {
		console.log('remove: ');
		console.log(products);
		products.forEach((productName) => {
			if (!this.clientList[productName]) {
				return;
			}
			this.clientList[productName] = this.clientList[productName].filter(c => c !== client);
		})
	}
}