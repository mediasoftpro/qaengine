import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../reducers/store/model";

// services
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";
import { AppConfig } from "../../configs/app.config";
// shared services
import { CoreService } from "../../admin/core/coreService";
import { fadeInAnimation } from "../../animations/core";

import { Notify } from "../../reducers/core/actions";
import {auth} from "../../reducers/users/selectors";
// reducer actions
//import { MessageAPIActions } from "./reducer/actions";
//import { PermissionService } from "../../admin/users/services/permission.service";

@Component({
  templateUrl: "./messages.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" },
})
export class MessageComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    public config: AppConfig
  ) {}

 readonly auth$ = this._store.pipe(select(auth));

  showLoader = false;
  showMessageLoader = false;
  showMessagePanel = false;
  User: any = {};
  Recipents: any = [];
  SelectedRecipent: any = {};
  MessageList: any = [];
  message = "";
  query: any = {
    From: "",
    term: "",
  };
  message_query: any = {};
  UnreadMessages: any = [];
  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
      this.User = auth.User;
      this.LoadRecipents();
    });
  }

  LoadRecipents() {
    this.query.From = this.User.id;
    if (this.config.getGlobalVar("apptype") === "account") {
      this.query.loadReceiverUserList = true;
    } else {
      this.query.loadUserList = true;
    }

    this.showLoader = true;
    this.dataService.LoadRecipents(this.query).subscribe(
      (data: any) => {
        this.Recipents = data.posts;

        if (data.posts.length > 0) {
          // load first recipent all [recent 10] messages communication
          this.SelectedRecipent = data.posts[0];
          this.LoadMessages(data.posts[0].message.id);
        }
        this.showLoader = false;
      },
      (err) => {
        console.log("error occured");
      }
    );
  }

  LoadMessages(messageid: any) {
    this.message_query.id = messageid;
    this.message_query.pagesize = 10;
    this.message_query.order = "recipent.msg_sent";
    this.showMessageLoader = true;

    this.dataService.LoadMessages(this.message_query).subscribe(
      (data: any) => {
        this.MessageList = data.posts;
        for(let message of this.MessageList) {
           if (message.msg_read === null && message.to_uid === this.User.id) {
             this.UnreadMessages.push({ messageid: message.message.id});
           }
        }
        this.marked_as_read();
        this.showMessageLoader = false;
      },
      (err) => {
        console.log("error occured");
      }
    );

   
  }

  getMessageList(recipent: any, event: any) {
    this.SelectedRecipent = recipent;
    this.LoadMessages(recipent.message.id);
    event.stopPropagation();
  }

  sendMessage() {
    if (this.message === "") {
      this._store.dispatch(new Notify({
        title: "Please enter message to continue.",
        text: "",
        css: "bg-danger"
      }));
     
      return;
    }
    this.showMessagePanel = true;
    let object: any = {
      message: {
        subject: this.SelectedRecipent.message.subject,
        reply_id: this.SelectedRecipent.message.id,
        body: this.message,
        from_uid: this.User.id,
      },
      to_uid: this.SelectedRecipent.user.id,
    };

    this.dataService.SendMessage(object).subscribe(
      (data: any) => {
        this._store.dispatch(new Notify({
          title: "Message Sent",
          text: "",
          css: "bg-danger"
        }));
        
        this.message = "";
        this.showMessagePanel = false;
        // refresh message list
        this.LoadMessages(this.SelectedRecipent.message.id);
      },
      (err) => {
        console.log("error occured");
      }
    );
  }

  marked_as_read() {
  
    if (this.UnreadMessages.length > 0) {
        this.dataService.Marked_As_Read(this.UnreadMessages).subscribe(
          (data: any) => {},
          (err) => {
            console.log("error occured");
          }
        );
    }
   
  }
}
