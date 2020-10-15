using System;

namespace Jugnoon.Entity
{
    public class LocationEntity : ContentEntity
    {
        public long parentid { get; set; } = 0;

        public bool skipCountryStates { get; set; } = false;

        public bool loadCountries { get; set; } = false;

        public string country { get; set; } = ""; // ISO3 e.g USA

        public string state { get; set; } = "";

        public string city { get; set; } = "";

        public bool loadStates { get; set; } = false; // need country param

        public bool loadCities { get; set; } = false; // need state param

        public string start_search_key { get; set; } = "";

        public bool loadRecords { get; set; } = false; // load data whos records > 0
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
