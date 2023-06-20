namespace API.Helpers
{
    // This class is used to pass pagination parameters to the API
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1; // default to 1
        private int _pageSize = 10; // default to 10

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

    }
}