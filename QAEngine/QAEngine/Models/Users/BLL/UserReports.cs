using Jugnoon.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Jugnoon.Entity;
using System;
using Jugnoon.Utility;

/// <summary>
/// Reporting API - Business Layer Designed for Videos. 
/// </summary>
/// 
namespace Jugnoon.BLL
{
    public class UserReports
    {
        public static async Task<GoogleChartEntity> GenerateReport(ApplicationDbContext context, MemberEntity entity)
        {
            if (entity.groupbyType == ChartGroupBy.Day)
                return await GroupByDay(context, entity);
            else if (entity.groupbyType == ChartGroupBy.Month)
                return await GroupByMonth(context, entity);
            else
                return await GroupByYear(context, entity);
        }

        public static async Task<GoogleChartEntity> GroupByDay(ApplicationDbContext context, MemberEntity entity)
        {
            var reportData = await context.AspNetusers
                .Where(UserBLL.returnWhereClause(entity))
                .GroupBy(o => new
                {
                    day = o.created_at.Day
                })
                .Select(g => new ReportEntity
                {
                    Day = g.Key.day,
                    Total = g.Count()
                })
                .OrderBy(a => a.Day)
                .ToListAsync();

            var newObject = new { role = "style" };
            var data = new GoogleChartEntity()
            {
                chartType = entity.chartType,
                dataTable = new List<dynamic[]>
                {
                   new dynamic[] { "Day", "Posted Blogs", newObject },
                }
            };

            data.report = reportData;
            foreach (var item in reportData)
            {
                data.dataTable.Add(new dynamic[] { item.Year.ToString(), item.Total, "color: #76A7FA" });
            }

            return data;
        }

        public static async Task<GoogleChartEntity> GroupByMonth(ApplicationDbContext context, MemberEntity entity)
        {
            var reportData = await context.AspNetusers
                .Where(UserBLL.returnWhereClause(entity))
                .GroupBy(o => new
                {
                    month = o.created_at.Month
                })
                .Select(g => new ReportEntity
                {
                    Month = g.Key.month,
                    Total = g.Count()
                })
                .OrderBy(a => a.Month)
                .ToListAsync();

            var newObject = new { role = "style" };
            var data = new GoogleChartEntity()
            {
                chartType = entity.chartType,
                dataTable = new List<dynamic[]>
                {
                   new dynamic[] { "Month", "Users", newObject },
                   new dynamic[] { "Copper", 8.94, "#b87333" },
                   new dynamic[] { "Silver", 10.49, "silver" },
                   new dynamic[] { "Gold", 19.30, "gold" },
                }
            };

            data.report = reportData;
            foreach (var item in reportData)
            {
                // data.dataTable.Add(new dynamic[] { item.Year.ToString(), item.Total, "color: #76A7FA" });
            }

            return data;
        }

        public static async Task<GoogleChartEntity> GroupByYear(ApplicationDbContext context, MemberEntity entity)
        {
            var reportData = await context.AspNetusers
                .Where(UserBLL.returnWhereClause(entity))
                .GroupBy(o => new
                {
                    year = o.created_at.Year
                })
                .Select(g => new ReportEntity
                {
                    Year = g.Key.year,
                    Total = g.Count()
                })
                .OrderBy(a => a.Year)
                .ToListAsync();

            var newObject = new { role = "style" };
            var data = new GoogleChartEntity()
            {
                chartType = entity.chartType,
                dataTable = new List<dynamic[]>
                {
                   new dynamic[] { "Month", "Users", newObject },
                }
            };

            data.report = reportData;
            foreach (var item in reportData)
            {
                data.dataTable.Add(new dynamic[] { item.Year.ToString(), item.Total, "color: #76A7FA" });
            }

            return data;
        }

        public static async Task<GoogleChartEntity> YearlyReport(ApplicationDbContext context, MemberEntity entity)
        {
            var reportData = await context.AspNetusers
                     .GroupBy(o => new
                     {
                         year = o.created_at.Year
                     })
                     .Select(g => new ReportEntity
                     {
                         Year = g.Key.year,
                         Total = g.Count()
                     })
                     .OrderBy(a => a.Year)
                     .ToListAsync();

            var newObject = new { role = "style" };
            var data = new GoogleChartEntity()
            {
                chartType = entity.chartType,
                dataTable = new List<dynamic[]>
                {
                   new dynamic[] { "Year", "Users", newObject },
                }
            };

            foreach (var item in reportData)
            {
                data.dataTable.Add(new dynamic[] { item.Year.ToString(), item.Total, "color: #76A7FA" });
            }

            return data;
        }

        public static async Task<GoogleChartEntity> Last12MonthsReport(ApplicationDbContext context, MemberEntity entity)
        {
            var reportData = await context.AspNetusers
                     .Where(p => p.created_at >= DateTime.Now.AddYears(-1))
                     .GroupBy(o => new
                     {
                         month = o.created_at.Month,
                         year = o.created_at.Year
                     })
                     .Select(g => new ReportEntity
                     {
                         Year = g.Key.year,
                         Month = g.Key.month,
                         Total = g.Count()
                     })
                     .OrderBy(a => a.Year)
                     .ToListAsync();

            var newObject = new { role = "style" };
            var data = new GoogleChartEntity()
            {
                chartType = entity.chartType,
                dataTable = new List<dynamic[]>
                {
                   new dynamic[] { "Month", "Posted Topics", newObject },
                }
            };

            foreach (var item in reportData)
            {
                data.dataTable.Add(new dynamic[] { item.Year.ToString(), item.Total, "color: #76A7FA" });
            }

            return data;
        }

        public static async Task<GoogleChartEntity> CurrentMonthReport(ApplicationDbContext context, MemberEntity entity)
        {
            try
            {
                var reportData = await context.AspNetusers
                    .Where(p => p.created_at >= DateTime.Now.AddDays(-31))
                    .GroupBy(x => x.created_at.Day)
                    .Select(g => new ReportEntity
                    {
                        Day = g.Key,
                        Total = g.Count()
                    })
                    .OrderBy(a => a.Day)
                    .ToListAsync();

                var newObject = new { role = "style" };
                var data = new GoogleChartEntity()
                {
                    chartType = entity.chartType,
                    dataTable = new List<dynamic[]>
                {
                   new dynamic[] { "Day", "Posted Topics", newObject },
                }
                };

                foreach (var item in reportData)
                {
                    data.dataTable.Add(new dynamic[] { item.Year.ToString(), item.Total, "color: #76A7FA" });
                }

                return data;
            }
            catch (Exception ex)
            {
                var error = ex.Message;
            }

            return new GoogleChartEntity();
        }


    }

}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
