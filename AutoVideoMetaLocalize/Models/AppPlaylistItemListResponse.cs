using Google.Apis.YouTube.v3.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Models {
	public class AppPlaylistItemListResponse {
		/// <summary>
		/// A list of playlist items that match the request criteria.
		/// </summary>
		public virtual IList<PlaylistItem> Items { get; set; }

		/// <summary>
		/// The token that can be used as the value of the pageToken parameter to retrieve
		/// the next page in the result set.
		/// </summary>
		public virtual string NextPageToken { get; set; }

		/// <summary>
		/// The number of results included in the API response.
		/// </summary>
		public virtual int? ResultsPerPage { get; set; }

		/// <summary>
		/// The total number of results in the result set.
		/// </summary>
		public virtual int? TotalResults { get; set; }

		/// <summary>
		/// The token that can be used as the value of the pageToken parameter to retrieve
		/// the previous page in the result set.
		/// </summary>
		public virtual string PrevPageToken { get; set; }

	}
}
