using System;
using Jugnoon.Utility;
using System.Text;
using Jugnoon.Entity;
using System.Collections.Generic;
using System.Linq;
using Jugnoon.Framework;
using Jugnoon.Settings;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using LinqKit;
using System.Threading.Tasks;

namespace Jugnoon.Gamify
{
    public class GA_CategoryBLL
    {
        public static JGN_BadgeCategories Add(ApplicationDbContext context, JGN_BadgeCategories entity)
        {
                var _ga = new JGN_BadgeCategories()
                {
                    title = entity.title,
                    description = entity.description,
                    shorttitle = entity.shorttitle,
                    type = (byte)entity.type,
                    priority = entity.priority,
                };
                context.Entry(_ga).State = EntityState.Added;

               context.SaveChanges();

                entity.id = _ga.id;

            
            return entity;
        }

        public static void Delete(ApplicationDbContext context,short id)
        {
            var entity = new JGN_BadgeCategories { id = id };
            context.JGN_BadgeCategories.Attach(entity);
            context.JGN_BadgeCategories.Remove(entity);
            context.SaveChanges();
        }
        
        public static JGN_BadgeCategories Update(ApplicationDbContext context, JGN_BadgeCategories entity)
        {
            var item = context.JGN_BadgeCategories
                    .Where(p => p.id == entity.id)
                    .FirstOrDefault<JGN_BadgeCategories>();
                  
            item.title = entity.title;
            item.description = entity.description;
            item.shorttitle = entity.shorttitle;
            item.type = (byte)entity.type;
            item.priority = entity.priority;
            context.SaveChanges();

            context.Entry(item).State = EntityState.Modified;
            context.SaveChanges();

            return entity;
        }

        public static bool Update_Field_V3(ApplicationDbContext context,long ID, dynamic Value, string FieldName)
        {            
            var item = context.JGN_BadgeCategories
                    .Where(p => p.id == ID)
                    .FirstOrDefault<JGN_BadgeCategories>();

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
                
        public static Task<List<JGN_BadgeCategories>> Load(ApplicationDbContext context,GACategoryEntity entity)
        {
            var collectionQuery = context.JGN_BadgeCategories.Where(returnWhereClause(entity));
            collectionQuery = processOptionalConditions(collectionQuery, entity);
            return LoadCompleteList(collectionQuery);
        }

        public static int Count(ApplicationDbContext context,GACategoryEntity entity)
        {
            if (!entity.iscache || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0  || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return CountRecords(context,entity);
            }
            else
            {
                string key = GenerateKey("cnt_ga_categories", entity);
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

        private static int CountRecords(ApplicationDbContext context,GACategoryEntity entity)
        {
            return context.JGN_BadgeCategories.Where(returnWhereClause(entity)).Count();
        }
        private static string GenerateKey(string key, GACategoryEntity entity)
        {
            var str = new StringBuilder();
            return key + entity.datefilter + "" + entity.type + "" + UtilityBLL.ReplaceSpaceWithHyphin(entity.order.ToLower()) + "" + entity.pagenumber + "" + entity.term;
        }


        public static Task<List<JGN_BadgeCategories>> LoadCompleteList(IQueryable<JGN_BadgeCategories> query)
        {
            return query.Select(p => new JGN_BadgeCategories
            {
                id = (short)p.id,
                title = p.title,
                description = p.description,
                shorttitle = p.shorttitle,
                type = p.type,
                priority = p.priority,
            }).ToListAsync();
        }

    

        private static IQueryable<JGN_BadgeCategories> processOptionalConditions(IQueryable<JGN_BadgeCategories> collectionQuery, GACategoryEntity query)
        {
            if (query.order != "")
                collectionQuery = (IQueryable<JGN_BadgeCategories>)collectionQuery.Sort(query.order);

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

        private static System.Linq.Expressions.Expression<Func<JGN_BadgeCategories, bool>> returnWhereClause(GACategoryEntity entity)
        {
            var where_clause = PredicateBuilder.New<JGN_BadgeCategories>(true);
            if (entity.id > 0)
               where_clause = where_clause.And(p => p.id == entity.id);
            // if (entity.type > 0)
            //  where_clause = where_clause.And(p => p.type == entity.type);


            return where_clause;
        }


        public static string ProcessAction(ApplicationDbContext context,List<GACategoryEntity> list)
        {
            foreach (GACategoryEntity entity in list)
            {
                if (entity.id > 0)
                {
                    switch (entity.actionstatus)
                    {
                        case "delete":
                            Delete(context, (short)entity.id);
                            break;
                    }
                }
            }
            return "SUCCESS";
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */


