window.Handcraft = function() {
  this.createBar();
  this.attachLogo();
  this.attachStyle();
  console.log("This website is hosted with Handcraft: http://handcraft2.com");
}
Handcraft.prototype.getElId = function(str) {
  return "_hc_" + str;
}
Handcraft.prototype.createBar = function() {
  this.bar = document.createElement('div');
  this.bar.id = this.getElId("bar");
  this.bar.addEventListener("click", function(evt) {
    this.bar.classList.toggle("expanded");
  }.bind(this));
  document.body.appendChild(this.bar);
}
Handcraft.prototype.attachStyle = function() {
  this.style = document.createElement("style");
  this.style.setAttribute("scoped", true);
  this.bar.appendChild(this.style);
  var styleText = document.createTextNode([
     "#" + this.getElId("bar") + " { position: fixed; z-index: 424242; bottom: 10px; left: 10px; width: 70px; height: 70px; opacity: .5;"
    ,"-webkit-transition: linear .2s; -moz-transition: linear .2s; transition: linear .2s; cursor: pointer; border-radius: 50%; "
    +" border: solid 2px transparent }"
    ,"#" + this.getElId("bar") + ":hover { opacity: 1 }"
    ,"#" + this.getElId("bar") + ".expanded { opacity: 1; border: solid 2px #ffd100; }"
    ,"#" + this.getElId("logo") + " { height: 70px; background: url(_include/img/logos/handcraft-logo.png) center center no-repeat;"
    ,"background-size: 30px; }"
  ].join("").split("}").join("}\n"));
  this.style.appendChild(styleText);
}
Handcraft.prototype.attachLogo = function() {
  var logo = document.createElement("div");
  logo.id = this.getElId("logo");
  this.bar.appendChild(logo);
}
var hc = new Handcraft();

/**

<div id="_hc_bar">
  <style></style>
  <div id="_hc_button">
    <div class="_hc_message _hc_right">This page was created with Handcraft. Click to find out more.</div>
    <div id="_hc_logo"></div>
    <div id="_hc_options">
      - Edit this page
      - Time travel
      - Add a comment
      - Share
      - Fork
      -
    </div>
  </div>
</div>

**/