
namespace Jugnoon.Blogs.Settings
{
    public class Aws
    {
        /// <summary>
        /// Setup bucketname for storing article photos
        /// </summary>
        public string bucket { get; set; }

        /// <summary>
        /// Setup directory (within bucket) for saving generate blog thumbnails e.g blogs/thumbs/
        /// </summary>
        public string thumb_directory_path { get; set; }

        /// <summary>
        /// Setup directory (within bucket) for saving blog covers and slider images e.g blogs/covers/
        /// </summary>
        public string midthumb_directory_path { get; set; }

        /// <summary>
        /// Setup directory (within bucket) for saving original blog images e.g blogs/images/
        /// </summary>
        public string original_directory_path { get; set; }

        /// <summary>
        /// Setup public accessible cloudfront distribution url for streaming photos
        /// </summary>
        public string cdn_URL { get; set; }

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
