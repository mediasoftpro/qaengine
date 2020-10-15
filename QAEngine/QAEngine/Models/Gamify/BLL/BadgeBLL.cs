using System;
using Jugnoon.Utility;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Jugnoon.Framework;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using LinqKit;
using System.Threading.Tasks;

namespace Jugnoon.Gamify
{
    public class BadgeBLL
    {
        private static async Task<string> processImage(ApplicationDbContext context, string title, string filename)
        {
            if (filename != null && filename != "")
            {
                if (filename.StartsWith("data:image"))
                {
                    // base 64 image
                    byte[] image = Convert.FromBase64String(filename.Replace("data:image/png;base64,", ""));
                    // create image name
                    string thumbFileName = UtilityBLL.ReplaceSpaceWithHyphin(title) + Guid.NewGuid().ToString().Substring(0, 8) + ".png";

                    var path = SiteConfig.Environment.ContentRootPath + DirectoryPaths.GamifyDirectoryPath;
                    if (System.IO.File.Exists(path + "" + thumbFileName))
                        System.IO.File.Delete(path + "" + thumbFileName);

                    // local storage
                    System.IO.File.WriteAllBytes(path + "" + thumbFileName, image);
                    filename = await Helper.Aws.UploadPhoto(context, filename, path, Settings.Configs.AwsSettings.gamify_badges_directory);
                }
            }
            return filename;
        }

        private static void removeImages(string filename)
        {
            if (filename != null && filename != "")
            {
                if (filename.StartsWith("http"))
                {
                    string dirPath = SiteConfig.Environment.ContentRootPath + DirectoryPaths.GamifyDirectoryPath;
                    if (System.IO.File.Exists(dirPath + filename))
                        System.IO.File.Delete(dirPath + filename);
                }
            }
        }

        public static async Task<JGN_Badges> Add(ApplicationDbContext context, JGN_Badges entity)
        {
                entity.icon = await processImage(context, entity.title, entity.icon);
                var _ga = new JGN_Badges()
                {
                    title = entity.title,
                    description = entity.description,
                    icon = entity.icon,
                    icon_sm = entity.icon_sm,
                    icon_lg = entity.icon_lg,
                    category_id = entity.category_id,
                    type = entity.type,
                    icon_css = entity.icon_css,
                    priority = entity.priority,
                    credits = entity.credits,
                    xp = entity.xp,
                    price = entity.price,
                    notification = entity.notification,
                    isdeduct = entity.isdeduct,
                    ilevel = entity.ilevel,
                    ishide = entity.ishide,
                    ismultiple = entity.ismultiple
                };
                context.Entry(_ga).State = EntityState.Added;
                
               await context.SaveChangesAsync();

                entity.id = _ga.id;

            
            return entity;
        }


       public static async Task<JGN_Badges> Update(ApplicationDbContext context, JGN_Badges entity)
        {
            entity.icon = await processImage(context, entity.title, entity.icon);

            var item = context.JGN_Badges
                    .Where(p => p.id == entity.id)
                    .FirstOrDefault<JGN_Badges>();

            item.title = UtilityBLL.processNull(entity.title, 0);
            item.description = string.Join(",", entity.description);
            item.icon = UtilityBLL.processNull(entity.icon, 0);
            item.icon_sm = UtilityBLL.processNull(entity.icon_sm, 0);
            item.icon_lg = UtilityBLL.processNull(entity.icon_lg, 0);
            item.category_id = entity.category_id;
            item.type = entity.type;
            item.icon_css = entity.icon_css;
            item.priority = entity.priority;
            item.credits = entity.credits;
            item.xp = entity.xp;
            item.price = entity.priority;
            item.notification = entity.notification;
            item.isdeduct = entity.isdeduct;
            item.ilevel = entity.ilevel;
            item.ishide = entity.ishide;
            item.ismultiple = entity.ismultiple;

            context.Entry(item).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return entity;
        }

        public static bool Update_Field_V3(ApplicationDbContext context,long ID, dynamic Value, string FieldName)
        {
                var item = context.JGN_Badges
                     .Where(p => p.id == ID)
                     .FirstOrDefault<JGN_Badges>();

                foreach (var prop in item.GetType().GetProperties())
                {
                    if (prop.Name.ToLower() == FieldName.ToLower())
                    {
                        prop.SetValue(item, Value);
                    }
                }
                context.Entry(item).State = EntityState.Modified;
                context.SaveChanges();
            
            return true;
        }

        public static bool Delete(ApplicationDbContext context, int id, string filename)
        {
            removeImages(filename);

            var filterID = id;
            var list = from s in context.JGN_Badges_LevelAssociates
                        where s.levelid.Equals(filterID)
                        select s;

            var items = list.ToList();
            foreach (var item in items)
            {
                context.JGN_Badges_LevelAssociates.Attach(item);
                context.JGN_Badges_LevelAssociates.Remove(item);
                context.SaveChanges();
            }

            // remove badge
            var bentity = new JGN_Badges { id = id };
            context.JGN_Badges.Attach(bentity);
            context.JGN_Badges.Remove(bentity);
            context.SaveChanges();
           
            return true;
        }
        
        public static Task<List<JGN_Badges>> Load(ApplicationDbContext context,BadgeEntity entity)
        {
            var collectionQuery = context.JGN_Badges.Where(returnWhereClause(entity));
            collectionQuery = processOptionalConditions(collectionQuery, entity);
            if (entity.isdropdown)
                return LoadDropdownList(collectionQuery);
            else
                return LoadCompleteList(collectionQuery);
        }

        public static int Count(ApplicationDbContext context,BadgeEntity entity)
        {
            if (!entity.iscache || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0  || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return CountRecords(context,entity);
            }
            else
            {
                string key = GenerateKey("cnt_ga_badges", entity);
                int records = 0;
                if (!SiteConfig.Cache.TryGetValue(key, out records))
                {
                    records = CountRecords(context,entity);

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

        private static int CountRecords(ApplicationDbContext context,BadgeEntity entity)
        {
            return context.JGN_Badges.Where(returnWhereClause(entity)).Count();
        }
        private static string GenerateKey(string key, BadgeEntity entity)
        {
            var str = new StringBuilder();
            return key + entity.datefilter + "" + entity.type + "" + entity.categoryid + "" + UtilityBLL.ReplaceSpaceWithHyphin(entity.order.ToLower()) + "" + entity.pagenumber + "" + entity.term;
        }

        private static Task<List<JGN_Badges>> LoadCompleteList(IQueryable<JGN_Badges> query)
        {
            return query.Select(p => new JGN_Badges
            {
                id = (int)p.id,
                title = p.title,
                description = p.description,
                icon = p.icon,
                icon_sm = p.icon_sm,
                icon_lg = p.icon_lg,
                category_id = p.category_id,
                type = p.type,
                icon_css = p.icon_css,
                priority = p.priority,
                credits = p.credits,
                xp = p.xp,
                price = p.price,
                notification = p.notification,
                isdeduct = p.isdeduct,
                ilevel = p.ilevel,
                ishide = p.ishide,
                ismultiple = p.ismultiple
            }).ToListAsync();
        }

        private static Task<List<JGN_Badges>> LoadDropdownList(IQueryable<JGN_Badges> query)
        {
            return query.Select(p => new JGN_Badges
            {
                id = (int)p.id,
                title = p.title,
                icon = p.icon
            }).ToListAsync();
        }

        private static IQueryable<JGN_Badges> processOptionalConditions(IQueryable<JGN_Badges> collectionQuery, BadgeEntity query)
        {
            if (query.order != "")
                collectionQuery = (IQueryable<JGN_Badges>)collectionQuery.Sort(query.order);

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

        private static System.Linq.Expressions.Expression<Func<JGN_Badges, bool>> returnWhereClause(BadgeEntity entity)
        {
            var where_clause = PredicateBuilder.New<JGN_Badges>(true);
           
            if (entity.id > 0)
                where_clause = where_clause.And(p => p.id == entity.id);
            if (entity.categoryid > 0)
                where_clause = where_clause.And(p => p.category_id == entity.categoryid);
            if (entity.isdeduct != 2)
                where_clause = where_clause.And(p => p.isdeduct == entity.isdeduct);
            if (entity.ishide != 2)
                where_clause = where_clause.And(p => p.ishide == entity.ishide);
            if (entity.ismultiple != 2)
                where_clause = where_clause.And(p => p.ismultiple == entity.ismultiple);


            return where_clause;
        }

        public static string ProcessAction(ApplicationDbContext context,List<BadgeEntity> list)
        {
            foreach (BadgeEntity entity in list)
            {
                if (entity.id > 0)
                {
                    switch (entity.actionstatus)
                    {
                        case "delete":
                            Delete(context, (int)entity.id, entity.icon);
                            break;
                    }
                }
            }
            return "OK";
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

