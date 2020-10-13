//using AutoVideoMetaLocalize.Utilities;
//using Microsoft.AspNetCore.Mvc;
//using System;
//using System.Threading.Tasks;

//namespace AutoVideoMetaLocalize.Controllers {
//	[Route("api/[controller]")]
//	[ApiController]
//	public class TestController : ControllerBase {
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
//		public async Task<ActionResult<string>> StartMultiThreadedEndpoint() {
//			string hash = Guid.NewGuid().ToString();
//			dict[hash] = 0;

//			Task[] tasks = new Task[314];

//			for (int i = 0; i < tasks.Length; i++) {
//				tasks[i] = IncrementProgress(hash);
//			}

//			await Task.WhenAll(tasks);

//			//await Task.WhenAll(tasks);
//			return new ActionResult<string>(hash);
//		}

//		private async Task IncrementProgress(string hash) {
//			throw new Exception();
//			await Task.Delay(rand.Next(65536));
//			int val = ++dict[hash];
//			Console.WriteLine($"The value of localizationCountPtr is {val}.");
//		}
//	}
//}