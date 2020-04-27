async function addToCart (id, element) {
	let response = await fetch("http://localhost:3000/cart/add?id=" + id);
	if (response.status == 201) {
		element.closest('div').innerHTML = '<button class="btn-gray" onclick="removeFromCart(' + id + ', this)">Удалить</button>';
	} 
	else if (response.status == 403) {
		element.innerHTML = "Действие недоступно";
	} 
	else if (response.status == 401)
	{
		window.location.href = "http://localhost:3000/entry/exit";
	}
	else {
		element.innerHTML = "Ошибка, попробуйте позже";
	}
}

async function removeFromCart (id, element) {
	console.log(id);
	let response = await fetch("http://localhost:3000/cart/remove?id=" + id);
	if (response.status == 403) {
		element.innerHTML = "Действие недоступно";
	} 
	else if (response.status == 401)
	{
		window.location.href = "http://localhost:3000/entry/exit";
	}
	else if(response.status == 520){
		element.innerHTML = "Ошибка сервера, попробуйте позже";
	}
	else
	{
		if(window.location.toString().substr('catalog') == -1)
		{
			element.closest('.goods-cards__item').style.display = "none"
		}
		else
		{
			console.log(response.status);
			element.closest('div').innerHTML = '<button class="btn-gray" onclick="addToCart(' + id + ', this)">В корзину</button>';
		}
	}
}
