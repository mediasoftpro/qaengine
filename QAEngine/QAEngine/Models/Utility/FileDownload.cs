/*using System;
using System.IO;
using Jugnoon.Settings;

namespace Jugnoon.Utility
{

    public class FileDownload
    {

        public static string Generate_Label(string original_filename, string label, string path)
        {
            string rootpath = SiteConfig.Environment.ContentRootPath;
            string filename = "";
            if (original_filename.EndsWith("jpeg"))
                filename = UtilityBLL.ReplaceSpaceWithHyphin(label) + ".jpeg";
            else
                filename = UtilityBLL.ReplaceSpaceWithHyphin(label) + ".jpg";

            string strPath = rootpath + "" + path;
            if (File.Exists(strPath + "/" + filename))
            {
                if (original_filename.EndsWith("jpeg"))
                    filename = UtilityBLL.ReplaceSpaceWithHyphin(label) + "-" + Guid.NewGuid().ToString().Substring(0, 5) + ".jpeg";
                else
                    filename = UtilityBLL.ReplaceSpaceWithHyphin(label) + "-" + Guid.NewGuid().ToString().Substring(0, 5) + ".jpg";

                if (File.Exists(strPath + "/" + filename))
                {
                    filename = Guid.NewGuid().ToString().Substring(0, 9) + "" + original_filename;
                }
            }

            filename = filename.Replace(" ", "");
            return filename;
        }

       /* public static string Download_JPEG(string url, string filename, int minimum_image_width, int thumb_width, int midthumb_width, string thumb_path, string mid_thumb_path, string original_path)
        {
            Bitmap mp = null;
            Bitmap midmp = null;
            try
            {
                System.Net.HttpWebRequest oRequest = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(url);
                System.Net.WebResponse oResponse = (System.Net.WebResponse)oRequest.GetResponse();
                System.IO.BinaryReader oReader = new System.IO.BinaryReader(oResponse.GetResponseStream());
                string Contenttype = oResponse.ContentType;
                if (Contenttype == "image/jpeg")
                {

                    string rootpath = SiteConfig.Environment.ContentRootPath;
                    string OriginalPhotoPath = "";
                    string MidPhotoPath = "";
                    string ThumbPhotoPath = "";
                    if (original_path != "")
                        OriginalPhotoPath = rootpath + "" + original_path + "" + filename;
                    if (mid_thumb_path != "")
                        MidPhotoPath = rootpath + "" + mid_thumb_path + "" + filename;
                    if (thumb_path != "")
                        ThumbPhotoPath = rootpath + "" + thumb_path + "" + filename;

                    System.IO.FileStream oFile = new System.IO.FileStream(OriginalPhotoPath, System.IO.FileMode.OpenOrCreate, System.IO.FileAccess.ReadWrite, System.IO.FileShare.None);
                    System.IO.BinaryWriter oWriter = new System.IO.BinaryWriter(oFile);

                    Copy(oResponse.GetResponseStream(), oFile);
                    oWriter.Close();
                    oWriter = null;
                    oFile.Close();
                    oFile = null;
                    oReader.Close();
                    oReader = null;
                    oResponse.Close();
                    oResponse = null;
                    oRequest = null;
                    // Check whether thumb size greater than 300 otherwsie remove it and stop processing.
                    Bitmap val_img_width = new Bitmap(OriginalPhotoPath, false);
                    if (val_img_width.Width > minimum_image_width)
                    {
                        if (thumb_path != "")
                        {
                            Copy_Photo(OriginalPhotoPath, ThumbPhotoPath);
                            mp = Jugnoon.Utility.Image.CreateThumbnail(OriginalPhotoPath, Site_Settings.Thumb_Width, Site_Settings.Thumb_Height);
                            if (mp == null)
                            {
                                return "";
                            }
                            mp.Save(ThumbPhotoPath);
                            // Photo compression
                            Jugnoon.Utility.Image.SaveJpeg(ThumbPhotoPath, mp, 90);

                            mp.Dispose();
                        }
                        if (mid_thumb_path != "")
                        {
                            Jugnoon.Utility.Image.CreateCropThumbnail(OriginalPhotoPath, Site_Settings.MediumThumbWidth, Site_Settings.MediumThumbHeight, MidPhotoPath);
                            
                        }
                    }
                    else
                    {
                        return "";
                    }
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                return "101";
            }

            return filename;
        }*/
/*
        private static void Copy_Photo(string original_path, string new_path)
        {
            FileInfo TheFile = new FileInfo(original_path);
            if (TheFile.Exists)
            {
                File.Copy(original_path, new_path);
            }
            else
            {
                throw new FileNotFoundException();
            }
        }

        public static void Copy(Stream source, Stream target)
        {
            if (!source.CanRead)
            {
                throw new ArgumentException("Not readable", "source");
            }

            if (!target.CanWrite)
            {
                throw new ArgumentException("Not writable", "target");
            }

            byte[] buffer = new byte[0x1000];
            int bytes;
            try
            {
                while ((bytes = source.Read(buffer, 0, buffer.Length)) > 0)
                {
                    target.Write(buffer, 0, bytes);
                }
            }
            finally
            {
                target.Flush();
            }
        }

    }
}*/