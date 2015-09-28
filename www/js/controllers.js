angular.module('starter.controllers', [])


  .controller('InputCtrl', function ($scope, $rootScope, $ionicTabsDelegate) {
    $scope.goForward = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
        $ionicTabsDelegate.select(selected + 1);
      }
    }

    $scope.goBack = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
        $ionicTabsDelegate.select(selected - 1);
      }
    }

    $scope.factors = {
      min: '1',
      max: '9',
      value: '3'


    };

    $scope.experiments = {
      min: '2',
      max: '10',
      value: '5'
    }
    $scope.equation = {};
    $scope.experimentTemp = {};
    $scope.experiment = 0;
    $scope.viewFunction = false;
    $scope.update = function (factors, experiments) {

      $scope.equation = angular.copy(factors);
      $scope.eqAr = new Array(Number($scope.equation.value));
      $scope.experimentTemp = angular.copy(experiments);
      $scope.experiment = Number($scope.experimentTemp.value);


    };

    $scope.coeffArray = [];

    function createXs(factorsNum, experimentsNum) {
      var factorsXs = [];

      for (var i = 0; i < experimentsNum; i++) {
        factorsXs[i] = []
        for (var j = 0; j < factorsNum; j++) {
          factorsXs[i][j] = Math.round(Math.random() * 20);
        }
      }
      return factorsXs;

    };


    $scope.createCoeffArray = function (array, firstEl) {

      /** Створюемо  */
      $scope.coeffArray[0] = Number(firstEl);
      for (var i = 1; i <= array.length; i++) {
        $scope.coeffArray[i] = Number(array[i - 1]);

      }

      var maxXs = [];
      var minXs = [];
      var Xs0 = [];
      var dXs = [];
      var transXs = [];

      function transponentArray(array) {

        var transArray = []

        for (var i = 0; i < array[0].length; i++) {
          transArray[i] = [];
          for (var j = 0; j < array.length; j++) {
            transArray[i][j] = array[j][i];

          }

        }
        return transArray;
      }

      function createMaxXs(array) {
        var maxXs = []
        for (var i = 0; i < array.length; i++) {
          var tempArray = array[i];
          maxXs[i] = Math.max.apply(Math, tempArray);

        };
        
        return maxXs;
      }

      function createMinXs(array) {
        var minXs = []
        for (var i = 0; i < array.length; i++) {
          var tempArray = array[i];
          minXs[i] = Math.min.apply(Math, tempArray);

        }
        ;
        return minXs;
      }

      function createXs0(maxXs, minXs) {
        var Xs0 = [];
        for (var i = 0; i < maxXs.length; i++) {
          Xs0[i] = (maxXs[i] + minXs[i]) / 2;
        }
        return Xs0;
      }

      function createdXs(maxXs, Xs0) {
        var dXs = [];
        for (var i = 0; i < maxXs.length; i++) {
          dXs[i] = maxXs[i] - Xs0[i];
        }
        return dXs;
      }

      function createTable(Xs) {

        transXs = transponentArray(Xs);
        maxXs = createMaxXs(transXs);
        minXs = createMinXs(transXs);
        Xs0 = createXs0(maxXs, minXs);
        dXs = createdXs(maxXs, Xs0);


      }

      $scope.placeholders = [];
      function createPlace(coeffArray) {
        for (var i = 0; i < coeffArray; i++) {
          $scope.placeholders[i] = "a<sub>" + i + "</sub>"
        }
      }

      createPlace();
      function createNormalXs(xS, Xs0, dXs) {
        var normalXs = [];

        for (var i = 0; i < xS.length; i++) {
          normalXs[i] = [];
          for (var j = 0; j < xS[0].length; j++) {
            normalXs[i][j] = ((xS[i][j] - Xs0[j]) / dXs[j]).toFixed(2);
          }
        }
        console.log(normalXs);
        return normalXs;
      }

      console.log($scope.coeffArray);
      function createY(coeffArray, factors) {
        var Ys = [];
        for (var i = 0; i < factors.length; i++) {
          Ys[i] = coeffArray[0];
          for (var j = 0; j < factors[i].length; j++) {
            Ys[i] += coeffArray[j] * factors[i][j];
          }

        }

        return Ys;
      }

      $rootScope.factorsXs = createXs(array.length, $scope.experiment);
      createTable($rootScope.factorsXs);
      console.log(createY($scope.coeffArray, $rootScope.factorsXs));
      $rootScope.Ys = createY($scope.coeffArray, $rootScope.factorsXs);
      $rootScope.dXs = dXs;
      $rootScope.Xs0 = Xs0;
      $rootScope.normalXs = createNormalXs($scope.factorsXs, Xs0, dXs);

    }

  })

  .controller('TableCtrl', function ($rootScope, $scope, $ionicTabsDelegate) {
    $scope.goForward = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
        $ionicTabsDelegate.select(selected + 1);
      }
    }

    $scope.goBack = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
        $ionicTabsDelegate.select(selected - 1);
      }
    }
    $scope.factorsXs = $rootScope.factorsXs;
    $scope.Ys = $rootScope.Ys;
    $scope.dXs = $rootScope.dXs;
    $scope.Xs0 = $rootScope.Xs0;
    $scope.dXsHead = 'dX';
    $scope.Xs0Head = 'X<sub>0</sub>';
    $scope.verticalLabelXs = [];
    $scope.horizontalXs = [];
    $scope.horizontalXsN = [];
    $scope.normalXs = $rootScope.normalXs;
    console.log($scope.normalXs);

    function createHorizontalXs(factorsXs) {
      $scope.horizontalXs[0] = "No"
      $scope.horizontalXsN[0] = "No"
      for (var i = 1; i < factorsXs[0].length + 1; i++) {
        $scope.horizontalXs[i] = "X" + "<sub>" + i + "</sub>";
        $scope.horizontalXsN[i] = "X" + "<sub>" + "н" + i + "</sub>"
      }
    }

    function createVerticals(factorsXs) {
      for (var i = 0; i < factorsXs.length + 1; i++) {
        $scope.verticalLabelXs[i] = i + 1;
      }
    }

    createVerticals($scope.factorsXs);
    createHorizontalXs($scope.factorsXs);
    $scope.doRefresh = function () {
      $scope.factorsXs = $rootScope.factorsXs;
      $scope.Ys = $rootScope.Ys;
      $scope.dXs = $rootScope.dXs;
      $scope.Xs0 = $rootScope.Xs0;
      $scope.dXsHead = 'dX';
      $scope.Xs0Head = 'X<sub>0</sub>';
      $scope.verticalLabelXs = [];
      $scope.horizontalXs = [];
      $scope.horizontalXsN = [];


      $scope.normalXs = $rootScope.normalXs;
      console.log($scope.normalXs);

      function createHorizontalXs(factorsXs) {
        $scope.horizontalXs[0] = "No"
        $scope.horizontalXsN[0] = "No"
        for (var i = 1; i < factorsXs[0].length + 1; i++) {
          $scope.horizontalXs[i] = "X" + "<sub>" + i + "</sub>";
          $scope.horizontalXsN[i] = "X" + "<sub>" + "н" + i + "</sub>"
        }
      }

      function createVerticals(factorsXs) {
        for (var i = 0; i < factorsXs.length + 1; i++) {
          $scope.verticalLabelXs[i] = i + 1;
        }
      }

      createVerticals($scope.factorsXs);
      createHorizontalXs($scope.factorsXs);

      $scope.$broadcast('scroll.refreshComplete');

    }
    $rootScope.Ys = $scope.Ys;
    $rootScope.Xs = $scope.factorsXs;


  })

  .controller('RunCtrl', function ($rootScope, $scope, $ionicTabsDelegate) {
    $scope.goForward = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
        $ionicTabsDelegate.select(selected + 1);
      }
    }

    $scope.goBack = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
        $ionicTabsDelegate.select(selected - 1);
      }
    }
    $scope.Ys = $rootScope.Ys;
    $scope.factorsXs = $rootScope.Xs;
    $scope.show = false;

    $scope.getAnswer = function () {
      $scope.Ymin = 0;
      function getMinY(Ys) {
        $scope.Ymin = Ys[0];
        for (var i = 1; i < Ys.length; i++) {
          if ($scope.Ymin > Ys[i]) {
            $scope.Ymin = Ys[i]
          }
        }
      }

      getMinY($scope.Ys);
      console.log($scope.Ymin);
      var key = $scope.Ymin;
      var index = 0;
      for (var i = 0; i < $scope.Ys.length; i++) {
        if ($scope.Ys[i] === key) {
          index = i;
        }
      }

      $scope.minXs = $scope.factorsXs[index];

    }
    $scope.doRefresh = function () {
      $scope.Ys = $rootScope.Ys;
      var factorsXs = $rootScope.factorsXs;
      $scope.show = false;

      $scope.getAnswer = function () {
        $scope.Ymin = 0;
        function getMinY(Ys) {
          $scope.Ymin = Ys[0];
          for (var i = 1; i < Ys.length; i++) {
            if ($scope.Ymin > Ys[i]) {
              $scope.Ymin = Ys[i]
            }
          }
        }

        getMinY($scope.Ys);
        console.log($scope.Ymin);
        var key = $scope.Ymin;
        var index = 0;
        for (var i = 0; i < $scope.Ys.length; i++) {
          if ($scope.Ys[i] === key) {
            index = i;
          }
        }

        $scope.minXs = factorsXs[index];
      }


      $scope.$broadcast('scroll.refreshComplete');

    }


  })
