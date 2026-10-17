function Yp(a, r) {
  for (var o = 0; o < r.length; o++) {
    const c = r[o];
    if (typeof c != "string" && !Array.isArray(c)) {
      for (const f in c)
        if (f !== "default" && !(f in a)) {
          const d = Object.getOwnPropertyDescriptor(c, f);
          d && Object.defineProperty(a, f, d.get ? d : {
            enumerable: !0,
            get: () => c[f]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
function Yv(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var go = { exports: {} }, pi = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ph;
function Gp() {
  if (Ph) return pi;
  Ph = 1;
  var a = Symbol.for("react.transitional.element"), r = Symbol.for("react.fragment");
  function o(c, f, d) {
    var h = null;
    if (d !== void 0 && (h = "" + d), f.key !== void 0 && (h = "" + f.key), "key" in f) {
      d = {};
      for (var g in f)
        g !== "key" && (d[g] = f[g]);
    } else d = f;
    return f = d.ref, {
      $$typeof: a,
      type: c,
      key: h,
      ref: f !== void 0 ? f : null,
      props: d
    };
  }
  return pi.Fragment = r, pi.jsx = o, pi.jsxs = o, pi;
}
var Ih;
function kp() {
  return Ih || (Ih = 1, go.exports = Gp()), go.exports;
}
var p = kp(), po = { exports: {} }, bi = {}, bo = { exports: {} }, xo = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ev;
function Xp() {
  return ev || (ev = 1, function(a) {
    function r(B, ee) {
      var X = B.length;
      B.push(ee);
      e: for (; 0 < X; ) {
        var ne = X - 1 >>> 1, S = B[ne];
        if (0 < f(S, ee))
          B[ne] = ee, B[X] = S, X = ne;
        else break e;
      }
    }
    function o(B) {
      return B.length === 0 ? null : B[0];
    }
    function c(B) {
      if (B.length === 0) return null;
      var ee = B[0], X = B.pop();
      if (X !== ee) {
        B[0] = X;
        e: for (var ne = 0, S = B.length, k = S >>> 1; ne < k; ) {
          var ie = 2 * (ne + 1) - 1, le = B[ie], W = ie + 1, se = B[W];
          if (0 > f(le, X))
            W < S && 0 > f(se, le) ? (B[ne] = se, B[W] = X, ne = W) : (B[ne] = le, B[ie] = X, ne = ie);
          else if (W < S && 0 > f(se, X))
            B[ne] = se, B[W] = X, ne = W;
          else break e;
        }
      }
      return ee;
    }
    function f(B, ee) {
      var X = B.sortIndex - ee.sortIndex;
      return X !== 0 ? X : B.id - ee.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      a.unstable_now = function() {
        return d.now();
      };
    } else {
      var h = Date, g = h.now();
      a.unstable_now = function() {
        return h.now() - g;
      };
    }
    var y = [], m = [], x = 1, T = null, D = 3, M = !1, R = !1, O = !1, _ = typeof setTimeout == "function" ? setTimeout : null, H = typeof clearTimeout == "function" ? clearTimeout : null, G = typeof setImmediate < "u" ? setImmediate : null;
    function Z(B) {
      for (var ee = o(m); ee !== null; ) {
        if (ee.callback === null) c(m);
        else if (ee.startTime <= B)
          c(m), ee.sortIndex = ee.expirationTime, r(y, ee);
        else break;
        ee = o(m);
      }
    }
    function Q(B) {
      if (O = !1, Z(B), !R)
        if (o(y) !== null)
          R = !0, me();
        else {
          var ee = o(m);
          ee !== null && ge(Q, ee.startTime - B);
        }
    }
    var V = !1, L = -1, K = 5, oe = -1;
    function J() {
      return !(a.unstable_now() - oe < K);
    }
    function $() {
      if (V) {
        var B = a.unstable_now();
        oe = B;
        var ee = !0;
        try {
          e: {
            R = !1, O && (O = !1, H(L), L = -1), M = !0;
            var X = D;
            try {
              t: {
                for (Z(B), T = o(y); T !== null && !(T.expirationTime > B && J()); ) {
                  var ne = T.callback;
                  if (typeof ne == "function") {
                    T.callback = null, D = T.priorityLevel;
                    var S = ne(
                      T.expirationTime <= B
                    );
                    if (B = a.unstable_now(), typeof S == "function") {
                      T.callback = S, Z(B), ee = !0;
                      break t;
                    }
                    T === o(y) && c(y), Z(B);
                  } else c(y);
                  T = o(y);
                }
                if (T !== null) ee = !0;
                else {
                  var k = o(m);
                  k !== null && ge(
                    Q,
                    k.startTime - B
                  ), ee = !1;
                }
              }
              break e;
            } finally {
              T = null, D = X, M = !1;
            }
            ee = void 0;
          }
        } finally {
          ee ? Se() : V = !1;
        }
      }
    }
    var Se;
    if (typeof G == "function")
      Se = function() {
        G($);
      };
    else if (typeof MessageChannel < "u") {
      var Re = new MessageChannel(), de = Re.port2;
      Re.port1.onmessage = $, Se = function() {
        de.postMessage(null);
      };
    } else
      Se = function() {
        _($, 0);
      };
    function me() {
      V || (V = !0, Se());
    }
    function ge(B, ee) {
      L = _(function() {
        B(a.unstable_now());
      }, ee);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(B) {
      B.callback = null;
    }, a.unstable_continueExecution = function() {
      R || M || (R = !0, me());
    }, a.unstable_forceFrameRate = function(B) {
      0 > B || 125 < B ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : K = 0 < B ? Math.floor(1e3 / B) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return D;
    }, a.unstable_getFirstCallbackNode = function() {
      return o(y);
    }, a.unstable_next = function(B) {
      switch (D) {
        case 1:
        case 2:
        case 3:
          var ee = 3;
          break;
        default:
          ee = D;
      }
      var X = D;
      D = ee;
      try {
        return B();
      } finally {
        D = X;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(B, ee) {
      switch (B) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          B = 3;
      }
      var X = D;
      D = B;
      try {
        return ee();
      } finally {
        D = X;
      }
    }, a.unstable_scheduleCallback = function(B, ee, X) {
      var ne = a.unstable_now();
      switch (typeof X == "object" && X !== null ? (X = X.delay, X = typeof X == "number" && 0 < X ? ne + X : ne) : X = ne, B) {
        case 1:
          var S = -1;
          break;
        case 2:
          S = 250;
          break;
        case 5:
          S = 1073741823;
          break;
        case 4:
          S = 1e4;
          break;
        default:
          S = 5e3;
      }
      return S = X + S, B = {
        id: x++,
        callback: ee,
        priorityLevel: B,
        startTime: X,
        expirationTime: S,
        sortIndex: -1
      }, X > ne ? (B.sortIndex = X, r(m, B), o(y) === null && B === o(m) && (O ? (H(L), L = -1) : O = !0, ge(Q, X - ne))) : (B.sortIndex = S, r(y, B), R || M || (R = !0, me())), B;
    }, a.unstable_shouldYield = J, a.unstable_wrapCallback = function(B) {
      var ee = D;
      return function() {
        var X = D;
        D = ee;
        try {
          return B.apply(this, arguments);
        } finally {
          D = X;
        }
      };
    };
  }(xo)), xo;
}
var tv;
function Vp() {
  return tv || (tv = 1, bo.exports = Xp()), bo.exports;
}
var So = { exports: {} }, fe = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nv;
function Qp() {
  if (nv) return fe;
  nv = 1;
  var a = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), d = Symbol.for("react.consumer"), h = Symbol.for("react.context"), g = Symbol.for("react.forward_ref"), y = Symbol.for("react.suspense"), m = Symbol.for("react.memo"), x = Symbol.for("react.lazy"), T = Symbol.iterator;
  function D(S) {
    return S === null || typeof S != "object" ? null : (S = T && S[T] || S["@@iterator"], typeof S == "function" ? S : null);
  }
  var M = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, R = Object.assign, O = {};
  function _(S, k, ie) {
    this.props = S, this.context = k, this.refs = O, this.updater = ie || M;
  }
  _.prototype.isReactComponent = {}, _.prototype.setState = function(S, k) {
    if (typeof S != "object" && typeof S != "function" && S != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, S, k, "setState");
  }, _.prototype.forceUpdate = function(S) {
    this.updater.enqueueForceUpdate(this, S, "forceUpdate");
  };
  function H() {
  }
  H.prototype = _.prototype;
  function G(S, k, ie) {
    this.props = S, this.context = k, this.refs = O, this.updater = ie || M;
  }
  var Z = G.prototype = new H();
  Z.constructor = G, R(Z, _.prototype), Z.isPureReactComponent = !0;
  var Q = Array.isArray, V = { H: null, A: null, T: null, S: null }, L = Object.prototype.hasOwnProperty;
  function K(S, k, ie, le, W, se) {
    return ie = se.ref, {
      $$typeof: a,
      type: S,
      key: k,
      ref: ie !== void 0 ? ie : null,
      props: se
    };
  }
  function oe(S, k) {
    return K(
      S.type,
      k,
      void 0,
      void 0,
      void 0,
      S.props
    );
  }
  function J(S) {
    return typeof S == "object" && S !== null && S.$$typeof === a;
  }
  function $(S) {
    var k = { "=": "=0", ":": "=2" };
    return "$" + S.replace(/[=:]/g, function(ie) {
      return k[ie];
    });
  }
  var Se = /\/+/g;
  function Re(S, k) {
    return typeof S == "object" && S !== null && S.key != null ? $("" + S.key) : k.toString(36);
  }
  function de() {
  }
  function me(S) {
    switch (S.status) {
      case "fulfilled":
        return S.value;
      case "rejected":
        throw S.reason;
      default:
        switch (typeof S.status == "string" ? S.then(de, de) : (S.status = "pending", S.then(
          function(k) {
            S.status === "pending" && (S.status = "fulfilled", S.value = k);
          },
          function(k) {
            S.status === "pending" && (S.status = "rejected", S.reason = k);
          }
        )), S.status) {
          case "fulfilled":
            return S.value;
          case "rejected":
            throw S.reason;
        }
    }
    throw S;
  }
  function ge(S, k, ie, le, W) {
    var se = typeof S;
    (se === "undefined" || se === "boolean") && (S = null);
    var re = !1;
    if (S === null) re = !0;
    else
      switch (se) {
        case "bigint":
        case "string":
        case "number":
          re = !0;
          break;
        case "object":
          switch (S.$$typeof) {
            case a:
            case r:
              re = !0;
              break;
            case x:
              return re = S._init, ge(
                re(S._payload),
                k,
                ie,
                le,
                W
              );
          }
      }
    if (re)
      return W = W(S), re = le === "" ? "." + Re(S, 0) : le, Q(W) ? (ie = "", re != null && (ie = re.replace(Se, "$&/") + "/"), ge(W, k, ie, "", function(je) {
        return je;
      })) : W != null && (J(W) && (W = oe(
        W,
        ie + (W.key == null || S && S.key === W.key ? "" : ("" + W.key).replace(
          Se,
          "$&/"
        ) + "/") + re
      )), k.push(W)), 1;
    re = 0;
    var _e = le === "" ? "." : le + ":";
    if (Q(S))
      for (var Ee = 0; Ee < S.length; Ee++)
        le = S[Ee], se = _e + Re(le, Ee), re += ge(
          le,
          k,
          ie,
          se,
          W
        );
    else if (Ee = D(S), typeof Ee == "function")
      for (S = Ee.call(S), Ee = 0; !(le = S.next()).done; )
        le = le.value, se = _e + Re(le, Ee++), re += ge(
          le,
          k,
          ie,
          se,
          W
        );
    else if (se === "object") {
      if (typeof S.then == "function")
        return ge(
          me(S),
          k,
          ie,
          le,
          W
        );
      throw k = String(S), Error(
        "Objects are not valid as a React child (found: " + (k === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : k) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return re;
  }
  function B(S, k, ie) {
    if (S == null) return S;
    var le = [], W = 0;
    return ge(S, le, "", "", function(se) {
      return k.call(ie, se, W++);
    }), le;
  }
  function ee(S) {
    if (S._status === -1) {
      var k = S._result;
      k = k(), k.then(
        function(ie) {
          (S._status === 0 || S._status === -1) && (S._status = 1, S._result = ie);
        },
        function(ie) {
          (S._status === 0 || S._status === -1) && (S._status = 2, S._result = ie);
        }
      ), S._status === -1 && (S._status = 0, S._result = k);
    }
    if (S._status === 1) return S._result.default;
    throw S._result;
  }
  var X = typeof reportError == "function" ? reportError : function(S) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var k = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof S == "object" && S !== null && typeof S.message == "string" ? String(S.message) : String(S),
        error: S
      });
      if (!window.dispatchEvent(k)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", S);
      return;
    }
    console.error(S);
  };
  function ne() {
  }
  return fe.Children = {
    map: B,
    forEach: function(S, k, ie) {
      B(
        S,
        function() {
          k.apply(this, arguments);
        },
        ie
      );
    },
    count: function(S) {
      var k = 0;
      return B(S, function() {
        k++;
      }), k;
    },
    toArray: function(S) {
      return B(S, function(k) {
        return k;
      }) || [];
    },
    only: function(S) {
      if (!J(S))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return S;
    }
  }, fe.Component = _, fe.Fragment = o, fe.Profiler = f, fe.PureComponent = G, fe.StrictMode = c, fe.Suspense = y, fe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, fe.act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, fe.cache = function(S) {
    return function() {
      return S.apply(null, arguments);
    };
  }, fe.cloneElement = function(S, k, ie) {
    if (S == null)
      throw Error(
        "The argument must be a React element, but you passed " + S + "."
      );
    var le = R({}, S.props), W = S.key, se = void 0;
    if (k != null)
      for (re in k.ref !== void 0 && (se = void 0), k.key !== void 0 && (W = "" + k.key), k)
        !L.call(k, re) || re === "key" || re === "__self" || re === "__source" || re === "ref" && k.ref === void 0 || (le[re] = k[re]);
    var re = arguments.length - 2;
    if (re === 1) le.children = ie;
    else if (1 < re) {
      for (var _e = Array(re), Ee = 0; Ee < re; Ee++)
        _e[Ee] = arguments[Ee + 2];
      le.children = _e;
    }
    return K(S.type, W, void 0, void 0, se, le);
  }, fe.createContext = function(S) {
    return S = {
      $$typeof: h,
      _currentValue: S,
      _currentValue2: S,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, S.Provider = S, S.Consumer = {
      $$typeof: d,
      _context: S
    }, S;
  }, fe.createElement = function(S, k, ie) {
    var le, W = {}, se = null;
    if (k != null)
      for (le in k.key !== void 0 && (se = "" + k.key), k)
        L.call(k, le) && le !== "key" && le !== "__self" && le !== "__source" && (W[le] = k[le]);
    var re = arguments.length - 2;
    if (re === 1) W.children = ie;
    else if (1 < re) {
      for (var _e = Array(re), Ee = 0; Ee < re; Ee++)
        _e[Ee] = arguments[Ee + 2];
      W.children = _e;
    }
    if (S && S.defaultProps)
      for (le in re = S.defaultProps, re)
        W[le] === void 0 && (W[le] = re[le]);
    return K(S, se, void 0, void 0, null, W);
  }, fe.createRef = function() {
    return { current: null };
  }, fe.forwardRef = function(S) {
    return { $$typeof: g, render: S };
  }, fe.isValidElement = J, fe.lazy = function(S) {
    return {
      $$typeof: x,
      _payload: { _status: -1, _result: S },
      _init: ee
    };
  }, fe.memo = function(S, k) {
    return {
      $$typeof: m,
      type: S,
      compare: k === void 0 ? null : k
    };
  }, fe.startTransition = function(S) {
    var k = V.T, ie = {};
    V.T = ie;
    try {
      var le = S(), W = V.S;
      W !== null && W(ie, le), typeof le == "object" && le !== null && typeof le.then == "function" && le.then(ne, X);
    } catch (se) {
      X(se);
    } finally {
      V.T = k;
    }
  }, fe.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, fe.use = function(S) {
    return V.H.use(S);
  }, fe.useActionState = function(S, k, ie) {
    return V.H.useActionState(S, k, ie);
  }, fe.useCallback = function(S, k) {
    return V.H.useCallback(S, k);
  }, fe.useContext = function(S) {
    return V.H.useContext(S);
  }, fe.useDebugValue = function() {
  }, fe.useDeferredValue = function(S, k) {
    return V.H.useDeferredValue(S, k);
  }, fe.useEffect = function(S, k) {
    return V.H.useEffect(S, k);
  }, fe.useId = function() {
    return V.H.useId();
  }, fe.useImperativeHandle = function(S, k, ie) {
    return V.H.useImperativeHandle(S, k, ie);
  }, fe.useInsertionEffect = function(S, k) {
    return V.H.useInsertionEffect(S, k);
  }, fe.useLayoutEffect = function(S, k) {
    return V.H.useLayoutEffect(S, k);
  }, fe.useMemo = function(S, k) {
    return V.H.useMemo(S, k);
  }, fe.useOptimistic = function(S, k) {
    return V.H.useOptimistic(S, k);
  }, fe.useReducer = function(S, k, ie) {
    return V.H.useReducer(S, k, ie);
  }, fe.useRef = function(S) {
    return V.H.useRef(S);
  }, fe.useState = function(S) {
    return V.H.useState(S);
  }, fe.useSyncExternalStore = function(S, k, ie) {
    return V.H.useSyncExternalStore(
      S,
      k,
      ie
    );
  }, fe.useTransition = function() {
    return V.H.useTransition();
  }, fe.version = "19.0.0", fe;
}
var lv;
function Ko() {
  return lv || (lv = 1, So.exports = Qp()), So.exports;
}
var Eo = { exports: {} }, nt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var av;
function Zp() {
  if (av) return nt;
  av = 1;
  var a = Ko();
  function r(y) {
    var m = "https://react.dev/errors/" + y;
    if (1 < arguments.length) {
      m += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var x = 2; x < arguments.length; x++)
        m += "&args[]=" + encodeURIComponent(arguments[x]);
    }
    return "Minified React error #" + y + "; visit " + m + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var c = {
    d: {
      f: o,
      r: function() {
        throw Error(r(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, f = Symbol.for("react.portal");
  function d(y, m, x) {
    var T = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: f,
      key: T == null ? null : "" + T,
      children: y,
      containerInfo: m,
      implementation: x
    };
  }
  var h = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function g(y, m) {
    if (y === "font") return "";
    if (typeof m == "string")
      return m === "use-credentials" ? m : "";
  }
  return nt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = c, nt.createPortal = function(y, m) {
    var x = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!m || m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11)
      throw Error(r(299));
    return d(y, m, null, x);
  }, nt.flushSync = function(y) {
    var m = h.T, x = c.p;
    try {
      if (h.T = null, c.p = 2, y) return y();
    } finally {
      h.T = m, c.p = x, c.d.f();
    }
  }, nt.preconnect = function(y, m) {
    typeof y == "string" && (m ? (m = m.crossOrigin, m = typeof m == "string" ? m === "use-credentials" ? m : "" : void 0) : m = null, c.d.C(y, m));
  }, nt.prefetchDNS = function(y) {
    typeof y == "string" && c.d.D(y);
  }, nt.preinit = function(y, m) {
    if (typeof y == "string" && m && typeof m.as == "string") {
      var x = m.as, T = g(x, m.crossOrigin), D = typeof m.integrity == "string" ? m.integrity : void 0, M = typeof m.fetchPriority == "string" ? m.fetchPriority : void 0;
      x === "style" ? c.d.S(
        y,
        typeof m.precedence == "string" ? m.precedence : void 0,
        {
          crossOrigin: T,
          integrity: D,
          fetchPriority: M
        }
      ) : x === "script" && c.d.X(y, {
        crossOrigin: T,
        integrity: D,
        fetchPriority: M,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0
      });
    }
  }, nt.preinitModule = function(y, m) {
    if (typeof y == "string")
      if (typeof m == "object" && m !== null) {
        if (m.as == null || m.as === "script") {
          var x = g(
            m.as,
            m.crossOrigin
          );
          c.d.M(y, {
            crossOrigin: x,
            integrity: typeof m.integrity == "string" ? m.integrity : void 0,
            nonce: typeof m.nonce == "string" ? m.nonce : void 0
          });
        }
      } else m == null && c.d.M(y);
  }, nt.preload = function(y, m) {
    if (typeof y == "string" && typeof m == "object" && m !== null && typeof m.as == "string") {
      var x = m.as, T = g(x, m.crossOrigin);
      c.d.L(y, x, {
        crossOrigin: T,
        integrity: typeof m.integrity == "string" ? m.integrity : void 0,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0,
        type: typeof m.type == "string" ? m.type : void 0,
        fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0,
        referrerPolicy: typeof m.referrerPolicy == "string" ? m.referrerPolicy : void 0,
        imageSrcSet: typeof m.imageSrcSet == "string" ? m.imageSrcSet : void 0,
        imageSizes: typeof m.imageSizes == "string" ? m.imageSizes : void 0,
        media: typeof m.media == "string" ? m.media : void 0
      });
    }
  }, nt.preloadModule = function(y, m) {
    if (typeof y == "string")
      if (m) {
        var x = g(m.as, m.crossOrigin);
        c.d.m(y, {
          as: typeof m.as == "string" && m.as !== "script" ? m.as : void 0,
          crossOrigin: x,
          integrity: typeof m.integrity == "string" ? m.integrity : void 0
        });
      } else c.d.m(y);
  }, nt.requestFormReset = function(y) {
    c.d.r(y);
  }, nt.unstable_batchedUpdates = function(y, m) {
    return y(m);
  }, nt.useFormState = function(y, m, x) {
    return h.H.useFormState(y, m, x);
  }, nt.useFormStatus = function() {
    return h.H.useHostTransitionStatus();
  }, nt.version = "19.0.0", nt;
}
var iv;
function Gv() {
  if (iv) return Eo.exports;
  iv = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), Eo.exports = Zp(), Eo.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uv;
function Kp() {
  if (uv) return bi;
  uv = 1;
  var a = Vp(), r = Ko(), o = Gv();
  function c(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  var d = Symbol.for("react.element"), h = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), m = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), T = Symbol.for("react.provider"), D = Symbol.for("react.consumer"), M = Symbol.for("react.context"), R = Symbol.for("react.forward_ref"), O = Symbol.for("react.suspense"), _ = Symbol.for("react.suspense_list"), H = Symbol.for("react.memo"), G = Symbol.for("react.lazy"), Z = Symbol.for("react.offscreen"), Q = Symbol.for("react.memo_cache_sentinel"), V = Symbol.iterator;
  function L(e) {
    return e === null || typeof e != "object" ? null : (e = V && e[V] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var K = Symbol.for("react.client.reference");
  function oe(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === K ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case y:
        return "Fragment";
      case g:
        return "Portal";
      case x:
        return "Profiler";
      case m:
        return "StrictMode";
      case O:
        return "Suspense";
      case _:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case M:
          return (e.displayName || "Context") + ".Provider";
        case D:
          return (e._context.displayName || "Context") + ".Consumer";
        case R:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case H:
          return t = e.displayName || null, t !== null ? t : oe(e.type) || "Memo";
        case G:
          t = e._payload, e = e._init;
          try {
            return oe(e(t));
          } catch {
          }
      }
    return null;
  }
  var J = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, $ = Object.assign, Se, Re;
  function de(e) {
    if (Se === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        Se = t && t[1] || "", Re = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Se + e + Re;
  }
  var me = !1;
  function ge(e, t) {
    if (!e || me) return "";
    me = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var Y = function() {
                throw Error();
              };
              if (Object.defineProperty(Y.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(Y, []);
                } catch (j) {
                  var z = j;
                }
                Reflect.construct(e, [], Y);
              } else {
                try {
                  Y.call();
                } catch (j) {
                  z = j;
                }
                e.call(Y.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (j) {
                z = j;
              }
              (Y = e()) && typeof Y.catch == "function" && Y.catch(function() {
              });
            }
          } catch (j) {
            if (j && z && typeof j.stack == "string")
              return [j.stack, z.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var i = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      i && i.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = l.DetermineComponentFrameRoot(), s = u[0], v = u[1];
      if (s && v) {
        var b = s.split(`
`), w = v.split(`
`);
        for (i = l = 0; l < b.length && !b[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; i < w.length && !w[i].includes(
          "DetermineComponentFrameRoot"
        ); )
          i++;
        if (l === b.length || i === w.length)
          for (l = b.length - 1, i = w.length - 1; 1 <= l && 0 <= i && b[l] !== w[i]; )
            i--;
        for (; 1 <= l && 0 <= i; l--, i--)
          if (b[l] !== w[i]) {
            if (l !== 1 || i !== 1)
              do
                if (l--, i--, 0 > i || b[l] !== w[i]) {
                  var U = `
` + b[l].replace(" at new ", " at ");
                  return e.displayName && U.includes("<anonymous>") && (U = U.replace("<anonymous>", e.displayName)), U;
                }
              while (1 <= l && 0 <= i);
            break;
          }
      }
    } finally {
      me = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? de(n) : "";
  }
  function B(e) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return de(e.type);
      case 16:
        return de("Lazy");
      case 13:
        return de("Suspense");
      case 19:
        return de("SuspenseList");
      case 0:
      case 15:
        return e = ge(e.type, !1), e;
      case 11:
        return e = ge(e.type.render, !1), e;
      case 1:
        return e = ge(e.type, !0), e;
      default:
        return "";
    }
  }
  function ee(e) {
    try {
      var t = "";
      do
        t += B(e), e = e.return;
      while (e);
      return t;
    } catch (n) {
      return `
Error generating stack: ` + n.message + `
` + n.stack;
    }
  }
  function X(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, t.flags & 4098 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function ne(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function S(e) {
    if (X(e) !== e)
      throw Error(c(188));
  }
  function k(e) {
    var t = e.alternate;
    if (!t) {
      if (t = X(e), t === null) throw Error(c(188));
      return t !== e ? null : e;
    }
    for (var n = e, l = t; ; ) {
      var i = n.return;
      if (i === null) break;
      var u = i.alternate;
      if (u === null) {
        if (l = i.return, l !== null) {
          n = l;
          continue;
        }
        break;
      }
      if (i.child === u.child) {
        for (u = i.child; u; ) {
          if (u === n) return S(i), e;
          if (u === l) return S(i), t;
          u = u.sibling;
        }
        throw Error(c(188));
      }
      if (n.return !== l.return) n = i, l = u;
      else {
        for (var s = !1, v = i.child; v; ) {
          if (v === n) {
            s = !0, n = i, l = u;
            break;
          }
          if (v === l) {
            s = !0, l = i, n = u;
            break;
          }
          v = v.sibling;
        }
        if (!s) {
          for (v = u.child; v; ) {
            if (v === n) {
              s = !0, n = u, l = i;
              break;
            }
            if (v === l) {
              s = !0, l = u, n = i;
              break;
            }
            v = v.sibling;
          }
          if (!s) throw Error(c(189));
        }
      }
      if (n.alternate !== l) throw Error(c(190));
    }
    if (n.tag !== 3) throw Error(c(188));
    return n.stateNode.current === n ? e : t;
  }
  function ie(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = ie(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var le = Array.isArray, W = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, se = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, re = [], _e = -1;
  function Ee(e) {
    return { current: e };
  }
  function je(e) {
    0 > _e || (e.current = re[_e], re[_e] = null, _e--);
  }
  function Ce(e, t) {
    _e++, re[_e] = e.current, e.current = t;
  }
  var dt = Ee(null), yn = Ee(null), it = Ee(null), Jn = Ee(null);
  function Tl(e, t) {
    switch (Ce(it, t), Ce(yn, e), Ce(dt, null), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) && (t = t.namespaceURI) ? Rh(t) : 0;
        break;
      default:
        if (e = e === 8 ? t.parentNode : t, t = e.tagName, e = e.namespaceURI)
          e = Rh(e), t = Ch(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    je(dt), Ce(dt, t);
  }
  function gn() {
    je(dt), je(yn), je(it);
  }
  function Sa(e) {
    e.memoizedState !== null && Ce(Jn, e);
    var t = dt.current, n = Ch(t, e.type);
    t !== n && (Ce(yn, e), Ce(dt, n));
  }
  function Ol(e) {
    yn.current === e && (je(dt), je(yn)), Jn.current === e && (je(Jn), hi._currentValue = se);
  }
  var pn = Object.prototype.hasOwnProperty, or = a.unstable_scheduleCallback, sr = a.unstable_cancelCallback, py = a.unstable_shouldYield, by = a.unstable_requestPaint, Bt = a.unstable_now, xy = a.unstable_getCurrentPriorityLevel, ms = a.unstable_ImmediatePriority, ys = a.unstable_UserBlockingPriority, Ai = a.unstable_NormalPriority, Sy = a.unstable_LowPriority, gs = a.unstable_IdlePriority, Ey = a.log, Ay = a.unstable_setDisableYieldValue, Ea = null, ht = null;
  function wy(e) {
    if (ht && typeof ht.onCommitFiberRoot == "function")
      try {
        ht.onCommitFiberRoot(
          Ea,
          e,
          void 0,
          (e.current.flags & 128) === 128
        );
      } catch {
      }
  }
  function bn(e) {
    if (typeof Ey == "function" && Ay(e), ht && typeof ht.setStrictMode == "function")
      try {
        ht.setStrictMode(Ea, e);
      } catch {
      }
  }
  var vt = Math.clz32 ? Math.clz32 : Ry, Ty = Math.log, Oy = Math.LN2;
  function Ry(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Ty(e) / Oy | 0) | 0;
  }
  var wi = 128, Ti = 4194304;
  function Wn(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194176;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Oi(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var l = 0, i = e.suspendedLanes, u = e.pingedLanes, s = e.warmLanes;
    e = e.finishedLanes !== 0;
    var v = n & 134217727;
    return v !== 0 ? (n = v & ~i, n !== 0 ? l = Wn(n) : (u &= v, u !== 0 ? l = Wn(u) : e || (s = v & ~s, s !== 0 && (l = Wn(s))))) : (v = n & ~i, v !== 0 ? l = Wn(v) : u !== 0 ? l = Wn(u) : e || (s = n & ~s, s !== 0 && (l = Wn(s)))), l === 0 ? 0 : t !== 0 && t !== l && !(t & i) && (i = l & -l, s = t & -t, i >= s || i === 32 && (s & 4194176) !== 0) ? t : l;
  }
  function Aa(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Cy(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
        return t + 250;
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function ps() {
    var e = wi;
    return wi <<= 1, !(wi & 4194176) && (wi = 128), e;
  }
  function bs() {
    var e = Ti;
    return Ti <<= 1, !(Ti & 62914560) && (Ti = 4194304), e;
  }
  function fr(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function wa(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function My(e, t, n, l, i, u) {
    var s = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var v = e.entanglements, b = e.expirationTimes, w = e.hiddenUpdates;
    for (n = s & ~n; 0 < n; ) {
      var U = 31 - vt(n), Y = 1 << U;
      v[U] = 0, b[U] = -1;
      var z = w[U];
      if (z !== null)
        for (w[U] = null, U = 0; U < z.length; U++) {
          var j = z[U];
          j !== null && (j.lane &= -536870913);
        }
      n &= ~Y;
    }
    l !== 0 && xs(e, l, 0), u !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(s & ~t));
  }
  function xs(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - vt(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 4194218;
  }
  function Ss(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var l = 31 - vt(n), i = 1 << l;
      i & t | e[l] & t && (e[l] |= t), n &= ~i;
    }
  }
  function Es(e) {
    return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
  }
  function As() {
    var e = W.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Zh(e.type));
  }
  function Dy(e, t) {
    var n = W.p;
    try {
      return W.p = e, t();
    } finally {
      W.p = n;
    }
  }
  var xn = Math.random().toString(36).slice(2), et = "__reactFiber$" + xn, ut = "__reactProps$" + xn, Rl = "__reactContainer$" + xn, dr = "__reactEvents$" + xn, Ny = "__reactListeners$" + xn, zy = "__reactHandles$" + xn, ws = "__reactResources$" + xn, Ta = "__reactMarker$" + xn;
  function hr(e) {
    delete e[et], delete e[ut], delete e[dr], delete e[Ny], delete e[zy];
  }
  function $n(e) {
    var t = e[et];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Rl] || n[et]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = Nh(e); e !== null; ) {
            if (n = e[et]) return n;
            e = Nh(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Cl(e) {
    if (e = e[et] || e[Rl]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Oa(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(c(33));
  }
  function Ml(e) {
    var t = e[ws];
    return t || (t = e[ws] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Ze(e) {
    e[Ta] = !0;
  }
  var Ts = /* @__PURE__ */ new Set(), Os = {};
  function Fn(e, t) {
    Dl(e, t), Dl(e + "Capture", t);
  }
  function Dl(e, t) {
    for (Os[e] = t, e = 0; e < t.length; e++)
      Ts.add(t[e]);
  }
  var Jt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), _y = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Rs = {}, Cs = {};
  function jy(e) {
    return pn.call(Cs, e) ? !0 : pn.call(Rs, e) ? !1 : _y.test(e) ? Cs[e] = !0 : (Rs[e] = !0, !1);
  }
  function Ri(e, t, n) {
    if (jy(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function Ci(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + n);
    }
  }
  function Wt(e, t, n, l) {
    if (l === null) e.removeAttribute(n);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + l);
    }
  }
  function xt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Ms(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Uy(e) {
    var t = Ms(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    ), l = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var i = n.get, u = n.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return i.call(this);
        },
        set: function(s) {
          l = "" + s, u.call(this, s);
        }
      }), Object.defineProperty(e, t, {
        enumerable: n.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(s) {
          l = "" + s;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Mi(e) {
    e._valueTracker || (e._valueTracker = Uy(e));
  }
  function Ds(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), l = "";
    return e && (l = Ms(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Di(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Hy = /[\n"\\]/g;
  function St(e) {
    return e.replace(
      Hy,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function vr(e, t, n, l, i, u, s, v) {
    e.name = "", s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.type = s : e.removeAttribute("type"), t != null ? s === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + xt(t)) : e.value !== "" + xt(t) && (e.value = "" + xt(t)) : s !== "submit" && s !== "reset" || e.removeAttribute("value"), t != null ? mr(e, s, xt(t)) : n != null ? mr(e, s, xt(n)) : l != null && e.removeAttribute("value"), i == null && u != null && (e.defaultChecked = !!u), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean" ? e.name = "" + xt(v) : e.removeAttribute("name");
  }
  function Ns(e, t, n, l, i, u, s, v) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || t != null))
        return;
      n = n != null ? "" + xt(n) : "", t = t != null ? "" + xt(t) : n, v || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? i, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = v ? e.checked : !!l, e.defaultChecked = !!l, s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (e.name = s);
  }
  function mr(e, t, n) {
    t === "number" && Di(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function Nl(e, t, n, l) {
    if (e = e.options, t) {
      t = {};
      for (var i = 0; i < n.length; i++)
        t["$" + n[i]] = !0;
      for (n = 0; n < e.length; n++)
        i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && l && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + xt(n), t = null, i = 0; i < e.length; i++) {
        if (e[i].value === n) {
          e[i].selected = !0, l && (e[i].defaultSelected = !0);
          return;
        }
        t !== null || e[i].disabled || (t = e[i]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function zs(e, t, n) {
    if (t != null && (t = "" + xt(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + xt(n) : "";
  }
  function _s(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(c(92));
        if (le(l)) {
          if (1 < l.length) throw Error(c(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), t = n;
    }
    n = xt(t), e.defaultValue = n, l = e.textContent, l === n && l !== "" && l !== null && (e.value = l);
  }
  function zl(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Ly = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function js(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Ly.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function Us(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(c(62));
    if (e = e.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var i in t)
        l = t[i], t.hasOwnProperty(i) && n[i] !== l && js(e, i, l);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && js(e, u, t[u]);
  }
  function yr(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var By = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), qy = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ni(e) {
    return qy.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var gr = null;
  function pr(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var _l = null, jl = null;
  function Hs(e) {
    var t = Cl(e);
    if (t && (e = t.stateNode)) {
      var n = e[ut] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (vr(
            e,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), t = n.name, n.type === "radio" && t != null) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + St(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var i = l[ut] || null;
                if (!i) throw Error(c(90));
                vr(
                  l,
                  i.value,
                  i.defaultValue,
                  i.defaultValue,
                  i.checked,
                  i.defaultChecked,
                  i.type,
                  i.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              l = n[t], l.form === e.form && Ds(l);
          }
          break e;
        case "textarea":
          zs(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && Nl(e, !!n.multiple, t, !1);
      }
    }
  }
  var br = !1;
  function Ls(e, t, n) {
    if (br) return e(t, n);
    br = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (br = !1, (_l !== null || jl !== null) && (vu(), _l && (t = _l, e = jl, jl = _l = null, Hs(t), e)))
        for (t = 0; t < e.length; t++) Hs(e[t]);
    }
  }
  function Ra(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[ut] || null;
    if (l === null) return null;
    n = l[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (l = !l.disabled) || (e = e.type, l = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !l;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function")
      throw Error(
        c(231, t, typeof n)
      );
    return n;
  }
  var xr = !1;
  if (Jt)
    try {
      var Ca = {};
      Object.defineProperty(Ca, "passive", {
        get: function() {
          xr = !0;
        }
      }), window.addEventListener("test", Ca, Ca), window.removeEventListener("test", Ca, Ca);
    } catch {
      xr = !1;
    }
  var Sn = null, Sr = null, zi = null;
  function Bs() {
    if (zi) return zi;
    var e, t = Sr, n = t.length, l, i = "value" in Sn ? Sn.value : Sn.textContent, u = i.length;
    for (e = 0; e < n && t[e] === i[e]; e++) ;
    var s = n - e;
    for (l = 1; l <= s && t[n - l] === i[u - l]; l++) ;
    return zi = i.slice(e, 1 < l ? 1 - l : void 0);
  }
  function _i(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function ji() {
    return !0;
  }
  function qs() {
    return !1;
  }
  function rt(e) {
    function t(n, l, i, u, s) {
      this._reactName = n, this._targetInst = i, this.type = l, this.nativeEvent = u, this.target = s, this.currentTarget = null;
      for (var v in e)
        e.hasOwnProperty(v) && (n = e[v], this[v] = n ? n(u) : u[v]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? ji : qs, this.isPropagationStopped = qs, this;
    }
    return $(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = ji);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = ji);
      },
      persist: function() {
      },
      isPersistent: ji
    }), t;
  }
  var Pn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ui = rt(Pn), Ma = $({}, Pn, { view: 0, detail: 0 }), Yy = rt(Ma), Er, Ar, Da, Hi = $({}, Ma, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Tr,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Da && (Da && e.type === "mousemove" ? (Er = e.screenX - Da.screenX, Ar = e.screenY - Da.screenY) : Ar = Er = 0, Da = e), Er);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Ar;
    }
  }), Ys = rt(Hi), Gy = $({}, Hi, { dataTransfer: 0 }), ky = rt(Gy), Xy = $({}, Ma, { relatedTarget: 0 }), wr = rt(Xy), Vy = $({}, Pn, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Qy = rt(Vy), Zy = $({}, Pn, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Ky = rt(Zy), Jy = $({}, Pn, { data: 0 }), Gs = rt(Jy), Wy = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, $y = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Fy = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Py(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Fy[e]) ? !!t[e] : !1;
  }
  function Tr() {
    return Py;
  }
  var Iy = $({}, Ma, {
    key: function(e) {
      if (e.key) {
        var t = Wy[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = _i(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? $y[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Tr,
    charCode: function(e) {
      return e.type === "keypress" ? _i(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? _i(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), eg = rt(Iy), tg = $({}, Hi, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), ks = rt(tg), ng = $({}, Ma, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Tr
  }), lg = rt(ng), ag = $({}, Pn, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ig = rt(ag), ug = $({}, Hi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), rg = rt(ug), cg = $({}, Pn, {
    newState: 0,
    oldState: 0
  }), og = rt(cg), sg = [9, 13, 27, 32], Or = Jt && "CompositionEvent" in window, Na = null;
  Jt && "documentMode" in document && (Na = document.documentMode);
  var fg = Jt && "TextEvent" in window && !Na, Xs = Jt && (!Or || Na && 8 < Na && 11 >= Na), Vs = " ", Qs = !1;
  function Zs(e, t) {
    switch (e) {
      case "keyup":
        return sg.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ks(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ul = !1;
  function dg(e, t) {
    switch (e) {
      case "compositionend":
        return Ks(t);
      case "keypress":
        return t.which !== 32 ? null : (Qs = !0, Vs);
      case "textInput":
        return e = t.data, e === Vs && Qs ? null : e;
      default:
        return null;
    }
  }
  function hg(e, t) {
    if (Ul)
      return e === "compositionend" || !Or && Zs(e, t) ? (e = Bs(), zi = Sr = Sn = null, Ul = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Xs && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var vg = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Js(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!vg[e.type] : t === "textarea";
  }
  function Ws(e, t, n, l) {
    _l ? jl ? jl.push(l) : jl = [l] : _l = l, t = bu(t, "onChange"), 0 < t.length && (n = new Ui(
      "onChange",
      "change",
      null,
      n,
      l
    ), e.push({ event: n, listeners: t }));
  }
  var za = null, _a = null;
  function mg(e) {
    Eh(e, 0);
  }
  function Li(e) {
    var t = Oa(e);
    if (Ds(t)) return e;
  }
  function $s(e, t) {
    if (e === "change") return t;
  }
  var Fs = !1;
  if (Jt) {
    var Rr;
    if (Jt) {
      var Cr = "oninput" in document;
      if (!Cr) {
        var Ps = document.createElement("div");
        Ps.setAttribute("oninput", "return;"), Cr = typeof Ps.oninput == "function";
      }
      Rr = Cr;
    } else Rr = !1;
    Fs = Rr && (!document.documentMode || 9 < document.documentMode);
  }
  function Is() {
    za && (za.detachEvent("onpropertychange", ef), _a = za = null);
  }
  function ef(e) {
    if (e.propertyName === "value" && Li(_a)) {
      var t = [];
      Ws(
        t,
        _a,
        e,
        pr(e)
      ), Ls(mg, t);
    }
  }
  function yg(e, t, n) {
    e === "focusin" ? (Is(), za = t, _a = n, za.attachEvent("onpropertychange", ef)) : e === "focusout" && Is();
  }
  function gg(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Li(_a);
  }
  function pg(e, t) {
    if (e === "click") return Li(t);
  }
  function bg(e, t) {
    if (e === "input" || e === "change")
      return Li(t);
  }
  function xg(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var mt = typeof Object.is == "function" ? Object.is : xg;
  function ja(e, t) {
    if (mt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var i = n[l];
      if (!pn.call(t, i) || !mt(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  function tf(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function nf(e, t) {
    var n = tf(e);
    e = 0;
    for (var l; n; ) {
      if (n.nodeType === 3) {
        if (l = e + n.textContent.length, e <= t && l >= t)
          return { node: n, offset: t - e };
        e = l;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = tf(n);
    }
  }
  function lf(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? lf(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function af(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Di(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Di(e.document);
    }
    return t;
  }
  function Mr(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Sg(e, t) {
    var n = af(t);
    t = e.focusedElem;
    var l = e.selectionRange;
    if (n !== t && t && t.ownerDocument && lf(t.ownerDocument.documentElement, t)) {
      if (l !== null && Mr(t)) {
        if (e = l.start, n = l.end, n === void 0 && (n = e), "selectionStart" in t)
          t.selectionStart = e, t.selectionEnd = Math.min(
            n,
            t.value.length
          );
        else if (n = (e = t.ownerDocument || document) && e.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var i = t.textContent.length, u = Math.min(l.start, i);
          l = l.end === void 0 ? u : Math.min(l.end, i), !n.extend && u > l && (i = l, l = u, u = i), i = nf(t, u);
          var s = nf(
            t,
            l
          );
          i && s && (n.rangeCount !== 1 || n.anchorNode !== i.node || n.anchorOffset !== i.offset || n.focusNode !== s.node || n.focusOffset !== s.offset) && (e = e.createRange(), e.setStart(i.node, i.offset), n.removeAllRanges(), u > l ? (n.addRange(e), n.extend(s.node, s.offset)) : (e.setEnd(
            s.node,
            s.offset
          ), n.addRange(e)));
        }
      }
      for (e = [], n = t; n = n.parentNode; )
        n.nodeType === 1 && e.push({
          element: n,
          left: n.scrollLeft,
          top: n.scrollTop
        });
      for (typeof t.focus == "function" && t.focus(), t = 0; t < e.length; t++)
        n = e[t], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var Eg = Jt && "documentMode" in document && 11 >= document.documentMode, Hl = null, Dr = null, Ua = null, Nr = !1;
  function uf(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Nr || Hl == null || Hl !== Di(l) || (l = Hl, "selectionStart" in l && Mr(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), Ua && ja(Ua, l) || (Ua = l, l = bu(Dr, "onSelect"), 0 < l.length && (t = new Ui(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: l }), t.target = Hl)));
  }
  function In(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Ll = {
    animationend: In("Animation", "AnimationEnd"),
    animationiteration: In("Animation", "AnimationIteration"),
    animationstart: In("Animation", "AnimationStart"),
    transitionrun: In("Transition", "TransitionRun"),
    transitionstart: In("Transition", "TransitionStart"),
    transitioncancel: In("Transition", "TransitionCancel"),
    transitionend: In("Transition", "TransitionEnd")
  }, zr = {}, rf = {};
  Jt && (rf = document.createElement("div").style, "AnimationEvent" in window || (delete Ll.animationend.animation, delete Ll.animationiteration.animation, delete Ll.animationstart.animation), "TransitionEvent" in window || delete Ll.transitionend.transition);
  function el(e) {
    if (zr[e]) return zr[e];
    if (!Ll[e]) return e;
    var t = Ll[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in rf)
        return zr[e] = t[n];
    return e;
  }
  var cf = el("animationend"), of = el("animationiteration"), sf = el("animationstart"), Ag = el("transitionrun"), wg = el("transitionstart"), Tg = el("transitioncancel"), ff = el("transitionend"), df = /* @__PURE__ */ new Map(), hf = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(
    " "
  );
  function zt(e, t) {
    df.set(e, t), Fn(t, [e]);
  }
  var Et = [], Bl = 0, _r = 0;
  function Bi() {
    for (var e = Bl, t = _r = Bl = 0; t < e; ) {
      var n = Et[t];
      Et[t++] = null;
      var l = Et[t];
      Et[t++] = null;
      var i = Et[t];
      Et[t++] = null;
      var u = Et[t];
      if (Et[t++] = null, l !== null && i !== null) {
        var s = l.pending;
        s === null ? i.next = i : (i.next = s.next, s.next = i), l.pending = i;
      }
      u !== 0 && vf(n, i, u);
    }
  }
  function qi(e, t, n, l) {
    Et[Bl++] = e, Et[Bl++] = t, Et[Bl++] = n, Et[Bl++] = l, _r |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function jr(e, t, n, l) {
    return qi(e, t, n, l), Yi(e);
  }
  function En(e, t) {
    return qi(e, null, null, t), Yi(e);
  }
  function vf(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var i = !1, u = e.return; u !== null; )
      u.childLanes |= n, l = u.alternate, l !== null && (l.childLanes |= n), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (i = !0)), e = u, u = u.return;
    i && t !== null && e.tag === 3 && (u = e.stateNode, i = 31 - vt(n), u = u.hiddenUpdates, e = u[i], e === null ? u[i] = [t] : e.push(t), t.lane = n | 536870912);
  }
  function Yi(e) {
    if (50 < ui)
      throw ui = 0, Yc = null, Error(c(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var ql = {}, mf = /* @__PURE__ */ new WeakMap();
  function At(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = mf.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: ee(t)
      }, mf.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: ee(t)
    };
  }
  var Yl = [], Gl = 0, Gi = null, ki = 0, wt = [], Tt = 0, tl = null, $t = 1, Ft = "";
  function nl(e, t) {
    Yl[Gl++] = ki, Yl[Gl++] = Gi, Gi = e, ki = t;
  }
  function yf(e, t, n) {
    wt[Tt++] = $t, wt[Tt++] = Ft, wt[Tt++] = tl, tl = e;
    var l = $t;
    e = Ft;
    var i = 32 - vt(l) - 1;
    l &= ~(1 << i), n += 1;
    var u = 32 - vt(t) + i;
    if (30 < u) {
      var s = i - i % 5;
      u = (l & (1 << s) - 1).toString(32), l >>= s, i -= s, $t = 1 << 32 - vt(t) + i | n << i | l, Ft = u + e;
    } else
      $t = 1 << u | n << i | l, Ft = e;
  }
  function Ur(e) {
    e.return !== null && (nl(e, 1), yf(e, 1, 0));
  }
  function Hr(e) {
    for (; e === Gi; )
      Gi = Yl[--Gl], Yl[Gl] = null, ki = Yl[--Gl], Yl[Gl] = null;
    for (; e === tl; )
      tl = wt[--Tt], wt[Tt] = null, Ft = wt[--Tt], wt[Tt] = null, $t = wt[--Tt], wt[Tt] = null;
  }
  var lt = null, Fe = null, Ae = !1, _t = null, qt = !1, Lr = Error(c(519));
  function ll(e) {
    var t = Error(c(418, ""));
    throw Ba(At(t, e)), Lr;
  }
  function gf(e) {
    var t = e.stateNode, n = e.type, l = e.memoizedProps;
    switch (t[et] = e, t[ut] = l, n) {
      case "dialog":
        be("cancel", t), be("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        be("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < ci.length; n++)
          be(ci[n], t);
        break;
      case "source":
        be("error", t);
        break;
      case "img":
      case "image":
      case "link":
        be("error", t), be("load", t);
        break;
      case "details":
        be("toggle", t);
        break;
      case "input":
        be("invalid", t), Ns(
          t,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        ), Mi(t);
        break;
      case "select":
        be("invalid", t);
        break;
      case "textarea":
        be("invalid", t), _s(t, l.value, l.defaultValue, l.children), Mi(t);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || Oh(t.textContent, n) ? (l.popover != null && (be("beforetoggle", t), be("toggle", t)), l.onScroll != null && be("scroll", t), l.onScrollEnd != null && be("scrollend", t), l.onClick != null && (t.onclick = xu), t = !0) : t = !1, t || ll(e);
  }
  function pf(e) {
    for (lt = e.return; lt; )
      switch (lt.tag) {
        case 3:
        case 27:
          qt = !0;
          return;
        case 5:
        case 13:
          qt = !1;
          return;
        default:
          lt = lt.return;
      }
  }
  function Ha(e) {
    if (e !== lt) return !1;
    if (!Ae) return pf(e), Ae = !0, !1;
    var t = !1, n;
    if ((n = e.tag !== 3 && e.tag !== 27) && ((n = e.tag === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || lo(e.type, e.memoizedProps)), n = !n), n && (t = !0), t && Fe && ll(e), pf(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(c(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (n = e.data, n === "/$") {
              if (t === 0) {
                Fe = Ut(e.nextSibling);
                break e;
              }
              t--;
            } else
              n !== "$" && n !== "$!" && n !== "$?" || t++;
          e = e.nextSibling;
        }
        Fe = null;
      }
    } else
      Fe = lt ? Ut(e.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    Fe = lt = null, Ae = !1;
  }
  function Ba(e) {
    _t === null ? _t = [e] : _t.push(e);
  }
  var qa = Error(c(460)), bf = Error(c(474)), Br = { then: function() {
  } };
  function xf(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Xi() {
  }
  function Sf(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Xi, Xi), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, e === qa ? Error(c(483)) : e;
      default:
        if (typeof t.status == "string") t.then(Xi, Xi);
        else {
          if (e = De, e !== null && 100 < e.shellSuspendCounter)
            throw Error(c(482));
          e = t, e.status = "pending", e.then(
            function(l) {
              if (t.status === "pending") {
                var i = t;
                i.status = "fulfilled", i.value = l;
              }
            },
            function(l) {
              if (t.status === "pending") {
                var i = t;
                i.status = "rejected", i.reason = l;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, e === qa ? Error(c(483)) : e;
        }
        throw Ya = t, qa;
    }
  }
  var Ya = null;
  function Ef() {
    if (Ya === null) throw Error(c(459));
    var e = Ya;
    return Ya = null, e;
  }
  var kl = null, Ga = 0;
  function Vi(e) {
    var t = Ga;
    return Ga += 1, kl === null && (kl = []), Sf(kl, e, t);
  }
  function ka(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Qi(e, t) {
    throw t.$$typeof === d ? Error(c(525)) : (e = Object.prototype.toString.call(t), Error(
      c(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Af(e) {
    var t = e._init;
    return t(e._payload);
  }
  function wf(e) {
    function t(C, A) {
      if (e) {
        var N = C.deletions;
        N === null ? (C.deletions = [A], C.flags |= 16) : N.push(A);
      }
    }
    function n(C, A) {
      if (!e) return null;
      for (; A !== null; )
        t(C, A), A = A.sibling;
      return null;
    }
    function l(C) {
      for (var A = /* @__PURE__ */ new Map(); C !== null; )
        C.key !== null ? A.set(C.key, C) : A.set(C.index, C), C = C.sibling;
      return A;
    }
    function i(C, A) {
      return C = jn(C, A), C.index = 0, C.sibling = null, C;
    }
    function u(C, A, N) {
      return C.index = N, e ? (N = C.alternate, N !== null ? (N = N.index, N < A ? (C.flags |= 33554434, A) : N) : (C.flags |= 33554434, A)) : (C.flags |= 1048576, A);
    }
    function s(C) {
      return e && C.alternate === null && (C.flags |= 33554434), C;
    }
    function v(C, A, N, q) {
      return A === null || A.tag !== 6 ? (A = zc(N, C.mode, q), A.return = C, A) : (A = i(A, N), A.return = C, A);
    }
    function b(C, A, N, q) {
      var F = N.type;
      return F === y ? U(
        C,
        A,
        N.props.children,
        q,
        N.key
      ) : A !== null && (A.elementType === F || typeof F == "object" && F !== null && F.$$typeof === G && Af(F) === A.type) ? (A = i(A, N.props), ka(A, N), A.return = C, A) : (A = ou(
        N.type,
        N.key,
        N.props,
        null,
        C.mode,
        q
      ), ka(A, N), A.return = C, A);
    }
    function w(C, A, N, q) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== N.containerInfo || A.stateNode.implementation !== N.implementation ? (A = _c(N, C.mode, q), A.return = C, A) : (A = i(A, N.children || []), A.return = C, A);
    }
    function U(C, A, N, q, F) {
      return A === null || A.tag !== 7 ? (A = hl(
        N,
        C.mode,
        q,
        F
      ), A.return = C, A) : (A = i(A, N), A.return = C, A);
    }
    function Y(C, A, N) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return A = zc(
          "" + A,
          C.mode,
          N
        ), A.return = C, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case h:
            return N = ou(
              A.type,
              A.key,
              A.props,
              null,
              C.mode,
              N
            ), ka(N, A), N.return = C, N;
          case g:
            return A = _c(
              A,
              C.mode,
              N
            ), A.return = C, A;
          case G:
            var q = A._init;
            return A = q(A._payload), Y(C, A, N);
        }
        if (le(A) || L(A))
          return A = hl(
            A,
            C.mode,
            N,
            null
          ), A.return = C, A;
        if (typeof A.then == "function")
          return Y(C, Vi(A), N);
        if (A.$$typeof === M)
          return Y(
            C,
            uu(C, A),
            N
          );
        Qi(C, A);
      }
      return null;
    }
    function z(C, A, N, q) {
      var F = A !== null ? A.key : null;
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return F !== null ? null : v(C, A, "" + N, q);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case h:
            return N.key === F ? b(C, A, N, q) : null;
          case g:
            return N.key === F ? w(C, A, N, q) : null;
          case G:
            return F = N._init, N = F(N._payload), z(C, A, N, q);
        }
        if (le(N) || L(N))
          return F !== null ? null : U(C, A, N, q, null);
        if (typeof N.then == "function")
          return z(
            C,
            A,
            Vi(N),
            q
          );
        if (N.$$typeof === M)
          return z(
            C,
            A,
            uu(C, N),
            q
          );
        Qi(C, N);
      }
      return null;
    }
    function j(C, A, N, q, F) {
      if (typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint")
        return C = C.get(N) || null, v(A, C, "" + q, F);
      if (typeof q == "object" && q !== null) {
        switch (q.$$typeof) {
          case h:
            return C = C.get(
              q.key === null ? N : q.key
            ) || null, b(A, C, q, F);
          case g:
            return C = C.get(
              q.key === null ? N : q.key
            ) || null, w(A, C, q, F);
          case G:
            var ve = q._init;
            return q = ve(q._payload), j(
              C,
              A,
              N,
              q,
              F
            );
        }
        if (le(q) || L(q))
          return C = C.get(N) || null, U(A, C, q, F, null);
        if (typeof q.then == "function")
          return j(
            C,
            A,
            N,
            Vi(q),
            F
          );
        if (q.$$typeof === M)
          return j(
            C,
            A,
            N,
            uu(A, q),
            F
          );
        Qi(A, q);
      }
      return null;
    }
    function te(C, A, N, q) {
      for (var F = null, ve = null, ae = A, ue = A = 0, We = null; ae !== null && ue < N.length; ue++) {
        ae.index > ue ? (We = ae, ae = null) : We = ae.sibling;
        var we = z(
          C,
          ae,
          N[ue],
          q
        );
        if (we === null) {
          ae === null && (ae = We);
          break;
        }
        e && ae && we.alternate === null && t(C, ae), A = u(we, A, ue), ve === null ? F = we : ve.sibling = we, ve = we, ae = We;
      }
      if (ue === N.length)
        return n(C, ae), Ae && nl(C, ue), F;
      if (ae === null) {
        for (; ue < N.length; ue++)
          ae = Y(C, N[ue], q), ae !== null && (A = u(
            ae,
            A,
            ue
          ), ve === null ? F = ae : ve.sibling = ae, ve = ae);
        return Ae && nl(C, ue), F;
      }
      for (ae = l(ae); ue < N.length; ue++)
        We = j(
          ae,
          C,
          ue,
          N[ue],
          q
        ), We !== null && (e && We.alternate !== null && ae.delete(
          We.key === null ? ue : We.key
        ), A = u(
          We,
          A,
          ue
        ), ve === null ? F = We : ve.sibling = We, ve = We);
      return e && ae.forEach(function(Gn) {
        return t(C, Gn);
      }), Ae && nl(C, ue), F;
    }
    function ce(C, A, N, q) {
      if (N == null) throw Error(c(151));
      for (var F = null, ve = null, ae = A, ue = A = 0, We = null, we = N.next(); ae !== null && !we.done; ue++, we = N.next()) {
        ae.index > ue ? (We = ae, ae = null) : We = ae.sibling;
        var Gn = z(C, ae, we.value, q);
        if (Gn === null) {
          ae === null && (ae = We);
          break;
        }
        e && ae && Gn.alternate === null && t(C, ae), A = u(Gn, A, ue), ve === null ? F = Gn : ve.sibling = Gn, ve = Gn, ae = We;
      }
      if (we.done)
        return n(C, ae), Ae && nl(C, ue), F;
      if (ae === null) {
        for (; !we.done; ue++, we = N.next())
          we = Y(C, we.value, q), we !== null && (A = u(we, A, ue), ve === null ? F = we : ve.sibling = we, ve = we);
        return Ae && nl(C, ue), F;
      }
      for (ae = l(ae); !we.done; ue++, we = N.next())
        we = j(ae, C, ue, we.value, q), we !== null && (e && we.alternate !== null && ae.delete(we.key === null ? ue : we.key), A = u(we, A, ue), ve === null ? F = we : ve.sibling = we, ve = we);
      return e && ae.forEach(function(qp) {
        return t(C, qp);
      }), Ae && nl(C, ue), F;
    }
    function qe(C, A, N, q) {
      if (typeof N == "object" && N !== null && N.type === y && N.key === null && (N = N.props.children), typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case h:
            e: {
              for (var F = N.key; A !== null; ) {
                if (A.key === F) {
                  if (F = N.type, F === y) {
                    if (A.tag === 7) {
                      n(
                        C,
                        A.sibling
                      ), q = i(
                        A,
                        N.props.children
                      ), q.return = C, C = q;
                      break e;
                    }
                  } else if (A.elementType === F || typeof F == "object" && F !== null && F.$$typeof === G && Af(F) === A.type) {
                    n(
                      C,
                      A.sibling
                    ), q = i(A, N.props), ka(q, N), q.return = C, C = q;
                    break e;
                  }
                  n(C, A);
                  break;
                } else t(C, A);
                A = A.sibling;
              }
              N.type === y ? (q = hl(
                N.props.children,
                C.mode,
                q,
                N.key
              ), q.return = C, C = q) : (q = ou(
                N.type,
                N.key,
                N.props,
                null,
                C.mode,
                q
              ), ka(q, N), q.return = C, C = q);
            }
            return s(C);
          case g:
            e: {
              for (F = N.key; A !== null; ) {
                if (A.key === F)
                  if (A.tag === 4 && A.stateNode.containerInfo === N.containerInfo && A.stateNode.implementation === N.implementation) {
                    n(
                      C,
                      A.sibling
                    ), q = i(A, N.children || []), q.return = C, C = q;
                    break e;
                  } else {
                    n(C, A);
                    break;
                  }
                else t(C, A);
                A = A.sibling;
              }
              q = _c(N, C.mode, q), q.return = C, C = q;
            }
            return s(C);
          case G:
            return F = N._init, N = F(N._payload), qe(
              C,
              A,
              N,
              q
            );
        }
        if (le(N))
          return te(
            C,
            A,
            N,
            q
          );
        if (L(N)) {
          if (F = L(N), typeof F != "function") throw Error(c(150));
          return N = F.call(N), ce(
            C,
            A,
            N,
            q
          );
        }
        if (typeof N.then == "function")
          return qe(
            C,
            A,
            Vi(N),
            q
          );
        if (N.$$typeof === M)
          return qe(
            C,
            A,
            uu(C, N),
            q
          );
        Qi(C, N);
      }
      return typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint" ? (N = "" + N, A !== null && A.tag === 6 ? (n(C, A.sibling), q = i(A, N), q.return = C, C = q) : (n(C, A), q = zc(N, C.mode, q), q.return = C, C = q), s(C)) : n(C, A);
    }
    return function(C, A, N, q) {
      try {
        Ga = 0;
        var F = qe(
          C,
          A,
          N,
          q
        );
        return kl = null, F;
      } catch (ae) {
        if (ae === qa) throw ae;
        var ve = Mt(29, ae, null, C.mode);
        return ve.lanes = q, ve.return = C, ve;
      } finally {
      }
    };
  }
  var al = wf(!0), Tf = wf(!1), Xl = Ee(null), Zi = Ee(0);
  function Of(e, t) {
    e = on, Ce(Zi, e), Ce(Xl, t), on = e | t.baseLanes;
  }
  function qr() {
    Ce(Zi, on), Ce(Xl, Xl.current);
  }
  function Yr() {
    on = Zi.current, je(Xl), je(Zi);
  }
  var Ot = Ee(null), Yt = null;
  function An(e) {
    var t = e.alternate;
    Ce(Ve, Ve.current & 1), Ce(Ot, e), Yt === null && (t === null || Xl.current !== null || t.memoizedState !== null) && (Yt = e);
  }
  function Rf(e) {
    if (e.tag === 22) {
      if (Ce(Ve, Ve.current), Ce(Ot, e), Yt === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Yt = e);
      }
    } else wn();
  }
  function wn() {
    Ce(Ve, Ve.current), Ce(Ot, Ot.current);
  }
  function Pt(e) {
    je(Ot), Yt === e && (Yt = null), je(Ve);
  }
  var Ve = Ee(0);
  function Ki(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!"))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if (t.flags & 128) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Og = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, l) {
        e.push(l);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, Rg = a.unstable_scheduleCallback, Cg = a.unstable_NormalPriority, Qe = {
    $$typeof: M,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Gr() {
    return {
      controller: new Og(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Xa(e) {
    e.refCount--, e.refCount === 0 && Rg(Cg, function() {
      e.controller.abort();
    });
  }
  var Va = null, kr = 0, Vl = 0, Ql = null;
  function Mg(e, t) {
    if (Va === null) {
      var n = Va = [];
      kr = 0, Vl = Jc(), Ql = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return kr++, t.then(Cf, Cf), t;
  }
  function Cf() {
    if (--kr === 0 && Va !== null) {
      Ql !== null && (Ql.status = "fulfilled");
      var e = Va;
      Va = null, Vl = 0, Ql = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Dg(e, t) {
    var n = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(i) {
        n.push(i);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var i = 0; i < n.length; i++) (0, n[i])(t);
      },
      function(i) {
        for (l.status = "rejected", l.reason = i, i = 0; i < n.length; i++)
          (0, n[i])(void 0);
      }
    ), l;
  }
  var Mf = J.S;
  J.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && Mg(e, t), Mf !== null && Mf(e, t);
  };
  var il = Ee(null);
  function Xr() {
    var e = il.current;
    return e !== null ? e : De.pooledCache;
  }
  function Ji(e, t) {
    t === null ? Ce(il, il.current) : Ce(il, t.pool);
  }
  function Df() {
    var e = Xr();
    return e === null ? null : { parent: Qe._currentValue, pool: e };
  }
  var Tn = 0, he = null, Te = null, Ge = null, Wi = !1, Zl = !1, ul = !1, $i = 0, Qa = 0, Kl = null, Ng = 0;
  function Ye() {
    throw Error(c(321));
  }
  function Vr(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!mt(e[n], t[n])) return !1;
    return !0;
  }
  function Qr(e, t, n, l, i, u) {
    return Tn = u, he = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, J.H = e === null || e.memoizedState === null ? rl : On, ul = !1, u = n(l, i), ul = !1, Zl && (u = zf(
      t,
      n,
      l,
      i
    )), Nf(e), u;
  }
  function Nf(e) {
    J.H = Gt;
    var t = Te !== null && Te.next !== null;
    if (Tn = 0, Ge = Te = he = null, Wi = !1, Qa = 0, Kl = null, t) throw Error(c(300));
    e === null || Ke || (e = e.dependencies, e !== null && iu(e) && (Ke = !0));
  }
  function zf(e, t, n, l) {
    he = e;
    var i = 0;
    do {
      if (Zl && (Kl = null), Qa = 0, Zl = !1, 25 <= i) throw Error(c(301));
      if (i += 1, Ge = Te = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      J.H = cl, u = t(n, l);
    } while (Zl);
    return u;
  }
  function zg() {
    var e = J.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Za(t) : t, e = e.useState()[0], (Te !== null ? Te.memoizedState : null) !== e && (he.flags |= 1024), t;
  }
  function Zr() {
    var e = $i !== 0;
    return $i = 0, e;
  }
  function Kr(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function Jr(e) {
    if (Wi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Wi = !1;
    }
    Tn = 0, Ge = Te = he = null, Zl = !1, Qa = $i = 0, Kl = null;
  }
  function ct() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ge === null ? he.memoizedState = Ge = e : Ge = Ge.next = e, Ge;
  }
  function ke() {
    if (Te === null) {
      var e = he.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Te.next;
    var t = Ge === null ? he.memoizedState : Ge.next;
    if (t !== null)
      Ge = t, Te = e;
    else {
      if (e === null)
        throw he.alternate === null ? Error(c(467)) : Error(c(310));
      Te = e, e = {
        memoizedState: Te.memoizedState,
        baseState: Te.baseState,
        baseQueue: Te.baseQueue,
        queue: Te.queue,
        next: null
      }, Ge === null ? he.memoizedState = Ge = e : Ge = Ge.next = e;
    }
    return Ge;
  }
  var Fi;
  Fi = function() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  };
  function Za(e) {
    var t = Qa;
    return Qa += 1, Kl === null && (Kl = []), e = Sf(Kl, e, t), t = he, (Ge === null ? t.memoizedState : Ge.next) === null && (t = t.alternate, J.H = t === null || t.memoizedState === null ? rl : On), e;
  }
  function Pi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Za(e);
      if (e.$$typeof === M) return tt(e);
    }
    throw Error(c(438, String(e)));
  }
  function Wr(e) {
    var t = null, n = he.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var l = he.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(i) {
          return i.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = Fi(), he.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++)
        n[l] = Q;
    return t.index++, n;
  }
  function It(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ii(e) {
    var t = ke();
    return $r(t, Te, e);
  }
  function $r(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(c(311));
    l.lastRenderedReducer = n;
    var i = e.baseQueue, u = l.pending;
    if (u !== null) {
      if (i !== null) {
        var s = i.next;
        i.next = u.next, u.next = s;
      }
      t.baseQueue = i = u, l.pending = null;
    }
    if (u = e.baseState, i === null) e.memoizedState = u;
    else {
      t = i.next;
      var v = s = null, b = null, w = t, U = !1;
      do {
        var Y = w.lane & -536870913;
        if (Y !== w.lane ? (xe & Y) === Y : (Tn & Y) === Y) {
          var z = w.revertLane;
          if (z === 0)
            b !== null && (b = b.next = {
              lane: 0,
              revertLane: 0,
              action: w.action,
              hasEagerState: w.hasEagerState,
              eagerState: w.eagerState,
              next: null
            }), Y === Vl && (U = !0);
          else if ((Tn & z) === z) {
            w = w.next, z === Vl && (U = !0);
            continue;
          } else
            Y = {
              lane: 0,
              revertLane: w.revertLane,
              action: w.action,
              hasEagerState: w.hasEagerState,
              eagerState: w.eagerState,
              next: null
            }, b === null ? (v = b = Y, s = u) : b = b.next = Y, he.lanes |= z, Un |= z;
          Y = w.action, ul && n(u, Y), u = w.hasEagerState ? w.eagerState : n(u, Y);
        } else
          z = {
            lane: Y,
            revertLane: w.revertLane,
            action: w.action,
            hasEagerState: w.hasEagerState,
            eagerState: w.eagerState,
            next: null
          }, b === null ? (v = b = z, s = u) : b = b.next = z, he.lanes |= Y, Un |= Y;
        w = w.next;
      } while (w !== null && w !== t);
      if (b === null ? s = u : b.next = v, !mt(u, e.memoizedState) && (Ke = !0, U && (n = Ql, n !== null)))
        throw n;
      e.memoizedState = u, e.baseState = s, e.baseQueue = b, l.lastRenderedState = u;
    }
    return i === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function Fr(e) {
    var t = ke(), n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch, i = n.pending, u = t.memoizedState;
    if (i !== null) {
      n.pending = null;
      var s = i = i.next;
      do
        u = e(u, s.action), s = s.next;
      while (s !== i);
      mt(u, t.memoizedState) || (Ke = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, l];
  }
  function _f(e, t, n) {
    var l = he, i = ke(), u = Ae;
    if (u) {
      if (n === void 0) throw Error(c(407));
      n = n();
    } else n = t();
    var s = !mt(
      (Te || i).memoizedState,
      n
    );
    if (s && (i.memoizedState = n, Ke = !0), i = i.queue, ec(Hf.bind(null, l, i, e), [
      e
    ]), i.getSnapshot !== t || s || Ge !== null && Ge.memoizedState.tag & 1) {
      if (l.flags |= 2048, Jl(
        9,
        Uf.bind(
          null,
          l,
          i,
          n,
          t
        ),
        { destroy: void 0 },
        null
      ), De === null) throw Error(c(349));
      u || Tn & 60 || jf(l, t, n);
    }
    return n;
  }
  function jf(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = he.updateQueue, t === null ? (t = Fi(), he.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Uf(e, t, n, l) {
    t.value = n, t.getSnapshot = l, Lf(t) && Bf(e);
  }
  function Hf(e, t, n) {
    return n(function() {
      Lf(t) && Bf(e);
    });
  }
  function Lf(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !mt(e, n);
    } catch {
      return !0;
    }
  }
  function Bf(e) {
    var t = En(e, 2);
    t !== null && at(t, e, 2);
  }
  function Pr(e) {
    var t = ct();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), ul) {
        bn(!0);
        try {
          n();
        } finally {
          bn(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: It,
      lastRenderedState: e
    }, t;
  }
  function qf(e, t, n, l) {
    return e.baseState = n, $r(
      e,
      Te,
      typeof l == "function" ? l : It
    );
  }
  function _g(e, t, n, l, i) {
    if (nu(e)) throw Error(c(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: i,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(s) {
          u.listeners.push(s);
        }
      };
      J.T !== null ? n(!0) : u.isTransition = !1, l(u), n = t.pending, n === null ? (u.next = t.pending = u, Yf(t, u)) : (u.next = n.next, t.pending = n.next = u);
    }
  }
  function Yf(e, t) {
    var n = t.action, l = t.payload, i = e.state;
    if (t.isTransition) {
      var u = J.T, s = {};
      J.T = s;
      try {
        var v = n(i, l), b = J.S;
        b !== null && b(s, v), Gf(e, t, v);
      } catch (w) {
        Ir(e, t, w);
      } finally {
        J.T = u;
      }
    } else
      try {
        u = n(i, l), Gf(e, t, u);
      } catch (w) {
        Ir(e, t, w);
      }
  }
  function Gf(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        kf(e, t, l);
      },
      function(l) {
        return Ir(e, t, l);
      }
    ) : kf(e, t, n);
  }
  function kf(e, t, n) {
    t.status = "fulfilled", t.value = n, Xf(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Yf(e, n)));
  }
  function Ir(e, t, n) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = n, Xf(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function Xf(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Vf(e, t) {
    return t;
  }
  function Qf(e, t) {
    if (Ae) {
      var n = De.formState;
      if (n !== null) {
        e: {
          var l = he;
          if (Ae) {
            if (Fe) {
              t: {
                for (var i = Fe, u = qt; i.nodeType !== 8; ) {
                  if (!u) {
                    i = null;
                    break t;
                  }
                  if (i = Ut(
                    i.nextSibling
                  ), i === null) {
                    i = null;
                    break t;
                  }
                }
                u = i.data, i = u === "F!" || u === "F" ? i : null;
              }
              if (i) {
                Fe = Ut(
                  i.nextSibling
                ), l = i.data === "F!";
                break e;
              }
            }
            ll(l);
          }
          l = !1;
        }
        l && (t = n[0]);
      }
    }
    return n = ct(), n.memoizedState = n.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Vf,
      lastRenderedState: t
    }, n.queue = l, n = od.bind(
      null,
      he,
      l
    ), l.dispatch = n, l = Pr(!1), u = ic.bind(
      null,
      he,
      !1,
      l.queue
    ), l = ct(), i = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = i, n = _g.bind(
      null,
      he,
      i,
      u,
      n
    ), i.dispatch = n, l.memoizedState = e, [t, n, !1];
  }
  function Zf(e) {
    var t = ke();
    return Kf(t, Te, e);
  }
  function Kf(e, t, n) {
    t = $r(
      e,
      t,
      Vf
    )[0], e = Ii(It)[0], t = typeof t == "object" && t !== null && typeof t.then == "function" ? Za(t) : t;
    var l = ke(), i = l.queue, u = i.dispatch;
    return n !== l.memoizedState && (he.flags |= 2048, Jl(
      9,
      jg.bind(null, i, n),
      { destroy: void 0 },
      null
    )), [t, u, e];
  }
  function jg(e, t) {
    e.action = t;
  }
  function Jf(e) {
    var t = ke(), n = Te;
    if (n !== null)
      return Kf(t, n, e);
    ke(), t = t.memoizedState, n = ke();
    var l = n.queue.dispatch;
    return n.memoizedState = e, [t, l, !1];
  }
  function Jl(e, t, n, l) {
    return e = { tag: e, create: t, inst: n, deps: l, next: null }, t = he.updateQueue, t === null && (t = Fi(), he.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (l = n.next, n.next = e, e.next = l, t.lastEffect = e), e;
  }
  function Wf() {
    return ke().memoizedState;
  }
  function eu(e, t, n, l) {
    var i = ct();
    he.flags |= e, i.memoizedState = Jl(
      1 | t,
      n,
      { destroy: void 0 },
      l === void 0 ? null : l
    );
  }
  function tu(e, t, n, l) {
    var i = ke();
    l = l === void 0 ? null : l;
    var u = i.memoizedState.inst;
    Te !== null && l !== null && Vr(l, Te.memoizedState.deps) ? i.memoizedState = Jl(t, n, u, l) : (he.flags |= e, i.memoizedState = Jl(1 | t, n, u, l));
  }
  function $f(e, t) {
    eu(8390656, 8, e, t);
  }
  function ec(e, t) {
    tu(2048, 8, e, t);
  }
  function Ff(e, t) {
    return tu(4, 2, e, t);
  }
  function Pf(e, t) {
    return tu(4, 4, e, t);
  }
  function If(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function() {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function ed(e, t, n) {
    n = n != null ? n.concat([e]) : null, tu(4, 4, If.bind(null, t, e), n);
  }
  function tc() {
  }
  function td(e, t) {
    var n = ke();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && Vr(t, l[1]) ? l[0] : (n.memoizedState = [e, t], e);
  }
  function nd(e, t) {
    var n = ke();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && Vr(t, l[1]))
      return l[0];
    if (l = e(), ul) {
      bn(!0);
      try {
        e();
      } finally {
        bn(!1);
      }
    }
    return n.memoizedState = [l, t], l;
  }
  function nc(e, t, n) {
    return n === void 0 || Tn & 1073741824 ? e.memoizedState = t : (e.memoizedState = n, e = ah(), he.lanes |= e, Un |= e, n);
  }
  function ld(e, t, n, l) {
    return mt(n, t) ? n : Xl.current !== null ? (e = nc(e, n, l), mt(e, t) || (Ke = !0), e) : Tn & 42 ? (e = ah(), he.lanes |= e, Un |= e, t) : (Ke = !0, e.memoizedState = n);
  }
  function ad(e, t, n, l, i) {
    var u = W.p;
    W.p = u !== 0 && 8 > u ? u : 8;
    var s = J.T, v = {};
    J.T = v, ic(e, !1, t, n);
    try {
      var b = i(), w = J.S;
      if (w !== null && w(v, b), b !== null && typeof b == "object" && typeof b.then == "function") {
        var U = Dg(
          b,
          l
        );
        Ka(
          e,
          t,
          U,
          bt(e)
        );
      } else
        Ka(
          e,
          t,
          l,
          bt(e)
        );
    } catch (Y) {
      Ka(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: Y },
        bt()
      );
    } finally {
      W.p = u, J.T = s;
    }
  }
  function Ug() {
  }
  function lc(e, t, n, l) {
    if (e.tag !== 5) throw Error(c(476));
    var i = id(e).queue;
    ad(
      e,
      i,
      t,
      se,
      n === null ? Ug : function() {
        return ud(e), n(l);
      }
    );
  }
  function id(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: se,
      baseState: se,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: It,
        lastRenderedState: se
      },
      next: null
    };
    var n = {};
    return t.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: It,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function ud(e) {
    var t = id(e).next.queue;
    Ka(e, t, {}, bt());
  }
  function ac() {
    return tt(hi);
  }
  function rd() {
    return ke().memoizedState;
  }
  function cd() {
    return ke().memoizedState;
  }
  function Hg(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = bt();
          e = Mn(n);
          var l = Dn(t, e, n);
          l !== null && (at(l, t, n), $a(l, t, n)), t = { cache: Gr() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Lg(e, t, n) {
    var l = bt();
    n = {
      lane: l,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, nu(e) ? sd(t, n) : (n = jr(e, t, n, l), n !== null && (at(n, e, l), fd(n, t, l)));
  }
  function od(e, t, n) {
    var l = bt();
    Ka(e, t, n, l);
  }
  function Ka(e, t, n, l) {
    var i = {
      lane: l,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (nu(e)) sd(t, i);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var s = t.lastRenderedState, v = u(s, n);
          if (i.hasEagerState = !0, i.eagerState = v, mt(v, s))
            return qi(e, t, i, 0), De === null && Bi(), !1;
        } catch {
        } finally {
        }
      if (n = jr(e, t, i, l), n !== null)
        return at(n, e, l), fd(n, t, l), !0;
    }
    return !1;
  }
  function ic(e, t, n, l) {
    if (l = {
      lane: 2,
      revertLane: Jc(),
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, nu(e)) {
      if (t) throw Error(c(479));
    } else
      t = jr(
        e,
        n,
        l,
        2
      ), t !== null && at(t, e, 2);
  }
  function nu(e) {
    var t = e.alternate;
    return e === he || t !== null && t === he;
  }
  function sd(e, t) {
    Zl = Wi = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function fd(e, t, n) {
    if (n & 4194176) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Ss(e, n);
    }
  }
  var Gt = {
    readContext: tt,
    use: Pi,
    useCallback: Ye,
    useContext: Ye,
    useEffect: Ye,
    useImperativeHandle: Ye,
    useLayoutEffect: Ye,
    useInsertionEffect: Ye,
    useMemo: Ye,
    useReducer: Ye,
    useRef: Ye,
    useState: Ye,
    useDebugValue: Ye,
    useDeferredValue: Ye,
    useTransition: Ye,
    useSyncExternalStore: Ye,
    useId: Ye
  };
  Gt.useCacheRefresh = Ye, Gt.useMemoCache = Ye, Gt.useHostTransitionStatus = Ye, Gt.useFormState = Ye, Gt.useActionState = Ye, Gt.useOptimistic = Ye;
  var rl = {
    readContext: tt,
    use: Pi,
    useCallback: function(e, t) {
      return ct().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: tt,
    useEffect: $f,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, eu(
        4194308,
        4,
        If.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return eu(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      eu(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = ct();
      t = t === void 0 ? null : t;
      var l = e();
      if (ul) {
        bn(!0);
        try {
          e();
        } finally {
          bn(!1);
        }
      }
      return n.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, n) {
      var l = ct();
      if (n !== void 0) {
        var i = n(t);
        if (ul) {
          bn(!0);
          try {
            n(t);
          } finally {
            bn(!1);
          }
        }
      } else i = t;
      return l.memoizedState = l.baseState = i, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: i
      }, l.queue = e, e = e.dispatch = Lg.bind(
        null,
        he,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = ct();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Pr(e);
      var t = e.queue, n = od.bind(null, he, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: tc,
    useDeferredValue: function(e, t) {
      var n = ct();
      return nc(n, e, t);
    },
    useTransition: function() {
      var e = Pr(!1);
      return e = ad.bind(
        null,
        he,
        e.queue,
        !0,
        !1
      ), ct().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var l = he, i = ct();
      if (Ae) {
        if (n === void 0)
          throw Error(c(407));
        n = n();
      } else {
        if (n = t(), De === null) throw Error(c(349));
        xe & 60 || jf(l, t, n);
      }
      i.memoizedState = n;
      var u = { value: n, getSnapshot: t };
      return i.queue = u, $f(Hf.bind(null, l, u, e), [
        e
      ]), l.flags |= 2048, Jl(
        9,
        Uf.bind(
          null,
          l,
          u,
          n,
          t
        ),
        { destroy: void 0 },
        null
      ), n;
    },
    useId: function() {
      var e = ct(), t = De.identifierPrefix;
      if (Ae) {
        var n = Ft, l = $t;
        n = (l & ~(1 << 32 - vt(l) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = $i++, 0 < n && (t += "H" + n.toString(32)), t += ":";
      } else
        n = Ng++, t = ":" + t + "r" + n.toString(32) + ":";
      return e.memoizedState = t;
    },
    useCacheRefresh: function() {
      return ct().memoizedState = Hg.bind(
        null,
        he
      );
    }
  };
  rl.useMemoCache = Wr, rl.useHostTransitionStatus = ac, rl.useFormState = Qf, rl.useActionState = Qf, rl.useOptimistic = function(e) {
    var t = ct();
    t.memoizedState = t.baseState = e;
    var n = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: null,
      lastRenderedState: null
    };
    return t.queue = n, t = ic.bind(
      null,
      he,
      !0,
      n
    ), n.dispatch = t, [e, t];
  };
  var On = {
    readContext: tt,
    use: Pi,
    useCallback: td,
    useContext: tt,
    useEffect: ec,
    useImperativeHandle: ed,
    useInsertionEffect: Ff,
    useLayoutEffect: Pf,
    useMemo: nd,
    useReducer: Ii,
    useRef: Wf,
    useState: function() {
      return Ii(It);
    },
    useDebugValue: tc,
    useDeferredValue: function(e, t) {
      var n = ke();
      return ld(
        n,
        Te.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Ii(It)[0], t = ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Za(e),
        t
      ];
    },
    useSyncExternalStore: _f,
    useId: rd
  };
  On.useCacheRefresh = cd, On.useMemoCache = Wr, On.useHostTransitionStatus = ac, On.useFormState = Zf, On.useActionState = Zf, On.useOptimistic = function(e, t) {
    var n = ke();
    return qf(n, Te, e, t);
  };
  var cl = {
    readContext: tt,
    use: Pi,
    useCallback: td,
    useContext: tt,
    useEffect: ec,
    useImperativeHandle: ed,
    useInsertionEffect: Ff,
    useLayoutEffect: Pf,
    useMemo: nd,
    useReducer: Fr,
    useRef: Wf,
    useState: function() {
      return Fr(It);
    },
    useDebugValue: tc,
    useDeferredValue: function(e, t) {
      var n = ke();
      return Te === null ? nc(n, e, t) : ld(
        n,
        Te.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Fr(It)[0], t = ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Za(e),
        t
      ];
    },
    useSyncExternalStore: _f,
    useId: rd
  };
  cl.useCacheRefresh = cd, cl.useMemoCache = Wr, cl.useHostTransitionStatus = ac, cl.useFormState = Jf, cl.useActionState = Jf, cl.useOptimistic = function(e, t) {
    var n = ke();
    return Te !== null ? qf(n, Te, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
  };
  function uc(e, t, n, l) {
    t = e.memoizedState, n = n(l, t), n = n == null ? t : $({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var rc = {
    isMounted: function(e) {
      return (e = e._reactInternals) ? X(e) === e : !1;
    },
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var l = bt(), i = Mn(l);
      i.payload = t, n != null && (i.callback = n), t = Dn(e, i, l), t !== null && (at(t, e, l), $a(t, e, l));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var l = bt(), i = Mn(l);
      i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Dn(e, i, l), t !== null && (at(t, e, l), $a(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = bt(), l = Mn(n);
      l.tag = 2, t != null && (l.callback = t), t = Dn(e, l, n), t !== null && (at(t, e, n), $a(t, e, n));
    }
  };
  function dd(e, t, n, l, i, u, s) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, u, s) : t.prototype && t.prototype.isPureReactComponent ? !ja(n, l) || !ja(i, u) : !0;
  }
  function hd(e, t, n, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== e && rc.enqueueReplaceState(t, t.state, null);
  }
  function ol(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var l in t)
        l !== "ref" && (n[l] = t[l]);
    }
    if (e = e.defaultProps) {
      n === t && (n = $({}, n));
      for (var i in e)
        n[i] === void 0 && (n[i] = e[i]);
    }
    return n;
  }
  var lu = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  };
  function vd(e) {
    lu(e);
  }
  function md(e) {
    console.error(e);
  }
  function yd(e) {
    lu(e);
  }
  function au(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function gd(e, t, n) {
    try {
      var l = e.onCaughtError;
      l(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function cc(e, t, n) {
    return n = Mn(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      au(e, t);
    }, n;
  }
  function pd(e) {
    return e = Mn(e), e.tag = 3, e;
  }
  function bd(e, t, n, l) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var u = l.value;
      e.payload = function() {
        return i(u);
      }, e.callback = function() {
        gd(t, n, l);
      };
    }
    var s = n.stateNode;
    s !== null && typeof s.componentDidCatch == "function" && (e.callback = function() {
      gd(t, n, l), typeof i != "function" && (Hn === null ? Hn = /* @__PURE__ */ new Set([this]) : Hn.add(this));
      var v = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: v !== null ? v : ""
      });
    });
  }
  function Bg(e, t, n, l, i) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = n.alternate, t !== null && Wa(
        t,
        n,
        i,
        !0
      ), n = Ot.current, n !== null) {
        switch (n.tag) {
          case 13:
            return Yt === null ? Xc() : n.alternate === null && Be === 0 && (Be = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, l === Br ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), Qc(e, l, i)), !1;
          case 22:
            return n.flags |= 65536, l === Br ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), Qc(e, l, i)), !1;
        }
        throw Error(c(435, n.tag));
      }
      return Qc(e, l, i), Xc(), !1;
    }
    if (Ae)
      return t = Ot.current, t !== null ? (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, l !== Lr && (e = Error(c(422), { cause: l }), Ba(At(e, n)))) : (l !== Lr && (t = Error(c(423), {
        cause: l
      }), Ba(
        At(t, n)
      )), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, l = At(l, n), i = cc(
        e.stateNode,
        l,
        i
      ), Ac(e, i), Be !== 4 && (Be = 2)), !1;
    var u = Error(c(520), { cause: l });
    if (u = At(u, n), ai === null ? ai = [u] : ai.push(u), Be !== 4 && (Be = 2), t === null) return !0;
    l = At(l, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = i & -i, n.lanes |= e, e = cc(n.stateNode, l, e), Ac(n, e), !1;
        case 1:
          if (t = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Hn === null || !Hn.has(u))))
            return n.flags |= 65536, i &= -i, n.lanes |= i, i = pd(i), bd(
              i,
              e,
              n,
              l
            ), Ac(n, i), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var xd = Error(c(461)), Ke = !1;
  function Pe(e, t, n, l) {
    t.child = e === null ? Tf(t, null, n, l) : al(
      t,
      e.child,
      n,
      l
    );
  }
  function Sd(e, t, n, l, i) {
    n = n.render;
    var u = t.ref;
    if ("ref" in l) {
      var s = {};
      for (var v in l)
        v !== "ref" && (s[v] = l[v]);
    } else s = l;
    return fl(t), l = Qr(
      e,
      t,
      n,
      s,
      u,
      i
    ), v = Zr(), e !== null && !Ke ? (Kr(e, t, i), en(e, t, i)) : (Ae && v && Ur(t), t.flags |= 1, Pe(e, t, l, i), t.child);
  }
  function Ed(e, t, n, l, i) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !Nc(u) && u.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = u, Ad(
        e,
        t,
        u,
        l,
        i
      )) : (e = ou(
        n.type,
        null,
        l,
        t,
        t.mode,
        i
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !gc(e, i)) {
      var s = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ja, n(s, l) && e.ref === t.ref)
        return en(e, t, i);
    }
    return t.flags |= 1, e = jn(u, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Ad(e, t, n, l, i) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (ja(u, l) && e.ref === t.ref)
        if (Ke = !1, t.pendingProps = l = u, gc(e, i))
          e.flags & 131072 && (Ke = !0);
        else
          return t.lanes = e.lanes, en(e, t, i);
    }
    return oc(
      e,
      t,
      n,
      l,
      i
    );
  }
  function wd(e, t, n) {
    var l = t.pendingProps, i = l.children, u = (t.stateNode._pendingVisibility & 2) !== 0, s = e !== null ? e.memoizedState : null;
    if (Ja(e, t), l.mode === "hidden" || u) {
      if (t.flags & 128) {
        if (l = s !== null ? s.baseLanes | n : n, e !== null) {
          for (i = t.child = e.child, u = 0; i !== null; )
            u = u | i.lanes | i.childLanes, i = i.sibling;
          t.childLanes = u & ~l;
        } else t.childLanes = 0, t.child = null;
        return Td(
          e,
          t,
          l,
          n
        );
      }
      if (n & 536870912)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ji(
          t,
          s !== null ? s.cachePool : null
        ), s !== null ? Of(t, s) : qr(), Rf(t);
      else
        return t.lanes = t.childLanes = 536870912, Td(
          e,
          t,
          s !== null ? s.baseLanes | n : n,
          n
        );
    } else
      s !== null ? (Ji(t, s.cachePool), Of(t, s), wn(), t.memoizedState = null) : (e !== null && Ji(t, null), qr(), wn());
    return Pe(e, t, i, n), t.child;
  }
  function Td(e, t, n, l) {
    var i = Xr();
    return i = i === null ? null : { parent: Qe._currentValue, pool: i }, t.memoizedState = {
      baseLanes: n,
      cachePool: i
    }, e !== null && Ji(t, null), qr(), Rf(t), e !== null && Wa(e, t, l, !0), null;
  }
  function Ja(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 2097664);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(c(284));
      (e === null || e.ref !== n) && (t.flags |= 2097664);
    }
  }
  function oc(e, t, n, l, i) {
    return fl(t), n = Qr(
      e,
      t,
      n,
      l,
      void 0,
      i
    ), l = Zr(), e !== null && !Ke ? (Kr(e, t, i), en(e, t, i)) : (Ae && l && Ur(t), t.flags |= 1, Pe(e, t, n, i), t.child);
  }
  function Od(e, t, n, l, i, u) {
    return fl(t), t.updateQueue = null, n = zf(
      t,
      l,
      n,
      i
    ), Nf(e), l = Zr(), e !== null && !Ke ? (Kr(e, t, u), en(e, t, u)) : (Ae && l && Ur(t), t.flags |= 1, Pe(e, t, n, u), t.child);
  }
  function Rd(e, t, n, l, i) {
    if (fl(t), t.stateNode === null) {
      var u = ql, s = n.contextType;
      typeof s == "object" && s !== null && (u = tt(s)), u = new n(l, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = rc, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = l, u.state = t.memoizedState, u.refs = {}, Sc(t), s = n.contextType, u.context = typeof s == "object" && s !== null ? tt(s) : ql, u.state = t.memoizedState, s = n.getDerivedStateFromProps, typeof s == "function" && (uc(
        t,
        n,
        s,
        l
      ), u.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (s = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), s !== u.state && rc.enqueueReplaceState(u, u.state, null), Pa(t, l, u, i), Fa(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      u = t.stateNode;
      var v = t.memoizedProps, b = ol(n, v);
      u.props = b;
      var w = u.context, U = n.contextType;
      s = ql, typeof U == "object" && U !== null && (s = tt(U));
      var Y = n.getDerivedStateFromProps;
      U = typeof Y == "function" || typeof u.getSnapshotBeforeUpdate == "function", v = t.pendingProps !== v, U || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (v || w !== s) && hd(
        t,
        u,
        l,
        s
      ), Cn = !1;
      var z = t.memoizedState;
      u.state = z, Pa(t, l, u, i), Fa(), w = t.memoizedState, v || z !== w || Cn ? (typeof Y == "function" && (uc(
        t,
        n,
        Y,
        l
      ), w = t.memoizedState), (b = Cn || dd(
        t,
        n,
        b,
        l,
        z,
        w,
        s
      )) ? (U || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = w), u.props = l, u.state = w, u.context = s, l = b) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      u = t.stateNode, Ec(e, t), s = t.memoizedProps, U = ol(n, s), u.props = U, Y = t.pendingProps, z = u.context, w = n.contextType, b = ql, typeof w == "object" && w !== null && (b = tt(w)), v = n.getDerivedStateFromProps, (w = typeof v == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (s !== Y || z !== b) && hd(
        t,
        u,
        l,
        b
      ), Cn = !1, z = t.memoizedState, u.state = z, Pa(t, l, u, i), Fa();
      var j = t.memoizedState;
      s !== Y || z !== j || Cn || e !== null && e.dependencies !== null && iu(e.dependencies) ? (typeof v == "function" && (uc(
        t,
        n,
        v,
        l
      ), j = t.memoizedState), (U = Cn || dd(
        t,
        n,
        U,
        l,
        z,
        j,
        b
      ) || e !== null && e.dependencies !== null && iu(e.dependencies)) ? (w || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(l, j, b), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        l,
        j,
        b
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || s === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = j), u.props = l, u.state = j, u.context = b, l = U) : (typeof u.componentDidUpdate != "function" || s === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return u = l, Ja(e, t), l = (t.flags & 128) !== 0, u || l ? (u = t.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && l ? (t.child = al(
      t,
      e.child,
      null,
      i
    ), t.child = al(
      t,
      null,
      n,
      i
    )) : Pe(e, t, n, i), t.memoizedState = u.state, e = t.child) : e = en(
      e,
      t,
      i
    ), e;
  }
  function Cd(e, t, n, l) {
    return La(), t.flags |= 256, Pe(e, t, n, l), t.child;
  }
  var sc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function fc(e) {
    return { baseLanes: e, cachePool: Df() };
  }
  function dc(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= Dt), e;
  }
  function Md(e, t, n) {
    var l = t.pendingProps, i = !1, u = (t.flags & 128) !== 0, s;
    if ((s = u) || (s = e !== null && e.memoizedState === null ? !1 : (Ve.current & 2) !== 0), s && (i = !0, t.flags &= -129), s = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ae) {
        if (i ? An(t) : wn(), Ae) {
          var v = Fe, b;
          if (b = v) {
            e: {
              for (b = v, v = qt; b.nodeType !== 8; ) {
                if (!v) {
                  v = null;
                  break e;
                }
                if (b = Ut(
                  b.nextSibling
                ), b === null) {
                  v = null;
                  break e;
                }
              }
              v = b;
            }
            v !== null ? (t.memoizedState = {
              dehydrated: v,
              treeContext: tl !== null ? { id: $t, overflow: Ft } : null,
              retryLane: 536870912
            }, b = Mt(
              18,
              null,
              null,
              0
            ), b.stateNode = v, b.return = t, t.child = b, lt = t, Fe = null, b = !0) : b = !1;
          }
          b || ll(t);
        }
        if (v = t.memoizedState, v !== null && (v = v.dehydrated, v !== null))
          return v.data === "$!" ? t.lanes = 16 : t.lanes = 536870912, null;
        Pt(t);
      }
      return v = l.children, l = l.fallback, i ? (wn(), i = t.mode, v = vc(
        { mode: "hidden", children: v },
        i
      ), l = hl(
        l,
        i,
        n,
        null
      ), v.return = t, l.return = t, v.sibling = l, t.child = v, i = t.child, i.memoizedState = fc(n), i.childLanes = dc(
        e,
        s,
        n
      ), t.memoizedState = sc, l) : (An(t), hc(t, v));
    }
    if (b = e.memoizedState, b !== null && (v = b.dehydrated, v !== null)) {
      if (u)
        t.flags & 256 ? (An(t), t.flags &= -257, t = mc(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (wn(), t.child = e.child, t.flags |= 128, t = null) : (wn(), i = l.fallback, v = t.mode, l = vc(
          { mode: "visible", children: l.children },
          v
        ), i = hl(
          i,
          v,
          n,
          null
        ), i.flags |= 2, l.return = t, i.return = t, l.sibling = i, t.child = l, al(
          t,
          e.child,
          null,
          n
        ), l = t.child, l.memoizedState = fc(n), l.childLanes = dc(
          e,
          s,
          n
        ), t.memoizedState = sc, t = i);
      else if (An(t), v.data === "$!") {
        if (s = v.nextSibling && v.nextSibling.dataset, s) var w = s.dgst;
        s = w, l = Error(c(419)), l.stack = "", l.digest = s, Ba({ value: l, source: null, stack: null }), t = mc(
          e,
          t,
          n
        );
      } else if (Ke || Wa(e, t, n, !1), s = (n & e.childLanes) !== 0, Ke || s) {
        if (s = De, s !== null) {
          if (l = n & -n, l & 42) l = 1;
          else
            switch (l) {
              case 2:
                l = 1;
                break;
              case 8:
                l = 4;
                break;
              case 32:
                l = 16;
                break;
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
                l = 64;
                break;
              case 268435456:
                l = 134217728;
                break;
              default:
                l = 0;
            }
          if (l = l & (s.suspendedLanes | n) ? 0 : l, l !== 0 && l !== b.retryLane)
            throw b.retryLane = l, En(e, l), at(s, e, l), xd;
        }
        v.data === "$?" || Xc(), t = mc(
          e,
          t,
          n
        );
      } else
        v.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Ig.bind(
          null,
          e
        ), v._reactRetry = t, t = null) : (e = b.treeContext, Fe = Ut(
          v.nextSibling
        ), lt = t, Ae = !0, _t = null, qt = !1, e !== null && (wt[Tt++] = $t, wt[Tt++] = Ft, wt[Tt++] = tl, $t = e.id, Ft = e.overflow, tl = t), t = hc(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return i ? (wn(), i = l.fallback, v = t.mode, b = e.child, w = b.sibling, l = jn(b, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = b.subtreeFlags & 31457280, w !== null ? i = jn(w, i) : (i = hl(
      i,
      v,
      n,
      null
    ), i.flags |= 2), i.return = t, l.return = t, l.sibling = i, t.child = l, l = i, i = t.child, v = e.child.memoizedState, v === null ? v = fc(n) : (b = v.cachePool, b !== null ? (w = Qe._currentValue, b = b.parent !== w ? { parent: w, pool: w } : b) : b = Df(), v = {
      baseLanes: v.baseLanes | n,
      cachePool: b
    }), i.memoizedState = v, i.childLanes = dc(
      e,
      s,
      n
    ), t.memoizedState = sc, l) : (An(t), n = e.child, e = n.sibling, n = jn(n, {
      mode: "visible",
      children: l.children
    }), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function hc(e, t) {
    return t = vc(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function vc(e, t) {
    return th(e, t, 0, null);
  }
  function mc(e, t, n) {
    return al(t, e.child, null, n), e = hc(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Dd(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), bc(e.return, t, n);
  }
  function yc(e, t, n, l, i) {
    var u = e.memoizedState;
    u === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: i
    } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = l, u.tail = n, u.tailMode = i);
  }
  function Nd(e, t, n) {
    var l = t.pendingProps, i = l.revealOrder, u = l.tail;
    if (Pe(e, t, l.children, n), l = Ve.current, l & 2)
      l = l & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && e.flags & 128)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && Dd(e, n, t);
          else if (e.tag === 19)
            Dd(e, n, t);
          else if (e.child !== null) {
            e.child.return = e, e = e.child;
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t)
              break e;
            e = e.return;
          }
          e.sibling.return = e.return, e = e.sibling;
        }
      l &= 1;
    }
    switch (Ce(Ve, l), i) {
      case "forwards":
        for (n = t.child, i = null; n !== null; )
          e = n.alternate, e !== null && Ki(e) === null && (i = n), n = n.sibling;
        n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), yc(
          t,
          !1,
          i,
          n,
          u
        );
        break;
      case "backwards":
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (e = i.alternate, e !== null && Ki(e) === null) {
            t.child = i;
            break;
          }
          e = i.sibling, i.sibling = n, n = i, i = e;
        }
        yc(
          t,
          !0,
          n,
          null,
          u
        );
        break;
      case "together":
        yc(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function en(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Un |= t.lanes, !(n & t.childLanes))
      if (e !== null) {
        if (Wa(
          e,
          t,
          n,
          !1
        ), (n & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(c(153));
    if (t.child !== null) {
      for (e = t.child, n = jn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = jn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function gc(e, t) {
    return e.lanes & t ? !0 : (e = e.dependencies, !!(e !== null && iu(e)));
  }
  function qg(e, t, n) {
    switch (t.tag) {
      case 3:
        Tl(t, t.stateNode.containerInfo), Rn(t, Qe, e.memoizedState.cache), La();
        break;
      case 27:
      case 5:
        Sa(t);
        break;
      case 4:
        Tl(t, t.stateNode.containerInfo);
        break;
      case 10:
        Rn(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (An(t), t.flags |= 128, null) : n & t.child.childLanes ? Md(e, t, n) : (An(t), e = en(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        An(t);
        break;
      case 19:
        var i = (e.flags & 128) !== 0;
        if (l = (n & t.childLanes) !== 0, l || (Wa(
          e,
          t,
          n,
          !1
        ), l = (n & t.childLanes) !== 0), i) {
          if (l)
            return Nd(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Ce(Ve, Ve.current), l) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, wd(e, t, n);
      case 24:
        Rn(t, Qe, e.memoizedState.cache);
    }
    return en(e, t, n);
  }
  function zd(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ke = !0;
      else {
        if (!gc(e, n) && !(t.flags & 128))
          return Ke = !1, qg(
            e,
            t,
            n
          );
        Ke = !!(e.flags & 131072);
      }
    else
      Ke = !1, Ae && t.flags & 1048576 && yf(t, ki, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var l = t.elementType, i = l._init;
          if (l = i(l._payload), t.type = l, typeof l == "function")
            Nc(l) ? (e = ol(l, e), t.tag = 1, t = Rd(
              null,
              t,
              l,
              e,
              n
            )) : (t.tag = 0, t = oc(
              null,
              t,
              l,
              e,
              n
            ));
          else {
            if (l != null) {
              if (i = l.$$typeof, i === R) {
                t.tag = 11, t = Sd(
                  null,
                  t,
                  l,
                  e,
                  n
                );
                break e;
              } else if (i === H) {
                t.tag = 14, t = Ed(
                  null,
                  t,
                  l,
                  e,
                  n
                );
                break e;
              }
            }
            throw t = oe(l) || l, Error(c(306, t, ""));
          }
        }
        return t;
      case 0:
        return oc(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return l = t.type, i = ol(
          l,
          t.pendingProps
        ), Rd(
          e,
          t,
          l,
          i,
          n
        );
      case 3:
        e: {
          if (Tl(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(c(387));
          var u = t.pendingProps;
          i = t.memoizedState, l = i.element, Ec(e, t), Pa(t, u, null, n);
          var s = t.memoizedState;
          if (u = s.cache, Rn(t, Qe, u), u !== i.cache && xc(
            t,
            [Qe],
            n,
            !0
          ), Fa(), u = s.element, i.isDehydrated)
            if (i = {
              element: u,
              isDehydrated: !1,
              cache: s.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Cd(
                e,
                t,
                u,
                n
              );
              break e;
            } else if (u !== l) {
              l = At(
                Error(c(424)),
                t
              ), Ba(l), t = Cd(
                e,
                t,
                u,
                n
              );
              break e;
            } else
              for (Fe = Ut(
                t.stateNode.containerInfo.firstChild
              ), lt = t, Ae = !0, _t = null, qt = !0, n = Tf(
                t,
                null,
                u,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (La(), u === l) {
              t = en(
                e,
                t,
                n
              );
              break e;
            }
            Pe(e, t, u, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Ja(e, t), e === null ? (n = Uh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Ae || (n = t.type, e = t.pendingProps, l = Su(
          it.current
        ).createElement(n), l[et] = t, l[ut] = e, Ie(l, n, e), Ze(l), t.stateNode = l) : t.memoizedState = Uh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Sa(t), e === null && Ae && (l = t.stateNode = zh(
          t.type,
          t.pendingProps,
          it.current
        ), lt = t, qt = !0, Fe = Ut(
          l.firstChild
        )), l = t.pendingProps.children, e !== null || Ae ? Pe(
          e,
          t,
          l,
          n
        ) : t.child = al(
          t,
          null,
          l,
          n
        ), Ja(e, t), t.child;
      case 5:
        return e === null && Ae && ((i = l = Fe) && (l = mp(
          l,
          t.type,
          t.pendingProps,
          qt
        ), l !== null ? (t.stateNode = l, lt = t, Fe = Ut(
          l.firstChild
        ), qt = !1, i = !0) : i = !1), i || ll(t)), Sa(t), i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, l = u.children, lo(i, u) ? l = null : s !== null && lo(i, s) && (t.flags |= 32), t.memoizedState !== null && (i = Qr(
          e,
          t,
          zg,
          null,
          null,
          n
        ), hi._currentValue = i), Ja(e, t), Pe(e, t, l, n), t.child;
      case 6:
        return e === null && Ae && ((e = n = Fe) && (n = yp(
          n,
          t.pendingProps,
          qt
        ), n !== null ? (t.stateNode = n, lt = t, Fe = null, e = !0) : e = !1), e || ll(t)), null;
      case 13:
        return Md(e, t, n);
      case 4:
        return Tl(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = al(
          t,
          null,
          l,
          n
        ) : Pe(
          e,
          t,
          l,
          n
        ), t.child;
      case 11:
        return Sd(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return Pe(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return Pe(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return Pe(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return l = t.pendingProps, Rn(t, t.type, l.value), Pe(
          e,
          t,
          l.children,
          n
        ), t.child;
      case 9:
        return i = t.type._context, l = t.pendingProps.children, fl(t), i = tt(i), l = l(i), t.flags |= 1, Pe(e, t, l, n), t.child;
      case 14:
        return Ed(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Ad(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return Nd(e, t, n);
      case 22:
        return wd(e, t, n);
      case 24:
        return fl(t), l = tt(Qe), e === null ? (i = Xr(), i === null && (i = De, u = Gr(), i.pooledCache = u, u.refCount++, u !== null && (i.pooledCacheLanes |= n), i = u), t.memoizedState = {
          parent: l,
          cache: i
        }, Sc(t), Rn(t, Qe, i)) : (e.lanes & n && (Ec(e, t), Pa(t, null, null, n), Fa()), i = e.memoizedState, u = t.memoizedState, i.parent !== l ? (i = { parent: l, cache: l }, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Rn(t, Qe, l)) : (l = u.cache, Rn(t, Qe, l), l !== i.cache && xc(
          t,
          [Qe],
          n,
          !0
        ))), Pe(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(c(156, t.tag));
  }
  var pc = Ee(null), sl = null, tn = null;
  function Rn(e, t, n) {
    Ce(pc, t._currentValue), t._currentValue = n;
  }
  function nn(e) {
    e._currentValue = pc.current, je(pc);
  }
  function bc(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function xc(e, t, n, l) {
    var i = e.child;
    for (i !== null && (i.return = e); i !== null; ) {
      var u = i.dependencies;
      if (u !== null) {
        var s = i.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var v = u;
          u = i;
          for (var b = 0; b < t.length; b++)
            if (v.context === t[b]) {
              u.lanes |= n, v = u.alternate, v !== null && (v.lanes |= n), bc(
                u.return,
                n,
                e
              ), l || (s = null);
              break e;
            }
          u = v.next;
        }
      } else if (i.tag === 18) {
        if (s = i.return, s === null) throw Error(c(341));
        s.lanes |= n, u = s.alternate, u !== null && (u.lanes |= n), bc(s, n, e), s = null;
      } else s = i.child;
      if (s !== null) s.return = i;
      else
        for (s = i; s !== null; ) {
          if (s === e) {
            s = null;
            break;
          }
          if (i = s.sibling, i !== null) {
            i.return = s.return, s = i;
            break;
          }
          s = s.return;
        }
      i = s;
    }
  }
  function Wa(e, t, n, l) {
    e = null;
    for (var i = t, u = !1; i !== null; ) {
      if (!u) {
        if (i.flags & 524288) u = !0;
        else if (i.flags & 262144) break;
      }
      if (i.tag === 10) {
        var s = i.alternate;
        if (s === null) throw Error(c(387));
        if (s = s.memoizedProps, s !== null) {
          var v = i.type;
          mt(i.pendingProps.value, s.value) || (e !== null ? e.push(v) : e = [v]);
        }
      } else if (i === Jn.current) {
        if (s = i.alternate, s === null) throw Error(c(387));
        s.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e !== null ? e.push(hi) : e = [hi]);
      }
      i = i.return;
    }
    e !== null && xc(
      t,
      e,
      n,
      l
    ), t.flags |= 262144;
  }
  function iu(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!mt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function fl(e) {
    sl = e, tn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function tt(e) {
    return _d(sl, e);
  }
  function uu(e, t) {
    return sl === null && fl(e), _d(e, t);
  }
  function _d(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, tn === null) {
      if (e === null) throw Error(c(308));
      tn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else tn = tn.next = t;
    return n;
  }
  var Cn = !1;
  function Sc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Ec(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Mn(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Dn(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, He & 2) {
      var i = l.pending;
      return i === null ? t.next = t : (t.next = i.next, i.next = t), l.pending = t, t = Yi(e), vf(e, null, n), t;
    }
    return qi(e, l, t, n), Yi(e);
  }
  function $a(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194176) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Ss(e, n);
    }
  }
  function Ac(e, t) {
    var n = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var i = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var s = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? i = u = s : u = u.next = s, n = n.next;
        } while (n !== null);
        u === null ? i = u = t : u = u.next = t;
      } else i = u = t;
      n = {
        baseState: l.baseState,
        firstBaseUpdate: i,
        lastBaseUpdate: u,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var wc = !1;
  function Fa() {
    if (wc) {
      var e = Ql;
      if (e !== null) throw e;
    }
  }
  function Pa(e, t, n, l) {
    wc = !1;
    var i = e.updateQueue;
    Cn = !1;
    var u = i.firstBaseUpdate, s = i.lastBaseUpdate, v = i.shared.pending;
    if (v !== null) {
      i.shared.pending = null;
      var b = v, w = b.next;
      b.next = null, s === null ? u = w : s.next = w, s = b;
      var U = e.alternate;
      U !== null && (U = U.updateQueue, v = U.lastBaseUpdate, v !== s && (v === null ? U.firstBaseUpdate = w : v.next = w, U.lastBaseUpdate = b));
    }
    if (u !== null) {
      var Y = i.baseState;
      s = 0, U = w = b = null, v = u;
      do {
        var z = v.lane & -536870913, j = z !== v.lane;
        if (j ? (xe & z) === z : (l & z) === z) {
          z !== 0 && z === Vl && (wc = !0), U !== null && (U = U.next = {
            lane: 0,
            tag: v.tag,
            payload: v.payload,
            callback: null,
            next: null
          });
          e: {
            var te = e, ce = v;
            z = t;
            var qe = n;
            switch (ce.tag) {
              case 1:
                if (te = ce.payload, typeof te == "function") {
                  Y = te.call(qe, Y, z);
                  break e;
                }
                Y = te;
                break e;
              case 3:
                te.flags = te.flags & -65537 | 128;
              case 0:
                if (te = ce.payload, z = typeof te == "function" ? te.call(qe, Y, z) : te, z == null) break e;
                Y = $({}, Y, z);
                break e;
              case 2:
                Cn = !0;
            }
          }
          z = v.callback, z !== null && (e.flags |= 64, j && (e.flags |= 8192), j = i.callbacks, j === null ? i.callbacks = [z] : j.push(z));
        } else
          j = {
            lane: z,
            tag: v.tag,
            payload: v.payload,
            callback: v.callback,
            next: null
          }, U === null ? (w = U = j, b = Y) : U = U.next = j, s |= z;
        if (v = v.next, v === null) {
          if (v = i.shared.pending, v === null)
            break;
          j = v, v = j.next, j.next = null, i.lastBaseUpdate = j, i.shared.pending = null;
        }
      } while (!0);
      U === null && (b = Y), i.baseState = b, i.firstBaseUpdate = w, i.lastBaseUpdate = U, u === null && (i.shared.lanes = 0), Un |= s, e.lanes = s, e.memoizedState = Y;
    }
  }
  function jd(e, t) {
    if (typeof e != "function")
      throw Error(c(191, e));
    e.call(t);
  }
  function Ud(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        jd(n[e], t);
  }
  function Ia(e, t) {
    try {
      var n = t.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var i = l.next;
        n = i;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var u = n.create, s = n.inst;
            l = u(), s.destroy = l;
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (v) {
      Me(t, t.return, v);
    }
  }
  function Nn(e, t, n) {
    try {
      var l = t.updateQueue, i = l !== null ? l.lastEffect : null;
      if (i !== null) {
        var u = i.next;
        l = u;
        do {
          if ((l.tag & e) === e) {
            var s = l.inst, v = s.destroy;
            if (v !== void 0) {
              s.destroy = void 0, i = t;
              var b = n;
              try {
                v();
              } catch (w) {
                Me(
                  i,
                  b,
                  w
                );
              }
            }
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (w) {
      Me(t, t.return, w);
    }
  }
  function Hd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Ud(t, n);
      } catch (l) {
        Me(e, e.return, l);
      }
    }
  }
  function Ld(e, t, n) {
    n.props = ol(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      Me(e, t, l);
    }
  }
  function dl(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        var l = e.stateNode;
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var i = l;
            break;
          default:
            i = l;
        }
        typeof n == "function" ? e.refCleanup = n(i) : n.current = i;
      }
    } catch (u) {
      Me(e, t, u);
    }
  }
  function yt(e, t) {
    var n = e.ref, l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (i) {
          Me(e, t, i);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          Me(e, t, i);
        }
      else n.current = null;
  }
  function Bd(e) {
    var t = e.type, n = e.memoizedProps, l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && l.focus();
          break e;
        case "img":
          n.src ? l.src = n.src : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (i) {
      Me(e, e.return, i);
    }
  }
  function qd(e, t, n) {
    try {
      var l = e.stateNode;
      sp(l, e.type, n, t), l[ut] = t;
    } catch (i) {
      Me(e, e.return, i);
    }
  }
  function Yd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 || e.tag === 4;
  }
  function Tc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Yd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 27 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Oc(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = xu));
    else if (l !== 4 && l !== 27 && (e = e.child, e !== null))
      for (Oc(e, t, n), e = e.sibling; e !== null; )
        Oc(e, t, n), e = e.sibling;
  }
  function ru(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (l !== 4 && l !== 27 && (e = e.child, e !== null))
      for (ru(e, t, n), e = e.sibling; e !== null; )
        ru(e, t, n), e = e.sibling;
  }
  var ln = !1, Le = !1, Rc = !1, Gd = typeof WeakSet == "function" ? WeakSet : Set, Je = null, kd = !1;
  function Yg(e, t) {
    if (e = e.containerInfo, to = Ru, e = af(e), Mr(e)) {
      if ("selectionStart" in e)
        var n = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          n = (n = e.ownerDocument) && n.defaultView || window;
          var l = n.getSelection && n.getSelection();
          if (l && l.rangeCount !== 0) {
            n = l.anchorNode;
            var i = l.anchorOffset, u = l.focusNode;
            l = l.focusOffset;
            try {
              n.nodeType, u.nodeType;
            } catch {
              n = null;
              break e;
            }
            var s = 0, v = -1, b = -1, w = 0, U = 0, Y = e, z = null;
            t: for (; ; ) {
              for (var j; Y !== n || i !== 0 && Y.nodeType !== 3 || (v = s + i), Y !== u || l !== 0 && Y.nodeType !== 3 || (b = s + l), Y.nodeType === 3 && (s += Y.nodeValue.length), (j = Y.firstChild) !== null; )
                z = Y, Y = j;
              for (; ; ) {
                if (Y === e) break t;
                if (z === n && ++w === i && (v = s), z === u && ++U === l && (b = s), (j = Y.nextSibling) !== null) break;
                Y = z, z = Y.parentNode;
              }
              Y = j;
            }
            n = v === -1 || b === -1 ? null : { start: v, end: b };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (no = { focusedElem: e, selectionRange: n }, Ru = !1, Je = t; Je !== null; )
      if (t = Je, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, Je = e;
      else
        for (; Je !== null; ) {
          switch (t = Je, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if (e & 1024 && u !== null) {
                e = void 0, n = t, i = u.memoizedProps, u = u.memoizedState, l = n.stateNode;
                try {
                  var te = ol(
                    n.type,
                    i,
                    n.elementType === n.type
                  );
                  e = l.getSnapshotBeforeUpdate(
                    te,
                    u
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ce) {
                  Me(
                    n,
                    n.return,
                    ce
                  );
                }
              }
              break;
            case 3:
              if (e & 1024) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  uo(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      uo(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if (e & 1024) throw Error(c(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Je = e;
            break;
          }
          Je = t.return;
        }
    return te = kd, kd = !1, te;
  }
  function Xd(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        un(e, n), l & 4 && Ia(5, n);
        break;
      case 1:
        if (un(e, n), l & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (v) {
              Me(n, n.return, v);
            }
          else {
            var i = ol(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                i,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (v) {
              Me(
                n,
                n.return,
                v
              );
            }
          }
        l & 64 && Hd(n), l & 512 && dl(n, n.return);
        break;
      case 3:
        if (un(e, n), l & 64 && (l = n.updateQueue, l !== null)) {
          if (e = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            Ud(l, e);
          } catch (v) {
            Me(n, n.return, v);
          }
        }
        break;
      case 26:
        un(e, n), l & 512 && dl(n, n.return);
        break;
      case 27:
      case 5:
        un(e, n), t === null && l & 4 && Bd(n), l & 512 && dl(n, n.return);
        break;
      case 12:
        un(e, n);
        break;
      case 13:
        un(e, n), l & 4 && Zd(e, n);
        break;
      case 22:
        if (i = n.memoizedState !== null || ln, !i) {
          t = t !== null && t.memoizedState !== null || Le;
          var u = ln, s = Le;
          ln = i, (Le = t) && !s ? zn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : un(e, n), ln = u, Le = s;
        }
        l & 512 && (n.memoizedProps.mode === "manual" ? dl(n, n.return) : yt(n, n.return));
        break;
      default:
        un(e, n);
    }
  }
  function Vd(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Vd(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && hr(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Xe = null, gt = !1;
  function an(e, t, n) {
    for (n = n.child; n !== null; )
      Qd(e, t, n), n = n.sibling;
  }
  function Qd(e, t, n) {
    if (ht && typeof ht.onCommitFiberUnmount == "function")
      try {
        ht.onCommitFiberUnmount(Ea, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Le || yt(n, t), an(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Le || yt(n, t);
        var l = Xe, i = gt;
        for (Xe = n.stateNode, an(
          e,
          t,
          n
        ), n = n.stateNode, t = n.attributes; t.length; )
          n.removeAttributeNode(t[0]);
        hr(n), Xe = l, gt = i;
        break;
      case 5:
        Le || yt(n, t);
      case 6:
        i = Xe;
        var u = gt;
        if (Xe = null, an(
          e,
          t,
          n
        ), Xe = i, gt = u, Xe !== null)
          if (gt)
            try {
              e = Xe, l = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(l) : e.removeChild(l);
            } catch (s) {
              Me(
                n,
                t,
                s
              );
            }
          else
            try {
              Xe.removeChild(n.stateNode);
            } catch (s) {
              Me(
                n,
                t,
                s
              );
            }
        break;
      case 18:
        Xe !== null && (gt ? (t = Xe, n = n.stateNode, t.nodeType === 8 ? io(
          t.parentNode,
          n
        ) : t.nodeType === 1 && io(t, n), gi(t)) : io(Xe, n.stateNode));
        break;
      case 4:
        l = Xe, i = gt, Xe = n.stateNode.containerInfo, gt = !0, an(
          e,
          t,
          n
        ), Xe = l, gt = i;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Le || Nn(2, n, t), Le || Nn(4, n, t), an(
          e,
          t,
          n
        );
        break;
      case 1:
        Le || (yt(n, t), l = n.stateNode, typeof l.componentWillUnmount == "function" && Ld(
          n,
          t,
          l
        )), an(
          e,
          t,
          n
        );
        break;
      case 21:
        an(
          e,
          t,
          n
        );
        break;
      case 22:
        Le || yt(n, t), Le = (l = Le) || n.memoizedState !== null, an(
          e,
          t,
          n
        ), Le = l;
        break;
      default:
        an(
          e,
          t,
          n
        );
    }
  }
  function Zd(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        gi(e);
      } catch (n) {
        Me(t, t.return, n);
      }
  }
  function Gg(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Gd()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Gd()), t;
      default:
        throw Error(c(435, e.tag));
    }
  }
  function Cc(e, t) {
    var n = Gg(e);
    t.forEach(function(l) {
      var i = ep.bind(null, e, l);
      n.has(l) || (n.add(l), l.then(i, i));
    });
  }
  function Rt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var i = n[l], u = e, s = t, v = s;
        e: for (; v !== null; ) {
          switch (v.tag) {
            case 27:
            case 5:
              Xe = v.stateNode, gt = !1;
              break e;
            case 3:
              Xe = v.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              Xe = v.stateNode.containerInfo, gt = !0;
              break e;
          }
          v = v.return;
        }
        if (Xe === null) throw Error(c(160));
        Qd(u, s, i), Xe = null, gt = !1, u = i.alternate, u !== null && (u.return = null), i.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        Kd(t, e), t = t.sibling;
  }
  var jt = null;
  function Kd(e, t) {
    var n = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Rt(t, e), Ct(e), l & 4 && (Nn(3, e, e.return), Ia(3, e), Nn(5, e, e.return));
        break;
      case 1:
        Rt(t, e), Ct(e), l & 512 && (Le || n === null || yt(n, n.return)), l & 64 && ln && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
        break;
      case 26:
        var i = jt;
        if (Rt(t, e), Ct(e), l & 512 && (Le || n === null || yt(n, n.return)), l & 4) {
          var u = n !== null ? n.memoizedState : null;
          if (l = e.memoizedState, n === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
                  t: switch (l) {
                    case "title":
                      u = i.getElementsByTagName("title")[0], (!u || u[Ta] || u[et] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = i.createElement(l), i.head.insertBefore(
                        u,
                        i.querySelector("head > title")
                      )), Ie(u, l, n), u[et] = e, Ze(u), l = u;
                      break e;
                    case "link":
                      var s = Bh(
                        "link",
                        "href",
                        i
                      ).get(l + (n.href || ""));
                      if (s) {
                        for (var v = 0; v < s.length; v++)
                          if (u = s[v], u.getAttribute("href") === (n.href == null ? null : n.href) && u.getAttribute("rel") === (n.rel == null ? null : n.rel) && u.getAttribute("title") === (n.title == null ? null : n.title) && u.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            s.splice(v, 1);
                            break t;
                          }
                      }
                      u = i.createElement(l), Ie(u, l, n), i.head.appendChild(u);
                      break;
                    case "meta":
                      if (s = Bh(
                        "meta",
                        "content",
                        i
                      ).get(l + (n.content || ""))) {
                        for (v = 0; v < s.length; v++)
                          if (u = s[v], u.getAttribute("content") === (n.content == null ? null : "" + n.content) && u.getAttribute("name") === (n.name == null ? null : n.name) && u.getAttribute("property") === (n.property == null ? null : n.property) && u.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && u.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            s.splice(v, 1);
                            break t;
                          }
                      }
                      u = i.createElement(l), Ie(u, l, n), i.head.appendChild(u);
                      break;
                    default:
                      throw Error(c(468, l));
                  }
                  u[et] = e, Ze(u), l = u;
                }
                e.stateNode = l;
              } else
                qh(
                  i,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Lh(
                i,
                l,
                e.memoizedProps
              );
          else
            u !== l ? (u === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : u.count--, l === null ? qh(
              i,
              e.type,
              e.stateNode
            ) : Lh(
              i,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && qd(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        if (l & 4 && e.alternate === null) {
          i = e.stateNode, u = e.memoizedProps;
          try {
            for (var b = i.firstChild; b; ) {
              var w = b.nextSibling, U = b.nodeName;
              b[Ta] || U === "HEAD" || U === "BODY" || U === "SCRIPT" || U === "STYLE" || U === "LINK" && b.rel.toLowerCase() === "stylesheet" || i.removeChild(b), b = w;
            }
            for (var Y = e.type, z = i.attributes; z.length; )
              i.removeAttributeNode(z[0]);
            Ie(i, Y, u), i[et] = e, i[ut] = u;
          } catch (te) {
            Me(e, e.return, te);
          }
        }
      case 5:
        if (Rt(t, e), Ct(e), l & 512 && (Le || n === null || yt(n, n.return)), e.flags & 32) {
          i = e.stateNode;
          try {
            zl(i, "");
          } catch (te) {
            Me(e, e.return, te);
          }
        }
        l & 4 && e.stateNode != null && (i = e.memoizedProps, qd(
          e,
          i,
          n !== null ? n.memoizedProps : i
        )), l & 1024 && (Rc = !0);
        break;
      case 6:
        if (Rt(t, e), Ct(e), l & 4) {
          if (e.stateNode === null)
            throw Error(c(162));
          l = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = l;
          } catch (te) {
            Me(e, e.return, te);
          }
        }
        break;
      case 3:
        if (wu = null, i = jt, jt = Eu(t.containerInfo), Rt(t, e), jt = i, Ct(e), l & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            gi(t.containerInfo);
          } catch (te) {
            Me(e, e.return, te);
          }
        Rc && (Rc = !1, Jd(e));
        break;
      case 4:
        l = jt, jt = Eu(
          e.stateNode.containerInfo
        ), Rt(t, e), Ct(e), jt = l;
        break;
      case 12:
        Rt(t, e), Ct(e);
        break;
      case 13:
        Rt(t, e), Ct(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Lc = Bt()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Cc(e, l)));
        break;
      case 22:
        if (l & 512 && (Le || n === null || yt(n, n.return)), b = e.memoizedState !== null, w = n !== null && n.memoizedState !== null, U = ln, Y = Le, ln = U || b, Le = Y || w, Rt(t, e), Le = Y, ln = U, Ct(e), t = e.stateNode, t._current = e, t._visibility &= -3, t._visibility |= t._pendingVisibility & 2, l & 8192 && (t._visibility = b ? t._visibility & -2 : t._visibility | 1, b && (t = ln || Le, n === null || w || t || Wl(e)), e.memoizedProps === null || e.memoizedProps.mode !== "manual"))
          e: for (n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26 || t.tag === 27) {
              if (n === null) {
                w = n = t;
                try {
                  if (i = w.stateNode, b)
                    u = i.style, typeof u.setProperty == "function" ? u.setProperty(
                      "display",
                      "none",
                      "important"
                    ) : u.display = "none";
                  else {
                    s = w.stateNode, v = w.memoizedProps.style;
                    var j = v != null && v.hasOwnProperty("display") ? v.display : null;
                    s.style.display = j == null || typeof j == "boolean" ? "" : ("" + j).trim();
                  }
                } catch (te) {
                  Me(w, w.return, te);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                w = t;
                try {
                  w.stateNode.nodeValue = b ? "" : w.memoizedProps;
                } catch (te) {
                  Me(w, w.return, te);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              n === t && (n = null), t = t.return;
            }
            n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
          }
        l & 4 && (l = e.updateQueue, l !== null && (n = l.retryQueue, n !== null && (l.retryQueue = null, Cc(e, n))));
        break;
      case 19:
        Rt(t, e), Ct(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Cc(e, l)));
        break;
      case 21:
        break;
      default:
        Rt(t, e), Ct(e);
    }
  }
  function Ct(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        if (e.tag !== 27) {
          e: {
            for (var n = e.return; n !== null; ) {
              if (Yd(n)) {
                var l = n;
                break e;
              }
              n = n.return;
            }
            throw Error(c(160));
          }
          switch (l.tag) {
            case 27:
              var i = l.stateNode, u = Tc(e);
              ru(e, u, i);
              break;
            case 5:
              var s = l.stateNode;
              l.flags & 32 && (zl(s, ""), l.flags &= -33);
              var v = Tc(e);
              ru(e, v, s);
              break;
            case 3:
            case 4:
              var b = l.stateNode.containerInfo, w = Tc(e);
              Oc(
                e,
                w,
                b
              );
              break;
            default:
              throw Error(c(161));
          }
        }
      } catch (U) {
        Me(e, e.return, U);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Jd(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Jd(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function un(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Xd(e, t.alternate, t), t = t.sibling;
  }
  function Wl(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Nn(4, t, t.return), Wl(t);
          break;
        case 1:
          yt(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && Ld(
            t,
            t.return,
            n
          ), Wl(t);
          break;
        case 26:
        case 27:
        case 5:
          yt(t, t.return), Wl(t);
          break;
        case 22:
          yt(t, t.return), t.memoizedState === null && Wl(t);
          break;
        default:
          Wl(t);
      }
      e = e.sibling;
    }
  }
  function zn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, i = e, u = t, s = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          zn(
            i,
            u,
            n
          ), Ia(4, u);
          break;
        case 1:
          if (zn(
            i,
            u,
            n
          ), l = u, i = l.stateNode, typeof i.componentDidMount == "function")
            try {
              i.componentDidMount();
            } catch (w) {
              Me(l, l.return, w);
            }
          if (l = u, i = l.updateQueue, i !== null) {
            var v = l.stateNode;
            try {
              var b = i.shared.hiddenCallbacks;
              if (b !== null)
                for (i.shared.hiddenCallbacks = null, i = 0; i < b.length; i++)
                  jd(b[i], v);
            } catch (w) {
              Me(l, l.return, w);
            }
          }
          n && s & 64 && Hd(u), dl(u, u.return);
          break;
        case 26:
        case 27:
        case 5:
          zn(
            i,
            u,
            n
          ), n && l === null && s & 4 && Bd(u), dl(u, u.return);
          break;
        case 12:
          zn(
            i,
            u,
            n
          );
          break;
        case 13:
          zn(
            i,
            u,
            n
          ), n && s & 4 && Zd(i, u);
          break;
        case 22:
          u.memoizedState === null && zn(
            i,
            u,
            n
          ), dl(u, u.return);
          break;
        default:
          zn(
            i,
            u,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Mc(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Xa(n));
  }
  function Dc(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Xa(e));
  }
  function _n(e, t, n, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Wd(
          e,
          t,
          n,
          l
        ), t = t.sibling;
  }
  function Wd(e, t, n, l) {
    var i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        _n(
          e,
          t,
          n,
          l
        ), i & 2048 && Ia(9, t);
        break;
      case 3:
        _n(
          e,
          t,
          n,
          l
        ), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Xa(e)));
        break;
      case 12:
        if (i & 2048) {
          _n(
            e,
            t,
            n,
            l
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, s = u.id, v = u.onPostCommit;
            typeof v == "function" && v(
              s,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (b) {
            Me(t, t.return, b);
          }
        } else
          _n(
            e,
            t,
            n,
            l
          );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, t.memoizedState !== null ? u._visibility & 4 ? _n(
          e,
          t,
          n,
          l
        ) : ei(e, t) : u._visibility & 4 ? _n(
          e,
          t,
          n,
          l
        ) : (u._visibility |= 4, $l(
          e,
          t,
          n,
          l,
          (t.subtreeFlags & 10256) !== 0
        )), i & 2048 && Mc(
          t.alternate,
          t
        );
        break;
      case 24:
        _n(
          e,
          t,
          n,
          l
        ), i & 2048 && Dc(t.alternate, t);
        break;
      default:
        _n(
          e,
          t,
          n,
          l
        );
    }
  }
  function $l(e, t, n, l, i) {
    for (i = i && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var u = e, s = t, v = n, b = l, w = s.flags;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          $l(
            u,
            s,
            v,
            b,
            i
          ), Ia(8, s);
          break;
        case 23:
          break;
        case 22:
          var U = s.stateNode;
          s.memoizedState !== null ? U._visibility & 4 ? $l(
            u,
            s,
            v,
            b,
            i
          ) : ei(
            u,
            s
          ) : (U._visibility |= 4, $l(
            u,
            s,
            v,
            b,
            i
          )), i && w & 2048 && Mc(
            s.alternate,
            s
          );
          break;
        case 24:
          $l(
            u,
            s,
            v,
            b,
            i
          ), i && w & 2048 && Dc(s.alternate, s);
          break;
        default:
          $l(
            u,
            s,
            v,
            b,
            i
          );
      }
      t = t.sibling;
    }
  }
  function ei(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, l = t, i = l.flags;
        switch (l.tag) {
          case 22:
            ei(n, l), i & 2048 && Mc(
              l.alternate,
              l
            );
            break;
          case 24:
            ei(n, l), i & 2048 && Dc(l.alternate, l);
            break;
          default:
            ei(n, l);
        }
        t = t.sibling;
      }
  }
  var ti = 8192;
  function Fl(e) {
    if (e.subtreeFlags & ti)
      for (e = e.child; e !== null; )
        $d(e), e = e.sibling;
  }
  function $d(e) {
    switch (e.tag) {
      case 26:
        Fl(e), e.flags & ti && e.memoizedState !== null && Mp(
          jt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Fl(e);
        break;
      case 3:
      case 4:
        var t = jt;
        jt = Eu(e.stateNode.containerInfo), Fl(e), jt = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = ti, ti = 16777216, Fl(e), ti = t) : Fl(e));
        break;
      default:
        Fl(e);
    }
  }
  function Fd(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ni(e) {
    var t = e.deletions;
    if (e.flags & 16) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          Je = l, Id(
            l,
            e
          );
        }
      Fd(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Pd(e), e = e.sibling;
  }
  function Pd(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ni(e), e.flags & 2048 && Nn(9, e, e.return);
        break;
      case 3:
        ni(e);
        break;
      case 12:
        ni(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 4 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -5, cu(e)) : ni(e);
        break;
      default:
        ni(e);
    }
  }
  function cu(e) {
    var t = e.deletions;
    if (e.flags & 16) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          Je = l, Id(
            l,
            e
          );
        }
      Fd(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Nn(8, t, t.return), cu(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 4 && (n._visibility &= -5, cu(t));
          break;
        default:
          cu(t);
      }
      e = e.sibling;
    }
  }
  function Id(e, t) {
    for (; Je !== null; ) {
      var n = Je;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Nn(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Xa(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, Je = l;
      else
        e: for (n = e; Je !== null; ) {
          l = Je;
          var i = l.sibling, u = l.return;
          if (Vd(l), l === n) {
            Je = null;
            break e;
          }
          if (i !== null) {
            i.return = u, Je = i;
            break e;
          }
          Je = u;
        }
    }
  }
  function kg(e, t, n, l) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Mt(e, t, n, l) {
    return new kg(e, t, n, l);
  }
  function Nc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function jn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Mt(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 31457280, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function eh(e, t) {
    e.flags &= 31457282;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ou(e, t, n, l, i, u) {
    var s = 0;
    if (l = e, typeof e == "function") Nc(e) && (s = 1);
    else if (typeof e == "string")
      s = Rp(
        e,
        n,
        dt.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case y:
          return hl(n.children, i, u, t);
        case m:
          s = 8, i |= 24;
          break;
        case x:
          return e = Mt(12, n, t, i | 2), e.elementType = x, e.lanes = u, e;
        case O:
          return e = Mt(13, n, t, i), e.elementType = O, e.lanes = u, e;
        case _:
          return e = Mt(19, n, t, i), e.elementType = _, e.lanes = u, e;
        case Z:
          return th(n, i, u, t);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case T:
              case M:
                s = 10;
                break e;
              case D:
                s = 9;
                break e;
              case R:
                s = 11;
                break e;
              case H:
                s = 14;
                break e;
              case G:
                s = 16, l = null;
                break e;
            }
          s = 29, n = Error(
            c(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = Mt(s, n, t, i), t.elementType = e, t.type = l, t.lanes = u, t;
  }
  function hl(e, t, n, l) {
    return e = Mt(7, e, l, t), e.lanes = n, e;
  }
  function th(e, t, n, l) {
    e = Mt(22, e, l, t), e.elementType = Z, e.lanes = n;
    var i = {
      _visibility: 1,
      _pendingVisibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null,
      _current: null,
      detach: function() {
        var u = i._current;
        if (u === null) throw Error(c(456));
        if (!(i._pendingVisibility & 2)) {
          var s = En(u, 2);
          s !== null && (i._pendingVisibility |= 2, at(s, u, 2));
        }
      },
      attach: function() {
        var u = i._current;
        if (u === null) throw Error(c(456));
        if (i._pendingVisibility & 2) {
          var s = En(u, 2);
          s !== null && (i._pendingVisibility &= -3, at(s, u, 2));
        }
      }
    };
    return e.stateNode = i, e;
  }
  function zc(e, t, n) {
    return e = Mt(6, e, null, t), e.lanes = n, e;
  }
  function _c(e, t, n) {
    return t = Mt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = n, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  function rn(e) {
    e.flags |= 4;
  }
  function nh(e, t) {
    if (t.type !== "stylesheet" || t.state.loading & 4)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Yh(t)) {
      if (t = Ot.current, t !== null && ((xe & 4194176) === xe ? Yt !== null : (xe & 62914560) !== xe && !(xe & 536870912) || t !== Yt))
        throw Ya = Br, bf;
      e.flags |= 8192;
    }
  }
  function su(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? bs() : 536870912, e.lanes |= t, Il |= t);
  }
  function li(e, t) {
    if (!Ae)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            t.alternate !== null && (n = t), t = t.sibling;
          n === null ? e.tail = null : n.sibling = null;
          break;
        case "collapsed":
          n = e.tail;
          for (var l = null; n !== null; )
            n.alternate !== null && (l = n), n = n.sibling;
          l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
      }
  }
  function Ue(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, l = 0;
    if (t)
      for (var i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags & 31457280, l |= i.flags & 31457280, i.return = e, i = i.sibling;
    else
      for (i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags, l |= i.flags, i.return = e, i = i.sibling;
    return e.subtreeFlags |= l, e.childLanes = n, t;
  }
  function Xg(e, t, n) {
    var l = t.pendingProps;
    switch (Hr(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ue(t), null;
      case 1:
        return Ue(t), null;
      case 3:
        return n = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), nn(Qe), gn(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Ha(t) ? rn(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, _t !== null && (Gc(_t), _t = null))), Ue(t), null;
      case 26:
        return n = t.memoizedState, e === null ? (rn(t), n !== null ? (Ue(t), nh(t, n)) : (Ue(t), t.flags &= -16777217)) : n ? n !== e.memoizedState ? (rn(t), Ue(t), nh(t, n)) : (Ue(t), t.flags &= -16777217) : (e.memoizedProps !== l && rn(t), Ue(t), t.flags &= -16777217), null;
      case 27:
        Ol(t), n = it.current;
        var i = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== l && rn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(c(166));
            return Ue(t), null;
          }
          e = dt.current, Ha(t) ? gf(t) : (e = zh(i, l, n), t.stateNode = e, rn(t));
        }
        return Ue(t), null;
      case 5:
        if (Ol(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && rn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(c(166));
            return Ue(t), null;
          }
          if (e = dt.current, Ha(t))
            gf(t);
          else {
            switch (i = Su(
              it.current
            ), e) {
              case 1:
                e = i.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                e = i.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    e = i.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    e = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild);
                    break;
                  case "select":
                    e = typeof l.is == "string" ? i.createElement("select", { is: l.is }) : i.createElement("select"), l.multiple ? e.multiple = !0 : l.size && (e.size = l.size);
                    break;
                  default:
                    e = typeof l.is == "string" ? i.createElement(n, { is: l.is }) : i.createElement(n);
                }
            }
            e[et] = t, e[ut] = l;
            e: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6)
                e.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                i.child.return = i, i = i.child;
                continue;
              }
              if (i === t) break e;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t)
                  break e;
                i = i.return;
              }
              i.sibling.return = i.return, i = i.sibling;
            }
            t.stateNode = e;
            e: switch (Ie(e, n, l), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                e = !!l.autoFocus;
                break e;
              case "img":
                e = !0;
                break e;
              default:
                e = !1;
            }
            e && rn(t);
          }
        }
        return Ue(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && rn(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(c(166));
          if (e = it.current, Ha(t)) {
            if (e = t.stateNode, n = t.memoizedProps, l = null, i = lt, i !== null)
              switch (i.tag) {
                case 27:
                case 5:
                  l = i.memoizedProps;
              }
            e[et] = t, e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || Oh(e.nodeValue, n)), e || ll(t);
          } else
            e = Su(e).createTextNode(
              l
            ), e[et] = t, t.stateNode = e;
        }
        return Ue(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (i = Ha(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(c(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(c(317));
              i[et] = t;
            } else
              La(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
            Ue(t), i = !1;
          } else
            _t !== null && (Gc(_t), _t = null), i = !0;
          if (!i)
            return t.flags & 256 ? (Pt(t), t) : (Pt(t), null);
        }
        if (Pt(t), t.flags & 128)
          return t.lanes = n, t;
        if (n = l !== null, e = e !== null && e.memoizedState !== null, n) {
          l = t.child, i = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (i = l.alternate.memoizedState.cachePool.pool);
          var u = null;
          l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), u !== i && (l.flags |= 2048);
        }
        return n !== e && n && (t.child.flags |= 8192), su(t, t.updateQueue), Ue(t), null;
      case 4:
        return gn(), e === null && Pc(t.stateNode.containerInfo), Ue(t), null;
      case 10:
        return nn(t.type), Ue(t), null;
      case 19:
        if (je(Ve), i = t.memoizedState, i === null) return Ue(t), null;
        if (l = (t.flags & 128) !== 0, u = i.rendering, u === null)
          if (l) li(i, !1);
          else {
            if (Be !== 0 || e !== null && e.flags & 128)
              for (e = t.child; e !== null; ) {
                if (u = Ki(e), u !== null) {
                  for (t.flags |= 128, li(i, !1), e = u.updateQueue, t.updateQueue = e, su(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    eh(n, e), n = n.sibling;
                  return Ce(
                    Ve,
                    Ve.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            i.tail !== null && Bt() > fu && (t.flags |= 128, l = !0, li(i, !1), t.lanes = 4194304);
          }
        else {
          if (!l)
            if (e = Ki(u), e !== null) {
              if (t.flags |= 128, l = !0, e = e.updateQueue, t.updateQueue = e, su(t, e), li(i, !0), i.tail === null && i.tailMode === "hidden" && !u.alternate && !Ae)
                return Ue(t), null;
            } else
              2 * Bt() - i.renderingStartTime > fu && n !== 536870912 && (t.flags |= 128, l = !0, li(i, !1), t.lanes = 4194304);
          i.isBackwards ? (u.sibling = t.child, t.child = u) : (e = i.last, e !== null ? e.sibling = u : t.child = u, i.last = u);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Bt(), t.sibling = null, e = Ve.current, Ce(Ve, l ? e & 1 | 2 : e & 1), t) : (Ue(t), null);
      case 22:
      case 23:
        return Pt(t), Yr(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? n & 536870912 && !(t.flags & 128) && (Ue(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ue(t), n = t.updateQueue, n !== null && su(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== n && (t.flags |= 2048), e !== null && je(il), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), nn(Qe), Ue(t), null;
      case 25:
        return null;
    }
    throw Error(c(156, t.tag));
  }
  function Vg(e, t) {
    switch (Hr(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return nn(Qe), gn(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Ol(t), null;
      case 13:
        if (Pt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(c(340));
          La();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return je(Ve), null;
      case 4:
        return gn(), null;
      case 10:
        return nn(t.type), null;
      case 22:
      case 23:
        return Pt(t), Yr(), e !== null && je(il), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return nn(Qe), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function lh(e, t) {
    switch (Hr(t), t.tag) {
      case 3:
        nn(Qe), gn();
        break;
      case 26:
      case 27:
      case 5:
        Ol(t);
        break;
      case 4:
        gn();
        break;
      case 13:
        Pt(t);
        break;
      case 19:
        je(Ve);
        break;
      case 10:
        nn(t.type);
        break;
      case 22:
      case 23:
        Pt(t), Yr(), e !== null && je(il);
        break;
      case 24:
        nn(Qe);
    }
  }
  var Qg = {
    getCacheForType: function(e) {
      var t = tt(Qe), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    }
  }, Zg = typeof WeakMap == "function" ? WeakMap : Map, He = 0, De = null, ye = null, xe = 0, Ne = 0, pt = null, cn = !1, Pl = !1, jc = !1, on = 0, Be = 0, Un = 0, vl = 0, Uc = 0, Dt = 0, Il = 0, ai = null, kt = null, Hc = !1, Lc = 0, fu = 1 / 0, du = null, Hn = null, hu = !1, ml = null, ii = 0, Bc = 0, qc = null, ui = 0, Yc = null;
  function bt() {
    if (He & 2 && xe !== 0)
      return xe & -xe;
    if (J.T !== null) {
      var e = Vl;
      return e !== 0 ? e : Jc();
    }
    return As();
  }
  function ah() {
    Dt === 0 && (Dt = !(xe & 536870912) || Ae ? ps() : 536870912);
    var e = Ot.current;
    return e !== null && (e.flags |= 32), Dt;
  }
  function at(e, t, n) {
    (e === De && Ne === 2 || e.cancelPendingCommit !== null) && (ea(e, 0), sn(
      e,
      xe,
      Dt,
      !1
    )), wa(e, n), (!(He & 2) || e !== De) && (e === De && (!(He & 2) && (vl |= n), Be === 4 && sn(
      e,
      xe,
      Dt,
      !1
    )), Xt(e));
  }
  function ih(e, t, n) {
    if (He & 6) throw Error(c(327));
    var l = !n && (t & 60) === 0 && (t & e.expiredLanes) === 0 || Aa(e, t), i = l ? Wg(e, t) : Vc(e, t, !0), u = l;
    do {
      if (i === 0) {
        Pl && !l && sn(e, t, 0, !1);
        break;
      } else if (i === 6)
        sn(
          e,
          t,
          0,
          !cn
        );
      else {
        if (n = e.current.alternate, u && !Kg(n)) {
          i = Vc(e, t, !1), u = !1;
          continue;
        }
        if (i === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var s = 0;
          else
            s = e.pendingLanes & -536870913, s = s !== 0 ? s : s & 536870912 ? 536870912 : 0;
          if (s !== 0) {
            t = s;
            e: {
              var v = e;
              i = ai;
              var b = v.current.memoizedState.isDehydrated;
              if (b && (ea(v, s).flags |= 256), s = Vc(
                v,
                s,
                !1
              ), s !== 2) {
                if (jc && !b) {
                  v.errorRecoveryDisabledLanes |= u, vl |= u, i = 4;
                  break e;
                }
                u = kt, kt = i, u !== null && Gc(u);
              }
              i = s;
            }
            if (u = !1, i !== 2) continue;
          }
        }
        if (i === 1) {
          ea(e, 0), sn(e, t, 0, !0);
          break;
        }
        e: {
          switch (l = e, i) {
            case 0:
            case 1:
              throw Error(c(345));
            case 4:
              if ((t & 4194176) === t) {
                sn(
                  l,
                  t,
                  Dt,
                  !cn
                );
                break e;
              }
              break;
            case 2:
              kt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(c(329));
          }
          if (l.finishedWork = n, l.finishedLanes = t, (t & 62914560) === t && (u = Lc + 300 - Bt(), 10 < u)) {
            if (sn(
              l,
              t,
              Dt,
              !cn
            ), Oi(l, 0) !== 0) break e;
            l.timeoutHandle = Mh(
              uh.bind(
                null,
                l,
                n,
                kt,
                du,
                Hc,
                t,
                Dt,
                vl,
                Il,
                cn,
                2,
                -0,
                0
              ),
              u
            );
            break e;
          }
          uh(
            l,
            n,
            kt,
            du,
            Hc,
            t,
            Dt,
            vl,
            Il,
            cn,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Xt(e);
  }
  function Gc(e) {
    kt === null ? kt = e : kt.push.apply(
      kt,
      e
    );
  }
  function uh(e, t, n, l, i, u, s, v, b, w, U, Y, z) {
    var j = t.subtreeFlags;
    if ((j & 8192 || (j & 16785408) === 16785408) && (di = { stylesheets: null, count: 0, unsuspend: Cp }, $d(t), t = Dp(), t !== null)) {
      e.cancelPendingCommit = t(
        hh.bind(
          null,
          e,
          n,
          l,
          i,
          s,
          v,
          b,
          1,
          Y,
          z
        )
      ), sn(e, u, s, !w);
      return;
    }
    hh(
      e,
      n,
      l,
      i,
      s,
      v,
      b,
      U,
      Y,
      z
    );
  }
  function Kg(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var i = n[l], u = i.getSnapshot;
          i = i.value;
          try {
            if (!mt(u(), i)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null)
        n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function sn(e, t, n, l) {
    t &= ~Uc, t &= ~vl, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var i = t; 0 < i; ) {
      var u = 31 - vt(i), s = 1 << u;
      l[u] = -1, i &= ~s;
    }
    n !== 0 && xs(e, n, t);
  }
  function vu() {
    return He & 6 ? !0 : (ri(0), !1);
  }
  function kc() {
    if (ye !== null) {
      if (Ne === 0)
        var e = ye.return;
      else
        e = ye, tn = sl = null, Jr(e), kl = null, Ga = 0, e = ye;
      for (; e !== null; )
        lh(e.alternate, e), e = e.return;
      ye = null;
    }
  }
  function ea(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, dp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), kc(), De = e, ye = n = jn(e.current, null), xe = t, Ne = 0, pt = null, cn = !1, Pl = Aa(e, t), jc = !1, Il = Dt = Uc = vl = Un = Be = 0, kt = ai = null, Hc = !1, t & 8 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var i = 31 - vt(l), u = 1 << i;
        t |= e[i], l &= ~u;
      }
    return on = t, Bi(), n;
  }
  function rh(e, t) {
    he = null, J.H = Gt, t === qa ? (t = Ef(), Ne = 3) : t === bf ? (t = Ef(), Ne = 4) : Ne = t === xd ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, pt = t, ye === null && (Be = 1, au(
      e,
      At(t, e.current)
    ));
  }
  function ch() {
    var e = J.H;
    return J.H = Gt, e === null ? Gt : e;
  }
  function oh() {
    var e = J.A;
    return J.A = Qg, e;
  }
  function Xc() {
    Be = 4, cn || (xe & 4194176) !== xe && Ot.current !== null || (Pl = !0), !(Un & 134217727) && !(vl & 134217727) || De === null || sn(
      De,
      xe,
      Dt,
      !1
    );
  }
  function Vc(e, t, n) {
    var l = He;
    He |= 2;
    var i = ch(), u = oh();
    (De !== e || xe !== t) && (du = null, ea(e, t)), t = !1;
    var s = Be;
    e: do
      try {
        if (Ne !== 0 && ye !== null) {
          var v = ye, b = pt;
          switch (Ne) {
            case 8:
              kc(), s = 6;
              break e;
            case 3:
            case 2:
            case 6:
              Ot.current === null && (t = !0);
              var w = Ne;
              if (Ne = 0, pt = null, ta(e, v, b, w), n && Pl) {
                s = 0;
                break e;
              }
              break;
            default:
              w = Ne, Ne = 0, pt = null, ta(e, v, b, w);
          }
        }
        Jg(), s = Be;
        break;
      } catch (U) {
        rh(e, U);
      }
    while (!0);
    return t && e.shellSuspendCounter++, tn = sl = null, He = l, J.H = i, J.A = u, ye === null && (De = null, xe = 0, Bi()), s;
  }
  function Jg() {
    for (; ye !== null; ) sh(ye);
  }
  function Wg(e, t) {
    var n = He;
    He |= 2;
    var l = ch(), i = oh();
    De !== e || xe !== t ? (du = null, fu = Bt() + 500, ea(e, t)) : Pl = Aa(
      e,
      t
    );
    e: do
      try {
        if (Ne !== 0 && ye !== null) {
          t = ye;
          var u = pt;
          t: switch (Ne) {
            case 1:
              Ne = 0, pt = null, ta(e, t, u, 1);
              break;
            case 2:
              if (xf(u)) {
                Ne = 0, pt = null, fh(t);
                break;
              }
              t = function() {
                Ne === 2 && De === e && (Ne = 7), Xt(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ne = 7;
              break e;
            case 4:
              Ne = 5;
              break e;
            case 7:
              xf(u) ? (Ne = 0, pt = null, fh(t)) : (Ne = 0, pt = null, ta(e, t, u, 7));
              break;
            case 5:
              var s = null;
              switch (ye.tag) {
                case 26:
                  s = ye.memoizedState;
                case 5:
                case 27:
                  var v = ye;
                  if (!s || Yh(s)) {
                    Ne = 0, pt = null;
                    var b = v.sibling;
                    if (b !== null) ye = b;
                    else {
                      var w = v.return;
                      w !== null ? (ye = w, mu(w)) : ye = null;
                    }
                    break t;
                  }
              }
              Ne = 0, pt = null, ta(e, t, u, 5);
              break;
            case 6:
              Ne = 0, pt = null, ta(e, t, u, 6);
              break;
            case 8:
              kc(), Be = 6;
              break e;
            default:
              throw Error(c(462));
          }
        }
        $g();
        break;
      } catch (U) {
        rh(e, U);
      }
    while (!0);
    return tn = sl = null, J.H = l, J.A = i, He = n, ye !== null ? 0 : (De = null, xe = 0, Bi(), Be);
  }
  function $g() {
    for (; ye !== null && !py(); )
      sh(ye);
  }
  function sh(e) {
    var t = zd(e.alternate, e, on);
    e.memoizedProps = e.pendingProps, t === null ? mu(e) : ye = t;
  }
  function fh(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Od(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          xe
        );
        break;
      case 11:
        t = Od(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          xe
        );
        break;
      case 5:
        Jr(t);
      default:
        lh(n, t), t = ye = eh(t, on), t = zd(n, t, on);
    }
    e.memoizedProps = e.pendingProps, t === null ? mu(e) : ye = t;
  }
  function ta(e, t, n, l) {
    tn = sl = null, Jr(t), kl = null, Ga = 0;
    var i = t.return;
    try {
      if (Bg(
        e,
        i,
        t,
        n,
        xe
      )) {
        Be = 1, au(
          e,
          At(n, e.current)
        ), ye = null;
        return;
      }
    } catch (u) {
      if (i !== null) throw ye = i, u;
      Be = 1, au(
        e,
        At(n, e.current)
      ), ye = null;
      return;
    }
    t.flags & 32768 ? (Ae || l === 1 ? e = !0 : Pl || xe & 536870912 ? e = !1 : (cn = e = !0, (l === 2 || l === 3 || l === 6) && (l = Ot.current, l !== null && l.tag === 13 && (l.flags |= 16384))), dh(t, e)) : mu(t);
  }
  function mu(e) {
    var t = e;
    do {
      if (t.flags & 32768) {
        dh(
          t,
          cn
        );
        return;
      }
      e = t.return;
      var n = Xg(
        t.alternate,
        t,
        on
      );
      if (n !== null) {
        ye = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        ye = t;
        return;
      }
      ye = t = e;
    } while (t !== null);
    Be === 0 && (Be = 5);
  }
  function dh(e, t) {
    do {
      var n = Vg(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, ye = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        ye = e;
        return;
      }
      ye = e = n;
    } while (e !== null);
    Be = 6, ye = null;
  }
  function hh(e, t, n, l, i, u, s, v, b, w) {
    var U = J.T, Y = W.p;
    try {
      W.p = 2, J.T = null, Fg(
        e,
        t,
        n,
        l,
        Y,
        i,
        u,
        s,
        v,
        b,
        w
      );
    } finally {
      J.T = U, W.p = Y;
    }
  }
  function Fg(e, t, n, l, i, u, s, v) {
    do
      na();
    while (ml !== null);
    if (He & 6) throw Error(c(327));
    var b = e.finishedWork;
    if (l = e.finishedLanes, b === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, b === e.current) throw Error(c(177));
    e.callbackNode = null, e.callbackPriority = 0, e.cancelPendingCommit = null;
    var w = b.lanes | b.childLanes;
    if (w |= _r, My(
      e,
      l,
      w,
      u,
      s,
      v
    ), e === De && (ye = De = null, xe = 0), !(b.subtreeFlags & 10256) && !(b.flags & 10256) || hu || (hu = !0, Bc = w, qc = n, tp(Ai, function() {
      return na(), null;
    })), n = (b.flags & 15990) !== 0, b.subtreeFlags & 15990 || n ? (n = J.T, J.T = null, u = W.p, W.p = 2, s = He, He |= 4, Yg(e, b), Kd(b, e), Sg(no, e.containerInfo), Ru = !!to, no = to = null, e.current = b, Xd(e, b.alternate, b), by(), He = s, W.p = u, J.T = n) : e.current = b, hu ? (hu = !1, ml = e, ii = l) : vh(e, w), w = e.pendingLanes, w === 0 && (Hn = null), wy(b.stateNode), Xt(e), t !== null)
      for (i = e.onRecoverableError, b = 0; b < t.length; b++)
        w = t[b], i(w.value, {
          componentStack: w.stack
        });
    return ii & 3 && na(), w = e.pendingLanes, l & 4194218 && w & 42 ? e === Yc ? ui++ : (ui = 0, Yc = e) : ui = 0, ri(0), null;
  }
  function vh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Xa(t)));
  }
  function na() {
    if (ml !== null) {
      var e = ml, t = Bc;
      Bc = 0;
      var n = Es(ii), l = J.T, i = W.p;
      try {
        if (W.p = 32 > n ? 32 : n, J.T = null, ml === null)
          var u = !1;
        else {
          n = qc, qc = null;
          var s = ml, v = ii;
          if (ml = null, ii = 0, He & 6)
            throw Error(c(331));
          var b = He;
          if (He |= 4, Pd(s.current), Wd(s, s.current, v, n), He = b, ri(0, !1), ht && typeof ht.onPostCommitFiberRoot == "function")
            try {
              ht.onPostCommitFiberRoot(Ea, s);
            } catch {
            }
          u = !0;
        }
        return u;
      } finally {
        W.p = i, J.T = l, vh(e, t);
      }
    }
    return !1;
  }
  function mh(e, t, n) {
    t = At(n, t), t = cc(e.stateNode, t, 2), e = Dn(e, t, 2), e !== null && (wa(e, 2), Xt(e));
  }
  function Me(e, t, n) {
    if (e.tag === 3)
      mh(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          mh(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Hn === null || !Hn.has(l))) {
            e = At(n, e), n = pd(2), l = Dn(t, n, 2), l !== null && (bd(
              n,
              l,
              t,
              e
            ), wa(l, 2), Xt(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function Qc(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new Zg();
      var i = /* @__PURE__ */ new Set();
      l.set(t, i);
    } else
      i = l.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), l.set(t, i));
    i.has(n) || (jc = !0, i.add(n), e = Pg.bind(null, e, t, n), t.then(e, e));
  }
  function Pg(e, t, n) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, De === e && (xe & n) === n && (Be === 4 || Be === 3 && (xe & 62914560) === xe && 300 > Bt() - Lc ? !(He & 2) && ea(e, 0) : Uc |= n, Il === xe && (Il = 0)), Xt(e);
  }
  function yh(e, t) {
    t === 0 && (t = bs()), e = En(e, t), e !== null && (wa(e, t), Xt(e));
  }
  function Ig(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), yh(e, n);
  }
  function ep(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var l = e.stateNode, i = e.memoizedState;
        i !== null && (n = i.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(c(314));
    }
    l !== null && l.delete(t), yh(e, n);
  }
  function tp(e, t) {
    return or(e, t);
  }
  var yu = null, la = null, Zc = !1, gu = !1, Kc = !1, yl = 0;
  function Xt(e) {
    e !== la && e.next === null && (la === null ? yu = la = e : la = la.next = e), gu = !0, Zc || (Zc = !0, lp(np));
  }
  function ri(e, t) {
    if (!Kc && gu) {
      Kc = !0;
      do
        for (var n = !1, l = yu; l !== null; ) {
          if (e !== 0) {
            var i = l.pendingLanes;
            if (i === 0) var u = 0;
            else {
              var s = l.suspendedLanes, v = l.pingedLanes;
              u = (1 << 31 - vt(42 | e) + 1) - 1, u &= i & ~(s & ~v), u = u & 201326677 ? u & 201326677 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, bh(l, u));
          } else
            u = xe, u = Oi(
              l,
              l === De ? u : 0
            ), !(u & 3) || Aa(l, u) || (n = !0, bh(l, u));
          l = l.next;
        }
      while (n);
      Kc = !1;
    }
  }
  function np() {
    gu = Zc = !1;
    var e = 0;
    yl !== 0 && (fp() && (e = yl), yl = 0);
    for (var t = Bt(), n = null, l = yu; l !== null; ) {
      var i = l.next, u = gh(l, t);
      u === 0 ? (l.next = null, n === null ? yu = i : n.next = i, i === null && (la = n)) : (n = l, (e !== 0 || u & 3) && (gu = !0)), l = i;
    }
    ri(e);
  }
  function gh(e, t) {
    for (var n = e.suspendedLanes, l = e.pingedLanes, i = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var s = 31 - vt(u), v = 1 << s, b = i[s];
      b === -1 ? (!(v & n) || v & l) && (i[s] = Cy(v, t)) : b <= t && (e.expiredLanes |= v), u &= ~v;
    }
    if (t = De, n = xe, n = Oi(
      e,
      e === t ? n : 0
    ), l = e.callbackNode, n === 0 || e === t && Ne === 2 || e.cancelPendingCommit !== null)
      return l !== null && l !== null && sr(l), e.callbackNode = null, e.callbackPriority = 0;
    if (!(n & 3) || Aa(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (l !== null && sr(l), Es(n)) {
        case 2:
        case 8:
          n = ys;
          break;
        case 32:
          n = Ai;
          break;
        case 268435456:
          n = gs;
          break;
        default:
          n = Ai;
      }
      return l = ph.bind(null, e), n = or(n, l), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return l !== null && l !== null && sr(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function ph(e, t) {
    var n = e.callbackNode;
    if (na() && e.callbackNode !== n)
      return null;
    var l = xe;
    return l = Oi(
      e,
      e === De ? l : 0
    ), l === 0 ? null : (ih(e, l, t), gh(e, Bt()), e.callbackNode != null && e.callbackNode === n ? ph.bind(null, e) : null);
  }
  function bh(e, t) {
    if (na()) return null;
    ih(e, t, !0);
  }
  function lp(e) {
    hp(function() {
      He & 6 ? or(ms, e) : e();
    });
  }
  function Jc() {
    return yl === 0 && (yl = ps()), yl;
  }
  function xh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Ni("" + e);
  }
  function Sh(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function ap(e, t, n, l, i) {
    if (t === "submit" && n && n.stateNode === i) {
      var u = xh(
        (i[ut] || null).action
      ), s = l.submitter;
      s && (t = (t = s[ut] || null) ? xh(t.formAction) : s.getAttribute("formAction"), t !== null && (u = t, s = null));
      var v = new Ui(
        "action",
        "action",
        null,
        l,
        i
      );
      e.push({
        event: v,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (yl !== 0) {
                  var b = s ? Sh(i, s) : new FormData(i);
                  lc(
                    n,
                    {
                      pending: !0,
                      data: b,
                      method: i.method,
                      action: u
                    },
                    null,
                    b
                  );
                }
              } else
                typeof u == "function" && (v.preventDefault(), b = s ? Sh(i, s) : new FormData(i), lc(
                  n,
                  {
                    pending: !0,
                    data: b,
                    method: i.method,
                    action: u
                  },
                  u,
                  b
                ));
            },
            currentTarget: i
          }
        ]
      });
    }
  }
  for (var Wc = 0; Wc < hf.length; Wc++) {
    var $c = hf[Wc], ip = $c.toLowerCase(), up = $c[0].toUpperCase() + $c.slice(1);
    zt(
      ip,
      "on" + up
    );
  }
  zt(cf, "onAnimationEnd"), zt(of, "onAnimationIteration"), zt(sf, "onAnimationStart"), zt("dblclick", "onDoubleClick"), zt("focusin", "onFocus"), zt("focusout", "onBlur"), zt(Ag, "onTransitionRun"), zt(wg, "onTransitionStart"), zt(Tg, "onTransitionCancel"), zt(ff, "onTransitionEnd"), Dl("onMouseEnter", ["mouseout", "mouseover"]), Dl("onMouseLeave", ["mouseout", "mouseover"]), Dl("onPointerEnter", ["pointerout", "pointerover"]), Dl("onPointerLeave", ["pointerout", "pointerover"]), Fn(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Fn(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Fn("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Fn(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Fn(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Fn(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ci = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), rp = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ci)
  );
  function Eh(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n], i = l.event;
      l = l.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var s = l.length - 1; 0 <= s; s--) {
            var v = l[s], b = v.instance, w = v.currentTarget;
            if (v = v.listener, b !== u && i.isPropagationStopped())
              break e;
            u = v, i.currentTarget = w;
            try {
              u(i);
            } catch (U) {
              lu(U);
            }
            i.currentTarget = null, u = b;
          }
        else
          for (s = 0; s < l.length; s++) {
            if (v = l[s], b = v.instance, w = v.currentTarget, v = v.listener, b !== u && i.isPropagationStopped())
              break e;
            u = v, i.currentTarget = w;
            try {
              u(i);
            } catch (U) {
              lu(U);
            }
            i.currentTarget = null, u = b;
          }
      }
    }
  }
  function be(e, t) {
    var n = t[dr];
    n === void 0 && (n = t[dr] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    n.has(l) || (Ah(t, e, 2, !1), n.add(l));
  }
  function Fc(e, t, n) {
    var l = 0;
    t && (l |= 4), Ah(
      n,
      e,
      l,
      t
    );
  }
  var pu = "_reactListening" + Math.random().toString(36).slice(2);
  function Pc(e) {
    if (!e[pu]) {
      e[pu] = !0, Ts.forEach(function(n) {
        n !== "selectionchange" && (rp.has(n) || Fc(n, !1, e), Fc(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[pu] || (t[pu] = !0, Fc("selectionchange", !1, t));
    }
  }
  function Ah(e, t, n, l) {
    switch (Zh(t)) {
      case 2:
        var i = _p;
        break;
      case 8:
        i = jp;
        break;
      default:
        i = fo;
    }
    n = i.bind(
      null,
      t,
      n,
      e
    ), i = void 0, !xr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), l ? i !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: i
    }) : e.addEventListener(t, n, !0) : i !== void 0 ? e.addEventListener(t, n, {
      passive: i
    }) : e.addEventListener(t, n, !1);
  }
  function Ic(e, t, n, l, i) {
    var u = l;
    if (!(t & 1) && !(t & 2) && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var s = l.tag;
        if (s === 3 || s === 4) {
          var v = l.stateNode.containerInfo;
          if (v === i || v.nodeType === 8 && v.parentNode === i)
            break;
          if (s === 4)
            for (s = l.return; s !== null; ) {
              var b = s.tag;
              if ((b === 3 || b === 4) && (b = s.stateNode.containerInfo, b === i || b.nodeType === 8 && b.parentNode === i))
                return;
              s = s.return;
            }
          for (; v !== null; ) {
            if (s = $n(v), s === null) return;
            if (b = s.tag, b === 5 || b === 6 || b === 26 || b === 27) {
              l = u = s;
              continue e;
            }
            v = v.parentNode;
          }
        }
        l = l.return;
      }
    Ls(function() {
      var w = u, U = pr(n), Y = [];
      e: {
        var z = df.get(e);
        if (z !== void 0) {
          var j = Ui, te = e;
          switch (e) {
            case "keypress":
              if (_i(n) === 0) break e;
            case "keydown":
            case "keyup":
              j = eg;
              break;
            case "focusin":
              te = "focus", j = wr;
              break;
            case "focusout":
              te = "blur", j = wr;
              break;
            case "beforeblur":
            case "afterblur":
              j = wr;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              j = Ys;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              j = ky;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              j = lg;
              break;
            case cf:
            case of:
            case sf:
              j = Qy;
              break;
            case ff:
              j = ig;
              break;
            case "scroll":
            case "scrollend":
              j = Yy;
              break;
            case "wheel":
              j = rg;
              break;
            case "copy":
            case "cut":
            case "paste":
              j = Ky;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              j = ks;
              break;
            case "toggle":
            case "beforetoggle":
              j = og;
          }
          var ce = (t & 4) !== 0, qe = !ce && (e === "scroll" || e === "scrollend"), C = ce ? z !== null ? z + "Capture" : null : z;
          ce = [];
          for (var A = w, N; A !== null; ) {
            var q = A;
            if (N = q.stateNode, q = q.tag, q !== 5 && q !== 26 && q !== 27 || N === null || C === null || (q = Ra(A, C), q != null && ce.push(
              oi(A, q, N)
            )), qe) break;
            A = A.return;
          }
          0 < ce.length && (z = new j(
            z,
            te,
            null,
            n,
            U
          ), Y.push({ event: z, listeners: ce }));
        }
      }
      if (!(t & 7)) {
        e: {
          if (z = e === "mouseover" || e === "pointerover", j = e === "mouseout" || e === "pointerout", z && n !== gr && (te = n.relatedTarget || n.fromElement) && ($n(te) || te[Rl]))
            break e;
          if ((j || z) && (z = U.window === U ? U : (z = U.ownerDocument) ? z.defaultView || z.parentWindow : window, j ? (te = n.relatedTarget || n.toElement, j = w, te = te ? $n(te) : null, te !== null && (qe = X(te), ce = te.tag, te !== qe || ce !== 5 && ce !== 27 && ce !== 6) && (te = null)) : (j = null, te = w), j !== te)) {
            if (ce = Ys, q = "onMouseLeave", C = "onMouseEnter", A = "mouse", (e === "pointerout" || e === "pointerover") && (ce = ks, q = "onPointerLeave", C = "onPointerEnter", A = "pointer"), qe = j == null ? z : Oa(j), N = te == null ? z : Oa(te), z = new ce(
              q,
              A + "leave",
              j,
              n,
              U
            ), z.target = qe, z.relatedTarget = N, q = null, $n(U) === w && (ce = new ce(
              C,
              A + "enter",
              te,
              n,
              U
            ), ce.target = N, ce.relatedTarget = qe, q = ce), qe = q, j && te)
              t: {
                for (ce = j, C = te, A = 0, N = ce; N; N = aa(N))
                  A++;
                for (N = 0, q = C; q; q = aa(q))
                  N++;
                for (; 0 < A - N; )
                  ce = aa(ce), A--;
                for (; 0 < N - A; )
                  C = aa(C), N--;
                for (; A--; ) {
                  if (ce === C || C !== null && ce === C.alternate)
                    break t;
                  ce = aa(ce), C = aa(C);
                }
                ce = null;
              }
            else ce = null;
            j !== null && wh(
              Y,
              z,
              j,
              ce,
              !1
            ), te !== null && qe !== null && wh(
              Y,
              qe,
              te,
              ce,
              !0
            );
          }
        }
        e: {
          if (z = w ? Oa(w) : window, j = z.nodeName && z.nodeName.toLowerCase(), j === "select" || j === "input" && z.type === "file")
            var F = $s;
          else if (Js(z))
            if (Fs)
              F = bg;
            else {
              F = gg;
              var ve = yg;
            }
          else
            j = z.nodeName, !j || j.toLowerCase() !== "input" || z.type !== "checkbox" && z.type !== "radio" ? w && yr(w.elementType) && (F = $s) : F = pg;
          if (F && (F = F(e, w))) {
            Ws(
              Y,
              F,
              n,
              U
            );
            break e;
          }
          ve && ve(e, z, w), e === "focusout" && w && z.type === "number" && w.memoizedProps.value != null && mr(z, "number", z.value);
        }
        switch (ve = w ? Oa(w) : window, e) {
          case "focusin":
            (Js(ve) || ve.contentEditable === "true") && (Hl = ve, Dr = w, Ua = null);
            break;
          case "focusout":
            Ua = Dr = Hl = null;
            break;
          case "mousedown":
            Nr = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Nr = !1, uf(Y, n, U);
            break;
          case "selectionchange":
            if (Eg) break;
          case "keydown":
          case "keyup":
            uf(Y, n, U);
        }
        var ae;
        if (Or)
          e: {
            switch (e) {
              case "compositionstart":
                var ue = "onCompositionStart";
                break e;
              case "compositionend":
                ue = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ue = "onCompositionUpdate";
                break e;
            }
            ue = void 0;
          }
        else
          Ul ? Zs(e, n) && (ue = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ue = "onCompositionStart");
        ue && (Xs && n.locale !== "ko" && (Ul || ue !== "onCompositionStart" ? ue === "onCompositionEnd" && Ul && (ae = Bs()) : (Sn = U, Sr = "value" in Sn ? Sn.value : Sn.textContent, Ul = !0)), ve = bu(w, ue), 0 < ve.length && (ue = new Gs(
          ue,
          e,
          null,
          n,
          U
        ), Y.push({ event: ue, listeners: ve }), ae ? ue.data = ae : (ae = Ks(n), ae !== null && (ue.data = ae)))), (ae = fg ? dg(e, n) : hg(e, n)) && (ue = bu(w, "onBeforeInput"), 0 < ue.length && (ve = new Gs(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          U
        ), Y.push({
          event: ve,
          listeners: ue
        }), ve.data = ae)), ap(
          Y,
          e,
          w,
          n,
          U
        );
      }
      Eh(Y, t);
    });
  }
  function oi(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function bu(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var i = e, u = i.stateNode;
      i = i.tag, i !== 5 && i !== 26 && i !== 27 || u === null || (i = Ra(e, n), i != null && l.unshift(
        oi(e, i, u)
      ), i = Ra(e, t), i != null && l.push(
        oi(e, i, u)
      )), e = e.return;
    }
    return l;
  }
  function aa(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function wh(e, t, n, l, i) {
    for (var u = t._reactName, s = []; n !== null && n !== l; ) {
      var v = n, b = v.alternate, w = v.stateNode;
      if (v = v.tag, b !== null && b === l) break;
      v !== 5 && v !== 26 && v !== 27 || w === null || (b = w, i ? (w = Ra(n, u), w != null && s.unshift(
        oi(n, w, b)
      )) : i || (w = Ra(n, u), w != null && s.push(
        oi(n, w, b)
      ))), n = n.return;
    }
    s.length !== 0 && e.push({ event: t, listeners: s });
  }
  var cp = /\r\n?/g, op = /\u0000|\uFFFD/g;
  function Th(e) {
    return (typeof e == "string" ? e : "" + e).replace(cp, `
`).replace(op, "");
  }
  function Oh(e, t) {
    return t = Th(t), Th(e) === t;
  }
  function xu() {
  }
  function Oe(e, t, n, l, i, u) {
    switch (n) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || zl(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && zl(e, "" + l);
        break;
      case "className":
        Ci(e, "class", l);
        break;
      case "tabIndex":
        Ci(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ci(e, n, l);
        break;
      case "style":
        Us(e, l, u);
        break;
      case "data":
        if (t !== "object") {
          Ci(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = Ni("" + l), e.setAttribute(n, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (n === "formAction" ? (t !== "input" && Oe(e, t, "name", i.name, i, null), Oe(
            e,
            t,
            "formEncType",
            i.formEncType,
            i,
            null
          ), Oe(
            e,
            t,
            "formMethod",
            i.formMethod,
            i,
            null
          ), Oe(
            e,
            t,
            "formTarget",
            i.formTarget,
            i,
            null
          )) : (Oe(e, t, "encType", i.encType, i, null), Oe(e, t, "method", i.method, i, null), Oe(e, t, "target", i.target, i, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = Ni("" + l), e.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (e.onclick = xu);
        break;
      case "onScroll":
        l != null && be("scroll", e);
        break;
      case "onScrollEnd":
        l != null && be("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(c(61));
          if (n = l.__html, n != null) {
            if (i.children != null) throw Error(c(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        n = Ni("" + l), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "" + l) : e.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(n, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(n) : e.setAttribute(n, l);
        break;
      case "popover":
        be("beforetoggle", e), be("toggle", e), Ri(e, "popover", l);
        break;
      case "xlinkActuate":
        Wt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        Wt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        Wt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        Wt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        Wt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        Wt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        Wt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        Wt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        Wt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        Ri(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = By.get(n) || n, Ri(e, n, l));
    }
  }
  function eo(e, t, n, l, i, u) {
    switch (n) {
      case "style":
        Us(e, l, u);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(c(61));
          if (n = l.__html, n != null) {
            if (i.children != null) throw Error(c(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof l == "string" ? zl(e, l) : (typeof l == "number" || typeof l == "bigint") && zl(e, "" + l);
        break;
      case "onScroll":
        l != null && be("scroll", e);
        break;
      case "onScrollEnd":
        l != null && be("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = xu);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Os.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), u = e[ut] || null, u = u != null ? u[n] : null, typeof u == "function" && e.removeEventListener(t, u, i), typeof l == "function")) {
              typeof u != "function" && u !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, l, i);
              break e;
            }
            n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : Ri(e, n, l);
          }
    }
  }
  function Ie(e, t, n) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        be("error", e), be("load", e);
        var l = !1, i = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var s = n[u];
            if (s != null)
              switch (u) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  i = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(c(137, t));
                default:
                  Oe(e, t, u, s, n, null);
              }
          }
        i && Oe(e, t, "srcSet", n.srcSet, n, null), l && Oe(e, t, "src", n.src, n, null);
        return;
      case "input":
        be("invalid", e);
        var v = u = s = i = null, b = null, w = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var U = n[l];
            if (U != null)
              switch (l) {
                case "name":
                  i = U;
                  break;
                case "type":
                  s = U;
                  break;
                case "checked":
                  b = U;
                  break;
                case "defaultChecked":
                  w = U;
                  break;
                case "value":
                  u = U;
                  break;
                case "defaultValue":
                  v = U;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (U != null)
                    throw Error(c(137, t));
                  break;
                default:
                  Oe(e, t, l, U, n, null);
              }
          }
        Ns(
          e,
          u,
          v,
          b,
          w,
          s,
          i,
          !1
        ), Mi(e);
        return;
      case "select":
        be("invalid", e), l = s = u = null;
        for (i in n)
          if (n.hasOwnProperty(i) && (v = n[i], v != null))
            switch (i) {
              case "value":
                u = v;
                break;
              case "defaultValue":
                s = v;
                break;
              case "multiple":
                l = v;
              default:
                Oe(e, t, i, v, n, null);
            }
        t = u, n = s, e.multiple = !!l, t != null ? Nl(e, !!l, t, !1) : n != null && Nl(e, !!l, n, !0);
        return;
      case "textarea":
        be("invalid", e), u = i = l = null;
        for (s in n)
          if (n.hasOwnProperty(s) && (v = n[s], v != null))
            switch (s) {
              case "value":
                l = v;
                break;
              case "defaultValue":
                i = v;
                break;
              case "children":
                u = v;
                break;
              case "dangerouslySetInnerHTML":
                if (v != null) throw Error(c(91));
                break;
              default:
                Oe(e, t, s, v, n, null);
            }
        _s(e, l, i, u), Mi(e);
        return;
      case "option":
        for (b in n)
          if (n.hasOwnProperty(b) && (l = n[b], l != null))
            switch (b) {
              case "selected":
                e.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Oe(e, t, b, l, n, null);
            }
        return;
      case "dialog":
        be("cancel", e), be("close", e);
        break;
      case "iframe":
      case "object":
        be("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < ci.length; l++)
          be(ci[l], e);
        break;
      case "image":
        be("error", e), be("load", e);
        break;
      case "details":
        be("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        be("error", e), be("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (w in n)
          if (n.hasOwnProperty(w) && (l = n[w], l != null))
            switch (w) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(c(137, t));
              default:
                Oe(e, t, w, l, n, null);
            }
        return;
      default:
        if (yr(t)) {
          for (U in n)
            n.hasOwnProperty(U) && (l = n[U], l !== void 0 && eo(
              e,
              t,
              U,
              l,
              n,
              void 0
            ));
          return;
        }
    }
    for (v in n)
      n.hasOwnProperty(v) && (l = n[v], l != null && Oe(e, t, v, l, n, null));
  }
  function sp(e, t, n, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var i = null, u = null, s = null, v = null, b = null, w = null, U = null;
        for (j in n) {
          var Y = n[j];
          if (n.hasOwnProperty(j) && Y != null)
            switch (j) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                b = Y;
              default:
                l.hasOwnProperty(j) || Oe(e, t, j, null, l, Y);
            }
        }
        for (var z in l) {
          var j = l[z];
          if (Y = n[z], l.hasOwnProperty(z) && (j != null || Y != null))
            switch (z) {
              case "type":
                u = j;
                break;
              case "name":
                i = j;
                break;
              case "checked":
                w = j;
                break;
              case "defaultChecked":
                U = j;
                break;
              case "value":
                s = j;
                break;
              case "defaultValue":
                v = j;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (j != null)
                  throw Error(c(137, t));
                break;
              default:
                j !== Y && Oe(
                  e,
                  t,
                  z,
                  j,
                  l,
                  Y
                );
            }
        }
        vr(
          e,
          s,
          v,
          b,
          w,
          U,
          u,
          i
        );
        return;
      case "select":
        j = s = v = z = null;
        for (u in n)
          if (b = n[u], n.hasOwnProperty(u) && b != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                j = b;
              default:
                l.hasOwnProperty(u) || Oe(
                  e,
                  t,
                  u,
                  null,
                  l,
                  b
                );
            }
        for (i in l)
          if (u = l[i], b = n[i], l.hasOwnProperty(i) && (u != null || b != null))
            switch (i) {
              case "value":
                z = u;
                break;
              case "defaultValue":
                v = u;
                break;
              case "multiple":
                s = u;
              default:
                u !== b && Oe(
                  e,
                  t,
                  i,
                  u,
                  l,
                  b
                );
            }
        t = v, n = s, l = j, z != null ? Nl(e, !!n, z, !1) : !!l != !!n && (t != null ? Nl(e, !!n, t, !0) : Nl(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        j = z = null;
        for (v in n)
          if (i = n[v], n.hasOwnProperty(v) && i != null && !l.hasOwnProperty(v))
            switch (v) {
              case "value":
                break;
              case "children":
                break;
              default:
                Oe(e, t, v, null, l, i);
            }
        for (s in l)
          if (i = l[s], u = n[s], l.hasOwnProperty(s) && (i != null || u != null))
            switch (s) {
              case "value":
                z = i;
                break;
              case "defaultValue":
                j = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(c(91));
                break;
              default:
                i !== u && Oe(e, t, s, i, l, u);
            }
        zs(e, z, j);
        return;
      case "option":
        for (var te in n)
          if (z = n[te], n.hasOwnProperty(te) && z != null && !l.hasOwnProperty(te))
            switch (te) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Oe(
                  e,
                  t,
                  te,
                  null,
                  l,
                  z
                );
            }
        for (b in l)
          if (z = l[b], j = n[b], l.hasOwnProperty(b) && z !== j && (z != null || j != null))
            switch (b) {
              case "selected":
                e.selected = z && typeof z != "function" && typeof z != "symbol";
                break;
              default:
                Oe(
                  e,
                  t,
                  b,
                  z,
                  l,
                  j
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var ce in n)
          z = n[ce], n.hasOwnProperty(ce) && z != null && !l.hasOwnProperty(ce) && Oe(e, t, ce, null, l, z);
        for (w in l)
          if (z = l[w], j = n[w], l.hasOwnProperty(w) && z !== j && (z != null || j != null))
            switch (w) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (z != null)
                  throw Error(c(137, t));
                break;
              default:
                Oe(
                  e,
                  t,
                  w,
                  z,
                  l,
                  j
                );
            }
        return;
      default:
        if (yr(t)) {
          for (var qe in n)
            z = n[qe], n.hasOwnProperty(qe) && z !== void 0 && !l.hasOwnProperty(qe) && eo(
              e,
              t,
              qe,
              void 0,
              l,
              z
            );
          for (U in l)
            z = l[U], j = n[U], !l.hasOwnProperty(U) || z === j || z === void 0 && j === void 0 || eo(
              e,
              t,
              U,
              z,
              l,
              j
            );
          return;
        }
    }
    for (var C in n)
      z = n[C], n.hasOwnProperty(C) && z != null && !l.hasOwnProperty(C) && Oe(e, t, C, null, l, z);
    for (Y in l)
      z = l[Y], j = n[Y], !l.hasOwnProperty(Y) || z === j || z == null && j == null || Oe(e, t, Y, z, l, j);
  }
  var to = null, no = null;
  function Su(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Rh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Ch(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function lo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ao = null;
  function fp() {
    var e = window.event;
    return e && e.type === "popstate" ? e === ao ? !1 : (ao = e, !0) : (ao = null, !1);
  }
  var Mh = typeof setTimeout == "function" ? setTimeout : void 0, dp = typeof clearTimeout == "function" ? clearTimeout : void 0, Dh = typeof Promise == "function" ? Promise : void 0, hp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Dh < "u" ? function(e) {
    return Dh.resolve(null).then(e).catch(vp);
  } : Mh;
  function vp(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function io(e, t) {
    var n = t, l = 0;
    do {
      var i = n.nextSibling;
      if (e.removeChild(n), i && i.nodeType === 8)
        if (n = i.data, n === "/$") {
          if (l === 0) {
            e.removeChild(i), gi(t);
            return;
          }
          l--;
        } else n !== "$" && n !== "$?" && n !== "$!" || l++;
      n = i;
    } while (n);
    gi(t);
  }
  function uo(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          uo(n), hr(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function mp(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var i = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[Ta])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== i.rel || e.getAttribute("href") !== (i.href == null ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = i.name == null ? null : "" + i.name;
        if (i.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = Ut(e.nextSibling), e === null) break;
    }
    return null;
  }
  function yp(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Ut(e.nextSibling), e === null)) return null;
    return e;
  }
  function Ut(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "F!" || t === "F")
          break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function Nh(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function zh(e, t, n) {
    switch (t = Su(n), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(c(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(c(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(c(454));
        return e;
      default:
        throw Error(c(451));
    }
  }
  var Nt = /* @__PURE__ */ new Map(), _h = /* @__PURE__ */ new Set();
  function Eu(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.ownerDocument;
  }
  var fn = W.d;
  W.d = {
    f: gp,
    r: pp,
    D: bp,
    C: xp,
    L: Sp,
    m: Ep,
    X: wp,
    S: Ap,
    M: Tp
  };
  function gp() {
    var e = fn.f(), t = vu();
    return e || t;
  }
  function pp(e) {
    var t = Cl(e);
    t !== null && t.tag === 5 && t.type === "form" ? ud(t) : fn.r(e);
  }
  var ia = typeof document > "u" ? null : document;
  function jh(e, t, n) {
    var l = ia;
    if (l && typeof t == "string" && t) {
      var i = St(t);
      i = 'link[rel="' + e + '"][href="' + i + '"]', typeof n == "string" && (i += '[crossorigin="' + n + '"]'), _h.has(i) || (_h.add(i), e = { rel: e, crossOrigin: n, href: t }, l.querySelector(i) === null && (t = l.createElement("link"), Ie(t, "link", e), Ze(t), l.head.appendChild(t)));
    }
  }
  function bp(e) {
    fn.D(e), jh("dns-prefetch", e, null);
  }
  function xp(e, t) {
    fn.C(e, t), jh("preconnect", e, t);
  }
  function Sp(e, t, n) {
    fn.L(e, t, n);
    var l = ia;
    if (l && e && t) {
      var i = 'link[rel="preload"][as="' + St(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + St(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (i += '[imagesizes="' + St(
        n.imageSizes
      ) + '"]')) : i += '[href="' + St(e) + '"]';
      var u = i;
      switch (t) {
        case "style":
          u = ua(e);
          break;
        case "script":
          u = ra(e);
      }
      Nt.has(u) || (e = $(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), Nt.set(u, e), l.querySelector(i) !== null || t === "style" && l.querySelector(si(u)) || t === "script" && l.querySelector(fi(u)) || (t = l.createElement("link"), Ie(t, "link", e), Ze(t), l.head.appendChild(t)));
    }
  }
  function Ep(e, t) {
    fn.m(e, t);
    var n = ia;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", i = 'link[rel="modulepreload"][as="' + St(l) + '"][href="' + St(e) + '"]', u = i;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = ra(e);
      }
      if (!Nt.has(u) && (e = $({ rel: "modulepreload", href: e }, t), Nt.set(u, e), n.querySelector(i) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(fi(u)))
              return;
        }
        l = n.createElement("link"), Ie(l, "link", e), Ze(l), n.head.appendChild(l);
      }
    }
  }
  function Ap(e, t, n) {
    fn.S(e, t, n);
    var l = ia;
    if (l && e) {
      var i = Ml(l).hoistableStyles, u = ua(e);
      t = t || "default";
      var s = i.get(u);
      if (!s) {
        var v = { loading: 0, preload: null };
        if (s = l.querySelector(
          si(u)
        ))
          v.loading = 5;
        else {
          e = $(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = Nt.get(u)) && ro(e, n);
          var b = s = l.createElement("link");
          Ze(b), Ie(b, "link", e), b._p = new Promise(function(w, U) {
            b.onload = w, b.onerror = U;
          }), b.addEventListener("load", function() {
            v.loading |= 1;
          }), b.addEventListener("error", function() {
            v.loading |= 2;
          }), v.loading |= 4, Au(s, t, l);
        }
        s = {
          type: "stylesheet",
          instance: s,
          count: 1,
          state: v
        }, i.set(u, s);
      }
    }
  }
  function wp(e, t) {
    fn.X(e, t);
    var n = ia;
    if (n && e) {
      var l = Ml(n).hoistableScripts, i = ra(e), u = l.get(i);
      u || (u = n.querySelector(fi(i)), u || (e = $({ src: e, async: !0 }, t), (t = Nt.get(i)) && co(e, t), u = n.createElement("script"), Ze(u), Ie(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(i, u));
    }
  }
  function Tp(e, t) {
    fn.M(e, t);
    var n = ia;
    if (n && e) {
      var l = Ml(n).hoistableScripts, i = ra(e), u = l.get(i);
      u || (u = n.querySelector(fi(i)), u || (e = $({ src: e, async: !0, type: "module" }, t), (t = Nt.get(i)) && co(e, t), u = n.createElement("script"), Ze(u), Ie(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(i, u));
    }
  }
  function Uh(e, t, n, l) {
    var i = (i = it.current) ? Eu(i) : null;
    if (!i) throw Error(c(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = ua(n.href), n = Ml(
          i
        ).hoistableStyles, l = n.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = ua(n.href);
          var u = Ml(
            i
          ).hoistableStyles, s = u.get(e);
          if (s || (i = i.ownerDocument || i, s = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, s), (u = i.querySelector(
            si(e)
          )) && !u._p && (s.instance = u, s.state.loading = 5), Nt.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, Nt.set(e, n), u || Op(
            i,
            e,
            n,
            s.state
          ))), t && l === null)
            throw Error(c(528, ""));
          return s;
        }
        if (t && l !== null)
          throw Error(c(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ra(n), n = Ml(
          i
        ).hoistableScripts, l = n.get(t), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(c(444, e));
    }
  }
  function ua(e) {
    return 'href="' + St(e) + '"';
  }
  function si(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Hh(e) {
    return $({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Op(e, t, n, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), Ie(t, "link", n), Ze(t), e.head.appendChild(t));
  }
  function ra(e) {
    return '[src="' + St(e) + '"]';
  }
  function fi(e) {
    return "script[async]" + e;
  }
  function Lh(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + St(n.href) + '"]'
          );
          if (l)
            return t.instance = l, Ze(l), l;
          var i = $({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), Ze(l), Ie(l, "style", i), Au(l, n.precedence, e), t.instance = l;
        case "stylesheet":
          i = ua(n.href);
          var u = e.querySelector(
            si(i)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, Ze(u), u;
          l = Hh(n), (i = Nt.get(i)) && ro(l, i), u = (e.ownerDocument || e).createElement("link"), Ze(u);
          var s = u;
          return s._p = new Promise(function(v, b) {
            s.onload = v, s.onerror = b;
          }), Ie(u, "link", l), t.state.loading |= 4, Au(u, n.precedence, e), t.instance = u;
        case "script":
          return u = ra(n.src), (i = e.querySelector(
            fi(u)
          )) ? (t.instance = i, Ze(i), i) : (l = n, (i = Nt.get(u)) && (l = $({}, n), co(l, i)), e = e.ownerDocument || e, i = e.createElement("script"), Ze(i), Ie(i, "link", l), e.head.appendChild(i), t.instance = i);
        case "void":
          return null;
        default:
          throw Error(c(443, t.type));
      }
    else
      t.type === "stylesheet" && !(t.state.loading & 4) && (l = t.instance, t.state.loading |= 4, Au(l, n.precedence, e));
    return t.instance;
  }
  function Au(e, t, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), i = l.length ? l[l.length - 1] : null, u = i, s = 0; s < l.length; s++) {
      var v = l[s];
      if (v.dataset.precedence === t) u = v;
      else if (u !== i) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function ro(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function co(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var wu = null;
  function Bh(e, t, n) {
    if (wu === null) {
      var l = /* @__PURE__ */ new Map(), i = wu = /* @__PURE__ */ new Map();
      i.set(n, l);
    } else
      i = wu, l = i.get(n), l || (l = /* @__PURE__ */ new Map(), i.set(n, l));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
      var u = n[i];
      if (!(u[Ta] || u[et] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var s = u.getAttribute(t) || "";
        s = e + s;
        var v = l.get(s);
        v ? v.push(u) : l.set(s, [u]);
      }
    }
    return l;
  }
  function qh(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Rp(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Yh(e) {
    return !(e.type === "stylesheet" && !(e.state.loading & 3));
  }
  var di = null;
  function Cp() {
  }
  function Mp(e, t, n) {
    if (di === null) throw Error(c(475));
    var l = di;
    if (t.type === "stylesheet" && (typeof n.media != "string" || matchMedia(n.media).matches !== !1) && !(t.state.loading & 4)) {
      if (t.instance === null) {
        var i = ua(n.href), u = e.querySelector(
          si(i)
        );
        if (u) {
          e = u._p, e !== null && typeof e == "object" && typeof e.then == "function" && (l.count++, l = Tu.bind(l), e.then(l, l)), t.state.loading |= 4, t.instance = u, Ze(u);
          return;
        }
        u = e.ownerDocument || e, n = Hh(n), (i = Nt.get(i)) && ro(n, i), u = u.createElement("link"), Ze(u);
        var s = u;
        s._p = new Promise(function(v, b) {
          s.onload = v, s.onerror = b;
        }), Ie(u, "link", n), t.instance = u;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(t, e), (e = t.state.preload) && !(t.state.loading & 3) && (l.count++, t = Tu.bind(l), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function Dp() {
    if (di === null) throw Error(c(475));
    var e = di;
    return e.stylesheets && e.count === 0 && oo(e, e.stylesheets), 0 < e.count ? function(t) {
      var n = setTimeout(function() {
        if (e.stylesheets && oo(e, e.stylesheets), e.unsuspend) {
          var l = e.unsuspend;
          e.unsuspend = null, l();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(n);
      };
    } : null;
  }
  function Tu() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) oo(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ou = null;
  function oo(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ou = /* @__PURE__ */ new Map(), t.forEach(Np, e), Ou = null, Tu.call(e));
  }
  function Np(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Ou.get(e);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Ou.set(e, n);
        for (var i = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < i.length; u++) {
          var s = i[u];
          (s.nodeName === "LINK" || s.getAttribute("media") !== "not all") && (n.set(s.dataset.precedence, s), l = s);
        }
        l && n.set(null, l);
      }
      i = t.instance, s = i.getAttribute("data-precedence"), u = n.get(s) || l, u === l && n.set(null, i), n.set(s, i), this.count++, l = Tu.bind(this), i.addEventListener("load", l), i.addEventListener("error", l), u ? u.parentNode.insertBefore(i, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
    }
  }
  var hi = {
    $$typeof: M,
    Provider: null,
    Consumer: null,
    _currentValue: se,
    _currentValue2: se,
    _threadCount: 0
  };
  function zp(e, t, n, l, i, u, s, v) {
    this.tag = 1, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = fr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.finishedLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = fr(0), this.hiddenUpdates = fr(null), this.identifierPrefix = l, this.onUncaughtError = i, this.onCaughtError = u, this.onRecoverableError = s, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = v, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Gh(e, t, n, l, i, u, s, v, b, w, U, Y) {
    return e = new zp(
      e,
      t,
      n,
      s,
      v,
      b,
      w,
      Y
    ), t = 1, u === !0 && (t |= 24), u = Mt(3, null, null, t), e.current = u, u.stateNode = e, t = Gr(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: t
    }, Sc(u), e;
  }
  function kh(e) {
    return e ? (e = ql, e) : ql;
  }
  function Xh(e, t, n, l, i, u) {
    i = kh(i), l.context === null ? l.context = i : l.pendingContext = i, l = Mn(t), l.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (l.callback = u), n = Dn(e, l, t), n !== null && (at(n, e, t), $a(n, e, t));
  }
  function Vh(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function so(e, t) {
    Vh(e, t), (e = e.alternate) && Vh(e, t);
  }
  function Qh(e) {
    if (e.tag === 13) {
      var t = En(e, 67108864);
      t !== null && at(t, e, 67108864), so(e, 67108864);
    }
  }
  var Ru = !0;
  function _p(e, t, n, l) {
    var i = J.T;
    J.T = null;
    var u = W.p;
    try {
      W.p = 2, fo(e, t, n, l);
    } finally {
      W.p = u, J.T = i;
    }
  }
  function jp(e, t, n, l) {
    var i = J.T;
    J.T = null;
    var u = W.p;
    try {
      W.p = 8, fo(e, t, n, l);
    } finally {
      W.p = u, J.T = i;
    }
  }
  function fo(e, t, n, l) {
    if (Ru) {
      var i = ho(l);
      if (i === null)
        Ic(
          e,
          t,
          l,
          Cu,
          n
        ), Kh(e, l);
      else if (Hp(
        i,
        e,
        t,
        n,
        l
      ))
        l.stopPropagation();
      else if (Kh(e, l), t & 4 && -1 < Up.indexOf(e)) {
        for (; i !== null; ) {
          var u = Cl(i);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var s = Wn(u.pendingLanes);
                  if (s !== 0) {
                    var v = u;
                    for (v.pendingLanes |= 2, v.entangledLanes |= 2; s; ) {
                      var b = 1 << 31 - vt(s);
                      v.entanglements[1] |= b, s &= ~b;
                    }
                    Xt(u), !(He & 6) && (fu = Bt() + 500, ri(0));
                  }
                }
                break;
              case 13:
                v = En(u, 2), v !== null && at(v, u, 2), vu(), so(u, 2);
            }
          if (u = ho(l), u === null && Ic(
            e,
            t,
            l,
            Cu,
            n
          ), u === i) break;
          i = u;
        }
        i !== null && l.stopPropagation();
      } else
        Ic(
          e,
          t,
          l,
          null,
          n
        );
    }
  }
  function ho(e) {
    return e = pr(e), vo(e);
  }
  var Cu = null;
  function vo(e) {
    if (Cu = null, e = $n(e), e !== null) {
      var t = X(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = ne(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Cu = e, null;
  }
  function Zh(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (xy()) {
          case ms:
            return 2;
          case ys:
            return 8;
          case Ai:
          case Sy:
            return 32;
          case gs:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var mo = !1, Ln = null, Bn = null, qn = null, vi = /* @__PURE__ */ new Map(), mi = /* @__PURE__ */ new Map(), Yn = [], Up = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Kh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ln = null;
        break;
      case "dragenter":
      case "dragleave":
        Bn = null;
        break;
      case "mouseover":
      case "mouseout":
        qn = null;
        break;
      case "pointerover":
      case "pointerout":
        vi.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        mi.delete(t.pointerId);
    }
  }
  function yi(e, t, n, l, i, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: u,
      targetContainers: [i]
    }, t !== null && (t = Cl(t), t !== null && Qh(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
  }
  function Hp(e, t, n, l, i) {
    switch (t) {
      case "focusin":
        return Ln = yi(
          Ln,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "dragenter":
        return Bn = yi(
          Bn,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "mouseover":
        return qn = yi(
          qn,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "pointerover":
        var u = i.pointerId;
        return vi.set(
          u,
          yi(
            vi.get(u) || null,
            e,
            t,
            n,
            l,
            i
          )
        ), !0;
      case "gotpointercapture":
        return u = i.pointerId, mi.set(
          u,
          yi(
            mi.get(u) || null,
            e,
            t,
            n,
            l,
            i
          )
        ), !0;
    }
    return !1;
  }
  function Jh(e) {
    var t = $n(e.target);
    if (t !== null) {
      var n = X(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = ne(n), t !== null) {
            e.blockedOn = t, Dy(e.priority, function() {
              if (n.tag === 13) {
                var l = bt(), i = En(n, l);
                i !== null && at(i, n, l), so(n, l);
              }
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Mu(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = ho(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        gr = l, n.target.dispatchEvent(l), gr = null;
      } else
        return t = Cl(n), t !== null && Qh(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Wh(e, t, n) {
    Mu(e) && n.delete(t);
  }
  function Lp() {
    mo = !1, Ln !== null && Mu(Ln) && (Ln = null), Bn !== null && Mu(Bn) && (Bn = null), qn !== null && Mu(qn) && (qn = null), vi.forEach(Wh), mi.forEach(Wh);
  }
  function Du(e, t) {
    e.blockedOn === t && (e.blockedOn = null, mo || (mo = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      Lp
    )));
  }
  var Nu = null;
  function $h(e) {
    Nu !== e && (Nu = e, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        Nu === e && (Nu = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], l = e[t + 1], i = e[t + 2];
          if (typeof l != "function") {
            if (vo(l || n) === null)
              continue;
            break;
          }
          var u = Cl(n);
          u !== null && (e.splice(t, 3), t -= 3, lc(
            u,
            {
              pending: !0,
              data: i,
              method: n.method,
              action: l
            },
            l,
            i
          ));
        }
      }
    ));
  }
  function gi(e) {
    function t(b) {
      return Du(b, e);
    }
    Ln !== null && Du(Ln, e), Bn !== null && Du(Bn, e), qn !== null && Du(qn, e), vi.forEach(t), mi.forEach(t);
    for (var n = 0; n < Yn.length; n++) {
      var l = Yn[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < Yn.length && (n = Yn[0], n.blockedOn === null); )
      Jh(n), n.blockedOn === null && Yn.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var i = n[l], u = n[l + 1], s = i[ut] || null;
        if (typeof u == "function")
          s || $h(n);
        else if (s) {
          var v = null;
          if (u && u.hasAttribute("formAction")) {
            if (i = u, s = u[ut] || null)
              v = s.formAction;
            else if (vo(i) !== null) continue;
          } else v = s.action;
          typeof v == "function" ? n[l + 1] = v : (n.splice(l, 3), l -= 3), $h(n);
        }
      }
  }
  function yo(e) {
    this._internalRoot = e;
  }
  zu.prototype.render = yo.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(c(409));
    var n = t.current, l = bt();
    Xh(n, l, e, t, null, null);
  }, zu.prototype.unmount = yo.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      e.tag === 0 && na(), Xh(e.current, 2, null, e, null, null), vu(), t[Rl] = null;
    }
  };
  function zu(e) {
    this._internalRoot = e;
  }
  zu.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = As();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Yn.length && t !== 0 && t < Yn[n].priority; n++) ;
      Yn.splice(n, 0, e), n === 0 && Jh(e);
    }
  };
  var Fh = r.version;
  if (Fh !== "19.0.0")
    throw Error(
      c(
        527,
        Fh,
        "19.0.0"
      )
    );
  W.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(c(188)) : (e = Object.keys(e).join(","), Error(c(268, e)));
    return e = k(t), e = e !== null ? ie(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Bp = {
    bundleType: 0,
    version: "19.0.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: J,
    findFiberByHostInstance: $n,
    reconcilerVersion: "19.0.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var _u = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!_u.isDisabled && _u.supportsFiber)
      try {
        Ea = _u.inject(
          Bp
        ), ht = _u;
      } catch {
      }
  }
  return bi.createRoot = function(e, t) {
    if (!f(e)) throw Error(c(299));
    var n = !1, l = "", i = vd, u = md, s = yd, v = null;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (v = t.unstable_transitionCallbacks)), t = Gh(
      e,
      1,
      !1,
      null,
      null,
      n,
      l,
      i,
      u,
      s,
      v,
      null
    ), e[Rl] = t.current, Pc(
      e.nodeType === 8 ? e.parentNode : e
    ), new yo(t);
  }, bi.hydrateRoot = function(e, t, n) {
    if (!f(e)) throw Error(c(299));
    var l = !1, i = "", u = vd, s = md, v = yd, b = null, w = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (s = n.onCaughtError), n.onRecoverableError !== void 0 && (v = n.onRecoverableError), n.unstable_transitionCallbacks !== void 0 && (b = n.unstable_transitionCallbacks), n.formState !== void 0 && (w = n.formState)), t = Gh(
      e,
      1,
      !0,
      t,
      n ?? null,
      l,
      i,
      u,
      s,
      v,
      b,
      w
    ), t.context = kh(null), n = t.current, l = bt(), i = Mn(l), i.callback = null, Dn(n, i, l), t.current.lanes = l, wa(t, l), Xt(t), e[Rl] = t.current, Pc(e), new zu(t);
  }, bi.version = "19.0.0", bi;
}
var rv;
function Jp() {
  if (rv) return po.exports;
  rv = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), po.exports = Kp(), po.exports;
}
var Zu = Jp(), xl = Gv();
const Wp = /* @__PURE__ */ Yv(xl);
var E = Ko();
const $p = /* @__PURE__ */ Yv(E), Fp = /* @__PURE__ */ Yp({
  __proto__: null,
  default: $p
}, [E]);
function ot(a, r, { checkForDefaultPrevented: o = !0 } = {}) {
  return function(f) {
    if (a == null || a(f), o === !1 || !f.defaultPrevented)
      return r == null ? void 0 : r(f);
  };
}
function cv(a, r) {
  if (typeof a == "function")
    return a(r);
  a != null && (a.current = r);
}
function kv(...a) {
  return (r) => {
    let o = !1;
    const c = a.map((f) => {
      const d = cv(f, r);
      return !o && typeof d == "function" && (o = !0), d;
    });
    if (o)
      return () => {
        for (let f = 0; f < c.length; f++) {
          const d = c[f];
          typeof d == "function" ? d() : cv(a[f], null);
        }
      };
  };
}
function Ht(...a) {
  return E.useCallback(kv(...a), a);
}
function Pp(a, r) {
  const o = E.createContext(r), c = (d) => {
    const { children: h, ...g } = d, y = E.useMemo(() => g, Object.values(g));
    return /* @__PURE__ */ p.jsx(o.Provider, { value: y, children: h });
  };
  c.displayName = a + "Provider";
  function f(d) {
    const h = E.useContext(o);
    if (h) return h;
    if (r !== void 0) return r;
    throw new Error(`\`${d}\` must be used within \`${a}\``);
  }
  return [c, f];
}
function Jo(a, r = []) {
  let o = [];
  function c(d, h) {
    const g = E.createContext(h), y = o.length;
    o = [...o, h];
    const m = (T) => {
      var H;
      const { scope: D, children: M, ...R } = T, O = ((H = D == null ? void 0 : D[a]) == null ? void 0 : H[y]) || g, _ = E.useMemo(() => R, Object.values(R));
      return /* @__PURE__ */ p.jsx(O.Provider, { value: _, children: M });
    };
    m.displayName = d + "Provider";
    function x(T, D) {
      var O;
      const M = ((O = D == null ? void 0 : D[a]) == null ? void 0 : O[y]) || g, R = E.useContext(M);
      if (R) return R;
      if (h !== void 0) return h;
      throw new Error(`\`${T}\` must be used within \`${d}\``);
    }
    return [m, x];
  }
  const f = () => {
    const d = o.map((h) => E.createContext(h));
    return function(g) {
      const y = (g == null ? void 0 : g[a]) || d;
      return E.useMemo(
        () => ({ [`__scope${a}`]: { ...g, [a]: y } }),
        [g, y]
      );
    };
  };
  return f.scopeName = a, [c, Ip(f, ...r)];
}
function Ip(...a) {
  const r = a[0];
  if (a.length === 1) return r;
  const o = () => {
    const c = a.map((f) => ({
      useScope: f(),
      scopeName: f.scopeName
    }));
    return function(d) {
      const h = c.reduce((g, { useScope: y, scopeName: m }) => {
        const T = y(d)[`__scope${m}`];
        return { ...g, ...T };
      }, {});
      return E.useMemo(() => ({ [`__scope${r.scopeName}`]: h }), [h]);
    };
  };
  return o.scopeName = r.scopeName, o;
}
var Iu = E.forwardRef((a, r) => {
  const { children: o, ...c } = a, f = E.Children.toArray(o), d = f.find(e0);
  if (d) {
    const h = d.props.children, g = f.map((y) => y === d ? E.Children.count(h) > 1 ? E.Children.only(null) : E.isValidElement(h) ? h.props.children : null : y);
    return /* @__PURE__ */ p.jsx(Ho, { ...c, ref: r, children: E.isValidElement(h) ? E.cloneElement(h, void 0, g) : null });
  }
  return /* @__PURE__ */ p.jsx(Ho, { ...c, ref: r, children: o });
});
Iu.displayName = "Slot";
var Ho = E.forwardRef((a, r) => {
  const { children: o, ...c } = a;
  if (E.isValidElement(o)) {
    const f = n0(o), d = t0(c, o.props);
    return o.type !== E.Fragment && (d.ref = r ? kv(r, f) : f), E.cloneElement(o, d);
  }
  return E.Children.count(o) > 1 ? E.Children.only(null) : null;
});
Ho.displayName = "SlotClone";
var Xv = ({ children: a }) => /* @__PURE__ */ p.jsx(p.Fragment, { children: a });
function e0(a) {
  return E.isValidElement(a) && a.type === Xv;
}
function t0(a, r) {
  const o = { ...r };
  for (const c in r) {
    const f = a[c], d = r[c];
    /^on[A-Z]/.test(c) ? f && d ? o[c] = (...g) => {
      d(...g), f(...g);
    } : f && (o[c] = f) : c === "style" ? o[c] = { ...f, ...d } : c === "className" && (o[c] = [f, d].filter(Boolean).join(" "));
  }
  return { ...a, ...o };
}
function n0(a) {
  var c, f;
  let r = (c = Object.getOwnPropertyDescriptor(a.props, "ref")) == null ? void 0 : c.get, o = r && "isReactWarning" in r && r.isReactWarning;
  return o ? a.ref : (r = (f = Object.getOwnPropertyDescriptor(a, "ref")) == null ? void 0 : f.get, o = r && "isReactWarning" in r && r.isReactWarning, o ? a.props.ref : a.props.ref || a.ref);
}
var l0 = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
], ft = l0.reduce((a, r) => {
  const o = E.forwardRef((c, f) => {
    const { asChild: d, ...h } = c, g = d ? Iu : r;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ p.jsx(g, { ...h, ref: f });
  });
  return o.displayName = `Primitive.${r}`, { ...a, [r]: o };
}, {});
function a0(a, r) {
  a && xl.flushSync(() => a.dispatchEvent(r));
}
function Vn(a) {
  const r = E.useRef(a);
  return E.useEffect(() => {
    r.current = a;
  }), E.useMemo(() => (...o) => {
    var c;
    return (c = r.current) == null ? void 0 : c.call(r, ...o);
  }, []);
}
function i0(a, r = globalThis == null ? void 0 : globalThis.document) {
  const o = Vn(a);
  E.useEffect(() => {
    const c = (f) => {
      f.key === "Escape" && o(f);
    };
    return r.addEventListener("keydown", c, { capture: !0 }), () => r.removeEventListener("keydown", c, { capture: !0 });
  }, [o, r]);
}
var u0 = "DismissableLayer", Lo = "dismissableLayer.update", r0 = "dismissableLayer.pointerDownOutside", c0 = "dismissableLayer.focusOutside", ov, Vv = E.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Wo = E.forwardRef(
  (a, r) => {
    const {
      disableOutsidePointerEvents: o = !1,
      onEscapeKeyDown: c,
      onPointerDownOutside: f,
      onFocusOutside: d,
      onInteractOutside: h,
      onDismiss: g,
      ...y
    } = a, m = E.useContext(Vv), [x, T] = E.useState(null), D = (x == null ? void 0 : x.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, M] = E.useState({}), R = Ht(r, (K) => T(K)), O = Array.from(m.layers), [_] = [...m.layersWithOutsidePointerEventsDisabled].slice(-1), H = O.indexOf(_), G = x ? O.indexOf(x) : -1, Z = m.layersWithOutsidePointerEventsDisabled.size > 0, Q = G >= H, V = f0((K) => {
      const oe = K.target, J = [...m.branches].some(($) => $.contains(oe));
      !Q || J || (f == null || f(K), h == null || h(K), K.defaultPrevented || g == null || g());
    }, D), L = d0((K) => {
      const oe = K.target;
      [...m.branches].some(($) => $.contains(oe)) || (d == null || d(K), h == null || h(K), K.defaultPrevented || g == null || g());
    }, D);
    return i0((K) => {
      G === m.layers.size - 1 && (c == null || c(K), !K.defaultPrevented && g && (K.preventDefault(), g()));
    }, D), E.useEffect(() => {
      if (x)
        return o && (m.layersWithOutsidePointerEventsDisabled.size === 0 && (ov = D.body.style.pointerEvents, D.body.style.pointerEvents = "none"), m.layersWithOutsidePointerEventsDisabled.add(x)), m.layers.add(x), sv(), () => {
          o && m.layersWithOutsidePointerEventsDisabled.size === 1 && (D.body.style.pointerEvents = ov);
        };
    }, [x, D, o, m]), E.useEffect(() => () => {
      x && (m.layers.delete(x), m.layersWithOutsidePointerEventsDisabled.delete(x), sv());
    }, [x, m]), E.useEffect(() => {
      const K = () => M({});
      return document.addEventListener(Lo, K), () => document.removeEventListener(Lo, K);
    }, []), /* @__PURE__ */ p.jsx(
      ft.div,
      {
        ...y,
        ref: R,
        style: {
          pointerEvents: Z ? Q ? "auto" : "none" : void 0,
          ...a.style
        },
        onFocusCapture: ot(a.onFocusCapture, L.onFocusCapture),
        onBlurCapture: ot(a.onBlurCapture, L.onBlurCapture),
        onPointerDownCapture: ot(
          a.onPointerDownCapture,
          V.onPointerDownCapture
        )
      }
    );
  }
);
Wo.displayName = u0;
var o0 = "DismissableLayerBranch", s0 = E.forwardRef((a, r) => {
  const o = E.useContext(Vv), c = E.useRef(null), f = Ht(r, c);
  return E.useEffect(() => {
    const d = c.current;
    if (d)
      return o.branches.add(d), () => {
        o.branches.delete(d);
      };
  }, [o.branches]), /* @__PURE__ */ p.jsx(ft.div, { ...a, ref: f });
});
s0.displayName = o0;
function f0(a, r = globalThis == null ? void 0 : globalThis.document) {
  const o = Vn(a), c = E.useRef(!1), f = E.useRef(() => {
  });
  return E.useEffect(() => {
    const d = (g) => {
      if (g.target && !c.current) {
        let y = function() {
          Qv(
            r0,
            o,
            m,
            { discrete: !0 }
          );
        };
        const m = { originalEvent: g };
        g.pointerType === "touch" ? (r.removeEventListener("click", f.current), f.current = y, r.addEventListener("click", f.current, { once: !0 })) : y();
      } else
        r.removeEventListener("click", f.current);
      c.current = !1;
    }, h = window.setTimeout(() => {
      r.addEventListener("pointerdown", d);
    }, 0);
    return () => {
      window.clearTimeout(h), r.removeEventListener("pointerdown", d), r.removeEventListener("click", f.current);
    };
  }, [r, o]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => c.current = !0
  };
}
function d0(a, r = globalThis == null ? void 0 : globalThis.document) {
  const o = Vn(a), c = E.useRef(!1);
  return E.useEffect(() => {
    const f = (d) => {
      d.target && !c.current && Qv(c0, o, { originalEvent: d }, {
        discrete: !1
      });
    };
    return r.addEventListener("focusin", f), () => r.removeEventListener("focusin", f);
  }, [r, o]), {
    onFocusCapture: () => c.current = !0,
    onBlurCapture: () => c.current = !1
  };
}
function sv() {
  const a = new CustomEvent(Lo);
  document.dispatchEvent(a);
}
function Qv(a, r, o, { discrete: c }) {
  const f = o.originalEvent.target, d = new CustomEvent(a, { bubbles: !1, cancelable: !0, detail: o });
  r && f.addEventListener(a, r, { once: !0 }), c ? a0(f, d) : f.dispatchEvent(d);
}
var Sl = globalThis != null && globalThis.document ? E.useLayoutEffect : () => {
}, h0 = Fp.useId || (() => {
}), v0 = 0;
function ku(a) {
  const [r, o] = E.useState(h0());
  return Sl(() => {
    o((c) => c ?? String(v0++));
  }, [a]), r ? `radix-${r}` : "";
}
const m0 = ["top", "right", "bottom", "left"], Qn = Math.min, dn = Math.max, Ku = Math.round, ju = Math.floor, hn = (a) => ({
  x: a,
  y: a
}), y0 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Zv(a, r, o) {
  return dn(a, Qn(r, o));
}
function vn(a, r) {
  return typeof a == "function" ? a(r) : a;
}
function Zn(a) {
  return a.split("-")[0];
}
function ya(a) {
  return a.split("-")[1];
}
function $o(a) {
  return a === "x" ? "y" : "x";
}
function Fo(a) {
  return a === "y" ? "height" : "width";
}
function Qt(a) {
  const r = a[0];
  return r === "t" || r === "b" ? "y" : "x";
}
function Po(a) {
  return $o(Qt(a));
}
function g0(a, r, o) {
  o === void 0 && (o = !1);
  const c = ya(a), f = Po(a), d = Fo(f);
  let h = f === "x" ? c === (o ? "end" : "start") ? "right" : "left" : c === "start" ? "bottom" : "top";
  return r.reference[d] > r.floating[d] && (h = Ju(h)), [h, Ju(h)];
}
function p0(a) {
  const r = Ju(a);
  return [Bo(a), r, Bo(r)];
}
function Bo(a) {
  return a.includes("start") ? a.replace("start", "end") : a.replace("end", "start");
}
const fv = ["left", "right"], dv = ["right", "left"], b0 = ["top", "bottom"], x0 = ["bottom", "top"];
function S0(a, r, o) {
  switch (a) {
    case "top":
    case "bottom":
      return o ? r ? dv : fv : r ? fv : dv;
    case "left":
    case "right":
      return r ? b0 : x0;
    default:
      return [];
  }
}
function E0(a, r, o, c) {
  const f = ya(a);
  let d = S0(Zn(a), o === "start", c);
  return f && (d = d.map((h) => h + "-" + f), r && (d = d.concat(d.map(Bo)))), d;
}
function Ju(a) {
  const r = Zn(a);
  return y0[r] + a.slice(r.length);
}
function A0(a) {
  var r, o, c, f;
  return {
    top: (r = a.top) != null ? r : 0,
    right: (o = a.right) != null ? o : 0,
    bottom: (c = a.bottom) != null ? c : 0,
    left: (f = a.left) != null ? f : 0
  };
}
function Kv(a) {
  return typeof a != "number" ? A0(a) : {
    top: a,
    right: a,
    bottom: a,
    left: a
  };
}
function Wu(a) {
  const {
    x: r,
    y: o,
    width: c,
    height: f
  } = a;
  return {
    width: c,
    height: f,
    top: o,
    left: r,
    right: r + c,
    bottom: o + f,
    x: r,
    y: o
  };
}
function hv(a, r, o) {
  let {
    reference: c,
    floating: f
  } = a;
  const d = Qt(r), h = Po(r), g = Fo(h), y = Zn(r), m = d === "y", x = c.x + c.width / 2 - f.width / 2, T = c.y + c.height / 2 - f.height / 2, D = c[g] / 2 - f[g] / 2;
  let M;
  switch (y) {
    case "top":
      M = {
        x,
        y: c.y - f.height
      };
      break;
    case "bottom":
      M = {
        x,
        y: c.y + c.height
      };
      break;
    case "right":
      M = {
        x: c.x + c.width,
        y: T
      };
      break;
    case "left":
      M = {
        x: c.x - f.width,
        y: T
      };
      break;
    default:
      M = {
        x: c.x,
        y: c.y
      };
  }
  const R = ya(r);
  return R && (M[h] += D * (R === "end" ? 1 : -1) * (o && m ? -1 : 1)), M;
}
async function w0(a, r) {
  var o;
  r === void 0 && (r = {});
  const {
    x: c,
    y: f,
    platform: d,
    rects: h,
    elements: g,
    strategy: y
  } = a, {
    boundary: m = "clippingAncestors",
    rootBoundary: x = "viewport",
    elementContext: T = "floating",
    altBoundary: D = !1,
    padding: M = 0
  } = vn(r, a), R = Kv(M), _ = g[D ? T === "floating" ? "reference" : "floating" : T], H = Wu(await d.getClippingRect({
    element: (o = await (d.isElement == null ? void 0 : d.isElement(_))) == null || o ? _ : _.contextElement || await (d.getDocumentElement == null ? void 0 : d.getDocumentElement(g.floating)),
    boundary: m,
    rootBoundary: x,
    strategy: y
  })), G = T === "floating" ? {
    x: c,
    y: f,
    width: h.floating.width,
    height: h.floating.height
  } : h.reference, Z = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(g.floating)), Q = await (d.isElement == null ? void 0 : d.isElement(Z)) && await (d.getScale == null ? void 0 : d.getScale(Z)) || {
    x: 1,
    y: 1
  }, V = Wu(d.convertOffsetParentRelativeRectToViewportRelativeRect ? await d.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: g,
    rect: G,
    offsetParent: Z,
    strategy: y
  }) : G);
  return {
    top: (H.top - V.top + R.top) / Q.y,
    bottom: (V.bottom - H.bottom + R.bottom) / Q.y,
    left: (H.left - V.left + R.left) / Q.x,
    right: (V.right - H.right + R.right) / Q.x
  };
}
const T0 = 50, O0 = async (a, r, o) => {
  const {
    placement: c = "bottom",
    strategy: f = "absolute",
    middleware: d = [],
    platform: h
  } = o, g = h.detectOverflow ? h : {
    ...h,
    detectOverflow: w0
  }, y = await (h.isRTL == null ? void 0 : h.isRTL(r));
  let m = await h.getElementRects({
    reference: a,
    floating: r,
    strategy: f
  }), {
    x,
    y: T
  } = hv(m, c, y), D = c, M = 0;
  const R = {};
  for (let O = 0; O < d.length; O++) {
    const _ = d[O];
    if (!_)
      continue;
    const {
      name: H,
      fn: G
    } = _, {
      x: Z,
      y: Q,
      data: V,
      reset: L
    } = await G({
      x,
      y: T,
      initialPlacement: c,
      placement: D,
      strategy: f,
      middlewareData: R,
      rects: m,
      platform: g,
      elements: {
        reference: a,
        floating: r
      }
    });
    x = Z ?? x, T = Q ?? T, R[H] = {
      ...R[H],
      ...V
    }, L && M < T0 && (M++, typeof L == "object" && (L.placement && (D = L.placement), L.rects && (m = L.rects === !0 ? await h.getElementRects({
      reference: a,
      floating: r,
      strategy: f
    }) : L.rects), {
      x,
      y: T
    } = hv(m, D, y)), O = -1);
  }
  return {
    x,
    y: T,
    placement: D,
    strategy: f,
    middlewareData: R
  };
}, R0 = (a) => ({
  name: "arrow",
  options: a,
  async fn(r) {
    const {
      x: o,
      y: c,
      placement: f,
      rects: d,
      platform: h,
      elements: g,
      middlewareData: y
    } = r, {
      element: m,
      padding: x = 0
    } = vn(a, r) || {};
    if (m == null)
      return {};
    const T = Kv(x), D = {
      x: o,
      y: c
    }, M = Po(f), R = Fo(M), O = await h.getDimensions(m), _ = M === "y", H = _ ? "top" : "left", G = _ ? "bottom" : "right", Z = _ ? "clientHeight" : "clientWidth", Q = d.reference[R] + d.reference[M] - D[M] - d.floating[R], V = D[M] - d.reference[M], L = await (h.getOffsetParent == null ? void 0 : h.getOffsetParent(m));
    let K = L ? L[Z] : 0;
    (!K || !await (h.isElement == null ? void 0 : h.isElement(L))) && (K = g.floating[Z] || d.floating[R]);
    const oe = Q / 2 - V / 2, J = K / 2 - O[R] / 2 - 1, $ = Qn(T[H], J), Se = Qn(T[G], J), Re = K - O[R] - Se, de = K / 2 - O[R] / 2 + oe, me = Zv($, de, Re), ge = !y.arrow && ya(f) != null && de !== me && d.reference[R] / 2 - (de < $ ? $ : Se) - O[R] / 2 < 0, B = ge ? de < $ ? de - $ : de - Re : 0;
    return {
      [M]: D[M] + B,
      data: {
        [M]: me,
        centerOffset: de - me - B,
        ...ge && {
          alignmentOffset: B
        }
      },
      reset: ge
    };
  }
}), C0 = function(a) {
  return a === void 0 && (a = {}), {
    name: "flip",
    options: a,
    async fn(r) {
      var o, c;
      const {
        placement: f,
        middlewareData: d,
        rects: h,
        initialPlacement: g,
        platform: y,
        elements: m
      } = r, {
        mainAxis: x = !0,
        crossAxis: T = !0,
        fallbackPlacements: D,
        fallbackStrategy: M = "bestFit",
        fallbackAxisSideDirection: R = "none",
        flipAlignment: O = !0,
        ..._
      } = vn(a, r);
      if ((o = d.arrow) != null && o.alignmentOffset)
        return {};
      const H = Zn(f), G = Qt(g), Z = Zn(g) === g, Q = await (y.isRTL == null ? void 0 : y.isRTL(m.floating)), V = D || (Z || !O ? [Ju(g)] : p0(g)), L = R !== "none";
      !D && L && V.push(...E0(g, O, R, Q));
      const K = [g, ...V], oe = await y.detectOverflow(r, _), J = [];
      let $ = ((c = d.flip) == null ? void 0 : c.overflows) || [];
      if (x && J.push(oe[H]), T) {
        const me = g0(f, h, Q);
        J.push(oe[me[0]], oe[me[1]]);
      }
      if ($ = [...$, {
        placement: f,
        overflows: J
      }], !J.every((me) => me <= 0)) {
        var Se, Re;
        const me = (((Se = d.flip) == null ? void 0 : Se.index) || 0) + 1, ge = K[me];
        if (ge && (!(T === "alignment" ? G !== Qt(ge) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        $.every((X) => Qt(X.placement) === G ? X.overflows[0] > 0 : !0)))
          return {
            data: {
              index: me,
              overflows: $
            },
            reset: {
              placement: ge
            }
          };
        let B = (Re = $.filter((ee) => ee.overflows[0] <= 0).sort((ee, X) => ee.overflows[1] - X.overflows[1])[0]) == null ? void 0 : Re.placement;
        if (!B)
          switch (M) {
            case "bestFit": {
              var de;
              const ee = (de = $.filter((X) => {
                if (L) {
                  const ne = Qt(X.placement);
                  return ne === G || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ne === "y";
                }
                return !0;
              }).map((X) => [X.placement, X.overflows.filter((ne) => ne > 0).reduce((ne, S) => ne + S, 0)]).sort((X, ne) => X[1] - ne[1])[0]) == null ? void 0 : de[0];
              ee && (B = ee);
              break;
            }
            case "initialPlacement":
              B = g;
              break;
          }
        if (f !== B)
          return {
            reset: {
              placement: B
            }
          };
      }
      return {};
    }
  };
};
function vv(a, r) {
  return {
    top: a.top - r.height,
    right: a.right - r.width,
    bottom: a.bottom - r.height,
    left: a.left - r.width
  };
}
function mv(a) {
  return m0.some((r) => a[r] >= 0);
}
const M0 = function(a) {
  return a === void 0 && (a = {}), {
    name: "hide",
    options: a,
    async fn(r) {
      const {
        rects: o,
        platform: c
      } = r, {
        strategy: f = "referenceHidden",
        ...d
      } = vn(a, r);
      switch (f) {
        case "referenceHidden": {
          const h = await c.detectOverflow(r, {
            ...d,
            elementContext: "reference"
          }), g = vv(h, o.reference);
          return {
            data: {
              referenceHiddenOffsets: g,
              referenceHidden: mv(g)
            }
          };
        }
        case "escaped": {
          const h = await c.detectOverflow(r, {
            ...d,
            altBoundary: !0
          }), g = vv(h, o.floating);
          return {
            data: {
              escapedOffsets: g,
              escaped: mv(g)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Jv = /* @__PURE__ */ new Set(["left", "top"]);
async function D0(a, r) {
  const {
    placement: o,
    platform: c,
    elements: f
  } = a, d = await (c.isRTL == null ? void 0 : c.isRTL(f.floating)), h = Zn(o), g = ya(o), y = Qt(o) === "y", m = Jv.has(h) ? -1 : 1, x = d && y ? -1 : 1, T = vn(r, a);
  let {
    mainAxis: D,
    crossAxis: M,
    alignmentAxis: R
  } = typeof T == "number" ? {
    mainAxis: T,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: T.mainAxis || 0,
    crossAxis: T.crossAxis || 0,
    alignmentAxis: T.alignmentAxis
  };
  return g && typeof R == "number" && (M = g === "end" ? R * -1 : R), y ? {
    x: M * x,
    y: D * m
  } : {
    x: D * m,
    y: M * x
  };
}
const N0 = function(a) {
  return a === void 0 && (a = 0), {
    name: "offset",
    options: a,
    async fn(r) {
      var o, c;
      const {
        x: f,
        y: d,
        placement: h,
        middlewareData: g
      } = r, y = await D0(r, a);
      return h === ((o = g.offset) == null ? void 0 : o.placement) && (c = g.arrow) != null && c.alignmentOffset ? {} : {
        x: f + y.x,
        y: d + y.y,
        data: {
          ...y,
          placement: h
        }
      };
    }
  };
}, z0 = function(a) {
  return a === void 0 && (a = {}), {
    name: "shift",
    options: a,
    async fn(r) {
      const {
        x: o,
        y: c,
        placement: f,
        platform: d
      } = r, {
        mainAxis: h = !0,
        crossAxis: g = !1,
        limiter: y = {
          fn: (G) => {
            let {
              x: Z,
              y: Q
            } = G;
            return {
              x: Z,
              y: Q
            };
          }
        },
        ...m
      } = vn(a, r), x = {
        x: o,
        y: c
      }, T = await d.detectOverflow(r, m), D = Qt(f), M = $o(D);
      let R = x[M], O = x[D];
      const _ = (G, Z) => Zv(Z + T[G === "y" ? "top" : "left"], Z, Z - T[G === "y" ? "bottom" : "right"]);
      h && (R = _(M, R)), g && (O = _(D, O));
      const H = y.fn({
        ...r,
        [M]: R,
        [D]: O
      });
      return {
        ...H,
        data: {
          x: H.x - o,
          y: H.y - c,
          enabled: {
            [M]: h,
            [D]: g
          }
        }
      };
    }
  };
}, _0 = function(a) {
  return a === void 0 && (a = {}), {
    options: a,
    fn(r) {
      var o, c;
      const {
        x: f,
        y: d,
        placement: h,
        rects: g,
        middlewareData: y
      } = r, {
        offset: m = 0,
        mainAxis: x = !0,
        crossAxis: T = !0
      } = vn(a, r), D = {
        x: f,
        y: d
      }, M = Qt(h), R = $o(M);
      let O = D[R], _ = D[M];
      const H = vn(m, r), G = typeof H == "number" ? {
        mainAxis: H,
        crossAxis: 0
      } : {
        mainAxis: (o = H.mainAxis) != null ? o : 0,
        crossAxis: (c = H.crossAxis) != null ? c : 0
      };
      if (x) {
        const V = R === "y" ? "height" : "width", L = g.reference[R] - g.floating[V] + G.mainAxis, K = g.reference[R] + g.reference[V] - G.mainAxis;
        O < L ? O = L : O > K && (O = K);
      }
      if (T) {
        var Z, Q;
        const V = R === "y" ? "width" : "height", L = Jv.has(Zn(h)), K = g.reference[M] - g.floating[V] + (L && ((Z = y.offset) == null ? void 0 : Z[M]) || 0) + (L ? 0 : G.crossAxis), oe = g.reference[M] + g.reference[V] + (L ? 0 : ((Q = y.offset) == null ? void 0 : Q[M]) || 0) - (L ? G.crossAxis : 0);
        _ < K ? _ = K : _ > oe && (_ = oe);
      }
      return {
        [R]: O,
        [M]: _
      };
    }
  };
}, j0 = function(a) {
  return a === void 0 && (a = {}), {
    name: "size",
    options: a,
    async fn(r) {
      const {
        placement: o,
        rects: c,
        platform: f,
        elements: d
      } = r, {
        apply: h = () => {
        },
        ...g
      } = vn(a, r), y = await f.detectOverflow(r, g), m = Zn(o), x = ya(o), T = Qt(o) === "y", {
        width: D,
        height: M
      } = c.floating;
      let R, O;
      m === "top" || m === "bottom" ? (R = m, O = x === (await (f.isRTL == null ? void 0 : f.isRTL(d.floating)) ? "start" : "end") ? "left" : "right") : (O = m, R = x === "end" ? "top" : "bottom");
      const _ = M - y.top - y.bottom, H = D - y.left - y.right, G = Qn(M - y[R], _), Z = Qn(D - y[O], H), Q = r.middlewareData.shift, V = !Q;
      let L = G, K = Z;
      Q != null && Q.enabled.x && (K = H), Q != null && Q.enabled.y && (L = _), V && !x && (T ? K = D - 2 * dn(y.left, y.right) : L = M - 2 * dn(y.top, y.bottom)), await h({
        ...r,
        availableWidth: K,
        availableHeight: L
      });
      const oe = await f.getDimensions(d.floating);
      return D !== oe.width || M !== oe.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function er() {
  return typeof window < "u";
}
function ga(a) {
  return Wv(a) ? (a.nodeName || "").toLowerCase() : "#document";
}
function st(a) {
  var r;
  return (a == null || (r = a.ownerDocument) == null ? void 0 : r.defaultView) || window;
}
function mn(a) {
  var r;
  return (r = (Wv(a) ? a.ownerDocument : a.document) || window.document) == null ? void 0 : r.documentElement;
}
function Wv(a) {
  return er() ? a instanceof Node || a instanceof st(a).Node : !1;
}
function Zt(a) {
  return er() ? a instanceof Element || a instanceof st(a).Element : !1;
}
function Kn(a) {
  return er() ? a instanceof HTMLElement || a instanceof st(a).HTMLElement : !1;
}
function yv(a) {
  return !er() || typeof ShadowRoot > "u" ? !1 : a instanceof ShadowRoot || a instanceof st(a).ShadowRoot;
}
function tr(a) {
  const {
    overflow: r,
    overflowX: o,
    overflowY: c,
    display: f
  } = Kt(a);
  return /auto|scroll|overlay|hidden|clip/.test(r + c + o) && f !== "inline" && f !== "contents";
}
function U0(a) {
  return /^(table|td|th)$/.test(ga(a));
}
function nr(a) {
  try {
    if (a.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return a.matches(":modal");
  } catch {
    return !1;
  }
}
const H0 = /transform|translate|scale|rotate|perspective|filter/, L0 = /paint|layout|strict|content/, gl = (a) => !!a && a !== "none";
let Ao;
function Io(a) {
  const r = Zt(a) ? Kt(a) : a;
  return gl(r.transform) || gl(r.translate) || gl(r.scale) || gl(r.rotate) || gl(r.perspective) || !es() && (gl(r.backdropFilter) || gl(r.filter)) || H0.test(r.willChange || "") || L0.test(r.contain || "");
}
function B0(a) {
  let r = El(a);
  for (; Kn(r) && !xi(r); ) {
    if (Io(r))
      return r;
    if (nr(r))
      return null;
    r = El(r);
  }
  return null;
}
function es() {
  return Ao == null && (Ao = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Ao;
}
function xi(a) {
  return /^(html|body|#document)$/.test(ga(a));
}
function Kt(a) {
  return st(a).getComputedStyle(a);
}
function lr(a) {
  return Zt(a) ? {
    scrollLeft: a.scrollLeft,
    scrollTop: a.scrollTop
  } : {
    scrollLeft: a.scrollX,
    scrollTop: a.scrollY
  };
}
function El(a) {
  if (ga(a) === "html")
    return a;
  const r = (
    // Step into the shadow DOM of the parent of a slotted node.
    a.assignedSlot || // DOM Element detected.
    a.parentNode || // ShadowRoot detected.
    yv(a) && a.host || // Fallback.
    mn(a)
  );
  return yv(r) ? r.host : r;
}
function $v(a) {
  const r = El(a);
  return xi(r) ? (a.ownerDocument || a).body : Kn(r) && tr(r) ? r : $v(r);
}
function Si(a, r, o) {
  var c;
  r === void 0 && (r = []), o === void 0 && (o = !0);
  const f = $v(a), d = f === ((c = a.ownerDocument) == null ? void 0 : c.body), h = st(f);
  if (d) {
    const g = qo(h);
    return r.concat(h, h.visualViewport || [], tr(f) ? f : [], g && o ? Si(g) : []);
  } else
    return r.concat(f, Si(f, [], o));
}
function qo(a) {
  return a.parent && Object.getPrototypeOf(a.parent) ? a.frameElement : null;
}
function Fv(a) {
  const r = Kt(a);
  let o = parseFloat(r.width) || 0, c = parseFloat(r.height) || 0;
  const f = Kn(a), d = f ? a.offsetWidth : o, h = f ? a.offsetHeight : c, g = Ku(o) !== d || Ku(c) !== h;
  return g && (o = d, c = h), {
    width: o,
    height: c,
    $: g
  };
}
function ts(a) {
  return Zt(a) ? a : a.contextElement;
}
function ha(a) {
  const r = ts(a);
  if (!Kn(r))
    return hn(1);
  const o = r.getBoundingClientRect(), {
    width: c,
    height: f,
    $: d
  } = Fv(r);
  let h = (d ? Ku(o.width) : o.width) / c, g = (d ? Ku(o.height) : o.height) / f;
  return (!h || !Number.isFinite(h)) && (h = 1), (!g || !Number.isFinite(g)) && (g = 1), {
    x: h,
    y: g
  };
}
const q0 = /* @__PURE__ */ hn(0);
function Pv(a) {
  const r = st(a);
  return !es() || !r.visualViewport ? q0 : {
    x: r.visualViewport.offsetLeft,
    y: r.visualViewport.offsetTop
  };
}
function Y0(a, r, o) {
  return r === void 0 && (r = !1), !!o && r && o === st(a);
}
function Al(a, r, o, c) {
  r === void 0 && (r = !1), o === void 0 && (o = !1);
  const f = a.getBoundingClientRect(), d = ts(a);
  let h = hn(1);
  r && (c ? Zt(c) && (h = ha(c)) : h = ha(a));
  const g = Y0(d, o, c) ? Pv(d) : hn(0);
  let y = (f.left + g.x) / h.x, m = (f.top + g.y) / h.y, x = f.width / h.x, T = f.height / h.y;
  if (d && c) {
    const D = st(d), M = Zt(c) ? st(c) : c;
    let R = D, O = qo(R);
    for (; O && M !== R; ) {
      const _ = ha(O), H = O.getBoundingClientRect(), G = Kt(O), Z = H.left + (O.clientLeft + parseFloat(G.paddingLeft)) * _.x, Q = H.top + (O.clientTop + parseFloat(G.paddingTop)) * _.y;
      y *= _.x, m *= _.y, x *= _.x, T *= _.y, y += Z, m += Q, R = st(O), O = qo(R);
    }
  }
  return Wu({
    width: x,
    height: T,
    x: y,
    y: m
  });
}
function ar(a, r) {
  const o = lr(a).scrollLeft;
  return r ? r.left + o : Al(mn(a)).left + o;
}
function Iv(a, r) {
  const o = a.getBoundingClientRect(), c = o.left + r.scrollLeft - ar(a, o), f = o.top + r.scrollTop;
  return {
    x: c,
    y: f
  };
}
function G0(a) {
  let {
    elements: r,
    rect: o,
    offsetParent: c,
    strategy: f
  } = a;
  const d = f === "fixed", h = mn(c), g = r ? nr(r.floating) : !1;
  if (c === h || g && d)
    return o;
  let y = {
    scrollLeft: 0,
    scrollTop: 0
  }, m = hn(1);
  const x = hn(0), T = Kn(c);
  if ((T || !d) && ((ga(c) !== "body" || tr(h)) && (y = lr(c)), T)) {
    const M = Al(c);
    m = ha(c), x.x = M.x + c.clientLeft, x.y = M.y + c.clientTop;
  }
  const D = h && !T && !d ? Iv(h, y) : hn(0);
  return {
    width: o.width * m.x,
    height: o.height * m.y,
    x: o.x * m.x - y.scrollLeft * m.x + x.x + D.x,
    y: o.y * m.y - y.scrollTop * m.y + x.y + D.y
  };
}
function k0(a) {
  return a.getClientRects ? Array.from(a.getClientRects()) : [];
}
function X0(a) {
  const r = lr(a), o = a.ownerDocument.body, c = dn(a.scrollWidth, a.clientWidth, o.scrollWidth, o.clientWidth), f = dn(a.scrollHeight, a.clientHeight, o.scrollHeight, o.clientHeight);
  let d = -r.scrollLeft + ar(a);
  const h = -r.scrollTop;
  return Kt(o).direction === "rtl" && (d += dn(a.clientWidth, o.clientWidth) - c), {
    width: c,
    height: f,
    x: d,
    y: h
  };
}
const V0 = 25;
function Q0(a, r, o) {
  o === void 0 && (o = "viewport");
  const c = o === "layoutViewport", f = st(a), d = mn(a), h = f.visualViewport;
  let g = d.clientWidth, y = d.clientHeight, m = 0, x = 0;
  if (h) {
    const D = !es() || r === "fixed";
    c ? D || (m = -h.offsetLeft, x = -h.offsetTop) : (g = h.width, y = h.height, D && (m = h.offsetLeft, x = h.offsetTop));
  }
  if (ar(d) <= 0) {
    const D = d.ownerDocument, M = D.body, R = getComputedStyle(M), O = D.compatMode === "CSS1Compat" && parseFloat(R.marginLeft) + parseFloat(R.marginRight) || 0, _ = Math.abs(d.clientWidth - M.clientWidth - O), H = getComputedStyle(d).scrollbarGutter === "stable both-edges" ? _ / 2 : _;
    H <= V0 && (g -= H);
  }
  return {
    width: g,
    height: y,
    x: m,
    y: x
  };
}
function Z0(a, r) {
  const o = Al(a, !0, r === "fixed"), c = o.top + a.clientTop, f = o.left + a.clientLeft, d = ha(a), h = a.clientWidth * d.x, g = a.clientHeight * d.y, y = f * d.x, m = c * d.y;
  return {
    width: h,
    height: g,
    x: y,
    y: m
  };
}
function gv(a, r, o) {
  let c;
  if (r === "viewport" || r === "layoutViewport")
    c = Q0(a, o, r);
  else if (r === "document")
    c = X0(mn(a));
  else if (Zt(r))
    c = Z0(r, o);
  else {
    const f = Pv(a);
    c = {
      x: r.x - f.x,
      y: r.y - f.y,
      width: r.width,
      height: r.height
    };
  }
  return Wu(c);
}
function K0(a, r) {
  const o = r.get(a);
  if (o)
    return o;
  let c = Si(a, [], !1).filter((g) => Zt(g) && ga(g) !== "body"), f = null;
  const d = Kt(a).position === "fixed";
  let h = d ? El(a) : a;
  for (; Zt(h) && !xi(h); ) {
    const g = Kt(h), y = Io(h), m = f ? f.position : d ? "fixed" : "";
    !y && (m === "fixed" || m === "absolute" && g.position === "static") ? c = c.filter((T) => T !== h) : f = g, h = El(h);
  }
  return r.set(a, c), c;
}
function J0(a) {
  let {
    element: r,
    boundary: o,
    rootBoundary: c,
    strategy: f
  } = a;
  const h = [...o === "clippingAncestors" ? nr(r) ? [] : K0(r, this._c) : [].concat(o), c], g = gv(r, h[0], f);
  let y = g.top, m = g.right, x = g.bottom, T = g.left;
  for (let D = 1; D < h.length; D++) {
    const M = gv(r, h[D], f);
    y = dn(M.top, y), m = Qn(M.right, m), x = Qn(M.bottom, x), T = dn(M.left, T);
  }
  return {
    width: m - T,
    height: x - y,
    x: T,
    y
  };
}
function W0(a) {
  const {
    width: r,
    height: o
  } = Fv(a);
  return {
    width: r,
    height: o
  };
}
function $0(a, r, o) {
  const c = Kn(r), f = mn(r), d = o === "fixed", h = Al(a, !0, d, r);
  let g = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const y = hn(0);
  if ((c || !d) && ((ga(r) !== "body" || tr(f)) && (g = lr(r)), c)) {
    const D = Al(r, !0, d, r);
    y.x = D.x + r.clientLeft, y.y = D.y + r.clientTop;
  }
  !c && f && (y.x = ar(f));
  const m = f && !c && !d ? Iv(f, g) : hn(0), x = h.left + g.scrollLeft - y.x - m.x, T = h.top + g.scrollTop - y.y - m.y;
  return {
    x,
    y: T,
    width: h.width,
    height: h.height
  };
}
function wo(a) {
  return Kt(a).position === "static";
}
function pv(a, r) {
  if (!Kn(a) || Kt(a).position === "fixed")
    return null;
  if (r)
    return r(a);
  let o = a.offsetParent;
  return mn(a) === o && (o = o.ownerDocument.body), o;
}
function em(a, r) {
  const o = st(a);
  if (nr(a))
    return o;
  if (!Kn(a)) {
    let f = El(a);
    for (; f && !xi(f); ) {
      if (Zt(f) && !wo(f))
        return f;
      f = El(f);
    }
    return o;
  }
  let c = pv(a, r);
  for (; c && U0(c) && wo(c); )
    c = pv(c, r);
  return c && xi(c) && wo(c) && !Io(c) ? o : c || B0(a) || o;
}
const F0 = async function(a) {
  const r = this.getOffsetParent || em, o = this.getDimensions, c = await o(a.floating);
  return {
    reference: $0(a.reference, await r(a.floating), a.strategy),
    floating: {
      x: 0,
      y: 0,
      width: c.width,
      height: c.height
    }
  };
};
function P0(a) {
  return Kt(a).direction === "rtl";
}
const I0 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: G0,
  getDocumentElement: mn,
  getClippingRect: J0,
  getOffsetParent: em,
  getElementRects: F0,
  getClientRects: k0,
  getDimensions: W0,
  getScale: ha,
  isElement: Zt,
  isRTL: P0
};
function tm(a, r) {
  return a.x === r.x && a.y === r.y && a.width === r.width && a.height === r.height;
}
function eb(a, r, o) {
  let c = null, f;
  const d = mn(a);
  function h() {
    var x;
    clearTimeout(f), (x = c) == null || x.disconnect(), c = null;
  }
  function g(x, T) {
    x === void 0 && (x = !1), T === void 0 && (T = 1), h();
    const D = a.getBoundingClientRect(), {
      left: M,
      top: R,
      width: O,
      height: _
    } = D;
    if (x || r(), !O || !_)
      return;
    const H = ju(R), G = ju(d.clientWidth - (M + O)), Z = ju(d.clientHeight - (R + _)), Q = ju(M), L = {
      rootMargin: -H + "px " + -G + "px " + -Z + "px " + -Q + "px",
      threshold: dn(0, Qn(1, T)) || 1
    };
    let K = !0;
    function oe(J) {
      const $ = J[0].intersectionRatio;
      if (!tm(D, a.getBoundingClientRect()))
        return g();
      if ($ !== T) {
        if (!K)
          return g();
        $ ? g(!1, $) : f = setTimeout(() => {
          g(!1, 1e-7);
        }, 1e3);
      }
      K = !1;
    }
    try {
      c = new IntersectionObserver(oe, {
        ...L,
        // Handle <iframe>s
        root: d.ownerDocument
      });
    } catch {
      c = new IntersectionObserver(oe, L);
    }
    c.observe(a);
  }
  const y = st(a), m = () => g(o);
  return y.addEventListener("resize", m), g(!0), () => {
    y.removeEventListener("resize", m), h();
  };
}
function tb(a, r, o, c) {
  c === void 0 && (c = {});
  const {
    ancestorScroll: f = !0,
    ancestorResize: d = !0,
    elementResize: h = typeof ResizeObserver == "function",
    layoutShift: g = typeof IntersectionObserver == "function",
    animationFrame: y = !1
  } = c, m = ts(a), x = f || d ? [...m ? Si(m) : [], ...r ? Si(r) : []] : [];
  x.forEach((H) => {
    f && H.addEventListener("scroll", o), d && H.addEventListener("resize", o);
  });
  const T = m && g ? eb(m, o, d) : null;
  let D = -1, M = null;
  h && (M = new ResizeObserver((H) => {
    let [G] = H;
    G && G.target === m && M && r && (M.unobserve(r), cancelAnimationFrame(D), D = requestAnimationFrame(() => {
      var Z;
      (Z = M) == null || Z.observe(r);
    })), o();
  }), m && !y && M.observe(m), r && M.observe(r));
  let R, O = y ? Al(a) : null;
  y && _();
  function _() {
    const H = Al(a);
    O && !tm(O, H) && o(), O = H, R = requestAnimationFrame(_);
  }
  return o(), () => {
    var H;
    x.forEach((G) => {
      f && G.removeEventListener("scroll", o), d && G.removeEventListener("resize", o);
    }), T == null || T(), (H = M) == null || H.disconnect(), M = null, y && cancelAnimationFrame(R);
  };
}
const nb = N0, lb = z0, ab = C0, ib = j0, ub = M0, bv = R0, rb = _0, cb = (a, r, o) => {
  const c = /* @__PURE__ */ new Map(), f = o ?? {}, d = {
    ...I0,
    ...f.platform,
    _c: c
  };
  return O0(a, r, {
    ...f,
    platform: d
  });
};
var ob = typeof document < "u", sb = function() {
}, Xu = ob ? E.useLayoutEffect : sb;
function $u(a, r) {
  if (a === r)
    return !0;
  if (typeof a != typeof r)
    return !1;
  if (typeof a == "function" && a.toString() === r.toString())
    return !0;
  let o, c, f;
  if (a && r && typeof a == "object") {
    if (Array.isArray(a)) {
      if (o = a.length, o !== r.length) return !1;
      for (c = o; c-- !== 0; )
        if (!$u(a[c], r[c]))
          return !1;
      return !0;
    }
    if (f = Object.keys(a), o = f.length, o !== Object.keys(r).length)
      return !1;
    for (c = o; c-- !== 0; )
      if (!{}.hasOwnProperty.call(r, f[c]))
        return !1;
    for (c = o; c-- !== 0; ) {
      const d = f[c];
      if (!(d === "_owner" && a.$$typeof) && !$u(a[d], r[d]))
        return !1;
    }
    return !0;
  }
  return a !== a && r !== r;
}
function nm(a) {
  return typeof window > "u" ? 1 : (a.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function xv(a, r) {
  const o = nm(a);
  return Math.round(r * o) / o;
}
function To(a) {
  const r = E.useRef(a);
  return Xu(() => {
    r.current = a;
  }), r;
}
function fb(a) {
  a === void 0 && (a = {});
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: c = [],
    platform: f,
    elements: {
      reference: d,
      floating: h
    } = {},
    transform: g = !0,
    whileElementsMounted: y,
    open: m
  } = a, [x, T] = E.useState({
    x: 0,
    y: 0,
    strategy: o,
    placement: r,
    middlewareData: {},
    isPositioned: !1
  }), [D, M] = E.useState(c);
  $u(D, c) || M(c);
  const [R, O] = E.useState(null), [_, H] = E.useState(null), G = E.useCallback((X) => {
    X !== L.current && (L.current = X, O(X));
  }, []), Z = E.useCallback((X) => {
    X !== K.current && (K.current = X, H(X));
  }, []), Q = d || R, V = h || _, L = E.useRef(null), K = E.useRef(null), oe = E.useRef(x), J = y != null, $ = To(y), Se = To(f), Re = To(m), de = E.useCallback(() => {
    if (!L.current || !K.current)
      return;
    const X = {
      placement: r,
      strategy: o,
      middleware: D
    };
    Se.current && (X.platform = Se.current), cb(L.current, K.current, X).then((ne) => {
      const S = {
        ...ne,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: Re.current !== !1
      };
      me.current && !$u(oe.current, S) && (oe.current = S, xl.flushSync(() => {
        T(S);
      }));
    });
  }, [D, r, o, Se, Re]);
  Xu(() => {
    m === !1 && oe.current.isPositioned && (oe.current.isPositioned = !1, T((X) => ({
      ...X,
      isPositioned: !1
    })));
  }, [m]);
  const me = E.useRef(!1);
  Xu(() => (me.current = !0, () => {
    me.current = !1;
  }), []), Xu(() => {
    if (Q && (L.current = Q), V && (K.current = V), Q && V) {
      if ($.current)
        return $.current(Q, V, de);
      de();
    }
  }, [Q, V, de, $, J]);
  const ge = E.useMemo(() => ({
    reference: L,
    floating: K,
    setReference: G,
    setFloating: Z
  }), [G, Z]), B = E.useMemo(() => ({
    reference: Q,
    floating: V
  }), [Q, V]), ee = E.useMemo(() => {
    const X = {
      position: o,
      left: 0,
      top: 0
    };
    if (!B.floating)
      return X;
    const ne = xv(B.floating, x.x), S = xv(B.floating, x.y);
    return g ? {
      ...X,
      transform: "translate(" + ne + "px, " + S + "px)",
      ...nm(B.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: o,
      left: ne,
      top: S
    };
  }, [o, g, B.floating, x.x, x.y]);
  return E.useMemo(() => ({
    ...x,
    update: de,
    refs: ge,
    elements: B,
    floatingStyles: ee
  }), [x, de, ge, B, ee]);
}
const db = (a) => {
  function r(o) {
    return {}.hasOwnProperty.call(o, "current");
  }
  return {
    name: "arrow",
    options: a,
    fn(o) {
      const {
        element: c,
        padding: f
      } = typeof a == "function" ? a(o) : a;
      return c && r(c) ? c.current != null ? bv({
        element: c.current,
        padding: f
      }).fn(o) : {} : c ? bv({
        element: c,
        padding: f
      }).fn(o) : {};
    }
  };
}, hb = (a, r) => {
  const o = nb(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, r]
  };
}, vb = (a, r) => {
  const o = lb(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, r]
  };
}, mb = (a, r) => ({
  fn: rb(a).fn,
  options: [a, r]
}), yb = (a, r) => {
  const o = ab(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, r]
  };
}, gb = (a, r) => {
  const o = ib(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, r]
  };
}, pb = (a, r) => {
  const o = ub(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, r]
  };
}, bb = (a, r) => {
  const o = db(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, r]
  };
};
var xb = "Arrow", lm = E.forwardRef((a, r) => {
  const { children: o, width: c = 10, height: f = 5, ...d } = a;
  return /* @__PURE__ */ p.jsx(
    ft.svg,
    {
      ...d,
      ref: r,
      width: c,
      height: f,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: a.asChild ? o : /* @__PURE__ */ p.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
lm.displayName = xb;
var Sb = lm;
function Eb(a) {
  const [r, o] = E.useState(void 0);
  return Sl(() => {
    if (a) {
      o({ width: a.offsetWidth, height: a.offsetHeight });
      const c = new ResizeObserver((f) => {
        if (!Array.isArray(f) || !f.length)
          return;
        const d = f[0];
        let h, g;
        if ("borderBoxSize" in d) {
          const y = d.borderBoxSize, m = Array.isArray(y) ? y[0] : y;
          h = m.inlineSize, g = m.blockSize;
        } else
          h = a.offsetWidth, g = a.offsetHeight;
        o({ width: h, height: g });
      });
      return c.observe(a, { box: "border-box" }), () => c.unobserve(a);
    } else
      o(void 0);
  }, [a]), r;
}
var ns = "Popper", [am, im] = Jo(ns), [Ab, um] = am(ns), rm = (a) => {
  const { __scopePopper: r, children: o } = a, [c, f] = E.useState(null);
  return /* @__PURE__ */ p.jsx(Ab, { scope: r, anchor: c, onAnchorChange: f, children: o });
};
rm.displayName = ns;
var cm = "PopperAnchor", om = E.forwardRef(
  (a, r) => {
    const { __scopePopper: o, virtualRef: c, ...f } = a, d = um(cm, o), h = E.useRef(null), g = Ht(r, h);
    return E.useEffect(() => {
      d.onAnchorChange((c == null ? void 0 : c.current) || h.current);
    }), c ? null : /* @__PURE__ */ p.jsx(ft.div, { ...f, ref: g });
  }
);
om.displayName = cm;
var ls = "PopperContent", [wb, Tb] = am(ls), sm = E.forwardRef(
  (a, r) => {
    var _e, Ee, je, Ce, dt, yn;
    const {
      __scopePopper: o,
      side: c = "bottom",
      sideOffset: f = 0,
      align: d = "center",
      alignOffset: h = 0,
      arrowPadding: g = 0,
      avoidCollisions: y = !0,
      collisionBoundary: m = [],
      collisionPadding: x = 0,
      sticky: T = "partial",
      hideWhenDetached: D = !1,
      updatePositionStrategy: M = "optimized",
      onPlaced: R,
      ...O
    } = a, _ = um(ls, o), [H, G] = E.useState(null), Z = Ht(r, (it) => G(it)), [Q, V] = E.useState(null), L = Eb(Q), K = (L == null ? void 0 : L.width) ?? 0, oe = (L == null ? void 0 : L.height) ?? 0, J = c + (d !== "center" ? "-" + d : ""), $ = typeof x == "number" ? x : { top: 0, right: 0, bottom: 0, left: 0, ...x }, Se = Array.isArray(m) ? m : [m], Re = Se.length > 0, de = {
      padding: $,
      boundary: Se.filter(Rb),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: Re
    }, { refs: me, floatingStyles: ge, placement: B, isPositioned: ee, middlewareData: X } = fb({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: J,
      whileElementsMounted: (...it) => tb(...it, {
        animationFrame: M === "always"
      }),
      elements: {
        reference: _.anchor
      },
      middleware: [
        hb({ mainAxis: f + oe, alignmentAxis: h }),
        y && vb({
          mainAxis: !0,
          crossAxis: !1,
          limiter: T === "partial" ? mb() : void 0,
          ...de
        }),
        y && yb({ ...de }),
        gb({
          ...de,
          apply: ({ elements: it, rects: Jn, availableWidth: Tl, availableHeight: gn }) => {
            const { width: Sa, height: Ol } = Jn.reference, pn = it.floating.style;
            pn.setProperty("--radix-popper-available-width", `${Tl}px`), pn.setProperty("--radix-popper-available-height", `${gn}px`), pn.setProperty("--radix-popper-anchor-width", `${Sa}px`), pn.setProperty("--radix-popper-anchor-height", `${Ol}px`);
          }
        }),
        Q && bb({ element: Q, padding: g }),
        Cb({ arrowWidth: K, arrowHeight: oe }),
        D && pb({ strategy: "referenceHidden", ...de })
      ]
    }), [ne, S] = hm(B), k = Vn(R);
    Sl(() => {
      ee && (k == null || k());
    }, [ee, k]);
    const ie = (_e = X.arrow) == null ? void 0 : _e.x, le = (Ee = X.arrow) == null ? void 0 : Ee.y, W = ((je = X.arrow) == null ? void 0 : je.centerOffset) !== 0, [se, re] = E.useState();
    return Sl(() => {
      H && re(window.getComputedStyle(H).zIndex);
    }, [H]), /* @__PURE__ */ p.jsx(
      "div",
      {
        ref: me.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...ge,
          transform: ee ? ge.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: se,
          "--radix-popper-transform-origin": [
            (Ce = X.transformOrigin) == null ? void 0 : Ce.x,
            (dt = X.transformOrigin) == null ? void 0 : dt.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((yn = X.hide) == null ? void 0 : yn.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: a.dir,
        children: /* @__PURE__ */ p.jsx(
          wb,
          {
            scope: o,
            placedSide: ne,
            onArrowChange: V,
            arrowX: ie,
            arrowY: le,
            shouldHideArrow: W,
            children: /* @__PURE__ */ p.jsx(
              ft.div,
              {
                "data-side": ne,
                "data-align": S,
                ...O,
                ref: Z,
                style: {
                  ...O.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: ee ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
sm.displayName = ls;
var fm = "PopperArrow", Ob = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, dm = E.forwardRef(function(r, o) {
  const { __scopePopper: c, ...f } = r, d = Tb(fm, c), h = Ob[d.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ p.jsx(
      "span",
      {
        ref: d.onArrowChange,
        style: {
          position: "absolute",
          left: d.arrowX,
          top: d.arrowY,
          [h]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[d.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[d.placedSide],
          visibility: d.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ p.jsx(
          Sb,
          {
            ...f,
            ref: o,
            style: {
              ...f.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
dm.displayName = fm;
function Rb(a) {
  return a !== null;
}
var Cb = (a) => ({
  name: "transformOrigin",
  options: a,
  fn(r) {
    var _, H, G;
    const { placement: o, rects: c, middlewareData: f } = r, h = ((_ = f.arrow) == null ? void 0 : _.centerOffset) !== 0, g = h ? 0 : a.arrowWidth, y = h ? 0 : a.arrowHeight, [m, x] = hm(o), T = { start: "0%", center: "50%", end: "100%" }[x], D = (((H = f.arrow) == null ? void 0 : H.x) ?? 0) + g / 2, M = (((G = f.arrow) == null ? void 0 : G.y) ?? 0) + y / 2;
    let R = "", O = "";
    return m === "bottom" ? (R = h ? T : `${D}px`, O = `${-y}px`) : m === "top" ? (R = h ? T : `${D}px`, O = `${c.floating.height + y}px`) : m === "right" ? (R = `${-y}px`, O = h ? T : `${M}px`) : m === "left" && (R = `${c.floating.width + y}px`, O = h ? T : `${M}px`), { data: { x: R, y: O } };
  }
});
function hm(a) {
  const [r, o = "center"] = a.split("-");
  return [r, o];
}
var Mb = rm, Db = om, Nb = sm, zb = dm, _b = "Portal", as = E.forwardRef((a, r) => {
  var g;
  const { container: o, ...c } = a, [f, d] = E.useState(!1);
  Sl(() => d(!0), []);
  const h = o || f && ((g = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : g.body);
  return h ? Wp.createPortal(/* @__PURE__ */ p.jsx(ft.div, { ...c, ref: r }), h) : null;
});
as.displayName = _b;
function jb(a, r) {
  return E.useReducer((o, c) => r[o][c] ?? o, a);
}
var pa = (a) => {
  const { present: r, children: o } = a, c = Ub(r), f = typeof o == "function" ? o({ present: c.isPresent }) : E.Children.only(o), d = Ht(c.ref, Hb(f));
  return typeof o == "function" || c.isPresent ? E.cloneElement(f, { ref: d }) : null;
};
pa.displayName = "Presence";
function Ub(a) {
  const [r, o] = E.useState(), c = E.useRef({}), f = E.useRef(a), d = E.useRef("none"), h = a ? "mounted" : "unmounted", [g, y] = jb(h, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return E.useEffect(() => {
    const m = Uu(c.current);
    d.current = g === "mounted" ? m : "none";
  }, [g]), Sl(() => {
    const m = c.current, x = f.current;
    if (x !== a) {
      const D = d.current, M = Uu(m);
      a ? y("MOUNT") : M === "none" || (m == null ? void 0 : m.display) === "none" ? y("UNMOUNT") : y(x && D !== M ? "ANIMATION_OUT" : "UNMOUNT"), f.current = a;
    }
  }, [a, y]), Sl(() => {
    if (r) {
      let m;
      const x = r.ownerDocument.defaultView ?? window, T = (M) => {
        const O = Uu(c.current).includes(M.animationName);
        if (M.target === r && O && (y("ANIMATION_END"), !f.current)) {
          const _ = r.style.animationFillMode;
          r.style.animationFillMode = "forwards", m = x.setTimeout(() => {
            r.style.animationFillMode === "forwards" && (r.style.animationFillMode = _);
          });
        }
      }, D = (M) => {
        M.target === r && (d.current = Uu(c.current));
      };
      return r.addEventListener("animationstart", D), r.addEventListener("animationcancel", T), r.addEventListener("animationend", T), () => {
        x.clearTimeout(m), r.removeEventListener("animationstart", D), r.removeEventListener("animationcancel", T), r.removeEventListener("animationend", T);
      };
    } else
      y("ANIMATION_END");
  }, [r, y]), {
    isPresent: ["mounted", "unmountSuspended"].includes(g),
    ref: E.useCallback((m) => {
      m && (c.current = getComputedStyle(m)), o(m);
    }, [])
  };
}
function Uu(a) {
  return (a == null ? void 0 : a.animationName) || "none";
}
function Hb(a) {
  var c, f;
  let r = (c = Object.getOwnPropertyDescriptor(a.props, "ref")) == null ? void 0 : c.get, o = r && "isReactWarning" in r && r.isReactWarning;
  return o ? a.ref : (r = (f = Object.getOwnPropertyDescriptor(a, "ref")) == null ? void 0 : f.get, o = r && "isReactWarning" in r && r.isReactWarning, o ? a.props.ref : a.props.ref || a.ref);
}
function vm({
  prop: a,
  defaultProp: r,
  onChange: o = () => {
  }
}) {
  const [c, f] = Lb({ defaultProp: r, onChange: o }), d = a !== void 0, h = d ? a : c, g = Vn(o), y = E.useCallback(
    (m) => {
      if (d) {
        const T = typeof m == "function" ? m(a) : m;
        T !== a && g(T);
      } else
        f(m);
    },
    [d, a, f, g]
  );
  return [h, y];
}
function Lb({
  defaultProp: a,
  onChange: r
}) {
  const o = E.useState(a), [c] = o, f = E.useRef(c), d = Vn(r);
  return E.useEffect(() => {
    f.current !== c && (d(c), f.current = c);
  }, [c, f, d]), o;
}
var Bb = "VisuallyHidden", mm = E.forwardRef(
  (a, r) => /* @__PURE__ */ p.jsx(
    ft.span,
    {
      ...a,
      ref: r,
      style: {
        // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        ...a.style
      }
    }
  )
);
mm.displayName = Bb;
var qb = mm, [ir] = Jo("Tooltip", [
  im
]), ur = im(), ym = "TooltipProvider", Yb = 700, Yo = "tooltip.open", [Gb, is] = ir(ym), gm = (a) => {
  const {
    __scopeTooltip: r,
    delayDuration: o = Yb,
    skipDelayDuration: c = 300,
    disableHoverableContent: f = !1,
    children: d
  } = a, [h, g] = E.useState(!0), y = E.useRef(!1), m = E.useRef(0);
  return E.useEffect(() => {
    const x = m.current;
    return () => window.clearTimeout(x);
  }, []), /* @__PURE__ */ p.jsx(
    Gb,
    {
      scope: r,
      isOpenDelayed: h,
      delayDuration: o,
      onOpen: E.useCallback(() => {
        window.clearTimeout(m.current), g(!1);
      }, []),
      onClose: E.useCallback(() => {
        window.clearTimeout(m.current), m.current = window.setTimeout(
          () => g(!0),
          c
        );
      }, [c]),
      isPointerInTransitRef: y,
      onPointerInTransitChange: E.useCallback((x) => {
        y.current = x;
      }, []),
      disableHoverableContent: f,
      children: d
    }
  );
};
gm.displayName = ym;
var rr = "Tooltip", [kb, Ei] = ir(rr), pm = (a) => {
  const {
    __scopeTooltip: r,
    children: o,
    open: c,
    defaultOpen: f = !1,
    onOpenChange: d,
    disableHoverableContent: h,
    delayDuration: g
  } = a, y = is(rr, a.__scopeTooltip), m = ur(r), [x, T] = E.useState(null), D = ku(), M = E.useRef(0), R = h ?? y.disableHoverableContent, O = g ?? y.delayDuration, _ = E.useRef(!1), [H = !1, G] = vm({
    prop: c,
    defaultProp: f,
    onChange: (K) => {
      K ? (y.onOpen(), document.dispatchEvent(new CustomEvent(Yo))) : y.onClose(), d == null || d(K);
    }
  }), Z = E.useMemo(() => H ? _.current ? "delayed-open" : "instant-open" : "closed", [H]), Q = E.useCallback(() => {
    window.clearTimeout(M.current), M.current = 0, _.current = !1, G(!0);
  }, [G]), V = E.useCallback(() => {
    window.clearTimeout(M.current), M.current = 0, G(!1);
  }, [G]), L = E.useCallback(() => {
    window.clearTimeout(M.current), M.current = window.setTimeout(() => {
      _.current = !0, G(!0), M.current = 0;
    }, O);
  }, [O, G]);
  return E.useEffect(() => () => {
    M.current && (window.clearTimeout(M.current), M.current = 0);
  }, []), /* @__PURE__ */ p.jsx(Mb, { ...m, children: /* @__PURE__ */ p.jsx(
    kb,
    {
      scope: r,
      contentId: D,
      open: H,
      stateAttribute: Z,
      trigger: x,
      onTriggerChange: T,
      onTriggerEnter: E.useCallback(() => {
        y.isOpenDelayed ? L() : Q();
      }, [y.isOpenDelayed, L, Q]),
      onTriggerLeave: E.useCallback(() => {
        R ? V() : (window.clearTimeout(M.current), M.current = 0);
      }, [V, R]),
      onOpen: Q,
      onClose: V,
      disableHoverableContent: R,
      children: o
    }
  ) });
};
pm.displayName = rr;
var Go = "TooltipTrigger", bm = E.forwardRef(
  (a, r) => {
    const { __scopeTooltip: o, ...c } = a, f = Ei(Go, o), d = is(Go, o), h = ur(o), g = E.useRef(null), y = Ht(r, g, f.onTriggerChange), m = E.useRef(!1), x = E.useRef(!1), T = E.useCallback(() => m.current = !1, []);
    return E.useEffect(() => () => document.removeEventListener("pointerup", T), [T]), /* @__PURE__ */ p.jsx(Db, { asChild: !0, ...h, children: /* @__PURE__ */ p.jsx(
      ft.button,
      {
        "aria-describedby": f.open ? f.contentId : void 0,
        "data-state": f.stateAttribute,
        ...c,
        ref: y,
        onPointerMove: ot(a.onPointerMove, (D) => {
          D.pointerType !== "touch" && !x.current && !d.isPointerInTransitRef.current && (f.onTriggerEnter(), x.current = !0);
        }),
        onPointerLeave: ot(a.onPointerLeave, () => {
          f.onTriggerLeave(), x.current = !1;
        }),
        onPointerDown: ot(a.onPointerDown, () => {
          m.current = !0, document.addEventListener("pointerup", T, { once: !0 });
        }),
        onFocus: ot(a.onFocus, () => {
          m.current || f.onOpen();
        }),
        onBlur: ot(a.onBlur, f.onClose),
        onClick: ot(a.onClick, f.onClose)
      }
    ) });
  }
);
bm.displayName = Go;
var us = "TooltipPortal", [Xb, Vb] = ir(us, {
  forceMount: void 0
}), xm = (a) => {
  const { __scopeTooltip: r, forceMount: o, children: c, container: f } = a, d = Ei(us, r);
  return /* @__PURE__ */ p.jsx(Xb, { scope: r, forceMount: o, children: /* @__PURE__ */ p.jsx(pa, { present: o || d.open, children: /* @__PURE__ */ p.jsx(as, { asChild: !0, container: f, children: c }) }) });
};
xm.displayName = us;
var ma = "TooltipContent", Sm = E.forwardRef(
  (a, r) => {
    const o = Vb(ma, a.__scopeTooltip), { forceMount: c = o.forceMount, side: f = "top", ...d } = a, h = Ei(ma, a.__scopeTooltip);
    return /* @__PURE__ */ p.jsx(pa, { present: c || h.open, children: h.disableHoverableContent ? /* @__PURE__ */ p.jsx(Em, { side: f, ...d, ref: r }) : /* @__PURE__ */ p.jsx(Qb, { side: f, ...d, ref: r }) });
  }
), Qb = E.forwardRef((a, r) => {
  const o = Ei(ma, a.__scopeTooltip), c = is(ma, a.__scopeTooltip), f = E.useRef(null), d = Ht(r, f), [h, g] = E.useState(null), { trigger: y, onClose: m } = o, x = f.current, { onPointerInTransitChange: T } = c, D = E.useCallback(() => {
    g(null), T(!1);
  }, [T]), M = E.useCallback(
    (R, O) => {
      const _ = R.currentTarget, H = { x: R.clientX, y: R.clientY }, G = Jb(H, _.getBoundingClientRect()), Z = Wb(H, G), Q = $b(O.getBoundingClientRect()), V = Pb([...Z, ...Q]);
      g(V), T(!0);
    },
    [T]
  );
  return E.useEffect(() => () => D(), [D]), E.useEffect(() => {
    if (y && x) {
      const R = (_) => M(_, x), O = (_) => M(_, y);
      return y.addEventListener("pointerleave", R), x.addEventListener("pointerleave", O), () => {
        y.removeEventListener("pointerleave", R), x.removeEventListener("pointerleave", O);
      };
    }
  }, [y, x, M, D]), E.useEffect(() => {
    if (h) {
      const R = (O) => {
        const _ = O.target, H = { x: O.clientX, y: O.clientY }, G = (y == null ? void 0 : y.contains(_)) || (x == null ? void 0 : x.contains(_)), Z = !Fb(H, h);
        G ? D() : Z && (D(), m());
      };
      return document.addEventListener("pointermove", R), () => document.removeEventListener("pointermove", R);
    }
  }, [y, x, h, m, D]), /* @__PURE__ */ p.jsx(Em, { ...a, ref: d });
}), [Zb, Kb] = ir(rr, { isInside: !1 }), Em = E.forwardRef(
  (a, r) => {
    const {
      __scopeTooltip: o,
      children: c,
      "aria-label": f,
      onEscapeKeyDown: d,
      onPointerDownOutside: h,
      ...g
    } = a, y = Ei(ma, o), m = ur(o), { onClose: x } = y;
    return E.useEffect(() => (document.addEventListener(Yo, x), () => document.removeEventListener(Yo, x)), [x]), E.useEffect(() => {
      if (y.trigger) {
        const T = (D) => {
          const M = D.target;
          M != null && M.contains(y.trigger) && x();
        };
        return window.addEventListener("scroll", T, { capture: !0 }), () => window.removeEventListener("scroll", T, { capture: !0 });
      }
    }, [y.trigger, x]), /* @__PURE__ */ p.jsx(
      Wo,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: d,
        onPointerDownOutside: h,
        onFocusOutside: (T) => T.preventDefault(),
        onDismiss: x,
        children: /* @__PURE__ */ p.jsxs(
          Nb,
          {
            "data-state": y.stateAttribute,
            ...m,
            ...g,
            ref: r,
            style: {
              ...g.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ p.jsx(Xv, { children: c }),
              /* @__PURE__ */ p.jsx(Zb, { scope: o, isInside: !0, children: /* @__PURE__ */ p.jsx(qb, { id: y.contentId, role: "tooltip", children: f || c }) })
            ]
          }
        )
      }
    );
  }
);
Sm.displayName = ma;
var Am = "TooltipArrow", wm = E.forwardRef(
  (a, r) => {
    const { __scopeTooltip: o, ...c } = a, f = ur(o);
    return Kb(
      Am,
      o
    ).isInside ? null : /* @__PURE__ */ p.jsx(zb, { ...f, ...c, ref: r });
  }
);
wm.displayName = Am;
function Jb(a, r) {
  const o = Math.abs(r.top - a.y), c = Math.abs(r.bottom - a.y), f = Math.abs(r.right - a.x), d = Math.abs(r.left - a.x);
  switch (Math.min(o, c, f, d)) {
    case d:
      return "left";
    case f:
      return "right";
    case o:
      return "top";
    case c:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Wb(a, r, o = 5) {
  const c = [];
  switch (r) {
    case "top":
      c.push(
        { x: a.x - o, y: a.y + o },
        { x: a.x + o, y: a.y + o }
      );
      break;
    case "bottom":
      c.push(
        { x: a.x - o, y: a.y - o },
        { x: a.x + o, y: a.y - o }
      );
      break;
    case "left":
      c.push(
        { x: a.x + o, y: a.y - o },
        { x: a.x + o, y: a.y + o }
      );
      break;
    case "right":
      c.push(
        { x: a.x - o, y: a.y - o },
        { x: a.x - o, y: a.y + o }
      );
      break;
  }
  return c;
}
function $b(a) {
  const { top: r, right: o, bottom: c, left: f } = a;
  return [
    { x: f, y: r },
    { x: o, y: r },
    { x: o, y: c },
    { x: f, y: c }
  ];
}
function Fb(a, r) {
  const { x: o, y: c } = a;
  let f = !1;
  for (let d = 0, h = r.length - 1; d < r.length; h = d++) {
    const g = r[d].x, y = r[d].y, m = r[h].x, x = r[h].y;
    y > c != x > c && o < (m - g) * (c - y) / (x - y) + g && (f = !f);
  }
  return f;
}
function Pb(a) {
  const r = a.slice();
  return r.sort((o, c) => o.x < c.x ? -1 : o.x > c.x ? 1 : o.y < c.y ? -1 : o.y > c.y ? 1 : 0), Ib(r);
}
function Ib(a) {
  if (a.length <= 1) return a.slice();
  const r = [];
  for (let c = 0; c < a.length; c++) {
    const f = a[c];
    for (; r.length >= 2; ) {
      const d = r[r.length - 1], h = r[r.length - 2];
      if ((d.x - h.x) * (f.y - h.y) >= (d.y - h.y) * (f.x - h.x)) r.pop();
      else break;
    }
    r.push(f);
  }
  r.pop();
  const o = [];
  for (let c = a.length - 1; c >= 0; c--) {
    const f = a[c];
    for (; o.length >= 2; ) {
      const d = o[o.length - 1], h = o[o.length - 2];
      if ((d.x - h.x) * (f.y - h.y) >= (d.y - h.y) * (f.x - h.x)) o.pop();
      else break;
    }
    o.push(f);
  }
  return o.pop(), r.length === 1 && o.length === 1 && r[0].x === o[0].x && r[0].y === o[0].y ? r : r.concat(o);
}
var e1 = gm, t1 = pm, n1 = bm, l1 = xm, a1 = Sm, i1 = wm;
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const u1 = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Tm = (...a) => a.filter((r, o, c) => !!r && r.trim() !== "" && c.indexOf(r) === o).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var r1 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const c1 = E.forwardRef(
  ({
    color: a = "currentColor",
    size: r = 24,
    strokeWidth: o = 2,
    absoluteStrokeWidth: c,
    className: f = "",
    children: d,
    iconNode: h,
    ...g
  }, y) => E.createElement(
    "svg",
    {
      ref: y,
      ...r1,
      width: r,
      height: r,
      stroke: a,
      strokeWidth: c ? Number(o) * 24 / Number(r) : o,
      className: Tm("lucide", f),
      ...g
    },
    [
      ...h.map(([m, x]) => E.createElement(m, x)),
      ...Array.isArray(d) ? d : [d]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ze = (a, r) => {
  const o = E.forwardRef(
    ({ className: c, ...f }, d) => E.createElement(c1, {
      ref: d,
      iconNode: r,
      className: Tm(`lucide-${u1(a)}`, c),
      ...f
    })
  );
  return o.displayName = `${a}`, o;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hu = ze("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o1 = ze("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s1 = ze("BookOpen", [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Om = ze("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const f1 = ze("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const d1 = ze("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const h1 = ze("CircleDot", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v1 = ze("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const m1 = ze("Command", [
  [
    "path",
    { d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3", key: "11bfej" }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rm = ze("FileInput", [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M2 15h10", key: "jfw4w8" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rs = ze("FilePenLine", [
  [
    "path",
    {
      d: "m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2",
      key: "142zxg"
    }
  ],
  [
    "path",
    {
      d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
      key: "2t3380"
    }
  ],
  ["path", { d: "M8 18h1", key: "13wk12" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const y1 = ze("History", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g1 = ze("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cm = ze("LibraryBig", [
  ["rect", { width: "8", height: "18", x: "3", y: "3", rx: "1", key: "oynpb5" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  [
    "path",
    {
      d: "M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z",
      key: "1qboyk"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mm = ze("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dm = ze("Map", [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const p1 = ze("PanelLeftClose", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m16 15-3-3 3-3", key: "14y99z" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b1 = ze("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x1 = ze("ScanLine", [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }],
  ["path", { d: "M7 12h10", key: "b7w52i" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ko = ze("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S1 = ze("Settings2", [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nm = ze("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zm = ze("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _m = ze("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), E1 = [
  ["studio", "Policy Studio", rs],
  ["data", "Data dashboard", Dm],
  ["library", "Legal library", Cm],
  ["activity", "Activity", y1]
];
function A1() {
  return /* @__PURE__ */ p.jsxs(e1, { delayDuration: 450, children: [
    /* @__PURE__ */ p.jsxs("div", { className: "sidebar-brand", children: [
      /* @__PURE__ */ p.jsxs("a", { className: "brand", href: "/", "aria-label": "RuleLab, home page", children: [
        /* @__PURE__ */ p.jsx("span", { className: "brand-icon", "aria-hidden": "true" }),
        /* @__PURE__ */ p.jsxs("div", { className: "brand-copy", children: [
          /* @__PURE__ */ p.jsx("span", { className: "brand-name", children: "RuleLab" }),
          /* @__PURE__ */ p.jsx("span", { className: "brand-edition", children: "INDONESIA" })
        ] })
      ] }),
      /* @__PURE__ */ p.jsx("button", { id: "sidebar-toggle", className: "sidebar-toggle", "data-ux": "sidebar", "aria-controls": "workspace-sidebar", "aria-expanded": "true", "aria-label": "Collapse sidebar", children: /* @__PURE__ */ p.jsx(p1, { size: 17, "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ p.jsx("div", { className: "nav-label", children: "WORKSPACE" }),
    /* @__PURE__ */ p.jsxs("button", { className: "workspace-home-link", "data-view": "home", "aria-label": "Workspace overview", children: [
      /* @__PURE__ */ p.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ p.jsx(g1, { size: 17, "aria-hidden": "true" }) }),
      /* @__PURE__ */ p.jsx("span", { className: "home-label", children: "Overview" })
    ] }),
    /* @__PURE__ */ p.jsx("nav", { id: "nav", "aria-label": "Main navigation", children: E1.map(([a, r, o], c) => /* @__PURE__ */ p.jsxs("div", { className: c === 1 ? "nav-section-start" : "nav-item", children: [
      c === 1 && /* @__PURE__ */ p.jsx("div", { className: "nav-label", children: "SOURCES & ACTIVITY" }),
      /* @__PURE__ */ p.jsxs(t1, { children: [
        /* @__PURE__ */ p.jsx(n1, { asChild: !0, children: /* @__PURE__ */ p.jsxs("button", { "data-view": a, "aria-label": r, children: [
          /* @__PURE__ */ p.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ p.jsx(o, { size: 17 }) }),
          /* @__PURE__ */ p.jsx("span", { className: "nav-title", children: r })
        ] }) }),
        /* @__PURE__ */ p.jsx(l1, { children: /* @__PURE__ */ p.jsxs(a1, { className: "fx-tooltip", side: "right", sideOffset: 12, children: [
          r,
          /* @__PURE__ */ p.jsx(i1, {})
        ] }) })
      ] })
    ] }, a)) }),
    /* @__PURE__ */ p.jsxs("div", { className: "sidebar-bottom", children: [
      /* @__PURE__ */ p.jsx("div", { className: "nav-label", children: "RESOURCES & SYSTEM" }),
      /* @__PURE__ */ p.jsxs("a", { className: "settings-link", href: "/guide", target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ p.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ p.jsx(Cm, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ p.jsx("span", { className: "settings-label", children: "User guide" })
      ] }),
      /* @__PURE__ */ p.jsxs("button", { className: "settings-link", "data-action": "audit", "aria-label": "Audit workspace", children: [
        /* @__PURE__ */ p.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ p.jsx(x1, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ p.jsx("span", { className: "settings-label", children: "Audit workspace" })
      ] }),
      /* @__PURE__ */ p.jsxs("button", { id: "settings-btn", className: "settings-link", "aria-label": "Integration settings", children: [
        /* @__PURE__ */ p.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ p.jsx(S1, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ p.jsx("span", { className: "settings-label", children: "Integration settings" })
      ] })
    ] })
  ] });
}
var Oo = "focusScope.autoFocusOnMount", Ro = "focusScope.autoFocusOnUnmount", Sv = { bubbles: !1, cancelable: !0 }, w1 = "FocusScope", jm = E.forwardRef((a, r) => {
  const {
    loop: o = !1,
    trapped: c = !1,
    onMountAutoFocus: f,
    onUnmountAutoFocus: d,
    ...h
  } = a, [g, y] = E.useState(null), m = Vn(f), x = Vn(d), T = E.useRef(null), D = Ht(r, (O) => y(O)), M = E.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  E.useEffect(() => {
    if (c) {
      let O = function(Z) {
        if (M.paused || !g) return;
        const Q = Z.target;
        g.contains(Q) ? T.current = Q : Xn(T.current, { select: !0 });
      }, _ = function(Z) {
        if (M.paused || !g) return;
        const Q = Z.relatedTarget;
        Q !== null && (g.contains(Q) || Xn(T.current, { select: !0 }));
      }, H = function(Z) {
        if (document.activeElement === document.body)
          for (const V of Z)
            V.removedNodes.length > 0 && Xn(g);
      };
      document.addEventListener("focusin", O), document.addEventListener("focusout", _);
      const G = new MutationObserver(H);
      return g && G.observe(g, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", O), document.removeEventListener("focusout", _), G.disconnect();
      };
    }
  }, [c, g, M.paused]), E.useEffect(() => {
    if (g) {
      Av.add(M);
      const O = document.activeElement;
      if (!g.contains(O)) {
        const H = new CustomEvent(Oo, Sv);
        g.addEventListener(Oo, m), g.dispatchEvent(H), H.defaultPrevented || (T1(D1(Um(g)), { select: !0 }), document.activeElement === O && Xn(g));
      }
      return () => {
        g.removeEventListener(Oo, m), setTimeout(() => {
          const H = new CustomEvent(Ro, Sv);
          g.addEventListener(Ro, x), g.dispatchEvent(H), H.defaultPrevented || Xn(O ?? document.body, { select: !0 }), g.removeEventListener(Ro, x), Av.remove(M);
        }, 0);
      };
    }
  }, [g, m, x, M]);
  const R = E.useCallback(
    (O) => {
      if (!o && !c || M.paused) return;
      const _ = O.key === "Tab" && !O.altKey && !O.ctrlKey && !O.metaKey, H = document.activeElement;
      if (_ && H) {
        const G = O.currentTarget, [Z, Q] = O1(G);
        Z && Q ? !O.shiftKey && H === Q ? (O.preventDefault(), o && Xn(Z, { select: !0 })) : O.shiftKey && H === Z && (O.preventDefault(), o && Xn(Q, { select: !0 })) : H === G && O.preventDefault();
      }
    },
    [o, c, M.paused]
  );
  return /* @__PURE__ */ p.jsx(ft.div, { tabIndex: -1, ...h, ref: D, onKeyDown: R });
});
jm.displayName = w1;
function T1(a, { select: r = !1 } = {}) {
  const o = document.activeElement;
  for (const c of a)
    if (Xn(c, { select: r }), document.activeElement !== o) return;
}
function O1(a) {
  const r = Um(a), o = Ev(r, a), c = Ev(r.reverse(), a);
  return [o, c];
}
function Um(a) {
  const r = [], o = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (c) => {
      const f = c.tagName === "INPUT" && c.type === "hidden";
      return c.disabled || c.hidden || f ? NodeFilter.FILTER_SKIP : c.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; o.nextNode(); ) r.push(o.currentNode);
  return r;
}
function Ev(a, r) {
  for (const o of a)
    if (!R1(o, { upTo: r })) return o;
}
function R1(a, { upTo: r }) {
  if (getComputedStyle(a).visibility === "hidden") return !0;
  for (; a; ) {
    if (r !== void 0 && a === r) return !1;
    if (getComputedStyle(a).display === "none") return !0;
    a = a.parentElement;
  }
  return !1;
}
function C1(a) {
  return a instanceof HTMLInputElement && "select" in a;
}
function Xn(a, { select: r = !1 } = {}) {
  if (a && a.focus) {
    const o = document.activeElement;
    a.focus({ preventScroll: !0 }), a !== o && C1(a) && r && a.select();
  }
}
var Av = M1();
function M1() {
  let a = [];
  return {
    add(r) {
      const o = a[0];
      r !== o && (o == null || o.pause()), a = wv(a, r), a.unshift(r);
    },
    remove(r) {
      var o;
      a = wv(a, r), (o = a[0]) == null || o.resume();
    }
  };
}
function wv(a, r) {
  const o = [...a], c = o.indexOf(r);
  return c !== -1 && o.splice(c, 1), o;
}
function D1(a) {
  return a.filter((r) => r.tagName !== "A");
}
var Co = 0;
function N1() {
  E.useEffect(() => {
    const a = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", a[0] ?? Tv()), document.body.insertAdjacentElement("beforeend", a[1] ?? Tv()), Co++, () => {
      Co === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((r) => r.remove()), Co--;
    };
  }, []);
}
function Tv() {
  const a = document.createElement("span");
  return a.setAttribute("data-radix-focus-guard", ""), a.tabIndex = 0, a.style.outline = "none", a.style.opacity = "0", a.style.position = "fixed", a.style.pointerEvents = "none", a;
}
var Vt = function() {
  return Vt = Object.assign || function(r) {
    for (var o, c = 1, f = arguments.length; c < f; c++) {
      o = arguments[c];
      for (var d in o) Object.prototype.hasOwnProperty.call(o, d) && (r[d] = o[d]);
    }
    return r;
  }, Vt.apply(this, arguments);
};
function Hm(a, r) {
  var o = {};
  for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && r.indexOf(c) < 0 && (o[c] = a[c]);
  if (a != null && typeof Object.getOwnPropertySymbols == "function")
    for (var f = 0, c = Object.getOwnPropertySymbols(a); f < c.length; f++)
      r.indexOf(c[f]) < 0 && Object.prototype.propertyIsEnumerable.call(a, c[f]) && (o[c[f]] = a[c[f]]);
  return o;
}
function z1(a, r, o) {
  if (o || arguments.length === 2) for (var c = 0, f = r.length, d; c < f; c++)
    (d || !(c in r)) && (d || (d = Array.prototype.slice.call(r, 0, c)), d[c] = r[c]);
  return a.concat(d || Array.prototype.slice.call(r));
}
var Vu = "right-scroll-bar-position", Qu = "width-before-scroll-bar", _1 = "with-scroll-bars-hidden", j1 = "--removed-body-scroll-bar-size";
function Mo(a, r) {
  return typeof a == "function" ? a(r) : a && (a.current = r), a;
}
function U1(a, r) {
  var o = E.useState(function() {
    return {
      // value
      value: a,
      // last callback
      callback: r,
      // "memoized" public interface
      facade: {
        get current() {
          return o.value;
        },
        set current(c) {
          var f = o.value;
          f !== c && (o.value = c, o.callback(c, f));
        }
      }
    };
  })[0];
  return o.callback = r, o.facade;
}
var H1 = typeof window < "u" ? E.useLayoutEffect : E.useEffect, Ov = /* @__PURE__ */ new WeakMap();
function L1(a, r) {
  var o = U1(null, function(c) {
    return a.forEach(function(f) {
      return Mo(f, c);
    });
  });
  return H1(function() {
    var c = Ov.get(o);
    if (c) {
      var f = new Set(c), d = new Set(a), h = o.current;
      f.forEach(function(g) {
        d.has(g) || Mo(g, null);
      }), d.forEach(function(g) {
        f.has(g) || Mo(g, h);
      });
    }
    Ov.set(o, a);
  }, [a]), o;
}
function B1(a) {
  return a;
}
function q1(a, r) {
  r === void 0 && (r = B1);
  var o = [], c = !1, f = {
    read: function() {
      if (c)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return o.length ? o[o.length - 1] : a;
    },
    useMedium: function(d) {
      var h = r(d, c);
      return o.push(h), function() {
        o = o.filter(function(g) {
          return g !== h;
        });
      };
    },
    assignSyncMedium: function(d) {
      for (c = !0; o.length; ) {
        var h = o;
        o = [], h.forEach(d);
      }
      o = {
        push: function(g) {
          return d(g);
        },
        filter: function() {
          return o;
        }
      };
    },
    assignMedium: function(d) {
      c = !0;
      var h = [];
      if (o.length) {
        var g = o;
        o = [], g.forEach(d), h = o;
      }
      var y = function() {
        var x = h;
        h = [], x.forEach(d);
      }, m = function() {
        return Promise.resolve().then(y);
      };
      m(), o = {
        push: function(x) {
          h.push(x), m();
        },
        filter: function(x) {
          return h = h.filter(x), o;
        }
      };
    }
  };
  return f;
}
function Y1(a) {
  a === void 0 && (a = {});
  var r = q1(null);
  return r.options = Vt({ async: !0, ssr: !1 }, a), r;
}
var Lm = function(a) {
  var r = a.sideCar, o = Hm(a, ["sideCar"]);
  if (!r)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var c = r.read();
  if (!c)
    throw new Error("Sidecar medium not found");
  return E.createElement(c, Vt({}, o));
};
Lm.isSideCarExport = !0;
function G1(a, r) {
  return a.useMedium(r), Lm;
}
var Bm = Y1(), Do = function() {
}, cr = E.forwardRef(function(a, r) {
  var o = E.useRef(null), c = E.useState({
    onScrollCapture: Do,
    onWheelCapture: Do,
    onTouchMoveCapture: Do
  }), f = c[0], d = c[1], h = a.forwardProps, g = a.children, y = a.className, m = a.removeScrollBar, x = a.enabled, T = a.shards, D = a.sideCar, M = a.noRelative, R = a.noIsolation, O = a.inert, _ = a.allowPinchZoom, H = a.as, G = H === void 0 ? "div" : H, Z = a.gapMode, Q = Hm(a, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), V = D, L = L1([o, r]), K = Vt(Vt({}, Q), f);
  return E.createElement(
    E.Fragment,
    null,
    x && E.createElement(V, { sideCar: Bm, removeScrollBar: m, shards: T, noRelative: M, noIsolation: R, inert: O, setCallbacks: d, allowPinchZoom: !!_, lockRef: o, gapMode: Z }),
    h ? E.cloneElement(E.Children.only(g), Vt(Vt({}, K), { ref: L })) : E.createElement(G, Vt({}, K, { className: y, ref: L }), g)
  );
});
cr.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
cr.classNames = {
  fullWidth: Qu,
  zeroRight: Vu
};
var k1 = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function X1() {
  if (!document)
    return null;
  var a = document.createElement("style");
  a.type = "text/css";
  var r = k1();
  return r && a.setAttribute("nonce", r), a;
}
function V1(a, r) {
  a.styleSheet ? a.styleSheet.cssText = r : a.appendChild(document.createTextNode(r));
}
function Q1(a) {
  var r = document.head || document.getElementsByTagName("head")[0];
  r.appendChild(a);
}
var Z1 = function() {
  var a = 0, r = null;
  return {
    add: function(o) {
      a == 0 && (r = X1()) && (V1(r, o), Q1(r)), a++;
    },
    remove: function() {
      a--, !a && r && (r.parentNode && r.parentNode.removeChild(r), r = null);
    }
  };
}, K1 = function() {
  var a = Z1();
  return function(r, o) {
    E.useEffect(function() {
      return a.add(r), function() {
        a.remove();
      };
    }, [r && o]);
  };
}, qm = function() {
  var a = K1(), r = function(o) {
    var c = o.styles, f = o.dynamic;
    return a(c, f), null;
  };
  return r;
}, J1 = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, No = function(a) {
  return parseInt(a || "", 10) || 0;
}, W1 = function(a) {
  var r = window.getComputedStyle(document.body), o = r[a === "padding" ? "paddingLeft" : "marginLeft"], c = r[a === "padding" ? "paddingTop" : "marginTop"], f = r[a === "padding" ? "paddingRight" : "marginRight"];
  return [No(o), No(c), No(f)];
}, $1 = function(a) {
  if (a === void 0 && (a = "margin"), typeof window > "u")
    return J1;
  var r = W1(a), o = document.documentElement.clientWidth, c = window.innerWidth;
  return {
    left: r[0],
    top: r[1],
    right: r[2],
    gap: Math.max(0, c - o + r[2] - r[0])
  };
}, F1 = qm(), va = "data-scroll-locked", P1 = function(a, r, o, c) {
  var f = a.left, d = a.top, h = a.right, g = a.gap;
  return o === void 0 && (o = "margin"), `
  .`.concat(_1, ` {
   overflow: hidden `).concat(c, `;
   padding-right: `).concat(g, "px ").concat(c, `;
  }
  body[`).concat(va, `] {
    overflow: hidden `).concat(c, `;
    overscroll-behavior: contain;
    `).concat([
    r && "position: relative ".concat(c, ";"),
    o === "margin" && `
    padding-left: `.concat(f, `px;
    padding-top: `).concat(d, `px;
    padding-right: `).concat(h, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(g, "px ").concat(c, `;
    `),
    o === "padding" && "padding-right: ".concat(g, "px ").concat(c, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Vu, ` {
    right: `).concat(g, "px ").concat(c, `;
  }
  
  .`).concat(Qu, ` {
    margin-right: `).concat(g, "px ").concat(c, `;
  }
  
  .`).concat(Vu, " .").concat(Vu, ` {
    right: 0 `).concat(c, `;
  }
  
  .`).concat(Qu, " .").concat(Qu, ` {
    margin-right: 0 `).concat(c, `;
  }
  
  body[`).concat(va, `] {
    `).concat(j1, ": ").concat(g, `px;
  }
`);
}, Rv = function() {
  var a = parseInt(document.body.getAttribute(va) || "0", 10);
  return isFinite(a) ? a : 0;
}, I1 = function() {
  E.useEffect(function() {
    return document.body.setAttribute(va, (Rv() + 1).toString()), function() {
      var a = Rv() - 1;
      a <= 0 ? document.body.removeAttribute(va) : document.body.setAttribute(va, a.toString());
    };
  }, []);
}, ex = function(a) {
  var r = a.noRelative, o = a.noImportant, c = a.gapMode, f = c === void 0 ? "margin" : c;
  I1();
  var d = E.useMemo(function() {
    return $1(f);
  }, [f]);
  return E.createElement(F1, { styles: P1(d, !r, f, o ? "" : "!important") });
}, Xo = !1;
if (typeof window < "u")
  try {
    var Lu = Object.defineProperty({}, "passive", {
      get: function() {
        return Xo = !0, !0;
      }
    });
    window.addEventListener("test", Lu, Lu), window.removeEventListener("test", Lu, Lu);
  } catch {
    Xo = !1;
  }
var ca = Xo ? { passive: !1 } : !1, tx = function(a) {
  return a.tagName === "TEXTAREA";
}, Ym = function(a, r) {
  if (!(a instanceof Element))
    return !1;
  var o = window.getComputedStyle(a);
  return (
    // not-not-scrollable
    o[r] !== "hidden" && // contains scroll inside self
    !(o.overflowY === o.overflowX && !tx(a) && o[r] === "visible")
  );
}, nx = function(a) {
  return Ym(a, "overflowY");
}, lx = function(a) {
  return Ym(a, "overflowX");
}, Cv = function(a, r) {
  var o = r.ownerDocument, c = r;
  do {
    typeof ShadowRoot < "u" && c instanceof ShadowRoot && (c = c.host);
    var f = Gm(a, c);
    if (f) {
      var d = km(a, c), h = d[1], g = d[2];
      if (h > g)
        return !0;
    }
    c = c.parentNode;
  } while (c && c !== o.body);
  return !1;
}, ax = function(a) {
  var r = a.scrollTop, o = a.scrollHeight, c = a.clientHeight;
  return [
    r,
    o,
    c
  ];
}, ix = function(a) {
  var r = a.scrollLeft, o = a.scrollWidth, c = a.clientWidth;
  return [
    r,
    o,
    c
  ];
}, Gm = function(a, r) {
  return a === "v" ? nx(r) : lx(r);
}, km = function(a, r) {
  return a === "v" ? ax(r) : ix(r);
}, ux = function(a, r) {
  return a === "h" && r === "rtl" ? -1 : 1;
}, rx = function(a, r, o, c, f) {
  var d = ux(a, window.getComputedStyle(r).direction), h = d * c, g = o.target, y = r.contains(g), m = !1, x = h > 0, T = 0, D = 0;
  do {
    if (!g)
      break;
    var M = km(a, g), R = M[0], O = M[1], _ = M[2], H = O - _ - d * R;
    (R || H) && Gm(a, g) && (T += H, D += R);
    var G = g.parentNode;
    g = G && G.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? G.host : G;
  } while (
    // portaled content
    !y && g !== document.body || // self content
    y && (r.contains(g) || r === g)
  );
  return (x && Math.abs(T) < 1 || !x && Math.abs(D) < 1) && (m = !0), m;
}, Bu = function(a) {
  return "changedTouches" in a ? [a.changedTouches[0].clientX, a.changedTouches[0].clientY] : [0, 0];
}, Mv = function(a) {
  return [a.deltaX, a.deltaY];
}, Dv = function(a) {
  return a && "current" in a ? a.current : a;
}, cx = function(a, r) {
  return a[0] === r[0] && a[1] === r[1];
}, ox = function(a) {
  return `
  .block-interactivity-`.concat(a, ` {pointer-events: none;}
  .allow-interactivity-`).concat(a, ` {pointer-events: all;}
`);
}, sx = 0, oa = [];
function fx(a) {
  var r = E.useRef([]), o = E.useRef([0, 0]), c = E.useRef(), f = E.useState(sx++)[0], d = E.useState(qm)[0], h = E.useRef(a);
  E.useEffect(function() {
    h.current = a;
  }, [a]), E.useEffect(function() {
    if (a.inert) {
      document.body.classList.add("block-interactivity-".concat(f));
      var O = z1([a.lockRef.current], (a.shards || []).map(Dv), !0).filter(Boolean);
      return O.forEach(function(_) {
        return _.classList.add("allow-interactivity-".concat(f));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(f)), O.forEach(function(_) {
          return _.classList.remove("allow-interactivity-".concat(f));
        });
      };
    }
  }, [a.inert, a.lockRef.current, a.shards]);
  var g = E.useCallback(function(O, _) {
    if ("touches" in O && O.touches.length === 2 || O.type === "wheel" && O.ctrlKey)
      return !h.current.allowPinchZoom;
    var H = Bu(O), G = o.current, Z = "deltaX" in O ? O.deltaX : G[0] - H[0], Q = "deltaY" in O ? O.deltaY : G[1] - H[1], V, L = O.target, K = Math.abs(Z) > Math.abs(Q) ? "h" : "v";
    if ("touches" in O && K === "h" && L.type === "range")
      return !1;
    var oe = window.getSelection(), J = oe && oe.anchorNode, $ = J ? J === L || J.contains(L) : !1;
    if ($)
      return !1;
    var Se = Cv(K, L);
    if (!Se)
      return !0;
    if (Se ? V = K : (V = K === "v" ? "h" : "v", Se = Cv(K, L)), !Se)
      return !1;
    if (!c.current && "changedTouches" in O && (Z || Q) && (c.current = V), !V)
      return !0;
    var Re = c.current || V;
    return rx(Re, _, O, Re === "h" ? Z : Q);
  }, []), y = E.useCallback(function(O) {
    var _ = O;
    if (!(!oa.length || oa[oa.length - 1] !== d)) {
      var H = "deltaY" in _ ? Mv(_) : Bu(_), G = r.current.filter(function(V) {
        return V.name === _.type && (V.target === _.target || _.target === V.shadowParent) && cx(V.delta, H);
      })[0];
      if (G && G.should) {
        _.cancelable && _.preventDefault();
        return;
      }
      if (!G) {
        var Z = (h.current.shards || []).map(Dv).filter(Boolean).filter(function(V) {
          return V.contains(_.target);
        }), Q = Z.length > 0 ? g(_, Z[0]) : !h.current.noIsolation;
        Q && _.cancelable && _.preventDefault();
      }
    }
  }, []), m = E.useCallback(function(O, _, H, G) {
    var Z = { name: O, delta: _, target: H, should: G, shadowParent: dx(H) };
    r.current.push(Z), setTimeout(function() {
      r.current = r.current.filter(function(Q) {
        return Q !== Z;
      });
    }, 1);
  }, []), x = E.useCallback(function(O) {
    o.current = Bu(O), c.current = void 0;
  }, []), T = E.useCallback(function(O) {
    m(O.type, Mv(O), O.target, g(O, a.lockRef.current));
  }, []), D = E.useCallback(function(O) {
    m(O.type, Bu(O), O.target, g(O, a.lockRef.current));
  }, []);
  E.useEffect(function() {
    return oa.push(d), a.setCallbacks({
      onScrollCapture: T,
      onWheelCapture: T,
      onTouchMoveCapture: D
    }), document.addEventListener("wheel", y, ca), document.addEventListener("touchmove", y, ca), document.addEventListener("touchstart", x, ca), function() {
      oa = oa.filter(function(O) {
        return O !== d;
      }), document.removeEventListener("wheel", y, ca), document.removeEventListener("touchmove", y, ca), document.removeEventListener("touchstart", x, ca);
    };
  }, []);
  var M = a.removeScrollBar, R = a.inert;
  return E.createElement(
    E.Fragment,
    null,
    R ? E.createElement(d, { styles: ox(f) }) : null,
    M ? E.createElement(ex, { noRelative: a.noRelative, gapMode: a.gapMode }) : null
  );
}
function dx(a) {
  for (var r = null; a !== null; )
    a instanceof ShadowRoot && (r = a.host, a = a.host), a = a.parentNode;
  return r;
}
const hx = G1(Bm, fx);
var Xm = E.forwardRef(function(a, r) {
  return E.createElement(cr, Vt({}, a, { ref: r, sideCar: hx }));
});
Xm.classNames = cr.classNames;
var vx = function(a) {
  if (typeof document > "u")
    return null;
  var r = Array.isArray(a) ? a[0] : a;
  return r.ownerDocument.body;
}, sa = /* @__PURE__ */ new WeakMap(), qu = /* @__PURE__ */ new WeakMap(), Yu = {}, zo = 0, Vm = function(a) {
  return a && (a.host || Vm(a.parentNode));
}, mx = function(a, r) {
  return r.map(function(o) {
    if (a.contains(o))
      return o;
    var c = Vm(o);
    return c && a.contains(c) ? c : (console.error("aria-hidden", o, "in not contained inside", a, ". Doing nothing"), null);
  }).filter(function(o) {
    return !!o;
  });
}, yx = function(a, r, o, c) {
  var f = mx(r, Array.isArray(a) ? a : [a]);
  Yu[o] || (Yu[o] = /* @__PURE__ */ new WeakMap());
  var d = Yu[o], h = [], g = /* @__PURE__ */ new Set(), y = new Set(f), m = function(T) {
    !T || g.has(T) || (g.add(T), m(T.parentNode));
  };
  f.forEach(m);
  var x = function(T) {
    !T || y.has(T) || Array.prototype.forEach.call(T.children, function(D) {
      if (g.has(D))
        x(D);
      else
        try {
          var M = D.getAttribute(c), R = M !== null && M !== "false", O = (sa.get(D) || 0) + 1, _ = (d.get(D) || 0) + 1;
          sa.set(D, O), d.set(D, _), h.push(D), O === 1 && R && qu.set(D, !0), _ === 1 && D.setAttribute(o, "true"), R || D.setAttribute(c, "true");
        } catch (H) {
          console.error("aria-hidden: cannot operate on ", D, H);
        }
    });
  };
  return x(r), g.clear(), zo++, function() {
    h.forEach(function(T) {
      var D = sa.get(T) - 1, M = d.get(T) - 1;
      sa.set(T, D), d.set(T, M), D || (qu.has(T) || T.removeAttribute(c), qu.delete(T)), M || T.removeAttribute(o);
    }), zo--, zo || (sa = /* @__PURE__ */ new WeakMap(), sa = /* @__PURE__ */ new WeakMap(), qu = /* @__PURE__ */ new WeakMap(), Yu = {});
  };
}, gx = function(a, r, o) {
  o === void 0 && (o = "data-aria-hidden");
  var c = Array.from(Array.isArray(a) ? a : [a]), f = vx(a);
  return f ? (c.push.apply(c, Array.from(f.querySelectorAll("[aria-live], script"))), yx(c, f, o, "aria-hidden")) : function() {
    return null;
  };
}, cs = "Dialog", [Qm] = Jo(cs), [px, Lt] = Qm(cs), Zm = (a) => {
  const {
    __scopeDialog: r,
    children: o,
    open: c,
    defaultOpen: f,
    onOpenChange: d,
    modal: h = !0
  } = a, g = E.useRef(null), y = E.useRef(null), [m = !1, x] = vm({
    prop: c,
    defaultProp: f,
    onChange: d
  });
  return /* @__PURE__ */ p.jsx(
    px,
    {
      scope: r,
      triggerRef: g,
      contentRef: y,
      contentId: ku(),
      titleId: ku(),
      descriptionId: ku(),
      open: m,
      onOpenChange: x,
      onOpenToggle: E.useCallback(() => x((T) => !T), [x]),
      modal: h,
      children: o
    }
  );
};
Zm.displayName = cs;
var Km = "DialogTrigger", Jm = E.forwardRef(
  (a, r) => {
    const { __scopeDialog: o, ...c } = a, f = Lt(Km, o), d = Ht(r, f.triggerRef);
    return /* @__PURE__ */ p.jsx(
      ft.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": f.open,
        "aria-controls": f.contentId,
        "data-state": fs(f.open),
        ...c,
        ref: d,
        onClick: ot(a.onClick, f.onOpenToggle)
      }
    );
  }
);
Jm.displayName = Km;
var os = "DialogPortal", [bx, Wm] = Qm(os, {
  forceMount: void 0
}), $m = (a) => {
  const { __scopeDialog: r, forceMount: o, children: c, container: f } = a, d = Lt(os, r);
  return /* @__PURE__ */ p.jsx(bx, { scope: r, forceMount: o, children: E.Children.map(c, (h) => /* @__PURE__ */ p.jsx(pa, { present: o || d.open, children: /* @__PURE__ */ p.jsx(as, { asChild: !0, container: f, children: h }) })) });
};
$m.displayName = os;
var Fu = "DialogOverlay", Fm = E.forwardRef(
  (a, r) => {
    const o = Wm(Fu, a.__scopeDialog), { forceMount: c = o.forceMount, ...f } = a, d = Lt(Fu, a.__scopeDialog);
    return d.modal ? /* @__PURE__ */ p.jsx(pa, { present: c || d.open, children: /* @__PURE__ */ p.jsx(xx, { ...f, ref: r }) }) : null;
  }
);
Fm.displayName = Fu;
var xx = E.forwardRef(
  (a, r) => {
    const { __scopeDialog: o, ...c } = a, f = Lt(Fu, o);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ p.jsx(Xm, { as: Iu, allowPinchZoom: !0, shards: [f.contentRef], children: /* @__PURE__ */ p.jsx(
        ft.div,
        {
          "data-state": fs(f.open),
          ...c,
          ref: r,
          style: { pointerEvents: "auto", ...c.style }
        }
      ) })
    );
  }
), wl = "DialogContent", Pm = E.forwardRef(
  (a, r) => {
    const o = Wm(wl, a.__scopeDialog), { forceMount: c = o.forceMount, ...f } = a, d = Lt(wl, a.__scopeDialog);
    return /* @__PURE__ */ p.jsx(pa, { present: c || d.open, children: d.modal ? /* @__PURE__ */ p.jsx(Sx, { ...f, ref: r }) : /* @__PURE__ */ p.jsx(Ex, { ...f, ref: r }) });
  }
);
Pm.displayName = wl;
var Sx = E.forwardRef(
  (a, r) => {
    const o = Lt(wl, a.__scopeDialog), c = E.useRef(null), f = Ht(r, o.contentRef, c);
    return E.useEffect(() => {
      const d = c.current;
      if (d) return gx(d);
    }, []), /* @__PURE__ */ p.jsx(
      Im,
      {
        ...a,
        ref: f,
        trapFocus: o.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ot(a.onCloseAutoFocus, (d) => {
          var h;
          d.preventDefault(), (h = o.triggerRef.current) == null || h.focus();
        }),
        onPointerDownOutside: ot(a.onPointerDownOutside, (d) => {
          const h = d.detail.originalEvent, g = h.button === 0 && h.ctrlKey === !0;
          (h.button === 2 || g) && d.preventDefault();
        }),
        onFocusOutside: ot(
          a.onFocusOutside,
          (d) => d.preventDefault()
        )
      }
    );
  }
), Ex = E.forwardRef(
  (a, r) => {
    const o = Lt(wl, a.__scopeDialog), c = E.useRef(!1), f = E.useRef(!1);
    return /* @__PURE__ */ p.jsx(
      Im,
      {
        ...a,
        ref: r,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (d) => {
          var h, g;
          (h = a.onCloseAutoFocus) == null || h.call(a, d), d.defaultPrevented || (c.current || (g = o.triggerRef.current) == null || g.focus(), d.preventDefault()), c.current = !1, f.current = !1;
        },
        onInteractOutside: (d) => {
          var y, m;
          (y = a.onInteractOutside) == null || y.call(a, d), d.defaultPrevented || (c.current = !0, d.detail.originalEvent.type === "pointerdown" && (f.current = !0));
          const h = d.target;
          ((m = o.triggerRef.current) == null ? void 0 : m.contains(h)) && d.preventDefault(), d.detail.originalEvent.type === "focusin" && f.current && d.preventDefault();
        }
      }
    );
  }
), Im = E.forwardRef(
  (a, r) => {
    const { __scopeDialog: o, trapFocus: c, onOpenAutoFocus: f, onCloseAutoFocus: d, ...h } = a, g = Lt(wl, o), y = E.useRef(null), m = Ht(r, y);
    return N1(), /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
      /* @__PURE__ */ p.jsx(
        jm,
        {
          asChild: !0,
          loop: !0,
          trapped: c,
          onMountAutoFocus: f,
          onUnmountAutoFocus: d,
          children: /* @__PURE__ */ p.jsx(
            Wo,
            {
              role: "dialog",
              id: g.contentId,
              "aria-describedby": g.descriptionId,
              "aria-labelledby": g.titleId,
              "data-state": fs(g.open),
              ...h,
              ref: m,
              onDismiss: () => g.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
        /* @__PURE__ */ p.jsx(Ax, { titleId: g.titleId }),
        /* @__PURE__ */ p.jsx(Tx, { contentRef: y, descriptionId: g.descriptionId })
      ] })
    ] });
  }
), ss = "DialogTitle", ey = E.forwardRef(
  (a, r) => {
    const { __scopeDialog: o, ...c } = a, f = Lt(ss, o);
    return /* @__PURE__ */ p.jsx(ft.h2, { id: f.titleId, ...c, ref: r });
  }
);
ey.displayName = ss;
var ty = "DialogDescription", ny = E.forwardRef(
  (a, r) => {
    const { __scopeDialog: o, ...c } = a, f = Lt(ty, o);
    return /* @__PURE__ */ p.jsx(ft.p, { id: f.descriptionId, ...c, ref: r });
  }
);
ny.displayName = ty;
var ly = "DialogClose", ay = E.forwardRef(
  (a, r) => {
    const { __scopeDialog: o, ...c } = a, f = Lt(ly, o);
    return /* @__PURE__ */ p.jsx(
      ft.button,
      {
        type: "button",
        ...c,
        ref: r,
        onClick: ot(a.onClick, () => f.onOpenChange(!1))
      }
    );
  }
);
ay.displayName = ly;
function fs(a) {
  return a ? "open" : "closed";
}
var iy = "DialogTitleWarning", [US, uy] = Pp(iy, {
  contentName: wl,
  titleName: ss,
  docsSlug: "dialog"
}), Ax = ({ titleId: a }) => {
  const r = uy(iy), o = `\`${r.contentName}\` requires a \`${r.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${r.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${r.docsSlug}`;
  return E.useEffect(() => {
    a && (document.getElementById(a) || console.error(o));
  }, [o, a]), null;
}, wx = "DialogDescriptionWarning", Tx = ({ contentRef: a, descriptionId: r }) => {
  const c = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${uy(wx).contentName}}.`;
  return E.useEffect(() => {
    var d;
    const f = (d = a.current) == null ? void 0 : d.getAttribute("aria-describedby");
    r && f && (document.getElementById(r) || console.warn(c));
  }, [c, a, r]), null;
}, Ox = Zm, Rx = Jm, Cx = $m, Mx = Fm, Dx = Pm, Nx = ey, zx = ny, _x = ay;
function ry(a) {
  var r, o, c = "";
  if (typeof a == "string" || typeof a == "number") c += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var f = a.length;
    for (r = 0; r < f; r++) a[r] && (o = ry(a[r])) && (c && (c += " "), c += o);
  } else for (o in a) a[o] && (c && (c += " "), c += o);
  return c;
}
function cy() {
  for (var a, r, o = 0, c = "", f = arguments.length; o < f; o++) (a = arguments[o]) && (r = ry(a)) && (c && (c += " "), c += r);
  return c;
}
const Nv = (a) => typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a, zv = cy, jx = (a, r) => (o) => {
  var c;
  if ((r == null ? void 0 : r.variants) == null) return zv(a, o == null ? void 0 : o.class, o == null ? void 0 : o.className);
  const { variants: f, defaultVariants: d } = r, h = Object.keys(f).map((m) => {
    const x = o == null ? void 0 : o[m], T = d == null ? void 0 : d[m];
    if (x === null) return null;
    const D = Nv(x) || Nv(T);
    return f[m][D];
  }), g = o && Object.entries(o).reduce((m, x) => {
    let [T, D] = x;
    return D === void 0 || (m[T] = D), m;
  }, {}), y = r == null || (c = r.compoundVariants) === null || c === void 0 ? void 0 : c.reduce((m, x) => {
    let { class: T, className: D, ...M } = x;
    return Object.entries(M).every((R) => {
      let [O, _] = R;
      return Array.isArray(_) ? _.includes({
        ...d,
        ...g
      }[O]) : {
        ...d,
        ...g
      }[O] === _;
    }) ? [
      ...m,
      T,
      D
    ] : m;
  }, []);
  return zv(a, h, y, o == null ? void 0 : o.class, o == null ? void 0 : o.className);
}, ds = "-", Ux = (a) => {
  const r = Lx(a), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: c
  } = a;
  return {
    getClassGroupId: (h) => {
      const g = h.split(ds);
      return g[0] === "" && g.length !== 1 && g.shift(), oy(g, r) || Hx(h);
    },
    getConflictingClassGroupIds: (h, g) => {
      const y = o[h] || [];
      return g && c[h] ? [...y, ...c[h]] : y;
    }
  };
}, oy = (a, r) => {
  var h;
  if (a.length === 0)
    return r.classGroupId;
  const o = a[0], c = r.nextPart.get(o), f = c ? oy(a.slice(1), c) : void 0;
  if (f)
    return f;
  if (r.validators.length === 0)
    return;
  const d = a.join(ds);
  return (h = r.validators.find(({
    validator: g
  }) => g(d))) == null ? void 0 : h.classGroupId;
}, _v = /^\[(.+)\]$/, Hx = (a) => {
  if (_v.test(a)) {
    const r = _v.exec(a)[1], o = r == null ? void 0 : r.substring(0, r.indexOf(":"));
    if (o)
      return "arbitrary.." + o;
  }
}, Lx = (a) => {
  const {
    theme: r,
    classGroups: o
  } = a, c = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const f in o)
    Vo(o[f], c, f, r);
  return c;
}, Vo = (a, r, o, c) => {
  a.forEach((f) => {
    if (typeof f == "string") {
      const d = f === "" ? r : jv(r, f);
      d.classGroupId = o;
      return;
    }
    if (typeof f == "function") {
      if (Bx(f)) {
        Vo(f(c), r, o, c);
        return;
      }
      r.validators.push({
        validator: f,
        classGroupId: o
      });
      return;
    }
    Object.entries(f).forEach(([d, h]) => {
      Vo(h, jv(r, d), o, c);
    });
  });
}, jv = (a, r) => {
  let o = a;
  return r.split(ds).forEach((c) => {
    o.nextPart.has(c) || o.nextPart.set(c, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), o = o.nextPart.get(c);
  }), o;
}, Bx = (a) => a.isThemeGetter, qx = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, o = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  const f = (d, h) => {
    o.set(d, h), r++, r > a && (r = 0, c = o, o = /* @__PURE__ */ new Map());
  };
  return {
    get(d) {
      let h = o.get(d);
      if (h !== void 0)
        return h;
      if ((h = c.get(d)) !== void 0)
        return f(d, h), h;
    },
    set(d, h) {
      o.has(d) ? o.set(d, h) : f(d, h);
    }
  };
}, Qo = "!", Zo = ":", Yx = Zo.length, Gx = (a) => {
  const {
    prefix: r,
    experimentalParseClassName: o
  } = a;
  let c = (f) => {
    const d = [];
    let h = 0, g = 0, y = 0, m;
    for (let R = 0; R < f.length; R++) {
      let O = f[R];
      if (h === 0 && g === 0) {
        if (O === Zo) {
          d.push(f.slice(y, R)), y = R + Yx;
          continue;
        }
        if (O === "/") {
          m = R;
          continue;
        }
      }
      O === "[" ? h++ : O === "]" ? h-- : O === "(" ? g++ : O === ")" && g--;
    }
    const x = d.length === 0 ? f : f.substring(y), T = kx(x), D = T !== x, M = m && m > y ? m - y : void 0;
    return {
      modifiers: d,
      hasImportantModifier: D,
      baseClassName: T,
      maybePostfixModifierPosition: M
    };
  };
  if (r) {
    const f = r + Zo, d = c;
    c = (h) => h.startsWith(f) ? d(h.substring(f.length)) : {
      isExternal: !0,
      modifiers: [],
      hasImportantModifier: !1,
      baseClassName: h,
      maybePostfixModifierPosition: void 0
    };
  }
  if (o) {
    const f = c;
    c = (d) => o({
      className: d,
      parseClassName: f
    });
  }
  return c;
}, kx = (a) => a.endsWith(Qo) ? a.substring(0, a.length - 1) : a.startsWith(Qo) ? a.substring(1) : a, Xx = (a) => {
  const r = Object.fromEntries(a.orderSensitiveModifiers.map((c) => [c, !0]));
  return (c) => {
    if (c.length <= 1)
      return c;
    const f = [];
    let d = [];
    return c.forEach((h) => {
      h[0] === "[" || r[h] ? (f.push(...d.sort(), h), d = []) : d.push(h);
    }), f.push(...d.sort()), f;
  };
}, Vx = (a) => ({
  cache: qx(a.cacheSize),
  parseClassName: Gx(a),
  sortModifiers: Xx(a),
  ...Ux(a)
}), Qx = /\s+/, Zx = (a, r) => {
  const {
    parseClassName: o,
    getClassGroupId: c,
    getConflictingClassGroupIds: f,
    sortModifiers: d
  } = r, h = [], g = a.trim().split(Qx);
  let y = "";
  for (let m = g.length - 1; m >= 0; m -= 1) {
    const x = g[m], {
      isExternal: T,
      modifiers: D,
      hasImportantModifier: M,
      baseClassName: R,
      maybePostfixModifierPosition: O
    } = o(x);
    if (T) {
      y = x + (y.length > 0 ? " " + y : y);
      continue;
    }
    let _ = !!O, H = c(_ ? R.substring(0, O) : R);
    if (!H) {
      if (!_) {
        y = x + (y.length > 0 ? " " + y : y);
        continue;
      }
      if (H = c(R), !H) {
        y = x + (y.length > 0 ? " " + y : y);
        continue;
      }
      _ = !1;
    }
    const G = d(D).join(":"), Z = M ? G + Qo : G, Q = Z + H;
    if (h.includes(Q))
      continue;
    h.push(Q);
    const V = f(H, _);
    for (let L = 0; L < V.length; ++L) {
      const K = V[L];
      h.push(Z + K);
    }
    y = x + (y.length > 0 ? " " + y : y);
  }
  return y;
};
function Kx() {
  let a = 0, r, o, c = "";
  for (; a < arguments.length; )
    (r = arguments[a++]) && (o = sy(r)) && (c && (c += " "), c += o);
  return c;
}
const sy = (a) => {
  if (typeof a == "string")
    return a;
  let r, o = "";
  for (let c = 0; c < a.length; c++)
    a[c] && (r = sy(a[c])) && (o && (o += " "), o += r);
  return o;
};
function Jx(a, ...r) {
  let o, c, f, d = h;
  function h(y) {
    const m = r.reduce((x, T) => T(x), a());
    return o = Vx(m), c = o.cache.get, f = o.cache.set, d = g, g(y);
  }
  function g(y) {
    const m = c(y);
    if (m)
      return m;
    const x = Zx(y, o);
    return f(y, x), x;
  }
  return function() {
    return d(Kx.apply(null, arguments));
  };
}
const $e = (a) => {
  const r = (o) => o[a] || [];
  return r.isThemeGetter = !0, r;
}, fy = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, dy = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Wx = /^\d+\/\d+$/, $x = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Fx = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Px = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, Ix = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, eS = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, fa = (a) => Wx.test(a), pe = (a) => !!a && !Number.isNaN(Number(a)), pl = (a) => !!a && Number.isInteger(Number(a)), Uv = (a) => a.endsWith("%") && pe(a.slice(0, -1)), kn = (a) => $x.test(a), tS = () => !0, nS = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Fx.test(a) && !Px.test(a)
), hs = () => !1, lS = (a) => Ix.test(a), aS = (a) => eS.test(a), iS = (a) => !P(a) && !I(a), uS = (a) => ba(a, my, hs), P = (a) => fy.test(a), bl = (a) => ba(a, yy, nS), _o = (a) => ba(a, gS, pe), rS = (a) => ba(a, hy, hs), cS = (a) => ba(a, vy, aS), oS = (a) => ba(a, hs, lS), I = (a) => dy.test(a), Gu = (a) => xa(a, yy), sS = (a) => xa(a, pS), fS = (a) => xa(a, hy), dS = (a) => xa(a, my), hS = (a) => xa(a, vy), vS = (a) => xa(a, bS, !0), ba = (a, r, o) => {
  const c = fy.exec(a);
  return c ? c[1] ? r(c[1]) : o(c[2]) : !1;
}, xa = (a, r, o = !1) => {
  const c = dy.exec(a);
  return c ? c[1] ? r(c[1]) : o : !1;
}, hy = (a) => a === "position", mS = /* @__PURE__ */ new Set(["image", "url"]), vy = (a) => mS.has(a), yS = /* @__PURE__ */ new Set(["length", "size", "percentage"]), my = (a) => yS.has(a), yy = (a) => a === "length", gS = (a) => a === "number", pS = (a) => a === "family-name", bS = (a) => a === "shadow", xS = () => {
  const a = $e("color"), r = $e("font"), o = $e("text"), c = $e("font-weight"), f = $e("tracking"), d = $e("leading"), h = $e("breakpoint"), g = $e("container"), y = $e("spacing"), m = $e("radius"), x = $e("shadow"), T = $e("inset-shadow"), D = $e("drop-shadow"), M = $e("blur"), R = $e("perspective"), O = $e("aspect"), _ = $e("ease"), H = $e("animate"), G = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], Z = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Q = () => ["auto", "hidden", "clip", "visible", "scroll"], V = () => ["auto", "contain", "none"], L = () => [I, P, y], K = () => [fa, "full", "auto", ...L()], oe = () => [pl, "none", "subgrid", I, P], J = () => ["auto", {
    span: ["full", pl, I, P]
  }, I, P], $ = () => [pl, "auto", I, P], Se = () => ["auto", "min", "max", "fr", I, P], Re = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline"], de = () => ["start", "end", "center", "stretch"], me = () => ["auto", ...L()], ge = () => [fa, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...L()], B = () => [a, I, P], ee = () => [Uv, bl], X = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    m,
    I,
    P
  ], ne = () => ["", pe, Gu, bl], S = () => ["solid", "dashed", "dotted", "double"], k = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ie = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    M,
    I,
    P
  ], le = () => ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", I, P], W = () => ["none", pe, I, P], se = () => ["none", pe, I, P], re = () => [pe, I, P], _e = () => [fa, "full", ...L()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [kn],
      breakpoint: [kn],
      color: [tS],
      container: [kn],
      "drop-shadow": [kn],
      ease: ["in", "out", "in-out"],
      font: [iS],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [kn],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [kn],
      shadow: [kn],
      spacing: ["px", pe],
      text: [kn],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", fa, P, I, O]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [pe, P, I, g]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": G()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": G()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...Z(), P, I]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: Q()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Q()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Q()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: V()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": V()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": V()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: K()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": K()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": K()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: K()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: K()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: K()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: K()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: K()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: K()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [pl, "auto", I, P]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [fa, "full", "auto", g, ...L()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [pe, fa, "auto", "initial", "none", P]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", pe, I, P]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", pe, I, P]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [pl, "first", "last", "none", I, P]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": oe()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: J()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": $()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": $()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": oe()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: J()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": $()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": $()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": Se()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Se()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: L()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": L()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": L()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...Re(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...de(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...de()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Re()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...de(), "baseline"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...de(), "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": Re()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...de(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...de()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: L()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: L()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: L()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: L()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: L()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: L()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: L()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: L()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: L()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: me()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: me()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: me()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: me()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: me()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: me()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: me()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: me()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: me()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": L()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": L()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: ge()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [g, "screen", ...ge()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          g,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...ge()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          g,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [h]
          },
          ...ge()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", ...ge()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "none", ...ge()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", ...ge()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", o, Gu, bl]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [c, I, _o]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Uv, P]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [sS, P, r]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [f, I, P]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [pe, "none", I, _o]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          d,
          ...L()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", I, P]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", I, P]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: B()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: B()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...S(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [pe, "from-font", "auto", I, bl]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: B()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [pe, "auto", I, P]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: L()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", I, P]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", I, P]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...Z(), fS, rS]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "space", "round"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", dS, uS]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, pl, I, P],
          radial: ["", I, P],
          conic: [pl, I, P]
        }, hS, cS]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: B()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: ee()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: ee()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: ee()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: B()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: B()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: B()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: X()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": X()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": X()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": X()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": X()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": X()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": X()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": X()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": X()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": X()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": X()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": X()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": X()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": X()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": X()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: ne()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": ne()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": ne()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": ne()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": ne()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": ne()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": ne()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": ne()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": ne()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": ne()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": ne()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...S(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...S(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: B()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": B()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": B()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": B()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": B()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": B()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": B()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": B()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": B()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: B()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...S(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [pe, I, P]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", pe, Gu, bl]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [a]
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          x,
          vS,
          oS
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: B()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", I, P, T]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": B()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: ne()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: B()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [pe, bl]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": B()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": ne()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": B()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [pe, I, P]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...k(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": k()
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          I,
          P
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: ie()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [pe, I, P]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [pe, I, P]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          D,
          I,
          P
        ]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", pe, I, P]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [pe, I, P]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", pe, I, P]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [pe, I, P]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", pe, I, P]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          I,
          P
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": ie()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [pe, I, P]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [pe, I, P]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", pe, I, P]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [pe, I, P]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", pe, I, P]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [pe, I, P]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [pe, I, P]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", pe, I, P]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": L()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": L()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": L()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", I, P]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [pe, "initial", I, P]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", _, I, P]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [pe, I, P]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", H, I, P]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [R, I, P]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": le()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: W()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": W()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": W()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": W()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: se()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": se()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": se()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": se()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: re()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": re()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": re()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [I, P, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: le()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: _e()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": _e()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": _e()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": _e()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: B()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: B()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", I, P]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": L()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": L()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": L()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": L()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": L()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": L()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": L()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": L()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": L()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": L()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": L()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": L()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": L()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": L()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": L()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": L()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": L()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": L()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", I, P]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...B()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [pe, Gu, bl, _o]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...B()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["before", "after", "placeholder", "file", "marker", "selection", "first-line", "first-letter", "backdrop", "*", "**"]
  };
}, SS = /* @__PURE__ */ Jx(xS), ES = (...a) => SS(cy(a)), AS = jx("fx-button inline-flex items-center justify-center gap-2 rounded-xl font-semibold", {
  variants: {
    variant: { primary: "fx-button-primary", secondary: "fx-button-secondary", ghost: "fx-button-ghost" },
    size: { default: "px-4 py-2.5 text-xs", icon: "size-9 p-2", small: "px-3 py-2 text-[11px]" }
  },
  defaultVariants: { variant: "secondary", size: "default" }
}), vs = E.forwardRef(
  ({ className: a, variant: r, size: o, asChild: c = !1, shimmer: f = !1, children: d, ...h }, g) => {
    const y = c ? Iu : "button";
    return /* @__PURE__ */ p.jsx(y, { ref: g, className: ES(AS({ variant: r, size: o }), f && "fx-shimmer", a), ...h, children: d });
  }
);
vs.displayName = "Button";
const wS = [
  ["home", "Workspace overview", "Start from the policy goal"],
  ["data", "Data dashboard", "Collection, regional map and the upload/JDIH source queue"],
  ["studio", "Policy Studio", "Draft documents, verify sources and test policy impact", "editor analysis review check conflict simulation forum public persona impact analisis pemeriksaan periksa konflik simulasi netizen dampak"],
  ["library", "Legal library", "Document gallery and regulation sources: search articles, read, ask and compare", "gallery library corpus documents galeri pustaka"],
  ["activity", "Activity", "Results, reviews, draft versions and agent runs", "history agent agents runs execution trace notes riwayat eksekusi catatan"]
];
function TS() {
  const [a, r] = E.useState(!1), [o, c] = E.useState(""), [f, d] = E.useState(0), h = wS.filter((y) => y.join(" ").toLowerCase().includes(o.toLowerCase())), g = (y) => {
    r(!1), requestAnimationFrame(() => {
      const m = document.querySelector('[data-view="' + y + '"]');
      if (y === "activity") {
        const D = /agen|agent|eksekusi|trace|proses/.test(o.toLowerCase()) ? "agents" : "results";
        m == null || m.dispatchEvent(new CustomEvent("rulelab:activity-route", { bubbles: !0, detail: { tab: D } }));
        return;
      }
      if (y !== "studio") {
        m == null || m.click();
        return;
      }
      const x = o.toLowerCase(), T = /simulasi|dampak|forum|netizen|persona/.test(x) ? "simulation" : /analisis|konflik|periksa|pemeriksaan|review/.test(x) ? "analysis" : /editor|rancang|naskah|susun/.test(x) ? "editor" : void 0;
      if (!T) {
        m == null || m.click();
        return;
      }
      m == null || m.dispatchEvent(new CustomEvent("rulelab:studio-route", { bubbles: !0, detail: { stage: T, sub: /forum|netizen|persona/.test(x) ? "social" : void 0 } }));
    });
  };
  return E.useEffect(() => {
    const y = (m) => {
      var x;
      (m.metaKey || m.ctrlKey) && m.key.toLowerCase() === "k" && !document.querySelector("dialog[open]") && !((x = document.querySelector("#main")) != null && x.inert) && (m.preventDefault(), r((T) => !T));
    };
    return document.addEventListener("keydown", y), () => document.removeEventListener("keydown", y);
  }, []), /* @__PURE__ */ p.jsxs(Ox, { open: a, onOpenChange: (y) => {
    r(y), y && (c(""), d(0));
  }, children: [
    /* @__PURE__ */ p.jsx(Rx, { asChild: !0, children: /* @__PURE__ */ p.jsxs(vs, { className: "fx-command-trigger", size: "small", "aria-label": "Quick navigation", onClick: (y) => {
      var m;
      (document.querySelector("dialog[open]") || (m = document.querySelector("#main")) != null && m.inert) && y.preventDefault();
    }, children: [
      /* @__PURE__ */ p.jsx(m1, { size: 14 }),
      /* @__PURE__ */ p.jsx("span", { children: "Quick menu" }),
      /* @__PURE__ */ p.jsx("kbd", { children: "⌘ K" })
    ] }) }),
    /* @__PURE__ */ p.jsxs(Cx, { children: [
      /* @__PURE__ */ p.jsx(Mx, { className: "fx-dialog-overlay" }),
      /* @__PURE__ */ p.jsxs(Dx, { className: "fx-command-content", onOpenAutoFocus: (y) => {
        var m;
        y.preventDefault(), (m = document.getElementById("framework-command-input")) == null || m.focus();
      }, children: [
        /* @__PURE__ */ p.jsx(Nx, { className: "fx-command-title", children: "Workspace navigation" }),
        /* @__PURE__ */ p.jsx(zx, { className: "fx-command-description", children: "Search the menu and continue your work. Changed drafts are saved before switching." }),
        /* @__PURE__ */ p.jsx(_x, { className: "fx-command-close", "aria-label": "Close quick menu", children: /* @__PURE__ */ p.jsx(_m, { size: 15 }) }),
        /* @__PURE__ */ p.jsxs("div", { className: "fx-command-search", children: [
          /* @__PURE__ */ p.jsx(ko, { size: 17 }),
          /* @__PURE__ */ p.jsx("input", { id: "framework-command-input", role: "combobox", "aria-controls": "framework-command-results", "aria-expanded": "true", "aria-autocomplete": "list", "aria-activedescendant": h[f] ? "framework-command-" + h[f][0] : void 0, "aria-label": "Search menu", autoComplete: "off", placeholder: "Search editor, simulation, sources…", value: o, onChange: (y) => {
            c(y.target.value), d(0);
          }, onKeyDown: (y) => {
            y.key === "ArrowDown" && (y.preventDefault(), d((m) => Math.max(0, Math.min(h.length - 1, m + 1)))), y.key === "ArrowUp" && (y.preventDefault(), d((m) => Math.max(0, m - 1))), y.key === "Enter" && h[f] && (y.preventDefault(), g(h[f][0]));
          } })
        ] }),
        /* @__PURE__ */ p.jsxs("div", { className: "fx-command-results", id: "framework-command-results", role: "listbox", "aria-label": "Workspace menu", children: [
          h.map(([y, m, x], T) => /* @__PURE__ */ p.jsxs("button", { id: "framework-command-" + y, role: "option", "aria-selected": T === f, tabIndex: -1, onClick: () => g(y), className: T === f ? "selected" : "", children: [
            /* @__PURE__ */ p.jsxs("span", { children: [
              /* @__PURE__ */ p.jsx("b", { children: m }),
              /* @__PURE__ */ p.jsx("small", { children: x })
            ] }),
            /* @__PURE__ */ p.jsx(o1, { size: 14 })
          ] }, y)),
          !h.length && /* @__PURE__ */ p.jsx("p", { children: "No matching menu. Try another term." })
        ] }),
        /* @__PURE__ */ p.jsxs("div", { className: "fx-command-footer", children: [
          /* @__PURE__ */ p.jsx("span", { children: "↑ ↓ Select" }),
          /* @__PURE__ */ p.jsx("span", { children: "Enter Open" }),
          /* @__PURE__ */ p.jsx("span", { children: "Esc Close" })
        ] })
      ] })
    ] })
  ] });
}
function OS({ state: a }) {
  return /* @__PURE__ */ p.jsxs("div", { className: "workspace-context", children: [
    /* @__PURE__ */ p.jsxs("span", { className: "context-document", children: [
      /* @__PURE__ */ p.jsx(rs, { size: 14 }),
      a.draft.title
    ] }),
    /* @__PURE__ */ p.jsxs("span", { className: "context-version", children: [
      "v",
      a.draft.revision
    ] }),
    /* @__PURE__ */ p.jsx("span", { className: a.dirty ? "context-dirty" : "context-saved", children: a.dirty ? "Not saved" : "Saved document" }),
    a.view !== "editor" && /* @__PURE__ */ p.jsxs(vs, { size: "small", variant: "ghost", "data-view": "editor", children: [
      "Edit document",
      /* @__PURE__ */ p.jsx(d1, { size: 13 })
    ] })
  ] });
}
const RS = {
  UU: "Undang-Undang",
  PERPPU: "Perppu",
  PP: "Peraturan Pemerintah",
  PERPRES: "Peraturan Presiden",
  PERMEN: "Peraturan Menteri",
  PER_LEMBAGA: "Peraturan Lembaga",
  PERDA_PROV: "Perda Provinsi",
  PERDA_KAB: "Perda Kabupaten/Kota",
  PERGUB: "Peraturan Gubernur",
  PERBUP: "Peraturan Bupati",
  PERWALI: "Peraturan Wali Kota",
  PERDPRD_PROV: "Peraturan DPRD Provinsi",
  PERDPRD_KAB: "Peraturan DPRD Kabupaten/Kota",
  PERDES: "Peraturan Desa",
  PERKADES: "Peraturan Kepala Desa"
}, Hv = (a) => a && RS[a] || a || "Regulation", CS = () => {
  const a = (/* @__PURE__ */ new Date()).getHours();
  return a < 12 ? "Good morning" : a < 18 ? "Good afternoon" : "Good evening";
};
function jo(a, r = Date.now()) {
  if (!a) return "";
  const o = Math.max(0, (r - new Date(a).getTime()) / 1e3);
  return o < 60 ? "just now" : o < 3600 ? `${Math.floor(o / 60)} min ago` : o < 86400 ? `${Math.floor(o / 3600)} h ago` : o < 172800 ? "yesterday" : new Date(a).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function Lv(a, r) {
  var g;
  const o = (g = a.job) != null && g.active ? a.job : null, c = o && ["legal", "full"].includes(o.intent), f = o && ["impact", "full", "social"].includes(o.intent), d = a.analysis, h = a.impact;
  return [
    { label: "Draft", state: r ? "warn" : "done", detail: r ? "Unsaved changes" : `v${a.revision} saved` },
    {
      label: "Verify sources",
      state: c ? "running" : d ? d.outdated ? "warn" : a.pending_reviews ? "active" : "done" : "todo",
      detail: c ? "Running…" : d ? d.outdated ? `Outdated · ran on v${d.revision}` : `${d.findings} finding${d.findings === 1 ? "" : "s"}${a.pending_reviews ? " · awaiting review" : " · reviewed"}` : "Not checked yet"
    },
    {
      label: "Test impact",
      state: f ? "running" : h ? h.outdated ? "warn" : "done" : "todo",
      detail: f ? "Running…" : h ? h.outdated ? `Outdated · ran on v${h.revision}` : h.kind === "social" ? "Public forum done" : "A/B test done" : "Not tested yet"
    }
  ];
}
function MS(a, r) {
  var o;
  return r ? { label: "Save draft", action: "save" } : (o = a.job) != null && o.active ? { label: "View progress", target: "agents" } : a.pending_reviews ? { label: `Review ${a.pending_reviews} result${a.pending_reviews > 1 ? "s" : ""}`, target: "history" } : !a.analysis || a.analysis.outdated ? { label: `Run source check on v${a.revision}`, target: "analysis" } : !a.impact || a.impact.outdated ? { label: "Test the impact", target: "simulation" } : { label: "Export to Word", action: "export-draft" };
}
function Uo(a, r, o) {
  return o.action === "save" ? { "data-action": "save" } : o.action === "export-draft" ? { "data-action": "export-draft", "data-id": a.id } : a.id === r && o.target !== "editor" ? { "data-view": o.target } : { "data-action": "open-draft-at", "data-id": a.id, "data-target": o.target };
}
function DS({ state: a }) {
  const r = `ov-dot ov-dot-${a}`;
  return a === "done" ? /* @__PURE__ */ p.jsx("span", { className: r, children: /* @__PURE__ */ p.jsx(Om, { size: 12, strokeWidth: 3 }) }) : a === "running" ? /* @__PURE__ */ p.jsx("span", { className: r, children: /* @__PURE__ */ p.jsx(Mm, { size: 12, className: "ov-spin" }) }) : a === "warn" ? /* @__PURE__ */ p.jsx("span", { className: r, children: /* @__PURE__ */ p.jsx(zm, { size: 11, strokeWidth: 2.6 }) }) : a === "active" ? /* @__PURE__ */ p.jsx("span", { className: r, children: /* @__PURE__ */ p.jsx(h1, { size: 12 }) }) : /* @__PURE__ */ p.jsx("span", { className: r });
}
function Bv({ steps: a, compact: r = !1 }) {
  return r ? /* @__PURE__ */ p.jsx("span", { className: "ov-mini", role: "img", "aria-label": a.map((o) => `${o.label}: ${o.detail}`).join("; "), children: a.map((o) => /* @__PURE__ */ p.jsx("i", { className: `ov-mini-${o.state}` }, o.label)) }) : /* @__PURE__ */ p.jsx("ol", { className: "ov-stepper", children: a.map((o) => /* @__PURE__ */ p.jsxs("li", { className: `ov-step ov-step-${o.state}`, children: [
    /* @__PURE__ */ p.jsx(DS, { state: o.state }),
    /* @__PURE__ */ p.jsxs("div", { children: [
      /* @__PURE__ */ p.jsx("b", { children: o.label }),
      /* @__PURE__ */ p.jsx("small", { children: o.detail })
    ] })
  ] }, o.label)) });
}
function NS({ readOnly: a }) {
  const [r, o] = E.useState(!1);
  if (a) return null;
  const c = [
    ["generate", "Draft from a brief", "Gemini writes the first version", /* @__PURE__ */ p.jsx(Nm, { size: 16 })],
    ["new", "Guided template", "Pick a regulation type and fill the form", /* @__PURE__ */ p.jsx(rs, { size: 16 })],
    ["import", "Import a document", "TXT, DOCX, PDF or JSON", /* @__PURE__ */ p.jsx(Rm, { size: 16 })]
  ];
  return /* @__PURE__ */ p.jsxs("div", { className: "ov-new", onBlur: (f) => {
    f.currentTarget.contains(f.relatedTarget) || o(!1);
  }, children: [
    /* @__PURE__ */ p.jsxs("button", { className: "ov-btn ov-btn-primary", "data-action": "generate", children: [
      /* @__PURE__ */ p.jsx(b1, { size: 16 }),
      "New draft"
    ] }),
    /* @__PURE__ */ p.jsx("button", { className: "ov-btn ov-btn-primary ov-new-toggle", "aria-label": "More ways to start a draft", "aria-expanded": r, onClick: () => o((f) => !f), children: /* @__PURE__ */ p.jsx(f1, { size: 16 }) }),
    r && /* @__PURE__ */ p.jsx("div", { className: "ov-menu", role: "menu", children: c.map(([f, d, h, g]) => /* @__PURE__ */ p.jsxs("button", { role: "menuitem", "data-action": f, onClick: () => o(!1), children: [
      /* @__PURE__ */ p.jsx("span", { className: "ov-menu-icon", children: g }),
      /* @__PURE__ */ p.jsxs("span", { children: [
        /* @__PURE__ */ p.jsx("b", { children: d }),
        /* @__PURE__ */ p.jsx("small", { children: h })
      ] })
    ] }, f)) })
  ] });
}
function zS() {
  var a;
  (a = document.querySelector(".fx-command-trigger")) == null || a.click();
}
function _S() {
  return /* @__PURE__ */ p.jsxs("div", { className: "ov-skeleton", "aria-busy": "true", "aria-label": "Loading overview", children: [
    /* @__PURE__ */ p.jsx("i", {}),
    /* @__PURE__ */ p.jsx("i", {}),
    /* @__PURE__ */ p.jsx("i", {})
  ] });
}
const jS = {
  running: /* @__PURE__ */ p.jsx(Mm, { size: 16, className: "ov-spin" }),
  failed: /* @__PURE__ */ p.jsx(_m, { size: 16 }),
  review: /* @__PURE__ */ p.jsx(v1, { size: 16 }),
  outdated: /* @__PURE__ */ p.jsx(zm, { size: 16 })
};
function gy({ state: a }) {
  var M;
  const r = a.overview, o = ["viewer", "reviewer"].includes(((M = a.status.principal) == null ? void 0 : M.role) || ""), [c, f] = E.useState(""), [d, h] = E.useState("all"), g = (r == null ? void 0 : r.drafts) ?? [], y = a.dirty && g.find((R) => R.id === a.draft.id) || g[0], m = !!y && a.dirty && y.id === a.draft.id, x = (r == null ? void 0 : r.attention) ?? [], T = r ? `${g.length} draft${g.length === 1 ? "" : "s"} · ${x.length ? `${x.length} item${x.length === 1 ? "" : "s"} need${x.length === 1 ? "s" : ""} attention` : "nothing waits for a decision"}` : "Loading your workspace…", D = E.useMemo(() => g.filter((R) => {
    var O, _, H;
    return c && !`${R.title} ${R.regulation_type ?? ""}`.toLowerCase().includes(c.toLowerCase()) ? !1 : d === "review" ? R.pending_reviews > 0 : d === "outdated" ? !!((O = R.analysis) != null && O.outdated || (_ = R.impact) != null && _.outdated) : d === "running" ? !!((H = R.job) != null && H.active) : !0;
  }), [g, c, d]);
  return /* @__PURE__ */ p.jsxs("div", { className: "ov", children: [
    /* @__PURE__ */ p.jsxs("header", { className: "ov-header", children: [
      /* @__PURE__ */ p.jsxs("div", { children: [
        /* @__PURE__ */ p.jsxs("h1", { children: [
          CS(),
          "."
        ] }),
        /* @__PURE__ */ p.jsx("p", { "aria-live": "polite", children: T })
      ] }),
      /* @__PURE__ */ p.jsxs("div", { className: "ov-header-actions", children: [
        /* @__PURE__ */ p.jsxs("button", { className: "ov-btn ov-btn-ghost ov-search", onClick: zS, "aria-label": "Search menus and actions (Ctrl+K)", children: [
          /* @__PURE__ */ p.jsx(ko, { size: 16 }),
          "Search",
          /* @__PURE__ */ p.jsx("kbd", { children: "Ctrl K" })
        ] }),
        /* @__PURE__ */ p.jsx(NS, { readOnly: o })
      ] })
    ] }),
    r === void 0 ? /* @__PURE__ */ p.jsx(_S, {}) : r === null ? /* @__PURE__ */ p.jsxs("div", { className: "ov-card ov-error", role: "alert", children: [
      "The overview could not be loaded. ",
      /* @__PURE__ */ p.jsx("button", { className: "ov-link", "data-view": "home", children: "Try again" })
    ] }) : /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
      /* @__PURE__ */ p.jsxs("div", { className: "ov-top", children: [
        y ? (() => {
          var _, H;
          const R = Lv(y, m), O = MS(y, m);
          return /* @__PURE__ */ p.jsxs("section", { className: `ov-card ov-continue${(_ = y.job) != null && _.active ? " ov-live" : ""}`, "aria-labelledby": "ov-continue-title", children: [
            /* @__PURE__ */ p.jsx("span", { className: "ov-eyebrow", children: "Continue where you left off" }),
            /* @__PURE__ */ p.jsxs("div", { className: "ov-continue-head", children: [
              /* @__PURE__ */ p.jsx("h2", { id: "ov-continue-title", children: y.title }),
              /* @__PURE__ */ p.jsxs("span", { className: "ov-meta", children: [
                Hv(y.regulation_type),
                " · v",
                y.revision,
                " · ",
                y.articles,
                " article",
                y.articles === 1 ? "" : "s",
                " · edited ",
                jo(y.updated_at)
              ] })
            ] }),
            /* @__PURE__ */ p.jsx(Bv, { steps: R }),
            /* @__PURE__ */ p.jsxs("div", { className: "ov-continue-actions", children: [
              /* @__PURE__ */ p.jsxs("button", { className: "ov-btn ov-btn-primary", ...Uo(y, a.draft.id, O), children: [
                O.label,
                /* @__PURE__ */ p.jsx(Hu, { size: 16 })
              ] }),
              O.target !== "editor" && /* @__PURE__ */ p.jsx("button", { className: "ov-btn ov-btn-ghost", ...Uo(y, a.draft.id, { target: "editor" }), children: "Open editor" }),
              y.analysis && !y.analysis.outdated && !((H = y.job) != null && H.active) && /* @__PURE__ */ p.jsx("button", { className: "ov-btn ov-btn-ghost", ...Uo(y, a.draft.id, { target: "social" }), children: "Run public forum" })
            ] })
          ] });
        })() : /* @__PURE__ */ p.jsxs("section", { className: "ov-card ov-continue", children: [
          /* @__PURE__ */ p.jsx("h2", { children: "No drafts yet" }),
          /* @__PURE__ */ p.jsx("p", { children: "Create the first draft to start." })
        ] }),
        /* @__PURE__ */ p.jsxs("section", { className: "ov-card ov-attention", "aria-labelledby": "ov-attention-title", children: [
          /* @__PURE__ */ p.jsxs("div", { className: "ov-card-head", children: [
            /* @__PURE__ */ p.jsx("h2", { id: "ov-attention-title", children: "Needs your attention" }),
            x.length > 0 && /* @__PURE__ */ p.jsx("span", { className: "ov-count", children: x.length })
          ] }),
          x.length ? /* @__PURE__ */ p.jsx("ul", { children: x.map((R, O) => /* @__PURE__ */ p.jsx("li", { children: /* @__PURE__ */ p.jsxs("button", { className: `ov-attn ov-attn-${R.kind}`, "data-action": "open-draft-at", "data-id": R.draft_id, "data-target": R.target, children: [
            /* @__PURE__ */ p.jsx("span", { className: "ov-attn-icon", children: jS[R.kind] }),
            /* @__PURE__ */ p.jsxs("span", { className: "ov-attn-copy", children: [
              /* @__PURE__ */ p.jsx("b", { children: R.label }),
              /* @__PURE__ */ p.jsxs("small", { children: [
                R.draft,
                " · ",
                R.detail
              ] })
            ] }),
            /* @__PURE__ */ p.jsx(Hu, { size: 15, className: "ov-attn-arrow" })
          ] }) }, O)) }) : /* @__PURE__ */ p.jsxs("p", { className: "ov-clear", children: [
            /* @__PURE__ */ p.jsx(Om, { size: 16 }),
            "All clear — nothing waits for a decision."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ p.jsxs("section", { className: "ov-card ov-drafts", "aria-labelledby": "ov-drafts-title", children: [
        /* @__PURE__ */ p.jsxs("div", { className: "ov-card-head ov-drafts-head", children: [
          /* @__PURE__ */ p.jsxs("h2", { id: "ov-drafts-title", children: [
            "Your drafts ",
            /* @__PURE__ */ p.jsx("span", { className: "ov-muted", children: g.length })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "ov-drafts-tools", children: [
            /* @__PURE__ */ p.jsxs("label", { className: "ov-filter-search", children: [
              /* @__PURE__ */ p.jsx(ko, { size: 15, "aria-hidden": "true" }),
              /* @__PURE__ */ p.jsx("input", { type: "search", placeholder: "Search drafts", "aria-label": "Search drafts", value: c, onChange: (R) => f(R.target.value) })
            ] }),
            /* @__PURE__ */ p.jsx("div", { className: "ov-chips", role: "group", "aria-label": "Filter drafts", children: [["all", "All"], ["review", "Needs review"], ["outdated", "Outdated"], ["running", "Running"]].map(([R, O]) => /* @__PURE__ */ p.jsx("button", { className: "ov-chip", "aria-pressed": d === R, onClick: () => h(R), children: O }, R)) })
          ] })
        ] }),
        /* @__PURE__ */ p.jsxs("div", { className: "ov-table", role: "table", "aria-label": "Drafts", children: [
          /* @__PURE__ */ p.jsxs("div", { className: "ov-row ov-row-head", role: "row", children: [
            /* @__PURE__ */ p.jsx("span", { role: "columnheader", children: "Draft" }),
            /* @__PURE__ */ p.jsx("span", { role: "columnheader", children: "Stage" }),
            /* @__PURE__ */ p.jsx("span", { role: "columnheader", children: "Updated" }),
            /* @__PURE__ */ p.jsx("span", { role: "columnheader", children: "Version" }),
            /* @__PURE__ */ p.jsx("span", { role: "columnheader", children: /* @__PURE__ */ p.jsx("span", { className: "sr-only", children: "Open" }) })
          ] }),
          D.map((R) => {
            var _, H, G;
            const O = Lv(R, a.dirty && R.id === a.draft.id);
            return /* @__PURE__ */ p.jsxs("div", { className: "ov-row", role: "row", children: [
              /* @__PURE__ */ p.jsxs("span", { role: "cell", className: "ov-cell-title", children: [
                /* @__PURE__ */ p.jsx("b", { children: R.title }),
                /* @__PURE__ */ p.jsxs("small", { children: [
                  Hv(R.regulation_type),
                  R.id === a.draft.id ? " · selected" : ""
                ] })
              ] }),
              /* @__PURE__ */ p.jsxs("span", { role: "cell", className: "ov-cell-stage", children: [
                /* @__PURE__ */ p.jsx(Bv, { steps: O, compact: !0 }),
                R.pending_reviews > 0 && /* @__PURE__ */ p.jsxs("span", { className: "ov-badge ov-badge-review", children: [
                  R.pending_reviews,
                  " to review"
                ] }),
                (((_ = R.analysis) == null ? void 0 : _.outdated) || ((H = R.impact) == null ? void 0 : H.outdated)) && /* @__PURE__ */ p.jsx("span", { className: "ov-badge ov-badge-warn", children: "Outdated" }),
                ((G = R.job) == null ? void 0 : G.active) && /* @__PURE__ */ p.jsx("span", { className: "ov-badge ov-badge-run", children: "Running" })
              ] }),
              /* @__PURE__ */ p.jsx("span", { role: "cell", className: "ov-muted", children: jo(R.updated_at) }),
              /* @__PURE__ */ p.jsx("span", { role: "cell", children: /* @__PURE__ */ p.jsxs("span", { className: "ov-version", children: [
                "v",
                R.revision
              ] }) }),
              /* @__PURE__ */ p.jsx("span", { role: "cell", children: /* @__PURE__ */ p.jsxs("button", { className: "ov-btn ov-btn-ghost ov-btn-sm", "data-action": "open-draft-at", "data-id": R.id, "data-target": "editor", "aria-label": `Open ${R.title}`, children: [
                "Open",
                /* @__PURE__ */ p.jsx(Hu, { size: 14 })
              ] }) })
            ] }, R.id);
          }),
          !D.length && /* @__PURE__ */ p.jsx("p", { className: "ov-empty", children: "No drafts match this filter." })
        ] })
      ] }),
      /* @__PURE__ */ p.jsxs("div", { className: "ov-bottom", children: [
        /* @__PURE__ */ p.jsxs("section", { className: "ov-card ov-activity", "aria-labelledby": "ov-activity-title", children: [
          /* @__PURE__ */ p.jsxs("div", { className: "ov-card-head", children: [
            /* @__PURE__ */ p.jsx("h2", { id: "ov-activity-title", children: "Recent activity" }),
            /* @__PURE__ */ p.jsxs("button", { className: "ov-link", "data-view": "history", children: [
              "View all",
              /* @__PURE__ */ p.jsx(Hu, { size: 14 })
            ] })
          ] }),
          r.activity.length ? /* @__PURE__ */ p.jsx("ol", { children: r.activity.map((R, O) => /* @__PURE__ */ p.jsxs("li", { children: [
            /* @__PURE__ */ p.jsx("time", { dateTime: R.at, children: jo(R.at) }),
            /* @__PURE__ */ p.jsxs("span", { children: [
              /* @__PURE__ */ p.jsx("b", { children: R.label }),
              /* @__PURE__ */ p.jsx("small", { children: R.draft })
            ] })
          ] }, O)) }) : /* @__PURE__ */ p.jsx("p", { className: "ov-muted", children: "No activity yet." })
        ] }),
        /* @__PURE__ */ p.jsxs("section", { className: "ov-card ov-quick", "aria-labelledby": "ov-quick-title", children: [
          /* @__PURE__ */ p.jsx("div", { className: "ov-card-head", children: /* @__PURE__ */ p.jsx("h2", { id: "ov-quick-title", children: "Quick start" }) }),
          /* @__PURE__ */ p.jsxs("div", { className: "ov-quick-grid", children: [
            !o && /* @__PURE__ */ p.jsxs("button", { "data-action": "generate", children: [
              /* @__PURE__ */ p.jsx(Nm, { size: 18 }),
              /* @__PURE__ */ p.jsx("b", { children: "Draft from a brief" }),
              /* @__PURE__ */ p.jsx("small", { children: "Gemini writes the first version" })
            ] }),
            !o && /* @__PURE__ */ p.jsxs("button", { "data-action": "import", children: [
              /* @__PURE__ */ p.jsx(Rm, { size: 18 }),
              /* @__PURE__ */ p.jsx("b", { children: "Import a document" }),
              /* @__PURE__ */ p.jsx("small", { children: "TXT, DOCX, PDF or JSON" })
            ] }),
            /* @__PURE__ */ p.jsxs("button", { "data-view": "library", children: [
              /* @__PURE__ */ p.jsx(s1, { size: 18 }),
              /* @__PURE__ */ p.jsx("b", { children: "Ask the legal library" }),
              /* @__PURE__ */ p.jsx("small", { children: "Answers cite the exact article" })
            ] }),
            /* @__PURE__ */ p.jsxs("button", { "data-view": "data", children: [
              /* @__PURE__ */ p.jsx(Dm, { size: 18 }),
              /* @__PURE__ */ p.jsx("b", { children: "Explore the regulation map" }),
              /* @__PURE__ */ p.jsx("small", { children: "Collection across 38 provinces" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const Pu = [];
let qv = !1, da = null;
function HS() {
  if (qv) return;
  const a = document.querySelector("#workspace-sidebar"), r = document.querySelector("#framework-tools");
  if (!a || !r) return;
  qv = !0, document.body.classList.add("framework-ready");
  const o = Zu.createRoot(a, { identifierPrefix: "nav-" }), c = Zu.createRoot(r, { identifierPrefix: "cmd-" });
  xl.flushSync(() => {
    o.render(/* @__PURE__ */ p.jsx(A1, {})), c.render(/* @__PURE__ */ p.jsx(TS, {}));
  });
}
function LS() {
  var a;
  for (; Pu.length; ) (a = Pu.pop()) == null || a.unmount();
  da = null;
}
function BS(a) {
  if (a.view === "data") return;
  const r = document.querySelector("#framework-home");
  if (r) {
    const d = Zu.createRoot(r, { identifierPrefix: "home-" });
    Pu.push(d), da = d, xl.flushSync(() => d.render(/* @__PURE__ */ p.jsx(gy, { state: a })));
    return;
  }
  const o = document.querySelector("#main .page-heading,#main .enterprise-heading");
  if (!o) return;
  const c = document.createElement("div");
  c.className = "framework-context", o.after(c);
  const f = Zu.createRoot(c, { identifierPrefix: "flow-" });
  Pu.push(f), xl.flushSync(() => f.render(/* @__PURE__ */ p.jsx(OS, { state: a })));
}
function qS(a) {
  da && a.view === "home" && xl.flushSync(() => da == null ? void 0 : da.render(/* @__PURE__ */ p.jsx(gy, { state: a })));
}
export {
  LS as disposePageComponents,
  HS as initializeFrameworkShell,
  qS as refreshFrameworkStatus,
  BS as renderFrameworkComponents
};
