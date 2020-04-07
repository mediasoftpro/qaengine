namespace Jugnoon.qa.Models
{
    public class AnsViewModel
    {
        public long Qid = 0;
        public string Authorusername ="";
        public int isresolved = 0; // 0: not resolved yet, 1: resolved
        public string Title = ""; // for qa url generating purpose only
        public int type = 12; // 1: qa Question, 2: qa Answer
        public int isComment = 1; // 1: on, 0: off
        public int Answers = 0; // Total answers posted on this question
        public int isclosed = 0; // 0: not closed, 1: closed
        public int MaxComments = 5; // Total comments to show with single answer
        public bool isAdmin = false;
        public int Comment_Template_ID = 3; // light version
        public bool ShowReplyLink = true;
        public bool ShowVoteLink = true;
        public bool HoverEffect = true;

        public string order = "c.level desc"; // c.clevel order must be used in case reply is on. "points desc, created_at desc";

        // action button properties
        public int ToolbarSize = 1; // 0: mini, 1: normal, 2: large
        public int ToolbarTheme = 0; // 0: default, 1: primary, 2: warning,3: danger, 4: info, 5: inverse, 5: success
        public bool isFlag = true;
        public int isRating = 1; // 1: Rating On, 0: Rating Off
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
