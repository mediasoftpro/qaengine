using Jugnoon.Models;
using Jugnoon.qa;
using System.Collections.Generic;

namespace Jugnoon.qa.Models
{
    public class qaAccountListViewModel : ListViewModel
    {
        public int TotalRecords { get; set; }

        public List<Jugnoon.Framework.JGN_Qa> DataList { set; get; }

        public QAEntity QueryOptions { set; get; }

        public bool ShowDelete { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */


