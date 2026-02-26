using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace FitLog.Models
{
    public class AiRequest {
        [JsonPropertyName("model")]
    public string Model { get; set; }
        [JsonPropertyName("messages")]
        public List<MessageDto> Messages { get; set; }
    
    }
        
    public class MessageDto
    {
        [JsonPropertyName("role")]
        public string Role { get; set; }
        [JsonPropertyName("content")]
        public string Content { get; set; }


    }



}
