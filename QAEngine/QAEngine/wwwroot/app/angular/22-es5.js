function _defineProperties(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function _createClass(t,e,i){return e&&_defineProperties(t.prototype,e),i&&_defineProperties(t,i),t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{dEKL:function(t,e,i){"use strict";i.r(e);var n,o,a,s=i("1kSV"),r=i("ofXK"),c=i("3Pt+"),l=i("tyNb"),d=i("fXoL"),b=i("eYWs"),u=((n=function t(){_classCallCheck(this,t),this.isAdmin=!0}).\u0275fac=function(t){return new(t||n)},n.\u0275cmp=d.Gb({type:n,selectors:[["ng-component"]],decls:1,vars:1,consts:[[3,"isAdmin"]],template:function(t,e){1&t&&d.Nb(0,"app-qa-mainlist",0),2&t&&d.nc("isAdmin",e.isAdmin)},directives:[b.a],encapsulation:2}),n),h=i("ZHT1"),f=i("jyKJ"),p=i("kwlv"),v=i("mbCC"),m=i("o+qO"),g=((o=function t(){_classCallCheck(this,t)}).\u0275mod=d.Kb({type:o}),o.\u0275inj=d.Jb({factory:function(t){return new(t||o)},providers:[h.a,f.a,p.a,v.a],imports:[[r.c,m.a,l.f,c.i]]}),o),I=i("mrSG"),y=i("Usal"),S=i("pdjO"),A=i("LEd3"),R=i("+kG/"),w=((a=function(){function t(e,i,n,o){_classCallCheck(this,t),this.activeModal=e,this.service=i,this.dataService=n,this.coreActions=o,this.showLoader=!1,this.list=[]}return _createClass(t,[{key:"ngOnInit",value:function(){this.title=this.Info.title,this.controls=this.service.getAnswerControls(this.Info.data)}},{key:"SubmitForm",value:function(t){var e=this;if(void 0===this.Info.isActionGranded||this.Info.isActionGranded){t.id=this.Info.data.id,t.userid=this.Info.data.userid,t.qid=this.Info.data.qid,t.answers=this.Info.answers;var i="Added";this.Info.data.id>0&&(t.id=this.Info.data.id,i="Updated"),this.showLoader=!0,this.dataService.PostAnswer(t).subscribe((function(t){"error"===t.status?e.coreActions.Notify({title:t.message,text:"",css:"bg-error"}):(e.coreActions.Notify({title:"Record "+i+" Successfully",text:"",css:"bg-success"}),e.activeModal.close({data:t.record,isenabled:i})),e.showLoader=!1}),(function(t){e.showLoader=!1,e.coreActions.Notify({title:"Error Occured",text:"",css:"bg-danger"})}))}else this.coreActions.Notify({title:"Permission Denied",text:"",css:"bg-danger"})}},{key:"close",value:function(){this.activeModal.dismiss("Cancel Clicked")}}]),t}()).\u0275fac=function(t){return new(t||a)(d.Mb(s.a),d.Mb(p.a),d.Mb(f.a),d.Mb(A.a))},a.\u0275cmp=d.Gb({type:a,selectors:[["viewmodal"]],inputs:{Info:"Info"},features:[d.yb([p.a,f.a])],decls:7,vars:3,consts:[[1,"modal-header"],[1,"modal-title"],["type","button","aria-label","Close",1,"close",3,"click"],["aria-hidden","true"],[3,"controls","showLoader","OnSubmit","OnClose"]],template:function(t,e){1&t&&(d.Sb(0,"div",0),d.Sb(1,"h4",1),d.Gc(2),d.Rb(),d.Sb(3,"button",2),d.ec("click",(function(){return e.activeModal.dismiss("Cross click")})),d.Sb(4,"span",3),d.Gc(5,"\xd7"),d.Rb(),d.Rb(),d.Rb(),d.Sb(6,"dynamic-modal-form",4),d.ec("OnSubmit",(function(t){return e.SubmitForm(t)}))("OnClose",(function(){return e.close()})),d.Rb()),2&t&&(d.zb(2),d.Hc(e.title),d.zb(4),d.nc("controls",e.controls)("showLoader",e.showLoader))},directives:[R.a],encapsulation:2}),a),k=i("nD3/"),C=i("Hjmt"),G=i("RDfn"),O=i("4HLj"),_=function(t){return[t]};function L(t,e){if(1&t&&(d.Sb(0,"span"),d.Sb(1,"a",24),d.Gc(2),d.Rb(),d.Rb()),2&t){var i=e.$implicit;d.zb(1),d.nc("routerLink",d.rc(2,_,"/blogs/category/"+i.category.term)),d.zb(1),d.Hc(i.category.title)}}function T(t,e){if(1&t&&(d.Sb(0,"div"),d.Sb(1,"div",22),d.Gc(2," Categories "),d.Rb(),d.Sb(3,"div",22),d.Ec(4,L,3,4,"span",23),d.Rb(),d.Nb(5,"hr"),d.Rb()),2&t){var i=d.gc();d.zb(4),d.nc("ngForOf",i.Info.category_list)}}function z(t,e){if(1&t&&(d.Sb(0,"span"),d.Sb(1,"a",25),d.Gc(2),d.Rb(),d.Rb()),2&t){var i=e.$implicit;d.zb(1),d.nc("routerLink",d.rc(2,_,"/qa/tag/"+i.slug)),d.zb(1),d.Hc(i.title)}}function M(t,e){if(1&t&&(d.Sb(0,"div"),d.Sb(1,"div",22),d.Gc(2," Tags: "),d.Rb(),d.Ec(3,z,3,4,"span",23),d.Rb()),2&t){var i=d.gc();d.zb(3),d.nc("ngForOf",i.Info.tags_arr)}}function N(t,e){1&t&&(d.Sb(0,"span",26),d.Gc(1,"Blocked"),d.Rb())}function E(t,e){1&t&&(d.Sb(0,"span",27),d.Gc(1,"Active"),d.Rb())}function q(t,e){1&t&&(d.Sb(0,"span",5),d.Gc(1,"Approved"),d.Rb())}function D(t,e){1&t&&(d.Sb(0,"span",28),d.Gc(1,"Under Review"),d.Rb())}function P(t,e){1&t&&(d.Sb(0,"span",29),d.Gc(1,"Featured"),d.Rb())}function F(t,e){1&t&&(d.Sb(0,"span",26),d.Gc(1,"Adult"),d.Rb())}function Q(t,e){1&t&&(d.Sb(0,"span",26),d.Gc(1,"Resolved"),d.Rb())}function j(t,e){if(1&t&&(d.Sb(0,"a",39),d.Gc(1),d.Rb()),2&t){var i=d.gc().$implicit;d.nc("routerLink",d.rc(3,_,"/users/profile/"+i.userid)),d.zb(1),d.Jc("",i.author.firstname," ",i.author.lastname,"")}}function x(t,e){if(1&t){var i=d.Tb();d.Sb(0,"div",0),d.Sb(1,"div",1),d.Sb(2,"div",31),d.Nb(3,"div",7),d.Sb(4,"div",32),d.Sb(5,"a",33),d.ec("click",(function(t){d.xc(i);var n=e.$implicit;return d.gc(2).editAnswer(n,t),!1})),d.Nb(6,"i",34),d.Rb(),d.Sb(7,"a",33),d.ec("click",(function(t){d.xc(i);var n=e.$implicit,o=e.index;return d.gc(2).delete(n,o,t),!1})),d.Nb(8,"i",35),d.Rb(),d.Rb(),d.Rb(),d.Nb(9,"div",8),d.Nb(10,"hr"),d.Gc(11," Posted "),d.Sb(12,"a",36),d.Gc(13),d.Rb(),d.Gc(14," by "),d.Ec(15,j,2,5,"a",37),d.Sb(16,"span",38),d.Gc(17),d.hc(18,"number"),d.Rb(),d.Rb(),d.Rb()}if(2&t){var n=e.$implicit;d.zb(9),d.nc("innerHTML",n.description,d.yc),d.zb(4),d.Hc(n.customize_date),d.zb(2),d.nc("ngIf",n.author&&""!==n.author.firstname),d.zb(2),d.Ic(" ",d.jc(18,4,n.votes,".2")," votes")}}function H(t,e){if(1&t&&(d.Sb(0,"div"),d.Ec(1,x,19,7,"div",30),d.Rb()),2&t){var i=d.gc();d.zb(1),d.nc("ngForOf",i.Info.qa_answers)}}var $,J=(($=function(){function t(e,i,n){_classCallCheck(this,t),this.modalService=e,this.settingService=i,this.dataService=n,this.Info={},this.Author_FullName="",this.Auth={}}return _createClass(t,[{key:"ngOnInit",value:function(){var t=this;this.auth$.subscribe((function(e){t.Auth=e}))}},{key:"PostAnswer",value:function(){var t=this.settingService.getAnswerInitObject();t.userid=this.Auth.User.id,t.qid=this.Info.id,this.TriggleModal(t)}},{key:"editAnswer",value:function(t,e){this.TriggleModal(t),e.stopPropagation()}},{key:"TriggleModal",value:function(t){var e=this,i="Post Answer";t.id>0&&(i="Update Answer");var n=this.modalService.open(w,{backdrop:!1});n.componentInstance.Info={title:i,data:t,answers:this.Info.qa_answers.length,viewType:0},n.result.then((function(t){if("Added"===t.isenabled)e.Info.qa_answers.push(t.data);else{var i=!0,n=!1,o=void 0;try{for(var a,s=e.Info.qa_answers[Symbol.iterator]();!(i=(a=s.next()).done);i=!0){var r=a.value;r.id===t.data.id&&(r.description=t.data.description)}}catch(c){n=!0,o=c}finally{try{i||null==s.return||s.return()}finally{if(n)throw o}}}}),(function(t){console.log("dismissed")}))}},{key:"delete",value:function(t,e,i){var n=confirm("Are you sure you want to delete selected answer?");t.answers=this.Info.qa_answers.length,!0===n&&(e>-1&&this.Info.qa_answers.splice(e,1),this.dataService.DeleteAnswer([t]).subscribe((function(t){console.log(t)}))),i.stopPropagation()}}]),t}()).\u0275fac=function(t){return new(t||$)(d.Mb(s.b),d.Mb(h.a),d.Mb(f.a))},$.\u0275cmp=d.Gb({type:$,selectors:[["app-qa-info"]],inputs:{Info:"Info",Author_FullName:"Author_FullName"},decls:56,vars:45,consts:[[1,"card"],[1,"card-body"],[1,"text-muted"],[1,"fa","fa-clock-o"],[1,"light"],[1,"badge","badge-info","m-r-5"],[1,"m-t-10","row"],[1,"col-md-10"],[3,"innerHTML"],[4,"ngIf"],[1,"btn","btn-primary",3,"routerLink"],["class","badge badge-danger  m-r-5",4,"ngIf"],["class","badge badge-success  m-r-5",4,"ngIf"],["class","badge badge-info  m-r-5",4,"ngIf"],["class","badge badge-warning  m-r-5",4,"ngIf"],["class","badge badge-primary  m-r-5",4,"ngIf"],[1,"col-md-2","text-center"],[1,"m-b-10",3,"routerLink"],[1,"img-thumbnail",3,"src","alt"],[1,"card-title",3,"routerLink"],[1,"m-b-10","m-t-10"],[1,"btn","btn-primary",3,"click"],[1,"m-b-10"],[4,"ngFor","ngForOf"],[1,"btn","btn-info","m-r-5",3,"routerLink"],[1,"btn","btn-danger","m-r-5",3,"routerLink"],[1,"badge","badge-danger","m-r-5"],[1,"badge","badge-success","m-r-5"],[1,"badge","badge-warning","m-r-5"],[1,"badge","badge-primary","m-r-5"],["class","card",4,"ngFor","ngForOf"],[1,"row"],[1,"col-md-2"],["href","#",1,"m-l-5",3,"click"],[1,"fa","fa-pencil","text-inverse","m-r-10"],[1,"fa","fa-close","text-danger"],["href","",1,"light"],[3,"routerLink",4,"ngIf"],[1,"badge","badge-info","m-l-5"],[3,"routerLink"]],template:function(t,e){1&t&&(d.Sb(0,"div",0),d.Sb(1,"div",1),d.Sb(2,"h3"),d.Gc(3),d.Rb(),d.Sb(4,"p"),d.Gc(5," Asked: "),d.Sb(6,"span",2),d.Nb(7,"i",3),d.Rb(),d.Gc(8),d.hc(9,"date"),d.Rb(),d.Sb(10,"p",4),d.Sb(11,"span",5),d.Gc(12),d.hc(13,"number"),d.Rb(),d.Sb(14,"span",5),d.Gc(15),d.hc(16,"number"),d.Rb(),d.Sb(17,"span",5),d.Gc(18),d.hc(19,"number"),d.Rb(),d.Sb(20,"span",5),d.Gc(21),d.hc(22,"number"),d.Rb(),d.Rb(),d.Sb(23,"div",6),d.Sb(24,"div",7),d.Nb(25,"div",8),d.Nb(26,"hr"),d.Ec(27,T,6,1,"div",9),d.Ec(28,M,4,1,"div",9),d.Nb(29,"hr"),d.Sb(30,"a",10),d.Gc(31,"User Asked Questions"),d.Rb(),d.Nb(32,"hr"),d.Sb(33,"h4"),d.Gc(34,"Status"),d.Rb(),d.Sb(35,"div"),d.Ec(36,N,2,0,"span",11),d.Ec(37,E,2,0,"span",12),d.Ec(38,q,2,0,"span",13),d.Ec(39,D,2,0,"span",14),d.Ec(40,P,2,0,"span",15),d.Ec(41,F,2,0,"span",11),d.Ec(42,Q,2,0,"span",11),d.Rb(),d.Rb(),d.Sb(43,"div",16),d.Sb(44,"a",17),d.Nb(45,"img",18),d.Rb(),d.Sb(46,"a",19),d.Gc(47),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Nb(48,"hr"),d.Sb(49,"h2"),d.Gc(50),d.Rb(),d.Ec(51,H,2,1,"div",9),d.Nb(52,"hr"),d.Sb(53,"div",20),d.Sb(54,"button",21),d.ec("click",(function(){return e.PostAnswer()})),d.Gc(55,"Post Answer"),d.Rb(),d.Rb()),2&t&&(d.zb(3),d.Hc(e.Info.title),d.zb(5),d.Ic(" ",d.jc(9,24,e.Info.created_at,"fullDate")," "),d.zb(4),d.Ic("",d.jc(13,27,e.Info.answers,".2")," answers"),d.zb(3),d.Ic("",d.jc(16,30,e.Info.votes,".2")," votes"),d.zb(3),d.Ic("",d.jc(19,33,e.Info.views,".2")," views "),d.zb(3),d.Ic("",d.jc(22,36,e.Info.favorites,".2")," favorites"),d.zb(4),d.nc("innerHTML",e.Info.description,d.yc),d.zb(2),d.nc("ngIf",e.Info.category_list.length>0),d.zb(1),d.nc("ngIf",e.Info.tags_arr.length>0),d.zb(2),d.nc("routerLink",d.rc(39,_,"/qa/user/"+e.Info.userid)),d.zb(6),d.nc("ngIf",0==e.Info.isenabled),d.zb(1),d.nc("ngIf",1==e.Info.isenabled),d.zb(1),d.nc("ngIf",1==e.Info.isapproved),d.zb(1),d.nc("ngIf",0==e.Info.isapproved),d.zb(1),d.nc("ngIf",1==e.Info.isfeatured),d.zb(1),d.nc("ngIf",1==e.Info.isadult),d.zb(1),d.nc("ngIf",1==e.Info.isresolved),d.zb(2),d.nc("routerLink",d.rc(41,_,"/users/profile/"+e.Info.author.id)),d.zb(1),d.oc("src",e.Info.author.img_url,d.zc),d.oc("alt",e.Author_FullName),d.zb(1),d.nc("routerLink",d.rc(43,_,"/users/profile/"+e.Info.author.id)),d.zb(1),d.Hc(e.Author_FullName),d.zb(3),d.Ic("",e.Info.qa_answers.length," Answers"),d.zb(1),d.nc("ngIf",e.Info.qa_answers.length>0))},directives:[r.o,l.e,r.n],pipes:[r.e,r.f],encapsulation:2}),Object(I.a)([Object(y.e)(["users","auth"])],$.prototype,"auth$",void 0),$);function K(t,e){1&t&&(d.Sb(0,"div"),d.Sb(1,"h2",1),d.Gc(2,"Access Denied"),d.Rb(),d.Rb())}function U(t,e){1&t&&d.Nb(0,"app-loader")}function B(t,e){if(1&t){var i=d.Tb();d.Sb(0,"div"),d.Sb(1,"div",4),d.Sb(2,"app-toolbar-v2",5),d.ec("Action",(function(t){return d.xc(i),d.gc(2).toolbaraction(t)})),d.Rb(),d.Sb(3,"div",6),d.Nb(4,"app-qa-info",7),d.Rb(),d.Rb(),d.Rb()}if(2&t){var n=d.gc(2);d.zb(2),d.nc("Options",n.ToolbarOptions)("isItemsSelected",n.isItemsSelected),d.zb(2),d.nc("Author_FullName",n.Author_FullName)("Info",n.Info)}}function V(t,e){if(1&t&&(d.Sb(0,"div"),d.Sb(1,"div",2),d.Sb(2,"div",3),d.Ec(3,U,1,0,"app-loader",0),d.Ec(4,B,5,4,"div",0),d.Rb(),d.Rb(),d.Rb()),2&t){var i=d.gc();d.zb(3),d.nc("ngIf",i.showLoader),d.zb(1),d.nc("ngIf",!i.showLoader)}}var Y,X,W,Z,tt=((Y=function(){function t(e,i,n,o,a,s,r,c){_classCallCheck(this,t),this.settingService=e,this.dataService=i,this.coreActions=n,this.coreService=o,this.route=a,this.permission=s,this.modalService=r,this.router=c,this.isItemsSelected=!0,this.RecordID=0,this.FilterOptions={},this.controls=[],this.showLoader=!1,this.formHeading="QA Information",this.submitText="Submit",this.Info={},this.uploadedFiles=[],this.SelectedItems=[],this.Author_FullName="",this.isAccessGranted=!1,this.isActionGranded=!1}return _createClass(t,[{key:"ngOnInit",value:function(){var t=this;this.auth$.subscribe((function(e){t.permission.GrandResourceAccess(!1,"1521395965196","1521396022188",e.Role)&&(t.isAccessGranted=!0,t.permission.GrandResourceAction("1521395965196",e.Role)&&(t.isActionGranded=!0))})),this.ToolbarOptions=this.settingService.getToolbarOptions(0,!0),this.ToolbarOptions.showtoolbar=!1,this.ToolbarOptions.showcheckAll=!1,this.ToolbarOptions.showsecondarytoolbar=!0,this.ToolbarOptions.ProfileView=!0,this.route.params.subscribe((function(e){t.RecordID=t.coreService.decrypt(e.id),isNaN(t.RecordID)&&(t.RecordID=0),t.RecordID>0&&t.LoadInfo()}))}},{key:"LoadInfo",value:function(){var t=this;this.showLoader=!0,this.dataService.GetInfo(this.RecordID).subscribe((function(e){"error"===e.status?(t.coreActions.Notify({title:e.message,text:"",css:"bg-success"}),t.router.navigate(["/qa"])):(t.Info=e.post,t.Info.tags_arr=null!==t.Info.tags&&""!==t.Info.tags?t.ProcessCategories(t.Info.tags.split(",")):[],t.SelectedItems=[],t.SelectedItems.push(t.Info)),t.showLoader=!1}))}},{key:"ProcessCategories",value:function(t){var e=[],i=!0,n=!1,o=void 0;try{for(var a,s=t[Symbol.iterator]();!(i=(a=s.next()).done);i=!0){var r=a.value;e.push({title:r.trim(),slug:r.trim().replace(/\s+/g,"-").toLowerCase()})}}catch(c){n=!0,o=c}finally{try{i||null==s.return||s.return()}finally{if(n)throw o}}return e}},{key:"toolbaraction",value:function(t){switch(t.action){case"m_markas":this.ProcessActions(t.value);break;case"add":return void this.Trigger_Modal({title:"Ask Question",isActionGranded:this.isActionGranded,data:this.settingService.getInitObject(),viewType:1});case"edit":return void this.Trigger_Modal({title:"Edit Question",isActionGranded:this.isActionGranded,data:this.Info,viewType:2})}}},{key:"Trigger_Modal",value:function(t){var e=this.modalService.open(w,{backdrop:!1});e.componentInstance.Info=t,e.result.then((function(t){}),(function(t){console.log("dismissed")}))}},{key:"ProcessActions",value:function(t){if(this.isActionGranded){if(this.SelectedItems.length>0){var e=!0,i=!1,n=void 0;try{for(var o,a=this.SelectedItems[Symbol.iterator]();!(e=(o=a.next()).done);e=!0)o.value.actionstatus=t.actionstatus}catch(s){i=!0,n=s}finally{try{e||null==a.return||a.return()}finally{if(i)throw n}}this.dataService.ProcessActions(this.SelectedItems,t,0)}}else this.coreActions.Notify({title:"Permission Denied",text:"",css:"bg-danger"})}}]),t}()).\u0275fac=function(t){return new(t||Y)(d.Mb(h.a),d.Mb(f.a),d.Mb(A.a),d.Mb(k.a),d.Mb(l.a),d.Mb(C.a),d.Mb(s.b),d.Mb(l.c))},Y.\u0275cmp=d.Gb({type:Y,selectors:[["ng-component"]],hostVars:1,hostBindings:function(t,e){2&t&&d.Kc("@fadeInAnimation",void 0)},decls:2,vars:2,consts:[[4,"ngIf"],[1,"m-b-40","m-t-40","text-center"],[1,"row"],[1,"col-md-12"],[1,"card"],[3,"Options","isItemsSelected","Action"],[1,"card-body"],[3,"Author_FullName","Info"]],template:function(t,e){1&t&&(d.Ec(0,K,3,0,"div",0),d.Ec(1,V,5,2,"div",0)),2&t&&(d.nc("ngIf",!e.isAccessGranted),d.zb(1),d.nc("ngIf",e.isAccessGranted))},directives:[r.o,G.a,O.a,J],encapsulation:2,data:{animation:[S.a]}}),Object(I.a)([Object(y.e)(["users","auth"])],Y.prototype,"auth$",void 0),Y),et=i("AnEY"),it=((X=function t(){_classCallCheck(this,t)}).\u0275mod=d.Kb({type:X}),X.\u0275inj=d.Jb({factory:function(t){return new(t||X)},imports:[[r.c,m.a,l.f,c.i,et.a]]}),X),nt=i("S0rc"),ot=((W=function t(){_classCallCheck(this,t),this.isAdmin=!0}).\u0275fac=function(t){return new(t||W)},W.\u0275cmp=d.Gb({type:W,selectors:[["ng-component"]],decls:1,vars:1,consts:[[3,"isAdmin"]],template:function(t,e){1&t&&d.Nb(0,"app-qa-process",0),2&t&&d.nc("isAdmin",e.isAdmin)},directives:[nt.a],encapsulation:2}),W),at=i("OPJD"),st=((Z=function t(){_classCallCheck(this,t)}).\u0275mod=d.Kb({type:Z}),Z.\u0275inj=d.Jb({factory:function(t){return new(t||Z)},providers:[h.a,f.a,p.a,v.a],imports:[[r.c,m.a,l.f,c.i,at.b]]}),Z);function rt(t,e){1&t&&(d.Sb(0,"div"),d.Sb(1,"h2",1),d.Gc(2,"Access Denied"),d.Rb(),d.Rb())}function ct(t,e){1&t&&d.Nb(0,"app-loader")}function lt(t,e){if(1&t&&(d.Sb(0,"div"),d.Nb(1,"google-chart",5),d.Rb()),2&t){var i=d.gc(2);d.zb(1),d.nc("data",i.tooltipChart)}}function dt(t,e){if(1&t&&(d.Sb(0,"div"),d.Sb(1,"div",6),d.Sb(2,"h3",7),d.Gc(3),d.Rb(),d.Rb(),d.Rb()),2&t){var i=d.gc(2);d.zb(3),d.Ic(" ",i.message," ")}}function bt(t,e){if(1&t){var i=d.Tb();d.Sb(0,"div"),d.Sb(1,"div",2),d.Sb(2,"div",3),d.Sb(3,"app-toolbar-v2",4),d.ec("Action",(function(t){return d.xc(i),d.gc().toolbaraction(t)})),d.Rb(),d.Ec(4,ct,1,0,"app-loader",0),d.Ec(5,lt,2,1,"div",0),d.Ec(6,dt,4,1,"div",0),d.Rb(),d.Rb(),d.Rb()}if(2&t){var n=d.gc();d.zb(3),d.nc("isAdmin",n.isAdmin)("Options",n.ToolbarOptions),d.zb(1),d.nc("ngIf",n.showLoader),d.zb(1),d.nc("ngIf",!n.showLoader&&n.optionSelected),d.zb(1),d.nc("ngIf",!n.showLoader&&!n.optionSelected)}}var ut,ht=((ut=function(){function t(e,i,n,o,a,s,r,c,l){_classCallCheck(this,t),this.settingService=e,this.dataService=i,this.coreService=n,this.coreActions=o,this.actions=a,this.route=s,this.formService=r,this.permission=c,this.router=l,this.FilterOptions={},this.showLoader=!1,this.formHeading="QA Reports",this.isAdmin=!0,this.optionSelected=!1,this.ChartType="ColumnChart",this.message="Please select report type to generate!",this.isAccessGranted=!1,this.isActionGranded=!1,this.tooltipChart={chartType:"ColumnChart",dataTable:[],options:{title:"Questions Asked",legend:"none",width:1e3,height:500,is3D:!0}}}return _createClass(t,[{key:"ngOnInit",value:function(){var t=this;this.auth$.subscribe((function(e){t.permission.GrandResourceAccess(!1,"1521396112858","1521396141248",e.Role)&&(t.isAccessGranted=!0,t.permission.GrandResourceAction("1521396112858",e.Role)&&(t.isActionGranded=!0))})),this.filteroptions$.subscribe((function(e){t.FilterOptions=e})),this.ToolbarOptions=this.settingService.getToolbarOptions(0,!0),this.ToolbarOptions.showtoolbar=!0,this.ToolbarOptions.showcheckAll=!1,this.ToolbarOptions.showsecondarytoolbar=!1,this.ToolbarOptions.left_options=this.prepareLeftOptions(),this.ToolbarOptions.right_options=this.prepareRightOptions(),this.ToolbarOptions.right_options[0].title=this.ChartType}},{key:"prepareLeftOptions",value:function(){return[{title:"Select Type",ismultiple:!0,Options:[{id:1,title:"Yearly",value:0,isclick:!0,clickevent:"reporty_type",tooltip:"Generate yearly report"},{id:2,title:"Monthly (Last 12 Months)",value:1,isclick:!0,clickevent:"reporty_type",tooltip:"Generate monthly report"},{id:3,title:"Daily (Current Month)",value:2,isclick:!0,clickevent:"reporty_type",tooltip:"Generate daily report"}]}]}},{key:"prepareRightOptions",value:function(){return[{title:"Chart Type",ismultiple:!0,Options:[{id:1,title:"ColumnChart",value:"ColumnChart",isclick:!0,clickevent:"chart_type",tooltip:"Generate Column Chart"},{id:2,title:"BarChart",value:"BarChart",isclick:!0,clickevent:"chart_type",tooltip:"Generate Bar Chart"},{id:3,title:"LineChart",value:"LineChart",isclick:!0,clickevent:"chart_type",tooltip:"Generate Line Chart"},{id:3,title:"PieChart",value:"PieChart",isclick:!0,clickevent:"chart_type",tooltip:"Generate Pie Chart"}]}]}},{key:"toolbaraction",value:function(t){if(this.isActionGranded){switch(t.action){case"chart_type":this.ChartType=t.value,console.log("chart type is "+this.ChartType),this.showLoader=!0,this.ToolbarOptions.right_options[0].title=this.ChartType,this.FilterOptions.chartType=this.ChartType,this.showLoader=!1;break;case"reporty_type":this.FilterOptions.reporttype=t.value}this.LoadReports()}else this.coreActions.Notify({title:"Permission Denied",text:"",css:"bg-danger"})}},{key:"LoadReports",value:function(){var t=this;this.showLoader=!0,this.dataService.LoadReports(this.FilterOptions).subscribe((function(e){t.tooltipChart.chartType=t.ChartType,e.data.dataTable.length>1?(t.tooltipChart.dataTable=e.data.dataTable,t.optionSelected=!0):(t.message="No Data Available!",t.optionSelected=!1),t.showLoader=!1}))}}]),t}()).\u0275fac=function(t){return new(t||ut)(d.Mb(h.a),d.Mb(f.a),d.Mb(k.a),d.Mb(A.a),d.Mb(v.a),d.Mb(l.a),d.Mb(p.a),d.Mb(C.a),d.Mb(l.c))},ut.\u0275cmp=d.Gb({type:ut,selectors:[["ng-component"]],hostVars:1,hostBindings:function(t,e){2&t&&d.Kc("@fadeInAnimation",void 0)},decls:2,vars:2,consts:[[4,"ngIf"],[1,"m-b-40","m-t-40","text-center"],[1,"row"],[1,"col-md-12"],[3,"isAdmin","Options","Action"],[3,"data"],[2,"padding","80px 0px"],[2,"text-align","center"]],template:function(t,e){1&t&&(d.Ec(0,rt,3,0,"div",0),d.Ec(1,bt,7,5,"div",0)),2&t&&(d.nc("ngIf",!e.isAccessGranted),d.zb(1),d.nc("ngIf",e.isAccessGranted))},directives:[r.o,O.a,G.a,at.a],encapsulation:2,data:{animation:[S.a]}}),Object(I.a)([Object(y.e)(["qa","filteroptions"])],ut.prototype,"filteroptions$",void 0),Object(I.a)([Object(y.e)(["users","auth"])],ut.prototype,"auth$",void 0),ut);i.d(e,"QAModule",(function(){return vt}));var ft,pt=[{path:"",data:{title:"QA Management",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"Management"}]},component:u},{path:"tag/:tagname",data:{title:"QA Management",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"Management"}]},component:u},{path:"category/:catname",data:{title:"QA Management",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"Management"}]},component:u},{path:"user/:uname",data:{title:"QA Management",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"Management"}]},component:u},{path:"filter/:abuse",data:{title:"QA Management (Reported Questions)",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"(Reported Questions)"}]},component:u},{path:"profile/:id",data:{title:"QA Information",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"QA Information"}]},component:tt},{path:"reports",data:{title:"Reports Overview",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"Reports Overview"}]},component:ht},{path:"process/:id",data:{title:"Add / Update QA",urls:[{title:"Dashboard",url:"/"},{title:"QA",url:"/qa"},{title:"Add / Update QA"}]},component:ot}],vt=((ft=function t(){_classCallCheck(this,t)}).\u0275mod=d.Kb({type:ft}),ft.\u0275inj=d.Jb({factory:function(t){return new(t||ft)},imports:[[r.c,c.i,m.a,g,it,et.a,st,s.c,l.f.forChild(pt)]]}),ft)}}]);