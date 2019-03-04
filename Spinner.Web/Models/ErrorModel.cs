namespace Spinner.Web
{
    public class ErrorModel
    {
        public string RequestId { get; set; }
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        public ErrorModel(string requestId)
        {
            RequestId = requestId;
        }
    }
}
