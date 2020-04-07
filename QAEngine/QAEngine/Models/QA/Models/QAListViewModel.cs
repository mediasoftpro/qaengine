using System.Collections.Generic;
using Jugnoon.Models;

namespace Jugnoon.qa.Models
{
    public class qaListViewModel : ListViewModel
    {
        public int TotalRecords { get; set; }
        public List<Framework.JGN_Qa> DataList { get; set; }
        public QAEntity QueryOptions { set; get; }

        public qaListFilterViewModel Navigation { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
