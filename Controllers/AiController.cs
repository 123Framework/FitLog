using FitLog.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace FitLog.Controllers

{
    [ApiController]
    [Route("api/ai")]

    public class AiController : ControllerBase
    {
       private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public AiController(IConfiguration config)
        {
            _config = config;
            _http =  new HttpClient();
        }
        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] AiRequest request)
        {
            var apiKey = _config["OpenAI:ApiKey"];

            if (apiKey == null)
                return StatusCode(500, "Missing OpenAI API key");

            var payload = JsonSerializer.Serialize(new
            {
                model = request.Model,
                messages = request.Messages
            });

            var http = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            http.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
            http.Content = new StringContent(payload, Encoding.UTF8, "application/json");

            var response = await _http.SendAsync(http);
            var json = await response.Content.ReadAsStringAsync();

            return Content(json, "application/json");
        }
    }
}
