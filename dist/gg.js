"use strict";var GG=function GG(){var config=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var GG_E={};var GG_I={};var GG_Config={parentID:null,canvasID:null,width:800,height:600};var GG_Setup=function GG_Setup(){GG_I.config=Object.assign(GG_Config,config);if(GG_I.config.canvasID){try{GG_I.canvas=document.getElementById(GG_I.config.canvasID);if(config.width)GG_I.canvas.width=GG_I.config.width;if(config.height)GG_I.canvas.height=GG_I.config.height}catch(_unused){console.warn("The provided canvasID was invalid")}}if(!(GG_I.canvas instanceof HTMLCanvasElement)){GG_I.canvas=document.createElement("canvas");GG_I.canvas.width=GG_I.config.width;GG_I.canvas.height=GG_I.config.height}if(GG_I.config.parentID){try{console.log(document.getElementById(GG_I.config.parentID));console.log(GG_I.canvas);document.getElementById(GG_I.config.parentID).appendChild(GG_I.canvas)}catch(_unused2){console.warn("The provided parentID was invalid")}}var gl=GG_I.canvas.getContext("webgl")||GG_I.canvas.getContext("experimental-webgl");if(gl===null){throw Error("WebGL is not supported.")}gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);document.body.append(GG_I.canvas)};GG_Setup();return GG_E};