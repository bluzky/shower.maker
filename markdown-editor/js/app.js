var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

// Because highlight.js is a bit awkward at times
var languageOverrides = {
  js: 'javascript',
  html: 'xml'
};

emojify.setConfig({
  img_dir: 'img/emoji'
});

var hashto;

// on editor change event handler
function update(e) {
  setOutput(e.getValue());
  clearTimeout(hashto);
  hashto = setTimeout(updateHash, 1000);
}

// get markdown text --> compile to html --> decorate --> display --> scroll to
// current change position
function setOutput(val) {
  val = val.replace(/<equation>((.*?\n)*?.*?)<\/equation>/ig, function(a, b) {
    return '<img src="http://latex.codecogs.com/png.latex?' + encodeURIComponent(b) + '" />';
  });

  var out = document.getElementById('out');
  var old = out.cloneNode(true);

  // compile markdown
  out.innerHTML = marked(val);

  // parse emoji character
  emojify.run(out);

  var allold = old.getElementsByTagName("*");
  if (allold === undefined) return;

  var allnew = out.getElementsByTagName("*");
  if (allnew === undefined) return;

  // scroll to position which content was changed
  for (var i = 0, max = Math.min(allold.length, allnew.length); i < max; i++) {
    if (!allold[i].isEqualNode(allnew[i])) {
      out.scrollTop = allnew[i].offsetTop;
      return;
    }
  }
}

// create editor instance with text area
var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  mode: 'gfm',
  lineNumbers: true,
  matchBrackets: true,
  lineWrapping: true,
  theme: 'mdn-like',
  extraKeys: {
    "Enter": "newlineAndIndentContinueMarkdownList"
  }
});

editor.on('change', update);

// handle event drag/drop file into editor
document.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();

  var reader = new FileReader();
  reader.onload = function(e) {
    editor.setValue(e.target.result);
  };

  reader.readAsText(e.dataTransfer.files[0]);
}, false);

function saveAsMarkdown() {
  save(editor.getValue(), "untitled.md");
}

function saveAsHtml() {
  save(document.getElementById('out').innerHTML, "untitled.html");
}

document.getElementById('saveas-markdown').addEventListener('click', function() {
  saveAsMarkdown();
  hideMenu();
});

document.getElementById('saveas-html').addEventListener('click', function() {
  saveAsHtml();
  hideMenu();
});

function save(code, name) {
  var blob = new Blob([code], {
    type: 'text/plain'
  });
  if (window.saveAs) {
    window.saveAs(blob, name);
  } else if (navigator.saveBlob) {
    navigator.saveBlob(blob, name);
  } else {
    url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", name);
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
  }
}

var menuVisible = false;
var menu = document.getElementById('menu');

function showMenu() {
  menuVisible = true;
  menu.style.display = 'block';
}

function hideMenu() {
  menuVisible = false;
  menu.style.display = 'none';
}

document.getElementById('close-menu').addEventListener('click', function() {
  hideMenu();
});

// listen for hot key pressed
// Ctrl + S : save markdown
// Ctrl + shift + S: show save dialog
document.addEventListener('keydown', function(e) {
  if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
    e.shiftKey ? showMenu() : saveAsMarkdown();

    e.preventDefault();
    return false;
  }

  if (e.keyCode === 27 && menuVisible) {
    hideMenu();

    e.preventDefault();
    return false;
  }
});

// zip editor content and put in hash string
function updateHash() {
  window.location.hash = btoa( // base64 so url-safe
    RawDeflate.deflate( // gzip
      unescape(encodeURIComponent( // convert to utf8
        editor.getValue()
      ))
    )
  );
}

// When load editor, if there is hash, unzip content and show on editor
if (window.location.hash) {
  var h = window.location.hash.replace(/^#/, '');
  if (h.slice(0, 5) == 'view:') {
    setOutput(decodeURIComponent(escape(RawDeflate.inflate(atob(h.slice(5))))));
    document.body.className = 'view';
  } else {
    editor.setValue(
      decodeURIComponent(escape(
        RawDeflate.inflate(
          atob(
            h
          )
        )
      ))
    );
    update(editor);
    editor.focus();
  }
} else {
  update(editor);
  editor.focus();
}
