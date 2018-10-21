// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs).
//     // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
//     // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
//     // useful especially with forms, though we would prefer giving the user a little more room
//     // to interact with the app.
//     if (window.cordova && window.Keyboard) {
//       window.Keyboard.hideKeyboardAccessoryBar(true);
//     }

//     if (window.StatusBar) {
//       // Set the statusbar to use the default style, tweak this to
//       // remove the status bar on iOS or change it to use white instead of dark colors.
//       StatusBar.styleDefault();
//     }
//   });
// })

.controller('TodoCtrl', function($scope, $ionicModal) {
  $scope.tasks = [];
  $scope.getTasksFromFirestore = function() {
    var db = firebase.firestore();
    db.collection('tasks').onSnapshot(function(query) {
      query.docChanges().forEach(function(change) {
        if (change.type === 'added') {
          $scope.$apply(function() {
            $scope.tasks.push(Object.assign({}, change.doc.data(), { id: change.doc.id }));
          });
        } else if (change.type === 'modified') {
          $scope.$apply(function() {
            $scope.tasks.push(Object.assign({}, change.doc.data(), { id: change.doc.id }));
          });
        } else if (change.type === 'removed') {
          var index = $scope.tasks.map(function(task) { return  task.title; }).indexOf(change.doc.data().title);
          $scope.$apply(function() {
            $scope.tasks.splice(index, 1);
          });
        }
      })
    });
  };

  $scope.getTasksFromFirestore();
  console.log($scope.tasks);
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.createTask = function(task) {
    var db = firebase.firestore();
    db.collection('tasks').add({
      title: task.title
    }).then(function() {
      console.log('Task added successfully');
    }).catch(function(err) {
      console.log(err);
    });
    $scope.taskModal.hide();
    task.title = '';
  };

  $scope.deleteTask = function(task) {
    var db = firebase.firestore();
    db.collection('tasks').doc(task.id).delete();
  }
});
