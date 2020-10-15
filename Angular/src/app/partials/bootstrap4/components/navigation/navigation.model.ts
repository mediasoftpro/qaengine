/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface ISearchOptions {
  term?: string;
  categoryname?: string;
  showpanel?: boolean;
  showAdvanceSearchLink?: boolean;
  showSearchPanel?: boolean;
  categorymodule?: boolean;
  datefiltermodule?: boolean;
  singleaction?: boolean;
  datefilter: number;
  selectedcategory: string;
  categories: any;
  datefilterOptions?: IDropdownOptions[];
  filters?: IFilters[];
  checkFilters?: IFilters[];
  dropdownFilters?: IFilters[];
  actions?: IActions[];
  navList?: any;
}

interface IFilters {
  id?: number;
  title: string;
  value: string;
  default_value: string;
  selected?: boolean;
  attr?: string;
}

interface IDropdownOptions {
  id: number;
  title: string;
}

interface IActions {
  id: number;
  title: string;
  tooltip: string;
  row: number;
  icon: string;
  options: any;
  css: string;
  event: string;
}

export interface IClickActions {
  id: number;
  title: string;
  value: string;
  isclick: boolean;
  clickevent: string;
  icon: string;
  tooltip: string;
}
