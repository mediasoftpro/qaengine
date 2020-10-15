using Jugnoon.Scripts;
using Jugnoon.Utility;
using System.Text;
/// <summary>
/// Utility class for processing and storing blog / articles media (photos etc) into AWS Cloud
/// </summary>
namespace Jugnoon.Blogs
{   
    public class AwsCloud
    {
        public static string UploadPostCover(string files, string username)
        {
            var str = new StringBuilder();

            if (Jugnoon.Settings.Configs.AwsSettings.enable && Configs.AwsSettings.bucket != null && Configs.AwsSettings.bucket != "")
            {
                // set paths
                if (files.Contains(","))
                {
                    var photos = files.Split(char.Parse(","));
                    foreach (var item in photos)
                    {
                        if (str.ToString() != "")
                            str.Append(",");

                        if (!item.StartsWith("http"))
                        {
                            str.Append(_ProcFile(item, username));
                        }
                        else
                        {
                            str.Append(item);

                        }
                    }
                }
                else
                {
                    if (!files.StartsWith("http"))
                    {
                        str.Append(_ProcFile(files, username));
                    }
                    else
                    {
                        str.Append(files);
                    }

                }
            }
            else
            {
                str.Append(files);
            }
            return str.ToString();
        }

        private static string _ProcFile(string file, string username)
        {
            var filename = file;
            string strPath = SiteConfig.Environment.ContentRootPath + DirectoryPaths.BlogsPhotoDirectoryPath;
            string Org_Path = strPath + "" + filename;
            string Thumb_Path = strPath + "thumbs/" + filename;

            // upload file to cloud server
            string original_photo_path = Configs.AwsSettings.original_directory_path;
            string thumb_photo_path = Configs.AwsSettings.thumb_directory_path;  
           
            string org_filename = username + "/" + filename;
            string thumb_filename = username + "/" + filename;
         
            if (original_photo_path != "")
            {
                if (original_photo_path.EndsWith("/"))
                    org_filename = original_photo_path + "" + org_filename;
                else
                    org_filename = original_photo_path + "/" + org_filename;
            }
            if (thumb_photo_path != "")
            {
                if (thumb_photo_path.EndsWith("/"))
                    thumb_filename = thumb_photo_path + "" + thumb_filename;
                else
                    thumb_filename = thumb_photo_path + "/" + thumb_filename;
            }
           
            // add key to avoid duplications
            string contenttype = "image/jpeg";
            if (thumb_filename.EndsWith(".gif"))
                contenttype = "image/gif";
            else if (thumb_filename.EndsWith(".png"))
                contenttype = "image/png";

            string status = "";
            status = CloudStorage.UploadFile(Thumb_Path, thumb_filename, Configs.AwsSettings.bucket, contenttype);
            status = CloudStorage.UploadFile(Org_Path, org_filename, Configs.AwsSettings.bucket, contenttype);
           
            // Delete file from local directory
            if (System.IO.File.Exists(Thumb_Path))
                System.IO.File.Delete(Thumb_Path);

            // Original File
            if (System.IO.File.Exists(strPath + "" + filename))
                System.IO.File.Delete(strPath + "" + filename);
                       
            // prepare url
            string _publish_path = "";
            string public_url = Configs.AwsSettings.cdn_URL;

            if (public_url != "")
            {
                if (public_url.StartsWith("http"))
                {
                    _publish_path = public_url;
                }
                else
                {
                    _publish_path = "https://" + public_url;

                }

                if (!_publish_path.EndsWith("/"))
                {
                    _publish_path = _publish_path + "/";

                }
                // publish path
                if (Configs.AwsSettings.thumb_directory_path != "")
                {
                    _publish_path = _publish_path + Configs.AwsSettings.thumb_directory_path;
                    if (!_publish_path.EndsWith("/"))
                        _publish_path = _publish_path + "/";
                }

                // attach with user folder
                _publish_path = _publish_path + "" + username;

            }
            if (_publish_path != "")
                filename = _publish_path + "/" + filename;


            return filename;
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
