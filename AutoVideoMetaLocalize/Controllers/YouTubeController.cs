using AutoVideoMetaLocalize.Utilities;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class YouTubeController : ControllerBase {
		private const string PART = "id,snippet,contentDetails";
		private readonly YouTubeService service;

		public YouTubeController(GoogleCredentialManager gcm) {
			Task<UserCredential> task = gcm.GetUserCredentials();
			task.Wait(CancellationToken.None);
			UserCredential credential = task.Result;

			service = new YouTubeService(new YouTubeService.Initializer {
				HttpClientInitializer = credential,
				ApplicationName = Assembly.GetExecutingAssembly().GetName().Name,
			});
		}

		/// <summary>
		/// Gets the uri to which to redirect the user to sign-in to.
		/// </summary>
		[HttpGet(nameof(GetMyChannels))]
		[Authorize]
		public async Task<ActionResult<IList<Channel>>> GetMyChannels() {
			List<Channel> channels = new List<Channel>();
			string pageToken = null;

			ChannelListResponse response;
			do {
				ChannelsResource.ListRequest request = service.Channels.List(PART);
				request.Mine = true;
				request.PageToken = pageToken;

				response = await request.ExecuteAsync();
				pageToken = response.NextPageToken;
				channels.AddRange(response.Items);
			} while (pageToken != null);

			return channels;
		}
	}
}