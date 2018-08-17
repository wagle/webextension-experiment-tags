
const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

const TAGGING_SERVICE_ID = "@mozilla.org/browser/tagging-service;1";
const taggingSvc = Cc[TAGGING_SERVICE_ID].getService(Ci.nsITaggingService);

const IO_SERVICE_ID = '@mozilla.org/network/io-service;1';
const ioSvc = Cc[IO_SERVICE_ID].getService(Ci.nsIIOService);

ChromeUtils.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetters(this, {
    Services: "resource://gre/modules/Services.jsm",
    OS: "resource://gre/modules/osfile.jsm",
    PlacesUtils: "resource://gre/modules/PlacesUtils.jsm",
    Sqlite: "resource://gre/modules/Sqlite.jsm",
});

function makeURI(aURL, aOriginCharset, aBaseURI) {
  return ioSvc.newURI(aURL, aOriginCharset, aBaseURI);
}

this.tags = class extends ExtensionAPI {
  getAPI(context) {
    return {
      experiments: {
        tags: {
          async getURIsForTag(tag) {
            const URIs = taggingSvc.getURIsForTag(tag);
            // console.log("API getURIsForTag: ", typeof URIs, URIs.toString(), XPCNativeWrapper.unwrap(URIs));
            return XPCNativeWrapper.unwrap(URIs).map(uri => uri.spec);
          },
            async getTagsForURI(URI) {
                const tags = taggingSvc.getTagsForURI(makeURI(URI));
                // console.log("API getTagsForURI: ", typeof tags, tags.toString(), XPCNativeWrapper.unwrap(tags));
                return tags;
            },
            async getAllTags() {
                const allTags = PlacesUtils.bookmarks.fetchTags();
                console.log("API getallTags: ", typeof allTags, allTags.toString(), XPCNativeWrapper.unwrap(allTags));
                return allTags;
            },
        },
      },
    };
  }
};