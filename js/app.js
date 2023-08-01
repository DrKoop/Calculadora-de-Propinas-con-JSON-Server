
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
        //Eliminar elementos cuando la cantidad sea 0
        const resultado = pedido.filter( orden => orden.id !== platillo.id );
        cliente.pedido = [...resultado];
    }

    //Limpiar codigo HTML DUPLICADO
    limpiartHTML();

    if( cliente.pedido.length ){
        //Mostrar las Orden Final / Resumen en el HTML
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    

}


function actualizarResumen(){

    const contenido = document.querySelector('#resumen  .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card' , 'py-2' , 'px-3', 'shadow');


    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la saccion
    const heading = document.createElement('H3');
    heading.textContent = ' Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array con  los titulos de los Pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');
    const { pedido } = cliente;

    pedido.forEach( articulo => {

        const { nombre, cantidad, precio, id } = articulo;
        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');
        
        const nombreElement = document.createElement('H4');
        nombreElement.classList.add('my-4');
        nombreElement.textContent = nombre;

        const cantidadElement = document.createElement('P');
        cantidadElement.classList.add('fw-bold');
        cantidadElement.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
        
        cantidadElement.appendChild(cantidadValor);

        const precioElement = document.createElement('P');
        precioElement.classList.add('fw-bold');
        precioElement.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        precioElement.appendChild(precioValor);

        const subtotalElement = document.createElement('P');
        subtotalElement.classList.add('fw-bold');
        subtotalElement.textContent = 'Subtotal: ';

        const subTotalValor = document.createElement('SPAN');
        subTotalValor.classList.add('fw-normal');
        subTotalValor.textContent = calcularSubtotal(precio,cantidad);

        subtotalElement.appendChild(subTotalValor);

        //
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del Pedido';
        btnEliminar.onclick = (() => eliminarProducto(id) );


        //Agregando elementos a la lista
        lista.appendChild(nombreElement);
        lista.appendChild(cantidadElement);
        lista.appendChild(precioElement);
        lista.appendChild(subtotalElement);
        lista.appendChild(btnEliminar);
        

        //Agrega litsa al grupo Principal
        grupo.appendChild(lista);
    })


    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
    
    //Mostrar formulario de Popinas
    formularioPropinas();
}


function limpiartHTML(){
    const contenido = document.querySelector('#resumen .contenido ');

    while(  contenido.firstChild ){
        contenido.removeChild(contenido.firstChild);
    }
}


function calcularSubtotal( precio, cantidad){
    return `$ ${precio * cantidad}`
}

function eliminarProducto(id){

    const { pedido } = cliente
    const eliminarElemento =  pedido.filter( orden => orden.id !== id );
    cliente.pedido = [ ...eliminarElemento]

    //Actualizando el HTML
    limpiartHTML();


    if( cliente.pedido.length ){
        //Mostrar las Orden Final / Resumen en el HTML
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    //El producto se elimino, RESET AL FORMULARIO
    const productoEliminado = `#producto-${id}`;
    const inputReset = document.querySelector(productoEliminado);
    inputReset.value = 0;
}


function mensajePedidoVacio(){

    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center')
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}


function formularioPropinas(){

    const contenido = document.querySelector("#resumen .contenido");

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3' , 'shadow')

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio Button's
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10 %';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    ///
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25 %';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    ///

    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50 %';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    //


    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
    formulario.appendChild(divFormulario);
    


    contenido.appendChild(formulario);

}


function calcularPropina () {
    const { pedido } = cliente;

    let subTotal = 0;

    //Calular el Subtotal a Pagar
    pedido.forEach( articulo => {
        subTotal += articulo.cantidad * articulo.precio 
    });

    //Radio seleccionado
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //Calcular porcentajes de la propina
    const propina = (( subTotal * Number(propinaSeleccionada)) /100 );


    //Calcular el total a pagar
    const total = subTotal + propina;

    mostrarTotalHTML( subTotal, total, propina );

}

function mostrarTotalHTML( subTotal, total, propina ){


    const divTotalContenedor = document.createElement('DIV');
    divTotalContenedor.classList.add('total-pagar', 'my-5');


    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subTotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'La Propina Es: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'El Total a Pagar Es: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);
    //

    //Eliminar RESULTADOS DUPLICADOS
    const totalpagarDiv = document.querySelector('.total-pagar');

    if( totalpagarDiv ){
        totalpagarDiv.remove();
    }

    //

    divTotalContenedor.appendChild(subtotalParrafo);
    divTotalContenedor.appendChild(propinaParrafo);
    divTotalContenedor.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotalContenedor);
}