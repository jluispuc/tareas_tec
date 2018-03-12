$(document).ready(function () {
  let noty = {
    el : '#noty',

    removeNoty : function() {
      $(this.el).attr('style', 'display:none');
    },

    classType : function(type){
      let classTypeInto = {};

      switch (type) {
        case 1:
          classTypeInto.class = 'alert alert-success text-center';
          classTypeInto.type = `<strong>ÉXITO</strong> `;
          break;
        case 2:
          classTypeInto.class = 'alert alert-warning text-center';
          classTypeInto.type = `<strong>ADVERTENCIA</strong> `;
          break;
        case 3:
          classTypeInto.class = 'alert alert-danger text-center';
          classTypeInto.type = `<strong>ERROR</strong> `;
          break;
        default:
          throw 'Defina el tipo de notificación';
          break;
      }

      return classTypeInto;

    },

    make : function (type, message) {

      let classInto = this.classType(type);

      $(this.el).empty();
      $(this.el).attr('class', classInto.class);
      $(this.el).append(classInto.type + message);
      $(this.el).removeAttr('style');

      setTimeout(function () {
        noty.removeNoty()
      }, 7000);

    }
  };
  //objeto de servicios http;
  let services = {
    //TRAER todas las tareas registradas
    getAllWorks : function(){

      return $.ajax({//method ajax
        type : 'GET', //tipo de petición
        url : '/all_works', //url de peticion
      });

    },

    saveWork : function(formData){
      return $.ajax({
        type : 'POST',
        url : '/new_work',
        data : formData
      });
    },

    updateWork : function (formData){
      return $.ajax({
        type : 'PUT',
        url : '/update_work',
        data : formData
      });
    },

    deleteWork : function(id){
      return $.ajax({
        type : 'DELETE',
        url : '/delete_work',
        data : {
          id : id
        }
      });
    }
  };
  //objeto de execuciones de petición
  let methods = {

    //EJECUTA el servicio que trae todas las tareas
    execGetAllWorks : function(){
      $.when(services.getAllWorks())
      .then(function(req){

        if (!req.Error){
          //si no hubo error, renderiza las tareas
          binds.renderItemInListGroup(req.all_works);
        } else {
          noty.make(3, req.Message);
        }

      });
    },

    execSaveWorks : function(formData){

      $.when(services.saveWork(formData))
      .then(function(req){

          if (!req.Error){
            noty.make(1, req.Message)
            methods.execGetAllWorks();
          } else {
            noty.make(3, req.Message);
          }

      });
    },

    execUpdateWorks : function (formData){

      $.when(services.updateWork(formData))
      .then(function (req) {

        if (!req.Error){
          noty.make(1, req.Message)
          methods.execGetAllWorks();
        } else {
          noty.make(3, req.Message);
        }

      });

    },

    execDeleteWork : function(id){
      $.when(services.deleteWork(id))
      .then(function (req) {

        if(!req.Error){
          noty.make(1, req.Message);
          methods.execGetAllWorks();
        } else {
          noty.make(3, req.Message);
        }

      });
    }
  }
  //Objeto que manipula los elementos del DOM
  let binds = {
    model : {
      data : []
    },
    //RENDERIZA las tareas en nuestro list group
    renderItemInListGroup : function (data) {

      if (data.length > 0){

        $('.list-group').empty();

        $.each(data, function (index, value) {

          let work = value;

          binds.model.data[work.id] = work;

          let itemWork = $('#item-work').html();

          let evalItemWork = eval('`' + itemWork + '`');

          $('.list-group').append(evalItemWork);

          if ( work.ready ){
            $('#work-'+work.id).attr('checked', true);
          }

        });
      } else {

        let emptyWorks = $('#empty-work').html();

        $('.list-group').empty();

        $('.list-group').append(emptyWorks);

      }

    }
  };
  //Objeto que sirve nuestros events
  let events = {

    //ACTIVA el evento click para el botón save-work
    saveWork : function () {

      $('#save-work').click(function(){
          let work = $('#new-work').val();

          let formData = {
            work : work,
            ready : 0
          }

          methods.execSaveWorks(formData);

          $('#new-work').val('');
      });

    },

    deleteWork : function(){

      $('body').on('click', '#delete-work', function () {
        let id = $(this).attr('id-work');
        methods.execDeleteWork(id);
      });

    },

    readyWork : function () {

      $('body').on('change', 'input[type="checkbox"]', function () {

        let id = $(this).attr('id-work');
        let prop = $(this).attr('checked');
        let ready;

        if (prop != undefined){
          $(this).removeAttr('checked');
          ready = 0
          binds.model.data[id].ready = ready;
        } else {
          $(this).attr('checked', true);
          ready = 1;
          binds.model.data[id].ready = ready;
        }

        methods.execUpdateWorks(binds.model.data[id]);

      })

    }
  };
  //llamada de metodos de inicio
  methods.execGetAllWorks();
  events.saveWork();
  events.deleteWork();
  events.readyWork();
});
