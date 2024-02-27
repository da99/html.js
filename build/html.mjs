// src/index.mts
function is_func(x) {
  return typeof x === "function";
}
function is_plain_object(x) {
  return typeof x === "object" && Object.getPrototypeOf(x) === ObjectPrototype;
}
function is_urlish(x) {
  if (typeof x !== "string")
    return false;
  return VALID_PROTO.test(x.toLowerCase());
}
function fragment(...eles) {
  let dom_fragment = document.createDocumentFragment();
  for (const x of eles) {
    if (typeof x === "string")
      dom_fragment.appendChild(document.createTextNode(x));
    else
      dom_fragment.appendChild(x);
  }
  return dom_fragment;
}
function body(...eles) {
  document.body.append(fragment(...eles));
  return document.body;
}
function split_tag_name(new_class) {
  let e = null;
  let curr = "";
  for (const s of new_class.split(SPLIT_TAG_NAME)) {
    switch (s) {
      case ".":
      case "#":
        curr = s;
        break;
      case "":
        break;
      default:
        switch (curr) {
          case ".":
            e?.classList.add(s);
            break;
          case "#":
            e?.setAttribute("id", s);
            break;
          default:
            e = document.createElement(s);
        }
    }
  }
  if (!e)
    throw `Invalid syntax for element creation: ${new_class}`;
  return e;
}
var set_attrs = function(ele, attrs) {
  for (const k in attrs) {
    switch (k) {
      case "href":
        try {
          ele.setAttribute(k, new URL(attrs["href"]).toString());
        } catch (e) {
          console.warn("Invalid url.");
        }
        break;
      default:
        ele.setAttribute(k, attrs[k]);
    }
  }
  return ele;
};
function element(tag_name, ...pieces) {
  const e = split_tag_name(tag_name);
  pieces.forEach((x, _i) => {
    if (typeof x === "string")
      return e.appendChild(document.createTextNode(x));
    if (is_plain_object(x))
      return set_attrs(e, x);
    e.appendChild(x);
  });
  return e;
}
var VALID_PROTO = /^(http|https|ssh|ftp|sftp|gopher):\/\//i;
var ObjectPrototype = Object.getPrototypeOf({});
var SPLIT_TAG_NAME = /([\.\#])([^\.\#]+)/g;
export {
  split_tag_name,
  is_urlish,
  is_plain_object,
  is_func,
  fragment,
  element,
  body
};
