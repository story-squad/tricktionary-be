(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{149:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return u}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function b(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),p=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=p(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},s=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,l=b(e,["components","mdxType","originalType","parentName"]),d=p(n),s=r,u=d["".concat(c,".").concat(s)]||d[s]||m[s]||o;return n?a.a.createElement(u,i(i({ref:t},l),{},{components:n})):a.a.createElement(u,i({ref:t},l))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,c=new Array(o);c[0]=s;var i={};for(var b in t)hasOwnProperty.call(t,b)&&(i[b]=t[b]);i.originalType=e,i.mdxType="string"==typeof e?e:r,c[1]=i;for(var l=2;l<o;l++)c[l]=n[l];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,n)}s.displayName="MDXCreateElement"},77:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return b})),n.d(t,"default",(function(){return p}));var r=n(3),a=n(7),o=(n(0),n(149)),c={},i={unversionedId:"tricktionary/modules/handlesetfinale",id:"tricktionary/modules/handlesetfinale",isDocsHomePage:!1,title:"handlesetfinale",description:"tricktionary-be / Exports / handleSetFinale",source:"@site/docs/tricktionary/modules/handlesetfinale.md",slug:"/tricktionary/modules/handlesetfinale",permalink:"/help/docs/tricktionary/modules/handlesetfinale",version:"current"},b=[{value:"Table of contents",id:"table-of-contents",children:[{value:"Functions",id:"functions",children:[]}]},{value:"Functions",id:"functions-1",children:[{value:"default",id:"default",children:[]}]}],l={toc:b};function p(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,Object(o.b)("a",{parentName:"p",href:"/help/docs/tricktionary/README"},"tricktionary-be")," / ",Object(o.b)("a",{parentName:"p",href:"/help/docs/tricktionary/modules"},"Exports")," / handleSetFinale"),Object(o.b)("h1",{id:"module-handlesetfinale"},"Module: handleSetFinale"),Object(o.b)("h2",{id:"table-of-contents"},"Table of contents"),Object(o.b)("h3",{id:"functions"},"Functions"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",{parentName:"li",href:"/help/docs/tricktionary/modules/handlesetfinale#default"},"default"))),Object(o.b)("h2",{id:"functions-1"},"Functions"),Object(o.b)("h3",{id:"default"},"default"),Object(o.b)("p",null,"\u25b8 ",Object(o.b)("strong",{parentName:"p"},"default"),"(",Object(o.b)("inlineCode",{parentName:"p"},"io"),": ",Object(o.b)("em",{parentName:"p"},"any"),", ",Object(o.b)("inlineCode",{parentName:"p"},"socket"),": ",Object(o.b)("em",{parentName:"p"},"any"),", ",Object(o.b)("inlineCode",{parentName:"p"},"lobbyCode"),": ",Object(o.b)("em",{parentName:"p"},"any"),", ",Object(o.b)("inlineCode",{parentName:"p"},"lobbies"),": ",Object(o.b)("em",{parentName:"p"},"any"),"): ",Object(o.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(o.b)("p",null,"Allows the host to store and retrieve"),Object(o.b)("p",null,"1) three top scoring users\n2) these users' top-three definitions for the whole game (from any round)"),Object(o.b)("h4",{id:"parameters"},"Parameters:"),Object(o.b)("table",null,Object(o.b)("thead",{parentName:"table"},Object(o.b)("tr",{parentName:"thead"},Object(o.b)("th",{parentName:"tr",align:"left"},"Name"),Object(o.b)("th",{parentName:"tr",align:"left"},"Type"),Object(o.b)("th",{parentName:"tr",align:"left"},"Description"))),Object(o.b)("tbody",{parentName:"table"},Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"io")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"any")),Object(o.b)("td",{parentName:"tr",align:"left"},"(socketio)")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"socket")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"any")),Object(o.b)("td",{parentName:"tr",align:"left"},"(socketio)")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"lobbyCode")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"any")),Object(o.b)("td",{parentName:"tr",align:"left"},"key-string")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"lobbies")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"any")),Object(o.b)("td",{parentName:"tr",align:"left"},"memo-object")))),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Returns:")," ",Object(o.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/handleSetFinale.ts#L22"},"handleSetFinale.ts:22")))}p.isMDXComponent=!0}}]);