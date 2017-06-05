var app = angular.module("app",[]);

var querierBaseUrl = 'http://139.224.236.65:5002/';

app.controller('MainController',function ($scope, $http) {
    $scope.futures = [];
    $scope.commissions = [];
    $scope.orders = [];
    $scope.consignations = [];
    $scope.updatePrice = updateFuturePrice;

    $scope.filterOfConsignation = {
        availableFuture:[null,1,2,3],
        availableFirm:[null,1,2],
        availableStatus:[0,1,2,3,4],
        availableType:[1,2,3,4],
        futureId: null,
        firmId: null,
        type: null,
        status: null,
    };

    $scope.test = function () {
        alert(23)
    }

    var allConsignations = [];

    $scope.mapStatus = ["null",'CANCELLED','APPENDING','PARTIAL','FINISHED','INVALID'];
    $scope.mapOrderType = ["null",'Market','Limit','Stop'];

    var statusToId = {
        'CANCELLED':0,
        'APPENDING':1,
        'PARTIAL':2,
        'FINISHED':3,
        'INVALID':4,
    };

    var typeToId = {
        'Market':1,
        'Limit':2,
        'Stop':3,
    };
    
    
    $scope.deleteCommission = function (id) {
        
    }



    function updateFuturePrice(id) {
        $http({
            method: 'GET',
            url: querierBaseUrl + `futures/${id}?limit=20`
        }).then(function successCallback(response) {

            response.data.sort(function(a,b){
                let time1 = new Date( a.CreatedAt);
                let time2 = new Date( b.CreatedAt);
                console.log(time1);
                return time1.getSeconds()-time2.getSeconds()});

            console.log(response);

            new Morris.Area({
                element: 'revenue-chart',
                resize: true,
                data: response.data,
                xkey: 'CreatedAt',
                ykeys: ['Price'],
                labels: ['Price'],
                lineColors: ['#a0d0e0'],
                hideHover: 'auto'
            });
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    }

    function initFutures() {
        $http({
            method: 'GET',
            url: querierBaseUrl + `futures`
        }).then(function successCallback(response) {
            $scope.futures = response.data;
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    }

    function initConsignations() {
        $http({
            method: 'GET',
            url: querierBaseUrl + `admin/consignations?limit=999999`
        }).then(function successCallback(response) {
            $scope.consignations = response.data.slice(0,20);
            allConsignations = response.data;
            console.log(allConsignations)
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    }
    
    function initCommission() {
        $http({
            method: 'GET',
            url: querierBaseUrl + `admin/commissions?limit=999999`
        }).then(function successCallback(response) {
            $scope.commissions = response.data;
            console.log(allConsignations)
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    }
    
    $scope.filterConsignations = function() {
        $scope.consignations = [];
        var curType = typeToId[$scope.filterOfConsignation.type];
        var curStatus = statusToId[$scope.filterOfConsignation.status];
        for(let i=0;i<allConsignations.length;i++) {
            if($scope.consignations.length >= 20) {
                break;
            }
            if($scope.filterOfConsignation.firmId != null &&
                allConsignations[i].FirmId != $scope.filterOfConsignation.firmId) {
                continue;
            }

            if($scope.filterOfConsignation.futureId != null &&
                allConsignations[i].FutureId != $scope.filterOfConsignation.futureId) {
                continue;
            }

            if(curType != null &&
                allConsignations[i]['Type'] != curType) {
                continue;
            }
            if(curStatus != null &&
                allConsignations[i].Status != curStatus) {
                continue;
            }
            $scope.consignations.push(allConsignations[i]);
        }
        console.log($scope.consignations);
    }

    initFutures();
    initConsignations();
    initCommission();
    updateFuturePrice(1);


});