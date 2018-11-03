const global = window 
const {Component, cloneElement, h, render} = preact

const json_retry = async (url, options, n, delay, expect) => {
    const timeout = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }

    for (let i = 0; i < n; i++) {
        try {
            let r = await fetch(url, options);
            let contentType = r.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
                let json = await r.json();
                if(expect(json)) {
                    return json
                }
            } 
            await timeout(delay)
        } catch (err) {
            const isLastAttempt = i + 1 === n;
            if (isLastAttempt) throw err;
        }
    }
};

function gscall(sheetid, data, gappid, method) {
  return json_retry(`https://script.google.com/macros/s/${gappid}/exec?method=${method}&sheetid=${sheetid}`,       
  { 
      method: 'POST',
      body:    JSON.stringify(data),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  },
  3,
  1000,
  (json=>json.status=="success")
  )
}
const GAPPID = "AKfycbxf8LBP8_xeB8vEFL-YzwZ5q8_hku7kvDEDaC8w865UxnRifyg"
//AKfycbxf8LBP8_xeB8vEFL
//https://script.google.com/macros/s/AKfycbxf8LBP8_xeB8vEFL-YzwZ5q8_hku7kvDEDaC8w865UxnRifyg/exec
function gsinsert(sheetid, data, gappid=GAPPID, method="upsertNewCO"){
  if(!data.id) data.id = Math.random().toString(36).substr(2, 9)
  return gscall(sheetid, data, gappid, method)
}

function gssendemail(sheetid, data, gappid=GAPPID, method="directEmail") {
  return gscall(sheetid, data, gappid, method)
}

const hexToRgb = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i ,(m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16))
const capitalize = str =>  str ? str[0].toUpperCase() + str.slice(1) : ""
//https://unpkg.com/tagl@1.1.1/index.js
function noop() {}
const tagl  = function(h) {
    function createProxy(tagName) {
      return new Proxy(noop, { 
        apply: (_, __, args) => h(tagName, [], ...args),
        get: (_, className) => {
          const classNames = [className]
          const proxy = new Proxy(noop, {
            get(_, className) {
              classNames.push(className)
              return proxy
            },
            apply(_, ___, args) {
              return h(tagName, classNames, ...args)
            },
          })
          return proxy
        },
      })
    }

    return new Proxy(component => createProxy(component), {
      get: (components, tagName) => createProxy(components[tagName] || tagName),  
    })
  }

const y = Yss()
const colors = {
  primary: "#4285f4",success:"#0f9d58",info: "#3498db", warning:"#ff5722", danger: "#f44336", navy: "#001f3f", blue: "#0074D9", aqua: "#7FDBFF", teal: "#39CCCC", olive: "#3D9970", green: "#2ECC40", lime: "#01FF70", yellow: "#FFDC00",  red: "#FF4136",
  maroon: "#85144b",fuchsia: "#F012BE",black: "#111111",silver: "#DDDDDD", white: "#ffffff",  red: "#f44336",pink: "#e91e63",purple: "#9c27b0",deeppurple: "#673ab7",indigo: "#3f51b5",lightblue: "#03a9f4",cyan: "#00bcd4",teal: "#009688",lightgreen: "#8bc34a",lime: "#cddc39", 
  lightyellow: "#ffeb3b", orange: "#ff9800", deeporange: "#ff5722", grey: "#9e9e9e", bluegrey:"#607d8b", brown: "#795548", lightgrey: "#ececec"
}

y.helper({ 
  position: (y,v) => y('position', v),
  top: (y,v) => y('top', v),
  left: (y,v) => y('left', v),
  right: (y,v) => y('right', v),
  bg : (y, c) => y('background', colors[c]||c),
  c  : (y, c) => y('color', colors[c]||c),
  w  : (y, w) => y('width', w),
  zi  : (y, v) => y('z-index', v),
  h  : (y, h) => y('height', h),
  minw: (y,w)=> y('min-width',w),
  minh: (y,h)=> y('min-height',h),
  maxw: (y,w)=> y('max-width',w),
  maxh: (y,h)=> y('max-height',h),
  ai : (y,v)=> y('alignItems',v),
  b  : (y,v)=> y('bottom',v),
  bw  : (y,v)=> y('border',`${v} solid`),
  border  : (y,v)=> y('border', v),
  bc : (y,v)=> y('backgroundColor',v),
  br : (y,v)=> y('borderRadius',v),
  bs : (y,v)=> y('boxShadow',v),
  d  : (y,v)=> y('display',v),
  f  : (y,v)=> y('float',v),
  fd : (y,v)=> y('flexDirection',v),
  ff : (y,v)=> y('fontFamily',v),
  fs : (y,v)=> y('fontSize',v),
  h  : (y,v)=> y('height',v),
  jc : (y,v)=> y('justifyContent',v),
  l  : (y,v)=> y('left',v),
  lh : (y,v)=> y('lineHeight',v),
  ls : (y,v)=> y('letterSpacing',v),
  m  : (y,v)=> y('margin',v),
  mb : (y,v)=> y('marginBottom',v),
  ml : (y,v)=> y('marginLeft',v),
  mr : (y,v)=> y('marginRight',v),
  mt : (y,v)=> y('marginTop',v),
  o  : (y,v)=> y('opacity',v),
  p  : (y,v)=> y('padding',v),
  pb : (y,v)=> y('paddingBottom',v),
  pl : (y,v)=> y('paddingLeft',v),
  pr : (y,v)=> y('paddingRight',v),
  pt : (y,v)=> y('paddingTop',v),
  r  : (y,v)=> y('right',v),
  t  : (y,v)=> y('top',v),
  ta : (y,v)=> y('textAlign',v),
  td : (y,v)=> y('textDecoration',v),
  tt : (y,v)=> y('textTransform',v),
  
  flex: (y, alignItems, justifyContent) => {
    alignItems = alignItems || 'center'
    justifyContent = justifyContent || "center"
    y`display flex`({ alignItems, justifyContent })
  },
  col: (y, alignItems, justifyContent) => {
    alignItems = alignItems || 'center'
    justifyContent = justifyContent || "center"
    y`display flex; flexDirection: column`({ alignItems, justifyContent })
  }, 
  row: (y, alignItems, justifyContent) => {
    alignItems = alignItems || 'center'
    justifyContent = justifyContent || "center"
    y`display flex; flexDirection: row`({ alignItems, justifyContent })
  },
  lg: (y, style)=> {y.media('(max-width:20000px) and (min-width:1200px)',style)},
  md: (y, style)=> {y.media('(max-width:1199px) and (min-width:800px)',style)},
  sm: (y, style)=> {y.media('(max-width:799px) and (min-width:0)',style)},
  rw: (y, lg, md=9, sm=11) => {
    y[`lg${lg||7}`]()
    y[`md${md}`]()
    y[`sm${sm}`]()
  },
  asd: (yy, t)=>{yy.animate(t, {from: y.position("absolute").top("-1000").o('0')}) },
  aexp: (yy, t)=>{yy.animate(t, {from:y.o('0')`transform: scaleX(0)` } )   },
  asl: (yy, t)=>{yy.animate(t, {from:y.o('0').zi('-0')`transform: scaleX(0.1) translateX(-200%)` } ) },  
})

for(var x=1; x<=12; x++) { 
  let f = (m, bs)=> y[m](bs) 
  let bs = y.w(`${100*x/12}%`)
  y.helper(`sm${x}`, f("sm", bs)) 
  y.helper(`md${x}`, f("md", bs))
  y.helper(`lg${x}`, f("lg", bs))
  y.helper(`all${x}`,bs) 
}



Yss.prependCls = (y, cls)=>{
  let ycls = y.class.replace(".", " ")
  if(cls && cls.indexOf(ycls) >= 0) {
    return cls
  }
  return `${ycls} ${cls||""}` 
}
Yss.pc = Yss.prependCls


const ch = (tag, props, ...children) => { 
  if(props) {
    let x = y()
    let styled = false
    const attrs = (keys)=>keys.forEach(k=>{
      let v = props[k]
      if(typeof x[k] === "function"){
        Array.isArray(v)? x[k](...v) : x[k](v)   
        styled = true
      }
    })

    attrs(Object.keys(props).filter( k => !k.startsWith("on")))
    if(styled)
      props.class = Yss.prependCls(x, props.class)
    
    if(!props.class) props.class = "mf"
       
  }
  return preact.h(tag, props, children)
}
 
const t = tagl(function(tag, classes, ...args){
  let [a,...rest] = args
  let props = a
  if(a==="" || a && typeof a!=="object") {
    props = {}
    rest = [a,...rest]
  }
  props = props || {}
  props.class = props.class || "" 
  // console.log(classes)
  if(classes.length > 0) { 
    props.class += " " + classes.join(" ") 
  }
  return  ch(tag, props, ...rest) 
})
const {div, a, p, form, textarea, input, select, span, img, i, table, thead, tbody, th, tr, td, dd, time, dialog, ul, ol, li, br, h1, h2, h3, h4, h5, h6, style, hr, b, strong, script} = t

for(c in colors) {
  const  f = clr => //
  ({children, ...props})=>span({...props,c:clr},children)
  t[c] = f(c) 
}


const mdregex = {
  headers: [/(#+)\s+(.*)/g, (m,$1,$2)=>`<h${$1.length}>${$2}</h${$1.length}>`],
  links:   [/[^!]\[([^\[]*)\]\(([^\)]+)\)/g, "<a href='$2'>$1</a>"],
  img:     [/!\[([^\[]*)\]\(([^\)]+)\)/g, "<img src='$2'></img>"],
  bold:    [/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>'],
  em:      [/(\*\*\*|___)(.*?)\1/g , '<em>$2</em>'],
  del:     [/\~\~(.*?)\~\~/g, '<del>$1</del>'],
  qoute:   [/\:\"(.*?)\"\:/g, '<q>$1</q>'],
  hr:      [/\n\s*((\-{3,})|(={3,}))/g, '\n<hr />'],
  list:    [/(\n\s*(\*|\-|\+)\s.*)+/g, (full)=>{
    let items = '';
    full.trim().split('\n').forEach( item => { items += `<li>${item.substring(2).replace(/[\*|\-|\+]/, "")}</li>`; } );
    return `\n<ul>${items}</ul>`;
  }],
}

const mdp = str=>{
  str = Array.isArray(str) ? str[0] : str
  Object.keys(mdregex).forEach(k=>{
    str = str.replace(...mdregex[k])
  })
  return str
}
window.mdp = mdp

const parseDom = (children) => {
  return [...children].map(el=>{  
    if(!el.tagName && el.nodeType === Node.TEXT_NODE){ 
      return el.textContent.replace(/\s*/gm, "") !== "" ? el.textContent : undefined
    }
    if(!el.attributes){ return;}
    let attrs = {}
    for(item of el.attributes) {
      if(item.name) attrs[item.name] = 
        (item.value==="")? true : (item.value==="false") ? false : 
          (item.value.startsWith("[") && item.value.endsWith("]")) ?  item.value.slice(1,-1).split(",").map(v=>v.trim()) : item.value 

    }
    return t[el.tagName.toLowerCase()](attrs, parseDom(el.childNodes).filter(c=>c)) 
  }).filter(c=>c) 
}

const replaceSingleTagNodes = html => html.split("/>").map(part=>{
  let sp = part.split("<")
  let t = sp[sp.length-1] 
  if(t.startsWith("/") || t===part){ 
    return part 
  }  
  return `${part} ></${t.split(" ")[0]}>` 
  
}).join("")

const html = (html, md=true) => {
  html = replaceSingleTagNodes(Array.isArray(html) ? html[0] : html)
  html = md ? mdp(html) : html
  return parseDom(new DOMParser().parseFromString(html,'text/html').body.childNodes) 
}
window.html = html 

const toValue = (state, props, value) => {
  if(typeof value==="string" && (findex = value.indexOf("{")) >= 0 && value.indexOf("}") > findex ) { 
    const params = {...state, ...props}
    // console.log(state) 
    const args = Object.keys(params).filter(k=>k!=="class" && !k.startsWith("on") && typeof y[k] !== "function")
    const vals = args.map(k=>params[k])
    const f = new Function(...["state",...args, `
      try{
        return \`${value.replace(/{/g,"${")}\`
      }catch(e){
        console.log(e)
      }
      return "" 
    ` ] ) 
    // console.log(f) 
    value = f(state,...vals)
  } 
  return value
}

const toAction = (state, props, action) => { 
  if(typeof action === "string") {
    action = action.trim()
    if(action.startsWith("{") && action.endsWith("}")) {
      action = action.slice(1,-1)
      if(!(action.includes("=>") || action.startsWith("function"))) {
        action = "(e) => " + action
      }
      const params = {...state, ...props}
      // console.log(state) 
      const args = Object.keys(params).filter(k=>k!=="class" && !k.startsWith("on") && typeof y[k] !== "function")
      const vals = args.map(k=>params[k])
      const f = new Function(...["state",...args, `
      try{
        return ${action} 
      }catch(e){
        console.log(e)
      }
      return "" 
    ` ] ) 
      action = f(state,...vals) 
    }
  }
  return action
}

class Stateful extends Component {
  componentWillMount() {
    let state = global.state
    let current_state = JSON.parse(JSON.stringify(state))
    state.onchange( (state)=>{
      let json = JSON.stringify(state)
      let cjson = JSON.stringify(current_state)
      // console.log(cjson!==json, cjson, json)
      if(cjson!==json) {
        // console.log("ONCHANGE", state, this.props)
        current_state = JSON.parse(json)
        this.setState({state: state})
      }
    })
    this.setState({state: state})
  }
  render({children, fn, ...props}, state) {
    let p = (children)=>{
      return children.map(c=>{ 
        for(let k in c.attributes) {
          if(!k.startsWith("on")) {
            c.attributes[k] = toValue(state.state, props, c.attributes[k])
          } else {
            c.attributes[k] = toAction(state.state, props, c.attributes[k])
          }
        } 
        if(typeof c==="string" && c.indexOf("{") >= 0 ) { 
          c=toValue(state.state, props, c)
        } else if(c.children && c.children.length > 0){
            c = cloneElement(c)
            c.children=p(c.children) 
        }
        return c
      })
    }
    children = p(children)
    if(fn) {
      return fn({...props, state:state.state}, children)  
    }
     
    return children.length===1 ? children[0] : div({}, children)
  }
} 
t["stateful"] = Stateful

const component = (config,fn) => {
  let name = config
  if(typeof config === "object" && config.name) {
    name = config.name
    if(config.stateful) {
      config.fn = t(fn)
      let f = ({children,...props}) => t["stateful"]({...config,...props}, children)   
      fn = f 
    }
  }
  t[name] = fn 
  return t[name]
}

 
const st = component({name:"st", stateful:true},  ({children, ...props})=>div(props,children) ) 
const stateful = st

const fb = component("fb",({e, children,...props}) => {
    delete props.class 
    return script({}, `fbe.${e}(${JSON.stringify(props)})`)  
  }
)

const flexgrow = component("flexgrow", ()=>div({style: "flex-grow: 1"}) ) 
// const footer = component("footer", 
const footer =   component("footer", 
  ({children,...props}) => {
    return div(props, children) 
  }
)

class Countdown extends Component {
  
  calcTime({start, end}) {
    const duration = end - start
    const dist = end - new Date().getTime()

    const time = {
      days: Math.floor(dist / (1000 * 60 * 60 * 24)),
      hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((dist % (1000 * 60)) / 1000),
      str: ""
    }
    
  
    if(time.days > 0) {
      time.str += time.days + ":" 
    }
    time.str += (time.hours   < 10 ? (time.hours  <=0)? "" : `0${time.hours  }:` : `${time.hours  }:` ) 
    time.str += (time.minutes < 10 ? (time.minutes<=0)? "00:" : `0${time.minutes}:` : `${time.minutes}:` ) 
    time.str += (time.seconds < 10 ? (time.seconds<=0)? "00" : `0${time.seconds}`  : `${time.seconds}` ) 
    
    return {time}
  }
  
	componentWillMount() {
    const {start, end, outoftime, prefix, postfix} = this.props
    
    this.iid = setInterval(()=>{
      this.setState( this.calcTime(this.state) );
    }, 1001)
    
		this.setState({start, end, outoftime, prefix, postfix, ...this.calcTime(this.props) }); 
	}
  componentWillUnmount() {
    console.log("componentWillUnmount", this.iid) 
    clearInterval(this.iid)
  }
	render({bg, c, fs, ta, gc, ...props}, {time, message}) {
      
      const rgb = hexToRgb(colors[gc || "warning"]  || "#ffffff")
      let from = `rgba(${rgb.join(",")}, 0.4)`
      let to = `rgba(${rgb.join(",")}, 1)`   
      props.style = `background-image: linear-gradient(to left, ${from}, ${to} ); background-repeat: no-repeat; background-size: ${100*(time.seconds/60)}% 100%`
      props.class = Yss.pc(
        y.c(c||"black").bg(bg||"white").fs(fs||"2rem").ta(ta||"center") 
        , props.class )
      // console.log(props.class, message, time, 100*(time.seconds/60))   
      if(time.seconds >= 0){ 
        return div(props, [span(props.prefix||""), i({},b(` ${time.str} `)) , span(props.postfix||"")]) 
      } else {
        return div(props, props.outoftime || "Out of time...")
      }
  }
}

const countdown = component("countdown", Countdown)

class Input extends Component {
  componentWillMount() {
    this.setState({value: this.props.model[this.props.field]})
  }
  render({field, model, ...props},{value}) {
    const onInput = (e)=>{
      model[field] = e.target.value
      this.setState({value: model[field]})
    }
    return input({...props, value: value, onInput: onInput })
  }
}

const minput = component("minput",  
  ({field, model, ...props}) => {
    return input({...props, name:field, placeholder:capitalize(field), value: model[field], onInput: (e)=>{model[field] = e.target.value}})
  }
) 

const sinput = component("sinput", 
  (props) => {
    // props.class = "sinput"
    return span.sinput({...props, all12:1, ta:"left"}, [minput(props), i({w:"1rem", class: "fa fa-"+props.icon})] ) 
  }
)

const __button = t.button

const _button = ({state, children, bg, ...props}) => {
  // let action = toAction(state, props, onclick)
  return __button.mat({...props, bg: bg || "primary"}, children)
}

const button = component({name:"button", stateful: true}, _button)
const btn = component({name:"btn", stateful: true}, _button)

const showpopup = component("showpopup", ({children, ...props})=>btn({...props, onclick: ()=>{state.setPopup(true)}}, children))

const iname = component("iname", ({model, ...props})=>sinput({...props, model: (model || state.model), field:"name", icon:"user", pattern:"[ A-Za-z]{3,}", title: "Name must be at least 5 characters", required:{}}) )
const iemail = component("iemail", ({model, ...props})=>sinput({...props, model: model || state.model, field:"email", icon:"envelope", pattern: "[.-A-Za-z0-9]{2,50}@[A-Za-z0-9]{2,50}.[A-Za-z0-9]{2,50}", title: "Must be valid email address (matching pattern: **@**.**)", required:{}}))
const iphone = component("iphone", ({model, ...props})=>sinput({...props, type:"tel", model: model || state.model,field:"phone", icon:"phone", pattern:"[\- 0-9]{10,}", required:{}}))
const isubmit = component("isubmit", ({model, bg, ...props})=> t.button.mat({...props, bg: bg || "primary", type:"submit", all12: {}}, props.children)) 

const mform = component({name:"mform",stateful:true}, 
  ({state, model, bg,c, ai, jc, ta, af, onsubmit, goto, children, ...props})=> {
    if(typeof model === "string") {
      if(!state[model]) state[model] = {}
      model = state[model]
    } else if(!model){
      state.contact = model = state.contact || {}   
    }

    let autofocus = idx => el => {
      //af => autofocus
      if(af && el && idx===0) setTimeout(()=>{  
        console.log(el)
        let _in = el.base ? el.base.querySelector("input") : el.querySelector? el.querySelector("input") : ""
        _in.focus()
        }, 50)
      }

    // return 
    let action = toAction(state, props, onsubmit) 
    return div({...props, minh:"50px", zi:'1', bg:"red"}, //0 height keeps position of form relative to rest of page
      div({bg: bg || "black", c: c || "white", col:[ai,jc], ta: ta || "center"}, 
        form({all11:{}, onsubmit:(e)=>{e.stopPropagation(); e.preventDefault(); action(model); state.goto(goto)}},  
          div({h:"1rem"}),
          children.map((c,idx)=>cloneElement(c, {model, ref: autofocus(idx)})),
          div({h:"2rem"})
        )
      )
    )
  }
)

class SlidingForm extends Component {
  componentWillMount() {
    let state = global.state
    this.setState({state: state, idx: 0})
  }
  render({model, bg,c, ai, jc, ta, onsubmit, goto, children, ...props}, {state, idx}) {
    
    
    const inc= () => {this.setState({idx: idx+1}) }
    const kl = (e) => {console.log("KL", e)}
  
    if(typeof model === "string") {
      if(!state[model]) state[model] = {}
      model = state[model]
    } else if(!model){
      state.contact = model = state.contact || {}   
    }
    const action = toAction(state, props, onsubmit)
    const onsub = (e)=>{
      e.stopPropagation(); e.preventDefault(); 
      if(idx + 1 === children.length) {
       if(action) action(model)
       if(goto)   state.goto(goto)
      }
      inc()
    }
    if(idx < children.length) {
      let c = children[idx]
      c.attributes.model = c.attributes.model || model 
      let autofocus = (el) => {
          if(el && idx>0) setTimeout(()=>{  
            let _in = el.querySelector("input")
            _in.focus()
            }, 50)
          }
      // let cls = c.attributes.class = " slide-in" 
      // c = cloneElement(c, {w:"100%", class:cls, model, ref: (e)=>{

      //   }) 
      c = form({ref: autofocus, class: "slide-in", key: `${idx}`, d:"flex",h:"2rem", bg:"primary", onsubmit: onsub}, c, btn({h:"3rem", w:"1.2rem", bg: "primary", type:"submit"},i({...props, class:"fa fa-arrow-right"})) )
      return div({}, c) 
    } 
  }
}

const sform = component("sform", SlidingForm)

const popup = component({name:"popup", stateful:true}, 
  ({state, bg, c, children, ...props}) => {
    // console.log("popup", state.root)
    return div({d:(state && state.showPopup()? "flex": "none"), top:'0', left:state.root.x, w: state.root.width, minh: "101vh", position: "fixed", zi:"1", bg: "rgba(0,0,0,0.5)"},
      div({onclick: (e)=>{e.stopPropagation();state.setPopup(false)},position:"relative", w:"100%", minh:"101vh", h:"100%", col:["center","center"], zi:"2"},
        div({onclick: (e)=>{e.stopPropagation()}, row:["center","center"]},
          children
        )
      )
    )
  }
)

const submit = component({name:"submit", stateful:false}, 
  ({ispopup,af,children,...props}) => {
    // console.log("SUBMIT", props)
    let submit = mform({...props, af: af || ispopup }, children)
    if(ispopup) submit = popup(props,submit) 
    return submit
  }
)
const page = component({name:"page", stateful:true}, ({state, pageid, col, children,...props})=>{
  if(state.page===pageid) 
    return div({...props, col: col, pageid,page:state.page}, children)  
})
 
const yss = component({name:"yss", stateful:true}, (props)=>{
  return style(y.css)
})
      
const component_styles = ()=>div({}, 
    style(`
      .mf {width: 100%}
      
      /* https://stackoverflow.com/questions/2781549/removing-input-background-colour-for-chrome-autocomplete */
      @-webkit-keyframes autofill-invalid {to {background: #CB9089;}}
      @-webkit-keyframes autofill {to {background: white;}}
      input:-webkit-autofill {-webkit-animation-name: autofill; -webkit-animation-fill-mode: both;}
      input:placeholder-shown {background: white !important;}
      input:invalid:-webkit-autofill {-webkit-animation-name: autofill-invalid; -webkit-animation-fill-mode: both;}
      /*Only on invalid*/
      input:invalid{box-shadow: 0 0 2px rgba(255,0,0,0.4);}
      /*Only on focus and invalid*/
      input:invalid { background: #CB9089; box-shadow: none;}
      
      .sinput input {padding: 15px 10px; margin-bottom: 1rem; border: 1px solid #ddd; transition: border-width 0.2s ease; border-radius: 2px; font-size:15px;}
      .sinput input + .fa {z-index:10px;color: #fff; font-size: 1em; position: relative; opacity: 0; left:-50%; margin-top:-3rem; transition: all 0.1s ease-in;}
      .sinput input:focus {outline: none; color: #444; border-color: #2196F3; border-left-width: 3rem;}
      .sinput input:focus + .fa {z-index:10;opacity: 1; left: calc(-50% + 1.6rem); transition: all 0.25s ease-out;}

      .mat{position:relative;display:inline-block;box-sizing:border-box;margin:0;border:none;border-radius:2px;padding:0 .2rem;min-width:64px;min-height:2rem;vertical-align:middle;text-align:center;text-overflow:ellipsis;text-transform:uppercase;color:#fff;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);font-size:14px;font-weight:500;line-height:1rem;overflow:hidden;outline:0;cursor:pointer;transition:box-shadow .2s}.mat:focus,.mat:hover{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.mat:active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat:disabled{color:rgba(0,0,0,.38);background-color:rgba(0,0,0,.12);box-shadow:none;cursor:initial}.mat::after,.mat::before{content:"";position:absolute;background-color:currentColor}.mat::before{left:0;right:0;top:0;bottom:0;opacity:0;transition:opacity .2s}.mat:hover::before{opacity:.12}.mat:focus::before{opacity:.2}.mat:active::before{opacity:.32}.mat:disabled::before{opacity:0}.mat::after{left:50%;top:18px;border-radius:50%;padding:50%;width:32px;height:32px;opacity:0;transform:translate(-50%,-50%) scale(1);transition:opacity 1s,transform .5s}.mat:active::after{opacity:.4;transform:translate(-50%,-50%) scale(0);transition:transform 0s}.mat:disabled::after{opacity:0}

      .slide-in {
          animation: slide-in 0.5s forwards;
          -webkit-animation: slide-in 0.5s forwards;
      }

      .slide-out {
          position: "absolute";
          transform: translateY(100%)
          animation: slide-out 0.5s forwards;
          -webkit-animation: slide-out 0.5s;
      }

      @keyframes slide-in {
          0% { transform: scaleX(0.4) translateX(-150%); }
      }

      @-webkit-keyframes slide-in {
          0% { -webkit-transform: translateX(-100%); } 
      }

      @keyframes slide-out {
        0% { transform: translateY(200%); }
        100% { transform: translateY(200%); }
        100% { transform: translateX(100%); }
      }
    ` ),
      yss()
  )

// const slidedown = component("slidedown",  ({children,...props})=> {
//   // // console.log(props)
//   let h = props.h || "100%"  
//   let x = y.animate('1s infinite', {from: y.o('0').h('0').c("rgba(0,0,0,0)")} )
//   let cls = Yss.prependCls(x)  
//   return div({class: cls, h}, children)    
// })


const extendState = (state, container) => {
  state.setRoot = function() {
    let r = container.getClientRects()[0]
    this.root = {x: r.x, y: r.y, top: r.top, width: r.width, height: r.height}
  }
  state.json =  function(path) {
    return JSON.stringify(this.getPath(path))
  }.bind(state)

  state.getPath = function(path) {
    let parts = Array.isArray(path) ? path : path.split(".")
    return parts.reduce((prev, curr) => prev && prev[curr], this)
  }

  state.setPath = function(path, value) {
    let parts = Array.isArray(path) ? path : path.split(".")
    let x = parts.reduce(function(prev, curr, ix) {
      return (ix + 1 == parts.length) ? prev[curr] = value : prev[curr] = prev[curr] || {};
    }, this);
  }

  state.get = function(...parts) {
    return this.getPath(parts)
  }

  state.set = function(...parts) {
    let last = parts[parts.length - 1] 
    this.setPath(parts.slice(0,-1), last)
  }

  state.init = function(path, obj) {
    let x = this.getPath(path)
    if(x===undefined) {
      this.setPath(path,obj)
    }
    return obj
  }
  
  state.save = (model) => {
    if(state.sheetid) {
      console.log("saving...")
      const r = state.gappid? gsinsert(state.sheetid, model, state.gappid) : gsinsert(state.sheetid, model) 
      r.then(r=>{console.log(r)})
    }
  }

  state.sendEmail = (email, subject, body) => {
    if(state.sheetid) {
      console.log("sendEmail...")
      let data = {subject, body, email, replyTo: state.replyTo, alias: state.alias}
      const r = state.gappid? gssendemail(state.sheetid, data, state.gappid) : gssendemail(state.sheetid, data)
      r.then(r=>{console.log(r)})
    }
  }
  
  state.changed   = function(){ this.subscribed.forEach(fn=>fn(this)) }.bind(state)
  state.onchange  = function(fn){ this.subscribed.push(fn) }.bind(state)
  state.goto      = function(page) {console.log(page, this); this.page = page; this.changed()}.bind(state)
  state.setPopup  = function(v) {this.popup = v; this.changed(); }.bind(state)
  state.showPopup = function(){return this.popup===true}.bind(state)
  
  state.subscribed= []
  state.contact = state.contact || {id: Math.random().toString(36).substr(2, 9)}
  state.popup = (state.popup === undefined) ? false : state.popup
  state.setRoot()
  document.body.onresize=()=>{
    state.setRoot() 
    state.changed()
  }
  if(state.fbpixel && fbe) {
    fbe.init(state.fbpixel) 
  }
  return state
} 

const template_centered_with_footer = (state, body, container) => {
  global.state = extendState(state, container)

  render(
    div({col: state.col || [], bg:state.bg || "white", minh:"100vh", ta: state.ta || "center"}, h(component_styles),
      st({minh:"100vh", maxw: state.maxw || "1920px", rw: state.rw || []}, html(body)), 
      flexgrow({}),
      footer({zi:'0', col:["flex-start","flex-start"], fs:".9rem", c:"darkgray"},
        st("Copyright {new Date().getFullYear()} {state.business}. All Rights Reserved."),
        st("{disclaimer}"),
        st({},
           (state.privacy && state.privacy !== "" ? a({pl:"10px", href:state.privacy}, "Privacy Policy"): span("")),
           (state.terms && state.terms !== "" ? a({pl:"10px", href:state.terms}, "Terms & Conditions"): span("")),
        ),
      ),
    ), container)
  state.changed()
}

const go = (state, template=template_centered_with_footer) => {
  document.addEventListener("DOMContentLoaded", function() {
    const viewportMeta = document.createElement('meta')
    viewportMeta.name = 'viewport'
    viewportMeta.content = 'width=device-width, initial-scale=1, shrink-to-fit=no'
    document.head.appendChild(viewportMeta)
    
    window.body = document.querySelector("markdown")
    if(!body) {
      alert("No body found. body is found in <markdown> tag")
      return
    }
    body.remove()
    template(state, body.innerHTML, document.body)
    const css = document.createElement( "link" );
    css.rel = "stylesheet";
    css.href = "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    document.head.appendChild(css)

  })
}

// let s1 = document.querySelector("#output")
// s1.innerText = ""
// let child = document.createElement("div")
// s1.appendChild(child)


// global.fbq = undefined 
// let state = {
//   gappid: "AKfycby1hGFfqsnP0kRymzPpKT1428nePDZFD1EmJEY1SC4KlhkasDef",
//   gsid: "1cdmH8Zf4w5mFUEbLwuBKh8K5wOVpfIUlG2Z9oktAs6o",
//   fbpixel: "420141798494687",
//   business: "Brent Silver Construction",
//   logo: "./logo.png",
//   page: "home",
//   disclaimer: "Discliamers: ",
//   privacy: "./privacy.html",
//   terms: "./terms.html",
//   popup: false,
//   col: ["center", "center"],
//   rw: [7,9,11], //reponsive width
//   bg: "white", //background
//   ta: "center", //text alignment
  
// }

// global.state = extendState(state, s1) 


// console.log(state, state.root.x)



// let r=html`

// # {business} 
// <img w=90% maxw=500px src={state.logo} /> 
// ---  
// Hello
// --- 


// <page pageid=home bg=white h=100 c=blue> 
//    home page {state.popup}
//   <btn onclick="{ console.log('here') }">Hello </btn> 
//   <showpopup bg=primary all11> Get my voucher </showpopup>
//   <div all11 c=grey bw="2px">
//     Hello world
//   </div>
//   <submit asl="1s" ispopup rw=[] onsubmit="{ console.log(contact) }" goto=ty> 
//     # <orange>Hello</orange>
//     <iname/>
//     <isubmit>Hello</isubmit>
//   </submit>

// </page>
// <page asl=1s pageid=ty bg=white h=100 c=blue> 
//  thank you page
//   # Hello { contact.name  || ""}
// </page>

// `

// render(
//   div({col: state.col || [], bg:state.bg || "white", minh:"100vh", ta: state.ta || "center"}, h(component_styles),
//     div ({minh:"100vh", rw: state.rw || []}, "Hello",
//       page({pageid:"home"},  
//         fb({e:"pv", value:"1.00"}), 
//         // span({}, script({},"console.log('hello')")), 
//         sform({onsubmit: state.save}, iname(), iemail(), iphone() ),     
//       ) 
//     ), 
//     flexgrow({}),
//     footer({zi:'0', col:["flex-start","flex-start"], fs:".9rem", c:"darkgray"},
//       st("Copyright {new Date().getFullYear()} {state.business}. All Rights Reserved."),
//       st("{disclaimer}"),
//       st({},
//          (state.privacy && state.privacy !== "" ? a({pl:"10px", href:state.privacy}, "Privacy Policy"): span("")),
//          (state.terms && state.terms !== "" ? a({pl:"10px", href:state.terms}, "Terms & Conditions"): span("")),
//       ),
//     ),
//   ), s1)
// state.changed()
 