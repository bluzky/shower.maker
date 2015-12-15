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
    event.preventDefault();
  });
});
