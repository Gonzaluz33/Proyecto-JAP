const CATEGORIES_URL = "http://localhost:3000/cats";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell/publish";
const PRODUCTS_URL = "http://localhost:3000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments/";
const CART_INFO_URL = "http://localhost:3000/user_cart/";
const CART_BUY_URL = "http://localhost:3000/cart/buy";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    const token = localStorage.getItem('token');
    return fetch(url, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  
  if (!token) {
      // Si no hay token, redirigir al login
      window.location.href = 'login.html';
  } else {
      // Aquí podrías hacer una solicitud al servidor para validar el token
      validateToken(token);
  }

  nameUserInVar();
});

function validateToken(token) {
  fetch('http://localhost:3000/validate-token', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  })
  .then(response => {
      if (!response.ok) {
          // Si el token no es válido, manejar el caso (por ejemplo, redirigir al login)
          window.location.href = 'login.html';
      }
      // Si el token es válido, puedes continuar con la carga de la página
  })
  .catch(error => {
      console.error('Error al validar el token:', error);
      window.location.href = 'login.html';
  });
}


//MOSTRAR EL NOMBRE EN EL NAVBAR
function nameUserInVar(){
  let userName = JSON.parse(localStorage.getItem('cuenta'));
  const nameVarContainer = document.getElementById('userNameContainer');
  nameVarContainer.textContent = userName.usuario;
}

//CERRAR SESIÓN
function cerrarSesion(){
  localStorage.removeItem('cuenta');
  localStorage.removeItem('token'); 
  window.location.href = 'index.html';
}

//CAMBIAR DE TEMA CLARO A OSCURO 
function temaClaro() {
  document.querySelector("html").setAttribute("data-bs-theme", "light");
  document.querySelector("#dl-icon-dark").classList.remove("d-none");
  document.querySelector("#dl-icon-sun").classList.add("d-none");
  localStorage.setItem("theme-dark", false);
  let imgCover = document.getElementById('imgCover');
  imgCover.src = 'img/cover_back.png';

}

function temaOscuro() {
  document.querySelector("html").setAttribute("data-bs-theme", "dark");
  document.querySelector("#dl-icon-dark").classList.add("d-none");
  document.querySelector("#dl-icon-sun").classList.remove("d-none");
  localStorage.setItem("theme-dark", true);
  let imgCover = document.getElementById('imgCover');
  imgCover.src = 'img/cover-back-black.png';
 
}

function cambiarTema() {
  const tema = document.querySelector("html").getAttribute("data-bs-theme");
  if (tema === "light") {
    temaOscuro();
  } else {
    temaClaro();
  }
}

//EVALUA SI EL TEMA ES OSCURO O CLARO
if(localStorage.getItem("theme-dark") ==="true"){
  temaOscuro();
} 

// Ejemplo de JavaScript inicial para deshabilitar el envío de formularios si hay campos no válidos
(function () {
  'use strict'

  // Obtener todos los formularios a los que queremos aplicar estilos de validación de Bootstrap personalizados
  var forms = document.querySelectorAll('.needs-validation')

  // Bucle sobre ellos y evitar el envío
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()