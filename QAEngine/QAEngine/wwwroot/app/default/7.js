(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"7NWl":function(e,t,s){"use strict";s.d(t,"a",(function(){return p}));var i=s("5zJ1"),r=s("UIv2"),n=s("LEd3"),a=s("fXoL"),o=s("l7P3"),c=s("zwrK"),d=s("tk/3"),l=s("nD3/");let p=(()=>{class e{constructor(e,t,s,i){this._store=e,this.settings=t,this.http=s,this.coreService=i}LoadRecords(e){const t=this.settings.getApiOptions().load;this._store.dispatch(new i.j({})),this.http.post(t,JSON.stringify(e)).subscribe(t=>{this.coreService.attachEncryptedId(t.posts),this._store.dispatch(new i.k(t)),this._store.dispatch(new n.d({totalrecords:t.records,pagesize:e.pagesize,pagenumber:e.pagenumber}))},e=>{this._store.dispatch(new i.i(e))})}LoadSmListReducer(e){const t=this.settings.getApiOptions().load;this._store.dispatch(new r.u({})),this.http.post(t,JSON.stringify(e)).subscribe(e=>{this.coreService.attachEncryptedId(e.posts),this._store.dispatch(new r.v(e))},e=>{this._store.dispatch(new r.q(e))})}GenerateSummaryReport(e){const t=this.settings.getApiOptions().generate_report;this._store.dispatch(new r.s({})),this.http.post(t,JSON.stringify(e)).subscribe(e=>{let t=this.coreService.initializeChartData(e.data.dataTable,e.data.chartType);this._store.dispatch(new r.t(t))},e=>{this._store.dispatch(new r.r(e))})}AddRecord(e){let t="";switch(e.viewType){case 1:case 2:t=this.settings.getApiOptions().proc;break;case 3:t=this.settings.getApiOptions().cemail;break;case 4:t=this.settings.getApiOptions().chpass;break;case 5:t=this.settings.getApiOptions().ctype}return 2===e.viewType?(e.settings.userid=e.id,e.account.userid=e.id,this.http.post(t,JSON.stringify({id:e.id,firstname:e.firstname,lastname:e.lastname,mobile:e.mobile,phoneNumber:e.phoneNumber,attr_values:e.attr_values,settings:e.settings,account:e.account,isadmin:!0}))):this.http.post(t,JSON.stringify(e))}UpdateThumb(e,t){const s=this.settings.getApiOptions().updatethumb,r={};r.Id=e.id;for(const i of t)r.picturename=i.fname;this.http.post(s,JSON.stringify(r)).subscribe(e=>{"error"===e.status?this._store.dispatch(new n.c({title:e.message,text:"",css:"bg-danger"})):(this._store.dispatch(new i.c(e.record)),this._store.dispatch(new n.c({title:"Photo updated successfully",text:"",css:"bg-success"})))},e=>{this._store.dispatch(new n.c({title:e,text:"",css:"bg-danger"}))})}UpdateAvator(e){const t=this.settings.getApiOptions().updateavator;this.http.post(t,JSON.stringify(e)).subscribe(e=>{"error"===e.status?this._store.dispatch(new n.c({title:e.message,text:"",css:"bg-danger"})):(this._store.dispatch(new i.c(e.record)),this._store.dispatch(new n.c({title:"Photo updated successfully",text:"",css:"bg-success"})))},e=>{this._store.dispatch(new n.c({title:e,text:"",css:"bg-danger"}))})}GetInfo(e){const t=this.settings.getApiOptions().getinfo;return this.http.post(t,JSON.stringify({id:e}))}LoadReports(e){return this.http.post(this.settings.getApiOptions().load_reports,JSON.stringify(e))}Authenticate(e){const t=this.settings.getApiOptions().authenticate;return this.http.post(t,JSON.stringify(e))}UpdateRole(e){const t=this.settings.getApiOptions().updaterole;return this.http.post(t,JSON.stringify(e))}GetUserLog(e){const t=this.settings.getApiOptions().userlog;return this.http.post(t,JSON.stringify({userid:e}))}DeleteAccount(e){const t=this.settings.getApiOptions().archive;return this.http.post(t,JSON.stringify(e))}DeleteRecord(e,t){e.actionstatus="delete";const s=[];s.push(e),this.ProcessActions(s,"delete")}ProcessActions(e,t){this._store.dispatch(new i.g({SelectedItems:e,isenabled:t}));const s=[];for(const i of e)s.push({id:i.id,actionstatus:i.actionstatus});this.http.post(this.settings.getApiOptions().action,JSON.stringify(s)).subscribe(e=>{let s="Operation Performed";"delete"===t&&(s="Record Removed"),this._store.dispatch(new n.c({title:s,text:"",css:"bg-success"}))},e=>{this._store.dispatch(new n.c({title:"Error Occured",text:"",css:"bg-danger"}))})}ProcessLogActions(e,t){this._store.dispatch(new n.c({title:"Feature not yet implemented",text:"",css:"bg-success"}))}}return e.\u0275fac=function(t){return new(t||e)(a.Yb(o.h),a.Yb(c.a),a.Yb(d.b),a.Yb(l.a))},e.\u0275prov=a.Gb({token:e,factory:e.\u0275fac}),e})()},Dxku:function(e,t,s){"use strict";s.d(t,"a",(function(){return N}));var i=s("fXoL"),r=s("R0Ic"),n=s("l7P3"),a=s("XDFV"),o=s("5zJ1"),c=s("7NWl"),d=s("tyNb"),l=s("ofXK"),p=s("uGzm"),u=s("cScK"),h=s("RDfn"),g=s("3Pt+");function b(e,t){1&e&&i.Lb(0,"app-loader")}const m=function(e){return[e]};function f(e,t){if(1&e&&(i.Qb(0,"a",16),i.Lb(1,"img",17),i.Pb()),2&e){const e=i.dc().$implicit,t=i.dc(3);i.kc("routerLink",i.oc(3,m,t.route_path+"profile/"+e.id)),i.xb(1),i.lc("src",e.img_url,i.wc),i.lc("alt",e.title)}}function w(e,t){if(1&e&&(i.Qb(0,"a",18),i.Lb(1,"img",17),i.Pb()),2&e){const e=i.dc().$implicit;i.lc("href",e.url,i.wc),i.xb(1),i.lc("src",e.img_url,i.wc),i.lc("alt",e.title)}}function y(e,t){if(1&e&&(i.Qb(0,"p",19),i.Fc(1),i.Pb()),2&e){const e=i.dc().$implicit;i.xb(1),i.Ic(" ",e.firstname," ",e.lastname," ")}}function v(e,t){if(1&e&&(i.Qb(0,"p",19),i.Fc(1),i.Pb()),2&e){const e=i.dc().$implicit;i.xb(1),i.Hc(" ",e.userName," ")}}function k(e,t){1&e&&(i.Qb(0,"span",24),i.Fc(1,"Inactive"),i.Pb())}function P(e,t){1&e&&(i.Qb(0,"span",25),i.Fc(1,"Active"),i.Pb())}function x(e,t){1&e&&(i.Qb(0,"span",26),i.Fc(1,"Blocked"),i.Pb())}function _(e,t){if(1&e&&(i.Qb(0,"p",20),i.Dc(1,k,2,0,"span",21),i.Dc(2,P,2,0,"span",22),i.Dc(3,x,2,0,"span",23),i.Pb()),2&e){const e=i.dc().$implicit;i.xb(1),i.kc("ngIf",!e.emailConfirmed),i.xb(1),i.kc("ngIf",e.emailConfirmed),i.xb(1),i.kc("ngIf",0===e.isenabled)}}function S(e,t){if(1&e){const e=i.Rb();i.Qb(0,"div",27),i.Qb(1,"div",28),i.Qb(2,"label",29),i.Qb(3,"input",30),i.bc("ngModelChange",(function(t){return i.uc(e),i.dc().$implicit.Selected=t}))("ngModelChange",(function(){return i.uc(e),i.dc(4).checkChange()})),i.Pb(),i.Pb(),i.Pb(),i.Pb()}if(2&e){const e=i.dc().$implicit;i.xb(2),i.lc("for",e.id),i.xb(1),i.lc("id",e.id),i.kc("ngModel",e.Selected)}}function O(e,t){if(1&e&&(i.Qb(0,"div",7),i.Qb(1,"div",8),i.Dc(2,f,2,5,"a",9),i.Dc(3,w,2,3,"a",10),i.Qb(4,"div",11),i.Dc(5,y,2,2,"p",12),i.Dc(6,v,2,1,"p",12),i.Qb(7,"p",13),i.Fc(8),i.ec(9,"date"),i.Pb(),i.Dc(10,_,4,3,"p",14),i.Dc(11,S,4,3,"div",15),i.Pb(),i.Pb(),i.Pb()),2&e){const e=t.$implicit,s=i.dc(3);i.kc("hidden",e.isdeleted),i.xb(2),i.kc("ngIf",s.isAdmin&&!s.PublicView),i.xb(1),i.kc("ngIf",!s.isAdmin||s.PublicView),i.xb(2),i.kc("ngIf",""!==e.firstname),i.xb(1),i.kc("ngIf",""===e.firstname||null===e.firstname),i.xb(2),i.Hc(" Created: ",i.gc(9,8,e.created_at,"mediumDate")," "),i.xb(2),i.kc("ngIf",!s.PublicView),i.xb(1),i.kc("ngIf",!s.PublicView)}}function L(e,t){if(1&e&&(i.Qb(0,"div",5),i.Dc(1,O,12,11,"div",6),i.Pb()),2&e){const e=i.dc(2);i.xb(1),i.kc("ngForOf",e.Data)("ngForTrackBy",e.getKey)}}function A(e,t){if(1&e&&(i.Qb(0,"div",5),i.Qb(1,"div",31),i.Qb(2,"div",32),i.Qb(3,"h3",33),i.Fc(4),i.Pb(),i.Pb(),i.Pb(),i.Pb()),2&e){const e=i.dc(2);i.xb(4),i.Gc(e.NoRecordText)}}function C(e,t){if(1&e&&(i.Qb(0,"div"),i.Dc(1,L,2,2,"div",4),i.Dc(2,A,5,1,"div",4),i.Pb()),2&e){const e=i.dc();i.xb(1),i.kc("ngIf",e.Data.length>0),i.xb(1),i.kc("ngIf",0==e.Data.length)}}let N=(()=>{class e{constructor(e,t,s){this._store=e,this.dataService=t,this.router=s,this.isActionGranded=!1,this.PublicView=!1,this.isAdmin=!0,this.route_path="/users/",this.NoRecordText="No Users Registered Yet!",this.Data$=this._store.pipe(Object(n.n)(a.g)),this.loading$=this._store.pipe(Object(n.n)(a.e)),this.pagination$=this._store.pipe(Object(n.n)(a.f)),this.selectAll$=this._store.pipe(Object(n.n)(a.i)),this.View=new i.n,this.SelectedItems=new i.n,this.selectall=!1,this.Data=[]}ngOnInit(){this.Data$.subscribe(e=>{this.Data=e.map(e=>Object.assign({},e))}),this.selectAll$.subscribe(e=>{this.selectall=e,this.checkChange()})}getKey(e,t){return t.id}PaginationChange(e){this._store.dispatch(new o.h({attr:"pagenumber",value:e})),this._store.dispatch(new o.n({currentpage:e}))}checkChange(){const e=[];for(const t of this.Data)t.Selected&&e.push(t);this.SelectedItems.emit(e)}}return e.\u0275fac=function(t){return new(t||e)(i.Kb(n.h),i.Kb(c.a),i.Kb(d.f))},e.\u0275cmp=i.Eb({type:e,selectors:[["app-userlist"]],inputs:{isActionGranded:"isActionGranded",PublicView:"PublicView",isAdmin:"isAdmin",route_path:"route_path",NoRecordText:"NoRecordText"},outputs:{View:"View",SelectedItems:"SelectedItems"},decls:11,vars:15,consts:[[4,"ngIf"],[2,"padding","15px 10px"],[1,"text-center","content-group-lg","pt-20"],[3,"currentPage","totalRecords","pageSize","OnSelection"],["class","row",4,"ngIf"],[1,"row"],["class","col-md-3 col-xs-6 videolist",3,"hidden",4,"ngFor","ngForOf","ngForTrackBy"],[1,"col-md-3","col-xs-6","videolist",3,"hidden"],[1,"card-img-top","img-responsive"],[3,"routerLink",4,"ngIf"],[3,"href",4,"ngIf"],[1,"m-t-10"],["class","title m-b-0 truncate",4,"ngIf"],[1,"light-item"],["class","card-text",4,"ngIf"],["class","mx-auto","style","width: 50px;",4,"ngIf"],[3,"routerLink"],[1,"img-responsive",2,"cursor","pointer",3,"src","alt"],[3,"href"],[1,"title","m-b-0","truncate"],[1,"card-text"],["class","badge badge-danger m-r-5 m-b-5",4,"ngIf"],["class","badge badge-success m-r-5 m-b-5",4,"ngIf"],["class","badge badge-info m-r-5 m-b-5",4,"ngIf"],[1,"badge","badge-danger","m-r-5","m-b-5"],[1,"badge","badge-success","m-r-5","m-b-5"],[1,"badge","badge-info","m-r-5","m-b-5"],[1,"mx-auto",2,"width","50px"],[1,"form-check"],[3,"for"],["type","checkbox",3,"ngModel","id","ngModelChange"],[1,"col-md-12"],[2,"padding","80px 0px"],[2,"text-align","center"]],template:function(e,t){1&e&&(i.Dc(0,b,1,0,"app-loader",0),i.ec(1,"async"),i.Qb(2,"div",1),i.Lb(3,"app-alert"),i.Dc(4,C,3,2,"div",0),i.ec(5,"async"),i.Pb(),i.Qb(6,"div",2),i.Qb(7,"pagination",3),i.bc("OnSelection",(function(e){return t.PaginationChange(e)})),i.ec(8,"async"),i.ec(9,"async"),i.ec(10,"async"),i.Pb(),i.Pb()),2&e&&(i.kc("ngIf",i.fc(1,5,t.loading$)),i.xb(4),i.kc("ngIf",!i.fc(5,7,t.loading$)),i.xb(3),i.kc("currentPage",i.fc(8,9,t.pagination$).currentPage)("totalRecords",i.fc(9,11,t.pagination$).totalRecords)("pageSize",i.fc(10,13,t.pagination$).pageSize))},directives:[l.u,p.a,u.a,h.a,l.t,d.i,g.a,g.q,g.t],pipes:[l.b,l.f],encapsulation:2,data:{animation:[Object(r.k)("fadeIn",[Object(r.j)(":enter",[Object(r.i)({opacity:"0",background:"#f5fb98"}),Object(r.e)("300ms ease-out",Object(r.f)([Object(r.i)({opacity:0,transform:"translateY(-75%)",offset:0}),Object(r.i)({opacity:.5,transform:"translateY(35px)",offset:.5}),Object(r.i)({opacity:1,transform:"translateY(0)",offset:1})]))])])]}}),e})()},fo5a:function(e,t,s){"use strict";s.d(t,"a",(function(){return u}));var i=s("ofXK"),r=s("3Pt+"),n=s("tyNb"),a=s("o+qO"),o=s("zwrK"),c=s("7NWl"),d=s("pz8m"),l=s("omRQ"),p=s("fXoL");let u=(()=>{class e{}return e.\u0275mod=p.Ib({type:e}),e.\u0275inj=p.Hb({factory:function(t){return new(t||e)},providers:[o.a,c.a,d.a],imports:[[i.c,a.a,n.j,r.l,r.A,l.b]]}),e})()},pz8m:function(e,t,s){"use strict";s.d(t,"a",(function(){return o}));var i=s("dNLF"),r=s("/4iV"),n=s("fXoL"),a=s("nD3/");let o=(()=>{class e{constructor(e){this.coreService=e}getControls(e,t,s=!0){switch(t){case 1:return this.CreateAccountControls(e);case 2:return this.EditProfileControls(e,s);case 3:return this.ChangeEmailControls(e,s);case 4:return this.ChangePasswordControls(e,s);case 5:return this.ChangeUserTypeControls(e)}return this.CreateAccountControls(e)}CreateAccountControls(e){const t=[],s=[];for(const i of r.b.USER_TYPES)s.push({key:i.value,value:i.title});return t.push(new i.b({key:"role_name",label:"Select Role",value:e.role_name.toString(),options:s,order:0})),t.push(new i.i({key:"firstname",label:"",value:e.firstname,placeholder:"First Name",minLength:3,maxLength:50,order:1})),t.push(new i.i({key:"lastname",label:"",value:e.lastname,placeholder:"Last Name",minLength:3,maxLength:50,order:2})),t.push(new i.i({key:"username",label:"",value:e.username,placeholder:"User Name",minLength:5,maxLength:15,required:!0,pattern:r.d.USERNAME_REGEX,order:3})),t.push(new i.i({key:"password",type:"password",label:"",value:e.password,placeholder:"Password",minLength:5,maxLength:20,required:!0,pattern:r.d.PASSWORD_REGEX,order:4})),t.push(new i.i({key:"cpassword",type:"password",label:"",placeholder:"Confirm Password",value:e.cpassword,minLength:5,maxLength:20,required:!0,order:5})),t.push(new i.i({key:"email",label:"",placeholder:"Email",value:e.email,required:!0,email:!0,order:6})),t.sort((e,t)=>e.order-t.order)}getLoginControls(e){const t=[];return t.push(new i.i({key:"username",label:"",value:e.username,placeholder:"User Name",required:!0,minLength:5,maxLength:20,order:1})),t.push(new i.i({key:"password",type:"password",label:"",value:e.password,placeholder:"Password",required:!0,minLength:5,maxLength:20,order:2})),t.push(new i.a({key:"rememberme",label:"Remember Me",value:e.rememberme,checked:e.rememberme,required:!0,order:3})),t.sort((e,t)=>e.order-t.order)}EditProfileControls(e,t=!0){const s=[];s.push(new i.i({key:"firstname",label:"First Name",value:e.firstname,placeholder:"First Name",minLength:3,maxLength:50,order:0})),s.push(new i.i({key:"lastname",label:"Last Name",value:e.lastname,placeholder:"Last Name",minLength:3,maxLength:50,order:1})),s.push(new i.i({key:"phone",label:"Phone No",value:e.phoneNumber,placeholder:"Enter Phone Number",minLength:3,maxLength:50,order:2})),s.push(new i.i({key:"mobile",label:"Mobile",value:e.mobile,placeholder:"Enter Mobile Number",minLength:3,maxLength:50,order:3}));let r=!1;if(""!==e.id&&(r=!0),this.coreService.renderDynamicControls(s,e.options,r),t){s.push(new i.g({key:"config_section_01",label:"Settings",order:1001}));let t=!1;1===e.settings.isemail&&(t=!0),s.push(new i.a({key:"isemail",label:"Receiving Emails",value:e.settings.isemail,checked:t,helpblock:"Toggle on | off receiving emails",order:1002}));let r=!1;1===e.settings.issendmessages&&(r=!0),s.push(new i.a({key:"issendmessages",label:"Receiving Messages",value:e.settings.issendmessages,checked:r,helpblock:"Toggle on | off receiving internal messages within website",order:1003})),s.push(new i.g({key:"config_section_01",label:"Account",order:1004})),s.push(new i.i({key:"basic_credits",label:"Basic Credits",value:e.account.basic_credits.toString(),colsize:"col-md-12",pattern:"[0-9]+",required:!0,helpblock:"Update user basic credits manually",order:1005})),s.push(new i.i({key:"featured_credits",label:"Featured Credits",value:e.account.featured_credits.toString(),colsize:"col-md-12",pattern:"[0-9]+",required:!0,helpblock:"Update user featured credits manually",order:1006})),s.push(new i.i({key:"premium_credits",label:"Premium Credits",value:e.account.premium_credits.toString(),colsize:"col-md-12",pattern:"[0-9]+",required:!0,helpblock:"Update user premium credits manually",order:1007})),s.push(new i.i({key:"hot_credits",label:"Hot Credits",value:e.account.hot_credits.toString(),colsize:"col-md-12",pattern:"[0-9]+",required:!0,helpblock:"Update user hot credits manually",order:1008})),s.push(new i.i({key:"super_hot_credits",label:"Super Hot Credits",value:e.account.super_hot_credits.toString(),colsize:"col-md-12",pattern:"[0-9]+",required:!0,helpblock:"Update user super hot credits manually",order:1009}))}return s.sort((e,t)=>e.order-t.order)}ChangeEmailControls(e,t=!0){const s=[];return s.push(new i.i({key:"email",label:"Email Address",placeholder:"Email",value:e.email,required:!0,email:!0,order:0})),t||s.push(new i.i({key:"password",type:"password",pattern:r.d.PASSWORD_REGEX,label:"",placeholder:"Password",value:e.password,minLength:5,maxLength:20,required:!0,order:1})),s.sort((e,t)=>e.order-t.order)}ChangePasswordControls(e,t=!0){const s=[];return t||s.push(new i.i({key:"opassword",type:"password",label:"Current Password",value:e.opassword,placeholder:"Old Password",minLength:5,maxLength:20,required:!0,order:0})),s.push(new i.i({key:"password",type:"password",label:"New Password",value:e.password,placeholder:"Password",minLength:5,maxLength:20,required:!0,pattern:r.d.PASSWORD_REGEX,order:4})),s.push(new i.i({key:"cpassword",type:"password",label:"Confirm Password",placeholder:"Confirm Password",value:e.cpassword,minLength:5,maxLength:20,required:!0,order:5})),s.sort((e,t)=>e.order-t.order)}ChangeUserTypeControls(e){const t=[],s=[];for(const i of r.b.USER_TYPES)s.push({key:i.value,value:i.title});return t.push(new i.b({key:"role_name",label:"Select Role",value:e.role_name,options:s,order:0})),t.sort((e,t)=>e.order-t.order)}}return e.\u0275fac=function(t){return new(t||e)(n.Yb(a.a))},e.\u0275prov=n.Gb({token:e,factory:e.\u0275fac}),e})()}}]);