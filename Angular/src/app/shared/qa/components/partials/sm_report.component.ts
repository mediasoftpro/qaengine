/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import * as selectors from "../../../../reducers/admin/dashboard/selectors";
import { Notify } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";
import { DataService } from "../../services/data.service";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { CoreService } from "../../../../admin/core/coreService";

@Component({
  selector: "app-smqa-report-admin",
  templateUrl: "./sm_report.html",
  providers: [DataService, SettingsService],
})
export class SMQAReportComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private router: Router,
    private coreService: CoreService
  ) {}

  @Input() title = "QA Report [Year]";
  //@Input() type = 0; // 0: My , 1: Favorited
  //@Input() browse_url = '/';
  //@Input() rout_url = '/';
  @Input() NoRecordText = "No Data Found!";
  @Input() isAdmin = false;
  //@Input() stats = 0;
  //@Input() row_class = "col-md-4 col-sm-6 col-xs-12";
  //@Input() pagesize = 6;
  //@Input() orderby = "ad.created_at desc";

  readonly auth$ = this._store.pipe(select(auth));

  readonly is_qa_report_loaded$ = this._store.pipe(
    select(selectors.is_qa_report_loaded)
  );
  readonly qa_report$ = this._store.pipe(select(selectors.qa_report));
  readonly qa_report_loading$ = this._store.pipe(
    select(selectors.qa_report_loading)
  );
  
  chartType = "ColumnChart";
  groupBy = "Month";
  reporttype = "Year";

  public reportData: any = {
    chartType: "ColumnChart",
  };

  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
      //this.LoadRecords(auth.User);
    });
    this.is_qa_report_loaded$.subscribe((loaded: boolean) => {
      if (!loaded) {
        this.GenerateReport();
      }
    });
    this.qa_report$.subscribe((report: any) => {
      this.reportData = report;
    });
  }

  GenerateReport() {
    const query: any = {
      groupbyType: this.groupBy, // Day / Month / Year
      reporttype: this.reporttype, // Today / Yesterday / TodayYesterday / Week / LastWeek / Month / LastMonth / Year
      chartType: this.chartType, //  ColumnChart, BarChart,  LineChart,  PieChart,
    };

    this.dataService.GenerateSummaryReport(query);
  }

  renderChart(index: number, event: any) {
    switch (index) {
      case 0:
        this.chartType = "ColumnChart";
        break;
      case 1:
        this.chartType = "BarChart";
        break;
      case 2:
        this.chartType = "LineChart";
        break;
      case 3:
        this.chartType = "PieChart";
        break;
    }
    this.GenerateReport();
    event.stopPropagation();
  }

  filterData(index: number, event: any) {
    switch (index) {
      case 0:
        this.groupBy = "Day";
        this.reporttype = "Month";
        break;
      case 1:
        this.groupBy = "Month";
        this.reporttype = "Year";
        break;
    }
    this.GenerateReport();
    event.stopPropagation();
  }
}
