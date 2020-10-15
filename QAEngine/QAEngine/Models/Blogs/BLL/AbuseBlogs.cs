using Jugnoon.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


/// <summary>
/// Abuse Filtering API - Business Layer Designed for Videos | Audio Files. 
/// It support filtering videos or audio files based on reported videos for user.
/// </summary>
namespace Jugnoon.Blogs
{
    public class AbuseBlogs
    {
        public static Task<List<JGN_Blogs>> LoadItems(ApplicationDbContext context, BlogEntity entity)
        {
            return BlogsBLL.processOptionalConditions(prepareQuery(context, entity), entity)
                   .Select(BlogsBLL.prepareSummaryList()).ToListAsync();
        }

        public static Task<int> Count(ApplicationDbContext context, BlogEntity entity)
        {
            return prepareQuery(context, entity).CountAsync();
        }

        private static IQueryable<BlogQueryEntity> prepareQuery(ApplicationDbContext context, BlogEntity entity)
        {
            return context.JGN_Blogs
              .Join(context.AspNetusers,
                  blogs => blogs.userid,
                  user => user.Id, (blogs, user) => new { blogs, user })
              .Join(context.JGN_AbuseReports,
                  blogs => blogs.blogs.id,
                  abusereports => abusereports.contentid, (blogs, abusereports) => new BlogQueryEntity { blog = blogs.blogs, user = blogs.user, abusereports = abusereports })
              .Where(BlogsBLL.returnWhereClause(entity));
        }
    }

}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
