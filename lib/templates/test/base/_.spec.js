/* jshint -W117, -W030 */
describe('<%= module %>', function() {
    var controller, scope;

    beforeEach(function() {
        module('app', function($provide) {

        });
    });

    beforeEach(function () {

        controller = $controller('');
        $rootScope.$apply();
    });

    describe('<%= name %>', function() {

        it('should ====', function () {
            expect(1).to.be.defined;
        });

        describe('after <%= name %>', function() {
            it('should have =========', function() {
                expect(1).to.equal(1);
            });

            it('should have =========', function() {
                expect([1]).to.have.length(1);
            });
        });
    });
});