/*  ------------------------FETCH A INFO DEL PRODUCTO Y GUARDADO EN LS Y MOSTRAR------------------------ */
let IDproduct = localStorage.getItem('IDproduct');
let linkProductData = 'https://japceibal.github.io/emercado-api/products/';
let linkComentsData = 'https://japceibal.github.io/emercado-api/products_comments/';

//FETCH A INFO DEL  PRODUCTO SELECCIONADO
async function fetchProductInfo() {
    const URL = linkProductData + IDproduct + '.json';
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Error al realizar fetch');
        }
        data = await response.json();
        let infoProductStr = JSON.stringify(data);
        localStorage.setItem('infoProduct', infoProductStr);
        let infoProduct = localStorage.getItem('infoProduct');
        let infoProductJSON = JSON.parse(infoProduct);
        showInfoProduct(infoProductJSON);
        showRelatedProducts();
    } catch (error) {
        console.error('Error: ', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchProductInfo();
    fetchProductComents();
    filteredComents(IDproduct);
})

/* -------------------------------------MOSTRAR INFO DEL PRODUCTO------------------------------------- */

function showInfoProduct(product) {
    let firstProductImage = document.getElementById('firstProductImage');
    let secondProductImage = document.getElementById('secondProductImage');
    let thirdProductImage = document.getElementById('thirdProductImage');
    let fourthProductImage = document.getElementById('fourthProductImage');
    let productNameDiv = document.getElementById('productNameDiv');
    let productCostDiv = document.getElementById('productCostDiv');
    let productInfoDiv = document.getElementById('productInfoDiv');
    let productCatDiv = document.getElementById('productCatDiv');
    let productSoldCountDiv = document.getElementById('productSoldCountDiv');


    firstProductImage.src = product.images[0];
    secondProductImage.src = product.images[1];
    thirdProductImage.src = product.images[2];
    fourthProductImage.src = product.images[3];
    productNameDiv.textContent = product.name;
    productNameDiv.classList.add('text-center', 'text-md-start');
    productCostDiv.textContent = product.currency + '$ ' + product.cost;
    productInfoDiv.textContent = product.description;
    productCatDiv.textContent = 'Categoría: ' + product.category;
    productSoldCountDiv.textContent = product.soldCount + ' Articulos vendidos.'

}

/* -------------------------------FETCH A INFO DE COMENTARIOS Y GUARDADO EN LS Y MOSTRAR---.--------------- */

async function fetchProductComents() {
    const URL = linkComentsData + IDproduct + '.json';
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Error al realizar fetch');
        }
        data = await response.json();
        localStorage.setItem('defaultComents', JSON.stringify(data));

    } catch (error) {
        console.error('Error: ', error);
    }
}

/* -------------------------------------MOSTRAR COMENTARIOS------------------------------------------------ */
let defaultComentsDiv = document.getElementById('defaultComentsDiv');

function showComents(coments) {
    defaultComentsDiv.innerHTML += '';
    coments.forEach(coment => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < coment.score) {
                // Estrella llena (amarilla) para puntuaciones alcanzadas
                stars += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFC400" stroke="black" stroke-width="1" style="margin-right: 2px;" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>`;
            } else {
                // Estrella vacía (negra) para puntuaciones no alcanzadas
                stars += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#212529" stroke="black" stroke-width="1" style="margin-right: 2px;" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>`};

        }

                let comentDiv = document.createElement('div');
                comentDiv.classList.add('row', 'd-flex', 'align-content-center', 'border', 'p-2', 'm-0');
                defaultComentsDiv.appendChild(comentDiv);

                //Estrellas de los comentarios
                let comentStars = document.createElement('div');
                comentStars.classList.add('col-4', 'col-md-3', 'col-lg-2', 'p-0', 'm-0');
                let p = document.createElement('p');
                p.classList.add('p-0', 'm-0', 'text-center');
                p.innerHTML = stars;
                comentStars.appendChild(p);
                comentDiv.appendChild(comentStars);

                //Contenedor de nombre, fecha y comentario
                let comentInfo = document.createElement('div');
                comentInfo.classList.add('col-8', 'col-md-9', 'col-lg-10', 'p-0', 'm-0');
                comentDiv.appendChild(comentInfo);

                //Nombre 
                let comentName = document.createElement('small');
                comentName.textContent = coment.user + ' | ';
                comentInfo.appendChild(comentName);

                //Fecha
                let comentDate = document.createElement('small');
                comentDate.classList.add('text-muted');
                comentDate.textContent = coment.dateTime + ' - ';
                comentInfo.appendChild(comentDate);

                //Comentario
                let comentText = document.createElement('small');
                comentText.textContent = coment.description;
                comentInfo.appendChild(comentText);

            });
}

showComents(JSON.parse(localStorage.getItem('defaultComents')));

/* -----------------------------FILTRAR COMENTARIOS POR PRODUCTO Y MOSTRARLOS ----------------------------- */

function filteredComents(IDproduct){
    let coments = localStorage.getItem('coments');
    let commentsJSON = JSON.parse(coments);
    let filteredComents = commentsJSON.filter(coment => coment.product === IDproduct);
    showComents(filteredComents);
}


/*-------------------------------------- CREAR COMENTARIOS ------------------------------------------------*/
let newComentForm = document.getElementById('newComentForm');

newComentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    newComent();
    window.location.reload();
});

//AGREGAR UN NUEVO COMENTARIO
function newComent() {
    let description = document.getElementById('inputComent').value;
    let score = document.getElementById('inputScore').value;
    let cuenta = JSON.parse(localStorage.getItem('cuenta'));
    let user = cuenta.usuario;
    let dateTime = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

    let newComent = {
        'product': IDproduct,
        'score': score,
        'description': description,
        'user': user,
        'dateTime': dateTime
    };

    let coments = JSON.parse(localStorage.getItem('coments')) || [];
    coments.push(newComent);
    localStorage.setItem('coments', JSON.stringify(coments));
    document.getElementById('inputComent').value = '';
}

//-------------------------MOSTRAR PRODUCTOS RELACIONADOS----------------------------------------------

let relatedProductsDiv = document.getElementById('relatedProductsDiv');

function showRelatedProducts() {
    let infoProductLS = localStorage.getItem('infoProduct');
    let infoProduct = JSON.parse(infoProductLS);
    let relatedProducts=infoProduct.relatedProducts;


    relatedProducts.forEach(product => {

        //Crear row contenedor
        let row = document.createElement('div');
        row.classList.add('row', 'd-flex', 'justify-content-center');

        //Contenedor imagen
        let containerProduct = document.createElement('div');
        containerProduct.classList.add('col-10', 'm-0', 'border', 'p-2');
        containerProduct.id='imgContainer';
        containerProduct.onclick = function (){
            localStorage.setItem('IDproduct', JSON.stringify(product.id));
            window.location.href = 'product-info.html';
        }
        row.appendChild(containerProduct);

        //Imagen
        let img = document.createElement('img');
        img.src = product.image;
        img.classList.add('w-100');
        containerProduct.appendChild(img);

        //Nombre
        let name = document.createElement('p');
        name.textContent = product.name;
        name.classList.add('text-center');
        containerProduct.appendChild(name);

        relatedProductsDiv.appendChild(row);

    })
    
}

//FUNCION AGREGAR AL CARRITO
function addToCart(){
    let IDproduct = localStorage.getItem('IDproduct');
    console.log(IDproduct);

    let cartStr = localStorage.getItem('cart');
    let cartJSON = JSON.parse(cartStr);

    let infoProduct = JSON.parse(localStorage.getItem('infoProduct'));

    let newArticle = {
        'id': infoProduct.id,
        'name': infoProduct.name,
        'count': 1,
        'unitCost': infoProduct.cost,
        'currency': infoProduct.currency,
        'image': infoProduct.images[0]
    }
    
    const existingArticle = cartJSON.find(article => article.id === newArticle.id);

    if (existingArticle) {
        // Si el artículo ya existe, aumenta el contador
        existingArticle.count += 1;
    } else {
        // Si el artículo no existe, agrégalo al carrito con un contador de 1
        newArticle.count = 1;
        cartJSON.push(newArticle);
    }

    // Guarda el valor actualizado en el localStorage
    localStorage.setItem('cart', JSON.stringify(cartJSON));

}