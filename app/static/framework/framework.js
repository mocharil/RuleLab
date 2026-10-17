var gb = Object.defineProperty;
var yb = (l, i, u) => i in l ? gb(l, i, { enumerable: !0, configurable: !0, writable: !0, value: u }) : l[i] = u;
var Ri = (l, i, u) => yb(l, typeof i != "symbol" ? i + "" : i, u);
function bb(l, i) {
  for (var u = 0; u < i.length; u++) {
    const s = i[u];
    if (typeof s != "string" && !Array.isArray(s)) {
      for (const o in s)
        if (o !== "default" && !(o in l)) {
          const f = Object.getOwnPropertyDescriptor(s, o);
          f && Object.defineProperty(l, o, f.get ? f : {
            enumerable: !0,
            get: () => s[o]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(l, Symbol.toStringTag, { value: "Module" }));
}
function kv(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var Lc = { exports: {} }, Oi = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qm;
function xb() {
  if (qm) return Oi;
  qm = 1;
  var l = Symbol.for("react.transitional.element"), i = Symbol.for("react.fragment");
  function u(s, o, f) {
    var h = null;
    if (f !== void 0 && (h = "" + f), o.key !== void 0 && (h = "" + o.key), "key" in o) {
      f = {};
      for (var m in o)
        m !== "key" && (f[m] = o[m]);
    } else f = o;
    return o = f.ref, {
      $$typeof: l,
      type: s,
      key: h,
      ref: o !== void 0 ? o : null,
      props: f
    };
  }
  return Oi.Fragment = i, Oi.jsx = u, Oi.jsxs = u, Oi;
}
var km;
function Sb() {
  return km || (km = 1, Lc.exports = xb()), Lc.exports;
}
var y = Sb(), Bc = { exports: {} }, Mi = {}, qc = { exports: {} }, kc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gm;
function Eb() {
  return Gm || (Gm = 1, function(l) {
    function i(k, te) {
      var Z = k.length;
      k.push(te);
      e: for (; 0 < Z; ) {
        var le = Z - 1 >>> 1, A = k[le];
        if (0 < o(A, te))
          k[le] = te, k[Z] = A, Z = le;
        else break e;
      }
    }
    function u(k) {
      return k.length === 0 ? null : k[0];
    }
    function s(k) {
      if (k.length === 0) return null;
      var te = k[0], Z = k.pop();
      if (Z !== te) {
        k[0] = Z;
        e: for (var le = 0, A = k.length, Q = A >>> 1; le < Q; ) {
          var re = 2 * (le + 1) - 1, ae = k[re], $ = re + 1, oe = k[$];
          if (0 > o(ae, Z))
            $ < A && 0 > o(oe, ae) ? (k[le] = oe, k[$] = Z, le = $) : (k[le] = ae, k[re] = Z, le = re);
          else if ($ < A && 0 > o(oe, Z))
            k[le] = oe, k[$] = Z, le = $;
          else break e;
        }
      }
      return te;
    }
    function o(k, te) {
      var Z = k.sortIndex - te.sortIndex;
      return Z !== 0 ? Z : k.id - te.id;
    }
    if (l.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      l.unstable_now = function() {
        return f.now();
      };
    } else {
      var h = Date, m = h.now();
      l.unstable_now = function() {
        return h.now() - m;
      };
    }
    var v = [], p = [], b = 1, E = null, R = 3, O = !1, w = !1, T = !1, z = typeof setTimeout == "function" ? setTimeout : null, _ = typeof clearTimeout == "function" ? clearTimeout : null, B = typeof setImmediate < "u" ? setImmediate : null;
    function Y(k) {
      for (var te = u(p); te !== null; ) {
        if (te.callback === null) s(p);
        else if (te.startTime <= k)
          s(p), te.sortIndex = te.expirationTime, i(v, te);
        else break;
        te = u(p);
      }
    }
    function X(k) {
      if (T = !1, Y(k), !w)
        if (u(v) !== null)
          w = !0, ve();
        else {
          var te = u(p);
          te !== null && ge(X, te.startTime - k);
        }
    }
    var H = !1, U = -1, K = 5, W = -1;
    function J() {
      return !(l.unstable_now() - W < K);
    }
    function F() {
      if (H) {
        var k = l.unstable_now();
        W = k;
        var te = !0;
        try {
          e: {
            w = !1, T && (T = !1, _(U), U = -1), O = !0;
            var Z = R;
            try {
              t: {
                for (Y(k), E = u(v); E !== null && !(E.expirationTime > k && J()); ) {
                  var le = E.callback;
                  if (typeof le == "function") {
                    E.callback = null, R = E.priorityLevel;
                    var A = le(
                      E.expirationTime <= k
                    );
                    if (k = l.unstable_now(), typeof A == "function") {
                      E.callback = A, Y(k), te = !0;
                      break t;
                    }
                    E === u(v) && s(v), Y(k);
                  } else s(v);
                  E = u(v);
                }
                if (E !== null) te = !0;
                else {
                  var Q = u(p);
                  Q !== null && ge(
                    X,
                    Q.startTime - k
                  ), te = !1;
                }
              }
              break e;
            } finally {
              E = null, R = Z, O = !1;
            }
            te = void 0;
          }
        } finally {
          te ? xe() : H = !1;
        }
      }
    }
    var xe;
    if (typeof B == "function")
      xe = function() {
        B(F);
      };
    else if (typeof MessageChannel < "u") {
      var Oe = new MessageChannel(), de = Oe.port2;
      Oe.port1.onmessage = F, xe = function() {
        de.postMessage(null);
      };
    } else
      xe = function() {
        z(F, 0);
      };
    function ve() {
      H || (H = !0, xe());
    }
    function ge(k, te) {
      U = z(function() {
        k(l.unstable_now());
      }, te);
    }
    l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(k) {
      k.callback = null;
    }, l.unstable_continueExecution = function() {
      w || O || (w = !0, ve());
    }, l.unstable_forceFrameRate = function(k) {
      0 > k || 125 < k ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : K = 0 < k ? Math.floor(1e3 / k) : 5;
    }, l.unstable_getCurrentPriorityLevel = function() {
      return R;
    }, l.unstable_getFirstCallbackNode = function() {
      return u(v);
    }, l.unstable_next = function(k) {
      switch (R) {
        case 1:
        case 2:
        case 3:
          var te = 3;
          break;
        default:
          te = R;
      }
      var Z = R;
      R = te;
      try {
        return k();
      } finally {
        R = Z;
      }
    }, l.unstable_pauseExecution = function() {
    }, l.unstable_requestPaint = function() {
    }, l.unstable_runWithPriority = function(k, te) {
      switch (k) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          k = 3;
      }
      var Z = R;
      R = k;
      try {
        return te();
      } finally {
        R = Z;
      }
    }, l.unstable_scheduleCallback = function(k, te, Z) {
      var le = l.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? le + Z : le) : Z = le, k) {
        case 1:
          var A = -1;
          break;
        case 2:
          A = 250;
          break;
        case 5:
          A = 1073741823;
          break;
        case 4:
          A = 1e4;
          break;
        default:
          A = 5e3;
      }
      return A = Z + A, k = {
        id: b++,
        callback: te,
        priorityLevel: k,
        startTime: Z,
        expirationTime: A,
        sortIndex: -1
      }, Z > le ? (k.sortIndex = Z, i(p, k), u(v) === null && k === u(p) && (T ? (_(U), U = -1) : T = !0, ge(X, Z - le))) : (k.sortIndex = A, i(v, k), w || O || (w = !0, ve())), k;
    }, l.unstable_shouldYield = J, l.unstable_wrapCallback = function(k) {
      var te = R;
      return function() {
        var Z = R;
        R = te;
        try {
          return k.apply(this, arguments);
        } finally {
          R = Z;
        }
      };
    };
  }(kc)), kc;
}
var Vm;
function Ab() {
  return Vm || (Vm = 1, qc.exports = Eb()), qc.exports;
}
var Gc = { exports: {} }, fe = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ym;
function Tb() {
  if (Ym) return fe;
  Ym = 1;
  var l = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), f = Symbol.for("react.consumer"), h = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), b = Symbol.for("react.lazy"), E = Symbol.iterator;
  function R(A) {
    return A === null || typeof A != "object" ? null : (A = E && A[E] || A["@@iterator"], typeof A == "function" ? A : null);
  }
  var O = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, w = Object.assign, T = {};
  function z(A, Q, re) {
    this.props = A, this.context = Q, this.refs = T, this.updater = re || O;
  }
  z.prototype.isReactComponent = {}, z.prototype.setState = function(A, Q) {
    if (typeof A != "object" && typeof A != "function" && A != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, A, Q, "setState");
  }, z.prototype.forceUpdate = function(A) {
    this.updater.enqueueForceUpdate(this, A, "forceUpdate");
  };
  function _() {
  }
  _.prototype = z.prototype;
  function B(A, Q, re) {
    this.props = A, this.context = Q, this.refs = T, this.updater = re || O;
  }
  var Y = B.prototype = new _();
  Y.constructor = B, w(Y, z.prototype), Y.isPureReactComponent = !0;
  var X = Array.isArray, H = { H: null, A: null, T: null, S: null }, U = Object.prototype.hasOwnProperty;
  function K(A, Q, re, ae, $, oe) {
    return re = oe.ref, {
      $$typeof: l,
      type: A,
      key: Q,
      ref: re !== void 0 ? re : null,
      props: oe
    };
  }
  function W(A, Q) {
    return K(
      A.type,
      Q,
      void 0,
      void 0,
      void 0,
      A.props
    );
  }
  function J(A) {
    return typeof A == "object" && A !== null && A.$$typeof === l;
  }
  function F(A) {
    var Q = { "=": "=0", ":": "=2" };
    return "$" + A.replace(/[=:]/g, function(re) {
      return Q[re];
    });
  }
  var xe = /\/+/g;
  function Oe(A, Q) {
    return typeof A == "object" && A !== null && A.key != null ? F("" + A.key) : Q.toString(36);
  }
  function de() {
  }
  function ve(A) {
    switch (A.status) {
      case "fulfilled":
        return A.value;
      case "rejected":
        throw A.reason;
      default:
        switch (typeof A.status == "string" ? A.then(de, de) : (A.status = "pending", A.then(
          function(Q) {
            A.status === "pending" && (A.status = "fulfilled", A.value = Q);
          },
          function(Q) {
            A.status === "pending" && (A.status = "rejected", A.reason = Q);
          }
        )), A.status) {
          case "fulfilled":
            return A.value;
          case "rejected":
            throw A.reason;
        }
    }
    throw A;
  }
  function ge(A, Q, re, ae, $) {
    var oe = typeof A;
    (oe === "undefined" || oe === "boolean") && (A = null);
    var se = !1;
    if (A === null) se = !0;
    else
      switch (oe) {
        case "bigint":
        case "string":
        case "number":
          se = !0;
          break;
        case "object":
          switch (A.$$typeof) {
            case l:
            case i:
              se = !0;
              break;
            case b:
              return se = A._init, ge(
                se(A._payload),
                Q,
                re,
                ae,
                $
              );
          }
      }
    if (se)
      return $ = $(A), se = ae === "" ? "." + Oe(A, 0) : ae, X($) ? (re = "", se != null && (re = se.replace(xe, "$&/") + "/"), ge($, Q, re, "", function(je) {
        return je;
      })) : $ != null && (J($) && ($ = W(
        $,
        re + ($.key == null || A && A.key === $.key ? "" : ("" + $.key).replace(
          xe,
          "$&/"
        ) + "/") + se
      )), Q.push($)), 1;
    se = 0;
    var _e = ae === "" ? "." : ae + ":";
    if (X(A))
      for (var Ee = 0; Ee < A.length; Ee++)
        ae = A[Ee], oe = _e + Oe(ae, Ee), se += ge(
          ae,
          Q,
          re,
          oe,
          $
        );
    else if (Ee = R(A), typeof Ee == "function")
      for (A = Ee.call(A), Ee = 0; !(ae = A.next()).done; )
        ae = ae.value, oe = _e + Oe(ae, Ee++), se += ge(
          ae,
          Q,
          re,
          oe,
          $
        );
    else if (oe === "object") {
      if (typeof A.then == "function")
        return ge(
          ve(A),
          Q,
          re,
          ae,
          $
        );
      throw Q = String(A), Error(
        "Objects are not valid as a React child (found: " + (Q === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : Q) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return se;
  }
  function k(A, Q, re) {
    if (A == null) return A;
    var ae = [], $ = 0;
    return ge(A, ae, "", "", function(oe) {
      return Q.call(re, oe, $++);
    }), ae;
  }
  function te(A) {
    if (A._status === -1) {
      var Q = A._result;
      Q = Q(), Q.then(
        function(re) {
          (A._status === 0 || A._status === -1) && (A._status = 1, A._result = re);
        },
        function(re) {
          (A._status === 0 || A._status === -1) && (A._status = 2, A._result = re);
        }
      ), A._status === -1 && (A._status = 0, A._result = Q);
    }
    if (A._status === 1) return A._result.default;
    throw A._result;
  }
  var Z = typeof reportError == "function" ? reportError : function(A) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var Q = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
        error: A
      });
      if (!window.dispatchEvent(Q)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", A);
      return;
    }
    console.error(A);
  };
  function le() {
  }
  return fe.Children = {
    map: k,
    forEach: function(A, Q, re) {
      k(
        A,
        function() {
          Q.apply(this, arguments);
        },
        re
      );
    },
    count: function(A) {
      var Q = 0;
      return k(A, function() {
        Q++;
      }), Q;
    },
    toArray: function(A) {
      return k(A, function(Q) {
        return Q;
      }) || [];
    },
    only: function(A) {
      if (!J(A))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return A;
    }
  }, fe.Component = z, fe.Fragment = u, fe.Profiler = o, fe.PureComponent = B, fe.StrictMode = s, fe.Suspense = v, fe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = H, fe.act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, fe.cache = function(A) {
    return function() {
      return A.apply(null, arguments);
    };
  }, fe.cloneElement = function(A, Q, re) {
    if (A == null)
      throw Error(
        "The argument must be a React element, but you passed " + A + "."
      );
    var ae = w({}, A.props), $ = A.key, oe = void 0;
    if (Q != null)
      for (se in Q.ref !== void 0 && (oe = void 0), Q.key !== void 0 && ($ = "" + Q.key), Q)
        !U.call(Q, se) || se === "key" || se === "__self" || se === "__source" || se === "ref" && Q.ref === void 0 || (ae[se] = Q[se]);
    var se = arguments.length - 2;
    if (se === 1) ae.children = re;
    else if (1 < se) {
      for (var _e = Array(se), Ee = 0; Ee < se; Ee++)
        _e[Ee] = arguments[Ee + 2];
      ae.children = _e;
    }
    return K(A.type, $, void 0, void 0, oe, ae);
  }, fe.createContext = function(A) {
    return A = {
      $$typeof: h,
      _currentValue: A,
      _currentValue2: A,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, A.Provider = A, A.Consumer = {
      $$typeof: f,
      _context: A
    }, A;
  }, fe.createElement = function(A, Q, re) {
    var ae, $ = {}, oe = null;
    if (Q != null)
      for (ae in Q.key !== void 0 && (oe = "" + Q.key), Q)
        U.call(Q, ae) && ae !== "key" && ae !== "__self" && ae !== "__source" && ($[ae] = Q[ae]);
    var se = arguments.length - 2;
    if (se === 1) $.children = re;
    else if (1 < se) {
      for (var _e = Array(se), Ee = 0; Ee < se; Ee++)
        _e[Ee] = arguments[Ee + 2];
      $.children = _e;
    }
    if (A && A.defaultProps)
      for (ae in se = A.defaultProps, se)
        $[ae] === void 0 && ($[ae] = se[ae]);
    return K(A, oe, void 0, void 0, null, $);
  }, fe.createRef = function() {
    return { current: null };
  }, fe.forwardRef = function(A) {
    return { $$typeof: m, render: A };
  }, fe.isValidElement = J, fe.lazy = function(A) {
    return {
      $$typeof: b,
      _payload: { _status: -1, _result: A },
      _init: te
    };
  }, fe.memo = function(A, Q) {
    return {
      $$typeof: p,
      type: A,
      compare: Q === void 0 ? null : Q
    };
  }, fe.startTransition = function(A) {
    var Q = H.T, re = {};
    H.T = re;
    try {
      var ae = A(), $ = H.S;
      $ !== null && $(re, ae), typeof ae == "object" && ae !== null && typeof ae.then == "function" && ae.then(le, Z);
    } catch (oe) {
      Z(oe);
    } finally {
      H.T = Q;
    }
  }, fe.unstable_useCacheRefresh = function() {
    return H.H.useCacheRefresh();
  }, fe.use = function(A) {
    return H.H.use(A);
  }, fe.useActionState = function(A, Q, re) {
    return H.H.useActionState(A, Q, re);
  }, fe.useCallback = function(A, Q) {
    return H.H.useCallback(A, Q);
  }, fe.useContext = function(A) {
    return H.H.useContext(A);
  }, fe.useDebugValue = function() {
  }, fe.useDeferredValue = function(A, Q) {
    return H.H.useDeferredValue(A, Q);
  }, fe.useEffect = function(A, Q) {
    return H.H.useEffect(A, Q);
  }, fe.useId = function() {
    return H.H.useId();
  }, fe.useImperativeHandle = function(A, Q, re) {
    return H.H.useImperativeHandle(A, Q, re);
  }, fe.useInsertionEffect = function(A, Q) {
    return H.H.useInsertionEffect(A, Q);
  }, fe.useLayoutEffect = function(A, Q) {
    return H.H.useLayoutEffect(A, Q);
  }, fe.useMemo = function(A, Q) {
    return H.H.useMemo(A, Q);
  }, fe.useOptimistic = function(A, Q) {
    return H.H.useOptimistic(A, Q);
  }, fe.useReducer = function(A, Q, re) {
    return H.H.useReducer(A, Q, re);
  }, fe.useRef = function(A) {
    return H.H.useRef(A);
  }, fe.useState = function(A) {
    return H.H.useState(A);
  }, fe.useSyncExternalStore = function(A, Q, re) {
    return H.H.useSyncExternalStore(
      A,
      Q,
      re
    );
  }, fe.useTransition = function() {
    return H.H.useTransition();
  }, fe.version = "19.0.0", fe;
}
var Xm;
function Ro() {
  return Xm || (Xm = 1, Gc.exports = Tb()), Gc.exports;
}
var Vc = { exports: {} }, lt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qm;
function wb() {
  if (Qm) return lt;
  Qm = 1;
  var l = Ro();
  function i(v) {
    var p = "https://react.dev/errors/" + v;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        p += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + v + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function u() {
  }
  var s = {
    d: {
      f: u,
      r: function() {
        throw Error(i(522));
      },
      D: u,
      C: u,
      L: u,
      m: u,
      X: u,
      S: u,
      M: u
    },
    p: 0,
    findDOMNode: null
  }, o = Symbol.for("react.portal");
  function f(v, p, b) {
    var E = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: o,
      key: E == null ? null : "" + E,
      children: v,
      containerInfo: p,
      implementation: b
    };
  }
  var h = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(v, p) {
    if (v === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return lt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, lt.createPortal = function(v, p) {
    var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(i(299));
    return f(v, p, null, b);
  }, lt.flushSync = function(v) {
    var p = h.T, b = s.p;
    try {
      if (h.T = null, s.p = 2, v) return v();
    } finally {
      h.T = p, s.p = b, s.d.f();
    }
  }, lt.preconnect = function(v, p) {
    typeof v == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, s.d.C(v, p));
  }, lt.prefetchDNS = function(v) {
    typeof v == "string" && s.d.D(v);
  }, lt.preinit = function(v, p) {
    if (typeof v == "string" && p && typeof p.as == "string") {
      var b = p.as, E = m(b, p.crossOrigin), R = typeof p.integrity == "string" ? p.integrity : void 0, O = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      b === "style" ? s.d.S(
        v,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: E,
          integrity: R,
          fetchPriority: O
        }
      ) : b === "script" && s.d.X(v, {
        crossOrigin: E,
        integrity: R,
        fetchPriority: O,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, lt.preinitModule = function(v, p) {
    if (typeof v == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var b = m(
            p.as,
            p.crossOrigin
          );
          s.d.M(v, {
            crossOrigin: b,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && s.d.M(v);
  }, lt.preload = function(v, p) {
    if (typeof v == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var b = p.as, E = m(b, p.crossOrigin);
      s.d.L(v, b, {
        crossOrigin: E,
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
  }, lt.preloadModule = function(v, p) {
    if (typeof v == "string")
      if (p) {
        var b = m(p.as, p.crossOrigin);
        s.d.m(v, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: b,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else s.d.m(v);
  }, lt.requestFormReset = function(v) {
    s.d.r(v);
  }, lt.unstable_batchedUpdates = function(v, p) {
    return v(p);
  }, lt.useFormState = function(v, p, b) {
    return h.H.useFormState(v, p, b);
  }, lt.useFormStatus = function() {
    return h.H.useHostTransitionStatus();
  }, lt.version = "19.0.0", lt;
}
var Zm;
function Gv() {
  if (Zm) return Vc.exports;
  Zm = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (i) {
        console.error(i);
      }
  }
  return l(), Vc.exports = wb(), Vc.exports;
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
var Km;
function Rb() {
  if (Km) return Mi;
  Km = 1;
  var l = Ab(), i = Ro(), u = Gv();
  function s(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  var f = Symbol.for("react.element"), h = Symbol.for("react.transitional.element"), m = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), E = Symbol.for("react.provider"), R = Symbol.for("react.consumer"), O = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), z = Symbol.for("react.suspense_list"), _ = Symbol.for("react.memo"), B = Symbol.for("react.lazy"), Y = Symbol.for("react.offscreen"), X = Symbol.for("react.memo_cache_sentinel"), H = Symbol.iterator;
  function U(e) {
    return e === null || typeof e != "object" ? null : (e = H && e[H] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var K = Symbol.for("react.client.reference");
  function W(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === K ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case v:
        return "Fragment";
      case m:
        return "Portal";
      case b:
        return "Profiler";
      case p:
        return "StrictMode";
      case T:
        return "Suspense";
      case z:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case O:
          return (e.displayName || "Context") + ".Provider";
        case R:
          return (e._context.displayName || "Context") + ".Consumer";
        case w:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case _:
          return t = e.displayName || null, t !== null ? t : W(e.type) || "Memo";
        case B:
          t = e._payload, e = e._init;
          try {
            return W(e(t));
          } catch {
          }
      }
    return null;
  }
  var J = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, F = Object.assign, xe, Oe;
  function de(e) {
    if (xe === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        xe = t && t[1] || "", Oe = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + xe + e + Oe;
  }
  var ve = !1;
  function ge(e, t) {
    if (!e || ve) return "";
    ve = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var V = function() {
                throw Error();
              };
              if (Object.defineProperty(V.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(V, []);
                } catch (L) {
                  var j = L;
                }
                Reflect.construct(e, [], V);
              } else {
                try {
                  V.call();
                } catch (L) {
                  j = L;
                }
                e.call(V.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (L) {
                j = L;
              }
              (V = e()) && typeof V.catch == "function" && V.catch(function() {
              });
            }
          } catch (L) {
            if (L && j && typeof L.stack == "string")
              return [L.stack, j.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var r = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      r && r.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var c = a.DetermineComponentFrameRoot(), d = c[0], g = c[1];
      if (d && g) {
        var x = d.split(`
`), C = g.split(`
`);
        for (r = a = 0; a < x.length && !x[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; r < C.length && !C[r].includes(
          "DetermineComponentFrameRoot"
        ); )
          r++;
        if (a === x.length || r === C.length)
          for (a = x.length - 1, r = C.length - 1; 1 <= a && 0 <= r && x[a] !== C[r]; )
            r--;
        for (; 1 <= a && 0 <= r; a--, r--)
          if (x[a] !== C[r]) {
            if (a !== 1 || r !== 1)
              do
                if (a--, r--, 0 > r || x[a] !== C[r]) {
                  var q = `
` + x[a].replace(" at new ", " at ");
                  return e.displayName && q.includes("<anonymous>") && (q = q.replace("<anonymous>", e.displayName)), q;
                }
              while (1 <= a && 0 <= r);
            break;
          }
      }
    } finally {
      ve = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? de(n) : "";
  }
  function k(e) {
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
  function te(e) {
    try {
      var t = "";
      do
        t += k(e), e = e.return;
      while (e);
      return t;
    } catch (n) {
      return `
Error generating stack: ` + n.message + `
` + n.stack;
    }
  }
  function Z(e) {
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
  function le(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function A(e) {
    if (Z(e) !== e)
      throw Error(s(188));
  }
  function Q(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Z(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var n = e, a = t; ; ) {
      var r = n.return;
      if (r === null) break;
      var c = r.alternate;
      if (c === null) {
        if (a = r.return, a !== null) {
          n = a;
          continue;
        }
        break;
      }
      if (r.child === c.child) {
        for (c = r.child; c; ) {
          if (c === n) return A(r), e;
          if (c === a) return A(r), t;
          c = c.sibling;
        }
        throw Error(s(188));
      }
      if (n.return !== a.return) n = r, a = c;
      else {
        for (var d = !1, g = r.child; g; ) {
          if (g === n) {
            d = !0, n = r, a = c;
            break;
          }
          if (g === a) {
            d = !0, a = r, n = c;
            break;
          }
          g = g.sibling;
        }
        if (!d) {
          for (g = c.child; g; ) {
            if (g === n) {
              d = !0, n = c, a = r;
              break;
            }
            if (g === a) {
              d = !0, a = c, n = r;
              break;
            }
            g = g.sibling;
          }
          if (!d) throw Error(s(189));
        }
      }
      if (n.alternate !== a) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function re(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = re(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var ae = Array.isArray, $ = u.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, oe = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, se = [], _e = -1;
  function Ee(e) {
    return { current: e };
  }
  function je(e) {
    0 > _e || (e.current = se[_e], se[_e] = null, _e--);
  }
  function Me(e, t) {
    _e++, se[_e] = e.current, e.current = t;
  }
  var ht = Ee(null), yn = Ee(null), rt = Ee(null), Fn = Ee(null);
  function Dl(e, t) {
    switch (Me(rt, t), Me(yn, e), Me(ht, null), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) && (t = t.namespaceURI) ? mm(t) : 0;
        break;
      default:
        if (e = e === 8 ? t.parentNode : t, t = e.tagName, e = e.namespaceURI)
          e = mm(e), t = vm(e, t);
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
    je(ht), Me(ht, t);
  }
  function bn() {
    je(ht), je(yn), je(rt);
  }
  function Ca(e) {
    e.memoizedState !== null && Me(Fn, e);
    var t = ht.current, n = vm(t, e.type);
    t !== n && (Me(yn, e), Me(ht, n));
  }
  function Nl(e) {
    yn.current === e && (je(ht), je(yn)), Fn.current === e && (je(Fn), Si._currentValue = oe);
  }
  var xn = Object.prototype.hasOwnProperty, Du = l.unstable_scheduleCallback, Nu = l.unstable_cancelCallback, Wg = l.unstable_shouldYield, Fg = l.unstable_requestPaint, qt = l.unstable_now, $g = l.unstable_getCurrentPriorityLevel, nf = l.unstable_ImmediatePriority, lf = l.unstable_UserBlockingPriority, Li = l.unstable_NormalPriority, Pg = l.unstable_LowPriority, af = l.unstable_IdlePriority, Ig = l.log, ey = l.unstable_setDisableYieldValue, Da = null, mt = null;
  function ty(e) {
    if (mt && typeof mt.onCommitFiberRoot == "function")
      try {
        mt.onCommitFiberRoot(
          Da,
          e,
          void 0,
          (e.current.flags & 128) === 128
        );
      } catch {
      }
  }
  function Sn(e) {
    if (typeof Ig == "function" && ey(e), mt && typeof mt.setStrictMode == "function")
      try {
        mt.setStrictMode(Da, e);
      } catch {
      }
  }
  var vt = Math.clz32 ? Math.clz32 : ay, ny = Math.log, ly = Math.LN2;
  function ay(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ny(e) / ly | 0) | 0;
  }
  var Bi = 128, qi = 4194304;
  function $n(e) {
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
  function ki(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var a = 0, r = e.suspendedLanes, c = e.pingedLanes, d = e.warmLanes;
    e = e.finishedLanes !== 0;
    var g = n & 134217727;
    return g !== 0 ? (n = g & ~r, n !== 0 ? a = $n(n) : (c &= g, c !== 0 ? a = $n(c) : e || (d = g & ~d, d !== 0 && (a = $n(d))))) : (g = n & ~r, g !== 0 ? a = $n(g) : c !== 0 ? a = $n(c) : e || (d = n & ~d, d !== 0 && (a = $n(d)))), a === 0 ? 0 : t !== 0 && t !== a && !(t & r) && (r = a & -a, d = t & -t, r >= d || r === 32 && (d & 4194176) !== 0) ? t : a;
  }
  function Na(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function iy(e, t) {
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
  function rf() {
    var e = Bi;
    return Bi <<= 1, !(Bi & 4194176) && (Bi = 128), e;
  }
  function uf() {
    var e = qi;
    return qi <<= 1, !(qi & 62914560) && (qi = 4194304), e;
  }
  function zu(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function za(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function ry(e, t, n, a, r, c) {
    var d = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var g = e.entanglements, x = e.expirationTimes, C = e.hiddenUpdates;
    for (n = d & ~n; 0 < n; ) {
      var q = 31 - vt(n), V = 1 << q;
      g[q] = 0, x[q] = -1;
      var j = C[q];
      if (j !== null)
        for (C[q] = null, q = 0; q < j.length; q++) {
          var L = j[q];
          L !== null && (L.lane &= -536870913);
        }
      n &= ~V;
    }
    a !== 0 && sf(e, a, 0), c !== 0 && r === 0 && e.tag !== 0 && (e.suspendedLanes |= c & ~(d & ~t));
  }
  function sf(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - vt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | n & 4194218;
  }
  function cf(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var a = 31 - vt(n), r = 1 << a;
      r & t | e[a] & t && (e[a] |= t), n &= ~r;
    }
  }
  function of(e) {
    return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
  }
  function ff() {
    var e = $.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : _m(e.type));
  }
  function uy(e, t) {
    var n = $.p;
    try {
      return $.p = e, t();
    } finally {
      $.p = n;
    }
  }
  var En = Math.random().toString(36).slice(2), tt = "__reactFiber$" + En, ut = "__reactProps$" + En, zl = "__reactContainer$" + En, _u = "__reactEvents$" + En, sy = "__reactListeners$" + En, cy = "__reactHandles$" + En, df = "__reactResources$" + En, _a = "__reactMarker$" + En;
  function ju(e) {
    delete e[tt], delete e[ut], delete e[_u], delete e[sy], delete e[cy];
  }
  function Pn(e) {
    var t = e[tt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[zl] || n[tt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = ym(e); e !== null; ) {
            if (n = e[tt]) return n;
            e = ym(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function _l(e) {
    if (e = e[tt] || e[zl]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function ja(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(s(33));
  }
  function jl(e) {
    var t = e[df];
    return t || (t = e[df] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Ke(e) {
    e[_a] = !0;
  }
  var hf = /* @__PURE__ */ new Set(), mf = {};
  function In(e, t) {
    Ul(e, t), Ul(e + "Capture", t);
  }
  function Ul(e, t) {
    for (mf[e] = t, e = 0; e < t.length; e++)
      hf.add(t[e]);
  }
  var Wt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), oy = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), vf = {}, pf = {};
  function fy(e) {
    return xn.call(pf, e) ? !0 : xn.call(vf, e) ? !1 : oy.test(e) ? pf[e] = !0 : (vf[e] = !0, !1);
  }
  function Gi(e, t, n) {
    if (fy(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function Vi(e, t, n) {
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
  function Ft(e, t, n, a) {
    if (a === null) e.removeAttribute(n);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + a);
    }
  }
  function St(e) {
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
  function gf(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function dy(e) {
    var t = gf(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    ), a = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var r = n.get, c = n.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return r.call(this);
        },
        set: function(d) {
          a = "" + d, c.call(this, d);
        }
      }), Object.defineProperty(e, t, {
        enumerable: n.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(d) {
          a = "" + d;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Yi(e) {
    e._valueTracker || (e._valueTracker = dy(e));
  }
  function yf(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), a = "";
    return e && (a = gf(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Xi(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var hy = /[\n"\\]/g;
  function Et(e) {
    return e.replace(
      hy,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Uu(e, t, n, a, r, c, d, g) {
    e.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.type = d : e.removeAttribute("type"), t != null ? d === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + St(t)) : e.value !== "" + St(t) && (e.value = "" + St(t)) : d !== "submit" && d !== "reset" || e.removeAttribute("value"), t != null ? Hu(e, d, St(t)) : n != null ? Hu(e, d, St(n)) : a != null && e.removeAttribute("value"), r == null && c != null && (e.defaultChecked = !!c), r != null && (e.checked = r && typeof r != "function" && typeof r != "symbol"), g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? e.name = "" + St(g) : e.removeAttribute("name");
  }
  function bf(e, t, n, a, r, c, d, g) {
    if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.type = c), t != null || n != null) {
      if (!(c !== "submit" && c !== "reset" || t != null))
        return;
      n = n != null ? "" + St(n) : "", t = t != null ? "" + St(t) : n, g || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? r, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = g ? e.checked : !!a, e.defaultChecked = !!a, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (e.name = d);
  }
  function Hu(e, t, n) {
    t === "number" && Xi(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function Hl(e, t, n, a) {
    if (e = e.options, t) {
      t = {};
      for (var r = 0; r < n.length; r++)
        t["$" + n[r]] = !0;
      for (n = 0; n < e.length; n++)
        r = t.hasOwnProperty("$" + e[n].value), e[n].selected !== r && (e[n].selected = r), r && a && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + St(n), t = null, r = 0; r < e.length; r++) {
        if (e[r].value === n) {
          e[r].selected = !0, a && (e[r].defaultSelected = !0);
          return;
        }
        t !== null || e[r].disabled || (t = e[r]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function xf(e, t, n) {
    if (t != null && (t = "" + St(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + St(n) : "";
  }
  function Sf(e, t, n, a) {
    if (t == null) {
      if (a != null) {
        if (n != null) throw Error(s(92));
        if (ae(a)) {
          if (1 < a.length) throw Error(s(93));
          a = a[0];
        }
        n = a;
      }
      n == null && (n = ""), t = n;
    }
    n = St(t), e.defaultValue = n, a = e.textContent, a === n && a !== "" && a !== null && (e.value = a);
  }
  function Ll(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var my = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Ef(e, t, n) {
    var a = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, n) : typeof n != "number" || n === 0 || my.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function Af(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(s(62));
    if (e = e.style, n != null) {
      for (var a in n)
        !n.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var r in t)
        a = t[r], t.hasOwnProperty(r) && n[r] !== a && Ef(e, r, a);
    } else
      for (var c in t)
        t.hasOwnProperty(c) && Ef(e, c, t[c]);
  }
  function Lu(e) {
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
  var vy = /* @__PURE__ */ new Map([
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
  ]), py = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Qi(e) {
    return py.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  var Bu = null;
  function qu(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Bl = null, ql = null;
  function Tf(e) {
    var t = _l(e);
    if (t && (e = t.stateNode)) {
      var n = e[ut] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Uu(
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
              'input[name="' + Et(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var a = n[t];
              if (a !== e && a.form === e.form) {
                var r = a[ut] || null;
                if (!r) throw Error(s(90));
                Uu(
                  a,
                  r.value,
                  r.defaultValue,
                  r.defaultValue,
                  r.checked,
                  r.defaultChecked,
                  r.type,
                  r.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              a = n[t], a.form === e.form && yf(a);
          }
          break e;
        case "textarea":
          xf(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && Hl(e, !!n.multiple, t, !1);
      }
    }
  }
  var ku = !1;
  function wf(e, t, n) {
    if (ku) return e(t, n);
    ku = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (ku = !1, (Bl !== null || ql !== null) && (Mr(), Bl && (t = Bl, e = ql, ql = Bl = null, Tf(t), e)))
        for (t = 0; t < e.length; t++) Tf(e[t]);
    }
  }
  function Ua(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var a = n[ut] || null;
    if (a === null) return null;
    n = a[t];
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
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function")
      throw Error(
        s(231, t, typeof n)
      );
    return n;
  }
  var Gu = !1;
  if (Wt)
    try {
      var Ha = {};
      Object.defineProperty(Ha, "passive", {
        get: function() {
          Gu = !0;
        }
      }), window.addEventListener("test", Ha, Ha), window.removeEventListener("test", Ha, Ha);
    } catch {
      Gu = !1;
    }
  var An = null, Vu = null, Zi = null;
  function Rf() {
    if (Zi) return Zi;
    var e, t = Vu, n = t.length, a, r = "value" in An ? An.value : An.textContent, c = r.length;
    for (e = 0; e < n && t[e] === r[e]; e++) ;
    var d = n - e;
    for (a = 1; a <= d && t[n - a] === r[c - a]; a++) ;
    return Zi = r.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Ki(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ji() {
    return !0;
  }
  function Of() {
    return !1;
  }
  function st(e) {
    function t(n, a, r, c, d) {
      this._reactName = n, this._targetInst = r, this.type = a, this.nativeEvent = c, this.target = d, this.currentTarget = null;
      for (var g in e)
        e.hasOwnProperty(g) && (n = e[g], this[g] = n ? n(c) : c[g]);
      return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? Ji : Of, this.isPropagationStopped = Of, this;
    }
    return F(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Ji);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Ji);
      },
      persist: function() {
      },
      isPersistent: Ji
    }), t;
  }
  var el = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Wi = st(el), La = F({}, el, { view: 0, detail: 0 }), gy = st(La), Yu, Xu, Ba, Fi = F({}, La, {
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
    getModifierState: Zu,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ba && (Ba && e.type === "mousemove" ? (Yu = e.screenX - Ba.screenX, Xu = e.screenY - Ba.screenY) : Xu = Yu = 0, Ba = e), Yu);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Xu;
    }
  }), Mf = st(Fi), yy = F({}, Fi, { dataTransfer: 0 }), by = st(yy), xy = F({}, La, { relatedTarget: 0 }), Qu = st(xy), Sy = F({}, el, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ey = st(Sy), Ay = F({}, el, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Ty = st(Ay), wy = F({}, el, { data: 0 }), Cf = st(wy), Ry = {
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
  }, Oy = {
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
  }, My = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Cy(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = My[e]) ? !!t[e] : !1;
  }
  function Zu() {
    return Cy;
  }
  var Dy = F({}, La, {
    key: function(e) {
      if (e.key) {
        var t = Ry[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Ki(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Oy[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Zu,
    charCode: function(e) {
      return e.type === "keypress" ? Ki(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Ki(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Ny = st(Dy), zy = F({}, Fi, {
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
  }), Df = st(zy), _y = F({}, La, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Zu
  }), jy = st(_y), Uy = F({}, el, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Hy = st(Uy), Ly = F({}, Fi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), By = st(Ly), qy = F({}, el, {
    newState: 0,
    oldState: 0
  }), ky = st(qy), Gy = [9, 13, 27, 32], Ku = Wt && "CompositionEvent" in window, qa = null;
  Wt && "documentMode" in document && (qa = document.documentMode);
  var Vy = Wt && "TextEvent" in window && !qa, Nf = Wt && (!Ku || qa && 8 < qa && 11 >= qa), zf = " ", _f = !1;
  function jf(e, t) {
    switch (e) {
      case "keyup":
        return Gy.indexOf(t.keyCode) !== -1;
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
  function Uf(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var kl = !1;
  function Yy(e, t) {
    switch (e) {
      case "compositionend":
        return Uf(t);
      case "keypress":
        return t.which !== 32 ? null : (_f = !0, zf);
      case "textInput":
        return e = t.data, e === zf && _f ? null : e;
      default:
        return null;
    }
  }
  function Xy(e, t) {
    if (kl)
      return e === "compositionend" || !Ku && jf(e, t) ? (e = Rf(), Zi = Vu = An = null, kl = !1, e) : null;
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
        return Nf && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Qy = {
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
  function Hf(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Qy[e.type] : t === "textarea";
  }
  function Lf(e, t, n, a) {
    Bl ? ql ? ql.push(a) : ql = [a] : Bl = a, t = _r(t, "onChange"), 0 < t.length && (n = new Wi(
      "onChange",
      "change",
      null,
      n,
      a
    ), e.push({ event: n, listeners: t }));
  }
  var ka = null, Ga = null;
  function Zy(e) {
    cm(e, 0);
  }
  function $i(e) {
    var t = ja(e);
    if (yf(t)) return e;
  }
  function Bf(e, t) {
    if (e === "change") return t;
  }
  var qf = !1;
  if (Wt) {
    var Ju;
    if (Wt) {
      var Wu = "oninput" in document;
      if (!Wu) {
        var kf = document.createElement("div");
        kf.setAttribute("oninput", "return;"), Wu = typeof kf.oninput == "function";
      }
      Ju = Wu;
    } else Ju = !1;
    qf = Ju && (!document.documentMode || 9 < document.documentMode);
  }
  function Gf() {
    ka && (ka.detachEvent("onpropertychange", Vf), Ga = ka = null);
  }
  function Vf(e) {
    if (e.propertyName === "value" && $i(Ga)) {
      var t = [];
      Lf(
        t,
        Ga,
        e,
        qu(e)
      ), wf(Zy, t);
    }
  }
  function Ky(e, t, n) {
    e === "focusin" ? (Gf(), ka = t, Ga = n, ka.attachEvent("onpropertychange", Vf)) : e === "focusout" && Gf();
  }
  function Jy(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return $i(Ga);
  }
  function Wy(e, t) {
    if (e === "click") return $i(t);
  }
  function Fy(e, t) {
    if (e === "input" || e === "change")
      return $i(t);
  }
  function $y(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var pt = typeof Object.is == "function" ? Object.is : $y;
  function Va(e, t) {
    if (pt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), a = Object.keys(t);
    if (n.length !== a.length) return !1;
    for (a = 0; a < n.length; a++) {
      var r = n[a];
      if (!xn.call(t, r) || !pt(e[r], t[r]))
        return !1;
    }
    return !0;
  }
  function Yf(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Xf(e, t) {
    var n = Yf(e);
    e = 0;
    for (var a; n; ) {
      if (n.nodeType === 3) {
        if (a = e + n.textContent.length, e <= t && a >= t)
          return { node: n, offset: t - e };
        e = a;
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
      n = Yf(n);
    }
  }
  function Qf(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Qf(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Zf(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Xi(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Xi(e.document);
    }
    return t;
  }
  function Fu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Py(e, t) {
    var n = Zf(t);
    t = e.focusedElem;
    var a = e.selectionRange;
    if (n !== t && t && t.ownerDocument && Qf(t.ownerDocument.documentElement, t)) {
      if (a !== null && Fu(t)) {
        if (e = a.start, n = a.end, n === void 0 && (n = e), "selectionStart" in t)
          t.selectionStart = e, t.selectionEnd = Math.min(
            n,
            t.value.length
          );
        else if (n = (e = t.ownerDocument || document) && e.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var r = t.textContent.length, c = Math.min(a.start, r);
          a = a.end === void 0 ? c : Math.min(a.end, r), !n.extend && c > a && (r = a, a = c, c = r), r = Xf(t, c);
          var d = Xf(
            t,
            a
          );
          r && d && (n.rangeCount !== 1 || n.anchorNode !== r.node || n.anchorOffset !== r.offset || n.focusNode !== d.node || n.focusOffset !== d.offset) && (e = e.createRange(), e.setStart(r.node, r.offset), n.removeAllRanges(), c > a ? (n.addRange(e), n.extend(d.node, d.offset)) : (e.setEnd(
            d.node,
            d.offset
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
  var Iy = Wt && "documentMode" in document && 11 >= document.documentMode, Gl = null, $u = null, Ya = null, Pu = !1;
  function Kf(e, t, n) {
    var a = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Pu || Gl == null || Gl !== Xi(a) || (a = Gl, "selectionStart" in a && Fu(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Ya && Va(Ya, a) || (Ya = a, a = _r($u, "onSelect"), 0 < a.length && (t = new Wi(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: a }), t.target = Gl)));
  }
  function tl(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Vl = {
    animationend: tl("Animation", "AnimationEnd"),
    animationiteration: tl("Animation", "AnimationIteration"),
    animationstart: tl("Animation", "AnimationStart"),
    transitionrun: tl("Transition", "TransitionRun"),
    transitionstart: tl("Transition", "TransitionStart"),
    transitioncancel: tl("Transition", "TransitionCancel"),
    transitionend: tl("Transition", "TransitionEnd")
  }, Iu = {}, Jf = {};
  Wt && (Jf = document.createElement("div").style, "AnimationEvent" in window || (delete Vl.animationend.animation, delete Vl.animationiteration.animation, delete Vl.animationstart.animation), "TransitionEvent" in window || delete Vl.transitionend.transition);
  function nl(e) {
    if (Iu[e]) return Iu[e];
    if (!Vl[e]) return e;
    var t = Vl[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in Jf)
        return Iu[e] = t[n];
    return e;
  }
  var Wf = nl("animationend"), Ff = nl("animationiteration"), $f = nl("animationstart"), e0 = nl("transitionrun"), t0 = nl("transitionstart"), n0 = nl("transitioncancel"), Pf = nl("transitionend"), If = /* @__PURE__ */ new Map(), ed = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(
    " "
  );
  function _t(e, t) {
    If.set(e, t), In(t, [e]);
  }
  var At = [], Yl = 0, es = 0;
  function Pi() {
    for (var e = Yl, t = es = Yl = 0; t < e; ) {
      var n = At[t];
      At[t++] = null;
      var a = At[t];
      At[t++] = null;
      var r = At[t];
      At[t++] = null;
      var c = At[t];
      if (At[t++] = null, a !== null && r !== null) {
        var d = a.pending;
        d === null ? r.next = r : (r.next = d.next, d.next = r), a.pending = r;
      }
      c !== 0 && td(n, r, c);
    }
  }
  function Ii(e, t, n, a) {
    At[Yl++] = e, At[Yl++] = t, At[Yl++] = n, At[Yl++] = a, es |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function ts(e, t, n, a) {
    return Ii(e, t, n, a), er(e);
  }
  function Tn(e, t) {
    return Ii(e, null, null, t), er(e);
  }
  function td(e, t, n) {
    e.lanes |= n;
    var a = e.alternate;
    a !== null && (a.lanes |= n);
    for (var r = !1, c = e.return; c !== null; )
      c.childLanes |= n, a = c.alternate, a !== null && (a.childLanes |= n), c.tag === 22 && (e = c.stateNode, e === null || e._visibility & 1 || (r = !0)), e = c, c = c.return;
    r && t !== null && e.tag === 3 && (c = e.stateNode, r = 31 - vt(n), c = c.hiddenUpdates, e = c[r], e === null ? c[r] = [t] : e.push(t), t.lane = n | 536870912);
  }
  function er(e) {
    if (50 < mi)
      throw mi = 0, uc = null, Error(s(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Xl = {}, nd = /* @__PURE__ */ new WeakMap();
  function Tt(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = nd.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: te(t)
      }, nd.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: te(t)
    };
  }
  var Ql = [], Zl = 0, tr = null, nr = 0, wt = [], Rt = 0, ll = null, $t = 1, Pt = "";
  function al(e, t) {
    Ql[Zl++] = nr, Ql[Zl++] = tr, tr = e, nr = t;
  }
  function ld(e, t, n) {
    wt[Rt++] = $t, wt[Rt++] = Pt, wt[Rt++] = ll, ll = e;
    var a = $t;
    e = Pt;
    var r = 32 - vt(a) - 1;
    a &= ~(1 << r), n += 1;
    var c = 32 - vt(t) + r;
    if (30 < c) {
      var d = r - r % 5;
      c = (a & (1 << d) - 1).toString(32), a >>= d, r -= d, $t = 1 << 32 - vt(t) + r | n << r | a, Pt = c + e;
    } else
      $t = 1 << c | n << r | a, Pt = e;
  }
  function ns(e) {
    e.return !== null && (al(e, 1), ld(e, 1, 0));
  }
  function ls(e) {
    for (; e === tr; )
      tr = Ql[--Zl], Ql[Zl] = null, nr = Ql[--Zl], Ql[Zl] = null;
    for (; e === ll; )
      ll = wt[--Rt], wt[Rt] = null, Pt = wt[--Rt], wt[Rt] = null, $t = wt[--Rt], wt[Rt] = null;
  }
  var at = null, Pe = null, Ae = !1, jt = null, kt = !1, as = Error(s(519));
  function il(e) {
    var t = Error(s(418, ""));
    throw Za(Tt(t, e)), as;
  }
  function ad(e) {
    var t = e.stateNode, n = e.type, a = e.memoizedProps;
    switch (t[tt] = e, t[ut] = a, n) {
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
        for (n = 0; n < pi.length; n++)
          be(pi[n], t);
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
        be("invalid", t), bf(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        ), Yi(t);
        break;
      case "select":
        be("invalid", t);
        break;
      case "textarea":
        be("invalid", t), Sf(t, a.value, a.defaultValue, a.children), Yi(t);
    }
    n = a.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || a.suppressHydrationWarning === !0 || hm(t.textContent, n) ? (a.popover != null && (be("beforetoggle", t), be("toggle", t)), a.onScroll != null && be("scroll", t), a.onScrollEnd != null && be("scrollend", t), a.onClick != null && (t.onclick = jr), t = !0) : t = !1, t || il(e);
  }
  function id(e) {
    for (at = e.return; at; )
      switch (at.tag) {
        case 3:
        case 27:
          kt = !0;
          return;
        case 5:
        case 13:
          kt = !1;
          return;
        default:
          at = at.return;
      }
  }
  function Xa(e) {
    if (e !== at) return !1;
    if (!Ae) return id(e), Ae = !0, !1;
    var t = !1, n;
    if ((n = e.tag !== 3 && e.tag !== 27) && ((n = e.tag === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Tc(e.type, e.memoizedProps)), n = !n), n && (t = !0), t && Pe && il(e), id(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8)
            if (n = e.data, n === "/$") {
              if (t === 0) {
                Pe = Ht(e.nextSibling);
                break e;
              }
              t--;
            } else
              n !== "$" && n !== "$!" && n !== "$?" || t++;
          e = e.nextSibling;
        }
        Pe = null;
      }
    } else
      Pe = at ? Ht(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Qa() {
    Pe = at = null, Ae = !1;
  }
  function Za(e) {
    jt === null ? jt = [e] : jt.push(e);
  }
  var Ka = Error(s(460)), rd = Error(s(474)), is = { then: function() {
  } };
  function ud(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function lr() {
  }
  function sd(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(lr, lr), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, e === Ka ? Error(s(483)) : e;
      default:
        if (typeof t.status == "string") t.then(lr, lr);
        else {
          if (e = De, e !== null && 100 < e.shellSuspendCounter)
            throw Error(s(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var r = t;
                r.status = "fulfilled", r.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var r = t;
                r.status = "rejected", r.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, e === Ka ? Error(s(483)) : e;
        }
        throw Ja = t, Ka;
    }
  }
  var Ja = null;
  function cd() {
    if (Ja === null) throw Error(s(459));
    var e = Ja;
    return Ja = null, e;
  }
  var Kl = null, Wa = 0;
  function ar(e) {
    var t = Wa;
    return Wa += 1, Kl === null && (Kl = []), sd(Kl, e, t);
  }
  function Fa(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ir(e, t) {
    throw t.$$typeof === f ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(
      s(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function od(e) {
    var t = e._init;
    return t(e._payload);
  }
  function fd(e) {
    function t(D, M) {
      if (e) {
        var N = D.deletions;
        N === null ? (D.deletions = [M], D.flags |= 16) : N.push(M);
      }
    }
    function n(D, M) {
      if (!e) return null;
      for (; M !== null; )
        t(D, M), M = M.sibling;
      return null;
    }
    function a(D) {
      for (var M = /* @__PURE__ */ new Map(); D !== null; )
        D.key !== null ? M.set(D.key, D) : M.set(D.index, D), D = D.sibling;
      return M;
    }
    function r(D, M) {
      return D = Hn(D, M), D.index = 0, D.sibling = null, D;
    }
    function c(D, M, N) {
      return D.index = N, e ? (N = D.alternate, N !== null ? (N = N.index, N < M ? (D.flags |= 33554434, M) : N) : (D.flags |= 33554434, M)) : (D.flags |= 1048576, M);
    }
    function d(D) {
      return e && D.alternate === null && (D.flags |= 33554434), D;
    }
    function g(D, M, N, G) {
      return M === null || M.tag !== 6 ? (M = Is(N, D.mode, G), M.return = D, M) : (M = r(M, N), M.return = D, M);
    }
    function x(D, M, N, G) {
      var P = N.type;
      return P === v ? q(
        D,
        M,
        N.props.children,
        G,
        N.key
      ) : M !== null && (M.elementType === P || typeof P == "object" && P !== null && P.$$typeof === B && od(P) === M.type) ? (M = r(M, N.props), Fa(M, N), M.return = D, M) : (M = Ar(
        N.type,
        N.key,
        N.props,
        null,
        D.mode,
        G
      ), Fa(M, N), M.return = D, M);
    }
    function C(D, M, N, G) {
      return M === null || M.tag !== 4 || M.stateNode.containerInfo !== N.containerInfo || M.stateNode.implementation !== N.implementation ? (M = ec(N, D.mode, G), M.return = D, M) : (M = r(M, N.children || []), M.return = D, M);
    }
    function q(D, M, N, G, P) {
      return M === null || M.tag !== 7 ? (M = vl(
        N,
        D.mode,
        G,
        P
      ), M.return = D, M) : (M = r(M, N), M.return = D, M);
    }
    function V(D, M, N) {
      if (typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint")
        return M = Is(
          "" + M,
          D.mode,
          N
        ), M.return = D, M;
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case h:
            return N = Ar(
              M.type,
              M.key,
              M.props,
              null,
              D.mode,
              N
            ), Fa(N, M), N.return = D, N;
          case m:
            return M = ec(
              M,
              D.mode,
              N
            ), M.return = D, M;
          case B:
            var G = M._init;
            return M = G(M._payload), V(D, M, N);
        }
        if (ae(M) || U(M))
          return M = vl(
            M,
            D.mode,
            N,
            null
          ), M.return = D, M;
        if (typeof M.then == "function")
          return V(D, ar(M), N);
        if (M.$$typeof === O)
          return V(
            D,
            xr(D, M),
            N
          );
        ir(D, M);
      }
      return null;
    }
    function j(D, M, N, G) {
      var P = M !== null ? M.key : null;
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return P !== null ? null : g(D, M, "" + N, G);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case h:
            return N.key === P ? x(D, M, N, G) : null;
          case m:
            return N.key === P ? C(D, M, N, G) : null;
          case B:
            return P = N._init, N = P(N._payload), j(D, M, N, G);
        }
        if (ae(N) || U(N))
          return P !== null ? null : q(D, M, N, G, null);
        if (typeof N.then == "function")
          return j(
            D,
            M,
            ar(N),
            G
          );
        if (N.$$typeof === O)
          return j(
            D,
            M,
            xr(D, N),
            G
          );
        ir(D, N);
      }
      return null;
    }
    function L(D, M, N, G, P) {
      if (typeof G == "string" && G !== "" || typeof G == "number" || typeof G == "bigint")
        return D = D.get(N) || null, g(M, D, "" + G, P);
      if (typeof G == "object" && G !== null) {
        switch (G.$$typeof) {
          case h:
            return D = D.get(
              G.key === null ? N : G.key
            ) || null, x(M, D, G, P);
          case m:
            return D = D.get(
              G.key === null ? N : G.key
            ) || null, C(M, D, G, P);
          case B:
            var me = G._init;
            return G = me(G._payload), L(
              D,
              M,
              N,
              G,
              P
            );
        }
        if (ae(G) || U(G))
          return D = D.get(N) || null, q(M, D, G, P, null);
        if (typeof G.then == "function")
          return L(
            D,
            M,
            N,
            ar(G),
            P
          );
        if (G.$$typeof === O)
          return L(
            D,
            M,
            N,
            xr(M, G),
            P
          );
        ir(M, G);
      }
      return null;
    }
    function ne(D, M, N, G) {
      for (var P = null, me = null, ie = M, ue = M = 0, Fe = null; ie !== null && ue < N.length; ue++) {
        ie.index > ue ? (Fe = ie, ie = null) : Fe = ie.sibling;
        var Te = j(
          D,
          ie,
          N[ue],
          G
        );
        if (Te === null) {
          ie === null && (ie = Fe);
          break;
        }
        e && ie && Te.alternate === null && t(D, ie), M = c(Te, M, ue), me === null ? P = Te : me.sibling = Te, me = Te, ie = Fe;
      }
      if (ue === N.length)
        return n(D, ie), Ae && al(D, ue), P;
      if (ie === null) {
        for (; ue < N.length; ue++)
          ie = V(D, N[ue], G), ie !== null && (M = c(
            ie,
            M,
            ue
          ), me === null ? P = ie : me.sibling = ie, me = ie);
        return Ae && al(D, ue), P;
      }
      for (ie = a(ie); ue < N.length; ue++)
        Fe = L(
          ie,
          D,
          ue,
          N[ue],
          G
        ), Fe !== null && (e && Fe.alternate !== null && ie.delete(
          Fe.key === null ? ue : Fe.key
        ), M = c(
          Fe,
          M,
          ue
        ), me === null ? P = Fe : me.sibling = Fe, me = Fe);
      return e && ie.forEach(function(Yn) {
        return t(D, Yn);
      }), Ae && al(D, ue), P;
    }
    function ce(D, M, N, G) {
      if (N == null) throw Error(s(151));
      for (var P = null, me = null, ie = M, ue = M = 0, Fe = null, Te = N.next(); ie !== null && !Te.done; ue++, Te = N.next()) {
        ie.index > ue ? (Fe = ie, ie = null) : Fe = ie.sibling;
        var Yn = j(D, ie, Te.value, G);
        if (Yn === null) {
          ie === null && (ie = Fe);
          break;
        }
        e && ie && Yn.alternate === null && t(D, ie), M = c(Yn, M, ue), me === null ? P = Yn : me.sibling = Yn, me = Yn, ie = Fe;
      }
      if (Te.done)
        return n(D, ie), Ae && al(D, ue), P;
      if (ie === null) {
        for (; !Te.done; ue++, Te = N.next())
          Te = V(D, Te.value, G), Te !== null && (M = c(Te, M, ue), me === null ? P = Te : me.sibling = Te, me = Te);
        return Ae && al(D, ue), P;
      }
      for (ie = a(ie); !Te.done; ue++, Te = N.next())
        Te = L(ie, D, ue, Te.value, G), Te !== null && (e && Te.alternate !== null && ie.delete(Te.key === null ? ue : Te.key), M = c(Te, M, ue), me === null ? P = Te : me.sibling = Te, me = Te);
      return e && ie.forEach(function(pb) {
        return t(D, pb);
      }), Ae && al(D, ue), P;
    }
    function qe(D, M, N, G) {
      if (typeof N == "object" && N !== null && N.type === v && N.key === null && (N = N.props.children), typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case h:
            e: {
              for (var P = N.key; M !== null; ) {
                if (M.key === P) {
                  if (P = N.type, P === v) {
                    if (M.tag === 7) {
                      n(
                        D,
                        M.sibling
                      ), G = r(
                        M,
                        N.props.children
                      ), G.return = D, D = G;
                      break e;
                    }
                  } else if (M.elementType === P || typeof P == "object" && P !== null && P.$$typeof === B && od(P) === M.type) {
                    n(
                      D,
                      M.sibling
                    ), G = r(M, N.props), Fa(G, N), G.return = D, D = G;
                    break e;
                  }
                  n(D, M);
                  break;
                } else t(D, M);
                M = M.sibling;
              }
              N.type === v ? (G = vl(
                N.props.children,
                D.mode,
                G,
                N.key
              ), G.return = D, D = G) : (G = Ar(
                N.type,
                N.key,
                N.props,
                null,
                D.mode,
                G
              ), Fa(G, N), G.return = D, D = G);
            }
            return d(D);
          case m:
            e: {
              for (P = N.key; M !== null; ) {
                if (M.key === P)
                  if (M.tag === 4 && M.stateNode.containerInfo === N.containerInfo && M.stateNode.implementation === N.implementation) {
                    n(
                      D,
                      M.sibling
                    ), G = r(M, N.children || []), G.return = D, D = G;
                    break e;
                  } else {
                    n(D, M);
                    break;
                  }
                else t(D, M);
                M = M.sibling;
              }
              G = ec(N, D.mode, G), G.return = D, D = G;
            }
            return d(D);
          case B:
            return P = N._init, N = P(N._payload), qe(
              D,
              M,
              N,
              G
            );
        }
        if (ae(N))
          return ne(
            D,
            M,
            N,
            G
          );
        if (U(N)) {
          if (P = U(N), typeof P != "function") throw Error(s(150));
          return N = P.call(N), ce(
            D,
            M,
            N,
            G
          );
        }
        if (typeof N.then == "function")
          return qe(
            D,
            M,
            ar(N),
            G
          );
        if (N.$$typeof === O)
          return qe(
            D,
            M,
            xr(D, N),
            G
          );
        ir(D, N);
      }
      return typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint" ? (N = "" + N, M !== null && M.tag === 6 ? (n(D, M.sibling), G = r(M, N), G.return = D, D = G) : (n(D, M), G = Is(N, D.mode, G), G.return = D, D = G), d(D)) : n(D, M);
    }
    return function(D, M, N, G) {
      try {
        Wa = 0;
        var P = qe(
          D,
          M,
          N,
          G
        );
        return Kl = null, P;
      } catch (ie) {
        if (ie === Ka) throw ie;
        var me = Dt(29, ie, null, D.mode);
        return me.lanes = G, me.return = D, me;
      } finally {
      }
    };
  }
  var rl = fd(!0), dd = fd(!1), Jl = Ee(null), rr = Ee(0);
  function hd(e, t) {
    e = on, Me(rr, e), Me(Jl, t), on = e | t.baseLanes;
  }
  function rs() {
    Me(rr, on), Me(Jl, Jl.current);
  }
  function us() {
    on = rr.current, je(Jl), je(rr);
  }
  var Ot = Ee(null), Gt = null;
  function wn(e) {
    var t = e.alternate;
    Me(Qe, Qe.current & 1), Me(Ot, e), Gt === null && (t === null || Jl.current !== null || t.memoizedState !== null) && (Gt = e);
  }
  function md(e) {
    if (e.tag === 22) {
      if (Me(Qe, Qe.current), Me(Ot, e), Gt === null) {
        var t = e.alternate;
        t !== null && t.memoizedState !== null && (Gt = e);
      }
    } else Rn();
  }
  function Rn() {
    Me(Qe, Qe.current), Me(Ot, Ot.current);
  }
  function It(e) {
    je(Ot), Gt === e && (Gt = null), je(Qe);
  }
  var Qe = Ee(0);
  function ur(e) {
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
  var l0 = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, a0 = l.unstable_scheduleCallback, i0 = l.unstable_NormalPriority, Ze = {
    $$typeof: O,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function ss() {
    return {
      controller: new l0(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function $a(e) {
    e.refCount--, e.refCount === 0 && a0(i0, function() {
      e.controller.abort();
    });
  }
  var Pa = null, cs = 0, Wl = 0, Fl = null;
  function r0(e, t) {
    if (Pa === null) {
      var n = Pa = [];
      cs = 0, Wl = vc(), Fl = {
        status: "pending",
        value: void 0,
        then: function(a) {
          n.push(a);
        }
      };
    }
    return cs++, t.then(vd, vd), t;
  }
  function vd() {
    if (--cs === 0 && Pa !== null) {
      Fl !== null && (Fl.status = "fulfilled");
      var e = Pa;
      Pa = null, Wl = 0, Fl = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function u0(e, t) {
    var n = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(r) {
        n.push(r);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var r = 0; r < n.length; r++) (0, n[r])(t);
      },
      function(r) {
        for (a.status = "rejected", a.reason = r, r = 0; r < n.length; r++)
          (0, n[r])(void 0);
      }
    ), a;
  }
  var pd = J.S;
  J.S = function(e, t) {
    typeof t == "object" && t !== null && typeof t.then == "function" && r0(e, t), pd !== null && pd(e, t);
  };
  var ul = Ee(null);
  function os() {
    var e = ul.current;
    return e !== null ? e : De.pooledCache;
  }
  function sr(e, t) {
    t === null ? Me(ul, ul.current) : Me(ul, t.pool);
  }
  function gd() {
    var e = os();
    return e === null ? null : { parent: Ze._currentValue, pool: e };
  }
  var On = 0, he = null, we = null, Ve = null, cr = !1, $l = !1, sl = !1, or = 0, Ia = 0, Pl = null, s0 = 0;
  function Ge() {
    throw Error(s(321));
  }
  function fs(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!pt(e[n], t[n])) return !1;
    return !0;
  }
  function ds(e, t, n, a, r, c) {
    return On = c, he = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, J.H = e === null || e.memoizedState === null ? cl : Mn, sl = !1, c = n(a, r), sl = !1, $l && (c = bd(
      t,
      n,
      a,
      r
    )), yd(e), c;
  }
  function yd(e) {
    J.H = Vt;
    var t = we !== null && we.next !== null;
    if (On = 0, Ve = we = he = null, cr = !1, Ia = 0, Pl = null, t) throw Error(s(300));
    e === null || Je || (e = e.dependencies, e !== null && br(e) && (Je = !0));
  }
  function bd(e, t, n, a) {
    he = e;
    var r = 0;
    do {
      if ($l && (Pl = null), Ia = 0, $l = !1, 25 <= r) throw Error(s(301));
      if (r += 1, Ve = we = null, e.updateQueue != null) {
        var c = e.updateQueue;
        c.lastEffect = null, c.events = null, c.stores = null, c.memoCache != null && (c.memoCache.index = 0);
      }
      J.H = ol, c = t(n, a);
    } while ($l);
    return c;
  }
  function c0() {
    var e = J.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? ei(t) : t, e = e.useState()[0], (we !== null ? we.memoizedState : null) !== e && (he.flags |= 1024), t;
  }
  function hs() {
    var e = or !== 0;
    return or = 0, e;
  }
  function ms(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function vs(e) {
    if (cr) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      cr = !1;
    }
    On = 0, Ve = we = he = null, $l = !1, Ia = or = 0, Pl = null;
  }
  function ct() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ve === null ? he.memoizedState = Ve = e : Ve = Ve.next = e, Ve;
  }
  function Ye() {
    if (we === null) {
      var e = he.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = we.next;
    var t = Ve === null ? he.memoizedState : Ve.next;
    if (t !== null)
      Ve = t, we = e;
    else {
      if (e === null)
        throw he.alternate === null ? Error(s(467)) : Error(s(310));
      we = e, e = {
        memoizedState: we.memoizedState,
        baseState: we.baseState,
        baseQueue: we.baseQueue,
        queue: we.queue,
        next: null
      }, Ve === null ? he.memoizedState = Ve = e : Ve = Ve.next = e;
    }
    return Ve;
  }
  var fr;
  fr = function() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  };
  function ei(e) {
    var t = Ia;
    return Ia += 1, Pl === null && (Pl = []), e = sd(Pl, e, t), t = he, (Ve === null ? t.memoizedState : Ve.next) === null && (t = t.alternate, J.H = t === null || t.memoizedState === null ? cl : Mn), e;
  }
  function dr(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return ei(e);
      if (e.$$typeof === O) return nt(e);
    }
    throw Error(s(438, String(e)));
  }
  function ps(e) {
    var t = null, n = he.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var a = he.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(r) {
          return r.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = fr(), he.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), a = 0; a < e; a++)
        n[a] = X;
    return t.index++, n;
  }
  function en(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function hr(e) {
    var t = Ye();
    return gs(t, we, e);
  }
  function gs(e, t, n) {
    var a = e.queue;
    if (a === null) throw Error(s(311));
    a.lastRenderedReducer = n;
    var r = e.baseQueue, c = a.pending;
    if (c !== null) {
      if (r !== null) {
        var d = r.next;
        r.next = c.next, c.next = d;
      }
      t.baseQueue = r = c, a.pending = null;
    }
    if (c = e.baseState, r === null) e.memoizedState = c;
    else {
      t = r.next;
      var g = d = null, x = null, C = t, q = !1;
      do {
        var V = C.lane & -536870913;
        if (V !== C.lane ? (Se & V) === V : (On & V) === V) {
          var j = C.revertLane;
          if (j === 0)
            x !== null && (x = x.next = {
              lane: 0,
              revertLane: 0,
              action: C.action,
              hasEagerState: C.hasEagerState,
              eagerState: C.eagerState,
              next: null
            }), V === Wl && (q = !0);
          else if ((On & j) === j) {
            C = C.next, j === Wl && (q = !0);
            continue;
          } else
            V = {
              lane: 0,
              revertLane: C.revertLane,
              action: C.action,
              hasEagerState: C.hasEagerState,
              eagerState: C.eagerState,
              next: null
            }, x === null ? (g = x = V, d = c) : x = x.next = V, he.lanes |= j, Ln |= j;
          V = C.action, sl && n(c, V), c = C.hasEagerState ? C.eagerState : n(c, V);
        } else
          j = {
            lane: V,
            revertLane: C.revertLane,
            action: C.action,
            hasEagerState: C.hasEagerState,
            eagerState: C.eagerState,
            next: null
          }, x === null ? (g = x = j, d = c) : x = x.next = j, he.lanes |= V, Ln |= V;
        C = C.next;
      } while (C !== null && C !== t);
      if (x === null ? d = c : x.next = g, !pt(c, e.memoizedState) && (Je = !0, q && (n = Fl, n !== null)))
        throw n;
      e.memoizedState = c, e.baseState = d, e.baseQueue = x, a.lastRenderedState = c;
    }
    return r === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function ys(e) {
    var t = Ye(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var a = n.dispatch, r = n.pending, c = t.memoizedState;
    if (r !== null) {
      n.pending = null;
      var d = r = r.next;
      do
        c = e(c, d.action), d = d.next;
      while (d !== r);
      pt(c, t.memoizedState) || (Je = !0), t.memoizedState = c, t.baseQueue === null && (t.baseState = c), n.lastRenderedState = c;
    }
    return [c, a];
  }
  function xd(e, t, n) {
    var a = he, r = Ye(), c = Ae;
    if (c) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else n = t();
    var d = !pt(
      (we || r).memoizedState,
      n
    );
    if (d && (r.memoizedState = n, Je = !0), r = r.queue, Ss(Ad.bind(null, a, r, e), [
      e
    ]), r.getSnapshot !== t || d || Ve !== null && Ve.memoizedState.tag & 1) {
      if (a.flags |= 2048, Il(
        9,
        Ed.bind(
          null,
          a,
          r,
          n,
          t
        ),
        { destroy: void 0 },
        null
      ), De === null) throw Error(s(349));
      c || On & 60 || Sd(a, t, n);
    }
    return n;
  }
  function Sd(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = he.updateQueue, t === null ? (t = fr(), he.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ed(e, t, n, a) {
    t.value = n, t.getSnapshot = a, Td(t) && wd(e);
  }
  function Ad(e, t, n) {
    return n(function() {
      Td(t) && wd(e);
    });
  }
  function Td(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !pt(e, n);
    } catch {
      return !0;
    }
  }
  function wd(e) {
    var t = Tn(e, 2);
    t !== null && it(t, e, 2);
  }
  function bs(e) {
    var t = ct();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), sl) {
        Sn(!0);
        try {
          n();
        } finally {
          Sn(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: en,
      lastRenderedState: e
    }, t;
  }
  function Rd(e, t, n, a) {
    return e.baseState = n, gs(
      e,
      we,
      typeof a == "function" ? a : en
    );
  }
  function o0(e, t, n, a, r) {
    if (pr(e)) throw Error(s(485));
    if (e = t.action, e !== null) {
      var c = {
        payload: r,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(d) {
          c.listeners.push(d);
        }
      };
      J.T !== null ? n(!0) : c.isTransition = !1, a(c), n = t.pending, n === null ? (c.next = t.pending = c, Od(t, c)) : (c.next = n.next, t.pending = n.next = c);
    }
  }
  function Od(e, t) {
    var n = t.action, a = t.payload, r = e.state;
    if (t.isTransition) {
      var c = J.T, d = {};
      J.T = d;
      try {
        var g = n(r, a), x = J.S;
        x !== null && x(d, g), Md(e, t, g);
      } catch (C) {
        xs(e, t, C);
      } finally {
        J.T = c;
      }
    } else
      try {
        c = n(r, a), Md(e, t, c);
      } catch (C) {
        xs(e, t, C);
      }
  }
  function Md(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(a) {
        Cd(e, t, a);
      },
      function(a) {
        return xs(e, t, a);
      }
    ) : Cd(e, t, n);
  }
  function Cd(e, t, n) {
    t.status = "fulfilled", t.value = n, Dd(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Od(e, n)));
  }
  function xs(e, t, n) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = n, Dd(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Dd(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Nd(e, t) {
    return t;
  }
  function zd(e, t) {
    if (Ae) {
      var n = De.formState;
      if (n !== null) {
        e: {
          var a = he;
          if (Ae) {
            if (Pe) {
              t: {
                for (var r = Pe, c = kt; r.nodeType !== 8; ) {
                  if (!c) {
                    r = null;
                    break t;
                  }
                  if (r = Ht(
                    r.nextSibling
                  ), r === null) {
                    r = null;
                    break t;
                  }
                }
                c = r.data, r = c === "F!" || c === "F" ? r : null;
              }
              if (r) {
                Pe = Ht(
                  r.nextSibling
                ), a = r.data === "F!";
                break e;
              }
            }
            il(a);
          }
          a = !1;
        }
        a && (t = n[0]);
      }
    }
    return n = ct(), n.memoizedState = n.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Nd,
      lastRenderedState: t
    }, n.queue = a, n = Fd.bind(
      null,
      he,
      a
    ), a.dispatch = n, a = bs(!1), c = Rs.bind(
      null,
      he,
      !1,
      a.queue
    ), a = ct(), r = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = r, n = o0.bind(
      null,
      he,
      r,
      c,
      n
    ), r.dispatch = n, a.memoizedState = e, [t, n, !1];
  }
  function _d(e) {
    var t = Ye();
    return jd(t, we, e);
  }
  function jd(e, t, n) {
    t = gs(
      e,
      t,
      Nd
    )[0], e = hr(en)[0], t = typeof t == "object" && t !== null && typeof t.then == "function" ? ei(t) : t;
    var a = Ye(), r = a.queue, c = r.dispatch;
    return n !== a.memoizedState && (he.flags |= 2048, Il(
      9,
      f0.bind(null, r, n),
      { destroy: void 0 },
      null
    )), [t, c, e];
  }
  function f0(e, t) {
    e.action = t;
  }
  function Ud(e) {
    var t = Ye(), n = we;
    if (n !== null)
      return jd(t, n, e);
    Ye(), t = t.memoizedState, n = Ye();
    var a = n.queue.dispatch;
    return n.memoizedState = e, [t, a, !1];
  }
  function Il(e, t, n, a) {
    return e = { tag: e, create: t, inst: n, deps: a, next: null }, t = he.updateQueue, t === null && (t = fr(), he.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (a = n.next, n.next = e, e.next = a, t.lastEffect = e), e;
  }
  function Hd() {
    return Ye().memoizedState;
  }
  function mr(e, t, n, a) {
    var r = ct();
    he.flags |= e, r.memoizedState = Il(
      1 | t,
      n,
      { destroy: void 0 },
      a === void 0 ? null : a
    );
  }
  function vr(e, t, n, a) {
    var r = Ye();
    a = a === void 0 ? null : a;
    var c = r.memoizedState.inst;
    we !== null && a !== null && fs(a, we.memoizedState.deps) ? r.memoizedState = Il(t, n, c, a) : (he.flags |= e, r.memoizedState = Il(1 | t, n, c, a));
  }
  function Ld(e, t) {
    mr(8390656, 8, e, t);
  }
  function Ss(e, t) {
    vr(2048, 8, e, t);
  }
  function Bd(e, t) {
    return vr(4, 2, e, t);
  }
  function qd(e, t) {
    return vr(4, 4, e, t);
  }
  function kd(e, t) {
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
  function Gd(e, t, n) {
    n = n != null ? n.concat([e]) : null, vr(4, 4, kd.bind(null, t, e), n);
  }
  function Es() {
  }
  function Vd(e, t) {
    var n = Ye();
    t = t === void 0 ? null : t;
    var a = n.memoizedState;
    return t !== null && fs(t, a[1]) ? a[0] : (n.memoizedState = [e, t], e);
  }
  function Yd(e, t) {
    var n = Ye();
    t = t === void 0 ? null : t;
    var a = n.memoizedState;
    if (t !== null && fs(t, a[1]))
      return a[0];
    if (a = e(), sl) {
      Sn(!0);
      try {
        e();
      } finally {
        Sn(!1);
      }
    }
    return n.memoizedState = [a, t], a;
  }
  function As(e, t, n) {
    return n === void 0 || On & 1073741824 ? e.memoizedState = t : (e.memoizedState = n, e = Qh(), he.lanes |= e, Ln |= e, n);
  }
  function Xd(e, t, n, a) {
    return pt(n, t) ? n : Jl.current !== null ? (e = As(e, n, a), pt(e, t) || (Je = !0), e) : On & 42 ? (e = Qh(), he.lanes |= e, Ln |= e, t) : (Je = !0, e.memoizedState = n);
  }
  function Qd(e, t, n, a, r) {
    var c = $.p;
    $.p = c !== 0 && 8 > c ? c : 8;
    var d = J.T, g = {};
    J.T = g, Rs(e, !1, t, n);
    try {
      var x = r(), C = J.S;
      if (C !== null && C(g, x), x !== null && typeof x == "object" && typeof x.then == "function") {
        var q = u0(
          x,
          a
        );
        ti(
          e,
          t,
          q,
          xt(e)
        );
      } else
        ti(
          e,
          t,
          a,
          xt(e)
        );
    } catch (V) {
      ti(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: V },
        xt()
      );
    } finally {
      $.p = c, J.T = d;
    }
  }
  function d0() {
  }
  function Ts(e, t, n, a) {
    if (e.tag !== 5) throw Error(s(476));
    var r = Zd(e).queue;
    Qd(
      e,
      r,
      t,
      oe,
      n === null ? d0 : function() {
        return Kd(e), n(a);
      }
    );
  }
  function Zd(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: oe,
      baseState: oe,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: en,
        lastRenderedState: oe
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
        lastRenderedReducer: en,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Kd(e) {
    var t = Zd(e).next.queue;
    ti(e, t, {}, xt());
  }
  function ws() {
    return nt(Si);
  }
  function Jd() {
    return Ye().memoizedState;
  }
  function Wd() {
    return Ye().memoizedState;
  }
  function h0(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = xt();
          e = Nn(n);
          var a = zn(t, e, n);
          a !== null && (it(a, t, n), ai(a, t, n)), t = { cache: ss() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function m0(e, t, n) {
    var a = xt();
    n = {
      lane: a,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, pr(e) ? $d(t, n) : (n = ts(e, t, n, a), n !== null && (it(n, e, a), Pd(n, t, a)));
  }
  function Fd(e, t, n) {
    var a = xt();
    ti(e, t, n, a);
  }
  function ti(e, t, n, a) {
    var r = {
      lane: a,
      revertLane: 0,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (pr(e)) $d(t, r);
    else {
      var c = e.alternate;
      if (e.lanes === 0 && (c === null || c.lanes === 0) && (c = t.lastRenderedReducer, c !== null))
        try {
          var d = t.lastRenderedState, g = c(d, n);
          if (r.hasEagerState = !0, r.eagerState = g, pt(g, d))
            return Ii(e, t, r, 0), De === null && Pi(), !1;
        } catch {
        } finally {
        }
      if (n = ts(e, t, r, a), n !== null)
        return it(n, e, a), Pd(n, t, a), !0;
    }
    return !1;
  }
  function Rs(e, t, n, a) {
    if (a = {
      lane: 2,
      revertLane: vc(),
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, pr(e)) {
      if (t) throw Error(s(479));
    } else
      t = ts(
        e,
        n,
        a,
        2
      ), t !== null && it(t, e, 2);
  }
  function pr(e) {
    var t = e.alternate;
    return e === he || t !== null && t === he;
  }
  function $d(e, t) {
    $l = cr = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Pd(e, t, n) {
    if (n & 4194176) {
      var a = t.lanes;
      a &= e.pendingLanes, n |= a, t.lanes = n, cf(e, n);
    }
  }
  var Vt = {
    readContext: nt,
    use: dr,
    useCallback: Ge,
    useContext: Ge,
    useEffect: Ge,
    useImperativeHandle: Ge,
    useLayoutEffect: Ge,
    useInsertionEffect: Ge,
    useMemo: Ge,
    useReducer: Ge,
    useRef: Ge,
    useState: Ge,
    useDebugValue: Ge,
    useDeferredValue: Ge,
    useTransition: Ge,
    useSyncExternalStore: Ge,
    useId: Ge
  };
  Vt.useCacheRefresh = Ge, Vt.useMemoCache = Ge, Vt.useHostTransitionStatus = Ge, Vt.useFormState = Ge, Vt.useActionState = Ge, Vt.useOptimistic = Ge;
  var cl = {
    readContext: nt,
    use: dr,
    useCallback: function(e, t) {
      return ct().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: nt,
    useEffect: Ld,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, mr(
        4194308,
        4,
        kd.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return mr(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      mr(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = ct();
      t = t === void 0 ? null : t;
      var a = e();
      if (sl) {
        Sn(!0);
        try {
          e();
        } finally {
          Sn(!1);
        }
      }
      return n.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, n) {
      var a = ct();
      if (n !== void 0) {
        var r = n(t);
        if (sl) {
          Sn(!0);
          try {
            n(t);
          } finally {
            Sn(!1);
          }
        }
      } else r = t;
      return a.memoizedState = a.baseState = r, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: r
      }, a.queue = e, e = e.dispatch = m0.bind(
        null,
        he,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ct();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = bs(e);
      var t = e.queue, n = Fd.bind(null, he, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: Es,
    useDeferredValue: function(e, t) {
      var n = ct();
      return As(n, e, t);
    },
    useTransition: function() {
      var e = bs(!1);
      return e = Qd.bind(
        null,
        he,
        e.queue,
        !0,
        !1
      ), ct().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var a = he, r = ct();
      if (Ae) {
        if (n === void 0)
          throw Error(s(407));
        n = n();
      } else {
        if (n = t(), De === null) throw Error(s(349));
        Se & 60 || Sd(a, t, n);
      }
      r.memoizedState = n;
      var c = { value: n, getSnapshot: t };
      return r.queue = c, Ld(Ad.bind(null, a, c, e), [
        e
      ]), a.flags |= 2048, Il(
        9,
        Ed.bind(
          null,
          a,
          c,
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
        var n = Pt, a = $t;
        n = (a & ~(1 << 32 - vt(a) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = or++, 0 < n && (t += "H" + n.toString(32)), t += ":";
      } else
        n = s0++, t = ":" + t + "r" + n.toString(32) + ":";
      return e.memoizedState = t;
    },
    useCacheRefresh: function() {
      return ct().memoizedState = h0.bind(
        null,
        he
      );
    }
  };
  cl.useMemoCache = ps, cl.useHostTransitionStatus = ws, cl.useFormState = zd, cl.useActionState = zd, cl.useOptimistic = function(e) {
    var t = ct();
    t.memoizedState = t.baseState = e;
    var n = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: null,
      lastRenderedState: null
    };
    return t.queue = n, t = Rs.bind(
      null,
      he,
      !0,
      n
    ), n.dispatch = t, [e, t];
  };
  var Mn = {
    readContext: nt,
    use: dr,
    useCallback: Vd,
    useContext: nt,
    useEffect: Ss,
    useImperativeHandle: Gd,
    useInsertionEffect: Bd,
    useLayoutEffect: qd,
    useMemo: Yd,
    useReducer: hr,
    useRef: Hd,
    useState: function() {
      return hr(en);
    },
    useDebugValue: Es,
    useDeferredValue: function(e, t) {
      var n = Ye();
      return Xd(
        n,
        we.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = hr(en)[0], t = Ye().memoizedState;
      return [
        typeof e == "boolean" ? e : ei(e),
        t
      ];
    },
    useSyncExternalStore: xd,
    useId: Jd
  };
  Mn.useCacheRefresh = Wd, Mn.useMemoCache = ps, Mn.useHostTransitionStatus = ws, Mn.useFormState = _d, Mn.useActionState = _d, Mn.useOptimistic = function(e, t) {
    var n = Ye();
    return Rd(n, we, e, t);
  };
  var ol = {
    readContext: nt,
    use: dr,
    useCallback: Vd,
    useContext: nt,
    useEffect: Ss,
    useImperativeHandle: Gd,
    useInsertionEffect: Bd,
    useLayoutEffect: qd,
    useMemo: Yd,
    useReducer: ys,
    useRef: Hd,
    useState: function() {
      return ys(en);
    },
    useDebugValue: Es,
    useDeferredValue: function(e, t) {
      var n = Ye();
      return we === null ? As(n, e, t) : Xd(
        n,
        we.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ys(en)[0], t = Ye().memoizedState;
      return [
        typeof e == "boolean" ? e : ei(e),
        t
      ];
    },
    useSyncExternalStore: xd,
    useId: Jd
  };
  ol.useCacheRefresh = Wd, ol.useMemoCache = ps, ol.useHostTransitionStatus = ws, ol.useFormState = Ud, ol.useActionState = Ud, ol.useOptimistic = function(e, t) {
    var n = Ye();
    return we !== null ? Rd(n, we, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
  };
  function Os(e, t, n, a) {
    t = e.memoizedState, n = n(a, t), n = n == null ? t : F({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Ms = {
    isMounted: function(e) {
      return (e = e._reactInternals) ? Z(e) === e : !1;
    },
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var a = xt(), r = Nn(a);
      r.payload = t, n != null && (r.callback = n), t = zn(e, r, a), t !== null && (it(t, e, a), ai(t, e, a));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var a = xt(), r = Nn(a);
      r.tag = 1, r.payload = t, n != null && (r.callback = n), t = zn(e, r, a), t !== null && (it(t, e, a), ai(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = xt(), a = Nn(n);
      a.tag = 2, t != null && (a.callback = t), t = zn(e, a, n), t !== null && (it(t, e, n), ai(t, e, n));
    }
  };
  function Id(e, t, n, a, r, c, d) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, c, d) : t.prototype && t.prototype.isPureReactComponent ? !Va(n, a) || !Va(r, c) : !0;
  }
  function eh(e, t, n, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, a), t.state !== e && Ms.enqueueReplaceState(t, t.state, null);
  }
  function fl(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var a in t)
        a !== "ref" && (n[a] = t[a]);
    }
    if (e = e.defaultProps) {
      n === t && (n = F({}, n));
      for (var r in e)
        n[r] === void 0 && (n[r] = e[r]);
    }
    return n;
  }
  var gr = typeof reportError == "function" ? reportError : function(e) {
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
  function th(e) {
    gr(e);
  }
  function nh(e) {
    console.error(e);
  }
  function lh(e) {
    gr(e);
  }
  function yr(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function ah(e, t, n) {
    try {
      var a = e.onCaughtError;
      a(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  function Cs(e, t, n) {
    return n = Nn(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      yr(e, t);
    }, n;
  }
  function ih(e) {
    return e = Nn(e), e.tag = 3, e;
  }
  function rh(e, t, n, a) {
    var r = n.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var c = a.value;
      e.payload = function() {
        return r(c);
      }, e.callback = function() {
        ah(t, n, a);
      };
    }
    var d = n.stateNode;
    d !== null && typeof d.componentDidCatch == "function" && (e.callback = function() {
      ah(t, n, a), typeof r != "function" && (Bn === null ? Bn = /* @__PURE__ */ new Set([this]) : Bn.add(this));
      var g = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: g !== null ? g : ""
      });
    });
  }
  function v0(e, t, n, a, r) {
    if (n.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = n.alternate, t !== null && li(
        t,
        n,
        r,
        !0
      ), n = Ot.current, n !== null) {
        switch (n.tag) {
          case 13:
            return Gt === null ? oc() : n.alternate === null && Be === 0 && (Be = 3), n.flags &= -257, n.flags |= 65536, n.lanes = r, a === is ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), dc(e, a, r)), !1;
          case 22:
            return n.flags |= 65536, a === is ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : n.add(a)), dc(e, a, r)), !1;
        }
        throw Error(s(435, n.tag));
      }
      return dc(e, a, r), oc(), !1;
    }
    if (Ae)
      return t = Ot.current, t !== null ? (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = r, a !== as && (e = Error(s(422), { cause: a }), Za(Tt(e, n)))) : (a !== as && (t = Error(s(423), {
        cause: a
      }), Za(
        Tt(t, n)
      )), e = e.current.alternate, e.flags |= 65536, r &= -r, e.lanes |= r, a = Tt(a, n), r = Cs(
        e.stateNode,
        a,
        r
      ), Xs(e, r), Be !== 4 && (Be = 2)), !1;
    var c = Error(s(520), { cause: a });
    if (c = Tt(c, n), di === null ? di = [c] : di.push(c), Be !== 4 && (Be = 2), t === null) return !0;
    a = Tt(a, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = r & -r, n.lanes |= e, e = Cs(n.stateNode, a, e), Xs(n, e), !1;
        case 1:
          if (t = n.type, c = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (Bn === null || !Bn.has(c))))
            return n.flags |= 65536, r &= -r, n.lanes |= r, r = ih(r), rh(
              r,
              e,
              n,
              a
            ), Xs(n, r), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var uh = Error(s(461)), Je = !1;
  function Ie(e, t, n, a) {
    t.child = e === null ? dd(t, null, n, a) : rl(
      t,
      e.child,
      n,
      a
    );
  }
  function sh(e, t, n, a, r) {
    n = n.render;
    var c = t.ref;
    if ("ref" in a) {
      var d = {};
      for (var g in a)
        g !== "ref" && (d[g] = a[g]);
    } else d = a;
    return hl(t), a = ds(
      e,
      t,
      n,
      d,
      c,
      r
    ), g = hs(), e !== null && !Je ? (ms(e, t, r), tn(e, t, r)) : (Ae && g && ns(t), t.flags |= 1, Ie(e, t, a, r), t.child);
  }
  function ch(e, t, n, a, r) {
    if (e === null) {
      var c = n.type;
      return typeof c == "function" && !Ps(c) && c.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = c, oh(
        e,
        t,
        c,
        a,
        r
      )) : (e = Ar(
        n.type,
        null,
        a,
        t,
        t.mode,
        r
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (c = e.child, !Bs(e, r)) {
      var d = c.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Va, n(d, a) && e.ref === t.ref)
        return tn(e, t, r);
    }
    return t.flags |= 1, e = Hn(c, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function oh(e, t, n, a, r) {
    if (e !== null) {
      var c = e.memoizedProps;
      if (Va(c, a) && e.ref === t.ref)
        if (Je = !1, t.pendingProps = a = c, Bs(e, r))
          e.flags & 131072 && (Je = !0);
        else
          return t.lanes = e.lanes, tn(e, t, r);
    }
    return Ds(
      e,
      t,
      n,
      a,
      r
    );
  }
  function fh(e, t, n) {
    var a = t.pendingProps, r = a.children, c = (t.stateNode._pendingVisibility & 2) !== 0, d = e !== null ? e.memoizedState : null;
    if (ni(e, t), a.mode === "hidden" || c) {
      if (t.flags & 128) {
        if (a = d !== null ? d.baseLanes | n : n, e !== null) {
          for (r = t.child = e.child, c = 0; r !== null; )
            c = c | r.lanes | r.childLanes, r = r.sibling;
          t.childLanes = c & ~a;
        } else t.childLanes = 0, t.child = null;
        return dh(
          e,
          t,
          a,
          n
        );
      }
      if (n & 536870912)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && sr(
          t,
          d !== null ? d.cachePool : null
        ), d !== null ? hd(t, d) : rs(), md(t);
      else
        return t.lanes = t.childLanes = 536870912, dh(
          e,
          t,
          d !== null ? d.baseLanes | n : n,
          n
        );
    } else
      d !== null ? (sr(t, d.cachePool), hd(t, d), Rn(), t.memoizedState = null) : (e !== null && sr(t, null), rs(), Rn());
    return Ie(e, t, r, n), t.child;
  }
  function dh(e, t, n, a) {
    var r = os();
    return r = r === null ? null : { parent: Ze._currentValue, pool: r }, t.memoizedState = {
      baseLanes: n,
      cachePool: r
    }, e !== null && sr(t, null), rs(), md(t), e !== null && li(e, t, a, !0), null;
  }
  function ni(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 2097664);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(s(284));
      (e === null || e.ref !== n) && (t.flags |= 2097664);
    }
  }
  function Ds(e, t, n, a, r) {
    return hl(t), n = ds(
      e,
      t,
      n,
      a,
      void 0,
      r
    ), a = hs(), e !== null && !Je ? (ms(e, t, r), tn(e, t, r)) : (Ae && a && ns(t), t.flags |= 1, Ie(e, t, n, r), t.child);
  }
  function hh(e, t, n, a, r, c) {
    return hl(t), t.updateQueue = null, n = bd(
      t,
      a,
      n,
      r
    ), yd(e), a = hs(), e !== null && !Je ? (ms(e, t, c), tn(e, t, c)) : (Ae && a && ns(t), t.flags |= 1, Ie(e, t, n, c), t.child);
  }
  function mh(e, t, n, a, r) {
    if (hl(t), t.stateNode === null) {
      var c = Xl, d = n.contextType;
      typeof d == "object" && d !== null && (c = nt(d)), c = new n(a, c), t.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, c.updater = Ms, t.stateNode = c, c._reactInternals = t, c = t.stateNode, c.props = a, c.state = t.memoizedState, c.refs = {}, Vs(t), d = n.contextType, c.context = typeof d == "object" && d !== null ? nt(d) : Xl, c.state = t.memoizedState, d = n.getDerivedStateFromProps, typeof d == "function" && (Os(
        t,
        n,
        d,
        a
      ), c.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (d = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), d !== c.state && Ms.enqueueReplaceState(c, c.state, null), ri(t, a, c, r), ii(), c.state = t.memoizedState), typeof c.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      c = t.stateNode;
      var g = t.memoizedProps, x = fl(n, g);
      c.props = x;
      var C = c.context, q = n.contextType;
      d = Xl, typeof q == "object" && q !== null && (d = nt(q));
      var V = n.getDerivedStateFromProps;
      q = typeof V == "function" || typeof c.getSnapshotBeforeUpdate == "function", g = t.pendingProps !== g, q || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (g || C !== d) && eh(
        t,
        c,
        a,
        d
      ), Dn = !1;
      var j = t.memoizedState;
      c.state = j, ri(t, a, c, r), ii(), C = t.memoizedState, g || j !== C || Dn ? (typeof V == "function" && (Os(
        t,
        n,
        V,
        a
      ), C = t.memoizedState), (x = Dn || Id(
        t,
        n,
        x,
        a,
        j,
        C,
        d
      )) ? (q || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = C), c.props = a, c.state = C, c.context = d, a = x) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      c = t.stateNode, Ys(e, t), d = t.memoizedProps, q = fl(n, d), c.props = q, V = t.pendingProps, j = c.context, C = n.contextType, x = Xl, typeof C == "object" && C !== null && (x = nt(C)), g = n.getDerivedStateFromProps, (C = typeof g == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (d !== V || j !== x) && eh(
        t,
        c,
        a,
        x
      ), Dn = !1, j = t.memoizedState, c.state = j, ri(t, a, c, r), ii();
      var L = t.memoizedState;
      d !== V || j !== L || Dn || e !== null && e.dependencies !== null && br(e.dependencies) ? (typeof g == "function" && (Os(
        t,
        n,
        g,
        a
      ), L = t.memoizedState), (q = Dn || Id(
        t,
        n,
        q,
        a,
        j,
        L,
        x
      ) || e !== null && e.dependencies !== null && br(e.dependencies)) ? (C || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(a, L, x), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(
        a,
        L,
        x
      )), typeof c.componentDidUpdate == "function" && (t.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || d === e.memoizedProps && j === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && j === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = L), c.props = a, c.state = L, c.context = x, a = q) : (typeof c.componentDidUpdate != "function" || d === e.memoizedProps && j === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && j === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return c = a, ni(e, t), a = (t.flags & 128) !== 0, c || a ? (c = t.stateNode, n = a && typeof n.getDerivedStateFromError != "function" ? null : c.render(), t.flags |= 1, e !== null && a ? (t.child = rl(
      t,
      e.child,
      null,
      r
    ), t.child = rl(
      t,
      null,
      n,
      r
    )) : Ie(e, t, n, r), t.memoizedState = c.state, e = t.child) : e = tn(
      e,
      t,
      r
    ), e;
  }
  function vh(e, t, n, a) {
    return Qa(), t.flags |= 256, Ie(e, t, n, a), t.child;
  }
  var Ns = { dehydrated: null, treeContext: null, retryLane: 0 };
  function zs(e) {
    return { baseLanes: e, cachePool: gd() };
  }
  function _s(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= Nt), e;
  }
  function ph(e, t, n) {
    var a = t.pendingProps, r = !1, c = (t.flags & 128) !== 0, d;
    if ((d = c) || (d = e !== null && e.memoizedState === null ? !1 : (Qe.current & 2) !== 0), d && (r = !0, t.flags &= -129), d = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ae) {
        if (r ? wn(t) : Rn(), Ae) {
          var g = Pe, x;
          if (x = g) {
            e: {
              for (x = g, g = kt; x.nodeType !== 8; ) {
                if (!g) {
                  g = null;
                  break e;
                }
                if (x = Ht(
                  x.nextSibling
                ), x === null) {
                  g = null;
                  break e;
                }
              }
              g = x;
            }
            g !== null ? (t.memoizedState = {
              dehydrated: g,
              treeContext: ll !== null ? { id: $t, overflow: Pt } : null,
              retryLane: 536870912
            }, x = Dt(
              18,
              null,
              null,
              0
            ), x.stateNode = g, x.return = t, t.child = x, at = t, Pe = null, x = !0) : x = !1;
          }
          x || il(t);
        }
        if (g = t.memoizedState, g !== null && (g = g.dehydrated, g !== null))
          return g.data === "$!" ? t.lanes = 16 : t.lanes = 536870912, null;
        It(t);
      }
      return g = a.children, a = a.fallback, r ? (Rn(), r = t.mode, g = Us(
        { mode: "hidden", children: g },
        r
      ), a = vl(
        a,
        r,
        n,
        null
      ), g.return = t, a.return = t, g.sibling = a, t.child = g, r = t.child, r.memoizedState = zs(n), r.childLanes = _s(
        e,
        d,
        n
      ), t.memoizedState = Ns, a) : (wn(t), js(t, g));
    }
    if (x = e.memoizedState, x !== null && (g = x.dehydrated, g !== null)) {
      if (c)
        t.flags & 256 ? (wn(t), t.flags &= -257, t = Hs(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (Rn(), t.child = e.child, t.flags |= 128, t = null) : (Rn(), r = a.fallback, g = t.mode, a = Us(
          { mode: "visible", children: a.children },
          g
        ), r = vl(
          r,
          g,
          n,
          null
        ), r.flags |= 2, a.return = t, r.return = t, a.sibling = r, t.child = a, rl(
          t,
          e.child,
          null,
          n
        ), a = t.child, a.memoizedState = zs(n), a.childLanes = _s(
          e,
          d,
          n
        ), t.memoizedState = Ns, t = r);
      else if (wn(t), g.data === "$!") {
        if (d = g.nextSibling && g.nextSibling.dataset, d) var C = d.dgst;
        d = C, a = Error(s(419)), a.stack = "", a.digest = d, Za({ value: a, source: null, stack: null }), t = Hs(
          e,
          t,
          n
        );
      } else if (Je || li(e, t, n, !1), d = (n & e.childLanes) !== 0, Je || d) {
        if (d = De, d !== null) {
          if (a = n & -n, a & 42) a = 1;
          else
            switch (a) {
              case 2:
                a = 1;
                break;
              case 8:
                a = 4;
                break;
              case 32:
                a = 16;
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
                a = 64;
                break;
              case 268435456:
                a = 134217728;
                break;
              default:
                a = 0;
            }
          if (a = a & (d.suspendedLanes | n) ? 0 : a, a !== 0 && a !== x.retryLane)
            throw x.retryLane = a, Tn(e, a), it(d, e, a), uh;
        }
        g.data === "$?" || oc(), t = Hs(
          e,
          t,
          n
        );
      } else
        g.data === "$?" ? (t.flags |= 128, t.child = e.child, t = D0.bind(
          null,
          e
        ), g._reactRetry = t, t = null) : (e = x.treeContext, Pe = Ht(
          g.nextSibling
        ), at = t, Ae = !0, jt = null, kt = !1, e !== null && (wt[Rt++] = $t, wt[Rt++] = Pt, wt[Rt++] = ll, $t = e.id, Pt = e.overflow, ll = t), t = js(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return r ? (Rn(), r = a.fallback, g = t.mode, x = e.child, C = x.sibling, a = Hn(x, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = x.subtreeFlags & 31457280, C !== null ? r = Hn(C, r) : (r = vl(
      r,
      g,
      n,
      null
    ), r.flags |= 2), r.return = t, a.return = t, a.sibling = r, t.child = a, a = r, r = t.child, g = e.child.memoizedState, g === null ? g = zs(n) : (x = g.cachePool, x !== null ? (C = Ze._currentValue, x = x.parent !== C ? { parent: C, pool: C } : x) : x = gd(), g = {
      baseLanes: g.baseLanes | n,
      cachePool: x
    }), r.memoizedState = g, r.childLanes = _s(
      e,
      d,
      n
    ), t.memoizedState = Ns, a) : (wn(t), n = e.child, e = n.sibling, n = Hn(n, {
      mode: "visible",
      children: a.children
    }), n.return = t, n.sibling = null, e !== null && (d = t.deletions, d === null ? (t.deletions = [e], t.flags |= 16) : d.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function js(e, t) {
    return t = Us(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Us(e, t) {
    return Vh(e, t, 0, null);
  }
  function Hs(e, t, n) {
    return rl(t, e.child, null, n), e = js(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function gh(e, t, n) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), ks(e.return, t, n);
  }
  function Ls(e, t, n, a, r) {
    var c = e.memoizedState;
    c === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: n,
      tailMode: r
    } : (c.isBackwards = t, c.rendering = null, c.renderingStartTime = 0, c.last = a, c.tail = n, c.tailMode = r);
  }
  function yh(e, t, n) {
    var a = t.pendingProps, r = a.revealOrder, c = a.tail;
    if (Ie(e, t, a.children, n), a = Qe.current, a & 2)
      a = a & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && e.flags & 128)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13)
            e.memoizedState !== null && gh(e, n, t);
          else if (e.tag === 19)
            gh(e, n, t);
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
      a &= 1;
    }
    switch (Me(Qe, a), r) {
      case "forwards":
        for (n = t.child, r = null; n !== null; )
          e = n.alternate, e !== null && ur(e) === null && (r = n), n = n.sibling;
        n = r, n === null ? (r = t.child, t.child = null) : (r = n.sibling, n.sibling = null), Ls(
          t,
          !1,
          r,
          n,
          c
        );
        break;
      case "backwards":
        for (n = null, r = t.child, t.child = null; r !== null; ) {
          if (e = r.alternate, e !== null && ur(e) === null) {
            t.child = r;
            break;
          }
          e = r.sibling, r.sibling = n, n = r, r = e;
        }
        Ls(
          t,
          !0,
          n,
          null,
          c
        );
        break;
      case "together":
        Ls(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function tn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Ln |= t.lanes, !(n & t.childLanes))
      if (e !== null) {
        if (li(
          e,
          t,
          n,
          !1
        ), (n & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = Hn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = Hn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Bs(e, t) {
    return e.lanes & t ? !0 : (e = e.dependencies, !!(e !== null && br(e)));
  }
  function p0(e, t, n) {
    switch (t.tag) {
      case 3:
        Dl(t, t.stateNode.containerInfo), Cn(t, Ze, e.memoizedState.cache), Qa();
        break;
      case 27:
      case 5:
        Ca(t);
        break;
      case 4:
        Dl(t, t.stateNode.containerInfo);
        break;
      case 10:
        Cn(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (wn(t), t.flags |= 128, null) : n & t.child.childLanes ? ph(e, t, n) : (wn(t), e = tn(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        wn(t);
        break;
      case 19:
        var r = (e.flags & 128) !== 0;
        if (a = (n & t.childLanes) !== 0, a || (li(
          e,
          t,
          n,
          !1
        ), a = (n & t.childLanes) !== 0), r) {
          if (a)
            return yh(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (r = t.memoizedState, r !== null && (r.rendering = null, r.tail = null, r.lastEffect = null), Me(Qe, Qe.current), a) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, fh(e, t, n);
      case 24:
        Cn(t, Ze, e.memoizedState.cache);
    }
    return tn(e, t, n);
  }
  function bh(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Je = !0;
      else {
        if (!Bs(e, n) && !(t.flags & 128))
          return Je = !1, p0(
            e,
            t,
            n
          );
        Je = !!(e.flags & 131072);
      }
    else
      Je = !1, Ae && t.flags & 1048576 && ld(t, nr, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          e = t.pendingProps;
          var a = t.elementType, r = a._init;
          if (a = r(a._payload), t.type = a, typeof a == "function")
            Ps(a) ? (e = fl(a, e), t.tag = 1, t = mh(
              null,
              t,
              a,
              e,
              n
            )) : (t.tag = 0, t = Ds(
              null,
              t,
              a,
              e,
              n
            ));
          else {
            if (a != null) {
              if (r = a.$$typeof, r === w) {
                t.tag = 11, t = sh(
                  null,
                  t,
                  a,
                  e,
                  n
                );
                break e;
              } else if (r === _) {
                t.tag = 14, t = ch(
                  null,
                  t,
                  a,
                  e,
                  n
                );
                break e;
              }
            }
            throw t = W(a) || a, Error(s(306, t, ""));
          }
        }
        return t;
      case 0:
        return Ds(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return a = t.type, r = fl(
          a,
          t.pendingProps
        ), mh(
          e,
          t,
          a,
          r,
          n
        );
      case 3:
        e: {
          if (Dl(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(s(387));
          var c = t.pendingProps;
          r = t.memoizedState, a = r.element, Ys(e, t), ri(t, c, null, n);
          var d = t.memoizedState;
          if (c = d.cache, Cn(t, Ze, c), c !== r.cache && Gs(
            t,
            [Ze],
            n,
            !0
          ), ii(), c = d.element, r.isDehydrated)
            if (r = {
              element: c,
              isDehydrated: !1,
              cache: d.cache
            }, t.updateQueue.baseState = r, t.memoizedState = r, t.flags & 256) {
              t = vh(
                e,
                t,
                c,
                n
              );
              break e;
            } else if (c !== a) {
              a = Tt(
                Error(s(424)),
                t
              ), Za(a), t = vh(
                e,
                t,
                c,
                n
              );
              break e;
            } else
              for (Pe = Ht(
                t.stateNode.containerInfo.firstChild
              ), at = t, Ae = !0, jt = null, kt = !0, n = dd(
                t,
                null,
                c,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Qa(), c === a) {
              t = tn(
                e,
                t,
                n
              );
              break e;
            }
            Ie(e, t, c, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return ni(e, t), e === null ? (n = Em(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Ae || (n = t.type, e = t.pendingProps, a = Ur(
          rt.current
        ).createElement(n), a[tt] = t, a[ut] = e, et(a, n, e), Ke(a), t.stateNode = a) : t.memoizedState = Em(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Ca(t), e === null && Ae && (a = t.stateNode = bm(
          t.type,
          t.pendingProps,
          rt.current
        ), at = t, kt = !0, Pe = Ht(
          a.firstChild
        )), a = t.pendingProps.children, e !== null || Ae ? Ie(
          e,
          t,
          a,
          n
        ) : t.child = rl(
          t,
          null,
          a,
          n
        ), ni(e, t), t.child;
      case 5:
        return e === null && Ae && ((r = a = Pe) && (a = Z0(
          a,
          t.type,
          t.pendingProps,
          kt
        ), a !== null ? (t.stateNode = a, at = t, Pe = Ht(
          a.firstChild
        ), kt = !1, r = !0) : r = !1), r || il(t)), Ca(t), r = t.type, c = t.pendingProps, d = e !== null ? e.memoizedProps : null, a = c.children, Tc(r, c) ? a = null : d !== null && Tc(r, d) && (t.flags |= 32), t.memoizedState !== null && (r = ds(
          e,
          t,
          c0,
          null,
          null,
          n
        ), Si._currentValue = r), ni(e, t), Ie(e, t, a, n), t.child;
      case 6:
        return e === null && Ae && ((e = n = Pe) && (n = K0(
          n,
          t.pendingProps,
          kt
        ), n !== null ? (t.stateNode = n, at = t, Pe = null, e = !0) : e = !1), e || il(t)), null;
      case 13:
        return ph(e, t, n);
      case 4:
        return Dl(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = rl(
          t,
          null,
          a,
          n
        ) : Ie(
          e,
          t,
          a,
          n
        ), t.child;
      case 11:
        return sh(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return Ie(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return Ie(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return Ie(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return a = t.pendingProps, Cn(t, t.type, a.value), Ie(
          e,
          t,
          a.children,
          n
        ), t.child;
      case 9:
        return r = t.type._context, a = t.pendingProps.children, hl(t), r = nt(r), a = a(r), t.flags |= 1, Ie(e, t, a, n), t.child;
      case 14:
        return ch(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return oh(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return yh(e, t, n);
      case 22:
        return fh(e, t, n);
      case 24:
        return hl(t), a = nt(Ze), e === null ? (r = os(), r === null && (r = De, c = ss(), r.pooledCache = c, c.refCount++, c !== null && (r.pooledCacheLanes |= n), r = c), t.memoizedState = {
          parent: a,
          cache: r
        }, Vs(t), Cn(t, Ze, r)) : (e.lanes & n && (Ys(e, t), ri(t, null, null, n), ii()), r = e.memoizedState, c = t.memoizedState, r.parent !== a ? (r = { parent: a, cache: a }, t.memoizedState = r, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = r), Cn(t, Ze, a)) : (a = c.cache, Cn(t, Ze, a), a !== r.cache && Gs(
          t,
          [Ze],
          n,
          !0
        ))), Ie(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(s(156, t.tag));
  }
  var qs = Ee(null), dl = null, nn = null;
  function Cn(e, t, n) {
    Me(qs, t._currentValue), t._currentValue = n;
  }
  function ln(e) {
    e._currentValue = qs.current, je(qs);
  }
  function ks(e, t, n) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Gs(e, t, n, a) {
    var r = e.child;
    for (r !== null && (r.return = e); r !== null; ) {
      var c = r.dependencies;
      if (c !== null) {
        var d = r.child;
        c = c.firstContext;
        e: for (; c !== null; ) {
          var g = c;
          c = r;
          for (var x = 0; x < t.length; x++)
            if (g.context === t[x]) {
              c.lanes |= n, g = c.alternate, g !== null && (g.lanes |= n), ks(
                c.return,
                n,
                e
              ), a || (d = null);
              break e;
            }
          c = g.next;
        }
      } else if (r.tag === 18) {
        if (d = r.return, d === null) throw Error(s(341));
        d.lanes |= n, c = d.alternate, c !== null && (c.lanes |= n), ks(d, n, e), d = null;
      } else d = r.child;
      if (d !== null) d.return = r;
      else
        for (d = r; d !== null; ) {
          if (d === e) {
            d = null;
            break;
          }
          if (r = d.sibling, r !== null) {
            r.return = d.return, d = r;
            break;
          }
          d = d.return;
        }
      r = d;
    }
  }
  function li(e, t, n, a) {
    e = null;
    for (var r = t, c = !1; r !== null; ) {
      if (!c) {
        if (r.flags & 524288) c = !0;
        else if (r.flags & 262144) break;
      }
      if (r.tag === 10) {
        var d = r.alternate;
        if (d === null) throw Error(s(387));
        if (d = d.memoizedProps, d !== null) {
          var g = r.type;
          pt(r.pendingProps.value, d.value) || (e !== null ? e.push(g) : e = [g]);
        }
      } else if (r === Fn.current) {
        if (d = r.alternate, d === null) throw Error(s(387));
        d.memoizedState.memoizedState !== r.memoizedState.memoizedState && (e !== null ? e.push(Si) : e = [Si]);
      }
      r = r.return;
    }
    e !== null && Gs(
      t,
      e,
      n,
      a
    ), t.flags |= 262144;
  }
  function br(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!pt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function hl(e) {
    dl = e, nn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function nt(e) {
    return xh(dl, e);
  }
  function xr(e, t) {
    return dl === null && hl(e), xh(e, t);
  }
  function xh(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, nn === null) {
      if (e === null) throw Error(s(308));
      nn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else nn = nn.next = t;
    return n;
  }
  var Dn = !1;
  function Vs(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Ys(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Nn(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function zn(e, t, n) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, He & 2) {
      var r = a.pending;
      return r === null ? t.next = t : (t.next = r.next, r.next = t), a.pending = t, t = er(e), td(e, null, n), t;
    }
    return Ii(e, a, t, n), er(e);
  }
  function ai(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194176) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, n |= a, t.lanes = n, cf(e, n);
    }
  }
  function Xs(e, t) {
    var n = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, n === a)) {
      var r = null, c = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var d = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          c === null ? r = c = d : c = c.next = d, n = n.next;
        } while (n !== null);
        c === null ? r = c = t : c = c.next = t;
      } else r = c = t;
      n = {
        baseState: a.baseState,
        firstBaseUpdate: r,
        lastBaseUpdate: c,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var Qs = !1;
  function ii() {
    if (Qs) {
      var e = Fl;
      if (e !== null) throw e;
    }
  }
  function ri(e, t, n, a) {
    Qs = !1;
    var r = e.updateQueue;
    Dn = !1;
    var c = r.firstBaseUpdate, d = r.lastBaseUpdate, g = r.shared.pending;
    if (g !== null) {
      r.shared.pending = null;
      var x = g, C = x.next;
      x.next = null, d === null ? c = C : d.next = C, d = x;
      var q = e.alternate;
      q !== null && (q = q.updateQueue, g = q.lastBaseUpdate, g !== d && (g === null ? q.firstBaseUpdate = C : g.next = C, q.lastBaseUpdate = x));
    }
    if (c !== null) {
      var V = r.baseState;
      d = 0, q = C = x = null, g = c;
      do {
        var j = g.lane & -536870913, L = j !== g.lane;
        if (L ? (Se & j) === j : (a & j) === j) {
          j !== 0 && j === Wl && (Qs = !0), q !== null && (q = q.next = {
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: null,
            next: null
          });
          e: {
            var ne = e, ce = g;
            j = t;
            var qe = n;
            switch (ce.tag) {
              case 1:
                if (ne = ce.payload, typeof ne == "function") {
                  V = ne.call(qe, V, j);
                  break e;
                }
                V = ne;
                break e;
              case 3:
                ne.flags = ne.flags & -65537 | 128;
              case 0:
                if (ne = ce.payload, j = typeof ne == "function" ? ne.call(qe, V, j) : ne, j == null) break e;
                V = F({}, V, j);
                break e;
              case 2:
                Dn = !0;
            }
          }
          j = g.callback, j !== null && (e.flags |= 64, L && (e.flags |= 8192), L = r.callbacks, L === null ? r.callbacks = [j] : L.push(j));
        } else
          L = {
            lane: j,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          }, q === null ? (C = q = L, x = V) : q = q.next = L, d |= j;
        if (g = g.next, g === null) {
          if (g = r.shared.pending, g === null)
            break;
          L = g, g = L.next, L.next = null, r.lastBaseUpdate = L, r.shared.pending = null;
        }
      } while (!0);
      q === null && (x = V), r.baseState = x, r.firstBaseUpdate = C, r.lastBaseUpdate = q, c === null && (r.shared.lanes = 0), Ln |= d, e.lanes = d, e.memoizedState = V;
    }
  }
  function Sh(e, t) {
    if (typeof e != "function")
      throw Error(s(191, e));
    e.call(t);
  }
  function Eh(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        Sh(n[e], t);
  }
  function ui(e, t) {
    try {
      var n = t.updateQueue, a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var r = a.next;
        n = r;
        do {
          if ((n.tag & e) === e) {
            a = void 0;
            var c = n.create, d = n.inst;
            a = c(), d.destroy = a;
          }
          n = n.next;
        } while (n !== r);
      }
    } catch (g) {
      Ce(t, t.return, g);
    }
  }
  function _n(e, t, n) {
    try {
      var a = t.updateQueue, r = a !== null ? a.lastEffect : null;
      if (r !== null) {
        var c = r.next;
        a = c;
        do {
          if ((a.tag & e) === e) {
            var d = a.inst, g = d.destroy;
            if (g !== void 0) {
              d.destroy = void 0, r = t;
              var x = n;
              try {
                g();
              } catch (C) {
                Ce(
                  r,
                  x,
                  C
                );
              }
            }
          }
          a = a.next;
        } while (a !== c);
      }
    } catch (C) {
      Ce(t, t.return, C);
    }
  }
  function Ah(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Eh(t, n);
      } catch (a) {
        Ce(e, e.return, a);
      }
    }
  }
  function Th(e, t, n) {
    n.props = fl(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (a) {
      Ce(e, t, a);
    }
  }
  function ml(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        var a = e.stateNode;
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var r = a;
            break;
          default:
            r = a;
        }
        typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
      }
    } catch (c) {
      Ce(e, t, c);
    }
  }
  function gt(e, t) {
    var n = e.ref, a = e.refCleanup;
    if (n !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (r) {
          Ce(e, t, r);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (r) {
          Ce(e, t, r);
        }
      else n.current = null;
  }
  function wh(e) {
    var t = e.type, n = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && a.focus();
          break e;
        case "img":
          n.src ? a.src = n.src : n.srcSet && (a.srcset = n.srcSet);
      }
    } catch (r) {
      Ce(e, e.return, r);
    }
  }
  function Rh(e, t, n) {
    try {
      var a = e.stateNode;
      G0(a, e.type, n, t), a[ut] = t;
    } catch (r) {
      Ce(e, e.return, r);
    }
  }
  function Oh(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 || e.tag === 4;
  }
  function Zs(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Oh(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 27 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Ks(e, t, n) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = jr));
    else if (a !== 4 && a !== 27 && (e = e.child, e !== null))
      for (Ks(e, t, n), e = e.sibling; e !== null; )
        Ks(e, t, n), e = e.sibling;
  }
  function Sr(e, t, n) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (a !== 4 && a !== 27 && (e = e.child, e !== null))
      for (Sr(e, t, n), e = e.sibling; e !== null; )
        Sr(e, t, n), e = e.sibling;
  }
  var an = !1, Le = !1, Js = !1, Mh = typeof WeakSet == "function" ? WeakSet : Set, We = null, Ch = !1;
  function g0(e, t) {
    if (e = e.containerInfo, Ec = Gr, e = Zf(e), Fu(e)) {
      if ("selectionStart" in e)
        var n = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          n = (n = e.ownerDocument) && n.defaultView || window;
          var a = n.getSelection && n.getSelection();
          if (a && a.rangeCount !== 0) {
            n = a.anchorNode;
            var r = a.anchorOffset, c = a.focusNode;
            a = a.focusOffset;
            try {
              n.nodeType, c.nodeType;
            } catch {
              n = null;
              break e;
            }
            var d = 0, g = -1, x = -1, C = 0, q = 0, V = e, j = null;
            t: for (; ; ) {
              for (var L; V !== n || r !== 0 && V.nodeType !== 3 || (g = d + r), V !== c || a !== 0 && V.nodeType !== 3 || (x = d + a), V.nodeType === 3 && (d += V.nodeValue.length), (L = V.firstChild) !== null; )
                j = V, V = L;
              for (; ; ) {
                if (V === e) break t;
                if (j === n && ++C === r && (g = d), j === c && ++q === a && (x = d), (L = V.nextSibling) !== null) break;
                V = j, j = V.parentNode;
              }
              V = L;
            }
            n = g === -1 || x === -1 ? null : { start: g, end: x };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Ac = { focusedElem: e, selectionRange: n }, Gr = !1, We = t; We !== null; )
      if (t = We, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, We = e;
      else
        for (; We !== null; ) {
          switch (t = We, c = t.alternate, e = t.flags, t.tag) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if (e & 1024 && c !== null) {
                e = void 0, n = t, r = c.memoizedProps, c = c.memoizedState, a = n.stateNode;
                try {
                  var ne = fl(
                    n.type,
                    r,
                    n.elementType === n.type
                  );
                  e = a.getSnapshotBeforeUpdate(
                    ne,
                    c
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ce) {
                  Ce(
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
                  Oc(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Oc(e);
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
              if (e & 1024) throw Error(s(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, We = e;
            break;
          }
          We = t.return;
        }
    return ne = Ch, Ch = !1, ne;
  }
  function Dh(e, t, n) {
    var a = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        un(e, n), a & 4 && ui(5, n);
        break;
      case 1:
        if (un(e, n), a & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (g) {
              Ce(n, n.return, g);
            }
          else {
            var r = fl(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                r,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (g) {
              Ce(
                n,
                n.return,
                g
              );
            }
          }
        a & 64 && Ah(n), a & 512 && ml(n, n.return);
        break;
      case 3:
        if (un(e, n), a & 64 && (a = n.updateQueue, a !== null)) {
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
            Eh(a, e);
          } catch (g) {
            Ce(n, n.return, g);
          }
        }
        break;
      case 26:
        un(e, n), a & 512 && ml(n, n.return);
        break;
      case 27:
      case 5:
        un(e, n), t === null && a & 4 && wh(n), a & 512 && ml(n, n.return);
        break;
      case 12:
        un(e, n);
        break;
      case 13:
        un(e, n), a & 4 && _h(e, n);
        break;
      case 22:
        if (r = n.memoizedState !== null || an, !r) {
          t = t !== null && t.memoizedState !== null || Le;
          var c = an, d = Le;
          an = r, (Le = t) && !d ? jn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : un(e, n), an = c, Le = d;
        }
        a & 512 && (n.memoizedProps.mode === "manual" ? ml(n, n.return) : gt(n, n.return));
        break;
      default:
        un(e, n);
    }
  }
  function Nh(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Nh(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && ju(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Xe = null, yt = !1;
  function rn(e, t, n) {
    for (n = n.child; n !== null; )
      zh(e, t, n), n = n.sibling;
  }
  function zh(e, t, n) {
    if (mt && typeof mt.onCommitFiberUnmount == "function")
      try {
        mt.onCommitFiberUnmount(Da, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Le || gt(n, t), rn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Le || gt(n, t);
        var a = Xe, r = yt;
        for (Xe = n.stateNode, rn(
          e,
          t,
          n
        ), n = n.stateNode, t = n.attributes; t.length; )
          n.removeAttributeNode(t[0]);
        ju(n), Xe = a, yt = r;
        break;
      case 5:
        Le || gt(n, t);
      case 6:
        r = Xe;
        var c = yt;
        if (Xe = null, rn(
          e,
          t,
          n
        ), Xe = r, yt = c, Xe !== null)
          if (yt)
            try {
              e = Xe, a = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(a) : e.removeChild(a);
            } catch (d) {
              Ce(
                n,
                t,
                d
              );
            }
          else
            try {
              Xe.removeChild(n.stateNode);
            } catch (d) {
              Ce(
                n,
                t,
                d
              );
            }
        break;
      case 18:
        Xe !== null && (yt ? (t = Xe, n = n.stateNode, t.nodeType === 8 ? Rc(
          t.parentNode,
          n
        ) : t.nodeType === 1 && Rc(t, n), wi(t)) : Rc(Xe, n.stateNode));
        break;
      case 4:
        a = Xe, r = yt, Xe = n.stateNode.containerInfo, yt = !0, rn(
          e,
          t,
          n
        ), Xe = a, yt = r;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Le || _n(2, n, t), Le || _n(4, n, t), rn(
          e,
          t,
          n
        );
        break;
      case 1:
        Le || (gt(n, t), a = n.stateNode, typeof a.componentWillUnmount == "function" && Th(
          n,
          t,
          a
        )), rn(
          e,
          t,
          n
        );
        break;
      case 21:
        rn(
          e,
          t,
          n
        );
        break;
      case 22:
        Le || gt(n, t), Le = (a = Le) || n.memoizedState !== null, rn(
          e,
          t,
          n
        ), Le = a;
        break;
      default:
        rn(
          e,
          t,
          n
        );
    }
  }
  function _h(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        wi(e);
      } catch (n) {
        Ce(t, t.return, n);
      }
  }
  function y0(e) {
    switch (e.tag) {
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Mh()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Mh()), t;
      default:
        throw Error(s(435, e.tag));
    }
  }
  function Ws(e, t) {
    var n = y0(e);
    t.forEach(function(a) {
      var r = N0.bind(null, e, a);
      n.has(a) || (n.add(a), a.then(r, r));
    });
  }
  function Mt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var r = n[a], c = e, d = t, g = d;
        e: for (; g !== null; ) {
          switch (g.tag) {
            case 27:
            case 5:
              Xe = g.stateNode, yt = !1;
              break e;
            case 3:
              Xe = g.stateNode.containerInfo, yt = !0;
              break e;
            case 4:
              Xe = g.stateNode.containerInfo, yt = !0;
              break e;
          }
          g = g.return;
        }
        if (Xe === null) throw Error(s(160));
        zh(c, d, r), Xe = null, yt = !1, c = r.alternate, c !== null && (c.return = null), r.return = null;
      }
    if (t.subtreeFlags & 13878)
      for (t = t.child; t !== null; )
        jh(t, e), t = t.sibling;
  }
  var Ut = null;
  function jh(e, t) {
    var n = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Mt(t, e), Ct(e), a & 4 && (_n(3, e, e.return), ui(3, e), _n(5, e, e.return));
        break;
      case 1:
        Mt(t, e), Ct(e), a & 512 && (Le || n === null || gt(n, n.return)), a & 64 && an && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? a : n.concat(a))));
        break;
      case 26:
        var r = Ut;
        if (Mt(t, e), Ct(e), a & 512 && (Le || n === null || gt(n, n.return)), a & 4) {
          var c = n !== null ? n.memoizedState : null;
          if (a = e.memoizedState, n === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, n = e.memoizedProps, r = r.ownerDocument || r;
                  t: switch (a) {
                    case "title":
                      c = r.getElementsByTagName("title")[0], (!c || c[_a] || c[tt] || c.namespaceURI === "http://www.w3.org/2000/svg" || c.hasAttribute("itemprop")) && (c = r.createElement(a), r.head.insertBefore(
                        c,
                        r.querySelector("head > title")
                      )), et(c, a, n), c[tt] = e, Ke(c), a = c;
                      break e;
                    case "link":
                      var d = wm(
                        "link",
                        "href",
                        r
                      ).get(a + (n.href || ""));
                      if (d) {
                        for (var g = 0; g < d.length; g++)
                          if (c = d[g], c.getAttribute("href") === (n.href == null ? null : n.href) && c.getAttribute("rel") === (n.rel == null ? null : n.rel) && c.getAttribute("title") === (n.title == null ? null : n.title) && c.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            d.splice(g, 1);
                            break t;
                          }
                      }
                      c = r.createElement(a), et(c, a, n), r.head.appendChild(c);
                      break;
                    case "meta":
                      if (d = wm(
                        "meta",
                        "content",
                        r
                      ).get(a + (n.content || ""))) {
                        for (g = 0; g < d.length; g++)
                          if (c = d[g], c.getAttribute("content") === (n.content == null ? null : "" + n.content) && c.getAttribute("name") === (n.name == null ? null : n.name) && c.getAttribute("property") === (n.property == null ? null : n.property) && c.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && c.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            d.splice(g, 1);
                            break t;
                          }
                      }
                      c = r.createElement(a), et(c, a, n), r.head.appendChild(c);
                      break;
                    default:
                      throw Error(s(468, a));
                  }
                  c[tt] = e, Ke(c), a = c;
                }
                e.stateNode = a;
              } else
                Rm(
                  r,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Tm(
                r,
                a,
                e.memoizedProps
              );
          else
            c !== a ? (c === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : c.count--, a === null ? Rm(
              r,
              e.type,
              e.stateNode
            ) : Tm(
              r,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && Rh(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        if (a & 4 && e.alternate === null) {
          r = e.stateNode, c = e.memoizedProps;
          try {
            for (var x = r.firstChild; x; ) {
              var C = x.nextSibling, q = x.nodeName;
              x[_a] || q === "HEAD" || q === "BODY" || q === "SCRIPT" || q === "STYLE" || q === "LINK" && x.rel.toLowerCase() === "stylesheet" || r.removeChild(x), x = C;
            }
            for (var V = e.type, j = r.attributes; j.length; )
              r.removeAttributeNode(j[0]);
            et(r, V, c), r[tt] = e, r[ut] = c;
          } catch (ne) {
            Ce(e, e.return, ne);
          }
        }
      case 5:
        if (Mt(t, e), Ct(e), a & 512 && (Le || n === null || gt(n, n.return)), e.flags & 32) {
          r = e.stateNode;
          try {
            Ll(r, "");
          } catch (ne) {
            Ce(e, e.return, ne);
          }
        }
        a & 4 && e.stateNode != null && (r = e.memoizedProps, Rh(
          e,
          r,
          n !== null ? n.memoizedProps : r
        )), a & 1024 && (Js = !0);
        break;
      case 6:
        if (Mt(t, e), Ct(e), a & 4) {
          if (e.stateNode === null)
            throw Error(s(162));
          a = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = a;
          } catch (ne) {
            Ce(e, e.return, ne);
          }
        }
        break;
      case 3:
        if (Br = null, r = Ut, Ut = Hr(t.containerInfo), Mt(t, e), Ut = r, Ct(e), a & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            wi(t.containerInfo);
          } catch (ne) {
            Ce(e, e.return, ne);
          }
        Js && (Js = !1, Uh(e));
        break;
      case 4:
        a = Ut, Ut = Hr(
          e.stateNode.containerInfo
        ), Mt(t, e), Ct(e), Ut = a;
        break;
      case 12:
        Mt(t, e), Ct(e);
        break;
      case 13:
        Mt(t, e), Ct(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (ac = qt()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Ws(e, a)));
        break;
      case 22:
        if (a & 512 && (Le || n === null || gt(n, n.return)), x = e.memoizedState !== null, C = n !== null && n.memoizedState !== null, q = an, V = Le, an = q || x, Le = V || C, Mt(t, e), Le = V, an = q, Ct(e), t = e.stateNode, t._current = e, t._visibility &= -3, t._visibility |= t._pendingVisibility & 2, a & 8192 && (t._visibility = x ? t._visibility & -2 : t._visibility | 1, x && (t = an || Le, n === null || C || t || ea(e)), e.memoizedProps === null || e.memoizedProps.mode !== "manual"))
          e: for (n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26 || t.tag === 27) {
              if (n === null) {
                C = n = t;
                try {
                  if (r = C.stateNode, x)
                    c = r.style, typeof c.setProperty == "function" ? c.setProperty(
                      "display",
                      "none",
                      "important"
                    ) : c.display = "none";
                  else {
                    d = C.stateNode, g = C.memoizedProps.style;
                    var L = g != null && g.hasOwnProperty("display") ? g.display : null;
                    d.style.display = L == null || typeof L == "boolean" ? "" : ("" + L).trim();
                  }
                } catch (ne) {
                  Ce(C, C.return, ne);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                C = t;
                try {
                  C.stateNode.nodeValue = x ? "" : C.memoizedProps;
                } catch (ne) {
                  Ce(C, C.return, ne);
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
        a & 4 && (a = e.updateQueue, a !== null && (n = a.retryQueue, n !== null && (a.retryQueue = null, Ws(e, n))));
        break;
      case 19:
        Mt(t, e), Ct(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Ws(e, a)));
        break;
      case 21:
        break;
      default:
        Mt(t, e), Ct(e);
    }
  }
  function Ct(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        if (e.tag !== 27) {
          e: {
            for (var n = e.return; n !== null; ) {
              if (Oh(n)) {
                var a = n;
                break e;
              }
              n = n.return;
            }
            throw Error(s(160));
          }
          switch (a.tag) {
            case 27:
              var r = a.stateNode, c = Zs(e);
              Sr(e, c, r);
              break;
            case 5:
              var d = a.stateNode;
              a.flags & 32 && (Ll(d, ""), a.flags &= -33);
              var g = Zs(e);
              Sr(e, g, d);
              break;
            case 3:
            case 4:
              var x = a.stateNode.containerInfo, C = Zs(e);
              Ks(
                e,
                C,
                x
              );
              break;
            default:
              throw Error(s(161));
          }
        }
      } catch (q) {
        Ce(e, e.return, q);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Uh(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Uh(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function un(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Dh(e, t.alternate, t), t = t.sibling;
  }
  function ea(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          _n(4, t, t.return), ea(t);
          break;
        case 1:
          gt(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && Th(
            t,
            t.return,
            n
          ), ea(t);
          break;
        case 26:
        case 27:
        case 5:
          gt(t, t.return), ea(t);
          break;
        case 22:
          gt(t, t.return), t.memoizedState === null && ea(t);
          break;
        default:
          ea(t);
      }
      e = e.sibling;
    }
  }
  function jn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, r = e, c = t, d = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          jn(
            r,
            c,
            n
          ), ui(4, c);
          break;
        case 1:
          if (jn(
            r,
            c,
            n
          ), a = c, r = a.stateNode, typeof r.componentDidMount == "function")
            try {
              r.componentDidMount();
            } catch (C) {
              Ce(a, a.return, C);
            }
          if (a = c, r = a.updateQueue, r !== null) {
            var g = a.stateNode;
            try {
              var x = r.shared.hiddenCallbacks;
              if (x !== null)
                for (r.shared.hiddenCallbacks = null, r = 0; r < x.length; r++)
                  Sh(x[r], g);
            } catch (C) {
              Ce(a, a.return, C);
            }
          }
          n && d & 64 && Ah(c), ml(c, c.return);
          break;
        case 26:
        case 27:
        case 5:
          jn(
            r,
            c,
            n
          ), n && a === null && d & 4 && wh(c), ml(c, c.return);
          break;
        case 12:
          jn(
            r,
            c,
            n
          );
          break;
        case 13:
          jn(
            r,
            c,
            n
          ), n && d & 4 && _h(r, c);
          break;
        case 22:
          c.memoizedState === null && jn(
            r,
            c,
            n
          ), ml(c, c.return);
          break;
        default:
          jn(
            r,
            c,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Fs(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && $a(n));
  }
  function $s(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && $a(e));
  }
  function Un(e, t, n, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Hh(
          e,
          t,
          n,
          a
        ), t = t.sibling;
  }
  function Hh(e, t, n, a) {
    var r = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Un(
          e,
          t,
          n,
          a
        ), r & 2048 && ui(9, t);
        break;
      case 3:
        Un(
          e,
          t,
          n,
          a
        ), r & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && $a(e)));
        break;
      case 12:
        if (r & 2048) {
          Un(
            e,
            t,
            n,
            a
          ), e = t.stateNode;
          try {
            var c = t.memoizedProps, d = c.id, g = c.onPostCommit;
            typeof g == "function" && g(
              d,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (x) {
            Ce(t, t.return, x);
          }
        } else
          Un(
            e,
            t,
            n,
            a
          );
        break;
      case 23:
        break;
      case 22:
        c = t.stateNode, t.memoizedState !== null ? c._visibility & 4 ? Un(
          e,
          t,
          n,
          a
        ) : si(e, t) : c._visibility & 4 ? Un(
          e,
          t,
          n,
          a
        ) : (c._visibility |= 4, ta(
          e,
          t,
          n,
          a,
          (t.subtreeFlags & 10256) !== 0
        )), r & 2048 && Fs(
          t.alternate,
          t
        );
        break;
      case 24:
        Un(
          e,
          t,
          n,
          a
        ), r & 2048 && $s(t.alternate, t);
        break;
      default:
        Un(
          e,
          t,
          n,
          a
        );
    }
  }
  function ta(e, t, n, a, r) {
    for (r = r && (t.subtreeFlags & 10256) !== 0, t = t.child; t !== null; ) {
      var c = e, d = t, g = n, x = a, C = d.flags;
      switch (d.tag) {
        case 0:
        case 11:
        case 15:
          ta(
            c,
            d,
            g,
            x,
            r
          ), ui(8, d);
          break;
        case 23:
          break;
        case 22:
          var q = d.stateNode;
          d.memoizedState !== null ? q._visibility & 4 ? ta(
            c,
            d,
            g,
            x,
            r
          ) : si(
            c,
            d
          ) : (q._visibility |= 4, ta(
            c,
            d,
            g,
            x,
            r
          )), r && C & 2048 && Fs(
            d.alternate,
            d
          );
          break;
        case 24:
          ta(
            c,
            d,
            g,
            x,
            r
          ), r && C & 2048 && $s(d.alternate, d);
          break;
        default:
          ta(
            c,
            d,
            g,
            x,
            r
          );
      }
      t = t.sibling;
    }
  }
  function si(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, a = t, r = a.flags;
        switch (a.tag) {
          case 22:
            si(n, a), r & 2048 && Fs(
              a.alternate,
              a
            );
            break;
          case 24:
            si(n, a), r & 2048 && $s(a.alternate, a);
            break;
          default:
            si(n, a);
        }
        t = t.sibling;
      }
  }
  var ci = 8192;
  function na(e) {
    if (e.subtreeFlags & ci)
      for (e = e.child; e !== null; )
        Lh(e), e = e.sibling;
  }
  function Lh(e) {
    switch (e.tag) {
      case 26:
        na(e), e.flags & ci && e.memoizedState !== null && rb(
          Ut,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        na(e);
        break;
      case 3:
      case 4:
        var t = Ut;
        Ut = Hr(e.stateNode.containerInfo), na(e), Ut = t;
        break;
      case 22:
        e.memoizedState === null && (t = e.alternate, t !== null && t.memoizedState !== null ? (t = ci, ci = 16777216, na(e), ci = t) : na(e));
        break;
      default:
        na(e);
    }
  }
  function Bh(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function oi(e) {
    var t = e.deletions;
    if (e.flags & 16) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var a = t[n];
          We = a, kh(
            a,
            e
          );
        }
      Bh(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        qh(e), e = e.sibling;
  }
  function qh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        oi(e), e.flags & 2048 && _n(9, e, e.return);
        break;
      case 3:
        oi(e);
        break;
      case 12:
        oi(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 4 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -5, Er(e)) : oi(e);
        break;
      default:
        oi(e);
    }
  }
  function Er(e) {
    var t = e.deletions;
    if (e.flags & 16) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var a = t[n];
          We = a, kh(
            a,
            e
          );
        }
      Bh(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          _n(8, t, t.return), Er(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 4 && (n._visibility &= -5, Er(t));
          break;
        default:
          Er(t);
      }
      e = e.sibling;
    }
  }
  function kh(e, t) {
    for (; We !== null; ) {
      var n = We;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          _n(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var a = n.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          $a(n.memoizedState.cache);
      }
      if (a = n.child, a !== null) a.return = n, We = a;
      else
        e: for (n = e; We !== null; ) {
          a = We;
          var r = a.sibling, c = a.return;
          if (Nh(a), a === n) {
            We = null;
            break e;
          }
          if (r !== null) {
            r.return = c, We = r;
            break e;
          }
          We = c;
        }
    }
  }
  function b0(e, t, n, a) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Dt(e, t, n, a) {
    return new b0(e, t, n, a);
  }
  function Ps(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Hn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Dt(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 31457280, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function Gh(e, t) {
    e.flags &= 31457282;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ar(e, t, n, a, r, c) {
    var d = 0;
    if (a = e, typeof e == "function") Ps(e) && (d = 1);
    else if (typeof e == "string")
      d = ab(
        e,
        n,
        ht.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case v:
          return vl(n.children, r, c, t);
        case p:
          d = 8, r |= 24;
          break;
        case b:
          return e = Dt(12, n, t, r | 2), e.elementType = b, e.lanes = c, e;
        case T:
          return e = Dt(13, n, t, r), e.elementType = T, e.lanes = c, e;
        case z:
          return e = Dt(19, n, t, r), e.elementType = z, e.lanes = c, e;
        case Y:
          return Vh(n, r, c, t);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case E:
              case O:
                d = 10;
                break e;
              case R:
                d = 9;
                break e;
              case w:
                d = 11;
                break e;
              case _:
                d = 14;
                break e;
              case B:
                d = 16, a = null;
                break e;
            }
          d = 29, n = Error(
            s(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = Dt(d, n, t, r), t.elementType = e, t.type = a, t.lanes = c, t;
  }
  function vl(e, t, n, a) {
    return e = Dt(7, e, a, t), e.lanes = n, e;
  }
  function Vh(e, t, n, a) {
    e = Dt(22, e, a, t), e.elementType = Y, e.lanes = n;
    var r = {
      _visibility: 1,
      _pendingVisibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null,
      _current: null,
      detach: function() {
        var c = r._current;
        if (c === null) throw Error(s(456));
        if (!(r._pendingVisibility & 2)) {
          var d = Tn(c, 2);
          d !== null && (r._pendingVisibility |= 2, it(d, c, 2));
        }
      },
      attach: function() {
        var c = r._current;
        if (c === null) throw Error(s(456));
        if (r._pendingVisibility & 2) {
          var d = Tn(c, 2);
          d !== null && (r._pendingVisibility &= -3, it(d, c, 2));
        }
      }
    };
    return e.stateNode = r, e;
  }
  function Is(e, t, n) {
    return e = Dt(6, e, null, t), e.lanes = n, e;
  }
  function ec(e, t, n) {
    return t = Dt(
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
  function sn(e) {
    e.flags |= 4;
  }
  function Yh(e, t) {
    if (t.type !== "stylesheet" || t.state.loading & 4)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Om(t)) {
      if (t = Ot.current, t !== null && ((Se & 4194176) === Se ? Gt !== null : (Se & 62914560) !== Se && !(Se & 536870912) || t !== Gt))
        throw Ja = is, rd;
      e.flags |= 8192;
    }
  }
  function Tr(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? uf() : 536870912, e.lanes |= t, aa |= t);
  }
  function fi(e, t) {
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
          for (var a = null; n !== null; )
            n.alternate !== null && (a = n), n = n.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
      }
  }
  function Ue(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, a = 0;
    if (t)
      for (var r = e.child; r !== null; )
        n |= r.lanes | r.childLanes, a |= r.subtreeFlags & 31457280, a |= r.flags & 31457280, r.return = e, r = r.sibling;
    else
      for (r = e.child; r !== null; )
        n |= r.lanes | r.childLanes, a |= r.subtreeFlags, a |= r.flags, r.return = e, r = r.sibling;
    return e.subtreeFlags |= a, e.childLanes = n, t;
  }
  function x0(e, t, n) {
    var a = t.pendingProps;
    switch (ls(t), t.tag) {
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
        return n = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), ln(Ze), bn(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Xa(t) ? sn(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, jt !== null && (sc(jt), jt = null))), Ue(t), null;
      case 26:
        return n = t.memoizedState, e === null ? (sn(t), n !== null ? (Ue(t), Yh(t, n)) : (Ue(t), t.flags &= -16777217)) : n ? n !== e.memoizedState ? (sn(t), Ue(t), Yh(t, n)) : (Ue(t), t.flags &= -16777217) : (e.memoizedProps !== a && sn(t), Ue(t), t.flags &= -16777217), null;
      case 27:
        Nl(t), n = rt.current;
        var r = t.type;
        if (e !== null && t.stateNode != null)
          e.memoizedProps !== a && sn(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Ue(t), null;
          }
          e = ht.current, Xa(t) ? ad(t) : (e = bm(r, a, n), t.stateNode = e, sn(t));
        }
        return Ue(t), null;
      case 5:
        if (Nl(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && sn(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Ue(t), null;
          }
          if (e = ht.current, Xa(t))
            ad(t);
          else {
            switch (r = Ur(
              rt.current
            ), e) {
              case 1:
                e = r.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                e = r.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    e = r.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    e = r.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    e = r.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild);
                    break;
                  case "select":
                    e = typeof a.is == "string" ? r.createElement("select", { is: a.is }) : r.createElement("select"), a.multiple ? e.multiple = !0 : a.size && (e.size = a.size);
                    break;
                  default:
                    e = typeof a.is == "string" ? r.createElement(n, { is: a.is }) : r.createElement(n);
                }
            }
            e[tt] = t, e[ut] = a;
            e: for (r = t.child; r !== null; ) {
              if (r.tag === 5 || r.tag === 6)
                e.appendChild(r.stateNode);
              else if (r.tag !== 4 && r.tag !== 27 && r.child !== null) {
                r.child.return = r, r = r.child;
                continue;
              }
              if (r === t) break e;
              for (; r.sibling === null; ) {
                if (r.return === null || r.return === t)
                  break e;
                r = r.return;
              }
              r.sibling.return = r.return, r = r.sibling;
            }
            t.stateNode = e;
            e: switch (et(e, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                e = !!a.autoFocus;
                break e;
              case "img":
                e = !0;
                break e;
              default:
                e = !1;
            }
            e && sn(t);
          }
        }
        return Ue(t), t.flags &= -16777217, null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && sn(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(s(166));
          if (e = rt.current, Xa(t)) {
            if (e = t.stateNode, n = t.memoizedProps, a = null, r = at, r !== null)
              switch (r.tag) {
                case 27:
                case 5:
                  a = r.memoizedProps;
              }
            e[tt] = t, e = !!(e.nodeValue === n || a !== null && a.suppressHydrationWarning === !0 || hm(e.nodeValue, n)), e || il(t);
          } else
            e = Ur(e).createTextNode(
              a
            ), e[tt] = t, t.stateNode = e;
        }
        return Ue(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (r = Xa(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!r) throw Error(s(318));
              if (r = t.memoizedState, r = r !== null ? r.dehydrated : null, !r) throw Error(s(317));
              r[tt] = t;
            } else
              Qa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
            Ue(t), r = !1;
          } else
            jt !== null && (sc(jt), jt = null), r = !0;
          if (!r)
            return t.flags & 256 ? (It(t), t) : (It(t), null);
        }
        if (It(t), t.flags & 128)
          return t.lanes = n, t;
        if (n = a !== null, e = e !== null && e.memoizedState !== null, n) {
          a = t.child, r = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (r = a.alternate.memoizedState.cachePool.pool);
          var c = null;
          a.memoizedState !== null && a.memoizedState.cachePool !== null && (c = a.memoizedState.cachePool.pool), c !== r && (a.flags |= 2048);
        }
        return n !== e && n && (t.child.flags |= 8192), Tr(t, t.updateQueue), Ue(t), null;
      case 4:
        return bn(), e === null && bc(t.stateNode.containerInfo), Ue(t), null;
      case 10:
        return ln(t.type), Ue(t), null;
      case 19:
        if (je(Qe), r = t.memoizedState, r === null) return Ue(t), null;
        if (a = (t.flags & 128) !== 0, c = r.rendering, c === null)
          if (a) fi(r, !1);
          else {
            if (Be !== 0 || e !== null && e.flags & 128)
              for (e = t.child; e !== null; ) {
                if (c = ur(e), c !== null) {
                  for (t.flags |= 128, fi(r, !1), e = c.updateQueue, t.updateQueue = e, Tr(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    Gh(n, e), n = n.sibling;
                  return Me(
                    Qe,
                    Qe.current & 1 | 2
                  ), t.child;
                }
                e = e.sibling;
              }
            r.tail !== null && qt() > wr && (t.flags |= 128, a = !0, fi(r, !1), t.lanes = 4194304);
          }
        else {
          if (!a)
            if (e = ur(c), e !== null) {
              if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Tr(t, e), fi(r, !0), r.tail === null && r.tailMode === "hidden" && !c.alternate && !Ae)
                return Ue(t), null;
            } else
              2 * qt() - r.renderingStartTime > wr && n !== 536870912 && (t.flags |= 128, a = !0, fi(r, !1), t.lanes = 4194304);
          r.isBackwards ? (c.sibling = t.child, t.child = c) : (e = r.last, e !== null ? e.sibling = c : t.child = c, r.last = c);
        }
        return r.tail !== null ? (t = r.tail, r.rendering = t, r.tail = t.sibling, r.renderingStartTime = qt(), t.sibling = null, e = Qe.current, Me(Qe, a ? e & 1 | 2 : e & 1), t) : (Ue(t), null);
      case 22:
      case 23:
        return It(t), us(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? n & 536870912 && !(t.flags & 128) && (Ue(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ue(t), n = t.updateQueue, n !== null && Tr(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== n && (t.flags |= 2048), e !== null && je(ul), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ln(Ze), Ue(t), null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function S0(e, t) {
    switch (ls(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return ln(Ze), bn(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Nl(t), null;
      case 13:
        if (It(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(s(340));
          Qa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return je(Qe), null;
      case 4:
        return bn(), null;
      case 10:
        return ln(t.type), null;
      case 22:
      case 23:
        return It(t), us(), e !== null && je(ul), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return ln(Ze), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Xh(e, t) {
    switch (ls(t), t.tag) {
      case 3:
        ln(Ze), bn();
        break;
      case 26:
      case 27:
      case 5:
        Nl(t);
        break;
      case 4:
        bn();
        break;
      case 13:
        It(t);
        break;
      case 19:
        je(Qe);
        break;
      case 10:
        ln(t.type);
        break;
      case 22:
      case 23:
        It(t), us(), e !== null && je(ul);
        break;
      case 24:
        ln(Ze);
    }
  }
  var E0 = {
    getCacheForType: function(e) {
      var t = nt(Ze), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    }
  }, A0 = typeof WeakMap == "function" ? WeakMap : Map, He = 0, De = null, pe = null, Se = 0, Ne = 0, bt = null, cn = !1, la = !1, tc = !1, on = 0, Be = 0, Ln = 0, pl = 0, nc = 0, Nt = 0, aa = 0, di = null, Yt = null, lc = !1, ac = 0, wr = 1 / 0, Rr = null, Bn = null, Or = !1, gl = null, hi = 0, ic = 0, rc = null, mi = 0, uc = null;
  function xt() {
    if (He & 2 && Se !== 0)
      return Se & -Se;
    if (J.T !== null) {
      var e = Wl;
      return e !== 0 ? e : vc();
    }
    return ff();
  }
  function Qh() {
    Nt === 0 && (Nt = !(Se & 536870912) || Ae ? rf() : 536870912);
    var e = Ot.current;
    return e !== null && (e.flags |= 32), Nt;
  }
  function it(e, t, n) {
    (e === De && Ne === 2 || e.cancelPendingCommit !== null) && (ia(e, 0), fn(
      e,
      Se,
      Nt,
      !1
    )), za(e, n), (!(He & 2) || e !== De) && (e === De && (!(He & 2) && (pl |= n), Be === 4 && fn(
      e,
      Se,
      Nt,
      !1
    )), Xt(e));
  }
  function Zh(e, t, n) {
    if (He & 6) throw Error(s(327));
    var a = !n && (t & 60) === 0 && (t & e.expiredLanes) === 0 || Na(e, t), r = a ? R0(e, t) : fc(e, t, !0), c = a;
    do {
      if (r === 0) {
        la && !a && fn(e, t, 0, !1);
        break;
      } else if (r === 6)
        fn(
          e,
          t,
          0,
          !cn
        );
      else {
        if (n = e.current.alternate, c && !T0(n)) {
          r = fc(e, t, !1), c = !1;
          continue;
        }
        if (r === 2) {
          if (c = t, e.errorRecoveryDisabledLanes & c)
            var d = 0;
          else
            d = e.pendingLanes & -536870913, d = d !== 0 ? d : d & 536870912 ? 536870912 : 0;
          if (d !== 0) {
            t = d;
            e: {
              var g = e;
              r = di;
              var x = g.current.memoizedState.isDehydrated;
              if (x && (ia(g, d).flags |= 256), d = fc(
                g,
                d,
                !1
              ), d !== 2) {
                if (tc && !x) {
                  g.errorRecoveryDisabledLanes |= c, pl |= c, r = 4;
                  break e;
                }
                c = Yt, Yt = r, c !== null && sc(c);
              }
              r = d;
            }
            if (c = !1, r !== 2) continue;
          }
        }
        if (r === 1) {
          ia(e, 0), fn(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, r) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((t & 4194176) === t) {
                fn(
                  a,
                  t,
                  Nt,
                  !cn
                );
                break e;
              }
              break;
            case 2:
              Yt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if (a.finishedWork = n, a.finishedLanes = t, (t & 62914560) === t && (c = ac + 300 - qt(), 10 < c)) {
            if (fn(
              a,
              t,
              Nt,
              !cn
            ), ki(a, 0) !== 0) break e;
            a.timeoutHandle = pm(
              Kh.bind(
                null,
                a,
                n,
                Yt,
                Rr,
                lc,
                t,
                Nt,
                pl,
                aa,
                cn,
                2,
                -0,
                0
              ),
              c
            );
            break e;
          }
          Kh(
            a,
            n,
            Yt,
            Rr,
            lc,
            t,
            Nt,
            pl,
            aa,
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
  function sc(e) {
    Yt === null ? Yt = e : Yt.push.apply(
      Yt,
      e
    );
  }
  function Kh(e, t, n, a, r, c, d, g, x, C, q, V, j) {
    var L = t.subtreeFlags;
    if ((L & 8192 || (L & 16785408) === 16785408) && (xi = { stylesheets: null, count: 0, unsuspend: ib }, Lh(t), t = ub(), t !== null)) {
      e.cancelPendingCommit = t(
        em.bind(
          null,
          e,
          n,
          a,
          r,
          d,
          g,
          x,
          1,
          V,
          j
        )
      ), fn(e, c, d, !C);
      return;
    }
    em(
      e,
      n,
      a,
      r,
      d,
      g,
      x,
      q,
      V,
      j
    );
  }
  function T0(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var a = 0; a < n.length; a++) {
          var r = n[a], c = r.getSnapshot;
          r = r.value;
          try {
            if (!pt(c(), r)) return !1;
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
  function fn(e, t, n, a) {
    t &= ~nc, t &= ~pl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var r = t; 0 < r; ) {
      var c = 31 - vt(r), d = 1 << c;
      a[c] = -1, r &= ~d;
    }
    n !== 0 && sf(e, n, t);
  }
  function Mr() {
    return He & 6 ? !0 : (vi(0), !1);
  }
  function cc() {
    if (pe !== null) {
      if (Ne === 0)
        var e = pe.return;
      else
        e = pe, nn = dl = null, vs(e), Kl = null, Wa = 0, e = pe;
      for (; e !== null; )
        Xh(e.alternate, e), e = e.return;
      pe = null;
    }
  }
  function ia(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, Y0(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), cc(), De = e, pe = n = Hn(e.current, null), Se = t, Ne = 0, bt = null, cn = !1, la = Na(e, t), tc = !1, aa = Nt = nc = pl = Ln = Be = 0, Yt = di = null, lc = !1, t & 8 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var r = 31 - vt(a), c = 1 << r;
        t |= e[r], a &= ~c;
      }
    return on = t, Pi(), n;
  }
  function Jh(e, t) {
    he = null, J.H = Vt, t === Ka ? (t = cd(), Ne = 3) : t === rd ? (t = cd(), Ne = 4) : Ne = t === uh ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, bt = t, pe === null && (Be = 1, yr(
      e,
      Tt(t, e.current)
    ));
  }
  function Wh() {
    var e = J.H;
    return J.H = Vt, e === null ? Vt : e;
  }
  function Fh() {
    var e = J.A;
    return J.A = E0, e;
  }
  function oc() {
    Be = 4, cn || (Se & 4194176) !== Se && Ot.current !== null || (la = !0), !(Ln & 134217727) && !(pl & 134217727) || De === null || fn(
      De,
      Se,
      Nt,
      !1
    );
  }
  function fc(e, t, n) {
    var a = He;
    He |= 2;
    var r = Wh(), c = Fh();
    (De !== e || Se !== t) && (Rr = null, ia(e, t)), t = !1;
    var d = Be;
    e: do
      try {
        if (Ne !== 0 && pe !== null) {
          var g = pe, x = bt;
          switch (Ne) {
            case 8:
              cc(), d = 6;
              break e;
            case 3:
            case 2:
            case 6:
              Ot.current === null && (t = !0);
              var C = Ne;
              if (Ne = 0, bt = null, ra(e, g, x, C), n && la) {
                d = 0;
                break e;
              }
              break;
            default:
              C = Ne, Ne = 0, bt = null, ra(e, g, x, C);
          }
        }
        w0(), d = Be;
        break;
      } catch (q) {
        Jh(e, q);
      }
    while (!0);
    return t && e.shellSuspendCounter++, nn = dl = null, He = a, J.H = r, J.A = c, pe === null && (De = null, Se = 0, Pi()), d;
  }
  function w0() {
    for (; pe !== null; ) $h(pe);
  }
  function R0(e, t) {
    var n = He;
    He |= 2;
    var a = Wh(), r = Fh();
    De !== e || Se !== t ? (Rr = null, wr = qt() + 500, ia(e, t)) : la = Na(
      e,
      t
    );
    e: do
      try {
        if (Ne !== 0 && pe !== null) {
          t = pe;
          var c = bt;
          t: switch (Ne) {
            case 1:
              Ne = 0, bt = null, ra(e, t, c, 1);
              break;
            case 2:
              if (ud(c)) {
                Ne = 0, bt = null, Ph(t);
                break;
              }
              t = function() {
                Ne === 2 && De === e && (Ne = 7), Xt(e);
              }, c.then(t, t);
              break e;
            case 3:
              Ne = 7;
              break e;
            case 4:
              Ne = 5;
              break e;
            case 7:
              ud(c) ? (Ne = 0, bt = null, Ph(t)) : (Ne = 0, bt = null, ra(e, t, c, 7));
              break;
            case 5:
              var d = null;
              switch (pe.tag) {
                case 26:
                  d = pe.memoizedState;
                case 5:
                case 27:
                  var g = pe;
                  if (!d || Om(d)) {
                    Ne = 0, bt = null;
                    var x = g.sibling;
                    if (x !== null) pe = x;
                    else {
                      var C = g.return;
                      C !== null ? (pe = C, Cr(C)) : pe = null;
                    }
                    break t;
                  }
              }
              Ne = 0, bt = null, ra(e, t, c, 5);
              break;
            case 6:
              Ne = 0, bt = null, ra(e, t, c, 6);
              break;
            case 8:
              cc(), Be = 6;
              break e;
            default:
              throw Error(s(462));
          }
        }
        O0();
        break;
      } catch (q) {
        Jh(e, q);
      }
    while (!0);
    return nn = dl = null, J.H = a, J.A = r, He = n, pe !== null ? 0 : (De = null, Se = 0, Pi(), Be);
  }
  function O0() {
    for (; pe !== null && !Wg(); )
      $h(pe);
  }
  function $h(e) {
    var t = bh(e.alternate, e, on);
    e.memoizedProps = e.pendingProps, t === null ? Cr(e) : pe = t;
  }
  function Ph(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = hh(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Se
        );
        break;
      case 11:
        t = hh(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Se
        );
        break;
      case 5:
        vs(t);
      default:
        Xh(n, t), t = pe = Gh(t, on), t = bh(n, t, on);
    }
    e.memoizedProps = e.pendingProps, t === null ? Cr(e) : pe = t;
  }
  function ra(e, t, n, a) {
    nn = dl = null, vs(t), Kl = null, Wa = 0;
    var r = t.return;
    try {
      if (v0(
        e,
        r,
        t,
        n,
        Se
      )) {
        Be = 1, yr(
          e,
          Tt(n, e.current)
        ), pe = null;
        return;
      }
    } catch (c) {
      if (r !== null) throw pe = r, c;
      Be = 1, yr(
        e,
        Tt(n, e.current)
      ), pe = null;
      return;
    }
    t.flags & 32768 ? (Ae || a === 1 ? e = !0 : la || Se & 536870912 ? e = !1 : (cn = e = !0, (a === 2 || a === 3 || a === 6) && (a = Ot.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Ih(t, e)) : Cr(t);
  }
  function Cr(e) {
    var t = e;
    do {
      if (t.flags & 32768) {
        Ih(
          t,
          cn
        );
        return;
      }
      e = t.return;
      var n = x0(
        t.alternate,
        t,
        on
      );
      if (n !== null) {
        pe = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        pe = t;
        return;
      }
      pe = t = e;
    } while (t !== null);
    Be === 0 && (Be = 5);
  }
  function Ih(e, t) {
    do {
      var n = S0(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, pe = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        pe = e;
        return;
      }
      pe = e = n;
    } while (e !== null);
    Be = 6, pe = null;
  }
  function em(e, t, n, a, r, c, d, g, x, C) {
    var q = J.T, V = $.p;
    try {
      $.p = 2, J.T = null, M0(
        e,
        t,
        n,
        a,
        V,
        r,
        c,
        d,
        g,
        x,
        C
      );
    } finally {
      J.T = q, $.p = V;
    }
  }
  function M0(e, t, n, a, r, c, d, g) {
    do
      ua();
    while (gl !== null);
    if (He & 6) throw Error(s(327));
    var x = e.finishedWork;
    if (a = e.finishedLanes, x === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, x === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0, e.cancelPendingCommit = null;
    var C = x.lanes | x.childLanes;
    if (C |= es, ry(
      e,
      a,
      C,
      c,
      d,
      g
    ), e === De && (pe = De = null, Se = 0), !(x.subtreeFlags & 10256) && !(x.flags & 10256) || Or || (Or = !0, ic = C, rc = n, z0(Li, function() {
      return ua(), null;
    })), n = (x.flags & 15990) !== 0, x.subtreeFlags & 15990 || n ? (n = J.T, J.T = null, c = $.p, $.p = 2, d = He, He |= 4, g0(e, x), jh(x, e), Py(Ac, e.containerInfo), Gr = !!Ec, Ac = Ec = null, e.current = x, Dh(e, x.alternate, x), Fg(), He = d, $.p = c, J.T = n) : e.current = x, Or ? (Or = !1, gl = e, hi = a) : tm(e, C), C = e.pendingLanes, C === 0 && (Bn = null), ty(x.stateNode), Xt(e), t !== null)
      for (r = e.onRecoverableError, x = 0; x < t.length; x++)
        C = t[x], r(C.value, {
          componentStack: C.stack
        });
    return hi & 3 && ua(), C = e.pendingLanes, a & 4194218 && C & 42 ? e === uc ? mi++ : (mi = 0, uc = e) : mi = 0, vi(0), null;
  }
  function tm(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, $a(t)));
  }
  function ua() {
    if (gl !== null) {
      var e = gl, t = ic;
      ic = 0;
      var n = of(hi), a = J.T, r = $.p;
      try {
        if ($.p = 32 > n ? 32 : n, J.T = null, gl === null)
          var c = !1;
        else {
          n = rc, rc = null;
          var d = gl, g = hi;
          if (gl = null, hi = 0, He & 6)
            throw Error(s(331));
          var x = He;
          if (He |= 4, qh(d.current), Hh(d, d.current, g, n), He = x, vi(0, !1), mt && typeof mt.onPostCommitFiberRoot == "function")
            try {
              mt.onPostCommitFiberRoot(Da, d);
            } catch {
            }
          c = !0;
        }
        return c;
      } finally {
        $.p = r, J.T = a, tm(e, t);
      }
    }
    return !1;
  }
  function nm(e, t, n) {
    t = Tt(n, t), t = Cs(e.stateNode, t, 2), e = zn(e, t, 2), e !== null && (za(e, 2), Xt(e));
  }
  function Ce(e, t, n) {
    if (e.tag === 3)
      nm(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          nm(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Bn === null || !Bn.has(a))) {
            e = Tt(n, e), n = ih(2), a = zn(t, n, 2), a !== null && (rh(
              n,
              a,
              t,
              e
            ), za(a, 2), Xt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function dc(e, t, n) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new A0();
      var r = /* @__PURE__ */ new Set();
      a.set(t, r);
    } else
      r = a.get(t), r === void 0 && (r = /* @__PURE__ */ new Set(), a.set(t, r));
    r.has(n) || (tc = !0, r.add(n), e = C0.bind(null, e, t, n), t.then(e, e));
  }
  function C0(e, t, n) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, De === e && (Se & n) === n && (Be === 4 || Be === 3 && (Se & 62914560) === Se && 300 > qt() - ac ? !(He & 2) && ia(e, 0) : nc |= n, aa === Se && (aa = 0)), Xt(e);
  }
  function lm(e, t) {
    t === 0 && (t = uf()), e = Tn(e, t), e !== null && (za(e, t), Xt(e));
  }
  function D0(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), lm(e, n);
  }
  function N0(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var a = e.stateNode, r = e.memoizedState;
        r !== null && (n = r.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(s(314));
    }
    a !== null && a.delete(t), lm(e, n);
  }
  function z0(e, t) {
    return Du(e, t);
  }
  var Dr = null, sa = null, hc = !1, Nr = !1, mc = !1, yl = 0;
  function Xt(e) {
    e !== sa && e.next === null && (sa === null ? Dr = sa = e : sa = sa.next = e), Nr = !0, hc || (hc = !0, j0(_0));
  }
  function vi(e, t) {
    if (!mc && Nr) {
      mc = !0;
      do
        for (var n = !1, a = Dr; a !== null; ) {
          if (e !== 0) {
            var r = a.pendingLanes;
            if (r === 0) var c = 0;
            else {
              var d = a.suspendedLanes, g = a.pingedLanes;
              c = (1 << 31 - vt(42 | e) + 1) - 1, c &= r & ~(d & ~g), c = c & 201326677 ? c & 201326677 | 1 : c ? c | 2 : 0;
            }
            c !== 0 && (n = !0, rm(a, c));
          } else
            c = Se, c = ki(
              a,
              a === De ? c : 0
            ), !(c & 3) || Na(a, c) || (n = !0, rm(a, c));
          a = a.next;
        }
      while (n);
      mc = !1;
    }
  }
  function _0() {
    Nr = hc = !1;
    var e = 0;
    yl !== 0 && (V0() && (e = yl), yl = 0);
    for (var t = qt(), n = null, a = Dr; a !== null; ) {
      var r = a.next, c = am(a, t);
      c === 0 ? (a.next = null, n === null ? Dr = r : n.next = r, r === null && (sa = n)) : (n = a, (e !== 0 || c & 3) && (Nr = !0)), a = r;
    }
    vi(e);
  }
  function am(e, t) {
    for (var n = e.suspendedLanes, a = e.pingedLanes, r = e.expirationTimes, c = e.pendingLanes & -62914561; 0 < c; ) {
      var d = 31 - vt(c), g = 1 << d, x = r[d];
      x === -1 ? (!(g & n) || g & a) && (r[d] = iy(g, t)) : x <= t && (e.expiredLanes |= g), c &= ~g;
    }
    if (t = De, n = Se, n = ki(
      e,
      e === t ? n : 0
    ), a = e.callbackNode, n === 0 || e === t && Ne === 2 || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Nu(a), e.callbackNode = null, e.callbackPriority = 0;
    if (!(n & 3) || Na(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (a !== null && Nu(a), of(n)) {
        case 2:
        case 8:
          n = lf;
          break;
        case 32:
          n = Li;
          break;
        case 268435456:
          n = af;
          break;
        default:
          n = Li;
      }
      return a = im.bind(null, e), n = Du(n, a), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return a !== null && a !== null && Nu(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function im(e, t) {
    var n = e.callbackNode;
    if (ua() && e.callbackNode !== n)
      return null;
    var a = Se;
    return a = ki(
      e,
      e === De ? a : 0
    ), a === 0 ? null : (Zh(e, a, t), am(e, qt()), e.callbackNode != null && e.callbackNode === n ? im.bind(null, e) : null);
  }
  function rm(e, t) {
    if (ua()) return null;
    Zh(e, t, !0);
  }
  function j0(e) {
    X0(function() {
      He & 6 ? Du(nf, e) : e();
    });
  }
  function vc() {
    return yl === 0 && (yl = rf()), yl;
  }
  function um(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Qi("" + e);
  }
  function sm(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function U0(e, t, n, a, r) {
    if (t === "submit" && n && n.stateNode === r) {
      var c = um(
        (r[ut] || null).action
      ), d = a.submitter;
      d && (t = (t = d[ut] || null) ? um(t.formAction) : d.getAttribute("formAction"), t !== null && (c = t, d = null));
      var g = new Wi(
        "action",
        "action",
        null,
        a,
        r
      );
      e.push({
        event: g,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (yl !== 0) {
                  var x = d ? sm(r, d) : new FormData(r);
                  Ts(
                    n,
                    {
                      pending: !0,
                      data: x,
                      method: r.method,
                      action: c
                    },
                    null,
                    x
                  );
                }
              } else
                typeof c == "function" && (g.preventDefault(), x = d ? sm(r, d) : new FormData(r), Ts(
                  n,
                  {
                    pending: !0,
                    data: x,
                    method: r.method,
                    action: c
                  },
                  c,
                  x
                ));
            },
            currentTarget: r
          }
        ]
      });
    }
  }
  for (var pc = 0; pc < ed.length; pc++) {
    var gc = ed[pc], H0 = gc.toLowerCase(), L0 = gc[0].toUpperCase() + gc.slice(1);
    _t(
      H0,
      "on" + L0
    );
  }
  _t(Wf, "onAnimationEnd"), _t(Ff, "onAnimationIteration"), _t($f, "onAnimationStart"), _t("dblclick", "onDoubleClick"), _t("focusin", "onFocus"), _t("focusout", "onBlur"), _t(e0, "onTransitionRun"), _t(t0, "onTransitionStart"), _t(n0, "onTransitionCancel"), _t(Pf, "onTransitionEnd"), Ul("onMouseEnter", ["mouseout", "mouseover"]), Ul("onMouseLeave", ["mouseout", "mouseover"]), Ul("onPointerEnter", ["pointerout", "pointerover"]), Ul("onPointerLeave", ["pointerout", "pointerover"]), In(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), In(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), In("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), In(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), In(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), In(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var pi = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), B0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pi)
  );
  function cm(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var a = e[n], r = a.event;
      a = a.listeners;
      e: {
        var c = void 0;
        if (t)
          for (var d = a.length - 1; 0 <= d; d--) {
            var g = a[d], x = g.instance, C = g.currentTarget;
            if (g = g.listener, x !== c && r.isPropagationStopped())
              break e;
            c = g, r.currentTarget = C;
            try {
              c(r);
            } catch (q) {
              gr(q);
            }
            r.currentTarget = null, c = x;
          }
        else
          for (d = 0; d < a.length; d++) {
            if (g = a[d], x = g.instance, C = g.currentTarget, g = g.listener, x !== c && r.isPropagationStopped())
              break e;
            c = g, r.currentTarget = C;
            try {
              c(r);
            } catch (q) {
              gr(q);
            }
            r.currentTarget = null, c = x;
          }
      }
    }
  }
  function be(e, t) {
    var n = t[_u];
    n === void 0 && (n = t[_u] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    n.has(a) || (om(t, e, 2, !1), n.add(a));
  }
  function yc(e, t, n) {
    var a = 0;
    t && (a |= 4), om(
      n,
      e,
      a,
      t
    );
  }
  var zr = "_reactListening" + Math.random().toString(36).slice(2);
  function bc(e) {
    if (!e[zr]) {
      e[zr] = !0, hf.forEach(function(n) {
        n !== "selectionchange" && (B0.has(n) || yc(n, !1, e), yc(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[zr] || (t[zr] = !0, yc("selectionchange", !1, t));
    }
  }
  function om(e, t, n, a) {
    switch (_m(t)) {
      case 2:
        var r = ob;
        break;
      case 8:
        r = fb;
        break;
      default:
        r = zc;
    }
    n = r.bind(
      null,
      t,
      n,
      e
    ), r = void 0, !Gu || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (r = !0), a ? r !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: r
    }) : e.addEventListener(t, n, !0) : r !== void 0 ? e.addEventListener(t, n, {
      passive: r
    }) : e.addEventListener(t, n, !1);
  }
  function xc(e, t, n, a, r) {
    var c = a;
    if (!(t & 1) && !(t & 2) && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var d = a.tag;
        if (d === 3 || d === 4) {
          var g = a.stateNode.containerInfo;
          if (g === r || g.nodeType === 8 && g.parentNode === r)
            break;
          if (d === 4)
            for (d = a.return; d !== null; ) {
              var x = d.tag;
              if ((x === 3 || x === 4) && (x = d.stateNode.containerInfo, x === r || x.nodeType === 8 && x.parentNode === r))
                return;
              d = d.return;
            }
          for (; g !== null; ) {
            if (d = Pn(g), d === null) return;
            if (x = d.tag, x === 5 || x === 6 || x === 26 || x === 27) {
              a = c = d;
              continue e;
            }
            g = g.parentNode;
          }
        }
        a = a.return;
      }
    wf(function() {
      var C = c, q = qu(n), V = [];
      e: {
        var j = If.get(e);
        if (j !== void 0) {
          var L = Wi, ne = e;
          switch (e) {
            case "keypress":
              if (Ki(n) === 0) break e;
            case "keydown":
            case "keyup":
              L = Ny;
              break;
            case "focusin":
              ne = "focus", L = Qu;
              break;
            case "focusout":
              ne = "blur", L = Qu;
              break;
            case "beforeblur":
            case "afterblur":
              L = Qu;
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
              L = Mf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              L = by;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              L = jy;
              break;
            case Wf:
            case Ff:
            case $f:
              L = Ey;
              break;
            case Pf:
              L = Hy;
              break;
            case "scroll":
            case "scrollend":
              L = gy;
              break;
            case "wheel":
              L = By;
              break;
            case "copy":
            case "cut":
            case "paste":
              L = Ty;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              L = Df;
              break;
            case "toggle":
            case "beforetoggle":
              L = ky;
          }
          var ce = (t & 4) !== 0, qe = !ce && (e === "scroll" || e === "scrollend"), D = ce ? j !== null ? j + "Capture" : null : j;
          ce = [];
          for (var M = C, N; M !== null; ) {
            var G = M;
            if (N = G.stateNode, G = G.tag, G !== 5 && G !== 26 && G !== 27 || N === null || D === null || (G = Ua(M, D), G != null && ce.push(
              gi(M, G, N)
            )), qe) break;
            M = M.return;
          }
          0 < ce.length && (j = new L(
            j,
            ne,
            null,
            n,
            q
          ), V.push({ event: j, listeners: ce }));
        }
      }
      if (!(t & 7)) {
        e: {
          if (j = e === "mouseover" || e === "pointerover", L = e === "mouseout" || e === "pointerout", j && n !== Bu && (ne = n.relatedTarget || n.fromElement) && (Pn(ne) || ne[zl]))
            break e;
          if ((L || j) && (j = q.window === q ? q : (j = q.ownerDocument) ? j.defaultView || j.parentWindow : window, L ? (ne = n.relatedTarget || n.toElement, L = C, ne = ne ? Pn(ne) : null, ne !== null && (qe = Z(ne), ce = ne.tag, ne !== qe || ce !== 5 && ce !== 27 && ce !== 6) && (ne = null)) : (L = null, ne = C), L !== ne)) {
            if (ce = Mf, G = "onMouseLeave", D = "onMouseEnter", M = "mouse", (e === "pointerout" || e === "pointerover") && (ce = Df, G = "onPointerLeave", D = "onPointerEnter", M = "pointer"), qe = L == null ? j : ja(L), N = ne == null ? j : ja(ne), j = new ce(
              G,
              M + "leave",
              L,
              n,
              q
            ), j.target = qe, j.relatedTarget = N, G = null, Pn(q) === C && (ce = new ce(
              D,
              M + "enter",
              ne,
              n,
              q
            ), ce.target = N, ce.relatedTarget = qe, G = ce), qe = G, L && ne)
              t: {
                for (ce = L, D = ne, M = 0, N = ce; N; N = ca(N))
                  M++;
                for (N = 0, G = D; G; G = ca(G))
                  N++;
                for (; 0 < M - N; )
                  ce = ca(ce), M--;
                for (; 0 < N - M; )
                  D = ca(D), N--;
                for (; M--; ) {
                  if (ce === D || D !== null && ce === D.alternate)
                    break t;
                  ce = ca(ce), D = ca(D);
                }
                ce = null;
              }
            else ce = null;
            L !== null && fm(
              V,
              j,
              L,
              ce,
              !1
            ), ne !== null && qe !== null && fm(
              V,
              qe,
              ne,
              ce,
              !0
            );
          }
        }
        e: {
          if (j = C ? ja(C) : window, L = j.nodeName && j.nodeName.toLowerCase(), L === "select" || L === "input" && j.type === "file")
            var P = Bf;
          else if (Hf(j))
            if (qf)
              P = Fy;
            else {
              P = Jy;
              var me = Ky;
            }
          else
            L = j.nodeName, !L || L.toLowerCase() !== "input" || j.type !== "checkbox" && j.type !== "radio" ? C && Lu(C.elementType) && (P = Bf) : P = Wy;
          if (P && (P = P(e, C))) {
            Lf(
              V,
              P,
              n,
              q
            );
            break e;
          }
          me && me(e, j, C), e === "focusout" && C && j.type === "number" && C.memoizedProps.value != null && Hu(j, "number", j.value);
        }
        switch (me = C ? ja(C) : window, e) {
          case "focusin":
            (Hf(me) || me.contentEditable === "true") && (Gl = me, $u = C, Ya = null);
            break;
          case "focusout":
            Ya = $u = Gl = null;
            break;
          case "mousedown":
            Pu = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Pu = !1, Kf(V, n, q);
            break;
          case "selectionchange":
            if (Iy) break;
          case "keydown":
          case "keyup":
            Kf(V, n, q);
        }
        var ie;
        if (Ku)
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
          kl ? jf(e, n) && (ue = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ue = "onCompositionStart");
        ue && (Nf && n.locale !== "ko" && (kl || ue !== "onCompositionStart" ? ue === "onCompositionEnd" && kl && (ie = Rf()) : (An = q, Vu = "value" in An ? An.value : An.textContent, kl = !0)), me = _r(C, ue), 0 < me.length && (ue = new Cf(
          ue,
          e,
          null,
          n,
          q
        ), V.push({ event: ue, listeners: me }), ie ? ue.data = ie : (ie = Uf(n), ie !== null && (ue.data = ie)))), (ie = Vy ? Yy(e, n) : Xy(e, n)) && (ue = _r(C, "onBeforeInput"), 0 < ue.length && (me = new Cf(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          q
        ), V.push({
          event: me,
          listeners: ue
        }), me.data = ie)), U0(
          V,
          e,
          C,
          n,
          q
        );
      }
      cm(V, t);
    });
  }
  function gi(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function _r(e, t) {
    for (var n = t + "Capture", a = []; e !== null; ) {
      var r = e, c = r.stateNode;
      r = r.tag, r !== 5 && r !== 26 && r !== 27 || c === null || (r = Ua(e, n), r != null && a.unshift(
        gi(e, r, c)
      ), r = Ua(e, t), r != null && a.push(
        gi(e, r, c)
      )), e = e.return;
    }
    return a;
  }
  function ca(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function fm(e, t, n, a, r) {
    for (var c = t._reactName, d = []; n !== null && n !== a; ) {
      var g = n, x = g.alternate, C = g.stateNode;
      if (g = g.tag, x !== null && x === a) break;
      g !== 5 && g !== 26 && g !== 27 || C === null || (x = C, r ? (C = Ua(n, c), C != null && d.unshift(
        gi(n, C, x)
      )) : r || (C = Ua(n, c), C != null && d.push(
        gi(n, C, x)
      ))), n = n.return;
    }
    d.length !== 0 && e.push({ event: t, listeners: d });
  }
  var q0 = /\r\n?/g, k0 = /\u0000|\uFFFD/g;
  function dm(e) {
    return (typeof e == "string" ? e : "" + e).replace(q0, `
`).replace(k0, "");
  }
  function hm(e, t) {
    return t = dm(t), dm(e) === t;
  }
  function jr() {
  }
  function Re(e, t, n, a, r, c) {
    switch (n) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Ll(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Ll(e, "" + a);
        break;
      case "className":
        Vi(e, "class", a);
        break;
      case "tabIndex":
        Vi(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Vi(e, n, a);
        break;
      case "style":
        Af(e, a, c);
        break;
      case "data":
        if (t !== "object") {
          Vi(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(n);
          break;
        }
        a = Qi("" + a), e.setAttribute(n, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof c == "function" && (n === "formAction" ? (t !== "input" && Re(e, t, "name", r.name, r, null), Re(
            e,
            t,
            "formEncType",
            r.formEncType,
            r,
            null
          ), Re(
            e,
            t,
            "formMethod",
            r.formMethod,
            r,
            null
          ), Re(
            e,
            t,
            "formTarget",
            r.formTarget,
            r,
            null
          )) : (Re(e, t, "encType", r.encType, r, null), Re(e, t, "method", r.method, r, null), Re(e, t, "target", r.target, r, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(n);
          break;
        }
        a = Qi("" + a), e.setAttribute(n, a);
        break;
      case "onClick":
        a != null && (e.onclick = jr);
        break;
      case "onScroll":
        a != null && be("scroll", e);
        break;
      case "onScrollEnd":
        a != null && be("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (n = a.__html, n != null) {
            if (r.children != null) throw Error(s(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
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
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        n = Qi("" + a), e.setAttributeNS(
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
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(n, "" + a) : e.removeAttribute(n);
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
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(n, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(n, a) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(n, a) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(n) : e.setAttribute(n, a);
        break;
      case "popover":
        be("beforetoggle", e), be("toggle", e), Gi(e, "popover", a);
        break;
      case "xlinkActuate":
        Ft(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Ft(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Ft(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Ft(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Ft(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Ft(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Ft(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Ft(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Ft(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Gi(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = vy.get(n) || n, Gi(e, n, a));
    }
  }
  function Sc(e, t, n, a, r, c) {
    switch (n) {
      case "style":
        Af(e, a, c);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (n = a.__html, n != null) {
            if (r.children != null) throw Error(s(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof a == "string" ? Ll(e, a) : (typeof a == "number" || typeof a == "bigint") && Ll(e, "" + a);
        break;
      case "onScroll":
        a != null && be("scroll", e);
        break;
      case "onScrollEnd":
        a != null && be("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = jr);
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
        if (!mf.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (r = n.endsWith("Capture"), t = n.slice(2, r ? n.length - 7 : void 0), c = e[ut] || null, c = c != null ? c[n] : null, typeof c == "function" && e.removeEventListener(t, c, r), typeof a == "function")) {
              typeof c != "function" && c !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, a, r);
              break e;
            }
            n in e ? e[n] = a : a === !0 ? e.setAttribute(n, "") : Gi(e, n, a);
          }
    }
  }
  function et(e, t, n) {
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
        var a = !1, r = !1, c;
        for (c in n)
          if (n.hasOwnProperty(c)) {
            var d = n[c];
            if (d != null)
              switch (c) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  r = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(s(137, t));
                default:
                  Re(e, t, c, d, n, null);
              }
          }
        r && Re(e, t, "srcSet", n.srcSet, n, null), a && Re(e, t, "src", n.src, n, null);
        return;
      case "input":
        be("invalid", e);
        var g = c = d = r = null, x = null, C = null;
        for (a in n)
          if (n.hasOwnProperty(a)) {
            var q = n[a];
            if (q != null)
              switch (a) {
                case "name":
                  r = q;
                  break;
                case "type":
                  d = q;
                  break;
                case "checked":
                  x = q;
                  break;
                case "defaultChecked":
                  C = q;
                  break;
                case "value":
                  c = q;
                  break;
                case "defaultValue":
                  g = q;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (q != null)
                    throw Error(s(137, t));
                  break;
                default:
                  Re(e, t, a, q, n, null);
              }
          }
        bf(
          e,
          c,
          g,
          x,
          C,
          d,
          r,
          !1
        ), Yi(e);
        return;
      case "select":
        be("invalid", e), a = d = c = null;
        for (r in n)
          if (n.hasOwnProperty(r) && (g = n[r], g != null))
            switch (r) {
              case "value":
                c = g;
                break;
              case "defaultValue":
                d = g;
                break;
              case "multiple":
                a = g;
              default:
                Re(e, t, r, g, n, null);
            }
        t = c, n = d, e.multiple = !!a, t != null ? Hl(e, !!a, t, !1) : n != null && Hl(e, !!a, n, !0);
        return;
      case "textarea":
        be("invalid", e), c = r = a = null;
        for (d in n)
          if (n.hasOwnProperty(d) && (g = n[d], g != null))
            switch (d) {
              case "value":
                a = g;
                break;
              case "defaultValue":
                r = g;
                break;
              case "children":
                c = g;
                break;
              case "dangerouslySetInnerHTML":
                if (g != null) throw Error(s(91));
                break;
              default:
                Re(e, t, d, g, n, null);
            }
        Sf(e, a, r, c), Yi(e);
        return;
      case "option":
        for (x in n)
          if (n.hasOwnProperty(x) && (a = n[x], a != null))
            switch (x) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Re(e, t, x, a, n, null);
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
        for (a = 0; a < pi.length; a++)
          be(pi[a], e);
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
        for (C in n)
          if (n.hasOwnProperty(C) && (a = n[C], a != null))
            switch (C) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(s(137, t));
              default:
                Re(e, t, C, a, n, null);
            }
        return;
      default:
        if (Lu(t)) {
          for (q in n)
            n.hasOwnProperty(q) && (a = n[q], a !== void 0 && Sc(
              e,
              t,
              q,
              a,
              n,
              void 0
            ));
          return;
        }
    }
    for (g in n)
      n.hasOwnProperty(g) && (a = n[g], a != null && Re(e, t, g, a, n, null));
  }
  function G0(e, t, n, a) {
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
        var r = null, c = null, d = null, g = null, x = null, C = null, q = null;
        for (L in n) {
          var V = n[L];
          if (n.hasOwnProperty(L) && V != null)
            switch (L) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                x = V;
              default:
                a.hasOwnProperty(L) || Re(e, t, L, null, a, V);
            }
        }
        for (var j in a) {
          var L = a[j];
          if (V = n[j], a.hasOwnProperty(j) && (L != null || V != null))
            switch (j) {
              case "type":
                c = L;
                break;
              case "name":
                r = L;
                break;
              case "checked":
                C = L;
                break;
              case "defaultChecked":
                q = L;
                break;
              case "value":
                d = L;
                break;
              case "defaultValue":
                g = L;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (L != null)
                  throw Error(s(137, t));
                break;
              default:
                L !== V && Re(
                  e,
                  t,
                  j,
                  L,
                  a,
                  V
                );
            }
        }
        Uu(
          e,
          d,
          g,
          x,
          C,
          q,
          c,
          r
        );
        return;
      case "select":
        L = d = g = j = null;
        for (c in n)
          if (x = n[c], n.hasOwnProperty(c) && x != null)
            switch (c) {
              case "value":
                break;
              case "multiple":
                L = x;
              default:
                a.hasOwnProperty(c) || Re(
                  e,
                  t,
                  c,
                  null,
                  a,
                  x
                );
            }
        for (r in a)
          if (c = a[r], x = n[r], a.hasOwnProperty(r) && (c != null || x != null))
            switch (r) {
              case "value":
                j = c;
                break;
              case "defaultValue":
                g = c;
                break;
              case "multiple":
                d = c;
              default:
                c !== x && Re(
                  e,
                  t,
                  r,
                  c,
                  a,
                  x
                );
            }
        t = g, n = d, a = L, j != null ? Hl(e, !!n, j, !1) : !!a != !!n && (t != null ? Hl(e, !!n, t, !0) : Hl(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        L = j = null;
        for (g in n)
          if (r = n[g], n.hasOwnProperty(g) && r != null && !a.hasOwnProperty(g))
            switch (g) {
              case "value":
                break;
              case "children":
                break;
              default:
                Re(e, t, g, null, a, r);
            }
        for (d in a)
          if (r = a[d], c = n[d], a.hasOwnProperty(d) && (r != null || c != null))
            switch (d) {
              case "value":
                j = r;
                break;
              case "defaultValue":
                L = r;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(s(91));
                break;
              default:
                r !== c && Re(e, t, d, r, a, c);
            }
        xf(e, j, L);
        return;
      case "option":
        for (var ne in n)
          if (j = n[ne], n.hasOwnProperty(ne) && j != null && !a.hasOwnProperty(ne))
            switch (ne) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Re(
                  e,
                  t,
                  ne,
                  null,
                  a,
                  j
                );
            }
        for (x in a)
          if (j = a[x], L = n[x], a.hasOwnProperty(x) && j !== L && (j != null || L != null))
            switch (x) {
              case "selected":
                e.selected = j && typeof j != "function" && typeof j != "symbol";
                break;
              default:
                Re(
                  e,
                  t,
                  x,
                  j,
                  a,
                  L
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
          j = n[ce], n.hasOwnProperty(ce) && j != null && !a.hasOwnProperty(ce) && Re(e, t, ce, null, a, j);
        for (C in a)
          if (j = a[C], L = n[C], a.hasOwnProperty(C) && j !== L && (j != null || L != null))
            switch (C) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (j != null)
                  throw Error(s(137, t));
                break;
              default:
                Re(
                  e,
                  t,
                  C,
                  j,
                  a,
                  L
                );
            }
        return;
      default:
        if (Lu(t)) {
          for (var qe in n)
            j = n[qe], n.hasOwnProperty(qe) && j !== void 0 && !a.hasOwnProperty(qe) && Sc(
              e,
              t,
              qe,
              void 0,
              a,
              j
            );
          for (q in a)
            j = a[q], L = n[q], !a.hasOwnProperty(q) || j === L || j === void 0 && L === void 0 || Sc(
              e,
              t,
              q,
              j,
              a,
              L
            );
          return;
        }
    }
    for (var D in n)
      j = n[D], n.hasOwnProperty(D) && j != null && !a.hasOwnProperty(D) && Re(e, t, D, null, a, j);
    for (V in a)
      j = a[V], L = n[V], !a.hasOwnProperty(V) || j === L || j == null && L == null || Re(e, t, V, j, a, L);
  }
  var Ec = null, Ac = null;
  function Ur(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function mm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function vm(e, t) {
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
  function Tc(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var wc = null;
  function V0() {
    var e = window.event;
    return e && e.type === "popstate" ? e === wc ? !1 : (wc = e, !0) : (wc = null, !1);
  }
  var pm = typeof setTimeout == "function" ? setTimeout : void 0, Y0 = typeof clearTimeout == "function" ? clearTimeout : void 0, gm = typeof Promise == "function" ? Promise : void 0, X0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof gm < "u" ? function(e) {
    return gm.resolve(null).then(e).catch(Q0);
  } : pm;
  function Q0(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Rc(e, t) {
    var n = t, a = 0;
    do {
      var r = n.nextSibling;
      if (e.removeChild(n), r && r.nodeType === 8)
        if (n = r.data, n === "/$") {
          if (a === 0) {
            e.removeChild(r), wi(t);
            return;
          }
          a--;
        } else n !== "$" && n !== "$?" && n !== "$!" || a++;
      n = r;
    } while (n);
    wi(t);
  }
  function Oc(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Oc(n), ju(n);
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
  function Z0(e, t, n, a) {
    for (; e.nodeType === 1; ) {
      var r = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[_a])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (c = e.getAttribute("rel"), c === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (c !== r.rel || e.getAttribute("href") !== (r.href == null ? null : r.href) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin) || e.getAttribute("title") !== (r.title == null ? null : r.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (c = e.getAttribute("src"), (c !== (r.src == null ? null : r.src) || e.getAttribute("type") !== (r.type == null ? null : r.type) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin)) && c && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var c = r.name == null ? null : "" + r.name;
        if (r.type === "hidden" && e.getAttribute("name") === c)
          return e;
      } else return e;
      if (e = Ht(e.nextSibling), e === null) break;
    }
    return null;
  }
  function K0(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Ht(e.nextSibling), e === null)) return null;
    return e;
  }
  function Ht(e) {
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
  function ym(e) {
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
  function bm(e, t, n) {
    switch (t = Ur(n), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(s(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(s(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(s(454));
        return e;
      default:
        throw Error(s(451));
    }
  }
  var zt = /* @__PURE__ */ new Map(), xm = /* @__PURE__ */ new Set();
  function Hr(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.ownerDocument;
  }
  var dn = $.d;
  $.d = {
    f: J0,
    r: W0,
    D: F0,
    C: $0,
    L: P0,
    m: I0,
    X: tb,
    S: eb,
    M: nb
  };
  function J0() {
    var e = dn.f(), t = Mr();
    return e || t;
  }
  function W0(e) {
    var t = _l(e);
    t !== null && t.tag === 5 && t.type === "form" ? Kd(t) : dn.r(e);
  }
  var oa = typeof document > "u" ? null : document;
  function Sm(e, t, n) {
    var a = oa;
    if (a && typeof t == "string" && t) {
      var r = Et(t);
      r = 'link[rel="' + e + '"][href="' + r + '"]', typeof n == "string" && (r += '[crossorigin="' + n + '"]'), xm.has(r) || (xm.add(r), e = { rel: e, crossOrigin: n, href: t }, a.querySelector(r) === null && (t = a.createElement("link"), et(t, "link", e), Ke(t), a.head.appendChild(t)));
    }
  }
  function F0(e) {
    dn.D(e), Sm("dns-prefetch", e, null);
  }
  function $0(e, t) {
    dn.C(e, t), Sm("preconnect", e, t);
  }
  function P0(e, t, n) {
    dn.L(e, t, n);
    var a = oa;
    if (a && e && t) {
      var r = 'link[rel="preload"][as="' + Et(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (r += '[imagesrcset="' + Et(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (r += '[imagesizes="' + Et(
        n.imageSizes
      ) + '"]')) : r += '[href="' + Et(e) + '"]';
      var c = r;
      switch (t) {
        case "style":
          c = fa(e);
          break;
        case "script":
          c = da(e);
      }
      zt.has(c) || (e = F(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), zt.set(c, e), a.querySelector(r) !== null || t === "style" && a.querySelector(yi(c)) || t === "script" && a.querySelector(bi(c)) || (t = a.createElement("link"), et(t, "link", e), Ke(t), a.head.appendChild(t)));
    }
  }
  function I0(e, t) {
    dn.m(e, t);
    var n = oa;
    if (n && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", r = 'link[rel="modulepreload"][as="' + Et(a) + '"][href="' + Et(e) + '"]', c = r;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          c = da(e);
      }
      if (!zt.has(c) && (e = F({ rel: "modulepreload", href: e }, t), zt.set(c, e), n.querySelector(r) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(bi(c)))
              return;
        }
        a = n.createElement("link"), et(a, "link", e), Ke(a), n.head.appendChild(a);
      }
    }
  }
  function eb(e, t, n) {
    dn.S(e, t, n);
    var a = oa;
    if (a && e) {
      var r = jl(a).hoistableStyles, c = fa(e);
      t = t || "default";
      var d = r.get(c);
      if (!d) {
        var g = { loading: 0, preload: null };
        if (d = a.querySelector(
          yi(c)
        ))
          g.loading = 5;
        else {
          e = F(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = zt.get(c)) && Mc(e, n);
          var x = d = a.createElement("link");
          Ke(x), et(x, "link", e), x._p = new Promise(function(C, q) {
            x.onload = C, x.onerror = q;
          }), x.addEventListener("load", function() {
            g.loading |= 1;
          }), x.addEventListener("error", function() {
            g.loading |= 2;
          }), g.loading |= 4, Lr(d, t, a);
        }
        d = {
          type: "stylesheet",
          instance: d,
          count: 1,
          state: g
        }, r.set(c, d);
      }
    }
  }
  function tb(e, t) {
    dn.X(e, t);
    var n = oa;
    if (n && e) {
      var a = jl(n).hoistableScripts, r = da(e), c = a.get(r);
      c || (c = n.querySelector(bi(r)), c || (e = F({ src: e, async: !0 }, t), (t = zt.get(r)) && Cc(e, t), c = n.createElement("script"), Ke(c), et(c, "link", e), n.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, a.set(r, c));
    }
  }
  function nb(e, t) {
    dn.M(e, t);
    var n = oa;
    if (n && e) {
      var a = jl(n).hoistableScripts, r = da(e), c = a.get(r);
      c || (c = n.querySelector(bi(r)), c || (e = F({ src: e, async: !0, type: "module" }, t), (t = zt.get(r)) && Cc(e, t), c = n.createElement("script"), Ke(c), et(c, "link", e), n.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, a.set(r, c));
    }
  }
  function Em(e, t, n, a) {
    var r = (r = rt.current) ? Hr(r) : null;
    if (!r) throw Error(s(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = fa(n.href), n = jl(
          r
        ).hoistableStyles, a = n.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = fa(n.href);
          var c = jl(
            r
          ).hoistableStyles, d = c.get(e);
          if (d || (r = r.ownerDocument || r, d = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, c.set(e, d), (c = r.querySelector(
            yi(e)
          )) && !c._p && (d.instance = c, d.state.loading = 5), zt.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, zt.set(e, n), c || lb(
            r,
            e,
            n,
            d.state
          ))), t && a === null)
            throw Error(s(528, ""));
          return d;
        }
        if (t && a !== null)
          throw Error(s(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = da(n), n = jl(
          r
        ).hoistableScripts, a = n.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(s(444, e));
    }
  }
  function fa(e) {
    return 'href="' + Et(e) + '"';
  }
  function yi(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Am(e) {
    return F({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function lb(e, t, n, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), et(t, "link", n), Ke(t), e.head.appendChild(t));
  }
  function da(e) {
    return '[src="' + Et(e) + '"]';
  }
  function bi(e) {
    return "script[async]" + e;
  }
  function Tm(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Et(n.href) + '"]'
          );
          if (a)
            return t.instance = a, Ke(a), a;
          var r = F({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), Ke(a), et(a, "style", r), Lr(a, n.precedence, e), t.instance = a;
        case "stylesheet":
          r = fa(n.href);
          var c = e.querySelector(
            yi(r)
          );
          if (c)
            return t.state.loading |= 4, t.instance = c, Ke(c), c;
          a = Am(n), (r = zt.get(r)) && Mc(a, r), c = (e.ownerDocument || e).createElement("link"), Ke(c);
          var d = c;
          return d._p = new Promise(function(g, x) {
            d.onload = g, d.onerror = x;
          }), et(c, "link", a), t.state.loading |= 4, Lr(c, n.precedence, e), t.instance = c;
        case "script":
          return c = da(n.src), (r = e.querySelector(
            bi(c)
          )) ? (t.instance = r, Ke(r), r) : (a = n, (r = zt.get(c)) && (a = F({}, n), Cc(a, r)), e = e.ownerDocument || e, r = e.createElement("script"), Ke(r), et(r, "link", a), e.head.appendChild(r), t.instance = r);
        case "void":
          return null;
        default:
          throw Error(s(443, t.type));
      }
    else
      t.type === "stylesheet" && !(t.state.loading & 4) && (a = t.instance, t.state.loading |= 4, Lr(a, n.precedence, e));
    return t.instance;
  }
  function Lr(e, t, n) {
    for (var a = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), r = a.length ? a[a.length - 1] : null, c = r, d = 0; d < a.length; d++) {
      var g = a[d];
      if (g.dataset.precedence === t) c = g;
      else if (c !== r) break;
    }
    c ? c.parentNode.insertBefore(e, c.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function Mc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Cc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Br = null;
  function wm(e, t, n) {
    if (Br === null) {
      var a = /* @__PURE__ */ new Map(), r = Br = /* @__PURE__ */ new Map();
      r.set(n, a);
    } else
      r = Br, a = r.get(n), a || (a = /* @__PURE__ */ new Map(), r.set(n, a));
    if (a.has(e)) return a;
    for (a.set(e, null), n = n.getElementsByTagName(e), r = 0; r < n.length; r++) {
      var c = n[r];
      if (!(c[_a] || c[tt] || e === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
        var d = c.getAttribute(t) || "";
        d = e + d;
        var g = a.get(d);
        g ? g.push(c) : a.set(d, [c]);
      }
    }
    return a;
  }
  function Rm(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function ab(e, t, n) {
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
  function Om(e) {
    return !(e.type === "stylesheet" && !(e.state.loading & 3));
  }
  var xi = null;
  function ib() {
  }
  function rb(e, t, n) {
    if (xi === null) throw Error(s(475));
    var a = xi;
    if (t.type === "stylesheet" && (typeof n.media != "string" || matchMedia(n.media).matches !== !1) && !(t.state.loading & 4)) {
      if (t.instance === null) {
        var r = fa(n.href), c = e.querySelector(
          yi(r)
        );
        if (c) {
          e = c._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = qr.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = c, Ke(c);
          return;
        }
        c = e.ownerDocument || e, n = Am(n), (r = zt.get(r)) && Mc(n, r), c = c.createElement("link"), Ke(c);
        var d = c;
        d._p = new Promise(function(g, x) {
          d.onload = g, d.onerror = x;
        }), et(c, "link", n), t.instance = c;
      }
      a.stylesheets === null && (a.stylesheets = /* @__PURE__ */ new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && !(t.state.loading & 3) && (a.count++, t = qr.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  function ub() {
    if (xi === null) throw Error(s(475));
    var e = xi;
    return e.stylesheets && e.count === 0 && Dc(e, e.stylesheets), 0 < e.count ? function(t) {
      var n = setTimeout(function() {
        if (e.stylesheets && Dc(e, e.stylesheets), e.unsuspend) {
          var a = e.unsuspend;
          e.unsuspend = null, a();
        }
      }, 6e4);
      return e.unsuspend = t, function() {
        e.unsuspend = null, clearTimeout(n);
      };
    } : null;
  }
  function qr() {
    if (this.count--, this.count === 0) {
      if (this.stylesheets) Dc(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var kr = null;
  function Dc(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, kr = /* @__PURE__ */ new Map(), t.forEach(sb, e), kr = null, qr.call(e));
  }
  function sb(e, t) {
    if (!(t.state.loading & 4)) {
      var n = kr.get(e);
      if (n) var a = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), kr.set(e, n);
        for (var r = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), c = 0; c < r.length; c++) {
          var d = r[c];
          (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (n.set(d.dataset.precedence, d), a = d);
        }
        a && n.set(null, a);
      }
      r = t.instance, d = r.getAttribute("data-precedence"), c = n.get(d) || a, c === a && n.set(null, r), n.set(d, r), this.count++, a = qr.bind(this), r.addEventListener("load", a), r.addEventListener("error", a), c ? c.parentNode.insertBefore(r, c.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(r, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Si = {
    $$typeof: O,
    Provider: null,
    Consumer: null,
    _currentValue: oe,
    _currentValue2: oe,
    _threadCount: 0
  };
  function cb(e, t, n, a, r, c, d, g) {
    this.tag = 1, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = zu(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.finishedLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = zu(0), this.hiddenUpdates = zu(null), this.identifierPrefix = a, this.onUncaughtError = r, this.onCaughtError = c, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = g, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Mm(e, t, n, a, r, c, d, g, x, C, q, V) {
    return e = new cb(
      e,
      t,
      n,
      d,
      g,
      x,
      C,
      V
    ), t = 1, c === !0 && (t |= 24), c = Dt(3, null, null, t), e.current = c, c.stateNode = e, t = ss(), t.refCount++, e.pooledCache = t, t.refCount++, c.memoizedState = {
      element: a,
      isDehydrated: n,
      cache: t
    }, Vs(c), e;
  }
  function Cm(e) {
    return e ? (e = Xl, e) : Xl;
  }
  function Dm(e, t, n, a, r, c) {
    r = Cm(r), a.context === null ? a.context = r : a.pendingContext = r, a = Nn(t), a.payload = { element: n }, c = c === void 0 ? null : c, c !== null && (a.callback = c), n = zn(e, a, t), n !== null && (it(n, e, t), ai(n, e, t));
  }
  function Nm(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Nc(e, t) {
    Nm(e, t), (e = e.alternate) && Nm(e, t);
  }
  function zm(e) {
    if (e.tag === 13) {
      var t = Tn(e, 67108864);
      t !== null && it(t, e, 67108864), Nc(e, 67108864);
    }
  }
  var Gr = !0;
  function ob(e, t, n, a) {
    var r = J.T;
    J.T = null;
    var c = $.p;
    try {
      $.p = 2, zc(e, t, n, a);
    } finally {
      $.p = c, J.T = r;
    }
  }
  function fb(e, t, n, a) {
    var r = J.T;
    J.T = null;
    var c = $.p;
    try {
      $.p = 8, zc(e, t, n, a);
    } finally {
      $.p = c, J.T = r;
    }
  }
  function zc(e, t, n, a) {
    if (Gr) {
      var r = _c(a);
      if (r === null)
        xc(
          e,
          t,
          a,
          Vr,
          n
        ), jm(e, a);
      else if (hb(
        r,
        e,
        t,
        n,
        a
      ))
        a.stopPropagation();
      else if (jm(e, a), t & 4 && -1 < db.indexOf(e)) {
        for (; r !== null; ) {
          var c = _l(r);
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (c = c.stateNode, c.current.memoizedState.isDehydrated) {
                  var d = $n(c.pendingLanes);
                  if (d !== 0) {
                    var g = c;
                    for (g.pendingLanes |= 2, g.entangledLanes |= 2; d; ) {
                      var x = 1 << 31 - vt(d);
                      g.entanglements[1] |= x, d &= ~x;
                    }
                    Xt(c), !(He & 6) && (wr = qt() + 500, vi(0));
                  }
                }
                break;
              case 13:
                g = Tn(c, 2), g !== null && it(g, c, 2), Mr(), Nc(c, 2);
            }
          if (c = _c(a), c === null && xc(
            e,
            t,
            a,
            Vr,
            n
          ), c === r) break;
          r = c;
        }
        r !== null && a.stopPropagation();
      } else
        xc(
          e,
          t,
          a,
          null,
          n
        );
    }
  }
  function _c(e) {
    return e = qu(e), jc(e);
  }
  var Vr = null;
  function jc(e) {
    if (Vr = null, e = Pn(e), e !== null) {
      var t = Z(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = le(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Vr = e, null;
  }
  function _m(e) {
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
        switch ($g()) {
          case nf:
            return 2;
          case lf:
            return 8;
          case Li:
          case Pg:
            return 32;
          case af:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Uc = !1, qn = null, kn = null, Gn = null, Ei = /* @__PURE__ */ new Map(), Ai = /* @__PURE__ */ new Map(), Vn = [], db = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function jm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        qn = null;
        break;
      case "dragenter":
      case "dragleave":
        kn = null;
        break;
      case "mouseover":
      case "mouseout":
        Gn = null;
        break;
      case "pointerover":
      case "pointerout":
        Ei.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ai.delete(t.pointerId);
    }
  }
  function Ti(e, t, n, a, r, c) {
    return e === null || e.nativeEvent !== c ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: a,
      nativeEvent: c,
      targetContainers: [r]
    }, t !== null && (t = _l(t), t !== null && zm(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, r !== null && t.indexOf(r) === -1 && t.push(r), e);
  }
  function hb(e, t, n, a, r) {
    switch (t) {
      case "focusin":
        return qn = Ti(
          qn,
          e,
          t,
          n,
          a,
          r
        ), !0;
      case "dragenter":
        return kn = Ti(
          kn,
          e,
          t,
          n,
          a,
          r
        ), !0;
      case "mouseover":
        return Gn = Ti(
          Gn,
          e,
          t,
          n,
          a,
          r
        ), !0;
      case "pointerover":
        var c = r.pointerId;
        return Ei.set(
          c,
          Ti(
            Ei.get(c) || null,
            e,
            t,
            n,
            a,
            r
          )
        ), !0;
      case "gotpointercapture":
        return c = r.pointerId, Ai.set(
          c,
          Ti(
            Ai.get(c) || null,
            e,
            t,
            n,
            a,
            r
          )
        ), !0;
    }
    return !1;
  }
  function Um(e) {
    var t = Pn(e.target);
    if (t !== null) {
      var n = Z(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = le(n), t !== null) {
            e.blockedOn = t, uy(e.priority, function() {
              if (n.tag === 13) {
                var a = xt(), r = Tn(n, a);
                r !== null && it(r, n, a), Nc(n, a);
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
  function Yr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = _c(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var a = new n.constructor(
          n.type,
          n
        );
        Bu = a, n.target.dispatchEvent(a), Bu = null;
      } else
        return t = _l(n), t !== null && zm(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Hm(e, t, n) {
    Yr(e) && n.delete(t);
  }
  function mb() {
    Uc = !1, qn !== null && Yr(qn) && (qn = null), kn !== null && Yr(kn) && (kn = null), Gn !== null && Yr(Gn) && (Gn = null), Ei.forEach(Hm), Ai.forEach(Hm);
  }
  function Xr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Uc || (Uc = !0, l.unstable_scheduleCallback(
      l.unstable_NormalPriority,
      mb
    )));
  }
  var Qr = null;
  function Lm(e) {
    Qr !== e && (Qr = e, l.unstable_scheduleCallback(
      l.unstable_NormalPriority,
      function() {
        Qr === e && (Qr = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], a = e[t + 1], r = e[t + 2];
          if (typeof a != "function") {
            if (jc(a || n) === null)
              continue;
            break;
          }
          var c = _l(n);
          c !== null && (e.splice(t, 3), t -= 3, Ts(
            c,
            {
              pending: !0,
              data: r,
              method: n.method,
              action: a
            },
            a,
            r
          ));
        }
      }
    ));
  }
  function wi(e) {
    function t(x) {
      return Xr(x, e);
    }
    qn !== null && Xr(qn, e), kn !== null && Xr(kn, e), Gn !== null && Xr(Gn, e), Ei.forEach(t), Ai.forEach(t);
    for (var n = 0; n < Vn.length; n++) {
      var a = Vn[n];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Vn.length && (n = Vn[0], n.blockedOn === null); )
      Um(n), n.blockedOn === null && Vn.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (a = 0; a < n.length; a += 3) {
        var r = n[a], c = n[a + 1], d = r[ut] || null;
        if (typeof c == "function")
          d || Lm(n);
        else if (d) {
          var g = null;
          if (c && c.hasAttribute("formAction")) {
            if (r = c, d = c[ut] || null)
              g = d.formAction;
            else if (jc(r) !== null) continue;
          } else g = d.action;
          typeof g == "function" ? n[a + 1] = g : (n.splice(a, 3), a -= 3), Lm(n);
        }
      }
  }
  function Hc(e) {
    this._internalRoot = e;
  }
  Zr.prototype.render = Hc.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    var n = t.current, a = xt();
    Dm(n, a, e, t, null, null);
  }, Zr.prototype.unmount = Hc.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      e.tag === 0 && ua(), Dm(e.current, 2, null, e, null, null), Mr(), t[zl] = null;
    }
  };
  function Zr(e) {
    this._internalRoot = e;
  }
  Zr.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ff();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Vn.length && t !== 0 && t < Vn[n].priority; n++) ;
      Vn.splice(n, 0, e), n === 0 && Um(e);
    }
  };
  var Bm = i.version;
  if (Bm !== "19.0.0")
    throw Error(
      s(
        527,
        Bm,
        "19.0.0"
      )
    );
  $.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = Q(t), e = e !== null ? re(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var vb = {
    bundleType: 0,
    version: "19.0.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: J,
    findFiberByHostInstance: Pn,
    reconcilerVersion: "19.0.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Kr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Kr.isDisabled && Kr.supportsFiber)
      try {
        Da = Kr.inject(
          vb
        ), mt = Kr;
      } catch {
      }
  }
  return Mi.createRoot = function(e, t) {
    if (!o(e)) throw Error(s(299));
    var n = !1, a = "", r = th, c = nh, d = lh, g = null;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (r = t.onUncaughtError), t.onCaughtError !== void 0 && (c = t.onCaughtError), t.onRecoverableError !== void 0 && (d = t.onRecoverableError), t.unstable_transitionCallbacks !== void 0 && (g = t.unstable_transitionCallbacks)), t = Mm(
      e,
      1,
      !1,
      null,
      null,
      n,
      a,
      r,
      c,
      d,
      g,
      null
    ), e[zl] = t.current, bc(
      e.nodeType === 8 ? e.parentNode : e
    ), new Hc(t);
  }, Mi.hydrateRoot = function(e, t, n) {
    if (!o(e)) throw Error(s(299));
    var a = !1, r = "", c = th, d = nh, g = lh, x = null, C = null;
    return n != null && (n.unstable_strictMode === !0 && (a = !0), n.identifierPrefix !== void 0 && (r = n.identifierPrefix), n.onUncaughtError !== void 0 && (c = n.onUncaughtError), n.onCaughtError !== void 0 && (d = n.onCaughtError), n.onRecoverableError !== void 0 && (g = n.onRecoverableError), n.unstable_transitionCallbacks !== void 0 && (x = n.unstable_transitionCallbacks), n.formState !== void 0 && (C = n.formState)), t = Mm(
      e,
      1,
      !0,
      t,
      n ?? null,
      a,
      r,
      c,
      d,
      g,
      x,
      C
    ), t.context = Cm(null), n = t.current, a = xt(), r = Nn(a), r.callback = null, zn(n, r, a), t.current.lanes = a, za(t, a), Xt(t), e[zl] = t.current, bc(e), new Zr(t);
  }, Mi.version = "19.0.0", Mi;
}
var Jm;
function Ob() {
  if (Jm) return Bc.exports;
  Jm = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (i) {
        console.error(i);
      }
  }
  return l(), Bc.exports = Rb(), Bc.exports;
}
var Di = Ob(), vn = Gv();
const Mb = /* @__PURE__ */ kv(vn);
var S = Ro();
const Cb = /* @__PURE__ */ kv(S), Db = /* @__PURE__ */ bb({
  __proto__: null,
  default: Cb
}, [S]);
function ot(l, i, { checkForDefaultPrevented: u = !0 } = {}) {
  return function(o) {
    if (l == null || l(o), u === !1 || !o.defaultPrevented)
      return i == null ? void 0 : i(o);
  };
}
function Wm(l, i) {
  if (typeof l == "function")
    return l(i);
  l != null && (l.current = i);
}
function Vv(...l) {
  return (i) => {
    let u = !1;
    const s = l.map((o) => {
      const f = Wm(o, i);
      return !u && typeof f == "function" && (u = !0), f;
    });
    if (u)
      return () => {
        for (let o = 0; o < s.length; o++) {
          const f = s[o];
          typeof f == "function" ? f() : Wm(l[o], null);
        }
      };
  };
}
function Lt(...l) {
  return S.useCallback(Vv(...l), l);
}
function Nb(l, i) {
  const u = S.createContext(i), s = (f) => {
    const { children: h, ...m } = f, v = S.useMemo(() => m, Object.values(m));
    return /* @__PURE__ */ y.jsx(u.Provider, { value: v, children: h });
  };
  s.displayName = l + "Provider";
  function o(f) {
    const h = S.useContext(u);
    if (h) return h;
    if (i !== void 0) return i;
    throw new Error(`\`${f}\` must be used within \`${l}\``);
  }
  return [s, o];
}
function Oo(l, i = []) {
  let u = [];
  function s(f, h) {
    const m = S.createContext(h), v = u.length;
    u = [...u, h];
    const p = (E) => {
      var _;
      const { scope: R, children: O, ...w } = E, T = ((_ = R == null ? void 0 : R[l]) == null ? void 0 : _[v]) || m, z = S.useMemo(() => w, Object.values(w));
      return /* @__PURE__ */ y.jsx(T.Provider, { value: z, children: O });
    };
    p.displayName = f + "Provider";
    function b(E, R) {
      var T;
      const O = ((T = R == null ? void 0 : R[l]) == null ? void 0 : T[v]) || m, w = S.useContext(O);
      if (w) return w;
      if (h !== void 0) return h;
      throw new Error(`\`${E}\` must be used within \`${f}\``);
    }
    return [p, b];
  }
  const o = () => {
    const f = u.map((h) => S.createContext(h));
    return function(m) {
      const v = (m == null ? void 0 : m[l]) || f;
      return S.useMemo(
        () => ({ [`__scope${l}`]: { ...m, [l]: v } }),
        [m, v]
      );
    };
  };
  return o.scopeName = l, [s, zb(o, ...i)];
}
function zb(...l) {
  const i = l[0];
  if (l.length === 1) return i;
  const u = () => {
    const s = l.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(f) {
      const h = s.reduce((m, { useScope: v, scopeName: p }) => {
        const E = v(f)[`__scope${p}`];
        return { ...m, ...E };
      }, {});
      return S.useMemo(() => ({ [`__scope${i.scopeName}`]: h }), [h]);
    };
  };
  return u.scopeName = i.scopeName, u;
}
var bu = S.forwardRef((l, i) => {
  const { children: u, ...s } = l, o = S.Children.toArray(u), f = o.find(_b);
  if (f) {
    const h = f.props.children, m = o.map((v) => v === f ? S.Children.count(h) > 1 ? S.Children.only(null) : S.isValidElement(h) ? h.props.children : null : v);
    return /* @__PURE__ */ y.jsx(ro, { ...s, ref: i, children: S.isValidElement(h) ? S.cloneElement(h, void 0, m) : null });
  }
  return /* @__PURE__ */ y.jsx(ro, { ...s, ref: i, children: u });
});
bu.displayName = "Slot";
var ro = S.forwardRef((l, i) => {
  const { children: u, ...s } = l;
  if (S.isValidElement(u)) {
    const o = Ub(u), f = jb(s, u.props);
    return u.type !== S.Fragment && (f.ref = i ? Vv(i, o) : o), S.cloneElement(u, f);
  }
  return S.Children.count(u) > 1 ? S.Children.only(null) : null;
});
ro.displayName = "SlotClone";
var Yv = ({ children: l }) => /* @__PURE__ */ y.jsx(y.Fragment, { children: l });
function _b(l) {
  return S.isValidElement(l) && l.type === Yv;
}
function jb(l, i) {
  const u = { ...i };
  for (const s in i) {
    const o = l[s], f = i[s];
    /^on[A-Z]/.test(s) ? o && f ? u[s] = (...m) => {
      f(...m), o(...m);
    } : o && (u[s] = o) : s === "style" ? u[s] = { ...o, ...f } : s === "className" && (u[s] = [o, f].filter(Boolean).join(" "));
  }
  return { ...l, ...u };
}
function Ub(l) {
  var s, o;
  let i = (s = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : s.get, u = i && "isReactWarning" in i && i.isReactWarning;
  return u ? l.ref : (i = (o = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : o.get, u = i && "isReactWarning" in i && i.isReactWarning, u ? l.props.ref : l.props.ref || l.ref);
}
var Hb = [
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
], dt = Hb.reduce((l, i) => {
  const u = S.forwardRef((s, o) => {
    const { asChild: f, ...h } = s, m = f ? bu : i;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ y.jsx(m, { ...h, ref: o });
  });
  return u.displayName = `Primitive.${i}`, { ...l, [i]: u };
}, {});
function Lb(l, i) {
  l && vn.flushSync(() => l.dispatchEvent(i));
}
function Zn(l) {
  const i = S.useRef(l);
  return S.useEffect(() => {
    i.current = l;
  }), S.useMemo(() => (...u) => {
    var s;
    return (s = i.current) == null ? void 0 : s.call(i, ...u);
  }, []);
}
function Bb(l, i = globalThis == null ? void 0 : globalThis.document) {
  const u = Zn(l);
  S.useEffect(() => {
    const s = (o) => {
      o.key === "Escape" && u(o);
    };
    return i.addEventListener("keydown", s, { capture: !0 }), () => i.removeEventListener("keydown", s, { capture: !0 });
  }, [u, i]);
}
var qb = "DismissableLayer", uo = "dismissableLayer.update", kb = "dismissableLayer.pointerDownOutside", Gb = "dismissableLayer.focusOutside", Fm, Xv = S.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Mo = S.forwardRef(
  (l, i) => {
    const {
      disableOutsidePointerEvents: u = !1,
      onEscapeKeyDown: s,
      onPointerDownOutside: o,
      onFocusOutside: f,
      onInteractOutside: h,
      onDismiss: m,
      ...v
    } = l, p = S.useContext(Xv), [b, E] = S.useState(null), R = (b == null ? void 0 : b.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, O] = S.useState({}), w = Lt(i, (K) => E(K)), T = Array.from(p.layers), [z] = [...p.layersWithOutsidePointerEventsDisabled].slice(-1), _ = T.indexOf(z), B = b ? T.indexOf(b) : -1, Y = p.layersWithOutsidePointerEventsDisabled.size > 0, X = B >= _, H = Xb((K) => {
      const W = K.target, J = [...p.branches].some((F) => F.contains(W));
      !X || J || (o == null || o(K), h == null || h(K), K.defaultPrevented || m == null || m());
    }, R), U = Qb((K) => {
      const W = K.target;
      [...p.branches].some((F) => F.contains(W)) || (f == null || f(K), h == null || h(K), K.defaultPrevented || m == null || m());
    }, R);
    return Bb((K) => {
      B === p.layers.size - 1 && (s == null || s(K), !K.defaultPrevented && m && (K.preventDefault(), m()));
    }, R), S.useEffect(() => {
      if (b)
        return u && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (Fm = R.body.style.pointerEvents, R.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(b)), p.layers.add(b), $m(), () => {
          u && p.layersWithOutsidePointerEventsDisabled.size === 1 && (R.body.style.pointerEvents = Fm);
        };
    }, [b, R, u, p]), S.useEffect(() => () => {
      b && (p.layers.delete(b), p.layersWithOutsidePointerEventsDisabled.delete(b), $m());
    }, [b, p]), S.useEffect(() => {
      const K = () => O({});
      return document.addEventListener(uo, K), () => document.removeEventListener(uo, K);
    }, []), /* @__PURE__ */ y.jsx(
      dt.div,
      {
        ...v,
        ref: w,
        style: {
          pointerEvents: Y ? X ? "auto" : "none" : void 0,
          ...l.style
        },
        onFocusCapture: ot(l.onFocusCapture, U.onFocusCapture),
        onBlurCapture: ot(l.onBlurCapture, U.onBlurCapture),
        onPointerDownCapture: ot(
          l.onPointerDownCapture,
          H.onPointerDownCapture
        )
      }
    );
  }
);
Mo.displayName = qb;
var Vb = "DismissableLayerBranch", Yb = S.forwardRef((l, i) => {
  const u = S.useContext(Xv), s = S.useRef(null), o = Lt(i, s);
  return S.useEffect(() => {
    const f = s.current;
    if (f)
      return u.branches.add(f), () => {
        u.branches.delete(f);
      };
  }, [u.branches]), /* @__PURE__ */ y.jsx(dt.div, { ...l, ref: o });
});
Yb.displayName = Vb;
function Xb(l, i = globalThis == null ? void 0 : globalThis.document) {
  const u = Zn(l), s = S.useRef(!1), o = S.useRef(() => {
  });
  return S.useEffect(() => {
    const f = (m) => {
      if (m.target && !s.current) {
        let v = function() {
          Qv(
            kb,
            u,
            p,
            { discrete: !0 }
          );
        };
        const p = { originalEvent: m };
        m.pointerType === "touch" ? (i.removeEventListener("click", o.current), o.current = v, i.addEventListener("click", o.current, { once: !0 })) : v();
      } else
        i.removeEventListener("click", o.current);
      s.current = !1;
    }, h = window.setTimeout(() => {
      i.addEventListener("pointerdown", f);
    }, 0);
    return () => {
      window.clearTimeout(h), i.removeEventListener("pointerdown", f), i.removeEventListener("click", o.current);
    };
  }, [i, u]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => s.current = !0
  };
}
function Qb(l, i = globalThis == null ? void 0 : globalThis.document) {
  const u = Zn(l), s = S.useRef(!1);
  return S.useEffect(() => {
    const o = (f) => {
      f.target && !s.current && Qv(Gb, u, { originalEvent: f }, {
        discrete: !1
      });
    };
    return i.addEventListener("focusin", o), () => i.removeEventListener("focusin", o);
  }, [i, u]), {
    onFocusCapture: () => s.current = !0,
    onBlurCapture: () => s.current = !1
  };
}
function $m() {
  const l = new CustomEvent(uo);
  document.dispatchEvent(l);
}
function Qv(l, i, u, { discrete: s }) {
  const o = u.originalEvent.target, f = new CustomEvent(l, { bubbles: !1, cancelable: !0, detail: u });
  i && o.addEventListener(l, i, { once: !0 }), s ? Lb(o, f) : o.dispatchEvent(f);
}
var wl = globalThis != null && globalThis.document ? S.useLayoutEffect : () => {
}, Zb = Db.useId || (() => {
}), Kb = 0;
function lu(l) {
  const [i, u] = S.useState(Zb());
  return wl(() => {
    u((s) => s ?? String(Kb++));
  }, [l]), i ? `radix-${i}` : "";
}
const Jb = ["top", "right", "bottom", "left"], Kn = Math.min, hn = Math.max, cu = Math.round, Jr = Math.floor, mn = (l) => ({
  x: l,
  y: l
}), Wb = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Zv(l, i, u) {
  return hn(l, Kn(i, u));
}
function pn(l, i) {
  return typeof l == "function" ? l(i) : l;
}
function Jn(l) {
  return l.split("-")[0];
}
function Aa(l) {
  return l.split("-")[1];
}
function Co(l) {
  return l === "x" ? "y" : "x";
}
function Do(l) {
  return l === "y" ? "height" : "width";
}
function Zt(l) {
  const i = l[0];
  return i === "t" || i === "b" ? "y" : "x";
}
function No(l) {
  return Co(Zt(l));
}
function Fb(l, i, u) {
  u === void 0 && (u = !1);
  const s = Aa(l), o = No(l), f = Do(o);
  let h = o === "x" ? s === (u ? "end" : "start") ? "right" : "left" : s === "start" ? "bottom" : "top";
  return i.reference[f] > i.floating[f] && (h = ou(h)), [h, ou(h)];
}
function $b(l) {
  const i = ou(l);
  return [so(l), i, so(i)];
}
function so(l) {
  return l.includes("start") ? l.replace("start", "end") : l.replace("end", "start");
}
const Pm = ["left", "right"], Im = ["right", "left"], Pb = ["top", "bottom"], Ib = ["bottom", "top"];
function e1(l, i, u) {
  switch (l) {
    case "top":
    case "bottom":
      return u ? i ? Im : Pm : i ? Pm : Im;
    case "left":
    case "right":
      return i ? Pb : Ib;
    default:
      return [];
  }
}
function t1(l, i, u, s) {
  const o = Aa(l);
  let f = e1(Jn(l), u === "start", s);
  return o && (f = f.map((h) => h + "-" + o), i && (f = f.concat(f.map(so)))), f;
}
function ou(l) {
  const i = Jn(l);
  return Wb[i] + l.slice(i.length);
}
function n1(l) {
  var i, u, s, o;
  return {
    top: (i = l.top) != null ? i : 0,
    right: (u = l.right) != null ? u : 0,
    bottom: (s = l.bottom) != null ? s : 0,
    left: (o = l.left) != null ? o : 0
  };
}
function Kv(l) {
  return typeof l != "number" ? n1(l) : {
    top: l,
    right: l,
    bottom: l,
    left: l
  };
}
function fu(l) {
  const {
    x: i,
    y: u,
    width: s,
    height: o
  } = l;
  return {
    width: s,
    height: o,
    top: u,
    left: i,
    right: i + s,
    bottom: u + o,
    x: i,
    y: u
  };
}
function ev(l, i, u) {
  let {
    reference: s,
    floating: o
  } = l;
  const f = Zt(i), h = No(i), m = Do(h), v = Jn(i), p = f === "y", b = s.x + s.width / 2 - o.width / 2, E = s.y + s.height / 2 - o.height / 2, R = s[m] / 2 - o[m] / 2;
  let O;
  switch (v) {
    case "top":
      O = {
        x: b,
        y: s.y - o.height
      };
      break;
    case "bottom":
      O = {
        x: b,
        y: s.y + s.height
      };
      break;
    case "right":
      O = {
        x: s.x + s.width,
        y: E
      };
      break;
    case "left":
      O = {
        x: s.x - o.width,
        y: E
      };
      break;
    default:
      O = {
        x: s.x,
        y: s.y
      };
  }
  const w = Aa(i);
  return w && (O[h] += R * (w === "end" ? 1 : -1) * (u && p ? -1 : 1)), O;
}
async function l1(l, i) {
  var u;
  i === void 0 && (i = {});
  const {
    x: s,
    y: o,
    platform: f,
    rects: h,
    elements: m,
    strategy: v
  } = l, {
    boundary: p = "clippingAncestors",
    rootBoundary: b = "viewport",
    elementContext: E = "floating",
    altBoundary: R = !1,
    padding: O = 0
  } = pn(i, l), w = Kv(O), z = m[R ? E === "floating" ? "reference" : "floating" : E], _ = fu(await f.getClippingRect({
    element: (u = await (f.isElement == null ? void 0 : f.isElement(z))) == null || u ? z : z.contextElement || await (f.getDocumentElement == null ? void 0 : f.getDocumentElement(m.floating)),
    boundary: p,
    rootBoundary: b,
    strategy: v
  })), B = E === "floating" ? {
    x: s,
    y: o,
    width: h.floating.width,
    height: h.floating.height
  } : h.reference, Y = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(m.floating)), X = await (f.isElement == null ? void 0 : f.isElement(Y)) && await (f.getScale == null ? void 0 : f.getScale(Y)) || {
    x: 1,
    y: 1
  }, H = fu(f.convertOffsetParentRelativeRectToViewportRelativeRect ? await f.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: m,
    rect: B,
    offsetParent: Y,
    strategy: v
  }) : B);
  return {
    top: (_.top - H.top + w.top) / X.y,
    bottom: (H.bottom - _.bottom + w.bottom) / X.y,
    left: (_.left - H.left + w.left) / X.x,
    right: (H.right - _.right + w.right) / X.x
  };
}
const a1 = 50, i1 = async (l, i, u) => {
  const {
    placement: s = "bottom",
    strategy: o = "absolute",
    middleware: f = [],
    platform: h
  } = u, m = h.detectOverflow ? h : {
    ...h,
    detectOverflow: l1
  }, v = await (h.isRTL == null ? void 0 : h.isRTL(i));
  let p = await h.getElementRects({
    reference: l,
    floating: i,
    strategy: o
  }), {
    x: b,
    y: E
  } = ev(p, s, v), R = s, O = 0;
  const w = {};
  for (let T = 0; T < f.length; T++) {
    const z = f[T];
    if (!z)
      continue;
    const {
      name: _,
      fn: B
    } = z, {
      x: Y,
      y: X,
      data: H,
      reset: U
    } = await B({
      x: b,
      y: E,
      initialPlacement: s,
      placement: R,
      strategy: o,
      middlewareData: w,
      rects: p,
      platform: m,
      elements: {
        reference: l,
        floating: i
      }
    });
    b = Y ?? b, E = X ?? E, w[_] = {
      ...w[_],
      ...H
    }, U && O < a1 && (O++, typeof U == "object" && (U.placement && (R = U.placement), U.rects && (p = U.rects === !0 ? await h.getElementRects({
      reference: l,
      floating: i,
      strategy: o
    }) : U.rects), {
      x: b,
      y: E
    } = ev(p, R, v)), T = -1);
  }
  return {
    x: b,
    y: E,
    placement: R,
    strategy: o,
    middlewareData: w
  };
}, r1 = (l) => ({
  name: "arrow",
  options: l,
  async fn(i) {
    const {
      x: u,
      y: s,
      placement: o,
      rects: f,
      platform: h,
      elements: m,
      middlewareData: v
    } = i, {
      element: p,
      padding: b = 0
    } = pn(l, i) || {};
    if (p == null)
      return {};
    const E = Kv(b), R = {
      x: u,
      y: s
    }, O = No(o), w = Do(O), T = await h.getDimensions(p), z = O === "y", _ = z ? "top" : "left", B = z ? "bottom" : "right", Y = z ? "clientHeight" : "clientWidth", X = f.reference[w] + f.reference[O] - R[O] - f.floating[w], H = R[O] - f.reference[O], U = await (h.getOffsetParent == null ? void 0 : h.getOffsetParent(p));
    let K = U ? U[Y] : 0;
    (!K || !await (h.isElement == null ? void 0 : h.isElement(U))) && (K = m.floating[Y] || f.floating[w]);
    const W = X / 2 - H / 2, J = K / 2 - T[w] / 2 - 1, F = Kn(E[_], J), xe = Kn(E[B], J), Oe = K - T[w] - xe, de = K / 2 - T[w] / 2 + W, ve = Zv(F, de, Oe), ge = !v.arrow && Aa(o) != null && de !== ve && f.reference[w] / 2 - (de < F ? F : xe) - T[w] / 2 < 0, k = ge ? de < F ? de - F : de - Oe : 0;
    return {
      [O]: R[O] + k,
      data: {
        [O]: ve,
        centerOffset: de - ve - k,
        ...ge && {
          alignmentOffset: k
        }
      },
      reset: ge
    };
  }
}), u1 = function(l) {
  return l === void 0 && (l = {}), {
    name: "flip",
    options: l,
    async fn(i) {
      var u, s;
      const {
        placement: o,
        middlewareData: f,
        rects: h,
        initialPlacement: m,
        platform: v,
        elements: p
      } = i, {
        mainAxis: b = !0,
        crossAxis: E = !0,
        fallbackPlacements: R,
        fallbackStrategy: O = "bestFit",
        fallbackAxisSideDirection: w = "none",
        flipAlignment: T = !0,
        ...z
      } = pn(l, i);
      if ((u = f.arrow) != null && u.alignmentOffset)
        return {};
      const _ = Jn(o), B = Zt(m), Y = Jn(m) === m, X = await (v.isRTL == null ? void 0 : v.isRTL(p.floating)), H = R || (Y || !T ? [ou(m)] : $b(m)), U = w !== "none";
      !R && U && H.push(...t1(m, T, w, X));
      const K = [m, ...H], W = await v.detectOverflow(i, z), J = [];
      let F = ((s = f.flip) == null ? void 0 : s.overflows) || [];
      if (b && J.push(W[_]), E) {
        const ve = Fb(o, h, X);
        J.push(W[ve[0]], W[ve[1]]);
      }
      if (F = [...F, {
        placement: o,
        overflows: J
      }], !J.every((ve) => ve <= 0)) {
        var xe, Oe;
        const ve = (((xe = f.flip) == null ? void 0 : xe.index) || 0) + 1, ge = K[ve];
        if (ge && (!(E === "alignment" ? B !== Zt(ge) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        F.every((Z) => Zt(Z.placement) === B ? Z.overflows[0] > 0 : !0)))
          return {
            data: {
              index: ve,
              overflows: F
            },
            reset: {
              placement: ge
            }
          };
        let k = (Oe = F.filter((te) => te.overflows[0] <= 0).sort((te, Z) => te.overflows[1] - Z.overflows[1])[0]) == null ? void 0 : Oe.placement;
        if (!k)
          switch (O) {
            case "bestFit": {
              var de;
              const te = (de = F.filter((Z) => {
                if (U) {
                  const le = Zt(Z.placement);
                  return le === B || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  le === "y";
                }
                return !0;
              }).map((Z) => [Z.placement, Z.overflows.filter((le) => le > 0).reduce((le, A) => le + A, 0)]).sort((Z, le) => Z[1] - le[1])[0]) == null ? void 0 : de[0];
              te && (k = te);
              break;
            }
            case "initialPlacement":
              k = m;
              break;
          }
        if (o !== k)
          return {
            reset: {
              placement: k
            }
          };
      }
      return {};
    }
  };
};
function tv(l, i) {
  return {
    top: l.top - i.height,
    right: l.right - i.width,
    bottom: l.bottom - i.height,
    left: l.left - i.width
  };
}
function nv(l) {
  return Jb.some((i) => l[i] >= 0);
}
const s1 = function(l) {
  return l === void 0 && (l = {}), {
    name: "hide",
    options: l,
    async fn(i) {
      const {
        rects: u,
        platform: s
      } = i, {
        strategy: o = "referenceHidden",
        ...f
      } = pn(l, i);
      switch (o) {
        case "referenceHidden": {
          const h = await s.detectOverflow(i, {
            ...f,
            elementContext: "reference"
          }), m = tv(h, u.reference);
          return {
            data: {
              referenceHiddenOffsets: m,
              referenceHidden: nv(m)
            }
          };
        }
        case "escaped": {
          const h = await s.detectOverflow(i, {
            ...f,
            altBoundary: !0
          }), m = tv(h, u.floating);
          return {
            data: {
              escapedOffsets: m,
              escaped: nv(m)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Jv = /* @__PURE__ */ new Set(["left", "top"]);
async function c1(l, i) {
  const {
    placement: u,
    platform: s,
    elements: o
  } = l, f = await (s.isRTL == null ? void 0 : s.isRTL(o.floating)), h = Jn(u), m = Aa(u), v = Zt(u) === "y", p = Jv.has(h) ? -1 : 1, b = f && v ? -1 : 1, E = pn(i, l);
  let {
    mainAxis: R,
    crossAxis: O,
    alignmentAxis: w
  } = typeof E == "number" ? {
    mainAxis: E,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: E.mainAxis || 0,
    crossAxis: E.crossAxis || 0,
    alignmentAxis: E.alignmentAxis
  };
  return m && typeof w == "number" && (O = m === "end" ? w * -1 : w), v ? {
    x: O * b,
    y: R * p
  } : {
    x: R * p,
    y: O * b
  };
}
const o1 = function(l) {
  return l === void 0 && (l = 0), {
    name: "offset",
    options: l,
    async fn(i) {
      var u, s;
      const {
        x: o,
        y: f,
        placement: h,
        middlewareData: m
      } = i, v = await c1(i, l);
      return h === ((u = m.offset) == null ? void 0 : u.placement) && (s = m.arrow) != null && s.alignmentOffset ? {} : {
        x: o + v.x,
        y: f + v.y,
        data: {
          ...v,
          placement: h
        }
      };
    }
  };
}, f1 = function(l) {
  return l === void 0 && (l = {}), {
    name: "shift",
    options: l,
    async fn(i) {
      const {
        x: u,
        y: s,
        placement: o,
        platform: f
      } = i, {
        mainAxis: h = !0,
        crossAxis: m = !1,
        limiter: v = {
          fn: (B) => {
            let {
              x: Y,
              y: X
            } = B;
            return {
              x: Y,
              y: X
            };
          }
        },
        ...p
      } = pn(l, i), b = {
        x: u,
        y: s
      }, E = await f.detectOverflow(i, p), R = Zt(o), O = Co(R);
      let w = b[O], T = b[R];
      const z = (B, Y) => Zv(Y + E[B === "y" ? "top" : "left"], Y, Y - E[B === "y" ? "bottom" : "right"]);
      h && (w = z(O, w)), m && (T = z(R, T));
      const _ = v.fn({
        ...i,
        [O]: w,
        [R]: T
      });
      return {
        ..._,
        data: {
          x: _.x - u,
          y: _.y - s,
          enabled: {
            [O]: h,
            [R]: m
          }
        }
      };
    }
  };
}, d1 = function(l) {
  return l === void 0 && (l = {}), {
    options: l,
    fn(i) {
      var u, s;
      const {
        x: o,
        y: f,
        placement: h,
        rects: m,
        middlewareData: v
      } = i, {
        offset: p = 0,
        mainAxis: b = !0,
        crossAxis: E = !0
      } = pn(l, i), R = {
        x: o,
        y: f
      }, O = Zt(h), w = Co(O);
      let T = R[w], z = R[O];
      const _ = pn(p, i), B = typeof _ == "number" ? {
        mainAxis: _,
        crossAxis: 0
      } : {
        mainAxis: (u = _.mainAxis) != null ? u : 0,
        crossAxis: (s = _.crossAxis) != null ? s : 0
      };
      if (b) {
        const H = w === "y" ? "height" : "width", U = m.reference[w] - m.floating[H] + B.mainAxis, K = m.reference[w] + m.reference[H] - B.mainAxis;
        T < U ? T = U : T > K && (T = K);
      }
      if (E) {
        var Y, X;
        const H = w === "y" ? "width" : "height", U = Jv.has(Jn(h)), K = m.reference[O] - m.floating[H] + (U && ((Y = v.offset) == null ? void 0 : Y[O]) || 0) + (U ? 0 : B.crossAxis), W = m.reference[O] + m.reference[H] + (U ? 0 : ((X = v.offset) == null ? void 0 : X[O]) || 0) - (U ? B.crossAxis : 0);
        z < K ? z = K : z > W && (z = W);
      }
      return {
        [w]: T,
        [O]: z
      };
    }
  };
}, h1 = function(l) {
  return l === void 0 && (l = {}), {
    name: "size",
    options: l,
    async fn(i) {
      const {
        placement: u,
        rects: s,
        platform: o,
        elements: f
      } = i, {
        apply: h = () => {
        },
        ...m
      } = pn(l, i), v = await o.detectOverflow(i, m), p = Jn(u), b = Aa(u), E = Zt(u) === "y", {
        width: R,
        height: O
      } = s.floating;
      let w, T;
      p === "top" || p === "bottom" ? (w = p, T = b === (await (o.isRTL == null ? void 0 : o.isRTL(f.floating)) ? "start" : "end") ? "left" : "right") : (T = p, w = b === "end" ? "top" : "bottom");
      const z = O - v.top - v.bottom, _ = R - v.left - v.right, B = Kn(O - v[w], z), Y = Kn(R - v[T], _), X = i.middlewareData.shift, H = !X;
      let U = B, K = Y;
      X != null && X.enabled.x && (K = _), X != null && X.enabled.y && (U = z), H && !b && (E ? K = R - 2 * hn(v.left, v.right) : U = O - 2 * hn(v.top, v.bottom)), await h({
        ...i,
        availableWidth: K,
        availableHeight: U
      });
      const W = await o.getDimensions(f.floating);
      return R !== W.width || O !== W.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function xu() {
  return typeof window < "u";
}
function Ta(l) {
  return Wv(l) ? (l.nodeName || "").toLowerCase() : "#document";
}
function ft(l) {
  var i;
  return (l == null || (i = l.ownerDocument) == null ? void 0 : i.defaultView) || window;
}
function gn(l) {
  var i;
  return (i = (Wv(l) ? l.ownerDocument : l.document) || window.document) == null ? void 0 : i.documentElement;
}
function Wv(l) {
  return xu() ? l instanceof Node || l instanceof ft(l).Node : !1;
}
function Kt(l) {
  return xu() ? l instanceof Element || l instanceof ft(l).Element : !1;
}
function Wn(l) {
  return xu() ? l instanceof HTMLElement || l instanceof ft(l).HTMLElement : !1;
}
function lv(l) {
  return !xu() || typeof ShadowRoot > "u" ? !1 : l instanceof ShadowRoot || l instanceof ft(l).ShadowRoot;
}
function Su(l) {
  const {
    overflow: i,
    overflowX: u,
    overflowY: s,
    display: o
  } = Jt(l);
  return /auto|scroll|overlay|hidden|clip/.test(i + s + u) && o !== "inline" && o !== "contents";
}
function m1(l) {
  return /^(table|td|th)$/.test(Ta(l));
}
function Eu(l) {
  try {
    if (l.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return l.matches(":modal");
  } catch {
    return !1;
  }
}
const v1 = /transform|translate|scale|rotate|perspective|filter/, p1 = /paint|layout|strict|content/, bl = (l) => !!l && l !== "none";
let Yc;
function zo(l) {
  const i = Kt(l) ? Jt(l) : l;
  return bl(i.transform) || bl(i.translate) || bl(i.scale) || bl(i.rotate) || bl(i.perspective) || !_o() && (bl(i.backdropFilter) || bl(i.filter)) || v1.test(i.willChange || "") || p1.test(i.contain || "");
}
function g1(l) {
  let i = Rl(l);
  for (; Wn(i) && !Ni(i); ) {
    if (zo(i))
      return i;
    if (Eu(i))
      return null;
    i = Rl(i);
  }
  return null;
}
function _o() {
  return Yc == null && (Yc = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Yc;
}
function Ni(l) {
  return /^(html|body|#document)$/.test(Ta(l));
}
function Jt(l) {
  return ft(l).getComputedStyle(l);
}
function Au(l) {
  return Kt(l) ? {
    scrollLeft: l.scrollLeft,
    scrollTop: l.scrollTop
  } : {
    scrollLeft: l.scrollX,
    scrollTop: l.scrollY
  };
}
function Rl(l) {
  if (Ta(l) === "html")
    return l;
  const i = (
    // Step into the shadow DOM of the parent of a slotted node.
    l.assignedSlot || // DOM Element detected.
    l.parentNode || // ShadowRoot detected.
    lv(l) && l.host || // Fallback.
    gn(l)
  );
  return lv(i) ? i.host : i;
}
function Fv(l) {
  const i = Rl(l);
  return Ni(i) ? (l.ownerDocument || l).body : Wn(i) && Su(i) ? i : Fv(i);
}
function zi(l, i, u) {
  var s;
  i === void 0 && (i = []), u === void 0 && (u = !0);
  const o = Fv(l), f = o === ((s = l.ownerDocument) == null ? void 0 : s.body), h = ft(o);
  if (f) {
    const m = co(h);
    return i.concat(h, h.visualViewport || [], Su(o) ? o : [], m && u ? zi(m) : []);
  } else
    return i.concat(o, zi(o, [], u));
}
function co(l) {
  return l.parent && Object.getPrototypeOf(l.parent) ? l.frameElement : null;
}
function $v(l) {
  const i = Jt(l);
  let u = parseFloat(i.width) || 0, s = parseFloat(i.height) || 0;
  const o = Wn(l), f = o ? l.offsetWidth : u, h = o ? l.offsetHeight : s, m = cu(u) !== f || cu(s) !== h;
  return m && (u = f, s = h), {
    width: u,
    height: s,
    $: m
  };
}
function jo(l) {
  return Kt(l) ? l : l.contextElement;
}
function ba(l) {
  const i = jo(l);
  if (!Wn(i))
    return mn(1);
  const u = i.getBoundingClientRect(), {
    width: s,
    height: o,
    $: f
  } = $v(i);
  let h = (f ? cu(u.width) : u.width) / s, m = (f ? cu(u.height) : u.height) / o;
  return (!h || !Number.isFinite(h)) && (h = 1), (!m || !Number.isFinite(m)) && (m = 1), {
    x: h,
    y: m
  };
}
const y1 = /* @__PURE__ */ mn(0);
function Pv(l) {
  const i = ft(l);
  return !_o() || !i.visualViewport ? y1 : {
    x: i.visualViewport.offsetLeft,
    y: i.visualViewport.offsetTop
  };
}
function b1(l, i, u) {
  return i === void 0 && (i = !1), !!u && i && u === ft(l);
}
function Ol(l, i, u, s) {
  i === void 0 && (i = !1), u === void 0 && (u = !1);
  const o = l.getBoundingClientRect(), f = jo(l);
  let h = mn(1);
  i && (s ? Kt(s) && (h = ba(s)) : h = ba(l));
  const m = b1(f, u, s) ? Pv(f) : mn(0);
  let v = (o.left + m.x) / h.x, p = (o.top + m.y) / h.y, b = o.width / h.x, E = o.height / h.y;
  if (f && s) {
    const R = ft(f), O = Kt(s) ? ft(s) : s;
    let w = R, T = co(w);
    for (; T && O !== w; ) {
      const z = ba(T), _ = T.getBoundingClientRect(), B = Jt(T), Y = _.left + (T.clientLeft + parseFloat(B.paddingLeft)) * z.x, X = _.top + (T.clientTop + parseFloat(B.paddingTop)) * z.y;
      v *= z.x, p *= z.y, b *= z.x, E *= z.y, v += Y, p += X, w = ft(T), T = co(w);
    }
  }
  return fu({
    width: b,
    height: E,
    x: v,
    y: p
  });
}
function Tu(l, i) {
  const u = Au(l).scrollLeft;
  return i ? i.left + u : Ol(gn(l)).left + u;
}
function Iv(l, i) {
  const u = l.getBoundingClientRect(), s = u.left + i.scrollLeft - Tu(l, u), o = u.top + i.scrollTop;
  return {
    x: s,
    y: o
  };
}
function x1(l) {
  let {
    elements: i,
    rect: u,
    offsetParent: s,
    strategy: o
  } = l;
  const f = o === "fixed", h = gn(s), m = i ? Eu(i.floating) : !1;
  if (s === h || m && f)
    return u;
  let v = {
    scrollLeft: 0,
    scrollTop: 0
  }, p = mn(1);
  const b = mn(0), E = Wn(s);
  if ((E || !f) && ((Ta(s) !== "body" || Su(h)) && (v = Au(s)), E)) {
    const O = Ol(s);
    p = ba(s), b.x = O.x + s.clientLeft, b.y = O.y + s.clientTop;
  }
  const R = h && !E && !f ? Iv(h, v) : mn(0);
  return {
    width: u.width * p.x,
    height: u.height * p.y,
    x: u.x * p.x - v.scrollLeft * p.x + b.x + R.x,
    y: u.y * p.y - v.scrollTop * p.y + b.y + R.y
  };
}
function S1(l) {
  return l.getClientRects ? Array.from(l.getClientRects()) : [];
}
function E1(l) {
  const i = Au(l), u = l.ownerDocument.body, s = hn(l.scrollWidth, l.clientWidth, u.scrollWidth, u.clientWidth), o = hn(l.scrollHeight, l.clientHeight, u.scrollHeight, u.clientHeight);
  let f = -i.scrollLeft + Tu(l);
  const h = -i.scrollTop;
  return Jt(u).direction === "rtl" && (f += hn(l.clientWidth, u.clientWidth) - s), {
    width: s,
    height: o,
    x: f,
    y: h
  };
}
const A1 = 25;
function T1(l, i, u) {
  u === void 0 && (u = "viewport");
  const s = u === "layoutViewport", o = ft(l), f = gn(l), h = o.visualViewport;
  let m = f.clientWidth, v = f.clientHeight, p = 0, b = 0;
  if (h) {
    const R = !_o() || i === "fixed";
    s ? R || (p = -h.offsetLeft, b = -h.offsetTop) : (m = h.width, v = h.height, R && (p = h.offsetLeft, b = h.offsetTop));
  }
  if (Tu(f) <= 0) {
    const R = f.ownerDocument, O = R.body, w = getComputedStyle(O), T = R.compatMode === "CSS1Compat" && parseFloat(w.marginLeft) + parseFloat(w.marginRight) || 0, z = Math.abs(f.clientWidth - O.clientWidth - T), _ = getComputedStyle(f).scrollbarGutter === "stable both-edges" ? z / 2 : z;
    _ <= A1 && (m -= _);
  }
  return {
    width: m,
    height: v,
    x: p,
    y: b
  };
}
function w1(l, i) {
  const u = Ol(l, !0, i === "fixed"), s = u.top + l.clientTop, o = u.left + l.clientLeft, f = ba(l), h = l.clientWidth * f.x, m = l.clientHeight * f.y, v = o * f.x, p = s * f.y;
  return {
    width: h,
    height: m,
    x: v,
    y: p
  };
}
function av(l, i, u) {
  let s;
  if (i === "viewport" || i === "layoutViewport")
    s = T1(l, u, i);
  else if (i === "document")
    s = E1(gn(l));
  else if (Kt(i))
    s = w1(i, u);
  else {
    const o = Pv(l);
    s = {
      x: i.x - o.x,
      y: i.y - o.y,
      width: i.width,
      height: i.height
    };
  }
  return fu(s);
}
function R1(l, i) {
  const u = i.get(l);
  if (u)
    return u;
  let s = zi(l, [], !1).filter((m) => Kt(m) && Ta(m) !== "body"), o = null;
  const f = Jt(l).position === "fixed";
  let h = f ? Rl(l) : l;
  for (; Kt(h) && !Ni(h); ) {
    const m = Jt(h), v = zo(h), p = o ? o.position : f ? "fixed" : "";
    !v && (p === "fixed" || p === "absolute" && m.position === "static") ? s = s.filter((E) => E !== h) : o = m, h = Rl(h);
  }
  return i.set(l, s), s;
}
function O1(l) {
  let {
    element: i,
    boundary: u,
    rootBoundary: s,
    strategy: o
  } = l;
  const h = [...u === "clippingAncestors" ? Eu(i) ? [] : R1(i, this._c) : [].concat(u), s], m = av(i, h[0], o);
  let v = m.top, p = m.right, b = m.bottom, E = m.left;
  for (let R = 1; R < h.length; R++) {
    const O = av(i, h[R], o);
    v = hn(O.top, v), p = Kn(O.right, p), b = Kn(O.bottom, b), E = hn(O.left, E);
  }
  return {
    width: p - E,
    height: b - v,
    x: E,
    y: v
  };
}
function M1(l) {
  const {
    width: i,
    height: u
  } = $v(l);
  return {
    width: i,
    height: u
  };
}
function C1(l, i, u) {
  const s = Wn(i), o = gn(i), f = u === "fixed", h = Ol(l, !0, f, i);
  let m = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const v = mn(0);
  if ((s || !f) && ((Ta(i) !== "body" || Su(o)) && (m = Au(i)), s)) {
    const R = Ol(i, !0, f, i);
    v.x = R.x + i.clientLeft, v.y = R.y + i.clientTop;
  }
  !s && o && (v.x = Tu(o));
  const p = o && !s && !f ? Iv(o, m) : mn(0), b = h.left + m.scrollLeft - v.x - p.x, E = h.top + m.scrollTop - v.y - p.y;
  return {
    x: b,
    y: E,
    width: h.width,
    height: h.height
  };
}
function Xc(l) {
  return Jt(l).position === "static";
}
function iv(l, i) {
  if (!Wn(l) || Jt(l).position === "fixed")
    return null;
  if (i)
    return i(l);
  let u = l.offsetParent;
  return gn(l) === u && (u = u.ownerDocument.body), u;
}
function ep(l, i) {
  const u = ft(l);
  if (Eu(l))
    return u;
  if (!Wn(l)) {
    let o = Rl(l);
    for (; o && !Ni(o); ) {
      if (Kt(o) && !Xc(o))
        return o;
      o = Rl(o);
    }
    return u;
  }
  let s = iv(l, i);
  for (; s && m1(s) && Xc(s); )
    s = iv(s, i);
  return s && Ni(s) && Xc(s) && !zo(s) ? u : s || g1(l) || u;
}
const D1 = async function(l) {
  const i = this.getOffsetParent || ep, u = this.getDimensions, s = await u(l.floating);
  return {
    reference: C1(l.reference, await i(l.floating), l.strategy),
    floating: {
      x: 0,
      y: 0,
      width: s.width,
      height: s.height
    }
  };
};
function N1(l) {
  return Jt(l).direction === "rtl";
}
const z1 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: x1,
  getDocumentElement: gn,
  getClippingRect: O1,
  getOffsetParent: ep,
  getElementRects: D1,
  getClientRects: S1,
  getDimensions: M1,
  getScale: ba,
  isElement: Kt,
  isRTL: N1
};
function tp(l, i) {
  return l.x === i.x && l.y === i.y && l.width === i.width && l.height === i.height;
}
function _1(l, i, u) {
  let s = null, o;
  const f = gn(l);
  function h() {
    var b;
    clearTimeout(o), (b = s) == null || b.disconnect(), s = null;
  }
  function m(b, E) {
    b === void 0 && (b = !1), E === void 0 && (E = 1), h();
    const R = l.getBoundingClientRect(), {
      left: O,
      top: w,
      width: T,
      height: z
    } = R;
    if (b || i(), !T || !z)
      return;
    const _ = Jr(w), B = Jr(f.clientWidth - (O + T)), Y = Jr(f.clientHeight - (w + z)), X = Jr(O), U = {
      rootMargin: -_ + "px " + -B + "px " + -Y + "px " + -X + "px",
      threshold: hn(0, Kn(1, E)) || 1
    };
    let K = !0;
    function W(J) {
      const F = J[0].intersectionRatio;
      if (!tp(R, l.getBoundingClientRect()))
        return m();
      if (F !== E) {
        if (!K)
          return m();
        F ? m(!1, F) : o = setTimeout(() => {
          m(!1, 1e-7);
        }, 1e3);
      }
      K = !1;
    }
    try {
      s = new IntersectionObserver(W, {
        ...U,
        // Handle <iframe>s
        root: f.ownerDocument
      });
    } catch {
      s = new IntersectionObserver(W, U);
    }
    s.observe(l);
  }
  const v = ft(l), p = () => m(u);
  return v.addEventListener("resize", p), m(!0), () => {
    v.removeEventListener("resize", p), h();
  };
}
function j1(l, i, u, s) {
  s === void 0 && (s = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: f = !0,
    elementResize: h = typeof ResizeObserver == "function",
    layoutShift: m = typeof IntersectionObserver == "function",
    animationFrame: v = !1
  } = s, p = jo(l), b = o || f ? [...p ? zi(p) : [], ...i ? zi(i) : []] : [];
  b.forEach((_) => {
    o && _.addEventListener("scroll", u), f && _.addEventListener("resize", u);
  });
  const E = p && m ? _1(p, u, f) : null;
  let R = -1, O = null;
  h && (O = new ResizeObserver((_) => {
    let [B] = _;
    B && B.target === p && O && i && (O.unobserve(i), cancelAnimationFrame(R), R = requestAnimationFrame(() => {
      var Y;
      (Y = O) == null || Y.observe(i);
    })), u();
  }), p && !v && O.observe(p), i && O.observe(i));
  let w, T = v ? Ol(l) : null;
  v && z();
  function z() {
    const _ = Ol(l);
    T && !tp(T, _) && u(), T = _, w = requestAnimationFrame(z);
  }
  return u(), () => {
    var _;
    b.forEach((B) => {
      o && B.removeEventListener("scroll", u), f && B.removeEventListener("resize", u);
    }), E == null || E(), (_ = O) == null || _.disconnect(), O = null, v && cancelAnimationFrame(w);
  };
}
const U1 = o1, H1 = f1, L1 = u1, B1 = h1, q1 = s1, rv = r1, k1 = d1, G1 = (l, i, u) => {
  const s = /* @__PURE__ */ new Map(), o = u ?? {}, f = {
    ...z1,
    ...o.platform,
    _c: s
  };
  return i1(l, i, {
    ...o,
    platform: f
  });
};
var V1 = typeof document < "u", Y1 = function() {
}, au = V1 ? S.useLayoutEffect : Y1;
function du(l, i) {
  if (l === i)
    return !0;
  if (typeof l != typeof i)
    return !1;
  if (typeof l == "function" && l.toString() === i.toString())
    return !0;
  let u, s, o;
  if (l && i && typeof l == "object") {
    if (Array.isArray(l)) {
      if (u = l.length, u !== i.length) return !1;
      for (s = u; s-- !== 0; )
        if (!du(l[s], i[s]))
          return !1;
      return !0;
    }
    if (o = Object.keys(l), u = o.length, u !== Object.keys(i).length)
      return !1;
    for (s = u; s-- !== 0; )
      if (!{}.hasOwnProperty.call(i, o[s]))
        return !1;
    for (s = u; s-- !== 0; ) {
      const f = o[s];
      if (!(f === "_owner" && l.$$typeof) && !du(l[f], i[f]))
        return !1;
    }
    return !0;
  }
  return l !== l && i !== i;
}
function np(l) {
  return typeof window > "u" ? 1 : (l.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function uv(l, i) {
  const u = np(l);
  return Math.round(i * u) / u;
}
function Qc(l) {
  const i = S.useRef(l);
  return au(() => {
    i.current = l;
  }), i;
}
function X1(l) {
  l === void 0 && (l = {});
  const {
    placement: i = "bottom",
    strategy: u = "absolute",
    middleware: s = [],
    platform: o,
    elements: {
      reference: f,
      floating: h
    } = {},
    transform: m = !0,
    whileElementsMounted: v,
    open: p
  } = l, [b, E] = S.useState({
    x: 0,
    y: 0,
    strategy: u,
    placement: i,
    middlewareData: {},
    isPositioned: !1
  }), [R, O] = S.useState(s);
  du(R, s) || O(s);
  const [w, T] = S.useState(null), [z, _] = S.useState(null), B = S.useCallback((Z) => {
    Z !== U.current && (U.current = Z, T(Z));
  }, []), Y = S.useCallback((Z) => {
    Z !== K.current && (K.current = Z, _(Z));
  }, []), X = f || w, H = h || z, U = S.useRef(null), K = S.useRef(null), W = S.useRef(b), J = v != null, F = Qc(v), xe = Qc(o), Oe = Qc(p), de = S.useCallback(() => {
    if (!U.current || !K.current)
      return;
    const Z = {
      placement: i,
      strategy: u,
      middleware: R
    };
    xe.current && (Z.platform = xe.current), G1(U.current, K.current, Z).then((le) => {
      const A = {
        ...le,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: Oe.current !== !1
      };
      ve.current && !du(W.current, A) && (W.current = A, vn.flushSync(() => {
        E(A);
      }));
    });
  }, [R, i, u, xe, Oe]);
  au(() => {
    p === !1 && W.current.isPositioned && (W.current.isPositioned = !1, E((Z) => ({
      ...Z,
      isPositioned: !1
    })));
  }, [p]);
  const ve = S.useRef(!1);
  au(() => (ve.current = !0, () => {
    ve.current = !1;
  }), []), au(() => {
    if (X && (U.current = X), H && (K.current = H), X && H) {
      if (F.current)
        return F.current(X, H, de);
      de();
    }
  }, [X, H, de, F, J]);
  const ge = S.useMemo(() => ({
    reference: U,
    floating: K,
    setReference: B,
    setFloating: Y
  }), [B, Y]), k = S.useMemo(() => ({
    reference: X,
    floating: H
  }), [X, H]), te = S.useMemo(() => {
    const Z = {
      position: u,
      left: 0,
      top: 0
    };
    if (!k.floating)
      return Z;
    const le = uv(k.floating, b.x), A = uv(k.floating, b.y);
    return m ? {
      ...Z,
      transform: "translate(" + le + "px, " + A + "px)",
      ...np(k.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: u,
      left: le,
      top: A
    };
  }, [u, m, k.floating, b.x, b.y]);
  return S.useMemo(() => ({
    ...b,
    update: de,
    refs: ge,
    elements: k,
    floatingStyles: te
  }), [b, de, ge, k, te]);
}
const Q1 = (l) => {
  function i(u) {
    return {}.hasOwnProperty.call(u, "current");
  }
  return {
    name: "arrow",
    options: l,
    fn(u) {
      const {
        element: s,
        padding: o
      } = typeof l == "function" ? l(u) : l;
      return s && i(s) ? s.current != null ? rv({
        element: s.current,
        padding: o
      }).fn(u) : {} : s ? rv({
        element: s,
        padding: o
      }).fn(u) : {};
    }
  };
}, Z1 = (l, i) => {
  const u = U1(l);
  return {
    name: u.name,
    fn: u.fn,
    options: [l, i]
  };
}, K1 = (l, i) => {
  const u = H1(l);
  return {
    name: u.name,
    fn: u.fn,
    options: [l, i]
  };
}, J1 = (l, i) => ({
  fn: k1(l).fn,
  options: [l, i]
}), W1 = (l, i) => {
  const u = L1(l);
  return {
    name: u.name,
    fn: u.fn,
    options: [l, i]
  };
}, F1 = (l, i) => {
  const u = B1(l);
  return {
    name: u.name,
    fn: u.fn,
    options: [l, i]
  };
}, $1 = (l, i) => {
  const u = q1(l);
  return {
    name: u.name,
    fn: u.fn,
    options: [l, i]
  };
}, P1 = (l, i) => {
  const u = Q1(l);
  return {
    name: u.name,
    fn: u.fn,
    options: [l, i]
  };
};
var I1 = "Arrow", lp = S.forwardRef((l, i) => {
  const { children: u, width: s = 10, height: o = 5, ...f } = l;
  return /* @__PURE__ */ y.jsx(
    dt.svg,
    {
      ...f,
      ref: i,
      width: s,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: l.asChild ? u : /* @__PURE__ */ y.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
lp.displayName = I1;
var ex = lp;
function tx(l) {
  const [i, u] = S.useState(void 0);
  return wl(() => {
    if (l) {
      u({ width: l.offsetWidth, height: l.offsetHeight });
      const s = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const f = o[0];
        let h, m;
        if ("borderBoxSize" in f) {
          const v = f.borderBoxSize, p = Array.isArray(v) ? v[0] : v;
          h = p.inlineSize, m = p.blockSize;
        } else
          h = l.offsetWidth, m = l.offsetHeight;
        u({ width: h, height: m });
      });
      return s.observe(l, { box: "border-box" }), () => s.unobserve(l);
    } else
      u(void 0);
  }, [l]), i;
}
var Uo = "Popper", [ap, ip] = Oo(Uo), [nx, rp] = ap(Uo), up = (l) => {
  const { __scopePopper: i, children: u } = l, [s, o] = S.useState(null);
  return /* @__PURE__ */ y.jsx(nx, { scope: i, anchor: s, onAnchorChange: o, children: u });
};
up.displayName = Uo;
var sp = "PopperAnchor", cp = S.forwardRef(
  (l, i) => {
    const { __scopePopper: u, virtualRef: s, ...o } = l, f = rp(sp, u), h = S.useRef(null), m = Lt(i, h);
    return S.useEffect(() => {
      f.onAnchorChange((s == null ? void 0 : s.current) || h.current);
    }), s ? null : /* @__PURE__ */ y.jsx(dt.div, { ...o, ref: m });
  }
);
cp.displayName = sp;
var Ho = "PopperContent", [lx, ax] = ap(Ho), op = S.forwardRef(
  (l, i) => {
    var _e, Ee, je, Me, ht, yn;
    const {
      __scopePopper: u,
      side: s = "bottom",
      sideOffset: o = 0,
      align: f = "center",
      alignOffset: h = 0,
      arrowPadding: m = 0,
      avoidCollisions: v = !0,
      collisionBoundary: p = [],
      collisionPadding: b = 0,
      sticky: E = "partial",
      hideWhenDetached: R = !1,
      updatePositionStrategy: O = "optimized",
      onPlaced: w,
      ...T
    } = l, z = rp(Ho, u), [_, B] = S.useState(null), Y = Lt(i, (rt) => B(rt)), [X, H] = S.useState(null), U = tx(X), K = (U == null ? void 0 : U.width) ?? 0, W = (U == null ? void 0 : U.height) ?? 0, J = s + (f !== "center" ? "-" + f : ""), F = typeof b == "number" ? b : { top: 0, right: 0, bottom: 0, left: 0, ...b }, xe = Array.isArray(p) ? p : [p], Oe = xe.length > 0, de = {
      padding: F,
      boundary: xe.filter(rx),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: Oe
    }, { refs: ve, floatingStyles: ge, placement: k, isPositioned: te, middlewareData: Z } = X1({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: J,
      whileElementsMounted: (...rt) => j1(...rt, {
        animationFrame: O === "always"
      }),
      elements: {
        reference: z.anchor
      },
      middleware: [
        Z1({ mainAxis: o + W, alignmentAxis: h }),
        v && K1({
          mainAxis: !0,
          crossAxis: !1,
          limiter: E === "partial" ? J1() : void 0,
          ...de
        }),
        v && W1({ ...de }),
        F1({
          ...de,
          apply: ({ elements: rt, rects: Fn, availableWidth: Dl, availableHeight: bn }) => {
            const { width: Ca, height: Nl } = Fn.reference, xn = rt.floating.style;
            xn.setProperty("--radix-popper-available-width", `${Dl}px`), xn.setProperty("--radix-popper-available-height", `${bn}px`), xn.setProperty("--radix-popper-anchor-width", `${Ca}px`), xn.setProperty("--radix-popper-anchor-height", `${Nl}px`);
          }
        }),
        X && P1({ element: X, padding: m }),
        ux({ arrowWidth: K, arrowHeight: W }),
        R && $1({ strategy: "referenceHidden", ...de })
      ]
    }), [le, A] = hp(k), Q = Zn(w);
    wl(() => {
      te && (Q == null || Q());
    }, [te, Q]);
    const re = (_e = Z.arrow) == null ? void 0 : _e.x, ae = (Ee = Z.arrow) == null ? void 0 : Ee.y, $ = ((je = Z.arrow) == null ? void 0 : je.centerOffset) !== 0, [oe, se] = S.useState();
    return wl(() => {
      _ && se(window.getComputedStyle(_).zIndex);
    }, [_]), /* @__PURE__ */ y.jsx(
      "div",
      {
        ref: ve.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...ge,
          transform: te ? ge.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: oe,
          "--radix-popper-transform-origin": [
            (Me = Z.transformOrigin) == null ? void 0 : Me.x,
            (ht = Z.transformOrigin) == null ? void 0 : ht.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((yn = Z.hide) == null ? void 0 : yn.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: l.dir,
        children: /* @__PURE__ */ y.jsx(
          lx,
          {
            scope: u,
            placedSide: le,
            onArrowChange: H,
            arrowX: re,
            arrowY: ae,
            shouldHideArrow: $,
            children: /* @__PURE__ */ y.jsx(
              dt.div,
              {
                "data-side": le,
                "data-align": A,
                ...T,
                ref: Y,
                style: {
                  ...T.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: te ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
op.displayName = Ho;
var fp = "PopperArrow", ix = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, dp = S.forwardRef(function(i, u) {
  const { __scopePopper: s, ...o } = i, f = ax(fp, s), h = ix[f.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ y.jsx(
      "span",
      {
        ref: f.onArrowChange,
        style: {
          position: "absolute",
          left: f.arrowX,
          top: f.arrowY,
          [h]: 0,
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
        children: /* @__PURE__ */ y.jsx(
          ex,
          {
            ...o,
            ref: u,
            style: {
              ...o.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
dp.displayName = fp;
function rx(l) {
  return l !== null;
}
var ux = (l) => ({
  name: "transformOrigin",
  options: l,
  fn(i) {
    var z, _, B;
    const { placement: u, rects: s, middlewareData: o } = i, h = ((z = o.arrow) == null ? void 0 : z.centerOffset) !== 0, m = h ? 0 : l.arrowWidth, v = h ? 0 : l.arrowHeight, [p, b] = hp(u), E = { start: "0%", center: "50%", end: "100%" }[b], R = (((_ = o.arrow) == null ? void 0 : _.x) ?? 0) + m / 2, O = (((B = o.arrow) == null ? void 0 : B.y) ?? 0) + v / 2;
    let w = "", T = "";
    return p === "bottom" ? (w = h ? E : `${R}px`, T = `${-v}px`) : p === "top" ? (w = h ? E : `${R}px`, T = `${s.floating.height + v}px`) : p === "right" ? (w = `${-v}px`, T = h ? E : `${O}px`) : p === "left" && (w = `${s.floating.width + v}px`, T = h ? E : `${O}px`), { data: { x: w, y: T } };
  }
});
function hp(l) {
  const [i, u = "center"] = l.split("-");
  return [i, u];
}
var sx = up, cx = cp, ox = op, fx = dp, dx = "Portal", Lo = S.forwardRef((l, i) => {
  var m;
  const { container: u, ...s } = l, [o, f] = S.useState(!1);
  wl(() => f(!0), []);
  const h = u || o && ((m = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : m.body);
  return h ? Mb.createPortal(/* @__PURE__ */ y.jsx(dt.div, { ...s, ref: i }), h) : null;
});
Lo.displayName = dx;
function hx(l, i) {
  return S.useReducer((u, s) => i[u][s] ?? u, l);
}
var wa = (l) => {
  const { present: i, children: u } = l, s = mx(i), o = typeof u == "function" ? u({ present: s.isPresent }) : S.Children.only(u), f = Lt(s.ref, vx(o));
  return typeof u == "function" || s.isPresent ? S.cloneElement(o, { ref: f }) : null;
};
wa.displayName = "Presence";
function mx(l) {
  const [i, u] = S.useState(), s = S.useRef({}), o = S.useRef(l), f = S.useRef("none"), h = l ? "mounted" : "unmounted", [m, v] = hx(h, {
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
  return S.useEffect(() => {
    const p = Wr(s.current);
    f.current = m === "mounted" ? p : "none";
  }, [m]), wl(() => {
    const p = s.current, b = o.current;
    if (b !== l) {
      const R = f.current, O = Wr(p);
      l ? v("MOUNT") : O === "none" || (p == null ? void 0 : p.display) === "none" ? v("UNMOUNT") : v(b && R !== O ? "ANIMATION_OUT" : "UNMOUNT"), o.current = l;
    }
  }, [l, v]), wl(() => {
    if (i) {
      let p;
      const b = i.ownerDocument.defaultView ?? window, E = (O) => {
        const T = Wr(s.current).includes(O.animationName);
        if (O.target === i && T && (v("ANIMATION_END"), !o.current)) {
          const z = i.style.animationFillMode;
          i.style.animationFillMode = "forwards", p = b.setTimeout(() => {
            i.style.animationFillMode === "forwards" && (i.style.animationFillMode = z);
          });
        }
      }, R = (O) => {
        O.target === i && (f.current = Wr(s.current));
      };
      return i.addEventListener("animationstart", R), i.addEventListener("animationcancel", E), i.addEventListener("animationend", E), () => {
        b.clearTimeout(p), i.removeEventListener("animationstart", R), i.removeEventListener("animationcancel", E), i.removeEventListener("animationend", E);
      };
    } else
      v("ANIMATION_END");
  }, [i, v]), {
    isPresent: ["mounted", "unmountSuspended"].includes(m),
    ref: S.useCallback((p) => {
      p && (s.current = getComputedStyle(p)), u(p);
    }, [])
  };
}
function Wr(l) {
  return (l == null ? void 0 : l.animationName) || "none";
}
function vx(l) {
  var s, o;
  let i = (s = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : s.get, u = i && "isReactWarning" in i && i.isReactWarning;
  return u ? l.ref : (i = (o = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : o.get, u = i && "isReactWarning" in i && i.isReactWarning, u ? l.props.ref : l.props.ref || l.ref);
}
function mp({
  prop: l,
  defaultProp: i,
  onChange: u = () => {
  }
}) {
  const [s, o] = px({ defaultProp: i, onChange: u }), f = l !== void 0, h = f ? l : s, m = Zn(u), v = S.useCallback(
    (p) => {
      if (f) {
        const E = typeof p == "function" ? p(l) : p;
        E !== l && m(E);
      } else
        o(p);
    },
    [f, l, o, m]
  );
  return [h, v];
}
function px({
  defaultProp: l,
  onChange: i
}) {
  const u = S.useState(l), [s] = u, o = S.useRef(s), f = Zn(i);
  return S.useEffect(() => {
    o.current !== s && (f(s), o.current = s);
  }, [s, o, f]), u;
}
var gx = "VisuallyHidden", vp = S.forwardRef(
  (l, i) => /* @__PURE__ */ y.jsx(
    dt.span,
    {
      ...l,
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
        ...l.style
      }
    }
  )
);
vp.displayName = gx;
var yx = vp, [wu] = Oo("Tooltip", [
  ip
]), Ru = ip(), pp = "TooltipProvider", bx = 700, oo = "tooltip.open", [xx, Bo] = wu(pp), gp = (l) => {
  const {
    __scopeTooltip: i,
    delayDuration: u = bx,
    skipDelayDuration: s = 300,
    disableHoverableContent: o = !1,
    children: f
  } = l, [h, m] = S.useState(!0), v = S.useRef(!1), p = S.useRef(0);
  return S.useEffect(() => {
    const b = p.current;
    return () => window.clearTimeout(b);
  }, []), /* @__PURE__ */ y.jsx(
    xx,
    {
      scope: i,
      isOpenDelayed: h,
      delayDuration: u,
      onOpen: S.useCallback(() => {
        window.clearTimeout(p.current), m(!1);
      }, []),
      onClose: S.useCallback(() => {
        window.clearTimeout(p.current), p.current = window.setTimeout(
          () => m(!0),
          s
        );
      }, [s]),
      isPointerInTransitRef: v,
      onPointerInTransitChange: S.useCallback((b) => {
        v.current = b;
      }, []),
      disableHoverableContent: o,
      children: f
    }
  );
};
gp.displayName = pp;
var Ou = "Tooltip", [Sx, Ui] = wu(Ou), yp = (l) => {
  const {
    __scopeTooltip: i,
    children: u,
    open: s,
    defaultOpen: o = !1,
    onOpenChange: f,
    disableHoverableContent: h,
    delayDuration: m
  } = l, v = Bo(Ou, l.__scopeTooltip), p = Ru(i), [b, E] = S.useState(null), R = lu(), O = S.useRef(0), w = h ?? v.disableHoverableContent, T = m ?? v.delayDuration, z = S.useRef(!1), [_ = !1, B] = mp({
    prop: s,
    defaultProp: o,
    onChange: (K) => {
      K ? (v.onOpen(), document.dispatchEvent(new CustomEvent(oo))) : v.onClose(), f == null || f(K);
    }
  }), Y = S.useMemo(() => _ ? z.current ? "delayed-open" : "instant-open" : "closed", [_]), X = S.useCallback(() => {
    window.clearTimeout(O.current), O.current = 0, z.current = !1, B(!0);
  }, [B]), H = S.useCallback(() => {
    window.clearTimeout(O.current), O.current = 0, B(!1);
  }, [B]), U = S.useCallback(() => {
    window.clearTimeout(O.current), O.current = window.setTimeout(() => {
      z.current = !0, B(!0), O.current = 0;
    }, T);
  }, [T, B]);
  return S.useEffect(() => () => {
    O.current && (window.clearTimeout(O.current), O.current = 0);
  }, []), /* @__PURE__ */ y.jsx(sx, { ...p, children: /* @__PURE__ */ y.jsx(
    Sx,
    {
      scope: i,
      contentId: R,
      open: _,
      stateAttribute: Y,
      trigger: b,
      onTriggerChange: E,
      onTriggerEnter: S.useCallback(() => {
        v.isOpenDelayed ? U() : X();
      }, [v.isOpenDelayed, U, X]),
      onTriggerLeave: S.useCallback(() => {
        w ? H() : (window.clearTimeout(O.current), O.current = 0);
      }, [H, w]),
      onOpen: X,
      onClose: H,
      disableHoverableContent: w,
      children: u
    }
  ) });
};
yp.displayName = Ou;
var fo = "TooltipTrigger", bp = S.forwardRef(
  (l, i) => {
    const { __scopeTooltip: u, ...s } = l, o = Ui(fo, u), f = Bo(fo, u), h = Ru(u), m = S.useRef(null), v = Lt(i, m, o.onTriggerChange), p = S.useRef(!1), b = S.useRef(!1), E = S.useCallback(() => p.current = !1, []);
    return S.useEffect(() => () => document.removeEventListener("pointerup", E), [E]), /* @__PURE__ */ y.jsx(cx, { asChild: !0, ...h, children: /* @__PURE__ */ y.jsx(
      dt.button,
      {
        "aria-describedby": o.open ? o.contentId : void 0,
        "data-state": o.stateAttribute,
        ...s,
        ref: v,
        onPointerMove: ot(l.onPointerMove, (R) => {
          R.pointerType !== "touch" && !b.current && !f.isPointerInTransitRef.current && (o.onTriggerEnter(), b.current = !0);
        }),
        onPointerLeave: ot(l.onPointerLeave, () => {
          o.onTriggerLeave(), b.current = !1;
        }),
        onPointerDown: ot(l.onPointerDown, () => {
          p.current = !0, document.addEventListener("pointerup", E, { once: !0 });
        }),
        onFocus: ot(l.onFocus, () => {
          p.current || o.onOpen();
        }),
        onBlur: ot(l.onBlur, o.onClose),
        onClick: ot(l.onClick, o.onClose)
      }
    ) });
  }
);
bp.displayName = fo;
var qo = "TooltipPortal", [Ex, Ax] = wu(qo, {
  forceMount: void 0
}), xp = (l) => {
  const { __scopeTooltip: i, forceMount: u, children: s, container: o } = l, f = Ui(qo, i);
  return /* @__PURE__ */ y.jsx(Ex, { scope: i, forceMount: u, children: /* @__PURE__ */ y.jsx(wa, { present: u || f.open, children: /* @__PURE__ */ y.jsx(Lo, { asChild: !0, container: o, children: s }) }) });
};
xp.displayName = qo;
var Ea = "TooltipContent", Sp = S.forwardRef(
  (l, i) => {
    const u = Ax(Ea, l.__scopeTooltip), { forceMount: s = u.forceMount, side: o = "top", ...f } = l, h = Ui(Ea, l.__scopeTooltip);
    return /* @__PURE__ */ y.jsx(wa, { present: s || h.open, children: h.disableHoverableContent ? /* @__PURE__ */ y.jsx(Ep, { side: o, ...f, ref: i }) : /* @__PURE__ */ y.jsx(Tx, { side: o, ...f, ref: i }) });
  }
), Tx = S.forwardRef((l, i) => {
  const u = Ui(Ea, l.__scopeTooltip), s = Bo(Ea, l.__scopeTooltip), o = S.useRef(null), f = Lt(i, o), [h, m] = S.useState(null), { trigger: v, onClose: p } = u, b = o.current, { onPointerInTransitChange: E } = s, R = S.useCallback(() => {
    m(null), E(!1);
  }, [E]), O = S.useCallback(
    (w, T) => {
      const z = w.currentTarget, _ = { x: w.clientX, y: w.clientY }, B = Ox(_, z.getBoundingClientRect()), Y = Mx(_, B), X = Cx(T.getBoundingClientRect()), H = Nx([...Y, ...X]);
      m(H), E(!0);
    },
    [E]
  );
  return S.useEffect(() => () => R(), [R]), S.useEffect(() => {
    if (v && b) {
      const w = (z) => O(z, b), T = (z) => O(z, v);
      return v.addEventListener("pointerleave", w), b.addEventListener("pointerleave", T), () => {
        v.removeEventListener("pointerleave", w), b.removeEventListener("pointerleave", T);
      };
    }
  }, [v, b, O, R]), S.useEffect(() => {
    if (h) {
      const w = (T) => {
        const z = T.target, _ = { x: T.clientX, y: T.clientY }, B = (v == null ? void 0 : v.contains(z)) || (b == null ? void 0 : b.contains(z)), Y = !Dx(_, h);
        B ? R() : Y && (R(), p());
      };
      return document.addEventListener("pointermove", w), () => document.removeEventListener("pointermove", w);
    }
  }, [v, b, h, p, R]), /* @__PURE__ */ y.jsx(Ep, { ...l, ref: f });
}), [wx, Rx] = wu(Ou, { isInside: !1 }), Ep = S.forwardRef(
  (l, i) => {
    const {
      __scopeTooltip: u,
      children: s,
      "aria-label": o,
      onEscapeKeyDown: f,
      onPointerDownOutside: h,
      ...m
    } = l, v = Ui(Ea, u), p = Ru(u), { onClose: b } = v;
    return S.useEffect(() => (document.addEventListener(oo, b), () => document.removeEventListener(oo, b)), [b]), S.useEffect(() => {
      if (v.trigger) {
        const E = (R) => {
          const O = R.target;
          O != null && O.contains(v.trigger) && b();
        };
        return window.addEventListener("scroll", E, { capture: !0 }), () => window.removeEventListener("scroll", E, { capture: !0 });
      }
    }, [v.trigger, b]), /* @__PURE__ */ y.jsx(
      Mo,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: f,
        onPointerDownOutside: h,
        onFocusOutside: (E) => E.preventDefault(),
        onDismiss: b,
        children: /* @__PURE__ */ y.jsxs(
          ox,
          {
            "data-state": v.stateAttribute,
            ...p,
            ...m,
            ref: i,
            style: {
              ...m.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ y.jsx(Yv, { children: s }),
              /* @__PURE__ */ y.jsx(wx, { scope: u, isInside: !0, children: /* @__PURE__ */ y.jsx(yx, { id: v.contentId, role: "tooltip", children: o || s }) })
            ]
          }
        )
      }
    );
  }
);
Sp.displayName = Ea;
var Ap = "TooltipArrow", Tp = S.forwardRef(
  (l, i) => {
    const { __scopeTooltip: u, ...s } = l, o = Ru(u);
    return Rx(
      Ap,
      u
    ).isInside ? null : /* @__PURE__ */ y.jsx(fx, { ...o, ...s, ref: i });
  }
);
Tp.displayName = Ap;
function Ox(l, i) {
  const u = Math.abs(i.top - l.y), s = Math.abs(i.bottom - l.y), o = Math.abs(i.right - l.x), f = Math.abs(i.left - l.x);
  switch (Math.min(u, s, o, f)) {
    case f:
      return "left";
    case o:
      return "right";
    case u:
      return "top";
    case s:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function Mx(l, i, u = 5) {
  const s = [];
  switch (i) {
    case "top":
      s.push(
        { x: l.x - u, y: l.y + u },
        { x: l.x + u, y: l.y + u }
      );
      break;
    case "bottom":
      s.push(
        { x: l.x - u, y: l.y - u },
        { x: l.x + u, y: l.y - u }
      );
      break;
    case "left":
      s.push(
        { x: l.x + u, y: l.y - u },
        { x: l.x + u, y: l.y + u }
      );
      break;
    case "right":
      s.push(
        { x: l.x - u, y: l.y - u },
        { x: l.x - u, y: l.y + u }
      );
      break;
  }
  return s;
}
function Cx(l) {
  const { top: i, right: u, bottom: s, left: o } = l;
  return [
    { x: o, y: i },
    { x: u, y: i },
    { x: u, y: s },
    { x: o, y: s }
  ];
}
function Dx(l, i) {
  const { x: u, y: s } = l;
  let o = !1;
  for (let f = 0, h = i.length - 1; f < i.length; h = f++) {
    const m = i[f].x, v = i[f].y, p = i[h].x, b = i[h].y;
    v > s != b > s && u < (p - m) * (s - v) / (b - v) + m && (o = !o);
  }
  return o;
}
function Nx(l) {
  const i = l.slice();
  return i.sort((u, s) => u.x < s.x ? -1 : u.x > s.x ? 1 : u.y < s.y ? -1 : u.y > s.y ? 1 : 0), zx(i);
}
function zx(l) {
  if (l.length <= 1) return l.slice();
  const i = [];
  for (let s = 0; s < l.length; s++) {
    const o = l[s];
    for (; i.length >= 2; ) {
      const f = i[i.length - 1], h = i[i.length - 2];
      if ((f.x - h.x) * (o.y - h.y) >= (f.y - h.y) * (o.x - h.x)) i.pop();
      else break;
    }
    i.push(o);
  }
  i.pop();
  const u = [];
  for (let s = l.length - 1; s >= 0; s--) {
    const o = l[s];
    for (; u.length >= 2; ) {
      const f = u[u.length - 1], h = u[u.length - 2];
      if ((f.x - h.x) * (o.y - h.y) >= (f.y - h.y) * (o.x - h.x)) u.pop();
      else break;
    }
    u.push(o);
  }
  return u.pop(), i.length === 1 && u.length === 1 && i[0].x === u[0].x && i[0].y === u[0].y ? i : i.concat(u);
}
var _x = gp, jx = yp, Ux = bp, Hx = xp, Lx = Sp, Bx = Tp;
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qx = (l) => l.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), wp = (...l) => l.filter((i, u, s) => !!i && i.trim() !== "" && s.indexOf(i) === u).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var kx = {
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
const Gx = S.forwardRef(
  ({
    color: l = "currentColor",
    size: i = 24,
    strokeWidth: u = 2,
    absoluteStrokeWidth: s,
    className: o = "",
    children: f,
    iconNode: h,
    ...m
  }, v) => S.createElement(
    "svg",
    {
      ref: v,
      ...kx,
      width: i,
      height: i,
      stroke: l,
      strokeWidth: s ? Number(u) * 24 / Number(i) : u,
      className: wp("lucide", o),
      ...m
    },
    [
      ...h.map(([p, b]) => S.createElement(p, b)),
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
const ze = (l, i) => {
  const u = S.forwardRef(
    ({ className: s, ...o }, f) => S.createElement(Gx, {
      ref: f,
      iconNode: i,
      className: wp(`lucide-${qx(l)}`, s),
      ...o
    })
  );
  return u.displayName = `${l}`, u;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fr = ze("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vx = ze("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yx = ze("BookOpen", [
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
const Rp = ze("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xx = ze("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qx = ze("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zx = ze("CircleDot", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kx = ze("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jx = ze("Command", [
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
const Op = ze("FileInput", [
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
const ko = ze("FilePenLine", [
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
const Wx = ze("History", [
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
const Fx = ze("House", [
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
const Mp = ze("LibraryBig", [
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
const Cp = ze("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dp = ze("Map", [
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
const $x = ze("PanelLeftClose", [
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
const Px = ze("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ix = ze("ScanLine", [
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
const ho = ze("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const eS = ze("Settings2", [
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
const Np = ze("Sparkles", [
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
const zp = ze("TriangleAlert", [
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
const _p = ze("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), tS = [
  ["studio", "Policy Studio", ko],
  ["data", "Data dashboard", Dp],
  ["library", "Legal library", Mp],
  ["activity", "Activity", Wx]
];
function nS() {
  return /* @__PURE__ */ y.jsxs(_x, { delayDuration: 450, children: [
    /* @__PURE__ */ y.jsxs("div", { className: "sidebar-brand", children: [
      /* @__PURE__ */ y.jsxs("a", { className: "brand", href: "/", "aria-label": "RuleLab, home page", children: [
        /* @__PURE__ */ y.jsx("span", { className: "brand-icon", "aria-hidden": "true" }),
        /* @__PURE__ */ y.jsxs("div", { className: "brand-copy", children: [
          /* @__PURE__ */ y.jsx("span", { className: "brand-name", children: "RuleLab" }),
          /* @__PURE__ */ y.jsx("span", { className: "brand-edition", children: "INDONESIA" })
        ] })
      ] }),
      /* @__PURE__ */ y.jsx("button", { id: "sidebar-toggle", className: "sidebar-toggle", "data-ux": "sidebar", "aria-controls": "workspace-sidebar", "aria-expanded": "true", "aria-label": "Collapse sidebar", children: /* @__PURE__ */ y.jsx($x, { size: 17, "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ y.jsx("div", { className: "nav-label", children: "WORKSPACE" }),
    /* @__PURE__ */ y.jsxs("button", { className: "workspace-home-link", "data-view": "home", "aria-label": "Workspace overview", children: [
      /* @__PURE__ */ y.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ y.jsx(Fx, { size: 17, "aria-hidden": "true" }) }),
      /* @__PURE__ */ y.jsx("span", { className: "home-label", children: "Overview" })
    ] }),
    /* @__PURE__ */ y.jsx("nav", { id: "nav", "aria-label": "Main navigation", children: tS.map(([l, i, u], s) => /* @__PURE__ */ y.jsxs("div", { className: s === 1 ? "nav-section-start" : "nav-item", children: [
      s === 1 && /* @__PURE__ */ y.jsx("div", { className: "nav-label", children: "SOURCES & ACTIVITY" }),
      /* @__PURE__ */ y.jsxs(jx, { children: [
        /* @__PURE__ */ y.jsx(Ux, { asChild: !0, children: /* @__PURE__ */ y.jsxs("button", { "data-view": l, "aria-label": i, children: [
          /* @__PURE__ */ y.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ y.jsx(u, { size: 17 }) }),
          /* @__PURE__ */ y.jsx("span", { className: "nav-title", children: i })
        ] }) }),
        /* @__PURE__ */ y.jsx(Hx, { children: /* @__PURE__ */ y.jsxs(Lx, { className: "fx-tooltip", side: "right", sideOffset: 12, children: [
          i,
          /* @__PURE__ */ y.jsx(Bx, {})
        ] }) })
      ] })
    ] }, l)) }),
    /* @__PURE__ */ y.jsxs("div", { className: "sidebar-bottom", children: [
      /* @__PURE__ */ y.jsx("div", { className: "nav-label", children: "RESOURCES & SYSTEM" }),
      /* @__PURE__ */ y.jsxs("a", { className: "settings-link", href: "/guide", target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ y.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ y.jsx(Mp, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ y.jsx("span", { className: "settings-label", children: "User guide" })
      ] }),
      /* @__PURE__ */ y.jsxs("button", { className: "settings-link", "data-action": "audit", "aria-label": "Audit workspace", children: [
        /* @__PURE__ */ y.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ y.jsx(Ix, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ y.jsx("span", { className: "settings-label", children: "Audit workspace" })
      ] }),
      /* @__PURE__ */ y.jsxs("button", { id: "settings-btn", className: "settings-link", "aria-label": "Integration settings", children: [
        /* @__PURE__ */ y.jsx("span", { className: "nav-icon", "aria-hidden": "true", children: /* @__PURE__ */ y.jsx(eS, { size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ y.jsx("span", { className: "settings-label", children: "Integration settings" })
      ] })
    ] })
  ] });
}
var Zc = "focusScope.autoFocusOnMount", Kc = "focusScope.autoFocusOnUnmount", sv = { bubbles: !1, cancelable: !0 }, lS = "FocusScope", jp = S.forwardRef((l, i) => {
  const {
    loop: u = !1,
    trapped: s = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: f,
    ...h
  } = l, [m, v] = S.useState(null), p = Zn(o), b = Zn(f), E = S.useRef(null), R = Lt(i, (T) => v(T)), O = S.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  S.useEffect(() => {
    if (s) {
      let T = function(Y) {
        if (O.paused || !m) return;
        const X = Y.target;
        m.contains(X) ? E.current = X : Qn(E.current, { select: !0 });
      }, z = function(Y) {
        if (O.paused || !m) return;
        const X = Y.relatedTarget;
        X !== null && (m.contains(X) || Qn(E.current, { select: !0 }));
      }, _ = function(Y) {
        if (document.activeElement === document.body)
          for (const H of Y)
            H.removedNodes.length > 0 && Qn(m);
      };
      document.addEventListener("focusin", T), document.addEventListener("focusout", z);
      const B = new MutationObserver(_);
      return m && B.observe(m, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", T), document.removeEventListener("focusout", z), B.disconnect();
      };
    }
  }, [s, m, O.paused]), S.useEffect(() => {
    if (m) {
      ov.add(O);
      const T = document.activeElement;
      if (!m.contains(T)) {
        const _ = new CustomEvent(Zc, sv);
        m.addEventListener(Zc, p), m.dispatchEvent(_), _.defaultPrevented || (aS(cS(Up(m)), { select: !0 }), document.activeElement === T && Qn(m));
      }
      return () => {
        m.removeEventListener(Zc, p), setTimeout(() => {
          const _ = new CustomEvent(Kc, sv);
          m.addEventListener(Kc, b), m.dispatchEvent(_), _.defaultPrevented || Qn(T ?? document.body, { select: !0 }), m.removeEventListener(Kc, b), ov.remove(O);
        }, 0);
      };
    }
  }, [m, p, b, O]);
  const w = S.useCallback(
    (T) => {
      if (!u && !s || O.paused) return;
      const z = T.key === "Tab" && !T.altKey && !T.ctrlKey && !T.metaKey, _ = document.activeElement;
      if (z && _) {
        const B = T.currentTarget, [Y, X] = iS(B);
        Y && X ? !T.shiftKey && _ === X ? (T.preventDefault(), u && Qn(Y, { select: !0 })) : T.shiftKey && _ === Y && (T.preventDefault(), u && Qn(X, { select: !0 })) : _ === B && T.preventDefault();
      }
    },
    [u, s, O.paused]
  );
  return /* @__PURE__ */ y.jsx(dt.div, { tabIndex: -1, ...h, ref: R, onKeyDown: w });
});
jp.displayName = lS;
function aS(l, { select: i = !1 } = {}) {
  const u = document.activeElement;
  for (const s of l)
    if (Qn(s, { select: i }), document.activeElement !== u) return;
}
function iS(l) {
  const i = Up(l), u = cv(i, l), s = cv(i.reverse(), l);
  return [u, s];
}
function Up(l) {
  const i = [], u = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (s) => {
      const o = s.tagName === "INPUT" && s.type === "hidden";
      return s.disabled || s.hidden || o ? NodeFilter.FILTER_SKIP : s.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; u.nextNode(); ) i.push(u.currentNode);
  return i;
}
function cv(l, i) {
  for (const u of l)
    if (!rS(u, { upTo: i })) return u;
}
function rS(l, { upTo: i }) {
  if (getComputedStyle(l).visibility === "hidden") return !0;
  for (; l; ) {
    if (i !== void 0 && l === i) return !1;
    if (getComputedStyle(l).display === "none") return !0;
    l = l.parentElement;
  }
  return !1;
}
function uS(l) {
  return l instanceof HTMLInputElement && "select" in l;
}
function Qn(l, { select: i = !1 } = {}) {
  if (l && l.focus) {
    const u = document.activeElement;
    l.focus({ preventScroll: !0 }), l !== u && uS(l) && i && l.select();
  }
}
var ov = sS();
function sS() {
  let l = [];
  return {
    add(i) {
      const u = l[0];
      i !== u && (u == null || u.pause()), l = fv(l, i), l.unshift(i);
    },
    remove(i) {
      var u;
      l = fv(l, i), (u = l[0]) == null || u.resume();
    }
  };
}
function fv(l, i) {
  const u = [...l], s = u.indexOf(i);
  return s !== -1 && u.splice(s, 1), u;
}
function cS(l) {
  return l.filter((i) => i.tagName !== "A");
}
var Jc = 0;
function oS() {
  S.useEffect(() => {
    const l = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", l[0] ?? dv()), document.body.insertAdjacentElement("beforeend", l[1] ?? dv()), Jc++, () => {
      Jc === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((i) => i.remove()), Jc--;
    };
  }, []);
}
function dv() {
  const l = document.createElement("span");
  return l.setAttribute("data-radix-focus-guard", ""), l.tabIndex = 0, l.style.outline = "none", l.style.opacity = "0", l.style.position = "fixed", l.style.pointerEvents = "none", l;
}
var Qt = function() {
  return Qt = Object.assign || function(i) {
    for (var u, s = 1, o = arguments.length; s < o; s++) {
      u = arguments[s];
      for (var f in u) Object.prototype.hasOwnProperty.call(u, f) && (i[f] = u[f]);
    }
    return i;
  }, Qt.apply(this, arguments);
};
function Hp(l, i) {
  var u = {};
  for (var s in l) Object.prototype.hasOwnProperty.call(l, s) && i.indexOf(s) < 0 && (u[s] = l[s]);
  if (l != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, s = Object.getOwnPropertySymbols(l); o < s.length; o++)
      i.indexOf(s[o]) < 0 && Object.prototype.propertyIsEnumerable.call(l, s[o]) && (u[s[o]] = l[s[o]]);
  return u;
}
function fS(l, i, u) {
  if (u || arguments.length === 2) for (var s = 0, o = i.length, f; s < o; s++)
    (f || !(s in i)) && (f || (f = Array.prototype.slice.call(i, 0, s)), f[s] = i[s]);
  return l.concat(f || Array.prototype.slice.call(i));
}
var iu = "right-scroll-bar-position", ru = "width-before-scroll-bar", dS = "with-scroll-bars-hidden", hS = "--removed-body-scroll-bar-size";
function Wc(l, i) {
  return typeof l == "function" ? l(i) : l && (l.current = i), l;
}
function mS(l, i) {
  var u = S.useState(function() {
    return {
      // value
      value: l,
      // last callback
      callback: i,
      // "memoized" public interface
      facade: {
        get current() {
          return u.value;
        },
        set current(s) {
          var o = u.value;
          o !== s && (u.value = s, u.callback(s, o));
        }
      }
    };
  })[0];
  return u.callback = i, u.facade;
}
var vS = typeof window < "u" ? S.useLayoutEffect : S.useEffect, hv = /* @__PURE__ */ new WeakMap();
function pS(l, i) {
  var u = mS(null, function(s) {
    return l.forEach(function(o) {
      return Wc(o, s);
    });
  });
  return vS(function() {
    var s = hv.get(u);
    if (s) {
      var o = new Set(s), f = new Set(l), h = u.current;
      o.forEach(function(m) {
        f.has(m) || Wc(m, null);
      }), f.forEach(function(m) {
        o.has(m) || Wc(m, h);
      });
    }
    hv.set(u, l);
  }, [l]), u;
}
function gS(l) {
  return l;
}
function yS(l, i) {
  i === void 0 && (i = gS);
  var u = [], s = !1, o = {
    read: function() {
      if (s)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return u.length ? u[u.length - 1] : l;
    },
    useMedium: function(f) {
      var h = i(f, s);
      return u.push(h), function() {
        u = u.filter(function(m) {
          return m !== h;
        });
      };
    },
    assignSyncMedium: function(f) {
      for (s = !0; u.length; ) {
        var h = u;
        u = [], h.forEach(f);
      }
      u = {
        push: function(m) {
          return f(m);
        },
        filter: function() {
          return u;
        }
      };
    },
    assignMedium: function(f) {
      s = !0;
      var h = [];
      if (u.length) {
        var m = u;
        u = [], m.forEach(f), h = u;
      }
      var v = function() {
        var b = h;
        h = [], b.forEach(f);
      }, p = function() {
        return Promise.resolve().then(v);
      };
      p(), u = {
        push: function(b) {
          h.push(b), p();
        },
        filter: function(b) {
          return h = h.filter(b), u;
        }
      };
    }
  };
  return o;
}
function bS(l) {
  l === void 0 && (l = {});
  var i = yS(null);
  return i.options = Qt({ async: !0, ssr: !1 }, l), i;
}
var Lp = function(l) {
  var i = l.sideCar, u = Hp(l, ["sideCar"]);
  if (!i)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var s = i.read();
  if (!s)
    throw new Error("Sidecar medium not found");
  return S.createElement(s, Qt({}, u));
};
Lp.isSideCarExport = !0;
function xS(l, i) {
  return l.useMedium(i), Lp;
}
var Bp = bS(), Fc = function() {
}, Mu = S.forwardRef(function(l, i) {
  var u = S.useRef(null), s = S.useState({
    onScrollCapture: Fc,
    onWheelCapture: Fc,
    onTouchMoveCapture: Fc
  }), o = s[0], f = s[1], h = l.forwardProps, m = l.children, v = l.className, p = l.removeScrollBar, b = l.enabled, E = l.shards, R = l.sideCar, O = l.noRelative, w = l.noIsolation, T = l.inert, z = l.allowPinchZoom, _ = l.as, B = _ === void 0 ? "div" : _, Y = l.gapMode, X = Hp(l, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), H = R, U = pS([u, i]), K = Qt(Qt({}, X), o);
  return S.createElement(
    S.Fragment,
    null,
    b && S.createElement(H, { sideCar: Bp, removeScrollBar: p, shards: E, noRelative: O, noIsolation: w, inert: T, setCallbacks: f, allowPinchZoom: !!z, lockRef: u, gapMode: Y }),
    h ? S.cloneElement(S.Children.only(m), Qt(Qt({}, K), { ref: U })) : S.createElement(B, Qt({}, K, { className: v, ref: U }), m)
  );
});
Mu.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Mu.classNames = {
  fullWidth: ru,
  zeroRight: iu
};
var SS = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function ES() {
  if (!document)
    return null;
  var l = document.createElement("style");
  l.type = "text/css";
  var i = SS();
  return i && l.setAttribute("nonce", i), l;
}
function AS(l, i) {
  l.styleSheet ? l.styleSheet.cssText = i : l.appendChild(document.createTextNode(i));
}
function TS(l) {
  var i = document.head || document.getElementsByTagName("head")[0];
  i.appendChild(l);
}
var wS = function() {
  var l = 0, i = null;
  return {
    add: function(u) {
      l == 0 && (i = ES()) && (AS(i, u), TS(i)), l++;
    },
    remove: function() {
      l--, !l && i && (i.parentNode && i.parentNode.removeChild(i), i = null);
    }
  };
}, RS = function() {
  var l = wS();
  return function(i, u) {
    S.useEffect(function() {
      return l.add(i), function() {
        l.remove();
      };
    }, [i && u]);
  };
}, qp = function() {
  var l = RS(), i = function(u) {
    var s = u.styles, o = u.dynamic;
    return l(s, o), null;
  };
  return i;
}, OS = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, $c = function(l) {
  return parseInt(l || "", 10) || 0;
}, MS = function(l) {
  var i = window.getComputedStyle(document.body), u = i[l === "padding" ? "paddingLeft" : "marginLeft"], s = i[l === "padding" ? "paddingTop" : "marginTop"], o = i[l === "padding" ? "paddingRight" : "marginRight"];
  return [$c(u), $c(s), $c(o)];
}, CS = function(l) {
  if (l === void 0 && (l = "margin"), typeof window > "u")
    return OS;
  var i = MS(l), u = document.documentElement.clientWidth, s = window.innerWidth;
  return {
    left: i[0],
    top: i[1],
    right: i[2],
    gap: Math.max(0, s - u + i[2] - i[0])
  };
}, DS = qp(), xa = "data-scroll-locked", NS = function(l, i, u, s) {
  var o = l.left, f = l.top, h = l.right, m = l.gap;
  return u === void 0 && (u = "margin"), `
  .`.concat(dS, ` {
   overflow: hidden `).concat(s, `;
   padding-right: `).concat(m, "px ").concat(s, `;
  }
  body[`).concat(xa, `] {
    overflow: hidden `).concat(s, `;
    overscroll-behavior: contain;
    `).concat([
    i && "position: relative ".concat(s, ";"),
    u === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(f, `px;
    padding-right: `).concat(h, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(m, "px ").concat(s, `;
    `),
    u === "padding" && "padding-right: ".concat(m, "px ").concat(s, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(iu, ` {
    right: `).concat(m, "px ").concat(s, `;
  }
  
  .`).concat(ru, ` {
    margin-right: `).concat(m, "px ").concat(s, `;
  }
  
  .`).concat(iu, " .").concat(iu, ` {
    right: 0 `).concat(s, `;
  }
  
  .`).concat(ru, " .").concat(ru, ` {
    margin-right: 0 `).concat(s, `;
  }
  
  body[`).concat(xa, `] {
    `).concat(hS, ": ").concat(m, `px;
  }
`);
}, mv = function() {
  var l = parseInt(document.body.getAttribute(xa) || "0", 10);
  return isFinite(l) ? l : 0;
}, zS = function() {
  S.useEffect(function() {
    return document.body.setAttribute(xa, (mv() + 1).toString()), function() {
      var l = mv() - 1;
      l <= 0 ? document.body.removeAttribute(xa) : document.body.setAttribute(xa, l.toString());
    };
  }, []);
}, _S = function(l) {
  var i = l.noRelative, u = l.noImportant, s = l.gapMode, o = s === void 0 ? "margin" : s;
  zS();
  var f = S.useMemo(function() {
    return CS(o);
  }, [o]);
  return S.createElement(DS, { styles: NS(f, !i, o, u ? "" : "!important") });
}, mo = !1;
if (typeof window < "u")
  try {
    var $r = Object.defineProperty({}, "passive", {
      get: function() {
        return mo = !0, !0;
      }
    });
    window.addEventListener("test", $r, $r), window.removeEventListener("test", $r, $r);
  } catch {
    mo = !1;
  }
var ha = mo ? { passive: !1 } : !1, jS = function(l) {
  return l.tagName === "TEXTAREA";
}, kp = function(l, i) {
  if (!(l instanceof Element))
    return !1;
  var u = window.getComputedStyle(l);
  return (
    // not-not-scrollable
    u[i] !== "hidden" && // contains scroll inside self
    !(u.overflowY === u.overflowX && !jS(l) && u[i] === "visible")
  );
}, US = function(l) {
  return kp(l, "overflowY");
}, HS = function(l) {
  return kp(l, "overflowX");
}, vv = function(l, i) {
  var u = i.ownerDocument, s = i;
  do {
    typeof ShadowRoot < "u" && s instanceof ShadowRoot && (s = s.host);
    var o = Gp(l, s);
    if (o) {
      var f = Vp(l, s), h = f[1], m = f[2];
      if (h > m)
        return !0;
    }
    s = s.parentNode;
  } while (s && s !== u.body);
  return !1;
}, LS = function(l) {
  var i = l.scrollTop, u = l.scrollHeight, s = l.clientHeight;
  return [
    i,
    u,
    s
  ];
}, BS = function(l) {
  var i = l.scrollLeft, u = l.scrollWidth, s = l.clientWidth;
  return [
    i,
    u,
    s
  ];
}, Gp = function(l, i) {
  return l === "v" ? US(i) : HS(i);
}, Vp = function(l, i) {
  return l === "v" ? LS(i) : BS(i);
}, qS = function(l, i) {
  return l === "h" && i === "rtl" ? -1 : 1;
}, kS = function(l, i, u, s, o) {
  var f = qS(l, window.getComputedStyle(i).direction), h = f * s, m = u.target, v = i.contains(m), p = !1, b = h > 0, E = 0, R = 0;
  do {
    if (!m)
      break;
    var O = Vp(l, m), w = O[0], T = O[1], z = O[2], _ = T - z - f * w;
    (w || _) && Gp(l, m) && (E += _, R += w);
    var B = m.parentNode;
    m = B && B.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? B.host : B;
  } while (
    // portaled content
    !v && m !== document.body || // self content
    v && (i.contains(m) || i === m)
  );
  return (b && Math.abs(E) < 1 || !b && Math.abs(R) < 1) && (p = !0), p;
}, Pr = function(l) {
  return "changedTouches" in l ? [l.changedTouches[0].clientX, l.changedTouches[0].clientY] : [0, 0];
}, pv = function(l) {
  return [l.deltaX, l.deltaY];
}, gv = function(l) {
  return l && "current" in l ? l.current : l;
}, GS = function(l, i) {
  return l[0] === i[0] && l[1] === i[1];
}, VS = function(l) {
  return `
  .block-interactivity-`.concat(l, ` {pointer-events: none;}
  .allow-interactivity-`).concat(l, ` {pointer-events: all;}
`);
}, YS = 0, ma = [];
function XS(l) {
  var i = S.useRef([]), u = S.useRef([0, 0]), s = S.useRef(), o = S.useState(YS++)[0], f = S.useState(qp)[0], h = S.useRef(l);
  S.useEffect(function() {
    h.current = l;
  }, [l]), S.useEffect(function() {
    if (l.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var T = fS([l.lockRef.current], (l.shards || []).map(gv), !0).filter(Boolean);
      return T.forEach(function(z) {
        return z.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), T.forEach(function(z) {
          return z.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [l.inert, l.lockRef.current, l.shards]);
  var m = S.useCallback(function(T, z) {
    if ("touches" in T && T.touches.length === 2 || T.type === "wheel" && T.ctrlKey)
      return !h.current.allowPinchZoom;
    var _ = Pr(T), B = u.current, Y = "deltaX" in T ? T.deltaX : B[0] - _[0], X = "deltaY" in T ? T.deltaY : B[1] - _[1], H, U = T.target, K = Math.abs(Y) > Math.abs(X) ? "h" : "v";
    if ("touches" in T && K === "h" && U.type === "range")
      return !1;
    var W = window.getSelection(), J = W && W.anchorNode, F = J ? J === U || J.contains(U) : !1;
    if (F)
      return !1;
    var xe = vv(K, U);
    if (!xe)
      return !0;
    if (xe ? H = K : (H = K === "v" ? "h" : "v", xe = vv(K, U)), !xe)
      return !1;
    if (!s.current && "changedTouches" in T && (Y || X) && (s.current = H), !H)
      return !0;
    var Oe = s.current || H;
    return kS(Oe, z, T, Oe === "h" ? Y : X);
  }, []), v = S.useCallback(function(T) {
    var z = T;
    if (!(!ma.length || ma[ma.length - 1] !== f)) {
      var _ = "deltaY" in z ? pv(z) : Pr(z), B = i.current.filter(function(H) {
        return H.name === z.type && (H.target === z.target || z.target === H.shadowParent) && GS(H.delta, _);
      })[0];
      if (B && B.should) {
        z.cancelable && z.preventDefault();
        return;
      }
      if (!B) {
        var Y = (h.current.shards || []).map(gv).filter(Boolean).filter(function(H) {
          return H.contains(z.target);
        }), X = Y.length > 0 ? m(z, Y[0]) : !h.current.noIsolation;
        X && z.cancelable && z.preventDefault();
      }
    }
  }, []), p = S.useCallback(function(T, z, _, B) {
    var Y = { name: T, delta: z, target: _, should: B, shadowParent: QS(_) };
    i.current.push(Y), setTimeout(function() {
      i.current = i.current.filter(function(X) {
        return X !== Y;
      });
    }, 1);
  }, []), b = S.useCallback(function(T) {
    u.current = Pr(T), s.current = void 0;
  }, []), E = S.useCallback(function(T) {
    p(T.type, pv(T), T.target, m(T, l.lockRef.current));
  }, []), R = S.useCallback(function(T) {
    p(T.type, Pr(T), T.target, m(T, l.lockRef.current));
  }, []);
  S.useEffect(function() {
    return ma.push(f), l.setCallbacks({
      onScrollCapture: E,
      onWheelCapture: E,
      onTouchMoveCapture: R
    }), document.addEventListener("wheel", v, ha), document.addEventListener("touchmove", v, ha), document.addEventListener("touchstart", b, ha), function() {
      ma = ma.filter(function(T) {
        return T !== f;
      }), document.removeEventListener("wheel", v, ha), document.removeEventListener("touchmove", v, ha), document.removeEventListener("touchstart", b, ha);
    };
  }, []);
  var O = l.removeScrollBar, w = l.inert;
  return S.createElement(
    S.Fragment,
    null,
    w ? S.createElement(f, { styles: VS(o) }) : null,
    O ? S.createElement(_S, { noRelative: l.noRelative, gapMode: l.gapMode }) : null
  );
}
function QS(l) {
  for (var i = null; l !== null; )
    l instanceof ShadowRoot && (i = l.host, l = l.host), l = l.parentNode;
  return i;
}
const ZS = xS(Bp, XS);
var Yp = S.forwardRef(function(l, i) {
  return S.createElement(Mu, Qt({}, l, { ref: i, sideCar: ZS }));
});
Yp.classNames = Mu.classNames;
var KS = function(l) {
  if (typeof document > "u")
    return null;
  var i = Array.isArray(l) ? l[0] : l;
  return i.ownerDocument.body;
}, va = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap(), eu = {}, Pc = 0, Xp = function(l) {
  return l && (l.host || Xp(l.parentNode));
}, JS = function(l, i) {
  return i.map(function(u) {
    if (l.contains(u))
      return u;
    var s = Xp(u);
    return s && l.contains(s) ? s : (console.error("aria-hidden", u, "in not contained inside", l, ". Doing nothing"), null);
  }).filter(function(u) {
    return !!u;
  });
}, WS = function(l, i, u, s) {
  var o = JS(i, Array.isArray(l) ? l : [l]);
  eu[u] || (eu[u] = /* @__PURE__ */ new WeakMap());
  var f = eu[u], h = [], m = /* @__PURE__ */ new Set(), v = new Set(o), p = function(E) {
    !E || m.has(E) || (m.add(E), p(E.parentNode));
  };
  o.forEach(p);
  var b = function(E) {
    !E || v.has(E) || Array.prototype.forEach.call(E.children, function(R) {
      if (m.has(R))
        b(R);
      else
        try {
          var O = R.getAttribute(s), w = O !== null && O !== "false", T = (va.get(R) || 0) + 1, z = (f.get(R) || 0) + 1;
          va.set(R, T), f.set(R, z), h.push(R), T === 1 && w && Ir.set(R, !0), z === 1 && R.setAttribute(u, "true"), w || R.setAttribute(s, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", R, _);
        }
    });
  };
  return b(i), m.clear(), Pc++, function() {
    h.forEach(function(E) {
      var R = va.get(E) - 1, O = f.get(E) - 1;
      va.set(E, R), f.set(E, O), R || (Ir.has(E) || E.removeAttribute(s), Ir.delete(E)), O || E.removeAttribute(u);
    }), Pc--, Pc || (va = /* @__PURE__ */ new WeakMap(), va = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap(), eu = {});
  };
}, FS = function(l, i, u) {
  u === void 0 && (u = "data-aria-hidden");
  var s = Array.from(Array.isArray(l) ? l : [l]), o = KS(l);
  return o ? (s.push.apply(s, Array.from(o.querySelectorAll("[aria-live], script"))), WS(s, o, u, "aria-hidden")) : function() {
    return null;
  };
}, Go = "Dialog", [Qp] = Oo(Go), [$S, Bt] = Qp(Go), Zp = (l) => {
  const {
    __scopeDialog: i,
    children: u,
    open: s,
    defaultOpen: o,
    onOpenChange: f,
    modal: h = !0
  } = l, m = S.useRef(null), v = S.useRef(null), [p = !1, b] = mp({
    prop: s,
    defaultProp: o,
    onChange: f
  });
  return /* @__PURE__ */ y.jsx(
    $S,
    {
      scope: i,
      triggerRef: m,
      contentRef: v,
      contentId: lu(),
      titleId: lu(),
      descriptionId: lu(),
      open: p,
      onOpenChange: b,
      onOpenToggle: S.useCallback(() => b((E) => !E), [b]),
      modal: h,
      children: u
    }
  );
};
Zp.displayName = Go;
var Kp = "DialogTrigger", Jp = S.forwardRef(
  (l, i) => {
    const { __scopeDialog: u, ...s } = l, o = Bt(Kp, u), f = Lt(i, o.triggerRef);
    return /* @__PURE__ */ y.jsx(
      dt.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Xo(o.open),
        ...s,
        ref: f,
        onClick: ot(l.onClick, o.onOpenToggle)
      }
    );
  }
);
Jp.displayName = Kp;
var Vo = "DialogPortal", [PS, Wp] = Qp(Vo, {
  forceMount: void 0
}), Fp = (l) => {
  const { __scopeDialog: i, forceMount: u, children: s, container: o } = l, f = Bt(Vo, i);
  return /* @__PURE__ */ y.jsx(PS, { scope: i, forceMount: u, children: S.Children.map(s, (h) => /* @__PURE__ */ y.jsx(wa, { present: u || f.open, children: /* @__PURE__ */ y.jsx(Lo, { asChild: !0, container: o, children: h }) })) });
};
Fp.displayName = Vo;
var hu = "DialogOverlay", $p = S.forwardRef(
  (l, i) => {
    const u = Wp(hu, l.__scopeDialog), { forceMount: s = u.forceMount, ...o } = l, f = Bt(hu, l.__scopeDialog);
    return f.modal ? /* @__PURE__ */ y.jsx(wa, { present: s || f.open, children: /* @__PURE__ */ y.jsx(IS, { ...o, ref: i }) }) : null;
  }
);
$p.displayName = hu;
var IS = S.forwardRef(
  (l, i) => {
    const { __scopeDialog: u, ...s } = l, o = Bt(hu, u);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ y.jsx(Yp, { as: bu, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ y.jsx(
        dt.div,
        {
          "data-state": Xo(o.open),
          ...s,
          ref: i,
          style: { pointerEvents: "auto", ...s.style }
        }
      ) })
    );
  }
), Ml = "DialogContent", Pp = S.forwardRef(
  (l, i) => {
    const u = Wp(Ml, l.__scopeDialog), { forceMount: s = u.forceMount, ...o } = l, f = Bt(Ml, l.__scopeDialog);
    return /* @__PURE__ */ y.jsx(wa, { present: s || f.open, children: f.modal ? /* @__PURE__ */ y.jsx(e2, { ...o, ref: i }) : /* @__PURE__ */ y.jsx(t2, { ...o, ref: i }) });
  }
);
Pp.displayName = Ml;
var e2 = S.forwardRef(
  (l, i) => {
    const u = Bt(Ml, l.__scopeDialog), s = S.useRef(null), o = Lt(i, u.contentRef, s);
    return S.useEffect(() => {
      const f = s.current;
      if (f) return FS(f);
    }, []), /* @__PURE__ */ y.jsx(
      Ip,
      {
        ...l,
        ref: o,
        trapFocus: u.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ot(l.onCloseAutoFocus, (f) => {
          var h;
          f.preventDefault(), (h = u.triggerRef.current) == null || h.focus();
        }),
        onPointerDownOutside: ot(l.onPointerDownOutside, (f) => {
          const h = f.detail.originalEvent, m = h.button === 0 && h.ctrlKey === !0;
          (h.button === 2 || m) && f.preventDefault();
        }),
        onFocusOutside: ot(
          l.onFocusOutside,
          (f) => f.preventDefault()
        )
      }
    );
  }
), t2 = S.forwardRef(
  (l, i) => {
    const u = Bt(Ml, l.__scopeDialog), s = S.useRef(!1), o = S.useRef(!1);
    return /* @__PURE__ */ y.jsx(
      Ip,
      {
        ...l,
        ref: i,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (f) => {
          var h, m;
          (h = l.onCloseAutoFocus) == null || h.call(l, f), f.defaultPrevented || (s.current || (m = u.triggerRef.current) == null || m.focus(), f.preventDefault()), s.current = !1, o.current = !1;
        },
        onInteractOutside: (f) => {
          var v, p;
          (v = l.onInteractOutside) == null || v.call(l, f), f.defaultPrevented || (s.current = !0, f.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const h = f.target;
          ((p = u.triggerRef.current) == null ? void 0 : p.contains(h)) && f.preventDefault(), f.detail.originalEvent.type === "focusin" && o.current && f.preventDefault();
        }
      }
    );
  }
), Ip = S.forwardRef(
  (l, i) => {
    const { __scopeDialog: u, trapFocus: s, onOpenAutoFocus: o, onCloseAutoFocus: f, ...h } = l, m = Bt(Ml, u), v = S.useRef(null), p = Lt(i, v);
    return oS(), /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
      /* @__PURE__ */ y.jsx(
        jp,
        {
          asChild: !0,
          loop: !0,
          trapped: s,
          onMountAutoFocus: o,
          onUnmountAutoFocus: f,
          children: /* @__PURE__ */ y.jsx(
            Mo,
            {
              role: "dialog",
              id: m.contentId,
              "aria-describedby": m.descriptionId,
              "aria-labelledby": m.titleId,
              "data-state": Xo(m.open),
              ...h,
              ref: p,
              onDismiss: () => m.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
        /* @__PURE__ */ y.jsx(n2, { titleId: m.titleId }),
        /* @__PURE__ */ y.jsx(a2, { contentRef: v, descriptionId: m.descriptionId })
      ] })
    ] });
  }
), Yo = "DialogTitle", eg = S.forwardRef(
  (l, i) => {
    const { __scopeDialog: u, ...s } = l, o = Bt(Yo, u);
    return /* @__PURE__ */ y.jsx(dt.h2, { id: o.titleId, ...s, ref: i });
  }
);
eg.displayName = Yo;
var tg = "DialogDescription", ng = S.forwardRef(
  (l, i) => {
    const { __scopeDialog: u, ...s } = l, o = Bt(tg, u);
    return /* @__PURE__ */ y.jsx(dt.p, { id: o.descriptionId, ...s, ref: i });
  }
);
ng.displayName = tg;
var lg = "DialogClose", ag = S.forwardRef(
  (l, i) => {
    const { __scopeDialog: u, ...s } = l, o = Bt(lg, u);
    return /* @__PURE__ */ y.jsx(
      dt.button,
      {
        type: "button",
        ...s,
        ref: i,
        onClick: ot(l.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
ag.displayName = lg;
function Xo(l) {
  return l ? "open" : "closed";
}
var ig = "DialogTitleWarning", [JA, rg] = Nb(ig, {
  contentName: Ml,
  titleName: Yo,
  docsSlug: "dialog"
}), n2 = ({ titleId: l }) => {
  const i = rg(ig), u = `\`${i.contentName}\` requires a \`${i.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${i.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${i.docsSlug}`;
  return S.useEffect(() => {
    l && (document.getElementById(l) || console.error(u));
  }, [u, l]), null;
}, l2 = "DialogDescriptionWarning", a2 = ({ contentRef: l, descriptionId: i }) => {
  const s = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${rg(l2).contentName}}.`;
  return S.useEffect(() => {
    var f;
    const o = (f = l.current) == null ? void 0 : f.getAttribute("aria-describedby");
    i && o && (document.getElementById(i) || console.warn(s));
  }, [s, l, i]), null;
}, i2 = Zp, r2 = Jp, u2 = Fp, s2 = $p, c2 = Pp, o2 = eg, f2 = ng, d2 = ag;
function ug(l) {
  var i, u, s = "";
  if (typeof l == "string" || typeof l == "number") s += l;
  else if (typeof l == "object") if (Array.isArray(l)) {
    var o = l.length;
    for (i = 0; i < o; i++) l[i] && (u = ug(l[i])) && (s && (s += " "), s += u);
  } else for (u in l) l[u] && (s && (s += " "), s += u);
  return s;
}
function Qo() {
  for (var l, i, u = 0, s = "", o = arguments.length; u < o; u++) (l = arguments[u]) && (i = ug(l)) && (s && (s += " "), s += i);
  return s;
}
const yv = (l) => typeof l == "boolean" ? `${l}` : l === 0 ? "0" : l, bv = Qo, h2 = (l, i) => (u) => {
  var s;
  if ((i == null ? void 0 : i.variants) == null) return bv(l, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
  const { variants: o, defaultVariants: f } = i, h = Object.keys(o).map((p) => {
    const b = u == null ? void 0 : u[p], E = f == null ? void 0 : f[p];
    if (b === null) return null;
    const R = yv(b) || yv(E);
    return o[p][R];
  }), m = u && Object.entries(u).reduce((p, b) => {
    let [E, R] = b;
    return R === void 0 || (p[E] = R), p;
  }, {}), v = i == null || (s = i.compoundVariants) === null || s === void 0 ? void 0 : s.reduce((p, b) => {
    let { class: E, className: R, ...O } = b;
    return Object.entries(O).every((w) => {
      let [T, z] = w;
      return Array.isArray(z) ? z.includes({
        ...f,
        ...m
      }[T]) : {
        ...f,
        ...m
      }[T] === z;
    }) ? [
      ...p,
      E,
      R
    ] : p;
  }, []);
  return bv(l, h, v, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
}, Zo = "-", m2 = (l) => {
  const i = p2(l), {
    conflictingClassGroups: u,
    conflictingClassGroupModifiers: s
  } = l;
  return {
    getClassGroupId: (h) => {
      const m = h.split(Zo);
      return m[0] === "" && m.length !== 1 && m.shift(), sg(m, i) || v2(h);
    },
    getConflictingClassGroupIds: (h, m) => {
      const v = u[h] || [];
      return m && s[h] ? [...v, ...s[h]] : v;
    }
  };
}, sg = (l, i) => {
  var h;
  if (l.length === 0)
    return i.classGroupId;
  const u = l[0], s = i.nextPart.get(u), o = s ? sg(l.slice(1), s) : void 0;
  if (o)
    return o;
  if (i.validators.length === 0)
    return;
  const f = l.join(Zo);
  return (h = i.validators.find(({
    validator: m
  }) => m(f))) == null ? void 0 : h.classGroupId;
}, xv = /^\[(.+)\]$/, v2 = (l) => {
  if (xv.test(l)) {
    const i = xv.exec(l)[1], u = i == null ? void 0 : i.substring(0, i.indexOf(":"));
    if (u)
      return "arbitrary.." + u;
  }
}, p2 = (l) => {
  const {
    theme: i,
    classGroups: u
  } = l, s = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const o in u)
    vo(u[o], s, o, i);
  return s;
}, vo = (l, i, u, s) => {
  l.forEach((o) => {
    if (typeof o == "string") {
      const f = o === "" ? i : Sv(i, o);
      f.classGroupId = u;
      return;
    }
    if (typeof o == "function") {
      if (g2(o)) {
        vo(o(s), i, u, s);
        return;
      }
      i.validators.push({
        validator: o,
        classGroupId: u
      });
      return;
    }
    Object.entries(o).forEach(([f, h]) => {
      vo(h, Sv(i, f), u, s);
    });
  });
}, Sv = (l, i) => {
  let u = l;
  return i.split(Zo).forEach((s) => {
    u.nextPart.has(s) || u.nextPart.set(s, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), u = u.nextPart.get(s);
  }), u;
}, g2 = (l) => l.isThemeGetter, y2 = (l) => {
  if (l < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let i = 0, u = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  const o = (f, h) => {
    u.set(f, h), i++, i > l && (i = 0, s = u, u = /* @__PURE__ */ new Map());
  };
  return {
    get(f) {
      let h = u.get(f);
      if (h !== void 0)
        return h;
      if ((h = s.get(f)) !== void 0)
        return o(f, h), h;
    },
    set(f, h) {
      u.has(f) ? u.set(f, h) : o(f, h);
    }
  };
}, po = "!", go = ":", b2 = go.length, x2 = (l) => {
  const {
    prefix: i,
    experimentalParseClassName: u
  } = l;
  let s = (o) => {
    const f = [];
    let h = 0, m = 0, v = 0, p;
    for (let w = 0; w < o.length; w++) {
      let T = o[w];
      if (h === 0 && m === 0) {
        if (T === go) {
          f.push(o.slice(v, w)), v = w + b2;
          continue;
        }
        if (T === "/") {
          p = w;
          continue;
        }
      }
      T === "[" ? h++ : T === "]" ? h-- : T === "(" ? m++ : T === ")" && m--;
    }
    const b = f.length === 0 ? o : o.substring(v), E = S2(b), R = E !== b, O = p && p > v ? p - v : void 0;
    return {
      modifiers: f,
      hasImportantModifier: R,
      baseClassName: E,
      maybePostfixModifierPosition: O
    };
  };
  if (i) {
    const o = i + go, f = s;
    s = (h) => h.startsWith(o) ? f(h.substring(o.length)) : {
      isExternal: !0,
      modifiers: [],
      hasImportantModifier: !1,
      baseClassName: h,
      maybePostfixModifierPosition: void 0
    };
  }
  if (u) {
    const o = s;
    s = (f) => u({
      className: f,
      parseClassName: o
    });
  }
  return s;
}, S2 = (l) => l.endsWith(po) ? l.substring(0, l.length - 1) : l.startsWith(po) ? l.substring(1) : l, E2 = (l) => {
  const i = Object.fromEntries(l.orderSensitiveModifiers.map((s) => [s, !0]));
  return (s) => {
    if (s.length <= 1)
      return s;
    const o = [];
    let f = [];
    return s.forEach((h) => {
      h[0] === "[" || i[h] ? (o.push(...f.sort(), h), f = []) : f.push(h);
    }), o.push(...f.sort()), o;
  };
}, A2 = (l) => ({
  cache: y2(l.cacheSize),
  parseClassName: x2(l),
  sortModifiers: E2(l),
  ...m2(l)
}), T2 = /\s+/, w2 = (l, i) => {
  const {
    parseClassName: u,
    getClassGroupId: s,
    getConflictingClassGroupIds: o,
    sortModifiers: f
  } = i, h = [], m = l.trim().split(T2);
  let v = "";
  for (let p = m.length - 1; p >= 0; p -= 1) {
    const b = m[p], {
      isExternal: E,
      modifiers: R,
      hasImportantModifier: O,
      baseClassName: w,
      maybePostfixModifierPosition: T
    } = u(b);
    if (E) {
      v = b + (v.length > 0 ? " " + v : v);
      continue;
    }
    let z = !!T, _ = s(z ? w.substring(0, T) : w);
    if (!_) {
      if (!z) {
        v = b + (v.length > 0 ? " " + v : v);
        continue;
      }
      if (_ = s(w), !_) {
        v = b + (v.length > 0 ? " " + v : v);
        continue;
      }
      z = !1;
    }
    const B = f(R).join(":"), Y = O ? B + po : B, X = Y + _;
    if (h.includes(X))
      continue;
    h.push(X);
    const H = o(_, z);
    for (let U = 0; U < H.length; ++U) {
      const K = H[U];
      h.push(Y + K);
    }
    v = b + (v.length > 0 ? " " + v : v);
  }
  return v;
};
function R2() {
  let l = 0, i, u, s = "";
  for (; l < arguments.length; )
    (i = arguments[l++]) && (u = cg(i)) && (s && (s += " "), s += u);
  return s;
}
const cg = (l) => {
  if (typeof l == "string")
    return l;
  let i, u = "";
  for (let s = 0; s < l.length; s++)
    l[s] && (i = cg(l[s])) && (u && (u += " "), u += i);
  return u;
};
function O2(l, ...i) {
  let u, s, o, f = h;
  function h(v) {
    const p = i.reduce((b, E) => E(b), l());
    return u = A2(p), s = u.cache.get, o = u.cache.set, f = m, m(v);
  }
  function m(v) {
    const p = s(v);
    if (p)
      return p;
    const b = w2(v, u);
    return o(v, b), b;
  }
  return function() {
    return f(R2.apply(null, arguments));
  };
}
const $e = (l) => {
  const i = (u) => u[l] || [];
  return i.isThemeGetter = !0, i;
}, og = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, fg = /^\((?:(\w[\w-]*):)?(.+)\)$/i, M2 = /^\d+\/\d+$/, C2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, D2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, N2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, z2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, _2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, pa = (l) => M2.test(l), ye = (l) => !!l && !Number.isNaN(Number(l)), xl = (l) => !!l && Number.isInteger(Number(l)), Ev = (l) => l.endsWith("%") && ye(l.slice(0, -1)), Xn = (l) => C2.test(l), j2 = () => !0, U2 = (l) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  D2.test(l) && !N2.test(l)
), Ko = () => !1, H2 = (l) => z2.test(l), L2 = (l) => _2.test(l), B2 = (l) => !I(l) && !ee(l), q2 = (l) => Ra(l, mg, Ko), I = (l) => og.test(l), Sl = (l) => Ra(l, vg, U2), Ic = (l) => Ra(l, F2, ye), k2 = (l) => Ra(l, dg, Ko), G2 = (l) => Ra(l, hg, L2), V2 = (l) => Ra(l, Ko, H2), ee = (l) => fg.test(l), tu = (l) => Oa(l, vg), Y2 = (l) => Oa(l, $2), X2 = (l) => Oa(l, dg), Q2 = (l) => Oa(l, mg), Z2 = (l) => Oa(l, hg), K2 = (l) => Oa(l, P2, !0), Ra = (l, i, u) => {
  const s = og.exec(l);
  return s ? s[1] ? i(s[1]) : u(s[2]) : !1;
}, Oa = (l, i, u = !1) => {
  const s = fg.exec(l);
  return s ? s[1] ? i(s[1]) : u : !1;
}, dg = (l) => l === "position", J2 = /* @__PURE__ */ new Set(["image", "url"]), hg = (l) => J2.has(l), W2 = /* @__PURE__ */ new Set(["length", "size", "percentage"]), mg = (l) => W2.has(l), vg = (l) => l === "length", F2 = (l) => l === "number", $2 = (l) => l === "family-name", P2 = (l) => l === "shadow", I2 = () => {
  const l = $e("color"), i = $e("font"), u = $e("text"), s = $e("font-weight"), o = $e("tracking"), f = $e("leading"), h = $e("breakpoint"), m = $e("container"), v = $e("spacing"), p = $e("radius"), b = $e("shadow"), E = $e("inset-shadow"), R = $e("drop-shadow"), O = $e("blur"), w = $e("perspective"), T = $e("aspect"), z = $e("ease"), _ = $e("animate"), B = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], Y = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], X = () => ["auto", "hidden", "clip", "visible", "scroll"], H = () => ["auto", "contain", "none"], U = () => [ee, I, v], K = () => [pa, "full", "auto", ...U()], W = () => [xl, "none", "subgrid", ee, I], J = () => ["auto", {
    span: ["full", xl, ee, I]
  }, ee, I], F = () => [xl, "auto", ee, I], xe = () => ["auto", "min", "max", "fr", ee, I], Oe = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline"], de = () => ["start", "end", "center", "stretch"], ve = () => ["auto", ...U()], ge = () => [pa, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...U()], k = () => [l, ee, I], te = () => [Ev, Sl], Z = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    p,
    ee,
    I
  ], le = () => ["", ye, tu, Sl], A = () => ["solid", "dashed", "dotted", "double"], Q = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], re = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    O,
    ee,
    I
  ], ae = () => ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", ee, I], $ = () => ["none", ye, ee, I], oe = () => ["none", ye, ee, I], se = () => [ye, ee, I], _e = () => [pa, "full", ...U()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Xn],
      breakpoint: [Xn],
      color: [j2],
      container: [Xn],
      "drop-shadow": [Xn],
      ease: ["in", "out", "in-out"],
      font: [B2],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Xn],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Xn],
      shadow: [Xn],
      spacing: ["px", ye],
      text: [Xn],
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
        aspect: ["auto", "square", pa, I, ee, T]
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
        columns: [ye, I, ee, m]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": B()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": B()
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
        object: [...Y(), I, ee]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: X()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": X()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": X()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: H()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": H()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": H()
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
        z: [xl, "auto", ee, I]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [pa, "full", "auto", m, ...U()]
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
        flex: [ye, pa, "auto", "initial", "none", I]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", ye, ee, I]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", ye, ee, I]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [xl, "first", "last", "none", ee, I]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": W()
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
        "col-start": F()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": F()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": W()
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
        "row-start": F()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": F()
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
        "auto-cols": xe()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": xe()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: U()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": U()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": U()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...Oe(), "normal"]
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
        content: ["normal", ...Oe()]
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
        "place-content": Oe()
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
        p: U()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: U()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: U()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: U()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: U()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: U()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: U()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: U()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: U()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: ve()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: ve()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: ve()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: ve()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: ve()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: ve()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: ve()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: ve()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: ve()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": U()
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
        "space-y": U()
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
        w: [m, "screen", ...ge()]
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
          ...ge()
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
        text: ["base", u, tu, Sl]
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
        font: [s, ee, Ic]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ev, I]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Y2, I, i]
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
        tracking: [o, ee, I]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [ye, "none", ee, Ic]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          f,
          ...U()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", ee, I]
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
        list: ["disc", "decimal", "none", ee, I]
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
        placeholder: k()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: k()
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
        decoration: [...A(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [ye, "from-font", "auto", ee, Sl]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: k()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [ye, "auto", ee, I]
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
        indent: U()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", ee, I]
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
        content: ["none", ee, I]
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
        bg: [...Y(), X2, k2]
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
        bg: ["auto", "cover", "contain", Q2, q2]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, xl, ee, I],
          radial: ["", ee, I],
          conic: [xl, ee, I]
        }, Z2, G2]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: k()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: te()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: te()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: te()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: k()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: k()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: k()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: Z()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": Z()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": Z()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": Z()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": Z()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": Z()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": Z()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": Z()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": Z()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": Z()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": Z()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": Z()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": Z()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": Z()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": Z()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: le()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": le()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": le()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": le()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": le()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": le()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": le()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": le()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": le()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": le()
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
        "divide-y": le()
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
        border: [...A(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...A(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: k()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": k()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": k()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": k()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": k()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": k()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": k()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": k()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": k()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: k()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...A(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [ye, ee, I]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", ye, tu, Sl]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [l]
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
          b,
          K2,
          V2
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: k()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", ee, I, E]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": k()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: le()
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
        ring: k()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [ye, Sl]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": k()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": le()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": k()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [ye, ee, I]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Q(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Q()
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
          ee,
          I
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: re()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [ye, ee, I]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [ye, ee, I]
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
          R,
          ee,
          I
        ]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", ye, ee, I]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [ye, ee, I]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", ye, ee, I]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [ye, ee, I]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", ye, ee, I]
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
          ee,
          I
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": re()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [ye, ee, I]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [ye, ee, I]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", ye, ee, I]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [ye, ee, I]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", ye, ee, I]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [ye, ee, I]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [ye, ee, I]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", ye, ee, I]
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
        "border-spacing": U()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": U()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": U()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", ee, I]
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
        duration: [ye, "initial", ee, I]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", z, ee, I]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [ye, ee, I]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", _, ee, I]
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
        perspective: [w, ee, I]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": ae()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: $()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": $()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": $()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": $()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: oe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": oe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": oe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": oe()
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
        skew: se()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": se()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": se()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [ee, I, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ae()
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
        accent: k()
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
        caret: k()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", ee, I]
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
        "scroll-m": U()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": U()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": U()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": U()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": U()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": U()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": U()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": U()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": U()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": U()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": U()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": U()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": U()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": U()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": U()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": U()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": U()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": U()
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
        "will-change": ["auto", "scroll", "contents", "transform", ee, I]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...k()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [ye, tu, Sl, Ic]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...k()]
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
}, pg = /* @__PURE__ */ O2(I2), eE = (...l) => pg(Qo(l)), tE = h2("fx-button inline-flex items-center justify-center gap-2 rounded-xl font-semibold", {
  variants: {
    variant: { primary: "fx-button-primary", secondary: "fx-button-secondary", ghost: "fx-button-ghost" },
    size: { default: "px-4 py-2.5 text-xs", icon: "size-9 p-2", small: "px-3 py-2 text-[11px]" }
  },
  defaultVariants: { variant: "secondary", size: "default" }
}), Jo = S.forwardRef(
  ({ className: l, variant: i, size: u, asChild: s = !1, shimmer: o = !1, children: f, ...h }, m) => {
    const v = s ? bu : "button";
    return /* @__PURE__ */ y.jsx(v, { ref: m, className: eE(tE({ variant: i, size: u }), o && "fx-shimmer", l), ...h, children: f });
  }
);
Jo.displayName = "Button";
const nE = [
  ["home", "Workspace overview", "Start from the policy goal"],
  ["data", "Data dashboard", "Collection, regional map and the upload/JDIH source queue"],
  ["studio", "Policy Studio", "Draft documents, verify sources and test policy impact", "editor analysis review check conflict simulation forum public persona impact analisis pemeriksaan periksa konflik simulasi netizen dampak"],
  ["library", "Legal library", "Document gallery and regulation sources: search articles, read, ask and compare", "gallery library corpus documents galeri pustaka"],
  ["activity", "Activity", "Results, reviews, draft versions and agent runs", "history agent agents runs execution trace notes riwayat eksekusi catatan"]
];
function lE() {
  const [l, i] = S.useState(!1), [u, s] = S.useState(""), [o, f] = S.useState(0), h = nE.filter((v) => v.join(" ").toLowerCase().includes(u.toLowerCase())), m = (v) => {
    i(!1), requestAnimationFrame(() => {
      const p = document.querySelector('[data-view="' + v + '"]');
      if (v === "activity") {
        const R = /agen|agent|eksekusi|trace|proses/.test(u.toLowerCase()) ? "agents" : "results";
        p == null || p.dispatchEvent(new CustomEvent("rulelab:activity-route", { bubbles: !0, detail: { tab: R } }));
        return;
      }
      if (v !== "studio") {
        p == null || p.click();
        return;
      }
      const b = u.toLowerCase(), E = /simulasi|dampak|forum|netizen|persona/.test(b) ? "simulation" : /analisis|konflik|periksa|pemeriksaan|review/.test(b) ? "analysis" : /editor|rancang|naskah|susun/.test(b) ? "editor" : void 0;
      if (!E) {
        p == null || p.click();
        return;
      }
      p == null || p.dispatchEvent(new CustomEvent("rulelab:studio-route", { bubbles: !0, detail: { stage: E, sub: /forum|netizen|persona/.test(b) ? "social" : void 0 } }));
    });
  };
  return S.useEffect(() => {
    const v = (p) => {
      var b;
      (p.metaKey || p.ctrlKey) && p.key.toLowerCase() === "k" && !document.querySelector("dialog[open]") && !((b = document.querySelector("#main")) != null && b.inert) && (p.preventDefault(), i((E) => !E));
    };
    return document.addEventListener("keydown", v), () => document.removeEventListener("keydown", v);
  }, []), /* @__PURE__ */ y.jsxs(i2, { open: l, onOpenChange: (v) => {
    i(v), v && (s(""), f(0));
  }, children: [
    /* @__PURE__ */ y.jsx(r2, { asChild: !0, children: /* @__PURE__ */ y.jsxs(Jo, { className: "fx-command-trigger", size: "small", "aria-label": "Quick navigation", onClick: (v) => {
      var p;
      (document.querySelector("dialog[open]") || (p = document.querySelector("#main")) != null && p.inert) && v.preventDefault();
    }, children: [
      /* @__PURE__ */ y.jsx(Jx, { size: 14 }),
      /* @__PURE__ */ y.jsx("span", { children: "Quick menu" }),
      /* @__PURE__ */ y.jsx("kbd", { children: "⌘ K" })
    ] }) }),
    /* @__PURE__ */ y.jsxs(u2, { children: [
      /* @__PURE__ */ y.jsx(s2, { className: "fx-dialog-overlay" }),
      /* @__PURE__ */ y.jsxs(c2, { className: "fx-command-content", onOpenAutoFocus: (v) => {
        var p;
        v.preventDefault(), (p = document.getElementById("framework-command-input")) == null || p.focus();
      }, children: [
        /* @__PURE__ */ y.jsx(o2, { className: "fx-command-title", children: "Workspace navigation" }),
        /* @__PURE__ */ y.jsx(f2, { className: "fx-command-description", children: "Search the menu and continue your work. Changed drafts are saved before switching." }),
        /* @__PURE__ */ y.jsx(d2, { className: "fx-command-close", "aria-label": "Close quick menu", children: /* @__PURE__ */ y.jsx(_p, { size: 15 }) }),
        /* @__PURE__ */ y.jsxs("div", { className: "fx-command-search", children: [
          /* @__PURE__ */ y.jsx(ho, { size: 17 }),
          /* @__PURE__ */ y.jsx("input", { id: "framework-command-input", role: "combobox", "aria-controls": "framework-command-results", "aria-expanded": "true", "aria-autocomplete": "list", "aria-activedescendant": h[o] ? "framework-command-" + h[o][0] : void 0, "aria-label": "Search menu", autoComplete: "off", placeholder: "Search editor, simulation, sources…", value: u, onChange: (v) => {
            s(v.target.value), f(0);
          }, onKeyDown: (v) => {
            v.key === "ArrowDown" && (v.preventDefault(), f((p) => Math.max(0, Math.min(h.length - 1, p + 1)))), v.key === "ArrowUp" && (v.preventDefault(), f((p) => Math.max(0, p - 1))), v.key === "Enter" && h[o] && (v.preventDefault(), m(h[o][0]));
          } })
        ] }),
        /* @__PURE__ */ y.jsxs("div", { className: "fx-command-results", id: "framework-command-results", role: "listbox", "aria-label": "Workspace menu", children: [
          h.map(([v, p, b], E) => /* @__PURE__ */ y.jsxs("button", { id: "framework-command-" + v, role: "option", "aria-selected": E === o, tabIndex: -1, onClick: () => m(v), className: E === o ? "selected" : "", children: [
            /* @__PURE__ */ y.jsxs("span", { children: [
              /* @__PURE__ */ y.jsx("b", { children: p }),
              /* @__PURE__ */ y.jsx("small", { children: b })
            ] }),
            /* @__PURE__ */ y.jsx(Vx, { size: 14 })
          ] }, v)),
          !h.length && /* @__PURE__ */ y.jsx("p", { children: "No matching menu. Try another term." })
        ] }),
        /* @__PURE__ */ y.jsxs("div", { className: "fx-command-footer", children: [
          /* @__PURE__ */ y.jsx("span", { children: "↑ ↓ Select" }),
          /* @__PURE__ */ y.jsx("span", { children: "Enter Open" }),
          /* @__PURE__ */ y.jsx("span", { children: "Esc Close" })
        ] })
      ] })
    ] })
  ] });
}
function aE({ state: l }) {
  return /* @__PURE__ */ y.jsxs("div", { className: "workspace-context", children: [
    /* @__PURE__ */ y.jsxs("span", { className: "context-document", children: [
      /* @__PURE__ */ y.jsx(ko, { size: 14 }),
      l.draft.title
    ] }),
    /* @__PURE__ */ y.jsxs("span", { className: "context-version", children: [
      "v",
      l.draft.revision
    ] }),
    /* @__PURE__ */ y.jsx("span", { className: l.dirty ? "context-dirty" : "context-saved", children: l.dirty ? "Not saved" : "Saved document" }),
    l.view !== "editor" && /* @__PURE__ */ y.jsxs(Jo, { size: "small", variant: "ghost", "data-view": "editor", children: [
      "Edit document",
      /* @__PURE__ */ y.jsx(Qx, { size: 13 })
    ] })
  ] });
}
const iE = {
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
}, Av = (l) => l && iE[l] || l || "Regulation", rE = () => {
  const l = (/* @__PURE__ */ new Date()).getHours();
  return l < 12 ? "Good morning" : l < 18 ? "Good afternoon" : "Good evening";
};
function eo(l, i = Date.now()) {
  if (!l) return "";
  const u = Math.max(0, (i - new Date(l).getTime()) / 1e3);
  return u < 60 ? "just now" : u < 3600 ? `${Math.floor(u / 60)} min ago` : u < 86400 ? `${Math.floor(u / 3600)} h ago` : u < 172800 ? "yesterday" : new Date(l).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function Tv(l, i) {
  var m;
  const u = (m = l.job) != null && m.active ? l.job : null, s = u && ["legal", "full"].includes(u.intent), o = u && ["impact", "full", "social"].includes(u.intent), f = l.analysis, h = l.impact;
  return [
    { label: "Draft", state: i ? "warn" : "done", detail: i ? "Unsaved changes" : `v${l.revision} saved` },
    {
      label: "Verify sources",
      state: s ? "running" : f ? f.outdated ? "warn" : l.pending_reviews ? "active" : "done" : "todo",
      detail: s ? "Running…" : f ? f.outdated ? `Outdated · ran on v${f.revision}` : `${f.findings} finding${f.findings === 1 ? "" : "s"}${l.pending_reviews ? " · awaiting review" : " · reviewed"}` : "Not checked yet"
    },
    {
      label: "Test impact",
      state: o ? "running" : h ? h.outdated ? "warn" : "done" : "todo",
      detail: o ? "Running…" : h ? h.outdated ? `Outdated · ran on v${h.revision}` : h.kind === "social" ? "Public forum done" : "A/B test done" : "Not tested yet"
    }
  ];
}
function uE(l, i) {
  var u;
  return i ? { label: "Save draft", action: "save" } : (u = l.job) != null && u.active ? { label: "View progress", target: "agents" } : l.pending_reviews ? { label: `Review ${l.pending_reviews} result${l.pending_reviews > 1 ? "s" : ""}`, target: "history" } : !l.analysis || l.analysis.outdated ? { label: `Run source check on v${l.revision}`, target: "analysis" } : !l.impact || l.impact.outdated ? { label: "Test the impact", target: "simulation" } : { label: "Export to Word", action: "export-draft" };
}
function to(l, i, u) {
  return u.action === "save" ? { "data-action": "save" } : u.action === "export-draft" ? { "data-action": "export-draft", "data-id": l.id } : l.id === i && u.target !== "editor" ? { "data-view": u.target } : { "data-action": "open-draft-at", "data-id": l.id, "data-target": u.target };
}
function sE({ state: l }) {
  const i = `ov-dot ov-dot-${l}`;
  return l === "done" ? /* @__PURE__ */ y.jsx("span", { className: i, children: /* @__PURE__ */ y.jsx(Rp, { size: 12, strokeWidth: 3 }) }) : l === "running" ? /* @__PURE__ */ y.jsx("span", { className: i, children: /* @__PURE__ */ y.jsx(Cp, { size: 12, className: "ov-spin" }) }) : l === "warn" ? /* @__PURE__ */ y.jsx("span", { className: i, children: /* @__PURE__ */ y.jsx(zp, { size: 11, strokeWidth: 2.6 }) }) : l === "active" ? /* @__PURE__ */ y.jsx("span", { className: i, children: /* @__PURE__ */ y.jsx(Zx, { size: 12 }) }) : /* @__PURE__ */ y.jsx("span", { className: i });
}
function wv({ steps: l, compact: i = !1 }) {
  return i ? /* @__PURE__ */ y.jsx("span", { className: "ov-mini", role: "img", "aria-label": l.map((u) => `${u.label}: ${u.detail}`).join("; "), children: l.map((u) => /* @__PURE__ */ y.jsx("i", { className: `ov-mini-${u.state}` }, u.label)) }) : /* @__PURE__ */ y.jsx("ol", { className: "ov-stepper", children: l.map((u) => /* @__PURE__ */ y.jsxs("li", { className: `ov-step ov-step-${u.state}`, children: [
    /* @__PURE__ */ y.jsx(sE, { state: u.state }),
    /* @__PURE__ */ y.jsxs("div", { children: [
      /* @__PURE__ */ y.jsx("b", { children: u.label }),
      /* @__PURE__ */ y.jsx("small", { children: u.detail })
    ] })
  ] }, u.label)) });
}
function cE({ readOnly: l }) {
  const [i, u] = S.useState(!1);
  if (l) return null;
  const s = [
    ["generate", "Draft from a brief", "Gemini writes the first version", /* @__PURE__ */ y.jsx(Np, { size: 16 })],
    ["new", "Guided template", "Pick a regulation type and fill the form", /* @__PURE__ */ y.jsx(ko, { size: 16 })],
    ["import", "Import a document", "TXT, DOCX, PDF or JSON", /* @__PURE__ */ y.jsx(Op, { size: 16 })]
  ];
  return /* @__PURE__ */ y.jsxs("div", { className: "ov-new", onBlur: (o) => {
    o.currentTarget.contains(o.relatedTarget) || u(!1);
  }, children: [
    /* @__PURE__ */ y.jsxs("button", { className: "ov-btn ov-btn-primary", "data-action": "generate", children: [
      /* @__PURE__ */ y.jsx(Px, { size: 16 }),
      "New draft"
    ] }),
    /* @__PURE__ */ y.jsx("button", { className: "ov-btn ov-btn-primary ov-new-toggle", "aria-label": "More ways to start a draft", "aria-expanded": i, onClick: () => u((o) => !o), children: /* @__PURE__ */ y.jsx(Xx, { size: 16 }) }),
    i && /* @__PURE__ */ y.jsx("div", { className: "ov-menu", role: "menu", children: s.map(([o, f, h, m]) => /* @__PURE__ */ y.jsxs("button", { role: "menuitem", "data-action": o, onClick: () => u(!1), children: [
      /* @__PURE__ */ y.jsx("span", { className: "ov-menu-icon", children: m }),
      /* @__PURE__ */ y.jsxs("span", { children: [
        /* @__PURE__ */ y.jsx("b", { children: f }),
        /* @__PURE__ */ y.jsx("small", { children: h })
      ] })
    ] }, o)) })
  ] });
}
function oE() {
  var l;
  (l = document.querySelector(".fx-command-trigger")) == null || l.click();
}
function fE() {
  return /* @__PURE__ */ y.jsxs("div", { className: "ov-skeleton", "aria-busy": "true", "aria-label": "Loading overview", children: [
    /* @__PURE__ */ y.jsx("i", {}),
    /* @__PURE__ */ y.jsx("i", {}),
    /* @__PURE__ */ y.jsx("i", {})
  ] });
}
const dE = {
  running: /* @__PURE__ */ y.jsx(Cp, { size: 16, className: "ov-spin" }),
  failed: /* @__PURE__ */ y.jsx(_p, { size: 16 }),
  review: /* @__PURE__ */ y.jsx(Kx, { size: 16 }),
  outdated: /* @__PURE__ */ y.jsx(zp, { size: 16 })
};
function gg({ state: l }) {
  var O;
  const i = l.overview, u = ["viewer", "reviewer"].includes(((O = l.status.principal) == null ? void 0 : O.role) || ""), [s, o] = S.useState(""), [f, h] = S.useState("all"), m = (i == null ? void 0 : i.drafts) ?? [], v = l.dirty && m.find((w) => w.id === l.draft.id) || m[0], p = !!v && l.dirty && v.id === l.draft.id, b = (i == null ? void 0 : i.attention) ?? [], E = i ? `${m.length} draft${m.length === 1 ? "" : "s"} · ${b.length ? `${b.length} item${b.length === 1 ? "" : "s"} need${b.length === 1 ? "s" : ""} attention` : "nothing waits for a decision"}` : "Loading your workspace…", R = S.useMemo(() => m.filter((w) => {
    var T, z, _;
    return s && !`${w.title} ${w.regulation_type ?? ""}`.toLowerCase().includes(s.toLowerCase()) ? !1 : f === "review" ? w.pending_reviews > 0 : f === "outdated" ? !!((T = w.analysis) != null && T.outdated || (z = w.impact) != null && z.outdated) : f === "running" ? !!((_ = w.job) != null && _.active) : !0;
  }), [m, s, f]);
  return /* @__PURE__ */ y.jsxs("div", { className: "ov", children: [
    /* @__PURE__ */ y.jsxs("header", { className: "ov-header", children: [
      /* @__PURE__ */ y.jsxs("div", { children: [
        /* @__PURE__ */ y.jsxs("h1", { children: [
          rE(),
          "."
        ] }),
        /* @__PURE__ */ y.jsx("p", { "aria-live": "polite", children: E })
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "ov-header-actions", children: [
        /* @__PURE__ */ y.jsxs("button", { className: "ov-btn ov-btn-ghost ov-search", onClick: oE, "aria-label": "Search menus and actions (Ctrl+K)", children: [
          /* @__PURE__ */ y.jsx(ho, { size: 16 }),
          "Search",
          /* @__PURE__ */ y.jsx("kbd", { children: "Ctrl K" })
        ] }),
        /* @__PURE__ */ y.jsx(cE, { readOnly: u })
      ] })
    ] }),
    i === void 0 ? /* @__PURE__ */ y.jsx(fE, {}) : i === null ? /* @__PURE__ */ y.jsxs("div", { className: "ov-card ov-error", role: "alert", children: [
      "The overview could not be loaded. ",
      /* @__PURE__ */ y.jsx("button", { className: "ov-link", "data-view": "home", children: "Try again" })
    ] }) : /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
      /* @__PURE__ */ y.jsxs("div", { className: "ov-top", children: [
        v ? (() => {
          var z, _;
          const w = Tv(v, p), T = uE(v, p);
          return /* @__PURE__ */ y.jsxs("section", { className: `ov-card ov-continue${(z = v.job) != null && z.active ? " ov-live" : ""}`, "aria-labelledby": "ov-continue-title", children: [
            /* @__PURE__ */ y.jsx("span", { className: "ov-eyebrow", children: "Continue where you left off" }),
            /* @__PURE__ */ y.jsxs("div", { className: "ov-continue-head", children: [
              /* @__PURE__ */ y.jsx("h2", { id: "ov-continue-title", children: v.title }),
              /* @__PURE__ */ y.jsxs("span", { className: "ov-meta", children: [
                Av(v.regulation_type),
                " · v",
                v.revision,
                " · ",
                v.articles,
                " article",
                v.articles === 1 ? "" : "s",
                " · edited ",
                eo(v.updated_at)
              ] })
            ] }),
            /* @__PURE__ */ y.jsx(wv, { steps: w }),
            /* @__PURE__ */ y.jsxs("div", { className: "ov-continue-actions", children: [
              /* @__PURE__ */ y.jsxs("button", { className: "ov-btn ov-btn-primary", ...to(v, l.draft.id, T), children: [
                T.label,
                /* @__PURE__ */ y.jsx(Fr, { size: 16 })
              ] }),
              T.target !== "editor" && /* @__PURE__ */ y.jsx("button", { className: "ov-btn ov-btn-ghost", ...to(v, l.draft.id, { target: "editor" }), children: "Open editor" }),
              v.analysis && !v.analysis.outdated && !((_ = v.job) != null && _.active) && /* @__PURE__ */ y.jsx("button", { className: "ov-btn ov-btn-ghost", ...to(v, l.draft.id, { target: "social" }), children: "Run public forum" })
            ] })
          ] });
        })() : /* @__PURE__ */ y.jsxs("section", { className: "ov-card ov-continue", children: [
          /* @__PURE__ */ y.jsx("h2", { children: "No drafts yet" }),
          /* @__PURE__ */ y.jsx("p", { children: "Create the first draft to start." })
        ] }),
        /* @__PURE__ */ y.jsxs("section", { className: "ov-card ov-attention", "aria-labelledby": "ov-attention-title", children: [
          /* @__PURE__ */ y.jsxs("div", { className: "ov-card-head", children: [
            /* @__PURE__ */ y.jsx("h2", { id: "ov-attention-title", children: "Needs your attention" }),
            b.length > 0 && /* @__PURE__ */ y.jsx("span", { className: "ov-count", children: b.length })
          ] }),
          b.length ? /* @__PURE__ */ y.jsx("ul", { children: b.map((w, T) => /* @__PURE__ */ y.jsx("li", { children: /* @__PURE__ */ y.jsxs("button", { className: `ov-attn ov-attn-${w.kind}`, "data-action": "open-draft-at", "data-id": w.draft_id, "data-target": w.target, children: [
            /* @__PURE__ */ y.jsx("span", { className: "ov-attn-icon", children: dE[w.kind] }),
            /* @__PURE__ */ y.jsxs("span", { className: "ov-attn-copy", children: [
              /* @__PURE__ */ y.jsx("b", { children: w.label }),
              /* @__PURE__ */ y.jsxs("small", { children: [
                w.draft,
                " · ",
                w.detail
              ] })
            ] }),
            /* @__PURE__ */ y.jsx(Fr, { size: 15, className: "ov-attn-arrow" })
          ] }) }, T)) }) : /* @__PURE__ */ y.jsxs("p", { className: "ov-clear", children: [
            /* @__PURE__ */ y.jsx(Rp, { size: 16 }),
            "All clear — nothing waits for a decision."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ y.jsxs("section", { className: "ov-card ov-drafts", "aria-labelledby": "ov-drafts-title", children: [
        /* @__PURE__ */ y.jsxs("div", { className: "ov-card-head ov-drafts-head", children: [
          /* @__PURE__ */ y.jsxs("h2", { id: "ov-drafts-title", children: [
            "Your drafts ",
            /* @__PURE__ */ y.jsx("span", { className: "ov-muted", children: m.length })
          ] }),
          /* @__PURE__ */ y.jsxs("div", { className: "ov-drafts-tools", children: [
            /* @__PURE__ */ y.jsxs("label", { className: "ov-filter-search", children: [
              /* @__PURE__ */ y.jsx(ho, { size: 15, "aria-hidden": "true" }),
              /* @__PURE__ */ y.jsx("input", { type: "search", placeholder: "Search drafts", "aria-label": "Search drafts", value: s, onChange: (w) => o(w.target.value) })
            ] }),
            /* @__PURE__ */ y.jsx("div", { className: "ov-chips", role: "group", "aria-label": "Filter drafts", children: [["all", "All"], ["review", "Needs review"], ["outdated", "Outdated"], ["running", "Running"]].map(([w, T]) => /* @__PURE__ */ y.jsx("button", { className: "ov-chip", "aria-pressed": f === w, onClick: () => h(w), children: T }, w)) })
          ] })
        ] }),
        /* @__PURE__ */ y.jsxs("div", { className: "ov-table", role: "table", "aria-label": "Drafts", children: [
          /* @__PURE__ */ y.jsxs("div", { className: "ov-row ov-row-head", role: "row", children: [
            /* @__PURE__ */ y.jsx("span", { role: "columnheader", children: "Draft" }),
            /* @__PURE__ */ y.jsx("span", { role: "columnheader", children: "Stage" }),
            /* @__PURE__ */ y.jsx("span", { role: "columnheader", children: "Updated" }),
            /* @__PURE__ */ y.jsx("span", { role: "columnheader", children: "Version" }),
            /* @__PURE__ */ y.jsx("span", { role: "columnheader", children: /* @__PURE__ */ y.jsx("span", { className: "sr-only", children: "Open" }) })
          ] }),
          R.map((w) => {
            var z, _, B;
            const T = Tv(w, l.dirty && w.id === l.draft.id);
            return /* @__PURE__ */ y.jsxs("div", { className: "ov-row", role: "row", children: [
              /* @__PURE__ */ y.jsxs("span", { role: "cell", className: "ov-cell-title", children: [
                /* @__PURE__ */ y.jsx("b", { children: w.title }),
                /* @__PURE__ */ y.jsxs("small", { children: [
                  Av(w.regulation_type),
                  w.id === l.draft.id ? " · selected" : ""
                ] })
              ] }),
              /* @__PURE__ */ y.jsxs("span", { role: "cell", className: "ov-cell-stage", children: [
                /* @__PURE__ */ y.jsx(wv, { steps: T, compact: !0 }),
                w.pending_reviews > 0 && /* @__PURE__ */ y.jsxs("span", { className: "ov-badge ov-badge-review", children: [
                  w.pending_reviews,
                  " to review"
                ] }),
                (((z = w.analysis) == null ? void 0 : z.outdated) || ((_ = w.impact) == null ? void 0 : _.outdated)) && /* @__PURE__ */ y.jsx("span", { className: "ov-badge ov-badge-warn", children: "Outdated" }),
                ((B = w.job) == null ? void 0 : B.active) && /* @__PURE__ */ y.jsx("span", { className: "ov-badge ov-badge-run", children: "Running" })
              ] }),
              /* @__PURE__ */ y.jsx("span", { role: "cell", className: "ov-muted", children: eo(w.updated_at) }),
              /* @__PURE__ */ y.jsx("span", { role: "cell", children: /* @__PURE__ */ y.jsxs("span", { className: "ov-version", children: [
                "v",
                w.revision
              ] }) }),
              /* @__PURE__ */ y.jsx("span", { role: "cell", children: /* @__PURE__ */ y.jsxs("button", { className: "ov-btn ov-btn-ghost ov-btn-sm", "data-action": "open-draft-at", "data-id": w.id, "data-target": "editor", "aria-label": `Open ${w.title}`, children: [
                "Open",
                /* @__PURE__ */ y.jsx(Fr, { size: 14 })
              ] }) })
            ] }, w.id);
          }),
          !R.length && /* @__PURE__ */ y.jsx("p", { className: "ov-empty", children: "No drafts match this filter." })
        ] })
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "ov-bottom", children: [
        /* @__PURE__ */ y.jsxs("section", { className: "ov-card ov-activity", "aria-labelledby": "ov-activity-title", children: [
          /* @__PURE__ */ y.jsxs("div", { className: "ov-card-head", children: [
            /* @__PURE__ */ y.jsx("h2", { id: "ov-activity-title", children: "Recent activity" }),
            /* @__PURE__ */ y.jsxs("button", { className: "ov-link", "data-view": "history", children: [
              "View all",
              /* @__PURE__ */ y.jsx(Fr, { size: 14 })
            ] })
          ] }),
          i.activity.length ? /* @__PURE__ */ y.jsx("ol", { children: i.activity.map((w, T) => /* @__PURE__ */ y.jsxs("li", { children: [
            /* @__PURE__ */ y.jsx("time", { dateTime: w.at, children: eo(w.at) }),
            /* @__PURE__ */ y.jsxs("span", { children: [
              /* @__PURE__ */ y.jsx("b", { children: w.label }),
              /* @__PURE__ */ y.jsx("small", { children: w.draft })
            ] })
          ] }, T)) }) : /* @__PURE__ */ y.jsx("p", { className: "ov-muted", children: "No activity yet." })
        ] }),
        /* @__PURE__ */ y.jsxs("section", { className: "ov-card ov-quick", "aria-labelledby": "ov-quick-title", children: [
          /* @__PURE__ */ y.jsx("div", { className: "ov-card-head", children: /* @__PURE__ */ y.jsx("h2", { id: "ov-quick-title", children: "Quick start" }) }),
          /* @__PURE__ */ y.jsxs("div", { className: "ov-quick-grid", children: [
            !u && /* @__PURE__ */ y.jsxs("button", { "data-action": "generate", children: [
              /* @__PURE__ */ y.jsx(Np, { size: 18 }),
              /* @__PURE__ */ y.jsx("b", { children: "Draft from a brief" }),
              /* @__PURE__ */ y.jsx("small", { children: "Gemini writes the first version" })
            ] }),
            !u && /* @__PURE__ */ y.jsxs("button", { "data-action": "import", children: [
              /* @__PURE__ */ y.jsx(Op, { size: 18 }),
              /* @__PURE__ */ y.jsx("b", { children: "Import a document" }),
              /* @__PURE__ */ y.jsx("small", { children: "TXT, DOCX, PDF or JSON" })
            ] }),
            /* @__PURE__ */ y.jsxs("button", { "data-view": "library", children: [
              /* @__PURE__ */ y.jsx(Yx, { size: 18 }),
              /* @__PURE__ */ y.jsx("b", { children: "Ask the legal library" }),
              /* @__PURE__ */ y.jsx("small", { children: "Answers cite the exact article" })
            ] }),
            /* @__PURE__ */ y.jsxs("button", { "data-view": "data", children: [
              /* @__PURE__ */ y.jsx(Dp, { size: 18 }),
              /* @__PURE__ */ y.jsx("b", { children: "Explore the regulation map" }),
              /* @__PURE__ */ y.jsx("small", { children: "Collection across 38 provinces" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function yo(l) {
  const i = S.useRef(null);
  return i.current === null && (i.current = l()), i.current;
}
const yg = typeof window < "u", hE = yg ? S.useLayoutEffect : S.useEffect, bg = S.createContext({
  transformPagePoint: (l) => l,
  isStatic: !1,
  reducedMotion: "never"
}), Ma = /* @__NO_SIDE_EFFECTS__ */ (l) => l;
let xg = Ma;
const mE = {
  useManualTiming: !1
}, nu = [
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
function vE(l, i) {
  let u = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), o = !1, f = !1;
  const h = /* @__PURE__ */ new WeakSet();
  let m = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function v(b) {
    h.has(b) && (p.schedule(b), l()), b(m);
  }
  const p = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (b, E = !1, R = !1) => {
      const w = R && o ? u : s;
      return E && h.add(b), w.has(b) || w.add(b), b;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (b) => {
      s.delete(b), h.delete(b);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (b) => {
      if (m = b, o) {
        f = !0;
        return;
      }
      o = !0, [u, s] = [s, u], u.forEach(v), u.clear(), o = !1, f && (f = !1, p.process(b));
    }
  };
  return p;
}
const pE = 40;
function gE(l, i) {
  let u = !1, s = !0;
  const o = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, f = () => u = !0, h = nu.reduce((_, B) => (_[B] = vE(f), _), {}), { read: m, resolveKeyframes: v, update: p, preRender: b, render: E, postRender: R } = h, O = () => {
    const _ = performance.now();
    u = !1, o.delta = s ? 1e3 / 60 : Math.max(Math.min(_ - o.timestamp, pE), 1), o.timestamp = _, o.isProcessing = !0, m.process(o), v.process(o), p.process(o), b.process(o), E.process(o), R.process(o), o.isProcessing = !1, u && i && (s = !1, l(O));
  }, w = () => {
    u = !0, s = !0, o.isProcessing || l(O);
  };
  return { schedule: nu.reduce((_, B) => {
    const Y = h[B];
    return _[B] = (X, H = !1, U = !1) => (u || w(), Y.schedule(X, H, U)), _;
  }, {}), cancel: (_) => {
    for (let B = 0; B < nu.length; B++)
      h[nu[B]].cancel(_);
  }, state: o, steps: h };
}
const { schedule: _i, cancel: yE, state: mu } = /* @__PURE__ */ gE(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ma, !0), bE = (l) => (i) => typeof i == "string" && i.startsWith(l), xE = /* @__PURE__ */ bE("var(--"), SE = (l) => xE(l) ? EE.test(l.split("/*")[0].trim()) : !1, EE = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, Sg = [
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
];
new Set(Sg);
const Rv = (l) => !!(l && l.getVelocity), Cl = (l, i, u) => u > i ? i : u < l ? l : u, Eg = {
  test: (l) => typeof l == "number",
  parse: parseFloat,
  transform: (l) => l
}, Ag = {
  ...Eg,
  transform: (l) => Cl(0, 1, l)
}, AE = (l) => ({
  test: (i) => typeof i == "string" && i.endsWith(l) && i.split(" ").length === 1,
  parse: parseFloat,
  transform: (i) => `${i}${l}`
}), Ov = /* @__PURE__ */ AE("%");
function TE(l, i) {
  l.indexOf(i) === -1 && l.push(i);
}
function wE(l, i) {
  const u = l.indexOf(i);
  u > -1 && l.splice(u, 1);
}
class RE {
  constructor() {
    this.subscriptions = [];
  }
  add(i) {
    return TE(this.subscriptions, i), () => wE(this.subscriptions, i);
  }
  notify(i, u, s) {
    const o = this.subscriptions.length;
    if (o)
      if (o === 1)
        this.subscriptions[0](i, u, s);
      else
        for (let f = 0; f < o; f++) {
          const h = this.subscriptions[f];
          h && h(i, u, s);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function Tg(l, i) {
  return i ? l * (1e3 / i) : 0;
}
let uu;
function OE() {
  uu = void 0;
}
const Al = {
  now: () => (uu === void 0 && Al.set(mu.isProcessing || mE.useManualTiming ? mu.timestamp : performance.now()), uu),
  set: (l) => {
    uu = l, queueMicrotask(OE);
  }
}, Mv = 30, ME = (l) => !isNaN(parseFloat(l));
class CE {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(i, u = {}) {
    this.version = "12.6.1", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (s, o = !0) => {
      const f = Al.now();
      this.updatedAt !== f && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), o && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(i), this.owner = u.owner;
  }
  setCurrent(i) {
    this.current = i, this.updatedAt = Al.now(), this.canTrackVelocity === null && i !== void 0 && (this.canTrackVelocity = ME(this.current));
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
  on(i, u) {
    this.events[i] || (this.events[i] = new RE());
    const s = this.events[i].add(u);
    return i === "change" ? () => {
      s(), _i.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : s;
  }
  clearListeners() {
    for (const i in this.events)
      this.events[i].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(i, u) {
    this.passiveEffect = i, this.stopPassiveEffect = u;
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
  set(i, u = !0) {
    !u || !this.passiveEffect ? this.updateAndNotify(i, u) : this.passiveEffect(i, this.updateAndNotify);
  }
  setWithVelocity(i, u, s) {
    this.set(u), this.prev = void 0, this.prevFrameValue = i, this.prevUpdatedAt = this.updatedAt - s;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(i, u = !0) {
    this.updateAndNotify(i), this.prev = i, this.prevUpdatedAt = this.prevFrameValue = void 0, u && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
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
    const i = Al.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || i - this.updatedAt > Mv)
      return 0;
    const u = Math.min(this.updatedAt - this.prevUpdatedAt, Mv);
    return Tg(parseFloat(this.current) - parseFloat(this.prevFrameValue), u);
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
    return this.stop(), new Promise((u) => {
      this.hasAnimated = !0, this.animation = i(u), this.events.animationStart && this.events.animationStart.notify();
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
function DE(l, i) {
  return new CE(l, i);
}
const Wo = /* @__NO_SIDE_EFFECTS__ */ (l) => l * 1e3, Sa = /* @__NO_SIDE_EFFECTS__ */ (l) => l / 1e3;
function wg(l) {
  return typeof l == "function";
}
const NE = (l) => Array.isArray(l) && typeof l[0] == "number", Fo = /* @__NO_SIDE_EFFECTS__ */ (l, i, u) => {
  const s = i - l;
  return s === 0 ? 1 : (u - l) / s;
}, zE = (l, i, u = 10) => {
  let s = "";
  const o = Math.max(Math.round(i / u), 2);
  for (let f = 0; f < o; f++)
    s += l(/* @__PURE__ */ Fo(0, o - 1, f)) + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, Rg = (l, i, u) => (((1 - 3 * u + 3 * i) * l + (3 * u - 6 * i)) * l + 3 * i) * l, _E = 1e-7, jE = 12;
function UE(l, i, u, s, o) {
  let f, h, m = 0;
  do
    h = i + (u - i) / 2, f = Rg(h, s, o) - l, f > 0 ? u = h : i = h;
  while (Math.abs(f) > _E && ++m < jE);
  return h;
}
function Hi(l, i, u, s) {
  if (l === i && u === s)
    return Ma;
  const o = (f) => UE(f, 0, 1, l, u);
  return (f) => f === 0 || f === 1 ? f : Rg(o(f), i, s);
}
const Og = (l) => (i) => i <= 0.5 ? l(2 * i) / 2 : (2 - l(2 * (1 - i))) / 2, Mg = (l) => (i) => 1 - l(1 - i), Cg = /* @__PURE__ */ Hi(0.33, 1.53, 0.69, 0.99), $o = /* @__PURE__ */ Mg(Cg), HE = /* @__PURE__ */ Og($o), LE = (l) => (l *= 2) < 1 ? 0.5 * $o(l) : 0.5 * (2 - Math.pow(2, -10 * (l - 1))), Po = (l) => 1 - Math.sin(Math.acos(l)), BE = Mg(Po), qE = Og(Po), Ci = (l) => Math.round(l * 1e5) / 1e5, Dg = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function kE(l) {
  return l == null;
}
const GE = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Io = (l, i) => (u) => !!(typeof u == "string" && GE.test(u) && u.startsWith(l) || i && !kE(u) && Object.prototype.hasOwnProperty.call(u, i)), Ng = (l, i, u) => (s) => {
  if (typeof s != "string")
    return s;
  const [o, f, h, m] = s.match(Dg);
  return {
    [l]: parseFloat(o),
    [i]: parseFloat(f),
    [u]: parseFloat(h),
    alpha: m !== void 0 ? parseFloat(m) : 1
  };
}, VE = (l) => Cl(0, 255, l), no = {
  ...Eg,
  transform: (l) => Math.round(VE(l))
}, El = {
  test: /* @__PURE__ */ Io("rgb", "red"),
  parse: /* @__PURE__ */ Ng("red", "green", "blue"),
  transform: ({ red: l, green: i, blue: u, alpha: s = 1 }) => "rgba(" + no.transform(l) + ", " + no.transform(i) + ", " + no.transform(u) + ", " + Ci(Ag.transform(s)) + ")"
};
function YE(l) {
  let i = "", u = "", s = "", o = "";
  return l.length > 5 ? (i = l.substring(1, 3), u = l.substring(3, 5), s = l.substring(5, 7), o = l.substring(7, 9)) : (i = l.substring(1, 2), u = l.substring(2, 3), s = l.substring(3, 4), o = l.substring(4, 5), i += i, u += u, s += s, o += o), {
    red: parseInt(i, 16),
    green: parseInt(u, 16),
    blue: parseInt(s, 16),
    alpha: o ? parseInt(o, 16) / 255 : 1
  };
}
const bo = {
  test: /* @__PURE__ */ Io("#"),
  parse: YE,
  transform: El.transform
}, ga = {
  test: /* @__PURE__ */ Io("hsl", "hue"),
  parse: /* @__PURE__ */ Ng("hue", "saturation", "lightness"),
  transform: ({ hue: l, saturation: i, lightness: u, alpha: s = 1 }) => "hsla(" + Math.round(l) + ", " + Ov.transform(Ci(i)) + ", " + Ov.transform(Ci(u)) + ", " + Ci(Ag.transform(s)) + ")"
}, ji = {
  test: (l) => El.test(l) || bo.test(l) || ga.test(l),
  parse: (l) => El.test(l) ? El.parse(l) : ga.test(l) ? ga.parse(l) : bo.parse(l),
  transform: (l) => typeof l == "string" ? l : l.hasOwnProperty("red") ? El.transform(l) : ga.transform(l)
}, XE = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function QE(l) {
  var i, u;
  return isNaN(l) && typeof l == "string" && (((i = l.match(Dg)) === null || i === void 0 ? void 0 : i.length) || 0) + (((u = l.match(XE)) === null || u === void 0 ? void 0 : u.length) || 0) > 0;
}
const zg = "number", _g = "color", ZE = "var", KE = "var(", Cv = "${}", JE = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function vu(l) {
  const i = l.toString(), u = [], s = {
    color: [],
    number: [],
    var: []
  }, o = [];
  let f = 0;
  const m = i.replace(JE, (v) => (ji.test(v) ? (s.color.push(f), o.push(_g), u.push(ji.parse(v))) : v.startsWith(KE) ? (s.var.push(f), o.push(ZE), u.push(v)) : (s.number.push(f), o.push(zg), u.push(parseFloat(v))), ++f, Cv)).split(Cv);
  return { values: u, split: m, indexes: s, types: o };
}
function jg(l) {
  return vu(l).values;
}
function Ug(l) {
  const { split: i, types: u } = vu(l), s = i.length;
  return (o) => {
    let f = "";
    for (let h = 0; h < s; h++)
      if (f += i[h], o[h] !== void 0) {
        const m = u[h];
        m === zg ? f += Ci(o[h]) : m === _g ? f += ji.transform(o[h]) : f += o[h];
      }
    return f;
  };
}
const WE = (l) => typeof l == "number" ? 0 : l;
function FE(l) {
  const i = jg(l);
  return Ug(l)(i.map(WE));
}
const Hg = {
  test: QE,
  parse: jg,
  createTransformer: Ug,
  getAnimatableNone: FE
}, $E = /* @__PURE__ */ new Set(["x", "y", "z"]), PE = Sg.filter((l) => !$E.has(l));
function IE(l) {
  const i = [];
  return PE.forEach((u) => {
    const s = l.getValue(u);
    s !== void 0 && (i.push([u, s.get()]), s.set(u.startsWith("scale") ? 1 : 0));
  }), i;
}
const Tl = /* @__PURE__ */ new Set();
let xo = !1, So = !1;
function Lg() {
  if (So) {
    const l = Array.from(Tl).filter((s) => s.needsMeasurement), i = new Set(l.map((s) => s.element)), u = /* @__PURE__ */ new Map();
    i.forEach((s) => {
      const o = IE(s);
      o.length && (u.set(s, o), s.render());
    }), l.forEach((s) => s.measureInitialState()), i.forEach((s) => {
      s.render();
      const o = u.get(s);
      o && o.forEach(([f, h]) => {
        var m;
        (m = s.getValue(f)) === null || m === void 0 || m.set(h);
      });
    }), l.forEach((s) => s.measureEndState()), l.forEach((s) => {
      s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY);
    });
  }
  So = !1, xo = !1, Tl.forEach((l) => l.complete()), Tl.clear();
}
function Bg() {
  Tl.forEach((l) => {
    l.readKeyframes(), l.needsMeasurement && (So = !0);
  });
}
function eA() {
  Bg(), Lg();
}
class tA {
  constructor(i, u, s, o, f, h = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...i], this.onComplete = u, this.name = s, this.motionValue = o, this.element = f, this.isAsync = h;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (Tl.add(this), xo || (xo = !0, _i.read(Bg), _i.resolveKeyframes(Lg))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: i, name: u, element: s, motionValue: o } = this;
    for (let f = 0; f < i.length; f++)
      if (i[f] === null)
        if (f === 0) {
          const h = o == null ? void 0 : o.get(), m = i[i.length - 1];
          if (h !== void 0)
            i[0] = h;
          else if (s && u) {
            const v = s.readValue(u, m);
            v != null && (i[0] = v);
          }
          i[0] === void 0 && (i[0] = m), o && h === void 0 && o.set(i[0]);
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
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), Tl.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, Tl.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const Dv = (l, i) => i === "zIndex" ? !1 : !!(typeof l == "number" || Array.isArray(l) || typeof l == "string" && // It's animatable if we have a string
(Hg.test(l) || l === "0") && // And it contains numbers and/or colors
!l.startsWith("url("));
function nA(l) {
  const i = l[0];
  if (l.length === 1)
    return !0;
  for (let u = 0; u < l.length; u++)
    if (l[u] !== i)
      return !0;
}
function lA(l, i, u, s) {
  const o = l[0];
  if (o === null)
    return !1;
  if (i === "display" || i === "visibility")
    return !0;
  const f = l[l.length - 1], h = Dv(o, i), m = Dv(f, i);
  return !h || !m ? !1 : nA(l) || (u === "spring" || wg(u)) && s;
}
const aA = (l) => l !== null;
function qg(l, { repeat: i, repeatType: u = "loop" }, s) {
  const o = l.filter(aA), f = i && u !== "loop" && i % 2 === 1 ? 0 : o.length - 1;
  return !f || s === void 0 ? o[f] : s;
}
const iA = 40;
class rA {
  constructor({ autoplay: i = !0, delay: u = 0, type: s = "keyframes", repeat: o = 0, repeatDelay: f = 0, repeatType: h = "loop", ...m }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = Al.now(), this.options = {
      autoplay: i,
      delay: u,
      type: s,
      repeat: o,
      repeatDelay: f,
      repeatType: h,
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
    return this.resolvedAt ? this.resolvedAt - this.createdAt > iA ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && eA(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(i, u) {
    this.resolvedAt = Al.now(), this.hasAttemptedResolve = !0;
    const { name: s, type: o, velocity: f, delay: h, onComplete: m, onUpdate: v, isGenerator: p } = this.options;
    if (!p && !lA(i, s, o, f))
      if (h)
        this.options.duration = 0;
      else {
        v && v(qg(i, this.options, u)), m && m(), this.resolveFinishedPromise();
        return;
      }
    const b = this.initPlayback(i, u);
    b !== !1 && (this._resolved = {
      keyframes: i,
      finalKeyframe: u,
      ...b
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(i, u) {
    return this.currentFinishedPromise.then(i, u);
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
const Eo = 2e4;
function kg(l) {
  let i = 0;
  const u = 50;
  let s = l.next(i);
  for (; !s.done && i < Eo; )
    i += u, s = l.next(i);
  return i >= Eo ? 1 / 0 : i;
}
const Cu = (l, i, u) => l + (i - l) * u;
function lo(l, i, u) {
  return u < 0 && (u += 1), u > 1 && (u -= 1), u < 1 / 6 ? l + (i - l) * 6 * u : u < 1 / 2 ? i : u < 2 / 3 ? l + (i - l) * (2 / 3 - u) * 6 : l;
}
function uA({ hue: l, saturation: i, lightness: u, alpha: s }) {
  l /= 360, i /= 100, u /= 100;
  let o = 0, f = 0, h = 0;
  if (!i)
    o = f = h = u;
  else {
    const m = u < 0.5 ? u * (1 + i) : u + i - u * i, v = 2 * u - m;
    o = lo(v, m, l + 1 / 3), f = lo(v, m, l), h = lo(v, m, l - 1 / 3);
  }
  return {
    red: Math.round(o * 255),
    green: Math.round(f * 255),
    blue: Math.round(h * 255),
    alpha: s
  };
}
function pu(l, i) {
  return (u) => u > 0 ? i : l;
}
const ao = (l, i, u) => {
  const s = l * l, o = u * (i * i - s) + s;
  return o < 0 ? 0 : Math.sqrt(o);
}, sA = [bo, El, ga], cA = (l) => sA.find((i) => i.test(l));
function Nv(l) {
  const i = cA(l);
  if (!i)
    return !1;
  let u = i.parse(l);
  return i === ga && (u = uA(u)), u;
}
const zv = (l, i) => {
  const u = Nv(l), s = Nv(i);
  if (!u || !s)
    return pu(l, i);
  const o = { ...u };
  return (f) => (o.red = ao(u.red, s.red, f), o.green = ao(u.green, s.green, f), o.blue = ao(u.blue, s.blue, f), o.alpha = Cu(u.alpha, s.alpha, f), El.transform(o));
}, oA = (l, i) => (u) => i(l(u)), ef = (...l) => l.reduce(oA), Ao = /* @__PURE__ */ new Set(["none", "hidden"]);
function fA(l, i) {
  return Ao.has(l) ? (u) => u <= 0 ? l : i : (u) => u >= 1 ? i : l;
}
function dA(l, i) {
  return (u) => Cu(l, i, u);
}
function tf(l) {
  return typeof l == "number" ? dA : typeof l == "string" ? SE(l) ? pu : ji.test(l) ? zv : vA : Array.isArray(l) ? Gg : typeof l == "object" ? ji.test(l) ? zv : hA : pu;
}
function Gg(l, i) {
  const u = [...l], s = u.length, o = l.map((f, h) => tf(f)(f, i[h]));
  return (f) => {
    for (let h = 0; h < s; h++)
      u[h] = o[h](f);
    return u;
  };
}
function hA(l, i) {
  const u = { ...l, ...i }, s = {};
  for (const o in u)
    l[o] !== void 0 && i[o] !== void 0 && (s[o] = tf(l[o])(l[o], i[o]));
  return (o) => {
    for (const f in s)
      u[f] = s[f](o);
    return u;
  };
}
function mA(l, i) {
  var u;
  const s = [], o = { color: 0, var: 0, number: 0 };
  for (let f = 0; f < i.values.length; f++) {
    const h = i.types[f], m = l.indexes[h][o[h]], v = (u = l.values[m]) !== null && u !== void 0 ? u : 0;
    s[f] = v, o[h]++;
  }
  return s;
}
const vA = (l, i) => {
  const u = Hg.createTransformer(i), s = vu(l), o = vu(i);
  return s.indexes.var.length === o.indexes.var.length && s.indexes.color.length === o.indexes.color.length && s.indexes.number.length >= o.indexes.number.length ? Ao.has(l) && !o.values.length || Ao.has(i) && !s.values.length ? fA(l, i) : ef(Gg(mA(s, o), o.values), u) : pu(l, i);
};
function Vg(l, i, u) {
  return typeof l == "number" && typeof i == "number" && typeof u == "number" ? Cu(l, i, u) : tf(l)(l, i);
}
const pA = 5;
function Yg(l, i, u) {
  const s = Math.max(i - pA, 0);
  return Tg(u - l(s), i - s);
}
const ke = {
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
}, io = 1e-3;
function gA({ duration: l = ke.duration, bounce: i = ke.bounce, velocity: u = ke.velocity, mass: s = ke.mass }) {
  let o, f, h = 1 - i;
  h = Cl(ke.minDamping, ke.maxDamping, h), l = Cl(ke.minDuration, ke.maxDuration, /* @__PURE__ */ Sa(l)), h < 1 ? (o = (p) => {
    const b = p * h, E = b * l, R = b - u, O = To(p, h), w = Math.exp(-E);
    return io - R / O * w;
  }, f = (p) => {
    const E = p * h * l, R = E * u + u, O = Math.pow(h, 2) * Math.pow(p, 2) * l, w = Math.exp(-E), T = To(Math.pow(p, 2), h);
    return (-o(p) + io > 0 ? -1 : 1) * ((R - O) * w) / T;
  }) : (o = (p) => {
    const b = Math.exp(-p * l), E = (p - u) * l + 1;
    return -io + b * E;
  }, f = (p) => {
    const b = Math.exp(-p * l), E = (u - p) * (l * l);
    return b * E;
  });
  const m = 5 / l, v = bA(o, f, m);
  if (l = /* @__PURE__ */ Wo(l), isNaN(v))
    return {
      stiffness: ke.stiffness,
      damping: ke.damping,
      duration: l
    };
  {
    const p = Math.pow(v, 2) * s;
    return {
      stiffness: p,
      damping: h * 2 * Math.sqrt(s * p),
      duration: l
    };
  }
}
const yA = 12;
function bA(l, i, u) {
  let s = u;
  for (let o = 1; o < yA; o++)
    s = s - l(s) / i(s);
  return s;
}
function To(l, i) {
  return l * Math.sqrt(1 - i * i);
}
const xA = ["duration", "bounce"], SA = ["stiffness", "damping", "mass"];
function _v(l, i) {
  return i.some((u) => l[u] !== void 0);
}
function EA(l) {
  let i = {
    velocity: ke.velocity,
    stiffness: ke.stiffness,
    damping: ke.damping,
    mass: ke.mass,
    isResolvedFromDuration: !1,
    ...l
  };
  if (!_v(l, SA) && _v(l, xA))
    if (l.visualDuration) {
      const u = l.visualDuration, s = 2 * Math.PI / (u * 1.2), o = s * s, f = 2 * Cl(0.05, 1, 1 - (l.bounce || 0)) * Math.sqrt(o);
      i = {
        ...i,
        mass: ke.mass,
        stiffness: o,
        damping: f
      };
    } else {
      const u = gA(l);
      i = {
        ...i,
        ...u,
        mass: ke.mass
      }, i.isResolvedFromDuration = !0;
    }
  return i;
}
function Xg(l = ke.visualDuration, i = ke.bounce) {
  const u = typeof l != "object" ? {
    visualDuration: l,
    keyframes: [0, 1],
    bounce: i
  } : l;
  let { restSpeed: s, restDelta: o } = u;
  const f = u.keyframes[0], h = u.keyframes[u.keyframes.length - 1], m = { done: !1, value: f }, { stiffness: v, damping: p, mass: b, duration: E, velocity: R, isResolvedFromDuration: O } = EA({
    ...u,
    velocity: -/* @__PURE__ */ Sa(u.velocity || 0)
  }), w = R || 0, T = p / (2 * Math.sqrt(v * b)), z = h - f, _ = /* @__PURE__ */ Sa(Math.sqrt(v / b)), B = Math.abs(z) < 5;
  s || (s = B ? ke.restSpeed.granular : ke.restSpeed.default), o || (o = B ? ke.restDelta.granular : ke.restDelta.default);
  let Y;
  if (T < 1) {
    const H = To(_, T);
    Y = (U) => {
      const K = Math.exp(-T * _ * U);
      return h - K * ((w + T * _ * z) / H * Math.sin(H * U) + z * Math.cos(H * U));
    };
  } else if (T === 1)
    Y = (H) => h - Math.exp(-_ * H) * (z + (w + _ * z) * H);
  else {
    const H = _ * Math.sqrt(T * T - 1);
    Y = (U) => {
      const K = Math.exp(-T * _ * U), W = Math.min(H * U, 300);
      return h - K * ((w + T * _ * z) * Math.sinh(W) + H * z * Math.cosh(W)) / H;
    };
  }
  const X = {
    calculatedDuration: O && E || null,
    next: (H) => {
      const U = Y(H);
      if (O)
        m.done = H >= E;
      else {
        let K = 0;
        T < 1 && (K = H === 0 ? /* @__PURE__ */ Wo(w) : Yg(Y, H, U));
        const W = Math.abs(K) <= s, J = Math.abs(h - U) <= o;
        m.done = W && J;
      }
      return m.value = m.done ? h : U, m;
    },
    toString: () => {
      const H = Math.min(kg(X), Eo), U = zE((K) => X.next(H * K).value, H, 30);
      return H + "ms " + U;
    }
  };
  return X;
}
function jv({ keyframes: l, velocity: i = 0, power: u = 0.8, timeConstant: s = 325, bounceDamping: o = 10, bounceStiffness: f = 500, modifyTarget: h, min: m, max: v, restDelta: p = 0.5, restSpeed: b }) {
  const E = l[0], R = {
    done: !1,
    value: E
  }, O = (W) => m !== void 0 && W < m || v !== void 0 && W > v, w = (W) => m === void 0 ? v : v === void 0 || Math.abs(m - W) < Math.abs(v - W) ? m : v;
  let T = u * i;
  const z = E + T, _ = h === void 0 ? z : h(z);
  _ !== z && (T = _ - E);
  const B = (W) => -T * Math.exp(-W / s), Y = (W) => _ + B(W), X = (W) => {
    const J = B(W), F = Y(W);
    R.done = Math.abs(J) <= p, R.value = R.done ? _ : F;
  };
  let H, U;
  const K = (W) => {
    O(R.value) && (H = W, U = Xg({
      keyframes: [R.value, w(R.value)],
      velocity: Yg(Y, W, R.value),
      // TODO: This should be passing * 1000
      damping: o,
      stiffness: f,
      restDelta: p,
      restSpeed: b
    }));
  };
  return K(0), {
    calculatedDuration: null,
    next: (W) => {
      let J = !1;
      return !U && H === void 0 && (J = !0, X(W), K(W)), H !== void 0 && W >= H ? U.next(W - H) : (!J && X(W), R);
    }
  };
}
const AA = /* @__PURE__ */ Hi(0.42, 0, 1, 1), TA = /* @__PURE__ */ Hi(0, 0, 0.58, 1), Qg = /* @__PURE__ */ Hi(0.42, 0, 0.58, 1), wA = (l) => Array.isArray(l) && typeof l[0] != "number", RA = {
  linear: Ma,
  easeIn: AA,
  easeInOut: Qg,
  easeOut: TA,
  circIn: Po,
  circInOut: qE,
  circOut: BE,
  backIn: $o,
  backInOut: HE,
  backOut: Cg,
  anticipate: LE
}, Uv = (l) => {
  if (NE(l)) {
    xg(l.length === 4);
    const [i, u, s, o] = l;
    return Hi(i, u, s, o);
  } else if (typeof l == "string")
    return RA[l];
  return l;
};
function OA(l, i, u) {
  const s = [], o = u || Vg, f = l.length - 1;
  for (let h = 0; h < f; h++) {
    let m = o(l[h], l[h + 1]);
    if (i) {
      const v = Array.isArray(i) ? i[h] || Ma : i;
      m = ef(v, m);
    }
    s.push(m);
  }
  return s;
}
function MA(l, i, { clamp: u = !0, ease: s, mixer: o } = {}) {
  const f = l.length;
  if (xg(f === i.length), f === 1)
    return () => i[0];
  if (f === 2 && i[0] === i[1])
    return () => i[1];
  const h = l[0] === l[1];
  l[0] > l[f - 1] && (l = [...l].reverse(), i = [...i].reverse());
  const m = OA(i, s, o), v = m.length, p = (b) => {
    if (h && b < l[0])
      return i[0];
    let E = 0;
    if (v > 1)
      for (; E < l.length - 2 && !(b < l[E + 1]); E++)
        ;
    const R = /* @__PURE__ */ Fo(l[E], l[E + 1], b);
    return m[E](R);
  };
  return u ? (b) => p(Cl(l[0], l[f - 1], b)) : p;
}
function CA(l, i) {
  const u = l[l.length - 1];
  for (let s = 1; s <= i; s++) {
    const o = /* @__PURE__ */ Fo(0, i, s);
    l.push(Cu(u, 1, o));
  }
}
function DA(l) {
  const i = [0];
  return CA(i, l.length - 1), i;
}
function NA(l, i) {
  return l.map((u) => u * i);
}
function zA(l, i) {
  return l.map(() => i || Qg).splice(0, l.length - 1);
}
function gu({ duration: l = 300, keyframes: i, times: u, ease: s = "easeInOut" }) {
  const o = wA(s) ? s.map(Uv) : Uv(s), f = {
    done: !1,
    value: i[0]
  }, h = NA(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    u && u.length === i.length ? u : DA(i),
    l
  ), m = MA(h, i, {
    ease: Array.isArray(o) ? o : zA(i, o)
  });
  return {
    calculatedDuration: l,
    next: (v) => (f.value = m(v), f.done = v >= l, f)
  };
}
const _A = (l) => {
  const i = ({ timestamp: u }) => l(u);
  return {
    start: () => _i.update(i, !0),
    stop: () => yE(i),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => mu.isProcessing ? mu.timestamp : Al.now()
  };
}, jA = {
  decay: jv,
  inertia: jv,
  tween: gu,
  keyframes: gu,
  spring: Xg
}, UA = (l) => l / 100;
class HA extends rA {
  constructor(i) {
    super(i), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: v } = this.options;
      v && v();
    };
    const { name: u, motionValue: s, element: o, keyframes: f } = this.options, h = (o == null ? void 0 : o.KeyframeResolver) || tA, m = (v, p) => this.onKeyframesResolved(v, p);
    this.resolver = new h(f, m, u, s, o), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(i) {
    const { type: u = "keyframes", repeat: s = 0, repeatDelay: o = 0, repeatType: f, velocity: h = 0 } = this.options, m = wg(u) ? u : jA[u] || gu;
    let v, p;
    m !== gu && typeof i[0] != "number" && (v = ef(UA, Vg(i[0], i[1])), i = [0, 100]);
    const b = m({ ...this.options, keyframes: i });
    f === "mirror" && (p = m({
      ...this.options,
      keyframes: [...i].reverse(),
      velocity: -h
    })), b.calculatedDuration === null && (b.calculatedDuration = kg(b));
    const { calculatedDuration: E } = b, R = E + o, O = R * (s + 1) - o;
    return {
      generator: b,
      mirroredGenerator: p,
      mapPercentToKeyframes: v,
      calculatedDuration: E,
      resolvedDuration: R,
      totalDuration: O
    };
  }
  onPostResolved() {
    const { autoplay: i = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !i ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(i, u = !1) {
    const { resolved: s } = this;
    if (!s) {
      const { keyframes: W } = this.options;
      return { done: !0, value: W[W.length - 1] };
    }
    const { finalKeyframe: o, generator: f, mirroredGenerator: h, mapPercentToKeyframes: m, keyframes: v, calculatedDuration: p, totalDuration: b, resolvedDuration: E } = s;
    if (this.startTime === null)
      return f.next(0);
    const { delay: R, repeat: O, repeatType: w, repeatDelay: T, onUpdate: z } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, i) : this.speed < 0 && (this.startTime = Math.min(i - b / this.speed, this.startTime)), u ? this.currentTime = i : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(i - this.startTime) * this.speed;
    const _ = this.currentTime - R * (this.speed >= 0 ? 1 : -1), B = this.speed >= 0 ? _ < 0 : _ > b;
    this.currentTime = Math.max(_, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = b);
    let Y = this.currentTime, X = f;
    if (O) {
      const W = Math.min(this.currentTime, b) / E;
      let J = Math.floor(W), F = W % 1;
      !F && W >= 1 && (F = 1), F === 1 && J--, J = Math.min(J, O + 1), !!(J % 2) && (w === "reverse" ? (F = 1 - F, T && (F -= T / E)) : w === "mirror" && (X = h)), Y = Cl(0, 1, F) * E;
    }
    const H = B ? { done: !1, value: v[0] } : X.next(Y);
    m && (H.value = m(H.value));
    let { done: U } = H;
    !B && p !== null && (U = this.speed >= 0 ? this.currentTime >= b : this.currentTime <= 0);
    const K = this.holdTime === null && (this.state === "finished" || this.state === "running" && U);
    return K && o !== void 0 && (H.value = qg(v, this.options, o)), z && z(H.value), K && this.finish(), H;
  }
  get duration() {
    const { resolved: i } = this;
    return i ? /* @__PURE__ */ Sa(i.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ Sa(this.currentTime);
  }
  set time(i) {
    i = /* @__PURE__ */ Wo(i), this.currentTime = i, this.holdTime !== null || this.speed === 0 ? this.holdTime = i : this.driver && (this.startTime = this.driver.now() - i / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(i) {
    const u = this.playbackSpeed !== i;
    this.playbackSpeed = i, u && (this.time = /* @__PURE__ */ Sa(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: i = _A, onPlay: u, startTime: s } = this.options;
    this.driver || (this.driver = i((f) => this.tick(f))), u && u();
    const o = this.driver.now();
    this.holdTime !== null ? this.startTime = o - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = o) : this.startTime = s ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
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
function LA(l) {
  return new HA(l);
}
function BA(l, i, u) {
  var s;
  if (l instanceof EventTarget)
    return [l];
  if (typeof l == "string") {
    let o = document;
    const f = (s = void 0) !== null && s !== void 0 ? s : o.querySelectorAll(l);
    return f ? Array.from(f) : [];
  }
  return Array.from(l);
}
const wo = { current: null }, Zg = { current: !1 };
function qA() {
  if (Zg.current = !0, !!yg)
    if (window.matchMedia) {
      const l = window.matchMedia("(prefers-reduced-motion)"), i = () => wo.current = l.matches;
      l.addListener(i), i();
    } else
      wo.current = !1;
}
function Kg(l) {
  const i = yo(() => DE(l)), { isStatic: u } = S.useContext(bg);
  if (u) {
    const [, s] = S.useState(l);
    S.useEffect(() => i.on("change", s), []);
  }
  return i;
}
function kA(l, i = {}) {
  const { isStatic: u } = S.useContext(bg), s = S.useRef(null), o = yo(() => Rv(l) ? l.get() : l), f = yo(() => typeof o == "string" ? o.replace(/[\d.-]/g, "") : void 0), h = Kg(o), m = S.useRef(o), v = S.useRef(Ma), p = () => {
    b(), s.current = LA({
      keyframes: [Lv(h.get()), Lv(m.current)],
      velocity: h.getVelocity(),
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...i,
      onUpdate: v.current
    });
  }, b = () => {
    s.current && s.current.stop();
  };
  return S.useInsertionEffect(() => h.attach((E, R) => u ? R(E) : (m.current = E, v.current = (O) => R(Hv(O, f)), _i.postRender(p), h.get()), b), [JSON.stringify(i)]), hE(() => {
    if (Rv(l))
      return l.on("change", (E) => h.set(Hv(E, f)));
  }, [h, f]), h;
}
function Hv(l, i) {
  return i ? l + i : l;
}
function Lv(l) {
  return typeof l == "number" ? l : parseFloat(l);
}
function GA() {
  !Zg.current && qA();
  const [l] = S.useState(wo.current);
  return l;
}
const VA = {
  some: 0,
  all: 1
};
function YA(l, i, { root: u, margin: s, amount: o = "some" } = {}) {
  const f = BA(l), h = /* @__PURE__ */ new WeakMap(), m = (p) => {
    p.forEach((b) => {
      const E = h.get(b.target);
      if (b.isIntersecting !== !!E)
        if (b.isIntersecting) {
          const R = i(b.target, b);
          typeof R == "function" ? h.set(b.target, R) : v.unobserve(b.target);
        } else typeof E == "function" && (E(b), h.delete(b.target));
    });
  }, v = new IntersectionObserver(m, {
    root: u,
    rootMargin: s,
    threshold: typeof o == "number" ? o : VA[o]
  });
  return f.forEach((p) => v.observe(p)), () => v.disconnect();
}
function XA(l, { root: i, margin: u, amount: s, once: o = !1, initial: f = !1 } = {}) {
  const [h, m] = S.useState(f);
  return S.useEffect(() => {
    if (!l.current || o && h)
      return;
    const v = () => (m(!0), o ? void 0 : () => m(!1)), p = {
      root: i && i.current || void 0,
      margin: u,
      amount: s
    };
    return YA(l.current, v, p);
  }, [i, l, u, o, s]), h;
}
function QA(...l) {
  return pg(Qo(l));
}
typeof globalThis < "u" && typeof globalThis.IntersectionObserver > "u" && (globalThis.IntersectionObserver = class {
  constructor(i) {
    Ri(this, "root", null);
    Ri(this, "rootMargin", "0px");
    Ri(this, "thresholds", [0]);
    Ri(this, "callback");
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
const ZA = {
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
function su({
  value: l,
  startValue: i = 0,
  direction: u = "up",
  delay: s = 0,
  className: o,
  decimalPlaces: f = 0,
  locale: h = "id-ID",
  ...m
}) {
  const v = S.useRef(null), p = S.useRef(null), b = S.useRef(!1), E = GA(), R = u === "down" ? l : i, O = u === "down" ? i : l, w = (Y) => Intl.NumberFormat(h, {
    minimumFractionDigits: f,
    maximumFractionDigits: f
  }).format(Number(Y.toFixed(f))), T = S.useRef(
    w(E || O === R ? O : R)
  ), z = Kg(E ? O : R), _ = kA(z, {
    damping: 60,
    stiffness: 100
  }), B = XA(v, { once: !0, margin: "0px" });
  return S.useEffect(() => {
    var H;
    if (E) {
      z.set(O);
      const U = w(O);
      T.current = U, (H = p.current) == null || H.setAttribute("data-ticker-value", U);
      return;
    }
    if (!B) return;
    const Y = b.current ? 0 : s, X = setTimeout(() => {
      b.current = !0, z.set(O);
    }, Y * 1e3);
    return () => clearTimeout(X);
  }, [z, B, s, O, E, f, h]), S.useEffect(
    () => _.on("change", (Y) => {
      var H;
      const X = w(Y);
      T.current = X, (H = p.current) == null || H.setAttribute("data-ticker-value", X);
    }),
    [_, f, h]
  ), /* @__PURE__ */ y.jsxs(
    "span",
    {
      ref: v,
      className: QA("inline-block tabular-nums tracking-tight number-ticker", o),
      "data-ticker-target": O,
      ...m,
      children: [
        /* @__PURE__ */ y.jsx("span", { className: "number-ticker-sr", style: ZA, children: w(O) }),
        /* @__PURE__ */ y.jsx(
          "span",
          {
            ref: p,
            className: "number-ticker-visual",
            "aria-hidden": "true",
            "data-ticker-value": T.current
          }
        )
      ]
    }
  );
}
const yu = [], Bv = /* @__PURE__ */ new WeakMap();
let qv = !1, ya = null;
function Jg(l, i) {
  let u = Bv.get(l);
  return u || (u = Di.createRoot(l, { identifierPrefix: i }), Bv.set(l, u)), u;
}
function FA(l, i) {
  if (!l) return;
  const u = Jg(l, "collection-stats-");
  vn.flushSync(() => {
    u.render(
      /* @__PURE__ */ y.jsx(y.Fragment, { children: i.map((s, o) => /* @__PURE__ */ y.jsxs("div", { className: `collection-stat collection-stat-${s.tone}`, children: [
        /* @__PURE__ */ y.jsxs("div", { className: "collection-stat-top", children: [
          /* @__PURE__ */ y.jsx("span", { children: s.title }),
          /* @__PURE__ */ y.jsx(
            "span",
            {
              className: `collection-visual-icon collection-icon-${s.tone}`,
              "aria-hidden": "true",
              dangerouslySetInnerHTML: { __html: s.iconHtml }
            }
          )
        ] }),
        /* @__PURE__ */ y.jsx("strong", { children: Array.isArray(s.value) ? /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
          /* @__PURE__ */ y.jsx(su, { value: s.value[0], delay: o * 0.06 }),
          " / ",
          /* @__PURE__ */ y.jsx(su, { value: s.value[1], delay: o * 0.06 + 0.04 })
        ] }) : /* @__PURE__ */ y.jsx(su, { value: s.value, delay: o * 0.06 }) }),
        /* @__PURE__ */ y.jsx("small", { children: s.caption })
      ] }, s.title)) })
    );
  });
}
function $A(l, i, u) {
  if (!l) return;
  const s = Jg(l, "ticker-");
  vn.flushSync(() => {
    s.render(
      /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
        /* @__PURE__ */ y.jsx(
          su,
          {
            value: i,
            startValue: (u == null ? void 0 : u.startValue) ?? 0,
            delay: (u == null ? void 0 : u.delay) ?? 0
          }
        ),
        u != null && u.suffix ? /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
          " ",
          /* @__PURE__ */ y.jsx("span", { children: u.suffix })
        ] }) : null
      ] })
    );
  });
}
function PA() {
  if (qv) return;
  const l = document.querySelector("#workspace-sidebar"), i = document.querySelector("#framework-tools");
  if (!l || !i) return;
  qv = !0, document.body.classList.add("framework-ready");
  const u = Di.createRoot(l, { identifierPrefix: "nav-" }), s = Di.createRoot(i, { identifierPrefix: "cmd-" });
  vn.flushSync(() => {
    u.render(/* @__PURE__ */ y.jsx(nS, {})), s.render(/* @__PURE__ */ y.jsx(lE, {}));
  });
}
function IA() {
  var l;
  for (; yu.length; ) (l = yu.pop()) == null || l.unmount();
  ya = null;
}
function eT(l) {
  if (l.view === "data") return;
  const i = document.querySelector("#framework-home");
  if (i) {
    const f = Di.createRoot(i, { identifierPrefix: "home-" });
    yu.push(f), ya = f, vn.flushSync(() => f.render(/* @__PURE__ */ y.jsx(gg, { state: l })));
    return;
  }
  const u = document.querySelector("#main .page-heading,#main .enterprise-heading");
  if (!u) return;
  const s = document.createElement("div");
  s.className = "framework-context", u.after(s);
  const o = Di.createRoot(s, { identifierPrefix: "flow-" });
  yu.push(o), vn.flushSync(() => o.render(/* @__PURE__ */ y.jsx(aE, { state: l })));
}
function tT(l) {
  ya && l.view === "home" && vn.flushSync(() => ya == null ? void 0 : ya.render(/* @__PURE__ */ y.jsx(gg, { state: l })));
}
export {
  su as NumberTicker,
  IA as disposePageComponents,
  PA as initializeFrameworkShell,
  tT as refreshFrameworkStatus,
  FA as renderCollectionStats,
  eT as renderFrameworkComponents,
  $A as renderNumberTicker
};
