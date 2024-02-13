const formLogin = document.querySelector('#formLogin')
const btnIngresar = document.querySelector('#btnIngresar');
const inputUser = document.querySelector('#inputUser');
const inputPassword = document.querySelector('#inputPassword');
    
//EVENTO AL FORMULARIO DEL LOGIN / GUARDA EL USUARIO EN LOCALSTORAGE
formLogin.addEventListener('submit', async function(e){
    e.preventDefault();

    let usuario = inputUser.value;
    let contraseña = inputPassword.value;

    if(!usuario || !contraseña){
        alert('Debes ingresar tu usuario y tu contraseña');
    } else {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usuario, password: contraseña })
            });

            if(response.ok) {
                const data = await response.json();
                // Almacenar el token en localStorage
                localStorage.setItem('cuenta', usuario);
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return false;
});

    //INICIALIZA LOS COMENTARIOS
    let coments = '';
    localStorage.setItem('coments', JSON.stringify(coments));

    //OBTIENE EL CARRITO POR DEFECTO Y LO GUARDA EN EL LOCALSTORAGE O PUSHEA AL MISMO
    linkCartData = 'https://japceibal.github.io/emercado-api/user_cart/';
    let user = '25801';
    async function fetchCart() {
        const URL = linkCartData + user + '.json';
        try {
            const response = await fetch(URL);
    
            if (!response.ok) {
                throw new Error('Error al realizar fetch');
            }
    
            const data = await response.json();
            let newArticle = data.articles[0];
    
            let cart = localStorage.getItem('cart') || '[]';
            let cartJSON = JSON.parse(cart);
    
            // Verificar si el artículo ya existe en el carrito
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
            console.log(cartJSON);
        } catch (error) {
            console.error('Error: ', error);
        }
    }
    

    fetchCart();