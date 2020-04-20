using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace AutoVideoMetaLocalize.Models {
	[Serializable]
	public class GoogleProfile {

		//[JsonProperty("id_token")]
		public string sub { get; set; }
		public string name { get; set; }
		public string given_name { get; set; }
		public string family_name { get; set; }
		public string picture { get; set; }
		public string email { get; set; }
		public bool? email_verified { get; set; }
		public string locale { get; set; }

		public IEnumerable<Claim> ToClaims() {
			return new Claim[] {
				new Claim(ClaimTypes.NameIdentifier, sub),
				new Claim(ClaimTypes.Name, name),
				new Claim(ClaimTypes.Email, email),
			};
		}
	}
}
