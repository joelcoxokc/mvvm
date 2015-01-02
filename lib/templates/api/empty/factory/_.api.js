;(function(){

    'use strict';

    angular
        .module('<%= module %>')
        .constant('apiHost', 'http://localhost:9000/api')
        .factory('<%= names.classed %>', <%= names.classed %>);

    /* @inject */
    function <%= names.classed %>($http, apiHost) {

        // Define Private Variables
        var api = join(serverUrl, '<%= name %>');

        // Define the public api
        var instance = {
            all: all,
            one: one,
            create: create,
            update: update,
            destroy: destroy
        };
        return instance;

        ////////////////

        /**
         * one                         |  description.
         * @return {Promise}  |  $http |  promise a collection of all models.
         */
        function all (){
            return $http.get( api );
        }

        /**
         * one                         |  description.
         * @param  {Integer}  |  id    |  requested model id
         * @return {Promise}  |  $http |  promise a single instance of the requested model.
         */
        function one ( id ){
            return $http.get( join( api, id) );
        }

        /**
         * create                      |  description.
         * @param  {Object}   |  data  |  data for creating a new model.
         * @return {Promise}  |  $http |  promise a new model insance.
         */
        function create ( data ){
            return $http.post( api, data )
                .then( function (response){
                    return response.data;
                })
                .catch( function (err){
                    return err;
                });
        }

        /**
         * update                      |  description.
         * @param  {Integer}  |  id    |  model id.
         * @param  {Object}   |  data  |  updated model data.
         * @return {Promise}  |  $http |  promise the updated verision of the model.
         */
        function update ( id, data ){
            return $http.put( join( api, id ), data )
                .then( function (response){
                    return response.data;
                })
                .catch( function (err){
                    return err
                });
        }
        /**
         * destroy                     |  description.
         * @param  {Integer}  |  id    |  model id.
         * @return {Promise}  |  $http |  promise the model will be destroyed.
         */
        function destroy ( id ){
            return $http.delete( join( api, id ) )
                .then( function (response){
                    return response.data;
                })
                .catch( function (err){
                    return err;
                });
        }

        /**
         * join                 | create a url string from the given arguments.
         * @return {String}     | A string with arguments joined by a root slash.
         */
        function join(){
            return Array.prototype.slice.call(arguments).join('/')
        }
    }

}).call(this);
