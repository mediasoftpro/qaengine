(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{S0rc:function(t,e,i){"use strict";i.d(e,"a",(function(){return w}));var s=i("mrSG"),o=i("Usal"),r=i("zIGt"),a=i("YaUu"),c=i("t+rW"),n=i("pdjO"),d=i("fXoL"),h=i("ZHT1"),l=i("jyKJ"),b=i("nD3/"),u=i("LEd3"),p=i("mbCC"),m=i("tyNb"),g=i("Hjmt"),v=i("kwlv"),f=i("ofXK"),S=i("RDfn"),A=i("+kG/");function O(t,e){1&t&&(d.Sb(0,"div"),d.Sb(1,"h2",1),d.Gc(2,"Access Denied"),d.Rb(),d.Rb())}function R(t,e){1&t&&d.Nb(0,"app-loader")}function y(t,e){if(1&t){const t=d.Tb();d.Sb(0,"dynamic-modal-form",9),d.ec("OnSubmit",(function(e){return d.xc(t),d.gc(2).SubmitForm(e)})),d.Rb()}if(2&t){const t=d.gc(2);d.nc("controls",t.controls)("showLoader",t.showLoader)("showCancel",!1)("showModal",!1)("submitText",t.submitText)}}function I(t,e){if(1&t&&(d.Sb(0,"div"),d.Sb(1,"div",2),d.Sb(2,"div",3),d.Sb(3,"div",4),d.Sb(4,"div",5),d.Sb(5,"h4",6),d.Gc(6),d.Rb(),d.Rb(),d.Sb(7,"div",7),d.Ec(8,R,1,0,"app-loader",0),d.Ec(9,y,1,5,"dynamic-modal-form",8),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb()),2&t){const t=d.gc();d.zb(6),d.Hc(t.formHeading),d.zb(2),d.nc("ngIf",t.showLoader),d.zb(1),d.nc("ngIf",!t.showLoader)}}let w=(()=>{class t{constructor(t,e,i,s,o,r,a,c,n,d){this.settingService=t,this.dataService=e,this.coreService=i,this.coreActions=s,this.actions=o,this.route=r,this.permission=a,this.formService=c,this.router=n,this.categoryDataService=d,this.isAdmin=!0,this.route_path="/qa/",this.RecordID=0,this.controls=[],this.showLoader=!1,this.formHeading="Ask Question",this.submitText="Submit",this.IsLoaded=!1,this.Categories=[],this.Auth={},this.isAccessGranted=!1,this.isActionGranded=!1,this.Settings={}}ngOnInit(){this.settings$.subscribe(t=>{this.Settings=t}),this.auth$.subscribe(t=>{if(this.Auth=t,this.isAdmin){const e="1521395965196";this.permission.GrandResourceAccess(!1,e,"1521396022188",t.Role)&&(this.isAccessGranted=!0,this.permission.GrandResourceAction(e,t.Role)&&(this.isActionGranded=!0))}else this.isAccessGranted=!0,this.isActionGranded=!0}),this.route.params.subscribe(t=>{this.RecordID=this.coreService.decrypt(t.id),isNaN(this.RecordID)&&(this.RecordID=0),this.RecordID>0?(this.formHeading="Update Information",this.submitText="Save Changes",this.Initialize()):this.initializeControls(this.settingService.getInitObject())}),this.categories$.subscribe(t=>{t.length>0?(this.Categories=t,this.updateCategories()):(this.showLoader=!0,this.categoryDataService.LoadDropdownCategories(11))}),this.dropdown_categories$.subscribe(t=>{t.length>0&&(this.Categories=t,this.updateCategories()),this.showLoader=!1}),this.isloaded$.subscribe(t=>{this.IsLoaded=t,this.IsLoaded||this.Redirect()})}Initialize(){this.RecordID>0?this.isAdmin?this.LoadInfo():this.dataService.Authorize_Author({id:this.RecordID,userid:this.Auth.User.id}).subscribe(t=>{t.isaccess?this.LoadInfo():this.Redirect()},t=>{this.Redirect()}):this.Redirect()}Redirect(){this.router.navigate([this.route_path])}LoadInfo(){this.showLoader=!0,this.dataService.GetInfo(this.RecordID).subscribe(t=>{"success"===t.status?this.initializeControls(t.post):(this.coreActions.Notify({title:t.message,text:"",css:"bg-error"}),this.initializeControls(this.settingService.getInitObject())),this.showLoader=!1})}updateCategories(){this.coreService.updateCategories(this.controls,this.Categories)}initializeControls(t){this.controls=this.formService.getControls(t,this.Settings,this.isAdmin),this.updateCategories()}SubmitForm(t){if(!this.isActionGranded)return void this.coreActions.Notify({title:"Permission Denied",text:"",css:"bg-danger"});this.showLoader=!0;let e="Added";this.RecordID>0&&(t.id=this.RecordID,e="Updated"),t.userid=this.Auth.User.id,t.categories=this.coreService.returnSelectedCategoryArray(t.categories),t.isadmin=this.isAdmin,this.dataService.AddRecord(t).subscribe(t=>{"error"===t.status?this.coreActions.Notify({title:t.message,text:"",css:"bg-error"}):(this.coreActions.Notify({title:"Record "+e+" Successfully",text:"",css:"bg-success"}),this.actions.reloadList(),this.router.navigate(this.isAdmin?[this.route_path]:[this.route_path+"profile/"+this.coreService.encrypt(t.record.id)])),this.showLoader=!1},t=>{this.showLoader=!1,this.coreActions.Notify({title:"Error Occured",text:"",css:"bg-danger"})})}}return t.\u0275fac=function(e){return new(e||t)(d.Mb(h.a),d.Mb(l.a),d.Mb(b.a),d.Mb(u.a),d.Mb(p.a),d.Mb(m.a),d.Mb(g.a),d.Mb(v.a),d.Mb(m.c),d.Mb(r.a))},t.\u0275cmp=d.Gb({type:t,selectors:[["app-qa-process"]],inputs:{isAdmin:"isAdmin",route_path:"route_path"},features:[d.yb([r.a,a.a,c.a])],decls:2,vars:2,consts:[[4,"ngIf"],[1,"m-b-40","m-t-40","text-center"],[1,"row"],[1,"col-md-9"],[1,"card"],[1,"card-header"],[1,"m-b-0"],[1,"card-body"],[3,"controls","showLoader","showCancel","showModal","submitText","OnSubmit",4,"ngIf"],[3,"controls","showLoader","showCancel","showModal","submitText","OnSubmit"]],template:function(t,e){1&t&&(d.Ec(0,O,3,0,"div",0),d.Ec(1,I,10,3,"div",0)),2&t&&(d.nc("ngIf",!e.isAccessGranted),d.zb(1),d.nc("ngIf",e.isAccessGranted))},directives:[f.o,S.a,A.a],encapsulation:2,data:{animation:[n.a]}}),Object(s.a)([Object(o.e)(["qa","categories"])],t.prototype,"categories$",void 0),Object(s.a)([Object(o.e)(["categories","dropdown_categories"])],t.prototype,"dropdown_categories$",void 0),Object(s.a)([Object(o.e)(["qa","isloaded"])],t.prototype,"isloaded$",void 0),Object(s.a)([Object(o.e)(["qa","settings"])],t.prototype,"settings$",void 0),Object(s.a)([Object(o.e)(["users","auth"])],t.prototype,"auth$",void 0),t})()},eYWs:function(t,e,i){"use strict";i.d(e,"a",(function(){return R}));var s=i("mrSG"),o=i("Usal"),r=i("pdjO"),a=i("fXoL"),c=i("ZHT1"),n=i("jyKJ"),d=i("nD3/"),h=i("Hjmt"),l=i("LEd3"),b=i("mbCC"),u=i("tyNb"),p=i("ofXK"),m=i("/H0e"),g=i("4HLj"),v=i("YJke");function f(t,e){1&t&&(a.Sb(0,"div"),a.Sb(1,"h2",3),a.Gc(2,"Access Denied"),a.Rb(),a.Rb())}function S(t,e){if(1&t){const t=a.Tb();a.Sb(0,"div"),a.Sb(1,"div",4),a.Sb(2,"div",5),a.Sb(3,"app-navigation-v2",6),a.ec("Action",(function(e){return a.xc(t),a.gc(2).toolbaraction(e)}))("SearchSelection",(function(e){return a.xc(t),a.gc(2).FindRecords(e)})),a.Rb(),a.Rb(),a.Sb(4,"div",7),a.Sb(5,"app-toolbar-v2",8),a.ec("Action",(function(e){return a.xc(t),a.gc(2).toolbaraction(e)}))("SelectAllCard",(function(e){return a.xc(t),a.gc(2).selectAll(e)})),a.Rb(),a.Sb(6,"div",9),a.Sb(7,"app-qa-list",10),a.ec("View",(function(e){return a.xc(t),a.gc(2).toolbaraction(e)}))("SelectedItems",(function(e){return a.xc(t),a.gc(2).getSelectedItems(e)})),a.Rb(),a.Rb(),a.Rb(),a.Rb(),a.Rb()}if(2&t){const t=a.gc(2);a.zb(3),a.nc("isAdmin",t.isAdmin)("FilterOptions",t.FilterOptions)("Options",t.SearchOptions),a.zb(2),a.nc("isAdmin",t.isAdmin)("Options",t.ToolbarOptions)("isItemsSelected",t.isItemsSelected),a.zb(2),a.nc("route_path",t.route_path)("PublicView",t.PublicView)("type",t.type)("isAdmin",t.isAdmin)("isActionGranded",t.isActionGranded)}}function A(t,e){if(1&t&&(a.Sb(0,"div",2),a.Ec(1,f,3,0,"div",1),a.Ec(2,S,8,11,"div",1),a.Rb()),2&t){const t=a.gc();a.zb(1),a.nc("ngIf",!t.isAccessGranted),a.zb(1),a.nc("ngIf",t.isAccessGranted)}}function O(t,e){if(1&t){const t=a.Tb();a.Sb(0,"div"),a.Sb(1,"app-navigation-v2",6),a.ec("Action",(function(e){return a.xc(t),a.gc().toolbaraction(e)}))("SearchSelection",(function(e){return a.xc(t),a.gc().FindRecords(e)})),a.Rb(),a.Sb(2,"div",2),a.Sb(3,"div",9),a.Sb(4,"div",11),a.Sb(5,"app-toolbar-v2",8),a.ec("Action",(function(e){return a.xc(t),a.gc().toolbaraction(e)}))("SelectAllCard",(function(e){return a.xc(t),a.gc().selectAll(e)})),a.Rb(),a.Rb(),a.Sb(6,"app-qa-list",12),a.ec("View",(function(e){return a.xc(t),a.gc().toolbaraction(e)}))("SelectedItems",(function(e){return a.xc(t),a.gc().getSelectedItems(e)})),a.Rb(),a.Rb(),a.Rb(),a.Rb()}if(2&t){const t=a.gc();a.zb(1),a.nc("isAdmin",t.isAdmin)("FilterOptions",t.FilterOptions)("Options",t.SearchOptions),a.zb(4),a.nc("isAdmin",t.isAdmin)("Options",t.ToolbarOptions)("isItemsSelected",t.isItemsSelected),a.zb(1),a.nc("route_path",t.route_path)("PublicView",t.PublicView)("type",t.type)("isAdmin",t.isAdmin)}}let R=(()=>{class t{constructor(t,e,i,s,o,r,a,c){this.settingService=t,this.dataService=e,this.coreService=i,this.permission=s,this.coreActions=o,this.actions=r,this.router=a,this.route=c,this.isAdmin=!0,this.reload=!1,this.type=0,this.PublicView=!1,this.route_path="/qa/",this.isAccessGranted=!1,this.isActionGranded=!1,this.heading="QA",this.subheading="Management",this.IsLoaded=!1,this.User={},this.isItemsSelected=!1,this.Records=0,this.Pagination={},this.showReportLink=!1}ngOnInit(){this.auth$.subscribe(t=>{if(this.User=t.User,this.isAdmin){const e="1521395965196";this.permission.GrandResourceAccess(!1,e,"1521396022188",t.Role)&&(this.isAccessGranted=!0,this.permission.GrandResourceAction(e,t.Role)&&(this.isActionGranded=!0))}else this.isAccessGranted=!0,this.isActionGranded=!0}),this.SearchOptions=this.settingService.getSearchOptions(this.isAdmin),this.ToolbarOptions=this.settingService.getToolbarOptions(this.type,this.isAdmin),this.filteroptions$.subscribe(t=>{this.FilterOptions=t,this.reload?this.loadRecords(t):t.track_filter&&(this.loadRecords(t),t.track_filter=!1,this.actions.updateFilterOptions(t))}),this.isItemSelected$.subscribe(t=>{this.isItemsSelected=t}),this.records$.subscribe(t=>{this.Records=t}),this.pagination$.subscribe(t=>{this.Pagination=t}),this.categories$.subscribe(t=>{for(const e of t)this.SearchOptions.categories.push({key:e.id,value:e.title})}),this.route.params.subscribe(t=>{void 0!==t.tagname&&(this.FilterOptions.tags=t.tagname,this.FilterOptions.track_filter=!0,this.actions.updateFilterOptions(this.FilterOptions)),void 0!==t.catname&&(this.FilterOptions.categoryname=t.catname,this.FilterOptions.track_filter=!0,this.actions.updateFilterOptions(this.FilterOptions)),void 0!==t.uname&&(this.FilterOptions.userid=t.uname,this.FilterOptions.track_filter=!0,this.actions.updateFilterOptions(this.FilterOptions)),void 0!==t.abuse&&("abuse"===t.abuse?(this.FilterOptions.loadabusereports=!0,this.showReportLink=!0):"normallist"===t.abuse&&(this.FilterOptions.loadabusereports=!1,this.showReportLink=!1),this.FilterOptions.track_filter=!0,this.actions.updateFilterOptions(this.FilterOptions))}),this.isloaded$.subscribe(t=>{this.IsLoaded=t,!t||this.reload?this.loadRecords(this.FilterOptions):this.refreshStats()})}loadRecords(t){switch(this.type){case 0:t.loadliked=!1,t.loadfavorites=!1,t.loadanswers=!1;break;case 1:void 0!==t.userid&&""!==t.userid&&(t.loadfavorites=!0,t.loadliked=!1,t.loadanswers=!1);break;case 2:void 0!==t.userid&&""!==t.userid&&(t.loadliked=!0,t.loadfavorites=!1,t.loadanswers=!1);break;case 2:void 0!==t.userid&&""!==t.userid&&(t.loadanswers=!0,t.loadliked=!1,t.loadfavorites=!1)}this.coreService.renderAbuseReportBtn(this.SearchOptions.actions,t.loadabusereports),this.PublicView&&(t.ispublic=!0),this.dataService.LoadRecords(t)}selectAll(t){this.actions.selectAll({type:this.type,checked:t})}toolbaraction(t){switch(t.action){case"add":return void this.router.navigate([this.route_path+"process/0"]);case"abuse":return void this.router.navigate([this.route_path+"filter/abuse"]);case"normallist":return void this.router.navigate([this.route_path+"filter/normallist"]);case"reports":return void this.router.navigate([this.route_path+"reports"]);case"m_markas":return void this.ProcessActions(t.value);case"f_type":this.actions.applyFilter({attr:"type",value:t.value});break;case"f_isapproved":this.actions.applyFilter({attr:"isapproved",value:t.value});break;case"f_status":this.actions.applyFilter({attr:"isenabled",value:t.value});break;case"f_adult":this.actions.applyFilter({attr:"isadult",value:t.value});break;case"pagesize":this.actions.applyFilter({attr:"pagesize",value:t.value});break;case"m_filter":this.actions.applyFilter({attr:"datefilter",value:t.value});break;case"sort":this.actions.applyFilter({attr:"direction",value:t.value})}}FindRecords(t){const e=t.filters;e.tags="",e.userid="",e.pagenumber=1,e.track_filter=!0,this.actions.updateFilterOptions(e)}getSelectedItems(t){this.SelectedItems=t,this.isItemsSelected=this.SelectedItems.length>0}ProcessActions(t){if(this.isActionGranded){if(this.SelectedItems.length>0){for(const e of this.SelectedItems)e.actionstatus=t.actionstatus,this.type>0&&(e.userid=this.User.id);this.dataService.ProcessActions(this.SelectedItems,t,0)}}else this.coreActions.Notify({title:"Permission Denied",text:"",css:"bg-danger"})}refreshStats(){this.actions.refresh_pagination({type:this.type,totalrecords:this.Records,pagesize:this.FilterOptions.pagesize}),this.coreActions.refreshListStats({totalrecords:this.Records,pagesize:this.FilterOptions.pagesize,pagenumber:this.Pagination.currentPage})}}return t.\u0275fac=function(e){return new(e||t)(a.Mb(c.a),a.Mb(n.a),a.Mb(d.a),a.Mb(h.a),a.Mb(l.a),a.Mb(b.a),a.Mb(u.c),a.Mb(u.a))},t.\u0275cmp=a.Gb({type:t,selectors:[["app-qa-mainlist"]],hostVars:1,hostBindings:function(t,e){2&t&&a.Kc("@fadeInAnimation",void 0)},inputs:{isAdmin:"isAdmin",reload:"reload",type:"type",PublicView:"PublicView",route_path:"route_path"},decls:2,vars:2,consts:[["class","card",4,"ngIf"],[4,"ngIf"],[1,"card"],[1,"m-b-40","m-t-40","text-center"],[1,"row"],[1,"col-md-3"],[3,"isAdmin","FilterOptions","Options","Action","SearchSelection"],[1,"col-md-9"],[3,"isAdmin","Options","isItemsSelected","Action","SelectAllCard"],[1,"card-body"],[3,"route_path","PublicView","type","isAdmin","isActionGranded","View","SelectedItems"],[1,"m-b-20"],[3,"route_path","PublicView","type","isAdmin","View","SelectedItems"]],template:function(t,e){1&t&&(a.Ec(0,A,3,2,"div",0),a.Ec(1,O,7,10,"div",1)),2&t&&(a.nc("ngIf",e.isAdmin),a.zb(1),a.nc("ngIf",!e.isAdmin))},directives:[p.o,m.a,g.a,v.a],encapsulation:2,data:{animation:[r.a]}}),Object(s.a)([Object(o.e)(["qa","filteroptions"])],t.prototype,"filteroptions$",void 0),Object(s.a)([Object(o.e)(["qa","categories"])],t.prototype,"categories$",void 0),Object(s.a)([Object(o.e)(["qa","itemsselected"])],t.prototype,"isItemSelected$",void 0),Object(s.a)([Object(o.e)(["qa","isloaded"])],t.prototype,"isloaded$",void 0),Object(s.a)([Object(o.e)(["users","auth"])],t.prototype,"auth$",void 0),Object(s.a)([Object(o.e)(["qa","records"])],t.prototype,"records$",void 0),Object(s.a)([Object(o.e)(["qa","pagination"])],t.prototype,"pagination$",void 0),t})()}}]);