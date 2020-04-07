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
/// Category Filtering API - Business Layer Designed for QA. 
/// It support filtering asked questions based on category name, categoryid, or array of category lists.
/// It supports only public videos but you can extend its filter logics based on your requirements.
/// </summary>
namespace Jugnoon.qa
{
    public class CategorizeQa
    {
        public static Task<List<JGN_Qa>> LoadItems(ApplicationDbContext context, QAEntity entity)
        {
            if (!entity.iscache 
                || Jugnoon.Settings.Configs.GeneralSettings.cache_duration == 0 
                || entity.pagenumber > Jugnoon.Settings.Configs.GeneralSettings.max_cache_pages)
            {
                return Load_Raw(context, entity);
            }
            else
            {
                string key = QABLL.GenerateKey("lg_qa_cat_", entity);
                var data = new List<JGN_Qa>();
                if (!SiteConfig.Cache.TryGetValue(key, out data))
                {
                    data = Load_Raw(context, entity).Result;

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
        private static Task<List<JGN_Qa>> Load_Raw(ApplicationDbContext context, QAEntity entity)
        {
            return QABLL.processOptionalConditions(prepareQuery(context, entity), entity)
                   .Select(QABLL.prepareSummaryList()).ToListAsync();
        }

        public static Task<int> Count(ApplicationDbContext context, QAEntity entity)
        {
            return prepareQuery(context, entity).CountAsync();
        }

        private static IQueryable<QAQueryEntity> prepareQuery(ApplicationDbContext context, QAEntity entity)
        {
            return context.JGN_Qa
             .Join(context.AspNetusers,
                  qa => qa.userid,
                  user => user.Id, (qa, user) => new { qa, user })
             .Join(context.JGN_CategoryContents,
                 qa => qa.qa.id,
                 qa_category => qa_category.contentid, (qa, qa_category) => new { qa, qa_category })
             .Join(context.JGN_Categories,
                 qa_category => qa_category.qa_category.categoryid,
                 category => category.id, (qa_category, category) =>
                 new QAQueryEntity
                 {
                     qa = qa_category.qa.qa,
                     qa_category = qa_category.qa_category,
                     category = category,
                     user = qa_category.qa.user
                 })
             .Where(QABLL.returnWhereClause(entity));
        }
    }

}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
