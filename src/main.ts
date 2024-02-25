


type Attributes = Partial<HTMLElement | HTMLAnchorElement>;

const URLish = /^[a-z]:\/\//i;
const ObjectPrototype = Object.getPrototypeOf({});
const SPLIT_TAG_NAME = /([\.\#])([^\.\#]+)/g

// export function safe_uri(x: string) { return {content: x, type: "Safe"}; }
export function is_func(x: unknown) { return typeof x === "function"; }
export function is_plain_object(x: unknown) { return typeof x === 'object' && Object.getPrototypeOf(x) === ObjectPrototype; }

export function is_urlish(x: unknown) {
  if (typeof x !== 'string')
    return false;

  return URLish.test(x);
} // func

export function fragment(...eles: (string | Element)[]) {
  let dom_fragment = document.createDocumentFragment();
  for (const x of eles) {
    if (typeof x === 'string')
      dom_fragment.appendChild(document.createTextNode(x));
    else
      dom_fragment.appendChild(x);
  }

  return dom_fragment;
}

function split_tag_name(new_class: string): Element {
  let e: Element | null = null;
  let curr = '';
  for (const s of new_class.split(SPLIT_TAG_NAME) ) {
    switch (s) {
      case '.':
      case '#':
        curr = s
        break;
      default:
        switch (curr) {
        case '.':
          e?.classList.add(s);
          break;
        case '#':
          e?.setAttribute('id', s);
          break;
        default:
          e = document.createElement(s);
      }
    }
  }
 
  if (!e)
    throw `Invalid syntax for element creation: ${new_class}`;
  return e;
} // func

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

/*
  * e('input', {name: "_something"}, "My Text")
  * e('a.red#ID', {href: "https://some.url"}, "My Text")
  * e('div', e('span', "My Text"))
  * e('div#main', e('span', "My Text"))
  * e('div#main',
  *   e('span', "My Text"),
  *   e('div', "My Text")
  * )
*/
export function element(tag_name: string, ...pieces : (string | Element | Attributes)[]) {
  const e = split_tag_name(tag_name);
  pieces.forEach((x, i) => {
    if (typeof x === "string")
      return e.appendChild(document.createTextNode(x));
    if (is_plain_object(x))
      return set_attrs(e, x);
    e.appendChild(x as Element);
  });
  return e;
} // export function


