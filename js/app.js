$(window).keydown(function(event) {
    if (event.ctrlKey && event.keyCode == 82) {
        var markdownText = $('#markdown-text').val();
        $('#html-text').html(marked(markdownText));
        event.preventDefault();
    }
    if (event.ctrlKey && event.keyCode == 83) {
        console.log("Hey! Ctrl+S event captured!");
        event.preventDefault();
    }
});
