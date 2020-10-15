using Jugnoon.BLL;
using Jugnoon.Entity;
using System;
using System.Collections.Generic;
using System.IO;
using Jugnoon.Utility;
using Jugnoon.Settings;
using Jugnoon.Scripts;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Jugnoon.Framework;
using QAEngine.Models;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Text;
using Jugnoon.Utility.Helper;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using Microsoft.Extensions.Primitives;
using Jugnoon.Setup;
using Jugnoon.Blogs;
using Jugnoon.Models;
using Jugnoon.Localize;

namespace QAEngine.Areas.api.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class blogsController : ControllerBase
    {
       
        ApplicationDbContext _context;
        private static readonly FormOptions _defaultFormOptions = new FormOptions();
        private readonly IWritableOptions<Jugnoon.Blogs.Settings.General> _general_options;
        private readonly IWritableOptions<Jugnoon.Blogs.Settings.Aws> _aws_options;
        public blogsController(
             IOptions<SiteConfiguration> settings,
             IMemoryCache memoryCache,
             ApplicationDbContext context,
             IWritableOptions<Jugnoon.Blogs.Settings.General> general_options,
             IWritableOptions<Jugnoon.Blogs.Settings.Aws> aws_options,
             IStringLocalizer<GeneralResource> generalLocalizer,
             IStringLocalizer<BlogResource> blogLocalizer,
             IWebHostEnvironment _environment,
             IHttpContextAccessor _httpContextAccessor,
             IOptions<General> generalSettings,
             IOptions<Aws> awsSettings,
             IOptions<Features> featureSettings,
             IOptions<Smtp> smtpSettings,
             IOptions<Media> mediaSettings,
             IOptions<Registration> registerSettings,
             IOptions<Jugnoon.Blogs.Settings.General> generalBlogSettings,
             IOptions<Jugnoon.Blogs.Settings.Aws> awsBlogSettings
         )
        {
            // readable settings
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.AwsSettings = awsSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;
            Jugnoon.Settings.Configs.RegistrationSettings = registerSettings.Value;
            // content specific settings
            Jugnoon.Blogs.Configs.BlogSettings = generalBlogSettings.Value;
            Jugnoon.Blogs.Configs.AwsSettings = awsBlogSettings.Value;
            // writable configuration injectors
            _general_options = general_options;
            _aws_options = aws_options;
            // normal injectors
            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
            _context = context;
           
            SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.blogLocalizer = blogLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        [HttpPost("load")]
        public async Task<ActionResult> load()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<BlogEntity>(json);
            var _posts = await BlogsBLL.LoadItems(_context, data);

            /* setup thumb path */
            foreach (var ph in _posts)
            {
                ph.url = BlogUrlConfig.Generate_Post_Url(ph);
                ph.description = BlogScripts.PrepareShortDescription(ph.description, 2);
                Setup_Item(ph);
            }
            var _categories = new List<JGN_Categories>();
            if (data.loadstats)
            {
                _categories = await CategoryBLL.LoadItems(_context, new CategoryEntity()
                {
                    id = 0,
                    type = 6,
                    mode = 0,
                    isenabled = EnabledTypes.All,
                    parentid = -1,
                    order = "level asc", // don't change this
                    issummary = false,
                    isdropdown = true,
                    loadall = true // load all data
                });
            }
            var _records = 0;
            if (data.postid == 0)
                _records = await BlogsBLL.Count(_context, data);

            var settings = new
            {
                general = Jugnoon.Blogs.Configs.BlogSettings,
                aws = Jugnoon.Blogs.Configs.AwsSettings
            };
            return Ok(new { posts = _posts, records = _records, categories = _categories, settings = settings });
        }

        [HttpPost("load_reports")]
        public async Task<ActionResult> load_reports()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<BlogEntity>(json);
            var _reports = await BlogsBLL.LoadReport(_context, data);
            return Ok(new { data = _reports });
        }


        [HttpPost("generate_report")]
        public async Task<ActionResult> generate_report()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<BlogEntity>(json);
            var _reports = await BlogReports.GenerateReport(_context, data);
            return Ok(new { data = _reports });
        }

        [HttpPost("getinfo")]
        public async Task<ActionResult> getinfo()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<BlogEntity>(json);
            data.nofilter = true;
            var _posts = await BlogsBLL.LoadItems(_context, data);

            if(_posts.Count > 0)
            {                
                if (_posts[0].picture_url != "")
                {
                    var _pics = _posts[0].picture_url.Split(char.Parse(","));
                    _posts[0].files = new List<FileEntity>();
                    foreach (var pic in _pics)
                    {
                        _posts[0].files.Add(new FileEntity()
                        {
                            filename = pic,
                            img_url = pic
                        });
                    }
                }

                Setup_Item(_posts[0]);

                _posts[0].author.img_url = UserUrlConfig.ProfilePhoto(_posts[0].author.Id, _posts[0].author.picturename, 0);
                // array of associate category list
                _posts[0].category_list = await CategoryContentsBLL.FetchContentCategoryList(_context, data.id, (byte)CategoryContentsBLL.Types.Blogs);

                return Ok(new { status = "success", post = _posts[0] });
            }
            else
            {
                return Ok(new { status = "error", message = SiteConfig.generalLocalizer["_no_records"].Value });
            }
            
        }

        [HttpPost("proc")]
        public async Task<ActionResult> proc()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var model = JsonConvert.DeserializeObject<JGN_Blogs>(json);

            if (model.title != null && model.title.Length < 5)
            {
                return Ok(new { status = "error", message = "Please enter title" });
            }

            if (model.description == null || model.description == "" || model.description.Length < 10)
            {
                return Ok(new { status = "error", message = "Please enter proper description" });
            }

            // validate tags
            if (model.tags != null && Jugnoon.Settings.Configs.FeatureSettings.enable_tags)
            {
                if (!TagsBLL.Validate_Tags(model.tags))
                {
                    return Ok(new { status = "error", message = "Tags not validated" });
                }

                // Process tags
                if (model.tags != "")
                {
                    TagsBLL.Process_Tags(_context, model.tags, TagsBLL.Types.Blogs, 0);
                }
            }

            var b_settings = new Jugnoon.Blogs.Settings.General();
            // process categories
            int _isapproved = 1; // enable it bydefault
            if (b_settings.blogPostModeration == 1)
            {
                // Moderator Review Required
                _isapproved = 0;
            }

            //XSS CLEANUP
            string content = "";
            if (model.description != null && model.description != "")
                content = UGeneral.SanitizeText(model.description);
            
           
            // normal tags
            if (b_settings.tag_Processing)
                content = BlogScripts.Generate_Auto_Tag_Links(_context, content);
            // normal category
            if (b_settings.category_Processing)
                content = BlogScripts.Generate_Auto_Category_Links(_context, content);

            // blog banner upload functionality
            if (model.cover_url != null && model.cover_url != "")
            {
                if (model.cover_url.StartsWith("data:image"))
                {
                    // base 64 image
                    var image_url = model.cover_url.Replace("data:image/png;base64,", "");
                    byte[] image = Convert.FromBase64String(image_url);
                    // create image name
                    var _title = UtilityBLL.ReplaceSpaceWithHyphin(model.title);
                    if (_title.Length > 15)
                        _title = _title.Substring(0, 15);
                    string thumbFileName = _title + Guid.NewGuid().ToString().Substring(0, 8) + ".png";

                    var path = SiteConfig.Environment.ContentRootPath + DirectoryPaths.BlogsPhotoDirectoryPath;
                    if (System.IO.File.Exists(path + "" + thumbFileName))
                        System.IO.File.Delete(path + "" + thumbFileName);

                    // local storage
                    System.IO.File.WriteAllBytes(path + "" + thumbFileName, image);
                    model.cover_url = await Jugnoon.Helper.Aws.UploadPhoto(_context, thumbFileName, path, Jugnoon.Blogs.Configs.AwsSettings.midthumb_directory_path);
                }
            }
            // normal blog posts upload
            string _publish_path = "";

            // Add information in table
            var filename = new StringBuilder();
            if (model.files.Count > 0)
            {
                foreach (var item in model.files)
                {
                    if (filename.ToString().Length > 0)
                        filename.Append(",");
                    filename.Append(item.filename);
                }
            }

            if (filename.ToString() != "")
                _publish_path = AwsCloud.UploadPostCover(filename.ToString(), model.userid);
            else
                _publish_path = filename.ToString();


            if (model.id == 0)
            {
                var blg = new JGN_Blogs();
                blg.categories = model.categories;
                blg.userid = model.userid;
                if (model.title != null)
                {
                    blg.title = model.title;
                    if (blg.title.Length > 100)
                        blg.title = blg.title.Substring(0, 99);
                }
                blg.description = content;
                if (model.tags != null)
                {
                    blg.tags = model.tags;
                    if (blg.tags.Length > 300)
                        blg.tags = blg.tags.Substring(0, 299);
                }
                blg.isenabled = 1; // enabled in start
                blg.isapproved = (byte)_isapproved;
                blg.picture_caption = model.picture_caption;
                blg.picture_url = _publish_path; // filename
                blg.cover_url = model.cover_url;
                blg = await BlogsBLL.Add(_context, blg);

                Setup_Item(blg);
                                             
                return Ok(new { status = "success", record = blg, message = SiteConfig.generalLocalizer["_record_created"].Value });
            }
            else
            {
                var blg = new JGN_Blogs();
                blg.id = model.id;
                blg.userid = model.userid;
                if (model.title != null)
                    blg.title = model.title;
                blg.description = content;
                if (model.tags != null)
                    blg.tags = model.tags;
                blg.isapproved = (byte)_isapproved;
                blg.categories = model.categories;
                blg.picture_caption = model.picture_caption;
                blg.picture_url = _publish_path;

                Setup_Item(blg);
                await BlogsBLL.Update(_context, blg);

                return Ok(new { status = "success", record = blg, message = SiteConfig.generalLocalizer["_record_updated"].Value });
            }
        }

        private void Setup_Item(JGN_Blogs blg)
        {
            blg.files = new List<FileEntity>();

            if (blg.cover_url == null)
                blg.cover_url = "";

            if (blg.picture_url == null)
                blg.picture_url = "";

            if (blg.cover_url != "")
                blg.cover_url = BlogUtil.Return_Blog_Cover(blg.cover_url);

            if (blg.picture_url != "")
            {
                var _pics = blg.picture_url.Split(char.Parse(","));
                foreach (var pic in _pics)
                {
                    string imgUrl = BlogUtil.Return_Blog_Image(pic, Jugnoon.Blogs.Configs.BlogSettings.default_path);

                    blg.files.Add(new FileEntity()
                    {
                        filename = pic,
                        img_url = imgUrl
                    });
                }
            }
            if(blg.created_at == null)
               blg.created_at = DateTime.Now;
            blg.url = BlogUrlConfig.Generate_Post_Url(blg);
            blg.author_url = UserUrlConfig.ProfileUrl(blg.author, Jugnoon.Settings.Configs.RegistrationSettings.uniqueFieldOption);
            // process content
            blg.description = UtilityBLL.Process_Content_Text(blg.description);
        }


        [HttpPost("authorize_author")]
        public ActionResult authorize_author()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<JGN_Blogs>(json);
            var isaccess = BlogsBLL.Check(_context, data.id, data.userid);
            return Ok(new { isaccess = isaccess });
        }

        [HttpPost("uploads")]
        public async Task<IActionResult> uploads()
        {
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest($"Expected a multipart request, but got {Request.ContentType}");
            }
           
            StringValues UserName;
            SiteConfig.HttpContextAccessor.HttpContext.Request.Headers.TryGetValue("UName", out UserName);

            // Used to accumulate all the form url encoded key value pairs in the 
            // request.
            var formAccumulator = new KeyValueAccumulator();
            // string targetFilePath = null;

            var boundary = MultipartRequestHelper.GetBoundary(
                    MediaTypeHeaderValue.Parse(Request.ContentType),
                    _defaultFormOptions.MultipartBoundaryLengthLimit);


            var reader = new MultipartReader(boundary, HttpContext.Request.Body);

            var section = await reader.ReadNextSectionAsync();

            var uploadPath = SiteConfig.Environment.ContentRootPath + DirectoryPaths.BlogsPhotoDirectoryPath;

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
                Directory.CreateDirectory(uploadPath + "thumbs/");
            }
             

            var fileName = "";
            while (section != null)
            {
                ContentDispositionHeaderValue contentDisposition;
                var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition,
                    out contentDisposition);

                if (hasContentDispositionHeader)
                {
                    if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                    {
                        var output = formAccumulator.GetResults();
                        var chunk = "0";
                        foreach (var item in output)
                        {
                            if (item.Key == "name")
                                fileName = UtilityBLL.ReplaceSpaceWithHyphin(Path.GetFileNameWithoutExtension(item.Value))
                                    + "-" + Guid.NewGuid().ToString().Substring(0, 10) + Path.GetExtension(item.Value);
                            else if (item.Key == "chunk")
                                chunk = item.Value;
                        }

                        var strPath = uploadPath + "" + fileName;
                        using (var fs = new FileStream(strPath, chunk == "0" ? FileMode.Create : FileMode.Append))
                        {
                            await section.Body.CopyToAsync(fs);
                            fs.Flush();
                        }
                    }
                    else if (MultipartRequestHelper.HasFormDataContentDisposition(contentDisposition))
                    {
                        var key = HeaderUtilities.RemoveQuotes(contentDisposition.Name);
                        var encoding = GetEncoding(section);
                        using (var streamReader = new StreamReader(
                            section.Body,
                            encoding,
                            detectEncodingFromByteOrderMarks: true,
                            bufferSize: 1024,
                            leaveOpen: true))
                        {
                            // The value length limit is enforced by MultipartBodyLengthLimit
                            var value = await streamReader.ReadToEndAsync();
                            if (String.Equals(value, "undefined", StringComparison.OrdinalIgnoreCase))
                            {
                                value = String.Empty;
                            }
                            formAccumulator.Append(key.ToString(), value);

                            if (formAccumulator.ValueCount > _defaultFormOptions.ValueCountLimit)
                            {
                                throw new InvalidDataException($"Form key count limit {_defaultFormOptions.ValueCountLimit} exceeded.");
                            }
                        }
                    }
                }

                var result = formAccumulator.GetResults();

                // Drains any remaining section body that has not been consumed and
                // reads the headers for the next section.
                section = await reader.ReadNextSectionAsync();
            }

            string orignalfilename = uploadPath + "" + fileName;
            string thumbfilename = uploadPath + "thumbs/" + fileName;

            try
            {
                Jugnoon.Utility.Image.Generate_Thumbs(orignalfilename, thumbfilename, "",
                 Jugnoon.Blogs.Configs.BlogSettings.thumbnail_width,
                 Jugnoon.Blogs.Configs.BlogSettings.thumbnail_height,
                 0, 0, Jugnoon.Settings.Configs.MediaSettings.quality);

               
                string url = Config.GetUrl("contents/blogs/thumbs/" + fileName);
                string fileType = System.IO.Path.GetExtension(fileName);
                string fileIndex = fileName.Replace(fileType, "");

                return Ok(new { jsonrpc = "2.0", result = "OK", fname = fileName, url = url, filetype = fileType, filename = fileName, fileIndex = fileIndex });
            }
            catch (Exception ex)
            {
                return Ok(new { 
                    jsonrpc = "2.0", 
                    result = "OK",
                    message = ex.Message, 
                    attempt = 2
                });
            }
           
           
        }

        private static void Copy_Photo(string original_path, string new_path)
        {
            FileInfo TheFile = new FileInfo(original_path);
            if (TheFile.Exists)
            {
                System.IO.File.Copy(original_path, new_path);
            }
            else
            {
                throw new FileNotFoundException();
            }
        }

        private static Encoding GetEncoding(MultipartSection section)
        {
            MediaTypeHeaderValue mediaType;
            var hasMediaTypeHeader = MediaTypeHeaderValue.TryParse(section.ContentType, out mediaType);
            // UTF-7 is insecure and should not be honored. UTF-8 will succeed in 
            // most cases.
            if (!hasMediaTypeHeader || Encoding.UTF7.Equals(mediaType.Encoding))
            {
                return Encoding.UTF8;
            }
            return mediaType.Encoding;
        }
    
        [HttpPost("removefile")]
        public ActionResult removefile()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<JGN_Blogs>>(json);

            foreach (var Record in data)
            {
                string dirpath = SiteConfig.Environment.ContentRootPath + DirectoryPaths.BlogsPhotoDirectoryPath; // + "//wwwroot/contents//blog//";
                string tempPath = dirpath + "thumbs/";
                string mediumPath = dirpath + "medium/";
                if (!data[0].picture_url.StartsWith("http"))
                {
                    var pics = data[0].picture_url.Split(char.Parse(","));
                    foreach(var pic in pics)
                    {
                        if (System.IO.File.Exists(dirpath + pic))
                            System.IO.File.Delete(dirpath + pic);
                        if (System.IO.File.Exists(tempPath + pic))
                            System.IO.File.Delete(tempPath + pic);
                        if (System.IO.File.Exists(mediumPath + pic))
                            System.IO.File.Delete(mediumPath + pic);
                    }
                }
            }

            return Ok(new { status = "success", message = SiteConfig.generalLocalizer["_record_deleted"].Value });
        }

        [HttpPost("action")]
        public async Task<ActionResult> action()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<BlogEntity>>(json);
           
            await BlogsBLL.ProcessAction(_context, data);

            return Ok(new { status = "success", message = SiteConfig.generalLocalizer["_records_processed"].Value });
        }

        #region Update Configuration API Calls

        [HttpPost("configs_general")]
        public ActionResult configs_general()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<Jugnoon.Blogs.Settings.General>(json);

            _general_options.Update(opt => {
                opt.showHeadlines = data.showHeadlines;
                opt.showMaxHeadlines = data.showMaxHeadlines;
                opt.totalParagraphs = data.totalParagraphs;
                opt.isShowAuthor = data.isShowAuthor;
                opt.isShowPostingDate = data.isShowPostingDate;
                opt.postDateTemplate = data.postDateTemplate;
                opt.blogPostAccess = data.blogPostAccess;
                opt.blogPostModeration = data.blogPostModeration;
                opt.linkProcessing = data.linkProcessing;
                opt.category_Processing = data.category_Processing;
                opt.tag_Processing = data.tag_Processing;
                opt.glossary_Processing = data.glossary_Processing;
                opt.isRelated = data.isRelated;
                opt.showRelatedPosts = data.showRelatedPosts;
                opt.showMainPagePagination = data.showMainPagePagination;
                opt.title = data.title;
                opt.description = data.description;
                opt.copyright = data.copyright;
                opt.totalFeeds = data.totalFeeds;
                opt.thumbnail_width = data.thumbnail_width;
                opt.thumbnail_height = data.thumbnail_height;
                opt.banner_width = data.banner_width;
                opt.banner_height = data.banner_height;
                opt.enable_feeds = data.enable_feeds;
                opt.default_path = data.default_path;
            });

            return Ok(new
            {
                status = 200
            });

        }

        [HttpPost("configs_aws")]
        public ActionResult configs_aws()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<Jugnoon.Blogs.Settings.Aws>(json);

            _aws_options.Update(opt => {
                opt.bucket = data.bucket;
                opt.thumb_directory_path = data.thumb_directory_path;
                opt.midthumb_directory_path = data.midthumb_directory_path;
                opt.original_directory_path = data.original_directory_path;
                opt.cdn_URL = data.cdn_URL;
            });

            return Ok(new
            {
                status = 200
            });

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
