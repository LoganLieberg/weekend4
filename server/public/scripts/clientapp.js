
var completed = {};
$(document).ready(function () {
addTasks();
  $('#submit').on('click', postTask);
  $('.todoStuff').on('click', '.delete', deleteTask);
  $('.todoStuff').on('click', '.completeUpdate', updateTask);
  $('#todoComplete').on('click', '.delete', deleteTask);
  $('#todoComplete').on('click', '.incompleteUpdate', updateTask);
});

function addTasks () {

  $('#todoComplete').empty();
  $('#todoIncomplete').empty();

  $.ajax({
          type: 'GET',
          url: '/todo',
          success: function(tasks) {


            tasks.forEach(function(task) {
                $container = $('<tr></tr>');
                var taskInfo = ['name', 'description'];
                taskInfo.forEach(function(prop) {
                    var $el = $('<td>' + task[prop] + '</td>');
                    $container.append($el);
          });

          $container.data('taskID', task.id);
          $container.data('name', task.name);
          $container.data('complete', task.complete);


          if (task.complete) {
                  $container.append('<td>Complete</td><td><button class="incompleteUpdate">Set to Incomplete</button></td>');
                  $container.addClass('complete');
                  $container.append('<td><button class="delete">Delete Task</button></td>');
                  $('#todoComplete').append($container);

              } else {
                  $container.append('<td>Incomplete</td><td><button class="completeUpdate">Set to Complete</button></td>');
                  $container.addClass('incomplete');
                  $container.append('<td><button class="delete">Delete Task</button></td>');
                  $('#todoIncomplete').append($container);

              }
          });
      }
  });
}


function postTask() {
    event.preventDefault();

    var task = {};

    $.each($('#tasks').serializeArray(), function(i, field) {
        task[field.name] = field.value;
console.log(task);
    });

    $.ajax({
        type: 'POST',
        url: '/todo',
        data: task,
        success: function(data) {
            addTasks();
        }
    });
}

function deleteTask(event) {
    event.preventDefault();
if (confirm("did you really do it..? Don't lie fam.")) {
    var $name = $(this).closest('tr').data('name');
    var taskID = $(this).closest('tr').data('taskID');


        $.ajax({
            type: 'DELETE',
            url: '/todo/' + taskID,
            success: function() {
                addTasks();
            }
        });
      }
    }


function updateTask(event) {
     event.preventDefault();
// console.log('working');
    if ($(this).closest('tr').hasClass('incomplete')) {
        completed.value = true;
    } else {
        completed.value = false;
    }

    var taskID = $(this).closest('tr').data('taskID');

    $.ajax({
        type: 'PUT',
        url: '/todo/' + taskID,
        data: completed,
        success: function() {
            addTasks();
        }
    });
}
