'use strict';


exports.blank = function($, _, gulp, mkdirp, rename){
    var _this = this;

    _.forEach(this.folders, function (f) {
        mkdirp('./client/app/core/'+f);
        mkdirp('./client/app/modules/messages/'+ f);
    })

    this.start('core', function(){
        gulp.src(_this.local.dirs())
            .pipe( $.template( _this._config.all() ) )
            .pipe( $.rename( rename ))
            .pipe( gulp.dest( _this.cwd.root() ) )
    })

}
exports.skeleton = function($, _, gulp, mkdirp, rename){
    var _this = this;
    _.forEach(this.folders, function (f) {
        mkdirp('./client/app/core/'+f);
        mkdirp('./client/app/modules/messages/'+ f);
    });

    this.start('core', function(){
        gulp.src(_this.local.use('./**/.*', './**/*'))
            .pipe( $.template( _this._config.all() ) )
            .pipe( $.rename( rename ))
            .pipe( gulp.dest( _this.cwd.root() ) )
    });

}
