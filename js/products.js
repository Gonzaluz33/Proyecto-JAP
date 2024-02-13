const IDcategorySelected = localStorage.getItem('catID');

//---------------------------------FETCH Y GUARDADO EN LOCAL STORAGE DE ARTICULOS--------------------------------
async function fetchProductsOfCategory(IDcat){
    const URL = PRODUCTS_URL + IDcat + '.json';
    try{
        const response = await fetch(URL);
        if(!response.ok){
            throw new Error ('Error al realizar fetch');
        }
        productsOfCategory = await response.json();
        productsOfCategoryString = JSON.stringify(productsOfCategory);
        localStorage.setItem('category', productsOfCategoryString);
        let category = JSON.parse(localStorage.getItem('category'));
        showProducts(category.products);
        nameCategory();
    } catch(error){
        console.error('Error: ', error);
    }
}

//------------------------------------FUNCION PARA MOSTRAR PRODUCTOS-----------------------------------------------
function showProducts(products){
    const productsContainer = document.getElementById('productsContainer');
    products.forEach(product => {
        //contenedor de cada producto
        let productContainer = document.createElement('div');
        productContainer.classList.add('row','mt-2','d-flex','align-items-center', 'rounded', 'shadow', 'p-2', 'cursor-active');

        productContainer.onclick = function(){
            localStorage.setItem('IDproduct', JSON.stringify(product.id));
            window.location.href ='product-info.html';
        }

        //contenedores: imagen, infoProducto, costo, infoVendidos
        let imageProductContainer = document.createElement('div'); 
        imageProductContainer.classList.add('col-12','col-md-5','m-0','p-0'); 

        let infoProductContainer = document.createElement('div');
        infoProductContainer.classList.add('col-12', 'col-md-7');

        productsContainer.appendChild(productContainer);

        //imagen
        let productImg = document.createElement('img');
        productImg.src = product.image;
        productImg.classList.add('w-100');
        imageProductContainer.appendChild(productImg);
       
        //costo producto
        let costProduct = document.createElement('p');
        costProduct.classList.add('fw-bold');
        costProduct.textContent = product.currency + '$ ' + product.cost;

        //nombre producto
        let productName = document.createElement('p');
        productName.textContent = product.name;
        productName.classList.add('fw-bold','h4');

        //descripción
        let productDescr = document.createElement('p');
        productDescr.textContent = product.description;

        //articulos vendidos
        let productSoldcount = document.createElement('p');
        productSoldcount.textContent = product.soldCount + ' artículos vendidos.';
        productSoldcount.classList.add('small')

        //nombre y descripcion agregado a contenedor info y contenedor producto
        productContainer.appendChild(imageProductContainer); 
        infoProductContainer.appendChild(productName);
        infoProductContainer.appendChild(costProduct);
        infoProductContainer.appendChild(productSoldcount);
        infoProductContainer.appendChild(productDescr);
        productContainer.appendChild(infoProductContainer); 

       
    });
}

document.addEventListener('DOMContentLoaded', function (e) {
    fetchProductsOfCategory(IDcategorySelected);
})

//-----------------------------------------BUSCADOR EN TIEMPO REAL--------------------------------------------

const inputSearch = document.getElementById('inputSearch');
const productsContainer = document.getElementById('productsContainer');
const category = JSON.parse(localStorage.getItem('category'));

function clearProductsContainer(){
    productsContainer.innerHTML = '';
}

//EVENTO PARA EL BUSCADOR EN TIEMPO REAL
inputSearch.addEventListener('input', function(){
    let searchTerm = inputSearch.value.trim().toLowerCase();

    if(!searchTerm){
        clearProductsContainer();
        showProducts(category.products);
    }else {
        let category = JSON.parse(localStorage.getItem('category'));
        const filteredProducts = category.products.filter(product=> {
            return product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        });        
        if(filteredProducts.length<1){
            clearProductsContainer();
            let noResults = document.createElement('div');
            noResults.classList.add('d-flex', 'justify-content-center', 'align-content-center', 'mt-5')
            let noResultsMessage = document.createElement('p');
            noResultsMessage.classList.add('h1','text-center')
            noResultsMessage.textContent = 'No se encontraron resultados';
            noResults.appendChild(noResultsMessage);
            productsContainer.appendChild(noResults);   
        } else {
            clearProductsContainer();
            showProducts(filteredProducts);
        }
        
    }

});

//--------------------------------------------FILTROS-----------------------------------------------------------

const inputFilters = document.getElementById('inputFilters');

inputFilters.addEventListener('change',function(){
    let category = JSON.parse(localStorage.getItem('category'));
    if(inputFilters.value==='0'){
        clearProductsContainer();
        showProducts(category.products);
    } else if(inputFilters.value === '1'){ //Filtro mas relevantes
        clearProductsContainer();
        let productos = category.products;
        let productsSortDescending = productos.slice().sort(function (a, b) {
            return b.soldCount - a.soldCount;
        });
        showProducts(productsSortDescending);
    } else if (inputFilters.value=== '2'){ //Filtro menor costo
        clearProductsContainer();
        let productos = category.products;
        let productsSortMinorCost = productos.slice().sort(function (a, b) {
            return a.cost - b.cost;
        });
        showProducts(productsSortMinorCost);
    } else if (inputFilters.value === '3'){//Filtro mayor costo
        clearProductsContainer();
        let productos = category.products;
        let productsSortMaxCost = productos.slice().sort(function (a, b) {
            return b.cost - a.cost;
        });
        showProducts(productsSortMaxCost);    
    }
})

//---------------------------------------USERNAME EN ESQUINA SUPERIOR DERECHA---------------------------------------
function nameCategory(){
    const category = JSON.parse(localStorage.getItem('category'));
    const categoryNameDiv = document.getElementById('categoryNameDiv');
    categoryNameDiv.textContent = category.catName.toLowerCase();
}

nameCategory();

//------------------------------------------FILTROS MINIMO Y MAXIMO ------------------------------------------------
const inputMinFilter = document.getElementById('inputMinFilter');
const inputMaxFilter = document.getElementById('inputMaxFilter');
const filterBtn = document.getElementById('filterBtn');

filterBtn.addEventListener('click',function(){
    const minCost = parseFloat(inputMinFilter.value);
    const maxCost = parseFloat(inputMaxFilter.value);
    const filteredProducts = category.products.filter(product =>{
        let productPrice = parseFloat(product.cost);
        return (!isNaN(minCost) ? productPrice >= minCost : true) &&
               (!isNaN(maxCost) ? productPrice <= maxCost : true);
    })
    clearProductsContainer();
    showProducts(filteredProducts);
})

function cleanFilters(){
    clearProductsContainer();
    inputMaxFilter.value = '';
    inputMinFilter.value = '';
    inputFilters.value = 0;
    showProducts(category.products);
}

