(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cashback'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h1>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " Cashback Reward</h1>\r\n<a href="
    + alias4(((helper = (helper = helpers.cashback_url || (depth0 != null ? depth0.cashback_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cashback_url","hash":{},"data":data}) : helper)))
    + ">FIXME Click here to view deal</a>";
},"useData":true});
templates['deal'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h1>"
    + alias4(((helper = (helper = helpers.site_name || (depth0 != null ? depth0.site_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"site_name","hash":{},"data":data}) : helper)))
    + "</h1>\r\n<a href="
    + alias4(((helper = (helper = helpers.deal_url || (depth0 != null ? depth0.deal_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deal_url","hash":{},"data":data}) : helper)))
    + ">FIXME Click here to view deal</a>\r\n";
},"useData":true});
})();