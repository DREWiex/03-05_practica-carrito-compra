//TODO: Práctica carrito de compra
//! Por hacer: calcular rating y pintar estrellas en pintarCards()
//! Por hacer: añadir propiedades "cantidad" y "subtotal" a objeto en almacenarDatos()


document.addEventListener('DOMContentLoaded', () => {


    //*** VARIABLES ***//

    const fragment = document.createDocumentFragment();

    const arrayProductosSeleccionados =  JSON.parse(localStorage.getItem('productos')) || [];

    const arrayProductosEliminados = [];


    //* Capturas *//
    const divCards = document.querySelector('#pintar-cards');
    const tablaCarrito = document.querySelector('#tabla-carrito');
    const pintarTablaCarrito = document.querySelector('#pintar-tabla-carrito');
    const totalFinalizarCompra = document.querySelector('#total-finalizar-compra');

    //* Urls *//
    const urlIndex = 'http://127.0.0.1:5500/index.html'
    const urlFinalizarCompra = 'http://127.0.0.1:5500/finalizar-compra.html';




    //*** EVENTOS ***//

    document.addEventListener('click', ({target}) => {

        if(target.matches('#comprar')){ //* cambia a la página de finalizar compra
            location.href = urlFinalizarCompra;
        };

        if(target.matches('#volver')){ //* cambia a la página index
            location.href = urlIndex;
        };

        if(target.matches('#icon-carrito')){ //* muestra y oculta la tabla del carrito de compra
            tablaCarrito.classList.toggle('hidden')
        };

        if(target.matches('.card-btn')){ //* subir al localStorage cuando haga click en el botón
            const id = target.dataset.id;
            almacenarDatos(id);
            pintarTabla();
        };

        if(target.matches('#xmark')){
            const id = target.dataset.id;
            eliminarProducto(id);
        }

        if(target.matches('#btn-vaciar')){
            localStorage.removeItem('productos');
            location.href = urlIndex; //? si no vuelvo a cargar la página después de vaciar el carrito, si añado algo más, se va a sumar a lo anterior "vaciado"
        };

        if(target.matches('#btn-finalizar-compra')){
            alert('¡Has finalizado tu compra satisfactoriamente!')
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



    const pintarCards = async () => { //! incompleta

        let {ok, solicitud} = await request();

        let {products} = solicitud;

        if(ok){
            
            products.forEach((item) => {
                const elementArticle = document.createElement('ARTICLE');
                elementArticle.classList.add('grid-item-cards')
                const elementImg = document.createElement('IMG');
                elementImg.src = item.images[0];
                const elementHeader = document.createElement('H3');
                elementHeader.textContent = item.title
                const elementP = document.createElement('P');
                elementP.innerHTML = `Precio: ${item.price.toLocaleString('de-DE')} €`;
                const elementRating = document.createElement('P'); //! cambiar por IMG
                elementRating.textContent = '(aquí se pintarán las estrellas)';
                const elementButton = document.createElement('BUTTON');
                elementButton.classList.add('card-btn');
                elementButton.dataset['id'] = item.id;
                elementButton.textContent = "Añadir al carrito";

                elementArticle.append(elementImg, elementHeader, elementP, elementRating, elementButton);

                fragment.append(elementArticle);

            });

            divCards.append(fragment);

        };

    }; //!FUNC-PINTARCARDS



    const almacenarDatos = async (id) => { //! incompleta

        const {solicitud} = await request();

        const {products} = solicitud;

        let productos = products.find((item) => item.id == id);

        if(productos.stock > 0){ //* valido que haya stock antes de subir al local
            let objProductosTabla = { //! falta el spread(?) para cantidad y subtotal
                id: productos.id,
                foto: productos.thumbnail,
                nombre: productos.title,
                precio: productos.price
                //cantidad: //! falta añadir cantidad
                //subtotal: //! falta añadir subtotal
            }
            
            arrayProductosSeleccionados.push(objProductosTabla);
            setLocal();

        }else{
            console.log('Stock is empty!');
        }

    }; //!FUNC-ALMACENARDATOS



    const setLocal = () => {

        localStorage.setItem('productos', JSON.stringify(arrayProductosSeleccionados));

    }; //!FUNC-SETLOCAL



    const getLocal = () => {

        return JSON.parse(localStorage.getItem('productos')) || [];

    }; //!FUNC-GETLOCAL
    


    const pintarTabla = () => {

        pintarTablaCarrito.innerHTML = '';

        const productos = getLocal();

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
            cantidadTD.textContent = '(cantidad)';

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

        pintarTablaCarrito.append(fragment);

    }; //! FUNC-PINTARTABLA



    const eliminarProducto = (id) => { //! incompleta

        const productos = getLocal();

        let producto = productos.find((item) => item.id == id);
        console.log(producto);
        
    };



    const pintarTotal = (subtotal) => { //! incompleto

        totalFinalizarCompra.innerHTML = '';

        const total = document.createElement('P');
        total.innerHTML = `<strong>Total:</strong> ${'(la suma de todos los subtotales)'}`;

        totalFinalizarCompra.append(total);

    }; //!FUNC-PINTARTOTAL



    const init = () => {

        let url = location;

        if(url == urlIndex){

        pintarCards();
        pintarTabla();

        };

        if(url == urlFinalizarCompra){

        pintarTabla();
        pintarTotal(); //! argumento "subtotal" pendiente

        };

    }; //!FUNC-INIT

    init();


}); //!LOAD