

var elastsearchApp=angular.module('elastsearchApp', ['elasticsearch'])
elastsearchApp.service('client',function(esFactory) {
        return esFactory ({
            host: 'localhost:9200'
        });
    });
elastsearchApp.controller('elastCtrl', function($scope, client, esFactory) {

    var elastCtrl = this;

    elastCtrl.name='hehe';

    elastCtrl.search = function () {
        $scope.lastsearchterm = elastCtrl.searchterm;
        client.search({
            index: 'library',
            type: 'movies',
            body: {
                query: {
                    match: {
                        Title: $scope.lastsearchterm
                    }
                }
            }
        }).then(function(resp) {
            $scope.movies = resp.hits.hits;
        }, function (err) {
            console.trace(err.message);
        })  ;


        elastCtrl.searchterm = '';


    };





    client.count({
        index: 'library'
    }).then(function (resp) {
        $scope.number=resp.count;
    }, function (err) {
        console.trace(err.message);
        $scope.number =0;
    });


    client.search({     //testsearch
        index: 'library',
        type: 'movies',
        body: {
            query: {
                match: {
                    Title: 'Godfather'
                }
            }
        }
    }).then(function(resp) {
        $scope.movietest = resp.hits.hits;
    }, function (err) {
        console.trace(err.message);
    })


    client.cluster.state({
        metric: [
            'cluster_name',
            'nodes',
            'master_node',
            'version'
        ]
    })
        .then(function (resp) {
            $scope.clusterState = resp;
            $scope.error = null;
        })
        .catch(function (err) {
            $scope.clusterState = null;
            $scope.error = err;
            if (err instanceof esFactory.errors.NoConnections) {
                $scope.error = new Error('Unable to connect to elasticsearch. ' +
                    'Make sure that it is running and listening at http://localhost:9200');
                $scope.error2='Unable to connect to elasticsearch. ' +
                    'Make sure that it is running and listening at http://localhost:9200';
            }
        })





    client.get({
        index: 'library',
        type: 'movies',
        id: 1
    }).then (function (resp) {
        $scope.movie1 = resp;
    });


});

