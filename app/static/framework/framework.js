function JS(n, i) {
  for (var s = 0; s < i.length; s++) {
    const r = i[s];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const u in r)
        if (u !== "default" && !(u in n)) {
          const f = Object.getOwnPropertyDescriptor(r, u);
          f && Object.defineProperty(n, u, f.get ? f : {
            enumerable: !0,
            get: () => r[u]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
function Dy(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var kc = { exports: {} }, al = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Mg;
function IS() {
  if (Mg) return al;
  Mg = 1;
  var n = Symbol.for("react.transitional.element"), i = Symbol.for("react.fragment");
  function s(r, u, f) {
    var d = null;
    if (f !== void 0 && (d = "" + f), u.key !== void 0 && (d = "" + u.key), "key" in u) {
      f = {};
      for (var h in u)
        h !== "key" && (f[h] = u[h]);
    } else f = u;
    return u = f.ref, {
      $$typeof: n,
      type: r,
      key: d,
      ref: u !== void 0 ? u : null,
      props: f
    };
  }
  return al.Fragment = i, al.jsx = s, al.jsxs = s, al;
}
var Dg;
function tT() {
  return Dg || (Dg = 1, kc.exports = IS()), kc.exports;
}
var T = tT(), Hc = { exports: {} }, sl = {}, Pc = { exports: {} }, qc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Og;
function eT() {
  return Og || (Og = 1, function(n) {
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
    function r(P) {
      if (P.length === 0) return null;
      var $ = P[0], Y = P.pop();
      if (Y !== $) {
        P[0] = Y;
        t: for (var nt = 0, C = P.length, K = C >>> 1; nt < K; ) {
          var lt = 2 * (nt + 1) - 1, at = P[lt], J = lt + 1, dt = P[J];
          if (0 > u(at, Y))
            J < C && 0 > u(dt, at) ? (P[nt] = dt, P[J] = Y, nt = J) : (P[nt] = at, P[lt] = Y, nt = lt);
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
    var m = [], p = [], v = 1, y = null, x = 3, S = !1, R = !1, A = !1, D = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, z = typeof setImmediate < "u" ? setImmediate : null;
    function U(P) {
      for (var $ = s(p); $ !== null; ) {
        if ($.callback === null) r(p);
        else if ($.startTime <= P)
          r(p), $.sortIndex = $.expirationTime, i(m, $);
        else break;
        $ = s(p);
      }
    }
    function q(P) {
      if (A = !1, U(P), !R)
        if (s(m) !== null)
          R = !0, pt();
        else {
          var $ = s(p);
          $ !== null && yt(q, $.startTime - P);
        }
    }
    var B = !1, L = -1, Z = 5, F = -1;
    function Q() {
      return !(n.unstable_now() - F < Z);
    }
    function W() {
      if (B) {
        var P = n.unstable_now();
        F = P;
        var $ = !0;
        try {
          t: {
            R = !1, A && (A = !1, O(L), L = -1), S = !0;
            var Y = x;
            try {
              e: {
                for (U(P), y = s(m); y !== null && !(y.expirationTime > P && Q()); ) {
                  var nt = y.callback;
                  if (typeof nt == "function") {
                    y.callback = null, x = y.priorityLevel;
                    var C = nt(
                      y.expirationTime <= P
                    );
                    if (P = n.unstable_now(), typeof C == "function") {
                      y.callback = C, U(P), $ = !0;
                      break e;
                    }
                    y === s(m) && r(m), U(P);
                  } else r(m);
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
              y = null, x = Y, S = !1;
            }
            $ = void 0;
          }
        } finally {
          $ ? mt() : B = !1;
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
        D(W, 0);
      };
    function pt() {
      B || (B = !0, mt());
    }
    function yt(P, $) {
      L = D(function() {
        P(n.unstable_now());
      }, $);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(P) {
      P.callback = null;
    }, n.unstable_continueExecution = function() {
      R || S || (R = !0, pt());
    }, n.unstable_forceFrameRate = function(P) {
      0 > P || 125 < P ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Z = 0 < P ? Math.floor(1e3 / P) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return x;
    }, n.unstable_getFirstCallbackNode = function() {
      return s(m);
    }, n.unstable_next = function(P) {
      switch (x) {
        case 1:
        case 2:
        case 3:
          var $ = 3;
          break;
        default:
          $ = x;
      }
      var Y = x;
      x = $;
      try {
        return P();
      } finally {
        x = Y;
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
      var Y = x;
      x = P;
      try {
        return $();
      } finally {
        x = Y;
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
        id: v++,
        callback: $,
        priorityLevel: P,
        startTime: Y,
        expirationTime: C,
        sortIndex: -1
      }, Y > nt ? (P.sortIndex = Y, i(p, P), s(m) === null && P === s(p) && (A ? (O(L), L = -1) : A = !0, yt(q, Y - nt))) : (P.sortIndex = C, i(m, P), R || S || (R = !0, pt())), P;
    }, n.unstable_shouldYield = Q, n.unstable_wrapCallback = function(P) {
      var $ = x;
      return function() {
        var Y = x;
        x = $;
        try {
          return P.apply(this, arguments);
        } finally {
          x = Y;
        }
      };
    };
  }(qc)), qc;
}
var Ng;
function nT() {
  return Ng || (Ng = 1, Pc.exports = eT()), Pc.exports;
}
var Gc = { exports: {} }, ht = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jg;
function iT() {
  if (jg) return ht;
  jg = 1;
  var n = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), f = Symbol.for("react.consumer"), d = Symbol.for("react.context"), h = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), y = Symbol.iterator;
  function x(C) {
    return C === null || typeof C != "object" ? null : (C = y && C[y] || C["@@iterator"], typeof C == "function" ? C : null);
  }
  var S = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, R = Object.assign, A = {};
  function D(C, K, lt) {
    this.props = C, this.context = K, this.refs = A, this.updater = lt || S;
  }
  D.prototype.isReactComponent = {}, D.prototype.setState = function(C, K) {
    if (typeof C != "object" && typeof C != "function" && C != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, C, K, "setState");
  }, D.prototype.forceUpdate = function(C) {
    this.updater.enqueueForceUpdate(this, C, "forceUpdate");
  };
  function O() {
  }
  O.prototype = D.prototype;
  function z(C, K, lt) {
    this.props = C, this.context = K, this.refs = A, this.updater = lt || S;
  }
  var U = z.prototype = new O();
  U.constructor = z, R(U, D.prototype), U.isPureReactComponent = !0;
  var q = Array.isArray, B = { H: null, A: null, T: null, S: null }, L = Object.prototype.hasOwnProperty;
  function Z(C, K, lt, at, J, dt) {
    return lt = dt.ref, {
      $$typeof: n,
      type: C,
      key: K,
      ref: lt !== void 0 ? lt : null,
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
    return "$" + C.replace(/[=:]/g, function(lt) {
      return K[lt];
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
  function yt(C, K, lt, at, J) {
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
            case v:
              return ut = C._init, yt(
                ut(C._payload),
                K,
                lt,
                at,
                J
              );
          }
      }
    if (ut)
      return J = J(C), ut = at === "" ? "." + Rt(C, 0) : at, q(J) ? (lt = "", ut != null && (lt = ut.replace(mt, "$&/") + "/"), yt(J, K, lt, "", function(Vt) {
        return Vt;
      })) : J != null && (Q(J) && (J = F(
        J,
        lt + (J.key == null || C && C.key === J.key ? "" : ("" + J.key).replace(
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
          lt,
          dt,
          J
        );
    else if (At = x(C), typeof At == "function")
      for (C = At.call(C), At = 0; !(at = C.next()).done; )
        at = at.value, dt = zt + Rt(at, At++), ut += yt(
          at,
          K,
          lt,
          dt,
          J
        );
    else if (dt === "object") {
      if (typeof C.then == "function")
        return yt(
          pt(C),
          K,
          lt,
          at,
          J
        );
      throw K = String(C), Error(
        "Objects are not valid as a React child (found: " + (K === "[object Object]" ? "object with keys {" + Object.keys(C).join(", ") + "}" : K) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ut;
  }
  function P(C, K, lt) {
    if (C == null) return C;
    var at = [], J = 0;
    return yt(C, at, "", "", function(dt) {
      return K.call(lt, dt, J++);
    }), at;
  }
  function $(C) {
    if (C._status === -1) {
      var K = C._result;
      K = K(), K.then(
        function(lt) {
          (C._status === 0 || C._status === -1) && (C._status = 1, C._result = lt);
        },
        function(lt) {
          (C._status === 0 || C._status === -1) && (C._status = 2, C._result = lt);
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
    forEach: function(C, K, lt) {
      P(
        C,
        function() {
          K.apply(this, arguments);
        },
        lt
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
  }, ht.Component = D, ht.Fragment = s, ht.Profiler = u, ht.PureComponent = z, ht.StrictMode = r, ht.Suspense = m, ht.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = B, ht.act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, ht.cache = function(C) {
    return function() {
      return C.apply(null, arguments);
    };
  }, ht.cloneElement = function(C, K, lt) {
    if (C == null)
      throw Error(
        "The argument must be a React element, but you passed " + C + "."
      );
    var at = R({}, C.props), J = C.key, dt = void 0;
    if (K != null)
      for (ut in K.ref !== void 0 && (dt = void 0), K.key !== void 0 && (J = "" + K.key), K)
        !L.call(K, ut) || ut === "key" || ut === "__self" || ut === "__source" || ut === "ref" && K.ref === void 0 || (at[ut] = K[ut]);
    var ut = arguments.length - 2;
    if (ut === 1) at.children = lt;
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
  }, ht.createElement = function(C, K, lt) {
    var at, J = {}, dt = null;
    if (K != null)
      for (at in K.key !== void 0 && (dt = "" + K.key), K)
        L.call(K, at) && at !== "key" && at !== "__self" && at !== "__source" && (J[at] = K[at]);
    var ut = arguments.length - 2;
    if (ut === 1) J.children = lt;
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
      $$typeof: v,
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
    var K = B.T, lt = {};
    B.T = lt;
    try {
      var at = C(), J = B.S;
      J !== null && J(lt, at), typeof at == "object" && at !== null && typeof at.then == "function" && at.then(nt, Y);
    } catch (dt) {
      Y(dt);
    } finally {
      B.T = K;
    }
  }, ht.unstable_useCacheRefresh = function() {
    return B.H.useCacheRefresh();
  }, ht.use = function(C) {
    return B.H.use(C);
  }, ht.useActionState = function(C, K, lt) {
    return B.H.useActionState(C, K, lt);
  }, ht.useCallback = function(C, K) {
    return B.H.useCallback(C, K);
  }, ht.useContext = function(C) {
    return B.H.useContext(C);
  }, ht.useDebugValue = function() {
  }, ht.useDeferredValue = function(C, K) {
    return B.H.useDeferredValue(C, K);
  }, ht.useEffect = function(C, K) {
    return B.H.useEffect(C, K);
  }, ht.useId = function() {
    return B.H.useId();
  }, ht.useImperativeHandle = function(C, K, lt) {
    return B.H.useImperativeHandle(C, K, lt);
  }, ht.useInsertionEffect = function(C, K) {
    return B.H.useInsertionEffect(C, K);
  }, ht.useLayoutEffect = function(C, K) {
    return B.H.useLayoutEffect(C, K);
  }, ht.useMemo = function(C, K) {
    return B.H.useMemo(C, K);
  }, ht.useOptimistic = function(C, K) {
    return B.H.useOptimistic(C, K);
  }, ht.useReducer = function(C, K, lt) {
    return B.H.useReducer(C, K, lt);
  }, ht.useRef = function(C) {
    return B.H.useRef(C);
  }, ht.useState = function(C) {
    return B.H.useState(C);
  }, ht.useSyncExternalStore = function(C, K, lt) {
    return B.H.useSyncExternalStore(
      C,
      K,
      lt
    );
  }, ht.useTransition = function() {
    return B.H.useTransition();
  }, ht.version = "19.0.0", ht;
}
var _g;
function Kf() {
  return _g || (_g = 1, Gc.exports = iT()), Gc.exports;
}
var Yc = { exports: {} }, oe = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zg;
function aT() {
  if (zg) return oe;
  zg = 1;
  var n = Kf();
  function i(m) {
    var p = "https://react.dev/errors/" + m;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        p += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + m + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function s() {
  }
  var r = {
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
  function f(m, p, v) {
    var y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: u,
      key: y == null ? null : "" + y,
      children: m,
      containerInfo: p,
      implementation: v
    };
  }
  var d = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function h(m, p) {
    if (m === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return oe.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, oe.createPortal = function(m, p) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(i(299));
    return f(m, p, null, v);
  }, oe.flushSync = function(m) {
    var p = d.T, v = r.p;
    try {
      if (d.T = null, r.p = 2, m) return m();
    } finally {
      d.T = p, r.p = v, r.d.f();
    }
  }, oe.preconnect = function(m, p) {
    typeof m == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, r.d.C(m, p));
  }, oe.prefetchDNS = function(m) {
    typeof m == "string" && r.d.D(m);
  }, oe.preinit = function(m, p) {
    if (typeof m == "string" && p && typeof p.as == "string") {
      var v = p.as, y = h(v, p.crossOrigin), x = typeof p.integrity == "string" ? p.integrity : void 0, S = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      v === "style" ? r.d.S(
        m,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: y,
          integrity: x,
          fetchPriority: S
        }
      ) : v === "script" && r.d.X(m, {
        crossOrigin: y,
        integrity: x,
        fetchPriority: S,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, oe.preinitModule = function(m, p) {
    if (typeof m == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var v = h(
            p.as,
            p.crossOrigin
          );
          r.d.M(m, {
            crossOrigin: v,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && r.d.M(m);
  }, oe.preload = function(m, p) {
    if (typeof m == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var v = p.as, y = h(v, p.crossOrigin);
      r.d.L(m, v, {
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
  }, oe.preloadModule = function(m, p) {
    if (typeof m == "string")
      if (p) {
        var v = h(p.as, p.crossOrigin);
        r.d.m(m, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: v,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else r.d.m(m);
  }, oe.requestFormReset = function(m) {
    r.d.r(m);
  }, oe.unstable_batchedUpdates = function(m, p) {
    return m(p);
  }, oe.useFormState = function(m, p, v) {
    return d.H.useFormState(m, p, v);
  }, oe.useFormStatus = function() {
    return d.H.useHostTransitionStatus();
  }, oe.version = "19.0.0", oe;
}
var Vg;
function Oy() {
  if (Vg) return Yc.exports;
  Vg = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), Yc.exports = aT(), Yc.exports;
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
var Lg;
function sT() {
  if (Lg) return sl;
  Lg = 1;
  var n = nT(), i = Kf(), s = Oy();
  function r(t) {
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
  var f = Symbol.for("react.element"), d = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), m = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), v = Symbol.for("react.profiler"), y = Symbol.for("react.provider"), x = Symbol.for("react.consumer"), S = Symbol.for("react.context"), R = Symbol.for("react.forward_ref"), A = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), O = Symbol.for("react.memo"), z = Symbol.for("react.lazy"), U = Symbol.for("react.offscreen"), q = Symbol.for("react.memo_cache_sentinel"), B = Symbol.iterator;
  function L(t) {
    return t === null || typeof t != "object" ? null : (t = B && t[B] || t["@@iterator"], typeof t == "function" ? t : null);
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
      case v:
        return "Profiler";
      case p:
        return "StrictMode";
      case A:
        return "Suspense";
      case D:
        return "SuspenseList";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case S:
          return (t.displayName || "Context") + ".Provider";
        case x:
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
      var l = {
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
                  var V = k;
                }
                Reflect.construct(t, [], X);
              } else {
                try {
                  X.call();
                } catch (k) {
                  V = k;
                }
                t.call(X.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (k) {
                V = k;
              }
              (X = t()) && typeof X.catch == "function" && X.catch(function() {
              });
            }
          } catch (k) {
            if (k && V && typeof k.stack == "string")
              return [k.stack, V.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var o = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      o && o.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var c = l.DetermineComponentFrameRoot(), g = c[0], b = c[1];
      if (g && b) {
        var w = g.split(`
`), N = b.split(`
`);
        for (o = l = 0; l < w.length && !w[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; o < N.length && !N[o].includes(
          "DetermineComponentFrameRoot"
        ); )
          o++;
        if (l === w.length || o === N.length)
          for (l = w.length - 1, o = N.length - 1; 1 <= l && 0 <= o && w[l] !== N[o]; )
            o--;
        for (; 1 <= l && 0 <= o; l--, o--)
          if (w[l] !== N[o]) {
            if (l !== 1 || o !== 1)
              do
                if (l--, o--, 0 > o || w[l] !== N[o]) {
                  var H = `
` + w[l].replace(" at new ", " at ");
                  return t.displayName && H.includes("<anonymous>") && (H = H.replace("<anonymous>", t.displayName)), H;
                }
              while (1 <= l && 0 <= o);
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
      throw Error(r(188));
  }
  function K(t) {
    var e = t.alternate;
    if (!e) {
      if (e = Y(t), e === null) throw Error(r(188));
      return e !== t ? null : t;
    }
    for (var a = t, l = e; ; ) {
      var o = a.return;
      if (o === null) break;
      var c = o.alternate;
      if (c === null) {
        if (l = o.return, l !== null) {
          a = l;
          continue;
        }
        break;
      }
      if (o.child === c.child) {
        for (c = o.child; c; ) {
          if (c === a) return C(o), t;
          if (c === l) return C(o), e;
          c = c.sibling;
        }
        throw Error(r(188));
      }
      if (a.return !== l.return) a = o, l = c;
      else {
        for (var g = !1, b = o.child; b; ) {
          if (b === a) {
            g = !0, a = o, l = c;
            break;
          }
          if (b === l) {
            g = !0, l = o, a = c;
            break;
          }
          b = b.sibling;
        }
        if (!g) {
          for (b = c.child; b; ) {
            if (b === a) {
              g = !0, a = c, l = o;
              break;
            }
            if (b === l) {
              g = !0, l = c, a = o;
              break;
            }
            b = b.sibling;
          }
          if (!g) throw Error(r(189));
        }
      }
      if (a.alternate !== l) throw Error(r(190));
    }
    if (a.tag !== 3) throw Error(r(188));
    return a.stateNode.current === a ? t : e;
  }
  function lt(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = lt(t), e !== null) return e;
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
  var Se = At(null), Vn = At(null), me = At(null), vi = At(null);
  function ta(t, e) {
    switch (Dt(me, e), Dt(Vn, t), Dt(Se, null), t = e.nodeType, t) {
      case 9:
      case 11:
        e = (e = e.documentElement) && (e = e.namespaceURI) ? ig(e) : 0;
        break;
      default:
        if (t = t === 8 ? e.parentNode : e, e = t.tagName, t = t.namespaceURI)
          t = ig(t), e = ag(t, e);
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
    Vt(Se), Dt(Se, e);
  }
  function Ln() {
    Vt(Se), Vt(Vn), Vt(me);
  }
  function rs(t) {
    t.memoizedState !== null && Dt(vi, t);
    var e = Se.current, a = ag(e, t.type);
    e !== a && (Dt(Vn, t), Dt(Se, a));
  }
  function ea(t) {
    Vn.current === t && (Vt(Se), Vt(Vn)), vi.current === t && (Vt(vi), Is._currentValue = dt);
  }
  var Bn = Object.prototype.hasOwnProperty, jo = n.unstable_scheduleCallback, _o = n.unstable_cancelCallback, O1 = n.unstable_shouldYield, N1 = n.unstable_requestPaint, Je = n.unstable_now, j1 = n.unstable_getCurrentPriorityLevel, Kd = n.unstable_ImmediatePriority, Zd = n.unstable_UserBlockingPriority, Ml = n.unstable_NormalPriority, _1 = n.unstable_LowPriority, Qd = n.unstable_IdlePriority, z1 = n.log, V1 = n.unstable_setDisableYieldValue, os = null, Te = null;
  function L1(t) {
    if (Te && typeof Te.onCommitFiberRoot == "function")
      try {
        Te.onCommitFiberRoot(
          os,
          t,
          void 0,
          (t.current.flags & 128) === 128
        );
      } catch {
      }
  }
  function Un(t) {
    if (typeof z1 == "function" && V1(t), Te && typeof Te.setStrictMode == "function")
      try {
        Te.setStrictMode(os, t);
      } catch {
      }
  }
  var Ae = Math.clz32 ? Math.clz32 : k1, B1 = Math.log, U1 = Math.LN2;
  function k1(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (B1(t) / U1 | 0) | 0;
  }
  var Dl = 128, Ol = 4194304;
  function yi(t) {
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
  function Nl(t, e) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var l = 0, o = t.suspendedLanes, c = t.pingedLanes, g = t.warmLanes;
    t = t.finishedLanes !== 0;
    var b = a & 134217727;
    return b !== 0 ? (a = b & ~o, a !== 0 ? l = yi(a) : (c &= b, c !== 0 ? l = yi(c) : t || (g = b & ~g, g !== 0 && (l = yi(g))))) : (b = a & ~o, b !== 0 ? l = yi(b) : c !== 0 ? l = yi(c) : t || (g = a & ~g, g !== 0 && (l = yi(g)))), l === 0 ? 0 : e !== 0 && e !== l && !(e & o) && (o = l & -l, g = e & -e, o >= g || o === 32 && (g & 4194176) !== 0) ? e : l;
  }
  function us(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function H1(t, e) {
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
  function Fd() {
    var t = Dl;
    return Dl <<= 1, !(Dl & 4194176) && (Dl = 128), t;
  }
  function Wd() {
    var t = Ol;
    return Ol <<= 1, !(Ol & 62914560) && (Ol = 4194304), t;
  }
  function zo(t) {
    for (var e = [], a = 0; 31 > a; a++) e.push(t);
    return e;
  }
  function cs(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function P1(t, e, a, l, o, c) {
    var g = t.pendingLanes;
    t.pendingLanes = a, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= a, t.entangledLanes &= a, t.errorRecoveryDisabledLanes &= a, t.shellSuspendCounter = 0;
    var b = t.entanglements, w = t.expirationTimes, N = t.hiddenUpdates;
    for (a = g & ~a; 0 < a; ) {
      var H = 31 - Ae(a), X = 1 << H;
      b[H] = 0, w[H] = -1;
      var V = N[H];
      if (V !== null)
        for (N[H] = null, H = 0; H < V.length; H++) {
          var k = V[H];
          k !== null && (k.lane &= -536870913);
        }
      a &= ~X;
    }
    l !== 0 && $d(t, l, 0), c !== 0 && o === 0 && t.tag !== 0 && (t.suspendedLanes |= c & ~(g & ~e));
  }
  function $d(t, e, a) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var l = 31 - Ae(e);
    t.entangledLanes |= e, t.entanglements[l] = t.entanglements[l] | 1073741824 | a & 4194218;
  }
  function Jd(t, e) {
    var a = t.entangledLanes |= e;
    for (t = t.entanglements; a; ) {
      var l = 31 - Ae(a), o = 1 << l;
      o & e | t[l] & e && (t[l] |= e), a &= ~o;
    }
  }
  function Id(t) {
    return t &= -t, 2 < t ? 8 < t ? t & 134217727 ? 32 : 268435456 : 8 : 2;
  }
  function th() {
    var t = J.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : Tg(t.type));
  }
  function q1(t, e) {
    var a = J.p;
    try {
      return J.p = t, e();
    } finally {
      J.p = a;
    }
  }
  var kn = Math.random().toString(36).slice(2), le = "__reactFiber$" + kn, pe = "__reactProps$" + kn, na = "__reactContainer$" + kn, Vo = "__reactEvents$" + kn, G1 = "__reactListeners$" + kn, Y1 = "__reactHandles$" + kn, eh = "__reactResources$" + kn, fs = "__reactMarker$" + kn;
  function Lo(t) {
    delete t[le], delete t[pe], delete t[Vo], delete t[G1], delete t[Y1];
  }
  function bi(t) {
    var e = t[le];
    if (e) return e;
    for (var a = t.parentNode; a; ) {
      if (e = a[na] || a[le]) {
        if (a = e.alternate, e.child !== null || a !== null && a.child !== null)
          for (t = rg(t); t !== null; ) {
            if (a = t[le]) return a;
            t = rg(t);
          }
        return e;
      }
      t = a, a = t.parentNode;
    }
    return null;
  }
  function ia(t) {
    if (t = t[le] || t[na]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function ds(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(r(33));
  }
  function aa(t) {
    var e = t[eh];
    return e || (e = t[eh] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function $t(t) {
    t[fs] = !0;
  }
  var nh = /* @__PURE__ */ new Set(), ih = {};
  function xi(t, e) {
    sa(t, e), sa(t + "Capture", e);
  }
  function sa(t, e) {
    for (ih[t] = e, t = 0; t < e.length; t++)
      nh.add(e[t]);
  }
  var fn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), X1 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), ah = {}, sh = {};
  function K1(t) {
    return Bn.call(sh, t) ? !0 : Bn.call(ah, t) ? !1 : X1.test(t) ? sh[t] = !0 : (ah[t] = !0, !1);
  }
  function jl(t, e, a) {
    if (K1(e))
      if (a === null) t.removeAttribute(e);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var l = e.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + a);
      }
  }
  function _l(t, e, a) {
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
  function dn(t, e, a, l) {
    if (l === null) t.removeAttribute(a);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(a);
          return;
      }
      t.setAttributeNS(e, a, "" + l);
    }
  }
  function Oe(t) {
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
  function lh(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function Z1(t) {
    var e = lh(t) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    ), l = "" + t[e];
    if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var o = a.get, c = a.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return o.call(this);
        },
        set: function(g) {
          l = "" + g, c.call(this, g);
        }
      }), Object.defineProperty(t, e, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(g) {
          l = "" + g;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function zl(t) {
    t._valueTracker || (t._valueTracker = Z1(t));
  }
  function rh(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var a = e.getValue(), l = "";
    return t && (l = lh(t) ? t.checked ? "true" : "false" : t.value), t = l, t !== a ? (e.setValue(t), !0) : !1;
  }
  function Vl(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Q1 = /[\n"\\]/g;
  function Ne(t) {
    return t.replace(
      Q1,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Bo(t, e, a, l, o, c, g, b) {
    t.name = "", g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? t.type = g : t.removeAttribute("type"), e != null ? g === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Oe(e)) : t.value !== "" + Oe(e) && (t.value = "" + Oe(e)) : g !== "submit" && g !== "reset" || t.removeAttribute("value"), e != null ? Uo(t, g, Oe(e)) : a != null ? Uo(t, g, Oe(a)) : l != null && t.removeAttribute("value"), o == null && c != null && (t.defaultChecked = !!c), o != null && (t.checked = o && typeof o != "function" && typeof o != "symbol"), b != null && typeof b != "function" && typeof b != "symbol" && typeof b != "boolean" ? t.name = "" + Oe(b) : t.removeAttribute("name");
  }
  function oh(t, e, a, l, o, c, g, b) {
    if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.type = c), e != null || a != null) {
      if (!(c !== "submit" && c !== "reset" || e != null))
        return;
      a = a != null ? "" + Oe(a) : "", e = e != null ? "" + Oe(e) : a, b || e === t.value || (t.value = e), t.defaultValue = e;
    }
    l = l ?? o, l = typeof l != "function" && typeof l != "symbol" && !!l, t.checked = b ? t.checked : !!l, t.defaultChecked = !!l, g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" && (t.name = g);
  }
  function Uo(t, e, a) {
    e === "number" && Vl(t.ownerDocument) === t || t.defaultValue === "" + a || (t.defaultValue = "" + a);
  }
  function la(t, e, a, l) {
    if (t = t.options, e) {
      e = {};
      for (var o = 0; o < a.length; o++)
        e["$" + a[o]] = !0;
      for (a = 0; a < t.length; a++)
        o = e.hasOwnProperty("$" + t[a].value), t[a].selected !== o && (t[a].selected = o), o && l && (t[a].defaultSelected = !0);
    } else {
      for (a = "" + Oe(a), e = null, o = 0; o < t.length; o++) {
        if (t[o].value === a) {
          t[o].selected = !0, l && (t[o].defaultSelected = !0);
          return;
        }
        e !== null || t[o].disabled || (e = t[o]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function uh(t, e, a) {
    if (e != null && (e = "" + Oe(e), e !== t.value && (t.value = e), a == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = a != null ? "" + Oe(a) : "";
  }
  function ch(t, e, a, l) {
    if (e == null) {
      if (l != null) {
        if (a != null) throw Error(r(92));
        if (at(l)) {
          if (1 < l.length) throw Error(r(93));
          l = l[0];
        }
        a = l;
      }
      a == null && (a = ""), e = a;
    }
    a = Oe(e), t.defaultValue = a, l = t.textContent, l === a && l !== "" && l !== null && (t.value = l);
  }
  function ra(t, e) {
    if (e) {
      var a = t.firstChild;
      if (a && a === t.lastChild && a.nodeType === 3) {
        a.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var F1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function fh(t, e, a) {
    var l = e.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? l ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : l ? t.setProperty(e, a) : typeof a != "number" || a === 0 || F1.has(e) ? e === "float" ? t.cssFloat = a : t[e] = ("" + a).trim() : t[e] = a + "px";
  }
  function dh(t, e, a) {
    if (e != null && typeof e != "object")
      throw Error(r(62));
    if (t = t.style, a != null) {
      for (var l in a)
        !a.hasOwnProperty(l) || e != null && e.hasOwnProperty(l) || (l.indexOf("--") === 0 ? t.setProperty(l, "") : l === "float" ? t.cssFloat = "" : t[l] = "");
      for (var o in e)
        l = e[o], e.hasOwnProperty(o) && a[o] !== l && fh(t, o, l);
    } else
      for (var c in e)
        e.hasOwnProperty(c) && fh(t, c, e[c]);
  }
  function ko(t) {
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
  var W1 = /* @__PURE__ */ new Map([
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
  ]), $1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ll(t) {
    return $1.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  var Ho = null;
  function Po(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var oa = null, ua = null;
  function hh(t) {
    var e = ia(t);
    if (e && (t = e.stateNode)) {
      var a = t[pe] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (Bo(
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
              'input[name="' + Ne(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < a.length; e++) {
              var l = a[e];
              if (l !== t && l.form === t.form) {
                var o = l[pe] || null;
                if (!o) throw Error(r(90));
                Bo(
                  l,
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
              l = a[e], l.form === t.form && rh(l);
          }
          break t;
        case "textarea":
          uh(t, a.value, a.defaultValue);
          break t;
        case "select":
          e = a.value, e != null && la(t, !!a.multiple, e, !1);
      }
    }
  }
  var qo = !1;
  function mh(t, e, a) {
    if (qo) return t(e, a);
    qo = !0;
    try {
      var l = t(e);
      return l;
    } finally {
      if (qo = !1, (oa !== null || ua !== null) && (br(), oa && (e = oa, t = ua, ua = oa = null, hh(e), t)))
        for (e = 0; e < t.length; e++) hh(t[e]);
    }
  }
  function hs(t, e) {
    var a = t.stateNode;
    if (a === null) return null;
    var l = a[pe] || null;
    if (l === null) return null;
    a = l[e];
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
        (l = !l.disabled) || (t = t.type, l = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !l;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (a && typeof a != "function")
      throw Error(
        r(231, e, typeof a)
      );
    return a;
  }
  var Go = !1;
  if (fn)
    try {
      var ms = {};
      Object.defineProperty(ms, "passive", {
        get: function() {
          Go = !0;
        }
      }), window.addEventListener("test", ms, ms), window.removeEventListener("test", ms, ms);
    } catch {
      Go = !1;
    }
  var Hn = null, Yo = null, Bl = null;
  function ph() {
    if (Bl) return Bl;
    var t, e = Yo, a = e.length, l, o = "value" in Hn ? Hn.value : Hn.textContent, c = o.length;
    for (t = 0; t < a && e[t] === o[t]; t++) ;
    var g = a - t;
    for (l = 1; l <= g && e[a - l] === o[c - l]; l++) ;
    return Bl = o.slice(t, 1 < l ? 1 - l : void 0);
  }
  function Ul(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function kl() {
    return !0;
  }
  function gh() {
    return !1;
  }
  function ge(t) {
    function e(a, l, o, c, g) {
      this._reactName = a, this._targetInst = o, this.type = l, this.nativeEvent = c, this.target = g, this.currentTarget = null;
      for (var b in t)
        t.hasOwnProperty(b) && (a = t[b], this[b] = a ? a(c) : c[b]);
      return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? kl : gh, this.isPropagationStopped = gh, this;
    }
    return W(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = kl);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = kl);
      },
      persist: function() {
      },
      isPersistent: kl
    }), e;
  }
  var Si = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Hl = ge(Si), ps = W({}, Si, { view: 0, detail: 0 }), J1 = ge(ps), Xo, Ko, gs, Pl = W({}, ps, {
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
    getModifierState: Qo,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== gs && (gs && t.type === "mousemove" ? (Xo = t.screenX - gs.screenX, Ko = t.screenY - gs.screenY) : Ko = Xo = 0, gs = t), Xo);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Ko;
    }
  }), vh = ge(Pl), I1 = W({}, Pl, { dataTransfer: 0 }), tx = ge(I1), ex = W({}, ps, { relatedTarget: 0 }), Zo = ge(ex), nx = W({}, Si, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ix = ge(nx), ax = W({}, Si, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), sx = ge(ax), lx = W({}, Si, { data: 0 }), yh = ge(lx), rx = {
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
  }, ox = {
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
  }, ux = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function cx(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = ux[t]) ? !!e[t] : !1;
  }
  function Qo() {
    return cx;
  }
  var fx = W({}, ps, {
    key: function(t) {
      if (t.key) {
        var e = rx[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = Ul(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? ox[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Qo,
    charCode: function(t) {
      return t.type === "keypress" ? Ul(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? Ul(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), dx = ge(fx), hx = W({}, Pl, {
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
  }), bh = ge(hx), mx = W({}, ps, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Qo
  }), px = ge(mx), gx = W({}, Si, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), vx = ge(gx), yx = W({}, Pl, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), bx = ge(yx), xx = W({}, Si, {
    newState: 0,
    oldState: 0
  }), Sx = ge(xx), Tx = [9, 13, 27, 32], Fo = fn && "CompositionEvent" in window, vs = null;
  fn && "documentMode" in document && (vs = document.documentMode);
  var Ax = fn && "TextEvent" in window && !vs, xh = fn && (!Fo || vs && 8 < vs && 11 >= vs), Sh = " ", Th = !1;
  function Ah(t, e) {
    switch (t) {
      case "keyup":
        return Tx.indexOf(e.keyCode) !== -1;
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
  function Eh(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var ca = !1;
  function Ex(t, e) {
    switch (t) {
      case "compositionend":
        return Eh(e);
      case "keypress":
        return e.which !== 32 ? null : (Th = !0, Sh);
      case "textInput":
        return t = e.data, t === Sh && Th ? null : t;
      default:
        return null;
    }
  }
  function wx(t, e) {
    if (ca)
      return t === "compositionend" || !Fo && Ah(t, e) ? (t = ph(), Bl = Yo = Hn = null, ca = !1, t) : null;
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
        return xh && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Rx = {
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
  function wh(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!Rx[t.type] : e === "textarea";
  }
  function Rh(t, e, a, l) {
    oa ? ua ? ua.push(l) : ua = [l] : oa = l, e = Er(e, "onChange"), 0 < e.length && (a = new Hl(
      "onChange",
      "change",
      null,
      a,
      l
    ), t.push({ event: a, listeners: e }));
  }
  var ys = null, bs = null;
  function Cx(t) {
    Jp(t, 0);
  }
  function ql(t) {
    var e = ds(t);
    if (rh(e)) return t;
  }
  function Ch(t, e) {
    if (t === "change") return e;
  }
  var Mh = !1;
  if (fn) {
    var Wo;
    if (fn) {
      var $o = "oninput" in document;
      if (!$o) {
        var Dh = document.createElement("div");
        Dh.setAttribute("oninput", "return;"), $o = typeof Dh.oninput == "function";
      }
      Wo = $o;
    } else Wo = !1;
    Mh = Wo && (!document.documentMode || 9 < document.documentMode);
  }
  function Oh() {
    ys && (ys.detachEvent("onpropertychange", Nh), bs = ys = null);
  }
  function Nh(t) {
    if (t.propertyName === "value" && ql(bs)) {
      var e = [];
      Rh(
        e,
        bs,
        t,
        Po(t)
      ), mh(Cx, e);
    }
  }
  function Mx(t, e, a) {
    t === "focusin" ? (Oh(), ys = e, bs = a, ys.attachEvent("onpropertychange", Nh)) : t === "focusout" && Oh();
  }
  function Dx(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return ql(bs);
  }
  function Ox(t, e) {
    if (t === "click") return ql(e);
  }
  function Nx(t, e) {
    if (t === "input" || t === "change")
      return ql(e);
  }
  function jx(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var Ee = typeof Object.is == "function" ? Object.is : jx;
  function xs(t, e) {
    if (Ee(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var a = Object.keys(t), l = Object.keys(e);
    if (a.length !== l.length) return !1;
    for (l = 0; l < a.length; l++) {
      var o = a[l];
      if (!Bn.call(e, o) || !Ee(t[o], e[o]))
        return !1;
    }
    return !0;
  }
  function jh(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function _h(t, e) {
    var a = jh(t);
    t = 0;
    for (var l; a; ) {
      if (a.nodeType === 3) {
        if (l = t + a.textContent.length, t <= e && l >= e)
          return { node: a, offset: e - t };
        t = l;
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
      a = jh(a);
    }
  }
  function zh(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? zh(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function Vh(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = Vl(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var a = typeof e.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) t = e.contentWindow;
      else break;
      e = Vl(t.document);
    }
    return e;
  }
  function Jo(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  function _x(t, e) {
    var a = Vh(e);
    e = t.focusedElem;
    var l = t.selectionRange;
    if (a !== e && e && e.ownerDocument && zh(e.ownerDocument.documentElement, e)) {
      if (l !== null && Jo(e)) {
        if (t = l.start, a = l.end, a === void 0 && (a = t), "selectionStart" in e)
          e.selectionStart = t, e.selectionEnd = Math.min(
            a,
            e.value.length
          );
        else if (a = (t = e.ownerDocument || document) && t.defaultView || window, a.getSelection) {
          a = a.getSelection();
          var o = e.textContent.length, c = Math.min(l.start, o);
          l = l.end === void 0 ? c : Math.min(l.end, o), !a.extend && c > l && (o = l, l = c, c = o), o = _h(e, c);
          var g = _h(
            e,
            l
          );
          o && g && (a.rangeCount !== 1 || a.anchorNode !== o.node || a.anchorOffset !== o.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), a.removeAllRanges(), c > l ? (a.addRange(t), a.extend(g.node, g.offset)) : (t.setEnd(
            g.node,
            g.offset
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
  var zx = fn && "documentMode" in document && 11 >= document.documentMode, fa = null, Io = null, Ss = null, tu = !1;
  function Lh(t, e, a) {
    var l = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    tu || fa == null || fa !== Vl(l) || (l = fa, "selectionStart" in l && Jo(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), Ss && xs(Ss, l) || (Ss = l, l = Er(Io, "onSelect"), 0 < l.length && (e = new Hl(
      "onSelect",
      "select",
      null,
      e,
      a
    ), t.push({ event: e, listeners: l }), e.target = fa)));
  }
  function Ti(t, e) {
    var a = {};
    return a[t.toLowerCase()] = e.toLowerCase(), a["Webkit" + t] = "webkit" + e, a["Moz" + t] = "moz" + e, a;
  }
  var da = {
    animationend: Ti("Animation", "AnimationEnd"),
    animationiteration: Ti("Animation", "AnimationIteration"),
    animationstart: Ti("Animation", "AnimationStart"),
    transitionrun: Ti("Transition", "TransitionRun"),
    transitionstart: Ti("Transition", "TransitionStart"),
    transitioncancel: Ti("Transition", "TransitionCancel"),
    transitionend: Ti("Transition", "TransitionEnd")
  }, eu = {}, Bh = {};
  fn && (Bh = document.createElement("div").style, "AnimationEvent" in window || (delete da.animationend.animation, delete da.animationiteration.animation, delete da.animationstart.animation), "TransitionEvent" in window || delete da.transitionend.transition);
  function Ai(t) {
    if (eu[t]) return eu[t];
    if (!da[t]) return t;
    var e = da[t], a;
    for (a in e)
      if (e.hasOwnProperty(a) && a in Bh)
        return eu[t] = e[a];
    return t;
  }
  var Uh = Ai("animationend"), kh = Ai("animationiteration"), Hh = Ai("animationstart"), Vx = Ai("transitionrun"), Lx = Ai("transitionstart"), Bx = Ai("transitioncancel"), Ph = Ai("transitionend"), qh = /* @__PURE__ */ new Map(), Gh = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(
    " "
  );
  function Xe(t, e) {
    qh.set(t, e), xi(e, [t]);
  }
  var je = [], ha = 0, nu = 0;
  function Gl() {
    for (var t = ha, e = nu = ha = 0; e < t; ) {
      var a = je[e];
      je[e++] = null;
      var l = je[e];
      je[e++] = null;
      var o = je[e];
      je[e++] = null;
      var c = je[e];
      if (je[e++] = null, l !== null && o !== null) {
        var g = l.pending;
        g === null ? o.next = o : (o.next = g.next, g.next = o), l.pending = o;
      }
      c !== 0 && Yh(a, o, c);
    }
  }
  function Yl(t, e, a, l) {
    je[ha++] = t, je[ha++] = e, je[ha++] = a, je[ha++] = l, nu |= l, t.lanes |= l, t = t.alternate, t !== null && (t.lanes |= l);
  }
  function iu(t, e, a, l) {
    return Yl(t, e, a, l), Xl(t);
  }
  function Pn(t, e) {
    return Yl(t, null, null, e), Xl(t);
  }
  function Yh(t, e, a) {
    t.lanes |= a;
    var l = t.alternate;
    l !== null && (l.lanes |= a);
    for (var o = !1, c = t.return; c !== null; )
      c.childLanes |= a, l = c.alternate, l !== null && (l.childLanes |= a), c.tag === 22 && (t = c.stateNode, t === null || t._visibility & 1 || (o = !0)), t = c, c = c.return;
    o && e !== null && t.tag === 3 && (c = t.stateNode, o = 31 - Ae(a), c = c.hiddenUpdates, t = c[o], t === null ? c[o] = [e] : t.push(e), e.lane = a | 536870912);
  }
  function Xl(t) {
    if (50 < Ks)
      throw Ks = 0, uc = null, Error(r(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var ma = {}, Xh = /* @__PURE__ */ new WeakMap();
  function _e(t, e) {
    if (typeof t == "object" && t !== null) {
      var a = Xh.get(t);
      return a !== void 0 ? a : (e = {
        value: t,
        source: e,
        stack: $(e)
      }, Xh.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: $(e)
    };
  }
  var pa = [], ga = 0, Kl = null, Zl = 0, ze = [], Ve = 0, Ei = null, hn = 1, mn = "";
  function wi(t, e) {
    pa[ga++] = Zl, pa[ga++] = Kl, Kl = t, Zl = e;
  }
  function Kh(t, e, a) {
    ze[Ve++] = hn, ze[Ve++] = mn, ze[Ve++] = Ei, Ei = t;
    var l = hn;
    t = mn;
    var o = 32 - Ae(l) - 1;
    l &= ~(1 << o), a += 1;
    var c = 32 - Ae(e) + o;
    if (30 < c) {
      var g = o - o % 5;
      c = (l & (1 << g) - 1).toString(32), l >>= g, o -= g, hn = 1 << 32 - Ae(e) + o | a << o | l, mn = c + t;
    } else
      hn = 1 << c | a << o | l, mn = t;
  }
  function au(t) {
    t.return !== null && (wi(t, 1), Kh(t, 1, 0));
  }
  function su(t) {
    for (; t === Kl; )
      Kl = pa[--ga], pa[ga] = null, Zl = pa[--ga], pa[ga] = null;
    for (; t === Ei; )
      Ei = ze[--Ve], ze[Ve] = null, mn = ze[--Ve], ze[Ve] = null, hn = ze[--Ve], ze[Ve] = null;
  }
  var fe = null, ne = null, Et = !1, Ke = null, Ie = !1, lu = Error(r(519));
  function Ri(t) {
    var e = Error(r(418, ""));
    throw Es(_e(e, t)), lu;
  }
  function Zh(t) {
    var e = t.stateNode, a = t.type, l = t.memoizedProps;
    switch (e[le] = t, e[pe] = l, a) {
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
        for (a = 0; a < Qs.length; a++)
          St(Qs[a], e);
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
        St("invalid", e), oh(
          e,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        ), zl(e);
        break;
      case "select":
        St("invalid", e);
        break;
      case "textarea":
        St("invalid", e), ch(e, l.value, l.defaultValue, l.children), zl(e);
    }
    a = l.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || e.textContent === "" + a || l.suppressHydrationWarning === !0 || ng(e.textContent, a) ? (l.popover != null && (St("beforetoggle", e), St("toggle", e)), l.onScroll != null && St("scroll", e), l.onScrollEnd != null && St("scrollend", e), l.onClick != null && (e.onclick = wr), e = !0) : e = !1, e || Ri(t);
  }
  function Qh(t) {
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
  function Ts(t) {
    if (t !== fe) return !1;
    if (!Et) return Qh(t), Et = !0, !1;
    var e = !1, a;
    if ((a = t.tag !== 3 && t.tag !== 27) && ((a = t.tag === 5) && (a = t.type, a = !(a !== "form" && a !== "button") || Rc(t.type, t.memoizedProps)), a = !a), a && (e = !0), e && ne && Ri(t), Qh(t), t.tag === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      t: {
        for (t = t.nextSibling, e = 0; t; ) {
          if (t.nodeType === 8)
            if (a = t.data, a === "/$") {
              if (e === 0) {
                ne = Qe(t.nextSibling);
                break t;
              }
              e--;
            } else
              a !== "$" && a !== "$!" && a !== "$?" || e++;
          t = t.nextSibling;
        }
        ne = null;
      }
    } else
      ne = fe ? Qe(t.stateNode.nextSibling) : null;
    return !0;
  }
  function As() {
    ne = fe = null, Et = !1;
  }
  function Es(t) {
    Ke === null ? Ke = [t] : Ke.push(t);
  }
  var ws = Error(r(460)), Fh = Error(r(474)), ru = { then: function() {
  } };
  function Wh(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Ql() {
  }
  function $h(t, e, a) {
    switch (a = t[a], a === void 0 ? t.push(e) : a !== e && (e.then(Ql, Ql), e = a), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, t === ws ? Error(r(483)) : t;
      default:
        if (typeof e.status == "string") e.then(Ql, Ql);
        else {
          if (t = Nt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(r(482));
          t = e, t.status = "pending", t.then(
            function(l) {
              if (e.status === "pending") {
                var o = e;
                o.status = "fulfilled", o.value = l;
              }
            },
            function(l) {
              if (e.status === "pending") {
                var o = e;
                o.status = "rejected", o.reason = l;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, t === ws ? Error(r(483)) : t;
        }
        throw Rs = e, ws;
    }
  }
  var Rs = null;
  function Jh() {
    if (Rs === null) throw Error(r(459));
    var t = Rs;
    return Rs = null, t;
  }
  var va = null, Cs = 0;
  function Fl(t) {
    var e = Cs;
    return Cs += 1, va === null && (va = []), $h(va, t, e);
  }
  function Ms(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Wl(t, e) {
    throw e.$$typeof === f ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function Ih(t) {
    var e = t._init;
    return e(t._payload);
  }
  function tm(t) {
    function e(j, M) {
      if (t) {
        var _ = j.deletions;
        _ === null ? (j.deletions = [M], j.flags |= 16) : _.push(M);
      }
    }
    function a(j, M) {
      if (!t) return null;
      for (; M !== null; )
        e(j, M), M = M.sibling;
      return null;
    }
    function l(j) {
      for (var M = /* @__PURE__ */ new Map(); j !== null; )
        j.key !== null ? M.set(j.key, j) : M.set(j.index, j), j = j.sibling;
      return M;
    }
    function o(j, M) {
      return j = In(j, M), j.index = 0, j.sibling = null, j;
    }
    function c(j, M, _) {
      return j.index = _, t ? (_ = j.alternate, _ !== null ? (_ = _.index, _ < M ? (j.flags |= 33554434, M) : _) : (j.flags |= 33554434, M)) : (j.flags |= 1048576, M);
    }
    function g(j) {
      return t && j.alternate === null && (j.flags |= 33554434), j;
    }
    function b(j, M, _, G) {
      return M === null || M.tag !== 6 ? (M = ec(_, j.mode, G), M.return = j, M) : (M = o(M, _), M.return = j, M);
    }
    function w(j, M, _, G) {
      var I = _.type;
      return I === m ? H(
        j,
        M,
        _.props.children,
        G,
        _.key
      ) : M !== null && (M.elementType === I || typeof I == "object" && I !== null && I.$$typeof === z && Ih(I) === M.type) ? (M = o(M, _.props), Ms(M, _), M.return = j, M) : (M = mr(
        _.type,
        _.key,
        _.props,
        null,
        j.mode,
        G
      ), Ms(M, _), M.return = j, M);
    }
    function N(j, M, _, G) {
      return M === null || M.tag !== 4 || M.stateNode.containerInfo !== _.containerInfo || M.stateNode.implementation !== _.implementation ? (M = nc(_, j.mode, G), M.return = j, M) : (M = o(M, _.children || []), M.return = j, M);
    }
    function H(j, M, _, G, I) {
      return M === null || M.tag !== 7 ? (M = Li(
        _,
        j.mode,
        G,
        I
      ), M.return = j, M) : (M = o(M, _), M.return = j, M);
    }
    function X(j, M, _) {
      if (typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint")
        return M = ec(
          "" + M,
          j.mode,
          _
        ), M.return = j, M;
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case d:
            return _ = mr(
              M.type,
              M.key,
              M.props,
              null,
              j.mode,
              _
            ), Ms(_, M), _.return = j, _;
          case h:
            return M = nc(
              M,
              j.mode,
              _
            ), M.return = j, M;
          case z:
            var G = M._init;
            return M = G(M._payload), X(j, M, _);
        }
        if (at(M) || L(M))
          return M = Li(
            M,
            j.mode,
            _,
            null
          ), M.return = j, M;
        if (typeof M.then == "function")
          return X(j, Fl(M), _);
        if (M.$$typeof === S)
          return X(
            j,
            fr(j, M),
            _
          );
        Wl(j, M);
      }
      return null;
    }
    function V(j, M, _, G) {
      var I = M !== null ? M.key : null;
      if (typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint")
        return I !== null ? null : b(j, M, "" + _, G);
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case d:
            return _.key === I ? w(j, M, _, G) : null;
          case h:
            return _.key === I ? N(j, M, _, G) : null;
          case z:
            return I = _._init, _ = I(_._payload), V(j, M, _, G);
        }
        if (at(_) || L(_))
          return I !== null ? null : H(j, M, _, G, null);
        if (typeof _.then == "function")
          return V(
            j,
            M,
            Fl(_),
            G
          );
        if (_.$$typeof === S)
          return V(
            j,
            M,
            fr(j, _),
            G
          );
        Wl(j, _);
      }
      return null;
    }
    function k(j, M, _, G, I) {
      if (typeof G == "string" && G !== "" || typeof G == "number" || typeof G == "bigint")
        return j = j.get(_) || null, b(M, j, "" + G, I);
      if (typeof G == "object" && G !== null) {
        switch (G.$$typeof) {
          case d:
            return j = j.get(
              G.key === null ? _ : G.key
            ) || null, w(M, j, G, I);
          case h:
            return j = j.get(
              G.key === null ? _ : G.key
            ) || null, N(M, j, G, I);
          case z:
            var vt = G._init;
            return G = vt(G._payload), k(
              j,
              M,
              _,
              G,
              I
            );
        }
        if (at(G) || L(G))
          return j = j.get(_) || null, H(M, j, G, I, null);
        if (typeof G.then == "function")
          return k(
            j,
            M,
            _,
            Fl(G),
            I
          );
        if (G.$$typeof === S)
          return k(
            j,
            M,
            _,
            fr(M, G),
            I
          );
        Wl(M, G);
      }
      return null;
    }
    function it(j, M, _, G) {
      for (var I = null, vt = null, st = M, rt = M = 0, te = null; st !== null && rt < _.length; rt++) {
        st.index > rt ? (te = st, st = null) : te = st.sibling;
        var wt = V(
          j,
          st,
          _[rt],
          G
        );
        if (wt === null) {
          st === null && (st = te);
          break;
        }
        t && st && wt.alternate === null && e(j, st), M = c(wt, M, rt), vt === null ? I = wt : vt.sibling = wt, vt = wt, st = te;
      }
      if (rt === _.length)
        return a(j, st), Et && wi(j, rt), I;
      if (st === null) {
        for (; rt < _.length; rt++)
          st = X(j, _[rt], G), st !== null && (M = c(
            st,
            M,
            rt
          ), vt === null ? I = st : vt.sibling = st, vt = st);
        return Et && wi(j, rt), I;
      }
      for (st = l(st); rt < _.length; rt++)
        te = k(
          st,
          j,
          rt,
          _[rt],
          G
        ), te !== null && (t && te.alternate !== null && st.delete(
          te.key === null ? rt : te.key
        ), M = c(
          te,
          M,
          rt
        ), vt === null ? I = te : vt.sibling = te, vt = te);
      return t && st.forEach(function(li) {
        return e(j, li);
      }), Et && wi(j, rt), I;
    }
    function ct(j, M, _, G) {
      if (_ == null) throw Error(r(151));
      for (var I = null, vt = null, st = M, rt = M = 0, te = null, wt = _.next(); st !== null && !wt.done; rt++, wt = _.next()) {
        st.index > rt ? (te = st, st = null) : te = st.sibling;
        var li = V(j, st, wt.value, G);
        if (li === null) {
          st === null && (st = te);
          break;
        }
        t && st && li.alternate === null && e(j, st), M = c(li, M, rt), vt === null ? I = li : vt.sibling = li, vt = li, st = te;
      }
      if (wt.done)
        return a(j, st), Et && wi(j, rt), I;
      if (st === null) {
        for (; !wt.done; rt++, wt = _.next())
          wt = X(j, wt.value, G), wt !== null && (M = c(wt, M, rt), vt === null ? I = wt : vt.sibling = wt, vt = wt);
        return Et && wi(j, rt), I;
      }
      for (st = l(st); !wt.done; rt++, wt = _.next())
        wt = k(st, j, rt, wt.value, G), wt !== null && (t && wt.alternate !== null && st.delete(wt.key === null ? rt : wt.key), M = c(wt, M, rt), vt === null ? I = wt : vt.sibling = wt, vt = wt);
      return t && st.forEach(function($S) {
        return e(j, $S);
      }), Et && wi(j, rt), I;
    }
    function Pt(j, M, _, G) {
      if (typeof _ == "object" && _ !== null && _.type === m && _.key === null && (_ = _.props.children), typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case d:
            t: {
              for (var I = _.key; M !== null; ) {
                if (M.key === I) {
                  if (I = _.type, I === m) {
                    if (M.tag === 7) {
                      a(
                        j,
                        M.sibling
                      ), G = o(
                        M,
                        _.props.children
                      ), G.return = j, j = G;
                      break t;
                    }
                  } else if (M.elementType === I || typeof I == "object" && I !== null && I.$$typeof === z && Ih(I) === M.type) {
                    a(
                      j,
                      M.sibling
                    ), G = o(M, _.props), Ms(G, _), G.return = j, j = G;
                    break t;
                  }
                  a(j, M);
                  break;
                } else e(j, M);
                M = M.sibling;
              }
              _.type === m ? (G = Li(
                _.props.children,
                j.mode,
                G,
                _.key
              ), G.return = j, j = G) : (G = mr(
                _.type,
                _.key,
                _.props,
                null,
                j.mode,
                G
              ), Ms(G, _), G.return = j, j = G);
            }
            return g(j);
          case h:
            t: {
              for (I = _.key; M !== null; ) {
                if (M.key === I)
                  if (M.tag === 4 && M.stateNode.containerInfo === _.containerInfo && M.stateNode.implementation === _.implementation) {
                    a(
                      j,
                      M.sibling
                    ), G = o(M, _.children || []), G.return = j, j = G;
                    break t;
                  } else {
                    a(j, M);
                    break;
                  }
                else e(j, M);
                M = M.sibling;
              }
              G = nc(_, j.mode, G), G.return = j, j = G;
            }
            return g(j);
          case z:
            return I = _._init, _ = I(_._payload), Pt(
              j,
              M,
              _,
              G
            );
        }
        if (at(_))
          return it(
            j,
            M,
            _,
            G
          );
        if (L(_)) {
          if (I = L(_), typeof I != "function") throw Error(r(150));
          return _ = I.call(_), ct(
            j,
            M,
            _,
            G
          );
        }
        if (typeof _.then == "function")
          return Pt(
            j,
            M,
            Fl(_),
            G
          );
        if (_.$$typeof === S)
          return Pt(
            j,
            M,
            fr(j, _),
            G
          );
        Wl(j, _);
      }
      return typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint" ? (_ = "" + _, M !== null && M.tag === 6 ? (a(j, M.sibling), G = o(M, _), G.return = j, j = G) : (a(j, M), G = ec(_, j.mode, G), G.return = j, j = G), g(j)) : a(j, M);
    }
    return function(j, M, _, G) {
      try {
        Cs = 0;
        var I = Pt(
          j,
          M,
          _,
          G
        );
        return va = null, I;
      } catch (st) {
        if (st === ws) throw st;
        var vt = ke(29, st, null, j.mode);
        return vt.lanes = G, vt.return = j, vt;
      } finally {
      }
    };
  }
  var Ci = tm(!0), em = tm(!1), ya = At(null), $l = At(0);
  function nm(t, e) {
    t = wn, Dt($l, t), Dt(ya, e), wn = t | e.baseLanes;
  }
  function ou() {
    Dt($l, wn), Dt(ya, ya.current);
  }
  function uu() {
    wn = $l.current, Vt(ya), Vt($l);
  }
  var Le = At(null), tn = null;
  function qn(t) {
    var e = t.alternate;
    Dt(Ft, Ft.current & 1), Dt(Le, t), tn === null && (e === null || ya.current !== null || e.memoizedState !== null) && (tn = t);
  }
  function im(t) {
    if (t.tag === 22) {
      if (Dt(Ft, Ft.current), Dt(Le, t), tn === null) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (tn = t);
      }
    } else Gn();
  }
  function Gn() {
    Dt(Ft, Ft.current), Dt(Le, Le.current);
  }
  function pn(t) {
    Vt(Le), tn === t && (tn = null), Vt(Ft);
  }
  var Ft = At(0);
  function Jl(t) {
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
  var Ux = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(a, l) {
        t.push(l);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(a) {
        return a();
      });
    };
  }, kx = n.unstable_scheduleCallback, Hx = n.unstable_NormalPriority, Wt = {
    $$typeof: S,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function cu() {
    return {
      controller: new Ux(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ds(t) {
    t.refCount--, t.refCount === 0 && kx(Hx, function() {
      t.controller.abort();
    });
  }
  var Os = null, fu = 0, ba = 0, xa = null;
  function Px(t, e) {
    if (Os === null) {
      var a = Os = [];
      fu = 0, ba = vc(), xa = {
        status: "pending",
        value: void 0,
        then: function(l) {
          a.push(l);
        }
      };
    }
    return fu++, e.then(am, am), e;
  }
  function am() {
    if (--fu === 0 && Os !== null) {
      xa !== null && (xa.status = "fulfilled");
      var t = Os;
      Os = null, ba = 0, xa = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function qx(t, e) {
    var a = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(o) {
        a.push(o);
      }
    };
    return t.then(
      function() {
        l.status = "fulfilled", l.value = e;
        for (var o = 0; o < a.length; o++) (0, a[o])(e);
      },
      function(o) {
        for (l.status = "rejected", l.reason = o, o = 0; o < a.length; o++)
          (0, a[o])(void 0);
      }
    ), l;
  }
  var sm = Q.S;
  Q.S = function(t, e) {
    typeof e == "object" && e !== null && typeof e.then == "function" && Px(t, e), sm !== null && sm(t, e);
  };
  var Mi = At(null);
  function du() {
    var t = Mi.current;
    return t !== null ? t : Nt.pooledCache;
  }
  function Il(t, e) {
    e === null ? Dt(Mi, Mi.current) : Dt(Mi, e.pool);
  }
  function lm() {
    var t = du();
    return t === null ? null : { parent: Wt._currentValue, pool: t };
  }
  var Yn = 0, gt = null, Ct = null, Kt = null, tr = !1, Sa = !1, Di = !1, er = 0, Ns = 0, Ta = null, Gx = 0;
  function Yt() {
    throw Error(r(321));
  }
  function hu(t, e) {
    if (e === null) return !1;
    for (var a = 0; a < e.length && a < t.length; a++)
      if (!Ee(t[a], e[a])) return !1;
    return !0;
  }
  function mu(t, e, a, l, o, c) {
    return Yn = c, gt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, Q.H = t === null || t.memoizedState === null ? Oi : Xn, Di = !1, c = a(l, o), Di = !1, Sa && (c = om(
      e,
      a,
      l,
      o
    )), rm(t), c;
  }
  function rm(t) {
    Q.H = en;
    var e = Ct !== null && Ct.next !== null;
    if (Yn = 0, Kt = Ct = gt = null, tr = !1, Ns = 0, Ta = null, e) throw Error(r(300));
    t === null || Jt || (t = t.dependencies, t !== null && cr(t) && (Jt = !0));
  }
  function om(t, e, a, l) {
    gt = t;
    var o = 0;
    do {
      if (Sa && (Ta = null), Ns = 0, Sa = !1, 25 <= o) throw Error(r(301));
      if (o += 1, Kt = Ct = null, t.updateQueue != null) {
        var c = t.updateQueue;
        c.lastEffect = null, c.events = null, c.stores = null, c.memoCache != null && (c.memoCache.index = 0);
      }
      Q.H = Ni, c = e(a, l);
    } while (Sa);
    return c;
  }
  function Yx() {
    var t = Q.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? js(e) : e, t = t.useState()[0], (Ct !== null ? Ct.memoizedState : null) !== t && (gt.flags |= 1024), e;
  }
  function pu() {
    var t = er !== 0;
    return er = 0, t;
  }
  function gu(t, e, a) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~a;
  }
  function vu(t) {
    if (tr) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      tr = !1;
    }
    Yn = 0, Kt = Ct = gt = null, Sa = !1, Ns = er = 0, Ta = null;
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
        throw gt.alternate === null ? Error(r(467)) : Error(r(310));
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
  var nr;
  nr = function() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  };
  function js(t) {
    var e = Ns;
    return Ns += 1, Ta === null && (Ta = []), t = $h(Ta, t, e), e = gt, (Kt === null ? e.memoizedState : Kt.next) === null && (e = e.alternate, Q.H = e === null || e.memoizedState === null ? Oi : Xn), t;
  }
  function ir(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return js(t);
      if (t.$$typeof === S) return re(t);
    }
    throw Error(r(438, String(t)));
  }
  function yu(t) {
    var e = null, a = gt.updateQueue;
    if (a !== null && (e = a.memoCache), e == null) {
      var l = gt.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (e = {
        data: l.data.map(function(o) {
          return o.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), a === null && (a = nr(), gt.updateQueue = a), a.memoCache = e, a = e.data[e.index], a === void 0)
      for (a = e.data[e.index] = Array(t), l = 0; l < t; l++)
        a[l] = q;
    return e.index++, a;
  }
  function gn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function ar(t) {
    var e = Zt();
    return bu(e, Ct, t);
  }
  function bu(t, e, a) {
    var l = t.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = a;
    var o = t.baseQueue, c = l.pending;
    if (c !== null) {
      if (o !== null) {
        var g = o.next;
        o.next = c.next, c.next = g;
      }
      e.baseQueue = o = c, l.pending = null;
    }
    if (c = t.baseState, o === null) t.memoizedState = c;
    else {
      e = o.next;
      var b = g = null, w = null, N = e, H = !1;
      do {
        var X = N.lane & -536870913;
        if (X !== N.lane ? (Tt & X) === X : (Yn & X) === X) {
          var V = N.revertLane;
          if (V === 0)
            w !== null && (w = w.next = {
              lane: 0,
              revertLane: 0,
              action: N.action,
              hasEagerState: N.hasEagerState,
              eagerState: N.eagerState,
              next: null
            }), X === ba && (H = !0);
          else if ((Yn & V) === V) {
            N = N.next, V === ba && (H = !0);
            continue;
          } else
            X = {
              lane: 0,
              revertLane: N.revertLane,
              action: N.action,
              hasEagerState: N.hasEagerState,
              eagerState: N.eagerState,
              next: null
            }, w === null ? (b = w = X, g = c) : w = w.next = X, gt.lanes |= V, ti |= V;
          X = N.action, Di && a(c, X), c = N.hasEagerState ? N.eagerState : a(c, X);
        } else
          V = {
            lane: X,
            revertLane: N.revertLane,
            action: N.action,
            hasEagerState: N.hasEagerState,
            eagerState: N.eagerState,
            next: null
          }, w === null ? (b = w = V, g = c) : w = w.next = V, gt.lanes |= X, ti |= X;
        N = N.next;
      } while (N !== null && N !== e);
      if (w === null ? g = c : w.next = b, !Ee(c, t.memoizedState) && (Jt = !0, H && (a = xa, a !== null)))
        throw a;
      t.memoizedState = c, t.baseState = g, t.baseQueue = w, l.lastRenderedState = c;
    }
    return o === null && (l.lanes = 0), [t.memoizedState, l.dispatch];
  }
  function xu(t) {
    var e = Zt(), a = e.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = t;
    var l = a.dispatch, o = a.pending, c = e.memoizedState;
    if (o !== null) {
      a.pending = null;
      var g = o = o.next;
      do
        c = t(c, g.action), g = g.next;
      while (g !== o);
      Ee(c, e.memoizedState) || (Jt = !0), e.memoizedState = c, e.baseQueue === null && (e.baseState = c), a.lastRenderedState = c;
    }
    return [c, l];
  }
  function um(t, e, a) {
    var l = gt, o = Zt(), c = Et;
    if (c) {
      if (a === void 0) throw Error(r(407));
      a = a();
    } else a = e();
    var g = !Ee(
      (Ct || o).memoizedState,
      a
    );
    if (g && (o.memoizedState = a, Jt = !0), o = o.queue, Au(dm.bind(null, l, o, t), [
      t
    ]), o.getSnapshot !== e || g || Kt !== null && Kt.memoizedState.tag & 1) {
      if (l.flags |= 2048, Aa(
        9,
        fm.bind(
          null,
          l,
          o,
          a,
          e
        ),
        { destroy: void 0 },
        null
      ), Nt === null) throw Error(r(349));
      c || Yn & 60 || cm(l, e, a);
    }
    return a;
  }
  function cm(t, e, a) {
    t.flags |= 16384, t = { getSnapshot: e, value: a }, e = gt.updateQueue, e === null ? (e = nr(), gt.updateQueue = e, e.stores = [t]) : (a = e.stores, a === null ? e.stores = [t] : a.push(t));
  }
  function fm(t, e, a, l) {
    e.value = a, e.getSnapshot = l, hm(e) && mm(t);
  }
  function dm(t, e, a) {
    return a(function() {
      hm(e) && mm(t);
    });
  }
  function hm(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var a = e();
      return !Ee(t, a);
    } catch {
      return !0;
    }
  }
  function mm(t) {
    var e = Pn(t, 2);
    e !== null && de(e, t, 2);
  }
  function Su(t) {
    var e = ve();
    if (typeof t == "function") {
      var a = t;
      if (t = a(), Di) {
        Un(!0);
        try {
          a();
        } finally {
          Un(!1);
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
  function pm(t, e, a, l) {
    return t.baseState = a, bu(
      t,
      Ct,
      typeof l == "function" ? l : gn
    );
  }
  function Xx(t, e, a, l, o) {
    if (rr(t)) throw Error(r(485));
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
      Q.T !== null ? a(!0) : c.isTransition = !1, l(c), a = e.pending, a === null ? (c.next = e.pending = c, gm(e, c)) : (c.next = a.next, e.pending = a.next = c);
    }
  }
  function gm(t, e) {
    var a = e.action, l = e.payload, o = t.state;
    if (e.isTransition) {
      var c = Q.T, g = {};
      Q.T = g;
      try {
        var b = a(o, l), w = Q.S;
        w !== null && w(g, b), vm(t, e, b);
      } catch (N) {
        Tu(t, e, N);
      } finally {
        Q.T = c;
      }
    } else
      try {
        c = a(o, l), vm(t, e, c);
      } catch (N) {
        Tu(t, e, N);
      }
  }
  function vm(t, e, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(l) {
        ym(t, e, l);
      },
      function(l) {
        return Tu(t, e, l);
      }
    ) : ym(t, e, a);
  }
  function ym(t, e, a) {
    e.status = "fulfilled", e.value = a, bm(e), t.state = a, e = t.pending, e !== null && (a = e.next, a === e ? t.pending = null : (a = a.next, e.next = a, gm(t, a)));
  }
  function Tu(t, e, a) {
    var l = t.pending;
    if (t.pending = null, l !== null) {
      l = l.next;
      do
        e.status = "rejected", e.reason = a, bm(e), e = e.next;
      while (e !== l);
    }
    t.action = null;
  }
  function bm(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function xm(t, e) {
    return e;
  }
  function Sm(t, e) {
    if (Et) {
      var a = Nt.formState;
      if (a !== null) {
        t: {
          var l = gt;
          if (Et) {
            if (ne) {
              e: {
                for (var o = ne, c = Ie; o.nodeType !== 8; ) {
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
                ne = Qe(
                  o.nextSibling
                ), l = o.data === "F!";
                break t;
              }
            }
            Ri(l);
          }
          l = !1;
        }
        l && (e = a[0]);
      }
    }
    return a = ve(), a.memoizedState = a.baseState = e, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: xm,
      lastRenderedState: e
    }, a.queue = l, a = km.bind(
      null,
      gt,
      l
    ), l.dispatch = a, l = Su(!1), c = Mu.bind(
      null,
      gt,
      !1,
      l.queue
    ), l = ve(), o = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, l.queue = o, a = Xx.bind(
      null,
      gt,
      o,
      c,
      a
    ), o.dispatch = a, l.memoizedState = t, [e, a, !1];
  }
  function Tm(t) {
    var e = Zt();
    return Am(e, Ct, t);
  }
  function Am(t, e, a) {
    e = bu(
      t,
      e,
      xm
    )[0], t = ar(gn)[0], e = typeof e == "object" && e !== null && typeof e.then == "function" ? js(e) : e;
    var l = Zt(), o = l.queue, c = o.dispatch;
    return a !== l.memoizedState && (gt.flags |= 2048, Aa(
      9,
      Kx.bind(null, o, a),
      { destroy: void 0 },
      null
    )), [e, c, t];
  }
  function Kx(t, e) {
    t.action = e;
  }
  function Em(t) {
    var e = Zt(), a = Ct;
    if (a !== null)
      return Am(e, a, t);
    Zt(), e = e.memoizedState, a = Zt();
    var l = a.queue.dispatch;
    return a.memoizedState = t, [e, l, !1];
  }
  function Aa(t, e, a, l) {
    return t = { tag: t, create: e, inst: a, deps: l, next: null }, e = gt.updateQueue, e === null && (e = nr(), gt.updateQueue = e), a = e.lastEffect, a === null ? e.lastEffect = t.next = t : (l = a.next, a.next = t, t.next = l, e.lastEffect = t), t;
  }
  function wm() {
    return Zt().memoizedState;
  }
  function sr(t, e, a, l) {
    var o = ve();
    gt.flags |= t, o.memoizedState = Aa(
      1 | e,
      a,
      { destroy: void 0 },
      l === void 0 ? null : l
    );
  }
  function lr(t, e, a, l) {
    var o = Zt();
    l = l === void 0 ? null : l;
    var c = o.memoizedState.inst;
    Ct !== null && l !== null && hu(l, Ct.memoizedState.deps) ? o.memoizedState = Aa(e, a, c, l) : (gt.flags |= t, o.memoizedState = Aa(1 | e, a, c, l));
  }
  function Rm(t, e) {
    sr(8390656, 8, t, e);
  }
  function Au(t, e) {
    lr(2048, 8, t, e);
  }
  function Cm(t, e) {
    return lr(4, 2, t, e);
  }
  function Mm(t, e) {
    return lr(4, 4, t, e);
  }
  function Dm(t, e) {
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
  function Om(t, e, a) {
    a = a != null ? a.concat([t]) : null, lr(4, 4, Dm.bind(null, e, t), a);
  }
  function Eu() {
  }
  function Nm(t, e) {
    var a = Zt();
    e = e === void 0 ? null : e;
    var l = a.memoizedState;
    return e !== null && hu(e, l[1]) ? l[0] : (a.memoizedState = [t, e], t);
  }
  function jm(t, e) {
    var a = Zt();
    e = e === void 0 ? null : e;
    var l = a.memoizedState;
    if (e !== null && hu(e, l[1]))
      return l[0];
    if (l = t(), Di) {
      Un(!0);
      try {
        t();
      } finally {
        Un(!1);
      }
    }
    return a.memoizedState = [l, e], l;
  }
  function wu(t, e, a) {
    return a === void 0 || Yn & 1073741824 ? t.memoizedState = e : (t.memoizedState = a, t = zp(), gt.lanes |= t, ti |= t, a);
  }
  function _m(t, e, a, l) {
    return Ee(a, e) ? a : ya.current !== null ? (t = wu(t, a, l), Ee(t, e) || (Jt = !0), t) : Yn & 42 ? (t = zp(), gt.lanes |= t, ti |= t, e) : (Jt = !0, t.memoizedState = a);
  }
  function zm(t, e, a, l, o) {
    var c = J.p;
    J.p = c !== 0 && 8 > c ? c : 8;
    var g = Q.T, b = {};
    Q.T = b, Mu(t, !1, e, a);
    try {
      var w = o(), N = Q.S;
      if (N !== null && N(b, w), w !== null && typeof w == "object" && typeof w.then == "function") {
        var H = qx(
          w,
          l
        );
        _s(
          t,
          e,
          H,
          Me(t)
        );
      } else
        _s(
          t,
          e,
          l,
          Me(t)
        );
    } catch (X) {
      _s(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: X },
        Me()
      );
    } finally {
      J.p = c, Q.T = g;
    }
  }
  function Zx() {
  }
  function Ru(t, e, a, l) {
    if (t.tag !== 5) throw Error(r(476));
    var o = Vm(t).queue;
    zm(
      t,
      o,
      e,
      dt,
      a === null ? Zx : function() {
        return Lm(t), a(l);
      }
    );
  }
  function Vm(t) {
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
  function Lm(t) {
    var e = Vm(t).next.queue;
    _s(t, e, {}, Me());
  }
  function Cu() {
    return re(Is);
  }
  function Bm() {
    return Zt().memoizedState;
  }
  function Um() {
    return Zt().memoizedState;
  }
  function Qx(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var a = Me();
          t = Qn(a);
          var l = Fn(e, t, a);
          l !== null && (de(l, e, a), Ls(l, e, a)), e = { cache: cu() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function Fx(t, e, a) {
    var l = Me();
    a = {
      lane: l,
      revertLane: 0,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, rr(t) ? Hm(e, a) : (a = iu(t, e, a, l), a !== null && (de(a, t, l), Pm(a, e, l)));
  }
  function km(t, e, a) {
    var l = Me();
    _s(t, e, a, l);
  }
  function _s(t, e, a, l) {
    var o = {
      lane: l,
      revertLane: 0,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (rr(t)) Hm(e, o);
    else {
      var c = t.alternate;
      if (t.lanes === 0 && (c === null || c.lanes === 0) && (c = e.lastRenderedReducer, c !== null))
        try {
          var g = e.lastRenderedState, b = c(g, a);
          if (o.hasEagerState = !0, o.eagerState = b, Ee(b, g))
            return Yl(t, e, o, 0), Nt === null && Gl(), !1;
        } catch {
        } finally {
        }
      if (a = iu(t, e, o, l), a !== null)
        return de(a, t, l), Pm(a, e, l), !0;
    }
    return !1;
  }
  function Mu(t, e, a, l) {
    if (l = {
      lane: 2,
      revertLane: vc(),
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, rr(t)) {
      if (e) throw Error(r(479));
    } else
      e = iu(
        t,
        a,
        l,
        2
      ), e !== null && de(e, t, 2);
  }
  function rr(t) {
    var e = t.alternate;
    return t === gt || e !== null && e === gt;
  }
  function Hm(t, e) {
    Sa = tr = !0;
    var a = t.pending;
    a === null ? e.next = e : (e.next = a.next, a.next = e), t.pending = e;
  }
  function Pm(t, e, a) {
    if (a & 4194176) {
      var l = e.lanes;
      l &= t.pendingLanes, a |= l, e.lanes = a, Jd(t, a);
    }
  }
  var en = {
    readContext: re,
    use: ir,
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
  var Oi = {
    readContext: re,
    use: ir,
    useCallback: function(t, e) {
      return ve().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: re,
    useEffect: Rm,
    useImperativeHandle: function(t, e, a) {
      a = a != null ? a.concat([t]) : null, sr(
        4194308,
        4,
        Dm.bind(null, e, t),
        a
      );
    },
    useLayoutEffect: function(t, e) {
      return sr(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      sr(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var a = ve();
      e = e === void 0 ? null : e;
      var l = t();
      if (Di) {
        Un(!0);
        try {
          t();
        } finally {
          Un(!1);
        }
      }
      return a.memoizedState = [l, e], l;
    },
    useReducer: function(t, e, a) {
      var l = ve();
      if (a !== void 0) {
        var o = a(e);
        if (Di) {
          Un(!0);
          try {
            a(e);
          } finally {
            Un(!1);
          }
        }
      } else o = e;
      return l.memoizedState = l.baseState = o, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: o
      }, l.queue = t, t = t.dispatch = Fx.bind(
        null,
        gt,
        t
      ), [l.memoizedState, t];
    },
    useRef: function(t) {
      var e = ve();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Su(t);
      var e = t.queue, a = km.bind(null, gt, e);
      return e.dispatch = a, [t.memoizedState, a];
    },
    useDebugValue: Eu,
    useDeferredValue: function(t, e) {
      var a = ve();
      return wu(a, t, e);
    },
    useTransition: function() {
      var t = Su(!1);
      return t = zm.bind(
        null,
        gt,
        t.queue,
        !0,
        !1
      ), ve().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, a) {
      var l = gt, o = ve();
      if (Et) {
        if (a === void 0)
          throw Error(r(407));
        a = a();
      } else {
        if (a = e(), Nt === null) throw Error(r(349));
        Tt & 60 || cm(l, e, a);
      }
      o.memoizedState = a;
      var c = { value: a, getSnapshot: e };
      return o.queue = c, Rm(dm.bind(null, l, c, t), [
        t
      ]), l.flags |= 2048, Aa(
        9,
        fm.bind(
          null,
          l,
          c,
          a,
          e
        ),
        { destroy: void 0 },
        null
      ), a;
    },
    useId: function() {
      var t = ve(), e = Nt.identifierPrefix;
      if (Et) {
        var a = mn, l = hn;
        a = (l & ~(1 << 32 - Ae(l) - 1)).toString(32) + a, e = ":" + e + "R" + a, a = er++, 0 < a && (e += "H" + a.toString(32)), e += ":";
      } else
        a = Gx++, e = ":" + e + "r" + a.toString(32) + ":";
      return t.memoizedState = e;
    },
    useCacheRefresh: function() {
      return ve().memoizedState = Qx.bind(
        null,
        gt
      );
    }
  };
  Oi.useMemoCache = yu, Oi.useHostTransitionStatus = Cu, Oi.useFormState = Sm, Oi.useActionState = Sm, Oi.useOptimistic = function(t) {
    var e = ve();
    e.memoizedState = e.baseState = t;
    var a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: null,
      lastRenderedState: null
    };
    return e.queue = a, e = Mu.bind(
      null,
      gt,
      !0,
      a
    ), a.dispatch = e, [t, e];
  };
  var Xn = {
    readContext: re,
    use: ir,
    useCallback: Nm,
    useContext: re,
    useEffect: Au,
    useImperativeHandle: Om,
    useInsertionEffect: Cm,
    useLayoutEffect: Mm,
    useMemo: jm,
    useReducer: ar,
    useRef: wm,
    useState: function() {
      return ar(gn);
    },
    useDebugValue: Eu,
    useDeferredValue: function(t, e) {
      var a = Zt();
      return _m(
        a,
        Ct.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = ar(gn)[0], e = Zt().memoizedState;
      return [
        typeof t == "boolean" ? t : js(t),
        e
      ];
    },
    useSyncExternalStore: um,
    useId: Bm
  };
  Xn.useCacheRefresh = Um, Xn.useMemoCache = yu, Xn.useHostTransitionStatus = Cu, Xn.useFormState = Tm, Xn.useActionState = Tm, Xn.useOptimistic = function(t, e) {
    var a = Zt();
    return pm(a, Ct, t, e);
  };
  var Ni = {
    readContext: re,
    use: ir,
    useCallback: Nm,
    useContext: re,
    useEffect: Au,
    useImperativeHandle: Om,
    useInsertionEffect: Cm,
    useLayoutEffect: Mm,
    useMemo: jm,
    useReducer: xu,
    useRef: wm,
    useState: function() {
      return xu(gn);
    },
    useDebugValue: Eu,
    useDeferredValue: function(t, e) {
      var a = Zt();
      return Ct === null ? wu(a, t, e) : _m(
        a,
        Ct.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = xu(gn)[0], e = Zt().memoizedState;
      return [
        typeof t == "boolean" ? t : js(t),
        e
      ];
    },
    useSyncExternalStore: um,
    useId: Bm
  };
  Ni.useCacheRefresh = Um, Ni.useMemoCache = yu, Ni.useHostTransitionStatus = Cu, Ni.useFormState = Em, Ni.useActionState = Em, Ni.useOptimistic = function(t, e) {
    var a = Zt();
    return Ct !== null ? pm(a, Ct, t, e) : (a.baseState = t, [t, a.queue.dispatch]);
  };
  function Du(t, e, a, l) {
    e = t.memoizedState, a = a(l, e), a = a == null ? e : W({}, e, a), t.memoizedState = a, t.lanes === 0 && (t.updateQueue.baseState = a);
  }
  var Ou = {
    isMounted: function(t) {
      return (t = t._reactInternals) ? Y(t) === t : !1;
    },
    enqueueSetState: function(t, e, a) {
      t = t._reactInternals;
      var l = Me(), o = Qn(l);
      o.payload = e, a != null && (o.callback = a), e = Fn(t, o, l), e !== null && (de(e, t, l), Ls(e, t, l));
    },
    enqueueReplaceState: function(t, e, a) {
      t = t._reactInternals;
      var l = Me(), o = Qn(l);
      o.tag = 1, o.payload = e, a != null && (o.callback = a), e = Fn(t, o, l), e !== null && (de(e, t, l), Ls(e, t, l));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var a = Me(), l = Qn(a);
      l.tag = 2, e != null && (l.callback = e), e = Fn(t, l, a), e !== null && (de(e, t, a), Ls(e, t, a));
    }
  };
  function qm(t, e, a, l, o, c, g) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(l, c, g) : e.prototype && e.prototype.isPureReactComponent ? !xs(a, l) || !xs(o, c) : !0;
  }
  function Gm(t, e, a, l) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(a, l), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(a, l), e.state !== t && Ou.enqueueReplaceState(e, e.state, null);
  }
  function ji(t, e) {
    var a = e;
    if ("ref" in e) {
      a = {};
      for (var l in e)
        l !== "ref" && (a[l] = e[l]);
    }
    if (t = t.defaultProps) {
      a === e && (a = W({}, a));
      for (var o in t)
        a[o] === void 0 && (a[o] = t[o]);
    }
    return a;
  }
  var or = typeof reportError == "function" ? reportError : function(t) {
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
  function Ym(t) {
    or(t);
  }
  function Xm(t) {
    console.error(t);
  }
  function Km(t) {
    or(t);
  }
  function ur(t, e) {
    try {
      var a = t.onUncaughtError;
      a(e.value, { componentStack: e.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function Zm(t, e, a) {
    try {
      var l = t.onCaughtError;
      l(a.value, {
        componentStack: a.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  function Nu(t, e, a) {
    return a = Qn(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      ur(t, e);
    }, a;
  }
  function Qm(t) {
    return t = Qn(t), t.tag = 3, t;
  }
  function Fm(t, e, a, l) {
    var o = a.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = l.value;
      t.payload = function() {
        return o(c);
      }, t.callback = function() {
        Zm(e, a, l);
      };
    }
    var g = a.stateNode;
    g !== null && typeof g.componentDidCatch == "function" && (t.callback = function() {
      Zm(e, a, l), typeof o != "function" && (ei === null ? ei = /* @__PURE__ */ new Set([this]) : ei.add(this));
      var b = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: b !== null ? b : ""
      });
    });
  }
  function Wx(t, e, a, l, o) {
    if (a.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (e = a.alternate, e !== null && Vs(
        e,
        a,
        o,
        !0
      ), a = Le.current, a !== null) {
        switch (a.tag) {
          case 13:
            return tn === null ? dc() : a.alternate === null && Ht === 0 && (Ht = 3), a.flags &= -257, a.flags |= 65536, a.lanes = o, l === ru ? a.flags |= 16384 : (e = a.updateQueue, e === null ? a.updateQueue = /* @__PURE__ */ new Set([l]) : e.add(l), mc(t, l, o)), !1;
          case 22:
            return a.flags |= 65536, l === ru ? a.flags |= 16384 : (e = a.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, a.updateQueue = e) : (a = e.retryQueue, a === null ? e.retryQueue = /* @__PURE__ */ new Set([l]) : a.add(l)), mc(t, l, o)), !1;
        }
        throw Error(r(435, a.tag));
      }
      return mc(t, l, o), dc(), !1;
    }
    if (Et)
      return e = Le.current, e !== null ? (!(e.flags & 65536) && (e.flags |= 256), e.flags |= 65536, e.lanes = o, l !== lu && (t = Error(r(422), { cause: l }), Es(_e(t, a)))) : (l !== lu && (e = Error(r(423), {
        cause: l
      }), Es(
        _e(e, a)
      )), t = t.current.alternate, t.flags |= 65536, o &= -o, t.lanes |= o, l = _e(l, a), o = Nu(
        t.stateNode,
        l,
        o
      ), Ku(t, o), Ht !== 4 && (Ht = 2)), !1;
    var c = Error(r(520), { cause: l });
    if (c = _e(c, a), Ys === null ? Ys = [c] : Ys.push(c), Ht !== 4 && (Ht = 2), e === null) return !0;
    l = _e(l, a), a = e;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, t = o & -o, a.lanes |= t, t = Nu(a.stateNode, l, t), Ku(a, t), !1;
        case 1:
          if (e = a.type, c = a.stateNode, (a.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (ei === null || !ei.has(c))))
            return a.flags |= 65536, o &= -o, a.lanes |= o, o = Qm(o), Fm(
              o,
              t,
              a,
              l
            ), Ku(a, o), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var Wm = Error(r(461)), Jt = !1;
  function ie(t, e, a, l) {
    e.child = t === null ? em(e, null, a, l) : Ci(
      e,
      t.child,
      a,
      l
    );
  }
  function $m(t, e, a, l, o) {
    a = a.render;
    var c = e.ref;
    if ("ref" in l) {
      var g = {};
      for (var b in l)
        b !== "ref" && (g[b] = l[b]);
    } else g = l;
    return zi(e), l = mu(
      t,
      e,
      a,
      g,
      c,
      o
    ), b = pu(), t !== null && !Jt ? (gu(t, e, o), vn(t, e, o)) : (Et && b && au(e), e.flags |= 1, ie(t, e, l, o), e.child);
  }
  function Jm(t, e, a, l, o) {
    if (t === null) {
      var c = a.type;
      return typeof c == "function" && !tc(c) && c.defaultProps === void 0 && a.compare === null ? (e.tag = 15, e.type = c, Im(
        t,
        e,
        c,
        l,
        o
      )) : (t = mr(
        a.type,
        null,
        l,
        e,
        e.mode,
        o
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (c = t.child, !Hu(t, o)) {
      var g = c.memoizedProps;
      if (a = a.compare, a = a !== null ? a : xs, a(g, l) && t.ref === e.ref)
        return vn(t, e, o);
    }
    return e.flags |= 1, t = In(c, l), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Im(t, e, a, l, o) {
    if (t !== null) {
      var c = t.memoizedProps;
      if (xs(c, l) && t.ref === e.ref)
        if (Jt = !1, e.pendingProps = l = c, Hu(t, o))
          t.flags & 131072 && (Jt = !0);
        else
          return e.lanes = t.lanes, vn(t, e, o);
    }
    return ju(
      t,
      e,
      a,
      l,
      o
    );
  }
  function tp(t, e, a) {
    var l = e.pendingProps, o = l.children, c = (e.stateNode._pendingVisibility & 2) !== 0, g = t !== null ? t.memoizedState : null;
    if (zs(t, e), l.mode === "hidden" || c) {
      if (e.flags & 128) {
        if (l = g !== null ? g.baseLanes | a : a, t !== null) {
          for (o = e.child = t.child, c = 0; o !== null; )
            c = c | o.lanes | o.childLanes, o = o.sibling;
          e.childLanes = c & ~l;
        } else e.childLanes = 0, e.child = null;
        return ep(
          t,
          e,
          l,
          a
        );
      }
      if (a & 536870912)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && Il(
          e,
          g !== null ? g.cachePool : null
        ), g !== null ? nm(e, g) : ou(), im(e);
      else
        return e.lanes = e.childLanes = 536870912, ep(
          t,
          e,
          g !== null ? g.baseLanes | a : a,
          a
        );
    } else
      g !== null ? (Il(e, g.cachePool), nm(e, g), Gn(), e.memoizedState = null) : (t !== null && Il(e, null), ou(), Gn());
    return ie(t, e, o, a), e.child;
  }
  function ep(t, e, a, l) {
    var o = du();
    return o = o === null ? null : { parent: Wt._currentValue, pool: o }, e.memoizedState = {
      baseLanes: a,
      cachePool: o
    }, t !== null && Il(e, null), ou(), im(e), t !== null && Vs(t, e, l, !0), null;
  }
  function zs(t, e) {
    var a = e.ref;
    if (a === null)
      t !== null && t.ref !== null && (e.flags |= 2097664);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(r(284));
      (t === null || t.ref !== a) && (e.flags |= 2097664);
    }
  }
  function ju(t, e, a, l, o) {
    return zi(e), a = mu(
      t,
      e,
      a,
      l,
      void 0,
      o
    ), l = pu(), t !== null && !Jt ? (gu(t, e, o), vn(t, e, o)) : (Et && l && au(e), e.flags |= 1, ie(t, e, a, o), e.child);
  }
  function np(t, e, a, l, o, c) {
    return zi(e), e.updateQueue = null, a = om(
      e,
      l,
      a,
      o
    ), rm(t), l = pu(), t !== null && !Jt ? (gu(t, e, c), vn(t, e, c)) : (Et && l && au(e), e.flags |= 1, ie(t, e, a, c), e.child);
  }
  function ip(t, e, a, l, o) {
    if (zi(e), e.stateNode === null) {
      var c = ma, g = a.contextType;
      typeof g == "object" && g !== null && (c = re(g)), c = new a(l, c), e.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, c.updater = Ou, e.stateNode = c, c._reactInternals = e, c = e.stateNode, c.props = l, c.state = e.memoizedState, c.refs = {}, Yu(e), g = a.contextType, c.context = typeof g == "object" && g !== null ? re(g) : ma, c.state = e.memoizedState, g = a.getDerivedStateFromProps, typeof g == "function" && (Du(
        e,
        a,
        g,
        l
      ), c.state = e.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (g = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), g !== c.state && Ou.enqueueReplaceState(c, c.state, null), Us(e, l, c, o), Bs(), c.state = e.memoizedState), typeof c.componentDidMount == "function" && (e.flags |= 4194308), l = !0;
    } else if (t === null) {
      c = e.stateNode;
      var b = e.memoizedProps, w = ji(a, b);
      c.props = w;
      var N = c.context, H = a.contextType;
      g = ma, typeof H == "object" && H !== null && (g = re(H));
      var X = a.getDerivedStateFromProps;
      H = typeof X == "function" || typeof c.getSnapshotBeforeUpdate == "function", b = e.pendingProps !== b, H || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (b || N !== g) && Gm(
        e,
        c,
        l,
        g
      ), Zn = !1;
      var V = e.memoizedState;
      c.state = V, Us(e, l, c, o), Bs(), N = e.memoizedState, b || V !== N || Zn ? (typeof X == "function" && (Du(
        e,
        a,
        X,
        l
      ), N = e.memoizedState), (w = Zn || qm(
        e,
        a,
        w,
        l,
        V,
        N,
        g
      )) ? (H || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = l, e.memoizedState = N), c.props = l, c.state = N, c.context = g, l = w) : (typeof c.componentDidMount == "function" && (e.flags |= 4194308), l = !1);
    } else {
      c = e.stateNode, Xu(t, e), g = e.memoizedProps, H = ji(a, g), c.props = H, X = e.pendingProps, V = c.context, N = a.contextType, w = ma, typeof N == "object" && N !== null && (w = re(N)), b = a.getDerivedStateFromProps, (N = typeof b == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (g !== X || V !== w) && Gm(
        e,
        c,
        l,
        w
      ), Zn = !1, V = e.memoizedState, c.state = V, Us(e, l, c, o), Bs();
      var k = e.memoizedState;
      g !== X || V !== k || Zn || t !== null && t.dependencies !== null && cr(t.dependencies) ? (typeof b == "function" && (Du(
        e,
        a,
        b,
        l
      ), k = e.memoizedState), (H = Zn || qm(
        e,
        a,
        H,
        l,
        V,
        k,
        w
      ) || t !== null && t.dependencies !== null && cr(t.dependencies)) ? (N || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(l, k, w), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(
        l,
        k,
        w
      )), typeof c.componentDidUpdate == "function" && (e.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 1024), e.memoizedProps = l, e.memoizedState = k), c.props = l, c.state = k, c.context = w, l = H) : (typeof c.componentDidUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || g === t.memoizedProps && V === t.memoizedState || (e.flags |= 1024), l = !1);
    }
    return c = l, zs(t, e), l = (e.flags & 128) !== 0, c || l ? (c = e.stateNode, a = l && typeof a.getDerivedStateFromError != "function" ? null : c.render(), e.flags |= 1, t !== null && l ? (e.child = Ci(
      e,
      t.child,
      null,
      o
    ), e.child = Ci(
      e,
      null,
      a,
      o
    )) : ie(t, e, a, o), e.memoizedState = c.state, t = e.child) : t = vn(
      t,
      e,
      o
    ), t;
  }
  function ap(t, e, a, l) {
    return As(), e.flags |= 256, ie(t, e, a, l), e.child;
  }
  var _u = { dehydrated: null, treeContext: null, retryLane: 0 };
  function zu(t) {
    return { baseLanes: t, cachePool: lm() };
  }
  function Vu(t, e, a) {
    return t = t !== null ? t.childLanes & ~a : 0, e && (t |= He), t;
  }
  function sp(t, e, a) {
    var l = e.pendingProps, o = !1, c = (e.flags & 128) !== 0, g;
    if ((g = c) || (g = t !== null && t.memoizedState === null ? !1 : (Ft.current & 2) !== 0), g && (o = !0, e.flags &= -129), g = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (Et) {
        if (o ? qn(e) : Gn(), Et) {
          var b = ne, w;
          if (w = b) {
            t: {
              for (w = b, b = Ie; w.nodeType !== 8; ) {
                if (!b) {
                  b = null;
                  break t;
                }
                if (w = Qe(
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
              treeContext: Ei !== null ? { id: hn, overflow: mn } : null,
              retryLane: 536870912
            }, w = ke(
              18,
              null,
              null,
              0
            ), w.stateNode = b, w.return = e, e.child = w, fe = e, ne = null, w = !0) : w = !1;
          }
          w || Ri(e);
        }
        if (b = e.memoizedState, b !== null && (b = b.dehydrated, b !== null))
          return b.data === "$!" ? e.lanes = 16 : e.lanes = 536870912, null;
        pn(e);
      }
      return b = l.children, l = l.fallback, o ? (Gn(), o = e.mode, b = Bu(
        { mode: "hidden", children: b },
        o
      ), l = Li(
        l,
        o,
        a,
        null
      ), b.return = e, l.return = e, b.sibling = l, e.child = b, o = e.child, o.memoizedState = zu(a), o.childLanes = Vu(
        t,
        g,
        a
      ), e.memoizedState = _u, l) : (qn(e), Lu(e, b));
    }
    if (w = t.memoizedState, w !== null && (b = w.dehydrated, b !== null)) {
      if (c)
        e.flags & 256 ? (qn(e), e.flags &= -257, e = Uu(
          t,
          e,
          a
        )) : e.memoizedState !== null ? (Gn(), e.child = t.child, e.flags |= 128, e = null) : (Gn(), o = l.fallback, b = e.mode, l = Bu(
          { mode: "visible", children: l.children },
          b
        ), o = Li(
          o,
          b,
          a,
          null
        ), o.flags |= 2, l.return = e, o.return = e, l.sibling = o, e.child = l, Ci(
          e,
          t.child,
          null,
          a
        ), l = e.child, l.memoizedState = zu(a), l.childLanes = Vu(
          t,
          g,
          a
        ), e.memoizedState = _u, e = o);
      else if (qn(e), b.data === "$!") {
        if (g = b.nextSibling && b.nextSibling.dataset, g) var N = g.dgst;
        g = N, l = Error(r(419)), l.stack = "", l.digest = g, Es({ value: l, source: null, stack: null }), e = Uu(
          t,
          e,
          a
        );
      } else if (Jt || Vs(t, e, a, !1), g = (a & t.childLanes) !== 0, Jt || g) {
        if (g = Nt, g !== null) {
          if (l = a & -a, l & 42) l = 1;
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
          if (l = l & (g.suspendedLanes | a) ? 0 : l, l !== 0 && l !== w.retryLane)
            throw w.retryLane = l, Pn(t, l), de(g, t, l), Wm;
        }
        b.data === "$?" || dc(), e = Uu(
          t,
          e,
          a
        );
      } else
        b.data === "$?" ? (e.flags |= 128, e.child = t.child, e = fS.bind(
          null,
          t
        ), b._reactRetry = e, e = null) : (t = w.treeContext, ne = Qe(
          b.nextSibling
        ), fe = e, Et = !0, Ke = null, Ie = !1, t !== null && (ze[Ve++] = hn, ze[Ve++] = mn, ze[Ve++] = Ei, hn = t.id, mn = t.overflow, Ei = e), e = Lu(
          e,
          l.children
        ), e.flags |= 4096);
      return e;
    }
    return o ? (Gn(), o = l.fallback, b = e.mode, w = t.child, N = w.sibling, l = In(w, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = w.subtreeFlags & 31457280, N !== null ? o = In(N, o) : (o = Li(
      o,
      b,
      a,
      null
    ), o.flags |= 2), o.return = e, l.return = e, l.sibling = o, e.child = l, l = o, o = e.child, b = t.child.memoizedState, b === null ? b = zu(a) : (w = b.cachePool, w !== null ? (N = Wt._currentValue, w = w.parent !== N ? { parent: N, pool: N } : w) : w = lm(), b = {
      baseLanes: b.baseLanes | a,
      cachePool: w
    }), o.memoizedState = b, o.childLanes = Vu(
      t,
      g,
      a
    ), e.memoizedState = _u, l) : (qn(e), a = t.child, t = a.sibling, a = In(a, {
      mode: "visible",
      children: l.children
    }), a.return = e, a.sibling = null, t !== null && (g = e.deletions, g === null ? (e.deletions = [t], e.flags |= 16) : g.push(t)), e.child = a, e.memoizedState = null, a);
  }
  function Lu(t, e) {
    return e = Bu(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function Bu(t, e) {
    return Np(t, e, 0, null);
  }
  function Uu(t, e, a) {
    return Ci(e, t.child, null, a), t = Lu(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function lp(t, e, a) {
    t.lanes |= e;
    var l = t.alternate;
    l !== null && (l.lanes |= e), qu(t.return, e, a);
  }
  function ku(t, e, a, l, o) {
    var c = t.memoizedState;
    c === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: a,
      tailMode: o
    } : (c.isBackwards = e, c.rendering = null, c.renderingStartTime = 0, c.last = l, c.tail = a, c.tailMode = o);
  }
  function rp(t, e, a) {
    var l = e.pendingProps, o = l.revealOrder, c = l.tail;
    if (ie(t, e, l.children, a), l = Ft.current, l & 2)
      l = l & 1 | 2, e.flags |= 128;
    else {
      if (t !== null && t.flags & 128)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13)
            t.memoizedState !== null && lp(t, a, e);
          else if (t.tag === 19)
            lp(t, a, e);
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
      l &= 1;
    }
    switch (Dt(Ft, l), o) {
      case "forwards":
        for (a = e.child, o = null; a !== null; )
          t = a.alternate, t !== null && Jl(t) === null && (o = a), a = a.sibling;
        a = o, a === null ? (o = e.child, e.child = null) : (o = a.sibling, a.sibling = null), ku(
          e,
          !1,
          o,
          a,
          c
        );
        break;
      case "backwards":
        for (a = null, o = e.child, e.child = null; o !== null; ) {
          if (t = o.alternate, t !== null && Jl(t) === null) {
            e.child = o;
            break;
          }
          t = o.sibling, o.sibling = a, a = o, o = t;
        }
        ku(
          e,
          !0,
          a,
          null,
          c
        );
        break;
      case "together":
        ku(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function vn(t, e, a) {
    if (t !== null && (e.dependencies = t.dependencies), ti |= e.lanes, !(a & e.childLanes))
      if (t !== null) {
        if (Vs(
          t,
          e,
          a,
          !1
        ), (a & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(r(153));
    if (e.child !== null) {
      for (t = e.child, a = In(t, t.pendingProps), e.child = a, a.return = e; t.sibling !== null; )
        t = t.sibling, a = a.sibling = In(t, t.pendingProps), a.return = e;
      a.sibling = null;
    }
    return e.child;
  }
  function Hu(t, e) {
    return t.lanes & e ? !0 : (t = t.dependencies, !!(t !== null && cr(t)));
  }
  function $x(t, e, a) {
    switch (e.tag) {
      case 3:
        ta(e, e.stateNode.containerInfo), Kn(e, Wt, t.memoizedState.cache), As();
        break;
      case 27:
      case 5:
        rs(e);
        break;
      case 4:
        ta(e, e.stateNode.containerInfo);
        break;
      case 10:
        Kn(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 13:
        var l = e.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (qn(e), e.flags |= 128, null) : a & e.child.childLanes ? sp(t, e, a) : (qn(e), t = vn(
            t,
            e,
            a
          ), t !== null ? t.sibling : null);
        qn(e);
        break;
      case 19:
        var o = (t.flags & 128) !== 0;
        if (l = (a & e.childLanes) !== 0, l || (Vs(
          t,
          e,
          a,
          !1
        ), l = (a & e.childLanes) !== 0), o) {
          if (l)
            return rp(
              t,
              e,
              a
            );
          e.flags |= 128;
        }
        if (o = e.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Dt(Ft, Ft.current), l) break;
        return null;
      case 22:
      case 23:
        return e.lanes = 0, tp(t, e, a);
      case 24:
        Kn(e, Wt, t.memoizedState.cache);
    }
    return vn(t, e, a);
  }
  function op(t, e, a) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Jt = !0;
      else {
        if (!Hu(t, a) && !(e.flags & 128))
          return Jt = !1, $x(
            t,
            e,
            a
          );
        Jt = !!(t.flags & 131072);
      }
    else
      Jt = !1, Et && e.flags & 1048576 && Kh(e, Zl, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          t = e.pendingProps;
          var l = e.elementType, o = l._init;
          if (l = o(l._payload), e.type = l, typeof l == "function")
            tc(l) ? (t = ji(l, t), e.tag = 1, e = ip(
              null,
              e,
              l,
              t,
              a
            )) : (e.tag = 0, e = ju(
              null,
              e,
              l,
              t,
              a
            ));
          else {
            if (l != null) {
              if (o = l.$$typeof, o === R) {
                e.tag = 11, e = $m(
                  null,
                  e,
                  l,
                  t,
                  a
                );
                break t;
              } else if (o === O) {
                e.tag = 14, e = Jm(
                  null,
                  e,
                  l,
                  t,
                  a
                );
                break t;
              }
            }
            throw e = F(l) || l, Error(r(306, e, ""));
          }
        }
        return e;
      case 0:
        return ju(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 1:
        return l = e.type, o = ji(
          l,
          e.pendingProps
        ), ip(
          t,
          e,
          l,
          o,
          a
        );
      case 3:
        t: {
          if (ta(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(r(387));
          var c = e.pendingProps;
          o = e.memoizedState, l = o.element, Xu(t, e), Us(e, c, null, a);
          var g = e.memoizedState;
          if (c = g.cache, Kn(e, Wt, c), c !== o.cache && Gu(
            e,
            [Wt],
            a,
            !0
          ), Bs(), c = g.element, o.isDehydrated)
            if (o = {
              element: c,
              isDehydrated: !1,
              cache: g.cache
            }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
              e = ap(
                t,
                e,
                c,
                a
              );
              break t;
            } else if (c !== l) {
              l = _e(
                Error(r(424)),
                e
              ), Es(l), e = ap(
                t,
                e,
                c,
                a
              );
              break t;
            } else
              for (ne = Qe(
                e.stateNode.containerInfo.firstChild
              ), fe = e, Et = !0, Ke = null, Ie = !0, a = em(
                e,
                null,
                c,
                a
              ), e.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
          else {
            if (As(), c === l) {
              e = vn(
                t,
                e,
                a
              );
              break t;
            }
            ie(t, e, c, a);
          }
          e = e.child;
        }
        return e;
      case 26:
        return zs(t, e), t === null ? (a = fg(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = a : Et || (a = e.type, t = e.pendingProps, l = Rr(
          me.current
        ).createElement(a), l[le] = e, l[pe] = t, ae(l, a, t), $t(l), e.stateNode = l) : e.memoizedState = fg(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return rs(e), t === null && Et && (l = e.stateNode = og(
          e.type,
          e.pendingProps,
          me.current
        ), fe = e, Ie = !0, ne = Qe(
          l.firstChild
        )), l = e.pendingProps.children, t !== null || Et ? ie(
          t,
          e,
          l,
          a
        ) : e.child = Ci(
          e,
          null,
          l,
          a
        ), zs(t, e), e.child;
      case 5:
        return t === null && Et && ((o = l = ne) && (l = CS(
          l,
          e.type,
          e.pendingProps,
          Ie
        ), l !== null ? (e.stateNode = l, fe = e, ne = Qe(
          l.firstChild
        ), Ie = !1, o = !0) : o = !1), o || Ri(e)), rs(e), o = e.type, c = e.pendingProps, g = t !== null ? t.memoizedProps : null, l = c.children, Rc(o, c) ? l = null : g !== null && Rc(o, g) && (e.flags |= 32), e.memoizedState !== null && (o = mu(
          t,
          e,
          Yx,
          null,
          null,
          a
        ), Is._currentValue = o), zs(t, e), ie(t, e, l, a), e.child;
      case 6:
        return t === null && Et && ((t = a = ne) && (a = MS(
          a,
          e.pendingProps,
          Ie
        ), a !== null ? (e.stateNode = a, fe = e, ne = null, t = !0) : t = !1), t || Ri(e)), null;
      case 13:
        return sp(t, e, a);
      case 4:
        return ta(
          e,
          e.stateNode.containerInfo
        ), l = e.pendingProps, t === null ? e.child = Ci(
          e,
          null,
          l,
          a
        ) : ie(
          t,
          e,
          l,
          a
        ), e.child;
      case 11:
        return $m(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 7:
        return ie(
          t,
          e,
          e.pendingProps,
          a
        ), e.child;
      case 8:
        return ie(
          t,
          e,
          e.pendingProps.children,
          a
        ), e.child;
      case 12:
        return ie(
          t,
          e,
          e.pendingProps.children,
          a
        ), e.child;
      case 10:
        return l = e.pendingProps, Kn(e, e.type, l.value), ie(
          t,
          e,
          l.children,
          a
        ), e.child;
      case 9:
        return o = e.type._context, l = e.pendingProps.children, zi(e), o = re(o), l = l(o), e.flags |= 1, ie(t, e, l, a), e.child;
      case 14:
        return Jm(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 15:
        return Im(
          t,
          e,
          e.type,
          e.pendingProps,
          a
        );
      case 19:
        return rp(t, e, a);
      case 22:
        return tp(t, e, a);
      case 24:
        return zi(e), l = re(Wt), t === null ? (o = du(), o === null && (o = Nt, c = cu(), o.pooledCache = c, c.refCount++, c !== null && (o.pooledCacheLanes |= a), o = c), e.memoizedState = {
          parent: l,
          cache: o
        }, Yu(e), Kn(e, Wt, o)) : (t.lanes & a && (Xu(t, e), Us(e, null, null, a), Bs()), o = t.memoizedState, c = e.memoizedState, o.parent !== l ? (o = { parent: l, cache: l }, e.memoizedState = o, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = o), Kn(e, Wt, l)) : (l = c.cache, Kn(e, Wt, l), l !== o.cache && Gu(
          e,
          [Wt],
          a,
          !0
        ))), ie(
          t,
          e,
          e.pendingProps.children,
          a
        ), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(r(156, e.tag));
  }
  var Pu = At(null), _i = null, yn = null;
  function Kn(t, e, a) {
    Dt(Pu, e._currentValue), e._currentValue = a;
  }
  function bn(t) {
    t._currentValue = Pu.current, Vt(Pu);
  }
  function qu(t, e, a) {
    for (; t !== null; ) {
      var l = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, l !== null && (l.childLanes |= e)) : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e), t === a) break;
      t = t.return;
    }
  }
  function Gu(t, e, a, l) {
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
              c.lanes |= a, b = c.alternate, b !== null && (b.lanes |= a), qu(
                c.return,
                a,
                t
              ), l || (g = null);
              break t;
            }
          c = b.next;
        }
      } else if (o.tag === 18) {
        if (g = o.return, g === null) throw Error(r(341));
        g.lanes |= a, c = g.alternate, c !== null && (c.lanes |= a), qu(g, a, t), g = null;
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
  function Vs(t, e, a, l) {
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
          Ee(o.pendingProps.value, g.value) || (t !== null ? t.push(b) : t = [b]);
        }
      } else if (o === vi.current) {
        if (g = o.alternate, g === null) throw Error(r(387));
        g.memoizedState.memoizedState !== o.memoizedState.memoizedState && (t !== null ? t.push(Is) : t = [Is]);
      }
      o = o.return;
    }
    t !== null && Gu(
      e,
      t,
      a,
      l
    ), e.flags |= 262144;
  }
  function cr(t) {
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
  function zi(t) {
    _i = t, yn = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function re(t) {
    return up(_i, t);
  }
  function fr(t, e) {
    return _i === null && zi(t), up(t, e);
  }
  function up(t, e) {
    var a = e._currentValue;
    if (e = { context: e, memoizedValue: a, next: null }, yn === null) {
      if (t === null) throw Error(r(308));
      yn = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else yn = yn.next = e;
    return a;
  }
  var Zn = !1;
  function Yu(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Xu(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function Qn(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Fn(t, e, a) {
    var l = t.updateQueue;
    if (l === null) return null;
    if (l = l.shared, Bt & 2) {
      var o = l.pending;
      return o === null ? e.next = e : (e.next = o.next, o.next = e), l.pending = e, e = Xl(t), Yh(t, null, a), e;
    }
    return Yl(t, l, e, a), Xl(t);
  }
  function Ls(t, e, a) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (a & 4194176) !== 0)) {
      var l = e.lanes;
      l &= t.pendingLanes, a |= l, e.lanes = a, Jd(t, a);
    }
  }
  function Ku(t, e) {
    var a = t.updateQueue, l = t.alternate;
    if (l !== null && (l = l.updateQueue, a === l)) {
      var o = null, c = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var g = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          c === null ? o = c = g : c = c.next = g, a = a.next;
        } while (a !== null);
        c === null ? o = c = e : c = c.next = e;
      } else o = c = e;
      a = {
        baseState: l.baseState,
        firstBaseUpdate: o,
        lastBaseUpdate: c,
        shared: l.shared,
        callbacks: l.callbacks
      }, t.updateQueue = a;
      return;
    }
    t = a.lastBaseUpdate, t === null ? a.firstBaseUpdate = e : t.next = e, a.lastBaseUpdate = e;
  }
  var Zu = !1;
  function Bs() {
    if (Zu) {
      var t = xa;
      if (t !== null) throw t;
    }
  }
  function Us(t, e, a, l) {
    Zu = !1;
    var o = t.updateQueue;
    Zn = !1;
    var c = o.firstBaseUpdate, g = o.lastBaseUpdate, b = o.shared.pending;
    if (b !== null) {
      o.shared.pending = null;
      var w = b, N = w.next;
      w.next = null, g === null ? c = N : g.next = N, g = w;
      var H = t.alternate;
      H !== null && (H = H.updateQueue, b = H.lastBaseUpdate, b !== g && (b === null ? H.firstBaseUpdate = N : b.next = N, H.lastBaseUpdate = w));
    }
    if (c !== null) {
      var X = o.baseState;
      g = 0, H = N = w = null, b = c;
      do {
        var V = b.lane & -536870913, k = V !== b.lane;
        if (k ? (Tt & V) === V : (l & V) === V) {
          V !== 0 && V === ba && (Zu = !0), H !== null && (H = H.next = {
            lane: 0,
            tag: b.tag,
            payload: b.payload,
            callback: null,
            next: null
          });
          t: {
            var it = t, ct = b;
            V = e;
            var Pt = a;
            switch (ct.tag) {
              case 1:
                if (it = ct.payload, typeof it == "function") {
                  X = it.call(Pt, X, V);
                  break t;
                }
                X = it;
                break t;
              case 3:
                it.flags = it.flags & -65537 | 128;
              case 0:
                if (it = ct.payload, V = typeof it == "function" ? it.call(Pt, X, V) : it, V == null) break t;
                X = W({}, X, V);
                break t;
              case 2:
                Zn = !0;
            }
          }
          V = b.callback, V !== null && (t.flags |= 64, k && (t.flags |= 8192), k = o.callbacks, k === null ? o.callbacks = [V] : k.push(V));
        } else
          k = {
            lane: V,
            tag: b.tag,
            payload: b.payload,
            callback: b.callback,
            next: null
          }, H === null ? (N = H = k, w = X) : H = H.next = k, g |= V;
        if (b = b.next, b === null) {
          if (b = o.shared.pending, b === null)
            break;
          k = b, b = k.next, k.next = null, o.lastBaseUpdate = k, o.shared.pending = null;
        }
      } while (!0);
      H === null && (w = X), o.baseState = w, o.firstBaseUpdate = N, o.lastBaseUpdate = H, c === null && (o.shared.lanes = 0), ti |= g, t.lanes = g, t.memoizedState = X;
    }
  }
  function cp(t, e) {
    if (typeof t != "function")
      throw Error(r(191, t));
    t.call(e);
  }
  function fp(t, e) {
    var a = t.callbacks;
    if (a !== null)
      for (t.callbacks = null, t = 0; t < a.length; t++)
        cp(a[t], e);
  }
  function ks(t, e) {
    try {
      var a = e.updateQueue, l = a !== null ? a.lastEffect : null;
      if (l !== null) {
        var o = l.next;
        a = o;
        do {
          if ((a.tag & t) === t) {
            l = void 0;
            var c = a.create, g = a.inst;
            l = c(), g.destroy = l;
          }
          a = a.next;
        } while (a !== o);
      }
    } catch (b) {
      Ot(e, e.return, b);
    }
  }
  function Wn(t, e, a) {
    try {
      var l = e.updateQueue, o = l !== null ? l.lastEffect : null;
      if (o !== null) {
        var c = o.next;
        l = c;
        do {
          if ((l.tag & t) === t) {
            var g = l.inst, b = g.destroy;
            if (b !== void 0) {
              g.destroy = void 0, o = e;
              var w = a;
              try {
                b();
              } catch (N) {
                Ot(
                  o,
                  w,
                  N
                );
              }
            }
          }
          l = l.next;
        } while (l !== c);
      }
    } catch (N) {
      Ot(e, e.return, N);
    }
  }
  function dp(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var a = t.stateNode;
      try {
        fp(e, a);
      } catch (l) {
        Ot(t, t.return, l);
      }
    }
  }
  function hp(t, e, a) {
    a.props = ji(
      t.type,
      t.memoizedProps
    ), a.state = t.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (l) {
      Ot(t, e, l);
    }
  }
  function Vi(t, e) {
    try {
      var a = t.ref;
      if (a !== null) {
        var l = t.stateNode;
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var o = l;
            break;
          default:
            o = l;
        }
        typeof a == "function" ? t.refCleanup = a(o) : a.current = o;
      }
    } catch (c) {
      Ot(t, e, c);
    }
  }
  function we(t, e) {
    var a = t.ref, l = t.refCleanup;
    if (a !== null)
      if (typeof l == "function")
        try {
          l();
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
  function mp(t) {
    var e = t.type, a = t.memoizedProps, l = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && l.focus();
          break t;
        case "img":
          a.src ? l.src = a.src : a.srcSet && (l.srcset = a.srcSet);
      }
    } catch (o) {
      Ot(t, t.return, o);
    }
  }
  function pp(t, e, a) {
    try {
      var l = t.stateNode;
      TS(l, t.type, a, e), l[pe] = e;
    } catch (o) {
      Ot(t, t.return, o);
    }
  }
  function gp(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 || t.tag === 4;
  }
  function Qu(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || gp(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 27 && t.tag !== 18; ) {
        if (t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Fu(t, e, a) {
    var l = t.tag;
    if (l === 5 || l === 6)
      t = t.stateNode, e ? a.nodeType === 8 ? a.parentNode.insertBefore(t, e) : a.insertBefore(t, e) : (a.nodeType === 8 ? (e = a.parentNode, e.insertBefore(t, a)) : (e = a, e.appendChild(t)), a = a._reactRootContainer, a != null || e.onclick !== null || (e.onclick = wr));
    else if (l !== 4 && l !== 27 && (t = t.child, t !== null))
      for (Fu(t, e, a), t = t.sibling; t !== null; )
        Fu(t, e, a), t = t.sibling;
  }
  function dr(t, e, a) {
    var l = t.tag;
    if (l === 5 || l === 6)
      t = t.stateNode, e ? a.insertBefore(t, e) : a.appendChild(t);
    else if (l !== 4 && l !== 27 && (t = t.child, t !== null))
      for (dr(t, e, a), t = t.sibling; t !== null; )
        dr(t, e, a), t = t.sibling;
  }
  var xn = !1, kt = !1, Wu = !1, vp = typeof WeakSet == "function" ? WeakSet : Set, It = null, yp = !1;
  function Jx(t, e) {
    if (t = t.containerInfo, Ec = jr, t = Vh(t), Jo(t)) {
      if ("selectionStart" in t)
        var a = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          a = (a = t.ownerDocument) && a.defaultView || window;
          var l = a.getSelection && a.getSelection();
          if (l && l.rangeCount !== 0) {
            a = l.anchorNode;
            var o = l.anchorOffset, c = l.focusNode;
            l = l.focusOffset;
            try {
              a.nodeType, c.nodeType;
            } catch {
              a = null;
              break t;
            }
            var g = 0, b = -1, w = -1, N = 0, H = 0, X = t, V = null;
            e: for (; ; ) {
              for (var k; X !== a || o !== 0 && X.nodeType !== 3 || (b = g + o), X !== c || l !== 0 && X.nodeType !== 3 || (w = g + l), X.nodeType === 3 && (g += X.nodeValue.length), (k = X.firstChild) !== null; )
                V = X, X = k;
              for (; ; ) {
                if (X === t) break e;
                if (V === a && ++N === o && (b = g), V === c && ++H === l && (w = g), (k = X.nextSibling) !== null) break;
                X = V, V = X.parentNode;
              }
              X = k;
            }
            a = b === -1 || w === -1 ? null : { start: b, end: w };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (wc = { focusedElem: t, selectionRange: a }, jr = !1, It = e; It !== null; )
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
                t = void 0, a = e, o = c.memoizedProps, c = c.memoizedState, l = a.stateNode;
                try {
                  var it = ji(
                    a.type,
                    o,
                    a.elementType === a.type
                  );
                  t = l.getSnapshotBeforeUpdate(
                    it,
                    c
                  ), l.__reactInternalSnapshotBeforeUpdate = t;
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
                  Dc(t);
                else if (a === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Dc(t);
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
            t.return = e.return, It = t;
            break;
          }
          It = e.return;
        }
    return it = yp, yp = !1, it;
  }
  function bp(t, e, a) {
    var l = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        Tn(t, a), l & 4 && ks(5, a);
        break;
      case 1:
        if (Tn(t, a), l & 4)
          if (t = a.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (b) {
              Ot(a, a.return, b);
            }
          else {
            var o = ji(
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
            } catch (b) {
              Ot(
                a,
                a.return,
                b
              );
            }
          }
        l & 64 && dp(a), l & 512 && Vi(a, a.return);
        break;
      case 3:
        if (Tn(t, a), l & 64 && (l = a.updateQueue, l !== null)) {
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
            fp(l, t);
          } catch (b) {
            Ot(a, a.return, b);
          }
        }
        break;
      case 26:
        Tn(t, a), l & 512 && Vi(a, a.return);
        break;
      case 27:
      case 5:
        Tn(t, a), e === null && l & 4 && mp(a), l & 512 && Vi(a, a.return);
        break;
      case 12:
        Tn(t, a);
        break;
      case 13:
        Tn(t, a), l & 4 && Tp(t, a);
        break;
      case 22:
        if (o = a.memoizedState !== null || xn, !o) {
          e = e !== null && e.memoizedState !== null || kt;
          var c = xn, g = kt;
          xn = o, (kt = e) && !g ? $n(
            t,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : Tn(t, a), xn = c, kt = g;
        }
        l & 512 && (a.memoizedProps.mode === "manual" ? Vi(a, a.return) : we(a, a.return));
        break;
      default:
        Tn(t, a);
    }
  }
  function xp(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, xp(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Lo(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Qt = null, Re = !1;
  function Sn(t, e, a) {
    for (a = a.child; a !== null; )
      Sp(t, e, a), a = a.sibling;
  }
  function Sp(t, e, a) {
    if (Te && typeof Te.onCommitFiberUnmount == "function")
      try {
        Te.onCommitFiberUnmount(os, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        kt || we(a, e), Sn(
          t,
          e,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        kt || we(a, e);
        var l = Qt, o = Re;
        for (Qt = a.stateNode, Sn(
          t,
          e,
          a
        ), a = a.stateNode, e = a.attributes; e.length; )
          a.removeAttributeNode(e[0]);
        Lo(a), Qt = l, Re = o;
        break;
      case 5:
        kt || we(a, e);
      case 6:
        o = Qt;
        var c = Re;
        if (Qt = null, Sn(
          t,
          e,
          a
        ), Qt = o, Re = c, Qt !== null)
          if (Re)
            try {
              t = Qt, l = a.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(l) : t.removeChild(l);
            } catch (g) {
              Ot(
                a,
                e,
                g
              );
            }
          else
            try {
              Qt.removeChild(a.stateNode);
            } catch (g) {
              Ot(
                a,
                e,
                g
              );
            }
        break;
      case 18:
        Qt !== null && (Re ? (e = Qt, a = a.stateNode, e.nodeType === 8 ? Mc(
          e.parentNode,
          a
        ) : e.nodeType === 1 && Mc(e, a), il(e)) : Mc(Qt, a.stateNode));
        break;
      case 4:
        l = Qt, o = Re, Qt = a.stateNode.containerInfo, Re = !0, Sn(
          t,
          e,
          a
        ), Qt = l, Re = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        kt || Wn(2, a, e), kt || Wn(4, a, e), Sn(
          t,
          e,
          a
        );
        break;
      case 1:
        kt || (we(a, e), l = a.stateNode, typeof l.componentWillUnmount == "function" && hp(
          a,
          e,
          l
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
        kt || we(a, e), kt = (l = kt) || a.memoizedState !== null, Sn(
          t,
          e,
          a
        ), kt = l;
        break;
      default:
        Sn(
          t,
          e,
          a
        );
    }
  }
  function Tp(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        il(t);
      } catch (a) {
        Ot(e, e.return, a);
      }
  }
  function Ix(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new vp()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new vp()), e;
      default:
        throw Error(r(435, t.tag));
    }
  }
  function $u(t, e) {
    var a = Ix(t);
    e.forEach(function(l) {
      var o = dS.bind(null, t, l);
      a.has(l) || (a.add(l), l.then(o, o));
    });
  }
  function Be(t, e) {
    var a = e.deletions;
    if (a !== null)
      for (var l = 0; l < a.length; l++) {
        var o = a[l], c = t, g = e, b = g;
        t: for (; b !== null; ) {
          switch (b.tag) {
            case 27:
            case 5:
              Qt = b.stateNode, Re = !1;
              break t;
            case 3:
              Qt = b.stateNode.containerInfo, Re = !0;
              break t;
            case 4:
              Qt = b.stateNode.containerInfo, Re = !0;
              break t;
          }
          b = b.return;
        }
        if (Qt === null) throw Error(r(160));
        Sp(c, g, o), Qt = null, Re = !1, c = o.alternate, c !== null && (c.return = null), o.return = null;
      }
    if (e.subtreeFlags & 13878)
      for (e = e.child; e !== null; )
        Ap(e, t), e = e.sibling;
  }
  var Ze = null;
  function Ap(t, e) {
    var a = t.alternate, l = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Be(e, t), Ue(t), l & 4 && (Wn(3, t, t.return), ks(3, t), Wn(5, t, t.return));
        break;
      case 1:
        Be(e, t), Ue(t), l & 512 && (kt || a === null || we(a, a.return)), l & 64 && xn && (t = t.updateQueue, t !== null && (l = t.callbacks, l !== null && (a = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = a === null ? l : a.concat(l))));
        break;
      case 26:
        var o = Ze;
        if (Be(e, t), Ue(t), l & 512 && (kt || a === null || we(a, a.return)), l & 4) {
          var c = a !== null ? a.memoizedState : null;
          if (l = t.memoizedState, a === null)
            if (l === null)
              if (t.stateNode === null) {
                t: {
                  l = t.type, a = t.memoizedProps, o = o.ownerDocument || o;
                  e: switch (l) {
                    case "title":
                      c = o.getElementsByTagName("title")[0], (!c || c[fs] || c[le] || c.namespaceURI === "http://www.w3.org/2000/svg" || c.hasAttribute("itemprop")) && (c = o.createElement(l), o.head.insertBefore(
                        c,
                        o.querySelector("head > title")
                      )), ae(c, l, a), c[le] = t, $t(c), l = c;
                      break t;
                    case "link":
                      var g = mg(
                        "link",
                        "href",
                        o
                      ).get(l + (a.href || ""));
                      if (g) {
                        for (var b = 0; b < g.length; b++)
                          if (c = g[b], c.getAttribute("href") === (a.href == null ? null : a.href) && c.getAttribute("rel") === (a.rel == null ? null : a.rel) && c.getAttribute("title") === (a.title == null ? null : a.title) && c.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            g.splice(b, 1);
                            break e;
                          }
                      }
                      c = o.createElement(l), ae(c, l, a), o.head.appendChild(c);
                      break;
                    case "meta":
                      if (g = mg(
                        "meta",
                        "content",
                        o
                      ).get(l + (a.content || ""))) {
                        for (b = 0; b < g.length; b++)
                          if (c = g[b], c.getAttribute("content") === (a.content == null ? null : "" + a.content) && c.getAttribute("name") === (a.name == null ? null : a.name) && c.getAttribute("property") === (a.property == null ? null : a.property) && c.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && c.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            g.splice(b, 1);
                            break e;
                          }
                      }
                      c = o.createElement(l), ae(c, l, a), o.head.appendChild(c);
                      break;
                    default:
                      throw Error(r(468, l));
                  }
                  c[le] = t, $t(c), l = c;
                }
                t.stateNode = l;
              } else
                pg(
                  o,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = hg(
                o,
                l,
                t.memoizedProps
              );
          else
            c !== l ? (c === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : c.count--, l === null ? pg(
              o,
              t.type,
              t.stateNode
            ) : hg(
              o,
              l,
              t.memoizedProps
            )) : l === null && t.stateNode !== null && pp(
              t,
              t.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        if (l & 4 && t.alternate === null) {
          o = t.stateNode, c = t.memoizedProps;
          try {
            for (var w = o.firstChild; w; ) {
              var N = w.nextSibling, H = w.nodeName;
              w[fs] || H === "HEAD" || H === "BODY" || H === "SCRIPT" || H === "STYLE" || H === "LINK" && w.rel.toLowerCase() === "stylesheet" || o.removeChild(w), w = N;
            }
            for (var X = t.type, V = o.attributes; V.length; )
              o.removeAttributeNode(V[0]);
            ae(o, X, c), o[le] = t, o[pe] = c;
          } catch (it) {
            Ot(t, t.return, it);
          }
        }
      case 5:
        if (Be(e, t), Ue(t), l & 512 && (kt || a === null || we(a, a.return)), t.flags & 32) {
          o = t.stateNode;
          try {
            ra(o, "");
          } catch (it) {
            Ot(t, t.return, it);
          }
        }
        l & 4 && t.stateNode != null && (o = t.memoizedProps, pp(
          t,
          o,
          a !== null ? a.memoizedProps : o
        )), l & 1024 && (Wu = !0);
        break;
      case 6:
        if (Be(e, t), Ue(t), l & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          l = t.memoizedProps, a = t.stateNode;
          try {
            a.nodeValue = l;
          } catch (it) {
            Ot(t, t.return, it);
          }
        }
        break;
      case 3:
        if (Dr = null, o = Ze, Ze = Cr(e.containerInfo), Be(e, t), Ze = o, Ue(t), l & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            il(e.containerInfo);
          } catch (it) {
            Ot(t, t.return, it);
          }
        Wu && (Wu = !1, Ep(t));
        break;
      case 4:
        l = Ze, Ze = Cr(
          t.stateNode.containerInfo
        ), Be(e, t), Ue(t), Ze = l;
        break;
      case 12:
        Be(e, t), Ue(t);
        break;
      case 13:
        Be(e, t), Ue(t), t.child.flags & 8192 && t.memoizedState !== null != (a !== null && a.memoizedState !== null) && (lc = Je()), l & 4 && (l = t.updateQueue, l !== null && (t.updateQueue = null, $u(t, l)));
        break;
      case 22:
        if (l & 512 && (kt || a === null || we(a, a.return)), w = t.memoizedState !== null, N = a !== null && a.memoizedState !== null, H = xn, X = kt, xn = H || w, kt = X || N, Be(e, t), kt = X, xn = H, Ue(t), e = t.stateNode, e._current = t, e._visibility &= -3, e._visibility |= e._pendingVisibility & 2, l & 8192 && (e._visibility = w ? e._visibility & -2 : e._visibility | 1, w && (e = xn || kt, a === null || N || e || Ea(t)), t.memoizedProps === null || t.memoizedProps.mode !== "manual"))
          t: for (a = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26 || e.tag === 27) {
              if (a === null) {
                N = a = e;
                try {
                  if (o = N.stateNode, w)
                    c = o.style, typeof c.setProperty == "function" ? c.setProperty(
                      "display",
                      "none",
                      "important"
                    ) : c.display = "none";
                  else {
                    g = N.stateNode, b = N.memoizedProps.style;
                    var k = b != null && b.hasOwnProperty("display") ? b.display : null;
                    g.style.display = k == null || typeof k == "boolean" ? "" : ("" + k).trim();
                  }
                } catch (it) {
                  Ot(N, N.return, it);
                }
              }
            } else if (e.tag === 6) {
              if (a === null) {
                N = e;
                try {
                  N.stateNode.nodeValue = w ? "" : N.memoizedProps;
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
        l & 4 && (l = t.updateQueue, l !== null && (a = l.retryQueue, a !== null && (l.retryQueue = null, $u(t, a))));
        break;
      case 19:
        Be(e, t), Ue(t), l & 4 && (l = t.updateQueue, l !== null && (t.updateQueue = null, $u(t, l)));
        break;
      case 21:
        break;
      default:
        Be(e, t), Ue(t);
    }
  }
  function Ue(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        if (t.tag !== 27) {
          t: {
            for (var a = t.return; a !== null; ) {
              if (gp(a)) {
                var l = a;
                break t;
              }
              a = a.return;
            }
            throw Error(r(160));
          }
          switch (l.tag) {
            case 27:
              var o = l.stateNode, c = Qu(t);
              dr(t, c, o);
              break;
            case 5:
              var g = l.stateNode;
              l.flags & 32 && (ra(g, ""), l.flags &= -33);
              var b = Qu(t);
              dr(t, b, g);
              break;
            case 3:
            case 4:
              var w = l.stateNode.containerInfo, N = Qu(t);
              Fu(
                t,
                N,
                w
              );
              break;
            default:
              throw Error(r(161));
          }
        }
      } catch (H) {
        Ot(t, t.return, H);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Ep(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Ep(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function Tn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        bp(t, e.alternate, e), e = e.sibling;
  }
  function Ea(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Wn(4, e, e.return), Ea(e);
          break;
        case 1:
          we(e, e.return);
          var a = e.stateNode;
          typeof a.componentWillUnmount == "function" && hp(
            e,
            e.return,
            a
          ), Ea(e);
          break;
        case 26:
        case 27:
        case 5:
          we(e, e.return), Ea(e);
          break;
        case 22:
          we(e, e.return), e.memoizedState === null && Ea(e);
          break;
        default:
          Ea(e);
      }
      t = t.sibling;
    }
  }
  function $n(t, e, a) {
    for (a = a && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var l = e.alternate, o = t, c = e, g = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          $n(
            o,
            c,
            a
          ), ks(4, c);
          break;
        case 1:
          if ($n(
            o,
            c,
            a
          ), l = c, o = l.stateNode, typeof o.componentDidMount == "function")
            try {
              o.componentDidMount();
            } catch (N) {
              Ot(l, l.return, N);
            }
          if (l = c, o = l.updateQueue, o !== null) {
            var b = l.stateNode;
            try {
              var w = o.shared.hiddenCallbacks;
              if (w !== null)
                for (o.shared.hiddenCallbacks = null, o = 0; o < w.length; o++)
                  cp(w[o], b);
            } catch (N) {
              Ot(l, l.return, N);
            }
          }
          a && g & 64 && dp(c), Vi(c, c.return);
          break;
        case 26:
        case 27:
        case 5:
          $n(
            o,
            c,
            a
          ), a && l === null && g & 4 && mp(c), Vi(c, c.return);
          break;
        case 12:
          $n(
            o,
            c,
            a
          );
          break;
        case 13:
          $n(
            o,
            c,
            a
          ), a && g & 4 && Tp(o, c);
          break;
        case 22:
          c.memoizedState === null && $n(
            o,
            c,
            a
          ), Vi(c, c.return);
          break;
        default:
          $n(
            o,
            c,
            a
          );
      }
      e = e.sibling;
    }
  }
  function Ju(t, e) {
    var a = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== a && (t != null && t.refCount++, a != null && Ds(a));
  }
  function Iu(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Ds(t));
  }
  function Jn(t, e, a, l) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        wp(
          t,
          e,
          a,
          l
        ), e = e.sibling;
  }
  function wp(t, e, a, l) {
    var o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Jn(
          t,
          e,
          a,
          l
        ), o & 2048 && ks(9, e);
        break;
      case 3:
        Jn(
          t,
          e,
          a,
          l
        ), o & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Ds(t)));
        break;
      case 12:
        if (o & 2048) {
          Jn(
            t,
            e,
            a,
            l
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
            Ot(e, e.return, w);
          }
        } else
          Jn(
            t,
            e,
            a,
            l
          );
        break;
      case 23:
        break;
      case 22:
        c = e.stateNode, e.memoizedState !== null ? c._visibility & 4 ? Jn(
          t,
          e,
          a,
          l
        ) : Hs(t, e) : c._visibility & 4 ? Jn(
          t,
          e,
          a,
          l
        ) : (c._visibility |= 4, wa(
          t,
          e,
          a,
          l,
          (e.subtreeFlags & 10256) !== 0
        )), o & 2048 && Ju(
          e.alternate,
          e
        );
        break;
      case 24:
        Jn(
          t,
          e,
          a,
          l
        ), o & 2048 && Iu(e.alternate, e);
        break;
      default:
        Jn(
          t,
          e,
          a,
          l
        );
    }
  }
  function wa(t, e, a, l, o) {
    for (o = o && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
      var c = t, g = e, b = a, w = l, N = g.flags;
      switch (g.tag) {
        case 0:
        case 11:
        case 15:
          wa(
            c,
            g,
            b,
            w,
            o
          ), ks(8, g);
          break;
        case 23:
          break;
        case 22:
          var H = g.stateNode;
          g.memoizedState !== null ? H._visibility & 4 ? wa(
            c,
            g,
            b,
            w,
            o
          ) : Hs(
            c,
            g
          ) : (H._visibility |= 4, wa(
            c,
            g,
            b,
            w,
            o
          )), o && N & 2048 && Ju(
            g.alternate,
            g
          );
          break;
        case 24:
          wa(
            c,
            g,
            b,
            w,
            o
          ), o && N & 2048 && Iu(g.alternate, g);
          break;
        default:
          wa(
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
  function Hs(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var a = t, l = e, o = l.flags;
        switch (l.tag) {
          case 22:
            Hs(a, l), o & 2048 && Ju(
              l.alternate,
              l
            );
            break;
          case 24:
            Hs(a, l), o & 2048 && Iu(l.alternate, l);
            break;
          default:
            Hs(a, l);
        }
        e = e.sibling;
      }
  }
  var Ps = 8192;
  function Ra(t) {
    if (t.subtreeFlags & Ps)
      for (t = t.child; t !== null; )
        Rp(t), t = t.sibling;
  }
  function Rp(t) {
    switch (t.tag) {
      case 26:
        Ra(t), t.flags & Ps && t.memoizedState !== null && PS(
          Ze,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        Ra(t);
        break;
      case 3:
      case 4:
        var e = Ze;
        Ze = Cr(t.stateNode.containerInfo), Ra(t), Ze = e;
        break;
      case 22:
        t.memoizedState === null && (e = t.alternate, e !== null && e.memoizedState !== null ? (e = Ps, Ps = 16777216, Ra(t), Ps = e) : Ra(t));
        break;
      default:
        Ra(t);
    }
  }
  function Cp(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function qs(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null)
        for (var a = 0; a < e.length; a++) {
          var l = e[a];
          It = l, Dp(
            l,
            t
          );
        }
      Cp(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Mp(t), t = t.sibling;
  }
  function Mp(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        qs(t), t.flags & 2048 && Wn(9, t, t.return);
        break;
      case 3:
        qs(t);
        break;
      case 12:
        qs(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 4 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -5, hr(t)) : qs(t);
        break;
      default:
        qs(t);
    }
  }
  function hr(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null)
        for (var a = 0; a < e.length; a++) {
          var l = e[a];
          It = l, Dp(
            l,
            t
          );
        }
      Cp(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          Wn(8, e, e.return), hr(e);
          break;
        case 22:
          a = e.stateNode, a._visibility & 4 && (a._visibility &= -5, hr(e));
          break;
        default:
          hr(e);
      }
      t = t.sibling;
    }
  }
  function Dp(t, e) {
    for (; It !== null; ) {
      var a = It;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Wn(8, a, e);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var l = a.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Ds(a.memoizedState.cache);
      }
      if (l = a.child, l !== null) l.return = a, It = l;
      else
        t: for (a = t; It !== null; ) {
          l = It;
          var o = l.sibling, c = l.return;
          if (xp(l), l === a) {
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
  function tS(t, e, a, l) {
    this.tag = t, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ke(t, e, a, l) {
    return new tS(t, e, a, l);
  }
  function tc(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function In(t, e) {
    var a = t.alternate;
    return a === null ? (a = ke(
      t.tag,
      e,
      t.key,
      t.mode
    ), a.elementType = t.elementType, a.type = t.type, a.stateNode = t.stateNode, a.alternate = t, t.alternate = a) : (a.pendingProps = e, a.type = t.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = t.flags & 31457280, a.childLanes = t.childLanes, a.lanes = t.lanes, a.child = t.child, a.memoizedProps = t.memoizedProps, a.memoizedState = t.memoizedState, a.updateQueue = t.updateQueue, e = t.dependencies, a.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, a.sibling = t.sibling, a.index = t.index, a.ref = t.ref, a.refCleanup = t.refCleanup, a;
  }
  function Op(t, e) {
    t.flags &= 31457282;
    var a = t.alternate;
    return a === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = a.childLanes, t.lanes = a.lanes, t.child = a.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = a.memoizedProps, t.memoizedState = a.memoizedState, t.updateQueue = a.updateQueue, t.type = a.type, e = a.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function mr(t, e, a, l, o, c) {
    var g = 0;
    if (l = t, typeof t == "function") tc(t) && (g = 1);
    else if (typeof t == "string")
      g = kS(
        t,
        a,
        Se.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case m:
          return Li(a.children, o, c, e);
        case p:
          g = 8, o |= 24;
          break;
        case v:
          return t = ke(12, a, e, o | 2), t.elementType = v, t.lanes = c, t;
        case A:
          return t = ke(13, a, e, o), t.elementType = A, t.lanes = c, t;
        case D:
          return t = ke(19, a, e, o), t.elementType = D, t.lanes = c, t;
        case U:
          return Np(a, o, c, e);
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case y:
              case S:
                g = 10;
                break t;
              case x:
                g = 9;
                break t;
              case R:
                g = 11;
                break t;
              case O:
                g = 14;
                break t;
              case z:
                g = 16, l = null;
                break t;
            }
          g = 29, a = Error(
            r(130, t === null ? "null" : typeof t, "")
          ), l = null;
      }
    return e = ke(g, a, e, o), e.elementType = t, e.type = l, e.lanes = c, e;
  }
  function Li(t, e, a, l) {
    return t = ke(7, t, l, e), t.lanes = a, t;
  }
  function Np(t, e, a, l) {
    t = ke(22, t, l, e), t.elementType = U, t.lanes = a;
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
          var g = Pn(c, 2);
          g !== null && (o._pendingVisibility |= 2, de(g, c, 2));
        }
      },
      attach: function() {
        var c = o._current;
        if (c === null) throw Error(r(456));
        if (o._pendingVisibility & 2) {
          var g = Pn(c, 2);
          g !== null && (o._pendingVisibility &= -3, de(g, c, 2));
        }
      }
    };
    return t.stateNode = o, t;
  }
  function ec(t, e, a) {
    return t = ke(6, t, null, e), t.lanes = a, t;
  }
  function nc(t, e, a) {
    return e = ke(
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
  function jp(t, e) {
    if (e.type !== "stylesheet" || e.state.loading & 4)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !gg(e)) {
      if (e = Le.current, e !== null && ((Tt & 4194176) === Tt ? tn !== null : (Tt & 62914560) !== Tt && !(Tt & 536870912) || e !== tn))
        throw Rs = ru, Fh;
      t.flags |= 8192;
    }
  }
  function pr(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Wd() : 536870912, t.lanes |= e, Ma |= e);
  }
  function Gs(t, e) {
    if (!Et)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var a = null; e !== null; )
            e.alternate !== null && (a = e), e = e.sibling;
          a === null ? t.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = t.tail;
          for (var l = null; a !== null; )
            a.alternate !== null && (l = a), a = a.sibling;
          l === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : l.sibling = null;
      }
  }
  function Lt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, a = 0, l = 0;
    if (e)
      for (var o = t.child; o !== null; )
        a |= o.lanes | o.childLanes, l |= o.subtreeFlags & 31457280, l |= o.flags & 31457280, o.return = t, o = o.sibling;
    else
      for (o = t.child; o !== null; )
        a |= o.lanes | o.childLanes, l |= o.subtreeFlags, l |= o.flags, o.return = t, o = o.sibling;
    return t.subtreeFlags |= l, t.childLanes = a, e;
  }
  function eS(t, e, a) {
    var l = e.pendingProps;
    switch (su(e), e.tag) {
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
        return a = e.stateNode, l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), bn(Wt), Ln(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (t === null || t.child === null) && (Ts(e) ? An(e) : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, Ke !== null && (cc(Ke), Ke = null))), Lt(e), null;
      case 26:
        return a = e.memoizedState, t === null ? (An(e), a !== null ? (Lt(e), jp(e, a)) : (Lt(e), e.flags &= -16777217)) : a ? a !== t.memoizedState ? (An(e), Lt(e), jp(e, a)) : (Lt(e), e.flags &= -16777217) : (t.memoizedProps !== l && An(e), Lt(e), e.flags &= -16777217), null;
      case 27:
        ea(e), a = me.current;
        var o = e.type;
        if (t !== null && e.stateNode != null)
          t.memoizedProps !== l && An(e);
        else {
          if (!l) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Lt(e), null;
          }
          t = Se.current, Ts(e) ? Zh(e) : (t = og(o, l, a), e.stateNode = t, An(e));
        }
        return Lt(e), null;
      case 5:
        if (ea(e), a = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== l && An(e);
        else {
          if (!l) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Lt(e), null;
          }
          if (t = Se.current, Ts(e))
            Zh(e);
          else {
            switch (o = Rr(
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
                    t = typeof l.is == "string" ? o.createElement("select", { is: l.is }) : o.createElement("select"), l.multiple ? t.multiple = !0 : l.size && (t.size = l.size);
                    break;
                  default:
                    t = typeof l.is == "string" ? o.createElement(a, { is: l.is }) : o.createElement(a);
                }
            }
            t[le] = e, t[pe] = l;
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
            t: switch (ae(t, a, l), a) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                t = !!l.autoFocus;
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
          t.memoizedProps !== l && An(e);
        else {
          if (typeof l != "string" && e.stateNode === null)
            throw Error(r(166));
          if (t = me.current, Ts(e)) {
            if (t = e.stateNode, a = e.memoizedProps, l = null, o = fe, o !== null)
              switch (o.tag) {
                case 27:
                case 5:
                  l = o.memoizedProps;
              }
            t[le] = e, t = !!(t.nodeValue === a || l !== null && l.suppressHydrationWarning === !0 || ng(t.nodeValue, a)), t || Ri(e);
          } else
            t = Rr(t).createTextNode(
              l
            ), t[le] = e, e.stateNode = t;
        }
        return Lt(e), null;
      case 13:
        if (l = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (o = Ts(e), l !== null && l.dehydrated !== null) {
            if (t === null) {
              if (!o) throw Error(r(318));
              if (o = e.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(r(317));
              o[le] = e;
            } else
              As(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
            Lt(e), o = !1;
          } else
            Ke !== null && (cc(Ke), Ke = null), o = !0;
          if (!o)
            return e.flags & 256 ? (pn(e), e) : (pn(e), null);
        }
        if (pn(e), e.flags & 128)
          return e.lanes = a, e;
        if (a = l !== null, t = t !== null && t.memoizedState !== null, a) {
          l = e.child, o = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (o = l.alternate.memoizedState.cachePool.pool);
          var c = null;
          l.memoizedState !== null && l.memoizedState.cachePool !== null && (c = l.memoizedState.cachePool.pool), c !== o && (l.flags |= 2048);
        }
        return a !== t && a && (e.child.flags |= 8192), pr(e, e.updateQueue), Lt(e), null;
      case 4:
        return Ln(), t === null && Sc(e.stateNode.containerInfo), Lt(e), null;
      case 10:
        return bn(e.type), Lt(e), null;
      case 19:
        if (Vt(Ft), o = e.memoizedState, o === null) return Lt(e), null;
        if (l = (e.flags & 128) !== 0, c = o.rendering, c === null)
          if (l) Gs(o, !1);
          else {
            if (Ht !== 0 || t !== null && t.flags & 128)
              for (t = e.child; t !== null; ) {
                if (c = Jl(t), c !== null) {
                  for (e.flags |= 128, Gs(o, !1), t = c.updateQueue, e.updateQueue = t, pr(e, t), e.subtreeFlags = 0, t = a, a = e.child; a !== null; )
                    Op(a, t), a = a.sibling;
                  return Dt(
                    Ft,
                    Ft.current & 1 | 2
                  ), e.child;
                }
                t = t.sibling;
              }
            o.tail !== null && Je() > gr && (e.flags |= 128, l = !0, Gs(o, !1), e.lanes = 4194304);
          }
        else {
          if (!l)
            if (t = Jl(c), t !== null) {
              if (e.flags |= 128, l = !0, t = t.updateQueue, e.updateQueue = t, pr(e, t), Gs(o, !0), o.tail === null && o.tailMode === "hidden" && !c.alternate && !Et)
                return Lt(e), null;
            } else
              2 * Je() - o.renderingStartTime > gr && a !== 536870912 && (e.flags |= 128, l = !0, Gs(o, !1), e.lanes = 4194304);
          o.isBackwards ? (c.sibling = e.child, e.child = c) : (t = o.last, t !== null ? t.sibling = c : e.child = c, o.last = c);
        }
        return o.tail !== null ? (e = o.tail, o.rendering = e, o.tail = e.sibling, o.renderingStartTime = Je(), e.sibling = null, t = Ft.current, Dt(Ft, l ? t & 1 | 2 : t & 1), e) : (Lt(e), null);
      case 22:
      case 23:
        return pn(e), uu(), l = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== l && (e.flags |= 8192) : l && (e.flags |= 8192), l ? a & 536870912 && !(e.flags & 128) && (Lt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Lt(e), a = e.updateQueue, a !== null && pr(e, a.retryQueue), a = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), l = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), l !== a && (e.flags |= 2048), t !== null && Vt(Mi), null;
      case 24:
        return a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), bn(Wt), Lt(e), null;
      case 25:
        return null;
    }
    throw Error(r(156, e.tag));
  }
  function nS(t, e) {
    switch (su(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return bn(Wt), Ln(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return ea(e), null;
      case 13:
        if (pn(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(r(340));
          As();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return Vt(Ft), null;
      case 4:
        return Ln(), null;
      case 10:
        return bn(e.type), null;
      case 22:
      case 23:
        return pn(e), uu(), t !== null && Vt(Mi), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return bn(Wt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function _p(t, e) {
    switch (su(e), e.tag) {
      case 3:
        bn(Wt), Ln();
        break;
      case 26:
      case 27:
      case 5:
        ea(e);
        break;
      case 4:
        Ln();
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
        pn(e), uu(), t !== null && Vt(Mi);
        break;
      case 24:
        bn(Wt);
    }
  }
  var iS = {
    getCacheForType: function(t) {
      var e = re(Wt), a = e.data.get(t);
      return a === void 0 && (a = t(), e.data.set(t, a)), a;
    }
  }, aS = typeof WeakMap == "function" ? WeakMap : Map, Bt = 0, Nt = null, bt = null, Tt = 0, jt = 0, Ce = null, En = !1, Ca = !1, ic = !1, wn = 0, Ht = 0, ti = 0, Bi = 0, ac = 0, He = 0, Ma = 0, Ys = null, nn = null, sc = !1, lc = 0, gr = 1 / 0, vr = null, ei = null, yr = !1, Ui = null, Xs = 0, rc = 0, oc = null, Ks = 0, uc = null;
  function Me() {
    if (Bt & 2 && Tt !== 0)
      return Tt & -Tt;
    if (Q.T !== null) {
      var t = ba;
      return t !== 0 ? t : vc();
    }
    return th();
  }
  function zp() {
    He === 0 && (He = !(Tt & 536870912) || Et ? Fd() : 536870912);
    var t = Le.current;
    return t !== null && (t.flags |= 32), He;
  }
  function de(t, e, a) {
    (t === Nt && jt === 2 || t.cancelPendingCommit !== null) && (Da(t, 0), Rn(
      t,
      Tt,
      He,
      !1
    )), cs(t, a), (!(Bt & 2) || t !== Nt) && (t === Nt && (!(Bt & 2) && (Bi |= a), Ht === 4 && Rn(
      t,
      Tt,
      He,
      !1
    )), an(t));
  }
  function Vp(t, e, a) {
    if (Bt & 6) throw Error(r(327));
    var l = !a && (e & 60) === 0 && (e & t.expiredLanes) === 0 || us(t, e), o = l ? rS(t, e) : hc(t, e, !0), c = l;
    do {
      if (o === 0) {
        Ca && !l && Rn(t, e, 0, !1);
        break;
      } else if (o === 6)
        Rn(
          t,
          e,
          0,
          !En
        );
      else {
        if (a = t.current.alternate, c && !sS(a)) {
          o = hc(t, e, !1), c = !1;
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
              o = Ys;
              var w = b.current.memoizedState.isDehydrated;
              if (w && (Da(b, g).flags |= 256), g = hc(
                b,
                g,
                !1
              ), g !== 2) {
                if (ic && !w) {
                  b.errorRecoveryDisabledLanes |= c, Bi |= c, o = 4;
                  break t;
                }
                c = nn, nn = o, c !== null && cc(c);
              }
              o = g;
            }
            if (c = !1, o !== 2) continue;
          }
        }
        if (o === 1) {
          Da(t, 0), Rn(t, e, 0, !0);
          break;
        }
        t: {
          switch (l = t, o) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((e & 4194176) === e) {
                Rn(
                  l,
                  e,
                  He,
                  !En
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
          if (l.finishedWork = a, l.finishedLanes = e, (e & 62914560) === e && (c = lc + 300 - Je(), 10 < c)) {
            if (Rn(
              l,
              e,
              He,
              !En
            ), Nl(l, 0) !== 0) break t;
            l.timeoutHandle = sg(
              Lp.bind(
                null,
                l,
                a,
                nn,
                vr,
                sc,
                e,
                He,
                Bi,
                Ma,
                En,
                2,
                -0,
                0
              ),
              c
            );
            break t;
          }
          Lp(
            l,
            a,
            nn,
            vr,
            sc,
            e,
            He,
            Bi,
            Ma,
            En,
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
  function cc(t) {
    nn === null ? nn = t : nn.push.apply(
      nn,
      t
    );
  }
  function Lp(t, e, a, l, o, c, g, b, w, N, H, X, V) {
    var k = e.subtreeFlags;
    if ((k & 8192 || (k & 16785408) === 16785408) && (Js = { stylesheets: null, count: 0, unsuspend: HS }, Rp(e), e = qS(), e !== null)) {
      t.cancelPendingCommit = e(
        Gp.bind(
          null,
          t,
          a,
          l,
          o,
          g,
          b,
          w,
          1,
          X,
          V
        )
      ), Rn(t, c, g, !N);
      return;
    }
    Gp(
      t,
      a,
      l,
      o,
      g,
      b,
      w,
      H,
      X,
      V
    );
  }
  function sS(t) {
    for (var e = t; ; ) {
      var a = e.tag;
      if ((a === 0 || a === 11 || a === 15) && e.flags & 16384 && (a = e.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var l = 0; l < a.length; l++) {
          var o = a[l], c = o.getSnapshot;
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
  function Rn(t, e, a, l) {
    e &= ~ac, e &= ~Bi, t.suspendedLanes |= e, t.pingedLanes &= ~e, l && (t.warmLanes |= e), l = t.expirationTimes;
    for (var o = e; 0 < o; ) {
      var c = 31 - Ae(o), g = 1 << c;
      l[c] = -1, o &= ~g;
    }
    a !== 0 && $d(t, a, e);
  }
  function br() {
    return Bt & 6 ? !0 : (Zs(0), !1);
  }
  function fc() {
    if (bt !== null) {
      if (jt === 0)
        var t = bt.return;
      else
        t = bt, yn = _i = null, vu(t), va = null, Cs = 0, t = bt;
      for (; t !== null; )
        _p(t.alternate, t), t = t.return;
      bt = null;
    }
  }
  function Da(t, e) {
    t.finishedWork = null, t.finishedLanes = 0;
    var a = t.timeoutHandle;
    a !== -1 && (t.timeoutHandle = -1, ES(a)), a = t.cancelPendingCommit, a !== null && (t.cancelPendingCommit = null, a()), fc(), Nt = t, bt = a = In(t.current, null), Tt = e, jt = 0, Ce = null, En = !1, Ca = us(t, e), ic = !1, Ma = He = ac = Bi = ti = Ht = 0, nn = Ys = null, sc = !1, e & 8 && (e |= e & 32);
    var l = t.entangledLanes;
    if (l !== 0)
      for (t = t.entanglements, l &= e; 0 < l; ) {
        var o = 31 - Ae(l), c = 1 << o;
        e |= t[o], l &= ~c;
      }
    return wn = e, Gl(), a;
  }
  function Bp(t, e) {
    gt = null, Q.H = en, e === ws ? (e = Jh(), jt = 3) : e === Fh ? (e = Jh(), jt = 4) : jt = e === Wm ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Ce = e, bt === null && (Ht = 1, ur(
      t,
      _e(e, t.current)
    ));
  }
  function Up() {
    var t = Q.H;
    return Q.H = en, t === null ? en : t;
  }
  function kp() {
    var t = Q.A;
    return Q.A = iS, t;
  }
  function dc() {
    Ht = 4, En || (Tt & 4194176) !== Tt && Le.current !== null || (Ca = !0), !(ti & 134217727) && !(Bi & 134217727) || Nt === null || Rn(
      Nt,
      Tt,
      He,
      !1
    );
  }
  function hc(t, e, a) {
    var l = Bt;
    Bt |= 2;
    var o = Up(), c = kp();
    (Nt !== t || Tt !== e) && (vr = null, Da(t, e)), e = !1;
    var g = Ht;
    t: do
      try {
        if (jt !== 0 && bt !== null) {
          var b = bt, w = Ce;
          switch (jt) {
            case 8:
              fc(), g = 6;
              break t;
            case 3:
            case 2:
            case 6:
              Le.current === null && (e = !0);
              var N = jt;
              if (jt = 0, Ce = null, Oa(t, b, w, N), a && Ca) {
                g = 0;
                break t;
              }
              break;
            default:
              N = jt, jt = 0, Ce = null, Oa(t, b, w, N);
          }
        }
        lS(), g = Ht;
        break;
      } catch (H) {
        Bp(t, H);
      }
    while (!0);
    return e && t.shellSuspendCounter++, yn = _i = null, Bt = l, Q.H = o, Q.A = c, bt === null && (Nt = null, Tt = 0, Gl()), g;
  }
  function lS() {
    for (; bt !== null; ) Hp(bt);
  }
  function rS(t, e) {
    var a = Bt;
    Bt |= 2;
    var l = Up(), o = kp();
    Nt !== t || Tt !== e ? (vr = null, gr = Je() + 500, Da(t, e)) : Ca = us(
      t,
      e
    );
    t: do
      try {
        if (jt !== 0 && bt !== null) {
          e = bt;
          var c = Ce;
          e: switch (jt) {
            case 1:
              jt = 0, Ce = null, Oa(t, e, c, 1);
              break;
            case 2:
              if (Wh(c)) {
                jt = 0, Ce = null, Pp(e);
                break;
              }
              e = function() {
                jt === 2 && Nt === t && (jt = 7), an(t);
              }, c.then(e, e);
              break t;
            case 3:
              jt = 7;
              break t;
            case 4:
              jt = 5;
              break t;
            case 7:
              Wh(c) ? (jt = 0, Ce = null, Pp(e)) : (jt = 0, Ce = null, Oa(t, e, c, 7));
              break;
            case 5:
              var g = null;
              switch (bt.tag) {
                case 26:
                  g = bt.memoizedState;
                case 5:
                case 27:
                  var b = bt;
                  if (!g || gg(g)) {
                    jt = 0, Ce = null;
                    var w = b.sibling;
                    if (w !== null) bt = w;
                    else {
                      var N = b.return;
                      N !== null ? (bt = N, xr(N)) : bt = null;
                    }
                    break e;
                  }
              }
              jt = 0, Ce = null, Oa(t, e, c, 5);
              break;
            case 6:
              jt = 0, Ce = null, Oa(t, e, c, 6);
              break;
            case 8:
              fc(), Ht = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        oS();
        break;
      } catch (H) {
        Bp(t, H);
      }
    while (!0);
    return yn = _i = null, Q.H = l, Q.A = o, Bt = a, bt !== null ? 0 : (Nt = null, Tt = 0, Gl(), Ht);
  }
  function oS() {
    for (; bt !== null && !O1(); )
      Hp(bt);
  }
  function Hp(t) {
    var e = op(t.alternate, t, wn);
    t.memoizedProps = t.pendingProps, e === null ? xr(t) : bt = e;
  }
  function Pp(t) {
    var e = t, a = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = np(
          a,
          e,
          e.pendingProps,
          e.type,
          void 0,
          Tt
        );
        break;
      case 11:
        e = np(
          a,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          Tt
        );
        break;
      case 5:
        vu(e);
      default:
        _p(a, e), e = bt = Op(e, wn), e = op(a, e, wn);
    }
    t.memoizedProps = t.pendingProps, e === null ? xr(t) : bt = e;
  }
  function Oa(t, e, a, l) {
    yn = _i = null, vu(e), va = null, Cs = 0;
    var o = e.return;
    try {
      if (Wx(
        t,
        o,
        e,
        a,
        Tt
      )) {
        Ht = 1, ur(
          t,
          _e(a, t.current)
        ), bt = null;
        return;
      }
    } catch (c) {
      if (o !== null) throw bt = o, c;
      Ht = 1, ur(
        t,
        _e(a, t.current)
      ), bt = null;
      return;
    }
    e.flags & 32768 ? (Et || l === 1 ? t = !0 : Ca || Tt & 536870912 ? t = !1 : (En = t = !0, (l === 2 || l === 3 || l === 6) && (l = Le.current, l !== null && l.tag === 13 && (l.flags |= 16384))), qp(e, t)) : xr(e);
  }
  function xr(t) {
    var e = t;
    do {
      if (e.flags & 32768) {
        qp(
          e,
          En
        );
        return;
      }
      t = e.return;
      var a = eS(
        e.alternate,
        e,
        wn
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
  function qp(t, e) {
    do {
      var a = nS(t.alternate, t);
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
  function Gp(t, e, a, l, o, c, g, b, w, N) {
    var H = Q.T, X = J.p;
    try {
      J.p = 2, Q.T = null, uS(
        t,
        e,
        a,
        l,
        X,
        o,
        c,
        g,
        b,
        w,
        N
      );
    } finally {
      Q.T = H, J.p = X;
    }
  }
  function uS(t, e, a, l, o, c, g, b) {
    do
      Na();
    while (Ui !== null);
    if (Bt & 6) throw Error(r(327));
    var w = t.finishedWork;
    if (l = t.finishedLanes, w === null) return null;
    if (t.finishedWork = null, t.finishedLanes = 0, w === t.current) throw Error(r(177));
    t.callbackNode = null, t.callbackPriority = 0, t.cancelPendingCommit = null;
    var N = w.lanes | w.childLanes;
    if (N |= nu, P1(
      t,
      l,
      N,
      c,
      g,
      b
    ), t === Nt && (bt = Nt = null, Tt = 0), !(w.subtreeFlags & 10256) && !(w.flags & 10256) || yr || (yr = !0, rc = N, oc = a, hS(Ml, function() {
      return Na(), null;
    })), a = (w.flags & 15990) !== 0, w.subtreeFlags & 15990 || a ? (a = Q.T, Q.T = null, c = J.p, J.p = 2, g = Bt, Bt |= 4, Jx(t, w), Ap(w, t), _x(wc, t.containerInfo), jr = !!Ec, wc = Ec = null, t.current = w, bp(t, w.alternate, w), N1(), Bt = g, J.p = c, Q.T = a) : t.current = w, yr ? (yr = !1, Ui = t, Xs = l) : Yp(t, N), N = t.pendingLanes, N === 0 && (ei = null), L1(w.stateNode), an(t), e !== null)
      for (o = t.onRecoverableError, w = 0; w < e.length; w++)
        N = e[w], o(N.value, {
          componentStack: N.stack
        });
    return Xs & 3 && Na(), N = t.pendingLanes, l & 4194218 && N & 42 ? t === uc ? Ks++ : (Ks = 0, uc = t) : Ks = 0, Zs(0), null;
  }
  function Yp(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Ds(e)));
  }
  function Na() {
    if (Ui !== null) {
      var t = Ui, e = rc;
      rc = 0;
      var a = Id(Xs), l = Q.T, o = J.p;
      try {
        if (J.p = 32 > a ? 32 : a, Q.T = null, Ui === null)
          var c = !1;
        else {
          a = oc, oc = null;
          var g = Ui, b = Xs;
          if (Ui = null, Xs = 0, Bt & 6)
            throw Error(r(331));
          var w = Bt;
          if (Bt |= 4, Mp(g.current), wp(g, g.current, b, a), Bt = w, Zs(0, !1), Te && typeof Te.onPostCommitFiberRoot == "function")
            try {
              Te.onPostCommitFiberRoot(os, g);
            } catch {
            }
          c = !0;
        }
        return c;
      } finally {
        J.p = o, Q.T = l, Yp(t, e);
      }
    }
    return !1;
  }
  function Xp(t, e, a) {
    e = _e(a, e), e = Nu(t.stateNode, e, 2), t = Fn(t, e, 2), t !== null && (cs(t, 2), an(t));
  }
  function Ot(t, e, a) {
    if (t.tag === 3)
      Xp(t, t, a);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Xp(
            e,
            t,
            a
          );
          break;
        } else if (e.tag === 1) {
          var l = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (ei === null || !ei.has(l))) {
            t = _e(a, t), a = Qm(2), l = Fn(e, a, 2), l !== null && (Fm(
              a,
              l,
              e,
              t
            ), cs(l, 2), an(l));
            break;
          }
        }
        e = e.return;
      }
  }
  function mc(t, e, a) {
    var l = t.pingCache;
    if (l === null) {
      l = t.pingCache = new aS();
      var o = /* @__PURE__ */ new Set();
      l.set(e, o);
    } else
      o = l.get(e), o === void 0 && (o = /* @__PURE__ */ new Set(), l.set(e, o));
    o.has(a) || (ic = !0, o.add(a), t = cS.bind(null, t, e, a), e.then(t, t));
  }
  function cS(t, e, a) {
    var l = t.pingCache;
    l !== null && l.delete(e), t.pingedLanes |= t.suspendedLanes & a, t.warmLanes &= ~a, Nt === t && (Tt & a) === a && (Ht === 4 || Ht === 3 && (Tt & 62914560) === Tt && 300 > Je() - lc ? !(Bt & 2) && Da(t, 0) : ac |= a, Ma === Tt && (Ma = 0)), an(t);
  }
  function Kp(t, e) {
    e === 0 && (e = Wd()), t = Pn(t, e), t !== null && (cs(t, e), an(t));
  }
  function fS(t) {
    var e = t.memoizedState, a = 0;
    e !== null && (a = e.retryLane), Kp(t, a);
  }
  function dS(t, e) {
    var a = 0;
    switch (t.tag) {
      case 13:
        var l = t.stateNode, o = t.memoizedState;
        o !== null && (a = o.retryLane);
        break;
      case 19:
        l = t.stateNode;
        break;
      case 22:
        l = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    l !== null && l.delete(e), Kp(t, a);
  }
  function hS(t, e) {
    return jo(t, e);
  }
  var Sr = null, ja = null, pc = !1, Tr = !1, gc = !1, ki = 0;
  function an(t) {
    t !== ja && t.next === null && (ja === null ? Sr = ja = t : ja = ja.next = t), Tr = !0, pc || (pc = !0, pS(mS));
  }
  function Zs(t, e) {
    if (!gc && Tr) {
      gc = !0;
      do
        for (var a = !1, l = Sr; l !== null; ) {
          if (t !== 0) {
            var o = l.pendingLanes;
            if (o === 0) var c = 0;
            else {
              var g = l.suspendedLanes, b = l.pingedLanes;
              c = (1 << 31 - Ae(42 | t) + 1) - 1, c &= o & ~(g & ~b), c = c & 201326677 ? c & 201326677 | 1 : c ? c | 2 : 0;
            }
            c !== 0 && (a = !0, Fp(l, c));
          } else
            c = Tt, c = Nl(
              l,
              l === Nt ? c : 0
            ), !(c & 3) || us(l, c) || (a = !0, Fp(l, c));
          l = l.next;
        }
      while (a);
      gc = !1;
    }
  }
  function mS() {
    Tr = pc = !1;
    var t = 0;
    ki !== 0 && (AS() && (t = ki), ki = 0);
    for (var e = Je(), a = null, l = Sr; l !== null; ) {
      var o = l.next, c = Zp(l, e);
      c === 0 ? (l.next = null, a === null ? Sr = o : a.next = o, o === null && (ja = a)) : (a = l, (t !== 0 || c & 3) && (Tr = !0)), l = o;
    }
    Zs(t);
  }
  function Zp(t, e) {
    for (var a = t.suspendedLanes, l = t.pingedLanes, o = t.expirationTimes, c = t.pendingLanes & -62914561; 0 < c; ) {
      var g = 31 - Ae(c), b = 1 << g, w = o[g];
      w === -1 ? (!(b & a) || b & l) && (o[g] = H1(b, e)) : w <= e && (t.expiredLanes |= b), c &= ~b;
    }
    if (e = Nt, a = Tt, a = Nl(
      t,
      t === e ? a : 0
    ), l = t.callbackNode, a === 0 || t === e && jt === 2 || t.cancelPendingCommit !== null)
      return l !== null && l !== null && _o(l), t.callbackNode = null, t.callbackPriority = 0;
    if (!(a & 3) || us(t, a)) {
      if (e = a & -a, e === t.callbackPriority) return e;
      switch (l !== null && _o(l), Id(a)) {
        case 2:
        case 8:
          a = Zd;
          break;
        case 32:
          a = Ml;
          break;
        case 268435456:
          a = Qd;
          break;
        default:
          a = Ml;
      }
      return l = Qp.bind(null, t), a = jo(a, l), t.callbackPriority = e, t.callbackNode = a, e;
    }
    return l !== null && l !== null && _o(l), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Qp(t, e) {
    var a = t.callbackNode;
    if (Na() && t.callbackNode !== a)
      return null;
    var l = Tt;
    return l = Nl(
      t,
      t === Nt ? l : 0
    ), l === 0 ? null : (Vp(t, l, e), Zp(t, Je()), t.callbackNode != null && t.callbackNode === a ? Qp.bind(null, t) : null);
  }
  function Fp(t, e) {
    if (Na()) return null;
    Vp(t, e, !0);
  }
  function pS(t) {
    wS(function() {
      Bt & 6 ? jo(Kd, t) : t();
    });
  }
  function vc() {
    return ki === 0 && (ki = Fd()), ki;
  }
  function Wp(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Ll("" + t);
  }
  function $p(t, e) {
    var a = e.ownerDocument.createElement("input");
    return a.name = e.name, a.value = e.value, t.id && a.setAttribute("form", t.id), e.parentNode.insertBefore(a, e), t = new FormData(t), a.parentNode.removeChild(a), t;
  }
  function gS(t, e, a, l, o) {
    if (e === "submit" && a && a.stateNode === o) {
      var c = Wp(
        (o[pe] || null).action
      ), g = l.submitter;
      g && (e = (e = g[pe] || null) ? Wp(e.formAction) : g.getAttribute("formAction"), e !== null && (c = e, g = null));
      var b = new Hl(
        "action",
        "action",
        null,
        l,
        o
      );
      t.push({
        event: b,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (ki !== 0) {
                  var w = g ? $p(o, g) : new FormData(o);
                  Ru(
                    a,
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
                typeof c == "function" && (b.preventDefault(), w = g ? $p(o, g) : new FormData(o), Ru(
                  a,
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
  for (var yc = 0; yc < Gh.length; yc++) {
    var bc = Gh[yc], vS = bc.toLowerCase(), yS = bc[0].toUpperCase() + bc.slice(1);
    Xe(
      vS,
      "on" + yS
    );
  }
  Xe(Uh, "onAnimationEnd"), Xe(kh, "onAnimationIteration"), Xe(Hh, "onAnimationStart"), Xe("dblclick", "onDoubleClick"), Xe("focusin", "onFocus"), Xe("focusout", "onBlur"), Xe(Vx, "onTransitionRun"), Xe(Lx, "onTransitionStart"), Xe(Bx, "onTransitionCancel"), Xe(Ph, "onTransitionEnd"), sa("onMouseEnter", ["mouseout", "mouseover"]), sa("onMouseLeave", ["mouseout", "mouseover"]), sa("onPointerEnter", ["pointerout", "pointerover"]), sa("onPointerLeave", ["pointerout", "pointerover"]), xi(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), xi(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), xi("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), xi(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), xi(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), xi(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Qs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), bS = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Qs)
  );
  function Jp(t, e) {
    e = (e & 4) !== 0;
    for (var a = 0; a < t.length; a++) {
      var l = t[a], o = l.event;
      l = l.listeners;
      t: {
        var c = void 0;
        if (e)
          for (var g = l.length - 1; 0 <= g; g--) {
            var b = l[g], w = b.instance, N = b.currentTarget;
            if (b = b.listener, w !== c && o.isPropagationStopped())
              break t;
            c = b, o.currentTarget = N;
            try {
              c(o);
            } catch (H) {
              or(H);
            }
            o.currentTarget = null, c = w;
          }
        else
          for (g = 0; g < l.length; g++) {
            if (b = l[g], w = b.instance, N = b.currentTarget, b = b.listener, w !== c && o.isPropagationStopped())
              break t;
            c = b, o.currentTarget = N;
            try {
              c(o);
            } catch (H) {
              or(H);
            }
            o.currentTarget = null, c = w;
          }
      }
    }
  }
  function St(t, e) {
    var a = e[Vo];
    a === void 0 && (a = e[Vo] = /* @__PURE__ */ new Set());
    var l = t + "__bubble";
    a.has(l) || (Ip(e, t, 2, !1), a.add(l));
  }
  function xc(t, e, a) {
    var l = 0;
    e && (l |= 4), Ip(
      a,
      t,
      l,
      e
    );
  }
  var Ar = "_reactListening" + Math.random().toString(36).slice(2);
  function Sc(t) {
    if (!t[Ar]) {
      t[Ar] = !0, nh.forEach(function(a) {
        a !== "selectionchange" && (bS.has(a) || xc(a, !1, t), xc(a, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Ar] || (e[Ar] = !0, xc("selectionchange", !1, e));
    }
  }
  function Ip(t, e, a, l) {
    switch (Tg(e)) {
      case 2:
        var o = XS;
        break;
      case 8:
        o = KS;
        break;
      default:
        o = zc;
    }
    a = o.bind(
      null,
      e,
      a,
      t
    ), o = void 0, !Go || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (o = !0), l ? o !== void 0 ? t.addEventListener(e, a, {
      capture: !0,
      passive: o
    }) : t.addEventListener(e, a, !0) : o !== void 0 ? t.addEventListener(e, a, {
      passive: o
    }) : t.addEventListener(e, a, !1);
  }
  function Tc(t, e, a, l, o) {
    var c = l;
    if (!(e & 1) && !(e & 2) && l !== null)
      t: for (; ; ) {
        if (l === null) return;
        var g = l.tag;
        if (g === 3 || g === 4) {
          var b = l.stateNode.containerInfo;
          if (b === o || b.nodeType === 8 && b.parentNode === o)
            break;
          if (g === 4)
            for (g = l.return; g !== null; ) {
              var w = g.tag;
              if ((w === 3 || w === 4) && (w = g.stateNode.containerInfo, w === o || w.nodeType === 8 && w.parentNode === o))
                return;
              g = g.return;
            }
          for (; b !== null; ) {
            if (g = bi(b), g === null) return;
            if (w = g.tag, w === 5 || w === 6 || w === 26 || w === 27) {
              l = c = g;
              continue t;
            }
            b = b.parentNode;
          }
        }
        l = l.return;
      }
    mh(function() {
      var N = c, H = Po(a), X = [];
      t: {
        var V = qh.get(t);
        if (V !== void 0) {
          var k = Hl, it = t;
          switch (t) {
            case "keypress":
              if (Ul(a) === 0) break t;
            case "keydown":
            case "keyup":
              k = dx;
              break;
            case "focusin":
              it = "focus", k = Zo;
              break;
            case "focusout":
              it = "blur", k = Zo;
              break;
            case "beforeblur":
            case "afterblur":
              k = Zo;
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
              k = vh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k = tx;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k = px;
              break;
            case Uh:
            case kh:
            case Hh:
              k = ix;
              break;
            case Ph:
              k = vx;
              break;
            case "scroll":
            case "scrollend":
              k = J1;
              break;
            case "wheel":
              k = bx;
              break;
            case "copy":
            case "cut":
            case "paste":
              k = sx;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k = bh;
              break;
            case "toggle":
            case "beforetoggle":
              k = Sx;
          }
          var ct = (e & 4) !== 0, Pt = !ct && (t === "scroll" || t === "scrollend"), j = ct ? V !== null ? V + "Capture" : null : V;
          ct = [];
          for (var M = N, _; M !== null; ) {
            var G = M;
            if (_ = G.stateNode, G = G.tag, G !== 5 && G !== 26 && G !== 27 || _ === null || j === null || (G = hs(M, j), G != null && ct.push(
              Fs(M, G, _)
            )), Pt) break;
            M = M.return;
          }
          0 < ct.length && (V = new k(
            V,
            it,
            null,
            a,
            H
          ), X.push({ event: V, listeners: ct }));
        }
      }
      if (!(e & 7)) {
        t: {
          if (V = t === "mouseover" || t === "pointerover", k = t === "mouseout" || t === "pointerout", V && a !== Ho && (it = a.relatedTarget || a.fromElement) && (bi(it) || it[na]))
            break t;
          if ((k || V) && (V = H.window === H ? H : (V = H.ownerDocument) ? V.defaultView || V.parentWindow : window, k ? (it = a.relatedTarget || a.toElement, k = N, it = it ? bi(it) : null, it !== null && (Pt = Y(it), ct = it.tag, it !== Pt || ct !== 5 && ct !== 27 && ct !== 6) && (it = null)) : (k = null, it = N), k !== it)) {
            if (ct = vh, G = "onMouseLeave", j = "onMouseEnter", M = "mouse", (t === "pointerout" || t === "pointerover") && (ct = bh, G = "onPointerLeave", j = "onPointerEnter", M = "pointer"), Pt = k == null ? V : ds(k), _ = it == null ? V : ds(it), V = new ct(
              G,
              M + "leave",
              k,
              a,
              H
            ), V.target = Pt, V.relatedTarget = _, G = null, bi(H) === N && (ct = new ct(
              j,
              M + "enter",
              it,
              a,
              H
            ), ct.target = _, ct.relatedTarget = Pt, G = ct), Pt = G, k && it)
              e: {
                for (ct = k, j = it, M = 0, _ = ct; _; _ = _a(_))
                  M++;
                for (_ = 0, G = j; G; G = _a(G))
                  _++;
                for (; 0 < M - _; )
                  ct = _a(ct), M--;
                for (; 0 < _ - M; )
                  j = _a(j), _--;
                for (; M--; ) {
                  if (ct === j || j !== null && ct === j.alternate)
                    break e;
                  ct = _a(ct), j = _a(j);
                }
                ct = null;
              }
            else ct = null;
            k !== null && tg(
              X,
              V,
              k,
              ct,
              !1
            ), it !== null && Pt !== null && tg(
              X,
              Pt,
              it,
              ct,
              !0
            );
          }
        }
        t: {
          if (V = N ? ds(N) : window, k = V.nodeName && V.nodeName.toLowerCase(), k === "select" || k === "input" && V.type === "file")
            var I = Ch;
          else if (wh(V))
            if (Mh)
              I = Nx;
            else {
              I = Dx;
              var vt = Mx;
            }
          else
            k = V.nodeName, !k || k.toLowerCase() !== "input" || V.type !== "checkbox" && V.type !== "radio" ? N && ko(N.elementType) && (I = Ch) : I = Ox;
          if (I && (I = I(t, N))) {
            Rh(
              X,
              I,
              a,
              H
            );
            break t;
          }
          vt && vt(t, V, N), t === "focusout" && N && V.type === "number" && N.memoizedProps.value != null && Uo(V, "number", V.value);
        }
        switch (vt = N ? ds(N) : window, t) {
          case "focusin":
            (wh(vt) || vt.contentEditable === "true") && (fa = vt, Io = N, Ss = null);
            break;
          case "focusout":
            Ss = Io = fa = null;
            break;
          case "mousedown":
            tu = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            tu = !1, Lh(X, a, H);
            break;
          case "selectionchange":
            if (zx) break;
          case "keydown":
          case "keyup":
            Lh(X, a, H);
        }
        var st;
        if (Fo)
          t: {
            switch (t) {
              case "compositionstart":
                var rt = "onCompositionStart";
                break t;
              case "compositionend":
                rt = "onCompositionEnd";
                break t;
              case "compositionupdate":
                rt = "onCompositionUpdate";
                break t;
            }
            rt = void 0;
          }
        else
          ca ? Ah(t, a) && (rt = "onCompositionEnd") : t === "keydown" && a.keyCode === 229 && (rt = "onCompositionStart");
        rt && (xh && a.locale !== "ko" && (ca || rt !== "onCompositionStart" ? rt === "onCompositionEnd" && ca && (st = ph()) : (Hn = H, Yo = "value" in Hn ? Hn.value : Hn.textContent, ca = !0)), vt = Er(N, rt), 0 < vt.length && (rt = new yh(
          rt,
          t,
          null,
          a,
          H
        ), X.push({ event: rt, listeners: vt }), st ? rt.data = st : (st = Eh(a), st !== null && (rt.data = st)))), (st = Ax ? Ex(t, a) : wx(t, a)) && (rt = Er(N, "onBeforeInput"), 0 < rt.length && (vt = new yh(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          H
        ), X.push({
          event: vt,
          listeners: rt
        }), vt.data = st)), gS(
          X,
          t,
          N,
          a,
          H
        );
      }
      Jp(X, e);
    });
  }
  function Fs(t, e, a) {
    return {
      instance: t,
      listener: e,
      currentTarget: a
    };
  }
  function Er(t, e) {
    for (var a = e + "Capture", l = []; t !== null; ) {
      var o = t, c = o.stateNode;
      o = o.tag, o !== 5 && o !== 26 && o !== 27 || c === null || (o = hs(t, a), o != null && l.unshift(
        Fs(t, o, c)
      ), o = hs(t, e), o != null && l.push(
        Fs(t, o, c)
      )), t = t.return;
    }
    return l;
  }
  function _a(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function tg(t, e, a, l, o) {
    for (var c = e._reactName, g = []; a !== null && a !== l; ) {
      var b = a, w = b.alternate, N = b.stateNode;
      if (b = b.tag, w !== null && w === l) break;
      b !== 5 && b !== 26 && b !== 27 || N === null || (w = N, o ? (N = hs(a, c), N != null && g.unshift(
        Fs(a, N, w)
      )) : o || (N = hs(a, c), N != null && g.push(
        Fs(a, N, w)
      ))), a = a.return;
    }
    g.length !== 0 && t.push({ event: e, listeners: g });
  }
  var xS = /\r\n?/g, SS = /\u0000|\uFFFD/g;
  function eg(t) {
    return (typeof t == "string" ? t : "" + t).replace(xS, `
`).replace(SS, "");
  }
  function ng(t, e) {
    return e = eg(e), eg(t) === e;
  }
  function wr() {
  }
  function Mt(t, e, a, l, o, c) {
    switch (a) {
      case "children":
        typeof l == "string" ? e === "body" || e === "textarea" && l === "" || ra(t, l) : (typeof l == "number" || typeof l == "bigint") && e !== "body" && ra(t, "" + l);
        break;
      case "className":
        _l(t, "class", l);
        break;
      case "tabIndex":
        _l(t, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        _l(t, a, l);
        break;
      case "style":
        dh(t, l, c);
        break;
      case "data":
        if (e !== "object") {
          _l(t, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (e !== "a" || a !== "href")) {
          t.removeAttribute(a);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          t.removeAttribute(a);
          break;
        }
        l = Ll("" + l), t.setAttribute(a, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
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
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          t.removeAttribute(a);
          break;
        }
        l = Ll("" + l), t.setAttribute(a, l);
        break;
      case "onClick":
        l != null && (t.onclick = wr);
        break;
      case "onScroll":
        l != null && St("scroll", t);
        break;
      case "onScrollEnd":
        l != null && St("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(r(61));
          if (a = l.__html, a != null) {
            if (o.children != null) throw Error(r(60));
            t.innerHTML = a;
          }
        }
        break;
      case "multiple":
        t.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        t.muted = l && typeof l != "function" && typeof l != "symbol";
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
          t.removeAttribute("xlink:href");
          break;
        }
        a = Ll("" + l), t.setAttributeNS(
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
        l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(a, "" + l) : t.removeAttribute(a);
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
        l && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(a, "") : t.removeAttribute(a);
        break;
      case "capture":
      case "download":
        l === !0 ? t.setAttribute(a, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(a, l) : t.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? t.setAttribute(a, l) : t.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? t.removeAttribute(a) : t.setAttribute(a, l);
        break;
      case "popover":
        St("beforetoggle", t), St("toggle", t), jl(t, "popover", l);
        break;
      case "xlinkActuate":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        dn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        dn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        dn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        dn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        jl(t, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = W1.get(a) || a, jl(t, a, l));
    }
  }
  function Ac(t, e, a, l, o, c) {
    switch (a) {
      case "style":
        dh(t, l, c);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(r(61));
          if (a = l.__html, a != null) {
            if (o.children != null) throw Error(r(60));
            t.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof l == "string" ? ra(t, l) : (typeof l == "number" || typeof l == "bigint") && ra(t, "" + l);
        break;
      case "onScroll":
        l != null && St("scroll", t);
        break;
      case "onScrollEnd":
        l != null && St("scrollend", t);
        break;
      case "onClick":
        l != null && (t.onclick = wr);
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
        if (!ih.hasOwnProperty(a))
          t: {
            if (a[0] === "o" && a[1] === "n" && (o = a.endsWith("Capture"), e = a.slice(2, o ? a.length - 7 : void 0), c = t[pe] || null, c = c != null ? c[a] : null, typeof c == "function" && t.removeEventListener(e, c, o), typeof l == "function")) {
              typeof c != "function" && c !== null && (a in t ? t[a] = null : t.hasAttribute(a) && t.removeAttribute(a)), t.addEventListener(e, l, o);
              break t;
            }
            a in t ? t[a] = l : l === !0 ? t.setAttribute(a, "") : jl(t, a, l);
          }
    }
  }
  function ae(t, e, a) {
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
        var l = !1, o = !1, c;
        for (c in a)
          if (a.hasOwnProperty(c)) {
            var g = a[c];
            if (g != null)
              switch (c) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  o = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, e));
                default:
                  Mt(t, e, c, g, a, null);
              }
          }
        o && Mt(t, e, "srcSet", a.srcSet, a, null), l && Mt(t, e, "src", a.src, a, null);
        return;
      case "input":
        St("invalid", t);
        var b = c = g = o = null, w = null, N = null;
        for (l in a)
          if (a.hasOwnProperty(l)) {
            var H = a[l];
            if (H != null)
              switch (l) {
                case "name":
                  o = H;
                  break;
                case "type":
                  g = H;
                  break;
                case "checked":
                  w = H;
                  break;
                case "defaultChecked":
                  N = H;
                  break;
                case "value":
                  c = H;
                  break;
                case "defaultValue":
                  b = H;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (H != null)
                    throw Error(r(137, e));
                  break;
                default:
                  Mt(t, e, l, H, a, null);
              }
          }
        oh(
          t,
          c,
          b,
          w,
          N,
          g,
          o,
          !1
        ), zl(t);
        return;
      case "select":
        St("invalid", t), l = g = c = null;
        for (o in a)
          if (a.hasOwnProperty(o) && (b = a[o], b != null))
            switch (o) {
              case "value":
                c = b;
                break;
              case "defaultValue":
                g = b;
                break;
              case "multiple":
                l = b;
              default:
                Mt(t, e, o, b, a, null);
            }
        e = c, a = g, t.multiple = !!l, e != null ? la(t, !!l, e, !1) : a != null && la(t, !!l, a, !0);
        return;
      case "textarea":
        St("invalid", t), c = o = l = null;
        for (g in a)
          if (a.hasOwnProperty(g) && (b = a[g], b != null))
            switch (g) {
              case "value":
                l = b;
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
                Mt(t, e, g, b, a, null);
            }
        ch(t, l, o, c), zl(t);
        return;
      case "option":
        for (w in a)
          if (a.hasOwnProperty(w) && (l = a[w], l != null))
            switch (w) {
              case "selected":
                t.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Mt(t, e, w, l, a, null);
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
        for (l = 0; l < Qs.length; l++)
          St(Qs[l], t);
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
          if (a.hasOwnProperty(N) && (l = a[N], l != null))
            switch (N) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                Mt(t, e, N, l, a, null);
            }
        return;
      default:
        if (ko(e)) {
          for (H in a)
            a.hasOwnProperty(H) && (l = a[H], l !== void 0 && Ac(
              t,
              e,
              H,
              l,
              a,
              void 0
            ));
          return;
        }
    }
    for (b in a)
      a.hasOwnProperty(b) && (l = a[b], l != null && Mt(t, e, b, l, a, null));
  }
  function TS(t, e, a, l) {
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
        var o = null, c = null, g = null, b = null, w = null, N = null, H = null;
        for (k in a) {
          var X = a[k];
          if (a.hasOwnProperty(k) && X != null)
            switch (k) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                w = X;
              default:
                l.hasOwnProperty(k) || Mt(t, e, k, null, l, X);
            }
        }
        for (var V in l) {
          var k = l[V];
          if (X = a[V], l.hasOwnProperty(V) && (k != null || X != null))
            switch (V) {
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
                k !== X && Mt(
                  t,
                  e,
                  V,
                  k,
                  l,
                  X
                );
            }
        }
        Bo(
          t,
          g,
          b,
          w,
          N,
          H,
          c,
          o
        );
        return;
      case "select":
        k = g = b = V = null;
        for (c in a)
          if (w = a[c], a.hasOwnProperty(c) && w != null)
            switch (c) {
              case "value":
                break;
              case "multiple":
                k = w;
              default:
                l.hasOwnProperty(c) || Mt(
                  t,
                  e,
                  c,
                  null,
                  l,
                  w
                );
            }
        for (o in l)
          if (c = l[o], w = a[o], l.hasOwnProperty(o) && (c != null || w != null))
            switch (o) {
              case "value":
                V = c;
                break;
              case "defaultValue":
                b = c;
                break;
              case "multiple":
                g = c;
              default:
                c !== w && Mt(
                  t,
                  e,
                  o,
                  c,
                  l,
                  w
                );
            }
        e = b, a = g, l = k, V != null ? la(t, !!a, V, !1) : !!l != !!a && (e != null ? la(t, !!a, e, !0) : la(t, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        k = V = null;
        for (b in a)
          if (o = a[b], a.hasOwnProperty(b) && o != null && !l.hasOwnProperty(b))
            switch (b) {
              case "value":
                break;
              case "children":
                break;
              default:
                Mt(t, e, b, null, l, o);
            }
        for (g in l)
          if (o = l[g], c = a[g], l.hasOwnProperty(g) && (o != null || c != null))
            switch (g) {
              case "value":
                V = o;
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
                o !== c && Mt(t, e, g, o, l, c);
            }
        uh(t, V, k);
        return;
      case "option":
        for (var it in a)
          if (V = a[it], a.hasOwnProperty(it) && V != null && !l.hasOwnProperty(it))
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
                  l,
                  V
                );
            }
        for (w in l)
          if (V = l[w], k = a[w], l.hasOwnProperty(w) && V !== k && (V != null || k != null))
            switch (w) {
              case "selected":
                t.selected = V && typeof V != "function" && typeof V != "symbol";
                break;
              default:
                Mt(
                  t,
                  e,
                  w,
                  V,
                  l,
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
          V = a[ct], a.hasOwnProperty(ct) && V != null && !l.hasOwnProperty(ct) && Mt(t, e, ct, null, l, V);
        for (N in l)
          if (V = l[N], k = a[N], l.hasOwnProperty(N) && V !== k && (V != null || k != null))
            switch (N) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (V != null)
                  throw Error(r(137, e));
                break;
              default:
                Mt(
                  t,
                  e,
                  N,
                  V,
                  l,
                  k
                );
            }
        return;
      default:
        if (ko(e)) {
          for (var Pt in a)
            V = a[Pt], a.hasOwnProperty(Pt) && V !== void 0 && !l.hasOwnProperty(Pt) && Ac(
              t,
              e,
              Pt,
              void 0,
              l,
              V
            );
          for (H in l)
            V = l[H], k = a[H], !l.hasOwnProperty(H) || V === k || V === void 0 && k === void 0 || Ac(
              t,
              e,
              H,
              V,
              l,
              k
            );
          return;
        }
    }
    for (var j in a)
      V = a[j], a.hasOwnProperty(j) && V != null && !l.hasOwnProperty(j) && Mt(t, e, j, null, l, V);
    for (X in l)
      V = l[X], k = a[X], !l.hasOwnProperty(X) || V === k || V == null && k == null || Mt(t, e, X, V, l, k);
  }
  var Ec = null, wc = null;
  function Rr(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function ig(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function ag(t, e) {
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
  function Rc(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Cc = null;
  function AS() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Cc ? !1 : (Cc = t, !0) : (Cc = null, !1);
  }
  var sg = typeof setTimeout == "function" ? setTimeout : void 0, ES = typeof clearTimeout == "function" ? clearTimeout : void 0, lg = typeof Promise == "function" ? Promise : void 0, wS = typeof queueMicrotask == "function" ? queueMicrotask : typeof lg < "u" ? function(t) {
    return lg.resolve(null).then(t).catch(RS);
  } : sg;
  function RS(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Mc(t, e) {
    var a = e, l = 0;
    do {
      var o = a.nextSibling;
      if (t.removeChild(a), o && o.nodeType === 8)
        if (a = o.data, a === "/$") {
          if (l === 0) {
            t.removeChild(o), il(e);
            return;
          }
          l--;
        } else a !== "$" && a !== "$?" && a !== "$!" || l++;
      a = o;
    } while (a);
    il(e);
  }
  function Dc(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var a = e;
      switch (e = e.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Dc(a), Lo(a);
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
  function CS(t, e, a, l) {
    for (; t.nodeType === 1; ) {
      var o = a;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!l && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (l) {
        if (!t[fs])
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
  function MS(t, e, a) {
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
  function rg(t) {
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
  function og(t, e, a) {
    switch (e = Rr(a), t) {
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
  var Pe = /* @__PURE__ */ new Map(), ug = /* @__PURE__ */ new Set();
  function Cr(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.ownerDocument;
  }
  var Cn = J.d;
  J.d = {
    f: DS,
    r: OS,
    D: NS,
    C: jS,
    L: _S,
    m: zS,
    X: LS,
    S: VS,
    M: BS
  };
  function DS() {
    var t = Cn.f(), e = br();
    return t || e;
  }
  function OS(t) {
    var e = ia(t);
    e !== null && e.tag === 5 && e.type === "form" ? Lm(e) : Cn.r(t);
  }
  var za = typeof document > "u" ? null : document;
  function cg(t, e, a) {
    var l = za;
    if (l && typeof e == "string" && e) {
      var o = Ne(e);
      o = 'link[rel="' + t + '"][href="' + o + '"]', typeof a == "string" && (o += '[crossorigin="' + a + '"]'), ug.has(o) || (ug.add(o), t = { rel: t, crossOrigin: a, href: e }, l.querySelector(o) === null && (e = l.createElement("link"), ae(e, "link", t), $t(e), l.head.appendChild(e)));
    }
  }
  function NS(t) {
    Cn.D(t), cg("dns-prefetch", t, null);
  }
  function jS(t, e) {
    Cn.C(t, e), cg("preconnect", t, e);
  }
  function _S(t, e, a) {
    Cn.L(t, e, a);
    var l = za;
    if (l && t && e) {
      var o = 'link[rel="preload"][as="' + Ne(e) + '"]';
      e === "image" && a && a.imageSrcSet ? (o += '[imagesrcset="' + Ne(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (o += '[imagesizes="' + Ne(
        a.imageSizes
      ) + '"]')) : o += '[href="' + Ne(t) + '"]';
      var c = o;
      switch (e) {
        case "style":
          c = Va(t);
          break;
        case "script":
          c = La(t);
      }
      Pe.has(c) || (t = W(
        {
          rel: "preload",
          href: e === "image" && a && a.imageSrcSet ? void 0 : t,
          as: e
        },
        a
      ), Pe.set(c, t), l.querySelector(o) !== null || e === "style" && l.querySelector(Ws(c)) || e === "script" && l.querySelector($s(c)) || (e = l.createElement("link"), ae(e, "link", t), $t(e), l.head.appendChild(e)));
    }
  }
  function zS(t, e) {
    Cn.m(t, e);
    var a = za;
    if (a && t) {
      var l = e && typeof e.as == "string" ? e.as : "script", o = 'link[rel="modulepreload"][as="' + Ne(l) + '"][href="' + Ne(t) + '"]', c = o;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          c = La(t);
      }
      if (!Pe.has(c) && (t = W({ rel: "modulepreload", href: t }, e), Pe.set(c, t), a.querySelector(o) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector($s(c)))
              return;
        }
        l = a.createElement("link"), ae(l, "link", t), $t(l), a.head.appendChild(l);
      }
    }
  }
  function VS(t, e, a) {
    Cn.S(t, e, a);
    var l = za;
    if (l && t) {
      var o = aa(l).hoistableStyles, c = Va(t);
      e = e || "default";
      var g = o.get(c);
      if (!g) {
        var b = { loading: 0, preload: null };
        if (g = l.querySelector(
          Ws(c)
        ))
          b.loading = 5;
        else {
          t = W(
            { rel: "stylesheet", href: t, "data-precedence": e },
            a
          ), (a = Pe.get(c)) && Oc(t, a);
          var w = g = l.createElement("link");
          $t(w), ae(w, "link", t), w._p = new Promise(function(N, H) {
            w.onload = N, w.onerror = H;
          }), w.addEventListener("load", function() {
            b.loading |= 1;
          }), w.addEventListener("error", function() {
            b.loading |= 2;
          }), b.loading |= 4, Mr(g, e, l);
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
  function LS(t, e) {
    Cn.X(t, e);
    var a = za;
    if (a && t) {
      var l = aa(a).hoistableScripts, o = La(t), c = l.get(o);
      c || (c = a.querySelector($s(o)), c || (t = W({ src: t, async: !0 }, e), (e = Pe.get(o)) && Nc(t, e), c = a.createElement("script"), $t(c), ae(c, "link", t), a.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, l.set(o, c));
    }
  }
  function BS(t, e) {
    Cn.M(t, e);
    var a = za;
    if (a && t) {
      var l = aa(a).hoistableScripts, o = La(t), c = l.get(o);
      c || (c = a.querySelector($s(o)), c || (t = W({ src: t, async: !0, type: "module" }, e), (e = Pe.get(o)) && Nc(t, e), c = a.createElement("script"), $t(c), ae(c, "link", t), a.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, l.set(o, c));
    }
  }
  function fg(t, e, a, l) {
    var o = (o = me.current) ? Cr(o) : null;
    if (!o) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (e = Va(a.href), a = aa(
          o
        ).hoistableStyles, l = a.get(e), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(e, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          t = Va(a.href);
          var c = aa(
            o
          ).hoistableStyles, g = c.get(t);
          if (g || (o = o.ownerDocument || o, g = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, c.set(t, g), (c = o.querySelector(
            Ws(t)
          )) && !c._p && (g.instance = c, g.state.loading = 5), Pe.has(t) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, Pe.set(t, a), c || US(
            o,
            t,
            a,
            g.state
          ))), e && l === null)
            throw Error(r(528, ""));
          return g;
        }
        if (e && l !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return e = a.async, a = a.src, typeof a == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = La(a), a = aa(
          o
        ).hoistableScripts, l = a.get(e), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(e, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, t));
    }
  }
  function Va(t) {
    return 'href="' + Ne(t) + '"';
  }
  function Ws(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function dg(t) {
    return W({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function US(t, e, a, l) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? l.loading = 1 : (e = t.createElement("link"), l.preload = e, e.addEventListener("load", function() {
      return l.loading |= 1;
    }), e.addEventListener("error", function() {
      return l.loading |= 2;
    }), ae(e, "link", a), $t(e), t.head.appendChild(e));
  }
  function La(t) {
    return '[src="' + Ne(t) + '"]';
  }
  function $s(t) {
    return "script[async]" + t;
  }
  function hg(t, e, a) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var l = t.querySelector(
            'style[data-href~="' + Ne(a.href) + '"]'
          );
          if (l)
            return e.instance = l, $t(l), l;
          var o = W({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return l = (t.ownerDocument || t).createElement(
            "style"
          ), $t(l), ae(l, "style", o), Mr(l, a.precedence, t), e.instance = l;
        case "stylesheet":
          o = Va(a.href);
          var c = t.querySelector(
            Ws(o)
          );
          if (c)
            return e.state.loading |= 4, e.instance = c, $t(c), c;
          l = dg(a), (o = Pe.get(o)) && Oc(l, o), c = (t.ownerDocument || t).createElement("link"), $t(c);
          var g = c;
          return g._p = new Promise(function(b, w) {
            g.onload = b, g.onerror = w;
          }), ae(c, "link", l), e.state.loading |= 4, Mr(c, a.precedence, t), e.instance = c;
        case "script":
          return c = La(a.src), (o = t.querySelector(
            $s(c)
          )) ? (e.instance = o, $t(o), o) : (l = a, (o = Pe.get(c)) && (l = W({}, a), Nc(l, o)), t = t.ownerDocument || t, o = t.createElement("script"), $t(o), ae(o, "link", l), t.head.appendChild(o), e.instance = o);
        case "void":
          return null;
        default:
          throw Error(r(443, e.type));
      }
    else
      e.type === "stylesheet" && !(e.state.loading & 4) && (l = e.instance, e.state.loading |= 4, Mr(l, a.precedence, t));
    return e.instance;
  }
  function Mr(t, e, a) {
    for (var l = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), o = l.length ? l[l.length - 1] : null, c = o, g = 0; g < l.length; g++) {
      var b = l[g];
      if (b.dataset.precedence === e) c = b;
      else if (c !== o) break;
    }
    c ? c.parentNode.insertBefore(t, c.nextSibling) : (e = a.nodeType === 9 ? a.head : a, e.insertBefore(t, e.firstChild));
  }
  function Oc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Nc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Dr = null;
  function mg(t, e, a) {
    if (Dr === null) {
      var l = /* @__PURE__ */ new Map(), o = Dr = /* @__PURE__ */ new Map();
      o.set(a, l);
    } else
      o = Dr, l = o.get(a), l || (l = /* @__PURE__ */ new Map(), o.set(a, l));
    if (l.has(t)) return l;
    for (l.set(t, null), a = a.getElementsByTagName(t), o = 0; o < a.length; o++) {
      var c = a[o];
      if (!(c[fs] || c[le] || t === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
        var g = c.getAttribute(e) || "";
        g = t + g;
        var b = l.get(g);
        b ? b.push(c) : l.set(g, [c]);
      }
    }
    return l;
  }
  function pg(t, e, a) {
    t = t.ownerDocument || t, t.head.insertBefore(
      a,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function kS(t, e, a) {
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
  function gg(t) {
    return !(t.type === "stylesheet" && !(t.state.loading & 3));
  }
  var Js = null;
  function HS() {
  }
  function PS(t, e, a) {
    if (Js === null) throw Error(r(475));
    var l = Js;
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && !(e.state.loading & 4)) {
      if (e.instance === null) {
        var o = Va(a.href), c = t.querySelector(
          Ws(o)
        );
        if (c) {
          t = c._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = Or.bind(l), t.then(l, l)), e.state.loading |= 4, e.instance = c, $t(c);
          return;
        }
        c = t.ownerDocument || t, a = dg(a), (o = Pe.get(o)) && Oc(a, o), c = c.createElement("link"), $t(c);
        var g = c;
        g._p = new Promise(function(b, w) {
          g.onload = b, g.onerror = w;
        }), ae(c, "link", a), e.instance = c;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(e, t), (t = e.state.preload) && !(e.state.loading & 3) && (l.count++, e = Or.bind(l), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  function qS() {
    if (Js === null) throw Error(r(475));
    var t = Js;
    return t.stylesheets && t.count === 0 && jc(t, t.stylesheets), 0 < t.count ? function(e) {
      var a = setTimeout(function() {
        if (t.stylesheets && jc(t, t.stylesheets), t.unsuspend) {
          var l = t.unsuspend;
          t.unsuspend = null, l();
        }
      }, 6e4);
      return t.unsuspend = e, function() {
        t.unsuspend = null, clearTimeout(a);
      };
    } : null;
  }
  function Or() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) jc(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var Nr = null;
  function jc(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Nr = /* @__PURE__ */ new Map(), e.forEach(GS, t), Nr = null, Or.call(t));
  }
  function GS(t, e) {
    if (!(e.state.loading & 4)) {
      var a = Nr.get(t);
      if (a) var l = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), Nr.set(t, a);
        for (var o = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), c = 0; c < o.length; c++) {
          var g = o[c];
          (g.nodeName === "LINK" || g.getAttribute("media") !== "not all") && (a.set(g.dataset.precedence, g), l = g);
        }
        l && a.set(null, l);
      }
      o = e.instance, g = o.getAttribute("data-precedence"), c = a.get(g) || l, c === l && a.set(null, o), a.set(g, o), this.count++, l = Or.bind(this), o.addEventListener("load", l), o.addEventListener("error", l), c ? c.parentNode.insertBefore(o, c.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(o, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Is = {
    $$typeof: S,
    Provider: null,
    Consumer: null,
    _currentValue: dt,
    _currentValue2: dt,
    _threadCount: 0
  };
  function YS(t, e, a, l, o, c, g, b) {
    this.tag = 1, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = zo(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.finishedLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = zo(0), this.hiddenUpdates = zo(null), this.identifierPrefix = l, this.onUncaughtError = o, this.onCaughtError = c, this.onRecoverableError = g, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = b, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function vg(t, e, a, l, o, c, g, b, w, N, H, X) {
    return t = new YS(
      t,
      e,
      a,
      g,
      b,
      w,
      N,
      X
    ), e = 1, c === !0 && (e |= 24), c = ke(3, null, null, e), t.current = c, c.stateNode = t, e = cu(), e.refCount++, t.pooledCache = e, e.refCount++, c.memoizedState = {
      element: l,
      isDehydrated: a,
      cache: e
    }, Yu(c), t;
  }
  function yg(t) {
    return t ? (t = ma, t) : ma;
  }
  function bg(t, e, a, l, o, c) {
    o = yg(o), l.context === null ? l.context = o : l.pendingContext = o, l = Qn(e), l.payload = { element: a }, c = c === void 0 ? null : c, c !== null && (l.callback = c), a = Fn(t, l, e), a !== null && (de(a, t, e), Ls(a, t, e));
  }
  function xg(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var a = t.retryLane;
      t.retryLane = a !== 0 && a < e ? a : e;
    }
  }
  function _c(t, e) {
    xg(t, e), (t = t.alternate) && xg(t, e);
  }
  function Sg(t) {
    if (t.tag === 13) {
      var e = Pn(t, 67108864);
      e !== null && de(e, t, 67108864), _c(t, 67108864);
    }
  }
  var jr = !0;
  function XS(t, e, a, l) {
    var o = Q.T;
    Q.T = null;
    var c = J.p;
    try {
      J.p = 2, zc(t, e, a, l);
    } finally {
      J.p = c, Q.T = o;
    }
  }
  function KS(t, e, a, l) {
    var o = Q.T;
    Q.T = null;
    var c = J.p;
    try {
      J.p = 8, zc(t, e, a, l);
    } finally {
      J.p = c, Q.T = o;
    }
  }
  function zc(t, e, a, l) {
    if (jr) {
      var o = Vc(l);
      if (o === null)
        Tc(
          t,
          e,
          l,
          _r,
          a
        ), Ag(t, l);
      else if (QS(
        o,
        t,
        e,
        a,
        l
      ))
        l.stopPropagation();
      else if (Ag(t, l), e & 4 && -1 < ZS.indexOf(t)) {
        for (; o !== null; ) {
          var c = ia(o);
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (c = c.stateNode, c.current.memoizedState.isDehydrated) {
                  var g = yi(c.pendingLanes);
                  if (g !== 0) {
                    var b = c;
                    for (b.pendingLanes |= 2, b.entangledLanes |= 2; g; ) {
                      var w = 1 << 31 - Ae(g);
                      b.entanglements[1] |= w, g &= ~w;
                    }
                    an(c), !(Bt & 6) && (gr = Je() + 500, Zs(0));
                  }
                }
                break;
              case 13:
                b = Pn(c, 2), b !== null && de(b, c, 2), br(), _c(c, 2);
            }
          if (c = Vc(l), c === null && Tc(
            t,
            e,
            l,
            _r,
            a
          ), c === o) break;
          o = c;
        }
        o !== null && l.stopPropagation();
      } else
        Tc(
          t,
          e,
          l,
          null,
          a
        );
    }
  }
  function Vc(t) {
    return t = Po(t), Lc(t);
  }
  var _r = null;
  function Lc(t) {
    if (_r = null, t = bi(t), t !== null) {
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
    return _r = t, null;
  }
  function Tg(t) {
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
        switch (j1()) {
          case Kd:
            return 2;
          case Zd:
            return 8;
          case Ml:
          case _1:
            return 32;
          case Qd:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Bc = !1, ni = null, ii = null, ai = null, tl = /* @__PURE__ */ new Map(), el = /* @__PURE__ */ new Map(), si = [], ZS = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Ag(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        ni = null;
        break;
      case "dragenter":
      case "dragleave":
        ii = null;
        break;
      case "mouseover":
      case "mouseout":
        ai = null;
        break;
      case "pointerover":
      case "pointerout":
        tl.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        el.delete(e.pointerId);
    }
  }
  function nl(t, e, a, l, o, c) {
    return t === null || t.nativeEvent !== c ? (t = {
      blockedOn: e,
      domEventName: a,
      eventSystemFlags: l,
      nativeEvent: c,
      targetContainers: [o]
    }, e !== null && (e = ia(e), e !== null && Sg(e)), t) : (t.eventSystemFlags |= l, e = t.targetContainers, o !== null && e.indexOf(o) === -1 && e.push(o), t);
  }
  function QS(t, e, a, l, o) {
    switch (e) {
      case "focusin":
        return ni = nl(
          ni,
          t,
          e,
          a,
          l,
          o
        ), !0;
      case "dragenter":
        return ii = nl(
          ii,
          t,
          e,
          a,
          l,
          o
        ), !0;
      case "mouseover":
        return ai = nl(
          ai,
          t,
          e,
          a,
          l,
          o
        ), !0;
      case "pointerover":
        var c = o.pointerId;
        return tl.set(
          c,
          nl(
            tl.get(c) || null,
            t,
            e,
            a,
            l,
            o
          )
        ), !0;
      case "gotpointercapture":
        return c = o.pointerId, el.set(
          c,
          nl(
            el.get(c) || null,
            t,
            e,
            a,
            l,
            o
          )
        ), !0;
    }
    return !1;
  }
  function Eg(t) {
    var e = bi(t.target);
    if (e !== null) {
      var a = Y(e);
      if (a !== null) {
        if (e = a.tag, e === 13) {
          if (e = nt(a), e !== null) {
            t.blockedOn = e, q1(t.priority, function() {
              if (a.tag === 13) {
                var l = Me(), o = Pn(a, l);
                o !== null && de(o, a, l), _c(a, l);
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
  function zr(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var a = Vc(t.nativeEvent);
      if (a === null) {
        a = t.nativeEvent;
        var l = new a.constructor(
          a.type,
          a
        );
        Ho = l, a.target.dispatchEvent(l), Ho = null;
      } else
        return e = ia(a), e !== null && Sg(e), t.blockedOn = a, !1;
      e.shift();
    }
    return !0;
  }
  function wg(t, e, a) {
    zr(t) && a.delete(e);
  }
  function FS() {
    Bc = !1, ni !== null && zr(ni) && (ni = null), ii !== null && zr(ii) && (ii = null), ai !== null && zr(ai) && (ai = null), tl.forEach(wg), el.forEach(wg);
  }
  function Vr(t, e) {
    t.blockedOn === e && (t.blockedOn = null, Bc || (Bc = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      FS
    )));
  }
  var Lr = null;
  function Rg(t) {
    Lr !== t && (Lr = t, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        Lr === t && (Lr = null);
        for (var e = 0; e < t.length; e += 3) {
          var a = t[e], l = t[e + 1], o = t[e + 2];
          if (typeof l != "function") {
            if (Lc(l || a) === null)
              continue;
            break;
          }
          var c = ia(a);
          c !== null && (t.splice(e, 3), e -= 3, Ru(
            c,
            {
              pending: !0,
              data: o,
              method: a.method,
              action: l
            },
            l,
            o
          ));
        }
      }
    ));
  }
  function il(t) {
    function e(w) {
      return Vr(w, t);
    }
    ni !== null && Vr(ni, t), ii !== null && Vr(ii, t), ai !== null && Vr(ai, t), tl.forEach(e), el.forEach(e);
    for (var a = 0; a < si.length; a++) {
      var l = si[a];
      l.blockedOn === t && (l.blockedOn = null);
    }
    for (; 0 < si.length && (a = si[0], a.blockedOn === null); )
      Eg(a), a.blockedOn === null && si.shift();
    if (a = (t.ownerDocument || t).$$reactFormReplay, a != null)
      for (l = 0; l < a.length; l += 3) {
        var o = a[l], c = a[l + 1], g = o[pe] || null;
        if (typeof c == "function")
          g || Rg(a);
        else if (g) {
          var b = null;
          if (c && c.hasAttribute("formAction")) {
            if (o = c, g = c[pe] || null)
              b = g.formAction;
            else if (Lc(o) !== null) continue;
          } else b = g.action;
          typeof b == "function" ? a[l + 1] = b : (a.splice(l, 3), l -= 3), Rg(a);
        }
      }
  }
  function Uc(t) {
    this._internalRoot = t;
  }
  Br.prototype.render = Uc.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(r(409));
    var a = e.current, l = Me();
    bg(a, l, t, e, null, null);
  }, Br.prototype.unmount = Uc.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      t.tag === 0 && Na(), bg(t.current, 2, null, t, null, null), br(), e[na] = null;
    }
  };
  function Br(t) {
    this._internalRoot = t;
  }
  Br.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = th();
      t = { blockedOn: null, target: t, priority: e };
      for (var a = 0; a < si.length && e !== 0 && e < si[a].priority; a++) ;
      si.splice(a, 0, t), a === 0 && Eg(t);
    }
  };
  var Cg = i.version;
  if (Cg !== "19.0.0")
    throw Error(
      r(
        527,
        Cg,
        "19.0.0"
      )
    );
  J.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
    return t = K(e), t = t !== null ? lt(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var WS = {
    bundleType: 0,
    version: "19.0.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: Q,
    findFiberByHostInstance: bi,
    reconcilerVersion: "19.0.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ur = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ur.isDisabled && Ur.supportsFiber)
      try {
        os = Ur.inject(
          WS
        ), Te = Ur;
      } catch {
      }
  }
  return sl.createRoot = function(t, e) {
    if (!u(t)) throw Error(r(299));
    var a = !1, l = "", o = Ym, c = Xm, g = Km, b = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (l = e.identifierPrefix), e.onUncaughtError !== void 0 && (o = e.onUncaughtError), e.onCaughtError !== void 0 && (c = e.onCaughtError), e.onRecoverableError !== void 0 && (g = e.onRecoverableError), e.unstable_transitionCallbacks !== void 0 && (b = e.unstable_transitionCallbacks)), e = vg(
      t,
      1,
      !1,
      null,
      null,
      a,
      l,
      o,
      c,
      g,
      b,
      null
    ), t[na] = e.current, Sc(
      t.nodeType === 8 ? t.parentNode : t
    ), new Uc(e);
  }, sl.hydrateRoot = function(t, e, a) {
    if (!u(t)) throw Error(r(299));
    var l = !1, o = "", c = Ym, g = Xm, b = Km, w = null, N = null;
    return a != null && (a.unstable_strictMode === !0 && (l = !0), a.identifierPrefix !== void 0 && (o = a.identifierPrefix), a.onUncaughtError !== void 0 && (c = a.onUncaughtError), a.onCaughtError !== void 0 && (g = a.onCaughtError), a.onRecoverableError !== void 0 && (b = a.onRecoverableError), a.unstable_transitionCallbacks !== void 0 && (w = a.unstable_transitionCallbacks), a.formState !== void 0 && (N = a.formState)), e = vg(
      t,
      1,
      !0,
      e,
      a ?? null,
      l,
      o,
      c,
      g,
      b,
      w,
      N
    ), e.context = yg(null), a = e.current, l = Me(), o = Qn(l), o.callback = null, Fn(a, o, l), e.current.lanes = l, cs(e, l), an(e), t[na] = e.current, Sc(t), new Br(e);
  }, sl.version = "19.0.0", sl;
}
var Bg;
function lT() {
  if (Bg) return Hc.exports;
  Bg = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), Hc.exports = sT(), Hc.exports;
}
var no = lT(), Qi = Oy();
const rT = /* @__PURE__ */ Dy(Qi);
var E = Kf();
const oT = /* @__PURE__ */ Dy(E), uT = /* @__PURE__ */ JS({
  __proto__: null,
  default: oT
}, [E]);
function ye(n, i, { checkForDefaultPrevented: s = !0 } = {}) {
  return function(u) {
    if (n == null || n(u), s === !1 || !u.defaultPrevented)
      return i == null ? void 0 : i(u);
  };
}
function Ug(n, i) {
  if (typeof n == "function")
    return n(i);
  n != null && (n.current = i);
}
function Ny(...n) {
  return (i) => {
    let s = !1;
    const r = n.map((u) => {
      const f = Ug(u, i);
      return !s && typeof f == "function" && (s = !0), f;
    });
    if (s)
      return () => {
        for (let u = 0; u < r.length; u++) {
          const f = r[u];
          typeof f == "function" ? f() : Ug(n[u], null);
        }
      };
  };
}
function We(...n) {
  return E.useCallback(Ny(...n), n);
}
function cT(n, i) {
  const s = E.createContext(i), r = (f) => {
    const { children: d, ...h } = f, m = E.useMemo(() => h, Object.values(h));
    return /* @__PURE__ */ T.jsx(s.Provider, { value: m, children: d });
  };
  r.displayName = n + "Provider";
  function u(f) {
    const d = E.useContext(s);
    if (d) return d;
    if (i !== void 0) return i;
    throw new Error(`\`${f}\` must be used within \`${n}\``);
  }
  return [r, u];
}
function Zf(n, i = []) {
  let s = [];
  function r(f, d) {
    const h = E.createContext(d), m = s.length;
    s = [...s, d];
    const p = (y) => {
      var O;
      const { scope: x, children: S, ...R } = y, A = ((O = x == null ? void 0 : x[n]) == null ? void 0 : O[m]) || h, D = E.useMemo(() => R, Object.values(R));
      return /* @__PURE__ */ T.jsx(A.Provider, { value: D, children: S });
    };
    p.displayName = f + "Provider";
    function v(y, x) {
      var A;
      const S = ((A = x == null ? void 0 : x[n]) == null ? void 0 : A[m]) || h, R = E.useContext(S);
      if (R) return R;
      if (d !== void 0) return d;
      throw new Error(`\`${y}\` must be used within \`${f}\``);
    }
    return [p, v];
  }
  const u = () => {
    const f = s.map((d) => E.createContext(d));
    return function(h) {
      const m = (h == null ? void 0 : h[n]) || f;
      return E.useMemo(
        () => ({ [`__scope${n}`]: { ...h, [n]: m } }),
        [h, m]
      );
    };
  };
  return u.scopeName = n, [r, fT(u, ...i)];
}
function fT(...n) {
  const i = n[0];
  if (n.length === 1) return i;
  const s = () => {
    const r = n.map((u) => ({
      useScope: u(),
      scopeName: u.scopeName
    }));
    return function(f) {
      const d = r.reduce((h, { useScope: m, scopeName: p }) => {
        const y = m(f)[`__scope${p}`];
        return { ...h, ...y };
      }, {});
      return E.useMemo(() => ({ [`__scope${i.scopeName}`]: d }), [d]);
    };
  };
  return s.scopeName = i.scopeName, s;
}
var yo = E.forwardRef((n, i) => {
  const { children: s, ...r } = n, u = E.Children.toArray(s), f = u.find(dT);
  if (f) {
    const d = f.props.children, h = u.map((m) => m === f ? E.Children.count(d) > 1 ? E.Children.only(null) : E.isValidElement(d) ? d.props.children : null : m);
    return /* @__PURE__ */ T.jsx(gf, { ...r, ref: i, children: E.isValidElement(d) ? E.cloneElement(d, void 0, h) : null });
  }
  return /* @__PURE__ */ T.jsx(gf, { ...r, ref: i, children: s });
});
yo.displayName = "Slot";
var gf = E.forwardRef((n, i) => {
  const { children: s, ...r } = n;
  if (E.isValidElement(s)) {
    const u = mT(s), f = hT(r, s.props);
    return s.type !== E.Fragment && (f.ref = i ? Ny(i, u) : u), E.cloneElement(s, f);
  }
  return E.Children.count(s) > 1 ? E.Children.only(null) : null;
});
gf.displayName = "SlotClone";
var jy = ({ children: n }) => /* @__PURE__ */ T.jsx(T.Fragment, { children: n });
function dT(n) {
  return E.isValidElement(n) && n.type === jy;
}
function hT(n, i) {
  const s = { ...i };
  for (const r in i) {
    const u = n[r], f = i[r];
    /^on[A-Z]/.test(r) ? u && f ? s[r] = (...h) => {
      f(...h), u(...h);
    } : u && (s[r] = u) : r === "style" ? s[r] = { ...u, ...f } : r === "className" && (s[r] = [u, f].filter(Boolean).join(" "));
  }
  return { ...n, ...s };
}
function mT(n) {
  var r, u;
  let i = (r = Object.getOwnPropertyDescriptor(n.props, "ref")) == null ? void 0 : r.get, s = i && "isReactWarning" in i && i.isReactWarning;
  return s ? n.ref : (i = (u = Object.getOwnPropertyDescriptor(n, "ref")) == null ? void 0 : u.get, s = i && "isReactWarning" in i && i.isReactWarning, s ? n.props.ref : n.props.ref || n.ref);
}
var pT = [
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
], xe = pT.reduce((n, i) => {
  const s = E.forwardRef((r, u) => {
    const { asChild: f, ...d } = r, h = f ? yo : i;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ T.jsx(h, { ...d, ref: u });
  });
  return s.displayName = `Primitive.${i}`, { ...n, [i]: s };
}, {});
function gT(n, i) {
  n && Qi.flushSync(() => n.dispatchEvent(i));
}
function ci(n) {
  const i = E.useRef(n);
  return E.useEffect(() => {
    i.current = n;
  }), E.useMemo(() => (...s) => {
    var r;
    return (r = i.current) == null ? void 0 : r.call(i, ...s);
  }, []);
}
function vT(n, i = globalThis == null ? void 0 : globalThis.document) {
  const s = ci(n);
  E.useEffect(() => {
    const r = (u) => {
      u.key === "Escape" && s(u);
    };
    return i.addEventListener("keydown", r, { capture: !0 }), () => i.removeEventListener("keydown", r, { capture: !0 });
  }, [s, i]);
}
var yT = "DismissableLayer", vf = "dismissableLayer.update", bT = "dismissableLayer.pointerDownOutside", xT = "dismissableLayer.focusOutside", kg, _y = E.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Qf = E.forwardRef(
  (n, i) => {
    const {
      disableOutsidePointerEvents: s = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: u,
      onFocusOutside: f,
      onInteractOutside: d,
      onDismiss: h,
      ...m
    } = n, p = E.useContext(_y), [v, y] = E.useState(null), x = (v == null ? void 0 : v.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, S] = E.useState({}), R = We(i, (Z) => y(Z)), A = Array.from(p.layers), [D] = [...p.layersWithOutsidePointerEventsDisabled].slice(-1), O = A.indexOf(D), z = v ? A.indexOf(v) : -1, U = p.layersWithOutsidePointerEventsDisabled.size > 0, q = z >= O, B = AT((Z) => {
      const F = Z.target, Q = [...p.branches].some((W) => W.contains(F));
      !q || Q || (u == null || u(Z), d == null || d(Z), Z.defaultPrevented || h == null || h());
    }, x), L = ET((Z) => {
      const F = Z.target;
      [...p.branches].some((W) => W.contains(F)) || (f == null || f(Z), d == null || d(Z), Z.defaultPrevented || h == null || h());
    }, x);
    return vT((Z) => {
      z === p.layers.size - 1 && (r == null || r(Z), !Z.defaultPrevented && h && (Z.preventDefault(), h()));
    }, x), E.useEffect(() => {
      if (v)
        return s && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (kg = x.body.style.pointerEvents, x.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(v)), p.layers.add(v), Hg(), () => {
          s && p.layersWithOutsidePointerEventsDisabled.size === 1 && (x.body.style.pointerEvents = kg);
        };
    }, [v, x, s, p]), E.useEffect(() => () => {
      v && (p.layers.delete(v), p.layersWithOutsidePointerEventsDisabled.delete(v), Hg());
    }, [v, p]), E.useEffect(() => {
      const Z = () => S({});
      return document.addEventListener(vf, Z), () => document.removeEventListener(vf, Z);
    }, []), /* @__PURE__ */ T.jsx(
      xe.div,
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
          B.onPointerDownCapture
        )
      }
    );
  }
);
Qf.displayName = yT;
var ST = "DismissableLayerBranch", TT = E.forwardRef((n, i) => {
  const s = E.useContext(_y), r = E.useRef(null), u = We(i, r);
  return E.useEffect(() => {
    const f = r.current;
    if (f)
      return s.branches.add(f), () => {
        s.branches.delete(f);
      };
  }, [s.branches]), /* @__PURE__ */ T.jsx(xe.div, { ...n, ref: u });
});
TT.displayName = ST;
function AT(n, i = globalThis == null ? void 0 : globalThis.document) {
  const s = ci(n), r = E.useRef(!1), u = E.useRef(() => {
  });
  return E.useEffect(() => {
    const f = (h) => {
      if (h.target && !r.current) {
        let m = function() {
          zy(
            bT,
            s,
            p,
            { discrete: !0 }
          );
        };
        const p = { originalEvent: h };
        h.pointerType === "touch" ? (i.removeEventListener("click", u.current), u.current = m, i.addEventListener("click", u.current, { once: !0 })) : m();
      } else
        i.removeEventListener("click", u.current);
      r.current = !1;
    }, d = window.setTimeout(() => {
      i.addEventListener("pointerdown", f);
    }, 0);
    return () => {
      window.clearTimeout(d), i.removeEventListener("pointerdown", f), i.removeEventListener("click", u.current);
    };
  }, [i, s]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function ET(n, i = globalThis == null ? void 0 : globalThis.document) {
  const s = ci(n), r = E.useRef(!1);
  return E.useEffect(() => {
    const u = (f) => {
      f.target && !r.current && zy(xT, s, { originalEvent: f }, {
        discrete: !1
      });
    };
    return i.addEventListener("focusin", u), () => i.removeEventListener("focusin", u);
  }, [i, s]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function Hg() {
  const n = new CustomEvent(vf);
  document.dispatchEvent(n);
}
function zy(n, i, s, { discrete: r }) {
  const u = s.originalEvent.target, f = new CustomEvent(n, { bubbles: !1, cancelable: !0, detail: s });
  i && u.addEventListener(n, i, { once: !0 }), r ? gT(u, f) : u.dispatchEvent(f);
}
var Fi = globalThis != null && globalThis.document ? E.useLayoutEffect : () => {
}, wT = uT.useId || (() => {
}), RT = 0;
function Fr(n) {
  const [i, s] = E.useState(wT());
  return Fi(() => {
    s((r) => r ?? String(RT++));
  }, [n]), i ? `radix-${i}` : "";
}
const CT = ["top", "right", "bottom", "left"], fi = Math.min, Mn = Math.max, io = Math.round, kr = Math.floor, Dn = (n) => ({
  x: n,
  y: n
}), MT = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Vy(n, i, s) {
  return Mn(n, fi(i, s));
}
function jn(n, i) {
  return typeof n == "function" ? n(i) : n;
}
function di(n) {
  return n.split("-")[0];
}
function ts(n) {
  return n.split("-")[1];
}
function Ff(n) {
  return n === "x" ? "y" : "x";
}
function Wf(n) {
  return n === "y" ? "height" : "width";
}
function ln(n) {
  const i = n[0];
  return i === "t" || i === "b" ? "y" : "x";
}
function $f(n) {
  return Ff(ln(n));
}
function DT(n, i, s) {
  s === void 0 && (s = !1);
  const r = ts(n), u = $f(n), f = Wf(u);
  let d = u === "x" ? r === (s ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return i.reference[f] > i.floating[f] && (d = ao(d)), [d, ao(d)];
}
function OT(n) {
  const i = ao(n);
  return [yf(n), i, yf(i)];
}
function yf(n) {
  return n.includes("start") ? n.replace("start", "end") : n.replace("end", "start");
}
const Pg = ["left", "right"], qg = ["right", "left"], NT = ["top", "bottom"], jT = ["bottom", "top"];
function _T(n, i, s) {
  switch (n) {
    case "top":
    case "bottom":
      return s ? i ? qg : Pg : i ? Pg : qg;
    case "left":
    case "right":
      return i ? NT : jT;
    default:
      return [];
  }
}
function zT(n, i, s, r) {
  const u = ts(n);
  let f = _T(di(n), s === "start", r);
  return u && (f = f.map((d) => d + "-" + u), i && (f = f.concat(f.map(yf)))), f;
}
function ao(n) {
  const i = di(n);
  return MT[i] + n.slice(i.length);
}
function VT(n) {
  var i, s, r, u;
  return {
    top: (i = n.top) != null ? i : 0,
    right: (s = n.right) != null ? s : 0,
    bottom: (r = n.bottom) != null ? r : 0,
    left: (u = n.left) != null ? u : 0
  };
}
function Ly(n) {
  return typeof n != "number" ? VT(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function so(n) {
  const {
    x: i,
    y: s,
    width: r,
    height: u
  } = n;
  return {
    width: r,
    height: u,
    top: s,
    left: i,
    right: i + r,
    bottom: s + u,
    x: i,
    y: s
  };
}
function Gg(n, i, s) {
  let {
    reference: r,
    floating: u
  } = n;
  const f = ln(i), d = $f(i), h = Wf(d), m = di(i), p = f === "y", v = r.x + r.width / 2 - u.width / 2, y = r.y + r.height / 2 - u.height / 2, x = r[h] / 2 - u[h] / 2;
  let S;
  switch (m) {
    case "top":
      S = {
        x: v,
        y: r.y - u.height
      };
      break;
    case "bottom":
      S = {
        x: v,
        y: r.y + r.height
      };
      break;
    case "right":
      S = {
        x: r.x + r.width,
        y
      };
      break;
    case "left":
      S = {
        x: r.x - u.width,
        y
      };
      break;
    default:
      S = {
        x: r.x,
        y: r.y
      };
  }
  const R = ts(i);
  return R && (S[d] += x * (R === "end" ? 1 : -1) * (s && p ? -1 : 1)), S;
}
async function LT(n, i) {
  var s;
  i === void 0 && (i = {});
  const {
    x: r,
    y: u,
    platform: f,
    rects: d,
    elements: h,
    strategy: m
  } = n, {
    boundary: p = "clippingAncestors",
    rootBoundary: v = "viewport",
    elementContext: y = "floating",
    altBoundary: x = !1,
    padding: S = 0
  } = jn(i, n), R = Ly(S), D = h[x ? y === "floating" ? "reference" : "floating" : y], O = so(await f.getClippingRect({
    element: (s = await (f.isElement == null ? void 0 : f.isElement(D))) == null || s ? D : D.contextElement || await (f.getDocumentElement == null ? void 0 : f.getDocumentElement(h.floating)),
    boundary: p,
    rootBoundary: v,
    strategy: m
  })), z = y === "floating" ? {
    x: r,
    y: u,
    width: d.floating.width,
    height: d.floating.height
  } : d.reference, U = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(h.floating)), q = await (f.isElement == null ? void 0 : f.isElement(U)) && await (f.getScale == null ? void 0 : f.getScale(U)) || {
    x: 1,
    y: 1
  }, B = so(f.convertOffsetParentRelativeRectToViewportRelativeRect ? await f.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: h,
    rect: z,
    offsetParent: U,
    strategy: m
  }) : z);
  return {
    top: (O.top - B.top + R.top) / q.y,
    bottom: (B.bottom - O.bottom + R.bottom) / q.y,
    left: (O.left - B.left + R.left) / q.x,
    right: (B.right - O.right + R.right) / q.x
  };
}
const BT = 50, UT = async (n, i, s) => {
  const {
    placement: r = "bottom",
    strategy: u = "absolute",
    middleware: f = [],
    platform: d
  } = s, h = d.detectOverflow ? d : {
    ...d,
    detectOverflow: LT
  }, m = await (d.isRTL == null ? void 0 : d.isRTL(i));
  let p = await d.getElementRects({
    reference: n,
    floating: i,
    strategy: u
  }), {
    x: v,
    y
  } = Gg(p, r, m), x = r, S = 0;
  const R = {};
  for (let A = 0; A < f.length; A++) {
    const D = f[A];
    if (!D)
      continue;
    const {
      name: O,
      fn: z
    } = D, {
      x: U,
      y: q,
      data: B,
      reset: L
    } = await z({
      x: v,
      y,
      initialPlacement: r,
      placement: x,
      strategy: u,
      middlewareData: R,
      rects: p,
      platform: h,
      elements: {
        reference: n,
        floating: i
      }
    });
    v = U ?? v, y = q ?? y, R[O] = {
      ...R[O],
      ...B
    }, L && S < BT && (S++, typeof L == "object" && (L.placement && (x = L.placement), L.rects && (p = L.rects === !0 ? await d.getElementRects({
      reference: n,
      floating: i,
      strategy: u
    }) : L.rects), {
      x: v,
      y
    } = Gg(p, x, m)), A = -1);
  }
  return {
    x: v,
    y,
    placement: x,
    strategy: u,
    middlewareData: R
  };
}, kT = (n) => ({
  name: "arrow",
  options: n,
  async fn(i) {
    const {
      x: s,
      y: r,
      placement: u,
      rects: f,
      platform: d,
      elements: h,
      middlewareData: m
    } = i, {
      element: p,
      padding: v = 0
    } = jn(n, i) || {};
    if (p == null)
      return {};
    const y = Ly(v), x = {
      x: s,
      y: r
    }, S = $f(u), R = Wf(S), A = await d.getDimensions(p), D = S === "y", O = D ? "top" : "left", z = D ? "bottom" : "right", U = D ? "clientHeight" : "clientWidth", q = f.reference[R] + f.reference[S] - x[S] - f.floating[R], B = x[S] - f.reference[S], L = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(p));
    let Z = L ? L[U] : 0;
    (!Z || !await (d.isElement == null ? void 0 : d.isElement(L))) && (Z = h.floating[U] || f.floating[R]);
    const F = q / 2 - B / 2, Q = Z / 2 - A[R] / 2 - 1, W = fi(y[O], Q), mt = fi(y[z], Q), Rt = Z - A[R] - mt, ft = Z / 2 - A[R] / 2 + F, pt = Vy(W, ft, Rt), yt = !m.arrow && ts(u) != null && ft !== pt && f.reference[R] / 2 - (ft < W ? W : mt) - A[R] / 2 < 0, P = yt ? ft < W ? ft - W : ft - Rt : 0;
    return {
      [S]: x[S] + P,
      data: {
        [S]: pt,
        centerOffset: ft - pt - P,
        ...yt && {
          alignmentOffset: P
        }
      },
      reset: yt
    };
  }
}), HT = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(i) {
      var s, r;
      const {
        placement: u,
        middlewareData: f,
        rects: d,
        initialPlacement: h,
        platform: m,
        elements: p
      } = i, {
        mainAxis: v = !0,
        crossAxis: y = !0,
        fallbackPlacements: x,
        fallbackStrategy: S = "bestFit",
        fallbackAxisSideDirection: R = "none",
        flipAlignment: A = !0,
        ...D
      } = jn(n, i);
      if ((s = f.arrow) != null && s.alignmentOffset)
        return {};
      const O = di(u), z = ln(h), U = di(h) === h, q = await (m.isRTL == null ? void 0 : m.isRTL(p.floating)), B = x || (U || !A ? [ao(h)] : OT(h)), L = R !== "none";
      !x && L && B.push(...zT(h, A, R, q));
      const Z = [h, ...B], F = await m.detectOverflow(i, D), Q = [];
      let W = ((r = f.flip) == null ? void 0 : r.overflows) || [];
      if (v && Q.push(F[O]), y) {
        const pt = DT(u, d, q);
        Q.push(F[pt[0]], F[pt[1]]);
      }
      if (W = [...W, {
        placement: u,
        overflows: Q
      }], !Q.every((pt) => pt <= 0)) {
        var mt, Rt;
        const pt = (((mt = f.flip) == null ? void 0 : mt.index) || 0) + 1, yt = Z[pt];
        if (yt && (!(y === "alignment" ? z !== ln(yt) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        W.every((Y) => ln(Y.placement) === z ? Y.overflows[0] > 0 : !0)))
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
          switch (S) {
            case "bestFit": {
              var ft;
              const $ = (ft = W.filter((Y) => {
                if (L) {
                  const nt = ln(Y.placement);
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
function Yg(n, i) {
  return {
    top: n.top - i.height,
    right: n.right - i.width,
    bottom: n.bottom - i.height,
    left: n.left - i.width
  };
}
function Xg(n) {
  return CT.some((i) => n[i] >= 0);
}
const PT = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(i) {
      const {
        rects: s,
        platform: r
      } = i, {
        strategy: u = "referenceHidden",
        ...f
      } = jn(n, i);
      switch (u) {
        case "referenceHidden": {
          const d = await r.detectOverflow(i, {
            ...f,
            elementContext: "reference"
          }), h = Yg(d, s.reference);
          return {
            data: {
              referenceHiddenOffsets: h,
              referenceHidden: Xg(h)
            }
          };
        }
        case "escaped": {
          const d = await r.detectOverflow(i, {
            ...f,
            altBoundary: !0
          }), h = Yg(d, s.floating);
          return {
            data: {
              escapedOffsets: h,
              escaped: Xg(h)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, By = /* @__PURE__ */ new Set(["left", "top"]);
async function qT(n, i) {
  const {
    placement: s,
    platform: r,
    elements: u
  } = n, f = await (r.isRTL == null ? void 0 : r.isRTL(u.floating)), d = di(s), h = ts(s), m = ln(s) === "y", p = By.has(d) ? -1 : 1, v = f && m ? -1 : 1, y = jn(i, n);
  let {
    mainAxis: x,
    crossAxis: S,
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
  return h && typeof R == "number" && (S = h === "end" ? R * -1 : R), m ? {
    x: S * v,
    y: x * p
  } : {
    x: x * p,
    y: S * v
  };
}
const GT = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(i) {
      var s, r;
      const {
        x: u,
        y: f,
        placement: d,
        middlewareData: h
      } = i, m = await qT(i, n);
      return d === ((s = h.offset) == null ? void 0 : s.placement) && (r = h.arrow) != null && r.alignmentOffset ? {} : {
        x: u + m.x,
        y: f + m.y,
        data: {
          ...m,
          placement: d
        }
      };
    }
  };
}, YT = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(i) {
      const {
        x: s,
        y: r,
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
      } = jn(n, i), v = {
        x: s,
        y: r
      }, y = await f.detectOverflow(i, p), x = ln(u), S = Ff(x);
      let R = v[S], A = v[x];
      const D = (z, U) => Vy(U + y[z === "y" ? "top" : "left"], U, U - y[z === "y" ? "bottom" : "right"]);
      d && (R = D(S, R)), h && (A = D(x, A));
      const O = m.fn({
        ...i,
        [S]: R,
        [x]: A
      });
      return {
        ...O,
        data: {
          x: O.x - s,
          y: O.y - r,
          enabled: {
            [S]: d,
            [x]: h
          }
        }
      };
    }
  };
}, XT = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(i) {
      var s, r;
      const {
        x: u,
        y: f,
        placement: d,
        rects: h,
        middlewareData: m
      } = i, {
        offset: p = 0,
        mainAxis: v = !0,
        crossAxis: y = !0
      } = jn(n, i), x = {
        x: u,
        y: f
      }, S = ln(d), R = Ff(S);
      let A = x[R], D = x[S];
      const O = jn(p, i), z = typeof O == "number" ? {
        mainAxis: O,
        crossAxis: 0
      } : {
        mainAxis: (s = O.mainAxis) != null ? s : 0,
        crossAxis: (r = O.crossAxis) != null ? r : 0
      };
      if (v) {
        const B = R === "y" ? "height" : "width", L = h.reference[R] - h.floating[B] + z.mainAxis, Z = h.reference[R] + h.reference[B] - z.mainAxis;
        A < L ? A = L : A > Z && (A = Z);
      }
      if (y) {
        var U, q;
        const B = R === "y" ? "width" : "height", L = By.has(di(d)), Z = h.reference[S] - h.floating[B] + (L && ((U = m.offset) == null ? void 0 : U[S]) || 0) + (L ? 0 : z.crossAxis), F = h.reference[S] + h.reference[B] + (L ? 0 : ((q = m.offset) == null ? void 0 : q[S]) || 0) - (L ? z.crossAxis : 0);
        D < Z ? D = Z : D > F && (D = F);
      }
      return {
        [R]: A,
        [S]: D
      };
    }
  };
}, KT = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(i) {
      const {
        placement: s,
        rects: r,
        platform: u,
        elements: f
      } = i, {
        apply: d = () => {
        },
        ...h
      } = jn(n, i), m = await u.detectOverflow(i, h), p = di(s), v = ts(s), y = ln(s) === "y", {
        width: x,
        height: S
      } = r.floating;
      let R, A;
      p === "top" || p === "bottom" ? (R = p, A = v === (await (u.isRTL == null ? void 0 : u.isRTL(f.floating)) ? "start" : "end") ? "left" : "right") : (A = p, R = v === "end" ? "top" : "bottom");
      const D = S - m.top - m.bottom, O = x - m.left - m.right, z = fi(S - m[R], D), U = fi(x - m[A], O), q = i.middlewareData.shift, B = !q;
      let L = z, Z = U;
      q != null && q.enabled.x && (Z = O), q != null && q.enabled.y && (L = D), B && !v && (y ? Z = x - 2 * Mn(m.left, m.right) : L = S - 2 * Mn(m.top, m.bottom)), await d({
        ...i,
        availableWidth: Z,
        availableHeight: L
      });
      const F = await u.getDimensions(f.floating);
      return x !== F.width || S !== F.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function bo() {
  return typeof window < "u";
}
function es(n) {
  return Uy(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function be(n) {
  var i;
  return (n == null || (i = n.ownerDocument) == null ? void 0 : i.defaultView) || window;
}
function zn(n) {
  var i;
  return (i = (Uy(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : i.documentElement;
}
function Uy(n) {
  return bo() ? n instanceof Node || n instanceof be(n).Node : !1;
}
function un(n) {
  return bo() ? n instanceof Element || n instanceof be(n).Element : !1;
}
function pi(n) {
  return bo() ? n instanceof HTMLElement || n instanceof be(n).HTMLElement : !1;
}
function Kg(n) {
  return !bo() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof be(n).ShadowRoot;
}
function xo(n) {
  const {
    overflow: i,
    overflowX: s,
    overflowY: r,
    display: u
  } = cn(n);
  return /auto|scroll|overlay|hidden|clip/.test(i + r + s) && u !== "inline" && u !== "contents";
}
function ZT(n) {
  return /^(table|td|th)$/.test(es(n));
}
function So(n) {
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
const QT = /transform|translate|scale|rotate|perspective|filter/, FT = /paint|layout|strict|content/, Hi = (n) => !!n && n !== "none";
let Xc;
function Jf(n) {
  const i = un(n) ? cn(n) : n;
  return Hi(i.transform) || Hi(i.translate) || Hi(i.scale) || Hi(i.rotate) || Hi(i.perspective) || !If() && (Hi(i.backdropFilter) || Hi(i.filter)) || QT.test(i.willChange || "") || FT.test(i.contain || "");
}
function WT(n) {
  let i = Wi(n);
  for (; pi(i) && !hl(i); ) {
    if (Jf(i))
      return i;
    if (So(i))
      return null;
    i = Wi(i);
  }
  return null;
}
function If() {
  return Xc == null && (Xc = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Xc;
}
function hl(n) {
  return /^(html|body|#document)$/.test(es(n));
}
function cn(n) {
  return be(n).getComputedStyle(n);
}
function To(n) {
  return un(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Wi(n) {
  if (es(n) === "html")
    return n;
  const i = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Kg(n) && n.host || // Fallback.
    zn(n)
  );
  return Kg(i) ? i.host : i;
}
function ky(n) {
  const i = Wi(n);
  return hl(i) ? (n.ownerDocument || n).body : pi(i) && xo(i) ? i : ky(i);
}
function ml(n, i, s) {
  var r;
  i === void 0 && (i = []), s === void 0 && (s = !0);
  const u = ky(n), f = u === ((r = n.ownerDocument) == null ? void 0 : r.body), d = be(u);
  if (f) {
    const h = bf(d);
    return i.concat(d, d.visualViewport || [], xo(u) ? u : [], h && s ? ml(h) : []);
  } else
    return i.concat(u, ml(u, [], s));
}
function bf(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Hy(n) {
  const i = cn(n);
  let s = parseFloat(i.width) || 0, r = parseFloat(i.height) || 0;
  const u = pi(n), f = u ? n.offsetWidth : s, d = u ? n.offsetHeight : r, h = io(s) !== f || io(r) !== d;
  return h && (s = f, r = d), {
    width: s,
    height: r,
    $: h
  };
}
function td(n) {
  return un(n) ? n : n.contextElement;
}
function Qa(n) {
  const i = td(n);
  if (!pi(i))
    return Dn(1);
  const s = i.getBoundingClientRect(), {
    width: r,
    height: u,
    $: f
  } = Hy(i);
  let d = (f ? io(s.width) : s.width) / r, h = (f ? io(s.height) : s.height) / u;
  return (!d || !Number.isFinite(d)) && (d = 1), (!h || !Number.isFinite(h)) && (h = 1), {
    x: d,
    y: h
  };
}
const $T = /* @__PURE__ */ Dn(0);
function Py(n) {
  const i = be(n);
  return !If() || !i.visualViewport ? $T : {
    x: i.visualViewport.offsetLeft,
    y: i.visualViewport.offsetTop
  };
}
function JT(n, i, s) {
  return i === void 0 && (i = !1), !!s && i && s === be(n);
}
function $i(n, i, s, r) {
  i === void 0 && (i = !1), s === void 0 && (s = !1);
  const u = n.getBoundingClientRect(), f = td(n);
  let d = Dn(1);
  i && (r ? un(r) && (d = Qa(r)) : d = Qa(n));
  const h = JT(f, s, r) ? Py(f) : Dn(0);
  let m = (u.left + h.x) / d.x, p = (u.top + h.y) / d.y, v = u.width / d.x, y = u.height / d.y;
  if (f && r) {
    const x = be(f), S = un(r) ? be(r) : r;
    let R = x, A = bf(R);
    for (; A && S !== R; ) {
      const D = Qa(A), O = A.getBoundingClientRect(), z = cn(A), U = O.left + (A.clientLeft + parseFloat(z.paddingLeft)) * D.x, q = O.top + (A.clientTop + parseFloat(z.paddingTop)) * D.y;
      m *= D.x, p *= D.y, v *= D.x, y *= D.y, m += U, p += q, R = be(A), A = bf(R);
    }
  }
  return so({
    width: v,
    height: y,
    x: m,
    y: p
  });
}
function Ao(n, i) {
  const s = To(n).scrollLeft;
  return i ? i.left + s : $i(zn(n)).left + s;
}
function qy(n, i) {
  const s = n.getBoundingClientRect(), r = s.left + i.scrollLeft - Ao(n, s), u = s.top + i.scrollTop;
  return {
    x: r,
    y: u
  };
}
function IT(n) {
  let {
    elements: i,
    rect: s,
    offsetParent: r,
    strategy: u
  } = n;
  const f = u === "fixed", d = zn(r), h = i ? So(i.floating) : !1;
  if (r === d || h && f)
    return s;
  let m = {
    scrollLeft: 0,
    scrollTop: 0
  }, p = Dn(1);
  const v = Dn(0), y = pi(r);
  if ((y || !f) && ((es(r) !== "body" || xo(d)) && (m = To(r)), y)) {
    const S = $i(r);
    p = Qa(r), v.x = S.x + r.clientLeft, v.y = S.y + r.clientTop;
  }
  const x = d && !y && !f ? qy(d, m) : Dn(0);
  return {
    width: s.width * p.x,
    height: s.height * p.y,
    x: s.x * p.x - m.scrollLeft * p.x + v.x + x.x,
    y: s.y * p.y - m.scrollTop * p.y + v.y + x.y
  };
}
function tA(n) {
  return n.getClientRects ? Array.from(n.getClientRects()) : [];
}
function eA(n) {
  const i = To(n), s = n.ownerDocument.body, r = Mn(n.scrollWidth, n.clientWidth, s.scrollWidth, s.clientWidth), u = Mn(n.scrollHeight, n.clientHeight, s.scrollHeight, s.clientHeight);
  let f = -i.scrollLeft + Ao(n);
  const d = -i.scrollTop;
  return cn(s).direction === "rtl" && (f += Mn(n.clientWidth, s.clientWidth) - r), {
    width: r,
    height: u,
    x: f,
    y: d
  };
}
const nA = 25;
function iA(n, i, s) {
  s === void 0 && (s = "viewport");
  const r = s === "layoutViewport", u = be(n), f = zn(n), d = u.visualViewport;
  let h = f.clientWidth, m = f.clientHeight, p = 0, v = 0;
  if (d) {
    const x = !If() || i === "fixed";
    r ? x || (p = -d.offsetLeft, v = -d.offsetTop) : (h = d.width, m = d.height, x && (p = d.offsetLeft, v = d.offsetTop));
  }
  if (Ao(f) <= 0) {
    const x = f.ownerDocument, S = x.body, R = getComputedStyle(S), A = x.compatMode === "CSS1Compat" && parseFloat(R.marginLeft) + parseFloat(R.marginRight) || 0, D = Math.abs(f.clientWidth - S.clientWidth - A), O = getComputedStyle(f).scrollbarGutter === "stable both-edges" ? D / 2 : D;
    O <= nA && (h -= O);
  }
  return {
    width: h,
    height: m,
    x: p,
    y: v
  };
}
function aA(n, i) {
  const s = $i(n, !0, i === "fixed"), r = s.top + n.clientTop, u = s.left + n.clientLeft, f = Qa(n), d = n.clientWidth * f.x, h = n.clientHeight * f.y, m = u * f.x, p = r * f.y;
  return {
    width: d,
    height: h,
    x: m,
    y: p
  };
}
function Zg(n, i, s) {
  let r;
  if (i === "viewport" || i === "layoutViewport")
    r = iA(n, s, i);
  else if (i === "document")
    r = eA(zn(n));
  else if (un(i))
    r = aA(i, s);
  else {
    const u = Py(n);
    r = {
      x: i.x - u.x,
      y: i.y - u.y,
      width: i.width,
      height: i.height
    };
  }
  return so(r);
}
function sA(n, i) {
  const s = i.get(n);
  if (s)
    return s;
  let r = ml(n, [], !1).filter((h) => un(h) && es(h) !== "body"), u = null;
  const f = cn(n).position === "fixed";
  let d = f ? Wi(n) : n;
  for (; un(d) && !hl(d); ) {
    const h = cn(d), m = Jf(d), p = u ? u.position : f ? "fixed" : "";
    !m && (p === "fixed" || p === "absolute" && h.position === "static") ? r = r.filter((y) => y !== d) : u = h, d = Wi(d);
  }
  return i.set(n, r), r;
}
function lA(n) {
  let {
    element: i,
    boundary: s,
    rootBoundary: r,
    strategy: u
  } = n;
  const d = [...s === "clippingAncestors" ? So(i) ? [] : sA(i, this._c) : [].concat(s), r], h = Zg(i, d[0], u);
  let m = h.top, p = h.right, v = h.bottom, y = h.left;
  for (let x = 1; x < d.length; x++) {
    const S = Zg(i, d[x], u);
    m = Mn(S.top, m), p = fi(S.right, p), v = fi(S.bottom, v), y = Mn(S.left, y);
  }
  return {
    width: p - y,
    height: v - m,
    x: y,
    y: m
  };
}
function rA(n) {
  const {
    width: i,
    height: s
  } = Hy(n);
  return {
    width: i,
    height: s
  };
}
function oA(n, i, s) {
  const r = pi(i), u = zn(i), f = s === "fixed", d = $i(n, !0, f, i);
  let h = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const m = Dn(0);
  if ((r || !f) && ((es(i) !== "body" || xo(u)) && (h = To(i)), r)) {
    const x = $i(i, !0, f, i);
    m.x = x.x + i.clientLeft, m.y = x.y + i.clientTop;
  }
  !r && u && (m.x = Ao(u));
  const p = u && !r && !f ? qy(u, h) : Dn(0), v = d.left + h.scrollLeft - m.x - p.x, y = d.top + h.scrollTop - m.y - p.y;
  return {
    x: v,
    y,
    width: d.width,
    height: d.height
  };
}
function Kc(n) {
  return cn(n).position === "static";
}
function Qg(n, i) {
  if (!pi(n) || cn(n).position === "fixed")
    return null;
  if (i)
    return i(n);
  let s = n.offsetParent;
  return zn(n) === s && (s = s.ownerDocument.body), s;
}
function Gy(n, i) {
  const s = be(n);
  if (So(n))
    return s;
  if (!pi(n)) {
    let u = Wi(n);
    for (; u && !hl(u); ) {
      if (un(u) && !Kc(u))
        return u;
      u = Wi(u);
    }
    return s;
  }
  let r = Qg(n, i);
  for (; r && ZT(r) && Kc(r); )
    r = Qg(r, i);
  return r && hl(r) && Kc(r) && !Jf(r) ? s : r || WT(n) || s;
}
const uA = async function(n) {
  const i = this.getOffsetParent || Gy, s = this.getDimensions, r = await s(n.floating);
  return {
    reference: oA(n.reference, await i(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function cA(n) {
  return cn(n).direction === "rtl";
}
const fA = {
  convertOffsetParentRelativeRectToViewportRelativeRect: IT,
  getDocumentElement: zn,
  getClippingRect: lA,
  getOffsetParent: Gy,
  getElementRects: uA,
  getClientRects: tA,
  getDimensions: rA,
  getScale: Qa,
  isElement: un,
  isRTL: cA
};
function Yy(n, i) {
  return n.x === i.x && n.y === i.y && n.width === i.width && n.height === i.height;
}
function dA(n, i, s) {
  let r = null, u;
  const f = zn(n);
  function d() {
    var v;
    clearTimeout(u), (v = r) == null || v.disconnect(), r = null;
  }
  function h(v, y) {
    v === void 0 && (v = !1), y === void 0 && (y = 1), d();
    const x = n.getBoundingClientRect(), {
      left: S,
      top: R,
      width: A,
      height: D
    } = x;
    if (v || i(), !A || !D)
      return;
    const O = kr(R), z = kr(f.clientWidth - (S + A)), U = kr(f.clientHeight - (R + D)), q = kr(S), L = {
      rootMargin: -O + "px " + -z + "px " + -U + "px " + -q + "px",
      threshold: Mn(0, fi(1, y)) || 1
    };
    let Z = !0;
    function F(Q) {
      const W = Q[0].intersectionRatio;
      if (!Yy(x, n.getBoundingClientRect()))
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
      r = new IntersectionObserver(F, {
        ...L,
        // Handle <iframe>s
        root: f.ownerDocument
      });
    } catch {
      r = new IntersectionObserver(F, L);
    }
    r.observe(n);
  }
  const m = be(n), p = () => h(s);
  return m.addEventListener("resize", p), h(!0), () => {
    m.removeEventListener("resize", p), d();
  };
}
function hA(n, i, s, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: u = !0,
    ancestorResize: f = !0,
    elementResize: d = typeof ResizeObserver == "function",
    layoutShift: h = typeof IntersectionObserver == "function",
    animationFrame: m = !1
  } = r, p = td(n), v = u || f ? [...p ? ml(p) : [], ...i ? ml(i) : []] : [];
  v.forEach((O) => {
    u && O.addEventListener("scroll", s), f && O.addEventListener("resize", s);
  });
  const y = p && h ? dA(p, s, f) : null;
  let x = -1, S = null;
  d && (S = new ResizeObserver((O) => {
    let [z] = O;
    z && z.target === p && S && i && (S.unobserve(i), cancelAnimationFrame(x), x = requestAnimationFrame(() => {
      var U;
      (U = S) == null || U.observe(i);
    })), s();
  }), p && !m && S.observe(p), i && S.observe(i));
  let R, A = m ? $i(n) : null;
  m && D();
  function D() {
    const O = $i(n);
    A && !Yy(A, O) && s(), A = O, R = requestAnimationFrame(D);
  }
  return s(), () => {
    var O;
    v.forEach((z) => {
      u && z.removeEventListener("scroll", s), f && z.removeEventListener("resize", s);
    }), y == null || y(), (O = S) == null || O.disconnect(), S = null, m && cancelAnimationFrame(R);
  };
}
const mA = GT, pA = YT, gA = HT, vA = KT, yA = PT, Fg = kT, bA = XT, xA = (n, i, s) => {
  const r = /* @__PURE__ */ new Map(), u = s ?? {}, f = {
    ...fA,
    ...u.platform,
    _c: r
  };
  return UT(n, i, {
    ...u,
    platform: f
  });
};
var SA = typeof document < "u", TA = function() {
}, Wr = SA ? E.useLayoutEffect : TA;
function lo(n, i) {
  if (n === i)
    return !0;
  if (typeof n != typeof i)
    return !1;
  if (typeof n == "function" && n.toString() === i.toString())
    return !0;
  let s, r, u;
  if (n && i && typeof n == "object") {
    if (Array.isArray(n)) {
      if (s = n.length, s !== i.length) return !1;
      for (r = s; r-- !== 0; )
        if (!lo(n[r], i[r]))
          return !1;
      return !0;
    }
    if (u = Object.keys(n), s = u.length, s !== Object.keys(i).length)
      return !1;
    for (r = s; r-- !== 0; )
      if (!{}.hasOwnProperty.call(i, u[r]))
        return !1;
    for (r = s; r-- !== 0; ) {
      const f = u[r];
      if (!(f === "_owner" && n.$$typeof) && !lo(n[f], i[f]))
        return !1;
    }
    return !0;
  }
  return n !== n && i !== i;
}
function Xy(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Wg(n, i) {
  const s = Xy(n);
  return Math.round(i * s) / s;
}
function Zc(n) {
  const i = E.useRef(n);
  return Wr(() => {
    i.current = n;
  }), i;
}
function AA(n) {
  n === void 0 && (n = {});
  const {
    placement: i = "bottom",
    strategy: s = "absolute",
    middleware: r = [],
    platform: u,
    elements: {
      reference: f,
      floating: d
    } = {},
    transform: h = !0,
    whileElementsMounted: m,
    open: p
  } = n, [v, y] = E.useState({
    x: 0,
    y: 0,
    strategy: s,
    placement: i,
    middlewareData: {},
    isPositioned: !1
  }), [x, S] = E.useState(r);
  lo(x, r) || S(r);
  const [R, A] = E.useState(null), [D, O] = E.useState(null), z = E.useCallback((Y) => {
    Y !== L.current && (L.current = Y, A(Y));
  }, []), U = E.useCallback((Y) => {
    Y !== Z.current && (Z.current = Y, O(Y));
  }, []), q = f || R, B = d || D, L = E.useRef(null), Z = E.useRef(null), F = E.useRef(v), Q = m != null, W = Zc(m), mt = Zc(u), Rt = Zc(p), ft = E.useCallback(() => {
    if (!L.current || !Z.current)
      return;
    const Y = {
      placement: i,
      strategy: s,
      middleware: x
    };
    mt.current && (Y.platform = mt.current), xA(L.current, Z.current, Y).then((nt) => {
      const C = {
        ...nt,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: Rt.current !== !1
      };
      pt.current && !lo(F.current, C) && (F.current = C, Qi.flushSync(() => {
        y(C);
      }));
    });
  }, [x, i, s, mt, Rt]);
  Wr(() => {
    p === !1 && F.current.isPositioned && (F.current.isPositioned = !1, y((Y) => ({
      ...Y,
      isPositioned: !1
    })));
  }, [p]);
  const pt = E.useRef(!1);
  Wr(() => (pt.current = !0, () => {
    pt.current = !1;
  }), []), Wr(() => {
    if (q && (L.current = q), B && (Z.current = B), q && B) {
      if (W.current)
        return W.current(q, B, ft);
      ft();
    }
  }, [q, B, ft, W, Q]);
  const yt = E.useMemo(() => ({
    reference: L,
    floating: Z,
    setReference: z,
    setFloating: U
  }), [z, U]), P = E.useMemo(() => ({
    reference: q,
    floating: B
  }), [q, B]), $ = E.useMemo(() => {
    const Y = {
      position: s,
      left: 0,
      top: 0
    };
    if (!P.floating)
      return Y;
    const nt = Wg(P.floating, v.x), C = Wg(P.floating, v.y);
    return h ? {
      ...Y,
      transform: "translate(" + nt + "px, " + C + "px)",
      ...Xy(P.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: s,
      left: nt,
      top: C
    };
  }, [s, h, P.floating, v.x, v.y]);
  return E.useMemo(() => ({
    ...v,
    update: ft,
    refs: yt,
    elements: P,
    floatingStyles: $
  }), [v, ft, yt, P, $]);
}
const EA = (n) => {
  function i(s) {
    return {}.hasOwnProperty.call(s, "current");
  }
  return {
    name: "arrow",
    options: n,
    fn(s) {
      const {
        element: r,
        padding: u
      } = typeof n == "function" ? n(s) : n;
      return r && i(r) ? r.current != null ? Fg({
        element: r.current,
        padding: u
      }).fn(s) : {} : r ? Fg({
        element: r,
        padding: u
      }).fn(s) : {};
    }
  };
}, wA = (n, i) => {
  const s = mA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, RA = (n, i) => {
  const s = pA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, CA = (n, i) => ({
  fn: bA(n).fn,
  options: [n, i]
}), MA = (n, i) => {
  const s = gA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, DA = (n, i) => {
  const s = vA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, OA = (n, i) => {
  const s = yA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
}, NA = (n, i) => {
  const s = EA(n);
  return {
    name: s.name,
    fn: s.fn,
    options: [n, i]
  };
};
var jA = "Arrow", Ky = E.forwardRef((n, i) => {
  const { children: s, width: r = 10, height: u = 5, ...f } = n;
  return /* @__PURE__ */ T.jsx(
    xe.svg,
    {
      ...f,
      ref: i,
      width: r,
      height: u,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: n.asChild ? s : /* @__PURE__ */ T.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Ky.displayName = jA;
var _A = Ky;
function zA(n) {
  const [i, s] = E.useState(void 0);
  return Fi(() => {
    if (n) {
      s({ width: n.offsetWidth, height: n.offsetHeight });
      const r = new ResizeObserver((u) => {
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
      return r.observe(n, { box: "border-box" }), () => r.unobserve(n);
    } else
      s(void 0);
  }, [n]), i;
}
var ed = "Popper", [Zy, Qy] = Zf(ed), [VA, Fy] = Zy(ed), Wy = (n) => {
  const { __scopePopper: i, children: s } = n, [r, u] = E.useState(null);
  return /* @__PURE__ */ T.jsx(VA, { scope: i, anchor: r, onAnchorChange: u, children: s });
};
Wy.displayName = ed;
var $y = "PopperAnchor", Jy = E.forwardRef(
  (n, i) => {
    const { __scopePopper: s, virtualRef: r, ...u } = n, f = Fy($y, s), d = E.useRef(null), h = We(i, d);
    return E.useEffect(() => {
      f.onAnchorChange((r == null ? void 0 : r.current) || d.current);
    }), r ? null : /* @__PURE__ */ T.jsx(xe.div, { ...u, ref: h });
  }
);
Jy.displayName = $y;
var nd = "PopperContent", [LA, BA] = Zy(nd), Iy = E.forwardRef(
  (n, i) => {
    var zt, At, Vt, Dt, Se, Vn;
    const {
      __scopePopper: s,
      side: r = "bottom",
      sideOffset: u = 0,
      align: f = "center",
      alignOffset: d = 0,
      arrowPadding: h = 0,
      avoidCollisions: m = !0,
      collisionBoundary: p = [],
      collisionPadding: v = 0,
      sticky: y = "partial",
      hideWhenDetached: x = !1,
      updatePositionStrategy: S = "optimized",
      onPlaced: R,
      ...A
    } = n, D = Fy(nd, s), [O, z] = E.useState(null), U = We(i, (me) => z(me)), [q, B] = E.useState(null), L = zA(q), Z = (L == null ? void 0 : L.width) ?? 0, F = (L == null ? void 0 : L.height) ?? 0, Q = r + (f !== "center" ? "-" + f : ""), W = typeof v == "number" ? v : { top: 0, right: 0, bottom: 0, left: 0, ...v }, mt = Array.isArray(p) ? p : [p], Rt = mt.length > 0, ft = {
      padding: W,
      boundary: mt.filter(kA),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: Rt
    }, { refs: pt, floatingStyles: yt, placement: P, isPositioned: $, middlewareData: Y } = AA({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: Q,
      whileElementsMounted: (...me) => hA(...me, {
        animationFrame: S === "always"
      }),
      elements: {
        reference: D.anchor
      },
      middleware: [
        wA({ mainAxis: u + F, alignmentAxis: d }),
        m && RA({
          mainAxis: !0,
          crossAxis: !1,
          limiter: y === "partial" ? CA() : void 0,
          ...ft
        }),
        m && MA({ ...ft }),
        DA({
          ...ft,
          apply: ({ elements: me, rects: vi, availableWidth: ta, availableHeight: Ln }) => {
            const { width: rs, height: ea } = vi.reference, Bn = me.floating.style;
            Bn.setProperty("--radix-popper-available-width", `${ta}px`), Bn.setProperty("--radix-popper-available-height", `${Ln}px`), Bn.setProperty("--radix-popper-anchor-width", `${rs}px`), Bn.setProperty("--radix-popper-anchor-height", `${ea}px`);
          }
        }),
        q && NA({ element: q, padding: h }),
        HA({ arrowWidth: Z, arrowHeight: F }),
        x && OA({ strategy: "referenceHidden", ...ft })
      ]
    }), [nt, C] = n0(P), K = ci(R);
    Fi(() => {
      $ && (K == null || K());
    }, [$, K]);
    const lt = (zt = Y.arrow) == null ? void 0 : zt.x, at = (At = Y.arrow) == null ? void 0 : At.y, J = ((Vt = Y.arrow) == null ? void 0 : Vt.centerOffset) !== 0, [dt, ut] = E.useState();
    return Fi(() => {
      O && ut(window.getComputedStyle(O).zIndex);
    }, [O]), /* @__PURE__ */ T.jsx(
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
            (Se = Y.transformOrigin) == null ? void 0 : Se.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((Vn = Y.hide) == null ? void 0 : Vn.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: n.dir,
        children: /* @__PURE__ */ T.jsx(
          LA,
          {
            scope: s,
            placedSide: nt,
            onArrowChange: B,
            arrowX: lt,
            arrowY: at,
            shouldHideArrow: J,
            children: /* @__PURE__ */ T.jsx(
              xe.div,
              {
                "data-side": nt,
                "data-align": C,
                ...A,
                ref: U,
                style: {
                  ...A.style,
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
Iy.displayName = nd;
var t0 = "PopperArrow", UA = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, e0 = E.forwardRef(function(i, s) {
  const { __scopePopper: r, ...u } = i, f = BA(t0, r), d = UA[f.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ T.jsx(
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
        children: /* @__PURE__ */ T.jsx(
          _A,
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
e0.displayName = t0;
function kA(n) {
  return n !== null;
}
var HA = (n) => ({
  name: "transformOrigin",
  options: n,
  fn(i) {
    var D, O, z;
    const { placement: s, rects: r, middlewareData: u } = i, d = ((D = u.arrow) == null ? void 0 : D.centerOffset) !== 0, h = d ? 0 : n.arrowWidth, m = d ? 0 : n.arrowHeight, [p, v] = n0(s), y = { start: "0%", center: "50%", end: "100%" }[v], x = (((O = u.arrow) == null ? void 0 : O.x) ?? 0) + h / 2, S = (((z = u.arrow) == null ? void 0 : z.y) ?? 0) + m / 2;
    let R = "", A = "";
    return p === "bottom" ? (R = d ? y : `${x}px`, A = `${-m}px`) : p === "top" ? (R = d ? y : `${x}px`, A = `${r.floating.height + m}px`) : p === "right" ? (R = `${-m}px`, A = d ? y : `${S}px`) : p === "left" && (R = `${r.floating.width + m}px`, A = d ? y : `${S}px`), { data: { x: R, y: A } };
  }
});
function n0(n) {
  const [i, s = "center"] = n.split("-");
  return [i, s];
}
var PA = Wy, qA = Jy, GA = Iy, YA = e0, XA = "Portal", id = E.forwardRef((n, i) => {
  var h;
  const { container: s, ...r } = n, [u, f] = E.useState(!1);
  Fi(() => f(!0), []);
  const d = s || u && ((h = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : h.body);
  return d ? rT.createPortal(/* @__PURE__ */ T.jsx(xe.div, { ...r, ref: i }), d) : null;
});
id.displayName = XA;
function KA(n, i) {
  return E.useReducer((s, r) => i[s][r] ?? s, n);
}
var ns = (n) => {
  const { present: i, children: s } = n, r = ZA(i), u = typeof s == "function" ? s({ present: r.isPresent }) : E.Children.only(s), f = We(r.ref, QA(u));
  return typeof s == "function" || r.isPresent ? E.cloneElement(u, { ref: f }) : null;
};
ns.displayName = "Presence";
function ZA(n) {
  const [i, s] = E.useState(), r = E.useRef({}), u = E.useRef(n), f = E.useRef("none"), d = n ? "mounted" : "unmounted", [h, m] = KA(d, {
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
    const p = Hr(r.current);
    f.current = h === "mounted" ? p : "none";
  }, [h]), Fi(() => {
    const p = r.current, v = u.current;
    if (v !== n) {
      const x = f.current, S = Hr(p);
      n ? m("MOUNT") : S === "none" || (p == null ? void 0 : p.display) === "none" ? m("UNMOUNT") : m(v && x !== S ? "ANIMATION_OUT" : "UNMOUNT"), u.current = n;
    }
  }, [n, m]), Fi(() => {
    if (i) {
      let p;
      const v = i.ownerDocument.defaultView ?? window, y = (S) => {
        const A = Hr(r.current).includes(S.animationName);
        if (S.target === i && A && (m("ANIMATION_END"), !u.current)) {
          const D = i.style.animationFillMode;
          i.style.animationFillMode = "forwards", p = v.setTimeout(() => {
            i.style.animationFillMode === "forwards" && (i.style.animationFillMode = D);
          });
        }
      }, x = (S) => {
        S.target === i && (f.current = Hr(r.current));
      };
      return i.addEventListener("animationstart", x), i.addEventListener("animationcancel", y), i.addEventListener("animationend", y), () => {
        v.clearTimeout(p), i.removeEventListener("animationstart", x), i.removeEventListener("animationcancel", y), i.removeEventListener("animationend", y);
      };
    } else
      m("ANIMATION_END");
  }, [i, m]), {
    isPresent: ["mounted", "unmountSuspended"].includes(h),
    ref: E.useCallback((p) => {
      p && (r.current = getComputedStyle(p)), s(p);
    }, [])
  };
}
function Hr(n) {
  return (n == null ? void 0 : n.animationName) || "none";
}
function QA(n) {
  var r, u;
  let i = (r = Object.getOwnPropertyDescriptor(n.props, "ref")) == null ? void 0 : r.get, s = i && "isReactWarning" in i && i.isReactWarning;
  return s ? n.ref : (i = (u = Object.getOwnPropertyDescriptor(n, "ref")) == null ? void 0 : u.get, s = i && "isReactWarning" in i && i.isReactWarning, s ? n.props.ref : n.props.ref || n.ref);
}
function i0({
  prop: n,
  defaultProp: i,
  onChange: s = () => {
  }
}) {
  const [r, u] = FA({ defaultProp: i, onChange: s }), f = n !== void 0, d = f ? n : r, h = ci(s), m = E.useCallback(
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
function FA({
  defaultProp: n,
  onChange: i
}) {
  const s = E.useState(n), [r] = s, u = E.useRef(r), f = ci(i);
  return E.useEffect(() => {
    u.current !== r && (f(r), u.current = r);
  }, [r, u, f]), s;
}
var WA = "VisuallyHidden", a0 = E.forwardRef(
  (n, i) => /* @__PURE__ */ T.jsx(
    xe.span,
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
a0.displayName = WA;
var $A = a0, [Eo] = Zf("Tooltip", [
  Qy
]), wo = Qy(), s0 = "TooltipProvider", JA = 700, xf = "tooltip.open", [IA, ad] = Eo(s0), l0 = (n) => {
  const {
    __scopeTooltip: i,
    delayDuration: s = JA,
    skipDelayDuration: r = 300,
    disableHoverableContent: u = !1,
    children: f
  } = n, [d, h] = E.useState(!0), m = E.useRef(!1), p = E.useRef(0);
  return E.useEffect(() => {
    const v = p.current;
    return () => window.clearTimeout(v);
  }, []), /* @__PURE__ */ T.jsx(
    IA,
    {
      scope: i,
      isOpenDelayed: d,
      delayDuration: s,
      onOpen: E.useCallback(() => {
        window.clearTimeout(p.current), h(!1);
      }, []),
      onClose: E.useCallback(() => {
        window.clearTimeout(p.current), p.current = window.setTimeout(
          () => h(!0),
          r
        );
      }, [r]),
      isPointerInTransitRef: m,
      onPointerInTransitChange: E.useCallback((v) => {
        m.current = v;
      }, []),
      disableHoverableContent: u,
      children: f
    }
  );
};
l0.displayName = s0;
var Ro = "Tooltip", [tE, Al] = Eo(Ro), r0 = (n) => {
  const {
    __scopeTooltip: i,
    children: s,
    open: r,
    defaultOpen: u = !1,
    onOpenChange: f,
    disableHoverableContent: d,
    delayDuration: h
  } = n, m = ad(Ro, n.__scopeTooltip), p = wo(i), [v, y] = E.useState(null), x = Fr(), S = E.useRef(0), R = d ?? m.disableHoverableContent, A = h ?? m.delayDuration, D = E.useRef(!1), [O = !1, z] = i0({
    prop: r,
    defaultProp: u,
    onChange: (Z) => {
      Z ? (m.onOpen(), document.dispatchEvent(new CustomEvent(xf))) : m.onClose(), f == null || f(Z);
    }
  }), U = E.useMemo(() => O ? D.current ? "delayed-open" : "instant-open" : "closed", [O]), q = E.useCallback(() => {
    window.clearTimeout(S.current), S.current = 0, D.current = !1, z(!0);
  }, [z]), B = E.useCallback(() => {
    window.clearTimeout(S.current), S.current = 0, z(!1);
  }, [z]), L = E.useCallback(() => {
    window.clearTimeout(S.current), S.current = window.setTimeout(() => {
      D.current = !0, z(!0), S.current = 0;
    }, A);
  }, [A, z]);
  return E.useEffect(() => () => {
    S.current && (window.clearTimeout(S.current), S.current = 0);
  }, []), /* @__PURE__ */ T.jsx(PA, { ...p, children: /* @__PURE__ */ T.jsx(
    tE,
    {
      scope: i,
      contentId: x,
      open: O,
      stateAttribute: U,
      trigger: v,
      onTriggerChange: y,
      onTriggerEnter: E.useCallback(() => {
        m.isOpenDelayed ? L() : q();
      }, [m.isOpenDelayed, L, q]),
      onTriggerLeave: E.useCallback(() => {
        R ? B() : (window.clearTimeout(S.current), S.current = 0);
      }, [B, R]),
      onOpen: q,
      onClose: B,
      disableHoverableContent: R,
      children: s
    }
  ) });
};
r0.displayName = Ro;
var Sf = "TooltipTrigger", o0 = E.forwardRef(
  (n, i) => {
    const { __scopeTooltip: s, ...r } = n, u = Al(Sf, s), f = ad(Sf, s), d = wo(s), h = E.useRef(null), m = We(i, h, u.onTriggerChange), p = E.useRef(!1), v = E.useRef(!1), y = E.useCallback(() => p.current = !1, []);
    return E.useEffect(() => () => document.removeEventListener("pointerup", y), [y]), /* @__PURE__ */ T.jsx(qA, { asChild: !0, ...d, children: /* @__PURE__ */ T.jsx(
      xe.button,
      {
        "aria-describedby": u.open ? u.contentId : void 0,
        "data-state": u.stateAttribute,
        ...r,
        ref: m,
        onPointerMove: ye(n.onPointerMove, (x) => {
          x.pointerType !== "touch" && !v.current && !f.isPointerInTransitRef.current && (u.onTriggerEnter(), v.current = !0);
        }),
        onPointerLeave: ye(n.onPointerLeave, () => {
          u.onTriggerLeave(), v.current = !1;
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
o0.displayName = Sf;
var sd = "TooltipPortal", [eE, nE] = Eo(sd, {
  forceMount: void 0
}), u0 = (n) => {
  const { __scopeTooltip: i, forceMount: s, children: r, container: u } = n, f = Al(sd, i);
  return /* @__PURE__ */ T.jsx(eE, { scope: i, forceMount: s, children: /* @__PURE__ */ T.jsx(ns, { present: s || f.open, children: /* @__PURE__ */ T.jsx(id, { asChild: !0, container: u, children: r }) }) });
};
u0.displayName = sd;
var Wa = "TooltipContent", c0 = E.forwardRef(
  (n, i) => {
    const s = nE(Wa, n.__scopeTooltip), { forceMount: r = s.forceMount, side: u = "top", ...f } = n, d = Al(Wa, n.__scopeTooltip);
    return /* @__PURE__ */ T.jsx(ns, { present: r || d.open, children: d.disableHoverableContent ? /* @__PURE__ */ T.jsx(f0, { side: u, ...f, ref: i }) : /* @__PURE__ */ T.jsx(iE, { side: u, ...f, ref: i }) });
  }
), iE = E.forwardRef((n, i) => {
  const s = Al(Wa, n.__scopeTooltip), r = ad(Wa, n.__scopeTooltip), u = E.useRef(null), f = We(i, u), [d, h] = E.useState(null), { trigger: m, onClose: p } = s, v = u.current, { onPointerInTransitChange: y } = r, x = E.useCallback(() => {
    h(null), y(!1);
  }, [y]), S = E.useCallback(
    (R, A) => {
      const D = R.currentTarget, O = { x: R.clientX, y: R.clientY }, z = lE(O, D.getBoundingClientRect()), U = rE(O, z), q = oE(A.getBoundingClientRect()), B = cE([...U, ...q]);
      h(B), y(!0);
    },
    [y]
  );
  return E.useEffect(() => () => x(), [x]), E.useEffect(() => {
    if (m && v) {
      const R = (D) => S(D, v), A = (D) => S(D, m);
      return m.addEventListener("pointerleave", R), v.addEventListener("pointerleave", A), () => {
        m.removeEventListener("pointerleave", R), v.removeEventListener("pointerleave", A);
      };
    }
  }, [m, v, S, x]), E.useEffect(() => {
    if (d) {
      const R = (A) => {
        const D = A.target, O = { x: A.clientX, y: A.clientY }, z = (m == null ? void 0 : m.contains(D)) || (v == null ? void 0 : v.contains(D)), U = !uE(O, d);
        z ? x() : U && (x(), p());
      };
      return document.addEventListener("pointermove", R), () => document.removeEventListener("pointermove", R);
    }
  }, [m, v, d, p, x]), /* @__PURE__ */ T.jsx(f0, { ...n, ref: f });
}), [aE, sE] = Eo(Ro, { isInside: !1 }), f0 = E.forwardRef(
  (n, i) => {
    const {
      __scopeTooltip: s,
      children: r,
      "aria-label": u,
      onEscapeKeyDown: f,
      onPointerDownOutside: d,
      ...h
    } = n, m = Al(Wa, s), p = wo(s), { onClose: v } = m;
    return E.useEffect(() => (document.addEventListener(xf, v), () => document.removeEventListener(xf, v)), [v]), E.useEffect(() => {
      if (m.trigger) {
        const y = (x) => {
          const S = x.target;
          S != null && S.contains(m.trigger) && v();
        };
        return window.addEventListener("scroll", y, { capture: !0 }), () => window.removeEventListener("scroll", y, { capture: !0 });
      }
    }, [m.trigger, v]), /* @__PURE__ */ T.jsx(
      Qf,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: f,
        onPointerDownOutside: d,
        onFocusOutside: (y) => y.preventDefault(),
        onDismiss: v,
        children: /* @__PURE__ */ T.jsxs(
          GA,
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
              /* @__PURE__ */ T.jsx(jy, { children: r }),
              /* @__PURE__ */ T.jsx(aE, { scope: s, isInside: !0, children: /* @__PURE__ */ T.jsx($A, { id: m.contentId, role: "tooltip", children: u || r }) })
            ]
          }
        )
      }
    );
  }
);
c0.displayName = Wa;
var d0 = "TooltipArrow", h0 = E.forwardRef(
  (n, i) => {
    const { __scopeTooltip: s, ...r } = n, u = wo(s);
    return sE(
      d0,
      s
    ).isInside ? null : /* @__PURE__ */ T.jsx(YA, { ...u, ...r, ref: i });
  }
);
h0.displayName = d0;
function lE(n, i) {
  const s = Math.abs(i.top - n.y), r = Math.abs(i.bottom - n.y), u = Math.abs(i.right - n.x), f = Math.abs(i.left - n.x);
  switch (Math.min(s, r, u, f)) {
    case f:
      return "left";
    case u:
      return "right";
    case s:
      return "top";
    case r:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function rE(n, i, s = 5) {
  const r = [];
  switch (i) {
    case "top":
      r.push(
        { x: n.x - s, y: n.y + s },
        { x: n.x + s, y: n.y + s }
      );
      break;
    case "bottom":
      r.push(
        { x: n.x - s, y: n.y - s },
        { x: n.x + s, y: n.y - s }
      );
      break;
    case "left":
      r.push(
        { x: n.x + s, y: n.y - s },
        { x: n.x + s, y: n.y + s }
      );
      break;
    case "right":
      r.push(
        { x: n.x - s, y: n.y - s },
        { x: n.x - s, y: n.y + s }
      );
      break;
  }
  return r;
}
function oE(n) {
  const { top: i, right: s, bottom: r, left: u } = n;
  return [
    { x: u, y: i },
    { x: s, y: i },
    { x: s, y: r },
    { x: u, y: r }
  ];
}
function uE(n, i) {
  const { x: s, y: r } = n;
  let u = !1;
  for (let f = 0, d = i.length - 1; f < i.length; d = f++) {
    const h = i[f].x, m = i[f].y, p = i[d].x, v = i[d].y;
    m > r != v > r && s < (p - h) * (r - m) / (v - m) + h && (u = !u);
  }
  return u;
}
function cE(n) {
  const i = n.slice();
  return i.sort((s, r) => s.x < r.x ? -1 : s.x > r.x ? 1 : s.y < r.y ? -1 : s.y > r.y ? 1 : 0), fE(i);
}
function fE(n) {
  if (n.length <= 1) return n.slice();
  const i = [];
  for (let r = 0; r < n.length; r++) {
    const u = n[r];
    for (; i.length >= 2; ) {
      const f = i[i.length - 1], d = i[i.length - 2];
      if ((f.x - d.x) * (u.y - d.y) >= (f.y - d.y) * (u.x - d.x)) i.pop();
      else break;
    }
    i.push(u);
  }
  i.pop();
  const s = [];
  for (let r = n.length - 1; r >= 0; r--) {
    const u = n[r];
    for (; s.length >= 2; ) {
      const f = s[s.length - 1], d = s[s.length - 2];
      if ((f.x - d.x) * (u.y - d.y) >= (f.y - d.y) * (u.x - d.x)) s.pop();
      else break;
    }
    s.push(u);
  }
  return s.pop(), i.length === 1 && s.length === 1 && i[0].x === s[0].x && i[0].y === s[0].y ? i : i.concat(s);
}
var dE = l0, hE = r0, mE = o0, pE = u0, gE = c0, vE = h0;
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yE = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), m0 = (...n) => n.filter((i, s, r) => !!i && i.trim() !== "" && r.indexOf(i) === s).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var bE = {
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
const xE = E.forwardRef(
  ({
    color: n = "currentColor",
    size: i = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: r,
    className: u = "",
    children: f,
    iconNode: d,
    ...h
  }, m) => E.createElement(
    "svg",
    {
      ref: m,
      ...bE,
      width: i,
      height: i,
      stroke: n,
      strokeWidth: r ? Number(s) * 24 / Number(i) : s,
      className: m0("lucide", u),
      ...h
    },
    [
      ...d.map(([p, v]) => E.createElement(p, v)),
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
  const s = E.forwardRef(
    ({ className: r, ...u }, f) => E.createElement(xE, {
      ref: f,
      iconNode: i,
      className: m0(`lucide-${yE(n)}`, r),
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
const Ba = Gt("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SE = Gt("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tf = Gt("BookOpen", [
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
const TE = Gt("ChartNoAxesCombined", [
  ["path", { d: "M12 16v5", key: "zza2cw" }],
  ["path", { d: "M16 14v7", key: "1g90b9" }],
  ["path", { d: "M20 10v11", key: "1iqoj0" }],
  [
    "path",
    { d: "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15", key: "1fw8x9" }
  ],
  ["path", { d: "M4 18v3", key: "1yp0dc" }],
  ["path", { d: "M8 14v7", key: "n3cwzv" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AE = Gt("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const p0 = Gt("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EE = Gt("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wE = Gt("Command", [
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
const RE = Gt("FileInput", [
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
const pl = Gt("FilePenLine", [
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
const CE = Gt("History", [
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
const ME = Gt("House", [
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
const Af = Gt("LibraryBig", [
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
const ld = Gt("Network", [
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
const DE = Gt("PanelLeftClose", [
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
const OE = Gt("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NE = Gt("ScanLine", [
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
const jE = Gt("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _E = Gt("Settings2", [
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
const ro = Gt("ShieldCheck", [
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
const zE = Gt("Workflow", [
  ["rect", { width: "8", height: "8", x: "3", y: "3", rx: "2", key: "by2w9f" }],
  ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4", key: "xkn7yn" }],
  ["rect", { width: "8", height: "8", x: "13", y: "13", rx: "2", key: "1cgmvn" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VE = Gt("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), LE = [
  ["editor", "Editor rancangan", pl],
  ["analysis", "Pemeriksaan konflik", ro],
  ["simulation", "Simulasi dampak & publik", TE],
  ["gallery", "Galeri dokumen", Af],
  ["corpus", "Pustaka regulasi", Af],
  ["history", "Riwayat & review", CE],
  ["agents", "Operasi agen", zE]
];
function BE() {
  return /* @__PURE__ */ T.jsxs(dE, { delayDuration: 450, children: [
    /* @__PURE__ */ T.jsxs("div", { className: "sidebar-brand", children: [
      /* @__PURE__ */ T.jsxs("a", { className: "brand", href: "/", "aria-label": "RuleLab, halaman awal", children: [
        /* @__PURE__ */ T.jsx("span", { className: "brand-icon", "aria-hidden": "true" }),
        /* @__PURE__ */ T.jsxs("div", { children: [
          "RuleLab",
          /* @__PURE__ */ T.jsx("span", { className: "brand-edition", children: "INDONESIA" })
        ] })
      ] }),
      /* @__PURE__ */ T.jsx("button", { id: "sidebar-toggle", className: "sidebar-toggle", "data-ux": "sidebar", "aria-controls": "workspace-sidebar", "aria-expanded": "true", "aria-label": "Lipat sidebar", children: /* @__PURE__ */ T.jsx(DE, { size: 17, "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ T.jsxs("div", { className: "workspace", children: [
      /* @__PURE__ */ T.jsx("span", { className: "workspace-icon", children: "ID" }),
      /* @__PURE__ */ T.jsxs("div", { children: [
        "Workspace Indonesia",
        /* @__PURE__ */ T.jsx("small", { children: "Perancangan regulasi" })
      ] }),
      /* @__PURE__ */ T.jsx(AE, { size: 14, "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ T.jsx("div", { className: "nav-label", children: "RUANG KERJA" }),
    /* @__PURE__ */ T.jsxs("button", { className: "workspace-home-link", "data-view": "home", "aria-label": "Ringkasan workspace", children: [
      /* @__PURE__ */ T.jsx(ME, { size: 18, "aria-hidden": "true" }),
      /* @__PURE__ */ T.jsx("span", { className: "home-label", children: "Ringkasan" })
    ] }),
    /* @__PURE__ */ T.jsx("nav", { id: "nav", "aria-label": "Navigasi utama", children: LE.map(([n, i, s], r) => /* @__PURE__ */ T.jsxs("div", { className: r === 3 ? "nav-section-start" : "nav-item", children: [
      r === 3 && /* @__PURE__ */ T.jsx("div", { className: "nav-label", children: "SUMBER & AKTIVITAS" }),
      /* @__PURE__ */ T.jsxs(hE, { children: [
        /* @__PURE__ */ T.jsx(mE, { asChild: !0, children: /* @__PURE__ */ T.jsxs("button", { "data-view": n, "aria-label": i, children: [
          /* @__PURE__ */ T.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ T.jsx(s, { size: 18 }) }),
          /* @__PURE__ */ T.jsx("span", { className: "nav-title", children: i })
        ] }) }),
        /* @__PURE__ */ T.jsx(pE, { children: /* @__PURE__ */ T.jsxs(gE, { className: "fx-tooltip", side: "right", sideOffset: 12, children: [
          i,
          /* @__PURE__ */ T.jsx(vE, {})
        ] }) })
      ] })
    ] }, n)) }),
    /* @__PURE__ */ T.jsxs("div", { className: "sidebar-bottom", children: [
      /* @__PURE__ */ T.jsxs("a", { className: "settings-link", href: "/guide", target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ T.jsx(Af, { size: 17, "aria-hidden": "true" }),
        /* @__PURE__ */ T.jsx("span", { className: "settings-label", children: "Panduan pengguna" })
      ] }),
      /* @__PURE__ */ T.jsxs("div", { className: "source-badge", children: [
        /* @__PURE__ */ T.jsx("span", { className: "dot" }),
        /* @__PURE__ */ T.jsxs("div", { children: [
          "Jejak sumber tersedia",
          /* @__PURE__ */ T.jsx("small", { children: "Naskah · Pasal · Versi" })
        ] })
      ] }),
      /* @__PURE__ */ T.jsxs("button", { className: "settings-link", "data-action": "audit", "aria-label": "Audit workspace", children: [
        /* @__PURE__ */ T.jsx(NE, { size: 17, "aria-hidden": "true" }),
        /* @__PURE__ */ T.jsx("span", { className: "settings-label", children: "Audit workspace" })
      ] }),
      /* @__PURE__ */ T.jsxs("button", { id: "settings-btn", className: "settings-link", "aria-label": "Pengaturan integrasi", children: [
        /* @__PURE__ */ T.jsx(_E, { size: 17, "aria-hidden": "true" }),
        /* @__PURE__ */ T.jsx("span", { className: "settings-label", children: "Pengaturan integrasi" })
      ] }),
      /* @__PURE__ */ T.jsxs("div", { className: "sidebar-foot", children: [
        /* @__PURE__ */ T.jsx("span", { className: "workspace-icon", children: "RL" }),
        /* @__PURE__ */ T.jsxs("div", { children: [
          "RuleLab Studio",
          /* @__PURE__ */ T.jsx("small", { children: "Hackathon workspace" })
        ] })
      ] })
    ] })
  ] });
}
var Qc = "focusScope.autoFocusOnMount", Fc = "focusScope.autoFocusOnUnmount", $g = { bubbles: !1, cancelable: !0 }, UE = "FocusScope", g0 = E.forwardRef((n, i) => {
  const {
    loop: s = !1,
    trapped: r = !1,
    onMountAutoFocus: u,
    onUnmountAutoFocus: f,
    ...d
  } = n, [h, m] = E.useState(null), p = ci(u), v = ci(f), y = E.useRef(null), x = We(i, (A) => m(A)), S = E.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  E.useEffect(() => {
    if (r) {
      let A = function(U) {
        if (S.paused || !h) return;
        const q = U.target;
        h.contains(q) ? y.current = q : oi(y.current, { select: !0 });
      }, D = function(U) {
        if (S.paused || !h) return;
        const q = U.relatedTarget;
        q !== null && (h.contains(q) || oi(y.current, { select: !0 }));
      }, O = function(U) {
        if (document.activeElement === document.body)
          for (const B of U)
            B.removedNodes.length > 0 && oi(h);
      };
      document.addEventListener("focusin", A), document.addEventListener("focusout", D);
      const z = new MutationObserver(O);
      return h && z.observe(h, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", A), document.removeEventListener("focusout", D), z.disconnect();
      };
    }
  }, [r, h, S.paused]), E.useEffect(() => {
    if (h) {
      Ig.add(S);
      const A = document.activeElement;
      if (!h.contains(A)) {
        const O = new CustomEvent(Qc, $g);
        h.addEventListener(Qc, p), h.dispatchEvent(O), O.defaultPrevented || (kE(YE(v0(h)), { select: !0 }), document.activeElement === A && oi(h));
      }
      return () => {
        h.removeEventListener(Qc, p), setTimeout(() => {
          const O = new CustomEvent(Fc, $g);
          h.addEventListener(Fc, v), h.dispatchEvent(O), O.defaultPrevented || oi(A ?? document.body, { select: !0 }), h.removeEventListener(Fc, v), Ig.remove(S);
        }, 0);
      };
    }
  }, [h, p, v, S]);
  const R = E.useCallback(
    (A) => {
      if (!s && !r || S.paused) return;
      const D = A.key === "Tab" && !A.altKey && !A.ctrlKey && !A.metaKey, O = document.activeElement;
      if (D && O) {
        const z = A.currentTarget, [U, q] = HE(z);
        U && q ? !A.shiftKey && O === q ? (A.preventDefault(), s && oi(U, { select: !0 })) : A.shiftKey && O === U && (A.preventDefault(), s && oi(q, { select: !0 })) : O === z && A.preventDefault();
      }
    },
    [s, r, S.paused]
  );
  return /* @__PURE__ */ T.jsx(xe.div, { tabIndex: -1, ...d, ref: x, onKeyDown: R });
});
g0.displayName = UE;
function kE(n, { select: i = !1 } = {}) {
  const s = document.activeElement;
  for (const r of n)
    if (oi(r, { select: i }), document.activeElement !== s) return;
}
function HE(n) {
  const i = v0(n), s = Jg(i, n), r = Jg(i.reverse(), n);
  return [s, r];
}
function v0(n) {
  const i = [], s = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const u = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || u ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; s.nextNode(); ) i.push(s.currentNode);
  return i;
}
function Jg(n, i) {
  for (const s of n)
    if (!PE(s, { upTo: i })) return s;
}
function PE(n, { upTo: i }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (i !== void 0 && n === i) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function qE(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function oi(n, { select: i = !1 } = {}) {
  if (n && n.focus) {
    const s = document.activeElement;
    n.focus({ preventScroll: !0 }), n !== s && qE(n) && i && n.select();
  }
}
var Ig = GE();
function GE() {
  let n = [];
  return {
    add(i) {
      const s = n[0];
      i !== s && (s == null || s.pause()), n = tv(n, i), n.unshift(i);
    },
    remove(i) {
      var s;
      n = tv(n, i), (s = n[0]) == null || s.resume();
    }
  };
}
function tv(n, i) {
  const s = [...n], r = s.indexOf(i);
  return r !== -1 && s.splice(r, 1), s;
}
function YE(n) {
  return n.filter((i) => i.tagName !== "A");
}
var Wc = 0;
function XE() {
  E.useEffect(() => {
    const n = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", n[0] ?? ev()), document.body.insertAdjacentElement("beforeend", n[1] ?? ev()), Wc++, () => {
      Wc === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((i) => i.remove()), Wc--;
    };
  }, []);
}
function ev() {
  const n = document.createElement("span");
  return n.setAttribute("data-radix-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
var sn = function() {
  return sn = Object.assign || function(i) {
    for (var s, r = 1, u = arguments.length; r < u; r++) {
      s = arguments[r];
      for (var f in s) Object.prototype.hasOwnProperty.call(s, f) && (i[f] = s[f]);
    }
    return i;
  }, sn.apply(this, arguments);
};
function y0(n, i) {
  var s = {};
  for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && i.indexOf(r) < 0 && (s[r] = n[r]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function")
    for (var u = 0, r = Object.getOwnPropertySymbols(n); u < r.length; u++)
      i.indexOf(r[u]) < 0 && Object.prototype.propertyIsEnumerable.call(n, r[u]) && (s[r[u]] = n[r[u]]);
  return s;
}
function KE(n, i, s) {
  if (s || arguments.length === 2) for (var r = 0, u = i.length, f; r < u; r++)
    (f || !(r in i)) && (f || (f = Array.prototype.slice.call(i, 0, r)), f[r] = i[r]);
  return n.concat(f || Array.prototype.slice.call(i));
}
var $r = "right-scroll-bar-position", Jr = "width-before-scroll-bar", ZE = "with-scroll-bars-hidden", QE = "--removed-body-scroll-bar-size";
function $c(n, i) {
  return typeof n == "function" ? n(i) : n && (n.current = i), n;
}
function FE(n, i) {
  var s = E.useState(function() {
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
        set current(r) {
          var u = s.value;
          u !== r && (s.value = r, s.callback(r, u));
        }
      }
    };
  })[0];
  return s.callback = i, s.facade;
}
var WE = typeof window < "u" ? E.useLayoutEffect : E.useEffect, nv = /* @__PURE__ */ new WeakMap();
function $E(n, i) {
  var s = FE(null, function(r) {
    return n.forEach(function(u) {
      return $c(u, r);
    });
  });
  return WE(function() {
    var r = nv.get(s);
    if (r) {
      var u = new Set(r), f = new Set(n), d = s.current;
      u.forEach(function(h) {
        f.has(h) || $c(h, null);
      }), f.forEach(function(h) {
        u.has(h) || $c(h, d);
      });
    }
    nv.set(s, n);
  }, [n]), s;
}
function JE(n) {
  return n;
}
function IE(n, i) {
  i === void 0 && (i = JE);
  var s = [], r = !1, u = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return s.length ? s[s.length - 1] : n;
    },
    useMedium: function(f) {
      var d = i(f, r);
      return s.push(d), function() {
        s = s.filter(function(h) {
          return h !== d;
        });
      };
    },
    assignSyncMedium: function(f) {
      for (r = !0; s.length; ) {
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
      r = !0;
      var d = [];
      if (s.length) {
        var h = s;
        s = [], h.forEach(f), d = s;
      }
      var m = function() {
        var v = d;
        d = [], v.forEach(f);
      }, p = function() {
        return Promise.resolve().then(m);
      };
      p(), s = {
        push: function(v) {
          d.push(v), p();
        },
        filter: function(v) {
          return d = d.filter(v), s;
        }
      };
    }
  };
  return u;
}
function tw(n) {
  n === void 0 && (n = {});
  var i = IE(null);
  return i.options = sn({ async: !0, ssr: !1 }, n), i;
}
var b0 = function(n) {
  var i = n.sideCar, s = y0(n, ["sideCar"]);
  if (!i)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = i.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return E.createElement(r, sn({}, s));
};
b0.isSideCarExport = !0;
function ew(n, i) {
  return n.useMedium(i), b0;
}
var x0 = tw(), Jc = function() {
}, Co = E.forwardRef(function(n, i) {
  var s = E.useRef(null), r = E.useState({
    onScrollCapture: Jc,
    onWheelCapture: Jc,
    onTouchMoveCapture: Jc
  }), u = r[0], f = r[1], d = n.forwardProps, h = n.children, m = n.className, p = n.removeScrollBar, v = n.enabled, y = n.shards, x = n.sideCar, S = n.noRelative, R = n.noIsolation, A = n.inert, D = n.allowPinchZoom, O = n.as, z = O === void 0 ? "div" : O, U = n.gapMode, q = y0(n, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), B = x, L = $E([s, i]), Z = sn(sn({}, q), u);
  return E.createElement(
    E.Fragment,
    null,
    v && E.createElement(B, { sideCar: x0, removeScrollBar: p, shards: y, noRelative: S, noIsolation: R, inert: A, setCallbacks: f, allowPinchZoom: !!D, lockRef: s, gapMode: U }),
    d ? E.cloneElement(E.Children.only(h), sn(sn({}, Z), { ref: L })) : E.createElement(z, sn({}, Z, { className: m, ref: L }), h)
  );
});
Co.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Co.classNames = {
  fullWidth: Jr,
  zeroRight: $r
};
var nw = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function iw() {
  if (!document)
    return null;
  var n = document.createElement("style");
  n.type = "text/css";
  var i = nw();
  return i && n.setAttribute("nonce", i), n;
}
function aw(n, i) {
  n.styleSheet ? n.styleSheet.cssText = i : n.appendChild(document.createTextNode(i));
}
function sw(n) {
  var i = document.head || document.getElementsByTagName("head")[0];
  i.appendChild(n);
}
var lw = function() {
  var n = 0, i = null;
  return {
    add: function(s) {
      n == 0 && (i = iw()) && (aw(i, s), sw(i)), n++;
    },
    remove: function() {
      n--, !n && i && (i.parentNode && i.parentNode.removeChild(i), i = null);
    }
  };
}, rw = function() {
  var n = lw();
  return function(i, s) {
    E.useEffect(function() {
      return n.add(i), function() {
        n.remove();
      };
    }, [i && s]);
  };
}, S0 = function() {
  var n = rw(), i = function(s) {
    var r = s.styles, u = s.dynamic;
    return n(r, u), null;
  };
  return i;
}, ow = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Ic = function(n) {
  return parseInt(n || "", 10) || 0;
}, uw = function(n) {
  var i = window.getComputedStyle(document.body), s = i[n === "padding" ? "paddingLeft" : "marginLeft"], r = i[n === "padding" ? "paddingTop" : "marginTop"], u = i[n === "padding" ? "paddingRight" : "marginRight"];
  return [Ic(s), Ic(r), Ic(u)];
}, cw = function(n) {
  if (n === void 0 && (n = "margin"), typeof window > "u")
    return ow;
  var i = uw(n), s = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: i[0],
    top: i[1],
    right: i[2],
    gap: Math.max(0, r - s + i[2] - i[0])
  };
}, fw = S0(), Fa = "data-scroll-locked", dw = function(n, i, s, r) {
  var u = n.left, f = n.top, d = n.right, h = n.gap;
  return s === void 0 && (s = "margin"), `
  .`.concat(ZE, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(h, "px ").concat(r, `;
  }
  body[`).concat(Fa, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    i && "position: relative ".concat(r, ";"),
    s === "margin" && `
    padding-left: `.concat(u, `px;
    padding-top: `).concat(f, `px;
    padding-right: `).concat(d, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(h, "px ").concat(r, `;
    `),
    s === "padding" && "padding-right: ".concat(h, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat($r, ` {
    right: `).concat(h, "px ").concat(r, `;
  }
  
  .`).concat(Jr, ` {
    margin-right: `).concat(h, "px ").concat(r, `;
  }
  
  .`).concat($r, " .").concat($r, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(Jr, " .").concat(Jr, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Fa, `] {
    `).concat(QE, ": ").concat(h, `px;
  }
`);
}, iv = function() {
  var n = parseInt(document.body.getAttribute(Fa) || "0", 10);
  return isFinite(n) ? n : 0;
}, hw = function() {
  E.useEffect(function() {
    return document.body.setAttribute(Fa, (iv() + 1).toString()), function() {
      var n = iv() - 1;
      n <= 0 ? document.body.removeAttribute(Fa) : document.body.setAttribute(Fa, n.toString());
    };
  }, []);
}, mw = function(n) {
  var i = n.noRelative, s = n.noImportant, r = n.gapMode, u = r === void 0 ? "margin" : r;
  hw();
  var f = E.useMemo(function() {
    return cw(u);
  }, [u]);
  return E.createElement(fw, { styles: dw(f, !i, u, s ? "" : "!important") });
}, Ef = !1;
if (typeof window < "u")
  try {
    var Pr = Object.defineProperty({}, "passive", {
      get: function() {
        return Ef = !0, !0;
      }
    });
    window.addEventListener("test", Pr, Pr), window.removeEventListener("test", Pr, Pr);
  } catch {
    Ef = !1;
  }
var Ua = Ef ? { passive: !1 } : !1, pw = function(n) {
  return n.tagName === "TEXTAREA";
}, T0 = function(n, i) {
  if (!(n instanceof Element))
    return !1;
  var s = window.getComputedStyle(n);
  return (
    // not-not-scrollable
    s[i] !== "hidden" && // contains scroll inside self
    !(s.overflowY === s.overflowX && !pw(n) && s[i] === "visible")
  );
}, gw = function(n) {
  return T0(n, "overflowY");
}, vw = function(n) {
  return T0(n, "overflowX");
}, av = function(n, i) {
  var s = i.ownerDocument, r = i;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var u = A0(n, r);
    if (u) {
      var f = E0(n, r), d = f[1], h = f[2];
      if (d > h)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== s.body);
  return !1;
}, yw = function(n) {
  var i = n.scrollTop, s = n.scrollHeight, r = n.clientHeight;
  return [
    i,
    s,
    r
  ];
}, bw = function(n) {
  var i = n.scrollLeft, s = n.scrollWidth, r = n.clientWidth;
  return [
    i,
    s,
    r
  ];
}, A0 = function(n, i) {
  return n === "v" ? gw(i) : vw(i);
}, E0 = function(n, i) {
  return n === "v" ? yw(i) : bw(i);
}, xw = function(n, i) {
  return n === "h" && i === "rtl" ? -1 : 1;
}, Sw = function(n, i, s, r, u) {
  var f = xw(n, window.getComputedStyle(i).direction), d = f * r, h = s.target, m = i.contains(h), p = !1, v = d > 0, y = 0, x = 0;
  do {
    if (!h)
      break;
    var S = E0(n, h), R = S[0], A = S[1], D = S[2], O = A - D - f * R;
    (R || O) && A0(n, h) && (y += O, x += R);
    var z = h.parentNode;
    h = z && z.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? z.host : z;
  } while (
    // portaled content
    !m && h !== document.body || // self content
    m && (i.contains(h) || i === h)
  );
  return (v && Math.abs(y) < 1 || !v && Math.abs(x) < 1) && (p = !0), p;
}, qr = function(n) {
  return "changedTouches" in n ? [n.changedTouches[0].clientX, n.changedTouches[0].clientY] : [0, 0];
}, sv = function(n) {
  return [n.deltaX, n.deltaY];
}, lv = function(n) {
  return n && "current" in n ? n.current : n;
}, Tw = function(n, i) {
  return n[0] === i[0] && n[1] === i[1];
}, Aw = function(n) {
  return `
  .block-interactivity-`.concat(n, ` {pointer-events: none;}
  .allow-interactivity-`).concat(n, ` {pointer-events: all;}
`);
}, Ew = 0, ka = [];
function ww(n) {
  var i = E.useRef([]), s = E.useRef([0, 0]), r = E.useRef(), u = E.useState(Ew++)[0], f = E.useState(S0)[0], d = E.useRef(n);
  E.useEffect(function() {
    d.current = n;
  }, [n]), E.useEffect(function() {
    if (n.inert) {
      document.body.classList.add("block-interactivity-".concat(u));
      var A = KE([n.lockRef.current], (n.shards || []).map(lv), !0).filter(Boolean);
      return A.forEach(function(D) {
        return D.classList.add("allow-interactivity-".concat(u));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(u)), A.forEach(function(D) {
          return D.classList.remove("allow-interactivity-".concat(u));
        });
      };
    }
  }, [n.inert, n.lockRef.current, n.shards]);
  var h = E.useCallback(function(A, D) {
    if ("touches" in A && A.touches.length === 2 || A.type === "wheel" && A.ctrlKey)
      return !d.current.allowPinchZoom;
    var O = qr(A), z = s.current, U = "deltaX" in A ? A.deltaX : z[0] - O[0], q = "deltaY" in A ? A.deltaY : z[1] - O[1], B, L = A.target, Z = Math.abs(U) > Math.abs(q) ? "h" : "v";
    if ("touches" in A && Z === "h" && L.type === "range")
      return !1;
    var F = window.getSelection(), Q = F && F.anchorNode, W = Q ? Q === L || Q.contains(L) : !1;
    if (W)
      return !1;
    var mt = av(Z, L);
    if (!mt)
      return !0;
    if (mt ? B = Z : (B = Z === "v" ? "h" : "v", mt = av(Z, L)), !mt)
      return !1;
    if (!r.current && "changedTouches" in A && (U || q) && (r.current = B), !B)
      return !0;
    var Rt = r.current || B;
    return Sw(Rt, D, A, Rt === "h" ? U : q);
  }, []), m = E.useCallback(function(A) {
    var D = A;
    if (!(!ka.length || ka[ka.length - 1] !== f)) {
      var O = "deltaY" in D ? sv(D) : qr(D), z = i.current.filter(function(B) {
        return B.name === D.type && (B.target === D.target || D.target === B.shadowParent) && Tw(B.delta, O);
      })[0];
      if (z && z.should) {
        D.cancelable && D.preventDefault();
        return;
      }
      if (!z) {
        var U = (d.current.shards || []).map(lv).filter(Boolean).filter(function(B) {
          return B.contains(D.target);
        }), q = U.length > 0 ? h(D, U[0]) : !d.current.noIsolation;
        q && D.cancelable && D.preventDefault();
      }
    }
  }, []), p = E.useCallback(function(A, D, O, z) {
    var U = { name: A, delta: D, target: O, should: z, shadowParent: Rw(O) };
    i.current.push(U), setTimeout(function() {
      i.current = i.current.filter(function(q) {
        return q !== U;
      });
    }, 1);
  }, []), v = E.useCallback(function(A) {
    s.current = qr(A), r.current = void 0;
  }, []), y = E.useCallback(function(A) {
    p(A.type, sv(A), A.target, h(A, n.lockRef.current));
  }, []), x = E.useCallback(function(A) {
    p(A.type, qr(A), A.target, h(A, n.lockRef.current));
  }, []);
  E.useEffect(function() {
    return ka.push(f), n.setCallbacks({
      onScrollCapture: y,
      onWheelCapture: y,
      onTouchMoveCapture: x
    }), document.addEventListener("wheel", m, Ua), document.addEventListener("touchmove", m, Ua), document.addEventListener("touchstart", v, Ua), function() {
      ka = ka.filter(function(A) {
        return A !== f;
      }), document.removeEventListener("wheel", m, Ua), document.removeEventListener("touchmove", m, Ua), document.removeEventListener("touchstart", v, Ua);
    };
  }, []);
  var S = n.removeScrollBar, R = n.inert;
  return E.createElement(
    E.Fragment,
    null,
    R ? E.createElement(f, { styles: Aw(u) }) : null,
    S ? E.createElement(mw, { noRelative: n.noRelative, gapMode: n.gapMode }) : null
  );
}
function Rw(n) {
  for (var i = null; n !== null; )
    n instanceof ShadowRoot && (i = n.host, n = n.host), n = n.parentNode;
  return i;
}
const Cw = ew(x0, ww);
var w0 = E.forwardRef(function(n, i) {
  return E.createElement(Co, sn({}, n, { ref: i, sideCar: Cw }));
});
w0.classNames = Co.classNames;
var Mw = function(n) {
  if (typeof document > "u")
    return null;
  var i = Array.isArray(n) ? n[0] : n;
  return i.ownerDocument.body;
}, Ha = /* @__PURE__ */ new WeakMap(), Gr = /* @__PURE__ */ new WeakMap(), Yr = {}, tf = 0, R0 = function(n) {
  return n && (n.host || R0(n.parentNode));
}, Dw = function(n, i) {
  return i.map(function(s) {
    if (n.contains(s))
      return s;
    var r = R0(s);
    return r && n.contains(r) ? r : (console.error("aria-hidden", s, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(s) {
    return !!s;
  });
}, Ow = function(n, i, s, r) {
  var u = Dw(i, Array.isArray(n) ? n : [n]);
  Yr[s] || (Yr[s] = /* @__PURE__ */ new WeakMap());
  var f = Yr[s], d = [], h = /* @__PURE__ */ new Set(), m = new Set(u), p = function(y) {
    !y || h.has(y) || (h.add(y), p(y.parentNode));
  };
  u.forEach(p);
  var v = function(y) {
    !y || m.has(y) || Array.prototype.forEach.call(y.children, function(x) {
      if (h.has(x))
        v(x);
      else
        try {
          var S = x.getAttribute(r), R = S !== null && S !== "false", A = (Ha.get(x) || 0) + 1, D = (f.get(x) || 0) + 1;
          Ha.set(x, A), f.set(x, D), d.push(x), A === 1 && R && Gr.set(x, !0), D === 1 && x.setAttribute(s, "true"), R || x.setAttribute(r, "true");
        } catch (O) {
          console.error("aria-hidden: cannot operate on ", x, O);
        }
    });
  };
  return v(i), h.clear(), tf++, function() {
    d.forEach(function(y) {
      var x = Ha.get(y) - 1, S = f.get(y) - 1;
      Ha.set(y, x), f.set(y, S), x || (Gr.has(y) || y.removeAttribute(r), Gr.delete(y)), S || y.removeAttribute(s);
    }), tf--, tf || (Ha = /* @__PURE__ */ new WeakMap(), Ha = /* @__PURE__ */ new WeakMap(), Gr = /* @__PURE__ */ new WeakMap(), Yr = {});
  };
}, Nw = function(n, i, s) {
  s === void 0 && (s = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), u = Mw(n);
  return u ? (r.push.apply(r, Array.from(u.querySelectorAll("[aria-live], script"))), Ow(r, u, s, "aria-hidden")) : function() {
    return null;
  };
}, rd = "Dialog", [C0] = Zf(rd), [jw, $e] = C0(rd), M0 = (n) => {
  const {
    __scopeDialog: i,
    children: s,
    open: r,
    defaultOpen: u,
    onOpenChange: f,
    modal: d = !0
  } = n, h = E.useRef(null), m = E.useRef(null), [p = !1, v] = i0({
    prop: r,
    defaultProp: u,
    onChange: f
  });
  return /* @__PURE__ */ T.jsx(
    jw,
    {
      scope: i,
      triggerRef: h,
      contentRef: m,
      contentId: Fr(),
      titleId: Fr(),
      descriptionId: Fr(),
      open: p,
      onOpenChange: v,
      onOpenToggle: E.useCallback(() => v((y) => !y), [v]),
      modal: d,
      children: s
    }
  );
};
M0.displayName = rd;
var D0 = "DialogTrigger", O0 = E.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...r } = n, u = $e(D0, s), f = We(i, u.triggerRef);
    return /* @__PURE__ */ T.jsx(
      xe.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": u.open,
        "aria-controls": u.contentId,
        "data-state": cd(u.open),
        ...r,
        ref: f,
        onClick: ye(n.onClick, u.onOpenToggle)
      }
    );
  }
);
O0.displayName = D0;
var od = "DialogPortal", [_w, N0] = C0(od, {
  forceMount: void 0
}), j0 = (n) => {
  const { __scopeDialog: i, forceMount: s, children: r, container: u } = n, f = $e(od, i);
  return /* @__PURE__ */ T.jsx(_w, { scope: i, forceMount: s, children: E.Children.map(r, (d) => /* @__PURE__ */ T.jsx(ns, { present: s || f.open, children: /* @__PURE__ */ T.jsx(id, { asChild: !0, container: u, children: d }) })) });
};
j0.displayName = od;
var oo = "DialogOverlay", _0 = E.forwardRef(
  (n, i) => {
    const s = N0(oo, n.__scopeDialog), { forceMount: r = s.forceMount, ...u } = n, f = $e(oo, n.__scopeDialog);
    return f.modal ? /* @__PURE__ */ T.jsx(ns, { present: r || f.open, children: /* @__PURE__ */ T.jsx(zw, { ...u, ref: i }) }) : null;
  }
);
_0.displayName = oo;
var zw = E.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...r } = n, u = $e(oo, s);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ T.jsx(w0, { as: yo, allowPinchZoom: !0, shards: [u.contentRef], children: /* @__PURE__ */ T.jsx(
        xe.div,
        {
          "data-state": cd(u.open),
          ...r,
          ref: i,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), Ji = "DialogContent", z0 = E.forwardRef(
  (n, i) => {
    const s = N0(Ji, n.__scopeDialog), { forceMount: r = s.forceMount, ...u } = n, f = $e(Ji, n.__scopeDialog);
    return /* @__PURE__ */ T.jsx(ns, { present: r || f.open, children: f.modal ? /* @__PURE__ */ T.jsx(Vw, { ...u, ref: i }) : /* @__PURE__ */ T.jsx(Lw, { ...u, ref: i }) });
  }
);
z0.displayName = Ji;
var Vw = E.forwardRef(
  (n, i) => {
    const s = $e(Ji, n.__scopeDialog), r = E.useRef(null), u = We(i, s.contentRef, r);
    return E.useEffect(() => {
      const f = r.current;
      if (f) return Nw(f);
    }, []), /* @__PURE__ */ T.jsx(
      V0,
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
), Lw = E.forwardRef(
  (n, i) => {
    const s = $e(Ji, n.__scopeDialog), r = E.useRef(!1), u = E.useRef(!1);
    return /* @__PURE__ */ T.jsx(
      V0,
      {
        ...n,
        ref: i,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (f) => {
          var d, h;
          (d = n.onCloseAutoFocus) == null || d.call(n, f), f.defaultPrevented || (r.current || (h = s.triggerRef.current) == null || h.focus(), f.preventDefault()), r.current = !1, u.current = !1;
        },
        onInteractOutside: (f) => {
          var m, p;
          (m = n.onInteractOutside) == null || m.call(n, f), f.defaultPrevented || (r.current = !0, f.detail.originalEvent.type === "pointerdown" && (u.current = !0));
          const d = f.target;
          ((p = s.triggerRef.current) == null ? void 0 : p.contains(d)) && f.preventDefault(), f.detail.originalEvent.type === "focusin" && u.current && f.preventDefault();
        }
      }
    );
  }
), V0 = E.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, trapFocus: r, onOpenAutoFocus: u, onCloseAutoFocus: f, ...d } = n, h = $e(Ji, s), m = E.useRef(null), p = We(i, m);
    return XE(), /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
      /* @__PURE__ */ T.jsx(
        g0,
        {
          asChild: !0,
          loop: !0,
          trapped: r,
          onMountAutoFocus: u,
          onUnmountAutoFocus: f,
          children: /* @__PURE__ */ T.jsx(
            Qf,
            {
              role: "dialog",
              id: h.contentId,
              "aria-describedby": h.descriptionId,
              "aria-labelledby": h.titleId,
              "data-state": cd(h.open),
              ...d,
              ref: p,
              onDismiss: () => h.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
        /* @__PURE__ */ T.jsx(Bw, { titleId: h.titleId }),
        /* @__PURE__ */ T.jsx(kw, { contentRef: m, descriptionId: h.descriptionId })
      ] })
    ] });
  }
), ud = "DialogTitle", L0 = E.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...r } = n, u = $e(ud, s);
    return /* @__PURE__ */ T.jsx(xe.h2, { id: u.titleId, ...r, ref: i });
  }
);
L0.displayName = ud;
var B0 = "DialogDescription", U0 = E.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...r } = n, u = $e(B0, s);
    return /* @__PURE__ */ T.jsx(xe.p, { id: u.descriptionId, ...r, ref: i });
  }
);
U0.displayName = B0;
var k0 = "DialogClose", H0 = E.forwardRef(
  (n, i) => {
    const { __scopeDialog: s, ...r } = n, u = $e(k0, s);
    return /* @__PURE__ */ T.jsx(
      xe.button,
      {
        type: "button",
        ...r,
        ref: i,
        onClick: ye(n.onClick, () => u.onOpenChange(!1))
      }
    );
  }
);
H0.displayName = k0;
function cd(n) {
  return n ? "open" : "closed";
}
var P0 = "DialogTitleWarning", [bO, q0] = cT(P0, {
  contentName: Ji,
  titleName: ud,
  docsSlug: "dialog"
}), Bw = ({ titleId: n }) => {
  const i = q0(P0), s = `\`${i.contentName}\` requires a \`${i.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${i.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${i.docsSlug}`;
  return E.useEffect(() => {
    n && (document.getElementById(n) || console.error(s));
  }, [s, n]), null;
}, Uw = "DialogDescriptionWarning", kw = ({ contentRef: n, descriptionId: i }) => {
  const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${q0(Uw).contentName}}.`;
  return E.useEffect(() => {
    var f;
    const u = (f = n.current) == null ? void 0 : f.getAttribute("aria-describedby");
    i && u && (document.getElementById(i) || console.warn(r));
  }, [r, n, i]), null;
}, Hw = M0, Pw = O0, qw = j0, Gw = _0, Yw = z0, Xw = L0, Kw = U0, Zw = H0;
function G0(n) {
  var i, s, r = "";
  if (typeof n == "string" || typeof n == "number") r += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var u = n.length;
    for (i = 0; i < u; i++) n[i] && (s = G0(n[i])) && (r && (r += " "), r += s);
  } else for (s in n) n[s] && (r && (r += " "), r += s);
  return r;
}
function Y0() {
  for (var n, i, s = 0, r = "", u = arguments.length; s < u; s++) (n = arguments[s]) && (i = G0(n)) && (r && (r += " "), r += i);
  return r;
}
const rv = (n) => typeof n == "boolean" ? `${n}` : n === 0 ? "0" : n, ov = Y0, Qw = (n, i) => (s) => {
  var r;
  if ((i == null ? void 0 : i.variants) == null) return ov(n, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
  const { variants: u, defaultVariants: f } = i, d = Object.keys(u).map((p) => {
    const v = s == null ? void 0 : s[p], y = f == null ? void 0 : f[p];
    if (v === null) return null;
    const x = rv(v) || rv(y);
    return u[p][x];
  }), h = s && Object.entries(s).reduce((p, v) => {
    let [y, x] = v;
    return x === void 0 || (p[y] = x), p;
  }, {}), m = i == null || (r = i.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((p, v) => {
    let { class: y, className: x, ...S } = v;
    return Object.entries(S).every((R) => {
      let [A, D] = R;
      return Array.isArray(D) ? D.includes({
        ...f,
        ...h
      }[A]) : {
        ...f,
        ...h
      }[A] === D;
    }) ? [
      ...p,
      y,
      x
    ] : p;
  }, []);
  return ov(n, d, m, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
}, fd = "-", Fw = (n) => {
  const i = $w(n), {
    conflictingClassGroups: s,
    conflictingClassGroupModifiers: r
  } = n;
  return {
    getClassGroupId: (d) => {
      const h = d.split(fd);
      return h[0] === "" && h.length !== 1 && h.shift(), X0(h, i) || Ww(d);
    },
    getConflictingClassGroupIds: (d, h) => {
      const m = s[d] || [];
      return h && r[d] ? [...m, ...r[d]] : m;
    }
  };
}, X0 = (n, i) => {
  var d;
  if (n.length === 0)
    return i.classGroupId;
  const s = n[0], r = i.nextPart.get(s), u = r ? X0(n.slice(1), r) : void 0;
  if (u)
    return u;
  if (i.validators.length === 0)
    return;
  const f = n.join(fd);
  return (d = i.validators.find(({
    validator: h
  }) => h(f))) == null ? void 0 : d.classGroupId;
}, uv = /^\[(.+)\]$/, Ww = (n) => {
  if (uv.test(n)) {
    const i = uv.exec(n)[1], s = i == null ? void 0 : i.substring(0, i.indexOf(":"));
    if (s)
      return "arbitrary.." + s;
  }
}, $w = (n) => {
  const {
    theme: i,
    classGroups: s
  } = n, r = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const u in s)
    wf(s[u], r, u, i);
  return r;
}, wf = (n, i, s, r) => {
  n.forEach((u) => {
    if (typeof u == "string") {
      const f = u === "" ? i : cv(i, u);
      f.classGroupId = s;
      return;
    }
    if (typeof u == "function") {
      if (Jw(u)) {
        wf(u(r), i, s, r);
        return;
      }
      i.validators.push({
        validator: u,
        classGroupId: s
      });
      return;
    }
    Object.entries(u).forEach(([f, d]) => {
      wf(d, cv(i, f), s, r);
    });
  });
}, cv = (n, i) => {
  let s = n;
  return i.split(fd).forEach((r) => {
    s.nextPart.has(r) || s.nextPart.set(r, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), s = s.nextPart.get(r);
  }), s;
}, Jw = (n) => n.isThemeGetter, Iw = (n) => {
  if (n < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let i = 0, s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  const u = (f, d) => {
    s.set(f, d), i++, i > n && (i = 0, r = s, s = /* @__PURE__ */ new Map());
  };
  return {
    get(f) {
      let d = s.get(f);
      if (d !== void 0)
        return d;
      if ((d = r.get(f)) !== void 0)
        return u(f, d), d;
    },
    set(f, d) {
      s.has(f) ? s.set(f, d) : u(f, d);
    }
  };
}, Rf = "!", Cf = ":", t2 = Cf.length, e2 = (n) => {
  const {
    prefix: i,
    experimentalParseClassName: s
  } = n;
  let r = (u) => {
    const f = [];
    let d = 0, h = 0, m = 0, p;
    for (let R = 0; R < u.length; R++) {
      let A = u[R];
      if (d === 0 && h === 0) {
        if (A === Cf) {
          f.push(u.slice(m, R)), m = R + t2;
          continue;
        }
        if (A === "/") {
          p = R;
          continue;
        }
      }
      A === "[" ? d++ : A === "]" ? d-- : A === "(" ? h++ : A === ")" && h--;
    }
    const v = f.length === 0 ? u : u.substring(m), y = n2(v), x = y !== v, S = p && p > m ? p - m : void 0;
    return {
      modifiers: f,
      hasImportantModifier: x,
      baseClassName: y,
      maybePostfixModifierPosition: S
    };
  };
  if (i) {
    const u = i + Cf, f = r;
    r = (d) => d.startsWith(u) ? f(d.substring(u.length)) : {
      isExternal: !0,
      modifiers: [],
      hasImportantModifier: !1,
      baseClassName: d,
      maybePostfixModifierPosition: void 0
    };
  }
  if (s) {
    const u = r;
    r = (f) => s({
      className: f,
      parseClassName: u
    });
  }
  return r;
}, n2 = (n) => n.endsWith(Rf) ? n.substring(0, n.length - 1) : n.startsWith(Rf) ? n.substring(1) : n, i2 = (n) => {
  const i = Object.fromEntries(n.orderSensitiveModifiers.map((r) => [r, !0]));
  return (r) => {
    if (r.length <= 1)
      return r;
    const u = [];
    let f = [];
    return r.forEach((d) => {
      d[0] === "[" || i[d] ? (u.push(...f.sort(), d), f = []) : f.push(d);
    }), u.push(...f.sort()), u;
  };
}, a2 = (n) => ({
  cache: Iw(n.cacheSize),
  parseClassName: e2(n),
  sortModifiers: i2(n),
  ...Fw(n)
}), s2 = /\s+/, l2 = (n, i) => {
  const {
    parseClassName: s,
    getClassGroupId: r,
    getConflictingClassGroupIds: u,
    sortModifiers: f
  } = i, d = [], h = n.trim().split(s2);
  let m = "";
  for (let p = h.length - 1; p >= 0; p -= 1) {
    const v = h[p], {
      isExternal: y,
      modifiers: x,
      hasImportantModifier: S,
      baseClassName: R,
      maybePostfixModifierPosition: A
    } = s(v);
    if (y) {
      m = v + (m.length > 0 ? " " + m : m);
      continue;
    }
    let D = !!A, O = r(D ? R.substring(0, A) : R);
    if (!O) {
      if (!D) {
        m = v + (m.length > 0 ? " " + m : m);
        continue;
      }
      if (O = r(R), !O) {
        m = v + (m.length > 0 ? " " + m : m);
        continue;
      }
      D = !1;
    }
    const z = f(x).join(":"), U = S ? z + Rf : z, q = U + O;
    if (d.includes(q))
      continue;
    d.push(q);
    const B = u(O, D);
    for (let L = 0; L < B.length; ++L) {
      const Z = B[L];
      d.push(U + Z);
    }
    m = v + (m.length > 0 ? " " + m : m);
  }
  return m;
};
function r2() {
  let n = 0, i, s, r = "";
  for (; n < arguments.length; )
    (i = arguments[n++]) && (s = K0(i)) && (r && (r += " "), r += s);
  return r;
}
const K0 = (n) => {
  if (typeof n == "string")
    return n;
  let i, s = "";
  for (let r = 0; r < n.length; r++)
    n[r] && (i = K0(n[r])) && (s && (s += " "), s += i);
  return s;
};
function o2(n, ...i) {
  let s, r, u, f = d;
  function d(m) {
    const p = i.reduce((v, y) => y(v), n());
    return s = a2(p), r = s.cache.get, u = s.cache.set, f = h, h(m);
  }
  function h(m) {
    const p = r(m);
    if (p)
      return p;
    const v = l2(m, s);
    return u(m, v), v;
  }
  return function() {
    return f(r2.apply(null, arguments));
  };
}
const ee = (n) => {
  const i = (s) => s[n] || [];
  return i.isThemeGetter = !0, i;
}, Z0 = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Q0 = /^\((?:(\w[\w-]*):)?(.+)\)$/i, u2 = /^\d+\/\d+$/, c2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, f2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, d2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, h2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, m2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Pa = (n) => u2.test(n), xt = (n) => !!n && !Number.isNaN(Number(n)), Pi = (n) => !!n && Number.isInteger(Number(n)), fv = (n) => n.endsWith("%") && xt(n.slice(0, -1)), ri = (n) => c2.test(n), p2 = () => !0, g2 = (n) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  f2.test(n) && !d2.test(n)
), dd = () => !1, v2 = (n) => h2.test(n), y2 = (n) => m2.test(n), b2 = (n) => !tt(n) && !et(n), x2 = (n) => is(n, $0, dd), tt = (n) => Z0.test(n), qi = (n) => is(n, J0, g2), ef = (n) => is(n, N2, xt), S2 = (n) => is(n, F0, dd), T2 = (n) => is(n, W0, y2), A2 = (n) => is(n, dd, v2), et = (n) => Q0.test(n), Xr = (n) => as(n, J0), E2 = (n) => as(n, j2), w2 = (n) => as(n, F0), R2 = (n) => as(n, $0), C2 = (n) => as(n, W0), M2 = (n) => as(n, _2, !0), is = (n, i, s) => {
  const r = Z0.exec(n);
  return r ? r[1] ? i(r[1]) : s(r[2]) : !1;
}, as = (n, i, s = !1) => {
  const r = Q0.exec(n);
  return r ? r[1] ? i(r[1]) : s : !1;
}, F0 = (n) => n === "position", D2 = /* @__PURE__ */ new Set(["image", "url"]), W0 = (n) => D2.has(n), O2 = /* @__PURE__ */ new Set(["length", "size", "percentage"]), $0 = (n) => O2.has(n), J0 = (n) => n === "length", N2 = (n) => n === "number", j2 = (n) => n === "family-name", _2 = (n) => n === "shadow", z2 = () => {
  const n = ee("color"), i = ee("font"), s = ee("text"), r = ee("font-weight"), u = ee("tracking"), f = ee("leading"), d = ee("breakpoint"), h = ee("container"), m = ee("spacing"), p = ee("radius"), v = ee("shadow"), y = ee("inset-shadow"), x = ee("drop-shadow"), S = ee("blur"), R = ee("perspective"), A = ee("aspect"), D = ee("ease"), O = ee("animate"), z = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], U = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], q = () => ["auto", "hidden", "clip", "visible", "scroll"], B = () => ["auto", "contain", "none"], L = () => [et, tt, m], Z = () => [Pa, "full", "auto", ...L()], F = () => [Pi, "none", "subgrid", et, tt], Q = () => ["auto", {
    span: ["full", Pi, et, tt]
  }, et, tt], W = () => [Pi, "auto", et, tt], mt = () => ["auto", "min", "max", "fr", et, tt], Rt = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline"], ft = () => ["start", "end", "center", "stretch"], pt = () => ["auto", ...L()], yt = () => [Pa, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...L()], P = () => [n, et, tt], $ = () => [fv, qi], Y = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    p,
    et,
    tt
  ], nt = () => ["", xt, Xr, qi], C = () => ["solid", "dashed", "dotted", "double"], K = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], lt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    S,
    et,
    tt
  ], at = () => ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", et, tt], J = () => ["none", xt, et, tt], dt = () => ["none", xt, et, tt], ut = () => [xt, et, tt], zt = () => [Pa, "full", ...L()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [ri],
      breakpoint: [ri],
      color: [p2],
      container: [ri],
      "drop-shadow": [ri],
      ease: ["in", "out", "in-out"],
      font: [b2],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [ri],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [ri],
      shadow: [ri],
      spacing: ["px", xt],
      text: [ri],
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
        aspect: ["auto", "square", Pa, tt, et, A]
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
        overscroll: B()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": B()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": B()
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
        z: [Pi, "auto", et, tt]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Pa, "full", "auto", h, ...L()]
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
        flex: [xt, Pa, "auto", "initial", "none", tt]
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
        order: [Pi, "first", "last", "none", et, tt]
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
        text: ["base", s, Xr, qi]
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
        font: [r, et, ef]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", fv, tt]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [E2, tt, i]
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
        "line-clamp": [xt, "none", et, ef]
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
        decoration: [xt, "from-font", "auto", et, qi]
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
        bg: [...U(), w2, S2]
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
        bg: ["auto", "cover", "contain", R2, x2]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Pi, et, tt],
          radial: ["", et, tt],
          conic: [Pi, et, tt]
        }, C2, T2]
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
        outline: ["", xt, Xr, qi]
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
          M2,
          A2
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
        "ring-offset": [xt, qi]
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
        blur: lt()
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
          x,
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
        "backdrop-blur": lt()
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
        ease: ["linear", "initial", D, et, tt]
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
        stroke: [xt, Xr, qi, ef]
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
}, V2 = /* @__PURE__ */ o2(z2), L2 = (...n) => V2(Y0(n)), B2 = Qw("fx-button inline-flex items-center justify-center gap-2 rounded-xl font-semibold", {
  variants: {
    variant: { primary: "fx-button-primary", secondary: "fx-button-secondary", ghost: "fx-button-ghost" },
    size: { default: "px-4 py-2.5 text-xs", icon: "size-9 p-2", small: "px-3 py-2 text-[11px]" }
  },
  defaultVariants: { variant: "secondary", size: "default" }
}), Ye = E.forwardRef(
  ({ className: n, variant: i, size: s, asChild: r = !1, shimmer: u = !1, children: f, ...d }, h) => {
    const m = r ? yo : "button";
    return /* @__PURE__ */ T.jsx(m, { ref: h, className: L2(B2({ variant: i, size: s }), u && "fx-shimmer", n), ...d, children: f });
  }
);
Ye.displayName = "Button";
const U2 = [
  ["home", "Ringkasan workspace", "Mulai dari tujuan kebijakan"],
  ["editor", "Editor rancangan", "Susun pasal dan ekspor DOCX"],
  ["analysis", "Pemeriksaan konflik", "Telusuri sumber dan interpretasi"],
  ["simulation", "Simulasi dampak & forum publik", "Bandingkan asumsi A/B dan reaksi persona netizen AI"],
  ["corpus", "Pustaka regulasi", "Cari pasal dan dokumen resmi"],
  ["gallery", "Galeri dokumen", "Baca dokumen dan tanyakan maknanya kepada bot"],
  ["history", "Riwayat & review", "Versi dan catatan reviewer"],
  ["agents", "Operasi agen", "Eksekusi, sumber dan tool trace"]
];
function k2() {
  const [n, i] = E.useState(!1), [s, r] = E.useState(""), [u, f] = E.useState(0), d = U2.filter((m) => m.join(" ").toLowerCase().includes(s.toLowerCase())), h = (m) => {
    i(!1), requestAnimationFrame(() => {
      var p;
      return (p = document.querySelector('[data-view="' + m + '"]')) == null ? void 0 : p.click();
    });
  };
  return E.useEffect(() => {
    const m = (p) => {
      var v;
      (p.metaKey || p.ctrlKey) && p.key.toLowerCase() === "k" && !document.querySelector("dialog[open]") && !((v = document.querySelector("#main")) != null && v.inert) && (p.preventDefault(), i((y) => !y));
    };
    return document.addEventListener("keydown", m), () => document.removeEventListener("keydown", m);
  }, []), /* @__PURE__ */ T.jsxs(Hw, { open: n, onOpenChange: (m) => {
    i(m), m && (r(""), f(0));
  }, children: [
    /* @__PURE__ */ T.jsx(Pw, { asChild: !0, children: /* @__PURE__ */ T.jsxs(Ye, { className: "fx-command-trigger", size: "small", "aria-label": "Navigasi cepat", onClick: (m) => {
      var p;
      (document.querySelector("dialog[open]") || (p = document.querySelector("#main")) != null && p.inert) && m.preventDefault();
    }, children: [
      /* @__PURE__ */ T.jsx(wE, { size: 14 }),
      /* @__PURE__ */ T.jsx("span", { children: "Menu cepat" }),
      /* @__PURE__ */ T.jsx("kbd", { children: "⌘ K" })
    ] }) }),
    /* @__PURE__ */ T.jsxs(qw, { children: [
      /* @__PURE__ */ T.jsx(Gw, { className: "fx-dialog-overlay" }),
      /* @__PURE__ */ T.jsxs(Yw, { className: "fx-command-content", onOpenAutoFocus: (m) => {
        var p;
        m.preventDefault(), (p = document.getElementById("framework-command-input")) == null || p.focus();
      }, children: [
        /* @__PURE__ */ T.jsx(Xw, { className: "fx-command-title", children: "Navigasi workspace" }),
        /* @__PURE__ */ T.jsx(Kw, { className: "fx-command-description", children: "Cari menu dan lanjutkan pekerjaan. Draft yang berubah disimpan sebelum berpindah." }),
        /* @__PURE__ */ T.jsx(Zw, { className: "fx-command-close", "aria-label": "Tutup menu cepat", children: /* @__PURE__ */ T.jsx(VE, { size: 15 }) }),
        /* @__PURE__ */ T.jsxs("div", { className: "fx-command-search", children: [
          /* @__PURE__ */ T.jsx(jE, { size: 17 }),
          /* @__PURE__ */ T.jsx("input", { id: "framework-command-input", role: "combobox", "aria-controls": "framework-command-results", "aria-expanded": "true", "aria-autocomplete": "list", "aria-activedescendant": d[u] ? "framework-command-" + d[u][0] : void 0, "aria-label": "Cari menu", autoComplete: "off", placeholder: "Cari editor, simulasi, sumber…", value: s, onChange: (m) => {
            r(m.target.value), f(0);
          }, onKeyDown: (m) => {
            m.key === "ArrowDown" && (m.preventDefault(), f((p) => Math.min(d.length - 1, p + 1))), m.key === "ArrowUp" && (m.preventDefault(), f((p) => Math.max(0, p - 1))), m.key === "Enter" && d[u] && (m.preventDefault(), h(d[u][0]));
          } })
        ] }),
        /* @__PURE__ */ T.jsxs("div", { className: "fx-command-results", id: "framework-command-results", role: "listbox", "aria-label": "Menu workspace", children: [
          d.map(([m, p, v], y) => /* @__PURE__ */ T.jsxs("button", { id: "framework-command-" + m, role: "option", "aria-selected": y === u, tabIndex: -1, onClick: () => h(m), className: y === u ? "selected" : "", children: [
            /* @__PURE__ */ T.jsxs("span", { children: [
              /* @__PURE__ */ T.jsx("b", { children: p }),
              /* @__PURE__ */ T.jsx("small", { children: v })
            ] }),
            /* @__PURE__ */ T.jsx(SE, { size: 14 })
          ] }, m)),
          !d.length && /* @__PURE__ */ T.jsx("p", { children: "Tidak ada menu yang cocok. Coba istilah lain." })
        ] }),
        /* @__PURE__ */ T.jsxs("div", { className: "fx-command-footer", children: [
          /* @__PURE__ */ T.jsx("span", { children: "↑ ↓ Pilih" }),
          /* @__PURE__ */ T.jsx("span", { children: "Enter Buka" }),
          /* @__PURE__ */ T.jsx("span", { children: "Esc Tutup" })
        ] })
      ] })
    ] })
  ] });
}
const I0 = E.createContext({});
function H2(n) {
  const i = E.useRef(null);
  return i.current === null && (i.current = n()), i.current;
}
const hd = typeof window < "u", P2 = hd ? E.useLayoutEffect : E.useEffect, md = /* @__PURE__ */ E.createContext(null), tb = E.createContext({
  transformPagePoint: (n) => n,
  isStatic: !1,
  reducedMotion: "never"
});
function q2(n = !0) {
  const i = E.useContext(md);
  if (i === null)
    return [!0, null];
  const { isPresent: s, onExitComplete: r, register: u } = i, f = E.useId();
  E.useEffect(() => {
    if (n)
      return u(f);
  }, [n]);
  const d = E.useCallback(() => n && r && r(f), [f, r, n]);
  return !s && r ? [!1, d] : [!0];
}
const De = /* @__NO_SIDE_EFFECTS__ */ (n) => n;
let eb = De;
const G2 = {
  useManualTiming: !1
}, Kr = [
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
], dv = {
  value: null
};
function Y2(n, i) {
  let s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), u = !1, f = !1;
  const d = /* @__PURE__ */ new WeakSet();
  let h = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, m = 0;
  function p(y) {
    d.has(y) && (v.schedule(y), n()), m++, y(h);
  }
  const v = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (y, x = !1, S = !1) => {
      const A = S && u ? s : r;
      return x && d.add(y), A.has(y) || A.add(y), y;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (y) => {
      r.delete(y), d.delete(y);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (y) => {
      if (h = y, u) {
        f = !0;
        return;
      }
      u = !0, [s, r] = [r, s], s.forEach(p), i && dv.value && dv.value.frameloop[i].push(m), m = 0, s.clear(), u = !1, f && (f = !1, v.process(y));
    }
  };
  return v;
}
const X2 = 40;
function nb(n, i) {
  let s = !1, r = !0;
  const u = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, f = () => s = !0, d = Kr.reduce((O, z) => (O[z] = Y2(f, i ? z : void 0), O), {}), { read: h, resolveKeyframes: m, update: p, preRender: v, render: y, postRender: x } = d, S = () => {
    const O = performance.now();
    s = !1, u.delta = r ? 1e3 / 60 : Math.max(Math.min(O - u.timestamp, X2), 1), u.timestamp = O, u.isProcessing = !0, h.process(u), m.process(u), p.process(u), v.process(u), y.process(u), x.process(u), u.isProcessing = !1, s && i && (r = !1, n(S));
  }, R = () => {
    s = !0, r = !0, u.isProcessing || n(S);
  };
  return { schedule: Kr.reduce((O, z) => {
    const U = d[z];
    return O[z] = (q, B = !1, L = !1) => (s || R(), U.schedule(q, B, L)), O;
  }, {}), cancel: (O) => {
    for (let z = 0; z < Kr.length; z++)
      d[Kr[z]].cancel(O);
  }, state: u, steps: d };
}
const { schedule: _t, cancel: hi, state: se, steps: nf } = /* @__PURE__ */ nb(typeof requestAnimationFrame < "u" ? requestAnimationFrame : De, !0), ib = E.createContext({ strict: !1 }), hv = {
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
}, $a = {};
for (const n in hv)
  $a[n] = {
    isEnabled: (i) => hv[n].some((s) => !!i[s])
  };
function K2(n) {
  for (const i in n)
    $a[i] = {
      ...$a[i],
      ...n[i]
    };
}
const Z2 = /* @__PURE__ */ new Set([
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
function uo(n) {
  return n.startsWith("while") || n.startsWith("drag") && n !== "draggable" || n.startsWith("layout") || n.startsWith("onTap") || n.startsWith("onPan") || n.startsWith("onLayout") || Z2.has(n);
}
let ab = (n) => !uo(n);
function Q2(n) {
  n && (ab = (i) => i.startsWith("on") ? !uo(i) : n(i));
}
try {
  Q2(require("@emotion/is-prop-valid").default);
} catch {
}
function F2(n, i, s) {
  const r = {};
  for (const u in n)
    u === "values" && typeof n.values == "object" || (ab(u) || s === !0 && uo(u) || !i && !uo(u) || // If trying to use native HTML drag events, forward drag listeners
    n.draggable && u.startsWith("onDrag")) && (r[u] = n[u]);
  return r;
}
function W2(n) {
  if (typeof Proxy > "u")
    return n;
  const i = /* @__PURE__ */ new Map(), s = (...r) => n(...r);
  return new Proxy(s, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (r, u) => u === "create" ? n : (i.has(u) || i.set(u, n(u)), i.get(u))
  });
}
const Mo = /* @__PURE__ */ E.createContext({});
function Do(n) {
  return n !== null && typeof n == "object" && typeof n.start == "function";
}
function gl(n) {
  return typeof n == "string" || Array.isArray(n);
}
const pd = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], gd = ["initial", ...pd];
function Oo(n) {
  return Do(n.animate) || gd.some((i) => gl(n[i]));
}
function sb(n) {
  return !!(Oo(n) || n.variants);
}
function $2(n, i) {
  if (Oo(n)) {
    const { initial: s, animate: r } = n;
    return {
      initial: s === !1 || gl(s) ? s : void 0,
      animate: gl(r) ? r : void 0
    };
  }
  return n.inherit !== !1 ? i : {};
}
function J2(n) {
  const { initial: i, animate: s } = $2(n, E.useContext(Mo));
  return E.useMemo(() => ({ initial: i, animate: s }), [mv(i), mv(s)]);
}
function mv(n) {
  return Array.isArray(n) ? n.join(" ") : n;
}
const I2 = Symbol.for("motionComponentSymbol");
function qa(n) {
  return n && typeof n == "object" && Object.prototype.hasOwnProperty.call(n, "current");
}
function tR(n, i, s) {
  return E.useCallback(
    (r) => {
      r && n.onMount && n.onMount(r), i && (r ? i.mount(r) : i.unmount()), s && (typeof s == "function" ? s(r) : qa(s) && (s.current = r));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [i]
  );
}
const { schedule: vd } = /* @__PURE__ */ nb(queueMicrotask, !1), yd = (n) => n.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), eR = "framerAppearId", lb = "data-" + yd(eR), rb = E.createContext({});
function nR(n, i, s, r, u) {
  var f, d;
  const { visualElement: h } = E.useContext(Mo), m = E.useContext(ib), p = E.useContext(md), v = E.useContext(tb).reducedMotion, y = E.useRef(null);
  r = r || m.renderer, !y.current && r && (y.current = r(n, {
    visualState: i,
    parent: h,
    props: s,
    presenceContext: p,
    blockInitialAnimation: p ? p.initial === !1 : !1,
    reducedMotionConfig: v
  }));
  const x = y.current, S = E.useContext(rb);
  x && !x.projection && u && (x.type === "html" || x.type === "svg") && iR(y.current, s, u, S);
  const R = E.useRef(!1);
  E.useInsertionEffect(() => {
    x && R.current && x.update(s, p);
  });
  const A = s[lb], D = E.useRef(!!A && !(!((f = window.MotionHandoffIsComplete) === null || f === void 0) && f.call(window, A)) && ((d = window.MotionHasOptimisedAnimation) === null || d === void 0 ? void 0 : d.call(window, A)));
  return P2(() => {
    x && (R.current = !0, window.MotionIsMounted = !0, x.updateFeatures(), vd.render(x.render), D.current && x.animationState && x.animationState.animateChanges());
  }), E.useEffect(() => {
    x && (!D.current && x.animationState && x.animationState.animateChanges(), D.current && (queueMicrotask(() => {
      var O;
      (O = window.MotionHandoffMarkAsComplete) === null || O === void 0 || O.call(window, A);
    }), D.current = !1));
  }), x;
}
function iR(n, i, s, r) {
  const { layoutId: u, layout: f, drag: d, dragConstraints: h, layoutScroll: m, layoutRoot: p } = i;
  n.projection = new s(n.latestValues, i["data-framer-portal-id"] ? void 0 : ob(n.parent)), n.projection.setOptions({
    layoutId: u,
    layout: f,
    alwaysMeasureLayout: !!d || h && qa(h),
    visualElement: n,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof f == "string" ? f : "both",
    initialPromotionConfig: r,
    layoutScroll: m,
    layoutRoot: p
  });
}
function ob(n) {
  if (n)
    return n.options.allowProjection !== !1 ? n.projection : ob(n.parent);
}
function aR({ preloadedFeatures: n, createVisualElement: i, useRender: s, useVisualState: r, Component: u }) {
  var f, d;
  n && K2(n);
  function h(p, v) {
    let y;
    const x = {
      ...E.useContext(tb),
      ...p,
      layoutId: sR(p)
    }, { isStatic: S } = x, R = J2(p), A = r(p, S);
    if (!S && hd) {
      lR();
      const D = rR(x);
      y = D.MeasureLayout, R.visualElement = nR(u, A, x, i, D.ProjectionNode);
    }
    return T.jsxs(Mo.Provider, { value: R, children: [y && R.visualElement ? T.jsx(y, { visualElement: R.visualElement, ...x }) : null, s(u, p, tR(A, R.visualElement, v), A, S, R.visualElement)] });
  }
  h.displayName = `motion.${typeof u == "string" ? u : `create(${(d = (f = u.displayName) !== null && f !== void 0 ? f : u.name) !== null && d !== void 0 ? d : ""})`}`;
  const m = E.forwardRef(h);
  return m[I2] = u, m;
}
function sR({ layoutId: n }) {
  const i = E.useContext(I0).id;
  return i && n !== void 0 ? i + "-" + n : n;
}
function lR(n, i) {
  E.useContext(ib).strict;
}
function rR(n) {
  const { drag: i, layout: s } = $a;
  if (!i && !s)
    return {};
  const r = { ...i, ...s };
  return {
    MeasureLayout: i != null && i.isEnabled(n) || s != null && s.isEnabled(n) ? r.MeasureLayout : void 0,
    ProjectionNode: r.ProjectionNode
  };
}
const ub = (n) => (i) => typeof i == "string" && i.startsWith(n), bd = /* @__PURE__ */ ub("--"), oR = /* @__PURE__ */ ub("var(--"), xd = (n) => oR(n) ? uR.test(n.split("/*")[0].trim()) : !1, uR = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, vl = {};
function cR(n) {
  for (const i in n)
    vl[i] = n[i], bd(i) && (vl[i].isCSSVariable = !0);
}
const ss = [
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
], Ii = new Set(ss);
function cb(n, { layout: i, layoutId: s }) {
  return Ii.has(n) || n.startsWith("origin") || (i || s !== void 0) && (!!vl[n] || n === "opacity");
}
const ce = (n) => !!(n && n.getVelocity), fb = (n, i) => i && typeof n == "number" ? i.transform(n) : n, _n = (n, i, s) => s > i ? i : s < n ? n : s, ls = {
  test: (n) => typeof n == "number",
  parse: parseFloat,
  transform: (n) => n
}, yl = {
  ...ls,
  transform: (n) => _n(0, 1, n)
}, Zr = {
  ...ls,
  default: 1
}, El = (n) => ({
  test: (i) => typeof i == "string" && i.endsWith(n) && i.split(" ").length === 1,
  parse: parseFloat,
  transform: (i) => `${i}${n}`
}), ui = /* @__PURE__ */ El("deg"), rn = /* @__PURE__ */ El("%"), ot = /* @__PURE__ */ El("px"), fR = /* @__PURE__ */ El("vh"), dR = /* @__PURE__ */ El("vw"), pv = {
  ...rn,
  parse: (n) => rn.parse(n) / 100,
  transform: (n) => rn.transform(n * 100)
}, hR = {
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
}, mR = {
  rotate: ui,
  rotateX: ui,
  rotateY: ui,
  rotateZ: ui,
  scale: Zr,
  scaleX: Zr,
  scaleY: Zr,
  scaleZ: Zr,
  skew: ui,
  skewX: ui,
  skewY: ui,
  distance: ot,
  translateX: ot,
  translateY: ot,
  translateZ: ot,
  x: ot,
  y: ot,
  z: ot,
  perspective: ot,
  transformPerspective: ot,
  opacity: yl,
  originX: pv,
  originY: pv,
  originZ: ot
}, gv = {
  ...ls,
  transform: Math.round
}, Sd = {
  ...hR,
  ...mR,
  zIndex: gv,
  size: ot,
  // SVG
  fillOpacity: yl,
  strokeOpacity: yl,
  numOctaves: gv
}, pR = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, gR = ss.length;
function vR(n, i, s) {
  let r = "", u = !0;
  for (let f = 0; f < gR; f++) {
    const d = ss[f], h = n[d];
    if (h === void 0)
      continue;
    let m = !0;
    if (typeof h == "number" ? m = h === (d.startsWith("scale") ? 1 : 0) : m = parseFloat(h) === 0, !m || s) {
      const p = fb(h, Sd[d]);
      if (!m) {
        u = !1;
        const v = pR[d] || d;
        r += `${v}(${p}) `;
      }
      s && (i[d] = p);
    }
  }
  return r = r.trim(), s ? r = s(i, u ? "" : r) : u && (r = "none"), r;
}
function Td(n, i, s) {
  const { style: r, vars: u, transformOrigin: f } = n;
  let d = !1, h = !1;
  for (const m in i) {
    const p = i[m];
    if (Ii.has(m)) {
      d = !0;
      continue;
    } else if (bd(m)) {
      u[m] = p;
      continue;
    } else {
      const v = fb(p, Sd[m]);
      m.startsWith("origin") ? (h = !0, f[m] = v) : r[m] = v;
    }
  }
  if (i.transform || (d || s ? r.transform = vR(i, n.transform, s) : r.transform && (r.transform = "none")), h) {
    const { originX: m = "50%", originY: p = "50%", originZ: v = 0 } = f;
    r.transformOrigin = `${m} ${p} ${v}`;
  }
}
const Ad = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function db(n, i, s) {
  for (const r in i)
    !ce(i[r]) && !cb(r, s) && (n[r] = i[r]);
}
function yR({ transformTemplate: n }, i) {
  return E.useMemo(() => {
    const s = Ad();
    return Td(s, i, n), Object.assign({}, s.vars, s.style);
  }, [i]);
}
function bR(n, i) {
  const s = n.style || {}, r = {};
  return db(r, s, n), Object.assign(r, yR(n, i)), r;
}
function xR(n, i) {
  const s = {}, r = bR(n, i);
  return n.drag && n.dragListener !== !1 && (s.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = n.drag === !0 ? "none" : `pan-${n.drag === "x" ? "y" : "x"}`), n.tabIndex === void 0 && (n.onTap || n.onTapStart || n.whileTap) && (s.tabIndex = 0), s.style = r, s;
}
const SR = [
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
function Ed(n) {
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
      !!(SR.indexOf(n) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(n))
    )
  );
}
const TR = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, AR = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function ER(n, i, s = 1, r = 0, u = !0) {
  n.pathLength = 1;
  const f = u ? TR : AR;
  n[f.offset] = ot.transform(-r);
  const d = ot.transform(i), h = ot.transform(s);
  n[f.array] = `${d} ${h}`;
}
function vv(n, i, s) {
  return typeof n == "string" ? n : ot.transform(i + s * n);
}
function wR(n, i, s) {
  const r = vv(i, n.x, n.width), u = vv(s, n.y, n.height);
  return `${r} ${u}`;
}
function wd(n, {
  attrX: i,
  attrY: s,
  attrScale: r,
  originX: u,
  originY: f,
  pathLength: d,
  pathSpacing: h = 1,
  pathOffset: m = 0,
  // This is object creation, which we try to avoid per-frame.
  ...p
}, v, y) {
  if (Td(n, p, y), v) {
    n.style.viewBox && (n.attrs.viewBox = n.style.viewBox);
    return;
  }
  n.attrs = n.style, n.style = {};
  const { attrs: x, style: S, dimensions: R } = n;
  x.transform && (R && (S.transform = x.transform), delete x.transform), R && (u !== void 0 || f !== void 0 || S.transform) && (S.transformOrigin = wR(R, u !== void 0 ? u : 0.5, f !== void 0 ? f : 0.5)), i !== void 0 && (x.x = i), s !== void 0 && (x.y = s), r !== void 0 && (x.scale = r), d !== void 0 && ER(x, d, h, m, !1);
}
const hb = () => ({
  ...Ad(),
  attrs: {}
}), Rd = (n) => typeof n == "string" && n.toLowerCase() === "svg";
function RR(n, i, s, r) {
  const u = E.useMemo(() => {
    const f = hb();
    return wd(f, i, Rd(r), n.transformTemplate), {
      ...f.attrs,
      style: { ...f.style }
    };
  }, [i]);
  if (n.style) {
    const f = {};
    db(f, n.style, n), u.style = { ...f, ...u.style };
  }
  return u;
}
function CR(n = !1) {
  return (s, r, u, { latestValues: f }, d) => {
    const m = (Ed(s) ? RR : xR)(r, f, d, s), p = F2(r, typeof s == "string", n), v = s !== E.Fragment ? { ...p, ...m, ref: u } : {}, { children: y } = r, x = E.useMemo(() => ce(y) ? y.get() : y, [y]);
    return E.createElement(s, {
      ...v,
      children: x
    });
  };
}
function yv(n) {
  const i = [{}, {}];
  return n == null || n.values.forEach((s, r) => {
    i[0][r] = s.get(), i[1][r] = s.getVelocity();
  }), i;
}
function Cd(n, i, s, r) {
  if (typeof i == "function") {
    const [u, f] = yv(r);
    i = i(s !== void 0 ? s : n.custom, u, f);
  }
  if (typeof i == "string" && (i = n.variants && n.variants[i]), typeof i == "function") {
    const [u, f] = yv(r);
    i = i(s !== void 0 ? s : n.custom, u, f);
  }
  return i;
}
const Mf = (n) => Array.isArray(n), MR = (n) => !!(n && typeof n == "object" && n.mix && n.toValue), DR = (n) => Mf(n) ? n[n.length - 1] || 0 : n;
function Ir(n) {
  const i = ce(n) ? n.get() : n;
  return MR(i) ? i.toValue() : i;
}
function OR({ scrapeMotionValuesFromProps: n, createRenderState: i, onUpdate: s }, r, u, f) {
  const d = {
    latestValues: NR(r, u, f, n),
    renderState: i()
  };
  return s && (d.onMount = (h) => s({ props: r, current: h, ...d }), d.onUpdate = (h) => s(h)), d;
}
const mb = (n) => (i, s) => {
  const r = E.useContext(Mo), u = E.useContext(md), f = () => OR(n, i, r, u);
  return s ? f() : H2(f);
};
function NR(n, i, s, r) {
  const u = {}, f = r(n, {});
  for (const x in f)
    u[x] = Ir(f[x]);
  let { initial: d, animate: h } = n;
  const m = Oo(n), p = sb(n);
  i && p && !m && n.inherit !== !1 && (d === void 0 && (d = i.initial), h === void 0 && (h = i.animate));
  let v = s ? s.initial === !1 : !1;
  v = v || d === !1;
  const y = v ? h : d;
  if (y && typeof y != "boolean" && !Do(y)) {
    const x = Array.isArray(y) ? y : [y];
    for (let S = 0; S < x.length; S++) {
      const R = Cd(n, x[S]);
      if (R) {
        const { transitionEnd: A, transition: D, ...O } = R;
        for (const z in O) {
          let U = O[z];
          if (Array.isArray(U)) {
            const q = v ? U.length - 1 : 0;
            U = U[q];
          }
          U !== null && (u[z] = U);
        }
        for (const z in A)
          u[z] = A[z];
      }
    }
  }
  return u;
}
function Md(n, i, s) {
  var r;
  const { style: u } = n, f = {};
  for (const d in u)
    (ce(u[d]) || i.style && ce(i.style[d]) || cb(d, n) || ((r = s == null ? void 0 : s.getValue(d)) === null || r === void 0 ? void 0 : r.liveStyle) !== void 0) && (f[d] = u[d]);
  return f;
}
const jR = {
  useVisualState: mb({
    scrapeMotionValuesFromProps: Md,
    createRenderState: Ad
  })
};
function pb(n, i) {
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
function gb(n, { style: i, vars: s }, r, u) {
  Object.assign(n.style, i, u && u.getProjectionStyles(r));
  for (const f in s)
    n.style.setProperty(f, s[f]);
}
const vb = /* @__PURE__ */ new Set([
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
function yb(n, i, s, r) {
  gb(n, i, void 0, r);
  for (const u in i.attrs)
    n.setAttribute(vb.has(u) ? u : yd(u), i.attrs[u]);
}
function bb(n, i, s) {
  const r = Md(n, i, s);
  for (const u in n)
    if (ce(n[u]) || ce(i[u])) {
      const f = ss.indexOf(u) !== -1 ? "attr" + u.charAt(0).toUpperCase() + u.substring(1) : u;
      r[f] = n[u];
    }
  return r;
}
const bv = ["x", "y", "width", "height", "cx", "cy", "r"], _R = {
  useVisualState: mb({
    scrapeMotionValuesFromProps: bb,
    createRenderState: hb,
    onUpdate: ({ props: n, prevProps: i, current: s, renderState: r, latestValues: u }) => {
      if (!s)
        return;
      let f = !!n.drag;
      if (!f) {
        for (const h in u)
          if (Ii.has(h)) {
            f = !0;
            break;
          }
      }
      if (!f)
        return;
      let d = !i;
      if (i)
        for (let h = 0; h < bv.length; h++) {
          const m = bv[h];
          n[m] !== i[m] && (d = !0);
        }
      d && _t.read(() => {
        pb(s, r), _t.render(() => {
          wd(r, u, Rd(s.tagName), n.transformTemplate), yb(s, r);
        });
      });
    }
  })
};
function zR(n, i) {
  return function(r, { forwardMotionProps: u } = { forwardMotionProps: !1 }) {
    const d = {
      ...Ed(r) ? _R : jR,
      preloadedFeatures: n,
      useRender: CR(u),
      createVisualElement: i,
      Component: r
    };
    return aR(d);
  };
}
function bl(n, i, s) {
  const r = n.getProps();
  return Cd(r, i, s !== void 0 ? s : r.custom, n);
}
function Dd(n, i) {
  return n ? n[i] || n.default || n : void 0;
}
const xb = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...ss
]);
function Od(n, i) {
  n.indexOf(i) === -1 && n.push(i);
}
function Nd(n, i) {
  const s = n.indexOf(i);
  s > -1 && n.splice(s, 1);
}
class jd {
  constructor() {
    this.subscriptions = [];
  }
  add(i) {
    return Od(this.subscriptions, i), () => Nd(this.subscriptions, i);
  }
  notify(i, s, r) {
    const u = this.subscriptions.length;
    if (u)
      if (u === 1)
        this.subscriptions[0](i, s, r);
      else
        for (let f = 0; f < u; f++) {
          const d = this.subscriptions[f];
          d && d(i, s, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function Sb(n, i) {
  return i ? n * (1e3 / i) : 0;
}
let to;
function VR() {
  to = void 0;
}
const on = {
  now: () => (to === void 0 && on.set(se.isProcessing || G2.useManualTiming ? se.timestamp : performance.now()), to),
  set: (n) => {
    to = n, queueMicrotask(VR);
  }
}, xv = 30, LR = (n) => !isNaN(parseFloat(n));
class BR {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(i, s = {}) {
    this.version = "12.6.1", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r, u = !0) => {
      const f = on.now();
      this.updatedAt !== f && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), u && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(i), this.owner = s.owner;
  }
  setCurrent(i) {
    this.current = i, this.updatedAt = on.now(), this.canTrackVelocity === null && i !== void 0 && (this.canTrackVelocity = LR(this.current));
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
    this.events[i] || (this.events[i] = new jd());
    const r = this.events[i].add(s);
    return i === "change" ? () => {
      r(), _t.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : r;
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
  setWithVelocity(i, s, r) {
    this.set(s), this.prev = void 0, this.prevFrameValue = i, this.prevUpdatedAt = this.updatedAt - r;
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
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || i - this.updatedAt > xv)
      return 0;
    const s = Math.min(this.updatedAt - this.prevUpdatedAt, xv);
    return Sb(parseFloat(this.current) - parseFloat(this.prevFrameValue), s);
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
function xl(n, i) {
  return new BR(n, i);
}
function UR(n, i, s) {
  n.hasValue(i) ? n.getValue(i).set(s) : n.addValue(i, xl(s));
}
function kR(n, i) {
  const s = bl(n, i);
  let { transitionEnd: r = {}, transition: u = {}, ...f } = s || {};
  f = { ...f, ...r };
  for (const d in f) {
    const h = DR(f[d]);
    UR(n, d, h);
  }
}
function HR(n) {
  return !!(ce(n) && n.add);
}
function Df(n, i) {
  const s = n.getValue("willChange");
  if (HR(s))
    return s.add(i);
}
function Tb(n) {
  return n.props[lb];
}
// @__NO_SIDE_EFFECTS__
function _d(n) {
  let i;
  return () => (i === void 0 && (i = n()), i);
}
const PR = /* @__PURE__ */ _d(() => window.ScrollTimeline !== void 0);
class qR {
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
    for (let r = 0; r < this.animations.length; r++)
      this.animations[r][i] = s;
  }
  attachTimeline(i, s) {
    const r = this.animations.map((u) => {
      if (PR() && u.attachTimeline)
        return u.attachTimeline(i);
      if (typeof s == "function")
        return s(u);
    });
    return () => {
      r.forEach((u, f) => {
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
class GR extends qR {
  then(i, s) {
    return Promise.all(this.animations).then(i).catch(s);
  }
}
const On = /* @__NO_SIDE_EFFECTS__ */ (n) => n * 1e3, Nn = /* @__NO_SIDE_EFFECTS__ */ (n) => n / 1e3;
function zd(n) {
  return typeof n == "function";
}
function Sv(n, i) {
  n.timeline = i, n.onfinish = null;
}
const Vd = (n) => Array.isArray(n) && typeof n[0] == "number", YR = {
  linearEasing: void 0
};
function XR(n, i) {
  const s = /* @__PURE__ */ _d(n);
  return () => {
    var r;
    return (r = YR[i]) !== null && r !== void 0 ? r : s();
  };
}
const co = /* @__PURE__ */ XR(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Ja = /* @__NO_SIDE_EFFECTS__ */ (n, i, s) => {
  const r = i - n;
  return r === 0 ? 1 : (s - n) / r;
}, Ab = (n, i, s = 10) => {
  let r = "";
  const u = Math.max(Math.round(i / s), 2);
  for (let f = 0; f < u; f++)
    r += n(/* @__PURE__ */ Ja(0, u - 1, f)) + ", ";
  return `linear(${r.substring(0, r.length - 2)})`;
};
function Eb(n) {
  return !!(typeof n == "function" && co() || !n || typeof n == "string" && (n in Of || co()) || Vd(n) || Array.isArray(n) && n.every(Eb));
}
const rl = ([n, i, s, r]) => `cubic-bezier(${n}, ${i}, ${s}, ${r})`, Of = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ rl([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ rl([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ rl([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ rl([0.33, 1.53, 0.69, 0.99])
};
function wb(n, i) {
  if (n)
    return typeof n == "function" && co() ? Ab(n, i) : Vd(n) ? rl(n) : Array.isArray(n) ? n.map((s) => wb(s, i) || Of.easeOut) : Of[n];
}
const Rb = (n, i, s) => (((1 - 3 * s + 3 * i) * n + (3 * s - 6 * i)) * n + 3 * i) * n, KR = 1e-7, ZR = 12;
function QR(n, i, s, r, u) {
  let f, d, h = 0;
  do
    d = i + (s - i) / 2, f = Rb(d, r, u) - n, f > 0 ? s = d : i = d;
  while (Math.abs(f) > KR && ++h < ZR);
  return d;
}
function wl(n, i, s, r) {
  if (n === i && s === r)
    return De;
  const u = (f) => QR(f, 0, 1, n, s);
  return (f) => f === 0 || f === 1 ? f : Rb(u(f), i, r);
}
const Cb = (n) => (i) => i <= 0.5 ? n(2 * i) / 2 : (2 - n(2 * (1 - i))) / 2, Mb = (n) => (i) => 1 - n(1 - i), Db = /* @__PURE__ */ wl(0.33, 1.53, 0.69, 0.99), Ld = /* @__PURE__ */ Mb(Db), Ob = /* @__PURE__ */ Cb(Ld), Nb = (n) => (n *= 2) < 1 ? 0.5 * Ld(n) : 0.5 * (2 - Math.pow(2, -10 * (n - 1))), Bd = (n) => 1 - Math.sin(Math.acos(n)), jb = Mb(Bd), _b = Cb(Bd), zb = (n) => /^0[^.\s]+$/u.test(n);
function FR(n) {
  return typeof n == "number" ? n === 0 : n !== null ? n === "none" || n === "0" || zb(n) : !0;
}
const ul = (n) => Math.round(n * 1e5) / 1e5, Ud = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function WR(n) {
  return n == null;
}
const $R = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, kd = (n, i) => (s) => !!(typeof s == "string" && $R.test(s) && s.startsWith(n) || i && !WR(s) && Object.prototype.hasOwnProperty.call(s, i)), Vb = (n, i, s) => (r) => {
  if (typeof r != "string")
    return r;
  const [u, f, d, h] = r.match(Ud);
  return {
    [n]: parseFloat(u),
    [i]: parseFloat(f),
    [s]: parseFloat(d),
    alpha: h !== void 0 ? parseFloat(h) : 1
  };
}, JR = (n) => _n(0, 255, n), af = {
  ...ls,
  transform: (n) => Math.round(JR(n))
}, Xi = {
  test: /* @__PURE__ */ kd("rgb", "red"),
  parse: /* @__PURE__ */ Vb("red", "green", "blue"),
  transform: ({ red: n, green: i, blue: s, alpha: r = 1 }) => "rgba(" + af.transform(n) + ", " + af.transform(i) + ", " + af.transform(s) + ", " + ul(yl.transform(r)) + ")"
};
function IR(n) {
  let i = "", s = "", r = "", u = "";
  return n.length > 5 ? (i = n.substring(1, 3), s = n.substring(3, 5), r = n.substring(5, 7), u = n.substring(7, 9)) : (i = n.substring(1, 2), s = n.substring(2, 3), r = n.substring(3, 4), u = n.substring(4, 5), i += i, s += s, r += r, u += u), {
    red: parseInt(i, 16),
    green: parseInt(s, 16),
    blue: parseInt(r, 16),
    alpha: u ? parseInt(u, 16) / 255 : 1
  };
}
const Nf = {
  test: /* @__PURE__ */ kd("#"),
  parse: IR,
  transform: Xi.transform
}, Ga = {
  test: /* @__PURE__ */ kd("hsl", "hue"),
  parse: /* @__PURE__ */ Vb("hue", "saturation", "lightness"),
  transform: ({ hue: n, saturation: i, lightness: s, alpha: r = 1 }) => "hsla(" + Math.round(n) + ", " + rn.transform(ul(i)) + ", " + rn.transform(ul(s)) + ", " + ul(yl.transform(r)) + ")"
}, ue = {
  test: (n) => Xi.test(n) || Nf.test(n) || Ga.test(n),
  parse: (n) => Xi.test(n) ? Xi.parse(n) : Ga.test(n) ? Ga.parse(n) : Nf.parse(n),
  transform: (n) => typeof n == "string" ? n : n.hasOwnProperty("red") ? Xi.transform(n) : Ga.transform(n)
}, tC = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function eC(n) {
  var i, s;
  return isNaN(n) && typeof n == "string" && (((i = n.match(Ud)) === null || i === void 0 ? void 0 : i.length) || 0) + (((s = n.match(tC)) === null || s === void 0 ? void 0 : s.length) || 0) > 0;
}
const Lb = "number", Bb = "color", nC = "var", iC = "var(", Tv = "${}", aC = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Sl(n) {
  const i = n.toString(), s = [], r = {
    color: [],
    number: [],
    var: []
  }, u = [];
  let f = 0;
  const h = i.replace(aC, (m) => (ue.test(m) ? (r.color.push(f), u.push(Bb), s.push(ue.parse(m))) : m.startsWith(iC) ? (r.var.push(f), u.push(nC), s.push(m)) : (r.number.push(f), u.push(Lb), s.push(parseFloat(m))), ++f, Tv)).split(Tv);
  return { values: s, split: h, indexes: r, types: u };
}
function Ub(n) {
  return Sl(n).values;
}
function kb(n) {
  const { split: i, types: s } = Sl(n), r = i.length;
  return (u) => {
    let f = "";
    for (let d = 0; d < r; d++)
      if (f += i[d], u[d] !== void 0) {
        const h = s[d];
        h === Lb ? f += ul(u[d]) : h === Bb ? f += ue.transform(u[d]) : f += u[d];
      }
    return f;
  };
}
const sC = (n) => typeof n == "number" ? 0 : n;
function lC(n) {
  const i = Ub(n);
  return kb(n)(i.map(sC));
}
const mi = {
  test: eC,
  parse: Ub,
  createTransformer: kb,
  getAnimatableNone: lC
}, rC = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function oC(n) {
  const [i, s] = n.slice(0, -1).split("(");
  if (i === "drop-shadow")
    return n;
  const [r] = s.match(Ud) || [];
  if (!r)
    return n;
  const u = s.replace(r, "");
  let f = rC.has(i) ? 1 : 0;
  return r !== s && (f *= 100), i + "(" + f + u + ")";
}
const uC = /\b([a-z-]*)\(.*?\)/gu, jf = {
  ...mi,
  getAnimatableNone: (n) => {
    const i = n.match(uC);
    return i ? i.map(oC).join(" ") : n;
  }
}, cC = {
  ...Sd,
  // Color props
  color: ue,
  backgroundColor: ue,
  outlineColor: ue,
  fill: ue,
  stroke: ue,
  // Border props
  borderColor: ue,
  borderTopColor: ue,
  borderRightColor: ue,
  borderBottomColor: ue,
  borderLeftColor: ue,
  filter: jf,
  WebkitFilter: jf
}, Hb = (n) => cC[n];
function Pb(n, i) {
  let s = Hb(n);
  return s !== jf && (s = mi), s.getAnimatableNone ? s.getAnimatableNone(i) : void 0;
}
const fC = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function dC(n, i, s) {
  let r = 0, u;
  for (; r < n.length && !u; ) {
    const f = n[r];
    typeof f == "string" && !fC.has(f) && Sl(f).values.length && (u = n[r]), r++;
  }
  if (u && s)
    for (const f of i)
      n[f] = Pb(s, u);
}
const Ki = (n) => n * 180 / Math.PI, _f = (n) => {
  const i = Ki(Math.atan2(n[1], n[0]));
  return zf(i);
}, hC = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (n) => (Math.abs(n[0]) + Math.abs(n[3])) / 2,
  rotate: _f,
  rotateZ: _f,
  skewX: (n) => Ki(Math.atan(n[1])),
  skewY: (n) => Ki(Math.atan(n[2])),
  skew: (n) => (Math.abs(n[1]) + Math.abs(n[2])) / 2
}, zf = (n) => (n = n % 360, n < 0 && (n += 360), n), Av = _f, Ev = (n) => Math.sqrt(n[0] * n[0] + n[1] * n[1]), wv = (n) => Math.sqrt(n[4] * n[4] + n[5] * n[5]), mC = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Ev,
  scaleY: wv,
  scale: (n) => (Ev(n) + wv(n)) / 2,
  rotateX: (n) => zf(Ki(Math.atan2(n[6], n[5]))),
  rotateY: (n) => zf(Ki(Math.atan2(-n[2], n[0]))),
  rotateZ: Av,
  rotate: Av,
  skewX: (n) => Ki(Math.atan(n[4])),
  skewY: (n) => Ki(Math.atan(n[1])),
  skew: (n) => (Math.abs(n[1]) + Math.abs(n[4])) / 2
};
function Rv(n) {
  return n.includes("scale") ? 1 : 0;
}
function Vf(n, i) {
  if (!n || n === "none")
    return Rv(i);
  const s = n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let r, u;
  if (s)
    r = mC, u = s;
  else {
    const h = n.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    r = hC, u = h;
  }
  if (!u)
    return Rv(i);
  const f = r[i], d = u[1].split(",").map(gC);
  return typeof f == "function" ? f(d) : d[f];
}
const pC = (n, i) => {
  const { transform: s = "none" } = getComputedStyle(n);
  return Vf(s, i);
};
function gC(n) {
  return parseFloat(n.trim());
}
const Cv = (n) => n === ls || n === ot, vC = /* @__PURE__ */ new Set(["x", "y", "z"]), yC = ss.filter((n) => !vC.has(n));
function bC(n) {
  const i = [];
  return yC.forEach((s) => {
    const r = n.getValue(s);
    r !== void 0 && (i.push([s, r.get()]), r.set(s.startsWith("scale") ? 1 : 0));
  }), i;
}
const Ia = {
  // Dimensions
  width: ({ x: n }, { paddingLeft: i = "0", paddingRight: s = "0" }) => n.max - n.min - parseFloat(i) - parseFloat(s),
  height: ({ y: n }, { paddingTop: i = "0", paddingBottom: s = "0" }) => n.max - n.min - parseFloat(i) - parseFloat(s),
  top: (n, { top: i }) => parseFloat(i),
  left: (n, { left: i }) => parseFloat(i),
  bottom: ({ y: n }, { top: i }) => parseFloat(i) + (n.max - n.min),
  right: ({ x: n }, { left: i }) => parseFloat(i) + (n.max - n.min),
  // Transform
  x: (n, { transform: i }) => Vf(i, "x"),
  y: (n, { transform: i }) => Vf(i, "y")
};
Ia.translateX = Ia.x;
Ia.translateY = Ia.y;
const Zi = /* @__PURE__ */ new Set();
let Lf = !1, Bf = !1;
function qb() {
  if (Bf) {
    const n = Array.from(Zi).filter((r) => r.needsMeasurement), i = new Set(n.map((r) => r.element)), s = /* @__PURE__ */ new Map();
    i.forEach((r) => {
      const u = bC(r);
      u.length && (s.set(r, u), r.render());
    }), n.forEach((r) => r.measureInitialState()), i.forEach((r) => {
      r.render();
      const u = s.get(r);
      u && u.forEach(([f, d]) => {
        var h;
        (h = r.getValue(f)) === null || h === void 0 || h.set(d);
      });
    }), n.forEach((r) => r.measureEndState()), n.forEach((r) => {
      r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
    });
  }
  Bf = !1, Lf = !1, Zi.forEach((n) => n.complete()), Zi.clear();
}
function Gb() {
  Zi.forEach((n) => {
    n.readKeyframes(), n.needsMeasurement && (Bf = !0);
  });
}
function xC() {
  Gb(), qb();
}
class Hd {
  constructor(i, s, r, u, f, d = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...i], this.onComplete = s, this.name = r, this.motionValue = u, this.element = f, this.isAsync = d;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (Zi.add(this), Lf || (Lf = !0, _t.read(Gb), _t.resolveKeyframes(qb))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: i, name: s, element: r, motionValue: u } = this;
    for (let f = 0; f < i.length; f++)
      if (i[f] === null)
        if (f === 0) {
          const d = u == null ? void 0 : u.get(), h = i[i.length - 1];
          if (d !== void 0)
            i[0] = d;
          else if (r && s) {
            const m = r.readValue(s, h);
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
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), Zi.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, Zi.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const Yb = (n) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n), SC = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function TC(n) {
  const i = SC.exec(n);
  if (!i)
    return [,];
  const [, s, r, u] = i;
  return [`--${s ?? r}`, u];
}
function Xb(n, i, s = 1) {
  const [r, u] = TC(n);
  if (!r)
    return;
  const f = window.getComputedStyle(i).getPropertyValue(r);
  if (f) {
    const d = f.trim();
    return Yb(d) ? parseFloat(d) : d;
  }
  return xd(u) ? Xb(u, i, s + 1) : u;
}
const Kb = (n) => (i) => i.test(n), AC = {
  test: (n) => n === "auto",
  parse: (n) => n
}, Zb = [ls, ot, rn, ui, dR, fR, AC], Mv = (n) => Zb.find(Kb(n));
class Qb extends Hd {
  constructor(i, s, r, u, f) {
    super(i, s, r, u, f, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: i, element: s, name: r } = this;
    if (!s || !s.current)
      return;
    super.readKeyframes();
    for (let m = 0; m < i.length; m++) {
      let p = i[m];
      if (typeof p == "string" && (p = p.trim(), xd(p))) {
        const v = Xb(p, s.current);
        v !== void 0 && (i[m] = v), m === i.length - 1 && (this.finalKeyframe = p);
      }
    }
    if (this.resolveNoneKeyframes(), !xb.has(r) || i.length !== 2)
      return;
    const [u, f] = i, d = Mv(u), h = Mv(f);
    if (d !== h)
      if (Cv(d) && Cv(h))
        for (let m = 0; m < i.length; m++) {
          const p = i[m];
          typeof p == "string" && (i[m] = parseFloat(p));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: i, name: s } = this, r = [];
    for (let u = 0; u < i.length; u++)
      FR(i[u]) && r.push(u);
    r.length && dC(i, r, s);
  }
  measureInitialState() {
    const { element: i, unresolvedKeyframes: s, name: r } = this;
    if (!i || !i.current)
      return;
    r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Ia[r](i.measureViewportBox(), window.getComputedStyle(i.current)), s[0] = this.measuredOrigin;
    const u = s[s.length - 1];
    u !== void 0 && i.getValue(r, u).jump(u, !1);
  }
  measureEndState() {
    var i;
    const { element: s, name: r, unresolvedKeyframes: u } = this;
    if (!s || !s.current)
      return;
    const f = s.getValue(r);
    f && f.jump(this.measuredOrigin, !1);
    const d = u.length - 1, h = u[d];
    u[d] = Ia[r](s.measureViewportBox(), window.getComputedStyle(s.current)), h !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = h), !((i = this.removedTransforms) === null || i === void 0) && i.length && this.removedTransforms.forEach(([m, p]) => {
      s.getValue(m).set(p);
    }), this.resolveNoneKeyframes();
  }
}
const Dv = (n, i) => i === "zIndex" ? !1 : !!(typeof n == "number" || Array.isArray(n) || typeof n == "string" && // It's animatable if we have a string
(mi.test(n) || n === "0") && // And it contains numbers and/or colors
!n.startsWith("url("));
function EC(n) {
  const i = n[0];
  if (n.length === 1)
    return !0;
  for (let s = 0; s < n.length; s++)
    if (n[s] !== i)
      return !0;
}
function wC(n, i, s, r) {
  const u = n[0];
  if (u === null)
    return !1;
  if (i === "display" || i === "visibility")
    return !0;
  const f = n[n.length - 1], d = Dv(u, i), h = Dv(f, i);
  return !d || !h ? !1 : EC(n) || (s === "spring" || zd(s)) && r;
}
const RC = (n) => n !== null;
function No(n, { repeat: i, repeatType: s = "loop" }, r) {
  const u = n.filter(RC), f = i && s !== "loop" && i % 2 === 1 ? 0 : u.length - 1;
  return !f || r === void 0 ? u[f] : r;
}
const CC = 40;
class Fb {
  constructor({ autoplay: i = !0, delay: s = 0, type: r = "keyframes", repeat: u = 0, repeatDelay: f = 0, repeatType: d = "loop", ...h }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = on.now(), this.options = {
      autoplay: i,
      delay: s,
      type: r,
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
    return this.resolvedAt ? this.resolvedAt - this.createdAt > CC ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && xC(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(i, s) {
    this.resolvedAt = on.now(), this.hasAttemptedResolve = !0;
    const { name: r, type: u, velocity: f, delay: d, onComplete: h, onUpdate: m, isGenerator: p } = this.options;
    if (!p && !wC(i, r, u, f))
      if (d)
        this.options.duration = 0;
      else {
        m && m(No(i, this.options, s)), h && h(), this.resolveFinishedPromise();
        return;
      }
    const v = this.initPlayback(i, s);
    v !== !1 && (this._resolved = {
      keyframes: i,
      finalKeyframe: s,
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
const Uf = 2e4;
function Wb(n) {
  let i = 0;
  const s = 50;
  let r = n.next(i);
  for (; !r.done && i < Uf; )
    i += s, r = n.next(i);
  return i >= Uf ? 1 / 0 : i;
}
const Ut = (n, i, s) => n + (i - n) * s;
function sf(n, i, s) {
  return s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? n + (i - n) * 6 * s : s < 1 / 2 ? i : s < 2 / 3 ? n + (i - n) * (2 / 3 - s) * 6 : n;
}
function MC({ hue: n, saturation: i, lightness: s, alpha: r }) {
  n /= 360, i /= 100, s /= 100;
  let u = 0, f = 0, d = 0;
  if (!i)
    u = f = d = s;
  else {
    const h = s < 0.5 ? s * (1 + i) : s + i - s * i, m = 2 * s - h;
    u = sf(m, h, n + 1 / 3), f = sf(m, h, n), d = sf(m, h, n - 1 / 3);
  }
  return {
    red: Math.round(u * 255),
    green: Math.round(f * 255),
    blue: Math.round(d * 255),
    alpha: r
  };
}
function fo(n, i) {
  return (s) => s > 0 ? i : n;
}
const lf = (n, i, s) => {
  const r = n * n, u = s * (i * i - r) + r;
  return u < 0 ? 0 : Math.sqrt(u);
}, DC = [Nf, Xi, Ga], OC = (n) => DC.find((i) => i.test(n));
function Ov(n) {
  const i = OC(n);
  if (!i)
    return !1;
  let s = i.parse(n);
  return i === Ga && (s = MC(s)), s;
}
const Nv = (n, i) => {
  const s = Ov(n), r = Ov(i);
  if (!s || !r)
    return fo(n, i);
  const u = { ...s };
  return (f) => (u.red = lf(s.red, r.red, f), u.green = lf(s.green, r.green, f), u.blue = lf(s.blue, r.blue, f), u.alpha = Ut(s.alpha, r.alpha, f), Xi.transform(u));
}, NC = (n, i) => (s) => i(n(s)), Rl = (...n) => n.reduce(NC), kf = /* @__PURE__ */ new Set(["none", "hidden"]);
function jC(n, i) {
  return kf.has(n) ? (s) => s <= 0 ? n : i : (s) => s >= 1 ? i : n;
}
function _C(n, i) {
  return (s) => Ut(n, i, s);
}
function Pd(n) {
  return typeof n == "number" ? _C : typeof n == "string" ? xd(n) ? fo : ue.test(n) ? Nv : LC : Array.isArray(n) ? $b : typeof n == "object" ? ue.test(n) ? Nv : zC : fo;
}
function $b(n, i) {
  const s = [...n], r = s.length, u = n.map((f, d) => Pd(f)(f, i[d]));
  return (f) => {
    for (let d = 0; d < r; d++)
      s[d] = u[d](f);
    return s;
  };
}
function zC(n, i) {
  const s = { ...n, ...i }, r = {};
  for (const u in s)
    n[u] !== void 0 && i[u] !== void 0 && (r[u] = Pd(n[u])(n[u], i[u]));
  return (u) => {
    for (const f in r)
      s[f] = r[f](u);
    return s;
  };
}
function VC(n, i) {
  var s;
  const r = [], u = { color: 0, var: 0, number: 0 };
  for (let f = 0; f < i.values.length; f++) {
    const d = i.types[f], h = n.indexes[d][u[d]], m = (s = n.values[h]) !== null && s !== void 0 ? s : 0;
    r[f] = m, u[d]++;
  }
  return r;
}
const LC = (n, i) => {
  const s = mi.createTransformer(i), r = Sl(n), u = Sl(i);
  return r.indexes.var.length === u.indexes.var.length && r.indexes.color.length === u.indexes.color.length && r.indexes.number.length >= u.indexes.number.length ? kf.has(n) && !u.values.length || kf.has(i) && !r.values.length ? jC(n, i) : Rl($b(VC(r, u), u.values), s) : fo(n, i);
};
function Jb(n, i, s) {
  return typeof n == "number" && typeof i == "number" && typeof s == "number" ? Ut(n, i, s) : Pd(n)(n, i);
}
const BC = 5;
function Ib(n, i, s) {
  const r = Math.max(i - BC, 0);
  return Sb(s - n(r), i - r);
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
}, rf = 1e-3;
function UC({ duration: n = qt.duration, bounce: i = qt.bounce, velocity: s = qt.velocity, mass: r = qt.mass }) {
  let u, f, d = 1 - i;
  d = _n(qt.minDamping, qt.maxDamping, d), n = _n(qt.minDuration, qt.maxDuration, /* @__PURE__ */ Nn(n)), d < 1 ? (u = (p) => {
    const v = p * d, y = v * n, x = v - s, S = Hf(p, d), R = Math.exp(-y);
    return rf - x / S * R;
  }, f = (p) => {
    const y = p * d * n, x = y * s + s, S = Math.pow(d, 2) * Math.pow(p, 2) * n, R = Math.exp(-y), A = Hf(Math.pow(p, 2), d);
    return (-u(p) + rf > 0 ? -1 : 1) * ((x - S) * R) / A;
  }) : (u = (p) => {
    const v = Math.exp(-p * n), y = (p - s) * n + 1;
    return -rf + v * y;
  }, f = (p) => {
    const v = Math.exp(-p * n), y = (s - p) * (n * n);
    return v * y;
  });
  const h = 5 / n, m = HC(u, f, h);
  if (n = /* @__PURE__ */ On(n), isNaN(m))
    return {
      stiffness: qt.stiffness,
      damping: qt.damping,
      duration: n
    };
  {
    const p = Math.pow(m, 2) * r;
    return {
      stiffness: p,
      damping: d * 2 * Math.sqrt(r * p),
      duration: n
    };
  }
}
const kC = 12;
function HC(n, i, s) {
  let r = s;
  for (let u = 1; u < kC; u++)
    r = r - n(r) / i(r);
  return r;
}
function Hf(n, i) {
  return n * Math.sqrt(1 - i * i);
}
const PC = ["duration", "bounce"], qC = ["stiffness", "damping", "mass"];
function jv(n, i) {
  return i.some((s) => n[s] !== void 0);
}
function GC(n) {
  let i = {
    velocity: qt.velocity,
    stiffness: qt.stiffness,
    damping: qt.damping,
    mass: qt.mass,
    isResolvedFromDuration: !1,
    ...n
  };
  if (!jv(n, qC) && jv(n, PC))
    if (n.visualDuration) {
      const s = n.visualDuration, r = 2 * Math.PI / (s * 1.2), u = r * r, f = 2 * _n(0.05, 1, 1 - (n.bounce || 0)) * Math.sqrt(u);
      i = {
        ...i,
        mass: qt.mass,
        stiffness: u,
        damping: f
      };
    } else {
      const s = UC(n);
      i = {
        ...i,
        ...s,
        mass: qt.mass
      }, i.isResolvedFromDuration = !0;
    }
  return i;
}
function t1(n = qt.visualDuration, i = qt.bounce) {
  const s = typeof n != "object" ? {
    visualDuration: n,
    keyframes: [0, 1],
    bounce: i
  } : n;
  let { restSpeed: r, restDelta: u } = s;
  const f = s.keyframes[0], d = s.keyframes[s.keyframes.length - 1], h = { done: !1, value: f }, { stiffness: m, damping: p, mass: v, duration: y, velocity: x, isResolvedFromDuration: S } = GC({
    ...s,
    velocity: -/* @__PURE__ */ Nn(s.velocity || 0)
  }), R = x || 0, A = p / (2 * Math.sqrt(m * v)), D = d - f, O = /* @__PURE__ */ Nn(Math.sqrt(m / v)), z = Math.abs(D) < 5;
  r || (r = z ? qt.restSpeed.granular : qt.restSpeed.default), u || (u = z ? qt.restDelta.granular : qt.restDelta.default);
  let U;
  if (A < 1) {
    const B = Hf(O, A);
    U = (L) => {
      const Z = Math.exp(-A * O * L);
      return d - Z * ((R + A * O * D) / B * Math.sin(B * L) + D * Math.cos(B * L));
    };
  } else if (A === 1)
    U = (B) => d - Math.exp(-O * B) * (D + (R + O * D) * B);
  else {
    const B = O * Math.sqrt(A * A - 1);
    U = (L) => {
      const Z = Math.exp(-A * O * L), F = Math.min(B * L, 300);
      return d - Z * ((R + A * O * D) * Math.sinh(F) + B * D * Math.cosh(F)) / B;
    };
  }
  const q = {
    calculatedDuration: S && y || null,
    next: (B) => {
      const L = U(B);
      if (S)
        h.done = B >= y;
      else {
        let Z = 0;
        A < 1 && (Z = B === 0 ? /* @__PURE__ */ On(R) : Ib(U, B, L));
        const F = Math.abs(Z) <= r, Q = Math.abs(d - L) <= u;
        h.done = F && Q;
      }
      return h.value = h.done ? d : L, h;
    },
    toString: () => {
      const B = Math.min(Wb(q), Uf), L = Ab((Z) => q.next(B * Z).value, B, 30);
      return B + "ms " + L;
    }
  };
  return q;
}
function _v({ keyframes: n, velocity: i = 0, power: s = 0.8, timeConstant: r = 325, bounceDamping: u = 10, bounceStiffness: f = 500, modifyTarget: d, min: h, max: m, restDelta: p = 0.5, restSpeed: v }) {
  const y = n[0], x = {
    done: !1,
    value: y
  }, S = (F) => h !== void 0 && F < h || m !== void 0 && F > m, R = (F) => h === void 0 ? m : m === void 0 || Math.abs(h - F) < Math.abs(m - F) ? h : m;
  let A = s * i;
  const D = y + A, O = d === void 0 ? D : d(D);
  O !== D && (A = O - y);
  const z = (F) => -A * Math.exp(-F / r), U = (F) => O + z(F), q = (F) => {
    const Q = z(F), W = U(F);
    x.done = Math.abs(Q) <= p, x.value = x.done ? O : W;
  };
  let B, L;
  const Z = (F) => {
    S(x.value) && (B = F, L = t1({
      keyframes: [x.value, R(x.value)],
      velocity: Ib(U, F, x.value),
      // TODO: This should be passing * 1000
      damping: u,
      stiffness: f,
      restDelta: p,
      restSpeed: v
    }));
  };
  return Z(0), {
    calculatedDuration: null,
    next: (F) => {
      let Q = !1;
      return !L && B === void 0 && (Q = !0, q(F), Z(F)), B !== void 0 && F >= B ? L.next(F - B) : (!Q && q(F), x);
    }
  };
}
const YC = /* @__PURE__ */ wl(0.42, 0, 1, 1), XC = /* @__PURE__ */ wl(0, 0, 0.58, 1), e1 = /* @__PURE__ */ wl(0.42, 0, 0.58, 1), KC = (n) => Array.isArray(n) && typeof n[0] != "number", ZC = {
  linear: De,
  easeIn: YC,
  easeInOut: e1,
  easeOut: XC,
  circIn: Bd,
  circInOut: _b,
  circOut: jb,
  backIn: Ld,
  backInOut: Ob,
  backOut: Db,
  anticipate: Nb
}, zv = (n) => {
  if (Vd(n)) {
    eb(n.length === 4);
    const [i, s, r, u] = n;
    return wl(i, s, r, u);
  } else if (typeof n == "string")
    return ZC[n];
  return n;
};
function QC(n, i, s) {
  const r = [], u = s || Jb, f = n.length - 1;
  for (let d = 0; d < f; d++) {
    let h = u(n[d], n[d + 1]);
    if (i) {
      const m = Array.isArray(i) ? i[d] || De : i;
      h = Rl(m, h);
    }
    r.push(h);
  }
  return r;
}
function FC(n, i, { clamp: s = !0, ease: r, mixer: u } = {}) {
  const f = n.length;
  if (eb(f === i.length), f === 1)
    return () => i[0];
  if (f === 2 && i[0] === i[1])
    return () => i[1];
  const d = n[0] === n[1];
  n[0] > n[f - 1] && (n = [...n].reverse(), i = [...i].reverse());
  const h = QC(i, r, u), m = h.length, p = (v) => {
    if (d && v < n[0])
      return i[0];
    let y = 0;
    if (m > 1)
      for (; y < n.length - 2 && !(v < n[y + 1]); y++)
        ;
    const x = /* @__PURE__ */ Ja(n[y], n[y + 1], v);
    return h[y](x);
  };
  return s ? (v) => p(_n(n[0], n[f - 1], v)) : p;
}
function WC(n, i) {
  const s = n[n.length - 1];
  for (let r = 1; r <= i; r++) {
    const u = /* @__PURE__ */ Ja(0, i, r);
    n.push(Ut(s, 1, u));
  }
}
function $C(n) {
  const i = [0];
  return WC(i, n.length - 1), i;
}
function JC(n, i) {
  return n.map((s) => s * i);
}
function IC(n, i) {
  return n.map(() => i || e1).splice(0, n.length - 1);
}
function ho({ duration: n = 300, keyframes: i, times: s, ease: r = "easeInOut" }) {
  const u = KC(r) ? r.map(zv) : zv(r), f = {
    done: !1,
    value: i[0]
  }, d = JC(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    s && s.length === i.length ? s : $C(i),
    n
  ), h = FC(d, i, {
    ease: Array.isArray(u) ? u : IC(i, u)
  });
  return {
    calculatedDuration: n,
    next: (m) => (f.value = h(m), f.done = m >= n, f)
  };
}
const tM = (n) => {
  const i = ({ timestamp: s }) => n(s);
  return {
    start: () => _t.update(i, !0),
    stop: () => hi(i),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => se.isProcessing ? se.timestamp : on.now()
  };
}, eM = {
  decay: _v,
  inertia: _v,
  tween: ho,
  keyframes: ho,
  spring: t1
}, nM = (n) => n / 100;
class qd extends Fb {
  constructor(i) {
    super(i), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: m } = this.options;
      m && m();
    };
    const { name: s, motionValue: r, element: u, keyframes: f } = this.options, d = (u == null ? void 0 : u.KeyframeResolver) || Hd, h = (m, p) => this.onKeyframesResolved(m, p);
    this.resolver = new d(f, h, s, r, u), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(i) {
    const { type: s = "keyframes", repeat: r = 0, repeatDelay: u = 0, repeatType: f, velocity: d = 0 } = this.options, h = zd(s) ? s : eM[s] || ho;
    let m, p;
    h !== ho && typeof i[0] != "number" && (m = Rl(nM, Jb(i[0], i[1])), i = [0, 100]);
    const v = h({ ...this.options, keyframes: i });
    f === "mirror" && (p = h({
      ...this.options,
      keyframes: [...i].reverse(),
      velocity: -d
    })), v.calculatedDuration === null && (v.calculatedDuration = Wb(v));
    const { calculatedDuration: y } = v, x = y + u, S = x * (r + 1) - u;
    return {
      generator: v,
      mirroredGenerator: p,
      mapPercentToKeyframes: m,
      calculatedDuration: y,
      resolvedDuration: x,
      totalDuration: S
    };
  }
  onPostResolved() {
    const { autoplay: i = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !i ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(i, s = !1) {
    const { resolved: r } = this;
    if (!r) {
      const { keyframes: F } = this.options;
      return { done: !0, value: F[F.length - 1] };
    }
    const { finalKeyframe: u, generator: f, mirroredGenerator: d, mapPercentToKeyframes: h, keyframes: m, calculatedDuration: p, totalDuration: v, resolvedDuration: y } = r;
    if (this.startTime === null)
      return f.next(0);
    const { delay: x, repeat: S, repeatType: R, repeatDelay: A, onUpdate: D } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, i) : this.speed < 0 && (this.startTime = Math.min(i - v / this.speed, this.startTime)), s ? this.currentTime = i : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(i - this.startTime) * this.speed;
    const O = this.currentTime - x * (this.speed >= 0 ? 1 : -1), z = this.speed >= 0 ? O < 0 : O > v;
    this.currentTime = Math.max(O, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = v);
    let U = this.currentTime, q = f;
    if (S) {
      const F = Math.min(this.currentTime, v) / y;
      let Q = Math.floor(F), W = F % 1;
      !W && F >= 1 && (W = 1), W === 1 && Q--, Q = Math.min(Q, S + 1), !!(Q % 2) && (R === "reverse" ? (W = 1 - W, A && (W -= A / y)) : R === "mirror" && (q = d)), U = _n(0, 1, W) * y;
    }
    const B = z ? { done: !1, value: m[0] } : q.next(U);
    h && (B.value = h(B.value));
    let { done: L } = B;
    !z && p !== null && (L = this.speed >= 0 ? this.currentTime >= v : this.currentTime <= 0);
    const Z = this.holdTime === null && (this.state === "finished" || this.state === "running" && L);
    return Z && u !== void 0 && (B.value = No(m, this.options, u)), D && D(B.value), Z && this.finish(), B;
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
    const { driver: i = tM, onPlay: s, startTime: r } = this.options;
    this.driver || (this.driver = i((f) => this.tick(f))), s && s();
    const u = this.driver.now();
    this.holdTime !== null ? this.startTime = u - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = u) : this.startTime = r ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
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
const iM = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function aM(n, i, s, { delay: r = 0, duration: u = 300, repeat: f = 0, repeatType: d = "loop", ease: h = "easeInOut", times: m } = {}) {
  const p = { [i]: s };
  m && (p.offset = m);
  const v = wb(h, u);
  return Array.isArray(v) && (p.easing = v), n.animate(p, {
    delay: r,
    duration: u,
    easing: Array.isArray(v) ? "linear" : v,
    fill: "both",
    iterations: f + 1,
    direction: d === "reverse" ? "alternate" : "normal"
  });
}
const sM = /* @__PURE__ */ _d(() => Object.hasOwnProperty.call(Element.prototype, "animate")), mo = 10, lM = 2e4;
function rM(n) {
  return zd(n.type) || n.type === "spring" || !Eb(n.ease);
}
function oM(n, i) {
  const s = new qd({
    ...i,
    keyframes: n,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let r = { done: !1, value: n[0] };
  const u = [];
  let f = 0;
  for (; !r.done && f < lM; )
    r = s.sample(f), u.push(r.value), f += mo;
  return {
    times: void 0,
    keyframes: u,
    duration: f - mo,
    ease: "linear"
  };
}
const n1 = {
  anticipate: Nb,
  backInOut: Ob,
  circInOut: _b
};
function uM(n) {
  return n in n1;
}
class Vv extends Fb {
  constructor(i) {
    super(i);
    const { name: s, motionValue: r, element: u, keyframes: f } = this.options;
    this.resolver = new Qb(f, (d, h) => this.onKeyframesResolved(d, h), s, r, u), this.resolver.scheduleResolve();
  }
  initPlayback(i, s) {
    let { duration: r = 300, times: u, ease: f, type: d, motionValue: h, name: m, startTime: p } = this.options;
    if (!h.owner || !h.owner.current)
      return !1;
    if (typeof f == "string" && co() && uM(f) && (f = n1[f]), rM(this.options)) {
      const { onComplete: y, onUpdate: x, motionValue: S, element: R, ...A } = this.options, D = oM(i, A);
      i = D.keyframes, i.length === 1 && (i[1] = i[0]), r = D.duration, u = D.times, f = D.ease, d = "keyframes";
    }
    const v = aM(h.owner.current, m, i, { ...this.options, duration: r, times: u, ease: f });
    return v.startTime = p ?? this.calcStartTime(), this.pendingTimeline ? (Sv(v, this.pendingTimeline), this.pendingTimeline = void 0) : v.onfinish = () => {
      const { onComplete: y } = this.options;
      h.set(No(i, this.options, s)), y && y(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: v,
      duration: r,
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
    const { animation: r } = s;
    r.currentTime = /* @__PURE__ */ On(i);
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
    const { animation: r } = s;
    r.playbackRate = i;
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
        return De;
      const { animation: r } = s;
      Sv(r, i);
    }
    return De;
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
    const { animation: s, keyframes: r, duration: u, type: f, ease: d, times: h } = i;
    if (s.playState === "idle" || s.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: p, onUpdate: v, onComplete: y, element: x, ...S } = this.options, R = new qd({
        ...S,
        keyframes: r,
        duration: u,
        type: f,
        ease: d,
        times: h,
        isGenerator: !0
      }), A = /* @__PURE__ */ On(this.time);
      p.setWithVelocity(R.sample(A - mo).value, R.sample(A).value, mo);
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
    const { motionValue: s, name: r, repeatDelay: u, repeatType: f, damping: d, type: h } = i;
    if (!s || !s.owner || !(s.owner.current instanceof HTMLElement))
      return !1;
    const { onUpdate: m, transformTemplate: p } = s.owner.getProps();
    return sM() && r && iM.has(r) && (r !== "transform" || !p) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !m && !u && f !== "mirror" && d !== 0 && h !== "inertia";
  }
}
const cM = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, fM = (n) => ({
  type: "spring",
  stiffness: 550,
  damping: n === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), dM = {
  type: "keyframes",
  duration: 0.8
}, hM = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, mM = (n, { keyframes: i }) => i.length > 2 ? dM : Ii.has(n) ? n.startsWith("scale") ? fM(i[1]) : cM : hM;
function pM({ when: n, delay: i, delayChildren: s, staggerChildren: r, staggerDirection: u, repeat: f, repeatType: d, repeatDelay: h, from: m, elapsed: p, ...v }) {
  return !!Object.keys(v).length;
}
const Gd = (n, i, s, r = {}, u, f) => (d) => {
  const h = Dd(r, n) || {}, m = h.delay || r.delay || 0;
  let { elapsed: p = 0 } = r;
  p = p - /* @__PURE__ */ On(m);
  let v = {
    keyframes: Array.isArray(s) ? s : [null, s],
    ease: "easeOut",
    velocity: i.getVelocity(),
    ...h,
    delay: -p,
    onUpdate: (x) => {
      i.set(x), h.onUpdate && h.onUpdate(x);
    },
    onComplete: () => {
      d(), h.onComplete && h.onComplete();
    },
    name: n,
    motionValue: i,
    element: f ? void 0 : u
  };
  pM(h) || (v = {
    ...v,
    ...mM(n, v)
  }), v.duration && (v.duration = /* @__PURE__ */ On(v.duration)), v.repeatDelay && (v.repeatDelay = /* @__PURE__ */ On(v.repeatDelay)), v.from !== void 0 && (v.keyframes[0] = v.from);
  let y = !1;
  if ((v.type === !1 || v.duration === 0 && !v.repeatDelay) && (v.duration = 0, v.delay === 0 && (y = !0)), v.allowFlatten = !h.type && !h.ease, y && !f && i.get() !== void 0) {
    const x = No(v.keyframes, h);
    if (x !== void 0)
      return _t.update(() => {
        v.onUpdate(x), v.onComplete();
      }), new GR([]);
  }
  return !f && Vv.supports(v) ? new Vv(v) : new qd(v);
};
function gM({ protectedKeys: n, needsAnimating: i }, s) {
  const r = n.hasOwnProperty(s) && i[s] !== !0;
  return i[s] = !1, r;
}
function i1(n, i, { delay: s = 0, transitionOverride: r, type: u } = {}) {
  var f;
  let { transition: d = n.getDefaultTransition(), transitionEnd: h, ...m } = i;
  r && (d = r);
  const p = [], v = u && n.animationState && n.animationState.getState()[u];
  for (const y in m) {
    const x = n.getValue(y, (f = n.latestValues[y]) !== null && f !== void 0 ? f : null), S = m[y];
    if (S === void 0 || v && gM(v, y))
      continue;
    const R = {
      delay: s,
      ...Dd(d || {}, y)
    };
    let A = !1;
    if (window.MotionHandoffAnimation) {
      const O = Tb(n);
      if (O) {
        const z = window.MotionHandoffAnimation(O, y, _t);
        z !== null && (R.startTime = z, A = !0);
      }
    }
    Df(n, y), x.start(Gd(y, x, S, n.shouldReduceMotion && xb.has(y) ? { type: !1 } : R, n, A));
    const D = x.animation;
    D && p.push(D);
  }
  return h && Promise.all(p).then(() => {
    _t.update(() => {
      h && kR(n, h);
    });
  }), p;
}
function Pf(n, i, s = {}) {
  var r;
  const u = bl(n, i, s.type === "exit" ? (r = n.presenceContext) === null || r === void 0 ? void 0 : r.custom : void 0);
  let { transition: f = n.getDefaultTransition() || {} } = u || {};
  s.transitionOverride && (f = s.transitionOverride);
  const d = u ? () => Promise.all(i1(n, u, s)) : () => Promise.resolve(), h = n.variantChildren && n.variantChildren.size ? (p = 0) => {
    const { delayChildren: v = 0, staggerChildren: y, staggerDirection: x } = f;
    return vM(n, i, v + p, y, x, s);
  } : () => Promise.resolve(), { when: m } = f;
  if (m) {
    const [p, v] = m === "beforeChildren" ? [d, h] : [h, d];
    return p().then(() => v());
  } else
    return Promise.all([d(), h(s.delay)]);
}
function vM(n, i, s = 0, r = 0, u = 1, f) {
  const d = [], h = (n.variantChildren.size - 1) * r, m = u === 1 ? (p = 0) => p * r : (p = 0) => h - p * r;
  return Array.from(n.variantChildren).sort(yM).forEach((p, v) => {
    p.notify("AnimationStart", i), d.push(Pf(p, i, {
      ...f,
      delay: s + m(v)
    }).then(() => p.notify("AnimationComplete", i)));
  }), Promise.all(d);
}
function yM(n, i) {
  return n.sortNodePosition(i);
}
function bM(n, i, s = {}) {
  n.notify("AnimationStart", i);
  let r;
  if (Array.isArray(i)) {
    const u = i.map((f) => Pf(n, f, s));
    r = Promise.all(u);
  } else if (typeof i == "string")
    r = Pf(n, i, s);
  else {
    const u = typeof i == "function" ? bl(n, i, s.custom) : i;
    r = Promise.all(i1(n, u, s));
  }
  return r.then(() => {
    n.notify("AnimationComplete", i);
  });
}
function a1(n, i) {
  if (!Array.isArray(i))
    return !1;
  const s = i.length;
  if (s !== n.length)
    return !1;
  for (let r = 0; r < s; r++)
    if (i[r] !== n[r])
      return !1;
  return !0;
}
const xM = gd.length;
function s1(n) {
  if (!n)
    return;
  if (!n.isControllingVariants) {
    const s = n.parent ? s1(n.parent) || {} : {};
    return n.props.initial !== void 0 && (s.initial = n.props.initial), s;
  }
  const i = {};
  for (let s = 0; s < xM; s++) {
    const r = gd[s], u = n.props[r];
    (gl(u) || u === !1) && (i[r] = u);
  }
  return i;
}
const SM = [...pd].reverse(), TM = pd.length;
function AM(n) {
  return (i) => Promise.all(i.map(({ animation: s, options: r }) => bM(n, s, r)));
}
function EM(n) {
  let i = AM(n), s = Lv(), r = !0;
  const u = (m) => (p, v) => {
    var y;
    const x = bl(n, v, m === "exit" ? (y = n.presenceContext) === null || y === void 0 ? void 0 : y.custom : void 0);
    if (x) {
      const { transition: S, transitionEnd: R, ...A } = x;
      p = { ...p, ...A, ...R };
    }
    return p;
  };
  function f(m) {
    i = m(n);
  }
  function d(m) {
    const { props: p } = n, v = s1(n.parent) || {}, y = [], x = /* @__PURE__ */ new Set();
    let S = {}, R = 1 / 0;
    for (let D = 0; D < TM; D++) {
      const O = SM[D], z = s[O], U = p[O] !== void 0 ? p[O] : v[O], q = gl(U), B = O === m ? z.isActive : null;
      B === !1 && (R = D);
      let L = U === v[O] && U !== p[O] && q;
      if (L && r && n.manuallyAnimateOnMount && (L = !1), z.protectedKeys = { ...S }, // If it isn't active and hasn't *just* been set as inactive
      !z.isActive && B === null || // If we didn't and don't have any defined prop for this animation type
      !U && !z.prevProp || // Or if the prop doesn't define an animation
      Do(U) || typeof U == "boolean")
        continue;
      const Z = wM(z.prevProp, U);
      let F = Z || // If we're making this variant active, we want to always make it active
      O === m && z.isActive && !L && q || // If we removed a higher-priority variant (i is in reverse order)
      D > R && q, Q = !1;
      const W = Array.isArray(U) ? U : [U];
      let mt = W.reduce(u(O), {});
      B === !1 && (mt = {});
      const { prevResolvedValues: Rt = {} } = z, ft = {
        ...Rt,
        ...mt
      }, pt = ($) => {
        F = !0, x.has($) && (Q = !0, x.delete($)), z.needsAnimating[$] = !0;
        const Y = n.getValue($);
        Y && (Y.liveStyle = !1);
      };
      for (const $ in ft) {
        const Y = mt[$], nt = Rt[$];
        if (S.hasOwnProperty($))
          continue;
        let C = !1;
        Mf(Y) && Mf(nt) ? C = !a1(Y, nt) : C = Y !== nt, C ? Y != null ? pt($) : x.add($) : Y !== void 0 && x.has($) ? pt($) : z.protectedKeys[$] = !0;
      }
      z.prevProp = U, z.prevResolvedValues = mt, z.isActive && (S = { ...S, ...mt }), r && n.blockInitialAnimation && (F = !1), F && (!(L && Z) || Q) && y.push(...W.map(($) => ({
        animation: $,
        options: { type: O }
      })));
    }
    if (x.size) {
      const D = {};
      if (typeof p.initial != "boolean") {
        const O = bl(n, Array.isArray(p.initial) ? p.initial[0] : p.initial);
        O && O.transition && (D.transition = O.transition);
      }
      x.forEach((O) => {
        const z = n.getBaseTarget(O), U = n.getValue(O);
        U && (U.liveStyle = !0), D[O] = z ?? null;
      }), y.push({ animation: D });
    }
    let A = !!y.length;
    return r && (p.initial === !1 || p.initial === p.animate) && !n.manuallyAnimateOnMount && (A = !1), r = !1, A ? i(y) : Promise.resolve();
  }
  function h(m, p) {
    var v;
    if (s[m].isActive === p)
      return Promise.resolve();
    (v = n.variantChildren) === null || v === void 0 || v.forEach((x) => {
      var S;
      return (S = x.animationState) === null || S === void 0 ? void 0 : S.setActive(m, p);
    }), s[m].isActive = p;
    const y = d(m);
    for (const x in s)
      s[x].protectedKeys = {};
    return y;
  }
  return {
    animateChanges: d,
    setActive: h,
    setAnimateFunction: f,
    getState: () => s,
    reset: () => {
      s = Lv(), r = !0;
    }
  };
}
function wM(n, i) {
  return typeof i == "string" ? i !== n : Array.isArray(i) ? !a1(i, n) : !1;
}
function Gi(n = !1) {
  return {
    isActive: n,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Lv() {
  return {
    animate: Gi(!0),
    whileInView: Gi(),
    whileHover: Gi(),
    whileTap: Gi(),
    whileDrag: Gi(),
    whileFocus: Gi(),
    exit: Gi()
  };
}
class gi {
  constructor(i) {
    this.isMounted = !1, this.node = i;
  }
  update() {
  }
}
class RM extends gi {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(i) {
    super(i), i.animationState || (i.animationState = EM(i));
  }
  updateAnimationControlsSubscription() {
    const { animate: i } = this.node.getProps();
    Do(i) && (this.unmountControls = i.subscribe(this.node));
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
let CM = 0;
class MM extends gi {
  constructor() {
    super(...arguments), this.id = CM++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: i, onExitComplete: s } = this.node.presenceContext, { isPresent: r } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || i === r)
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
const DM = {
  animation: {
    Feature: RM
  },
  exit: {
    Feature: MM
  }
}, Fe = {
  x: !1,
  y: !1
};
function l1() {
  return Fe.x || Fe.y;
}
function OM(n) {
  return n === "x" || n === "y" ? Fe[n] ? null : (Fe[n] = !0, () => {
    Fe[n] = !1;
  }) : Fe.x || Fe.y ? null : (Fe.x = Fe.y = !0, () => {
    Fe.x = Fe.y = !1;
  });
}
function Tl(n, i, s, r = { passive: !0 }) {
  return n.addEventListener(i, s, r), () => n.removeEventListener(i, s);
}
const Yd = (n) => n.pointerType === "mouse" ? typeof n.button != "number" || n.button <= 0 : n.isPrimary !== !1;
function Cl(n) {
  return {
    point: {
      x: n.pageX,
      y: n.pageY
    }
  };
}
const NM = (n) => (i) => Yd(i) && n(i, Cl(i));
function cl(n, i, s, r) {
  return Tl(n, i, NM(s), r);
}
function r1({ top: n, left: i, right: s, bottom: r }) {
  return {
    x: { min: i, max: s },
    y: { min: n, max: r }
  };
}
function jM({ x: n, y: i }) {
  return { top: i.min, right: n.max, bottom: i.max, left: n.min };
}
function _M(n, i) {
  if (!i)
    return n;
  const s = i({ x: n.left, y: n.top }), r = i({ x: n.right, y: n.bottom });
  return {
    top: s.y,
    left: s.x,
    bottom: r.y,
    right: r.x
  };
}
const o1 = 1e-4, zM = 1 - o1, VM = 1 + o1, u1 = 0.01, LM = 0 - u1, BM = 0 + u1;
function he(n) {
  return n.max - n.min;
}
function UM(n, i, s) {
  return Math.abs(n - i) <= s;
}
function Bv(n, i, s, r = 0.5) {
  n.origin = r, n.originPoint = Ut(i.min, i.max, n.origin), n.scale = he(s) / he(i), n.translate = Ut(s.min, s.max, n.origin) - n.originPoint, (n.scale >= zM && n.scale <= VM || isNaN(n.scale)) && (n.scale = 1), (n.translate >= LM && n.translate <= BM || isNaN(n.translate)) && (n.translate = 0);
}
function fl(n, i, s, r) {
  Bv(n.x, i.x, s.x, r ? r.originX : void 0), Bv(n.y, i.y, s.y, r ? r.originY : void 0);
}
function Uv(n, i, s) {
  n.min = s.min + i.min, n.max = n.min + he(i);
}
function kM(n, i, s) {
  Uv(n.x, i.x, s.x), Uv(n.y, i.y, s.y);
}
function kv(n, i, s) {
  n.min = i.min - s.min, n.max = n.min + he(i);
}
function dl(n, i, s) {
  kv(n.x, i.x, s.x), kv(n.y, i.y, s.y);
}
const Hv = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Ya = () => ({
  x: Hv(),
  y: Hv()
}), Pv = () => ({ min: 0, max: 0 }), Xt = () => ({
  x: Pv(),
  y: Pv()
});
function Ge(n) {
  return [n("x"), n("y")];
}
function of(n) {
  return n === void 0 || n === 1;
}
function qf({ scale: n, scaleX: i, scaleY: s }) {
  return !of(n) || !of(i) || !of(s);
}
function Yi(n) {
  return qf(n) || c1(n) || n.z || n.rotate || n.rotateX || n.rotateY || n.skewX || n.skewY;
}
function c1(n) {
  return qv(n.x) || qv(n.y);
}
function qv(n) {
  return n && n !== "0%";
}
function po(n, i, s) {
  const r = n - s, u = i * r;
  return s + u;
}
function Gv(n, i, s, r, u) {
  return u !== void 0 && (n = po(n, u, r)), po(n, s, r) + i;
}
function Gf(n, i = 0, s = 1, r, u) {
  n.min = Gv(n.min, i, s, r, u), n.max = Gv(n.max, i, s, r, u);
}
function f1(n, { x: i, y: s }) {
  Gf(n.x, i.translate, i.scale, i.originPoint), Gf(n.y, s.translate, s.scale, s.originPoint);
}
const Yv = 0.999999999999, Xv = 1.0000000000001;
function HM(n, i, s, r = !1) {
  const u = s.length;
  if (!u)
    return;
  i.x = i.y = 1;
  let f, d;
  for (let h = 0; h < u; h++) {
    f = s[h], d = f.projectionDelta;
    const { visualElement: m } = f.options;
    m && m.props.style && m.props.style.display === "contents" || (r && f.options.layoutScroll && f.scroll && f !== f.root && Ka(n, {
      x: -f.scroll.offset.x,
      y: -f.scroll.offset.y
    }), d && (i.x *= d.x.scale, i.y *= d.y.scale, f1(n, d)), r && Yi(f.latestValues) && Ka(n, f.latestValues));
  }
  i.x < Xv && i.x > Yv && (i.x = 1), i.y < Xv && i.y > Yv && (i.y = 1);
}
function Xa(n, i) {
  n.min = n.min + i, n.max = n.max + i;
}
function Kv(n, i, s, r, u = 0.5) {
  const f = Ut(n.min, n.max, u);
  Gf(n, i, s, f, r);
}
function Ka(n, i) {
  Kv(n.x, i.x, i.scaleX, i.scale, i.originX), Kv(n.y, i.y, i.scaleY, i.scale, i.originY);
}
function d1(n, i) {
  return r1(_M(n.getBoundingClientRect(), i));
}
function PM(n, i, s) {
  const r = d1(n, s), { scroll: u } = i;
  return u && (Xa(r.x, u.offset.x), Xa(r.y, u.offset.y)), r;
}
const h1 = ({ current: n }) => n ? n.ownerDocument.defaultView : null, Zv = (n, i) => Math.abs(n - i);
function qM(n, i) {
  const s = Zv(n.x, i.x), r = Zv(n.y, i.y);
  return Math.sqrt(s ** 2 + r ** 2);
}
class m1 {
  constructor(i, s, { transformPagePoint: r, contextWindow: u, dragSnapToOrigin: f = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const y = cf(this.lastMoveEventInfo, this.history), x = this.startEvent !== null, S = qM(y.offset, { x: 0, y: 0 }) >= 3;
      if (!x && !S)
        return;
      const { point: R } = y, { timestamp: A } = se;
      this.history.push({ ...R, timestamp: A });
      const { onStart: D, onMove: O } = this.handlers;
      x || (D && D(this.lastMoveEvent, y), this.startEvent = this.lastMoveEvent), O && O(this.lastMoveEvent, y);
    }, this.handlePointerMove = (y, x) => {
      this.lastMoveEvent = y, this.lastMoveEventInfo = uf(x, this.transformPagePoint), _t.update(this.updatePoint, !0);
    }, this.handlePointerUp = (y, x) => {
      this.end();
      const { onEnd: S, onSessionEnd: R, resumeAnimation: A } = this.handlers;
      if (this.dragSnapToOrigin && A && A(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const D = cf(y.type === "pointercancel" ? this.lastMoveEventInfo : uf(x, this.transformPagePoint), this.history);
      this.startEvent && S && S(y, D), R && R(y, D);
    }, !Yd(i))
      return;
    this.dragSnapToOrigin = f, this.handlers = s, this.transformPagePoint = r, this.contextWindow = u || window;
    const d = Cl(i), h = uf(d, this.transformPagePoint), { point: m } = h, { timestamp: p } = se;
    this.history = [{ ...m, timestamp: p }];
    const { onSessionStart: v } = s;
    v && v(i, cf(h, this.history)), this.removeListeners = Rl(cl(this.contextWindow, "pointermove", this.handlePointerMove), cl(this.contextWindow, "pointerup", this.handlePointerUp), cl(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(i) {
    this.handlers = i;
  }
  end() {
    this.removeListeners && this.removeListeners(), hi(this.updatePoint);
  }
}
function uf(n, i) {
  return i ? { point: i(n.point) } : n;
}
function Qv(n, i) {
  return { x: n.x - i.x, y: n.y - i.y };
}
function cf({ point: n }, i) {
  return {
    point: n,
    delta: Qv(n, p1(i)),
    offset: Qv(n, GM(i)),
    velocity: YM(i, 0.1)
  };
}
function GM(n) {
  return n[0];
}
function p1(n) {
  return n[n.length - 1];
}
function YM(n, i) {
  if (n.length < 2)
    return { x: 0, y: 0 };
  let s = n.length - 1, r = null;
  const u = p1(n);
  for (; s >= 0 && (r = n[s], !(u.timestamp - r.timestamp > /* @__PURE__ */ On(i))); )
    s--;
  if (!r)
    return { x: 0, y: 0 };
  const f = /* @__PURE__ */ Nn(u.timestamp - r.timestamp);
  if (f === 0)
    return { x: 0, y: 0 };
  const d = {
    x: (u.x - r.x) / f,
    y: (u.y - r.y) / f
  };
  return d.x === 1 / 0 && (d.x = 0), d.y === 1 / 0 && (d.y = 0), d;
}
function XM(n, { min: i, max: s }, r) {
  return i !== void 0 && n < i ? n = r ? Ut(i, n, r.min) : Math.max(n, i) : s !== void 0 && n > s && (n = r ? Ut(s, n, r.max) : Math.min(n, s)), n;
}
function Fv(n, i, s) {
  return {
    min: i !== void 0 ? n.min + i : void 0,
    max: s !== void 0 ? n.max + s - (n.max - n.min) : void 0
  };
}
function KM(n, { top: i, left: s, bottom: r, right: u }) {
  return {
    x: Fv(n.x, s, u),
    y: Fv(n.y, i, r)
  };
}
function Wv(n, i) {
  let s = i.min - n.min, r = i.max - n.max;
  return i.max - i.min < n.max - n.min && ([s, r] = [r, s]), { min: s, max: r };
}
function ZM(n, i) {
  return {
    x: Wv(n.x, i.x),
    y: Wv(n.y, i.y)
  };
}
function QM(n, i) {
  let s = 0.5;
  const r = he(n), u = he(i);
  return u > r ? s = /* @__PURE__ */ Ja(i.min, i.max - r, n.min) : r > u && (s = /* @__PURE__ */ Ja(n.min, n.max - u, i.min)), _n(0, 1, s);
}
function FM(n, i) {
  const s = {};
  return i.min !== void 0 && (s.min = i.min - n.min), i.max !== void 0 && (s.max = i.max - n.min), s;
}
const Yf = 0.35;
function WM(n = Yf) {
  return n === !1 ? n = 0 : n === !0 && (n = Yf), {
    x: $v(n, "left", "right"),
    y: $v(n, "top", "bottom")
  };
}
function $v(n, i, s) {
  return {
    min: Jv(n, i),
    max: Jv(n, s)
  };
}
function Jv(n, i) {
  return typeof n == "number" ? n : n[i] || 0;
}
const $M = /* @__PURE__ */ new WeakMap();
class JM {
  constructor(i) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Xt(), this.visualElement = i;
  }
  start(i, { snapToCursor: s = !1 } = {}) {
    const { presenceContext: r } = this.visualElement;
    if (r && r.isPresent === !1)
      return;
    const u = (v) => {
      const { dragSnapToOrigin: y } = this.getProps();
      y ? this.pauseAnimation() : this.stopAnimation(), s && this.snapToCursor(Cl(v).point);
    }, f = (v, y) => {
      const { drag: x, dragPropagation: S, onDragStart: R } = this.getProps();
      if (x && !S && (this.openDragLock && this.openDragLock(), this.openDragLock = OM(x), !this.openDragLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Ge((D) => {
        let O = this.getAxisMotionValue(D).get() || 0;
        if (rn.test(O)) {
          const { projection: z } = this.visualElement;
          if (z && z.layout) {
            const U = z.layout.layoutBox[D];
            U && (O = he(U) * (parseFloat(O) / 100));
          }
        }
        this.originPoint[D] = O;
      }), R && _t.postRender(() => R(v, y)), Df(this.visualElement, "transform");
      const { animationState: A } = this.visualElement;
      A && A.setActive("whileDrag", !0);
    }, d = (v, y) => {
      const { dragPropagation: x, dragDirectionLock: S, onDirectionLock: R, onDrag: A } = this.getProps();
      if (!x && !this.openDragLock)
        return;
      const { offset: D } = y;
      if (S && this.currentDirection === null) {
        this.currentDirection = IM(D), this.currentDirection !== null && R && R(this.currentDirection);
        return;
      }
      this.updateAxis("x", y.point, D), this.updateAxis("y", y.point, D), this.visualElement.render(), A && A(v, y);
    }, h = (v, y) => this.stop(v, y), m = () => Ge((v) => {
      var y;
      return this.getAnimationState(v) === "paused" && ((y = this.getAxisMotionValue(v).animation) === null || y === void 0 ? void 0 : y.play());
    }), { dragSnapToOrigin: p } = this.getProps();
    this.panSession = new m1(i, {
      onSessionStart: u,
      onStart: f,
      onMove: d,
      onSessionEnd: h,
      resumeAnimation: m
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: p,
      contextWindow: h1(this.visualElement)
    });
  }
  stop(i, s) {
    const r = this.isDragging;
    if (this.cancel(), !r)
      return;
    const { velocity: u } = s;
    this.startAnimation(u);
    const { onDragEnd: f } = this.getProps();
    f && _t.postRender(() => f(i, s));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: i, animationState: s } = this.visualElement;
    i && (i.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: r } = this.getProps();
    !r && this.openDragLock && (this.openDragLock(), this.openDragLock = null), s && s.setActive("whileDrag", !1);
  }
  updateAxis(i, s, r) {
    const { drag: u } = this.getProps();
    if (!r || !Qr(i, u, this.currentDirection))
      return;
    const f = this.getAxisMotionValue(i);
    let d = this.originPoint[i] + r[i];
    this.constraints && this.constraints[i] && (d = XM(d, this.constraints[i], this.elastic[i])), f.set(d);
  }
  resolveConstraints() {
    var i;
    const { dragConstraints: s, dragElastic: r } = this.getProps(), u = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (i = this.visualElement.projection) === null || i === void 0 ? void 0 : i.layout, f = this.constraints;
    s && qa(s) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : s && u ? this.constraints = KM(u.layoutBox, s) : this.constraints = !1, this.elastic = WM(r), f !== this.constraints && u && this.constraints && !this.hasMutatedConstraints && Ge((d) => {
      this.constraints !== !1 && this.getAxisMotionValue(d) && (this.constraints[d] = FM(u.layoutBox[d], this.constraints[d]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: i, onMeasureDragConstraints: s } = this.getProps();
    if (!i || !qa(i))
      return !1;
    const r = i.current, { projection: u } = this.visualElement;
    if (!u || !u.layout)
      return !1;
    const f = PM(r, u.root, this.visualElement.getTransformPagePoint());
    let d = ZM(u.layout.layoutBox, f);
    if (s) {
      const h = s(jM(d));
      this.hasMutatedConstraints = !!h, h && (d = r1(h));
    }
    return d;
  }
  startAnimation(i) {
    const { drag: s, dragMomentum: r, dragElastic: u, dragTransition: f, dragSnapToOrigin: d, onDragTransitionEnd: h } = this.getProps(), m = this.constraints || {}, p = Ge((v) => {
      if (!Qr(v, s, this.currentDirection))
        return;
      let y = m && m[v] || {};
      d && (y = { min: 0, max: 0 });
      const x = u ? 200 : 1e6, S = u ? 40 : 1e7, R = {
        type: "inertia",
        velocity: r ? i[v] : 0,
        bounceStiffness: x,
        bounceDamping: S,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...f,
        ...y
      };
      return this.startAxisValueAnimation(v, R);
    });
    return Promise.all(p).then(h);
  }
  startAxisValueAnimation(i, s) {
    const r = this.getAxisMotionValue(i);
    return Df(this.visualElement, i), r.start(Gd(i, r, 0, s, this.visualElement, !1));
  }
  stopAnimation() {
    Ge((i) => this.getAxisMotionValue(i).stop());
  }
  pauseAnimation() {
    Ge((i) => {
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
    const s = `_drag${i.toUpperCase()}`, r = this.visualElement.getProps(), u = r[s];
    return u || this.visualElement.getValue(i, (r.initial ? r.initial[i] : void 0) || 0);
  }
  snapToCursor(i) {
    Ge((s) => {
      const { drag: r } = this.getProps();
      if (!Qr(s, r, this.currentDirection))
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
    const { drag: i, dragConstraints: s } = this.getProps(), { projection: r } = this.visualElement;
    if (!qa(s) || !r || !this.constraints)
      return;
    this.stopAnimation();
    const u = { x: 0, y: 0 };
    Ge((d) => {
      const h = this.getAxisMotionValue(d);
      if (h && this.constraints !== !1) {
        const m = h.get();
        u[d] = QM({ min: m, max: m }, this.constraints[d]);
      }
    });
    const { transformTemplate: f } = this.visualElement.getProps();
    this.visualElement.current.style.transform = f ? f({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.resolveConstraints(), Ge((d) => {
      if (!Qr(d, i, null))
        return;
      const h = this.getAxisMotionValue(d), { min: m, max: p } = this.constraints[d];
      h.set(Ut(m, p, u[d]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    $M.set(this.visualElement, this);
    const i = this.visualElement.current, s = cl(i, "pointerdown", (m) => {
      const { drag: p, dragListener: v = !0 } = this.getProps();
      p && v && this.start(m);
    }), r = () => {
      const { dragConstraints: m } = this.getProps();
      qa(m) && m.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: u } = this.visualElement, f = u.addEventListener("measure", r);
    u && !u.layout && (u.root && u.root.updateScroll(), u.updateLayout()), _t.read(r);
    const d = Tl(window, "resize", () => this.scalePositionWithinConstraints()), h = u.addEventListener("didUpdate", ({ delta: m, hasLayoutChanged: p }) => {
      this.isDragging && p && (Ge((v) => {
        const y = this.getAxisMotionValue(v);
        y && (this.originPoint[v] += m[v].translate, y.set(y.get() + m[v].translate));
      }), this.visualElement.render());
    });
    return () => {
      d(), s(), f(), h && h();
    };
  }
  getProps() {
    const i = this.visualElement.getProps(), { drag: s = !1, dragDirectionLock: r = !1, dragPropagation: u = !1, dragConstraints: f = !1, dragElastic: d = Yf, dragMomentum: h = !0 } = i;
    return {
      ...i,
      drag: s,
      dragDirectionLock: r,
      dragPropagation: u,
      dragConstraints: f,
      dragElastic: d,
      dragMomentum: h
    };
  }
}
function Qr(n, i, s) {
  return (i === !0 || i === n) && (s === null || s === n);
}
function IM(n, i = 10) {
  let s = null;
  return Math.abs(n.y) > i ? s = "y" : Math.abs(n.x) > i && (s = "x"), s;
}
class tD extends gi {
  constructor(i) {
    super(i), this.removeGroupControls = De, this.removeListeners = De, this.controls = new JM(i);
  }
  mount() {
    const { dragControls: i } = this.node.getProps();
    i && (this.removeGroupControls = i.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || De;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Iv = (n) => (i, s) => {
  n && _t.postRender(() => n(i, s));
};
class eD extends gi {
  constructor() {
    super(...arguments), this.removePointerDownListener = De;
  }
  onPointerDown(i) {
    this.session = new m1(i, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: h1(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: i, onPanStart: s, onPan: r, onPanEnd: u } = this.node.getProps();
    return {
      onSessionStart: Iv(i),
      onStart: Iv(s),
      onMove: r,
      onEnd: (f, d) => {
        delete this.session, u && _t.postRender(() => u(f, d));
      }
    };
  }
  mount() {
    this.removePointerDownListener = cl(this.node.current, "pointerdown", (i) => this.onPointerDown(i));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const eo = {
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
function ty(n, i) {
  return i.max === i.min ? 0 : n / (i.max - i.min) * 100;
}
const ll = {
  correct: (n, i) => {
    if (!i.target)
      return n;
    if (typeof n == "string")
      if (ot.test(n))
        n = parseFloat(n);
      else
        return n;
    const s = ty(n, i.target.x), r = ty(n, i.target.y);
    return `${s}% ${r}%`;
  }
}, nD = {
  correct: (n, { treeScale: i, projectionDelta: s }) => {
    const r = n, u = mi.parse(n);
    if (u.length > 5)
      return r;
    const f = mi.createTransformer(n), d = typeof u[0] != "number" ? 1 : 0, h = s.x.scale * i.x, m = s.y.scale * i.y;
    u[0 + d] /= h, u[1 + d] /= m;
    const p = Ut(h, m, 0.5);
    return typeof u[2 + d] == "number" && (u[2 + d] /= p), typeof u[3 + d] == "number" && (u[3 + d] /= p), f(u);
  }
};
class iD extends E.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: i, layoutGroup: s, switchLayoutGroup: r, layoutId: u } = this.props, { projection: f } = i;
    cR(aD), f && (s.group && s.group.add(f), r && r.register && u && r.register(f), f.root.didUpdate(), f.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), f.setOptions({
      ...f.options,
      onExitComplete: () => this.safeToRemove()
    })), eo.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(i) {
    const { layoutDependency: s, visualElement: r, drag: u, isPresent: f } = this.props, d = r.projection;
    return d && (d.isPresent = f, u || i.layoutDependency !== s || s === void 0 || i.isPresent !== f ? d.willUpdate() : this.safeToRemove(), i.isPresent !== f && (f ? d.promote() : d.relegate() || _t.postRender(() => {
      const h = d.getStack();
      (!h || !h.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: i } = this.props.visualElement;
    i && (i.root.didUpdate(), vd.postRender(() => {
      !i.currentAnimation && i.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: i, layoutGroup: s, switchLayoutGroup: r } = this.props, { projection: u } = i;
    u && (u.scheduleCheckAfterUnmount(), s && s.group && s.group.remove(u), r && r.deregister && r.deregister(u));
  }
  safeToRemove() {
    const { safeToRemove: i } = this.props;
    i && i();
  }
  render() {
    return null;
  }
}
function g1(n) {
  const [i, s] = q2(), r = E.useContext(I0);
  return T.jsx(iD, { ...n, layoutGroup: r, switchLayoutGroup: E.useContext(rb), isPresent: i, safeToRemove: s });
}
const aD = {
  borderRadius: {
    ...ll,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: ll,
  borderTopRightRadius: ll,
  borderBottomLeftRadius: ll,
  borderBottomRightRadius: ll,
  boxShadow: nD
};
function sD(n, i, s) {
  const r = ce(n) ? n : xl(n);
  return r.start(Gd("", r, i, s)), r.animation;
}
function lD(n) {
  return n instanceof SVGElement && n.tagName !== "svg";
}
const rD = (n, i) => n.depth - i.depth;
class oD {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(i) {
    Od(this.children, i), this.isDirty = !0;
  }
  remove(i) {
    Nd(this.children, i), this.isDirty = !0;
  }
  forEach(i) {
    this.isDirty && this.children.sort(rD), this.isDirty = !1, this.children.forEach(i);
  }
}
function uD(n, i) {
  const s = on.now(), r = ({ timestamp: u }) => {
    const f = u - s;
    f >= i && (hi(r), n(f - i));
  };
  return _t.read(r, !0), () => hi(r);
}
const v1 = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], cD = v1.length, ey = (n) => typeof n == "string" ? parseFloat(n) : n, ny = (n) => typeof n == "number" || ot.test(n);
function fD(n, i, s, r, u, f) {
  u ? (n.opacity = Ut(
    0,
    // TODO Reinstate this if only child
    s.opacity !== void 0 ? s.opacity : 1,
    dD(r)
  ), n.opacityExit = Ut(i.opacity !== void 0 ? i.opacity : 1, 0, hD(r))) : f && (n.opacity = Ut(i.opacity !== void 0 ? i.opacity : 1, s.opacity !== void 0 ? s.opacity : 1, r));
  for (let d = 0; d < cD; d++) {
    const h = `border${v1[d]}Radius`;
    let m = iy(i, h), p = iy(s, h);
    if (m === void 0 && p === void 0)
      continue;
    m || (m = 0), p || (p = 0), m === 0 || p === 0 || ny(m) === ny(p) ? (n[h] = Math.max(Ut(ey(m), ey(p), r), 0), (rn.test(p) || rn.test(m)) && (n[h] += "%")) : n[h] = p;
  }
  (i.rotate || s.rotate) && (n.rotate = Ut(i.rotate || 0, s.rotate || 0, r));
}
function iy(n, i) {
  return n[i] !== void 0 ? n[i] : n.borderRadius;
}
const dD = /* @__PURE__ */ y1(0, 0.5, jb), hD = /* @__PURE__ */ y1(0.5, 0.95, De);
function y1(n, i, s) {
  return (r) => r < n ? 0 : r > i ? 1 : s(/* @__PURE__ */ Ja(n, i, r));
}
function ay(n, i) {
  n.min = i.min, n.max = i.max;
}
function qe(n, i) {
  ay(n.x, i.x), ay(n.y, i.y);
}
function sy(n, i) {
  n.translate = i.translate, n.scale = i.scale, n.originPoint = i.originPoint, n.origin = i.origin;
}
function ly(n, i, s, r, u) {
  return n -= i, n = po(n, 1 / s, r), u !== void 0 && (n = po(n, 1 / u, r)), n;
}
function mD(n, i = 0, s = 1, r = 0.5, u, f = n, d = n) {
  if (rn.test(i) && (i = parseFloat(i), i = Ut(d.min, d.max, i / 100) - d.min), typeof i != "number")
    return;
  let h = Ut(f.min, f.max, r);
  n === f && (h -= i), n.min = ly(n.min, i, s, h, u), n.max = ly(n.max, i, s, h, u);
}
function ry(n, i, [s, r, u], f, d) {
  mD(n, i[s], i[r], i[u], i.scale, f, d);
}
const pD = ["x", "scaleX", "originX"], gD = ["y", "scaleY", "originY"];
function oy(n, i, s, r) {
  ry(n.x, i, pD, s ? s.x : void 0, r ? r.x : void 0), ry(n.y, i, gD, s ? s.y : void 0, r ? r.y : void 0);
}
function uy(n) {
  return n.translate === 0 && n.scale === 1;
}
function b1(n) {
  return uy(n.x) && uy(n.y);
}
function cy(n, i) {
  return n.min === i.min && n.max === i.max;
}
function vD(n, i) {
  return cy(n.x, i.x) && cy(n.y, i.y);
}
function fy(n, i) {
  return Math.round(n.min) === Math.round(i.min) && Math.round(n.max) === Math.round(i.max);
}
function x1(n, i) {
  return fy(n.x, i.x) && fy(n.y, i.y);
}
function dy(n) {
  return he(n.x) / he(n.y);
}
function hy(n, i) {
  return n.translate === i.translate && n.scale === i.scale && n.originPoint === i.originPoint;
}
class yD {
  constructor() {
    this.members = [];
  }
  add(i) {
    Od(this.members, i), i.scheduleRender();
  }
  remove(i) {
    if (Nd(this.members, i), i === this.prevLead && (this.prevLead = void 0), i === this.lead) {
      const s = this.members[this.members.length - 1];
      s && this.promote(s);
    }
  }
  relegate(i) {
    const s = this.members.findIndex((u) => i === u);
    if (s === 0)
      return !1;
    let r;
    for (let u = s; u >= 0; u--) {
      const f = this.members[u];
      if (f.isPresent !== !1) {
        r = f;
        break;
      }
    }
    return r ? (this.promote(r), !0) : !1;
  }
  promote(i, s) {
    const r = this.lead;
    if (i !== r && (this.prevLead = r, this.lead = i, i.show(), r)) {
      r.instance && r.scheduleRender(), i.scheduleRender(), i.resumeFrom = r, s && (i.resumeFrom.preserveOpacity = !0), r.snapshot && (i.snapshot = r.snapshot, i.snapshot.latestValues = r.animationValues || r.latestValues), i.root && i.root.isUpdating && (i.isLayoutDirty = !0);
      const { crossfade: u } = i.options;
      u === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((i) => {
      const { options: s, resumingFrom: r } = i;
      s.onExitComplete && s.onExitComplete(), r && r.options.onExitComplete && r.options.onExitComplete();
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
function bD(n, i, s) {
  let r = "";
  const u = n.x.translate / i.x, f = n.y.translate / i.y, d = (s == null ? void 0 : s.z) || 0;
  if ((u || f || d) && (r = `translate3d(${u}px, ${f}px, ${d}px) `), (i.x !== 1 || i.y !== 1) && (r += `scale(${1 / i.x}, ${1 / i.y}) `), s) {
    const { transformPerspective: p, rotate: v, rotateX: y, rotateY: x, skewX: S, skewY: R } = s;
    p && (r = `perspective(${p}px) ${r}`), v && (r += `rotate(${v}deg) `), y && (r += `rotateX(${y}deg) `), x && (r += `rotateY(${x}deg) `), S && (r += `skewX(${S}deg) `), R && (r += `skewY(${R}deg) `);
  }
  const h = n.x.scale * i.x, m = n.y.scale * i.y;
  return (h !== 1 || m !== 1) && (r += `scale(${h}, ${m})`), r || "none";
}
const ff = ["", "X", "Y", "Z"], xD = { visibility: "hidden" }, my = 1e3;
let SD = 0;
function df(n, i, s, r) {
  const { latestValues: u } = i;
  u[n] && (s[n] = u[n], i.setStaticValue(n, 0), r && (r[n] = 0));
}
function S1(n) {
  if (n.hasCheckedOptimisedAppear = !0, n.root === n)
    return;
  const { visualElement: i } = n.options;
  if (!i)
    return;
  const s = Tb(i);
  if (window.MotionHasOptimisedAnimation(s, "transform")) {
    const { layout: u, layoutId: f } = n.options;
    window.MotionCancelOptimisedAnimation(s, "transform", _t, !(u || f));
  }
  const { parent: r } = n;
  r && !r.hasCheckedOptimisedAppear && S1(r);
}
function T1({ attachResizeListener: n, defaultParent: i, measureScroll: s, checkIsScrollRoot: r, resetTransform: u }) {
  return class {
    constructor(d = {}, h = i == null ? void 0 : i()) {
      this.id = SD++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(ED), this.nodes.forEach(DD), this.nodes.forEach(OD), this.nodes.forEach(wD);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = d, this.root = h ? h.root || h : this, this.path = h ? [...h.path, h] : [], this.parent = h, this.depth = h ? h.depth + 1 : 0;
      for (let m = 0; m < this.path.length; m++)
        this.path[m].shouldResetTransform = !0;
      this.root === this && (this.nodes = new oD());
    }
    addEventListener(d, h) {
      return this.eventHandlers.has(d) || this.eventHandlers.set(d, new jd()), this.eventHandlers.get(d).add(h);
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
      this.isSVG = lD(d), this.instance = d;
      const { layoutId: m, layout: p, visualElement: v } = this.options;
      if (v && !v.current && v.mount(d), this.root.nodes.add(this), this.parent && this.parent.children.add(this), h && (p || m) && (this.isLayoutDirty = !0), n) {
        let y;
        const x = () => this.root.updateBlockedByResize = !1;
        n(d, () => {
          this.root.updateBlockedByResize = !0, y && y(), y = uD(x, 250), eo.hasAnimatedSinceResize && (eo.hasAnimatedSinceResize = !1, this.nodes.forEach(gy));
        });
      }
      m && this.root.registerSharedNode(m, this), this.options.animate !== !1 && v && (m || p) && this.addEventListener("didUpdate", ({ delta: y, hasLayoutChanged: x, hasRelativeLayoutChanged: S, layout: R }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const A = this.options.transition || v.getDefaultTransition() || VD, { onLayoutAnimationStart: D, onLayoutAnimationComplete: O } = v.getProps(), z = !this.targetLayout || !x1(this.targetLayout, R), U = !x && S;
        if (this.options.layoutRoot || this.resumeFrom || U || x && (z || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(y, U);
          const q = {
            ...Dd(A, "layout"),
            onPlay: D,
            onComplete: O
          };
          (v.shouldReduceMotion || this.options.layoutRoot) && (q.delay = 0, q.type = !1), this.startAnimation(q);
        } else
          x || gy(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = R;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const d = this.getStack();
      d && d.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, hi(this.updateProjection);
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
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(ND), this.animationId++);
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
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && S1(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let v = 0; v < this.path.length; v++) {
        const y = this.path[v];
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
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(py);
        return;
      }
      this.isUpdating || this.nodes.forEach(CD), this.isUpdating = !1, this.nodes.forEach(MD), this.nodes.forEach(TD), this.nodes.forEach(AD), this.clearAllSnapshots();
      const h = on.now();
      se.delta = _n(0, 1e3 / 60, h - se.timestamp), se.timestamp = h, se.isProcessing = !0, nf.update.process(se), nf.preRender.process(se), nf.render.process(se), se.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, vd.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(RD), this.sharedNodes.forEach(jD);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, _t.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      _t.postRender(() => {
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
        const m = r(this.instance);
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
      const d = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, h = this.projectionDelta && !b1(this.projectionDelta), m = this.getTransformTemplate(), p = m ? m(this.latestValues, "") : void 0, v = p !== this.prevTransformTemplateValue;
      d && (h || Yi(this.latestValues) || v) && (u(this.instance, p), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(d = !0) {
      const h = this.measurePageBox();
      let m = this.removeElementScroll(h);
      return d && (m = this.removeTransform(m)), LD(m), {
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
      if (!(((d = this.scroll) === null || d === void 0 ? void 0 : d.wasRoot) || this.path.some(BD))) {
        const { scroll: v } = this.root;
        v && (Xa(m.x, v.offset.x), Xa(m.y, v.offset.y));
      }
      return m;
    }
    removeElementScroll(d) {
      var h;
      const m = Xt();
      if (qe(m, d), !((h = this.scroll) === null || h === void 0) && h.wasRoot)
        return m;
      for (let p = 0; p < this.path.length; p++) {
        const v = this.path[p], { scroll: y, options: x } = v;
        v !== this.root && y && x.layoutScroll && (y.wasRoot && qe(m, d), Xa(m.x, y.offset.x), Xa(m.y, y.offset.y));
      }
      return m;
    }
    applyTransform(d, h = !1) {
      const m = Xt();
      qe(m, d);
      for (let p = 0; p < this.path.length; p++) {
        const v = this.path[p];
        !h && v.options.layoutScroll && v.scroll && v !== v.root && Ka(m, {
          x: -v.scroll.offset.x,
          y: -v.scroll.offset.y
        }), Yi(v.latestValues) && Ka(m, v.latestValues);
      }
      return Yi(this.latestValues) && Ka(m, this.latestValues), m;
    }
    removeTransform(d) {
      const h = Xt();
      qe(h, d);
      for (let m = 0; m < this.path.length; m++) {
        const p = this.path[m];
        if (!p.instance || !Yi(p.latestValues))
          continue;
        qf(p.latestValues) && p.updateSnapshot();
        const v = Xt(), y = p.measurePageBox();
        qe(v, y), oy(h, p.latestValues, p.snapshot ? p.snapshot.layoutBox : void 0, v);
      }
      return Yi(this.latestValues) && oy(h, this.latestValues), h;
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
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== se.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(d = !1) {
      var h;
      const m = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = m.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = m.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = m.isSharedProjectionDirty);
      const p = !!this.resumingFrom || this !== m;
      if (!(d || p && this.isSharedProjectionDirty || this.isProjectionDirty || !((h = this.parent) === null || h === void 0) && h.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: y, layoutId: x } = this.options;
      if (!(!this.layout || !(y || x))) {
        if (this.resolvedRelativeTargetAt = se.timestamp, !this.targetDelta && !this.relativeTarget) {
          const S = this.getClosestProjectingParent();
          S && S.layout && this.animationProgress !== 1 ? (this.relativeParent = S, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Xt(), this.relativeTargetOrigin = Xt(), dl(this.relativeTargetOrigin, this.layout.layoutBox, S.layout.layoutBox), qe(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Xt(), this.targetWithTransforms = Xt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), kM(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : qe(this.target, this.layout.layoutBox), f1(this.target, this.targetDelta)) : qe(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const S = this.getClosestProjectingParent();
          S && !!S.resumingFrom == !!this.resumingFrom && !S.options.layoutScroll && S.target && this.animationProgress !== 1 ? (this.relativeParent = S, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Xt(), this.relativeTargetOrigin = Xt(), dl(this.relativeTargetOrigin, this.target, S.target), qe(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || qf(this.parent.latestValues) || c1(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var d;
      const h = this.getLead(), m = !!this.resumingFrom || this !== h;
      let p = !0;
      if ((this.isProjectionDirty || !((d = this.parent) === null || d === void 0) && d.isProjectionDirty) && (p = !1), m && (this.isSharedProjectionDirty || this.isTransformDirty) && (p = !1), this.resolvedRelativeTargetAt === se.timestamp && (p = !1), p)
        return;
      const { layout: v, layoutId: y } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(v || y))
        return;
      qe(this.layoutCorrected, this.layout.layoutBox);
      const x = this.treeScale.x, S = this.treeScale.y;
      HM(this.layoutCorrected, this.treeScale, this.path, m), h.layout && !h.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (h.target = h.layout.layoutBox, h.targetWithTransforms = Xt());
      const { target: R } = h;
      if (!R) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (sy(this.prevProjectionDelta.x, this.projectionDelta.x), sy(this.prevProjectionDelta.y, this.projectionDelta.y)), fl(this.projectionDelta, this.layoutCorrected, R, this.latestValues), (this.treeScale.x !== x || this.treeScale.y !== S || !hy(this.projectionDelta.x, this.prevProjectionDelta.x) || !hy(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", R));
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
      this.prevProjectionDelta = Ya(), this.projectionDelta = Ya(), this.projectionDeltaWithTransform = Ya();
    }
    setAnimationOrigin(d, h = !1) {
      const m = this.snapshot, p = m ? m.latestValues : {}, v = { ...this.latestValues }, y = Ya();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !h;
      const x = Xt(), S = m ? m.source : void 0, R = this.layout ? this.layout.source : void 0, A = S !== R, D = this.getStack(), O = !D || D.members.length <= 1, z = !!(A && !O && this.options.crossfade === !0 && !this.path.some(zD));
      this.animationProgress = 0;
      let U;
      this.mixTargetDelta = (q) => {
        const B = q / 1e3;
        vy(y.x, d.x, B), vy(y.y, d.y, B), this.setTargetDelta(y), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (dl(x, this.layout.layoutBox, this.relativeParent.layout.layoutBox), _D(this.relativeTarget, this.relativeTargetOrigin, x, B), U && vD(this.relativeTarget, U) && (this.isProjectionDirty = !1), U || (U = Xt()), qe(U, this.relativeTarget)), A && (this.animationValues = v, fD(v, p, this.latestValues, B, z, O)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = B;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(d) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (hi(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = _t.update(() => {
        eo.hasAnimatedSinceResize = !0, this.currentAnimation = sD(0, my, {
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
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(my), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const d = this.getLead();
      let { targetWithTransforms: h, target: m, layout: p, latestValues: v } = d;
      if (!(!h || !m || !p)) {
        if (this !== d && this.layout && p && A1(this.options.animationType, this.layout.layoutBox, p.layoutBox)) {
          m = this.target || Xt();
          const y = he(this.layout.layoutBox.x);
          m.x.min = d.target.x.min, m.x.max = m.x.min + y;
          const x = he(this.layout.layoutBox.y);
          m.y.min = d.target.y.min, m.y.max = m.y.min + x;
        }
        qe(h, m), Ka(h, v), fl(this.projectionDeltaWithTransform, this.layoutCorrected, h, v);
      }
    }
    registerSharedNode(d, h) {
      this.sharedNodes.has(d) || this.sharedNodes.set(d, new yD()), this.sharedNodes.get(d).add(h);
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
      m.z && df("z", d, p, this.animationValues);
      for (let v = 0; v < ff.length; v++)
        df(`rotate${ff[v]}`, d, p, this.animationValues), df(`skew${ff[v]}`, d, p, this.animationValues);
      d.render();
      for (const v in p)
        d.setStaticValue(v, p[v]), this.animationValues && (this.animationValues[v] = p[v]);
      d.scheduleRender();
    }
    getProjectionStyles(d) {
      var h, m;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return xD;
      const p = {
        visibility: ""
      }, v = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, p.opacity = "", p.pointerEvents = Ir(d == null ? void 0 : d.pointerEvents) || "", p.transform = v ? v(this.latestValues, "") : "none", p;
      const y = this.getLead();
      if (!this.projectionDelta || !this.layout || !y.target) {
        const A = {};
        return this.options.layoutId && (A.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, A.pointerEvents = Ir(d == null ? void 0 : d.pointerEvents) || ""), this.hasProjected && !Yi(this.latestValues) && (A.transform = v ? v({}, "") : "none", this.hasProjected = !1), A;
      }
      const x = y.animationValues || y.latestValues;
      this.applyTransformsToTarget(), p.transform = bD(this.projectionDeltaWithTransform, this.treeScale, x), v && (p.transform = v(x, p.transform));
      const { x: S, y: R } = this.projectionDelta;
      p.transformOrigin = `${S.origin * 100}% ${R.origin * 100}% 0`, y.animationValues ? p.opacity = y === this ? (m = (h = x.opacity) !== null && h !== void 0 ? h : this.latestValues.opacity) !== null && m !== void 0 ? m : 1 : this.preserveOpacity ? this.latestValues.opacity : x.opacityExit : p.opacity = y === this ? x.opacity !== void 0 ? x.opacity : "" : x.opacityExit !== void 0 ? x.opacityExit : 0;
      for (const A in vl) {
        if (x[A] === void 0)
          continue;
        const { correct: D, applyTo: O, isCSSVariable: z } = vl[A], U = p.transform === "none" ? x[A] : D(x[A], y);
        if (O) {
          const q = O.length;
          for (let B = 0; B < q; B++)
            p[O[B]] = U;
        } else
          z ? this.options.visualElement.renderState.vars[A] = U : p[A] = U;
      }
      return this.options.layoutId && (p.pointerEvents = y === this ? Ir(d == null ? void 0 : d.pointerEvents) || "" : "none"), p;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((d) => {
        var h;
        return (h = d.currentAnimation) === null || h === void 0 ? void 0 : h.stop();
      }), this.root.nodes.forEach(py), this.root.sharedNodes.clear();
    }
  };
}
function TD(n) {
  n.updateLayout();
}
function AD(n) {
  var i;
  const s = ((i = n.resumeFrom) === null || i === void 0 ? void 0 : i.snapshot) || n.snapshot;
  if (n.isLead() && n.layout && s && n.hasListeners("didUpdate")) {
    const { layoutBox: r, measuredBox: u } = n.layout, { animationType: f } = n.options, d = s.source !== n.layout.source;
    f === "size" ? Ge((y) => {
      const x = d ? s.measuredBox[y] : s.layoutBox[y], S = he(x);
      x.min = r[y].min, x.max = x.min + S;
    }) : A1(f, s.layoutBox, r) && Ge((y) => {
      const x = d ? s.measuredBox[y] : s.layoutBox[y], S = he(r[y]);
      x.max = x.min + S, n.relativeTarget && !n.currentAnimation && (n.isProjectionDirty = !0, n.relativeTarget[y].max = n.relativeTarget[y].min + S);
    });
    const h = Ya();
    fl(h, r, s.layoutBox);
    const m = Ya();
    d ? fl(m, n.applyTransform(u, !0), s.measuredBox) : fl(m, r, s.layoutBox);
    const p = !b1(h);
    let v = !1;
    if (!n.resumeFrom) {
      const y = n.getClosestProjectingParent();
      if (y && !y.resumeFrom) {
        const { snapshot: x, layout: S } = y;
        if (x && S) {
          const R = Xt();
          dl(R, s.layoutBox, x.layoutBox);
          const A = Xt();
          dl(A, r, S.layoutBox), x1(R, A) || (v = !0), y.options.layoutRoot && (n.relativeTarget = A, n.relativeTargetOrigin = R, n.relativeParent = y);
        }
      }
    }
    n.notifyListeners("didUpdate", {
      layout: r,
      snapshot: s,
      delta: m,
      layoutDelta: h,
      hasLayoutChanged: p,
      hasRelativeLayoutChanged: v
    });
  } else if (n.isLead()) {
    const { onExitComplete: r } = n.options;
    r && r();
  }
  n.options.transition = void 0;
}
function ED(n) {
  n.parent && (n.isProjecting() || (n.isProjectionDirty = n.parent.isProjectionDirty), n.isSharedProjectionDirty || (n.isSharedProjectionDirty = !!(n.isProjectionDirty || n.parent.isProjectionDirty || n.parent.isSharedProjectionDirty)), n.isTransformDirty || (n.isTransformDirty = n.parent.isTransformDirty));
}
function wD(n) {
  n.isProjectionDirty = n.isSharedProjectionDirty = n.isTransformDirty = !1;
}
function RD(n) {
  n.clearSnapshot();
}
function py(n) {
  n.clearMeasurements();
}
function CD(n) {
  n.isLayoutDirty = !1;
}
function MD(n) {
  const { visualElement: i } = n.options;
  i && i.getProps().onBeforeLayoutMeasure && i.notify("BeforeLayoutMeasure"), n.resetTransform();
}
function gy(n) {
  n.finishAnimation(), n.targetDelta = n.relativeTarget = n.target = void 0, n.isProjectionDirty = !0;
}
function DD(n) {
  n.resolveTargetDelta();
}
function OD(n) {
  n.calcProjection();
}
function ND(n) {
  n.resetSkewAndRotation();
}
function jD(n) {
  n.removeLeadSnapshot();
}
function vy(n, i, s) {
  n.translate = Ut(i.translate, 0, s), n.scale = Ut(i.scale, 1, s), n.origin = i.origin, n.originPoint = i.originPoint;
}
function yy(n, i, s, r) {
  n.min = Ut(i.min, s.min, r), n.max = Ut(i.max, s.max, r);
}
function _D(n, i, s, r) {
  yy(n.x, i.x, s.x, r), yy(n.y, i.y, s.y, r);
}
function zD(n) {
  return n.animationValues && n.animationValues.opacityExit !== void 0;
}
const VD = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, by = (n) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(n), xy = by("applewebkit/") && !by("chrome/") ? Math.round : De;
function Sy(n) {
  n.min = xy(n.min), n.max = xy(n.max);
}
function LD(n) {
  Sy(n.x), Sy(n.y);
}
function A1(n, i, s) {
  return n === "position" || n === "preserve-aspect" && !UM(dy(i), dy(s), 0.2);
}
function BD(n) {
  var i;
  return n !== n.root && ((i = n.scroll) === null || i === void 0 ? void 0 : i.wasRoot);
}
const UD = T1({
  attachResizeListener: (n, i) => Tl(n, "resize", i),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), hf = {
  current: void 0
}, E1 = T1({
  measureScroll: (n) => ({
    x: n.scrollLeft,
    y: n.scrollTop
  }),
  defaultParent: () => {
    if (!hf.current) {
      const n = new UD({});
      n.mount(window), n.setOptions({ layoutScroll: !0 }), hf.current = n;
    }
    return hf.current;
  },
  resetTransform: (n, i) => {
    n.style.transform = i !== void 0 ? i : "none";
  },
  checkIsScrollRoot: (n) => window.getComputedStyle(n).position === "fixed"
}), kD = {
  pan: {
    Feature: eD
  },
  drag: {
    Feature: tD,
    ProjectionNode: E1,
    MeasureLayout: g1
  }
};
function HD(n, i, s) {
  var r;
  if (n instanceof EventTarget)
    return [n];
  if (typeof n == "string") {
    let u = document;
    const f = (r = void 0) !== null && r !== void 0 ? r : u.querySelectorAll(n);
    return f ? Array.from(f) : [];
  }
  return Array.from(n);
}
function w1(n, i) {
  const s = HD(n), r = new AbortController(), u = {
    passive: !0,
    ...i,
    signal: r.signal
  };
  return [s, u, () => r.abort()];
}
function Ty(n) {
  return !(n.pointerType === "touch" || l1());
}
function PD(n, i, s = {}) {
  const [r, u, f] = w1(n, s), d = (h) => {
    if (!Ty(h))
      return;
    const { target: m } = h, p = i(m, h);
    if (typeof p != "function" || !m)
      return;
    const v = (y) => {
      Ty(y) && (p(y), m.removeEventListener("pointerleave", v));
    };
    m.addEventListener("pointerleave", v, u);
  };
  return r.forEach((h) => {
    h.addEventListener("pointerenter", d, u);
  }), f;
}
function Ay(n, i, s) {
  const { props: r } = n;
  n.animationState && r.whileHover && n.animationState.setActive("whileHover", s === "Start");
  const u = "onHover" + s, f = r[u];
  f && _t.postRender(() => f(i, Cl(i)));
}
class qD extends gi {
  mount() {
    const { current: i } = this.node;
    i && (this.unmount = PD(i, (s, r) => (Ay(this.node, r, "Start"), (u) => Ay(this.node, u, "End"))));
  }
  unmount() {
  }
}
class GD extends gi {
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
    this.unmount = Rl(Tl(this.node.current, "focus", () => this.onFocus()), Tl(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const R1 = (n, i) => i ? n === i ? !0 : R1(n, i.parentElement) : !1, YD = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function XD(n) {
  return YD.has(n.tagName) || n.tabIndex !== -1;
}
const ol = /* @__PURE__ */ new WeakSet();
function Ey(n) {
  return (i) => {
    i.key === "Enter" && n(i);
  };
}
function mf(n, i) {
  n.dispatchEvent(new PointerEvent("pointer" + i, { isPrimary: !0, bubbles: !0 }));
}
const KD = (n, i) => {
  const s = n.currentTarget;
  if (!s)
    return;
  const r = Ey(() => {
    if (ol.has(s))
      return;
    mf(s, "down");
    const u = Ey(() => {
      mf(s, "up");
    }), f = () => mf(s, "cancel");
    s.addEventListener("keyup", u, i), s.addEventListener("blur", f, i);
  });
  s.addEventListener("keydown", r, i), s.addEventListener("blur", () => s.removeEventListener("keydown", r), i);
};
function wy(n) {
  return Yd(n) && !l1();
}
function ZD(n, i, s = {}) {
  const [r, u, f] = w1(n, s), d = (h) => {
    const m = h.currentTarget;
    if (!wy(h) || ol.has(m))
      return;
    ol.add(m);
    const p = i(m, h), v = (S, R) => {
      window.removeEventListener("pointerup", y), window.removeEventListener("pointercancel", x), !(!wy(S) || !ol.has(m)) && (ol.delete(m), typeof p == "function" && p(S, { success: R }));
    }, y = (S) => {
      v(S, m === window || m === document || s.useGlobalTarget || R1(m, S.target));
    }, x = (S) => {
      v(S, !1);
    };
    window.addEventListener("pointerup", y, u), window.addEventListener("pointercancel", x, u);
  };
  return r.forEach((h) => {
    (s.useGlobalTarget ? window : h).addEventListener("pointerdown", d, u), h instanceof HTMLElement && (h.addEventListener("focus", (p) => KD(p, u)), !XD(h) && h.tabIndex === null && (h.tabIndex = 0));
  }), f;
}
function Ry(n, i, s) {
  const { props: r } = n;
  if (n.current instanceof HTMLButtonElement && n.current.disabled)
    return;
  n.animationState && r.whileTap && n.animationState.setActive("whileTap", s === "Start");
  const u = "onTap" + (s === "End" ? "" : s), f = r[u];
  f && _t.postRender(() => f(i, Cl(i)));
}
class QD extends gi {
  mount() {
    const { current: i } = this.node;
    i && (this.unmount = ZD(i, (s, r) => (Ry(this.node, r, "Start"), (u, { success: f }) => Ry(this.node, u, f ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Xf = /* @__PURE__ */ new WeakMap(), pf = /* @__PURE__ */ new WeakMap(), FD = (n) => {
  const i = Xf.get(n.target);
  i && i(n);
}, WD = (n) => {
  n.forEach(FD);
};
function $D({ root: n, ...i }) {
  const s = n || document;
  pf.has(s) || pf.set(s, {});
  const r = pf.get(s), u = JSON.stringify(i);
  return r[u] || (r[u] = new IntersectionObserver(WD, { root: n, ...i })), r[u];
}
function JD(n, i, s) {
  const r = $D(i);
  return Xf.set(n, s), r.observe(n), () => {
    Xf.delete(n), r.unobserve(n);
  };
}
const ID = {
  some: 0,
  all: 1
};
class tO extends gi {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: i = {} } = this.node.getProps(), { root: s, margin: r, amount: u = "some", once: f } = i, d = {
      root: s ? s.current : void 0,
      rootMargin: r,
      threshold: typeof u == "number" ? u : ID[u]
    }, h = (m) => {
      const { isIntersecting: p } = m;
      if (this.isInView === p || (this.isInView = p, f && !p && this.hasEnteredView))
        return;
      p && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", p);
      const { onViewportEnter: v, onViewportLeave: y } = this.node.getProps(), x = p ? v : y;
      x && x(m);
    };
    return JD(this.node.current, d, h);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: i, prevProps: s } = this.node;
    ["amount", "margin", "root"].some(eO(i, s)) && this.startObserver();
  }
  unmount() {
  }
}
function eO({ viewport: n = {} }, { viewport: i = {} } = {}) {
  return (s) => n[s] !== i[s];
}
const nO = {
  inView: {
    Feature: tO
  },
  tap: {
    Feature: QD
  },
  focus: {
    Feature: GD
  },
  hover: {
    Feature: qD
  }
}, iO = {
  layout: {
    ProjectionNode: E1,
    MeasureLayout: g1
  }
}, go = { current: null }, Xd = { current: !1 };
function C1() {
  if (Xd.current = !0, !!hd)
    if (window.matchMedia) {
      const n = window.matchMedia("(prefers-reduced-motion)"), i = () => go.current = n.matches;
      n.addListener(i), i();
    } else
      go.current = !1;
}
const aO = [...Zb, ue, mi], sO = (n) => aO.find(Kb(n)), lO = /* @__PURE__ */ new WeakMap();
function rO(n, i, s) {
  for (const r in i) {
    const u = i[r], f = s[r];
    if (ce(u))
      n.addValue(r, u);
    else if (ce(f))
      n.addValue(r, xl(u, { owner: n }));
    else if (f !== u)
      if (n.hasValue(r)) {
        const d = n.getValue(r);
        d.liveStyle === !0 ? d.jump(u) : d.hasAnimated || d.set(u);
      } else {
        const d = n.getStaticValue(r);
        n.addValue(r, xl(d !== void 0 ? d : u, { owner: n }));
      }
  }
  for (const r in s)
    i[r] === void 0 && n.removeValue(r);
  return i;
}
const Cy = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class oO {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(i, s, r) {
    return {};
  }
  constructor({ parent: i, props: s, presenceContext: r, reducedMotionConfig: u, blockInitialAnimation: f, visualState: d }, h = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Hd, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const S = on.now();
      this.renderScheduledAt < S && (this.renderScheduledAt = S, _t.render(this.render, !1, !0));
    };
    const { latestValues: m, renderState: p, onUpdate: v } = d;
    this.onUpdate = v, this.latestValues = m, this.baseTarget = { ...m }, this.initialValues = s.initial ? { ...m } : {}, this.renderState = p, this.parent = i, this.props = s, this.presenceContext = r, this.depth = i ? i.depth + 1 : 0, this.reducedMotionConfig = u, this.options = h, this.blockInitialAnimation = !!f, this.isControllingVariants = Oo(s), this.isVariantNode = sb(s), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(i && i.current);
    const { willChange: y, ...x } = this.scrapeMotionValuesFromProps(s, {}, this);
    for (const S in x) {
      const R = x[S];
      m[S] !== void 0 && ce(R) && R.set(m[S], !1);
    }
  }
  mount(i) {
    this.current = i, lO.set(i, this), this.projection && !this.projection.instance && this.projection.mount(i), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, r) => this.bindToMotionValue(r, s)), Xd.current || C1(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : go.current, this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), hi(this.notifyUpdate), hi(this.render), this.valueSubscriptions.forEach((i) => i()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
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
    const r = Ii.has(i);
    r && this.onBindTransform && this.onBindTransform();
    const u = s.on("change", (h) => {
      this.latestValues[i] = h, this.props.onUpdate && _t.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = !0);
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
    for (i in $a) {
      const s = $a[i];
      if (!s)
        continue;
      const { isEnabled: r, Feature: u } = s;
      if (!this.features[i] && u && r(this.props) && (this.features[i] = new u(this)), this.features[i]) {
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
    for (let r = 0; r < Cy.length; r++) {
      const u = Cy[r];
      this.propEventSubscriptions[u] && (this.propEventSubscriptions[u](), delete this.propEventSubscriptions[u]);
      const f = "on" + u, d = i[f];
      d && (this.propEventSubscriptions[u] = this.on(u, d));
    }
    this.prevMotionValues = rO(this, this.scrapeMotionValuesFromProps(i, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
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
    const r = this.values.get(i);
    s !== r && (r && this.removeValue(i), this.bindToMotionValue(i, s), this.values.set(i, s), this.latestValues[i] = s.get());
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
    let r = this.values.get(i);
    return r === void 0 && s !== void 0 && (r = xl(s === null ? void 0 : s, { owner: this }), this.addValue(i, r)), r;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(i, s) {
    var r;
    let u = this.latestValues[i] !== void 0 || !this.current ? this.latestValues[i] : (r = this.getBaseTargetFromProps(this.props, i)) !== null && r !== void 0 ? r : this.readValueFromInstance(this.current, i, this.options);
    return u != null && (typeof u == "string" && (Yb(u) || zb(u)) ? u = parseFloat(u) : !sO(u) && mi.test(s) && (u = Pb(i, s)), this.setBaseTarget(i, ce(u) ? u.get() : u)), ce(u) ? u.get() : u;
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
    const { initial: r } = this.props;
    let u;
    if (typeof r == "string" || typeof r == "object") {
      const d = Cd(this.props, r, (s = this.presenceContext) === null || s === void 0 ? void 0 : s.custom);
      d && (u = d[i]);
    }
    if (r && u !== void 0)
      return u;
    const f = this.getBaseTargetFromProps(this.props, i);
    return f !== void 0 && !ce(f) ? f : this.initialValues[i] !== void 0 && u === void 0 ? void 0 : this.baseTarget[i];
  }
  on(i, s) {
    return this.events[i] || (this.events[i] = new jd()), this.events[i].add(s);
  }
  notify(i, ...s) {
    this.events[i] && this.events[i].notify(...s);
  }
}
class M1 extends oO {
  constructor() {
    super(...arguments), this.KeyframeResolver = Qb;
  }
  sortInstanceNodePosition(i, s) {
    return i.compareDocumentPosition(s) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(i, s) {
    return i.style ? i.style[s] : void 0;
  }
  removeValueFromRenderState(i, { vars: s, style: r }) {
    delete s[i], delete r[i];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: i } = this.props;
    ce(i) && (this.childSubscription = i.on("change", (s) => {
      this.current && (this.current.textContent = `${s}`);
    }));
  }
}
function uO(n) {
  return window.getComputedStyle(n);
}
class cO extends M1 {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = gb;
  }
  readValueFromInstance(i, s) {
    if (Ii.has(s))
      return pC(i, s);
    {
      const r = uO(i), u = (bd(s) ? r.getPropertyValue(s) : r[s]) || 0;
      return typeof u == "string" ? u.trim() : u;
    }
  }
  measureInstanceViewportBox(i, { transformPagePoint: s }) {
    return d1(i, s);
  }
  build(i, s, r) {
    Td(i, s, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(i, s, r) {
    return Md(i, s, r);
  }
}
class fO extends M1 {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Xt, this.updateDimensions = () => {
      this.current && !this.renderState.dimensions && pb(this.current, this.renderState);
    };
  }
  getBaseTargetFromProps(i, s) {
    return i[s];
  }
  readValueFromInstance(i, s) {
    if (Ii.has(s)) {
      const r = Hb(s);
      return r && r.default || 0;
    }
    return s = vb.has(s) ? s : yd(s), i.getAttribute(s);
  }
  scrapeMotionValuesFromProps(i, s, r) {
    return bb(i, s, r);
  }
  onBindTransform() {
    this.current && !this.renderState.dimensions && _t.postRender(this.updateDimensions);
  }
  build(i, s, r) {
    wd(i, s, this.isSVGTag, r.transformTemplate);
  }
  renderInstance(i, s, r, u) {
    yb(i, s, r, u);
  }
  mount(i) {
    this.isSVGTag = Rd(i.tagName), super.mount(i);
  }
}
const dO = (n, i) => Ed(n) ? new fO(i) : new cO(i, {
  allowProjection: n !== E.Fragment
}), hO = /* @__PURE__ */ zR({
  ...DM,
  ...nO,
  ...kD,
  ...iO
}, dO), mO = /* @__PURE__ */ W2(hO);
function pO() {
  !Xd.current && C1();
  const [n] = E.useState(go.current);
  return n;
}
function gO({ state: n }) {
  var r;
  const i = pO(), s = ["viewer", "reviewer"].includes(((r = n.status.principal) == null ? void 0 : r.role) || "");
  return /* @__PURE__ */ T.jsxs(mO.section, { className: "home-banner", initial: i ? !1 : { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 }, children: [
    /* @__PURE__ */ T.jsxs("div", { children: [
      /* @__PURE__ */ T.jsx("h1", { children: "Meja kerja regulasi" }),
      /* @__PURE__ */ T.jsx("p", { children: "Lanjutkan rancangan, tinjau temuan, atau uji alternatif kebijakan." })
    ] }),
    /* @__PURE__ */ T.jsxs("div", { className: "actions", children: [
      /* @__PURE__ */ T.jsxs(Ye, { disabled: s, "data-action": "import", children: [
        /* @__PURE__ */ T.jsx(RE, { size: 16 }),
        "Impor dokumen"
      ] }),
      /* @__PURE__ */ T.jsxs(Ye, { variant: "primary", disabled: s, "data-action": "new", children: [
        /* @__PURE__ */ T.jsx(OE, { size: 16 }),
        "Rancangan baru"
      ] })
    ] })
  ] });
}
function vO({ state: n }) {
  const i = n.jobs.filter((r) => ["queued", "running", "cancelling"].includes(r.status)).length, s = [
    ["Rancangan", n.drafts.length, "Dalam workspace", pl],
    ["Sumber regulasi", n.status.regulations ?? n.corpus.length, `${n.status.articles ?? 0} pasal/blok`, Tf],
    ["Hasil pada naskah", n.runs.length, "Pemeriksaan dan simulasi", ro],
    ["Agen berjalan", i, "Pada naskah yang dipilih", ld]
  ];
  return /* @__PURE__ */ T.jsx("div", { className: "workspace-metrics", children: s.map(([r, u, f, d]) => /* @__PURE__ */ T.jsxs("div", { className: "workspace-metric", children: [
    /* @__PURE__ */ T.jsxs("div", { children: [
      /* @__PURE__ */ T.jsx("span", { children: r }),
      /* @__PURE__ */ T.jsx("strong", { children: u }),
      /* @__PURE__ */ T.jsx("small", { children: f })
    ] }),
    /* @__PURE__ */ T.jsx(d, { size: 19, "aria-hidden": "true" })
  ] }, r)) });
}
function D1({ state: n }) {
  var f, d, h;
  const i = n.runs.filter((m) => m.review_status === "needs_review"), s = n.runs.find((m) => m.kind === "analysis"), r = ["viewer", "reviewer"].includes(((f = n.status.principal) == null ? void 0 : f.role) || ""), u = [
    ["editor", "01", "Susun rancangan", "Edit pasal dan jalankan asisten dari satu layar.", pl],
    ["analysis", "02", "Tinjau potensi konflik", "Periksa kutipan, hierarki, dan interpretasi.", ro],
    ["social", "03", "Eksplorasi reaksi", "Ikuti pendapat dan balasan lima persona sintetis.", ld]
  ];
  return /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
    /* @__PURE__ */ T.jsx(gO, { state: n }),
    /* @__PURE__ */ T.jsx(vO, { state: n }),
    /* @__PURE__ */ T.jsxs("section", { className: "resume-workspace", "aria-label": "Rancangan aktif", children: [
      /* @__PURE__ */ T.jsxs("div", { className: "resume-manuscript", children: [
        /* @__PURE__ */ T.jsx("span", { className: "resume-type", children: n.draft.title }),
        /* @__PURE__ */ T.jsx("div", { className: "resume-clause", children: n.draft.articles[0] ? /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
          /* @__PURE__ */ T.jsxs("b", { children: [
            "Pasal ",
            n.draft.articles[0].number
          ] }),
          /* @__PURE__ */ T.jsx("p", { children: n.draft.articles[0].text })
        ] }) : /* @__PURE__ */ T.jsx("p", { children: "Isi pasal akan tampil setelah rancangan disusun." }) }),
        /* @__PURE__ */ T.jsxs("span", { className: "resume-version", children: [
          "Versi ",
          n.draft.revision,
          " · ",
          n.draft.articles.length,
          " pasal"
        ] })
      ] }),
      /* @__PURE__ */ T.jsxs("div", { className: "resume-copy", children: [
        /* @__PURE__ */ T.jsx("span", { className: "resume-label", children: "Rancangan aktif" }),
        /* @__PURE__ */ T.jsx("h2", { children: "Lanjutkan dari naskah Anda." }),
        /* @__PURE__ */ T.jsx("p", { children: "Baca pasal, periksa sumber, dan uji alternatif di editor." }),
        /* @__PURE__ */ T.jsxs(Ye, { variant: "primary", "data-view": "editor", children: [
          "Buka editor",
          /* @__PURE__ */ T.jsx(Ba, { size: 16 })
        ] }),
        /* @__PURE__ */ T.jsxs(Ye, { variant: "ghost", "data-view": "gallery", children: [
          "Belajar dari dokumen",
          /* @__PURE__ */ T.jsx(Tf, { size: 16 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ T.jsxs("div", { className: "home-bottom", children: [
      /* @__PURE__ */ T.jsxs("section", { className: "panel draft-collection", children: [
        /* @__PURE__ */ T.jsxs("div", { className: "panel-head", children: [
          /* @__PURE__ */ T.jsxs("div", { children: [
            /* @__PURE__ */ T.jsx("h2", { children: "Rancangan Anda" }),
            /* @__PURE__ */ T.jsxs("p", { children: [
              n.drafts.length,
              " naskah tersimpan"
            ] })
          ] }),
          /* @__PURE__ */ T.jsxs(Ye, { size: "small", disabled: r, "data-action": "generate", children: [
            "Mulai dari brief",
            /* @__PURE__ */ T.jsx(Ba, { size: 14 })
          ] })
        ] }),
        /* @__PURE__ */ T.jsxs("div", { className: "draft-table", role: "table", "aria-label": "Rancangan tersimpan", children: [
          /* @__PURE__ */ T.jsxs("div", { className: "draft-table-head", role: "row", children: [
            /* @__PURE__ */ T.jsx("span", { role: "columnheader", children: "Naskah" }),
            /* @__PURE__ */ T.jsx("span", { role: "columnheader", children: "Versi" }),
            /* @__PURE__ */ T.jsx("span", { role: "columnheader", children: "Tindakan" })
          ] }),
          n.drafts.map((m, p) => /* @__PURE__ */ T.jsxs("div", { className: "resume-row", role: "row", children: [
            /* @__PURE__ */ T.jsxs("div", { role: "cell", className: "draft-cell", children: [
              /* @__PURE__ */ T.jsx("span", { className: "document-icon", children: /* @__PURE__ */ T.jsx(pl, { size: 18 }) }),
              /* @__PURE__ */ T.jsxs("div", { children: [
                /* @__PURE__ */ T.jsx("h3", { children: m.title || "Rancangan" }),
                /* @__PURE__ */ T.jsxs("span", { className: "micro", children: [
                  m.regulation_type || "Naskah regulasi",
                  m.id === n.draft.id ? " · Sedang dipilih" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ T.jsxs("span", { role: "cell", className: "version-label", children: [
              "v",
              m.revision ?? 1
            ] }),
            /* @__PURE__ */ T.jsx("div", { role: "cell", children: /* @__PURE__ */ T.jsxs(Ye, { size: "small", variant: "ghost", "data-action": "open-draft", "data-id": m.id, children: [
              "Buka",
              /* @__PURE__ */ T.jsx(p0, { size: 15 })
            ] }) })
          ] }, m.id || p))
        ] })
      ] }),
      /* @__PURE__ */ T.jsxs("aside", { className: "panel review-inbox", children: [
        /* @__PURE__ */ T.jsxs("div", { className: "panel-head", children: [
          /* @__PURE__ */ T.jsx("h2", { children: "Perlu perhatian" }),
          /* @__PURE__ */ T.jsx(EE, { size: 16 })
        ] }),
        /* @__PURE__ */ T.jsxs("div", { className: "panel-body", children: [
          /* @__PURE__ */ T.jsx("span", { className: "inbox-count", children: i.length }),
          /* @__PURE__ */ T.jsx("h3", { children: "hasil menunggu review" }),
          /* @__PURE__ */ T.jsxs("p", { children: [
            "Pada rancangan “",
            n.draft.title,
            "”."
          ] }),
          s && /* @__PURE__ */ T.jsxs("div", { className: "inbox-context", children: [
            /* @__PURE__ */ T.jsx(ro, { size: 16 }),
            /* @__PURE__ */ T.jsxs("span", { children: [
              ((h = (d = s.payload) == null ? void 0 : d.findings) == null ? void 0 : h.length) ?? 0,
              " temuan pada pemeriksaan terakhir ",
              /* @__PURE__ */ T.jsxs("small", { children: [
                "Snapshot v",
                s.revision
              ] })
            ] })
          ] }),
          /* @__PURE__ */ T.jsxs(Ye, { "data-view": "history", children: [
            "Tinjau hasil",
            /* @__PURE__ */ T.jsx(Ba, { size: 14 })
          ] })
        ] }),
        /* @__PURE__ */ T.jsx("div", { className: "inbox-foot", children: "Keputusan dan penerapan revisi tetap melalui reviewer." })
      ] })
    ] }),
    /* @__PURE__ */ T.jsxs("section", { className: "home-grid", "aria-label": "Langkah kerja", children: [
      /* @__PURE__ */ T.jsxs("div", { className: "section-toolbar", children: [
        /* @__PURE__ */ T.jsxs("div", { children: [
          /* @__PURE__ */ T.jsx("h2", { children: "Lanjutkan alur Anda" }),
          /* @__PURE__ */ T.jsx("p", { children: "Susun naskah, periksa sumber, lalu pertimbangkan dampaknya." })
        ] }),
        /* @__PURE__ */ T.jsxs(Ye, { variant: "ghost", "data-action": "legal-guide", children: [
          "Pedoman legal",
          /* @__PURE__ */ T.jsx(Ba, { size: 14 })
        ] })
      ] }),
      /* @__PURE__ */ T.jsx("div", { className: "workspace-paths", children: u.map(([m, p, v, y, x]) => /* @__PURE__ */ T.jsxs("button", { className: "workspace-path", "data-view": m, children: [
        /* @__PURE__ */ T.jsxs("div", { children: [
          /* @__PURE__ */ T.jsx(x, { size: 19 }),
          /* @__PURE__ */ T.jsx("span", { children: p })
        ] }),
        /* @__PURE__ */ T.jsx("h3", { children: v }),
        /* @__PURE__ */ T.jsx("p", { children: y }),
        /* @__PURE__ */ T.jsx(Ba, { size: 17, className: "path-arrow" })
      ] }, m)) })
    ] }),
    /* @__PURE__ */ T.jsxs("div", { className: "workspace-provenance", children: [
      /* @__PURE__ */ T.jsx(Tf, { size: 15 }),
      /* @__PURE__ */ T.jsxs("span", { children: [
        n.status.regulations ?? n.corpus.length,
        " sumber regulasi · ",
        n.status.articles ?? 0,
        " pasal/blok"
      ] }),
      /* @__PURE__ */ T.jsx("span", { children: n.status.provider === "demo" ? "Demo tanpa kredensial" : `Provider ${n.status.provider}` }),
      /* @__PURE__ */ T.jsxs(Ye, { size: "small", variant: "ghost", "data-view": "corpus", children: [
        "Lihat sumber",
        /* @__PURE__ */ T.jsx(Ba, { size: 13 })
      ] })
    ] })
  ] });
}
function yO({ state: n }) {
  return /* @__PURE__ */ T.jsxs("div", { className: "workspace-context", children: [
    /* @__PURE__ */ T.jsxs("span", { className: "context-document", children: [
      /* @__PURE__ */ T.jsx(pl, { size: 14 }),
      n.draft.title
    ] }),
    /* @__PURE__ */ T.jsxs("span", { className: "context-version", children: [
      "v",
      n.draft.revision
    ] }),
    /* @__PURE__ */ T.jsx("span", { className: n.dirty ? "context-dirty" : "context-saved", children: n.dirty ? "Belum disimpan" : "Naskah tersimpan" }),
    n.view !== "editor" && /* @__PURE__ */ T.jsxs(Ye, { size: "small", variant: "ghost", "data-view": "editor", children: [
      "Buka editor",
      /* @__PURE__ */ T.jsx(p0, { size: 13 })
    ] })
  ] });
}
const vo = [];
let My = !1, Za = null;
function SO() {
  if (My) return;
  const n = document.querySelector("#workspace-sidebar"), i = document.querySelector("#framework-tools");
  if (!n || !i) return;
  My = !0, document.body.classList.add("framework-ready");
  const s = no.createRoot(n, { identifierPrefix: "nav-" }), r = no.createRoot(i, { identifierPrefix: "cmd-" });
  Qi.flushSync(() => {
    s.render(/* @__PURE__ */ T.jsx(BE, {})), r.render(/* @__PURE__ */ T.jsx(k2, {}));
  });
}
function TO() {
  var n;
  for (; vo.length; ) (n = vo.pop()) == null || n.unmount();
  Za = null;
}
function AO(n) {
  const i = document.querySelector("#framework-home");
  if (i) {
    const f = no.createRoot(i, { identifierPrefix: "home-" });
    vo.push(f), Za = f, Qi.flushSync(() => f.render(/* @__PURE__ */ T.jsx(D1, { state: n })));
    return;
  }
  const s = document.querySelector("#main .page-heading,#main .enterprise-heading");
  if (!s) return;
  const r = document.createElement("div");
  r.className = "framework-context", s.after(r);
  const u = no.createRoot(r, { identifierPrefix: "flow-" });
  vo.push(u), Qi.flushSync(() => u.render(/* @__PURE__ */ T.jsx(yO, { state: n })));
}
function EO(n) {
  Za && n.view === "home" && Qi.flushSync(() => Za == null ? void 0 : Za.render(/* @__PURE__ */ T.jsx(D1, { state: n })));
}
export {
  TO as disposePageComponents,
  SO as initializeFrameworkShell,
  EO as refreshFrameworkStatus,
  AO as renderFrameworkComponents
};
