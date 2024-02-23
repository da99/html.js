


type Attributes = Partial<HTMLElement | HTMLAnchorElement>;

const URLish = /^[a-z]:\/\//i;
const ObjectPrototype = Object.getPrototypeOf({});

function is_class_id(x: unknown): boolean {
  return typeof x === 'string' && (x.indexOf('.') === 0 || x.indexOf('#') === 0);
}

function is_urlish(x: unknown) {
  if (typeof x !== 'string')
    return false;

  return URLish.test(x);
} // func

function set_class(e: HTMLElement, new_class: string) {

  let curr = '';
  for (const s of new_class.split(/(\.|\#)/g) ) {
    switch (curr) {
      case '':
        break;
      case '.':
      case '#':
        curr = s;
        break;
      default:
        switch (curr) {
          case '.':
            e.classList.add(s);
            break;
          case '#':
            e.setAttribute('id', s);
            break;
        }
    } // switch
  }
 
 return e;
} // func

/*
  * a("https://some.url", "My Text")
  * a('.red#ID', "https://some.url", "My Text")
  * a("https://some.url", span("My Text"))
*/
export function a(...args: (string | Element)[] ) {
  const new_args : (string | Attributes)[] = [];
  let i = 0
  for (const x of args) {
    if (typeof x === 'string') {
      if (i === 0 && is_class_id(x)) {
        new_args.push(x);
        continue;
      }
      if (is_urlish(x)) {
        new_args.push({href: x})
        continue;
      }
      new_args.push(x);
      continue
    }
    new_args.push(x);
    ++i;
  }
  return element('a', ...new_args);
}

/*
  * element('a', {href: "https://some.url"}, "My Text")
  * element('a', '.red#ID', {href: "https://some.url"}, "My Text")
  * element('a', span("My Text"))
*/
export function element(tag_name: keyof HTMLElementTagNameMap, ...pieces : (string | Element | Attributes)[]) {
  const e = document.createElement(tag_name);
  pieces.forEach((x, i) => {
    if (typeof x === "string") {
      if (i === 0 && is_class_id(x))
        return set_class(e, x);
      return e.appendChild(document.createTextNode(x));
    }
    if (typeof x === 'object' && Object.getPrototypeOf(x) === ObjectPrototype)
      return set_attrs(e, x);
    e.appendChild(x as Element);
  });
  return e;
} // export function

function set_attrs(ele: Element, attrs: Attributes) {
  for (const k in attrs) {
    switch (k) {
      case 'href':
        try {
          ele.setAttribute(k, (new URL(attrs['href'])).toString());
        } catch (e) {
          console.warn("Invalid url.")
        }
        break;
      default:
        ele.setAttribute(k, attrs[k]);

    } // switch
  }
  return ele;
}
// function div() {
//   const node = document.createElement("div");
//   function push(x) {
//     if (is_string(x))
//       node.appendChild(document.createTextNode(x));
//     else
//       node.appendChild(x);
//   }
//   for_each(arguments, function (x) {
//     if (is_func(x))
//       x(push);
//     else {
//       push(x);
//     }
//   });
//   return node;
// }

export function span(...args) {
  return element('span', ...args);
}

// function HTML() {
//   this.elements = [];
// } // html
//
// HTML.prototype.br = function br() {
//   this.elements.push(document.createElement("br"));
// }
//
// HTML.prototype.insert_into = function insert_into(target) {
//   this.elements.forEach(function (x) {
//     target.appendChild(x);
//   });
// }
//
// HTML.prototype.div = function div() {
//   const the_div = document.createElement("div");
//   const texts = arguments[0];
//   for (var i = 0, j = texts.length; i < j; i++) {
//     the_div.appendChild(document.createTextNode(texts[i]));
//     the_div.appendChild(document.createElement("br"));
//   }
//   this.elements.push(the_div);
//   return the_div;
// }
//
// //
// // ------------------------------------------------------------
// //
//
// function safe_uri(x) {
//   return {content: x, type: "Safe"};
// }
//
// let data = {
//   title: "hello",
//   stuff: [
//     "hi",
//     "yo",
//     "Good Morning!'\""
//   ],
//   uri: "google.com"
// };
//
// function for_each(args, body) {
//   for (var i = 0, j = args.length; i < j; i++) {
//     body(args[i]);
//   }
//   return args;
// }
//
// function is_func(x) {
//   return typeof x === "function";
// }
//
// function _href(x) {
//   return {is_href: true, content: "https://" + x};
// }
//
// function is_string(x) {
//   return typeof x === "string";
// }
//
// function new_fragment() {
//   let dom_fragment = document.createDocumentFragment();
//   function push(x) {
//     dom_fragment.appendChild(x);
//   }
//   for_each(arguments, function (x) {
//     if (is_func(x)) {
//       x(push);
//     } else {
//       dom_fragment.appendChild(x);
//     }
//   });
//
//   return dom_fragment;
// }
//
// function br() {
//   return document.createElement("br");
// }
//
// let nodes = new_fragment(function (p) {
//   p(br());
//   p(a(_href(data.uri)));
//   p(br());
//   p(a(_href(data.uri)));
//   p(
//
//     div(function(p){
//       p(span(data.title));
//       p(br());
//       p(span("good bye"));
//       p(br());
//       p("something else");
//     })
//
//   );
// });
//
// console.log(nodes);
// document.getElementById("the_body").appendChild(nodes);
//
/*
  *
  */
