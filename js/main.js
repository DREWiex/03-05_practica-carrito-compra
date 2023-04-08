//TODO: Práctica carrito de compra

document.addEventListener('DOMContentLoaded', () => {


    //*** VARIABLES ***//

    const fragment = document.createDocumentFragment();

    const arrayProductosSeleccionados = JSON.parse(localStorage.getItem('productos')) || [];

    const arrayEstrellas = ['assets/star1.png', 'assets/star2.png'];

    const urlProducts = 'https://dummyjson.com/products';
    const urlCategories = 'https://dummyjson.com/products/categories';


    //* Capturas *//
    const divCards = document.querySelector('#pintar-cards');
    const tablaCarrito = document.querySelector('#tabla-carrito');
    const pintarTablaCarrito = document.querySelector('#pintar-tabla-carrito');
    const totalFinalizarCompra = document.querySelector('#total-finalizar-compra');
    const selectCategorias = document.querySelector('#select-categories');



    //*** EVENTOS ***//

    document.addEventListener('click', ({target}) => {

        if(target.matches('#comprar')){
            location.href = 'finalizar-compra.html';
        };

        if(target.matches('#volver')){
            location.href = 'index.html';
        };

        if(target.matches('#icon-carrito')){
            tablaCarrito.classList.toggle('hidden');
        };

        if(target.matches('#card-btn')){
            const id = target.dataset.id;
            almacenarDatos(id);
        };

        if(target.matches('#sumar-producto')){
            const id = target.dataset.id;
            almacenarDatos(id);
        };

        if(target.matches('#restar-producto')){
            const id = target.dataset.id;
            restarProducto(id);
        };

        if(target.matches('#eliminar-producto')){
            const id = target.dataset.id;
            eliminarProducto(id);
        };

        if(target.matches('#btn-vaciar-carrito')){
            localStorage.removeItem('productos');
            location.reload();
        };

        if(target.matches('#btn-finalizar-compra')){
            alert('¡Has finalizado tu compra satisfactoriamente!');
            localStorage.removeItem('productos');
            location.reload();
        };

    });



    //*** FUNCIONES ***//

    const fetchingData = async (url) => {

        try {

            const request = await fetch(url);

            if(request.ok){
                
                const response = await request.json();

                return{
                    ok: true,
                    response
                };

            }else{

                throw('ERROR: Fetch');
            
            };
            
        } catch (error) {

            return {
                ok: false,
                error
            };

        };

    }; //!FUNC-FETCHINGDATA


    const pintarCards = async () => {

        const { response } = await fetchingData(urlProducts);

        const { products } = response;
            
            products.forEach((item) => {

                const elementArticle = document.createElement('ARTICLE');
                elementArticle.classList.add('grid-item-cards');

                const elementImg = document.createElement('IMG');
                elementImg.src = item.images[0];

                const elementHeader = document.createElement('H3');
                elementHeader.innerHTML = item.title;

                const elementP = document.createElement('P');
                elementP.innerHTML = `Precio: ${item.price.toLocaleString('de-DE')} €`;

                let imgEstrellas = pintarEstrellas(item.rating);

                const elementButton = document.createElement('BUTTON');
                elementButton.id = 'card-btn';
                elementButton.dataset['id'] = item.id;
                elementButton.textContent = "Añadir al carrito";

                elementArticle.append(elementImg, elementHeader, elementP, imgEstrellas, elementButton);

                fragment.append(elementArticle);

            });

        divCards.append(fragment);

    }; //!FUNC-PINTARCARDS


    const pintarEstrellas = (rating) => {

        let divRating = document.createElement('DIV');

        let totalEstrellasAmarillas = Math.round(rating);

        let totalEstrellasGrises = 5 - totalEstrellasAmarillas;


        for(let i = 0; i < totalEstrellasAmarillas; i++){
            let estrellasAmarillas = document.createElement('IMG');
            estrellasAmarillas.src = arrayEstrellas[0];
            divRating.append(estrellasAmarillas);
        }

        for(let i = 0; i < totalEstrellasGrises; i++){
            let estrellasGrises = document.createElement('IMG');
            estrellasGrises.src = arrayEstrellas[1];
            divRating.append(estrellasGrises);
        }

        return divRating;

    }; //!FUNC-PINTARESTRELLAS


    const pintarCategorias = async () => {

        const { response } = await fetchingData(urlCategories);

        selectCategorias.innerHTML = '';

        response.forEach(item => {

            const optCategory = document.createElement('OPTION');
            optCategory.value = item;
            optCategory.textContent = item;

            fragment.append(optCategory);

        });

        const optEmpty = document.createElement('OPTION');
        optEmpty.textContent = '-- Elige una categoría --'

        selectCategorias.append(optEmpty, fragment);

    }; //!FUNC-PINTARCATEGORIAS


    const setLocal = () => {

        localStorage.setItem('productos', JSON.stringify(arrayProductosSeleccionados));

    }; //!FUNC-SETLOCAL


    const almacenarDatos = async (id) => {

        const { response } = await fetchingData(urlProducts);

        const { products } = response;

        const index = arrayProductosSeleccionados.findIndex((item) => item.id == id);

        if(index != -1){

            const producto = arrayProductosSeleccionados.find((item) => item.id == id);

            producto.cantidad++;

            producto.subtotal += producto.precio;

            setLocal();
            pintarTabla();
            pintarTotal();
            
        } else {

            const producto = products.find((item) => item.id == id);
            
            const objProductoTabla = {
                id: producto.id,
                foto: producto.thumbnail,
                nombre: producto.title,
                precio: producto.price,
                rating: producto.rating,
                cantidad: 1,
                subtotal: producto.price,
            };
            
            arrayProductosSeleccionados.push(objProductoTabla);

            setLocal();
            pintarTabla();
            pintarTotal()

        };

    }; //!FUNC-ALMACENARDATOS


    const pintarTabla = () => {

        pintarTablaCarrito.innerHTML = '';
            
        arrayProductosSeleccionados.forEach((item) => {

            const tableRow = document.createElement('TR');

            const fotoTD = document.createElement('TD');
            const foto = document.createElement('IMG');
            foto.src = item.foto;

            const nombreTD = document.createElement('TD');
            nombreTD.textContent = item.nombre;

            const precioTD = document.createElement('TD');
            precioTD.textContent = `${item.precio.toLocaleString('de-DE')} €`;

            const minusTD = document.createElement('TD');
            const circleMinus = document.createElement('I');
            circleMinus.classList.add('fa-sharp', 'fa-solid', 'fa-circle-minus');
            circleMinus.id = 'restar-producto';
            circleMinus.dataset['id'] = item.id;

            const cantidadTD = document.createElement('TD');
            cantidadTD.textContent = item.cantidad;

            const plusTD = document.createElement('TD');
            const circlePlus = document.createElement('I');
            circlePlus.classList.add('fa-sharp', 'fa-solid', 'fa-circle-plus');
            circlePlus.id = 'sumar-producto';
            circlePlus.dataset['id'] = item.id;

            const subtotalTD = document.createElement('TD');
            subtotalTD.textContent = `${item.subtotal.toLocaleString('de-DE')} €`;

            const xMarkTD = document.createElement('TD');
            const xMark = document.createElement('I');
            xMark.classList.add('fa-sharp', 'fa-solid', 'fa-circle-xmark');
            xMark.id = "eliminar-producto";
            xMark.dataset['id'] = item.id;

            
            fotoTD.append(foto), minusTD.append(circleMinus), plusTD.append(circlePlus), xMarkTD.append(xMark);

            tableRow.append(fotoTD, nombreTD, precioTD, minusTD, cantidadTD, plusTD, subtotalTD, xMarkTD);

            fragment.append(tableRow);
            
        });

        pintarTablaCarrito.append(fragment);

    }; //! FUNC-PINTARTABLA


    const eliminarProducto = (id) => {

        const index = arrayProductosSeleccionados.findIndex((item) => item.id == id);

        if(index != -1){

            arrayProductosSeleccionados.splice(index, 1);

            setLocal();
            pintarTabla();
            pintarTotal();

        };
        
    }; //!FUNC-ELIMINARPRODUCTO


    const restarProducto = (id) => {

        let producto = arrayProductosSeleccionados.find((item) => item.id == id);

        if(producto.cantidad > 1){

            producto.cantidad--;
            producto.subtotal -= producto.precio;

            setLocal();
            pintarTabla();
            pintarTotal();

        } else {

            eliminarProducto(id);
            setLocal();
            pintarTabla();

        };

    }; //!FUNC-RESTARPRODUCTO


    const pintarTotal = () => {

        totalFinalizarCompra.innerHTML = '';

        let subtotales = arrayProductosSeleccionados.map(item => item.subtotal);

        if(subtotales == 0){

            let total = 0;

            const elementTotal = document.createElement('P');
            elementTotal.innerHTML = `<strong>Total:</strong> ${total.toLocaleString('de-DE')} €`;
    
            totalFinalizarCompra.append(elementTotal);    

        } else {

            let total = subtotales.reduce((a, b) => a + b);        

            const elementTotal = document.createElement('P');
            elementTotal.innerHTML = `<strong>Total:</strong> ${total.toLocaleString('de-DE')} €`;

            totalFinalizarCompra.append(elementTotal);

        };

    }; //!FUNC-PINTARTOTAL


    const init = () => {

        let url = location.toString();

        if(url.includes('finalizar')){ //* includes() busca en una substring dentro de una string;

            pintarTabla();
            pintarTotal();

        }else{

            pintarCards();
            pintarCategorias();
            pintarTabla();

        };

    }; //!FUNC-INIT

    
    init();


}); //!LOAD