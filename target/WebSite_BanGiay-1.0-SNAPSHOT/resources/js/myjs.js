$(document).ready(function () {


    $('.quantity-cart').change(function () {
        updateQuantity(this);
    });

    $('.closed').click(function () {
        removeItem(this);
    });

    /* Recalculate cart */
    function recalculateCart() {
        var subtotal = 0;

        /* Sum up row totals */
        $('.totals').each(function () {
            subtotal += parseFloat($(this).text().replace(/[đ\.]/g, ""));
        });
        $('.sub-totals').html(format_curency(subtotal.toString()) + "đ");
        $('.cart-totals').html(format_curency(subtotal.toString()) + "đ");

    }
    function format_curency(num) {
        num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return num;
    }
    /* Update quantity */
    function updateQuantity(quantityInput) {
        /* Calculate line price */
        var productRow = $(quantityInput).parent().parent().parent();
        var price = parseFloat(productRow.children().children().children().children('.price').text().replace(/[đ\.]/g, ""));
        var quantity = $(quantityInput).val();
        var linePrice = price * quantity;
        var cartModel = {
            productId: $(quantityInput).data('id'),
            quantity: quantity,
            sizeId: $(quantityInput).data('size')
        };
        debugger
        $.ajax({
            url: '/WebSite_BanGiay/cart/updateCartItem',
            type: 'POST',
            data: {cartModel: JSON.stringify(cartModel)},
            dataType: 'json',
            success: function (res) {
                debugger
                if (res.status === true) {
                    productRow.children().children().children().children('.totals').each(function () {
                        $(this).html(format_curency(linePrice.toString()) + "đ");
                        recalculateCart();
                        var cartElement = $('.cart-quantity-span');
                        var inputEle = $('.quantity-cart');
                        var quantity2 = 0;
                        for (let item of inputEle) {
                            quantity2 += parseInt(item.value)
                        }
                        for (let item of cartElement) {
                            item.innerHTML = quantity2;
                        }
                    });
                } else {
                    alert("Đã có lỗi xảy ra, không thể update lại giỏ hàng !!!");
                    window.location.href = "/WebSite_BanGiay/cart";
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                debugger
                // When AJAX call has failed
                console.log('AJAX call failed.');
                console.log(textStatus + ': ' + errorThrown);
            }

        });

        /* Update line price display and recalc cart totals */

    }


    /* Remove item from cart */
    function removeItem(removeButton) {
        /* Remove row from DOM and recalc cart total */
        let cartModel = {
            productId: removeButton.getAttribute('data-id'),
            sizeId: removeButton.getAttribute('data-size')
        }
        var productRow = $(removeButton).parent().parent().parent();
        $.ajax({
            url: '/WebSite_BanGiay/cart/deleteCartItem',
            type: 'POST',
            data: {cartModel: JSON.stringify(cartModel)},
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    productRow.slideUp(300, function () {
                        productRow.remove();
                        recalculateCart();
                        let cartElement = $('.cart-quantity-span');
                        let quantity = parseInt(cartElement[0].textContent);
                        quantity = quantity - res.quantity;
                        for (let item of cartElement) {
                            item.innerHTML = quantity;
                        }

                    });
                    alert("Đã xoá sản phẩm khỏi giỏ hàng !!!");
                    if (res.redirect === true) {
                        window.location.href = "/WebSite_BanGiay/home";
                    }
                } else {
                    alert("Đã có lỗi! Không thể xoá sản phẩm khỏi giỏ hàng !!!");
                }
            }
        });

    }


    $('.btn-number').click(function (e) {
        e.preventDefault();
        var fieldName = $(this).attr('data-field');
        var type = $(this).attr('data-type');
        var input = $("input[name='" + fieldName + "']");
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
            if (type === 'minus') {
                var minValue = parseInt(input.attr('min'));
                if (!minValue)
                    minValue = 1;
                if (currentVal > minValue) {
                    input.val(currentVal - 1).change();
                }
                if (parseInt(input.val()) === minValue) {
                    $(this).attr('disabled', true);
                }
            } else if (type === 'plus') {
                var maxValue = parseInt(input.attr('max'));
                if (!maxValue)
                    maxValue = 100;
                if (currentVal < maxValue) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) === maxValue) {
                    $(this).attr('disabled', true);
                }
            }
        } else {
            input.val(0);
        }
    });



//// thêm vào giỏ hàng ở trang index
//    $('.cart-hover').click(function (e) {
//        e.preventDefault();
//        var cartModel = {
//            productId: $(this).data('id'),
//            quantity: 1
//        }
//        ajaxAddItemToCart(JSON.stringify(cartModel));
//    });


//thêm giỏ hàng ở trang chi tiết
    $('.addcart').click(function (e) {
        e.preventDefault();
        debugger
        if (document.querySelector('.li-size-active') !== null) {
            if (parseInt($('#quantity').val()) <= parseInt($('li[class="li-size-active"]').attr('quantity'))) {
                $('#loader').addClass('loader');
                $('.icon-load').html('<i class="fas fa-spinner fa-spin fa-3x"></i>');
                var sizeId = parseFloat(document.querySelector('.li-size-active').getAttribute('data-id'));
                var cartModel = {
                    productId: $(this).data('id'),
                    quantity: parseInt($('#quantity').val()),
                    sizeId: sizeId
                };
                addCartAjax(cartModel).then((res) => {
                    if (res.status === true) {
                        debugger
                        let cartElement = document.querySelector('.cart-quantity-span');
                        let quantity = parseInt(cartElement.textContent);
                        quantity = quantity + res.quantity;
                        cartElement.innerHTML = quantity;
                        var elementInput = $('input[name="quantity"]');
                        if (elementInput !== undefined || elementInput !== null) {
                            elementInput.val(1);
                        }
                        var liList = $('.li-size, .li-size-active');
                        for (let item of liList) {
                            item.className = "li-size";
                        }
                        //alert("Đã thêm thành công vào giỏ hàng !!!");
                        $('#SuccessMD').modal('show');
                        setTimeout(function () {
                            $('#SuccessMD').modal('hide');
                        }, 3000);
                        $('.modal-backdrop').hide();
                        $('#loader').removeClass('loader');
                        $('.icon-load').html('');
                    } else {
                        alert("Không thể thêm sản phẩm vào giỏ hàng");
                        $('#loader').removeClass('loader');
                        $('.icon-load').html('');
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else {
                alert('Số lượng mua phải ít hơn số lượng còn trong kho!!!');
            }
        } else {
            alert("Bạn phải chọn size giày!!!");
        }
    });

    async function addCartAjax(cartModel) {
        let result;
        try {
            result = await $.ajax({
                url: '/WebSite_BanGiay/cart/addItemByAjax',
                data: {cartModel: JSON.stringify(cartModel)},
                dataType: 'json',
                type: 'POST'

            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    $('li[class="li-size"]').click(function (e) {
        e.preventDefault();
        var liList = $('.li-size, .li-size-active');
        for (let item of liList) {
            item.className = "li-size";
        }
        $(this).addClass("li-size-active").removeClass('li-size');
        if (parseInt($(this).attr('quantity')) > 0) {
            $('#size-quantity').text('Chỉ còn lại ' + $(this).attr('quantity') + ' trong kho');
        } else {
            $('#size-quantity').text('Hết hàng');
        }
        // $('#size-quantity').text('Chỉ còn lại ' +  $(this).attr('quantity') + 'trong kho');
    });

    $('#city').change(function (e) {
        e.preventDefault();
        let selected_id = $(this).val();
        $.ajax({
            url: '/WebSite_BanGiay/home/loadDataDistrict',
            type: 'POST',
            data: {city_ID: selected_id},
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    // $('#input_district').html('');
                    var data = JSON.parse(res.data);
                    var html = "<option value=\"\">Chọn Quận/Huyện</option>";
                    debugger
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            html += '<option value="' + data[key].code + '">' + data[key].name_with_type + '</option>';
                        }
                    }
                    $('#district').html(html);
                    //$('#input_ward').html('<option value="">Chọn Phường/Xã</option>');
                } else {
                    $('#district').html('<option value="">Chọn Quận/Huyện</option>');
                    $('#input_ward').html('<option value="">Chọn Phường/Xã</option>');
                }
            }
        });
    });
    $('#city').change(function (e) {
        e.preventDefault();
        let selected_id = $(this).val();
        $.ajax({
            url: '/WebSite_BanGiay/home/loadDataDistrict',
            type: 'POST',
            data: {city_ID: selected_id},
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    // $('#input_district').html('');
                    var data = JSON.parse(res.data);
                    var html = "<option value=\"\">Chọn Quận/Huyện</option>";
                    debugger
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            html += '<option value="' + data[key].code + '">' + data[key].name_with_type + '</option>';
                        }
                    }
                    $('#district').html(html);
                    $('#ward').html('<option value="">Chọn Phường/Xã</option>');
                } else {
                    $('#district').html('<option value="">Chọn Quận/Huyện</option>');
                    $('#ward').html('<option value="">Chọn Phường/Xã</option>');
                }
            }
        });
    });
    $('#district').change(function (e) {
        e.preventDefault();
        let selected_id = $(this).val();
        $.ajax({
            url: '/WebSite_BanGiay/home/loadDataWard',
            type: 'POST',
            data: {ward_ID: selected_id},
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    // $('#input_district').html('');
                    var data = JSON.parse(res.data);
                    var html = "<option value=\"\">Chọn Phường/Xã</option>";
                    debugger
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            html += '<option value="' + data[key].code + '">' + data[key].name_with_type + '</option>';
                        }
                    }
                    $('#ward').html(html);
                } else {
                    $('#ward').html('<option value="">Chọn Phường/Xã</option>');
                }
            }
        });
    });

    $('.page-change').click(function () {
        $('.pagePost').val($(this).val());
    });

});
  