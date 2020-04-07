
namespace Jugnoon.qa.Models
{
    public class AnswerActionViewModel
    {
        public bool isAuthenticated { get; set; } = false;
        public int ToolbarSize = 1; // 0: mini, 1: normal, 2: large
        public int ToolbarTheme = 0; // 0: default, 1: primary, 2: warning,3: danger, 4: info, 5: inverse, 5: success
        public bool isFavorites = true;
        public bool isShare = true;
        public bool isFlag = true;
        public bool isViews = true;
        private int _type = 0; // 0: question, 1: answer
        private long _contentid = 0;
        private string _username = ""; // content author
        private string _currentusername = ""; // currently logged in username
        private string _authorusername = ""; // author of question
        private int _isresolved = 0; // 
        private int _votes = 0;
        public int isRating = 1; // 1: Rating On, 0: Rating Off
        private int _isAnswer = 0;
        private int _Answers = 0;

        public long _Qid = 0;

        public long ContentID
        {
            set { _contentid = value; }
            get { return _contentid; }
        }

        public string UserName
        {
            set { _username = value; }
            get { return _username; }

        }
        public string Author_UserName
        {
            set { _authorusername = value; }
            get { return _authorusername; }
        }

        public string Current_UserName
        {
            set { _currentusername = value; }
            get { return _currentusername; }
        }

        public int isResolved
        {
            set { _isresolved = value; }
            get { return _isresolved; }
        }
        
        public int Votes
        {
            set { _votes = value; }
            get { return _votes; }
        }

        public int Type
        {
            set { _type = value; }
            get { return _type; }
        }
        

        public long Qid
        {
            set { _Qid = value; }
            get { return _Qid; }
        }
        public int isAnswer
        {
            set { _isAnswer = value; }
            get { return _isAnswer; }
        }

        public int Answers
        {
            set { _Answers = value; }
            get { return _Answers; }
        }

        // Star Ratings
        public int Views = 0;

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
