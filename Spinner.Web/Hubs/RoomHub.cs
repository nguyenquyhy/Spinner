using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Spinner.Web.Hubs
{
    public class RoomHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task Join(string roomNumber)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomNumber);
            await Clients.OthersInGroup(roomNumber).SendAsync("Join", Context.ConnectionId);
        }

        public async Task Sync(string roomNumber, string[] options, double stableAngle)
        {
            await Clients.OthersInGroup(roomNumber).SendAsync("Sync", options, stableAngle);
        }

        public async Task SyncTo(string connectionId, string[] options, double stableAngle)
        {
            await Clients.Client(connectionId).SendAsync("Sync", options, stableAngle);
        }

        public async Task Spin(string roomNumber, double degree, double seconds)
        {
            await Clients.OthersInGroup(roomNumber).SendAsync("Spin", degree, seconds);
        }
    }
}
