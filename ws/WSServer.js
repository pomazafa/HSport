const WebSocket = require('ws');
const RatingUpdateSubscribers = require('./RatingUpdateSubscribers.js');

const ratingUpdateSubscribers = new RatingUpdateSubscribers();

module.exports.wsServer = (httpServer) => {

	console.log(httpServer + "____________");


	const ws = new WebSocket.Server({
		server: httpServer
	});

	ws.on('connection', (ws) => {
		ws.on('message', (message) => {
			const parsedMessage = JSON.parse(message);
			switch (parsedMessage.event) {
				case 'add-rating-sub':
					ratingUpdateSubscribers.addClient(parsedMessage.productId, ws);
					break;

				case 'remove-rating-sub':
					ratingUpdateSubscribers.removeClient(parsedMessage.productId, ws);
					break;
			}
		})
	})
}

module.exports.notifyRatingUpdate = (productId, rating) => {
	const clients = ratingUpdateSubscribers.clientList[productId];
	if (!clients) {
		return;
	}

	clients.forEach(c => {
		c.send(JSON.stringify({
			event: 'rating-update',
			data: {
				productId: productId,
				rating: rating
			}
		}))
	})
}