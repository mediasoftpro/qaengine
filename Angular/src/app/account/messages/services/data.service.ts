import { Injectable } from "@angular/core";
// import { MessageAPIActions } from '../reducer/actions';
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";


@Injectable()
export class DataService {
  // headers  = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON

  constructor(
    private settings: SettingsService,
    private http: HttpClient,
  ) {}

  LoadMessages(query: any) {
    const URL = this.settings.getApiOptions().load;
    return this.http.post(URL, JSON.stringify(query));
  }

  LoadRecipents(query: any) {
    const URL = this.settings.getApiOptions().load_recipents;
    return this.http.post(URL, JSON.stringify(query));
  }

  Marked_As_Read(query: any) {
    const URL = this.settings.getApiOptions().marked_as_read;
    return this.http.post(URL, JSON.stringify(query));
  }

  
  SendMessage(obj) {
    return this.http.post(
      this.settings.getApiOptions().proc,
      JSON.stringify(obj)
    );
  }
}
