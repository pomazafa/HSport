
   function getDateHelper(myDate) {
    myDate = new Date(myDate);
          var minute = myDate.getMinutes();
          var month = myDate.getMonth() + 1;
          if (minute < 10) {
              minute = "0" + minute;
          }
          if (month < 10) {
              month = "0" + month;
          }
          return  myDate.getDate() + '.' + month + '.' + myDate.getFullYear()+ " " + myDate.getHours() + ":" + minute;
      }

 const HOST = location.origin.replace(/^http/, 'ws')
 const socket = new WebSocket(HOST);

 const productsElements = document.getElementsByClassName('product-name');

 let products = [];

 for (let element of productsElements) {
    products.push(element.innerText)
 }

 socket.onopen = function () {
    const outgoingMessage = {
       event: 'add-rating-sub',
       products: products
    };
    socket.send(JSON.stringify(outgoingMessage));
    return false;
 };

 socket.onclose = function () {
    const outgoingMessage = {
       event: 'remove-rating-sub',
       products: products
    };
    socket.send(JSON.stringify(outgoingMessage));
    return false;
 }

 socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    if (message.event == "rating-update") {
       var data = message.data;
       showMessage(data);
    }
 };

 function showMessage(message) {
    document.getElementById(`${message.productName}-${message.rating}`).checked = true;
    let comments = document.getElementsByClassName("comments");
    if (!comments[0].lastElementChild.classList.contains("comment")) {
       comments[0].removeChild(comments[0].lastElementChild);
    }
    comment = document.getElementById(`${message.comment.id}-${message.comment.rating}`);
    if (comment) {
       comment.checked = true;
       let commentDate = null;
       for (var i = 0; i < comment.closest(".comment-head").childNodes.length; i++) {
          if (comment.closest(".comment-head").childNodes[i].className == "comment-date") {
             commentDate = comment.closest(".comment-head").childNodes[i];
             break;
          }
       }
       if(commentDate)
       {
          commentDate.innerText = getDateHelper(message.comment.commentDate);
       }
       let commentText = null;
       for (var i = 0; i < comment.closest(".comment").childNodes.length; i++) {
          if (comment.closest(".comment").childNodes[i].className == "comment__text") {
             commentText = comment.closest(".comment").childNodes[i];
             break;
          }
       }
       if(commentText)
       {
          commentText.innerText = message.comment.message;
       }
    }
    else
    {
       let htmlinput = "";
       htmlinput += "<div class=\"comment\">"+
          "<div class=\"comment-head\">" +
                "<p class=\"comment__name\">";
                   if(message.user.status == 1)
                   {
                      if(message.user.name)
                      {
                         htmlinput += message.user.name;
                      }
                      else
                      {
                         htmlinput += "Аноним";
                      }
                   }
                   else
                   {
                      htmlinput += "[Удалённый пользователь]";
                   }
                   htmlinput += "</p>";
                   htmlinput += "<div class=\"goods-cards__rating rating__group\">" +
                      "<fieldset>" +
                         "<input class=\"rating__input\" type=\"radio\" name=\"";
                         htmlinput += message.comment.id; 
                         htmlinput += "\" id=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-1\" value=\"1\" ";
                         if(message.comment.rating == 1)
                            htmlinput += "checked";
                         htmlinput += "><label class=\"rating__star\" for=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-1\" aria-label=\"Ужасно\"></label><input class=\"rating__input\" type=\"radio\" name=\"";
                         htmlinput += message.comment.id; 
                         htmlinput += "\" id=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-2\" value=\"2\" ";
                         if(message.comment.rating == 2)
                            htmlinput += "checked";
                         htmlinput += "><label class=\"rating__star\" for=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-2\" aria-label=\"Сносно\"></label><input class=\"rating__input\" type=\"radio\" name=\"";
                         htmlinput += message.comment.id; 
                         htmlinput += "\" id=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-3\" value=\"3\" ";
                         if(message.comment.rating == 3)
                            htmlinput += "checked";
                         htmlinput += "><label class=\"rating__star\" for=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-3\" aria-label=\"Нормально\"></label><input class=\"rating__input\" type=\"radio\" name=\"";
                         htmlinput += message.comment.id; 
                         htmlinput += "\" id=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-4\" value=\"4\" ";
                         if(message.comment.rating == 4)
                            htmlinput += "checked";
                         htmlinput += "><label class=\"rating__star\" for=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-4\" aria-label=\"Хорошо\"></label><input class=\"rating__input\" type=\"radio\" name=\"";
                         htmlinput += message.comment.id; 
                         htmlinput += "\" id=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-5\" value=\"5\" ";
                         if(message.comment.rating == 5)
                            htmlinput += "checked";
                         htmlinput += "><label class=\"rating__star\" for=\"";
                         htmlinput += message.comment.id;
                         htmlinput += "-5\" aria-label=\"Отлично\"></label>"+
                         "</fieldset><div class=\"rating__focus\"></div></div>";
                         htmlinput += "<p class=\"comment-date\">";
                htmlinput += getDateHelper(message.comment.commentDate);
                htmlinput += "</p></div><p class=\"comment__text\">";
                htmlinput += message.comment.message;
                htmlinput += "</p></div>";
                comments[0].innerHTML += htmlinput;
    }
 }