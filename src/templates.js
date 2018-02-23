(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cashback'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "<p>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</p>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\r\n<div class=\"item-box\">\r\n    <h1>"
    + alias4(((helper = (helper = helpers.site_name || (depth0 != null ? depth0.site_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"site_name","hash":{},"data":data}) : helper)))
    + " Cashback Reward</h1>\r\n    <hr/>\r\n\r\n    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.offers : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n\r\n    <div class=\"img-container\">\r\n        <img src="
    + alias4(((helper = (helper = helpers.img_src_url || (depth0 != null ? depth0.img_src_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"img_src_url","hash":{},"data":data}) : helper)))
    + ">\r\n    </div>\r\n\r\n    <a class=\"button\" href="
    + alias4(((helper = (helper = helpers.cashback_url || (depth0 != null ? depth0.cashback_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cashback_url","hash":{},"data":data}) : helper)))
    + " target=\"_blank\">\r\n        Go to Cashback Reward\r\n    </a>\r\n\r\n    <br/>\r\n    You must login to <a href=\"https://www.discover.com\" target=\"_blank\">Discover.com</a> first.\r\n\r\n</div>\r\n\r\n<div class=\"expiry\">\r\n    No Expiry Date\r\n</div>";
},"useData":true});
templates['deal'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"item-box\">\r\n    <h1>"
    + alias4(((helper = (helper = helpers.site_name || (depth0 != null ? depth0.site_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"site_name","hash":{},"data":data}) : helper)))
    + " Deal</h1>\r\n    <hr/>\r\n    <h2>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\r\n\r\n    <div class=\"img-container\">\r\n        <img src="
    + alias4(((helper = (helper = helpers.img_src_url || (depth0 != null ? depth0.img_src_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"img_src_url","hash":{},"data":data}) : helper)))
    + ">\r\n    </div>\r\n\r\n    <a class=\"button\" href="
    + alias4(((helper = (helper = helpers.deal_url || (depth0 != null ? depth0.deal_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deal_url","hash":{},"data":data}) : helper)))
    + " target=\"_blank\">\r\n        Go to Deal\r\n    </a>\r\n\r\n    <br/>\r\n    You must login to <a href=\"https://www.discover.com\" target=\"_blank\">Discover.com</a> first.\r\n\r\n</div>\r\n\r\n<div class=\"expiry\">\r\n    "
    + alias4(((helper = (helper = helpers.expiry_date || (depth0 != null ? depth0.expiry_date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"expiry_date","hash":{},"data":data}) : helper)))
    + "\r\n</div>";
},"useData":true});
})();