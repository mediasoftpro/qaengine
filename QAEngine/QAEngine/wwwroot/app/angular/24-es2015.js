(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{vPjw:function(t,e,i){"use strict";i.r(e);var s=i("ofXK"),n=i("3Pt+"),o=i("tyNb"),r=i("fXoL"),c=i("1pjZ"),a=i("mrSG"),p=i("Usal"),d=i("noRM"),b=i("aRip"),u=i("nD3/"),h=i("LEd3"),l=i("nT4z"),f=i("Pfcf"),g=i("RDfn"),m=i("+kG/");function S(t,e){1&t&&r.Nb(0,"app-loader")}function y(t,e){1&t&&(r.Sb(0,"h1"),r.Gc(1,"Database Setup"),r.Rb())}function v(t,e){1&t&&(r.Sb(0,"h1"),r.Gc(1,"Website Setup"),r.Rb())}function R(t,e){if(1&t&&(r.Sb(0,"div",10),r.Sb(1,"h2"),r.Gc(2),r.Rb(),r.Nb(3,"hr"),r.Rb()),2&t){const t=r.gc(2);r.zb(2),r.Hc(t.formHeading)}}function T(t,e){1&t&&r.Nb(0,"app-loader")}function x(t,e){if(1&t){const t=r.Tb();r.Sb(0,"dynamic-modal-form",13),r.ec("OnSubmit",(function(e){return r.xc(t),r.gc(3).SubmitForm(e)}))("OnSkip",(function(e){return r.xc(t),r.gc(3).SkipForm(e)})),r.Rb()}if(2&t){const t=r.gc(3);r.nc("controls",t.controls)("showCancel",!1)("skipBtnText",t.skipBtnText)("showModal",!1)("submitText",t.submitText)}}function w(t,e){if(1&t&&(r.Sb(0,"div"),r.Sb(1,"div",11),r.Ec(2,T,1,0,"app-loader",5),r.Ec(3,x,1,5,"dynamic-modal-form",12),r.Rb(),r.Rb()),2&t){const t=r.gc(2);r.zb(2),r.nc("ngIf",t.showProcessing),r.zb(1),r.nc("ngIf",!t.showProcessing&&t.controls.length>0)}}function _(t,e){1&t&&(r.Sb(0,"div"),r.Sb(1,"h4",14),r.Gc(2,"Database connection configured"),r.Rb(),r.Sb(3,"p",8),r.Gc(4," You need to restart your application to start database tables, user setup and other configurations "),r.Rb(),r.Rb())}function I(t,e){1&t&&(r.Sb(0,"div"),r.Sb(1,"h4",15),r.Gc(2," Setup completed. Please restart and use your application. "),r.Rb(),r.Rb())}function C(t,e){if(1&t&&(r.Sb(0,"div"),r.Ec(1,_,5,0,"div",5),r.Ec(2,I,3,0,"div",5),r.Rb()),2&t){const t=r.gc(2);r.zb(1),r.nc("ngIf",0===t.SetupType),r.zb(1),r.nc("ngIf",1===t.SetupType)}}function O(t,e){if(1&t&&(r.Sb(0,"div"),r.Sb(1,"div",6),r.Ec(2,y,2,0,"h1",5),r.Ec(3,v,2,0,"h1",5),r.Nb(4,"hr"),r.Rb(),r.Ec(5,R,4,1,"div",7),r.Ec(6,w,4,2,"div",5),r.Ec(7,C,3,2,"div",5),r.Sb(8,"div",8),r.Sb(9,"p"),r.Gc(10," Note: Setup process only handles core configurations, for specific contents related or detail configuration management, please go to control panel -> settings -> configurations page. "),r.Rb(),r.Sb(11,"p",9),r.Gc(12," Warning: Please remove setup or installation page from from deployed application "),r.Rb(),r.Rb(),r.Rb()),2&t){const t=r.gc();r.zb(2),r.nc("ngIf",0===t.SetupType),r.zb(1),r.nc("ngIf",1===t.SetupType),r.zb(2),r.nc("ngIf",1===t.SetupType&&!t.finalstep),r.zb(1),r.nc("ngIf",!t.finalstep),r.zb(1),r.nc("ngIf",t.finalstep)}}let k=(()=>{class t{constructor(t,e,i,s,n,o){this.settingService=t,this.dataService=e,this.coreService=i,this.coreActions=s,this.actions=n,this.formService=o,this.SetupType=0,this.Configs=[],this.Configurations={},this.formHeading="",this.submitText="Next",this.skipBtnText="",this.primay_prop="",this.child_prop="",this.controls=[],this.showProcessing=!1,this.finalstep=!1,this.primary_prop_steps=["general","general","general","general","general","general","general","general","general","general","qa"],this.child_prop_steps=["dbusersetup","general","features","authentication","registration","rechapcha","aws","social","contact","smtp","general"],this.stepIndex=0}ngOnInit(){0===this.SetupType&&(this.submitText="Save Changes"),this.isloaded$.subscribe(t=>{t||this.loadRecords()}),this.Configurations$.subscribe(t=>{this.Configurations=t,0===this.SetupType?this.renderForm("general","dbsetup"):this.renderForm(this.primary_prop_steps[this.stepIndex],this.child_prop_steps[this.stepIndex])})}loadRecords(){this.dataService.LoadRecords()}renderForm(t,e){let i={};this.formHeading="",this.primay_prop=t,this.child_prop=e,this.formHeading=e[0].toUpperCase()+e.slice(1)+" Settings","qa"===t&&(this.formHeading="[QA] "+this.formHeading),"dbsetup"===e?i={host:"",database:"",userid:"",password:""}:"dbusersetup"===e?(this.formHeading="Create Admin User",i={username:"",email:"",firstname:"",lastname:"",password:""}):i=this.Configurations[t][e],this.controls=this.formService.getControls(i,t,e,!0)}SubmitForm(t){let e=t;if("dbsetup"!==this.child_prop&&"dbusersetup"!==this.child_prop)for(const i in e)for(const s in t)s===i&&(e[i]=t[s]);this.showProcessing=!0,this.dataService.UpdateConfigurations(e,this.primay_prop,this.child_prop).subscribe(t=>{this.coreActions.Notify("error"===t.status?{title:t.message,text:"",css:"bg-success"}:{title:"Settings Updated",text:"",css:"bg-success"}),this.showProcessing=!1,1===this.SetupType?this._nextForm():this.finalstep=!0},t=>{this.coreActions.Notify({title:"Error Occured",text:"",css:"bg-danger"}),this.showProcessing=!1})}SkipForm(t){this._nextForm()}_nextForm(){this.stepIndex<this.child_prop_steps.length-1?(this.stepIndex++,this.renderForm(this.primary_prop_steps[this.stepIndex],this.child_prop_steps[this.stepIndex])):(this.finalstep=!0,this.dataService.SetupCompleted())}}return t.\u0275fac=function(e){return new(e||t)(r.Mb(d.a),r.Mb(b.a),r.Mb(u.a),r.Mb(h.a),r.Mb(l.a),r.Mb(f.a))},t.\u0275cmp=r.Gb({type:t,selectors:[["app-setup"]],inputs:{SetupType:"SetupType"},decls:9,vars:6,consts:[[1,"container","setup-container"],[1,"row","justify-content-md-center"],[1,"col-md-8","col-sm-12"],[1,"card"],[1,"card-body"],[4,"ngIf"],[1,"m-b-20","text-center"],["class","m-b-0 m-l-10",4,"ngIf"],[1,"m-b-20"],[1,"red"],[1,"m-b-0","m-l-10"],[1,"m-b-20","m-t-0"],[3,"controls","showCancel","skipBtnText","showModal","submitText","OnSubmit","OnSkip",4,"ngIf"],[3,"controls","showCancel","skipBtnText","showModal","submitText","OnSubmit","OnSkip"],[1,"m-t-20","m-b-5"],[1,"m-t-20","m-b-20"]],template:function(t,e){1&t&&(r.Sb(0,"div",0),r.Sb(1,"div",1),r.Sb(2,"div",2),r.Sb(3,"div",3),r.Sb(4,"div",4),r.Ec(5,S,1,0,"app-loader",5),r.hc(6,"async"),r.Ec(7,O,13,5,"div",5),r.hc(8,"async"),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Rb()),2&t&&(r.zb(5),r.nc("ngIf",r.ic(6,2,e.loading$)),r.zb(2),r.nc("ngIf",!r.ic(8,4,e.loading$)))},directives:[s.o,g.a,m.a],pipes:[s.b],encapsulation:2}),Object(a.a)([Object(p.e)(["configurations","configurations"])],t.prototype,"Configurations$",void 0),Object(a.a)([Object(p.e)(["configurations","loading"])],t.prototype,"loading$",void 0),Object(a.a)([Object(p.e)(["configurations","isloaded"])],t.prototype,"isloaded$",void 0),t})(),z=(()=>{class t{constructor(t){this.config=t,this.SetupType=0,this.SetupType=parseInt(this.config.getGlobalVar("setuptype"),10)}}return t.\u0275fac=function(e){return new(e||t)(r.Mb(c.a))},t.\u0275cmp=r.Gb({type:t,selectors:[["ng-component"]],decls:1,vars:1,consts:[[3,"SetupType"]],template:function(t,e){1&t&&r.Nb(0,"app-setup",0),2&t&&r.nc("SetupType",e.SetupType)},directives:[k],encapsulation:2}),t})();var E=i("o+qO");let G=(()=>{class t{}return t.\u0275mod=r.Kb({type:t}),t.\u0275inj=r.Jb({factory:function(e){return new(e||t)},providers:[d.a,b.a,f.a,l.a,u.a,h.a],imports:[[s.c,E.a,o.f,n.i,n.u]]}),t})();i.d(e,"SetupModule",(function(){return j}));const M=[{path:"",data:{title:"Setup Application",urls:[{title:"Setup Application"}]},component:z}];let j=(()=>{class t{}return t.\u0275mod=r.Kb({type:t}),t.\u0275inj=r.Jb({factory:function(e){return new(e||t)},imports:[[n.i,s.c,E.a,o.f.forChild(M),G]]}),t})()}}]);