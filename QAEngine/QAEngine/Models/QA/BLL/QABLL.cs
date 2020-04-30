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

namespace Jugnoon.qa
{
    public enum ClosedActions
    {
        Open = 0,
        Closed = 1,
        All = 2
    };

    public enum ResolvedActions
    {
        Open = 0,
        Resolved = 1,
        All = 2
    };

    public class QABLL
    { 
            
        // Note: QA Important Terms

        // isEnabled:
        // ........... 0: Not Enabled.
        // ........... 1: Enabled
        // ........... 2: Both enabled, disabled

        // isadult:
        // ........... 0: Not Adult.
        // ........... 1: Adult

        // isapproved:
        // ........... 0: Not approved
        // ........... 1: Approved

        // isfeatured:
        // .......... 0: Normal
        // .......... 1: Featured
        // .......... 2: all

        // isclosed
        // ............. 0: Not yet closed
        // ............. 1: Closed

        #region Action Script

        private static void Validation(JGN_Qa entity)
        {           
            if (entity.title != null && entity.title.Length > 100)
                entity.title= entity.title.Substring(0, 99);

            if (entity.tags != null && entity.tags.Length > 200)
                entity.tags = entity.tags.Substring(0, 199);
        }

        private static void ScreenContent(ApplicationDbContext context, JGN_Qa entity)
        {
            if (Jugnoon.Settings.Configs.GeneralSettings.screen_content == 1)
            {
                entity.title = DictionaryBLL.Process_Screening(context, entity.title);
                entity.description = DictionaryBLL.Process_Screening(context, entity.description);
                entity.tags = DictionaryBLL.Process_Screening(context, entity.tags);
            }
        }

        public static async Task<JGN_Qa> Add(ApplicationDbContext context, JGN_Qa entity, bool isadmin)
        {           
            Validation(entity);
            ScreenContent(context, entity);

            var _entity = new JGN_Qa()
            {
                userid = entity.userid,
                title = UtilityBLL.processNull(entity.title, 0),
                description = UtilityBLL.processNull(entity.description, 0),
                created_at = DateTime.Now,
                tags = UtilityBLL.processNull(entity.tags, 0),
                isenabled = entity.isenabled,
                isapproved = entity.isapproved,
                mode = entity.mode
            };

            context.Entry(_entity).State = EntityState.Added;

            await context.SaveChangesAsync();

            // update member qa statistics.
            /*if (entity.isenabled == 1 && entity.isapproved == 1)
            {
                await Refresh_User_Stats(context, entity.userid);
            }*/

            // Content Associated Categories Processing
            CategoryContentsBLL.ProcessAssociatedContentCategories(context, entity.categories,
                _entity.id, (byte)CategoryContentsBLL.Types.QA, false);

            return _entity;
        }

        // Update Information
        public static async Task<bool> Update(ApplicationDbContext context, JGN_Qa entity)
        {
            // validation
            Validation(entity);

            var item = context.JGN_Qa
                    .Where(p => p.id == entity.id)
                    .FirstOrDefault<JGN_Qa>();

            item.title = UtilityBLL.processNull(entity.title, 0);
            item.description = UtilityBLL.processNull(entity.description, 0);
            item.tags = UtilityBLL.processNull(entity.tags, 0);
            item.isenabled = entity.isenabled;
            item.isapproved = entity.isenabled;

            context.Entry(item).State = EntityState.Modified;
            await context.SaveChangesAsync();

            // Content Associated Categories Processing
            CategoryContentsBLL.ProcessAssociatedContentCategories(context, entity.categories,
                item.id, (byte)CategoryContentsBLL.Types.QA, true);

            return true;
        }


        public static async Task Delete(ApplicationDbContext context,long id, string userid)
        {
            var entity = new JGN_Qa { id = id };
            context.JGN_Qa.Attach(entity);
            context.JGN_Qa.Remove(entity);
            await context.SaveChangesAsync();
            await Refresh_User_Stats(context, userid);
            // delete question answers
            await QAnswersBLL.Delete(context, id);

            // remove catgory references
            context.JGN_CategoryContents.RemoveRange(context.JGN_CategoryContents.Where(x => x.contentid == entity.id && x.type == (byte)CategoryContentsBLL.Types.QA));
        }


        // Check qa for authorization
        public static bool Check(ApplicationDbContext context,long Qid, string UserName)
        {
            bool flag = false;
            if (context.JGN_Qa.Where(p => p.id == Qid && p.userid == UserName).Count() > 0)
                 flag = true;
            return flag;
            
        }

        public static bool Update_Field_V3(ApplicationDbContext context,long ID, dynamic Value, string FieldName)
        {
            var item = context.JGN_Qa
                    .Where(p => p.id == ID)
                    .FirstOrDefault<JGN_Qa>();

            if (item != null)
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

        #endregion


        #region Core Loading Script
        public static Task<List<JGN_Qa>> LoadItems(ApplicationDbContext context, QAEntity entity)
        {
            if (entity.categoryname != ""
             || entity.categoryid > 0
             || entity.category_ids.Length > 0)
                return CategorizeQa.LoadItems(context, entity);
            else if (entity.loadfavorites)
                return FavoritedQA.LoadItems(context, entity);
            else if (entity.loadliked)
                return LikedQA.LoadItems(context, entity);
            else if (entity.loadanswers)
                return AnsweredQA.LoadItems(context, entity);
            else if (entity.loadabusereports)
                return AbuseQA.LoadItems(context, entity);
            else
                return _LoadItems(context, entity);
        }
        private static Task<List<JGN_Qa>> _LoadItems(ApplicationDbContext context,QAEntity entity)
        {
            if (!entity.iscache 
                || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0  
                || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return FetchItems(context,entity);
            }
            else
            {
                string key = GenerateKey("lg_qa_", entity);
                var data = new List<JGN_Qa>();
                if (!SiteConfig.Cache.TryGetValue(key, out data))
                {
                    data = FetchItems(context,entity).Result;

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        // Keep in cache for this time, reset time if accessed.
                        .SetSlidingExpiration(TimeSpan.FromSeconds(3600));

                    // Save data in cache.
                    SiteConfig.Cache.Set(key, data, cacheEntryOptions);
                }
                else
                {
                    data = (List<JGN_Qa>)SiteConfig.Cache.Get(key);
                }

                return Task.Run(() => data);
            }
        }

        private static Task<List<JGN_Qa>> FetchItems(ApplicationDbContext context,QAEntity entity)
        {
            var collectionQuery = processOptionalConditions(prepareQuery(context, entity), entity);
            if (entity.id > 0 || !entity.issummary)
                return LoadCompleteList(collectionQuery);
            else
                return LoadSummaryList(collectionQuery);
        }

        public static Task<int> Count(ApplicationDbContext context, QAEntity entity)
        {
            if (entity.categoryname != ""
             || entity.categoryid > 0
             || entity.category_ids.Length > 0)
                return CategorizeQa.Count(context, entity);
            else if (entity.loadfavorites)
                return FavoritedQA.Count(context, entity);
            else if (entity.loadliked)
                return LikedQA.Count(context, entity);
            else if (entity.loadanswers)
                return AnsweredQA.Count(context, entity);
            else if (entity.loadabusereports)
                return AbuseQA.Count(context, entity);
            else
                return _Count(context, entity);
        }

        public static Task<int> _Count(ApplicationDbContext context,QAEntity entity)
        {
            if (!entity.iscache 
                || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0  
                || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return CountRecords(context,entity);
            }
            else
            {
                string key = GenerateKey("cnt_qa", entity);
                int records = 0;
                if (!SiteConfig.Cache.TryGetValue(key, out records))
                {
                    records = CountRecords(context,entity).Result;

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
                return Task.Run(() => records);
            }
        }

        private static Task<int> CountRecords(ApplicationDbContext context,QAEntity entity)
        {
            return prepareQuery(context, entity).CountAsync();
        }

        private static IQueryable<QAQueryEntity> prepareQuery(ApplicationDbContext context, QAEntity entity)
        {
            return context.JGN_Qa
                .Join(context.AspNetusers,
                    qa => qa.userid,
                    user => user.Id,
                    (qa, user) => new QAQueryEntity
                    {
                        qa = qa,
                        user = user
                    }).Where(returnWhereClause(entity));
        }

        public static string GenerateKey(string key, QAEntity entity)
        {
            var str = new StringBuilder();
            str.AppendLine(key + "_" + entity.userid + "" + entity.categoryname + "" + entity.categoryid +  entity.mode + "" + UtilityBLL.ReplaceSpaceWithHyphin(entity.order.ToLower()) 
                + "" + entity.pagenumber + "" + entity.isclosed + "" + entity.isresolved + "" + entity.isfeatured + "" + entity.pagesize);
            if (entity.term != "")
                str.AppendLine(UtilityBLL.ReplaceSpaceWithHyphin(entity.term.ToLower()));
            return str.ToString();
        }
  
        private static Task<List<JGN_Qa>> LoadCompleteList(IQueryable<QAQueryEntity> query)
        {
            return query.Select(p => new JGN_Qa
            {
                id = p.qa.id,
                title = p.qa.title,
                userid = p.qa.userid,
                votes = p.qa.votes,
                description = p.qa.description,
                tags = p.qa.tags,
                categories = p.qa.categories,
                isadult = (byte)p.qa.isadult,
                created_at = (DateTime)p.qa.created_at,
                favorites = p.qa.favorites,
                views = p.qa.views,
                isenabled = p.qa.isenabled,
                answers = p.qa.answers,
                isapproved = (byte)p.qa.isapproved,
                isclosed = p.qa.isclosed,
                isfeatured = p.qa.isfeatured,
                mode = p.qa.mode,
                isresolved = p.qa.isresolved,
                comments = (int)p.qa.comments,
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

        private static Task<List<JGN_Qa>> LoadSummaryList(IQueryable<QAQueryEntity> query)
        {
            return query.Select(prepareSummaryList()).ToListAsync();
        }

        public static System.Linq.Expressions.Expression<Func<QAQueryEntity, JGN_Qa>> prepareSummaryList()
        {
            return p => new JGN_Qa
            {
                id = p.qa.id,
                title = p.qa.title,
                userid = p.qa.userid,
                votes = p.qa.votes,
                tags = p.qa.tags,
                categories = p.qa.categories,
                isadult = p.qa.isadult,
                created_at = p.qa.created_at,
                favorites = p.qa.favorites,
                views = p.qa.views,
                isenabled = p.qa.isenabled,
                answers = p.qa.answers,
                isapproved = p.qa.isapproved,
                isclosed = p.qa.isclosed,
                isfeatured = p.qa.isfeatured,
                mode = p.qa.mode,
                isresolved = p.qa.isresolved,
                comments = (int)p.qa.comments,
                author = new ApplicationUser()
                {
                    firstname = p.user.firstname,
                    lastname = p.user.lastname,
                    UserName = p.user.UserName,
                    picturename = p.user.picturename
                }
            };

        }

        private static Task<List<JGN_Qa>> LoadDropdownList(IQueryable<QAQueryEntity> query)
        {
            return query.Select(p => new JGN_Qa
            {
                id = (int)p.qa.id,
                title = p.qa.title
            }).ToListAsync();
        }

        public static IQueryable<QAQueryEntity> processOptionalConditions(IQueryable<QAQueryEntity> collectionQuery, QAEntity query)
        {
            if (query.order != "")
                collectionQuery = (IQueryable<QAQueryEntity>)collectionQuery.Sort(query.order);

            if (query.id == 0)
            {
                // validation check (if not set, it will return zero records that will make it difficult to debug the code)
                if (query.pagesize == 0)
                    query.pagesize = 18;
                // skip logic
                if (query.pagenumber > 1)
                    collectionQuery = collectionQuery.Skip(query.pagesize * (query.pagenumber - 1));
                // take logic
                if (!query.loadall)
                    collectionQuery = collectionQuery.Take(query.pagesize);
            }
            return collectionQuery;
        }

        public static System.Linq.Expressions.Expression<Func<QAQueryEntity, bool>> returnWhereClause(QAEntity entity)
        {
            var where_clause = PredicateBuilder.New<QAQueryEntity>(true);
           
            if (entity.excludedid > 0)
                 where_clause = where_clause.And(p => p.qa.id != entity.excludedid);
            if (entity.id > 0)
                 where_clause = where_clause.And(p => p.qa.id == entity.id);

            if (!entity.nofilter)
            {
                if (entity.categoryname != "" || entity.categoryid > 0 || entity.category_ids.Length > 0)
                {
                    where_clause = where_clause.And(p => p.qa_category.type == (byte)CategoryContentsBLL.Types.QA);
                    if (entity.categoryname != null && entity.categoryname != "")
                        where_clause = where_clause.And(x => x.category.title == entity.categoryname || x.category.term == entity.categoryname);

                    if (entity.categoryid > 0)
                        where_clause = where_clause.And(x => x.qa_category.categoryid == entity.categoryid);

                    if (entity.category_ids.Length > 0)
                    {
                        foreach (var id in entity.category_ids)
                        {
                            where_clause = where_clause.And(x => x.qa_category.categoryid == id);
                        }
                    }
                }

                if (entity.loadfavorites)
                    where_clause = where_clause.And(p => p.favorite.type == (byte)FavoriteBLL.Types.QA);

                if (entity.loadliked)
                    where_clause = where_clause.And(p => p.rating.type == (byte)UserRatingsBLL.Types.QA && p.rating.rating == 0);

                if (entity.loadabusereports)
                    where_clause = where_clause.And(p => p.abusereports.type == (byte)AbuseReport.Types.qa);

                if (entity.tags != "")
                    where_clause = where_clause.And(p => p.qa.tags.Contains(entity.tags.Trim()));

                if (entity.userid != "")
                {
                    if (entity.loadliked)
                        where_clause = where_clause.And(x => x.rating.userid == entity.userid);
                    else if (entity.loadfavorites)
                        where_clause = where_clause.And(x => x.favorite.userid == entity.userid);
                    else if (entity.loadanswers)
                        where_clause = where_clause.And(x => x.answer.userid == entity.userid);
                    else
                        where_clause = where_clause.And(p => p.qa.userid == entity.userid);
                }

                if (entity.mode > 0)
                     where_clause = where_clause.And(p => p.qa.mode == entity.mode);

                if (entity.term != "")
                     where_clause = where_clause.And(p => p.qa.title.Contains(entity.term) || p.qa.description.Contains(entity.term) || p.qa.tags.Contains(entity.term));

                if (entity.month > 0 && entity.year > 0)
                     where_clause = where_clause.And(p => p.qa.created_at.Month == entity.month && p.qa.created_at.Year == entity.year);
                else if (entity.year > 0)
                     where_clause = where_clause.And(p => p.qa.created_at.Year == entity.year);
                else if (entity.month > 0)
                     where_clause = where_clause.And(p => p.qa.created_at.Month == entity.month);

                if (entity.isfeatured != FeaturedTypes.All)
                     where_clause = where_clause.And(p => p.qa.isfeatured == (byte)entity.isfeatured);

                if (entity.isclosed != ClosedActions.All)
                     where_clause = where_clause.And(p => p.qa.isclosed == (byte)entity.isclosed);

                if (entity.isresolved != ResolvedActions.All)
                     where_clause = where_clause.And(p => p.qa.isresolved == (byte)entity.isresolved);

                if (entity.voteslessthan > 0)
                     where_clause = where_clause.And(p => p.qa.votes < entity.votes);

                if (entity.votesgreaterthan > 0)
                     where_clause = where_clause.And(p => p.qa.votes > entity.votes);

                if (entity.ispublic)
                {
                     where_clause = where_clause.And(p => p.qa.isenabled == 1 
                     && p.qa.isapproved == 1
                     && p.user.isenabled == 1);
                }
                else
                {
                    if (entity.isenabled != EnabledTypes.All)
                         where_clause = where_clause.And(p => p.qa.isenabled == (byte)entity.isenabled);

                    if (entity.isapproved != ApprovedTypes.All)
                         where_clause = where_clause.And(p => p.qa.isapproved == (byte)entity.isapproved);
                }

                if (entity.datefilter != DateFilter.AllTime)
                {
                    switch (entity.datefilter)
                    {
                        case DateFilter.Today:
                            // today record
                             where_clause = where_clause.And(p => p.qa.created_at >= DateTime.Now.AddDays(-1));
                             break;
                        case DateFilter.ThisWeek:
                            // this week record
                             where_clause = where_clause.And(p => p.qa.created_at >= DateTime.Now.AddDays(-7));
                            break;
                        case DateFilter.ThisMonth:
                            // this month record
                             where_clause = where_clause.And(p => p.qa.created_at >= DateTime.Now.AddDays(-31));
                            break;
                        case DateFilter.ThisYear:
                            // this year record
                            where_clause = where_clause.And(p => p.qa.created_at >= DateTime.Now.AddYears(-1));
                            break;
                    }
                }

                if (entity.isadult != AdultTypes.All)
                     where_clause = where_clause.And(p => p.qa.isadult == (byte)entity.isadult);
            }
            return where_clause;
        }

        #endregion

        #region Report Script
        public static async Task<GoogleChartEntity> LoadReport(ApplicationDbContext context, QAEntity entity)
        {
            if (entity.reporttype == DefaultReportTypes.Yearly)
                return await QAReports.YearlyReport(context, entity);
            else if (entity.reporttype == DefaultReportTypes.CurrentMonth)
                return await QAReports.CurrentMonthReport(context, entity);
            else
                return await QAReports.Last12MonthsReport(context, entity);
        }
        #endregion


        // fetch data to generate archive list of records
        public static List<ArchiveEntity> Load_Arch_List(ApplicationDbContext context,int records, bool isall)
        {
            // cache implementation
            int cache_duration = Jugnoon.Settings.Configs.GeneralSettings.cache_duration;
            if (cache_duration == 0) // no cache
                return Fetch_Archive_List(context,records, isall);
            else
            {
                string key = "ld_qa_arc_lst" + records + "" + isall;
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
            var model = context.JGN_Qa
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

        public static async Task<string> ProcessAction(ApplicationDbContext context,List<QAEntity> list)
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
                        case "closed":
                            Update_Field_V3(context, entity.id, (byte)1, "isclosed");
                            break;
                        case "open":
                            Update_Field_V3(context, entity.id, (byte)0, "isclosed");
                            break;
                        case "nonadult":
                            Update_Field_V3(context, entity.id, (byte)0, "isadult");
                            break;
                        case "adult":
                            Update_Field_V3(context, entity.id, (byte)1, "isadult");
                            break;
                        case "featured":
                            Update_Field_V3(context, entity.id, (byte)0, "isfeatured");
                            break;
                        case "normal":
                            Update_Field_V3(context, entity.id, (byte)1, "isfeatured");
                            break;
                        case "resolved":
                            Update_Field_V3(context, entity.id, (byte)1, "isresolved");
                            break;
                        case "delete":
                            await Delete(context, entity.id, entity.userid);
                            break;
                        case "delete_fav":
                            await FavoriteBLL.Delete(context, entity.id, entity.userid, 0, (int)FavoriteBLL.Types.QA);
                            break;
                        case "delete_like":
                            await UserRatingsBLL.Delete(context, entity.id, entity.userid, (int)UserRatingsBLL.Types.QA);
                            break;
                        case "delete_ans":
                            // delete question answer
                            break;
                    }
                }
            }
            return "OK";
        }

        public static async Task<bool> Refresh_User_Stats(ApplicationDbContext context, string UserName)
        {
            // update user stats
            var _count = await Count(context,new QAEntity()
            {
                userid = UserName,
                ispublic = true
            });
            await UserStatsBLL.Update_Field(context, UserName, (short)_count, "stat_qa");
            return true;
        } 
    }

    public class QAQueryEntity
    {
        public JGN_Qa qa { get; set; }
        public ApplicationUser user { get; set; }
        public JGN_Categories category { get; set; }
        public JGN_CategoryContents qa_category { get; set; }
        public JGN_Favorites favorite { get; set; }
        public JGN_User_Ratings rating { get; set; }
        public JGN_QAnswers answer { get; set; }
        public JGN_AbuseReports abusereports { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
