(function(){
  'use strict';

  var _s = require('underscore.string'),
      _i = require('inflections')

  var Namify = module.exports;

  Namify.single = function( string ){

    var filter = { original: string, slug:{}, camel:{}, class:{}, human:{} };

    filter.slug  = _s.slugify(string);
    filter.camel = _s.camelize(filter.slug);
    filter.class = _s.classify(filter.slug);
    filter.human = _s.humanize(filter.slug);
    return filter;
  };

  Namify.multi = function( string ){

    var filter = { original: string, slug:{}, camel:{}, class:{}, human:{} };

    filter.slug.val     = _s.slugify(string);
    filter.slug.plural  = _i.pluralize(filter.slug.val);
    filter.slug.single  = _i.singularize(filter.slug.val);
    filter.camel.plural = _s.camelize(filter.slug.plural);
    filter.camel.single = _s.camelize(filter.slug.single);
    filter.class.plural = _s.classify(filter.slug.plural);
    filter.class.single = _s.classify(filter.slug.single);
    filter.human.plural = _s.humanize(filter.slug.plural);
    filter.human.single = _s.humanize(filter.slug.single);
    return filter;
  };


})();