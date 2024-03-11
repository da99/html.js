
// type Attributes = Partial<HTMLElement | HTMLAnchorElement | HTMLInputElement | HTMLLabelElement>;
type Attributes = Partial<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>;

const VALID_PROTO = /^(http|https|ssh|ftp|sftp|gopher):\/\//i;
const ObjectPrototype = Object.getPrototypeOf({});
const SPLIT_TAG_NAME = /([\.\#])([^\.\#]+)/g

// export function safe_uri(x: string) { return {content: x, type: "Safe"}; }
export function is_func(x: unknown) { return typeof x === "function"; }
export function is_plain_object(x: unknown) { return typeof x === 'object' && Object.getPrototypeOf(x) === ObjectPrototype; }

export function is_urlish(x: unknown) {
  if (typeof x !== 'string')
    return false;

  return VALID_PROTO.test(x.toLowerCase());
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

export function body(...eles: (string | Element)[]) {
  document.body.append(fragment(...eles));
  return document.body;
}

export function split_tag_name(new_class: string): Element {
  let e: Element | null = null;
  let curr = '';
  for (const s of new_class.split(SPLIT_TAG_NAME) ) {
    switch (s) {
      case '.':
      case '#':
        curr = s;
        break;
      case '':
        // ignore
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
      case 'htmlFor':
        ele.setAttribute('for', attrs[k]);
        break;
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
  pieces.forEach((x, _i) => {
    if (typeof x === "string")
      return e.appendChild(document.createTextNode(x));
    if (is_plain_object(x))
      return set_attrs(e, x);
    e.appendChild(x as Element);
  });
  return e;
} // export function

export function form_data(f: HTMLFormElement) {
  const raw_data = new FormData(f);
  const data = {};
  for (let [k,v] of raw_data.entries()) {
    if (data.hasOwnProperty(k)) {
      if(!Array.isArray(data[k]))
        data[k] = [data[k]];
      data[k].push(v);
    } else
      data[k] = v;
  }
  return data;
} // export function

function handle_form_fetch_error(error: any) {
  console.warn(`Form fetch error: ${error.message}`);
}

async function handle_form_response(resp: Response) {
  if (!resp.ok) {
    console.warn(`Form response error: ${resp.status} - ${resp.statusText}`);
    return false;
  }
  console.warn(`Form response: ${resp.status}`);
  const json = await resp.json();
  if (json.__target) {
    console.warn(`         body: ${json}`);
    document.getElementById(json.__target)?.dispatchEvent(new CustomEvent("formOK", {detail: json}));
  } else {
    console.warn(`Target not found: ${json}`);
  }
}

/*
  * This is also used for CSRF protection.
*/
export const X_SENT_FROM = "X-Sent-From";

function handle_form_post(ev: HTMLElementEventMap[keyof HTMLElementEventMap]) {
  ev.preventDefault();
  ev.stopPropagation();
  const e = ev.target as HTMLElement;
  const form = e.closest('form');
  if (!form) {
    console.warn('Form not found for: ' + e.tagName);
    return false;
  }

  const action = form.getAttribute('action');
  const headers = {
    "Content-Type": "application/json",
  };
  headers[X_SENT_FROM] = form.getAttribute('id') || "[NONE]";

  console.warn(headers);
  fetch(action, {
    method: "POST",
    referrerPolicy: "no-referrer",
    cache: "no-cache",
    headers: headers,
    body: JSON.stringify(form_data(form))
  })
  .then(handle_form_response)
  .catch(handle_form_fetch_error);

  return false;
}

export function form_post(b: Element) {
  b.addEventListener('click', handle_form_post);
  return b;
} // export function
