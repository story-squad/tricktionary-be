(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{150:function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"b",(function(){return u}));var n=r(0),a=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function b(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=a.a.createContext({}),p=function(e){var t=a.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):b(b({},t),e)),r},d=function(e){var t=p(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},s=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=p(r),s=n,u=d["".concat(c,".").concat(s)]||d[s]||m[s]||o;return r?a.a.createElement(u,b(b({ref:t},l),{},{components:r})):a.a.createElement(u,b({ref:t},l))}));function u(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,c=new Array(o);c[0]=s;var b={};for(var i in t)hasOwnProperty.call(t,i)&&(b[i]=t[i]);b.originalType=e,b.mdxType="string"==typeof e?e:n,c[1]=b;for(var l=2;l<o;l++)c[l]=r[l];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,r)}s.displayName="MDXCreateElement"},92:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return b})),r.d(t,"toc",(function(){return i})),r.d(t,"default",(function(){return p}));var n=r(3),a=r(7),o=(r(0),r(150)),c={},b={unversionedId:"tricktionary/modules/handleerrormessage",id:"tricktionary/modules/handleerrormessage",isDocsHomePage:!1,title:"handleerrormessage",description:"tricktionary-be / Exports / handleErrorMessage",source:"@site/docs/tricktionary/modules/handleerrormessage.md",slug:"/tricktionary/modules/handleerrormessage",permalink:"/help/docs/tricktionary/modules/handleerrormessage",version:"current"},i=[{value:"Table of contents",id:"table-of-contents",children:[{value:"Functions",id:"functions",children:[]}]},{value:"Functions",id:"functions-1",children:[{value:"default",id:"default",children:[]}]}],l={toc:i};function p(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,Object(o.b)("a",{parentName:"p",href:"/help/docs/tricktionary/README"},"tricktionary-be")," / ",Object(o.b)("a",{parentName:"p",href:"/help/docs/tricktionary/modules"},"Exports")," / handleErrorMessage"),Object(o.b)("h1",{id:"module-handleerrormessage"},"Module: handleErrorMessage"),Object(o.b)("h2",{id:"table-of-contents"},"Table of contents"),Object(o.b)("h3",{id:"functions"},"Functions"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",{parentName:"li",href:"/help/docs/tricktionary/modules/handleerrormessage#default"},"default"))),Object(o.b)("h2",{id:"functions-1"},"Functions"),Object(o.b)("h3",{id:"default"},"default"),Object(o.b)("p",null,"\u25b8 ",Object(o.b)("strong",{parentName:"p"},"default"),"(",Object(o.b)("inlineCode",{parentName:"p"},"io"),": ",Object(o.b)("em",{parentName:"p"},"any"),", ",Object(o.b)("inlineCode",{parentName:"p"},"socket"),": ",Object(o.b)("em",{parentName:"p"},"any"),", ",Object(o.b)("inlineCode",{parentName:"p"},"code"),": ",Object(o.b)("em",{parentName:"p"},"number"),", ",Object(o.b)("inlineCode",{parentName:"p"},"error"),": ",Object(o.b)("em",{parentName:"p"},"string")," ","|"," ",Object(o.b)("em",{parentName:"p"},"undefined"),"): ",Object(o.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(o.b)("p",null,'emit "error" message to player at socket.id'),Object(o.b)("h4",{id:"parameters"},"Parameters:"),Object(o.b)("table",null,Object(o.b)("thead",{parentName:"table"},Object(o.b)("tr",{parentName:"thead"},Object(o.b)("th",{parentName:"tr",align:"left"},"Name"),Object(o.b)("th",{parentName:"tr",align:"left"},"Type"),Object(o.b)("th",{parentName:"tr",align:"left"},"Description"))),Object(o.b)("tbody",{parentName:"table"},Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"io")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"any")),Object(o.b)("td",{parentName:"tr",align:"left"},"any (socketio)")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"socket")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"any")),Object(o.b)("td",{parentName:"tr",align:"left"},"any (socketio)")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"code")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"number")),Object(o.b)("td",{parentName:"tr",align:"left"},"-")),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"error")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"string")," ","|"," ",Object(o.b)("em",{parentName:"td"},"undefined")),Object(o.b)("td",{parentName:"tr",align:"left"},"string")))),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Returns:")," ",Object(o.b)("em",{parentName:"p"},"Promise"),"<void",">"),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/story-squad/tricktionary-be/blob/14d7831/src/sockets/handleErrorMessage.ts#L9"},"handleErrorMessage.ts:9")))}p.isMDXComponent=!0}}]);