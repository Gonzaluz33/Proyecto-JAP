let cart = localStorage.getItem('cart');
let cartJSON = JSON.parse(cart);
let cartArray = cartJSON[0]

let articlesContainer = document.getElementById('articlesContainer');

//FUNCION PARA MOSTRAR TODOS LOS ARTICULOS DEL CARRITO
function showCartArticles(cart) {

    cart.forEach(article => {
        //CREACIÓN DE ELEMENTOS PARA PANTALLAS PEQUEÑAS
        const row = document.createElement('div');
        row.classList.add('row', 'd-sm-none');

        // IMAGEN
        const colImage = document.createElement('div');
        colImage.classList.add('col-5', 'd-flex', 'p-0', 'm-0', 'align-content-center');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('container', 'p-2', 'm-0');
        const img = document.createElement('img');
        img.classList.add('w-100', 'p-0', 'm-0');
        img.src = article.image;
        img.alt = '';
        imgContainer.appendChild(img);
        colImage.appendChild(imgContainer);

        // CONTAINER DE INFORMACIÓN
        const colInfo = document.createElement('div');
        colInfo.classList.add('col-7', 'p-2');

        //NOMBRE DEL ARTICULO
        const rowName = document.createElement('div');
        rowName.classList.add('row', 'mb-1');
        const nameParagraph = document.createElement('p');
        nameParagraph.classList.add('m-0', 'p-0', 'fw-bold', 'h5', 'text-truncate');
        nameParagraph.textContent = article.name;
        rowName.appendChild(nameParagraph);

        // BOTON ELIMINAR Y GUARDAR
        const rowActions = document.createElement('div');
        rowActions.classList.add('row', 'd-flex');
        const colDelete = document.createElement('div');
        colDelete.classList.add('col-4', 'p-0', 'm-0');
        colDelete.textContent = 'Eliminar';
        colDelete.onclick = function () {
            const index = cartJSON.indexOf(article);
            cartJSON.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartJSON));
            window.location.reload();
        };
        const colSave = document.createElement('div');
        colSave.classList.add('col-4', 'p-0', 'm-0');
        colSave.textContent = 'Guardar';
        rowActions.appendChild(colDelete);
        rowActions.appendChild(colSave);

        // COSTO UNIDAD
        const rowCost = document.createElement('div');
        rowCost.classList.add('row', 'mb-1');
        const costParagraph = document.createElement('p');
        costParagraph.classList.add('small', 'p-0', 'm-0', 'text-muted');
        costParagraph.textContent = article.currency + '$' + article.unitCost + ' c/u';
        rowCost.appendChild(costParagraph);

        // CONTENEDOR DE CANTIDAD
        const rowQuantity = document.createElement('div');
        rowQuantity.classList.add('row');

        // BOTON DE RESTAR CANTIDAD
        const btnMinus = document.createElement('button');
        btnMinus.classList.add('btn', 'col-1', 'text-center', 'p-0', 'm-0');
        btnMinus.textContent = '-';
        btnMinus.onclick = function () {
            if (article.count > 1) {
                article.count--;
                inputQuantity.value = article.count;
                localStorage.setItem('cart', JSON.stringify(cartJSON));
                subtotalParagraph.textContent = article.currency + '$' + article.unitCost * article.count;
                actualizarSubtotales();
            } else {
                article.count = 1;
                inputQuantity.value = article.count;
                localStorage.setItem('cart', JSON.stringify(cartJSON));
                subtotalParagraph.textContent = article.currency + '$' + article.unitCost * article.count;
                actualizarSubtotales();
            }

        }

        //INPUT DE CANTIDAD
        const colInput = document.createElement('div');
        colInput.classList.add('col-2', 'd-flex', 'align-items-center', 'p-0', 'm-0');
        const inputQuantity = document.createElement('input');
        inputQuantity.type = 'number';
        inputQuantity.value = article.count;
        inputQuantity.min = '1';
        inputQuantity.step = '1';
        inputQuantity.oninput = function () {
            if(inputQuantity.value < 1){
                inputQuantity.value = 1;
            }
            article.count = inputQuantity.value;
            localStorage.setItem('cart', JSON.stringify(cartJSON));
            subtotalParagraph.textContent = article.currency + '$' + article.unitCost * article.count;
            actualizarSubtotales();
        }

        inputQuantity.name = 'inputQuantity';
        inputQuantity.id = 'inputQuantity' + article.id;
        inputQuantity.classList.add('w-100', 'form-control', 'text-center', 'p-0', 'm-0');

        // BOTON DE SUMAR CANTIDAD
        const btnPlus = document.createElement('button');
        btnPlus.classList.add('btn', 'col-1', 'text-center', 'p-0', 'm-0');
        btnPlus.textContent = '+';
        btnPlus.onclick = function () {
            article.count++;
            inputQuantity.value = article.count;
            localStorage.setItem('cart', JSON.stringify(cartJSON));
            subtotalParagraph.textContent = article.currency + '$' + article.unitCost * article.count;
            actualizarSubtotales();
        }

        // SUBTOTAL
        const colSubtotal = document.createElement('div');
        colSubtotal.classList.add('col-8', 'py-1', 'h4', 'm-0', 'd-flex', 'justify-content-end');
        const subtotalParagraph = document.createElement('p');
        subtotalParagraph.classList.add('m-0', 'p-0');

        // Agrega las columnas a la fila
        rowQuantity.appendChild(btnMinus);
        rowQuantity.appendChild(colInput);
        colInput.appendChild(inputQuantity);
        rowQuantity.appendChild(btnPlus);
        rowQuantity.appendChild(colSubtotal);
        colSubtotal.appendChild(subtotalParagraph);

        // Agrega las columnas a la columna de información
        colInfo.appendChild(rowName);
        colInfo.appendChild(rowActions);
        colInfo.appendChild(rowCost);
        colInfo.appendChild(rowQuantity);

        // Agrega las columnas a la fila
        row.appendChild(colImage);
        row.appendChild(colInfo);

        articlesContainer.appendChild(row);

        //FUNCION PARA OBTENER EL SUBTOTAL DE CADA ARTICULO
        function costSubtotal() {
            let subtotal = article.unitCost * article.count;
            return subtotal;
        }

        subtotalParagraph.textContent = article.currency + '$' + costSubtotal();


        //PANTALLAS GRANDES----------------------------------------------------------------------------------------------------------

        //container general
        let container = document.createElement('div');
        container.classList.add('row', 'd-none', 'd-sm-flex');
        articlesContainer.appendChild(container);

        //container imagen // imagen
        let containerImg1 = document.createElement('div');
        containerImg1.classList.add('col-2', 'col-sm-2', 'border', 'border-warning', 'p-3', 'p-sm-0', 'd-flex', 'align-items-center');
        let containerImg = document.createElement('div');
        containerImg.classList.add('container')
        let img2 = document.createElement('img');
        img2.src = article.image;
        img2.classList.add('w-100');
        containerImg.appendChild(img2);
        containerImg1.appendChild(containerImg);
        container.appendChild(containerImg1);

        //nombre
        let containerName = document.createElement('div');
        containerName.classList.add('col-2', 'border', 'border-warning', 'py-3', 'd-sm-flex', 'justify-content-center');
        let name = document.createElement('p');
        name.classList.add('m-0', 'p-0', 'text-center');
        name.textContent = article.name;
        containerName.appendChild(name);
        container.appendChild(containerName);

        //precio
        let containerPrice = document.createElement('div');
        containerPrice.classList.add('col-2', 'col-sm-2', 'border', 'border-warning', 'py-3', 'd-sm-flex', 'justify-content-center', 'text-truncate');
        containerPrice.textContent = article.currency + '$' + article.unitCost;
        container.appendChild(containerPrice);

        //cantidad
        let containerCount = document.createElement('div');
        containerCount.classList.add('col-2', 'border', 'border-warning', 'py-3');
        container.appendChild(containerCount);
        let rowCount = document.createElement('div');
        rowCount.classList.add('row');
        containerCount.appendChild(rowCount);

        //btn restar producto
        let colPrueba1 = document.createElement('div');
        colPrueba1.classList.add('col-4', 'm-0', 'p-0');
        rowCount.appendChild(colPrueba1);
        let buttonMinus2 = document.createElement('button');
        buttonMinus2.classList.add('btn', 'w-100', 'text-center', 'p-0', 'm-0');
        buttonMinus2.textContent = '-';
        buttonMinus2.onclick = function () {
            if (article.count > 1) {
                article.count--;
                inputCount2.value = article.count;
                localStorage.setItem('cart', JSON.stringify(cartJSON));
                subtotal2.textContent = article.currency + '$' + article.unitCost * article.count;
                actualizarSubtotales();
            }
        }
        colPrueba1.appendChild(buttonMinus2);

        //input cantidad
        let colPrueba2 = document.createElement('div');
        colPrueba2.classList.add('col-4', 'm-0', 'p-0');
        rowCount.appendChild(colPrueba2);
        let inputCount2 = document.createElement('input');
        inputCount2.classList.add('w-100', 'text-center', 'p-0', 'm-0', 'form-control');
        inputCount2.value = article.count;
        inputCount2.type = 'number';
        inputCount2.min = '1';
        inputCount2.name = 'inputCount2';
        inputCount2.id = 'inputCount2' + article.id;
        inputCount2.oninput = function () {
            if(inputCount2.value < 1){
                inputCount2.value = 1;
            }
            article.count = inputCount2.value;
            localStorage.setItem('cart', JSON.stringify(cartJSON));
            subtotal2.textContent = article.currency + '$' + article.unitCost * article.count;
            actualizarSubtotales();
        }
        colPrueba2.appendChild(inputCount2);

        //BOTON PARA SUMAR CANTIDAD
        let colPrueba3 = document.createElement('div');
        colPrueba3.classList.add('col-4', 'm-0', 'p-0');
        rowCount.appendChild(colPrueba3);
        let buttonPlus2 = document.createElement('button');
        buttonPlus2.classList.add('btn', 'w-100', 'text-center', 'p-0', 'm-0');
        buttonPlus2.textContent = '+';
        buttonPlus2.onclick = function () {

            article.count++;
            inputCount2.value = article.count;
            localStorage.setItem('cart', JSON.stringify(cartJSON));
            subtotal2.textContent = article.currency + '$' + article.unitCost * article.count;
            actualizarSubtotales();

        }
        colPrueba3.appendChild(buttonPlus2);

        //SUBTOTAL
        let subtotal2 = document.createElement('div');
        subtotal2.classList.add('col-2', 'col-sm-3', 'border', 'border-warning', 'py-3', 'text-center');
        subtotal2.textContent = article.currency + '$' + costSubtotal();
        container.appendChild(subtotal2);

        let deleteArticle = document.createElement('div');
        deleteArticle.classList.add('col-1', 'border', 'border-warning', 'py-3', 'text-center');
        deleteArticle.innerHTML = '<i class="bi bi-trash3-fill text-danger"></i>';
        container.appendChild(deleteArticle);
        deleteArticle.onclick = function () {
            const index = cartJSON.indexOf(article);
            cartJSON.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartJSON));
            window.location.reload();
        }
    });

}

//EVENTO AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', function () {
    showCartArticles(cartJSON);
    actualizarSubtotales();
})

//FUNCIONES DE COSTO DE ENVIO
let radioEnvioPremium = document.getElementById('radioEnvioPremium');
let radioEnvioExpress = document.getElementById('radioEnvioExpress');
let radioEnvioStandard = document.getElementById('radioEnvioStandard');
let subtotalEnvioContainer = document.getElementById('subtotalEnvioContainer');
let totalCompraContainer = document.getElementById('totalCompraContainer');

//FUNCION DE ACTUALIZAR SUBTOTALES DE COSTO COSTO PRODUCTOS, ENVIO Y TOTAL
function actualizarSubtotales() {
    let articles = JSON.parse(localStorage.getItem('cart'));

    let costoTotalCompra = 0; // Inicializa el costo total en 0

    articles.forEach(element => {
        let costoUnidad = element.unitCost;
        let cantidad = element.count;
        let costoFinal = costoUnidad * cantidad;
        let currency = element.currency;
        if (currency === 'UYU') {
            costoFinal = Math.round(costoFinal / 40);
        }
        costoTotalCompra += costoFinal;
    })

    //Toma el container y agrega el valor del costoTotalCompra
    const totalProductsContainer = document.getElementById('totalProductsContainer');
    totalProductsContainer.textContent = 'USD$  ' + costoTotalCompra;

    //EVALUA CADA RADIO Y AGREGA EL ENVIO CORRESPONDIENTE
    if (radioEnvioPremium.checked) {
        let costoEnvio = costoTotalCompra * 0.15;
        subtotalEnvioContainer.textContent = 'USD$  ' + costoEnvio.toFixed(0);
        let totalCompraYenvio = costoEnvio + costoTotalCompra;
        totalCompraContainer.textContent = 'USD$  ' + totalCompraYenvio.toFixed(0);
    } else if (radioEnvioExpress.checked) {
        let costoEnvio = costoTotalCompra * 0.07;
        subtotalEnvioContainer.textContent = 'USD$  ' + costoEnvio.toFixed(0);
        let totalCompraYenvio = costoEnvio + costoTotalCompra;
        totalCompraContainer.textContent = 'USD$ ' + totalCompraYenvio.toFixed(0);
    } else if (radioEnvioStandard.checked) {
        let costoEnvio = costoTotalCompra * 0.05;
        subtotalEnvioContainer.textContent = 'USD$  ' + costoEnvio.toFixed(0);
        let totalCompraYenvio = costoEnvio + costoTotalCompra;
        totalCompraContainer.textContent = 'USD$  ' + totalCompraYenvio.toFixed(0);
    } else {
        formCompra.checkValidity();
    }
}

//FUNCION DE ACTUALIZAR SUBTOTALES DE COSTO COSTO PRODUCTOS, ENVIO Y TOTAL
const elementosTipoEnvio = document.querySelectorAll('[name="tipoEnvio"]');
elementosTipoEnvio.forEach(elemento => {
    elemento.addEventListener('change', (event) => {
        actualizarSubtotales();
    });
});

let modalForm = document.getElementById("modalForm");
let formCompra = document.getElementById("formCompra");
let modalBtn = document.getElementById("modalBtn");
let radioTransferencia = document.getElementById("radioTransferencia");
let radioTarjeta = document.getElementById("radioTarjeta");
const tarjetaInputs = document.querySelectorAll("#inputNumeroTarjeta, #inputCVC, #inputFechaVencimiento");
const transferenciaInputs = document.getElementById("inputNumeroBanco");


// EVENTOS PARA PARA LA SELECCION DE METODO DE PAGO
radioTarjeta.addEventListener("change", function () {
    if (radioTarjeta.checked) {
        // Si se selecciona tarjeta, habilita los campos de tarjeta y deshabilita el campo de cuenta de transferencia
        tarjetaInputs.forEach(input => {
            input.removeAttribute("disabled");
            input.setAttribute("required", "required");
        });
        transferenciaInputs.setAttribute("disabled", "disabled");
        transferenciaInputs.removeAttribute("required");
    }
});

radioTransferencia.addEventListener("change", function () {
    if (radioTransferencia.checked) {
        // Si se selecciona transferencia, habilita el campo de cuenta de transferencia y deshabilita los campos de tarjeta
        tarjetaInputs.forEach(input => {
            input.setAttribute("disabled", "disabled");
            input.removeAttribute("required");
        });
        transferenciaInputs.removeAttribute("disabled");
        transferenciaInputs.setAttribute("required", "required");
    }
});


//EVENTO PARA EL FORMULARIO DEL MODAL
modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (modalForm.checkValidity()) {
        modalBtn.setAttribute('data-bs-dismiss', 'modal');
        modalBtn.click();
        let labelMetodo = document.getElementById("labelMetodo");
        let inputMetodo = document.getElementById("inputMetodo");

        if (radioTarjeta.checked) {
            labelMetodo.innerHTML = "Tarjeta";
            inputMetodo.checked = true;
            inputMetodo.classList.remove("d-none");
        } else if (radioTransferencia.checked) {
            labelMetodo.innerHTML = "Transferencia";
            inputMetodo.checked = true;
            inputMetodo.classList.remove("d-none");
        }
    }
})


//EVENTO AL ENVIAR EL FORMULARIO DE COMPRA
formCompra.addEventListener('submit', (e) => {
    e.preventDefault();
    // Restablecer el formulario
    if(formCompra.checkValidity() && cartJSON.length > 0) {
        formCompra.reset();
        let cart = localStorage.getItem('cart');
        let cartJSON = JSON.parse(cart);
        cartJSON.length = 0;
        localStorage.setItem('cart', JSON.stringify(cartJSON));
        showCartArticles(cartJSON);
        let alertCompraFinalizada = document.getElementById('alertCompraFinalizada');
        alertCompraFinalizada.className = 'alert alert-success position-fixed z-2';
        e.preventDefault();
        // Espera 5 segundos antes de enviar el formulario
        setTimeout(function() {
            formCompra.submit(); // Envía el formulario
            window.location.href = 'index.html';
        }, 2000); // 5000 milisegundos equivalen a 5 segundos
    }
});


// JS PARA VALIDACIÓN
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()
