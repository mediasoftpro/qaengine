using Jugnoon.Framework;
using Jugnoon.Utility;

namespace Jugnoon.Blogs
{
    public class BlogUrlConfig
    {
        public static string Generate_Post_Url(JGN_Blogs entity)
        {
            string URLTITLE = "";
            int maxium_length = Jugnoon.Settings.Configs.GeneralSettings.maximum_dynamic_link_length;
            if (entity.title.Length > maxium_length && maxium_length > 0)
                URLTITLE = entity.title.Substring(0, maxium_length);
            else if (entity.title.Length < 3)
                URLTITLE = "preview-post";
            else
                URLTITLE = entity.title;

            URLTITLE = UtilityBLL.ReplaceSpaceWithHyphin_v2(URLTITLE.Trim().ToLower());

            return Config.GetUrl("post/" + entity.id + "/" + URLTITLE);
        }

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

