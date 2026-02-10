using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace FitLog.Controllers

{
    [ApiController]
    [Route("api/ai")]

    public class AIController : ControllerBase
    {
       private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public AIController(IConfiguration config, HttpClient http)
        {
            _config = config;
            _http = new HttpClient();
        }
        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] object body)
        {
            var apiKey = _config["OpenAI:ApiKey"];
            var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");

            req.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer",apiKey);
            req.Content = new StringContent(body.ToString(), Encoding.UTF8, "application/json");

            var res = await _http.SendAsync(req);
            var json = await res.Content.ReadAsStringAsync();

            return Content(json, "application/json");
        }
    }
}
