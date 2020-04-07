using Jugnoon.Utility;
using Jugnoon.Framework;

namespace Jugnoon.qa
{
    public class QAUrls
    {
        public static string Prepare_QA_Url(long id, string title, string parameters)
        {
            return Prepare_QA_Url(new JGN_Qa()
            {
                id = id,
                title = title
            }, parameters);
        }
        public static string Prepare_QA_Url(JGN_Qa entity, string parameters)
        {
            string _title = "";
            int maxium_length = Jugnoon.Settings.Configs.GeneralSettings.maximum_dynamic_link_length;
            if (entity.title.Length > maxium_length && maxium_length > 0)
                _title = entity.title.Substring(0, maxium_length);
            else if (entity.title.Length < 3)
                _title = "preview-qa";
            else
                _title = entity.title;

            _title = UtilityBLL.ReplaceSpaceWithHyphin_v2(_title.Trim().ToLower());

            return Config.GetUrl("question/" + entity.id + "/" + _title + "" + parameters);
        }

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
