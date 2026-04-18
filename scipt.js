emailjs.init("PUBLIC KEY");

const especialidades = document.querySelectorAll('.especialidad');

especialidades.forEach(function(card) {
    card.addEventListener('click', function() {
        // Si ya está activa, la desactiva
        if (card.classList.contains('activa')) {
            card.classList.remove('activa');
            especialidades.forEach(function(c) {
                c.classList.remove('inactiva');
            });
            return;
        }
        
        // Activa la seleccionada e inactiva las demás
        especialidades.forEach(function(c) {
            c.classList.remove('activa');
            c.classList.add('inactiva');
        });
        card.classList.remove('inactiva');
        card.classList.add('activa');
    });
});

// Ocultar/desocultar calendario
const form = document.querySelector('form');
const calendario = document.getElementById('calendario');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    calendario.style.display = 'flex';
    setTimeout(function() {
        calendario.classList.add('visible');
    }, 10);
});

// Calendario interactivo
// Calendario
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let diaSeleccionado = null;

function generarCalendario(mes, anio) {
    document.querySelector('#cal-header h3').textContent = `${meses[mes]} ${anio}`;
    
    const primerDia = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    
    // Ajustar para que empiece en lunes (0=lunes)
    const inicio = primerDia === 0 ? 6 : primerDia - 1;
    
    let html = '';
    let dia = 1;
    
    for (let fila = 0; fila < 6; fila++) {
        html += '<tr>';
        for (let col = 0; col < 7; col++) {
            const celda = fila * 7 + col;
            if (celda < inicio || dia > diasEnMes) {
                html += '<td></td>';
            } else {
                html += `<td data-dia="${dia}" data-mes="${mes}" data-anio="${anio}">${dia}</td>`;
                dia++;
            }
        }
        html += '</tr>';
    }
    
    document.getElementById('cal-body').innerHTML = html;
    
    // Agregar eventos de clic a los días
    document.querySelectorAll('#cal-body td[data-dia]').forEach(function(td) {
    td.addEventListener('click', function() {
        diaSeleccionado = `${this.dataset.dia} de ${meses[mes]} de ${anio}`;
        document.getElementById('popup-fecha').textContent = diaSeleccionado;
        const popup = document.getElementById('popup-confirmacion');
        popup.style.display = 'flex';
        });
    });

    document.getElementById('btn-cancelar').addEventListener('click', function() {
        document.getElementById('popup-confirmacion').style.display = 'none';
        diaSeleccionado = null;
    });

    document.getElementById('btn-confirmar').addEventListener('click', function() {
        document.getElementById('popup-confirmacion').style.display = 'none';
        
        // Bloquear calendario
        document.querySelectorAll('#cal-body td[data-dia]').forEach(function(td) {
            td.style.pointerEvents = 'none';
        });
        document.getElementById('prev-mes').style.pointerEvents = 'none';
        document.getElementById('next-mes').style.pointerEvents = 'none';

        // Enviar correo
        const templateParams = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            seguro: document.querySelector('input[name="seguro"]:checked').value,
            motivo: document.getElementById('razon').value || 'El paciente no proporciono informacion de motivo de cita',
            fecha: diaSeleccionado
        };

        emailjs.send('SERVICE KEY', 'TEMPLATE KEY', templateParams)
            .then(function() {
                document.getElementById('calendario').innerHTML += 
                    '<p id="msg-confirmacion">Correo enviado. El psicólogo se comunicará con usted brevemente.</p>';
            })
            .catch(function(error) {
                console.error('Error:', error);
                alert('Hubo un error al enviar, intenta de nuevo');
            });
    });
}

document.getElementById('prev-mes').addEventListener('click', function() {
    mesActual--;
    if (mesActual < 0) { mesActual = 11; anioActual--; }
    generarCalendario(mesActual, anioActual);
});

document.getElementById('next-mes').addEventListener('click', function() {
    mesActual++;
    if (mesActual > 11) { mesActual = 0; anioActual++; }
    generarCalendario(mesActual, anioActual);
});

generarCalendario(mesActual, anioActual);