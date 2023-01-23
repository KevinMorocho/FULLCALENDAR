document.addEventListener("DOMContentLoaded", function(){

    new FullCalendar.Draggable(document.getElementById('listaeventospredefinidos'), {
      itemSelector: '.fc-event',
      eventData: function(eventEl){
        return{
            title: eventEl.innerText.trim()
        }
      }
    });

    $('.clockpicker').clockpicker();

    let calendario1 = new FullCalendar.Calendar(document.getElementById('Calendario1'),{
      droppable: true,
      height: 850,
      locale:'es',
      headerToolbar:{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      events: 'datoseventos.php?accion=listar',
      dateClick: function(info){
        limpiarFormulario();
        $('#BotonAgregar').show();
        $('#BotonModificar').hide();
        $('#BotonBorrar').hide();

        if (info.allDay) {
          $('#FechaInicio').val(info.dateStr);
          $('#FechaFin').val(info.dateStr);
        }else{
          let fechaHora = info.dateStr.split("T");
          $('#FechaInicio').val(fechaHora[0]);
          $('#FechaFin').val(fechaHora[0]);
          $('#HoraInicio').val(fechaHora[1].substring(0,5));
        }
        $("#FormularioEventos").modal('show');
      },
      eventClick: function(info) {
        $('#BotonAgregar').hide();
        $('#BotonModificar').show();
        $('#BotonBorrar').show();
        $('#Id').val(info.event.id);
        $('#Titulo').val(info.event.title);
        $('#Descripcion').val(info.event.extendedProps.descripcion);
        $('#FechaInicio').val(moment(info.event.start).format("YYYY-MM-DD"));
        $('#FechaFin').val(moment(info.event.end).format("YYYY-MM-DD"));
        $('#HoraInicio').val(moment(info.event.start).format("HH:mm"));
        $('#HoraFin').val(moment(info.event.end).format("HH:mm"));
        $('#ColorFondo').val(info.event.backgroundColor);
        $('#ColorTexto').val(info.event.textColor);
        $("#FormularioEventos").modal('show');
      },
      eventResize: function(info){
        $('#Id').val(info.event.id);
        $('#Titulo').val(info.event.title);
        $('#Descripcion').val(info.event.extendedProps.descripcion);
        $('#FechaInicio').val(moment(info.event.start).format("YYYY-MM-DD"));
        $('#FechaFin').val(moment(info.event.end).format("YYYY-MM-DD"));
        $('#HoraInicio').val(moment(info.event.start).format("HH:mm"));
        $('#HoraFin').val(moment(info.event.end).format("HH:mm"));
        $('#ColorFondo').val(info.event.backgroundColor);
        $('#ColorTexto').val(info.event.textColor);
        let registro = recuperarDatosFormulario();
        modificarRegistro(registro);
      },
      eventDrop: function(info){
        $('#Id').val(info.event.id);
        $('#Titulo').val(info.event.title);
        $('#Descripcion').val(info.event.extendedProps.descripcion);
        $('#FechaInicio').val(moment(info.event.start).format("YYYY-MM-DD"));
        $('#FechaFin').val(moment(info.event.end).format("YYYY-MM-DD"));
        $('#HoraInicio').val(moment(info.event.start).format("HH:mm"));
        $('#HoraFin').val(moment(info.event.end).format("HH:mm"));
        $('#ColorFondo').val(info.event.backgroundColor);
        $('#ColorTexto').val(info.event.textColor);
        let registro = recuperarDatosFormulario();
        modificarRegistro(registro);
      },
      drop: function(info){
        limpiarFormulario();
        $('#ColorFondo').val(info.draggedEl.dataset.colorfondo);
        $('#ColorTexto').val(info.draggedEl.dataset.colortexto);
        $('#Titulo').val(info.draggedEl.dataset.titulo);
        let fechaHora = info.dateStr.split("T");
        $('#FechaInicio').val(fechaHora[0]);
        $('#FechaFin').val(fechaHora[0]);
        if (info.allDay) {
          $('#HoraInicio').val(info.draggedEl.dataset.horainicio);
          $('#HoraFin').val(info.draggedEl.dataset.horafin);
        }else{
          $('#HoraInicio').val(fechaHora[1].substring(0,5));
          $('#HoraFin').val(moment(fechaHora[1].substring(0,5)).add(1,'hours'));
        }
        let registro = recuperarDatosFormulario();
        agregarEventoPredefinido(registro);
      }
    });

    calendario1.render();

    //Eventos de botones de la aplicacion
    $('#BotonAgregar').click(function(){
      let registro = recuperarDatosFormulario();
      agregarRegistro(registro);
      $('#FormularioEventos').modal('hide');
    });

    $('#BotonModificar').click(function(){
      let registro = recuperarDatosFormulario();
      modificarRegistro(registro);
      $('#FormularioEventos').modal('hide');
    });

    $('#BotonBorrar').click(function(){
      let registro = recuperarDatosFormulario();
      borrarRegistro(registro);
      $('#FormularioEventos').modal('hide');
    });

    $('#BotonEventosPredefinidos').click(function(){
      window.location = "eventospredefinidos.html";
    });


    //funciones para comunicarse con el servidor AJAX!
    function agregarRegistro(registro) {
      $.ajax({
        type: 'POST',
        url: 'datoseventos.php?accion=agregar',
        data: registro,
        success: function(msg){
          calendario1.refetchEvents();
        },
        error: function(error) {
          alert("Hubo un error al agregar el evento: " + error);
        }
      });
    }

    function modificarRegistro(registro){
      $.ajax({
        type: 'POST',
        url: 'datoseventos.php?accion=modificar',
        data: registro,
        success: function(msg){
          calendario1.refetchEvents();
        },
        error: function(error) {
          alert("Hubo un error al modificar el evento: " + error);
        }
      });
    }

    function borrarRegistro(registro){
      $.ajax({
        type: 'POST',
        url: 'datoseventos.php?accion=borrar',
        data: registro,
        success: function(msg){
          calendario1.refetchEvents();
        },
        error: function(error) {
          alert("Hubo un error al borrar el evento: " + error);
        }
      });
    }

    function agregarEventoPredefinido(registro){
      $.ajax({
        type: 'POST',
        url: 'datoseventos.php?accion=agregar',
        data: registro,
        success: function(msg){
          calendario1.removeAllEvents();
          calendario1.refetchEvents();
        },
        error: function(error) {
          alert("Hubo un error al agregar evento ep: " + error);
        }
      });
    }


    //funciones que interactuan con el FormularioEventos

    function limpiarFormulario(){
      $('#Id').val('');
      $('#Titulo').val('');
      $('#Descripcion').val('');
      $('#FechaFin').val('');
      $('#FechaInicio').val('');
      $('#HoraInicio').val('');
      $('#HoraFin').val('');
      $('#ColorFondo').val('#3788D8');
      $('#ColorTexto').val('#ffffff');
    }

    function recuperarDatosFormulario(){
      let registro = {
        id: $('#Id').val(),
        titulo: $('#Titulo').val(),
        descripcion: $('#Descripcion').val(),
        inicio: $('#FechaInicio').val() + ' ' + $('#HoraInicio').val(),
        fin: $('#FechaFin').val() + ' ' + $('#HoraFin').val(),
        colorfondo: $('#ColorFondo').val(),
        colortexto: $('#ColorTexto').val()
      }
      return registro;
    }

});