async function addToCart (id, element) {
    let response = await fetch("http://localhost:3000/cart/add?id=" + id);
   	//console.log(element);
   	
   	console.log(response.status);
    if (response.ok) {
       	element.innerHTML = "Добавлено в корзину";
    } else {
       	element.innerHTML = "Ошибка, попробуйте позже";
}}