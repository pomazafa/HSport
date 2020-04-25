async function addToCart (id, element) {
	if(element.innerHTML === "Добавлено в корзину")
	{
    	
	}
	else
	{
		let response = await fetch("http://localhost:3000/cart/add?id=" + id);
   		//console.log(response.headers.get('message'));
   	
   		//console.log(response.status);
    	if (response.status == 201) {
       		element.innerHTML = "Добавлено в корзину";
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
}