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

        public AiController(IConfiguration config, HttpClient http)
        {
            _config = config;
          //  _http =  new HttpClient();
          _http = http;
        }
        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] AiRequest request)
        {
            var apiKey = _config["OpenAI:ApiKey"];

            if (apiKey == null)
                return StatusCode(500, "Missing OpenAI API key");

            var http = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");

            http.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
            
            http.Content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            

            var response = await _http.SendAsync(http);
            var json = await response.Content.ReadAsStringAsync();

            var aiRes = JsonSerializer.Deserialize<AiResponse>(json);
            var text = aiRes?.Choices?.FirstOrDefault()?.Message?.Content ?? "AI error";

            return Ok(new {reply = text});

        }
    }
}
