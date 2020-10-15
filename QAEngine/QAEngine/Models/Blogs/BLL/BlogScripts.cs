using Jugnoon.Entity;
using Jugnoon.Framework;
using Jugnoon.Utility;
using System.Text;
using System.Text.RegularExpressions;
using Jugnoon.BLL;

namespace Jugnoon.Blogs
{
    public class BlogScripts
    {
        /// <summary>
        /// Fetch first n paragraphs from blog posts
        /// </summary>
        public static string PrepareShortDescription(string Description, int no_of_paragraphs = 2)
        {
            var expression = @"(?<paragraph>\<p\>(.*?)\</p\>)";
            Match m = Regex.Match(Description, expression, RegexOptions.Compiled | RegexOptions.IgnoreCase);

            var short_description = new StringBuilder();
            var paragraph_attached = 0;
            while (m.Success)
            {
                var group = m.Groups["paragraph"];
                if (paragraph_attached < no_of_paragraphs)
                {
                    short_description.Append(group.ToString());
                    paragraph_attached++;
                }
                m = m.NextMatch();
            }
            return short_description.ToString();
        }

        /// <summary>
        /// Fetch leaving n paragraphs from blog posts (remaining all except first n paragraphs)
        /// </summary>
        public static string PrepareLastParagraphs(string Description, int no_of_paragraphs = 1)
        {
            var expression = @"(?<paragraph>\<p\>(.*?)\</p\>)";
            Match m = Regex.Match(Description, expression, RegexOptions.Compiled | RegexOptions.IgnoreCase);

            var short_description = new StringBuilder();
            var paragraph_left = 0;
            while (m.Success)
            {
                var group = m.Groups["paragraph"];
                if (paragraph_left >= no_of_paragraphs)
                {
                    short_description.Append(group.ToString());
                }
                paragraph_left++;
                m = m.NextMatch();
            }
            return short_description.ToString();
        }

        public static string Generate_Auto_Tag_Links(ApplicationDbContext context, string text)
        {
            var _lst = TagsBLL.LoadItems(context, new TagEntity()
            {
                type = TagsBLL.Types.Blogs
            }).Result;
            if (_lst.Count == 0)
                return text;
            if (_lst.Count > 0)
            {
                int i = 0;
                string keywords = "";
                for (i = 0; i <= _lst.Count - 1; i++)
                {
                    if (_lst[i].title.Length > 3)
                    {
                        keywords = @"(?<hrefurl><a[^>]*>.*?</a>)|(?<term>(\b" + _lst[i].title.Trim().ToLower() + @"\b))";
                        text = Regex.Replace(text, keywords, new MatchEvaluator(AutoTagLink));

                    }
                }
            }
            return text;
        }

        public static string AutoTagLink(Match match)
        {
            if (match.Groups["term"].Success)
            {
                return "<a href=\"" + TagUrlConfig.PrepareUrl(match.Groups["term"].Value, "blogs/") + "\" title=\"" + match.Groups["term"].Value.ToString().Trim() + "\">" + match.Groups["term"].Value.ToString() + "</a>";
            }
            else
            {
                // no match
                return match.Groups["hrefurl"].Value;
            }
        }

        public static string Generate_Auto_Category_Links(ApplicationDbContext context, string text)
        {
            var _lst = CategoryBLL.LoadItems(context, new CategoryEntity()
            {
                type = 6
            }).Result;

            if (_lst.Count == 0)
                return text;
            if (_lst.Count > 0)
            {
                int i = 0;
                string keywords = "";
                string _cname = "";
                for (i = 0; i <= _lst.Count - 1; i++)
                {
                    if (_lst[i].term != "")
                        _cname = _lst[i].term;
                    else
                        _cname = _lst[i].title;

                    if (_cname.Length > 3)
                    {
                        keywords = @"(?<hrefurl><a[^>]*>.*?</a>)|(@<term>(\b" + _cname.Trim().ToLower() + @"\b))";
                        text = Regex.Replace(text, keywords, new MatchEvaluator(AutoCategoryLink));

                    }
                }
            }
            return text;
        }


        private static string AutoCategoryLink(Match match)
        {
            if (match.Groups["term"].Success)
            {
                return "<a href=\"" + CategoryUrlConfig.PrepareUrl(match.Groups["term"].Value, "blogs/") + "\" title=\"" + match.Groups["term"].Value.ToString().Trim() + "\">" + match.Groups["term"].Value.ToString() + "</a>";
            }
            else
            {
                // no match
                return match.Groups["hrefurl"].Value;
            }
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

