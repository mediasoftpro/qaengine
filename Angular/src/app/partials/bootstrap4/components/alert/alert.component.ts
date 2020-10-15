
/* -------------------------------------------------------------------------- */
/*                     Product Name: ClassifiedEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import * as selectors from "../../../../reducers/core/selectors";

@Component({
  selector: "app-alert",
  template: `
    <div *ngIf="showAlert" class="alert {{ alertCss }}" role="alert">
      <h4 *ngIf="heading != ''" class="alert-heading">{{ heading }}</h4>
      <p>{{ message }}</p>
    </div>
  `
})
export class BootstrapAlertComponent implements OnInit, OnChanges {

  constructor(private _store: Store<IAppState>) {}

  @Input() alert = "error";
  @Input() icon = "";
  @Input() heading = "";
  @Input() message = "";

  showAlert = false;
  alertCss = "alert-danger";

  readonly message$ = this._store.pipe(select(selectors.message));
  
  /*@select(["core", "message"])
  readonly message$: Observable<any>;*/

  // @Output() OnSelection = new EventEmitter<number>();
  ngOnInit() {
    this.message$.subscribe(msg => {
      if (msg.message != "") {
        this.message = msg.message;
        this.alert = msg.alert;
        this.heading = msg.heading;
        this.togglerAlert();
        this.updateAlert();
        this.InitializeInterval();
      }
    });

    this.togglerAlert();
    this.updateAlert();
  }

  ngOnChanges() {
    this.togglerAlert();
    this.updateAlert();
    this.InitializeInterval();
  }
  InitializeInterval() {
    var interval = setInterval(() => {
      if (this.message !== "") {
        this.message = "";
        this.showAlert = false;
      }
      clearInterval(interval);
    }, 10000);
  }
  togglerAlert() {
    if (this.message !== "") {
      this.showAlert = true;
    } else {
      this.showAlert = false;
    }
  }

  updateAlert() {
    switch (this.alert) {
      case "error":
        this.alertCss = "alert-danger";
        break;
      case "warning":
        this.alertCss = "alert-warning";
        break;
      case "info":
        this.alertCss = "alert-info";
        break;
      case "success":
        this.alertCss = "alert-success";
        break;
    }
  }
}
