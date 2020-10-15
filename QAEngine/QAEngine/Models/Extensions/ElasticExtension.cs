using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jugnoon.Models.Extensions
{
    public static class ElasticsearchExtensions
    {
        public static void AddElasticsearch(this IServiceCollection services, IConfiguration configuration)
        {
            var url = configuration["elasticsearch:url"];
            var defaultIndex = configuration["elasticsearch:index"];

            var settings = new ConnectionSettings(new Uri(url))
                .DefaultIndex(defaultIndex)
                /*.DefaultMappingFor<Post>(m => m
                    .Ignore(p => p.IsPublished)
                    .PropertyName(p => p.ID, "id")
                )
                .DefaultMappingFor<Comment>(m => m
                    .Ignore(c => c.Email)
                    .Ignore(c => c.IsAdmin)
                    .PropertyName(c => c.ID, "id")
                )*/;
            settings.BasicAuthentication(configuration["elasticsearch:username"], configuration["elasticsearch:password"]);
            var client = new ElasticClient(settings);

            services.AddSingleton<IElasticClient>(client);
        }
    }
}
