const WebSocket = require('ws');
const RatingUpdateSubscribers = require('./RatingUpdateSubscribers.js');

const ratingUpdateSubscribers = new RatingUpdateSubscribers();

module.exports.wsServer = (httpServer) => {

	const ws = new WebSocket.Server({
		server: httpServer
	});

	ws.on('connection', (ws) => {
		ws.on('message', (message) => {
			const parsedMessage = JSON.parse(message);
			switch (parsedMessage.event) {
				case 'add-rating-sub':
					ratingUpdateSubscribers.addClient(parsedMessage.products, ws);
					break;

				case 'remove-rating-sub':
					ratingUpdateSubscribers.removeClient(parsedMessage.products, ws);
					break;
			}
		})
	})
}

module.exports.notifyRatingUpdate = (productName, rating, comment) => {
	const clients = ratingUpdateSubscribers.clientList[productName];
	if (!clients) {
		return;
	}
	clients.forEach(c => {
		c.send(JSON.stringify({
			event: 'rating-update',
			data: {
				productName: productName,
				rating: rating,
				comment: comment
			}
		}))
	})
}