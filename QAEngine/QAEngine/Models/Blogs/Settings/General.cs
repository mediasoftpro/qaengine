using System;
using Jugnoon.BLL;

namespace Jugnoon.Blogs.Settings
{    
    public class General
    {        

        /// <summary>
        /// Toggle on | off recent articles or headlines or blog posts on sidebar navigation.
        /// </summary>
        public bool showHeadlines { get; set; }

        /// <summary>
        /// Setup total numbers of articles or headlines to be displayed. e.g 5.
        /// </summary>
        public byte showMaxHeadlines { get; set; }

        /// <summary>
        /// Maximum number of paragraphs to be displayed on normal post listing.
        /// </summary>
        public short totalParagraphs { get; set; }

        /// <summary>
        /// Toggle on | off displaying author information or author link with post
        /// </summary>
        public bool isShowAuthor { get; set; }

        /// <summary>
        /// Toggle on | off displaying date information with article
        /// </summary>
        public bool isShowPostingDate { get; set; }

        /// <summary>
        /// Choose your preferred date format option to display date.
        /// </summary>
        public byte postDateTemplate { get; set; }
     
        /// <summary>
        /// Control who can be allowed to post article or blog
        /// </summary>
        public byte blogPostAccess { get; set; }

        /// <summary>
        /// Control how the posted articles visible to public
        /// </summary>
        public byte blogPostModeration { get; set; }

        /// <summary>
        /// Toggle on | off automatcially generate links within article based on matched word with category or tag or wiki posts
        /// </summary>
        public bool linkProcessing { get; set; }

        /// <summary>
        /// Toggle on | off automatcially generate category links based on matched word with category
        /// </summary>
        public bool category_Processing { get; set; }

        /// <summary>
        /// Toggle on | off automatcially generate tag links based on matched word with tag
        /// </summary>
        public bool tag_Processing { get; set; }

        /// <summary>
        /// Toggle on | off automatcially generate wiki links based on matched word with wiki or dictionary or glossary terms (if functionality available)
        /// </summary>
        public bool glossary_Processing { get; set; }

        /// <summary>
        /// Toggle on | off related articles shown below article
        /// </summary>
        public bool isRelated { get; set; }
        
        /// <summary>
        /// Maximum no of related posts shown below
        /// </summary>
        public byte showRelatedPosts { get; set; }
        
        /// <summary>
        /// Toggle on | off pagination on home listing
        /// </summary>
        public bool showMainPagePagination { get; set; }

        /// <summary>
        /// Feed title, specifically used within generate ATOM / RSS Feeds
        /// </summary>
        public string title { get; set; } = "";

        /// <summary>
        /// Feed description specifically used within generate ATOM / RSS Feeds
        /// </summary>
        public string description { get; set; }

        /// <summary>
        /// Copyright information attach with ATOM / RSS Feeds
        /// </summary>
        public string copyright { get; set; }

        /// <summary>
        /// Maximum no of records to be returned in each ATOM / RSS Feed.
        /// </summary>
        public short totalFeeds { get; set; }


        /// <summary>
        /// Width of thumbnail image created for blog post
        /// </summary>
        public short thumbnail_width { get; set; }

        /// <summary>
        /// Height of thumbnail image created for blog post
        /// </summary>
        public short thumbnail_height { get; set; }

        /// <summary>
        /// Width of banner image created for blog post
        /// </summary>
        public short banner_width { get; set; }

        /// <summary>
        /// Height of banner image created for blog post
        /// </summary>
        public short banner_height { get; set; }

        /// <summary>
        /// Toggle on | off rss / atom feeds for blog post
        /// </summary>
        public bool enable_feeds { get; set; }

        /// <summary>
        /// Default Path
        /// </summary>
        public string default_path { get; set; }

        

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
