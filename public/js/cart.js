async function addToCart(id, element) {
    let response = await fetch("http://localhost:3000/cart/add?id=" + id);
    if (response.status == 201) {
        element.closest('div').innerHTML = "<button class=\"btncart btn_minus goods-action-btn\" onclick=\"decreaseCountCart(" + id + ", this)\"></button><h4 class=\"block-title\">1</h4><button class=\"btncart btn_plus goods-action-btn\" onclick=\"increaseCountCart(" + id + ", this)\"></button>";
        //  '<button class="btn-gray" onclick="removeFromCart(' + id + ', this)">Удалить</button>';
    } else if (response.status == 403) {
        element.innerHTML = "Действие недоступно";
    } else if (response.status == 401) {
        window.location.href = "http://localhost:3000/entry/exit";
    } else {
        element.innerHTML = "Ошибка, попробуйте позже";
    }
}

async function removeFromCart(id, element) {
    let response = await fetch("http://localhost:3000/cart/remove?id=" + id);
    if (response.status == 403) {
        element.innerHTML = "Действие недоступно";
    } else if (response.status == 401) {
        window.location.href = "http://localhost:3000/entry/exit";
    } else if (response.status == 520) {
        element.innerHTML = "Ошибка сервера, попробуйте позже";
    } else {
        if (window.location.toString().substr('catalog') == -1) {
            element.closest('.goods-cards__item').style.display = "none"
        } else {
            console.log(response.status);
            element.closest('div').innerHTML = '<button class="btn-gray" onclick="addToCart(' + id + ', this)">В корзину</button>';
        }
    }
}


async function increaseCountCart(id, element) {
    let response = await fetch("http://localhost:3000/cart/increase?id=" + id);
    if (response.status == 200) {
        element.previousElementSibling.innerHTML++;
    } else if (response.status == 403) {
        alert("Действие недоступно");
    } else if (response.status == 401) {
        window.location.href = "http://localhost:3000/entry/exit";
    } else {
        alert("Ошибка, попробуйте позже");
    }
}

async function decreaseCountCart(id, element) {
    let response = await fetch("http://localhost:3000/cart/decrease?id=" + id);
    if (response.status == 200) {
        element.nextElementSibling.innerHTML--;
        if (element.nextElementSibling.innerHTML == 0) {
            if(!(window.location.toString().includes('catalog') || window.location.toString().includes('product')))
            {
                element.closest('.goods-cards__item').style.display = "none"
            }
            else
            {
                element.closest('div').innerHTML = "<button class=\"btn-gray\" onclick=\"addToCart(" + id + ", this)\">В корзину</button>"
            }
        }
    } else if (response.status == 403) {
        alert("Действие недоступно");
    } else if (response.status == 401) {
        window.location.href = "http://localhost:3000/entry/exit";
    } else {
        alert("Ошибка, попробуйте позже");
    }
}

async function completeOrder(element) {
    let response = await fetch("http://localhost:3000/cart/complete");
    if (response.status == 200) {
        window.location.href = "http://localhost:3000/cart/carts";
    } else if (response.status == 403) {
        alert("Действие недоступно");
    } else if (response.status == 500) {
        alert("Ошибка сервера, попробуйте позже");
    } else if (response.status == 401) {
        window.location.href = "http://localhost:3000/entry/exit";
    } else {
        alert("Ошибка, попробуйте позже");
    }
}