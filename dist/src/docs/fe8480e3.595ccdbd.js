(window.webpackJsonp=window.webpackJsonp||[]).push([[77],{145:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return b}));var r=n(3),a=n(7),c=(n(0),n(151)),o={},i={unversionedId:"tricktionary/src-api-score",id:"tricktionary/src-api-score",isDocsHomePage:!1,title:"src-api-score",description:"score",source:"@site/docs/tricktionary/src-api-score.md",slug:"/tricktionary/src-api-score",permalink:"/help/docs/tricktionary/src-api-score",version:"current"},l=[],p={toc:l};function b(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"score")),Object(c.b)("p",null,"The score cards collect data as the game unfolds"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:null},"Method"),Object(c.b)("th",{parentName:"tr",align:null},"URL"),Object(c.b)("th",{parentName:"tr",align:null},"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:null},"GET"),Object(c.b)("td",{parentName:"tr",align:null},"/api/score/latest/${GAME_ID}"),Object(c.b)("td",{parentName:"tr",align:null},"the latest score")))),Object(c.b)("p",null,"Returns:"),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre"},'[\n    {\n        "player_id": "45894df8-9420-470f-819d-c81cf2883bc8",\n        "points": 2,\n        "top_definition_id": 40\n    },\n    {\n        "player_id": "342a8db6-1a00-4809-a122-37535972e8d0",\n        "points": 1,\n        "top_definition_id": 42\n    },\n    {\n        "player_id": "d51cea91-3107-41d3-9134-346336b085c1",\n        "points": 0,\n        "top_definition_id": 41\n    },\n    {\n        "player_id": "88124fba-4a54-4275-a324-3b5228a36e11",\n        "points": 0,\n        "top_definition_id": null\n    }\n]\n')),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",{parentName:"tr",align:null},"Method"),Object(c.b)("th",{parentName:"tr",align:null},"URL"),Object(c.b)("th",{parentName:"tr",align:null},"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",{parentName:"tr",align:null},"GET"),Object(c.b)("td",{parentName:"tr",align:null},"/api/definitions/game/${GAME_ID}/player/${PLAYER_ID}"),Object(c.b)("td",{parentName:"tr",align:null},"player's top definition")))),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre"},'{\n    "top_definition": {\n        "id": 42,\n        "user_id": "Bu0Ms8pUmM0W4sbAAAAN",\n        "definition": "silly string",\n        "round_id": 13,\n        "created_at": "2021-03-26T01:01:19.593Z",\n        "updated_at": "2021-03-26T01:01:19.593Z",\n        "score": 0,\n        "player_id": "7a81148e-e750-4a4f-babf-932a9fd9c189",\n        "game_id": "3886d481-0160-45c3-97f0-f81f9e01e062"\n    }\n}\n')))}b.isMDXComponent=!0},151:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=a.a.createContext({}),b=function(e){var t=a.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=b(e.components);return a.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},s=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,c=e.originalType,o=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=b(n),s=r,f=u["".concat(o,".").concat(s)]||u[s]||d[s]||c;return n?a.a.createElement(f,i(i({ref:t},p),{},{components:n})):a.a.createElement(f,i({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var c=n.length,o=new Array(c);o[0]=s;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var p=2;p<c;p++)o[p]=n[p];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}s.displayName="MDXCreateElement"}}]);