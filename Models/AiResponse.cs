using System.Text.Json.Serialization;

namespace FitLog.Models
{
    public class AiResponse
    {
        [JsonPropertyName("choices")]
        public List<AIChoice> Choices { get; set; }


    }
    public class AIChoice
    {
        [JsonPropertyName("message")]
        public AIMessage Message { get; set; }
    }
    public class AIMessage
    {

        [JsonPropertyName("role")]
        public string Role { get; set; }
        [JsonPropertyName("content")]
        public string Content { get; set; }


    }
}
