using System;
using System.Collections.Generic;
using System.Linq;
using Jugnoon.BLL;
using Jugnoon.Utility;
using Jugnoon.Framework;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Jugnoon.Models;

namespace Jugnoon.qa
{
    public class QAnswersBLL
    {

        // Note: qanswers Important Terms

        // isEnabled:
        // ........... 0: Not Enabled.
        // ........... 1: Enabled
        // ........... 2: Both enabled, disabled

        // isapproved:
        // ........... 0: Not approved
        // ........... 1: Approved

        // isanswer
        // ............. 0: No
        // ............. 1: Yes


        #region Action Script
        public static async Task<JGN_QAnswers> Add(ApplicationDbContext context, JGN_QAnswers entity, int Answers)
        {
            if (Jugnoon.Settings.Configs.GeneralSettings.screen_content == 1)
            {
                entity.description = DictionaryBLL.Process_Screening(context, entity.description);
            }

            var _entity = new JGN_QAnswers()
            {
                id = entity.id,
                userid = entity.userid,
                qid = entity.qid,
                description = entity.description,
                created_at = DateTime.Now,
                isenabled = entity.isenabled,
                isapproved = entity.isapproved,
                isanswer = entity.isanswer
            };

            context.Entry(_entity).State = EntityState.Added;

            await context.SaveChangesAsync();
            entity.id = _entity.id;

            // update answers stats
            Answers++;
            QABLL.Update_Field_V3(context, entity.qid, Answers, "answers");
            // update stats
            // update member qanswers statistics.
            if (entity.isenabled == 1 && entity.isapproved == 1)
            {
                await Update_Stats(context, entity.userid, true);
           }

           return _entity;
        }

        // Update Information
        public static async Task<bool> Update(ApplicationDbContext context,JGN_QAnswers entity)
        {
            var item = context.JGN_QAnswers
                    .Where(p => p.id == entity.id)
                    .FirstOrDefault<JGN_QAnswers>();

            if (item != null)
            {
                item.description = UtilityBLL.processNull(entity.description, 0);

                context.Entry(item).State = EntityState.Modified;
                await context.SaveChangesAsync();
            }
            return true;
        }

        // update isanswer status of all answers of current question
        public static bool Reset_BestAnswers(ApplicationDbContext context, long Qid)
        {
                var answers = context.JGN_QAnswers.Where(p => p.id == Qid).ToList();
                answers.ForEach(a => a.isanswer = 0);
                context.SaveChanges();
            
            return true;
        }

        // Check qa answer for authorization
        public static bool Check(ApplicationDbContext context,long Aid, long Qid, string UserName)
        {
            bool flag = false;
            if (context.JGN_QAnswers.Where(p => p.id == Aid && p.id == Qid && p.userid == UserName).Count() > 0)
                 flag = true;
  
            return flag;
        }

        public static bool CheckBestAnswer(ApplicationDbContext context, long Qid)
        {
            bool flag = false;
            if (context.JGN_QAnswers.Where(p => p.id == Qid && p.isanswer == 1).Count() > 0)
                 flag = true;

            return flag;
        }

        // delete single answer
        public static async Task<bool> Delete(ApplicationDbContext context, JGN_QAnswers data)
        {
            if (data.id > 0)
            {
                var entity = new JGN_QAnswers { id = data.id };
                context.JGN_QAnswers.Attach(entity);
                context.JGN_QAnswers.Remove(entity);
                context.SaveChanges();

                // update answers stats
                if (data.answers >  0)
                {
                    data.answers--;
                    QABLL.Update_Field_V3(context, entity.qid, data.answers, "answers");
                }
               
                await Update_Stats(context, data.userid, false);
            }
            return true;
        }

        // delete all question answers
        public static async Task Delete(ApplicationDbContext context,long id)
        {
            // update answer stats
            await Update_All_qa_Ans_Member_Stats(context, id);
            context.JGN_QAnswers.RemoveRange(context.JGN_QAnswers.Where(x => x.id == id));
            await context.SaveChangesAsync();
        }

        private static async Task<bool> Update_Stats(ApplicationDbContext context, string userid, bool isincrement)
        {
            var value = await UserStatsBLL.Get_Field_Value(context, userid, "stat_qanswers");
            if (value != null && value != "")
            {
                short count = Convert.ToInt16(value);
                if (isincrement)
                    count++;
                else
                    count--;
                if (count < 0)
                    count = 0;
                await UserStatsBLL.Update_Field(context, userid, (byte)count, "stat_qanswers");
            }
            return true;
            
        }
        // Check qanswers for authorization
        public static bool Check(ApplicationDbContext context,long Aid, string UserName)
        {
            bool flag = false;
            // var context = SiteConfig.dbContext;
           
            
                if (context.JGN_QAnswers.Where(p => p.id == Aid && p.userid == UserName).Count() > 0)
                    flag = true;
            

            return flag;
        }

        // count question answers - for updating question statistics
        public static int Count(ApplicationDbContext context,long id, int isapproved, int isenabled)
        {
            int Record = 0;
            // var context = SiteConfig.dbContext;
           
            
                IQueryable<JGN_QAnswers> query = context.JGN_QAnswers.Where(p => p.id == id);
                if (isenabled != 2)
                    query = query.Where(p => p.isenabled == Convert.ToByte(isenabled));
                if (isapproved != 2)
                    query = query.Where(p => p.isapproved == Convert.ToByte(isapproved));

                Record = query.Count();

            
            return Record;
        }

        // Enable Disable qa
        /*public static bool Update_IsEnabled(ApplicationDbContext context,long id, int OldValue, int NewValue, string UserName)
        {
            Update_Field_V3(context, id, (byte)NewValue, "isEnabled");
            if (OldValue != NewValue)
            {
                short count = Convert.ToInt16(UserStatsBLL.Get_Field_Value(context, UserName, "stat_qanswers"));
                if (NewValue == 1)
                    count++;
                else
                    count--;
                UserStatsBLL.Update_Field(context, UserName, count, "stat_qanswers");
            }
            return true;
        }

        // Review / Approve / Disapprove qa
        public static bool Update_IsApproved(ApplicationDbContext context,long id, int OldValue, int NewValue, string UserName)
        {
            Update_Field_V3(context, id, (byte)NewValue, "isApproved");
            if (OldValue != NewValue)
            {
                short count = Convert.ToInt16(UserStatsBLL.Get_Field_Value(context, UserName, "stat_qanswers"));
                if (NewValue == 1)
                    count++;
                else
                    count--;
                UserStatsBLL.Update_Field(context, UserName, count, "stat_qanswers");
            }
            return true;
        }*/

        public static int Count(ApplicationDbContext context,string userid, int isenabled, int isapproved)
        {
            int Record = 0;

            IQueryable<JGN_QAnswers> query = context.JGN_QAnswers.Where(p => p.userid == userid);
            if (isenabled != 2)
                query = query.Where(p => p.isenabled == Convert.ToByte(isenabled));
            if (isapproved != 2)
                query = query.Where(p => p.isapproved == Convert.ToByte(isapproved));

            Record = query.Count();

            
            return Record;
            
        }


        public static bool Update_Field_V3(ApplicationDbContext context,long ID, dynamic Value, string FieldName)
        {
            if (ID == 0)
                return false;

            var item = context.JGN_QAnswers
                    .Where(p => p.id == ID)
                    .FirstOrDefault<JGN_QAnswers>();

            if(item != null)
            {
                foreach (var prop in item.GetType().GetProperties())
                {
                    if (prop.Name.ToLower() == FieldName.ToLower())
                    {
                        prop.SetValue(item, Value);
                    }
                    context.Entry(item).State = EntityState.Modified;
                    context.SaveChanges();
                }
            }
            return true;
        }

        public static string Get_Field_Value(ApplicationDbContext context,long ID, string FieldName)
        {
            string Value = "";
            var item = context.JGN_QAnswers
                    .Where(p => p.id == ID)
                    .FirstOrDefault<JGN_QAnswers>();

            foreach (var prop in item.GetType().GetProperties())
            {
                if (prop.Name.ToLower() == FieldName.ToLower())
                {
                    Value = prop.GetValue(item, null).ToString();
                }
            }
            return Value;
        }


        #endregion

        // Fetch single record for qa
        #region Fetch Record Script

        public static Task<List<JGN_QAnswers>> Fetch_Answers(ApplicationDbContext context, long id)
        {
               return context.JGN_QAnswers
                    .Join(context.AspNetusers,
                    answer => answer.userid,
                    user => user.Id,
                    (answer, user) => new { answer, user })
                    .Where(p => p.answer.qid == id)
                    .Select(p => new JGN_QAnswers
                    {
                        id = p.answer.id,
                        description = p.answer.description,
                        userid = p.answer.userid,
                        isanswer = p.answer.isanswer,
                        created_at = p.answer.created_at,
                        votes = p.answer.votes,
                        isenabled = p.answer.isenabled,
                        isapproved = p.answer.isapproved,
                        comments = p.answer.comments,
                        author = new ApplicationUser()
                        {
                            firstname = p.user.firstname,
                            lastname = p.user.lastname,
                            UserName = p.user.UserName,
                            picturename = p.user.picturename
                        }
                    })
                    .ToListAsync();

        }

        public static Task<List<JGN_QAnswers>> Fetch_qa_Users(ApplicationDbContext context, long id)
        {
           return context.JGN_QAnswers
                    .Join(context.AspNetusers,
                    answer => answer.userid,
                    user => user.Id,
                    (answer, user) => new { answer, user })
                    .Where(p => p.answer.qid == id)
                    .Select(p => new JGN_QAnswers
                    {                        
                        userid = p.answer.userid
                    })
                    .Distinct()
                    .ToListAsync();

        }

        // update answer stats of all qa answer UserBLL
        // no distinct because single user can post multiple answers on each question.
        public static async Task Update_All_qa_Ans_Member_Stats(ApplicationDbContext context, long id)
        {
            var _items = await context.JGN_QAnswers
                      .Where(p => p.id == id)
                      .Select(p => p.userid)
                      .ToListAsync();
            foreach (var item in _items)
            {
                await Update_Stats(context, item, false);
            }
            
           
        }
        
        public static Task<List<JGN_QAnswers>> Fetch_Answer_Info(ApplicationDbContext context, long id)
        {
            return context.JGN_QAnswers
                     .Where(p => p.id == id)
                     .Select(p => new JGN_QAnswers()
                     {
                         description = p.description,
                         userid = p.userid
                     })
                     .ToListAsync();
        }
        #endregion

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
