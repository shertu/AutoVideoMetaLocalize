namespace AutoVideoMetaLocalize.Models {
	public class AppChannelListRequest {
		//
		// Summary:
		//     The part parameter specifies a comma-separated list of one or more channel resource
		//     properties that the API response will include. If the parameter identifies a
		//     property that contains child properties, the child properties will be included
		//     in the response. For example, in a channel resource, the contentDetails property
		//     contains other properties, such as the uploads properties. As such, if you set
		//     part=contentDetails, the API response will also contain all of those nested properties.
		public virtual string Part { get; set; }
		//
		// Summary:
		//     The categoryId parameter specifies a YouTube guide category, thereby requesting
		//     YouTube channels associated with that category.
		public virtual string CategoryId { get; set; }
		//
		// Summary:
		//     The forUsername parameter specifies a YouTube username, thereby requesting the
		//     channel associated with that username.
		public virtual string ForUsername { get; set; }
		//
		// Summary:
		//     The hl parameter should be used for filter out the properties that are not in
		//     the given language. Used for the brandingSettings part.
		public virtual string Hl { get; set; }
		//
		// Summary:
		//     The id parameter specifies a comma-separated list of the YouTube channel ID(s)
		//     for the resource(s) that are being retrieved. In a channel resource, the id property
		//     specifies the channel's YouTube channel ID.
		public virtual string Id { get; set; }
		//
		// Summary:
		//     Note: This parameter is intended exclusively for YouTube content partners. Set
		//     this parameter's value to true to instruct the API to only return channels managed
		//     by the content owner that the onBehalfOfContentOwner parameter specifies. The
		//     user must be authenticated as a CMS account linked to the specified content owner
		//     and onBehalfOfContentOwner must be provided.
		public virtual bool? ManagedByMe { get; set; }
		//
		// Summary:
		//     The maxResults parameter specifies the maximum number of items that should be
		//     returned in the result set.
		public virtual long? MaxResults { get; set; }
		//
		// Summary:
		//     Set this parameter's value to true to instruct the API to only return channels
		//     owned by the authenticated user.
		public virtual bool? Mine { get; set; }
		//
		// Summary:
		//     Use the subscriptions.list method and its mySubscribers parameter to retrieve
		//     a list of subscribers to the authenticated user's channel.
		public virtual bool? MySubscribers { get; set; }
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
		//     The pageToken parameter identifies a specific page in the result set that should
		//     be returned. In an API response, the nextPageToken and prevPageToken properties
		//     identify other pages that could be retrieved.
		public virtual string PageToken { get; set; }
	}
}
