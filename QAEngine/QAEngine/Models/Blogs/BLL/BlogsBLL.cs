using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Jugnoon.Entity;
using Jugnoon.Utility;
using Jugnoon.BLL;
using System.Linq;
using Jugnoon.Framework;
using Microsoft.EntityFrameworkCore;
using LinqKit;
using System.Threading.Tasks;
using Jugnoon.Models;

namespace Jugnoon.Blogs
{   
    public class BlogsBLL
    {
        // Note: Important Terms

        // isenabled:
        // ........... 0: Not Enabled.
        // ........... 1: Enabled
        // ........... 2: Both enabled, disabled

        // isadult:
        // ........... 0: Not Adult.
        // ........... 1: Adult

        // isapproved:
        // ........... 0: Not approved
        // ........... 1: Approved


        #region Action Script

        public static void Validation(JGN_Blogs entity)
        {            
            if (entity.title != null &&  entity.title.Length > 100)
                entity.title= entity.title.Substring(0, 99);

            if (entity.tags != null &&  entity.tags.Length > 300)
                entity.tags = entity.tags.Substring(0, 299);
        }

        private static void ScreenContent(ApplicationDbContext context, JGN_Blogs entity)
        {
            if (Jugnoon.Settings.Configs.GeneralSettings.screen_content == 1)
            {
                entity.title = DictionaryBLL.Process_Screening(context, UtilityBLL.processNull(entity.title, 0));
                entity.description = DictionaryBLL.Process_Screening(context, UtilityBLL.processNull(entity.description, 0));
                entity.tags = DictionaryBLL.Process_Screening(context, UtilityBLL.processNull(entity.tags, 0));
            }
        }
        
        public static async Task<JGN_Blogs> Add(ApplicationDbContext context, JGN_Blogs entity)
        {           
            Validation(entity);
            ScreenContent(context, entity);

            var ent = new JGN_Blogs()
            {
                userid = entity.userid,
                title = entity.title,
                description = entity.description,
                tags = entity.tags,
                isenabled = (byte)entity.isenabled,
                isapproved = (byte)entity.isapproved,
                created_at = DateTime.Now,
                fetch_url = UtilityBLL.processNull(entity.fetch_url, 0),
                picture_url = UtilityBLL.processNull(entity.picture_url, 0),
                cover_url = UtilityBLL.processNull(entity.cover_url, 0),
                picture_caption = UtilityBLL.processNull(entity.picture_caption, 0),
            };
            context.Entry(ent).State = EntityState.Added;
            await context.SaveChangesAsync();
            entity.id = ent.id;

            // Content Associated Categories Processing
            CategoryContentsBLL.ProcessAssociatedContentCategories(context, entity.categories,
                entity.id, (byte)CategoryContentsBLL.Types.Blogs, false);

            // update user stats
            await update_stats(context, entity.userid);

            return entity;
        }

        public static async Task Update(ApplicationDbContext context, JGN_Blogs entity)
        {            
            Validation(entity);
            ScreenContent(context, entity);
            var item = context.JGN_Blogs
                    .Where(p => p.id == entity.id)
                    .FirstOrDefault();

            if (item != null)
            {
                item.title = UtilityBLL.processNull(entity.title, 0);
                item.description = UtilityBLL.processNull(entity.description, 0);
                item.tags = UtilityBLL.processNull(entity.tags, 0);
                item.picture_url = UtilityBLL.processNull(entity.picture_url, 0);
                item.picture_caption = UtilityBLL.processNull(entity.picture_caption, 0);

                context.Entry(item).State = EntityState.Modified;
                await context.SaveChangesAsync();

                // Content Associated Categories Processing
                CategoryContentsBLL.ProcessAssociatedContentCategories(context, entity.categories,
                    item.id, (byte)CategoryContentsBLL.Types.Blogs, true);
                // update user stats
                await update_stats(context, entity.userid);
            }
           
        }

        public static bool Check(ApplicationDbContext context,long PostID, string UserName)
        {
            bool flag = false;
            if (context.JGN_Blogs.Where(p => p.id == PostID && p.userid == UserName).Count() > 0)
                flag = true;

            return flag;
        }

        public static async Task<bool> Delete(ApplicationDbContext context,long id, string userid)
        {
            // remove blog post
            context.JGN_Blogs.RemoveRange(context.JGN_Blogs.Where(x => x.id == id && x.userid == userid));
            await context.SaveChangesAsync();
            // remove blog catgory references
            context.JGN_CategoryContents.RemoveRange(context.JGN_CategoryContents.Where(x => x.contentid == id && x.type == (byte)CategoryContentsBLL.Types.Blogs));

            await update_stats(context, userid);

            return true;
        }

        #endregion

        #region Core Loading Script
        public static async Task<List<JGN_Blogs>> LoadItems(ApplicationDbContext context, BlogEntity entity)
        {
            if (entity.categoryname != "" 
                || entity.categoryid > 0 
                || entity.category_ids.Length > 0)
                return await CategorizeBlogs.LoadItems(context, entity);
            else if (entity.loadabusereports)
                return await AbuseBlogs.LoadItems(context, entity);
            else
                return await _LoadItems(context, entity);
        }
        private static async Task<List<JGN_Blogs>> _LoadItems(ApplicationDbContext context, BlogEntity entity)
        {
            if (!entity.iscache 
                || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0 
                || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return await FetchItems(context,entity);
            }
            else
            {
                string key = GenerateKey("ld_blog_1", entity);
                var data = new List<JGN_Blogs>();
                if (!SiteConfig.Cache.TryGetValue(key, out data))
                {
                    data = await FetchItems(context,entity);

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

        private static async Task<List<JGN_Blogs>> FetchItems(ApplicationDbContext context,BlogEntity entity)
        {
            // No INNER JOIN
            var collectionQuery = processOptionalConditions(prepareQuery(context, entity), entity);
            if (entity.id > 0 || !entity.issummary)
                return await LoadCompleteList(collectionQuery);
            else
                return await LoadSummaryList(collectionQuery);
        }

        public static async Task<int> Count(ApplicationDbContext context, BlogEntity entity)
        {
            if (entity.categoryname != ""
                || entity.categoryid > 0
                || entity.category_ids.Length > 0)
                return await CategorizeBlogs.Count(context, entity);
            else if (entity.loadabusereports)
                return await AbuseBlogs.Count(context, entity);
            else
                return await _Count(context, entity);
        }
        private static async Task<int> _Count(ApplicationDbContext context,BlogEntity entity)
        {
            if (!entity.iscache 
                || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0  
                || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return await CountRecords(context,entity);
            }
            else
            {
                string key = GenerateKey("cnt_blogs_1", entity);
                int records = 0;
                if (!SiteConfig.Cache.TryGetValue(key, out records))
                {
                    records = await CountRecords(context,entity);

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        // Keep in cache for this time, reset time if accessed.
                        .SetSlidingExpiration(TimeSpan.FromSeconds(3600));

                    // Save data in cache.
                    SiteConfig.Cache.Set(key, records, cacheEntryOptions);
                }
                else
                {
                    records = (int)SiteConfig.Cache.Get(key);
                }
                return records;

            }
        }

        private static Task<int> CountRecords(ApplicationDbContext context,BlogEntity entity)
        {
            return prepareQuery(context,entity).CountAsync();
        }
        
        public static string GenerateKey(string key, BlogEntity entity)
        {
            var str = new StringBuilder();
            str.AppendLine(key + "_" + entity.isadult + "" + entity.isfeatured + "" + 
                entity.userid + "" + entity.categoryid + "" + entity.categoryname + "" + entity.datefilter + "" + entity.tags + ""
                + UtilityBLL.ReplaceSpaceWithHyphin(entity.order.ToLower()) + "" + entity.pagenumber + "" + entity.mode + "" + entity.pagesize);
            if (entity.tags != "")
                str.AppendLine(UtilityBLL.ReplaceSpaceWithHyphin(entity.tags.ToLower()));

            return str.ToString();
        }

        public static Task<List<JGN_Blogs>> LoadCompleteList(IQueryable<BlogQueryEntity> query)
        {
            return query.Select(p => new JGN_Blogs
            {
                id = p.blog.id,
                userid = p.blog.userid,
                title = p.blog.title,
                description = p.blog.description,
                tags = p.blog.tags,
                categories = p.blog.categories,
                isadult = p.blog.isadult,
                created_at = p.blog.created_at,
                isenabled = p.blog.isenabled,
                views = p.blog.views,
                comments = p.blog.comments,
                total_ratings = p.blog.total_ratings,
                ratings = p.blog.ratings,
                avg_rating= p.blog.avg_rating,
                favorites = p.blog.favorites,
                iscomments = p.blog.iscomments,
                isapproved = p.blog.isapproved,
                liked = p.blog.liked,
                disliked = p.blog.disliked,
                fetch_url = p.blog.fetch_url,
                picture_caption = p.blog.picture_caption,
                picture_url = p.blog.picture_url,
                cover_url = p.blog.cover_url,
                isfeatured = p.blog.isfeatured,
                mode = p.blog.mode,
                author = new ApplicationUser()
                {
                    Id = p.user.Id,
                    firstname = p.user.firstname,
                    lastname = p.user.lastname,
                    UserName = p.user.UserName,
                    picturename = p.user.picturename
                }
            }).ToListAsync();
        }
        public static Task<List<JGN_Blogs>> LoadSummaryList(IQueryable<BlogQueryEntity> query)
        {
            return query.Select(prepareSummaryList()).ToListAsync();
        }

        public static System.Linq.Expressions.Expression<Func<BlogQueryEntity, JGN_Blogs>> prepareSummaryList()
        {
            return p => new JGN_Blogs
            {
                id = p.blog.id,
                userid = p.blog.userid,
                title = p.blog.title,
                description = p.blog.description,
                tags = p.blog.tags,
                categories = p.blog.categories,
                isadult = p.blog.isadult,
                created_at = p.blog.created_at,
                isenabled = p.blog.isenabled,
                views = p.blog.views,
                comments = p.blog.comments,
                total_ratings = p.blog.total_ratings,
                ratings = p.blog.ratings,
                avg_rating = p.blog.avg_rating,
                isapproved = p.blog.isapproved,
                liked = p.blog.liked,
                disliked = p.blog.disliked,
                fetch_url = p.blog.fetch_url,
                picture_caption = p.blog.picture_caption,
                picture_url = p.blog.picture_url,
                cover_url = p.blog.cover_url,
                isfeatured = p.blog.isfeatured,
                mode = p.blog.mode,
                author = new ApplicationUser()
                {
                    Id = p.user.Id,
                    firstname = p.user.firstname,
                    lastname = p.user.lastname,
                    UserName = p.user.UserName,
                    picturename = p.user.picturename
                }
            };

        }

        private static IQueryable<BlogQueryEntity> prepareQuery(ApplicationDbContext context, BlogEntity entity)
        {
            return context.JGN_Blogs
                .Join(context.AspNetusers,
                blog => blog.userid,
                user => user.Id,
                (blog, user) => new BlogQueryEntity
                {
                    blog = blog,
                    user = user
                }).Where(returnWhereClause(entity));
        }

        public static IQueryable<BlogQueryEntity> processOptionalConditions(IQueryable<BlogQueryEntity> collectionQuery, BlogEntity query)
        {
            if (query.order != "")
                collectionQuery = (IQueryable<BlogQueryEntity>)collectionQuery.Sort(query.order);
            // validation check (if not set, it will return zero records that will make it difficult to debug the code)
            if (query.pagesize == 0)
                query.pagesize = 18;
            // skip logic
            if (query.pagenumber > 1)
                collectionQuery = collectionQuery.Skip(query.pagesize * (query.pagenumber - 1));
            // take logic
            if (!query.loadall)
                collectionQuery = collectionQuery.Take(query.pagesize);


            return collectionQuery;
        }


        public static System.Linq.Expressions.Expression<Func<BlogQueryEntity, bool>> returnWhereClause(BlogEntity entity)
        {
            var where_clause = PredicateBuilder.New<BlogQueryEntity>(true);
            if (entity.excludedid > 0)
                where_clause = where_clause.And(p => p.blog.id != entity.excludedid);
            if (entity.id > 0)
                where_clause = where_clause.And(p => p.blog.id == entity.id);

            if (!entity.nofilter)
            {
                if (entity.categoryname != "" || entity.categoryid > 0 || entity.category_ids.Length > 0)
                {
                    where_clause = where_clause.And(p => p.blog_category.type == (byte)CategoryContentsBLL.Types.Blogs);
                    if (entity.categoryname != null && entity.categoryname != "")
                        where_clause = where_clause.And(x => x.category.title == entity.categoryname.ToLower() || x.category.term == entity.categoryname);

                    if (entity.categoryid > 0)
                        where_clause = where_clause.And(x => x.blog_category.categoryid == entity.categoryid);

                    if (entity.category_ids.Length > 0)
                    {
                        foreach (var id in entity.category_ids)
                        {
                            where_clause = where_clause.And(x => x.blog_category.categoryid == id);
                        }
                    }
                }

                if (entity.tags != "")
                    where_clause = where_clause.And(p => p.blog.tags.Contains(entity.tags));

                if (entity.userid != "")
                {
                    where_clause = where_clause.And(p => p.blog.userid == entity.userid);
                }

                if (entity.mode > 0)
                    where_clause = where_clause.And(p => p.blog.mode == entity.mode);

                if (entity.isfeatured != FeaturedTypes.All)
                    where_clause = where_clause.And(p => p.blog.isfeatured == (byte)entity.isfeatured);

                if (entity.term != "")
                    where_clause = where_clause.And(p => p.blog.title.Contains(entity.term) 
                    || p.blog.description.Contains(entity.term) 
                    || p.blog.tags.Contains(entity.term));

                if (entity.month > 0 && entity.year > 0)
                    where_clause = where_clause.And(p => p.blog.created_at.Month == entity.month 
                    && p.blog.created_at.Year == entity.year);
                else if (entity.year > 0)
                    where_clause = where_clause.And(p => p.blog.created_at.Year == entity.year);
                else if (entity.month > 0)
                    where_clause = where_clause.And(p => p.blog.created_at.Month == entity.month);

                if (entity.loadabusereports)
                    where_clause = where_clause.And(p => p.abusereports.type == (byte)AbuseReport.Types.Blogs);

                if (entity.ispublic)
                {
                    where_clause = where_clause.And(p => p.blog.isenabled == 1 && p.blog.isapproved == 1
                    && p.user.isenabled == 1);
                }
                else
                {
                    if (entity.isenabled != EnabledTypes.All)
                        where_clause = where_clause.And(p => p.blog.isenabled == (byte)entity.isenabled);

                    if (entity.isapproved != ApprovedTypes.All)
                        where_clause = where_clause.And(p => p.blog.isapproved == (byte)entity.isapproved);
                }

                if (entity.datefilter != DateFilter.AllTime)
                {
                    switch (entity.datefilter)
                    {
                        case DateFilter.Today:
                            // today record
                            where_clause = where_clause.And(p => p.blog.created_at >= DateTime.Now.AddDays(-1));
                            break;
                        case DateFilter.ThisWeek:
                            // this week record
                            where_clause = where_clause.And(p => p.blog.created_at >= DateTime.Now.AddDays(-7));
                            break;
                        case DateFilter.ThisMonth:
                            // this month record
                            where_clause = where_clause.And(p => p.blog.created_at >= DateTime.Now.AddDays(-31));
                            break;
                        case DateFilter.ThisYear:
                            // this year record
                            where_clause = where_clause.And(p => p.blog.created_at >= DateTime.Now.AddYears(-1));
                            break;
                    }
                }

                if (entity.reporttype != DefaultReportTypes.None)
                {
                    switch (entity.reporttype)
                    {
                        case DefaultReportTypes.Today:
                            where_clause = where_clause.And(p => p.blog.created_at.Date == DateTime.Now.Date);
                            break;
                        case DefaultReportTypes.Yesterday:
                            where_clause = where_clause.And(p => p.blog.created_at.Date == DateTime.Now.Date.AddDays(-1));
                            break;
                        case DefaultReportTypes.TodayYesterday:
                            where_clause = where_clause.And(p => p.blog.created_at.Date == DateTime.Now.Date || p.blog.created_at == DateTime.Now.Date.AddDays(-1));
                            break;
                        case DefaultReportTypes.Week:
                            where_clause = where_clause.And(p => p.blog.created_at >= DateTime.Now.AddDays(-7));
                            break;
                        case DefaultReportTypes.LastWeek:
                            where_clause = where_clause.And(p => p.blog.created_at.Date >= DateTime.Now.Date.AddDays(-14) && p.blog.created_at.Date <= DateTime.Now.Date.AddDays(-7));
                            break;
                        case DefaultReportTypes.Month:
                            where_clause = where_clause.And(p => p.blog.created_at >= DateTime.Now.AddDays(-31));
                            break;
                        case DefaultReportTypes.LastMonth:
                            where_clause = where_clause.And(p => p.blog.created_at.Date >= DateTime.Now.Date.AddMonths(-2) && p.blog.created_at.Date <= DateTime.Now.Date.AddMonths(-1));
                            break;
                        case DefaultReportTypes.Year:
                            where_clause = where_clause.And(p => p.blog.created_at >= DateTime.Now.AddYears(-1));
                            break;
                    }
                }

                if (entity.isadult != AdultTypes.All)
                    where_clause = where_clause.And(p => p.blog.isadult == (byte)entity.isadult);
            }

            return where_clause;
        }

        #endregion


        #region Report Script
        public static async Task<GoogleChartEntity> LoadReport(ApplicationDbContext context, BlogEntity entity)
        {
            if (entity.reporttype == DefaultReportTypes.Yearly)
                return await BlogReports.YearlyReport(context, entity);
            else if (entity.reporttype == DefaultReportTypes.CurrentMonth)
                return await BlogReports.CurrentMonthReport(context, entity);
            else
                return await BlogReports.Last12MonthsReport(context, entity);
        }
       

        #endregion

        public static List<ArchiveEntity> Load_Arch_List(ApplicationDbContext context,int records, bool isall)
        {
            // cache implementation
            int cache_duration = Jugnoon.Settings.Configs.GeneralSettings.cache_duration;
            if (cache_duration == 0)
                return Fetch_Archive_List(context,records, isall);
            else
            {
                string key = "ld_blg_arc_lst" + records + "" + isall;
                var data = new List<ArchiveEntity>();
                if (!SiteConfig.Cache.TryGetValue(key, out data))
                {
                    data = Fetch_Archive_List(context,records, isall);

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        // Keep in cache for this time, reset time if accessed.
                        .SetSlidingExpiration(TimeSpan.FromSeconds(3600));

                    // Save data in cache.
                    SiteConfig.Cache.Set(key, data, cacheEntryOptions);
                }
                else
                {
                    data = (List<ArchiveEntity>)SiteConfig.Cache.Get(key);
                }

                return data;
            }

        }
        public static List<ArchiveEntity> Fetch_Archive_List(ApplicationDbContext context,int records, bool isall)
        {
            // var context = SiteConfig.dbContext;
            var model = context.JGN_Blogs
                .GroupBy(o => new
                {
                    Month = o.created_at.Month,
                    Year = o.created_at.Year
                })
                .Select(g => new ArchiveEntity
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Total = g.Count()
                })
                .OrderByDescending(a => a.Year)
                .ThenByDescending(a => a.Month)
                .ToList();

            return model;
        }
                


        public static bool Update_Field_V3(ApplicationDbContext context,long ID, dynamic Value, string FieldName)
        {            
            var item = context.JGN_Blogs
                    .Where(p => p.id == ID)
                    .FirstOrDefault();

            if(item != null)
            {
                foreach (var prop in item.GetType().GetProperties())
                {
                    if (prop.Name.ToLower() == FieldName.ToLower())
                    {
                        prop.SetValue(item, Value);
                    }
                }
                context.Entry(item).State = EntityState.Modified;
                context.SaveChanges();
            }
            return true;
        }

    
        private static async Task<bool> update_stats(ApplicationDbContext context, string userid)
        {
            if (userid != "")
            {
                var count = BlogsBLL.Count(context, new BlogEntity()
                {
                    userid = userid,
                    ispublic = true
                }).Result;
                await UserStatsBLL.Update_Field(context,  userid, (short)count, "stat_blogs");
            }
            return true;
        }

        public static async Task<string> ProcessAction(ApplicationDbContext context,List<BlogEntity> list)
        {
            foreach (var entity in list)
            {
                if (entity.id > 0)
                {
                    switch (entity.actionstatus)
                    {
                        case "enable":
                            Update_Field_V3(context, entity.id, (byte)1, "isenabled");
                            break;
                        case "disable":
                            Update_Field_V3(context, entity.id, (byte)0, "isenabled");
                            break;
                        case "approve":
                            Update_Field_V3(context, entity.id, (byte)1, "isapproved");
                            break;
                        case "featured":
                            Update_Field_V3(context, entity.id, (byte)1, "isfeatured");
                            break;
                        case "normal":
                            Update_Field_V3(context, entity.id, (byte)0, "isfeatured");
                            break;
                        case "nonadult":
                            Update_Field_V3(context, entity.id, (byte)0, "isadult");
                            break;
                        case "adult":
                            Update_Field_V3(context, entity.id, (byte)1, "isadult");
                            break;
                        case "delete":
                            await Delete(context, entity.id, entity.userid);
                            break;
                    }
                }
            }
            return "OK";
        }
    }

    /// <summary>
    /// Entity used while joining data of two tables (blogs, users) via Entity Framework (Linq)
    /// </summary>
    public class BlogQueryEntity
    {
        public JGN_Blogs blog { get; set; }
        public ApplicationUser user { get; set; }
        public JGN_Categories category { get; set; }
        public JGN_CategoryContents blog_category { get; set; }
        public JGN_AbuseReports abusereports { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

