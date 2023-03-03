//TODO: Práctica carrito de compra


document.addEventListener('DOMContentLoaded', () => {


    //*** VARIABLES ***//

    const fragment = document.createDocumentFragment();

    //* Capturas *//
    const divCards = document.querySelector('#pintar-cards');
    const tablaCarrito = document.querySelector('#tabla-carrito');

    //* Urls *//
    const urlIndex = 'index.html'
    const urlFinalizarCompra = 'finalizar-compra.html';




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
    };



    const pintarCards = async () => {

        let {ok, solicitud} = await request();

        console.log(solicitud);

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
                elementButton.textContent = "Añadir el carrito";

                elementArticle.append(elementImg, elementHeader, elementP, elementRating, elementButton);

                fragment.append(elementArticle);

            });

            divCards.append(fragment);

        };

    };



    const init = async () => {

        pintarCards()

    };


    init();


}); //!LOAD