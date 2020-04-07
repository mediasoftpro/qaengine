using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Jugnoon.Core
{
    public static class RouteConfig
    {
        public static IEndpointRouteBuilder Use(IEndpointRouteBuilder routeBuilder)
        {
           

          

            #region User Profile
            routeBuilder.MapControllerRoute(
                    null,
                    "user/profile/{username}",
                    defaults: new { controller = "user", action = "profile" }

                );
           
            routeBuilder.MapControllerRoute(
               null,
               "user/qa/{username}",
               defaults: new { controller = "user", action = "qa" }

           );
           routeBuilder.MapControllerRoute(
                   null,
                   "user/qa/{username}/{id}",
                   defaults: new { controller = "user", action = "qa" }
           );

            routeBuilder.MapControllerRoute(
                null,
                "user/{username}",
                defaults: new { controller = "user", action = "Index" }

             );
            #endregion

          

            #region qa
            routeBuilder.MapControllerRoute(
                    null,
                    "qa/ask/",
                    defaults: new { controller = "qa", action = "ask" }
             );

            routeBuilder.MapControllerRoute(
                    null,
                    "qa/remove/",
                    defaults: new { controller = "qa", action = "remove" }
                    
            );
            routeBuilder.MapControllerRoute(
                    null,
                    "qa/ask/{id}",
                    defaults: new { controller = "qa", action = "ask" }
                    
             );
            // qa category processing routes
            routeBuilder.MapControllerRoute(
                     null,
                     "qa/category/filter/{title}/{filter}",
                     defaults: new { controller = "qa", action = "category" }
                     
              );
            routeBuilder.MapControllerRoute(
                   null,
                   "qa/category/filter/{title}/{filter}/{pagenumber}",
                   defaults: new { controller = "qa", action = "category" }
                   
            );

            routeBuilder.MapControllerRoute(
                      null,
                      "qa/category/filter/{title}/{filter}/{order}",
                      defaults: new { controller = "qa", action = "category" }
                      
            );

            routeBuilder.MapControllerRoute(
                  null,
                  "qa/category/filter/{title}/{filter}/{order}/{pagenumber}",
                  defaults: new { controller = "qa", action = "category" }
                  
            );

            routeBuilder.MapControllerRoute(
                    null,
                    "qa/category/{title}/{order}",
                    defaults: new { controller = "qa", action = "category" }
                    
              );
            routeBuilder.MapControllerRoute(
                  null,
                  "qa/category/{title}/{order}/{pagenumber}",
                  defaults: new { controller = "qa", action = "category" }
                  
            );

            routeBuilder.MapControllerRoute(
                   null,
                   "qa/category/{title}",
                   defaults: new { controller = "qa", action = "category" }
                   
            );

            routeBuilder.MapControllerRoute(
                 null,
                 "qa/category/{title}/{pagenumber}",
                 defaults: new { controller = "qa", action = "category" }
                 
            );


            routeBuilder.MapControllerRoute(
                  null,
                  "qa/label/filter/{title}/{filter}",
                  defaults: new { controller = "qa", action = "label" }
                  
            );
            routeBuilder.MapControllerRoute(
                  null,
                  "qa/label/filter/{title}/{filter}/{pagenumber}",
                  defaults: new { controller = "qa", action = "label" }
                  
            );
            routeBuilder.MapControllerRoute(
                 null,
                 "qa/label/filter/{title}/{filter}/{order}",
                 defaults: new { controller = "qa", action = "label" }
                 
            );
            routeBuilder.MapControllerRoute(
                  null,
                  "qa/label/filter/{title}/{filter}/{order}/{pagenumber}",
                  defaults: new { controller = "qa", action = "label" }
                  
            );
            routeBuilder.MapControllerRoute(
               null,
               "qa/label/{title}/{order}/{pagenumber}",
               defaults: new { controller = "qa", action = "label" }
               
            );
            routeBuilder.MapControllerRoute(
               null,
               "qa/label/{title}/{order}",
               defaults: new { controller = "qa", action = "label" }
               
            );
            routeBuilder.MapControllerRoute(
               null,
               "qa/label/{title}/{order}/{pagenumber}",
               defaults: new { controller = "qa", action = "label" }
            );

            routeBuilder.MapControllerRoute(
               null,
               "qa/label/{title}",
               defaults: new { controller = "qa", action = "label" }
            );

            routeBuilder.MapControllerRoute(
               null,
               "qa/label/{title}/{pagenumber}",
               defaults: new { controller = "qa", action = "label" }
            );
            
            routeBuilder.MapControllerRoute(
               null,
               "qa/archive/{month}/{year}/{order}",
               defaults: new { controller = "qa", action = "archive" }
            );

            routeBuilder.MapControllerRoute(
               null,
               "qa/archive/{month}/{year}/{order}/{pagenumber}",
               defaults: new { controller = "qa", action = "archive" }
            );

            routeBuilder.MapControllerRoute(
              null,
              "qa/archive/{month}/{year}",
              defaults: new { controller = "qa", action = "archive" }
              
           );

            routeBuilder.MapControllerRoute(
               null,
               "qa/archive/{month}/{year}/{pagenumber}",
               defaults: new { controller = "qa", action = "archive" }
            );

            routeBuilder.MapControllerRoute(
                  null,
                  "qa/categories",
                  defaults: new { controller = "qa", action = "categories" }
                  
            );
            routeBuilder.MapControllerRoute(
                  null,
                  "qa/categories/{pagenumber}",
                  defaults: new { controller = "qa", action = "categories" }
                  
            );

            routeBuilder.MapControllerRoute(
                  null,
                  "qa/archivelist",
                  defaults: new { controller = "qa", action = "archivelist" }
                  
            );

            routeBuilder.MapControllerRoute(
                  null,
                  "qa/labels",
                  defaults: new { controller = "qa", action = "labels" }
                  
            );
            routeBuilder.MapControllerRoute(
                  null,
                  "qa/labels/{pagenumber}",
                  defaults: new { controller = "qa", action = "labels" }
                  
            );
            routeBuilder.MapControllerRoute(
                  null,
                  "qa/labels/search/{term}",
                  defaults: new { controller = "qa", action = "labels" }
                  
            );
            routeBuilder.MapControllerRoute(
                  null,
                  "qa/labels/search/{term}/{pagenumber}",
                  defaults: new { controller = "qa", action = "labels" }
                  
            );

            routeBuilder.MapControllerRoute(
                   null,
                   "qa/queryresult",
                   defaults: new { controller = "qa", action = "queryresult" }
                   
            );

            routeBuilder.MapControllerRoute(
                  null,
                  "qa/search/filter/{filter}/{term}",
                  defaults: new { controller = "qa", action = "search" }
                  
              );

            routeBuilder.MapControllerRoute(
                null,
                "qa/search/filter/{filter}/{term}/{pagenumber}",
                defaults: new { controller = "qa", action = "search" }
                
            );

            routeBuilder.MapControllerRoute(
                null,
                "qa/search/{term}",
                defaults: new { controller = "qa", action = "search" }
                
            );

            routeBuilder.MapControllerRoute(
                null,
                "qa/search/{term}/{pagenumber}",
                defaults: new { controller = "qa", action = "search" }
                
            );


            routeBuilder.MapControllerRoute(
                null,
                "qa/page/{pagenumber}",
                defaults: new { controller = "qa", action = "Index" }
                
            );

            routeBuilder.MapControllerRoute(
                null,
                "qa/added/{filter}",
                defaults: new { controller = "qa", action = "Index" }
                
            );

            routeBuilder.MapControllerRoute(
                   null,
                   "qa/added/{filter}/{pagenumber}",
                   defaults: new { controller = "qa", action = "Index" }
                   
             );

            routeBuilder.MapControllerRoute(
                 null,
                 "qa/{order}",
                 defaults: new { controller = "qa", action = "Index" }
                 
            );

            routeBuilder.MapControllerRoute(
                 null,
                 "qa/{order}/{pagenumber}",
                 defaults: new { controller = "qa", action = "Index" }
                 
            );

            routeBuilder.MapControllerRoute(
                null,
                "qa/",
                defaults: new { controller = "qa", action = "Index" }
            );

            #endregion

            #region Question

            routeBuilder.MapControllerRoute(
                    null,
                    "question/editanswer/{qid}/{id}",
                    defaults: new { controller = "question", action = "editanswer" }
                    
                );

            routeBuilder.MapControllerRoute(
                     null,
                     "question/{pid}/{title}/{id}",
                     defaults: new { controller = "question", action = "Index" }
                     
                 );

            routeBuilder.MapControllerRoute(
                     null,
                     "question/{pid}/{title}",
                     defaults: new { controller = "question", action = "Index" }
                     
                 );

            #endregion

          

            routeBuilder.MapControllerRoute(
                name: "ActionApi",
                pattern: "api/{controller}/{action}/{name?}"
            );

            routeBuilder.MapControllerRoute(
                null,
                "/account/{*url}",
                defaults: new { controller = "account", action = "Index" }
           );

            routeBuilder.MapControllerRoute(
              null,
              "/admin/{*url}",
              defaults: new { controller = "admin", action = "Index" }
            );

            routeBuilder.MapFallbackToController("account/", "Index", "account");
            routeBuilder.MapFallbackToController("admin/", "Index", "admin");

            // default root
            routeBuilder.MapControllerRoute(
                 null,
                 "/{page}",
                 defaults: new { controller = "Home", action = "Index" }
            );

            routeBuilder.MapControllerRoute(
                   name: "default",
                   pattern: "{controller=Home}/{action=Index}/{id?}");


            return routeBuilder;
        }
    }
    
    public static class InitRouteControllerConfig
    {
        public static IEndpointRouteBuilder Use(IEndpointRouteBuilder routeBuilder)
        {
            routeBuilder.MapControllerRoute(
                            name: "default",
                            pattern: "{controller=Installation}/{action=Index}/{id?}");

            return routeBuilder;
        }
    }
}
