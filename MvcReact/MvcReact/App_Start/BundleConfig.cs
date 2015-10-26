using System.Collections.Generic;
using System.Web.Hosting;
using System.Web.Optimization;

namespace MvcReact
{
	public class BundleConfig
	{
		// For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
		public static void RegisterBundles( BundleCollection bundles )
		{
			var asIsOrderer = new AsIsOrderer();

			var lib = new ScriptBundle( "~/bundles/lib" ).Include(
				"~/Scripts/bundles/vendor.js"
				);
			lib.Orderer = asIsOrderer;
			bundles.Add( lib );

			// Forces files to be combined and minified in debug mode
			// Only used here to demonstrate how combination/minification works
			// Normally you would use unminified versions in debug mode.
			//			BundleTable.EnableOptimizations = true;
		}
	}

	public sealed class AsIsOrderer: IBundleOrderer
	{
		public IEnumerable< VirtualFile > OrderFiles( BundleContext context, IEnumerable< VirtualFile > files )
		{
			return files;
		}

		public IEnumerable< BundleFile > OrderFiles( BundleContext context, IEnumerable< BundleFile > files )
		{
			return files;
		}
	}
}