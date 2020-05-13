using Google.Apis.YouTube.v3;
using static Google.Apis.YouTube.v3.VideosResource.ListRequest;

namespace AutoVideoMetaLocalize.Models {
	public class AppVideoListRequest {
		//
		// Summary:
		//     The videoCategoryId parameter identifies the video category for which the chart
		//     should be retrieved. This parameter can only be used in conjunction with the
		//     chart parameter. By default, charts are not restricted to a particular category.
		public virtual string VideoCategoryId { get; set; }
		//
		// Summary:
		//     The regionCode parameter instructs the API to select a video chart available
		//     in the specified region. This parameter can only be used in conjunction with
		//     the chart parameter. The parameter value is an ISO 3166-1 alpha-2 country code.
		public virtual string RegionCode { get; set; }
		//
		// Summary:
		//     The pageToken parameter identifies a specific page in the result set that should
		//     be returned. In an API response, the nextPageToken and prevPageToken properties
		//     identify other pages that could be retrieved. Note: This parameter is supported
		//     for use in conjunction with the myRating and chart parameters, but it is not
		//     supported for use in conjunction with the id parameter.
		public virtual string PageToken { get; set; }
		//
		// Summary:
		//     Note: This parameter is intended exclusively for YouTube content partners. The
		//     onBehalfOfContentOwner parameter indicates that the request's authorization credentials
		//     identify a YouTube CMS user who is acting on behalf of the content owner specified
		//     in the parameter value. This parameter is intended for YouTube content partners
		//     that own and manage many different YouTube channels. It allows content owners
		//     to authenticate once and get access to all their video and channel data, without
		//     having to provide authentication credentials for each individual channel. The
		//     CMS account that the user authenticates with must be linked to the specified
		//     YouTube content owner.
		public virtual string OnBehalfOfContentOwner { get; set; }
		//
		// Summary:
		//     Set this parameter's value to like or dislike to instruct the API to only return
		//     videos liked or disliked by the authenticated user.
		public virtual MyRatingEnum? MyRating { get; set; }
		//
		// Summary:
		//     The maxWidth parameter specifies a maximum width of the embedded player. If maxHeight
		//     is provided, maxWidth may not be reached in order to not violate the height request.
		public virtual long? MaxWidth { get; set; }
		//
		// Summary:
		//     The maxResults parameter specifies the maximum number of items that should be
		//     returned in the result set. Note: This parameter is supported for use in conjunction
		//     with the myRating and chart parameters, but it is not supported for use in conjunction
		//     with the id parameter.
		public virtual long? MaxResults { get; set; }
		//
		// Summary:
		//     The maxHeight parameter specifies a maximum height of the embedded player. If
		//     maxWidth is provided, maxHeight may not be reached in order to not violate the
		//     width request.
		public virtual long? MaxHeight { get; set; }
		//
		// Summary:
		//     DEPRECATED
		public virtual string Locale { get; set; }
		//
		// Summary:
		//     The id parameter specifies a comma-separated list of the YouTube video ID(s)
		//     for the resource(s) that are being retrieved. In a video resource, the id property
		//     specifies the video's ID.
		public virtual string Id { get; set; }
		//
		// Summary:
		//     The hl parameter instructs the API to retrieve localized resource metadata for
		//     a specific application language that the YouTube website supports. The parameter
		//     value must be a language code included in the list returned by the i18nLanguages.list
		//     method. If localized resource details are available in that language, the resource's
		//     snippet.localized object will contain the localized values. However, if localized
		//     details are not available, the snippet.localized object will contain resource
		//     details in the resource's default language.
		public virtual string Hl { get; set; }
		//
		// Summary:
		//     The chart parameter identifies the chart that you want to retrieve.
		public virtual ChartEnum? Chart { get; set; }
		//
		// Summary:
		//     The part parameter specifies a comma-separated list of one or more video resource
		//     properties that the API response will include. If the parameter identifies a
		//     property that contains child properties, the child properties will be included
		//     in the response. For example, in a video resource, the snippet property contains
		//     the channelId, title, description, tags, and categoryId properties. As such,
		//     if you set part=snippet, the API response will contain all of those properties.
		public virtual string Part { get; set; }

		public VideosResource.ListRequest ToActualRequest(YouTubeService service) {
			VideosResource.ListRequest actual = service.Videos.List(Part);
			actual.VideoCategoryId = VideoCategoryId;
			actual.RegionCode = RegionCode;
			actual.PageToken = PageToken;
			actual.OnBehalfOfContentOwner = OnBehalfOfContentOwner;
			actual.MyRating = MyRating;
			actual.MaxWidth = MaxWidth;
			actual.MaxResults = MaxResults;
			actual.MaxHeight = MaxHeight;
			actual.Locale = Locale;
			actual.Id = Id;
			actual.Hl = Hl;
			actual.Chart = Chart;
			return actual;
		}
	}
}
