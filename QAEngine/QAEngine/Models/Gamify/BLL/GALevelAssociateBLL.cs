using Jugnoon.Entity;
using System.Collections.Generic;
using System.Linq;
using Jugnoon.Utility;
using Microsoft.EntityFrameworkCore;
using Jugnoon.Framework;
using LinqKit;
using System;
using System.Threading.Tasks;

namespace Jugnoon.Gamify
{
    public class GALevelAssociateBLL
    {
        public static JGN_Badges_LevelAssociates Add(ApplicationDbContext context, JGN_Badges_LevelAssociates entity)
        {            
            var _ga = new JGN_Badges_LevelAssociates()
            {
                levelid = entity.levelid,
                description = entity.description,
                rewardid = entity.rewardid
            };

            context.Entry(_ga).State = EntityState.Added;
            context.SaveChanges();
            entity.id = _ga.id;

            return entity;
        }
        public static bool RemoveAll(ApplicationDbContext context, int id)
        {
            // remove all records related to current level
            context.JGN_Badges_LevelAssociates.RemoveRange(context.JGN_Badges_LevelAssociates.Where(x => x.levelid.Equals(id)));
            return true;
        }

        public static bool Delete(ApplicationDbContext context, int id)
        {
            var filterID = id;
            var list = from s in context.JGN_Badges_LevelAssociates
                        where s.levelid.Equals(filterID)
                        select s;

            var items = list.ToList();
            // remove association
            foreach (var item in items)
            {
                // context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                context.JGN_Badges_LevelAssociates.Attach(item);
                context.JGN_Badges_LevelAssociates.Remove(item);
                context.SaveChanges();
            }

            // remove badge
            var bentity = new Jugnoon.Framework.JGN_Badges_LevelAssociates { id = id };
            context.JGN_Badges_LevelAssociates.Attach(bentity);
            context.JGN_Badges_LevelAssociates.Remove(bentity);
            context.SaveChanges();

            return true;
        }

        public static Task<List<JGN_Badges_LevelAssociates>> Load(ApplicationDbContext context,LevelAssociateEntity entity)
        {
            var collectionQuery = context.JGN_Badges_LevelAssociates.Where(returnWhereClause(entity));
            collectionQuery = processOptionalConditions(collectionQuery, entity);
            return LoadCompleteList(collectionQuery);
        }

        public static int Count(ApplicationDbContext context,LevelAssociateEntity entity)
        {
            return CountRecords(context,entity);
        }


        private static int CountRecords(ApplicationDbContext context,LevelAssociateEntity entity)
        {
            return context.JGN_Badges_LevelAssociates.Where(returnWhereClause(entity)).Count();
        }

        public static Task<List<JGN_Badges_LevelAssociates>> LoadCompleteList(IQueryable<JGN_Badges_LevelAssociates> query)
        {
            return query.Select(p => new JGN_Badges_LevelAssociates
            {
                id = (int)p.id,
                levelid = p.levelid,
                description = p.description,
                rewardid = p.rewardid
            }).ToListAsync();
        }


        public static IQueryable<JGN_Badges_LevelAssociates> processOptionalConditions(IQueryable<JGN_Badges_LevelAssociates> collectionQuery, LevelAssociateEntity query)
        {
            if (query.order != "")
                collectionQuery = (IQueryable<JGN_Badges_LevelAssociates>)collectionQuery.Sort(query.order);

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

        private static System.Linq.Expressions.Expression<Func<JGN_Badges_LevelAssociates, bool>> returnWhereClause(LevelAssociateEntity entity)
        {
            var where_clause = PredicateBuilder.New<JGN_Badges_LevelAssociates>(true);

            if (entity.rewardid > 0)
                where_clause = where_clause.And(p => p.rewardid == entity.rewardid);
            if (entity.levelid > 0)
                where_clause = where_clause.And(p => p.levelid == entity.levelid);
            if (entity.id > 0)
                where_clause = where_clause.And(p => p.id == entity.id);


            return where_clause;
        }

        public static string ProcessAction(ApplicationDbContext context,List<LevelAssociateEntity> list)
        {
            foreach (LevelAssociateEntity entity in list)
            {
                if (entity.id > 0)
                {
                    switch (entity.actionstatus)
                    {
                        case "delete":
                            Delete(context, (int)entity.id);
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

