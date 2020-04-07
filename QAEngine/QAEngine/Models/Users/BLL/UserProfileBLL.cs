using Jugnoon.Framework;
using LinqKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Jugnoon.Entity;
using Jugnoon.Models;
/// <summary>
/// Core User Profile Data Access / Business Layer Designed for User Profiles (Retrieving Complete User Profile). 
/// </summary>
namespace Jugnoon.BLL
{
    public class UserProfileBLL
    {
        public static async Task InitializeUserProfile(ApplicationDbContext context, ApplicationUser entity)
        {
            // Initialize User Stats
            await UserStatsBLL.Add(context, new JGN_User_Stats() { userid = entity.Id });
            // Initialize User Settings
            await UserSettingsBLL.Add(context, new JGN_User_Settings() { userid = entity.Id, isemail = 1, issendmessages = 1 }); // activate both isemail / issendmessages enabled until having custom requirements.
         
        }

        public static async Task DropUserProfile(ApplicationDbContext context, ApplicationUser entity)
        {
            // Delete User Stats
            await UserStatsBLL.Delete(context, entity.Id);
            // Delete User Settings
            await UserSettingsBLL.Delete(context, entity.Id);
           
        }
    
        public static Task<List<ApplicationUser>> LoadItems(ApplicationDbContext context, MemberEntity entity)
        {
            return Return_NormalList(context, entity);
        }

        /// <summary>
        /// List data designed for normal content listing purpose
        /// </summary>
        /// <param name="context"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        private static Task<List<ApplicationUser>> Return_NormalList(ApplicationDbContext context, MemberEntity entity)
        {
            return processOrder(prepareQuery(context, entity), entity)
                  .Select(p => new ApplicationUser
                  {
                      Id = p.user.Id,
                      UserName = p.user.UserName,
                      Email = p.user.Email,
                      firstname = p.user.firstname,
                      lastname = p.user.lastname,
                      created_at = p.user.created_at,
                      views = p.user.views,
                      picturename = p.user.picturename,
                      isenabled = p.user.isenabled,
                      EmailConfirmed = p.user.EmailConfirmed,
                      LockoutEnabled = p.user.LockoutEnabled,
                      last_login = p.user.last_login,
                      type = p.user.type,
                      roleid = p.user.roleid,
                      stats = new JGN_User_Stats()
                      {
                          stat_qa = p.stats.stat_qa,
                          stat_qaanswers = p.stats.stat_qaanswers
                      },
                      settings = new JGN_User_Settings()
                      {
                          isemail = p.settings.isemail,
                          issendmessages = p.settings.issendmessages
                      }
                  }).ToListAsync();
        }
        public static Task<int> Count(ApplicationDbContext context, MemberEntity entity)
        {
            return prepareQuery(context, entity).CountAsync();
        }

        private static IQueryable<UserProfileEntity> prepareQuery(ApplicationDbContext context, MemberEntity entity)
        {
            return context.AspNetusers
             .Join(context.JGN_User_Stats,
                 user => user.Id,
                 stats => stats.userid, (user, stats) => new { user, stats })
             .Join(context.JGN_User_Settings,
                 user => user.user.Id,
                 settings => settings.userid, (user, settings) => new UserProfileEntity
                 {
                     user = user.user,
                     stats = user.stats,
                     settings = settings
                 })

             .Where(returnWhereClause(entity));
        }

        private static IQueryable<UserProfileEntity> processOrder(IQueryable<UserProfileEntity> collectionQuery, MemberEntity query)
        {
            if (query.order != "")
            {
                var orderlist = query.order.Split(char.Parse(","));
                foreach (var orderItem in orderlist)
                {
                    if (orderItem.Contains("asc") || orderItem.Contains("desc"))
                    {
                        var ordersplit = query.order.Split(char.Parse(" "));
                        if (ordersplit.Length > 1)
                        {
                            collectionQuery = AddSortOption(collectionQuery, ordersplit[0], ordersplit[1]);
                        }
                    }
                    else
                    {
                        collectionQuery = AddSortOption(collectionQuery, orderItem, "");
                    }
                }
            }
            // skip logic
            if (query.pagenumber > 1)
                collectionQuery = collectionQuery.Skip(query.pagesize * (query.pagenumber - 1));
            // take logic
            if (!query.loadall)
                collectionQuery = collectionQuery.Take(query.pagesize);

            return collectionQuery;
        }

        private static System.Linq.Expressions.Expression<Func<UserProfileEntity, bool>> returnWhereClause(MemberEntity entity)
        {
            var where_clause = PredicateBuilder.New<UserProfileEntity>(true);
            // avoid archive account information
            where_clause = where_clause.And(p => p.user.isenabled != 3);
            // public contents only
            if (entity.ispublic)
                where_clause = where_clause.And(p => p.user.isenabled == 1);
            if (entity.id != "")
                where_clause = where_clause.And(p => p.user.Id == entity.id);
            if (entity.username != "")
                where_clause = where_clause.And(p => p.user.UserName == entity.username);
            if (entity.userid != "")
                where_clause = where_clause.And(p => p.user.Id == entity.userid);
            return where_clause;
        }


        // Dynamic Sort Option
        private static IQueryable<UserProfileEntity> AddSortOption(IQueryable<UserProfileEntity> collectionQuery, string field, string direction)
        {
            var reverse = false;
            if (direction == "desc")
                reverse = true;

            return (IQueryable<UserProfileEntity>)collectionQuery.Sort(field, reverse);

        }
    }

    public class UserProfileEntity
    {
        public ApplicationUser user { get; set; }
        public JGN_User_Settings settings { get; set; }
        public JGN_User_Stats stats { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
