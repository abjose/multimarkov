var kStartSymbol = "STARTthisisanimprobableword!@#!@K!KJKHHKasdfjksdh";
var kEndSymbol = "ENDthisisanimprobableword!@#!@K!KJKHHKasdfjksdh";
var tab_count = 0;

window.onload = function() {
  init();
}

function init() {
  // Add an initial tab.
  AddTab();

  // Add a new tab when you click the "+" tab.
  var add_tab = document.getElementById("add-tab");
  add_tab.onclick = function(e) {
    AddTab();
  }

  // Generate some sentences when you click generate.
  var generate = document.getElementById("generate");
  generate.onclick = function() {
    var repeat = Number(document.getElementById("num2gen").value);
    if (isNaN(repeat)) return;
    var output = document.getElementById("output");
    output.innerHTML = "";
    for (var i = 0; i < repeat; ++i) {
      var sentence = GenerateSentence(WordTransitions(CorporaFromTabs()));
      output.innerHTML += sentence + "<br><br>";
    }
  };
}

function AddTab() {
  // Make a new tab.
  var tab_name = "tab " + ++tab_count;
  var input = document.createElement("input");
  input.type = "radio";
  input.id = tab_name;
  input.name = "tab-group-1";
  var label = document.createElement("label");
  label.htmlFor = tab_name;
  label.innerHTML = tab_name;
  var textarea = document.createElement("textarea");
  textarea.className = "content corpus";
  var tab = document.createElement("div");
  tab.className = "tab";
  tab.appendChild(input);
  tab.appendChild(label);
  tab.appendChild(textarea);

  // Remove the tab when you ctrl-click it.
  tab.onclick = function(e) {
    if (e.ctrlKey) {
      // Only remove if at least one tab.
      if (document.getElementsByClassName("tab").length > 2) {
        var tab = e.target.parentNode;
        tab.parentNode.removeChild(tab);
      }
    }
  };

  // Append the new tab to the tabs div, before the + tab.
  var tabs = document.getElementById("tab-group");
  var add_tab = document.getElementById("add-tab");
  tabs.insertBefore(tab, add_tab);
}

function SplitCorpus(text) {
  // Currently this includes delimiters, but consider not doing that.
  var sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
  if (!sentences) sentences = [text];

  // Split sentences by " " to get words (sort of)
  return sentences.map(function(sentence) {
    return sentence.trim().split(" ");
  });
}

function CorporaFromTabs() {
  // Get the values of all the textareas.
  var corpora = document.getElementsByClassName("corpus");
  corpora = Array.from(corpora).map(function(e) { 
    return SplitCorpus(e.value); 
  });

  // Flatten and return.
  return [].concat.apply([], corpora);
}

function WordTransitions(corpora) {
  // TODO: ngrams

  // Out of laziness, this is just a list of all the words we've seen
  // appear after the key. We'll pick one randomly when generating new
  // sentences.
  var words = {};

  for (var i = 0; i < corpora.length; ++i) {
    // Prepend and append special symbols to this sentence.
    corpora[i].unshift(kStartSymbol);
    corpora[i].push(kEndSymbol);
    // Append the subsequent word to the current word's list.
    for (var j = 0; j < corpora[i].length - 1; ++j) {
      var curr = corpora[i][j];
      var next = corpora[i][j + 1];
      if (words[curr] == undefined) {
        words[curr] = [];
      }
      words[curr].push(next);
    }
  }

  return words;
}

function GenerateSentence(transitions) {
  // Just one. Can't be too generous.
  var sentence = "";
  var word = kStartSymbol;
  while (word != kEndSymbol) {
    var random_index = Math.floor(Math.random() * transitions[word].length);
    word = transitions[word][random_index];
    if (word != kEndSymbol) sentence += word + " ";
  }

  return sentence;
}
