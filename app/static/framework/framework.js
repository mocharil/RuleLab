var cT = Object.defineProperty;
var fT = (n, i, s) => i in n ? cT(n, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[i] = s;
var rr = (n, i, s) => fT(n, typeof i != "symbol" ? i + "" : i, s);
function dT(n, i) {
  for (var s = 0; s < i.length; s++) {
    const l = i[s];
    if (typeof l != "string" && !Array.isArray(l)) {
      for (const u in l)
        if (u !== "default" && !(u in n)) {
          const f = Object.getOwnPropertyDescriptor(l, u);
          f && Object.defineProperty(n, u, f.get ? f : {
            enumerable: !0,
            get: () => l[u]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
function Vy(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Gc = { exports: {} }, lr = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ng;
function hT() {
  if (Ng) return lr;
  Ng = 1;
  var n = Symbol.for("react.transitional.element"), i = Symbol.for("react.fragment");
  function s(l, u, f) {
    var d = null;
    if (f !== void 0 && (d = "" + f), u.key !== void 0 && (d = "" + u.key), "key" in u) {
      f = {};
      for (var h in u)
        h !== "key" && (f[h] = u[h]);
    } else f = u;
    return u = f.ref, {
      $$typeof: n,
      type: l,
      key: d,
      ref: u !== void 0 ? u : null,
      props: f
    };
  }
  return lr.Fragment = i, lr.jsx = s, lr.jsxs = s, lr;
}
var jg;
function mT() {
  return jg || (jg = 1, Gc.exports = hT()), Gc.exports;
}
var S = mT(), Yc = { exports: {} }, or = {}, Xc = { exports: {} }, Kc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _g;
function pT() {
  return _g || (_g = 1, function(n) {
    function i(P, $) {
      var Y = P.length;
      P.push($);
      t: for (; 0 < Y; ) {
        var nt = Y - 1 >>> 1, C = P[nt];
        if (0 < u(C, $))
          P[nt] = $, P[Y] = C, Y = nt;
        else break t;
      }
    }
    function s(P) {
      return P.length === 0 ? null : P[0];
    }
    function l(P) {
      if (P.length === 0) return null;
      var $ = P[0], Y = P.pop();
      if (Y !== $) {
        P[0] = Y;
        t: for (var nt = 0, C = P.length, K = C >>> 1; nt < K; ) {
          var rt = 2 * (nt + 1) - 1, at = P[rt], J = rt + 1, dt = P[J];
          if (0 > u(at, Y))
            J < C && 0 > u(dt, at) ? (P[nt] = dt, P[J] = Y, nt = J) : (P[nt] = at, P[rt] = Y, nt = rt);
          else if (J < C && 0 > u(dt, Y))
            P[nt] = dt, P[J] = Y, nt = J;
          else break t;
        }
      }
      return $;
    }
    function u(P, $) {
      var Y = P.sortIndex - $.sortIndex;
      return Y !== 0 ? Y : P.id - $.id;
    }
    if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      n.unstable_now = function() {
        return f.now();
      };
    } else {
      var d = Date, h = d.now();
      n.unstable_now = function() {
        return d.now() - h;
      };
    }
    var m = [], p = [], g = 1, y = null, b = 3, T = !1, R = !1, w = !1, M = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, z = typeof setImmediate < "u" ? setImmediate : null;
    function U(P) {
      for (var $ = s(p); $ !== null; ) {
        if ($.callback === null) l(p);
        else if ($.startTime <= P)
          l(p), $.sortIndex = $.expirationTime, i(m, $);
        else break;
        $ = s(p);
      }
    }
    function q(P) {
      if (w = !1, U(P), !R)
        if (s(m) !== null)
          R = !0, pt();
        else {
          var $ = s(p);
          $ !== null && yt(q, $.startTime - P);
        }
    }
    var V = !1, L = -1, Z = 5, F = -1;
    function Q() {
      return !(n.unstable_now() - F < Z);
    }
    function W() {
      if (V) {
        var P = n.unstable_now();
        F = P;
        var $ = !0;
        try {
          t: {
            R = !1, w && (w = !1, O(L), L = -1), T = !0;
            var Y = b;
            try {
              e: {
                for (U(P), y = s(m); y !== null && !(y.expirationTime > P && Q()); ) {
                  var nt = y.callback;
                  if (typeof nt == "function") {
                    y.callback = null, b = y.priorityLevel;
                    var C = nt(
                      y.expirationTime <= P
                    );
                    if (P = n.unstable_now(), typeof C == "function") {
                      y.callback = C, U(P), $ = !0;
                      break e;
                    }
                    y === s(m) && l(m), U(P);
                  } else l(m);
                  y = s(m);
                }
                if (y !== null) $ = !0;
                else {
                  var K = s(p);
                  K !== null && yt(
                    q,
                    K.startTime - P
                  ), $ = !1;
                }
              }
              break t;
            } finally {
              y = null, b = Y, T = !1;
            }
            $ = void 0;
          }
        } finally {
          $ ? mt() : V = !1;
        }
      }
    }
    var mt;
    if (typeof z == "function")
      mt = function() {
        z(W);
      };
    else if (typeof MessageChannel < "u") {
      var Rt = new MessageChannel(), ft = Rt.port2;
      Rt.port1.onmessage = W, mt = function() {
        ft.postMessage(null);
      };
    } else
      mt = function() {
        M(W, 0);
      };
    function pt() {
      V || (V = !0, mt());
    }
    function yt(P, $) {
      L = M(function() {
        P(n.unstable_now());
      }, $);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(P) {
      P.callback = null;
    }, n.unstable_continueExecution = function() {
      R || T || (R = !0, pt());
    }, n.unstable_forceFrameRate = function(P) {
      0 > P || 125 < P ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Z = 0 < P ? Math.floor(1e3 / P) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return b;
    }, n.unstable_getFirstCallbackNode = function() {
      return s(m);
    }, n.unstable_next = function(P) {
      switch (b) {
        case 1:
        case 2:
        case 3:
          var $ = 3;
          break;
        default:
          $ = b;
      }
      var Y = b;
      b = $;
      try {
        return P();
      } finally {
        b = Y;
      }
    }, n.unstable_pauseExecution = function() {
    }, n.unstable_requestPaint = function() {
    }, n.unstable_runWithPriority = function(P, $) {
      switch (P) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          P = 3;
      }
      var Y = b;
      b = P;
      try {
        return $();
      } finally {
        b = Y;
      }
    }, n.unstable_scheduleCallback = function(P, $, Y) {
      var nt = n.unstable_now();
      switch (typeof Y == "object" && Y !== null ? (Y = Y.delay, Y = typeof Y == "number" && 0 < Y ? nt + Y : nt) : Y = nt, P) {
        case 1:
          var C = -1;
          break;
        case 2:
          C = 250;
          break;
        case 5:
          C = 1073741823;
          break;
        case 4:
          C = 1e4;
          break;
        default:
          C = 5e3;
      }
      return C = Y + C, P = {
        id: g++,
        callback: $,
        priorityLevel: P,
        startTime: Y,
        expirationTime: C,
        sortIndex: -1
      }, Y > nt ? (P.sortIndex = Y, i(p, P), s(m) === null && P === s(p) && (w ? (O(L), L = -1) : w = !0, yt(q, Y - nt))) : (P.sortIndex = C, i(m, P), R || T || (R = !0, pt())), P;
    }, n.unstable_shouldYield = Q, n.unstable_wrapCallback = function(P) {
      var $ = b;
      return function() {
        var Y = b;
        b = $;
        try {
          return P.apply(this, arguments);
        } finally {
          b = Y;
        }
      };
    };
  }(Kc)), Kc;
}
var zg;
function gT() {
  return zg || (zg = 1, Xc.exports = pT()), Xc.exports;
}
var Zc = { exports: {} }, ht = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vg;
function vT() {
  if (Vg) return ht;
  Vg = 1;
  var n = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), l = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), f = Symbol.for("react.consumer"), d = Symbol.for("react.context"), h = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), y = Symbol.iterator;
  function b(C) {
    return C === null || typeof C != "object" ? null : (C = y && C[y] || C["@@iterator"], typeof C == "function" ? C : null);
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
  }, R = Object.assign, w = {};
  function M(C, K, rt) {
    this.props = C, this.context = K, this.refs = w, this.updater = rt || T;
  }
  M.prototype.isReactComponent = {}, M.prototype.setState = function(C, K) {
    if (typeof C != "object" && typeof C != "function" && C != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, C, K, "setState");
  }, M.prototype.forceUpdate = function(C) {
    this.updater.enqueueForceUpdate(this, C, "forceUpdate");
  };
  function O() {
  }
  O.prototype = M.prototype;
  function z(C, K, rt) {
    this.props = C, this.context = K, this.refs = w, this.updater = rt || T;
  }
  var U = z.prototype = new O();
  U.constructor = z, R(U, M.prototype), U.isPureReactComponent = !0;
  var q = Array.isArray, V = { H: null, A: null, T: null, S: null }, L = Object.prototype.hasOwnProperty;
  function Z(C, K, rt, at, J, dt) {
    return rt = dt.ref, {
      $$typeof: n,
      type: C,
      key: K,
      ref: rt !== void 0 ? rt : null,
      props: dt
    };
  }
  function F(C, K) {
    return Z(
      C.type,
      K,
      void 0,
      void 0,
      void 0,
      C.props
    );
  }
  function Q(C) {
    return typeof C == "object" && C !== null && C.$$typeof === n;
  }
  function W(C) {
    var K = { "=": "=0", ":": "=2" };
    return "$" + C.replace(/[=:]/g, function(rt) {
      return K[rt];
    });
  }
  var mt = /\/+/g;
  function Rt(C, K) {
    return typeof C == "object" && C !== null && C.key != null ? W("" + C.key) : K.toString(36);
  }
  function ft() {
  }
  function pt(C) {
    switch (C.status) {
      case "fulfilled":
        return C.value;
      case "rejected":
        throw C.reason;
      default:
        switch (typeof C.status == "string" ? C.then(ft, ft) : (C.status = "pending", C.then(
          function(K) {
            C.status === "pending" && (C.status = "fulfilled", C.value = K);
          },
          function(K) {
            C.status === "pending" && (C.status = "rejected", C.reason = K);
          }
        )), C.status) {
          case "fulfilled":
            return C.value;
          case "rejected":
            throw C.reason;
        }
    }
    throw C;
  }
  function yt(C, K, rt, at, J) {
    var dt = typeof C;
    (dt === "undefined" || dt === "boolean") && (C = null);
    var ut = !1;
    if (C === null) ut = !0;
    else
      switch (dt) {
        case "bigint":
        case "string":
        case "number":
          ut = !0;
          break;
        case "object":
          switch (C.$$typeof) {
            case n:
            case i:
              ut = !0;
              break;
            case g:
              return ut = C._init, yt(
                ut(C._payload),
                K,
                rt,
                at,
                J
              );
          }
      }
    if (ut)
      return J = J(C), ut = at === "" ? "." + Rt(C, 0) : at, q(J) ? (rt = "", ut != null && (rt = ut.replace(mt, "$&/") + "/"), yt(J, K, rt, "", function(Vt) {
        return Vt;
      })) : J != null && (Q(J) && (J = F(
        J,
        rt + (J.key == null || C && C.key === J.key ? "" : ("" + J.key).replace(
          mt,
          "$&/"
        ) + "/") + ut
      )), K.push(J)), 1;
    ut = 0;
    var zt = at === "" ? "." : at + ":";
    if (q(C))
      for (var At = 0; At < C.length; At++)
        at = C[At], dt = zt + Rt(at, At), ut += yt(
          at,
          K,
          rt,
          dt,
          J
        );
    else if (At = b(C), typeof At == "function")
      for (C = At.call(C), At = 0; !(at = C.next()).done; )
        at = at.value, dt = zt + Rt(at, At++), ut += yt(
          at,
          K,
          rt,
          dt,
          J
        );
    else if (dt === "object") {
      if (typeof C.then == "function")
        return yt(
          pt(C),
          K,
          rt,
          at,
          J
        );
      throw K = String(C), Error(
        "Objects are not valid as a React child (found: " + (K === "[object Object]" ? "object with keys {" + Object.keys(C).join(", ") + "}" : K) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ut;
  }
  function P(C, K, rt) {
    if (C == null) return C;
    var at = [], J = 0;
    return yt(C, at, "", "", function(dt) {
      return K.call(rt, dt, J++);
    }), at;
  }
  function $(C) {
    if (C._status === -1) {
      var K = C._result;
      K = K(), K.then(
        function(rt) {
          (C._status === 0 || C._status === -1) && (C._status = 1, C._result = rt);
        },
        function(rt) {
          (C._status === 0 || C._status === -1) && (C._status = 2, C._result = rt);
        }
      ), C._status === -1 && (C._status = 0, C._result = K);
    }
    if (C._status === 1) return C._result.default;
    throw C._result;
  }
  var Y = typeof reportError == "function" ? reportError : function(C) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var K = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof C == "object" && C !== null && typeof C.message == "string" ? String(C.message) : String(C),
        error: C
      });
      if (!window.dispatchEvent(K)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", C);
      return;
    }
    console.error(C);
  };
  function nt() {
  }
  return ht.Children = {
    map: P,
    forEach: function(C, K, rt) {
      P(
        C,
        function() {
          K.apply(this, arguments);
        },
        rt
      );
    },
    count: function(C) {
      var K = 0;
      return P(C, function() {
        K++;
      }), K;
    },
    toArray: function(C) {
      return P(C, function(K) {
        return K;
      }) || [];
    },
    only: function(C) {
      if (!Q(C))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return C;
    }
  }, ht.Component = M, ht.Fragment = s, ht.Profiler = u, ht.PureComponent = z, ht.StrictMode = l, ht.Suspense = m, ht.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, ht.act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, ht.cache = function(C) {
    return function() {
      return C.apply(null, arguments);
    };
  }, ht.cloneElement = function(C, K, rt) {
    if (C == null)
      throw Error(
        "The argument must be a React element, but you passed " + C + "."
      );
    var at = R({}, C.props), J = C.key, dt = void 0;
    if (K != null)
      for (ut in K.ref !== void 0 && (dt = void 0), K.key !== void 0 && (J = "" + K.key), K)
        !L.call(K, ut) || ut === "key" || ut === "__self" || ut === "__source" || ut === "ref" && K.ref === void 0 || (at[ut] = K[ut]);
    var ut = arguments.length - 2;
    if (ut === 1) at.children = rt;
    else if (1 < ut) {
      for (var zt = Array(ut), At = 0; At < ut; At++)
        zt[At] = arguments[At + 2];
      at.children = zt;
    }
    return Z(C.type, J, void 0, void 0, dt, at);
  }, ht.createContext = function(C) {
    return C = {
      $$typeof: d,
      _currentValue: C,
      _currentValue2: C,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, C.Provider = C, C.Consumer = {
      $$typeof: f,
      _context: C
    }, C;
  }, ht.createElement = function(C, K, rt) {
    var at, J = {}, dt = null;
    if (K != null)
      for (at in K.key !== void 0 && (dt = "" + K.key), K)
        L.call(K, at) && at !== "key" && at !== "__self" && at !== "__source" && (J[at] = K[at]);
    var ut = arguments.length - 2;
    if (ut === 1) J.children = rt;
    else if (1 < ut) {
      for (var zt = Array(ut), At = 0; At < ut; At++)
        zt[At] = arguments[At + 2];
      J.children = zt;
    }
    if (C && C.defaultProps)
      for (at in ut = C.defaultProps, ut)
        J[at] === void 0 && (J[at] = ut[at]);
    return Z(C, dt, void 0, void 0, null, J);
  }, ht.createRef = function() {
    return { current: null };
  }, ht.forwardRef = function(C) {
    return { $$typeof: h, render: C };
  }, ht.isValidElement = Q, ht.lazy = function(C) {
    return {
      $$typeof: g,
      _payload: { _status: -1, _result: C },
      _init: $
    };
  }, ht.memo = function(C, K) {
    return {
      $$typeof: p,
      type: C,
      compare: K === void 0 ? null : K
    };
  }, ht.startTransition = function(C) {
    var K = V.T, rt = {};
    V.T = rt;
    try {
      var at = C(), J = V.S;
      J !== null && J(rt, at), typeof at == "object" && at !== null && typeof at.then == "function" && at.then(nt, Y);
    } catch (dt) {
      Y(dt);
    } finally {
      V.T = K;
    }
  }, ht.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, ht.use = function(C) {
    return V.H.use(C);
  }, ht.useActionState = function(C, K, rt) {
    return V.H.useActionState(C, K, rt);
  }, ht.useCallback = function(C, K) {
    return V.H.useCallback(C, K);
  }, ht.useContext = function(C) {
    return V.H.useContext(C);
  }, ht.useDebugValue = function() {
  }, ht.useDeferredValue = function(C, K) {
    return V.H.useDeferredValue(C, K);
  }, ht.useEffect = function(C, K) {
    return V.H.useEffect(C, K);
  }, ht.useId = function() {
    return V.H.useId();
  }, ht.useImperativeHandle = function(C, K, rt) {
    return V.H.useImperativeHandle(C, K, rt);
  }, ht.useInsertionEffect = function(C, K) {
    return V.H.useInsertionEffect(C, K);
  }, ht.useLayoutEffect = function(C, K) {
    return V.H.useLayoutEffect(C, K);
  }, ht.useMemo = function(C, K) {
    return V.H.useMemo(C, K);
  }, ht.useOptimistic = function(C, K) {
    return V.H.useOptimistic(C, K);
  }, ht.useReducer = function(C, K, rt) {
    return V.H.useReducer(C, K, rt);
  }, ht.useRef = function(C) {
    return V.H.useRef(C);
  }, ht.useState = function(C) {
    return V.H.useState(C);
  }, ht.useSyncExternalStore = function(C, K, rt) {
    return V.H.useSyncExternalStore(
      C,
      K,
      rt
    );
  }, ht.useTransition = function() {
    return V.H.useTransition();
  }, ht.version = "19.0.0", ht;
}
var Lg;
function Wf() {
  return Lg || (Lg = 1, Zc.exports = vT()), Zc.exports;
}
var Qc = { exports: {} }, ue = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bg;
function yT() {
  if (Bg) return ue;
  Bg = 1;
  var n = Wf();
  function i(m) {
    var p = "https://react.dev/errors/" + m;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var g = 2; g < arguments.length; g++)
        p += "&args[]=" + encodeURIComponent(arguments[g]);
    }
    return "Minified React error #" + m + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function s() {
  }
  var l = {
    d: {
      f: s,
      r: function() {
        throw Error(i(522));
      },
      D: s,
      C: s,
      L: s,
      m: s,
      X: s,
      S: s,
      M: s
    },
    p: 0,
    findDOMNode: null
  }, u = Symbol.for("react.portal");
  function f(m, p, g) {
    var y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: u,
      key: y == null ? null : "" + y,
      children: m,
      containerInfo: p,
      implementation: g
    };
  }
  var d = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function h(m, p) {
    if (m === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return ue.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l, ue.createPortal = function(m, p) {
    var g = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(i(299));
    return f(m, p, null, g);
  }, ue.flushSync = function(m) {
    var p = d.T, g = l.p;
    try {
      if (d.T = null, l.p = 2, m) return m();
    } finally {
      d.T = p, l.p = g, l.d.f();
    }
  }, ue.preconnect = function(m, p) {
    typeof m == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, l.d.C(m, p));
  }, ue.prefetchDNS = function(m) {
    typeof m == "string" && l.d.D(m);
  }, ue.preinit = function(m, p) {
    if (typeof m == "string" && p && typeof p.as == "string") {
      var g = p.as, y = h(g, p.crossOrigin), b = typeof p.integrity == "string" ? p.integrity : void 0, T = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      g === "style" ? l.d.S(
        m,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: y,
          integrity: b,
          fetchPriority: T
        }
      ) : g === "script" && l.d.X(m, {
        crossOrigin: y,
        integrity: b,
        fetchPriority: T,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, ue.preinitModule = function(m, p) {
    if (typeof m == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var g = h(
            p.as,
            p.crossOrigin
          );
          l.d.M(m, {
            crossOrigin: g,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && l.d.M(m);
  }, ue.preload = function(m, p) {
    if (typeof m == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var g = p.as, y = h(g, p.crossOrigin);
      l.d.L(m, g, {
        crossOrigin: y,
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
  }, ue.preloadModule = function(m, p) {
    if (typeof m == "string")
      if (p) {
        var g = h(p.as, p.crossOrigin);
        l.d.m(m, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: g,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else l.d.m(m);
  }, ue.requestFormReset = function(m) {
    l.d.r(m);
  }, ue.unstable_batchedUpdates = function(m, p) {
    return m(p);
  }, ue.useFormState = function(m, p, g) {
    return d.H.useFormState(m, p, g);
  }, ue.useFormStatus = function() {
    return d.H.useHostTransitionStatus();
  }, ue.version = "19.0.0", ue;
}
var Ug;
function Ly() {
  if (Ug) return Qc.exports;
  Ug = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), Qc.exports = yT(), Qc.exports;
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
var kg;
function bT() {
  if (kg) return or;
  kg = 1;
  var n = gT(), i = Wf(), s = Ly();
  function l(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        e += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function u(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  var f = Symbol.for("react.element"), d = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), m = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), y = Symbol.for("react.provider"), b = Symbol.for("react.consumer"), T = Symbol.for("react.context"), R = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), M = Symbol.for("react.suspense_list"), O = Symbol.for("react.memo"), z = Symbol.for("react.lazy"), U = Symbol.for("react.offscreen"), q = Symbol.for("react.memo_cache_sentinel"), V = Symbol.iterator;
  function L(t) {
    return t === null || typeof t != "object" ? null : (t = V && t[V] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var Z = Symbol.for("react.client.reference");
  function F(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === Z ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case m:
        return "Fragment";
      case h:
        return "Portal";
      case g:
        return "Profiler";
      case p:
        return "StrictMode";
      case w:
        return "Suspense";
      case M:
        return "SuspenseList";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case T:
          return (t.displayName || "Context") + ".Provider";
        case b:
          return (t._context.displayName || "Context") + ".Consumer";
        case R:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case O:
          return e = t.displayName || null, e !== null ? e : F(t.type) || "Memo";
        case z:
          e = t._payload, t = t._init;
          try {
            return F(t(e));
          } catch {
          }
      }
    return null;
  }
  var Q = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, W = Object.assign, mt, Rt;
  function ft(t) {
    if (mt === void 0)
      try {
        throw Error();
      } catch (a) {
        var e = a.stack.trim().match(/\n( *(at )?)/);
        mt = e && e[1] || "", Rt = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + mt + t + Rt;
  }
  var pt = !1;
  function yt(t, e) {
    if (!t || pt) return "";
    pt = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var r = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var X = function() {
                throw Error();
              };
              if (Object.defineProperty(X.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(X, []);
                } catch (k) {
                  var B = k;
                }
                Reflect.construct(t, [], X);
              } else {
                try {
                  X.call();
                } catch (k) {
                  B = k;
                }
                t.call(X.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (k) {
                B = k;
              }
              (X = t()) && typeof X.catch == "function" && X.catch(function() {
              });
            }
          } catch (k) {
            if (k && B && typeof k.stack == "string")
              return [k.stack, B.stack];
          }
          return [null, null];
        }
      };
      r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var o = Object.getOwnPropertyDescriptor(
        r.DetermineComponentFrameRoot,
        "name"
      );
      o && o.configurable && Object.defineProperty(
        r.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var c = r.DetermineComponentFrameRoot(), v = c[0], x = c[1];
      if (v && x) {
        var E = v.split(`
`), N = x.split(`
`);
        for (o = r = 0; r < E.length && !E[r].includes("DetermineComponentFrameRoot"); )
          r++;
        for (; o < N.length && !N[o].includes(
          "DetermineComponentFrameRoot"
        ); )
          o++;
        if (r === E.length || o === N.length)
          for (r = E.length - 1, o = N.length - 1; 1 <= r && 0 <= o && E[r] !== N[o]; )
            o--;
        for (; 1 <= r && 0 <= o; r--, o--)
          if (E[r] !== N[o]) {
            if (r !== 1 || o !== 1)
              do
                if (r--, o--, 0 > o || E[r] !== N[o]) {
                  var H = `
` + E[r].replace(" at new ", " at ");
                  return t.displayName && H.includes("<anonymous>") && (H = H.replace("<anonymous>", t.displayName)), H;
                }
              while (1 <= r && 0 <= o);
            break;
          }
      }
    } finally {
      pt = !1, Error.prepareStackTrace = a;
    }
    return (a = t ? t.displayName || t.name : "") ? ft(a) : "";
  }
  function P(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return ft(t.type);
      case 16:
        return ft("Lazy");
      case 13:
        return ft("Suspense");
      case 19:
        return ft("SuspenseList");
      case 0:
      case 15:
        return t = yt(t.type, !1), t;
      case 11:
        return t = yt(t.type.render, !1), t;
      case 1:
        return t = yt(t.type, !0), t;
      default:
        return "";
    }
  }
  function $(t) {
    try {
      var e = "";
      do
        e += P(t), t = t.return;
      while (t);
      return e;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  function Y(t) {
    var e = t, a = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do
        e = t, e.flags & 4098 && (a = e.return), t = e.return;
      while (t);
    }
    return e.tag === 3 ? a : null;
  }
  function nt(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function C(t) {
    if (Y(t) !== t)
      throw Error(l(188));
  }
  function K(t) {
    var e = t.alternate;
    if (!e) {
      if (e = Y(t), e === null) throw Error(l(188));
      return e !== t ? null : t;
    }
    for (var a = t, r = e; ; ) {
      var o = a.return;
      if (o === null) break;
      var c = o.alternate;
      if (c === null) {
        if (r = o.return, r !== null) {
          a = r;
          continue;
        }
        break;
      }
      if (o.child === c.child) {
        for (c = o.child; c; ) {
          if (c === a) return C(o), t;
          if (c === r) return C(o), e;
          c = c.sibling;
        }
        throw Error(l(188));
      }
      if (a.return !== r.return) a = o, r = c;
      else {
        for (var v = !1, x = o.child; x; ) {
          if (x === a) {
            v = !0, a = o, r = c;
            break;
          }
          if (x === r) {
            v = !0, r = o, a = c;
            break;
          }
          x = x.sibling;
        }
        if (!v) {
          for (x = c.child; x; ) {
            if (x === a) {
              v = !0, a = c, r = o;
              break;
            }
            if (x === r) {
              v = !0, r = c, a = o;
              break;
            }
            x = x.sibling;
          }
          if (!v) throw Error(l(189));
        }
      }
      if (a.alternate !== r) throw Error(l(190));
    }
    if (a.tag !== 3) throw Error(l(188));
    return a.stateNode.current === a ? t : e;
  }
  function rt(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = rt(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  var at = Array.isArray, J = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, dt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ut = [], zt = -1;
  function At(t) {
    return { current: t };
  }
  function Vt(t) {
    0 > zt || (t.current = ut[zt], ut[zt] = null, zt--);
  }
  function Dt(t, e) {
    zt++, ut[zt] = t.current, t.current = e;
  }
  var Te = At(null), Ln = At(null), me = At(null), yi = At(null);
  function na(t, e) {
    switch (Dt(me, e), Dt(Ln, t), Dt(Te, null), t = e.nodeType, t) {
      case 9:
      case 11:
        e = (e = e.documentElement) && (e = e.namespaceURI) ? rg(e) : 0;
        break;
      default:
        if (t = t === 8 ? e.parentNode : e, e = t.tagName, t = t.namespaceURI)
          t = rg(t), e = lg(t, e);
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
    Vt(Te), Dt(Te, e);
  }
  function Bn() {
    Vt(Te), Vt(Ln), Vt(me);
  }
  function us(t) {
    t.memoizedState !== null && Dt(yi, t);
    var e = Te.current, a = lg(e, t.type);
    e !== a && (Dt(Ln, t), Dt(Te, a));
  }
  function ia(t) {
    Ln.current === t && (Vt(Te), Vt(Ln)), yi.current === t && (Vt(yi), er._currentValue = dt);
  }
  var Un = Object.prototype.hasOwnProperty, Lo = n.unstable_scheduleCallback, Bo = n.unstable_cancelCallback, q1 = n.unstable_shouldYield, G1 = n.unstable_requestPaint, Je = n.unstable_now, Y1 = n.unstable_getCurrentPriorityLevel, Fd = n.unstable_ImmediatePriority, Wd = n.unstable_UserBlockingPriority, Or = n.unstable_NormalPriority, X1 = n.unstable_LowPriority, $d = n.unstable_IdlePriority, K1 = n.log, Z1 = n.unstable_setDisableYieldValue, cs = null, Ae = null;
  function Q1(t) {
    if (Ae && typeof Ae.onCommitFiberRoot == "function")
      try {
        Ae.onCommitFiberRoot(
          cs,
          t,
          void 0,
          (t.current.flags & 128) === 128
        );
      } catch {
      }
  }
  function kn(t) {
    if (typeof K1 == "function" && Z1(t), Ae && typeof Ae.setStrictMode == "function")
      try {
        Ae.setStrictMode(cs, t);
      } catch {
      }
  }
  var we = Math.clz32 ? Math.clz32 : $1, F1 = Math.log, W1 = Math.LN2;
  function $1(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (F1(t) / W1 | 0) | 0;
  }
  var Nr = 128, jr = 4194304;
  function bi(t) {
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
  function _r(t, e) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var r = 0, o = t.suspendedLanes, c = t.pingedLanes, v = t.warmLanes;
    t = t.finishedLanes !== 0;
    var x = a & 134217727;
    return x !== 0 ? (a = x & ~o, a !== 0 ? r = bi(a) : (c &= x, c !== 0 ? r = bi(c) : t || (v = x & ~v, v !== 0 && (r = bi(v))))) : (x = a & ~o, x !== 0 ? r = bi(x) : c !== 0 ? r = bi(c) : t || (v = a & ~v, v !== 0 && (r = bi(v)))), r === 0 ? 0 : e !== 0 && e !== r && !(e & o) && (o = r & -r, v = e & -e, o >= v || o === 32 && (v & 4194176) !== 0) ? e : r;
  }
  function fs(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function J1(t, e) {
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
  function Jd() {
    var t = Nr;
    return Nr <<= 1, !(Nr & 4194176) && (Nr = 128), t;
  }
  function Id() {
    var t = jr;
    return jr <<= 1, !(jr & 62914560) && (jr = 4194304), t;
  }
  function Uo(t) {
    for (var e = [], a = 0; 31 > a; a++) e.push(t);
    return e;
  }
  function ds(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function I1(t, e, a, r, o, c) {
    var v = t.pendingLanes;
    t.pendingLanes = a, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= a, t.entangledLanes &= a, t.errorRecoveryDisabledLanes &= a, t.shellSuspendCounter = 0;
    var x = t.entanglements, E = t.expirationTimes, N = t.hiddenUpdates;
    for (a = v & ~a; 0 < a; ) {
      var H = 31 - we(a), X = 1 << H;
      x[H] = 0, E[H] = -1;
      var B = N[H];
      if (B !== null)
        for (N[H] = null, H = 0; H < B.length; H++) {
          var k = B[H];
          k !== null && (k.lane &= -536870913);
        }
      a &= ~X;
    }
    r !== 0 && th(t, r, 0), c !== 0 && o === 0 && t.tag !== 0 && (t.suspendedLanes |= c & ~(v & ~e));
  }
  function th(t, e, a) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var r = 31 - we(e);
    t.entangledLanes |= e, t.entanglements[r] = t.entanglements[r] | 1073741824 | a & 4194218;
  }
  function eh(t, e) {
    var a = t.entangledLanes |= e;
    for (t = t.entanglements; a; ) {
      var r = 31 - we(a), o = 1 << r;
      o & e | t[r] & e && (t[r] |= e), a &= ~o;
    }
  }
  function nh(t) {
    return t &= -t, 2 < t ? 8 < t ? t & 134217727 ? 32 : 268435456 : 8 : 2;
  }
  function ih() {
    var t = J.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : Eg(t.type));
  }
  function tx(t, e) {
    var a = J.p;
    try {
      return J.p = t, e();
    } finally {
      J.p = a;
    }
  }
  var Hn = Math.random().toString(36).slice(2), le = "__reactFiber$" + Hn, pe = "__reactProps$" + Hn, aa = "__reactContainer$" + Hn, ko = "__reactEvents$" + Hn, ex = "__reactListeners$" + Hn, nx = "__reactHandles$" + Hn, ah = "__reactResources$" + Hn, hs = "__reactMarker$" + Hn;
  function Ho(t) {
    delete t[le], delete t[pe], delete t[ko], delete t[ex], delete t[nx];
  }
  function xi(t) {
    var e = t[le];
    if (e) return e;
    for (var a = t.parentNode; a; ) {
      if (e = a[aa] || a[le]) {
        if (a = e.alternate, e.child !== null || a !== null && a.child !== null)
          for (t = cg(t); t !== null; ) {
            if (a = t[le]) return a;
            t = cg(t);
          }
        return e;
      }
      t = a, a = t.parentNode;
    }
    return null;
  }
  function sa(t) {
    if (t = t[le] || t[aa]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function ms(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(l(33));
  }
  function ra(t) {
    var e = t[ah];
    return e || (e = t[ah] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function $t(t) {
    t[hs] = !0;
  }
  var sh = /* @__PURE__ */ new Set(), rh = {};
  function Si(t, e) {
    la(t, e), la(t + "Capture", e);
  }
  function la(t, e) {
    for (rh[t] = e, t = 0; t < e.length; t++)
      sh.add(e[t]);
  }
  var fn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ix = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), lh = {}, oh = {};
  function ax(t) {
    return Un.call(oh, t) ? !0 : Un.call(lh, t) ? !1 : ix.test(t) ? oh[t] = !0 : (lh[t] = !0, !1);
  }
  function zr(t, e, a) {
    if (ax(e))
      if (a === null) t.removeAttribute(e);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var r = e.toLowerCase().slice(0, 5);
            if (r !== "data-" && r !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + a);
      }
  }
  function Vr(t, e, a) {
    if (a === null) t.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + a);
    }
  }
  function dn(t, e, a, r) {
    if (r === null) t.removeAttribute(a);
    else {
      switch (typeof r) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(a);
          return;
      }
      t.setAttributeNS(e, a, "" + r);
    }
  }
  function Ne(t) {
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
  function uh(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function sx(t) {
    var e = uh(t) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    ), r = "" + t[e];
    if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var o = a.get, c = a.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return o.call(this);
        },
        set: function(v) {
          r = "" + v, c.call(this, v);
        }
      }), Object.defineProperty(t, e, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return r;
        },
        setValue: function(v) {
          r = "" + v;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Lr(t) {
    t._valueTracker || (t._valueTracker = sx(t));
  }
  function ch(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var a = e.getValue(), r = "";
    return t && (r = uh(t) ? t.checked ? "true" : "false" : t.value), t = r, t !== a ? (e.setValue(t), !0) : !1;
  }
  function Br(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var rx = /[\n"\\]/g;
  function je(t) {
    return t.replace(
      rx,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Po(t, e, a, r, o, c, v, x) {
    t.name = "", v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean" ? t.type = v : t.removeAttribute("type"), e != null ? v === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Ne(e)) : t.value !== "" + Ne(e) && (t.value = "" + Ne(e)) : v !== "submit" && v !== "reset" || t.removeAttribute("value"), e != null ? qo(t, v, Ne(e)) : a != null ? qo(t, v, Ne(a)) : r != null && t.removeAttribute("value"), o == null && c != null && (t.defaultChecked = !!c), o != null && (t.checked = o && typeof o != "function" && typeof o != "symbol"), x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" ? t.name = "" + Ne(x) : t.removeAttribute("name");
  }
  function fh(t, e, a, r, o, c, v, x) {
    if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.type = c), e != null || a != null) {
      if (!(c !== "submit" && c !== "reset" || e != null))
        return;
      a = a != null ? "" + Ne(a) : "", e = e != null ? "" + Ne(e) : a, x || e === t.value || (t.value = e), t.defaultValue = e;
    }
    r = r ?? o, r = typeof r != "function" && typeof r != "symbol" && !!r, t.checked = x ? t.checked : !!r, t.defaultChecked = !!r, v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean" && (t.name = v);
  }
  function qo(t, e, a) {
    e === "number" && Br(t.ownerDocument) === t || t.defaultValue === "" + a || (t.defaultValue = "" + a);
  }
  function oa(t, e, a, r) {
    if (t = t.options, e) {
      e = {};
      for (var o = 0; o < a.length; o++)
        e["$" + a[o]] = !0;
      for (a = 0; a < t.length; a++)
        o = e.hasOwnProperty("$" + t[a].value), t[a].selected !== o && (t[a].selected = o), o && r && (t[a].defaultSelected = !0);
    } else {
      for (a = "" + Ne(a), e = null, o = 0; o < t.length; o++) {
        if (t[o].value === a) {
          t[o].selected = !0, r && (t[o].defaultSelected = !0);
          return;
        }
        e !== null || t[o].disabled || (e = t[o]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function dh(t, e, a) {
    if (e != null && (e = "" + Ne(e), e !== t.value && (t.value = e), a == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = a != null ? "" + Ne(a) : "";
  }
  function hh(t, e, a, r) {
    if (e == null) {
      if (r != null) {
        if (a != null) throw Error(l(92));
        if (at(r)) {
          if (1 < r.length) throw Error(l(93));
          r = r[0];
        }
        a = r;
      }
      a == null && (a = ""), e = a;
    }
    a = Ne(e), t.defaultValue = a, r = t.textContent, r === a && r !== "" && r !== null && (t.value = r);
  }
  function ua(t, e) {
    if (e) {
      var a = t.firstChild;
      if (a && a === t.lastChild && a.nodeType === 3) {
        a.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var lx = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function mh(t, e, a) {
    var r = e.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? r ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : r ? t.setProperty(e, a) : typeof a != "number" || a === 0 || lx.has(e) ? e === "float" ? t.cssFloat = a : t[e] = ("" + a).trim() : t[e] = a + "px";
  }
  function ph(t, e, a) {
    if (e != null && typeof e != "object")
      throw Error(l(62));
    if (t = t.style, a != null) {
      for (var r in a)
        !a.hasOwnProperty(r) || e != null && e.hasOwnProperty(r) || (r.indexOf("--") === 0 ? t.setProperty(r, "") : r === "float" ? t.cssFloat = "" : t[r] = "");
      for (var o in e)
        r = e[o], e.hasOwnProperty(o) && a[o] !== r && mh(t, o, r);
    } else
      for (var c in e)
        e.hasOwnProperty(c) && mh(t, c, e[c]);
  }
  function Go(t) {
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
  var ox = /* @__PURE__ */ new Map([
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
  ]), ux = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ur(t) {
    return ux.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  var Yo = null;
  function Xo(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var ca = null, fa = null;
  function gh(t) {
    var e = sa(t);
    if (e && (t = e.stateNode)) {
      var a = t[pe] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (Po(
            t,
            a.value,
            a.defaultValue,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name
          ), e = a.name, a.type === "radio" && e != null) {
            for (a = t; a.parentNode; ) a = a.parentNode;
            for (a = a.querySelectorAll(
              'input[name="' + je(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < a.length; e++) {
              var r = a[e];
              if (r !== t && r.form === t.form) {
                var o = r[pe] || null;
                if (!o) throw Error(l(90));
                Po(
                  r,
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
            for (e = 0; e < a.length; e++)
              r = a[e], r.form === t.form && ch(r);
          }
          break t;
        case "textarea":
          dh(t, a.value, a.defaultValue);
          break t;
        case "select":
          e = a.value, e != null && oa(t, !!a.multiple, e, !1);
      }
    }
  }
  var Ko = !1;
  function vh(t, e, a) {
    if (Ko) return t(e, a);
    Ko = !0;
    try {
      var r = t(e);
      return r;
    } finally {
      if (Ko = !1, (ca !== null || fa !== null) && (Sl(), ca && (e = ca, t = fa, fa = ca = null, gh(e), t)))
        for (e = 0; e < t.length; e++) gh(t[e]);
    }
  }
  function ps(t, e) {
    var a = t.stateNode;
    if (a === null) return null;
    var r = a[pe] || null;
    if (r === null) return null;
    a = r[e];
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
        (r = !r.disabled) || (t = t.type, r = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !r;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (a && typeof a != "function")
      throw Error(
        l(231, e, typeof a)
      );
    return a;
  }
  var Zo = !1;
  if (fn)
    try {
      var gs = {};
      Object.defineProperty(gs, "passive", {
        get: function() {
          Zo = !0;
        }
      }), window.addEventListener("test", gs, gs), window.removeEventListener("test", gs, gs);
    } catch {
      Zo = !1;
    }
  var Pn = null, Qo = null, kr = null;
  function yh() {
    if (kr) return kr;
    var t, e = Qo, a = e.length, r, o = "value" in Pn ? Pn.value : Pn.textContent, c = o.length;
    for (t = 0; t < a && e[t] === o[t]; t++) ;
    var v = a - t;
    for (r = 1; r <= v && e[a - r] === o[c - r]; r++) ;
    return kr = o.slice(t, 1 < r ? 1 - r : void 0);
  }
  function Hr(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Pr() {
    return !0;
  }
  function bh() {
    return !1;
  }
  function ge(t) {
    function e(a, r, o, c, v) {
      this._reactName = a, this._targetInst = o, this.type = r, this.nativeEvent = c, this.target = v, this.currentTarget = null;
      for (var x in t)
        t.hasOwnProperty(x) && (a = t[x], this[x] = a ? a(c) : c[x]);
      return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? Pr : bh, this.isPropagationStopped = bh, this;
    }
    return W(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Pr);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Pr);
      },
      persist: function() {
      },
      isPersistent: Pr
    }), e;
  }
  var Ti = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, qr = ge(Ti), vs = W({}, Ti, { view: 0, detail: 0 }), cx = ge(vs), Fo, Wo, ys, Gr = W({}, vs, {
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
    getModifierState: Jo,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== ys && (ys && t.type === "mousemove" ? (Fo = t.screenX - ys.screenX, Wo = t.screenY - ys.screenY) : Wo = Fo = 0, ys = t), Fo);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Wo;
    }
  }), xh = ge(Gr), fx = W({}, Gr, { dataTransfer: 0 }), dx = ge(fx), hx = W({}, vs, { relatedTarget: 0 }), $o = ge(hx), mx = W({}, Ti, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), px = ge(mx), gx = W({}, Ti, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), vx = ge(gx), yx = W({}, Ti, { data: 0 }), Sh = ge(yx), bx = {
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
  }, xx = {
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
  }, Sx = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Tx(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = Sx[t]) ? !!e[t] : !1;
  }
  function Jo() {
    return Tx;
  }
  var Ax = W({}, vs, {
    key: function(t) {
      if (t.key) {
        var e = bx[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = Hr(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? xx[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Jo,
    charCode: function(t) {
      return t.type === "keypress" ? Hr(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? Hr(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), wx = ge(Ax), Ex = W({}, Gr, {
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
  }), Th = ge(Ex), Rx = W({}, vs, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Jo
  }), Cx = ge(Rx), Mx = W({}, Ti, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Dx = ge(Mx), Ox = W({}, Gr, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Nx = ge(Ox), jx = W({}, Ti, {
    newState: 0,
    oldState: 0
  }), _x = ge(jx), zx = [9, 13, 27, 32], Io = fn && "CompositionEvent" in window, bs = null;
  fn && "documentMode" in document && (bs = document.documentMode);
  var Vx = fn && "TextEvent" in window && !bs, Ah = fn && (!Io || bs && 8 < bs && 11 >= bs), wh = " ", Eh = !1;
  function Rh(t, e) {
    switch (t) {
      case "keyup":
        return zx.indexOf(e.keyCode) !== -1;
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
  function Ch(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var da = !1;
  function Lx(t, e) {
    switch (t) {
      case "compositionend":
        return Ch(e);
      case "keypress":
        return e.which !== 32 ? null : (Eh = !0, wh);
      case "textInput":
        return t = e.data, t === wh && Eh ? null : t;
      default:
        return null;
    }
  }
  function Bx(t, e) {
    if (da)
      return t === "compositionend" || !Io && Rh(t, e) ? (t = yh(), kr = Qo = Pn = null, da = !1, t) : null;
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
        return Ah && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Ux = {
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
  function Mh(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!Ux[t.type] : e === "textarea";
  }
  function Dh(t, e, a, r) {
    ca ? fa ? fa.push(r) : fa = [r] : ca = r, e = Rl(e, "onChange"), 0 < e.length && (a = new qr(
      "onChange",
      "change",
      null,
      a,
      r
    ), t.push({ event: a, listeners: e }));
  }
  var xs = null, Ss = null;
  function kx(t) {
    eg(t, 0);
  }
  function Yr(t) {
    var e = ms(t);
    if (ch(e)) return t;
  }
  function Oh(t, e) {
    if (t === "change") return e;
  }
  var Nh = !1;
  if (fn) {
    var tu;
    if (fn) {
      var eu = "oninput" in document;
      if (!eu) {
        var jh = document.createElement("div");
        jh.setAttribute("oninput", "return;"), eu = typeof jh.oninput == "function";
      }
      tu = eu;
    } else tu = !1;
    Nh = tu && (!document.documentMode || 9 < document.documentMode);
  }
  function _h() {
    xs && (xs.detachEvent("onpropertychange", zh), Ss = xs = null);
  }
  function zh(t) {
    if (t.propertyName === "value" && Yr(Ss)) {
      var e = [];
      Dh(
        e,
        Ss,
        t,
        Xo(t)
      ), vh(kx, e);
    }
  }
  function Hx(t, e, a) {
    t === "focusin" ? (_h(), xs = e, Ss = a, xs.attachEvent("onpropertychange", zh)) : t === "focusout" && _h();
  }
  function Px(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Yr(Ss);
  }
  function qx(t, e) {
    if (t === "click") return Yr(e);
  }
  function Gx(t, e) {
    if (t === "input" || t === "change")
      return Yr(e);
  }
  function Yx(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var Ee = typeof Object.is == "function" ? Object.is : Yx;
  function Ts(t, e) {
    if (Ee(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var a = Object.keys(t), r = Object.keys(e);
    if (a.length !== r.length) return !1;
    for (r = 0; r < a.length; r++) {
      var o = a[r];
      if (!Un.call(e, o) || !Ee(t[o], e[o]))
        return !1;
    }
    return !0;
  }
  function Vh(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Lh(t, e) {
    var a = Vh(t);
    t = 0;
    for (var r; a; ) {
      if (a.nodeType === 3) {
        if (r = t + a.textContent.length, t <= e && r >= e)
          return { node: a, offset: e - t };
        t = r;
      }
      t: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break t;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = Vh(a);
    }
  }
  function Bh(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Bh(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function Uh(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = Br(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var a = typeof e.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) t = e.contentWindow;
      else break;
      e = Br(t.document);
    }
    return e;
  }
  function nu(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  function Xx(t, e) {
    var a = Uh(e);
    e = t.focusedElem;
    var r = t.selectionRange;
    if (a !== e && e && e.ownerDocument && Bh(e.ownerDocument.documentElement, e)) {
      if (r !== null && nu(e)) {
        if (t = r.start, a = r.end, a === void 0 && (a = t), "selectionStart" in e)
          e.selectionStart = t, e.selectionEnd = Math.min(
            a,
            e.value.length
          );
        else if (a = (t = e.ownerDocument || document) && t.defaultView || window, a.getSelection) {
          a = a.getSelection();
          var o = e.textContent.length, c = Math.min(r.start, o);
          r = r.end === void 0 ? c : Math.min(r.end, o), !a.extend && c > r && (o = r, r = c, c = o), o = Lh(e, c);
          var v = Lh(
            e,
            r
          );
          o && v && (a.rangeCount !== 1 || a.anchorNode !== o.node || a.anchorOffset !== o.offset || a.focusNode !== v.node || a.focusOffset !== v.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), a.removeAllRanges(), c > r ? (a.addRange(t), a.extend(v.node, v.offset)) : (t.setEnd(
            v.node,
            v.offset
          ), a.addRange(t)));
        }
      }
      for (t = [], a = e; a = a.parentNode; )
        a.nodeType === 1 && t.push({
          element: a,
          left: a.scrollLeft,
          top: a.scrollTop
        });
      for (typeof e.focus == "function" && e.focus(), e = 0; e < t.length; e++)
        a = t[e], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
    }
  }
  var Kx = fn && "documentMode" in document && 11 >= document.documentMode, ha = null, iu = null, As = null, au = !1;
  function kh(t, e, a) {
    var r = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    au || ha == null || ha !== Br(r) || (r = ha, "selectionStart" in r && nu(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
      anchorNode: r.anchorNode,
      anchorOffset: r.anchorOffset,
      focusNode: r.focusNode,
      focusOffset: r.focusOffset
    }), As && Ts(As, r) || (As = r, r = Rl(iu, "onSelect"), 0 < r.length && (e = new qr(
      "onSelect",
      "select",
      null,
      e,
      a
    ), t.push({ event: e, listeners: r }), e.target = ha)));
  }
  function Ai(t, e) {
    var a = {};
    return a[t.toLowerCase()] = e.toLowerCase(), a["Webkit" + t] = "webkit" + e, a["Moz" + t] = "moz" + e, a;
  }
  var ma = {
    animationend: Ai("Animation", "AnimationEnd"),
    animationiteration: Ai("Animation", "AnimationIteration"),
    animationstart: Ai("Animation", "AnimationStart"),
    transitionrun: Ai("Transition", "TransitionRun"),
    transitionstart: Ai("Transition", "TransitionStart"),
    transitioncancel: Ai("Transition", "TransitionCancel"),
    transitionend: Ai("Transition", "TransitionEnd")
  }, su = {}, Hh = {};
  fn && (Hh = document.createElement("div").style, "AnimationEvent" in window || (delete ma.animationend.animation, delete ma.animationiteration.animation, delete ma.animationstart.animation), "TransitionEvent" in window || delete ma.transitionend.transition);
  function wi(t) {
    if (su[t]) return su[t];
    if (!ma[t]) return t;
    var e = ma[t], a;
    for (a in e)
      if (e.hasOwnProperty(a) && a in Hh)
        return su[t] = e[a];
    return t;
  }
  var Ph = wi("animationend"), qh = wi("animationiteration"), Gh = wi("animationstart"), Zx = wi("transitionrun"), Qx = wi("transitionstart"), Fx = wi("transitioncancel"), Yh = wi("transitionend"), Xh = /* @__PURE__ */ new Map(), Kh = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(
    " "
  );
  function Xe(t, e) {
    Xh.set(t, e), Si(e, [t]);
  }
  var _e = [], pa = 0, ru = 0;
  function Xr() {
    for (var t = pa, e = ru = pa = 0; e < t; ) {
      var a = _e[e];
      _e[e++] = null;
      var r = _e[e];
      _e[e++] = null;
      var o = _e[e];
      _e[e++] = null;
      var c = _e[e];
      if (_e[e++] = null, r !== null && o !== null) {
        var v = r.pending;
        v === null ? o.next = o : (o.next = v.next, v.next = o), r.pending = o;
      }
      c !== 0 && Zh(a, o, c);
    }
  }
  function Kr(t, e, a, r) {
    _e[pa++] = t, _e[pa++] = e, _e[pa++] = a, _e[pa++] = r, ru |= r, t.lanes |= r, t = t.alternate, t !== null && (t.lanes |= r);
  }
  function lu(t, e, a, r) {
    return Kr(t, e, a, r), Zr(t);
  }
  function qn(t, e) {
    return Kr(t, null, null, e), Zr(t);
  }
  function Zh(t, e, a) {
    t.lanes |= a;
    var r = t.alternate;
    r !== null && (r.lanes |= a);
    for (var o = !1, c = t.return; c !== null; )
      c.childLanes |= a, r = c.alternate, r !== null && (r.childLanes |= a), c.tag === 22 && (t = c.stateNode, t === null || t._visibility & 1 || (o = !0)), t = c, c = c.return;
    o && e !== null && t.tag === 3 && (c = t.stateNode, o = 31 - we(a), c = c.hiddenUpdates, t = c[o], t === null ? c[o] = [e] : t.push(e), e.lane = a | 536870912);
  }
  function Zr(t) {
    if (50 < Qs)
      throw Qs = 0, hc = null, Error(l(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var ga = {}, Qh = /* @__PURE__ */ new WeakMap();
  function ze(t, e) {
    if (typeof t == "object" && t !== null) {
      var a = Qh.get(t);
      return a !== void 0 ? a : (e = {
        value: t,
        source: e,
        stack: $(e)
      }, Qh.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: $(e)
    };
  }
  var va = [], ya = 0, Qr = null, Fr = 0, Ve = [], Le = 0, Ei = null, hn = 1, mn = "";
  function Ri(t, e) {
    va[ya++] = Fr, va[ya++] = Qr, Qr = t, Fr = e;
  }
  function Fh(t, e, a) {
    Ve[Le++] = hn, Ve[Le++] = mn, Ve[Le++] = Ei, Ei = t;
    var r = hn;
    t = mn;
    var o = 32 - we(r) - 1;
    r &= ~(1 << o), a += 1;
    var c = 32 - we(e) + o;
    if (30 < c) {
      var v = o - o % 5;
      c = (r & (1 << v) - 1).toString(32), r >>= v, o -= v, hn = 1 << 32 - we(e) + o | a << o | r, mn = c + t;
    } else
      hn = 1 << c | a << o | r, mn = t;
  }
  function ou(t) {
    t.return !== null && (Ri(t, 1), Fh(t, 1, 0));
  }
  function uu(t) {
    for (; t === Qr; )
      Qr = va[--ya], va[ya] = null, Fr = va[--ya], va[ya] = null;
    for (; t === Ei; )
      Ei = Ve[--Le], Ve[Le] = null, mn = Ve[--Le], Ve[Le] = null, hn = Ve[--Le], Ve[Le] = null;
  }
  var fe = null, ie = null, wt = !1, Ke = null, Ie = !1, cu = Error(l(519));
  function Ci(t) {
    var e = Error(l(418, ""));
    throw Rs(ze(e, t)), cu;
  }
  function Wh(t) {
    var e = t.stateNode, a = t.type, r = t.memoizedProps;
    switch (e[le] = t, e[pe] = r, a) {
      case "dialog":
        St("cancel", e), St("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        St("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Ws.length; a++)
          St(Ws[a], e);
        break;
      case "source":
        St("error", e);
        break;
      case "img":
      case "image":
      case "link":
        St("error", e), St("load", e);
        break;
      case "details":
        St("toggle", e);
        break;
      case "input":
        St("invalid", e), fh(
          e,
          r.value,
          r.defaultValue,
          r.checked,
          r.defaultChecked,
          r.type,
          r.name,
          !0
        ), Lr(e);
        break;
      case "select":
        St("invalid", e);
        break;
      case "textarea":
        St("invalid", e), hh(e, r.value, r.defaultValue, r.children), Lr(e);
    }
    a = r.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || e.textContent === "" + a || r.suppressHydrationWarning === !0 || sg(e.textContent, a) ? (r.popover != null && (St("beforetoggle", e), St("toggle", e)), r.onScroll != null && St("scroll", e), r.onScrollEnd != null && St("scrollend", e), r.onClick != null && (e.onclick = Cl), e = !0) : e = !1, e || Ci(t);
  }
  function $h(t) {
    for (fe = t.return; fe; )
      switch (fe.tag) {
        case 3:
        case 27:
          Ie = !0;
          return;
        case 5:
        case 13:
          Ie = !1;
          return;
        default:
          fe = fe.return;
      }
  }
  function ws(t) {
    if (t !== fe) return !1;
    if (!wt) return $h(t), wt = !0, !1;
    var e = !1, a;
    if ((a = t.tag !== 3 && t.tag !== 27) && ((a = t.tag === 5) && (a = t.type, a = !(a !== "form" && a !== "button") || Oc(t.type, t.memoizedProps)), a = !a), a && (e = !0), e && ie && Ci(t), $h(t), t.tag === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(l(317));
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (a = t.data, a === "/$") {
              if (e === 0) {
                ie = Qe(t.nextSibling);
                break t;
              }
              e--;
            } else
              a !== "$" && a !== "$!" && a !== "$?" || e++;
          t = t.nextSibling;
        }
        ie = null;
      }
    } else
      ie = fe ? Qe(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Es() {
    ie = fe = null, wt = !1;
  }
  function Rs(t) {
    Ke === null ? Ke = [t] : Ke.push(t);
  }
  var Cs = Error(l(460)), Jh = Error(l(474)), fu = { then: function() {
  } };
  function Ih(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Wr() {
  }
  function tm(t, e, a) {
    switch (a = t[a], a === void 0 ? t.push(e) : a !== e && (e.then(Wr, Wr), e = a), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, t === Cs ? Error(l(483)) : t;
      default:
        if (typeof e.status == "string") e.then(Wr, Wr);
        else {
          if (t = jt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(l(482));
          t = e, t.status = "pending", t.then(
            function(r) {
              if (e.status === "pending") {
                var o = e;
                o.status = "fulfilled", o.value = r;
              }
            },
            function(r) {
              if (e.status === "pending") {
                var o = e;
                o.status = "rejected", o.reason = r;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, t === Cs ? Error(l(483)) : t;
        }
        throw Ms = e, Cs;
    }
  }
  var Ms = null;
  function em() {
    if (Ms === null) throw Error(l(459));
    var t = Ms;
    return Ms = null, t;
  }
  var ba = null, Ds = 0;
  function $r(t) {
    var e = Ds;
    return Ds += 1, ba === null && (ba = []), tm(ba, t, e);
  }
  function Os(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Jr(t, e) {
    throw e.$$typeof === f ? Error(l(525)) : (t = Object.prototype.toString.call(e), Error(
      l(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function nm(t) {
    var e = t._init;
    return e(t._payload);
  }
  function im(t) {
    function e(j, D) {
      if (t) {
        var _ = j.deletions;
        _ === null ? (j.deletions = [D], j.flags |= 16) : _.push(D);
      }
    }
    function a(j, D) {
      if (!t) return null;
      for (; D !== null; )
        e(j, D), D = D.sibling;
      return null;
    }
    function r(j) {
      for (var D = /* @__PURE__ */ new Map(); j !== null; )
        j.key !== null ? D.set(j.key, j) : D.set(j.index, j), j = j.sibling;
      return D;
    }
    function o(j, D) {
      return j = ti(j, D), j.index = 0, j.sibling = null, j;
    }
    function c(j, D, _) {
      return j.index = _, t ? (_ = j.alternate, _ !== null ? (_ = _.index, _ < D ? (j.flags |= 33554434, D) : _) : (j.flags |= 33554434, D)) : (j.flags |= 1048576, D);
    }
    function v(j) {
      return t && j.alternate === null && (j.flags |= 33554434), j;
    }
    function x(j, D, _, G) {
      return D === null || D.tag !== 6 ? (D = sc(_, j.mode, G), D.return = j, D) : (D = o(D, _), D.return = j, D);
    }
    function E(j, D, _, G) {
      var I = _.type;
      return I === m ? H(
        j,
        D,
        _.props.children,
        G,
        _.key
      ) : D !== null && (D.elementType === I || typeof I == "object" && I !== null && I.$$typeof === z && nm(I) === D.type) ? (D = o(D, _.props), Os(D, _), D.return = j, D) : (D = gl(
        _.type,
        _.key,
        _.props,
        null,
        j.mode,
        G
      ), Os(D, _), D.return = j, D);
    }
    function N(j, D, _, G) {
      return D === null || D.tag !== 4 || D.stateNode.containerInfo !== _.containerInfo || D.stateNode.implementation !== _.implementation ? (D = rc(_, j.mode, G), D.return = j, D) : (D = o(D, _.children || []), D.return = j, D);
    }
    function H(j, D, _, G, I) {
      return D === null || D.tag !== 7 ? (D = Bi(
        _,
        j.mode,
        G,
        I
      ), D.return = j, D) : (D = o(D, _), D.return = j, D);
    }
    function X(j, D, _) {
      if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
        return D = sc(
          "" + D,
          j.mode,
          _
        ), D.return = j, D;
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case d:
            return _ = gl(
              D.type,
              D.key,
              D.props,
              null,
              j.mode,
              _
            ), Os(_, D), _.return = j, _;
          case h:
            return D = rc(
              D,
              j.mode,
              _
            ), D.return = j, D;
          case z:
            var G = D._init;
            return D = G(D._payload), X(j, D, _);
        }
        if (at(D) || L(D))
          return D = Bi(
            D,
            j.mode,
            _,
            null
          ), D.return = j, D;
        if (typeof D.then == "function")
          return X(j, $r(D), _);
        if (D.$$typeof === T)
          return X(
            j,
            hl(j, D),
            _
          );
        Jr(j, D);
      }
      return null;
    }
    function B(j, D, _, G) {
      var I = D !== null ? D.key : null;
      if (typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint")
        return I !== null ? null : x(j, D, "" + _, G);
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case d:
            return _.key === I ? E(j, D, _, G) : null;
          case h:
            return _.key === I ? N(j, D, _, G) : null;
          case z:
            return I = _._init, _ = I(_._payload), B(j, D, _, G);
        }
        if (at(_) || L(_))
          return I !== null ? null : H(j, D, _, G, null);
        if (typeof _.then == "function")
          return B(
            j,
            D,
            $r(_),
            G
          );
        if (_.$$typeof === T)
          return B(
            j,
            D,
            hl(j, _),
            G
          );
        Jr(j, _);
      }
      return null;
    }
    function k(j, D, _, G, I) {
      if (typeof G == "string" && G !== "" || typeof G == "number" || typeof G == "bigint")
        return j = j.get(_) || null, x(D, j, "" + G, I);
      if (typeof G == "object" && G !== null) {
        switch (G.$$typeof) {
          case d:
            return j = j.get(
              G.key === null ? _ : G.key
            ) || null, E(D, j, G, I);
          case h:
            return j = j.get(
              G.key === null ? _ : G.key
            ) || null, N(D, j, G, I);
          case z:
            var vt = G._init;
            return G = vt(G._payload), k(
              j,
              D,
              _,
              G,
              I
            );
        }
        if (at(G) || L(G))
          return j = j.get(_) || null, H(D, j, G, I, null);
        if (typeof G.then == "function")
          return k(
            j,
            D,
            _,
            $r(G),
            I
          );
        if (G.$$typeof === T)
          return k(
            j,
            D,
            _,
            hl(D, G),
            I
          );
        Jr(D, G);
      }
      return null;
    }
    function it(j, D, _, G) {
      for (var I = null, vt = null, st = D, lt = D = 0, te = null; st !== null && lt < _.length; lt++) {
        st.index > lt ? (te = st, st = null) : te = st.sibling;
        var Et = B(
          j,
          st,
          _[lt],
          G
        );
        if (Et === null) {
          st === null && (st = te);
          break;
        }
        t && st && Et.alternate === null && e(j, st), D = c(Et, D, lt), vt === null ? I = Et : vt.sibling = Et, vt = Et, st = te;
      }
      if (lt === _.length)
        return a(j, st), wt && Ri(j, lt), I;
      if (st === null) {
        for (; lt < _.length; lt++)
          st = X(j, _[lt], G), st !== null && (D = c(
            st,
            D,
            lt
          ), vt === null ? I = st : vt.sibling = st, vt = st);
        return wt && Ri(j, lt), I;
      }
      for (st = r(st); lt < _.length; lt++)
        te = k(
          st,
          j,
          lt,
          _[lt],
          G
        ), te !== null && (t && te.alternate !== null && st.delete(
          te.key === null ? lt : te.key
        ), D = c(
          te,
          D,
          lt
        ), vt === null ? I = te : vt.sibling = te, vt = te);
      return t && st.forEach(function(li) {
        return e(j, li);
      }), wt && Ri(j, lt), I;
    }
    function ct(j, D, _, G) {
      if (_ == null) throw Error(l(151));
      for (var I = null, vt = null, st = D, lt = D = 0, te = null, Et = _.next(); st !== null && !Et.done; lt++, Et = _.next()) {
        st.index > lt ? (te = st, st = null) : te = st.sibling;
        var li = B(j, st, Et.value, G);
        if (li === null) {
          st === null && (st = te);
          break;
        }
        t && st && li.alternate === null && e(j, st), D = c(li, D, lt), vt === null ? I = li : vt.sibling = li, vt = li, st = te;
      }
      if (Et.done)
        return a(j, st), wt && Ri(j, lt), I;
      if (st === null) {
        for (; !Et.done; lt++, Et = _.next())
          Et = X(j, Et.value, G), Et !== null && (D = c(Et, D, lt), vt === null ? I = Et : vt.sibling = Et, vt = Et);
        return wt && Ri(j, lt), I;
      }
      for (st = r(st); !Et.done; lt++, Et = _.next())
        Et = k(st, j, lt, Et.value, G), Et !== null && (t && Et.alternate !== null && st.delete(Et.key === null ? lt : Et.key), D = c(Et, D, lt), vt === null ? I = Et : vt.sibling = Et, vt = Et);
      return t && st.forEach(function(uT) {
        return e(j, uT);
      }), wt && Ri(j, lt), I;
    }
    function Pt(j, D, _, G) {
      if (typeof _ == "object" && _ !== null && _.type === m && _.key === null && (_ = _.props.children), typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case d:
            t: {
              for (var I = _.key; D !== null; ) {
                if (D.key === I) {
                  if (I = _.type, I === m) {
                    if (D.tag === 7) {
                      a(
                        j,
                        D.sibling
                      ), G = o(
                        D,
                        _.props.children
                      ), G.return = j, j = G;
                      break t;
                    }
                  } else if (D.elementType === I || typeof I == "object" && I !== null && I.$$typeof === z && nm(I) === D.type) {
                    a(
                      j,
                      D.sibling
                    ), G = o(D, _.props), Os(G, _), G.return = j, j = G;
                    break t;
                  }
                  a(j, D);
                  break;
                } else e(j, D);
                D = D.sibling;
              }
              _.type === m ? (G = Bi(
                _.props.children,
                j.mode,
                G,
                _.key
              ), G.return = j, j = G) : (G = gl(
                _.type,
                _.key,
                _.props,
                null,
                j.mode,
                G
              ), Os(G, _), G.return = j, j = G);
            }
            return v(j);
          case h:
            t: {
              for (I = _.key; D !== null; ) {
                if (D.key === I)
                  if (D.tag === 4 && D.stateNode.containerInfo === _.containerInfo && D.stateNode.implementation === _.implementation) {
                    a(
                      j,
                      D.sibling
                    ), G = o(D, _.children || []), G.return = j, j = G;
                    break t;
                  } else {
                    a(j, D);
                    break;
                  }
                else e(j, D);
                D = D.sibling;
              }
              G = rc(_, j.mode, G), G.return = j, j = G;
            }
            return v(j);
          case z:
            return I = _._init, _ = I(_._payload), Pt(
              j,
              D,
              _,
              G
            );
        }
        if (at(_))
          return it(
            j,
            D,
            _,
            G
          );
        if (L(_)) {
          if (I = L(_), typeof I != "function") throw Error(l(150));
          return _ = I.call(_), ct(
            j,
            D,
            _,
            G
          );
        }
        if (typeof _.then == "function")
          return Pt(
            j,
            D,
            $r(_),
            G
          );
        if (_.$$typeof === T)
          return Pt(
            j,
            D,
            hl(j, _),
            G
          );
        Jr(j, _);
      }
      return typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint" ? (_ = "" + _, D !== null && D.tag === 6 ? (a(j, D.sibling), G = o(D, _), G.return = j, j = G) : (a(j, D), G = sc(_, j.mode, G), G.return = j, j = G), v(j)) : a(j, D);
    }
    return function(j, D, _, G) {
      try {
        Ds = 0;
        var I = Pt(
          j,
          D,
          _,
          G
        );
        return ba = null, I;
      } catch (st) {
        if (st === Cs) throw st;
        var vt = He(29, st, null, j.mode);
        return vt.lanes = G, vt.return = j, vt;
      } finally {
      }
    };
  }
  var Mi = im(!0), am = im(!1), xa = At(null), Ir = At(0);
  function sm(t, e) {
    t = En, Dt(Ir, t), Dt(xa, e), En = t | e.baseLanes;
  }
  function du() {
    Dt(Ir, En), Dt(xa, xa.current);
  }
  function hu() {
    En = Ir.current, Vt(xa), Vt(Ir);
  }
  var Be = At(null), tn = null;
  function Gn(t) {
    var e = t.alternate;
    Dt(Ft, Ft.current & 1), Dt(Be, t), tn === null && (e === null || xa.current !== null || e.memoizedState !== null) && (tn = t);
  }
  function rm(t) {
    if (t.tag === 22) {
      if (Dt(Ft, Ft.current), Dt(Be, t), tn === null) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (tn = t);
      }
    } else Yn();
  }
  function Yn() {
    Dt(Ft, Ft.current), Dt(Be, Be.current);
  }
  function pn(t) {
    Vt(Be), tn === t && (tn = null), Vt(Ft);
  }
  var Ft = At(0);
  function tl(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var a = e.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || a.data === "$?" || a.data === "$!"))
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
  var Wx = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(a, r) {
        t.push(r);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(a) {
        return a();
      });
    };
  }, $x = n.unstable_scheduleCallback, Jx = n.unstable_NormalPriority, Wt = {
    $$typeof: T,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function mu() {
    return {
      controller: new Wx(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ns(t) {
    t.refCount--, t.refCount === 0 && $x(Jx, function() {
      t.controller.abort();
    });
  }
  var js = null, pu = 0, Sa = 0, Ta = null;
  function Ix(t, e) {
    if (js === null) {
      var a = js = [];
      pu = 0, Sa = Sc(), Ta = {
        status: "pending",
        value: void 0,
        then: function(r) {
          a.push(r);
        }
      };
    }
    return pu++, e.then(lm, lm), e;
  }
  function lm() {
    if (--pu === 0 && js !== null) {
      Ta !== null && (Ta.status = "fulfilled");
      var t = js;
      js = null, Sa = 0, Ta = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function tS(t, e) {
    var a = [], r = {
      status: "pending",
      value: null,
      reason: null,
      then: function(o) {
        a.push(o);
      }
    };
    return t.then(
      function() {
        r.status = "fulfilled", r.value = e;
        for (var o = 0; o < a.length; o++) (0, a[o])(e);
      },
      function(o) {
        for (r.status = "rejected", r.reason = o, o = 0; o < a.length; o++)
          (0, a[o])(void 0);
      }
    ), r;
  }
  var om = Q.S;
  Q.S = function(t, e) {
    typeof e == "object" && e !== null && typeof e.then == "function" && Ix(t, e), om !== null && om(t, e);
  };
  var Di = At(null);
  function gu() {
    var t = Di.current;
    return t !== null ? t : jt.pooledCache;
  }
  function el(t, e) {
    e === null ? Dt(Di, Di.current) : Dt(Di, e.pool);
  }
  function um() {
    var t = gu();
    return t === null ? null : { parent: Wt._currentValue, pool: t };
  }
  var Xn = 0, gt = null, Ct = null, Kt = null, nl = !1, Aa = !1, Oi = !1, il = 0, _s = 0, wa = null, eS = 0;
  function Yt() {
    throw Error(l(321));
  }
  function vu(t, e) {
    if (e === null) return !1;
    for (var a = 0; a < e.length && a < t.length; a++)
      if (!Ee(t[a], e[a])) return !1;
    return !0;
  }
  function yu(t, e, a, r, o, c) {
    return Xn = c, gt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, Q.H = t === null || t.memoizedState === null ? Ni : Kn, Oi = !1, c = a(r, o), Oi = !1, Aa && (c = fm(
      e,
      a,
      r,
      o
    )), cm(t), c;
  }
  function cm(t) {
    Q.H = en;
    var e = Ct !== null && Ct.next !== null;
    if (Xn = 0, Kt = Ct = gt = null, nl = !1, _s = 0, wa = null, e) throw Error(l(300));
    t === null || Jt || (t = t.dependencies, t !== null && dl(t) && (Jt = !0));
  }
  function fm(t, e, a, r) {
    gt = t;
    var o = 0;
    do {
      if (Aa && (wa = null), _s = 0, Aa = !1, 25 <= o) throw Error(l(301));
      if (o += 1, Kt = Ct = null, t.updateQueue != null) {
        var c = t.updateQueue;
        c.lastEffect = null, c.events = null, c.stores = null, c.memoCache != null && (c.memoCache.index = 0);
      }
      Q.H = ji, c = e(a, r);
    } while (Aa);
    return c;
  }
  function nS() {
    var t = Q.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? zs(e) : e, t = t.useState()[0], (Ct !== null ? Ct.memoizedState : null) !== t && (gt.flags |= 1024), e;
  }
  function bu() {
    var t = il !== 0;
    return il = 0, t;
  }
  function xu(t, e, a) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~a;
  }
  function Su(t) {
    if (nl) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      nl = !1;
    }
    Xn = 0, Kt = Ct = gt = null, Aa = !1, _s = il = 0, wa = null;
  }
  function ve() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Kt === null ? gt.memoizedState = Kt = t : Kt = Kt.next = t, Kt;
  }
  function Zt() {
    if (Ct === null) {
      var t = gt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Ct.next;
    var e = Kt === null ? gt.memoizedState : Kt.next;
    if (e !== null)
      Kt = e, Ct = t;
    else {
      if (t === null)
        throw gt.alternate === null ? Error(l(467)) : Error(l(310));
      Ct = t, t = {
        memoizedState: Ct.memoizedState,
        baseState: Ct.baseState,
        baseQueue: Ct.baseQueue,
        queue: Ct.queue,
        next: null
      }, Kt === null ? gt.memoizedState = Kt = t : Kt = Kt.next = t;
    }
    return Kt;
  }
  var al;
  al = function() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  };
  function zs(t) {
    var e = _s;
    return _s += 1, wa === null && (wa = []), t = tm(wa, t, e), e = gt, (Kt === null ? e.memoizedState : Kt.next) === null && (e = e.alternate, Q.H = e === null || e.memoizedState === null ? Ni : Kn), t;
  }
  function sl(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return zs(t);
      if (t.$$typeof === T) return oe(t);
    }
    throw Error(l(438, String(t)));
  }
  function Tu(t) {
    var e = null, a = gt.updateQueue;
    if (a !== null && (e = a.memoCache), e == null) {
      var r = gt.alternate;
      r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (e = {
        data: r.data.map(function(o) {
          return o.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), a === null && (a = al(), gt.updateQueue = a), a.memoCache = e, a = e.data[e.index], a === void 0)
      for (a = e.data[e.index] = Array(t), r = 0; r < t; r++)
        a[r] = q;
    return e.index++, a;
  }
  function gn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function rl(t) {
    var e = Zt();
    return Au(e, Ct, t);
  }
  function Au(t, e, a) {
    var r = t.queue;
    if (r === null) throw Error(l(311));
    r.lastRenderedReducer = a;
    var o = t.baseQueue, c = r.pending;
    if (c !== null) {
      if (o !== null) {
        var v = o.next;
        o.next = c.next, c.next = v;
      }
      e.baseQueue = o = c, r.pending = null;
    }
    if (c = t.baseState, o === null) t.memoizedState = c;
    else {
      e = o.next;
      var x = v = null, E = null, N = e, H = !1;
      do {
        var X = N.lane & -536870913;
        if (X !== N.lane ? (Tt & X) === X : (Xn & X) === X) {
          var B = N.revertLane;
          if (B === 0)
            E !== null && (E = E.next = {
              lane: 0,
              revertLane: 0,
              action: N.action,
              hasEagerState: N.hasEagerState,
              eagerState: N.eagerState,
              next: null
            }), X === Sa && (H = !0);
          else if ((Xn & B) === B) {
            N = N.next, B === Sa && (H = !0);
            continue;
          } else
            X = {
              lane: 0,
              revertLane: N.revertLane,
              action: N.action,
              hasEagerState: N.hasEagerState,
              eagerState: N.eagerState,
              next: null
            }, E === null ? (x = E = X, v = c) : E = E.next = X, gt.lanes |= B, ei |= B;
          X = N.action, Oi && a(c, X), c = N.hasEagerState ? N.eagerState : a(c, X);
        } else
          B = {
            lane: X,
            revertLane: N.revertLane,
            action: N.action,
            hasEagerState: N.hasEagerState,
            eagerState: N.eagerState,
            next: null
          }, E === null ? (x = E = B, v = c) : E = E.next = B, gt.lanes |= X, ei |= X;
        N = N.next;
      } while (N !== null && N !== e);
      if (E === null ? v = c : E.next = x, !Ee(c, t.memoizedState) && (Jt = !0, H && (a = Ta, a !== null)))
        throw a;
      t.memoizedState = c, t.baseState = v, t.baseQueue = E, r.lastRenderedState = c;
    }
    return o === null && (r.lanes = 0), [t.memoizedState, r.dispatch];
  }
  function wu(t) {
    var e = Zt(), a = e.queue;
    if (a === null) throw Error(l(311));
    a.lastRenderedReducer = t;
    var r = a.dispatch, o = a.pending, c = e.memoizedState;
    if (o !== null) {
      a.pending = null;
      var v = o = o.next;
      do
        c = t(c, v.action), v = v.next;
      while (v !== o);
      Ee(c, e.memoizedState) || (Jt = !0), e.memoizedState = c, e.baseQueue === null && (e.baseState = c), a.lastRenderedState = c;
    }
    return [c, r];
  }
  function dm(t, e, a) {
    var r = gt, o = Zt(), c = wt;
    if (c) {
      if (a === void 0) throw Error(l(407));
      a = a();
    } else a = e();
    var v = !Ee(
      (Ct || o).memoizedState,
      a
    );
    if (v && (o.memoizedState = a, Jt = !0), o = o.queue, Cu(pm.bind(null, r, o, t), [
      t
    ]), o.getSnapshot !== e || v || Kt !== null && Kt.memoizedState.tag & 1) {
      if (r.flags |= 2048, Ea(
        9,
        mm.bind(
          null,
          r,
          o,
          a,
          e
        ),
        { destroy: void 0 },
        null
      ), jt === null) throw Error(l(349));
      c || Xn & 60 || hm(r, e, a);
    }
    return a;
  }
  function hm(t, e, a) {
    t.flags |= 16384, t = { getSnapshot: e, value: a }, e = gt.updateQueue, e === null ? (e = al(), gt.updateQueue = e, e.stores = [t]) : (a = e.stores, a === null ? e.stores = [t] : a.push(t));
  }
  function mm(t, e, a, r) {
    e.value = a, e.getSnapshot = r, gm(e) && vm(t);
  }
  function pm(t, e, a) {
    return a(function() {
      gm(e) && vm(t);
    });
  }
  function gm(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var a = e();
      return !Ee(t, a);
    } catch {
      return !0;
    }
  }
  function vm(t) {
    var e = qn(t, 2);
    e !== null && de(e, t, 2);
  }
  function Eu(t) {
    var e = ve();
    if (typeof t == "function") {
      var a = t;
      if (t = a(), Oi) {
        kn(!0);
        try {
          a();
        } finally {
          kn(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: gn,
      lastRenderedState: t
    }, e;
  }
  function ym(t, e, a, r) {
    return t.baseState = a, Au(
      t,
      Ct,
      typeof r == "function" ? r : gn
    );
  }
  function iS(t, e, a, r, o) {
    if (ul(t)) throw Error(l(485));
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
        then: function(v) {
          c.listeners.push(v);
        }
      };
      Q.T !== null ? a(!0) : c.isTransition = !1, r(c), a = e.pending, a === null ? (c.next = e.pending = c, bm(e, c)) : (c.next = a.next, e.pending = a.next = c);
    }
  }
  function bm(t, e) {
    var a = e.action, r = e.payload, o = t.state;
    if (e.isTransition) {
      var c = Q.T, v = {};
      Q.T = v;
      try {
        var x = a(o, r), E = Q.S;
        E !== null && E(v, x), xm(t, e, x);
      } catch (N) {
        Ru(t, e, N);
      } finally {
        Q.T = c;
      }
    } else
      try {
        c = a(o, r), xm(t, e, c);
      } catch (N) {
        Ru(t, e, N);
      }
  }
  function xm(t, e, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(r) {
        Sm(t, e, r);
      },
      function(r) {
        return Ru(t, e, r);
      }
    ) : Sm(t, e, a);
  }
  function Sm(t, e, a) {
    e.status = "fulfilled", e.value = a, Tm(e), t.state = a, e = t.pending, e !== null && (a = e.next, a === e ? t.pending = null : (a = a.next, e.next = a, bm(t, a)));
  }
  function Ru(t, e, a) {
    var r = t.pending;
    if (t.pending = null, r !== null) {
      r = r.next;
      do
        e.status = "rejected", e.reason = a, Tm(e), e = e.next;
      while (e !== r);
    }
    t.action = null;
  }
  function Tm(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Am(t, e) {
    return e;
  }
  function wm(t, e) {
    if (wt) {
      var a = jt.formState;
      if (a !== null) {
        t: {
          var r = gt;
          if (wt) {
            if (ie) {
              e: {
                for (var o = ie, c = Ie; o.nodeType !== 8; ) {
                  if (!c) {
                    o = null;
                    break e;
                  }
                  if (o = Qe(
                    o.nextSibling
                  ), o === null) {
                    o = null;
                    break e;
                  }
                }
                c = o.data, o = c === "F!" || c === "F" ? o : null;
              }
              if (o) {
                ie = Qe(
                  o.nextSibling
                ), r = o.data === "F!";
                break t;
              }
            }
            Ci(r);
          }
          r = !1;
        }
        r && (e = a[0]);
      }
    }
    return a = ve(), a.memoizedState = a.baseState = e, r = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Am,
      lastRenderedState: e
    }, a.queue = r, a = qm.bind(
      null,
      gt,
      r
    ), r.dispatch = a, r = Eu(!1), c = ju.bind(
      null,
      gt,
      !1,
      r.queue
    ), r = ve(), o = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, r.queue = o, a = iS.bind(
      null,
      gt,
      o,
      c,
      a
    ), o.dispatch = a, r.memoizedState = t, [e, a, !1];
  }
  function Em(t) {
    var e = Zt();
    return Rm(e, Ct, t);
  }
  function Rm(t, e, a) {
    e = Au(
      t,
      e,
      Am
    )[0], t = rl(gn)[0], e = typeof e == "object" && e !== null && typeof e.then == "function" ? zs(e) : e;
    var r = Zt(), o = r.queue, c = o.dispatch;
    return a !== r.memoizedState && (gt.flags |= 2048, Ea(
      9,
      aS.bind(null, o, a),
      { destroy: void 0 },
      null
    )), [e, c, t];
  }
  function aS(t, e) {
    t.action = e;
  }
  function Cm(t) {
    var e = Zt(), a = Ct;
    if (a !== null)
      return Rm(e, a, t);
    Zt(), e = e.memoizedState, a = Zt();
    var r = a.queue.dispatch;
    return a.memoizedState = t, [e, r, !1];
  }
  function Ea(t, e, a, r) {
    return t = { tag: t, create: e, inst: a, deps: r, next: null }, e = gt.updateQueue, e === null && (e = al(), gt.updateQueue = e), a = e.lastEffect, a === null ? e.lastEffect = t.next = t : (r = a.next, a.next = t, t.next = r, e.lastEffect = t), t;
  }
  function Mm() {
    return Zt().memoizedState;
  }
  function ll(t, e, a, r) {
    var o = ve();
    gt.flags |= t, o.memoizedState = Ea(
      1 | e,
      a,
      { destroy: void 0 },
      r === void 0 ? null : r
    );
  }
  function ol(t, e, a, r) {
    var o = Zt();
    r = r === void 0 ? null : r;
    var c = o.memoizedState.inst;
    Ct !== null && r !== null && vu(r, Ct.memoizedState.deps) ? o.memoizedState = Ea(e, a, c, r) : (gt.flags |= t, o.memoizedState = Ea(1 | e, a, c, r));
  }
  function Dm(t, e) {
    ll(8390656, 8, t, e);
  }
  function Cu(t, e) {
    ol(2048, 8, t, e);
  }
  function Om(t, e) {
    return ol(4, 2, t, e);
  }
  function Nm(t, e) {
    return ol(4, 4, t, e);
  }
  function jm(t, e) {
    if (typeof e == "function") {
      t = t();
      var a = e(t);
      return function() {
        typeof a == "function" ? a() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function _m(t, e, a) {
    a = a != null ? a.concat([t]) : null, ol(4, 4, jm.bind(null, e, t), a);
  }
  function Mu() {
  }
  function zm(t, e) {
    var a = Zt();
    e = e === void 0 ? null : e;
    var r = a.memoizedState;
    return e !== null && vu(e, r[1]) ? r[0] : (a.memoizedState = [t, e], t);
  }
  function Vm(t, e) {
    var a = Zt();
    e = e === void 0 ? null : e;
    var r = a.memoizedState;
    if (e !== null && vu(e, r[1]))
      return r[0];
    if (r = t(), Oi) {
      kn(!0);
      try {
        t();
      } finally {
        kn(!1);
      }
    }
    return a.memoizedState = [r, e], r;
  }
  function Du(t, e, a) {
    return a === void 0 || Xn & 1073741824 ? t.memoizedState = e : (t.memoizedState = a, t = Bp(), gt.lanes |= t, ei |= t, a);
  }
  function Lm(t, e, a, r) {
    return Ee(a, e) ? a : xa.current !== null ? (t = Du(t, a, r), Ee(t, e) || (Jt = !0), t) : Xn & 42 ? (t = Bp(), gt.lanes |= t, ei |= t, e) : (Jt = !0, t.memoizedState = a);
  }
  function Bm(t, e, a, r, o) {
    var c = J.p;
    J.p = c !== 0 && 8 > c ? c : 8;
    var v = Q.T, x = {};
    Q.T = x, ju(t, !1, e, a);
    try {
      var E = o(), N = Q.S;
      if (N !== null && N(x, E), E !== null && typeof E == "object" && typeof E.then == "function") {
        var H = tS(
          E,
          r
        );
        Vs(
          t,
          e,
          H,
          De(t)
        );
      } else
        Vs(
          t,
          e,
          r,
          De(t)
        );
    } catch (X) {
      Vs(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: X },
        De()
      );
    } finally {
      J.p = c, Q.T = v;
    }
  }
  function sS() {
  }
  function Ou(t, e, a, r) {
    if (t.tag !== 5) throw Error(l(476));
    var o = Um(t).queue;
    Bm(
      t,
      o,
      e,
      dt,
      a === null ? sS : function() {
        return km(t), a(r);
      }
    );
  }
  function Um(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: dt,
      baseState: dt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: gn,
        lastRenderedState: dt
      },
      next: null
    };
    var a = {};
    return e.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: gn,
        lastRenderedState: a
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function km(t) {
    var e = Um(t).next.queue;
    Vs(t, e, {}, De());
  }
  function Nu() {
    return oe(er);
  }
  function Hm() {
    return Zt().memoizedState;
  }
  function Pm() {
    return Zt().memoizedState;
  }
  function rS(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var a = De();
          t = Fn(a);
          var r = Wn(e, t, a);
          r !== null && (de(r, e, a), Us(r, e, a)), e = { cache: mu() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function lS(t, e, a) {
    var r = De();
    a = {
      lane: r,
      revertLane: 0,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ul(t) ? Gm(e, a) : (a = lu(t, e, a, r), a !== null && (de(a, t, r), Ym(a, e, r)));
  }
  function qm(t, e, a) {
    var r = De();
    Vs(t, e, a, r);
  }
  function Vs(t, e, a, r) {
    var o = {
      lane: r,
      revertLane: 0,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ul(t)) Gm(e, o);
    else {
      var c = t.alternate;
      if (t.lanes === 0 && (c === null || c.lanes === 0) && (c = e.lastRenderedReducer, c !== null))
        try {
          var v = e.lastRenderedState, x = c(v, a);
          if (o.hasEagerState = !0, o.eagerState = x, Ee(x, v))
            return Kr(t, e, o, 0), jt === null && Xr(), !1;
        } catch {
        } finally {
        }
      if (a = lu(t, e, o, r), a !== null)
        return de(a, t, r), Ym(a, e, r), !0;
    }
    return !1;
  }
  function ju(t, e, a, r) {
    if (r = {
      lane: 2,
      revertLane: Sc(),
      action: r,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ul(t)) {
      if (e) throw Error(l(479));
    } else
      e = lu(
        t,
        a,
        r,
        2
      ), e !== null && de(e, t, 2);
  }
  function ul(t) {
    var e = t.alternate;
    return t === gt || e !== null && e === gt;
  }
  function Gm(t, e) {
    Aa = nl = !0;
    var a = t.pending;
    a === null ? e.next = e : (e.next = a.next, a.next = e), t.pending = e;
  }
  function Ym(t, e, a) {
    if (a & 4194176) {
      var r = e.lanes;
      r &= t.pendingLanes, a |= r, e.lanes = a, eh(t, a);
    }
  }
  var en = {
    readContext: oe,
    use: sl,
    useCallback: Yt,
    useContext: Yt,
    useEffect: Yt,
    useImperativeHandle: Yt,
    useLayoutEffect: Yt,
    useInsertionEffect: Yt,
    useMemo: Yt,
    useReducer: Yt,
    useRef: Yt,
    useState: Yt,
    useDebugValue: Yt,
    useDeferredValue: Yt,
    useTransition: Yt,
    useSyncExternalStore: Yt,
    useId: Yt
  };
  en.useCacheRefresh = Yt, en.useMemoCache = Yt, en.useHostTransitionStatus = Yt, en.useFormState = Yt, en.useActionState = Yt, en.useOptimistic = Yt;
  var Ni = {
    readContext: oe,
    use: sl,
    useCallback: function(t, e) {
      return ve().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: oe,
    useEffect: Dm,
    useImperativeHandle: function(t, e, a) {
      a = a != null ? a.concat([t]) : null, ll(
        4194308,
        4,
        jm.bind(null, e, t),
        a
      );
    },
    useLayoutEffect: function(t, e) {
      return ll(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      ll(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var a = ve();
      e = e === void 0 ? null : e;
      var r = t();
      if (Oi) {
        kn(!0);
        try {
          t();
        } finally {
          kn(!1);
        }
      }
      return a.memoizedState = [r, e], r;
    },
    useReducer: function(t, e, a) {
      var r = ve();
      if (a !== void 0) {
        var o = a(e);
        if (Oi) {
          kn(!0);
          try {
            a(e);
          } finally {
            kn(!1);
          }
        }
      } else o = e;
      return r.memoizedState = r.baseState = o, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: o
      }, r.queue = t, t = t.dispatch = lS.bind(
        null,
        gt,
        t
      ), [r.memoizedState, t];
    },
    useRef: function(t) {
      var e = ve();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Eu(t);
      var e = t.queue, a = qm.bind(null, gt, e);
      return e.dispatch = a, [t.memoizedState, a];
    },
    useDebugValue: Mu,
    useDeferredValue: function(t, e) {
      var a = ve();
      return Du(a, t, e);
    },
    useTransition: function() {
      var t = Eu(!1);
      return t = Bm.bind(
        null,
        gt,
        t.queue,
        !0,
        !1
      ), ve().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, a) {
      var r = gt, o = ve();
      if (wt) {
        if (a === void 0)
          throw Error(l(407));
        a = a();
      } else {
        if (a = e(), jt === null) throw Error(l(349));
        Tt & 60 || hm(r, e, a);
      }
      o.memoizedState = a;
      var c = { value: a, getSnapshot: e };
      return o.queue = c, Dm(pm.bind(null, r, c, t), [
        t
      ]), r.flags |= 2048, Ea(
        9,
        mm.bind(
          null,
          r,
          c,
          a,
          e
        ),
        { destroy: void 0 },
        null
      ), a;
    },
    useId: function() {
      var t = ve(), e = jt.identifierPrefix;
      if (wt) {
        var a = mn, r = hn;
        a = (r & ~(1 << 32 - we(r) - 1)).toString(32) + a, e = ":" + e + "R" + a, a = il++, 0 < a && (e += "H" + a.toString(32)), e += ":";
      } else
        a = eS++, e = ":" + e + "r" + a.toString(32) + ":";
      return t.memoizedState = e;
    },
    useCacheRefresh: function() {
      return ve().memoizedState = rS.bind(
        null,
        gt
      );
    }
  };
  Ni.useMemoCache = Tu, Ni.useHostTransitionStatus = Nu, Ni.useFormState = wm, Ni.useActionState = wm, Ni.useOptimistic = function(t) {
    var e = ve();
    e.memoizedState = e.baseState = t;
    var a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: null,
      lastRenderedState: null
    };
    return e.queue = a, e = ju.bind(
      null,
      gt,
      !0,
      a
    ), a.dispatch = e, [t, e];
  };
  var Kn = {
    readContext: oe,
    use: sl,
    useCallback: zm,
    useContext: oe,
    useEffect: Cu,
    useImperativeHandle: _m,
    useInsertionEffect: Om,
    useLayoutEffect: Nm,
    useMemo: Vm,
    useReducer: rl,
    useRef: Mm,
    useState: function() {
      return rl(gn);
    },
    useDebugValue: Mu,
    useDeferredValue: function(t, e) {
      var a = Zt();
      return Lm(
        a,
        Ct.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = rl(gn)[0], e = Zt().memoizedState;
      return [
        typeof t == "boolean" ? t : zs(t),
        e
      ];
    },
    useSyncExternalStore: dm,
    useId: Hm
  };
  Kn.useCacheRefresh = Pm, Kn.useMemoCache = Tu, Kn.useHostTransitionStatus = Nu, Kn.useFormState = Em, Kn.useActionState = Em, Kn.useOptimistic = function(t, e) {
    var a = Zt();
    return ym(a, Ct, t, e);
  };
  var ji = {
    readContext: oe,
    use: sl,
    useCallback: zm,
    useContext: oe,
    useEffect: Cu,
    useImperativeHandle: _m,
    useInsertionEffect: Om,
    useLayoutEffect: Nm,
    useMemo: Vm,
    useReducer: wu,
    useRef: Mm,
    useState: function() {
      return wu(gn);
    },
    useDebugValue: Mu,
    useDeferredValue: function(t, e) {
      var a = Zt();
      return Ct === null ? Du(a, t, e) : Lm(
        a,
        Ct.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = wu(gn)[0], e = Zt().memoizedState;
      return [
        typeof t == "boolean" ? t : zs(t),
        e
      ];
    },
    useSyncExternalStore: dm,
    useId: Hm
  };
  ji.useCacheRefresh = Pm, ji.useMemoCache = Tu, ji.useHostTransitionStatus = Nu, ji.useFormState = Cm, ji.useActionState = Cm, ji.useOptimistic = function(t, e) {
    var a = Zt();
    return Ct !== null ? ym(a, Ct, t, e) : (a.baseState = t, [t, a.queue.dispatch]);
  };
  function _u(t, e, a, r) {
    e = t.memoizedState, a = a(r, e), a = a == null ? e : W({}, e, a), t.memoizedState = a, t.lanes === 0 && (t.updateQueue.baseState = a);
  }
  var zu = {
    isMounted: function(t) {
      return (t = t._reactInternals) ? Y(t) === t : !1;
    },
    enqueueSetState: function(t, e, a) {
      t = t._reactInternals;
      var r = De(), o = Fn(r);
      o.payload = e, a != null && (o.callback = a), e = Wn(t, o, r), e !== null && (de(e, t, r), Us(e, t, r));
    },
    enqueueReplaceState: function(t, e, a) {
      t = t._reactInternals;
      var r = De(), o = Fn(r);
      o.tag = 1, o.payload = e, a != null && (o.callback = a), e = Wn(t, o, r), e !== null && (de(e, t, r), Us(e, t, r));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var a = De(), r = Fn(a);
      r.tag = 2, e != null && (r.callback = e), e = Wn(t, r, a), e !== null && (de(e, t, a), Us(e, t, a));
    }
  };
  function Xm(t, e, a, r, o, c, v) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(r, c, v) : e.prototype && e.prototype.isPureReactComponent ? !Ts(a, r) || !Ts(o, c) : !0;
  }
  function Km(t, e, a, r) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(a, r), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(a, r), e.state !== t && zu.enqueueReplaceState(e, e.state, null);
  }
  function _i(t, e) {
    var a = e;
    if ("ref" in e) {
      a = {};
      for (var r in e)
        r !== "ref" && (a[r] = e[r]);
    }
    if (t = t.defaultProps) {
      a === e && (a = W({}, a));
      for (var o in t)
        a[o] === void 0 && (a[o] = t[o]);
    }
    return a;
  }
  var cl = typeof reportError == "function" ? reportError : function(t) {
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
  function Zm(t) {
    cl(t);
  }
  function Qm(t) {
    console.error(t);
  }
  function Fm(t) {
    cl(t);
  }
  function fl(t, e) {
    try {
      var a = t.onUncaughtError;
      a(e.value, { componentStack: e.stack });
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  function Wm(t, e, a) {
    try {
      var r = t.onCaughtError;
      r(a.value, {
        componentStack: a.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  function Vu(t, e, a) {
    return a = Fn(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      fl(t, e);
    }, a;
  }
  function $m(t) {
    return t = Fn(t), t.tag = 3, t;
  }
  function Jm(t, e, a, r) {
    var o = a.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      t.payload = function() {
        return o(c);
      }, t.callback = function() {
        Wm(e, a, r);
      };
    }
    var v = a.stateNode;
    v !== null && typeof v.componentDidCatch == "function" && (t.callback = function() {
      Wm(e, a, r), typeof o != "function" && (ni === null ? ni = /* @__PURE__ */ new Set([this]) : ni.add(this));
      var x = r.stack;
      this.componentDidCatch(r.value, {
        componentStack: x !== null ? x : ""
      });
    });
  }
  function oS(t, e, a, r, o) {
    if (a.flags |= 32768, r !== null && typeof r == "object" && typeof r.then == "function") {
      if (e = a.alternate, e !== null && Bs(
        e,
        a,
        o,
        !0
      ), a = Be.current, a !== null) {
        switch (a.tag) {
          case 13:
            return tn === null ? gc() : a.alternate === null && Ht === 0 && (Ht = 3), a.flags &= -257, a.flags |= 65536, a.lanes = o, r === fu ? a.flags |= 16384 : (e = a.updateQueue, e === null ? a.updateQueue = /* @__PURE__ */ new Set([r]) : e.add(r), yc(t, r, o)), !1;
          case 22:
            return a.flags |= 65536, r === fu ? a.flags |= 16384 : (e = a.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([r])
            }, a.updateQueue = e) : (a = e.retryQueue, a === null ? e.retryQueue = /* @__PURE__ */ new Set([r]) : a.add(r)), yc(t, r, o)), !1;
        }
        throw Error(l(435, a.tag));
      }
      return yc(t, r, o), gc(), !1;
    }
    if (wt)
      return e = Be.current, e !== null ? (!(e.flags & 65536) && (e.flags |= 256), e.flags |= 65536, e.lanes = o, r !== cu && (t = Error(l(422), { cause: r }), Rs(ze(t, a)))) : (r !== cu && (e = Error(l(423), {
        cause: r
      }), Rs(
        ze(e, a)
      )), t = t.current.alternate, t.flags |= 65536, o &= -o, t.lanes |= o, r = ze(r, a), o = Vu(
        t.stateNode,
        r,
        o
      ), Wu(t, o), Ht !== 4 && (Ht = 2)), !1;
    var c = Error(l(520), { cause: r });
    if (c = ze(c, a), Ks === null ? Ks = [c] : Ks.push(c), Ht !== 4 && (Ht = 2), e === null) return !0;
    r = ze(r, a), a = e;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, t = o & -o, a.lanes |= t, t = Vu(a.stateNode, r, t), Wu(a, t), !1;
        case 1:
          if (e = a.type, c = a.stateNode, (a.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (ni === null || !ni.has(c))))
            return a.flags |= 65536, o &= -o, a.lanes |= o, o = $m(o), Jm(
              o,
              t,
              a,
              r
            ), Wu(a, o), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var Im = Error(l(461)), Jt = !1;
  function ae(t, e, a, r) {
    e.child = t === null ? am(e, null, a, r) : Mi(
      e,
      t.child,
      a,
      r
    );
  }
  function tp(t, e, a, r, o) {
    a = a.render;
    var c = e.ref;
    if ("ref" in r) {
      var v = {};
      for (var x in r)
        x !== "ref" && (v[x] = r[x]);
    } else v = r;
    return Vi(e), r = yu(
      t,
      e,
      a,
      v,
      c,
      o
    ), x = bu(), t !== null && !Jt ? (xu(t, e, o), vn(t, e, o)) : (wt && x && ou(e), e.flags |= 1, ae(t, e, r, o), e.child);
  }
  function ep(t, e, a, r, o) {
    if (t === null) {
      var c = a.type;
      return typeof c == "function" && !ac(c) && c.defaultProps === void 0 && a.compare === null ? (e.tag = 15, e.type = c, np(
        t,
        e,
        c,
        r,
        o
      )) : (t = gl(
        a.type,
        null,
        r,
        e,
        e.mode,
        o
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (c = t.child, !Yu(t, o)) {
      var v = c.memoizedProps;
      if (a = a.compare, a = a !== null ? a : Ts, a(v, r) && t.ref === e.ref)
        return vn(t, e, o);
    }
    return e.flags |= 1, t = ti(c, r), t.ref = e.ref, t.return = e, e.child = t;
  }
  function np(t, e, a, r, o) {
    if (t !== null) {
      var c = t.memoizedProps;
      if (Ts(c, r) && t.ref === e.ref)
        if (Jt = !1, e.pendingProps = r = c, Yu(t, o))
          t.flags & 131072 && (Jt = !0);
        else
          return e.lanes = t.lanes, vn(t, e, o);
    }
    return Lu(
      t,
      e,
      a,
      r,
      o
    );
  }
  function ip(t, e, a) {
    var r = e.pendingProps, o = r.children, c = (e.stateNode._pendingVisibility & 2) !== 0, v = t !== null ? t.memoizedState : null;
    if (Ls(t, e), r.mode === "hidden" || c) {
      if (e.flags & 128) {
        if (r = v !== null ? v.baseLanes | a : a, t !== null) {
          for (o = e.child = t.child, c = 0; o !== null; )
            c = c | o.lanes | o.childLanes, o = o.sibling;
          e.childLanes = c & ~r;
        } else e.childLanes = 0, e.child = null;
        return ap(
          t,
          e,
          r,
          a
        );
      }
      if (a & 536870912)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && el(
          e,
          v !== null ? v.cachePool : null
        ), v !== null ? sm(e, v) : du(), rm(e);
      else
        return e.lanes = e.childLanes = 536870912, ap(
          t,
          e,
          v !== null ? v.baseLanes | a : a,
          a
        );
    } else
      v !== null ? (el(e, v.cachePool), sm(e, v), Yn(), e.memoizedState = null) : (t !== null && el(e, null), du(), Yn());
    return ae(t, e, o, a), e.child;
  }
  function ap(t, e, a, r) {
    var o = gu();
    return o = o === null ? null : { parent: Wt._currentValue, pool: o }, e.memoizedState = {
      baseLanes: a,
      cachePool: o
    }, t !== null && el(e, null), du(), rm(e), t !== null && Bs(t, e, r, !0), null;
  }
  function Ls(t, e) {
    var a = e.ref;
    if (a === null)
      t !== null && t.ref !== null && (e.flags |= 2097664);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(l(284));
      (t === null || t.ref !== a) && (e.flags |= 2097664);
    }
  }
  function Lu(t, e, a, r, o) {
    return Vi(e), a = yu(
      t,
      e,
      a,
      r,
      void 0,
      o
    ), r = bu(), t !== null && !Jt ? (xu(t, e, o), vn(t, e, o)) : (wt && r && ou(e), e.flags |= 1, ae(t, e, a, o), e.child);
  }
  function sp(t, e, a, r, o, c) {
    return Vi(e), e.updateQueue = null, a = fm(
      e,
      r,
      a,
      o
    ), cm(t), r = bu(), t !== null && !Jt ? (xu(t, e, c), vn(t, e, c)) : (wt && r && ou(e), e.flags |= 1, ae(t, e, a, c), e.child);
  }
  function rp(t, e, a, r, o) {
    if (Vi(e), e.stateNode === null) {
      var c = ga, v = a.contextType;
      typeof v == "object" && v !== null && (c = oe(v)), c = new a(r, c), e.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, c.updater = zu, e.stateNode = c, c._reactInternals = e, c = e.stateNode, c.props = r, c.state = e.memoizedState, c.refs = {}, Qu(e), v = a.contextType, c.context = typeof v == "object" && v !== null ? oe(v) : ga, c.state = e.memoizedState, v = a.getDerivedStateFromProps, typeof v == "function" && (_u(
        e,
        a,
        v,
        r
      ), c.state = e.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (v = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), v !== c.state && zu.enqueueReplaceState(c, c.state, null), Hs(e, r, c, o), ks(), c.state = e.memoizedState), typeof c.componentDidMount == "function" && (e.flags |= 4194308), r = !0;
    } else if (t === null) {
      c = e.stateNode;
      var x = e.memoizedProps, E = _i(a, x);
      c.props = E;
      var N = c.context, H = a.contextType;
      v = ga, typeof H == "object" && H !== null && (v = oe(H));
      var X = a.getDerivedStateFromProps;
      H = typeof X == "function" || typeof c.getSnapshotBeforeUpdate == "function", x = e.pendingProps !== x, H || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (x || N !== v) && Km(
        e,
        c,
        r,
        v
      ), Qn = !1;
      var B = e.memoizedState;
      c.state = B, Hs(e, r, c, o), ks(), N = e.memoizedState, x || B !== N || Qn ? (typeof X == "function" && (_u(
        e,
        a,
        X,
        r
      ), N = e.memoizedState), (E = Qn || Xm(
        e,
        a,
        E,
        r,
        B,
        N,
        v
      )) ? (H || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = r, e.memoizedState = N), c.props = r, c.state = N, c.context = v, r = E) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308), r = !1);
    } else {
      c = e.stateNode, Fu(t, e), v = e.memoizedProps, H = _i(a, v), c.props = H, X = e.pendingProps, B = c.context, N = a.contextType, E = ga, typeof N == "object" && N !== null && (E = oe(N)), x = a.getDerivedStateFromProps, (N = typeof x == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (v !== X || B !== E) && Km(
        e,
        c,
        r,
        E
      ), Qn = !1, B = e.memoizedState, c.state = B, Hs(e, r, c, o), ks();
      var k = e.memoizedState;
      v !== X || B !== k || Qn || t !== null && t.dependencies !== null && dl(t.dependencies) ? (typeof x == "function" && (_u(
        e,
        a,
        x,
        r
      ), k = e.memoizedState), (H = Qn || Xm(
        e,
        a,
        H,
        r,
        B,
        k,
        E
      ) || t !== null && t.dependencies !== null && dl(t.dependencies)) ? (N || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(r, k, E), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(
        r,
        k,
        E
      )), typeof c.componentDidUpdate == "function" && (e.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || v === t.memoizedProps && B === t.memoizedState || (e.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || v === t.memoizedProps && B === t.memoizedState || (e.flags |= 1024), e.memoizedProps = r, e.memoizedState = k), c.props = r, c.state = k, c.context = E, r = H) : (typeof c.componentDidUpdate != "function" || v === t.memoizedProps && B === t.memoizedState || (e.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || v === t.memoizedProps && B === t.memoizedState || (e.flags |= 1024), r = !1);
    }
    return c = r, Ls(t, e), r = (e.flags & 128) !== 0, c || r ? (c = e.stateNode, a = r && typeof a.getDerivedStateFromError != "function" ? null : c.render(), e.flags |= 1, t !== null && r ? (e.child = Mi(
      e,
      t.child,
      null,
      o
    ), e.child = Mi(
      e,
      null,
      a,
      o
    )) : ae(t, e, a, o), e.memoizedState = c.state, t = e.child) : t = vn(
      t,
      e,
      o
    ), t;
  }
  function lp(t, e, a, r) {
    return Es(), e.flags |= 256, ae(t, e, a, r), e.child;
  }
  var Bu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Uu(t) {
    return { baseLanes: t, cachePool: um() };
  }
  function ku(t, e, a) {
    return t = t !== null ? t.childLanes & ~a : 0, e && (t |= Pe), t;
  }
  function op(t, e, a) {
    var r = e.pendingProps, o = !1, c = (e.flags & 128) !== 0, v;
    if ((v = c) || (v = t !== null && t.memoizedState === null ? !1 : (Ft.current & 2) !== 0), v && (o = !0, e.flags &= -129), v = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (wt) {
        if (o ? Gn(e) : Yn(), wt) {
          var x = ie, E;
          if (E = x) {
            t: {
              for (E = x, x = Ie; E.nodeType !== 8; ) {
                if (!x) {
                  x = null;
                  break t;
                }
                if (E = Qe(
                  E.nextSibling
                ), E === null) {
                  x = null;
                  break t;
                }
              }
              x = E;
            }
            x !== null ? (e.memoizedState = {
              dehydrated: x,
              treeContext: Ei !== null ? { id: hn, overflow: mn } : null,
              retryLane: 536870912
            }, E = He(
              18,
              null,
              null,
              0
            ), E.stateNode = x, E.return = e, e.child = E, fe = e, ie = null, E = !0) : E = !1;
          }
          E || Ci(e);
        }
        if (x = e.memoizedState, x !== null && (x = x.dehydrated, x !== null))
          return x.data === "$!" ? e.lanes = 16 : e.lanes = 536870912, null;
        pn(e);
      }
      return x = r.children, r = r.fallback, o ? (Yn(), o = e.mode, x = Pu(
        { mode: "hidden", children: x },
        o
      ), r = Bi(
        r,
        o,
        a,
        null
      ), x.return = e, r.return = e, x.sibling = r, e.child = x, o = e.child, o.memoizedState = Uu(a), o.childLanes = ku(
        t,
        v,
        a
      ), e.memoizedState = Bu, r) : (Gn(e), Hu(e, x));
    }
    if (E = t.memoizedState, E !== null && (x = E.dehydrated, x !== null)) {
      if (c)
        e.flags & 256 ? (Gn(e), e.flags &= -257, e = qu(
          t,
          e,
          a
        )) : e.memoizedState !== null ? (Yn(), e.child = t.child, e.flags |= 128, e = null) : (Yn(), o = r.fallback, x = e.mode, r = Pu(
          { mode: "visible", children: r.children },
          x
        ), o = Bi(
          o,
          x,
          a,
          null
        ), o.flags |= 2, r.return = e, o.return = e, r.sibling = o, e.child = r, Mi(
          e,
          t.child,
          null,
          a
        ), r = e.child, r.memoizedState = Uu(a), r.childLanes = ku(
          t,
          v,
          a
        ), e.memoizedState = Bu, e = o);
      else if (Gn(e), x.data === "$!") {
        if (v = x.nextSibling && x.nextSibling.dataset, v) var N = v.dgst;
        v = N, r = Error(l(419)), r.stack = "", r.digest = v, Rs({ value: r, source: null, stack: null }), e = qu(
          t,
          e,
          a
        );
      } else if (Jt || Bs(t, e, a, !1), v = (a & t.childLanes) !== 0, Jt || v) {
        if (v = jt, v !== null) {
          if (r = a & -a, r & 42) r = 1;
          else
            switch (r) {
              case 2:
                r = 1;
                break;
              case 8:
                r = 4;
                break;
              case 32:
                r = 16;
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
                r = 64;
                break;
              case 268435456:
                r = 134217728;
                break;
              default:
                r = 0;
            }
          if (r = r & (v.suspendedLanes | a) ? 0 : r, r !== 0 && r !== E.retryLane)
            throw E.retryLane = r, qn(t, r), de(v, t, r), Im;
        }
        x.data === "$?" || gc(), e = qu(
          t,
          e,
          a
        );
      } else
        x.data === "$?" ? (e.flags |= 128, e.child = t.child, e = AS.bind(
          null,
          t
        ), x._reactRetry = e, e = null) : (t = E.treeContext, ie = Qe(
          x.nextSibling
        ), fe = e, wt = !0, Ke = null, Ie = !1, t !== null && (Ve[Le++] = hn, Ve[Le++] = mn, Ve[Le++] = Ei, hn = t.id, mn = t.overflow, Ei = e), e = Hu(
          e,
          r.children
        ), e.flags |= 4096);
      return e;
    }
    return o ? (Yn(), o = r.fallback, x = e.mode, E = t.child, N = E.sibling, r = ti(E, {
      mode: "hidden",
      children: r.children
    }), r.subtreeFlags = E.subtreeFlags & 31457280, N !== null ? o = ti(N, o) : (o = Bi(
      o,
      x,
      a,
      null
    ), o.flags |= 2), o.return = e, r.return = e, r.sibling = o, e.child = r, r = o, o = e.child, x = t.child.memoizedState, x === null ? x = Uu(a) : (E = x.cachePool, E !== null ? (N = Wt._currentValue, E = E.parent !== N ? { parent: N, pool: N } : E) : E = um(), x = {
      baseLanes: x.baseLanes | a,
      cachePool: E
    }), o.memoizedState = x, o.childLanes = ku(
      t,
      v,
      a
    ), e.memoizedState = Bu, r) : (Gn(e), a = t.child, t = a.sibling, a = ti(a, {
      mode: "visible",
      children: r.children
    }), a.return = e, a.sibling = null, t !== null && (v = e.deletions, v === null ? (e.deletions = [t], e.flags |= 16) : v.push(t)), e.child = a, e.memoizedState = null, a);
  }
  function Hu(t, e) {
    return e = Pu(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function Pu(t, e) {
    return zp(t, e, 0, null);
  }
  function qu(t, e, a) {
    return Mi(e, t.child, null, a), t = Hu(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function up(t, e, a) {
    t.lanes |= e;
    var r = t.alternate;
    r !== null && (r.lanes |= e), Ku(t.return, e, a);
  }
  function Gu(t, e, a, r, o) {
    var c = t.memoizedState;
    c === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: r,
      tail: a,
      tailMode: o
    } : (c.isBackwards = e, c.rendering = null, c.renderingStartTime = 0, c.last = r, c.tail = a, c.tailMode = o);
  }
  function cp(t, e, a) {
    var r = e.pendingProps, o = r.revealOrder, c = r.tail;
    if (ae(t, e, r.children, a), r = Ft.current, r & 2)
      r = r & 1 | 2, e.flags |= 128;
    else {
      if (t !== null && t.flags & 128)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13)
            t.memoizedState !== null && up(t, a, e);
          else if (t.tag === 19)
            up(t, a, e);
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
      r &= 1;
    }
    switch (Dt(Ft, r), o) {
      case "forwards":
        for (a = e.child, o = null; a !== null; )
          t = a.alternate, t !== null && tl(t) === null && (o = a), a = a.sibling;
        a = o, a === null ? (o = e.child, e.child = null) : (o = a.sibling, a.sibling = null), Gu(
          e,
          !1,
          o,
          a,
          c
        );
        break;
      case "backwards":
        for (a = null, o = e.child, e.child = null; o !== null; ) {
          if (t = o.alternate, t !== null && tl(t) === null) {
            e.child = o;
            break;
          }
          t = o.sibling, o.sibling = a, a = o, o = t;
        }
        Gu(
          e,
          !0,
          a,
          null,
          c
        );
        break;
      case "together":
        Gu(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function vn(t, e, a) {
    if (t !== null && (e.dependencies = t.dependencies), ei |= e.lanes, !(a & e.childLanes))
      if (t !== null) {
        if (Bs(
          t,
          e,
          a,
          !1
        ), (a & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(l(153));
    if (e.child !== null) {
      for (t = e.child, a = ti(t, t.pendingProps), e.child = a, a.return = e; t.sibling !== null; )
        t = t.sibling, a = a.sibling = ti(t, t.pendingProps), a.return = e;
      a.sibling = null;
    }
    return e.child;
  }
  function Yu(t, e) {
    return t.lanes & e ? !0 : (t = t.dependencies, !!(t !== null && dl(t)));
  }
  function uS(t, e, a) {
    switch (e.tag) {
      case 3:
        na(e, e.stateNode.containerInfo), Zn(e, Wt, t.memoizedState.cache), Es();
        break;
      case 27:
      case 5:
        us(e);
        break;
      case 4:
        na(e, e.stateNode.containerInfo);
        break;
      case 10:
        Zn(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 13:
        var r = e.memoizedState;
        if (r !== null)
          return r.dehydrated !== null ? (Gn(e), e.flags |= 128, null) : a & e.child.childLanes ? op(t, e, a) : (Gn(e), t = vn(
            t,
            e,
            a
          ), t !== null ? t.sibling : null);
        Gn(e);
        break;
      case 19:
        var o = (t.flags & 128) !== 0;
        if (r = (a & e.childLanes) !== 0, r || (Bs(
          t,
          e,
          a,
          !1
        ), r = (a & e.childLanes) !== 0), o) {
          if (r)
            return cp(
              t,
              e,
              a
            );
          e.flags |= 128;
        }
        if (o = e.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Dt(Ft, Ft.current), r) break;
        return null;
      case 22:
      case 23:
        return e.lanes = 0, ip(t, e, a);
      case 24:
        Zn(e, Wt, t.memoizedState.cache);
    }
    return vn(t, e, a);
  }
  function fp(t, e, a) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Jt = !0;
      else {
        if (!Yu(t, a) && !(e.flags & 128))
          return Jt = !1, uS(
            t,
            e,
            a
          );
        Jt = !!(t.flags & 131072);
      }
    else
      Jt = !1, wt && e.flags & 1048576 && Fh(e, Fr, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          t = e.pendingProps;
          var r = e.elementType, o = r._init;
          if (r = o(r._payload), e.type = r, typeof r == "function")
            ac(r) ? (t = _i(r, t), e.tag = 1, e = rp(
              null,
              e,
              r,
              t,
              a
            )) : (e.tag = 0, e = Lu(
              null,
              e,
              r,
              t,
              a
            ));
          else {
            if (r != null) {
              if (o = r.$$typeof, o === R) {
                e.tag = 11, e = tp(
                  null,
                  e,
                  r,
                  t,
                  a
                );
                break t;
              } else if (o === O) {
                e.tag = 14, e = ep(
                  null,
                  e,
                  r,
                  t,
                  a
                );
                break t;
              }
            }
            throw e = F(r) || r, Error(l(306, e, ""));
          }
        }
        return e;
      case 0:
        return Lu(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 1:
        return r = e.type, o = _i(
          r,
          e.pendingProps
        ), rp(
          t,
          e,
          r,
          o,
          a
        );
      case 3:
        t: {
          if (na(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(l(387));
          var c = e.pendingProps;
          o = e.memoizedState, r = o.element, Fu(t, e), Hs(e, c, null, a);
          var v = e.memoizedState;
          if (c = v.cache, Zn(e, Wt, c), c !== o.cache && Zu(
            e,
            [Wt],
            a,
            !0
          ), ks(), c = v.element, o.isDehydrated)
            if (o = {
              element: c,
              isDehydrated: !1,
              cache: v.cache
            }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
              e = lp(
                t,
                e,
                c,
                a
              );
              break t;
            } else if (c !== r) {
              r = ze(
                Error(l(424)),
                e
              ), Rs(r), e = lp(
                t,
                e,
                c,
                a
              );
              break t;
            } else
              for (ie = Qe(
                e.stateNode.containerInfo.firstChild
              ), fe = e, wt = !0, Ke = null, Ie = !0, a = am(
                e,
                null,
                c,
                a
              ), e.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
          else {
            if (Es(), c === r) {
              e = vn(
                t,
                e,
                a
              );
              break t;
            }
            ae(t, e, c, a);
          }
          e = e.child;
        }
        return e;
      case 26:
        return Ls(t, e), t === null ? (a = mg(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = a : wt || (a = e.type, t = e.pendingProps, r = Ml(
          me.current
        ).createElement(a), r[le] = e, r[pe] = t, se(r, a, t), $t(r), e.stateNode = r) : e.memoizedState = mg(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return us(e), t === null && wt && (r = e.stateNode = fg(
          e.type,
          e.pendingProps,
          me.current
        ), fe = e, Ie = !0, ie = Qe(
          r.firstChild
        )), r = e.pendingProps.children, t !== null || wt ? ae(
          t,
          e,
          r,
          a
        ) : e.child = Mi(
          e,
          null,
          r,
          a
        ), Ls(t, e), e.child;
      case 5:
        return t === null && wt && ((o = r = ie) && (r = kS(
          r,
          e.type,
          e.pendingProps,
          Ie
        ), r !== null ? (e.stateNode = r, fe = e, ie = Qe(
          r.firstChild
        ), Ie = !1, o = !0) : o = !1), o || Ci(e)), us(e), o = e.type, c = e.pendingProps, v = t !== null ? t.memoizedProps : null, r = c.children, Oc(o, c) ? r = null : v !== null && Oc(o, v) && (e.flags |= 32), e.memoizedState !== null && (o = yu(
          t,
          e,
          nS,
          null,
          null,
          a
        ), er._currentValue = o), Ls(t, e), ae(t, e, r, a), e.child;
      case 6:
        return t === null && wt && ((t = a = ie) && (a = HS(
          a,
          e.pendingProps,
          Ie
        ), a !== null ? (e.stateNode = a, fe = e, ie = null, t = !0) : t = !1), t || Ci(e)), null;
      case 13:
        return op(t, e, a);
      case 4:
        return na(
          e,
          e.stateNode.containerInfo
        ), r = e.pendingProps, t === null ? e.child = Mi(
          e,
          null,
          r,
          a
        ) : ae(
          t,
          e,
          r,
          a
        ), e.child;
      case 11:
        return tp(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 7:
        return ae(
          t,
          e,
          e.pendingProps,
          a
        ), e.child;
      case 8:
        return ae(
          t,
          e,
          e.pendingProps.children,
          a
        ), e.child;
      case 12:
        return ae(
          t,
          e,
          e.pendingProps.children,
          a
        ), e.child;
      case 10:
        return r = e.pendingProps, Zn(e, e.type, r.value), ae(
          t,
          e,
          r.children,
          a
        ), e.child;
      case 9:
        return o = e.type._context, r = e.pendingProps.children, Vi(e), o = oe(o), r = r(o), e.flags |= 1, ae(t, e, r, a), e.child;
      case 14:
        return ep(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 15:
        return np(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 19:
        return cp(t, e, a);
      case 22:
        return ip(t, e, a);
      case 24:
        return Vi(e), r = oe(Wt), t === null ? (o = gu(), o === null && (o = jt, c = mu(), o.pooledCache = c, c.refCount++, c !== null && (o.pooledCacheLanes |= a), o = c), e.memoizedState = {
          parent: r,
          cache: o
        }, Qu(e), Zn(e, Wt, o)) : (t.lanes & a && (Fu(t, e), Hs(e, null, null, a), ks()), o = t.memoizedState, c = e.memoizedState, o.parent !== r ? (o = { parent: r, cache: r }, e.memoizedState = o, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = o), Zn(e, Wt, r)) : (r = c.cache, Zn(e, Wt, r), r !== o.cache && Zu(
          e,
          [Wt],
          a,
          !0
        ))), ae(
          t,
          e,
          e.pendingProps.children,
          a
        ), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(l(156, e.tag));
  }
  var Xu = At(null), zi = null, yn = null;
  function Zn(t, e, a) {
    Dt(Xu, e._currentValue), e._currentValue = a;
  }
  function bn(t) {
    t._currentValue = Xu.current, Vt(Xu);
  }
  function Ku(t, e, a) {
    for (; t !== null; ) {
      var r = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, r !== null && (r.childLanes |= e)) : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e), t === a) break;
      t = t.return;
    }
  }
  function Zu(t, e, a, r) {
    var o = t.child;
    for (o !== null && (o.return = t); o !== null; ) {
      var c = o.dependencies;
      if (c !== null) {
        var v = o.child;
        c = c.firstContext;
        t: for (; c !== null; ) {
          var x = c;
          c = o;
          for (var E = 0; E < e.length; E++)
            if (x.context === e[E]) {
              c.lanes |= a, x = c.alternate, x !== null && (x.lanes |= a), Ku(
                c.return,
                a,
                t
              ), r || (v = null);
              break t;
            }
          c = x.next;
        }
      } else if (o.tag === 18) {
        if (v = o.return, v === null) throw Error(l(341));
        v.lanes |= a, c = v.alternate, c !== null && (c.lanes |= a), Ku(v, a, t), v = null;
      } else v = o.child;
      if (v !== null) v.return = o;
      else
        for (v = o; v !== null; ) {
          if (v === t) {
            v = null;
            break;
          }
          if (o = v.sibling, o !== null) {
            o.return = v.return, v = o;
            break;
          }
          v = v.return;
        }
      o = v;
    }
  }
  function Bs(t, e, a, r) {
    t = null;
    for (var o = e, c = !1; o !== null; ) {
      if (!c) {
        if (o.flags & 524288) c = !0;
        else if (o.flags & 262144) break;
      }
      if (o.tag === 10) {
        var v = o.alternate;
        if (v === null) throw Error(l(387));
        if (v = v.memoizedProps, v !== null) {
          var x = o.type;
          Ee(o.pendingProps.value, v.value) || (t !== null ? t.push(x) : t = [x]);
        }
      } else if (o === yi.current) {
        if (v = o.alternate, v === null) throw Error(l(387));
        v.memoizedState.memoizedState !== o.memoizedState.memoizedState && (t !== null ? t.push(er) : t = [er]);
      }
      o = o.return;
    }
    t !== null && Zu(
      e,
      t,
      a,
      r
    ), e.flags |= 262144;
  }
  function dl(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!Ee(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Vi(t) {
    zi = t, yn = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function oe(t) {
    return dp(zi, t);
  }
  function hl(t, e) {
    return zi === null && Vi(t), dp(t, e);
  }
  function dp(t, e) {
    var a = e._currentValue;
    if (e = { context: e, memoizedValue: a, next: null }, yn === null) {
      if (t === null) throw Error(l(308));
      yn = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else yn = yn.next = e;
    return a;
  }
  var Qn = !1;
  function Qu(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Fu(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function Fn(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wn(t, e, a) {
    var r = t.updateQueue;
    if (r === null) return null;
    if (r = r.shared, Bt & 2) {
      var o = r.pending;
      return o === null ? e.next = e : (e.next = o.next, o.next = e), r.pending = e, e = Zr(t), Zh(t, null, a), e;
    }
    return Kr(t, r, e, a), Zr(t);
  }
  function Us(t, e, a) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (a & 4194176) !== 0)) {
      var r = e.lanes;
      r &= t.pendingLanes, a |= r, e.lanes = a, eh(t, a);
    }
  }
  function Wu(t, e) {
    var a = t.updateQueue, r = t.alternate;
    if (r !== null && (r = r.updateQueue, a === r)) {
      var o = null, c = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var v = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          c === null ? o = c = v : c = c.next = v, a = a.next;
        } while (a !== null);
        c === null ? o = c = e : c = c.next = e;
      } else o = c = e;
      a = {
        baseState: r.baseState,
        firstBaseUpdate: o,
        lastBaseUpdate: c,
        shared: r.shared,
        callbacks: r.callbacks
      }, t.updateQueue = a;
      return;
    }
    t = a.lastBaseUpdate, t === null ? a.firstBaseUpdate = e : t.next = e, a.lastBaseUpdate = e;
  }
  var $u = !1;
  function ks() {
    if ($u) {
      var t = Ta;
      if (t !== null) throw t;
    }
  }
  function Hs(t, e, a, r) {
    $u = !1;
    var o = t.updateQueue;
    Qn = !1;
    var c = o.firstBaseUpdate, v = o.lastBaseUpdate, x = o.shared.pending;
    if (x !== null) {
      o.shared.pending = null;
      var E = x, N = E.next;
      E.next = null, v === null ? c = N : v.next = N, v = E;
      var H = t.alternate;
      H !== null && (H = H.updateQueue, x = H.lastBaseUpdate, x !== v && (x === null ? H.firstBaseUpdate = N : x.next = N, H.lastBaseUpdate = E));
    }
    if (c !== null) {
      var X = o.baseState;
      v = 0, H = N = E = null, x = c;
      do {
        var B = x.lane & -536870913, k = B !== x.lane;
        if (k ? (Tt & B) === B : (r & B) === B) {
          B !== 0 && B === Sa && ($u = !0), H !== null && (H = H.next = {
            lane: 0,
            tag: x.tag,
            payload: x.payload,
            callback: null,
            next: null
          });
          t: {
            var it = t, ct = x;
            B = e;
            var Pt = a;
            switch (ct.tag) {
              case 1:
                if (it = ct.payload, typeof it == "function") {
                  X = it.call(Pt, X, B);
                  break t;
                }
                X = it;
                break t;
              case 3:
                it.flags = it.flags & -65537 | 128;
              case 0:
                if (it = ct.payload, B = typeof it == "function" ? it.call(Pt, X, B) : it, B == null) break t;
                X = W({}, X, B);
                break t;
              case 2:
                Qn = !0;
            }
          }
          B = x.callback, B !== null && (t.flags |= 64, k && (t.flags |= 8192), k = o.callbacks, k === null ? o.callbacks = [B] : k.push(B));
        } else
          k = {
            lane: B,
            tag: x.tag,
            payload: x.payload,
            callback: x.callback,
            next: null
          }, H === null ? (N = H = k, E = X) : H = H.next = k, v |= B;
        if (x = x.next, x === null) {
          if (x = o.shared.pending, x === null)
            break;
          k = x, x = k.next, k.next = null, o.lastBaseUpdate = k, o.shared.pending = null;
        }
      } while (!0);
      H === null && (E = X), o.baseState = E, o.firstBaseUpdate = N, o.lastBaseUpdate = H, c === null && (o.shared.lanes = 0), ei |= v, t.lanes = v, t.memoizedState = X;
    }
  }
  function hp(t, e) {
    if (typeof t != "function")
      throw Error(l(191, t));
    t.call(e);
  }
  function mp(t, e) {
    var a = t.callbacks;
    if (a !== null)
      for (t.callbacks = null, t = 0; t < a.length; t++)
        hp(a[t], e);
  }
  function Ps(t, e) {
    try {
      var a = e.updateQueue, r = a !== null ? a.lastEffect : null;
      if (r !== null) {
        var o = r.next;
        a = o;
        do {
          if ((a.tag & t) === t) {
            r = void 0;
            var c = a.create, v = a.inst;
            r = c(), v.destroy = r;
          }
          a = a.next;
        } while (a !== o);
      }
    } catch (x) {
      Ot(e, e.return, x);
    }
  }
  function $n(t, e, a) {
    try {
      var r = e.updateQueue, o = r !== null ? r.lastEffect : null;
      if (o !== null) {
        var c = o.next;
        r = c;
        do {
          if ((r.tag & t) === t) {
            var v = r.inst, x = v.destroy;
            if (x !== void 0) {
              v.destroy = void 0, o = e;
              var E = a;
              try {
                x();
              } catch (N) {
                Ot(
                  o,
                  E,
                  N
                );
              }
            }
          }
          r = r.next;
        } while (r !== c);
      }
    } catch (N) {
      Ot(e, e.return, N);
    }
  }
  function pp(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var a = t.stateNode;
      try {
        mp(e, a);
      } catch (r) {
        Ot(t, t.return, r);
      }
    }
  }
  function gp(t, e, a) {
    a.props = _i(
      t.type,
      t.memoizedProps
    ), a.state = t.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (r) {
      Ot(t, e, r);
    }
  }
  function Li(t, e) {
    try {
      var a = t.ref;
      if (a !== null) {
        var r = t.stateNode;
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var o = r;
            break;
          default:
            o = r;
        }
        typeof a == "function" ? t.refCleanup = a(o) : a.current = o;
      }
    } catch (c) {
      Ot(t, e, c);
    }
  }
  function Re(t, e) {
    var a = t.ref, r = t.refCleanup;
    if (a !== null)
      if (typeof r == "function")
        try {
          r();
        } catch (o) {
          Ot(t, e, o);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (o) {
          Ot(t, e, o);
        }
      else a.current = null;
  }
  function vp(t) {
    var e = t.type, a = t.memoizedProps, r = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && r.focus();
          break t;
        case "img":
          a.src ? r.src = a.src : a.srcSet && (r.srcset = a.srcSet);
      }
    } catch (o) {
      Ot(t, t.return, o);
    }
  }
  function yp(t, e, a) {
    try {
      var r = t.stateNode;
      zS(r, t.type, a, e), r[pe] = e;
    } catch (o) {
      Ot(t, t.return, o);
    }
  }
  function bp(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 || t.tag === 4;
  }
  function Ju(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || bp(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 27 && t.tag !== 18; ) {
        if (t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Iu(t, e, a) {
    var r = t.tag;
    if (r === 5 || r === 6)
      t = t.stateNode, e ? a.nodeType === 8 ? a.parentNode.insertBefore(t, e) : a.insertBefore(t, e) : (a.nodeType === 8 ? (e = a.parentNode, e.insertBefore(t, a)) : (e = a, e.appendChild(t)), a = a._reactRootContainer, a != null || e.onclick !== null || (e.onclick = Cl));
    else if (r !== 4 && r !== 27 && (t = t.child, t !== null))
      for (Iu(t, e, a), t = t.sibling; t !== null; )
        Iu(t, e, a), t = t.sibling;
  }
  function ml(t, e, a) {
    var r = t.tag;
    if (r === 5 || r === 6)
      t = t.stateNode, e ? a.insertBefore(t, e) : a.appendChild(t);
    else if (r !== 4 && r !== 27 && (t = t.child, t !== null))
      for (ml(t, e, a), t = t.sibling; t !== null; )
        ml(t, e, a), t = t.sibling;
  }
  var xn = !1, kt = !1, tc = !1, xp = typeof WeakSet == "function" ? WeakSet : Set, It = null, Sp = !1;
  function cS(t, e) {
    if (t = t.containerInfo, Mc = zl, t = Uh(t), nu(t)) {
      if ("selectionStart" in t)
        var a = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          a = (a = t.ownerDocument) && a.defaultView || window;
          var r = a.getSelection && a.getSelection();
          if (r && r.rangeCount !== 0) {
            a = r.anchorNode;
            var o = r.anchorOffset, c = r.focusNode;
            r = r.focusOffset;
            try {
              a.nodeType, c.nodeType;
            } catch {
              a = null;
              break t;
            }
            var v = 0, x = -1, E = -1, N = 0, H = 0, X = t, B = null;
            e: for (; ; ) {
              for (var k; X !== a || o !== 0 && X.nodeType !== 3 || (x = v + o), X !== c || r !== 0 && X.nodeType !== 3 || (E = v + r), X.nodeType === 3 && (v += X.nodeValue.length), (k = X.firstChild) !== null; )
                B = X, X = k;
              for (; ; ) {
                if (X === t) break e;
                if (B === a && ++N === o && (x = v), B === c && ++H === r && (E = v), (k = X.nextSibling) !== null) break;
                X = B, B = X.parentNode;
              }
              X = k;
            }
            a = x === -1 || E === -1 ? null : { start: x, end: E };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Dc = { focusedElem: t, selectionRange: a }, zl = !1, It = e; It !== null; )
      if (e = It, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null)
        t.return = e, It = t;
      else
        for (; It !== null; ) {
          switch (e = It, c = e.alternate, t = e.flags, e.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if (t & 1024 && c !== null) {
                t = void 0, a = e, o = c.memoizedProps, c = c.memoizedState, r = a.stateNode;
                try {
                  var it = _i(
                    a.type,
                    o,
                    a.elementType === a.type
                  );
                  t = r.getSnapshotBeforeUpdate(
                    it,
                    c
                  ), r.__reactInternalSnapshotBeforeUpdate = t;
                } catch (ct) {
                  Ot(
                    a,
                    a.return,
                    ct
                  );
                }
              }
              break;
            case 3:
              if (t & 1024) {
                if (t = e.stateNode.containerInfo, a = t.nodeType, a === 9)
                  _c(t);
                else if (a === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      _c(t);
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
              if (t & 1024) throw Error(l(163));
          }
          if (t = e.sibling, t !== null) {
            t.return = e.return, It = t;
            break;
          }
          It = e.return;
        }
    return it = Sp, Sp = !1, it;
  }
  function Tp(t, e, a) {
    var r = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        Tn(t, a), r & 4 && Ps(5, a);
        break;
      case 1:
        if (Tn(t, a), r & 4)
          if (t = a.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (x) {
              Ot(a, a.return, x);
            }
          else {
            var o = _i(
              a.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                o,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (x) {
              Ot(
                a,
                a.return,
                x
              );
            }
          }
        r & 64 && pp(a), r & 512 && Li(a, a.return);
        break;
      case 3:
        if (Tn(t, a), r & 64 && (r = a.updateQueue, r !== null)) {
          if (t = null, a.child !== null)
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            mp(r, t);
          } catch (x) {
            Ot(a, a.return, x);
          }
        }
        break;
      case 26:
        Tn(t, a), r & 512 && Li(a, a.return);
        break;
      case 27:
      case 5:
        Tn(t, a), e === null && r & 4 && vp(a), r & 512 && Li(a, a.return);
        break;
      case 12:
        Tn(t, a);
        break;
      case 13:
        Tn(t, a), r & 4 && Ep(t, a);
        break;
      case 22:
        if (o = a.memoizedState !== null || xn, !o) {
          e = e !== null && e.memoizedState !== null || kt;
          var c = xn, v = kt;
          xn = o, (kt = e) && !v ? Jn(
            t,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : Tn(t, a), xn = c, kt = v;
        }
        r & 512 && (a.memoizedProps.mode === "manual" ? Li(a, a.return) : Re(a, a.return));
        break;
      default:
        Tn(t, a);
    }
  }
  function Ap(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Ap(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Ho(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Qt = null, Ce = !1;
  function Sn(t, e, a) {
    for (a = a.child; a !== null; )
      wp(t, e, a), a = a.sibling;
  }
  function wp(t, e, a) {
    if (Ae && typeof Ae.onCommitFiberUnmount == "function")
      try {
        Ae.onCommitFiberUnmount(cs, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        kt || Re(a, e), Sn(
          t,
          e,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        kt || Re(a, e);
        var r = Qt, o = Ce;
        for (Qt = a.stateNode, Sn(
          t,
          e,
          a
        ), a = a.stateNode, e = a.attributes; e.length; )
          a.removeAttributeNode(e[0]);
        Ho(a), Qt = r, Ce = o;
        break;
      case 5:
        kt || Re(a, e);
      case 6:
        o = Qt;
        var c = Ce;
        if (Qt = null, Sn(
          t,
          e,
          a
        ), Qt = o, Ce = c, Qt !== null)
          if (Ce)
            try {
              t = Qt, r = a.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(r) : t.removeChild(r);
            } catch (v) {
              Ot(
                a,
                e,
                v
              );
            }
          else
            try {
              Qt.removeChild(a.stateNode);
            } catch (v) {
              Ot(
                a,
                e,
                v
              );
            }
        break;
      case 18:
        Qt !== null && (Ce ? (e = Qt, a = a.stateNode, e.nodeType === 8 ? jc(
          e.parentNode,
          a
        ) : e.nodeType === 1 && jc(e, a), sr(e)) : jc(Qt, a.stateNode));
        break;
      case 4:
        r = Qt, o = Ce, Qt = a.stateNode.containerInfo, Ce = !0, Sn(
          t,
          e,
          a
        ), Qt = r, Ce = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        kt || $n(2, a, e), kt || $n(4, a, e), Sn(
          t,
          e,
          a
        );
        break;
      case 1:
        kt || (Re(a, e), r = a.stateNode, typeof r.componentWillUnmount == "function" && gp(
          a,
          e,
          r
        )), Sn(
          t,
          e,
          a
        );
        break;
      case 21:
        Sn(
          t,
          e,
          a
        );
        break;
      case 22:
        kt || Re(a, e), kt = (r = kt) || a.memoizedState !== null, Sn(
          t,
          e,
          a
        ), kt = r;
        break;
      default:
        Sn(
          t,
          e,
          a
        );
    }
  }
  function Ep(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        sr(t);
      } catch (a) {
        Ot(e, e.return, a);
      }
  }
  function fS(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new xp()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new xp()), e;
      default:
        throw Error(l(435, t.tag));
    }
  }
  function ec(t, e) {
    var a = fS(t);
    e.forEach(function(r) {
      var o = wS.bind(null, t, r);
      a.has(r) || (a.add(r), r.then(o, o));
    });
  }
  function Ue(t, e) {
    var a = e.deletions;
    if (a !== null)
      for (var r = 0; r < a.length; r++) {
        var o = a[r], c = t, v = e, x = v;
        t: for (; x !== null; ) {
          switch (x.tag) {
            case 27:
            case 5:
              Qt = x.stateNode, Ce = !1;
              break t;
            case 3:
              Qt = x.stateNode.containerInfo, Ce = !0;
              break t;
            case 4:
              Qt = x.stateNode.containerInfo, Ce = !0;
              break t;
          }
          x = x.return;
        }
        if (Qt === null) throw Error(l(160));
        wp(c, v, o), Qt = null, Ce = !1, c = o.alternate, c !== null && (c.return = null), o.return = null;
      }
    if (e.subtreeFlags & 13878)
      for (e = e.child; e !== null; )
        Rp(e, t), e = e.sibling;
  }
  var Ze = null;
  function Rp(t, e) {
    var a = t.alternate, r = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Ue(e, t), ke(t), r & 4 && ($n(3, t, t.return), Ps(3, t), $n(5, t, t.return));
        break;
      case 1:
        Ue(e, t), ke(t), r & 512 && (kt || a === null || Re(a, a.return)), r & 64 && xn && (t = t.updateQueue, t !== null && (r = t.callbacks, r !== null && (a = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = a === null ? r : a.concat(r))));
        break;
      case 26:
        var o = Ze;
        if (Ue(e, t), ke(t), r & 512 && (kt || a === null || Re(a, a.return)), r & 4) {
          var c = a !== null ? a.memoizedState : null;
          if (r = t.memoizedState, a === null)
            if (r === null)
              if (t.stateNode === null) {
                t: {
                  r = t.type, a = t.memoizedProps, o = o.ownerDocument || o;
                  e: switch (r) {
                    case "title":
                      c = o.getElementsByTagName("title")[0], (!c || c[hs] || c[le] || c.namespaceURI === "http://www.w3.org/2000/svg" || c.hasAttribute("itemprop")) && (c = o.createElement(r), o.head.insertBefore(
                        c,
                        o.querySelector("head > title")
                      )), se(c, r, a), c[le] = t, $t(c), r = c;
                      break t;
                    case "link":
                      var v = vg(
                        "link",
                        "href",
                        o
                      ).get(r + (a.href || ""));
                      if (v) {
                        for (var x = 0; x < v.length; x++)
                          if (c = v[x], c.getAttribute("href") === (a.href == null ? null : a.href) && c.getAttribute("rel") === (a.rel == null ? null : a.rel) && c.getAttribute("title") === (a.title == null ? null : a.title) && c.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            v.splice(x, 1);
                            break e;
                          }
                      }
                      c = o.createElement(r), se(c, r, a), o.head.appendChild(c);
                      break;
                    case "meta":
                      if (v = vg(
                        "meta",
                        "content",
                        o
                      ).get(r + (a.content || ""))) {
                        for (x = 0; x < v.length; x++)
                          if (c = v[x], c.getAttribute("content") === (a.content == null ? null : "" + a.content) && c.getAttribute("name") === (a.name == null ? null : a.name) && c.getAttribute("property") === (a.property == null ? null : a.property) && c.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && c.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            v.splice(x, 1);
                            break e;
                          }
                      }
                      c = o.createElement(r), se(c, r, a), o.head.appendChild(c);
                      break;
                    default:
                      throw Error(l(468, r));
                  }
                  c[le] = t, $t(c), r = c;
                }
                t.stateNode = r;
              } else
                yg(
                  o,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = gg(
                o,
                r,
                t.memoizedProps
              );
          else
            c !== r ? (c === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : c.count--, r === null ? yg(
              o,
              t.type,
              t.stateNode
            ) : gg(
              o,
              r,
              t.memoizedProps
            )) : r === null && t.stateNode !== null && yp(
              t,
              t.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        if (r & 4 && t.alternate === null) {
          o = t.stateNode, c = t.memoizedProps;
          try {
            for (var E = o.firstChild; E; ) {
              var N = E.nextSibling, H = E.nodeName;
              E[hs] || H === "HEAD" || H === "BODY" || H === "SCRIPT" || H === "STYLE" || H === "LINK" && E.rel.toLowerCase() === "stylesheet" || o.removeChild(E), E = N;
            }
            for (var X = t.type, B = o.attributes; B.length; )
              o.removeAttributeNode(B[0]);
            se(o, X, c), o[le] = t, o[pe] = c;
          } catch (it) {
            Ot(t, t.return, it);
          }
        }
      case 5:
        if (Ue(e, t), ke(t), r & 512 && (kt || a === null || Re(a, a.return)), t.flags & 32) {
          o = t.stateNode;
          try {
            ua(o, "");
          } catch (it) {
            Ot(t, t.return, it);
          }
        }
        r & 4 && t.stateNode != null && (o = t.memoizedProps, yp(
          t,
          o,
          a !== null ? a.memoizedProps : o
        )), r & 1024 && (tc = !0);
        break;
      case 6:
        if (Ue(e, t), ke(t), r & 4) {
          if (t.stateNode === null)
            throw Error(l(162));
          r = t.memoizedProps, a = t.stateNode;
          try {
            a.nodeValue = r;
          } catch (it) {
            Ot(t, t.return, it);
          }
        }
        break;
      case 3:
        if (Nl = null, o = Ze, Ze = Dl(e.containerInfo), Ue(e, t), Ze = o, ke(t), r & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            sr(e.containerInfo);
          } catch (it) {
            Ot(t, t.return, it);
          }
        tc && (tc = !1, Cp(t));
        break;
      case 4:
        r = Ze, Ze = Dl(
          t.stateNode.containerInfo
        ), Ue(e, t), ke(t), Ze = r;
        break;
      case 12:
        Ue(e, t), ke(t);
        break;
      case 13:
        Ue(e, t), ke(t), t.child.flags & 8192 && t.memoizedState !== null != (a !== null && a.memoizedState !== null) && (cc = Je()), r & 4 && (r = t.updateQueue, r !== null && (t.updateQueue = null, ec(t, r)));
        break;
      case 22:
        if (r & 512 && (kt || a === null || Re(a, a.return)), E = t.memoizedState !== null, N = a !== null && a.memoizedState !== null, H = xn, X = kt, xn = H || E, kt = X || N, Ue(e, t), kt = X, xn = H, ke(t), e = t.stateNode, e._current = t, e._visibility &= -3, e._visibility |= e._pendingVisibility & 2, r & 8192 && (e._visibility = E ? e._visibility & -2 : e._visibility | 1, E && (e = xn || kt, a === null || N || e || Ra(t)), t.memoizedProps === null || t.memoizedProps.mode !== "manual"))
          t: for (a = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26 || e.tag === 27) {
              if (a === null) {
                N = a = e;
                try {
                  if (o = N.stateNode, E)
                    c = o.style, typeof c.setProperty == "function" ? c.setProperty(
                      "display",
                      "none",
                      "important"
                    ) : c.display = "none";
                  else {
                    v = N.stateNode, x = N.memoizedProps.style;
                    var k = x != null && x.hasOwnProperty("display") ? x.display : null;
                    v.style.display = k == null || typeof k == "boolean" ? "" : ("" + k).trim();
                  }
                } catch (it) {
                  Ot(N, N.return, it);
                }
              }
            } else if (e.tag === 6) {
              if (a === null) {
                N = e;
                try {
                  N.stateNode.nodeValue = E ? "" : N.memoizedProps;
                } catch (it) {
                  Ot(N, N.return, it);
                }
              }
            } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              a === e && (a = null), e = e.return;
            }
            a === e && (a = null), e.sibling.return = e.return, e = e.sibling;
          }
        r & 4 && (r = t.updateQueue, r !== null && (a = r.retryQueue, a !== null && (r.retryQueue = null, ec(t, a))));
        break;
      case 19:
        Ue(e, t), ke(t), r & 4 && (r = t.updateQueue, r !== null && (t.updateQueue = null, ec(t, r)));
        break;
      case 21:
        break;
      default:
        Ue(e, t), ke(t);
    }
  }
  function ke(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        if (t.tag !== 27) {
          t: {
            for (var a = t.return; a !== null; ) {
              if (bp(a)) {
                var r = a;
                break t;
              }
              a = a.return;
            }
            throw Error(l(160));
          }
          switch (r.tag) {
            case 27:
              var o = r.stateNode, c = Ju(t);
              ml(t, c, o);
              break;
            case 5:
              var v = r.stateNode;
              r.flags & 32 && (ua(v, ""), r.flags &= -33);
              var x = Ju(t);
              ml(t, x, v);
              break;
            case 3:
            case 4:
              var E = r.stateNode.containerInfo, N = Ju(t);
              Iu(
                t,
                N,
                E
              );
              break;
            default:
              throw Error(l(161));
          }
        }
      } catch (H) {
        Ot(t, t.return, H);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Cp(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Cp(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function Tn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        Tp(t, e.alternate, e), e = e.sibling;
  }
  function Ra(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          $n(4, e, e.return), Ra(e);
          break;
        case 1:
          Re(e, e.return);
          var a = e.stateNode;
          typeof a.componentWillUnmount == "function" && gp(
            e,
            e.return,
            a
          ), Ra(e);
          break;
        case 26:
        case 27:
        case 5:
          Re(e, e.return), Ra(e);
          break;
        case 22:
          Re(e, e.return), e.memoizedState === null && Ra(e);
          break;
        default:
          Ra(e);
      }
      t = t.sibling;
    }
  }
  function Jn(t, e, a) {
    for (a = a && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var r = e.alternate, o = t, c = e, v = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Jn(
            o,
            c,
            a
          ), Ps(4, c);
          break;
        case 1:
          if (Jn(
            o,
            c,
            a
          ), r = c, o = r.stateNode, typeof o.componentDidMount == "function")
            try {
              o.componentDidMount();
            } catch (N) {
              Ot(r, r.return, N);
            }
          if (r = c, o = r.updateQueue, o !== null) {
            var x = r.stateNode;
            try {
              var E = o.shared.hiddenCallbacks;
              if (E !== null)
                for (o.shared.hiddenCallbacks = null, o = 0; o < E.length; o++)
                  hp(E[o], x);
            } catch (N) {
              Ot(r, r.return, N);
            }
          }
          a && v & 64 && pp(c), Li(c, c.return);
          break;
        case 26:
        case 27:
        case 5:
          Jn(
            o,
            c,
            a
          ), a && r === null && v & 4 && vp(c), Li(c, c.return);
          break;
        case 12:
          Jn(
            o,
            c,
            a
          );
          break;
        case 13:
          Jn(
            o,
            c,
            a
          ), a && v & 4 && Ep(o, c);
          break;
        case 22:
          c.memoizedState === null && Jn(
            o,
            c,
            a
          ), Li(c, c.return);
          break;
        default:
          Jn(
            o,
            c,
            a
          );
      }
      e = e.sibling;
    }
  }
  function nc(t, e) {
    var a = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== a && (t != null && t.refCount++, a != null && Ns(a));
  }
  function ic(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Ns(t));
  }
  function In(t, e, a, r) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Mp(
          t,
          e,
          a,
          r
        ), e = e.sibling;
  }
  function Mp(t, e, a, r) {
    var o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        In(
          t,
          e,
          a,
          r
        ), o & 2048 && Ps(9, e);
        break;
      case 3:
        In(
          t,
          e,
          a,
          r
        ), o & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Ns(t)));
        break;
      case 12:
        if (o & 2048) {
          In(
            t,
            e,
            a,
            r
          ), t = e.stateNode;
          try {
            var c = e.memoizedProps, v = c.id, x = c.onPostCommit;
            typeof x == "function" && x(
              v,
              e.alternate === null ? "mount" : "update",
              t.passiveEffectDuration,
              -0
            );
          } catch (E) {
            Ot(e, e.return, E);
          }
        } else
          In(
            t,
            e,
            a,
            r
          );
        break;
      case 23:
        break;
      case 22:
        c = e.stateNode, e.memoizedState !== null ? c._visibility & 4 ? In(
          t,
          e,
          a,
          r
        ) : qs(t, e) : c._visibility & 4 ? In(
          t,
          e,
          a,
          r
        ) : (c._visibility |= 4, Ca(
          t,
          e,
          a,
          r,
          (e.subtreeFlags & 10256) !== 0
        )), o & 2048 && nc(
          e.alternate,
          e
        );
        break;
      case 24:
        In(
          t,
          e,
          a,
          r
        ), o & 2048 && ic(e.alternate, e);
        break;
      default:
        In(
          t,
          e,
          a,
          r
        );
    }
  }
  function Ca(t, e, a, r, o) {
    for (o = o && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var c = t, v = e, x = a, E = r, N = v.flags;
      switch (v.tag) {
        case 0:
        case 11:
        case 15:
          Ca(
            c,
            v,
            x,
            E,
            o
          ), Ps(8, v);
          break;
        case 23:
          break;
        case 22:
          var H = v.stateNode;
          v.memoizedState !== null ? H._visibility & 4 ? Ca(
            c,
            v,
            x,
            E,
            o
          ) : qs(
            c,
            v
          ) : (H._visibility |= 4, Ca(
            c,
            v,
            x,
            E,
            o
          )), o && N & 2048 && nc(
            v.alternate,
            v
          );
          break;
        case 24:
          Ca(
            c,
            v,
            x,
            E,
            o
          ), o && N & 2048 && ic(v.alternate, v);
          break;
        default:
          Ca(
            c,
            v,
            x,
            E,
            o
          );
      }
      e = e.sibling;
    }
  }
  function qs(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var a = t, r = e, o = r.flags;
        switch (r.tag) {
          case 22:
            qs(a, r), o & 2048 && nc(
              r.alternate,
              r
            );
            break;
          case 24:
            qs(a, r), o & 2048 && ic(r.alternate, r);
            break;
          default:
            qs(a, r);
        }
        e = e.sibling;
      }
  }
  var Gs = 8192;
  function Ma(t) {
    if (t.subtreeFlags & Gs)
      for (t = t.child; t !== null; )
        Dp(t), t = t.sibling;
  }
  function Dp(t) {
    switch (t.tag) {
      case 26:
        Ma(t), t.flags & Gs && t.memoizedState !== null && IS(
          Ze,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        Ma(t);
        break;
      case 3:
      case 4:
        var e = Ze;
        Ze = Dl(t.stateNode.containerInfo), Ma(t), Ze = e;
        break;
      case 22:
        t.memoizedState === null && (e = t.alternate, e !== null && e.memoizedState !== null ? (e = Gs, Gs = 16777216, Ma(t), Gs = e) : Ma(t));
        break;
      default:
        Ma(t);
    }
  }
  function Op(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function Ys(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null)
        for (var a = 0; a < e.length; a++) {
          var r = e[a];
          It = r, jp(
            r,
            t
          );
        }
      Op(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Np(t), t = t.sibling;
  }
  function Np(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ys(t), t.flags & 2048 && $n(9, t, t.return);
        break;
      case 3:
        Ys(t);
        break;
      case 12:
        Ys(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 4 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -5, pl(t)) : Ys(t);
        break;
      default:
        Ys(t);
    }
  }
  function pl(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null)
        for (var a = 0; a < e.length; a++) {
          var r = e[a];
          It = r, jp(
            r,
            t
          );
        }
      Op(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          $n(8, e, e.return), pl(e);
          break;
        case 22:
          a = e.stateNode, a._visibility & 4 && (a._visibility &= -5, pl(e));
          break;
        default:
          pl(e);
      }
      t = t.sibling;
    }
  }
  function jp(t, e) {
    for (; It !== null; ) {
      var a = It;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          $n(8, a, e);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var r = a.memoizedState.cachePool.pool;
            r != null && r.refCount++;
          }
          break;
        case 24:
          Ns(a.memoizedState.cache);
      }
      if (r = a.child, r !== null) r.return = a, It = r;
      else
        t: for (a = t; It !== null; ) {
          r = It;
          var o = r.sibling, c = r.return;
          if (Ap(r), r === a) {
            It = null;
            break t;
          }
          if (o !== null) {
            o.return = c, It = o;
            break t;
          }
          It = c;
        }
    }
  }
  function dS(t, e, a, r) {
    this.tag = t, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function He(t, e, a, r) {
    return new dS(t, e, a, r);
  }
  function ac(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function ti(t, e) {
    var a = t.alternate;
    return a === null ? (a = He(
      t.tag,
      e,
      t.key,
      t.mode
    ), a.elementType = t.elementType, a.type = t.type, a.stateNode = t.stateNode, a.alternate = t, t.alternate = a) : (a.pendingProps = e, a.type = t.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = t.flags & 31457280, a.childLanes = t.childLanes, a.lanes = t.lanes, a.child = t.child, a.memoizedProps = t.memoizedProps, a.memoizedState = t.memoizedState, a.updateQueue = t.updateQueue, e = t.dependencies, a.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, a.sibling = t.sibling, a.index = t.index, a.ref = t.ref, a.refCleanup = t.refCleanup, a;
  }
  function _p(t, e) {
    t.flags &= 31457282;
    var a = t.alternate;
    return a === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = a.childLanes, t.lanes = a.lanes, t.child = a.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = a.memoizedProps, t.memoizedState = a.memoizedState, t.updateQueue = a.updateQueue, t.type = a.type, e = a.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function gl(t, e, a, r, o, c) {
    var v = 0;
    if (r = t, typeof t == "function") ac(t) && (v = 1);
    else if (typeof t == "string")
      v = $S(
        t,
        a,
        Te.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case m:
          return Bi(a.children, o, c, e);
        case p:
          v = 8, o |= 24;
          break;
        case g:
          return t = He(12, a, e, o | 2), t.elementType = g, t.lanes = c, t;
        case w:
          return t = He(13, a, e, o), t.elementType = w, t.lanes = c, t;
        case M:
          return t = He(19, a, e, o), t.elementType = M, t.lanes = c, t;
        case U:
          return zp(a, o, c, e);
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case y:
              case T:
                v = 10;
                break t;
              case b:
                v = 9;
                break t;
              case R:
                v = 11;
                break t;
              case O:
                v = 14;
                break t;
              case z:
                v = 16, r = null;
                break t;
            }
          v = 29, a = Error(
            l(130, t === null ? "null" : typeof t, "")
          ), r = null;
      }
    return e = He(v, a, e, o), e.elementType = t, e.type = r, e.lanes = c, e;
  }
  function Bi(t, e, a, r) {
    return t = He(7, t, r, e), t.lanes = a, t;
  }
  function zp(t, e, a, r) {
    t = He(22, t, r, e), t.elementType = U, t.lanes = a;
    var o = {
      _visibility: 1,
      _pendingVisibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null,
      _current: null,
      detach: function() {
        var c = o._current;
        if (c === null) throw Error(l(456));
        if (!(o._pendingVisibility & 2)) {
          var v = qn(c, 2);
          v !== null && (o._pendingVisibility |= 2, de(v, c, 2));
        }
      },
      attach: function() {
        var c = o._current;
        if (c === null) throw Error(l(456));
        if (o._pendingVisibility & 2) {
          var v = qn(c, 2);
          v !== null && (o._pendingVisibility &= -3, de(v, c, 2));
        }
      }
    };
    return t.stateNode = o, t;
  }
  function sc(t, e, a) {
    return t = He(6, t, null, e), t.lanes = a, t;
  }
  function rc(t, e, a) {
    return e = He(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = a, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  function An(t) {
    t.flags |= 4;
  }
  function Vp(t, e) {
    if (e.type !== "stylesheet" || e.state.loading & 4)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !bg(e)) {
      if (e = Be.current, e !== null && ((Tt & 4194176) === Tt ? tn !== null : (Tt & 62914560) !== Tt && !(Tt & 536870912) || e !== tn))
        throw Ms = fu, Jh;
      t.flags |= 8192;
    }
  }
  function vl(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Id() : 536870912, t.lanes |= e, Oa |= e);
  }
  function Xs(t, e) {
    if (!wt)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var a = null; e !== null; )
            e.alternate !== null && (a = e), e = e.sibling;
          a === null ? t.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = t.tail;
          for (var r = null; a !== null; )
            a.alternate !== null && (r = a), a = a.sibling;
          r === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : r.sibling = null;
      }
  }
  function Lt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, a = 0, r = 0;
    if (e)
      for (var o = t.child; o !== null; )
        a |= o.lanes | o.childLanes, r |= o.subtreeFlags & 31457280, r |= o.flags & 31457280, o.return = t, o = o.sibling;
    else
      for (o = t.child; o !== null; )
        a |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, o.return = t, o = o.sibling;
    return t.subtreeFlags |= r, t.childLanes = a, e;
  }
  function hS(t, e, a) {
    var r = e.pendingProps;
    switch (uu(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Lt(e), null;
      case 1:
        return Lt(e), null;
      case 3:
        return a = e.stateNode, r = null, t !== null && (r = t.memoizedState.cache), e.memoizedState.cache !== r && (e.flags |= 2048), bn(Wt), Bn(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (t === null || t.child === null) && (ws(e) ? An(e) : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, Ke !== null && (mc(Ke), Ke = null))), Lt(e), null;
      case 26:
        return a = e.memoizedState, t === null ? (An(e), a !== null ? (Lt(e), Vp(e, a)) : (Lt(e), e.flags &= -16777217)) : a ? a !== t.memoizedState ? (An(e), Lt(e), Vp(e, a)) : (Lt(e), e.flags &= -16777217) : (t.memoizedProps !== r && An(e), Lt(e), e.flags &= -16777217), null;
      case 27:
        ia(e), a = me.current;
        var o = e.type;
        if (t !== null && e.stateNode != null)
          t.memoizedProps !== r && An(e);
        else {
          if (!r) {
            if (e.stateNode === null)
              throw Error(l(166));
            return Lt(e), null;
          }
          t = Te.current, ws(e) ? Wh(e) : (t = fg(o, r, a), e.stateNode = t, An(e));
        }
        return Lt(e), null;
      case 5:
        if (ia(e), a = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== r && An(e);
        else {
          if (!r) {
            if (e.stateNode === null)
              throw Error(l(166));
            return Lt(e), null;
          }
          if (t = Te.current, ws(e))
            Wh(e);
          else {
            switch (o = Ml(
              me.current
            ), t) {
              case 1:
                t = o.createElementNS(
                  "http://www.w3.org/2000/svg",
                  a
                );
                break;
              case 2:
                t = o.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  a
                );
                break;
              default:
                switch (a) {
                  case "svg":
                    t = o.createElementNS(
                      "http://www.w3.org/2000/svg",
                      a
                    );
                    break;
                  case "math":
                    t = o.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      a
                    );
                    break;
                  case "script":
                    t = o.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild);
                    break;
                  case "select":
                    t = typeof r.is == "string" ? o.createElement("select", { is: r.is }) : o.createElement("select"), r.multiple ? t.multiple = !0 : r.size && (t.size = r.size);
                    break;
                  default:
                    t = typeof r.is == "string" ? o.createElement(a, { is: r.is }) : o.createElement(a);
                }
            }
            t[le] = e, t[pe] = r;
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
            t: switch (se(t, a, r), a) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                t = !!r.autoFocus;
                break t;
              case "img":
                t = !0;
                break t;
              default:
                t = !1;
            }
            t && An(e);
          }
        }
        return Lt(e), e.flags &= -16777217, null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== r && An(e);
        else {
          if (typeof r != "string" && e.stateNode === null)
            throw Error(l(166));
          if (t = me.current, ws(e)) {
            if (t = e.stateNode, a = e.memoizedProps, r = null, o = fe, o !== null)
              switch (o.tag) {
                case 27:
                case 5:
                  r = o.memoizedProps;
              }
            t[le] = e, t = !!(t.nodeValue === a || r !== null && r.suppressHydrationWarning === !0 || sg(t.nodeValue, a)), t || Ci(e);
          } else
            t = Ml(t).createTextNode(
              r
            ), t[le] = e, e.stateNode = t;
        }
        return Lt(e), null;
      case 13:
        if (r = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (o = ws(e), r !== null && r.dehydrated !== null) {
            if (t === null) {
              if (!o) throw Error(l(318));
              if (o = e.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(l(317));
              o[le] = e;
            } else
              Es(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
            Lt(e), o = !1;
          } else
            Ke !== null && (mc(Ke), Ke = null), o = !0;
          if (!o)
            return e.flags & 256 ? (pn(e), e) : (pn(e), null);
        }
        if (pn(e), e.flags & 128)
          return e.lanes = a, e;
        if (a = r !== null, t = t !== null && t.memoizedState !== null, a) {
          r = e.child, o = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (o = r.alternate.memoizedState.cachePool.pool);
          var c = null;
          r.memoizedState !== null && r.memoizedState.cachePool !== null && (c = r.memoizedState.cachePool.pool), c !== o && (r.flags |= 2048);
        }
        return a !== t && a && (e.child.flags |= 8192), vl(e, e.updateQueue), Lt(e), null;
      case 4:
        return Bn(), t === null && Ec(e.stateNode.containerInfo), Lt(e), null;
      case 10:
        return bn(e.type), Lt(e), null;
      case 19:
        if (Vt(Ft), o = e.memoizedState, o === null) return Lt(e), null;
        if (r = (e.flags & 128) !== 0, c = o.rendering, c === null)
          if (r) Xs(o, !1);
          else {
            if (Ht !== 0 || t !== null && t.flags & 128)
              for (t = e.child; t !== null; ) {
                if (c = tl(t), c !== null) {
                  for (e.flags |= 128, Xs(o, !1), t = c.updateQueue, e.updateQueue = t, vl(e, t), e.subtreeFlags = 0, t = a, a = e.child; a !== null; )
                    _p(a, t), a = a.sibling;
                  return Dt(
                    Ft,
                    Ft.current & 1 | 2
                  ), e.child;
                }
                t = t.sibling;
              }
            o.tail !== null && Je() > yl && (e.flags |= 128, r = !0, Xs(o, !1), e.lanes = 4194304);
          }
        else {
          if (!r)
            if (t = tl(c), t !== null) {
              if (e.flags |= 128, r = !0, t = t.updateQueue, e.updateQueue = t, vl(e, t), Xs(o, !0), o.tail === null && o.tailMode === "hidden" && !c.alternate && !wt)
                return Lt(e), null;
            } else
              2 * Je() - o.renderingStartTime > yl && a !== 536870912 && (e.flags |= 128, r = !0, Xs(o, !1), e.lanes = 4194304);
          o.isBackwards ? (c.sibling = e.child, e.child = c) : (t = o.last, t !== null ? t.sibling = c : e.child = c, o.last = c);
        }
        return o.tail !== null ? (e = o.tail, o.rendering = e, o.tail = e.sibling, o.renderingStartTime = Je(), e.sibling = null, t = Ft.current, Dt(Ft, r ? t & 1 | 2 : t & 1), e) : (Lt(e), null);
      case 22:
      case 23:
        return pn(e), hu(), r = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== r && (e.flags |= 8192) : r && (e.flags |= 8192), r ? a & 536870912 && !(e.flags & 128) && (Lt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Lt(e), a = e.updateQueue, a !== null && vl(e, a.retryQueue), a = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), r = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (r = e.memoizedState.cachePool.pool), r !== a && (e.flags |= 2048), t !== null && Vt(Di), null;
      case 24:
        return a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), bn(Wt), Lt(e), null;
      case 25:
        return null;
    }
    throw Error(l(156, e.tag));
  }
  function mS(t, e) {
    switch (uu(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return bn(Wt), Bn(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return ia(e), null;
      case 13:
        if (pn(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(l(340));
          Es();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return Vt(Ft), null;
      case 4:
        return Bn(), null;
      case 10:
        return bn(e.type), null;
      case 22:
      case 23:
        return pn(e), hu(), t !== null && Vt(Di), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return bn(Wt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Lp(t, e) {
    switch (uu(e), e.tag) {
      case 3:
        bn(Wt), Bn();
        break;
      case 26:
      case 27:
      case 5:
        ia(e);
        break;
      case 4:
        Bn();
        break;
      case 13:
        pn(e);
        break;
      case 19:
        Vt(Ft);
        break;
      case 10:
        bn(e.type);
        break;
      case 22:
      case 23:
        pn(e), hu(), t !== null && Vt(Di);
        break;
      case 24:
        bn(Wt);
    }
  }
  var pS = {
    getCacheForType: function(t) {
      var e = oe(Wt), a = e.data.get(t);
      return a === void 0 && (a = t(), e.data.set(t, a)), a;
    }
  }, gS = typeof WeakMap == "function" ? WeakMap : Map, Bt = 0, jt = null, bt = null, Tt = 0, _t = 0, Me = null, wn = !1, Da = !1, lc = !1, En = 0, Ht = 0, ei = 0, Ui = 0, oc = 0, Pe = 0, Oa = 0, Ks = null, nn = null, uc = !1, cc = 0, yl = 1 / 0, bl = null, ni = null, xl = !1, ki = null, Zs = 0, fc = 0, dc = null, Qs = 0, hc = null;
  function De() {
    if (Bt & 2 && Tt !== 0)
      return Tt & -Tt;
    if (Q.T !== null) {
      var t = Sa;
      return t !== 0 ? t : Sc();
    }
    return ih();
  }
  function Bp() {
    Pe === 0 && (Pe = !(Tt & 536870912) || wt ? Jd() : 536870912);
    var t = Be.current;
    return t !== null && (t.flags |= 32), Pe;
  }
  function de(t, e, a) {
    (t === jt && _t === 2 || t.cancelPendingCommit !== null) && (Na(t, 0), Rn(
      t,
      Tt,
      Pe,
      !1
    )), ds(t, a), (!(Bt & 2) || t !== jt) && (t === jt && (!(Bt & 2) && (Ui |= a), Ht === 4 && Rn(
      t,
      Tt,
      Pe,
      !1
    )), an(t));
  }
  function Up(t, e, a) {
    if (Bt & 6) throw Error(l(327));
    var r = !a && (e & 60) === 0 && (e & t.expiredLanes) === 0 || fs(t, e), o = r ? bS(t, e) : vc(t, e, !0), c = r;
    do {
      if (o === 0) {
        Da && !r && Rn(t, e, 0, !1);
        break;
      } else if (o === 6)
        Rn(
          t,
          e,
          0,
          !wn
        );
      else {
        if (a = t.current.alternate, c && !vS(a)) {
          o = vc(t, e, !1), c = !1;
          continue;
        }
        if (o === 2) {
          if (c = e, t.errorRecoveryDisabledLanes & c)
            var v = 0;
          else
            v = t.pendingLanes & -536870913, v = v !== 0 ? v : v & 536870912 ? 536870912 : 0;
          if (v !== 0) {
            e = v;
            t: {
              var x = t;
              o = Ks;
              var E = x.current.memoizedState.isDehydrated;
              if (E && (Na(x, v).flags |= 256), v = vc(
                x,
                v,
                !1
              ), v !== 2) {
                if (lc && !E) {
                  x.errorRecoveryDisabledLanes |= c, Ui |= c, o = 4;
                  break t;
                }
                c = nn, nn = o, c !== null && mc(c);
              }
              o = v;
            }
            if (c = !1, o !== 2) continue;
          }
        }
        if (o === 1) {
          Na(t, 0), Rn(t, e, 0, !0);
          break;
        }
        t: {
          switch (r = t, o) {
            case 0:
            case 1:
              throw Error(l(345));
            case 4:
              if ((e & 4194176) === e) {
                Rn(
                  r,
                  e,
                  Pe,
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
              throw Error(l(329));
          }
          if (r.finishedWork = a, r.finishedLanes = e, (e & 62914560) === e && (c = cc + 300 - Je(), 10 < c)) {
            if (Rn(
              r,
              e,
              Pe,
              !wn
            ), _r(r, 0) !== 0) break t;
            r.timeoutHandle = og(
              kp.bind(
                null,
                r,
                a,
                nn,
                bl,
                uc,
                e,
                Pe,
                Ui,
                Oa,
                wn,
                2,
                -0,
                0
              ),
              c
            );
            break t;
          }
          kp(
            r,
            a,
            nn,
            bl,
            uc,
            e,
            Pe,
            Ui,
            Oa,
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
  function mc(t) {
    nn === null ? nn = t : nn.push.apply(
      nn,
      t
    );
  }
  function kp(t, e, a, r, o, c, v, x, E, N, H, X, B) {
    var k = e.subtreeFlags;
    if ((k & 8192 || (k & 16785408) === 16785408) && (tr = { stylesheets: null, count: 0, unsuspend: JS }, Dp(e), e = tT(), e !== null)) {
      t.cancelPendingCommit = e(
        Kp.bind(
          null,
          t,
          a,
          r,
          o,
          v,
          x,
          E,
          1,
          X,
          B
        )
      ), Rn(t, c, v, !N);
      return;
    }
    Kp(
      t,
      a,
      r,
      o,
      v,
      x,
      E,
      H,
      X,
      B
    );
  }
  function vS(t) {
    for (var e = t; ; ) {
      var a = e.tag;
      if ((a === 0 || a === 11 || a === 15) && e.flags & 16384 && (a = e.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var r = 0; r < a.length; r++) {
          var o = a[r], c = o.getSnapshot;
          o = o.value;
          try {
            if (!Ee(c(), o)) return !1;
          } catch {
            return !1;
          }
        }
      if (a = e.child, e.subtreeFlags & 16384 && a !== null)
        a.return = e, e = a;
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
  function Rn(t, e, a, r) {
    e &= ~oc, e &= ~Ui, t.suspendedLanes |= e, t.pingedLanes &= ~e, r && (t.warmLanes |= e), r = t.expirationTimes;
    for (var o = e; 0 < o; ) {
      var c = 31 - we(o), v = 1 << c;
      r[c] = -1, o &= ~v;
    }
    a !== 0 && th(t, a, e);
  }
  function Sl() {
    return Bt & 6 ? !0 : (Fs(0), !1);
  }
  function pc() {
    if (bt !== null) {
      if (_t === 0)
        var t = bt.return;
      else
        t = bt, yn = zi = null, Su(t), ba = null, Ds = 0, t = bt;
      for (; t !== null; )
        Lp(t.alternate, t), t = t.return;
      bt = null;
    }
  }
  function Na(t, e) {
    t.finishedWork = null, t.finishedLanes = 0;
    var a = t.timeoutHandle;
    a !== -1 && (t.timeoutHandle = -1, LS(a)), a = t.cancelPendingCommit, a !== null && (t.cancelPendingCommit = null, a()), pc(), jt = t, bt = a = ti(t.current, null), Tt = e, _t = 0, Me = null, wn = !1, Da = fs(t, e), lc = !1, Oa = Pe = oc = Ui = ei = Ht = 0, nn = Ks = null, uc = !1, e & 8 && (e |= e & 32);
    var r = t.entangledLanes;
    if (r !== 0)
      for (t = t.entanglements, r &= e; 0 < r; ) {
        var o = 31 - we(r), c = 1 << o;
        e |= t[o], r &= ~c;
      }
    return En = e, Xr(), a;
  }
  function Hp(t, e) {
    gt = null, Q.H = en, e === Cs ? (e = em(), _t = 3) : e === Jh ? (e = em(), _t = 4) : _t = e === Im ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Me = e, bt === null && (Ht = 1, fl(
      t,
      ze(e, t.current)
    ));
  }
  function Pp() {
    var t = Q.H;
    return Q.H = en, t === null ? en : t;
  }
  function qp() {
    var t = Q.A;
    return Q.A = pS, t;
  }
  function gc() {
    Ht = 4, wn || (Tt & 4194176) !== Tt && Be.current !== null || (Da = !0), !(ei & 134217727) && !(Ui & 134217727) || jt === null || Rn(
      jt,
      Tt,
      Pe,
      !1
    );
  }
  function vc(t, e, a) {
    var r = Bt;
    Bt |= 2;
    var o = Pp(), c = qp();
    (jt !== t || Tt !== e) && (bl = null, Na(t, e)), e = !1;
    var v = Ht;
    t: do
      try {
        if (_t !== 0 && bt !== null) {
          var x = bt, E = Me;
          switch (_t) {
            case 8:
              pc(), v = 6;
              break t;
            case 3:
            case 2:
            case 6:
              Be.current === null && (e = !0);
              var N = _t;
              if (_t = 0, Me = null, ja(t, x, E, N), a && Da) {
                v = 0;
                break t;
              }
              break;
            default:
              N = _t, _t = 0, Me = null, ja(t, x, E, N);
          }
        }
        yS(), v = Ht;
        break;
      } catch (H) {
        Hp(t, H);
      }
    while (!0);
    return e && t.shellSuspendCounter++, yn = zi = null, Bt = r, Q.H = o, Q.A = c, bt === null && (jt = null, Tt = 0, Xr()), v;
  }
  function yS() {
    for (; bt !== null; ) Gp(bt);
  }
  function bS(t, e) {
    var a = Bt;
    Bt |= 2;
    var r = Pp(), o = qp();
    jt !== t || Tt !== e ? (bl = null, yl = Je() + 500, Na(t, e)) : Da = fs(
      t,
      e
    );
    t: do
      try {
        if (_t !== 0 && bt !== null) {
          e = bt;
          var c = Me;
          e: switch (_t) {
            case 1:
              _t = 0, Me = null, ja(t, e, c, 1);
              break;
            case 2:
              if (Ih(c)) {
                _t = 0, Me = null, Yp(e);
                break;
              }
              e = function() {
                _t === 2 && jt === t && (_t = 7), an(t);
              }, c.then(e, e);
              break t;
            case 3:
              _t = 7;
              break t;
            case 4:
              _t = 5;
              break t;
            case 7:
              Ih(c) ? (_t = 0, Me = null, Yp(e)) : (_t = 0, Me = null, ja(t, e, c, 7));
              break;
            case 5:
              var v = null;
              switch (bt.tag) {
                case 26:
                  v = bt.memoizedState;
                case 5:
                case 27:
                  var x = bt;
                  if (!v || bg(v)) {
                    _t = 0, Me = null;
                    var E = x.sibling;
                    if (E !== null) bt = E;
                    else {
                      var N = x.return;
                      N !== null ? (bt = N, Tl(N)) : bt = null;
                    }
                    break e;
                  }
              }
              _t = 0, Me = null, ja(t, e, c, 5);
              break;
            case 6:
              _t = 0, Me = null, ja(t, e, c, 6);
              break;
            case 8:
              pc(), Ht = 6;
              break t;
            default:
              throw Error(l(462));
          }
        }
        xS();
        break;
      } catch (H) {
        Hp(t, H);
      }
    while (!0);
    return yn = zi = null, Q.H = r, Q.A = o, Bt = a, bt !== null ? 0 : (jt = null, Tt = 0, Xr(), Ht);
  }
  function xS() {
    for (; bt !== null && !q1(); )
      Gp(bt);
  }
  function Gp(t) {
    var e = fp(t.alternate, t, En);
    t.memoizedProps = t.pendingProps, e === null ? Tl(t) : bt = e;
  }
  function Yp(t) {
    var e = t, a = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = sp(
          a,
          e,
          e.pendingProps,
          e.type,
          void 0,
          Tt
        );
        break;
      case 11:
        e = sp(
          a,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          Tt
        );
        break;
      case 5:
        Su(e);
      default:
        Lp(a, e), e = bt = _p(e, En), e = fp(a, e, En);
    }
    t.memoizedProps = t.pendingProps, e === null ? Tl(t) : bt = e;
  }
  function ja(t, e, a, r) {
    yn = zi = null, Su(e), ba = null, Ds = 0;
    var o = e.return;
    try {
      if (oS(
        t,
        o,
        e,
        a,
        Tt
      )) {
        Ht = 1, fl(
          t,
          ze(a, t.current)
        ), bt = null;
        return;
      }
    } catch (c) {
      if (o !== null) throw bt = o, c;
      Ht = 1, fl(
        t,
        ze(a, t.current)
      ), bt = null;
      return;
    }
    e.flags & 32768 ? (wt || r === 1 ? t = !0 : Da || Tt & 536870912 ? t = !1 : (wn = t = !0, (r === 2 || r === 3 || r === 6) && (r = Be.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Xp(e, t)) : Tl(e);
  }
  function Tl(t) {
    var e = t;
    do {
      if (e.flags & 32768) {
        Xp(
          e,
          wn
        );
        return;
      }
      t = e.return;
      var a = hS(
        e.alternate,
        e,
        En
      );
      if (a !== null) {
        bt = a;
        return;
      }
      if (e = e.sibling, e !== null) {
        bt = e;
        return;
      }
      bt = e = t;
    } while (e !== null);
    Ht === 0 && (Ht = 5);
  }
  function Xp(t, e) {
    do {
      var a = mS(t.alternate, t);
      if (a !== null) {
        a.flags &= 32767, bt = a;
        return;
      }
      if (a = t.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !e && (t = t.sibling, t !== null)) {
        bt = t;
        return;
      }
      bt = t = a;
    } while (t !== null);
    Ht = 6, bt = null;
  }
  function Kp(t, e, a, r, o, c, v, x, E, N) {
    var H = Q.T, X = J.p;
    try {
      J.p = 2, Q.T = null, SS(
        t,
        e,
        a,
        r,
        X,
        o,
        c,
        v,
        x,
        E,
        N
      );
    } finally {
      Q.T = H, J.p = X;
    }
  }
  function SS(t, e, a, r, o, c, v, x) {
    do
      _a();
    while (ki !== null);
    if (Bt & 6) throw Error(l(327));
    var E = t.finishedWork;
    if (r = t.finishedLanes, E === null) return null;
    if (t.finishedWork = null, t.finishedLanes = 0, E === t.current) throw Error(l(177));
    t.callbackNode = null, t.callbackPriority = 0, t.cancelPendingCommit = null;
    var N = E.lanes | E.childLanes;
    if (N |= ru, I1(
      t,
      r,
      N,
      c,
      v,
      x
    ), t === jt && (bt = jt = null, Tt = 0), !(E.subtreeFlags & 10256) && !(E.flags & 10256) || xl || (xl = !0, fc = N, dc = a, ES(Or, function() {
      return _a(), null;
    })), a = (E.flags & 15990) !== 0, E.subtreeFlags & 15990 || a ? (a = Q.T, Q.T = null, c = J.p, J.p = 2, v = Bt, Bt |= 4, cS(t, E), Rp(E, t), Xx(Dc, t.containerInfo), zl = !!Mc, Dc = Mc = null, t.current = E, Tp(t, E.alternate, E), G1(), Bt = v, J.p = c, Q.T = a) : t.current = E, xl ? (xl = !1, ki = t, Zs = r) : Zp(t, N), N = t.pendingLanes, N === 0 && (ni = null), Q1(E.stateNode), an(t), e !== null)
      for (o = t.onRecoverableError, E = 0; E < e.length; E++)
        N = e[E], o(N.value, {
          componentStack: N.stack
        });
    return Zs & 3 && _a(), N = t.pendingLanes, r & 4194218 && N & 42 ? t === hc ? Qs++ : (Qs = 0, hc = t) : Qs = 0, Fs(0), null;
  }
  function Zp(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Ns(e)));
  }
  function _a() {
    if (ki !== null) {
      var t = ki, e = fc;
      fc = 0;
      var a = nh(Zs), r = Q.T, o = J.p;
      try {
        if (J.p = 32 > a ? 32 : a, Q.T = null, ki === null)
          var c = !1;
        else {
          a = dc, dc = null;
          var v = ki, x = Zs;
          if (ki = null, Zs = 0, Bt & 6)
            throw Error(l(331));
          var E = Bt;
          if (Bt |= 4, Np(v.current), Mp(v, v.current, x, a), Bt = E, Fs(0, !1), Ae && typeof Ae.onPostCommitFiberRoot == "function")
            try {
              Ae.onPostCommitFiberRoot(cs, v);
            } catch {
            }
          c = !0;
        }
        return c;
      } finally {
        J.p = o, Q.T = r, Zp(t, e);
      }
    }
    return !1;
  }
  function Qp(t, e, a) {
    e = ze(a, e), e = Vu(t.stateNode, e, 2), t = Wn(t, e, 2), t !== null && (ds(t, 2), an(t));
  }
  function Ot(t, e, a) {
    if (t.tag === 3)
      Qp(t, t, a);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Qp(
            e,
            t,
            a
          );
          break;
        } else if (e.tag === 1) {
          var r = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (ni === null || !ni.has(r))) {
            t = ze(a, t), a = $m(2), r = Wn(e, a, 2), r !== null && (Jm(
              a,
              r,
              e,
              t
            ), ds(r, 2), an(r));
            break;
          }
        }
        e = e.return;
      }
  }
  function yc(t, e, a) {
    var r = t.pingCache;
    if (r === null) {
      r = t.pingCache = new gS();
      var o = /* @__PURE__ */ new Set();
      r.set(e, o);
    } else
      o = r.get(e), o === void 0 && (o = /* @__PURE__ */ new Set(), r.set(e, o));
    o.has(a) || (lc = !0, o.add(a), t = TS.bind(null, t, e, a), e.then(t, t));
  }
  function TS(t, e, a) {
    var r = t.pingCache;
    r !== null && r.delete(e), t.pingedLanes |= t.suspendedLanes & a, t.warmLanes &= ~a, jt === t && (Tt & a) === a && (Ht === 4 || Ht === 3 && (Tt & 62914560) === Tt && 300 > Je() - cc ? !(Bt & 2) && Na(t, 0) : oc |= a, Oa === Tt && (Oa = 0)), an(t);
  }
  function Fp(t, e) {
    e === 0 && (e = Id()), t = qn(t, e), t !== null && (ds(t, e), an(t));
  }
  function AS(t) {
    var e = t.memoizedState, a = 0;
    e !== null && (a = e.retryLane), Fp(t, a);
  }
  function wS(t, e) {
    var a = 0;
    switch (t.tag) {
      case 13:
        var r = t.stateNode, o = t.memoizedState;
        o !== null && (a = o.retryLane);
        break;
      case 19:
        r = t.stateNode;
        break;
      case 22:
        r = t.stateNode._retryCache;
        break;
      default:
        throw Error(l(314));
    }
    r !== null && r.delete(e), Fp(t, a);
  }
  function ES(t, e) {
    return Lo(t, e);
  }
  var Al = null, za = null, bc = !1, wl = !1, xc = !1, Hi = 0;
  function an(t) {
    t !== za && t.next === null && (za === null ? Al = za = t : za = za.next = t), wl = !0, bc || (bc = !0, CS(RS));
  }
  function Fs(t, e) {
    if (!xc && wl) {
      xc = !0;
      do
        for (var a = !1, r = Al; r !== null; ) {
          if (t !== 0) {
            var o = r.pendingLanes;
            if (o === 0) var c = 0;
            else {
              var v = r.suspendedLanes, x = r.pingedLanes;
              c = (1 << 31 - we(42 | t) + 1) - 1, c &= o & ~(v & ~x), c = c & 201326677 ? c & 201326677 | 1 : c ? c | 2 : 0;
            }
            c !== 0 && (a = !0, Jp(r, c));
          } else
            c = Tt, c = _r(
              r,
              r === jt ? c : 0
            ), !(c & 3) || fs(r, c) || (a = !0, Jp(r, c));
          r = r.next;
        }
      while (a);
      xc = !1;
    }
  }
  function RS() {
    wl = bc = !1;
    var t = 0;
    Hi !== 0 && (VS() && (t = Hi), Hi = 0);
    for (var e = Je(), a = null, r = Al; r !== null; ) {
      var o = r.next, c = Wp(r, e);
      c === 0 ? (r.next = null, a === null ? Al = o : a.next = o, o === null && (za = a)) : (a = r, (t !== 0 || c & 3) && (wl = !0)), r = o;
    }
    Fs(t);
  }
  function Wp(t, e) {
    for (var a = t.suspendedLanes, r = t.pingedLanes, o = t.expirationTimes, c = t.pendingLanes & -62914561; 0 < c; ) {
      var v = 31 - we(c), x = 1 << v, E = o[v];
      E === -1 ? (!(x & a) || x & r) && (o[v] = J1(x, e)) : E <= e && (t.expiredLanes |= x), c &= ~x;
    }
    if (e = jt, a = Tt, a = _r(
      t,
      t === e ? a : 0
    ), r = t.callbackNode, a === 0 || t === e && _t === 2 || t.cancelPendingCommit !== null)
      return r !== null && r !== null && Bo(r), t.callbackNode = null, t.callbackPriority = 0;
    if (!(a & 3) || fs(t, a)) {
      if (e = a & -a, e === t.callbackPriority) return e;
      switch (r !== null && Bo(r), nh(a)) {
        case 2:
        case 8:
          a = Wd;
          break;
        case 32:
          a = Or;
          break;
        case 268435456:
          a = $d;
          break;
        default:
          a = Or;
      }
      return r = $p.bind(null, t), a = Lo(a, r), t.callbackPriority = e, t.callbackNode = a, e;
    }
    return r !== null && r !== null && Bo(r), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function $p(t, e) {
    var a = t.callbackNode;
    if (_a() && t.callbackNode !== a)
      return null;
    var r = Tt;
    return r = _r(
      t,
      t === jt ? r : 0
    ), r === 0 ? null : (Up(t, r, e), Wp(t, Je()), t.callbackNode != null && t.callbackNode === a ? $p.bind(null, t) : null);
  }
  function Jp(t, e) {
    if (_a()) return null;
    Up(t, e, !0);
  }
  function CS(t) {
    BS(function() {
      Bt & 6 ? Lo(Fd, t) : t();
    });
  }
  function Sc() {
    return Hi === 0 && (Hi = Jd()), Hi;
  }
  function Ip(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Ur("" + t);
  }
  function tg(t, e) {
    var a = e.ownerDocument.createElement("input");
    return a.name = e.name, a.value = e.value, t.id && a.setAttribute("form", t.id), e.parentNode.insertBefore(a, e), t = new FormData(t), a.parentNode.removeChild(a), t;
  }
  function MS(t, e, a, r, o) {
    if (e === "submit" && a && a.stateNode === o) {
      var c = Ip(
        (o[pe] || null).action
      ), v = r.submitter;
      v && (e = (e = v[pe] || null) ? Ip(e.formAction) : v.getAttribute("formAction"), e !== null && (c = e, v = null));
      var x = new qr(
        "action",
        "action",
        null,
        r,
        o
      );
      t.push({
        event: x,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (r.defaultPrevented) {
                if (Hi !== 0) {
                  var E = v ? tg(o, v) : new FormData(o);
                  Ou(
                    a,
                    {
                      pending: !0,
                      data: E,
                      method: o.method,
                      action: c
                    },
                    null,
                    E
                  );
                }
              } else
                typeof c == "function" && (x.preventDefault(), E = v ? tg(o, v) : new FormData(o), Ou(
                  a,
                  {
                    pending: !0,
                    data: E,
                    method: o.method,
                    action: c
                  },
                  c,
                  E
                ));
            },
            currentTarget: o
          }
        ]
      });
    }
  }
  for (var Tc = 0; Tc < Kh.length; Tc++) {
    var Ac = Kh[Tc], DS = Ac.toLowerCase(), OS = Ac[0].toUpperCase() + Ac.slice(1);
    Xe(
      DS,
      "on" + OS
    );
  }
  Xe(Ph, "onAnimationEnd"), Xe(qh, "onAnimationIteration"), Xe(Gh, "onAnimationStart"), Xe("dblclick", "onDoubleClick"), Xe("focusin", "onFocus"), Xe("focusout", "onBlur"), Xe(Zx, "onTransitionRun"), Xe(Qx, "onTransitionStart"), Xe(Fx, "onTransitionCancel"), Xe(Yh, "onTransitionEnd"), la("onMouseEnter", ["mouseout", "mouseover"]), la("onMouseLeave", ["mouseout", "mouseover"]), la("onPointerEnter", ["pointerout", "pointerover"]), la("onPointerLeave", ["pointerout", "pointerover"]), Si(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Si(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Si("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Si(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Si(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Si(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Ws = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), NS = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ws)
  );
  function eg(t, e) {
    e = (e & 4) !== 0;
    for (var a = 0; a < t.length; a++) {
      var r = t[a], o = r.event;
      r = r.listeners;
      t: {
        var c = void 0;
        if (e)
          for (var v = r.length - 1; 0 <= v; v--) {
            var x = r[v], E = x.instance, N = x.currentTarget;
            if (x = x.listener, E !== c && o.isPropagationStopped())
              break t;
            c = x, o.currentTarget = N;
            try {
              c(o);
            } catch (H) {
              cl(H);
            }
            o.currentTarget = null, c = E;
          }
        else
          for (v = 0; v < r.length; v++) {
            if (x = r[v], E = x.instance, N = x.currentTarget, x = x.listener, E !== c && o.isPropagationStopped())
              break t;
            c = x, o.currentTarget = N;
            try {
              c(o);
            } catch (H) {
              cl(H);
            }
            o.currentTarget = null, c = E;
          }
      }
    }
  }
  function St(t, e) {
    var a = e[ko];
    a === void 0 && (a = e[ko] = /* @__PURE__ */ new Set());
    var r = t + "__bubble";
    a.has(r) || (ng(e, t, 2, !1), a.add(r));
  }
  function wc(t, e, a) {
    var r = 0;
    e && (r |= 4), ng(
      a,
      t,
      r,
      e
    );
  }
  var El = "_reactListening" + Math.random().toString(36).slice(2);
  function Ec(t) {
    if (!t[El]) {
      t[El] = !0, sh.forEach(function(a) {
        a !== "selectionchange" && (NS.has(a) || wc(a, !1, t), wc(a, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[El] || (e[El] = !0, wc("selectionchange", !1, e));
    }
  }
  function ng(t, e, a, r) {
    switch (Eg(e)) {
      case 2:
        var o = iT;
        break;
      case 8:
        o = aT;
        break;
      default:
        o = Uc;
    }
    a = o.bind(
      null,
      e,
      a,
      t
    ), o = void 0, !Zo || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (o = !0), r ? o !== void 0 ? t.addEventListener(e, a, {
      capture: !0,
      passive: o
    }) : t.addEventListener(e, a, !0) : o !== void 0 ? t.addEventListener(e, a, {
      passive: o
    }) : t.addEventListener(e, a, !1);
  }
  function Rc(t, e, a, r, o) {
    var c = r;
    if (!(e & 1) && !(e & 2) && r !== null)
      t: for (; ; ) {
        if (r === null) return;
        var v = r.tag;
        if (v === 3 || v === 4) {
          var x = r.stateNode.containerInfo;
          if (x === o || x.nodeType === 8 && x.parentNode === o)
            break;
          if (v === 4)
            for (v = r.return; v !== null; ) {
              var E = v.tag;
              if ((E === 3 || E === 4) && (E = v.stateNode.containerInfo, E === o || E.nodeType === 8 && E.parentNode === o))
                return;
              v = v.return;
            }
          for (; x !== null; ) {
            if (v = xi(x), v === null) return;
            if (E = v.tag, E === 5 || E === 6 || E === 26 || E === 27) {
              r = c = v;
              continue t;
            }
            x = x.parentNode;
          }
        }
        r = r.return;
      }
    vh(function() {
      var N = c, H = Xo(a), X = [];
      t: {
        var B = Xh.get(t);
        if (B !== void 0) {
          var k = qr, it = t;
          switch (t) {
            case "keypress":
              if (Hr(a) === 0) break t;
            case "keydown":
            case "keyup":
              k = wx;
              break;
            case "focusin":
              it = "focus", k = $o;
              break;
            case "focusout":
              it = "blur", k = $o;
              break;
            case "beforeblur":
            case "afterblur":
              k = $o;
              break;
            case "click":
              if (a.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              k = xh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k = dx;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k = Cx;
              break;
            case Ph:
            case qh:
            case Gh:
              k = px;
              break;
            case Yh:
              k = Dx;
              break;
            case "scroll":
            case "scrollend":
              k = cx;
              break;
            case "wheel":
              k = Nx;
              break;
            case "copy":
            case "cut":
            case "paste":
              k = vx;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k = Th;
              break;
            case "toggle":
            case "beforetoggle":
              k = _x;
          }
          var ct = (e & 4) !== 0, Pt = !ct && (t === "scroll" || t === "scrollend"), j = ct ? B !== null ? B + "Capture" : null : B;
          ct = [];
          for (var D = N, _; D !== null; ) {
            var G = D;
            if (_ = G.stateNode, G = G.tag, G !== 5 && G !== 26 && G !== 27 || _ === null || j === null || (G = ps(D, j), G != null && ct.push(
              $s(D, G, _)
            )), Pt) break;
            D = D.return;
          }
          0 < ct.length && (B = new k(
            B,
            it,
            null,
            a,
            H
          ), X.push({ event: B, listeners: ct }));
        }
      }
      if (!(e & 7)) {
        t: {
          if (B = t === "mouseover" || t === "pointerover", k = t === "mouseout" || t === "pointerout", B && a !== Yo && (it = a.relatedTarget || a.fromElement) && (xi(it) || it[aa]))
            break t;
          if ((k || B) && (B = H.window === H ? H : (B = H.ownerDocument) ? B.defaultView || B.parentWindow : window, k ? (it = a.relatedTarget || a.toElement, k = N, it = it ? xi(it) : null, it !== null && (Pt = Y(it), ct = it.tag, it !== Pt || ct !== 5 && ct !== 27 && ct !== 6) && (it = null)) : (k = null, it = N), k !== it)) {
            if (ct = xh, G = "onMouseLeave", j = "onMouseEnter", D = "mouse", (t === "pointerout" || t === "pointerover") && (ct = Th, G = "onPointerLeave", j = "onPointerEnter", D = "pointer"), Pt = k == null ? B : ms(k), _ = it == null ? B : ms(it), B = new ct(
              G,
              D + "leave",
              k,
              a,
              H
            ), B.target = Pt, B.relatedTarget = _, G = null, xi(H) === N && (ct = new ct(
              j,
              D + "enter",
              it,
              a,
              H
            ), ct.target = _, ct.relatedTarget = Pt, G = ct), Pt = G, k && it)
              e: {
                for (ct = k, j = it, D = 0, _ = ct; _; _ = Va(_))
                  D++;
                for (_ = 0, G = j; G; G = Va(G))
                  _++;
                for (; 0 < D - _; )
                  ct = Va(ct), D--;
                for (; 0 < _ - D; )
                  j = Va(j), _--;
                for (; D--; ) {
                  if (ct === j || j !== null && ct === j.alternate)
                    break e;
                  ct = Va(ct), j = Va(j);
                }
                ct = null;
              }
            else ct = null;
            k !== null && ig(
              X,
              B,
              k,
              ct,
              !1
            ), it !== null && Pt !== null && ig(
              X,
              Pt,
              it,
              ct,
              !0
            );
          }
        }
        t: {
          if (B = N ? ms(N) : window, k = B.nodeName && B.nodeName.toLowerCase(), k === "select" || k === "input" && B.type === "file")
            var I = Oh;
          else if (Mh(B))
            if (Nh)
              I = Gx;
            else {
              I = Px;
              var vt = Hx;
            }
          else
            k = B.nodeName, !k || k.toLowerCase() !== "input" || B.type !== "checkbox" && B.type !== "radio" ? N && Go(N.elementType) && (I = Oh) : I = qx;
          if (I && (I = I(t, N))) {
            Dh(
              X,
              I,
              a,
              H
            );
            break t;
          }
          vt && vt(t, B, N), t === "focusout" && N && B.type === "number" && N.memoizedProps.value != null && qo(B, "number", B.value);
        }
        switch (vt = N ? ms(N) : window, t) {
          case "focusin":
            (Mh(vt) || vt.contentEditable === "true") && (ha = vt, iu = N, As = null);
            break;
          case "focusout":
            As = iu = ha = null;
            break;
          case "mousedown":
            au = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            au = !1, kh(X, a, H);
            break;
          case "selectionchange":
            if (Kx) break;
          case "keydown":
          case "keyup":
            kh(X, a, H);
        }
        var st;
        if (Io)
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
          da ? Rh(t, a) && (lt = "onCompositionEnd") : t === "keydown" && a.keyCode === 229 && (lt = "onCompositionStart");
        lt && (Ah && a.locale !== "ko" && (da || lt !== "onCompositionStart" ? lt === "onCompositionEnd" && da && (st = yh()) : (Pn = H, Qo = "value" in Pn ? Pn.value : Pn.textContent, da = !0)), vt = Rl(N, lt), 0 < vt.length && (lt = new Sh(
          lt,
          t,
          null,
          a,
          H
        ), X.push({ event: lt, listeners: vt }), st ? lt.data = st : (st = Ch(a), st !== null && (lt.data = st)))), (st = Vx ? Lx(t, a) : Bx(t, a)) && (lt = Rl(N, "onBeforeInput"), 0 < lt.length && (vt = new Sh(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          H
        ), X.push({
          event: vt,
          listeners: lt
        }), vt.data = st)), MS(
          X,
          t,
          N,
          a,
          H
        );
      }
      eg(X, e);
    });
  }
  function $s(t, e, a) {
    return {
      instance: t,
      listener: e,
      currentTarget: a
    };
  }
  function Rl(t, e) {
    for (var a = e + "Capture", r = []; t !== null; ) {
      var o = t, c = o.stateNode;
      o = o.tag, o !== 5 && o !== 26 && o !== 27 || c === null || (o = ps(t, a), o != null && r.unshift(
        $s(t, o, c)
      ), o = ps(t, e), o != null && r.push(
        $s(t, o, c)
      )), t = t.return;
    }
    return r;
  }
  function Va(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function ig(t, e, a, r, o) {
    for (var c = e._reactName, v = []; a !== null && a !== r; ) {
      var x = a, E = x.alternate, N = x.stateNode;
      if (x = x.tag, E !== null && E === r) break;
      x !== 5 && x !== 26 && x !== 27 || N === null || (E = N, o ? (N = ps(a, c), N != null && v.unshift(
        $s(a, N, E)
      )) : o || (N = ps(a, c), N != null && v.push(
        $s(a, N, E)
      ))), a = a.return;
    }
    v.length !== 0 && t.push({ event: e, listeners: v });
  }
  var jS = /\r\n?/g, _S = /\u0000|\uFFFD/g;
  function ag(t) {
    return (typeof t == "string" ? t : "" + t).replace(jS, `
`).replace(_S, "");
  }
  function sg(t, e) {
    return e = ag(e), ag(t) === e;
  }
  function Cl() {
  }
  function Mt(t, e, a, r, o, c) {
    switch (a) {
      case "children":
        typeof r == "string" ? e === "body" || e === "textarea" && r === "" || ua(t, r) : (typeof r == "number" || typeof r == "bigint") && e !== "body" && ua(t, "" + r);
        break;
      case "className":
        Vr(t, "class", r);
        break;
      case "tabIndex":
        Vr(t, "tabindex", r);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Vr(t, a, r);
        break;
      case "style":
        ph(t, r, c);
        break;
      case "data":
        if (e !== "object") {
          Vr(t, "data", r);
          break;
        }
      case "src":
      case "href":
        if (r === "" && (e !== "a" || a !== "href")) {
          t.removeAttribute(a);
          break;
        }
        if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
          t.removeAttribute(a);
          break;
        }
        r = Ur("" + r), t.setAttribute(a, r);
        break;
      case "action":
      case "formAction":
        if (typeof r == "function") {
          t.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof c == "function" && (a === "formAction" ? (e !== "input" && Mt(t, e, "name", o.name, o, null), Mt(
            t,
            e,
            "formEncType",
            o.formEncType,
            o,
            null
          ), Mt(
            t,
            e,
            "formMethod",
            o.formMethod,
            o,
            null
          ), Mt(
            t,
            e,
            "formTarget",
            o.formTarget,
            o,
            null
          )) : (Mt(t, e, "encType", o.encType, o, null), Mt(t, e, "method", o.method, o, null), Mt(t, e, "target", o.target, o, null)));
        if (r == null || typeof r == "symbol" || typeof r == "boolean") {
          t.removeAttribute(a);
          break;
        }
        r = Ur("" + r), t.setAttribute(a, r);
        break;
      case "onClick":
        r != null && (t.onclick = Cl);
        break;
      case "onScroll":
        r != null && St("scroll", t);
        break;
      case "onScrollEnd":
        r != null && St("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (r != null) {
          if (typeof r != "object" || !("__html" in r))
            throw Error(l(61));
          if (a = r.__html, a != null) {
            if (o.children != null) throw Error(l(60));
            t.innerHTML = a;
          }
        }
        break;
      case "multiple":
        t.multiple = r && typeof r != "function" && typeof r != "symbol";
        break;
      case "muted":
        t.muted = r && typeof r != "function" && typeof r != "symbol";
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
        if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        a = Ur("" + r), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          a
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
        r != null && typeof r != "function" && typeof r != "symbol" ? t.setAttribute(a, "" + r) : t.removeAttribute(a);
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
        r && typeof r != "function" && typeof r != "symbol" ? t.setAttribute(a, "") : t.removeAttribute(a);
        break;
      case "capture":
      case "download":
        r === !0 ? t.setAttribute(a, "") : r !== !1 && r != null && typeof r != "function" && typeof r != "symbol" ? t.setAttribute(a, r) : t.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? t.setAttribute(a, r) : t.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? t.removeAttribute(a) : t.setAttribute(a, r);
        break;
      case "popover":
        St("beforetoggle", t), St("toggle", t), zr(t, "popover", r);
        break;
      case "xlinkActuate":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          r
        );
        break;
      case "xlinkArcrole":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          r
        );
        break;
      case "xlinkRole":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          r
        );
        break;
      case "xlinkShow":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          r
        );
        break;
      case "xlinkTitle":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          r
        );
        break;
      case "xlinkType":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          r
        );
        break;
      case "xmlBase":
        dn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          r
        );
        break;
      case "xmlLang":
        dn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          r
        );
        break;
      case "xmlSpace":
        dn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          r
        );
        break;
      case "is":
        zr(t, "is", r);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = ox.get(a) || a, zr(t, a, r));
    }
  }
  function Cc(t, e, a, r, o, c) {
    switch (a) {
      case "style":
        ph(t, r, c);
        break;
      case "dangerouslySetInnerHTML":
        if (r != null) {
          if (typeof r != "object" || !("__html" in r))
            throw Error(l(61));
          if (a = r.__html, a != null) {
            if (o.children != null) throw Error(l(60));
            t.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof r == "string" ? ua(t, r) : (typeof r == "number" || typeof r == "bigint") && ua(t, "" + r);
        break;
      case "onScroll":
        r != null && St("scroll", t);
        break;
      case "onScrollEnd":
        r != null && St("scrollend", t);
        break;
      case "onClick":
        r != null && (t.onclick = Cl);
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
        if (!rh.hasOwnProperty(a))
          t: {
            if (a[0] === "o" && a[1] === "n" && (o = a.endsWith("Capture"), e = a.slice(2, o ? a.length - 7 : void 0), c = t[pe] || null, c = c != null ? c[a] : null, typeof c == "function" && t.removeEventListener(e, c, o), typeof r == "function")) {
              typeof c != "function" && c !== null && (a in t ? t[a] = null : t.hasAttribute(a) && t.removeAttribute(a)), t.addEventListener(e, r, o);
              break t;
            }
            a in t ? t[a] = r : r === !0 ? t.setAttribute(a, "") : zr(t, a, r);
          }
    }
  }
  function se(t, e, a) {
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
        St("error", t), St("load", t);
        var r = !1, o = !1, c;
        for (c in a)
          if (a.hasOwnProperty(c)) {
            var v = a[c];
            if (v != null)
              switch (c) {
                case "src":
                  r = !0;
                  break;
                case "srcSet":
                  o = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(l(137, e));
                default:
                  Mt(t, e, c, v, a, null);
              }
          }
        o && Mt(t, e, "srcSet", a.srcSet, a, null), r && Mt(t, e, "src", a.src, a, null);
        return;
      case "input":
        St("invalid", t);
        var x = c = v = o = null, E = null, N = null;
        for (r in a)
          if (a.hasOwnProperty(r)) {
            var H = a[r];
            if (H != null)
              switch (r) {
                case "name":
                  o = H;
                  break;
                case "type":
                  v = H;
                  break;
                case "checked":
                  E = H;
                  break;
                case "defaultChecked":
                  N = H;
                  break;
                case "value":
                  c = H;
                  break;
                case "defaultValue":
                  x = H;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (H != null)
                    throw Error(l(137, e));
                  break;
                default:
                  Mt(t, e, r, H, a, null);
              }
          }
        fh(
          t,
          c,
          x,
          E,
          N,
          v,
          o,
          !1
        ), Lr(t);
        return;
      case "select":
        St("invalid", t), r = v = c = null;
        for (o in a)
          if (a.hasOwnProperty(o) && (x = a[o], x != null))
            switch (o) {
              case "value":
                c = x;
                break;
              case "defaultValue":
                v = x;
                break;
              case "multiple":
                r = x;
              default:
                Mt(t, e, o, x, a, null);
            }
        e = c, a = v, t.multiple = !!r, e != null ? oa(t, !!r, e, !1) : a != null && oa(t, !!r, a, !0);
        return;
      case "textarea":
        St("invalid", t), c = o = r = null;
        for (v in a)
          if (a.hasOwnProperty(v) && (x = a[v], x != null))
            switch (v) {
              case "value":
                r = x;
                break;
              case "defaultValue":
                o = x;
                break;
              case "children":
                c = x;
                break;
              case "dangerouslySetInnerHTML":
                if (x != null) throw Error(l(91));
                break;
              default:
                Mt(t, e, v, x, a, null);
            }
        hh(t, r, o, c), Lr(t);
        return;
      case "option":
        for (E in a)
          if (a.hasOwnProperty(E) && (r = a[E], r != null))
            switch (E) {
              case "selected":
                t.selected = r && typeof r != "function" && typeof r != "symbol";
                break;
              default:
                Mt(t, e, E, r, a, null);
            }
        return;
      case "dialog":
        St("cancel", t), St("close", t);
        break;
      case "iframe":
      case "object":
        St("load", t);
        break;
      case "video":
      case "audio":
        for (r = 0; r < Ws.length; r++)
          St(Ws[r], t);
        break;
      case "image":
        St("error", t), St("load", t);
        break;
      case "details":
        St("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        St("error", t), St("load", t);
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
        for (N in a)
          if (a.hasOwnProperty(N) && (r = a[N], r != null))
            switch (N) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(l(137, e));
              default:
                Mt(t, e, N, r, a, null);
            }
        return;
      default:
        if (Go(e)) {
          for (H in a)
            a.hasOwnProperty(H) && (r = a[H], r !== void 0 && Cc(
              t,
              e,
              H,
              r,
              a,
              void 0
            ));
          return;
        }
    }
    for (x in a)
      a.hasOwnProperty(x) && (r = a[x], r != null && Mt(t, e, x, r, a, null));
  }
  function zS(t, e, a, r) {
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
        var o = null, c = null, v = null, x = null, E = null, N = null, H = null;
        for (k in a) {
          var X = a[k];
          if (a.hasOwnProperty(k) && X != null)
            switch (k) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                E = X;
              default:
                r.hasOwnProperty(k) || Mt(t, e, k, null, r, X);
            }
        }
        for (var B in r) {
          var k = r[B];
          if (X = a[B], r.hasOwnProperty(B) && (k != null || X != null))
            switch (B) {
              case "type":
                c = k;
                break;
              case "name":
                o = k;
                break;
              case "checked":
                N = k;
                break;
              case "defaultChecked":
                H = k;
                break;
              case "value":
                v = k;
                break;
              case "defaultValue":
                x = k;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (k != null)
                  throw Error(l(137, e));
                break;
              default:
                k !== X && Mt(
                  t,
                  e,
                  B,
                  k,
                  r,
                  X
                );
            }
        }
        Po(
          t,
          v,
          x,
          E,
          N,
          H,
          c,
          o
        );
        return;
      case "select":
        k = v = x = B = null;
        for (c in a)
          if (E = a[c], a.hasOwnProperty(c) && E != null)
            switch (c) {
              case "value":
                break;
              case "multiple":
                k = E;
              default:
                r.hasOwnProperty(c) || Mt(
                  t,
                  e,
                  c,
                  null,
                  r,
                  E
                );
            }
        for (o in r)
          if (c = r[o], E = a[o], r.hasOwnProperty(o) && (c != null || E != null))
            switch (o) {
              case "value":
                B = c;
                break;
              case "defaultValue":
                x = c;
                break;
              case "multiple":
                v = c;
              default:
                c !== E && Mt(
                  t,
                  e,
                  o,
                  c,
                  r,
                  E
                );
            }
        e = x, a = v, r = k, B != null ? oa(t, !!a, B, !1) : !!r != !!a && (e != null ? oa(t, !!a, e, !0) : oa(t, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        k = B = null;
        for (x in a)
          if (o = a[x], a.hasOwnProperty(x) && o != null && !r.hasOwnProperty(x))
            switch (x) {
              case "value":
                break;
              case "children":
                break;
              default:
                Mt(t, e, x, null, r, o);
            }
        for (v in r)
          if (o = r[v], c = a[v], r.hasOwnProperty(v) && (o != null || c != null))
            switch (v) {
              case "value":
                B = o;
                break;
              case "defaultValue":
                k = o;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(l(91));
                break;
              default:
                o !== c && Mt(t, e, v, o, r, c);
            }
        dh(t, B, k);
        return;
      case "option":
        for (var it in a)
          if (B = a[it], a.hasOwnProperty(it) && B != null && !r.hasOwnProperty(it))
            switch (it) {
              case "selected":
                t.selected = !1;
                break;
              default:
                Mt(
                  t,
                  e,
                  it,
                  null,
                  r,
                  B
                );
            }
        for (E in r)
          if (B = r[E], k = a[E], r.hasOwnProperty(E) && B !== k && (B != null || k != null))
            switch (E) {
              case "selected":
                t.selected = B && typeof B != "function" && typeof B != "symbol";
                break;
              default:
                Mt(
                  t,
                  e,
                  E,
                  B,
                  r,
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
        for (var ct in a)
          B = a[ct], a.hasOwnProperty(ct) && B != null && !r.hasOwnProperty(ct) && Mt(t, e, ct, null, r, B);
        for (N in r)
          if (B = r[N], k = a[N], r.hasOwnProperty(N) && B !== k && (B != null || k != null))
            switch (N) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (B != null)
                  throw Error(l(137, e));
                break;
              default:
                Mt(
                  t,
                  e,
                  N,
                  B,
                  r,
                  k
                );
            }
        return;
      default:
        if (Go(e)) {
          for (var Pt in a)
            B = a[Pt], a.hasOwnProperty(Pt) && B !== void 0 && !r.hasOwnProperty(Pt) && Cc(
              t,
              e,
              Pt,
              void 0,
              r,
              B
            );
          for (H in r)
            B = r[H], k = a[H], !r.hasOwnProperty(H) || B === k || B === void 0 && k === void 0 || Cc(
              t,
              e,
              H,
              B,
              r,
              k
            );
          return;
        }
    }
    for (var j in a)
      B = a[j], a.hasOwnProperty(j) && B != null && !r.hasOwnProperty(j) && Mt(t, e, j, null, r, B);
    for (X in r)
      B = r[X], k = a[X], !r.hasOwnProperty(X) || B === k || B == null && k == null || Mt(t, e, X, B, r, k);
  }
  var Mc = null, Dc = null;
  function Ml(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function rg(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function lg(t, e) {
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
  function Oc(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Nc = null;
  function VS() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Nc ? !1 : (Nc = t, !0) : (Nc = null, !1);
  }
  var og = typeof setTimeout == "function" ? setTimeout : void 0, LS = typeof clearTimeout == "function" ? clearTimeout : void 0, ug = typeof Promise == "function" ? Promise : void 0, BS = typeof queueMicrotask == "function" ? queueMicrotask : typeof ug < "u" ? function(t) {
    return ug.resolve(null).then(t).catch(US);
  } : og;
  function US(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function jc(t, e) {
    var a = e, r = 0;
    do {
      var o = a.nextSibling;
      if (t.removeChild(a), o && o.nodeType === 8)
        if (a = o.data, a === "/$") {
          if (r === 0) {
            t.removeChild(o), sr(e);
            return;
          }
          r--;
        } else a !== "$" && a !== "$?" && a !== "$!" || r++;
      a = o;
    } while (a);
    sr(e);
  }
  function _c(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var a = e;
      switch (e = e.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          _c(a), Ho(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(a);
    }
  }
  function kS(t, e, a, r) {
    for (; t.nodeType === 1; ) {
      var o = a;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!r && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (r) {
        if (!t[hs])
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
      if (t = Qe(t.nextSibling), t === null) break;
    }
    return null;
  }
  function HS(t, e, a) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !a || (t = Qe(t.nextSibling), t === null)) return null;
    return t;
  }
  function Qe(t) {
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
  function cg(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var a = t.data;
        if (a === "$" || a === "$!" || a === "$?") {
          if (e === 0) return t;
          e--;
        } else a === "/$" && e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function fg(t, e, a) {
    switch (e = Ml(a), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(l(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(l(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(l(454));
        return t;
      default:
        throw Error(l(451));
    }
  }
  var qe = /* @__PURE__ */ new Map(), dg = /* @__PURE__ */ new Set();
  function Dl(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.ownerDocument;
  }
  var Cn = J.d;
  J.d = {
    f: PS,
    r: qS,
    D: GS,
    C: YS,
    L: XS,
    m: KS,
    X: QS,
    S: ZS,
    M: FS
  };
  function PS() {
    var t = Cn.f(), e = Sl();
    return t || e;
  }
  function qS(t) {
    var e = sa(t);
    e !== null && e.tag === 5 && e.type === "form" ? km(e) : Cn.r(t);
  }
  var La = typeof document > "u" ? null : document;
  function hg(t, e, a) {
    var r = La;
    if (r && typeof e == "string" && e) {
      var o = je(e);
      o = 'link[rel="' + t + '"][href="' + o + '"]', typeof a == "string" && (o += '[crossorigin="' + a + '"]'), dg.has(o) || (dg.add(o), t = { rel: t, crossOrigin: a, href: e }, r.querySelector(o) === null && (e = r.createElement("link"), se(e, "link", t), $t(e), r.head.appendChild(e)));
    }
  }
  function GS(t) {
    Cn.D(t), hg("dns-prefetch", t, null);
  }
  function YS(t, e) {
    Cn.C(t, e), hg("preconnect", t, e);
  }
  function XS(t, e, a) {
    Cn.L(t, e, a);
    var r = La;
    if (r && t && e) {
      var o = 'link[rel="preload"][as="' + je(e) + '"]';
      e === "image" && a && a.imageSrcSet ? (o += '[imagesrcset="' + je(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (o += '[imagesizes="' + je(
        a.imageSizes
      ) + '"]')) : o += '[href="' + je(t) + '"]';
      var c = o;
      switch (e) {
        case "style":
          c = Ba(t);
          break;
        case "script":
          c = Ua(t);
      }
      qe.has(c) || (t = W(
        {
          rel: "preload",
          href: e === "image" && a && a.imageSrcSet ? void 0 : t,
          as: e
        },
        a
      ), qe.set(c, t), r.querySelector(o) !== null || e === "style" && r.querySelector(Js(c)) || e === "script" && r.querySelector(Is(c)) || (e = r.createElement("link"), se(e, "link", t), $t(e), r.head.appendChild(e)));
    }
  }
  function KS(t, e) {
    Cn.m(t, e);
    var a = La;
    if (a && t) {
      var r = e && typeof e.as == "string" ? e.as : "script", o = 'link[rel="modulepreload"][as="' + je(r) + '"][href="' + je(t) + '"]', c = o;
      switch (r) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          c = Ua(t);
      }
      if (!qe.has(c) && (t = W({ rel: "modulepreload", href: t }, e), qe.set(c, t), a.querySelector(o) === null)) {
        switch (r) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(Is(c)))
              return;
        }
        r = a.createElement("link"), se(r, "link", t), $t(r), a.head.appendChild(r);
      }
    }
  }
  function ZS(t, e, a) {
    Cn.S(t, e, a);
    var r = La;
    if (r && t) {
      var o = ra(r).hoistableStyles, c = Ba(t);
      e = e || "default";
      var v = o.get(c);
      if (!v) {
        var x = { loading: 0, preload: null };
        if (v = r.querySelector(
          Js(c)
        ))
          x.loading = 5;
        else {
          t = W(
            { rel: "stylesheet", href: t, "data-precedence": e },
            a
          ), (a = qe.get(c)) && zc(t, a);
          var E = v = r.createElement("link");
          $t(E), se(E, "link", t), E._p = new Promise(function(N, H) {
            E.onload = N, E.onerror = H;
          }), E.addEventListener("load", function() {
            x.loading |= 1;
          }), E.addEventListener("error", function() {
            x.loading |= 2;
          }), x.loading |= 4, Ol(v, e, r);
        }
        v = {
          type: "stylesheet",
          instance: v,
          count: 1,
          state: x
        }, o.set(c, v);
      }
    }
  }
  function QS(t, e) {
    Cn.X(t, e);
    var a = La;
    if (a && t) {
      var r = ra(a).hoistableScripts, o = Ua(t), c = r.get(o);
      c || (c = a.querySelector(Is(o)), c || (t = W({ src: t, async: !0 }, e), (e = qe.get(o)) && Vc(t, e), c = a.createElement("script"), $t(c), se(c, "link", t), a.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, r.set(o, c));
    }
  }
  function FS(t, e) {
    Cn.M(t, e);
    var a = La;
    if (a && t) {
      var r = ra(a).hoistableScripts, o = Ua(t), c = r.get(o);
      c || (c = a.querySelector(Is(o)), c || (t = W({ src: t, async: !0, type: "module" }, e), (e = qe.get(o)) && Vc(t, e), c = a.createElement("script"), $t(c), se(c, "link", t), a.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, r.set(o, c));
    }
  }
  function mg(t, e, a, r) {
    var o = (o = me.current) ? Dl(o) : null;
    if (!o) throw Error(l(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (e = Ba(a.href), a = ra(
          o
        ).hoistableStyles, r = a.get(e), r || (r = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(e, r)), r) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          t = Ba(a.href);
          var c = ra(
            o
          ).hoistableStyles, v = c.get(t);
          if (v || (o = o.ownerDocument || o, v = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, c.set(t, v), (c = o.querySelector(
            Js(t)
          )) && !c._p && (v.instance = c, v.state.loading = 5), qe.has(t) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, qe.set(t, a), c || WS(
            o,
            t,
            a,
            v.state
          ))), e && r === null)
            throw Error(l(528, ""));
          return v;
        }
        if (e && r !== null)
          throw Error(l(529, ""));
        return null;
      case "script":
        return e = a.async, a = a.src, typeof a == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = Ua(a), a = ra(
          o
        ).hoistableScripts, r = a.get(e), r || (r = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(e, r)), r) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(l(444, t));
    }
  }
  function Ba(t) {
    return 'href="' + je(t) + '"';
  }
  function Js(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function pg(t) {
    return W({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function WS(t, e, a, r) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? r.loading = 1 : (e = t.createElement("link"), r.preload = e, e.addEventListener("load", function() {
      return r.loading |= 1;
    }), e.addEventListener("error", function() {
      return r.loading |= 2;
    }), se(e, "link", a), $t(e), t.head.appendChild(e));
  }
  function Ua(t) {
    return '[src="' + je(t) + '"]';
  }
  function Is(t) {
    return "script[async]" + t;
  }
  function gg(t, e, a) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var r = t.querySelector(
            'style[data-href~="' + je(a.href) + '"]'
          );
          if (r)
            return e.instance = r, $t(r), r;
          var o = W({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return r = (t.ownerDocument || t).createElement(
            "style"
          ), $t(r), se(r, "style", o), Ol(r, a.precedence, t), e.instance = r;
        case "stylesheet":
          o = Ba(a.href);
          var c = t.querySelector(
            Js(o)
          );
          if (c)
            return e.state.loading |= 4, e.instance = c, $t(c), c;
          r = pg(a), (o = qe.get(o)) && zc(r, o), c = (t.ownerDocument || t).createElement("link"), $t(c);
          var v = c;
          return v._p = new Promise(function(x, E) {
            v.onload = x, v.onerror = E;
          }), se(c, "link", r), e.state.loading |= 4, Ol(c, a.precedence, t), e.instance = c;
        case "script":
          return c = Ua(a.src), (o = t.querySelector(
            Is(c)
          )) ? (e.instance = o, $t(o), o) : (r = a, (o = qe.get(c)) && (r = W({}, a), Vc(r, o)), t = t.ownerDocument || t, o = t.createElement("script"), $t(o), se(o, "link", r), t.head.appendChild(o), e.instance = o);
        case "void":
          return null;
        default:
          throw Error(l(443, e.type));
      }
    else
      e.type === "stylesheet" && !(e.state.loading & 4) && (r = e.instance, e.state.loading |= 4, Ol(r, a.precedence, t));
    return e.instance;
  }
  function Ol(t, e, a) {
    for (var r = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), o = r.length ? r[r.length - 1] : null, c = o, v = 0; v < r.length; v++) {
      var x = r[v];
      if (x.dataset.precedence === e) c = x;
      else if (c !== o) break;
    }
    c ? c.parentNode.insertBefore(t, c.nextSibling) : (e = a.nodeType === 9 ? a.head : a, e.insertBefore(t, e.firstChild));
  }
  function zc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Vc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Nl = null;
  function vg(t, e, a) {
    if (Nl === null) {
      var r = /* @__PURE__ */ new Map(), o = Nl = /* @__PURE__ */ new Map();
      o.set(a, r);
    } else
      o = Nl, r = o.get(a), r || (r = /* @__PURE__ */ new Map(), o.set(a, r));
    if (r.has(t)) return r;
    for (r.set(t, null), a = a.getElementsByTagName(t), o = 0; o < a.length; o++) {
      var c = a[o];
      if (!(c[hs] || c[le] || t === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
        var v = c.getAttribute(e) || "";
        v = t + v;
        var x = r.get(v);
        x ? x.push(c) : r.set(v, [c]);
      }
    }
    return r;
  }
  function yg(t, e, a) {
    t = t.ownerDocument || t, t.head.insertBefore(
      a,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function $S(t, e, a) {
    if (a === 1 || e.itemProp != null) return !1;
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
  function bg(t) {
    return !(t.type === "stylesheet" && !(t.state.loading & 3));
  }
  var tr = null;
  function JS() {
  }
  function IS(t, e, a) {
    if (tr === null) throw Error(l(475));
    var r = tr;
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && !(e.state.loading & 4)) {
      if (e.instance === null) {
        var o = Ba(a.href), c = t.querySelector(
          Js(o)
        );
        if (c) {
          t = c._p, t !== null && typeof t == "object" && typeof t.then == "function" && (r.count++, r = jl.bind(r), t.then(r, r)), e.state.loading |= 4, e.instance = c, $t(c);
          return;
        }
        c = t.ownerDocument || t, a = pg(a), (o = qe.get(o)) && zc(a, o), c = c.createElement("link"), $t(c);
        var v = c;
        v._p = new Promise(function(x, E) {
          v.onload = x, v.onerror = E;
        }), se(c, "link", a), e.instance = c;
      }
      r.stylesheets === null && (r.stylesheets = /* @__PURE__ */ new Map()), r.stylesheets.set(e, t), (t = e.state.preload) && !(e.state.loading & 3) && (r.count++, e = jl.bind(r), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  function tT() {
    if (tr === null) throw Error(l(475));
    var t = tr;
    return t.stylesheets && t.count === 0 && Lc(t, t.stylesheets), 0 < t.count ? function(e) {
      var a = setTimeout(function() {
        if (t.stylesheets && Lc(t, t.stylesheets), t.unsuspend) {
          var r = t.unsuspend;
          t.unsuspend = null, r();
        }
      }, 6e4);
      return t.unsuspend = e, function() {
        t.unsuspend = null, clearTimeout(a);
      };
    } : null;
  }
  function jl() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Lc(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var _l = null;
  function Lc(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, _l = /* @__PURE__ */ new Map(), e.forEach(eT, t), _l = null, jl.call(t));
  }
  function eT(t, e) {
    if (!(e.state.loading & 4)) {
      var a = _l.get(t);
      if (a) var r = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), _l.set(t, a);
        for (var o = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), c = 0; c < o.length; c++) {
          var v = o[c];
          (v.nodeName === "LINK" || v.getAttribute("media") !== "not all") && (a.set(v.dataset.precedence, v), r = v);
        }
        r && a.set(null, r);
      }
      o = e.instance, v = o.getAttribute("data-precedence"), c = a.get(v) || r, c === r && a.set(null, o), a.set(v, o), this.count++, r = jl.bind(this), o.addEventListener("load", r), o.addEventListener("error", r), c ? c.parentNode.insertBefore(o, c.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(o, t.firstChild)), e.state.loading |= 4;
    }
  }
  var er = {
    $$typeof: T,
    Provider: null,
    Consumer: null,
    _currentValue: dt,
    _currentValue2: dt,
    _threadCount: 0
  };
  function nT(t, e, a, r, o, c, v, x) {
    this.tag = 1, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Uo(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.finishedLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Uo(0), this.hiddenUpdates = Uo(null), this.identifierPrefix = r, this.onUncaughtError = o, this.onCaughtError = c, this.onRecoverableError = v, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = x, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function xg(t, e, a, r, o, c, v, x, E, N, H, X) {
    return t = new nT(
      t,
      e,
      a,
      v,
      x,
      E,
      N,
      X
    ), e = 1, c === !0 && (e |= 24), c = He(3, null, null, e), t.current = c, c.stateNode = t, e = mu(), e.refCount++, t.pooledCache = e, e.refCount++, c.memoizedState = {
      element: r,
      isDehydrated: a,
      cache: e
    }, Qu(c), t;
  }
  function Sg(t) {
    return t ? (t = ga, t) : ga;
  }
  function Tg(t, e, a, r, o, c) {
    o = Sg(o), r.context === null ? r.context = o : r.pendingContext = o, r = Fn(e), r.payload = { element: a }, c = c === void 0 ? null : c, c !== null && (r.callback = c), a = Wn(t, r, e), a !== null && (de(a, t, e), Us(a, t, e));
  }
  function Ag(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var a = t.retryLane;
      t.retryLane = a !== 0 && a < e ? a : e;
    }
  }
  function Bc(t, e) {
    Ag(t, e), (t = t.alternate) && Ag(t, e);
  }
  function wg(t) {
    if (t.tag === 13) {
      var e = qn(t, 67108864);
      e !== null && de(e, t, 67108864), Bc(t, 67108864);
    }
  }
  var zl = !0;
  function iT(t, e, a, r) {
    var o = Q.T;
    Q.T = null;
    var c = J.p;
    try {
      J.p = 2, Uc(t, e, a, r);
    } finally {
      J.p = c, Q.T = o;
    }
  }
  function aT(t, e, a, r) {
    var o = Q.T;
    Q.T = null;
    var c = J.p;
    try {
      J.p = 8, Uc(t, e, a, r);
    } finally {
      J.p = c, Q.T = o;
    }
  }
  function Uc(t, e, a, r) {
    if (zl) {
      var o = kc(r);
      if (o === null)
        Rc(
          t,
          e,
          r,
          Vl,
          a
        ), Rg(t, r);
      else if (rT(
        o,
        t,
        e,
        a,
        r
      ))
        r.stopPropagation();
      else if (Rg(t, r), e & 4 && -1 < sT.indexOf(t)) {
        for (; o !== null; ) {
          var c = sa(o);
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (c = c.stateNode, c.current.memoizedState.isDehydrated) {
                  var v = bi(c.pendingLanes);
                  if (v !== 0) {
                    var x = c;
                    for (x.pendingLanes |= 2, x.entangledLanes |= 2; v; ) {
                      var E = 1 << 31 - we(v);
                      x.entanglements[1] |= E, v &= ~E;
                    }
                    an(c), !(Bt & 6) && (yl = Je() + 500, Fs(0));
                  }
                }
                break;
              case 13:
                x = qn(c, 2), x !== null && de(x, c, 2), Sl(), Bc(c, 2);
            }
          if (c = kc(r), c === null && Rc(
            t,
            e,
            r,
            Vl,
            a
          ), c === o) break;
          o = c;
        }
        o !== null && r.stopPropagation();
      } else
        Rc(
          t,
          e,
          r,
          null,
          a
        );
    }
  }
  function kc(t) {
    return t = Xo(t), Hc(t);
  }
  var Vl = null;
  function Hc(t) {
    if (Vl = null, t = xi(t), t !== null) {
      var e = Y(t);
      if (e === null) t = null;
      else {
        var a = e.tag;
        if (a === 13) {
          if (t = nt(e), t !== null) return t;
          t = null;
        } else if (a === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return Vl = t, null;
  }
  function Eg(t) {
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
        switch (Y1()) {
          case Fd:
            return 2;
          case Wd:
            return 8;
          case Or:
          case X1:
            return 32;
          case $d:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Pc = !1, ii = null, ai = null, si = null, nr = /* @__PURE__ */ new Map(), ir = /* @__PURE__ */ new Map(), ri = [], sT = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Rg(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        ii = null;
        break;
      case "dragenter":
      case "dragleave":
        ai = null;
        break;
      case "mouseover":
      case "mouseout":
        si = null;
        break;
      case "pointerover":
      case "pointerout":
        nr.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ir.delete(e.pointerId);
    }
  }
  function ar(t, e, a, r, o, c) {
    return t === null || t.nativeEvent !== c ? (t = {
      blockedOn: e,
      domEventName: a,
      eventSystemFlags: r,
      nativeEvent: c,
      targetContainers: [o]
    }, e !== null && (e = sa(e), e !== null && wg(e)), t) : (t.eventSystemFlags |= r, e = t.targetContainers, o !== null && e.indexOf(o) === -1 && e.push(o), t);
  }
  function rT(t, e, a, r, o) {
    switch (e) {
      case "focusin":
        return ii = ar(
          ii,
          t,
          e,
          a,
          r,
          o
        ), !0;
      case "dragenter":
        return ai = ar(
          ai,
          t,
          e,
          a,
          r,
          o
        ), !0;
      case "mouseover":
        return si = ar(
          si,
          t,
          e,
          a,
          r,
          o
        ), !0;
      case "pointerover":
        var c = o.pointerId;
        return nr.set(
          c,
          ar(
            nr.get(c) || null,
            t,
            e,
            a,
            r,
            o
          )
        ), !0;
      case "gotpointercapture":
        return c = o.pointerId, ir.set(
          c,
          ar(
            ir.get(c) || null,
            t,
            e,
            a,
            r,
            o
          )
        ), !0;
    }
    return !1;
  }
  function Cg(t) {
    var e = xi(t.target);
    if (e !== null) {
      var a = Y(e);
      if (a !== null) {
        if (e = a.tag, e === 13) {
          if (e = nt(a), e !== null) {
            t.blockedOn = e, tx(t.priority, function() {
              if (a.tag === 13) {
                var r = De(), o = qn(a, r);
                o !== null && de(o, a, r), Bc(a, r);
              }
            });
            return;
          }
        } else if (e === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Ll(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var a = kc(t.nativeEvent);
      if (a === null) {
        a = t.nativeEvent;
        var r = new a.constructor(
          a.type,
          a
        );
        Yo = r, a.target.dispatchEvent(r), Yo = null;
      } else
        return e = sa(a), e !== null && wg(e), t.blockedOn = a, !1;
      e.shift();
    }
    return !0;
  }
  function Mg(t, e, a) {
    Ll(t) && a.delete(e);
  }
  function lT() {
    Pc = !1, ii !== null && Ll(ii) && (ii = null), ai !== null && Ll(ai) && (ai = null), si !== null && Ll(si) && (si = null), nr.forEach(Mg), ir.forEach(Mg);
  }
  function Bl(t, e) {
    t.blockedOn === e && (t.blockedOn = null, Pc || (Pc = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      lT
    )));
  }
  var Ul = null;
  function Dg(t) {
    Ul !== t && (Ul = t, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        Ul === t && (Ul = null);
        for (var e = 0; e < t.length; e += 3) {
          var a = t[e], r = t[e + 1], o = t[e + 2];
          if (typeof r != "function") {
            if (Hc(r || a) === null)
              continue;
            break;
          }
          var c = sa(a);
          c !== null && (t.splice(e, 3), e -= 3, Ou(
            c,
            {
              pending: !0,
              data: o,
              method: a.method,
              action: r
            },
            r,
            o
          ));
        }
      }
    ));
  }
  function sr(t) {
    function e(E) {
      return Bl(E, t);
    }
    ii !== null && Bl(ii, t), ai !== null && Bl(ai, t), si !== null && Bl(si, t), nr.forEach(e), ir.forEach(e);
    for (var a = 0; a < ri.length; a++) {
      var r = ri[a];
      r.blockedOn === t && (r.blockedOn = null);
    }
    for (; 0 < ri.length && (a = ri[0], a.blockedOn === null); )
      Cg(a), a.blockedOn === null && ri.shift();
    if (a = (t.ownerDocument || t).$$reactFormReplay, a != null)
      for (r = 0; r < a.length; r += 3) {
        var o = a[r], c = a[r + 1], v = o[pe] || null;
        if (typeof c == "function")
          v || Dg(a);
        else if (v) {
          var x = null;
          if (c && c.hasAttribute("formAction")) {
            if (o = c, v = c[pe] || null)
              x = v.formAction;
            else if (Hc(o) !== null) continue;
          } else x = v.action;
          typeof x == "function" ? a[r + 1] = x : (a.splice(r, 3), r -= 3), Dg(a);
        }
      }
  }
  function qc(t) {
    this._internalRoot = t;
  }
  kl.prototype.render = qc.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(l(409));
    var a = e.current, r = De();
    Tg(a, r, t, e, null, null);
  }, kl.prototype.unmount = qc.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      t.tag === 0 && _a(), Tg(t.current, 2, null, t, null, null), Sl(), e[aa] = null;
    }
  };
  function kl(t) {
    this._internalRoot = t;
  }
  kl.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = ih();
      t = { blockedOn: null, target: t, priority: e };
      for (var a = 0; a < ri.length && e !== 0 && e < ri[a].priority; a++) ;
      ri.splice(a, 0, t), a === 0 && Cg(t);
    }
  };
  var Og = i.version;
  if (Og !== "19.0.0")
    throw Error(
      l(
        527,
        Og,
        "19.0.0"
      )
    );
  J.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(l(188)) : (t = Object.keys(t).join(","), Error(l(268, t)));
    return t = K(e), t = t !== null ? rt(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var oT = {
    bundleType: 0,
    version: "19.0.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: Q,
    findFiberByHostInstance: xi,
    reconcilerVersion: "19.0.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Hl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Hl.isDisabled && Hl.supportsFiber)
      try {
        cs = Hl.inject(
          oT
        ), Ae = Hl;
      } catch {
      }
  }
  return or.createRoot = function(t, e) {
    if (!u(t)) throw Error(l(299));
    var a = !1, r = "", o = Zm, c = Qm, v = Fm, x = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (r = e.identifierPrefix), e.onUncaughtError !== void 0 && (o = e.onUncaughtError), e.onCaughtError !== void 0 && (c = e.onCaughtError), e.onRecoverableError !== void 0 && (v = e.onRecoverableError), e.unstable_transitionCallbacks !== void 0 && (x = e.unstable_transitionCallbacks)), e = xg(
      t,
      1,
      !1,
      null,
      null,
      a,
      r,
      o,
      c,
      v,
      x,
      null
    ), t[aa] = e.current, Ec(
      t.nodeType === 8 ? t.parentNode : t
    ), new qc(e);
  }, or.hydrateRoot = function(t, e, a) {
    if (!u(t)) throw Error(l(299));
    var r = !1, o = "", c = Zm, v = Qm, x = Fm, E = null, N = null;
    return a != null && (a.unstable_strictMode === !0 && (r = !0), a.identifierPrefix !== void 0 && (o = a.identifierPrefix), a.onUncaughtError !== void 0 && (c = a.onUncaughtError), a.onCaughtError !== void 0 && (v = a.onCaughtError), a.onRecoverableError !== void 0 && (x = a.onRecoverableError), a.unstable_transitionCallbacks !== void 0 && (E = a.unstable_transitionCallbacks), a.formState !== void 0 && (N = a.formState)), e = xg(
      t,
      1,
      !0,
      e,
      a ?? null,
      r,
      o,
      c,
      v,
      x,
      E,
      N
    ), e.context = Sg(null), a = e.current, r = De(), o = Fn(r), o.callback = null, Wn(a, o, r), e.current.lanes = r, ds(e, r), an(e), t[aa] = e.current, Ec(t), new kl(e);
  }, or.version = "19.0.0", or;
}
var Hg;
function xT() {
  if (Hg) return Yc.exports;
  Hg = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), Yc.exports = bT(), Yc.exports;
}
var gr = xT(), jn = Ly();
const ST = /* @__PURE__ */ Vy(jn);
var A = Wf();
const TT = /* @__PURE__ */ Vy(A), AT = /* @__PURE__ */ dT({
  __proto__: null,
  default: TT
}, [A]);
function ye(n, i, { checkForDefaultPrevented: s = !0 } = {}) {
  return function(u) {
    if (n == null || n(u), s === !1 || !u.defaultPrevented)
      return i == null ? void 0 : i(u);
  };
}
function Pg(n, i) {
  if (typeof n == "function")
    return n(i);
  n != null && (n.current = i);
}
function By(...n) {
  return (i) => {
    let s = !1;
    const l = n.map((u) => {
      const f = Pg(u, i);
      return !s && typeof f == "function" && (s = !0), f;
    });
    if (s)
      return () => {
        for (let u = 0; u < l.length; u++) {
          const f = l[u];
          typeof f == "function" ? f() : Pg(n[u], null);
        }
      };
  };
}
function We(...n) {
  return A.useCallback(By(...n), n);
}
function wT(n, i) {
  const s = A.createContext(i), l = (f) => {
    const { children: d, ...h } = f, m = A.useMemo(() => h, Object.values(h));
    return /* @__PURE__ */ S.jsx(s.Provider, { value: m, children: d });
  };
  l.displayName = n + "Provider";
  function u(f) {
    const d = A.useContext(s);
    if (d) return d;
    if (i !== void 0) return i;
    throw new Error(`\`${f}\` must be used within \`${n}\``);
  }
  return [l, u];
}
function $f(n, i = []) {
  let s = [];
  function l(f, d) {
    const h = A.createContext(d), m = s.length;
    s = [...s, d];
    const p = (y) => {
      var O;
      const { scope: b, children: T, ...R } = y, w = ((O = b == null ? void 0 : b[n]) == null ? void 0 : O[m]) || h, M = A.useMemo(() => R, Object.values(R));
      return /* @__PURE__ */ S.jsx(w.Provider, { value: M, children: T });
    };
    p.displayName = f + "Provider";
    function g(y, b) {
      var w;
      const T = ((w = b == null ? void 0 : b[n]) == null ? void 0 : w[m]) || h, R = A.useContext(T);
      if (R) return R;
      if (d !== void 0) return d;
      throw new Error(`\`${y}\` must be used within \`${f}\``);
    }
    return [p, g];
  }
  const u = () => {
    const f = s.map((d) => A.createContext(d));
    return function(h) {
      const m = (h == null ? void 0 : h[n]) || f;
      return A.useMemo(
        () => ({ [`__scope${n}`]: { ...h, [n]: m } }),
        [h, m]
      );
    };
  };
  return u.scopeName = n, [l, ET(u, ...i)];
}
function ET(...n) {
  const i = n[0];
  if (n.length === 1) return i;
  const s = () => {
    const l = n.map((u) => ({
      useScope: u(),
      scopeName: u.scopeName
    }));
    return function(f) {
      const d = l.reduce((h, { useScope: m, scopeName: p }) => {
        const y = m(f)[`__scope${p}`];
        return { ...h, ...y };
      }, {});
      return A.useMemo(() => ({ [`__scope${i.scopeName}`]: d }), [d]);
    };
  };
  return s.scopeName = i.scopeName, s;
}
var xo = A.forwardRef((n, i) => {
  const { children: s, ...l } = n, u = A.Children.toArray(s), f = u.find(RT);
  if (f) {
    const d = f.props.children, h = u.map((m) => m === f ? A.Children.count(d) > 1 ? A.Children.only(null) : A.isValidElement(d) ? d.props.children : null : m);
    return /* @__PURE__ */ S.jsx(xf, { ...l, ref: i, children: A.isValidElement(d) ? A.cloneElement(d, void 0, h) : null });
  }
  return /* @__PURE__ */ S.jsx(xf, { ...l, ref: i, children: s });
});
xo.displayName = "Slot";
var xf = A.forwardRef((n, i) => {
  const { children: s, ...l } = n;
  if (A.isValidElement(s)) {
    const u = MT(s), f = CT(l, s.props);
    return s.type !== A.Fragment && (f.ref = i ? By(i, u) : u), A.cloneElement(s, f);
  }
  return A.Children.count(s) > 1 ? A.Children.only(null) : null;
});
xf.displayName = "SlotClone";
var Uy = ({ children: n }) => /* @__PURE__ */ S.jsx(S.Fragment, { children: n });
function RT(n) {
  return A.isValidElement(n) && n.type === Uy;
}
function CT(n, i) {
  const s = { ...i };
  for (const l in i) {
    const u = n[l], f = i[l];
    /^on[A-Z]/.test(l) ? u && f ? s[l] = (...h) => {
      f(...h), u(...h);
    } : u && (s[l] = u) : l === "style" ? s[l] = { ...u, ...f } : l === "className" && (s[l] = [u, f].filter(Boolean).join(" "));
  }
  return { ...n, ...s };
}
function MT(n) {
  var l, u;
  let i = (l = Object.getOwnPropertyDescriptor(n.props, "ref")) == null ? void 0 : l.get, s = i && "isReactWarning" in i && i.isReactWarning;
  return s ? n.ref : (i = (u = Object.getOwnPropertyDescriptor(n, "ref")) == null ? void 0 : u.get, s = i && "isReactWarning" in i && i.isReactWarning, s ? n.props.ref : n.props.ref || n.ref);
}
var DT = [
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
], Se = DT.reduce((n, i) => {
  const s = A.forwardRef((l, u) => {
    const { asChild: f, ...d } = l, h = f ? xo : i;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ S.jsx(h, { ...d, ref: u });
  });
  return s.displayName = `Primitive.${i}`, { ...n, [i]: s };
}, {});
function OT(n, i) {
  n && jn.flushSync(() => n.dispatchEvent(i));
}
function fi(n) {
  const i = A.useRef(n);
  return A.useEffect(() => {
    i.current = n;
  }), A.useMemo(() => (...s) => {
    var l;
    return (l = i.current) == null ? void 0 : l.call(i, ...s);
  }, []);
}
function NT(n, i = globalThis == null ? void 0 : globalThis.document) {
  const s = fi(n);
  A.useEffect(() => {
    const l = (u) => {
      u.key === "Escape" && s(u);
    };
    return i.addEventListener("keydown", l, { capture: !0 }), () => i.removeEventListener("keydown", l, { capture: !0 });
  }, [s, i]);
}
var jT = "DismissableLayer", Sf = "dismissableLayer.update", _T = "dismissableLayer.pointerDownOutside", zT = "dismissableLayer.focusOutside", qg, ky = A.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Jf = A.forwardRef(
  (n, i) => {
    const {
      disableOutsidePointerEvents: s = !1,
      onEscapeKeyDown: l,
      onPointerDownOutside: u,
      onFocusOutside: f,
      onInteractOutside: d,
      onDismiss: h,
      ...m
    } = n, p = A.useContext(ky), [g, y] = A.useState(null), b = (g == null ? void 0 : g.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, T] = A.useState({}), R = We(i, (Z) => y(Z)), w = Array.from(p.layers), [M] = [...p.layersWithOutsidePointerEventsDisabled].slice(-1), O = w.indexOf(M), z = g ? w.indexOf(g) : -1, U = p.layersWithOutsidePointerEventsDisabled.size > 0, q = z >= O, V = BT((Z) => {
      const F = Z.target, Q = [...p.branches].some((W) => W.contains(F));
      !q || Q || (u == null || u(Z), d == null || d(Z), Z.defaultPrevented || h == null || h());
    }, b), L = UT((Z) => {
      const F = Z.target;
      [...p.branches].some((W) => W.contains(F)) || (f == null || f(Z), d == null || d(Z), Z.defaultPrevented || h == null || h());
    }, b);
    return NT((Z) => {
      z === p.layers.size - 1 && (l == null || l(Z), !Z.defaultPrevented && h && (Z.preventDefault(), h()));
    }, b), A.useEffect(() => {
      if (g)
        return s && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (qg = b.body.style.pointerEvents, b.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(g)), p.layers.add(g), Gg(), () => {
          s && p.layersWithOutsidePointerEventsDisabled.size === 1 && (b.body.style.pointerEvents = qg);
        };
    }, [g, b, s, p]), A.useEffect(() => () => {
      g && (p.layers.delete(g), p.layersWithOutsidePointerEventsDisabled.delete(g), Gg());
    }, [g, p]), A.useEffect(() => {
      const Z = () => T({});
      return document.addEventListener(Sf, Z), () => document.removeEventListener(Sf, Z);
    }, []), /* @__PURE__ */ S.jsx(
      Se.div,
      {
        ...m,
        ref: R,
        style: {
          pointerEvents: U ? q ? "auto" : "none" : void 0,
          ...n.style
        },
        onFocusCapture: ye(n.onFocusCapture, L.onFocusCapture),
        onBlurCapture: ye(n.onBlurCapture, L.onBlurCapture),
        onPointerDownCapture: ye(
          n.onPointerDownCapture,
          V.onPointerDownCapture
        )
      }
    );
  }
);
Jf.displayName = jT;
var VT = "DismissableLayerBranch", LT = A.forwardRef((n, i) => {
  const s = A.useContext(ky), l = A.useRef(null), u = We(i, l);
  return A.useEffect(() => {
    const f = l.current;
    if (f)
      return s.branches.add(f), () => {
        s.branches.delete(f);
      };
  }, [s.branches]), /* @__PURE__ */ S.jsx(Se.div, { ...n, ref: u });
});
LT.displayName = VT;
function BT(n, i = globalThis == null ? void 0 : globalThis.document) {
  const s = fi(n), l = A.useRef(!1), u = A.useRef(() => {
  });
  return A.useEffect(() => {
    const f = (h) => {
      if (h.target && !l.current) {
        let m = function() {
          Hy(
            _T,
            s,
            p,
            { discrete: !0 }
          );
        };
        const p = { originalEvent: h };
        h.pointerType === "touch" ? (i.removeEventListener("click", u.current), u.current = m, i.addEventListener("click", u.current, { once: !0 })) : m();
      } else
        i.removeEventListener("click", u.current);
      l.current = !1;
    }, d = window.setTimeout(() => {
      i.addEventListener("pointerdown", f);
    }, 0);
    return () => {
      window.clearTimeout(d), i.removeEventListener("pointerdown", f), i.removeEventListener("click", u.current);
    };
  }, [i, s]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => l.current = !0
  };
}
function UT(n, i = globalThis == null ? void 0 : globalThis.document) {
  const s = fi(n), l = A.useRef(!1);
  return A.useEffect(() => {
    const u = (f) => {
      f.target && !l.current && Hy(zT, s, { originalEvent: f }, {
        discrete: !1
      });
    };
    return i.addEventListener("focusin", u), () => i.removeEventListener("focusin", u);
  }, [i, s]), {
    onFocusCapture: () => l.current = !0,
    onBlurCapture: () => l.current = !1
  };
}
function Gg() {
  const n = new CustomEvent(Sf);
  document.dispatchEvent(n);
}
function Hy(n, i, s, { discrete: l }) {
  const u = s.originalEvent.target, f = new CustomEvent(n, { bubbles: !1, cancelable: !0, detail: s });
  i && u.addEventListener(n, i, { once: !0 }), l ? OT(u, f) : u.dispatchEvent(f);
}
var $i = globalThis != null && globalThis.document ? A.useLayoutEffect : () => {
}, kT = AT.useId || (() => {
}), HT = 0;
function $l(n) {
  const [i, s] = A.useState(kT());
  return $i(() => {
    s((l) => l ?? String(HT++));
  }, [n]), i ? `radix-${i}` : "";
}
const PT = ["top", "right", "bottom", "left"], di = Math.min, Mn = Math.max, so = Math.round, Pl = Math.floor, Dn = (n) => ({
  x: n,
  y: n
}), qT = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Py(n, i, s) {
  return Mn(n, di(i, s));
}
function _n(n, i) {
  return typeof n == "function" ? n(i) : n;
}
function hi(n) {
  return n.split("-")[0];
}
function ns(n) {
  return n.split("-")[1];
}
function If(n) {
  return n === "x" ? "y" : "x";
}
function td(n) {
  return n === "y" ? "height" : "width";
}
function rn(n) {
  const i = n[0];
  return i === "t" || i === "b" ? "y" : "x";
}
function ed(n) {
  return If(rn(n));
}
function GT(n, i, s) {
  s === void 0 && (s = !1);
  const l = ns(n), u = ed(n), f = td(u);
  let d = u === "x" ? l === (s ? "end" : "start") ? "right" : "left" : l === "start" ? "bottom" : "top";
  return i.reference[f] > i.floating[f] && (d = ro(d)), [d, ro(d)];
}
function YT(n) {
  const i = ro(n);
  return [Tf(n), i, Tf(i)];
}
function Tf(n) {
  return n.includes("start") ? n.replace("start", "end") : n.replace("end", "start");
}
const Yg = ["left", "right"], Xg = ["right", "left"], XT = ["top", "bottom"], KT = ["bottom", "top"];
function ZT(n, i, s) {
  switch (n) {
    case "top":
    case "bottom":
      return s ? i ? Xg : Yg : i ? Yg : Xg;
    case "left":
    case "right":
      return i ? XT : KT;
    default:
      return [];
  }
}
function QT(n, i, s, l) {
  const u = ns(n);
  let f = ZT(hi(n), s === "start", l);
  return u && (f = f.map((d) => d + "-" + u), i && (f = f.concat(f.map(Tf)))), f;
}
function ro(n) {
  const i = hi(n);
  return qT[i] + n.slice(i.length);
}
function FT(n) {
  var i, s, l, u;
  return {
    top: (i = n.top) != null ? i : 0,
    right: (s = n.right) != null ? s : 0,
    bottom: (l = n.bottom) != null ? l : 0,
    left: (u = n.left) != null ? u : 0
  };
}
function qy(n) {
  return typeof n != "number" ? FT(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function lo(n) {
  const {
    x: i,
    y: s,
    width: l,
    height: u
  } = n;
  return {
    width: l,
    height: u,
    top: s,
    left: i,
    right: i + l,
    bottom: s + u,
    x: i,
    y: s
  };
}
function Kg(n, i, s) {
  let {
    reference: l,
    floating: u
  } = n;
  const f = rn(i), d = ed(i), h = td(d), m = hi(i), p = f === "y", g = l.x + l.width / 2 - u.width / 2, y = l.y + l.height / 2 - u.height / 2, b = l[h] / 2 - u[h] / 2;
  let T;
  switch (m) {
    case "top":
      T = {
        x: g,
        y: l.y - u.height
      };
      break;
    case "bottom":
      T = {
        x: g,
        y: l.y + l.height
      };
      break;
    case "right":
      T = {
        x: l.x + l.width,
        y
      };
      break;
    case "left":
      T = {
        x: l.x - u.width,
        y
      };
      break;
    default:
      T = {
        x: l.x,
        y: l.y
      };
  }
  const R = ns(i);
  return R && (T[d] += b * (R === "end" ? 1 : -1) * (s && p ? -1 : 1)), T;
}
async function WT(n, i) {
  var s;
  i === void 0 && (i = {});
  const {
    x: l,
    y: u,
    platform: f,
    rects: d,
    elements: h,
    strategy: m
  } = n, {
    boundary: p = "clippingAncestors",
    rootBoundary: g = "viewport",
    elementContext: y = "floating",
    altBoundary: b = !1,
    padding: T = 0
  } = _n(i, n), R = qy(T), M = h[b ? y === "floating" ? "reference" : "floating" : y], O = lo(await f.getClippingRect({
    element: (s = await (f.isElement == null ? void 0 : f.isElement(M))) == null || s ? M : M.contextElement || await (f.getDocumentElement == null ? void 0 : f.getDocumentElement(h.floating)),
    boundary: p,
    rootBoundary: g,
    strategy: m
  })), z = y === "floating" ? {
    x: l,
    y: u,
    width: d.floating.width,
    height: d.floating.height
  } : d.reference, U = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(h.floating)), q = await (f.isElement == null ? void 0 : f.isElement(U)) && await (f.getScale == null ? void 0 : f.getScale(U)) || {
    x: 1,
    y: 1
  }, V = lo(f.convertOffsetParentRelativeRectToViewportRelativeRect ? await f.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: h,
    rect: z,
    offsetParent: U,
    strategy: m
  }) : z);
  return {
    top: (O.top - V.top + R.top) / q.y,
    bottom: (V.bottom - O.bottom + R.bottom) / q.y,
    left: (O.left - V.left + R.left) / q.x,
    right: (V.right - O.right + R.right) / q.x
  };
}
const $T = 50, JT = async (n, i, s) => {
  const {
    placement: l = "bottom",
    strategy: u = "absolute",
    middleware: f = [],
    platform: d
  } = s, h = d.detectOverflow ? d : {
    ...d,
    detectOverflow: WT
  }, m = await (d.isRTL == null ? void 0 : d.isRTL(i));
  let p = await d.getElementRects({
    reference: n,
    floating: i,
    strategy: u
  }), {
    x: g,
    y
  } = Kg(p, l, m), b = l, T = 0;
  const R = {};
  for (let w = 0; w < f.length; w++) {
    const M = f[w];
    if (!M)
      continue;
    const {
      name: O,
      fn: z
    } = M, {
      x: U,
      y: q,
      data: V,
      reset: L
    } = await z({
      x: g,
      y,
      initialPlacement: l,
      placement: b,
      strategy: u,
      middlewareData: R,
      rects: p,
      platform: h,
      elements: {
        reference: n,
        floating: i
      }
    });
    g = U ?? g, y = q ?? y, R[O] = {
      ...R[O],
      ...V
    }, L && T < $T && (T++, typeof L == "object" && (L.placement && (b = L.placement), L.rects && (p = L.rects === !0 ? await d.getElementRects({
      reference: n,
      floating: i,
      strategy: u
    }) : L.rects), {
      x: g,
      y
    } = Kg(p, b, m)), w = -1);
  }
  return {
    x: g,
    y,
    placement: b,
    strategy: u,
    middlewareData: R
  };
}, IT = (n) => ({
  name: "arrow",
  options: n,
  async fn(i) {
    const {
      x: s,
      y: l,
      placement: u,
      rects: f,
      platform: d,
      elements: h,
      middlewareData: m
    } = i, {
      element: p,
      padding: g = 0
    } = _n(n, i) || {};
    if (p == null)
      return {};
    const y = qy(g), b = {
      x: s,
      y: l
    }, T = ed(u), R = td(T), w = await d.getDimensions(p), M = T === "y", O = M ? "top" : "left", z = M ? "bottom" : "right", U = M ? "clientHeight" : "clientWidth", q = f.reference[R] + f.reference[T] - b[T] - f.floating[R], V = b[T] - f.reference[T], L = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(p));
    let Z = L ? L[U] : 0;
    (!Z || !await (d.isElement == null ? void 0 : d.isElement(L))) && (Z = h.floating[U] || f.floating[R]);
    const F = q / 2 - V / 2, Q = Z / 2 - w[R] / 2 - 1, W = di(y[O], Q), mt = di(y[z], Q), Rt = Z - w[R] - mt, ft = Z / 2 - w[R] / 2 + F, pt = Py(W, ft, Rt), yt = !m.arrow && ns(u) != null && ft !== pt && f.reference[R] / 2 - (ft < W ? W : mt) - w[R] / 2 < 0, P = yt ? ft < W ? ft - W : ft - Rt : 0;
    return {
      [T]: b[T] + P,
      data: {
        [T]: pt,
        centerOffset: ft - pt - P,
        ...yt && {
          alignmentOffset: P
        }
      },
      reset: yt
    };
  }
}), tA = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(i) {
      var s, l;
      const {
        placement: u,
        middlewareData: f,
        rects: d,
        initialPlacement: h,
        platform: m,
        elements: p
      } = i, {
        mainAxis: g = !0,
        crossAxis: y = !0,
        fallbackPlacements: b,
        fallbackStrategy: T = "bestFit",
        fallbackAxisSideDirection: R = "none",
        flipAlignment: w = !0,
        ...M
      } = _n(n, i);
      if ((s = f.arrow) != null && s.alignmentOffset)
        return {};
      const O = hi(u), z = rn(h), U = hi(h) === h, q = await (m.isRTL == null ? void 0 : m.isRTL(p.floating)), V = b || (U || !w ? [ro(h)] : YT(h)), L = R !== "none";
      !b && L && V.push(...QT(h, w, R, q));
      const Z = [h, ...V], F = await m.detectOverflow(i, M), Q = [];
      let W = ((l = f.flip) == null ? void 0 : l.overflows) || [];
      if (g && Q.push(F[O]), y) {
        const pt = GT(u, d, q);
        Q.push(F[pt[0]], F[pt[1]]);
      }
      if (W = [...W, {
        placement: u,
        overflows: Q
      }], !Q.every((pt) => pt <= 0)) {
        var mt, Rt;
        const pt = (((mt = f.flip) == null ? void 0 : mt.index) || 0) + 1, yt = Z[pt];
        if (yt && (!(y === "alignment" ? z !== rn(yt) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        W.every((Y) => rn(Y.placement) === z ? Y.overflows[0] > 0 : !0)))
          return {
            data: {
              index: pt,
              overflows: W
            },
            reset: {
              placement: yt
            }
          };
        let P = (Rt = W.filter(($) => $.overflows[0] <= 0).sort(($, Y) => $.overflows[1] - Y.overflows[1])[0]) == null ? void 0 : Rt.placement;
        if (!P)
          switch (T) {
            case "bestFit": {
              var ft;
              const $ = (ft = W.filter((Y) => {
                if (L) {
                  const nt = rn(Y.placement);
                  return nt === z || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  nt === "y";
                }
                return !0;
              }).map((Y) => [Y.placement, Y.overflows.filter((nt) => nt > 0).reduce((nt, C) => nt + C, 0)]).sort((Y, nt) => Y[1] - nt[1])[0]) == null ? void 0 : ft[0];
              $ && (P = $);
              break;
            }
            case "initialPlacement":
              P = h;
              break;
          }
        if (u !== P)
          return {
            reset: {
              placement: P
            }
          };
      }
      return {};
    }
  };
};
function Zg(n, i) {
  return {
    top: n.top - i.height,
    right: n.right - i.width,
    bottom: n.bottom - i.height,
    left: n.left - i.width
  };
}
function Qg(n) {
  return PT.some((i) => n[i] >= 0);
}
const eA = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(i) {
      const {
        rects: s,
        platform: l
      } = i, {
        strategy: u = "referenceHidden",
        ...f
      } = _n(n, i);
      switch (u) {
        case "referenceHidden": {
          const d = await l.detectOverflow(i, {
            ...f,
            elementContext: "reference"
          }), h = Zg(d, s.reference);
          return {
            data: {
              referenceHiddenOffsets: h,
              referenceHidden: Qg(h)
            }
          };
        }
        case "escaped": {
          const d = await l.detectOverflow(i, {
            ...f,
            altBoundary: !0
          }), h = Zg(d, s.floating);
          return {
            data: {
              escapedOffsets: h,
              escaped: Qg(h)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Gy = /* @__PURE__ */ new Set(["left", "top"]);
async function nA(n, i) {
  const {
    placement: s,
    platform: l,
    elements: u
  } = n, f = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), d = hi(s), h = ns(s), m = rn(s) === "y", p = Gy.has(d) ? -1 : 1, g = f && m ? -1 : 1, y = _n(i, n);
  let {
    mainAxis: b,
    crossAxis: T,
    alignmentAxis: R
  } = typeof y == "number" ? {
    mainAxis: y,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: y.mainAxis || 0,
    crossAxis: y.crossAxis || 0,
    alignmentAxis: y.alignmentAxis
  };
  return h && typeof R == "number" && (T = h === "end" ? R * -1 : R), m ? {
    x: T * g,
    y: b * p
  } : {
    x: b * p,
    y: T * g
  };
}
const iA = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(i) {
      var s, l;
      const {
        x: u,
        y: f,
        placement: d,
        middlewareData: h
      } = i, m = await nA(i, n);
      return d === ((s = h.offset) == null ? void 0 : s.placement) && (l = h.arrow) != null && l.alignmentOffset ? {} : {
        x: u + m.x,
        y: f + m.y,
        data: {
          ...m,
          placement: d
        }
      };
    }
  };
}, aA = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(i) {
      const {
        x: s,
        y: l,
        placement: u,
        platform: f
      } = i, {
        mainAxis: d = !0,
        crossAxis: h = !1,
        limiter: m = {
          fn: (z) => {
            let {
              x: U,
              y: q
            } = z;
            return {
              x: U,
              y: q
            };
          }
        },
        ...p
      } = _n(n, i), g = {
        x: s,
        y: l
      }, y = await f.detectOverflow(i, p), b = rn(u), T = If(b);
      let R = g[T], w = g[b];
      const M = (z, U) => Py(U + y[z === "y" ? "top" : "left"], U, U - y[z === "y" ? "bottom" : "right"]);
      d && (R = M(T, R)), h && (w = M(b, w));
      const O = m.fn({
        ...i,
        [T]: R,
        [b]: w
      });
      return {
        ...O,
        data: {
          x: O.x - s,
          y: O.y - l,
          enabled: {
            [T]: d,
            [b]: h
          }
        }
      };
    }
  };
}, sA = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(i) {
      var s, l;
      const {
        x: u,
        y: f,
        placement: d,
        rects: h,
        middlewareData: m
      } = i, {
        offset: p = 0,
        mainAxis: g = !0,
        crossAxis: y = !0
      } = _n(n, i), b = {
        x: u,
        y: f
      }, T = rn(d), R = If(T);
      let w = b[R], M = b[T];
      const O = _n(p, i), z = typeof O == "number" ? {
        mainAxis: O,
        crossAxis: 0
      } : {
        mainAxis: (s = O.mainAxis) != null ? s : 0,
        crossAxis: (l = O.crossAxis) != null ? l : 0
      };
      if (g) {
        const V = R === "y" ? "height" : "width", L = h.reference[R] - h.floating[V] + z.mainAxis, Z = h.reference[R] + h.reference[V] - z.mainAxis;
        w < L ? w = L : w > Z && (w = Z);
      }
      if (y) {
        var U, q;
        const V = R === "y" ? "width" : "height", L = Gy.has(hi(d)), Z = h.reference[T] - h.floating[V] + (L && ((U = m.offset) == null ? void 0 : U[T]) || 0) + (L ? 0 : z.crossAxis), F = h.reference[T] + h.reference[V] + (L ? 0 : ((q = m.offset) == null ? void 0 : q[T]) || 0) - (L ? z.crossAxis : 0);
        M < Z ? M = Z : M > F && (M = F);
      }
      return {
        [R]: w,
        [T]: M
      };
    }
  };
}, rA = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(i) {
      const {
        placement: s,
        rects: l,
        platform: u,
        elements: f
      } = i, {
        apply: d = () => {
        },
        ...h
      } = _n(n, i), m = await u.detectOverflow(i, h), p = hi(s), g = ns(s), y = rn(s) === "y", {
        width: b,
        height: T
      } = l.floating;
      let R, w;
      p === "top" || p === "bottom" ? (R = p, w = g === (await (u.isRTL == null ? void 0 : u.isRTL(f.floating)) ? "start" : "end") ? "left" : "right") : (w = p, R = g === "end" ? "top" : "bottom");
      const M = T - m.top - m.bottom, O = b - m.left - m.right, z = di(T - m[R], M), U = di(b - m[w], O), q = i.middlewareData.shift, V = !q;
      let L = z, Z = U;
      q != null && q.enabled.x && (Z = O), q != null && q.enabled.y && (L = M), V && !g && (y ? Z = b - 2 * Mn(m.left, m.right) : L = T - 2 * Mn(m.top, m.bottom)), await d({
        ...i,
        availableWidth: Z,
        availableHeight: L
      });
      const F = await u.getDimensions(f.floating);
      return b !== F.width || T !== F.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function So() {
  return typeof window < "u";
}
function is(n) {
  return Yy(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function be(n) {
  var i;
  return (n == null || (i = n.ownerDocument) == null ? void 0 : i.defaultView) || window;
}
function Vn(n) {
  var i;
  return (i = (Yy(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : i.documentElement;
}
function Yy(n) {
  return So() ? n instanceof Node || n instanceof be(n).Node : !1;
}
function un(n) {
  return So() ? n instanceof Element || n instanceof be(n).Element : !1;
}
function gi(n) {
  return So() ? n instanceof HTMLElement || n instanceof be(n).HTMLElement : !1;
}
function Fg(n) {
  return !So() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof be(n).ShadowRoot;
}
function To(n) {
  const {
    overflow: i,
    overflowX: s,
    overflowY: l,
    display: u
  } = cn(n);
  return /auto|scroll|overlay|hidden|clip/.test(i + l + s) && u !== "inline" && u !== "contents";
}
function lA(n) {
  return /^(table|td|th)$/.test(is(n));
}
function Ao(n) {
  try {
    if (n.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return n.matches(":modal");
  } catch {
    return !1;
  }
}
const oA = /transform|translate|scale|rotate|perspective|filter/, uA = /paint|layout|strict|content/, Pi = (n) => !!n && n !== "none";
let Fc;
function nd(n) {
  const i = un(n) ? cn(n) : n;
  return Pi(i.transform) || Pi(i.translate) || Pi(i.scale) || Pi(i.rotate) || Pi(i.perspective) || !id() && (Pi(i.backdropFilter) || Pi(i.filter)) || oA.test(i.willChange || "") || uA.test(i.contain || "");
}
function cA(n) {
  let i = Ji(n);
  for (; gi(i) && !vr(i); ) {
    if (nd(i))
      return i;
    if (Ao(i))
      return null;
    i = Ji(i);
  }
  return null;
}
function id() {
  return Fc == null && (Fc = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Fc;
}
function vr(n) {
  return /^(html|body|#document)$/.test(is(n));
}
function cn(n) {
  return be(n).getComputedStyle(n);
}
function wo(n) {
  return un(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Ji(n) {
  if (is(n) === "html")
    return n;
  const i = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Fg(n) && n.host || // Fallback.
    Vn(n)
  );
  return Fg(i) ? i.host : i;
}
function Xy(n) {
  const i = Ji(n);
  return vr(i) ? (n.ownerDocument || n).body : gi(i) && To(i) ? i : Xy(i);
}
function yr(n, i, s) {
  var l;
  i === void 0 && (i = []), s === void 0 && (s = !0);
  const u = Xy(n), f = u === ((l = n.ownerDocument) == null ? void 0 : l.body), d = be(u);
  if (f) {
    const h = Af(d);
    return i.concat(d, d.visualViewport || [], To(u) ? u : [], h && s ? yr(h) : []);
  } else
    return i.concat(u, yr(u, [], s));
}
function Af(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Ky(n) {
  const i = cn(n);
  let s = parseFloat(i.width) || 0, l = parseFloat(i.height) || 0;
  const u = gi(n), f = u ? n.offsetWidth : s, d = u ? n.offsetHeight : l, h = so(s) !== f || so(l) !== d;
  return h && (s = f, l = d), {
    width: s,
    height: l,
    $: h
  };
}
function ad(n) {
  return un(n) ? n : n.contextElement;
}
function Fa(n) {
  const i = ad(n);
  if (!gi(i))
    return Dn(1);
  const s = i.getBoundingClientRect(), {
    width: l,
    height: u,
    $: f
  } = Ky(i);
  let d = (f ? so(s.width) : s.width) / l, h = (f ? so(s.height) : s.height) / u;
  return (!d || !Number.isFinite(d)) && (d = 1), (!h || !Number.isFinite(h)) && (h = 1), {
    x: d,
    y: h
  };
}
const fA = /* @__PURE__ */ Dn(0);
function Zy(n) {
  const i = be(n);
  return !id() || !i.visualViewport ? fA : {
    x: i.visualViewport.offsetLeft,
    y: i.visualViewport.offsetTop
  };
}
function dA(n, i, s) {
  return i === void 0 && (i = !1), !!s && i && s === be(n);
}
function Ii(n, i, s, l) {
  i === void 0 && (i = !1), s === void 0 && (s = !1);
  const u = n.getBoundingClientRect(), f = ad(n);
  let d = Dn(1);
  i && (l ? un(l) && (d = Fa(l)) : d = Fa(n));
  const h = dA(f, s, l) ? Zy(f) : Dn(0);
  let m = (u.left + h.x) / d.x, p = (u.top + h.y) / d.y, g = u.width / d.x, y = u.height / d.y;
  if (f && l) {
    const b = be(f), T = un(l) ? be(l) : l;
    let R = b, w = Af(R);
    for (; w && T !== R; ) {
      const M = Fa(w), O = w.getBoundingClientRect(), z = cn(w), U = O.left + (w.clientLeft + parseFloat(z.paddingLeft)) * M.x, q = O.top + (w.clientTop + parseFloat(z.paddingTop)) * M.y;
      m *= M.x, p *= M.y, g *= M.x, y *= M.y, m += U, p += q, R = be(w), w = Af(R);
    }
  }
  return lo({
    width: g,
    height: y,
    x: m,
    y: p
  });
}
function Eo(n, i) {
  const s = wo(n).scrollLeft;
  return i ? i.left + s : Ii(Vn(n)).left + s;
}
function Qy(n, i) {
  const s = n.getBoundingClientRect(), l = s.left + i.scrollLeft - Eo(n, s), u = s.top + i.scrollTop;
  return {
    x: l,
    y: u
  };
}
function hA(n) {
  let {
    elements: i,
    rect: s,
    offsetParent: l,
    strategy: u
  } = n;
  const f = u === "fixed", d = Vn(l), h = i ? Ao(i.floating) : !1;
  if (l === d || h && f)
    return s;
  let m = {
    scrollLeft: 0,
    scrollTop: 0
  }, p = Dn(1);
  const g = Dn(0), y = gi(l);
  if ((y || !f) && ((is(l) !== "body" || To(d)) && (m = wo(l)), y)) {
    const T = Ii(l);
    p = Fa(l), g.x = T.x + l.clientLeft, g.y = T.y + l.clientTop;
  }
  const b = d && !y && !f ? Qy(d, m) : Dn(0);
  return {
    width: s.width * p.x,
    height: s.height * p.y,
    x: s.x * p.x - m.scrollLeft * p.x + g.x + b.x,
    y: s.y * p.y - m.scrollTop * p.y + g.y + b.y
  };
}
function mA(n) {
  return n.getClientRects ? Array.from(n.getClientRects()) : [];
}
function pA(n) {
  const i = wo(n), s = n.ownerDocument.body, l = Mn(n.scrollWidth, n.clientWidth, s.scrollWidth, s.clientWidth), u = Mn(n.scrollHeight, n.clientHeight, s.scrollHeight, s.clientHeight);
  let f = -i.scrollLeft + Eo(n);
  const d = -i.scrollTop;
  return cn(s).direction === "rtl" && (f += Mn(n.clientWidth, s.clientWidth) - l), {
    width: l,
    height: u,
    x: f,
    y: d
  };
}
const gA = 25;
function vA(n, i, s) {
  s === void 0 && (s = "viewport");
  const l = s === "layoutViewport", u = be(n), f = Vn(n), d = u.visualViewport;
  let h = f.clientWidth, m = f.clientHeight, p = 0, g = 0;
  if (d) {
    const b = !id() || i === "fixed";
    l ? b || (p = -d.offsetLeft, g = -d.offsetTop) : (h = d.width, m = d.height, b && (p = d.offsetLeft, g = d.offsetTop));
  }
  if (Eo(f) <= 0) {
    const b = f.ownerDocument, T = b.body, R = getComputedStyle(T), w = b.compatMode === "CSS1Compat" && parseFloat(R.marginLeft) + parseFloat(R.marginRight) || 0, M = Math.abs(f.clientWidth - T.clientWidth - w), O = getComputedStyle(f).scrollbarGutter === "stable both-edges" ? M / 2 : M;
    O <= gA && (h -= O);
  }
  return {
    width: h,
    height: m,
    x: p,
    y: g
  };
}
function yA(n, i) {
  const s = Ii(n, !0, i === "fixed"), l = s.top + n.clientTop, u = s.left + n.clientLeft, f = Fa(n), d = n.clientWidth * f.x, h = n.clientHeight * f.y, m = u * f.x, p = l * f.y;
  return {
    width: d,
    height: h,
    x: m,
    y: p
  };
}
function Wg(n, i, s) {
  let l;
  if (i === "viewport" || i === "layoutViewport")
    l = vA(n, s, i);
  else if (i === "document")
    l = pA(Vn(n));
  else if (un(i))
    l = yA(i, s);
  else {
    const u = Zy(n);
    l = {
      x: i.x - u.x,
      y: i.y - u.y,
      width: i.width,
      height: i.height
    };
  }
  return lo(l);
}
function bA(n, i) {
  const s = i.get(n);
  if (s)
    return s;
  let l = yr(n, [], !1).filter((h) => un(h) && is(h) !== "body"), u = null;
  const f = cn(n).position === "fixed";
  let d = f ? Ji(n) : n;
  for (; un(d) && !vr(d); ) {
    const h = cn(d), m = nd(d), p = u ? u.position : f ? "fixed" : "";
    !m && (p === "fixed" || p === "absolute" && h.position === "static") ? l = l.filter((y) => y !== d) : u = h, d = Ji(d);
  }
  return i.set(n, l), l;
}
function xA(n) {
  let {
    element: i,
    boundary: s,
    rootBoundary: l,
    strategy: u
  } = n;
  const d = [...s === "clippingAncestors" ? Ao(i) ? [] : bA(i, this._c) : [].concat(s), l], h = Wg(i, d[0], u);
  let m = h.top, p = h.right, g = h.bottom, y = h.left;
  for (let b = 1; b < d.length; b++) {
    const T = Wg(i, d[b], u);
    m = Mn(T.top, m), p = di(T.right, p), g = di(T.bottom, g), y = Mn(T.left, y);
  }
  return {
    width: p - y,
    height: g - m,
    x: y,
    y: m
  };
}
function SA(n) {
  const {
    width: i,
    height: s
  } = Ky(n);
  return {
    width: i,
    height: s
  };
}
function TA(n, i, s) {
  const l = gi(i), u = Vn(i), f = s === "fixed", d = Ii(n, !0, f, i);
  let h = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const m = Dn(0);
  if ((l || !f) && ((is(i) !== "body" || To(u)) && (h = wo(i)), l)) {
    const b = Ii(i, !0, f, i);
    m.x = b.x + i.clientLeft, m.y = b.y + i.clientTop;
  }
  !l && u && (m.x = Eo(u));
  const p = u && !l && !f ? Qy(u, h) : Dn(0), g = d.left + h.scrollLeft - m.x - p.x, y = d.top + h.scrollTop - m.y - p.y;
  return {
    x: g,
    y,
    width: d.width,
    height: d.height
  };
}
function Wc(n) {
  return cn(n).position === "static";
}
function $g(n, i) {
  if (!gi(n) || cn(n).position === "fixed")
    return null;
  if (i)
    return i(n);
  let s = n.offsetParent;
  return Vn(n) === s && (s = s.ownerDocument.body), s;
}
function Fy(n, i) {
  const s = be(n);
  if (Ao(n))
    return s;
  if (!gi(n)) {
    let u = Ji(n);
    for (; u && !vr(u); ) {
      if (un(u) && !Wc(u))
        return u;
      u = Ji(u);
    }
    return s;
  }
  let l = $g(n, i);
  for (; l && lA(l) && Wc(l); )
    l = $g(l, i);
  return l && vr(l) && Wc(l) && !nd(l) ? s : l || cA(n) || s;
}
const AA = async function(n) {
  const i = this.getOffsetParent || Fy, s = this.getDimensions, l = await s(n.floating);
  return {
    reference: TA(n.reference, await i(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: l.width,
      height: l.height
    }
  };
};
function wA(n) {
  return cn(n).direction === "rtl";
}
const EA = {
  convertOffsetParentRelativeRectToViewportRelativeRect: hA,
  getDocumentElement: Vn,
  getClippingRect: xA,
  getOffsetParent: Fy,
  getElementRects: AA,
  getClientRects: mA,
  getDimensions: SA,
  getScale: Fa,
  isElement: un,
  isRTL: wA
};
function Wy(n, i) {
  return n.x === i.x && n.y === i.y && n.width === i.width && n.height === i.height;
}
function RA(n, i, s) {
  let l = null, u;
  const f = Vn(n);
  function d() {
    var g;
    clearTimeout(u), (g = l) == null || g.disconnect(), l = null;
  }
  function h(g, y) {
    g === void 0 && (g = !1), y === void 0 && (y = 1), d();
    const b = n.getBoundingClientRect(), {
      left: T,
      top: R,
      width: w,
      height: M
    } = b;
    if (g || i(), !w || !M)
      return;
    const O = Pl(R), z = Pl(f.clientWidth - (T + w)), U = Pl(f.clientHeight - (R + M)), q = Pl(T), L = {
      rootMargin: -O + "px " + -z + "px " + -U + "px " + -q + "px",
      threshold: Mn(0, di(1, y)) || 1
    };
    let Z = !0;
    function F(Q) {
      const W = Q[0].intersectionRatio;
      if (!Wy(b, n.getBoundingClientRect()))
        return h();
      if (W !== y) {
        if (!Z)
          return h();
        W ? h(!1, W) : u = setTimeout(() => {
          h(!1, 1e-7);
        }, 1e3);
      }
      Z = !1;
    }
    try {
      l = new IntersectionObserver(F, {
        ...L,
        // Handle <iframe>s
        root: f.ownerDocument
      });
    } catch {
      l = new IntersectionObserver(F, L);
    }
    l.observe(n);
  }
  const m = be(n), p = () => h(s);
  return m.addEventListener("resize", p), h(!0), () => {
    m.removeEventListener("resize", p), d();
  };
}
function CA(n, i, s, l) {
  l === void 0 && (l = {});
  const {
    ancestorScroll: u = !0,
    ancestorResize: f = !0,
    elementResize: d = typeof ResizeObserver == "function",
    layoutShift: h = typeof IntersectionObserver == "function",
    animationFrame: m = !1
  } = l, p = ad(n), g = u || f ? [...p ? yr(p) : [], ...i ? yr(i) : []] : [];
  g.forEach((O) => {
    u && O.addEventListener("scroll", s), f && O.addEventListener("resize", s);
  });
  const y = p && h ? RA(p, s, f) : null;
  let b = -1, T = null;
  d && (T = new ResizeObserver((O) => {
    let [z] = O;
    z && z.target === p && T && i && (T.unobserve(i), cancelAnimationFrame(b), b = requestAnimationFrame(() => {
      var U;
      (U = T) == null || U.observe(i);
    })), s();
  }), p && !m && T.observe(p), i && T.observe(i));
  let R, w = m ? Ii(n) : null;
  m && M();
  function M() {
    const O = Ii(n);
    w && !Wy(w, O) && s(), w = O, R = requestAnimationFrame(M);
  }
  return s(), () => {
    var O;
    g.forEach((z) => {
      u && z.removeEventListener("scroll", s), f && z.removeEventListener("resize", s);
    }), y == null || y(), (O = T) == null || O.disconnect(), T = null, m && cancelAnimationFrame(R);
  };
}
const MA = iA, DA = aA, OA = tA, NA = rA, jA = eA, Jg = IT, _A = sA, zA = (n, i, s) => {
  const l = /* @__PURE__ */ new Map(), u = s ?? {}, f = {
    ...EA,
    ...u.platform,
    _c: l
  };
  return JT(n, i, {
    ...u,
    platform: f
  });
};
var VA = typeof document < "u", LA = function() {
}, Jl = VA ? A.useLayoutEffect : LA;
function oo(n, i) {
  if (n === i)
    return !0;
  if (typeof n != typeof i)
    return !1;
  if (typeof n == "function" && n.toString() === i.toString())
    return !0;
  let s, l, u;
  if (n && i && typeof n == "object") {
    if (Array.isArray(n)) {
      if (s = n.length, s !== i.length) return !1;
      for (l = s; l-- !== 0; )
        if (!oo(n[l], i[l]))
          return !1;
      return !0;
    }
    if (u = Object.keys(n), s = u.length, s !== Object.keys(i).length)
      return !1;
    for (l = s; l-- !== 0; )
      if (!{}.hasOwnProperty.call(i, u[l]))
        return !1;
    for (l = s; l-- !== 0; ) {
      const f = u[l];
      if (!(f === "_owner" && n.$$typeof) && !oo(n[f], i[f]))
        return !1;
    }
    return !0;
  }
  return n !== n && i !== i;
}
function $y(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ig(n, i) {
  const s = $y(n);
  return Math.round(i * s) / s;
}
function $c(n) {
  const i = A.useRef(n);
  return Jl(() => {
    i.current = n;
  }), i;
}
function BA(n) {
  n === void 0 && (n = {});
  const {
    placement: i = "bottom",
    strategy: s = "absolute",
    middleware: l = [],
    platform: u,
    elements: {
      reference: f,
      floating: d
    } = {},
    transform: h = !0,
    whileElementsMounted: m,
    open: p
  } = n, [g, y] = A.useState({
    x: 0,
    y: 0,
    strategy: s,
    placement: i,
    middlewareData: {},
    isPositioned: !1
  }), [b, T] = A.useState(l);
  oo(b, l) || T(l);
  const [R, w] = A.useState(null), [M, O] = A.useState(null), z = A.useCallback((Y) => {
    Y !== L.current && (L.current = Y, w(Y));
  }, []), U = A.useCallback((Y) => {
    Y !== Z.current && (Z.current = Y, O(Y));
  }, []), q = f || R, V = d || M, L = A.useRef(null), Z = A.useRef(null), F = A.useRef(g), Q = m != null, W = $c(m), mt = $c(u), Rt = $c(p), ft = A.useCallback(() => {
    if (!L.current || !Z.current)
      return;
    const Y = {
      placement: i,
      strategy: s,
      middleware: b
    };
    mt.current && (Y.platform = mt.current), zA(L.current, Z.current, Y).then((nt) => {
      const C = {
        ...nt,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: Rt.current !== !1
      };
      pt.current && !oo(F.current, C) && (F.current = C, jn.flushSync(() => {
        y(C);
      }));
    });
  }, [b, i, s, mt, Rt]);
  Jl(() => {
    p === !1 && F.current.isPositioned && (F.current.isPositioned = !1, y((Y) => ({
      ...Y,
      isPositioned: !1
    })));
  }, [p]);
  const pt = A.useRef(!1);
  Jl(() => (pt.current = !0, () => {
    pt.current = !1;
  }), []), Jl(() => {
    if (q && (L.current = q), V && (Z.current = V), q && V) {
      if (W.current)
        return W.current(q, V, ft);
      ft();
    }
  }, [q, V, ft, W, Q]);
  const yt = A.useMemo(() => ({
    reference: L,
    floating: Z,
    setReference: z,
    setFloating: U
  }), [z, U]), P = A.useMemo(() => ({
    reference: q,
    floating: V
  }), [q, V]), $ = A.useMemo(() => {
    const Y = {
      position: s,
      left: 0,
      top: 0
    };
    if (!P.floating)
      return Y;
    const nt = Ig(P.floating, g.x), C = Ig(P.floating, g.y);
    return h ? {
      ...Y,
      transform: "translate(" + nt + "px, " + C + "px)",
      ...$y(P.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: s,
      left: nt,
      top: C
    };
  }, [s, h, P.floating, g.x, g.y]);
  return A.useMemo(() => ({
    ...g,
    update: ft,
    refs: yt,
    elements: P,
    floatingStyles: $
  }), [g, ft, yt, P, $]);
}
const UA = (n) => {
  function i(s) {
    return {}.hasOwnProperty.call(s, "current");
  }
  return {
    name: "arrow",
    options: n,
    fn(s) {
      const {
        element: l,
        padding: u
      } = typeof n == "function" ? n(s) : n;
      return l && i(l) ? l.current != null ? Jg({
        element: l.current,
        padding: u
      }).fn(s) : {} : l ? Jg({
        element: l,
        padding: u
      }).fn(s) : {};
    }
  };
}, kA = (n, i) => {
  const s = MA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, HA = (n, i) => {
  const s = DA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, PA = (n, i) => ({
  fn: _A(n).fn,
  options: [n, i]
}), qA = (n, i) => {
  const s = OA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, GA = (n, i) => {
  const s = NA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, YA = (n, i) => {
  const s = jA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, XA = (n, i) => {
  const s = UA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
};
var KA = "Arrow", Jy = A.forwardRef((n, i) => {
  const { children: s, width: l = 10, height: u = 5, ...f } = n;
  return /* @__PURE__ */ S.jsx(
    Se.svg,
    {
      ...f,
      ref: i,
      width: l,
      height: u,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: n.asChild ? s : /* @__PURE__ */ S.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Jy.displayName = KA;
var ZA = Jy;
function QA(n) {
  const [i, s] = A.useState(void 0);
  return $i(() => {
    if (n) {
      s({ width: n.offsetWidth, height: n.offsetHeight });
      const l = new ResizeObserver((u) => {
        if (!Array.isArray(u) || !u.length)
          return;
        const f = u[0];
        let d, h;
        if ("borderBoxSize" in f) {
          const m = f.borderBoxSize, p = Array.isArray(m) ? m[0] : m;
          d = p.inlineSize, h = p.blockSize;
        } else
          d = n.offsetWidth, h = n.offsetHeight;
        s({ width: d, height: h });
      });
      return l.observe(n, { box: "border-box" }), () => l.unobserve(n);
    } else
      s(void 0);
  }, [n]), i;
}
var sd = "Popper", [Iy, t0] = $f(sd), [FA, e0] = Iy(sd), n0 = (n) => {
  const { __scopePopper: i, children: s } = n, [l, u] = A.useState(null);
  return /* @__PURE__ */ S.jsx(FA, { scope: i, anchor: l, onAnchorChange: u, children: s });
};
n0.displayName = sd;
var i0 = "PopperAnchor", a0 = A.forwardRef(
  (n, i) => {
    const { __scopePopper: s, virtualRef: l, ...u } = n, f = e0(i0, s), d = A.useRef(null), h = We(i, d);
    return A.useEffect(() => {
      f.onAnchorChange((l == null ? void 0 : l.current) || d.current);
    }), l ? null : /* @__PURE__ */ S.jsx(Se.div, { ...u, ref: h });
  }
);
a0.displayName = i0;
var rd = "PopperContent", [WA, $A] = Iy(rd), s0 = A.forwardRef(
  (n, i) => {
    var zt, At, Vt, Dt, Te, Ln;
    const {
      __scopePopper: s,
      side: l = "bottom",
      sideOffset: u = 0,
      align: f = "center",
      alignOffset: d = 0,
      arrowPadding: h = 0,
      avoidCollisions: m = !0,
      collisionBoundary: p = [],
      collisionPadding: g = 0,
      sticky: y = "partial",
      hideWhenDetached: b = !1,
      updatePositionStrategy: T = "optimized",
      onPlaced: R,
      ...w
    } = n, M = e0(rd, s), [O, z] = A.useState(null), U = We(i, (me) => z(me)), [q, V] = A.useState(null), L = QA(q), Z = (L == null ? void 0 : L.width) ?? 0, F = (L == null ? void 0 : L.height) ?? 0, Q = l + (f !== "center" ? "-" + f : ""), W = typeof g == "number" ? g : { top: 0, right: 0, bottom: 0, left: 0, ...g }, mt = Array.isArray(p) ? p : [p], Rt = mt.length > 0, ft = {
      padding: W,
      boundary: mt.filter(IA),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: Rt
    }, { refs: pt, floatingStyles: yt, placement: P, isPositioned: $, middlewareData: Y } = BA({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: Q,
      whileElementsMounted: (...me) => CA(...me, {
        animationFrame: T === "always"
      }),
      elements: {
        reference: M.anchor
      },
      middleware: [
        kA({ mainAxis: u + F, alignmentAxis: d }),
        m && HA({
          mainAxis: !0,
          crossAxis: !1,
          limiter: y === "partial" ? PA() : void 0,
          ...ft
        }),
        m && qA({ ...ft }),
        GA({
          ...ft,
          apply: ({ elements: me, rects: yi, availableWidth: na, availableHeight: Bn }) => {
            const { width: us, height: ia } = yi.reference, Un = me.floating.style;
            Un.setProperty("--radix-popper-available-width", `${na}px`), Un.setProperty("--radix-popper-available-height", `${Bn}px`), Un.setProperty("--radix-popper-anchor-width", `${us}px`), Un.setProperty("--radix-popper-anchor-height", `${ia}px`);
          }
        }),
        q && XA({ element: q, padding: h }),
        tw({ arrowWidth: Z, arrowHeight: F }),
        b && YA({ strategy: "referenceHidden", ...ft })
      ]
    }), [nt, C] = o0(P), K = fi(R);
    $i(() => {
      $ && (K == null || K());
    }, [$, K]);
    const rt = (zt = Y.arrow) == null ? void 0 : zt.x, at = (At = Y.arrow) == null ? void 0 : At.y, J = ((Vt = Y.arrow) == null ? void 0 : Vt.centerOffset) !== 0, [dt, ut] = A.useState();
    return $i(() => {
      O && ut(window.getComputedStyle(O).zIndex);
    }, [O]), /* @__PURE__ */ S.jsx(
      "div",
      {
        ref: pt.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...yt,
          transform: $ ? yt.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: dt,
          "--radix-popper-transform-origin": [
            (Dt = Y.transformOrigin) == null ? void 0 : Dt.x,
            (Te = Y.transformOrigin) == null ? void 0 : Te.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((Ln = Y.hide) == null ? void 0 : Ln.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: n.dir,
        children: /* @__PURE__ */ S.jsx(
          WA,
          {
            scope: s,
            placedSide: nt,
            onArrowChange: V,
            arrowX: rt,
            arrowY: at,
            shouldHideArrow: J,
            children: /* @__PURE__ */ S.jsx(
              Se.div,
              {
                "data-side": nt,
                "data-align": C,
                ...w,
                ref: U,
                style: {
                  ...w.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: $ ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
s0.displayName = rd;
var r0 = "PopperArrow", JA = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, l0 = A.forwardRef(function(i, s) {
  const { __scopePopper: l, ...u } = i, f = $A(r0, l), d = JA[f.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ S.jsx(
      "span",
      {
        ref: f.onArrowChange,
        style: {
          position: "absolute",
          left: f.arrowX,
          top: f.arrowY,
          [d]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[f.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[f.placedSide],
          visibility: f.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ S.jsx(
          ZA,
          {
            ...u,
            ref: s,
            style: {
              ...u.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
l0.displayName = r0;
function IA(n) {
  return n !== null;
}
var tw = (n) => ({
  name: "transformOrigin",
  options: n,
  fn(i) {
    var M, O, z;
    const { placement: s, rects: l, middlewareData: u } = i, d = ((M = u.arrow) == null ? void 0 : M.centerOffset) !== 0, h = d ? 0 : n.arrowWidth, m = d ? 0 : n.arrowHeight, [p, g] = o0(s), y = { start: "0%", center: "50%", end: "100%" }[g], b = (((O = u.arrow) == null ? void 0 : O.x) ?? 0) + h / 2, T = (((z = u.arrow) == null ? void 0 : z.y) ?? 0) + m / 2;
    let R = "", w = "";
    return p === "bottom" ? (R = d ? y : `${b}px`, w = `${-m}px`) : p === "top" ? (R = d ? y : `${b}px`, w = `${l.floating.height + m}px`) : p === "right" ? (R = `${-m}px`, w = d ? y : `${T}px`) : p === "left" && (R = `${l.floating.width + m}px`, w = d ? y : `${T}px`), { data: { x: R, y: w } };
  }
});
function o0(n) {
  const [i, s = "center"] = n.split("-");
  return [i, s];
}
var ew = n0, nw = a0, iw = s0, aw = l0, sw = "Portal", ld = A.forwardRef((n, i) => {
  var h;
  const { container: s, ...l } = n, [u, f] = A.useState(!1);
  $i(() => f(!0), []);
  const d = s || u && ((h = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : h.body);
  return d ? ST.createPortal(/* @__PURE__ */ S.jsx(Se.div, { ...l, ref: i }), d) : null;
});
ld.displayName = sw;
function rw(n, i) {
  return A.useReducer((s, l) => i[s][l] ?? s, n);
}
var as = (n) => {
  const { present: i, children: s } = n, l = lw(i), u = typeof s == "function" ? s({ present: l.isPresent }) : A.Children.only(s), f = We(l.ref, ow(u));
  return typeof s == "function" || l.isPresent ? A.cloneElement(u, { ref: f }) : null;
};
as.displayName = "Presence";
function lw(n) {
  const [i, s] = A.useState(), l = A.useRef({}), u = A.useRef(n), f = A.useRef("none"), d = n ? "mounted" : "unmounted", [h, m] = rw(d, {
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
  return A.useEffect(() => {
    const p = ql(l.current);
    f.current = h === "mounted" ? p : "none";
  }, [h]), $i(() => {
    const p = l.current, g = u.current;
    if (g !== n) {
      const b = f.current, T = ql(p);
      n ? m("MOUNT") : T === "none" || (p == null ? void 0 : p.display) === "none" ? m("UNMOUNT") : m(g && b !== T ? "ANIMATION_OUT" : "UNMOUNT"), u.current = n;
    }
  }, [n, m]), $i(() => {
    if (i) {
      let p;
      const g = i.ownerDocument.defaultView ?? window, y = (T) => {
        const w = ql(l.current).includes(T.animationName);
        if (T.target === i && w && (m("ANIMATION_END"), !u.current)) {
          const M = i.style.animationFillMode;
          i.style.animationFillMode = "forwards", p = g.setTimeout(() => {
            i.style.animationFillMode === "forwards" && (i.style.animationFillMode = M);
          });
        }
      }, b = (T) => {
        T.target === i && (f.current = ql(l.current));
      };
      return i.addEventListener("animationstart", b), i.addEventListener("animationcancel", y), i.addEventListener("animationend", y), () => {
        g.clearTimeout(p), i.removeEventListener("animationstart", b), i.removeEventListener("animationcancel", y), i.removeEventListener("animationend", y);
      };
    } else
      m("ANIMATION_END");
  }, [i, m]), {
    isPresent: ["mounted", "unmountSuspended"].includes(h),
    ref: A.useCallback((p) => {
      p && (l.current = getComputedStyle(p)), s(p);
    }, [])
  };
}
function ql(n) {
  return (n == null ? void 0 : n.animationName) || "none";
}
function ow(n) {
  var l, u;
  let i = (l = Object.getOwnPropertyDescriptor(n.props, "ref")) == null ? void 0 : l.get, s = i && "isReactWarning" in i && i.isReactWarning;
  return s ? n.ref : (i = (u = Object.getOwnPropertyDescriptor(n, "ref")) == null ? void 0 : u.get, s = i && "isReactWarning" in i && i.isReactWarning, s ? n.props.ref : n.props.ref || n.ref);
}
function u0({
  prop: n,
  defaultProp: i,
  onChange: s = () => {
  }
}) {
  const [l, u] = uw({ defaultProp: i, onChange: s }), f = n !== void 0, d = f ? n : l, h = fi(s), m = A.useCallback(
    (p) => {
      if (f) {
        const y = typeof p == "function" ? p(n) : p;
        y !== n && h(y);
      } else
        u(p);
    },
    [f, n, u, h]
  );
  return [d, m];
}
function uw({
  defaultProp: n,
  onChange: i
}) {
  const s = A.useState(n), [l] = s, u = A.useRef(l), f = fi(i);
  return A.useEffect(() => {
    u.current !== l && (f(l), u.current = l);
  }, [l, u, f]), s;
}
var cw = "VisuallyHidden", c0 = A.forwardRef(
  (n, i) => /* @__PURE__ */ S.jsx(
    Se.span,
    {
      ...n,
      ref: i,
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
        ...n.style
      }
    }
  )
);
c0.displayName = cw;
var fw = c0, [Ro] = $f("Tooltip", [
  t0
]), Co = t0(), f0 = "TooltipProvider", dw = 700, wf = "tooltip.open", [hw, od] = Ro(f0), d0 = (n) => {
  const {
    __scopeTooltip: i,
    delayDuration: s = dw,
    skipDelayDuration: l = 300,
    disableHoverableContent: u = !1,
    children: f
  } = n, [d, h] = A.useState(!0), m = A.useRef(!1), p = A.useRef(0);
  return A.useEffect(() => {
    const g = p.current;
    return () => window.clearTimeout(g);
  }, []), /* @__PURE__ */ S.jsx(
    hw,
    {
      scope: i,
      isOpenDelayed: d,
      delayDuration: s,
      onOpen: A.useCallback(() => {
        window.clearTimeout(p.current), h(!1);
      }, []),
      onClose: A.useCallback(() => {
        window.clearTimeout(p.current), p.current = window.setTimeout(
          () => h(!0),
          l
        );
      }, [l]),
      isPointerInTransitRef: m,
      onPointerInTransitChange: A.useCallback((g) => {
        m.current = g;
      }, []),
      disableHoverableContent: u,
      children: f
    }
  );
};
d0.displayName = f0;
var Mo = "Tooltip", [mw, Er] = Ro(Mo), h0 = (n) => {
  const {
    __scopeTooltip: i,
    children: s,
    open: l,
    defaultOpen: u = !1,
    onOpenChange: f,
    disableHoverableContent: d,
    delayDuration: h
  } = n, m = od(Mo, n.__scopeTooltip), p = Co(i), [g, y] = A.useState(null), b = $l(), T = A.useRef(0), R = d ?? m.disableHoverableContent, w = h ?? m.delayDuration, M = A.useRef(!1), [O = !1, z] = u0({
    prop: l,
    defaultProp: u,
    onChange: (Z) => {
      Z ? (m.onOpen(), document.dispatchEvent(new CustomEvent(wf))) : m.onClose(), f == null || f(Z);
    }
  }), U = A.useMemo(() => O ? M.current ? "delayed-open" : "instant-open" : "closed", [O]), q = A.useCallback(() => {
    window.clearTimeout(T.current), T.current = 0, M.current = !1, z(!0);
  }, [z]), V = A.useCallback(() => {
    window.clearTimeout(T.current), T.current = 0, z(!1);
  }, [z]), L = A.useCallback(() => {
    window.clearTimeout(T.current), T.current = window.setTimeout(() => {
      M.current = !0, z(!0), T.current = 0;
    }, w);
  }, [w, z]);
  return A.useEffect(() => () => {
    T.current && (window.clearTimeout(T.current), T.current = 0);
  }, []), /* @__PURE__ */ S.jsx(ew, { ...p, children: /* @__PURE__ */ S.jsx(
    mw,
    {
      scope: i,
      contentId: b,
      open: O,
      stateAttribute: U,
      trigger: g,
      onTriggerChange: y,
      onTriggerEnter: A.useCallback(() => {
        m.isOpenDelayed ? L() : q();
      }, [m.isOpenDelayed, L, q]),
      onTriggerLeave: A.useCallback(() => {
        R ? V() : (window.clearTimeout(T.current), T.current = 0);
      }, [V, R]),
      onOpen: q,
      onClose: V,
      disableHoverableContent: R,
      children: s
    }
  ) });
};
h0.displayName = Mo;
var Ef = "TooltipTrigger", m0 = A.forwardRef(
  (n, i) => {
    const { __scopeTooltip: s, ...l } = n, u = Er(Ef, s), f = od(Ef, s), d = Co(s), h = A.useRef(null), m = We(i, h, u.onTriggerChange), p = A.useRef(!1), g = A.useRef(!1), y = A.useCallback(() => p.current = !1, []);
    return A.useEffect(() => () => document.removeEventListener("pointerup", y), [y]), /* @__PURE__ */ S.jsx(nw, { asChild: !0, ...d, children: /* @__PURE__ */ S.jsx(
      Se.button,
      {
        "aria-describedby": u.open ? u.contentId : void 0,
        "data-state": u.stateAttribute,
        ...l,
        ref: m,
        onPointerMove: ye(n.onPointerMove, (b) => {
          b.pointerType !== "touch" && !g.current && !f.isPointerInTransitRef.current && (u.onTriggerEnter(), g.current = !0);
        }),
        onPointerLeave: ye(n.onPointerLeave, () => {
          u.onTriggerLeave(), g.current = !1;
        }),
        onPointerDown: ye(n.onPointerDown, () => {
          p.current = !0, document.addEventListener("pointerup", y, { once: !0 });
        }),
        onFocus: ye(n.onFocus, () => {
          p.current || u.onOpen();
        }),
        onBlur: ye(n.onBlur, u.onClose),
        onClick: ye(n.onClick, u.onClose)
      }
    ) });
  }
);
m0.displayName = Ef;
var ud = "TooltipPortal", [pw, gw] = Ro(ud, {
  forceMount: void 0
}), p0 = (n) => {
  const { __scopeTooltip: i, forceMount: s, children: l, container: u } = n, f = Er(ud, i);
  return /* @__PURE__ */ S.jsx(pw, { scope: i, forceMount: s, children: /* @__PURE__ */ S.jsx(as, { present: s || f.open, children: /* @__PURE__ */ S.jsx(ld, { asChild: !0, container: u, children: l }) }) });
};
p0.displayName = ud;
var $a = "TooltipContent", g0 = A.forwardRef(
  (n, i) => {
    const s = gw($a, n.__scopeTooltip), { forceMount: l = s.forceMount, side: u = "top", ...f } = n, d = Er($a, n.__scopeTooltip);
    return /* @__PURE__ */ S.jsx(as, { present: l || d.open, children: d.disableHoverableContent ? /* @__PURE__ */ S.jsx(v0, { side: u, ...f, ref: i }) : /* @__PURE__ */ S.jsx(vw, { side: u, ...f, ref: i }) });
  }
), vw = A.forwardRef((n, i) => {
  const s = Er($a, n.__scopeTooltip), l = od($a, n.__scopeTooltip), u = A.useRef(null), f = We(i, u), [d, h] = A.useState(null), { trigger: m, onClose: p } = s, g = u.current, { onPointerInTransitChange: y } = l, b = A.useCallback(() => {
    h(null), y(!1);
  }, [y]), T = A.useCallback(
    (R, w) => {
      const M = R.currentTarget, O = { x: R.clientX, y: R.clientY }, z = xw(O, M.getBoundingClientRect()), U = Sw(O, z), q = Tw(w.getBoundingClientRect()), V = ww([...U, ...q]);
      h(V), y(!0);
    },
    [y]
  );
  return A.useEffect(() => () => b(), [b]), A.useEffect(() => {
    if (m && g) {
      const R = (M) => T(M, g), w = (M) => T(M, m);
      return m.addEventListener("pointerleave", R), g.addEventListener("pointerleave", w), () => {
        m.removeEventListener("pointerleave", R), g.removeEventListener("pointerleave", w);
      };
    }
  }, [m, g, T, b]), A.useEffect(() => {
    if (d) {
      const R = (w) => {
        const M = w.target, O = { x: w.clientX, y: w.clientY }, z = (m == null ? void 0 : m.contains(M)) || (g == null ? void 0 : g.contains(M)), U = !Aw(O, d);
        z ? b() : U && (b(), p());
      };
      return document.addEventListener("pointermove", R), () => document.removeEventListener("pointermove", R);
    }
  }, [m, g, d, p, b]), /* @__PURE__ */ S.jsx(v0, { ...n, ref: f });
}), [yw, bw] = Ro(Mo, { isInside: !1 }), v0 = A.forwardRef(
  (n, i) => {
    const {
      __scopeTooltip: s,
      children: l,
      "aria-label": u,
      onEscapeKeyDown: f,
      onPointerDownOutside: d,
      ...h
    } = n, m = Er($a, s), p = Co(s), { onClose: g } = m;
    return A.useEffect(() => (document.addEventListener(wf, g), () => document.removeEventListener(wf, g)), [g]), A.useEffect(() => {
      if (m.trigger) {
        const y = (b) => {
          const T = b.target;
          T != null && T.contains(m.trigger) && g();
        };
        return window.addEventListener("scroll", y, { capture: !0 }), () => window.removeEventListener("scroll", y, { capture: !0 });
      }
    }, [m.trigger, g]), /* @__PURE__ */ S.jsx(
      Jf,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: f,
        onPointerDownOutside: d,
        onFocusOutside: (y) => y.preventDefault(),
        onDismiss: g,
        children: /* @__PURE__ */ S.jsxs(
          iw,
          {
            "data-state": m.stateAttribute,
            ...p,
            ...h,
            ref: i,
            style: {
              ...h.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ S.jsx(Uy, { children: l }),
              /* @__PURE__ */ S.jsx(yw, { scope: s, isInside: !0, children: /* @__PURE__ */ S.jsx(fw, { id: m.contentId, role: "tooltip", children: u || l }) })
            ]
          }
        )
      }
    );
  }
);
g0.displayName = $a;
var y0 = "TooltipArrow", b0 = A.forwardRef(
  (n, i) => {
    const { __scopeTooltip: s, ...l } = n, u = Co(s);
    return bw(
      y0,
      s
    ).isInside ? null : /* @__PURE__ */ S.jsx(aw, { ...u, ...l, ref: i });
  }
);
b0.displayName = y0;
function xw(n, i) {
  const s = Math.abs(i.top - n.y), l = Math.abs(i.bottom - n.y), u = Math.abs(i.right - n.x), f = Math.abs(i.left - n.x);
  switch (Math.min(s, l, u, f)) {
    case f:
      return "left";
    case u:
      return "right";
    case s:
      return "top";
    case l:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Sw(n, i, s = 5) {
  const l = [];
  switch (i) {
    case "top":
      l.push(
        { x: n.x - s, y: n.y + s },
        { x: n.x + s, y: n.y + s }
      );
      break;
    case "bottom":
      l.push(
        { x: n.x - s, y: n.y - s },
        { x: n.x + s, y: n.y - s }
      );
      break;
    case "left":
      l.push(
        { x: n.x + s, y: n.y - s },
        { x: n.x + s, y: n.y + s }
      );
      break;
    case "right":
      l.push(
        { x: n.x - s, y: n.y - s },
        { x: n.x - s, y: n.y + s }
      );
      break;
  }
  return l;
}
function Tw(n) {
  const { top: i, right: s, bottom: l, left: u } = n;
  return [
    { x: u, y: i },
    { x: s, y: i },
    { x: s, y: l },
    { x: u, y: l }
  ];
}
function Aw(n, i) {
  const { x: s, y: l } = n;
  let u = !1;
  for (let f = 0, d = i.length - 1; f < i.length; d = f++) {
    const h = i[f].x, m = i[f].y, p = i[d].x, g = i[d].y;
    m > l != g > l && s < (p - h) * (l - m) / (g - m) + h && (u = !u);
  }
  return u;
}
function ww(n) {
  const i = n.slice();
  return i.sort((s, l) => s.x < l.x ? -1 : s.x > l.x ? 1 : s.y < l.y ? -1 : s.y > l.y ? 1 : 0), Ew(i);
}
function Ew(n) {
  if (n.length <= 1) return n.slice();
  const i = [];
  for (let l = 0; l < n.length; l++) {
    const u = n[l];
    for (; i.length >= 2; ) {
      const f = i[i.length - 1], d = i[i.length - 2];
      if ((f.x - d.x) * (u.y - d.y) >= (f.y - d.y) * (u.x - d.x)) i.pop();
      else break;
    }
    i.push(u);
  }
  i.pop();
  const s = [];
  for (let l = n.length - 1; l >= 0; l--) {
    const u = n[l];
    for (; s.length >= 2; ) {
      const f = s[s.length - 1], d = s[s.length - 2];
      if ((f.x - d.x) * (u.y - d.y) >= (f.y - d.y) * (u.x - d.x)) s.pop();
      else break;
    }
    s.push(u);
  }
  return s.pop(), i.length === 1 && s.length === 1 && i[0].x === s[0].x && i[0].y === s[0].y ? i : i.concat(s);
}
var Rw = d0, Cw = h0, Mw = m0, Dw = p0, Ow = g0, Nw = b0;
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jw = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), x0 = (...n) => n.filter((i, s, l) => !!i && i.trim() !== "" && l.indexOf(i) === s).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var _w = {
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
const zw = A.forwardRef(
  ({
    color: n = "currentColor",
    size: i = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: l,
    className: u = "",
    children: f,
    iconNode: d,
    ...h
  }, m) => A.createElement(
    "svg",
    {
      ref: m,
      ..._w,
      width: i,
      height: i,
      stroke: n,
      strokeWidth: l ? Number(s) * 24 / Number(i) : s,
      className: x0("lucide", u),
      ...h
    },
    [
      ...d.map(([p, g]) => A.createElement(p, g)),
      ...Array.isArray(f) ? f : [f]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gt = (n, i) => {
  const s = A.forwardRef(
    ({ className: l, ...u }, f) => A.createElement(zw, {
      ref: f,
      iconNode: i,
      className: x0(`lucide-${jw(n)}`, l),
      ...u
    })
  );
  return s.displayName = `${n}`, s;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qi = Gt("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vw = Gt("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rf = Gt("BookOpen", [
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
const S0 = Gt("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lw = Gt("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bw = Gt("Command", [
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
const Uw = Gt("FileInput", [
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
const Fi = Gt("FilePenLine", [
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
const kw = Gt("History", [
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
const Hw = Gt("House", [
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
const tv = Gt("LayoutDashboard", [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T0 = Gt("LibraryBig", [
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
const Pw = Gt("Map", [
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
const A0 = Gt("Network", [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qw = Gt("PanelLeftClose", [
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
const Gw = Gt("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yw = Gt("Scale", [
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
const Xw = Gt("ScanLine", [
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
const Kw = Gt("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zw = Gt("Settings2", [
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
const Cf = Gt("ShieldCheck", [
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
const Qw = Gt("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Fw = [
  ["studio", "Policy Studio", Fi],
  ["data", "Data dashboard", Pw],
  ["library", "Legal library", T0],
  ["activity", "Activity", kw]
];
function Ww() {
  return /* @__PURE__ */ S.jsxs(Rw, { delayDuration: 450, children: [
    /* @__PURE__ */ S.jsxs("div", { className: "sidebar-brand", children: [
      /* @__PURE__ */ S.jsxs("a", { className: "brand", href: "/", "aria-label": "RuleLab, home page", children: [
        /* @__PURE__ */ S.jsx("span", { className: "brand-icon", "aria-hidden": "true" }),
        /* @__PURE__ */ S.jsxs("div", { className: "brand-copy", children: [
          /* @__PURE__ */ S.jsx("span", { className: "brand-name", children: "RuleLab" }),
          /* @__PURE__ */ S.jsx("span", { className: "brand-edition", children: "INDONESIA" })
        ] })
      ] }),
      /* @__PURE__ */ S.jsx("button", { id: "sidebar-toggle", className: "sidebar-toggle", "data-ux": "sidebar", "aria-controls": "workspace-sidebar", "aria-expanded": "true", "aria-label": "Collapse sidebar", children: /* @__PURE__ */ S.jsx(qw, { size: 17, "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ S.jsx("div", { className: "nav-label", children: "WORKSPACE" }),
    /* @__PURE__ */ S.jsxs("button", { className: "workspace-home-link", "data-view": "home", "aria-label": "Workspace overview", children: [
      /* @__PURE__ */ S.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(Hw, { size: 17, "aria-hidden": "true" }) }),
      /* @__PURE__ */ S.jsx("span", { className: "home-label", children: "Overview" })
    ] }),
    /* @__PURE__ */ S.jsx("nav", { id: "nav", "aria-label": "Main navigation", children: Fw.map(([n, i, s], l) => /* @__PURE__ */ S.jsxs("div", { className: l === 1 ? "nav-section-start" : "nav-item", children: [
      l === 1 && /* @__PURE__ */ S.jsx("div", { className: "nav-label", children: "SOURCES & ACTIVITY" }),
      /* @__PURE__ */ S.jsxs(Cw, { children: [
        /* @__PURE__ */ S.jsx(Mw, { asChild: !0, children: /* @__PURE__ */ S.jsxs("button", { "data-view": n, "aria-label": i, children: [
          /* @__PURE__ */ S.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(s, { size: 17 }) }),
          /* @__PURE__ */ S.jsx("span", { className: "nav-title", children: i })
        ] }) }),
        /* @__PURE__ */ S.jsx(Dw, { children: /* @__PURE__ */ S.jsxs(Ow, { className: "fx-tooltip", side: "right", sideOffset: 12, children: [
          i,
          /* @__PURE__ */ S.jsx(Nw, {})
        ] }) })
      ] })
    ] }, n)) }),
    /* @__PURE__ */ S.jsxs("div", { className: "sidebar-bottom", children: [
      /* @__PURE__ */ S.jsx("div", { className: "nav-label", children: "RESOURCES & SYSTEM" }),
      /* @__PURE__ */ S.jsxs("a", { className: "settings-link", href: "/guide", target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ S.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(T0, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ S.jsx("span", { className: "settings-label", children: "User guide" })
      ] }),
      /* @__PURE__ */ S.jsxs("button", { className: "settings-link", "data-action": "audit", "aria-label": "Audit workspace", children: [
        /* @__PURE__ */ S.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(Xw, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ S.jsx("span", { className: "settings-label", children: "Audit workspace" })
      ] }),
      /* @__PURE__ */ S.jsxs("button", { id: "settings-btn", className: "settings-link", "aria-label": "Integration settings", children: [
        /* @__PURE__ */ S.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(Zw, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ S.jsx("span", { className: "settings-label", children: "Integration settings" })
      ] })
    ] })
  ] });
}
var Jc = "focusScope.autoFocusOnMount", Ic = "focusScope.autoFocusOnUnmount", ev = { bubbles: !1, cancelable: !0 }, $w = "FocusScope", w0 = A.forwardRef((n, i) => {
  const {
    loop: s = !1,
    trapped: l = !1,
    onMountAutoFocus: u,
    onUnmountAutoFocus: f,
    ...d
  } = n, [h, m] = A.useState(null), p = fi(u), g = fi(f), y = A.useRef(null), b = We(i, (w) => m(w)), T = A.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  A.useEffect(() => {
    if (l) {
      let w = function(U) {
        if (T.paused || !h) return;
        const q = U.target;
        h.contains(q) ? y.current = q : ui(y.current, { select: !0 });
      }, M = function(U) {
        if (T.paused || !h) return;
        const q = U.relatedTarget;
        q !== null && (h.contains(q) || ui(y.current, { select: !0 }));
      }, O = function(U) {
        if (document.activeElement === document.body)
          for (const V of U)
            V.removedNodes.length > 0 && ui(h);
      };
      document.addEventListener("focusin", w), document.addEventListener("focusout", M);
      const z = new MutationObserver(O);
      return h && z.observe(h, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", w), document.removeEventListener("focusout", M), z.disconnect();
      };
    }
  }, [l, h, T.paused]), A.useEffect(() => {
    if (h) {
      iv.add(T);
      const w = document.activeElement;
      if (!h.contains(w)) {
        const O = new CustomEvent(Jc, ev);
        h.addEventListener(Jc, p), h.dispatchEvent(O), O.defaultPrevented || (Jw(iE(E0(h)), { select: !0 }), document.activeElement === w && ui(h));
      }
      return () => {
        h.removeEventListener(Jc, p), setTimeout(() => {
          const O = new CustomEvent(Ic, ev);
          h.addEventListener(Ic, g), h.dispatchEvent(O), O.defaultPrevented || ui(w ?? document.body, { select: !0 }), h.removeEventListener(Ic, g), iv.remove(T);
        }, 0);
      };
    }
  }, [h, p, g, T]);
  const R = A.useCallback(
    (w) => {
      if (!s && !l || T.paused) return;
      const M = w.key === "Tab" && !w.altKey && !w.ctrlKey && !w.metaKey, O = document.activeElement;
      if (M && O) {
        const z = w.currentTarget, [U, q] = Iw(z);
        U && q ? !w.shiftKey && O === q ? (w.preventDefault(), s && ui(U, { select: !0 })) : w.shiftKey && O === U && (w.preventDefault(), s && ui(q, { select: !0 })) : O === z && w.preventDefault();
      }
    },
    [s, l, T.paused]
  );
  return /* @__PURE__ */ S.jsx(Se.div, { tabIndex: -1, ...d, ref: b, onKeyDown: R });
});
w0.displayName = $w;
function Jw(n, { select: i = !1 } = {}) {
  const s = document.activeElement;
  for (const l of n)
    if (ui(l, { select: i }), document.activeElement !== s) return;
}
function Iw(n) {
  const i = E0(n), s = nv(i, n), l = nv(i.reverse(), n);
  return [s, l];
}
function E0(n) {
  const i = [], s = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (l) => {
      const u = l.tagName === "INPUT" && l.type === "hidden";
      return l.disabled || l.hidden || u ? NodeFilter.FILTER_SKIP : l.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; s.nextNode(); ) i.push(s.currentNode);
  return i;
}
function nv(n, i) {
  for (const s of n)
    if (!tE(s, { upTo: i })) return s;
}
function tE(n, { upTo: i }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (i !== void 0 && n === i) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function eE(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function ui(n, { select: i = !1 } = {}) {
  if (n && n.focus) {
    const s = document.activeElement;
    n.focus({ preventScroll: !0 }), n !== s && eE(n) && i && n.select();
  }
}
var iv = nE();
function nE() {
  let n = [];
  return {
    add(i) {
      const s = n[0];
      i !== s && (s == null || s.pause()), n = av(n, i), n.unshift(i);
    },
    remove(i) {
      var s;
      n = av(n, i), (s = n[0]) == null || s.resume();
    }
  };
}
function av(n, i) {
  const s = [...n], l = s.indexOf(i);
  return l !== -1 && s.splice(l, 1), s;
}
function iE(n) {
  return n.filter((i) => i.tagName !== "A");
}
var tf = 0;
function aE() {
  A.useEffect(() => {
    const n = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", n[0] ?? sv()), document.body.insertAdjacentElement("beforeend", n[1] ?? sv()), tf++, () => {
      tf === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((i) => i.remove()), tf--;
    };
  }, []);
}
function sv() {
  const n = document.createElement("span");
  return n.setAttribute("data-radix-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
var sn = function() {
  return sn = Object.assign || function(i) {
    for (var s, l = 1, u = arguments.length; l < u; l++) {
      s = arguments[l];
      for (var f in s) Object.prototype.hasOwnProperty.call(s, f) && (i[f] = s[f]);
    }
    return i;
  }, sn.apply(this, arguments);
};
function R0(n, i) {
  var s = {};
  for (var l in n) Object.prototype.hasOwnProperty.call(n, l) && i.indexOf(l) < 0 && (s[l] = n[l]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function")
    for (var u = 0, l = Object.getOwnPropertySymbols(n); u < l.length; u++)
      i.indexOf(l[u]) < 0 && Object.prototype.propertyIsEnumerable.call(n, l[u]) && (s[l[u]] = n[l[u]]);
  return s;
}
function sE(n, i, s) {
  if (s || arguments.length === 2) for (var l = 0, u = i.length, f; l < u; l++)
    (f || !(l in i)) && (f || (f = Array.prototype.slice.call(i, 0, l)), f[l] = i[l]);
  return n.concat(f || Array.prototype.slice.call(i));
}
var Il = "right-scroll-bar-position", to = "width-before-scroll-bar", rE = "with-scroll-bars-hidden", lE = "--removed-body-scroll-bar-size";
function ef(n, i) {
  return typeof n == "function" ? n(i) : n && (n.current = i), n;
}
function oE(n, i) {
  var s = A.useState(function() {
    return {
      // value
      value: n,
      // last callback
      callback: i,
      // "memoized" public interface
      facade: {
        get current() {
          return s.value;
        },
        set current(l) {
          var u = s.value;
          u !== l && (s.value = l, s.callback(l, u));
        }
      }
    };
  })[0];
  return s.callback = i, s.facade;
}
var uE = typeof window < "u" ? A.useLayoutEffect : A.useEffect, rv = /* @__PURE__ */ new WeakMap();
function cE(n, i) {
  var s = oE(null, function(l) {
    return n.forEach(function(u) {
      return ef(u, l);
    });
  });
  return uE(function() {
    var l = rv.get(s);
    if (l) {
      var u = new Set(l), f = new Set(n), d = s.current;
      u.forEach(function(h) {
        f.has(h) || ef(h, null);
      }), f.forEach(function(h) {
        u.has(h) || ef(h, d);
      });
    }
    rv.set(s, n);
  }, [n]), s;
}
function fE(n) {
  return n;
}
function dE(n, i) {
  i === void 0 && (i = fE);
  var s = [], l = !1, u = {
    read: function() {
      if (l)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return s.length ? s[s.length - 1] : n;
    },
    useMedium: function(f) {
      var d = i(f, l);
      return s.push(d), function() {
        s = s.filter(function(h) {
          return h !== d;
        });
      };
    },
    assignSyncMedium: function(f) {
      for (l = !0; s.length; ) {
        var d = s;
        s = [], d.forEach(f);
      }
      s = {
        push: function(h) {
          return f(h);
        },
        filter: function() {
          return s;
        }
      };
    },
    assignMedium: function(f) {
      l = !0;
      var d = [];
      if (s.length) {
        var h = s;
        s = [], h.forEach(f), d = s;
      }
      var m = function() {
        var g = d;
        d = [], g.forEach(f);
      }, p = function() {
        return Promise.resolve().then(m);
      };
      p(), s = {
        push: function(g) {
          d.push(g), p();
        },
        filter: function(g) {
          return d = d.filter(g), s;
        }
      };
    }
  };
  return u;
}
function hE(n) {
  n === void 0 && (n = {});
  var i = dE(null);
  return i.options = sn({ async: !0, ssr: !1 }, n), i;
}
var C0 = function(n) {
  var i = n.sideCar, s = R0(n, ["sideCar"]);
  if (!i)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var l = i.read();
  if (!l)
    throw new Error("Sidecar medium not found");
  return A.createElement(l, sn({}, s));
};
C0.isSideCarExport = !0;
function mE(n, i) {
  return n.useMedium(i), C0;
}
var M0 = hE(), nf = function() {
}, Do = A.forwardRef(function(n, i) {
  var s = A.useRef(null), l = A.useState({
    onScrollCapture: nf,
    onWheelCapture: nf,
    onTouchMoveCapture: nf
  }), u = l[0], f = l[1], d = n.forwardProps, h = n.children, m = n.className, p = n.removeScrollBar, g = n.enabled, y = n.shards, b = n.sideCar, T = n.noRelative, R = n.noIsolation, w = n.inert, M = n.allowPinchZoom, O = n.as, z = O === void 0 ? "div" : O, U = n.gapMode, q = R0(n, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), V = b, L = cE([s, i]), Z = sn(sn({}, q), u);
  return A.createElement(
    A.Fragment,
    null,
    g && A.createElement(V, { sideCar: M0, removeScrollBar: p, shards: y, noRelative: T, noIsolation: R, inert: w, setCallbacks: f, allowPinchZoom: !!M, lockRef: s, gapMode: U }),
    d ? A.cloneElement(A.Children.only(h), sn(sn({}, Z), { ref: L })) : A.createElement(z, sn({}, Z, { className: m, ref: L }), h)
  );
});
Do.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Do.classNames = {
  fullWidth: to,
  zeroRight: Il
};
var pE = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function gE() {
  if (!document)
    return null;
  var n = document.createElement("style");
  n.type = "text/css";
  var i = pE();
  return i && n.setAttribute("nonce", i), n;
}
function vE(n, i) {
  n.styleSheet ? n.styleSheet.cssText = i : n.appendChild(document.createTextNode(i));
}
function yE(n) {
  var i = document.head || document.getElementsByTagName("head")[0];
  i.appendChild(n);
}
var bE = function() {
  var n = 0, i = null;
  return {
    add: function(s) {
      n == 0 && (i = gE()) && (vE(i, s), yE(i)), n++;
    },
    remove: function() {
      n--, !n && i && (i.parentNode && i.parentNode.removeChild(i), i = null);
    }
  };
}, xE = function() {
  var n = bE();
  return function(i, s) {
    A.useEffect(function() {
      return n.add(i), function() {
        n.remove();
      };
    }, [i && s]);
  };
}, D0 = function() {
  var n = xE(), i = function(s) {
    var l = s.styles, u = s.dynamic;
    return n(l, u), null;
  };
  return i;
}, SE = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, af = function(n) {
  return parseInt(n || "", 10) || 0;
}, TE = function(n) {
  var i = window.getComputedStyle(document.body), s = i[n === "padding" ? "paddingLeft" : "marginLeft"], l = i[n === "padding" ? "paddingTop" : "marginTop"], u = i[n === "padding" ? "paddingRight" : "marginRight"];
  return [af(s), af(l), af(u)];
}, AE = function(n) {
  if (n === void 0 && (n = "margin"), typeof window > "u")
    return SE;
  var i = TE(n), s = document.documentElement.clientWidth, l = window.innerWidth;
  return {
    left: i[0],
    top: i[1],
    right: i[2],
    gap: Math.max(0, l - s + i[2] - i[0])
  };
}, wE = D0(), Wa = "data-scroll-locked", EE = function(n, i, s, l) {
  var u = n.left, f = n.top, d = n.right, h = n.gap;
  return s === void 0 && (s = "margin"), `
  .`.concat(rE, ` {
   overflow: hidden `).concat(l, `;
   padding-right: `).concat(h, "px ").concat(l, `;
  }
  body[`).concat(Wa, `] {
    overflow: hidden `).concat(l, `;
    overscroll-behavior: contain;
    `).concat([
    i && "position: relative ".concat(l, ";"),
    s === "margin" && `
    padding-left: `.concat(u, `px;
    padding-top: `).concat(f, `px;
    padding-right: `).concat(d, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(h, "px ").concat(l, `;
    `),
    s === "padding" && "padding-right: ".concat(h, "px ").concat(l, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Il, ` {
    right: `).concat(h, "px ").concat(l, `;
  }
  
  .`).concat(to, ` {
    margin-right: `).concat(h, "px ").concat(l, `;
  }
  
  .`).concat(Il, " .").concat(Il, ` {
    right: 0 `).concat(l, `;
  }
  
  .`).concat(to, " .").concat(to, ` {
    margin-right: 0 `).concat(l, `;
  }
  
  body[`).concat(Wa, `] {
    `).concat(lE, ": ").concat(h, `px;
  }
`);
}, lv = function() {
  var n = parseInt(document.body.getAttribute(Wa) || "0", 10);
  return isFinite(n) ? n : 0;
}, RE = function() {
  A.useEffect(function() {
    return document.body.setAttribute(Wa, (lv() + 1).toString()), function() {
      var n = lv() - 1;
      n <= 0 ? document.body.removeAttribute(Wa) : document.body.setAttribute(Wa, n.toString());
    };
  }, []);
}, CE = function(n) {
  var i = n.noRelative, s = n.noImportant, l = n.gapMode, u = l === void 0 ? "margin" : l;
  RE();
  var f = A.useMemo(function() {
    return AE(u);
  }, [u]);
  return A.createElement(wE, { styles: EE(f, !i, u, s ? "" : "!important") });
}, Mf = !1;
if (typeof window < "u")
  try {
    var Gl = Object.defineProperty({}, "passive", {
      get: function() {
        return Mf = !0, !0;
      }
    });
    window.addEventListener("test", Gl, Gl), window.removeEventListener("test", Gl, Gl);
  } catch {
    Mf = !1;
  }
var ka = Mf ? { passive: !1 } : !1, ME = function(n) {
  return n.tagName === "TEXTAREA";
}, O0 = function(n, i) {
  if (!(n instanceof Element))
    return !1;
  var s = window.getComputedStyle(n);
  return (
    // not-not-scrollable
    s[i] !== "hidden" && // contains scroll inside self
    !(s.overflowY === s.overflowX && !ME(n) && s[i] === "visible")
  );
}, DE = function(n) {
  return O0(n, "overflowY");
}, OE = function(n) {
  return O0(n, "overflowX");
}, ov = function(n, i) {
  var s = i.ownerDocument, l = i;
  do {
    typeof ShadowRoot < "u" && l instanceof ShadowRoot && (l = l.host);
    var u = N0(n, l);
    if (u) {
      var f = j0(n, l), d = f[1], h = f[2];
      if (d > h)
        return !0;
    }
    l = l.parentNode;
  } while (l && l !== s.body);
  return !1;
}, NE = function(n) {
  var i = n.scrollTop, s = n.scrollHeight, l = n.clientHeight;
  return [
    i,
    s,
    l
  ];
}, jE = function(n) {
  var i = n.scrollLeft, s = n.scrollWidth, l = n.clientWidth;
  return [
    i,
    s,
    l
  ];
}, N0 = function(n, i) {
  return n === "v" ? DE(i) : OE(i);
}, j0 = function(n, i) {
  return n === "v" ? NE(i) : jE(i);
}, _E = function(n, i) {
  return n === "h" && i === "rtl" ? -1 : 1;
}, zE = function(n, i, s, l, u) {
  var f = _E(n, window.getComputedStyle(i).direction), d = f * l, h = s.target, m = i.contains(h), p = !1, g = d > 0, y = 0, b = 0;
  do {
    if (!h)
      break;
    var T = j0(n, h), R = T[0], w = T[1], M = T[2], O = w - M - f * R;
    (R || O) && N0(n, h) && (y += O, b += R);
    var z = h.parentNode;
    h = z && z.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? z.host : z;
  } while (
    // portaled content
    !m && h !== document.body || // self content
    m && (i.contains(h) || i === h)
  );
  return (g && Math.abs(y) < 1 || !g && Math.abs(b) < 1) && (p = !0), p;
}, Yl = function(n) {
  return "changedTouches" in n ? [n.changedTouches[0].clientX, n.changedTouches[0].clientY] : [0, 0];
}, uv = function(n) {
  return [n.deltaX, n.deltaY];
}, cv = function(n) {
  return n && "current" in n ? n.current : n;
}, VE = function(n, i) {
  return n[0] === i[0] && n[1] === i[1];
}, LE = function(n) {
  return `
  .block-interactivity-`.concat(n, ` {pointer-events: none;}
  .allow-interactivity-`).concat(n, ` {pointer-events: all;}
`);
}, BE = 0, Ha = [];
function UE(n) {
  var i = A.useRef([]), s = A.useRef([0, 0]), l = A.useRef(), u = A.useState(BE++)[0], f = A.useState(D0)[0], d = A.useRef(n);
  A.useEffect(function() {
    d.current = n;
  }, [n]), A.useEffect(function() {
    if (n.inert) {
      document.body.classList.add("block-interactivity-".concat(u));
      var w = sE([n.lockRef.current], (n.shards || []).map(cv), !0).filter(Boolean);
      return w.forEach(function(M) {
        return M.classList.add("allow-interactivity-".concat(u));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(u)), w.forEach(function(M) {
          return M.classList.remove("allow-interactivity-".concat(u));
        });
      };
    }
  }, [n.inert, n.lockRef.current, n.shards]);
  var h = A.useCallback(function(w, M) {
    if ("touches" in w && w.touches.length === 2 || w.type === "wheel" && w.ctrlKey)
      return !d.current.allowPinchZoom;
    var O = Yl(w), z = s.current, U = "deltaX" in w ? w.deltaX : z[0] - O[0], q = "deltaY" in w ? w.deltaY : z[1] - O[1], V, L = w.target, Z = Math.abs(U) > Math.abs(q) ? "h" : "v";
    if ("touches" in w && Z === "h" && L.type === "range")
      return !1;
    var F = window.getSelection(), Q = F && F.anchorNode, W = Q ? Q === L || Q.contains(L) : !1;
    if (W)
      return !1;
    var mt = ov(Z, L);
    if (!mt)
      return !0;
    if (mt ? V = Z : (V = Z === "v" ? "h" : "v", mt = ov(Z, L)), !mt)
      return !1;
    if (!l.current && "changedTouches" in w && (U || q) && (l.current = V), !V)
      return !0;
    var Rt = l.current || V;
    return zE(Rt, M, w, Rt === "h" ? U : q);
  }, []), m = A.useCallback(function(w) {
    var M = w;
    if (!(!Ha.length || Ha[Ha.length - 1] !== f)) {
      var O = "deltaY" in M ? uv(M) : Yl(M), z = i.current.filter(function(V) {
        return V.name === M.type && (V.target === M.target || M.target === V.shadowParent) && VE(V.delta, O);
      })[0];
      if (z && z.should) {
        M.cancelable && M.preventDefault();
        return;
      }
      if (!z) {
        var U = (d.current.shards || []).map(cv).filter(Boolean).filter(function(V) {
          return V.contains(M.target);
        }), q = U.length > 0 ? h(M, U[0]) : !d.current.noIsolation;
        q && M.cancelable && M.preventDefault();
      }
    }
  }, []), p = A.useCallback(function(w, M, O, z) {
    var U = { name: w, delta: M, target: O, should: z, shadowParent: kE(O) };
    i.current.push(U), setTimeout(function() {
      i.current = i.current.filter(function(q) {
        return q !== U;
      });
    }, 1);
  }, []), g = A.useCallback(function(w) {
    s.current = Yl(w), l.current = void 0;
  }, []), y = A.useCallback(function(w) {
    p(w.type, uv(w), w.target, h(w, n.lockRef.current));
  }, []), b = A.useCallback(function(w) {
    p(w.type, Yl(w), w.target, h(w, n.lockRef.current));
  }, []);
  A.useEffect(function() {
    return Ha.push(f), n.setCallbacks({
      onScrollCapture: y,
      onWheelCapture: y,
      onTouchMoveCapture: b
    }), document.addEventListener("wheel", m, ka), document.addEventListener("touchmove", m, ka), document.addEventListener("touchstart", g, ka), function() {
      Ha = Ha.filter(function(w) {
        return w !== f;
      }), document.removeEventListener("wheel", m, ka), document.removeEventListener("touchmove", m, ka), document.removeEventListener("touchstart", g, ka);
    };
  }, []);
  var T = n.removeScrollBar, R = n.inert;
  return A.createElement(
    A.Fragment,
    null,
    R ? A.createElement(f, { styles: LE(u) }) : null,
    T ? A.createElement(CE, { noRelative: n.noRelative, gapMode: n.gapMode }) : null
  );
}
function kE(n) {
  for (var i = null; n !== null; )
    n instanceof ShadowRoot && (i = n.host, n = n.host), n = n.parentNode;
  return i;
}
const HE = mE(M0, UE);
var _0 = A.forwardRef(function(n, i) {
  return A.createElement(Do, sn({}, n, { ref: i, sideCar: HE }));
});
_0.classNames = Do.classNames;
var PE = function(n) {
  if (typeof document > "u")
    return null;
  var i = Array.isArray(n) ? n[0] : n;
  return i.ownerDocument.body;
}, Pa = /* @__PURE__ */ new WeakMap(), Xl = /* @__PURE__ */ new WeakMap(), Kl = {}, sf = 0, z0 = function(n) {
  return n && (n.host || z0(n.parentNode));
}, qE = function(n, i) {
  return i.map(function(s) {
    if (n.contains(s))
      return s;
    var l = z0(s);
    return l && n.contains(l) ? l : (console.error("aria-hidden", s, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(s) {
    return !!s;
  });
}, GE = function(n, i, s, l) {
  var u = qE(i, Array.isArray(n) ? n : [n]);
  Kl[s] || (Kl[s] = /* @__PURE__ */ new WeakMap());
  var f = Kl[s], d = [], h = /* @__PURE__ */ new Set(), m = new Set(u), p = function(y) {
    !y || h.has(y) || (h.add(y), p(y.parentNode));
  };
  u.forEach(p);
  var g = function(y) {
    !y || m.has(y) || Array.prototype.forEach.call(y.children, function(b) {
      if (h.has(b))
        g(b);
      else
        try {
          var T = b.getAttribute(l), R = T !== null && T !== "false", w = (Pa.get(b) || 0) + 1, M = (f.get(b) || 0) + 1;
          Pa.set(b, w), f.set(b, M), d.push(b), w === 1 && R && Xl.set(b, !0), M === 1 && b.setAttribute(s, "true"), R || b.setAttribute(l, "true");
        } catch (O) {
          console.error("aria-hidden: cannot operate on ", b, O);
        }
    });
  };
  return g(i), h.clear(), sf++, function() {
    d.forEach(function(y) {
      var b = Pa.get(y) - 1, T = f.get(y) - 1;
      Pa.set(y, b), f.set(y, T), b || (Xl.has(y) || y.removeAttribute(l), Xl.delete(y)), T || y.removeAttribute(s);
    }), sf--, sf || (Pa = /* @__PURE__ */ new WeakMap(), Pa = /* @__PURE__ */ new WeakMap(), Xl = /* @__PURE__ */ new WeakMap(), Kl = {});
  };
}, YE = function(n, i, s) {
  s === void 0 && (s = "data-aria-hidden");
  var l = Array.from(Array.isArray(n) ? n : [n]), u = PE(n);
  return u ? (l.push.apply(l, Array.from(u.querySelectorAll("[aria-live], script"))), GE(l, u, s, "aria-hidden")) : function() {
    return null;
  };
}, cd = "Dialog", [V0] = $f(cd), [XE, $e] = V0(cd), L0 = (n) => {
  const {
    __scopeDialog: i,
    children: s,
    open: l,
    defaultOpen: u,
    onOpenChange: f,
    modal: d = !0
  } = n, h = A.useRef(null), m = A.useRef(null), [p = !1, g] = u0({
    prop: l,
    defaultProp: u,
    onChange: f
  });
  return /* @__PURE__ */ S.jsx(
    XE,
    {
      scope: i,
      triggerRef: h,
      contentRef: m,
      contentId: $l(),
      titleId: $l(),
      descriptionId: $l(),
      open: p,
      onOpenChange: g,
      onOpenToggle: A.useCallback(() => g((y) => !y), [g]),
      modal: d,
      children: s
    }
  );
};
L0.displayName = cd;
var B0 = "DialogTrigger", U0 = A.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...l } = n, u = $e(B0, s), f = We(i, u.triggerRef);
    return /* @__PURE__ */ S.jsx(
      Se.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": u.open,
        "aria-controls": u.contentId,
        "data-state": hd(u.open),
        ...l,
        ref: f,
        onClick: ye(n.onClick, u.onOpenToggle)
      }
    );
  }
);
U0.displayName = B0;
var fd = "DialogPortal", [KE, k0] = V0(fd, {
  forceMount: void 0
}), H0 = (n) => {
  const { __scopeDialog: i, forceMount: s, children: l, container: u } = n, f = $e(fd, i);
  return /* @__PURE__ */ S.jsx(KE, { scope: i, forceMount: s, children: A.Children.map(l, (d) => /* @__PURE__ */ S.jsx(as, { present: s || f.open, children: /* @__PURE__ */ S.jsx(ld, { asChild: !0, container: u, children: d }) })) });
};
H0.displayName = fd;
var uo = "DialogOverlay", P0 = A.forwardRef(
  (n, i) => {
    const s = k0(uo, n.__scopeDialog), { forceMount: l = s.forceMount, ...u } = n, f = $e(uo, n.__scopeDialog);
    return f.modal ? /* @__PURE__ */ S.jsx(as, { present: l || f.open, children: /* @__PURE__ */ S.jsx(ZE, { ...u, ref: i }) }) : null;
  }
);
P0.displayName = uo;
var ZE = A.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...l } = n, u = $e(uo, s);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ S.jsx(_0, { as: xo, allowPinchZoom: !0, shards: [u.contentRef], children: /* @__PURE__ */ S.jsx(
        Se.div,
        {
          "data-state": hd(u.open),
          ...l,
          ref: i,
          style: { pointerEvents: "auto", ...l.style }
        }
      ) })
    );
  }
), ta = "DialogContent", q0 = A.forwardRef(
  (n, i) => {
    const s = k0(ta, n.__scopeDialog), { forceMount: l = s.forceMount, ...u } = n, f = $e(ta, n.__scopeDialog);
    return /* @__PURE__ */ S.jsx(as, { present: l || f.open, children: f.modal ? /* @__PURE__ */ S.jsx(QE, { ...u, ref: i }) : /* @__PURE__ */ S.jsx(FE, { ...u, ref: i }) });
  }
);
q0.displayName = ta;
var QE = A.forwardRef(
  (n, i) => {
    const s = $e(ta, n.__scopeDialog), l = A.useRef(null), u = We(i, s.contentRef, l);
    return A.useEffect(() => {
      const f = l.current;
      if (f) return YE(f);
    }, []), /* @__PURE__ */ S.jsx(
      G0,
      {
        ...n,
        ref: u,
        trapFocus: s.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ye(n.onCloseAutoFocus, (f) => {
          var d;
          f.preventDefault(), (d = s.triggerRef.current) == null || d.focus();
        }),
        onPointerDownOutside: ye(n.onPointerDownOutside, (f) => {
          const d = f.detail.originalEvent, h = d.button === 0 && d.ctrlKey === !0;
          (d.button === 2 || h) && f.preventDefault();
        }),
        onFocusOutside: ye(
          n.onFocusOutside,
          (f) => f.preventDefault()
        )
      }
    );
  }
), FE = A.forwardRef(
  (n, i) => {
    const s = $e(ta, n.__scopeDialog), l = A.useRef(!1), u = A.useRef(!1);
    return /* @__PURE__ */ S.jsx(
      G0,
      {
        ...n,
        ref: i,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (f) => {
          var d, h;
          (d = n.onCloseAutoFocus) == null || d.call(n, f), f.defaultPrevented || (l.current || (h = s.triggerRef.current) == null || h.focus(), f.preventDefault()), l.current = !1, u.current = !1;
        },
        onInteractOutside: (f) => {
          var m, p;
          (m = n.onInteractOutside) == null || m.call(n, f), f.defaultPrevented || (l.current = !0, f.detail.originalEvent.type === "pointerdown" && (u.current = !0));
          const d = f.target;
          ((p = s.triggerRef.current) == null ? void 0 : p.contains(d)) && f.preventDefault(), f.detail.originalEvent.type === "focusin" && u.current && f.preventDefault();
        }
      }
    );
  }
), G0 = A.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, trapFocus: l, onOpenAutoFocus: u, onCloseAutoFocus: f, ...d } = n, h = $e(ta, s), m = A.useRef(null), p = We(i, m);
    return aE(), /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
      /* @__PURE__ */ S.jsx(
        w0,
        {
          asChild: !0,
          loop: !0,
          trapped: l,
          onMountAutoFocus: u,
          onUnmountAutoFocus: f,
          children: /* @__PURE__ */ S.jsx(
            Jf,
            {
              role: "dialog",
              id: h.contentId,
              "aria-describedby": h.descriptionId,
              "aria-labelledby": h.titleId,
              "data-state": hd(h.open),
              ...d,
              ref: p,
              onDismiss: () => h.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
        /* @__PURE__ */ S.jsx(WE, { titleId: h.titleId }),
        /* @__PURE__ */ S.jsx(JE, { contentRef: m, descriptionId: h.descriptionId })
      ] })
    ] });
  }
), dd = "DialogTitle", Y0 = A.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...l } = n, u = $e(dd, s);
    return /* @__PURE__ */ S.jsx(Se.h2, { id: u.titleId, ...l, ref: i });
  }
);
Y0.displayName = dd;
var X0 = "DialogDescription", K0 = A.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...l } = n, u = $e(X0, s);
    return /* @__PURE__ */ S.jsx(Se.p, { id: u.descriptionId, ...l, ref: i });
  }
);
K0.displayName = X0;
var Z0 = "DialogClose", Q0 = A.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...l } = n, u = $e(Z0, s);
    return /* @__PURE__ */ S.jsx(
      Se.button,
      {
        type: "button",
        ...l,
        ref: i,
        onClick: ye(n.onClick, () => u.onOpenChange(!1))
      }
    );
  }
);
Q0.displayName = Z0;
function hd(n) {
  return n ? "open" : "closed";
}
var F0 = "DialogTitleWarning", [VO, W0] = wT(F0, {
  contentName: ta,
  titleName: dd,
  docsSlug: "dialog"
}), WE = ({ titleId: n }) => {
  const i = W0(F0), s = `\`${i.contentName}\` requires a \`${i.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${i.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${i.docsSlug}`;
  return A.useEffect(() => {
    n && (document.getElementById(n) || console.error(s));
  }, [s, n]), null;
}, $E = "DialogDescriptionWarning", JE = ({ contentRef: n, descriptionId: i }) => {
  const l = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${W0($E).contentName}}.`;
  return A.useEffect(() => {
    var f;
    const u = (f = n.current) == null ? void 0 : f.getAttribute("aria-describedby");
    i && u && (document.getElementById(i) || console.warn(l));
  }, [l, n, i]), null;
}, IE = L0, t2 = U0, e2 = H0, n2 = P0, i2 = q0, a2 = Y0, s2 = K0, r2 = Q0;
function $0(n) {
  var i, s, l = "";
  if (typeof n == "string" || typeof n == "number") l += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var u = n.length;
    for (i = 0; i < u; i++) n[i] && (s = $0(n[i])) && (l && (l += " "), l += s);
  } else for (s in n) n[s] && (l && (l += " "), l += s);
  return l;
}
function md() {
  for (var n, i, s = 0, l = "", u = arguments.length; s < u; s++) (n = arguments[s]) && (i = $0(n)) && (l && (l += " "), l += i);
  return l;
}
const fv = (n) => typeof n == "boolean" ? `${n}` : n === 0 ? "0" : n, dv = md, l2 = (n, i) => (s) => {
  var l;
  if ((i == null ? void 0 : i.variants) == null) return dv(n, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
  const { variants: u, defaultVariants: f } = i, d = Object.keys(u).map((p) => {
    const g = s == null ? void 0 : s[p], y = f == null ? void 0 : f[p];
    if (g === null) return null;
    const b = fv(g) || fv(y);
    return u[p][b];
  }), h = s && Object.entries(s).reduce((p, g) => {
    let [y, b] = g;
    return b === void 0 || (p[y] = b), p;
  }, {}), m = i == null || (l = i.compoundVariants) === null || l === void 0 ? void 0 : l.reduce((p, g) => {
    let { class: y, className: b, ...T } = g;
    return Object.entries(T).every((R) => {
      let [w, M] = R;
      return Array.isArray(M) ? M.includes({
        ...f,
        ...h
      }[w]) : {
        ...f,
        ...h
      }[w] === M;
    }) ? [
      ...p,
      y,
      b
    ] : p;
  }, []);
  return dv(n, d, m, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
}, pd = "-", o2 = (n) => {
  const i = c2(n), {
    conflictingClassGroups: s,
    conflictingClassGroupModifiers: l
  } = n;
  return {
    getClassGroupId: (d) => {
      const h = d.split(pd);
      return h[0] === "" && h.length !== 1 && h.shift(), J0(h, i) || u2(d);
    },
    getConflictingClassGroupIds: (d, h) => {
      const m = s[d] || [];
      return h && l[d] ? [...m, ...l[d]] : m;
    }
  };
}, J0 = (n, i) => {
  var d;
  if (n.length === 0)
    return i.classGroupId;
  const s = n[0], l = i.nextPart.get(s), u = l ? J0(n.slice(1), l) : void 0;
  if (u)
    return u;
  if (i.validators.length === 0)
    return;
  const f = n.join(pd);
  return (d = i.validators.find(({
    validator: h
  }) => h(f))) == null ? void 0 : d.classGroupId;
}, hv = /^\[(.+)\]$/, u2 = (n) => {
  if (hv.test(n)) {
    const i = hv.exec(n)[1], s = i == null ? void 0 : i.substring(0, i.indexOf(":"));
    if (s)
      return "arbitrary.." + s;
  }
}, c2 = (n) => {
  const {
    theme: i,
    classGroups: s
  } = n, l = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const u in s)
    Df(s[u], l, u, i);
  return l;
}, Df = (n, i, s, l) => {
  n.forEach((u) => {
    if (typeof u == "string") {
      const f = u === "" ? i : mv(i, u);
      f.classGroupId = s;
      return;
    }
    if (typeof u == "function") {
      if (f2(u)) {
        Df(u(l), i, s, l);
        return;
      }
      i.validators.push({
        validator: u,
        classGroupId: s
      });
      return;
    }
    Object.entries(u).forEach(([f, d]) => {
      Df(d, mv(i, f), s, l);
    });
  });
}, mv = (n, i) => {
  let s = n;
  return i.split(pd).forEach((l) => {
    s.nextPart.has(l) || s.nextPart.set(l, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), s = s.nextPart.get(l);
  }), s;
}, f2 = (n) => n.isThemeGetter, d2 = (n) => {
  if (n < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let i = 0, s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  const u = (f, d) => {
    s.set(f, d), i++, i > n && (i = 0, l = s, s = /* @__PURE__ */ new Map());
  };
  return {
    get(f) {
      let d = s.get(f);
      if (d !== void 0)
        return d;
      if ((d = l.get(f)) !== void 0)
        return u(f, d), d;
    },
    set(f, d) {
      s.has(f) ? s.set(f, d) : u(f, d);
    }
  };
}, Of = "!", Nf = ":", h2 = Nf.length, m2 = (n) => {
  const {
    prefix: i,
    experimentalParseClassName: s
  } = n;
  let l = (u) => {
    const f = [];
    let d = 0, h = 0, m = 0, p;
    for (let R = 0; R < u.length; R++) {
      let w = u[R];
      if (d === 0 && h === 0) {
        if (w === Nf) {
          f.push(u.slice(m, R)), m = R + h2;
          continue;
        }
        if (w === "/") {
          p = R;
          continue;
        }
      }
      w === "[" ? d++ : w === "]" ? d-- : w === "(" ? h++ : w === ")" && h--;
    }
    const g = f.length === 0 ? u : u.substring(m), y = p2(g), b = y !== g, T = p && p > m ? p - m : void 0;
    return {
      modifiers: f,
      hasImportantModifier: b,
      baseClassName: y,
      maybePostfixModifierPosition: T
    };
  };
  if (i) {
    const u = i + Nf, f = l;
    l = (d) => d.startsWith(u) ? f(d.substring(u.length)) : {
      isExternal: !0,
      modifiers: [],
      hasImportantModifier: !1,
      baseClassName: d,
      maybePostfixModifierPosition: void 0
    };
  }
  if (s) {
    const u = l;
    l = (f) => s({
      className: f,
      parseClassName: u
    });
  }
  return l;
}, p2 = (n) => n.endsWith(Of) ? n.substring(0, n.length - 1) : n.startsWith(Of) ? n.substring(1) : n, g2 = (n) => {
  const i = Object.fromEntries(n.orderSensitiveModifiers.map((l) => [l, !0]));
  return (l) => {
    if (l.length <= 1)
      return l;
    const u = [];
    let f = [];
    return l.forEach((d) => {
      d[0] === "[" || i[d] ? (u.push(...f.sort(), d), f = []) : f.push(d);
    }), u.push(...f.sort()), u;
  };
}, v2 = (n) => ({
  cache: d2(n.cacheSize),
  parseClassName: m2(n),
  sortModifiers: g2(n),
  ...o2(n)
}), y2 = /\s+/, b2 = (n, i) => {
  const {
    parseClassName: s,
    getClassGroupId: l,
    getConflictingClassGroupIds: u,
    sortModifiers: f
  } = i, d = [], h = n.trim().split(y2);
  let m = "";
  for (let p = h.length - 1; p >= 0; p -= 1) {
    const g = h[p], {
      isExternal: y,
      modifiers: b,
      hasImportantModifier: T,
      baseClassName: R,
      maybePostfixModifierPosition: w
    } = s(g);
    if (y) {
      m = g + (m.length > 0 ? " " + m : m);
      continue;
    }
    let M = !!w, O = l(M ? R.substring(0, w) : R);
    if (!O) {
      if (!M) {
        m = g + (m.length > 0 ? " " + m : m);
        continue;
      }
      if (O = l(R), !O) {
        m = g + (m.length > 0 ? " " + m : m);
        continue;
      }
      M = !1;
    }
    const z = f(b).join(":"), U = T ? z + Of : z, q = U + O;
    if (d.includes(q))
      continue;
    d.push(q);
    const V = u(O, M);
    for (let L = 0; L < V.length; ++L) {
      const Z = V[L];
      d.push(U + Z);
    }
    m = g + (m.length > 0 ? " " + m : m);
  }
  return m;
};
function x2() {
  let n = 0, i, s, l = "";
  for (; n < arguments.length; )
    (i = arguments[n++]) && (s = I0(i)) && (l && (l += " "), l += s);
  return l;
}
const I0 = (n) => {
  if (typeof n == "string")
    return n;
  let i, s = "";
  for (let l = 0; l < n.length; l++)
    n[l] && (i = I0(n[l])) && (s && (s += " "), s += i);
  return s;
};
function S2(n, ...i) {
  let s, l, u, f = d;
  function d(m) {
    const p = i.reduce((g, y) => y(g), n());
    return s = v2(p), l = s.cache.get, u = s.cache.set, f = h, h(m);
  }
  function h(m) {
    const p = l(m);
    if (p)
      return p;
    const g = b2(m, s);
    return u(m, g), g;
  }
  return function() {
    return f(x2.apply(null, arguments));
  };
}
const ee = (n) => {
  const i = (s) => s[n] || [];
  return i.isThemeGetter = !0, i;
}, tb = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, eb = /^\((?:(\w[\w-]*):)?(.+)\)$/i, T2 = /^\d+\/\d+$/, A2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, w2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, E2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, R2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, C2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, qa = (n) => T2.test(n), xt = (n) => !!n && !Number.isNaN(Number(n)), Gi = (n) => !!n && Number.isInteger(Number(n)), pv = (n) => n.endsWith("%") && xt(n.slice(0, -1)), oi = (n) => A2.test(n), M2 = () => !0, D2 = (n) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  w2.test(n) && !E2.test(n)
), gd = () => !1, O2 = (n) => R2.test(n), N2 = (n) => C2.test(n), j2 = (n) => !tt(n) && !et(n), _2 = (n) => ss(n, ab, gd), tt = (n) => tb.test(n), Yi = (n) => ss(n, sb, D2), rf = (n) => ss(n, Y2, xt), z2 = (n) => ss(n, nb, gd), V2 = (n) => ss(n, ib, N2), L2 = (n) => ss(n, gd, O2), et = (n) => eb.test(n), Zl = (n) => rs(n, sb), B2 = (n) => rs(n, X2), U2 = (n) => rs(n, nb), k2 = (n) => rs(n, ab), H2 = (n) => rs(n, ib), P2 = (n) => rs(n, K2, !0), ss = (n, i, s) => {
  const l = tb.exec(n);
  return l ? l[1] ? i(l[1]) : s(l[2]) : !1;
}, rs = (n, i, s = !1) => {
  const l = eb.exec(n);
  return l ? l[1] ? i(l[1]) : s : !1;
}, nb = (n) => n === "position", q2 = /* @__PURE__ */ new Set(["image", "url"]), ib = (n) => q2.has(n), G2 = /* @__PURE__ */ new Set(["length", "size", "percentage"]), ab = (n) => G2.has(n), sb = (n) => n === "length", Y2 = (n) => n === "number", X2 = (n) => n === "family-name", K2 = (n) => n === "shadow", Z2 = () => {
  const n = ee("color"), i = ee("font"), s = ee("text"), l = ee("font-weight"), u = ee("tracking"), f = ee("leading"), d = ee("breakpoint"), h = ee("container"), m = ee("spacing"), p = ee("radius"), g = ee("shadow"), y = ee("inset-shadow"), b = ee("drop-shadow"), T = ee("blur"), R = ee("perspective"), w = ee("aspect"), M = ee("ease"), O = ee("animate"), z = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], U = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], q = () => ["auto", "hidden", "clip", "visible", "scroll"], V = () => ["auto", "contain", "none"], L = () => [et, tt, m], Z = () => [qa, "full", "auto", ...L()], F = () => [Gi, "none", "subgrid", et, tt], Q = () => ["auto", {
    span: ["full", Gi, et, tt]
  }, et, tt], W = () => [Gi, "auto", et, tt], mt = () => ["auto", "min", "max", "fr", et, tt], Rt = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline"], ft = () => ["start", "end", "center", "stretch"], pt = () => ["auto", ...L()], yt = () => [qa, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...L()], P = () => [n, et, tt], $ = () => [pv, Yi], Y = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    p,
    et,
    tt
  ], nt = () => ["", xt, Zl, Yi], C = () => ["solid", "dashed", "dotted", "double"], K = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], rt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    T,
    et,
    tt
  ], at = () => ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", et, tt], J = () => ["none", xt, et, tt], dt = () => ["none", xt, et, tt], ut = () => [xt, et, tt], zt = () => [qa, "full", ...L()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [oi],
      breakpoint: [oi],
      color: [M2],
      container: [oi],
      "drop-shadow": [oi],
      ease: ["in", "out", "in-out"],
      font: [j2],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [oi],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [oi],
      shadow: [oi],
      spacing: ["px", xt],
      text: [oi],
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
        aspect: ["auto", "square", qa, tt, et, w]
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
        columns: [xt, tt, et, h]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": z()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": z()
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
        object: [...U(), tt, et]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: q()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": q()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": q()
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
        inset: Z()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": Z()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": Z()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: Z()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: Z()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: Z()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: Z()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: Z()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: Z()
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
        z: [Gi, "auto", et, tt]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [qa, "full", "auto", h, ...L()]
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
        flex: [xt, qa, "auto", "initial", "none", tt]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", xt, et, tt]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", xt, et, tt]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Gi, "first", "last", "none", et, tt]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": F()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: Q()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": W()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": W()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": F()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: Q()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": W()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": W()
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
        "auto-cols": mt()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": mt()
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
        justify: [...Rt(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...ft(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...ft()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Rt()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...ft(), "baseline"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...ft(), "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": Rt()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...ft(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...ft()]
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
        m: pt()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: pt()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: pt()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: pt()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: pt()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: pt()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: pt()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: pt()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: pt()
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
        size: yt()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [h, "screen", ...yt()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          h,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...yt()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          h,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [d]
          },
          ...yt()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", ...yt()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "none", ...yt()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", ...yt()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", s, Zl, Yi]
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
        font: [l, et, rf]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", pv, tt]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [B2, tt, i]
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
        tracking: [u, et, tt]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [xt, "none", et, rf]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          f,
          ...L()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", et, tt]
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
        list: ["disc", "decimal", "none", et, tt]
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
        placeholder: P()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: P()
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
        decoration: [...C(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [xt, "from-font", "auto", et, Yi]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: P()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [xt, "auto", et, tt]
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
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", et, tt]
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
        content: ["none", et, tt]
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
        bg: [...U(), U2, z2]
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
        bg: ["auto", "cover", "contain", k2, _2]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Gi, et, tt],
          radial: ["", et, tt],
          conic: [Gi, et, tt]
        }, H2, V2]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: P()
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
        from: P()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: P()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: P()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: Y()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": Y()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": Y()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": Y()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": Y()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": Y()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": Y()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": Y()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": Y()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": Y()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": Y()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": Y()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": Y()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": Y()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": Y()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: nt()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": nt()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": nt()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": nt()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": nt()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": nt()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": nt()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": nt()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": nt()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": nt()
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
        "divide-y": nt()
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
        border: [...C(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...C(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: P()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": P()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": P()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": P()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": P()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": P()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": P()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": P()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": P()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: P()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...C(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [xt, et, tt]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", xt, Zl, Yi]
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
          g,
          P2,
          L2
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: P()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", et, tt, y]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": P()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: nt()
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
        ring: P()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [xt, Yi]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": P()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": nt()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": P()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [xt, et, tt]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...K(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": K()
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
          et,
          tt
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: rt()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [xt, et, tt]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [xt, et, tt]
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
          b,
          et,
          tt
        ]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", xt, et, tt]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [xt, et, tt]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", xt, et, tt]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [xt, et, tt]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", xt, et, tt]
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
          et,
          tt
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": rt()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [xt, et, tt]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [xt, et, tt]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", xt, et, tt]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [xt, et, tt]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", xt, et, tt]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [xt, et, tt]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [xt, et, tt]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", xt, et, tt]
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", et, tt]
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
        duration: [xt, "initial", et, tt]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", M, et, tt]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [xt, et, tt]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", O, et, tt]
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
        perspective: [R, et, tt]
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
        rotate: J()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": J()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": J()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": J()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: dt()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": dt()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": dt()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": dt()
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
        skew: ut()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ut()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ut()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [et, tt, "", "none", "gpu", "cpu"]
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
        translate: zt()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": zt()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": zt()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": zt()
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
        accent: P()
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
        caret: P()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", et, tt]
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
        "will-change": ["auto", "scroll", "contents", "transform", et, tt]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...P()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [xt, Zl, Yi, rf]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...P()]
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
}, rb = /* @__PURE__ */ S2(Z2), Q2 = (...n) => rb(md(n)), F2 = l2("fx-button inline-flex items-center justify-center gap-2 rounded-xl font-semibold", {
  variants: {
    variant: { primary: "fx-button-primary", secondary: "fx-button-secondary", ghost: "fx-button-ghost" },
    size: { default: "px-4 py-2.5 text-xs", icon: "size-9 p-2", small: "px-3 py-2 text-[11px]" }
  },
  defaultVariants: { variant: "secondary", size: "default" }
}), Oe = A.forwardRef(
  ({ className: n, variant: i, size: s, asChild: l = !1, shimmer: u = !1, children: f, ...d }, h) => {
    const m = l ? xo : "button";
    return /* @__PURE__ */ S.jsx(m, { ref: h, className: Q2(F2({ variant: i, size: s }), u && "fx-shimmer", n), ...d, children: f });
  }
);
Oe.displayName = "Button";
const W2 = [
  ["home", "Workspace overview", "Start from the policy goal"],
  ["data", "Data dashboard", "Collection, regional map and the upload/JDIH source queue"],
  ["studio", "Policy Studio", "Draft documents, verify sources and test policy impact", "editor analysis review check conflict simulation forum public persona impact analisis pemeriksaan periksa konflik simulasi netizen dampak"],
  ["library", "Legal library", "Document gallery and regulation sources: search articles, read, ask and compare", "gallery library corpus documents galeri pustaka"],
  ["activity", "Activity", "Results, reviews, draft versions and agent runs", "history agent agents runs execution trace notes riwayat eksekusi catatan"]
];
function $2() {
  const [n, i] = A.useState(!1), [s, l] = A.useState(""), [u, f] = A.useState(0), d = W2.filter((m) => m.join(" ").toLowerCase().includes(s.toLowerCase())), h = (m) => {
    i(!1), requestAnimationFrame(() => {
      const p = document.querySelector('[data-view="' + m + '"]');
      if (m === "activity") {
        const b = /agen|agent|eksekusi|trace|proses/.test(s.toLowerCase()) ? "agents" : "results";
        p == null || p.dispatchEvent(new CustomEvent("rulelab:activity-route", { bubbles: !0, detail: { tab: b } }));
        return;
      }
      if (m !== "studio") {
        p == null || p.click();
        return;
      }
      const g = s.toLowerCase(), y = /simulasi|dampak|forum|netizen|persona/.test(g) ? "simulation" : /analisis|konflik|periksa|pemeriksaan|review/.test(g) ? "analysis" : /editor|rancang|naskah|susun/.test(g) ? "editor" : void 0;
      if (!y) {
        p == null || p.click();
        return;
      }
      p == null || p.dispatchEvent(new CustomEvent("rulelab:studio-route", { bubbles: !0, detail: { stage: y, sub: /forum|netizen|persona/.test(g) ? "social" : void 0 } }));
    });
  };
  return A.useEffect(() => {
    const m = (p) => {
      var g;
      (p.metaKey || p.ctrlKey) && p.key.toLowerCase() === "k" && !document.querySelector("dialog[open]") && !((g = document.querySelector("#main")) != null && g.inert) && (p.preventDefault(), i((y) => !y));
    };
    return document.addEventListener("keydown", m), () => document.removeEventListener("keydown", m);
  }, []), /* @__PURE__ */ S.jsxs(IE, { open: n, onOpenChange: (m) => {
    i(m), m && (l(""), f(0));
  }, children: [
    /* @__PURE__ */ S.jsx(t2, { asChild: !0, children: /* @__PURE__ */ S.jsxs(Oe, { className: "fx-command-trigger", size: "small", "aria-label": "Quick navigation", onClick: (m) => {
      var p;
      (document.querySelector("dialog[open]") || (p = document.querySelector("#main")) != null && p.inert) && m.preventDefault();
    }, children: [
      /* @__PURE__ */ S.jsx(Bw, { size: 14 }),
      /* @__PURE__ */ S.jsx("span", { children: "Quick menu" }),
      /* @__PURE__ */ S.jsx("kbd", { children: "⌘ K" })
    ] }) }),
    /* @__PURE__ */ S.jsxs(e2, { children: [
      /* @__PURE__ */ S.jsx(n2, { className: "fx-dialog-overlay" }),
      /* @__PURE__ */ S.jsxs(i2, { className: "fx-command-content", onOpenAutoFocus: (m) => {
        var p;
        m.preventDefault(), (p = document.getElementById("framework-command-input")) == null || p.focus();
      }, children: [
        /* @__PURE__ */ S.jsx(a2, { className: "fx-command-title", children: "Workspace navigation" }),
        /* @__PURE__ */ S.jsx(s2, { className: "fx-command-description", children: "Search the menu and continue your work. Changed drafts are saved before switching." }),
        /* @__PURE__ */ S.jsx(r2, { className: "fx-command-close", "aria-label": "Close quick menu", children: /* @__PURE__ */ S.jsx(Qw, { size: 15 }) }),
        /* @__PURE__ */ S.jsxs("div", { className: "fx-command-search", children: [
          /* @__PURE__ */ S.jsx(Kw, { size: 17 }),
          /* @__PURE__ */ S.jsx("input", { id: "framework-command-input", role: "combobox", "aria-controls": "framework-command-results", "aria-expanded": "true", "aria-autocomplete": "list", "aria-activedescendant": d[u] ? "framework-command-" + d[u][0] : void 0, "aria-label": "Search menu", autoComplete: "off", placeholder: "Search editor, simulation, sources…", value: s, onChange: (m) => {
            l(m.target.value), f(0);
          }, onKeyDown: (m) => {
            m.key === "ArrowDown" && (m.preventDefault(), f((p) => Math.max(0, Math.min(d.length - 1, p + 1)))), m.key === "ArrowUp" && (m.preventDefault(), f((p) => Math.max(0, p - 1))), m.key === "Enter" && d[u] && (m.preventDefault(), h(d[u][0]));
          } })
        ] }),
        /* @__PURE__ */ S.jsxs("div", { className: "fx-command-results", id: "framework-command-results", role: "listbox", "aria-label": "Workspace menu", children: [
          d.map(([m, p, g], y) => /* @__PURE__ */ S.jsxs("button", { id: "framework-command-" + m, role: "option", "aria-selected": y === u, tabIndex: -1, onClick: () => h(m), className: y === u ? "selected" : "", children: [
            /* @__PURE__ */ S.jsxs("span", { children: [
              /* @__PURE__ */ S.jsx("b", { children: p }),
              /* @__PURE__ */ S.jsx("small", { children: g })
            ] }),
            /* @__PURE__ */ S.jsx(Vw, { size: 14 })
          ] }, m)),
          !d.length && /* @__PURE__ */ S.jsx("p", { children: "No matching menu. Try another term." })
        ] }),
        /* @__PURE__ */ S.jsxs("div", { className: "fx-command-footer", children: [
          /* @__PURE__ */ S.jsx("span", { children: "↑ ↓ Select" }),
          /* @__PURE__ */ S.jsx("span", { children: "Enter Open" }),
          /* @__PURE__ */ S.jsx("span", { children: "Esc Close" })
        ] })
      ] })
    ] })
  ] });
}
const lb = A.createContext({});
function co(n) {
  const i = A.useRef(null);
  return i.current === null && (i.current = n()), i.current;
}
const vd = typeof window < "u", ob = vd ? A.useLayoutEffect : A.useEffect, yd = /* @__PURE__ */ A.createContext(null), Oo = A.createContext({
  transformPagePoint: (n) => n,
  isStatic: !1,
  reducedMotion: "never"
});
function J2(n = !0) {
  const i = A.useContext(yd);
  if (i === null)
    return [!0, null];
  const { isPresent: s, onExitComplete: l, register: u } = i, f = A.useId();
  A.useEffect(() => {
    if (n)
      return u(f);
  }, [n]);
  const d = A.useCallback(() => n && l && l(f), [f, l, n]);
  return !s && l ? [!1, d] : [!0];
}
const xe = /* @__NO_SIDE_EFFECTS__ */ (n) => n;
let ub = xe;
const I2 = {
  useManualTiming: !1
}, Ql = [
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
function tR(n, i) {
  let s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = !1, f = !1;
  const d = /* @__PURE__ */ new WeakSet();
  let h = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function m(g) {
    d.has(g) && (p.schedule(g), n()), g(h);
  }
  const p = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (g, y = !1, b = !1) => {
      const R = b && u ? s : l;
      return y && d.add(g), R.has(g) || R.add(g), g;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (g) => {
      l.delete(g), d.delete(g);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (g) => {
      if (h = g, u) {
        f = !0;
        return;
      }
      u = !0, [s, l] = [l, s], s.forEach(m), s.clear(), u = !1, f && (f = !1, p.process(g));
    }
  };
  return p;
}
const eR = 40;
function cb(n, i) {
  let s = !1, l = !0;
  const u = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, f = () => s = !0, d = Ql.reduce((O, z) => (O[z] = tR(f), O), {}), { read: h, resolveKeyframes: m, update: p, preRender: g, render: y, postRender: b } = d, T = () => {
    const O = performance.now();
    s = !1, u.delta = l ? 1e3 / 60 : Math.max(Math.min(O - u.timestamp, eR), 1), u.timestamp = O, u.isProcessing = !0, h.process(u), m.process(u), p.process(u), g.process(u), y.process(u), b.process(u), u.isProcessing = !1, s && i && (l = !1, n(T));
  }, R = () => {
    s = !0, l = !0, u.isProcessing || n(T);
  };
  return { schedule: Ql.reduce((O, z) => {
    const U = d[z];
    return O[z] = (q, V = !1, L = !1) => (s || R(), U.schedule(q, V, L)), O;
  }, {}), cancel: (O) => {
    for (let z = 0; z < Ql.length; z++)
      d[Ql[z]].cancel(O);
  }, state: u, steps: d };
}
const { schedule: Nt, cancel: mi, state: re, steps: lf } = /* @__PURE__ */ cb(typeof requestAnimationFrame < "u" ? requestAnimationFrame : xe, !0), fb = A.createContext({ strict: !1 }), gv = {
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
}, Ja = {};
for (const n in gv)
  Ja[n] = {
    isEnabled: (i) => gv[n].some((s) => !!i[s])
  };
function nR(n) {
  for (const i in n)
    Ja[i] = {
      ...Ja[i],
      ...n[i]
    };
}
const iR = /* @__PURE__ */ new Set([
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
function fo(n) {
  return n.startsWith("while") || n.startsWith("drag") && n !== "draggable" || n.startsWith("layout") || n.startsWith("onTap") || n.startsWith("onPan") || n.startsWith("onLayout") || iR.has(n);
}
let db = (n) => !fo(n);
function aR(n) {
  n && (db = (i) => i.startsWith("on") ? !fo(i) : n(i));
}
try {
  aR(require("@emotion/is-prop-valid").default);
} catch {
}
function sR(n, i, s) {
  const l = {};
  for (const u in n)
    u === "values" && typeof n.values == "object" || (db(u) || s === !0 && fo(u) || !i && !fo(u) || // If trying to use native HTML drag events, forward drag listeners
    n.draggable && u.startsWith("onDrag")) && (l[u] = n[u]);
  return l;
}
function rR(n) {
  if (typeof Proxy > "u")
    return n;
  const i = /* @__PURE__ */ new Map(), s = (...l) => n(...l);
  return new Proxy(s, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (l, u) => u === "create" ? n : (i.has(u) || i.set(u, n(u)), i.get(u))
  });
}
const No = /* @__PURE__ */ A.createContext({});
function jo(n) {
  return n !== null && typeof n == "object" && typeof n.start == "function";
}
function br(n) {
  return typeof n == "string" || Array.isArray(n);
}
const bd = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], xd = ["initial", ...bd];
function _o(n) {
  return jo(n.animate) || xd.some((i) => br(n[i]));
}
function hb(n) {
  return !!(_o(n) || n.variants);
}
function lR(n, i) {
  if (_o(n)) {
    const { initial: s, animate: l } = n;
    return {
      initial: s === !1 || br(s) ? s : void 0,
      animate: br(l) ? l : void 0
    };
  }
  return n.inherit !== !1 ? i : {};
}
function oR(n) {
  const { initial: i, animate: s } = lR(n, A.useContext(No));
  return A.useMemo(() => ({ initial: i, animate: s }), [vv(i), vv(s)]);
}
function vv(n) {
  return Array.isArray(n) ? n.join(" ") : n;
}
const uR = Symbol.for("motionComponentSymbol");
function Ga(n) {
  return n && typeof n == "object" && Object.prototype.hasOwnProperty.call(n, "current");
}
function cR(n, i, s) {
  return A.useCallback(
    (l) => {
      l && n.onMount && n.onMount(l), i && (l ? i.mount(l) : i.unmount()), s && (typeof s == "function" ? s(l) : Ga(s) && (s.current = l));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [i]
  );
}
const { schedule: Sd } = /* @__PURE__ */ cb(queueMicrotask, !1), Td = (n) => n.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), fR = "framerAppearId", mb = "data-" + Td(fR), pb = A.createContext({});
function dR(n, i, s, l, u) {
  var f, d;
  const { visualElement: h } = A.useContext(No), m = A.useContext(fb), p = A.useContext(yd), g = A.useContext(Oo).reducedMotion, y = A.useRef(null);
  l = l || m.renderer, !y.current && l && (y.current = l(n, {
    visualState: i,
    parent: h,
    props: s,
    presenceContext: p,
    blockInitialAnimation: p ? p.initial === !1 : !1,
    reducedMotionConfig: g
  }));
  const b = y.current, T = A.useContext(pb);
  b && !b.projection && u && (b.type === "html" || b.type === "svg") && hR(y.current, s, u, T);
  const R = A.useRef(!1);
  A.useInsertionEffect(() => {
    b && R.current && b.update(s, p);
  });
  const w = s[mb], M = A.useRef(!!w && !(!((f = window.MotionHandoffIsComplete) === null || f === void 0) && f.call(window, w)) && ((d = window.MotionHasOptimisedAnimation) === null || d === void 0 ? void 0 : d.call(window, w)));
  return ob(() => {
    b && (R.current = !0, window.MotionIsMounted = !0, b.updateFeatures(), Sd.render(b.render), M.current && b.animationState && b.animationState.animateChanges());
  }), A.useEffect(() => {
    b && (!M.current && b.animationState && b.animationState.animateChanges(), M.current && (queueMicrotask(() => {
      var O;
      (O = window.MotionHandoffMarkAsComplete) === null || O === void 0 || O.call(window, w);
    }), M.current = !1));
  }), b;
}
function hR(n, i, s, l) {
  const { layoutId: u, layout: f, drag: d, dragConstraints: h, layoutScroll: m, layoutRoot: p } = i;
  n.projection = new s(n.latestValues, i["data-framer-portal-id"] ? void 0 : gb(n.parent)), n.projection.setOptions({
    layoutId: u,
    layout: f,
    alwaysMeasureLayout: !!d || h && Ga(h),
    visualElement: n,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof f == "string" ? f : "both",
    initialPromotionConfig: l,
    layoutScroll: m,
    layoutRoot: p
  });
}
function gb(n) {
  if (n)
    return n.options.allowProjection !== !1 ? n.projection : gb(n.parent);
}
function mR({ preloadedFeatures: n, createVisualElement: i, useRender: s, useVisualState: l, Component: u }) {
  var f, d;
  n && nR(n);
  function h(p, g) {
    let y;
    const b = {
      ...A.useContext(Oo),
      ...p,
      layoutId: pR(p)
    }, { isStatic: T } = b, R = oR(p), w = l(p, T);
    if (!T && vd) {
      gR();
      const M = vR(b);
      y = M.MeasureLayout, R.visualElement = dR(u, w, b, i, M.ProjectionNode);
    }
    return S.jsxs(No.Provider, { value: R, children: [y && R.visualElement ? S.jsx(y, { visualElement: R.visualElement, ...b }) : null, s(u, p, cR(w, R.visualElement, g), w, T, R.visualElement)] });
  }
  h.displayName = `motion.${typeof u == "string" ? u : `create(${(d = (f = u.displayName) !== null && f !== void 0 ? f : u.name) !== null && d !== void 0 ? d : ""})`}`;
  const m = A.forwardRef(h);
  return m[uR] = u, m;
}
function pR({ layoutId: n }) {
  const i = A.useContext(lb).id;
  return i && n !== void 0 ? i + "-" + n : n;
}
function gR(n, i) {
  A.useContext(fb).strict;
}
function vR(n) {
  const { drag: i, layout: s } = Ja;
  if (!i && !s)
    return {};
  const l = { ...i, ...s };
  return {
    MeasureLayout: i != null && i.isEnabled(n) || s != null && s.isEnabled(n) ? l.MeasureLayout : void 0,
    ProjectionNode: l.ProjectionNode
  };
}
const vb = (n) => (i) => typeof i == "string" && i.startsWith(n), Ad = /* @__PURE__ */ vb("--"), yR = /* @__PURE__ */ vb("var(--"), wd = (n) => yR(n) ? bR.test(n.split("/*")[0].trim()) : !1, bR = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, xr = {};
function xR(n) {
  for (const i in n)
    xr[i] = n[i], Ad(i) && (xr[i].isCSSVariable = !0);
}
const ls = [
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
], ea = new Set(ls);
function yb(n, { layout: i, layoutId: s }) {
  return ea.has(n) || n.startsWith("origin") || (i || s !== void 0) && (!!xr[n] || n === "opacity");
}
const ne = (n) => !!(n && n.getVelocity), bb = (n, i) => i && typeof n == "number" ? i.transform(n) : n, zn = (n, i, s) => s > i ? i : s < n ? n : s, os = {
  test: (n) => typeof n == "number",
  parse: parseFloat,
  transform: (n) => n
}, Sr = {
  ...os,
  transform: (n) => zn(0, 1, n)
}, Fl = {
  ...os,
  default: 1
}, Rr = (n) => ({
  test: (i) => typeof i == "string" && i.endsWith(n) && i.split(" ").length === 1,
  parse: parseFloat,
  transform: (i) => `${i}${n}`
}), ci = /* @__PURE__ */ Rr("deg"), ln = /* @__PURE__ */ Rr("%"), ot = /* @__PURE__ */ Rr("px"), SR = /* @__PURE__ */ Rr("vh"), TR = /* @__PURE__ */ Rr("vw"), yv = {
  ...ln,
  parse: (n) => ln.parse(n) / 100,
  transform: (n) => ln.transform(n * 100)
}, AR = {
  // Border props
  borderWidth: ot,
  borderTopWidth: ot,
  borderRightWidth: ot,
  borderBottomWidth: ot,
  borderLeftWidth: ot,
  borderRadius: ot,
  radius: ot,
  borderTopLeftRadius: ot,
  borderTopRightRadius: ot,
  borderBottomRightRadius: ot,
  borderBottomLeftRadius: ot,
  // Positioning props
  width: ot,
  maxWidth: ot,
  height: ot,
  maxHeight: ot,
  top: ot,
  right: ot,
  bottom: ot,
  left: ot,
  // Spacing props
  padding: ot,
  paddingTop: ot,
  paddingRight: ot,
  paddingBottom: ot,
  paddingLeft: ot,
  margin: ot,
  marginTop: ot,
  marginRight: ot,
  marginBottom: ot,
  marginLeft: ot,
  // Misc
  backgroundPositionX: ot,
  backgroundPositionY: ot
}, wR = {
  rotate: ci,
  rotateX: ci,
  rotateY: ci,
  rotateZ: ci,
  scale: Fl,
  scaleX: Fl,
  scaleY: Fl,
  scaleZ: Fl,
  skew: ci,
  skewX: ci,
  skewY: ci,
  distance: ot,
  translateX: ot,
  translateY: ot,
  translateZ: ot,
  x: ot,
  y: ot,
  z: ot,
  perspective: ot,
  transformPerspective: ot,
  opacity: Sr,
  originX: yv,
  originY: yv,
  originZ: ot
}, bv = {
  ...os,
  transform: Math.round
}, Ed = {
  ...AR,
  ...wR,
  zIndex: bv,
  size: ot,
  // SVG
  fillOpacity: Sr,
  strokeOpacity: Sr,
  numOctaves: bv
}, ER = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, RR = ls.length;
function CR(n, i, s) {
  let l = "", u = !0;
  for (let f = 0; f < RR; f++) {
    const d = ls[f], h = n[d];
    if (h === void 0)
      continue;
    let m = !0;
    if (typeof h == "number" ? m = h === (d.startsWith("scale") ? 1 : 0) : m = parseFloat(h) === 0, !m || s) {
      const p = bb(h, Ed[d]);
      if (!m) {
        u = !1;
        const g = ER[d] || d;
        l += `${g}(${p}) `;
      }
      s && (i[d] = p);
    }
  }
  return l = l.trim(), s ? l = s(i, u ? "" : l) : u && (l = "none"), l;
}
function Rd(n, i, s) {
  const { style: l, vars: u, transformOrigin: f } = n;
  let d = !1, h = !1;
  for (const m in i) {
    const p = i[m];
    if (ea.has(m)) {
      d = !0;
      continue;
    } else if (Ad(m)) {
      u[m] = p;
      continue;
    } else {
      const g = bb(p, Ed[m]);
      m.startsWith("origin") ? (h = !0, f[m] = g) : l[m] = g;
    }
  }
  if (i.transform || (d || s ? l.transform = CR(i, n.transform, s) : l.transform && (l.transform = "none")), h) {
    const { originX: m = "50%", originY: p = "50%", originZ: g = 0 } = f;
    l.transformOrigin = `${m} ${p} ${g}`;
  }
}
const Cd = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function xb(n, i, s) {
  for (const l in i)
    !ne(i[l]) && !yb(l, s) && (n[l] = i[l]);
}
function MR({ transformTemplate: n }, i) {
  return A.useMemo(() => {
    const s = Cd();
    return Rd(s, i, n), Object.assign({}, s.vars, s.style);
  }, [i]);
}
function DR(n, i) {
  const s = n.style || {}, l = {};
  return xb(l, s, n), Object.assign(l, MR(n, i)), l;
}
function OR(n, i) {
  const s = {}, l = DR(n, i);
  return n.drag && n.dragListener !== !1 && (s.draggable = !1, l.userSelect = l.WebkitUserSelect = l.WebkitTouchCallout = "none", l.touchAction = n.drag === !0 ? "none" : `pan-${n.drag === "x" ? "y" : "x"}`), n.tabIndex === void 0 && (n.onTap || n.onTapStart || n.whileTap) && (s.tabIndex = 0), s.style = l, s;
}
const NR = [
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
function Md(n) {
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
      !!(NR.indexOf(n) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(n))
    )
  );
}
const jR = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, _R = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function zR(n, i, s = 1, l = 0, u = !0) {
  n.pathLength = 1;
  const f = u ? jR : _R;
  n[f.offset] = ot.transform(-l);
  const d = ot.transform(i), h = ot.transform(s);
  n[f.array] = `${d} ${h}`;
}
function xv(n, i, s) {
  return typeof n == "string" ? n : ot.transform(i + s * n);
}
function VR(n, i, s) {
  const l = xv(i, n.x, n.width), u = xv(s, n.y, n.height);
  return `${l} ${u}`;
}
function Dd(n, {
  attrX: i,
  attrY: s,
  attrScale: l,
  originX: u,
  originY: f,
  pathLength: d,
  pathSpacing: h = 1,
  pathOffset: m = 0,
  // This is object creation, which we try to avoid per-frame.
  ...p
}, g, y) {
  if (Rd(n, p, y), g) {
    n.style.viewBox && (n.attrs.viewBox = n.style.viewBox);
    return;
  }
  n.attrs = n.style, n.style = {};
  const { attrs: b, style: T, dimensions: R } = n;
  b.transform && (R && (T.transform = b.transform), delete b.transform), R && (u !== void 0 || f !== void 0 || T.transform) && (T.transformOrigin = VR(R, u !== void 0 ? u : 0.5, f !== void 0 ? f : 0.5)), i !== void 0 && (b.x = i), s !== void 0 && (b.y = s), l !== void 0 && (b.scale = l), d !== void 0 && zR(b, d, h, m, !1);
}
const Sb = () => ({
  ...Cd(),
  attrs: {}
}), Od = (n) => typeof n == "string" && n.toLowerCase() === "svg";
function LR(n, i, s, l) {
  const u = A.useMemo(() => {
    const f = Sb();
    return Dd(f, i, Od(l), n.transformTemplate), {
      ...f.attrs,
      style: { ...f.style }
    };
  }, [i]);
  if (n.style) {
    const f = {};
    xb(f, n.style, n), u.style = { ...f, ...u.style };
  }
  return u;
}
function BR(n = !1) {
  return (s, l, u, { latestValues: f }, d) => {
    const m = (Md(s) ? LR : OR)(l, f, d, s), p = sR(l, typeof s == "string", n), g = s !== A.Fragment ? { ...p, ...m, ref: u } : {}, { children: y } = l, b = A.useMemo(() => ne(y) ? y.get() : y, [y]);
    return A.createElement(s, {
      ...g,
      children: b
    });
  };
}
function Sv(n) {
  const i = [{}, {}];
  return n == null || n.values.forEach((s, l) => {
    i[0][l] = s.get(), i[1][l] = s.getVelocity();
  }), i;
}
function Nd(n, i, s, l) {
  if (typeof i == "function") {
    const [u, f] = Sv(l);
    i = i(s !== void 0 ? s : n.custom, u, f);
  }
  if (typeof i == "string" && (i = n.variants && n.variants[i]), typeof i == "function") {
    const [u, f] = Sv(l);
    i = i(s !== void 0 ? s : n.custom, u, f);
  }
  return i;
}
const jf = (n) => Array.isArray(n), UR = (n) => !!(n && typeof n == "object" && n.mix && n.toValue), kR = (n) => jf(n) ? n[n.length - 1] || 0 : n;
function eo(n) {
  const i = ne(n) ? n.get() : n;
  return UR(i) ? i.toValue() : i;
}
function HR({ scrapeMotionValuesFromProps: n, createRenderState: i, onUpdate: s }, l, u, f) {
  const d = {
    latestValues: PR(l, u, f, n),
    renderState: i()
  };
  return s && (d.onMount = (h) => s({ props: l, current: h, ...d }), d.onUpdate = (h) => s(h)), d;
}
const Tb = (n) => (i, s) => {
  const l = A.useContext(No), u = A.useContext(yd), f = () => HR(n, i, l, u);
  return s ? f() : co(f);
};
function PR(n, i, s, l) {
  const u = {}, f = l(n, {});
  for (const b in f)
    u[b] = eo(f[b]);
  let { initial: d, animate: h } = n;
  const m = _o(n), p = hb(n);
  i && p && !m && n.inherit !== !1 && (d === void 0 && (d = i.initial), h === void 0 && (h = i.animate));
  let g = s ? s.initial === !1 : !1;
  g = g || d === !1;
  const y = g ? h : d;
  if (y && typeof y != "boolean" && !jo(y)) {
    const b = Array.isArray(y) ? y : [y];
    for (let T = 0; T < b.length; T++) {
      const R = Nd(n, b[T]);
      if (R) {
        const { transitionEnd: w, transition: M, ...O } = R;
        for (const z in O) {
          let U = O[z];
          if (Array.isArray(U)) {
            const q = g ? U.length - 1 : 0;
            U = U[q];
          }
          U !== null && (u[z] = U);
        }
        for (const z in w)
          u[z] = w[z];
      }
    }
  }
  return u;
}
function jd(n, i, s) {
  var l;
  const { style: u } = n, f = {};
  for (const d in u)
    (ne(u[d]) || i.style && ne(i.style[d]) || yb(d, n) || ((l = s == null ? void 0 : s.getValue(d)) === null || l === void 0 ? void 0 : l.liveStyle) !== void 0) && (f[d] = u[d]);
  return f;
}
const qR = {
  useVisualState: Tb({
    scrapeMotionValuesFromProps: jd,
    createRenderState: Cd
  })
};
function Ab(n, i) {
  try {
    i.dimensions = typeof n.getBBox == "function" ? n.getBBox() : n.getBoundingClientRect();
  } catch {
    i.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
function wb(n, { style: i, vars: s }, l, u) {
  Object.assign(n.style, i, u && u.getProjectionStyles(l));
  for (const f in s)
    n.style.setProperty(f, s[f]);
}
const Eb = /* @__PURE__ */ new Set([
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
function Rb(n, i, s, l) {
  wb(n, i, void 0, l);
  for (const u in i.attrs)
    n.setAttribute(Eb.has(u) ? u : Td(u), i.attrs[u]);
}
function Cb(n, i, s) {
  const l = jd(n, i, s);
  for (const u in n)
    if (ne(n[u]) || ne(i[u])) {
      const f = ls.indexOf(u) !== -1 ? "attr" + u.charAt(0).toUpperCase() + u.substring(1) : u;
      l[f] = n[u];
    }
  return l;
}
const Tv = ["x", "y", "width", "height", "cx", "cy", "r"], GR = {
  useVisualState: Tb({
    scrapeMotionValuesFromProps: Cb,
    createRenderState: Sb,
    onUpdate: ({ props: n, prevProps: i, current: s, renderState: l, latestValues: u }) => {
      if (!s)
        return;
      let f = !!n.drag;
      if (!f) {
        for (const h in u)
          if (ea.has(h)) {
            f = !0;
            break;
          }
      }
      if (!f)
        return;
      let d = !i;
      if (i)
        for (let h = 0; h < Tv.length; h++) {
          const m = Tv[h];
          n[m] !== i[m] && (d = !0);
        }
      d && Nt.read(() => {
        Ab(s, l), Nt.render(() => {
          Dd(l, u, Od(s.tagName), n.transformTemplate), Rb(s, l);
        });
      });
    }
  })
};
function YR(n, i) {
  return function(l, { forwardMotionProps: u } = { forwardMotionProps: !1 }) {
    const d = {
      ...Md(l) ? GR : qR,
      preloadedFeatures: n,
      useRender: BR(u),
      createVisualElement: i,
      Component: l
    };
    return mR(d);
  };
}
function Tr(n, i, s) {
  const l = n.getProps();
  return Nd(l, i, s !== void 0 ? s : l.custom, n);
}
function _d(n, i) {
  return n ? n[i] || n.default || n : void 0;
}
const Mb = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...ls
]);
function zd(n, i) {
  n.indexOf(i) === -1 && n.push(i);
}
function Vd(n, i) {
  const s = n.indexOf(i);
  s > -1 && n.splice(s, 1);
}
class Ld {
  constructor() {
    this.subscriptions = [];
  }
  add(i) {
    return zd(this.subscriptions, i), () => Vd(this.subscriptions, i);
  }
  notify(i, s, l) {
    const u = this.subscriptions.length;
    if (u)
      if (u === 1)
        this.subscriptions[0](i, s, l);
      else
        for (let f = 0; f < u; f++) {
          const d = this.subscriptions[f];
          d && d(i, s, l);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function Db(n, i) {
  return i ? n * (1e3 / i) : 0;
}
let no;
function XR() {
  no = void 0;
}
const on = {
  now: () => (no === void 0 && on.set(re.isProcessing || I2.useManualTiming ? re.timestamp : performance.now()), no),
  set: (n) => {
    no = n, queueMicrotask(XR);
  }
}, Av = 30, KR = (n) => !isNaN(parseFloat(n));
class ZR {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(i, s = {}) {
    this.version = "12.6.1", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (l, u = !0) => {
      const f = on.now();
      this.updatedAt !== f && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(l), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), u && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(i), this.owner = s.owner;
  }
  setCurrent(i) {
    this.current = i, this.updatedAt = on.now(), this.canTrackVelocity === null && i !== void 0 && (this.canTrackVelocity = KR(this.current));
  }
  setPrevFrameValue(i = this.current) {
    this.prevFrameValue = i, this.prevUpdatedAt = this.updatedAt;
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
  onChange(i) {
    return this.on("change", i);
  }
  on(i, s) {
    this.events[i] || (this.events[i] = new Ld());
    const l = this.events[i].add(s);
    return i === "change" ? () => {
      l(), Nt.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : l;
  }
  clearListeners() {
    for (const i in this.events)
      this.events[i].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(i, s) {
    this.passiveEffect = i, this.stopPassiveEffect = s;
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
  set(i, s = !0) {
    !s || !this.passiveEffect ? this.updateAndNotify(i, s) : this.passiveEffect(i, this.updateAndNotify);
  }
  setWithVelocity(i, s, l) {
    this.set(s), this.prev = void 0, this.prevFrameValue = i, this.prevUpdatedAt = this.updatedAt - l;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(i, s = !0) {
    this.updateAndNotify(i), this.prev = i, this.prevUpdatedAt = this.prevFrameValue = void 0, s && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
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
    const i = on.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || i - this.updatedAt > Av)
      return 0;
    const s = Math.min(this.updatedAt - this.prevUpdatedAt, Av);
    return Db(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
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
  start(i) {
    return this.stop(), new Promise((s) => {
      this.hasAnimated = !0, this.animation = i(s), this.events.animationStart && this.events.animationStart.notify();
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
function Ia(n, i) {
  return new ZR(n, i);
}
function QR(n, i, s) {
  n.hasValue(i) ? n.getValue(i).set(s) : n.addValue(i, Ia(s));
}
function FR(n, i) {
  const s = Tr(n, i);
  let { transitionEnd: l = {}, transition: u = {}, ...f } = s || {};
  f = { ...f, ...l };
  for (const d in f) {
    const h = kR(f[d]);
    QR(n, d, h);
  }
}
function WR(n) {
  return !!(ne(n) && n.add);
}
function _f(n, i) {
  const s = n.getValue("willChange");
  if (WR(s))
    return s.add(i);
}
function Ob(n) {
  return n.props[mb];
}
// @__NO_SIDE_EFFECTS__
function Bd(n) {
  let i;
  return () => (i === void 0 && (i = n()), i);
}
const $R = /* @__PURE__ */ Bd(() => window.ScrollTimeline !== void 0);
class JR {
  constructor(i) {
    this.stop = () => this.runAll("stop"), this.animations = i.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((i) => "finished" in i ? i.finished : i));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(i) {
    return this.animations[0][i];
  }
  setAll(i, s) {
    for (let l = 0; l < this.animations.length; l++)
      this.animations[l][i] = s;
  }
  attachTimeline(i, s) {
    const l = this.animations.map((u) => {
      if ($R() && u.attachTimeline)
        return u.attachTimeline(i);
      if (typeof s == "function")
        return s(u);
    });
    return () => {
      l.forEach((u, f) => {
        u && u(), this.animations[f].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(i) {
    this.setAll("time", i);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(i) {
    this.setAll("speed", i);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let i = 0;
    for (let s = 0; s < this.animations.length; s++)
      i = Math.max(i, this.animations[s].duration);
    return i;
  }
  runAll(i) {
    this.animations.forEach((s) => s[i]());
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
class IR extends JR {
  then(i, s) {
    return Promise.all(this.animations).then(i).catch(s);
  }
}
const On = /* @__NO_SIDE_EFFECTS__ */ (n) => n * 1e3, Nn = /* @__NO_SIDE_EFFECTS__ */ (n) => n / 1e3;
function Ud(n) {
  return typeof n == "function";
}
function wv(n, i) {
  n.timeline = i, n.onfinish = null;
}
const kd = (n) => Array.isArray(n) && typeof n[0] == "number", tC = {
  linearEasing: void 0
};
function eC(n, i) {
  const s = /* @__PURE__ */ Bd(n);
  return () => {
    var l;
    return (l = tC[i]) !== null && l !== void 0 ? l : s();
  };
}
const ho = /* @__PURE__ */ eC(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), ts = /* @__NO_SIDE_EFFECTS__ */ (n, i, s) => {
  const l = i - n;
  return l === 0 ? 1 : (s - n) / l;
}, Nb = (n, i, s = 10) => {
  let l = "";
  const u = Math.max(Math.round(i / s), 2);
  for (let f = 0; f < u; f++)
    l += n(/* @__PURE__ */ ts(0, u - 1, f)) + ", ";
  return `linear(${l.substring(0, l.length - 2)})`;
};
function jb(n) {
  return !!(typeof n == "function" && ho() || !n || typeof n == "string" && (n in zf || ho()) || kd(n) || Array.isArray(n) && n.every(jb));
}
const cr = ([n, i, s, l]) => `cubic-bezier(${n}, ${i}, ${s}, ${l})`, zf = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cr([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cr([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cr([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cr([0.33, 1.53, 0.69, 0.99])
};
function _b(n, i) {
  if (n)
    return typeof n == "function" && ho() ? Nb(n, i) : kd(n) ? cr(n) : Array.isArray(n) ? n.map((s) => _b(s, i) || zf.easeOut) : zf[n];
}
const zb = (n, i, s) => (((1 - 3 * s + 3 * i) * n + (3 * s - 6 * i)) * n + 3 * i) * n, nC = 1e-7, iC = 12;
function aC(n, i, s, l, u) {
  let f, d, h = 0;
  do
    d = i + (s - i) / 2, f = zb(d, l, u) - n, f > 0 ? s = d : i = d;
  while (Math.abs(f) > nC && ++h < iC);
  return d;
}
function Cr(n, i, s, l) {
  if (n === i && s === l)
    return xe;
  const u = (f) => aC(f, 0, 1, n, s);
  return (f) => f === 0 || f === 1 ? f : zb(u(f), i, l);
}
const Vb = (n) => (i) => i <= 0.5 ? n(2 * i) / 2 : (2 - n(2 * (1 - i))) / 2, Lb = (n) => (i) => 1 - n(1 - i), Bb = /* @__PURE__ */ Cr(0.33, 1.53, 0.69, 0.99), Hd = /* @__PURE__ */ Lb(Bb), Ub = /* @__PURE__ */ Vb(Hd), kb = (n) => (n *= 2) < 1 ? 0.5 * Hd(n) : 0.5 * (2 - Math.pow(2, -10 * (n - 1))), Pd = (n) => 1 - Math.sin(Math.acos(n)), Hb = Lb(Pd), Pb = Vb(Pd), qb = (n) => /^0[^.\s]+$/u.test(n);
function sC(n) {
  return typeof n == "number" ? n === 0 : n !== null ? n === "none" || n === "0" || qb(n) : !0;
}
const dr = (n) => Math.round(n * 1e5) / 1e5, qd = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function rC(n) {
  return n == null;
}
const lC = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Gd = (n, i) => (s) => !!(typeof s == "string" && lC.test(s) && s.startsWith(n) || i && !rC(s) && Object.prototype.hasOwnProperty.call(s, i)), Gb = (n, i, s) => (l) => {
  if (typeof l != "string")
    return l;
  const [u, f, d, h] = l.match(qd);
  return {
    [n]: parseFloat(u),
    [i]: parseFloat(f),
    [s]: parseFloat(d),
    alpha: h !== void 0 ? parseFloat(h) : 1
  };
}, oC = (n) => zn(0, 255, n), of = {
  ...os,
  transform: (n) => Math.round(oC(n))
}, Zi = {
  test: /* @__PURE__ */ Gd("rgb", "red"),
  parse: /* @__PURE__ */ Gb("red", "green", "blue"),
  transform: ({ red: n, green: i, blue: s, alpha: l = 1 }) => "rgba(" + of.transform(n) + ", " + of.transform(i) + ", " + of.transform(s) + ", " + dr(Sr.transform(l)) + ")"
};
function uC(n) {
  let i = "", s = "", l = "", u = "";
  return n.length > 5 ? (i = n.substring(1, 3), s = n.substring(3, 5), l = n.substring(5, 7), u = n.substring(7, 9)) : (i = n.substring(1, 2), s = n.substring(2, 3), l = n.substring(3, 4), u = n.substring(4, 5), i += i, s += s, l += l, u += u), {
    red: parseInt(i, 16),
    green: parseInt(s, 16),
    blue: parseInt(l, 16),
    alpha: u ? parseInt(u, 16) / 255 : 1
  };
}
const Vf = {
  test: /* @__PURE__ */ Gd("#"),
  parse: uC,
  transform: Zi.transform
}, Ya = {
  test: /* @__PURE__ */ Gd("hsl", "hue"),
  parse: /* @__PURE__ */ Gb("hue", "saturation", "lightness"),
  transform: ({ hue: n, saturation: i, lightness: s, alpha: l = 1 }) => "hsla(" + Math.round(n) + ", " + ln.transform(dr(i)) + ", " + ln.transform(dr(s)) + ", " + dr(Sr.transform(l)) + ")"
}, ce = {
  test: (n) => Zi.test(n) || Vf.test(n) || Ya.test(n),
  parse: (n) => Zi.test(n) ? Zi.parse(n) : Ya.test(n) ? Ya.parse(n) : Vf.parse(n),
  transform: (n) => typeof n == "string" ? n : n.hasOwnProperty("red") ? Zi.transform(n) : Ya.transform(n)
}, cC = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function fC(n) {
  var i, s;
  return isNaN(n) && typeof n == "string" && (((i = n.match(qd)) === null || i === void 0 ? void 0 : i.length) || 0) + (((s = n.match(cC)) === null || s === void 0 ? void 0 : s.length) || 0) > 0;
}
const Yb = "number", Xb = "color", dC = "var", hC = "var(", Ev = "${}", mC = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Ar(n) {
  const i = n.toString(), s = [], l = {
    color: [],
    number: [],
    var: []
  }, u = [];
  let f = 0;
  const h = i.replace(mC, (m) => (ce.test(m) ? (l.color.push(f), u.push(Xb), s.push(ce.parse(m))) : m.startsWith(hC) ? (l.var.push(f), u.push(dC), s.push(m)) : (l.number.push(f), u.push(Yb), s.push(parseFloat(m))), ++f, Ev)).split(Ev);
  return { values: s, split: h, indexes: l, types: u };
}
function Kb(n) {
  return Ar(n).values;
}
function Zb(n) {
  const { split: i, types: s } = Ar(n), l = i.length;
  return (u) => {
    let f = "";
    for (let d = 0; d < l; d++)
      if (f += i[d], u[d] !== void 0) {
        const h = s[d];
        h === Yb ? f += dr(u[d]) : h === Xb ? f += ce.transform(u[d]) : f += u[d];
      }
    return f;
  };
}
const pC = (n) => typeof n == "number" ? 0 : n;
function gC(n) {
  const i = Kb(n);
  return Zb(n)(i.map(pC));
}
const pi = {
  test: fC,
  parse: Kb,
  createTransformer: Zb,
  getAnimatableNone: gC
}, vC = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function yC(n) {
  const [i, s] = n.slice(0, -1).split("(");
  if (i === "drop-shadow")
    return n;
  const [l] = s.match(qd) || [];
  if (!l)
    return n;
  const u = s.replace(l, "");
  let f = vC.has(i) ? 1 : 0;
  return l !== s && (f *= 100), i + "(" + f + u + ")";
}
const bC = /\b([a-z-]*)\(.*?\)/gu, Lf = {
  ...pi,
  getAnimatableNone: (n) => {
    const i = n.match(bC);
    return i ? i.map(yC).join(" ") : n;
  }
}, xC = {
  ...Ed,
  // Color props
  color: ce,
  backgroundColor: ce,
  outlineColor: ce,
  fill: ce,
  stroke: ce,
  // Border props
  borderColor: ce,
  borderTopColor: ce,
  borderRightColor: ce,
  borderBottomColor: ce,
  borderLeftColor: ce,
  filter: Lf,
  WebkitFilter: Lf
}, Qb = (n) => xC[n];
function Fb(n, i) {
  let s = Qb(n);
  return s !== Lf && (s = pi), s.getAnimatableNone ? s.getAnimatableNone(i) : void 0;
}
const SC = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function TC(n, i, s) {
  let l = 0, u;
  for (; l < n.length && !u; ) {
    const f = n[l];
    typeof f == "string" && !SC.has(f) && Ar(f).values.length && (u = n[l]), l++;
  }
  if (u && s)
    for (const f of i)
      n[f] = Fb(s, u);
}
const Qi = (n) => n * 180 / Math.PI, Bf = (n) => {
  const i = Qi(Math.atan2(n[1], n[0]));
  return Uf(i);
}, AC = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (n) => (Math.abs(n[0]) + Math.abs(n[3])) / 2,
  rotate: Bf,
  rotateZ: Bf,
  skewX: (n) => Qi(Math.atan(n[1])),
  skewY: (n) => Qi(Math.atan(n[2])),
  skew: (n) => (Math.abs(n[1]) + Math.abs(n[2])) / 2
}, Uf = (n) => (n = n % 360, n < 0 && (n += 360), n), Rv = Bf, Cv = (n) => Math.sqrt(n[0] * n[0] + n[1] * n[1]), Mv = (n) => Math.sqrt(n[4] * n[4] + n[5] * n[5]), wC = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Cv,
  scaleY: Mv,
  scale: (n) => (Cv(n) + Mv(n)) / 2,
  rotateX: (n) => Uf(Qi(Math.atan2(n[6], n[5]))),
  rotateY: (n) => Uf(Qi(Math.atan2(-n[2], n[0]))),
  rotateZ: Rv,
  rotate: Rv,
  skewX: (n) => Qi(Math.atan(n[4])),
  skewY: (n) => Qi(Math.atan(n[1])),
  skew: (n) => (Math.abs(n[1]) + Math.abs(n[4])) / 2
};
function Dv(n) {
  return n.includes("scale") ? 1 : 0;
}
function kf(n, i) {
  if (!n || n === "none")
    return Dv(i);
  const s = n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let l, u;
  if (s)
    l = wC, u = s;
  else {
    const h = n.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    l = AC, u = h;
  }
  if (!u)
    return Dv(i);
  const f = l[i], d = u[1].split(",").map(RC);
  return typeof f == "function" ? f(d) : d[f];
}
const EC = (n, i) => {
  const { transform: s = "none" } = getComputedStyle(n);
  return kf(s, i);
};
function RC(n) {
  return parseFloat(n.trim());
}
const Ov = (n) => n === os || n === ot, CC = /* @__PURE__ */ new Set(["x", "y", "z"]), MC = ls.filter((n) => !CC.has(n));
function DC(n) {
  const i = [];
  return MC.forEach((s) => {
    const l = n.getValue(s);
    l !== void 0 && (i.push([s, l.get()]), l.set(s.startsWith("scale") ? 1 : 0));
  }), i;
}
const es = {
  // Dimensions
  width: ({ x: n }, { paddingLeft: i = "0", paddingRight: s = "0" }) => n.max - n.min - parseFloat(i) - parseFloat(s),
  height: ({ y: n }, { paddingTop: i = "0", paddingBottom: s = "0" }) => n.max - n.min - parseFloat(i) - parseFloat(s),
  top: (n, { top: i }) => parseFloat(i),
  left: (n, { left: i }) => parseFloat(i),
  bottom: ({ y: n }, { top: i }) => parseFloat(i) + (n.max - n.min),
  right: ({ x: n }, { left: i }) => parseFloat(i) + (n.max - n.min),
  // Transform
  x: (n, { transform: i }) => kf(i, "x"),
  y: (n, { transform: i }) => kf(i, "y")
};
es.translateX = es.x;
es.translateY = es.y;
const Wi = /* @__PURE__ */ new Set();
let Hf = !1, Pf = !1;
function Wb() {
  if (Pf) {
    const n = Array.from(Wi).filter((l) => l.needsMeasurement), i = new Set(n.map((l) => l.element)), s = /* @__PURE__ */ new Map();
    i.forEach((l) => {
      const u = DC(l);
      u.length && (s.set(l, u), l.render());
    }), n.forEach((l) => l.measureInitialState()), i.forEach((l) => {
      l.render();
      const u = s.get(l);
      u && u.forEach(([f, d]) => {
        var h;
        (h = l.getValue(f)) === null || h === void 0 || h.set(d);
      });
    }), n.forEach((l) => l.measureEndState()), n.forEach((l) => {
      l.suspendedScrollY !== void 0 && window.scrollTo(0, l.suspendedScrollY);
    });
  }
  Pf = !1, Hf = !1, Wi.forEach((n) => n.complete()), Wi.clear();
}
function $b() {
  Wi.forEach((n) => {
    n.readKeyframes(), n.needsMeasurement && (Pf = !0);
  });
}
function OC() {
  $b(), Wb();
}
class Yd {
  constructor(i, s, l, u, f, d = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...i], this.onComplete = s, this.name = l, this.motionValue = u, this.element = f, this.isAsync = d;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (Wi.add(this), Hf || (Hf = !0, Nt.read($b), Nt.resolveKeyframes(Wb))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: i, name: s, element: l, motionValue: u } = this;
    for (let f = 0; f < i.length; f++)
      if (i[f] === null)
        if (f === 0) {
          const d = u == null ? void 0 : u.get(), h = i[i.length - 1];
          if (d !== void 0)
            i[0] = d;
          else if (l && s) {
            const m = l.readValue(s, h);
            m != null && (i[0] = m);
          }
          i[0] === void 0 && (i[0] = h), u && d === void 0 && u.set(i[0]);
        } else
          i[f] = i[f - 1];
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
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), Wi.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, Wi.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const Jb = (n) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n), NC = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function jC(n) {
  const i = NC.exec(n);
  if (!i)
    return [,];
  const [, s, l, u] = i;
  return [`--${s ?? l}`, u];
}
function Ib(n, i, s = 1) {
  const [l, u] = jC(n);
  if (!l)
    return;
  const f = window.getComputedStyle(i).getPropertyValue(l);
  if (f) {
    const d = f.trim();
    return Jb(d) ? parseFloat(d) : d;
  }
  return wd(u) ? Ib(u, i, s + 1) : u;
}
const t1 = (n) => (i) => i.test(n), _C = {
  test: (n) => n === "auto",
  parse: (n) => n
}, e1 = [os, ot, ln, ci, TR, SR, _C], Nv = (n) => e1.find(t1(n));
class n1 extends Yd {
  constructor(i, s, l, u, f) {
    super(i, s, l, u, f, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: i, element: s, name: l } = this;
    if (!s || !s.current)
      return;
    super.readKeyframes();
    for (let m = 0; m < i.length; m++) {
      let p = i[m];
      if (typeof p == "string" && (p = p.trim(), wd(p))) {
        const g = Ib(p, s.current);
        g !== void 0 && (i[m] = g), m === i.length - 1 && (this.finalKeyframe = p);
      }
    }
    if (this.resolveNoneKeyframes(), !Mb.has(l) || i.length !== 2)
      return;
    const [u, f] = i, d = Nv(u), h = Nv(f);
    if (d !== h)
      if (Ov(d) && Ov(h))
        for (let m = 0; m < i.length; m++) {
          const p = i[m];
          typeof p == "string" && (i[m] = parseFloat(p));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: i, name: s } = this, l = [];
    for (let u = 0; u < i.length; u++)
      sC(i[u]) && l.push(u);
    l.length && TC(i, l, s);
  }
  measureInitialState() {
    const { element: i, unresolvedKeyframes: s, name: l } = this;
    if (!i || !i.current)
      return;
    l === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = es[l](i.measureViewportBox(), window.getComputedStyle(i.current)), s[0] = this.measuredOrigin;
    const u = s[s.length - 1];
    u !== void 0 && i.getValue(l, u).jump(u, !1);
  }
  measureEndState() {
    var i;
    const { element: s, name: l, unresolvedKeyframes: u } = this;
    if (!s || !s.current)
      return;
    const f = s.getValue(l);
    f && f.jump(this.measuredOrigin, !1);
    const d = u.length - 1, h = u[d];
    u[d] = es[l](s.measureViewportBox(), window.getComputedStyle(s.current)), h !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = h), !((i = this.removedTransforms) === null || i === void 0) && i.length && this.removedTransforms.forEach(([m, p]) => {
      s.getValue(m).set(p);
    }), this.resolveNoneKeyframes();
  }
}
const jv = (n, i) => i === "zIndex" ? !1 : !!(typeof n == "number" || Array.isArray(n) || typeof n == "string" && // It's animatable if we have a string
(pi.test(n) || n === "0") && // And it contains numbers and/or colors
!n.startsWith("url("));
function zC(n) {
  const i = n[0];
  if (n.length === 1)
    return !0;
  for (let s = 0; s < n.length; s++)
    if (n[s] !== i)
      return !0;
}
function VC(n, i, s, l) {
  const u = n[0];
  if (u === null)
    return !1;
  if (i === "display" || i === "visibility")
    return !0;
  const f = n[n.length - 1], d = jv(u, i), h = jv(f, i);
  return !d || !h ? !1 : zC(n) || (s === "spring" || Ud(s)) && l;
}
const LC = (n) => n !== null;
function zo(n, { repeat: i, repeatType: s = "loop" }, l) {
  const u = n.filter(LC), f = i && s !== "loop" && i % 2 === 1 ? 0 : u.length - 1;
  return !f || l === void 0 ? u[f] : l;
}
const BC = 40;
class i1 {
  constructor({ autoplay: i = !0, delay: s = 0, type: l = "keyframes", repeat: u = 0, repeatDelay: f = 0, repeatType: d = "loop", ...h }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = on.now(), this.options = {
      autoplay: i,
      delay: s,
      type: l,
      repeat: u,
      repeatDelay: f,
      repeatType: d,
      ...h
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
    return this.resolvedAt ? this.resolvedAt - this.createdAt > BC ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && OC(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(i, s) {
    this.resolvedAt = on.now(), this.hasAttemptedResolve = !0;
    const { name: l, type: u, velocity: f, delay: d, onComplete: h, onUpdate: m, isGenerator: p } = this.options;
    if (!p && !VC(i, l, u, f))
      if (d)
        this.options.duration = 0;
      else {
        m && m(zo(i, this.options, s)), h && h(), this.resolveFinishedPromise();
        return;
      }
    const g = this.initPlayback(i, s);
    g !== !1 && (this._resolved = {
      keyframes: i,
      finalKeyframe: s,
      ...g
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(i, s) {
    return this.currentFinishedPromise.then(i, s);
  }
  flatten() {
    this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear");
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((i) => {
      this.resolveFinishedPromise = i;
    });
  }
}
const qf = 2e4;
function a1(n) {
  let i = 0;
  const s = 50;
  let l = n.next(i);
  for (; !l.done && i < qf; )
    i += s, l = n.next(i);
  return i >= qf ? 1 / 0 : i;
}
const Ut = (n, i, s) => n + (i - n) * s;
function uf(n, i, s) {
  return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? n + (i - n) * 6 * s : s < 1 / 2 ? i : s < 2 / 3 ? n + (i - n) * (2 / 3 - s) * 6 : n;
}
function UC({ hue: n, saturation: i, lightness: s, alpha: l }) {
  n /= 360, i /= 100, s /= 100;
  let u = 0, f = 0, d = 0;
  if (!i)
    u = f = d = s;
  else {
    const h = s < 0.5 ? s * (1 + i) : s + i - s * i, m = 2 * s - h;
    u = uf(m, h, n + 1 / 3), f = uf(m, h, n), d = uf(m, h, n - 1 / 3);
  }
  return {
    red: Math.round(u * 255),
    green: Math.round(f * 255),
    blue: Math.round(d * 255),
    alpha: l
  };
}
function mo(n, i) {
  return (s) => s > 0 ? i : n;
}
const cf = (n, i, s) => {
  const l = n * n, u = s * (i * i - l) + l;
  return u < 0 ? 0 : Math.sqrt(u);
}, kC = [Vf, Zi, Ya], HC = (n) => kC.find((i) => i.test(n));
function _v(n) {
  const i = HC(n);
  if (!i)
    return !1;
  let s = i.parse(n);
  return i === Ya && (s = UC(s)), s;
}
const zv = (n, i) => {
  const s = _v(n), l = _v(i);
  if (!s || !l)
    return mo(n, i);
  const u = { ...s };
  return (f) => (u.red = cf(s.red, l.red, f), u.green = cf(s.green, l.green, f), u.blue = cf(s.blue, l.blue, f), u.alpha = Ut(s.alpha, l.alpha, f), Zi.transform(u));
}, PC = (n, i) => (s) => i(n(s)), Mr = (...n) => n.reduce(PC), Gf = /* @__PURE__ */ new Set(["none", "hidden"]);
function qC(n, i) {
  return Gf.has(n) ? (s) => s <= 0 ? n : i : (s) => s >= 1 ? i : n;
}
function GC(n, i) {
  return (s) => Ut(n, i, s);
}
function Xd(n) {
  return typeof n == "number" ? GC : typeof n == "string" ? wd(n) ? mo : ce.test(n) ? zv : KC : Array.isArray(n) ? s1 : typeof n == "object" ? ce.test(n) ? zv : YC : mo;
}
function s1(n, i) {
  const s = [...n], l = s.length, u = n.map((f, d) => Xd(f)(f, i[d]));
  return (f) => {
    for (let d = 0; d < l; d++)
      s[d] = u[d](f);
    return s;
  };
}
function YC(n, i) {
  const s = { ...n, ...i }, l = {};
  for (const u in s)
    n[u] !== void 0 && i[u] !== void 0 && (l[u] = Xd(n[u])(n[u], i[u]));
  return (u) => {
    for (const f in l)
      s[f] = l[f](u);
    return s;
  };
}
function XC(n, i) {
  var s;
  const l = [], u = { color: 0, var: 0, number: 0 };
  for (let f = 0; f < i.values.length; f++) {
    const d = i.types[f], h = n.indexes[d][u[d]], m = (s = n.values[h]) !== null && s !== void 0 ? s : 0;
    l[f] = m, u[d]++;
  }
  return l;
}
const KC = (n, i) => {
  const s = pi.createTransformer(i), l = Ar(n), u = Ar(i);
  return l.indexes.var.length === u.indexes.var.length && l.indexes.color.length === u.indexes.color.length && l.indexes.number.length >= u.indexes.number.length ? Gf.has(n) && !u.values.length || Gf.has(i) && !l.values.length ? qC(n, i) : Mr(s1(XC(l, u), u.values), s) : mo(n, i);
};
function r1(n, i, s) {
  return typeof n == "number" && typeof i == "number" && typeof s == "number" ? Ut(n, i, s) : Xd(n)(n, i);
}
const ZC = 5;
function l1(n, i, s) {
  const l = Math.max(i - ZC, 0);
  return Db(s - n(l), i - l);
}
const qt = {
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
}, ff = 1e-3;
function QC({ duration: n = qt.duration, bounce: i = qt.bounce, velocity: s = qt.velocity, mass: l = qt.mass }) {
  let u, f, d = 1 - i;
  d = zn(qt.minDamping, qt.maxDamping, d), n = zn(qt.minDuration, qt.maxDuration, /* @__PURE__ */ Nn(n)), d < 1 ? (u = (p) => {
    const g = p * d, y = g * n, b = g - s, T = Yf(p, d), R = Math.exp(-y);
    return ff - b / T * R;
  }, f = (p) => {
    const y = p * d * n, b = y * s + s, T = Math.pow(d, 2) * Math.pow(p, 2) * n, R = Math.exp(-y), w = Yf(Math.pow(p, 2), d);
    return (-u(p) + ff > 0 ? -1 : 1) * ((b - T) * R) / w;
  }) : (u = (p) => {
    const g = Math.exp(-p * n), y = (p - s) * n + 1;
    return -ff + g * y;
  }, f = (p) => {
    const g = Math.exp(-p * n), y = (s - p) * (n * n);
    return g * y;
  });
  const h = 5 / n, m = WC(u, f, h);
  if (n = /* @__PURE__ */ On(n), isNaN(m))
    return {
      stiffness: qt.stiffness,
      damping: qt.damping,
      duration: n
    };
  {
    const p = Math.pow(m, 2) * l;
    return {
      stiffness: p,
      damping: d * 2 * Math.sqrt(l * p),
      duration: n
    };
  }
}
const FC = 12;
function WC(n, i, s) {
  let l = s;
  for (let u = 1; u < FC; u++)
    l = l - n(l) / i(l);
  return l;
}
function Yf(n, i) {
  return n * Math.sqrt(1 - i * i);
}
const $C = ["duration", "bounce"], JC = ["stiffness", "damping", "mass"];
function Vv(n, i) {
  return i.some((s) => n[s] !== void 0);
}
function IC(n) {
  let i = {
    velocity: qt.velocity,
    stiffness: qt.stiffness,
    damping: qt.damping,
    mass: qt.mass,
    isResolvedFromDuration: !1,
    ...n
  };
  if (!Vv(n, JC) && Vv(n, $C))
    if (n.visualDuration) {
      const s = n.visualDuration, l = 2 * Math.PI / (s * 1.2), u = l * l, f = 2 * zn(0.05, 1, 1 - (n.bounce || 0)) * Math.sqrt(u);
      i = {
        ...i,
        mass: qt.mass,
        stiffness: u,
        damping: f
      };
    } else {
      const s = QC(n);
      i = {
        ...i,
        ...s,
        mass: qt.mass
      }, i.isResolvedFromDuration = !0;
    }
  return i;
}
function o1(n = qt.visualDuration, i = qt.bounce) {
  const s = typeof n != "object" ? {
    visualDuration: n,
    keyframes: [0, 1],
    bounce: i
  } : n;
  let { restSpeed: l, restDelta: u } = s;
  const f = s.keyframes[0], d = s.keyframes[s.keyframes.length - 1], h = { done: !1, value: f }, { stiffness: m, damping: p, mass: g, duration: y, velocity: b, isResolvedFromDuration: T } = IC({
    ...s,
    velocity: -/* @__PURE__ */ Nn(s.velocity || 0)
  }), R = b || 0, w = p / (2 * Math.sqrt(m * g)), M = d - f, O = /* @__PURE__ */ Nn(Math.sqrt(m / g)), z = Math.abs(M) < 5;
  l || (l = z ? qt.restSpeed.granular : qt.restSpeed.default), u || (u = z ? qt.restDelta.granular : qt.restDelta.default);
  let U;
  if (w < 1) {
    const V = Yf(O, w);
    U = (L) => {
      const Z = Math.exp(-w * O * L);
      return d - Z * ((R + w * O * M) / V * Math.sin(V * L) + M * Math.cos(V * L));
    };
  } else if (w === 1)
    U = (V) => d - Math.exp(-O * V) * (M + (R + O * M) * V);
  else {
    const V = O * Math.sqrt(w * w - 1);
    U = (L) => {
      const Z = Math.exp(-w * O * L), F = Math.min(V * L, 300);
      return d - Z * ((R + w * O * M) * Math.sinh(F) + V * M * Math.cosh(F)) / V;
    };
  }
  const q = {
    calculatedDuration: T && y || null,
    next: (V) => {
      const L = U(V);
      if (T)
        h.done = V >= y;
      else {
        let Z = 0;
        w < 1 && (Z = V === 0 ? /* @__PURE__ */ On(R) : l1(U, V, L));
        const F = Math.abs(Z) <= l, Q = Math.abs(d - L) <= u;
        h.done = F && Q;
      }
      return h.value = h.done ? d : L, h;
    },
    toString: () => {
      const V = Math.min(a1(q), qf), L = Nb((Z) => q.next(V * Z).value, V, 30);
      return V + "ms " + L;
    }
  };
  return q;
}
function Lv({ keyframes: n, velocity: i = 0, power: s = 0.8, timeConstant: l = 325, bounceDamping: u = 10, bounceStiffness: f = 500, modifyTarget: d, min: h, max: m, restDelta: p = 0.5, restSpeed: g }) {
  const y = n[0], b = {
    done: !1,
    value: y
  }, T = (F) => h !== void 0 && F < h || m !== void 0 && F > m, R = (F) => h === void 0 ? m : m === void 0 || Math.abs(h - F) < Math.abs(m - F) ? h : m;
  let w = s * i;
  const M = y + w, O = d === void 0 ? M : d(M);
  O !== M && (w = O - y);
  const z = (F) => -w * Math.exp(-F / l), U = (F) => O + z(F), q = (F) => {
    const Q = z(F), W = U(F);
    b.done = Math.abs(Q) <= p, b.value = b.done ? O : W;
  };
  let V, L;
  const Z = (F) => {
    T(b.value) && (V = F, L = o1({
      keyframes: [b.value, R(b.value)],
      velocity: l1(U, F, b.value),
      // TODO: This should be passing * 1000
      damping: u,
      stiffness: f,
      restDelta: p,
      restSpeed: g
    }));
  };
  return Z(0), {
    calculatedDuration: null,
    next: (F) => {
      let Q = !1;
      return !L && V === void 0 && (Q = !0, q(F), Z(F)), V !== void 0 && F >= V ? L.next(F - V) : (!Q && q(F), b);
    }
  };
}
const tM = /* @__PURE__ */ Cr(0.42, 0, 1, 1), eM = /* @__PURE__ */ Cr(0, 0, 0.58, 1), u1 = /* @__PURE__ */ Cr(0.42, 0, 0.58, 1), nM = (n) => Array.isArray(n) && typeof n[0] != "number", iM = {
  linear: xe,
  easeIn: tM,
  easeInOut: u1,
  easeOut: eM,
  circIn: Pd,
  circInOut: Pb,
  circOut: Hb,
  backIn: Hd,
  backInOut: Ub,
  backOut: Bb,
  anticipate: kb
}, Bv = (n) => {
  if (kd(n)) {
    ub(n.length === 4);
    const [i, s, l, u] = n;
    return Cr(i, s, l, u);
  } else if (typeof n == "string")
    return iM[n];
  return n;
};
function aM(n, i, s) {
  const l = [], u = s || r1, f = n.length - 1;
  for (let d = 0; d < f; d++) {
    let h = u(n[d], n[d + 1]);
    if (i) {
      const m = Array.isArray(i) ? i[d] || xe : i;
      h = Mr(m, h);
    }
    l.push(h);
  }
  return l;
}
function sM(n, i, { clamp: s = !0, ease: l, mixer: u } = {}) {
  const f = n.length;
  if (ub(f === i.length), f === 1)
    return () => i[0];
  if (f === 2 && i[0] === i[1])
    return () => i[1];
  const d = n[0] === n[1];
  n[0] > n[f - 1] && (n = [...n].reverse(), i = [...i].reverse());
  const h = aM(i, l, u), m = h.length, p = (g) => {
    if (d && g < n[0])
      return i[0];
    let y = 0;
    if (m > 1)
      for (; y < n.length - 2 && !(g < n[y + 1]); y++)
        ;
    const b = /* @__PURE__ */ ts(n[y], n[y + 1], g);
    return h[y](b);
  };
  return s ? (g) => p(zn(n[0], n[f - 1], g)) : p;
}
function rM(n, i) {
  const s = n[n.length - 1];
  for (let l = 1; l <= i; l++) {
    const u = /* @__PURE__ */ ts(0, i, l);
    n.push(Ut(s, 1, u));
  }
}
function lM(n) {
  const i = [0];
  return rM(i, n.length - 1), i;
}
function oM(n, i) {
  return n.map((s) => s * i);
}
function uM(n, i) {
  return n.map(() => i || u1).splice(0, n.length - 1);
}
function po({ duration: n = 300, keyframes: i, times: s, ease: l = "easeInOut" }) {
  const u = nM(l) ? l.map(Bv) : Bv(l), f = {
    done: !1,
    value: i[0]
  }, d = oM(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    s && s.length === i.length ? s : lM(i),
    n
  ), h = sM(d, i, {
    ease: Array.isArray(u) ? u : uM(i, u)
  });
  return {
    calculatedDuration: n,
    next: (m) => (f.value = h(m), f.done = m >= n, f)
  };
}
const cM = (n) => {
  const i = ({ timestamp: s }) => n(s);
  return {
    start: () => Nt.update(i, !0),
    stop: () => mi(i),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => re.isProcessing ? re.timestamp : on.now()
  };
}, fM = {
  decay: Lv,
  inertia: Lv,
  tween: po,
  keyframes: po,
  spring: o1
}, dM = (n) => n / 100;
class Vo extends i1 {
  constructor(i) {
    super(i), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: m } = this.options;
      m && m();
    };
    const { name: s, motionValue: l, element: u, keyframes: f } = this.options, d = (u == null ? void 0 : u.KeyframeResolver) || Yd, h = (m, p) => this.onKeyframesResolved(m, p);
    this.resolver = new d(f, h, s, l, u), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(i) {
    const { type: s = "keyframes", repeat: l = 0, repeatDelay: u = 0, repeatType: f, velocity: d = 0 } = this.options, h = Ud(s) ? s : fM[s] || po;
    let m, p;
    h !== po && typeof i[0] != "number" && (m = Mr(dM, r1(i[0], i[1])), i = [0, 100]);
    const g = h({ ...this.options, keyframes: i });
    f === "mirror" && (p = h({
      ...this.options,
      keyframes: [...i].reverse(),
      velocity: -d
    })), g.calculatedDuration === null && (g.calculatedDuration = a1(g));
    const { calculatedDuration: y } = g, b = y + u, T = b * (l + 1) - u;
    return {
      generator: g,
      mirroredGenerator: p,
      mapPercentToKeyframes: m,
      calculatedDuration: y,
      resolvedDuration: b,
      totalDuration: T
    };
  }
  onPostResolved() {
    const { autoplay: i = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !i ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(i, s = !1) {
    const { resolved: l } = this;
    if (!l) {
      const { keyframes: F } = this.options;
      return { done: !0, value: F[F.length - 1] };
    }
    const { finalKeyframe: u, generator: f, mirroredGenerator: d, mapPercentToKeyframes: h, keyframes: m, calculatedDuration: p, totalDuration: g, resolvedDuration: y } = l;
    if (this.startTime === null)
      return f.next(0);
    const { delay: b, repeat: T, repeatType: R, repeatDelay: w, onUpdate: M } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, i) : this.speed < 0 && (this.startTime = Math.min(i - g / this.speed, this.startTime)), s ? this.currentTime = i : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(i - this.startTime) * this.speed;
    const O = this.currentTime - b * (this.speed >= 0 ? 1 : -1), z = this.speed >= 0 ? O < 0 : O > g;
    this.currentTime = Math.max(O, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = g);
    let U = this.currentTime, q = f;
    if (T) {
      const F = Math.min(this.currentTime, g) / y;
      let Q = Math.floor(F), W = F % 1;
      !W && F >= 1 && (W = 1), W === 1 && Q--, Q = Math.min(Q, T + 1), !!(Q % 2) && (R === "reverse" ? (W = 1 - W, w && (W -= w / y)) : R === "mirror" && (q = d)), U = zn(0, 1, W) * y;
    }
    const V = z ? { done: !1, value: m[0] } : q.next(U);
    h && (V.value = h(V.value));
    let { done: L } = V;
    !z && p !== null && (L = this.speed >= 0 ? this.currentTime >= g : this.currentTime <= 0);
    const Z = this.holdTime === null && (this.state === "finished" || this.state === "running" && L);
    return Z && u !== void 0 && (V.value = zo(m, this.options, u)), M && M(V.value), Z && this.finish(), V;
  }
  get duration() {
    const { resolved: i } = this;
    return i ? /* @__PURE__ */ Nn(i.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ Nn(this.currentTime);
  }
  set time(i) {
    i = /* @__PURE__ */ On(i), this.currentTime = i, this.holdTime !== null || this.speed === 0 ? this.holdTime = i : this.driver && (this.startTime = this.driver.now() - i / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(i) {
    const s = this.playbackSpeed !== i;
    this.playbackSpeed = i, s && (this.time = /* @__PURE__ */ Nn(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: i = cM, onPlay: s, startTime: l } = this.options;
    this.driver || (this.driver = i((f) => this.tick(f))), s && s();
    const u = this.driver.now();
    this.holdTime !== null ? this.startTime = u - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = u) : this.startTime = l ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    var i;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused", this.holdTime = (i = this.currentTime) !== null && i !== void 0 ? i : 0;
  }
  complete() {
    this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.teardown(), this.state = "finished";
    const { onComplete: i } = this.options;
    i && i();
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
  sample(i) {
    return this.startTime = 0, this.tick(i, !0);
  }
}
function hM(n) {
  return new Vo(n);
}
const mM = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function pM(n, i, s, { delay: l = 0, duration: u = 300, repeat: f = 0, repeatType: d = "loop", ease: h = "easeInOut", times: m } = {}) {
  const p = { [i]: s };
  m && (p.offset = m);
  const g = _b(h, u);
  return Array.isArray(g) && (p.easing = g), n.animate(p, {
    delay: l,
    duration: u,
    easing: Array.isArray(g) ? "linear" : g,
    fill: "both",
    iterations: f + 1,
    direction: d === "reverse" ? "alternate" : "normal"
  });
}
const gM = /* @__PURE__ */ Bd(() => Object.hasOwnProperty.call(Element.prototype, "animate")), go = 10, vM = 2e4;
function yM(n) {
  return Ud(n.type) || n.type === "spring" || !jb(n.ease);
}
function bM(n, i) {
  const s = new Vo({
    ...i,
    keyframes: n,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let l = { done: !1, value: n[0] };
  const u = [];
  let f = 0;
  for (; !l.done && f < vM; )
    l = s.sample(f), u.push(l.value), f += go;
  return {
    times: void 0,
    keyframes: u,
    duration: f - go,
    ease: "linear"
  };
}
const c1 = {
  anticipate: kb,
  backInOut: Ub,
  circInOut: Pb
};
function xM(n) {
  return n in c1;
}
class Uv extends i1 {
  constructor(i) {
    super(i);
    const { name: s, motionValue: l, element: u, keyframes: f } = this.options;
    this.resolver = new n1(f, (d, h) => this.onKeyframesResolved(d, h), s, l, u), this.resolver.scheduleResolve();
  }
  initPlayback(i, s) {
    let { duration: l = 300, times: u, ease: f, type: d, motionValue: h, name: m, startTime: p } = this.options;
    if (!h.owner || !h.owner.current)
      return !1;
    if (typeof f == "string" && ho() && xM(f) && (f = c1[f]), yM(this.options)) {
      const { onComplete: y, onUpdate: b, motionValue: T, element: R, ...w } = this.options, M = bM(i, w);
      i = M.keyframes, i.length === 1 && (i[1] = i[0]), l = M.duration, u = M.times, f = M.ease, d = "keyframes";
    }
    const g = pM(h.owner.current, m, i, { ...this.options, duration: l, times: u, ease: f });
    return g.startTime = p ?? this.calcStartTime(), this.pendingTimeline ? (wv(g, this.pendingTimeline), this.pendingTimeline = void 0) : g.onfinish = () => {
      const { onComplete: y } = this.options;
      h.set(zo(i, this.options, s)), y && y(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: g,
      duration: l,
      times: u,
      type: d,
      ease: f,
      keyframes: i
    };
  }
  get duration() {
    const { resolved: i } = this;
    if (!i)
      return 0;
    const { duration: s } = i;
    return /* @__PURE__ */ Nn(s);
  }
  get time() {
    const { resolved: i } = this;
    if (!i)
      return 0;
    const { animation: s } = i;
    return /* @__PURE__ */ Nn(s.currentTime || 0);
  }
  set time(i) {
    const { resolved: s } = this;
    if (!s)
      return;
    const { animation: l } = s;
    l.currentTime = /* @__PURE__ */ On(i);
  }
  get speed() {
    const { resolved: i } = this;
    if (!i)
      return 1;
    const { animation: s } = i;
    return s.playbackRate;
  }
  set speed(i) {
    const { resolved: s } = this;
    if (!s)
      return;
    const { animation: l } = s;
    l.playbackRate = i;
  }
  get state() {
    const { resolved: i } = this;
    if (!i)
      return "idle";
    const { animation: s } = i;
    return s.playState;
  }
  get startTime() {
    const { resolved: i } = this;
    if (!i)
      return null;
    const { animation: s } = i;
    return s.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(i) {
    if (!this._resolved)
      this.pendingTimeline = i;
    else {
      const { resolved: s } = this;
      if (!s)
        return xe;
      const { animation: l } = s;
      wv(l, i);
    }
    return xe;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved: i } = this;
    if (!i)
      return;
    const { animation: s } = i;
    s.playState === "finished" && this.updateFinishedPromise(), s.play();
  }
  pause() {
    const { resolved: i } = this;
    if (!i)
      return;
    const { animation: s } = i;
    s.pause();
  }
  stop() {
    if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
      return;
    this.resolveFinishedPromise(), this.updateFinishedPromise();
    const { resolved: i } = this;
    if (!i)
      return;
    const { animation: s, keyframes: l, duration: u, type: f, ease: d, times: h } = i;
    if (s.playState === "idle" || s.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: p, onUpdate: g, onComplete: y, element: b, ...T } = this.options, R = new Vo({
        ...T,
        keyframes: l,
        duration: u,
        type: f,
        ease: d,
        times: h,
        isGenerator: !0
      }), w = /* @__PURE__ */ On(this.time);
      p.setWithVelocity(R.sample(w - go).value, R.sample(w).value, go);
    }
    const { onStop: m } = this.options;
    m && m(), this.cancel();
  }
  complete() {
    const { resolved: i } = this;
    i && i.animation.finish();
  }
  cancel() {
    const { resolved: i } = this;
    i && i.animation.cancel();
  }
  static supports(i) {
    const { motionValue: s, name: l, repeatDelay: u, repeatType: f, damping: d, type: h } = i;
    if (!s || !s.owner || !(s.owner.current instanceof HTMLElement))
      return !1;
    const { onUpdate: m, transformTemplate: p } = s.owner.getProps();
    return gM() && l && mM.has(l) && (l !== "transform" || !p) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !m && !u && f !== "mirror" && d !== 0 && h !== "inertia";
  }
}
const SM = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, TM = (n) => ({
  type: "spring",
  stiffness: 550,
  damping: n === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), AM = {
  type: "keyframes",
  duration: 0.8
}, wM = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, EM = (n, { keyframes: i }) => i.length > 2 ? AM : ea.has(n) ? n.startsWith("scale") ? TM(i[1]) : SM : wM;
function RM({ when: n, delay: i, delayChildren: s, staggerChildren: l, staggerDirection: u, repeat: f, repeatType: d, repeatDelay: h, from: m, elapsed: p, ...g }) {
  return !!Object.keys(g).length;
}
const Kd = (n, i, s, l = {}, u, f) => (d) => {
  const h = _d(l, n) || {}, m = h.delay || l.delay || 0;
  let { elapsed: p = 0 } = l;
  p = p - /* @__PURE__ */ On(m);
  let g = {
    keyframes: Array.isArray(s) ? s : [null, s],
    ease: "easeOut",
    velocity: i.getVelocity(),
    ...h,
    delay: -p,
    onUpdate: (b) => {
      i.set(b), h.onUpdate && h.onUpdate(b);
    },
    onComplete: () => {
      d(), h.onComplete && h.onComplete();
    },
    name: n,
    motionValue: i,
    element: f ? void 0 : u
  };
  RM(h) || (g = {
    ...g,
    ...EM(n, g)
  }), g.duration && (g.duration = /* @__PURE__ */ On(g.duration)), g.repeatDelay && (g.repeatDelay = /* @__PURE__ */ On(g.repeatDelay)), g.from !== void 0 && (g.keyframes[0] = g.from);
  let y = !1;
  if ((g.type === !1 || g.duration === 0 && !g.repeatDelay) && (g.duration = 0, g.delay === 0 && (y = !0)), g.allowFlatten = !h.type && !h.ease, y && !f && i.get() !== void 0) {
    const b = zo(g.keyframes, h);
    if (b !== void 0)
      return Nt.update(() => {
        g.onUpdate(b), g.onComplete();
      }), new IR([]);
  }
  return !f && Uv.supports(g) ? new Uv(g) : new Vo(g);
};
function CM({ protectedKeys: n, needsAnimating: i }, s) {
  const l = n.hasOwnProperty(s) && i[s] !== !0;
  return i[s] = !1, l;
}
function f1(n, i, { delay: s = 0, transitionOverride: l, type: u } = {}) {
  var f;
  let { transition: d = n.getDefaultTransition(), transitionEnd: h, ...m } = i;
  l && (d = l);
  const p = [], g = u && n.animationState && n.animationState.getState()[u];
  for (const y in m) {
    const b = n.getValue(y, (f = n.latestValues[y]) !== null && f !== void 0 ? f : null), T = m[y];
    if (T === void 0 || g && CM(g, y))
      continue;
    const R = {
      delay: s,
      ..._d(d || {}, y)
    };
    let w = !1;
    if (window.MotionHandoffAnimation) {
      const O = Ob(n);
      if (O) {
        const z = window.MotionHandoffAnimation(O, y, Nt);
        z !== null && (R.startTime = z, w = !0);
      }
    }
    _f(n, y), b.start(Kd(y, b, T, n.shouldReduceMotion && Mb.has(y) ? { type: !1 } : R, n, w));
    const M = b.animation;
    M && p.push(M);
  }
  return h && Promise.all(p).then(() => {
    Nt.update(() => {
      h && FR(n, h);
    });
  }), p;
}
function Xf(n, i, s = {}) {
  var l;
  const u = Tr(n, i, s.type === "exit" ? (l = n.presenceContext) === null || l === void 0 ? void 0 : l.custom : void 0);
  let { transition: f = n.getDefaultTransition() || {} } = u || {};
  s.transitionOverride && (f = s.transitionOverride);
  const d = u ? () => Promise.all(f1(n, u, s)) : () => Promise.resolve(), h = n.variantChildren && n.variantChildren.size ? (p = 0) => {
    const { delayChildren: g = 0, staggerChildren: y, staggerDirection: b } = f;
    return MM(n, i, g + p, y, b, s);
  } : () => Promise.resolve(), { when: m } = f;
  if (m) {
    const [p, g] = m === "beforeChildren" ? [d, h] : [h, d];
    return p().then(() => g());
  } else
    return Promise.all([d(), h(s.delay)]);
}
function MM(n, i, s = 0, l = 0, u = 1, f) {
  const d = [], h = (n.variantChildren.size - 1) * l, m = u === 1 ? (p = 0) => p * l : (p = 0) => h - p * l;
  return Array.from(n.variantChildren).sort(DM).forEach((p, g) => {
    p.notify("AnimationStart", i), d.push(Xf(p, i, {
      ...f,
      delay: s + m(g)
    }).then(() => p.notify("AnimationComplete", i)));
  }), Promise.all(d);
}
function DM(n, i) {
  return n.sortNodePosition(i);
}
function OM(n, i, s = {}) {
  n.notify("AnimationStart", i);
  let l;
  if (Array.isArray(i)) {
    const u = i.map((f) => Xf(n, f, s));
    l = Promise.all(u);
  } else if (typeof i == "string")
    l = Xf(n, i, s);
  else {
    const u = typeof i == "function" ? Tr(n, i, s.custom) : i;
    l = Promise.all(f1(n, u, s));
  }
  return l.then(() => {
    n.notify("AnimationComplete", i);
  });
}
function d1(n, i) {
  if (!Array.isArray(i))
    return !1;
  const s = i.length;
  if (s !== n.length)
    return !1;
  for (let l = 0; l < s; l++)
    if (i[l] !== n[l])
      return !1;
  return !0;
}
const NM = xd.length;
function h1(n) {
  if (!n)
    return;
  if (!n.isControllingVariants) {
    const s = n.parent ? h1(n.parent) || {} : {};
    return n.props.initial !== void 0 && (s.initial = n.props.initial), s;
  }
  const i = {};
  for (let s = 0; s < NM; s++) {
    const l = xd[s], u = n.props[l];
    (br(u) || u === !1) && (i[l] = u);
  }
  return i;
}
const jM = [...bd].reverse(), _M = bd.length;
function zM(n) {
  return (i) => Promise.all(i.map(({ animation: s, options: l }) => OM(n, s, l)));
}
function VM(n) {
  let i = zM(n), s = kv(), l = !0;
  const u = (m) => (p, g) => {
    var y;
    const b = Tr(n, g, m === "exit" ? (y = n.presenceContext) === null || y === void 0 ? void 0 : y.custom : void 0);
    if (b) {
      const { transition: T, transitionEnd: R, ...w } = b;
      p = { ...p, ...w, ...R };
    }
    return p;
  };
  function f(m) {
    i = m(n);
  }
  function d(m) {
    const { props: p } = n, g = h1(n.parent) || {}, y = [], b = /* @__PURE__ */ new Set();
    let T = {}, R = 1 / 0;
    for (let M = 0; M < _M; M++) {
      const O = jM[M], z = s[O], U = p[O] !== void 0 ? p[O] : g[O], q = br(U), V = O === m ? z.isActive : null;
      V === !1 && (R = M);
      let L = U === g[O] && U !== p[O] && q;
      if (L && l && n.manuallyAnimateOnMount && (L = !1), z.protectedKeys = { ...T }, // If it isn't active and hasn't *just* been set as inactive
      !z.isActive && V === null || // If we didn't and don't have any defined prop for this animation type
      !U && !z.prevProp || // Or if the prop doesn't define an animation
      jo(U) || typeof U == "boolean")
        continue;
      const Z = LM(z.prevProp, U);
      let F = Z || // If we're making this variant active, we want to always make it active
      O === m && z.isActive && !L && q || // If we removed a higher-priority variant (i is in reverse order)
      M > R && q, Q = !1;
      const W = Array.isArray(U) ? U : [U];
      let mt = W.reduce(u(O), {});
      V === !1 && (mt = {});
      const { prevResolvedValues: Rt = {} } = z, ft = {
        ...Rt,
        ...mt
      }, pt = ($) => {
        F = !0, b.has($) && (Q = !0, b.delete($)), z.needsAnimating[$] = !0;
        const Y = n.getValue($);
        Y && (Y.liveStyle = !1);
      };
      for (const $ in ft) {
        const Y = mt[$], nt = Rt[$];
        if (T.hasOwnProperty($))
          continue;
        let C = !1;
        jf(Y) && jf(nt) ? C = !d1(Y, nt) : C = Y !== nt, C ? Y != null ? pt($) : b.add($) : Y !== void 0 && b.has($) ? pt($) : z.protectedKeys[$] = !0;
      }
      z.prevProp = U, z.prevResolvedValues = mt, z.isActive && (T = { ...T, ...mt }), l && n.blockInitialAnimation && (F = !1), F && (!(L && Z) || Q) && y.push(...W.map(($) => ({
        animation: $,
        options: { type: O }
      })));
    }
    if (b.size) {
      const M = {};
      if (typeof p.initial != "boolean") {
        const O = Tr(n, Array.isArray(p.initial) ? p.initial[0] : p.initial);
        O && O.transition && (M.transition = O.transition);
      }
      b.forEach((O) => {
        const z = n.getBaseTarget(O), U = n.getValue(O);
        U && (U.liveStyle = !0), M[O] = z ?? null;
      }), y.push({ animation: M });
    }
    let w = !!y.length;
    return l && (p.initial === !1 || p.initial === p.animate) && !n.manuallyAnimateOnMount && (w = !1), l = !1, w ? i(y) : Promise.resolve();
  }
  function h(m, p) {
    var g;
    if (s[m].isActive === p)
      return Promise.resolve();
    (g = n.variantChildren) === null || g === void 0 || g.forEach((b) => {
      var T;
      return (T = b.animationState) === null || T === void 0 ? void 0 : T.setActive(m, p);
    }), s[m].isActive = p;
    const y = d(m);
    for (const b in s)
      s[b].protectedKeys = {};
    return y;
  }
  return {
    animateChanges: d,
    setActive: h,
    setAnimateFunction: f,
    getState: () => s,
    reset: () => {
      s = kv(), l = !0;
    }
  };
}
function LM(n, i) {
  return typeof i == "string" ? i !== n : Array.isArray(i) ? !d1(i, n) : !1;
}
function Xi(n = !1) {
  return {
    isActive: n,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function kv() {
  return {
    animate: Xi(!0),
    whileInView: Xi(),
    whileHover: Xi(),
    whileTap: Xi(),
    whileDrag: Xi(),
    whileFocus: Xi(),
    exit: Xi()
  };
}
class vi {
  constructor(i) {
    this.isMounted = !1, this.node = i;
  }
  update() {
  }
}
class BM extends vi {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(i) {
    super(i), i.animationState || (i.animationState = VM(i));
  }
  updateAnimationControlsSubscription() {
    const { animate: i } = this.node.getProps();
    jo(i) && (this.unmountControls = i.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: i } = this.node.getProps(), { animate: s } = this.node.prevProps || {};
    i !== s && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var i;
    this.node.animationState.reset(), (i = this.unmountControls) === null || i === void 0 || i.call(this);
  }
}
let UM = 0;
class kM extends vi {
  constructor() {
    super(...arguments), this.id = UM++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: i, onExitComplete: s } = this.node.presenceContext, { isPresent: l } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || i === l)
      return;
    const u = this.node.animationState.setActive("exit", !i);
    s && !i && u.then(() => {
      s(this.id);
    });
  }
  mount() {
    const { register: i, onExitComplete: s } = this.node.presenceContext || {};
    s && s(this.id), i && (this.unmount = i(this.id));
  }
  unmount() {
  }
}
const HM = {
  animation: {
    Feature: BM
  },
  exit: {
    Feature: kM
  }
}, Fe = {
  x: !1,
  y: !1
};
function m1() {
  return Fe.x || Fe.y;
}
function PM(n) {
  return n === "x" || n === "y" ? Fe[n] ? null : (Fe[n] = !0, () => {
    Fe[n] = !1;
  }) : Fe.x || Fe.y ? null : (Fe.x = Fe.y = !0, () => {
    Fe.x = Fe.y = !1;
  });
}
function wr(n, i, s, l = { passive: !0 }) {
  return n.addEventListener(i, s, l), () => n.removeEventListener(i, s);
}
const Zd = (n) => n.pointerType === "mouse" ? typeof n.button != "number" || n.button <= 0 : n.isPrimary !== !1;
function Dr(n) {
  return {
    point: {
      x: n.pageX,
      y: n.pageY
    }
  };
}
const qM = (n) => (i) => Zd(i) && n(i, Dr(i));
function hr(n, i, s, l) {
  return wr(n, i, qM(s), l);
}
function p1({ top: n, left: i, right: s, bottom: l }) {
  return {
    x: { min: i, max: s },
    y: { min: n, max: l }
  };
}
function GM({ x: n, y: i }) {
  return { top: i.min, right: n.max, bottom: i.max, left: n.min };
}
function YM(n, i) {
  if (!i)
    return n;
  const s = i({ x: n.left, y: n.top }), l = i({ x: n.right, y: n.bottom });
  return {
    top: s.y,
    left: s.x,
    bottom: l.y,
    right: l.x
  };
}
const g1 = 1e-4, XM = 1 - g1, KM = 1 + g1, v1 = 0.01, ZM = 0 - v1, QM = 0 + v1;
function he(n) {
  return n.max - n.min;
}
function FM(n, i, s) {
  return Math.abs(n - i) <= s;
}
function Hv(n, i, s, l = 0.5) {
  n.origin = l, n.originPoint = Ut(i.min, i.max, n.origin), n.scale = he(s) / he(i), n.translate = Ut(s.min, s.max, n.origin) - n.originPoint, (n.scale >= XM && n.scale <= KM || isNaN(n.scale)) && (n.scale = 1), (n.translate >= ZM && n.translate <= QM || isNaN(n.translate)) && (n.translate = 0);
}
function mr(n, i, s, l) {
  Hv(n.x, i.x, s.x, l ? l.originX : void 0), Hv(n.y, i.y, s.y, l ? l.originY : void 0);
}
function Pv(n, i, s) {
  n.min = s.min + i.min, n.max = n.min + he(i);
}
function WM(n, i, s) {
  Pv(n.x, i.x, s.x), Pv(n.y, i.y, s.y);
}
function qv(n, i, s) {
  n.min = i.min - s.min, n.max = n.min + he(i);
}
function pr(n, i, s) {
  qv(n.x, i.x, s.x), qv(n.y, i.y, s.y);
}
const Gv = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Xa = () => ({
  x: Gv(),
  y: Gv()
}), Yv = () => ({ min: 0, max: 0 }), Xt = () => ({
  x: Yv(),
  y: Yv()
});
function Ye(n) {
  return [n("x"), n("y")];
}
function df(n) {
  return n === void 0 || n === 1;
}
function Kf({ scale: n, scaleX: i, scaleY: s }) {
  return !df(n) || !df(i) || !df(s);
}
function Ki(n) {
  return Kf(n) || y1(n) || n.z || n.rotate || n.rotateX || n.rotateY || n.skewX || n.skewY;
}
function y1(n) {
  return Xv(n.x) || Xv(n.y);
}
function Xv(n) {
  return n && n !== "0%";
}
function vo(n, i, s) {
  const l = n - s, u = i * l;
  return s + u;
}
function Kv(n, i, s, l, u) {
  return u !== void 0 && (n = vo(n, u, l)), vo(n, s, l) + i;
}
function Zf(n, i = 0, s = 1, l, u) {
  n.min = Kv(n.min, i, s, l, u), n.max = Kv(n.max, i, s, l, u);
}
function b1(n, { x: i, y: s }) {
  Zf(n.x, i.translate, i.scale, i.originPoint), Zf(n.y, s.translate, s.scale, s.originPoint);
}
const Zv = 0.999999999999, Qv = 1.0000000000001;
function $M(n, i, s, l = !1) {
  const u = s.length;
  if (!u)
    return;
  i.x = i.y = 1;
  let f, d;
  for (let h = 0; h < u; h++) {
    f = s[h], d = f.projectionDelta;
    const { visualElement: m } = f.options;
    m && m.props.style && m.props.style.display === "contents" || (l && f.options.layoutScroll && f.scroll && f !== f.root && Za(n, {
      x: -f.scroll.offset.x,
      y: -f.scroll.offset.y
    }), d && (i.x *= d.x.scale, i.y *= d.y.scale, b1(n, d)), l && Ki(f.latestValues) && Za(n, f.latestValues));
  }
  i.x < Qv && i.x > Zv && (i.x = 1), i.y < Qv && i.y > Zv && (i.y = 1);
}
function Ka(n, i) {
  n.min = n.min + i, n.max = n.max + i;
}
function Fv(n, i, s, l, u = 0.5) {
  const f = Ut(n.min, n.max, u);
  Zf(n, i, s, f, l);
}
function Za(n, i) {
  Fv(n.x, i.x, i.scaleX, i.scale, i.originX), Fv(n.y, i.y, i.scaleY, i.scale, i.originY);
}
function x1(n, i) {
  return p1(YM(n.getBoundingClientRect(), i));
}
function JM(n, i, s) {
  const l = x1(n, s), { scroll: u } = i;
  return u && (Ka(l.x, u.offset.x), Ka(l.y, u.offset.y)), l;
}
const S1 = ({ current: n }) => n ? n.ownerDocument.defaultView : null, Wv = (n, i) => Math.abs(n - i);
function IM(n, i) {
  const s = Wv(n.x, i.x), l = Wv(n.y, i.y);
  return Math.sqrt(s ** 2 + l ** 2);
}
class T1 {
  constructor(i, s, { transformPagePoint: l, contextWindow: u, dragSnapToOrigin: f = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const y = mf(this.lastMoveEventInfo, this.history), b = this.startEvent !== null, T = IM(y.offset, { x: 0, y: 0 }) >= 3;
      if (!b && !T)
        return;
      const { point: R } = y, { timestamp: w } = re;
      this.history.push({ ...R, timestamp: w });
      const { onStart: M, onMove: O } = this.handlers;
      b || (M && M(this.lastMoveEvent, y), this.startEvent = this.lastMoveEvent), O && O(this.lastMoveEvent, y);
    }, this.handlePointerMove = (y, b) => {
      this.lastMoveEvent = y, this.lastMoveEventInfo = hf(b, this.transformPagePoint), Nt.update(this.updatePoint, !0);
    }, this.handlePointerUp = (y, b) => {
      this.end();
      const { onEnd: T, onSessionEnd: R, resumeAnimation: w } = this.handlers;
      if (this.dragSnapToOrigin && w && w(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const M = mf(y.type === "pointercancel" ? this.lastMoveEventInfo : hf(b, this.transformPagePoint), this.history);
      this.startEvent && T && T(y, M), R && R(y, M);
    }, !Zd(i))
      return;
    this.dragSnapToOrigin = f, this.handlers = s, this.transformPagePoint = l, this.contextWindow = u || window;
    const d = Dr(i), h = hf(d, this.transformPagePoint), { point: m } = h, { timestamp: p } = re;
    this.history = [{ ...m, timestamp: p }];
    const { onSessionStart: g } = s;
    g && g(i, mf(h, this.history)), this.removeListeners = Mr(hr(this.contextWindow, "pointermove", this.handlePointerMove), hr(this.contextWindow, "pointerup", this.handlePointerUp), hr(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(i) {
    this.handlers = i;
  }
  end() {
    this.removeListeners && this.removeListeners(), mi(this.updatePoint);
  }
}
function hf(n, i) {
  return i ? { point: i(n.point) } : n;
}
function $v(n, i) {
  return { x: n.x - i.x, y: n.y - i.y };
}
function mf({ point: n }, i) {
  return {
    point: n,
    delta: $v(n, A1(i)),
    offset: $v(n, tD(i)),
    velocity: eD(i, 0.1)
  };
}
function tD(n) {
  return n[0];
}
function A1(n) {
  return n[n.length - 1];
}
function eD(n, i) {
  if (n.length < 2)
    return { x: 0, y: 0 };
  let s = n.length - 1, l = null;
  const u = A1(n);
  for (; s >= 0 && (l = n[s], !(u.timestamp - l.timestamp > /* @__PURE__ */ On(i))); )
    s--;
  if (!l)
    return { x: 0, y: 0 };
  const f = /* @__PURE__ */ Nn(u.timestamp - l.timestamp);
  if (f === 0)
    return { x: 0, y: 0 };
  const d = {
    x: (u.x - l.x) / f,
    y: (u.y - l.y) / f
  };
  return d.x === 1 / 0 && (d.x = 0), d.y === 1 / 0 && (d.y = 0), d;
}
function nD(n, { min: i, max: s }, l) {
  return i !== void 0 && n < i ? n = l ? Ut(i, n, l.min) : Math.max(n, i) : s !== void 0 && n > s && (n = l ? Ut(s, n, l.max) : Math.min(n, s)), n;
}
function Jv(n, i, s) {
  return {
    min: i !== void 0 ? n.min + i : void 0,
    max: s !== void 0 ? n.max + s - (n.max - n.min) : void 0
  };
}
function iD(n, { top: i, left: s, bottom: l, right: u }) {
  return {
    x: Jv(n.x, s, u),
    y: Jv(n.y, i, l)
  };
}
function Iv(n, i) {
  let s = i.min - n.min, l = i.max - n.max;
  return i.max - i.min < n.max - n.min && ([s, l] = [l, s]), { min: s, max: l };
}
function aD(n, i) {
  return {
    x: Iv(n.x, i.x),
    y: Iv(n.y, i.y)
  };
}
function sD(n, i) {
  let s = 0.5;
  const l = he(n), u = he(i);
  return u > l ? s = /* @__PURE__ */ ts(i.min, i.max - l, n.min) : l > u && (s = /* @__PURE__ */ ts(n.min, n.max - u, i.min)), zn(0, 1, s);
}
function rD(n, i) {
  const s = {};
  return i.min !== void 0 && (s.min = i.min - n.min), i.max !== void 0 && (s.max = i.max - n.min), s;
}
const Qf = 0.35;
function lD(n = Qf) {
  return n === !1 ? n = 0 : n === !0 && (n = Qf), {
    x: ty(n, "left", "right"),
    y: ty(n, "top", "bottom")
  };
}
function ty(n, i, s) {
  return {
    min: ey(n, i),
    max: ey(n, s)
  };
}
function ey(n, i) {
  return typeof n == "number" ? n : n[i] || 0;
}
const oD = /* @__PURE__ */ new WeakMap();
class uD {
  constructor(i) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Xt(), this.visualElement = i;
  }
  start(i, { snapToCursor: s = !1 } = {}) {
    const { presenceContext: l } = this.visualElement;
    if (l && l.isPresent === !1)
      return;
    const u = (g) => {
      const { dragSnapToOrigin: y } = this.getProps();
      y ? this.pauseAnimation() : this.stopAnimation(), s && this.snapToCursor(Dr(g).point);
    }, f = (g, y) => {
      const { drag: b, dragPropagation: T, onDragStart: R } = this.getProps();
      if (b && !T && (this.openDragLock && this.openDragLock(), this.openDragLock = PM(b), !this.openDragLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Ye((M) => {
        let O = this.getAxisMotionValue(M).get() || 0;
        if (ln.test(O)) {
          const { projection: z } = this.visualElement;
          if (z && z.layout) {
            const U = z.layout.layoutBox[M];
            U && (O = he(U) * (parseFloat(O) / 100));
          }
        }
        this.originPoint[M] = O;
      }), R && Nt.postRender(() => R(g, y)), _f(this.visualElement, "transform");
      const { animationState: w } = this.visualElement;
      w && w.setActive("whileDrag", !0);
    }, d = (g, y) => {
      const { dragPropagation: b, dragDirectionLock: T, onDirectionLock: R, onDrag: w } = this.getProps();
      if (!b && !this.openDragLock)
        return;
      const { offset: M } = y;
      if (T && this.currentDirection === null) {
        this.currentDirection = cD(M), this.currentDirection !== null && R && R(this.currentDirection);
        return;
      }
      this.updateAxis("x", y.point, M), this.updateAxis("y", y.point, M), this.visualElement.render(), w && w(g, y);
    }, h = (g, y) => this.stop(g, y), m = () => Ye((g) => {
      var y;
      return this.getAnimationState(g) === "paused" && ((y = this.getAxisMotionValue(g).animation) === null || y === void 0 ? void 0 : y.play());
    }), { dragSnapToOrigin: p } = this.getProps();
    this.panSession = new T1(i, {
      onSessionStart: u,
      onStart: f,
      onMove: d,
      onSessionEnd: h,
      resumeAnimation: m
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: p,
      contextWindow: S1(this.visualElement)
    });
  }
  stop(i, s) {
    const l = this.isDragging;
    if (this.cancel(), !l)
      return;
    const { velocity: u } = s;
    this.startAnimation(u);
    const { onDragEnd: f } = this.getProps();
    f && Nt.postRender(() => f(i, s));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: i, animationState: s } = this.visualElement;
    i && (i.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: l } = this.getProps();
    !l && this.openDragLock && (this.openDragLock(), this.openDragLock = null), s && s.setActive("whileDrag", !1);
  }
  updateAxis(i, s, l) {
    const { drag: u } = this.getProps();
    if (!l || !Wl(i, u, this.currentDirection))
      return;
    const f = this.getAxisMotionValue(i);
    let d = this.originPoint[i] + l[i];
    this.constraints && this.constraints[i] && (d = nD(d, this.constraints[i], this.elastic[i])), f.set(d);
  }
  resolveConstraints() {
    var i;
    const { dragConstraints: s, dragElastic: l } = this.getProps(), u = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (i = this.visualElement.projection) === null || i === void 0 ? void 0 : i.layout, f = this.constraints;
    s && Ga(s) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : s && u ? this.constraints = iD(u.layoutBox, s) : this.constraints = !1, this.elastic = lD(l), f !== this.constraints && u && this.constraints && !this.hasMutatedConstraints && Ye((d) => {
      this.constraints !== !1 && this.getAxisMotionValue(d) && (this.constraints[d] = rD(u.layoutBox[d], this.constraints[d]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: i, onMeasureDragConstraints: s } = this.getProps();
    if (!i || !Ga(i))
      return !1;
    const l = i.current, { projection: u } = this.visualElement;
    if (!u || !u.layout)
      return !1;
    const f = JM(l, u.root, this.visualElement.getTransformPagePoint());
    let d = aD(u.layout.layoutBox, f);
    if (s) {
      const h = s(GM(d));
      this.hasMutatedConstraints = !!h, h && (d = p1(h));
    }
    return d;
  }
  startAnimation(i) {
    const { drag: s, dragMomentum: l, dragElastic: u, dragTransition: f, dragSnapToOrigin: d, onDragTransitionEnd: h } = this.getProps(), m = this.constraints || {}, p = Ye((g) => {
      if (!Wl(g, s, this.currentDirection))
        return;
      let y = m && m[g] || {};
      d && (y = { min: 0, max: 0 });
      const b = u ? 200 : 1e6, T = u ? 40 : 1e7, R = {
        type: "inertia",
        velocity: l ? i[g] : 0,
        bounceStiffness: b,
        bounceDamping: T,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...f,
        ...y
      };
      return this.startAxisValueAnimation(g, R);
    });
    return Promise.all(p).then(h);
  }
  startAxisValueAnimation(i, s) {
    const l = this.getAxisMotionValue(i);
    return _f(this.visualElement, i), l.start(Kd(i, l, 0, s, this.visualElement, !1));
  }
  stopAnimation() {
    Ye((i) => this.getAxisMotionValue(i).stop());
  }
  pauseAnimation() {
    Ye((i) => {
      var s;
      return (s = this.getAxisMotionValue(i).animation) === null || s === void 0 ? void 0 : s.pause();
    });
  }
  getAnimationState(i) {
    var s;
    return (s = this.getAxisMotionValue(i).animation) === null || s === void 0 ? void 0 : s.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(i) {
    const s = `_drag${i.toUpperCase()}`, l = this.visualElement.getProps(), u = l[s];
    return u || this.visualElement.getValue(i, (l.initial ? l.initial[i] : void 0) || 0);
  }
  snapToCursor(i) {
    Ye((s) => {
      const { drag: l } = this.getProps();
      if (!Wl(s, l, this.currentDirection))
        return;
      const { projection: u } = this.visualElement, f = this.getAxisMotionValue(s);
      if (u && u.layout) {
        const { min: d, max: h } = u.layout.layoutBox[s];
        f.set(i[s] - Ut(d, h, 0.5));
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
    const { drag: i, dragConstraints: s } = this.getProps(), { projection: l } = this.visualElement;
    if (!Ga(s) || !l || !this.constraints)
      return;
    this.stopAnimation();
    const u = { x: 0, y: 0 };
    Ye((d) => {
      const h = this.getAxisMotionValue(d);
      if (h && this.constraints !== !1) {
        const m = h.get();
        u[d] = sD({ min: m, max: m }, this.constraints[d]);
      }
    });
    const { transformTemplate: f } = this.visualElement.getProps();
    this.visualElement.current.style.transform = f ? f({}, "") : "none", l.root && l.root.updateScroll(), l.updateLayout(), this.resolveConstraints(), Ye((d) => {
      if (!Wl(d, i, null))
        return;
      const h = this.getAxisMotionValue(d), { min: m, max: p } = this.constraints[d];
      h.set(Ut(m, p, u[d]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    oD.set(this.visualElement, this);
    const i = this.visualElement.current, s = hr(i, "pointerdown", (m) => {
      const { drag: p, dragListener: g = !0 } = this.getProps();
      p && g && this.start(m);
    }), l = () => {
      const { dragConstraints: m } = this.getProps();
      Ga(m) && m.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: u } = this.visualElement, f = u.addEventListener("measure", l);
    u && !u.layout && (u.root && u.root.updateScroll(), u.updateLayout()), Nt.read(l);
    const d = wr(window, "resize", () => this.scalePositionWithinConstraints()), h = u.addEventListener("didUpdate", ({ delta: m, hasLayoutChanged: p }) => {
      this.isDragging && p && (Ye((g) => {
        const y = this.getAxisMotionValue(g);
        y && (this.originPoint[g] += m[g].translate, y.set(y.get() + m[g].translate));
      }), this.visualElement.render());
    });
    return () => {
      d(), s(), f(), h && h();
    };
  }
  getProps() {
    const i = this.visualElement.getProps(), { drag: s = !1, dragDirectionLock: l = !1, dragPropagation: u = !1, dragConstraints: f = !1, dragElastic: d = Qf, dragMomentum: h = !0 } = i;
    return {
      ...i,
      drag: s,
      dragDirectionLock: l,
      dragPropagation: u,
      dragConstraints: f,
      dragElastic: d,
      dragMomentum: h
    };
  }
}
function Wl(n, i, s) {
  return (i === !0 || i === n) && (s === null || s === n);
}
function cD(n, i = 10) {
  let s = null;
  return Math.abs(n.y) > i ? s = "y" : Math.abs(n.x) > i && (s = "x"), s;
}
class fD extends vi {
  constructor(i) {
    super(i), this.removeGroupControls = xe, this.removeListeners = xe, this.controls = new uD(i);
  }
  mount() {
    const { dragControls: i } = this.node.getProps();
    i && (this.removeGroupControls = i.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || xe;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const ny = (n) => (i, s) => {
  n && Nt.postRender(() => n(i, s));
};
class dD extends vi {
  constructor() {
    super(...arguments), this.removePointerDownListener = xe;
  }
  onPointerDown(i) {
    this.session = new T1(i, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: S1(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: i, onPanStart: s, onPan: l, onPanEnd: u } = this.node.getProps();
    return {
      onSessionStart: ny(i),
      onStart: ny(s),
      onMove: l,
      onEnd: (f, d) => {
        delete this.session, u && Nt.postRender(() => u(f, d));
      }
    };
  }
  mount() {
    this.removePointerDownListener = hr(this.node.current, "pointerdown", (i) => this.onPointerDown(i));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const io = {
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
function iy(n, i) {
  return i.max === i.min ? 0 : n / (i.max - i.min) * 100;
}
const ur = {
  correct: (n, i) => {
    if (!i.target)
      return n;
    if (typeof n == "string")
      if (ot.test(n))
        n = parseFloat(n);
      else
        return n;
    const s = iy(n, i.target.x), l = iy(n, i.target.y);
    return `${s}% ${l}%`;
  }
}, hD = {
  correct: (n, { treeScale: i, projectionDelta: s }) => {
    const l = n, u = pi.parse(n);
    if (u.length > 5)
      return l;
    const f = pi.createTransformer(n), d = typeof u[0] != "number" ? 1 : 0, h = s.x.scale * i.x, m = s.y.scale * i.y;
    u[0 + d] /= h, u[1 + d] /= m;
    const p = Ut(h, m, 0.5);
    return typeof u[2 + d] == "number" && (u[2 + d] /= p), typeof u[3 + d] == "number" && (u[3 + d] /= p), f(u);
  }
};
class mD extends A.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: i, layoutGroup: s, switchLayoutGroup: l, layoutId: u } = this.props, { projection: f } = i;
    xR(pD), f && (s.group && s.group.add(f), l && l.register && u && l.register(f), f.root.didUpdate(), f.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), f.setOptions({
      ...f.options,
      onExitComplete: () => this.safeToRemove()
    })), io.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(i) {
    const { layoutDependency: s, visualElement: l, drag: u, isPresent: f } = this.props, d = l.projection;
    return d && (d.isPresent = f, u || i.layoutDependency !== s || s === void 0 || i.isPresent !== f ? d.willUpdate() : this.safeToRemove(), i.isPresent !== f && (f ? d.promote() : d.relegate() || Nt.postRender(() => {
      const h = d.getStack();
      (!h || !h.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: i } = this.props.visualElement;
    i && (i.root.didUpdate(), Sd.postRender(() => {
      !i.currentAnimation && i.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: i, layoutGroup: s, switchLayoutGroup: l } = this.props, { projection: u } = i;
    u && (u.scheduleCheckAfterUnmount(), s && s.group && s.group.remove(u), l && l.deregister && l.deregister(u));
  }
  safeToRemove() {
    const { safeToRemove: i } = this.props;
    i && i();
  }
  render() {
    return null;
  }
}
function w1(n) {
  const [i, s] = J2(), l = A.useContext(lb);
  return S.jsx(mD, { ...n, layoutGroup: l, switchLayoutGroup: A.useContext(pb), isPresent: i, safeToRemove: s });
}
const pD = {
  borderRadius: {
    ...ur,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: ur,
  borderTopRightRadius: ur,
  borderBottomLeftRadius: ur,
  borderBottomRightRadius: ur,
  boxShadow: hD
};
function gD(n, i, s) {
  const l = ne(n) ? n : Ia(n);
  return l.start(Kd("", l, i, s)), l.animation;
}
function vD(n) {
  return n instanceof SVGElement && n.tagName !== "svg";
}
const yD = (n, i) => n.depth - i.depth;
class bD {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(i) {
    zd(this.children, i), this.isDirty = !0;
  }
  remove(i) {
    Vd(this.children, i), this.isDirty = !0;
  }
  forEach(i) {
    this.isDirty && this.children.sort(yD), this.isDirty = !1, this.children.forEach(i);
  }
}
function xD(n, i) {
  const s = on.now(), l = ({ timestamp: u }) => {
    const f = u - s;
    f >= i && (mi(l), n(f - i));
  };
  return Nt.read(l, !0), () => mi(l);
}
const E1 = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], SD = E1.length, ay = (n) => typeof n == "string" ? parseFloat(n) : n, sy = (n) => typeof n == "number" || ot.test(n);
function TD(n, i, s, l, u, f) {
  u ? (n.opacity = Ut(
    0,
    // TODO Reinstate this if only child
    s.opacity !== void 0 ? s.opacity : 1,
    AD(l)
  ), n.opacityExit = Ut(i.opacity !== void 0 ? i.opacity : 1, 0, wD(l))) : f && (n.opacity = Ut(i.opacity !== void 0 ? i.opacity : 1, s.opacity !== void 0 ? s.opacity : 1, l));
  for (let d = 0; d < SD; d++) {
    const h = `border${E1[d]}Radius`;
    let m = ry(i, h), p = ry(s, h);
    if (m === void 0 && p === void 0)
      continue;
    m || (m = 0), p || (p = 0), m === 0 || p === 0 || sy(m) === sy(p) ? (n[h] = Math.max(Ut(ay(m), ay(p), l), 0), (ln.test(p) || ln.test(m)) && (n[h] += "%")) : n[h] = p;
  }
  (i.rotate || s.rotate) && (n.rotate = Ut(i.rotate || 0, s.rotate || 0, l));
}
function ry(n, i) {
  return n[i] !== void 0 ? n[i] : n.borderRadius;
}
const AD = /* @__PURE__ */ R1(0, 0.5, Hb), wD = /* @__PURE__ */ R1(0.5, 0.95, xe);
function R1(n, i, s) {
  return (l) => l < n ? 0 : l > i ? 1 : s(/* @__PURE__ */ ts(n, i, l));
}
function ly(n, i) {
  n.min = i.min, n.max = i.max;
}
function Ge(n, i) {
  ly(n.x, i.x), ly(n.y, i.y);
}
function oy(n, i) {
  n.translate = i.translate, n.scale = i.scale, n.originPoint = i.originPoint, n.origin = i.origin;
}
function uy(n, i, s, l, u) {
  return n -= i, n = vo(n, 1 / s, l), u !== void 0 && (n = vo(n, 1 / u, l)), n;
}
function ED(n, i = 0, s = 1, l = 0.5, u, f = n, d = n) {
  if (ln.test(i) && (i = parseFloat(i), i = Ut(d.min, d.max, i / 100) - d.min), typeof i != "number")
    return;
  let h = Ut(f.min, f.max, l);
  n === f && (h -= i), n.min = uy(n.min, i, s, h, u), n.max = uy(n.max, i, s, h, u);
}
function cy(n, i, [s, l, u], f, d) {
  ED(n, i[s], i[l], i[u], i.scale, f, d);
}
const RD = ["x", "scaleX", "originX"], CD = ["y", "scaleY", "originY"];
function fy(n, i, s, l) {
  cy(n.x, i, RD, s ? s.x : void 0, l ? l.x : void 0), cy(n.y, i, CD, s ? s.y : void 0, l ? l.y : void 0);
}
function dy(n) {
  return n.translate === 0 && n.scale === 1;
}
function C1(n) {
  return dy(n.x) && dy(n.y);
}
function hy(n, i) {
  return n.min === i.min && n.max === i.max;
}
function MD(n, i) {
  return hy(n.x, i.x) && hy(n.y, i.y);
}
function my(n, i) {
  return Math.round(n.min) === Math.round(i.min) && Math.round(n.max) === Math.round(i.max);
}
function M1(n, i) {
  return my(n.x, i.x) && my(n.y, i.y);
}
function py(n) {
  return he(n.x) / he(n.y);
}
function gy(n, i) {
  return n.translate === i.translate && n.scale === i.scale && n.originPoint === i.originPoint;
}
class DD {
  constructor() {
    this.members = [];
  }
  add(i) {
    zd(this.members, i), i.scheduleRender();
  }
  remove(i) {
    if (Vd(this.members, i), i === this.prevLead && (this.prevLead = void 0), i === this.lead) {
      const s = this.members[this.members.length - 1];
      s && this.promote(s);
    }
  }
  relegate(i) {
    const s = this.members.findIndex((u) => i === u);
    if (s === 0)
      return !1;
    let l;
    for (let u = s; u >= 0; u--) {
      const f = this.members[u];
      if (f.isPresent !== !1) {
        l = f;
        break;
      }
    }
    return l ? (this.promote(l), !0) : !1;
  }
  promote(i, s) {
    const l = this.lead;
    if (i !== l && (this.prevLead = l, this.lead = i, i.show(), l)) {
      l.instance && l.scheduleRender(), i.scheduleRender(), i.resumeFrom = l, s && (i.resumeFrom.preserveOpacity = !0), l.snapshot && (i.snapshot = l.snapshot, i.snapshot.latestValues = l.animationValues || l.latestValues), i.root && i.root.isUpdating && (i.isLayoutDirty = !0);
      const { crossfade: u } = i.options;
      u === !1 && l.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((i) => {
      const { options: s, resumingFrom: l } = i;
      s.onExitComplete && s.onExitComplete(), l && l.options.onExitComplete && l.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((i) => {
      i.instance && i.scheduleRender(!1);
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
function OD(n, i, s) {
  let l = "";
  const u = n.x.translate / i.x, f = n.y.translate / i.y, d = (s == null ? void 0 : s.z) || 0;
  if ((u || f || d) && (l = `translate3d(${u}px, ${f}px, ${d}px) `), (i.x !== 1 || i.y !== 1) && (l += `scale(${1 / i.x}, ${1 / i.y}) `), s) {
    const { transformPerspective: p, rotate: g, rotateX: y, rotateY: b, skewX: T, skewY: R } = s;
    p && (l = `perspective(${p}px) ${l}`), g && (l += `rotate(${g}deg) `), y && (l += `rotateX(${y}deg) `), b && (l += `rotateY(${b}deg) `), T && (l += `skewX(${T}deg) `), R && (l += `skewY(${R}deg) `);
  }
  const h = n.x.scale * i.x, m = n.y.scale * i.y;
  return (h !== 1 || m !== 1) && (l += `scale(${h}, ${m})`), l || "none";
}
const pf = ["", "X", "Y", "Z"], ND = { visibility: "hidden" }, vy = 1e3;
let jD = 0;
function gf(n, i, s, l) {
  const { latestValues: u } = i;
  u[n] && (s[n] = u[n], i.setStaticValue(n, 0), l && (l[n] = 0));
}
function D1(n) {
  if (n.hasCheckedOptimisedAppear = !0, n.root === n)
    return;
  const { visualElement: i } = n.options;
  if (!i)
    return;
  const s = Ob(i);
  if (window.MotionHasOptimisedAnimation(s, "transform")) {
    const { layout: u, layoutId: f } = n.options;
    window.MotionCancelOptimisedAnimation(s, "transform", Nt, !(u || f));
  }
  const { parent: l } = n;
  l && !l.hasCheckedOptimisedAppear && D1(l);
}
function O1({ attachResizeListener: n, defaultParent: i, measureScroll: s, checkIsScrollRoot: l, resetTransform: u }) {
  return class {
    constructor(d = {}, h = i == null ? void 0 : i()) {
      this.id = jD++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(VD), this.nodes.forEach(HD), this.nodes.forEach(PD), this.nodes.forEach(LD);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = d, this.root = h ? h.root || h : this, this.path = h ? [...h.path, h] : [], this.parent = h, this.depth = h ? h.depth + 1 : 0;
      for (let m = 0; m < this.path.length; m++)
        this.path[m].shouldResetTransform = !0;
      this.root === this && (this.nodes = new bD());
    }
    addEventListener(d, h) {
      return this.eventHandlers.has(d) || this.eventHandlers.set(d, new Ld()), this.eventHandlers.get(d).add(h);
    }
    notifyListeners(d, ...h) {
      const m = this.eventHandlers.get(d);
      m && m.notify(...h);
    }
    hasListeners(d) {
      return this.eventHandlers.has(d);
    }
    /**
     * Lifecycles
     */
    mount(d, h = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = vD(d), this.instance = d;
      const { layoutId: m, layout: p, visualElement: g } = this.options;
      if (g && !g.current && g.mount(d), this.root.nodes.add(this), this.parent && this.parent.children.add(this), h && (p || m) && (this.isLayoutDirty = !0), n) {
        let y;
        const b = () => this.root.updateBlockedByResize = !1;
        n(d, () => {
          this.root.updateBlockedByResize = !0, y && y(), y = xD(b, 250), io.hasAnimatedSinceResize && (io.hasAnimatedSinceResize = !1, this.nodes.forEach(by));
        });
      }
      m && this.root.registerSharedNode(m, this), this.options.animate !== !1 && g && (m || p) && this.addEventListener("didUpdate", ({ delta: y, hasLayoutChanged: b, hasRelativeLayoutChanged: T, layout: R }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const w = this.options.transition || g.getDefaultTransition() || KD, { onLayoutAnimationStart: M, onLayoutAnimationComplete: O } = g.getProps(), z = !this.targetLayout || !M1(this.targetLayout, R), U = !b && T;
        if (this.options.layoutRoot || this.resumeFrom || U || b && (z || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(y, U);
          const q = {
            ..._d(w, "layout"),
            onPlay: M,
            onComplete: O
          };
          (g.shouldReduceMotion || this.options.layoutRoot) && (q.delay = 0, q.type = !1), this.startAnimation(q);
        } else
          b || by(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = R;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const d = this.getStack();
      d && d.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, mi(this.updateProjection);
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
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(qD), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: d } = this.options;
      return d && d.getProps().transformTemplate;
    }
    willUpdate(d = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && D1(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let g = 0; g < this.path.length; g++) {
        const y = this.path[g];
        y.shouldResetTransform = !0, y.updateScroll("snapshot"), y.options.layoutRoot && y.willUpdate(!1);
      }
      const { layoutId: h, layout: m } = this.options;
      if (h === void 0 && !m)
        return;
      const p = this.getTransformTemplate();
      this.prevTransformTemplateValue = p ? p(this.latestValues, "") : void 0, this.updateSnapshot(), d && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(yy);
        return;
      }
      this.isUpdating || this.nodes.forEach(UD), this.isUpdating = !1, this.nodes.forEach(kD), this.nodes.forEach(_D), this.nodes.forEach(zD), this.clearAllSnapshots();
      const h = on.now();
      re.delta = zn(0, 1e3 / 60, h - re.timestamp), re.timestamp = h, re.isProcessing = !0, lf.update.process(re), lf.preRender.process(re), lf.render.process(re), re.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Sd.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(BD), this.sharedNodes.forEach(GD);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Nt.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Nt.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !he(this.snapshot.measuredBox.x) && !he(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let m = 0; m < this.path.length; m++)
          this.path[m].updateScroll();
      const d = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = Xt(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: h } = this.options;
      h && h.notify("LayoutMeasure", this.layout.layoutBox, d ? d.layoutBox : void 0);
    }
    updateScroll(d = "measure") {
      let h = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === d && (h = !1), h) {
        const m = l(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: d,
          isRoot: m,
          offset: s(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : m
        };
      }
    }
    resetTransform() {
      if (!u)
        return;
      const d = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, h = this.projectionDelta && !C1(this.projectionDelta), m = this.getTransformTemplate(), p = m ? m(this.latestValues, "") : void 0, g = p !== this.prevTransformTemplateValue;
      d && (h || Ki(this.latestValues) || g) && (u(this.instance, p), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(d = !0) {
      const h = this.measurePageBox();
      let m = this.removeElementScroll(h);
      return d && (m = this.removeTransform(m)), ZD(m), {
        animationId: this.root.animationId,
        measuredBox: h,
        layoutBox: m,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var d;
      const { visualElement: h } = this.options;
      if (!h)
        return Xt();
      const m = h.measureViewportBox();
      if (!(((d = this.scroll) === null || d === void 0 ? void 0 : d.wasRoot) || this.path.some(QD))) {
        const { scroll: g } = this.root;
        g && (Ka(m.x, g.offset.x), Ka(m.y, g.offset.y));
      }
      return m;
    }
    removeElementScroll(d) {
      var h;
      const m = Xt();
      if (Ge(m, d), !((h = this.scroll) === null || h === void 0) && h.wasRoot)
        return m;
      for (let p = 0; p < this.path.length; p++) {
        const g = this.path[p], { scroll: y, options: b } = g;
        g !== this.root && y && b.layoutScroll && (y.wasRoot && Ge(m, d), Ka(m.x, y.offset.x), Ka(m.y, y.offset.y));
      }
      return m;
    }
    applyTransform(d, h = !1) {
      const m = Xt();
      Ge(m, d);
      for (let p = 0; p < this.path.length; p++) {
        const g = this.path[p];
        !h && g.options.layoutScroll && g.scroll && g !== g.root && Za(m, {
          x: -g.scroll.offset.x,
          y: -g.scroll.offset.y
        }), Ki(g.latestValues) && Za(m, g.latestValues);
      }
      return Ki(this.latestValues) && Za(m, this.latestValues), m;
    }
    removeTransform(d) {
      const h = Xt();
      Ge(h, d);
      for (let m = 0; m < this.path.length; m++) {
        const p = this.path[m];
        if (!p.instance || !Ki(p.latestValues))
          continue;
        Kf(p.latestValues) && p.updateSnapshot();
        const g = Xt(), y = p.measurePageBox();
        Ge(g, y), fy(h, p.latestValues, p.snapshot ? p.snapshot.layoutBox : void 0, g);
      }
      return Ki(this.latestValues) && fy(h, this.latestValues), h;
    }
    setTargetDelta(d) {
      this.targetDelta = d, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(d) {
      this.options = {
        ...this.options,
        ...d,
        crossfade: d.crossfade !== void 0 ? d.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== re.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(d = !1) {
      var h;
      const m = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = m.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = m.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = m.isSharedProjectionDirty);
      const p = !!this.resumingFrom || this !== m;
      if (!(d || p && this.isSharedProjectionDirty || this.isProjectionDirty || !((h = this.parent) === null || h === void 0) && h.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: y, layoutId: b } = this.options;
      if (!(!this.layout || !(y || b))) {
        if (this.resolvedRelativeTargetAt = re.timestamp, !this.targetDelta && !this.relativeTarget) {
          const T = this.getClosestProjectingParent();
          T && T.layout && this.animationProgress !== 1 ? (this.relativeParent = T, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Xt(), this.relativeTargetOrigin = Xt(), pr(this.relativeTargetOrigin, this.layout.layoutBox, T.layout.layoutBox), Ge(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Xt(), this.targetWithTransforms = Xt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), WM(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : Ge(this.target, this.layout.layoutBox), b1(this.target, this.targetDelta)) : Ge(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const T = this.getClosestProjectingParent();
          T && !!T.resumingFrom == !!this.resumingFrom && !T.options.layoutScroll && T.target && this.animationProgress !== 1 ? (this.relativeParent = T, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Xt(), this.relativeTargetOrigin = Xt(), pr(this.relativeTargetOrigin, this.target, T.target), Ge(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Kf(this.parent.latestValues) || y1(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var d;
      const h = this.getLead(), m = !!this.resumingFrom || this !== h;
      let p = !0;
      if ((this.isProjectionDirty || !((d = this.parent) === null || d === void 0) && d.isProjectionDirty) && (p = !1), m && (this.isSharedProjectionDirty || this.isTransformDirty) && (p = !1), this.resolvedRelativeTargetAt === re.timestamp && (p = !1), p)
        return;
      const { layout: g, layoutId: y } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(g || y))
        return;
      Ge(this.layoutCorrected, this.layout.layoutBox);
      const b = this.treeScale.x, T = this.treeScale.y;
      $M(this.layoutCorrected, this.treeScale, this.path, m), h.layout && !h.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (h.target = h.layout.layoutBox, h.targetWithTransforms = Xt());
      const { target: R } = h;
      if (!R) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (oy(this.prevProjectionDelta.x, this.projectionDelta.x), oy(this.prevProjectionDelta.y, this.projectionDelta.y)), mr(this.projectionDelta, this.layoutCorrected, R, this.latestValues), (this.treeScale.x !== b || this.treeScale.y !== T || !gy(this.projectionDelta.x, this.prevProjectionDelta.x) || !gy(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", R));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(d = !0) {
      var h;
      if ((h = this.options.visualElement) === null || h === void 0 || h.scheduleRender(), d) {
        const m = this.getStack();
        m && m.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Xa(), this.projectionDelta = Xa(), this.projectionDeltaWithTransform = Xa();
    }
    setAnimationOrigin(d, h = !1) {
      const m = this.snapshot, p = m ? m.latestValues : {}, g = { ...this.latestValues }, y = Xa();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !h;
      const b = Xt(), T = m ? m.source : void 0, R = this.layout ? this.layout.source : void 0, w = T !== R, M = this.getStack(), O = !M || M.members.length <= 1, z = !!(w && !O && this.options.crossfade === !0 && !this.path.some(XD));
      this.animationProgress = 0;
      let U;
      this.mixTargetDelta = (q) => {
        const V = q / 1e3;
        xy(y.x, d.x, V), xy(y.y, d.y, V), this.setTargetDelta(y), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (pr(b, this.layout.layoutBox, this.relativeParent.layout.layoutBox), YD(this.relativeTarget, this.relativeTargetOrigin, b, V), U && MD(this.relativeTarget, U) && (this.isProjectionDirty = !1), U || (U = Xt()), Ge(U, this.relativeTarget)), w && (this.animationValues = g, TD(g, p, this.latestValues, V, z, O)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = V;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(d) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (mi(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Nt.update(() => {
        io.hasAnimatedSinceResize = !0, this.currentAnimation = gD(0, vy, {
          ...d,
          onUpdate: (h) => {
            this.mixTargetDelta(h), d.onUpdate && d.onUpdate(h);
          },
          onStop: () => {
          },
          onComplete: () => {
            d.onComplete && d.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const d = this.getStack();
      d && d.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(vy), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const d = this.getLead();
      let { targetWithTransforms: h, target: m, layout: p, latestValues: g } = d;
      if (!(!h || !m || !p)) {
        if (this !== d && this.layout && p && N1(this.options.animationType, this.layout.layoutBox, p.layoutBox)) {
          m = this.target || Xt();
          const y = he(this.layout.layoutBox.x);
          m.x.min = d.target.x.min, m.x.max = m.x.min + y;
          const b = he(this.layout.layoutBox.y);
          m.y.min = d.target.y.min, m.y.max = m.y.min + b;
        }
        Ge(h, m), Za(h, g), mr(this.projectionDeltaWithTransform, this.layoutCorrected, h, g);
      }
    }
    registerSharedNode(d, h) {
      this.sharedNodes.has(d) || this.sharedNodes.set(d, new DD()), this.sharedNodes.get(d).add(h);
      const p = h.options.initialPromotionConfig;
      h.promote({
        transition: p ? p.transition : void 0,
        preserveFollowOpacity: p && p.shouldPreserveFollowOpacity ? p.shouldPreserveFollowOpacity(h) : void 0
      });
    }
    isLead() {
      const d = this.getStack();
      return d ? d.lead === this : !0;
    }
    getLead() {
      var d;
      const { layoutId: h } = this.options;
      return h ? ((d = this.getStack()) === null || d === void 0 ? void 0 : d.lead) || this : this;
    }
    getPrevLead() {
      var d;
      const { layoutId: h } = this.options;
      return h ? (d = this.getStack()) === null || d === void 0 ? void 0 : d.prevLead : void 0;
    }
    getStack() {
      const { layoutId: d } = this.options;
      if (d)
        return this.root.sharedNodes.get(d);
    }
    promote({ needsReset: d, transition: h, preserveFollowOpacity: m } = {}) {
      const p = this.getStack();
      p && p.promote(this, m), d && (this.projectionDelta = void 0, this.needsReset = !0), h && this.setOptions({ transition: h });
    }
    relegate() {
      const d = this.getStack();
      return d ? d.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: d } = this.options;
      if (!d)
        return;
      let h = !1;
      const { latestValues: m } = d;
      if ((m.z || m.rotate || m.rotateX || m.rotateY || m.rotateZ || m.skewX || m.skewY) && (h = !0), !h)
        return;
      const p = {};
      m.z && gf("z", d, p, this.animationValues);
      for (let g = 0; g < pf.length; g++)
        gf(`rotate${pf[g]}`, d, p, this.animationValues), gf(`skew${pf[g]}`, d, p, this.animationValues);
      d.render();
      for (const g in p)
        d.setStaticValue(g, p[g]), this.animationValues && (this.animationValues[g] = p[g]);
      d.scheduleRender();
    }
    getProjectionStyles(d) {
      var h, m;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return ND;
      const p = {
        visibility: ""
      }, g = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, p.opacity = "", p.pointerEvents = eo(d == null ? void 0 : d.pointerEvents) || "", p.transform = g ? g(this.latestValues, "") : "none", p;
      const y = this.getLead();
      if (!this.projectionDelta || !this.layout || !y.target) {
        const w = {};
        return this.options.layoutId && (w.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, w.pointerEvents = eo(d == null ? void 0 : d.pointerEvents) || ""), this.hasProjected && !Ki(this.latestValues) && (w.transform = g ? g({}, "") : "none", this.hasProjected = !1), w;
      }
      const b = y.animationValues || y.latestValues;
      this.applyTransformsToTarget(), p.transform = OD(this.projectionDeltaWithTransform, this.treeScale, b), g && (p.transform = g(b, p.transform));
      const { x: T, y: R } = this.projectionDelta;
      p.transformOrigin = `${T.origin * 100}% ${R.origin * 100}% 0`, y.animationValues ? p.opacity = y === this ? (m = (h = b.opacity) !== null && h !== void 0 ? h : this.latestValues.opacity) !== null && m !== void 0 ? m : 1 : this.preserveOpacity ? this.latestValues.opacity : b.opacityExit : p.opacity = y === this ? b.opacity !== void 0 ? b.opacity : "" : b.opacityExit !== void 0 ? b.opacityExit : 0;
      for (const w in xr) {
        if (b[w] === void 0)
          continue;
        const { correct: M, applyTo: O, isCSSVariable: z } = xr[w], U = p.transform === "none" ? b[w] : M(b[w], y);
        if (O) {
          const q = O.length;
          for (let V = 0; V < q; V++)
            p[O[V]] = U;
        } else
          z ? this.options.visualElement.renderState.vars[w] = U : p[w] = U;
      }
      return this.options.layoutId && (p.pointerEvents = y === this ? eo(d == null ? void 0 : d.pointerEvents) || "" : "none"), p;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((d) => {
        var h;
        return (h = d.currentAnimation) === null || h === void 0 ? void 0 : h.stop();
      }), this.root.nodes.forEach(yy), this.root.sharedNodes.clear();
    }
  };
}
function _D(n) {
  n.updateLayout();
}
function zD(n) {
  var i;
  const s = ((i = n.resumeFrom) === null || i === void 0 ? void 0 : i.snapshot) || n.snapshot;
  if (n.isLead() && n.layout && s && n.hasListeners("didUpdate")) {
    const { layoutBox: l, measuredBox: u } = n.layout, { animationType: f } = n.options, d = s.source !== n.layout.source;
    f === "size" ? Ye((y) => {
      const b = d ? s.measuredBox[y] : s.layoutBox[y], T = he(b);
      b.min = l[y].min, b.max = b.min + T;
    }) : N1(f, s.layoutBox, l) && Ye((y) => {
      const b = d ? s.measuredBox[y] : s.layoutBox[y], T = he(l[y]);
      b.max = b.min + T, n.relativeTarget && !n.currentAnimation && (n.isProjectionDirty = !0, n.relativeTarget[y].max = n.relativeTarget[y].min + T);
    });
    const h = Xa();
    mr(h, l, s.layoutBox);
    const m = Xa();
    d ? mr(m, n.applyTransform(u, !0), s.measuredBox) : mr(m, l, s.layoutBox);
    const p = !C1(h);
    let g = !1;
    if (!n.resumeFrom) {
      const y = n.getClosestProjectingParent();
      if (y && !y.resumeFrom) {
        const { snapshot: b, layout: T } = y;
        if (b && T) {
          const R = Xt();
          pr(R, s.layoutBox, b.layoutBox);
          const w = Xt();
          pr(w, l, T.layoutBox), M1(R, w) || (g = !0), y.options.layoutRoot && (n.relativeTarget = w, n.relativeTargetOrigin = R, n.relativeParent = y);
        }
      }
    }
    n.notifyListeners("didUpdate", {
      layout: l,
      snapshot: s,
      delta: m,
      layoutDelta: h,
      hasLayoutChanged: p,
      hasRelativeLayoutChanged: g
    });
  } else if (n.isLead()) {
    const { onExitComplete: l } = n.options;
    l && l();
  }
  n.options.transition = void 0;
}
function VD(n) {
  n.parent && (n.isProjecting() || (n.isProjectionDirty = n.parent.isProjectionDirty), n.isSharedProjectionDirty || (n.isSharedProjectionDirty = !!(n.isProjectionDirty || n.parent.isProjectionDirty || n.parent.isSharedProjectionDirty)), n.isTransformDirty || (n.isTransformDirty = n.parent.isTransformDirty));
}
function LD(n) {
  n.isProjectionDirty = n.isSharedProjectionDirty = n.isTransformDirty = !1;
}
function BD(n) {
  n.clearSnapshot();
}
function yy(n) {
  n.clearMeasurements();
}
function UD(n) {
  n.isLayoutDirty = !1;
}
function kD(n) {
  const { visualElement: i } = n.options;
  i && i.getProps().onBeforeLayoutMeasure && i.notify("BeforeLayoutMeasure"), n.resetTransform();
}
function by(n) {
  n.finishAnimation(), n.targetDelta = n.relativeTarget = n.target = void 0, n.isProjectionDirty = !0;
}
function HD(n) {
  n.resolveTargetDelta();
}
function PD(n) {
  n.calcProjection();
}
function qD(n) {
  n.resetSkewAndRotation();
}
function GD(n) {
  n.removeLeadSnapshot();
}
function xy(n, i, s) {
  n.translate = Ut(i.translate, 0, s), n.scale = Ut(i.scale, 1, s), n.origin = i.origin, n.originPoint = i.originPoint;
}
function Sy(n, i, s, l) {
  n.min = Ut(i.min, s.min, l), n.max = Ut(i.max, s.max, l);
}
function YD(n, i, s, l) {
  Sy(n.x, i.x, s.x, l), Sy(n.y, i.y, s.y, l);
}
function XD(n) {
  return n.animationValues && n.animationValues.opacityExit !== void 0;
}
const KD = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Ty = (n) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(n), Ay = Ty("applewebkit/") && !Ty("chrome/") ? Math.round : xe;
function wy(n) {
  n.min = Ay(n.min), n.max = Ay(n.max);
}
function ZD(n) {
  wy(n.x), wy(n.y);
}
function N1(n, i, s) {
  return n === "position" || n === "preserve-aspect" && !FM(py(i), py(s), 0.2);
}
function QD(n) {
  var i;
  return n !== n.root && ((i = n.scroll) === null || i === void 0 ? void 0 : i.wasRoot);
}
const FD = O1({
  attachResizeListener: (n, i) => wr(n, "resize", i),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), vf = {
  current: void 0
}, j1 = O1({
  measureScroll: (n) => ({
    x: n.scrollLeft,
    y: n.scrollTop
  }),
  defaultParent: () => {
    if (!vf.current) {
      const n = new FD({});
      n.mount(window), n.setOptions({ layoutScroll: !0 }), vf.current = n;
    }
    return vf.current;
  },
  resetTransform: (n, i) => {
    n.style.transform = i !== void 0 ? i : "none";
  },
  checkIsScrollRoot: (n) => window.getComputedStyle(n).position === "fixed"
}), WD = {
  pan: {
    Feature: dD
  },
  drag: {
    Feature: fD,
    ProjectionNode: j1,
    MeasureLayout: w1
  }
};
function _1(n, i, s) {
  var l;
  if (n instanceof EventTarget)
    return [n];
  if (typeof n == "string") {
    let u = document;
    const f = (l = void 0) !== null && l !== void 0 ? l : u.querySelectorAll(n);
    return f ? Array.from(f) : [];
  }
  return Array.from(n);
}
function z1(n, i) {
  const s = _1(n), l = new AbortController(), u = {
    passive: !0,
    ...i,
    signal: l.signal
  };
  return [s, u, () => l.abort()];
}
function Ey(n) {
  return !(n.pointerType === "touch" || m1());
}
function $D(n, i, s = {}) {
  const [l, u, f] = z1(n, s), d = (h) => {
    if (!Ey(h))
      return;
    const { target: m } = h, p = i(m, h);
    if (typeof p != "function" || !m)
      return;
    const g = (y) => {
      Ey(y) && (p(y), m.removeEventListener("pointerleave", g));
    };
    m.addEventListener("pointerleave", g, u);
  };
  return l.forEach((h) => {
    h.addEventListener("pointerenter", d, u);
  }), f;
}
function Ry(n, i, s) {
  const { props: l } = n;
  n.animationState && l.whileHover && n.animationState.setActive("whileHover", s === "Start");
  const u = "onHover" + s, f = l[u];
  f && Nt.postRender(() => f(i, Dr(i)));
}
class JD extends vi {
  mount() {
    const { current: i } = this.node;
    i && (this.unmount = $D(i, (s, l) => (Ry(this.node, l, "Start"), (u) => Ry(this.node, u, "End"))));
  }
  unmount() {
  }
}
class ID extends vi {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let i = !1;
    try {
      i = this.node.current.matches(":focus-visible");
    } catch {
      i = !0;
    }
    !i || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = Mr(wr(this.node.current, "focus", () => this.onFocus()), wr(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const V1 = (n, i) => i ? n === i ? !0 : V1(n, i.parentElement) : !1, tO = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function eO(n) {
  return tO.has(n.tagName) || n.tabIndex !== -1;
}
const fr = /* @__PURE__ */ new WeakSet();
function Cy(n) {
  return (i) => {
    i.key === "Enter" && n(i);
  };
}
function yf(n, i) {
  n.dispatchEvent(new PointerEvent("pointer" + i, { isPrimary: !0, bubbles: !0 }));
}
const nO = (n, i) => {
  const s = n.currentTarget;
  if (!s)
    return;
  const l = Cy(() => {
    if (fr.has(s))
      return;
    yf(s, "down");
    const u = Cy(() => {
      yf(s, "up");
    }), f = () => yf(s, "cancel");
    s.addEventListener("keyup", u, i), s.addEventListener("blur", f, i);
  });
  s.addEventListener("keydown", l, i), s.addEventListener("blur", () => s.removeEventListener("keydown", l), i);
};
function My(n) {
  return Zd(n) && !m1();
}
function iO(n, i, s = {}) {
  const [l, u, f] = z1(n, s), d = (h) => {
    const m = h.currentTarget;
    if (!My(h) || fr.has(m))
      return;
    fr.add(m);
    const p = i(m, h), g = (T, R) => {
      window.removeEventListener("pointerup", y), window.removeEventListener("pointercancel", b), !(!My(T) || !fr.has(m)) && (fr.delete(m), typeof p == "function" && p(T, { success: R }));
    }, y = (T) => {
      g(T, m === window || m === document || s.useGlobalTarget || V1(m, T.target));
    }, b = (T) => {
      g(T, !1);
    };
    window.addEventListener("pointerup", y, u), window.addEventListener("pointercancel", b, u);
  };
  return l.forEach((h) => {
    (s.useGlobalTarget ? window : h).addEventListener("pointerdown", d, u), h instanceof HTMLElement && (h.addEventListener("focus", (p) => nO(p, u)), !eO(h) && h.tabIndex === null && (h.tabIndex = 0));
  }), f;
}
function Dy(n, i, s) {
  const { props: l } = n;
  if (n.current instanceof HTMLButtonElement && n.current.disabled)
    return;
  n.animationState && l.whileTap && n.animationState.setActive("whileTap", s === "Start");
  const u = "onTap" + (s === "End" ? "" : s), f = l[u];
  f && Nt.postRender(() => f(i, Dr(i)));
}
class aO extends vi {
  mount() {
    const { current: i } = this.node;
    i && (this.unmount = iO(i, (s, l) => (Dy(this.node, l, "Start"), (u, { success: f }) => Dy(this.node, u, f ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Ff = /* @__PURE__ */ new WeakMap(), bf = /* @__PURE__ */ new WeakMap(), sO = (n) => {
  const i = Ff.get(n.target);
  i && i(n);
}, rO = (n) => {
  n.forEach(sO);
};
function lO({ root: n, ...i }) {
  const s = n || document;
  bf.has(s) || bf.set(s, {});
  const l = bf.get(s), u = JSON.stringify(i);
  return l[u] || (l[u] = new IntersectionObserver(rO, { root: n, ...i })), l[u];
}
function oO(n, i, s) {
  const l = lO(i);
  return Ff.set(n, s), l.observe(n), () => {
    Ff.delete(n), l.unobserve(n);
  };
}
const uO = {
  some: 0,
  all: 1
};
class cO extends vi {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: i = {} } = this.node.getProps(), { root: s, margin: l, amount: u = "some", once: f } = i, d = {
      root: s ? s.current : void 0,
      rootMargin: l,
      threshold: typeof u == "number" ? u : uO[u]
    }, h = (m) => {
      const { isIntersecting: p } = m;
      if (this.isInView === p || (this.isInView = p, f && !p && this.hasEnteredView))
        return;
      p && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", p);
      const { onViewportEnter: g, onViewportLeave: y } = this.node.getProps(), b = p ? g : y;
      b && b(m);
    };
    return oO(this.node.current, d, h);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: i, prevProps: s } = this.node;
    ["amount", "margin", "root"].some(fO(i, s)) && this.startObserver();
  }
  unmount() {
  }
}
function fO({ viewport: n = {} }, { viewport: i = {} } = {}) {
  return (s) => n[s] !== i[s];
}
const dO = {
  inView: {
    Feature: cO
  },
  tap: {
    Feature: aO
  },
  focus: {
    Feature: ID
  },
  hover: {
    Feature: JD
  }
}, hO = {
  layout: {
    ProjectionNode: j1,
    MeasureLayout: w1
  }
}, yo = { current: null }, Qd = { current: !1 };
function L1() {
  if (Qd.current = !0, !!vd)
    if (window.matchMedia) {
      const n = window.matchMedia("(prefers-reduced-motion)"), i = () => yo.current = n.matches;
      n.addListener(i), i();
    } else
      yo.current = !1;
}
const mO = [...e1, ce, pi], pO = (n) => mO.find(t1(n)), gO = /* @__PURE__ */ new WeakMap();
function vO(n, i, s) {
  for (const l in i) {
    const u = i[l], f = s[l];
    if (ne(u))
      n.addValue(l, u);
    else if (ne(f))
      n.addValue(l, Ia(u, { owner: n }));
    else if (f !== u)
      if (n.hasValue(l)) {
        const d = n.getValue(l);
        d.liveStyle === !0 ? d.jump(u) : d.hasAnimated || d.set(u);
      } else {
        const d = n.getStaticValue(l);
        n.addValue(l, Ia(d !== void 0 ? d : u, { owner: n }));
      }
  }
  for (const l in s)
    i[l] === void 0 && n.removeValue(l);
  return i;
}
const Oy = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class yO {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(i, s, l) {
    return {};
  }
  constructor({ parent: i, props: s, presenceContext: l, reducedMotionConfig: u, blockInitialAnimation: f, visualState: d }, h = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Yd, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const T = on.now();
      this.renderScheduledAt < T && (this.renderScheduledAt = T, Nt.render(this.render, !1, !0));
    };
    const { latestValues: m, renderState: p, onUpdate: g } = d;
    this.onUpdate = g, this.latestValues = m, this.baseTarget = { ...m }, this.initialValues = s.initial ? { ...m } : {}, this.renderState = p, this.parent = i, this.props = s, this.presenceContext = l, this.depth = i ? i.depth + 1 : 0, this.reducedMotionConfig = u, this.options = h, this.blockInitialAnimation = !!f, this.isControllingVariants = _o(s), this.isVariantNode = hb(s), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(i && i.current);
    const { willChange: y, ...b } = this.scrapeMotionValuesFromProps(s, {}, this);
    for (const T in b) {
      const R = b[T];
      m[T] !== void 0 && ne(R) && R.set(m[T], !1);
    }
  }
  mount(i) {
    this.current = i, gO.set(i, this), this.projection && !this.projection.instance && this.projection.mount(i), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, l) => this.bindToMotionValue(l, s)), Qd.current || L1(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : yo.current, this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), mi(this.notifyUpdate), mi(this.render), this.valueSubscriptions.forEach((i) => i()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const i in this.events)
      this.events[i].clear();
    for (const i in this.features) {
      const s = this.features[i];
      s && (s.unmount(), s.isMounted = !1);
    }
    this.current = null;
  }
  bindToMotionValue(i, s) {
    this.valueSubscriptions.has(i) && this.valueSubscriptions.get(i)();
    const l = ea.has(i);
    l && this.onBindTransform && this.onBindTransform();
    const u = s.on("change", (h) => {
      this.latestValues[i] = h, this.props.onUpdate && Nt.preRender(this.notifyUpdate), l && this.projection && (this.projection.isTransformDirty = !0);
    }), f = s.on("renderRequest", this.scheduleRender);
    let d;
    window.MotionCheckAppearSync && (d = window.MotionCheckAppearSync(this, i, s)), this.valueSubscriptions.set(i, () => {
      u(), f(), d && d(), s.owner && s.stop();
    });
  }
  sortNodePosition(i) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== i.type ? 0 : this.sortInstanceNodePosition(this.current, i.current);
  }
  updateFeatures() {
    let i = "animation";
    for (i in Ja) {
      const s = Ja[i];
      if (!s)
        continue;
      const { isEnabled: l, Feature: u } = s;
      if (!this.features[i] && u && l(this.props) && (this.features[i] = new u(this)), this.features[i]) {
        const f = this.features[i];
        f.isMounted ? f.update() : (f.mount(), f.isMounted = !0);
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
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Xt();
  }
  getStaticValue(i) {
    return this.latestValues[i];
  }
  setStaticValue(i, s) {
    this.latestValues[i] = s;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(i, s) {
    (i.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = i, this.prevPresenceContext = this.presenceContext, this.presenceContext = s;
    for (let l = 0; l < Oy.length; l++) {
      const u = Oy[l];
      this.propEventSubscriptions[u] && (this.propEventSubscriptions[u](), delete this.propEventSubscriptions[u]);
      const f = "on" + u, d = i[f];
      d && (this.propEventSubscriptions[u] = this.on(u, d));
    }
    this.prevMotionValues = vO(this, this.scrapeMotionValuesFromProps(i, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(i) {
    return this.props.variants ? this.props.variants[i] : void 0;
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
  addVariantChild(i) {
    const s = this.getClosestVariantNode();
    if (s)
      return s.variantChildren && s.variantChildren.add(i), () => s.variantChildren.delete(i);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(i, s) {
    const l = this.values.get(i);
    s !== l && (l && this.removeValue(i), this.bindToMotionValue(i, s), this.values.set(i, s), this.latestValues[i] = s.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(i) {
    this.values.delete(i);
    const s = this.valueSubscriptions.get(i);
    s && (s(), this.valueSubscriptions.delete(i)), delete this.latestValues[i], this.removeValueFromRenderState(i, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(i) {
    return this.values.has(i);
  }
  getValue(i, s) {
    if (this.props.values && this.props.values[i])
      return this.props.values[i];
    let l = this.values.get(i);
    return l === void 0 && s !== void 0 && (l = Ia(s === null ? void 0 : s, { owner: this }), this.addValue(i, l)), l;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(i, s) {
    var l;
    let u = this.latestValues[i] !== void 0 || !this.current ? this.latestValues[i] : (l = this.getBaseTargetFromProps(this.props, i)) !== null && l !== void 0 ? l : this.readValueFromInstance(this.current, i, this.options);
    return u != null && (typeof u == "string" && (Jb(u) || qb(u)) ? u = parseFloat(u) : !pO(u) && pi.test(s) && (u = Fb(i, s)), this.setBaseTarget(i, ne(u) ? u.get() : u)), ne(u) ? u.get() : u;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(i, s) {
    this.baseTarget[i] = s;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(i) {
    var s;
    const { initial: l } = this.props;
    let u;
    if (typeof l == "string" || typeof l == "object") {
      const d = Nd(this.props, l, (s = this.presenceContext) === null || s === void 0 ? void 0 : s.custom);
      d && (u = d[i]);
    }
    if (l && u !== void 0)
      return u;
    const f = this.getBaseTargetFromProps(this.props, i);
    return f !== void 0 && !ne(f) ? f : this.initialValues[i] !== void 0 && u === void 0 ? void 0 : this.baseTarget[i];
  }
  on(i, s) {
    return this.events[i] || (this.events[i] = new Ld()), this.events[i].add(s);
  }
  notify(i, ...s) {
    this.events[i] && this.events[i].notify(...s);
  }
}
class B1 extends yO {
  constructor() {
    super(...arguments), this.KeyframeResolver = n1;
  }
  sortInstanceNodePosition(i, s) {
    return i.compareDocumentPosition(s) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(i, s) {
    return i.style ? i.style[s] : void 0;
  }
  removeValueFromRenderState(i, { vars: s, style: l }) {
    delete s[i], delete l[i];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: i } = this.props;
    ne(i) && (this.childSubscription = i.on("change", (s) => {
      this.current && (this.current.textContent = `${s}`);
    }));
  }
}
function bO(n) {
  return window.getComputedStyle(n);
}
class xO extends B1 {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = wb;
  }
  readValueFromInstance(i, s) {
    if (ea.has(s))
      return EC(i, s);
    {
      const l = bO(i), u = (Ad(s) ? l.getPropertyValue(s) : l[s]) || 0;
      return typeof u == "string" ? u.trim() : u;
    }
  }
  measureInstanceViewportBox(i, { transformPagePoint: s }) {
    return x1(i, s);
  }
  build(i, s, l) {
    Rd(i, s, l.transformTemplate);
  }
  scrapeMotionValuesFromProps(i, s, l) {
    return jd(i, s, l);
  }
}
class SO extends B1 {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Xt, this.updateDimensions = () => {
      this.current && !this.renderState.dimensions && Ab(this.current, this.renderState);
    };
  }
  getBaseTargetFromProps(i, s) {
    return i[s];
  }
  readValueFromInstance(i, s) {
    if (ea.has(s)) {
      const l = Qb(s);
      return l && l.default || 0;
    }
    return s = Eb.has(s) ? s : Td(s), i.getAttribute(s);
  }
  scrapeMotionValuesFromProps(i, s, l) {
    return Cb(i, s, l);
  }
  onBindTransform() {
    this.current && !this.renderState.dimensions && Nt.postRender(this.updateDimensions);
  }
  build(i, s, l) {
    Dd(i, s, this.isSVGTag, l.transformTemplate);
  }
  renderInstance(i, s, l, u) {
    Rb(i, s, l, u);
  }
  mount(i) {
    this.isSVGTag = Od(i.tagName), super.mount(i);
  }
}
const TO = (n, i) => Md(n) ? new SO(i) : new xO(i, {
  allowProjection: n !== A.Fragment
}), AO = /* @__PURE__ */ YR({
  ...HM,
  ...dO,
  ...WD,
  ...hO
}, TO), wO = /* @__PURE__ */ rR(AO);
function U1(n) {
  const i = co(() => Ia(n)), { isStatic: s } = A.useContext(Oo);
  if (s) {
    const [, l] = A.useState(n);
    A.useEffect(() => i.on("change", l), []);
  }
  return i;
}
function EO(n, i = {}) {
  const { isStatic: s } = A.useContext(Oo), l = A.useRef(null), u = co(() => ne(n) ? n.get() : n), f = co(() => typeof u == "string" ? u.replace(/[\d.-]/g, "") : void 0), d = U1(u), h = A.useRef(u), m = A.useRef(xe), p = () => {
    g(), l.current = hM({
      keyframes: [jy(d.get()), jy(h.current)],
      velocity: d.getVelocity(),
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...i,
      onUpdate: m.current
    });
  }, g = () => {
    l.current && l.current.stop();
  };
  return A.useInsertionEffect(() => d.attach((y, b) => s ? b(y) : (h.current = y, m.current = (T) => b(Ny(T, f)), Nt.postRender(p), d.get()), g), [JSON.stringify(i)]), ob(() => {
    if (ne(n))
      return n.on("change", (y) => d.set(Ny(y, f)));
  }, [d, f]), d;
}
function Ny(n, i) {
  return i ? n + i : n;
}
function jy(n) {
  return typeof n == "number" ? n : parseFloat(n);
}
function k1() {
  !Qd.current && L1();
  const [n] = A.useState(yo.current);
  return n;
}
const RO = {
  some: 0,
  all: 1
};
function CO(n, i, { root: s, margin: l, amount: u = "some" } = {}) {
  const f = _1(n), d = /* @__PURE__ */ new WeakMap(), h = (p) => {
    p.forEach((g) => {
      const y = d.get(g.target);
      if (g.isIntersecting !== !!y)
        if (g.isIntersecting) {
          const b = i(g.target, g);
          typeof b == "function" ? d.set(g.target, b) : m.unobserve(g.target);
        } else typeof y == "function" && (y(g), d.delete(g.target));
    });
  }, m = new IntersectionObserver(h, {
    root: s,
    rootMargin: l,
    threshold: typeof u == "number" ? u : RO[u]
  });
  return f.forEach((p) => m.observe(p)), () => m.disconnect();
}
function MO(n, { root: i, margin: s, amount: l, once: u = !1, initial: f = !1 } = {}) {
  const [d, h] = A.useState(f);
  return A.useEffect(() => {
    if (!n.current || u && d)
      return;
    const m = () => (h(!0), u ? void 0 : () => h(!1)), p = {
      root: i && i.current || void 0,
      margin: s,
      amount: l
    };
    return CO(n.current, m, p);
  }, [i, n, s, u, l]), d;
}
function DO({ state: n }) {
  var l;
  const i = k1(), s = ["viewer", "reviewer"].includes(((l = n.status.principal) == null ? void 0 : l.role) || "");
  return /* @__PURE__ */ S.jsxs(wO.section, { className: "home-banner visual-heading visual-tone-crimson", initial: i ? !1 : { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 }, children: [
    /* @__PURE__ */ S.jsxs("div", { className: "visual-heading-copy", children: [
      /* @__PURE__ */ S.jsxs("div", { className: "eyebrow visual-heading-label", children: [
        /* @__PURE__ */ S.jsx(tv, { size: 17, "aria-hidden": "true" }),
        "REGULATION WORKSPACE"
      ] }),
      /* @__PURE__ */ S.jsx("h1", { children: "Regulation desk" }),
      /* @__PURE__ */ S.jsx("p", { children: "Continue a draft, review findings, or test policy alternatives." })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "actions", children: [
      /* @__PURE__ */ S.jsxs(Oe, { disabled: s, "data-action": "import", children: [
        /* @__PURE__ */ S.jsx(Uw, { size: 16 }),
        "Import document"
      ] }),
      /* @__PURE__ */ S.jsxs(Oe, { variant: "primary", disabled: s, "data-action": "new", children: [
        /* @__PURE__ */ S.jsx(Gw, { size: 16 }),
        "New draft"
      ] })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "visual-art visual-tone-crimson visual-art-home", "aria-hidden": "true", children: [
      /* @__PURE__ */ S.jsx("span", { className: "visual-art-orbit" }),
      /* @__PURE__ */ S.jsx("span", { className: "visual-art-sheet visual-art-back" }),
      /* @__PURE__ */ S.jsx("span", { className: "visual-art-sheet visual-art-middle" }),
      /* @__PURE__ */ S.jsxs("span", { className: "visual-art-sheet visual-art-front", children: [
        /* @__PURE__ */ S.jsx(tv, { size: 28 }),
        /* @__PURE__ */ S.jsx("i", {}),
        /* @__PURE__ */ S.jsx("i", {}),
        /* @__PURE__ */ S.jsx("i", {})
      ] }),
      /* @__PURE__ */ S.jsx("span", { className: "visual-art-satellite", children: /* @__PURE__ */ S.jsx(Fi, { size: 19 }) }),
      /* @__PURE__ */ S.jsx("span", { className: "visual-art-dot" })
    ] })
  ] });
}
function OO({ state: n }) {
  const i = n.jobs.filter((l) => ["queued", "running", "cancelling"].includes(l.status)).length, s = [
    ["Draft", n.drafts.length, "In the workspace", Fi],
    ["Regulation sources", n.status.regulations ?? n.corpus.length, `${n.status.articles ?? 0} articles/blocks`, Rf],
    ["Results on the document", n.runs.length, "Checks and simulations", Cf],
    ["Agents running", i, "On the selected document", A0]
  ];
  return /* @__PURE__ */ S.jsx("div", { className: "workspace-metrics", children: s.map(([l, u, f, d], h) => /* @__PURE__ */ S.jsxs("div", { className: "workspace-metric", children: [
    /* @__PURE__ */ S.jsxs("div", { children: [
      /* @__PURE__ */ S.jsx("span", { children: l }),
      /* @__PURE__ */ S.jsx("strong", { children: u }),
      /* @__PURE__ */ S.jsx("small", { children: f })
    ] }),
    /* @__PURE__ */ S.jsx("span", { className: `visual-badge visual-tone-${["crimson", "blue", "green", "violet"][h]}`, "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(d, { size: 20 }) })
  ] }, l)) });
}
function H1({ state: n }) {
  var f, d, h;
  const i = n.runs.filter((m) => m.review_status === "needs_review"), s = n.runs.find((m) => m.kind === "analysis"), l = ["viewer", "reviewer"].includes(((f = n.status.principal) == null ? void 0 : f.role) || ""), u = [
    ["editor", "01", "Draft a regulation", "Edit articles and run the assistant from one screen.", Fi],
    ["analysis", "02", "Review potential conflicts", "Check quotes, hierarchy and interpretations.", Cf],
    ["simulation", "03", "Test policy impact", "Compare A/B scenarios and review synthetic persona reactions.", A0]
  ];
  return /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
    /* @__PURE__ */ S.jsx(DO, { state: n }),
    /* @__PURE__ */ S.jsx(OO, { state: n }),
    /* @__PURE__ */ S.jsxs("section", { className: "resume-workspace", "aria-label": "Active draft", children: [
      /* @__PURE__ */ S.jsxs("div", { className: "resume-manuscript", children: [
        /* @__PURE__ */ S.jsx("span", { className: "resume-document-mark", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(Yw, { size: 22 }) }),
        /* @__PURE__ */ S.jsx("span", { className: "resume-type", children: n.draft.title }),
        /* @__PURE__ */ S.jsx("div", { className: "resume-clause", children: n.draft.articles[0] ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
          /* @__PURE__ */ S.jsxs("b", { children: [
            "Pasal ",
            n.draft.articles[0].number
          ] }),
          /* @__PURE__ */ S.jsx("p", { children: n.draft.articles[0].text })
        ] }) : /* @__PURE__ */ S.jsx("p", { children: "Article text appears once the draft is composed." }) }),
        /* @__PURE__ */ S.jsxs("span", { className: "resume-version", children: [
          "Version ",
          n.draft.revision,
          " · ",
          n.draft.articles.length,
          " articles"
        ] })
      ] }),
      /* @__PURE__ */ S.jsxs("div", { className: "resume-copy", children: [
        /* @__PURE__ */ S.jsx("span", { className: "resume-label", children: "Active draft" }),
        /* @__PURE__ */ S.jsx("h2", { children: "Continue from your document." }),
        /* @__PURE__ */ S.jsx("p", { children: "Read articles, verify sources and test alternatives in the editor." }),
        /* @__PURE__ */ S.jsxs(Oe, { variant: "primary", "data-view": "editor", children: [
          "Continue drafting",
          /* @__PURE__ */ S.jsx(qi, { size: 16 })
        ] }),
        /* @__PURE__ */ S.jsxs(Oe, { variant: "ghost", "data-view": "library", children: [
          "Learn from documents",
          /* @__PURE__ */ S.jsx(Rf, { size: 16 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "home-bottom", children: [
      /* @__PURE__ */ S.jsxs("section", { className: "panel draft-collection", children: [
        /* @__PURE__ */ S.jsxs("div", { className: "panel-head", children: [
          /* @__PURE__ */ S.jsxs("div", { children: [
            /* @__PURE__ */ S.jsxs("h2", { className: "visual-section-title", children: [
              /* @__PURE__ */ S.jsx("span", { className: "visual-badge visual-tone-crimson", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(Fi, { size: 17 }) }),
              "Your drafts"
            ] }),
            /* @__PURE__ */ S.jsxs("p", { children: [
              n.drafts.length,
              " saved documents"
            ] })
          ] }),
          /* @__PURE__ */ S.jsxs(Oe, { size: "small", disabled: l, "data-action": "generate", children: [
            "Start from a brief",
            /* @__PURE__ */ S.jsx(qi, { size: 14 })
          ] })
        ] }),
        /* @__PURE__ */ S.jsxs("div", { className: "draft-table", role: "table", "aria-label": "Saved drafts", children: [
          /* @__PURE__ */ S.jsxs("div", { className: "draft-table-head", role: "row", children: [
            /* @__PURE__ */ S.jsx("span", { role: "columnheader", children: "Document" }),
            /* @__PURE__ */ S.jsx("span", { role: "columnheader", children: "Version" }),
            /* @__PURE__ */ S.jsx("span", { role: "columnheader", children: "Action" })
          ] }),
          n.drafts.map((m, p) => /* @__PURE__ */ S.jsxs("div", { className: "resume-row", role: "row", children: [
            /* @__PURE__ */ S.jsxs("div", { role: "cell", className: "draft-cell", children: [
              /* @__PURE__ */ S.jsx("span", { className: "document-icon", children: /* @__PURE__ */ S.jsx(Fi, { size: 18 }) }),
              /* @__PURE__ */ S.jsxs("div", { children: [
                /* @__PURE__ */ S.jsx("h3", { children: m.title || "Draft" }),
                /* @__PURE__ */ S.jsxs("span", { className: "micro", children: [
                  m.regulation_type || "Regulation document",
                  m.id === n.draft.id ? " · Selected" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ S.jsxs("span", { role: "cell", className: "version-label", children: [
              "v",
              m.revision ?? 1
            ] }),
            /* @__PURE__ */ S.jsx("div", { role: "cell", children: /* @__PURE__ */ S.jsxs(Oe, { size: "small", variant: "ghost", "data-action": "open-draft", "data-id": m.id, children: [
              "Open",
              /* @__PURE__ */ S.jsx(S0, { size: 15 })
            ] }) })
          ] }, m.id || p))
        ] })
      ] }),
      /* @__PURE__ */ S.jsxs("aside", { className: "panel review-inbox", children: [
        /* @__PURE__ */ S.jsx("div", { className: "panel-head", children: /* @__PURE__ */ S.jsxs("h2", { className: "visual-section-title", children: [
          /* @__PURE__ */ S.jsx("span", { className: "visual-badge visual-tone-green", "aria-hidden": "true", children: /* @__PURE__ */ S.jsx(Lw, { size: 17 }) }),
          "Needs attention"
        ] }) }),
        /* @__PURE__ */ S.jsxs("div", { className: "panel-body", children: [
          /* @__PURE__ */ S.jsx("span", { className: "inbox-count", children: i.length }),
          /* @__PURE__ */ S.jsx("h3", { children: "results awaiting review" }),
          /* @__PURE__ */ S.jsxs("p", { children: [
            "On draft “",
            n.draft.title,
            "”."
          ] }),
          s && /* @__PURE__ */ S.jsxs("div", { className: "inbox-context", children: [
            /* @__PURE__ */ S.jsx(Cf, { size: 16 }),
            /* @__PURE__ */ S.jsxs("span", { children: [
              ((h = (d = s.payload) == null ? void 0 : d.findings) == null ? void 0 : h.length) ?? 0,
              " findings in the latest check ",
              /* @__PURE__ */ S.jsxs("small", { children: [
                "Snapshot v",
                s.revision
              ] })
            ] })
          ] }),
          /* @__PURE__ */ S.jsxs(Oe, { "data-view": "history", children: [
            "Review results",
            /* @__PURE__ */ S.jsx(qi, { size: 14 })
          ] })
        ] }),
        /* @__PURE__ */ S.jsx("div", { className: "inbox-foot", children: "Decisions and applying revisions always go through a reviewer." })
      ] })
    ] }),
    /* @__PURE__ */ S.jsxs("section", { className: "home-grid", "aria-label": "Workflow", children: [
      /* @__PURE__ */ S.jsxs("div", { className: "section-toolbar", children: [
        /* @__PURE__ */ S.jsxs("div", { children: [
          /* @__PURE__ */ S.jsx("h2", { children: "Continue your workflow" }),
          /* @__PURE__ */ S.jsx("p", { children: "Draft the document, verify sources, then weigh its impact." })
        ] }),
        /* @__PURE__ */ S.jsxs(Oe, { variant: "ghost", "data-action": "legal-guide", children: [
          "Legal guidelines",
          /* @__PURE__ */ S.jsx(qi, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ S.jsx("div", { className: "workspace-paths", children: u.map(([m, p, g, y, b]) => /* @__PURE__ */ S.jsxs("button", { className: "workspace-path", "data-view": m, children: [
        /* @__PURE__ */ S.jsxs("div", { children: [
          /* @__PURE__ */ S.jsx(b, { size: 19 }),
          /* @__PURE__ */ S.jsx("span", { children: p })
        ] }),
        /* @__PURE__ */ S.jsx("h3", { children: g }),
        /* @__PURE__ */ S.jsx("p", { children: y }),
        /* @__PURE__ */ S.jsx(qi, { size: 17, className: "path-arrow" })
      ] }, m)) })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "workspace-provenance", children: [
      /* @__PURE__ */ S.jsx(Rf, { size: 15 }),
      /* @__PURE__ */ S.jsxs("span", { children: [
        n.status.regulations ?? n.corpus.length,
        " regulation sources · ",
        n.status.articles ?? 0,
        " articles/blocks"
      ] }),
      /* @__PURE__ */ S.jsx("span", { children: n.status.provider === "demo" ? "Demo without credentials" : `Provider ${n.status.provider}` }),
      /* @__PURE__ */ S.jsxs(Oe, { size: "small", variant: "ghost", "data-view": "data", children: [
        "Explore data & map",
        /* @__PURE__ */ S.jsx(qi, { size: 13 })
      ] }),
      /* @__PURE__ */ S.jsxs(Oe, { size: "small", variant: "ghost", "data-view": "library", children: [
        "Open legal library",
        /* @__PURE__ */ S.jsx(qi, { size: 13 })
      ] })
    ] })
  ] });
}
function NO({ state: n }) {
  return /* @__PURE__ */ S.jsxs("div", { className: "workspace-context", children: [
    /* @__PURE__ */ S.jsxs("span", { className: "context-document", children: [
      /* @__PURE__ */ S.jsx(Fi, { size: 14 }),
      n.draft.title
    ] }),
    /* @__PURE__ */ S.jsxs("span", { className: "context-version", children: [
      "v",
      n.draft.revision
    ] }),
    /* @__PURE__ */ S.jsx("span", { className: n.dirty ? "context-dirty" : "context-saved", children: n.dirty ? "Not saved" : "Saved document" }),
    n.view !== "editor" && /* @__PURE__ */ S.jsxs(Oe, { size: "small", variant: "ghost", "data-view": "editor", children: [
      "Edit document",
      /* @__PURE__ */ S.jsx(S0, { size: 13 })
    ] })
  ] });
}
function jO(...n) {
  return rb(md(n));
}
typeof globalThis < "u" && typeof globalThis.IntersectionObserver > "u" && (globalThis.IntersectionObserver = class {
  constructor(i) {
    rr(this, "root", null);
    rr(this, "rootMargin", "0px");
    rr(this, "thresholds", [0]);
    rr(this, "callback");
    this.callback = i;
  }
  observe(i) {
    this.callback(
      [{ isIntersecting: !0, target: i }],
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
const _O = {
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
function ao({
  value: n,
  startValue: i = 0,
  direction: s = "up",
  delay: l = 0,
  className: u,
  decimalPlaces: f = 0,
  locale: d = "id-ID",
  ...h
}) {
  const m = A.useRef(null), p = A.useRef(null), g = A.useRef(!1), y = k1(), b = s === "down" ? n : i, T = s === "down" ? i : n, R = (U) => Intl.NumberFormat(d, {
    minimumFractionDigits: f,
    maximumFractionDigits: f
  }).format(Number(U.toFixed(f))), w = A.useRef(
    R(y || T === b ? T : b)
  ), M = U1(y ? T : b), O = EO(M, {
    damping: 60,
    stiffness: 100
  }), z = MO(m, { once: !0, margin: "0px" });
  return A.useEffect(() => {
    var V;
    if (y) {
      M.set(T);
      const L = R(T);
      w.current = L, (V = p.current) == null || V.setAttribute("data-ticker-value", L);
      return;
    }
    if (!z) return;
    const U = g.current ? 0 : l, q = setTimeout(() => {
      g.current = !0, M.set(T);
    }, U * 1e3);
    return () => clearTimeout(q);
  }, [M, z, l, T, y, f, d]), A.useEffect(
    () => O.on("change", (U) => {
      var V;
      const q = R(U);
      w.current = q, (V = p.current) == null || V.setAttribute("data-ticker-value", q);
    }),
    [O, f, d]
  ), /* @__PURE__ */ S.jsxs(
    "span",
    {
      ref: m,
      className: jO("inline-block tabular-nums tracking-tight number-ticker", u),
      "data-ticker-target": T,
      ...h,
      children: [
        /* @__PURE__ */ S.jsx("span", { className: "number-ticker-sr", style: _O, children: R(T) }),
        /* @__PURE__ */ S.jsx(
          "span",
          {
            ref: p,
            className: "number-ticker-visual",
            "aria-hidden": "true",
            "data-ticker-value": w.current
          }
        )
      ]
    }
  );
}
const bo = [], _y = /* @__PURE__ */ new WeakMap();
let zy = !1, Qa = null;
function P1(n, i) {
  let s = _y.get(n);
  return s || (s = gr.createRoot(n, { identifierPrefix: i }), _y.set(n, s)), s;
}
function UO(n, i) {
  if (!n) return;
  const s = P1(n, "collection-stats-");
  jn.flushSync(() => {
    s.render(
      /* @__PURE__ */ S.jsx(S.Fragment, { children: i.map((l, u) => /* @__PURE__ */ S.jsxs("div", { className: `collection-stat collection-stat-${l.tone}`, children: [
        /* @__PURE__ */ S.jsxs("div", { className: "collection-stat-top", children: [
          /* @__PURE__ */ S.jsx("span", { children: l.title }),
          /* @__PURE__ */ S.jsx(
            "span",
            {
              className: `collection-visual-icon collection-icon-${l.tone}`,
              "aria-hidden": "true",
              dangerouslySetInnerHTML: { __html: l.iconHtml }
            }
          )
        ] }),
        /* @__PURE__ */ S.jsx("strong", { children: Array.isArray(l.value) ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
          /* @__PURE__ */ S.jsx(ao, { value: l.value[0], delay: u * 0.06 }),
          " / ",
          /* @__PURE__ */ S.jsx(ao, { value: l.value[1], delay: u * 0.06 + 0.04 })
        ] }) : /* @__PURE__ */ S.jsx(ao, { value: l.value, delay: u * 0.06 }) }),
        /* @__PURE__ */ S.jsx("small", { children: l.caption })
      ] }, l.title)) })
    );
  });
}
function kO(n, i, s) {
  if (!n) return;
  const l = P1(n, "ticker-");
  jn.flushSync(() => {
    l.render(
      /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
        /* @__PURE__ */ S.jsx(
          ao,
          {
            value: i,
            startValue: (s == null ? void 0 : s.startValue) ?? 0,
            delay: (s == null ? void 0 : s.delay) ?? 0
          }
        ),
        s != null && s.suffix ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
          " ",
          /* @__PURE__ */ S.jsx("span", { children: s.suffix })
        ] }) : null
      ] })
    );
  });
}
function HO() {
  if (zy) return;
  const n = document.querySelector("#workspace-sidebar"), i = document.querySelector("#framework-tools");
  if (!n || !i) return;
  zy = !0, document.body.classList.add("framework-ready");
  const s = gr.createRoot(n, { identifierPrefix: "nav-" }), l = gr.createRoot(i, { identifierPrefix: "cmd-" });
  jn.flushSync(() => {
    s.render(/* @__PURE__ */ S.jsx(Ww, {})), l.render(/* @__PURE__ */ S.jsx($2, {}));
  });
}
function PO() {
  var n;
  for (; bo.length; ) (n = bo.pop()) == null || n.unmount();
  Qa = null;
}
function qO(n) {
  if (n.view === "data") return;
  const i = document.querySelector("#framework-home");
  if (i) {
    const f = gr.createRoot(i, { identifierPrefix: "home-" });
    bo.push(f), Qa = f, jn.flushSync(() => f.render(/* @__PURE__ */ S.jsx(H1, { state: n })));
    return;
  }
  const s = document.querySelector("#main .page-heading,#main .enterprise-heading");
  if (!s) return;
  const l = document.createElement("div");
  l.className = "framework-context", s.after(l);
  const u = gr.createRoot(l, { identifierPrefix: "flow-" });
  bo.push(u), jn.flushSync(() => u.render(/* @__PURE__ */ S.jsx(NO, { state: n })));
}
function GO(n) {
  Qa && n.view === "home" && jn.flushSync(() => Qa == null ? void 0 : Qa.render(/* @__PURE__ */ S.jsx(H1, { state: n })));
}
export {
  ao as NumberTicker,
  PO as disposePageComponents,
  HO as initializeFrameworkShell,
  GO as refreshFrameworkStatus,
  UO as renderCollectionStats,
  qO as renderFrameworkComponents,
  kO as renderNumberTicker
};
