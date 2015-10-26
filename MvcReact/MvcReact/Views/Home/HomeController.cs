﻿using System.Collections.Generic;
using System.Web.Mvc;

namespace MvcReact.Views.Home
{
	public class HomeController: Controller
	{
		public static readonly IList< CommentModel > _comments;

		static HomeController()
		{
			_comments = new List< CommentModel >
			{
				new CommentModel
				{
					Author = "Daniel Lo Nigro",
					Text = "Hello ReactJS.NET World!"
				},
				new CommentModel
				{
					Author = "Pete Hunt",
					Text = "This is one comment"
				},
				new CommentModel
				{
					Author = "Jordan Walke",
					Text = "This is *another* comment"
				},
			};
		}

		public ActionResult Index()
		{
			return View( _comments );
		}

		public ActionResult Comments()
		{
			return Json( _comments, JsonRequestBehavior.AllowGet );
		}

		[ HttpPost ]
		public ActionResult AddComment( CommentModel comment )
		{
			_comments.Add( comment );
			return Content( "Success :)" );
		}
	}
}