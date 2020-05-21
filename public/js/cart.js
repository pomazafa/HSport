async function addToCart(id, element) {
    let response = await fetch("/cart/add?id=" + id);
    if (response.status == 201) {
        element.closest('.goods-action__item').innerHTML = "<div class=\"goods-action__item-content\"><button class=\"btn-cart btn-cart--minus\" onclick=\"decreaseCountCart(" + id + ", this)\"></button><h4 class=\"goods-action__title\">1</h4><button class=\"btn-cart btn-cart--plus\" onclick=\"increaseCountCart(" + id + ", this)\"></button></div>";
        //  '<button class="btn-gray" onclick="removeFromCart(' + id + ', this)">Удалить</button>';
    } else if (response.status == 403) {
        element.innerHTML = "Действие недоступно";
    } else if (response.status == 401) {
        window.location.href = "/entry/exit";
    } else {
        element.innerHTML = "Ошибка, попробуйте позже";
    }
}

async function removeFromCart(id, element) {
    let response = await fetch("/cart/remove?id=" + id);
    if (response.status == 403) {
        element.innerHTML = "Действие недоступно";
    } else if (response.status == 401) {
        window.location.href = "/entry/exit";
    } else if (response.status == 520) {
        element.innerHTML = "Ошибка сервера, попробуйте позже";
    } else {
        if (window.location.toString().substr('catalog') == -1) {
            element.closest('.goods-cards__item').style.display = "none"
        } else {
            console.log(response.status);
            element.closest('.goods-action__item').innerHTML = '<button class="btn-gray" onclick="addToCart(' + id + ', this)">В корзину</button>';
        }
    }
}


async function increaseCountCart(id, element) {
    let response = await fetch("/cart/increase?id=" + id);
    if (response.status == 200) {
        element.previousElementSibling.innerHTML++;
    } else if (response.status == 403) {
        alert("Действие недоступно");
    } else if (response.status == 401) {
        window.location.href = "/entry/exit";
    } else {
        alert("Ошибка, попробуйте позже");
    }
}

async function decreaseCountCart(id, element) {
    let response = await fetch("/cart/decrease?id=" + id);
    if (response.status == 200) {
        element.nextElementSibling.innerHTML--;
        if (element.nextElementSibling.innerHTML == 0) {
            if (!(window.location.toString().includes('catalog') || window.location.toString().includes('product'))) {
                element.closest('.goods-cards__item').style.display = "none";
                var flagElement = false;

                var list = document.getElementsByClassName('goods-cards__item')
                for (let element of list) {
                    if (element.style.display != "none") {
                        flagElement = true;
                        break;
                    }
                }
                if (!flagElement) {
                    window.location.href = '/catalog';
                }
            } else {
                element.closest('.goods-action__item').innerHTML = "<button class=\"btn-gray\" onclick=\"addToCart(" + id + ", this)\">В корзину</button>"
            }
        }
    } else if (response.status == 403) {
        alert("Действие недоступно");
    } else if (response.status == 401) {
        window.location.href = "/entry/exit";
    } else {
        alert("Ошибка, попробуйте позже");
    }
}

async function completeOrder(element) {
    let response = await fetch("/cart/complete");
    if (response.status == 200) {
        window.location.href = "/cart/orders";
    } else if (response.status == 403) {
        alert("Действие недоступно");
    } else if (response.status == 500) {
        alert("Ошибка сервера, попробуйте позже");
    } else if (response.status == 401) {
        window.location.href = "/entry/exit";
    } else {
        alert("Ошибка, попробуйте позже");
    }
}