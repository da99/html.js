
function HTML() {
  this.elements = [];
} // html

function a() {
  let a = document.createElement("a");
  function push(x) {
    a.appendChild(x);
  }
  let has_body = false;
  let has_href = false;
  for_each(arguments, function (x) {
    if (is_func(x)) {
      x(push);
    } else {
      if (x.is_href) {
        a.setAttribute("href", x.content);
        has_href = x.content;
      } else {
        if (is_string(x)) {
          has_body = true;
          a.appendChild(document.createTextNode(x));
        }
      }
    }
  });
  if (!has_body && has_href) {
    a.appendChild(document.createTextNode(has_href));
  }
  return a;
}

function div() {
  let node = document.createElement("div");
  function push(x) {
    if (is_string(x))
      node.appendChild(document.createTextNode(x));
    else
      node.appendChild(x);
  }
  for_each(arguments, function (x) {
    if (is_func(x))
      x(push);
    else {
      push(x);
    }
  });
  return node;
}

function span() {
  let node = document.createElement("span");
  function push(x) {
    if (is_string(x))
      node.appendChild(document.createTextNode(x));
    else
      node.appendChild(x);
  }
  for_each(arguments, function (x) {
    if (is_func(x))
      x(push);
    else {
      if (is_string(x))
        node.appendChild(document.createTextNode(x));
      else
        push(x);
    }
  });
  return node;
}

HTML.prototype.br = function br() {
  this.elements.push(document.createElement("br"));
}

HTML.prototype.insert_into = function insert_into(target) {
  this.elements.forEach(function (x) {
    target.appendChild(x);
  });
}

HTML.prototype.div = function div() {
  let the_div = document.createElement("div");
  let texts = arguments[0];
  for (var i = 0, j = texts.length; i < j; i++) {
    the_div.appendChild(document.createTextNode(texts[i]));
    the_div.appendChild(document.createElement("br"));
  }
  this.elements.push(the_div);
  return the_div;
}

//
// ------------------------------------------------------------
//

function safe_uri(x) {
  return {content: x, type: "Safe"};
}

let data = {
  title: "hello",
  stuff: [
    "hi",
    "yo",
    "Good Morning!'\""
  ],
  uri: "google.com"
};

function for_each(args, body) {
  for (var i = 0, j = args.length; i < j; i++) {
    body(args[i]);
  }
  return args;
}

function is_func(x) {
  return typeof x === "function";
}

function _href(x) {
  return {is_href: true, content: "https://" + x};
}

function is_string(x) {
  return typeof x === "string";
}

function new_fragment() {
  let dom_fragment = document.createDocumentFragment();
  function push(x) {
    dom_fragment.appendChild(x);
  }
  for_each(arguments, function (x) {
    if (is_func(x)) {
      x(push);
    } else {
      dom_fragment.appendChild(x);
    }
  });

  return dom_fragment;
}

function br() {
  return document.createElement("br");
}

let nodes = new_fragment(function (p) {
  p(br());
  p(a(_href(data.uri)));
  p(br());
  p(a(_href(data.uri)));
  p(

    div(function(p){
      p(span(data.title));
      p(br());
      p(span("good bye"));
      p(br());
      p("something else");
    })

  );
});

console.log(nodes);
document.getElementById("the_body").appendChild(nodes);

