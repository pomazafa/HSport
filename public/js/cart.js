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


async function increaseCountCart (id, element) {
	let response = await fetch("http://localhost:3000/cart/increase?id=" + id);
	if (response.status == 200) {
		element.previousElementSibling.innerHTML++;
	} 
	else if (response.status == 403) {
		alert("Действие недоступно");
	} 
	else if (response.status == 401)
	{
		window.location.href = "http://localhost:3000/entry/exit";
	}
	else {
		alert("Ошибка, попробуйте позже");
	}
}

async function decreaseCountCart (id, element) {
	let response = await fetch("http://localhost:3000/cart/decrease?id=" + id);
	if (response.status == 200) {
		element.nextElementSibling.innerHTML--;
		if(element.nextElementSibling.innerHTML == 0)
		{
			// if(window.location.toString().substr('catalog') == -1)
			// {
				element.closest('.goods-cards__item').style.display = "none"
			//}
		}
	} 
	else if (response.status == 403) {
		alert("Действие недоступно");
	} 
	else if (response.status == 401)
	{
		window.location.href = "http://localhost:3000/entry/exit";
	}
	else {
		alert("Ошибка, попробуйте позже");
	}
}