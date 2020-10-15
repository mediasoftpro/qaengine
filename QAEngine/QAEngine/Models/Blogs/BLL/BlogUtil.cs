using Jugnoon.Utility;
using System.Text.RegularExpressions;
using Jugnoon.Framework;

namespace Jugnoon.Blogs
{
    public class BlogUtil
    {
        public static string Return_Blog_Single_Image(JGN_Blogs Entity, string defaultpath)
        {
            string ProcessedPictureName = "";
          
            var BlogImages = Entity.picture_url.Split(char.Parse(","));
            if (BlogImages.Length > 0)
            {
                string Picture = BlogImages[0].ToString();
                if (!Picture.StartsWith("http"))
                {
                    string ImagePath = "thumbs/";
                    ProcessedPictureName = Config.GetUrl() + "contents/blogs/" + ImagePath + "" + Picture;
                }
                else
                {
                    ProcessedPictureName = Picture;
                }
            }
            else
            {
                // default picture
                ProcessedPictureName = defaultpath;
            }
            return ProcessedPictureName;
        }

        public static string Return_Blog_Image(string Picture, string defaultpath)
        {
            string ProcessedPictureName = Picture;
            if (!Picture.StartsWith("http"))
            {
                string ImagePath = "thumbs/";
                ProcessedPictureName = Config.GetUrl() + "contents/blogs/" + ImagePath + "" + Picture;
            }
            else if (ProcessedPictureName == null || ProcessedPictureName == "")
            {
                ProcessedPictureName = defaultpath;
            }
            return ProcessedPictureName;
        }

        public static string Return_Blog_Cover(string Cover)
        {
            string ProcessedPictureName = Cover;
            if (!Cover.StartsWith("http"))
            {
                ProcessedPictureName = Config.GetUrl() + "contents/blogs/" + Cover;
            }
            return ProcessedPictureName;
        }

        public static string Prepare_Description(JGN_Blogs Entity, int Length)
        {
            var _desc = BBCode.MakeHtml(Entity.description, true);

            if (_desc.Length > Length)
            {
                _desc = UtilityBLL.StripHTML(_desc.Substring(0, Length) + "...stpr");
                string removeBrokenHyperlinks = Regex.Replace(_desc, @"<a(.*)?stpr", "");

                string removeBrokenP = Regex.Replace(removeBrokenHyperlinks, @"<p(.*)?stpr", "");
                _desc = removeBrokenP.Replace("stpr", "");
            }
            else
            {
                _desc = UtilityBLL.StripHTML(_desc);
            }
            return _desc;
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

