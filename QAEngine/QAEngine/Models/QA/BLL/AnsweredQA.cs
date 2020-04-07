using Jugnoon.Framework;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jugnoon.Models;

namespace Jugnoon.qa
{
    public class AnsweredQA
    {
        public static Task<List<JGN_Qa>> LoadItems(ApplicationDbContext context, QAEntity entity)
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
                .Join(context.JGN_QAnswers,
                 qa => qa.qa.id,
                 answer => answer.id, (qa, answer) => new QAQueryEntity { qa = qa.qa, user = qa.user, answer = answer })
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
