using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcReact.Views.Home;

namespace MvcReact.Views.Test
{
    public class TestController : Controller
    {
		public ActionResult Index()
		{
			return View( HomeController._comments );
		}
    }
}
