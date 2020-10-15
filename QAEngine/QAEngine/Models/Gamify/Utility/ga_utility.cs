using System.Text.RegularExpressions;
namespace Jugnoon.Gamify
{
    public class ga_utility
    {
        public static string Prepare_Data(string input, string value)
        {
            return Regex.Replace(input, "\\[value\\]", value);
        }

    }

}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */


