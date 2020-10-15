
using Jugnoon.Entity;

namespace Jugnoon.Gamify
{
    public class BadgeEntity : ContentEntity
    {
        public byte type { get; set; } = 0;

        public byte isdeduct { get; set; } = 2;

        public byte ishide { get; set; } = 2;

        public byte ismultiple { get; set; } = 2;

        public string icon { get; set; } = "";
        
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

