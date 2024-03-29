/**
 * RightJS, http://rightjs.org
 * Released under the MIT license
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
/**
 * The basic layout for RightJS builds
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var RightJS = (function(window, document, Object, Array, String, Function, Number, Math) {

/**
 * The framework description object
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var RightJS = function(value) {
  return value; // <- a dummy method to emulate the safe-mode
};

RightJS.version = "2.0.0";
RightJS.modules =["core", "dom", "form", "events", "xhr", "fx", "cookie"];



/**
 * There are some util methods
 *
 * Credits:
 *   Some of the functionality and names are inspired or copied from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */

/**
 * Some top-level variables to shortify the things
 */
var
PROTO = 'prototype', A_proto = Array[PROTO],
to_s = Object[PROTO].toString, slice = A_proto.slice,
dummy = function() { return function() {}; },
HTML = document.documentElement, UID = 1,  // !#server
Wrappers_Cache = [], UID_KEY = '_rjs_id',  // !#server

/**
 * extends the first object with the keys and values of the second one
 *
 * NOTE: the third optional argument tells if the existing values
 *       of the first object should _NOT_ get updated by the values of the second object
 *
 * @param oritinal Object destintation object
 * @param source Object source object
 * @param Boolean flag if the function should not overwrite intersecting values
 * @return Object extended destination object
 */
$ext = RightJS.$ext = function(dest, source, dont_overwrite) {
  var src = source || {}, key;

  for (key in src) {
    if (!dont_overwrite || !(key in dest)) {
      dest[key] = src[key];
    }
  }

  return dest;
},

/** !#server
 * evals the given javascript text in the context of the current window
 *
 * @param String javascript
 * @return void
 */
$eval = RightJS.$eval = function(text) {
  if (text) {
    if ('execScript' in window) {
      $(document).window()._.execScript(text);
    } else {
      $E('script', {text: text}).insertTo(HTML);
    }
  }
},

/**
 * throws an exception to break iterations throw a callback
 *
 * @return void
 * @throws Break
 */
$break = RightJS.$break = function() {
  throw new RightJS.Break();
},

/**
 * generates aliases for the object properties
 *
 * @param object Object object
 * @param names Object aliases hash
 * @return Object the extended objects
 */
$alias = RightJS.$alias = function(object, names) {
  for (var new_name in names) {
    object[new_name] = object[names[new_name]];
  }
  return object;
},

/**
 * checks if the given value or a reference points
 * to a really defined value
 *
 * NOTE: will return true for variables equal to null, false, 0, and so one.
 *
 * EXAMPLE:
 *
 *   var smth = null;
 *   defined(smth); <- will return true
 *
 *   var obj = {};
 *   defined(obj['smth']); <- will return false
 *
 * @param mixed value
 * @return boolean check result
 */
defined = RightJS.defined = function(value) {
  return typeof(value) !== 'undefined';
},


/**
 * checks if the given value is a function
 *
 * @param mixed value
 * @return boolean check result
 */
isFunction = RightJS.isFunction = function(value) {
  return typeof(value) === 'function';
},

/**
 * checks if the given value is a string
 *
 * @param mixed value
 * @return boolean check result
 */
isString = RightJS.isString = function(value) {
  return typeof(value) === 'string';
},


/**
 * checks if the given value is a number
 *
 * @param mixed value to check
 * @return boolean check result
 */
isNumber = RightJS.isNumber = function(value) {
  return typeof(value) === 'number';
},

/**
 * checks if the given value is a hash-like object
 *
 * @param mixed value
 * @return boolean check result
 */
isHash = RightJS.isHash = function(value) {
  return to_s.call(value) === '[object Object]';
},

/**
 * checks if the given value is an array
 *
 * @param mixed value to check
 * @return boolean check result
 */
isArray = RightJS.isArray = function(value) {
  return to_s.call(value) === '[object Array]';
},

/** !#server
 * checks if the given value is an element
 *
 * @param mixed value to check
 * @return boolean check result
 */
isElement = RightJS.isElement = function(value) {
  return value && value.tagName;
},

/** !#server
 * checks if the given value is a DOM-node
 *
 * @param mixed value to check
 * @return boolean check result
 */
isNode = RightJS.isNode = function(value) {
  return value && value.nodeType;
},

/** !#server
 * searches an element by id and/or extends it with the framework extentions
 *
 * @param String element id or Element to extend
 * @return Element or null
 */
$ = RightJS.$ = function(object) {
  if (typeof object === 'string') {
    object = document.getElementById(object);
  }

  if (object) {
    if (UID_KEY in object && object[UID_KEY] in Wrappers_Cache) {
      object = Wrappers_Cache[object[UID_KEY]];
    } else if (object.nodeType === 1) {
      object = new Element(object);
    } else if (isElement(object.target) || isElement(object.srcElement)) {
      object = new Event(object);
    } else if (object.nodeType === 9) {
      object = new Document(object);
    } else if (object.window == object) {
      object = new Window(object);
    }
  }

  return object;
},

/** !#server
 * Finds all the elements in the document by the given css_rule
 *
 * @param String element
 * @param Object optional context
 * @return Array search result
 */
$$ = RightJS.$$ = function(css_rule, context) {
  return $(context || document).find(css_rule);
},

/** !#server
 * shortcut to instance new elements
 *
 * @param String tag name
 * @param object options
 * @return Element instance
 */
$E = RightJS.$E = function(tag_name, options) {
  return new Element(tag_name, options);
},

/**
 * shortcut, generates an array of words from a given string
 *
 * @param String string
 * @return Array of words
 */
$w = RightJS.$w = function(string) {
  return string.trim().split(/\s+/);
},

/**
 * converts any iterables into an array
 *
 * @param Object iterable
 * @return Array list
 */
$A = RightJS.$A = function(it) {
  try {
    return slice.call(it);
  } catch(e) {
    for (var a=[], i=0, length = it.length; i < length; i++) {
      a[i] = it[i];
    }
    return a;
  }
},

/**
 * generates an unique id for an object
 *
 * @param Object object
 * @return Integer uniq id
 */
$uid = RightJS.$uid = function(item) {
  return UID_KEY in item ? item[UID_KEY] : (item[UID_KEY] = UID++);
};

/** !#server
 * Internet Explorer needs some additional mumbo-jumbo in here
 */
if (isHash(HTML)) {
  isHash = RightJS.isHash = function(value) {
    return to_s.call(value) === '[object Object]' &&
      value !== null && typeof(value) !== 'undefined' &&
      typeof(value.hasOwnProperty) !== 'undefined';
  };
}
/**
 * Generating methods for native units extending
 */
var i=0, natives = 'Array Function Number String Date RegExp'.split(' '),
include_native = function() {
  for (var i=0; i < arguments.length; i++) {
    if (isHash(arguments[i])) {
      $ext(this[PROTO],  arguments[i]);
      $ext(this.Methods, arguments[i]);
    }
  }
};

for (; i < natives.length; i++) {
  $ext(RightJS[natives[i]] = window[natives[i]], {
    Methods: {},
    include: include_native
  });
}

// referring those two as well
RightJS.Object = Object;
RightJS.Math   = Math;


/** #!server
 * A functions brutal hackery helper
 *
 * @param Function original function
 * @param RegExp expression
 * @param String replacement
 * @return freshly hacked function
 */
function patch_function(func, re, replacement) {
  return eval('['+ func.toString().replace(re, replacement) + ']')[0];
}

/**
 * Checks if the data is an array and if not,
 * then makes an array out of it
 *
 * @param mixed in data
 * @return Array data
 */
function ensure_array(data) {
  return isArray(data) ? data : [data];
}


/**
 * The Object class extentions
 *
 * Credits:
 *   Some functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
$ext(Object, {
  /**
   * extracts the list of the attribute names of the given object
   *
   * @param Object object
   * @return Array keys list
   */
  keys: function(object) {
    var keys = [], key;
    for (key in object) {
      keys.push(key);
    }
    return keys;
  },

  /**
   * extracts the list of the attribute values of the given object
   *
   * @param Object object
   * @return Array values list
   */
  values: function(object) {
    var values = [], key;
    for (key in object) {
      values.push(object[key]);
    }
    return values;
  },

  /**
   * Calls the function with every key/value pair on the hash
   *
   * @param in Object the data hash
   * @param Function the callback
   * @param scope Object an optional scope
   * @return Object the original hash
   */
  each: function(object, callback, scope) {
    for (var key in object) {
      callback.call(scope, key, object[key]);
    }

    return object;
  },

  /**
   * checks if the object-hash has no keys
   *
   * @param Object object
   * @return check result
   */
  empty: function(object) {
    for (var key in object) { return false; }
    return true;
  },

  /**
   * returns a copy of the object which contains
   * all the same keys/values except the key-names
   * passed the the method arguments
   *
   * @param Object object
   * @param String key-name to exclude
   * .....
   * @return Object filtered copy
   */
  without: function() {
    var filter = $A(arguments), object = filter.shift(), copy = {}, key;

    for (key in object) {
      if (!filter.includes(key)) {
        copy[key] = object[key];
      }
    }

    return copy;
  },

  /**
   * returns a copy of the object which contains all the
   * key/value pairs from the specified key-names list
   *
   * NOTE: if some key does not exists in the original object, it will be just skipped
   *
   * @param Object object
   * @param String key name to exclude
   * .....
   * @return Object filtered copy
   */
  only: function() {
    var filter = $A(arguments), object = filter.shift(), copy = {},
        i=0, length = filter.length;

    for (; i < length; i++) {
      if (filter[i] in object) {
        copy[filter[i]] = object[filter[i]];
      }
    }

    return copy;
  },

  /**
   * merges the given objects and returns the result
   *
   * NOTE this method _DO_NOT_ change the objects, it creates a new object
   *      which conatins all the given ones.
   *      if there is some keys introspections, the last object wins.
   *      all non-object arguments will be omitted
   *
   * @param first Object object
   * @param second Object mixing
   * ......
   * @return Object merged object
   */
  merge: function() {
    var object = {}, i=0, length = arguments.length;
    for (; i < length; i++) {
      if (isHash(arguments[i])) {
        $ext(object, arguments[i]);
      }
    }
    return object;
  },

  /**
   * converts a hash-object into an equivalent url query string
   *
   * @param Object object
   * @return String query
   */
  toQueryString: function(object) {
    var tokens = [], key, value, encode = encodeURIComponent;
    for (key in object) {
      value = ensure_array(object[key]);
      for (var i=0; i < value.length; i++) {
        tokens.push(encode(key) +'='+ encode(value[i]));
      }
    }
    return tokens.join('&');
  }
}, true);


/**
 * here are the starndard Math object extends
 *
 * Credits:
 *   The idea of random mehtod is taken from
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Math_old_random = Math.random;

/**
 * the standard random method replacement, to make it more useful
 *
 * USE:
 *   Math.random();    // original functionality, returns a float between 0 and 1
 *   Math.random(10);  // returns an integer between 0 and 10
 *   Math.random(1,4); // returns an integer between 1 and 4
 *
 * @param min Integer minimum value if there's two arguments and maximum value if there's only one
 * @param max Integer maximum value
 * @return Float random between 0 and 1 if there's no arguments or an integer in the given range
 */
Math.random = function(min, max) {

  if (arguments.length === 0) {
    return Math_old_random();
  } else if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  return ~~(Math_old_random() * (max-min+1) + ~~min);
};


/**
 * The Array class extentions
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var original_sort = A_proto.sort,

build_loop = function(pre, body, ret) {
  return eval('[function(c,s){'+
    'for(var '+pre+'i=0,l=this.length;i<l;i++){'+
      body.replace('_', 'c.call(s,this[i],i,this)') +
    '}' +
    ret +
  '}]')[0];
},

// JavaScript 1.6 methods recatching up or faking
for_each = A_proto.forEach || build_loop('', '_', ''),
filter   = A_proto.filter  || build_loop('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
reject   =                    build_loop('r=[],j=0,', 'if(!_)r[j++]=this[i]', 'return r'),
map      = A_proto.map     || build_loop('r=[],', 'r[i]=_', 'return r'),
some     = A_proto.some    || build_loop('', 'if(_)return true', 'return false'),
every    = A_proto.every   || build_loop('', 'if(!_)return false', 'return true'),
first    = build_loop('', 'if(_)return this[i]', 'return [][0]'),
last     = function(callback, scope) {
  for (var i=this.length-1; i > -1; i--) {
    if (callback.call(scope, this[i], i, this)) {
      return this[i];
    }
  }
  return null;
};


//
// RightJS callbacks magick preprocessing
//

// prepares a correct callback function
function guess_callback(argsi, array) {
  var callback = argsi[0], args = slice.call(argsi, 1), scope = array, attr;

  if (isString(callback)) {
    attr = callback;
    if (array.length && isFunction(array[0][attr])) {
      callback = function(object) { return object[attr].apply(object, args); };
    } else {
      callback = function(object) { return object[attr]; };
    }
  } else {
    scope = args[0];
  }

  return [callback, scope];
}

// calls the given method with preprocessing the arguments
function call_method(func, scope, args) {
  var result;

  try {
    result = func.apply(scope, guess_callback(args, scope));
  } catch(e) { if (!(e instanceof RightJS.Break)) { throw(e); } }

  return result;
}

// checks the value as a boolean
function boolean_check(i) {
  return !!i;
}

// default sorting callback
function default_sort(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}

Array.include({
  /**
   * IE fix
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: A_proto.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0, l = this.length; i < l; i++) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  },

  /**
   * IE fix
   * returns the last index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  lastIndexOf: A_proto.lastIndexOf || function(value) {
    for (var i=this.length-1; i > -1; i--) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  },

  /**
   * returns the first element of the array
   *
   * @return mixed first element of the array
   */
  first: function() {
    return arguments.length ? call_method(first, this, arguments) : this[0];
  },

  /**
   * returns the last element of the array
   *
   * @return mixed last element of the array
   */
  last: function() {
    return arguments.length ? call_method(last, this, arguments) : this[this.length-1];
  },

  /**
   * returns a random item of the array
   *
   * @return mixed a random item
   */
  random: function() {
    return this.length ? this[Math.random(this.length-1)] : null;
  },

  /**
   * returns the array size
   *
   * @return Integer the array size
   */
  size: function() {
    return this.length;
  },

  /**
   * cleans the array
   * @return Array this
   */
  clean: function() {
    this.length = 0;
    return this;
  },

  /**
   * checks if the array has no elements in it
   *
   * @return boolean check result
   */
  empty: function() {
    return !this.length;
  },

  /**
   * creates a copy of the given array
   *
   * @return Array copy of the array
   */
  clone: function() {
    return this.slice(0);
  },

  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  each: function() {
    call_method(for_each, this, arguments);
    return this;
  },
  forEach: for_each,

  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  map: function() {
    return call_method(map, this, arguments);
  },

  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  filter: function() {
    return call_method(filter, this, arguments);
  },

  /**
   * creates a list of the array items that are not matching the give callback function
   *
   * @param Function callback
   * @param Object optionl scope
   * @return Array filtered copy
   */
  reject: function() {
    return call_method(reject, this, arguments);
  },

  /**
   * checks if any of the array elements is logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return boolean check result
   */
  some: function(value) {
    return call_method(some, this, value ? arguments : [boolean_check]);
  },

  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  every: function(value) {
    return call_method(every, this, value ? arguments : [boolean_check]);
  },

  /**
   * applies the given lambda to each element in the array
   *
   * NOTE: changes the array by itself
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array this
   */
  walk: function() {
    this.map.apply(this, arguments).forEach(function(value, i) { this[i] = value; }, this);
    return this;
  },

  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   *
   * @param Array to merge
   * ....................
   * @return Array new merged
   */
  merge: function() {
    for (var copy = this.clone(), arg, i=0, j, length = arguments.length; i < length; i++) {
      arg = arguments[i];
      arg = ensure_array(arg);

      for (j=0; j < arg.length; j++) {
        if (copy.indexOf(arg[j]) == -1) {
          copy.push(arg[j]);
        }
      }
    }
    return copy;
  },

  /**
   * flats out complex array into a single dimension array
   *
   * @return Array flatten copy
   */
  flatten: function() {
    var copy = [];
    this.forEach(function(value) {
      if (isArray(value)) {
        copy = copy.concat(value.flatten());
      } else {
        copy.push(value);
      }
    });
    return copy;
  },

  /**
   * returns a copy of the array whithout any null or undefined values
   *
   * @return Array filtered version
   */
  compact: function() {
    return this.without(null, undefined);
  },

  /**
   * returns a copy of the array which contains only the unique values
   *
   * @return Array filtered copy
   */
  uniq: function() {
    return [].merge(this);
  },

  /**
   * checks if all of the given values
   * exists in the given array
   *
   * @param mixed value
   * ....
   * @return boolean check result
   */
  includes: function() {
    for (var i=0, length = arguments.length; i < length; i++) {
      if (this.indexOf(arguments[i]) == -1) {
        return false;
      }
    }
    return true;
  },

  /**
   * returns a copy of the array without the items passed as the arguments
   *
   * @param mixed value
   * ......
   * @return Array filtered copy
   */
  without: function() {
    var filter = $A(arguments);
    return this.filter(function(value) {
      return !filter.includes(value);
    });
  },

  /**
   * Shuffles the array items in a random order
   *
   * @return Array shuffled version
   */
  shuffle: function() {
    var shuff = this.clone(), j, x, i = shuff.length;

    for (; i > 0; j = Math.random(i-1), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x) {}

    return shuff;
  },

  /**
   * Default sort fix for numeric values
   *
   * @param Function callback
   * @return Array self
   */
  sort: function(callback) {
    return original_sort.apply(this, (callback || !isNumber(this[0])) ? arguments : [default_sort]);
  },

  /**
   * sorts the array by running its items though a lambda or calling their attributes
   *
   * @param Function callback or attribute name
   * @param Object scope or attribute argument
   * @return Array sorted copy
   */
  sortBy: function() {
    var pair = guess_callback(arguments, this);

    return this.sort(function(a, b) {
      return default_sort(
        pair[0].call(pair[1], a),
        pair[0].call(pair[1], b)
      );
    });
  },

  /**
   * Returns the minimal value on the list
   *
   * @return Number minimal value
   */
  min: function() {
    return Math.min.apply(Math, this);
  },

  /**
   * Returns the maximal value
   *
   * @return Number maximal value
   */
  max: function() {
    return Math.max.apply(Math, this);
  },

  /**
   * Returns a summ of all the items on the list
   *
   * @return Number a summ of values on the list
   */
  sum: function() {
    for(var i=0,l=this.length,sum=0; i < l; sum += this[i++]) {}
    return sum;
  }
});

$alias(A_proto, {
  include: 'includes'
});


/**
 * The String class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The trim function taken from work of Steven Levithan
 *     - http://blog.stevenlevithan.com/archives/faster-trim-javascript
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
String.include({
  /**
   * checks if the string is an empty string
   *
   * @return boolean check result
   */
  empty: function() {
    return this == '';
  },

  /**
   * checks if the string contains only white-spaces
   *
   * @return boolean check result
   */
  blank: function() {
    return (/^\s*$/).test(this);
  },

  /**
   * removes trailing whitespaces
   *
   * @return String trimmed version
   */
  trim: String[PROTO].trim || function() {
    var str = this.replace(/^\s\s*/, ''), i = str.length;
    while ((/\s/).test(str.charAt(--i))) {}
    return str.slice(0, i + 1);
  },

  /**
   * returns a copy of the string with all the tags removed
   * @return String without tags
   */
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/ig, '');
  },

  /**
   * removes all the scripts declarations out of the string
   * @param mixed option. If it equals true the scrips will be executed,
   *                      if a function the scripts will be passed in it
   * @return String without scripts
   */
  stripScripts: function(option) {
    var scripts = '', text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/img, function(match, source) {
      scripts += source + "\n";
      return '';
    });

    if (option === true) {
      $eval(scripts);
    } else if (isFunction(option)) {
      option(scripts, text);
    }

    return text;
  },

  /**
   * extracts all the scripts out of the string
   *
   * @return String the extracted stcripts
   */
  extractScripts: function() {
    var scripts = '';
    this.stripScripts(function(s) { scripts = s; });
    return scripts;
  },

  /**
   * evals all the scripts in the string
   *
   * @return String self (unchanged version with scripts still in their place)
   */
  evalScripts: function() {
    this.stripScripts(true);
    return this;
  },

  /**
   * converts underscored or dasherized string to a camelized one
   * @returns String camelized version
   */
  camelize: function() {
    return this.replace(/(\-|_)+(.)?/g, function(match, dash, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },

  /**
   * converts a camelized or dasherized string into an underscored one
   * @return String underscored version
   */
  underscored: function() {
    return this.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-/g, '_').toLowerCase();
  },

  /**
   * returns a capitalised version of the string
   *
   * @return String captialised version
   */
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },

  /**
   * checks if the string contains the given substring
   *
   * @param String string
   * @return boolean check result
   */
  includes: function(string) {
    return this.indexOf(string) != -1;
  },

  /**
   * checks if the string starts with the given substring
   *
   * @param String string
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  startsWith: function(string, ignorecase) {
    var start_str = this.substr(0, string.length);
    return ignorecase ? start_str.toLowerCase() === string.toLowerCase() :
      start_str === string;
  },

  /**
   * checks if the string ends with the given substring
   *
   * @param String substring
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  endsWith: function(string, ignorecase) {
    var end_str = this.substring(this.length - string.length);
    return ignorecase ? end_str.toLowerCase() === string.toLowerCase() :
      end_str === string;
  },

  /**
   * converts the string to an integer value
   * @param Integer base
   * @return Integer or NaN
   */
  toInt: function(base) {
    return parseInt(this, base || 10);
  },

  /**
   * converts the string to a float value
   * @param boolean flat if the method should not use a flexible matching
   * @return Float or NaN
   */
  toFloat: function(strict) {
    return parseFloat(strict ? this : this.replace(',', '.').replace(/(\d)-(\d)/g, '$1.$2'));
  }

});

$alias(String[PROTO], {include: 'includes'});


/**
 * The Function class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Function.include({
  /**
   * binds the function to be executed in the given scope
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * ....
   * @return Function binded function
   */
  bind: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function() {
      return func.apply(scope, (args.length || arguments.length) ? args.concat($A(arguments)) : args);
    };
  },

  /**
   * binds the function as an event listener to the given scope object
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * .......
   * @return Function binded function
   */
  bindAsEventListener: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function(event) {
      return func.apply(scope, [event].concat(args).concat($A(arguments)));
    };
  },

  /**
   * allows you to put some curry in your cookery
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  curry: function() {
    return this.bind.apply(this, [this].concat($A(arguments)));
  },

  /**
   * The right side curry feature
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  rcurry: function() {
    var curry = $A(arguments), func = this;
    return function() {
      return func.apply(func, $A(arguments).concat(curry));
    };
  },

  /**
   * delays the function execution
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * .....
   * @return Integer timeout marker
   */
  delay: function() {
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setTimeout(this.bind.apply(this, [this].concat(args)), timeout));

    timer.cancel = function() { clearTimeout(this); };

    return timer;
  },

  /**
   * creates a periodical execution of the function with the given timeout
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * ...
   * @return Ineger interval marker
   */
  periodical: function() {
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setInterval(this.bind.apply(this, [this].concat(args)), timeout));

    timer.stop = function() { clearInterval(this); };

    return timer;
  },

  /**
   * Chains the given function after the current one
   *
   * @param Function the next function
   * @param mixed optional value to curry
   * ......
   * @return Function chained function
   */
  chain: function() {
    var args = $A(arguments), func = args.shift(), current = this;
    return function() {
      var result = current.apply(current, arguments);
      func.apply(func, args);
      return result;
    };
  }
});


/**
 * The Number class extentions
 *
 * Credits:
 *   Some methods inspired by
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Number.include({
  /**
   * executes the given callback the given number of times
   *
   * @param Function callback
   * @param Object optional callback execution scope
   * @return void
   */
  times: function(callback, scope) {
    for (var i=0; i < this; i++) {
      callback.call(scope, i);
    }
    return this;
  },

  upto: function(number, callback, scope) {
    for (var i=this+0; i <= number; i++) {
      callback.call(scope, i);
    }
    return this;
  },

  downto: function(number, callback, scope) {
    for (var i=this+0; i >= number; i--) {
      callback.call(scope, i);
    }
    return this;
  },

  abs: function() {
    return Math.abs(this);
  },

  round: function(size) {
    return size ? parseFloat(this.toFixed(size)) : Math.round(this);
  },

  ceil: function() {
    return Math.ceil(this);
  },

  floor: function() {
    return Math.floor(this);
  },

  min: function(value) {
    return this < value ? value : this + 0;
  },

  max: function(value) {
    return this > value ? value : this + 0;
  }
});


/**
 * The Regexp class extentions
 *
 * Credits:
 *   Inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */


 /**
  * Escapes the string for safely use as a regular expression
  *
  * @param String raw string
  * @return String escaped string
  */
RegExp.escape = function(string) {
  return (''+string).replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
};


/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Class = RightJS.Class = function() {
  var args = $A(arguments), properties = args.pop() || {},
    parent = args.pop();

  // basic class object definition
  function klass() {
    if ('prebind' in this && isArray(this.prebind)) {
      this.prebind.each(function(method) {
        this[method] = this[method].bind(this);
      }, this);
    }

    return this.initialize ? this.initialize.apply(this, arguments) : this;
  }

  // if only the parent class has been specified
  if (!args.length && !isHash(properties)) {
    parent = properties; properties = {};
  }

  // attaching main class-level methods
  $ext(klass, Class_Methods).inherit(parent);

  // catching the injections
  Class_attachInjections(klass, properties);

  return klass.include(properties);
},

/**
 * Class utility methods
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
commons = $w('selfExtended self_extended selfIncluded self_included'),
extend  = commons.concat($w(PROTO+' parent extend include')),
include = commons.concat(['constructor']),
clean_module = function (module, ext) {
  return Object.without.apply(Object, [module].concat(ext ? extend : include));
},

Class_Methods = {
  /**
   * Makes the class get inherited from another one
   *
   * @param Object another class
   * @return Class this
   */
  inherit: function(parent) {
    // handling the parent class assign
    if (parent && parent[PROTO]) {
      var s_klass = dummy();
      s_klass[PROTO] = parent[PROTO];
      this[PROTO] = new s_klass();
      this.parent = parent;
    }

    // collecting the list of ancestors
    this.ancestors = [];
    while (parent) {
      this.ancestors.push(parent);
      parent = parent.parent;
    }

    return (this[PROTO].constructor = this);
  },

  /**
   * this method will extend the class-level with the given objects
   *
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   *
   * NOTE: this method _WILL_NOT_OVERWRITE_ the class prototype and
   *       the class 'name' and 'parent' attributes. If one of those
   *       exists in one of the received modeuls, the attribute will be
   *       skipped
   *
   * @param Object module to extend
   * ....
   * @return Class the klass
   */
  extend: function() {
    $A(arguments).filter(isHash).each(function(module) {
      var callback = module.selfExtended || module.self_extended;

      $ext(this, clean_module(module, true));

      if (callback) {
        callback.call(module, this);
      }
    }, this);

    return this;
  },

  /**
   * extends the class prototype with the given objects
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   * NOTE: this method _WILL_NOT_OVERWRITE_ the 'klass' attribute of the klass.prototype
   *
   * @param Object module to include
   * ....
   * @return Class the klass
   */
  include: function() {
    var ancestors = (this.ancestors || []).map(PROTO);

    $A(arguments).filter(isHash).each(function(module) {
      var callback = module.selfIncluded || module.self_included;

      Object.each(clean_module(module, false), function(key, method) {
        var ancestor = ancestors.first(function(proto) { return key in proto && isFunction(proto[key]); });

        this[PROTO][key] = !ancestor ? method : function() {
          this.$super = ancestor[key];
          return method.apply(this, arguments);
        };
      }, this);

      if (callback) {
        callback.call(module, this);
      }
    }, this);

    return this;
  }
};

/**
 * Processess the functionality injection properties
 *
 * @param Function klass
 * @param Object properties
 * @return void
 */
function Class_attachInjections(klass, properties) {
  ['extend', 'include'].each(function(name) {
    var modules = properties[name];
    if (isHash(modules) || isArray(modules)) {
      klass[name].apply(klass, ensure_array(modules));
      delete(properties[name]);
    }
  });
}

/**
 * This method gets through a list of the object its class and all the ancestors
 * and finds a hash named after property, used for configuration purposes with
 * the Observer and Options modules
 *
 * NOTE: this method will look for capitalized and uppercased versions of the
 *       property name
 *
 * @param Object a class instance
 * @param String property name
 * @return Object hash or null if nothing found
 */
function Class_findSet(object, property) {
  var upcased = property.toUpperCase(), capcased = property.capitalize(),
    constructor = object.constructor,
    candidates = [object, constructor].concat('ancestors' in constructor ? constructor.ancestors : []),
    holder = candidates.first(function(o) { return o && (upcased in o || capcased in o); });

  return holder ? holder[upcased] || holder[capcased] : null;
}


/**
 * This is a simple mix-in module to be included in other classes
 *
 * Basically it privdes the <tt>setOptions</tt> method which processes
 * an instance options assigment and merging with the default options
 *
 * Credits:
 *   The idea of the module is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Options = RightJS.Options = {
  /**
   * assigns the options by merging them with the default ones
   *
   * @param Object options
   * @return Object current instance
   */
  setOptions: function(opts) {
    var options = this.options = Object.merge(Class_findSet(this, 'options'), opts), match, key;

    // hooking up the observer options
    if (isFunction(this.on)) {
      for (key in options) {
        if ((match = key.match(/on([A-Z][A-Za-z]+)/))) {
          this.on(match[1].toLowerCase(), options[key]);
          delete(options[key]);
        }
      }
    }

    return this;
  },

  /**
   * Cuts of an options hash from the end of the arguments list
   * assigns them using the #setOptions method and then
   * returns the list of other arguments as an Array instance
   *
   * @param mixed iterable
   * @return Array of the arguments
   */
  cutOptions: function(in_args) {
    var args = $A(in_args);
    this.setOptions(isHash(args.last()) ? args.pop() : {});
    return args;
  }
};


/**
 * standard Observer class.
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Credits:
 *   The naming principle is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Observer = RightJS.Observer = new Class({
  include: Options,

  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.setOptions(options);
    Observer_createShortcuts(this, Class_findSet(this, 'events'));
    return this;
  },

  /**
   * binds an event listener
   *
   * USAGE:
   *  on(String event, Function callback[, arguments, ...]);
   *  on(String event, String method_name[, arguments, ...]);
   *  on(Object events_hash);
   *
   * @return Observer self
   */
  on: function() {
    var args = $A(arguments), event = args.shift(), name;

    if (isString(event)) {
      if (!('$listeners' in this)) { this.$listeners = []; }

      var callback = args.shift();
      switch (typeof callback) {
        case "string":
          name     = callback;
          callback = this[callback];

        case "function":
          var hash = {};

          // DON'T move it in the one-line hash variable definition,
          // it causes problems with the Konqueror 3 later on
          hash.e = event;
          hash.f = callback;
          hash.a = args;
          hash.r = name;

          this.$listeners.push(hash);
          break;

        default:
          if (isArray(callback)) {
            for (var i=0; i < callback.length; i++) {
              this.on.apply(this, [event].concat(
                ensure_array(callback[i])
              ).concat(args));
            }
          }
      }

    } else {
      // assuming it's a hash of key-value pairs
      for (name in event) {
        this.on.apply(this, [name].concat(
          ensure_array(event[name])
        ).concat(args));
      }
    }



    return this;
  },

  /**
   * checks if the observer observes given event and/or callback
   *
   * USAGE:
   *   observes(String event)
   *   observes(Function callback)
   *   observes(String event, Function callback)
   *
   * @retun boolean check result
   */
  observes: function(event, callback) {
    if (!isString(event)) { callback = event; event = null; }
    if (isString(callback)) { callback = this[callback]; }

    return (this.$listeners || []).some(function(i) {
      return (event && callback) ? i.e === event && i.f === callback :
        event ? i.e === event : i.f === callback;
    });
  },

  /**
   * stops observing an event or/and function
   *
   * USAGE:
   *   stopObserving(String event)
   *   stopObserving(Function callback)
   *   stopObserving(String event, Function callback)
   *
   * @return Observer self
   */
  stopObserving: function(event, callback) {
    if (isHash(event)) {
      for (var key in event) {
        this.stopObserving(key, event[key]);
      }
    } else {
      if (!isString(event)) {  callback = event; event = null; }
      if (isString(callback)){ callback = this[callback]; }

      this.$listeners = (this.$listeners || []).filter(function(i) {
        return (event && callback) ? (i.e !== event || i.f !== callback) :
          (event ? i.e !== event : i.f !== callback);
      }, this);
    }

    return this;
  },

  /**
   * returns the listeners list for the event
   *
   * NOTE: if no event was specified the method will return _all_
   *       event listeners for _all_ the events
   *
   * @param String event name
   * @return Array of listeners
   */
  listeners: function(event) {
    return (this.$listeners || []).filter(function(i) {
      return !event || i.e === event;
    }).map(function(i) { return i.f; }).uniq();
  },

  /**
   * initiates the event handling
   *
   * @param String event name
   * @param mixed optional argument
   * ........
   * @return Observer self
   */
  fire: function() {
    var args = $A(arguments), event = args.shift();

    (this.$listeners || []).each(function(i) {
      if (i.e === event) {
        i.f.apply(this, i.a.concat(args));
      }
    }, this);

    return this;
  }
}),

/**
 * adds an observer functionality to any object
 *
 * @param Object object
 * @param Array optional events list to build shortcuts
 * @return Object extended object
 */
Observer_create = Observer.create =  function(object, events) {
  $ext(object, Object.without(Observer[PROTO], 'initialize', 'setOptions'), true);
  return Observer_createShortcuts(object, events || Class_findSet(object, 'events'));
},

/**
 * builds shortcut methods to wire/fire events on the object
 *
 * @param Object object to extend
 * @param Array list of event names
 * @return Object extended object
 */
Observer_createShortcuts = Observer.createShortcuts = function(object, names) {
  (names || []).each(function(name) {
    var method_name = 'on'+name.replace(/(^|_|:)([a-z])/g, function(match, pre, chr) { return chr.toUpperCase(); });
    if (!(method_name in object)) {
      object[method_name] = function() {
        return this.on.apply(this, [name].concat($A(arguments)));
      };
    }
  });

  return object;
};


/**
 * iterators in-callbacks break exception
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
var Break = RightJS.Break = new Class(Error, {
  message: "Manual break"
});


/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var agent = navigator.userAgent, looks_like_ie = 'attachEvent' in window, looks_like_opera = 'opera' in window,

Browser = RightJS.Browser = {
  IE:           looks_like_ie && !looks_like_opera,
  Opera:        looks_like_opera,
  WebKit:       agent.include('AppleWebKit/'),
  Gecko:        agent.include('Gecko') && !agent.include('KHTML'),
  MobileSafari: /Apple.*Mobile.*Safari/.test(agent),
  Konqueror:    agent.include('Konqueror'),

  // marker for the browsers which don't give access to the HTMLElement unit
  OLD:          looks_like_ie && !looks_like_opera && !document.querySelector
};


/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

var Wrapper = RightJS.Wrapper = function(parent, methods) {

  // creating the actual wrapper class
  var Klass = function(object, options) {
    this.initialize(object, options);

    var instance = this, unit = instance._, uid;

    // dynamically typecasting in case if the user is creating
    // an element of a subtype via the basic Element constructor
    if (this.constructor === Element && unit.tagName in Element_wrappers) {
      instance = new Element_wrappers[unit.tagName](unit);
      if ('$listeners' in this) {
        instance.$listeners = this.$listeners;
      }
    }

    uid  = UID_KEY in unit ? unit[UID_KEY] : (unit[UID_KEY] = UID++);

    return (Wrappers_Cache[uid] = instance);
  };

  // finding the parent
  if (!methods) {
    methods = parent;
    parent  = null;
  }

  // hooking up the extedning tools and methods
  $ext(Klass, Class_Methods).inherit(parent || Wrapper);

  // checking for the injections
  Class_attachInjections(Klass, methods);

  // including the basic tools
  return Klass.include({_: undefined}, methods);
};

// exposing the cache so it could be manupulated externally
Wrapper.Cache = Wrappers_Cache;


/**
 * A simple document wrapper
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Document = RightJS.Document = new Wrapper({
  initialize: function(document) {
    this._ = document;
  },

  // returns the window reference
  window: function() {
    return $(this._.defaultView || this._.parentWindow);
  }
});


/**
 * the window object extensions
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Window = RightJS.Window = new Wrapper({
  /**
   * Basic constructor
   *
   * @param Window dom-window reference
   * @return void
   */
  initialize: function(window) {
    this._ = window;
    this.d = window.document;
  },

  /**
   * Generic API reference
   *
   * @return Window this
   */
  window: function() {
    return this;
  },

  /**
   * returns the inner-size of the window
   *
   * @return Object x: d+, y: d+
   */
  size: function() {
    var win = this._, html = this.d.documentElement;
    return win.innerWidth ? {x: win.innerWidth, y: win.innerHeight} :
      {x: html.clientWidth, y: html.clientHeight};
  },

  /**
   * returns the scrolls for the window
   *
   * @return Object x: d+, y: d+
   */
  scrolls: function() {
    var win = this._, doc = this.d, body = doc.body, html = doc.documentElement;

    return (win.pageXOffset || win.pageYOffset) ? {x: win.pageXOffset, y: win.pageYOffset} :
      (body && (body.scrollLeft || body.scrollTop)) ? {x: body.scrollLeft, y: body.scrollTop} :
      {x: html.scrollLeft, y: html.scrollTop};
  },

  /**
   * overloading the native scrollTo method to support hashes and element references
   *
   * @param mixed number left position, a hash position, element or a string element id
   * @param number top position
   * @param Object fx options
   * @return window self
   */
  scrollTo: function(left, top, fx_options) {
    var left_pos = left, top_pos = top, element = $(left); // moving the values into new vars so they didn't get screwed later on

    if(element && element instanceof Element) {
      left = element.position();
    }

    if (isHash(left)) {
      top_pos  = left.y;
      left_pos = left.x;
    }

    // checking if a smooth scroll was requested
    if (isHash(fx_options = fx_options || top) && RightJS.Fx) {
      new Fx.Scroll(this, fx_options).start({x: left_pos, y: top_pos});
    } else {
      this._.scrollTo(left_pos, top_pos);
    }

    return this;
  }
});


/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Credits:
 *   The additional method names are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Event = RightJS.Event = new Wrapper({
  // predefining the keys to spped up the assignments
  type:          null,

  which:         null,
  keyCode:       null,

  target:        null,
  currentTarget: null,
  relatedTarget: null,

  pageX:         null,
  pageY:         null,

  /**
   * the class constructor
   *
   * @param raw dom-event
   * @param HTMLElement the bound element
   * @return void
   */
  initialize: function(event, bound_element) {
    if (typeof event === 'string') {
      event = Object.merge({type: event}, bound_element);
      this.stopped = event.bubbles === false;

      if (isHash(bound_element)) {
        $ext(this, bound_element);
      }
    }

    this._             = event;
    this.type          = event.type;

    this.which         = event.which;
    this.keyCode       = event.keyCode;

    this.target        = $(event.target);
    this.currentTarget = $(event.currentTarget);
    this.relatedTarget = $(event.relatedTarget);

    this.pageX         = event.pageX;
    this.pageY         = event.pageY;

    if (!('target' in event) && 'srcElement' in event) {
      // grabbin the IE properties
      this.which = event.button == 2 ? 3 : event.button == 4 ? 2 : 1;

      // faking the target property
      this.target = $(event.srcElement) || bound_element;

      // faking the relatedTarget, currentTarget and other targets
      this.relatedTarget = this.target._ === event.fromElement ? $(event.toElement) : this.target;
      this.currentTarget = bound_element;

      // faking the mouse position
      var scrolls = this.target.window().scrolls();

      this.pageX = event.clientX + scrolls.x;
      this.pageY = event.clientY + scrolls.y;
    } else if (event.target && 'nodeType' in event.target && event.target.nodeType === 3) {
      // Safari fix
      this.target = $(event.target.parentNode);
    }
  },

  /**
   * Stops the event bubbling process
   *
   * @return RightJS.Event this
   */
  stopPropagation: function() {
    if ('stopPropagation' in this._) {
      this._.stopPropagation();
    } else {
      this._.cancelBubble = true;
    }
    this.stopped = true;
    return this;
  },

  /**
   * Prevents the default browser action on the event
   *
   * @return RightJS.Event this
   */
  preventDefault: function() {
    if ('preventDefault' in this._) {
      this._.preventDefault();
    } else {
      this._.returnValue = false;
    }
    return this;
  },

  /**
   * Fully stops the event
   *
   * @return RightJS.Event this
   */
  stop: function() {
    return this.stopPropagation().preventDefault();
  },

  /**
   * Returns the event position
   *
   * @return Object {x: ..., y: ...}
   */
  position: function() {
    return {x: this.pageX, y: this.pageY};
  },

  /**
   * Finds the element between the event target
   * and the boundary element that matches the
   * css-rule
   *
   * @param String css-rule
   * @return Element element or null
   */
  find: function(css_rule) {
    if (this.target instanceof Element) {
      var target   = this.target,
          targets  = [target].concat(target.parents()),
          search   = this.currentTarget.find(css_rule);

      return targets.first(function(element) {
        return search.include(element);
      });
    } else {
      return undefined;
    }
  }
}),

Event_delegation_shortcuts = [];


/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */

// Element constructor options mapper
var element_arguments_map = {
  id:      'id',
  html:    'innerHTML',
  'class': 'className'
},

element_methods_map = {
  style:   'setStyle',
  on:      'on'
},

Element_wrappers = {},

// caching the element instances to boos the things up
elements_cache = {},

/**
 * The elements constructor
 *
 * NOTE: this function is called in a context of a dom-wrapper
 *
 * @param String element tag name
 * @param Object options
 * @return HTMLElement
 */
element_constructor = function(element, options) {
  // building the element
  this._ = element = (element in elements_cache ? elements_cache[element] :
    (elements_cache[element] = document.createElement(element))
  ).cloneNode(false);

  // applying the options
  if (options !== undefined) {
    for (var key in options) {
      if (key in element_arguments_map) {
        element[element_arguments_map[key]] = options[key];
      } else if (key in element_methods_map) {
        this[element_methods_map[key]](options[key]);
      } else {
        this.set(key, options[key]);
      }
    }
  }
};

//
// IE 6,7,8 (not 9!) browsers have a bug with checkbox and radio input elements
// it doesn't place the 'checked' property correctly, so we kinda hacking
// the Element constructor a bit for them
//
try {
  document.createElement('<input/>'); // <- works for IE < 9 only
  element_constructor = patch_function(element_constructor, /(\((\w+),\s*(\w+)\)\s*\{)/,
    '$1if($2==="input"&&$3)$2="<input name="+$3.name+" type="+$3.type+($3.checked?" checked":"")+"/>";'
  );
} catch (e) {}

/**
 * The actual elements wrapper
 *
 */
var Element = RightJS.Element = new Wrapper({
  /**
   * constructor
   *
   * NOTE: this constructor will dynamically typecast
   *       the wrappers depending on the element tag-name
   *
   * @param String element tag name or an HTMLElement instance
   * @param Object options
   * @return Element element
   */
  initialize: function(element, options) {
    if (typeof element === 'string') {
      this.construct(element, options);
    } else {
      this._ = element;
    }
  },

// protected

  // constructs the event
  construct: element_constructor
});

Element.Wrappers = Element_wrappers;


/**
 * The DOM Element unit structures handling module
 *
 * NOTE: all the methods will process and return only the Element nodes
 *       all the textual nodes will be skipped
 *
 * NOTE: if a css-rule was specified then the result of the method
 *       will be filtered/adjusted depends on the rule
 *
 * Credits:
 *   The naming principle and most of the names are taken from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The insertions system implementation is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */

Element.include({
  parent: function(css_rule) {
    return css_rule ? this.parents(css_rule)[0] : $(this._.parentNode || null); // <- IE6 need that || null
  },

  parents: function(css_rule) {
    return recursively_collect(this, 'parentNode', css_rule);
  },

  children: function(css_rule) {
    return this.find(css_rule).filter(function(element) {
      return element._.parentNode === this._;
    }, this);
  },

  siblings: function(css_rule) {
    return this.prevSiblings(css_rule).reverse().concat(this.nextSiblings(css_rule));
  },

  nextSiblings: function(css_rule) {
    return recursively_collect(this, 'nextSibling', css_rule);
  },

  prevSiblings: function(css_rule) {
    return recursively_collect(this, 'previousSibling', css_rule);
  },

  next: function(css_rule) {
    return this.nextSiblings(css_rule)[0];
  },

  prev: function(css_rule) {
    return this.prevSiblings(css_rule)[0];
  },

  /**
   * removes the elemnt out of this parent node
   *
   * @return Element self
   */
  remove: function() {
    var element = this._, parent = element.parentNode;
    if (parent) {
      parent.removeChild(element);
    }
    return this;
  },

  /**
   * handles the elements insertion functionality
   *
   * The content might be one of the following data
   *
   *  o) an element instance
   *  o) a String, which will be converted into content to insert (all the scripts will be parsed out and executed)
   *  o) a list of Elements
   *  o) a hash like {position: content}
   *
   * @param mixed data to insert
   * @param String position to insert  top/bottom/before/after/instead
   * @return Element self
   */
  insert: function(content, position) {
    var scripts = null, element = this._;
    position = (position||'bottom').toLowerCase();

    if (typeof(content) !== 'object') {
      scripts = content = (''+content);
    } else if (content && content instanceof Element) {
      content = content._;
    }

    Element_insertions[position](element, content.tagName ? content :
      Element_createFragment.call(
        (position === 'bottom' || position === 'top') ?
          element : element.parentNode, content
      )
    );

    if (scripts !== null) { scripts.evalScripts(); }

    return this;
  },

  /**
   * Inserts the element inside the given one at the given position
   *
   * @param mixed destination element reference
   * @param String optional position
   * @return Element this
   */
  insertTo: function(element, position) {
    $(element).insert(this, position);
    return this;
  },

  /**
   * A shortcut to uppend several units into the element
   *
   * @param mixed data
   * ..................
   * @return Element this
   */
  append: function(first) {
    return this.insert(isString(first) ? $A(arguments).join('') : arguments);
  },

  /**
   * updates the content of the element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  update: function(content) {
    if (typeof(content) !== 'object') {
      content = '' + content;

      try {
        this._.innerHTML = content;
      } catch(e) {
        return this.clean().insert(content);
      }

      content.evalScripts();

      return this;
    } else {
      return this.clean().insert(content);
    }
  },

  /**
   * Works with the Element's innerHTML property
   * This method works both ways! if a content is provided
   * then it will be assigned, otherwise will return
   * the innerHTML property
   *
   * @param String html content
   * @return String html content or Element this
   */
  html: function(content) {
    return content === undefined ? this._.innerHTML : this.update(content);
  },

  /**
   * replaces the current element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  replace: function(content) {
    return this.insert(content, 'instead');
  },

  /**
   * wraps the element with the given element
   *
   * @param Element wrapper
   * @return Element self
   */
  wrap: function(wrapper) {
    var element = this._, parent = element.parentNode;
    if (parent) {
      wrapper = $(wrapper)._;
      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element);
    }
    return this;
  },

  /**
   * removes all the child nodes out of the element
   *
   * @return Element self
   */
  clean: function() {
    while (this._.firstChild) {
      this._.removeChild(this._.firstChild);
    }

    return this;
  },

  /**
   * checks if the element has no child nodes
   *
   * @return boolean check result
   */
  empty: function() {
    return this.html().blank();
  },

  /**
   * Creates a clean clone of the element without any events attached to it
   *
   * @return Element new clone
   */
  clone: function() {
    var clone = this._.cloneNode(true);
    // we need manually reassing the UID_KEY because IE will clone it too
    clone[UID_KEY] = UID++;
    return new Element(clone);
  }
});

/**
 * Recursively collects the target element's related nodes
 *
 * @param Element context
 * @param name String pointer attribute name
 * @param rule String optional css-atom rule
 * @return Array found elements
 */
function recursively_collect(where, attr, css_rule) {
  var node = where._, result = [];

  while ((node = node[attr])) {
    if (node.tagName && (!css_rule || $(node).match(css_rule))) {
      result.push($(node));
    }
  }

  return result;
}

// list of insertions handling functions
// NOTE: each of the methods will be called in the contects of the current element
var Element_insertions = {
  bottom: function(target, content) {
    target.appendChild(content);
  },

  top: function(target, content) {
    if (target.firstChild !== null) {
      target.insertBefore(content, target.firstChild);
    } else {
      target.appendChild(content);
    }
  },

  after: function(target, content) {
    var parent = target.parentNode, sibling = target.nextSibling;
    if (sibling !== null) {
      parent.insertBefore(content, sibling);
    } else {
      parent.appendChild(content);
    }
  },

  before: function(target, content) {
    target.parentNode.insertBefore(content, target);
  },

  instead: function(target, content) {
    target.parentNode.replaceChild(content, target);
  }
},

// the element insertion wrappers list
Element_wraps = {
  TBODY:  ['<TABLE>',            '</TABLE>',                           2],
  TR:     ['<TABLE><TBODY>',     '</TBODY></TABLE>',                   3],
  TD:     ['<TABLE><TBODY><TR>', '</TR></TBODY></TABLE>',              4],
  COL:    ['<TABLE><COLGROUP>',  '</COLGROUP><TBODY></TBODY></TABLE>', 2],
  LEGEND: ['<FIELDSET>',         '</FIELDSET>',                        2],
  AREA:   ['<map>',              '</map>',                             2],
  OPTION: ['<SELECT>',           '</SELECT>',                          2]
};

$alias(Element_wraps, {
  OPTGROUP: 'OPTION',
  THEAD:    'TBODY',
  TFOOT:    'TBODY',
  TH:       'TD'
});

// converts any data into a html fragment unit
var fragment = document.createDocumentFragment(),
    tmp_cont = document.createElement('DIV');

function Element_createFragment(content) {
  if (typeof(content) === 'string') {
    var tag   = this.tagName,
        tmp   = tmp_cont,
        wrap  = Element_wraps[tag] || ['', '', 1],
        depth = wrap[2];

    tmp.innerHTML = wrap[0] + '<'+ tag + '>' + content + '</'+ tag + '>' + wrap[1];

    while (depth-- > 0) {
      tmp = tmp.firstChild;
    }

    content = tmp.childNodes;
  }

  for (var i=0, length = content.length, node; i < length; i++) {
    // in case of NodeList unit, the elements will be removed out of the list during the appends
    // therefore if that's an array we use the 'i' variable, and if it's a collection of nodes
    // then we always hit the first element of the stack
    node = content[content.length === length ? i : 0];
    fragment.appendChild(node instanceof Element ? node._ : node);
  }

  return fragment;
}


/**
 * this module contains the element unit styles related methods
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Dojo      (www.dojotoolkit.org)      Copyright (C) The Dojo Foundation
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * assigns styles out of the hash to the element
   *
   * NOTE: the style keys might be camelized or dasherized, both cases should work
   *
   * @param Object styles list or String style name
   * @param String style value in case of the first param a string style name
   * @return Element self
   */
  setStyle: function(hash, value) {
    var key, c_key, style = {}, element_style = this._.style;

    if (value) { style[hash] = value; hash = style; }
    else if(isString(hash)) {
      hash.split(';').each(function(option) {
        var els = option.split(':').map('trim');
        if (els[0] && els[1]) {
          style[els[0]] = els[1];
        }
      });
      hash = style;
    }


    for (key in hash) {
      c_key = key.indexOf('-') < 0 ? key : key.camelize();

      if (key === 'opacity') {
        if (Browser.IE) {
          element_style.filter = 'alpha(opacity='+ hash[key] * 100 +')';
        } else {
          element_style.opacity = hash[key];
        }
      } else if (key === 'float') {
        c_key = Browser.IE ? 'styleFloat' : 'cssFloat';
      }

      element_style[c_key] = hash[key];
    }

    return this;
  },

  /**
   * returns style of the element
   *
   * NOTE: will include the CSS level definitions
   *
   * @param String style key
   * @return String style value or null if not set
   */
  getStyle: function(key) {
    return clean_style(this._.style, key) || clean_style(this.computedStyles(), key);
  },

  /**
   * returns the hash of computed styles for the element
   *
   * @return Object/CSSDefinition computed styles
   */
  computedStyles: function() {
    var element = this._;
    //     old IE,                 IE8,                    W3C
    return element.currentStyle || element.runtimeStyle || element.ownerDocument.defaultView.getComputedStyle(element, null) || {};
  },

  /**
   * checks if the element has the given class name
   *
   * @param String class name
   * @return boolean check result
   */
  hasClass: function(name) {
    return (' '+this._.className+' ').indexOf(' '+name+' ') != -1;
  },

  /**
   * sets the whole class-name string for the element
   *
   * @param String class-name
   * @return Element self
   */
  setClass: function(class_name) {
    this._.className = class_name;
    return this;
  },

  /**
   * adds the given class name to the element
   *
   * @param String class name
   * @return Element self
   */
  addClass: function(name) {
    var testee = ' '+this._.className+' ';
    if (testee.indexOf(' '+name+' ') == -1) {
      this._.className += (testee === '  ' ? '' : ' ') + name;
    }
    return this;
  },

  /**
   * removes the given class name
   *
   * @param String class name
   * @return Element self
   */
  removeClass: function(name) {
    this._.className = (' '+this._.className+' ').replace(' '+name+' ', ' ').trim();
    return this;
  },

  /**
   * toggles the given class name on the element
   *
   * @param String class name
   * @return Element self
   */
   toggleClass: function(name) {
     return this[this.hasClass(name) ? 'removeClass' : 'addClass'](name);
   },

   /**
    * adds the given class-name to the element
    * and removes it from all the element siblings
    *
    * @param String class name
    * @return Element self
    */
   radioClass: function(name) {
     this.siblings().each('removeClass', name);
     return this.addClass(name);
   }
});

/**
 * cleans up a style value
 *
 * @param Object styles hash
 * @param String style-key
 * @return String clean style
 */
function clean_style(style, in_key) {
  var value, key = in_key.camelize();

  switch (key) {
    case 'opacity':
      value = !Browser.IE ? style[key].replace(',', '.') :
        ((/opacity=(\d+)/i.exec(style.filter || '') || ['', '100'])[1].toInt() / 100)+'';
      break;

    case 'float':
      key = Browser.IE ? 'styleFloat' : 'cssFloat';

    default:
      value = style[key];

      // Opera returns named colors with quotes
      if (Browser.Opera && /color/i.test(key) && value) {
        value = value.replace(/"/g, '');
      }
  }

  return value || null;
}


/**
 * Common DOM Element unit methods
 *
 * Credits:
 *   Most of the naming system in the module inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * sets the element attributes
   *
   * @param String attr name or Object attributes hash
   * @param mixed attribute value
   * @return Element self
   */
  set: function(hash, value) {
    if (typeof(hash) === 'string') { var val = {}; val[hash] = value; hash = val; }

    var key, element = this._;

    for (key in hash) {
      // some attributes are not available as properties
      if (!(key in element)) {
        element.setAttribute(key, ''+hash[key]);
      }
      element[key] = hash[key];
    }

    return this;
  },

  /**
   * returns the attribute value for the name
   *
   * @param String attr name
   * @return mixed value
   */
  get: function(name) {
    var element = this._, value = element[name] || element.getAttribute(name);
    return value === '' ? null : value;
  },

  /**
   * checks if the element has that attribute
   *
   * @param String attr name
   * @return Boolean check result
   */
  has: function(name) {
    return this.get(name) !== null;
  },

  /**
   * erases the given attribute of the element
   *
   * @param String attr name
   * @return Element self
   */
  erase: function(name) {
    this._.removeAttribute(name);
    return this;
  },

  /**
   * checks if the elemnt is hidden
   *
   * NOTE: will check css level computed styles too
   *
   * @return boolean check result
   */
  hidden: function() {
    return this.getStyle('display') === 'none';
  },

  /**
   * checks if the element is visible
   *
   * @return boolean check result
   */
  visible: function() {
    return !this.hidden();
  },

  /**
   * hides the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  hide: function(effect, options) {
    if (this.visible()) {
      this._d = this.getStyle('display');
      this._.style.display = 'none';
    }

    return this;
  },

  /**
   * shows the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  show: function(effect, options) {
    if (this.hidden()) {
      // setting 'block' for the divs and 'inline' for the other elements hidden on the css-level
      var element = this._, value = element.tagName == 'DIV' ? 'block' : 'inline';

      element.style.display = this._d == 'none' ? value : this._d || value;
    }

    return this;
  },

  /**
   * toggles the visibility state of the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  toggle: function(effect, options) {
    return this[this.visible() ? 'hide' : 'show'](effect, options);
  },

  /**
   * shows the element and hides all the sibligns
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  radio: function(effect, options) {
    this.siblings().each('hide', effect, options);
    return this.show();
  }
});


/**
 * this module contains the Element's part of functionality
 * responsible for the dimensions and positions getting/setting
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
Element.include({
  /**
   * Returns the reference to this element document
   *
   * @return RightJS.Document
   */
  document: function() {
    return $(this._.ownerDocument);
  },

  /**
   * Returns the reference to this elements window
   *
   * @return RightJS.Window
   */
  window: function() {
    return this.document().window();
  },

  /**
   * Returns the element size as a hash
   *
   * @return Object {x: NNN, y: NNN}
   */
  size: function() {
    return { x: this._.offsetWidth, y: this._.offsetHeight };
  },

  /**
   * Returns the element absolute position
   *
   * NOTE: see the konq.js file for the manual version of the method
   *
   * @return Object {x: NNN, y: NNN}
   */
  position: function() {
    var rect    = this._.getBoundingClientRect(),
        html    = this.document()._.documentElement,
        scrolls = this.window().scrolls();

    return {
      x: rect.left + scrolls.x - html.clientLeft,
      y: rect.top  + scrolls.y - html.clientTop
    };
  },

  /**
   * Returns the element scrolls
   *
   * @return Object {x: NNN, y: NNN}
   */
  scrolls: function() {
    return { x: this._.scrollLeft, y: this._.scrollTop };
  },

  /**
   * returns the element dimensions hash
   *
   * @return Object dimensions (top, left, width, height, scrollLeft, scrollTop)
   */
  dimensions: function() {
    var size     = this.size(),
        scrolls  = this.scrolls(),
        position = this.position();

    return {
      top:        position.y,
      left:       position.x,
      width:      size.x,
      height:     size.y,
      scrollLeft: scrolls.x,
      scrollTop:  scrolls.y
    };
  },

  /**
   * Checks if the element overlaps the given position
   *
   * @param Object position {x: NNN, y: NNN}
   * @return boolean check result
   */
  overlaps: function(target) {
    var pos = this.position(), size = this.size();

    return target.x > pos.x && target.x < (pos.x + size.x) &&
           target.y > pos.y && target.y < (pos.y + size.y);
  },

  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels
   * @return Element self
   */
  setWidth: function(width_px) {
    var style = this._.style;
    style.width = width_px + 'px';
    style.width = (2 * width_px - this._.offsetWidth) + 'px';
    return this;
  },

  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer height in pixels
   * @return Element self
   */
  setHeight: function(height_px) {
    var style = this._.style;
    style.height = height_px + 'px';
    style.height = (2 * height_px - this._.offsetHeight) + 'px';
    return this;
  },

  /**
   * sets the size of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param width Integer width in pixels or {x: 10, y: 20} like object
   * @param height Integer height
   * @return Element self
   */
  resize: function(width, height) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    return this.setWidth(width).setHeight(height);
  },

  /**
   * sets the element position (against the window corner)
   *
   * @param left Number left position in pixels or an object like {x: 10, y: 20}
   * @param top Number top position in pixels
   * @return Element self
   */
  moveTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }

    return this.setStyle({
      left: left + 'px',
      top:  top  + 'px'
    });
  },

  /**
   * sets the scroll position
   *
   * @param left Integer left scroll px or an object like {x: 22, y: 33}
   * @param top Integer top scroll px
   * @return Element self
   */
  scrollTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }

    this._.scrollLeft = left;
    this._.scrollTop  = top;

    return this;
  },

  /**
   * makes the window be scrolled to the element
   *
   * @param Object fx options
   * @return Element self
   */
  scrollThere: function(options) {
    this.window().scrollTo(this, options);
    return this;
  }
});


/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Element_observer = Observer_create({});

//
// HACK HACK HACK
//
// I'm kinda patching the observer methods manually in here
// the reason is in building flat and fast functions
//
function hack_observer(name, re, text) {
  Element_observer[name] = patch_function(Element_observer[name], re, text);
}

hack_observer('on',
  /(\$listeners\.push\((\w+?)\);)/,

  // aliasing the 'rightclick' to the 'contextmenu' event
  '$1$2.e=$2.n=$2.e==="rightclick"?"contextmenu":$2.e;'+

  // swapping a browser related event names
  (Browser.Gecko      ? 'if($2.n==="mousewheel")$2.n="DOMMouseScroll";' : '') +
  (Browser.Konqueror  ? 'if($2.n==="contextmenu")$2.n="rightclick";'    : '') +

  '$2.w=function(){'+
    'var a=$A(arguments),_;'+
    '$2.r&&$2.r!=="stopEvent"?a.shift():_=a[0]=new RightJS.Event(a[0],this);'+
    '$2.f.apply($2.t,a.concat($2.a))===false&&_.stop()'+
  '};$2.t=this;' + (
    looks_like_ie ?
      '$2.w=$2.w.bind(this);this._.attachEvent("on"+$2.n,$2.w);' :
      'this._.addEventListener($2.n,$2.w,false);'
  )
);

hack_observer('stopObserving',
  /(function\s*\((\w+)\)\s*\{\s*)(return\s*)([^}]+)/m,
  '$1var r=$4;'+
  'if(!r)' + (looks_like_ie ?
    'this._.detachEvent("on"+$2.n,$2.w);' :
    'this._.removeEventListener($2.n,$2.w,false);'
  )+'$3 r'
);

// adding the event generator
hack_observer('fire',
  /(\w+)(\s*=\s*(\w+).shift\(\))/,
  '$1$2;$1=$1 instanceof RightJS.Event?$1:'+
  'new RightJS.Event($1,Object.merge({target:this._},$3[0]))'+
  ';$1.currentTarget=this'
);

// addjusting the arguments list
hack_observer('fire',
  /((\w+)\.e\s*===\s*(\w+))([^}]+\2\.f\.apply)[^}]+?\.concat\(\w+\)\)/,
  '$1.type$4(this,(($2.r&&$1.r!=="stopEvent")?[]:[$3]).concat($2.a))'
);

// a simple events terminator method to be hooked like this.onClick('stopEvent');
Element_observer.stopEvent = function(e) { e.stop(); };

// loading the observer interface into the Element object
Element.include(Element_observer);
Document.include(Element_observer);
Window.include(Element_observer);

// couple more shortcuts for the window
Observer_createShortcuts(Window[PROTO], $w('blur focus scroll resize load'));

/**
 * Registers a list of event-binding shortcuts like
 *  $(element).onClick
 *  $(element).onMouseover
 *
 * @param String space separated event names
 * @return void
 */
function Element_add_event_shortcuts(tokens) {
  tokens = $w(tokens);
  Event_delegation_shortcuts = Event_delegation_shortcuts.concat(tokens);

  Observer_createShortcuts(Element[PROTO], tokens);
  Observer_createShortcuts(Document[PROTO], tokens);
}

Element_add_event_shortcuts(
  'click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup'
);


/**
 * The DOM elements selection handling
 *
 * NOTE: this module is just a wrap over the native CSS-selectors feature
 *       see the olds/css.js file for the manual selector code
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */

/**
 * Native css-selectors include the current element into the search context
 * and as we actually search only inside of the element we add it's tag
 * as a scope for the search
 */
function stub_rule(css_rule, tag) {
  var rule = css_rule || '*', element = tag._,
    tag_name = 'tagName' in element ? element.tagName : null;

  return tag_name === null ? rule : rule.replace(/(^|,)/g, '$1'+ tag_name + ' ');
}

[Element, Document].each('include', {
  /**
   * Extracts the first element matching the css-rule,
   * or just any first element if no css-rule was specified
   *
   * @param String css-rule
   * @return Element matching node or null
   */
  first: function(css_rule) {
    return $(this._.querySelector(stub_rule(css_rule, this)));
  },

  /**
   * Finds a list of matching nodes, or all the descendant nodes if no css-rule provided
   *
   * @param String css-rule
   * @return Array of elements
   */
  find: function(css_rule) {
    return $A(this._.querySelectorAll(stub_rule(css_rule, this))).map($);
  }
});

Element.include({
  /**
   * checks if the element matches this css-rule
   *
   * NOTE: the element should be attached to the page
   *
   * @param String css-rule
   * @return Boolean check result
   */
  match: function(css_rule) {
    var result, parent = this._.tagName === 'HTML' ? this._.ownerDocument : this.parents().last();

    // if it's a single node putting it into the context
    result = $(parent || $E('p').insert(this)).find(css_rule).include(this);

    if (!parent) { this.remove(); }

    return result;
  }
});


/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
[Window, Document].each(function(object) {
  var proto = object[PROTO], old_on = proto.on;

  // redefining the observer method to catch up
  proto.on = function(name) {
    if (name == 'ready' && !this._wR) {
      var document = this._, ready = this.fire.bind(this, 'ready');
      document = document.nodeType == 9 ? document : document.document;

      // IE and Konqueror browsers
      if ('readyState' in document) {
        (function() {
          if (['loaded','complete'].includes(document.readyState)) {
            ready();
          } else {
            arguments.callee.delay(50);
          }
        })();
      } else {
        document.addEventListener('DOMContentLoaded', ready, false);
      }

      this._wR = true;
    }
    return old_on.apply(this, arguments);
  };

  Observer_createShortcuts(proto, ['ready']);
});

/**
 * Deprecated method names aliases
 *
 * In RightJS 2 some methods were renamed so those are the aliases
 * to support the old API
 *
 * NOTE: Will be nuked in couple of releases!
 */
$alias(Element[PROTO], {
  subNodes: 'children',
  sizes:    'size',
  select:   'find'
});

$alias(Document[PROTO], {
  select:   'find'
});

$alias(Window[PROTO], {
  sizes: 'size'
});


/**
 * The form unit class and extensions
 *
 * Credits:
 *   The basic principles of the module are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */

var Form = RightJS.Form = Element_wrappers.FORM = new Wrapper(Element, {
  /**
   * constructor
   *
   * NOTE: this constructor can be called as a normal Element constructor
   *       or with the options only, which will make a FORM element
   *
   *   var form = new Form(raw_form_object_element);
   *   var form = new Form({method: 'post', action: '/boo/hoo'});
   *
   * @param Object options or HTMLFormElement object
   * @return void
   */
  initialize: function(in_options) {
    var options = in_options || {}, remote = 'remote' in options, element = options;

    if (isHash(options)) {
      element = 'form';
      options = Object.without(options, 'remote');
    }

    this.$super(element, options);

    if (remote) {
      this.remotize();
    }
  },

  /**
   * returns the form elements as an array of extended units
   *
   * @return Array of elements
   */
  elements: function() {
    return this.find('input,button,select,textarea');
  },

  /**
   * returns the list of all the input elements on the form
   *
   * @return Array of elements
   */
  inputs: function() {
    return this.elements().filter(function(input) {
      return !['submit', 'button', 'reset', 'image', null].includes(input._.type);
    });
  },

  /**
   * Accessing an input by name
   *
   * @param String name
   * @return Input field
   */
  input: function(name) {
    return $(this._[name]);
  },

  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    var element = this.inputs().first(function(input) {
      return input._.type !== 'hidden';
    });

    if (element) { element.focus(); }

    return this;
  },

  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this.elements().each('blur');
    return this;
  },

  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this.elements().each('disable');
    return this;
  },

  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this.elements().each('enable');
    return this;
  },

  /**
   * returns the list of the form values
   *
   * @return Object values
   */
  values: function() {
    var values = {}, value, name, element, input;

    this.inputs().each(function(element) {
      input = element._;
      name  = input.name;
      if (!input.disabled && name && (!['checkbox', 'radio'].includes(input.type) || input.checked)) {
        value = element.getValue();
        if (name.endsWith('[]')) {
          value = (values[name] || []).concat([value]);
        }

        values[name] = value;
      }
    });

    return values;
  },

  /**
   * returns the key/values organized ready to be sent via a get request
   *
   * @return String serialized values
   */
  serialize: function() {
    return Object.toQueryString(this.values());
  },

  /**
   * Delegating the submit method
   *
   * @return Form this
   */
  submit: function() {
    this._.submit();
    return this;
  },

  /**
   * Delegating the 'reset' method
   *
   * @return Form this
   */
  reset: function() {
    this._.reset();
    return this;
  }
});

// creating the event shortcuts
Element_add_event_shortcuts('submit reset focus blur disable enable change');

// deprecated alias
$alias(Form[PROTO], {
  getElements: 'elements'
});


/**
 * The form input element class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var old_insert = Element[PROTO].insert,

Input = RightJS.Input =

// retgistering the typecasted wrappers
Element_wrappers.INPUT    =
Element_wrappers.BUTTON   =
Element_wrappers.SELECT   =
Element_wrappers.TEXTAREA =
Element_wrappers.OPTGROUP =

new Wrapper(Element, {
  /**
   * Constructor
   *
   * NOTE: this constructor can be called in several ways
   *
   *  Like normal Element
   *   var input = new Input('texarea', {...});
   *   var input = new Input(document.createElement('select'));
   *
   *  Or with options only which will make an INPUT element by default
   *    var input = new Input({type: 'password', name: 'password'});
   *
   * @param HTMLElement or a String tag name or Options for default 'input' tag
   * @param Object options
   * @return void
   */
  initialize: function(element, options) {
    // type to tag name conversion
    if (!element || isHash(element)) {
      options = element || {};

      if (/textarea|select/.test(options.type || '')) {
        element = options.type;
        delete(options.type);
      } else {
        element = 'input';
      }
    }

    this.$super(element, options);
  },

  /**
   * Returns a reference to the input's form
   *
   * @return Form wrapped form
   */
  form: function() {
    return $(this._.form);
  },

  /**
   * SELECT element has a bug in FF that screws the selected options
   *
   * @param mixed content
   * @param String optional position
   * @return Input this
   */
  insert: function(content, position) {
    old_insert.call(this, content, position);

    // FF doesn't marks selected options correctly with a textual content
    if (this._.tagName === 'SELECT' && isString(content)) {
      $A(this._.getElementsByTagName('option')).each(function(option) {
        option.selected = !!option.getAttribute('selected');
      });
    }

    return this;
  },

  /**
   * Overloading the method so it always called the '#insert' method
   *
   * @param mixed content
   * @return Input this
   */
  update: function(content) {
    return this.clean().insert(content);
  },

  /**
   * uniform access to the element values
   *
   * @return String element value
   */
  getValue: function() {
    if (this._.type == 'select-multiple') {
      return $A(this._.getElementsByTagName('option')).map(function(option) {
        return option.selected ? option.value : null;
      }).compact();
    } else {
      return this._.value;
    }
  },

  /**
   * uniform accesss to set the element value
   *
   * @param String value
   * @return Element this
   */
  setValue: function(value) {
    if (this._.type == 'select-multiple') {
      value = ensure_array(value).map(String);
      $A(this._.getElementsByTagName('option')).each(function(option) {
        option.selected = value.includes(option.value);
      });
    } else {
      this._.value = value;
    }
    return this;
  },

  /**
   * Both ways getter/setter for the value parameter
   *
   * @param mixed value
   * @return mixed this or the value
   */
  value: function(value) {
    return this[value === undefined ? 'getValue' : 'setValue'](value);
  },

  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    this._.focus();
    this.focused = true;
    if (Browser.IE) { this.fire('focus', {bubbles: false}); }
    return this;
  },

  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this._.blur();
    this.focused = false;
    if (Browser.IE) { this.fire('blur', {bubbles: false}); }
    return this;
  },

  /**
   * focuses on the element and selects its content
   *
   * @return Element this
   */
  select: function() {
    this._.select();
    return this.focus();
  },

  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this._.disabled = true;
    return this.fire('disable');
  },

  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this._.disabled = false;
    return this.fire('enable');
  },

  /**
   * A bidirectional method to set/get the disabled status of the input field
   *
   * @param boolean optional value
   * @return Input in setter mode boolean in getter
   */
  disabled: function(value) {
    return value === undefined ? this._.disabled : this[value ? 'disable' : 'enable']();
  },

  /**
   * A bidirectional method to set/get the checked status of the input field
   *
   * @param boolean optional value
   * @return Input in setter mode boolean in getter
   */
  checked: function(value) {
    if (value === undefined) {
      value = this._.checked;
    } else {
      this._.checked = value;
      value = this;
    }

    return value;
  }
});


/**
 * This module provides the artificial events bubbling feature
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

// patching the Element's 'fire' method again
// to make it to bypass the event to its parent
Element[PROTO].fire = patch_function(
  Element_observer.fire,
  /(\w+)(\s*=\s*\w+\.shift[\s\S]+)(return this)/m,
  '$1$2var p=!$1.stopped&&this.parent&&this.parent();p&&p.fire&&p.fire($1);$3'
);

/**
 * Triggers a manual focus/blur events bubbling
 *
 * @param raw dom-event
 * @return void
 */
function focus_boobler(raw_event) {
  var event  = new Event(raw_event),
      target = event.target,
      parent = target.parent && target.parent();

  event.type = (raw_event.type === 'focusin' || raw_event.type === 'focus') ? 'focus' : 'blur';

  if (parent) { parent.fire(event); }
}

/**
 * Hooking up the 'focus' and 'blur' events
 * at the document level and then rebooble them
 * manually like they were normal events
 *
 */
if (Browser.IE) {
  document.attachEvent('onfocusin',  focus_boobler);
  document.attachEvent('onfocusout', focus_boobler);
} else {
  document.addEventListener('focus', focus_boobler, true);
  document.addEventListener('blur',  focus_boobler, true);
}

/**
 * Tests if there is the event support
 *
 * @param String event name
 * @retrun Boolean check result
 */
function event_support_for(name, tag) {
  var e = document.createElement(tag);
  e.setAttribute(name, ';');
  return isFunction(e[name]);
}

if (!event_support_for('onsubmit', 'form')) {
  /**
   * Emulates the 'submit' event bubbling for IE browsers
   *
   * @param raw dom-event
   * @return void
   */
  var submit_boobler = function(raw_event) {
    var event = $(raw_event), element = event.target._,
        type = element.type, form = element.form, parent;

    if (form && (parent = $(form).parent()) && (
      (raw_event.keyCode === 13   && (type === 'text'   || type === 'password')) ||
      (raw_event.type === 'click' && (type === 'submit' || type === 'image'))
    )) {
      event.type   = 'submit';
      event.target = $(form);
      parent.fire(event);
    }
  };

  document.attachEvent('onclick',    submit_boobler);
  document.attachEvent('onkeypress', submit_boobler);
}

if (!event_support_for('onchange', 'input')) {

  var get_input_value = function(target) {
    var element = target._,
        type    = element.type;

    return type === 'radio' || type === 'checkbox' ?
      element.checked : target.getValue();
  },

  /**
   * Emulates the 'change' event bubbling
   *
   * @param Event wrapped dom-event
   * @param Input wrapped input element
   * @return void
   */
  change_boobler = function(event, target) {
    var parent  = target.parent(),
        value   = get_input_value(target);

    if (parent && ''+target._prev_value !== ''+value) {
      target._prev_value = value; // saving the value so it didn't fire up again
      event.type = 'change';
      parent.fire(event);
    }
  },

  /**
   * Catches the input field changes
   *
   * @param raw dom-event
   * @return void
   */
  catch_inputs_access = function(raw_event) {
    var event  = $(raw_event),
        target = event.target,
        type   = target._.type,
        tag    = target._.tagName,
        input_is_radio = (type === 'radio' || type === 'checkbox');

    if (
      (event.type === 'click' && (input_is_radio || tag === 'SELECT')) ||
      (event.type === 'keydown' && (
        (event.keyCode == 13 && (tag !== 'TEXTAREA')) ||
        type === 'select-multiple'
      ))
    ) {
      change_boobler(event, target);
    }
  },

  /**
   * Catch inputs blur
   *
   * @param raw dom-event
   * @return void
   */
  catch_input_left = function(raw_event) {
    var event  = $(raw_event),
        target = event.target;

    if (target instanceof Input) {
      change_boobler(event, target);
    }
  };

  document.attachEvent('onclick',    catch_inputs_access);
  document.attachEvent('onkeydown',  catch_inputs_access);
  document.attachEvent('onfocusout', catch_input_left);

  /**
   * storing the input element previous value, so we could figure out
   * if it was changed later on
   */
  document.attachEvent('onbeforeactivate', function(event) {
    var element = $(event).target;

    if (element instanceof Input) {
      element._prev_value = get_input_value(element);
    }
  });
}


/**
 * This module the standard events delegation interface
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
[Element, Document].each('include', {
  /**
   * Attaches a delegative event listener to the element/document
   *
   * USAGE:
   *    $(element).delegate('click', '#css.rule', function() {...});
   *    $(element).delegate('click', '#css.rule', [func1, func2, ...]);
   *    $(element).delegate('click', '#css.rule', 'addClass', 'boo');
   *    $(element).delegate('click', '#css.rule', 'hide');
   *
   *    $(element).delegate('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * @param event name
   * @param css-rule a hash or rules
   * @param callback
   * @return this
   */
  delegate: function(event) {
    var rules = delegation_rules(arguments), css_rule, i, j, list;
    for (css_rule in rules) {
      for (i=0, list = rules[css_rule]; i < list.length; i++) {
        // registering the delegative listener
        this.on(event, build_delegative_listener(css_rule, list[i], this));

        // adding the css-rule and callback references to the store
        $ext(this.$listeners.last(), { dr: css_rule, dc: list[i][0] });
      }
    }

    return this;
  },

  /**
   * Removes a delegative event listener from the element
   *
   * USAGE:
   *    $(element).undelegate('click');
   *    $(element).undelegate('click', '#css.rule');
   *    $(element).undelegate('click', '#css.rule', function() {});
   *    $(element).undelegate('click', '#css.rule', [func1, func2, ...]);
   *    $(element).undelegate('click', '#css.rule', 'addClass', 'boo');
   *    $(element).undelegate('click', '#css.rule', 'hide');
   *
   *    $(element).undelegate('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * @param event name
   * @param css-rule or a hash or rules
   * @param callback
   * @return this
   */
  undelegate: function(event) {
    delegation_listeners(arguments, this).each(function(h) {
      this.stopObserving(h.n, h.f);
    }, this);

    return this;
  },

  /**
   * Checks if there is sucha delegative event listener
   *
   * USAGE:
   *    $(element).delegates('click');
   *    $(element).delegates('click', '#css.rule');
   *    $(element).delegates('click', '#css.rule', function() {});
   *    $(element).delegates('click', '#css.rule', [func1, func2, ...]);
   *    $(element).delegates('click', '#css.rule', 'addClass', 'boo');
   *    $(element).delegates('click', '#css.rule', 'hide');
   *
   *    $(element).delegates('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * NOTE:
   *    if several rules are specified then it will check if
   *    _any_ of them are delegateed
   *
   * @param event name
   * @param css-rule or a hash of rules
   * @param callback
   * @return boolean check result
   */
  delegates: function() {
    return !!delegation_listeners(arguments, this).length;
  }
});

function build_delegative_listener(css_rule, entry, scope) {
  return function(event) {
    var target = event.target, args = $A(entry), callback = args.shift();
    if (scope.find(css_rule).includes(target)) {
      if (isFunction(callback)) {
        callback.apply(target, [event].concat(args));
      } else {
        target[callback].apply(target, args);
      }
    }
  };
}

/**
 * Converts the events-delegation api arguments
 * into a systematic hash of rules
 *
 * @param Arguments arguments
 * @return Object hash of rules
 */
function delegation_rules(raw_args) {
  var args = $A(raw_args), rules = args[1] || {}, hash = {}, css_rule;

  if (isString(rules)) {
    hash[rules] = args.slice(2);
    if (isArray(hash[rules][0])) {
      hash[rules] = hash[rules][0].map(ensure_array);
    }
  } else {
    hash = rules;
  }

  // converting everything into a hash of lists of callbacks
  for (css_rule in hash) {
    hash[css_rule] = ensure_array(hash[css_rule]);
    hash[css_rule] = isArray(hash[css_rule][0]) ? hash[css_rule] : [hash[css_rule]];
  }

  return hash;
}

/**
 * Returns the list of delegative listeners that match the conditions
 *
 * @param Arguments raw-arguments
 * @param Element the element
 * @return Array list of matching listeners
 */
function delegation_listeners(args, object) {
  var event = args[0], i, list,
     rules = delegation_rules(args),
     rules_are_empty = !Object.keys(rules).length;

  return (object.$listeners || []).filter(function(hash) {
    return hash.dr && hash.n === event && (
      rules_are_empty || (function() {
        for (var css_rule in rules) {
          if (hash.dr === css_rule) {
            for (i=0, list = rules[css_rule]; i < list.length; i++) {
              if (!list[i].length || list[i][0] === hash.dc) {
                return true;
              }
            }
          }
        }

        return false;
      })()
    );
  });
}


/**
 * Some nice shortcuts for the document-level events delegation handling
 *
 * USAGE:
 *
 *   "ul#main-menu li".on("click", function() { alert('clicked'); });
 *   "ul#main-menu li".on("mouseover", "addClass", "hovered");
 *   "ul#main-menu li".on("mouseout", "removeClass", "hovered");
 *
 *   // or like that in a shash
 *   "ul#main-menu li".on({
 *     click:     function() { alert('clicked'); },
 *     mouseover: ['addClass',    'hovered'],
 *     mouseout:  ['removeClass', 'hovered'],
 *     dblclick:  'hide'
 *   });
 *
 *
 *   "#css.rule".observes('click');
 *   "#css.rule".observes('click', function() {});
 *   "#css.rule".observes('click', 'method_name');
 *   ....
 *
 *   "#css.rule".stopObserving('click');
 *   "#css.rule".stopObserving('click', function() {});
 *   "#css.rule".stopObserving('click', 'method_name');
 *    ....
 */
Object.each({
  on:            'delegate',
  stopObserving: 'undelegate',
  observes:      'delegates'
}, function(name, method) {
  String[PROTO][name] = function() {
    var doc = $(document), args = $A(arguments), result;

    args.splice(1,0,''+this);
    result = doc[method].apply(doc, args);

    return result === doc ? this : result;
  };
});
var old_on = String[PROTO].on;
String[PROTO].on = function(hash) {
  if (isHash(hash)) {
    for (var key in hash) {
      old_on.apply(this, [key].concat([hash[key]]));
    }
  } else {
    old_on.apply(this, arguments);
  }
  return this;
};

/**
 * building the list of String#onEvent shortucts
 *
 * USAGE:
 *
 *    "#css.rule".onClick(function() {...});
 *    "#css.rule".onMouseover('method_name');
 */
Event_delegation_shortcuts.each(function(name) {
  String[PROTO]['on'+name.capitalize()] = function() {
    return this.on.apply(this, [name].concat($A(arguments)));
  };
});


/**
 * XMLHttpRequest wrapper
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Xhr = RightJS.Xhr = new Class(Observer, {
  extend: {
    // supported events list
    EVENTS: $w('success failure complete request cancel create'),

    // default options
    Options: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript,text/html,application/xml,text/xml,*/*'
      },
      method:       'post',
      encoding:     'utf-8',
      async:        true,
      evalScripts:  false,
      evalResponse: false,
      evalJS:       true,
      evalJSON:     true,
      secureJSON:   true,
      urlEncoded:   true,
      spinner:      null,
      spinnerFx:    'fade',
      params:       null,
      iframed:      false,
      jsonp:        false
    },

    /**
     * Shortcut to initiate and send an XHR in a single call
     *
     * @param String url
     * @param Object options
     * @return Xhr request
     */
    load: function(url, options) {
      return new this(url, Object.merge({method: 'get'}, options)).send();
    }
  },

  /**
   * basic constructor
   *
   * @param String url
   * @param Object options
   */
  initialize: function(url, options) {
    this.initCallbacks(); // system level callbacks should be initialized before the user callbacks

    this.url = url;

    // copying some options to the instance level attributes
    $ext(this.$super(options), this.options);

    // removing the local spinner if it's the same as the global one
    if (Xhr.Options.spinner && $(this.spinner) === $(Xhr.Options.spinner)) {
      this.spinner = null;
    }
  },

  /**
   * sets a header
   *
   * @param name String header name
   * @param value String header value
   * @return Xhr self
   */
  setHeader: function(name, value) {
    this.headers[name] = value;
    return this;
  },

  /**
   * tries to get a response header
   *
   * @return mixed String header value or undefined
   */
  getHeader: function(name) {
    var value;
    try {
      value = this.xhr.getResponseHeader(name);
    } catch(e) {}
    return value;
  },

  /**
   * checks if the request was successful
   *
   * @return boolean check result
   */
  successful: function() {
    return (this.status >= 200) && (this.status < 300);
  },

  /**
   * performs the actual request sending
   *
   * @param Object options
   * @return Xhr self
   */
  send: function(params) {
    var add_params = {}, url = this.url, method = this.method.toLowerCase(), headers = this.headers, key, xhr;

    if (method == 'put' || method == 'delete') {
      add_params._method = method;
      method = 'post';
    }

    var data = this.prepareData(this.params, this.prepareParams(params), add_params);

    if (this.urlEncoded && method == 'post' && !headers['Content-type']) {
      this.setHeader('Content-type', 'application/x-www-form-urlencoded;charset='+this.encoding);
    }

    if (method == 'get') {
      if (data) { url += (url.includes('?') ? '&' : '?') + data; }
      data = null;
    }

    xhr = this.xhr = this.createXhr();
    this.fire('create');

    xhr.open(method, url, this.async);

    xhr.onreadystatechange = this.stateChanged.bind(this);

    for (key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }

    xhr.send(data);
    this.fire('request');

    if (!this.async) { this.stateChanged(); }

    return this;
  },

  /**
   * elements automaticall update method, creates an Xhr request
   * and updates the element innerHTML value onSuccess.
   *
   * @param Element element
   * @param Object optional request params
   * @return Xhr self
   */
  update: function(element, params) {
    return this.onSuccess(function(r) { element.update(r.text); }).send(params);
  },

  /**
   * stops the request processing
   *
   * @return Xhr self
   */
  cancel: function() {
    var xhr = this.xhr;

    if (!xhr || xhr.canceled) { return this; }

    xhr.abort();
    xhr.onreadystatechange = dummy();
    xhr.canceled = true;

    return this.fire('cancel');
  },

// protected
  // wrapping the original method to send references to the xhr objects
  fire: function(name) {
    return this.$super(name, this, this.xhr);
  },

  // creates new request instance
  createXhr: function() {
    if (this.jsonp) {
      return new Xhr.JSONP(this);
    } else if (this.form && this.form.first('input[type=file]')) {
      return new Xhr.IFramed(this.form);
    } else {
      try {
        return new XMLHttpRequest();
      } catch(e) {
        return new ActiveXObject('MSXML2.XMLHTTP');
      }
    }
  },

  // prepares user sending params
  prepareParams: function(params) {
    if (params && params instanceof Form) {
      this.form = params;
      params = params.values();
    }
    return params;
  },

  // converts all the params into a url params string
  prepareData: function() {
    return $A(arguments).map(function(param) {
      if (!isString(param)) {
        param = Object.toQueryString(param);
      }
      return param.blank() ? null : param;
    }).compact().join('&');
  },

  // handles the state change
  stateChanged: function() {
    var xhr = this.xhr;

    if (xhr.readyState != 4 || xhr.canceled) { return; }

    try { this.status = xhr.status;
    } catch(e) { this.status = 0; }

    this.text = this.responseText = xhr.responseText;
    this.xml  = this.responseXML  = xhr.responseXML;

    this.fire('complete').fire(this.successful() ? 'success' : 'failure');
  },

  // called on success
  tryScripts: function(response) {
    var content_type = this.getHeader('Content-type');

    if (this.evalResponse || (this.evalJS && /(ecma|java)script/i.test(content_type))) {
      $eval(this.text);
    } else if (/json/.test(content_type) && this.evalJSON) {
      this.json = this.responseJSON = this.sanitizedJSON();
    } else if (this.evalScripts) {
      this.text.evalScripts();
    }
  },

  // sanitizes the json-response texts
  sanitizedJSON: function() {
    try {
      return JSON.parse(this.text);
    } catch(e) {
      // manual json consistancy check
      if (window.JSON || !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(this.text.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
        if (this.secureJSON) {
          throw "JSON error: "+this.text;
        }
        return null;
      }
    }

    // the fallback JSON extraction
    return eval("("+this.text+")");
  },

  // initializes the request callbacks
  initCallbacks: function() {
    // connecting basic callbacks
    this.on({
      success:  'tryScripts',
      create:   'showSpinner',
      complete: 'hideSpinner',
      cancel:   'hideSpinner'
    });

    // wiring the global xhr callbacks
    Xhr.EVENTS.each(function(name) {
      this.on(name, function() { Xhr.fire(name, this, this.xhr); });
    }, this);
  },

  showSpinner: function() { Xhr.showSpinner.call(this, this); },
  hideSpinner: function() { Xhr.hideSpinner.call(this, this); }
});

// attaching the common spinner handling
$ext(Observer_create(Xhr), {
  counter: 0,

  // shows the spinner
  showSpinner: function(context) {
    Xhr.trySpinner(context, 'show');
  },

  // hides the spinner
  hideSpinner: function(context) {
    Xhr.trySpinner(context, 'hide');
  },

  trySpinner: function(context, method) {
    var object = context || Xhr.Options, spinner = $(object.spinner);
    if (spinner) { spinner[method](object.spinnerFx, {duration: 100}); }
  },

  // counts a request in
  countIn: function() {
    Xhr.counter ++;
    Xhr.showSpinner();
  },

  // counts a request out
  countOut: function() {
    Xhr.counter --;
    if (Xhr.counter < 1) {
      Xhr.hideSpinner();
    }
  }
}).on({
  create:   'countIn',
  complete: 'countOut',
  cancel:   'countOut'
});


/**
 * Here are the Form unit Xhr extensions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */

/**
 * Catches the form submit events and sends the form remotely
 *
 * @param Event submit
 * @param Object xhr options
 * @return void
 */
function remote_send(event, options) {
  event.stop();
  this.send(Object.merge({spinner: this.first('.spinner')}, options));
}

Form.include({
  /**
   * sends the form via xhr request
   *
   * @param Options xhr request options
   * @return Form this
   */
  send: function(options) {
    options = options || {};
    options.method = options.method || this._.method || 'post';

    new Xhr(this._.action || document.location.href, options)
      .onComplete(this.enable.bind(this)).send(this);

    this.disable.bind(this).delay(1); // webkit needs this async call with iframed calls
    return this;
  },

  /**
   * makes the form be remote by default
   *
   * @param Object default options
   * @return Form this
   */
  remotize: function(options) {
    if (!this.observes('submit', remote_send)) {
      this.on('submit', remote_send, options);
      this.remote = true;
    }
    return this;
  },

  /**
   * removes the remote call hook
   *
   * @return Form this
   */
  unremotize: function() {
    this.stopObserving('submit', remote_send);
    this.remote = false;

    return this;
  }
});


/**
 * this module contains the Element unit XHR related extensions
 *
 * Credits:
 *   - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * performs an Xhr request to the given url
   * and updates the element internals with the responseText
   *
   * @param String url address
   * @param Object xhr options
   * @return Element this
   */
  load: function(url, options) {
    new Xhr(url, Object.merge({method: 'get'}, options)).update(this);
    return this;
  }
});


/**
 * A dummy XmlHTTPRequest interface to be used in other
 * fake requests
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Xhr.Dummy = {
  open:               dummy(),
  abort:              dummy(),
  setRequestHeader:   dummy(),
  onreadystatechange: dummy()
};


/**
 * This unit presents a fake drop in replacement for the XmlHTTPRequest unit
 * but works with an iframe targeting in the background
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
Xhr.IFramed = new Class({
  include: Xhr.Dummy,

  /**
   * constructor
   *
   * @param Form form which will be submitted via the frame
   * @return void
   */
  initialize: function(form) {
    this.form = form;
    this.id   = 'xhr_'+ new Date().getTime();

    form.insert('<i><iframe name="'+this.id+'" id="'+this.id+
      '" width="0" height="0" frameborder="0" src="about:blank"></iframe></i>',
      'after');

    $(this.id).on('load', this.onLoad.bind(this));
  },

  send: function() {
    this.form.set('target', this.id).submit();
  },

  onLoad: function() {
    this.status       = 200;
    this.readyState   = 4;

    try {
      this.responseText = window[this.id].document.documentElement.innerHTML;
    } catch(e) { }

    this.onreadystatechange();
  }
});


/**
 * The JSONP Xhr request tonnel
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Xhr.JSONP = new Class({
  include: Xhr.Dummy,

  prefix: 'jsonp',

  /**
   * Constructor
   *
   * @param Xhr the actual xhr request object
   * @return void
   */
  initialize: function(xhr) {
    this.xhr   = xhr;
    this.name  = this.prefix + new Date().getTime();
    this.param = (isString(xhr.jsonp) ?
      xhr.jsonp : 'callback') + "=" + this.name;

    this.script = $E('script', {
      charset: xhr.encoding,
      async:   xhr.async
    });
  },

  /**
   * saving the url and method for the further use
   *
   * @param method String request method
   * @param address String request url address
   * @param Boolean async request marker
   * @return void
   */
  open: function(method, url, async) {
    this.url    = url;
    this.method = method;
  },

  /**
   * Sends the actual request by inserting the script into the document body
   *
   * @param String data
   * @return void
   */
  send: function(data) {
    window[this.name] = this.finish.bind(this);

    this.script.set('src', this.url + (this.url.include('?') ? '&' : '?') + this.param + "&" + data)
      .insertTo($$('script').last(), 'after');
  },

  /**
   * Receives the actual JSON data from the server
   *
   * @param Object JSON data
   * @return void
   */
  finish: function(data) {
    this.status       = 200;
    this.readyState   = 4;

    this.xhr.json = this.xhr.responseJSON = data;

    this.onreadystatechange();
  }
});


/**
 * Basic visual effects class
 *
 * Credits:
 *   The basic principles, structures and naming system are inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Fx = RightJS.Fx = new Class(Observer, {
  extend: {
    EVENTS: $w('start finish cancel'),

    // named durations
    Durations: {
      'short':  200,
      'normal': 400,
      'long':   800
    },

    // default options
    Options: {
      fps:        Browser.IE ? 40 : 60,
      duration:   'normal',
      transition: 'Sin',
      queue:      true
    },

    // list of basic transitions
    Transitions: {
      Sin: function(i)  {
        return -(Math.cos(Math.PI * i) - 1) / 2;
      },

      Cos: function(i) {
        return Math.asin((i-0.5) * 2)/Math.PI + 0.5;
      },

      Exp: function(i) {
        return Math.pow(2, 8 * (i - 1));
      },

      Log: function(i) {
        return 1 - Math.pow(2, - 8 * i);
      },

      Lin: function(i) {
        return i;
      }
    },

    ch: [], // scheduled effects registries
    cr: []  // currently running effects registries
  },

  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(element, options) {
    this.$super(options);

    if ((this.element = element = $(element))) {
      var uid = $uid(element);
      this.ch = (Fx.ch[uid] = Fx.ch[uid] || []);
      this.cr = (Fx.cr[uid] = Fx.cr[uid] || []);
    }
  },

  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    if (this.queue(arguments)) { return this; }
    this.prepare.apply(this, arguments);

    var options = this.options,
        duration  = Fx.Durations[options.duration] || options.duration;
    this.transition = Fx.Transitions[options.transition] || options.transition;

    this.steps  = (duration / 1000 * this.options.fps).ceil();
    this.number = 1;

    if (this.cr) {
      this.cr.push(this); // adding this effect to the list of currently active
    }

    return this.fire('start', this).startTimer();
  },

  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    return this.stopTimer().unreg().fire('finish').next();
  },

  /**
   * interrupts the transition
   *
   * NOTE:
   *   this method cancels all the scheduled effects
   *   in the element chain
   *
   * @return Fx this
   */
  cancel: function() {
    this.ch.clean();
    return this.stopTimer().unreg().fire('cancel');
  },

  /**
   * pauses the transition
   *
   * @return Fx this
   */
  pause: function() {
    return this.stopTimer();
  },

  /**
   * resumes a paused transition
   *
   * @return Fx this
   */
  resume: function() {
    return this.startTimer();
  },

// protected
  // dummy method, should be implemented in a subclass
  prepare: function(values) {},

  // dummy method, processes the element properties
  render: function(delta) {},

  // the periodically called method
  // NOTE: called outside of the instance scope!
  step: function(that) {
    if (that.number > that.steps) {
      that.finish();
    } else {
      if (!that.w) {
        that.w = true;
        that.render(that.transition(that.number / that.steps));
        that.w = false;
      }
      that.number ++;
    }
  },

  // starts the effect timer
  startTimer: function() {
    this.timer = this.step.periodical((1000 / this.options.fps).round(), this);
    return this;
  },

  // stops the effect timer
  stopTimer: function() {
    if (this.timer) {
      this.timer.stop();
    }
    return this;
  },

  // handles effects queing
  // should return false if there's no queue and true if there is a queue
  queue: function(args) {
    var chain = this.ch, queue = this.options.queue;

    if (!chain || this.$ch) {
      return (this.$ch = false);
    }

    if (queue) {
      chain.push([args, this]);
    }

    return queue && chain[0][1] !== this;
  },

  // calls for the next effect in the queue
  next: function() {
    var chain = this.ch, next = chain.shift();
    if ((next = chain[0])) {
      next[1].$ch = true;
      next[1].start.apply(next[1], next[0]);
    }
    return this;
  },

  // unregisters this effect out of the currently running list
  unreg: function() {
    var currents = this.cr;
    if (currents) {
      currents.splice(currents.indexOf(this), 1);
    }
    return this;
  }

});


/**
 * There are the String unit extensions for the effects library
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov
 */
String.COLORS = {
  maroon:  '#800000',
  red:     '#ff0000',
  orange:  '#ffA500',
  yellow:  '#ffff00',
  olive:   '#808000',
  purple:  '#800080',
  fuchsia: '#ff00ff',
  white:   '#ffffff',
  lime:    '#00ff00',
  green:   '#008000',
  navy:    '#000080',
  blue:    '#0000ff',
  aqua:    '#00ffff',
  teal:    '#008080',
  black:   '#000000',
  silver:  '#c0c0c0',
  gray:    '#808080',
  brown:   '#a52a2a'
};

String.include({
  /**
   * converts a #XXX or rgb(X, X, X) sring into standard #XXXXXX color string
   *
   * @return String hex color
   */
  toHex: function() {
    var match = /^#(\w)(\w)(\w)$/.exec(this);

    if (match) {
      match = "#"+ match[1]+match[1]+match[2]+match[2]+match[3]+match[3];
    } else if ((match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(this))) {
      match = "#"+ match.slice(1).map(function(bit) {
        bit = (bit-0).toString(16);
        return bit.length == 1 ? '0'+bit : bit;
      }).join('');
    } else {
      match = String.COLORS[this] || this;
    }

    return match;
  },

  /**
   * converts a hex string into an rgb array
   *
   * @param boolean flag if need an array
   * @return String rgb(R,G,B) or Array [R,G,B]
   */
  toRgb: function(array) {
    var match = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(this.toHex()||'');

    if (match) {
      match = match.slice(1).map('toInt', 16);
      match = array ? match : 'rgb('+match+')';
    }

    return match;
  }
});


/**
 * This block contains additional Element shortcuts for effects easy handling
 *
 * Credits:
 *   Some ideas are inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var methods    = Element.prototype,
    old_hide   = methods.hide,
    old_show   = methods.show,
    old_remove = methods.remove,
    old_scroll = methods.scrollTo;

Element.include({
  /**
   * Stops all the visual effects on the element
   *
   * @return Element this
   */
  stop: function() {
    (Fx.cr[$uid(this)] || []).each('cancel');
    return this;
  },

  /**
   * hides the element with given visual effect
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  hide: function(fx, options) {
    return (fx && this.visible()) ? this.fx(fx, ['out', options]) : old_hide.call(this);
  },

  /**
   * shows the element with the given visual effect
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  show: function(fx, options) {
    return (fx && !this.visible()) ? this.fx(fx, ['in', options]) : old_show.call(this);
  },

  /**
   * Removes the element out of the DOM structure
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  remove: function(fx, options) {
    return (fx && this.visible()) ? this.fx(fx, ['out', Object.merge(options, {
      onFinish: old_remove.bind(this)
    })]) : old_remove.call(this);
  },

  /**
   * runs the Fx.Morth effect to the given style
   *
   * @param style Object style
   * @param options Object optional effect options
   * @return Element self
   */
  morph: function(style, options) {
    return this.fx('morph', [style, options || {}]); // <- don't replace with arguments
  },

  /**
   * highlights the element
   *
   * @param start String start color
   * @param end String optional end color
   * @param Object effect options
   * @return Element self
   */
  highlight: function() {
    return this.fx('highlight', arguments);
  },

  /**
   * runs the Fx.Fade effect on the element
   *
   * @param mixed fade direction 'in' 'out' or a float number
   * @return Element self
   */
  fade: function() {
    return this.fx('fade', arguments);
  },

  /**
   * runs the Fx.Slide effect on the element
   *
   * @param String 'in' or 'out'
   * @param Object effect options
   * @return Element self
   */
  slide: function() {
    return this.fx('slide', arguments);
  },

  /**
   * Starts the smooth scrolling effect
   *
   * @param position Object {x: NNN, y: NNN} where to scroll
   * @param options Object fx-options
   * @return Element this
   */
  scroll: function(value, options) {
    return this.fx('scroll', [value, options||{}]);
  },

  /**
   * wraps the old scroll to be able to run it with fxes
   *
   * If you send two hashes then will start a smooth scrolling
   * otherwise will just jump over with the usual method
   *
   * @return Element this
   */
  scrollTo: function(value, options) {
    return isHash(options) ? this.scroll(value, options) : old_scroll.apply(this, arguments);
  },


// protected

  // runs an Fx on the element
  fx: function(name, params) {
    var args = $A(params).compact(), options = isHash(args.last()) ? args.pop() : {},
      fx = new Fx[name.capitalize()](this, options);

    fx.start.apply(fx, args);

    return this;
  }

});


/**
 * This class provides the basic effect for styles manipulation
 *
 * Credits:
 *   The idea is inspired by the Morph effect from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */

// a list of common style names to compact the code a bit
var directions = $w('Top Left Right Bottom');

// adds variants to the style names list
function add_variants(keys, key, variants) {
  for (var i=0; i < variants.length; i++) {
    keys.push(key + variants[i]);
  }
}

// checks if the color is transparent
function is_transparent(color) {
  return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
}

// adjusts the border-styles
function check_border_styles(element, before, after) {
  for (var i=0; i < 4; i++) {
    var direction = directions[i],
      bd_style = 'border' + direction + 'Style',
      bd_width = 'border' + direction + 'Width',
      bd_color = 'border' + direction + 'Color';

    if (bd_style in before && before[bd_style] != after[bd_style]) {
      var style = element._.style;

      if (before[bd_style] == 'none') {
        style[bd_width] = '0px';
      }

      style[bd_style] = after[bd_style];
      if (is_transparent(before[bd_color])) {
        style[bd_color] = element.getStyle('Color');
      }
    }
  }
}

// parses the style hash into a processable format
function parse_style(values) {
  var result = {}, re = /[\d\.\-]+/g, m, key, value, i;

  for (key in values) {
    m = values[key].match(re);
    value = m.map('toFloat');
    value.t = values[key].split(re);
    value.r = value.t[0] === 'rgb(';

    if (value.t.length == 1) { value.t.unshift(''); }

    for (i=0; i < value.length; i++) {
      value.t.splice(i*2 + 1, 0, value[i]);
    }
    result[key] = value;
  }

  return result;
}

// cleans up and optimizies the styles
function clean_styles(element, before, after) {
  var remove = [], key;

  for (key in after) {
    // checking the height/width options
    if ((key == 'width' || key == 'height') && before[key] == 'auto') {
      before[key] = element._['offset'+key.capitalize()] + 'px';
    }
  }

  // IE opacity filter fix
  if (after.filter && !before.filter) {
    before.filter = 'alpha(opacity=100)';
  }

  // adjusting the border style
  check_border_styles(element, before, after);

  // cleaing up the list
  for (key in after) {
    // proprocessing colors
    if (after[key] !== before[key] && !remove.includes(key) && /color/i.test(key)) {
      if (Browser.Opera) {
        after[key] = after[key].replace(/"/g, '');
        before[key] = before[key].replace(/"/g, '');
      }

      if (!is_transparent(after[key]))  { after[key]  = after[key].toRgb(); }
      if (!is_transparent(before[key])) { before[key] = before[key].toRgb(); }

      if (!after[key] || !before[key]) {  after[key] = before[key] = ''; }
    }

    // filling up the missing size
    if (/\d/.test(after[key]) && !/\d/.test(before[key])) {
      before[key] = after[key].replace(/[\d\.\-]+/g, '0');
    }

    // removing unprocessable keys
    if (after[key] === before[key] || remove.includes(key) || !/\d/.test(before[key]) || !/\d/.test(after[key])) {
      delete(after[key]);
      delete(before[key]);
    }
  }
}

/**
 * creates an appropriate style-keys list out of the user styles
 *
 * @param Object the style hash
 * @return Array of clean style keys list
 */
function style_keys(style) {
  var keys = [], border_types = ['Style', 'Color', 'Width'], key, i, j;

  for (key in style) {
    if (key.startsWith('border')) {
      for (i=0; i < border_types.length; i++) {
        for (j=0; j < directions.length; j++) {
          keys.push('border' + directions[j] + border_types[i]);
        }
      }
    } else if (key == 'margin' || key == 'padding') {
      add_variants(keys, key, directions);
    } else if (key.startsWith('background')) {
      add_variants(keys, 'background', ['Color', 'Position', 'PositionX', 'PositionY']);
    } else if (key == 'opacity' && Browser.IE) {
      keys.push('filter');
    } else {
      keys.push(key);
    }
  }

  return keys;
}

Fx.Morph = new Class(Fx, {

// protected

  // parepares the effect
  prepare: function(style) {
    var keys   = style_keys(style),
        before = this._cloneStyle(this.element, keys),
        after  = this._endStyle(style, keys);

    clean_styles(this.element, before, after);

    this.before = parse_style(before);
    this.after  = parse_style(after);
  },

  render: function(delta) {
    var before, after, value, style = this.element._.style, key, i, l;
    for (key in this.after) {
      before = this.before[key];
      after  = this.after[key];

      for (i=0, l = after.length; i < l; i++) {
        value = before[i] + (after[i] - before[i]) * delta;
        if (after.r) {
          value = Math.round(value);
        }
        after.t[i*2 + 1] = value;
      }

      style[key] = after.t.join('');
    }
  },

  /**
   * Returns a hash of the end style
   *
   * @param Object style
   * @return Object end style
   */
  _endStyle: function(style, keys) {
    var element = this.element,
        dummy   = element.clone()
        .setStyle('position:absolute;z-index:-1;visibility:hidden')
        .setWidth(element.size().x)
        .setStyle(style);

    if (element.parent()) {
      element.insert(dummy, 'before');
    }

    var after  = this._cloneStyle(dummy, keys);

    dummy.remove();

    return after;
  },

  /**
   * Fast styles cloning
   *
   * @param Element element
   * @param Array style keys
   * @return Hash of styles
   */
  _cloneStyle: function(element, keys) {
    for (var i=0, len = keys.length, style = element.computedStyles(), clean = {}, key; i < len; i++) {
      key = keys[i];
      if (key in style) {
        clean[key] = ''+ style[key];
      }

      // libwebkit bug fix for in case of languages pack applied
      if (key === 'opacity') {
        clean[key] = clean[key].replace(',', '.');
      }
    }

    return clean;
  }
});



/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    Options: Object.merge(Fx.Options, {
      color:      '#FF8',
      transition: 'Exp'
    })
  },

// protected

  /**
   * starts the transition
   *
   * @param high String the hightlight color
   * @param back String optional fallback color
   * @return self
   */
  prepare: function(start, end) {
    var element = this.element, style = element._.style, end_color = end || element.getStyle('backgroundColor');

    if (is_transparent(end_color)) {
      this.onFinish(function() { style.backgroundColor = 'transparent'; });

      // trying to find the end color
      end_color = [element].concat(element.parents()).map(function(node) {
        var bg = node.getStyle('backgroundColor');
        return (bg && !is_transparent(bg)) ? bg : null;
      }).compact().first() || '#FFF';
    }

    style.backgroundColor = (start || this.options.color);

    return this.$super({backgroundColor: end_color});
  }
});


/**
 * this is a superclass for the bidirectional effects
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Twin = new Class(Fx.Morph, {

  /**
   * hides the element if it meant to be switched off
   *
   * @return Fx self
   */
  finish: function() {
    if (this.how == 'out') {
      old_hide.call(this.element);
    }

    return this.$super();
  },

// protected

  /**
   * assigns the direction of the effect in or out
   *
   * @param String 'in', 'out' or 'toggle', 'toggle' by default
   */
  setHow: function(how) {
    this.how = how || 'toggle';

    if (this.how == 'toggle') {
      this.how = this.element.visible() ? 'out' : 'in';
    }
  }

});


/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Slide = new Class(Fx.Twin, {
  extend: {
    Options: Object.merge(Fx.Options, {
      direction: 'top'
    })
  },

// protected
  prepare: function(how) {
    this.setHow(how);

    var element = old_show.call(this.element);
    this.size = element.size();

    this.styles = {};
    $w('overflow height width marginTop marginLeft').each(function(key) {
      this.styles[key] = element._.style[key];
    }, this);

    element._.style.overflow = 'hidden';
    this.onFinish('_getBack').onCancel('_getBack');

    return this.$super(this._getStyle(this.options.direction));
  },

  _getBack: function() {
    this.element.setStyle(this.styles);
  },

  // calculates the final style
  _getStyle: function(direction) {
    var style = {}, size = this.size,
      margin_left = this.styles.marginLeft.toFloat() || 0,
      margin_top  = this.styles.marginTop.toFloat() || 0;

    if (this.how == 'out') {
      style[['top', 'bottom'].includes(direction) ? 'height' : 'width'] = '0px';

      if (direction == 'right') {
        style.marginLeft = margin_left + size.x+'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + size.y +'px';
      }

    } else if (this.how == 'in') {
      var element_style = this.element._.style;

      if (['top', 'bottom'].includes(direction)) {
        style.height = size.y + 'px';
        element_style.height = '0px';
      } else {
        style.width = size.x + 'px';
        element_style.width = '0px';
      }

      if (direction == 'right') {
        style.marginLeft = margin_left + 'px';
        element_style.marginLeft = margin_left + size.x + 'px';
      } else if (direction == 'bottom') {
        style.marginTop = margin_top + 'px';
        element_style.marginTop = margin_top + size.y + 'px';
      }
    }

    return style;
  }

});


/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
Fx.Fade = new Class(Fx.Twin, {
  prepare: function(how) {
    this.setHow(how);

    if (this.how == 'in') {
      old_show.call(this.element.setStyle({opacity: 0}));
    }

    return this.$super({opacity: isNumber(how) ? how : this.how == 'in' ? 1 : 0});
  }
});


/**
 * A smooth scrolling visual effect
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Fx.Scroll = new Class(Fx, {

  initialize: function(element, options) {
    element = $(element);
    // swapping the actual scrollable when it's the window
    this.$super(element instanceof Window ? element._.document[Browser.WebKit ? 'body' : 'documentElement'] : element, options);
  },

  prepare: function(value) {
    var before = this.before = {}, element = this.element._;

    this.after  = value;

    if ('x' in value) { before.x = element.scrollLeft; }
    if ('y' in value) { before.y = element.scrollTop;  }
  },

  render: function(delta) {
    var before = this.before, key;
    for (key in before) {
      this.element._['scroll' + (key == 'x' ? 'Left' : 'Top')] = before[key] + (this.after[key] - before[key]) * delta;
    }
  }
});


/**
 * this module handles the work with cookies
 *
 * Credits:
 *   Most things in the unit are take from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Cookie = RightJS.Cookie = new Class({
  include: Options,

  extend: {
    // sets the cookie
    set: function(name, value, options) {
      return new this(name, options).set(value);
    },
    // gets the cookie
    get: function(name) {
      return new this(name).get();
    },
    // deletes the cookie
    remove: function(name) {
      return new this(name).remove();
    },

    // checks if the cookies are enabled
    enabled: function() {
      document.cookie = "__t=1";
      return document.cookie.indexOf("__t=1")!=-1;
    },

    // some basic options
    Options: {
      secure:   false,
      document: document
    }
  },

  /**
   * constructor
   * @param String cookie name
   * @param Object options
   * @return void
   */
  initialize: function(name, options) {
    this.name = name;
    this.setOptions(options);
  },

  /**
   * sets the cookie with the name
   *
   * @param mixed value
   * @return Cookie this
   */
  set: function(data) {
    var value = encodeURIComponent(data), options = this.options;
    if (options.domain) { value += '; domain=' + options.domain; }
    if (options.path)   { value += '; path=' + options.path; }
    if (options.duration) {
      var date = new Date();
      date.setTime(date.getTime() + options.duration * 24 * 60 * 60 * 1000);
      value += '; expires=' + date.toGMTString();
    }
    if (options.secure) { value += '; secure'; }
    options.document.cookie = this.name + '=' + value;
    return this;
  },

  /**
   * searches for a cookie with the name
   *
   * @return mixed saved value or null if nothing found
   */
  get: function() {
    var value = this.options.document.cookie.match('(?:^|;)\\s*' + RegExp.escape(this.name) + '=([^;]*)');
    return (value) ? decodeURIComponent(value[1]) : null;
  },

  /**
   * removes the cookie
   *
   * @return Cookie this
   */
  remove: function() {
    this.options.duration = -1;
    return this.set('');
  }
});


// globalizing the top-level variables
$ext(window, Object.without(RightJS, 'version', 'modules'));

return RightJS;
})(window, document, Object, Array, String, Function, Number, Math);
/**
 * The old browsers support patch loading script
 * will be included in the core file when it's built
 * with the no-olds option
 *
 * Basically it just checks all the script tags on the page
 * finds the core inclusion tag and uses it's src attribute
 * to dynamically load the olds patch
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
if (!document.querySelector) {
  document.write('<script src="' +
    RightJS.$A(document.getElementsByTagName('script')).last()
      .src.replace(/(^|\/)(right)([^\/]+)$/, '$1$2-olds$3') +
  '"></script>');
}
