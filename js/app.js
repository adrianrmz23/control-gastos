const formulario = document.getElementById("formulario");
const inputTexto = document.getElementById("texto");
const inputCantidad = document.getElementById("cantidad");
const lista = document.getElementById("lista-transacciones");
const balance = document.getElementById("balance");
const dineroPlus = document.getElementById("dinero-plus");
const dineroMinus = document.getElementById("dinero-minus");
let miGrafica;

let transacciones = JSON.parse(localStorage.getItem("mis_transacciones")) || [];

transacciones.forEach(transaccionEach => {
    agregarTransaccionDOM(transaccionEach);
});

actualizarValores();


formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!inputTexto.value || !inputCantidad.value) {
        console.log("Falta un dato");
    } else {
        const transaccion = {
            id: Date.now(),
            texto: inputTexto.value,
            cantidad: parseFloat(inputCantidad.value),
        }

        agregarTransaccionDOM(transaccion);
        transacciones.push(transaccion);
        actualizarValores();
        localStorage.setItem('mis_transacciones', JSON.stringify(transacciones));
    }

});


function agregarTransaccionDOM(transaccion) {
    const checkNumber = Math.sign(transaccion.cantidad);

    const item = document.createElement("li");
    const deleteButton = document.createElement("button");

    deleteButton.innerHTML = `🗑️`;
    item.innerHTML = `Concepto: ${transaccion.texto}
                    <br>Cantidad: ${transaccion.cantidad} `;
    item.appendChild(deleteButton);

    deleteButton.classList.add("delete-button", "bg-red-500", "text-white", "px-2", "rounded", "ml-2", "hover:cursor-pointer");

    if (checkNumber == 1) {
        item.classList.add("bg-neutral-primary-soft", "border", "border-default", "rounded-lg", "p-2", "mb-2", "mt-4", "shadow-xs", "border-r-4", "flex", "justify-between", "border-green-500");
    } else {
        item.classList.add("bg-neutral-primary-soft", "border", "border-default", "rounded-lg", "p-2", "mb-2", "mt-4", "shadow-xs", "border-r-4", "flex", "justify-between", "border-red-500");
    }

    lista.appendChild(item);

    deleteButton.addEventListener("click", function (e) {
        e.preventDefault();
        item.remove();
        transacciones = transacciones.filter(t => t.id !== transaccion.id)
        actualizarValores();
        localStorage.setItem('mis_transacciones', JSON.stringify(transacciones));
    });
}

function actualizarValores() {

    const arrayCantidades = transacciones.map(function (item) {
        return item.cantidad;
    });

    const positivos = arrayCantidades.filter(numero => numero >= 0);
    const negativos = arrayCantidades.filter(numero => numero < 0);

    const totalPositivos = positivos.reduce((acum, num) => {
        return acum + num;
    }, 0);

    const totalNegativos = negativos.reduce((acum, num) => {
        return acum + num;
    }, 0);

    const totalArray = arrayCantidades.reduce((acumulador, numero) => {
        return acumulador + numero;
    }, 0);

    dineroPlus.innerHTML = `$${totalPositivos.toFixed(2)}`;
    dineroMinus.innerHTML = `$${totalNegativos.toFixed(2)}`;
    balance.innerHTML = `$${totalArray.toFixed(2)}`;

    const totalNegativoTransform = Math.abs(totalNegativos);
    pintarGrafica(totalPositivos, totalNegativoTransform);
}

function pintarGrafica(ingresos, gastos) {
    const ctx = document.getElementById('grafica-pastel');
    if (miGrafica) {
        miGrafica.destroy();
    }
    miGrafica = new Chart(ctx, {
        type: 'doughnut', // Tipo de gráfico: 'pie' (pastel) o 'doughnut' (dona)
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                label: 'Balance',
                data: [ingresos, gastos], // <--- Aquí entran tus datos
                backgroundColor: [
                    '#22c55e', // Verde (Tailwind green-500)
                    '#ef4444'  // Rojo (Tailwind red-500)
                ],
                hoverOffset: 4
            }]
        }
    });
}