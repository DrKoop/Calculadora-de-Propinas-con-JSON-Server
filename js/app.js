
//Guardanddo info del MODAL
let cliente = {
    mesa:'',
    hora:'',
    pedido:[]
}

const categorias = {
    1 : 'Comida',
    2 : 'Bebidas',
    3 : 'Postres'
}


const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente)

function guardarCliente() {
    //Leyendo data de los inputs 
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;
    //Validacion
    const camposVacios = [ mesa,hora].some( campo => campo === '');
    
    if(camposVacios){
        //Evitar multiples alertas
        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback','d-block','text-center');
            alerta.textContent = 'Todos los Campos Son Obligatorios.';
            //Imprimiendola en el HTML
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 2000);
        }
        return;
    }
    

    //Añadiendo data del formulario  al objeto
    cliente = { ...cliente , mesa, hora }

    //Ocultar Modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario)
    modalBootstrap.hide();

    //Mostrar Secciones
    mostrarSecciones();

    //CONSULTA API
    obtenerPlatillos();
    
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none')  );
}

function obtenerPlatillos(){
    const url = "http://localhost:4000/platillos";

    fetch( url )
    .then( respuesta => respuesta.json() )
    .then( resultado => mostrarPlatillos(resultado) )
    .catch( error => console.log(error) )
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row','py-3','border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //Funcion que detecta Cantidad y Platillo que se esta Agregando
        inputCantidad.onchange = () => { 
            const cantidad = +inputCantidad.value;
            agregarPlatillo({ ...platillo , cantidad });
         };

        const agregarInput = document.createElement('DIV');
        agregarInput.classList.add('col-md-2'); 
        agregarInput.appendChild(inputCantidad);


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregarInput);

        contenido.appendChild(row);
    });
}


//Detecta Cantidad y Platillo que se esta Agregando
function agregarPlatillo(platillo) {

    //Extraer el pedido
    let { pedido } = cliente;

    //Revisar cantidad mayor a 0
    if(platillo.cantidad > 0){
        
        //Comprueba si el elementos ya existe en el Array
        if( pedido.some( articulo => articulo.id === platillo.id )){
            //El articulo ya existe, SOLO ACTUALIZAR LA PROPIEDAD DE CANTIDAD
            const pedidoActualizado = pedido.map( orden => {

                if( orden.id === platillo.id ){
                    orden.cantidad = platillo.cantidad;
                }
                return orden;

            });
            //Se asigna la propiedad actualizada
            cliente.pedido = [ ...pedidoActualizado ];
        }else{
            //Si el articulo no exixte, lo agregamos al Array
            cliente.pedido = [ ...pedido, platillo ];
        }
    }else{
        console.log('no hay')
    }

    console.log(cliente.pedido)
}