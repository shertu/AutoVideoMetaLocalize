using AutoVideoMetaLocalize.Utilities;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Reflection;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace AutoVideoMetaLocalize.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class YouTubeController : ControllerBase {
		private readonly GoogleAuthorizationCodeFlow _flow;

		public YouTubeController(GoogleAuthorizationCodeFlow flow) {
			_flow = flow;
		}

		/// <summary>
		/// Gets the uri to which to redirect the user to sign-in to.
		/// </summary>
		[HttpGet(nameof(InstantiateService))]
		[Authorize]
		public async Task<ActionResult<IEnumerable<Channel>>> InstantiateService() {
			string userTokenKey = User.FindFirstValue(AdditionalClaimTypes.TokenResponseKey);
			TokenResponse token = await _flow.LoadTokenAsync(userTokenKey, CancellationToken.None);
			UserCredential credential = new UserCredential(_flow, userTokenKey, token);

			YouTubeService service = new YouTubeService(new YouTubeService.Initializer {
				HttpClientInitializer = credential,
				ApplicationName = Assembly.GetExecutingAssembly().GetName().Name,
			});

			ChannelsResource.ListRequest request = service.Channels.List("snippet,contentDetails,statistics");
			request.Mine = true;

			ChannelListResponse res = await request.ExecuteAsync();
			IList<Channel> items = res.Items;

			return Ok(items);
		}
	}
}