namespace Jugnoon.Settings
{
    public class Zendesk
    {
        /// <summary>
        /// Toggle on | off zendesk support
        /// </summary>
        public bool enable { get; set; }

        /// <summary>
        /// Setup zendesk url for authorization
        /// </summary>
        public string url { get; set; }

        /// <summary>
        /// Setup zendesk username for authorization
        /// </summary>
        public string user { get; set; }

        /// <summary>
        /// Setup zendesk token for authorization
        /// </summary>
        public string token { get; set; }

        /// <summary>
        /// Setup zendesk locale e.g en-us
        /// </summary>
        public string locale { get; set; }
    }
}
