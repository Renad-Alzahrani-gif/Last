using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace SecureCommunication.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DecryptController : ControllerBase
    {
        private static readonly RSAParameters privateKey;

        static DecryptController()
        {
            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                privateKey = rsa.ExportParameters(true);
            }
        }

        [HttpPost]
        [Route("DecryptMessage")]
        public IActionResult DecryptMessage([FromBody] EncryptedMessageModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.EncryptedMessage))
            {
                return BadRequest(new { error = "Invalid input" });
            }

            string decryptedMessage = Decrypt(model.EncryptedMessage);
            return Ok(new { decryptedMessage = decryptedMessage });
        }

        private string Decrypt(string encryptedMessage)
        {
            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                rsa.ImportParameters(privateKey);
                var encryptedBytes = Convert.FromBase64String(encryptedMessage);
                var decryptedBytes = rsa.Decrypt(encryptedBytes, false);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
        }
    }

    public class EncryptedMessageModel
    {
        public string EncryptedMessage { get; set; }
    }
}
