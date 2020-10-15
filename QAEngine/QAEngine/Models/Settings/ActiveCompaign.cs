namespace Jugnoon.Settings
{
    public class ActiveCompaign
    {
        /// <summary>
        /// Toggle on | off active compaign
        /// </summary>
        public bool enable { get; set; }

        /// <summary>
        /// Set active compaign base url for authorization
        /// </summary>
        public string BaseUri { get; set; }

        /// <summary>
        /// Set active compaign api key for authorization
        /// </summary>
        public string ApiKey { get; set; }

        /// <summary>
        /// Set default active compaign list id
        /// </summary>
        public string listId { get; set; }

        
    }
}
