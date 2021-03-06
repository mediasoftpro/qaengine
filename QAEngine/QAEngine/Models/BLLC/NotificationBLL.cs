﻿using System;
using System.Collections.Generic;
using Jugnoon.Entity;
using Jugnoon.Utility;
using Jugnoon.Settings;
using Microsoft.Extensions.Caching.Memory;
using Jugnoon.Framework;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using LinqKit;
using System.Threading.Tasks;
using Jugnoon.Models;

/// <summary>
/// Locations Business Layer Designed for Notifications. 
/// </summary>

namespace Jugnoon.BLL
{
    public enum NotificationTypes
    {
        Liked = 0,
        Comment = 1,
        Message = 2
    };
    public class NotificationBLL
    {

        public static async Task<JGN_Notifications> postNotification(ApplicationDbContext context, JGN_Notifications entity)
        {
            // save message
            var notificationEntity = new JGN_Notifications()
            {
                sender_id = entity.sender_id,
                notification_type = entity.notification_type,
                title = entity.title,
                body = entity.body,
                href = entity.href,
                is_unread = 1,
                recipient_id = entity.recipient_id,
                created_time = DateTime.Now
            };

            context.Entry(notificationEntity).State = EntityState.Added;
            await context.SaveChangesAsync();
            entity.id = notificationEntity.id;

            return entity;
        }

        public static async Task ReadMessage(ApplicationDbContext context, long id)
        {
            var item = await context.JGN_Notifications
                 .Where(p => p.id == id)
                 .FirstOrDefaultAsync();

            if (item != null)
            {
                item.is_unread = 0;

                context.Entry(item).State = EntityState.Modified;
                await context.SaveChangesAsync();
            }
        }

        /* public static void HideMessage(ApplicationDbContext context, long id)
         {
             var item = context.JGN_Notifications
                  .Where(p => p.id == id)
                  .FirstOrDefault();

             if (item != null)
             {
                 item.is_hidden = 0;

                 context.Entry(item).State = EntityState.Modified;
                 context.SaveChanges();
             }
         }*/

        public static async Task<List<JGN_Notifications>> LoadItems(ApplicationDbContext context, NotificationEntity entity)
        {
            if (!entity.iscache
                || Configs.GeneralSettings.cache_duration == 0
                || entity.pagenumber > Configs.GeneralSettings.max_cache_pages)
            {
                return await FetchItems(context, entity);
            }
            else
            {
                string key = GenerateKey("ld_notifs", entity);
                var data = new List<JGN_Notifications>();
                if (!SiteConfig.Cache.TryGetValue(key, out data))
                {
                    data = await FetchItems(context, entity);

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        // Keep in cache for this time, reset time if accessed.
                        .SetSlidingExpiration(TimeSpan.FromSeconds(3600));

                    // Save data in cache.
                    SiteConfig.Cache.Set(key, data, cacheEntryOptions);
                }
                else
                {
                    data = (List<JGN_Notifications>)SiteConfig.Cache.Get(key);
                }

                return data;
            }
        }

        private static async Task<List<JGN_Notifications>> FetchItems(ApplicationDbContext context, NotificationEntity entity)
        {
            var collectionQuery = prepareQuery(context, entity);
            collectionQuery = processOptionalConditions(collectionQuery, entity);
            return await LoadCompleteList(collectionQuery);

        }

        public static async Task<int> Count(ApplicationDbContext context, NotificationEntity entity)
        {
            if (!entity.iscache
                || Configs.GeneralSettings.cache_duration == 0
                || entity.pagenumber > Configs.GeneralSettings.max_cache_pages)
            {
                return await CountRecords(context, entity);
            }
            else
            {
                string key = GenerateKey("cnt_notifs", entity);
                int records = 0;
                if (!SiteConfig.Cache.TryGetValue(key, out records))
                {
                    records = await CountRecords(context, entity);

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

        private static Task<int> CountRecords(ApplicationDbContext context, NotificationEntity entity)
        {
            return prepareQuery(context, entity).CountAsync();
        }

        private static string GenerateKey(string key, NotificationEntity entity)
        {
            return key + UtilityBLL.ReplaceSpaceWithHyphin(entity.order.ToLower()) + "" +
                entity.pagenumber + "" + entity.RecipentID + "" + entity.pagesize;
        }

        private static Task<List<JGN_Notifications>> LoadCompleteList(IQueryable<UserNotificationEntity> query)
        {
            return query.Select(p => new JGN_Notifications
            {
                id = p.notification.id,
                sender_id = p.notification.sender_id,
                notification_type = p.notification.notification_type,
                title = p.notification.title,
                body = p.notification.body,
                href = p.notification.href,
                recipient_id = p.notification.recipient_id,
                created_time = p.notification.created_time,
                is_unread = p.notification.is_unread,
                is_hidden = p.notification.is_hidden,
                from = new ApplicationUser()
                {
                    Id = p.from.Id,
                    firstname = p.from.firstname,
                    lastname = p.from.lastname,
                    picturename = p.from.picturename
                }
            }).ToListAsync();
        }

        private static IQueryable<UserNotificationEntity> prepareQuery(ApplicationDbContext context, NotificationEntity entity)
        {
            return context.JGN_Notifications
             .Join(context.AspNetusers,
                 notification => notification.sender_id,
                 from => from.Id, (notification, from) =>
                 new UserNotificationEntity
                 {
                     notification = notification,
                     from = from
                 })
             .Where(returnWhereClause(entity));
        }

        public static IQueryable<UserNotificationEntity> processOptionalConditions(IQueryable<UserNotificationEntity> collectionQuery, NotificationEntity query)
        {
            if (query.order != "")
                collectionQuery = (IQueryable<UserNotificationEntity>)collectionQuery.Sort(query.order);

            if (query.id == 0)
            {
                // skip logic
                if (query.pagenumber > 1)
                    collectionQuery = collectionQuery.Skip(query.pagesize * (query.pagenumber - 1));
                // take logic
                if (!query.loadall)
                    collectionQuery = collectionQuery.Take(query.pagesize);
            }

            return collectionQuery;
        }

        private static System.Linq.Expressions.Expression<Func<UserNotificationEntity, bool>> returnWhereClause(NotificationEntity entity)
        {
            var where_clause = PredicateBuilder.New<UserNotificationEntity>(true);

            if (entity.id > 0)
                where_clause = where_clause.And(p => p.notification.id == entity.id);

            if (entity.RecipentID != "")
                where_clause = where_clause.And(p => p.notification.recipient_id == entity.RecipentID);

            // load unread
            if (!entity.isRead)
                where_clause = where_clause.And(p => p.notification.is_unread == 1);
            //else
            //    where_clause = where_clause.And(p => p.notification.is_unread == 0);*/

            // load visible notifications
            where_clause = where_clause.And(p => p.notification.is_hidden == 0);

            return where_clause;
        }
    }

    public class UserNotificationEntity
    {
        public JGN_Notifications notification { get; set; }
        public ApplicationUser from { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright WorkScene
 * For more information email at mweb@workscene.com
 */

