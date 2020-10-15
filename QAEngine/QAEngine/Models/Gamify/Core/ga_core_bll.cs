using Jugnoon.Framework;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Jugnoon.Gamify
{
    public class ga_core_bll
    {
        /// <summary>
        /// Core Badge, Reward, Level, Points, Credits, Package Processing Unit
        /// </summary>
        /// 
        public static void Trigger_Item(ApplicationDbContext dbCtx, string userID, int itemID)
        {
            //******************************************************************'
            // LOAD BADGE INFORMATION'
            //******************************************************************'
            var badge_Info = dbCtx.JGN_Badges.Where(p => p.id.Equals(itemID)).FirstOrDefault();
            //******************************************************************'
            // PROCESS USER LEVELS, CREDITS,
            //******************************************************************'
            var user_Info = dbCtx.JGN_User_Levels.Where(p => p.userid.Equals(userID)).FirstOrDefault();
            if (badge_Info.type == 3)
            {
                //******************************************************************'
                // LEVEL UP'
                //******************************************************************'
                //Update user level information'
                var query = (IQueryable<JGN_User_Levels>)dbCtx.JGN_User_Levels
                    .Where(p => p.userid == userID);

                var item = query.FirstOrDefault<JGN_User_Levels>();

                item.levels = badge_Info.ilevel;
                item.init_points = 0;   //reset to zero for new level calculation'
                item.max_points = Convert.ToInt16(badge_Info.xp);   //maximum points required to cross this level'
                item.level_id = badge_Info.id; // assign allocated id for future processing'

                dbCtx.SaveChanges();

                //******************************************************************'
                // Check whether there is any reward associated with this level
                //*******************************************************************/
                var level_associate_output = dbCtx.JGN_Badges_LevelAssociates.Where(p => p.levelid.Equals(itemID)).ToList();
                if (level_associate_output.Count > 0)
                {
                    foreach (var itm in level_associate_output)
                    {
                        //' recursive call this function to award this reward
                        Trigger_Item(dbCtx, userID, itm.rewardid);
                    }
                }
            }
            else if (badge_Info.type == 4)
            {
                //******************************************************************'
                // POINTS'
                //******************************************************************'
                var CurrentPoints = user_Info.points;
                var InitPoints = user_Info.init_points;

                if (badge_Info.isdeduct == 1)
                {
                    //Deduct Points'
                    CurrentPoints = Convert.ToInt16(CurrentPoints - badge_Info.xp);
                    if (CurrentPoints < 0)
                    {
                        CurrentPoints = 0;
                    }
                    InitPoints = Convert.ToInt16(InitPoints - badge_Info.xp);
                    if (InitPoints < 0)
                    {
                        InitPoints = 0;
                    }
                }
                else
                {
                    //Increment Points'
                    CurrentPoints = Convert.ToInt16(CurrentPoints + badge_Info.xp);
                    InitPoints = Convert.ToInt16(InitPoints + badge_Info.xp);
                }
                var query = (IQueryable<JGN_User_Levels>)dbCtx.JGN_User_Levels
                    .Where(p => p.userid == userID);

                var item = query.FirstOrDefault<JGN_User_Levels>();

                item.points = CurrentPoints;
                item.init_points = InitPoints;

                dbCtx.SaveChanges();

                if (InitPoints > user_Info.max_points)
                {
                    //Level Up'
                    //Check whether level exist'
                    int CurrentLevel = user_Info.levels;
                    var NextLevel = CurrentLevel + 1;
                    //Load Next Level Data
                    var LevelInfo = dbCtx.JGN_Badges.Where(p => p.ilevel.Equals(NextLevel)).ToList();
                    if (LevelInfo.Count > 0)
                    {
                        //Level Exist'
                        var lexit = dbCtx.JGN_User_Levels.Where(p => p.userid.Equals(userID)).FirstOrDefault();
                        lexit.levels = Convert.ToInt16(NextLevel);
                        lexit.init_points = 0;   //reset to zero for new level calculation'
                        lexit.max_points = Convert.ToInt16(LevelInfo[0].xp);   //maximum points required to cross this level'
                        lexit.level_id = LevelInfo[0].id; // assign allocated id for future processing'

                        dbCtx.SaveChanges();
                        //******************************************************************'
                        // Check whether there is any reward associated with this level
                        //*******************************************************************/
                        var _id = LevelInfo[0].id;
                        var level_associate_output = dbCtx.JGN_Badges_LevelAssociates.Where(p => p.levelid.Equals(_id)).ToList();
                        if (level_associate_output.Count > 0)
                        {
                            foreach (var itm in level_associate_output)
                            {
                                //' recursive call this function to award this reward
                                Trigger_Item(dbCtx, userID, itm.rewardid);
                            }
                        }
                    }
                }
            }
            else if (badge_Info.type == 5)
            {
                //******************************************************************'
                // CREDITS '
                //******************************************************************'
                var CurrentCredits = user_Info.credits;
                if (badge_Info.isdeduct == 1)
                {
                    //Deduct Credits'
                    CurrentCredits = Convert.ToInt16(CurrentCredits - badge_Info.credits);
                    if (CurrentCredits < 0)
                    {
                        CurrentCredits = 0;
                    }
                }
                else
                {
                    //Increment Points'
                    CurrentCredits = Convert.ToInt16(CurrentCredits + badge_Info.credits);
                }

                var updatecredits = dbCtx.JGN_User_Levels.Where(p => p.userid.Equals(userID)).FirstOrDefault();
                updatecredits.credits = CurrentCredits;

                dbCtx.SaveChanges();

            }
            else
            {
                //******************************************************************'
                // BADGE, REWARD, PACKAGE '
                //******************************************************************'

                //******************************************************************'
                // Associate Badge or Reward or Package with User
                //******************************************************************'
                var badge_data = new JGN_User_Badges();
                badge_data.userid = userID;
                badge_data.badge_id = badge_Info.id;
                switch (badge_Info.type)
                {
                    case 1:
                        // type : badge
                        badge_data.type = 1;
                        break;
                    case 2:
                        // type : reward'
                        badge_data.type = 2;
                        break;
                    case 6:
                        // type: package'
                        badge_data.type = 3;
                        break;
                }

                //'check whether user already award badge, if not marketd as multiple (award multiple times)
                if (badge_Info.ismultiple == 1)
                {
                    // award multiple times
                    var count = dbCtx.JGN_User_Badges.Where(o => o.userid == userID && o.badge_id == badge_Info.id).Count();
                    if (count == 0)
                    {
                        dbCtx.Entry(badge_data).State = EntityState.Added;
                    }
                    else
                    {
                        //update occurences of existing awarded badge if exist
                        var update_user_badge_entity = dbCtx.JGN_User_Badges.Where(p => p.userid.Equals(userID) && p.badge_id.Equals(itemID)).FirstOrDefault();
                        var repeated_badge = update_user_badge_entity.repeated;
                        repeated_badge = Convert.ToInt16(repeated_badge + 1);
                        update_user_badge_entity.repeated = repeated_badge;

                        dbCtx.SaveChanges();

                    }
                    //' process physical code related to selected reward.
                    call_phycical_function(badge_Info.type, badge_Info.id, userID);
                }
                else
                {
                    // award single time
                    var count = dbCtx.JGN_User_Badges.Where(o => o.userid.Equals(userID) && o.badge_id.Equals(itemID)).Count();
                    if (count == 0)
                    {
                        dbCtx.Entry(badge_data).State = EntityState.Added;
                        dbCtx.SaveChanges();
                        //' process physical code related to selected reward.
                        call_phycical_function(badge_Info.type, badge_Info.id, userID);
                    }
                }

                if (badge_Info.type == 6)
                {
                    //// package, credit package allocated credits to user
                    var CurrentCredits = user_Info.credits;
                    CurrentCredits = Convert.ToInt16(CurrentCredits + badge_Info.credits);
                    IQueryable<JGN_User_Levels> query = (IQueryable<JGN_User_Levels>)dbCtx.JGN_User_Levels
                    .Where(p => p.userid == userID);

                    var item = query.FirstOrDefault<JGN_User_Levels>();

                    item.credits = CurrentCredits;

                    dbCtx.SaveChanges();
                }
            }
            //******************************************************************'
            // Update User Achievements / History
            //******************************************************************'

            if (!string.IsNullOrEmpty(badge_Info.notification))
            {
                var user_history_data = new JGN_Badges_User_Achievements();
                string value = "";
                switch (badge_Info.type)
                {
                    case 1:
                        // type : badge
                        value = badge_Info.title;
                        // badge name as value'
                        break;
                    case 2:
                        // type : reward'
                        value = badge_Info.title;
                        // reward name as value'
                        break;
                    case 3:
                        // type : level'
                        value = badge_Info.ilevel.ToString();
                        // level value as value'
                        break;
                    case 4:
                        // type: points'
                        value = badge_Info.xp.ToString();
                        //xp points as value'
                        break;
                    case 5:
                        // type: credits'
                        value = badge_Info.credits.ToString();
                        //credits as value'
                        break;
                    case 6:
                        // type: package'
                        value = badge_Info.title;
                        //package name as value'
                        break;
                }
                user_history_data.userid = userID;
                user_history_data.description = ga_utility.Prepare_Data(badge_Info.notification, value);
                user_history_data.created_at = DateTime.Now;
                user_history_data.type = badge_Info.type;

                dbCtx.Entry(user_history_data).State = EntityState.Added;
                dbCtx.SaveChanges();
            }

        }

        private static void call_phycical_function(int type, int rewardid, string userid)
        {
            /*if (type == 2) {
                process_reward_features.Process(rewardid, userid);
            }*/
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */



