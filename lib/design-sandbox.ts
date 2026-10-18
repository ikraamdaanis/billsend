import type { DesignFrameSetup } from "~/types";

// The design catalogue (/design) shows the real editor in frames at phone,
// tablet and desktop widths. Each frame (/design/frame) runs in a sandbox so
// nothing done there reaches the library or the editor's settings: a head
// script swaps localStorage and sessionStorage for in-memory copies and names
// a database of the catalogue's own, before any of billsend's code runs.

declare global {
  interface Window {
    __billsendDesignSandbox?: { database: string };
  }
}

export function getDesignSandbox() {
  return typeof window === "undefined"
    ? null
    : (window.__billsendDesignSandbox ?? null);
}

// Runs first in a frame's <head>. `setups` maps each block to what it starts
// with; the block and theme come from the frame's URL.
export function designSandboxScript(setups: Record<string, DesignFrameSetup>) {
  return `(function(setups){
var params=new URLSearchParams(location.search);
var setup=setups[params.get("block")]||{storage:{},emptyLibrary:false};
function memoryStorage(seed){
  var items=new Map(Object.entries(seed||{}));
  return {
    get length(){return items.size},
    key:function(index){return Array.from(items.keys())[index]??null},
    getItem:function(key){return items.has(String(key))?items.get(String(key)):null},
    setItem:function(key,value){items.set(String(key),String(value))},
    removeItem:function(key){items.delete(String(key))},
    clear:function(){items.clear()}
  };
}
var storage=Object.assign({},setup.storage,{"billsend-editor-theme":params.get("theme")==="dark"?"dark":"light"});
Object.defineProperty(window,"localStorage",{value:memoryStorage(storage),configurable:true});
Object.defineProperty(window,"sessionStorage",{value:memoryStorage(),configurable:true});
window.__billsendDesignSandbox={database:setup.emptyLibrary?"billsend-design-empty":"billsend-design"};
})(${JSON.stringify(setups)})`;
}
