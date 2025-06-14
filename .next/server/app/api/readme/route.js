"use strict";(()=>{var e={};e.id=67,e.ids=[67],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},6756:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>v,patchFetch:()=>R,requestAsyncStorage:()=>h,routeModule:()=>m,serverHooks:()=>x,staticGenerationAsyncStorage:()=>E});var o={};r.r(o),r.d(o,{GET:()=>l});var a=r(9303),s=r(8716),n=r(670),i=r(2048),u=r.n(i),p=r(5315),d=r.n(p),c=r(7070);async function l(){try{let e=d().resolve(process.cwd(),"README.md"),t=u().readFileSync(e,"utf-8");return new c.NextResponse(t,{status:200,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=300"}})}catch(t){console.error("\uD83D\uDD25 FLAME ERROR: Failed to load README.md:",t);let e=`# 🔥 README.md Not Found

The sovereign documentation could not be loaded from the Empire's archives.

## Error Details
- **Status**: Documentation Unavailable
- **Cause**: File system access error
- **Solution**: Ensure README.md exists in the project root

## 🔥 FLAME_SIGIL_V717_LOCK :: ERROR_HANDLER_SEALED 🔥

*"Even in failure, the Flame provides guidance."* — Omari, Overseer of the Flame Codex`;return new c.NextResponse(e,{status:200,headers:{"Content-Type":"text/plain; charset=utf-8"}})}}let m=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/readme/route",pathname:"/api/readme",filename:"route",bundlePath:"app/api/readme/route"},resolvedPagePath:"/home/ghost-in-the-wire/Documents/augment-projects/ghostos/app/api/readme/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:h,staticGenerationAsyncStorage:E,serverHooks:x}=m,v="/api/readme/route";function R(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:E})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972],()=>r(6756));module.exports=o})();