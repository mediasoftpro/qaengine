namespace Jugnoon.Settings
{
    public class ElasticSearch
    {
        /// <summary>
        /// Toggle on | off elastic search
        /// </summary>
        public bool enable { get; set; }

        /// <summary>
        /// Set default elastic search index
        /// </summary>
        public string index { get; set; }

        /// <summary>
        /// Set default elastic search index for indexing ad listings
        /// </summary>
        public string adlisting_index { get; set; }

        /// <summary>
        /// Set default elastic search index for indexing blog posts
        /// </summary>
        public string blogs_index { get; set; }

        /// <summary>
        /// Set elastice search server url
        /// </summary>
        public string url { get; set; }

        /// <summary>
        /// Set elastice search server credential username
        /// </summary>
        public string username { get; set; }

        /// <summary>
        /// Set elastice search server credential password
        /// </summary>
        public string password { get; set; }

    }
}
