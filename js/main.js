//TODO: Práctica carrito de compra

document.addEventListener('DOMContentLoaded', () => {


    //*** VARIABLES ***//

    const fragment = document.createDocumentFragment();

    const arrayProductosSeleccionados = JSON.parse(localStorage.getItem('productos')) || [];


    //* Capturas *//
    const divCards = document.querySelector('#pintar-cards');
    const tablaCarrito = document.querySelector('#tabla-carrito');
    const pintarTablaCarrito = document.querySelector('#pintar-tabla-carrito');
    const totalFinalizarCompra = document.querySelector('#total-finalizar-compra');




    //*** EVENTOS ***//

    document.addEventListener('click', ({target}) => {

        if(target.matches('#comprar')){
            location.href = 'finalizar-compra.html';
        };

        if(target.matches('#volver')){
            location.href = 'index.html';
        };

        if(target.matches('#icon-carrito')){
            tablaCarrito.classList.toggle('hidden')
        };

        if(target.matches('.card-btn')){ //! incompleto
            const id = target.dataset.id;
            almacenarDatos(id);
        };

        if(target.matches('#xmark')){
            const id = target.dataset.id;
            eliminarProducto(id);
            pintarTabla(id);
        }

        if(target.matches('#btn-vaciar')){
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

    const request = async () => {

        let ruta = 'https://dummyjson.com/products/category/laptops'

        try {

            let solicitud = await fetch(ruta, {});

            if(solicitud.ok){

                solicitud = await solicitud.json();

                return{
                    ok: true,
                    solicitud
                }

            }else{

                throw({
                    mensaje: 'Error en la petición'
                })
            }
            
        } catch (error) {

            return {
                ok: false,
                error
            }
        }            
    }; //!FUNC-REQUEST



    const pintarEstrellas = (rating) => { //! pinta "undefined"

        let divRating = document.createElement('DIV');

        let totalEstrellasAmarillas = Math.round(rating);

        let totalEstrellasGrises = 5 - totalEstrellasAmarillas;

        for(let i = 0; i < totalEstrellasAmarillas.length; i++){
            var estrellasAmarillas = document.createElement('IMG');
            estrellasAmarillas.src = 'assets/star1.png';
        }

        for(let i = 0; i < totalEstrellasGrises.length; i++){
            var estrellasGrises = document.createElement('IMG');
            estrellasGrises.src = 'assets/star2.png';
        }

        divRating.append(estrellasAmarillas, estrellasGrises);

        console.log(divRating);
        return divRating;

    }; //!FUNC-PINTARESTRELLAS



    const pintarCards = async () => { //! incompleta

        const {ok, solicitud} = await request();

        const {products} = solicitud;

        if(ok){
            
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
                elementButton.classList.add('card-btn');
                elementButton.dataset['id'] = item.id;
                elementButton.textContent = "Añadir al carrito";

                elementArticle.append(elementImg, elementHeader, elementP, imgEstrellas, elementButton);

                fragment.append(elementArticle);

            });

            divCards.append(fragment);

        };

    }; //!FUNC-PINTARCARDS



    const setLocal = () => {

        localStorage.setItem('productos', JSON.stringify(arrayProductosSeleccionados));

    }; //!FUNC-SETLOCAL



    const getLocal = () => {

        return JSON.parse(localStorage.getItem('productos')) || [];

    }; //!FUNC-GETLOCAL



    const almacenarDatos = async (id) => { //! incompleta

        const {solicitud} = await request();

        const {products} = solicitud;

        let producto = products.find((item) => item.id == id);

        if(arrayProductosSeleccionados.find((item) => item == producto)){

            console.log('Producto encontrado. Quiero sumarlo, no duplicarlo.')

        } else {
            
            let objProductosTabla = {
                id: producto.id,
                foto: producto.thumbnail,
                nombre: producto.title,
                precio: producto.price,
                rating: producto.rating,
                cantidad: 1,
                subtotal: producto.price
            }
            
            arrayProductosSeleccionados.push(objProductosTabla);

            setLocal();

            pintarTabla(id);

        }

    }; //!FUNC-ALMACENARDATOS

    

    const pintarTabla = (id) => { //! incompleta

        pintarTablaCarrito.innerHTML = '';

        const productos = getLocal();

        let producto = productos.find((item) => item.id == id);

        if(producto){

            console.log('Producto encontrado. ')
        
        }else{

            productos.forEach((item) => {

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

                const cantidadTD = document.createElement('TD');
                cantidadTD.textContent = item.cantidad;

                const plusTD = document.createElement('TD');
                const circlePlus = document.createElement('I');
                circlePlus.classList.add('fa-sharp', 'fa-solid', 'fa-circle-plus')

                const subtotalTD = document.createElement('TD');
                subtotalTD.textContent = `${item.precio * "cantidad"}`;

                const xMarkTD = document.createElement('TD');
                const xMark = document.createElement('I');
                xMark.classList.add('fa-sharp', 'fa-solid', 'fa-circle-xmark');
                xMark.id = "xmark";
                xMark.dataset['id'] = item.id;

                
                fotoTD.append(foto), minusTD.append(circleMinus), plusTD.append(circlePlus), xMarkTD.append(xMark);

                tableRow.append(fotoTD, nombreTD, precioTD, minusTD, cantidadTD, plusTD, subtotalTD, xMarkTD);

                fragment.append(tableRow);
                
            });
        }

        pintarTablaCarrito.append(fragment);

    }; //! FUNC-PINTARTABLA



    const eliminarProducto = (id) => { //! incompleta

        const indexProducto = arrayProductosSeleccionados.findIndex((item) => item.id == id);

        if(indexProducto != -1){

            arrayProductosSeleccionados.splice(indexProducto, 1);

            setLocal();

        }
        
    }; //!FUNC-ELIMINARPRODUCTO



    const pintarTotal = (subtotal) => { //! incompleto

        totalFinalizarCompra.innerHTML = '';

        const total = document.createElement('P');
        total.innerHTML = `<strong>Total:</strong> ${'(la suma de todos los subtotales)'}`;

        totalFinalizarCompra.append(total);

    }; //!FUNC-PINTARTOTAL



    const init = () => {

        let url = location.toString();

        if(url.includes('finalizar')){

            pintarTabla();
            pintarTotal(); //! argumento "subtotal" pendiente    

        }else{

            pintarCards();
            pintarTabla();    

        }

    }; //!FUNC-INIT

    
    init();


}); //!LOAD