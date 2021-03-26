(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{150:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return s}));var r=n(0),a=n.n(r);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var b=a.a.createContext({}),i=function(e){var t=a.a.useContext(b),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},u=function(e){var t=i(e.components);return a.a.createElement(b.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},O=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,c=e.parentName,b=o(e,["components","mdxType","originalType","parentName"]),u=i(n),O=r,s=u["".concat(c,".").concat(O)]||u[O]||d[O]||l;return n?a.a.createElement(s,p(p({ref:t},b),{},{components:n})):a.a.createElement(s,p({ref:t},b))}));function s(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,c=new Array(l);c[0]=O;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p.mdxType="string"==typeof e?e:r,c[1]=p;for(var b=2;b<l;b++)c[b]=n[b];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,n)}O.displayName="MDXCreateElement"},86:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return p})),n.d(t,"toc",(function(){return o})),n.d(t,"default",(function(){return i}));var r=n(3),a=n(7),l=(n(0),n(150)),c={},p={unversionedId:"tricktionary/src-api-player",id:"tricktionary/src-api-player",isDocsHomePage:!1,title:"src-api-player",description:"Player",source:"@site/docs/tricktionary/src-api-player.md",slug:"/tricktionary/src-api-player",permalink:"/help/docs/tricktionary/src-api-player",version:"current"},o=[],b={toc:o};function i(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(l.b)("wrapper",Object(r.a)({},b,n,{components:t,mdxType:"MDXLayout"}),Object(l.b)("p",null,Object(l.b)("strong",{parentName:"p"},"Player")),Object(l.b)("table",null,Object(l.b)("thead",{parentName:"table"},Object(l.b)("tr",{parentName:"thead"},Object(l.b)("th",{parentName:"tr",align:null},"Method"),Object(l.b)("th",{parentName:"tr",align:null},"URL"),Object(l.b)("th",{parentName:"tr",align:null},"Description"))),Object(l.b)("tbody",{parentName:"table"},Object(l.b)("tr",{parentName:"tbody"},Object(l.b)("td",{parentName:"tr",align:null},"GET"),Object(l.b)("td",{parentName:"tr",align:null},"/api/player/id/:UUID"),Object(l.b)("td",{parentName:"tr",align:null},"lookup by player's uuid")),Object(l.b)("tr",{parentName:"tbody"},Object(l.b)("td",{parentName:"tr",align:null},"GET"),Object(l.b)("td",{parentName:"tr",align:null},"/api/player/last-user-id/:SOCKET.ID"),Object(l.b)("td",{parentName:"tr",align:null},"lookup by player's last user_id")))),Object(l.b)("p",null,"Returns:"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre"},'{\n  "player":\n    {\n      "id": UUID,\n      "token": TOKEN,\n      "last_played": LOBBYCODE,\n      "last_user_id": SOCKET.ID,\n      "jump_code": UNUSED, \n      "name": USERNAME,\n      "created_at": TIMESTAMP \n      }\n    }\n')),Object(l.b)("table",null,Object(l.b)("thead",{parentName:"table"},Object(l.b)("tr",{parentName:"thead"},Object(l.b)("th",{parentName:"tr",align:null},"Method"),Object(l.b)("th",{parentName:"tr",align:null},"URL"),Object(l.b)("th",{parentName:"tr",align:null},"Description"))),Object(l.b)("tbody",{parentName:"table"},Object(l.b)("tr",{parentName:"tbody"},Object(l.b)("td",{parentName:"tr",align:null},"PUT"),Object(l.b)("td",{parentName:"tr",align:null},"/api/player/id/:UUID"),Object(l.b)("td",{parentName:"tr",align:null},"update a player's record")))),Object(l.b)("p",null,"Request body (any of):"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre"},'{\n  "token": TOKEN,\n  "last_played": LOBBYCODE,\n  "last_user_id": SOCKET.ID,\n  "jump_code": UNUSED, \n  "name": USERNAME,\n}\n')),Object(l.b)("p",null,"Returns (updated):"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre"},'{\n  "player":\n    {\n      "id": UUID,\n      "token": TOKEN,\n      "last_played": LOBBYCODE,\n      "last_user_id": SOCKET.ID,\n      "jump_code": UNUSED, \n      "name": USERNAME,\n      "created_at": TIMESTAMP \n      }\n    }\n')))}i.isMDXComponent=!0}}]);