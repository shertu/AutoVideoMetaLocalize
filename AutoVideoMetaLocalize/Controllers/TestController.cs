//using AutoVideoMetaLocalize.Utilities;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using System;
//using System.Threading.Tasks;

//namespace AutoVideoMetaLocalize.Controllers {
//	[Route("api/[controller]")]
//	[ApiController]
//	public class TestController : ControllerBase {
//		private const string SESSION_KEY_TEST_PROGRESS = "SESSION_KEY_TEST_PROGRESS";

//		private static readonly Random rand = new Random();
//		private readonly IntegerStore dict;

//		public TestController(IntegerStore dict) {
//			this.dict = dict;
//		}

//		[HttpGet("Count")]
//		public ActionResult<int> GetProgress(string hash) {
//			return dict[hash];
//		}

//		[HttpGet("Start")]
//		public ActionResult<string> StartMultiThreadedEndpoint() {
//			string hash = Guid.NewGuid().ToString();
//			dict[hash] = 0;

//			Task[] tasks = new Task[314];

//			for (int i = 0; i < tasks.Length; i++) {
//				tasks[i] = IncrementProgress(hash);
//			}

//			_ = Task.WhenAll(tasks);
//			//await Task.WhenAll(tasks);
//			return new ActionResult<string>(hash);
//		}

//		private async Task IncrementProgress(string hash) {
//			await Task.Delay(rand.Next(65536));
//			int val = ++dict[hash];
//			Console.WriteLine($"The value of localizationCountPtr is {val}.");
//		}
//	}
//}