using Jugnoon.Framework;
using Jugnoon.Utility;
using System.Text;
using System.Threading.Tasks;

namespace Jugnoon.qa
{
    public class QAFeeds
    {
        //**************************************************
        // Sitemap Generation Script
        //**************************************************
        #region Sitemaps
        // Generate Topic Url - Yahoo Submission
        public static async Task<string> BuildYahooSiteMap_QAUrls(ApplicationDbContext context, int pagenumber)
        {
            var str = new StringBuilder();
            str.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            str.AppendLine("<rss version=\"2.0\" xmlns:ror=\"http://rorweb.com/0.1/\" >");
            str.AppendLine("<channel>");
            str.AppendLine("<title>" + Jugnoon.Settings.Configs.GeneralSettings.website_title + "</title>");
            str.AppendLine("<link>" + Config.GetUrl() + "</link>");

            var _items = await QABLL.LoadItems(context, new QAEntity()
            {
                pagenumber = pagenumber,
                ispublic = true
            });
            foreach (var item in _items)
            {
                str.AppendLine("<item>");
                var url = QAUrls.Prepare_QA_Url(item, "");
                str.AppendLine("<link>" + url + "</link>");
                str.AppendLine("<title>" + item.title + "</title>");

                str.AppendLine("<description>" + item.description + " detail information, id: " + item.title + ".</description>");
                str.AppendLine("<ror:updatePeriod></ror:updatePeriod>");
                str.AppendLine("<ror:sortOrder>2</ror:sortOrder>");
                str.AppendLine("<ror:resourceOf>sitemap</ror:resourceOf> ");
                str.AppendLine("</item>");
            }

            // close sitemap url
            str.AppendLine("</channel>");
            str.AppendLine("</rss>");

            return str.ToString();
        }

        // Generate Topic Url - Google Submission
        public static async Task<string> BuildGoogleSiteMap_QAUrls(ApplicationDbContext context, int pagenumber)
        {
            var str = new StringBuilder();
            str.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"  xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">");

            var _items = await QABLL.LoadItems(context, new QAEntity()
            {
                pagenumber = pagenumber,
                ispublic = true
            });
            foreach (var item in _items)
            {
                str.AppendLine("<url>");
                var url = QAUrls.Prepare_QA_Url(item, "");
                str.AppendLine("<loc>" + url + "</loc>");
                str.AppendLine("</url>");
            }
            // close sitemap url
            str.AppendLine("</urlset>");

            return str.ToString();
        }
        #endregion
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

