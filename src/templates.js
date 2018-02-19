(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cashback'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "<li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h1>"
    + alias4(((helper = (helper = helpers.site_name || (depth0 != null ? depth0.site_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"site_name","hash":{},"data":data}) : helper)))
    + " Cashback Reward</h1>\r\n\r\n<h4>Reward Options:</h4>\r\n<ul>\r\n    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.offers : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n</ul>\r\n\r\n<a href="
    + alias4(((helper = (helper = helpers.cashback_url || (depth0 != null ? depth0.cashback_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cashback_url","hash":{},"data":data}) : helper)))
    + " target=\"_blank\">Click here to view cashback (you must login to Discover first)</a>\r\n\r\n<br/>\r\n<br/>";
},"useData":true});
templates['deal'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h1>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\r\n\r\n<a href="
    + alias4(((helper = (helper = helpers.deal_url || (depth0 != null ? depth0.deal_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deal_url","hash":{},"data":data}) : helper)))
    + " target=\"_blank\">Click here to view deal (you must login to Discover first)</a>\r\n\r\n<br/>\r\n<br/>";
},"useData":true});
})();