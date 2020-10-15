using System;
using System.Linq;
using System.Threading.Tasks;
using Jugnoon.Framework;
using Microsoft.EntityFrameworkCore;
/// <summary>
/// Business Layer: For processing favorited user contents
/// </summary>
namespace Jugnoon.BLL
{
    public class FavoriteBLL
    {
        // Note: Important Terms
        public enum Types
        {
            QA = 70
        };
        public static async Task<bool> Add(ApplicationDbContext context,string userid, long contentid, int mediatype, int type)
        {
            context.Entry(new JGN_Favorites()
            {
                contentid = contentid,
                userid = userid,
                created_at = DateTime.Now,
                type = (byte)type
            }).State = EntityState.Added;

            await context.SaveChangesAsync();

            await Update_Fav_Stats(context, userid, mediatype, type, 0);
            return true;
        }

        public static async Task<bool> Delete(ApplicationDbContext context, long contentid, string userid, byte mediatype, int type)
        {
            var all = from c in context.JGN_Favorites where c.contentid == contentid && c.userid == userid && c.type == type select c;
            context.JGN_Favorites.RemoveRange(all);
            await context.SaveChangesAsync();
            await Update_Fav_Stats(context, userid, mediatype, type, 1);

            return true;
        }

        private static async Task Update_Fav_Stats(ApplicationDbContext context, string username, int mediatype, int type, int action)
        {
            string _field = "stat_qa_fav";
            switch (type)
            {
                case 70:
                    // qa
                    _field = "stat_qa_fav";
                    break;
            }
            int count = Convert.ToInt32(UserStatsBLL.Get_Field_Value(context, username, _field));
            if (action == 0)
                count++;
            else
                count--;
            await UserStatsBLL.Update_Field(context, username, count, _field);

        }

        public static async Task<bool> Check(ApplicationDbContext context,string userid, long contentid, int type)
        {
            bool flag = false;

                if (await context.JGN_Favorites.Where(p => p.contentid == contentid && p.userid == userid && p.type == type).CountAsync() > 0)
                    flag = true;
           
            return flag;

        }

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
