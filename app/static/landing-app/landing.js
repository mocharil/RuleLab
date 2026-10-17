var n1 = Object.defineProperty;
var i1 = (n, a, l) => a in n ? n1(n, a, { enumerable: !0, configurable: !0, writable: !0, value: l }) : n[a] = l;
var zs = (n, a, l) => i1(n, typeof a != "symbol" ? a + "" : a, l);
function a1(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var rc = { exports: {} }, _s = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ep;
function s1() {
  if (Ep) return _s;
  Ep = 1;
  var n = Symbol.for("react.transitional.element"), a = Symbol.for("react.fragment");
  function l(r, u, d) {
    var f = null;
    if (d !== void 0 && (f = "" + d), u.key !== void 0 && (f = "" + u.key), "key" in u) {
      d = {};
      for (var m in u)
        m !== "key" && (d[m] = u[m]);
    } else d = u;
    return u = d.ref, {
      $$typeof: n,
      type: r,
      key: f,
      ref: u !== void 0 ? u : null,
      props: d
    };
  }
  return _s.Fragment = a, _s.jsx = l, _s.jsxs = l, _s;
}
var Mp;
function l1() {
  return Mp || (Mp = 1, rc.exports = s1()), rc.exports;
}
var y = l1(), oc = { exports: {} }, Os = {}, uc = { exports: {} }, cc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jp;
function r1() {
  return jp || (jp = 1, function(n) {
    function a(G, $) {
      var K = G.length;
      G.push($);
      t: for (; 0 < K; ) {
        var ot = K - 1 >>> 1, E = G[ot];
        if (0 < u(E, $))
          G[ot] = $, G[K] = E, K = ot;
        else break t;
      }
    }
    function l(G) {
      return G.length === 0 ? null : G[0];
    }
    function r(G) {
      if (G.length === 0) return null;
      var $ = G[0], K = G.pop();
      if (K !== $) {
        G[0] = K;
        t: for (var ot = 0, E = G.length, X = E >>> 1; ot < X; ) {
          var st = 2 * (ot + 1) - 1, at = G[st], F = st + 1, ht = G[F];
          if (0 > u(at, K))
            F < E && 0 > u(ht, at) ? (G[ot] = ht, G[F] = K, ot = F) : (G[ot] = at, G[st] = K, ot = st);
          else if (F < E && 0 > u(ht, K))
            G[ot] = ht, G[F] = K, ot = F;
          else break t;
        }
      }
      return $;
    }
    function u(G, $) {
      var K = G.sortIndex - $.sortIndex;
      return K !== 0 ? K : G.id - $.id;
    }
    if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      n.unstable_now = function() {
        return d.now();
      };
    } else {
      var f = Date, m = f.now();
      n.unstable_now = function() {
        return f.now() - m;
      };
    }
    var h = [], p = [], v = 1, x = null, S = 3, T = !1, A = !1, M = !1, z = typeof setTimeout == "function" ? setTimeout : null, _ = typeof clearTimeout == "function" ? clearTimeout : null, q = typeof setImmediate < "u" ? setImmediate : null;
    function L(G) {
      for (var $ = l(p); $ !== null; ) {
        if ($.callback === null) r(p);
        else if ($.startTime <= G)
          r(p), $.sortIndex = $.expirationTime, a(h, $);
        else break;
        $ = l(p);
      }
    }
    function Q(G) {
      if (M = !1, L(G), !A)
        if (l(h) !== null)
          A = !0, Ot();
        else {
          var $ = l(p);
          $ !== null && zt(Q, $.startTime - G);
        }
    }
    var V = !1, B = -1, P = 5, J = -1;
    function Z() {
      return !(n.unstable_now() - J < P);
    }
    function et() {
      if (V) {
        var G = n.unstable_now();
        J = G;
        var $ = !0;
        try {
          t: {
            A = !1, M && (M = !1, _(B), B = -1), T = !0;
            var K = S;
            try {
              e: {
                for (L(G), x = l(h); x !== null && !(x.expirationTime > G && Z()); ) {
                  var ot = x.callback;
                  if (typeof ot == "function") {
                    x.callback = null, S = x.priorityLevel;
                    var E = ot(
                      x.expirationTime <= G
                    );
                    if (G = n.unstable_now(), typeof E == "function") {
                      x.callback = E, L(G), $ = !0;
                      break e;
                    }
                    x === l(h) && r(h), L(G);
                  } else r(h);
                  x = l(h);
                }
                if (x !== null) $ = !0;
                else {
                  var X = l(p);
                  X !== null && zt(
                    Q,
                    X.startTime - G
                  ), $ = !1;
                }
              }
              break t;
            } finally {
              x = null, S = K, T = !1;
            }
            $ = void 0;
          }
        } finally {
          $ ? bt() : V = !1;
        }
      }
    }
    var bt;
    if (typeof q == "function")
      bt = function() {
        q(et);
      };
    else if (typeof MessageChannel < "u") {
      var kt = new MessageChannel(), _t = kt.port2;
      kt.port1.onmessage = et, bt = function() {
        _t.postMessage(null);
      };
    } else
      bt = function() {
        z(et, 0);
      };
    function Ot() {
      V || (V = !0, bt());
    }
    function zt(G, $) {
      B = z(function() {
        G(n.unstable_now());
      }, $);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(G) {
      G.callback = null;
    }, n.unstable_continueExecution = function() {
      A || T || (A = !0, Ot());
    }, n.unstable_forceFrameRate = function(G) {
      0 > G || 125 < G ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : P = 0 < G ? Math.floor(1e3 / G) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return S;
    }, n.unstable_getFirstCallbackNode = function() {
      return l(h);
    }, n.unstable_next = function(G) {
      switch (S) {
        case 1:
        case 2:
        case 3:
          var $ = 3;
          break;
        default:
          $ = S;
      }
      var K = S;
      S = $;
      try {
        return G();
      } finally {
        S = K;
      }
    }, n.unstable_pauseExecution = function() {
    }, n.unstable_requestPaint = function() {
    }, n.unstable_runWithPriority = function(G, $) {
      switch (G) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          G = 3;
      }
      var K = S;
      S = G;
      try {
        return $();
      } finally {
        S = K;
      }
    }, n.unstable_scheduleCallback = function(G, $, K) {
      var ot = n.unstable_now();
      switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? ot + K : ot) : K = ot, G) {
        case 1:
          var E = -1;
          break;
        case 2:
          E = 250;
          break;
        case 5:
          E = 1073741823;
          break;
        case 4:
          E = 1e4;
          break;
        default:
          E = 5e3;
      }
      return E = K + E, G = {
        id: v++,
        callback: $,
        priorityLevel: G,
        startTime: K,
        expirationTime: E,
        sortIndex: -1
      }, K > ot ? (G.sortIndex = K, a(p, G), l(h) === null && G === l(p) && (M ? (_(B), B = -1) : M = !0, zt(Q, K - ot))) : (G.sortIndex = E, a(h, G), A || T || (A = !0, Ot())), G;
    }, n.unstable_shouldYield = Z, n.unstable_wrapCallback = function(G) {
      var $ = S;
      return function() {
        var K = S;
        S = $;
        try {
          return G.apply(this, arguments);
        } finally {
          S = K;
        }
      };
    };
  }(cc)), cc;
}
var Rp;
function o1() {
  return Rp || (Rp = 1, uc.exports = r1()), uc.exports;
}
var fc = { exports: {} }, dt = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dp;
function u1() {
  if (Dp) return dt;
  Dp = 1;
  var n = Symbol.for("react.transitional.element"), a = Symbol.for("react.portal"), l = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), d = Symbol.for("react.consumer"), f = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), h = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), x = Symbol.iterator;
  function S(E) {
    return E === null || typeof E != "object" ? null : (E = x && E[x] || E["@@iterator"], typeof E == "function" ? E : null);
  }
  var T = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, A = Object.assign, M = {};
  function z(E, X, st) {
    this.props = E, this.context = X, this.refs = M, this.updater = st || T;
  }
  z.prototype.isReactComponent = {}, z.prototype.setState = function(E, X) {
    if (typeof E != "object" && typeof E != "function" && E != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, E, X, "setState");
  }, z.prototype.forceUpdate = function(E) {
    this.updater.enqueueForceUpdate(this, E, "forceUpdate");
  };
  function _() {
  }
  _.prototype = z.prototype;
  function q(E, X, st) {
    this.props = E, this.context = X, this.refs = M, this.updater = st || T;
  }
  var L = q.prototype = new _();
  L.constructor = q, A(L, z.prototype), L.isPureReactComponent = !0;
  var Q = Array.isArray, V = { H: null, A: null, T: null, S: null }, B = Object.prototype.hasOwnProperty;
  function P(E, X, st, at, F, ht) {
    return st = ht.ref, {
      $$typeof: n,
      type: E,
      key: X,
      ref: st !== void 0 ? st : null,
      props: ht
    };
  }
  function J(E, X) {
    return P(
      E.type,
      X,
      void 0,
      void 0,
      void 0,
      E.props
    );
  }
  function Z(E) {
    return typeof E == "object" && E !== null && E.$$typeof === n;
  }
  function et(E) {
    var X = { "=": "=0", ":": "=2" };
    return "$" + E.replace(/[=:]/g, function(st) {
      return X[st];
    });
  }
  var bt = /\/+/g;
  function kt(E, X) {
    return typeof E == "object" && E !== null && E.key != null ? et("" + E.key) : X.toString(36);
  }
  function _t() {
  }
  function Ot(E) {
    switch (E.status) {
      case "fulfilled":
        return E.value;
      case "rejected":
        throw E.reason;
      default:
        switch (typeof E.status == "string" ? E.then(_t, _t) : (E.status = "pending", E.then(
          function(X) {
            E.status === "pending" && (E.status = "fulfilled", E.value = X);
          },
          function(X) {
            E.status === "pending" && (E.status = "rejected", E.reason = X);
          }
        )), E.status) {
          case "fulfilled":
            return E.value;
          case "rejected":
            throw E.reason;
        }
    }
    throw E;
  }
  function zt(E, X, st, at, F) {
    var ht = typeof E;
    (ht === "undefined" || ht === "boolean") && (E = null);
    var ct = !1;
    if (E === null) ct = !0;
    else
      switch (ht) {
        case "bigint":
        case "string":
        case "number":
          ct = !0;
          break;
        case "object":
          switch (E.$$typeof) {
            case n:
            case a:
              ct = !0;
              break;
            case v:
              return ct = E._init, zt(
                ct(E._payload),
                X,
                st,
                at,
                F
              );
          }
      }
    if (ct)
      return F = F(E), ct = at === "" ? "." + kt(E, 0) : at, Q(F) ? (st = "", ct != null && (st = ct.replace(bt, "$&/") + "/"), zt(F, X, st, "", function(Qt) {
        return Qt;
      })) : F != null && (Z(F) && (F = J(
        F,
        st + (F.key == null || E && E.key === F.key ? "" : ("" + F.key).replace(
          bt,
          "$&/"
        ) + "/") + ct
      )), X.push(F)), 1;
    ct = 0;
    var Kt = at === "" ? "." : at + ":";
    if (Q(E))
      for (var Mt = 0; Mt < E.length; Mt++)
        at = E[Mt], ht = Kt + kt(at, Mt), ct += zt(
          at,
          X,
          st,
          ht,
          F
        );
    else if (Mt = S(E), typeof Mt == "function")
      for (E = Mt.call(E), Mt = 0; !(at = E.next()).done; )
        at = at.value, ht = Kt + kt(at, Mt++), ct += zt(
          at,
          X,
          st,
          ht,
          F
        );
    else if (ht === "object") {
      if (typeof E.then == "function")
        return zt(
          Ot(E),
          X,
          st,
          at,
          F
        );
      throw X = String(E), Error(
        "Objects are not valid as a React child (found: " + (X === "[object Object]" ? "object with keys {" + Object.keys(E).join(", ") + "}" : X) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ct;
  }
  function G(E, X, st) {
    if (E == null) return E;
    var at = [], F = 0;
    return zt(E, at, "", "", function(ht) {
      return X.call(st, ht, F++);
    }), at;
  }
  function $(E) {
    if (E._status === -1) {
      var X = E._result;
      X = X(), X.then(
        function(st) {
          (E._status === 0 || E._status === -1) && (E._status = 1, E._result = st);
        },
        function(st) {
          (E._status === 0 || E._status === -1) && (E._status = 2, E._result = st);
        }
      ), E._status === -1 && (E._status = 0, E._result = X);
    }
    if (E._status === 1) return E._result.default;
    throw E._result;
  }
  var K = typeof reportError == "function" ? reportError : function(E) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var X = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof E == "object" && E !== null && typeof E.message == "string" ? String(E.message) : String(E),
        error: E
      });
      if (!window.dispatchEvent(X)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", E);
      return;
    }
    console.error(E);
  };
  function ot() {
  }
  return dt.Children = {
    map: G,
    forEach: function(E, X, st) {
      G(
        E,
        function() {
          X.apply(this, arguments);
        },
        st
      );
    },
    count: function(E) {
      var X = 0;
      return G(E, function() {
        X++;
      }), X;
    },
    toArray: function(E) {
      return G(E, function(X) {
        return X;
      }) || [];
    },
    only: function(E) {
      if (!Z(E))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return E;
    }
  }, dt.Component = z, dt.Fragment = l, dt.Profiler = u, dt.PureComponent = q, dt.StrictMode = r, dt.Suspense = h, dt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, dt.act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, dt.cache = function(E) {
    return function() {
      return E.apply(null, arguments);
    };
  }, dt.cloneElement = function(E, X, st) {
    if (E == null)
      throw Error(
        "The argument must be a React element, but you passed " + E + "."
      );
    var at = A({}, E.props), F = E.key, ht = void 0;
    if (X != null)
      for (ct in X.ref !== void 0 && (ht = void 0), X.key !== void 0 && (F = "" + X.key), X)
        !B.call(X, ct) || ct === "key" || ct === "__self" || ct === "__source" || ct === "ref" && X.ref === void 0 || (at[ct] = X[ct]);
    var ct = arguments.length - 2;
    if (ct === 1) at.children = st;
    else if (1 < ct) {
      for (var Kt = Array(ct), Mt = 0; Mt < ct; Mt++)
        Kt[Mt] = arguments[Mt + 2];
      at.children = Kt;
    }
    return P(E.type, F, void 0, void 0, ht, at);
  }, dt.createContext = function(E) {
    return E = {
      $$typeof: f,
      _currentValue: E,
      _currentValue2: E,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, E.Provider = E, E.Consumer = {
      $$typeof: d,
      _context: E
    }, E;
  }, dt.createElement = function(E, X, st) {
    var at, F = {}, ht = null;
    if (X != null)
      for (at in X.key !== void 0 && (ht = "" + X.key), X)
        B.call(X, at) && at !== "key" && at !== "__self" && at !== "__source" && (F[at] = X[at]);
    var ct = arguments.length - 2;
    if (ct === 1) F.children = st;
    else if (1 < ct) {
      for (var Kt = Array(ct), Mt = 0; Mt < ct; Mt++)
        Kt[Mt] = arguments[Mt + 2];
      F.children = Kt;
    }
    if (E && E.defaultProps)
      for (at in ct = E.defaultProps, ct)
        F[at] === void 0 && (F[at] = ct[at]);
    return P(E, ht, void 0, void 0, null, F);
  }, dt.createRef = function() {
    return { current: null };
  }, dt.forwardRef = function(E) {
    return { $$typeof: m, render: E };
  }, dt.isValidElement = Z, dt.lazy = function(E) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: E },
      _init: $
    };
  }, dt.memo = function(E, X) {
    return {
      $$typeof: p,
      type: E,
      compare: X === void 0 ? null : X
    };
  }, dt.startTransition = function(E) {
    var X = V.T, st = {};
    V.T = st;
    try {
      var at = E(), F = V.S;
      F !== null && F(st, at), typeof at == "object" && at !== null && typeof at.then == "function" && at.then(ot, K);
    } catch (ht) {
      K(ht);
    } finally {
      V.T = X;
    }
  }, dt.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, dt.use = function(E) {
    return V.H.use(E);
  }, dt.useActionState = function(E, X, st) {
    return V.H.useActionState(E, X, st);
  }, dt.useCallback = function(E, X) {
    return V.H.useCallback(E, X);
  }, dt.useContext = function(E) {
    return V.H.useContext(E);
  }, dt.useDebugValue = function() {
  }, dt.useDeferredValue = function(E, X) {
    return V.H.useDeferredValue(E, X);
  }, dt.useEffect = function(E, X) {
    return V.H.useEffect(E, X);
  }, dt.useId = function() {
    return V.H.useId();
  }, dt.useImperativeHandle = function(E, X, st) {
    return V.H.useImperativeHandle(E, X, st);
  }, dt.useInsertionEffect = function(E, X) {
    return V.H.useInsertionEffect(E, X);
  }, dt.useLayoutEffect = function(E, X) {
    return V.H.useLayoutEffect(E, X);
  }, dt.useMemo = function(E, X) {
    return V.H.useMemo(E, X);
  }, dt.useOptimistic = function(E, X) {
    return V.H.useOptimistic(E, X);
  }, dt.useReducer = function(E, X, st) {
    return V.H.useReducer(E, X, st);
  }, dt.useRef = function(E) {
    return V.H.useRef(E);
  }, dt.useState = function(E) {
    return V.H.useState(E);
  }, dt.useSyncExternalStore = function(E, X, st) {
    return V.H.useSyncExternalStore(
      E,
      X,
      st
    );
  }, dt.useTransition = function() {
    return V.H.useTransition();
  }, dt.version = "19.0.0", dt;
}
var Cp;
function ef() {
  return Cp || (Cp = 1, fc.exports = u1()), fc.exports;
}
var dc = { exports: {} }, he = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Np;
function c1() {
  if (Np) return he;
  Np = 1;
  var n = ef();
  function a(h) {
    var p = "https://react.dev/errors/" + h;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        p += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + h + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function l() {
  }
  var r = {
    d: {
      f: l,
      r: function() {
        throw Error(a(522));
      },
      D: l,
      C: l,
      L: l,
      m: l,
      X: l,
      S: l,
      M: l
    },
    p: 0,
    findDOMNode: null
  }, u = Symbol.for("react.portal");
  function d(h, p, v) {
    var x = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: u,
      key: x == null ? null : "" + x,
      children: h,
      containerInfo: p,
      implementation: v
    };
  }
  var f = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(h, p) {
    if (h === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return he.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, he.createPortal = function(h, p) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(a(299));
    return d(h, p, null, v);
  }, he.flushSync = function(h) {
    var p = f.T, v = r.p;
    try {
      if (f.T = null, r.p = 2, h) return h();
    } finally {
      f.T = p, r.p = v, r.d.f();
    }
  }, he.preconnect = function(h, p) {
    typeof h == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, r.d.C(h, p));
  }, he.prefetchDNS = function(h) {
    typeof h == "string" && r.d.D(h);
  }, he.preinit = function(h, p) {
    if (typeof h == "string" && p && typeof p.as == "string") {
      var v = p.as, x = m(v, p.crossOrigin), S = typeof p.integrity == "string" ? p.integrity : void 0, T = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      v === "style" ? r.d.S(
        h,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: x,
          integrity: S,
          fetchPriority: T
        }
      ) : v === "script" && r.d.X(h, {
        crossOrigin: x,
        integrity: S,
        fetchPriority: T,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, he.preinitModule = function(h, p) {
    if (typeof h == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var v = m(
            p.as,
            p.crossOrigin
          );
          r.d.M(h, {
            crossOrigin: v,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && r.d.M(h);
  }, he.preload = function(h, p) {
    if (typeof h == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var v = p.as, x = m(v, p.crossOrigin);
      r.d.L(h, v, {
        crossOrigin: x,
        integrity: typeof p.integrity == "string" ? p.integrity : void 0,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0,
        type: typeof p.type == "string" ? p.type : void 0,
        fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
        referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
        imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
        imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
        media: typeof p.media == "string" ? p.media : void 0
      });
    }
  }, he.preloadModule = function(h, p) {
    if (typeof h == "string")
      if (p) {
        var v = m(p.as, p.crossOrigin);
        r.d.m(h, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: v,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else r.d.m(h);
  }, he.requestFormReset = function(h) {
    r.d.r(h);
  }, he.unstable_batchedUpdates = function(h, p) {
    return h(p);
  }, he.useFormState = function(h, p, v) {
    return f.H.useFormState(h, p, v);
  }, he.useFormStatus = function() {
    return f.H.useHostTransitionStatus();
  }, he.version = "19.0.0", he;
}
var zp;
function f1() {
  if (zp) return dc.exports;
  zp = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (a) {
        console.error(a);
      }
  }
  return n(), dc.exports = c1(), dc.exports;
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
var _p;
function d1() {
  if (_p) return Os;
  _p = 1;
  var n = o1(), a = ef(), l = f1();
  function r(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        e += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function u(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  var d = Symbol.for("react.element"), f = Symbol.for("react.transitional.element"), m = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), v = Symbol.for("react.profiler"), x = Symbol.for("react.provider"), S = Symbol.for("react.consumer"), T = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), z = Symbol.for("react.suspense_list"), _ = Symbol.for("react.memo"), q = Symbol.for("react.lazy"), L = Symbol.for("react.offscreen"), Q = Symbol.for("react.memo_cache_sentinel"), V = Symbol.iterator;
  function B(t) {
    return t === null || typeof t != "object" ? null : (t = V && t[V] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var P = Symbol.for("react.client.reference");
  function J(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === P ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case h:
        return "Fragment";
      case m:
        return "Portal";
      case v:
        return "Profiler";
      case p:
        return "StrictMode";
      case M:
        return "Suspense";
      case z:
        return "SuspenseList";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case T:
          return (t.displayName || "Context") + ".Provider";
        case S:
          return (t._context.displayName || "Context") + ".Consumer";
        case A:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case _:
          return e = t.displayName || null, e !== null ? e : J(t.type) || "Memo";
        case q:
          e = t._payload, t = t._init;
          try {
            return J(t(e));
          } catch {
          }
      }
    return null;
  }
  var Z = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, et = Object.assign, bt, kt;
  function _t(t) {
    if (bt === void 0)
      try {
        throw Error();
      } catch (i) {
        var e = i.stack.trim().match(/\n( *(at )?)/);
        bt = e && e[1] || "", kt = -1 < i.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < i.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + bt + t + kt;
  }
  var Ot = !1;
  function zt(t, e) {
    if (!t || Ot) return "";
    Ot = !0;
    var i = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var s = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
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
                } catch (k) {
                  var O = k;
                }
                Reflect.construct(t, [], Y);
              } else {
                try {
                  Y.call();
                } catch (k) {
                  O = k;
                }
                t.call(Y.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (k) {
                O = k;
              }
              (Y = t()) && typeof Y.catch == "function" && Y.catch(function() {
              });
            }
          } catch (k) {
            if (k && O && typeof k.stack == "string")
              return [k.stack, O.stack];
          }
          return [null, null];
        }
      };
      s.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var o = Object.getOwnPropertyDescriptor(
        s.DetermineComponentFrameRoot,
        "name"
      );
      o && o.configurable && Object.defineProperty(
        s.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var c = s.DetermineComponentFrameRoot(), g = c[0], b = c[1];
      if (g && b) {
        var w = g.split(`
`), R = b.split(`
`);
        for (o = s = 0; s < w.length && !w[s].includes("DetermineComponentFrameRoot"); )
          s++;
        for (; o < R.length && !R[o].includes(
          "DetermineComponentFrameRoot"
        ); )
          o++;
        if (s === w.length || o === R.length)
          for (s = w.length - 1, o = R.length - 1; 1 <= s && 0 <= o && w[s] !== R[o]; )
            o--;
        for (; 1 <= s && 0 <= o; s--, o--)
          if (w[s] !== R[o]) {
            if (s !== 1 || o !== 1)
              do
                if (s--, o--, 0 > o || w[s] !== R[o]) {
                  var U = `
` + w[s].replace(" at new ", " at ");
                  return t.displayName && U.includes("<anonymous>") && (U = U.replace("<anonymous>", t.displayName)), U;
                }
              while (1 <= s && 0 <= o);
            break;
          }
      }
    } finally {
      Ot = !1, Error.prepareStackTrace = i;
    }
    return (i = t ? t.displayName || t.name : "") ? _t(i) : "";
  }
  function G(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return _t(t.type);
      case 16:
        return _t("Lazy");
      case 13:
        return _t("Suspense");
      case 19:
        return _t("SuspenseList");
      case 0:
      case 15:
        return t = zt(t.type, !1), t;
      case 11:
        return t = zt(t.type.render, !1), t;
      case 1:
        return t = zt(t.type, !0), t;
      default:
        return "";
    }
  }
  function $(t) {
    try {
      var e = "";
      do
        e += G(t), t = t.return;
      while (t);
      return e;
    } catch (i) {
      return `
Error generating stack: ` + i.message + `
` + i.stack;
    }
  }
  function K(t) {
    var e = t, i = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do
        e = t, e.flags & 4098 && (i = e.return), t = e.return;
      while (t);
    }
    return e.tag === 3 ? i : null;
  }
  function ot(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function E(t) {
    if (K(t) !== t)
      throw Error(r(188));
  }
  function X(t) {
    var e = t.alternate;
    if (!e) {
      if (e = K(t), e === null) throw Error(r(188));
      return e !== t ? null : t;
    }
    for (var i = t, s = e; ; ) {
      var o = i.return;
      if (o === null) break;
      var c = o.alternate;
      if (c === null) {
        if (s = o.return, s !== null) {
          i = s;
          continue;
        }
        break;
      }
      if (o.child === c.child) {
        for (c = o.child; c; ) {
          if (c === i) return E(o), t;
          if (c === s) return E(o), e;
          c = c.sibling;
        }
        throw Error(r(188));
      }
      if (i.return !== s.return) i = o, s = c;
      else {
        for (var g = !1, b = o.child; b; ) {
          if (b === i) {
            g = !0, i = o, s = c;
            break;
          }
          if (b === s) {
            g = !0, s = o, i = c;
            break;
          }
          b = b.sibling;
        }
        if (!g) {
          for (b = c.child; b; ) {
            if (b === i) {
              g = !0, i = c, s = o;
              break;
            }
            if (b === s) {
              g = !0, s = c, i = o;
              break;
            }
            b = b.sibling;
          }
          if (!g) throw Error(r(189));
        }
      }
      if (i.alternate !== s) throw Error(r(190));
    }
    if (i.tag !== 3) throw Error(r(188));
    return i.stateNode.current === i ? t : e;
  }
  function st(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = st(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  var at = Array.isArray, F = l.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ht = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ct = [], Kt = -1;
  function Mt(t) {
    return { current: t };
  }
  function Qt(t) {
    0 > Kt || (t.current = ct[Kt], ct[Kt] = null, Kt--);
  }
  function Vt(t, e) {
    Kt++, ct[Kt] = t.current, t.current = e;
  }
  var $e = Mt(null), Va = Mt(null), Rn = Mt(null), ll = Mt(null);
  function rl(t, e) {
    switch (Vt(Rn, e), Vt(Va, t), Vt($e, null), t = e.nodeType, t) {
      case 9:
      case 11:
        e = (e = e.documentElement) && (e = e.namespaceURI) ? tp(e) : 0;
        break;
      default:
        if (t = t === 8 ? e.parentNode : e, e = t.tagName, t = t.namespaceURI)
          t = tp(t), e = ep(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    Qt($e), Vt($e, e);
  }
  function Ui() {
    Qt($e), Qt(Va), Qt(Rn);
  }
  function $r(t) {
    t.memoizedState !== null && Vt(ll, t);
    var e = $e.current, i = ep(e, t.type);
    e !== i && (Vt(Va, t), Vt($e, i));
  }
  function ol(t) {
    Va.current === t && (Qt($e), Qt(Va)), ll.current === t && (Qt(ll), js._currentValue = ht);
  }
  var Wr = Object.prototype.hasOwnProperty, Ir = n.unstable_scheduleCallback, to = n.unstable_cancelCallback, Ov = n.unstable_shouldYield, Vv = n.unstable_requestPaint, We = n.unstable_now, kv = n.unstable_getCurrentPriorityLevel, Yf = n.unstable_ImmediatePriority, Xf = n.unstable_UserBlockingPriority, ul = n.unstable_NormalPriority, Bv = n.unstable_LowPriority, Zf = n.unstable_IdlePriority, Uv = n.log, Lv = n.unstable_setDisableYieldValue, ka = null, we = null;
  function Hv(t) {
    if (we && typeof we.onCommitFiberRoot == "function")
      try {
        we.onCommitFiberRoot(
          ka,
          t,
          void 0,
          (t.current.flags & 128) === 128
        );
      } catch {
      }
  }
  function Dn(t) {
    if (typeof Uv == "function" && Lv(t), we && typeof we.setStrictMode == "function")
      try {
        we.setStrictMode(ka, t);
      } catch {
      }
  }
  var Te = Math.clz32 ? Math.clz32 : Yv, qv = Math.log, Gv = Math.LN2;
  function Yv(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (qv(t) / Gv | 0) | 0;
  }
  var cl = 128, fl = 4194304;
  function ii(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
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
        return t & 4194176;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
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
        return t;
    }
  }
  function dl(t, e) {
    var i = t.pendingLanes;
    if (i === 0) return 0;
    var s = 0, o = t.suspendedLanes, c = t.pingedLanes, g = t.warmLanes;
    t = t.finishedLanes !== 0;
    var b = i & 134217727;
    return b !== 0 ? (i = b & ~o, i !== 0 ? s = ii(i) : (c &= b, c !== 0 ? s = ii(c) : t || (g = b & ~g, g !== 0 && (s = ii(g))))) : (b = i & ~o, b !== 0 ? s = ii(b) : c !== 0 ? s = ii(c) : t || (g = i & ~g, g !== 0 && (s = ii(g)))), s === 0 ? 0 : e !== 0 && e !== s && !(e & o) && (o = s & -s, g = e & -e, o >= g || o === 32 && (g & 4194176) !== 0) ? e : s;
  }
  function Ba(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Xv(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
        return e + 250;
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
        return e + 5e3;
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
  function Kf() {
    var t = cl;
    return cl <<= 1, !(cl & 4194176) && (cl = 128), t;
  }
  function Qf() {
    var t = fl;
    return fl <<= 1, !(fl & 62914560) && (fl = 4194304), t;
  }
  function eo(t) {
    for (var e = [], i = 0; 31 > i; i++) e.push(t);
    return e;
  }
  function Ua(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function Zv(t, e, i, s, o, c) {
    var g = t.pendingLanes;
    t.pendingLanes = i, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= i, t.entangledLanes &= i, t.errorRecoveryDisabledLanes &= i, t.shellSuspendCounter = 0;
    var b = t.entanglements, w = t.expirationTimes, R = t.hiddenUpdates;
    for (i = g & ~i; 0 < i; ) {
      var U = 31 - Te(i), Y = 1 << U;
      b[U] = 0, w[U] = -1;
      var O = R[U];
      if (O !== null)
        for (R[U] = null, U = 0; U < O.length; U++) {
          var k = O[U];
          k !== null && (k.lane &= -536870913);
        }
      i &= ~Y;
    }
    s !== 0 && Pf(t, s, 0), c !== 0 && o === 0 && t.tag !== 0 && (t.suspendedLanes |= c & ~(g & ~e));
  }
  function Pf(t, e, i) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var s = 31 - Te(e);
    t.entangledLanes |= e, t.entanglements[s] = t.entanglements[s] | 1073741824 | i & 4194218;
  }
  function Ff(t, e) {
    var i = t.entangledLanes |= e;
    for (t = t.entanglements; i; ) {
      var s = 31 - Te(i), o = 1 << s;
      o & e | t[s] & e && (t[s] |= e), i &= ~o;
    }
  }
  function Jf(t) {
    return t &= -t, 2 < t ? 8 < t ? t & 134217727 ? 32 : 268435456 : 8 : 2;
  }
  function $f() {
    var t = F.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : bp(t.type));
  }
  function Kv(t, e) {
    var i = F.p;
    try {
      return F.p = t, e();
    } finally {
      F.p = i;
    }
  }
  var Cn = Math.random().toString(36).slice(2), fe = "__reactFiber$" + Cn, be = "__reactProps$" + Cn, Li = "__reactContainer$" + Cn, no = "__reactEvents$" + Cn, Qv = "__reactListeners$" + Cn, Pv = "__reactHandles$" + Cn, Wf = "__reactResources$" + Cn, La = "__reactMarker$" + Cn;
  function io(t) {
    delete t[fe], delete t[be], delete t[no], delete t[Qv], delete t[Pv];
  }
  function ai(t) {
    var e = t[fe];
    if (e) return e;
    for (var i = t.parentNode; i; ) {
      if (e = i[Li] || i[fe]) {
        if (i = e.alternate, e.child !== null || i !== null && i.child !== null)
          for (t = ap(t); t !== null; ) {
            if (i = t[fe]) return i;
            t = ap(t);
          }
        return e;
      }
      t = i, i = t.parentNode;
    }
    return null;
  }
  function Hi(t) {
    if (t = t[fe] || t[Li]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function Ha(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(r(33));
  }
  function qi(t) {
    var e = t[Wf];
    return e || (e = t[Wf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function ne(t) {
    t[La] = !0;
  }
  var If = /* @__PURE__ */ new Set(), td = {};
  function si(t, e) {
    Gi(t, e), Gi(t + "Capture", e);
  }
  function Gi(t, e) {
    for (td[t] = e, t = 0; t < e.length; t++)
      If.add(e[t]);
  }
  var un = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Fv = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), ed = {}, nd = {};
  function Jv(t) {
    return Wr.call(nd, t) ? !0 : Wr.call(ed, t) ? !1 : Fv.test(t) ? nd[t] = !0 : (ed[t] = !0, !1);
  }
  function hl(t, e, i) {
    if (Jv(e))
      if (i === null) t.removeAttribute(e);
      else {
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var s = e.toLowerCase().slice(0, 5);
            if (s !== "data-" && s !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + i);
      }
  }
  function ml(t, e, i) {
    if (i === null) t.removeAttribute(e);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + i);
    }
  }
  function cn(t, e, i, s) {
    if (s === null) t.removeAttribute(i);
    else {
      switch (typeof s) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(i);
          return;
      }
      t.setAttributeNS(e, i, "" + s);
    }
  }
  function De(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function id(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function $v(t) {
    var e = id(t) ? "checked" : "value", i = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    ), s = "" + t[e];
    if (!t.hasOwnProperty(e) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
      var o = i.get, c = i.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return o.call(this);
        },
        set: function(g) {
          s = "" + g, c.call(this, g);
        }
      }), Object.defineProperty(t, e, {
        enumerable: i.enumerable
      }), {
        getValue: function() {
          return s;
        },
        setValue: function(g) {
          s = "" + g;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function pl(t) {
    t._valueTracker || (t._valueTracker = $v(t));
  }
  function ad(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var i = e.getValue(), s = "";
    return t && (s = id(t) ? t.checked ? "true" : "false" : t.value), t = s, t !== i ? (e.setValue(t), !0) : !1;
  }
  function gl(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Wv = /[\n"\\]/g;
  function Ce(t) {
    return t.replace(
      Wv,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ao(t, e, i, s, o, c, g, b) {
    t.name = "", g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? t.type = g : t.removeAttribute("type"), e != null ? g === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + De(e)) : t.value !== "" + De(e) && (t.value = "" + De(e)) : g !== "submit" && g !== "reset" || t.removeAttribute("value"), e != null ? so(t, g, De(e)) : i != null ? so(t, g, De(i)) : s != null && t.removeAttribute("value"), o == null && c != null && (t.defaultChecked = !!c), o != null && (t.checked = o && typeof o != "function" && typeof o != "symbol"), b != null && typeof b != "function" && typeof b != "symbol" && typeof b != "boolean" ? t.name = "" + De(b) : t.removeAttribute("name");
  }
  function sd(t, e, i, s, o, c, g, b) {
    if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.type = c), e != null || i != null) {
      if (!(c !== "submit" && c !== "reset" || e != null))
        return;
      i = i != null ? "" + De(i) : "", e = e != null ? "" + De(e) : i, b || e === t.value || (t.value = e), t.defaultValue = e;
    }
    s = s ?? o, s = typeof s != "function" && typeof s != "symbol" && !!s, t.checked = b ? t.checked : !!s, t.defaultChecked = !!s, g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" && (t.name = g);
  }
  function so(t, e, i) {
    e === "number" && gl(t.ownerDocument) === t || t.defaultValue === "" + i || (t.defaultValue = "" + i);
  }
  function Yi(t, e, i, s) {
    if (t = t.options, e) {
      e = {};
      for (var o = 0; o < i.length; o++)
        e["$" + i[o]] = !0;
      for (i = 0; i < t.length; i++)
        o = e.hasOwnProperty("$" + t[i].value), t[i].selected !== o && (t[i].selected = o), o && s && (t[i].defaultSelected = !0);
    } else {
      for (i = "" + De(i), e = null, o = 0; o < t.length; o++) {
        if (t[o].value === i) {
          t[o].selected = !0, s && (t[o].defaultSelected = !0);
          return;
        }
        e !== null || t[o].disabled || (e = t[o]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function ld(t, e, i) {
    if (e != null && (e = "" + De(e), e !== t.value && (t.value = e), i == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = i != null ? "" + De(i) : "";
  }
  function rd(t, e, i, s) {
    if (e == null) {
      if (s != null) {
        if (i != null) throw Error(r(92));
        if (at(s)) {
          if (1 < s.length) throw Error(r(93));
          s = s[0];
        }
        i = s;
      }
      i == null && (i = ""), e = i;
    }
    i = De(e), t.defaultValue = i, s = t.textContent, s === i && s !== "" && s !== null && (t.value = s);
  }
  function Xi(t, e) {
    if (e) {
      var i = t.firstChild;
      if (i && i === t.lastChild && i.nodeType === 3) {
        i.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Iv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function od(t, e, i) {
    var s = e.indexOf("--") === 0;
    i == null || typeof i == "boolean" || i === "" ? s ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : s ? t.setProperty(e, i) : typeof i != "number" || i === 0 || Iv.has(e) ? e === "float" ? t.cssFloat = i : t[e] = ("" + i).trim() : t[e] = i + "px";
  }
  function ud(t, e, i) {
    if (e != null && typeof e != "object")
      throw Error(r(62));
    if (t = t.style, i != null) {
      for (var s in i)
        !i.hasOwnProperty(s) || e != null && e.hasOwnProperty(s) || (s.indexOf("--") === 0 ? t.setProperty(s, "") : s === "float" ? t.cssFloat = "" : t[s] = "");
      for (var o in e)
        s = e[o], e.hasOwnProperty(o) && i[o] !== s && od(t, o, s);
    } else
      for (var c in e)
        e.hasOwnProperty(c) && od(t, c, e[c]);
  }
  function lo(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
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
  var tb = /* @__PURE__ */ new Map([
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
  ]), eb = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function yl(t) {
    return eb.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  var ro = null;
  function oo(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var Zi = null, Ki = null;
  function cd(t) {
    var e = Hi(t);
    if (e && (t = e.stateNode)) {
      var i = t[be] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (ao(
            t,
            i.value,
            i.defaultValue,
            i.defaultValue,
            i.checked,
            i.defaultChecked,
            i.type,
            i.name
          ), e = i.name, i.type === "radio" && e != null) {
            for (i = t; i.parentNode; ) i = i.parentNode;
            for (i = i.querySelectorAll(
              'input[name="' + Ce(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < i.length; e++) {
              var s = i[e];
              if (s !== t && s.form === t.form) {
                var o = s[be] || null;
                if (!o) throw Error(r(90));
                ao(
                  s,
                  o.value,
                  o.defaultValue,
                  o.defaultValue,
                  o.checked,
                  o.defaultChecked,
                  o.type,
                  o.name
                );
              }
            }
            for (e = 0; e < i.length; e++)
              s = i[e], s.form === t.form && ad(s);
          }
          break t;
        case "textarea":
          ld(t, i.value, i.defaultValue);
          break t;
        case "select":
          e = i.value, e != null && Yi(t, !!i.multiple, e, !1);
      }
    }
  }
  var uo = !1;
  function fd(t, e, i) {
    if (uo) return t(e, i);
    uo = !0;
    try {
      var s = t(e);
      return s;
    } finally {
      if (uo = !1, (Zi !== null || Ki !== null) && (tr(), Zi && (e = Zi, t = Ki, Ki = Zi = null, cd(e), t)))
        for (e = 0; e < t.length; e++) cd(t[e]);
    }
  }
  function qa(t, e) {
    var i = t.stateNode;
    if (i === null) return null;
    var s = i[be] || null;
    if (s === null) return null;
    i = s[e];
    t: switch (e) {
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
        (s = !s.disabled) || (t = t.type, s = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !s;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (i && typeof i != "function")
      throw Error(
        r(231, e, typeof i)
      );
    return i;
  }
  var co = !1;
  if (un)
    try {
      var Ga = {};
      Object.defineProperty(Ga, "passive", {
        get: function() {
          co = !0;
        }
      }), window.addEventListener("test", Ga, Ga), window.removeEventListener("test", Ga, Ga);
    } catch {
      co = !1;
    }
  var Nn = null, fo = null, vl = null;
  function dd() {
    if (vl) return vl;
    var t, e = fo, i = e.length, s, o = "value" in Nn ? Nn.value : Nn.textContent, c = o.length;
    for (t = 0; t < i && e[t] === o[t]; t++) ;
    var g = i - t;
    for (s = 1; s <= g && e[i - s] === o[c - s]; s++) ;
    return vl = o.slice(t, 1 < s ? 1 - s : void 0);
  }
  function bl(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function xl() {
    return !0;
  }
  function hd() {
    return !1;
  }
  function xe(t) {
    function e(i, s, o, c, g) {
      this._reactName = i, this._targetInst = o, this.type = s, this.nativeEvent = c, this.target = g, this.currentTarget = null;
      for (var b in t)
        t.hasOwnProperty(b) && (i = t[b], this[b] = i ? i(c) : c[b]);
      return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? xl : hd, this.isPropagationStopped = hd, this;
    }
    return et(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var i = this.nativeEvent;
        i && (i.preventDefault ? i.preventDefault() : typeof i.returnValue != "unknown" && (i.returnValue = !1), this.isDefaultPrevented = xl);
      },
      stopPropagation: function() {
        var i = this.nativeEvent;
        i && (i.stopPropagation ? i.stopPropagation() : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0), this.isPropagationStopped = xl);
      },
      persist: function() {
      },
      isPersistent: xl
    }), e;
  }
  var li = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Sl = xe(li), Ya = et({}, li, { view: 0, detail: 0 }), nb = xe(Ya), ho, mo, Xa, wl = et({}, Ya, {
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
    getModifierState: go,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== Xa && (Xa && t.type === "mousemove" ? (ho = t.screenX - Xa.screenX, mo = t.screenY - Xa.screenY) : mo = ho = 0, Xa = t), ho);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : mo;
    }
  }), md = xe(wl), ib = et({}, wl, { dataTransfer: 0 }), ab = xe(ib), sb = et({}, Ya, { relatedTarget: 0 }), po = xe(sb), lb = et({}, li, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), rb = xe(lb), ob = et({}, li, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), ub = xe(ob), cb = et({}, li, { data: 0 }), pd = xe(cb), fb = {
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
  }, db = {
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
  }, hb = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function mb(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = hb[t]) ? !!e[t] : !1;
  }
  function go() {
    return mb;
  }
  var pb = et({}, Ya, {
    key: function(t) {
      if (t.key) {
        var e = fb[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = bl(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? db[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: go,
    charCode: function(t) {
      return t.type === "keypress" ? bl(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? bl(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), gb = xe(pb), yb = et({}, wl, {
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
  }), gd = xe(yb), vb = et({}, Ya, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: go
  }), bb = xe(vb), xb = et({}, li, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Sb = xe(xb), wb = et({}, wl, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Tb = xe(wb), Ab = et({}, li, {
    newState: 0,
    oldState: 0
  }), Eb = xe(Ab), Mb = [9, 13, 27, 32], yo = un && "CompositionEvent" in window, Za = null;
  un && "documentMode" in document && (Za = document.documentMode);
  var jb = un && "TextEvent" in window && !Za, yd = un && (!yo || Za && 8 < Za && 11 >= Za), vd = " ", bd = !1;
  function xd(t, e) {
    switch (t) {
      case "keyup":
        return Mb.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Sd(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var Qi = !1;
  function Rb(t, e) {
    switch (t) {
      case "compositionend":
        return Sd(e);
      case "keypress":
        return e.which !== 32 ? null : (bd = !0, vd);
      case "textInput":
        return t = e.data, t === vd && bd ? null : t;
      default:
        return null;
    }
  }
  function Db(t, e) {
    if (Qi)
      return t === "compositionend" || !yo && xd(t, e) ? (t = dd(), vl = fo = Nn = null, Qi = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return yd && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Cb = {
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
  function wd(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!Cb[t.type] : e === "textarea";
  }
  function Td(t, e, i, s) {
    Zi ? Ki ? Ki.push(s) : Ki = [s] : Zi = s, e = sr(e, "onChange"), 0 < e.length && (i = new Sl(
      "onChange",
      "change",
      null,
      i,
      s
    ), t.push({ event: i, listeners: e }));
  }
  var Ka = null, Qa = null;
  function Nb(t) {
    Fm(t, 0);
  }
  function Tl(t) {
    var e = Ha(t);
    if (ad(e)) return t;
  }
  function Ad(t, e) {
    if (t === "change") return e;
  }
  var Ed = !1;
  if (un) {
    var vo;
    if (un) {
      var bo = "oninput" in document;
      if (!bo) {
        var Md = document.createElement("div");
        Md.setAttribute("oninput", "return;"), bo = typeof Md.oninput == "function";
      }
      vo = bo;
    } else vo = !1;
    Ed = vo && (!document.documentMode || 9 < document.documentMode);
  }
  function jd() {
    Ka && (Ka.detachEvent("onpropertychange", Rd), Qa = Ka = null);
  }
  function Rd(t) {
    if (t.propertyName === "value" && Tl(Qa)) {
      var e = [];
      Td(
        e,
        Qa,
        t,
        oo(t)
      ), fd(Nb, e);
    }
  }
  function zb(t, e, i) {
    t === "focusin" ? (jd(), Ka = e, Qa = i, Ka.attachEvent("onpropertychange", Rd)) : t === "focusout" && jd();
  }
  function _b(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Tl(Qa);
  }
  function Ob(t, e) {
    if (t === "click") return Tl(e);
  }
  function Vb(t, e) {
    if (t === "input" || t === "change")
      return Tl(e);
  }
  function kb(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var Ae = typeof Object.is == "function" ? Object.is : kb;
  function Pa(t, e) {
    if (Ae(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var i = Object.keys(t), s = Object.keys(e);
    if (i.length !== s.length) return !1;
    for (s = 0; s < i.length; s++) {
      var o = i[s];
      if (!Wr.call(e, o) || !Ae(t[o], e[o]))
        return !1;
    }
    return !0;
  }
  function Dd(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Cd(t, e) {
    var i = Dd(t);
    t = 0;
    for (var s; i; ) {
      if (i.nodeType === 3) {
        if (s = t + i.textContent.length, t <= e && s >= e)
          return { node: i, offset: e - t };
        t = s;
      }
      t: {
        for (; i; ) {
          if (i.nextSibling) {
            i = i.nextSibling;
            break t;
          }
          i = i.parentNode;
        }
        i = void 0;
      }
      i = Dd(i);
    }
  }
  function Nd(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Nd(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function zd(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = gl(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var i = typeof e.contentWindow.location.href == "string";
      } catch {
        i = !1;
      }
      if (i) t = e.contentWindow;
      else break;
      e = gl(t.document);
    }
    return e;
  }
  function xo(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  function Bb(t, e) {
    var i = zd(e);
    e = t.focusedElem;
    var s = t.selectionRange;
    if (i !== e && e && e.ownerDocument && Nd(e.ownerDocument.documentElement, e)) {
      if (s !== null && xo(e)) {
        if (t = s.start, i = s.end, i === void 0 && (i = t), "selectionStart" in e)
          e.selectionStart = t, e.selectionEnd = Math.min(
            i,
            e.value.length
          );
        else if (i = (t = e.ownerDocument || document) && t.defaultView || window, i.getSelection) {
          i = i.getSelection();
          var o = e.textContent.length, c = Math.min(s.start, o);
          s = s.end === void 0 ? c : Math.min(s.end, o), !i.extend && c > s && (o = s, s = c, c = o), o = Cd(e, c);
          var g = Cd(
            e,
            s
          );
          o && g && (i.rangeCount !== 1 || i.anchorNode !== o.node || i.anchorOffset !== o.offset || i.focusNode !== g.node || i.focusOffset !== g.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), i.removeAllRanges(), c > s ? (i.addRange(t), i.extend(g.node, g.offset)) : (t.setEnd(
            g.node,
            g.offset
          ), i.addRange(t)));
        }
      }
      for (t = [], i = e; i = i.parentNode; )
        i.nodeType === 1 && t.push({
          element: i,
          left: i.scrollLeft,
          top: i.scrollTop
        });
      for (typeof e.focus == "function" && e.focus(), e = 0; e < t.length; e++)
        i = t[e], i.element.scrollLeft = i.left, i.element.scrollTop = i.top;
    }
  }
  var Ub = un && "documentMode" in document && 11 >= document.documentMode, Pi = null, So = null, Fa = null, wo = !1;
  function _d(t, e, i) {
    var s = i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument;
    wo || Pi == null || Pi !== gl(s) || (s = Pi, "selectionStart" in s && xo(s) ? s = { start: s.selectionStart, end: s.selectionEnd } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = {
      anchorNode: s.anchorNode,
      anchorOffset: s.anchorOffset,
      focusNode: s.focusNode,
      focusOffset: s.focusOffset
    }), Fa && Pa(Fa, s) || (Fa = s, s = sr(So, "onSelect"), 0 < s.length && (e = new Sl(
      "onSelect",
      "select",
      null,
      e,
      i
    ), t.push({ event: e, listeners: s }), e.target = Pi)));
  }
  function ri(t, e) {
    var i = {};
    return i[t.toLowerCase()] = e.toLowerCase(), i["Webkit" + t] = "webkit" + e, i["Moz" + t] = "moz" + e, i;
  }
  var Fi = {
    animationend: ri("Animation", "AnimationEnd"),
    animationiteration: ri("Animation", "AnimationIteration"),
    animationstart: ri("Animation", "AnimationStart"),
    transitionrun: ri("Transition", "TransitionRun"),
    transitionstart: ri("Transition", "TransitionStart"),
    transitioncancel: ri("Transition", "TransitionCancel"),
    transitionend: ri("Transition", "TransitionEnd")
  }, To = {}, Od = {};
  un && (Od = document.createElement("div").style, "AnimationEvent" in window || (delete Fi.animationend.animation, delete Fi.animationiteration.animation, delete Fi.animationstart.animation), "TransitionEvent" in window || delete Fi.transitionend.transition);
  function oi(t) {
    if (To[t]) return To[t];
    if (!Fi[t]) return t;
    var e = Fi[t], i;
    for (i in e)
      if (e.hasOwnProperty(i) && i in Od)
        return To[t] = e[i];
    return t;
  }
  var Vd = oi("animationend"), kd = oi("animationiteration"), Bd = oi("animationstart"), Lb = oi("transitionrun"), Hb = oi("transitionstart"), qb = oi("transitioncancel"), Ud = oi("transitionend"), Ld = /* @__PURE__ */ new Map(), Hd = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(
    " "
  );
  function Ye(t, e) {
    Ld.set(t, e), si(e, [t]);
  }
  var Ne = [], Ji = 0, Ao = 0;
  function Al() {
    for (var t = Ji, e = Ao = Ji = 0; e < t; ) {
      var i = Ne[e];
      Ne[e++] = null;
      var s = Ne[e];
      Ne[e++] = null;
      var o = Ne[e];
      Ne[e++] = null;
      var c = Ne[e];
      if (Ne[e++] = null, s !== null && o !== null) {
        var g = s.pending;
        g === null ? o.next = o : (o.next = g.next, g.next = o), s.pending = o;
      }
      c !== 0 && qd(i, o, c);
    }
  }
  function El(t, e, i, s) {
    Ne[Ji++] = t, Ne[Ji++] = e, Ne[Ji++] = i, Ne[Ji++] = s, Ao |= s, t.lanes |= s, t = t.alternate, t !== null && (t.lanes |= s);
  }
  function Eo(t, e, i, s) {
    return El(t, e, i, s), Ml(t);
  }
  function zn(t, e) {
    return El(t, null, null, e), Ml(t);
  }
  function qd(t, e, i) {
    t.lanes |= i;
    var s = t.alternate;
    s !== null && (s.lanes |= i);
    for (var o = !1, c = t.return; c !== null; )
      c.childLanes |= i, s = c.alternate, s !== null && (s.childLanes |= i), c.tag === 22 && (t = c.stateNode, t === null || t._visibility & 1 || (o = !0)), t = c, c = c.return;
    o && e !== null && t.tag === 3 && (c = t.stateNode, o = 31 - Te(i), c = c.hiddenUpdates, t = c[o], t === null ? c[o] = [e] : t.push(e), e.lane = i | 536870912);
  }
  function Ml(t) {
    if (50 < xs)
      throw xs = 0, Nu = null, Error(r(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var $i = {}, Gd = /* @__PURE__ */ new WeakMap();
  function ze(t, e) {
    if (typeof t == "object" && t !== null) {
      var i = Gd.get(t);
      return i !== void 0 ? i : (e = {
        value: t,
        source: e,
        stack: $(e)
      }, Gd.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: $(e)
    };
  }
  var Wi = [], Ii = 0, jl = null, Rl = 0, _e = [], Oe = 0, ui = null, fn = 1, dn = "";
  function ci(t, e) {
    Wi[Ii++] = Rl, Wi[Ii++] = jl, jl = t, Rl = e;
  }
  function Yd(t, e, i) {
    _e[Oe++] = fn, _e[Oe++] = dn, _e[Oe++] = ui, ui = t;
    var s = fn;
    t = dn;
    var o = 32 - Te(s) - 1;
    s &= ~(1 << o), i += 1;
    var c = 32 - Te(e) + o;
    if (30 < c) {
      var g = o - o % 5;
      c = (s & (1 << g) - 1).toString(32), s >>= g, o -= g, fn = 1 << 32 - Te(e) + o | i << o | s, dn = c + t;
    } else
      fn = 1 << c | i << o | s, dn = t;
  }
  function Mo(t) {
    t.return !== null && (ci(t, 1), Yd(t, 1, 0));
  }
  function jo(t) {
    for (; t === jl; )
      jl = Wi[--Ii], Wi[Ii] = null, Rl = Wi[--Ii], Wi[Ii] = null;
    for (; t === ui; )
      ui = _e[--Oe], _e[Oe] = null, dn = _e[--Oe], _e[Oe] = null, fn = _e[--Oe], _e[Oe] = null;
  }
  var ge = null, oe = null, At = !1, Xe = null, Ie = !1, Ro = Error(r(519));
  function fi(t) {
    var e = Error(r(418, ""));
    throw Wa(ze(e, t)), Ro;
  }
  function Xd(t) {
    var e = t.stateNode, i = t.type, s = t.memoizedProps;
    switch (e[fe] = t, e[be] = s, i) {
      case "dialog":
        xt("cancel", e), xt("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        xt("load", e);
        break;
      case "video":
      case "audio":
        for (i = 0; i < ws.length; i++)
          xt(ws[i], e);
        break;
      case "source":
        xt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        xt("error", e), xt("load", e);
        break;
      case "details":
        xt("toggle", e);
        break;
      case "input":
        xt("invalid", e), sd(
          e,
          s.value,
          s.defaultValue,
          s.checked,
          s.defaultChecked,
          s.type,
          s.name,
          !0
        ), pl(e);
        break;
      case "select":
        xt("invalid", e);
        break;
      case "textarea":
        xt("invalid", e), rd(e, s.value, s.defaultValue, s.children), pl(e);
    }
    i = s.children, typeof i != "string" && typeof i != "number" && typeof i != "bigint" || e.textContent === "" + i || s.suppressHydrationWarning === !0 || Im(e.textContent, i) ? (s.popover != null && (xt("beforetoggle", e), xt("toggle", e)), s.onScroll != null && xt("scroll", e), s.onScrollEnd != null && xt("scrollend", e), s.onClick != null && (e.onclick = lr), e = !0) : e = !1, e || fi(t);
  }
  function Zd(t) {
    for (ge = t.return; ge; )
      switch (ge.tag) {
        case 3:
        case 27:
          Ie = !0;
          return;
        case 5:
        case 13:
          Ie = !1;
          return;
        default:
          ge = ge.return;
      }
  }
  function Ja(t) {
    if (t !== ge) return !1;
    if (!At) return Zd(t), At = !0, !1;
    var e = !1, i;
    if ((i = t.tag !== 3 && t.tag !== 27) && ((i = t.tag === 5) && (i = t.type, i = !(i !== "form" && i !== "button") || Pu(t.type, t.memoizedProps)), i = !i), i && (e = !0), e && oe && fi(t), Zd(t), t.tag === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (i = t.data, i === "/$") {
              if (e === 0) {
                oe = Ke(t.nextSibling);
                break t;
              }
              e--;
            } else
              i !== "$" && i !== "$!" && i !== "$?" || e++;
          t = t.nextSibling;
        }
        oe = null;
      }
    } else
      oe = ge ? Ke(t.stateNode.nextSibling) : null;
    return !0;
  }
  function $a() {
    oe = ge = null, At = !1;
  }
  function Wa(t) {
    Xe === null ? Xe = [t] : Xe.push(t);
  }
  var Ia = Error(r(460)), Kd = Error(r(474)), Do = { then: function() {
  } };
  function Qd(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Dl() {
  }
  function Pd(t, e, i) {
    switch (i = t[i], i === void 0 ? t.push(e) : i !== e && (e.then(Dl, Dl), e = i), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, t === Ia ? Error(r(483)) : t;
      default:
        if (typeof e.status == "string") e.then(Dl, Dl);
        else {
          if (t = Ct, t !== null && 100 < t.shellSuspendCounter)
            throw Error(r(482));
          t = e, t.status = "pending", t.then(
            function(s) {
              if (e.status === "pending") {
                var o = e;
                o.status = "fulfilled", o.value = s;
              }
            },
            function(s) {
              if (e.status === "pending") {
                var o = e;
                o.status = "rejected", o.reason = s;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, t === Ia ? Error(r(483)) : t;
        }
        throw ts = e, Ia;
    }
  }
  var ts = null;
  function Fd() {
    if (ts === null) throw Error(r(459));
    var t = ts;
    return ts = null, t;
  }
  var ta = null, es = 0;
  function Cl(t) {
    var e = es;
    return es += 1, ta === null && (ta = []), Pd(ta, t, e);
  }
  function ns(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Nl(t, e) {
    throw e.$$typeof === d ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function Jd(t) {
    var e = t._init;
    return e(t._payload);
  }
  function $d(t) {
    function e(D, j) {
      if (t) {
        var N = D.deletions;
        N === null ? (D.deletions = [j], D.flags |= 16) : N.push(j);
      }
    }
    function i(D, j) {
      if (!t) return null;
      for (; j !== null; )
        e(D, j), j = j.sibling;
      return null;
    }
    function s(D) {
      for (var j = /* @__PURE__ */ new Map(); D !== null; )
        D.key !== null ? j.set(D.key, D) : j.set(D.index, D), D = D.sibling;
      return j;
    }
    function o(D, j) {
      return D = Xn(D, j), D.index = 0, D.sibling = null, D;
    }
    function c(D, j, N) {
      return D.index = N, t ? (N = D.alternate, N !== null ? (N = N.index, N < j ? (D.flags |= 33554434, j) : N) : (D.flags |= 33554434, j)) : (D.flags |= 1048576, j);
    }
    function g(D) {
      return t && D.alternate === null && (D.flags |= 33554434), D;
    }
    function b(D, j, N, H) {
      return j === null || j.tag !== 6 ? (j = Tu(N, D.mode, H), j.return = D, j) : (j = o(j, N), j.return = D, j);
    }
    function w(D, j, N, H) {
      var W = N.type;
      return W === h ? U(
        D,
        j,
        N.props.children,
        H,
        N.key
      ) : j !== null && (j.elementType === W || typeof W == "object" && W !== null && W.$$typeof === q && Jd(W) === j.type) ? (j = o(j, N.props), ns(j, N), j.return = D, j) : (j = Fl(
        N.type,
        N.key,
        N.props,
        null,
        D.mode,
        H
      ), ns(j, N), j.return = D, j);
    }
    function R(D, j, N, H) {
      return j === null || j.tag !== 4 || j.stateNode.containerInfo !== N.containerInfo || j.stateNode.implementation !== N.implementation ? (j = Au(N, D.mode, H), j.return = D, j) : (j = o(j, N.children || []), j.return = D, j);
    }
    function U(D, j, N, H, W) {
      return j === null || j.tag !== 7 ? (j = Si(
        N,
        D.mode,
        H,
        W
      ), j.return = D, j) : (j = o(j, N), j.return = D, j);
    }
    function Y(D, j, N) {
      if (typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint")
        return j = Tu(
          "" + j,
          D.mode,
          N
        ), j.return = D, j;
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case f:
            return N = Fl(
              j.type,
              j.key,
              j.props,
              null,
              D.mode,
              N
            ), ns(N, j), N.return = D, N;
          case m:
            return j = Au(
              j,
              D.mode,
              N
            ), j.return = D, j;
          case q:
            var H = j._init;
            return j = H(j._payload), Y(D, j, N);
        }
        if (at(j) || B(j))
          return j = Si(
            j,
            D.mode,
            N,
            null
          ), j.return = D, j;
        if (typeof j.then == "function")
          return Y(D, Cl(j), N);
        if (j.$$typeof === T)
          return Y(
            D,
            Kl(D, j),
            N
          );
        Nl(D, j);
      }
      return null;
    }
    function O(D, j, N, H) {
      var W = j !== null ? j.key : null;
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return W !== null ? null : b(D, j, "" + N, H);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case f:
            return N.key === W ? w(D, j, N, H) : null;
          case m:
            return N.key === W ? R(D, j, N, H) : null;
          case q:
            return W = N._init, N = W(N._payload), O(D, j, N, H);
        }
        if (at(N) || B(N))
          return W !== null ? null : U(D, j, N, H, null);
        if (typeof N.then == "function")
          return O(
            D,
            j,
            Cl(N),
            H
          );
        if (N.$$typeof === T)
          return O(
            D,
            j,
            Kl(D, N),
            H
          );
        Nl(D, N);
      }
      return null;
    }
    function k(D, j, N, H, W) {
      if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint")
        return D = D.get(N) || null, b(j, D, "" + H, W);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case f:
            return D = D.get(
              H.key === null ? N : H.key
            ) || null, w(j, D, H, W);
          case m:
            return D = D.get(
              H.key === null ? N : H.key
            ) || null, R(j, D, H, W);
          case q:
            var pt = H._init;
            return H = pt(H._payload), k(
              D,
              j,
              N,
              H,
              W
            );
        }
        if (at(H) || B(H))
          return D = D.get(N) || null, U(j, D, H, W, null);
        if (typeof H.then == "function")
          return k(
            D,
            j,
            N,
            Cl(H),
            W
          );
        if (H.$$typeof === T)
          return k(
            D,
            j,
            N,
            Kl(j, H),
            W
          );
        Nl(j, H);
      }
      return null;
    }
    function nt(D, j, N, H) {
      for (var W = null, pt = null, it = j, lt = j = 0, se = null; it !== null && lt < N.length; lt++) {
        it.index > lt ? (se = it, it = null) : se = it.sibling;
        var Et = O(
          D,
          it,
          N[lt],
          H
        );
        if (Et === null) {
          it === null && (it = se);
          break;
        }
        t && it && Et.alternate === null && e(D, it), j = c(Et, j, lt), pt === null ? W = Et : pt.sibling = Et, pt = Et, it = se;
      }
      if (lt === N.length)
        return i(D, it), At && ci(D, lt), W;
      if (it === null) {
        for (; lt < N.length; lt++)
          it = Y(D, N[lt], H), it !== null && (j = c(
            it,
            j,
            lt
          ), pt === null ? W = it : pt.sibling = it, pt = it);
        return At && ci(D, lt), W;
      }
      for (it = s(it); lt < N.length; lt++)
        se = k(
          it,
          D,
          lt,
          N[lt],
          H
        ), se !== null && (t && se.alternate !== null && it.delete(
          se.key === null ? lt : se.key
        ), j = c(
          se,
          j,
          lt
        ), pt === null ? W = se : pt.sibling = se, pt = se);
      return t && it.forEach(function($n) {
        return e(D, $n);
      }), At && ci(D, lt), W;
    }
    function ut(D, j, N, H) {
      if (N == null) throw Error(r(151));
      for (var W = null, pt = null, it = j, lt = j = 0, se = null, Et = N.next(); it !== null && !Et.done; lt++, Et = N.next()) {
        it.index > lt ? (se = it, it = null) : se = it.sibling;
        var $n = O(D, it, Et.value, H);
        if ($n === null) {
          it === null && (it = se);
          break;
        }
        t && it && $n.alternate === null && e(D, it), j = c($n, j, lt), pt === null ? W = $n : pt.sibling = $n, pt = $n, it = se;
      }
      if (Et.done)
        return i(D, it), At && ci(D, lt), W;
      if (it === null) {
        for (; !Et.done; lt++, Et = N.next())
          Et = Y(D, Et.value, H), Et !== null && (j = c(Et, j, lt), pt === null ? W = Et : pt.sibling = Et, pt = Et);
        return At && ci(D, lt), W;
      }
      for (it = s(it); !Et.done; lt++, Et = N.next())
        Et = k(it, D, lt, Et.value, H), Et !== null && (t && Et.alternate !== null && it.delete(Et.key === null ? lt : Et.key), j = c(Et, j, lt), pt === null ? W = Et : pt.sibling = Et, pt = Et);
      return t && it.forEach(function(e1) {
        return e(D, e1);
      }), At && ci(D, lt), W;
    }
    function Gt(D, j, N, H) {
      if (typeof N == "object" && N !== null && N.type === h && N.key === null && (N = N.props.children), typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case f:
            t: {
              for (var W = N.key; j !== null; ) {
                if (j.key === W) {
                  if (W = N.type, W === h) {
                    if (j.tag === 7) {
                      i(
                        D,
                        j.sibling
                      ), H = o(
                        j,
                        N.props.children
                      ), H.return = D, D = H;
                      break t;
                    }
                  } else if (j.elementType === W || typeof W == "object" && W !== null && W.$$typeof === q && Jd(W) === j.type) {
                    i(
                      D,
                      j.sibling
                    ), H = o(j, N.props), ns(H, N), H.return = D, D = H;
                    break t;
                  }
                  i(D, j);
                  break;
                } else e(D, j);
                j = j.sibling;
              }
              N.type === h ? (H = Si(
                N.props.children,
                D.mode,
                H,
                N.key
              ), H.return = D, D = H) : (H = Fl(
                N.type,
                N.key,
                N.props,
                null,
                D.mode,
                H
              ), ns(H, N), H.return = D, D = H);
            }
            return g(D);
          case m:
            t: {
              for (W = N.key; j !== null; ) {
                if (j.key === W)
                  if (j.tag === 4 && j.stateNode.containerInfo === N.containerInfo && j.stateNode.implementation === N.implementation) {
                    i(
                      D,
                      j.sibling
                    ), H = o(j, N.children || []), H.return = D, D = H;
                    break t;
                  } else {
                    i(D, j);
                    break;
                  }
                else e(D, j);
                j = j.sibling;
              }
              H = Au(N, D.mode, H), H.return = D, D = H;
            }
            return g(D);
          case q:
            return W = N._init, N = W(N._payload), Gt(
              D,
              j,
              N,
              H
            );
        }
        if (at(N))
          return nt(
            D,
            j,
            N,
            H
          );
        if (B(N)) {
          if (W = B(N), typeof W != "function") throw Error(r(150));
          return N = W.call(N), ut(
            D,
            j,
            N,
            H
          );
        }
        if (typeof N.then == "function")
          return Gt(
            D,
            j,
            Cl(N),
            H
          );
        if (N.$$typeof === T)
          return Gt(
            D,
            j,
            Kl(D, N),
            H
          );
        Nl(D, N);
      }
      return typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint" ? (N = "" + N, j !== null && j.tag === 6 ? (i(D, j.sibling), H = o(j, N), H.return = D, D = H) : (i(D, j), H = Tu(N, D.mode, H), H.return = D, D = H), g(D)) : i(D, j);
    }
    return function(D, j, N, H) {
      try {
        es = 0;
        var W = Gt(
          D,
          j,
          N,
          H
        );
        return ta = null, W;
      } catch (it) {
        if (it === Ia) throw it;
        var pt = Ue(29, it, null, D.mode);
        return pt.lanes = H, pt.return = D, pt;
      } finally {
      }
    };
  }
  var di = $d(!0), Wd = $d(!1), ea = Mt(null), zl = Mt(0);
  function Id(t, e) {
    t = Tn, Vt(zl, t), Vt(ea, e), Tn = t | e.baseLanes;
  }
  function Co() {
    Vt(zl, Tn), Vt(ea, ea.current);
  }
  function No() {
    Tn = zl.current, Qt(ea), Qt(zl);
  }
  var Ve = Mt(null), tn = null;
  function _n(t) {
    var e = t.alternate;
    Vt(Wt, Wt.current & 1), Vt(Ve, t), tn === null && (e === null || ea.current !== null || e.memoizedState !== null) && (tn = t);
  }
  function th(t) {
    if (t.tag === 22) {
      if (Vt(Wt, Wt.current), Vt(Ve, t), tn === null) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (tn = t);
      }
    } else On();
  }
  function On() {
    Vt(Wt, Wt.current), Vt(Ve, Ve.current);
  }
  function hn(t) {
    Qt(Ve), tn === t && (tn = null), Qt(Wt);
  }
  var Wt = Mt(0);
  function _l(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var i = e.memoizedState;
        if (i !== null && (i = i.dehydrated, i === null || i.data === "$?" || i.data === "$!"))
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
        if (e.flags & 128) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var Gb = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(i, s) {
        t.push(s);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(i) {
        return i();
      });
    };
  }, Yb = n.unstable_scheduleCallback, Xb = n.unstable_NormalPriority, It = {
    $$typeof: T,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function zo() {
    return {
      controller: new Gb(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function is(t) {
    t.refCount--, t.refCount === 0 && Yb(Xb, function() {
      t.controller.abort();
    });
  }
  var as = null, _o = 0, na = 0, ia = null;
  function Zb(t, e) {
    if (as === null) {
      var i = as = [];
      _o = 0, na = Lu(), ia = {
        status: "pending",
        value: void 0,
        then: function(s) {
          i.push(s);
        }
      };
    }
    return _o++, e.then(eh, eh), e;
  }
  function eh() {
    if (--_o === 0 && as !== null) {
      ia !== null && (ia.status = "fulfilled");
      var t = as;
      as = null, na = 0, ia = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function Kb(t, e) {
    var i = [], s = {
      status: "pending",
      value: null,
      reason: null,
      then: function(o) {
        i.push(o);
      }
    };
    return t.then(
      function() {
        s.status = "fulfilled", s.value = e;
        for (var o = 0; o < i.length; o++) (0, i[o])(e);
      },
      function(o) {
        for (s.status = "rejected", s.reason = o, o = 0; o < i.length; o++)
          (0, i[o])(void 0);
      }
    ), s;
  }
  var nh = Z.S;
  Z.S = function(t, e) {
    typeof e == "object" && e !== null && typeof e.then == "function" && Zb(t, e), nh !== null && nh(t, e);
  };
  var hi = Mt(null);
  function Oo() {
    var t = hi.current;
    return t !== null ? t : Ct.pooledCache;
  }
  function Ol(t, e) {
    e === null ? Vt(hi, hi.current) : Vt(hi, e.pool);
  }
  function ih() {
    var t = Oo();
    return t === null ? null : { parent: It._currentValue, pool: t };
  }
  var Vn = 0, mt = null, jt = null, Pt = null, Vl = !1, aa = !1, mi = !1, kl = 0, ss = 0, sa = null, Qb = 0;
  function Xt() {
    throw Error(r(321));
  }
  function Vo(t, e) {
    if (e === null) return !1;
    for (var i = 0; i < e.length && i < t.length; i++)
      if (!Ae(t[i], e[i])) return !1;
    return !0;
  }
  function ko(t, e, i, s, o, c) {
    return Vn = c, mt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, Z.H = t === null || t.memoizedState === null ? pi : kn, mi = !1, c = i(s, o), mi = !1, aa && (c = sh(
      e,
      i,
      s,
      o
    )), ah(t), c;
  }
  function ah(t) {
    Z.H = en;
    var e = jt !== null && jt.next !== null;
    if (Vn = 0, Pt = jt = mt = null, Vl = !1, ss = 0, sa = null, e) throw Error(r(300));
    t === null || ie || (t = t.dependencies, t !== null && Zl(t) && (ie = !0));
  }
  function sh(t, e, i, s) {
    mt = t;
    var o = 0;
    do {
      if (aa && (sa = null), ss = 0, aa = !1, 25 <= o) throw Error(r(301));
      if (o += 1, Pt = jt = null, t.updateQueue != null) {
        var c = t.updateQueue;
        c.lastEffect = null, c.events = null, c.stores = null, c.memoCache != null && (c.memoCache.index = 0);
      }
      Z.H = gi, c = e(i, s);
    } while (aa);
    return c;
  }
  function Pb() {
    var t = Z.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? ls(e) : e, t = t.useState()[0], (jt !== null ? jt.memoizedState : null) !== t && (mt.flags |= 1024), e;
  }
  function Bo() {
    var t = kl !== 0;
    return kl = 0, t;
  }
  function Uo(t, e, i) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~i;
  }
  function Lo(t) {
    if (Vl) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      Vl = !1;
    }
    Vn = 0, Pt = jt = mt = null, aa = !1, ss = kl = 0, sa = null;
  }
  function Se() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Pt === null ? mt.memoizedState = Pt = t : Pt = Pt.next = t, Pt;
  }
  function Ft() {
    if (jt === null) {
      var t = mt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = jt.next;
    var e = Pt === null ? mt.memoizedState : Pt.next;
    if (e !== null)
      Pt = e, jt = t;
    else {
      if (t === null)
        throw mt.alternate === null ? Error(r(467)) : Error(r(310));
      jt = t, t = {
        memoizedState: jt.memoizedState,
        baseState: jt.baseState,
        baseQueue: jt.baseQueue,
        queue: jt.queue,
        next: null
      }, Pt === null ? mt.memoizedState = Pt = t : Pt = Pt.next = t;
    }
    return Pt;
  }
  var Bl;
  Bl = function() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  };
  function ls(t) {
    var e = ss;
    return ss += 1, sa === null && (sa = []), t = Pd(sa, t, e), e = mt, (Pt === null ? e.memoizedState : Pt.next) === null && (e = e.alternate, Z.H = e === null || e.memoizedState === null ? pi : kn), t;
  }
  function Ul(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return ls(t);
      if (t.$$typeof === T) return de(t);
    }
    throw Error(r(438, String(t)));
  }
  function Ho(t) {
    var e = null, i = mt.updateQueue;
    if (i !== null && (e = i.memoCache), e == null) {
      var s = mt.alternate;
      s !== null && (s = s.updateQueue, s !== null && (s = s.memoCache, s != null && (e = {
        data: s.data.map(function(o) {
          return o.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), i === null && (i = Bl(), mt.updateQueue = i), i.memoCache = e, i = e.data[e.index], i === void 0)
      for (i = e.data[e.index] = Array(t), s = 0; s < t; s++)
        i[s] = Q;
    return e.index++, i;
  }
  function mn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function Ll(t) {
    var e = Ft();
    return qo(e, jt, t);
  }
  function qo(t, e, i) {
    var s = t.queue;
    if (s === null) throw Error(r(311));
    s.lastRenderedReducer = i;
    var o = t.baseQueue, c = s.pending;
    if (c !== null) {
      if (o !== null) {
        var g = o.next;
        o.next = c.next, c.next = g;
      }
      e.baseQueue = o = c, s.pending = null;
    }
    if (c = t.baseState, o === null) t.memoizedState = c;
    else {
      e = o.next;
      var b = g = null, w = null, R = e, U = !1;
      do {
        var Y = R.lane & -536870913;
        if (Y !== R.lane ? (St & Y) === Y : (Vn & Y) === Y) {
          var O = R.revertLane;
          if (O === 0)
            w !== null && (w = w.next = {
              lane: 0,
              revertLane: 0,
              action: R.action,
              hasEagerState: R.hasEagerState,
              eagerState: R.eagerState,
              next: null
            }), Y === na && (U = !0);
          else if ((Vn & O) === O) {
            R = R.next, O === na && (U = !0);
            continue;
          } else
            Y = {
              lane: 0,
              revertLane: R.revertLane,
              action: R.action,
              hasEagerState: R.hasEagerState,
              eagerState: R.eagerState,
              next: null
            }, w === null ? (b = w = Y, g = c) : w = w.next = Y, mt.lanes |= O, Zn |= O;
          Y = R.action, mi && i(c, Y), c = R.hasEagerState ? R.eagerState : i(c, Y);
        } else
          O = {
            lane: Y,
            revertLane: R.revertLane,
            action: R.action,
            hasEagerState: R.hasEagerState,
            eagerState: R.eagerState,
            next: null
          }, w === null ? (b = w = O, g = c) : w = w.next = O, mt.lanes |= Y, Zn |= Y;
        R = R.next;
      } while (R !== null && R !== e);
      if (w === null ? g = c : w.next = b, !Ae(c, t.memoizedState) && (ie = !0, U && (i = ia, i !== null)))
        throw i;
      t.memoizedState = c, t.baseState = g, t.baseQueue = w, s.lastRenderedState = c;
    }
    return o === null && (s.lanes = 0), [t.memoizedState, s.dispatch];
  }
  function Go(t) {
    var e = Ft(), i = e.queue;
    if (i === null) throw Error(r(311));
    i.lastRenderedReducer = t;
    var s = i.dispatch, o = i.pending, c = e.memoizedState;
    if (o !== null) {
      i.pending = null;
      var g = o = o.next;
      do
        c = t(c, g.action), g = g.next;
      while (g !== o);
      Ae(c, e.memoizedState) || (ie = !0), e.memoizedState = c, e.baseQueue === null && (e.baseState = c), i.lastRenderedState = c;
    }
    return [c, s];
  }
  function lh(t, e, i) {
    var s = mt, o = Ft(), c = At;
    if (c) {
      if (i === void 0) throw Error(r(407));
      i = i();
    } else i = e();
    var g = !Ae(
      (jt || o).memoizedState,
      i
    );
    if (g && (o.memoizedState = i, ie = !0), o = o.queue, Zo(uh.bind(null, s, o, t), [
      t
    ]), o.getSnapshot !== e || g || Pt !== null && Pt.memoizedState.tag & 1) {
      if (s.flags |= 2048, la(
        9,
        oh.bind(
          null,
          s,
          o,
          i,
          e
        ),
        { destroy: void 0 },
        null
      ), Ct === null) throw Error(r(349));
      c || Vn & 60 || rh(s, e, i);
    }
    return i;
  }
  function rh(t, e, i) {
    t.flags |= 16384, t = { getSnapshot: e, value: i }, e = mt.updateQueue, e === null ? (e = Bl(), mt.updateQueue = e, e.stores = [t]) : (i = e.stores, i === null ? e.stores = [t] : i.push(t));
  }
  function oh(t, e, i, s) {
    e.value = i, e.getSnapshot = s, ch(e) && fh(t);
  }
  function uh(t, e, i) {
    return i(function() {
      ch(e) && fh(t);
    });
  }
  function ch(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var i = e();
      return !Ae(t, i);
    } catch {
      return !0;
    }
  }
  function fh(t) {
    var e = zn(t, 2);
    e !== null && ye(e, t, 2);
  }
  function Yo(t) {
    var e = Se();
    if (typeof t == "function") {
      var i = t;
      if (t = i(), mi) {
        Dn(!0);
        try {
          i();
        } finally {
          Dn(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: mn,
      lastRenderedState: t
    }, e;
  }
  function dh(t, e, i, s) {
    return t.baseState = i, qo(
      t,
      jt,
      typeof s == "function" ? s : mn
    );
  }
  function Fb(t, e, i, s, o) {
    if (Gl(t)) throw Error(r(485));
    if (t = e.action, t !== null) {
      var c = {
        payload: o,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(g) {
          c.listeners.push(g);
        }
      };
      Z.T !== null ? i(!0) : c.isTransition = !1, s(c), i = e.pending, i === null ? (c.next = e.pending = c, hh(e, c)) : (c.next = i.next, e.pending = i.next = c);
    }
  }
  function hh(t, e) {
    var i = e.action, s = e.payload, o = t.state;
    if (e.isTransition) {
      var c = Z.T, g = {};
      Z.T = g;
      try {
        var b = i(o, s), w = Z.S;
        w !== null && w(g, b), mh(t, e, b);
      } catch (R) {
        Xo(t, e, R);
      } finally {
        Z.T = c;
      }
    } else
      try {
        c = i(o, s), mh(t, e, c);
      } catch (R) {
        Xo(t, e, R);
      }
  }
  function mh(t, e, i) {
    i !== null && typeof i == "object" && typeof i.then == "function" ? i.then(
      function(s) {
        ph(t, e, s);
      },
      function(s) {
        return Xo(t, e, s);
      }
    ) : ph(t, e, i);
  }
  function ph(t, e, i) {
    e.status = "fulfilled", e.value = i, gh(e), t.state = i, e = t.pending, e !== null && (i = e.next, i === e ? t.pending = null : (i = i.next, e.next = i, hh(t, i)));
  }
  function Xo(t, e, i) {
    var s = t.pending;
    if (t.pending = null, s !== null) {
      s = s.next;
      do
        e.status = "rejected", e.reason = i, gh(e), e = e.next;
      while (e !== s);
    }
    t.action = null;
  }
  function gh(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function yh(t, e) {
    return e;
  }
  function vh(t, e) {
    if (At) {
      var i = Ct.formState;
      if (i !== null) {
        t: {
          var s = mt;
          if (At) {
            if (oe) {
              e: {
                for (var o = oe, c = Ie; o.nodeType !== 8; ) {
                  if (!c) {
                    o = null;
                    break e;
                  }
                  if (o = Ke(
                    o.nextSibling
                  ), o === null) {
                    o = null;
                    break e;
                  }
                }
                c = o.data, o = c === "F!" || c === "F" ? o : null;
              }
              if (o) {
                oe = Ke(
                  o.nextSibling
                ), s = o.data === "F!";
                break t;
              }
            }
            fi(s);
          }
          s = !1;
        }
        s && (e = i[0]);
      }
    }
    return i = Se(), i.memoizedState = i.baseState = e, s = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: yh,
      lastRenderedState: e
    }, i.queue = s, i = kh.bind(
      null,
      mt,
      s
    ), s.dispatch = i, s = Yo(!1), c = Jo.bind(
      null,
      mt,
      !1,
      s.queue
    ), s = Se(), o = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, s.queue = o, i = Fb.bind(
      null,
      mt,
      o,
      c,
      i
    ), o.dispatch = i, s.memoizedState = t, [e, i, !1];
  }
  function bh(t) {
    var e = Ft();
    return xh(e, jt, t);
  }
  function xh(t, e, i) {
    e = qo(
      t,
      e,
      yh
    )[0], t = Ll(mn)[0], e = typeof e == "object" && e !== null && typeof e.then == "function" ? ls(e) : e;
    var s = Ft(), o = s.queue, c = o.dispatch;
    return i !== s.memoizedState && (mt.flags |= 2048, la(
      9,
      Jb.bind(null, o, i),
      { destroy: void 0 },
      null
    )), [e, c, t];
  }
  function Jb(t, e) {
    t.action = e;
  }
  function Sh(t) {
    var e = Ft(), i = jt;
    if (i !== null)
      return xh(e, i, t);
    Ft(), e = e.memoizedState, i = Ft();
    var s = i.queue.dispatch;
    return i.memoizedState = t, [e, s, !1];
  }
  function la(t, e, i, s) {
    return t = { tag: t, create: e, inst: i, deps: s, next: null }, e = mt.updateQueue, e === null && (e = Bl(), mt.updateQueue = e), i = e.lastEffect, i === null ? e.lastEffect = t.next = t : (s = i.next, i.next = t, t.next = s, e.lastEffect = t), t;
  }
  function wh() {
    return Ft().memoizedState;
  }
  function Hl(t, e, i, s) {
    var o = Se();
    mt.flags |= t, o.memoizedState = la(
      1 | e,
      i,
      { destroy: void 0 },
      s === void 0 ? null : s
    );
  }
  function ql(t, e, i, s) {
    var o = Ft();
    s = s === void 0 ? null : s;
    var c = o.memoizedState.inst;
    jt !== null && s !== null && Vo(s, jt.memoizedState.deps) ? o.memoizedState = la(e, i, c, s) : (mt.flags |= t, o.memoizedState = la(1 | e, i, c, s));
  }
  function Th(t, e) {
    Hl(8390656, 8, t, e);
  }
  function Zo(t, e) {
    ql(2048, 8, t, e);
  }
  function Ah(t, e) {
    return ql(4, 2, t, e);
  }
  function Eh(t, e) {
    return ql(4, 4, t, e);
  }
  function Mh(t, e) {
    if (typeof e == "function") {
      t = t();
      var i = e(t);
      return function() {
        typeof i == "function" ? i() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function jh(t, e, i) {
    i = i != null ? i.concat([t]) : null, ql(4, 4, Mh.bind(null, e, t), i);
  }
  function Ko() {
  }
  function Rh(t, e) {
    var i = Ft();
    e = e === void 0 ? null : e;
    var s = i.memoizedState;
    return e !== null && Vo(e, s[1]) ? s[0] : (i.memoizedState = [t, e], t);
  }
  function Dh(t, e) {
    var i = Ft();
    e = e === void 0 ? null : e;
    var s = i.memoizedState;
    if (e !== null && Vo(e, s[1]))
      return s[0];
    if (s = t(), mi) {
      Dn(!0);
      try {
        t();
      } finally {
        Dn(!1);
      }
    }
    return i.memoizedState = [s, e], s;
  }
  function Qo(t, e, i) {
    return i === void 0 || Vn & 1073741824 ? t.memoizedState = e : (t.memoizedState = i, t = Nm(), mt.lanes |= t, Zn |= t, i);
  }
  function Ch(t, e, i, s) {
    return Ae(i, e) ? i : ea.current !== null ? (t = Qo(t, i, s), Ae(t, e) || (ie = !0), t) : Vn & 42 ? (t = Nm(), mt.lanes |= t, Zn |= t, e) : (ie = !0, t.memoizedState = i);
  }
  function Nh(t, e, i, s, o) {
    var c = F.p;
    F.p = c !== 0 && 8 > c ? c : 8;
    var g = Z.T, b = {};
    Z.T = b, Jo(t, !1, e, i);
    try {
      var w = o(), R = Z.S;
      if (R !== null && R(b, w), w !== null && typeof w == "object" && typeof w.then == "function") {
        var U = Kb(
          w,
          s
        );
        rs(
          t,
          e,
          U,
          Re(t)
        );
      } else
        rs(
          t,
          e,
          s,
          Re(t)
        );
    } catch (Y) {
      rs(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: Y },
        Re()
      );
    } finally {
      F.p = c, Z.T = g;
    }
  }
  function $b() {
  }
  function Po(t, e, i, s) {
    if (t.tag !== 5) throw Error(r(476));
    var o = zh(t).queue;
    Nh(
      t,
      o,
      e,
      ht,
      i === null ? $b : function() {
        return _h(t), i(s);
      }
    );
  }
  function zh(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: ht,
      baseState: ht,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: mn,
        lastRenderedState: ht
      },
      next: null
    };
    var i = {};
    return e.next = {
      memoizedState: i,
      baseState: i,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: mn,
        lastRenderedState: i
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function _h(t) {
    var e = zh(t).next.queue;
    rs(t, e, {}, Re());
  }
  function Fo() {
    return de(js);
  }
  function Oh() {
    return Ft().memoizedState;
  }
  function Vh() {
    return Ft().memoizedState;
  }
  function Wb(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var i = Re();
          t = Ln(i);
          var s = Hn(e, t, i);
          s !== null && (ye(s, e, i), cs(s, e, i)), e = { cache: zo() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function Ib(t, e, i) {
    var s = Re();
    i = {
      lane: s,
      revertLane: 0,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Gl(t) ? Bh(e, i) : (i = Eo(t, e, i, s), i !== null && (ye(i, t, s), Uh(i, e, s)));
  }
  function kh(t, e, i) {
    var s = Re();
    rs(t, e, i, s);
  }
  function rs(t, e, i, s) {
    var o = {
      lane: s,
      revertLane: 0,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Gl(t)) Bh(e, o);
    else {
      var c = t.alternate;
      if (t.lanes === 0 && (c === null || c.lanes === 0) && (c = e.lastRenderedReducer, c !== null))
        try {
          var g = e.lastRenderedState, b = c(g, i);
          if (o.hasEagerState = !0, o.eagerState = b, Ae(b, g))
            return El(t, e, o, 0), Ct === null && Al(), !1;
        } catch {
        } finally {
        }
      if (i = Eo(t, e, o, s), i !== null)
        return ye(i, t, s), Uh(i, e, s), !0;
    }
    return !1;
  }
  function Jo(t, e, i, s) {
    if (s = {
      lane: 2,
      revertLane: Lu(),
      action: s,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Gl(t)) {
      if (e) throw Error(r(479));
    } else
      e = Eo(
        t,
        i,
        s,
        2
      ), e !== null && ye(e, t, 2);
  }
  function Gl(t) {
    var e = t.alternate;
    return t === mt || e !== null && e === mt;
  }
  function Bh(t, e) {
    aa = Vl = !0;
    var i = t.pending;
    i === null ? e.next = e : (e.next = i.next, i.next = e), t.pending = e;
  }
  function Uh(t, e, i) {
    if (i & 4194176) {
      var s = e.lanes;
      s &= t.pendingLanes, i |= s, e.lanes = i, Ff(t, i);
    }
  }
  var en = {
    readContext: de,
    use: Ul,
    useCallback: Xt,
    useContext: Xt,
    useEffect: Xt,
    useImperativeHandle: Xt,
    useLayoutEffect: Xt,
    useInsertionEffect: Xt,
    useMemo: Xt,
    useReducer: Xt,
    useRef: Xt,
    useState: Xt,
    useDebugValue: Xt,
    useDeferredValue: Xt,
    useTransition: Xt,
    useSyncExternalStore: Xt,
    useId: Xt
  };
  en.useCacheRefresh = Xt, en.useMemoCache = Xt, en.useHostTransitionStatus = Xt, en.useFormState = Xt, en.useActionState = Xt, en.useOptimistic = Xt;
  var pi = {
    readContext: de,
    use: Ul,
    useCallback: function(t, e) {
      return Se().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: de,
    useEffect: Th,
    useImperativeHandle: function(t, e, i) {
      i = i != null ? i.concat([t]) : null, Hl(
        4194308,
        4,
        Mh.bind(null, e, t),
        i
      );
    },
    useLayoutEffect: function(t, e) {
      return Hl(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      Hl(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var i = Se();
      e = e === void 0 ? null : e;
      var s = t();
      if (mi) {
        Dn(!0);
        try {
          t();
        } finally {
          Dn(!1);
        }
      }
      return i.memoizedState = [s, e], s;
    },
    useReducer: function(t, e, i) {
      var s = Se();
      if (i !== void 0) {
        var o = i(e);
        if (mi) {
          Dn(!0);
          try {
            i(e);
          } finally {
            Dn(!1);
          }
        }
      } else o = e;
      return s.memoizedState = s.baseState = o, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: o
      }, s.queue = t, t = t.dispatch = Ib.bind(
        null,
        mt,
        t
      ), [s.memoizedState, t];
    },
    useRef: function(t) {
      var e = Se();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Yo(t);
      var e = t.queue, i = kh.bind(null, mt, e);
      return e.dispatch = i, [t.memoizedState, i];
    },
    useDebugValue: Ko,
    useDeferredValue: function(t, e) {
      var i = Se();
      return Qo(i, t, e);
    },
    useTransition: function() {
      var t = Yo(!1);
      return t = Nh.bind(
        null,
        mt,
        t.queue,
        !0,
        !1
      ), Se().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, i) {
      var s = mt, o = Se();
      if (At) {
        if (i === void 0)
          throw Error(r(407));
        i = i();
      } else {
        if (i = e(), Ct === null) throw Error(r(349));
        St & 60 || rh(s, e, i);
      }
      o.memoizedState = i;
      var c = { value: i, getSnapshot: e };
      return o.queue = c, Th(uh.bind(null, s, c, t), [
        t
      ]), s.flags |= 2048, la(
        9,
        oh.bind(
          null,
          s,
          c,
          i,
          e
        ),
        { destroy: void 0 },
        null
      ), i;
    },
    useId: function() {
      var t = Se(), e = Ct.identifierPrefix;
      if (At) {
        var i = dn, s = fn;
        i = (s & ~(1 << 32 - Te(s) - 1)).toString(32) + i, e = ":" + e + "R" + i, i = kl++, 0 < i && (e += "H" + i.toString(32)), e += ":";
      } else
        i = Qb++, e = ":" + e + "r" + i.toString(32) + ":";
      return t.memoizedState = e;
    },
    useCacheRefresh: function() {
      return Se().memoizedState = Wb.bind(
        null,
        mt
      );
    }
  };
  pi.useMemoCache = Ho, pi.useHostTransitionStatus = Fo, pi.useFormState = vh, pi.useActionState = vh, pi.useOptimistic = function(t) {
    var e = Se();
    e.memoizedState = e.baseState = t;
    var i = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: null,
      lastRenderedState: null
    };
    return e.queue = i, e = Jo.bind(
      null,
      mt,
      !0,
      i
    ), i.dispatch = e, [t, e];
  };
  var kn = {
    readContext: de,
    use: Ul,
    useCallback: Rh,
    useContext: de,
    useEffect: Zo,
    useImperativeHandle: jh,
    useInsertionEffect: Ah,
    useLayoutEffect: Eh,
    useMemo: Dh,
    useReducer: Ll,
    useRef: wh,
    useState: function() {
      return Ll(mn);
    },
    useDebugValue: Ko,
    useDeferredValue: function(t, e) {
      var i = Ft();
      return Ch(
        i,
        jt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Ll(mn)[0], e = Ft().memoizedState;
      return [
        typeof t == "boolean" ? t : ls(t),
        e
      ];
    },
    useSyncExternalStore: lh,
    useId: Oh
  };
  kn.useCacheRefresh = Vh, kn.useMemoCache = Ho, kn.useHostTransitionStatus = Fo, kn.useFormState = bh, kn.useActionState = bh, kn.useOptimistic = function(t, e) {
    var i = Ft();
    return dh(i, jt, t, e);
  };
  var gi = {
    readContext: de,
    use: Ul,
    useCallback: Rh,
    useContext: de,
    useEffect: Zo,
    useImperativeHandle: jh,
    useInsertionEffect: Ah,
    useLayoutEffect: Eh,
    useMemo: Dh,
    useReducer: Go,
    useRef: wh,
    useState: function() {
      return Go(mn);
    },
    useDebugValue: Ko,
    useDeferredValue: function(t, e) {
      var i = Ft();
      return jt === null ? Qo(i, t, e) : Ch(
        i,
        jt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Go(mn)[0], e = Ft().memoizedState;
      return [
        typeof t == "boolean" ? t : ls(t),
        e
      ];
    },
    useSyncExternalStore: lh,
    useId: Oh
  };
  gi.useCacheRefresh = Vh, gi.useMemoCache = Ho, gi.useHostTransitionStatus = Fo, gi.useFormState = Sh, gi.useActionState = Sh, gi.useOptimistic = function(t, e) {
    var i = Ft();
    return jt !== null ? dh(i, jt, t, e) : (i.baseState = t, [t, i.queue.dispatch]);
  };
  function $o(t, e, i, s) {
    e = t.memoizedState, i = i(s, e), i = i == null ? e : et({}, e, i), t.memoizedState = i, t.lanes === 0 && (t.updateQueue.baseState = i);
  }
  var Wo = {
    isMounted: function(t) {
      return (t = t._reactInternals) ? K(t) === t : !1;
    },
    enqueueSetState: function(t, e, i) {
      t = t._reactInternals;
      var s = Re(), o = Ln(s);
      o.payload = e, i != null && (o.callback = i), e = Hn(t, o, s), e !== null && (ye(e, t, s), cs(e, t, s));
    },
    enqueueReplaceState: function(t, e, i) {
      t = t._reactInternals;
      var s = Re(), o = Ln(s);
      o.tag = 1, o.payload = e, i != null && (o.callback = i), e = Hn(t, o, s), e !== null && (ye(e, t, s), cs(e, t, s));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var i = Re(), s = Ln(i);
      s.tag = 2, e != null && (s.callback = e), e = Hn(t, s, i), e !== null && (ye(e, t, i), cs(e, t, i));
    }
  };
  function Lh(t, e, i, s, o, c, g) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(s, c, g) : e.prototype && e.prototype.isPureReactComponent ? !Pa(i, s) || !Pa(o, c) : !0;
  }
  function Hh(t, e, i, s) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(i, s), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(i, s), e.state !== t && Wo.enqueueReplaceState(e, e.state, null);
  }
  function yi(t, e) {
    var i = e;
    if ("ref" in e) {
      i = {};
      for (var s in e)
        s !== "ref" && (i[s] = e[s]);
    }
    if (t = t.defaultProps) {
      i === e && (i = et({}, i));
      for (var o in t)
        i[o] === void 0 && (i[o] = t[o]);
    }
    return i;
  }
  var Yl = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  };
  function qh(t) {
    Yl(t);
  }
  function Gh(t) {
    console.error(t);
  }
  function Yh(t) {
    Yl(t);
  }
  function Xl(t, e) {
    try {
      var i = t.onUncaughtError;
      i(e.value, { componentStack: e.stack });
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  function Xh(t, e, i) {
    try {
      var s = t.onCaughtError;
      s(i.value, {
        componentStack: i.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  function Io(t, e, i) {
    return i = Ln(i), i.tag = 3, i.payload = { element: null }, i.callback = function() {
      Xl(t, e);
    }, i;
  }
  function Zh(t) {
    return t = Ln(t), t.tag = 3, t;
  }
  function Kh(t, e, i, s) {
    var o = i.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = s.value;
      t.payload = function() {
        return o(c);
      }, t.callback = function() {
        Xh(e, i, s);
      };
    }
    var g = i.stateNode;
    g !== null && typeof g.componentDidCatch == "function" && (t.callback = function() {
      Xh(e, i, s), typeof o != "function" && (Kn === null ? Kn = /* @__PURE__ */ new Set([this]) : Kn.add(this));
      var b = s.stack;
      this.componentDidCatch(s.value, {
        componentStack: b !== null ? b : ""
      });
    });
  }
  function tx(t, e, i, s, o) {
    if (i.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
      if (e = i.alternate, e !== null && us(
        e,
        i,
        o,
        !0
      ), i = Ve.current, i !== null) {
        switch (i.tag) {
          case 13:
            return tn === null ? Ou() : i.alternate === null && qt === 0 && (qt = 3), i.flags &= -257, i.flags |= 65536, i.lanes = o, s === Do ? i.flags |= 16384 : (e = i.updateQueue, e === null ? i.updateQueue = /* @__PURE__ */ new Set([s]) : e.add(s), ku(t, s, o)), !1;
          case 22:
            return i.flags |= 65536, s === Do ? i.flags |= 16384 : (e = i.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([s])
            }, i.updateQueue = e) : (i = e.retryQueue, i === null ? e.retryQueue = /* @__PURE__ */ new Set([s]) : i.add(s)), ku(t, s, o)), !1;
        }
        throw Error(r(435, i.tag));
      }
      return ku(t, s, o), Ou(), !1;
    }
    if (At)
      return e = Ve.current, e !== null ? (!(e.flags & 65536) && (e.flags |= 256), e.flags |= 65536, e.lanes = o, s !== Ro && (t = Error(r(422), { cause: s }), Wa(ze(t, i)))) : (s !== Ro && (e = Error(r(423), {
        cause: s
      }), Wa(
        ze(e, i)
      )), t = t.current.alternate, t.flags |= 65536, o &= -o, t.lanes |= o, s = ze(s, i), o = Io(
        t.stateNode,
        s,
        o
      ), mu(t, o), qt !== 4 && (qt = 2)), !1;
    var c = Error(r(520), { cause: s });
    if (c = ze(c, i), vs === null ? vs = [c] : vs.push(c), qt !== 4 && (qt = 2), e === null) return !0;
    s = ze(s, i), i = e;
    do {
      switch (i.tag) {
        case 3:
          return i.flags |= 65536, t = o & -o, i.lanes |= t, t = Io(i.stateNode, s, t), mu(i, t), !1;
        case 1:
          if (e = i.type, c = i.stateNode, (i.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (Kn === null || !Kn.has(c))))
            return i.flags |= 65536, o &= -o, i.lanes |= o, o = Zh(o), Kh(
              o,
              t,
              i,
              s
            ), mu(i, o), !1;
      }
      i = i.return;
    } while (i !== null);
    return !1;
  }
  var Qh = Error(r(461)), ie = !1;
  function ue(t, e, i, s) {
    e.child = t === null ? Wd(e, null, i, s) : di(
      e,
      t.child,
      i,
      s
    );
  }
  function Ph(t, e, i, s, o) {
    i = i.render;
    var c = e.ref;
    if ("ref" in s) {
      var g = {};
      for (var b in s)
        b !== "ref" && (g[b] = s[b]);
    } else g = s;
    return bi(e), s = ko(
      t,
      e,
      i,
      g,
      c,
      o
    ), b = Bo(), t !== null && !ie ? (Uo(t, e, o), pn(t, e, o)) : (At && b && Mo(e), e.flags |= 1, ue(t, e, s, o), e.child);
  }
  function Fh(t, e, i, s, o) {
    if (t === null) {
      var c = i.type;
      return typeof c == "function" && !wu(c) && c.defaultProps === void 0 && i.compare === null ? (e.tag = 15, e.type = c, Jh(
        t,
        e,
        c,
        s,
        o
      )) : (t = Fl(
        i.type,
        null,
        s,
        e,
        e.mode,
        o
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (c = t.child, !ou(t, o)) {
      var g = c.memoizedProps;
      if (i = i.compare, i = i !== null ? i : Pa, i(g, s) && t.ref === e.ref)
        return pn(t, e, o);
    }
    return e.flags |= 1, t = Xn(c, s), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Jh(t, e, i, s, o) {
    if (t !== null) {
      var c = t.memoizedProps;
      if (Pa(c, s) && t.ref === e.ref)
        if (ie = !1, e.pendingProps = s = c, ou(t, o))
          t.flags & 131072 && (ie = !0);
        else
          return e.lanes = t.lanes, pn(t, e, o);
    }
    return tu(
      t,
      e,
      i,
      s,
      o
    );
  }
  function $h(t, e, i) {
    var s = e.pendingProps, o = s.children, c = (e.stateNode._pendingVisibility & 2) !== 0, g = t !== null ? t.memoizedState : null;
    if (os(t, e), s.mode === "hidden" || c) {
      if (e.flags & 128) {
        if (s = g !== null ? g.baseLanes | i : i, t !== null) {
          for (o = e.child = t.child, c = 0; o !== null; )
            c = c | o.lanes | o.childLanes, o = o.sibling;
          e.childLanes = c & ~s;
        } else e.childLanes = 0, e.child = null;
        return Wh(
          t,
          e,
          s,
          i
        );
      }
      if (i & 536870912)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && Ol(
          e,
          g !== null ? g.cachePool : null
        ), g !== null ? Id(e, g) : Co(), th(e);
      else
        return e.lanes = e.childLanes = 536870912, Wh(
          t,
          e,
          g !== null ? g.baseLanes | i : i,
          i
        );
    } else
      g !== null ? (Ol(e, g.cachePool), Id(e, g), On(), e.memoizedState = null) : (t !== null && Ol(e, null), Co(), On());
    return ue(t, e, o, i), e.child;
  }
  function Wh(t, e, i, s) {
    var o = Oo();
    return o = o === null ? null : { parent: It._currentValue, pool: o }, e.memoizedState = {
      baseLanes: i,
      cachePool: o
    }, t !== null && Ol(e, null), Co(), th(e), t !== null && us(t, e, s, !0), null;
  }
  function os(t, e) {
    var i = e.ref;
    if (i === null)
      t !== null && t.ref !== null && (e.flags |= 2097664);
    else {
      if (typeof i != "function" && typeof i != "object")
        throw Error(r(284));
      (t === null || t.ref !== i) && (e.flags |= 2097664);
    }
  }
  function tu(t, e, i, s, o) {
    return bi(e), i = ko(
      t,
      e,
      i,
      s,
      void 0,
      o
    ), s = Bo(), t !== null && !ie ? (Uo(t, e, o), pn(t, e, o)) : (At && s && Mo(e), e.flags |= 1, ue(t, e, i, o), e.child);
  }
  function Ih(t, e, i, s, o, c) {
    return bi(e), e.updateQueue = null, i = sh(
      e,
      s,
      i,
      o
    ), ah(t), s = Bo(), t !== null && !ie ? (Uo(t, e, c), pn(t, e, c)) : (At && s && Mo(e), e.flags |= 1, ue(t, e, i, c), e.child);
  }
  function tm(t, e, i, s, o) {
    if (bi(e), e.stateNode === null) {
      var c = $i, g = i.contextType;
      typeof g == "object" && g !== null && (c = de(g)), c = new i(s, c), e.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, c.updater = Wo, e.stateNode = c, c._reactInternals = e, c = e.stateNode, c.props = s, c.state = e.memoizedState, c.refs = {}, du(e), g = i.contextType, c.context = typeof g == "object" && g !== null ? de(g) : $i, c.state = e.memoizedState, g = i.getDerivedStateFromProps, typeof g == "function" && ($o(
        e,
        i,
        g,
        s
      ), c.state = e.memoizedState), typeof i.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (g = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), g !== c.state && Wo.enqueueReplaceState(c, c.state, null), ds(e, s, c, o), fs(), c.state = e.memoizedState), typeof c.componentDidMount == "function" && (e.flags |= 4194308), s = !0;
    } else if (t === null) {
      c = e.stateNode;
      var b = e.memoizedProps, w = yi(i, b);
      c.props = w;
      var R = c.context, U = i.contextType;
      g = $i, typeof U == "object" && U !== null && (g = de(U));
      var Y = i.getDerivedStateFromProps;
      U = typeof Y == "function" || typeof c.getSnapshotBeforeUpdate == "function", b = e.pendingProps !== b, U || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (b || R !== g) && Hh(
        e,
        c,
        s,
        g
      ), Un = !1;
      var O = e.memoizedState;
      c.state = O, ds(e, s, c, o), fs(), R = e.memoizedState, b || O !== R || Un ? (typeof Y == "function" && ($o(
        e,
        i,
        Y,
        s
      ), R = e.memoizedState), (w = Un || Lh(
        e,
        i,
        w,
        s,
        O,
        R,
        g
      )) ? (U || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = s, e.memoizedState = R), c.props = s, c.state = R, c.context = g, s = w) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308), s = !1);
    } else {
      c = e.stateNode, hu(t, e), g = e.memoizedProps, U = yi(i, g), c.props = U, Y = e.pendingProps, O = c.context, R = i.contextType, w = $i, typeof R == "object" && R !== null && (w = de(R)), b = i.getDerivedStateFromProps, (R = typeof b == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (g !== Y || O !== w) && Hh(
        e,
        c,
        s,
        w
      ), Un = !1, O = e.memoizedState, c.state = O, ds(e, s, c, o), fs();
      var k = e.memoizedState;
      g !== Y || O !== k || Un || t !== null && t.dependencies !== null && Zl(t.dependencies) ? (typeof b == "function" && ($o(
        e,
        i,
        b,
        s
      ), k = e.memoizedState), (U = Un || Lh(
        e,
        i,
        U,
        s,
        O,
        k,
        w
      ) || t !== null && t.dependencies !== null && Zl(t.dependencies)) ? (R || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(s, k, w), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(
        s,
        k,
        w
      )), typeof c.componentDidUpdate == "function" && (e.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || g === t.memoizedProps && O === t.memoizedState || (e.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || g === t.memoizedProps && O === t.memoizedState || (e.flags |= 1024), e.memoizedProps = s, e.memoizedState = k), c.props = s, c.state = k, c.context = w, s = U) : (typeof c.componentDidUpdate != "function" || g === t.memoizedProps && O === t.memoizedState || (e.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || g === t.memoizedProps && O === t.memoizedState || (e.flags |= 1024), s = !1);
    }
    return c = s, os(t, e), s = (e.flags & 128) !== 0, c || s ? (c = e.stateNode, i = s && typeof i.getDerivedStateFromError != "function" ? null : c.render(), e.flags |= 1, t !== null && s ? (e.child = di(
      e,
      t.child,
      null,
      o
    ), e.child = di(
      e,
      null,
      i,
      o
    )) : ue(t, e, i, o), e.memoizedState = c.state, t = e.child) : t = pn(
      t,
      e,
      o
    ), t;
  }
  function em(t, e, i, s) {
    return $a(), e.flags |= 256, ue(t, e, i, s), e.child;
  }
  var eu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nu(t) {
    return { baseLanes: t, cachePool: ih() };
  }
  function iu(t, e, i) {
    return t = t !== null ? t.childLanes & ~i : 0, e && (t |= Le), t;
  }
  function nm(t, e, i) {
    var s = e.pendingProps, o = !1, c = (e.flags & 128) !== 0, g;
    if ((g = c) || (g = t !== null && t.memoizedState === null ? !1 : (Wt.current & 2) !== 0), g && (o = !0, e.flags &= -129), g = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (At) {
        if (o ? _n(e) : On(), At) {
          var b = oe, w;
          if (w = b) {
            t: {
              for (w = b, b = Ie; w.nodeType !== 8; ) {
                if (!b) {
                  b = null;
                  break t;
                }
                if (w = Ke(
                  w.nextSibling
                ), w === null) {
                  b = null;
                  break t;
                }
              }
              b = w;
            }
            b !== null ? (e.memoizedState = {
              dehydrated: b,
              treeContext: ui !== null ? { id: fn, overflow: dn } : null,
              retryLane: 536870912
            }, w = Ue(
              18,
              null,
              null,
              0
            ), w.stateNode = b, w.return = e, e.child = w, ge = e, oe = null, w = !0) : w = !1;
          }
          w || fi(e);
        }
        if (b = e.memoizedState, b !== null && (b = b.dehydrated, b !== null))
          return b.data === "$!" ? e.lanes = 16 : e.lanes = 536870912, null;
        hn(e);
      }
      return b = s.children, s = s.fallback, o ? (On(), o = e.mode, b = su(
        { mode: "hidden", children: b },
        o
      ), s = Si(
        s,
        o,
        i,
        null
      ), b.return = e, s.return = e, b.sibling = s, e.child = b, o = e.child, o.memoizedState = nu(i), o.childLanes = iu(
        t,
        g,
        i
      ), e.memoizedState = eu, s) : (_n(e), au(e, b));
    }
    if (w = t.memoizedState, w !== null && (b = w.dehydrated, b !== null)) {
      if (c)
        e.flags & 256 ? (_n(e), e.flags &= -257, e = lu(
          t,
          e,
          i
        )) : e.memoizedState !== null ? (On(), e.child = t.child, e.flags |= 128, e = null) : (On(), o = s.fallback, b = e.mode, s = su(
          { mode: "visible", children: s.children },
          b
        ), o = Si(
          o,
          b,
          i,
          null
        ), o.flags |= 2, s.return = e, o.return = e, s.sibling = o, e.child = s, di(
          e,
          t.child,
          null,
          i
        ), s = e.child, s.memoizedState = nu(i), s.childLanes = iu(
          t,
          g,
          i
        ), e.memoizedState = eu, e = o);
      else if (_n(e), b.data === "$!") {
        if (g = b.nextSibling && b.nextSibling.dataset, g) var R = g.dgst;
        g = R, s = Error(r(419)), s.stack = "", s.digest = g, Wa({ value: s, source: null, stack: null }), e = lu(
          t,
          e,
          i
        );
      } else if (ie || us(t, e, i, !1), g = (i & t.childLanes) !== 0, ie || g) {
        if (g = Ct, g !== null) {
          if (s = i & -i, s & 42) s = 1;
          else
            switch (s) {
              case 2:
                s = 1;
                break;
              case 8:
                s = 4;
                break;
              case 32:
                s = 16;
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
                s = 64;
                break;
              case 268435456:
                s = 134217728;
                break;
              default:
                s = 0;
            }
          if (s = s & (g.suspendedLanes | i) ? 0 : s, s !== 0 && s !== w.retryLane)
            throw w.retryLane = s, zn(t, s), ye(g, t, s), Qh;
        }
        b.data === "$?" || Ou(), e = lu(
          t,
          e,
          i
        );
      } else
        b.data === "$?" ? (e.flags |= 128, e.child = t.child, e = px.bind(
          null,
          t
        ), b._reactRetry = e, e = null) : (t = w.treeContext, oe = Ke(
          b.nextSibling
        ), ge = e, At = !0, Xe = null, Ie = !1, t !== null && (_e[Oe++] = fn, _e[Oe++] = dn, _e[Oe++] = ui, fn = t.id, dn = t.overflow, ui = e), e = au(
          e,
          s.children
        ), e.flags |= 4096);
      return e;
    }
    return o ? (On(), o = s.fallback, b = e.mode, w = t.child, R = w.sibling, s = Xn(w, {
      mode: "hidden",
      children: s.children
    }), s.subtreeFlags = w.subtreeFlags & 31457280, R !== null ? o = Xn(R, o) : (o = Si(
      o,
      b,
      i,
      null
    ), o.flags |= 2), o.return = e, s.return = e, s.sibling = o, e.child = s, s = o, o = e.child, b = t.child.memoizedState, b === null ? b = nu(i) : (w = b.cachePool, w !== null ? (R = It._currentValue, w = w.parent !== R ? { parent: R, pool: R } : w) : w = ih(), b = {
      baseLanes: b.baseLanes | i,
      cachePool: w
    }), o.memoizedState = b, o.childLanes = iu(
      t,
      g,
      i
    ), e.memoizedState = eu, s) : (_n(e), i = t.child, t = i.sibling, i = Xn(i, {
      mode: "visible",
      children: s.children
    }), i.return = e, i.sibling = null, t !== null && (g = e.deletions, g === null ? (e.deletions = [t], e.flags |= 16) : g.push(t)), e.child = i, e.memoizedState = null, i);
  }
  function au(t, e) {
    return e = su(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function su(t, e) {
    return Rm(t, e, 0, null);
  }
  function lu(t, e, i) {
    return di(e, t.child, null, i), t = au(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function im(t, e, i) {
    t.lanes |= e;
    var s = t.alternate;
    s !== null && (s.lanes |= e), cu(t.return, e, i);
  }
  function ru(t, e, i, s, o) {
    var c = t.memoizedState;
    c === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: s,
      tail: i,
      tailMode: o
    } : (c.isBackwards = e, c.rendering = null, c.renderingStartTime = 0, c.last = s, c.tail = i, c.tailMode = o);
  }
  function am(t, e, i) {
    var s = e.pendingProps, o = s.revealOrder, c = s.tail;
    if (ue(t, e, s.children, i), s = Wt.current, s & 2)
      s = s & 1 | 2, e.flags |= 128;
    else {
      if (t !== null && t.flags & 128)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13)
            t.memoizedState !== null && im(t, i, e);
          else if (t.tag === 19)
            im(t, i, e);
          else if (t.child !== null) {
            t.child.return = t, t = t.child;
            continue;
          }
          if (t === e) break t;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e)
              break t;
            t = t.return;
          }
          t.sibling.return = t.return, t = t.sibling;
        }
      s &= 1;
    }
    switch (Vt(Wt, s), o) {
      case "forwards":
        for (i = e.child, o = null; i !== null; )
          t = i.alternate, t !== null && _l(t) === null && (o = i), i = i.sibling;
        i = o, i === null ? (o = e.child, e.child = null) : (o = i.sibling, i.sibling = null), ru(
          e,
          !1,
          o,
          i,
          c
        );
        break;
      case "backwards":
        for (i = null, o = e.child, e.child = null; o !== null; ) {
          if (t = o.alternate, t !== null && _l(t) === null) {
            e.child = o;
            break;
          }
          t = o.sibling, o.sibling = i, i = o, o = t;
        }
        ru(
          e,
          !0,
          i,
          null,
          c
        );
        break;
      case "together":
        ru(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function pn(t, e, i) {
    if (t !== null && (e.dependencies = t.dependencies), Zn |= e.lanes, !(i & e.childLanes))
      if (t !== null) {
        if (us(
          t,
          e,
          i,
          !1
        ), (i & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(r(153));
    if (e.child !== null) {
      for (t = e.child, i = Xn(t, t.pendingProps), e.child = i, i.return = e; t.sibling !== null; )
        t = t.sibling, i = i.sibling = Xn(t, t.pendingProps), i.return = e;
      i.sibling = null;
    }
    return e.child;
  }
  function ou(t, e) {
    return t.lanes & e ? !0 : (t = t.dependencies, !!(t !== null && Zl(t)));
  }
  function ex(t, e, i) {
    switch (e.tag) {
      case 3:
        rl(e, e.stateNode.containerInfo), Bn(e, It, t.memoizedState.cache), $a();
        break;
      case 27:
      case 5:
        $r(e);
        break;
      case 4:
        rl(e, e.stateNode.containerInfo);
        break;
      case 10:
        Bn(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 13:
        var s = e.memoizedState;
        if (s !== null)
          return s.dehydrated !== null ? (_n(e), e.flags |= 128, null) : i & e.child.childLanes ? nm(t, e, i) : (_n(e), t = pn(
            t,
            e,
            i
          ), t !== null ? t.sibling : null);
        _n(e);
        break;
      case 19:
        var o = (t.flags & 128) !== 0;
        if (s = (i & e.childLanes) !== 0, s || (us(
          t,
          e,
          i,
          !1
        ), s = (i & e.childLanes) !== 0), o) {
          if (s)
            return am(
              t,
              e,
              i
            );
          e.flags |= 128;
        }
        if (o = e.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Vt(Wt, Wt.current), s) break;
        return null;
      case 22:
      case 23:
        return e.lanes = 0, $h(t, e, i);
      case 24:
        Bn(e, It, t.memoizedState.cache);
    }
    return pn(t, e, i);
  }
  function sm(t, e, i) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        ie = !0;
      else {
        if (!ou(t, i) && !(e.flags & 128))
          return ie = !1, ex(
            t,
            e,
            i
          );
        ie = !!(t.flags & 131072);
      }
    else
      ie = !1, At && e.flags & 1048576 && Yd(e, Rl, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          t = e.pendingProps;
          var s = e.elementType, o = s._init;
          if (s = o(s._payload), e.type = s, typeof s == "function")
            wu(s) ? (t = yi(s, t), e.tag = 1, e = tm(
              null,
              e,
              s,
              t,
              i
            )) : (e.tag = 0, e = tu(
              null,
              e,
              s,
              t,
              i
            ));
          else {
            if (s != null) {
              if (o = s.$$typeof, o === A) {
                e.tag = 11, e = Ph(
                  null,
                  e,
                  s,
                  t,
                  i
                );
                break t;
              } else if (o === _) {
                e.tag = 14, e = Fh(
                  null,
                  e,
                  s,
                  t,
                  i
                );
                break t;
              }
            }
            throw e = J(s) || s, Error(r(306, e, ""));
          }
        }
        return e;
      case 0:
        return tu(
          t,
          e,
          e.type,
          e.pendingProps,
          i
        );
      case 1:
        return s = e.type, o = yi(
          s,
          e.pendingProps
        ), tm(
          t,
          e,
          s,
          o,
          i
        );
      case 3:
        t: {
          if (rl(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(r(387));
          var c = e.pendingProps;
          o = e.memoizedState, s = o.element, hu(t, e), ds(e, c, null, i);
          var g = e.memoizedState;
          if (c = g.cache, Bn(e, It, c), c !== o.cache && fu(
            e,
            [It],
            i,
            !0
          ), fs(), c = g.element, o.isDehydrated)
            if (o = {
              element: c,
              isDehydrated: !1,
              cache: g.cache
            }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
              e = em(
                t,
                e,
                c,
                i
              );
              break t;
            } else if (c !== s) {
              s = ze(
                Error(r(424)),
                e
              ), Wa(s), e = em(
                t,
                e,
                c,
                i
              );
              break t;
            } else
              for (oe = Ke(
                e.stateNode.containerInfo.firstChild
              ), ge = e, At = !0, Xe = null, Ie = !0, i = Wd(
                e,
                null,
                c,
                i
              ), e.child = i; i; )
                i.flags = i.flags & -3 | 4096, i = i.sibling;
          else {
            if ($a(), c === s) {
              e = pn(
                t,
                e,
                i
              );
              break t;
            }
            ue(t, e, c, i);
          }
          e = e.child;
        }
        return e;
      case 26:
        return os(t, e), t === null ? (i = op(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = i : At || (i = e.type, t = e.pendingProps, s = rr(
          Rn.current
        ).createElement(i), s[fe] = e, s[be] = t, ce(s, i, t), ne(s), e.stateNode = s) : e.memoizedState = op(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return $r(e), t === null && At && (s = e.stateNode = sp(
          e.type,
          e.pendingProps,
          Rn.current
        ), ge = e, Ie = !0, oe = Ke(
          s.firstChild
        )), s = e.pendingProps.children, t !== null || At ? ue(
          t,
          e,
          s,
          i
        ) : e.child = di(
          e,
          null,
          s,
          i
        ), os(t, e), e.child;
      case 5:
        return t === null && At && ((o = s = oe) && (s = Nx(
          s,
          e.type,
          e.pendingProps,
          Ie
        ), s !== null ? (e.stateNode = s, ge = e, oe = Ke(
          s.firstChild
        ), Ie = !1, o = !0) : o = !1), o || fi(e)), $r(e), o = e.type, c = e.pendingProps, g = t !== null ? t.memoizedProps : null, s = c.children, Pu(o, c) ? s = null : g !== null && Pu(o, g) && (e.flags |= 32), e.memoizedState !== null && (o = ko(
          t,
          e,
          Pb,
          null,
          null,
          i
        ), js._currentValue = o), os(t, e), ue(t, e, s, i), e.child;
      case 6:
        return t === null && At && ((t = i = oe) && (i = zx(
          i,
          e.pendingProps,
          Ie
        ), i !== null ? (e.stateNode = i, ge = e, oe = null, t = !0) : t = !1), t || fi(e)), null;
      case 13:
        return nm(t, e, i);
      case 4:
        return rl(
          e,
          e.stateNode.containerInfo
        ), s = e.pendingProps, t === null ? e.child = di(
          e,
          null,
          s,
          i
        ) : ue(
          t,
          e,
          s,
          i
        ), e.child;
      case 11:
        return Ph(
          t,
          e,
          e.type,
          e.pendingProps,
          i
        );
      case 7:
        return ue(
          t,
          e,
          e.pendingProps,
          i
        ), e.child;
      case 8:
        return ue(
          t,
          e,
          e.pendingProps.children,
          i
        ), e.child;
      case 12:
        return ue(
          t,
          e,
          e.pendingProps.children,
          i
        ), e.child;
      case 10:
        return s = e.pendingProps, Bn(e, e.type, s.value), ue(
          t,
          e,
          s.children,
          i
        ), e.child;
      case 9:
        return o = e.type._context, s = e.pendingProps.children, bi(e), o = de(o), s = s(o), e.flags |= 1, ue(t, e, s, i), e.child;
      case 14:
        return Fh(
          t,
          e,
          e.type,
          e.pendingProps,
          i
        );
      case 15:
        return Jh(
          t,
          e,
          e.type,
          e.pendingProps,
          i
        );
      case 19:
        return am(t, e, i);
      case 22:
        return $h(t, e, i);
      case 24:
        return bi(e), s = de(It), t === null ? (o = Oo(), o === null && (o = Ct, c = zo(), o.pooledCache = c, c.refCount++, c !== null && (o.pooledCacheLanes |= i), o = c), e.memoizedState = {
          parent: s,
          cache: o
        }, du(e), Bn(e, It, o)) : (t.lanes & i && (hu(t, e), ds(e, null, null, i), fs()), o = t.memoizedState, c = e.memoizedState, o.parent !== s ? (o = { parent: s, cache: s }, e.memoizedState = o, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = o), Bn(e, It, s)) : (s = c.cache, Bn(e, It, s), s !== o.cache && fu(
          e,
          [It],
          i,
          !0
        ))), ue(
          t,
          e,
          e.pendingProps.children,
          i
        ), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(r(156, e.tag));
  }
  var uu = Mt(null), vi = null, gn = null;
  function Bn(t, e, i) {
    Vt(uu, e._currentValue), e._currentValue = i;
  }
  function yn(t) {
    t._currentValue = uu.current, Qt(uu);
  }
  function cu(t, e, i) {
    for (; t !== null; ) {
      var s = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, s !== null && (s.childLanes |= e)) : s !== null && (s.childLanes & e) !== e && (s.childLanes |= e), t === i) break;
      t = t.return;
    }
  }
  function fu(t, e, i, s) {
    var o = t.child;
    for (o !== null && (o.return = t); o !== null; ) {
      var c = o.dependencies;
      if (c !== null) {
        var g = o.child;
        c = c.firstContext;
        t: for (; c !== null; ) {
          var b = c;
          c = o;
          for (var w = 0; w < e.length; w++)
            if (b.context === e[w]) {
              c.lanes |= i, b = c.alternate, b !== null && (b.lanes |= i), cu(
                c.return,
                i,
                t
              ), s || (g = null);
              break t;
            }
          c = b.next;
        }
      } else if (o.tag === 18) {
        if (g = o.return, g === null) throw Error(r(341));
        g.lanes |= i, c = g.alternate, c !== null && (c.lanes |= i), cu(g, i, t), g = null;
      } else g = o.child;
      if (g !== null) g.return = o;
      else
        for (g = o; g !== null; ) {
          if (g === t) {
            g = null;
            break;
          }
          if (o = g.sibling, o !== null) {
            o.return = g.return, g = o;
            break;
          }
          g = g.return;
        }
      o = g;
    }
  }
  function us(t, e, i, s) {
    t = null;
    for (var o = e, c = !1; o !== null; ) {
      if (!c) {
        if (o.flags & 524288) c = !0;
        else if (o.flags & 262144) break;
      }
      if (o.tag === 10) {
        var g = o.alternate;
        if (g === null) throw Error(r(387));
        if (g = g.memoizedProps, g !== null) {
          var b = o.type;
          Ae(o.pendingProps.value, g.value) || (t !== null ? t.push(b) : t = [b]);
        }
      } else if (o === ll.current) {
        if (g = o.alternate, g === null) throw Error(r(387));
        g.memoizedState.memoizedState !== o.memoizedState.memoizedState && (t !== null ? t.push(js) : t = [js]);
      }
      o = o.return;
    }
    t !== null && fu(
      e,
      t,
      i,
      s
    ), e.flags |= 262144;
  }
  function Zl(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!Ae(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function bi(t) {
    vi = t, gn = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function de(t) {
    return lm(vi, t);
  }
  function Kl(t, e) {
    return vi === null && bi(t), lm(t, e);
  }
  function lm(t, e) {
    var i = e._currentValue;
    if (e = { context: e, memoizedValue: i, next: null }, gn === null) {
      if (t === null) throw Error(r(308));
      gn = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else gn = gn.next = e;
    return i;
  }
  var Un = !1;
  function du(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function hu(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function Ln(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Hn(t, e, i) {
    var s = t.updateQueue;
    if (s === null) return null;
    if (s = s.shared, Ut & 2) {
      var o = s.pending;
      return o === null ? e.next = e : (e.next = o.next, o.next = e), s.pending = e, e = Ml(t), qd(t, null, i), e;
    }
    return El(t, s, e, i), Ml(t);
  }
  function cs(t, e, i) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (i & 4194176) !== 0)) {
      var s = e.lanes;
      s &= t.pendingLanes, i |= s, e.lanes = i, Ff(t, i);
    }
  }
  function mu(t, e) {
    var i = t.updateQueue, s = t.alternate;
    if (s !== null && (s = s.updateQueue, i === s)) {
      var o = null, c = null;
      if (i = i.firstBaseUpdate, i !== null) {
        do {
          var g = {
            lane: i.lane,
            tag: i.tag,
            payload: i.payload,
            callback: null,
            next: null
          };
          c === null ? o = c = g : c = c.next = g, i = i.next;
        } while (i !== null);
        c === null ? o = c = e : c = c.next = e;
      } else o = c = e;
      i = {
        baseState: s.baseState,
        firstBaseUpdate: o,
        lastBaseUpdate: c,
        shared: s.shared,
        callbacks: s.callbacks
      }, t.updateQueue = i;
      return;
    }
    t = i.lastBaseUpdate, t === null ? i.firstBaseUpdate = e : t.next = e, i.lastBaseUpdate = e;
  }
  var pu = !1;
  function fs() {
    if (pu) {
      var t = ia;
      if (t !== null) throw t;
    }
  }
  function ds(t, e, i, s) {
    pu = !1;
    var o = t.updateQueue;
    Un = !1;
    var c = o.firstBaseUpdate, g = o.lastBaseUpdate, b = o.shared.pending;
    if (b !== null) {
      o.shared.pending = null;
      var w = b, R = w.next;
      w.next = null, g === null ? c = R : g.next = R, g = w;
      var U = t.alternate;
      U !== null && (U = U.updateQueue, b = U.lastBaseUpdate, b !== g && (b === null ? U.firstBaseUpdate = R : b.next = R, U.lastBaseUpdate = w));
    }
    if (c !== null) {
      var Y = o.baseState;
      g = 0, U = R = w = null, b = c;
      do {
        var O = b.lane & -536870913, k = O !== b.lane;
        if (k ? (St & O) === O : (s & O) === O) {
          O !== 0 && O === na && (pu = !0), U !== null && (U = U.next = {
            lane: 0,
            tag: b.tag,
            payload: b.payload,
            callback: null,
            next: null
          });
          t: {
            var nt = t, ut = b;
            O = e;
            var Gt = i;
            switch (ut.tag) {
              case 1:
                if (nt = ut.payload, typeof nt == "function") {
                  Y = nt.call(Gt, Y, O);
                  break t;
                }
                Y = nt;
                break t;
              case 3:
                nt.flags = nt.flags & -65537 | 128;
              case 0:
                if (nt = ut.payload, O = typeof nt == "function" ? nt.call(Gt, Y, O) : nt, O == null) break t;
                Y = et({}, Y, O);
                break t;
              case 2:
                Un = !0;
            }
          }
          O = b.callback, O !== null && (t.flags |= 64, k && (t.flags |= 8192), k = o.callbacks, k === null ? o.callbacks = [O] : k.push(O));
        } else
          k = {
            lane: O,
            tag: b.tag,
            payload: b.payload,
            callback: b.callback,
            next: null
          }, U === null ? (R = U = k, w = Y) : U = U.next = k, g |= O;
        if (b = b.next, b === null) {
          if (b = o.shared.pending, b === null)
            break;
          k = b, b = k.next, k.next = null, o.lastBaseUpdate = k, o.shared.pending = null;
        }
      } while (!0);
      U === null && (w = Y), o.baseState = w, o.firstBaseUpdate = R, o.lastBaseUpdate = U, c === null && (o.shared.lanes = 0), Zn |= g, t.lanes = g, t.memoizedState = Y;
    }
  }
  function rm(t, e) {
    if (typeof t != "function")
      throw Error(r(191, t));
    t.call(e);
  }
  function om(t, e) {
    var i = t.callbacks;
    if (i !== null)
      for (t.callbacks = null, t = 0; t < i.length; t++)
        rm(i[t], e);
  }
  function hs(t, e) {
    try {
      var i = e.updateQueue, s = i !== null ? i.lastEffect : null;
      if (s !== null) {
        var o = s.next;
        i = o;
        do {
          if ((i.tag & t) === t) {
            s = void 0;
            var c = i.create, g = i.inst;
            s = c(), g.destroy = s;
          }
          i = i.next;
        } while (i !== o);
      }
    } catch (b) {
      Dt(e, e.return, b);
    }
  }
  function qn(t, e, i) {
    try {
      var s = e.updateQueue, o = s !== null ? s.lastEffect : null;
      if (o !== null) {
        var c = o.next;
        s = c;
        do {
          if ((s.tag & t) === t) {
            var g = s.inst, b = g.destroy;
            if (b !== void 0) {
              g.destroy = void 0, o = e;
              var w = i;
              try {
                b();
              } catch (R) {
                Dt(
                  o,
                  w,
                  R
                );
              }
            }
          }
          s = s.next;
        } while (s !== c);
      }
    } catch (R) {
      Dt(e, e.return, R);
    }
  }
  function um(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var i = t.stateNode;
      try {
        om(e, i);
      } catch (s) {
        Dt(t, t.return, s);
      }
    }
  }
  function cm(t, e, i) {
    i.props = yi(
      t.type,
      t.memoizedProps
    ), i.state = t.memoizedState;
    try {
      i.componentWillUnmount();
    } catch (s) {
      Dt(t, e, s);
    }
  }
  function xi(t, e) {
    try {
      var i = t.ref;
      if (i !== null) {
        var s = t.stateNode;
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var o = s;
            break;
          default:
            o = s;
        }
        typeof i == "function" ? t.refCleanup = i(o) : i.current = o;
      }
    } catch (c) {
      Dt(t, e, c);
    }
  }
  function Ee(t, e) {
    var i = t.ref, s = t.refCleanup;
    if (i !== null)
      if (typeof s == "function")
        try {
          s();
        } catch (o) {
          Dt(t, e, o);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof i == "function")
        try {
          i(null);
        } catch (o) {
          Dt(t, e, o);
        }
      else i.current = null;
  }
  function fm(t) {
    var e = t.type, i = t.memoizedProps, s = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          i.autoFocus && s.focus();
          break t;
        case "img":
          i.src ? s.src = i.src : i.srcSet && (s.srcset = i.srcSet);
      }
    } catch (o) {
      Dt(t, t.return, o);
    }
  }
  function dm(t, e, i) {
    try {
      var s = t.stateNode;
      Mx(s, t.type, i, e), s[be] = e;
    } catch (o) {
      Dt(t, t.return, o);
    }
  }
  function hm(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 || t.tag === 4;
  }
  function gu(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || hm(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 27 && t.tag !== 18; ) {
        if (t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function yu(t, e, i) {
    var s = t.tag;
    if (s === 5 || s === 6)
      t = t.stateNode, e ? i.nodeType === 8 ? i.parentNode.insertBefore(t, e) : i.insertBefore(t, e) : (i.nodeType === 8 ? (e = i.parentNode, e.insertBefore(t, i)) : (e = i, e.appendChild(t)), i = i._reactRootContainer, i != null || e.onclick !== null || (e.onclick = lr));
    else if (s !== 4 && s !== 27 && (t = t.child, t !== null))
      for (yu(t, e, i), t = t.sibling; t !== null; )
        yu(t, e, i), t = t.sibling;
  }
  function Ql(t, e, i) {
    var s = t.tag;
    if (s === 5 || s === 6)
      t = t.stateNode, e ? i.insertBefore(t, e) : i.appendChild(t);
    else if (s !== 4 && s !== 27 && (t = t.child, t !== null))
      for (Ql(t, e, i), t = t.sibling; t !== null; )
        Ql(t, e, i), t = t.sibling;
  }
  var vn = !1, Ht = !1, vu = !1, mm = typeof WeakSet == "function" ? WeakSet : Set, ae = null, pm = !1;
  function nx(t, e) {
    if (t = t.containerInfo, Ku = hr, t = zd(t), xo(t)) {
      if ("selectionStart" in t)
        var i = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          i = (i = t.ownerDocument) && i.defaultView || window;
          var s = i.getSelection && i.getSelection();
          if (s && s.rangeCount !== 0) {
            i = s.anchorNode;
            var o = s.anchorOffset, c = s.focusNode;
            s = s.focusOffset;
            try {
              i.nodeType, c.nodeType;
            } catch {
              i = null;
              break t;
            }
            var g = 0, b = -1, w = -1, R = 0, U = 0, Y = t, O = null;
            e: for (; ; ) {
              for (var k; Y !== i || o !== 0 && Y.nodeType !== 3 || (b = g + o), Y !== c || s !== 0 && Y.nodeType !== 3 || (w = g + s), Y.nodeType === 3 && (g += Y.nodeValue.length), (k = Y.firstChild) !== null; )
                O = Y, Y = k;
              for (; ; ) {
                if (Y === t) break e;
                if (O === i && ++R === o && (b = g), O === c && ++U === s && (w = g), (k = Y.nextSibling) !== null) break;
                Y = O, O = Y.parentNode;
              }
              Y = k;
            }
            i = b === -1 || w === -1 ? null : { start: b, end: w };
          } else i = null;
        }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (Qu = { focusedElem: t, selectionRange: i }, hr = !1, ae = e; ae !== null; )
      if (e = ae, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null)
        t.return = e, ae = t;
      else
        for (; ae !== null; ) {
          switch (e = ae, c = e.alternate, t = e.flags, e.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if (t & 1024 && c !== null) {
                t = void 0, i = e, o = c.memoizedProps, c = c.memoizedState, s = i.stateNode;
                try {
                  var nt = yi(
                    i.type,
                    o,
                    i.elementType === i.type
                  );
                  t = s.getSnapshotBeforeUpdate(
                    nt,
                    c
                  ), s.__reactInternalSnapshotBeforeUpdate = t;
                } catch (ut) {
                  Dt(
                    i,
                    i.return,
                    ut
                  );
                }
              }
              break;
            case 3:
              if (t & 1024) {
                if (t = e.stateNode.containerInfo, i = t.nodeType, i === 9)
                  $u(t);
                else if (i === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      $u(t);
                      break;
                    default:
                      t.textContent = "";
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
              if (t & 1024) throw Error(r(163));
          }
          if (t = e.sibling, t !== null) {
            t.return = e.return, ae = t;
            break;
          }
          ae = e.return;
        }
    return nt = pm, pm = !1, nt;
  }
  function gm(t, e, i) {
    var s = i.flags;
    switch (i.tag) {
      case 0:
      case 11:
      case 15:
        xn(t, i), s & 4 && hs(5, i);
        break;
      case 1:
        if (xn(t, i), s & 4)
          if (t = i.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (b) {
              Dt(i, i.return, b);
            }
          else {
            var o = yi(
              i.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                o,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (b) {
              Dt(
                i,
                i.return,
                b
              );
            }
          }
        s & 64 && um(i), s & 512 && xi(i, i.return);
        break;
      case 3:
        if (xn(t, i), s & 64 && (s = i.updateQueue, s !== null)) {
          if (t = null, i.child !== null)
            switch (i.child.tag) {
              case 27:
              case 5:
                t = i.child.stateNode;
                break;
              case 1:
                t = i.child.stateNode;
            }
          try {
            om(s, t);
          } catch (b) {
            Dt(i, i.return, b);
          }
        }
        break;
      case 26:
        xn(t, i), s & 512 && xi(i, i.return);
        break;
      case 27:
      case 5:
        xn(t, i), e === null && s & 4 && fm(i), s & 512 && xi(i, i.return);
        break;
      case 12:
        xn(t, i);
        break;
      case 13:
        xn(t, i), s & 4 && bm(t, i);
        break;
      case 22:
        if (o = i.memoizedState !== null || vn, !o) {
          e = e !== null && e.memoizedState !== null || Ht;
          var c = vn, g = Ht;
          vn = o, (Ht = e) && !g ? Gn(
            t,
            i,
            (i.subtreeFlags & 8772) !== 0
          ) : xn(t, i), vn = c, Ht = g;
        }
        s & 512 && (i.memoizedProps.mode === "manual" ? xi(i, i.return) : Ee(i, i.return));
        break;
      default:
        xn(t, i);
    }
  }
  function ym(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, ym(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && io(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Jt = null, Me = !1;
  function bn(t, e, i) {
    for (i = i.child; i !== null; )
      vm(t, e, i), i = i.sibling;
  }
  function vm(t, e, i) {
    if (we && typeof we.onCommitFiberUnmount == "function")
      try {
        we.onCommitFiberUnmount(ka, i);
      } catch {
      }
    switch (i.tag) {
      case 26:
        Ht || Ee(i, e), bn(
          t,
          e,
          i
        ), i.memoizedState ? i.memoizedState.count-- : i.stateNode && (i = i.stateNode, i.parentNode.removeChild(i));
        break;
      case 27:
        Ht || Ee(i, e);
        var s = Jt, o = Me;
        for (Jt = i.stateNode, bn(
          t,
          e,
          i
        ), i = i.stateNode, e = i.attributes; e.length; )
          i.removeAttributeNode(e[0]);
        io(i), Jt = s, Me = o;
        break;
      case 5:
        Ht || Ee(i, e);
      case 6:
        o = Jt;
        var c = Me;
        if (Jt = null, bn(
          t,
          e,
          i
        ), Jt = o, Me = c, Jt !== null)
          if (Me)
            try {
              t = Jt, s = i.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(s) : t.removeChild(s);
            } catch (g) {
              Dt(
                i,
                e,
                g
              );
            }
          else
            try {
              Jt.removeChild(i.stateNode);
            } catch (g) {
              Dt(
                i,
                e,
                g
              );
            }
        break;
      case 18:
        Jt !== null && (Me ? (e = Jt, i = i.stateNode, e.nodeType === 8 ? Ju(
          e.parentNode,
          i
        ) : e.nodeType === 1 && Ju(e, i), Ns(e)) : Ju(Jt, i.stateNode));
        break;
      case 4:
        s = Jt, o = Me, Jt = i.stateNode.containerInfo, Me = !0, bn(
          t,
          e,
          i
        ), Jt = s, Me = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ht || qn(2, i, e), Ht || qn(4, i, e), bn(
          t,
          e,
          i
        );
        break;
      case 1:
        Ht || (Ee(i, e), s = i.stateNode, typeof s.componentWillUnmount == "function" && cm(
          i,
          e,
          s
        )), bn(
          t,
          e,
          i
        );
        break;
      case 21:
        bn(
          t,
          e,
          i
        );
        break;
      case 22:
        Ht || Ee(i, e), Ht = (s = Ht) || i.memoizedState !== null, bn(
          t,
          e,
          i
        ), Ht = s;
        break;
      default:
        bn(
          t,
          e,
          i
        );
    }
  }
  function bm(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        Ns(t);
      } catch (i) {
        Dt(e, e.return, i);
      }
  }
  function ix(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new mm()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new mm()), e;
      default:
        throw Error(r(435, t.tag));
    }
  }
  function bu(t, e) {
    var i = ix(t);
    e.forEach(function(s) {
      var o = gx.bind(null, t, s);
      i.has(s) || (i.add(s), s.then(o, o));
    });
  }
  function ke(t, e) {
    var i = e.deletions;
    if (i !== null)
      for (var s = 0; s < i.length; s++) {
        var o = i[s], c = t, g = e, b = g;
        t: for (; b !== null; ) {
          switch (b.tag) {
            case 27:
            case 5:
              Jt = b.stateNode, Me = !1;
              break t;
            case 3:
              Jt = b.stateNode.containerInfo, Me = !0;
              break t;
            case 4:
              Jt = b.stateNode.containerInfo, Me = !0;
              break t;
          }
          b = b.return;
        }
        if (Jt === null) throw Error(r(160));
        vm(c, g, o), Jt = null, Me = !1, c = o.alternate, c !== null && (c.return = null), o.return = null;
      }
    if (e.subtreeFlags & 13878)
      for (e = e.child; e !== null; )
        xm(e, t), e = e.sibling;
  }
  var Ze = null;
  function xm(t, e) {
    var i = t.alternate, s = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ke(e, t), Be(t), s & 4 && (qn(3, t, t.return), hs(3, t), qn(5, t, t.return));
        break;
      case 1:
        ke(e, t), Be(t), s & 512 && (Ht || i === null || Ee(i, i.return)), s & 64 && vn && (t = t.updateQueue, t !== null && (s = t.callbacks, s !== null && (i = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = i === null ? s : i.concat(s))));
        break;
      case 26:
        var o = Ze;
        if (ke(e, t), Be(t), s & 512 && (Ht || i === null || Ee(i, i.return)), s & 4) {
          var c = i !== null ? i.memoizedState : null;
          if (s = t.memoizedState, i === null)
            if (s === null)
              if (t.stateNode === null) {
                t: {
                  s = t.type, i = t.memoizedProps, o = o.ownerDocument || o;
                  e: switch (s) {
                    case "title":
                      c = o.getElementsByTagName("title")[0], (!c || c[La] || c[fe] || c.namespaceURI === "http://www.w3.org/2000/svg" || c.hasAttribute("itemprop")) && (c = o.createElement(s), o.head.insertBefore(
                        c,
                        o.querySelector("head > title")
                      )), ce(c, s, i), c[fe] = t, ne(c), s = c;
                      break t;
                    case "link":
                      var g = fp(
                        "link",
                        "href",
                        o
                      ).get(s + (i.href || ""));
                      if (g) {
                        for (var b = 0; b < g.length; b++)
                          if (c = g[b], c.getAttribute("href") === (i.href == null ? null : i.href) && c.getAttribute("rel") === (i.rel == null ? null : i.rel) && c.getAttribute("title") === (i.title == null ? null : i.title) && c.getAttribute("crossorigin") === (i.crossOrigin == null ? null : i.crossOrigin)) {
                            g.splice(b, 1);
                            break e;
                          }
                      }
                      c = o.createElement(s), ce(c, s, i), o.head.appendChild(c);
                      break;
                    case "meta":
                      if (g = fp(
                        "meta",
                        "content",
                        o
                      ).get(s + (i.content || ""))) {
                        for (b = 0; b < g.length; b++)
                          if (c = g[b], c.getAttribute("content") === (i.content == null ? null : "" + i.content) && c.getAttribute("name") === (i.name == null ? null : i.name) && c.getAttribute("property") === (i.property == null ? null : i.property) && c.getAttribute("http-equiv") === (i.httpEquiv == null ? null : i.httpEquiv) && c.getAttribute("charset") === (i.charSet == null ? null : i.charSet)) {
                            g.splice(b, 1);
                            break e;
                          }
                      }
                      c = o.createElement(s), ce(c, s, i), o.head.appendChild(c);
                      break;
                    default:
                      throw Error(r(468, s));
                  }
                  c[fe] = t, ne(c), s = c;
                }
                t.stateNode = s;
              } else
                dp(
                  o,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = cp(
                o,
                s,
                t.memoizedProps
              );
          else
            c !== s ? (c === null ? i.stateNode !== null && (i = i.stateNode, i.parentNode.removeChild(i)) : c.count--, s === null ? dp(
              o,
              t.type,
              t.stateNode
            ) : cp(
              o,
              s,
              t.memoizedProps
            )) : s === null && t.stateNode !== null && dm(
              t,
              t.memoizedProps,
              i.memoizedProps
            );
        }
        break;
      case 27:
        if (s & 4 && t.alternate === null) {
          o = t.stateNode, c = t.memoizedProps;
          try {
            for (var w = o.firstChild; w; ) {
              var R = w.nextSibling, U = w.nodeName;
              w[La] || U === "HEAD" || U === "BODY" || U === "SCRIPT" || U === "STYLE" || U === "LINK" && w.rel.toLowerCase() === "stylesheet" || o.removeChild(w), w = R;
            }
            for (var Y = t.type, O = o.attributes; O.length; )
              o.removeAttributeNode(O[0]);
            ce(o, Y, c), o[fe] = t, o[be] = c;
          } catch (nt) {
            Dt(t, t.return, nt);
          }
        }
      case 5:
        if (ke(e, t), Be(t), s & 512 && (Ht || i === null || Ee(i, i.return)), t.flags & 32) {
          o = t.stateNode;
          try {
            Xi(o, "");
          } catch (nt) {
            Dt(t, t.return, nt);
          }
        }
        s & 4 && t.stateNode != null && (o = t.memoizedProps, dm(
          t,
          o,
          i !== null ? i.memoizedProps : o
        )), s & 1024 && (vu = !0);
        break;
      case 6:
        if (ke(e, t), Be(t), s & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          s = t.memoizedProps, i = t.stateNode;
          try {
            i.nodeValue = s;
          } catch (nt) {
            Dt(t, t.return, nt);
          }
        }
        break;
      case 3:
        if (cr = null, o = Ze, Ze = or(e.containerInfo), ke(e, t), Ze = o, Be(t), s & 4 && i !== null && i.memoizedState.isDehydrated)
          try {
            Ns(e.containerInfo);
          } catch (nt) {
            Dt(t, t.return, nt);
          }
        vu && (vu = !1, Sm(t));
        break;
      case 4:
        s = Ze, Ze = or(
          t.stateNode.containerInfo
        ), ke(e, t), Be(t), Ze = s;
        break;
      case 12:
        ke(e, t), Be(t);
        break;
      case 13:
        ke(e, t), Be(t), t.child.flags & 8192 && t.memoizedState !== null != (i !== null && i.memoizedState !== null) && (Ru = We()), s & 4 && (s = t.updateQueue, s !== null && (t.updateQueue = null, bu(t, s)));
        break;
      case 22:
        if (s & 512 && (Ht || i === null || Ee(i, i.return)), w = t.memoizedState !== null, R = i !== null && i.memoizedState !== null, U = vn, Y = Ht, vn = U || w, Ht = Y || R, ke(e, t), Ht = Y, vn = U, Be(t), e = t.stateNode, e._current = t, e._visibility &= -3, e._visibility |= e._pendingVisibility & 2, s & 8192 && (e._visibility = w ? e._visibility & -2 : e._visibility | 1, w && (e = vn || Ht, i === null || R || e || ra(t)), t.memoizedProps === null || t.memoizedProps.mode !== "manual"))
          t: for (i = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26 || e.tag === 27) {
              if (i === null) {
                R = i = e;
                try {
                  if (o = R.stateNode, w)
                    c = o.style, typeof c.setProperty == "function" ? c.setProperty(
                      "display",
                      "none",
                      "important"
                    ) : c.display = "none";
                  else {
                    g = R.stateNode, b = R.memoizedProps.style;
                    var k = b != null && b.hasOwnProperty("display") ? b.display : null;
                    g.style.display = k == null || typeof k == "boolean" ? "" : ("" + k).trim();
                  }
                } catch (nt) {
                  Dt(R, R.return, nt);
                }
              }
            } else if (e.tag === 6) {
              if (i === null) {
                R = e;
                try {
                  R.stateNode.nodeValue = w ? "" : R.memoizedProps;
                } catch (nt) {
                  Dt(R, R.return, nt);
                }
              }
            } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              i === e && (i = null), e = e.return;
            }
            i === e && (i = null), e.sibling.return = e.return, e = e.sibling;
          }
        s & 4 && (s = t.updateQueue, s !== null && (i = s.retryQueue, i !== null && (s.retryQueue = null, bu(t, i))));
        break;
      case 19:
        ke(e, t), Be(t), s & 4 && (s = t.updateQueue, s !== null && (t.updateQueue = null, bu(t, s)));
        break;
      case 21:
        break;
      default:
        ke(e, t), Be(t);
    }
  }
  function Be(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        if (t.tag !== 27) {
          t: {
            for (var i = t.return; i !== null; ) {
              if (hm(i)) {
                var s = i;
                break t;
              }
              i = i.return;
            }
            throw Error(r(160));
          }
          switch (s.tag) {
            case 27:
              var o = s.stateNode, c = gu(t);
              Ql(t, c, o);
              break;
            case 5:
              var g = s.stateNode;
              s.flags & 32 && (Xi(g, ""), s.flags &= -33);
              var b = gu(t);
              Ql(t, b, g);
              break;
            case 3:
            case 4:
              var w = s.stateNode.containerInfo, R = gu(t);
              yu(
                t,
                R,
                w
              );
              break;
            default:
              throw Error(r(161));
          }
        }
      } catch (U) {
        Dt(t, t.return, U);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Sm(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Sm(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function xn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        gm(t, e.alternate, e), e = e.sibling;
  }
  function ra(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          qn(4, e, e.return), ra(e);
          break;
        case 1:
          Ee(e, e.return);
          var i = e.stateNode;
          typeof i.componentWillUnmount == "function" && cm(
            e,
            e.return,
            i
          ), ra(e);
          break;
        case 26:
        case 27:
        case 5:
          Ee(e, e.return), ra(e);
          break;
        case 22:
          Ee(e, e.return), e.memoizedState === null && ra(e);
          break;
        default:
          ra(e);
      }
      t = t.sibling;
    }
  }
  function Gn(t, e, i) {
    for (i = i && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var s = e.alternate, o = t, c = e, g = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Gn(
            o,
            c,
            i
          ), hs(4, c);
          break;
        case 1:
          if (Gn(
            o,
            c,
            i
          ), s = c, o = s.stateNode, typeof o.componentDidMount == "function")
            try {
              o.componentDidMount();
            } catch (R) {
              Dt(s, s.return, R);
            }
          if (s = c, o = s.updateQueue, o !== null) {
            var b = s.stateNode;
            try {
              var w = o.shared.hiddenCallbacks;
              if (w !== null)
                for (o.shared.hiddenCallbacks = null, o = 0; o < w.length; o++)
                  rm(w[o], b);
            } catch (R) {
              Dt(s, s.return, R);
            }
          }
          i && g & 64 && um(c), xi(c, c.return);
          break;
        case 26:
        case 27:
        case 5:
          Gn(
            o,
            c,
            i
          ), i && s === null && g & 4 && fm(c), xi(c, c.return);
          break;
        case 12:
          Gn(
            o,
            c,
            i
          );
          break;
        case 13:
          Gn(
            o,
            c,
            i
          ), i && g & 4 && bm(o, c);
          break;
        case 22:
          c.memoizedState === null && Gn(
            o,
            c,
            i
          ), xi(c, c.return);
          break;
        default:
          Gn(
            o,
            c,
            i
          );
      }
      e = e.sibling;
    }
  }
  function xu(t, e) {
    var i = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== i && (t != null && t.refCount++, i != null && is(i));
  }
  function Su(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && is(t));
  }
  function Yn(t, e, i, s) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        wm(
          t,
          e,
          i,
          s
        ), e = e.sibling;
  }
  function wm(t, e, i, s) {
    var o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Yn(
          t,
          e,
          i,
          s
        ), o & 2048 && hs(9, e);
        break;
      case 3:
        Yn(
          t,
          e,
          i,
          s
        ), o & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && is(t)));
        break;
      case 12:
        if (o & 2048) {
          Yn(
            t,
            e,
            i,
            s
          ), t = e.stateNode;
          try {
            var c = e.memoizedProps, g = c.id, b = c.onPostCommit;
            typeof b == "function" && b(
              g,
              e.alternate === null ? "mount" : "update",
              t.passiveEffectDuration,
              -0
            );
          } catch (w) {
            Dt(e, e.return, w);
          }
        } else
          Yn(
            t,
            e,
            i,
            s
          );
        break;
      case 23:
        break;
      case 22:
        c = e.stateNode, e.memoizedState !== null ? c._visibility & 4 ? Yn(
          t,
          e,
          i,
          s
        ) : ms(t, e) : c._visibility & 4 ? Yn(
          t,
          e,
          i,
          s
        ) : (c._visibility |= 4, oa(
          t,
          e,
          i,
          s,
          (e.subtreeFlags & 10256) !== 0
        )), o & 2048 && xu(
          e.alternate,
          e
        );
        break;
      case 24:
        Yn(
          t,
          e,
          i,
          s
        ), o & 2048 && Su(e.alternate, e);
        break;
      default:
        Yn(
          t,
          e,
          i,
          s
        );
    }
  }
  function oa(t, e, i, s, o) {
    for (o = o && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var c = t, g = e, b = i, w = s, R = g.flags;
      switch (g.tag) {
        case 0:
        case 11:
        case 15:
          oa(
            c,
            g,
            b,
            w,
            o
          ), hs(8, g);
          break;
        case 23:
          break;
        case 22:
          var U = g.stateNode;
          g.memoizedState !== null ? U._visibility & 4 ? oa(
            c,
            g,
            b,
            w,
            o
          ) : ms(
            c,
            g
          ) : (U._visibility |= 4, oa(
            c,
            g,
            b,
            w,
            o
          )), o && R & 2048 && xu(
            g.alternate,
            g
          );
          break;
        case 24:
          oa(
            c,
            g,
            b,
            w,
            o
          ), o && R & 2048 && Su(g.alternate, g);
          break;
        default:
          oa(
            c,
            g,
            b,
            w,
            o
          );
      }
      e = e.sibling;
    }
  }
  function ms(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var i = t, s = e, o = s.flags;
        switch (s.tag) {
          case 22:
            ms(i, s), o & 2048 && xu(
              s.alternate,
              s
            );
            break;
          case 24:
            ms(i, s), o & 2048 && Su(s.alternate, s);
            break;
          default:
            ms(i, s);
        }
        e = e.sibling;
      }
  }
  var ps = 8192;
  function ua(t) {
    if (t.subtreeFlags & ps)
      for (t = t.child; t !== null; )
        Tm(t), t = t.sibling;
  }
  function Tm(t) {
    switch (t.tag) {
      case 26:
        ua(t), t.flags & ps && t.memoizedState !== null && Zx(
          Ze,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        ua(t);
        break;
      case 3:
      case 4:
        var e = Ze;
        Ze = or(t.stateNode.containerInfo), ua(t), Ze = e;
        break;
      case 22:
        t.memoizedState === null && (e = t.alternate, e !== null && e.memoizedState !== null ? (e = ps, ps = 16777216, ua(t), ps = e) : ua(t));
        break;
      default:
        ua(t);
    }
  }
  function Am(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function gs(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null)
        for (var i = 0; i < e.length; i++) {
          var s = e[i];
          ae = s, Mm(
            s,
            t
          );
        }
      Am(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Em(t), t = t.sibling;
  }
  function Em(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        gs(t), t.flags & 2048 && qn(9, t, t.return);
        break;
      case 3:
        gs(t);
        break;
      case 12:
        gs(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 4 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -5, Pl(t)) : gs(t);
        break;
      default:
        gs(t);
    }
  }
  function Pl(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null)
        for (var i = 0; i < e.length; i++) {
          var s = e[i];
          ae = s, Mm(
            s,
            t
          );
        }
      Am(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          qn(8, e, e.return), Pl(e);
          break;
        case 22:
          i = e.stateNode, i._visibility & 4 && (i._visibility &= -5, Pl(e));
          break;
        default:
          Pl(e);
      }
      t = t.sibling;
    }
  }
  function Mm(t, e) {
    for (; ae !== null; ) {
      var i = ae;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          qn(8, i, e);
          break;
        case 23:
        case 22:
          if (i.memoizedState !== null && i.memoizedState.cachePool !== null) {
            var s = i.memoizedState.cachePool.pool;
            s != null && s.refCount++;
          }
          break;
        case 24:
          is(i.memoizedState.cache);
      }
      if (s = i.child, s !== null) s.return = i, ae = s;
      else
        t: for (i = t; ae !== null; ) {
          s = ae;
          var o = s.sibling, c = s.return;
          if (ym(s), s === i) {
            ae = null;
            break t;
          }
          if (o !== null) {
            o.return = c, ae = o;
            break t;
          }
          ae = c;
        }
    }
  }
  function ax(t, e, i, s) {
    this.tag = t, this.key = i, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ue(t, e, i, s) {
    return new ax(t, e, i, s);
  }
  function wu(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Xn(t, e) {
    var i = t.alternate;
    return i === null ? (i = Ue(
      t.tag,
      e,
      t.key,
      t.mode
    ), i.elementType = t.elementType, i.type = t.type, i.stateNode = t.stateNode, i.alternate = t, t.alternate = i) : (i.pendingProps = e, i.type = t.type, i.flags = 0, i.subtreeFlags = 0, i.deletions = null), i.flags = t.flags & 31457280, i.childLanes = t.childLanes, i.lanes = t.lanes, i.child = t.child, i.memoizedProps = t.memoizedProps, i.memoizedState = t.memoizedState, i.updateQueue = t.updateQueue, e = t.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, i.sibling = t.sibling, i.index = t.index, i.ref = t.ref, i.refCleanup = t.refCleanup, i;
  }
  function jm(t, e) {
    t.flags &= 31457282;
    var i = t.alternate;
    return i === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = i.childLanes, t.lanes = i.lanes, t.child = i.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = i.memoizedProps, t.memoizedState = i.memoizedState, t.updateQueue = i.updateQueue, t.type = i.type, e = i.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function Fl(t, e, i, s, o, c) {
    var g = 0;
    if (s = t, typeof t == "function") wu(t) && (g = 1);
    else if (typeof t == "string")
      g = Yx(
        t,
        i,
        $e.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case h:
          return Si(i.children, o, c, e);
        case p:
          g = 8, o |= 24;
          break;
        case v:
          return t = Ue(12, i, e, o | 2), t.elementType = v, t.lanes = c, t;
        case M:
          return t = Ue(13, i, e, o), t.elementType = M, t.lanes = c, t;
        case z:
          return t = Ue(19, i, e, o), t.elementType = z, t.lanes = c, t;
        case L:
          return Rm(i, o, c, e);
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case x:
              case T:
                g = 10;
                break t;
              case S:
                g = 9;
                break t;
              case A:
                g = 11;
                break t;
              case _:
                g = 14;
                break t;
              case q:
                g = 16, s = null;
                break t;
            }
          g = 29, i = Error(
            r(130, t === null ? "null" : typeof t, "")
          ), s = null;
      }
    return e = Ue(g, i, e, o), e.elementType = t, e.type = s, e.lanes = c, e;
  }
  function Si(t, e, i, s) {
    return t = Ue(7, t, s, e), t.lanes = i, t;
  }
  function Rm(t, e, i, s) {
    t = Ue(22, t, s, e), t.elementType = L, t.lanes = i;
    var o = {
      _visibility: 1,
      _pendingVisibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null,
      _current: null,
      detach: function() {
        var c = o._current;
        if (c === null) throw Error(r(456));
        if (!(o._pendingVisibility & 2)) {
          var g = zn(c, 2);
          g !== null && (o._pendingVisibility |= 2, ye(g, c, 2));
        }
      },
      attach: function() {
        var c = o._current;
        if (c === null) throw Error(r(456));
        if (o._pendingVisibility & 2) {
          var g = zn(c, 2);
          g !== null && (o._pendingVisibility &= -3, ye(g, c, 2));
        }
      }
    };
    return t.stateNode = o, t;
  }
  function Tu(t, e, i) {
    return t = Ue(6, t, null, e), t.lanes = i, t;
  }
  function Au(t, e, i) {
    return e = Ue(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = i, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  function Sn(t) {
    t.flags |= 4;
  }
  function Dm(t, e) {
    if (e.type !== "stylesheet" || e.state.loading & 4)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !hp(e)) {
      if (e = Ve.current, e !== null && ((St & 4194176) === St ? tn !== null : (St & 62914560) !== St && !(St & 536870912) || e !== tn))
        throw ts = Do, Kd;
      t.flags |= 8192;
    }
  }
  function Jl(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Qf() : 536870912, t.lanes |= e, fa |= e);
  }
  function ys(t, e) {
    if (!At)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var i = null; e !== null; )
            e.alternate !== null && (i = e), e = e.sibling;
          i === null ? t.tail = null : i.sibling = null;
          break;
        case "collapsed":
          i = t.tail;
          for (var s = null; i !== null; )
            i.alternate !== null && (s = i), i = i.sibling;
          s === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : s.sibling = null;
      }
  }
  function Bt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, i = 0, s = 0;
    if (e)
      for (var o = t.child; o !== null; )
        i |= o.lanes | o.childLanes, s |= o.subtreeFlags & 31457280, s |= o.flags & 31457280, o.return = t, o = o.sibling;
    else
      for (o = t.child; o !== null; )
        i |= o.lanes | o.childLanes, s |= o.subtreeFlags, s |= o.flags, o.return = t, o = o.sibling;
    return t.subtreeFlags |= s, t.childLanes = i, e;
  }
  function sx(t, e, i) {
    var s = e.pendingProps;
    switch (jo(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Bt(e), null;
      case 1:
        return Bt(e), null;
      case 3:
        return i = e.stateNode, s = null, t !== null && (s = t.memoizedState.cache), e.memoizedState.cache !== s && (e.flags |= 2048), yn(It), Ui(), i.pendingContext && (i.context = i.pendingContext, i.pendingContext = null), (t === null || t.child === null) && (Ja(e) ? Sn(e) : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, Xe !== null && (zu(Xe), Xe = null))), Bt(e), null;
      case 26:
        return i = e.memoizedState, t === null ? (Sn(e), i !== null ? (Bt(e), Dm(e, i)) : (Bt(e), e.flags &= -16777217)) : i ? i !== t.memoizedState ? (Sn(e), Bt(e), Dm(e, i)) : (Bt(e), e.flags &= -16777217) : (t.memoizedProps !== s && Sn(e), Bt(e), e.flags &= -16777217), null;
      case 27:
        ol(e), i = Rn.current;
        var o = e.type;
        if (t !== null && e.stateNode != null)
          t.memoizedProps !== s && Sn(e);
        else {
          if (!s) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Bt(e), null;
          }
          t = $e.current, Ja(e) ? Xd(e) : (t = sp(o, s, i), e.stateNode = t, Sn(e));
        }
        return Bt(e), null;
      case 5:
        if (ol(e), i = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== s && Sn(e);
        else {
          if (!s) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Bt(e), null;
          }
          if (t = $e.current, Ja(e))
            Xd(e);
          else {
            switch (o = rr(
              Rn.current
            ), t) {
              case 1:
                t = o.createElementNS(
                  "http://www.w3.org/2000/svg",
                  i
                );
                break;
              case 2:
                t = o.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  i
                );
                break;
              default:
                switch (i) {
                  case "svg":
                    t = o.createElementNS(
                      "http://www.w3.org/2000/svg",
                      i
                    );
                    break;
                  case "math":
                    t = o.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      i
                    );
                    break;
                  case "script":
                    t = o.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild);
                    break;
                  case "select":
                    t = typeof s.is == "string" ? o.createElement("select", { is: s.is }) : o.createElement("select"), s.multiple ? t.multiple = !0 : s.size && (t.size = s.size);
                    break;
                  default:
                    t = typeof s.is == "string" ? o.createElement(i, { is: s.is }) : o.createElement(i);
                }
            }
            t[fe] = e, t[be] = s;
            t: for (o = e.child; o !== null; ) {
              if (o.tag === 5 || o.tag === 6)
                t.appendChild(o.stateNode);
              else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
                o.child.return = o, o = o.child;
                continue;
              }
              if (o === e) break t;
              for (; o.sibling === null; ) {
                if (o.return === null || o.return === e)
                  break t;
                o = o.return;
              }
              o.sibling.return = o.return, o = o.sibling;
            }
            e.stateNode = t;
            t: switch (ce(t, i, s), i) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                t = !!s.autoFocus;
                break t;
              case "img":
                t = !0;
                break t;
              default:
                t = !1;
            }
            t && Sn(e);
          }
        }
        return Bt(e), e.flags &= -16777217, null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== s && Sn(e);
        else {
          if (typeof s != "string" && e.stateNode === null)
            throw Error(r(166));
          if (t = Rn.current, Ja(e)) {
            if (t = e.stateNode, i = e.memoizedProps, s = null, o = ge, o !== null)
              switch (o.tag) {
                case 27:
                case 5:
                  s = o.memoizedProps;
              }
            t[fe] = e, t = !!(t.nodeValue === i || s !== null && s.suppressHydrationWarning === !0 || Im(t.nodeValue, i)), t || fi(e);
          } else
            t = rr(t).createTextNode(
              s
            ), t[fe] = e, e.stateNode = t;
        }
        return Bt(e), null;
      case 13:
        if (s = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (o = Ja(e), s !== null && s.dehydrated !== null) {
            if (t === null) {
              if (!o) throw Error(r(318));
              if (o = e.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(r(317));
              o[fe] = e;
            } else
              $a(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
            Bt(e), o = !1;
          } else
            Xe !== null && (zu(Xe), Xe = null), o = !0;
          if (!o)
            return e.flags & 256 ? (hn(e), e) : (hn(e), null);
        }
        if (hn(e), e.flags & 128)
          return e.lanes = i, e;
        if (i = s !== null, t = t !== null && t.memoizedState !== null, i) {
          s = e.child, o = null, s.alternate !== null && s.alternate.memoizedState !== null && s.alternate.memoizedState.cachePool !== null && (o = s.alternate.memoizedState.cachePool.pool);
          var c = null;
          s.memoizedState !== null && s.memoizedState.cachePool !== null && (c = s.memoizedState.cachePool.pool), c !== o && (s.flags |= 2048);
        }
        return i !== t && i && (e.child.flags |= 8192), Jl(e, e.updateQueue), Bt(e), null;
      case 4:
        return Ui(), t === null && Yu(e.stateNode.containerInfo), Bt(e), null;
      case 10:
        return yn(e.type), Bt(e), null;
      case 19:
        if (Qt(Wt), o = e.memoizedState, o === null) return Bt(e), null;
        if (s = (e.flags & 128) !== 0, c = o.rendering, c === null)
          if (s) ys(o, !1);
          else {
            if (qt !== 0 || t !== null && t.flags & 128)
              for (t = e.child; t !== null; ) {
                if (c = _l(t), c !== null) {
                  for (e.flags |= 128, ys(o, !1), t = c.updateQueue, e.updateQueue = t, Jl(e, t), e.subtreeFlags = 0, t = i, i = e.child; i !== null; )
                    jm(i, t), i = i.sibling;
                  return Vt(
                    Wt,
                    Wt.current & 1 | 2
                  ), e.child;
                }
                t = t.sibling;
              }
            o.tail !== null && We() > $l && (e.flags |= 128, s = !0, ys(o, !1), e.lanes = 4194304);
          }
        else {
          if (!s)
            if (t = _l(c), t !== null) {
              if (e.flags |= 128, s = !0, t = t.updateQueue, e.updateQueue = t, Jl(e, t), ys(o, !0), o.tail === null && o.tailMode === "hidden" && !c.alternate && !At)
                return Bt(e), null;
            } else
              2 * We() - o.renderingStartTime > $l && i !== 536870912 && (e.flags |= 128, s = !0, ys(o, !1), e.lanes = 4194304);
          o.isBackwards ? (c.sibling = e.child, e.child = c) : (t = o.last, t !== null ? t.sibling = c : e.child = c, o.last = c);
        }
        return o.tail !== null ? (e = o.tail, o.rendering = e, o.tail = e.sibling, o.renderingStartTime = We(), e.sibling = null, t = Wt.current, Vt(Wt, s ? t & 1 | 2 : t & 1), e) : (Bt(e), null);
      case 22:
      case 23:
        return hn(e), No(), s = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== s && (e.flags |= 8192) : s && (e.flags |= 8192), s ? i & 536870912 && !(e.flags & 128) && (Bt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Bt(e), i = e.updateQueue, i !== null && Jl(e, i.retryQueue), i = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool), s = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (s = e.memoizedState.cachePool.pool), s !== i && (e.flags |= 2048), t !== null && Qt(hi), null;
      case 24:
        return i = null, t !== null && (i = t.memoizedState.cache), e.memoizedState.cache !== i && (e.flags |= 2048), yn(It), Bt(e), null;
      case 25:
        return null;
    }
    throw Error(r(156, e.tag));
  }
  function lx(t, e) {
    switch (jo(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return yn(It), Ui(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return ol(e), null;
      case 13:
        if (hn(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(r(340));
          $a();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return Qt(Wt), null;
      case 4:
        return Ui(), null;
      case 10:
        return yn(e.type), null;
      case 22:
      case 23:
        return hn(e), No(), t !== null && Qt(hi), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return yn(It), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Cm(t, e) {
    switch (jo(e), e.tag) {
      case 3:
        yn(It), Ui();
        break;
      case 26:
      case 27:
      case 5:
        ol(e);
        break;
      case 4:
        Ui();
        break;
      case 13:
        hn(e);
        break;
      case 19:
        Qt(Wt);
        break;
      case 10:
        yn(e.type);
        break;
      case 22:
      case 23:
        hn(e), No(), t !== null && Qt(hi);
        break;
      case 24:
        yn(It);
    }
  }
  var rx = {
    getCacheForType: function(t) {
      var e = de(It), i = e.data.get(t);
      return i === void 0 && (i = t(), e.data.set(t, i)), i;
    }
  }, ox = typeof WeakMap == "function" ? WeakMap : Map, Ut = 0, Ct = null, yt = null, St = 0, Nt = 0, je = null, wn = !1, ca = !1, Eu = !1, Tn = 0, qt = 0, Zn = 0, wi = 0, Mu = 0, Le = 0, fa = 0, vs = null, nn = null, ju = !1, Ru = 0, $l = 1 / 0, Wl = null, Kn = null, Il = !1, Ti = null, bs = 0, Du = 0, Cu = null, xs = 0, Nu = null;
  function Re() {
    if (Ut & 2 && St !== 0)
      return St & -St;
    if (Z.T !== null) {
      var t = na;
      return t !== 0 ? t : Lu();
    }
    return $f();
  }
  function Nm() {
    Le === 0 && (Le = !(St & 536870912) || At ? Kf() : 536870912);
    var t = Ve.current;
    return t !== null && (t.flags |= 32), Le;
  }
  function ye(t, e, i) {
    (t === Ct && Nt === 2 || t.cancelPendingCommit !== null) && (da(t, 0), An(
      t,
      St,
      Le,
      !1
    )), Ua(t, i), (!(Ut & 2) || t !== Ct) && (t === Ct && (!(Ut & 2) && (wi |= i), qt === 4 && An(
      t,
      St,
      Le,
      !1
    )), an(t));
  }
  function zm(t, e, i) {
    if (Ut & 6) throw Error(r(327));
    var s = !i && (e & 60) === 0 && (e & t.expiredLanes) === 0 || Ba(t, e), o = s ? fx(t, e) : Vu(t, e, !0), c = s;
    do {
      if (o === 0) {
        ca && !s && An(t, e, 0, !1);
        break;
      } else if (o === 6)
        An(
          t,
          e,
          0,
          !wn
        );
      else {
        if (i = t.current.alternate, c && !ux(i)) {
          o = Vu(t, e, !1), c = !1;
          continue;
        }
        if (o === 2) {
          if (c = e, t.errorRecoveryDisabledLanes & c)
            var g = 0;
          else
            g = t.pendingLanes & -536870913, g = g !== 0 ? g : g & 536870912 ? 536870912 : 0;
          if (g !== 0) {
            e = g;
            t: {
              var b = t;
              o = vs;
              var w = b.current.memoizedState.isDehydrated;
              if (w && (da(b, g).flags |= 256), g = Vu(
                b,
                g,
                !1
              ), g !== 2) {
                if (Eu && !w) {
                  b.errorRecoveryDisabledLanes |= c, wi |= c, o = 4;
                  break t;
                }
                c = nn, nn = o, c !== null && zu(c);
              }
              o = g;
            }
            if (c = !1, o !== 2) continue;
          }
        }
        if (o === 1) {
          da(t, 0), An(t, e, 0, !0);
          break;
        }
        t: {
          switch (s = t, o) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((e & 4194176) === e) {
                An(
                  s,
                  e,
                  Le,
                  !wn
                );
                break t;
              }
              break;
            case 2:
              nn = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if (s.finishedWork = i, s.finishedLanes = e, (e & 62914560) === e && (c = Ru + 300 - We(), 10 < c)) {
            if (An(
              s,
              e,
              Le,
              !wn
            ), dl(s, 0) !== 0) break t;
            s.timeoutHandle = np(
              _m.bind(
                null,
                s,
                i,
                nn,
                Wl,
                ju,
                e,
                Le,
                wi,
                fa,
                wn,
                2,
                -0,
                0
              ),
              c
            );
            break t;
          }
          _m(
            s,
            i,
            nn,
            Wl,
            ju,
            e,
            Le,
            wi,
            fa,
            wn,
            0,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    an(t);
  }
  function zu(t) {
    nn === null ? nn = t : nn.push.apply(
      nn,
      t
    );
  }
  function _m(t, e, i, s, o, c, g, b, w, R, U, Y, O) {
    var k = e.subtreeFlags;
    if ((k & 8192 || (k & 16785408) === 16785408) && (Ms = { stylesheets: null, count: 0, unsuspend: Xx }, Tm(e), e = Kx(), e !== null)) {
      t.cancelPendingCommit = e(
        Hm.bind(
          null,
          t,
          i,
          s,
          o,
          g,
          b,
          w,
          1,
          Y,
          O
        )
      ), An(t, c, g, !R);
      return;
    }
    Hm(
      t,
      i,
      s,
      o,
      g,
      b,
      w,
      U,
      Y,
      O
    );
  }
  function ux(t) {
    for (var e = t; ; ) {
      var i = e.tag;
      if ((i === 0 || i === 11 || i === 15) && e.flags & 16384 && (i = e.updateQueue, i !== null && (i = i.stores, i !== null)))
        for (var s = 0; s < i.length; s++) {
          var o = i[s], c = o.getSnapshot;
          o = o.value;
          try {
            if (!Ae(c(), o)) return !1;
          } catch {
            return !1;
          }
        }
      if (i = e.child, e.subtreeFlags & 16384 && i !== null)
        i.return = e, e = i;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function An(t, e, i, s) {
    e &= ~Mu, e &= ~wi, t.suspendedLanes |= e, t.pingedLanes &= ~e, s && (t.warmLanes |= e), s = t.expirationTimes;
    for (var o = e; 0 < o; ) {
      var c = 31 - Te(o), g = 1 << c;
      s[c] = -1, o &= ~g;
    }
    i !== 0 && Pf(t, i, e);
  }
  function tr() {
    return Ut & 6 ? !0 : (Ss(0), !1);
  }
  function _u() {
    if (yt !== null) {
      if (Nt === 0)
        var t = yt.return;
      else
        t = yt, gn = vi = null, Lo(t), ta = null, es = 0, t = yt;
      for (; t !== null; )
        Cm(t.alternate, t), t = t.return;
      yt = null;
    }
  }
  function da(t, e) {
    t.finishedWork = null, t.finishedLanes = 0;
    var i = t.timeoutHandle;
    i !== -1 && (t.timeoutHandle = -1, Rx(i)), i = t.cancelPendingCommit, i !== null && (t.cancelPendingCommit = null, i()), _u(), Ct = t, yt = i = Xn(t.current, null), St = e, Nt = 0, je = null, wn = !1, ca = Ba(t, e), Eu = !1, fa = Le = Mu = wi = Zn = qt = 0, nn = vs = null, ju = !1, e & 8 && (e |= e & 32);
    var s = t.entangledLanes;
    if (s !== 0)
      for (t = t.entanglements, s &= e; 0 < s; ) {
        var o = 31 - Te(s), c = 1 << o;
        e |= t[o], s &= ~c;
      }
    return Tn = e, Al(), i;
  }
  function Om(t, e) {
    mt = null, Z.H = en, e === Ia ? (e = Fd(), Nt = 3) : e === Kd ? (e = Fd(), Nt = 4) : Nt = e === Qh ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, je = e, yt === null && (qt = 1, Xl(
      t,
      ze(e, t.current)
    ));
  }
  function Vm() {
    var t = Z.H;
    return Z.H = en, t === null ? en : t;
  }
  function km() {
    var t = Z.A;
    return Z.A = rx, t;
  }
  function Ou() {
    qt = 4, wn || (St & 4194176) !== St && Ve.current !== null || (ca = !0), !(Zn & 134217727) && !(wi & 134217727) || Ct === null || An(
      Ct,
      St,
      Le,
      !1
    );
  }
  function Vu(t, e, i) {
    var s = Ut;
    Ut |= 2;
    var o = Vm(), c = km();
    (Ct !== t || St !== e) && (Wl = null, da(t, e)), e = !1;
    var g = qt;
    t: do
      try {
        if (Nt !== 0 && yt !== null) {
          var b = yt, w = je;
          switch (Nt) {
            case 8:
              _u(), g = 6;
              break t;
            case 3:
            case 2:
            case 6:
              Ve.current === null && (e = !0);
              var R = Nt;
              if (Nt = 0, je = null, ha(t, b, w, R), i && ca) {
                g = 0;
                break t;
              }
              break;
            default:
              R = Nt, Nt = 0, je = null, ha(t, b, w, R);
          }
        }
        cx(), g = qt;
        break;
      } catch (U) {
        Om(t, U);
      }
    while (!0);
    return e && t.shellSuspendCounter++, gn = vi = null, Ut = s, Z.H = o, Z.A = c, yt === null && (Ct = null, St = 0, Al()), g;
  }
  function cx() {
    for (; yt !== null; ) Bm(yt);
  }
  function fx(t, e) {
    var i = Ut;
    Ut |= 2;
    var s = Vm(), o = km();
    Ct !== t || St !== e ? (Wl = null, $l = We() + 500, da(t, e)) : ca = Ba(
      t,
      e
    );
    t: do
      try {
        if (Nt !== 0 && yt !== null) {
          e = yt;
          var c = je;
          e: switch (Nt) {
            case 1:
              Nt = 0, je = null, ha(t, e, c, 1);
              break;
            case 2:
              if (Qd(c)) {
                Nt = 0, je = null, Um(e);
                break;
              }
              e = function() {
                Nt === 2 && Ct === t && (Nt = 7), an(t);
              }, c.then(e, e);
              break t;
            case 3:
              Nt = 7;
              break t;
            case 4:
              Nt = 5;
              break t;
            case 7:
              Qd(c) ? (Nt = 0, je = null, Um(e)) : (Nt = 0, je = null, ha(t, e, c, 7));
              break;
            case 5:
              var g = null;
              switch (yt.tag) {
                case 26:
                  g = yt.memoizedState;
                case 5:
                case 27:
                  var b = yt;
                  if (!g || hp(g)) {
                    Nt = 0, je = null;
                    var w = b.sibling;
                    if (w !== null) yt = w;
                    else {
                      var R = b.return;
                      R !== null ? (yt = R, er(R)) : yt = null;
                    }
                    break e;
                  }
              }
              Nt = 0, je = null, ha(t, e, c, 5);
              break;
            case 6:
              Nt = 0, je = null, ha(t, e, c, 6);
              break;
            case 8:
              _u(), qt = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        dx();
        break;
      } catch (U) {
        Om(t, U);
      }
    while (!0);
    return gn = vi = null, Z.H = s, Z.A = o, Ut = i, yt !== null ? 0 : (Ct = null, St = 0, Al(), qt);
  }
  function dx() {
    for (; yt !== null && !Ov(); )
      Bm(yt);
  }
  function Bm(t) {
    var e = sm(t.alternate, t, Tn);
    t.memoizedProps = t.pendingProps, e === null ? er(t) : yt = e;
  }
  function Um(t) {
    var e = t, i = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Ih(
          i,
          e,
          e.pendingProps,
          e.type,
          void 0,
          St
        );
        break;
      case 11:
        e = Ih(
          i,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          St
        );
        break;
      case 5:
        Lo(e);
      default:
        Cm(i, e), e = yt = jm(e, Tn), e = sm(i, e, Tn);
    }
    t.memoizedProps = t.pendingProps, e === null ? er(t) : yt = e;
  }
  function ha(t, e, i, s) {
    gn = vi = null, Lo(e), ta = null, es = 0;
    var o = e.return;
    try {
      if (tx(
        t,
        o,
        e,
        i,
        St
      )) {
        qt = 1, Xl(
          t,
          ze(i, t.current)
        ), yt = null;
        return;
      }
    } catch (c) {
      if (o !== null) throw yt = o, c;
      qt = 1, Xl(
        t,
        ze(i, t.current)
      ), yt = null;
      return;
    }
    e.flags & 32768 ? (At || s === 1 ? t = !0 : ca || St & 536870912 ? t = !1 : (wn = t = !0, (s === 2 || s === 3 || s === 6) && (s = Ve.current, s !== null && s.tag === 13 && (s.flags |= 16384))), Lm(e, t)) : er(e);
  }
  function er(t) {
    var e = t;
    do {
      if (e.flags & 32768) {
        Lm(
          e,
          wn
        );
        return;
      }
      t = e.return;
      var i = sx(
        e.alternate,
        e,
        Tn
      );
      if (i !== null) {
        yt = i;
        return;
      }
      if (e = e.sibling, e !== null) {
        yt = e;
        return;
      }
      yt = e = t;
    } while (e !== null);
    qt === 0 && (qt = 5);
  }
  function Lm(t, e) {
    do {
      var i = lx(t.alternate, t);
      if (i !== null) {
        i.flags &= 32767, yt = i;
        return;
      }
      if (i = t.return, i !== null && (i.flags |= 32768, i.subtreeFlags = 0, i.deletions = null), !e && (t = t.sibling, t !== null)) {
        yt = t;
        return;
      }
      yt = t = i;
    } while (t !== null);
    qt = 6, yt = null;
  }
  function Hm(t, e, i, s, o, c, g, b, w, R) {
    var U = Z.T, Y = F.p;
    try {
      F.p = 2, Z.T = null, hx(
        t,
        e,
        i,
        s,
        Y,
        o,
        c,
        g,
        b,
        w,
        R
      );
    } finally {
      Z.T = U, F.p = Y;
    }
  }
  function hx(t, e, i, s, o, c, g, b) {
    do
      ma();
    while (Ti !== null);
    if (Ut & 6) throw Error(r(327));
    var w = t.finishedWork;
    if (s = t.finishedLanes, w === null) return null;
    if (t.finishedWork = null, t.finishedLanes = 0, w === t.current) throw Error(r(177));
    t.callbackNode = null, t.callbackPriority = 0, t.cancelPendingCommit = null;
    var R = w.lanes | w.childLanes;
    if (R |= Ao, Zv(
      t,
      s,
      R,
      c,
      g,
      b
    ), t === Ct && (yt = Ct = null, St = 0), !(w.subtreeFlags & 10256) && !(w.flags & 10256) || Il || (Il = !0, Du = R, Cu = i, yx(ul, function() {
      return ma(), null;
    })), i = (w.flags & 15990) !== 0, w.subtreeFlags & 15990 || i ? (i = Z.T, Z.T = null, c = F.p, F.p = 2, g = Ut, Ut |= 4, nx(t, w), xm(w, t), Bb(Qu, t.containerInfo), hr = !!Ku, Qu = Ku = null, t.current = w, gm(t, w.alternate, w), Vv(), Ut = g, F.p = c, Z.T = i) : t.current = w, Il ? (Il = !1, Ti = t, bs = s) : qm(t, R), R = t.pendingLanes, R === 0 && (Kn = null), Hv(w.stateNode), an(t), e !== null)
      for (o = t.onRecoverableError, w = 0; w < e.length; w++)
        R = e[w], o(R.value, {
          componentStack: R.stack
        });
    return bs & 3 && ma(), R = t.pendingLanes, s & 4194218 && R & 42 ? t === Nu ? xs++ : (xs = 0, Nu = t) : xs = 0, Ss(0), null;
  }
  function qm(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, is(e)));
  }
  function ma() {
    if (Ti !== null) {
      var t = Ti, e = Du;
      Du = 0;
      var i = Jf(bs), s = Z.T, o = F.p;
      try {
        if (F.p = 32 > i ? 32 : i, Z.T = null, Ti === null)
          var c = !1;
        else {
          i = Cu, Cu = null;
          var g = Ti, b = bs;
          if (Ti = null, bs = 0, Ut & 6)
            throw Error(r(331));
          var w = Ut;
          if (Ut |= 4, Em(g.current), wm(g, g.current, b, i), Ut = w, Ss(0, !1), we && typeof we.onPostCommitFiberRoot == "function")
            try {
              we.onPostCommitFiberRoot(ka, g);
            } catch {
            }
          c = !0;
        }
        return c;
      } finally {
        F.p = o, Z.T = s, qm(t, e);
      }
    }
    return !1;
  }
  function Gm(t, e, i) {
    e = ze(i, e), e = Io(t.stateNode, e, 2), t = Hn(t, e, 2), t !== null && (Ua(t, 2), an(t));
  }
  function Dt(t, e, i) {
    if (t.tag === 3)
      Gm(t, t, i);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Gm(
            e,
            t,
            i
          );
          break;
        } else if (e.tag === 1) {
          var s = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (Kn === null || !Kn.has(s))) {
            t = ze(i, t), i = Zh(2), s = Hn(e, i, 2), s !== null && (Kh(
              i,
              s,
              e,
              t
            ), Ua(s, 2), an(s));
            break;
          }
        }
        e = e.return;
      }
  }
  function ku(t, e, i) {
    var s = t.pingCache;
    if (s === null) {
      s = t.pingCache = new ox();
      var o = /* @__PURE__ */ new Set();
      s.set(e, o);
    } else
      o = s.get(e), o === void 0 && (o = /* @__PURE__ */ new Set(), s.set(e, o));
    o.has(i) || (Eu = !0, o.add(i), t = mx.bind(null, t, e, i), e.then(t, t));
  }
  function mx(t, e, i) {
    var s = t.pingCache;
    s !== null && s.delete(e), t.pingedLanes |= t.suspendedLanes & i, t.warmLanes &= ~i, Ct === t && (St & i) === i && (qt === 4 || qt === 3 && (St & 62914560) === St && 300 > We() - Ru ? !(Ut & 2) && da(t, 0) : Mu |= i, fa === St && (fa = 0)), an(t);
  }
  function Ym(t, e) {
    e === 0 && (e = Qf()), t = zn(t, e), t !== null && (Ua(t, e), an(t));
  }
  function px(t) {
    var e = t.memoizedState, i = 0;
    e !== null && (i = e.retryLane), Ym(t, i);
  }
  function gx(t, e) {
    var i = 0;
    switch (t.tag) {
      case 13:
        var s = t.stateNode, o = t.memoizedState;
        o !== null && (i = o.retryLane);
        break;
      case 19:
        s = t.stateNode;
        break;
      case 22:
        s = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    s !== null && s.delete(e), Ym(t, i);
  }
  function yx(t, e) {
    return Ir(t, e);
  }
  var nr = null, pa = null, Bu = !1, ir = !1, Uu = !1, Ai = 0;
  function an(t) {
    t !== pa && t.next === null && (pa === null ? nr = pa = t : pa = pa.next = t), ir = !0, Bu || (Bu = !0, bx(vx));
  }
  function Ss(t, e) {
    if (!Uu && ir) {
      Uu = !0;
      do
        for (var i = !1, s = nr; s !== null; ) {
          if (t !== 0) {
            var o = s.pendingLanes;
            if (o === 0) var c = 0;
            else {
              var g = s.suspendedLanes, b = s.pingedLanes;
              c = (1 << 31 - Te(42 | t) + 1) - 1, c &= o & ~(g & ~b), c = c & 201326677 ? c & 201326677 | 1 : c ? c | 2 : 0;
            }
            c !== 0 && (i = !0, Km(s, c));
          } else
            c = St, c = dl(
              s,
              s === Ct ? c : 0
            ), !(c & 3) || Ba(s, c) || (i = !0, Km(s, c));
          s = s.next;
        }
      while (i);
      Uu = !1;
    }
  }
  function vx() {
    ir = Bu = !1;
    var t = 0;
    Ai !== 0 && (jx() && (t = Ai), Ai = 0);
    for (var e = We(), i = null, s = nr; s !== null; ) {
      var o = s.next, c = Xm(s, e);
      c === 0 ? (s.next = null, i === null ? nr = o : i.next = o, o === null && (pa = i)) : (i = s, (t !== 0 || c & 3) && (ir = !0)), s = o;
    }
    Ss(t);
  }
  function Xm(t, e) {
    for (var i = t.suspendedLanes, s = t.pingedLanes, o = t.expirationTimes, c = t.pendingLanes & -62914561; 0 < c; ) {
      var g = 31 - Te(c), b = 1 << g, w = o[g];
      w === -1 ? (!(b & i) || b & s) && (o[g] = Xv(b, e)) : w <= e && (t.expiredLanes |= b), c &= ~b;
    }
    if (e = Ct, i = St, i = dl(
      t,
      t === e ? i : 0
    ), s = t.callbackNode, i === 0 || t === e && Nt === 2 || t.cancelPendingCommit !== null)
      return s !== null && s !== null && to(s), t.callbackNode = null, t.callbackPriority = 0;
    if (!(i & 3) || Ba(t, i)) {
      if (e = i & -i, e === t.callbackPriority) return e;
      switch (s !== null && to(s), Jf(i)) {
        case 2:
        case 8:
          i = Xf;
          break;
        case 32:
          i = ul;
          break;
        case 268435456:
          i = Zf;
          break;
        default:
          i = ul;
      }
      return s = Zm.bind(null, t), i = Ir(i, s), t.callbackPriority = e, t.callbackNode = i, e;
    }
    return s !== null && s !== null && to(s), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Zm(t, e) {
    var i = t.callbackNode;
    if (ma() && t.callbackNode !== i)
      return null;
    var s = St;
    return s = dl(
      t,
      t === Ct ? s : 0
    ), s === 0 ? null : (zm(t, s, e), Xm(t, We()), t.callbackNode != null && t.callbackNode === i ? Zm.bind(null, t) : null);
  }
  function Km(t, e) {
    if (ma()) return null;
    zm(t, e, !0);
  }
  function bx(t) {
    Dx(function() {
      Ut & 6 ? Ir(Yf, t) : t();
    });
  }
  function Lu() {
    return Ai === 0 && (Ai = Kf()), Ai;
  }
  function Qm(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : yl("" + t);
  }
  function Pm(t, e) {
    var i = e.ownerDocument.createElement("input");
    return i.name = e.name, i.value = e.value, t.id && i.setAttribute("form", t.id), e.parentNode.insertBefore(i, e), t = new FormData(t), i.parentNode.removeChild(i), t;
  }
  function xx(t, e, i, s, o) {
    if (e === "submit" && i && i.stateNode === o) {
      var c = Qm(
        (o[be] || null).action
      ), g = s.submitter;
      g && (e = (e = g[be] || null) ? Qm(e.formAction) : g.getAttribute("formAction"), e !== null && (c = e, g = null));
      var b = new Sl(
        "action",
        "action",
        null,
        s,
        o
      );
      t.push({
        event: b,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (s.defaultPrevented) {
                if (Ai !== 0) {
                  var w = g ? Pm(o, g) : new FormData(o);
                  Po(
                    i,
                    {
                      pending: !0,
                      data: w,
                      method: o.method,
                      action: c
                    },
                    null,
                    w
                  );
                }
              } else
                typeof c == "function" && (b.preventDefault(), w = g ? Pm(o, g) : new FormData(o), Po(
                  i,
                  {
                    pending: !0,
                    data: w,
                    method: o.method,
                    action: c
                  },
                  c,
                  w
                ));
            },
            currentTarget: o
          }
        ]
      });
    }
  }
  for (var Hu = 0; Hu < Hd.length; Hu++) {
    var qu = Hd[Hu], Sx = qu.toLowerCase(), wx = qu[0].toUpperCase() + qu.slice(1);
    Ye(
      Sx,
      "on" + wx
    );
  }
  Ye(Vd, "onAnimationEnd"), Ye(kd, "onAnimationIteration"), Ye(Bd, "onAnimationStart"), Ye("dblclick", "onDoubleClick"), Ye("focusin", "onFocus"), Ye("focusout", "onBlur"), Ye(Lb, "onTransitionRun"), Ye(Hb, "onTransitionStart"), Ye(qb, "onTransitionCancel"), Ye(Ud, "onTransitionEnd"), Gi("onMouseEnter", ["mouseout", "mouseover"]), Gi("onMouseLeave", ["mouseout", "mouseover"]), Gi("onPointerEnter", ["pointerout", "pointerover"]), Gi("onPointerLeave", ["pointerout", "pointerover"]), si(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), si(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), si("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), si(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), si(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), si(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ws = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Tx = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ws)
  );
  function Fm(t, e) {
    e = (e & 4) !== 0;
    for (var i = 0; i < t.length; i++) {
      var s = t[i], o = s.event;
      s = s.listeners;
      t: {
        var c = void 0;
        if (e)
          for (var g = s.length - 1; 0 <= g; g--) {
            var b = s[g], w = b.instance, R = b.currentTarget;
            if (b = b.listener, w !== c && o.isPropagationStopped())
              break t;
            c = b, o.currentTarget = R;
            try {
              c(o);
            } catch (U) {
              Yl(U);
            }
            o.currentTarget = null, c = w;
          }
        else
          for (g = 0; g < s.length; g++) {
            if (b = s[g], w = b.instance, R = b.currentTarget, b = b.listener, w !== c && o.isPropagationStopped())
              break t;
            c = b, o.currentTarget = R;
            try {
              c(o);
            } catch (U) {
              Yl(U);
            }
            o.currentTarget = null, c = w;
          }
      }
    }
  }
  function xt(t, e) {
    var i = e[no];
    i === void 0 && (i = e[no] = /* @__PURE__ */ new Set());
    var s = t + "__bubble";
    i.has(s) || (Jm(e, t, 2, !1), i.add(s));
  }
  function Gu(t, e, i) {
    var s = 0;
    e && (s |= 4), Jm(
      i,
      t,
      s,
      e
    );
  }
  var ar = "_reactListening" + Math.random().toString(36).slice(2);
  function Yu(t) {
    if (!t[ar]) {
      t[ar] = !0, If.forEach(function(i) {
        i !== "selectionchange" && (Tx.has(i) || Gu(i, !1, t), Gu(i, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[ar] || (e[ar] = !0, Gu("selectionchange", !1, e));
    }
  }
  function Jm(t, e, i, s) {
    switch (bp(e)) {
      case 2:
        var o = Fx;
        break;
      case 8:
        o = Jx;
        break;
      default:
        o = nc;
    }
    i = o.bind(
      null,
      e,
      i,
      t
    ), o = void 0, !co || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (o = !0), s ? o !== void 0 ? t.addEventListener(e, i, {
      capture: !0,
      passive: o
    }) : t.addEventListener(e, i, !0) : o !== void 0 ? t.addEventListener(e, i, {
      passive: o
    }) : t.addEventListener(e, i, !1);
  }
  function Xu(t, e, i, s, o) {
    var c = s;
    if (!(e & 1) && !(e & 2) && s !== null)
      t: for (; ; ) {
        if (s === null) return;
        var g = s.tag;
        if (g === 3 || g === 4) {
          var b = s.stateNode.containerInfo;
          if (b === o || b.nodeType === 8 && b.parentNode === o)
            break;
          if (g === 4)
            for (g = s.return; g !== null; ) {
              var w = g.tag;
              if ((w === 3 || w === 4) && (w = g.stateNode.containerInfo, w === o || w.nodeType === 8 && w.parentNode === o))
                return;
              g = g.return;
            }
          for (; b !== null; ) {
            if (g = ai(b), g === null) return;
            if (w = g.tag, w === 5 || w === 6 || w === 26 || w === 27) {
              s = c = g;
              continue t;
            }
            b = b.parentNode;
          }
        }
        s = s.return;
      }
    fd(function() {
      var R = c, U = oo(i), Y = [];
      t: {
        var O = Ld.get(t);
        if (O !== void 0) {
          var k = Sl, nt = t;
          switch (t) {
            case "keypress":
              if (bl(i) === 0) break t;
            case "keydown":
            case "keyup":
              k = gb;
              break;
            case "focusin":
              nt = "focus", k = po;
              break;
            case "focusout":
              nt = "blur", k = po;
              break;
            case "beforeblur":
            case "afterblur":
              k = po;
              break;
            case "click":
              if (i.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              k = md;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k = ab;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k = bb;
              break;
            case Vd:
            case kd:
            case Bd:
              k = rb;
              break;
            case Ud:
              k = Sb;
              break;
            case "scroll":
            case "scrollend":
              k = nb;
              break;
            case "wheel":
              k = Tb;
              break;
            case "copy":
            case "cut":
            case "paste":
              k = ub;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k = gd;
              break;
            case "toggle":
            case "beforetoggle":
              k = Eb;
          }
          var ut = (e & 4) !== 0, Gt = !ut && (t === "scroll" || t === "scrollend"), D = ut ? O !== null ? O + "Capture" : null : O;
          ut = [];
          for (var j = R, N; j !== null; ) {
            var H = j;
            if (N = H.stateNode, H = H.tag, H !== 5 && H !== 26 && H !== 27 || N === null || D === null || (H = qa(j, D), H != null && ut.push(
              Ts(j, H, N)
            )), Gt) break;
            j = j.return;
          }
          0 < ut.length && (O = new k(
            O,
            nt,
            null,
            i,
            U
          ), Y.push({ event: O, listeners: ut }));
        }
      }
      if (!(e & 7)) {
        t: {
          if (O = t === "mouseover" || t === "pointerover", k = t === "mouseout" || t === "pointerout", O && i !== ro && (nt = i.relatedTarget || i.fromElement) && (ai(nt) || nt[Li]))
            break t;
          if ((k || O) && (O = U.window === U ? U : (O = U.ownerDocument) ? O.defaultView || O.parentWindow : window, k ? (nt = i.relatedTarget || i.toElement, k = R, nt = nt ? ai(nt) : null, nt !== null && (Gt = K(nt), ut = nt.tag, nt !== Gt || ut !== 5 && ut !== 27 && ut !== 6) && (nt = null)) : (k = null, nt = R), k !== nt)) {
            if (ut = md, H = "onMouseLeave", D = "onMouseEnter", j = "mouse", (t === "pointerout" || t === "pointerover") && (ut = gd, H = "onPointerLeave", D = "onPointerEnter", j = "pointer"), Gt = k == null ? O : Ha(k), N = nt == null ? O : Ha(nt), O = new ut(
              H,
              j + "leave",
              k,
              i,
              U
            ), O.target = Gt, O.relatedTarget = N, H = null, ai(U) === R && (ut = new ut(
              D,
              j + "enter",
              nt,
              i,
              U
            ), ut.target = N, ut.relatedTarget = Gt, H = ut), Gt = H, k && nt)
              e: {
                for (ut = k, D = nt, j = 0, N = ut; N; N = ga(N))
                  j++;
                for (N = 0, H = D; H; H = ga(H))
                  N++;
                for (; 0 < j - N; )
                  ut = ga(ut), j--;
                for (; 0 < N - j; )
                  D = ga(D), N--;
                for (; j--; ) {
                  if (ut === D || D !== null && ut === D.alternate)
                    break e;
                  ut = ga(ut), D = ga(D);
                }
                ut = null;
              }
            else ut = null;
            k !== null && $m(
              Y,
              O,
              k,
              ut,
              !1
            ), nt !== null && Gt !== null && $m(
              Y,
              Gt,
              nt,
              ut,
              !0
            );
          }
        }
        t: {
          if (O = R ? Ha(R) : window, k = O.nodeName && O.nodeName.toLowerCase(), k === "select" || k === "input" && O.type === "file")
            var W = Ad;
          else if (wd(O))
            if (Ed)
              W = Vb;
            else {
              W = _b;
              var pt = zb;
            }
          else
            k = O.nodeName, !k || k.toLowerCase() !== "input" || O.type !== "checkbox" && O.type !== "radio" ? R && lo(R.elementType) && (W = Ad) : W = Ob;
          if (W && (W = W(t, R))) {
            Td(
              Y,
              W,
              i,
              U
            );
            break t;
          }
          pt && pt(t, O, R), t === "focusout" && R && O.type === "number" && R.memoizedProps.value != null && so(O, "number", O.value);
        }
        switch (pt = R ? Ha(R) : window, t) {
          case "focusin":
            (wd(pt) || pt.contentEditable === "true") && (Pi = pt, So = R, Fa = null);
            break;
          case "focusout":
            Fa = So = Pi = null;
            break;
          case "mousedown":
            wo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            wo = !1, _d(Y, i, U);
            break;
          case "selectionchange":
            if (Ub) break;
          case "keydown":
          case "keyup":
            _d(Y, i, U);
        }
        var it;
        if (yo)
          t: {
            switch (t) {
              case "compositionstart":
                var lt = "onCompositionStart";
                break t;
              case "compositionend":
                lt = "onCompositionEnd";
                break t;
              case "compositionupdate":
                lt = "onCompositionUpdate";
                break t;
            }
            lt = void 0;
          }
        else
          Qi ? xd(t, i) && (lt = "onCompositionEnd") : t === "keydown" && i.keyCode === 229 && (lt = "onCompositionStart");
        lt && (yd && i.locale !== "ko" && (Qi || lt !== "onCompositionStart" ? lt === "onCompositionEnd" && Qi && (it = dd()) : (Nn = U, fo = "value" in Nn ? Nn.value : Nn.textContent, Qi = !0)), pt = sr(R, lt), 0 < pt.length && (lt = new pd(
          lt,
          t,
          null,
          i,
          U
        ), Y.push({ event: lt, listeners: pt }), it ? lt.data = it : (it = Sd(i), it !== null && (lt.data = it)))), (it = jb ? Rb(t, i) : Db(t, i)) && (lt = sr(R, "onBeforeInput"), 0 < lt.length && (pt = new pd(
          "onBeforeInput",
          "beforeinput",
          null,
          i,
          U
        ), Y.push({
          event: pt,
          listeners: lt
        }), pt.data = it)), xx(
          Y,
          t,
          R,
          i,
          U
        );
      }
      Fm(Y, e);
    });
  }
  function Ts(t, e, i) {
    return {
      instance: t,
      listener: e,
      currentTarget: i
    };
  }
  function sr(t, e) {
    for (var i = e + "Capture", s = []; t !== null; ) {
      var o = t, c = o.stateNode;
      o = o.tag, o !== 5 && o !== 26 && o !== 27 || c === null || (o = qa(t, i), o != null && s.unshift(
        Ts(t, o, c)
      ), o = qa(t, e), o != null && s.push(
        Ts(t, o, c)
      )), t = t.return;
    }
    return s;
  }
  function ga(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function $m(t, e, i, s, o) {
    for (var c = e._reactName, g = []; i !== null && i !== s; ) {
      var b = i, w = b.alternate, R = b.stateNode;
      if (b = b.tag, w !== null && w === s) break;
      b !== 5 && b !== 26 && b !== 27 || R === null || (w = R, o ? (R = qa(i, c), R != null && g.unshift(
        Ts(i, R, w)
      )) : o || (R = qa(i, c), R != null && g.push(
        Ts(i, R, w)
      ))), i = i.return;
    }
    g.length !== 0 && t.push({ event: e, listeners: g });
  }
  var Ax = /\r\n?/g, Ex = /\u0000|\uFFFD/g;
  function Wm(t) {
    return (typeof t == "string" ? t : "" + t).replace(Ax, `
`).replace(Ex, "");
  }
  function Im(t, e) {
    return e = Wm(e), Wm(t) === e;
  }
  function lr() {
  }
  function Rt(t, e, i, s, o, c) {
    switch (i) {
      case "children":
        typeof s == "string" ? e === "body" || e === "textarea" && s === "" || Xi(t, s) : (typeof s == "number" || typeof s == "bigint") && e !== "body" && Xi(t, "" + s);
        break;
      case "className":
        ml(t, "class", s);
        break;
      case "tabIndex":
        ml(t, "tabindex", s);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        ml(t, i, s);
        break;
      case "style":
        ud(t, s, c);
        break;
      case "data":
        if (e !== "object") {
          ml(t, "data", s);
          break;
        }
      case "src":
      case "href":
        if (s === "" && (e !== "a" || i !== "href")) {
          t.removeAttribute(i);
          break;
        }
        if (s == null || typeof s == "function" || typeof s == "symbol" || typeof s == "boolean") {
          t.removeAttribute(i);
          break;
        }
        s = yl("" + s), t.setAttribute(i, s);
        break;
      case "action":
      case "formAction":
        if (typeof s == "function") {
          t.setAttribute(
            i,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof c == "function" && (i === "formAction" ? (e !== "input" && Rt(t, e, "name", o.name, o, null), Rt(
            t,
            e,
            "formEncType",
            o.formEncType,
            o,
            null
          ), Rt(
            t,
            e,
            "formMethod",
            o.formMethod,
            o,
            null
          ), Rt(
            t,
            e,
            "formTarget",
            o.formTarget,
            o,
            null
          )) : (Rt(t, e, "encType", o.encType, o, null), Rt(t, e, "method", o.method, o, null), Rt(t, e, "target", o.target, o, null)));
        if (s == null || typeof s == "symbol" || typeof s == "boolean") {
          t.removeAttribute(i);
          break;
        }
        s = yl("" + s), t.setAttribute(i, s);
        break;
      case "onClick":
        s != null && (t.onclick = lr);
        break;
      case "onScroll":
        s != null && xt("scroll", t);
        break;
      case "onScrollEnd":
        s != null && xt("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s))
            throw Error(r(61));
          if (i = s.__html, i != null) {
            if (o.children != null) throw Error(r(60));
            t.innerHTML = i;
          }
        }
        break;
      case "multiple":
        t.multiple = s && typeof s != "function" && typeof s != "symbol";
        break;
      case "muted":
        t.muted = s && typeof s != "function" && typeof s != "symbol";
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
        if (s == null || typeof s == "function" || typeof s == "boolean" || typeof s == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        i = yl("" + s), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          i
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
        s != null && typeof s != "function" && typeof s != "symbol" ? t.setAttribute(i, "" + s) : t.removeAttribute(i);
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
        s && typeof s != "function" && typeof s != "symbol" ? t.setAttribute(i, "") : t.removeAttribute(i);
        break;
      case "capture":
      case "download":
        s === !0 ? t.setAttribute(i, "") : s !== !1 && s != null && typeof s != "function" && typeof s != "symbol" ? t.setAttribute(i, s) : t.removeAttribute(i);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        s != null && typeof s != "function" && typeof s != "symbol" && !isNaN(s) && 1 <= s ? t.setAttribute(i, s) : t.removeAttribute(i);
        break;
      case "rowSpan":
      case "start":
        s == null || typeof s == "function" || typeof s == "symbol" || isNaN(s) ? t.removeAttribute(i) : t.setAttribute(i, s);
        break;
      case "popover":
        xt("beforetoggle", t), xt("toggle", t), hl(t, "popover", s);
        break;
      case "xlinkActuate":
        cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          s
        );
        break;
      case "xlinkArcrole":
        cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          s
        );
        break;
      case "xlinkRole":
        cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          s
        );
        break;
      case "xlinkShow":
        cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          s
        );
        break;
      case "xlinkTitle":
        cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          s
        );
        break;
      case "xlinkType":
        cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          s
        );
        break;
      case "xmlBase":
        cn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          s
        );
        break;
      case "xmlLang":
        cn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          s
        );
        break;
      case "xmlSpace":
        cn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          s
        );
        break;
      case "is":
        hl(t, "is", s);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < i.length) || i[0] !== "o" && i[0] !== "O" || i[1] !== "n" && i[1] !== "N") && (i = tb.get(i) || i, hl(t, i, s));
    }
  }
  function Zu(t, e, i, s, o, c) {
    switch (i) {
      case "style":
        ud(t, s, c);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s))
            throw Error(r(61));
          if (i = s.__html, i != null) {
            if (o.children != null) throw Error(r(60));
            t.innerHTML = i;
          }
        }
        break;
      case "children":
        typeof s == "string" ? Xi(t, s) : (typeof s == "number" || typeof s == "bigint") && Xi(t, "" + s);
        break;
      case "onScroll":
        s != null && xt("scroll", t);
        break;
      case "onScrollEnd":
        s != null && xt("scrollend", t);
        break;
      case "onClick":
        s != null && (t.onclick = lr);
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
        if (!td.hasOwnProperty(i))
          t: {
            if (i[0] === "o" && i[1] === "n" && (o = i.endsWith("Capture"), e = i.slice(2, o ? i.length - 7 : void 0), c = t[be] || null, c = c != null ? c[i] : null, typeof c == "function" && t.removeEventListener(e, c, o), typeof s == "function")) {
              typeof c != "function" && c !== null && (i in t ? t[i] = null : t.hasAttribute(i) && t.removeAttribute(i)), t.addEventListener(e, s, o);
              break t;
            }
            i in t ? t[i] = s : s === !0 ? t.setAttribute(i, "") : hl(t, i, s);
          }
    }
  }
  function ce(t, e, i) {
    switch (e) {
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
        xt("error", t), xt("load", t);
        var s = !1, o = !1, c;
        for (c in i)
          if (i.hasOwnProperty(c)) {
            var g = i[c];
            if (g != null)
              switch (c) {
                case "src":
                  s = !0;
                  break;
                case "srcSet":
                  o = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, e));
                default:
                  Rt(t, e, c, g, i, null);
              }
          }
        o && Rt(t, e, "srcSet", i.srcSet, i, null), s && Rt(t, e, "src", i.src, i, null);
        return;
      case "input":
        xt("invalid", t);
        var b = c = g = o = null, w = null, R = null;
        for (s in i)
          if (i.hasOwnProperty(s)) {
            var U = i[s];
            if (U != null)
              switch (s) {
                case "name":
                  o = U;
                  break;
                case "type":
                  g = U;
                  break;
                case "checked":
                  w = U;
                  break;
                case "defaultChecked":
                  R = U;
                  break;
                case "value":
                  c = U;
                  break;
                case "defaultValue":
                  b = U;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (U != null)
                    throw Error(r(137, e));
                  break;
                default:
                  Rt(t, e, s, U, i, null);
              }
          }
        sd(
          t,
          c,
          b,
          w,
          R,
          g,
          o,
          !1
        ), pl(t);
        return;
      case "select":
        xt("invalid", t), s = g = c = null;
        for (o in i)
          if (i.hasOwnProperty(o) && (b = i[o], b != null))
            switch (o) {
              case "value":
                c = b;
                break;
              case "defaultValue":
                g = b;
                break;
              case "multiple":
                s = b;
              default:
                Rt(t, e, o, b, i, null);
            }
        e = c, i = g, t.multiple = !!s, e != null ? Yi(t, !!s, e, !1) : i != null && Yi(t, !!s, i, !0);
        return;
      case "textarea":
        xt("invalid", t), c = o = s = null;
        for (g in i)
          if (i.hasOwnProperty(g) && (b = i[g], b != null))
            switch (g) {
              case "value":
                s = b;
                break;
              case "defaultValue":
                o = b;
                break;
              case "children":
                c = b;
                break;
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(r(91));
                break;
              default:
                Rt(t, e, g, b, i, null);
            }
        rd(t, s, o, c), pl(t);
        return;
      case "option":
        for (w in i)
          if (i.hasOwnProperty(w) && (s = i[w], s != null))
            switch (w) {
              case "selected":
                t.selected = s && typeof s != "function" && typeof s != "symbol";
                break;
              default:
                Rt(t, e, w, s, i, null);
            }
        return;
      case "dialog":
        xt("cancel", t), xt("close", t);
        break;
      case "iframe":
      case "object":
        xt("load", t);
        break;
      case "video":
      case "audio":
        for (s = 0; s < ws.length; s++)
          xt(ws[s], t);
        break;
      case "image":
        xt("error", t), xt("load", t);
        break;
      case "details":
        xt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        xt("error", t), xt("load", t);
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
        for (R in i)
          if (i.hasOwnProperty(R) && (s = i[R], s != null))
            switch (R) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                Rt(t, e, R, s, i, null);
            }
        return;
      default:
        if (lo(e)) {
          for (U in i)
            i.hasOwnProperty(U) && (s = i[U], s !== void 0 && Zu(
              t,
              e,
              U,
              s,
              i,
              void 0
            ));
          return;
        }
    }
    for (b in i)
      i.hasOwnProperty(b) && (s = i[b], s != null && Rt(t, e, b, s, i, null));
  }
  function Mx(t, e, i, s) {
    switch (e) {
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
        var o = null, c = null, g = null, b = null, w = null, R = null, U = null;
        for (k in i) {
          var Y = i[k];
          if (i.hasOwnProperty(k) && Y != null)
            switch (k) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                w = Y;
              default:
                s.hasOwnProperty(k) || Rt(t, e, k, null, s, Y);
            }
        }
        for (var O in s) {
          var k = s[O];
          if (Y = i[O], s.hasOwnProperty(O) && (k != null || Y != null))
            switch (O) {
              case "type":
                c = k;
                break;
              case "name":
                o = k;
                break;
              case "checked":
                R = k;
                break;
              case "defaultChecked":
                U = k;
                break;
              case "value":
                g = k;
                break;
              case "defaultValue":
                b = k;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (k != null)
                  throw Error(r(137, e));
                break;
              default:
                k !== Y && Rt(
                  t,
                  e,
                  O,
                  k,
                  s,
                  Y
                );
            }
        }
        ao(
          t,
          g,
          b,
          w,
          R,
          U,
          c,
          o
        );
        return;
      case "select":
        k = g = b = O = null;
        for (c in i)
          if (w = i[c], i.hasOwnProperty(c) && w != null)
            switch (c) {
              case "value":
                break;
              case "multiple":
                k = w;
              default:
                s.hasOwnProperty(c) || Rt(
                  t,
                  e,
                  c,
                  null,
                  s,
                  w
                );
            }
        for (o in s)
          if (c = s[o], w = i[o], s.hasOwnProperty(o) && (c != null || w != null))
            switch (o) {
              case "value":
                O = c;
                break;
              case "defaultValue":
                b = c;
                break;
              case "multiple":
                g = c;
              default:
                c !== w && Rt(
                  t,
                  e,
                  o,
                  c,
                  s,
                  w
                );
            }
        e = b, i = g, s = k, O != null ? Yi(t, !!i, O, !1) : !!s != !!i && (e != null ? Yi(t, !!i, e, !0) : Yi(t, !!i, i ? [] : "", !1));
        return;
      case "textarea":
        k = O = null;
        for (b in i)
          if (o = i[b], i.hasOwnProperty(b) && o != null && !s.hasOwnProperty(b))
            switch (b) {
              case "value":
                break;
              case "children":
                break;
              default:
                Rt(t, e, b, null, s, o);
            }
        for (g in s)
          if (o = s[g], c = i[g], s.hasOwnProperty(g) && (o != null || c != null))
            switch (g) {
              case "value":
                O = o;
                break;
              case "defaultValue":
                k = o;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(r(91));
                break;
              default:
                o !== c && Rt(t, e, g, o, s, c);
            }
        ld(t, O, k);
        return;
      case "option":
        for (var nt in i)
          if (O = i[nt], i.hasOwnProperty(nt) && O != null && !s.hasOwnProperty(nt))
            switch (nt) {
              case "selected":
                t.selected = !1;
                break;
              default:
                Rt(
                  t,
                  e,
                  nt,
                  null,
                  s,
                  O
                );
            }
        for (w in s)
          if (O = s[w], k = i[w], s.hasOwnProperty(w) && O !== k && (O != null || k != null))
            switch (w) {
              case "selected":
                t.selected = O && typeof O != "function" && typeof O != "symbol";
                break;
              default:
                Rt(
                  t,
                  e,
                  w,
                  O,
                  s,
                  k
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
        for (var ut in i)
          O = i[ut], i.hasOwnProperty(ut) && O != null && !s.hasOwnProperty(ut) && Rt(t, e, ut, null, s, O);
        for (R in s)
          if (O = s[R], k = i[R], s.hasOwnProperty(R) && O !== k && (O != null || k != null))
            switch (R) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(r(137, e));
                break;
              default:
                Rt(
                  t,
                  e,
                  R,
                  O,
                  s,
                  k
                );
            }
        return;
      default:
        if (lo(e)) {
          for (var Gt in i)
            O = i[Gt], i.hasOwnProperty(Gt) && O !== void 0 && !s.hasOwnProperty(Gt) && Zu(
              t,
              e,
              Gt,
              void 0,
              s,
              O
            );
          for (U in s)
            O = s[U], k = i[U], !s.hasOwnProperty(U) || O === k || O === void 0 && k === void 0 || Zu(
              t,
              e,
              U,
              O,
              s,
              k
            );
          return;
        }
    }
    for (var D in i)
      O = i[D], i.hasOwnProperty(D) && O != null && !s.hasOwnProperty(D) && Rt(t, e, D, null, s, O);
    for (Y in s)
      O = s[Y], k = i[Y], !s.hasOwnProperty(Y) || O === k || O == null && k == null || Rt(t, e, Y, O, s, k);
  }
  var Ku = null, Qu = null;
  function rr(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function tp(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function ep(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Pu(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Fu = null;
  function jx() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Fu ? !1 : (Fu = t, !0) : (Fu = null, !1);
  }
  var np = typeof setTimeout == "function" ? setTimeout : void 0, Rx = typeof clearTimeout == "function" ? clearTimeout : void 0, ip = typeof Promise == "function" ? Promise : void 0, Dx = typeof queueMicrotask == "function" ? queueMicrotask : typeof ip < "u" ? function(t) {
    return ip.resolve(null).then(t).catch(Cx);
  } : np;
  function Cx(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Ju(t, e) {
    var i = e, s = 0;
    do {
      var o = i.nextSibling;
      if (t.removeChild(i), o && o.nodeType === 8)
        if (i = o.data, i === "/$") {
          if (s === 0) {
            t.removeChild(o), Ns(e);
            return;
          }
          s--;
        } else i !== "$" && i !== "$?" && i !== "$!" || s++;
      i = o;
    } while (i);
    Ns(e);
  }
  function $u(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var i = e;
      switch (e = e.nextSibling, i.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          $u(i), io(i);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (i.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(i);
    }
  }
  function Nx(t, e, i, s) {
    for (; t.nodeType === 1; ) {
      var o = i;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!s && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (s) {
        if (!t[La])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (c = t.getAttribute("rel"), c === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (c !== o.rel || t.getAttribute("href") !== (o.href == null ? null : o.href) || t.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin) || t.getAttribute("title") !== (o.title == null ? null : o.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (c = t.getAttribute("src"), (c !== (o.src == null ? null : o.src) || t.getAttribute("type") !== (o.type == null ? null : o.type) || t.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin)) && c && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var c = o.name == null ? null : "" + o.name;
        if (o.type === "hidden" && t.getAttribute("name") === c)
          return t;
      } else return t;
      if (t = Ke(t.nextSibling), t === null) break;
    }
    return null;
  }
  function zx(t, e, i) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !i || (t = Ke(t.nextSibling), t === null)) return null;
    return t;
  }
  function Ke(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")
          break;
        if (e === "/$") return null;
      }
    }
    return t;
  }
  function ap(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var i = t.data;
        if (i === "$" || i === "$!" || i === "$?") {
          if (e === 0) return t;
          e--;
        } else i === "/$" && e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function sp(t, e, i) {
    switch (e = rr(i), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(r(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(r(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  var He = /* @__PURE__ */ new Map(), lp = /* @__PURE__ */ new Set();
  function or(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.ownerDocument;
  }
  var En = F.d;
  F.d = {
    f: _x,
    r: Ox,
    D: Vx,
    C: kx,
    L: Bx,
    m: Ux,
    X: Hx,
    S: Lx,
    M: qx
  };
  function _x() {
    var t = En.f(), e = tr();
    return t || e;
  }
  function Ox(t) {
    var e = Hi(t);
    e !== null && e.tag === 5 && e.type === "form" ? _h(e) : En.r(t);
  }
  var ya = typeof document > "u" ? null : document;
  function rp(t, e, i) {
    var s = ya;
    if (s && typeof e == "string" && e) {
      var o = Ce(e);
      o = 'link[rel="' + t + '"][href="' + o + '"]', typeof i == "string" && (o += '[crossorigin="' + i + '"]'), lp.has(o) || (lp.add(o), t = { rel: t, crossOrigin: i, href: e }, s.querySelector(o) === null && (e = s.createElement("link"), ce(e, "link", t), ne(e), s.head.appendChild(e)));
    }
  }
  function Vx(t) {
    En.D(t), rp("dns-prefetch", t, null);
  }
  function kx(t, e) {
    En.C(t, e), rp("preconnect", t, e);
  }
  function Bx(t, e, i) {
    En.L(t, e, i);
    var s = ya;
    if (s && t && e) {
      var o = 'link[rel="preload"][as="' + Ce(e) + '"]';
      e === "image" && i && i.imageSrcSet ? (o += '[imagesrcset="' + Ce(
        i.imageSrcSet
      ) + '"]', typeof i.imageSizes == "string" && (o += '[imagesizes="' + Ce(
        i.imageSizes
      ) + '"]')) : o += '[href="' + Ce(t) + '"]';
      var c = o;
      switch (e) {
        case "style":
          c = va(t);
          break;
        case "script":
          c = ba(t);
      }
      He.has(c) || (t = et(
        {
          rel: "preload",
          href: e === "image" && i && i.imageSrcSet ? void 0 : t,
          as: e
        },
        i
      ), He.set(c, t), s.querySelector(o) !== null || e === "style" && s.querySelector(As(c)) || e === "script" && s.querySelector(Es(c)) || (e = s.createElement("link"), ce(e, "link", t), ne(e), s.head.appendChild(e)));
    }
  }
  function Ux(t, e) {
    En.m(t, e);
    var i = ya;
    if (i && t) {
      var s = e && typeof e.as == "string" ? e.as : "script", o = 'link[rel="modulepreload"][as="' + Ce(s) + '"][href="' + Ce(t) + '"]', c = o;
      switch (s) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          c = ba(t);
      }
      if (!He.has(c) && (t = et({ rel: "modulepreload", href: t }, e), He.set(c, t), i.querySelector(o) === null)) {
        switch (s) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (i.querySelector(Es(c)))
              return;
        }
        s = i.createElement("link"), ce(s, "link", t), ne(s), i.head.appendChild(s);
      }
    }
  }
  function Lx(t, e, i) {
    En.S(t, e, i);
    var s = ya;
    if (s && t) {
      var o = qi(s).hoistableStyles, c = va(t);
      e = e || "default";
      var g = o.get(c);
      if (!g) {
        var b = { loading: 0, preload: null };
        if (g = s.querySelector(
          As(c)
        ))
          b.loading = 5;
        else {
          t = et(
            { rel: "stylesheet", href: t, "data-precedence": e },
            i
          ), (i = He.get(c)) && Wu(t, i);
          var w = g = s.createElement("link");
          ne(w), ce(w, "link", t), w._p = new Promise(function(R, U) {
            w.onload = R, w.onerror = U;
          }), w.addEventListener("load", function() {
            b.loading |= 1;
          }), w.addEventListener("error", function() {
            b.loading |= 2;
          }), b.loading |= 4, ur(g, e, s);
        }
        g = {
          type: "stylesheet",
          instance: g,
          count: 1,
          state: b
        }, o.set(c, g);
      }
    }
  }
  function Hx(t, e) {
    En.X(t, e);
    var i = ya;
    if (i && t) {
      var s = qi(i).hoistableScripts, o = ba(t), c = s.get(o);
      c || (c = i.querySelector(Es(o)), c || (t = et({ src: t, async: !0 }, e), (e = He.get(o)) && Iu(t, e), c = i.createElement("script"), ne(c), ce(c, "link", t), i.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, s.set(o, c));
    }
  }
  function qx(t, e) {
    En.M(t, e);
    var i = ya;
    if (i && t) {
      var s = qi(i).hoistableScripts, o = ba(t), c = s.get(o);
      c || (c = i.querySelector(Es(o)), c || (t = et({ src: t, async: !0, type: "module" }, e), (e = He.get(o)) && Iu(t, e), c = i.createElement("script"), ne(c), ce(c, "link", t), i.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, s.set(o, c));
    }
  }
  function op(t, e, i, s) {
    var o = (o = Rn.current) ? or(o) : null;
    if (!o) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof i.precedence == "string" && typeof i.href == "string" ? (e = va(i.href), i = qi(
          o
        ).hoistableStyles, s = i.get(e), s || (s = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, i.set(e, s)), s) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (i.rel === "stylesheet" && typeof i.href == "string" && typeof i.precedence == "string") {
          t = va(i.href);
          var c = qi(
            o
          ).hoistableStyles, g = c.get(t);
          if (g || (o = o.ownerDocument || o, g = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, c.set(t, g), (c = o.querySelector(
            As(t)
          )) && !c._p && (g.instance = c, g.state.loading = 5), He.has(t) || (i = {
            rel: "preload",
            as: "style",
            href: i.href,
            crossOrigin: i.crossOrigin,
            integrity: i.integrity,
            media: i.media,
            hrefLang: i.hrefLang,
            referrerPolicy: i.referrerPolicy
          }, He.set(t, i), c || Gx(
            o,
            t,
            i,
            g.state
          ))), e && s === null)
            throw Error(r(528, ""));
          return g;
        }
        if (e && s !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return e = i.async, i = i.src, typeof i == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = ba(i), i = qi(
          o
        ).hoistableScripts, s = i.get(e), s || (s = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, i.set(e, s)), s) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, t));
    }
  }
  function va(t) {
    return 'href="' + Ce(t) + '"';
  }
  function As(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function up(t) {
    return et({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function Gx(t, e, i, s) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? s.loading = 1 : (e = t.createElement("link"), s.preload = e, e.addEventListener("load", function() {
      return s.loading |= 1;
    }), e.addEventListener("error", function() {
      return s.loading |= 2;
    }), ce(e, "link", i), ne(e), t.head.appendChild(e));
  }
  function ba(t) {
    return '[src="' + Ce(t) + '"]';
  }
  function Es(t) {
    return "script[async]" + t;
  }
  function cp(t, e, i) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var s = t.querySelector(
            'style[data-href~="' + Ce(i.href) + '"]'
          );
          if (s)
            return e.instance = s, ne(s), s;
          var o = et({}, i, {
            "data-href": i.href,
            "data-precedence": i.precedence,
            href: null,
            precedence: null
          });
          return s = (t.ownerDocument || t).createElement(
            "style"
          ), ne(s), ce(s, "style", o), ur(s, i.precedence, t), e.instance = s;
        case "stylesheet":
          o = va(i.href);
          var c = t.querySelector(
            As(o)
          );
          if (c)
            return e.state.loading |= 4, e.instance = c, ne(c), c;
          s = up(i), (o = He.get(o)) && Wu(s, o), c = (t.ownerDocument || t).createElement("link"), ne(c);
          var g = c;
          return g._p = new Promise(function(b, w) {
            g.onload = b, g.onerror = w;
          }), ce(c, "link", s), e.state.loading |= 4, ur(c, i.precedence, t), e.instance = c;
        case "script":
          return c = ba(i.src), (o = t.querySelector(
            Es(c)
          )) ? (e.instance = o, ne(o), o) : (s = i, (o = He.get(c)) && (s = et({}, i), Iu(s, o)), t = t.ownerDocument || t, o = t.createElement("script"), ne(o), ce(o, "link", s), t.head.appendChild(o), e.instance = o);
        case "void":
          return null;
        default:
          throw Error(r(443, e.type));
      }
    else
      e.type === "stylesheet" && !(e.state.loading & 4) && (s = e.instance, e.state.loading |= 4, ur(s, i.precedence, t));
    return e.instance;
  }
  function ur(t, e, i) {
    for (var s = i.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), o = s.length ? s[s.length - 1] : null, c = o, g = 0; g < s.length; g++) {
      var b = s[g];
      if (b.dataset.precedence === e) c = b;
      else if (c !== o) break;
    }
    c ? c.parentNode.insertBefore(t, c.nextSibling) : (e = i.nodeType === 9 ? i.head : i, e.insertBefore(t, e.firstChild));
  }
  function Wu(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Iu(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var cr = null;
  function fp(t, e, i) {
    if (cr === null) {
      var s = /* @__PURE__ */ new Map(), o = cr = /* @__PURE__ */ new Map();
      o.set(i, s);
    } else
      o = cr, s = o.get(i), s || (s = /* @__PURE__ */ new Map(), o.set(i, s));
    if (s.has(t)) return s;
    for (s.set(t, null), i = i.getElementsByTagName(t), o = 0; o < i.length; o++) {
      var c = i[o];
      if (!(c[La] || c[fe] || t === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
        var g = c.getAttribute(e) || "";
        g = t + g;
        var b = s.get(g);
        b ? b.push(c) : s.set(g, [c]);
      }
    }
    return s;
  }
  function dp(t, e, i) {
    t = t.ownerDocument || t, t.head.insertBefore(
      i,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function Yx(t, e, i) {
    if (i === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        switch (e.rel) {
          case "stylesheet":
            return t = e.disabled, typeof e.precedence == "string" && t == null;
          default:
            return !0;
        }
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function hp(t) {
    return !(t.type === "stylesheet" && !(t.state.loading & 3));
  }
  var Ms = null;
  function Xx() {
  }
  function Zx(t, e, i) {
    if (Ms === null) throw Error(r(475));
    var s = Ms;
    if (e.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== !1) && !(e.state.loading & 4)) {
      if (e.instance === null) {
        var o = va(i.href), c = t.querySelector(
          As(o)
        );
        if (c) {
          t = c._p, t !== null && typeof t == "object" && typeof t.then == "function" && (s.count++, s = fr.bind(s), t.then(s, s)), e.state.loading |= 4, e.instance = c, ne(c);
          return;
        }
        c = t.ownerDocument || t, i = up(i), (o = He.get(o)) && Wu(i, o), c = c.createElement("link"), ne(c);
        var g = c;
        g._p = new Promise(function(b, w) {
          g.onload = b, g.onerror = w;
        }), ce(c, "link", i), e.instance = c;
      }
      s.stylesheets === null && (s.stylesheets = /* @__PURE__ */ new Map()), s.stylesheets.set(e, t), (t = e.state.preload) && !(e.state.loading & 3) && (s.count++, e = fr.bind(s), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  function Kx() {
    if (Ms === null) throw Error(r(475));
    var t = Ms;
    return t.stylesheets && t.count === 0 && tc(t, t.stylesheets), 0 < t.count ? function(e) {
      var i = setTimeout(function() {
        if (t.stylesheets && tc(t, t.stylesheets), t.unsuspend) {
          var s = t.unsuspend;
          t.unsuspend = null, s();
        }
      }, 6e4);
      return t.unsuspend = e, function() {
        t.unsuspend = null, clearTimeout(i);
      };
    } : null;
  }
  function fr() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) tc(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var dr = null;
  function tc(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, dr = /* @__PURE__ */ new Map(), e.forEach(Qx, t), dr = null, fr.call(t));
  }
  function Qx(t, e) {
    if (!(e.state.loading & 4)) {
      var i = dr.get(t);
      if (i) var s = i.get(null);
      else {
        i = /* @__PURE__ */ new Map(), dr.set(t, i);
        for (var o = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), c = 0; c < o.length; c++) {
          var g = o[c];
          (g.nodeName === "LINK" || g.getAttribute("media") !== "not all") && (i.set(g.dataset.precedence, g), s = g);
        }
        s && i.set(null, s);
      }
      o = e.instance, g = o.getAttribute("data-precedence"), c = i.get(g) || s, c === s && i.set(null, o), i.set(g, o), this.count++, s = fr.bind(this), o.addEventListener("load", s), o.addEventListener("error", s), c ? c.parentNode.insertBefore(o, c.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(o, t.firstChild)), e.state.loading |= 4;
    }
  }
  var js = {
    $$typeof: T,
    Provider: null,
    Consumer: null,
    _currentValue: ht,
    _currentValue2: ht,
    _threadCount: 0
  };
  function Px(t, e, i, s, o, c, g, b) {
    this.tag = 1, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = eo(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.finishedLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = eo(0), this.hiddenUpdates = eo(null), this.identifierPrefix = s, this.onUncaughtError = o, this.onCaughtError = c, this.onRecoverableError = g, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = b, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function mp(t, e, i, s, o, c, g, b, w, R, U, Y) {
    return t = new Px(
      t,
      e,
      i,
      g,
      b,
      w,
      R,
      Y
    ), e = 1, c === !0 && (e |= 24), c = Ue(3, null, null, e), t.current = c, c.stateNode = t, e = zo(), e.refCount++, t.pooledCache = e, e.refCount++, c.memoizedState = {
      element: s,
      isDehydrated: i,
      cache: e
    }, du(c), t;
  }
  function pp(t) {
    return t ? (t = $i, t) : $i;
  }
  function gp(t, e, i, s, o, c) {
    o = pp(o), s.context === null ? s.context = o : s.pendingContext = o, s = Ln(e), s.payload = { element: i }, c = c === void 0 ? null : c, c !== null && (s.callback = c), i = Hn(t, s, e), i !== null && (ye(i, t, e), cs(i, t, e));
  }
  function yp(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var i = t.retryLane;
      t.retryLane = i !== 0 && i < e ? i : e;
    }
  }
  function ec(t, e) {
    yp(t, e), (t = t.alternate) && yp(t, e);
  }
  function vp(t) {
    if (t.tag === 13) {
      var e = zn(t, 67108864);
      e !== null && ye(e, t, 67108864), ec(t, 67108864);
    }
  }
  var hr = !0;
  function Fx(t, e, i, s) {
    var o = Z.T;
    Z.T = null;
    var c = F.p;
    try {
      F.p = 2, nc(t, e, i, s);
    } finally {
      F.p = c, Z.T = o;
    }
  }
  function Jx(t, e, i, s) {
    var o = Z.T;
    Z.T = null;
    var c = F.p;
    try {
      F.p = 8, nc(t, e, i, s);
    } finally {
      F.p = c, Z.T = o;
    }
  }
  function nc(t, e, i, s) {
    if (hr) {
      var o = ic(s);
      if (o === null)
        Xu(
          t,
          e,
          s,
          mr,
          i
        ), xp(t, s);
      else if (Wx(
        o,
        t,
        e,
        i,
        s
      ))
        s.stopPropagation();
      else if (xp(t, s), e & 4 && -1 < $x.indexOf(t)) {
        for (; o !== null; ) {
          var c = Hi(o);
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (c = c.stateNode, c.current.memoizedState.isDehydrated) {
                  var g = ii(c.pendingLanes);
                  if (g !== 0) {
                    var b = c;
                    for (b.pendingLanes |= 2, b.entangledLanes |= 2; g; ) {
                      var w = 1 << 31 - Te(g);
                      b.entanglements[1] |= w, g &= ~w;
                    }
                    an(c), !(Ut & 6) && ($l = We() + 500, Ss(0));
                  }
                }
                break;
              case 13:
                b = zn(c, 2), b !== null && ye(b, c, 2), tr(), ec(c, 2);
            }
          if (c = ic(s), c === null && Xu(
            t,
            e,
            s,
            mr,
            i
          ), c === o) break;
          o = c;
        }
        o !== null && s.stopPropagation();
      } else
        Xu(
          t,
          e,
          s,
          null,
          i
        );
    }
  }
  function ic(t) {
    return t = oo(t), ac(t);
  }
  var mr = null;
  function ac(t) {
    if (mr = null, t = ai(t), t !== null) {
      var e = K(t);
      if (e === null) t = null;
      else {
        var i = e.tag;
        if (i === 13) {
          if (t = ot(e), t !== null) return t;
          t = null;
        } else if (i === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return mr = t, null;
  }
  function bp(t) {
    switch (t) {
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
        switch (kv()) {
          case Yf:
            return 2;
          case Xf:
            return 8;
          case ul:
          case Bv:
            return 32;
          case Zf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var sc = !1, Qn = null, Pn = null, Fn = null, Rs = /* @__PURE__ */ new Map(), Ds = /* @__PURE__ */ new Map(), Jn = [], $x = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function xp(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Qn = null;
        break;
      case "dragenter":
      case "dragleave":
        Pn = null;
        break;
      case "mouseover":
      case "mouseout":
        Fn = null;
        break;
      case "pointerover":
      case "pointerout":
        Rs.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ds.delete(e.pointerId);
    }
  }
  function Cs(t, e, i, s, o, c) {
    return t === null || t.nativeEvent !== c ? (t = {
      blockedOn: e,
      domEventName: i,
      eventSystemFlags: s,
      nativeEvent: c,
      targetContainers: [o]
    }, e !== null && (e = Hi(e), e !== null && vp(e)), t) : (t.eventSystemFlags |= s, e = t.targetContainers, o !== null && e.indexOf(o) === -1 && e.push(o), t);
  }
  function Wx(t, e, i, s, o) {
    switch (e) {
      case "focusin":
        return Qn = Cs(
          Qn,
          t,
          e,
          i,
          s,
          o
        ), !0;
      case "dragenter":
        return Pn = Cs(
          Pn,
          t,
          e,
          i,
          s,
          o
        ), !0;
      case "mouseover":
        return Fn = Cs(
          Fn,
          t,
          e,
          i,
          s,
          o
        ), !0;
      case "pointerover":
        var c = o.pointerId;
        return Rs.set(
          c,
          Cs(
            Rs.get(c) || null,
            t,
            e,
            i,
            s,
            o
          )
        ), !0;
      case "gotpointercapture":
        return c = o.pointerId, Ds.set(
          c,
          Cs(
            Ds.get(c) || null,
            t,
            e,
            i,
            s,
            o
          )
        ), !0;
    }
    return !1;
  }
  function Sp(t) {
    var e = ai(t.target);
    if (e !== null) {
      var i = K(e);
      if (i !== null) {
        if (e = i.tag, e === 13) {
          if (e = ot(i), e !== null) {
            t.blockedOn = e, Kv(t.priority, function() {
              if (i.tag === 13) {
                var s = Re(), o = zn(i, s);
                o !== null && ye(o, i, s), ec(i, s);
              }
            });
            return;
          }
        } else if (e === 3 && i.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = i.tag === 3 ? i.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function pr(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var i = ic(t.nativeEvent);
      if (i === null) {
        i = t.nativeEvent;
        var s = new i.constructor(
          i.type,
          i
        );
        ro = s, i.target.dispatchEvent(s), ro = null;
      } else
        return e = Hi(i), e !== null && vp(e), t.blockedOn = i, !1;
      e.shift();
    }
    return !0;
  }
  function wp(t, e, i) {
    pr(t) && i.delete(e);
  }
  function Ix() {
    sc = !1, Qn !== null && pr(Qn) && (Qn = null), Pn !== null && pr(Pn) && (Pn = null), Fn !== null && pr(Fn) && (Fn = null), Rs.forEach(wp), Ds.forEach(wp);
  }
  function gr(t, e) {
    t.blockedOn === e && (t.blockedOn = null, sc || (sc = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      Ix
    )));
  }
  var yr = null;
  function Tp(t) {
    yr !== t && (yr = t, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        yr === t && (yr = null);
        for (var e = 0; e < t.length; e += 3) {
          var i = t[e], s = t[e + 1], o = t[e + 2];
          if (typeof s != "function") {
            if (ac(s || i) === null)
              continue;
            break;
          }
          var c = Hi(i);
          c !== null && (t.splice(e, 3), e -= 3, Po(
            c,
            {
              pending: !0,
              data: o,
              method: i.method,
              action: s
            },
            s,
            o
          ));
        }
      }
    ));
  }
  function Ns(t) {
    function e(w) {
      return gr(w, t);
    }
    Qn !== null && gr(Qn, t), Pn !== null && gr(Pn, t), Fn !== null && gr(Fn, t), Rs.forEach(e), Ds.forEach(e);
    for (var i = 0; i < Jn.length; i++) {
      var s = Jn[i];
      s.blockedOn === t && (s.blockedOn = null);
    }
    for (; 0 < Jn.length && (i = Jn[0], i.blockedOn === null); )
      Sp(i), i.blockedOn === null && Jn.shift();
    if (i = (t.ownerDocument || t).$$reactFormReplay, i != null)
      for (s = 0; s < i.length; s += 3) {
        var o = i[s], c = i[s + 1], g = o[be] || null;
        if (typeof c == "function")
          g || Tp(i);
        else if (g) {
          var b = null;
          if (c && c.hasAttribute("formAction")) {
            if (o = c, g = c[be] || null)
              b = g.formAction;
            else if (ac(o) !== null) continue;
          } else b = g.action;
          typeof b == "function" ? i[s + 1] = b : (i.splice(s, 3), s -= 3), Tp(i);
        }
      }
  }
  function lc(t) {
    this._internalRoot = t;
  }
  vr.prototype.render = lc.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(r(409));
    var i = e.current, s = Re();
    gp(i, s, t, e, null, null);
  }, vr.prototype.unmount = lc.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      t.tag === 0 && ma(), gp(t.current, 2, null, t, null, null), tr(), e[Li] = null;
    }
  };
  function vr(t) {
    this._internalRoot = t;
  }
  vr.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = $f();
      t = { blockedOn: null, target: t, priority: e };
      for (var i = 0; i < Jn.length && e !== 0 && e < Jn[i].priority; i++) ;
      Jn.splice(i, 0, t), i === 0 && Sp(t);
    }
  };
  var Ap = a.version;
  if (Ap !== "19.0.0")
    throw Error(
      r(
        527,
        Ap,
        "19.0.0"
      )
    );
  F.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
    return t = X(e), t = t !== null ? st(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var t1 = {
    bundleType: 0,
    version: "19.0.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: Z,
    findFiberByHostInstance: ai,
    reconcilerVersion: "19.0.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var br = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!br.isDisabled && br.supportsFiber)
      try {
        ka = br.inject(
          t1
        ), we = br;
      } catch {
      }
  }
  return Os.createRoot = function(t, e) {
    if (!u(t)) throw Error(r(299));
    var i = !1, s = "", o = qh, c = Gh, g = Yh, b = null;
    return e != null && (e.unstable_strictMode === !0 && (i = !0), e.identifierPrefix !== void 0 && (s = e.identifierPrefix), e.onUncaughtError !== void 0 && (o = e.onUncaughtError), e.onCaughtError !== void 0 && (c = e.onCaughtError), e.onRecoverableError !== void 0 && (g = e.onRecoverableError), e.unstable_transitionCallbacks !== void 0 && (b = e.unstable_transitionCallbacks)), e = mp(
      t,
      1,
      !1,
      null,
      null,
      i,
      s,
      o,
      c,
      g,
      b,
      null
    ), t[Li] = e.current, Yu(
      t.nodeType === 8 ? t.parentNode : t
    ), new lc(e);
  }, Os.hydrateRoot = function(t, e, i) {
    if (!u(t)) throw Error(r(299));
    var s = !1, o = "", c = qh, g = Gh, b = Yh, w = null, R = null;
    return i != null && (i.unstable_strictMode === !0 && (s = !0), i.identifierPrefix !== void 0 && (o = i.identifierPrefix), i.onUncaughtError !== void 0 && (c = i.onUncaughtError), i.onCaughtError !== void 0 && (g = i.onCaughtError), i.onRecoverableError !== void 0 && (b = i.onRecoverableError), i.unstable_transitionCallbacks !== void 0 && (w = i.unstable_transitionCallbacks), i.formState !== void 0 && (R = i.formState)), e = mp(
      t,
      1,
      !0,
      e,
      i ?? null,
      s,
      o,
      c,
      g,
      b,
      w,
      R
    ), e.context = pp(null), i = e.current, s = Re(), o = Ln(s), o.callback = null, Hn(i, o, s), e.current.lanes = s, Ua(e, s), an(e), t[Li] = e.current, Yu(t), new vr(e);
  }, Os.version = "19.0.0", Os;
}
var Op;
function h1() {
  if (Op) return oc.exports;
  Op = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (a) {
        console.error(a);
      }
  }
  return n(), oc.exports = d1(), oc.exports;
}
var Eg = h1(), C = ef();
const Zs = /* @__PURE__ */ a1(C);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const m1 = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Mg = (...n) => n.filter((a, l, r) => !!a && a.trim() !== "" && r.indexOf(a) === l).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var p1 = {
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
const g1 = C.forwardRef(
  ({
    color: n = "currentColor",
    size: a = 24,
    strokeWidth: l = 2,
    absoluteStrokeWidth: r,
    className: u = "",
    children: d,
    iconNode: f,
    ...m
  }, h) => C.createElement(
    "svg",
    {
      ref: h,
      ...p1,
      width: a,
      height: a,
      stroke: n,
      strokeWidth: r ? Number(l) * 24 / Number(a) : l,
      className: Mg("lucide", u),
      ...m
    },
    [
      ...f.map(([p, v]) => C.createElement(p, v)),
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
const ee = (n, a) => {
  const l = C.forwardRef(
    ({ className: r, ...u }, d) => C.createElement(g1, {
      ref: d,
      iconNode: a,
      className: Mg(`lucide-${m1(n)}`, r),
      ...u
    })
  );
  return l.displayName = `${n}`, l;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ks = ee("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jg = ee("BookOpenText", [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  ["path", { d: "M16 12h2", key: "7q9ll5" }],
  ["path", { d: "M16 8h2", key: "msurwy" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ],
  ["path", { d: "M6 12h2", key: "32wvfc" }],
  ["path", { d: "M6 8h2", key: "30oboj" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const y1 = ee("Brain", [
  [
    "path",
    {
      d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
      key: "l5xja"
    }
  ],
  [
    "path",
    {
      d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
      key: "ep3f8r"
    }
  ],
  ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" }],
  ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
  ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
  ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const v1 = ee("Cloud", [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b1 = ee("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x1 = ee("FileDown", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }],
  ["path", { d: "m9 15 3 3 3-3", key: "1npd3o" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rg = ee("Fingerprint", [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S1 = ee("GitBranch", [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w1 = ee("Github", [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T1 = ee("History", [
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
const A1 = ee("Landmark", [
  ["line", { x1: "3", x2: "21", y1: "22", y2: "22", key: "j8o0r" }],
  ["line", { x1: "6", x2: "6", y1: "18", y2: "11", key: "10tf0k" }],
  ["line", { x1: "10", x2: "10", y1: "18", y2: "11", key: "54lgf6" }],
  ["line", { x1: "14", x2: "14", y1: "18", y2: "11", key: "380y" }],
  ["line", { x1: "18", x2: "18", y1: "18", y2: "11", key: "1kevvc" }],
  ["polygon", { points: "12 2 20 7 4 7", key: "jkujk7" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const E1 = ee("MapPinned", [
  [
    "path",
    {
      d: "M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0",
      key: "11u0oz"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
  [
    "path",
    {
      d: "M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712",
      key: "q8zwxj"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const M1 = ee("Play", [
  ["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const j1 = ee("Scale", [
  ["path", { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "7g6ntu" }],
  ["path", { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "ijws7r" }],
  ["path", { d: "M7 21h10", key: "1b0cd5" }],
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["path", { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2", key: "3gwbw2" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dg = ee("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cg = ee("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const R1 = ee("Sparkles", [
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
const Ng = ee("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const D1 = ee("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function zg(n) {
  var a, l, r = "";
  if (typeof n == "string" || typeof n == "number") r += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var u = n.length;
    for (a = 0; a < u; a++) n[a] && (l = zg(n[a])) && (r && (r += " "), r += l);
  } else for (l in n) n[l] && (r && (r += " "), r += l);
  return r;
}
function _g() {
  for (var n, a, l = 0, r = "", u = arguments.length; l < u; l++) (n = arguments[l]) && (a = zg(n)) && (r && (r += " "), r += a);
  return r;
}
const nf = "-", C1 = (n) => {
  const a = z1(n), {
    conflictingClassGroups: l,
    conflictingClassGroupModifiers: r
  } = n;
  return {
    getClassGroupId: (f) => {
      const m = f.split(nf);
      return m[0] === "" && m.length !== 1 && m.shift(), Og(m, a) || N1(f);
    },
    getConflictingClassGroupIds: (f, m) => {
      const h = l[f] || [];
      return m && r[f] ? [...h, ...r[f]] : h;
    }
  };
}, Og = (n, a) => {
  var f;
  if (n.length === 0)
    return a.classGroupId;
  const l = n[0], r = a.nextPart.get(l), u = r ? Og(n.slice(1), r) : void 0;
  if (u)
    return u;
  if (a.validators.length === 0)
    return;
  const d = n.join(nf);
  return (f = a.validators.find(({
    validator: m
  }) => m(d))) == null ? void 0 : f.classGroupId;
}, Vp = /^\[(.+)\]$/, N1 = (n) => {
  if (Vp.test(n)) {
    const a = Vp.exec(n)[1], l = a == null ? void 0 : a.substring(0, a.indexOf(":"));
    if (l)
      return "arbitrary.." + l;
  }
}, z1 = (n) => {
  const {
    theme: a,
    classGroups: l
  } = n, r = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const u in l)
    Cc(l[u], r, u, a);
  return r;
}, Cc = (n, a, l, r) => {
  n.forEach((u) => {
    if (typeof u == "string") {
      const d = u === "" ? a : kp(a, u);
      d.classGroupId = l;
      return;
    }
    if (typeof u == "function") {
      if (_1(u)) {
        Cc(u(r), a, l, r);
        return;
      }
      a.validators.push({
        validator: u,
        classGroupId: l
      });
      return;
    }
    Object.entries(u).forEach(([d, f]) => {
      Cc(f, kp(a, d), l, r);
    });
  });
}, kp = (n, a) => {
  let l = n;
  return a.split(nf).forEach((r) => {
    l.nextPart.has(r) || l.nextPart.set(r, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), l = l.nextPart.get(r);
  }), l;
}, _1 = (n) => n.isThemeGetter, O1 = (n) => {
  if (n < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let a = 0, l = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  const u = (d, f) => {
    l.set(d, f), a++, a > n && (a = 0, r = l, l = /* @__PURE__ */ new Map());
  };
  return {
    get(d) {
      let f = l.get(d);
      if (f !== void 0)
        return f;
      if ((f = r.get(d)) !== void 0)
        return u(d, f), f;
    },
    set(d, f) {
      l.has(d) ? l.set(d, f) : u(d, f);
    }
  };
}, Nc = "!", zc = ":", V1 = zc.length, k1 = (n) => {
  const {
    prefix: a,
    experimentalParseClassName: l
  } = n;
  let r = (u) => {
    const d = [];
    let f = 0, m = 0, h = 0, p;
    for (let A = 0; A < u.length; A++) {
      let M = u[A];
      if (f === 0 && m === 0) {
        if (M === zc) {
          d.push(u.slice(h, A)), h = A + V1;
          continue;
        }
        if (M === "/") {
          p = A;
          continue;
        }
      }
      M === "[" ? f++ : M === "]" ? f-- : M === "(" ? m++ : M === ")" && m--;
    }
    const v = d.length === 0 ? u : u.substring(h), x = B1(v), S = x !== v, T = p && p > h ? p - h : void 0;
    return {
      modifiers: d,
      hasImportantModifier: S,
      baseClassName: x,
      maybePostfixModifierPosition: T
    };
  };
  if (a) {
    const u = a + zc, d = r;
    r = (f) => f.startsWith(u) ? d(f.substring(u.length)) : {
      isExternal: !0,
      modifiers: [],
      hasImportantModifier: !1,
      baseClassName: f,
      maybePostfixModifierPosition: void 0
    };
  }
  if (l) {
    const u = r;
    r = (d) => l({
      className: d,
      parseClassName: u
    });
  }
  return r;
}, B1 = (n) => n.endsWith(Nc) ? n.substring(0, n.length - 1) : n.startsWith(Nc) ? n.substring(1) : n, U1 = (n) => {
  const a = Object.fromEntries(n.orderSensitiveModifiers.map((r) => [r, !0]));
  return (r) => {
    if (r.length <= 1)
      return r;
    const u = [];
    let d = [];
    return r.forEach((f) => {
      f[0] === "[" || a[f] ? (u.push(...d.sort(), f), d = []) : d.push(f);
    }), u.push(...d.sort()), u;
  };
}, L1 = (n) => ({
  cache: O1(n.cacheSize),
  parseClassName: k1(n),
  sortModifiers: U1(n),
  ...C1(n)
}), H1 = /\s+/, q1 = (n, a) => {
  const {
    parseClassName: l,
    getClassGroupId: r,
    getConflictingClassGroupIds: u,
    sortModifiers: d
  } = a, f = [], m = n.trim().split(H1);
  let h = "";
  for (let p = m.length - 1; p >= 0; p -= 1) {
    const v = m[p], {
      isExternal: x,
      modifiers: S,
      hasImportantModifier: T,
      baseClassName: A,
      maybePostfixModifierPosition: M
    } = l(v);
    if (x) {
      h = v + (h.length > 0 ? " " + h : h);
      continue;
    }
    let z = !!M, _ = r(z ? A.substring(0, M) : A);
    if (!_) {
      if (!z) {
        h = v + (h.length > 0 ? " " + h : h);
        continue;
      }
      if (_ = r(A), !_) {
        h = v + (h.length > 0 ? " " + h : h);
        continue;
      }
      z = !1;
    }
    const q = d(S).join(":"), L = T ? q + Nc : q, Q = L + _;
    if (f.includes(Q))
      continue;
    f.push(Q);
    const V = u(_, z);
    for (let B = 0; B < V.length; ++B) {
      const P = V[B];
      f.push(L + P);
    }
    h = v + (h.length > 0 ? " " + h : h);
  }
  return h;
};
function G1() {
  let n = 0, a, l, r = "";
  for (; n < arguments.length; )
    (a = arguments[n++]) && (l = Vg(a)) && (r && (r += " "), r += l);
  return r;
}
const Vg = (n) => {
  if (typeof n == "string")
    return n;
  let a, l = "";
  for (let r = 0; r < n.length; r++)
    n[r] && (a = Vg(n[r])) && (l && (l += " "), l += a);
  return l;
};
function Y1(n, ...a) {
  let l, r, u, d = f;
  function f(h) {
    const p = a.reduce((v, x) => x(v), n());
    return l = L1(p), r = l.cache.get, u = l.cache.set, d = m, m(h);
  }
  function m(h) {
    const p = r(h);
    if (p)
      return p;
    const v = q1(h, l);
    return u(h, v), v;
  }
  return function() {
    return d(G1.apply(null, arguments));
  };
}
const le = (n) => {
  const a = (l) => l[n] || [];
  return a.isThemeGetter = !0, a;
}, kg = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Bg = /^\((?:(\w[\w-]*):)?(.+)\)$/i, X1 = /^\d+\/\d+$/, Z1 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, K1 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Q1 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, P1 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, F1 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, xa = (n) => X1.test(n), vt = (n) => !!n && !Number.isNaN(Number(n)), Ei = (n) => !!n && Number.isInteger(Number(n)), Bp = (n) => n.endsWith("%") && vt(n.slice(0, -1)), Wn = (n) => Z1.test(n), J1 = () => !0, $1 = (n) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  K1.test(n) && !Q1.test(n)
), af = () => !1, W1 = (n) => P1.test(n), I1 = (n) => F1.test(n), t2 = (n) => !I(n) && !tt(n), e2 = (n) => Ca(n, Hg, af), I = (n) => kg.test(n), Mi = (n) => Ca(n, qg, $1), hc = (n) => Ca(n, d2, vt), n2 = (n) => Ca(n, Ug, af), i2 = (n) => Ca(n, Lg, I1), a2 = (n) => Ca(n, af, W1), tt = (n) => Bg.test(n), xr = (n) => Na(n, qg), s2 = (n) => Na(n, h2), l2 = (n) => Na(n, Ug), r2 = (n) => Na(n, Hg), o2 = (n) => Na(n, Lg), u2 = (n) => Na(n, m2, !0), Ca = (n, a, l) => {
  const r = kg.exec(n);
  return r ? r[1] ? a(r[1]) : l(r[2]) : !1;
}, Na = (n, a, l = !1) => {
  const r = Bg.exec(n);
  return r ? r[1] ? a(r[1]) : l : !1;
}, Ug = (n) => n === "position", c2 = /* @__PURE__ */ new Set(["image", "url"]), Lg = (n) => c2.has(n), f2 = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Hg = (n) => f2.has(n), qg = (n) => n === "length", d2 = (n) => n === "number", h2 = (n) => n === "family-name", m2 = (n) => n === "shadow", p2 = () => {
  const n = le("color"), a = le("font"), l = le("text"), r = le("font-weight"), u = le("tracking"), d = le("leading"), f = le("breakpoint"), m = le("container"), h = le("spacing"), p = le("radius"), v = le("shadow"), x = le("inset-shadow"), S = le("drop-shadow"), T = le("blur"), A = le("perspective"), M = le("aspect"), z = le("ease"), _ = le("animate"), q = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], L = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Q = () => ["auto", "hidden", "clip", "visible", "scroll"], V = () => ["auto", "contain", "none"], B = () => [tt, I, h], P = () => [xa, "full", "auto", ...B()], J = () => [Ei, "none", "subgrid", tt, I], Z = () => ["auto", {
    span: ["full", Ei, tt, I]
  }, tt, I], et = () => [Ei, "auto", tt, I], bt = () => ["auto", "min", "max", "fr", tt, I], kt = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline"], _t = () => ["start", "end", "center", "stretch"], Ot = () => ["auto", ...B()], zt = () => [xa, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...B()], G = () => [n, tt, I], $ = () => [Bp, Mi], K = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    p,
    tt,
    I
  ], ot = () => ["", vt, xr, Mi], E = () => ["solid", "dashed", "dotted", "double"], X = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], st = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    T,
    tt,
    I
  ], at = () => ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", tt, I], F = () => ["none", vt, tt, I], ht = () => ["none", vt, tt, I], ct = () => [vt, tt, I], Kt = () => [xa, "full", ...B()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Wn],
      breakpoint: [Wn],
      color: [J1],
      container: [Wn],
      "drop-shadow": [Wn],
      ease: ["in", "out", "in-out"],
      font: [t2],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Wn],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Wn],
      shadow: [Wn],
      spacing: ["px", vt],
      text: [Wn],
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
        aspect: ["auto", "square", xa, I, tt, M]
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
        columns: [vt, I, tt, m]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": q()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": q()
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
        object: [...L(), I, tt]
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
        inset: P()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": P()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": P()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: P()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: P()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: P()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: P()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: P()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: P()
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
        z: [Ei, "auto", tt, I]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [xa, "full", "auto", m, ...B()]
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
        flex: [vt, xa, "auto", "initial", "none", I]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", vt, tt, I]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", vt, tt, I]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Ei, "first", "last", "none", tt, I]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": J()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: Z()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": et()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": et()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": J()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: Z()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": et()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": et()
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
        "auto-cols": bt()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": bt()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: B()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": B()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": B()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...kt(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [..._t(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ..._t()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...kt()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [..._t(), "baseline"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ..._t(), "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": kt()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [..._t(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ..._t()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: B()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: B()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: B()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: B()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: B()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: B()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: B()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: B()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: B()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: Ot()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: Ot()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: Ot()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: Ot()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: Ot()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: Ot()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: Ot()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: Ot()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: Ot()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": B()
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
        "space-y": B()
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
        size: zt()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [m, "screen", ...zt()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          m,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...zt()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          m,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [f]
          },
          ...zt()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", ...zt()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "none", ...zt()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", ...zt()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", l, xr, Mi]
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
        font: [r, tt, hc]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Bp, I]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [s2, I, a]
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
        tracking: [u, tt, I]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [vt, "none", tt, hc]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          d,
          ...B()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", tt, I]
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
        list: ["disc", "decimal", "none", tt, I]
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
        placeholder: G()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: G()
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
        decoration: [...E(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [vt, "from-font", "auto", tt, Mi]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: G()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [vt, "auto", tt, I]
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
        indent: B()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", tt, I]
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
        content: ["none", tt, I]
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
        bg: [...L(), l2, n2]
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
        bg: ["auto", "cover", "contain", r2, e2]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Ei, tt, I],
          radial: ["", tt, I],
          conic: [Ei, tt, I]
        }, o2, i2]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: G()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: $()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: $()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: $()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: G()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: G()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: G()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: K()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": K()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": K()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": K()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": K()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": K()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": K()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": K()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": K()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": K()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": K()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": K()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": K()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": K()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": K()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: ot()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": ot()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": ot()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": ot()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": ot()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": ot()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": ot()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": ot()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": ot()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": ot()
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
        "divide-y": ot()
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
        border: [...E(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...E(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: G()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": G()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": G()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": G()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": G()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": G()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": G()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": G()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": G()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: G()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...E(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [vt, tt, I]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", vt, xr, Mi]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [n]
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
          v,
          u2,
          a2
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: G()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", tt, I, x]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": G()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: ot()
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
        ring: G()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [vt, Mi]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": G()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": ot()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": G()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [vt, tt, I]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...X(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": X()
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
          tt,
          I
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: st()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [vt, tt, I]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [vt, tt, I]
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
          S,
          tt,
          I
        ]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", vt, tt, I]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [vt, tt, I]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", vt, tt, I]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [vt, tt, I]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", vt, tt, I]
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
          tt,
          I
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": st()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [vt, tt, I]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [vt, tt, I]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", vt, tt, I]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [vt, tt, I]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", vt, tt, I]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [vt, tt, I]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [vt, tt, I]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", vt, tt, I]
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
        "border-spacing": B()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": B()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": B()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", tt, I]
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
        duration: [vt, "initial", tt, I]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", z, tt, I]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [vt, tt, I]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", _, tt, I]
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
        perspective: [A, tt, I]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": at()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: F()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": F()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": F()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": F()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: ht()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ht()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ht()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ht()
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
        skew: ct()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ct()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ct()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [tt, I, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: at()
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
        translate: Kt()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Kt()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Kt()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Kt()
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
        accent: G()
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
        caret: G()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", tt, I]
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
        "scroll-m": B()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": B()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": B()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": B()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": B()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": B()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": B()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": B()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": B()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": B()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": B()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": B()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": B()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": B()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": B()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": B()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": B()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": B()
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
        "will-change": ["auto", "scroll", "contents", "transform", tt, I]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...G()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [vt, xr, Mi, hc]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...G()]
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
}, g2 = /* @__PURE__ */ Y1(p2);
function ft(...n) {
  return g2(_g(n));
}
const sf = C.createContext({});
function _i(n) {
  const a = C.useRef(null);
  return a.current === null && (a.current = n()), a.current;
}
const lf = typeof window < "u", tl = lf ? C.useLayoutEffect : C.useEffect, Yr = /* @__PURE__ */ C.createContext(null), el = C.createContext({
  transformPagePoint: (n) => n,
  isStatic: !1,
  reducedMotion: "never"
});
class y2 extends C.Component {
  getSnapshotBeforeUpdate(a) {
    const l = this.props.childRef.current;
    if (l && a.isPresent && !this.props.isPresent) {
      const r = l.offsetParent, u = r instanceof HTMLElement && r.offsetWidth || 0, d = this.props.sizeRef.current;
      d.height = l.offsetHeight || 0, d.width = l.offsetWidth || 0, d.top = l.offsetTop, d.left = l.offsetLeft, d.right = u - d.width - d.left;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function v2({ children: n, isPresent: a, anchorX: l }) {
  const r = C.useId(), u = C.useRef(null), d = C.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce: f } = C.useContext(el);
  return C.useInsertionEffect(() => {
    const { width: m, height: h, top: p, left: v, right: x } = d.current;
    if (a || !u.current || !m || !h)
      return;
    const S = l === "left" ? `left: ${v}` : `right: ${x}`;
    u.current.dataset.motionPopId = r;
    const T = document.createElement("style");
    return f && (T.nonce = f), document.head.appendChild(T), T.sheet && T.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${m}px !important;
            height: ${h}px !important;
            ${S}px !important;
            top: ${p}px !important;
          }
        `), () => {
      document.head.removeChild(T);
    };
  }, [a]), y.jsx(y2, { isPresent: a, childRef: u, sizeRef: d, children: C.cloneElement(n, { ref: u }) });
}
const b2 = ({ children: n, initial: a, isPresent: l, onExitComplete: r, custom: u, presenceAffectsLayout: d, mode: f, anchorX: m }) => {
  const h = _i(x2), p = C.useId(), v = C.useCallback((S) => {
    h.set(S, !0);
    for (const T of h.values())
      if (!T)
        return;
    r && r();
  }, [h, r]), x = C.useMemo(
    () => ({
      id: p,
      initial: a,
      isPresent: l,
      custom: u,
      onExitComplete: v,
      register: (S) => (h.set(S, !1), () => h.delete(S))
    }),
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    d ? [Math.random(), v] : [l, v]
  );
  return C.useMemo(() => {
    h.forEach((S, T) => h.set(T, !1));
  }, [l]), C.useEffect(() => {
    !l && !h.size && r && r();
  }, [l]), f === "popLayout" && (n = y.jsx(v2, { isPresent: l, anchorX: m, children: n })), y.jsx(Yr.Provider, { value: x, children: n });
};
function x2() {
  return /* @__PURE__ */ new Map();
}
function Gg(n = !0) {
  const a = C.useContext(Yr);
  if (a === null)
    return [!0, null];
  const { isPresent: l, onExitComplete: r, register: u } = a, d = C.useId();
  C.useEffect(() => {
    if (n)
      return u(d);
  }, [n]);
  const f = C.useCallback(() => n && r && r(d), [d, r, n]);
  return !l && r ? [!1, f] : [!0];
}
const Sr = (n) => n.key || "";
function Up(n) {
  const a = [];
  return C.Children.forEach(n, (l) => {
    C.isValidElement(l) && a.push(l);
  }), a;
}
const Xr = ({ children: n, custom: a, initial: l = !0, onExitComplete: r, presenceAffectsLayout: u = !0, mode: d = "sync", propagate: f = !1, anchorX: m = "left" }) => {
  const [h, p] = Gg(f), v = C.useMemo(() => Up(n), [n]), x = f && !h ? [] : v.map(Sr), S = C.useRef(!0), T = C.useRef(v), A = _i(() => /* @__PURE__ */ new Map()), [M, z] = C.useState(v), [_, q] = C.useState(v);
  tl(() => {
    S.current = !1, T.current = v;
    for (let V = 0; V < _.length; V++) {
      const B = Sr(_[V]);
      x.includes(B) ? A.delete(B) : A.get(B) !== !0 && A.set(B, !1);
    }
  }, [_, x.length, x.join("-")]);
  const L = [];
  if (v !== M) {
    let V = [...v];
    for (let B = 0; B < _.length; B++) {
      const P = _[B], J = Sr(P);
      x.includes(J) || (V.splice(B, 0, P), L.push(P));
    }
    return d === "wait" && L.length && (V = L), q(Up(V)), z(v), null;
  }
  const { forceRender: Q } = C.useContext(sf);
  return y.jsx(y.Fragment, { children: _.map((V) => {
    const B = Sr(V), P = f && !h ? !1 : v === _ || x.includes(B), J = () => {
      if (A.has(B))
        A.set(B, !0);
      else
        return;
      let Z = !0;
      A.forEach((et) => {
        et || (Z = !1);
      }), Z && (Q == null || Q(), q(T.current), f && (p == null || p()), r && r());
    };
    return y.jsx(b2, { isPresent: P, initial: !S.current || l ? void 0 : !1, custom: a, presenceAffectsLayout: u, mode: d, onExitComplete: P ? void 0 : J, anchorX: m, children: V }, B);
  }) });
}, pe = /* @__NO_SIDE_EFFECTS__ */ (n) => n;
let S2 = pe, Yg = pe;
const w2 = {
  useManualTiming: !1
}, wr = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function T2(n, a) {
  let l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), u = !1, d = !1;
  const f = /* @__PURE__ */ new WeakSet();
  let m = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function h(v) {
    f.has(v) && (p.schedule(v), n()), v(m);
  }
  const p = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (v, x = !1, S = !1) => {
      const A = S && u ? l : r;
      return x && f.add(v), A.has(v) || A.add(v), v;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (v) => {
      r.delete(v), f.delete(v);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (v) => {
      if (m = v, u) {
        d = !0;
        return;
      }
      u = !0, [l, r] = [r, l], l.forEach(h), l.clear(), u = !1, d && (d = !1, p.process(v));
    }
  };
  return p;
}
const A2 = 40;
function Xg(n, a) {
  let l = !1, r = !0;
  const u = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, d = () => l = !0, f = wr.reduce((_, q) => (_[q] = T2(d), _), {}), { read: m, resolveKeyframes: h, update: p, preRender: v, render: x, postRender: S } = f, T = () => {
    const _ = performance.now();
    l = !1, u.delta = r ? 1e3 / 60 : Math.max(Math.min(_ - u.timestamp, A2), 1), u.timestamp = _, u.isProcessing = !0, m.process(u), h.process(u), p.process(u), v.process(u), x.process(u), S.process(u), u.isProcessing = !1, l && a && (r = !1, n(T));
  }, A = () => {
    l = !0, r = !0, u.isProcessing || n(T);
  };
  return { schedule: wr.reduce((_, q) => {
    const L = f[q];
    return _[q] = (Q, V = !1, B = !1) => (l || A(), L.schedule(Q, V, B)), _;
  }, {}), cancel: (_) => {
    for (let q = 0; q < wr.length; q++)
      f[wr[q]].cancel(_);
  }, state: u, steps: f };
}
const { schedule: Tt, cancel: Je, state: re, steps: mc } = /* @__PURE__ */ Xg(typeof requestAnimationFrame < "u" ? requestAnimationFrame : pe, !0), Zg = C.createContext({ strict: !1 }), Lp = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, ja = {};
for (const n in Lp)
  ja[n] = {
    isEnabled: (a) => Lp[n].some((l) => !!a[l])
  };
function E2(n) {
  for (const a in n)
    ja[a] = {
      ...ja[a],
      ...n[a]
    };
}
const M2 = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function Vr(n) {
  return n.startsWith("while") || n.startsWith("drag") && n !== "draggable" || n.startsWith("layout") || n.startsWith("onTap") || n.startsWith("onPan") || n.startsWith("onLayout") || M2.has(n);
}
let Kg = (n) => !Vr(n);
function j2(n) {
  n && (Kg = (a) => a.startsWith("on") ? !Vr(a) : n(a));
}
try {
  j2(require("@emotion/is-prop-valid").default);
} catch {
}
function R2(n, a, l) {
  const r = {};
  for (const u in n)
    u === "values" && typeof n.values == "object" || (Kg(u) || l === !0 && Vr(u) || !a && !Vr(u) || // If trying to use native HTML drag events, forward drag listeners
    n.draggable && u.startsWith("onDrag")) && (r[u] = n[u]);
  return r;
}
function D2(n) {
  if (typeof Proxy > "u")
    return n;
  const a = /* @__PURE__ */ new Map(), l = (...r) => n(...r);
  return new Proxy(l, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (r, u) => u === "create" ? n : (a.has(u) || a.set(u, n(u)), a.get(u))
  });
}
const Zr = /* @__PURE__ */ C.createContext({});
function Kr(n) {
  return n !== null && typeof n == "object" && typeof n.start == "function";
}
function Qs(n) {
  return typeof n == "string" || Array.isArray(n);
}
const rf = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], of = ["initial", ...rf];
function Qr(n) {
  return Kr(n.animate) || of.some((a) => Qs(n[a]));
}
function Qg(n) {
  return !!(Qr(n) || n.variants);
}
function C2(n, a) {
  if (Qr(n)) {
    const { initial: l, animate: r } = n;
    return {
      initial: l === !1 || Qs(l) ? l : void 0,
      animate: Qs(r) ? r : void 0
    };
  }
  return n.inherit !== !1 ? a : {};
}
function N2(n) {
  const { initial: a, animate: l } = C2(n, C.useContext(Zr));
  return C.useMemo(() => ({ initial: a, animate: l }), [Hp(a), Hp(l)]);
}
function Hp(n) {
  return Array.isArray(n) ? n.join(" ") : n;
}
const z2 = Symbol.for("motionComponentSymbol");
function wa(n) {
  return n && typeof n == "object" && Object.prototype.hasOwnProperty.call(n, "current");
}
function _2(n, a, l) {
  return C.useCallback(
    (r) => {
      r && n.onMount && n.onMount(r), a && (r ? a.mount(r) : a.unmount()), l && (typeof l == "function" ? l(r) : wa(l) && (l.current = r));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [a]
  );
}
const { schedule: uf } = /* @__PURE__ */ Xg(queueMicrotask, !1), cf = (n) => n.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), O2 = "framerAppearId", Pg = "data-" + cf(O2), Fg = C.createContext({});
function V2(n, a, l, r, u) {
  var d, f;
  const { visualElement: m } = C.useContext(Zr), h = C.useContext(Zg), p = C.useContext(Yr), v = C.useContext(el).reducedMotion, x = C.useRef(null);
  r = r || h.renderer, !x.current && r && (x.current = r(n, {
    visualState: a,
    parent: m,
    props: l,
    presenceContext: p,
    blockInitialAnimation: p ? p.initial === !1 : !1,
    reducedMotionConfig: v
  }));
  const S = x.current, T = C.useContext(Fg);
  S && !S.projection && u && (S.type === "html" || S.type === "svg") && k2(x.current, l, u, T);
  const A = C.useRef(!1);
  C.useInsertionEffect(() => {
    S && A.current && S.update(l, p);
  });
  const M = l[Pg], z = C.useRef(!!M && !(!((d = window.MotionHandoffIsComplete) === null || d === void 0) && d.call(window, M)) && ((f = window.MotionHasOptimisedAnimation) === null || f === void 0 ? void 0 : f.call(window, M)));
  return tl(() => {
    S && (A.current = !0, window.MotionIsMounted = !0, S.updateFeatures(), uf.render(S.render), z.current && S.animationState && S.animationState.animateChanges());
  }), C.useEffect(() => {
    S && (!z.current && S.animationState && S.animationState.animateChanges(), z.current && (queueMicrotask(() => {
      var _;
      (_ = window.MotionHandoffMarkAsComplete) === null || _ === void 0 || _.call(window, M);
    }), z.current = !1));
  }), S;
}
function k2(n, a, l, r) {
  const { layoutId: u, layout: d, drag: f, dragConstraints: m, layoutScroll: h, layoutRoot: p } = a;
  n.projection = new l(n.latestValues, a["data-framer-portal-id"] ? void 0 : Jg(n.parent)), n.projection.setOptions({
    layoutId: u,
    layout: d,
    alwaysMeasureLayout: !!f || m && wa(m),
    visualElement: n,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof d == "string" ? d : "both",
    initialPromotionConfig: r,
    layoutScroll: h,
    layoutRoot: p
  });
}
function Jg(n) {
  if (n)
    return n.options.allowProjection !== !1 ? n.projection : Jg(n.parent);
}
function B2({ preloadedFeatures: n, createVisualElement: a, useRender: l, useVisualState: r, Component: u }) {
  var d, f;
  n && E2(n);
  function m(p, v) {
    let x;
    const S = {
      ...C.useContext(el),
      ...p,
      layoutId: U2(p)
    }, { isStatic: T } = S, A = N2(p), M = r(p, T);
    if (!T && lf) {
      L2();
      const z = H2(S);
      x = z.MeasureLayout, A.visualElement = V2(u, M, S, a, z.ProjectionNode);
    }
    return y.jsxs(Zr.Provider, { value: A, children: [x && A.visualElement ? y.jsx(x, { visualElement: A.visualElement, ...S }) : null, l(u, p, _2(M, A.visualElement, v), M, T, A.visualElement)] });
  }
  m.displayName = `motion.${typeof u == "string" ? u : `create(${(f = (d = u.displayName) !== null && d !== void 0 ? d : u.name) !== null && f !== void 0 ? f : ""})`}`;
  const h = C.forwardRef(m);
  return h[z2] = u, h;
}
function U2({ layoutId: n }) {
  const a = C.useContext(sf).id;
  return a && n !== void 0 ? a + "-" + n : n;
}
function L2(n, a) {
  C.useContext(Zg).strict;
}
function H2(n) {
  const { drag: a, layout: l } = ja;
  if (!a && !l)
    return {};
  const r = { ...a, ...l };
  return {
    MeasureLayout: a != null && a.isEnabled(n) || l != null && l.isEnabled(n) ? r.MeasureLayout : void 0,
    ProjectionNode: r.ProjectionNode
  };
}
const $g = (n) => (a) => typeof a == "string" && a.startsWith(n), ff = /* @__PURE__ */ $g("--"), q2 = /* @__PURE__ */ $g("var(--"), df = (n) => q2(n) ? G2.test(n.split("/*")[0].trim()) : !1, G2 = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, Ps = {};
function Y2(n) {
  for (const a in n)
    Ps[a] = n[a], ff(a) && (Ps[a].isCSSVariable = !0);
}
const za = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Vi = new Set(za);
function Wg(n, { layout: a, layoutId: l }) {
  return Vi.has(n) || n.startsWith("origin") || (a || l !== void 0) && (!!Ps[n] || n === "opacity");
}
const $t = (n) => !!(n && n.getVelocity), Ig = (n, a) => a && typeof n == "number" ? a.transform(n) : n, on = (n, a, l) => l > a ? a : l < n ? n : l, _a = {
  test: (n) => typeof n == "number",
  parse: parseFloat,
  transform: (n) => n
}, Fs = {
  ..._a,
  transform: (n) => on(0, 1, n)
}, Tr = {
  ..._a,
  default: 1
}, nl = (n) => ({
  test: (a) => typeof a == "string" && a.endsWith(n) && a.split(" ").length === 1,
  parse: parseFloat,
  transform: (a) => `${a}${n}`
}), In = /* @__PURE__ */ nl("deg"), ln = /* @__PURE__ */ nl("%"), rt = /* @__PURE__ */ nl("px"), X2 = /* @__PURE__ */ nl("vh"), Z2 = /* @__PURE__ */ nl("vw"), qp = {
  ...ln,
  parse: (n) => ln.parse(n) / 100,
  transform: (n) => ln.transform(n * 100)
}, K2 = {
  // Border props
  borderWidth: rt,
  borderTopWidth: rt,
  borderRightWidth: rt,
  borderBottomWidth: rt,
  borderLeftWidth: rt,
  borderRadius: rt,
  radius: rt,
  borderTopLeftRadius: rt,
  borderTopRightRadius: rt,
  borderBottomRightRadius: rt,
  borderBottomLeftRadius: rt,
  // Positioning props
  width: rt,
  maxWidth: rt,
  height: rt,
  maxHeight: rt,
  top: rt,
  right: rt,
  bottom: rt,
  left: rt,
  // Spacing props
  padding: rt,
  paddingTop: rt,
  paddingRight: rt,
  paddingBottom: rt,
  paddingLeft: rt,
  margin: rt,
  marginTop: rt,
  marginRight: rt,
  marginBottom: rt,
  marginLeft: rt,
  // Misc
  backgroundPositionX: rt,
  backgroundPositionY: rt
}, Q2 = {
  rotate: In,
  rotateX: In,
  rotateY: In,
  rotateZ: In,
  scale: Tr,
  scaleX: Tr,
  scaleY: Tr,
  scaleZ: Tr,
  skew: In,
  skewX: In,
  skewY: In,
  distance: rt,
  translateX: rt,
  translateY: rt,
  translateZ: rt,
  x: rt,
  y: rt,
  z: rt,
  perspective: rt,
  transformPerspective: rt,
  opacity: Fs,
  originX: qp,
  originY: qp,
  originZ: rt
}, Gp = {
  ..._a,
  transform: Math.round
}, hf = {
  ...K2,
  ...Q2,
  zIndex: Gp,
  size: rt,
  // SVG
  fillOpacity: Fs,
  strokeOpacity: Fs,
  numOctaves: Gp
}, P2 = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, F2 = za.length;
function J2(n, a, l) {
  let r = "", u = !0;
  for (let d = 0; d < F2; d++) {
    const f = za[d], m = n[f];
    if (m === void 0)
      continue;
    let h = !0;
    if (typeof m == "number" ? h = m === (f.startsWith("scale") ? 1 : 0) : h = parseFloat(m) === 0, !h || l) {
      const p = Ig(m, hf[f]);
      if (!h) {
        u = !1;
        const v = P2[f] || f;
        r += `${v}(${p}) `;
      }
      l && (a[f] = p);
    }
  }
  return r = r.trim(), l ? r = l(a, u ? "" : r) : u && (r = "none"), r;
}
function mf(n, a, l) {
  const { style: r, vars: u, transformOrigin: d } = n;
  let f = !1, m = !1;
  for (const h in a) {
    const p = a[h];
    if (Vi.has(h)) {
      f = !0;
      continue;
    } else if (ff(h)) {
      u[h] = p;
      continue;
    } else {
      const v = Ig(p, hf[h]);
      h.startsWith("origin") ? (m = !0, d[h] = v) : r[h] = v;
    }
  }
  if (a.transform || (f || l ? r.transform = J2(a, n.transform, l) : r.transform && (r.transform = "none")), m) {
    const { originX: h = "50%", originY: p = "50%", originZ: v = 0 } = d;
    r.transformOrigin = `${h} ${p} ${v}`;
  }
}
const pf = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function ty(n, a, l) {
  for (const r in a)
    !$t(a[r]) && !Wg(r, l) && (n[r] = a[r]);
}
function $2({ transformTemplate: n }, a) {
  return C.useMemo(() => {
    const l = pf();
    return mf(l, a, n), Object.assign({}, l.vars, l.style);
  }, [a]);
}
function W2(n, a) {
  const l = n.style || {}, r = {};
  return ty(r, l, n), Object.assign(r, $2(n, a)), r;
}
function I2(n, a) {
  const l = {}, r = W2(n, a);
  return n.drag && n.dragListener !== !1 && (l.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = n.drag === !0 ? "none" : `pan-${n.drag === "x" ? "y" : "x"}`), n.tabIndex === void 0 && (n.onTap || n.onTapStart || n.whileTap) && (l.tabIndex = 0), l.style = r, l;
}
const tS = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function gf(n) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof n != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    n.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(tS.indexOf(n) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(n))
    )
  );
}
const eS = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, nS = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function iS(n, a, l = 1, r = 0, u = !0) {
  n.pathLength = 1;
  const d = u ? eS : nS;
  n[d.offset] = rt.transform(-r);
  const f = rt.transform(a), m = rt.transform(l);
  n[d.array] = `${f} ${m}`;
}
function Yp(n, a, l) {
  return typeof n == "string" ? n : rt.transform(a + l * n);
}
function aS(n, a, l) {
  const r = Yp(a, n.x, n.width), u = Yp(l, n.y, n.height);
  return `${r} ${u}`;
}
function yf(n, {
  attrX: a,
  attrY: l,
  attrScale: r,
  originX: u,
  originY: d,
  pathLength: f,
  pathSpacing: m = 1,
  pathOffset: h = 0,
  // This is object creation, which we try to avoid per-frame.
  ...p
}, v, x) {
  if (mf(n, p, x), v) {
    n.style.viewBox && (n.attrs.viewBox = n.style.viewBox);
    return;
  }
  n.attrs = n.style, n.style = {};
  const { attrs: S, style: T, dimensions: A } = n;
  S.transform && (A && (T.transform = S.transform), delete S.transform), A && (u !== void 0 || d !== void 0 || T.transform) && (T.transformOrigin = aS(A, u !== void 0 ? u : 0.5, d !== void 0 ? d : 0.5)), a !== void 0 && (S.x = a), l !== void 0 && (S.y = l), r !== void 0 && (S.scale = r), f !== void 0 && iS(S, f, m, h, !1);
}
const ey = () => ({
  ...pf(),
  attrs: {}
}), vf = (n) => typeof n == "string" && n.toLowerCase() === "svg";
function sS(n, a, l, r) {
  const u = C.useMemo(() => {
    const d = ey();
    return yf(d, a, vf(r), n.transformTemplate), {
      ...d.attrs,
      style: { ...d.style }
    };
  }, [a]);
  if (n.style) {
    const d = {};
    ty(d, n.style, n), u.style = { ...d, ...u.style };
  }
  return u;
}
function lS(n = !1) {
  return (l, r, u, { latestValues: d }, f) => {
    const h = (gf(l) ? sS : I2)(r, d, f, l), p = R2(r, typeof l == "string", n), v = l !== C.Fragment ? { ...p, ...h, ref: u } : {}, { children: x } = r, S = C.useMemo(() => $t(x) ? x.get() : x, [x]);
    return C.createElement(l, {
      ...v,
      children: S
    });
  };
}
function Xp(n) {
  const a = [{}, {}];
  return n == null || n.values.forEach((l, r) => {
    a[0][r] = l.get(), a[1][r] = l.getVelocity();
  }), a;
}
function bf(n, a, l, r) {
  if (typeof a == "function") {
    const [u, d] = Xp(r);
    a = a(l !== void 0 ? l : n.custom, u, d);
  }
  if (typeof a == "string" && (a = n.variants && n.variants[a]), typeof a == "function") {
    const [u, d] = Xp(r);
    a = a(l !== void 0 ? l : n.custom, u, d);
  }
  return a;
}
const _c = (n) => Array.isArray(n), rS = (n) => !!(n && typeof n == "object" && n.mix && n.toValue), oS = (n) => _c(n) ? n[n.length - 1] || 0 : n;
function Rr(n) {
  const a = $t(n) ? n.get() : n;
  return rS(a) ? a.toValue() : a;
}
function uS({ scrapeMotionValuesFromProps: n, createRenderState: a, onUpdate: l }, r, u, d) {
  const f = {
    latestValues: cS(r, u, d, n),
    renderState: a()
  };
  return l && (f.onMount = (m) => l({ props: r, current: m, ...f }), f.onUpdate = (m) => l(m)), f;
}
const ny = (n) => (a, l) => {
  const r = C.useContext(Zr), u = C.useContext(Yr), d = () => uS(n, a, r, u);
  return l ? d() : _i(d);
};
function cS(n, a, l, r) {
  const u = {}, d = r(n, {});
  for (const S in d)
    u[S] = Rr(d[S]);
  let { initial: f, animate: m } = n;
  const h = Qr(n), p = Qg(n);
  a && p && !h && n.inherit !== !1 && (f === void 0 && (f = a.initial), m === void 0 && (m = a.animate));
  let v = l ? l.initial === !1 : !1;
  v = v || f === !1;
  const x = v ? m : f;
  if (x && typeof x != "boolean" && !Kr(x)) {
    const S = Array.isArray(x) ? x : [x];
    for (let T = 0; T < S.length; T++) {
      const A = bf(n, S[T]);
      if (A) {
        const { transitionEnd: M, transition: z, ..._ } = A;
        for (const q in _) {
          let L = _[q];
          if (Array.isArray(L)) {
            const Q = v ? L.length - 1 : 0;
            L = L[Q];
          }
          L !== null && (u[q] = L);
        }
        for (const q in M)
          u[q] = M[q];
      }
    }
  }
  return u;
}
function xf(n, a, l) {
  var r;
  const { style: u } = n, d = {};
  for (const f in u)
    ($t(u[f]) || a.style && $t(a.style[f]) || Wg(f, n) || ((r = l == null ? void 0 : l.getValue(f)) === null || r === void 0 ? void 0 : r.liveStyle) !== void 0) && (d[f] = u[f]);
  return d;
}
const fS = {
  useVisualState: ny({
    scrapeMotionValuesFromProps: xf,
    createRenderState: pf
  })
};
function iy(n, a) {
  try {
    a.dimensions = typeof n.getBBox == "function" ? n.getBBox() : n.getBoundingClientRect();
  } catch {
    a.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
function ay(n, { style: a, vars: l }, r, u) {
  Object.assign(n.style, a, u && u.getProjectionStyles(r));
  for (const d in l)
    n.style.setProperty(d, l[d]);
}
const sy = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function ly(n, a, l, r) {
  ay(n, a, void 0, r);
  for (const u in a.attrs)
    n.setAttribute(sy.has(u) ? u : cf(u), a.attrs[u]);
}
function ry(n, a, l) {
  const r = xf(n, a, l);
  for (const u in n)
    if ($t(n[u]) || $t(a[u])) {
      const d = za.indexOf(u) !== -1 ? "attr" + u.charAt(0).toUpperCase() + u.substring(1) : u;
      r[d] = n[u];
    }
  return r;
}
const Zp = ["x", "y", "width", "height", "cx", "cy", "r"], dS = {
  useVisualState: ny({
    scrapeMotionValuesFromProps: ry,
    createRenderState: ey,
    onUpdate: ({ props: n, prevProps: a, current: l, renderState: r, latestValues: u }) => {
      if (!l)
        return;
      let d = !!n.drag;
      if (!d) {
        for (const m in u)
          if (Vi.has(m)) {
            d = !0;
            break;
          }
      }
      if (!d)
        return;
      let f = !a;
      if (a)
        for (let m = 0; m < Zp.length; m++) {
          const h = Zp[m];
          n[h] !== a[h] && (f = !0);
        }
      f && Tt.read(() => {
        iy(l, r), Tt.render(() => {
          yf(r, u, vf(l.tagName), n.transformTemplate), ly(l, r);
        });
      });
    }
  })
};
function hS(n, a) {
  return function(r, { forwardMotionProps: u } = { forwardMotionProps: !1 }) {
    const f = {
      ...gf(r) ? dS : fS,
      preloadedFeatures: n,
      useRender: lS(u),
      createVisualElement: a,
      Component: r
    };
    return B2(f);
  };
}
function Js(n, a, l) {
  const r = n.getProps();
  return bf(r, a, l !== void 0 ? l : r.custom, n);
}
function Sf(n, a) {
  return n ? n[a] || n.default || n : void 0;
}
const oy = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...za
]);
function wf(n, a) {
  n.indexOf(a) === -1 && n.push(a);
}
function Tf(n, a) {
  const l = n.indexOf(a);
  l > -1 && n.splice(l, 1);
}
class Af {
  constructor() {
    this.subscriptions = [];
  }
  add(a) {
    return wf(this.subscriptions, a), () => Tf(this.subscriptions, a);
  }
  notify(a, l, r) {
    const u = this.subscriptions.length;
    if (u)
      if (u === 1)
        this.subscriptions[0](a, l, r);
      else
        for (let d = 0; d < u; d++) {
          const f = this.subscriptions[d];
          f && f(a, l, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function Ef(n, a) {
  return a ? n * (1e3 / a) : 0;
}
let Dr;
function mS() {
  Dr = void 0;
}
const rn = {
  now: () => (Dr === void 0 && rn.set(re.isProcessing || w2.useManualTiming ? re.timestamp : performance.now()), Dr),
  set: (n) => {
    Dr = n, queueMicrotask(mS);
  }
}, Kp = 30, pS = (n) => !isNaN(parseFloat(n));
class gS {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(a, l = {}) {
    this.version = "12.6.1", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r, u = !0) => {
      const d = rn.now();
      this.updatedAt !== d && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), u && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(a), this.owner = l.owner;
  }
  setCurrent(a) {
    this.current = a, this.updatedAt = rn.now(), this.canTrackVelocity === null && a !== void 0 && (this.canTrackVelocity = pS(this.current));
  }
  setPrevFrameValue(a = this.current) {
    this.prevFrameValue = a, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(a) {
    return this.on("change", a);
  }
  on(a, l) {
    this.events[a] || (this.events[a] = new Af());
    const r = this.events[a].add(l);
    return a === "change" ? () => {
      r(), Tt.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : r;
  }
  clearListeners() {
    for (const a in this.events)
      this.events[a].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(a, l) {
    this.passiveEffect = a, this.stopPassiveEffect = l;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(a, l = !0) {
    !l || !this.passiveEffect ? this.updateAndNotify(a, l) : this.passiveEffect(a, this.updateAndNotify);
  }
  setWithVelocity(a, l, r) {
    this.set(l), this.prev = void 0, this.prevFrameValue = a, this.prevUpdatedAt = this.updatedAt - r;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(a, l = !0) {
    this.updateAndNotify(a), this.prev = a, this.prevUpdatedAt = this.prevFrameValue = void 0, l && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const a = rn.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || a - this.updatedAt > Kp)
      return 0;
    const l = Math.min(this.updatedAt - this.prevUpdatedAt, Kp);
    return Ef(parseFloat(this.current) - parseFloat(this.prevFrameValue), l);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(a) {
    return this.stop(), new Promise((l) => {
      this.hasAnimated = !0, this.animation = a(l), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function sn(n, a) {
  return new gS(n, a);
}
function yS(n, a, l) {
  n.hasValue(a) ? n.getValue(a).set(l) : n.addValue(a, sn(l));
}
function vS(n, a) {
  const l = Js(n, a);
  let { transitionEnd: r = {}, transition: u = {}, ...d } = l || {};
  d = { ...d, ...r };
  for (const f in d) {
    const m = oS(d[f]);
    yS(n, f, m);
  }
}
function bS(n) {
  return !!($t(n) && n.add);
}
function Oc(n, a) {
  const l = n.getValue("willChange");
  if (bS(l))
    return l.add(a);
}
function uy(n) {
  return n.props[Pg];
}
// @__NO_SIDE_EFFECTS__
function Mf(n) {
  let a;
  return () => (a === void 0 && (a = n()), a);
}
const cy = /* @__PURE__ */ Mf(() => window.ScrollTimeline !== void 0);
class xS {
  constructor(a) {
    this.stop = () => this.runAll("stop"), this.animations = a.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((a) => "finished" in a ? a.finished : a));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(a) {
    return this.animations[0][a];
  }
  setAll(a, l) {
    for (let r = 0; r < this.animations.length; r++)
      this.animations[r][a] = l;
  }
  attachTimeline(a, l) {
    const r = this.animations.map((u) => {
      if (cy() && u.attachTimeline)
        return u.attachTimeline(a);
      if (typeof l == "function")
        return l(u);
    });
    return () => {
      r.forEach((u, d) => {
        u && u(), this.animations[d].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(a) {
    this.setAll("time", a);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(a) {
    this.setAll("speed", a);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let a = 0;
    for (let l = 0; l < this.animations.length; l++)
      a = Math.max(a, this.animations[l].duration);
    return a;
  }
  runAll(a) {
    this.animations.forEach((l) => l[a]());
  }
  flatten() {
    this.runAll("flatten");
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
class SS extends xS {
  then(a, l) {
    return Promise.all(this.animations).then(a).catch(l);
  }
}
const Mn = /* @__NO_SIDE_EFFECTS__ */ (n) => n * 1e3, jn = /* @__NO_SIDE_EFFECTS__ */ (n) => n / 1e3;
function jf(n) {
  return typeof n == "function";
}
function Qp(n, a) {
  n.timeline = a, n.onfinish = null;
}
const Rf = (n) => Array.isArray(n) && typeof n[0] == "number", wS = {
  linearEasing: void 0
};
function TS(n, a) {
  const l = /* @__PURE__ */ Mf(n);
  return () => {
    var r;
    return (r = wS[a]) !== null && r !== void 0 ? r : l();
  };
}
const kr = /* @__PURE__ */ TS(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Oi = /* @__NO_SIDE_EFFECTS__ */ (n, a, l) => {
  const r = a - n;
  return r === 0 ? 1 : (l - n) / r;
}, fy = (n, a, l = 10) => {
  let r = "";
  const u = Math.max(Math.round(a / l), 2);
  for (let d = 0; d < u; d++)
    r += n(/* @__PURE__ */ Oi(0, u - 1, d)) + ", ";
  return `linear(${r.substring(0, r.length - 2)})`;
};
function dy(n) {
  return !!(typeof n == "function" && kr() || !n || typeof n == "string" && (n in Vc || kr()) || Rf(n) || Array.isArray(n) && n.every(dy));
}
const Us = ([n, a, l, r]) => `cubic-bezier(${n}, ${a}, ${l}, ${r})`, Vc = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Us([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Us([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Us([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Us([0.33, 1.53, 0.69, 0.99])
};
function hy(n, a) {
  if (n)
    return typeof n == "function" && kr() ? fy(n, a) : Rf(n) ? Us(n) : Array.isArray(n) ? n.map((l) => hy(l, a) || Vc.easeOut) : Vc[n];
}
const my = (n, a, l) => (((1 - 3 * l + 3 * a) * n + (3 * l - 6 * a)) * n + 3 * a) * n, AS = 1e-7, ES = 12;
function MS(n, a, l, r, u) {
  let d, f, m = 0;
  do
    f = a + (l - a) / 2, d = my(f, r, u) - n, d > 0 ? l = f : a = f;
  while (Math.abs(d) > AS && ++m < ES);
  return f;
}
function il(n, a, l, r) {
  if (n === a && l === r)
    return pe;
  const u = (d) => MS(d, 0, 1, n, l);
  return (d) => d === 0 || d === 1 ? d : my(u(d), a, r);
}
const py = (n) => (a) => a <= 0.5 ? n(2 * a) / 2 : (2 - n(2 * (1 - a))) / 2, gy = (n) => (a) => 1 - n(1 - a), yy = /* @__PURE__ */ il(0.33, 1.53, 0.69, 0.99), Df = /* @__PURE__ */ gy(yy), vy = /* @__PURE__ */ py(Df), by = (n) => (n *= 2) < 1 ? 0.5 * Df(n) : 0.5 * (2 - Math.pow(2, -10 * (n - 1))), Cf = (n) => 1 - Math.sin(Math.acos(n)), xy = gy(Cf), Sy = py(Cf), wy = (n) => /^0[^.\s]+$/u.test(n);
function jS(n) {
  return typeof n == "number" ? n === 0 : n !== null ? n === "none" || n === "0" || wy(n) : !0;
}
const Hs = (n) => Math.round(n * 1e5) / 1e5, Nf = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function RS(n) {
  return n == null;
}
const DS = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, zf = (n, a) => (l) => !!(typeof l == "string" && DS.test(l) && l.startsWith(n) || a && !RS(l) && Object.prototype.hasOwnProperty.call(l, a)), Ty = (n, a, l) => (r) => {
  if (typeof r != "string")
    return r;
  const [u, d, f, m] = r.match(Nf);
  return {
    [n]: parseFloat(u),
    [a]: parseFloat(d),
    [l]: parseFloat(f),
    alpha: m !== void 0 ? parseFloat(m) : 1
  };
}, CS = (n) => on(0, 255, n), pc = {
  ..._a,
  transform: (n) => Math.round(CS(n))
}, Ci = {
  test: /* @__PURE__ */ zf("rgb", "red"),
  parse: /* @__PURE__ */ Ty("red", "green", "blue"),
  transform: ({ red: n, green: a, blue: l, alpha: r = 1 }) => "rgba(" + pc.transform(n) + ", " + pc.transform(a) + ", " + pc.transform(l) + ", " + Hs(Fs.transform(r)) + ")"
};
function NS(n) {
  let a = "", l = "", r = "", u = "";
  return n.length > 5 ? (a = n.substring(1, 3), l = n.substring(3, 5), r = n.substring(5, 7), u = n.substring(7, 9)) : (a = n.substring(1, 2), l = n.substring(2, 3), r = n.substring(3, 4), u = n.substring(4, 5), a += a, l += l, r += r, u += u), {
    red: parseInt(a, 16),
    green: parseInt(l, 16),
    blue: parseInt(r, 16),
    alpha: u ? parseInt(u, 16) / 255 : 1
  };
}
const kc = {
  test: /* @__PURE__ */ zf("#"),
  parse: NS,
  transform: Ci.transform
}, Ta = {
  test: /* @__PURE__ */ zf("hsl", "hue"),
  parse: /* @__PURE__ */ Ty("hue", "saturation", "lightness"),
  transform: ({ hue: n, saturation: a, lightness: l, alpha: r = 1 }) => "hsla(" + Math.round(n) + ", " + ln.transform(Hs(a)) + ", " + ln.transform(Hs(l)) + ", " + Hs(Fs.transform(r)) + ")"
}, me = {
  test: (n) => Ci.test(n) || kc.test(n) || Ta.test(n),
  parse: (n) => Ci.test(n) ? Ci.parse(n) : Ta.test(n) ? Ta.parse(n) : kc.parse(n),
  transform: (n) => typeof n == "string" ? n : n.hasOwnProperty("red") ? Ci.transform(n) : Ta.transform(n)
}, zS = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function _S(n) {
  var a, l;
  return isNaN(n) && typeof n == "string" && (((a = n.match(Nf)) === null || a === void 0 ? void 0 : a.length) || 0) + (((l = n.match(zS)) === null || l === void 0 ? void 0 : l.length) || 0) > 0;
}
const Ay = "number", Ey = "color", OS = "var", VS = "var(", Pp = "${}", kS = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function $s(n) {
  const a = n.toString(), l = [], r = {
    color: [],
    number: [],
    var: []
  }, u = [];
  let d = 0;
  const m = a.replace(kS, (h) => (me.test(h) ? (r.color.push(d), u.push(Ey), l.push(me.parse(h))) : h.startsWith(VS) ? (r.var.push(d), u.push(OS), l.push(h)) : (r.number.push(d), u.push(Ay), l.push(parseFloat(h))), ++d, Pp)).split(Pp);
  return { values: l, split: m, indexes: r, types: u };
}
function My(n) {
  return $s(n).values;
}
function jy(n) {
  const { split: a, types: l } = $s(n), r = a.length;
  return (u) => {
    let d = "";
    for (let f = 0; f < r; f++)
      if (d += a[f], u[f] !== void 0) {
        const m = l[f];
        m === Ay ? d += Hs(u[f]) : m === Ey ? d += me.transform(u[f]) : d += u[f];
      }
    return d;
  };
}
const BS = (n) => typeof n == "number" ? 0 : n;
function US(n) {
  const a = My(n);
  return jy(n)(a.map(BS));
}
const ei = {
  test: _S,
  parse: My,
  createTransformer: jy,
  getAnimatableNone: US
}, LS = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function HS(n) {
  const [a, l] = n.slice(0, -1).split("(");
  if (a === "drop-shadow")
    return n;
  const [r] = l.match(Nf) || [];
  if (!r)
    return n;
  const u = l.replace(r, "");
  let d = LS.has(a) ? 1 : 0;
  return r !== l && (d *= 100), a + "(" + d + u + ")";
}
const qS = /\b([a-z-]*)\(.*?\)/gu, Bc = {
  ...ei,
  getAnimatableNone: (n) => {
    const a = n.match(qS);
    return a ? a.map(HS).join(" ") : n;
  }
}, GS = {
  ...hf,
  // Color props
  color: me,
  backgroundColor: me,
  outlineColor: me,
  fill: me,
  stroke: me,
  // Border props
  borderColor: me,
  borderTopColor: me,
  borderRightColor: me,
  borderBottomColor: me,
  borderLeftColor: me,
  filter: Bc,
  WebkitFilter: Bc
}, Ry = (n) => GS[n];
function Dy(n, a) {
  let l = Ry(n);
  return l !== Bc && (l = ei), l.getAnimatableNone ? l.getAnimatableNone(a) : void 0;
}
const YS = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function XS(n, a, l) {
  let r = 0, u;
  for (; r < n.length && !u; ) {
    const d = n[r];
    typeof d == "string" && !YS.has(d) && $s(d).values.length && (u = n[r]), r++;
  }
  if (u && l)
    for (const d of a)
      n[d] = Dy(l, u);
}
const Ni = (n) => n * 180 / Math.PI, Uc = (n) => {
  const a = Ni(Math.atan2(n[1], n[0]));
  return Lc(a);
}, ZS = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (n) => (Math.abs(n[0]) + Math.abs(n[3])) / 2,
  rotate: Uc,
  rotateZ: Uc,
  skewX: (n) => Ni(Math.atan(n[1])),
  skewY: (n) => Ni(Math.atan(n[2])),
  skew: (n) => (Math.abs(n[1]) + Math.abs(n[2])) / 2
}, Lc = (n) => (n = n % 360, n < 0 && (n += 360), n), Fp = Uc, Jp = (n) => Math.sqrt(n[0] * n[0] + n[1] * n[1]), $p = (n) => Math.sqrt(n[4] * n[4] + n[5] * n[5]), KS = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Jp,
  scaleY: $p,
  scale: (n) => (Jp(n) + $p(n)) / 2,
  rotateX: (n) => Lc(Ni(Math.atan2(n[6], n[5]))),
  rotateY: (n) => Lc(Ni(Math.atan2(-n[2], n[0]))),
  rotateZ: Fp,
  rotate: Fp,
  skewX: (n) => Ni(Math.atan(n[4])),
  skewY: (n) => Ni(Math.atan(n[1])),
  skew: (n) => (Math.abs(n[1]) + Math.abs(n[4])) / 2
};
function Wp(n) {
  return n.includes("scale") ? 1 : 0;
}
function Hc(n, a) {
  if (!n || n === "none")
    return Wp(a);
  const l = n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let r, u;
  if (l)
    r = KS, u = l;
  else {
    const m = n.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    r = ZS, u = m;
  }
  if (!u)
    return Wp(a);
  const d = r[a], f = u[1].split(",").map(PS);
  return typeof d == "function" ? d(f) : f[d];
}
const QS = (n, a) => {
  const { transform: l = "none" } = getComputedStyle(n);
  return Hc(l, a);
};
function PS(n) {
  return parseFloat(n.trim());
}
const Ip = (n) => n === _a || n === rt, FS = /* @__PURE__ */ new Set(["x", "y", "z"]), JS = za.filter((n) => !FS.has(n));
function $S(n) {
  const a = [];
  return JS.forEach((l) => {
    const r = n.getValue(l);
    r !== void 0 && (a.push([l, r.get()]), r.set(l.startsWith("scale") ? 1 : 0));
  }), a;
}
const Ra = {
  // Dimensions
  width: ({ x: n }, { paddingLeft: a = "0", paddingRight: l = "0" }) => n.max - n.min - parseFloat(a) - parseFloat(l),
  height: ({ y: n }, { paddingTop: a = "0", paddingBottom: l = "0" }) => n.max - n.min - parseFloat(a) - parseFloat(l),
  top: (n, { top: a }) => parseFloat(a),
  left: (n, { left: a }) => parseFloat(a),
  bottom: ({ y: n }, { top: a }) => parseFloat(a) + (n.max - n.min),
  right: ({ x: n }, { left: a }) => parseFloat(a) + (n.max - n.min),
  // Transform
  x: (n, { transform: a }) => Hc(a, "x"),
  y: (n, { transform: a }) => Hc(a, "y")
};
Ra.translateX = Ra.x;
Ra.translateY = Ra.y;
const zi = /* @__PURE__ */ new Set();
let qc = !1, Gc = !1;
function Cy() {
  if (Gc) {
    const n = Array.from(zi).filter((r) => r.needsMeasurement), a = new Set(n.map((r) => r.element)), l = /* @__PURE__ */ new Map();
    a.forEach((r) => {
      const u = $S(r);
      u.length && (l.set(r, u), r.render());
    }), n.forEach((r) => r.measureInitialState()), a.forEach((r) => {
      r.render();
      const u = l.get(r);
      u && u.forEach(([d, f]) => {
        var m;
        (m = r.getValue(d)) === null || m === void 0 || m.set(f);
      });
    }), n.forEach((r) => r.measureEndState()), n.forEach((r) => {
      r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
    });
  }
  Gc = !1, qc = !1, zi.forEach((n) => n.complete()), zi.clear();
}
function Ny() {
  zi.forEach((n) => {
    n.readKeyframes(), n.needsMeasurement && (Gc = !0);
  });
}
function WS() {
  Ny(), Cy();
}
class _f {
  constructor(a, l, r, u, d, f = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...a], this.onComplete = l, this.name = r, this.motionValue = u, this.element = d, this.isAsync = f;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (zi.add(this), qc || (qc = !0, Tt.read(Ny), Tt.resolveKeyframes(Cy))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: a, name: l, element: r, motionValue: u } = this;
    for (let d = 0; d < a.length; d++)
      if (a[d] === null)
        if (d === 0) {
          const f = u == null ? void 0 : u.get(), m = a[a.length - 1];
          if (f !== void 0)
            a[0] = f;
          else if (r && l) {
            const h = r.readValue(l, m);
            h != null && (a[0] = h);
          }
          a[0] === void 0 && (a[0] = m), u && f === void 0 && u.set(a[0]);
        } else
          a[d] = a[d - 1];
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), zi.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, zi.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const zy = (n) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n), IS = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function tw(n) {
  const a = IS.exec(n);
  if (!a)
    return [,];
  const [, l, r, u] = a;
  return [`--${l ?? r}`, u];
}
function _y(n, a, l = 1) {
  const [r, u] = tw(n);
  if (!r)
    return;
  const d = window.getComputedStyle(a).getPropertyValue(r);
  if (d) {
    const f = d.trim();
    return zy(f) ? parseFloat(f) : f;
  }
  return df(u) ? _y(u, a, l + 1) : u;
}
const Oy = (n) => (a) => a.test(n), ew = {
  test: (n) => n === "auto",
  parse: (n) => n
}, Vy = [_a, rt, ln, In, Z2, X2, ew], t0 = (n) => Vy.find(Oy(n));
class ky extends _f {
  constructor(a, l, r, u, d) {
    super(a, l, r, u, d, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: a, element: l, name: r } = this;
    if (!l || !l.current)
      return;
    super.readKeyframes();
    for (let h = 0; h < a.length; h++) {
      let p = a[h];
      if (typeof p == "string" && (p = p.trim(), df(p))) {
        const v = _y(p, l.current);
        v !== void 0 && (a[h] = v), h === a.length - 1 && (this.finalKeyframe = p);
      }
    }
    if (this.resolveNoneKeyframes(), !oy.has(r) || a.length !== 2)
      return;
    const [u, d] = a, f = t0(u), m = t0(d);
    if (f !== m)
      if (Ip(f) && Ip(m))
        for (let h = 0; h < a.length; h++) {
          const p = a[h];
          typeof p == "string" && (a[h] = parseFloat(p));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: a, name: l } = this, r = [];
    for (let u = 0; u < a.length; u++)
      jS(a[u]) && r.push(u);
    r.length && XS(a, r, l);
  }
  measureInitialState() {
    const { element: a, unresolvedKeyframes: l, name: r } = this;
    if (!a || !a.current)
      return;
    r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Ra[r](a.measureViewportBox(), window.getComputedStyle(a.current)), l[0] = this.measuredOrigin;
    const u = l[l.length - 1];
    u !== void 0 && a.getValue(r, u).jump(u, !1);
  }
  measureEndState() {
    var a;
    const { element: l, name: r, unresolvedKeyframes: u } = this;
    if (!l || !l.current)
      return;
    const d = l.getValue(r);
    d && d.jump(this.measuredOrigin, !1);
    const f = u.length - 1, m = u[f];
    u[f] = Ra[r](l.measureViewportBox(), window.getComputedStyle(l.current)), m !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = m), !((a = this.removedTransforms) === null || a === void 0) && a.length && this.removedTransforms.forEach(([h, p]) => {
      l.getValue(h).set(p);
    }), this.resolveNoneKeyframes();
  }
}
const e0 = (n, a) => a === "zIndex" ? !1 : !!(typeof n == "number" || Array.isArray(n) || typeof n == "string" && // It's animatable if we have a string
(ei.test(n) || n === "0") && // And it contains numbers and/or colors
!n.startsWith("url("));
function nw(n) {
  const a = n[0];
  if (n.length === 1)
    return !0;
  for (let l = 0; l < n.length; l++)
    if (n[l] !== a)
      return !0;
}
function iw(n, a, l, r) {
  const u = n[0];
  if (u === null)
    return !1;
  if (a === "display" || a === "visibility")
    return !0;
  const d = n[n.length - 1], f = e0(u, a), m = e0(d, a);
  return !f || !m ? !1 : nw(n) || (l === "spring" || jf(l)) && r;
}
const aw = (n) => n !== null;
function Pr(n, { repeat: a, repeatType: l = "loop" }, r) {
  const u = n.filter(aw), d = a && l !== "loop" && a % 2 === 1 ? 0 : u.length - 1;
  return !d || r === void 0 ? u[d] : r;
}
const sw = 40;
class By {
  constructor({ autoplay: a = !0, delay: l = 0, type: r = "keyframes", repeat: u = 0, repeatDelay: d = 0, repeatType: f = "loop", ...m }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = rn.now(), this.options = {
      autoplay: a,
      delay: l,
      type: r,
      repeat: u,
      repeatDelay: d,
      repeatType: f,
      ...m
    }, this.updateFinishedPromise();
  }
  /**
   * This method uses the createdAt and resolvedAt to calculate the
   * animation startTime. *Ideally*, we would use the createdAt time as t=0
   * as the following frame would then be the first frame of the animation in
   * progress, which would feel snappier.
   *
   * However, if there's a delay (main thread work) between the creation of
   * the animation and the first commited frame, we prefer to use resolvedAt
   * to avoid a sudden jump into the animation.
   */
  calcStartTime() {
    return this.resolvedAt ? this.resolvedAt - this.createdAt > sw ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && WS(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(a, l) {
    this.resolvedAt = rn.now(), this.hasAttemptedResolve = !0;
    const { name: r, type: u, velocity: d, delay: f, onComplete: m, onUpdate: h, isGenerator: p } = this.options;
    if (!p && !iw(a, r, u, d))
      if (f)
        this.options.duration = 0;
      else {
        h && h(Pr(a, this.options, l)), m && m(), this.resolveFinishedPromise();
        return;
      }
    const v = this.initPlayback(a, l);
    v !== !1 && (this._resolved = {
      keyframes: a,
      finalKeyframe: l,
      ...v
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(a, l) {
    return this.currentFinishedPromise.then(a, l);
  }
  flatten() {
    this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear");
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((a) => {
      this.resolveFinishedPromise = a;
    });
  }
}
const Yc = 2e4;
function Uy(n) {
  let a = 0;
  const l = 50;
  let r = n.next(a);
  for (; !r.done && a < Yc; )
    a += l, r = n.next(a);
  return a >= Yc ? 1 / 0 : a;
}
const Lt = (n, a, l) => n + (a - n) * l;
function gc(n, a, l) {
  return l < 0 && (l += 1), l > 1 && (l -= 1), l < 1 / 6 ? n + (a - n) * 6 * l : l < 1 / 2 ? a : l < 2 / 3 ? n + (a - n) * (2 / 3 - l) * 6 : n;
}
function lw({ hue: n, saturation: a, lightness: l, alpha: r }) {
  n /= 360, a /= 100, l /= 100;
  let u = 0, d = 0, f = 0;
  if (!a)
    u = d = f = l;
  else {
    const m = l < 0.5 ? l * (1 + a) : l + a - l * a, h = 2 * l - m;
    u = gc(h, m, n + 1 / 3), d = gc(h, m, n), f = gc(h, m, n - 1 / 3);
  }
  return {
    red: Math.round(u * 255),
    green: Math.round(d * 255),
    blue: Math.round(f * 255),
    alpha: r
  };
}
function Br(n, a) {
  return (l) => l > 0 ? a : n;
}
const yc = (n, a, l) => {
  const r = n * n, u = l * (a * a - r) + r;
  return u < 0 ? 0 : Math.sqrt(u);
}, rw = [kc, Ci, Ta], ow = (n) => rw.find((a) => a.test(n));
function n0(n) {
  const a = ow(n);
  if (!a)
    return !1;
  let l = a.parse(n);
  return a === Ta && (l = lw(l)), l;
}
const i0 = (n, a) => {
  const l = n0(n), r = n0(a);
  if (!l || !r)
    return Br(n, a);
  const u = { ...l };
  return (d) => (u.red = yc(l.red, r.red, d), u.green = yc(l.green, r.green, d), u.blue = yc(l.blue, r.blue, d), u.alpha = Lt(l.alpha, r.alpha, d), Ci.transform(u));
}, uw = (n, a) => (l) => a(n(l)), al = (...n) => n.reduce(uw), Xc = /* @__PURE__ */ new Set(["none", "hidden"]);
function cw(n, a) {
  return Xc.has(n) ? (l) => l <= 0 ? n : a : (l) => l >= 1 ? a : n;
}
function fw(n, a) {
  return (l) => Lt(n, a, l);
}
function Of(n) {
  return typeof n == "number" ? fw : typeof n == "string" ? df(n) ? Br : me.test(n) ? i0 : mw : Array.isArray(n) ? Ly : typeof n == "object" ? me.test(n) ? i0 : dw : Br;
}
function Ly(n, a) {
  const l = [...n], r = l.length, u = n.map((d, f) => Of(d)(d, a[f]));
  return (d) => {
    for (let f = 0; f < r; f++)
      l[f] = u[f](d);
    return l;
  };
}
function dw(n, a) {
  const l = { ...n, ...a }, r = {};
  for (const u in l)
    n[u] !== void 0 && a[u] !== void 0 && (r[u] = Of(n[u])(n[u], a[u]));
  return (u) => {
    for (const d in r)
      l[d] = r[d](u);
    return l;
  };
}
function hw(n, a) {
  var l;
  const r = [], u = { color: 0, var: 0, number: 0 };
  for (let d = 0; d < a.values.length; d++) {
    const f = a.types[d], m = n.indexes[f][u[f]], h = (l = n.values[m]) !== null && l !== void 0 ? l : 0;
    r[d] = h, u[f]++;
  }
  return r;
}
const mw = (n, a) => {
  const l = ei.createTransformer(a), r = $s(n), u = $s(a);
  return r.indexes.var.length === u.indexes.var.length && r.indexes.color.length === u.indexes.color.length && r.indexes.number.length >= u.indexes.number.length ? Xc.has(n) && !u.values.length || Xc.has(a) && !r.values.length ? cw(n, a) : al(Ly(hw(r, u), u.values), l) : Br(n, a);
};
function Hy(n, a, l) {
  return typeof n == "number" && typeof a == "number" && typeof l == "number" ? Lt(n, a, l) : Of(n)(n, a);
}
const pw = 5;
function qy(n, a, l) {
  const r = Math.max(a - pw, 0);
  return Ef(l - n(r), a - r);
}
const Yt = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, vc = 1e-3;
function gw({ duration: n = Yt.duration, bounce: a = Yt.bounce, velocity: l = Yt.velocity, mass: r = Yt.mass }) {
  let u, d, f = 1 - a;
  f = on(Yt.minDamping, Yt.maxDamping, f), n = on(Yt.minDuration, Yt.maxDuration, /* @__PURE__ */ jn(n)), f < 1 ? (u = (p) => {
    const v = p * f, x = v * n, S = v - l, T = Zc(p, f), A = Math.exp(-x);
    return vc - S / T * A;
  }, d = (p) => {
    const x = p * f * n, S = x * l + l, T = Math.pow(f, 2) * Math.pow(p, 2) * n, A = Math.exp(-x), M = Zc(Math.pow(p, 2), f);
    return (-u(p) + vc > 0 ? -1 : 1) * ((S - T) * A) / M;
  }) : (u = (p) => {
    const v = Math.exp(-p * n), x = (p - l) * n + 1;
    return -vc + v * x;
  }, d = (p) => {
    const v = Math.exp(-p * n), x = (l - p) * (n * n);
    return v * x;
  });
  const m = 5 / n, h = vw(u, d, m);
  if (n = /* @__PURE__ */ Mn(n), isNaN(h))
    return {
      stiffness: Yt.stiffness,
      damping: Yt.damping,
      duration: n
    };
  {
    const p = Math.pow(h, 2) * r;
    return {
      stiffness: p,
      damping: f * 2 * Math.sqrt(r * p),
      duration: n
    };
  }
}
const yw = 12;
function vw(n, a, l) {
  let r = l;
  for (let u = 1; u < yw; u++)
    r = r - n(r) / a(r);
  return r;
}
function Zc(n, a) {
  return n * Math.sqrt(1 - a * a);
}
const bw = ["duration", "bounce"], xw = ["stiffness", "damping", "mass"];
function a0(n, a) {
  return a.some((l) => n[l] !== void 0);
}
function Sw(n) {
  let a = {
    velocity: Yt.velocity,
    stiffness: Yt.stiffness,
    damping: Yt.damping,
    mass: Yt.mass,
    isResolvedFromDuration: !1,
    ...n
  };
  if (!a0(n, xw) && a0(n, bw))
    if (n.visualDuration) {
      const l = n.visualDuration, r = 2 * Math.PI / (l * 1.2), u = r * r, d = 2 * on(0.05, 1, 1 - (n.bounce || 0)) * Math.sqrt(u);
      a = {
        ...a,
        mass: Yt.mass,
        stiffness: u,
        damping: d
      };
    } else {
      const l = gw(n);
      a = {
        ...a,
        ...l,
        mass: Yt.mass
      }, a.isResolvedFromDuration = !0;
    }
  return a;
}
function Gy(n = Yt.visualDuration, a = Yt.bounce) {
  const l = typeof n != "object" ? {
    visualDuration: n,
    keyframes: [0, 1],
    bounce: a
  } : n;
  let { restSpeed: r, restDelta: u } = l;
  const d = l.keyframes[0], f = l.keyframes[l.keyframes.length - 1], m = { done: !1, value: d }, { stiffness: h, damping: p, mass: v, duration: x, velocity: S, isResolvedFromDuration: T } = Sw({
    ...l,
    velocity: -/* @__PURE__ */ jn(l.velocity || 0)
  }), A = S || 0, M = p / (2 * Math.sqrt(h * v)), z = f - d, _ = /* @__PURE__ */ jn(Math.sqrt(h / v)), q = Math.abs(z) < 5;
  r || (r = q ? Yt.restSpeed.granular : Yt.restSpeed.default), u || (u = q ? Yt.restDelta.granular : Yt.restDelta.default);
  let L;
  if (M < 1) {
    const V = Zc(_, M);
    L = (B) => {
      const P = Math.exp(-M * _ * B);
      return f - P * ((A + M * _ * z) / V * Math.sin(V * B) + z * Math.cos(V * B));
    };
  } else if (M === 1)
    L = (V) => f - Math.exp(-_ * V) * (z + (A + _ * z) * V);
  else {
    const V = _ * Math.sqrt(M * M - 1);
    L = (B) => {
      const P = Math.exp(-M * _ * B), J = Math.min(V * B, 300);
      return f - P * ((A + M * _ * z) * Math.sinh(J) + V * z * Math.cosh(J)) / V;
    };
  }
  const Q = {
    calculatedDuration: T && x || null,
    next: (V) => {
      const B = L(V);
      if (T)
        m.done = V >= x;
      else {
        let P = 0;
        M < 1 && (P = V === 0 ? /* @__PURE__ */ Mn(A) : qy(L, V, B));
        const J = Math.abs(P) <= r, Z = Math.abs(f - B) <= u;
        m.done = J && Z;
      }
      return m.value = m.done ? f : B, m;
    },
    toString: () => {
      const V = Math.min(Uy(Q), Yc), B = fy((P) => Q.next(V * P).value, V, 30);
      return V + "ms " + B;
    }
  };
  return Q;
}
function s0({ keyframes: n, velocity: a = 0, power: l = 0.8, timeConstant: r = 325, bounceDamping: u = 10, bounceStiffness: d = 500, modifyTarget: f, min: m, max: h, restDelta: p = 0.5, restSpeed: v }) {
  const x = n[0], S = {
    done: !1,
    value: x
  }, T = (J) => m !== void 0 && J < m || h !== void 0 && J > h, A = (J) => m === void 0 ? h : h === void 0 || Math.abs(m - J) < Math.abs(h - J) ? m : h;
  let M = l * a;
  const z = x + M, _ = f === void 0 ? z : f(z);
  _ !== z && (M = _ - x);
  const q = (J) => -M * Math.exp(-J / r), L = (J) => _ + q(J), Q = (J) => {
    const Z = q(J), et = L(J);
    S.done = Math.abs(Z) <= p, S.value = S.done ? _ : et;
  };
  let V, B;
  const P = (J) => {
    T(S.value) && (V = J, B = Gy({
      keyframes: [S.value, A(S.value)],
      velocity: qy(L, J, S.value),
      // TODO: This should be passing * 1000
      damping: u,
      stiffness: d,
      restDelta: p,
      restSpeed: v
    }));
  };
  return P(0), {
    calculatedDuration: null,
    next: (J) => {
      let Z = !1;
      return !B && V === void 0 && (Z = !0, Q(J), P(J)), V !== void 0 && J >= V ? B.next(J - V) : (!Z && Q(J), S);
    }
  };
}
const ww = /* @__PURE__ */ il(0.42, 0, 1, 1), Tw = /* @__PURE__ */ il(0, 0, 0.58, 1), Yy = /* @__PURE__ */ il(0.42, 0, 0.58, 1), Aw = (n) => Array.isArray(n) && typeof n[0] != "number", Ew = {
  linear: pe,
  easeIn: ww,
  easeInOut: Yy,
  easeOut: Tw,
  circIn: Cf,
  circInOut: Sy,
  circOut: xy,
  backIn: Df,
  backInOut: vy,
  backOut: yy,
  anticipate: by
}, l0 = (n) => {
  if (Rf(n)) {
    Yg(n.length === 4);
    const [a, l, r, u] = n;
    return il(a, l, r, u);
  } else if (typeof n == "string")
    return Ew[n];
  return n;
};
function Mw(n, a, l) {
  const r = [], u = l || Hy, d = n.length - 1;
  for (let f = 0; f < d; f++) {
    let m = u(n[f], n[f + 1]);
    if (a) {
      const h = Array.isArray(a) ? a[f] || pe : a;
      m = al(h, m);
    }
    r.push(m);
  }
  return r;
}
function Xy(n, a, { clamp: l = !0, ease: r, mixer: u } = {}) {
  const d = n.length;
  if (Yg(d === a.length), d === 1)
    return () => a[0];
  if (d === 2 && a[0] === a[1])
    return () => a[1];
  const f = n[0] === n[1];
  n[0] > n[d - 1] && (n = [...n].reverse(), a = [...a].reverse());
  const m = Mw(a, r, u), h = m.length, p = (v) => {
    if (f && v < n[0])
      return a[0];
    let x = 0;
    if (h > 1)
      for (; x < n.length - 2 && !(v < n[x + 1]); x++)
        ;
    const S = /* @__PURE__ */ Oi(n[x], n[x + 1], v);
    return m[x](S);
  };
  return l ? (v) => p(on(n[0], n[d - 1], v)) : p;
}
function jw(n, a) {
  const l = n[n.length - 1];
  for (let r = 1; r <= a; r++) {
    const u = /* @__PURE__ */ Oi(0, a, r);
    n.push(Lt(l, 1, u));
  }
}
function Zy(n) {
  const a = [0];
  return jw(a, n.length - 1), a;
}
function Rw(n, a) {
  return n.map((l) => l * a);
}
function Dw(n, a) {
  return n.map(() => a || Yy).splice(0, n.length - 1);
}
function Ur({ duration: n = 300, keyframes: a, times: l, ease: r = "easeInOut" }) {
  const u = Aw(r) ? r.map(l0) : l0(r), d = {
    done: !1,
    value: a[0]
  }, f = Rw(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    l && l.length === a.length ? l : Zy(a),
    n
  ), m = Xy(f, a, {
    ease: Array.isArray(u) ? u : Dw(a, u)
  });
  return {
    calculatedDuration: n,
    next: (h) => (d.value = m(h), d.done = h >= n, d)
  };
}
const Cw = (n) => {
  const a = ({ timestamp: l }) => n(l);
  return {
    start: () => Tt.update(a, !0),
    stop: () => Je(a),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => re.isProcessing ? re.timestamp : rn.now()
  };
}, Nw = {
  decay: s0,
  inertia: s0,
  tween: Ur,
  keyframes: Ur,
  spring: Gy
}, zw = (n) => n / 100;
class Fr extends By {
  constructor(a) {
    super(a), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: h } = this.options;
      h && h();
    };
    const { name: l, motionValue: r, element: u, keyframes: d } = this.options, f = (u == null ? void 0 : u.KeyframeResolver) || _f, m = (h, p) => this.onKeyframesResolved(h, p);
    this.resolver = new f(d, m, l, r, u), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(a) {
    const { type: l = "keyframes", repeat: r = 0, repeatDelay: u = 0, repeatType: d, velocity: f = 0 } = this.options, m = jf(l) ? l : Nw[l] || Ur;
    let h, p;
    m !== Ur && typeof a[0] != "number" && (h = al(zw, Hy(a[0], a[1])), a = [0, 100]);
    const v = m({ ...this.options, keyframes: a });
    d === "mirror" && (p = m({
      ...this.options,
      keyframes: [...a].reverse(),
      velocity: -f
    })), v.calculatedDuration === null && (v.calculatedDuration = Uy(v));
    const { calculatedDuration: x } = v, S = x + u, T = S * (r + 1) - u;
    return {
      generator: v,
      mirroredGenerator: p,
      mapPercentToKeyframes: h,
      calculatedDuration: x,
      resolvedDuration: S,
      totalDuration: T
    };
  }
  onPostResolved() {
    const { autoplay: a = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !a ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(a, l = !1) {
    const { resolved: r } = this;
    if (!r) {
      const { keyframes: J } = this.options;
      return { done: !0, value: J[J.length - 1] };
    }
    const { finalKeyframe: u, generator: d, mirroredGenerator: f, mapPercentToKeyframes: m, keyframes: h, calculatedDuration: p, totalDuration: v, resolvedDuration: x } = r;
    if (this.startTime === null)
      return d.next(0);
    const { delay: S, repeat: T, repeatType: A, repeatDelay: M, onUpdate: z } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, a) : this.speed < 0 && (this.startTime = Math.min(a - v / this.speed, this.startTime)), l ? this.currentTime = a : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(a - this.startTime) * this.speed;
    const _ = this.currentTime - S * (this.speed >= 0 ? 1 : -1), q = this.speed >= 0 ? _ < 0 : _ > v;
    this.currentTime = Math.max(_, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = v);
    let L = this.currentTime, Q = d;
    if (T) {
      const J = Math.min(this.currentTime, v) / x;
      let Z = Math.floor(J), et = J % 1;
      !et && J >= 1 && (et = 1), et === 1 && Z--, Z = Math.min(Z, T + 1), !!(Z % 2) && (A === "reverse" ? (et = 1 - et, M && (et -= M / x)) : A === "mirror" && (Q = f)), L = on(0, 1, et) * x;
    }
    const V = q ? { done: !1, value: h[0] } : Q.next(L);
    m && (V.value = m(V.value));
    let { done: B } = V;
    !q && p !== null && (B = this.speed >= 0 ? this.currentTime >= v : this.currentTime <= 0);
    const P = this.holdTime === null && (this.state === "finished" || this.state === "running" && B);
    return P && u !== void 0 && (V.value = Pr(h, this.options, u)), z && z(V.value), P && this.finish(), V;
  }
  get duration() {
    const { resolved: a } = this;
    return a ? /* @__PURE__ */ jn(a.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ jn(this.currentTime);
  }
  set time(a) {
    a = /* @__PURE__ */ Mn(a), this.currentTime = a, this.holdTime !== null || this.speed === 0 ? this.holdTime = a : this.driver && (this.startTime = this.driver.now() - a / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(a) {
    const l = this.playbackSpeed !== a;
    this.playbackSpeed = a, l && (this.time = /* @__PURE__ */ jn(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: a = Cw, onPlay: l, startTime: r } = this.options;
    this.driver || (this.driver = a((d) => this.tick(d))), l && l();
    const u = this.driver.now();
    this.holdTime !== null ? this.startTime = u - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = u) : this.startTime = r ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    var a;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused", this.holdTime = (a = this.currentTime) !== null && a !== void 0 ? a : 0;
  }
  complete() {
    this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.teardown(), this.state = "finished";
    const { onComplete: a } = this.options;
    a && a();
  }
  cancel() {
    this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), this.startTime = this.cancelTime = null, this.resolver.cancel();
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(a) {
    return this.startTime = 0, this.tick(a, !0);
  }
}
function _w(n) {
  return new Fr(n);
}
const Ow = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function Vw(n, a, l, { delay: r = 0, duration: u = 300, repeat: d = 0, repeatType: f = "loop", ease: m = "easeInOut", times: h } = {}) {
  const p = { [a]: l };
  h && (p.offset = h);
  const v = hy(m, u);
  return Array.isArray(v) && (p.easing = v), n.animate(p, {
    delay: r,
    duration: u,
    easing: Array.isArray(v) ? "linear" : v,
    fill: "both",
    iterations: d + 1,
    direction: f === "reverse" ? "alternate" : "normal"
  });
}
const kw = /* @__PURE__ */ Mf(() => Object.hasOwnProperty.call(Element.prototype, "animate")), Lr = 10, Bw = 2e4;
function Uw(n) {
  return jf(n.type) || n.type === "spring" || !dy(n.ease);
}
function Lw(n, a) {
  const l = new Fr({
    ...a,
    keyframes: n,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let r = { done: !1, value: n[0] };
  const u = [];
  let d = 0;
  for (; !r.done && d < Bw; )
    r = l.sample(d), u.push(r.value), d += Lr;
  return {
    times: void 0,
    keyframes: u,
    duration: d - Lr,
    ease: "linear"
  };
}
const Ky = {
  anticipate: by,
  backInOut: vy,
  circInOut: Sy
};
function Hw(n) {
  return n in Ky;
}
class r0 extends By {
  constructor(a) {
    super(a);
    const { name: l, motionValue: r, element: u, keyframes: d } = this.options;
    this.resolver = new ky(d, (f, m) => this.onKeyframesResolved(f, m), l, r, u), this.resolver.scheduleResolve();
  }
  initPlayback(a, l) {
    let { duration: r = 300, times: u, ease: d, type: f, motionValue: m, name: h, startTime: p } = this.options;
    if (!m.owner || !m.owner.current)
      return !1;
    if (typeof d == "string" && kr() && Hw(d) && (d = Ky[d]), Uw(this.options)) {
      const { onComplete: x, onUpdate: S, motionValue: T, element: A, ...M } = this.options, z = Lw(a, M);
      a = z.keyframes, a.length === 1 && (a[1] = a[0]), r = z.duration, u = z.times, d = z.ease, f = "keyframes";
    }
    const v = Vw(m.owner.current, h, a, { ...this.options, duration: r, times: u, ease: d });
    return v.startTime = p ?? this.calcStartTime(), this.pendingTimeline ? (Qp(v, this.pendingTimeline), this.pendingTimeline = void 0) : v.onfinish = () => {
      const { onComplete: x } = this.options;
      m.set(Pr(a, this.options, l)), x && x(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: v,
      duration: r,
      times: u,
      type: f,
      ease: d,
      keyframes: a
    };
  }
  get duration() {
    const { resolved: a } = this;
    if (!a)
      return 0;
    const { duration: l } = a;
    return /* @__PURE__ */ jn(l);
  }
  get time() {
    const { resolved: a } = this;
    if (!a)
      return 0;
    const { animation: l } = a;
    return /* @__PURE__ */ jn(l.currentTime || 0);
  }
  set time(a) {
    const { resolved: l } = this;
    if (!l)
      return;
    const { animation: r } = l;
    r.currentTime = /* @__PURE__ */ Mn(a);
  }
  get speed() {
    const { resolved: a } = this;
    if (!a)
      return 1;
    const { animation: l } = a;
    return l.playbackRate;
  }
  set speed(a) {
    const { resolved: l } = this;
    if (!l)
      return;
    const { animation: r } = l;
    r.playbackRate = a;
  }
  get state() {
    const { resolved: a } = this;
    if (!a)
      return "idle";
    const { animation: l } = a;
    return l.playState;
  }
  get startTime() {
    const { resolved: a } = this;
    if (!a)
      return null;
    const { animation: l } = a;
    return l.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(a) {
    if (!this._resolved)
      this.pendingTimeline = a;
    else {
      const { resolved: l } = this;
      if (!l)
        return pe;
      const { animation: r } = l;
      Qp(r, a);
    }
    return pe;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved: a } = this;
    if (!a)
      return;
    const { animation: l } = a;
    l.playState === "finished" && this.updateFinishedPromise(), l.play();
  }
  pause() {
    const { resolved: a } = this;
    if (!a)
      return;
    const { animation: l } = a;
    l.pause();
  }
  stop() {
    if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
      return;
    this.resolveFinishedPromise(), this.updateFinishedPromise();
    const { resolved: a } = this;
    if (!a)
      return;
    const { animation: l, keyframes: r, duration: u, type: d, ease: f, times: m } = a;
    if (l.playState === "idle" || l.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: p, onUpdate: v, onComplete: x, element: S, ...T } = this.options, A = new Fr({
        ...T,
        keyframes: r,
        duration: u,
        type: d,
        ease: f,
        times: m,
        isGenerator: !0
      }), M = /* @__PURE__ */ Mn(this.time);
      p.setWithVelocity(A.sample(M - Lr).value, A.sample(M).value, Lr);
    }
    const { onStop: h } = this.options;
    h && h(), this.cancel();
  }
  complete() {
    const { resolved: a } = this;
    a && a.animation.finish();
  }
  cancel() {
    const { resolved: a } = this;
    a && a.animation.cancel();
  }
  static supports(a) {
    const { motionValue: l, name: r, repeatDelay: u, repeatType: d, damping: f, type: m } = a;
    if (!l || !l.owner || !(l.owner.current instanceof HTMLElement))
      return !1;
    const { onUpdate: h, transformTemplate: p } = l.owner.getProps();
    return kw() && r && Ow.has(r) && (r !== "transform" || !p) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !h && !u && d !== "mirror" && f !== 0 && m !== "inertia";
  }
}
const qw = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Gw = (n) => ({
  type: "spring",
  stiffness: 550,
  damping: n === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Yw = {
  type: "keyframes",
  duration: 0.8
}, Xw = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Zw = (n, { keyframes: a }) => a.length > 2 ? Yw : Vi.has(n) ? n.startsWith("scale") ? Gw(a[1]) : qw : Xw;
function Kw({ when: n, delay: a, delayChildren: l, staggerChildren: r, staggerDirection: u, repeat: d, repeatType: f, repeatDelay: m, from: h, elapsed: p, ...v }) {
  return !!Object.keys(v).length;
}
const Vf = (n, a, l, r = {}, u, d) => (f) => {
  const m = Sf(r, n) || {}, h = m.delay || r.delay || 0;
  let { elapsed: p = 0 } = r;
  p = p - /* @__PURE__ */ Mn(h);
  let v = {
    keyframes: Array.isArray(l) ? l : [null, l],
    ease: "easeOut",
    velocity: a.getVelocity(),
    ...m,
    delay: -p,
    onUpdate: (S) => {
      a.set(S), m.onUpdate && m.onUpdate(S);
    },
    onComplete: () => {
      f(), m.onComplete && m.onComplete();
    },
    name: n,
    motionValue: a,
    element: d ? void 0 : u
  };
  Kw(m) || (v = {
    ...v,
    ...Zw(n, v)
  }), v.duration && (v.duration = /* @__PURE__ */ Mn(v.duration)), v.repeatDelay && (v.repeatDelay = /* @__PURE__ */ Mn(v.repeatDelay)), v.from !== void 0 && (v.keyframes[0] = v.from);
  let x = !1;
  if ((v.type === !1 || v.duration === 0 && !v.repeatDelay) && (v.duration = 0, v.delay === 0 && (x = !0)), v.allowFlatten = !m.type && !m.ease, x && !d && a.get() !== void 0) {
    const S = Pr(v.keyframes, m);
    if (S !== void 0)
      return Tt.update(() => {
        v.onUpdate(S), v.onComplete();
      }), new SS([]);
  }
  return !d && r0.supports(v) ? new r0(v) : new Fr(v);
};
function Qw({ protectedKeys: n, needsAnimating: a }, l) {
  const r = n.hasOwnProperty(l) && a[l] !== !0;
  return a[l] = !1, r;
}
function Qy(n, a, { delay: l = 0, transitionOverride: r, type: u } = {}) {
  var d;
  let { transition: f = n.getDefaultTransition(), transitionEnd: m, ...h } = a;
  r && (f = r);
  const p = [], v = u && n.animationState && n.animationState.getState()[u];
  for (const x in h) {
    const S = n.getValue(x, (d = n.latestValues[x]) !== null && d !== void 0 ? d : null), T = h[x];
    if (T === void 0 || v && Qw(v, x))
      continue;
    const A = {
      delay: l,
      ...Sf(f || {}, x)
    };
    let M = !1;
    if (window.MotionHandoffAnimation) {
      const _ = uy(n);
      if (_) {
        const q = window.MotionHandoffAnimation(_, x, Tt);
        q !== null && (A.startTime = q, M = !0);
      }
    }
    Oc(n, x), S.start(Vf(x, S, T, n.shouldReduceMotion && oy.has(x) ? { type: !1 } : A, n, M));
    const z = S.animation;
    z && p.push(z);
  }
  return m && Promise.all(p).then(() => {
    Tt.update(() => {
      m && vS(n, m);
    });
  }), p;
}
function Kc(n, a, l = {}) {
  var r;
  const u = Js(n, a, l.type === "exit" ? (r = n.presenceContext) === null || r === void 0 ? void 0 : r.custom : void 0);
  let { transition: d = n.getDefaultTransition() || {} } = u || {};
  l.transitionOverride && (d = l.transitionOverride);
  const f = u ? () => Promise.all(Qy(n, u, l)) : () => Promise.resolve(), m = n.variantChildren && n.variantChildren.size ? (p = 0) => {
    const { delayChildren: v = 0, staggerChildren: x, staggerDirection: S } = d;
    return Pw(n, a, v + p, x, S, l);
  } : () => Promise.resolve(), { when: h } = d;
  if (h) {
    const [p, v] = h === "beforeChildren" ? [f, m] : [m, f];
    return p().then(() => v());
  } else
    return Promise.all([f(), m(l.delay)]);
}
function Pw(n, a, l = 0, r = 0, u = 1, d) {
  const f = [], m = (n.variantChildren.size - 1) * r, h = u === 1 ? (p = 0) => p * r : (p = 0) => m - p * r;
  return Array.from(n.variantChildren).sort(Fw).forEach((p, v) => {
    p.notify("AnimationStart", a), f.push(Kc(p, a, {
      ...d,
      delay: l + h(v)
    }).then(() => p.notify("AnimationComplete", a)));
  }), Promise.all(f);
}
function Fw(n, a) {
  return n.sortNodePosition(a);
}
function Jw(n, a, l = {}) {
  n.notify("AnimationStart", a);
  let r;
  if (Array.isArray(a)) {
    const u = a.map((d) => Kc(n, d, l));
    r = Promise.all(u);
  } else if (typeof a == "string")
    r = Kc(n, a, l);
  else {
    const u = typeof a == "function" ? Js(n, a, l.custom) : a;
    r = Promise.all(Qy(n, u, l));
  }
  return r.then(() => {
    n.notify("AnimationComplete", a);
  });
}
function Py(n, a) {
  if (!Array.isArray(a))
    return !1;
  const l = a.length;
  if (l !== n.length)
    return !1;
  for (let r = 0; r < l; r++)
    if (a[r] !== n[r])
      return !1;
  return !0;
}
const $w = of.length;
function Fy(n) {
  if (!n)
    return;
  if (!n.isControllingVariants) {
    const l = n.parent ? Fy(n.parent) || {} : {};
    return n.props.initial !== void 0 && (l.initial = n.props.initial), l;
  }
  const a = {};
  for (let l = 0; l < $w; l++) {
    const r = of[l], u = n.props[r];
    (Qs(u) || u === !1) && (a[r] = u);
  }
  return a;
}
const Ww = [...rf].reverse(), Iw = rf.length;
function tT(n) {
  return (a) => Promise.all(a.map(({ animation: l, options: r }) => Jw(n, l, r)));
}
function eT(n) {
  let a = tT(n), l = o0(), r = !0;
  const u = (h) => (p, v) => {
    var x;
    const S = Js(n, v, h === "exit" ? (x = n.presenceContext) === null || x === void 0 ? void 0 : x.custom : void 0);
    if (S) {
      const { transition: T, transitionEnd: A, ...M } = S;
      p = { ...p, ...M, ...A };
    }
    return p;
  };
  function d(h) {
    a = h(n);
  }
  function f(h) {
    const { props: p } = n, v = Fy(n.parent) || {}, x = [], S = /* @__PURE__ */ new Set();
    let T = {}, A = 1 / 0;
    for (let z = 0; z < Iw; z++) {
      const _ = Ww[z], q = l[_], L = p[_] !== void 0 ? p[_] : v[_], Q = Qs(L), V = _ === h ? q.isActive : null;
      V === !1 && (A = z);
      let B = L === v[_] && L !== p[_] && Q;
      if (B && r && n.manuallyAnimateOnMount && (B = !1), q.protectedKeys = { ...T }, // If it isn't active and hasn't *just* been set as inactive
      !q.isActive && V === null || // If we didn't and don't have any defined prop for this animation type
      !L && !q.prevProp || // Or if the prop doesn't define an animation
      Kr(L) || typeof L == "boolean")
        continue;
      const P = nT(q.prevProp, L);
      let J = P || // If we're making this variant active, we want to always make it active
      _ === h && q.isActive && !B && Q || // If we removed a higher-priority variant (i is in reverse order)
      z > A && Q, Z = !1;
      const et = Array.isArray(L) ? L : [L];
      let bt = et.reduce(u(_), {});
      V === !1 && (bt = {});
      const { prevResolvedValues: kt = {} } = q, _t = {
        ...kt,
        ...bt
      }, Ot = ($) => {
        J = !0, S.has($) && (Z = !0, S.delete($)), q.needsAnimating[$] = !0;
        const K = n.getValue($);
        K && (K.liveStyle = !1);
      };
      for (const $ in _t) {
        const K = bt[$], ot = kt[$];
        if (T.hasOwnProperty($))
          continue;
        let E = !1;
        _c(K) && _c(ot) ? E = !Py(K, ot) : E = K !== ot, E ? K != null ? Ot($) : S.add($) : K !== void 0 && S.has($) ? Ot($) : q.protectedKeys[$] = !0;
      }
      q.prevProp = L, q.prevResolvedValues = bt, q.isActive && (T = { ...T, ...bt }), r && n.blockInitialAnimation && (J = !1), J && (!(B && P) || Z) && x.push(...et.map(($) => ({
        animation: $,
        options: { type: _ }
      })));
    }
    if (S.size) {
      const z = {};
      if (typeof p.initial != "boolean") {
        const _ = Js(n, Array.isArray(p.initial) ? p.initial[0] : p.initial);
        _ && _.transition && (z.transition = _.transition);
      }
      S.forEach((_) => {
        const q = n.getBaseTarget(_), L = n.getValue(_);
        L && (L.liveStyle = !0), z[_] = q ?? null;
      }), x.push({ animation: z });
    }
    let M = !!x.length;
    return r && (p.initial === !1 || p.initial === p.animate) && !n.manuallyAnimateOnMount && (M = !1), r = !1, M ? a(x) : Promise.resolve();
  }
  function m(h, p) {
    var v;
    if (l[h].isActive === p)
      return Promise.resolve();
    (v = n.variantChildren) === null || v === void 0 || v.forEach((S) => {
      var T;
      return (T = S.animationState) === null || T === void 0 ? void 0 : T.setActive(h, p);
    }), l[h].isActive = p;
    const x = f(h);
    for (const S in l)
      l[S].protectedKeys = {};
    return x;
  }
  return {
    animateChanges: f,
    setActive: m,
    setAnimateFunction: d,
    getState: () => l,
    reset: () => {
      l = o0(), r = !0;
    }
  };
}
function nT(n, a) {
  return typeof a == "string" ? a !== n : Array.isArray(a) ? !Py(a, n) : !1;
}
function ji(n = !1) {
  return {
    isActive: n,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function o0() {
  return {
    animate: ji(!0),
    whileInView: ji(),
    whileHover: ji(),
    whileTap: ji(),
    whileDrag: ji(),
    whileFocus: ji(),
    exit: ji()
  };
}
class ni {
  constructor(a) {
    this.isMounted = !1, this.node = a;
  }
  update() {
  }
}
class iT extends ni {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(a) {
    super(a), a.animationState || (a.animationState = eT(a));
  }
  updateAnimationControlsSubscription() {
    const { animate: a } = this.node.getProps();
    Kr(a) && (this.unmountControls = a.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: a } = this.node.getProps(), { animate: l } = this.node.prevProps || {};
    a !== l && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var a;
    this.node.animationState.reset(), (a = this.unmountControls) === null || a === void 0 || a.call(this);
  }
}
let aT = 0;
class sT extends ni {
  constructor() {
    super(...arguments), this.id = aT++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: a, onExitComplete: l } = this.node.presenceContext, { isPresent: r } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || a === r)
      return;
    const u = this.node.animationState.setActive("exit", !a);
    l && !a && u.then(() => {
      l(this.id);
    });
  }
  mount() {
    const { register: a, onExitComplete: l } = this.node.presenceContext || {};
    l && l(this.id), a && (this.unmount = a(this.id));
  }
  unmount() {
  }
}
const lT = {
  animation: {
    Feature: iT
  },
  exit: {
    Feature: sT
  }
}, Fe = {
  x: !1,
  y: !1
};
function Jy() {
  return Fe.x || Fe.y;
}
function rT(n) {
  return n === "x" || n === "y" ? Fe[n] ? null : (Fe[n] = !0, () => {
    Fe[n] = !1;
  }) : Fe.x || Fe.y ? null : (Fe.x = Fe.y = !0, () => {
    Fe.x = Fe.y = !1;
  });
}
function Ws(n, a, l, r = { passive: !0 }) {
  return n.addEventListener(a, l, r), () => n.removeEventListener(a, l);
}
const kf = (n) => n.pointerType === "mouse" ? typeof n.button != "number" || n.button <= 0 : n.isPrimary !== !1;
function sl(n) {
  return {
    point: {
      x: n.pageX,
      y: n.pageY
    }
  };
}
const oT = (n) => (a) => kf(a) && n(a, sl(a));
function qs(n, a, l, r) {
  return Ws(n, a, oT(l), r);
}
function $y({ top: n, left: a, right: l, bottom: r }) {
  return {
    x: { min: a, max: l },
    y: { min: n, max: r }
  };
}
function uT({ x: n, y: a }) {
  return { top: a.min, right: n.max, bottom: a.max, left: n.min };
}
function cT(n, a) {
  if (!a)
    return n;
  const l = a({ x: n.left, y: n.top }), r = a({ x: n.right, y: n.bottom });
  return {
    top: l.y,
    left: l.x,
    bottom: r.y,
    right: r.x
  };
}
const Wy = 1e-4, fT = 1 - Wy, dT = 1 + Wy, Iy = 0.01, hT = 0 - Iy, mT = 0 + Iy;
function ve(n) {
  return n.max - n.min;
}
function pT(n, a, l) {
  return Math.abs(n - a) <= l;
}
function u0(n, a, l, r = 0.5) {
  n.origin = r, n.originPoint = Lt(a.min, a.max, n.origin), n.scale = ve(l) / ve(a), n.translate = Lt(l.min, l.max, n.origin) - n.originPoint, (n.scale >= fT && n.scale <= dT || isNaN(n.scale)) && (n.scale = 1), (n.translate >= hT && n.translate <= mT || isNaN(n.translate)) && (n.translate = 0);
}
function Gs(n, a, l, r) {
  u0(n.x, a.x, l.x, r ? r.originX : void 0), u0(n.y, a.y, l.y, r ? r.originY : void 0);
}
function c0(n, a, l) {
  n.min = l.min + a.min, n.max = n.min + ve(a);
}
function gT(n, a, l) {
  c0(n.x, a.x, l.x), c0(n.y, a.y, l.y);
}
function f0(n, a, l) {
  n.min = a.min - l.min, n.max = n.min + ve(a);
}
function Ys(n, a, l) {
  f0(n.x, a.x, l.x), f0(n.y, a.y, l.y);
}
const d0 = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Aa = () => ({
  x: d0(),
  y: d0()
}), h0 = () => ({ min: 0, max: 0 }), Zt = () => ({
  x: h0(),
  y: h0()
});
function Ge(n) {
  return [n("x"), n("y")];
}
function bc(n) {
  return n === void 0 || n === 1;
}
function Qc({ scale: n, scaleX: a, scaleY: l }) {
  return !bc(n) || !bc(a) || !bc(l);
}
function Di(n) {
  return Qc(n) || tv(n) || n.z || n.rotate || n.rotateX || n.rotateY || n.skewX || n.skewY;
}
function tv(n) {
  return m0(n.x) || m0(n.y);
}
function m0(n) {
  return n && n !== "0%";
}
function Hr(n, a, l) {
  const r = n - l, u = a * r;
  return l + u;
}
function p0(n, a, l, r, u) {
  return u !== void 0 && (n = Hr(n, u, r)), Hr(n, l, r) + a;
}
function Pc(n, a = 0, l = 1, r, u) {
  n.min = p0(n.min, a, l, r, u), n.max = p0(n.max, a, l, r, u);
}
function ev(n, { x: a, y: l }) {
  Pc(n.x, a.translate, a.scale, a.originPoint), Pc(n.y, l.translate, l.scale, l.originPoint);
}
const g0 = 0.999999999999, y0 = 1.0000000000001;
function yT(n, a, l, r = !1) {
  const u = l.length;
  if (!u)
    return;
  a.x = a.y = 1;
  let d, f;
  for (let m = 0; m < u; m++) {
    d = l[m], f = d.projectionDelta;
    const { visualElement: h } = d.options;
    h && h.props.style && h.props.style.display === "contents" || (r && d.options.layoutScroll && d.scroll && d !== d.root && Ma(n, {
      x: -d.scroll.offset.x,
      y: -d.scroll.offset.y
    }), f && (a.x *= f.x.scale, a.y *= f.y.scale, ev(n, f)), r && Di(d.latestValues) && Ma(n, d.latestValues));
  }
  a.x < y0 && a.x > g0 && (a.x = 1), a.y < y0 && a.y > g0 && (a.y = 1);
}
function Ea(n, a) {
  n.min = n.min + a, n.max = n.max + a;
}
function v0(n, a, l, r, u = 0.5) {
  const d = Lt(n.min, n.max, u);
  Pc(n, a, l, d, r);
}
function Ma(n, a) {
  v0(n.x, a.x, a.scaleX, a.scale, a.originX), v0(n.y, a.y, a.scaleY, a.scale, a.originY);
}
function nv(n, a) {
  return $y(cT(n.getBoundingClientRect(), a));
}
function vT(n, a, l) {
  const r = nv(n, l), { scroll: u } = a;
  return u && (Ea(r.x, u.offset.x), Ea(r.y, u.offset.y)), r;
}
const iv = ({ current: n }) => n ? n.ownerDocument.defaultView : null, b0 = (n, a) => Math.abs(n - a);
function bT(n, a) {
  const l = b0(n.x, a.x), r = b0(n.y, a.y);
  return Math.sqrt(l ** 2 + r ** 2);
}
class av {
  constructor(a, l, { transformPagePoint: r, contextWindow: u, dragSnapToOrigin: d = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const x = Sc(this.lastMoveEventInfo, this.history), S = this.startEvent !== null, T = bT(x.offset, { x: 0, y: 0 }) >= 3;
      if (!S && !T)
        return;
      const { point: A } = x, { timestamp: M } = re;
      this.history.push({ ...A, timestamp: M });
      const { onStart: z, onMove: _ } = this.handlers;
      S || (z && z(this.lastMoveEvent, x), this.startEvent = this.lastMoveEvent), _ && _(this.lastMoveEvent, x);
    }, this.handlePointerMove = (x, S) => {
      this.lastMoveEvent = x, this.lastMoveEventInfo = xc(S, this.transformPagePoint), Tt.update(this.updatePoint, !0);
    }, this.handlePointerUp = (x, S) => {
      this.end();
      const { onEnd: T, onSessionEnd: A, resumeAnimation: M } = this.handlers;
      if (this.dragSnapToOrigin && M && M(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const z = Sc(x.type === "pointercancel" ? this.lastMoveEventInfo : xc(S, this.transformPagePoint), this.history);
      this.startEvent && T && T(x, z), A && A(x, z);
    }, !kf(a))
      return;
    this.dragSnapToOrigin = d, this.handlers = l, this.transformPagePoint = r, this.contextWindow = u || window;
    const f = sl(a), m = xc(f, this.transformPagePoint), { point: h } = m, { timestamp: p } = re;
    this.history = [{ ...h, timestamp: p }];
    const { onSessionStart: v } = l;
    v && v(a, Sc(m, this.history)), this.removeListeners = al(qs(this.contextWindow, "pointermove", this.handlePointerMove), qs(this.contextWindow, "pointerup", this.handlePointerUp), qs(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(a) {
    this.handlers = a;
  }
  end() {
    this.removeListeners && this.removeListeners(), Je(this.updatePoint);
  }
}
function xc(n, a) {
  return a ? { point: a(n.point) } : n;
}
function x0(n, a) {
  return { x: n.x - a.x, y: n.y - a.y };
}
function Sc({ point: n }, a) {
  return {
    point: n,
    delta: x0(n, sv(a)),
    offset: x0(n, xT(a)),
    velocity: ST(a, 0.1)
  };
}
function xT(n) {
  return n[0];
}
function sv(n) {
  return n[n.length - 1];
}
function ST(n, a) {
  if (n.length < 2)
    return { x: 0, y: 0 };
  let l = n.length - 1, r = null;
  const u = sv(n);
  for (; l >= 0 && (r = n[l], !(u.timestamp - r.timestamp > /* @__PURE__ */ Mn(a))); )
    l--;
  if (!r)
    return { x: 0, y: 0 };
  const d = /* @__PURE__ */ jn(u.timestamp - r.timestamp);
  if (d === 0)
    return { x: 0, y: 0 };
  const f = {
    x: (u.x - r.x) / d,
    y: (u.y - r.y) / d
  };
  return f.x === 1 / 0 && (f.x = 0), f.y === 1 / 0 && (f.y = 0), f;
}
function wT(n, { min: a, max: l }, r) {
  return a !== void 0 && n < a ? n = r ? Lt(a, n, r.min) : Math.max(n, a) : l !== void 0 && n > l && (n = r ? Lt(l, n, r.max) : Math.min(n, l)), n;
}
function S0(n, a, l) {
  return {
    min: a !== void 0 ? n.min + a : void 0,
    max: l !== void 0 ? n.max + l - (n.max - n.min) : void 0
  };
}
function TT(n, { top: a, left: l, bottom: r, right: u }) {
  return {
    x: S0(n.x, l, u),
    y: S0(n.y, a, r)
  };
}
function w0(n, a) {
  let l = a.min - n.min, r = a.max - n.max;
  return a.max - a.min < n.max - n.min && ([l, r] = [r, l]), { min: l, max: r };
}
function AT(n, a) {
  return {
    x: w0(n.x, a.x),
    y: w0(n.y, a.y)
  };
}
function ET(n, a) {
  let l = 0.5;
  const r = ve(n), u = ve(a);
  return u > r ? l = /* @__PURE__ */ Oi(a.min, a.max - r, n.min) : r > u && (l = /* @__PURE__ */ Oi(n.min, n.max - u, a.min)), on(0, 1, l);
}
function MT(n, a) {
  const l = {};
  return a.min !== void 0 && (l.min = a.min - n.min), a.max !== void 0 && (l.max = a.max - n.min), l;
}
const Fc = 0.35;
function jT(n = Fc) {
  return n === !1 ? n = 0 : n === !0 && (n = Fc), {
    x: T0(n, "left", "right"),
    y: T0(n, "top", "bottom")
  };
}
function T0(n, a, l) {
  return {
    min: A0(n, a),
    max: A0(n, l)
  };
}
function A0(n, a) {
  return typeof n == "number" ? n : n[a] || 0;
}
const RT = /* @__PURE__ */ new WeakMap();
class DT {
  constructor(a) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Zt(), this.visualElement = a;
  }
  start(a, { snapToCursor: l = !1 } = {}) {
    const { presenceContext: r } = this.visualElement;
    if (r && r.isPresent === !1)
      return;
    const u = (v) => {
      const { dragSnapToOrigin: x } = this.getProps();
      x ? this.pauseAnimation() : this.stopAnimation(), l && this.snapToCursor(sl(v).point);
    }, d = (v, x) => {
      const { drag: S, dragPropagation: T, onDragStart: A } = this.getProps();
      if (S && !T && (this.openDragLock && this.openDragLock(), this.openDragLock = rT(S), !this.openDragLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Ge((z) => {
        let _ = this.getAxisMotionValue(z).get() || 0;
        if (ln.test(_)) {
          const { projection: q } = this.visualElement;
          if (q && q.layout) {
            const L = q.layout.layoutBox[z];
            L && (_ = ve(L) * (parseFloat(_) / 100));
          }
        }
        this.originPoint[z] = _;
      }), A && Tt.postRender(() => A(v, x)), Oc(this.visualElement, "transform");
      const { animationState: M } = this.visualElement;
      M && M.setActive("whileDrag", !0);
    }, f = (v, x) => {
      const { dragPropagation: S, dragDirectionLock: T, onDirectionLock: A, onDrag: M } = this.getProps();
      if (!S && !this.openDragLock)
        return;
      const { offset: z } = x;
      if (T && this.currentDirection === null) {
        this.currentDirection = CT(z), this.currentDirection !== null && A && A(this.currentDirection);
        return;
      }
      this.updateAxis("x", x.point, z), this.updateAxis("y", x.point, z), this.visualElement.render(), M && M(v, x);
    }, m = (v, x) => this.stop(v, x), h = () => Ge((v) => {
      var x;
      return this.getAnimationState(v) === "paused" && ((x = this.getAxisMotionValue(v).animation) === null || x === void 0 ? void 0 : x.play());
    }), { dragSnapToOrigin: p } = this.getProps();
    this.panSession = new av(a, {
      onSessionStart: u,
      onStart: d,
      onMove: f,
      onSessionEnd: m,
      resumeAnimation: h
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: p,
      contextWindow: iv(this.visualElement)
    });
  }
  stop(a, l) {
    const r = this.isDragging;
    if (this.cancel(), !r)
      return;
    const { velocity: u } = l;
    this.startAnimation(u);
    const { onDragEnd: d } = this.getProps();
    d && Tt.postRender(() => d(a, l));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: a, animationState: l } = this.visualElement;
    a && (a.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: r } = this.getProps();
    !r && this.openDragLock && (this.openDragLock(), this.openDragLock = null), l && l.setActive("whileDrag", !1);
  }
  updateAxis(a, l, r) {
    const { drag: u } = this.getProps();
    if (!r || !Ar(a, u, this.currentDirection))
      return;
    const d = this.getAxisMotionValue(a);
    let f = this.originPoint[a] + r[a];
    this.constraints && this.constraints[a] && (f = wT(f, this.constraints[a], this.elastic[a])), d.set(f);
  }
  resolveConstraints() {
    var a;
    const { dragConstraints: l, dragElastic: r } = this.getProps(), u = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (a = this.visualElement.projection) === null || a === void 0 ? void 0 : a.layout, d = this.constraints;
    l && wa(l) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : l && u ? this.constraints = TT(u.layoutBox, l) : this.constraints = !1, this.elastic = jT(r), d !== this.constraints && u && this.constraints && !this.hasMutatedConstraints && Ge((f) => {
      this.constraints !== !1 && this.getAxisMotionValue(f) && (this.constraints[f] = MT(u.layoutBox[f], this.constraints[f]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: a, onMeasureDragConstraints: l } = this.getProps();
    if (!a || !wa(a))
      return !1;
    const r = a.current, { projection: u } = this.visualElement;
    if (!u || !u.layout)
      return !1;
    const d = vT(r, u.root, this.visualElement.getTransformPagePoint());
    let f = AT(u.layout.layoutBox, d);
    if (l) {
      const m = l(uT(f));
      this.hasMutatedConstraints = !!m, m && (f = $y(m));
    }
    return f;
  }
  startAnimation(a) {
    const { drag: l, dragMomentum: r, dragElastic: u, dragTransition: d, dragSnapToOrigin: f, onDragTransitionEnd: m } = this.getProps(), h = this.constraints || {}, p = Ge((v) => {
      if (!Ar(v, l, this.currentDirection))
        return;
      let x = h && h[v] || {};
      f && (x = { min: 0, max: 0 });
      const S = u ? 200 : 1e6, T = u ? 40 : 1e7, A = {
        type: "inertia",
        velocity: r ? a[v] : 0,
        bounceStiffness: S,
        bounceDamping: T,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...d,
        ...x
      };
      return this.startAxisValueAnimation(v, A);
    });
    return Promise.all(p).then(m);
  }
  startAxisValueAnimation(a, l) {
    const r = this.getAxisMotionValue(a);
    return Oc(this.visualElement, a), r.start(Vf(a, r, 0, l, this.visualElement, !1));
  }
  stopAnimation() {
    Ge((a) => this.getAxisMotionValue(a).stop());
  }
  pauseAnimation() {
    Ge((a) => {
      var l;
      return (l = this.getAxisMotionValue(a).animation) === null || l === void 0 ? void 0 : l.pause();
    });
  }
  getAnimationState(a) {
    var l;
    return (l = this.getAxisMotionValue(a).animation) === null || l === void 0 ? void 0 : l.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(a) {
    const l = `_drag${a.toUpperCase()}`, r = this.visualElement.getProps(), u = r[l];
    return u || this.visualElement.getValue(a, (r.initial ? r.initial[a] : void 0) || 0);
  }
  snapToCursor(a) {
    Ge((l) => {
      const { drag: r } = this.getProps();
      if (!Ar(l, r, this.currentDirection))
        return;
      const { projection: u } = this.visualElement, d = this.getAxisMotionValue(l);
      if (u && u.layout) {
        const { min: f, max: m } = u.layout.layoutBox[l];
        d.set(a[l] - Lt(f, m, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: a, dragConstraints: l } = this.getProps(), { projection: r } = this.visualElement;
    if (!wa(l) || !r || !this.constraints)
      return;
    this.stopAnimation();
    const u = { x: 0, y: 0 };
    Ge((f) => {
      const m = this.getAxisMotionValue(f);
      if (m && this.constraints !== !1) {
        const h = m.get();
        u[f] = ET({ min: h, max: h }, this.constraints[f]);
      }
    });
    const { transformTemplate: d } = this.visualElement.getProps();
    this.visualElement.current.style.transform = d ? d({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.resolveConstraints(), Ge((f) => {
      if (!Ar(f, a, null))
        return;
      const m = this.getAxisMotionValue(f), { min: h, max: p } = this.constraints[f];
      m.set(Lt(h, p, u[f]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    RT.set(this.visualElement, this);
    const a = this.visualElement.current, l = qs(a, "pointerdown", (h) => {
      const { drag: p, dragListener: v = !0 } = this.getProps();
      p && v && this.start(h);
    }), r = () => {
      const { dragConstraints: h } = this.getProps();
      wa(h) && h.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: u } = this.visualElement, d = u.addEventListener("measure", r);
    u && !u.layout && (u.root && u.root.updateScroll(), u.updateLayout()), Tt.read(r);
    const f = Ws(window, "resize", () => this.scalePositionWithinConstraints()), m = u.addEventListener("didUpdate", ({ delta: h, hasLayoutChanged: p }) => {
      this.isDragging && p && (Ge((v) => {
        const x = this.getAxisMotionValue(v);
        x && (this.originPoint[v] += h[v].translate, x.set(x.get() + h[v].translate));
      }), this.visualElement.render());
    });
    return () => {
      f(), l(), d(), m && m();
    };
  }
  getProps() {
    const a = this.visualElement.getProps(), { drag: l = !1, dragDirectionLock: r = !1, dragPropagation: u = !1, dragConstraints: d = !1, dragElastic: f = Fc, dragMomentum: m = !0 } = a;
    return {
      ...a,
      drag: l,
      dragDirectionLock: r,
      dragPropagation: u,
      dragConstraints: d,
      dragElastic: f,
      dragMomentum: m
    };
  }
}
function Ar(n, a, l) {
  return (a === !0 || a === n) && (l === null || l === n);
}
function CT(n, a = 10) {
  let l = null;
  return Math.abs(n.y) > a ? l = "y" : Math.abs(n.x) > a && (l = "x"), l;
}
class NT extends ni {
  constructor(a) {
    super(a), this.removeGroupControls = pe, this.removeListeners = pe, this.controls = new DT(a);
  }
  mount() {
    const { dragControls: a } = this.node.getProps();
    a && (this.removeGroupControls = a.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || pe;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const E0 = (n) => (a, l) => {
  n && Tt.postRender(() => n(a, l));
};
class zT extends ni {
  constructor() {
    super(...arguments), this.removePointerDownListener = pe;
  }
  onPointerDown(a) {
    this.session = new av(a, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: iv(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: a, onPanStart: l, onPan: r, onPanEnd: u } = this.node.getProps();
    return {
      onSessionStart: E0(a),
      onStart: E0(l),
      onMove: r,
      onEnd: (d, f) => {
        delete this.session, u && Tt.postRender(() => u(d, f));
      }
    };
  }
  mount() {
    this.removePointerDownListener = qs(this.node.current, "pointerdown", (a) => this.onPointerDown(a));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const Cr = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function M0(n, a) {
  return a.max === a.min ? 0 : n / (a.max - a.min) * 100;
}
const Vs = {
  correct: (n, a) => {
    if (!a.target)
      return n;
    if (typeof n == "string")
      if (rt.test(n))
        n = parseFloat(n);
      else
        return n;
    const l = M0(n, a.target.x), r = M0(n, a.target.y);
    return `${l}% ${r}%`;
  }
}, _T = {
  correct: (n, { treeScale: a, projectionDelta: l }) => {
    const r = n, u = ei.parse(n);
    if (u.length > 5)
      return r;
    const d = ei.createTransformer(n), f = typeof u[0] != "number" ? 1 : 0, m = l.x.scale * a.x, h = l.y.scale * a.y;
    u[0 + f] /= m, u[1 + f] /= h;
    const p = Lt(m, h, 0.5);
    return typeof u[2 + f] == "number" && (u[2 + f] /= p), typeof u[3 + f] == "number" && (u[3 + f] /= p), d(u);
  }
};
class OT extends C.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: a, layoutGroup: l, switchLayoutGroup: r, layoutId: u } = this.props, { projection: d } = a;
    Y2(VT), d && (l.group && l.group.add(d), r && r.register && u && r.register(d), d.root.didUpdate(), d.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), d.setOptions({
      ...d.options,
      onExitComplete: () => this.safeToRemove()
    })), Cr.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(a) {
    const { layoutDependency: l, visualElement: r, drag: u, isPresent: d } = this.props, f = r.projection;
    return f && (f.isPresent = d, u || a.layoutDependency !== l || l === void 0 || a.isPresent !== d ? f.willUpdate() : this.safeToRemove(), a.isPresent !== d && (d ? f.promote() : f.relegate() || Tt.postRender(() => {
      const m = f.getStack();
      (!m || !m.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: a } = this.props.visualElement;
    a && (a.root.didUpdate(), uf.postRender(() => {
      !a.currentAnimation && a.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: a, layoutGroup: l, switchLayoutGroup: r } = this.props, { projection: u } = a;
    u && (u.scheduleCheckAfterUnmount(), l && l.group && l.group.remove(u), r && r.deregister && r.deregister(u));
  }
  safeToRemove() {
    const { safeToRemove: a } = this.props;
    a && a();
  }
  render() {
    return null;
  }
}
function lv(n) {
  const [a, l] = Gg(), r = C.useContext(sf);
  return y.jsx(OT, { ...n, layoutGroup: r, switchLayoutGroup: C.useContext(Fg), isPresent: a, safeToRemove: l });
}
const VT = {
  borderRadius: {
    ...Vs,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Vs,
  borderTopRightRadius: Vs,
  borderBottomLeftRadius: Vs,
  borderBottomRightRadius: Vs,
  boxShadow: _T
};
function kT(n, a, l) {
  const r = $t(n) ? n : sn(n);
  return r.start(Vf("", r, a, l)), r.animation;
}
function BT(n) {
  return n instanceof SVGElement && n.tagName !== "svg";
}
const UT = (n, a) => n.depth - a.depth;
class LT {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(a) {
    wf(this.children, a), this.isDirty = !0;
  }
  remove(a) {
    Tf(this.children, a), this.isDirty = !0;
  }
  forEach(a) {
    this.isDirty && this.children.sort(UT), this.isDirty = !1, this.children.forEach(a);
  }
}
function HT(n, a) {
  const l = rn.now(), r = ({ timestamp: u }) => {
    const d = u - l;
    d >= a && (Je(r), n(d - a));
  };
  return Tt.read(r, !0), () => Je(r);
}
const rv = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], qT = rv.length, j0 = (n) => typeof n == "string" ? parseFloat(n) : n, R0 = (n) => typeof n == "number" || rt.test(n);
function GT(n, a, l, r, u, d) {
  u ? (n.opacity = Lt(
    0,
    // TODO Reinstate this if only child
    l.opacity !== void 0 ? l.opacity : 1,
    YT(r)
  ), n.opacityExit = Lt(a.opacity !== void 0 ? a.opacity : 1, 0, XT(r))) : d && (n.opacity = Lt(a.opacity !== void 0 ? a.opacity : 1, l.opacity !== void 0 ? l.opacity : 1, r));
  for (let f = 0; f < qT; f++) {
    const m = `border${rv[f]}Radius`;
    let h = D0(a, m), p = D0(l, m);
    if (h === void 0 && p === void 0)
      continue;
    h || (h = 0), p || (p = 0), h === 0 || p === 0 || R0(h) === R0(p) ? (n[m] = Math.max(Lt(j0(h), j0(p), r), 0), (ln.test(p) || ln.test(h)) && (n[m] += "%")) : n[m] = p;
  }
  (a.rotate || l.rotate) && (n.rotate = Lt(a.rotate || 0, l.rotate || 0, r));
}
function D0(n, a) {
  return n[a] !== void 0 ? n[a] : n.borderRadius;
}
const YT = /* @__PURE__ */ ov(0, 0.5, xy), XT = /* @__PURE__ */ ov(0.5, 0.95, pe);
function ov(n, a, l) {
  return (r) => r < n ? 0 : r > a ? 1 : l(/* @__PURE__ */ Oi(n, a, r));
}
function C0(n, a) {
  n.min = a.min, n.max = a.max;
}
function qe(n, a) {
  C0(n.x, a.x), C0(n.y, a.y);
}
function N0(n, a) {
  n.translate = a.translate, n.scale = a.scale, n.originPoint = a.originPoint, n.origin = a.origin;
}
function z0(n, a, l, r, u) {
  return n -= a, n = Hr(n, 1 / l, r), u !== void 0 && (n = Hr(n, 1 / u, r)), n;
}
function ZT(n, a = 0, l = 1, r = 0.5, u, d = n, f = n) {
  if (ln.test(a) && (a = parseFloat(a), a = Lt(f.min, f.max, a / 100) - f.min), typeof a != "number")
    return;
  let m = Lt(d.min, d.max, r);
  n === d && (m -= a), n.min = z0(n.min, a, l, m, u), n.max = z0(n.max, a, l, m, u);
}
function _0(n, a, [l, r, u], d, f) {
  ZT(n, a[l], a[r], a[u], a.scale, d, f);
}
const KT = ["x", "scaleX", "originX"], QT = ["y", "scaleY", "originY"];
function O0(n, a, l, r) {
  _0(n.x, a, KT, l ? l.x : void 0, r ? r.x : void 0), _0(n.y, a, QT, l ? l.y : void 0, r ? r.y : void 0);
}
function V0(n) {
  return n.translate === 0 && n.scale === 1;
}
function uv(n) {
  return V0(n.x) && V0(n.y);
}
function k0(n, a) {
  return n.min === a.min && n.max === a.max;
}
function PT(n, a) {
  return k0(n.x, a.x) && k0(n.y, a.y);
}
function B0(n, a) {
  return Math.round(n.min) === Math.round(a.min) && Math.round(n.max) === Math.round(a.max);
}
function cv(n, a) {
  return B0(n.x, a.x) && B0(n.y, a.y);
}
function U0(n) {
  return ve(n.x) / ve(n.y);
}
function L0(n, a) {
  return n.translate === a.translate && n.scale === a.scale && n.originPoint === a.originPoint;
}
class FT {
  constructor() {
    this.members = [];
  }
  add(a) {
    wf(this.members, a), a.scheduleRender();
  }
  remove(a) {
    if (Tf(this.members, a), a === this.prevLead && (this.prevLead = void 0), a === this.lead) {
      const l = this.members[this.members.length - 1];
      l && this.promote(l);
    }
  }
  relegate(a) {
    const l = this.members.findIndex((u) => a === u);
    if (l === 0)
      return !1;
    let r;
    for (let u = l; u >= 0; u--) {
      const d = this.members[u];
      if (d.isPresent !== !1) {
        r = d;
        break;
      }
    }
    return r ? (this.promote(r), !0) : !1;
  }
  promote(a, l) {
    const r = this.lead;
    if (a !== r && (this.prevLead = r, this.lead = a, a.show(), r)) {
      r.instance && r.scheduleRender(), a.scheduleRender(), a.resumeFrom = r, l && (a.resumeFrom.preserveOpacity = !0), r.snapshot && (a.snapshot = r.snapshot, a.snapshot.latestValues = r.animationValues || r.latestValues), a.root && a.root.isUpdating && (a.isLayoutDirty = !0);
      const { crossfade: u } = a.options;
      u === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((a) => {
      const { options: l, resumingFrom: r } = a;
      l.onExitComplete && l.onExitComplete(), r && r.options.onExitComplete && r.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((a) => {
      a.instance && a.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function JT(n, a, l) {
  let r = "";
  const u = n.x.translate / a.x, d = n.y.translate / a.y, f = (l == null ? void 0 : l.z) || 0;
  if ((u || d || f) && (r = `translate3d(${u}px, ${d}px, ${f}px) `), (a.x !== 1 || a.y !== 1) && (r += `scale(${1 / a.x}, ${1 / a.y}) `), l) {
    const { transformPerspective: p, rotate: v, rotateX: x, rotateY: S, skewX: T, skewY: A } = l;
    p && (r = `perspective(${p}px) ${r}`), v && (r += `rotate(${v}deg) `), x && (r += `rotateX(${x}deg) `), S && (r += `rotateY(${S}deg) `), T && (r += `skewX(${T}deg) `), A && (r += `skewY(${A}deg) `);
  }
  const m = n.x.scale * a.x, h = n.y.scale * a.y;
  return (m !== 1 || h !== 1) && (r += `scale(${m}, ${h})`), r || "none";
}
const wc = ["", "X", "Y", "Z"], $T = { visibility: "hidden" }, H0 = 1e3;
let WT = 0;
function Tc(n, a, l, r) {
  const { latestValues: u } = a;
  u[n] && (l[n] = u[n], a.setStaticValue(n, 0), r && (r[n] = 0));
}
function fv(n) {
  if (n.hasCheckedOptimisedAppear = !0, n.root === n)
    return;
  const { visualElement: a } = n.options;
  if (!a)
    return;
  const l = uy(a);
  if (window.MotionHasOptimisedAnimation(l, "transform")) {
    const { layout: u, layoutId: d } = n.options;
    window.MotionCancelOptimisedAnimation(l, "transform", Tt, !(u || d));
  }
  const { parent: r } = n;
  r && !r.hasCheckedOptimisedAppear && fv(r);
}
function dv({ attachResizeListener: n, defaultParent: a, measureScroll: l, checkIsScrollRoot: r, resetTransform: u }) {
  return class {
    constructor(f = {}, m = a == null ? void 0 : a()) {
      this.id = WT++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(eA), this.nodes.forEach(lA), this.nodes.forEach(rA), this.nodes.forEach(nA);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = f, this.root = m ? m.root || m : this, this.path = m ? [...m.path, m] : [], this.parent = m, this.depth = m ? m.depth + 1 : 0;
      for (let h = 0; h < this.path.length; h++)
        this.path[h].shouldResetTransform = !0;
      this.root === this && (this.nodes = new LT());
    }
    addEventListener(f, m) {
      return this.eventHandlers.has(f) || this.eventHandlers.set(f, new Af()), this.eventHandlers.get(f).add(m);
    }
    notifyListeners(f, ...m) {
      const h = this.eventHandlers.get(f);
      h && h.notify(...m);
    }
    hasListeners(f) {
      return this.eventHandlers.has(f);
    }
    /**
     * Lifecycles
     */
    mount(f, m = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = BT(f), this.instance = f;
      const { layoutId: h, layout: p, visualElement: v } = this.options;
      if (v && !v.current && v.mount(f), this.root.nodes.add(this), this.parent && this.parent.children.add(this), m && (p || h) && (this.isLayoutDirty = !0), n) {
        let x;
        const S = () => this.root.updateBlockedByResize = !1;
        n(f, () => {
          this.root.updateBlockedByResize = !0, x && x(), x = HT(S, 250), Cr.hasAnimatedSinceResize && (Cr.hasAnimatedSinceResize = !1, this.nodes.forEach(G0));
        });
      }
      h && this.root.registerSharedNode(h, this), this.options.animate !== !1 && v && (h || p) && this.addEventListener("didUpdate", ({ delta: x, hasLayoutChanged: S, hasRelativeLayoutChanged: T, layout: A }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const M = this.options.transition || v.getDefaultTransition() || dA, { onLayoutAnimationStart: z, onLayoutAnimationComplete: _ } = v.getProps(), q = !this.targetLayout || !cv(this.targetLayout, A), L = !S && T;
        if (this.options.layoutRoot || this.resumeFrom || L || S && (q || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(x, L);
          const Q = {
            ...Sf(M, "layout"),
            onPlay: z,
            onComplete: _
          };
          (v.shouldReduceMotion || this.options.layoutRoot) && (Q.delay = 0, Q.type = !1), this.startAnimation(Q);
        } else
          S || G0(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = A;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const f = this.getStack();
      f && f.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, Je(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(oA), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: f } = this.options;
      return f && f.getProps().transformTemplate;
    }
    willUpdate(f = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && fv(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let v = 0; v < this.path.length; v++) {
        const x = this.path[v];
        x.shouldResetTransform = !0, x.updateScroll("snapshot"), x.options.layoutRoot && x.willUpdate(!1);
      }
      const { layoutId: m, layout: h } = this.options;
      if (m === void 0 && !h)
        return;
      const p = this.getTransformTemplate();
      this.prevTransformTemplateValue = p ? p(this.latestValues, "") : void 0, this.updateSnapshot(), f && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(q0);
        return;
      }
      this.isUpdating || this.nodes.forEach(aA), this.isUpdating = !1, this.nodes.forEach(sA), this.nodes.forEach(IT), this.nodes.forEach(tA), this.clearAllSnapshots();
      const m = rn.now();
      re.delta = on(0, 1e3 / 60, m - re.timestamp), re.timestamp = m, re.isProcessing = !0, mc.update.process(re), mc.preRender.process(re), mc.render.process(re), re.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, uf.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(iA), this.sharedNodes.forEach(uA);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Tt.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Tt.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !ve(this.snapshot.measuredBox.x) && !ve(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let h = 0; h < this.path.length; h++)
          this.path[h].updateScroll();
      const f = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = Zt(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: m } = this.options;
      m && m.notify("LayoutMeasure", this.layout.layoutBox, f ? f.layoutBox : void 0);
    }
    updateScroll(f = "measure") {
      let m = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === f && (m = !1), m) {
        const h = r(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: f,
          isRoot: h,
          offset: l(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : h
        };
      }
    }
    resetTransform() {
      if (!u)
        return;
      const f = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, m = this.projectionDelta && !uv(this.projectionDelta), h = this.getTransformTemplate(), p = h ? h(this.latestValues, "") : void 0, v = p !== this.prevTransformTemplateValue;
      f && (m || Di(this.latestValues) || v) && (u(this.instance, p), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(f = !0) {
      const m = this.measurePageBox();
      let h = this.removeElementScroll(m);
      return f && (h = this.removeTransform(h)), hA(h), {
        animationId: this.root.animationId,
        measuredBox: m,
        layoutBox: h,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var f;
      const { visualElement: m } = this.options;
      if (!m)
        return Zt();
      const h = m.measureViewportBox();
      if (!(((f = this.scroll) === null || f === void 0 ? void 0 : f.wasRoot) || this.path.some(mA))) {
        const { scroll: v } = this.root;
        v && (Ea(h.x, v.offset.x), Ea(h.y, v.offset.y));
      }
      return h;
    }
    removeElementScroll(f) {
      var m;
      const h = Zt();
      if (qe(h, f), !((m = this.scroll) === null || m === void 0) && m.wasRoot)
        return h;
      for (let p = 0; p < this.path.length; p++) {
        const v = this.path[p], { scroll: x, options: S } = v;
        v !== this.root && x && S.layoutScroll && (x.wasRoot && qe(h, f), Ea(h.x, x.offset.x), Ea(h.y, x.offset.y));
      }
      return h;
    }
    applyTransform(f, m = !1) {
      const h = Zt();
      qe(h, f);
      for (let p = 0; p < this.path.length; p++) {
        const v = this.path[p];
        !m && v.options.layoutScroll && v.scroll && v !== v.root && Ma(h, {
          x: -v.scroll.offset.x,
          y: -v.scroll.offset.y
        }), Di(v.latestValues) && Ma(h, v.latestValues);
      }
      return Di(this.latestValues) && Ma(h, this.latestValues), h;
    }
    removeTransform(f) {
      const m = Zt();
      qe(m, f);
      for (let h = 0; h < this.path.length; h++) {
        const p = this.path[h];
        if (!p.instance || !Di(p.latestValues))
          continue;
        Qc(p.latestValues) && p.updateSnapshot();
        const v = Zt(), x = p.measurePageBox();
        qe(v, x), O0(m, p.latestValues, p.snapshot ? p.snapshot.layoutBox : void 0, v);
      }
      return Di(this.latestValues) && O0(m, this.latestValues), m;
    }
    setTargetDelta(f) {
      this.targetDelta = f, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(f) {
      this.options = {
        ...this.options,
        ...f,
        crossfade: f.crossfade !== void 0 ? f.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== re.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(f = !1) {
      var m;
      const h = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = h.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = h.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = h.isSharedProjectionDirty);
      const p = !!this.resumingFrom || this !== h;
      if (!(f || p && this.isSharedProjectionDirty || this.isProjectionDirty || !((m = this.parent) === null || m === void 0) && m.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: x, layoutId: S } = this.options;
      if (!(!this.layout || !(x || S))) {
        if (this.resolvedRelativeTargetAt = re.timestamp, !this.targetDelta && !this.relativeTarget) {
          const T = this.getClosestProjectingParent();
          T && T.layout && this.animationProgress !== 1 ? (this.relativeParent = T, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Zt(), this.relativeTargetOrigin = Zt(), Ys(this.relativeTargetOrigin, this.layout.layoutBox, T.layout.layoutBox), qe(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Zt(), this.targetWithTransforms = Zt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), gT(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : qe(this.target, this.layout.layoutBox), ev(this.target, this.targetDelta)) : qe(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const T = this.getClosestProjectingParent();
          T && !!T.resumingFrom == !!this.resumingFrom && !T.options.layoutScroll && T.target && this.animationProgress !== 1 ? (this.relativeParent = T, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Zt(), this.relativeTargetOrigin = Zt(), Ys(this.relativeTargetOrigin, this.target, T.target), qe(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Qc(this.parent.latestValues) || tv(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var f;
      const m = this.getLead(), h = !!this.resumingFrom || this !== m;
      let p = !0;
      if ((this.isProjectionDirty || !((f = this.parent) === null || f === void 0) && f.isProjectionDirty) && (p = !1), h && (this.isSharedProjectionDirty || this.isTransformDirty) && (p = !1), this.resolvedRelativeTargetAt === re.timestamp && (p = !1), p)
        return;
      const { layout: v, layoutId: x } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(v || x))
        return;
      qe(this.layoutCorrected, this.layout.layoutBox);
      const S = this.treeScale.x, T = this.treeScale.y;
      yT(this.layoutCorrected, this.treeScale, this.path, h), m.layout && !m.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (m.target = m.layout.layoutBox, m.targetWithTransforms = Zt());
      const { target: A } = m;
      if (!A) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (N0(this.prevProjectionDelta.x, this.projectionDelta.x), N0(this.prevProjectionDelta.y, this.projectionDelta.y)), Gs(this.projectionDelta, this.layoutCorrected, A, this.latestValues), (this.treeScale.x !== S || this.treeScale.y !== T || !L0(this.projectionDelta.x, this.prevProjectionDelta.x) || !L0(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", A));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(f = !0) {
      var m;
      if ((m = this.options.visualElement) === null || m === void 0 || m.scheduleRender(), f) {
        const h = this.getStack();
        h && h.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Aa(), this.projectionDelta = Aa(), this.projectionDeltaWithTransform = Aa();
    }
    setAnimationOrigin(f, m = !1) {
      const h = this.snapshot, p = h ? h.latestValues : {}, v = { ...this.latestValues }, x = Aa();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !m;
      const S = Zt(), T = h ? h.source : void 0, A = this.layout ? this.layout.source : void 0, M = T !== A, z = this.getStack(), _ = !z || z.members.length <= 1, q = !!(M && !_ && this.options.crossfade === !0 && !this.path.some(fA));
      this.animationProgress = 0;
      let L;
      this.mixTargetDelta = (Q) => {
        const V = Q / 1e3;
        Y0(x.x, f.x, V), Y0(x.y, f.y, V), this.setTargetDelta(x), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Ys(S, this.layout.layoutBox, this.relativeParent.layout.layoutBox), cA(this.relativeTarget, this.relativeTargetOrigin, S, V), L && PT(this.relativeTarget, L) && (this.isProjectionDirty = !1), L || (L = Zt()), qe(L, this.relativeTarget)), M && (this.animationValues = v, GT(v, p, this.latestValues, V, q, _)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = V;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(f) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (Je(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Tt.update(() => {
        Cr.hasAnimatedSinceResize = !0, this.currentAnimation = kT(0, H0, {
          ...f,
          onUpdate: (m) => {
            this.mixTargetDelta(m), f.onUpdate && f.onUpdate(m);
          },
          onStop: () => {
          },
          onComplete: () => {
            f.onComplete && f.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const f = this.getStack();
      f && f.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(H0), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const f = this.getLead();
      let { targetWithTransforms: m, target: h, layout: p, latestValues: v } = f;
      if (!(!m || !h || !p)) {
        if (this !== f && this.layout && p && hv(this.options.animationType, this.layout.layoutBox, p.layoutBox)) {
          h = this.target || Zt();
          const x = ve(this.layout.layoutBox.x);
          h.x.min = f.target.x.min, h.x.max = h.x.min + x;
          const S = ve(this.layout.layoutBox.y);
          h.y.min = f.target.y.min, h.y.max = h.y.min + S;
        }
        qe(m, h), Ma(m, v), Gs(this.projectionDeltaWithTransform, this.layoutCorrected, m, v);
      }
    }
    registerSharedNode(f, m) {
      this.sharedNodes.has(f) || this.sharedNodes.set(f, new FT()), this.sharedNodes.get(f).add(m);
      const p = m.options.initialPromotionConfig;
      m.promote({
        transition: p ? p.transition : void 0,
        preserveFollowOpacity: p && p.shouldPreserveFollowOpacity ? p.shouldPreserveFollowOpacity(m) : void 0
      });
    }
    isLead() {
      const f = this.getStack();
      return f ? f.lead === this : !0;
    }
    getLead() {
      var f;
      const { layoutId: m } = this.options;
      return m ? ((f = this.getStack()) === null || f === void 0 ? void 0 : f.lead) || this : this;
    }
    getPrevLead() {
      var f;
      const { layoutId: m } = this.options;
      return m ? (f = this.getStack()) === null || f === void 0 ? void 0 : f.prevLead : void 0;
    }
    getStack() {
      const { layoutId: f } = this.options;
      if (f)
        return this.root.sharedNodes.get(f);
    }
    promote({ needsReset: f, transition: m, preserveFollowOpacity: h } = {}) {
      const p = this.getStack();
      p && p.promote(this, h), f && (this.projectionDelta = void 0, this.needsReset = !0), m && this.setOptions({ transition: m });
    }
    relegate() {
      const f = this.getStack();
      return f ? f.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: f } = this.options;
      if (!f)
        return;
      let m = !1;
      const { latestValues: h } = f;
      if ((h.z || h.rotate || h.rotateX || h.rotateY || h.rotateZ || h.skewX || h.skewY) && (m = !0), !m)
        return;
      const p = {};
      h.z && Tc("z", f, p, this.animationValues);
      for (let v = 0; v < wc.length; v++)
        Tc(`rotate${wc[v]}`, f, p, this.animationValues), Tc(`skew${wc[v]}`, f, p, this.animationValues);
      f.render();
      for (const v in p)
        f.setStaticValue(v, p[v]), this.animationValues && (this.animationValues[v] = p[v]);
      f.scheduleRender();
    }
    getProjectionStyles(f) {
      var m, h;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return $T;
      const p = {
        visibility: ""
      }, v = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, p.opacity = "", p.pointerEvents = Rr(f == null ? void 0 : f.pointerEvents) || "", p.transform = v ? v(this.latestValues, "") : "none", p;
      const x = this.getLead();
      if (!this.projectionDelta || !this.layout || !x.target) {
        const M = {};
        return this.options.layoutId && (M.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, M.pointerEvents = Rr(f == null ? void 0 : f.pointerEvents) || ""), this.hasProjected && !Di(this.latestValues) && (M.transform = v ? v({}, "") : "none", this.hasProjected = !1), M;
      }
      const S = x.animationValues || x.latestValues;
      this.applyTransformsToTarget(), p.transform = JT(this.projectionDeltaWithTransform, this.treeScale, S), v && (p.transform = v(S, p.transform));
      const { x: T, y: A } = this.projectionDelta;
      p.transformOrigin = `${T.origin * 100}% ${A.origin * 100}% 0`, x.animationValues ? p.opacity = x === this ? (h = (m = S.opacity) !== null && m !== void 0 ? m : this.latestValues.opacity) !== null && h !== void 0 ? h : 1 : this.preserveOpacity ? this.latestValues.opacity : S.opacityExit : p.opacity = x === this ? S.opacity !== void 0 ? S.opacity : "" : S.opacityExit !== void 0 ? S.opacityExit : 0;
      for (const M in Ps) {
        if (S[M] === void 0)
          continue;
        const { correct: z, applyTo: _, isCSSVariable: q } = Ps[M], L = p.transform === "none" ? S[M] : z(S[M], x);
        if (_) {
          const Q = _.length;
          for (let V = 0; V < Q; V++)
            p[_[V]] = L;
        } else
          q ? this.options.visualElement.renderState.vars[M] = L : p[M] = L;
      }
      return this.options.layoutId && (p.pointerEvents = x === this ? Rr(f == null ? void 0 : f.pointerEvents) || "" : "none"), p;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((f) => {
        var m;
        return (m = f.currentAnimation) === null || m === void 0 ? void 0 : m.stop();
      }), this.root.nodes.forEach(q0), this.root.sharedNodes.clear();
    }
  };
}
function IT(n) {
  n.updateLayout();
}
function tA(n) {
  var a;
  const l = ((a = n.resumeFrom) === null || a === void 0 ? void 0 : a.snapshot) || n.snapshot;
  if (n.isLead() && n.layout && l && n.hasListeners("didUpdate")) {
    const { layoutBox: r, measuredBox: u } = n.layout, { animationType: d } = n.options, f = l.source !== n.layout.source;
    d === "size" ? Ge((x) => {
      const S = f ? l.measuredBox[x] : l.layoutBox[x], T = ve(S);
      S.min = r[x].min, S.max = S.min + T;
    }) : hv(d, l.layoutBox, r) && Ge((x) => {
      const S = f ? l.measuredBox[x] : l.layoutBox[x], T = ve(r[x]);
      S.max = S.min + T, n.relativeTarget && !n.currentAnimation && (n.isProjectionDirty = !0, n.relativeTarget[x].max = n.relativeTarget[x].min + T);
    });
    const m = Aa();
    Gs(m, r, l.layoutBox);
    const h = Aa();
    f ? Gs(h, n.applyTransform(u, !0), l.measuredBox) : Gs(h, r, l.layoutBox);
    const p = !uv(m);
    let v = !1;
    if (!n.resumeFrom) {
      const x = n.getClosestProjectingParent();
      if (x && !x.resumeFrom) {
        const { snapshot: S, layout: T } = x;
        if (S && T) {
          const A = Zt();
          Ys(A, l.layoutBox, S.layoutBox);
          const M = Zt();
          Ys(M, r, T.layoutBox), cv(A, M) || (v = !0), x.options.layoutRoot && (n.relativeTarget = M, n.relativeTargetOrigin = A, n.relativeParent = x);
        }
      }
    }
    n.notifyListeners("didUpdate", {
      layout: r,
      snapshot: l,
      delta: h,
      layoutDelta: m,
      hasLayoutChanged: p,
      hasRelativeLayoutChanged: v
    });
  } else if (n.isLead()) {
    const { onExitComplete: r } = n.options;
    r && r();
  }
  n.options.transition = void 0;
}
function eA(n) {
  n.parent && (n.isProjecting() || (n.isProjectionDirty = n.parent.isProjectionDirty), n.isSharedProjectionDirty || (n.isSharedProjectionDirty = !!(n.isProjectionDirty || n.parent.isProjectionDirty || n.parent.isSharedProjectionDirty)), n.isTransformDirty || (n.isTransformDirty = n.parent.isTransformDirty));
}
function nA(n) {
  n.isProjectionDirty = n.isSharedProjectionDirty = n.isTransformDirty = !1;
}
function iA(n) {
  n.clearSnapshot();
}
function q0(n) {
  n.clearMeasurements();
}
function aA(n) {
  n.isLayoutDirty = !1;
}
function sA(n) {
  const { visualElement: a } = n.options;
  a && a.getProps().onBeforeLayoutMeasure && a.notify("BeforeLayoutMeasure"), n.resetTransform();
}
function G0(n) {
  n.finishAnimation(), n.targetDelta = n.relativeTarget = n.target = void 0, n.isProjectionDirty = !0;
}
function lA(n) {
  n.resolveTargetDelta();
}
function rA(n) {
  n.calcProjection();
}
function oA(n) {
  n.resetSkewAndRotation();
}
function uA(n) {
  n.removeLeadSnapshot();
}
function Y0(n, a, l) {
  n.translate = Lt(a.translate, 0, l), n.scale = Lt(a.scale, 1, l), n.origin = a.origin, n.originPoint = a.originPoint;
}
function X0(n, a, l, r) {
  n.min = Lt(a.min, l.min, r), n.max = Lt(a.max, l.max, r);
}
function cA(n, a, l, r) {
  X0(n.x, a.x, l.x, r), X0(n.y, a.y, l.y, r);
}
function fA(n) {
  return n.animationValues && n.animationValues.opacityExit !== void 0;
}
const dA = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Z0 = (n) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(n), K0 = Z0("applewebkit/") && !Z0("chrome/") ? Math.round : pe;
function Q0(n) {
  n.min = K0(n.min), n.max = K0(n.max);
}
function hA(n) {
  Q0(n.x), Q0(n.y);
}
function hv(n, a, l) {
  return n === "position" || n === "preserve-aspect" && !pT(U0(a), U0(l), 0.2);
}
function mA(n) {
  var a;
  return n !== n.root && ((a = n.scroll) === null || a === void 0 ? void 0 : a.wasRoot);
}
const pA = dv({
  attachResizeListener: (n, a) => Ws(n, "resize", a),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Ac = {
  current: void 0
}, mv = dv({
  measureScroll: (n) => ({
    x: n.scrollLeft,
    y: n.scrollTop
  }),
  defaultParent: () => {
    if (!Ac.current) {
      const n = new pA({});
      n.mount(window), n.setOptions({ layoutScroll: !0 }), Ac.current = n;
    }
    return Ac.current;
  },
  resetTransform: (n, a) => {
    n.style.transform = a !== void 0 ? a : "none";
  },
  checkIsScrollRoot: (n) => window.getComputedStyle(n).position === "fixed"
}), gA = {
  pan: {
    Feature: zT
  },
  drag: {
    Feature: NT,
    ProjectionNode: mv,
    MeasureLayout: lv
  }
};
function Bf(n, a, l) {
  var r;
  if (n instanceof EventTarget)
    return [n];
  if (typeof n == "string") {
    let u = document;
    const d = (r = void 0) !== null && r !== void 0 ? r : u.querySelectorAll(n);
    return d ? Array.from(d) : [];
  }
  return Array.from(n);
}
function pv(n, a) {
  const l = Bf(n), r = new AbortController(), u = {
    passive: !0,
    ...a,
    signal: r.signal
  };
  return [l, u, () => r.abort()];
}
function P0(n) {
  return !(n.pointerType === "touch" || Jy());
}
function yA(n, a, l = {}) {
  const [r, u, d] = pv(n, l), f = (m) => {
    if (!P0(m))
      return;
    const { target: h } = m, p = a(h, m);
    if (typeof p != "function" || !h)
      return;
    const v = (x) => {
      P0(x) && (p(x), h.removeEventListener("pointerleave", v));
    };
    h.addEventListener("pointerleave", v, u);
  };
  return r.forEach((m) => {
    m.addEventListener("pointerenter", f, u);
  }), d;
}
function F0(n, a, l) {
  const { props: r } = n;
  n.animationState && r.whileHover && n.animationState.setActive("whileHover", l === "Start");
  const u = "onHover" + l, d = r[u];
  d && Tt.postRender(() => d(a, sl(a)));
}
class vA extends ni {
  mount() {
    const { current: a } = this.node;
    a && (this.unmount = yA(a, (l, r) => (F0(this.node, r, "Start"), (u) => F0(this.node, u, "End"))));
  }
  unmount() {
  }
}
class bA extends ni {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let a = !1;
    try {
      a = this.node.current.matches(":focus-visible");
    } catch {
      a = !0;
    }
    !a || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = al(Ws(this.node.current, "focus", () => this.onFocus()), Ws(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const gv = (n, a) => a ? n === a ? !0 : gv(n, a.parentElement) : !1, xA = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function SA(n) {
  return xA.has(n.tagName) || n.tabIndex !== -1;
}
const Ls = /* @__PURE__ */ new WeakSet();
function J0(n) {
  return (a) => {
    a.key === "Enter" && n(a);
  };
}
function Ec(n, a) {
  n.dispatchEvent(new PointerEvent("pointer" + a, { isPrimary: !0, bubbles: !0 }));
}
const wA = (n, a) => {
  const l = n.currentTarget;
  if (!l)
    return;
  const r = J0(() => {
    if (Ls.has(l))
      return;
    Ec(l, "down");
    const u = J0(() => {
      Ec(l, "up");
    }), d = () => Ec(l, "cancel");
    l.addEventListener("keyup", u, a), l.addEventListener("blur", d, a);
  });
  l.addEventListener("keydown", r, a), l.addEventListener("blur", () => l.removeEventListener("keydown", r), a);
};
function $0(n) {
  return kf(n) && !Jy();
}
function TA(n, a, l = {}) {
  const [r, u, d] = pv(n, l), f = (m) => {
    const h = m.currentTarget;
    if (!$0(m) || Ls.has(h))
      return;
    Ls.add(h);
    const p = a(h, m), v = (T, A) => {
      window.removeEventListener("pointerup", x), window.removeEventListener("pointercancel", S), !(!$0(T) || !Ls.has(h)) && (Ls.delete(h), typeof p == "function" && p(T, { success: A }));
    }, x = (T) => {
      v(T, h === window || h === document || l.useGlobalTarget || gv(h, T.target));
    }, S = (T) => {
      v(T, !1);
    };
    window.addEventListener("pointerup", x, u), window.addEventListener("pointercancel", S, u);
  };
  return r.forEach((m) => {
    (l.useGlobalTarget ? window : m).addEventListener("pointerdown", f, u), m instanceof HTMLElement && (m.addEventListener("focus", (p) => wA(p, u)), !SA(m) && m.tabIndex === null && (m.tabIndex = 0));
  }), d;
}
function W0(n, a, l) {
  const { props: r } = n;
  if (n.current instanceof HTMLButtonElement && n.current.disabled)
    return;
  n.animationState && r.whileTap && n.animationState.setActive("whileTap", l === "Start");
  const u = "onTap" + (l === "End" ? "" : l), d = r[u];
  d && Tt.postRender(() => d(a, sl(a)));
}
class AA extends ni {
  mount() {
    const { current: a } = this.node;
    a && (this.unmount = TA(a, (l, r) => (W0(this.node, r, "Start"), (u, { success: d }) => W0(this.node, u, d ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Jc = /* @__PURE__ */ new WeakMap(), Mc = /* @__PURE__ */ new WeakMap(), EA = (n) => {
  const a = Jc.get(n.target);
  a && a(n);
}, MA = (n) => {
  n.forEach(EA);
};
function jA({ root: n, ...a }) {
  const l = n || document;
  Mc.has(l) || Mc.set(l, {});
  const r = Mc.get(l), u = JSON.stringify(a);
  return r[u] || (r[u] = new IntersectionObserver(MA, { root: n, ...a })), r[u];
}
function RA(n, a, l) {
  const r = jA(a);
  return Jc.set(n, l), r.observe(n), () => {
    Jc.delete(n), r.unobserve(n);
  };
}
const DA = {
  some: 0,
  all: 1
};
class CA extends ni {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: a = {} } = this.node.getProps(), { root: l, margin: r, amount: u = "some", once: d } = a, f = {
      root: l ? l.current : void 0,
      rootMargin: r,
      threshold: typeof u == "number" ? u : DA[u]
    }, m = (h) => {
      const { isIntersecting: p } = h;
      if (this.isInView === p || (this.isInView = p, d && !p && this.hasEnteredView))
        return;
      p && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", p);
      const { onViewportEnter: v, onViewportLeave: x } = this.node.getProps(), S = p ? v : x;
      S && S(h);
    };
    return RA(this.node.current, f, m);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: a, prevProps: l } = this.node;
    ["amount", "margin", "root"].some(NA(a, l)) && this.startObserver();
  }
  unmount() {
  }
}
function NA({ viewport: n = {} }, { viewport: a = {} } = {}) {
  return (l) => n[l] !== a[l];
}
const zA = {
  inView: {
    Feature: CA
  },
  tap: {
    Feature: AA
  },
  focus: {
    Feature: bA
  },
  hover: {
    Feature: vA
  }
}, _A = {
  layout: {
    ProjectionNode: mv,
    MeasureLayout: lv
  }
}, qr = { current: null }, Uf = { current: !1 };
function yv() {
  if (Uf.current = !0, !!lf)
    if (window.matchMedia) {
      const n = window.matchMedia("(prefers-reduced-motion)"), a = () => qr.current = n.matches;
      n.addListener(a), a();
    } else
      qr.current = !1;
}
const OA = [...Vy, me, ei], VA = (n) => OA.find(Oy(n)), kA = /* @__PURE__ */ new WeakMap();
function BA(n, a, l) {
  for (const r in a) {
    const u = a[r], d = l[r];
    if ($t(u))
      n.addValue(r, u);
    else if ($t(d))
      n.addValue(r, sn(u, { owner: n }));
    else if (d !== u)
      if (n.hasValue(r)) {
        const f = n.getValue(r);
        f.liveStyle === !0 ? f.jump(u) : f.hasAnimated || f.set(u);
      } else {
        const f = n.getStaticValue(r);
        n.addValue(r, sn(f !== void 0 ? f : u, { owner: n }));
      }
  }
  for (const r in l)
    a[r] === void 0 && n.removeValue(r);
  return a;
}
const I0 = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class UA {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(a, l, r) {
    return {};
  }
  constructor({ parent: a, props: l, presenceContext: r, reducedMotionConfig: u, blockInitialAnimation: d, visualState: f }, m = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = _f, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const T = rn.now();
      this.renderScheduledAt < T && (this.renderScheduledAt = T, Tt.render(this.render, !1, !0));
    };
    const { latestValues: h, renderState: p, onUpdate: v } = f;
    this.onUpdate = v, this.latestValues = h, this.baseTarget = { ...h }, this.initialValues = l.initial ? { ...h } : {}, this.renderState = p, this.parent = a, this.props = l, this.presenceContext = r, this.depth = a ? a.depth + 1 : 0, this.reducedMotionConfig = u, this.options = m, this.blockInitialAnimation = !!d, this.isControllingVariants = Qr(l), this.isVariantNode = Qg(l), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(a && a.current);
    const { willChange: x, ...S } = this.scrapeMotionValuesFromProps(l, {}, this);
    for (const T in S) {
      const A = S[T];
      h[T] !== void 0 && $t(A) && A.set(h[T], !1);
    }
  }
  mount(a) {
    this.current = a, kA.set(a, this), this.projection && !this.projection.instance && this.projection.mount(a), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((l, r) => this.bindToMotionValue(r, l)), Uf.current || yv(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : qr.current, this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), Je(this.notifyUpdate), Je(this.render), this.valueSubscriptions.forEach((a) => a()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const a in this.events)
      this.events[a].clear();
    for (const a in this.features) {
      const l = this.features[a];
      l && (l.unmount(), l.isMounted = !1);
    }
    this.current = null;
  }
  bindToMotionValue(a, l) {
    this.valueSubscriptions.has(a) && this.valueSubscriptions.get(a)();
    const r = Vi.has(a);
    r && this.onBindTransform && this.onBindTransform();
    const u = l.on("change", (m) => {
      this.latestValues[a] = m, this.props.onUpdate && Tt.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = !0);
    }), d = l.on("renderRequest", this.scheduleRender);
    let f;
    window.MotionCheckAppearSync && (f = window.MotionCheckAppearSync(this, a, l)), this.valueSubscriptions.set(a, () => {
      u(), d(), f && f(), l.owner && l.stop();
    });
  }
  sortNodePosition(a) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== a.type ? 0 : this.sortInstanceNodePosition(this.current, a.current);
  }
  updateFeatures() {
    let a = "animation";
    for (a in ja) {
      const l = ja[a];
      if (!l)
        continue;
      const { isEnabled: r, Feature: u } = l;
      if (!this.features[a] && u && r(this.props) && (this.features[a] = new u(this)), this.features[a]) {
        const d = this.features[a];
        d.isMounted ? d.update() : (d.mount(), d.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Zt();
  }
  getStaticValue(a) {
    return this.latestValues[a];
  }
  setStaticValue(a, l) {
    this.latestValues[a] = l;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(a, l) {
    (a.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = a, this.prevPresenceContext = this.presenceContext, this.presenceContext = l;
    for (let r = 0; r < I0.length; r++) {
      const u = I0[r];
      this.propEventSubscriptions[u] && (this.propEventSubscriptions[u](), delete this.propEventSubscriptions[u]);
      const d = "on" + u, f = a[d];
      f && (this.propEventSubscriptions[u] = this.on(u, f));
    }
    this.prevMotionValues = BA(this, this.scrapeMotionValuesFromProps(a, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(a) {
    return this.props.variants ? this.props.variants[a] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(a) {
    const l = this.getClosestVariantNode();
    if (l)
      return l.variantChildren && l.variantChildren.add(a), () => l.variantChildren.delete(a);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(a, l) {
    const r = this.values.get(a);
    l !== r && (r && this.removeValue(a), this.bindToMotionValue(a, l), this.values.set(a, l), this.latestValues[a] = l.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(a) {
    this.values.delete(a);
    const l = this.valueSubscriptions.get(a);
    l && (l(), this.valueSubscriptions.delete(a)), delete this.latestValues[a], this.removeValueFromRenderState(a, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(a) {
    return this.values.has(a);
  }
  getValue(a, l) {
    if (this.props.values && this.props.values[a])
      return this.props.values[a];
    let r = this.values.get(a);
    return r === void 0 && l !== void 0 && (r = sn(l === null ? void 0 : l, { owner: this }), this.addValue(a, r)), r;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(a, l) {
    var r;
    let u = this.latestValues[a] !== void 0 || !this.current ? this.latestValues[a] : (r = this.getBaseTargetFromProps(this.props, a)) !== null && r !== void 0 ? r : this.readValueFromInstance(this.current, a, this.options);
    return u != null && (typeof u == "string" && (zy(u) || wy(u)) ? u = parseFloat(u) : !VA(u) && ei.test(l) && (u = Dy(a, l)), this.setBaseTarget(a, $t(u) ? u.get() : u)), $t(u) ? u.get() : u;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(a, l) {
    this.baseTarget[a] = l;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(a) {
    var l;
    const { initial: r } = this.props;
    let u;
    if (typeof r == "string" || typeof r == "object") {
      const f = bf(this.props, r, (l = this.presenceContext) === null || l === void 0 ? void 0 : l.custom);
      f && (u = f[a]);
    }
    if (r && u !== void 0)
      return u;
    const d = this.getBaseTargetFromProps(this.props, a);
    return d !== void 0 && !$t(d) ? d : this.initialValues[a] !== void 0 && u === void 0 ? void 0 : this.baseTarget[a];
  }
  on(a, l) {
    return this.events[a] || (this.events[a] = new Af()), this.events[a].add(l);
  }
  notify(a, ...l) {
    this.events[a] && this.events[a].notify(...l);
  }
}
class vv extends UA {
  constructor() {
    super(...arguments), this.KeyframeResolver = ky;
  }
  sortInstanceNodePosition(a, l) {
    return a.compareDocumentPosition(l) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(a, l) {
    return a.style ? a.style[l] : void 0;
  }
  removeValueFromRenderState(a, { vars: l, style: r }) {
    delete l[a], delete r[a];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: a } = this.props;
    $t(a) && (this.childSubscription = a.on("change", (l) => {
      this.current && (this.current.textContent = `${l}`);
    }));
  }
}
function LA(n) {
  return window.getComputedStyle(n);
}
class HA extends vv {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = ay;
  }
  readValueFromInstance(a, l) {
    if (Vi.has(l))
      return QS(a, l);
    {
      const r = LA(a), u = (ff(l) ? r.getPropertyValue(l) : r[l]) || 0;
      return typeof u == "string" ? u.trim() : u;
    }
  }
  measureInstanceViewportBox(a, { transformPagePoint: l }) {
    return nv(a, l);
  }
  build(a, l, r) {
    mf(a, l, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(a, l, r) {
    return xf(a, l, r);
  }
}
class qA extends vv {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Zt, this.updateDimensions = () => {
      this.current && !this.renderState.dimensions && iy(this.current, this.renderState);
    };
  }
  getBaseTargetFromProps(a, l) {
    return a[l];
  }
  readValueFromInstance(a, l) {
    if (Vi.has(l)) {
      const r = Ry(l);
      return r && r.default || 0;
    }
    return l = sy.has(l) ? l : cf(l), a.getAttribute(l);
  }
  scrapeMotionValuesFromProps(a, l, r) {
    return ry(a, l, r);
  }
  onBindTransform() {
    this.current && !this.renderState.dimensions && Tt.postRender(this.updateDimensions);
  }
  build(a, l, r) {
    yf(a, l, this.isSVGTag, r.transformTemplate);
  }
  renderInstance(a, l, r, u) {
    ly(a, l, r, u);
  }
  mount(a) {
    this.isSVGTag = vf(a.tagName), super.mount(a);
  }
}
const GA = (n, a) => gf(n) ? new qA(a) : new HA(a, {
  allowProjection: n !== C.Fragment
}), YA = /* @__PURE__ */ hS({
  ...lT,
  ...zA,
  ...gA,
  ..._A
}, GA), gt = /* @__PURE__ */ D2(YA);
function bv(n, a) {
  let l;
  const r = () => {
    const { currentTime: u } = a, f = (u === null ? 0 : u.value) / 100;
    l !== f && n(f), l = f;
  };
  return Tt.update(r, !0), () => Je(r);
}
const Nr = /* @__PURE__ */ new WeakMap();
let ti;
function XA(n, a) {
  if (a) {
    const { inlineSize: l, blockSize: r } = a[0];
    return { width: l, height: r };
  } else return n instanceof SVGElement && "getBBox" in n ? n.getBBox() : {
    width: n.offsetWidth,
    height: n.offsetHeight
  };
}
function ZA({ target: n, contentRect: a, borderBoxSize: l }) {
  var r;
  (r = Nr.get(n)) === null || r === void 0 || r.forEach((u) => {
    u({
      target: n,
      contentSize: a,
      get size() {
        return XA(n, l);
      }
    });
  });
}
function KA(n) {
  n.forEach(ZA);
}
function QA() {
  typeof ResizeObserver > "u" || (ti = new ResizeObserver(KA));
}
function PA(n, a) {
  ti || QA();
  const l = Bf(n);
  return l.forEach((r) => {
    let u = Nr.get(r);
    u || (u = /* @__PURE__ */ new Set(), Nr.set(r, u)), u.add(a), ti == null || ti.observe(r);
  }), () => {
    l.forEach((r) => {
      const u = Nr.get(r);
      u == null || u.delete(a), u != null && u.size || ti == null || ti.unobserve(r);
    });
  };
}
const zr = /* @__PURE__ */ new Set();
let Xs;
function FA() {
  Xs = () => {
    const n = {
      width: window.innerWidth,
      height: window.innerHeight
    }, a = {
      target: window,
      size: n,
      contentSize: n
    };
    zr.forEach((l) => l(a));
  }, window.addEventListener("resize", Xs);
}
function JA(n) {
  return zr.add(n), Xs || FA(), () => {
    zr.delete(n), !zr.size && Xs && (Xs = void 0);
  };
}
function $A(n, a) {
  return typeof n == "function" ? JA(n) : PA(n, a);
}
const WA = 50, tg = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0
}), IA = () => ({
  time: 0,
  x: tg(),
  y: tg()
}), tE = {
  x: {
    length: "Width",
    position: "Left"
  },
  y: {
    length: "Height",
    position: "Top"
  }
};
function eg(n, a, l, r) {
  const u = l[a], { length: d, position: f } = tE[a], m = u.current, h = l.time;
  u.current = n[`scroll${f}`], u.scrollLength = n[`scroll${d}`] - n[`client${d}`], u.offset.length = 0, u.offset[0] = 0, u.offset[1] = u.scrollLength, u.progress = /* @__PURE__ */ Oi(0, u.scrollLength, u.current);
  const p = r - h;
  u.velocity = p > WA ? 0 : Ef(u.current - m, p);
}
function eE(n, a, l) {
  eg(n, "x", a, l), eg(n, "y", a, l), a.time = l;
}
function nE(n, a) {
  const l = { x: 0, y: 0 };
  let r = n;
  for (; r && r !== a; )
    if (r instanceof HTMLElement)
      l.x += r.offsetLeft, l.y += r.offsetTop, r = r.offsetParent;
    else if (r.tagName === "svg") {
      const u = r.getBoundingClientRect();
      r = r.parentElement;
      const d = r.getBoundingClientRect();
      l.x += u.left - d.left, l.y += u.top - d.top;
    } else if (r instanceof SVGGraphicsElement) {
      const { x: u, y: d } = r.getBBox();
      l.x += u, l.y += d;
      let f = null, m = r.parentNode;
      for (; !f; )
        m.tagName === "svg" && (f = m), m = r.parentNode;
      r = f;
    } else
      break;
  return l;
}
const $c = {
  start: 0,
  center: 0.5,
  end: 1
};
function ng(n, a, l = 0) {
  let r = 0;
  if (n in $c && (n = $c[n]), typeof n == "string") {
    const u = parseFloat(n);
    n.endsWith("px") ? r = u : n.endsWith("%") ? n = u / 100 : n.endsWith("vw") ? r = u / 100 * document.documentElement.clientWidth : n.endsWith("vh") ? r = u / 100 * document.documentElement.clientHeight : n = u;
  }
  return typeof n == "number" && (r = a * n), l + r;
}
const iE = [0, 0];
function aE(n, a, l, r) {
  let u = Array.isArray(n) ? n : iE, d = 0, f = 0;
  return typeof n == "number" ? u = [n, n] : typeof n == "string" && (n = n.trim(), n.includes(" ") ? u = n.split(" ") : u = [n, $c[n] ? n : "0"]), d = ng(u[0], l, r), f = ng(u[1], a), d - f;
}
const sE = {
  All: [
    [0, 0],
    [1, 1]
  ]
}, lE = { x: 0, y: 0 };
function rE(n) {
  return "getBBox" in n && n.tagName !== "svg" ? n.getBBox() : { width: n.clientWidth, height: n.clientHeight };
}
function oE(n, a, l) {
  const { offset: r = sE.All } = l, { target: u = n, axis: d = "y" } = l, f = d === "y" ? "height" : "width", m = u !== n ? nE(u, n) : lE, h = u === n ? { width: n.scrollWidth, height: n.scrollHeight } : rE(u), p = {
    width: n.clientWidth,
    height: n.clientHeight
  };
  a[d].offset.length = 0;
  let v = !a[d].interpolate;
  const x = r.length;
  for (let S = 0; S < x; S++) {
    const T = aE(r[S], p[f], h[f], m[d]);
    !v && T !== a[d].interpolatorOffsets[S] && (v = !0), a[d].offset[S] = T;
  }
  v && (a[d].interpolate = Xy(a[d].offset, Zy(r), { clamp: !1 }), a[d].interpolatorOffsets = [...a[d].offset]), a[d].progress = on(0, 1, a[d].interpolate(a[d].current));
}
function uE(n, a = n, l) {
  if (l.x.targetOffset = 0, l.y.targetOffset = 0, a !== n) {
    let r = a;
    for (; r && r !== n; )
      l.x.targetOffset += r.offsetLeft, l.y.targetOffset += r.offsetTop, r = r.offsetParent;
  }
  l.x.targetLength = a === n ? a.scrollWidth : a.clientWidth, l.y.targetLength = a === n ? a.scrollHeight : a.clientHeight, l.x.containerLength = n.clientWidth, l.y.containerLength = n.clientHeight;
}
function cE(n, a, l, r = {}) {
  return {
    measure: () => uE(n, r.target, l),
    update: (u) => {
      eE(n, l, u), (r.offset || r.target) && oE(n, l, r);
    },
    notify: () => a(l)
  };
}
const ks = /* @__PURE__ */ new WeakMap(), ig = /* @__PURE__ */ new WeakMap(), jc = /* @__PURE__ */ new WeakMap(), ag = (n) => n === document.documentElement ? window : n;
function Lf(n, { container: a = document.documentElement, ...l } = {}) {
  let r = jc.get(a);
  r || (r = /* @__PURE__ */ new Set(), jc.set(a, r));
  const u = IA(), d = cE(a, n, u, l);
  if (r.add(d), !ks.has(a)) {
    const m = () => {
      for (const S of r)
        S.measure();
    }, h = () => {
      for (const S of r)
        S.update(re.timestamp);
    }, p = () => {
      for (const S of r)
        S.notify();
    }, v = () => {
      Tt.read(m, !1, !0), Tt.read(h, !1, !0), Tt.update(p, !1, !0);
    };
    ks.set(a, v);
    const x = ag(a);
    window.addEventListener("resize", v, { passive: !0 }), a !== document.documentElement && ig.set(a, $A(a, v)), x.addEventListener("scroll", v, { passive: !0 });
  }
  const f = ks.get(a);
  return Tt.read(f, !1, !0), () => {
    var m;
    Je(f);
    const h = jc.get(a);
    if (!h || (h.delete(d), h.size))
      return;
    const p = ks.get(a);
    ks.delete(a), p && (ag(a).removeEventListener("scroll", p), (m = ig.get(a)) === null || m === void 0 || m(), window.removeEventListener("resize", p));
  };
}
function fE({ source: n, container: a, axis: l = "y" }) {
  n && (a = n);
  const r = { value: 0 }, u = Lf((d) => {
    r.value = d[l].progress * 100;
  }, { container: a, axis: l });
  return { currentTime: r, cancel: u };
}
const Rc = /* @__PURE__ */ new Map();
function xv({ source: n, container: a = document.documentElement, axis: l = "y" } = {}) {
  n && (a = n), Rc.has(a) || Rc.set(a, {});
  const r = Rc.get(a);
  return r[l] || (r[l] = cy() ? new ScrollTimeline({ source: a, axis: l }) : fE({ source: a, axis: l })), r[l];
}
function dE(n) {
  return n.length === 2;
}
function Sv(n) {
  return n && (n.target || n.offset);
}
function hE(n, a) {
  return dE(n) || Sv(a) ? Lf((l) => {
    n(l[a.axis].progress, l);
  }, a) : bv(n, xv(a));
}
function mE(n, a) {
  if (n.flatten(), Sv(a))
    return n.pause(), Lf((l) => {
      n.time = n.duration * l[a.axis].progress;
    }, a);
  {
    const l = xv(a);
    return n.attachTimeline ? n.attachTimeline(l, (r) => (r.pause(), bv((u) => {
      r.time = r.duration * u;
    }, l))) : pe;
  }
}
function pE(n, { axis: a = "y", ...l } = {}) {
  const r = { axis: a, ...l };
  return typeof n == "function" ? hE(n, r) : mE(n, r);
}
function sg(n, a) {
  S2(!!(!a || a.current));
}
const gE = () => ({
  scrollX: sn(0),
  scrollY: sn(0),
  scrollXProgress: sn(0),
  scrollYProgress: sn(0)
});
function yE({ container: n, target: a, layoutEffect: l = !0, ...r } = {}) {
  const u = _i(gE);
  return (l ? tl : C.useEffect)(() => (sg("target", a), sg("container", n), pE((f, { x: m, y: h }) => {
    u.scrollX.set(m.current), u.scrollXProgress.set(m.progress), u.scrollY.set(h.current), u.scrollYProgress.set(h.progress);
  }, {
    ...r,
    container: (n == null ? void 0 : n.current) || void 0,
    target: (a == null ? void 0 : a.current) || void 0
  })), [n, a, JSON.stringify(r.offset)]), u;
}
function Is(n) {
  const a = _i(() => sn(n)), { isStatic: l } = C.useContext(el);
  if (l) {
    const [, r] = C.useState(n);
    C.useEffect(() => a.on("change", r), []);
  }
  return a;
}
function vE(n, a) {
  const l = Is(a()), r = () => l.set(a());
  return r(), tl(() => {
    const u = () => Tt.preRender(r, !1, !0), d = n.map((f) => f.on("change", u));
    return () => {
      d.forEach((f) => f()), Je(r);
    };
  }), l;
}
function lg(n, ...a) {
  const l = n.length;
  function r() {
    let u = "";
    for (let d = 0; d < l; d++) {
      u += n[d];
      const f = a[d];
      f && (u += $t(f) ? f.get() : f);
    }
    return u;
  }
  return vE(a.filter($t), r);
}
function _r(n, a = {}) {
  const { isStatic: l } = C.useContext(el), r = C.useRef(null), u = _i(() => $t(n) ? n.get() : n), d = _i(() => typeof u == "string" ? u.replace(/[\d.-]/g, "") : void 0), f = Is(u), m = C.useRef(u), h = C.useRef(pe), p = () => {
    v(), r.current = _w({
      keyframes: [og(f.get()), og(m.current)],
      velocity: f.getVelocity(),
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...a,
      onUpdate: h.current
    });
  }, v = () => {
    r.current && r.current.stop();
  };
  return C.useInsertionEffect(() => f.attach((x, S) => l ? S(x) : (m.current = x, h.current = (T) => S(rg(T, d)), Tt.postRender(p), f.get()), v), [JSON.stringify(a)]), tl(() => {
    if ($t(n))
      return n.on("change", (x) => f.set(rg(x, d)));
  }, [f, d]), f;
}
function rg(n, a) {
  return a ? n + a : n;
}
function og(n) {
  return typeof n == "number" ? n : parseFloat(n);
}
function bE() {
  !Uf.current && yv();
  const [n] = C.useState(qr.current);
  return n;
}
const xE = {
  some: 0,
  all: 1
};
function SE(n, a, { root: l, margin: r, amount: u = "some" } = {}) {
  const d = Bf(n), f = /* @__PURE__ */ new WeakMap(), m = (p) => {
    p.forEach((v) => {
      const x = f.get(v.target);
      if (v.isIntersecting !== !!x)
        if (v.isIntersecting) {
          const S = a(v.target, v);
          typeof S == "function" ? f.set(v.target, S) : h.unobserve(v.target);
        } else typeof x == "function" && (x(v), f.delete(v.target));
    });
  }, h = new IntersectionObserver(m, {
    root: l,
    rootMargin: r,
    threshold: typeof u == "number" ? u : xE[u]
  });
  return d.forEach((p) => h.observe(p)), () => h.disconnect();
}
function Oa(n, { root: a, margin: l, amount: r, once: u = !1, initial: d = !1 } = {}) {
  const [f, m] = C.useState(d);
  return C.useEffect(() => {
    if (!n.current || u && f)
      return;
    const h = () => (m(!0), u ? void 0 : () => m(!1)), p = {
      root: a && a.current || void 0,
      margin: l,
      amount: r
    };
    return SE(n.current, h, p);
  }, [a, n, l, u, r]), f;
}
const ug = (n) => typeof n == "function" ? void 0 : n.filter;
function wt({
  children: n,
  className: a,
  variant: l,
  duration: r = 0.4,
  delay: u = 0,
  offset: d = 6,
  direction: f = "down",
  inView: m = !1,
  inViewMargin: h = "-50px",
  blur: p = "6px",
  ...v
}) {
  const x = C.useRef(null), S = Oa(x, { once: !0, margin: h }), T = !m || S, A = {
    hidden: {
      [f === "left" || f === "right" ? "x" : "y"]: f === "right" || f === "down" ? -d : d,
      opacity: 0,
      filter: `blur(${p})`
    },
    visible: {
      [f === "left" || f === "right" ? "x" : "y"]: 0,
      opacity: 1,
      filter: "blur(0px)"
    }
  }, M = l ?? A, z = ug(M.hidden), _ = ug(M.visible), q = z != null && _ != null && z !== _;
  return /* @__PURE__ */ y.jsx(Xr, { children: /* @__PURE__ */ y.jsx(
    gt.div,
    {
      ref: x,
      initial: "hidden",
      animate: T ? "visible" : "hidden",
      exit: "hidden",
      variants: M,
      transition: {
        delay: 0.04 + u,
        duration: r,
        ease: "easeOut",
        ...q ? { filter: { duration: r } } : {}
      },
      className: a,
      ...v,
      children: n
    }
  ) });
}
const wE = {
  article: gt.article,
  div: gt.div,
  h1: gt.h1,
  h2: gt.h2,
  h3: gt.h3,
  h4: gt.h4,
  h5: gt.h5,
  h6: gt.h6,
  li: gt.li,
  p: gt.p,
  section: gt.section,
  span: gt.span
}, TE = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06
}, Qe = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}, AE = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
}, Er = {
  fadeIn: {
    container: Qe,
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3
        }
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 }
      }
    }
  },
  blurIn: {
    container: Qe,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.3
        }
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        transition: { duration: 0.3 }
      }
    }
  },
  blurInUp: {
    container: Qe,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 }
        }
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 }
        }
      }
    }
  },
  blurInDown: {
    container: Qe,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 }
        }
      }
    }
  },
  slideUp: {
    container: Qe,
    item: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.3
        }
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.3
        }
      }
    }
  },
  slideDown: {
    container: Qe,
    item: {
      hidden: { y: -20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      },
      exit: {
        y: 20,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  slideLeft: {
    container: Qe,
    item: {
      hidden: { x: 20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      },
      exit: {
        x: -20,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  slideRight: {
    container: Qe,
    item: {
      hidden: { x: -20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      },
      exit: {
        x: 20,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  scaleUp: {
    container: Qe,
    item: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300
          }
        }
      },
      exit: {
        scale: 0.5,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  },
  scaleDown: {
    container: Qe,
    item: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300
          }
        }
      },
      exit: {
        scale: 1.5,
        opacity: 0,
        transition: { duration: 0.3 }
      }
    }
  }
}, EE = ({
  children: n,
  delay: a = 0,
  duration: l = 0.3,
  variants: r,
  className: u,
  segmentClassName: d,
  as: f = "p",
  startOnView: m = !0,
  once: h = !1,
  by: p = "word",
  animation: v = "fadeIn",
  accessible: x = !0,
  ...S
}) => {
  const T = wE[f];
  let A = [];
  switch (p) {
    case "word":
      A = n.split(/(\s+)/);
      break;
    case "character":
      A = n.split("");
      break;
    case "line":
      A = n.split(`
`);
      break;
    case "text":
    default:
      A = [n];
      break;
  }
  const M = r ? {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          opacity: { duration: 0.01, delay: a },
          delayChildren: a,
          staggerChildren: l / A.length
        }
      },
      exit: {
        opacity: 0,
        transition: {
          staggerChildren: l / A.length,
          staggerDirection: -1
        }
      }
    },
    item: r
  } : v ? {
    container: {
      ...Er[v].container,
      show: {
        ...Er[v].container.show,
        transition: {
          delayChildren: a,
          staggerChildren: l / A.length
        }
      },
      exit: {
        ...Er[v].container.exit,
        transition: {
          staggerChildren: l / A.length,
          staggerDirection: -1
        }
      }
    },
    item: Er[v].item
  } : { container: Qe, item: AE };
  return /* @__PURE__ */ y.jsx(Xr, { mode: "popLayout", children: /* @__PURE__ */ y.jsxs(
    T,
    {
      variants: M.container,
      initial: "hidden",
      whileInView: m ? "show" : void 0,
      animate: m ? void 0 : "show",
      exit: "exit",
      className: ft("whitespace-pre-wrap", u),
      viewport: { once: h },
      "aria-label": x ? n : void 0,
      ...S,
      children: [
        x && /* @__PURE__ */ y.jsx("span", { className: "sr-only", children: n }),
        A.map((z, _) => /* @__PURE__ */ y.jsx(
          gt.span,
          {
            variants: M.item,
            custom: _ * TE[p],
            className: ft(
              p === "line" ? "block" : "inline-block whitespace-pre",
              p === "character" && "",
              d
            ),
            "aria-hidden": x ? !0 : void 0,
            children: z
          },
          `${p}-${z}-${_}`
        ))
      ]
    }
  ) });
}, ME = C.memo(EE), Hf = Zs.forwardRef(
  ({
    shimmerColor: n = "#ffffff",
    shimmerSize: a = "0.05em",
    shimmerDuration: l = "3s",
    borderRadius: r = "100px",
    background: u = "rgba(0, 0, 0, 1)",
    className: d,
    children: f,
    ...m
  }, h) => /* @__PURE__ */ y.jsxs(
    "button",
    {
      style: {
        "--spread": "90deg",
        "--shimmer-color": n,
        "--radius": r,
        "--speed": l,
        "--cut": a,
        "--bg": u
      },
      className: ft(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)]",
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        d
      ),
      ref: h,
      ...m,
      children: [
        /* @__PURE__ */ y.jsx(
          "div",
          {
            className: ft(
              "-z-30 blur-[2px]",
              "@container-[size] absolute inset-0 overflow-visible"
            ),
            children: /* @__PURE__ */ y.jsx("div", { className: "animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]", children: /* @__PURE__ */ y.jsx("div", { className: "animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" }) })
          }
        ),
        f,
        /* @__PURE__ */ y.jsx(
          "div",
          {
            className: ft(
              "absolute inset-0 size-full",
              "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
              // transition
              "transform-gpu transition-all duration-300 ease-in-out",
              // on hover
              "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
              // on click
              "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
            )
          }
        ),
        /* @__PURE__ */ y.jsx(
          "div",
          {
            className: ft(
              "absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
            )
          }
        )
      ]
    }
  )
);
Hf.displayName = "ShimmerButton";
const jE = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 }
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  }
};
function RE({
  animationStyle: n = "from-center",
  videoSrc: a,
  thumbnailSrc: l,
  thumbnailAlt: r = "Video thumbnail",
  className: u
}) {
  const [d, f] = C.useState(!1), m = jE[n];
  return /* @__PURE__ */ y.jsxs("div", { className: ft("relative", u), children: [
    /* @__PURE__ */ y.jsxs(
      "button",
      {
        type: "button",
        "aria-label": "Play video",
        className: "group relative cursor-pointer border-0 bg-transparent p-0",
        onClick: () => f(!0),
        children: [
          /* @__PURE__ */ y.jsx(
            "img",
            {
              src: l,
              alt: r,
              width: 1920,
              height: 1080,
              className: "w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
            }
          ),
          /* @__PURE__ */ y.jsx("div", { className: "absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100", children: /* @__PURE__ */ y.jsx("div", { className: "bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md", children: /* @__PURE__ */ y.jsx(
            "div",
            {
              className: "from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-linear-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]",
              children: /* @__PURE__ */ y.jsx(
                M1,
                {
                  className: "size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105",
                  style: {
                    filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
                  }
                }
              )
            }
          ) }) })
        ]
      }
    ),
    /* @__PURE__ */ y.jsx(Xr, { children: d && /* @__PURE__ */ y.jsx(
      gt.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        role: "button",
        tabIndex: 0,
        onKeyDown: (h) => {
          (h.key === "Escape" || h.key === "Enter" || h.key === " ") && f(!1);
        },
        onClick: () => f(!1),
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md",
        children: /* @__PURE__ */ y.jsxs(
          gt.div,
          {
            ...m,
            transition: { type: "spring", damping: 30, stiffness: 300 },
            className: "relative mx-4 aspect-video w-full max-w-4xl md:mx-0",
            children: [
              /* @__PURE__ */ y.jsx(gt.button, { className: "absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black", children: /* @__PURE__ */ y.jsx(D1, { className: "size-5" }) }),
              /* @__PURE__ */ y.jsx("div", { className: "relative isolate z-1 size-full overflow-hidden rounded-2xl border-2 border-white", children: /* @__PURE__ */ y.jsx(
                "video",
                {
                  src: a,
                  title: "RuleLab demo video",
                  className: "mt-0 size-full rounded-2xl bg-black",
                  controls: !0,
                  autoPlay: !0,
                  playsInline: !0
                }
              ) })
            ]
          }
        )
      }
    ) })
  ] });
}
const wv = "http://www.w3.org/2000/svg";
class DE {
  constructor(a) {
    this.seed = a;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
}
function Pe(n, a, l, r, u) {
  return { type: "path", ops: Gr(n, a, l, r, u) };
}
function Tv(n, a, l) {
  const r = (n || []).length;
  if (r > 2) {
    const u = [];
    for (let d = 0; d < r - 1; d++) u.push(...Gr(n[d][0], n[d][1], n[d + 1][0], n[d + 1][1], l));
    return a && u.push(...Gr(n[r - 1][0], n[r - 1][1], n[0][0], n[0][1], l)), { type: "path", ops: u };
  }
  return r === 2 ? Pe(n[0][0], n[0][1], n[1][0], n[1][1], l) : { type: "path", ops: [] };
}
function CE(n, a, l, r, u) {
  return function(d, f) {
    return Tv(d, !0, f);
  }([[n, a], [n + l, a], [n + l, a + r], [n, a + r]], u);
}
function cg(n, a, l, r, u) {
  return function(d, f, m, h) {
    const [p, v] = hg(h.increment, d, f, h.rx, h.ry, 1, h.increment * Wc(0.1, Wc(0.4, 1, m), m), m);
    let x = dg(p, null, m);
    if (!m.disableMultiStroke) {
      const [S] = hg(h.increment, d, f, h.rx, h.ry, 1.5, 0, m), T = dg(S, null, m);
      x = x.concat(T);
    }
    return { estimatedPoints: v, opset: { type: "path", ops: x } };
  }(n, a, u, function(d, f, m) {
    const h = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(d / 2, 2) + Math.pow(f / 2, 2)) / 2)), p = Math.max(m.curveStepCount, m.curveStepCount / Math.sqrt(200) * h), v = 2 * Math.PI / p;
    let x = Math.abs(d / 2), S = Math.abs(f / 2);
    const T = 1 - m.curveFitting;
    return x += te(x * T, m), S += te(S * T, m), { increment: v, rx: x, ry: S };
  }(l, r, u)).opset;
}
function Av(n) {
  return n.randomizer || (n.randomizer = new DE(n.seed || 0)), n.randomizer.next();
}
function Wc(n, a, l, r = 1) {
  return l.roughness * r * (Av(l) * (a - n) + n);
}
function te(n, a, l = 1) {
  return Wc(-n, n, a, l);
}
function Gr(n, a, l, r, u, d = !1) {
  const f = d ? u.disableMultiStrokeFill : u.disableMultiStroke, m = fg(n, a, l, r, u, !0, !1);
  if (f) return m;
  const h = fg(n, a, l, r, u, !0, !0);
  return m.concat(h);
}
function fg(n, a, l, r, u, d, f) {
  const m = Math.pow(n - l, 2) + Math.pow(a - r, 2), h = Math.sqrt(m);
  let p = 1;
  p = h < 200 ? 1 : h > 500 ? 0.4 : -16668e-7 * h + 1.233334;
  let v = u.maxRandomnessOffset || 0;
  v * v * 100 > m && (v = h / 10);
  const x = v / 2, S = 0.2 + 0.2 * Av(u);
  let T = u.bowing * u.maxRandomnessOffset * (r - a) / 200, A = u.bowing * u.maxRandomnessOffset * (n - l) / 200;
  T = te(T, u, p), A = te(A, u, p);
  const M = [], z = () => te(x, u, p), _ = () => te(v, u, p);
  return f ? M.push({ op: "move", data: [n + z(), a + z()] }) : M.push({ op: "move", data: [n + te(v, u, p), a + te(v, u, p)] }), f ? M.push({ op: "bcurveTo", data: [T + n + (l - n) * S + z(), A + a + (r - a) * S + z(), T + n + 2 * (l - n) * S + z(), A + a + 2 * (r - a) * S + z(), l + z(), r + z()] }) : M.push({ op: "bcurveTo", data: [T + n + (l - n) * S + _(), A + a + (r - a) * S + _(), T + n + 2 * (l - n) * S + _(), A + a + 2 * (r - a) * S + _(), l + _(), r + _()] }), M;
}
function dg(n, a, l) {
  const r = n.length, u = [];
  if (r > 3) {
    const d = [], f = 1 - l.curveTightness;
    u.push({ op: "move", data: [n[1][0], n[1][1]] });
    for (let m = 1; m + 2 < r; m++) {
      const h = n[m];
      d[0] = [h[0], h[1]], d[1] = [h[0] + (f * n[m + 1][0] - f * n[m - 1][0]) / 6, h[1] + (f * n[m + 1][1] - f * n[m - 1][1]) / 6], d[2] = [n[m + 1][0] + (f * n[m][0] - f * n[m + 2][0]) / 6, n[m + 1][1] + (f * n[m][1] - f * n[m + 2][1]) / 6], d[3] = [n[m + 1][0], n[m + 1][1]], u.push({ op: "bcurveTo", data: [d[1][0], d[1][1], d[2][0], d[2][1], d[3][0], d[3][1]] });
    }
  } else r === 3 ? (u.push({ op: "move", data: [n[1][0], n[1][1]] }), u.push({ op: "bcurveTo", data: [n[1][0], n[1][1], n[2][0], n[2][1], n[2][0], n[2][1]] })) : r === 2 && u.push(...Gr(n[0][0], n[0][1], n[1][0], n[1][1], l));
  return u;
}
function hg(n, a, l, r, u, d, f, m) {
  const h = [], p = [], v = te(0.5, m) - Math.PI / 2;
  p.push([te(d, m) + a + 0.9 * r * Math.cos(v - n), te(d, m) + l + 0.9 * u * Math.sin(v - n)]);
  for (let x = v; x < 2 * Math.PI + v - 0.01; x += n) {
    const S = [te(d, m) + a + r * Math.cos(x), te(d, m) + l + u * Math.sin(x)];
    h.push(S), p.push(S);
  }
  return p.push([te(d, m) + a + r * Math.cos(v + 2 * Math.PI + 0.5 * f), te(d, m) + l + u * Math.sin(v + 2 * Math.PI + 0.5 * f)]), p.push([te(d, m) + a + 0.98 * r * Math.cos(v + f), te(d, m) + l + 0.98 * u * Math.sin(v + f)]), p.push([te(d, m) + a + 0.9 * r * Math.cos(v + 0.5 * f), te(d, m) + l + 0.9 * u * Math.sin(v + 0.5 * f)]), [p, h];
}
function Dc(n, a) {
  return { maxRandomnessOffset: 2, roughness: n === "highlight" ? 3 : 1.5, bowing: 1, stroke: "#000", strokeWidth: 1.5, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, combineNestedSvgPaths: !1, disableMultiStroke: n !== "double", disableMultiStrokeFill: !1, seed: a };
}
function NE(n, a, l, r, u, d) {
  const f = [];
  let m = l.strokeWidth || 2;
  const h = function(T) {
    const A = T.padding;
    if (A || A === 0) {
      if (typeof A == "number") return [A, A, A, A];
      if (Array.isArray(A)) {
        const M = A;
        if (M.length) switch (M.length) {
          case 4:
            return [...M];
          case 1:
            return [M[0], M[0], M[0], M[0]];
          case 2:
            return [...M, ...M];
          case 3:
            return [...M, M[1]];
          default:
            return [M[0], M[1], M[2], M[3]];
        }
      }
    }
    return [5, 5, 5, 5];
  }(l), p = l.animate === void 0 || !!l.animate, v = l.iterations || 2, x = l.rtl ? 1 : 0, S = Dc("single", d);
  switch (l.type) {
    case "underline": {
      const T = a.y + a.h + h[2];
      for (let A = x; A < v + x; A++) A % 2 ? f.push(Pe(a.x + a.w, T, a.x, T, S)) : f.push(Pe(a.x, T, a.x + a.w, T, S));
      break;
    }
    case "strike-through": {
      const T = a.y + a.h / 2;
      for (let A = x; A < v + x; A++) A % 2 ? f.push(Pe(a.x + a.w, T, a.x, T, S)) : f.push(Pe(a.x, T, a.x + a.w, T, S));
      break;
    }
    case "box": {
      const T = a.x - h[3], A = a.y - h[0], M = a.w + (h[1] + h[3]), z = a.h + (h[0] + h[2]);
      for (let _ = 0; _ < v; _++) f.push(CE(T, A, M, z, S));
      break;
    }
    case "bracket": {
      const T = Array.isArray(l.brackets) ? l.brackets : l.brackets ? [l.brackets] : ["right"], A = a.x - 2 * h[3], M = a.x + a.w + 2 * h[1], z = a.y - 2 * h[0], _ = a.y + a.h + 2 * h[2];
      for (const q of T) {
        let L;
        switch (q) {
          case "bottom":
            L = [[A, a.y + a.h], [A, _], [M, _], [M, a.y + a.h]];
            break;
          case "top":
            L = [[A, a.y], [A, z], [M, z], [M, a.y]];
            break;
          case "left":
            L = [[a.x, z], [A, z], [A, _], [a.x, _]];
            break;
          case "right":
            L = [[a.x + a.w, z], [M, z], [M, _], [a.x + a.w, _]];
        }
        L && f.push(Tv(L, !1, S));
      }
      break;
    }
    case "crossed-off": {
      const T = a.x, A = a.y, M = T + a.w, z = A + a.h;
      for (let _ = x; _ < v + x; _++) _ % 2 ? f.push(Pe(M, z, T, A, S)) : f.push(Pe(T, A, M, z, S));
      for (let _ = x; _ < v + x; _++) _ % 2 ? f.push(Pe(T, z, M, A, S)) : f.push(Pe(M, A, T, z, S));
      break;
    }
    case "circle": {
      const T = Dc("double", d), A = a.w + (h[1] + h[3]), M = a.h + (h[0] + h[2]), z = a.x - h[3] + A / 2, _ = a.y - h[0] + M / 2, q = Math.floor(v / 2), L = v - 2 * q;
      for (let Q = 0; Q < q; Q++) f.push(cg(z, _, A, M, T));
      for (let Q = 0; Q < L; Q++) f.push(cg(z, _, A, M, S));
      break;
    }
    case "highlight": {
      const T = Dc("highlight", d);
      m = 0.95 * a.h;
      const A = a.y + a.h / 2;
      for (let M = x; M < v + x; M++) M % 2 ? f.push(Pe(a.x + a.w, A, a.x, A, T)) : f.push(Pe(a.x, A, a.x + a.w, A, T));
      break;
    }
  }
  if (f.length) {
    const T = function(q) {
      const L = [];
      for (const Q of q) {
        let V = "";
        for (const B of Q.ops) {
          const P = B.data;
          switch (B.op) {
            case "move":
              V.trim() && L.push(V.trim()), V = `M${P[0]} ${P[1]} `;
              break;
            case "bcurveTo":
              V += `C${P[0]} ${P[1]}, ${P[2]} ${P[3]}, ${P[4]} ${P[5]} `;
              break;
            case "lineTo":
              V += `L${P[0]} ${P[1]} `;
          }
        }
        V.trim() && L.push(V.trim());
      }
      return L;
    }(f), A = [], M = [];
    let z = 0;
    const _ = (q, L, Q) => q.setAttribute(L, Q);
    for (const q of T) {
      const L = document.createElementNS(wv, "path");
      if (_(L, "d", q), _(L, "fill", "none"), _(L, "stroke", l.color || "currentColor"), _(L, "stroke-width", "" + m), p) {
        const Q = L.getTotalLength();
        A.push(Q), z += Q;
      }
      n.appendChild(L), M.push(L);
    }
    if (p) {
      let q = 0;
      for (let L = 0; L < M.length; L++) {
        const Q = M[L], V = A[L], B = z ? u * (V / z) : 0, P = r + q, J = Q.style;
        J.strokeDashoffset = "" + V, J.strokeDasharray = "" + V, J.animation = `rough-notation-dash ${B}ms ease-out ${P}ms forwards`, q += B;
      }
    }
  }
}
class zE {
  constructor(a, l) {
    this._state = "unattached", this._resizing = !1, this._seed = Math.floor(Math.random() * 2 ** 31), this._lastSizes = [], this._animationDelay = 0, this._resizeListener = () => {
      this._resizing || (this._resizing = !0, setTimeout(() => {
        this._resizing = !1, this._state === "showing" && this.haveRectsChanged() && this.show();
      }, 400));
    }, this._e = a, this._config = JSON.parse(JSON.stringify(l)), this.attach();
  }
  get animate() {
    return this._config.animate;
  }
  set animate(a) {
    this._config.animate = a;
  }
  get animationDuration() {
    return this._config.animationDuration;
  }
  set animationDuration(a) {
    this._config.animationDuration = a;
  }
  get iterations() {
    return this._config.iterations;
  }
  set iterations(a) {
    this._config.iterations = a;
  }
  get color() {
    return this._config.color;
  }
  set color(a) {
    this._config.color !== a && (this._config.color = a, this.refresh());
  }
  get strokeWidth() {
    return this._config.strokeWidth;
  }
  set strokeWidth(a) {
    this._config.strokeWidth !== a && (this._config.strokeWidth = a, this.refresh());
  }
  get padding() {
    return this._config.padding;
  }
  set padding(a) {
    this._config.padding !== a && (this._config.padding = a, this.refresh());
  }
  attach() {
    if (this._state === "unattached" && this._e.parentElement) {
      (function() {
        if (!window.__rno_kf_s) {
          const u = window.__rno_kf_s = document.createElement("style");
          u.textContent = "@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }", document.head.appendChild(u);
        }
      })();
      const a = this._svg = document.createElementNS(wv, "svg");
      a.setAttribute("class", "rough-annotation");
      const l = a.style;
      l.position = "absolute", l.top = "0", l.left = "0", l.overflow = "visible", l.pointerEvents = "none", l.width = "100px", l.height = "100px";
      const r = this._config.type === "highlight";
      if (this._e.insertAdjacentElement(r ? "beforebegin" : "afterend", a), this._state = "not-showing", r) {
        const u = window.getComputedStyle(this._e).position;
        (!u || u === "static") && (this._e.style.position = "relative");
      }
      this.attachListeners();
    }
  }
  detachListeners() {
    window.removeEventListener("resize", this._resizeListener), this._ro && this._ro.unobserve(this._e);
  }
  attachListeners() {
    this.detachListeners(), window.addEventListener("resize", this._resizeListener, { passive: !0 }), !this._ro && "ResizeObserver" in window && (this._ro = new window.ResizeObserver((a) => {
      for (const l of a) l.contentRect && this._resizeListener();
    })), this._ro && this._ro.observe(this._e);
  }
  haveRectsChanged() {
    if (this._lastSizes.length) {
      const a = this.rects();
      if (a.length !== this._lastSizes.length) return !0;
      for (let l = 0; l < a.length; l++) if (!this.isSameRect(a[l], this._lastSizes[l])) return !0;
    }
    return !1;
  }
  isSameRect(a, l) {
    const r = (u, d) => Math.round(u) === Math.round(d);
    return r(a.x, l.x) && r(a.y, l.y) && r(a.w, l.w) && r(a.h, l.h);
  }
  isShowing() {
    return this._state !== "not-showing";
  }
  refresh() {
    this.isShowing() && !this.pendingRefresh && (this.pendingRefresh = Promise.resolve().then(() => {
      this.isShowing() && this.show(), delete this.pendingRefresh;
    }));
  }
  show() {
    switch (this._state) {
      case "unattached":
        break;
      case "showing":
        this.hide(), this._svg && this.render(this._svg, !0);
        break;
      case "not-showing":
        this.attach(), this._svg && this.render(this._svg, !1);
    }
  }
  hide() {
    if (this._svg) for (; this._svg.lastChild; ) this._svg.removeChild(this._svg.lastChild);
    this._state = "not-showing";
  }
  remove() {
    this._svg && this._svg.parentElement && this._svg.parentElement.removeChild(this._svg), this._svg = void 0, this._state = "unattached", this.detachListeners();
  }
  render(a, l) {
    let r = this._config;
    l && (r = JSON.parse(JSON.stringify(this._config)), r.animate = !1);
    const u = this.rects();
    let d = 0;
    u.forEach((h) => d += h.w);
    const f = r.animationDuration || 800;
    let m = 0;
    for (let h = 0; h < u.length; h++) {
      const p = f * (u[h].w / d);
      NE(a, u[h], r, m + this._animationDelay, p, this._seed), m += p;
    }
    this._lastSizes = u, this._state = "showing";
  }
  rects() {
    const a = [];
    if (this._svg) if (this._config.multiline) {
      const l = this._e.getClientRects();
      for (let r = 0; r < l.length; r++) a.push(this.svgRect(this._svg, l[r]));
    } else a.push(this.svgRect(this._svg, this._e.getBoundingClientRect()));
    return a;
  }
  svgRect(a, l) {
    const r = a.getBoundingClientRect(), u = l;
    return { x: (u.x || u.left) - (r.x || r.left), y: (u.y || u.top) - (r.y || r.top), w: u.width, h: u.height };
  }
}
function _E(n, a) {
  return new zE(n, a);
}
function OE({
  children: n,
  action: a = "highlight",
  color: l = "#ffd1dc",
  strokeWidth: r = 1.5,
  animationDuration: u = 600,
  iterations: d = 2,
  padding: f = 2,
  multiline: m = !0,
  isView: h = !1
}) {
  const p = C.useRef(null), v = Oa(p, {
    once: !0,
    margin: "-10%"
  }), x = !h || v;
  return C.useLayoutEffect(() => {
    const S = p.current;
    let T = null, A = null;
    if (x && S) {
      const z = _E(S, {
        type: a,
        color: l,
        strokeWidth: r,
        animationDuration: u,
        iterations: d,
        padding: f,
        multiline: m
      });
      T = z, z.show(), A = new ResizeObserver(() => {
        z.hide(), z.show();
      }), A.observe(S), A.observe(document.body);
    }
    return () => {
      T == null || T.remove(), A && A.disconnect();
    };
  }, [
    x,
    a,
    l,
    r,
    u,
    d,
    f,
    m
  ]), /* @__PURE__ */ y.jsx("span", { ref: p, className: "relative inline-block bg-transparent", children: n });
}
function VE({
  className: n,
  reverse: a = !1,
  pauseOnHover: l = !1,
  children: r,
  vertical: u = !1,
  repeat: d = 4,
  ...f
}) {
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      ...f,
      className: ft(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !u,
          "flex-col": u
        },
        n
      ),
      children: Array(d).fill(0).map((m, h) => /* @__PURE__ */ y.jsx(
        "div",
        {
          className: ft("flex shrink-0 justify-around gap-(--gap)", {
            "animate-marquee flex-row": !u,
            "animate-marquee-vertical flex-col": u,
            "group-hover:[animation-play-state:paused]": l,
            "[animation-direction:reverse]": a
          }),
          children: r
        },
        h
      ))
    }
  );
}
const mg = ({
  className: n,
  containerRef: a,
  fromRef: l,
  toRef: r,
  curvature: u = 0,
  reverse: d = !1,
  // Include the reverse prop
  duration: f = 5,
  delay: m = 0,
  pathColor: h = "gray",
  pathWidth: p = 2,
  pathOpacity: v = 0.2,
  gradientStartColor: x = "#ffaa40",
  gradientStopColor: S = "#9c40ff",
  repeat: T = 1 / 0,
  repeatDelay: A = 0,
  startXOffset: M = 0,
  startYOffset: z = 0,
  endXOffset: _ = 0,
  endYOffset: q = 0
}) => {
  const L = C.useId(), [Q, V] = C.useState(""), [B, P] = C.useState({ width: 0, height: 0 }), J = d ? {
    x1: ["90%", "-10%"],
    x2: ["100%", "0%"],
    y1: ["0%", "0%"],
    y2: ["0%", "0%"]
  } : {
    x1: ["10%", "110%"],
    x2: ["0%", "100%"],
    y1: ["0%", "0%"],
    y2: ["0%", "0%"]
  };
  return C.useEffect(() => {
    const Z = () => {
      if (a.current && l.current && r.current) {
        const bt = a.current.getBoundingClientRect(), kt = l.current.getBoundingClientRect(), _t = r.current.getBoundingClientRect(), Ot = bt.width, zt = bt.height;
        P({ width: Ot, height: zt });
        const G = kt.left - bt.left + kt.width / 2 + M, $ = kt.top - bt.top + kt.height / 2 + z, K = _t.left - bt.left + _t.width / 2 + _, ot = _t.top - bt.top + _t.height / 2 + q, E = $ - u, X = `M ${G},${$} Q ${(G + K) / 2},${E} ${K},${ot}`;
        V(X);
      }
    }, et = new ResizeObserver(() => {
      Z();
    });
    return a.current && et.observe(a.current), Z(), () => {
      et.disconnect();
    };
  }, [
    a,
    l,
    r,
    u,
    M,
    z,
    _,
    q
  ]), /* @__PURE__ */ y.jsxs(
    "svg",
    {
      fill: "none",
      width: B.width,
      height: B.height,
      xmlns: "http://www.w3.org/2000/svg",
      className: ft(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        n
      ),
      viewBox: `0 0 ${B.width} ${B.height}`,
      children: [
        /* @__PURE__ */ y.jsx(
          "path",
          {
            d: Q,
            stroke: h,
            strokeWidth: p,
            strokeOpacity: v,
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ y.jsx(
          "path",
          {
            d: Q,
            strokeWidth: p,
            stroke: `url(#${L})`,
            strokeOpacity: "1",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ y.jsx("defs", { children: /* @__PURE__ */ y.jsxs(
          gt.linearGradient,
          {
            className: "transform-gpu",
            id: L,
            gradientUnits: "userSpaceOnUse",
            initial: {
              x1: "0%",
              x2: "0%",
              y1: "0%",
              y2: "0%"
            },
            animate: {
              x1: J.x1,
              x2: J.x2,
              y1: J.y1,
              y2: J.y2
            },
            transition: {
              delay: m,
              duration: f,
              ease: [0.16, 1, 0.3, 1],
              // https://easings.net/#easeOutExpo
              repeat: T,
              repeatDelay: A
            },
            children: [
              /* @__PURE__ */ y.jsx("stop", { stopColor: x, stopOpacity: "0" }),
              /* @__PURE__ */ y.jsx("stop", { stopColor: x }),
              /* @__PURE__ */ y.jsx("stop", { offset: "32.5%", stopColor: S }),
              /* @__PURE__ */ y.jsx(
                "stop",
                {
                  offset: "100%",
                  stopColor: S,
                  stopOpacity: "0"
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}, pg = (n) => typeof n == "boolean" ? `${n}` : n === 0 ? "0" : n, gg = _g, kE = (n, a) => (l) => {
  var r;
  if ((a == null ? void 0 : a.variants) == null) return gg(n, l == null ? void 0 : l.class, l == null ? void 0 : l.className);
  const { variants: u, defaultVariants: d } = a, f = Object.keys(u).map((p) => {
    const v = l == null ? void 0 : l[p], x = d == null ? void 0 : d[p];
    if (v === null) return null;
    const S = pg(v) || pg(x);
    return u[p][S];
  }), m = l && Object.entries(l).reduce((p, v) => {
    let [x, S] = v;
    return S === void 0 || (p[x] = S), p;
  }, {}), h = a == null || (r = a.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((p, v) => {
    let { class: x, className: S, ...T } = v;
    return Object.entries(T).every((A) => {
      let [M, z] = A;
      return Array.isArray(z) ? z.includes({
        ...d,
        ...m
      }[M]) : {
        ...d,
        ...m
      }[M] === z;
    }) ? [
      ...p,
      x,
      S
    ] : p;
  }, []);
  return gg(n, f, h, l == null ? void 0 : l.class, l == null ? void 0 : l.className);
};
function yg(n, a) {
  if (typeof n == "function")
    return n(a);
  n != null && (n.current = a);
}
function BE(...n) {
  return (a) => {
    let l = !1;
    const r = n.map((u) => {
      const d = yg(u, a);
      return !l && typeof d == "function" && (l = !0), d;
    });
    if (l)
      return () => {
        for (let u = 0; u < r.length; u++) {
          const d = r[u];
          typeof d == "function" ? d() : yg(n[u], null);
        }
      };
  };
}
var Ev = C.forwardRef((n, a) => {
  const { children: l, ...r } = n, u = C.Children.toArray(l), d = u.find(LE);
  if (d) {
    const f = d.props.children, m = u.map((h) => h === d ? C.Children.count(f) > 1 ? C.Children.only(null) : C.isValidElement(f) ? f.props.children : null : h);
    return /* @__PURE__ */ y.jsx(Ic, { ...r, ref: a, children: C.isValidElement(f) ? C.cloneElement(f, void 0, m) : null });
  }
  return /* @__PURE__ */ y.jsx(Ic, { ...r, ref: a, children: l });
});
Ev.displayName = "Slot";
var Ic = C.forwardRef((n, a) => {
  const { children: l, ...r } = n;
  if (C.isValidElement(l)) {
    const u = qE(l), d = HE(r, l.props);
    return l.type !== C.Fragment && (d.ref = a ? BE(a, u) : u), C.cloneElement(l, d);
  }
  return C.Children.count(l) > 1 ? C.Children.only(null) : null;
});
Ic.displayName = "SlotClone";
var UE = ({ children: n }) => /* @__PURE__ */ y.jsx(y.Fragment, { children: n });
function LE(n) {
  return C.isValidElement(n) && n.type === UE;
}
function HE(n, a) {
  const l = { ...a };
  for (const r in a) {
    const u = n[r], d = a[r];
    /^on[A-Z]/.test(r) ? u && d ? l[r] = (...m) => {
      d(...m), u(...m);
    } : u && (l[r] = u) : r === "style" ? l[r] = { ...u, ...d } : r === "className" && (l[r] = [u, d].filter(Boolean).join(" "));
  }
  return { ...n, ...l };
}
function qE(n) {
  var r, u;
  let a = (r = Object.getOwnPropertyDescriptor(n.props, "ref")) == null ? void 0 : r.get, l = a && "isReactWarning" in a && a.isReactWarning;
  return l ? n.ref : (a = (u = Object.getOwnPropertyDescriptor(n, "ref")) == null ? void 0 : u.get, l = a && "isReactWarning" in a && a.isReactWarning, l ? n.props.ref : n.props.ref || n.ref);
}
const GE = kE(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function vg({
  className: n,
  variant: a = "default",
  size: l = "default",
  asChild: r = !1,
  ...u
}) {
  const d = r ? Ev : "button";
  return /* @__PURE__ */ y.jsx(
    d,
    {
      "data-slot": "button",
      "data-variant": a,
      "data-size": l,
      className: ft(GE({ variant: a, size: l, className: n })),
      ...u
    }
  );
}
const YE = ({ children: n, className: a, ...l }) => /* @__PURE__ */ y.jsx(
  "div",
  {
    className: ft(
      "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
      a
    ),
    ...l,
    children: n
  }
), Ri = ({
  name: n,
  className: a,
  background: l,
  Icon: r,
  description: u,
  href: d,
  cta: f,
  ...m
}) => /* @__PURE__ */ y.jsxs(
  "div",
  {
    className: ft(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      a
    ),
    ...m,
    children: [
      /* @__PURE__ */ y.jsx("div", { children: l }),
      /* @__PURE__ */ y.jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ y.jsxs("div", { className: "pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10", children: [
          /* @__PURE__ */ y.jsx(r, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" }),
          /* @__PURE__ */ y.jsx("h3", { className: "text-xl font-semibold text-neutral-700 dark:text-neutral-300", children: n }),
          /* @__PURE__ */ y.jsx("p", { className: "max-w-lg text-neutral-400", children: u })
        ] }),
        /* @__PURE__ */ y.jsx(
          "div",
          {
            className: ft(
              "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden"
            ),
            children: /* @__PURE__ */ y.jsx(
              vg,
              {
                variant: "link",
                asChild: !0,
                size: "sm",
                className: "pointer-events-auto p-0",
                children: /* @__PURE__ */ y.jsxs("a", { href: d, children: [
                  f,
                  /* @__PURE__ */ y.jsx(Ks, { className: "ms-2 h-4 w-4 rtl:rotate-180" })
                ] })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ y.jsx(
        "div",
        {
          className: ft(
            "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
          ),
          children: /* @__PURE__ */ y.jsx(
            vg,
            {
              variant: "link",
              asChild: !0,
              size: "sm",
              className: "pointer-events-auto p-0",
              children: /* @__PURE__ */ y.jsxs("a", { href: d, children: [
                f,
                /* @__PURE__ */ y.jsx(Ks, { className: "ms-2 h-4 w-4 rtl:rotate-180" })
              ] })
            }
          )
        }
      ),
      /* @__PURE__ */ y.jsx("div", { className: "pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/3 group-hover:dark:bg-neutral-800/10" })
    ]
  },
  n
), Mv = ({
  className: n,
  size: a = 50,
  delay: l = 0,
  duration: r = 6,
  colorFrom: u = "#ffaa40",
  colorTo: d = "#9c40ff",
  transition: f,
  style: m,
  reverse: h = !1,
  initialOffset: p = 0,
  borderWidth: v = 1
}) => /* @__PURE__ */ y.jsx(
  "div",
  {
    className: "pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [mask-clip:padding-box,border-box]",
    style: {
      "--border-beam-width": `${v}px`
    },
    children: /* @__PURE__ */ y.jsx(
      gt.div,
      {
        className: ft(
          "absolute aspect-square",
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          n
        ),
        style: {
          width: a,
          offsetPath: `rect(0 auto auto 0 round ${a}px)`,
          "--color-from": u,
          "--color-to": d,
          ...m
        },
        initial: { offsetDistance: `${p}%` },
        animate: {
          offsetDistance: h ? [`${100 - p}%`, `${-p}%`] : [`${p}%`, `${100 + p}%`]
        },
        transition: {
          repeat: 1 / 0,
          ease: "linear",
          duration: r,
          delay: -l,
          ...f
        }
      }
    )
  }
);
function XE({ children: n }) {
  const a = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 }
  };
  return /* @__PURE__ */ y.jsx(gt.div, { ...a, layout: !0, className: "mx-auto w-full", children: n });
}
const jv = Zs.memo(
  ({ children: n, className: a, delay: l = 1e3, ...r }) => {
    const [u, d] = C.useState(0), f = C.useMemo(
      () => Zs.Children.toArray(n),
      [n]
    );
    C.useEffect(() => {
      let h = null;
      return u < f.length - 1 && (h = setTimeout(() => {
        d((p) => (p + 1) % f.length);
      }, l)), () => {
        h !== null && clearTimeout(h);
      };
    }, [u, l, f.length]);
    const m = C.useMemo(() => f.slice(0, u + 1).reverse(), [u, f]);
    return /* @__PURE__ */ y.jsx(
      "div",
      {
        className: ft("flex flex-col items-center gap-4", a),
        ...r,
        children: /* @__PURE__ */ y.jsx(Xr, { children: m.map((h) => /* @__PURE__ */ y.jsx(XE, { children: h }, h.key)) })
      }
    );
  }
);
jv.displayName = "AnimatedList";
function bg({
  className: n,
  children: a,
  reverse: l,
  duration: r = 20,
  radius: u = 160,
  path: d = !0,
  iconSize: f = 30,
  speed: m = 1,
  ...h
}) {
  const p = r / m;
  return /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
    d && /* @__PURE__ */ y.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        version: "1.1",
        className: "pointer-events-none absolute inset-0 size-full",
        children: /* @__PURE__ */ y.jsx(
          "circle",
          {
            className: "stroke-black/10 stroke-1 dark:stroke-white/10",
            cx: "50%",
            cy: "50%",
            r: u,
            fill: "none"
          }
        )
      }
    ),
    Zs.Children.map(a, (v, x) => {
      const S = 360 / Zs.Children.count(a) * x;
      return /* @__PURE__ */ y.jsx(
        "div",
        {
          style: {
            "--duration": p,
            "--radius": u,
            "--angle": S,
            "--icon-size": `${f}px`
          },
          className: ft(
            "animate-orbit absolute flex size-(--icon-size) transform-gpu items-center justify-center rounded-full",
            { "[animation-direction:reverse]": l },
            n
          ),
          ...h,
          children: v
        }
      );
    })
  ] });
}
const Rv = C.createContext(null), Dv = () => C.useContext(Rv), Cv = C.createContext(null), Nv = () => C.useContext(Cv), ZE = {
  article: gt.article,
  div: gt.div,
  h1: gt.h1,
  h2: gt.h2,
  h3: gt.h3,
  h4: gt.h4,
  h5: gt.h5,
  h6: gt.h6,
  li: gt.li,
  p: gt.p,
  section: gt.section,
  span: gt.span
}, Mr = ({
  children: n,
  delay: a = 0,
  className: l,
  startOnView: r = !1,
  ...u
}) => {
  const d = C.useRef(null), f = Oa(d, {
    amount: 0.3,
    once: !0
  }), m = Dv(), h = Nv(), [p, v] = C.useState(!1);
  C.useEffect(() => {
    !m || h === null || m.sequenceStarted && (p || m.activeIndex === h && v(!0));
  }, [m, p, h]);
  const x = m ? p : r ? f : !0;
  return /* @__PURE__ */ y.jsx(
    gt.div,
    {
      ref: d,
      initial: { opacity: 0, y: -5 },
      animate: x ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 },
      transition: { duration: 0.3, delay: m ? 0 : a / 1e3 },
      className: ft("grid text-sm font-normal tracking-tight", l),
      onAnimationComplete: () => {
        m && h !== null && m.completeItem(h);
      },
      ...u,
      children: n
    }
  );
}, xg = ({
  children: n,
  className: a,
  duration: l = 60,
  delay: r = 0,
  as: u = "span",
  startOnView: d = !0,
  ...f
}) => {
  if (typeof n != "string")
    throw new Error("TypingAnimation: children must be a string. Received:");
  const m = ZE[u], [h, p] = C.useState(""), [v, x] = C.useState(!1), S = C.useRef(null), T = Oa(S, {
    amount: 0.3,
    once: !0
  }), A = Dv(), M = Nv(), z = A !== null, _ = (A == null ? void 0 : A.sequenceStarted) ?? !1, q = (A == null ? void 0 : A.activeIndex) ?? null, L = C.useRef(null), Q = C.useRef(null);
  return C.useEffect(() => {
    L.current = (A == null ? void 0 : A.completeItem) ?? null, Q.current = M;
  }, [A == null ? void 0 : A.completeItem, M]), C.useEffect(() => {
    let V = null;
    return z && M !== null ? _ && !v && q === M && x(!0) : (!d || T) && (V = setTimeout(() => x(!0), r)), () => {
      V !== null && clearTimeout(V);
    };
  }, [
    r,
    d,
    T,
    v,
    z,
    q,
    _,
    M
  ]), C.useEffect(() => {
    let V = null;
    if (v) {
      let B = 0;
      V = setInterval(() => {
        if (B < n.length)
          p(n.substring(0, B + 1)), B++;
        else {
          V !== null && clearInterval(V);
          const P = L.current, J = Q.current;
          P && J !== null && P(J);
        }
      }, l);
    }
    return () => {
      V !== null && clearInterval(V);
    };
  }, [n, l, v]), /* @__PURE__ */ y.jsx(
    m,
    {
      ref: S,
      className: ft("text-sm font-normal tracking-tight", a),
      ...f,
      children: h
    }
  );
}, KE = ({
  children: n,
  className: a,
  sequence: l = !0,
  startOnView: r = !0
}) => {
  const u = C.useRef(null), d = Oa(u, {
    amount: 0.3,
    once: !0
  }), [f, m] = C.useState(0), h = l ? !r || d : !1, p = C.useMemo(() => l ? {
    completeItem: (S) => {
      m((T) => S === T ? T + 1 : T);
    },
    activeIndex: f,
    sequenceStarted: h
  } : null, [l, f, h]), v = C.useMemo(() => l ? C.Children.toArray(n).map((T, A) => /* @__PURE__ */ y.jsx(Cv.Provider, { value: A, children: T }, A)) : n, [n, l]), x = /* @__PURE__ */ y.jsxs(
    "div",
    {
      ref: u,
      className: ft(
        "border-border bg-background z-0 h-full max-h-100 w-full max-w-lg rounded-xl border",
        a
      ),
      children: [
        /* @__PURE__ */ y.jsx("div", { className: "border-border flex flex-col gap-y-2 border-b p-4", children: /* @__PURE__ */ y.jsxs("div", { className: "flex flex-row gap-x-2", children: [
          /* @__PURE__ */ y.jsx("div", { className: "h-2 w-2 rounded-full bg-red-500" }),
          /* @__PURE__ */ y.jsx("div", { className: "h-2 w-2 rounded-full bg-yellow-500" }),
          /* @__PURE__ */ y.jsx("div", { className: "h-2 w-2 rounded-full bg-green-500" })
        ] }) }),
        /* @__PURE__ */ y.jsx("pre", { className: "p-4", children: /* @__PURE__ */ y.jsx("code", { className: "grid gap-y-1 overflow-auto", children: v }) })
      ]
    }
  );
  return l ? /* @__PURE__ */ y.jsx(Rv.Provider, { value: p, children: x }) : x;
};
function zv({
  width: n = 16,
  height: a = 16,
  x: l = 0,
  y: r = 0,
  cx: u = 1,
  cy: d = 1,
  cr: f = 1,
  className: m,
  glow: h = !1,
  ...p
}) {
  const v = C.useId(), x = C.useRef(null), [S, T] = C.useState({ width: 0, height: 0 });
  C.useEffect(() => {
    const M = () => {
      if (x.current) {
        const { width: z, height: _ } = x.current.getBoundingClientRect();
        T({ width: z, height: _ });
      }
    };
    return M(), window.addEventListener("resize", M), () => window.removeEventListener("resize", M);
  }, []);
  const A = Array.from(
    {
      length: Math.ceil(S.width / n) * Math.ceil(S.height / a)
    },
    (M, z) => {
      const _ = z % Math.ceil(S.width / n), q = Math.floor(z / Math.ceil(S.width / n));
      return {
        x: _ * n + u + l,
        y: q * a + d + r,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2
      };
    }
  );
  return /* @__PURE__ */ y.jsxs(
    "svg",
    {
      ref: x,
      "aria-hidden": "true",
      className: ft(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        m
      ),
      ...p,
      children: [
        /* @__PURE__ */ y.jsx("defs", { children: /* @__PURE__ */ y.jsxs("radialGradient", { id: `${v}-gradient`, children: [
          /* @__PURE__ */ y.jsx("stop", { offset: "0%", stopColor: "currentColor", stopOpacity: "1" }),
          /* @__PURE__ */ y.jsx("stop", { offset: "100%", stopColor: "currentColor", stopOpacity: "0" })
        ] }) }),
        A.map((M) => /* @__PURE__ */ y.jsx(
          gt.circle,
          {
            cx: M.x,
            cy: M.y,
            r: f,
            fill: h ? `url(#${v}-gradient)` : "currentColor",
            initial: h ? { opacity: 0.4, scale: 1 } : {},
            animate: h ? {
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1]
            } : {},
            transition: h ? {
              duration: M.duration,
              repeat: 1 / 0,
              repeatType: "reverse",
              delay: M.delay,
              ease: "easeInOut"
            } : {}
          },
          `${M.x}-${M.y}`
        ))
      ]
    }
  );
}
function QE({
  className: n,
  ref: a,
  ...l
}) {
  const { scrollYProgress: r } = yE();
  return /* @__PURE__ */ y.jsx(
    gt.div,
    {
      ref: a,
      className: ft(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-linear-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        n
      ),
      style: {
        scaleX: r
      },
      ...l
    }
  );
}
function PE({
  children: n,
  className: a,
  ...l
}) {
  return /* @__PURE__ */ y.jsxs(
    "button",
    {
      className: ft(
        "group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
        a
      ),
      ...l,
      children: [
        /* @__PURE__ */ y.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ y.jsx("div", { className: "bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]" }),
          /* @__PURE__ */ y.jsx("span", { className: "inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0", children: n })
        ] }),
        /* @__PURE__ */ y.jsxs("div", { className: "text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100", children: [
          /* @__PURE__ */ y.jsx("span", { children: n }),
          /* @__PURE__ */ y.jsx(Ks, {})
        ] })
      ]
    }
  );
}
const FE = ({
  children: n,
  className: a,
  shimmerWidth: l = 100,
  ...r
}) => /* @__PURE__ */ y.jsx(
  "span",
  {
    style: {
      "--shiny-width": `${l}px`
    },
    className: ft(
      "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",
      // Shine effect
      "animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
      // Shine gradient
      "bg-linear-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",
      a
    ),
    ...r,
    children: n
  }
);
function Sa(n) {
  return n.mode === "orb";
}
function JE(n) {
  const {
    children: a,
    className: l,
    gradientSize: r = 200,
    gradientColor: u = "#262626",
    gradientOpacity: d = 0.8,
    gradientFrom: f = "#9E7AFF",
    gradientTo: m = "#FE8BBB",
    mode: h = "gradient"
  } = n, p = Sa(n) ? n.glowFrom ?? "#ee4f27" : "#ee4f27", v = Sa(n) ? n.glowTo ?? "#6b21ef" : "#6b21ef", x = Sa(n) ? n.glowAngle ?? 90 : 90, S = Sa(n) ? n.glowSize ?? 420 : 420, T = Sa(n) ? n.glowBlur ?? 60 : 60, A = Sa(n) ? n.glowOpacity ?? 0.9 : 0.9, M = Is(-r), z = Is(-r), _ = _r(M, { stiffness: 250, damping: 30, mass: 0.6 }), q = _r(z, { stiffness: 250, damping: 30, mass: 0.6 }), L = _r(0, { stiffness: 300, damping: 35 }), Q = C.useRef(h), V = C.useRef(A), B = C.useRef(r);
  C.useEffect(() => {
    Q.current = h;
  }, [h]), C.useEffect(() => {
    V.current = A;
  }, [A]), C.useEffect(() => {
    B.current = r;
  }, [r]);
  const P = C.useCallback(
    (Z = "leave") => {
      if (Q.current === "orb") {
        Z === "enter" ? L.set(V.current) : L.set(0);
        return;
      }
      const bt = -B.current;
      M.set(bt), z.set(bt);
    },
    [M, z, L]
  ), J = C.useCallback(
    (Z) => {
      const et = Z.currentTarget.getBoundingClientRect();
      M.set(Z.clientX - et.left), z.set(Z.clientY - et.top);
    },
    [M, z]
  );
  return C.useEffect(() => {
    P("init");
  }, [P]), C.useEffect(() => {
    const Z = (kt) => {
      kt.relatedTarget || P("global");
    }, et = () => P("global"), bt = () => {
      document.visibilityState !== "visible" && P("global");
    };
    return window.addEventListener("pointerout", Z), window.addEventListener("blur", et), document.addEventListener("visibilitychange", bt), () => {
      window.removeEventListener("pointerout", Z), window.removeEventListener("blur", et), document.removeEventListener("visibilitychange", bt);
    };
  }, [P]), /* @__PURE__ */ y.jsxs(
    gt.div,
    {
      className: ft(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        l
      ),
      onPointerMove: J,
      onPointerLeave: () => P("leave"),
      onPointerEnter: () => P("enter"),
      style: {
        background: lg`
          linear-gradient(var(--color-background) 0 0) padding-box,
          radial-gradient(${r}px circle at ${M}px ${z}px,
            ${f},
            ${m},
            var(--color-border) 100%
          ) border-box
        `
      },
      children: [
        /* @__PURE__ */ y.jsx("div", { className: "bg-background absolute inset-px z-20 rounded-[inherit]" }),
        h === "gradient" && /* @__PURE__ */ y.jsx(
          gt.div,
          {
            suppressHydrationWarning: !0,
            className: "pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            style: {
              background: lg`
              radial-gradient(${r}px circle at ${M}px ${z}px,
                ${u},
                transparent 100%
              )
            `,
              opacity: d
            }
          }
        ),
        h === "orb" && /* @__PURE__ */ y.jsx(
          gt.div,
          {
            suppressHydrationWarning: !0,
            "aria-hidden": "true",
            className: "pointer-events-none absolute z-30",
            style: {
              width: S,
              height: S,
              x: _,
              y: q,
              translateX: "-50%",
              translateY: "-50%",
              borderRadius: 9999,
              filter: `blur(${T}px)`,
              opacity: L,
              background: `linear-gradient(${x}deg, ${p}, ${v})`,
              mixBlendMode: "multiply",
              willChange: "transform, opacity"
            }
          }
        ),
        /* @__PURE__ */ y.jsx("div", { className: "relative z-40", children: a })
      ]
    }
  );
}
typeof globalThis < "u" && typeof globalThis.IntersectionObserver > "u" && (globalThis.IntersectionObserver = class {
  constructor(a) {
    zs(this, "root", null);
    zs(this, "rootMargin", "0px");
    zs(this, "thresholds", [0]);
    zs(this, "callback");
    this.callback = a;
  }
  observe(a) {
    this.callback(
      [{ isIntersecting: !0, target: a }],
      this
    );
  }
  unobserve() {
  }
  disconnect() {
  }
  takeRecords() {
    return [];
  }
});
const $E = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
function WE({
  value: n,
  startValue: a = 0,
  direction: l = "up",
  delay: r = 0,
  className: u,
  decimalPlaces: d = 0,
  locale: f = "id-ID",
  ...m
}) {
  const h = C.useRef(null), p = C.useRef(null), v = C.useRef(!1), x = bE(), S = l === "down" ? n : a, T = l === "down" ? a : n, A = (L) => Intl.NumberFormat(f, {
    minimumFractionDigits: d,
    maximumFractionDigits: d
  }).format(Number(L.toFixed(d))), M = C.useRef(
    A(x || T === S ? T : S)
  ), z = Is(x ? T : S), _ = _r(z, {
    damping: 60,
    stiffness: 100
  }), q = Oa(h, { once: !0, margin: "0px" });
  return C.useEffect(() => {
    var V;
    if (x) {
      z.set(T);
      const B = A(T);
      M.current = B, (V = p.current) == null || V.setAttribute("data-ticker-value", B);
      return;
    }
    if (!q) return;
    const L = v.current ? 0 : r, Q = setTimeout(() => {
      v.current = !0, z.set(T);
    }, L * 1e3);
    return () => clearTimeout(Q);
  }, [z, q, r, T, x, d, f]), C.useEffect(
    () => _.on("change", (L) => {
      var V;
      const Q = A(L);
      M.current = Q, (V = p.current) == null || V.setAttribute("data-ticker-value", Q);
    }),
    [_, d, f]
  ), /* @__PURE__ */ y.jsxs(
    "span",
    {
      ref: h,
      className: ft("inline-block tabular-nums tracking-tight number-ticker", u),
      "data-ticker-target": T,
      ...m,
      children: [
        /* @__PURE__ */ y.jsx("span", { className: "number-ticker-sr", style: $E, children: A(T) }),
        /* @__PURE__ */ y.jsx(
          "span",
          {
            ref: p,
            className: "number-ticker-visual",
            "aria-hidden": "true",
            "data-ticker-value": M.current
          }
        )
      ]
    }
  );
}
let Sg = null;
function IE() {
  return Sg ?? (Sg = fetch("/api/public/collection", { headers: { Accept: "application/json" } }).then((n) => n.ok ? n.json() : null).catch(() => null)), Sg;
}
function t3() {
  const [n, a] = C.useState(void 0);
  return C.useEffect(() => {
    let l = !0;
    return IE().then((r) => l && a(r)), () => {
      l = !1;
    };
  }, []), n;
}
const e3 = {
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
  INPRES: "Instruksi Presiden",
  KEPPRES: "Keputusan Presiden"
}, n3 = {
  pembentukan_regulasi: "Law-making",
  biaya: "Costs & fees",
  akses_layanan: "Service access",
  informasi: "Public information",
  partisipasi: "Participation",
  disabilitas: "Disability rights",
  pengaduan: "Complaints",
  data_pribadi: "Personal data"
}, Da = "/static/landing", qf = "https://github.com/mocharil/RuleLab";
function ki({ children: n, className: a }) {
  return /* @__PURE__ */ y.jsx("p", { className: ft("mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand", a), children: n });
}
function Bi({ children: n, className: a }) {
  return /* @__PURE__ */ y.jsx("h2", { className: ft("text-balance text-4xl font-bold tracking-[-0.035em] text-ink md:text-6xl", a), children: n });
}
function Gf({ children: n, className: a }) {
  return /* @__PURE__ */ y.jsx("p", { className: ft("mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-2 md:text-xl", a), children: n });
}
function _v({ children: n }) {
  return /* @__PURE__ */ y.jsx("span", { className: "font-serif font-semibold italic tracking-[-0.01em] text-brand", children: n });
}
function Or({ children: n = "Example" }) {
  return /* @__PURE__ */ y.jsx("span", { className: "rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700", children: n });
}
function Jr({ size: n = 32 }) {
  return /* @__PURE__ */ y.jsx("img", { src: "/static/brand/rulelab-icon.png", alt: "", width: n, height: n, className: "rounded-[22%]" });
}
function i3({ name: n, className: a }) {
  const l = C.useRef(null);
  return C.useEffect(() => {
    const r = l.current;
    if (!r) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      r.removeAttribute("autoplay"), r.pause();
      return;
    }
    const u = new IntersectionObserver(([d]) => d.isIntersecting ? r.play().catch(() => {
    }) : r.pause(), { threshold: 0.25 });
    return u.observe(r), () => u.disconnect();
  }, [n]), /* @__PURE__ */ y.jsx(
    "video",
    {
      ref: l,
      className: ft("block size-full object-cover", a),
      poster: `${Da}/${n}.jpg`,
      muted: !0,
      loop: !0,
      playsInline: !0,
      autoPlay: !0,
      preload: "metadata",
      "aria-label": "RuleLab product animation",
      children: /* @__PURE__ */ y.jsx("source", { src: `${Da}/${n}.mp4`, type: "video/mp4" })
    },
    n
  );
}
function tf({ name: n, url: a, className: l }) {
  return /* @__PURE__ */ y.jsxs("div", { className: ft("relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_120px_-40px_rgba(20,22,30,0.35)]", l), children: [
    /* @__PURE__ */ y.jsxs("div", { className: "flex h-9 items-center gap-2 border-b border-line bg-mist px-4", children: [
      /* @__PURE__ */ y.jsx("span", { className: "size-2.5 rounded-full bg-[#ff5f57]" }),
      /* @__PURE__ */ y.jsx("span", { className: "size-2.5 rounded-full bg-[#febc2e]" }),
      /* @__PURE__ */ y.jsx("span", { className: "size-2.5 rounded-full bg-[#28c840]" }),
      /* @__PURE__ */ y.jsx("span", { className: "mx-auto truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-muted ring-1 ring-line", children: a })
    ] }),
    /* @__PURE__ */ y.jsx("div", { className: "aspect-video bg-mist", children: /* @__PURE__ */ y.jsx(i3, { name: n }) })
  ] });
}
function a3() {
  const [n, a] = C.useState(!1);
  C.useEffect(() => {
    const r = () => a(window.scrollY > 24);
    return r(), window.addEventListener("scroll", r, { passive: !0 }), () => window.removeEventListener("scroll", r);
  }, []);
  const l = [["#produk", "Product"], ["#cara-kerja", "How it works"], ["#koleksi", "Collection"], ["#sumber", "Trust"]];
  return /* @__PURE__ */ y.jsxs("header", { className: ft("fixed inset-x-0 top-0 z-50 transition-all duration-300", n ? "border-b border-line/80 bg-white/80 backdrop-blur-xl" : "bg-transparent"), children: [
    /* @__PURE__ */ y.jsx(QE, { className: "top-0 h-[2px] bg-brand" }),
    /* @__PURE__ */ y.jsxs("nav", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6", "aria-label": "Main", children: [
      /* @__PURE__ */ y.jsxs("a", { href: "/", className: "flex items-center gap-2.5 font-bold tracking-tight text-ink", children: [
        /* @__PURE__ */ y.jsx(Jr, { size: 28 }),
        /* @__PURE__ */ y.jsx("span", { className: "text-lg", children: "RuleLab" })
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "hidden items-center gap-8 text-sm font-medium text-ink-2 md:flex", children: [
        l.map(([r, u]) => /* @__PURE__ */ y.jsx("a", { href: r, className: "transition-colors hover:text-ink", children: u }, r)),
        /* @__PURE__ */ y.jsx("a", { href: qf, className: "transition-colors hover:text-ink", rel: "noopener", children: "GitHub" })
      ] }),
      /* @__PURE__ */ y.jsx("a", { href: "/workspace", className: "rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand", children: "Open workspace" })
    ] })
  ] });
}
function s3() {
  return /* @__PURE__ */ y.jsxs("section", { "data-landing-hero": !0, className: "relative overflow-hidden px-4 pt-32 pb-20 md:pt-40 md:pb-28", "aria-labelledby": "hero-title", children: [
    /* @__PURE__ */ y.jsx(zv, { className: "pointer-events-none text-neutral-300/70 [mask-image:radial-gradient(720px_circle_at_50%_18%,white,transparent)]" }),
    /* @__PURE__ */ y.jsxs("div", { className: "relative mx-auto max-w-5xl text-center", children: [
      /* @__PURE__ */ y.jsx(wt, { delay: 0.05, children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-sm shadow-sm backdrop-blur", children: [
        /* @__PURE__ */ y.jsx(R1, { className: "size-4 text-brand" }),
        /* @__PURE__ */ y.jsx(FE, { className: "mx-0 max-w-none text-ink-2", children: "An AI workspace for Indonesian lawmaking · built on Gemini" })
      ] }) }),
      /* @__PURE__ */ y.jsxs("h1", { id: "hero-title", className: "text-balance text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-ink md:text-7xl lg:text-[5.4rem]", children: [
        /* @__PURE__ */ y.jsx(ME, { as: "span", animation: "blurInUp", by: "word", once: !0, className: "block", children: "Regulations that hold up" }),
        /* @__PURE__ */ y.jsx(wt, { delay: 0.55, inView: !1, className: "mt-1 block", children: /* @__PURE__ */ y.jsx("span", { className: "font-serif text-[1.08em] font-semibold italic tracking-[-0.02em] text-brand", children: "in law and in people’s lives." }) })
      ] }),
      /* @__PURE__ */ y.jsx(wt, { delay: 0.75, children: /* @__PURE__ */ y.jsx("p", { className: "mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-2 md:text-xl", children: "RuleLab drafts Indonesian regulations in the official format, checks every article against the laws it must fit, and tests the impact on citizens — before the draft is signed." }) }),
      /* @__PURE__ */ y.jsx(wt, { delay: 0.9, children: /* @__PURE__ */ y.jsxs("div", { className: "mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ y.jsx("a", { href: "/workspace", "aria-label": "Open the RuleLab workspace", children: /* @__PURE__ */ y.jsxs(Hf, { background: "#c8102e", shimmerColor: "#ffd6dd", className: "px-7 py-3.5 text-base font-semibold", children: [
          "Open the workspace ",
          /* @__PURE__ */ y.jsx(Ks, { className: "ml-2 size-4" })
        ] }) }),
        /* @__PURE__ */ y.jsx("a", { href: "#demo", className: "rounded-full border border-line bg-white px-6 py-3.5 text-base font-semibold text-ink transition hover:border-ink/30", children: "Watch the 3-minute demo" })
      ] }) })
    ] }),
    /* @__PURE__ */ y.jsxs(wt, { delay: 1.05, className: "relative mx-auto mt-16 max-w-5xl md:mt-20", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "relative rounded-[20px]", children: [
        /* @__PURE__ */ y.jsx(tf, { name: "hero-loop", url: "rulelab · Policy Studio" }),
        /* @__PURE__ */ y.jsx(Mv, { size: 220, duration: 9, colorFrom: "#c8102e", colorTo: "#f4a6b4", className: "rounded-2xl" })
      ] }),
      /* @__PURE__ */ y.jsx("p", { className: "mt-4 text-center text-xs text-muted", children: "Motion graphics of the RuleLab workspace with sample data." })
    ] })
  ] });
}
const l3 = [["a", "Elderly citizens"], ["b", "People with disabilities"], ["c", "Villages without signal"]];
function r3() {
  const [n, a] = C.useState(!1), l = C.useRef(null);
  return C.useEffect(() => {
    const r = l.current;
    if (!r) return;
    let u = 0;
    const d = new IntersectionObserver(([f]) => {
      f.isIntersecting && (u = window.setTimeout(() => a(!0), 2200), d.disconnect());
    }, { threshold: 0.4 });
    return d.observe(r), () => {
      d.disconnect(), clearTimeout(u);
    };
  }, []), /* @__PURE__ */ y.jsx("section", { className: "bg-mist px-4 py-24 md:py-36", "aria-labelledby": "problem-title", children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(ki, { children: "The problem" }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsx(Bi, { className: "max-w-3xl", children: /* @__PURE__ */ y.jsx("span", { id: "problem-title", children: "One sentence can lock people out." }) }) }),
    /* @__PURE__ */ y.jsxs(wt, { inView: !0, delay: 0.2, children: [
      /* @__PURE__ */ y.jsxs("blockquote", { className: "mt-10 max-w-3xl border-l-4 border-brand pl-6 font-serif text-3xl leading-snug text-ink md:text-4xl", children: [
        "“Applications may",
        " ",
        /* @__PURE__ */ y.jsx(OE, { action: "highlight", color: "#fde2e7", animationDuration: 900, children: "only" }),
        " ",
        "be submitted through a digital app.”"
      ] }),
      /* @__PURE__ */ y.jsx("p", { className: "mt-4 max-w-2xl text-ink-2", children: "A draft article can read like progress and still conflict with the Public Service Law and the Disability Law. Drafters have to check every article against overlapping regulations, by hand, under tight deadlines." })
    ] }),
    /* @__PURE__ */ y.jsx("div", { ref: l, className: "mt-14 grid gap-5 sm:grid-cols-3", children: l3.map(([r, u], d) => /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.15 + d * 0.12, children: /* @__PURE__ */ y.jsxs("figure", { className: "overflow-hidden rounded-3xl border border-line bg-white shadow-sm", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "relative aspect-square overflow-hidden", children: [
        /* @__PURE__ */ y.jsx("img", { src: `${Da}/citizen-${r}-locked.webp`, alt: "", loading: "lazy", className: ft("absolute inset-0 size-full object-cover transition-all duration-1000", n && "opacity-0") }),
        /* @__PURE__ */ y.jsx("img", { src: `${Da}/citizen-${r}-served.webp`, alt: "", loading: "lazy", className: ft("absolute inset-0 size-full object-cover opacity-0 transition-all duration-1000", n && "opacity-100") }),
        /* @__PURE__ */ y.jsx("span", { className: ft("absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white transition-colors duration-700", n ? "bg-good" : "bg-ink"), children: n ? "Served" : "Locked out" })
      ] }),
      /* @__PURE__ */ y.jsx("figcaption", { className: "px-5 py-4 font-semibold text-ink", children: u })
    ] }) }, r)) }),
    /* @__PURE__ */ y.jsx("p", { className: "mt-6 text-sm text-muted", children: "Illustrations. RuleLab flags the exclusion while the text is still a draft and proposes an assisted channel." })
  ] }) });
}
function o3() {
  const n = t3(), a = n == null ? void 0 : n.summary, l = a ? [
    [a.unique_regulations, "regulations", "national and regional"],
    [a.articles, "articles & blocks", "each with its source"],
    [a.mapped_provinces, `of ${a.province_total} provinces`, "with regional documents"],
    [Object.keys(n.types).length, "regulation types", "from UU to Perbup"]
  ] : null, r = n ? [
    ...Object.entries(n.types).sort((u, d) => d[1] - u[1]).map(([u, d]) => `${e3[u] ?? u} · ${d.toLocaleString("en-US")}`),
    ...Object.entries(n.topics).sort((u, d) => d[1] - u[1]).map(([u]) => n3[u] ?? u.replace(/_/g, " "))
  ] : [];
  return /* @__PURE__ */ y.jsx("section", { className: "px-4 py-24 md:py-32", "aria-labelledby": "numbers-title", children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(ki, { children: "Grounded in sources" }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsx(Bi, { className: "max-w-3xl", children: /* @__PURE__ */ y.jsx("span", { id: "numbers-title", children: "Every check starts from Indonesia’s legal collection." }) }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.15, children: /* @__PURE__ */ y.jsx(Gf, { children: "Official texts collected from JDIH portals, split into articles, enriched by Gemini and indexed for hybrid search. The figures below are read live from the collection." }) }),
    /* @__PURE__ */ y.jsx("div", { className: "mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4", "aria-live": "polite", children: l ? l.map(([u, d, f], m) => /* @__PURE__ */ y.jsxs(wt, { inView: !0, delay: 0.1 + m * 0.08, className: "bg-white p-6 md:p-8", children: [
      /* @__PURE__ */ y.jsx("div", { className: "text-4xl font-bold tracking-[-0.04em] text-ink tabular-nums md:text-5xl", children: /* @__PURE__ */ y.jsx(WE, { value: u, locale: "en-US" }) }),
      /* @__PURE__ */ y.jsx("div", { className: "mt-2 font-semibold text-ink", children: d }),
      /* @__PURE__ */ y.jsx("div", { className: "text-sm text-muted", children: f })
    ] }, d)) : /* @__PURE__ */ y.jsx("div", { className: "col-span-full bg-white p-8 text-ink-2", children: n === null ? "Collection figures are temporarily unavailable." : "Loading the collection…" }) }),
    r.length > 0 && /* @__PURE__ */ y.jsxs("div", { className: "relative mt-10 overflow-hidden", children: [
      /* @__PURE__ */ y.jsx(VE, { pauseOnHover: !0, className: "[--duration:45s] [--gap:0.75rem]", children: r.map((u) => /* @__PURE__ */ y.jsx("span", { className: "whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-2", children: u }, u)) }),
      /* @__PURE__ */ y.jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white" }),
      /* @__PURE__ */ y.jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white" })
    ] })
  ] }) });
}
const jr = [
  {
    key: "step-draft",
    n: "01",
    title: "Draft",
    icon: jg,
    url: "rulelab · Policy Studio · Draft",
    text: "Start from a plain-language brief. Gemini writes the draft in the official structure — considerations, legal basis and numbered articles — grounded in retrieved laws. Every edit is saved as a new version."
  },
  {
    key: "step-verify",
    n: "02",
    title: "Verify sources",
    icon: Cg,
    url: "rulelab · Policy Studio · Verify sources",
    text: "Hybrid search pulls the relevant clauses and specialist agents review each article. Findings link to the exact article, page and document fingerprint; citations outside the evidence are rejected. The reviewer applies a fix with one click."
  },
  {
    key: "step-impact",
    n: "03",
    title: "Test impact",
    icon: Ng,
    url: "rulelab · Policy Studio · Test impact",
    text: "Compare two drafts with the same assumptions: who is served, who is left out, cost and staff workload. Then synthetic personas debate both drafts over several rounds, clustered by issue — to prepare public consultation, not replace it."
  }
];
function u3() {
  const [n, a] = C.useState(0), l = C.useRef([]);
  return C.useEffect(() => {
    const r = new IntersectionObserver((u) => {
      u.forEach((d) => {
        d.isIntersecting && a(Number(d.target.dataset.step));
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    return l.current.forEach((u) => u && r.observe(u)), () => r.disconnect();
  }, []), /* @__PURE__ */ y.jsx("section", { id: "cara-kerja", className: "bg-mist px-4 py-24 md:py-32", "aria-labelledby": "how-title", children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(ki, { children: "How it works" }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsx(Bi, { className: "max-w-3xl", children: /* @__PURE__ */ y.jsx("span", { id: "how-title", children: "Draft. Verify. Test the impact." }) }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.15, children: /* @__PURE__ */ y.jsx(Gf, { children: "One flow in one workspace. Each stage keeps the version it worked on, so a review can never silently overwrite a newer draft." }) }),
    /* @__PURE__ */ y.jsxs("div", { className: "mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16", children: [
      /* @__PURE__ */ y.jsx("div", { children: jr.map((r, u) => /* @__PURE__ */ y.jsxs("div", { ref: (d) => {
        l.current[u] = d;
      }, "data-step": u, className: "flex min-h-0 flex-col justify-center py-6 lg:min-h-[62vh]", children: [
        /* @__PURE__ */ y.jsxs("div", { className: ft("rounded-3xl border p-7 transition-all duration-500", n === u ? "border-brand/30 bg-white shadow-[0_20px_60px_-30px_rgba(200,16,46,0.35)]" : "border-transparent opacity-60 lg:opacity-45"), children: [
          /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ y.jsx("span", { className: ft("grid size-10 place-items-center rounded-xl transition-colors", n === u ? "bg-brand text-white" : "bg-white text-ink-2 ring-1 ring-line"), children: /* @__PURE__ */ y.jsx(r.icon, { className: "size-5" }) }),
            /* @__PURE__ */ y.jsx("span", { className: "font-mono text-sm text-muted", children: r.n })
          ] }),
          /* @__PURE__ */ y.jsx("h3", { className: "mt-5 text-2xl font-bold tracking-tight text-ink md:text-3xl", children: r.title }),
          /* @__PURE__ */ y.jsx("p", { className: "mt-3 leading-relaxed text-ink-2", children: r.text })
        ] }),
        /* @__PURE__ */ y.jsx("div", { className: "mt-6 lg:hidden", children: /* @__PURE__ */ y.jsx(tf, { name: r.key, url: r.url }) })
      ] }, r.key)) }),
      /* @__PURE__ */ y.jsx("div", { className: "relative hidden lg:block", children: /* @__PURE__ */ y.jsxs("div", { className: "sticky top-28", children: [
        /* @__PURE__ */ y.jsx(tf, { name: jr[n].key, url: jr[n].url }),
        /* @__PURE__ */ y.jsx("div", { className: "mt-5 flex justify-center gap-2", "aria-hidden": "true", children: jr.map((r, u) => /* @__PURE__ */ y.jsx("span", { className: ft("h-1.5 rounded-full transition-all duration-500", n === u ? "w-10 bg-brand" : "w-4 bg-line") }, r.key)) }),
        /* @__PURE__ */ y.jsx("p", { className: "mt-3 text-center text-xs text-muted", children: "Motion graphics of the workspace with sample data." })
      ] }) })
    ] })
  ] }) });
}
function c3() {
  return /* @__PURE__ */ y.jsx("section", { id: "demo", className: "px-4 py-24 md:py-32", "aria-labelledby": "demo-title", children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto max-w-5xl text-center", children: [
    /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(ki, { children: "Demo" }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsx(Bi, { children: /* @__PURE__ */ y.jsx("span", { id: "demo-title", children: "See the whole flow in three minutes." }) }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.2, className: "mt-12", children: /* @__PURE__ */ y.jsx(RE, { animationStyle: "from-center", videoSrc: `${Da}/rulelab-demo.mp4`, thumbnailSrc: `${Da}/demo-poster.jpg`, thumbnailAlt: "RuleLab demo video", className: "mx-auto max-w-4xl" }) })
  ] }) });
}
const f3 = [
  { ok: !0, label: "UU 25/2009 · Pasal 29 ayat (1)", hash: "244cbe9a0ae0" },
  { ok: !0, label: "UU 8/2016 · Pasal 19", hash: "cae383fd43c9" },
  { ok: !1, label: "UU 25/2009 · Pasal 87 ayat (4)", hash: "not in the evidence" }
], d3 = [
  ["Brief → Draft v1", "Gemini · 6 articles"],
  ["Article 2 edited → v2", "Drafter"],
  ["Source review · 3 findings", "11 citations verified"],
  ["Proposal applied → v3", "Reviewer note attached"],
  ["A/B projection", "assumption-based model"],
  ["Exported", "Draft + review report (.docx)"]
], wg = ["SA", "NA", "BI", "DE", "RA", "AN"];
function h3() {
  return /* @__PURE__ */ y.jsx("section", { id: "produk", className: "bg-mist px-4 py-24 md:py-32", "aria-labelledby": "features-title", children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(ki, { children: "Product" }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsx(Bi, { className: "max-w-3xl", children: /* @__PURE__ */ y.jsx("span", { id: "features-title", children: "Everything a drafter needs, in one workspace." }) }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.2, className: "mt-14", children: /* @__PURE__ */ y.jsxs(YE, { className: "auto-rows-[26rem] grid-cols-1 gap-4 md:auto-rows-[22rem] md:grid-cols-3", children: [
      /* @__PURE__ */ y.jsx(
        Ri,
        {
          name: "Citation guard",
          className: "md:col-span-2",
          Icon: Rg,
          href: "/workspace",
          cta: "Verify a draft",
          description: "Each finding quotes the exact article, page and SHA-256 fingerprint. Anything outside the retrieved evidence is rejected.",
          background: /* @__PURE__ */ y.jsxs("div", { className: "absolute inset-x-6 top-6 space-y-2 [mask-image:linear-gradient(to_top,transparent_5%,#000_45%)]", children: [
            /* @__PURE__ */ y.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ y.jsx(Or, {}) }),
            f3.map((n) => /* @__PURE__ */ y.jsxs("div", { className: ft("relative flex items-center justify-between overflow-hidden rounded-xl border bg-white px-4 py-3 text-sm", n.ok ? "border-line" : "border-brand/40"), children: [
              /* @__PURE__ */ y.jsx("span", { className: "font-semibold text-ink", children: n.label }),
              /* @__PURE__ */ y.jsx("span", { className: ft("font-mono text-xs", n.ok ? "text-good" : "text-brand"), children: n.ok ? `✓ ${n.hash}` : `✕ ${n.hash}` }),
              !n.ok && /* @__PURE__ */ y.jsx(Mv, { size: 80, duration: 5, colorFrom: "#c8102e", colorTo: "#f4a6b4" })
            ] }, n.label))
          ] })
        }
      ),
      /* @__PURE__ */ y.jsx(
        Ri,
        {
          name: "Version history & audit",
          className: "md:col-span-1",
          Icon: T1,
          href: "/workspace?view=activity",
          cta: "Open activity",
          description: "Immutable versions, reviewer notes and every agent step are logged, so each change can be explained.",
          background: /* @__PURE__ */ y.jsxs("div", { className: "absolute inset-x-5 top-5 h-48 overflow-hidden md:h-56 [mask-image:linear-gradient(to_top,transparent_10%,#000_55%)]", children: [
            /* @__PURE__ */ y.jsx("div", { className: "mb-2 flex justify-end", children: /* @__PURE__ */ y.jsx(Or, {}) }),
            /* @__PURE__ */ y.jsx(jv, { delay: 1600, children: d3.map(([n, a]) => /* @__PURE__ */ y.jsxs("div", { className: "w-full rounded-xl border border-line bg-white px-3 py-2 text-left", children: [
              /* @__PURE__ */ y.jsx("div", { className: "text-sm font-semibold text-ink", children: n }),
              /* @__PURE__ */ y.jsx("div", { className: "text-xs text-muted", children: a })
            ] }, n)) })
          ] })
        }
      ),
      /* @__PURE__ */ y.jsx(
        Ri,
        {
          name: "Source-cited legal library",
          className: "md:col-span-1",
          Icon: Dg,
          href: "/workspace?view=library",
          cta: "Search the library",
          description: "Search regulations, open the original document and ask questions answered only from cited articles.",
          background: /* @__PURE__ */ y.jsxs("div", { className: "absolute inset-x-5 top-6 space-y-3 [mask-image:linear-gradient(to_top,transparent_10%,#000_55%)]", children: [
            /* @__PURE__ */ y.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ y.jsx(Or, {}) }),
            /* @__PURE__ */ y.jsx("div", { className: "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white", children: "What must agencies provide for people with disabilities?" }),
            /* @__PURE__ */ y.jsxs("div", { className: "max-w-[90%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-ink ring-1 ring-line", children: [
              "Reasonable accommodation in public services… ",
              /* @__PURE__ */ y.jsx("span", { className: "mt-1 block text-xs font-semibold text-good", children: "UU 8/2016 · Pasal 19 · source-verified" })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ y.jsx(
        Ri,
        {
          name: "Persona & crowd simulation",
          className: "md:col-span-2",
          Icon: Ng,
          href: "/workspace?view=social",
          cta: "Run the forum",
          description: "8–32 synthetic personas debate drafts A and B over up to five rounds; a crowd network shows how opinions could spread. Not a survey.",
          background: /* @__PURE__ */ y.jsx("div", { className: "absolute inset-x-0 top-0 flex h-[58%] items-center justify-center [mask-image:linear-gradient(to_top,transparent_5%,#000_45%)] md:left-auto md:right-0 md:h-full md:w-2/3 md:[mask-image:linear-gradient(to_top,transparent_15%,#000_60%)]", children: /* @__PURE__ */ y.jsxs("div", { className: "relative flex size-[300px] scale-[0.7] items-center justify-center md:scale-100", children: [
            /* @__PURE__ */ y.jsx("span", { className: "z-10 grid size-16 place-items-center rounded-full bg-ink text-sm font-bold text-white", children: "Draft" }),
            /* @__PURE__ */ y.jsx(bg, { iconSize: 38, radius: 95, duration: 26, children: wg.slice(0, 3).map((n) => /* @__PURE__ */ y.jsx("span", { className: "grid size-9 place-items-center rounded-full bg-brand text-xs font-bold text-white", children: n }, n)) }),
            /* @__PURE__ */ y.jsx(bg, { iconSize: 30, radius: 140, duration: 34, reverse: !0, children: wg.slice(3).map((n) => /* @__PURE__ */ y.jsx("span", { className: "grid size-8 place-items-center rounded-full bg-white text-xs font-bold text-ink ring-1 ring-line", children: n }, n)) })
          ] }) })
        }
      ),
      /* @__PURE__ */ y.jsx(
        Ri,
        {
          name: "Regulation map of Indonesia",
          className: "md:col-span-1",
          Icon: E1,
          href: "#koleksi",
          cta: "Explore the map",
          description: "Browse the collection by issuer, coverage or regional mentions across all 38 provinces.",
          background: /* @__PURE__ */ y.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,#fde2e7,transparent_55%)]" })
        }
      ),
      /* @__PURE__ */ y.jsx(
        Ri,
        {
          name: "Official format & Word export",
          className: "md:col-span-1",
          Icon: x1,
          href: "/workspace",
          cta: "Start a draft",
          description: "Fifteen regulation types with considerations, legal basis and numbered articles; export the draft and the review report to .docx.",
          background: /* @__PURE__ */ y.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#eef1f6,transparent_60%)]" })
        }
      ),
      /* @__PURE__ */ y.jsx(
        Ri,
        {
          name: "A/B impact model",
          className: "md:col-span-1",
          Icon: j1,
          href: "/workspace",
          cta: "Compare drafts",
          description: "A transparent, assumption-based model: served = N·p + N·(1−p)·q, with ±10-point sensitivity. No LLM arithmetic.",
          background: /* @__PURE__ */ y.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,#e8f6ee,transparent_60%)]" })
        }
      )
    ] }) })
  ] }) });
}
function Bs({ refEl: n, icon: a, label: l, sub: r, className: u }) {
  return /* @__PURE__ */ y.jsxs("div", { ref: n, className: ft("z-10 flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-white px-3 py-3 shadow-sm sm:px-4", u), children: [
    /* @__PURE__ */ y.jsx("span", { className: "grid size-9 place-items-center rounded-xl bg-mist text-ink", children: /* @__PURE__ */ y.jsx(a, { className: "size-5" }) }),
    /* @__PURE__ */ y.jsxs("div", { className: "text-left", children: [
      /* @__PURE__ */ y.jsx("div", { className: "text-sm font-bold text-ink", children: l }),
      r && /* @__PURE__ */ y.jsx("div", { className: "text-xs text-muted", children: r })
    ] })
  ] });
}
function m3() {
  const n = C.useRef(null), a = C.useRef(null), l = C.useRef(null), r = C.useRef(null), u = C.useRef(null), d = C.useRef(null), f = C.useRef(null), m = [
    [Rg, "Every claim has a source", "Article, page and SHA-256 fingerprint of the original document."],
    [Cg, "Out-of-evidence citations are rejected", "Model output is validated against a strict schema and the retrieved evidence."],
    [S1, "Versions are immutable", "A review bound to an older version can never overwrite a newer draft."],
    [A1, "People decide", "RuleLab supports drafters; it does not certify legal validity."]
  ];
  return /* @__PURE__ */ y.jsx("section", { id: "sumber", className: "px-4 py-24 md:py-32", "aria-labelledby": "trust-title", children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(ki, { children: "Trust" }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsx(Bi, { className: "max-w-3xl", children: /* @__PURE__ */ y.jsx("span", { id: "trust-title", children: "Every claim can be traced." }) }) }),
    /* @__PURE__ */ y.jsxs("div", { className: "mt-14 grid items-center gap-12 lg:grid-cols-2", children: [
      /* @__PURE__ */ y.jsxs("div", { ref: n, className: "relative flex min-h-[380px] flex-col items-center justify-between gap-8 rounded-3xl border border-line bg-mist p-5 sm:flex-row sm:gap-6 md:p-10", children: [
        /* @__PURE__ */ y.jsx("div", { className: "flex flex-col gap-10", children: /* @__PURE__ */ y.jsx(Bs, { refEl: a, icon: jg, label: "Your draft", sub: "brief, article, question" }) }),
        /* @__PURE__ */ y.jsxs("div", { ref: l, className: "z-10 flex flex-col items-center gap-2 rounded-3xl bg-ink px-5 py-6 text-white shadow-xl", children: [
          /* @__PURE__ */ y.jsx(Jr, { size: 40 }),
          /* @__PURE__ */ y.jsx("span", { className: "text-sm font-bold", children: "RuleLab" }),
          /* @__PURE__ */ y.jsx("span", { className: "text-[11px] text-white/70", children: "agents + validators" })
        ] }),
        /* @__PURE__ */ y.jsxs("div", { className: "grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-col sm:gap-4", children: [
          /* @__PURE__ */ y.jsx(Bs, { refEl: r, icon: y1, label: "Gemini", sub: "Vertex AI" }),
          /* @__PURE__ */ y.jsx(Bs, { refEl: u, icon: Dg, label: "Elasticsearch", sub: "BM25 + vectors" }),
          /* @__PURE__ */ y.jsx(Bs, { refEl: d, icon: b1, label: "Cloud SQL", sub: "versions & audit" }),
          /* @__PURE__ */ y.jsx(Bs, { refEl: f, icon: v1, label: "Cloud Storage", sub: "original documents" })
        ] }),
        /* @__PURE__ */ y.jsx(mg, { containerRef: n, fromRef: a, toRef: l, pathColor: "#c9ced6", pathWidth: 2, pathOpacity: 0.6, gradientStartColor: "#c8102e", gradientStopColor: "#f4a6b4" }),
        [r, u, d, f].map((h, p) => /* @__PURE__ */ y.jsx(mg, { containerRef: n, fromRef: l, toRef: h, curvature: (p - 1.5) * 28, delay: p * 0.4, pathColor: "#c9ced6", pathWidth: 2, pathOpacity: 0.6, gradientStartColor: "#c8102e", gradientStopColor: "#f4a6b4" }, p))
      ] }),
      /* @__PURE__ */ y.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: m.map(([h, p, v], x) => /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1 + x * 0.08, children: /* @__PURE__ */ y.jsx(JE, { className: "h-full rounded-2xl", gradientColor: "#fde2e7", children: /* @__PURE__ */ y.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ y.jsx(h, { className: "size-6 text-brand" }),
        /* @__PURE__ */ y.jsx("h3", { className: "mt-4 font-bold text-ink", children: p }),
        /* @__PURE__ */ y.jsx("p", { className: "mt-2 text-sm leading-relaxed text-ink-2", children: v })
      ] }) }) }, p)) })
    ] }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.2, className: "mt-12", children: /* @__PURE__ */ y.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ y.jsx("div", { className: "absolute right-4 top-3 z-10", children: /* @__PURE__ */ y.jsx(Or, { children: "Sample log" }) }),
      /* @__PURE__ */ y.jsxs(KE, { className: "max-w-none", children: [
        /* @__PURE__ */ y.jsx(xg, { children: "> review draft v2 · 4 articles" }),
        /* @__PURE__ */ y.jsx(Mr, { className: "text-ink-2", children: "retrieved 27 articles · hybrid BM25 + vector" }),
        /* @__PURE__ */ y.jsx(Mr, { className: "text-good", children: "✓ UU 25/2009 Pasal 29 ayat (1) · quote matches · sha256 244cbe9a…" }),
        /* @__PURE__ */ y.jsx(Mr, { className: "text-good", children: "✓ UU 8/2016 Pasal 19 · quote matches · sha256 cae383fd…" }),
        /* @__PURE__ */ y.jsx(Mr, { className: "text-brand", children: "✕ UU 25/2009 Pasal 87 ayat (4) · not in the evidence → rejected" }),
        /* @__PURE__ */ y.jsx(xg, { className: "text-ink", children: "3 findings ready for human review" })
      ] })
    ] }) })
  ] }) });
}
function p3() {
  const n = [["Heard", "People can give their views."], ["Considered", "Their input is weighed in the text."], ["Answered", "They receive an explanation."]];
  return /* @__PURE__ */ y.jsx("section", { id: "partisipasi", className: "bg-mist px-4 py-24 md:py-32", "aria-labelledby": "participation-title", children: /* @__PURE__ */ y.jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(ki, { children: "Public participation" }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsx(Bi, { className: "max-w-4xl", children: /* @__PURE__ */ y.jsxs("span", { id: "participation-title", children: [
      "Prepare public consultation. ",
      /* @__PURE__ */ y.jsx(_v, { children: "Don’t replace it." })
    ] }) }) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.15, children: /* @__PURE__ */ y.jsx(Gf, { children: "The Constitutional Court describes meaningful participation as three rights. Synthetic personas help drafters anticipate concerns; only real people can exercise these rights." }) }),
    /* @__PURE__ */ y.jsx("div", { className: "mt-12 grid gap-4 md:grid-cols-3", children: n.map(([a, l], r) => /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1 + r * 0.1, children: /* @__PURE__ */ y.jsxs("div", { className: "rounded-3xl border border-line bg-white p-7", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "font-mono text-sm text-muted", children: [
        "0",
        r + 1
      ] }),
      /* @__PURE__ */ y.jsx("div", { className: "mt-3 text-2xl font-bold text-ink", children: a }),
      /* @__PURE__ */ y.jsx("p", { className: "mt-2 text-ink-2", children: l })
    ] }) }, a)) }),
    /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.2, children: /* @__PURE__ */ y.jsxs("div", { className: "mt-10 flex flex-wrap items-center gap-3 text-sm", children: [
      /* @__PURE__ */ y.jsx("span", { className: "font-bold uppercase tracking-[0.18em] text-brand", children: "Next" }),
      ["Practitioner validation", "Real public-input module", "Response report for consultations"].map((a) => /* @__PURE__ */ y.jsx("span", { className: "rounded-full border border-line bg-white px-4 py-2 font-medium text-ink-2", children: a }, a))
    ] }) })
  ] }) });
}
function g3() {
  return /* @__PURE__ */ y.jsxs("section", { className: "relative overflow-hidden px-4 py-28 md:py-40", "aria-labelledby": "closing-title", children: [
    /* @__PURE__ */ y.jsx(zv, { className: "pointer-events-none text-neutral-300/80 [mask-image:radial-gradient(520px_circle_at_center,white,transparent)]" }),
    /* @__PURE__ */ y.jsxs("div", { className: "relative mx-auto max-w-4xl text-center", children: [
      /* @__PURE__ */ y.jsx(wt, { inView: !0, children: /* @__PURE__ */ y.jsx(Jr, { size: 56 }) }),
      /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.1, children: /* @__PURE__ */ y.jsxs("h2", { id: "closing-title", className: "mt-8 text-balance text-5xl font-bold tracking-[-0.045em] text-ink md:text-7xl", children: [
        "Laws that fit together — ",
        /* @__PURE__ */ y.jsx(_v, { children: "and fit the people they serve." })
      ] }) }),
      /* @__PURE__ */ y.jsx(wt, { inView: !0, delay: 0.2, children: /* @__PURE__ */ y.jsxs("div", { className: "mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ y.jsx("a", { href: "/workspace", children: /* @__PURE__ */ y.jsxs(Hf, { background: "#c8102e", shimmerColor: "#ffd6dd", className: "px-7 py-3.5 text-base font-semibold", children: [
          "Open the workspace ",
          /* @__PURE__ */ y.jsx(Ks, { className: "ml-2 size-4" })
        ] }) }),
        /* @__PURE__ */ y.jsx("a", { href: qf, rel: "noopener", children: /* @__PURE__ */ y.jsx(PE, { className: "border-line bg-white text-ink", children: "View on GitHub" }) })
      ] }) })
    ] })
  ] });
}
function y3() {
  return /* @__PURE__ */ y.jsxs("footer", { className: "border-t border-line px-4 py-10", children: [
    /* @__PURE__ */ y.jsxs("div", { className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ y.jsx(Jr, { size: 22 }),
        /* @__PURE__ */ y.jsx("span", { className: "font-semibold text-ink", children: "RuleLab" }),
        /* @__PURE__ */ y.jsx("span", { children: "· Team RuleLab" })
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-5", children: [
        /* @__PURE__ */ y.jsx("a", { href: "/guide", className: "hover:text-ink", children: "User guide" }),
        /* @__PURE__ */ y.jsxs("a", { href: qf, rel: "noopener", className: "inline-flex items-center gap-1.5 hover:text-ink", children: [
          /* @__PURE__ */ y.jsx(w1, { className: "size-4" }),
          "GitHub"
        ] }),
        /* @__PURE__ */ y.jsx("span", { children: "Built with Gemini · Google Cloud" })
      ] })
    ] }),
    /* @__PURE__ */ y.jsx("p", { className: "mx-auto mt-6 max-w-6xl text-center text-xs text-muted md:text-left", children: "RuleLab supports review; it does not certify legal validity. Source texts are snapshots, not consolidated law in force. Persona opinions are synthetic." })
  ] });
}
const Tg = document.getElementById("landing-top"), Ag = document.getElementById("landing-bottom");
Tg && Eg.createRoot(Tg).render(/* @__PURE__ */ y.jsxs(y.Fragment, { children: [
  /* @__PURE__ */ y.jsx(a3, {}),
  /* @__PURE__ */ y.jsx(s3, {}),
  /* @__PURE__ */ y.jsx(r3, {}),
  /* @__PURE__ */ y.jsx(o3, {}),
  /* @__PURE__ */ y.jsx(u3, {}),
  /* @__PURE__ */ y.jsx(c3, {}),
  /* @__PURE__ */ y.jsx(h3, {})
] }));
Ag && Eg.createRoot(Ag).render(/* @__PURE__ */ y.jsxs(y.Fragment, { children: [
  /* @__PURE__ */ y.jsx(m3, {}),
  /* @__PURE__ */ y.jsx(p3, {}),
  /* @__PURE__ */ y.jsx(g3, {}),
  /* @__PURE__ */ y.jsx(y3, {})
] }));
document.documentElement.classList.add("landing-ready");
