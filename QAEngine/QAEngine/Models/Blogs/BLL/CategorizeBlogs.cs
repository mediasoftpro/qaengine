using Jugnoon.Framework;
using LinqKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Jugnoon.BLL;
using System.Text;
using Jugnoon.Utility;
using Microsoft.Extensions.Caching.Memory;
using Jugnoon.Models;
/// <summary>
/// Category Filtering API - Business Layer Designed for Blog Posts. 
/// It support filtering articles based on category name, categoryid, or array of category lists.
/// It supports only public videos but you can extend its filter logics based on your requirements.
/// </summary>
namespace Jugnoon.Blogs
{
    public class CategorizeBlogs
    {
        public static async Task<List<JGN_Blogs>> LoadItems(ApplicationDbContext context, BlogEntity entity)
        {
            if (!entity.iscache
                || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0
                || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return await Load_Raw(context, entity);
            }
            else
            {
                string key = BlogsBLL.GenerateKey("lg_blog_cat_", entity);
                var data = new List<JGN_Blogs>();
                if (!SiteConfig.Cache.TryGetValue(key, out data))
                {
                    data = await Load_Raw(context, entity);

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        // Keep in cache for this time, reset time if accessed.
                        .SetSlidingExpiration(TimeSpan.FromSeconds(3600));

                    // Save data in cache.
                    SiteConfig.Cache.Set(key, data, cacheEntryOptions);
                }
                else
                {
                    data = (List<JGN_Blogs>)SiteConfig.Cache.Get(key);
                }
                return data;
            }
        }
        private static Task<List<JGN_Blogs>> Load_Raw(ApplicationDbContext context, BlogEntity entity)
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
                  blog => blog.userid,
                  user => user.Id, (blog, user) => new { blog, user })
             .Join(context.JGN_CategoryContents,
                 blog => blog.blog.id,
                 blog_category => blog_category.contentid, (blog, blog_category) => new { blog, blog_category })
             .Join(context.JGN_Categories,
                 blog_category => blog_category.blog_category.categoryid,
                 category => category.id, (blog_category, category) =>
                 new BlogQueryEntity
                 {
                     blog = blog_category.blog.blog,
                     blog_category = blog_category.blog_category,
                     category = category,
                     user = blog_category.blog.user
                 })
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
