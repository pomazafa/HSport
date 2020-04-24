$("#addProduct").closest('form').on('submit', function(event) {
    if( !$("#pname").val() ) {
    	$("#error-message").html("Введите название товара");
		event.preventDefault();
    }
    else if( !$("#pprice").val() ) {
    	$("#error-message").html("Введите цену товара");
		event.preventDefault();
    }
});