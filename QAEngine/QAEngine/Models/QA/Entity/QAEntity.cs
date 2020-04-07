using System;
using Jugnoon.Entity;

namespace Jugnoon.qa
{
    public class QAEntity : ContentEntity
    {
        public int votes { get; set; } = 0;
        public ClosedActions isclosed { get; set; } = ClosedActions.Open;
        public ResolvedActions isresolved { get; set; } = ResolvedActions.Open;
        public int votesgreaterthan { get; set; } = 0;
        public int voteslessthan { get; set; } = 0;

        public bool loadanswers { get; set; } = false;
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
