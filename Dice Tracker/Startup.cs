using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Dice_Tracker.Startup))]
namespace Dice_Tracker
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
