var slideReg = /^ *::([a-zA-Z0-9]*).*\n*([^]*?)(?:\n+ *::)/;
function compile(text){
    var html = "";
    while((result = slideReg.exec(text)) != undefined){
      html += '<section class="slide"><div>';
      html += marked(result[2]);
      html += "</div></section>";
      text = text.substring(result[0].length-2);
    }
    return html;
}

marked.setOptions({langPrefix: "language-"});
var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return '<h' + level + '><a name="' +
                escapedText +
                 '" class="anchor" href="#' +
                 escapedText +
                 '"><span class="header-link"></span></a>' +
                  text + '</h' + level + '>';
},

$(document).ready(function(e){
  $(window).keydown(function(event) {
      if (event.ctrlKey && event.keyCode == 82) {
          var markdownText = $('#markdown-text').val();
          $('#html-text').html(compile(markdownText));
          reloadSlide(window);
          event.preventDefault();
          event.stopPropagation();
      }
      if (event.ctrlKey && event.keyCode == 83) {
          console.log("Hey! Ctrl+S event captured!");
          event.preventDefault();
      }
  });

  $('#compile').click(function(e){
    var markdownText = $('#markdown-text').val();
    $('#html-text').html(compile(markdownText));
    var DOMContentLoaded_event = document.createEvent("Event")
    DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true)
    window.document.dispatchEvent(DOMContentLoaded_event)
    e.preventDefault();
  });
});
