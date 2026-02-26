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

           var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");

            requestMessage.Headers.Add("Authorization", $"Bearer {apiKey}");
            requestMessage.Headers.Add("HTTP-Refer", "http://localhost");
            requestMessage.Headers.Add("X-Title","FitLog");

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy= JsonNamingPolicy.CamelCase
            };

            requestMessage.Content = new StringContent(JsonSerializer.Serialize(request,jsonOptions), Encoding.UTF8, "application/json");
            

            var response = await _http.SendAsync(requestMessage);
            var json = await response.Content.ReadAsStringAsync();

            Console.WriteLine("RAW OPENAI RESPONSE: ");
            Console.WriteLine(json);

            var aiRes = JsonSerializer.Deserialize<AiResponse>(json);
            var text = aiRes?.Choices?.FirstOrDefault()?.Message?.Content ?? "AI error";

            return Ok(new {reply = text});

        }
    }
}
