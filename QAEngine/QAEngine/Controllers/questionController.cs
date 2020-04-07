using System;
using Microsoft.AspNetCore.Mvc;
using Jugnoon.Utility;
using Jugnoon.BLL;
using Jugnoon.qa;
using System.Text;
using Jugnoon.Scripts;
using Jugnoon.Settings;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using Jugnoon.Framework;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Jugnoon.qa.Models;
using Jugnoon.Localize;

namespace QAEngine.Controllers
{
    public class questionController : Controller
    {
        ApplicationDbContext _context;
        public questionController(
           IOptions<SiteConfiguration> settings,
           IMemoryCache memoryCache,
           ApplicationDbContext context,
           IStringLocalizer<GeneralResource> generalLocalizer,
           IStringLocalizer<qaResource> qaLocalizer,
           IWebHostEnvironment _environment,
           IHttpContextAccessor _httpContextAccessor,
           IOptions<General> generalSettings,
           IOptions<Features> featureSettings,
           IOptions<Media> mediaSettings,
           IOptions<Smtp> smtpSettings,
           IOptions<Jugnoon.qa.Settings.General> generalQASettings
           )
        {
            _context = context;
            // readable settings (global)
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            // settings specific
            Jugnoon.qa.Configs.GeneralSettings = generalQASettings.Value;

            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;

            SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.qaLocalizer = qaLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        // GET: question
        public async Task<IActionResult> Index(long? pid, string title, int? id)
        {
            if (pid == null)
            {
                return Redirect(Config.GetUrl("qa"));
            }
            
            var model = new QuestionViewModel();
            model.isAllowed = true;
            model.AlertType = AlertTypes.Success;

            if (HttpContext.Request.Query["ans"].Count > 0)
            {
                switch (HttpContext.Request.Query["ans"].ToString())
                {
                    case "posted":
                        model.Message = SiteConfig.qaLocalizer["question_msg_01"].Value;
                        break;
                    case "pending":
                        model.Message = SiteConfig.qaLocalizer["question_msg_02"].Value;
                        model.AlertType = AlertTypes.Info;
                        break;
                    case "noans":
                        model.Message = SiteConfig.qaLocalizer["question_msg_03"].Value;
                        model.AlertType = AlertTypes.Error;
                        break;
                    case "updated":
                        model.Message = SiteConfig.qaLocalizer["question_msg_04"].Value;
                        model.AlertType = AlertTypes.Info;
                        break;
                }
            }

            var _lst = await QABLL.LoadItems(_context, new QAEntity()
            {
                id = (long)pid,
                loadall = true,
                nofilter = true
            });

            if (_lst.Count == 0)
            {
                model.isAllowed = false;
                model.DetailMessage = SiteConfig.generalLocalizer["_no_records"].Value;
                return View(model);
            }

            model.PreviewUrl = QAUrls.Prepare_QA_Url((long)pid, _lst[0].title, "");

            // adult validation
            if (_lst[0].isadult == 1)
            {
                // 1:-> adult content, 0:-> non adult content
                var getValue = HttpContext.Session.GetString("adultmember");
                if (getValue == null)
                {
                    return Redirect(Config.GetUrl("home/validateadult?surl=" + WebUtility.UrlEncode(model.PreviewUrl) + ""));
                }
            }

            if (_lst[0].isapproved == (byte)ApprovedTypes.Disabled)
            {
                model.Message = SiteConfig.qaLocalizer["_qa_status_pending"].Value;
            }

            if (_lst[0].isenabled == (byte)EnabledTypes.Disabled)
            {
                model.isAllowed = false;
                model.DetailMessage = SiteConfig.qaLocalizer["_qa_status_blocked"].Value;
                return View(model);
            }

            if (_lst[0].isresolved == (byte)ResolvedActions.Resolved)
            {
                _lst[0].title= _lst[0].title +  SiteConfig.generalLocalizer["_resolved"].Value;
            }

            else if (_lst[0].isclosed == (byte)ClosedActions.Closed)
            {
                _lst[0].title= _lst[0].title + SiteConfig.generalLocalizer["_closed"].Value;
            }

            // increment view stats
            _lst[0].views = _lst[0].views + 1;
            QABLL.Update_Field_V3(_context, (long)pid, _lst[0].views, "views");

            string _tags = "";
            if (_lst[0].tags != null && _lst[0].tags != "")
                _tags = _lst[0].tags;
            // Question Information
            int comments = 0;
            if (_lst[0].comments > 0)
                comments = (byte)_lst[0].comments;


            // fetch associated categories
            _lst[0].category_list = await CategoryContentsBLL.FetchContentCategoryList(_context, _lst[0].id, (byte)CategoryContentsBLL.Types.QA);

            model.Info = new InfoModelView()
            {
                qid =  _lst[0].id,
                title = _lst[0].title,
                description = WebUtility.HtmlDecode(UtilityBLL.Process_Content_Text(_lst[0].description)),
                author = _lst[0].author,
                category = _lst[0].category_list,
                tags = _tags,
                created_at = _lst[0].created_at,
                total_comments = comments,
                iscomment = 1 // enable comments, 0: disable comments
            };


            // Question Actions
            model.Action = new qaActionViewModel()
            {
                ContentID = (long)pid,
                Votes = _lst[0].votes,
                UserName = _lst[0].author.UserName,
                Favorites = _lst[0].favorites,
                // action1.isRating = _lst[0].isRatings;
                Views = _lst[0].views,
                isViews = true,
            };


            // Answer Settings
            model.Ans = new AnsViewModel()
            {
                Qid = (long)pid,
                Title = _lst[0].title, // for url generating purpose only
                Answers = _lst[0].answers,
                isclosed = _lst[0].isclosed,
                isComment = 1,
                isresolved = _lst[0].isresolved,
                Authorusername = _lst[0].author.UserName,

            };

            // Post Answer
            model.aPost = new AccountqaModelView()
            {
                Answers = _lst[0].answers,
                isClosed = _lst[0].isclosed,
                Qid = (long)pid,
                Title = _lst[0].title,
                AuthorUserName = _lst[0].author.UserName,
                EditMode = false,
                HeadingTitle = SiteConfig.qaLocalizer["_post_answer"],
                isAllowed = true
            };

            if (User.Identity.IsAuthenticated)
            {
                model.aPost.UserName = SiteConfig.userManager.GetUserName(User);
            }

            string _title = _lst[0].title;

            string _desc = UtilityBLL.StripHTML(_lst[0].description);
            if (_desc == "")
                _desc = _lst[0].title;
            else if (_desc.Length > 160)
                _desc = _desc.Substring(0, 160);
            string meta_title = _title;
            string meta_description = _desc + ", date asked: " + _lst[0].created_at + ", Qid: " + _lst[0].id;

            ViewBag.title= meta_title;
            ViewBag.description = meta_description;

            return View(model);
        }

        [Authorize]
        public async Task<IActionResult> editanswer(long? qid, long? id)
        {
            if (qid == null || id == null)
            {
                return Redirect("/qa");
            }
            
            var model = new AccountqaModelView();
            model.isAllowed = true;
            model.isAdmin = false;

            if (!QAnswersBLL.Check(_context, (long)id, (long)id, SiteConfig.userManager.GetUserName(User)))
            {
                model.DetailMessage = SiteConfig.generalLocalizer["_authentication_failed"].Value; 
                model.isAllowed = false;
                return View(model);
            }

            var _lst = await QABLL.LoadItems(_context, new QAEntity()
            {
                id = (long)id,
                nofilter = true
            });
            if (_lst.Count > 0)
            {
                if (_lst[0].isclosed == (byte)ClosedActions.Closed)
                {
                    model.DetailMessage = SiteConfig.qaLocalizer["edit_answer_01"].Value;
                    model.isAllowed = false;
                    return View(model);
                }
                model.Qid = (long)id;
                model.UserName = SiteConfig.userManager.GetUserName(User);
                model.Title = _lst[0].title;
                model.Aid = (long)id;
                model.Answers = _lst[0].answers;
            }

            var _alst = await QAnswersBLL.Fetch_Answer_Info(_context, (long)id);
            if (_alst.Count > 0)
            {
                model.Content = _alst[0].description;
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> editanswer(AccountqaModelView model)
        {
            if (ModelState.IsValid)
            {
                if (model.Content == "" || model.Content.Length < 10)
                {
                    return Redirect(QAUrls.Prepare_QA_Url(model.Qid, model.Title, "?ans=noans"));
                }

                byte isapproved = 1; // enable it bydefault
                string status = "posted";
                if (Jugnoon.Settings.Configs.GeneralSettings.content_approval == 0)
                {
                    // Moderator Review Required
                    isapproved = 0;
                    status = "pending";
                }

                //XSS CLEANUP
                string content = model.Content;
                content = UGeneral.SanitizeText(content, false);

                var qst = new JGN_QAnswers();
                qst.description = content;
                qst.userid = model.UserName;
                qst.id = model.Qid;
                qst.isapproved = isapproved;
                if (model.Aid == 0)
                {
                    var obj = QAnswersBLL.Add(_context, qst, model.Answers);
                    // send mail to auther of question
                    MailTemplateProcess(qst.description, model.UserName, SiteConfig.userManager.GetUserName(User), model.Title, model.isAdmin, model.Qid);
                }
                else
                {
                    qst.id = model.Aid;
                    await QAnswersBLL.Update(_context, qst);
                    status = "updated";
                }
                return Redirect(QAUrls.Prepare_QA_Url(model.Qid, model.Title, "?ans=" + status));
            }

            return Redirect("editanswer/" + model.Aid + "/" + model.Qid + "?status=error");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> post(AccountqaModelView model)
        {            
                if (!User.Identity.IsAuthenticated)
                {
                    string redirect_url = QAUrls.Prepare_QA_Url(model.Qid, model.Title, "?ans=noans");
                    return Redirect(Config.GetUrl() + "login?ReturnUrl=" + redirect_url);
                }
                if (string.IsNullOrEmpty(model.Content) || model.Content.Length < 10)
                {
                    // msg.InnerHtml = Alerts.Prepare("Please write your answer", AlertTypes.Error); // Please write your answer
                    return Redirect(QAUrls.Prepare_QA_Url(model.Qid, model.Title, "?ans=noans"));
                }
                byte isapproved = 1; // enable it bydefault
                string status = "posted";
                if (Jugnoon.Settings.Configs.GeneralSettings.content_approval == 0)
                {
                    // Moderator Review Required
                    isapproved = 0;
                    status = "pending";
                }
                //XSS CLEANUP
                if(model.Content == null)
                {
                    return Redirect(QAUrls.Prepare_QA_Url(model.Qid, model.Title, "?ans=addcontent"));
                }
                string content = model.Content; // UtilityBLL.CompressCode(txt_content.Text);
                                                // Process Contents -> links, bbcodes etc
                content = UGeneral.SanitizeText(content, false);
                //content =UGeneral.SanitizeText(content, false) UtilityBLL.Process_Content_Text(UGeneral.SanitizeText(content, false));

                var qst = new JGN_QAnswers();
                qst.description = content;
                qst.userid = model.UserName;
                qst.id = model.Qid;
                qst.isapproved = isapproved;
                qst.isanswer = 0;
                if (model.Aid == 0)
                {
                    qst = await QAnswersBLL.Add(_context, qst, model.Answers);
                    // send mail to auther of question
                    MailTemplateProcess(qst.description, model.UserName, SiteConfig.userManager.GetUserName(User), model.Title, model.isAdmin, model.Qid);
                }
               
                if (model.isAdmin)
                    return Redirect(Config.GetUrl("admin/qa/detail/" + model.Qid + "&status=updated"));
                else
                    return Redirect(QAUrls.Prepare_QA_Url(model.Qid, model.Title, "?ans=" + status));            
        }

        private void MailTemplateProcess(string answer, string authorusername, string loggedinusername, string title, bool isAdmin, long Qid)
        {
            //if sending mail option enabled
            if (Jugnoon.Settings.Configs.SmtpSettings.enable_email)
            {
                var lst = MailTemplateBLL.Get_Template(_context, "qaANSP").Result;
                if (lst.Count > 0)
                {
                    string subject = MailProcess.Process2(lst[0].subject, "\\[pusername\\]", loggedinusername);
                    subject = MailProcess.Process2(subject, "\\[ausername\\]", authorusername);

                    string contents = MailProcess.Process2(lst[0].contents, "\\[pusername\\]", loggedinusername);
                    contents = MailProcess.Process2(contents, "\\[ausername\\]", authorusername);
                    string _title = title;
                    if (_title == "")
                        _title = "Click here";
                    contents = MailProcess.Process2(contents, "\\[qtitle\\]", title);
                    contents = MailProcess.Process2(contents, "\\[answer\\]", answer);

                    string qaurl = QAUrls.Prepare_QA_Url(Qid, title, "");
                    string url = "<a href=\"" + qaurl + "\">" + qaurl + "</a>";
                    contents = MailProcess.Process2(contents, "\\[url\\]", url);

                    // attach signature
                    contents = MailProcess.Prepare_Email_Signature(contents);

                    string emailaddress = UserBLL.Return_Value_UserId(_context, authorusername, "email");
                    MailProcess.Send_Mail(emailaddress, subject, contents);
                }
            }
        }

        public IActionResult bans()
        {
            // Mark as Best Answer Handler Script.
            // Actions
            // i: ... check whether question is already resolved
            // ii: ... reset all answers isanswer status = 0; // not choosen as best answer
            // iii: ... mark selected answer isanswer status=1; // best answer
            // iv: ... mark question status resolved=1; // question resolved

        long Qid = 0;
        long Aid = 0;
        string username = "";
        string Ausername ="";
        int isresolved = 0;
        int Action = 0; // 0: Answer 1: unsnwered
            string _ctype = "text/plain";

            if (HttpContext.Request.Query["Qid"].Count > 0)
                Qid = Convert.ToInt64(HttpContext.Request.Query["Qid"]);
            if (HttpContext.Request.Query["id"].Count > 0)
                Aid = Convert.ToInt64(HttpContext.Request.Query["id"]);
            if (HttpContext.Request.Query["usr"].Count > 0)
                username = HttpContext.Request.Query["usr"].ToString();
            if (HttpContext.Request.Query["ausr"].Count > 0)
                Ausername = HttpContext.Request.Query["ausr"].ToString();
            if (HttpContext.Request.Query["res"].Count > 0)
                isresolved = Convert.ToInt32(HttpContext.Request.Query["res"]);
            if (HttpContext.Request.Query["act"].Count > 0)
                Action = Convert.ToInt32(HttpContext.Request.Query["act"]);
            // vote only be done if user is online
            string Message = "";
            if (username != "")
            {
                if (Ausername != username)
                {
                    return Content(Config.SetHiddenMessage_v2(SiteConfig.qaLocalizer["qa_validation_msg"].Value, "", true, 4), _ctype);
                }
                else
                {
                    if (Action == 0)
                    {
                        // mark as best answer
                        if (isresolved == 1)
                        {
                            // question is already resolved
                            // already best answer is choosen for selected question
                            QAnswersBLL.Reset_BestAnswers(_context, Qid);
                        }
                        //else
                        //{

                        //}
                        //// check for existing best answer
                        //if (QAnswersBLL.CheckBestAnswer(Qid))
                        //{
                        //    Message = "You already choose best answer for selected question, please unmark it first to make another answer as best answer";
                        //}
                        //else
                        //{
                        // mark select answer as best answer
                        QAnswersBLL.Update_Field_V3(_context, Aid, (byte)1, "isanswer");

                        // mark selected question as resolved
                        QABLL.Update_Field_V3(_context, Qid, (byte)1, "isresolved");

                       return Content(SiteConfig.qaLocalizer["qa_validation_msg_04"].Value, _ctype);
                        //}
                    }
                    else
                    {
                        // un mark as best answer
                        // mark select answer as best answer
                        QAnswersBLL.Update_Field_V3(_context, Aid, (byte)0, "isanswer");

                        // mark selected question as resolved
                        QABLL.Update_Field_V3(_context, Qid, (byte)0, "isresolved");

                        Message = SiteConfig.qaLocalizer["qa_validation_msg_05"].Value;
                    }

                    return Content(Config.SetHiddenMessage_v2(Message, "", true, 4),_ctype);
                }
            }

            return Content("no output", _ctype);
        }

        public async Task<IActionResult> fav()
        {
            int Favtype = 1; // 0: video, audio, 1: qa fav

            long ContentID = 0;
            string username = ""; // User who added media in his / her favorite lis
            string Author_username  = ""; // User who are actually owner of media
            int _Favorites = 0;

            string _ctype = "text/plain";
            if (HttpContext.Request.Query["id"].Count > 0)
                ContentID = Convert.ToInt64(HttpContext.Request.Query["id"]);
            if (HttpContext.Request.Query["usr"].Count > 0)
                username = HttpContext.Request.Query["usr"].ToString();
            if (HttpContext.Request.Query["ausr"].Count > 0)
                Author_username = HttpContext.Request.Query["ausr"].ToString();
            if (HttpContext.Request.Query["favt"].Count > 0)
                _Favorites = Convert.ToInt32(HttpContext.Request.Query["favt"]);

            // vote only be done if user is online
            if (username != "")
            {
                //**********************************************************
                // Generate Output Panel
                //**********************************************************
                var str = new StringBuilder();
                string _url = Config.GetUrl();
                string fav_url = _url + "account/qa/favorites";

                // check authentication
                if (username == "")
                {
                    string sign_in = "<a href=\"" + Config.GetUrl() + "login?ReturnUrl=\" class=\"bold\">" + SiteConfig.generalLocalizer["_sign_in"].Value + "</a>";
                    string sign_up = "<a href=\"" + Config.GetUrl() + "signup\" class=\"bold\">" + SiteConfig.generalLocalizer["_sign_up"].Value + "</a>";
                    str.AppendLine("" + sign_in + " or " + sign_up + " now!");
                    return Content(Config.SetHiddenMessage_v2(str.ToString(), "", true, 2));
                }

                // check your own video
                if (Author_username == username)
                {
                    str.AppendLine("You can't <a href=\"" + fav_url + "\">" + SiteConfig.generalLocalizer["_favorite"].Value + "</a> your own question.");
                    return Content(Config.SetHiddenMessage_v2(str.ToString(), "", true, 0));
                }

                if (await FavoriteBLL.Check(_context, username, ContentID, Favtype))
                {
                    str.AppendLine(SiteConfig.qaLocalizer["qa_validation_msg_02"].Value + " <a href=\"" + fav_url + "\">" + SiteConfig.generalLocalizer["_favorites"] + "</a>.");
                    return Content(Config.SetHiddenMessage_v2(str.ToString(), "", true, 0));
                }

                await FavoriteBLL.Add(_context, username, ContentID, 0, Favtype);

                // increment favorite video state
                _Favorites++;
                QABLL.Update_Field_V3(_context, ContentID, _Favorites, "favorites");
                str.AppendLine("<strong>Question</strong> has been <strong>added</strong> to your <a href=\"" + fav_url + "\">" + SiteConfig.generalLocalizer["_favorites"] + "</a>.");
                // wrap output
                return Content(Config.SetHiddenMessage_v2(str.ToString(), "", true, 4));
            }

            else
                return Content("no user info to add question in favorite", _ctype);

        }

        public async Task<IActionResult> remove()
        {
            long Qid = 0;
            long Aid = 0;
            string username = "";
            string Ausername = "";
            //int isresolved = 0;
            //int Action = 0; // 0: Answer 1: unsnwered
            int Answers = 0;

            //string _ctyype = "text/plain";
            if (HttpContext.Request.Query["Qid"].Count > 0)
                Qid = Convert.ToInt64(HttpContext.Request.Query["Qid"]);
            if (HttpContext.Request.Query["id"].Count > 0)
                Aid = Convert.ToInt64(HttpContext.Request.Query["id"]);
            if (HttpContext.Request.Query["usr"].Count > 0)
                username = HttpContext.Request.Query["usr"].ToString();
            if (HttpContext.Request.Query["ausr"].Count > 0)
                Ausername = HttpContext.Request.Query["ausr"].ToString();
            if (HttpContext.Request.Query["ans"].Count > 0)
                Answers = Convert.ToInt32(HttpContext.Request.Query["ans"]);
            // vote only be done if user is online
            if (username != "")
            {
                if (Ausername != username)
                {
                    return Content(Config.SetHiddenMessage_v2(SiteConfig.qaLocalizer["qa_validation_msg_03"].Value, "", true, 4));
                }
                else
                {
                    // delete all comments posted on this answer
                    // int _type = 12; // represent qa answers
                    // CommentsBLL.Delete(Aid, _type, false);
                    // delete qa answer
                    await QAnswersBLL.Delete(_context, new JGN_QAnswers()
                    {
                        id = Aid,
                        userid  = Ausername
                    });
                    // update qa stats
                    Answers--;
                    QABLL.Update_Field_V3(_context, Qid, Answers, "answers");

                    return Content(Config.SetHiddenMessage_v2(SiteConfig.generalLocalizer["_record_delete"].Value, "", true, 4));
                }
            }
            else
            {
                string sign_in = "<a href=\"" + Config.GetUrl() + "login?ReturnUrl=\" class=\"bold\">" + SiteConfig.generalLocalizer["_sign_in"].Value + "</a>";
                string sign_up = "<a href=\"" + Config.GetUrl() + "signup\" class=\"bold\">" + SiteConfig.generalLocalizer["_sign_up"].Value + "</a>";
                return Content(Config.SetHiddenMessage_v2(sign_in + " or " + sign_up + " now!", "", true, 2));
            }

        }

        public async Task<IActionResult> votes()
        {
            int Ratingtype = 12; // 12: for qa Votes in Rating Table, 13: qa Answer Votes
            int type = 0; // 0: question, 1: answer
            long ContentID = 0;
            string username = "";
            string Ausername = "";
            int Votes = 0;
            int Action = 0; // 0: Vote Up, 1:  Vote Down
            string _ctype = "text/plain";
            if (HttpContext.Request.Query["t"].Count > 0)
                type = Convert.ToInt32(HttpContext.Request.Query["t"]);
            if (HttpContext.Request.Query["rt"].Count > 0)
                Ratingtype = Convert.ToInt32(HttpContext.Request.Query["rt"]);
            if (HttpContext.Request.Query["id"].Count > 0)
                ContentID = Convert.ToInt64(HttpContext.Request.Query["id"]);
            if (HttpContext.Request.Query["usr"].Count > 0)
                username = HttpContext.Request.Query["usr"].ToString();
            if (HttpContext.Request.Query["ausr"].Count > 0)
                Ausername = HttpContext.Request.Query["ausr"].ToString();
            if (HttpContext.Request.Query["vt"].Count > 0)
                Votes = Convert.ToInt32(HttpContext.Request.Query["vt"]);

            if (HttpContext.Request.Query["act"].Count > 0)
                Action = Convert.ToInt32(HttpContext.Request.Query["act"]);

            if (username != "")
            {
                if (Ausername == username)
                {
                    string _type = "question";
                    if (type == 1)
                        _type = "answer";
                    return this.Content(Config.SetHiddenMessage_v2("You can't vote your own " + _type, "", true, 4));
                }
                else
                {
                    // check whether he / she already post rating on same content
                    if (! await UserRatingsBLL.Check(_context, username, ContentID, Ratingtype))
                    {
                        Post_Vote(Action, Votes, Ratingtype, ContentID);
                        await UserRatingsBLL.Add(_context, username, ContentID, Ratingtype, Action); // add user rating statistics
                        return this.Content(Set_Vote_Message(Action, type, username, Votes), _ctype);
                    }
                    else
                    {
                        // show message without adding statistics
                        return this.Content(Set_Already_Vote_Message(Action, type, username, Votes), _ctype);
                    }
                }
            }

            else
            {
                string sign_in = "<a href=\"" + Config.GetUrl() + "login?ReturnUrl=\" class=\"bold\">" + SiteConfig.generalLocalizer["_sign_in"].Value + "</a>";
                string sign_up = "<a href=\"" + Config.GetUrl() + "signup\" class=\"bold\">" + SiteConfig.generalLocalizer["_sign_up"].Value + "</a>";
                return Content(Config.SetHiddenMessage_v2(sign_in + " or " + sign_up + " now!", "", true, 2));
            }
        }

        private void Post_Vote(int Action, int Votes, int RatingType, long ContentID)
        {
            if (Action == 0) // Vote Up
                Votes++;
            else
                Votes--;
            if (RatingType == 12) // Question votes
                QABLL.Update_Field_V3(_context, ContentID, Votes, "votes");
            else // Answer votes
                QAnswersBLL.Update_Field_V3(_context, ContentID, Votes, "votes");
        }


        // set liked | disliked Message
        private string Set_Vote_Message(int Action, int Type, string UserName, int Votes)
        {
            string action = "voted";
            if (Action != 0)
                action = "voted";

            string content_type = "";
            string content_url = "";
            if (Type == 0)
            {
                content_url = "<a class=\"bold underline\" href=\"" + Config.GetUrl() + "account/qa/liked\">questions you " + action + "</a>";
                content_type = "question";
            }
            else
            {
                content_url = "<a class=\"bold underline\" href=\"" + Config.GetUrl() + "account/qa/liked?type=answer\">answers you " + action + "</a>";
                content_type = "answer";
            }
            //**********************************************************
            // Generate Output Panel
            //**********************************************************
            var str = new StringBuilder();
            str.AppendLine("<div class=\"bx_br_bt\" style=\"padding-bottom:5px;\">You " + action + " this " + content_type + ". Thanks for the feedback!");
            if (UserName != "") // if user logged in
                str.AppendLine(" See more " + content_url + ".");
            str.AppendLine("</div>");
            str.AppendLine("<div class=\"bx_br_bt\" style=\"padding:5px 0px;\"><strong>Total votes for this " + content_type + " </strong><span class=\"normal-text reverse\">(" + Votes + " total)</span></div>\n");

            return Config.SetHiddenMessage_v2(str.ToString(), "", true, 4);

        }

        // Generate Rating Message
        private string Set_Already_Vote_Message(int Action, int Type, string UserName, int Votes)
        {
            string action = "voted";
            if (Action != 0)
                action = "voted";

            string content_type = "";
            string content_url = "";
            if (Type == 0)
            {
                content_url = "<a class=\"bold underline\" href=\"" + Config.GetUrl() + "account/qa/liked\">questions you " + action + "</a>";
                content_type = "question";
            }
            else
            {
                content_url = "<a class=\"bold underline\" href=\"" + Config.GetUrl() + "account/qa/liked?type=answer\">answers you " + action + "</a>";
                content_type = "answer";
            }
            //**********************************************************
            // Generate Output Panel
            //**********************************************************
            var str = new StringBuilder();
            str.AppendLine("<div class=\"bx_br_bt\" style=\"padding-bottom:5px;\">You already " + action + " this " + content_type + "!");
            if (UserName != "") // if user logged in
                str.AppendLine(" See more " + content_url + ".");
            str.AppendLine("</div>");
            str.AppendLine("<div class=\"bx_br_bt\" style=\"padding:5px 0px;\"><strong>Total votes for this " + content_type + " </strong><span class=\"normal-text reverse\">(" + Votes + " total)</span></div>\n");

            return Config.SetHiddenMessage_v2(str.ToString(), "", true, 4);

        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
